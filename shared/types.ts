/**
 * Shared Type Definitions
 * Types shared between client and server for EU AI Act Compliance Platform
 */

/**
 * Risk Levels according to EU AI Act
 */
export enum RiskLevel {
  UNACCEPTABLE = 'unacceptable',
  HIGH = 'high',
  LIMITED = 'limited',
  MINIMAL = 'minimal',
}

/**
 * AI System Registration Status
 */
export enum RegistrationStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive',
}

/**
 * Document Type Enum
 */
export enum DocumentType {
  TECHNICAL_DOCUMENTATION = 'technical_documentation',
  RISK_ASSESSMENT = 'risk_assessment',
  CONFORMITY_DECLARATION = 'conformity_declaration',
  HUMAN_OVERSIGHT_PROTOCOL = 'human_oversight_protocol',
  DATA_GOVERNANCE_POLICY = 'data_governance_policy',
  INCIDENT_RESPONSE_PLAN = 'incident_response_plan',
}

/**
 * Document Format Enum
 */
export enum DocumentFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  HTML = 'html',
  MARKDOWN = 'markdown',
}

/**
 * AI System Type Categorization
 */
export enum AISystemType {
  BIOMETRIC_IDENTIFICATION = 'biometric_identification',
  SOCIAL_SCORING = 'social_scoring',
  MEDICAL_DEVICE = 'medical_device',
  CRITICAL_INFRASTRUCTURE = 'critical_infrastructure',
  EDUCATION = 'education',
  EMPLOYMENT = 'employment',
  LAW_ENFORCEMENT = 'law_enforcement',
  GENERAL_PURPOSE = 'general_purpose',
}

/**
 * Confidence Level for AI Classifications
 */
export enum ConfidenceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNCERTAIN = 'uncertain',
}

/**
 * AI System Classification
 */
export interface AISystemClassification {
  systemType: AISystemType;
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
  reasoningNodes: string[];
}

/**
 * Document Generation Result
 */
export interface DocumentGenerationResult {
  id: string;
  title: string;
  documentType: DocumentType;
  content: string;
  format: DocumentFormat;
  createdAt: string;
  userId: string;
  systemId?: string;
  includesVisualization: boolean;
  includesReferences: boolean;
}

/**
 * Document Export Result
 */
export interface DocumentExportResult {
  id: string;
  filename: string;
  format: DocumentFormat;
  size: number;
  url: string;
}

/**
 * User Roles in the System
 */
export enum UserRole {
  ADMIN = 'admin',
  COMPLIANCE_OFFICER = 'compliance_officer',
  LEGAL_ADVISOR = 'legal_advisor',
  TECHNICAL_LEAD = 'technical_lead',
  BUSINESS_ANALYST = 'business_analyst',
  EXTERNAL_AUDITOR = 'external_auditor',
}

/**
 * Expert Review Type for assessments
 */
export enum ExpertReviewType {
  LEGAL = 'legal',
  TECHNICAL = 'technical',
  ETHICAL = 'ethical',
  COMPLIANCE = 'compliance',
}

/**
 * Expert Review Status for assessments
 */
export enum ExpertReviewStatus {
  REQUESTED = 'requested',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

/**
 * Training Module Category
 */
export enum TrainingModuleCategory {
  EU_AI_ACT_FUNDAMENTALS = 'eu_ai_act_fundamentals',
  RISK_ASSESSMENT = 'risk_assessment',
  COMPLIANCE_STRATEGIES = 'compliance_strategies',
  DOCUMENTATION_GUIDELINES = 'documentation_guidelines',
  ETHICAL_CONSIDERATIONS = 'ethical_considerations',
}

/**
 * Mapping confidence level to numeric score for processing
 */
export const confidenceLevelScore = {
  [ConfidenceLevel.HIGH]: 90,
  [ConfidenceLevel.MEDIUM]: 75,
  [ConfidenceLevel.LOW]: 60,
  [ConfidenceLevel.UNCERTAIN]: 50,
}

/**
 * Visualization data type for risk heatmap
 */
export interface RiskHeatmapData {
  name: string;
  value: number;
  riskLevel: RiskLevel;
}

/**
 * Visualization data type for compliance timeline
 */
export interface ComplianceTimelineData {
  date: string;
  complianceScore: number;
  targetScore: number;
}

/**
 * Document Template types
 */
export enum DocumentTemplateType {
  TECHNICAL_DOCUMENTATION = 'technical_documentation',
  RISK_ASSESSMENT = 'risk_assessment',
  COMPLIANCE_REPORT = 'compliance_report',
  DATA_GOVERNANCE = 'data_governance',
  EXECUTIVE_SUMMARY = 'executive_summary',
  CONFORMITY_DECLARATION = 'conformity_declaration',
  PRODUCT_INSTRUCTIONS = 'product_instructions',
  CUSTOM = 'custom'
}

/**
 * Document Template
 */
export interface DocumentTemplateData {
  id: number;
  templateId: string;
  name: string;
  description: string;
  type: DocumentTemplateType;
  content: string;
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  version: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Template Customization Request
 */
export interface TemplateCustomizationRequest {
  templateId: string;
  name: string;
  content: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Template Generation Options
 */
export interface TemplateGenerationOptions {
  companyName?: string;
  includeArticles?: boolean;
  relevantArticles?: any[];
  evidenceDocuments?: any[];
  includeHumanOversight?: boolean;
  includeDataGovernance?: boolean;
  includeRiskAssessment?: boolean;
  includePerformanceMetrics?: boolean;
  customSections?: string[];
}