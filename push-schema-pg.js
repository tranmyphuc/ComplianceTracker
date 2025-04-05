import { config } from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

config();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  console.log('Environment variables:');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('PGUSER exists:', !!process.env.PGUSER);
  console.log('PGHOST exists:', !!process.env.PGHOST);
  console.log('PGDATABASE exists:', !!process.env.PGDATABASE);
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  console.log('Creating database schema...');
  
  try {
    // Connect to the database
    await client.connect();
    
    // First check connection
    console.log('Testing database connection...');
    await client.query('SELECT 1');
    console.log('Database connection successful!');
    
    // Define the tables to create
    const tables = [
      'users',
      'ai_systems',
      'risk_assessments',
      'eu_ai_act_articles',
      'article_versions',
      'training_modules',
      'training_progress',
      'approval_items',
      'approval_assignments',
      'approval_history',
      'approval_notifications',
      'approval_settings',
      'expert_reviews',
      'activities',
      'api_keys',
      'regulatory_terms',
      'document_templates',
      'regulatory_updates',
      'regulatory_impacts',
      'feature_flags',
      'system_settings',
    ];
    
    for (const tableName of tables) {
      console.log(`Creating table ${tableName}`);
      
      try {
        // Try to create the table using direct SQL query
        await client.query(`CREATE TABLE IF NOT EXISTS "${tableName}" (id SERIAL PRIMARY KEY)`);
        console.log(`Table ${tableName} created or already exists`);
      } catch (err) {
        console.error(`Error creating table ${tableName}:`, err.message);
      }
    }
    
    console.log('Schema creation completed!');
  } catch (err) {
    console.error('Failed to create schema:', err);
  } finally {
    await client.end();
  }
}

main();