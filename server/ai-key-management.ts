
import { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { db, sql } from './db';
import { QueryResult } from 'pg';

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

// Helper function for consistent SQL queries that works around TypeScript issues
async function runQuery(text: string, params: any[] = []): Promise<any[]> {
  try {
    // Call postgres client directly with the SQL string and parameters
    // The postgres client in our case is the `sql` export from db.ts
    // It's a function that accepts a template literal and parameters
    // Converting a regular string to a template string is tricky, so we'll use a 
    // different approach with direct string interpolation for simple cases
    
    if (params.length === 0) {
      // If no parameters, just run the query directly
      return await sql`${text}`;
    } else {
      // For simple cases with known parameter count, we can handle them directly
      // This is not ideal but will work for our specific use cases
      if (params.length === 1) {
        return await sql`${text.replace(/\$1/g, '${}')}${params[0]}`;
      } else if (params.length === 2) {
        return await sql`${text.replace(/\$1/g, '${}').replace(/\$2/g, '${}')}${params[0]}${params[1]}`;
      } else if (params.length === 5) {
        return await sql`${text.replace(/\$1/g, '${}').replace(/\$2/g, '${}').replace(/\$3/g, '${}').replace(/\$4/g, '${}').replace(/\$5/g, '${}')}${params[0]}${params[1]}${params[2]}${params[3]}${params[4]}`;
      } else if (params.length === 9) {
        return await sql`${text.replace(/\$1/g, '${}').replace(/\$2/g, '${}').replace(/\$3/g, '${}').replace(/\$4/g, '${}').replace(/\$5/g, '${}')}
                         ${text.replace(/\$6/g, '${}').replace(/\$7/g, '${}').replace(/\$8/g, '${}').replace(/\$9/g, '${}')}
                         ${params[0]}${params[1]}${params[2]}${params[3]}${params[4]}${params[5]}${params[6]}${params[7]}${params[8]}`;
      } else {
        // For complex cases, build the query manually
        // This is a fallback but not ideal
        // In a real application, you would design a more robust solution
        console.warn(`Using fallback SQL execution method for query with ${params.length} parameters`);
        let query = text;
        params.forEach((param, index) => {
          let paramValue: string;
          if (param === null) {
            paramValue = 'NULL';
          } else if (typeof param === 'string') {
            paramValue = `'${param.replace(/'/g, "''")}'`;
          } else if (param instanceof Date) {
            paramValue = `'${param.toISOString()}'`;
          } else if (typeof param === 'boolean') {
            paramValue = param ? 'TRUE' : 'FALSE';
          } else {
            paramValue = String(param);
          }
          const placeholder = `\\$${index + 1}`;
          const regex = new RegExp(placeholder, 'g');
          query = query.replace(regex, paramValue);
        });
        return await sql`${query}`;
      }
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Create API Keys table if it doesn't exist
async function ensureApiKeysTableExists() {
  try {
    // Check if api_keys table exists directly with SQL query string
    const tableExists = await runQuery(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'api_keys'
      ) as exists;
    `);
    
    const exists = tableExists[0]?.exists === true || tableExists[0]?.exists === 'true';
    
    if (!exists) {
      console.log('Creating api_keys table...');
      await runQuery(`
        CREATE TABLE IF NOT EXISTS api_keys (
          id TEXT PRIMARY KEY,
          provider TEXT NOT NULL,
          key TEXT NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT true,
          usage_limit INTEGER,
          usage_count INTEGER DEFAULT 0,
          last_used TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('api_keys table created successfully');
    }
  } catch (error) {
    console.error('Error ensuring api_keys table exists:', error);
    throw error;
  }
}

// API Key manager class with persistent database storage
class ApiKeyManager {
  constructor() {
    // Initialize the database table and load environment variables
    this.init();
  }

  private async init() {
    try {
      await ensureApiKeysTableExists();
      await this.initializeFromEnv();
    } catch (error) {
      console.error('Error initializing API Key Manager:', error);
    }
  }

  private async initializeFromEnv() {
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
        try {
          // Check if we already have a key for this provider from env
          const result = await runQuery(`
            SELECT COUNT(*) as count FROM api_keys 
            WHERE provider = $1
            AND description LIKE $2
          `, [provider, '%from environment variables%']);
          
          const count = Number(result[0]?.count || 0);
          
          if (count === 0) {
            // Add the key if it doesn't exist
            await this.addKey({
              provider,
              key: apiKey,
              description: `Default ${provider} API key from environment variables`,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              usageCount: 0
            });
            console.log(`Loaded ${provider} API key from environment variables`);
          } else {
            console.log(`Using existing ${provider} API key from database`);
          }
        } catch (error) {
          console.error(`Error loading ${provider} API key from environment:`, error);
        }
      }
    }
  }

  // Add a new API key
  async addKey(keyData: ApiKey): Promise<string> {
    const id = uuidv4();
    
    try {
      const createdAt = keyData.createdAt ? keyData.createdAt.toISOString() : new Date().toISOString();
      const updatedAt = keyData.updatedAt ? keyData.updatedAt.toISOString() : new Date().toISOString();

      await runQuery(`
        INSERT INTO api_keys (
          id, provider, key, description, is_active, 
          usage_limit, usage_count, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
      `, [
        id, 
        keyData.provider, 
        keyData.key, 
        keyData.description || null, 
        keyData.isActive ? true : false, 
        keyData.usageLimit || null, 
        keyData.usageCount || 0, 
        createdAt, 
        updatedAt
      ]);
      
      return id;
    } catch (error) {
      console.error('Error adding API key to database:', error);
      throw error;
    }
  }

  // Get an API key by ID
  async getKey(id: string): Promise<ApiKey | undefined> {
    try {
      const result = await runQuery(`
        SELECT * FROM api_keys WHERE id = $1
      `, [id]);
      
      if (result.length === 0) return undefined;
      
      const row = result[0];
      return this.rowToApiKey(row);
    } catch (error) {
      console.error('Error getting API key from database:', error);
      throw error;
    }
  }

  // Helper to convert a database row to ApiKey type
  private rowToApiKey(row: Record<string, unknown>): ApiKey {
    return {
      provider: String(row.provider),
      key: String(row.key),
      description: row.description ? String(row.description) : undefined,
      isActive: Boolean(row.is_active),
      usageLimit: row.usage_limit ? Number(row.usage_limit) : undefined,
      usageCount: row.usage_count ? Number(row.usage_count) : 0,
      lastUsed: row.last_used ? new Date(String(row.last_used)) : undefined,
      createdAt: new Date(String(row.created_at)),
      updatedAt: new Date(String(row.updated_at))
    };
  }

  // Get all keys for a specific provider
  async getKeysByProvider(provider: string): Promise<[string, ApiKey][]> {
    try {
      const result = await runQuery(`
        SELECT * FROM api_keys WHERE provider = $1
      `, [provider]);
      
      return result.map(row => [
        String(row.id),
        this.rowToApiKey(row)
      ]);
    } catch (error) {
      console.error('Error getting keys by provider from database:', error);
      throw error;
    }
  }

  // Get active keys for a provider
  async getActiveKeysByProvider(provider: string): Promise<[string, ApiKey][]> {
    try {
      const result = await runQuery(`
        SELECT * FROM api_keys 
        WHERE provider = $1
        AND is_active = true
      `, [provider]);
      
      return result.map(row => [
        String(row.id),
        this.rowToApiKey(row)
      ]);
    } catch (error) {
      console.error('Error getting active keys by provider from database:', error);
      throw error;
    }
  }

  // Get the best key for a provider (for now, just returns the first active key)
  async getBestKeyForProvider(provider: string): Promise<[string, ApiKey] | undefined> {
    try {
      const result = await runQuery(`
        SELECT * FROM api_keys 
        WHERE provider = $1
        AND is_active = true 
        ORDER BY created_at DESC 
        LIMIT 1
      `, [provider]);
      
      if (result.length === 0) return undefined;
      
      const row = result[0];
      return [String(row.id), this.rowToApiKey(row)];
    } catch (error) {
      console.error('Error getting best key for provider from database:', error);
      throw error;
    }
  }

  // Update an API key
  async updateKey(id: string, updates: Partial<ApiKey>): Promise<boolean> {
    try {
      // Use individual updates for each field that is present
      let updated = false;
      
      if ('provider' in updates && updates.provider !== undefined) {
        await runQuery(`
          UPDATE api_keys SET provider = $1 WHERE id = $2
        `, [updates.provider, id]);
        updated = true;
      }
      
      if ('key' in updates && updates.key !== undefined) {
        await runQuery(`
          UPDATE api_keys SET key = $1 WHERE id = $2
        `, [updates.key, id]);
        updated = true;
      }
      
      if ('description' in updates) {
        await runQuery(`
          UPDATE api_keys SET description = $1 WHERE id = $2
        `, [updates.description || null, id]);
        updated = true;
      }
      
      if ('isActive' in updates && updates.isActive !== undefined) {
        await runQuery(`
          UPDATE api_keys SET is_active = $1 WHERE id = $2
        `, [updates.isActive ? true : false, id]);
        updated = true;
      }
      
      if ('usageLimit' in updates) {
        await runQuery(`
          UPDATE api_keys SET usage_limit = $1 WHERE id = $2
        `, [updates.usageLimit || null, id]);
        updated = true;
      }
      
      if ('usageCount' in updates && updates.usageCount !== undefined) {
        await runQuery(`
          UPDATE api_keys SET usage_count = $1 WHERE id = $2
        `, [updates.usageCount, id]);
        updated = true;
      }
      
      // Always update the updated_at timestamp if any field was updated
      if (updated) {
        const nowIsoString = new Date().toISOString();
        await runQuery(`
          UPDATE api_keys SET updated_at = $1 WHERE id = $2
        `, [nowIsoString, id]);
      }
      
      return updated;
    } catch (error) {
      console.error('Error updating API key in database:', error);
      throw error;
    }
  }

  // Delete an API key
  async deleteKey(id: string): Promise<boolean> {
    try {
      await runQuery(`
        DELETE FROM api_keys WHERE id = $1
      `, [id]);
      
      // Assuming success if no errors are thrown
      return true;
    } catch (error) {
      console.error('Error deleting API key from database:', error);
      throw error;
    }
  }

  // Record usage of an API key
  async recordUsage(id: string): Promise<boolean> {
    try {
      // First, get the current key to check usage limit
      const key = await this.getKey(id);
      if (!key) return false;
      
      const newUsageCount = (key.usageCount || 0) + 1;
      let isActive = key.isActive;
      
      // Check if usage limit is reached
      if (key.usageLimit && newUsageCount >= key.usageLimit) {
        isActive = false;
      }
      
      // Update the key with new usage count and last used time
      const nowIsoString = new Date().toISOString();
      await runQuery(`
        UPDATE api_keys 
        SET usage_count = $1, 
            last_used = $2,
            is_active = $3,
            updated_at = $4
        WHERE id = $5
      `, [newUsageCount, nowIsoString, isActive, nowIsoString, id]);
      
      // Assuming success if no errors
      return true;
    } catch (error) {
      console.error('Error recording API key usage in database:', error);
      throw error;
    }
  }

  // Get an API key for use, records usage automatically
  async getKeyForUse(provider: string): Promise<string | null> {
    try {
      const keyEntry = await this.getBestKeyForProvider(provider);
      if (!keyEntry) return null;
      
      const [id, key] = keyEntry;
      await this.recordUsage(id);
      
      return key.key;
    } catch (error) {
      console.error('Error getting API key for use from database:', error);
      return null;
    }
  }

  // List all API keys
  async listAllKeys(): Promise<[string, ApiKey][]> {
    try {
      const result = await runQuery(`
        SELECT * FROM api_keys ORDER BY provider, created_at DESC
      `);
      
      return result.map(row => [
        String(row.id),
        this.rowToApiKey(row)
      ]);
    } catch (error) {
      console.error('Error listing all API keys from database:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiKeyManager = new ApiKeyManager();

// API routes handlers
export const getApiKeys = async (req: Request, res: Response) => {
  try {
    const keyList = await apiKeyManager.listAllKeys();
    const keys = keyList.map(([id, key]) => ({
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

export const addApiKey = async (req: Request, res: Response) => {
  try {
    const keyData = apiKeySchema.parse(req.body);
    const id = await apiKeyManager.addKey(keyData);
    
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

export const updateApiKey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // If the key field is present, make sure it's not empty
    if ('key' in updates && (!updates.key || updates.key.trim() === '')) {
      return res.status(400).json({ message: 'API key cannot be empty' });
    }
    
    const success = await apiKeyManager.updateKey(id, updates);
    
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

export const deleteApiKey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await apiKeyManager.deleteKey(id);
    
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

export const testApiKey = async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const key = await apiKeyManager.getKeyForUse(provider);
    
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
export async function getApiKey(provider: string): Promise<string | null> {
  return await apiKeyManager.getKeyForUse(provider);
}
