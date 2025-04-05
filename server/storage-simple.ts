/**
 * Storage module
 * 
 * Handles database operations for the EU AI Act Compliance Platform.
 * Uses DatabaseStorage from db-storage.ts to ensure application functionality.
 */

// Import and re-export the database storage from db-storage.ts
import { dbStorage } from "./db-storage";

// Export the database storage as the primary storage interface
export const storage = dbStorage;

// Export the IStorage interface for type checking
export { IStorage } from "./db-storage";