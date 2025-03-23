
import { Request, Response } from 'express';
import { z } from 'zod';

// Define schema for API key data
export const apiKeySchema = z.object({
  provider: z.string().min(1),
  key: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  usageLimit: z.number().optional(),
  usageCount: z.number().default(0),
  lastUsed: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

// In-memory storage for API keys (in production, this would use database storage)
class ApiKeyManager {
  private keys: Map<string, ApiKey> = new Map();
  
  constructor() {
    // Load default keys from environment variables
    this.initializeFromEnv();
  }

  private initializeFromEnv() {
    const providers = [
      { envKey: 'DEEPSEEK_API_KEY', provider: 'deepseek' },
      { envKey: 'GEMINI_API_KEY', provider: 'gemini' },
      { envKey: 'OPENAI_API_KEY', provider: 'openai' },
      { envKey: 'ANTHROPIC_API_KEY', provider: 'anthropic' },
      { envKey: 'COHERE_API_KEY', provider: 'cohere' },
      { envKey: 'STABILITY_API_KEY', provider: 'stability' },
      { envKey: 'GOOGLE_SEARCH_API_KEY', provider: 'google_search' }
    ];

    for (const { envKey, provider } of providers) {
      const apiKey = process.env[envKey];
      if (apiKey) {
        this.addKey({
          provider,
          key: apiKey,
          description: `Default ${provider} API key from environment variables`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          usageCount: 0
        });
        console.log(`Loaded ${provider} API key from environment variables`);
      }
    }
  }

  // Add a new API key
  addKey(keyData: ApiKey): string {
    const id = `${keyData.provider}_${Date.now()}`;
    this.keys.set(id, keyData);
    return id;
  }

  // Get an API key by ID
  getKey(id: string): ApiKey | undefined {
    return this.keys.get(id);
  }

  // Get all keys for a specific provider
  getKeysByProvider(provider: string): [string, ApiKey][] {
    return Array.from(this.keys.entries())
      .filter(([_, key]) => key.provider === provider);
  }

  // Get active keys for a provider
  getActiveKeysByProvider(provider: string): [string, ApiKey][] {
    return this.getKeysByProvider(provider)
      .filter(([_, key]) => key.isActive);
  }

  // Get the best key for a provider (for now, just returns the first active key)
  getBestKeyForProvider(provider: string): [string, ApiKey] | undefined {
    const activeKeys = this.getActiveKeysByProvider(provider);
    return activeKeys.length > 0 ? activeKeys[0] : undefined;
  }

  // Update an API key
  updateKey(id: string, updates: Partial<ApiKey>): boolean {
    const key = this.keys.get(id);
    if (!key) return false;
    
    this.keys.set(id, { 
      ...key, 
      ...updates, 
      updatedAt: new Date() 
    });
    
    return true;
  }

  // Delete an API key
  deleteKey(id: string): boolean {
    return this.keys.delete(id);
  }

  // Record usage of an API key
  recordUsage(id: string): boolean {
    const key = this.keys.get(id);
    if (!key) return false;
    
    key.usageCount += 1;
    key.lastUsed = new Date();
    
    // Check if usage limit is reached
    if (key.usageLimit && key.usageCount >= key.usageLimit) {
      key.isActive = false;
    }
    
    this.keys.set(id, key);
    return true;
  }

  // Get an API key for use, records usage automatically
  getKeyForUse(provider: string): string | null {
    const keyEntry = this.getBestKeyForProvider(provider);
    if (!keyEntry) return null;
    
    const [id, key] = keyEntry;
    this.recordUsage(id);
    
    return key.key;
  }

  // List all API keys
  listAllKeys(): [string, ApiKey][] {
    return Array.from(this.keys.entries());
  }
}

// Export a singleton instance
export const apiKeyManager = new ApiKeyManager();

// API routes handlers
export const getApiKeys = (req: Request, res: Response) => {
  try {
    const keys = apiKeyManager.listAllKeys().map(([id, key]) => ({
      id,
      provider: key.provider,
      description: key.description,
      isActive: key.isActive,
      usageCount: key.usageCount,
      usageLimit: key.usageLimit,
      lastUsed: key.lastUsed,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
      // Don't send the actual key to frontend for security
    }));
    
    res.json({ keys });
  } catch (error) {
    console.error('Error getting API keys:', error);
    res.status(500).json({ message: 'Failed to get API keys' });
  }
};

export const addApiKey = (req: Request, res: Response) => {
  try {
    const keyData = apiKeySchema.parse(req.body);
    const id = apiKeyManager.addKey(keyData);
    
    res.status(201).json({ 
      id, 
      message: 'API key added successfully',
      provider: keyData.provider
    });
  } catch (error) {
    console.error('Error adding API key:', error);
    res.status(400).json({ 
      message: 'Failed to add API key', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const updateApiKey = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // If the key field is present, make sure it's not empty
    if ('key' in updates && (!updates.key || updates.key.trim() === '')) {
      return res.status(400).json({ message: 'API key cannot be empty' });
    }
    
    const success = apiKeyManager.updateKey(id, updates);
    
    if (success) {
      res.json({ message: 'API key updated successfully' });
    } else {
      res.status(404).json({ message: 'API key not found' });
    }
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(400).json({ 
      message: 'Failed to update API key', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const deleteApiKey = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = apiKeyManager.deleteKey(id);
    
    if (success) {
      res.json({ message: 'API key deleted successfully' });
    } else {
      res.status(404).json({ message: 'API key not found' });
    }
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Failed to delete API key' });
  }
};

export const testApiKey = (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const key = apiKeyManager.getKeyForUse(provider);
    
    if (key) {
      // For security, we don't send the full key back
      const maskedKey = key.substring(0, 4) + '...' + key.substring(key.length - 4);
      res.json({ 
        success: true, 
        message: `${provider} API key is available`, 
        maskedKey
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: `No active API key found for ${provider}` 
      });
    }
  } catch (error) {
    console.error(`Error testing ${req.params.provider} API key:`, error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to test API key' 
    });
  }
};

// Update the DeepSeek API calling function to use our key manager
export function getApiKey(provider: string): string | null {
  return apiKeyManager.getKeyForUse(provider);
}
