/**
 * Script to update the activities table schema to align with the application code
 */
import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

async function updateActivitiesSchema() {
  try {
    console.log('Starting activities table schema update...');
    
    // Read the migration SQL file
    const migrationSql = fs.readFileSync(
      path.join(process.cwd(), 'migrations', 'update_activities_table.sql'),
      'utf8'
    );
    
    // Connect to the database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const queryClient = postgres(connectionString);
    const db = drizzle(queryClient);
    
    console.log('Connected to database');
    console.log('Executing migration...');
    
    // Split the migration file into individual statements and execute them
    const statements = migrationSql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim()}`);
        await queryClient.unsafe(statement.trim());
      }
    }
    
    console.log('Migration completed successfully');
    
    // Close the connection
    await queryClient.end();
    console.log('Database connection closed');
    
    return { success: true, message: 'Activities table schema updated successfully' };
  } catch (error) {
    console.error('Error updating activities table schema:', error);
    return { success: false, error };
  }
}

updateActivitiesSchema()
  .then(result => {
    if (result.success) {
      console.log(result.message);
      process.exit(0);
    } else {
      console.error('Migration failed:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });