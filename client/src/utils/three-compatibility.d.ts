/**
 * Type declarations for Three.js compatibility layer
 */

import * as THREE from 'three';

// Re-export all THREE types
export * from 'three';

// Define ThreeCompat type as THREE plus our additions
declare const ThreeCompat: typeof THREE & {
  LinearEncoding: THREE.ColorSpace;
};

// Export default ThreeCompat
export default ThreeCompat;