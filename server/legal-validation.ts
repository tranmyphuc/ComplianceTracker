/**
 * Legal Validation Service
 * 
 * Provides validation and verification of AI-generated legal assessments and recommendations
 * for EU AI Act compliance. Implements the comprehensive approach described in the legal
 * oversight framework.
 */

import { Request, Response } from 'express';
import { db } from './db';
import { ValidationError } from './error-handling';
import { z } from 'zod';

export enum ConfidenceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNCERTAIN = 'uncertain'
}

export enum ReviewStatus {
  VALIDATED = 'validated',
  PENDING_REVIEW = 'pending_review',
  REQUIRES_LEGAL_REVIEW = 'requires_legal_review',
  OUTDATED = 'outdated'
}

export interface LegalValidationResult {
  isValid: boolean;
  confidenceLevel: ConfidenceLevel;
  reviewStatus: ReviewStatus;
  issues: string[];
  warnings: string[];
  reviewRequired: boolean;
  timestamp: Date;
  validator: 'ai' | 'expert' | 'system';
  validationNotes?: string;
}

export const validationRequestSchema = z.object({
  text: z.string().min(1, "Assessment text is required"),
  type: z.enum(['assessment', 'document', 'recommendation', 'training']),
  context: z.object({
    systemId: z.string().optional(),
    documentId: z.string().optional(),
    assessmentId: z.string().optional(),
    moduleId: z.string().optional()
  }).optional()
});

/**
 * Analyzes AI-generated output for confidence indicators
 * Implements advanced uncertainty detection for legal assessments
 */
export function analyzeConfidence(text: string): ConfidenceLevel {
  if (!text) return ConfidenceLevel.UNCERTAIN;
  
  const text_lower = text.toLowerCase();
  
  // Detect uncertainty markers
  const uncertaintyMarkers = [
    'uncertain', 'unclear', 'ambiguous', 'might', 'may', 'could', 
    'possibly', 'perhaps', 'appear to', 'seem to', 'potentially',
    'not entirely clear', 'difficult to determine', 'hard to assess'
  ];
  
  // Detect hedging language
  const hedgingLanguage = [
    'generally', 'typically', 'usually', 'often', 'in most cases',
    'tends to', 'likely', 'probable', 'can be considered'
  ];
  
  // Detect contradiction indicators
  const contradictionIndicators = [
    'however', 'although', 'nevertheless', 'on the other hand',
    'conversely', 'in contrast', 'yet', 'but', 'despite'
  ];
  
  // Count occurrences
  const uncertaintyCount = uncertaintyMarkers.filter(marker => 
    text_lower.includes(marker)).length;
    
  const hedgingCount = hedgingLanguage.filter(phrase => 
    text_lower.includes(phrase)).length;
    
  const contradictionCount = contradictionIndicators.filter(indicator => 
    text_lower.includes(indicator)).length;
  
  // Simple scoring system
  const totalMarkers = uncertaintyCount + hedgingCount + (contradictionCount * 2);
  const textLength = text.length;
  const normalizedScore = (totalMarkers / (textLength / 1000)) * 3; // Adjust for text length
  
  // Assign confidence level based on score
  if (normalizedScore > 5 || contradictionCount > 3) {
    return ConfidenceLevel.LOW;
  } else if (normalizedScore > 2 || contradictionCount > 1) {
    return ConfidenceLevel.MEDIUM; 
  } else {
    return ConfidenceLevel.HIGH;
  }
}

/**
 * Validates references to EU AI Act articles in the assessment
 */
export function validateLegalReferences(text: string): { valid: boolean; invalidReferences: string[] } {
  if (!text) return { valid: true, invalidReferences: [] };
  
  const text_lower = text.toLowerCase();
  
  // Simple regex to find article references
  const articlePattern = /article\s+(\d+[a-z]?(\(\d+\))?)/gi;
  const matches = [...text_lower.matchAll(articlePattern)];
  
  // List of valid EU AI Act articles (simplified for demo)
  const validArticles = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
    '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
    '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
    '81', '82', '83'
  ];
  
  const invalidReferences: string[] = [];
  
  matches.forEach(match => {
    const articleNumber = match[1].replace(/\(\d+\)/g, '').trim();
    if (!validArticles.includes(articleNumber)) {
      invalidReferences.push(`Article ${articleNumber}`);
    }
  });
  
  return {
    valid: invalidReferences.length === 0,
    invalidReferences: [...new Set(invalidReferences)] // Remove duplicates
  };
}

