
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
export async function generateSystemSuggestion(name: string, description?: string): Promise<any> {
  const prompt = `
    You are an EU AI Act compliance expert. Based on the following information about an AI system,
    generate comprehensive suggestions for all registration fields.

    ${name ? `System Name: ${name}` : ''}
    ${description ? `Description: ${description}` : ''}

    IMPORTANT: Accurately identify the system based on the keywords in the name and description.

    Identify the specific AI system that best matches the provided name/description. 
    Do not default to generic systems unless absolutely necessary.

    Provide suggestions for the following fields:
    - name (keep the original name if provided, otherwise suggest an appropriate name)
    - vendor (the company that develops this specific AI system)
    - version (suggest a realistic version number)
    - department (where this system would typically be used)
    - purpose (detailed purpose of the system)
    - aiCapabilities (technical capabilities like NLP, Computer Vision, etc.)
    - trainingDatasets (types of data used to train this system)
    - outputTypes (what outputs this system produces)
    - usageContext (where and how this system is used)
    - potentialImpact (potential impacts on individuals and society)
    - riskLevel (according to EU AI Act: Unacceptable, High, Limited, Minimal)

    Output your answer in JSON format with all these fields and a 'confidenceScore' value from 0-100.
  `;

  const response = await callAI({
    prompt,
    model: AIModel.DEEPSEEK,
    temperature: 0.2
  });

  return safeJsonParse(response.text);
}

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
