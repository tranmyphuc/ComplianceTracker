
/**
 * Risk Management Module
 * 
 * Handles ongoing risk management for AI systems under the EU AI Act.
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';
import { 
  AppError, 
  BusinessLogicError, 
  ResourceNotFoundError 
} from './error-handling';
import { AIModel, callAI } from './ai-service';
import { RiskLevel, RiskAssessment, ComplianceGap } from './risk-assessment';

// Risk management system status types
export enum RiskManagementStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_REVIEW = 'under_review',
  OUTDATED = 'outdated'
}

// Risk control types
export enum ControlType {
  TECHNICAL = 'technical',
  PROCEDURAL = 'procedural',
  ORGANIZATIONAL = 'organizational',
  CONTRACTUAL = 'contractual'
}

// Control effectiveness levels
export enum ControlEffectiveness {
  VERY_EFFECTIVE = 'very_effective',
  EFFECTIVE = 'effective',
  PARTIALLY_EFFECTIVE = 'partially_effective',
  INEFFECTIVE = 'ineffective',
  NOT_IMPLEMENTED = 'not_implemented',
  NOT_TESTED = 'not_tested'
}

// Risk control model
export interface RiskControl {
  controlId: string;
  systemId: string;
  name: string;
  description: string;
  controlType: ControlType;
  implementationStatus: 'planned' | 'in_progress' | 'implemented' | 'verified' | 'failed';
  effectiveness?: ControlEffectiveness;
  implementationDate?: Date;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  responsiblePerson?: string;
  relatedGaps?: string[]; // ComplianceGap IDs
  documentationLinks?: string[];
  testResults?: any[];
  notes?: string;
}

// Risk monitoring events
export interface RiskMonitoringEvent {
  eventId: string;
  systemId: string;
  eventType: 'incident' | 'near_miss' | 'performance_deviation' | 'external_factor' | 'user_feedback';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  detectionDate: Date;
  reportedBy: string;
  status: 'new' | 'under_investigation' | 'resolved' | 'closed';
  impact?: string;
  rootCause?: string;
  mitigationActions?: string[];
  recurrencePrevention?: string;
  closureDate?: Date;
  relatedControls?: string[]; // RiskControl IDs
}

// Risk management system model
export interface RiskManagementSystem {
  systemId: string;
  rmsId: string;
  status: RiskManagementStatus;
  createdDate: Date;
  lastUpdateDate: Date;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  reviewCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  responsiblePerson?: string;
  documentReference?: string;
  version: number;
  notes?: string;
}

/**
 * Create a new risk management system
 */
export async function createRiskManagementSystem(
  systemId: string,
  userId: string,
  reviewCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' = 'quarterly'
): Promise<RiskManagementSystem> {
  try {
    // Check if system exists
    const system = await storage.getAiSystemBySystemId(systemId);
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Check if RMS already exists
    const existingRMS = await storage.getRiskManagementSystemBySystemId(systemId);
    if (existingRMS) {
      throw new BusinessLogicError('Risk management system already exists for this AI system');
    }
    
    // Calculate next review date
    let nextReviewDate = new Date();
    
    switch (reviewCycle) {
      case 'monthly':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
        break;
      case 'semi-annual':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 6);
        break;
      case 'annual':
        nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
        break;
    }
    
    // Create new RMS
    const rms: RiskManagementSystem = {
      systemId,
      rmsId: `rms_${uuidv4()}`,
      status: RiskManagementStatus.ACTIVE,
      createdDate: new Date(),
      lastUpdateDate: new Date(),
      nextReviewDate,
      reviewCycle,
      responsiblePerson: userId,
      version: 1
    };
    
    const createdRMS = await storage.createRiskManagementSystem(rms);
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_management_system_created',
      description: `Risk management system created for ${system.name}`,
      userId,
      systemId,
      timestamp: new Date(),
      metadata: { rmsId: rms.rmsId }
    });
    
    return createdRMS;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to create risk management system', error);
  }
}

/**
 * Get risk management system by system ID
 */