/**
 * Checks for contradictions in the legal assessment
 */
export function checkForContradictions(text: string): string[] {
  if (!text) return [];
  
  const contradictions: string[] = [];
  
  // Simple patterns that might indicate contradictions
  const sections = text.split(/\n\n|\r\n\r\n/);
  
  // Look for statements that contradict each other
  const mustPatterns = [
    { pattern: /must ([\w\s]+)/gi, type: 'requirement' },
    { pattern: /required to ([\w\s]+)/gi, type: 'requirement' },
    { pattern: /shall ([\w\s]+)/gi, type: 'requirement' },
    { pattern: /is not ([\w\s]+)/gi, type: 'prohibition' },
    { pattern: /cannot ([\w\s]+)/gi, type: 'prohibition' },
    { pattern: /exempt from ([\w\s]+)/gi, type: 'exemption' }
  ];
  
  const requirements: string[] = [];
  const prohibitions: string[] = [];
  const exemptions: string[] = [];
  
  mustPatterns.forEach(({ pattern, type }) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      if (type === 'requirement') requirements.push(match[1].trim().toLowerCase());
      if (type === 'prohibition') prohibitions.push(match[1].trim().toLowerCase());
      if (type === 'exemption') exemptions.push(match[1].trim().toLowerCase());
    });
  });
  
  // Check for contradicting requirements/prohibitions
  requirements.forEach(req => {
    const contradictingReq = prohibitions.find(p => 
      req.includes(p) || p.includes(req) || 
      req.replace('not', '').trim() === p.replace('not', '').trim()
    );
    
    if (contradictingReq) {
      contradictions.push(`Contradicting requirements detected: must ${req} vs. cannot ${contradictingReq}`);
    }
  });
  
  return contradictions;
}

/**
 * Checks if all required sections are present in the assessment
 */
export function checkRequiredSections(text: string): string[] {
  if (!text) return ['Empty assessment text'];
  
  // Required sections for a compliant assessment
  const requiredSections = [
    { name: 'Risk Classification', patterns: [/risk classification/i, /risk level/i, /risk category/i] },
    { name: 'Applicable Articles', patterns: [/applicable articles/i, /relevant articles/i, /eu ai act articles/i] },
    { name: 'Required Documentation', patterns: [/required documentation/i, /necessary documents/i, /documentation requirements/i] },
    { name: 'Implementation Steps', patterns: [/implementation steps/i, /compliance steps/i, /next steps/i] }
  ];
  
  const missingSections: string[] = [];
  
  requiredSections.forEach(section => {
    const sectionFound = section.patterns.some(pattern => pattern.test(text));
    if (!sectionFound) {
      missingSections.push(`Missing required section: ${section.name}`);
    }
  });
  
  return missingSections;
}

/**
 * Perform a comprehensive legal validation of the assessment
 */
export function validateLegalOutput(outputText: string): LegalValidationResult {
  const validationResult: LegalValidationResult = {
    isValid: false,
    confidenceLevel: ConfidenceLevel.UNCERTAIN,
    reviewStatus: ReviewStatus.PENDING_REVIEW,
    issues: [],
    warnings: [],
    reviewRequired: false,
    timestamp: new Date(),
    validator: 'ai'
  };

  if (!outputText) {
    validationResult.issues.push('Empty assessment text');
    validationResult.reviewStatus = ReviewStatus.REQUIRES_LEGAL_REVIEW;
    validationResult.reviewRequired = true;
    validationResult.validator = 'system';
    return validationResult;
  }

  // Analyze confidence
  validationResult.confidenceLevel = analyzeConfidence(outputText);
  
  // Validate legal references
  const { valid: validReferences, invalidReferences } = validateLegalReferences(outputText);
  if (!validReferences) {
    for (const ref of invalidReferences) {
      validationResult.issues.push(`Invalid reference: ${ref}`);
    }
  }
  
  // Check for contradictions
  const contradictions = checkForContradictions(outputText);
  validationResult.issues.push(...contradictions);
  
  // Check required sections
  const missingSections = checkRequiredSections(outputText);
  validationResult.issues.push(...missingSections);
  
  // Add warnings based on confidence level
  if (validationResult.confidenceLevel === ConfidenceLevel.MEDIUM) {
    validationResult.warnings.push('Medium confidence detected. Consider expert review for critical decisions.');
  } else if (validationResult.confidenceLevel === ConfidenceLevel.LOW) {
    validationResult.warnings.push('Low confidence detected. Expert review recommended.');
  }
  
  // Determine review status and validity
  if (validationResult.confidenceLevel === ConfidenceLevel.LOW || validationResult.issues.length > 2) {
    validationResult.reviewStatus = ReviewStatus.REQUIRES_LEGAL_REVIEW;
    validationResult.reviewRequired = true;
  } else if (validationResult.confidenceLevel === ConfidenceLevel.MEDIUM || validationResult.issues.length > 0) {
    validationResult.reviewStatus = ReviewStatus.PENDING_REVIEW;
    validationResult.reviewRequired = true;
  } else {
    validationResult.reviewStatus = ReviewStatus.VALIDATED;
    validationResult.isValid = true;
  }
  
  validationResult.validationNotes = validationResult.issues.length > 0 ? 
    'Automated validation detected issues that should be addressed before proceeding.' : 
    'Automated validation complete. No significant issues detected.';
  
  return validationResult;
}

