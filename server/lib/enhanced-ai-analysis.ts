/**
 * Enhanced AI analysis service with Google Search integration
 * Provides richer and more accurate AI analysis for system registration
 */

import { callDeepSeekApi } from '../ai-analysis';
import { fetchOpenAI, fetchGemini } from '../ai-services';
import { searchGoogleApi } from '../ai-analysis';
import { AppError, AIModelError, RateLimitError } from '../error-handling';

type AIModel = 'deepseek' | 'openai' | 'gemini';

export interface WebSearchResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
}

export interface EnhancedAIAnalysisResult {
  results: any;
  webSearchUsed: boolean;
  sources: {
    title: string;
    url: string;
  }[];
  confidence: number;
  modelUsed: string;
}

export interface AIModelResult {
  text: string;
  model: AIModel;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  responseTime?: number;
}

/**
 * Combine results from multiple AI models with Google Search integration
 * Jack said: "Always search the web before using AI models to get the latest information"
 */
export async function enhancedAIAnalysis(
  prompt: string,
  systemName: string = "AI System"
): Promise<EnhancedAIAnalysisResult> {
  console.log(`Running enhanced AI analysis for ${systemName}`);
  
  let webSearchUsed = false;
  let webSearchResults: WebSearchResult[] = [];
  let sources: { title: string; url: string }[] = [];
  
  try {
    // Step 1: Try to get relevant information from Google Search
    // This helps with the latest EU AI Act updates that might not be in AI model training
    const searchQuery = `${systemName} AI system European Union AI Act requirements compliance GDPR`;
    webSearchResults = await enhancedWebSearch(searchQuery);
    
    if (webSearchResults && webSearchResults.length > 0) {
      webSearchUsed = true;
      console.log(`Found ${webSearchResults.length} web search results for ${systemName}`);
      
      // Extract sources for citation
      sources = webSearchResults.map(result => ({
        title: result.title,
        url: result.link
      }));
      
      // Augment the prompt with web search results
      const webSearchContext = webSearchResults
        .map(result => `Source: ${result.title}\nURL: ${result.link}\n${result.snippet}`)
        .join('\n\n');
      
      prompt = `I need you to analyze an AI system for EU AI Act compliance. Here's some recent information from reliable sources to help with your analysis:

${webSearchContext}

Now, based on this information and your knowledge, ${prompt}`;
    } else {
      console.log('No web search results found, proceeding with base knowledge');
    }
  } catch (error: any) {
    console.warn('Web search failed, continuing with base analysis:', error.message);
    // We'll continue even if web search fails
  }
  
  // Step 2: Try multiple AI models in sequence until we get a valid response
  let modelResponses: AIModelResult[] = [];
  let finalResponse: string = '';
  let modelUsed: string = '';
  
  // Try DeepSeek first (our primary model)
  try {
    console.log('Attempting DeepSeek analysis...');
    const deepseekResponse = await callDeepSeekApi(prompt);
    if (deepseekResponse) {
      modelResponses.push({
        text: deepseekResponse,
        model: 'deepseek'
      });
      console.log('DeepSeek analysis successful');
    }
  } catch (error: any) {
    console.warn('DeepSeek analysis failed:', error.message);
    // Continue to next model
  }
  
  // Try OpenAI as backup
  if (modelResponses.length === 0 || !modelResponses[0].text) {
    try {
      console.log('Attempting OpenAI analysis...');
      const openaiResponse = await fetchOpenAI(prompt);
      if (openaiResponse) {
        modelResponses.push({
          text: openaiResponse,
          model: 'openai'
        });
        console.log('OpenAI analysis successful');
      }
    } catch (error: any) {
      console.warn('OpenAI analysis failed:', error.message);
      // Continue to next model
    }
  }
  
  // Try Gemini as last resort
  if (modelResponses.length === 0 || !modelResponses[0].text) {
    try {
      console.log('Attempting Gemini analysis...');
      const geminiResponse = await fetchGemini(prompt);
      if (geminiResponse) {
        modelResponses.push({
          text: geminiResponse,
          model: 'gemini'
        });
        console.log('Gemini analysis successful');
      }
    } catch (error: any) {
      console.warn('Gemini analysis failed:', error.message);
    }
  }
  
  // Step 3: Process responses
  if (modelResponses.length === 0) {
    throw new AIModelError('All AI models failed to provide a response');
  }
  
  // Use the first successful response
  finalResponse = modelResponses[0].text;
  modelUsed = modelResponses[0].model;
  
  // Step 4: Extract structured content
  const results = extractStructuredContent(finalResponse);
  
  // Step 5: Calculate confidence score
  const confidence = calculateOverallConfidence(results);
  
  return {
    results,
    webSearchUsed,
    sources,
    confidence,
    modelUsed
  };
}