export async function getRiskManagementSystem(systemId: string): Promise<RiskManagementSystem> {
  try {
    const rms = await storage.getRiskManagementSystemBySystemId(systemId);
    
    if (!rms) {
      throw new ResourceNotFoundError('Risk management system', `for system ${systemId}`);
    }
    
    return rms;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to retrieve risk management system', error);
  }
}

/**
 * Update risk management system
 */
export async function updateRiskManagementSystem(
  systemId: string,
  updates: Partial<RiskManagementSystem>,
  userId: string
): Promise<RiskManagementSystem> {
  try {
    // Get existing RMS
    const rms = await storage.getRiskManagementSystemBySystemId(systemId);
    
    if (!rms) {
      throw new ResourceNotFoundError('Risk management system', `for system ${systemId}`);
    }
    
    // Apply updates
    const updatedRMS = await storage.updateRiskManagementSystem(rms.rmsId, {
      ...updates,
      lastUpdateDate: new Date(),
      version: rms.version + 1
    });
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_management_system_updated',
      description: `Risk management system updated for system ID ${systemId}`,
      userId,
      systemId,
      timestamp: new Date(),
      metadata: { rmsId: rms.rmsId }
    });
    
    return updatedRMS;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to update risk management system', error);
  }
}

/**
 * Create a risk control
 */
export async function createRiskControl(
  control: Partial<RiskControl>,
  userId: string
): Promise<RiskControl> {
  try {
    // Check if system exists
    const system = await storage.getAiSystemBySystemId(control.systemId);
    if (!system) {
      throw new ResourceNotFoundError('System', control.systemId);
    }
    
    // Create the control
    const newControl: RiskControl = {
      ...control,
      controlId: `ctrl_${uuidv4()}`,
      implementationStatus: control.implementationStatus || 'planned',
      effectiveness: control.effectiveness || ControlEffectiveness.NOT_TESTED
    } as RiskControl;
    
    const createdControl = await storage.createRiskControl(newControl);
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_control_created',
      description: `Risk control "${control.name}" created for ${system.name}`,
      userId,
      systemId: control.systemId,
      timestamp: new Date(),
      metadata: { controlId: newControl.controlId }
    });
    
    return createdControl;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to create risk control', error);
  }
}

/**
 * Update a risk control
 */
export async function updateRiskControl(
  controlId: string,
  updates: Partial<RiskControl>,
  userId: string
): Promise<RiskControl> {
  try {
    // Get existing control
    const control = await storage.getRiskControlByControlId(controlId);
    
    if (!control) {
      throw new ResourceNotFoundError('Risk control', controlId);
    }
    
    // Apply updates
    const updatedControl = await storage.updateRiskControl(controlId, updates);
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_control_updated',
      description: `Risk control "${control.name}" updated`,
      userId,
      systemId: control.systemId,
      timestamp: new Date(),
      metadata: { controlId }
    });
    
    return updatedControl;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to update risk control', error);
  }
}

/**
 * Get risk controls for a system
 */
export async function getRiskControlsForSystem(systemId: string): Promise<RiskControl[]> {
  try {
    // Check if system exists
    const system = await storage.getAiSystemBySystemId(systemId);
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    return await storage.getRiskControlsBySystemId(systemId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to retrieve risk controls', error);
  }
}

/**
 * Record a risk monitoring event
 */
export async function recordRiskEvent(
  event: Partial<RiskMonitoringEvent>,
  userId: string
): Promise<RiskMonitoringEvent> {
  try {
    // Check if system exists
    const system = await storage.getAiSystemBySystemId(event.systemId);
    if (!system) {
      throw new ResourceNotFoundError('System', event.systemId);
    }
    
    // Create the event
    const newEvent: RiskMonitoringEvent = {
      ...event,
      eventId: `evt_${uuidv4()}`,
      detectionDate: event.detectionDate || new Date(),
      reportedBy: userId,
      status: event.status || 'new'
    } as RiskMonitoringEvent;
    
    const createdEvent = await storage.createRiskEvent(newEvent);
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_event_recorded',
      description: `Risk event recorded for ${system.name}: ${event.eventType} - ${event.severity}`,
      userId,
      systemId: event.systemId,
      timestamp: new Date(),
      metadata: { eventId: newEvent.eventId }
    });
    
    return createdEvent;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to record risk event', error);
  }
}

