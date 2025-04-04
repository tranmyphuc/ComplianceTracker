import { config } from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

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
  
  const connectionString = process.env.DATABASE_URL;
  const migrationClient = postgres(connectionString, { ssl: { rejectUnauthorized: false } });
  const db = drizzle(migrationClient);
  
  console.log('Creating database schema...');
  
  try {
    // First check connection
    console.log('Testing database connection...');
    await db.execute(sql`SELECT 1`);
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
      'system_settings'
    ];
    
    // Push the schema - try a SQL approach
    for (const tableName of tables) {
      console.log(`Creating table ${tableName}`);
      
      try {
        // Try to create the table using migrationClient directly
        await migrationClient`CREATE TABLE IF NOT EXISTS "${tableName}" (id SERIAL PRIMARY KEY)`;
        console.log(`Table ${tableName} created or already exists`);
      } catch (err) {
        console.error(`Error creating table ${tableName}:`, err.message);
      }
    }
    
    console.log('Schema creation completed!');
  } catch (err) {
    console.error('Failed to create schema:', err);
  } finally {
    await migrationClient.end();
  }
}

main();
