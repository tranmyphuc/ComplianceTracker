/**
 * Enhanced text analysis utilities for AI system registration
 * Provides advanced extraction and context analysis capabilities
 */

import { AIModel } from '../ai-service';

/**
 * Advanced text analysis with contextual understanding
 * Jack said: "This approach gives us much better extraction quality by understanding context"
 */
export function advancedTextAnalysis(text: string, keywords: string[]) {
  // Skip if no text
  if (!text || typeof text !== 'string') {
    return { relevantContent: '', matchScore: 0 };
  }

  // Normalize text for easier analysis
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  
  // Break text into paragraphs to understand context better
  const paragraphs = normalizedText.split(/\n\n+/);
  
  // Find paragraphs most relevant to our keywords
  const relevantParagraphs = paragraphs.filter(para => 
    keywords.some(keyword => para.includes(keyword.toLowerCase()))
  );
  
  // Jack said: "Score the relevance to help prioritize information"
  return {
    relevantContent: relevantParagraphs.join(' '),
    matchScore: relevantParagraphs.length / Math.max(1, paragraphs.length) * 100
  };
}

/**
 * Enhanced extraction with multiple patterns and field-specific logic
 * Jack said: "Different fields need different extraction patterns for best results"
 */
export function enhancedExtraction(text: string, fieldName: string): {
  value: string;
  confidence: number;
  extractionPattern: string;
} | null {
  // Skip if no text
  if (!text || typeof text !== 'string') {
    return null;
  }
  
  // Base extraction patterns
  const patterns = [
    // JSON/YAML structure pattern
    new RegExp(`["']?${fieldName}["']?\\s*[:=]\\s*["']([^"']+)["']`, 'i'),
    
    // Natural language pattern
    new RegExp(`${fieldName}\\s+(is|are|was|were)\\s+["']?([^,"'{}\\[\\]\\n]+)["']?`, 'i'),
    
    // List item pattern
    new RegExp(`[-*•]\\s*${fieldName}\\s*[:=]\\s*["']?([^,"'{}\\[\\]\\n]+)["']?`, 'i'),
    
    // End of sentence pattern
    new RegExp(`([^.!?]+)\\s+${fieldName}\\s*[.!?]`, 'i'),
    
    // Start of sentence pattern
    new RegExp(`${fieldName}[^.!?]+(is|are|has|have|contains|provides)[^.!?]*([^.!?]+)[.!?]`, 'i')
  ];
  
  // Jack said: "Add field-specific extraction patterns for specialized fields"
  const fieldSpecificPatterns: Record<string, RegExp[]> = {
    'riskLevel': [
      new RegExp(`risk\\s+level\\s*[:=]?\\s*(unacceptable|high|limited|minimal)`, 'i'),
      new RegExp(`classified\\s+as\\s+(an?\\s+)?(unacceptable|high|limited|minimal)\\s+risk`, 'i'),
      new RegExp(`(unacceptable|high|limited|minimal)\\s+risk\\s+classification`, 'i')
    ],
    'version': [
      new RegExp(`version\\s*(\\d+(\\.\\d+)*)`, 'i'),
      new RegExp(`v(\\d+(\\.\\d+)*)`, 'i')
    ],
    'aiCapabilities': [
      new RegExp(`capabilities\\s*:?\\s*\\[([^\\]]+)\\]`, 'i'),
      new RegExp(`capabilities\\s*:?\\s*\\{([^}]+)\\}`, 'i'),
      new RegExp(`(uses|utilizes|employs)\\s+([^.,]+(?:vision|language|prediction|recognition|generation)[^.,]+)`, 'i')
    ]
  };
  
  // Add field-specific patterns if available
  const allPatterns = fieldSpecificPatterns[fieldName] 
    ? [...patterns, ...fieldSpecificPatterns[fieldName]] 
    : patterns;
  
  // Try each pattern for matches
  for (const pattern of allPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Determine which capture group has our value
      const value = match[1] || match[2];
      if (value) {
        // Jack said: "Calculate confidence based on pattern specificity"
        const baseConfidence = fieldSpecificPatterns[fieldName] ? 85 : 75;
        
        return {
          value: value.trim(),
          confidence: baseConfidence,
          extractionPattern: pattern.toString()
        };
      }
    }
  }
  
  // If no direct match, try context-based extraction
  // Jack said: "Contextual analysis is crucial when direct patterns fail"
  const keywordIndex = text.toLowerCase().indexOf(fieldName.toLowerCase());
  if (keywordIndex >= 0) {
    // Get text surrounding the keyword
    const start = Math.max(0, keywordIndex - 50);
    const end = Math.min(text.length, keywordIndex + fieldName.length + 100);
    const contextText = text.substring(start, end);
    
    // Use simple NLP techniques to extract
    return contextBasedExtraction(contextText, fieldName);
  }
  
  return null;
}

/**
 * Context-based extraction when pattern matching fails
 * Jack said: "Looking at surrounding text gives us better fallback extraction"
 */
