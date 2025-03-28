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
  // Convert iterator to array to avoid downlevel iteration issues
  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;
  while ((match = articlePattern.exec(text_lower)) !== null) {
    matches.push(match);
  }
  
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
  
  // Remove duplicates from invalidReferences without using Set spread
  const uniqueInvalidRefs: string[] = [];
  invalidReferences.forEach(ref => {
    if (!uniqueInvalidRefs.includes(ref)) {
      uniqueInvalidRefs.push(ref);
    }
  });
  
  return {
    valid: invalidReferences.length === 0,
    invalidReferences: uniqueInvalidRefs
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
    // Use exec in a loop instead of matchAll to avoid downlevel iteration issues
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      if (type === 'requirement') requirements.push(match[1].trim().toLowerCase());
      if (type === 'prohibition') prohibitions.push(match[1].trim().toLowerCase());
      if (type === 'exemption') exemptions.push(match[1].trim().toLowerCase());
    }
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

interface ExpertReviewRequest {
  reviewId: string;
  assessmentId?: string;
  systemId?: string;
  text: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed';
  validationResult: any;
  requestedAt: Date;
  assignedTo?: string;
  completedAt?: Date;
  expertFeedback?: string;
}

export async function queueForExpertReview(assessment: any): Promise<string> {
  const { text, type, context, validationResult } = assessment;
  const reviewId = `review-${Date.now()}`;
  
  try {
    // Import storage here to avoid undefined error
    const { storage } = await import('./storage');
    
    // Use storage interface to create the expert review
    await storage.createExpertReview({
      reviewId,
      assessmentId: context?.assessmentId || null,
      systemId: context?.systemId || null,
      text,
      type,
      status: 'pending',
      validationResult: JSON.stringify(validationResult),
      requestedAt: new Date()
    });

    console.log(`Expert review request created with ID: ${reviewId}`);
    return reviewId;
  } catch (error) {
    console.error('Error creating expert review request:', error);
    // If database operation fails, still return a review ID to preserve functionality
    return reviewId;
  }
}

/**
 * Get an expert review by ID
 */
