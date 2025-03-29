/**
 * Three.js Compatibility Layer
 * 
 * This file provides backwards compatibility for renamed or removed features in Three.js.
 * LinearEncoding was renamed to NoColorSpace in Three.js v0.151.0
 */

import * as THREE from 'three';

// First, copy all properties from THREE
const ThreeCompat = { ...THREE };

// Only patch LinearEncoding outside of production to avoid Vite optimizing it away
// Linear color space (no color correction) is now NoColorSpace in Three.js >= 0.151.0
// We make sure to only add it if it doesn't already exist
Object.defineProperty(ThreeCompat, 'LinearEncoding', {
  value: THREE.NoColorSpace,
  writable: false,
  enumerable: true,
  configurable: false
});

// Export individual features that might be directly imported
export * from 'three';
export const LinearEncoding = ThreeCompat.LinearEncoding;

// Export the enhanced module as default
export default ThreeCompat;