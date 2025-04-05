/**
 * AI Risk Assessment
 * Uses AI to analyze AI system descriptions and characteristics
 * to provide intelligent risk assessments and classifications
 */

import { aiServices } from './lib/ai-services';
import { db } from './db';
import { AiSystem, RiskAssessment } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';
import { riskAssessments, InsertRiskAssessment } from '@shared/schema';

// Risk categories defined by the EU AI Act
const EU_AI_ACT_RISK_CATEGORIES = [
  {
    level: 'Unacceptable',
    description: 'AI systems that pose an unacceptable risk to people\'s safety, livelihoods, and rights are prohibited',
    examples: [
      'Social scoring by governments',
      'Emotion recognition in schools/workplaces',
      'Biometric categorization by protected attributes',
      'Indiscriminate facial recognition in public spaces'
    ]
  },
  {
    level: 'High',
    description: 'AI systems that pose significant risks to health, safety, fundamental rights',
    examples: [
      'Critical infrastructure operation',
      'Educational/vocational training',
      'Employment and worker management',
      'Access to essential services',
      'Law enforcement applications',
      'Migration, asylum, border control',
      'Administration of justice'
    ]
  },
  {
    level: 'Limited',
    description: 'AI systems with specific transparency requirements',
    examples: [
      'Chatbots',
      'Emotion recognition systems',
      'Biometric categorization systems',
      'Systems generating or manipulating content'
    ]
  },
  {
    level: 'Minimal',
    description: 'All other AI systems with minimal risk',
    examples: [
      'AI-enabled video games',
      'Spam filters',
      'Basic recommendation systems'
    ]
  }
];

// Risk areas to evaluate
const RISK_ASSESSMENT_AREAS = [
  {
    id: 'fundamental_rights',
    name: 'Fundamental Rights Impact',
    description: 'Potential impact on human rights, privacy, dignity, and non-discrimination'
  },
  {
    id: 'safety',
    name: 'Safety Risks',
    description: 'Potential for physical harm or property damage'
  },
  {
    id: 'manipulation',
    name: 'Manipulation Potential',
    description: 'Risk of manipulating human behavior or decisions'
  },
  {
    id: 'accuracy',
    name: 'Accuracy & Reliability',
    description: 'Level of reliability and potential for errors or inaccuracies'
  },
  {
    id: 'transparency',
    name: 'Transparency & Explainability',
    description: 'Level of transparency and ability to explain decisions'
  },
  {
    id: 'data',
    name: 'Data & Privacy',
    description: 'Data handling practices and privacy protections'
  },
  {
    id: 'oversight',
    name: 'Human Oversight',
    description: 'Level of human supervision and intervention capabilities'
  }
];

/**
 * Analyzes an AI system description to determine the likely risk category
 * under the EU AI Act classification
 */
