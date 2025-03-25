/**
 * Script to check database connection and initialize tables
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('Checking database connection...');
console.log('Connection details:');
console.log('PGHOST:', process.env.PGHOST);
console.log('PGPORT:', process.env.PGPORT);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGDATABASE:', process.env.PGDATABASE);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (value hidden)' : 'Not set');

async function checkDatabase() {
  try {
    const sql = postgres({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT, 10),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Connected to database successfully!');

    // Run a simple query to verify connection
    const result = await sql`SELECT current_database(), current_user`;
    console.log('Database info:', result);

    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Existing tables:', tables.length ? tables.map(t => t.table_name) : 'No tables found');

    // Initialize database if needed
    if (tables.length === 0) {
      console.log('No tables found. Initializing database...');
      try {
        // Read init-db.sql file if it exists
        if (fs.existsSync('./init-db.sql')) {
          const initSql = fs.readFileSync('./init-db.sql', 'utf8');
          await sql.unsafe(initSql);
          console.log('Database initialized from init-db.sql file');
        } else {
          console.log('init-db.sql file not found. Using schema from init-db.ts');
          
          // Run init-db.ts if available using node with tsx
          console.log('Running init-db.ts...');
          const { spawn } = await import('child_process');
          const child = spawn('npx', ['tsx', 'init-db.ts']);
          
          child.stdout.on('data', (data) => {
            console.log(`init-db.ts stdout: ${data}`);
          });
          
          child.stderr.on('data', (data) => {
            console.error(`init-db.ts stderr: ${data}`);
          });
          
          await new Promise((resolve) => {
            child.on('close', (code) => {
              console.log(`init-db.ts process exited with code ${code}`);
              resolve();
            });
          });
        }
      } catch (err) {
        console.error('Error initializing database:', err);
      }
    }

    await sql.end();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

checkDatabase().then(success => {
  if (success) {
    console.log('Database check completed successfully');
  } else {
    console.error('Database check failed');
  }
});