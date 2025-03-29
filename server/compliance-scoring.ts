
import type { AiSystem } from '@shared/schema';

// Interface for compliance scoring criteria
interface ComplianceCriteria {
  name: string;
  weight: number;
  scoringFunction: (system: Partial<AiSystem>) => number;
  relevantArticles: string[];
}

// Interface for compliance score results
export interface ComplianceScore {
  overallScore: number;
  categoryScores: {
    [key: string]: number;
  };
  completionStatus: {
    [key: string]: number;
  };
  gaps: string[];
  recommendations: string[];
  relevantArticles: string[];
}

// Define the compliance scoring criteria based on EU AI Act requirements
const complianceCriteria: ComplianceCriteria[] = [
  {
    name: 'Risk Management System',
    weight: 0.15,
    scoringFunction: (system) => {
      let score = 0;
      if (system.riskLevel) score += 40;
      if (system.riskScore) score += 30;
      if (system.lastAssessmentDate) score += 30;
      return score;
    },
    relevantArticles: ['Article 9']
  },
  {
    name: 'Data Governance',
    weight: 0.15,
    scoringFunction: (system) => {
      let score = 0;
      // Score based on available governance-related fields
      // Use existing fields that indicate data governance aspects
      if (system.trainingDatasets) score += 50;
      if (system.usageContext) score += 50;
      return score;
    },
    relevantArticles: ['Article 10']
  },
  {
    name: 'Technical Documentation',
    weight: 0.15,
    scoringFunction: (system) => {
      return system.docCompleteness || 0;
    },
    relevantArticles: ['Article 11']
  },
  {
    name: 'Record Keeping',
    weight: 0.1,
    scoringFunction: (system) => {
      let score = 0;
      // Use alternative fields that might indicate record-keeping capabilities
      if (system.expectedLifetime) score += 25;
      if (system.maintenanceSchedule) score += 25;
      if (system.lastAssessmentDate) score += 50;
      return score;
    },
    relevantArticles: ['Article 12']
  },
  {
    name: 'Transparency',
    weight: 0.1,
    scoringFunction: (system) => {
      let score = 0;
      // Check for transparency through documentation, description clarity
      if (system.description) score += 40;
      if (system.potentialImpact) score += 60;
      return Math.min(score, 100); // Cap at 100
    },
    relevantArticles: ['Article 13']
  },
  {
    name: 'Human Oversight',
    weight: 0.15,
    scoringFunction: (system) => {
      let score = 0;
      // Evaluate human oversight based on existing fields
      if (system.usageContext) score += 70; // Usage context often defines human involvement
      if (system.department) score += 30; // Having department indicates oversight structure
      return score;
    },
    relevantArticles: ['Article 14']
  },
  {
    name: 'Accuracy & Robustness',
    weight: 0.1,
    scoringFunction: (system) => {
      let score = 0;
      // Use related fields to determine accuracy and robustness
      if (system.aiCapabilities) score += 40;
      if (system.trainingDatasets) score += 30;
      if (system.version) score += 30; // Having a version indicates quality control
      return score;
    },
    relevantArticles: ['Article 15']
  },
  {
    name: 'Training & Implementation',
    weight: 0.1,
    scoringFunction: (system) => {
      return system.trainingCompleteness || 0;
    },
    relevantArticles: ['Article 16', 'Article 29']
  }
];

/**
 * Calculate a comprehensive compliance score for an AI system
 */
