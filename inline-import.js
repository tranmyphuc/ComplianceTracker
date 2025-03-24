import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create db-exports directory if it doesn't exist
const exportDir = path.join(__dirname, 'db-exports');
if (!fs.existsSync(exportDir)) {
  console.log('Creating db-exports directory...');
  fs.mkdirSync(exportDir, { recursive: true });
}

// Path for the SQL file
const sqlFilePath = path.join(exportDir, 'latest.sql');

// Check if SQL file already exists
if (!fs.existsSync(sqlFilePath)) {
  console.log('SQL export file does not exist. Creating it now...');
  
  // Paste your SQL export content here as a string
  const sqlContent = `
-- PASTE YOUR EXPORTED SQL CONTENT HERE
-- For example:
-- DROP TABLE IF EXISTS "users";
-- CREATE TABLE "users" (...)
  `;
  
  // Write SQL content to file
  fs.writeFileSync(sqlFilePath, sqlContent.trim());
  console.log('Created SQL file with inline content');
}

// Check database status
console.log('Checking if database exists and is accessible...');
exec('psql $DATABASE_URL -c "SELECT 1"', (error, stdout, stderr) => {
  if (error) {
    console.error(`Database connection error: ${error.message}`);
    console.error('Please ensure the database is created and DATABASE_URL is set correctly.');
    process.exit(1);
  }
  
  console.log('Database connection successful.');
  console.log('Proceeding with automatic import for deployment...');
  
  // Drop all tables and import fresh data
  dropTablesAndImport();
});

function dropTablesAndImport() {
  console.log('Dropping all existing tables...');
  exec('psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"', 
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error dropping tables: ${error.message}`);
        process.exit(1);
      }
      
      console.log('All tables dropped successfully.');
      importDatabase();
    });
}

function importDatabase() {
  console.log(`Importing database from ${sqlFilePath}...`);
  exec(`psql $DATABASE_URL < ${sqlFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Import error: ${error.message}`);
      process.exit(1);
    }
    
    if (stderr) {
      console.error(`Import warnings: ${stderr}`);
    }
    
    console.log('Database import completed successfully.');
    
    // Display table statistics
    console.log('Table statistics after import:');
    exec(`psql $DATABASE_URL -c "
      SELECT 
        table_name, 
        pg_size_pretty(pg_relation_size('public.' || table_name)) as size,
        pg_total_relation_size('public.' || table_name) as total_bytes
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    "`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Stats error: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  });
}