/**
 * Enhanced web search with smart query processing
 * Jack said: "Properly handle rate limits and timeouts with fallbacks"
 */
export async function enhancedWebSearch(query: string, maxRetries = 2): Promise<WebSearchResult[]> {
  let attempts = 0;
  let lastError: Error | null = null;
  
  while (attempts < maxRetries) {
    try {
      const results = await searchGoogleApi(query);
      
      // Process the results into a standardized format
      if (results && typeof results === 'string') {
        return parseSearchResults(results);
      } else if (Array.isArray(results)) {
        return results.map(result => ({
          title: result.title || '',
          link: result.link || '',
          snippet: result.snippet || '',
          source: 'Google'
        }));
      } else {
        return [];
      }
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.message && error.message.includes('rate limit')) {
        console.warn(`Search rate limited (attempt ${attempts + 1}/${maxRetries}), waiting before retry...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempts + 1))); // Exponential backoff
      } else {
        // For other errors, we'll try again but with less delay
        console.warn(`Search failed (attempt ${attempts + 1}/${maxRetries}):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      attempts++;
    }
  }
  
  console.warn('Web search failed after maximum retries');
  
  // If we've exhausted retries, throw the last error
  if (lastError) {
    // But don't throw rate limit errors, just return empty results
    if (lastError.message && lastError.message.includes('rate limit')) {
      console.error('Search rate limit exceeded, proceeding with empty results');
      return [];
    }
    throw lastError;
  }
  
  return [];
}

/**
 * Parse search results text into structured format
 */
function parseSearchResults(resultsText: string): WebSearchResult[] {
  if (!resultsText) return [];
  
  try {
    // Try to parse as JSON first
    try {
      const jsonResults = JSON.parse(resultsText);
      if (Array.isArray(jsonResults)) {
        return jsonResults.map(item => ({
          title: item.title || '',
          link: item.link || '',
          snippet: item.snippet || '',
          source: 'Google'
        }));
      }
    } catch (jsonError) {
      // Not valid JSON, continue with text parsing
    }
    
    // Split by lines and extract information
    const results: WebSearchResult[] = [];
    const lines = resultsText.split('\n');
    
    let currentResult: Partial<WebSearchResult> = {};
    
    for (const line of lines) {
      if (line.startsWith('Title:')) {
        // Start a new result if we have a previous one
        if (currentResult.title) {
          results.push(currentResult as WebSearchResult);
          currentResult = {};
        }
        currentResult.title = line.substring('Title:'.length).trim();
      } else if (line.startsWith('Link:')) {
        currentResult.link = line.substring('Link:'.length).trim();
      } else if (line.startsWith('Snippet:')) {
        currentResult.snippet = line.substring('Snippet:'.length).trim();
        currentResult.source = 'Google';
        
        // Add the result and reset
        if (currentResult.title && currentResult.link) {
          results.push(currentResult as WebSearchResult);
          currentResult = {};
        }
      }
    }
    
    // Add the last result if it wasn't added
    if (currentResult.title && currentResult.link) {
      results.push(currentResult as WebSearchResult);
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing search results:', error);
    return [];
  }
}

/**
 * Extract structured content from unstructured AI response
 * Jack said: "When parsing fails but we got a response, extract data from text"
 */
function extractStructuredContent(text: string): any {
  if (!text) return {};
  
  try {
    // First attempt: try to parse as JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (typeof parsed === 'object' && parsed !== null) {
          console.log('Successfully parsed AI response as JSON');
          return parsed;
        }
      } catch (jsonError) {
        console.warn('JSON parse failed, trying alternative extraction methods');
      }
    }
    
    // Second attempt: Extract field by field with regexp patterns
    const result: Record<string, any> = {};
    const fields = [
      'name', 'vendor', 'version', 'department', 'purpose', 
      'aiCapabilities', 'trainingDatasets', 'implementationDate', 
      'outputTypes', 'usageContext', 'potentialImpact', 'riskLevel',
      'specificRisks', 'euAiActArticles', 'dataPrivacyMeasures', 
      'humanOversightMeasures'
    ];
    
    for (const field of fields) {
      // Look for patterns like "field": { "value": "..." }
      const fieldObjectPattern = new RegExp(`"${field}"\\s*:\\s*\\{([^\\}]+)\\}`, 'i');
      const fieldObjectMatch = text.match(fieldObjectPattern);
      
      if (fieldObjectMatch && fieldObjectMatch[1]) {
        const valueMatch = fieldObjectMatch[1].match(/"value"\s*:\s*"([^"]+)"/);
        const confidenceMatch = fieldObjectMatch[1].match(/"confidence"\s*:\s*(\d+)/);
        const justificationMatch = fieldObjectMatch[1].match(/"justification"\s*:\s*"([^"]+)"/);
        
        result[field] = {
          value: valueMatch?.[1] || '',
          confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 50,
          justification: justificationMatch?.[1] || ''
        };
        continue;
      }
      
      // Simpler pattern: "field": "value"
      const simplePattern = new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`, 'i');
      const simpleMatch = text.match(simplePattern);
      
      if (simpleMatch && simpleMatch[1]) {
        result[field] = {
          value: simpleMatch[1],
          confidence: 60,
          justification: `Extracted from model response for ${field}`
        };
        continue;
      }
      
      // Look for patterns like field: value
      const colonPattern = new RegExp(`${field}\\s*:\\s*([^\\n,]+)`, 'i');
      const colonMatch = text.match(colonPattern);
      
      if (colonMatch && colonMatch[1]) {
        result[field] = {
          value: colonMatch[1].trim(),
          confidence: 50,
          justification: `Extracted using colonPattern for ${field}`
        };
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error extracting structured content:', error);
    return {};
  }
}

/**
 * Calculate overall confidence score of AI analysis
 */
function calculateOverallConfidence(results: any): number {
  if (!results || typeof results !== 'object') return 0;
  
  // Get all fields with confidence scores
  const confidenceScores: number[] = [];
  
  Object.values(results).forEach((field: any) => {
    if (field && typeof field === 'object' && typeof field.confidence === 'number') {
      confidenceScores.push(field.confidence);
    }
  });
  
  if (confidenceScores.length === 0) return 50; // Default confidence
  
  // Calculate average confidence score
  const sum = confidenceScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / confidenceScores.length);
}

/**
 * Intelligent risk assessment based on EU AI Act guidelines
 * Jack said: "Risk assessment must follow EU AI Act regulations exactly"
 */
export function smartRiskAnalysis(systemData: any): any {
  if (!systemData) return null;
  
  // Combine all text fields for analysis
  const allText = [
    systemData.name,
    systemData.purpose,
    systemData.description,
    systemData.aiCapabilities,
    systemData.trainingDatasets,
    systemData.usageContext,
    systemData.potentialImpact,
    systemData.specificRisks
  ]
    .filter(text => text)
    .join(' ')
    .toLowerCase();
  
  // Define prohibited use cases (Article 5)
  const prohibited = [
    'social scoring',
    'social credit',
    'mass surveillance',
    'public space biometric identification',
    'emotion recognition used for law enforcement',
    'biometric categorization using sensitive traits',
    'manipulative ai',
    'exploit vulnerabilities',
    'manipulative techniques',
    'citizen scoring'
  ];
  
  // Define high-risk categories (Annex III)
  const highRisk = [
    'biometric identification',
    'critical infrastructure',
    'education',
    'employment',
    'worker management',
    'access to employment',
    'essential services',
    'law enforcement',
    'migration',
    'asylum',
    'border control',
    'administration of justice',
    'democratic processes',
    'voting',
    'medical device',
    'health',
    'healthcare',
    'medicine',
    'diagnosis',
    'diagnostic',
    'patient',
    'clinical',
    'hospital',
    'facial recognition',
    'biometric',
    'safety component'
  ];
  
  // Define limited-risk categories
  const limitedRisk = [
    'chatbot',
    'virtual assistant',
    'emotion recognition',
    'biometric categorization',
    'deep fake',
    'synthetic content',
    'ai-generated content'
  ];
  
  // Check for prohibited use cases
  for (const term of prohibited) {
    if (allText.includes(term)) {
      return {
        riskLevel: 'Unacceptable Risk',
        confidence: 90,
        justification: generateRiskJustification('unacceptable', term, systemData),
        relevantArticles: getRelevantArticles('unacceptable')
      };
    }
  }
  
  // Check for high-risk categories
  for (const term of highRisk) {
    if (allText.includes(term)) {
      return {
        riskLevel: 'High Risk',
        confidence: 85,
        justification: generateRiskJustification('high', term, systemData),
        relevantArticles: getRelevantArticles('high')
      };
    }
  }
  
  // Check for limited-risk categories
  for (const term of limitedRisk) {
    if (allText.includes(term)) {
      return {
        riskLevel: 'Limited Risk',
        confidence: 80,
        justification: generateRiskJustification('limited', term, systemData),
        relevantArticles: getRelevantArticles('limited')
      };
    }
  }
  
  // Default to minimal risk
  return {
    riskLevel: 'Minimal Risk',
    confidence: 70,
    justification: generateRiskJustification('minimal', '', systemData),
    relevantArticles: getRelevantArticles('minimal')
  };
}

/**
 * Generate justification for risk classification
 */
function generateRiskJustification(riskLevel: string, text: string, systemData: any): string {
  const justificationTemplates = {
    unacceptable: `This system is classified as Unacceptable Risk because it involves "${text}", which falls under Article 5 of the EU AI Act as a prohibited practice. These applications are considered to present unacceptable risks to fundamental rights.`,
    
    high: `This system is classified as High Risk because it relates to "${text}", which falls under Annex III of the EU AI Act as a high-risk application area. This classification requires compliance with stringent requirements including risk management, data governance, technical documentation, transparency, human oversight, and accuracy.`,
    
    limited: `This system is classified as Limited Risk because it involves "${text}", which falls under transparency obligations in the EU AI Act. These systems must clearly disclose to users that they are interacting with AI and must be labeled accordingly.`,
    
    minimal: `This system is classified as Minimal Risk as it does not appear to fall under prohibited, high-risk, or specific transparency requirements categories of the EU AI Act. Minimal risk systems are subject to voluntary codes of conduct.`
  };
  
  return justificationTemplates[riskLevel as keyof typeof justificationTemplates];
}

/**
 * Get relevant EU AI Act articles based on risk level
 */
function getRelevantArticles(riskLevel: string): any[] {
  const articlesByRisk = {
    unacceptable: [
      { id: 5, title: "Prohibited Artificial Intelligence Practices" }
    ],
    
    high: [
      { id: 6, title: "Classification Rules for High-Risk AI Systems" },
      { id: 8, title: "Compliance with Requirements for High-Risk AI Systems" },
      { id: 9, title: "Risk Management System" },
      { id: 10, title: "Data and Data Governance" },
      { id: 11, title: "Technical Documentation" },
      { id: 14, title: "Transparency and Provision of Information to Users" },
      { id: 15, title: "Human Oversight" }
    ],
    
    limited: [
      { id: 52, title: "Transparency Obligations" }
    ],
    
    minimal: [
      { id: 69, title: "Codes of Conduct" }
    ]
  };
  
  return articlesByRisk[riskLevel as keyof typeof articlesByRisk] || [];
}

/**
 * Mask API key for logging purposes
 */
function maskApiKey(key: string): string {
  if (!key) return 'undefined';
  if (key.length < 8) return '*'.repeat(key.length);
  return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
}