/**
 * Update a risk monitoring event
 */
export async function updateRiskEvent(
  eventId: string,
  updates: Partial<RiskMonitoringEvent>,
  userId: string
): Promise<RiskMonitoringEvent> {
  try {
    // Get existing event
    const event = await storage.getRiskEventByEventId(eventId);
    
    if (!event) {
      throw new ResourceNotFoundError('Risk event', eventId);
    }
    
    // Apply updates
    const updatedEvent = await storage.updateRiskEvent(eventId, updates);
    
    // If status is changed to resolved or closed, set closure date
    if ((updates.status === 'resolved' || updates.status === 'closed') && !updates.closureDate) {
      updatedEvent.closureDate = new Date();
      await storage.updateRiskEvent(eventId, { closureDate: updatedEvent.closureDate });
    }
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_event_updated',
      description: `Risk event updated: ${event.eventType} - ${event.severity}`,
      userId,
      systemId: event.systemId,
      timestamp: new Date(),
      metadata: { eventId }
    });
    
    return updatedEvent;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to update risk event', error);
  }
}

/**
 * Get risk events for a system
 */
export async function getRiskEventsForSystem(systemId: string): Promise<RiskMonitoringEvent[]> {
  try {
    // Check if system exists
    const system = await storage.getAiSystemBySystemId(systemId);
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    return await storage.getRiskEventsBySystemId(systemId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to retrieve risk events', error);
  }
}

/**
 * Generate risk controls from assessment gaps
 */
export async function generateRiskControlsFromGaps(
  systemId: string, 
  userId: string
): Promise<RiskControl[]> {
  try {
    // Get system
    const system = await storage.getAiSystemBySystemId(systemId);
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Get latest assessment
    const assessments = await storage.getRiskAssessmentsForSystem(systemId);
    const latestAssessment = assessments.sort((a, b) => 
      new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
    )[0];
    
    if (!latestAssessment) {
      throw new BusinessLogicError('No risk assessment found for this system');
    }
    
    // Get compliance gaps from the assessment
    const gaps = await storage.getComplianceGapsForAssessment(latestAssessment.assessmentId);
    
    if (gaps.length === 0) {
      return [];
    }
    
    // Generate controls for each gap
    const generatedControls: RiskControl[] = [];
    
    for (const gap of gaps) {
      if (gap.remediationRequired) {
        // Check if control already exists for this gap
        const existingControls = await storage.getRiskControlsByGapId(gap.id);
        
        if (existingControls.length === 0) {
          // Generate control using AI
          const controlSuggestion = await suggestControlForGap(gap, system);
          
          // Create the control
          const control: Partial<RiskControl> = {
            systemId,
            name: controlSuggestion.name,
            description: controlSuggestion.description,
            controlType: controlSuggestion.type as ControlType,
            implementationStatus: 'planned',
            effectiveness: ControlEffectiveness.NOT_IMPLEMENTED,
            responsiblePerson: gap.assignedToId,
            relatedGaps: [gap.id],
            notes: `Automatically generated for compliance gap: ${gap.gapDescription}`
          };
          
          const createdControl = await createRiskControl(control, userId);
          generatedControls.push(createdControl);
        }
      }
    }
    
    return generatedControls;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to generate risk controls', error);
  }
}

/**
 * Suggest a control for a compliance gap
 */
async function suggestControlForGap(gap: ComplianceGap, system: any): Promise<any> {
  try {
    const prompt = `
      As an AI regulatory compliance expert, suggest a specific risk control to address the following compliance gap in an AI system:
      
      System name: ${system.name}
      System description: ${system.description || 'Not provided'}
      System purpose: ${system.purpose || 'Not provided'}
      Risk level: ${system.riskLevel || 'Not determined'}
      
      Compliance gap:
      Category: ${gap.requirementCategory}
      Requirement reference: ${gap.requirementReference || 'Not specified'}
      Gap description: ${gap.gapDescription}
      
      Please suggest a specific risk control with the following information:
      1. Control name (brief title)
      2. Control description (detailed explanation)
      3. Control type (technical, procedural, organizational, or contractual)
      4. Expected effectiveness
      5. Implementation steps
      
      Format your response as a JSON object with the following structure:
      {
        "name": "Control name",
        "description": "Detailed description",
        "type": "technical|procedural|organizational|contractual",
        "expectedEffectiveness": "high|medium|low",
        "implementationSteps": [
          "Step 1",
          "Step 2",
          "Step 3"
        ]
      }
    `;
    
    const response = await callAI({
      prompt,
      model: AIModel.DEEPSEEK,
      temperature: 0.3
    });
    
    try {
      return JSON.parse(response.text);
    } catch (error) {
      console.error('Error parsing AI suggestion:', error);
      
      // Fallback to basic control
      return {
        name: `Control for ${gap.requirementCategory}`,
        description: `Address compliance gap: ${gap.gapDescription}`,
        type: getDefaultControlType(gap.requirementCategory),
        expectedEffectiveness: 'medium',
        implementationSteps: ['Review requirements', 'Implement solution', 'Test and validate']
      };
    }
  } catch (error) {
    console.error('Error suggesting control:', error);
    
    // Fallback to basic control
    return {
      name: `Control for ${gap.requirementCategory}`,
      description: `Address compliance gap: ${gap.gapDescription}`,
      type: getDefaultControlType(gap.requirementCategory),
      expectedEffectiveness: 'medium',
      implementationSteps: ['Review requirements', 'Implement solution', 'Test and validate']
    };
  }
}

/**
 * Get default control type based on requirement category
 */
function getDefaultControlType(category: string): ControlType {
  switch (category) {
    case 'RiskManagement':
      return ControlType.PROCEDURAL;
    case 'DataGovernance':
      return ControlType.TECHNICAL;
    case 'TechnicalDocumentation':
      return ControlType.PROCEDURAL;
    case 'RecordKeeping':
      return ControlType.TECHNICAL;
    case 'Transparency':
      return ControlType.PROCEDURAL;
    case 'HumanOversight':
      return ControlType.ORGANIZATIONAL;
    case 'Accuracy':
      return ControlType.TECHNICAL;
    default:
      return ControlType.PROCEDURAL;
  }
}

/**
 * Generate risk management report
 */
export async function generateRiskManagementReport(req: Request, res: Response): Promise<void> {
  try {
    const systemId = req.params.systemId;
    
    // Get system
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Get risk management system
    const rms = await storage.getRiskManagementSystemBySystemId(systemId);
    
    if (!rms) {
      throw new ResourceNotFoundError('Risk management system', `for system ${systemId}`);
    }
    
    // Get risk controls
    const controls = await storage.getRiskControlsBySystemId(systemId);
    
    // Get risk events
    const events = await storage.getRiskEventsBySystemId(systemId);
    
    // Get latest assessment
    const assessments = await storage.getRiskAssessmentsForSystem(systemId);
    const latestAssessment = assessments.sort((a, b) => 
      new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
    )[0];
    
    // Calculate effectiveness metrics
    const implementedControls = controls.filter(c => c.implementationStatus === 'implemented' || c.implementationStatus === 'verified');
    const effectiveControls = implementedControls.filter(c => c.effectiveness === ControlEffectiveness.VERY_EFFECTIVE || c.effectiveness === ControlEffectiveness.EFFECTIVE);
    
    const effectivenessRate = implementedControls.length > 0 
      ? Math.round((effectiveControls.length / implementedControls.length) * 100) 
      : 0;
    
    const openEvents = events.filter(e => e.status === 'new' || e.status === 'under_investigation');
    const criticalEvents = events.filter(e => e.severity === 'critical');
    
    // Build report data
    const reportData = {
      systemId: system.systemId,
      systemName: system.name,
      riskLevel: system.riskLevel || latestAssessment?.riskLevel || 'Not determined',
      reportDate: new Date(),
      riskManagementSystem: {
        status: rms.status,
        lastReviewDate: rms.lastReviewDate,
        nextReviewDate: rms.nextReviewDate,
        reviewCycle: rms.reviewCycle,
        version: rms.version
      },
      controlSummary: {
        total: controls.length,
        byStatus: {
          planned: controls.filter(c => c.implementationStatus === 'planned').length,
          inProgress: controls.filter(c => c.implementationStatus === 'in_progress').length,
          implemented: implementedControls.length,
          verified: controls.filter(c => c.implementationStatus === 'verified').length,
          failed: controls.filter(c => c.implementationStatus === 'failed').length
        },
        byType: {
          technical: controls.filter(c => c.controlType === ControlType.TECHNICAL).length,
          procedural: controls.filter(c => c.controlType === ControlType.PROCEDURAL).length,
          organizational: controls.filter(c => c.controlType === ControlType.ORGANIZATIONAL).length,
          contractual: controls.filter(c => c.controlType === ControlType.CONTRACTUAL).length
        },
        effectivenessRate
      },
      eventSummary: {
        total: events.length,
        byStatus: {
          new: events.filter(e => e.status === 'new').length,
          underInvestigation: events.filter(e => e.status === 'under_investigation').length,
          resolved: events.filter(e => e.status === 'resolved').length,
          closed: events.filter(e => e.status === 'closed').length
        },
        bySeverity: {
          critical: criticalEvents.length,
          high: events.filter(e => e.severity === 'high').length,
          medium: events.filter(e => e.severity === 'medium').length,
          low: events.filter(e => e.severity === 'low').length
        },
        openCriticalEvents: criticalEvents.filter(e => e.status === 'new' || e.status === 'under_investigation').length
      },
      topRisks: await identifyTopRisks(system, events, controls),
      recentActivities: await getRecentRiskActivities(systemId, 5),
      complianceStatus: getComplianceStatusFromControls(controls, system.riskLevel),
      recommendations: await generateRiskRecommendations(system, controls, events)
    };
    
    res.json(reportData);
  } catch (error) {
    console.error('Error in generateRiskManagementReport:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.type,
        message: error.message,
        details: error.details
      });
    } else {
      res.status(500).json({
        error: 'internal_server_error',
        message: 'An unexpected error occurred during report generation'
      });
    }
  }
}