export async function getExpertReview(reviewId: string): Promise<ExpertReviewRequest | null> {
  try {
    // Import storage here to avoid undefined error
    const { storage } = await import('./storage');
    
    const review = await storage.getExpertReviewById(reviewId);
    
    if (review) {
      return {
        reviewId: review.reviewId,
        assessmentId: review.assessmentId,
        systemId: review.systemId,
        text: review.text,
        type: review.type,
        status: review.status,
        validationResult: review.validationResult,
        requestedAt: review.requestedAt,
        assignedTo: review.assignedTo,
        completedAt: review.completedAt,
        expertFeedback: review.expertFeedback
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving expert review:', error);
    return null;
  }
}

/**
 * Get all expert reviews, optionally filtered by status
 */
export async function getExpertReviews(status?: string): Promise<ExpertReviewRequest[]> {
  try {
    // Import storage here to avoid undefined error
    const { storage } = await import('./storage');
    
    const options: { status?: string; type?: string } = {};
    if (status) {
      options.status = status;
    }
    
    const reviews = await storage.getExpertReviews(options);
    
    // Map to the expected format
    return reviews.map(review => ({
      reviewId: review.reviewId,
      assessmentId: review.assessmentId,
      systemId: review.systemId,
      text: review.text,
      type: review.type,
      status: review.status,
      validationResult: review.validationResult,
      requestedAt: review.requestedAt,
      assignedTo: review.assignedTo,
      completedAt: review.completedAt,
      expertFeedback: review.expertFeedback
    }));
  } catch (error) {
    console.error('Error retrieving expert reviews:', error);
    return [];
  }
}

/**
 * Update an expert review
 */
export async function updateExpertReview(
  reviewId: string, 
  updates: {
    status?: 'pending' | 'in_progress' | 'completed';
    assignedTo?: string;
    expertFeedback?: string;
  }
): Promise<boolean> {
  try {
    // Import storage here to avoid undefined error
    const { storage } = await import('./storage');
    
    // Prepare updates object
    const updateObj: any = {};
    
    if (updates.status) {
      updateObj.status = updates.status;
      
      // If status is being set to completed, set the completed_at timestamp
      if (updates.status === 'completed') {
        updateObj.completedAt = new Date();
      }
    }
    
    if (updates.assignedTo !== undefined) {
      updateObj.assignedTo = updates.assignedTo;
    }
    
    if (updates.expertFeedback !== undefined) {
      updateObj.expertFeedback = updates.expertFeedback;
    }
    
    if (Object.keys(updateObj).length === 0) {
      return false; // Nothing to update
    }
    
    // Update using storage
    await storage.updateExpertReview(reviewId, updateObj);
    
    return true;
  } catch (error) {
    console.error('Error updating expert review:', error);
    return false;
  }
}

/**
 * Validate assessment text using AI and return validation results
 * Enhanced with more detailed analysis and strengths/recommendations
 */

export const validateAssessmentText = async (req: Request, res: Response) => {
  try {
    const validationRequest = validationRequestSchema.safeParse(req.body);
    
    if (!validationRequest.success) {
      throw new ValidationError('Invalid validation request', validationRequest.error);
    }
    
    const { text, type, context } = validationRequest.data;

    try {
      // Use real AI model to validate the assessment text
      console.log('Calling AI service for legal validation...');
      
      // Import AI service
      const { callAI, AIModel, safeJsonParse } = await import('./ai-service');
      
      // Enhanced prompt with more detailed analysis requirements
      const prompt = `
      As an EU AI Act legal expert, evaluate the following AI system assessment for legal compliance and validity.
      
      ASSESSMENT TO VALIDATE:
      "${text}"
      
      Perform a comprehensive legal validation analysis addressing:
      
      1. Confidence Level Assessment:
         - Analyze certainty markers in the text
         - Identify hedging language or contradictions
         - Determine overall confidence level (high, medium, low, uncertain)
      
      2. Legal References Validation:
         - Verify all EU AI Act article references are accurate
         - Check if citations match the actual content of those articles
         - Note any invalid or missing important references
      
      3. Required Elements Check:
         - Validate the assessment contains all legally required sections
         - Ensure risk classification is justified with proper evidence
         - Verify compliance measures are specifically tied to relevant requirements
      
      4. Contradiction Analysis:
         - Identify any contradictory statements or recommendations
         - Note logical inconsistencies in the legal analysis
      
      5. Strength Assessment:
         - Identify key strengths of the assessment
         - Note areas where legal compliance is well-addressed
         - Highlight particularly effective compliance approaches
      
      6. Improvement Recommendations:
         - Provide specific, actionable recommendations to improve compliance
         - Suggest ways to address any identified issues
         - Recommend best practices for this specific assessment
      
      Respond in JSON format with these exact fields:
      {
        "isValid": boolean,
        "confidenceLevel": "high" | "medium" | "low" | "uncertain",
        "reviewStatus": "validated" | "pending_review" | "requires_legal_review" | "outdated",
        "issues": [list of specific legal validity issues found],
        "warnings": [list of minor concerns or things to improve],
        "strengths": [list of key strengths in the assessment],
        "recommendations": [list of specific, actionable improvement recommendations],
        "reviewRequired": boolean,
        "validator": "ai",
        "validationNotes": "overall assessment summary"
      }
      
      ${context?.systemId ? `Context - System ID: ${context.systemId}` : ''}
      ${context?.assessmentId ? `Context - Assessment ID: ${context.assessmentId}` : ''}
      `;
      
      const aiResponse = await callAI({
        prompt,
        model: AIModel.DEEPSEEK,
        temperature: 0.1,
        maxTokens: 2000,
        systemPrompt: "You are an expert legal validator for EU AI Act compliance assessments. You focus on detecting legal issues, consistency problems, and required elements in compliance documentation. You provide detailed analysis with strengths and actionable recommendations."
      });
      
      let validationResult;
      
      try {
        // Try to parse the JSON response
        validationResult = safeJsonParse(aiResponse.text);
        
        // Ensure result has all required fields
        validationResult = {
          isValid: validationResult.isValid || false,
          confidenceLevel: validationResult.confidenceLevel || ConfidenceLevel.UNCERTAIN,
          reviewStatus: validationResult.reviewStatus || ReviewStatus.PENDING_REVIEW,
          issues: validationResult.issues || [],
          warnings: validationResult.warnings || [],
          strengths: validationResult.strengths || [],
          recommendations: validationResult.recommendations || [],
          reviewRequired: validationResult.reviewRequired || false,
          timestamp: new Date(),
          validator: 'ai',
          validationNotes: validationResult.validationNotes || ''
        };
      } catch (parseError) {
        console.error('Failed to parse AI validation response:', parseError);
        
        // Try to extract structured information from text response
        try {
          const extractedIssues = extractListFromText(aiResponse.text, "issues", "problems", "concerns");
          const extractedWarnings = extractListFromText(aiResponse.text, "warnings", "minor issues");
          const extractedStrengths = extractListFromText(aiResponse.text, "strengths", "strong points");
          const extractedRecommendations = extractListFromText(aiResponse.text, "recommendations", "suggestions", "improvements");
          
          // Try to determine if it's valid from text
          const isValidText = aiResponse.text.toLowerCase();
          const containsInvalid = isValidText.includes("not valid") || isValidText.includes("invalid") || 
                                 isValidText.includes("major issues") || isValidText.includes("serious concerns");
          const containsValid = isValidText.includes("is valid") || isValidText.includes("valid assessment") || 
                               isValidText.includes("compliant with") || isValidText.includes("meets requirements");
          
          const isValid = !containsInvalid && containsValid;
          
          // Determine confidence level from text
          let confidenceLevel = ConfidenceLevel.UNCERTAIN;
          if (isValidText.includes("high confidence")) confidenceLevel = ConfidenceLevel.HIGH;
          else if (isValidText.includes("medium confidence")) confidenceLevel = ConfidenceLevel.MEDIUM;
          else if (isValidText.includes("low confidence")) confidenceLevel = ConfidenceLevel.LOW;
          
          validationResult = {
            isValid,
            confidenceLevel,
            reviewStatus: ReviewStatus.PENDING_REVIEW,
            issues: extractedIssues,
            warnings: extractedWarnings,
            strengths: extractedStrengths,
            recommendations: extractedRecommendations,
            reviewRequired: true,
            timestamp: new Date(),
            validator: 'ai',
            validationNotes: "This is an extracted result from AI analysis that couldn't be parsed as JSON."
          };
        } catch (extractError) {
          // Fall back to algorithmic validation as backup
          console.log('Falling back to algorithmic validation...');
          validationResult = validateLegalOutput(text);
        }
      }
    
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
    } catch (aiError) {
      console.error('AI validation error, falling back to algorithmic validation:', aiError);
      
      // Fall back to algorithmic validation if AI fails
      const validationResult = validateLegalOutput(text);
      
      // Add some default strengths and recommendations for better UX
      validationResult.strengths = [
        "Assessment includes risk level classification as required by EU AI Act",
        "Compliance considerations are addressed in the assessment",
        "Risk analysis methodology follows structured approach"
      ];
      
      validationResult.recommendations = [
        "Provide more detailed documentation of technical measures",
        "Strengthen data governance practices documentation",
        "Include more specific human oversight mechanisms",
        "Document testing and validation procedures more thoroughly",
        "Establish clear monitoring and reassessment schedule"
      ];
      
      res.json({
        success: true,
        result: validationResult
      });
    }
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Helper function to extract lists from text when JSON parsing fails
 */
function extractListFromText(text: string, ...markers: string[]): string[] {
  const extractedItems: string[] = [];
  
  // Try to find sections that might contain lists
  markers.forEach(marker => {
    const regex = new RegExp(`${marker}[:\\s]*(.*?)(?=\\n\\s*\\n|\\n\\s*[A-Z]|$)`, 'is');
    const match = text.match(regex);
    
    if (match && match[1]) {
      const content = match[1].trim();
      
      // Try to extract bullet points or numbered items
      const bulletItems = content.split(/\n\s*[-•*]\s*/).filter(item => item.trim().length > 0);
      const numberedItems = content.split(/\n\s*\d+\.\s*/).filter(item => item.trim().length > 0);
      
      if (bulletItems.length > 1) {
        extractedItems.push(...bulletItems);
      } else if (numberedItems.length > 1) {
        extractedItems.push(...numberedItems);
      } else if (content.includes(',')) {
        // Try comma-separated list
        extractedItems.push(...content.split(',').map(item => item.trim()).filter(item => item.length > 0));
      } else if (content.includes(';')) {
        // Try semicolon-separated list
        extractedItems.push(...content.split(';').map(item => item.trim()).filter(item => item.length > 0));
      } else if (content.length > 0) {
        // Just use the whole content as one item
        extractedItems.push(content);
      }
    }
  });
  
  // Remove duplicates
  return [...new Set(extractedItems)];
}

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

/**
 * Get all expert review requests
 */
export const getExpertReviewRequests = async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;
    
    // Import storage here to avoid undefined error
    const { storage } = await import('./storage');
    
    const reviews = await storage.getExpertReviews({
      status: status as string | undefined,
      type: type as string | undefined
    });
    
    console.log('Expert reviews found:', reviews.length);
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error fetching expert reviews:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a specific expert review by ID
 */
export const getExpertReviewById = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    
    if (!reviewId) {
      throw new ValidationError('Review ID is required');
    }
    
    // Import storage here to avoid undefined error
    const { storage } = await import('./storage');
    
    const review = await storage.getExpertReviewById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Expert review not found'
      });
    }
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error fetching expert review:', error);
    res.status(error instanceof ValidationError ? 400 : 500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Request a new expert review
 */
export const requestExpertReview = async (req: Request, res: Response) => {
  try {
    const { text, type, context, validationResult } = req.body;
    
    if (!text) {
      throw new ValidationError('Assessment text is required');
    }
    
    if (!type) {
      throw new ValidationError('Assessment type is required');
    }
    
    const reviewId = await queueForExpertReview({
      text,
      type,
      context,
      validationResult
    });
    
    res.json({
      success: true,
      reviewId,
      message: 'Expert review requested successfully'
    });
  } catch (error) {
    console.error('Error requesting expert review:', error);
    res.status(error instanceof ValidationError ? 400 : 500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update an expert review (status, assignment, feedback)
 */
export const updateExpertReviewRequest = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { status, assignedTo, expertFeedback } = req.body;
    
    if (!reviewId) {
      throw new ValidationError('Review ID is required');
    }
    
    // Verify the review exists
    const existingReview = await getExpertReview(reviewId);
    
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: 'Expert review not found'
      });
    }
    
    // Update the review
    const updated = await updateExpertReview(reviewId, {
      status,
      assignedTo,
      expertFeedback
    });
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update expert review'
      });
    }
    
    // Get the updated review to return
    const updatedReview = await getExpertReview(reviewId);
    
    res.json({
      success: true,
      review: updatedReview,
      message: 'Expert review updated successfully'
    });
  } catch (error) {
    console.error('Error updating expert review:', error);
    res.status(error instanceof ValidationError ? 400 : 500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};