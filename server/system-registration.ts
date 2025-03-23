
/**
 * System Registration Service
 * 
 * Handles all operations related to AI system registration and management.
 */

import { db } from './db';
import { storage } from './storage';
import { aiSystems, insertAiSystemSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { AIModel, callAI, safeJsonParse } from './ai-service';
import { AppError, BusinessLogicError, DatabaseError, ValidationError } from './error-handling';

// System types based on EU AI Act classification
export enum SystemType {
  UNACCEPTABLE = 'unacceptable',
  HIGH_RISK = 'high_risk',
  LIMITED_RISK = 'limited_risk',
  MINIMAL_RISK = 'minimal_risk'
}

// System registration status
export enum RegistrationStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive'
}

// System categories based on AI usage
export enum SystemCategory {
  BIOMETRIC_IDENTIFICATION = 'biometric_identification',
  CRITICAL_INFRASTRUCTURE = 'critical_infrastructure',
  EDUCATION = 'education',
  EMPLOYMENT = 'employment',
  LAW_ENFORCEMENT = 'law_enforcement',
  MIGRATION = 'migration',
  PUBLIC_SERVICES = 'public_services',
  CONTENT_GENERATION = 'content_generation',
  CHATBOT = 'chatbot',
  RECOMMENDATION = 'recommendation',
  OTHER = 'other'
}

// Interface for system registration
export interface SystemRegistrationOptions {
  name: string;
  description?: string;
  vendor?: string;
  department: string;
  purpose?: string;
  version?: string;
  aiCapabilities?: string;
  trainingDatasets?: string;
  usageContext?: string;
  potentialImpact?: string;
  keywords?: string[];
  riskLevel?: string;
  createdBy: string;
  enhancedAnalysis?: boolean;
}

/**
 * Register a new AI system
 */
export async function registerSystem(options: SystemRegistrationOptions): Promise<any> {
  try {
    // Validate input against schema
    const validatedData = insertAiSystemSchema.parse({
      ...options,
      systemId: `sys_${Date.now()}`,
      status: 'active',
      implementationDate: new Date(),
      keywords: options.keywords || []
    });
    
    // Create the system
    const newSystem = await storage.createAiSystem(validatedData);
    
    // Create activity record
    await storage.createActivity({
      type: 'system_created',
      description: `New system "${newSystem.name}" was registered`,
      userId: newSystem.createdBy,
      systemId: newSystem.systemId,
      timestamp: new Date(),
      metadata: { systemName: newSystem.name }
    });
    
    // If enhanced analysis is requested, perform it
    if (options.enhancedAnalysis) {
      try {
        const analysis = await analyzeSystem(newSystem.systemId);
        
        // Update the system with analysis results
        await storage.updateAiSystem(newSystem.id, {
          riskLevel: analysis.riskClassification,
          // Add other analysis fields as needed
          updatedAt: new Date()
        });
        
        return {
          ...newSystem,
          analysis
        };
      } catch (analysisError) {
        console.error('Error during enhanced analysis:', analysisError);
        // Return the system even if analysis fails
        return newSystem;
      }
    }
    
    return newSystem;
  } catch (error) {
    if (error.name === 'ZodError') {
      throw new ValidationError('Invalid system registration data', error.errors);
    }
    
    throw new DatabaseError('system registration', error);
  }
}

/**
 * Update an existing AI system
 */
export async function updateSystem(id: number, updates: Partial<SystemRegistrationOptions>): Promise<any> {
  try {
    // Ensure system exists
    const existingSystem = await storage.getAiSystem(id);
    
    if (!existingSystem) {
      throw new BusinessLogicError(`System with ID ${id} not found`);
    }
    
    // Apply updates
    const updatedSystem = await storage.updateAiSystem(id, {
      ...updates,
      updatedAt: new Date()
    });
    
    // Create activity for system update
    await storage.createActivity({
      type: 'system_updated',
      description: `System "${updatedSystem.name}" was updated`,
      userId: updates.createdBy || existingSystem.createdBy,
      systemId: existingSystem.systemId,
      timestamp: new Date(),
      metadata: { systemName: updatedSystem.name }
    });
    
    return updatedSystem;
  } catch (error) {
    if (error instanceof BusinessLogicError) {
      throw error;
    }
    
    throw new DatabaseError('system update', error);
  }
}

/**
 * Delete an AI system (soft delete by changing status)
 */
