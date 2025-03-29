/**
 * Three.js compatibility layer for newer versions
 * This creates a compatible version of THREE with missing constants
 */

import * as OriginalTHREE from 'three';

// Create a new object with all THREE properties
const THREE = { ...OriginalTHREE };

// Add back LinearEncoding for compatibility with older Three.js components
if (typeof THREE.LinearEncoding === 'undefined') {
  // In newer versions, LinearEncoding (0) was replaced with NoColorSpace or SRGBColorSpace
  THREE.LinearEncoding = THREE.NoColorSpace || 0;
  console.log('Applied Three.js compatibility patch: Added LinearEncoding');
}

// Export our compatible version to be used by components
export { THREE };