function contextBasedExtraction(contextText: string, fieldName: string) {
  // Split text into sentences
  const sentences = contextText.split(/[.!?]+/);
  
  // Find the sentence most likely to contain our value
  const relevantSentence = sentences.find(s => 
    s.toLowerCase().includes(fieldName.toLowerCase())
  );
  
  if (relevantSentence) {
    // Extract the part after the field name
    const parts = relevantSentence.split(new RegExp(`${fieldName}\\s*[:=]?\\s*`, 'i'));
    
    if (parts.length > 1) {
      // Clean up the extracted value
      const value = parts[1].trim().replace(/[,"'{}[\]]+$/, '');
      
      return {
        value,
        confidence: 60, // Lower confidence for context-based extraction
        extractionPattern: 'context-based'
      };
    }
  }
  
  return null;
}

/**
 * Extract key phrases from text for better search queries
 * Jack said: "Good search queries are essential for finding relevant information"
 */
export function extractKeyPhrases(text: string, maxPhrases: number = 5): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Normalize text and split into words
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = normalizedText.split(' ');
  
  // Define important keywords for AI systems in the EU AI Act context
  const importantKeywords = [
    'ai', 'system', 'model', 'algorithm', 'machine learning', 'deep learning', 
    'neural network', 'computer vision', 'nlp', 'natural language', 'recognition',
    'classification', 'prediction', 'healthcare', 'medical', 'financial', 'risk',
    'biometric', 'identification', 'autonomous', 'decision', 'automated', 'critical',
    'high-risk', 'regulation', 'compliance', 'eu ai act', 'gdpr', 'data protection',
    'safety', 'security', 'version', 'deployment', 'production'
  ];
  
  // Look for specific product names (capitalized words)
  const potentialNames: string[] = [];
  const capitalizedWordPattern = /[A-Z][a-z]{2,}\s*([A-Z][a-z]*\s*)*/g;
  const nameMatches = text.match(capitalizedWordPattern);
  
  if (nameMatches) {
    potentialNames.push(...nameMatches.slice(0, 2));
  }
  
  // Find important keyword phrases in the text
  const keyPhrases: string[] = [];
  
  // First pass: find exact matches of important keywords
  importantKeywords.forEach(keyword => {
    if (normalizedText.includes(keyword) && keyPhrases.length < maxPhrases) {
      keyPhrases.push(keyword);
    }
  });
  
  // Second pass: look for bigrams and trigrams that might indicate important concepts
  for (let i = 0; i < words.length - 1; i++) {
    if (keyPhrases.length >= maxPhrases) break;
    
    // Check for bigrams
    const bigram = `${words[i]} ${words[i+1]}`;
    if (
      words[i].length > 3 && 
      words[i+1].length > 3 && 
      !importantKeywords.includes(bigram) &&
      !keyPhrases.includes(bigram)
    ) {
      keyPhrases.push(bigram);
    }
    
    // Check for trigrams
    if (i < words.length - 2) {
      const trigram = `${words[i]} ${words[i+1]} ${words[i+2]}`;
      if (
        words[i].length > 3 && 
        words[i+1].length > 3 && 
        words[i+2].length > 3 && 
        !importantKeywords.includes(trigram) &&
        !keyPhrases.includes(trigram)
      ) {
        keyPhrases.push(trigram);
      }
    }
  }
  
  // Combine potential names and key phrases
  const result = [...potentialNames, ...keyPhrases].slice(0, maxPhrases);
  
  // If we still don't have enough phrases, add first N words as fallback
  if (result.length < maxPhrases) {
    const firstWords = words.slice(0, Math.min(10, words.length)).join(' ');
    if (firstWords && !result.includes(firstWords)) {
      result.push(firstWords);
    }
  }
  
  return result;
}

/**
 * Generate search queries based on system information
 * Jack said: "Effective search queries are key to getting good results"
 */
export function generateSearchQuery(systemInfo: { 
  name?: string; 
  description?: string; 
  type?: string;
  content?: string;
}): string {
  let baseQuery = '';
  
  // If we have a name, use it as primary search term
  if (systemInfo.name) {
    baseQuery = systemInfo.name;
  } 
  // Otherwise extract from description
  else if (systemInfo.description) {
    const keyPhrases = extractKeyPhrases(systemInfo.description);
    baseQuery = keyPhrases.join(' ');
  }
  // If we have raw content (e.g., from file upload)
  else if (systemInfo.content) {
    const keyPhrases = extractKeyPhrases(systemInfo.content.substring(0, 1000));
    baseQuery = keyPhrases.join(' ');
  }
  
  // Add AI system context and EU AI Act for relevance
  return `${baseQuery} AI system specifications EU AI Act classification`;
}

/**
 * Analyze risk context factors based on EU AI Act guidelines
 * Jack said: "Consider mitigating and aggravating factors in risk assessment"
 */
export function analyzeRiskContextFactors(text: string, systemData: any): Record<string, number> {
  const factors: Record<string, number> = {
    unacceptable: 0,
    high: 0,
    limited: 0,
    minimal: 0
  };
  
  if (!text || typeof text !== 'string') {
    return factors;
  }
  
  const normalizedText = text.toLowerCase();
  
  // Mitigating factors (reduce risk level)
  const mitigatingPhrases = [
    'human oversight', 'human in the loop', 'human review',
    'extensive testing', 'safety measures', 'bias mitigation',
    'transparency', 'explainability', 'data protection',
    'privacy by design', 'ethical guidelines', 'opt-out',
    'limited scope', 'consent required', 'compliance framework'
  ];
  
  // Aggravating factors (increase risk level)
  const aggravatingPhrases = [
    'fully autonomous', 'no human oversight', 'real-time decisions',
    'vulnerable populations', 'children', 'elderly', 'disabled',
    'sensitive data', 'health data', 'biometric data', 'public deployment',
    'continuous learning', 'automated decision', 'personal freedom',
    'critical decisions', 'irreversible impact'
  ];
  
  // Check for mitigating factors
  mitigatingPhrases.forEach(phrase => {
    if (normalizedText.includes(phrase)) {
      // Reduce risk for higher categories
      factors.unacceptable -= 0.5;
      factors.high -= 0.3;
      // Increase confidence in lower categories
      factors.limited += 0.2;
      factors.minimal += 0.3;
    }
  });
  
  // Check for aggravating factors
  aggravatingPhrases.forEach(phrase => {
    if (normalizedText.includes(phrase)) {
      // Increase risk for higher categories
      factors.unacceptable += 0.5;
      factors.high += 0.3;
      // Decrease confidence in lower categories
      factors.limited -= 0.2;
      factors.minimal -= 0.3;
    }
  });
  
  // Jack said: "Apply industry-specific risk factors based on EU AI Act"
  if (systemData.department) {
    const dept = systemData.department.toLowerCase();
    
    if (['healthcare', 'medical', 'health'].some(kw => dept.includes(kw))) {
      factors.high += 1.0;
      factors.minimal -= 0.5;
    } else if (['education', 'school', 'learning'].some(kw => dept.includes(kw))) {
      factors.high += 0.8;
    } else if (['law', 'legal', 'justice', 'police'].some(kw => dept.includes(kw))) {
      factors.high += 1.5;
      factors.minimal -= 0.8;
    } else if (['research', 'development', 'r&d'].some(kw => dept.includes(kw))) {
      factors.minimal += 0.8;
      factors.high -= 0.3;
    }
  }
  
  return factors;
}

/**
 * Merge multiple AI model results using confidence-based weighting
 * Jack said: "Combining multiple models gives more reliable results"
 */
export function mergeAIResults(results: any[]): any {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return null;
  }
  
  // If only one result, return it directly
  if (results.length === 1) {
    return results[0];
  }
  
  const mergedResult: Record<string, any> = {};
  const processedFields: Record<string, boolean> = {};
  
  // Identify all unique fields across all results
  const allFields = new Set<string>();
  results.forEach(result => {
    if (result && typeof result === 'object') {
      Object.keys(result).forEach(key => allFields.add(key));
    }
  });
  
  // Process each field
  allFields.forEach(field => {
    // Skip fields we've already processed
    if (processedFields[field]) return;
    
    // Collect all values for this field
    const fieldValues = results
      .map(result => result[field])
      .filter(value => value !== undefined && value !== null);
    
    if (fieldValues.length === 0) return;
    
    // Handle different field types
    const firstValue = fieldValues[0];
    
    // Case 1: Object with confidence scoring
    if (typeof firstValue === 'object' && firstValue.confidence !== undefined) {
      // Sort by confidence, highest first
      const sortedValues = [...fieldValues].sort((a, b) => b.confidence - a.confidence);
      mergedResult[field] = sortedValues[0];
    }
    // Case 2: Arrays
    else if (Array.isArray(firstValue)) {
      // Merge arrays and remove duplicates
      const combined = new Set();
      fieldValues.forEach(arr => {
        if (Array.isArray(arr)) {
          arr.forEach(item => combined.add(typeof item === 'object' ? JSON.stringify(item) : item));
        }
      });
      
      // Convert back from Set
      mergedResult[field] = Array.from(combined).map(item => 
        typeof item === 'string' && item.startsWith('{') ? JSON.parse(item) : item
      );
    }
    // Case 3: Simple values
    else {
      // Use most common value as default
      const valueCounts: Record<string, number> = {};
      
      fieldValues.forEach(value => {
        const key = typeof value === 'object' ? JSON.stringify(value) : String(value);
        valueCounts[key] = (valueCounts[key] || 0) + 1;
      });
      
      // Find most common value
      let maxCount = 0;
      let mostCommonValue: any = fieldValues[0];
      
      Object.entries(valueCounts).forEach(([valueStr, count]) => {
        if (count > maxCount) {
          maxCount = count;
          // Convert back from string if needed
          mostCommonValue = valueStr.startsWith('{') ? JSON.parse(valueStr) : 
            valueStr === 'true' ? true : 
            valueStr === 'false' ? false : 
            isNaN(Number(valueStr)) ? valueStr : Number(valueStr);
        }
      });
      
      mergedResult[field] = mostCommonValue;
    }
    
    processedFields[field] = true;
  });
  
  return mergedResult;
}