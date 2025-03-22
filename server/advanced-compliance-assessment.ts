
import { callDeepSeekApi } from "./ai-analysis";
import type { AiSystem } from '@shared/schema';
import { calculateComprehensiveScore, generateComplianceRoadmap } from './compliance-scoring';

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
