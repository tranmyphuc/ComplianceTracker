import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './shared/schema.js';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const migrationClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(migrationClient);
  
  console.log('Creating database schema...');
  
  try {
    // Push the schema definitions to the database
    for (const tableName in schema) {
      const table = schema[tableName];
      
      // Check if the item is a proper table object with a createTable method
      if (table && typeof table === 'object' && table.createTable) {
        console.log();
        
        try {
          await db.execute(table.createTable);
          console.log();
        } catch (err) {
          if (err.message.includes('already exists')) {
            console.log();
          } else {
            console.error('Error creating table:', err);
          }
        }
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
