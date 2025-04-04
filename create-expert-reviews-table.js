/**
 * Script to create the expert_reviews table in the database
 */
import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Get current file directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createExpertReviewsTable() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    console.log('Connecting to database...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'migrations', 'create_expert_reviews_table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing SQL to create expert_reviews table...');
    
    // Execute the SQL
    await pool.query(sqlContent);
    
    console.log('Expert reviews table created successfully.');
    
    await pool.end();
  } catch (error) {
    console.error('Error creating expert reviews table:', error);
    process.exit(1);
  }
}

// Run the function
createExpertReviewsTable();