export async function analyzeSystemRiskCategory(system: AiSystem): Promise<any> {
  try {
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    // Create a comprehensive description of the system
    const systemDescription = `
    Name: ${system.name}
    Description: ${system.description || 'Not provided'}
    Purpose: ${system.purpose || 'Not provided'}
    Domain: ${system.domain || 'Not provided'}
    Capabilities: ${system.capabilities ? JSON.stringify(system.capabilities) : 'Not provided'}
    Vendor: ${system.vendor || 'Not provided'}
    Version: ${system.version || 'Not provided'}
    Data Sources: ${system.dataSources || 'Not provided'}
    `;
    
    // Risk analysis prompt
    const prompt = `Analyze this AI system according to the EU AI Act risk classification framework:
    
    ${systemDescription}
    
    Using the EU AI Act's risk classification system, determine the most likely risk category for this system from:
    1. Unacceptable Risk (prohibited)
    2. High Risk (heavily regulated)
    3. Limited Risk (transparency obligations)
    4. Minimal Risk (minimal regulation)
    
    Provide your analysis in JSON format with the following structure:
    {
      "riskLevel": "High", // The determined risk level
      "confidence": 85, // Confidence score (0-100)
      "reasoning": "This system falls under the high-risk category because...",
      "riskAreas": [
        {
          "area": "fundamental_rights",
          "score": 75, // 0-100 where higher means higher risk
          "rationale": "Explanation for this score..."
        },
        // Other risk areas scores...
      ],
      "euArticles": ["Article 6", "Article 9"], // Relevant EU AI Act articles
      "requiredActions": ["Comprehensive risk assessment", "Technical documentation"] // Required compliance actions
    }
    
    Consider both the intended use and potential misuse of the system.`;
    
    // Get AI analysis
    const response = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in EU AI Act risk classification and compliance." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    });
    
    if (!response?.content) {
      throw new Error("Empty AI response");
    }
    
    // Extract JSON from response
    let analysisResult;
    try {
      // Find JSON in the response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (error) {
      console.error("Error parsing AI risk analysis:", error);
      throw new Error("Failed to parse AI risk analysis");
    }
    
    return {
      success: true,
      analysis: analysisResult,
      message: "AI risk classification completed"
    };
  } catch (error) {
    console.error("Error in AI risk category analysis:", error);
    return {
      success: false,
      message: `Failed to analyze risk: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Generate a detailed risk assessment for an AI system
 */
export async function generateDetailedRiskAssessment(system: AiSystem): Promise<any> {
  try {
    // First get the basic risk classification
    const basicAnalysis = await analyzeSystemRiskCategory(system);
    
    if (!basicAnalysis.success || !basicAnalysis.analysis) {
      throw new Error("Failed to get basic risk classification");
    }
    
    const riskLevel = basicAnalysis.analysis.riskLevel;
    const confidence = basicAnalysis.analysis.confidence;
    const riskAreas = basicAnalysis.analysis.riskAreas || [];
    
    // Calculate overall risk score (0-100)
    let overallScore = 0;
    if (riskAreas.length > 0) {
      overallScore = Math.round(
        riskAreas.reduce((sum: number, area: any) => sum + area.score, 0) / riskAreas.length
      );
    } else if (riskLevel === 'Unacceptable') {
      overallScore = 90;
    } else if (riskLevel === 'High') {
      overallScore = 70;
    } else if (riskLevel === 'Limited') {
      overallScore = 40;
    } else {
      overallScore = 20;
    }
    
    // Now get a more detailed analysis including risks and mitigation measures
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    const detailedPrompt = `Based on the initial risk classification of "${riskLevel}" for this AI system:
    
    ${JSON.stringify(system, null, 2)}
    
    Generate a detailed risk assessment including specific risks, their severity, 
    likelihood, potential impact, and mitigation measures.
    
    Format your response as JSON with this structure:
    {
      "risks": [
        {
          "name": "Risk name",
          "category": "One of: fundamental_rights, safety, manipulation, accuracy, transparency, data, oversight",
          "description": "Detailed description",
          "severity": "One of: Low, Medium, High, Critical",
          "likelihood": "One of: Unlikely, Possible, Likely, Very Likely",
          "impact": "Description of potential impact",
          "mitigation": "Suggested mitigation measures"
        }
        // Add at least 5 specific risks
      ],
      "complianceGaps": [
        "Specific compliance requirement that may not be met"
        // At least 3 potential compliance gaps
      ],
      "mitigationStrategy": "Overall risk mitigation strategy",
      "monitoringRecommendations": "Recommendations for ongoing monitoring",
      "documentationRequirements": ["Required documentation for compliance"]
    }`;
    
    // Get detailed AI analysis
    const detailedResponse = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in AI risk assessment and EU AI Act compliance." },
        { role: "user", content: detailedPrompt }
      ],
      temperature: 0.2
    });
    
    if (!detailedResponse?.content) {
      throw new Error("Empty AI response for detailed analysis");
    }
    
    // Extract JSON from response
    let detailedAnalysis;
    try {
      const jsonMatch = detailedResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        detailedAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in detailed AI response");
      }
    } catch (error) {
      console.error("Error parsing detailed AI risk analysis:", error);
      throw new Error("Failed to parse detailed AI risk analysis");
    }
    
    // Create a risk assessment record
    const assessmentId = `RA-${Date.now().toString().substring(5)}`;
    
    const riskAssessmentData: InsertRiskAssessment = {
      assessmentId,
      systemId: system.systemId,
      createdAt: new Date(),
      riskLevel,
      score: overallScore,
      confidence,
      assessor: 'AI Assistant',
      status: 'Generated',
      risks: detailedAnalysis.risks || [],
      complianceGaps: detailedAnalysis.complianceGaps || [],
      mitigationStrategy: detailedAnalysis.mitigationStrategy || '',
      monitoringRecommendations: detailedAnalysis.monitoringRecommendations || '',
      documentationRequirements: detailedAnalysis.documentationRequirements || [],
      version: '1.0',
      assessmentType: 'AI-Generated',
      metadata: {
        generationMethod: 'ai',
        initialAnalysisConfidence: confidence,
        euArticles: basicAnalysis.analysis.euArticles || []
      }
    };
    
    // Insert into database
    const [insertedAssessment] = await db.insert(riskAssessments).values(riskAssessmentData).returning();
    
    return {
      success: true,
      assessment: insertedAssessment,
      message: "AI-generated risk assessment completed"
    };
  } catch (error) {
    console.error("Error generating detailed risk assessment:", error);
    return {
      success: false,
      message: `Failed to generate risk assessment: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Analyze a text description of an AI system to identify potential risks
 */
export async function analyzeSystemDescription(description: string): Promise<any> {
  try {
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    const prompt = `Analyze this AI system description for potential EU AI Act compliance risks:
    
    "${description}"
    
    Identify the following in JSON format:
    {
      "systemType": "Type of AI system identified",
      "likelyRiskLevel": "Most likely EU AI Act risk level (Unacceptable, High, Limited, Minimal)",
      "potentialRisks": [
        "Description of potential risk 1",
        "Description of potential risk 2"
        // etc.
      ],
      "relevantArticles": ["Article X", "Article Y"],
      "recommendedActions": ["Action 1", "Action 2"]
    }
    
    Focus on identifying specific risks and compliance requirements under the EU AI Act.`;
    
    const response = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in EU AI Act risk assessment." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });
    
    if (!response?.content) {
      throw new Error("Empty AI response");
    }
    
    // Extract JSON from response
    let analysisResult;
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (error) {
      console.error("Error parsing AI system description analysis:", error);
      throw new Error("Failed to parse AI analysis");
    }
    
    return {
      success: true,
      analysis: analysisResult,
      message: "AI system description analysis completed"
    };
  } catch (error) {
    console.error("Error analyzing system description:", error);
    return {
      success: false,
      message: `Failed to analyze description: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Identify high-risk elements in an AI system
 */
export async function identifyHighRiskElements(system: AiSystem): Promise<any> {
  try {
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    const systemInfo = JSON.stringify({
      name: system.name,
      description: system.description,
      purpose: system.purpose,
      domain: system.domain,
      capabilities: system.capabilities,
      dataSources: system.dataSources
    });
    
    const prompt = `Identify potential high-risk elements in this AI system according to EU AI Act criteria:
    
    ${systemInfo}
    
    Provide your analysis in JSON format with this structure:
    {
      "highRiskElements": [
        {
          "element": "Element name",
          "description": "Description of why this is high-risk",
          "euArticleReference": "Relevant EU AI Act article",
          "mitigationSuggestion": "How to mitigate this risk"
        }
        // At least 3 high-risk elements if applicable
      ],
      "requiresFullAssessment": true/false,
      "explanation": "Explanation of why a full assessment is needed or not"
    }`;
    
    const response = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in identifying high-risk elements in AI systems under the EU AI Act." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });
    
    if (!response?.content) {
      throw new Error("Empty AI response");
    }
    
    // Extract JSON from response
    let analysisResult;
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (error) {
      console.error("Error parsing high-risk elements analysis:", error);
      throw new Error("Failed to parse high-risk elements analysis");
    }
    
    return {
      success: true,
      analysis: analysisResult,
      message: "High-risk elements identification completed"
    };
  } catch (error) {
    console.error("Error identifying high-risk elements:", error);
    return {
      success: false,
      message: `Failed to identify high-risk elements: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}