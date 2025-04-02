/**
 * API integrations for various AI services
 * Provides abstractions for OpenAI, Gemini, and other AI APIs
 */

import OpenAI from 'openai';
import { AIModelError, RateLimitError } from './error-handling';
import axios from 'axios';

// OpenAI API integration
export async function fetchOpenAI(prompt: string, maxRetries = 2): Promise<string> {
  let attempts = 0;
  let lastError: Error | null = null;
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  
  while (attempts < maxRetries) {
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        timeout: 60000 // 60 seconds timeout
      });
      
      console.log('Calling OpenAI API...');
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert on EU AI Act compliance helping analyze AI systems.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });
      
      const responseMessage = response.choices[0]?.message?.content?.trim();
      
      if (!responseMessage) {
        throw new AIModelError('OpenAI returned empty response');
      }
      
      return responseMessage;
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.response && error.response.status === 429) {
        console.warn(`OpenAI rate limited (attempt ${attempts + 1}/${maxRetries}), waiting before retry...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempts + 1))); // Exponential backoff
      } else {
        // For other errors, we'll try again with less delay
        console.warn(`OpenAI API call failed (attempt ${attempts + 1}/${maxRetries}):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      attempts++;
    }
  }
  
  console.error('OpenAI API failed after maximum retries');
  
  // If we've exhausted retries, throw the last error
  if (lastError) {
    // Type guard for axios error with response property
    const axiosError = lastError as any;
    if (axiosError.response && axiosError.response.status === 429) {
      throw new RateLimitError('OpenAI rate limit exceeded');
    }
    throw new AIModelError(`OpenAI API error: ${lastError.message}`);
  }
  
  throw new AIModelError('Unknown error in OpenAI API call');
}

// Gemini API integration
export async function fetchGemini(prompt: string, maxRetries = 2): Promise<string> {
  let attempts = 0;
  let lastError: Error | null = null;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }
  
  while (attempts < maxRetries) {
    try {
      // Using Google AI Gemini API
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      const requestData = {
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
          temperature: 0.7,
          maxOutputTokens: 3000
        }
      };
      
      console.log('Calling Gemini API...');
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds timeout
      });
      
      const responseData = response.data;
      
      if (!responseData.candidates || responseData.candidates.length === 0) {
        throw new AIModelError('Gemini returned empty response');
      }
      
      // Extract text from the response
      let responseText = '';
      if (responseData.candidates[0].content && 
          responseData.candidates[0].content.parts && 
          responseData.candidates[0].content.parts.length > 0) {
        responseText = responseData.candidates[0].content.parts[0].text || '';
      }
      
      if (!responseText) {
        throw new AIModelError('Gemini returned empty text');
      }
      
      return responseText;
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.response && error.response.status === 429) {
        console.warn(`Gemini rate limited (attempt ${attempts + 1}/${maxRetries}), waiting before retry...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempts + 1))); // Exponential backoff
      } else {
        // For other errors, we'll try again with less delay
        console.warn(`Gemini API call failed (attempt ${attempts + 1}/${maxRetries}):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      attempts++;
    }
  }
  
  console.error('Gemini API failed after maximum retries');
  
  // If we've exhausted retries, throw the last error
  if (lastError) {
    // Type guard for axios error with response property
    const axiosError = lastError as any;
    if (axiosError.response && axiosError.response.status === 429) {
      throw new RateLimitError('Gemini rate limit exceeded');
    }
    throw new AIModelError(`Gemini API error: ${lastError.message}`);
  }
  
  throw new AIModelError('Unknown error in Gemini API call');
}

// Utility function to mask API keys in logs
export function maskApiKey(key: string): string {
  if (!key) return 'undefined';
  if (key.length < 8) return '*'.repeat(key.length);
  return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
}