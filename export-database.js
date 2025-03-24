import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a directory for database exports if it doesn't exist
const exportDir = path.join(__dirname, 'db-exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir);
}

// Generate timestamp for unique filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const exportFile = path.join(exportDir, `db-export-${timestamp}.sql`);

// Use pg_dump to export the database
// This uses the DATABASE_URL from environment variables
console.log('Starting database export...');
exec(`pg_dump $DATABASE_URL -f ${exportFile}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Export error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Export stderr: ${stderr}`);
  }
  
  console.log(`Database successfully exported to: ${exportFile}`);
  
  // Create a latest symlink/copy for easy import
  const latestFile = path.join(exportDir, 'latest.sql');
  fs.copyFileSync(exportFile, latestFile);
  console.log(`Created copy at: ${latestFile}`);
  
  // Count records in each table
  console.log('Database export complete. Table statistics:');
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