
import type { AiSystem } from '@shared/schema';
import { storage } from './storage';
import { calculateComprehensiveScore } from './compliance-scoring';

// Monitoring configuration interface
export interface MonitoringConfig {
  frequencyDays: number;
  alertThreshold: number;
  monitoringEnabled: boolean;
  notificationEmail: string;
}

// Monitoring result interface
export interface MonitoringResult {
  systemId: string;
  timestamp: Date;
  complianceScore: number;
  previousScore: number | null;
  scoreDelta: number | null;
  alerts: {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  statuses: {
    area: string;
    status: 'improved' | 'declined' | 'unchanged';
    currentScore: number;
    previousScore: number | null;
  }[];
}

/**
 * Initialize monitoring system
 */
export async function initializeMonitoring(): Promise<void> {
  // In a production environment, this would set up scheduled monitoring tasks
  console.log('Compliance monitoring system initialized');
}

/**
 * Perform monitoring check for a specific AI system
 */
export async function performMonitoringCheck(
  systemId: string,
  config?: Partial<MonitoringConfig>
): Promise<MonitoringResult> {
  try {
    // Get system details
    const system = await storage.getAiSystem(parseInt(systemId));
    
    if (!system) {
      throw new Error('System not found');
    }
    
    // Get monitoring history
    const monitoringHistory = await storage.getMonitoringHistory(systemId);
    const previousCheck = monitoringHistory.length > 0 ? monitoringHistory[0] : null;
    
    // Calculate current compliance score
    const complianceScore = calculateComprehensiveScore(system);
    const currentScore = complianceScore.overallScore;
    const previousScore = previousCheck ? previousCheck.score : null;
    const scoreDelta = previousScore !== null ? currentScore - previousScore : null;
    
    // Generate alerts based on score changes
    const alerts = generateAlerts(system, currentScore, previousScore, scoreDelta, config?.alertThreshold || 10);
    
    // Generate status updates for each compliance area
    const statuses = Object.entries(complianceScore.categoryScores).map(([area, score]) => {
      // Get previous score for this area
      const prevAreaScore = previousCheck?.areaScores?.[area] || null;
      
      // Determine status
      let status: 'improved' | 'declined' | 'unchanged' = 'unchanged';
      if (prevAreaScore !== null) {
        status = score > prevAreaScore ? 'improved' : score < prevAreaScore ? 'declined' : 'unchanged';
      }
      
      return {
        area,
        status,
        currentScore: score,
        previousScore: prevAreaScore
      };
    });
    
    // Save monitoring result
    const monitoringResult: MonitoringResult = {
      systemId,
      timestamp: new Date(),
      complianceScore: currentScore,
      previousScore,
      scoreDelta,
      alerts,
      statuses
    };
    
    // In a production environment, this would save the result to a database
    
    return monitoringResult;
  } catch (error) {
    console.error('Error performing monitoring check:', error);
    throw error;
  }
}

/**
 * Generate alerts based on monitoring results
 */
function generateAlerts(
  system: AiSystem,
  currentScore: number,
  previousScore: number | null,
  scoreDelta: number | null,
  alertThreshold: number
): { type: string; message: string; severity: 'low' | 'medium' | 'high' }[] {
  const alerts = [];
  
  // Alert on significant score decrease
  if (scoreDelta !== null && scoreDelta < -alertThreshold) {
    alerts.push({
      type: 'score_decrease',
      message: `Compliance score has decreased by ${Math.abs(scoreDelta)} points`,
      severity: 'high'
    });
  }
  
  // Alert on low compliance score for high-risk systems
  if (system.riskLevel === 'High' && currentScore < 70) {
    alerts.push({
      type: 'high_risk_low_compliance',
      message: `High-risk system has low compliance score (${currentScore})`,
      severity: 'high'
    });
  }
  
  // Alert on missing critical documentation
  if (system.docCompleteness && system.docCompleteness < 50) {
    alerts.push({
      type: 'missing_documentation',
      message: 'Critical documentation is incomplete',
      severity: 'medium'
    });
  }
  
  return alerts;
}

/**
 * Configure monitoring for a system
 */
export async function configureMonitoring(
  systemId: string,
  config: MonitoringConfig
): Promise<boolean> {
  try {
    // In a production environment, this would save the configuration to a database
    console.log(`Configured monitoring for system ${systemId}:`, config);
    return true;
  } catch (error) {
    console.error('Error configuring monitoring:', error);
    return false;
  }
}

/**
 * Get monitoring history for a system
 */
export async function getMonitoringHistory(systemId: string): Promise<MonitoringResult[]> {
  try {
    // In a production environment, this would fetch from the database
    return [];
  } catch (error) {
    console.error('Error getting monitoring history:', error);
    return [];
  }
}