/**
 * Identify top risks based on events and controls
 */
async function identifyTopRisks(system: any, events: RiskMonitoringEvent[], controls: RiskControl[]): Promise<any[]> {
  try {
    // Identify risks based on open critical/high events
    const criticalEvents = events.filter(e => 
      (e.status === 'new' || e.status === 'under_investigation') && 
      (e.severity === 'critical' || e.severity === 'high')
    );
    
    // Identify risks based on failed controls
    const failedControls = controls.filter(c => 
      c.implementationStatus === 'failed' || c.effectiveness === ControlEffectiveness.INEFFECTIVE
    );
    
    // Combine the risks
    const topRisks = [
      ...criticalEvents.map(e => ({
        source: 'event',
        description: e.description,
        severity: e.severity,
        status: e.status,
        eventId: e.eventId
      })),
      ...failedControls.map(c => ({
        source: 'control',
        description: `Failed control: ${c.name}`,
        severity: c.effectiveness === ControlEffectiveness.INEFFECTIVE ? 'high' : 'medium',
        status: c.implementationStatus,
        controlId: c.controlId
      }))
    ];
    
    // Sort by severity
    return topRisks.sort((a, b) => {
      const severityRank = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityRank[b.severity] - severityRank[a.severity];
    }).slice(0, 5);
  } catch (error) {
    console.error('Error identifying top risks:', error);
    return [];
  }
}

