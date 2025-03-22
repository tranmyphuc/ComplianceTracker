
import { callDeepSeekApi } from "./ai-analysis";

/**
 * Performs a comprehensive compliance assessment of the AI system
 */
export async function performComplianceAssessment(systemData: any): Promise<any> {
  try {
    // Structure for comprehensive assessment
    const assessmentAreas = [
      {
        name: "Technical Documentation",
        score: calculateAreaScore(systemData, "documentation"),
        requirements: ["System architecture", "Data governance", "Risk management measures"],
      },
      {
        name: "Risk Assessment",
        score: calculateAreaScore(systemData, "risk"),
        requirements: ["Risk identification", "Risk evaluation", "Mitigation measures"],
      },
      {
        name: "Human Oversight",
        score: calculateAreaScore(systemData, "oversight"),
        requirements: ["Training procedures", "Operational guidance", "Override mechanisms"],
      },
      {
        name: "Data Governance",
        score: calculateAreaScore(systemData, "data"),
        requirements: ["Data quality", "Bias prevention", "Data minimization"],
      },
      {
        name: "Transparency",
        score: calculateAreaScore(systemData, "transparency"),
        requirements: ["User information", "Explainability", "Logging mechanisms"],
      }
    ];

    // Calculate overall score
    const overallScore = assessmentAreas.reduce((sum, area) => sum + area.score, 0) / assessmentAreas.length;

    // Generate findings and recommendations using AI
    const prompt = `
      Generate detailed compliance assessment findings and recommendations for an AI system with the following characteristics:
      ${JSON.stringify(systemData, null, 2)}
      
      Consider the following assessment areas and their scores (out of 100):
      ${assessmentAreas.map(area => `- ${area.name}: ${area.score}`).join('\n')}
      
      Overall compliance score: ${overallScore}
      
      Provide specific findings and actionable recommendations for each area to improve compliance with the EU AI Act.
    `;

    const aiResponse = await callDeepSeekApi(prompt);
    let aiFindings = {};
    
    try {
      aiFindings = JSON.parse(aiResponse);
    } catch (e) {
      // If parsing fails, use the raw response
      aiFindings = {
        summary: aiResponse,
        areas: assessmentAreas.map(area => ({
          name: area.name,
          findings: findingsFromScore(area.name, area.score),
          recommendations: [`Improve ${area.name.toLowerCase()} according to EU AI Act requirements`]
        }))
      };
    }

    return {
      timestamp: new Date().toISOString(),
      assessmentAreas,
      overallScore,
      complianceStatus: getComplianceStatus(overallScore),
      findings: aiFindings,
      nextSteps: generateNextSteps(assessmentAreas)
    };
  } catch (error) {
    console.error("Error in compliance assessment:", error);
    return {
      error: "Failed to complete compliance assessment",
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Calculate a score for a specific assessment area
 */
function calculateAreaScore(systemData: any, area: string): number {
  // This would normally involve a complex assessment based on the system's properties
  // For now, we'll use a simplified scoring approach
  const baseScore = 50; // Start with a middle score
  
  switch (area) {
    case "documentation":
      return baseScore + (systemData.documentation ? 30 : 0);
    case "risk":
      return baseScore + (systemData.riskAssessment ? 40 : 0) - (systemData.riskLevel === "High" ? 20 : 0);
    case "oversight":
      return baseScore + (systemData.humanOversight ? 35 : 0);
    case "data":
      return baseScore + (systemData.dataQuality ? 40 : 0) + (systemData.biasChecks ? 10 : 0);
    case "transparency":
      return baseScore + (systemData.transparency ? 30 : 0) + (systemData.logging ? 20 : 0);
    default:
      return baseScore;
  }
}

/**
 * Determine the overall compliance status based on score
 */
function getComplianceStatus(score: number): string {
  if (score >= 80) return "Compliant";
  if (score >= 60) return "Partially Compliant";
  return "Non-Compliant";
}

/**
 * Generate findings based on a score for a specific area
 */
function findingsFromScore(area: string, score: number = 0): string[] {
  if (score >= 80) {
    return [`${area} is well-implemented with minor improvements needed`];
  } else if (score >= 50) {
    return [`${area} requires moderate improvements to reach full compliance`];
  } else {
    return [`${area} has significant gaps that must be addressed urgently`];
  }
}

/**
 * Generate next steps based on assessment areas
 */
function generateNextSteps(assessmentAreas: any[]): string[] {
  // Sort areas by score (ascending) to prioritize the weakest areas
  const sortedAreas = [...assessmentAreas].sort((a, b) => a.score - b.score);
  
  return sortedAreas.slice(0, 3).map(area => 
    `Improve ${area.name} compliance (current score: ${area.score}/100)`
  );
}


import type { AiSystem } from '@shared/schema';
import { callDeepSeekApi } from './ai-analysis';

// Advanced compliance assessment interface
export interface ComplianceAssessment {
  systemId: string;
  assessmentDate: Date;
  overallRating: 'compliant' | 'partially_compliant' | 'non_compliant';
  score: number;
  assessmentAreas: {
    name: string;
    score: number;
    findings: string[];
    recommendations: string[];
  }[];
  nextSteps: string[];
  timeline: {
    phase: string;
    deadline: Date;
    description: string;
  }[];
}

/**
 * Perform a comprehensive EU AI Act compliance assessment
 */
export async function performComplianceAssessment(
  system: Partial<AiSystem>
): Promise<ComplianceAssessment> {
  try {
    // Use existing compliance scoring
    const { 
      calculateComprehensiveScore, 
      generateComplianceRoadmap 
    } = require('./compliance-scoring');
    
    const complianceScore = calculateComprehensiveScore(system);
    const roadmap = generateComplianceRoadmap(system);
    
    // Deep assessment using AI
    const aiAssessment = await generateAiAssessment(system);
    
    // Determine overall rating
    let overallRating: 'compliant' | 'partially_compliant' | 'non_compliant';
    if (complianceScore.overallScore >= 80) {
      overallRating = 'compliant';
    } else if (complianceScore.overallScore >= 50) {
      overallRating = 'partially_compliant';
    } else {
      overallRating = 'non_compliant';
    }
    
    // Generate assessment areas based on EU AI Act requirements
    const assessmentAreas = [
      {
        name: 'Risk Management',
        score: complianceScore.categoryScores['Risk Management System'] || 0,
        findings: findingsFromScore('Risk Management', complianceScore.categoryScores['Risk Management System']),
        recommendations: aiAssessment.riskRecommendations || []
      },
      {
        name: 'Data Governance',
        score: complianceScore.categoryScores['Data Governance'] || 0,
        findings: findingsFromScore('Data Governance', complianceScore.categoryScores['Data Governance']),
        recommendations: aiAssessment.dataRecommendations || []
      },
      {
        name: 'Technical Documentation',
        score: complianceScore.categoryScores['Technical Documentation'] || 0,
        findings: findingsFromScore('Technical Documentation', complianceScore.categoryScores['Technical Documentation']),
        recommendations: aiAssessment.documentationRecommendations || []
      },
      {
        name: 'Human Oversight',
        score: complianceScore.categoryScores['Human Oversight'] || 0,
        findings: findingsFromScore('Human Oversight', complianceScore.categoryScores['Human Oversight']),
        recommendations: aiAssessment.oversightRecommendations || []
      },
      {
        name: 'Transparency',
        score: complianceScore.categoryScores['Transparency'] || 0,
        findings: findingsFromScore('Transparency', complianceScore.categoryScores['Transparency']),
        recommendations: aiAssessment.transparencyRecommendations || []
      }
    ];
    
    // Generate timeline based on roadmap
    const now = new Date();
    const timeline = [
      {
        phase: 'Assessment',
        deadline: new Date(now.setDate(now.getDate() + 14)),
        description: 'Complete initial compliance assessment and gap analysis'
      },
      {
        phase: 'Documentation',
        deadline: new Date(now.setDate(now.getDate() + 30)),
        description: 'Develop required technical documentation and conformity assessment'
      },
      {
        phase: 'Implementation',
        deadline: new Date(now.setDate(now.getDate() + 60)),
        description: 'Implement required changes to the system and processes'
      },
      {
        phase: 'Verification',
        deadline: new Date(now.setDate(now.getDate() + 30)),
        description: 'Verify compliance measures and conduct final assessment'
      }
    ];
    
    return {
      systemId: system.id?.toString() || '',
      assessmentDate: new Date(),
      overallRating,
      score: complianceScore.overallScore,
      assessmentAreas,
      nextSteps: roadmap.priorityActions.immediate || [],
      timeline
    };
  } catch (error) {
    console.error('Error performing compliance assessment:', error);
    throw error;
  }
}

/**
 * Generate findings based on score
 */
function findingsFromScore(area: string, score: number = 0): string[] {
  if (score >= 80) {
    return [`${area} is well-implemented with minor improvements needed`];
  } else if (score >= 50) {
    return [`${area} requires moderate improvements to reach full compliance`];
  } else {
    return [`${area} has significant gaps that must be addressed urgently`];
  }
}

/**
 * Generate AI-powered assessment recommendations
 */
async function generateAiAssessment(system: Partial<AiSystem>): Promise<any> {
  try {
    const prompt = `
      As an EU AI Act compliance expert, analyze the following AI system and provide 
      specific recommendations for each compliance area:
      
      System Name: ${system.name || 'N/A'}
      Description: ${system.description || 'N/A'}
      Purpose: ${system.purpose || 'N/A'}
      Risk Level: ${system.riskLevel || 'N/A'}
      
      For each of these areas, provide 2-3 specific recommendations:
      1. Risk Management
      2. Data Governance
      3. Technical Documentation
      4. Human Oversight
      5. Transparency
      
      Format your response as JSON with these keys: riskRecommendations, dataRecommendations, 
      documentationRecommendations, oversightRecommendations, transparencyRecommendations.
      Each should be an array of strings.
    `;
    
    const response = await callDeepSeekApi(prompt);
    
    try {
      return JSON.parse(response);
    } catch (e) {
      // Return default recommendations if parsing fails
      return {
        riskRecommendations: ['Implement a comprehensive risk management system', 'Conduct regular risk assessments'],
        dataRecommendations: ['Document data governance procedures', 'Implement data quality measures'],
        documentationRecommendations: ['Create technical documentation according to Article 11', 'Maintain clear version control'],
        oversightRecommendations: ['Establish human oversight protocols', 'Document human intervention procedures'],
        transparencyRecommendations: ['Ensure system transparency for users', 'Document limitations and capabilities clearly']
      };
    }
  } catch (error) {
    console.error('Error generating AI assessment:', error);
    return {
      riskRecommendations: ['Implement a comprehensive risk management system', 'Conduct regular risk assessments'],
      dataRecommendations: ['Document data governance procedures', 'Implement data quality measures'],
      documentationRecommendations: ['Create technical documentation according to Article 11', 'Maintain clear version control'],
      oversightRecommendations: ['Establish human oversight protocols', 'Document human intervention procedures'],
      transparencyRecommendations: ['Ensure system transparency for users', 'Document limitations and capabilities clearly']
    };
  }
}
