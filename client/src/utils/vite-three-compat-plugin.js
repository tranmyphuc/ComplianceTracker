/**
 * Vite plugin to fix Three.js compatibility issues in dependencies
 * This plugin applies patches to resolve Three.js version issues with libraries like @react-three/drei
 */

import fs from 'fs';
import path from 'path';

export default function threeCompatibilityPlugin() {
  let patched = false;
  
  return {
    name: 'vite-plugin-three-compatibility',
    enforce: 'pre',
    
    buildStart() {
      if (!patched) {
        patchSpotLight();
        patched = true;
      }
    },
  };
}

// Function to patch the SpotLight.js file from @react-three/drei
function patchSpotLight() {
  try {
    // Path to the SpotLight.js file
    const filePath = path.resolve('./node_modules/@react-three/drei/core/SpotLight.js');
    
    if (!fs.existsSync(filePath)) {
      console.warn('Could not find SpotLight.js file to patch');
      return false;
    }
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it's already patched
    if (content.includes('NoColorSpace')) {
      console.log('SpotLight.js already patched');
      return true;
    }
    
    // Replace the import that includes LinearEncoding
    const oldImport = `import { Vector3, CylinderGeometry, Matrix4, WebGLRenderTarget, RGBAFormat, LinearEncoding, ShaderMaterial, DoubleSide, RepeatWrapping } from 'three';`;
    const newImport = `import { Vector3, CylinderGeometry, Matrix4, WebGLRenderTarget, RGBAFormat, NoColorSpace, ShaderMaterial, DoubleSide, RepeatWrapping } from 'three';`;
    
    // Replace occurrences of LinearEncoding with NoColorSpace
    content = content.replace(/LinearEncoding/g, 'NoColorSpace');
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log('Successfully patched @react-three/drei SpotLight module');
    return true;
  } catch (error) {
    console.error('Failed to patch @react-three/drei SpotLight module:', error);
    return false;
  }
}