export async function deleteSystem(id: number, userId: string): Promise<any> {
  try {
    // Ensure system exists
    const existingSystem = await storage.getAiSystem(id);
    
    if (!existingSystem) {
      throw new BusinessLogicError(`System with ID ${id} not found`);
    }
    
    // Soft delete by updating status
    const deletedSystem = await storage.updateAiSystem(id, {
      status: 'inactive',
      updatedAt: new Date()
    });
    
    // Create activity for system deletion
    await storage.createActivity({
      type: 'system_deleted',
      description: `System "${existingSystem.name}" was deleted`,
      userId: userId,
      systemId: existingSystem.systemId,
      timestamp: new Date(),
      metadata: { systemName: existingSystem.name }
    });
    
    return deletedSystem;
  } catch (error) {
    if (error instanceof BusinessLogicError) {
      throw error;
    }
    
    throw new DatabaseError('system deletion', error);
  }
}

/**
 * Perform AI-powered analysis of a system
 */
export async function analyzeSystem(systemId: string): Promise<any> {
  // Get system data
  const system = await storage.getAiSystemBySystemId(systemId);
  
  if (!system) {
    throw new BusinessLogicError(`System with ID ${systemId} not found`);
  }
  
  // Call AI for analysis
  const prompt = `
    Analyze the following AI system for EU AI Act compliance and risk classification:
    
    System Name: ${system.name}
    Description: ${system.description || 'Not provided'}
    Department: ${system.department || 'Not provided'}
    Purpose: ${system.purpose || 'Not provided'}
    Vendor: ${system.vendor || 'Not provided'}
    AI Capabilities: ${system.aiCapabilities || 'Not provided'}
    Training Datasets: ${system.trainingDatasets || 'Not provided'}
    Usage Context: ${system.usageContext || 'Not provided'}
    Potential Impact: ${system.potentialImpact || 'Not provided'}
    
    Provide the following analysis in JSON format:
    1. systemCategory: The primary category of this AI system
    2. riskClassification: Risk level according to EU AI Act (Unacceptable, High, Limited, Minimal)
    3. euAiActArticles: Array of relevant EU AI Act articles that apply to this system
    4. suggestedImprovements: Array of suggested improvements for compliance
    5. justification: Detailed justification for the risk classification
  `;
  
  const response = await callAI({
    prompt,
    model: AIModel.DEEPSEEK,
    temperature: 0.1
  });
  
  const analysis = safeJsonParse(response.text);
  
  // Store analysis results
  // This would typically be stored in a separate table
  // For now, we'll just return the analysis
  
  return analysis;
}

/**
 * Get systems by department
 */
export async function getSystemsByDepartment(department: string): Promise<any[]> {
  try {
    const systems = await db.select().from(aiSystems).where(eq(aiSystems.department, department));
    return systems;
  } catch (error) {
    throw new DatabaseError('fetching systems by department', error);
  }
}

/**
 * Get systems by risk level
 */
export async function getSystemsByRiskLevel(riskLevel: string): Promise<any[]> {
  try {
    const systems = await db.select().from(aiSystems).where(eq(aiSystems.riskLevel, riskLevel));
    return systems;
  } catch (error) {
    throw new DatabaseError('fetching systems by risk level', error);
  }
}

/**
 * Generate AI system inventory report
 */
export async function generateInventoryReport(): Promise<any> {
  try {
    const systems = await storage.getAllAiSystems();
    
    // Group systems by department
    const departmentGroups = systems.reduce((groups, system) => {
      const dept = system.department;
      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(system);
      return groups;
    }, {});
    
    // Group systems by risk level
    const riskGroups = systems.reduce((groups, system) => {
      const risk = system.riskLevel || 'Unknown';
      if (!groups[risk]) {
        groups[risk] = [];
      }
      groups[risk].push(system);
      return groups;
    }, {});
    
    // Calculate statistics
    const stats = {
      totalSystems: systems.length,
      byRiskLevel: {
        unacceptable: systems.filter(s => s.riskLevel === 'Unacceptable').length,
        high: systems.filter(s => s.riskLevel === 'High').length,
        limited: systems.filter(s => s.riskLevel === 'Limited').length,
        minimal: systems.filter(s => s.riskLevel === 'Minimal').length,
        unknown: systems.filter(s => !s.riskLevel).length
      },
      byDepartment: Object.keys(departmentGroups).map(dept => ({
        department: dept,
        count: departmentGroups[dept].length
      })),
      implementationTimeline: {
        last30Days: systems.filter(s => {
          return s.implementationDate && 
            new Date(s.implementationDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
        }).length,
        last90Days: systems.filter(s => {
          return s.implementationDate && 
            new Date(s.implementationDate).getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000;
        }).length,
        older: systems.filter(s => {
          return s.implementationDate && 
            new Date(s.implementationDate).getTime() <= Date.now() - 90 * 24 * 60 * 60 * 1000;
        }).length
      }
    };
    
    return {
      generatedAt: new Date(),
      statistics: stats,
      departmentGroups,
      riskGroups,
      systems
    };
  } catch (error) {
    throw new DatabaseError('generating inventory report', error);
  }
}
