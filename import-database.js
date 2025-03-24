import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the latest database export
const exportDir = path.join(__dirname, 'db-exports');
const latestExport = path.join(exportDir, 'latest.sql');

// Check if export file exists
if (!fs.existsSync(latestExport)) {
  console.error('Database export file not found!');
  console.error(`Expected at: ${latestExport}`);
  console.error('Please run node export-database.js first to create an export file.');
  process.exit(1);
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
  
  // Check if tables already exist
  console.log('Checking for existing tables...');
  exec('psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = \'public\'"', 
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Table check error: ${error.message}`);
        process.exit(1);
      }
      
      const tableCount = parseInt(stdout.toString().split('\n')[2].trim());
      
      if (tableCount > 0) {
        console.log(`Found ${tableCount} existing tables.`);
        rl.question('Do you want to drop all existing tables and import fresh data? (y/N) ', (answer) => {
          if (answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes') {
            dropTablesAndImport();
          } else {
            console.log('Import cancelled. Exiting.');
            rl.close();
            process.exit(0);
          }
        });
      } else {
        console.log('No existing tables found. Proceeding with import...');
        importDatabase();
      }
    });
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
  console.log(`Importing database from ${latestExport}...`);
  exec(`psql $DATABASE_URL < ${latestExport}`, (error, stdout, stderr) => {
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
      rl.close();
    });
  });
}