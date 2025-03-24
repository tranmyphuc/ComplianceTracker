import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Read and display the SQL content
console.log('Copy the following SQL content to paste into inline-import.js:');
console.log('\n----- BEGIN SQL CONTENT -----\n');
const sqlContent = fs.readFileSync(latestExport, 'utf8');
console.log(sqlContent);
console.log('\n----- END SQL CONTENT -----\n');
console.log('Replace the placeholder SQL content in inline-import.js with the content above.');
console.log('Then run node inline-import.js in your deployed environment.');