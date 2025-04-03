/**
 * Enhanced AI Analysis Service
 * Provides AI-powered risk assessment for EU AI Act compliance
 */

import { aiServices } from './ai-services';
import { euAiActDomains, euAiActRiskCategories } from './compliance-data';

/**
 * Analyze an AI system and determine its risk level according to EU AI Act standards
 * 
 * @param systemData Data about the AI system to analyze
 * @returns Enhanced analysis results including risk level and relevant EU AI Act articles
 */
export async function analyzeSystemRisk(systemData: any) {
  try {
    console.log("Performing enhanced AI risk analysis");
    
    // First perform a local rule-based analysis as a baseline
    const baselineResult = performBaselineRiskAnalysis(systemData);
    
    // Then attempt AI analysis for enhanced results
    try {
      const aiAnalysisResult = await performAiEnhancedAnalysis(systemData);
      
      // If AI analysis succeeded, merge with baseline and return
      if (aiAnalysisResult) {
        return {
          ...baselineResult,
          ...aiAnalysisResult,
          analysisMethod: 'ai_enhanced'
        };
      }
    } catch (error) {
      console.error("AI enhanced analysis failed:", error);
      // In case of AI failure, we continue with baseline only
    }
    
    // Return baseline results if AI analysis failed or was not available
    return {
      ...baselineResult,
      analysisMethod: 'rule_based'
    };
  } catch (error: any) {
    console.error("Error in enhanced risk analysis:", error);
    throw new Error(`Enhanced risk analysis failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Perform baseline rule-based risk analysis
 */
function performBaselineRiskAnalysis(systemData: any) {
  // Initialize with default result structure
  const result = {
    riskLevel: "limited",
    relevantArticles: ["Article 52 - Transparency Obligations"],
    category: systemData.aiCapabilities || "Generic AI System",
    suggestedImprovements: [
      "Document transparency measures",
      "Provide clear information to users about AI interaction",
      "Document system limitations"
    ],
    potentialImpact: "Limited impact on fundamental rights or critical activities",
    vulnerabilities: systemData.vulnerabilities || "No specific vulnerabilities identified",
    riskFactors: []
  };
  
  // High risk indicators from form data
  if (systemData.impactsVulnerableGroups || 
      (systemData.usesDeepLearning && !systemData.isTransparent) ||
      (systemData.usesPersonalData && systemData.usesSensitiveData) ||
      (systemData.impactsAutonomous && !systemData.humansInLoop)) {
    result.riskLevel = "high";
  }
  
  // Check for high-risk domains in text fields
  const highRiskDomains = [
    'healthcare', 'medical', 'legal', 'judicial', 'law enforcement', 
    'education', 'employment', 'critical infrastructure', 'banking',
    'financial', 'insurance', 'credit', 'pneumonia', 'diagnostic', 'radiology',
    'hospital', 'clinic', 'x-ray', 'xray', 'chest', 'computer vision', 'image analysis'
  ];
  
  // Create a combined text field for text analysis
  const combinedText = `${systemData.purpose || ''} ${systemData.department || ''} 
    ${systemData.aiCapabilities || ''} ${systemData.name || ''} ${systemData.description || ''}`.toLowerCase();
  
  // Check domain terms
  for (const domain of highRiskDomains) {
    if (combinedText.includes(domain)) {
      result.riskLevel = "high";
      break;
    }
  }
  
  // Update relevant articles based on risk level
  if (result.riskLevel === "high") {
    result.relevantArticles = [
      "Article 6 - Classification Rules for High-Risk AI Systems",
      "Article 9 - Risk Management System"
    ];
    
    if (systemData.usesPersonalData) {
      result.relevantArticles.push("Article 10 - Data and Data Governance");
    }
    
    if (!systemData.isTransparent) {
      result.relevantArticles.push("Article 13 - Transparency and Provision of Information to Users");
    }
    
    if (!systemData.humansInLoop) {
      result.relevantArticles.push("Article 14 - Human Oversight");
    }
    
    result.suggestedImprovements = [
      "Implement comprehensive documentation in line with Article 11",
      "Establish formal human oversight protocols (Article 14)",
      "Develop transparent documentation of system capabilities (Article 13)",
      "Create detailed risk management procedures (Article 9)"
    ];
    
    result.potentialImpact = systemData.impactsVulnerableGroups ? 
      "May have significant impact on vulnerable groups, requiring detailed assessment" :
      "Potential impact on fundamental rights or critical activities requiring formal risk management";
  }
  
  return result;
}

/**
 * Perform AI-enhanced analysis using available AI services
 */
async function performAiEnhancedAnalysis(systemData: any) {
  try {
    // Check if AI services are available
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      console.log("No AI service available for enhanced analysis");
      return null;
    }
    
    // Prepare data for AI analysis
    const analysisPrompt = generateAnalysisPrompt(systemData);
    
    // Call AI service
    const response = await aiService.complete({
      messages: [
        {
          role: "system",
          content: "You are an expert in EU AI Act compliance analysis. Analyze the given AI system and determine its risk level according to EU AI Act standards. Provide structured, factual results in JSON format."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });
    
    if (!response || !response.content) {
      console.warn("AI service returned empty response");
      return null;
    }
    
    // Parse and process the AI response
    let aiResult;
    try {
      // Try to parse as JSON first
      aiResult = JSON.parse(response.content);
    } catch (parseError) {
      console.warn("Failed to parse AI response as JSON:", parseError);
      
      // If parsing fails but we got a response, extract data from text
      console.log("OpenAI response text:", response.content);
      
      // Use regex to extract possible JSON object
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          aiResult = JSON.parse(jsonMatch[0]);
        } catch (secondError) {
          console.warn("Second attempt to parse JSON failed");
          return null;
        }
      } else {
        return null;
      }
    }
    
    // Validate and standardize the AI result
    if (!aiResult || typeof aiResult !== 'object') {
      console.warn("AI result is not a valid object");
      return null;
    }
    
    // Process the AI result into our expected format
    return processAiResult(aiResult);
  } catch (error: any) {
    console.error("AI enhanced analysis error:", error);
    return null;
  }
}

/**
 * Generate an analysis prompt for the AI based on system data
 */
function generateAnalysisPrompt(systemData: any) {
  return `
Analyze this AI system for EU AI Act compliance:

System Name: ${systemData.name || 'Unknown'}
Department: ${systemData.department || 'Unspecified'}
Description: ${systemData.description || 'No description provided'}
Purpose: ${systemData.purpose || 'Unspecified'}
AI Capabilities: ${systemData.aiCapabilities || 'Unspecified'}

Technical Details:
- Uses Deep Learning: ${systemData.usesDeepLearning ? 'Yes' : 'No'}
- Transparency Level: ${systemData.isTransparent ? 'Transparent' : 'Limited transparency'}
- Human Oversight: ${systemData.humansInLoop ? 'Human-in-the-loop' : 'Limited human oversight'}
- Uses Personal Data: ${systemData.usesPersonalData ? 'Yes' : 'No'}
- Uses Sensitive Data: ${systemData.usesSensitiveData ? 'Yes' : 'No'}
- Impacts Vulnerable Groups: ${systemData.impactsVulnerableGroups ? 'Yes' : 'No'}
- Autonomous Decision-Making: ${systemData.impactsAutonomous ? 'Yes' : 'No'}

Based on this information and your knowledge of the EU AI Act, determine:
1. The risk level of this system (unacceptable, high, limited, or minimal)
2. The relevant EU AI Act articles that apply
3. Suggested improvements for compliance
4. Potential impact on fundamental rights or safety
5. Identified vulnerabilities

Format your response as a JSON object with the following structure:
{
  "riskLevel": "high", // or another applicable level
  "relevantArticles": ["Article X - Title", "Article Y - Title"],
  "suggestedImprovements": ["Improvement 1", "Improvement 2"],
  "potentialImpact": "Description of potential impact",
  "vulnerabilities": "Identified vulnerabilities"
}
`;
}

/**
 * Process AI response into standardized format
 */
function processAiResult(aiResult: any) {
  // Create a standardized result object with safe defaults
  const processedResult: any = {
    riskLevel: 'unknown',
    relevantArticles: [],
    suggestedImprovements: [],
    category: '',
    potentialImpact: '',
    vulnerabilities: ''
  };
  
  // Extract risk level with standardization
  if (aiResult.riskLevel) {
    const riskLevel = aiResult.riskLevel.toLowerCase();
    if (riskLevel.includes('high')) {
      processedResult.riskLevel = 'high';
    } else if (riskLevel.includes('unacceptable')) {
      processedResult.riskLevel = 'unacceptable';
    } else if (riskLevel.includes('limited')) {
      processedResult.riskLevel = 'limited';
    } else if (riskLevel.includes('minimal')) {
      processedResult.riskLevel = 'minimal';
    }
  }
  
  // Extract relevant articles
  if (aiResult.relevantArticles && Array.isArray(aiResult.relevantArticles)) {
    processedResult.relevantArticles = aiResult.relevantArticles;
  }
  
  // Extract suggested improvements
  if (aiResult.suggestedImprovements && Array.isArray(aiResult.suggestedImprovements)) {
    processedResult.suggestedImprovements = aiResult.suggestedImprovements;
  }
  
  // Extract potential impact
  if (aiResult.potentialImpact) {
    processedResult.potentialImpact = aiResult.potentialImpact;
  }
  
  // Extract vulnerabilities
  if (aiResult.vulnerabilities) {
    processedResult.vulnerabilities = aiResult.vulnerabilities;
  }
  
  return processedResult;
}

// Export the main function
// Export named functions for backward compatibility with existing imports
export const enhancedAIAnalysis = analyzeSystemRisk;
export const smartRiskAnalysis = analyzeSystemRisk;

// Export as default for new imports
export default {
  analyzeSystemRisk,
  enhancedAIAnalysis: analyzeSystemRisk,
  smartRiskAnalysis: analyzeSystemRisk
};