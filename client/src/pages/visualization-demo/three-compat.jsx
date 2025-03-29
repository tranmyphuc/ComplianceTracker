/**
 * This file serves as an entry point for the visualization demo page
 * It imports the Three.js compatibility shim first before any Three.js components
 */

// Import our compatibility layer first
import '../../shims/three-compat';

// Re-export the visualization demo
export { default } from './index';