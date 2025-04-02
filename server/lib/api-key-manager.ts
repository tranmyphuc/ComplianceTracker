/**
 * Jack said: API Key Manager provides smart API key management with rotation,
 * fallback, and retry capabilities to ensure reliable API access.
 */

import { AppError, ConfigurationError, ServiceUnavailableError, ErrorType } from '../error-handling.js';

interface ApiKeyConfig {
  keys: string[];
  provider: string;
  maxRetries?: number;
  retryDelay?: number;
  rotationStrategy?: 'round-robin' | 'random' | 'least-used';
}

interface ApiKeyUsage {
  key: string;
  usageCount: number;
  lastUsed: Date;
  errorCount: number;
  lastError?: Date;
  disabled: boolean;
}

class ApiKeyManager {
  private keyConfigs: Map<string, ApiKeyConfig> = new Map();
  private keyUsage: Map<string, Map<string, ApiKeyUsage>> = new Map();
  private currentKeyIndex: Map<string, number> = new Map();

  /**
   * Jack said: Initialize a new API key configuration for a specific provider
   */
  public registerKeys(provider: string, config: ApiKeyConfig): void {
    if (!config.keys || config.keys.length === 0) {
      throw new ConfigurationError(
        `No API keys provided for ${provider}`
      );
    }

    // Set default values if not provided
    const completeConfig = {
      ...config,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      rotationStrategy: config.rotationStrategy || 'round-robin'
    };

    this.keyConfigs.set(provider, completeConfig);
    
    // Initialize usage tracking
    const usageMap = new Map<string, ApiKeyUsage>();
    for (const key of config.keys) {
      usageMap.set(key, {
        key,
        usageCount: 0,
        lastUsed: new Date(0), // Start with epoch
        errorCount: 0,
        disabled: false
      });
    }
    
    this.keyUsage.set(provider, usageMap);
    this.currentKeyIndex.set(provider, 0);
  }

  /**
   * Jack said: Get the next available API key based on the rotation strategy
   */
  public getKey(provider: string): string {
    const config = this.keyConfigs.get(provider);
    if (!config) {
      throw new ConfigurationError(
        `No API key configuration found for ${provider}`
      );
    }

    const usageMap = this.keyUsage.get(provider);
    if (!usageMap || usageMap.size === 0) {
      throw new ConfigurationError(
        `No API keys available for ${provider}`
      );
    }

    // Filter out disabled keys
    const availableKeys = Array.from(usageMap.values()).filter(usage => !usage.disabled);
    
    if (availableKeys.length === 0) {
      throw new ServiceUnavailableError(
        `API key service for ${provider}`
      );
    }

    // Select a key based on the rotation strategy
    let selectedKey: ApiKeyUsage;
    
    switch (config.rotationStrategy) {
      case 'round-robin':
        // Get the current index and increment it
        const currentIndex = this.currentKeyIndex.get(provider) || 0;
        const nextIndex = (currentIndex + 1) % availableKeys.length;
        this.currentKeyIndex.set(provider, nextIndex);
        selectedKey = availableKeys[currentIndex];
        break;
        
      case 'random':
        // Select a random key
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        selectedKey = availableKeys[randomIndex];
        break;
        
      case 'least-used':
        // Select the key with the lowest usage count
        selectedKey = availableKeys.reduce((prev, current) => 
          prev.usageCount <= current.usageCount ? prev : current
        );
        break;
        
      default:
        selectedKey = availableKeys[0];
    }

    // Update usage statistics
    const keyUsage = usageMap.get(selectedKey.key);
    if (keyUsage) {
      keyUsage.usageCount++;
      keyUsage.lastUsed = new Date();
      usageMap.set(selectedKey.key, keyUsage);
    }

    return selectedKey.key;
  }

  /**
   * Jack said: Report an error with a specific API key, potentially leading to disabling
   */
  public reportError(provider: string, key: string, error: any): void {
    const usageMap = this.keyUsage.get(provider);
    if (!usageMap) return;

    const keyUsage = usageMap.get(key);
    if (!keyUsage) return;

    keyUsage.errorCount++;
    keyUsage.lastError = new Date();

    // Disable the key if it has too many consecutive errors
    // In a production system, you might want more sophisticated logic here
    if (keyUsage.errorCount >= 5) {
      keyUsage.disabled = true;
      console.warn(`API key for ${provider} has been disabled due to repeated errors: ${key.substring(0, 5)}...`);
    }

    usageMap.set(key, keyUsage);
  }

  /**
   * Jack said: Perform an API call with automatic retry and key rotation
   */
  public async executeWithRetry<T>(
    provider: string,
    apiCall: (key: string) => Promise<T>
  ): Promise<T> {
    const config = this.keyConfigs.get(provider);
    if (!config) {
      throw new ConfigurationError(
        `No API key configuration found for ${provider}`
      );
    }

    let lastError: any;
    let retryCount = 0;
    
    while (retryCount <= config.maxRetries!) {
      try {
        const key = this.getKey(provider);
        const result = await apiCall(key);
        return result;
      } catch (error) {
        lastError = error;
        const key = this.getKey(provider);
        this.reportError(provider, key, error);
        
        // If this was the last retry, throw the error
        if (retryCount >= config.maxRetries!) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        retryCount++;
      }
    }
    
    // If we get here, all retries failed
    throw new ServiceUnavailableError(
      `API service for ${provider}`,
      { 
        message: `Failed after ${retryCount} retries: ${lastError?.message || 'Unknown error'}`,
        lastError
      }
    );
  }

  /**
   * Jack said: Reset the error count for a specific key
   */
  public resetKey(provider: string, key: string): void {
    const usageMap = this.keyUsage.get(provider);
    if (!usageMap) return;

    const keyUsage = usageMap.get(key);
    if (!keyUsage) return;

    keyUsage.errorCount = 0;
    keyUsage.disabled = false;
    usageMap.set(key, keyUsage);
  }

  /**
   * Jack said: Get usage statistics for all keys of a provider
   */
  public getKeyStats(provider: string): Array<Omit<ApiKeyUsage, 'key'> & { keyPrefix: string }> {
    const usageMap = this.keyUsage.get(provider);
    if (!usageMap) return [];

    return Array.from(usageMap.values()).map(usage => ({
      keyPrefix: `${usage.key.substring(0, 5)}...`,
      usageCount: usage.usageCount,
      lastUsed: usage.lastUsed,
      errorCount: usage.errorCount,
      lastError: usage.lastError,
      disabled: usage.disabled
    }));
  }
}

// Export a singleton instance
export const apiKeyManager = new ApiKeyManager();

// Helper function to register keys from environment variables
export function registerApiKeysFromEnv(
  provider: string, 
  envVarNames: string[], 
  options: Omit<ApiKeyConfig, 'keys' | 'provider'> = {}
): void {
  const keys = envVarNames
    .map(name => process.env[name])
    .filter(Boolean) as string[];
  
  if (keys.length === 0) {
    console.warn(`No API keys found in environment variables for ${provider}`);
    return;
  }
  
  apiKeyManager.registerKeys(provider, {
    keys,
    provider,
    ...options
  });
}