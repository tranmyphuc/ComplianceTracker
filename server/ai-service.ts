
/**
 * AI Service - Centralized integration with AI providers
 * 
 * This service abstracts all interactions with AI models and provides
 * standardized error handling and fallback mechanisms.
 */

import fetch from 'node-fetch';
import { AIModelError, ExternalServiceError } from './error-handling';

// Environment variable configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Model configuration
export enum AIModel {
  DEEPSEEK = 'deepseek',
  GEMINI = 'gemini',
  OPENAI = 'openai'
}

export interface AIRequest {
  prompt: string;
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  contextType?: string;
  systemPrompt?: string;
}

export interface AIResponse {
  text: string;
  model: AIModel;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

// Default configurations for different model types
const modelDefaults = {
  [AIModel.DEEPSEEK]: {
    temperature: 0.2,
    maxTokens: 1000,
    endpointUrl: 'https://api.deepseek.com/v1/chat/completions'
  },
  [AIModel.GEMINI]: {
    temperature: 0.3,
    maxTokens: 1000,
    endpointUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  },
  [AIModel.OPENAI]: {
    temperature: 0.1,
    maxTokens: 1000,
    endpointUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4'
  }
};

/**
 * Call an AI model with error handling and automatic fallback
 */
export async function callAI(request: AIRequest): Promise<AIResponse> {
  const { prompt, model = AIModel.DEEPSEEK, temperature, maxTokens, contextType, systemPrompt } = request;
  
  // Try primary model
  try {
    return await callSpecificModel(prompt, model, temperature, maxTokens, contextType, systemPrompt);
  } catch (error) {
    console.error(`Error calling ${model}:`, error);
    
    // Fallback chain
    if (model === AIModel.DEEPSEEK) {
      console.log('Attempting Gemini API as fallback...');
      try {
        return await callSpecificModel(prompt, AIModel.GEMINI, temperature, maxTokens, contextType, systemPrompt);
      } catch (geminiError) {
        console.error('Error calling Gemini API:', geminiError);
        
        // Last resort: OpenAI
        console.log('Attempting OpenAI API as final fallback...');
        return await callSpecificModel(prompt, AIModel.OPENAI, temperature, maxTokens, contextType, systemPrompt);
      }
    } else if (model === AIModel.GEMINI) {
      console.log('Attempting OpenAI API as fallback...');
      return await callSpecificModel(prompt, AIModel.OPENAI, temperature, maxTokens, contextType, systemPrompt);
    } else {
      // If we're already at OpenAI and it failed, throw the error
      throw new AIModelError('All AI models failed', { originalError: error });
    }
  }
}

/**
 * Call a specific AI model
 */
async function callSpecificModel(
  prompt: string,
  model: AIModel,
  temperature?: number,
  maxTokens?: number,
  contextType?: string,
  systemPrompt?: string
): Promise<AIResponse> {
  const defaults = modelDefaults[model];
  
  if (model === AIModel.DEEPSEEK) {
    return callDeepSeek(prompt, temperature || defaults.temperature, maxTokens || defaults.maxTokens, contextType, systemPrompt);
  } else if (model === AIModel.GEMINI) {
    return callGemini(prompt, temperature || defaults.temperature, maxTokens || defaults.maxTokens, contextType);
  } else {
    return callOpenAI(prompt, temperature || defaults.temperature, maxTokens || defaults.maxTokens, systemPrompt);
  }
}

/**
 * Call DeepSeek API
 */
async function callDeepSeek(
  prompt: string,
  temperature: number,
  maxTokens: number,
  contextType?: string,
  systemPrompt?: string
): Promise<AIResponse> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    console.log('Calling DeepSeek API with prompt: \n', prompt);
    
    const systemMessage = systemPrompt || "You are an EU AI Act compliance expert that provides accurate, regulatory-focused guidance.";
    
    const response = await fetch(modelDefaults[AIModel.DEEPSEEK].endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new ExternalServiceError('DeepSeek API', errorData);
    }

    const data = await response.json();
    
    return {
      text: data.choices[0].message.content,
      model: AIModel.DEEPSEEK,
      tokens: {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens
      }
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new AIModelError('DeepSeek API timeout', { modelName: 'deepseek' });
    }
    
    throw error;
  }
}

/**
 * Call Gemini API
 */
