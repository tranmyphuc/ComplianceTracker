/**
 * Script to check if all AI API keys are working
 */
import pg from 'pg';
import fetch from 'node-fetch';

const { Pool } = pg;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkApiKeys() {
  console.log('Checking AI API keys...');
  
  try {
    // Get API keys from the database
    const result = await pool.query('SELECT * FROM api_keys WHERE is_active = $1', [true]);
    const apiKeys = result.rows;
    
    if (apiKeys.length === 0) {
      console.log('No active API keys found in the database');
      return;
    }
    
    console.log(`Found ${apiKeys.length} active API keys`);
    
    // Check each key
    for (const key of apiKeys) {
      console.log(`\nChecking ${key.provider} API key (ID: ${key.id})...`);
      
      try {
        await testApiKey(key.provider, key.key);
        console.log(`✅ ${key.provider} API key is working correctly`);
        
        // Update last used timestamp and increment usage count
        await pool.query(
          'UPDATE api_keys SET last_used = NOW(), usage_count = usage_count + 1 WHERE id = $1',
          [key.id]
        );
      } catch (error) {
        console.error(`❌ ${key.provider} API key test failed:`, error.message);
        
        // Update status if the key has permanent failure
        if (isPermanentFailure(error)) {
          await pool.query(
            'UPDATE api_keys SET is_active = $1, updated_at = NOW() WHERE id = $2',
            [false, key.id]
          );
          console.log(`Updated ${key.provider} API key status to inactive`);
        } else {
          // Just update usage count for temporary failures
          await pool.query(
            'UPDATE api_keys SET usage_count = usage_count + 1, updated_at = NOW() WHERE id = $1',
            [key.id]
          );
        }
      }
    }
  } catch (error) {
    console.error('Error checking API keys:', error);
  } finally {
    await pool.end();
  }
}

// Test function for different API providers
async function testApiKey(provider, apiKey) {
  switch (provider.toLowerCase()) {
    case 'deepseek':
      return testDeepSeekApiKey(apiKey);
    case 'openai':
      return testOpenAIApiKey(apiKey);
    case 'gemini':
      return testGeminiApiKey(apiKey);
    case 'google_search':
      return testGoogleSearchApiKey(apiKey);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// Test DeepSeek API key
async function testDeepSeekApiKey(apiKey) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello for API key test' }
      ],
      temperature: 0.1,
      max_tokens: 10
    }),
    timeout: 10000 // 10 second timeout for quick check
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${errorData}`);
  }

  const data = await response.json();
  return data;
}

// Test OpenAI API key
async function testOpenAIApiKey(apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello for API key test' }
      ],
      temperature: 0.1,
      max_tokens: 10
    }),
    timeout: 10000 // 10 second timeout for quick check
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorData}`);
  }

  const data = await response.json();
  return data;
}

// Test Gemini API key
async function testGeminiApiKey(apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
                text: 'Say hello for API key test'
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10
        }
      }),
      timeout: 10000 // 10 second timeout for quick check
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorData}`);
  }

  const data = await response.json();
  return data;
}

// Test Google Search API key
async function testGoogleSearchApiKey(apiKey) {
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID || 'AIzaSyC39jhj7STEpTFD0D6Vw0jY2OQ6qIJnH_o'; // Using environment variable or default
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=EU%20AI%20Act&num=1`,
    {
      method: 'GET',
      timeout: 10000 // 10 second timeout for quick check
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Google Search API error (${response.status}): ${errorData}`);
  }

  const data = await response.json();
  return data;
}

// Determine if an error indicates a permanent failure (invalid key, etc.) vs temporary failure
function isPermanentFailure(error) {
  const errorMessage = error.message.toLowerCase();
  return (
    errorMessage.includes('invalid api key') ||
    errorMessage.includes('authentication') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('forbidden') ||
    errorMessage.includes('not found') ||
    errorMessage.includes('no longer valid')
  );
}

// Run the check
checkApiKeys()
  .then(() => {
    console.log('\nAPI key check completed');
  })
  .catch(error => {
    console.error('Error running API key check:', error);
  });