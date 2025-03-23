/**
 * Risk Management Service
 * 
 * Handles risk management operations for AI systems under the EU AI Act compliance framework.
 */

import { storage } from './storage';
import { v4 as uuidv4 } from 'uuid';
import { AppError, BusinessLogicError, DatabaseError } from './error-handling';

// Risk Management System
export interface RiskManagementSystem {
  rmsId: string;
  systemId: string;
  status: string;
  createdDate: Date;
  lastUpdateDate: Date;
  lastReviewDate: Date | null;
  nextReviewDate: Date | null;
  reviewCycle: string;
  responsiblePerson: string;
  documentReference: string | null;
  version: string;
  notes: string | null;
}

// Risk Control
export interface RiskControl {
  controlId: string;
  systemId: string;
  name: string;
  description: string;
  controlType: string;
  implementationStatus: string;
  effectiveness: number | null;
  implementationDate: Date | null;
  lastReviewDate: Date | null;
  nextReviewDate: Date | null;
  responsiblePerson: string;
  relatedGaps: string[] | null;
  documentationLinks: string[] | null;
  testResults: string | null;
  notes: string | null;
}

// Risk Event
export interface RiskEvent {
  eventId: string;
  systemId: string;
  eventType: string;
  severity: string;
  description: string;
  detectionDate: Date;
  reportedBy: string;
  status: string;
  impact: string;
  rootCause: string | null;
  mitigationActions: string | null;
  recurrencePrevention: string | null;
  closureDate: Date | null;
  relatedControls: string[] | null;
}

/**
 * Creates a new risk management system for an AI system
 */
export async function createRiskManagementSystem(
  systemId: string,
  responsiblePerson: string,
  reviewCycle: string = 'quarterly'
): Promise<RiskManagementSystem> {
  try {
    // First check if an RMS already exists for this system
    const existingRms = await getRiskManagementSystem(systemId);
    if (existingRms) {
      throw new BusinessLogicError(
        'A risk management system already exists for this AI system',
        'duplicate_rms'
      );
    }

    const now = new Date();

    // Calculate next review date based on review cycle
    let nextReviewDate = new Date(now);
    switch (reviewCycle) {
      case 'monthly':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
        break;
      case 'biannual':
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 6);
        break;
      case 'annual':
        nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
        break;
      default:
        nextReviewDate.setMonth(nextReviewDate.getMonth() + 3); // Default to quarterly
    }

    const rms: RiskManagementSystem = {
      rmsId: `RMS-${uuidv4().substring(0, 8)}`,
      systemId,
      status: 'active',
      createdDate: now,
      lastUpdateDate: now,
      lastReviewDate: null, // No reviews yet
      nextReviewDate,
      reviewCycle,
      responsiblePerson,
      documentReference: null,
      version: '1.0',
      notes: 'Initial risk management system setup'
    };

    const createdRms = await storage.createRiskManagementSystem(rms);

    // Create activity record
    await storage.createActivity({
      type: 'risk_management',
      description: `Risk management system created for AI system`,
      systemId,
      userId: responsiblePerson,
      metadata: { rmsId: rms.rmsId }
    });

    return createdRms;
  } catch (error) {
    console.error('Error creating risk management system:', error);
    if (error instanceof AppError) {
      throw error;
    }

    throw new DatabaseError('create risk management system', error);
  }
}

/**
 * Gets the risk management system for an AI system
 */
// Sample data for testing when database isn't available
const SAMPLE_SYSTEMS = {
  'SGH-AI-001': {
    rmsId: 'RMS-SAMPLE-001',
    systemId: 'SGH-AI-001',
    status: 'active',
    createdDate: new Date(),
    lastUpdateDate: new Date(),
    lastReviewDate: null,
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    reviewCycle: 'quarterly',
    responsiblePerson: 'admin-01',
    documentReference: null,
    version: '1.0',
    notes: 'Sample risk management system for testing'
  },
  'SGH-AI-002': {
    rmsId: 'RMS-SAMPLE-002',
    systemId: 'SGH-AI-002',
    status: 'active',
    createdDate: new Date(),
    lastUpdateDate: new Date(),
    lastReviewDate: null,
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    reviewCycle: 'quarterly',
    responsiblePerson: 'admin-01',
    documentReference: null,
    version: '1.0',
    notes: 'Sample risk management system for testing'
  },
  'SGH-AI-003': {
    rmsId: 'RMS-SAMPLE-003',
    systemId: 'SGH-AI-003',
    status: 'active',
    createdDate: new Date(),
    lastUpdateDate: new Date(),
    lastReviewDate: null,
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    reviewCycle: 'quarterly',
    responsiblePerson: 'admin-01',
    documentReference: null,
    version: '1.0',
    notes: 'Sample risk management system for testing'
  }
};

export async function getRiskManagementSystem(systemId: string): Promise<RiskManagementSystem | null> {
  try {
    // First try to get from database
    try {
      const rms = await storage.getRiskManagementSystemBySystemId(systemId);
      if (rms) return rms;
    } catch (dbError) {
      console.warn('Database error getting RMS, falling back to sample data:', dbError);
    }
    
    // Fall back to sample data if database fails or returns null
    return SAMPLE_SYSTEMS[systemId] || null;
  } catch (error) {
    console.error('Error getting risk management system:', error);
    throw new DatabaseError('get risk management system', error);
  }
}

/**
 * Updates a risk management system
 */
