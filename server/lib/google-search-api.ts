/**
 * Jack said: Google Search API service with enhanced error handling,
 * retry mechanism, and fallback strategies.
 */

import axios from 'axios';
import { apiKeyManager } from './api-key-manager.js';
import { AppError, ErrorType } from '../error-handling.js';

// Constants for Google Search API
const GOOGLE_SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1';
const PROVIDER_NAME = 'google_search';

// Register API keys from environment variables
// Expecting GOOGLE_SEARCH_API_KEY_1, GOOGLE_SEARCH_API_KEY_2, etc.
const registerGoogleSearchApiKeys = () => {
  const envVarNames = [];
  for (let i = 1; i <= 5; i++) {
    envVarNames.push(`GOOGLE_SEARCH_API_KEY_${i}`);
  }
  
  apiKeyManager.registerKeys(PROVIDER_NAME, {
    keys: [process.env.GOOGLE_SEARCH_API_KEY || ''].filter(Boolean) as string[],
    provider: PROVIDER_NAME,
    maxRetries: 3,
    retryDelay: 1000,
    rotationStrategy: 'round-robin'
  });
};

// Initialize the API keys
try {
  registerGoogleSearchApiKeys();
} catch (error) {
  console.warn('Failed to register Google Search API keys:', error);
}

// Types for Google Search API response
interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    cse_thumbnail?: Array<{
      src: string;
      width: string;
      height: string;
    }>;
    cse_image?: Array<{
      src: string;
    }>;
  };
}

interface GoogleSearchApiResponse {
  items: GoogleSearchResult[];
  queries: {
    request: Array<{
      totalResults: string;
    }>;
  };
  searchInformation: {
    totalResults: string;
  };
}

// Simplified result structure to return to clients
export interface SearchResult {
  title: string;
  url: string;
  description: string;
  thumbnailUrl?: string;
}

/**
 * Jack said: Perform a search using the Google Search API with robust error handling and retries
 */
export async function searchGoogle(
  query: string,
  options: {
    limit?: number;
    siteRestrict?: string;
    exactTerms?: string;
  } = {}
): Promise<SearchResult[]> {
  try {
    // Determine search parameters
    const searchParams = {
      q: query,
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      num: options.limit || 10, // Number of results to return (max 10)
      ...(options.siteRestrict && { siteSearch: options.siteRestrict }),
      ...(options.exactTerms && { exactTerms: options.exactTerms }),
    };

    // Use the API Key Manager to handle the request with retries and key rotation
    const response = await apiKeyManager.executeWithRetry<GoogleSearchApiResponse>(
      PROVIDER_NAME,
      async (apiKey) => {
        try {
          const response = await axios.get(GOOGLE_SEARCH_API_URL, {
            params: {
              ...searchParams,
              key: apiKey,
            },
            timeout: 10000, // 10 second timeout
          });
          return response.data;
        } catch (error: any) {
          // Transform Axios errors into more useful error objects
          if (error.response) {
            // Server responded with a non-2xx status
            throw new AppError(
              `Google Search API error: ${error.response.status} ${error.response.statusText}`,
              ErrorType.EXTERNAL_SERVICE,
              error.response.status,
              { 
                details: error.response.data,
                query,
                options
              }
            );
          } else if (error.request) {
            // Request was made but no response received
            throw new AppError(
              'Google Search API timeout or network error',
              ErrorType.EXTERNAL_SERVICE,
              503,
              { 
                query,
                options
              }
            );
          } else {
            // Something else happened while setting up the request
            throw new AppError(
              `Google Search API error: ${error.message}`,
              ErrorType.EXTERNAL_SERVICE,
              500,
              { 
                query,
                options
              }
            );
          }
        }
      }
    );

    // Transform the response into our simplified format
    if (!response.items || response.items.length === 0) {
      return [];
    }

    return response.items.map((item) => ({
      title: item.title,
      url: item.link,
      description: item.snippet,
      thumbnailUrl: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src,
    }));
  } catch (error: any) {
    console.error('Failed to perform Google search:', error);
    
    // If all attempts failed, return an empty result rather than throwing
    // This provides a more graceful degradation of service
    return [];
  }
}

/**
 * Jack said: Check if the Google Search API is currently available
 */
export async function isGoogleSearchAvailable(): Promise<boolean> {
  try {
    const results = await searchGoogle('test query', { limit: 1 });
    return results.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Jack said: Get statistics about API key usage for Google Search
 */
export function getGoogleSearchApiKeyStats() {
  return apiKeyManager.getKeyStats(PROVIDER_NAME);
}