/**
 * Get recent risk management activities
 */
async function getRecentRiskActivities(systemId: string, limit: number): Promise<any[]> {
  try {
    const activities = await storage.getActivitiesForSystem(systemId, limit);
    
    // Filter for risk-related activities
    return activities.filter(a => 
      a.type.startsWith('risk_') || 
      a.type.includes('assessment') || 
      a.type.includes('compliance')
    ).map(a => ({
      date: a.timestamp,
      type: a.type,
      description: a.description,
      userId: a.userId
    }));
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return [];
  }
}

/**
 * Get compliance status based on controls
 */
function getComplianceStatusFromControls(controls: RiskControl[], riskLevel: string): string {
  if (controls.length === 0) return 'No controls implemented';
  
  const implementedControls = controls.filter(c => 
    c.implementationStatus === 'implemented' || c.implementationStatus === 'verified'
  );
  
  const implementationRate = (implementedControls.length / controls.length) * 100;
  
  if (riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.UNACCEPTABLE) {
    if (implementationRate < 50) return 'Non-compliant';
    if (implementationRate < 80) return 'Partially compliant';
    return 'Compliant';
  } else {
    if (implementationRate < 30) return 'Non-compliant';
    if (implementationRate < 70) return 'Partially compliant';
    return 'Compliant';
  }
}