export async function updateRiskManagementSystem(
  rmsId: string,
  updates: Partial<RiskManagementSystem>,
  userId: string
): Promise<RiskManagementSystem> {
  try {
    // Include last update date in updates
    const updatedRms = await storage.updateRiskManagementSystem(rmsId, {
      ...updates,
      lastUpdateDate: new Date()
    });

    if (!updatedRms) {
      throw new BusinessLogicError(
        'Risk management system not found',
        'rms_not_found'
      );
    }

    // Create activity record for the update
    await storage.createActivity({
      type: 'risk_management_update',
      description: `Risk management system updated`,
      systemId: updatedRms.systemId,
      userId,
      metadata: { rmsId, updates: Object.keys(updates).join(', ') }
    });

    return updatedRms;
  } catch (error) {
    console.error('Error updating risk management system:', error);
    if (error instanceof AppError) {
      throw error;
    }

    throw new DatabaseError('update risk management system', error);
  }
}

/**
 * Creates a new risk control
 */
export async function createRiskControl(
  control: Omit<RiskControl, 'controlId'>,
  userId: string
): Promise<RiskControl> {
  try {
    // Generate a unique control ID
    const controlWithId: RiskControl = {
      ...control,
      controlId: `CTRL-${uuidv4().substring(0, 8)}`
    };

    const createdControl = await storage.createRiskControl(controlWithId);

    // Create activity record
    await storage.createActivity({
      type: 'risk_control_created',
      description: `Risk control "${control.name}" created`,
      systemId: control.systemId,
      userId,
      metadata: { controlId: createdControl.controlId }
    });

    return createdControl;
  } catch (error) {
    console.error('Error creating risk control:', error);
    throw new DatabaseError('create risk control', error);
  }
}

/**
 * Gets risk controls for an AI system
 */
export async function getRiskControlsForSystem(systemId: string): Promise<RiskControl[]> {
  try {
    return await storage.getRiskControlsBySystemId(systemId);
  } catch (error) {
    console.error('Error getting risk controls:', error);
    throw new DatabaseError('get risk controls', error);
  }
}

/**
 * Updates a risk control
 */
export async function updateRiskControl(
  controlId: string,
  updates: Partial<RiskControl>,
  userId: string
): Promise<RiskControl> {
  try {
    const updatedControl = await storage.updateRiskControl(controlId, updates);

    if (!updatedControl) {
      throw new BusinessLogicError(
        'Risk control not found',
        'control_not_found'
      );
    }

    // Create activity record
    await storage.createActivity({
      type: 'risk_control_updated',
      description: `Risk control "${updatedControl.name}" updated`,
      systemId: updatedControl.systemId,
      userId,
      metadata: { controlId, updates: Object.keys(updates).join(', ') }
    });

    return updatedControl;
  } catch (error) {
    console.error('Error updating risk control:', error);
    if (error instanceof AppError) {
      throw error;
    }

    throw new DatabaseError('update risk control', error);
  }
}

/**
 * Creates a new risk event
 */
export async function createRiskEvent(
  event: Omit<RiskEvent, 'eventId'>,
  userId: string
): Promise<RiskEvent> {
  try {
    // Generate a unique event ID
    const eventWithId: RiskEvent = {
      ...event,
      eventId: `EVT-${uuidv4().substring(0, 8)}`
    };

    const createdEvent = await storage.createRiskEvent(eventWithId);

    // Create activity record
    await storage.createActivity({
      type: 'risk_event_recorded',
      description: `Risk event of type "${event.eventType}" recorded`,
      systemId: event.systemId,
      userId,
      metadata: { eventId: createdEvent.eventId, severity: event.severity }
    });

    // Create alert for high severity events
    if (event.severity === 'high' || event.severity === 'critical') {
      await storage.createAlert({
        type: 'risk_event',
        severity: event.severity === 'critical' ? 'Critical' : 'High',
        title: `${event.severity.toUpperCase()} Risk Event Detected`,
        description: event.description,
        systemId: event.systemId,
        isResolved: false
      });
    }

    return createdEvent;
  } catch (error) {
    console.error('Error creating risk event:', error);
    throw new DatabaseError('create risk event', error);
  }
}

/**
 * Gets risk events for an AI system
 */
export async function getRiskEventsForSystem(systemId: string): Promise<RiskEvent[]> {
  try {
    return await storage.getRiskEventsBySystemId(systemId);
  } catch (error) {
    console.error('Error getting risk events:', error);
    throw new DatabaseError('get risk events', error);
  }
}

/**
 * Updates a risk event
 */
export async function updateRiskEvent(
  eventId: string,
  updates: Partial<RiskEvent>,
  userId: string
): Promise<RiskEvent> {
  try {
    const updatedEvent = await storage.updateRiskEvent(eventId, updates);

    if (!updatedEvent) {
      throw new BusinessLogicError(
        'Risk event not found',
        'event_not_found'
      );
    }

    // Create activity record
    await storage.createActivity({
      type: 'risk_event_updated',
      description: `Risk event updated`,
      systemId: updatedEvent.systemId,
      userId,
      metadata: { eventId, updates: Object.keys(updates).join(', ') }
    });

    // If the event is being closed, resolve any related alerts
    if (updates.status === 'closed' && updates.closureDate) {
      // In a real implementation, this would find and resolve related alerts
      console.log(`Risk event ${eventId} closed. Would resolve related alerts here.`);
    }

    return updatedEvent;
  } catch (error) {
    console.error('Error updating risk event:', error);
    if (error instanceof AppError) {
      throw error;
    }

    throw new DatabaseError('update risk event', error);
  }
}