async function callGemini(
  prompt: string,
  temperature: number,
  maxTokens: number,
  contextType?: string
): Promise<AIResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  console.log('Calling Gemini API with prompt');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(
      `${modelDefaults[AIModel.GEMINI].endpointUrl}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: temperature,
            maxOutputTokens: maxTokens,
            topP: 0.9,
            topK: 40
          }
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new ExternalServiceError('Gemini API', errorData);
    }

    const data = await response.json();
    
    // Extract the response text
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Approximate token counts since Gemini doesn't return them
    const approximateTokens = {
      prompt: Math.ceil(prompt.length / 4),
      completion: Math.ceil(responseText.length / 4),
      total: Math.ceil((prompt.length + responseText.length) / 4)
    };
    
    return {
      text: responseText,
      model: AIModel.GEMINI,
      tokens: approximateTokens
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new AIModelError('Gemini API timeout', { modelName: 'gemini' });
    }
    
    throw error;
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  prompt: string,
  temperature: number,
  maxTokens: number,
  systemPrompt?: string
): Promise<AIResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Calling OpenAI API as final fallback');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const systemMessage = systemPrompt || "You are an EU AI Act compliance expert that provides accurate, regulatory-focused guidance.";
    
    const response = await fetch(modelDefaults[AIModel.OPENAI].endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: modelDefaults[AIModel.OPENAI].model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new ExternalServiceError('OpenAI API', errorData);
    }

    const data = await response.json();
    
    return {
      text: data.choices[0].message.content,
      model: AIModel.OPENAI,
      tokens: {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens
      }
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new AIModelError('OpenAI API timeout', { modelName: 'openai' });
    }
    
    throw error;
  }
}

// Utility function to safely parse JSON from AI responses
export function safeJsonParse(jsonString: string): any {
  try {
    // Clean up the response to handle markdown formatting
    let cleanedResponse = jsonString;
    
    // Remove markdown code blocks if present
    if (cleanedResponse.includes('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/\s*```\s*$/, '');
    } else if (cleanedResponse.includes('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/\s*```\s*$/, '');
    }
    
    // Try to find JSON within the text if it's still not valid
    if (cleanedResponse.includes('{') && cleanedResponse.includes('}')) {
      const jsonStartIndex = cleanedResponse.indexOf('{');
      const jsonEndIndex = cleanedResponse.lastIndexOf('}') + 1;
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        cleanedResponse = cleanedResponse.substring(jsonStartIndex, jsonEndIndex);
      }
    }
    
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Error parsing JSON from AI response:', error);
    throw new AIModelError('Failed to parse AI response as JSON', { 
      jsonString,
      parseError: error.message
    });
  }
}

// Export utility functions for specific AI tasks
export async function generateSystemSuggestion(name: string, description?: string, documentType?: string): Promise<any> {
  // Enhanced prompt with document type awareness and better field mapping
  const prompt = `
    You are an EU AI Act compliance expert. Based on the following information about an AI system,
    generate comprehensive suggestions for all registration fields.

    ${name ? `System Name: ${name}` : ''}
    ${description ? `Description: ${description}` : ''}
    ${documentType ? `Document Type: ${documentType}` : ''}

    IMPORTANT: Accurately identify the system based on the keywords in the name and description.
    Analyze the content deeply to extract as much relevant information as possible.

    Identify the specific AI system that best matches the provided name/description. 
    Do not default to generic systems unless absolutely necessary.

    For each field, provide a confidence level (LOW, MEDIUM, HIGH) indicating how certain you are about the extracted information.

    Provide suggestions for the following fields:
    - name (keep the original name if provided, otherwise suggest an appropriate name)
    - vendor (the company that develops this specific AI system)
    - version (suggest a realistic version number)
    - department (where this system would typically be used)
    - purpose (detailed purpose of the system)
    - aiCapabilities (technical capabilities like NLP, Computer Vision, etc.)
    - trainingDatasets (types of data used to train this system)
    - implementationDate (when this system was or will be implemented)
    - outputTypes (what outputs this system produces)
    - usageContext (where and how this system is used)
    - potentialImpact (potential impacts on individuals and society)
    - riskLevel (according to EU AI Act: Unacceptable, High, Limited, Minimal)
    - specificRisks (list of specific risks identified)
    - euAiActArticles (relevant EU AI Act articles that apply to this system)
    - dataPrivacyMeasures (measures in place for data privacy)
    - humanOversightMeasures (measures for human oversight)

    For each field, give a confidence score from 0-100 and justify your assessment.
    
    Output your answer in JSON format with these fields:
    {
      "name": { "value": "string", "confidence": number, "justification": "string" },
      "vendor": { "value": "string", "confidence": number, "justification": "string" },
      ... (same format for all fields)
      "overallConfidenceScore": number
    }
  `;

  const response = await callAI({
    prompt,
    model: AIModel.DEEPSEEK,
    temperature: 0.2
  });

  return safeJsonParse(response.text);
}