/**
 * Generate risk management recommendations
 */
async function generateRiskRecommendations(
  system: any, 
  controls: RiskControl[], 
  events: RiskMonitoringEvent[]
): Promise<string[]> {
  try {
    // Identify recommendation areas
    const plannedControls = controls.filter(c => c.implementationStatus === 'planned');
    const failedControls = controls.filter(c => c.implementationStatus === 'failed');
    const openCriticalEvents = events.filter(e => 
      (e.status === 'new' || e.status === 'under_investigation') && e.severity === 'critical'
    );
    
    const recommendations = [];
    
    // Prioritize critical events
    if (openCriticalEvents.length > 0) {
      recommendations.push(`Prioritize addressing ${openCriticalEvents.length} open critical risk events`);
    }
    
    // Recommend implementing planned controls
    if (plannedControls.length > 0) {
      recommendations.push(`Implement ${plannedControls.length} planned risk controls to improve compliance status`);
    }
    
    // Recommend fixing failed controls
    if (failedControls.length > 0) {
      recommendations.push(`Review and fix ${failedControls.length} failed control implementations`);
    }
    
    // Add general recommendations based on system risk level
    if (system.riskLevel === RiskLevel.HIGH) {
      recommendations.push('Schedule quarterly reassessments due to high-risk classification');
      recommendations.push('Enhance monitoring frequency for high-risk system operations');
    }
    
    // Ensure we have at least 3 recommendations
    if (recommendations.length < 3) {
      recommendations.push('Review and update risk management documentation regularly');
      recommendations.push('Conduct regular testing of implemented controls to verify effectiveness');
      recommendations.push('Maintain continuous monitoring for new risks and regulatory changes');
    }
    
    return recommendations.slice(0, 5);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [
      'Review and update risk management documentation regularly',
      'Implement all planned controls in a timely manner',
      'Monitor system for new risks and incidents'
    ];
  }
}

/**
 * Review risk management system
 */
export async function reviewRiskManagementSystem(req: Request, res: Response): Promise<void> {
  try {
    const systemId = req.params.systemId;
    const userId = req.body.userId;
    const reviewNotes = req.body.reviewNotes;
    
    // Get system
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Get risk management system
    const rms = await storage.getRiskManagementSystemBySystemId(systemId);
    
    if (!rms) {
      throw new ResourceNotFoundError('Risk management system', `for system ${systemId}`);
    }
    
    // Calculate next review date
    let nextReviewDate = new Date();
    
    switch (rms.reviewCycle) {
      case 'monthly':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
        break;
      case 'semi-annual':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 6);
        break;
      case 'annual':
        nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
        break;
    }
    
    // Update RMS
    const updatedRMS = await updateRiskManagementSystem(
      systemId,
      {
        lastReviewDate: new Date(),
        nextReviewDate,
        notes: reviewNotes ? `${rms.notes || ''}\n\nReview (${new Date().toISOString()}): ${reviewNotes}` : rms.notes
      },
      userId
    );
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_management_system_reviewed',
      description: `Risk management system reviewed for ${system.name}`,
      userId,
      systemId,
      timestamp: new Date(),
      metadata: { rmsId: rms.rmsId }
    });
    
    res.json(updatedRMS);
  } catch (error) {
    console.error('Error in reviewRiskManagementSystem:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.type,
        message: error.message,
        details: error.details
      });
    } else {
      res.status(500).json({
        error: 'internal_server_error',
        message: 'An unexpected error occurred during risk management system review'
      });
    }
  }
}