/**
 * Determine if an assessment requires expert legal review
 */
export function requiresExpertReview(assessment: any): boolean {
  if (!assessment) return true;
  
  // Conditions that trigger expert review
  const riskLevel = assessment.riskLevel?.toLowerCase() || '';
  const highRiskTerms = ['high', 'unacceptable'];
  
  // Check if it's a high-risk AI system
  const isHighRisk = highRiskTerms.some(term => riskLevel.includes(term));
  
  // Simplified checks for demo purposes
  if (isHighRisk) return true;
  
  if (typeof assessment === 'string') {
    const text = assessment;
    const confidence = analyzeConfidence(text);
    const contradictions = checkForContradictions(text);
    
    return (
      confidence === ConfidenceLevel.LOW ||
      confidence === ConfidenceLevel.UNCERTAIN ||
      contradictions.length > 0
    );
  } else if (typeof assessment === 'object') {
    // If it's a structured assessment, check for critical fields
    return !assessment.systemCategory || 
           !assessment.euAiActArticles || 
           assessment.euAiActArticles.length === 0;
  }
  
  return false;
}

/**
 * Format assessment with legal disclaimer
 */
export function addLegalDisclaimer(assessment: any): any {
  const disclaimerText = "This assessment is provided for informational purposes only and does not constitute legal advice. The analysis is generated by AI models and should be reviewed by qualified legal professionals before making compliance decisions.";
  
  if (typeof assessment === 'string') {
    return `${disclaimerText}\n\n${assessment}`;
  } else if (typeof assessment === 'object') {
    return {
      ...assessment,
      disclaimer: disclaimerText
    };
  }
  
  return assessment;
}

/**
 * Queue an assessment for expert review
 */
export async function queueForExpertReview(assessment: any): Promise<string> {
  // In a real system, this would create a database entry for legal expert review
  // and potentially trigger notifications
  
  const reviewId = `review-${Date.now()}`;
  
  // For now, we'll just return a review ID
  return reviewId;
}

/**
 * Validate assessment text and return validation results
 */
export const validateAssessmentText = async (req: Request, res: Response) => {
  try {
    const validationRequest = validationRequestSchema.safeParse(req.body);
    
    if (!validationRequest.success) {
      throw new ValidationError('Invalid validation request', validationRequest.error);
    }
    
    const { text, type, context } = validationRequest.data;
    
    // Perform validation
    const validationResult = validateLegalOutput(text);
    
    // Queue for expert review if required
    if (validationResult.reviewRequired) {
      const reviewId = await queueForExpertReview({
        text,
        type,
        context,
        validationResult
      });
      
      // Add review ID to result
      validationResult.validationNotes = 
        `${validationResult.validationNotes || ''} Review ID: ${reviewId}`;
    }
    
    res.json({
      success: true,
      result: validationResult
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Add legal disclaimer to content
 */
export const addLegalDisclaimerToContent = async (req: Request, res: Response) => {
  try {
    const { content, type } = req.body;
    
    if (!content) {
      throw new ValidationError('Content is required');
    }
    
    const contentWithDisclaimer = addLegalDisclaimer(content);
    
    res.json({
      success: true,
      content: contentWithDisclaimer
    });
  } catch (error) {
    console.error('Legal disclaimer error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};