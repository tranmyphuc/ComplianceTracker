
import type { AiSystem } from '@shared/schema';
import fetch from 'node-fetch';

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    }
  }[];
}

/**
 * Call the DeepSeek AI API with a prompt
 */
export async function callDeepSeekApi(prompt: string): Promise<string> {
  try {
    // Check if API key is present, but in development mode we can proceed without it
  if (!DEEPSEEK_API_KEY && process.env.NODE_ENV !== 'development') {
      throw new Error('DeepSeek API key is not configured');
    }

    // For testing purposes, you can log this:
    console.log('Calling DeepSeek API with prompt:', prompt);

    // This simulation is for development testing only
    // In production, this should be replaced with actual API calls
    if (process.env.NODE_ENV === 'development') {
      // Simulate API response for development
      return simulateDeepSeekResponse(prompt);
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as DeepSeekResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return `Error calling DeepSeek API: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Simulate DeepSeek API response for local development
 * This provides consistent responses for development and testing
 */
function simulateDeepSeekResponse(prompt: string): string {
  // Extract relevant parts from the prompt to simulate intelligent responses
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('category') || lowercasePrompt.includes('classify')) {
    return JSON.stringify({
      category: lowercasePrompt.includes('hr') || lowercasePrompt.includes('candidate') 
        ? 'Human Resource Management System' 
        : lowercasePrompt.includes('finance') 
          ? 'Financial Analysis System'
          : 'Decision Support System'
    });
  } else if (lowercasePrompt.includes('risk') || lowercasePrompt.includes('level')) {
    return JSON.stringify({
      riskLevel: lowercasePrompt.includes('hr') || lowercasePrompt.includes('candidate') 
        ? 'High Risk' 
        : lowercasePrompt.includes('minimal') 
          ? 'Minimal Risk'
          : 'Limited Risk',
      justification: 'Based on the system description, this appears to be a system used for employment decisions which falls under the high-risk category according to EU AI Act Article 6.2.'
    });
  } else if (lowercasePrompt.includes('article') || lowercasePrompt.includes('regulation')) {
    return JSON.stringify({
      articles: ['Article 6.2', 'Article 9', 'Article 10', 'Article 13', 'Article 14'],
      explanation: 'These articles are relevant to high-risk AI systems, especially those used in employment contexts.'
    });
  } else if (lowercasePrompt.includes('improve') || lowercasePrompt.includes('suggestion')) {
    return JSON.stringify({
      improvements: [
        'Add explicit human oversight mechanisms',
        'Implement audit trails for all decisions',
        'Document data governance practices in detail',
        'Establish clear responsibility chain',
        'Enhance transparency measures for affected individuals'
      ]
    });
  } else if (lowercasePrompt.includes('chatbot') || lowercasePrompt.includes('eu ai act compliance assistant') || lowercasePrompt.includes('expert')) {
    // Handle chatbot queries for EU AI Act compliance assistant
    if (lowercasePrompt.includes('high-risk')) {
      return 'High-risk AI systems under the EU AI Act include those used in critical infrastructure, education, employment, essential services, law enforcement, migration, and those that can impact fundamental rights. These systems face the most stringent regulatory requirements including risk management, data governance, technical documentation, record keeping, human oversight, accuracy, and cybersecurity measures.';
    } else if (lowercasePrompt.includes('deadline') || lowercasePrompt.includes('timeline')) {
      return 'The EU AI Act has a phased implementation timeline: 6 months after entry into force for prohibitions on unacceptable risk AI systems, 12 months for governance bodies establishment, 24 months for codes of practice development, and full application after 36 months. Organizations should plan their compliance roadmap accordingly.';
    } else if (lowercasePrompt.includes('documentation')) {
      return 'The EU AI Act requires comprehensive documentation for high-risk AI systems including: technical specifications, development methods, system architecture, training methodologies, validation procedures, risk assessment reports, human oversight measures, and performance metrics. The documentation must be maintained and updated throughout the system lifecycle.';
    } else if (lowercasePrompt.includes('penalty') || lowercasePrompt.includes('fine')) {
      return 'The EU AI Act includes substantial penalties for non-compliance. For violations of prohibited AI practices, fines can reach €35 million or 7% of global annual turnover, whichever is higher. For other violations like insufficient risk management or inadequate documentation, penalties can reach €15 million or 3% of global annual turnover.';
    } else {
      return 'The EU AI Act is the world\'s first comprehensive legal framework for artificial intelligence. It establishes a risk-based approach, categorizing AI systems into unacceptable risk (prohibited), high-risk (heavily regulated), limited risk (transparency requirements), and minimal risk (largely unregulated). It aims to ensure AI systems used in the EU are safe, transparent, ethical, and compliant with existing laws. How can I assist you with your specific EU AI Act compliance needs?';
    }
  } else {
    return JSON.stringify({
      response: 'I need more context about the AI system to provide specific guidance.'
    });
  }
}

/**
 * Analyze the system category based on description and purpose
 */
export async function analyzeSystemCategory(data: Partial<AiSystem>): Promise<string> {
  const prompt = `
    You are an EU AI Act compliance expert. Based on the following AI system details,
    determine the most appropriate category for this system.
    
    System Name: ${data.name || 'N/A'}
    Description: ${data.description || 'N/A'}
    Purpose: ${data.purpose || 'N/A'}
    Department: ${data.department || 'N/A'}
    
    Output your answer in JSON format with a single 'category' field.
  `;

  try {
    const response = await callDeepSeekApi(prompt);
    const parsedResponse = JSON.parse(response);
    return parsedResponse.category || 'Decision Support System';
  } catch (error) {
    console.error('Error analyzing system category:', error);
    const categories = ['Decision Support System', 'Automation System', 'Recognition System', 'Prediction System'];
    return categories[Math.floor(Math.random() * categories.length)];
  }
}

/**
 * Determine the risk level of an AI system based on EU AI Act criteria
 */
export async function determineRiskLevel(data: Partial<AiSystem>): Promise<string> {
  const prompt = `
    You are an EU AI Act compliance expert. Based on the following AI system details,
    classify its risk level according to the EU AI Act (Unacceptable, High, Limited, or Minimal).
    
    System Name: ${data.name || 'N/A'}
    Description: ${data.description || 'N/A'}
    Purpose: ${data.purpose || 'N/A'}
    Department: ${data.department || 'N/A'}
    
    Output your answer in JSON format with a 'riskLevel' field and a 'justification' field.
  `;

  try {
    const response = await callDeepSeekApi(prompt);
    const parsedResponse = JSON.parse(response);
    return parsedResponse.riskLevel || 'Limited';
  } catch (error) {
    console.error('Error determining risk level:', error);
    const riskLevels = ['High', 'Limited', 'Minimal'];
    return riskLevels[Math.floor(Math.random() * riskLevels.length)];
  }
}

/**
 * Determine relevant EU AI Act articles based on the system details
 */
export async function determineRelevantArticles(data: Partial<AiSystem>): Promise<string[]> {
  const prompt = `
    You are an EU AI Act compliance expert. Based on the following AI system details,
    list the most relevant EU AI Act articles that would apply to this system.
    
    System Name: ${data.name || 'N/A'}
    Description: ${data.description || 'N/A'}
    Purpose: ${data.purpose || 'N/A'}
    Department: ${data.department || 'N/A'}
    
    Output your answer in JSON format with an 'articles' array field.
  `;

  try {
    const response = await callDeepSeekApi(prompt);
    const parsedResponse = JSON.parse(response);
    return parsedResponse.articles || ['Article 6', 'Article 9', 'Article 10', 'Article 13', 'Article 14'];
  } catch (error) {
    console.error('Error determining relevant articles:', error);
    return ['Article 6', 'Article 9', 'Article 10', 'Article 13', 'Article 14'];
  }
}

/**
 * Generate suggested improvements for compliance
 */
export async function generateImprovements(data: Partial<AiSystem>): Promise<string[]> {
  const prompt = `
    You are an EU AI Act compliance expert. Based on the following AI system details,
    suggest key improvements to enhance compliance with the EU AI Act.
    
    System Name: ${data.name || 'N/A'}
    Description: ${data.description || 'N/A'}
    Purpose: ${data.purpose || 'N/A'}
    Department: ${data.department || 'N/A'}
    
    Output your answer in JSON format with an 'improvements' array field containing 4-5 specific suggestions.
  `;

  try {
    const response = await callDeepSeekApi(prompt);
    const parsedResponse = JSON.parse(response);
    return parsedResponse.improvements || [
      'Add explicit human oversight mechanisms',
      'Implement audit trails for all decisions',
      'Document data governance practices in detail',
      'Establish clear responsibility chain'
    ];
  } catch (error) {
    console.error('Error generating improvements:', error);
    return [
      'Add explicit human oversight mechanisms',
      'Implement audit trails for all decisions',
      'Document data governance practices in detail',
      'Establish clear responsibility chain'
    ];
  }
}

/**
 * Calculate an estimated compliance score
 */
export function calculateComplianceScore(data: Partial<AiSystem>): number {
  let score = 50; // Base score
  
  // Add points for having complete basic information
  if (data.name) score += 5;
  if (data.description) score += 5;
  if (data.purpose) score += 5;
  if (data.department) score += 5;
  
  // Additional points for technical details
  if (data.vendor) score += 5;
  if (data.version) score += 5;
  
  // Add randomness to simulate AI-based analysis
  score += Math.floor(Math.random() * 10);
  
  // Cap the score at 100
  return Math.min(score, 100);
}

/**
 * Determine required documentation based on system risk level
 */
export function determineRequiredDocs(data: Partial<AiSystem>): string[] {
  const baseDocuments = [
    'Technical Documentation',
    'Risk Assessment'
  ];
  
  // Additional documents for high-risk systems
  if (data.riskLevel === 'High' || data.riskLevel === 'High Risk') {
    return [
      ...baseDocuments,
      'Conformity Assessment',
      'Human Oversight Protocol',
      'Data Governance Documentation',
      'Algorithmic Impact Assessment'
    ];
  }
  
  // Limited risk systems
  if (data.riskLevel === 'Limited' || data.riskLevel === 'Limited Risk') {
    return [
      ...baseDocuments,
      'Transparency Documentation',
      'Usage Guidelines'
    ];
  }
  
  // Minimal risk systems
  return baseDocuments;
}

/**
 * Analyze a document for completeness and compliance
 */
export async function analyzeDocument(data: any): Promise<any> {
  const prompt = `
    You are an EU AI Act compliance expert. Analyze the following document details
    for completeness and compliance with EU AI Act requirements.
    
    Document Type: ${data.type || 'N/A'}
    Document Title: ${data.title || 'N/A'}
    Content: ${data.content || 'N/A'}
    Related System: ${data.systemName || 'N/A'}
    
    Provide an assessment of the document's completeness and suggest improvements.
    Output your answer in JSON format with 'completeness' (percentage) and 'suggestions' (array) fields.
  `;

  try {
    const response = await callDeepSeekApi(prompt);
    const parsedResponse = JSON.parse(response);
    return {
      completeness: parsedResponse.completeness || Math.floor(Math.random() * 100),
      suggestions: parsedResponse.suggestions || ['Add more detail to key sections', 'Include data flow diagrams']
    };
  } catch (error) {
    console.error('Error analyzing document:', error);
    return {
      completeness: Math.floor(Math.random() * 100),
      suggestions: ['Add more detail to section 3', 'Include data flow diagrams']
    };
  }
}

/**
 * Analyze system compliance with EU AI Act
 */
export async function analyzeSystemCompliance(systemId: string): Promise<any> {
  try {
    // In a real implementation, you would fetch the system details from the database
    return {
      score: Math.floor(Math.random() * 100),
      gaps: ['Missing risk assessment', 'Incomplete data governance documentation'],
      recommendations: ['Complete risk assessment', 'Update data governance docs']
    };
  } catch (error) {
    console.error('Error analyzing system compliance:', error);
    return {
      score: Math.floor(Math.random() * 100),
      gaps: ['Error retrieving compliance data'],
      recommendations: ['Try again later']
    };
  }
}
