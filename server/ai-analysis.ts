/**
 * AI Analysis module for EU AI Act compliance
 * Handles DeepSeek API integration and other AI analysis functionality
 */

import axios from 'axios';
import { AIModelError, RateLimitError } from './error-handling';

/**
 * Call DeepSeek API for AI analysis
 */
export async function callDeepSeekApi(prompt: string, maxRetries = 2): Promise<string> {
  let attempts = 0;
  let lastError: Error | null = null;
  
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DeepSeek API key is not configured');
  }
  
  while (attempts < maxRetries) {
    try {
      const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
      
      const requestData = {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are an expert on EU AI Act compliance helping analyze AI systems.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      };
      
      console.log('Calling DeepSeek API...');
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 60000 // 60 seconds timeout
      });
      
      const responseData = response.data;
      
      if (!responseData.choices || responseData.choices.length === 0) {
        throw new AIModelError('DeepSeek returned empty response');
      }
      
      const responseMessage = responseData.choices[0]?.message?.content?.trim();
      
      if (!responseMessage) {
        throw new AIModelError('DeepSeek returned empty message');
      }
      
      return responseMessage;
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.response && error.response.status === 429) {
        console.warn(`DeepSeek rate limited (attempt ${attempts + 1}/${maxRetries}), waiting before retry...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempts + 1))); // Exponential backoff
      } else {
        // For other errors, we'll try again with less delay
        console.warn(`DeepSeek API call failed (attempt ${attempts + 1}/${maxRetries}):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      attempts++;
    }
  }
  
  console.error('DeepSeek API failed after maximum retries');
  
  // If we've exhausted retries, throw the last error
  if (lastError) {
    // Type guard for axios error with response property
    const axiosError = lastError as any;
    if (axiosError.response && axiosError.response.status === 429) {
      throw new RateLimitError('DeepSeek rate limit exceeded');
    }
    throw new AIModelError(`DeepSeek API error: ${lastError.message}`);
  }
  
  throw new AIModelError('Unknown error in DeepSeek API call');
}

/**
 * Determine relevant EU AI Act articles for a system
 */
export async function determineRelevantArticles(systemData: any): Promise<string[]> {
  if (!systemData) return ["Article 69"]; // Default to minimal risk article
  
  try {
    const prompt = `
I need to determine which EU AI Act articles are most relevant for this AI system:

Name: ${systemData.name}
Purpose: ${systemData.purpose}
Description: ${systemData.description || ""}
AI Capabilities: ${systemData.aiCapabilities || ""}
Usage Context: ${systemData.usageContext || ""}
Potential Impact: ${systemData.potentialImpact || ""}
Specific Risks: ${systemData.specificRisks || "None specified"}

Please respond ONLY with a comma-separated list of the most relevant EU AI Act articles in the format "Article X" (e.g., "Article 5, Article 6, Article 10").
Focus on the 3-5 most applicable articles based on the risk level and characteristics of this system.
`;

    const response = await callDeepSeekApi(prompt);
    
    // Parse the response to get article references
    const articlePattern = /Article\s+\d+/g;
    const articles = response.match(articlePattern);
    
    if (articles && articles.length > 0) {
      return articles.map(article => article.trim());
    }
    
    // If no articles found in the response, return default
    return ["Article 69"]; // Minimal risk
  } catch (error) {
    console.error('Error determining relevant articles:', error);
    return ["Article 69"]; // Fallback to minimal risk
  }
}

/**
 * Search Google API for context information
 */
export async function searchGoogleApi(query: string): Promise<any> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  if (!apiKey || !searchEngineId) {
    throw new Error('Google Search API key or Search Engine ID is not configured');
  }
  
  try {
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;
    
    console.log('Searching Google API...');
    const response = await axios.get(apiUrl, {
      timeout: 30000 // 30 seconds timeout
    });
    
    if (!response.data || !response.data.items) {
      return [];
    }
    
    // Map to a standardized format
    return response.data.items.map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || '',
      source: 'Google'
    }));
  } catch (error: any) {
    console.error('Google Search API error:', error.message);
    
    if (error.response && error.response.status === 429) {
      throw new RateLimitError('Google Search API rate limit exceeded');
    }
    
    throw new AIModelError(`Google Search API error: ${error.message}`);
  }
}