/**
 * Generate risk management system implementation plan
 */
export async function generateImplementationPlan(req: Request, res: Response): Promise<void> {
  try {
    const systemId = req.params.systemId;
    
    // Get system
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Get risk assessment data
    const assessments = await storage.getRiskAssessmentsForSystem(systemId);
    const latestAssessment = assessments.sort((a, b) => 
      new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
    )[0];
    
    if (!latestAssessment) {
      throw new BusinessLogicError('No risk assessment found for this system');
    }
    
    // Get gaps
    const gaps = await storage.getComplianceGapsForAssessment(latestAssessment.assessmentId);
    
    // Call AI for plan generation
    const prompt = `
      Generate a comprehensive risk management implementation plan for the following AI system:
      
      System Name: ${system.name}
      Description: ${system.description || 'Not provided'}
      Department: ${system.department || 'Not provided'}
      Purpose: ${system.purpose || 'Not provided'}
      Risk Level: ${system.riskLevel || latestAssessment.riskLevel || 'Not determined'}
      
      The system has ${gaps.length} identified compliance gaps in the following categories:
      ${Object.entries(gaps.reduce((acc, gap) => {
        acc[gap.requirementCategory] = (acc[gap.requirementCategory] || 0) + 1;
        return acc;
      }, {})).map(([category, count]) => `- ${category}: ${count} gaps`).join('\n')}
      
      Please create a detailed implementation plan with:
      1. Key phases and activities
      2. Recommended timeline
      3. Resource requirements
      4. Critical success factors
      5. Risk management approach
      
      Format your response as a JSON with the following structure:
      {
        "executiveSummary": "Brief overview of the plan",
        "phases": [
          {
            "name": "Phase name",
            "description": "Phase description",
            "duration": "Estimated duration",
            "keyActivities": [
              "Activity 1",
              "Activity 2"
            ],
            "deliverables": [
              "Deliverable 1",
              "Deliverable 2"
            ],
            "resources": "Required resources"
          }
        ],
        "timeline": "Overall timeline description",
        "resourceRequirements": {
          "personnel": ["Role 1", "Role 2"],
          "tools": ["Tool 1", "Tool 2"],
          "budget": "Budget estimate"
        },
        "criticalSuccessFactors": [
          "Factor 1",
          "Factor 2"
        ],
        "riskManagementApproach": "Approach description"
      }
    `;
    
    const response = await callAI({
      prompt,
      model: AIModel.DEEPSEEK,
      temperature: 0.3
    });
    
    try {
      const plan = JSON.parse(response.text);
      
      res.json({
        ...plan,
        systemId: system.systemId,
        systemName: system.name,
        generatedAt: new Date(),
        basedOnAssessment: latestAssessment.assessmentId,
        complianceGapsCount: gaps.length
      });
    } catch (error) {
      console.error('Error parsing AI response:', error);
      res.status(500).json({
        error: 'ai_response_parsing_error',
        message: 'Failed to parse AI-generated implementation plan'
      });
    }
  } catch (error) {
    console.error('Error in generateImplementationPlan:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.type,
        message: error.message,
        details: error.details
      });
    } else {
      res.status(500).json({
        error: 'internal_server_error',
        message: 'An unexpected error occurred during implementation plan generation'
      });
    }
  }
}
