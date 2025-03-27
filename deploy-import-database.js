/**
 * Script to initialize database with demo data for deployment
 */
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { db } = require('./server/db');

/**
 * Run initialization steps in sequence
 */
async function initializeDatabase() {
  try {
    console.log('Starting database initialization for deployment...');
    
    // Step 1: Check database connection
    console.log('Step 1: Checking database connection...');
    await runScript('node check-db.js');
    
    // Step 2: Initialize database schema
    console.log('Step 2: Initializing database schema...');
    await runScript('npx tsx init-db.ts');
    
    // Step 3: Create demo users for different roles
    console.log('Step 3: Creating demo users for different roles...');
    await runScript('node create-demo-users.js');
    
    // Step 4: Seed training modules with interactive content
    console.log('Step 4: Seeding training modules with interactive content...');
    await runScript('node seed-training-modules.js');
    
    console.log('Database initialization completed successfully!');
    console.log('\nYou can now deploy the application and use the demo accounts:');
    console.log('- Admin: admin@demo.com / Admin123!');
    console.log('- Technical: technical@demo.com / Technical123!');
    console.log('- Legal: legal@demo.com / Legal123!');
    console.log('- Decision Maker: decision@demo.com / Decision123!');
    console.log('- Operator: operator@demo.com / Operator123!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

/**
 * Run a script and return a promise
 */
function runScript(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${command}:`, error);
        return reject(error);
      }
      
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      resolve();
    });
  });
}

// Run the initialization process
initializeDatabase();