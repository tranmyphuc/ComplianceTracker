import { ConfidenceLevel, ReviewStatus } from '@/components/legal';

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
 * Analyzes AI-generated text for confidence indicators
 * Identifies uncertainty markers, contradictions, hedging language
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
  if (!outputText) {
    return {
      isValid: false,
      confidenceLevel: ConfidenceLevel.UNCERTAIN,
      reviewStatus: ReviewStatus.REQUIRES_LEGAL_REVIEW,
      issues: ['Empty assessment text'],
      warnings: [],
      reviewRequired: true,
      timestamp: new Date(),
      validator: 'system'
    };
  }
  
  // Analyze confidence
  const confidenceLevel = analyzeConfidence(outputText);
  
  // Validate legal references
  const { valid: validReferences, invalidReferences } = validateLegalReferences(outputText);
  
  // Check for contradictions
  const contradictions = checkForContradictions(outputText);
  
  // Check required sections
  const missingSections = checkRequiredSections(outputText);
  
  // Determine if review is required
  const allIssues = [
    ...invalidReferences.map(ref => `Invalid reference: ${ref}`),
    ...contradictions,
    ...missingSections
  ];
  
  const warnings: string[] = [];
  
  // Add warnings based on confidence level
  if (confidenceLevel === ConfidenceLevel.MEDIUM) {
    warnings.push('Medium confidence detected. Consider expert review for critical decisions.');
  } else if (confidenceLevel === ConfidenceLevel.LOW) {
    warnings.push('Low confidence detected. Expert review recommended.');
  }
  
  // Determine review status
  let reviewStatus = ReviewStatus.VALIDATED;
  
  if (confidenceLevel === ConfidenceLevel.LOW || allIssues.length > 2) {
    reviewStatus = ReviewStatus.REQUIRES_LEGAL_REVIEW;
  } else if (confidenceLevel === ConfidenceLevel.MEDIUM || allIssues.length > 0) {
    reviewStatus = ReviewStatus.PENDING_REVIEW;
  }
  
  return {
    isValid: allIssues.length === 0 && confidenceLevel !== ConfidenceLevel.LOW,
    confidenceLevel,
    reviewStatus,
    issues: allIssues,
    warnings,
    reviewRequired: confidenceLevel === ConfidenceLevel.LOW || allIssues.length > 0,
    timestamp: new Date(),
    validator: 'ai',
    validationNotes: allIssues.length > 0 ? 
      'Automated validation detected issues that should be addressed before proceeding.' : 
      'Automated validation complete. No significant issues detected.'
  };
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