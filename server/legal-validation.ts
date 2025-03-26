/**
 * Legal Validation Service
 * 
 * Provides validation and verification of AI-generated legal assessments and recommendations
 * for EU AI Act compliance. Implements the comprehensive approach described in the legal
 * oversight framework.
 */

import { AppError, ErrorType } from './error-handling';

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

/**
 * Analyzes AI-generated output for confidence indicators
 * Implements advanced uncertainty detection for legal assessments
 */
export function analyzeConfidence(text: string): ConfidenceLevel {
  // Phrases that indicate uncertainty in the assessment
  const uncertaintyPhrases = [
    'might be', 'possibly', 'could be', 'unclear', 'uncertain',
    'may be', 'potential', 'arguably', 'seems', 'appears to be',
    'not entirely clear', 'ambiguous', 'open to interpretation'
  ];
  
  // Phrases that indicate certainty in the assessment
  const certaintyPhrases = [
    'definitely', 'certainly', 'clearly', 'without doubt', 'unquestionably',
    'is required', 'must be', 'explicitly states', 'according to article',
    'precisely', 'specifically mandates', 'is prohibited'
  ];
  
  // Count uncertainty and certainty indicators
  const uncertaintyCount = uncertaintyPhrases.reduce(
    (count, phrase) => count + (text.toLowerCase().includes(phrase) ? 1 : 0), 0
  );
  
  const certaintyCount = certaintyPhrases.reduce(
    (count, phrase) => count + (text.toLowerCase().includes(phrase) ? 1 : 0), 0
  );
  
  // Determine confidence level based on counts
  if (uncertaintyCount > 3 && certaintyCount < 2) {
    return ConfidenceLevel.LOW;
  } else if (uncertaintyCount > 1 && certaintyCount >= 2) {
    return ConfidenceLevel.MEDIUM;
  } else if (uncertaintyCount <= 1 && certaintyCount >= 3) {
    return ConfidenceLevel.HIGH;
  } else {
    return ConfidenceLevel.MEDIUM; // Default to medium confidence
  }
}

/**
 * Validates references to EU AI Act articles in the assessment
 */
export function validateLegalReferences(text: string): { valid: boolean; invalidReferences: string[] } {
  // Regular expression to extract article references
  const referencePattern = /Article (\d+)(?:\((\d+)\))?(?:\s*(?:of the EU AI Act|of Regulation|EU AI Act))?/gi;
  const matches = [...text.matchAll(referencePattern)];
  
  // Extract articles and paragraphs
  const references = matches.map(match => ({
    article: match[1],
    paragraph: match[2] || null
  }));
  
  // Check if references are valid
  const validArticleRange = Array.from({ length: 85 }, (_, i) => `${i + 1}`); // Articles 1-85
  
  const invalidReferences = references.filter(ref => 
    !validArticleRange.includes(ref.article) || 
    (ref.paragraph && parseInt(ref.paragraph) > 10) // Assuming max 10 paragraphs per article
  ).map(ref => ref.paragraph ? `Article ${ref.article}(${ref.paragraph})` : `Article ${ref.article}`);
  
  return {
    valid: invalidReferences.length === 0,
    invalidReferences
  };
}

/**
 * Checks for contradictions in the legal assessment
 */
export function checkForContradictions(text: string): string[] {
  const contradictions: string[] = [];
  
  // Check for common contradictory statements
  const contradictionPatterns = [
    { pattern: /is high risk.*is not high risk/is, message: "Contradicting statements about high risk classification" },
    { pattern: /is prohibited.*is allowed/is, message: "Contradicting statements about prohibition" },
    { pattern: /must comply.*exempt from/is, message: "Contradicting statements about compliance requirements" },
    { pattern: /Article \d+ applies.*Article \d+ does not apply/is, message: "Contradicting statements about applicable articles" }
  ];
  
  for (const { pattern, message } of contradictionPatterns) {
    if (pattern.test(text)) {
      contradictions.push(message);
    }
  }
  
  return contradictions;
}

/**
 * Checks if all required sections are present in the assessment
 */
export function checkRequiredSections(text: string): string[] {
  const requiredSections = [
    { name: "Risk Classification", pattern: /risk (classification|category|level)/i },
    { name: "Required Actions", pattern: /(required|recommended|necessary) (actions|steps|measures)/i },
    { name: "Legal Basis", pattern: /(legal basis|according to article|based on the EU AI Act)/i },
    { name: "Limitations", pattern: /(limitations|constraints|restrictions|this (assessment|analysis) (does not|is not))/i }
  ];
  
  const missingSections = requiredSections.filter(section => !section.pattern.test(text))
    .map(section => section.name);
  
  return missingSections;
}

