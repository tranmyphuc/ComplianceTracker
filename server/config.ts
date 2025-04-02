/**
 * Configuration file for server settings
 */

// Environment variables
export const DB_URL = process.env.DATABASE_URL || '';

// Mode settings
export const devMode = process.env.NODE_ENV !== 'production';
export const enableDevAuth = true; // Set to true to enable development authentication
export const logRequests = true;

// API settings
export const apiSettings = {
  rateLimitMax: 100,
  rateLimitWindowMs: 60 * 1000, // 1 minute
};

// Auth settings
export const defaultAdmin = {
  uid: 'admin-uid',
  email: 'admin@example.com',
  username: 'admin',
  displayName: 'Admin User',
  role: 'admin',
  department: 'Information Technology'
};

// Feature flags for easier development
export const featureFlags = {
  enableAiSuggestions: true,
  enableRiskAssessment: true,
  enableApprovalWorkflow: true,
  enableLegalValidation: true,
  enableAuditTrail: true,
  enableReporting: true,
};