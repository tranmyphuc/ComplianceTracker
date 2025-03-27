/**
 * Script to run deployment preparation steps in sequence
 */
const { exec } = require('child_process');

// Command to run
const commands = [
  'npm run build',
  'node deploy-import-database.js',
  'echo "Build and database initialization completed. Ready for deployment."'
];

// Run commands in sequence
async function runDeployment() {
  try {
    for (const command of commands) {
      console.log(`Running: ${command}`);
      await executeCommand(command);
    }
    
    console.log('\n=== DEPLOYMENT PREPARATION COMPLETED ===');
    console.log('You can now deploy the application using Replit Deployments.');
    console.log('1. Click the "Deploy" button in Replit interface');
    console.log('2. Select your branch');
    console.log('3. Set the run command to: npm run start');
    console.log('4. Click "Deploy" to start the deployment process');
    
  } catch (error) {
    console.error('Deployment preparation failed:', error);
    process.exit(1);
  }
}

// Execute a command and return a promise
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error);
        return reject(error);
      }
      
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      resolve();
    });
  });
}

// Run the deployment preparation
runDeployment();