/**
 * Perform a comprehensive legal validation of the assessment
 */
export function validateLegalOutput(outputText: string): LegalValidationResult {
  const validationResult: LegalValidationResult = {
    isValid: true,
    confidenceLevel: ConfidenceLevel.MEDIUM,
    reviewStatus: ReviewStatus.VALIDATED,
    issues: [],
    warnings: [],
    reviewRequired: false,
    timestamp: new Date(),
    validator: 'system'
  };

  // 1. Analyze confidence level
  validationResult.confidenceLevel = analyzeConfidence(outputText);
  if (validationResult.confidenceLevel === ConfidenceLevel.LOW) {
    validationResult.warnings.push("Assessment contains high uncertainty language");
    validationResult.reviewStatus = ReviewStatus.REQUIRES_LEGAL_REVIEW;
    validationResult.reviewRequired = true;
  }
  
  // 2. Validate legal references
  const referenceValidation = validateLegalReferences(outputText);
  if (!referenceValidation.valid) {
    validationResult.issues.push(`Invalid legal references: ${referenceValidation.invalidReferences.join(', ')}`);
    validationResult.isValid = false;
    validationResult.reviewRequired = true;
  }
  
  // 3. Check for contradictions
  const contradictions = checkForContradictions(outputText);
  if (contradictions.length > 0) {
    validationResult.issues.push(...contradictions);
    validationResult.isValid = false;
    validationResult.reviewStatus = ReviewStatus.REQUIRES_LEGAL_REVIEW;
    validationResult.reviewRequired = true;
  }
  
  // 4. Check for required sections
  const missingSections = checkRequiredSections(outputText);
  if (missingSections.length > 0) {
    validationResult.issues.push(`Missing required sections: ${missingSections.join(', ')}`);
    validationResult.isValid = false;
    validationResult.reviewRequired = true;
  }
  
  return validationResult;
}

/**
 * Determine if an assessment requires expert legal review
 */
export function requiresExpertReview(assessment: any): boolean {
  // Risk-based review requirements
  if (assessment.riskLevel === 'high' || assessment.riskLevel === 'unacceptable') {
    return true;
  }
  
  // Confidence-based review requirements
  if (assessment.confidenceLevel === ConfidenceLevel.LOW || assessment.confidenceLevel === ConfidenceLevel.UNCERTAIN) {
    return true;
  }
  
  // Issue-based review requirements
  if (assessment.validation && (assessment.validation.issues.length > 0 || !assessment.validation.isValid)) {
    return true;
  }
  
  return false;
}

/**
 * Format assessment with legal disclaimer
 */
export function addLegalDisclaimer(assessment: any): any {
  // Clone the assessment to avoid modifying the original
  const assessmentWithDisclaimer = { ...assessment };
  
  // Add disclaimer based on validation results
  const confidenceLevel = assessment.confidenceLevel || ConfidenceLevel.MEDIUM;
  const reviewRequired = assessment.reviewRequired || false;
  
  // Create appropriate disclaimer
  let disclaimer = `<div class="legal-disclaimer alert alert-${reviewRequired ? 'warning' : 'info'}">
    <h4>Important Legal Notice</h4>
    <p>This assessment is provided for informational purposes only and does not constitute legal advice. 
    The analysis is generated by AI models with <strong>${confidenceLevel}</strong> confidence level and should be reviewed by qualified legal professionals 
    before making compliance decisions.</p>`;
  
  // Add additional warnings for review if needed
  if (reviewRequired) {
    disclaimer += `<p class="text-warning"><strong>This assessment requires professional legal review</strong> before implementation.</p>`;
  }
  
  // Add timestamp
  disclaimer += `<p class="text-sm">Assessment generated on ${new Date().toLocaleDateString()} based on current understanding of the EU AI Act.</p>
  </div>`;
  
  assessmentWithDisclaimer.legalDisclaimer = disclaimer;
  
  return assessmentWithDisclaimer;
}

/**
 * Queue an assessment for expert review
 */
export async function queueForExpertReview(assessment: any): Promise<string> {
  // In a real system, this would connect to a review management system
  // For now, we'll just return a review ID
  const reviewId = `review-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Log the review request
  console.log(`Assessment queued for expert review with ID: ${reviewId}`);
  
  // Update the assessment review status
  assessment.reviewStatus = ReviewStatus.PENDING_REVIEW;
  assessment.reviewId = reviewId;
  
  // In a real system, you would save this to a database, notify experts, etc.
  
  return reviewId;
}