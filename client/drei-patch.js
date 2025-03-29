/**
 * This script patches the @react-three/drei module to work with newer versions of Three.js
 * It's a temporary workaround until the drei library is updated
 */

const fs = require('fs');
const path = require('path');

// Path to the SpotLight component in drei
const spotlightPath = path.resolve(__dirname, '../node_modules/@react-three/drei/core/SpotLight.js');

// Check if the file exists
if (!fs.existsSync(spotlightPath)) {
  console.error('Error: SpotLight.js not found at path:', spotlightPath);
  process.exit(1);
}

// Read the file content
let spotlightContent = fs.readFileSync(spotlightPath, 'utf8');

// Original import that causes the issue
const originalImport = 'import { Vector3, SpotLight as TSpotLight, LinearEncoding } from \'three\';';

// New import without LinearEncoding
const newImport = 'import { Vector3, SpotLight as TSpotLight } from \'three\';\n// Polyfill for LinearEncoding\nconst LinearEncoding = 0; // 0 is the original value of LinearEncoding in Three.js';

// Replace the import
spotlightContent = spotlightContent.replace(originalImport, newImport);

// Write the modified content back to the file
try {
  fs.writeFileSync(spotlightPath, spotlightContent, 'utf8');
  console.log('Successfully patched SpotLight.js for Three.js compatibility');
} catch (error) {
  console.error('Error patching SpotLight.js:', error);
  process.exit(1);
}

// Check for other files that might use LinearEncoding
const dreiCorePath = path.resolve(__dirname, '../node_modules/@react-three/drei/core');
const dreiFiles = fs.readdirSync(dreiCorePath);

let patchedCount = 1; // We've already patched SpotLight.js

dreiFiles.forEach(file => {
  if (file.endsWith('.js') && file !== 'SpotLight.js') {
    const filePath = path.join(dreiCorePath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('LinearEncoding')) {
      console.log(`Found LinearEncoding in ${file}, patching...`);
      
      // Read the file content
      let fileContent = content;
      
      // Replace imports including LinearEncoding
      fileContent = fileContent.replace(
        /import\s+\{([^}]*?)LinearEncoding([^}]*?)\}\s+from\s+['"]three['"]/g,
        (match, before, after) => {
          return `import {${before}${after}} from 'three';\n// Polyfill for LinearEncoding\nconst LinearEncoding = 0;`;
        }
      );
      
      // Write the modified content back
      try {
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`Successfully patched ${file}`);
        patchedCount++;
      } catch (error) {
        console.error(`Error patching ${file}:`, error);
      }
    }
  }
});

console.log(`Finished patching ${patchedCount} files for Three.js compatibility`);