// The processDocumentWithOCR function is implemented later in this file

export async function analyzeRiskParameters(system: any): Promise<any> {
  const prompt = `
    Perform a detailed EU AI Act compliance risk assessment for the following AI system:
    System Name: ${system.name}
    Description: ${system.description || 'Not provided'}
    Department: ${system.department || 'Not provided'}
    Purpose: ${system.purpose || 'Not provided'}
    Version: ${system.version || 'Not provided'}
    Vendor: ${system.vendor || 'Not provided'}
    AI Capabilities: ${system.aiCapabilities || 'Not provided'}
    Initial Risk Classification: ${system.riskClassification || 'Not determined'}
    System Category: ${system.systemCategory || 'Not categorized'}
    
    Using the OFFICIAL EU AI Act assessment framework, analyze the following key risk parameters:
    
    1. Technical Robustness and Safety (Article 15)
       - Accuracy, reliability, and cybersecurity measures
       - Resilience to errors, faults, and inconsistencies
    
    2. Data and Data Governance (Article 10)
       - Training data quality, relevance, and representativeness
       - Data privacy compliance and data minimization
    
    3. Transparency (Article 13)
       - Documentation of system capabilities and limitations
       - Disclosure to users that they are interacting with AI
    
    4. Human Oversight (Article 14)
       - Measures allowing for human intervention
       - Ability to override system decisions
    
    5. Accountability (Article 16-20)
       - Risk management procedures
       - Record-keeping and documentation compliance
    
    6. Non-discrimination and Fairness
       - Measures to prevent unfair bias in system outputs
       - Impacts on vulnerable groups or protected characteristics
    
    Format your response as a JSON with the following structure:
    {
      "riskFactors": [
        {
          "name": "Parameter name based on EU AI Act articles",
          "score": numerical score from 0-100 representing compliance,
          "euAiActArticle": "Specific article number from EU AI Act",
          "description": "Detailed assessment based on EU AI Act requirements"
        }
      ],
      "specificConcerns": [
        "Specific concern tied to EU AI Act article requirements",
        "Another specific concern with article reference"
      ],
      "mitigationStrategies": [
        "Specific mitigation strategy that directly addresses EU AI Act requirements",
        "Another mitigation strategy with clear compliance benefits"
      ]
    }
    
    Use ONLY actual EU AI Act requirements for assessment, not generic considerations.
    Each risk factor MUST reference specific EU AI Act articles where applicable.
  `;

  const response = await callAI({
    prompt,
    model: AIModel.DEEPSEEK,
    temperature: 0.1
  });

  return safeJsonParse(response.text);
}

/**
 * Process document text with enhanced OCR capabilities
 * This function extracts structured information from documents using AI
 */
