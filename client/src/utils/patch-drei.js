/**
 * Patch for ThreeDrei SpotLight module
 * This monkey patches the ThreeDrei SpotLight module to work with newer versions of Three.js
 */

import path from 'path';
import fs from 'fs';

// Try to patch the SpotLight file
const patchSpotLight = () => {
  try {
    // Path to the SpotLight.js file (adjust if needed)
    const filePath = path.resolve('./node_modules/@react-three/drei/core/SpotLight.js');
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the import that includes LinearEncoding
    const oldImport = `import { Vector3, CylinderGeometry, Matrix4, WebGLRenderTarget, RGBAFormat, LinearEncoding, ShaderMaterial, DoubleSide, RepeatWrapping } from 'three';`;
    const newImport = `import { Vector3, CylinderGeometry, Matrix4, WebGLRenderTarget, RGBAFormat, NoColorSpace, ShaderMaterial, DoubleSide, RepeatWrapping } from 'three';`;
    
    // Replace all occurrences of LinearEncoding with NoColorSpace
    content = content.replace(/LinearEncoding/g, 'NoColorSpace');
    
    // Replace the import statement
    content = content.replace(oldImport, newImport);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log('Successfully patched @react-three/drei SpotLight module');
    return true;
  } catch (error) {
    console.error('Failed to patch @react-three/drei SpotLight module:', error);
    return false;
  }
};

// Run the patch
patchSpotLight();