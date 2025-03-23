
/**
 * EU AI Act Compliance Platform - Backend Architecture
 * 
 * This file provides an overview of the backend architecture and component relationships.
 * It serves as documentation rather than executable code.
 */

/**
 * Architecture Overview:
 * 
 * 1. API Layer (routes.ts)
 *    - RESTful endpoints for client interactions
 *    - Request validation and error handling
 *    - Authentication and authorization middleware
 * 
 * 2. Service Layer
 *    - Business logic implementation
 *    - Separated by domain:
 *      - Risk Assessment (risk-assessment.ts)
 *      - System Registration (system-registration.ts)
 *      - Compliance Monitoring (continuous-monitoring.ts)
 *      - Document Management (document-generator.ts)
 *      - Knowledge Base (knowledge-base.ts)
 *      - Training (training-module.ts)
 *      - Reporting & Analytics (reporting.ts)
 * 
 * 3. Data Access Layer
 *    - Database interactions (storage.ts)
 *    - Schema definitions (shared/schema.ts)
 * 
 * 4. AI Integration Layer (ai-analysis.ts)
 *    - Integration with AI models
 *    - Risk classification
 *    - Content generation
 *    - Documentation analysis
 * 
 * 5. Utility Layer
 *    - Error handling (error-handling.ts)
 *    - Logging
 *    - Security utilities
 */

/**
 * Data Flow:
 * 
 * Client Request → API Routes → Service Layer → Data Access/AI Layer → Service Layer → Response
 * 
 * Authentication flow:
 * Request → Auth Middleware → Route Handler → Response
 */

export enum SystemModules {
  RISK_ASSESSMENT = 'risk_assessment',
  SYSTEM_REGISTRATION = 'system_registration',
  COMPLIANCE_MONITORING = 'compliance_monitoring',
  DOCUMENT_MANAGEMENT = 'document_management',
  KNOWLEDGE_BASE = 'knowledge_base',
  TRAINING = 'training',
  REPORTING = 'reporting'
}

export enum UserRoles {
  ADMIN = 'admin',
  COMPLIANCE_OFFICER = 'compliance_officer',
  SYSTEM_OWNER = 'system_owner',
  DEVELOPER = 'developer',
  LEGAL = 'legal',
  AUDITOR = 'auditor'
}

export enum RiskLevels {
  UNACCEPTABLE = 'unacceptable',
  HIGH = 'high',
  LIMITED = 'limited',
  MINIMAL = 'minimal'
}

/**
 * Module Dependencies:
 * 
 * Risk Assessment → System Registration, AI Analysis, Document Generator
 * Compliance Monitoring → Risk Assessment, System Registration
 * Reporting → All Modules
 * Training → Knowledge Base
 */