export async function processDocumentWithOCR(fileContent: string, fileName: string, fileType: string): Promise<any> {
  console.log(`Processing document: ${fileName} (${fileType}) with enhanced OCR capabilities`);
  
  // Create a more specialized prompt based on document type
  let documentTypePrompt = '';
  if (fileType === 'pdf') {
    documentTypePrompt = 'This appears to be a PDF document, likely containing formatted text, tables and potentially images.';
  } else if (['docx', 'doc'].includes(fileType)) {
    documentTypePrompt = 'This appears to be a Word document, likely containing formatted text and potentially tables or diagrams.';
  } else if (fileType === 'txt') {
    documentTypePrompt = 'This appears to be a plain text document with unformatted content.';
  } else {
    documentTypePrompt = 'This appears to be a document with unknown format.';
  }
  
  // Enhanced OCR prompt with confidence scoring
  const prompt = `
    You are an advanced document analysis system with OCR capabilities specialized in extracting AI system information.
    
    ${documentTypePrompt}
    
    Analyze the following document content and extract all possible information about the AI system described:
    
    DOCUMENT CONTENT:
    ${fileContent.substring(0, 8000)} 
    
    DOCUMENT NAME: ${fileName}
    
    For each extracted field, provide:
    1. The extracted value
    2. A confidence score (0-100)
    3. A short justification for your extraction
    
    Focus on extracting the following information about the AI system:
    - name (the name of the AI system)
    - vendor (the company that developed the system)
    - version (version number of the system)
    - department (where the system is used)
    - purpose (detailed description of what the system does)
    - capabilities (technical capabilities like NLP, Computer Vision, etc.)
    - trainingDatasets (types of data used for training)
    - riskLevel (according to EU AI Act: Unacceptable, High, Limited, Minimal)
    
    Also assess:
    - Document quality (how well the document describes the AI system)
    - Any unstructured insights that may be relevant
    
    Format your response as JSON with nested objects for each field:
    {
      "systemDetails": {
        "name": { "value": "string", "confidence": number, "justification": "string" },
        "vendor": { "value": "string", "confidence": number, "justification": "string" },
        ... other fields with same structure
      },
      "documentQuality": { "score": number, "assessment": "string" },
      "overallConfidenceScore": number,
      "unstructuredInsights": ["string"]
    }
  `;

  // Prioritize OpenAI for document processing as it typically has better OCR capabilities
  try {
    const aiResponse = await callAI({
      prompt,
      model: AIModel.OPENAI,
      temperature: 0.3,
      maxTokens: 2000
    });
    const parsedResponse = safeJsonParse(aiResponse.text);
    
    if (parsedResponse) {
      return parsedResponse;
    }
    
    // If parsing fails, log and try to extract structured data
    console.log("Could not parse OCR response as JSON, attempting to extract structured data");
    
    // Helper function to extract value from text
    const extractFromText = (text: string, key: string): string | null => {
      if (!text) return null;
      // Look for patterns like "key": "value" or key: value
      const patterns = [
        new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`, 'i'),
        new RegExp(`["']?${key}["']?\\s*:\\s*([^,"'{}\\[\\]\\n]+)`, 'i'),
        new RegExp(`${key}\\s+is\\s+["']?([^,"'{}\\[\\]\\n]+)["']?`, 'i')
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1]) return match[1].trim();
      }
      return null;
    };
    
    return {
      systemDetails: {
        name: { value: extractFromText(aiResponse.text, "name") || fileName.replace(/\.[^/.]+$/, ""), confidence: 60 },
        vendor: { value: extractFromText(aiResponse.text, "vendor") || "Unknown", confidence: 50 },
        version: { value: extractFromText(aiResponse.text, "version") || "1.0", confidence: 50 },
        department: { value: extractFromText(aiResponse.text, "department") || "IT", confidence: 50 },
        purpose: { value: extractFromText(aiResponse.text, "purpose") || "Unknown purpose", confidence: 50 },
        capabilities: { value: extractFromText(aiResponse.text, "capabilities") || "Unknown capabilities", confidence: 50 },
        trainingDatasets: { value: extractFromText(aiResponse.text, "trainingDatasets") || "Unknown datasets", confidence: 50 },
        riskLevel: { value: extractFromText(aiResponse.text, "riskLevel") || "Limited", confidence: 50 }
      },
      documentQuality: { score: 60, assessment: "Document processed with limited information extraction" },
      overallConfidenceScore: 60,
      unstructuredInsights: ["Document processed but structured extraction failed"]
    };
  } catch (error) {
    console.error("Error processing document with OCR:", error);
    // Return a basic structure even on error to prevent UI breaks
    return {
      systemDetails: {
        name: { value: fileName.replace(/\.[^/.]+$/, ""), confidence: 50 },
        vendor: { value: "Unknown", confidence: 40 },
        version: { value: "1.0", confidence: 40 },
        department: { value: "Unknown", confidence: 40 },
        purpose: { value: "Could not extract from document", confidence: 40 },
        capabilities: { value: "Unknown capabilities", confidence: 40 },
        trainingDatasets: { value: "Unknown datasets", confidence: 40 },
        riskLevel: { value: "Limited", confidence: 40 }
      },
      documentQuality: { score: 40, assessment: "Document processing failed" },
      overallConfidenceScore: 40,
      unstructuredInsights: ["Error occurred during document processing"]
    };
  }
}