export function calculateComprehensiveScore(system: Partial<AiSystem>): ComplianceScore {
  const categoryScores: { [key: string]: number } = {};
  const completionStatus: { [key: string]: number } = {};
  let weightedScore = 0;
  const relevantArticles: string[] = [];
  
  // Calculate scores for each category
  complianceCriteria.forEach(criteria => {
    const score = criteria.scoringFunction(system);
    categoryScores[criteria.name] = score;
    completionStatus[criteria.name] = score;
    weightedScore += score * criteria.weight;
    
    // Add relevant articles
    criteria.relevantArticles.forEach(article => {
      if (!relevantArticles.includes(article)) {
        relevantArticles.push(article);
      }
    });
  });
  
  // Calculate overall score (0-100)
  // The weights should sum to 1, so the weighted score will be between 0-100
  // However, we need to ensure we're not underscoring due to missing fields
  // If any criteria has no score, adjust the weights accordingly
  const validCriteriaWeightSum = complianceCriteria.reduce((sum, criteria) => {
    return sum + (categoryScores[criteria.name] > 0 ? criteria.weight : 0);
  }, 0);
  
  // Calculate adjusted overall score - set minimum to avoid extremely low scores
  // when only a few criteria are filled
  const overallScore = Math.max(
    Math.round(weightedScore * (validCriteriaWeightSum > 0 ? 1 / validCriteriaWeightSum : 1)), 
    15 // Minimum score to prevent extremely low values
  );
  
  // Identify gaps (categories with scores < 50)
  const gaps = Object.entries(categoryScores)
    .filter(([_, score]) => score < 50)
    .map(([category, score]) => `${category} (${score}% complete)`);
  
  // Generate recommendations
  const recommendations = generateRecommendations(categoryScores, system);
  
  return {
    overallScore,
    categoryScores,
    completionStatus,
    gaps,
    recommendations,
    relevantArticles
  };
}

/**
 * Generate specific recommendations based on compliance gaps
 */
function generateRecommendations(scores: { [key: string]: number }, system: Partial<AiSystem>): string[] {
  const recommendations: string[] = [];
  
  // Check Risk Management
  if (scores['Risk Management System'] < 70) {
    recommendations.push('Implement a comprehensive risk management system with regular assessments');
  }
  
  // Check Data Governance
  if (scores['Data Governance'] < 70) {
    recommendations.push('Enhance data governance practices with focus on quality control and data protection');
  }
  
  // Check Technical Documentation
  if (scores['Technical Documentation'] < 80) {
    recommendations.push('Complete technical documentation including system architecture, algorithms, and validation');
  }
  
  // Check Record Keeping
  if (scores['Record Keeping'] < 60) {
    recommendations.push('Implement robust logging and audit trail mechanisms');
  }
  
  // Check Transparency
  if (scores['Transparency'] < 50) {
    recommendations.push('Enhance transparency measures for end-users and affected individuals');
  }
  
  // Check Human Oversight
  if (scores['Human Oversight'] < 70) {
    recommendations.push('Strengthen human oversight protocols, especially for decision-making processes');
  }
  
  // Check Accuracy & Robustness
  if (scores['Accuracy & Robustness'] < 60) {
    recommendations.push('Implement regular accuracy testing and bias monitoring');
  }
  
  // Check Training & Implementation
  if (scores['Training & Implementation'] < 50) {
    recommendations.push('Develop comprehensive training for staff on EU AI Act requirements');
  }
  
  // High-risk specific recommendations
  if (system.riskLevel === 'High' || system.riskLevel === 'High Risk') {
    recommendations.push('Conduct a formal conformity assessment as required for high-risk AI systems');
  }
  
  return recommendations;
}

/**
 * Generate a compliance roadmap with prioritized actions
 */
export function generateComplianceRoadmap(system: Partial<AiSystem>): any {
  const score = calculateComprehensiveScore(system);
  
  // Prioritize actions based on impact and effort
  const highPriorityActions = score.recommendations.slice(0, 3);
  const mediumPriorityActions = score.recommendations.slice(3, 6);
  const lowPriorityActions = score.recommendations.slice(6);
  
  // Generate timeline estimates based on risk level
  const timelineMultiplier = system.riskLevel === 'High' ? 1 : 
                           system.riskLevel === 'Limited' ? 1.5 : 2;
  
  return {
    currentScore: score.overallScore,
    priorityActions: {
      immediate: highPriorityActions,
      shortTerm: mediumPriorityActions,
      longTerm: lowPriorityActions
    },
    estimatedTimeline: {
      assessmentPhase: `${Math.round(2 * timelineMultiplier)} weeks`,
      implementationPhase: `${Math.round(6 * timelineMultiplier)} weeks`,
      verificationPhase: `${Math.round(4 * timelineMultiplier)} weeks`
    }
  };
}
