
/**
 * Risk Assessment Module
 * 
 * Handles EU AI Act risk assessments for AI systems.
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';
import { 
  AppError, 
  BusinessLogicError, 
  ResourceNotFoundError 
} from './error-handling';
import { AIModel, callAI, safeJsonParse } from './ai-service';

// Risk assessment status types
export enum AssessmentStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_UPDATE = 'requires_update'
}

// Risk levels based on EU AI Act
export enum RiskLevel {
  UNACCEPTABLE = 'unacceptable',
  HIGH = 'high',
  LIMITED = 'limited',
  MINIMAL = 'minimal'
}

// Risk parameters based on EU AI Act
export interface RiskParameter {
  name: string;
  article: string;
  description: string;
  score: number;
  evidence?: string;
  notes?: string;
}

// Gap types for compliance
export interface ComplianceGap {
  parameter: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  remediation: string;
  dueDate?: Date;
  assignedTo?: string;
  status: 'open' | 'in_progress' | 'resolved';
}

// Risk assessment model
export interface RiskAssessment {
  assessmentId: string;
  systemId: string;
  createdBy: string;
  assessmentDate: Date;
  status: AssessmentStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  systemCategory?: string;
  prohibitedUseChecks?: any[];
  riskParameters?: RiskParameter[];
  euAiActArticles?: string[];
  complianceGaps?: ComplianceGap[];
  remediationActions?: any[];
  evidenceDocuments?: any[];
  summaryNotes?: string;
}

/**
 * Create a new risk assessment
 */
export async function createRiskAssessment(assessment: Partial<RiskAssessment>): Promise<RiskAssessment> {
  try {
    // Check if system exists
    const system = await storage.getAiSystemBySystemId(assessment.systemId);
    if (!system) {
      throw new ResourceNotFoundError('System', assessment.systemId);
    }
    
    // Create assessment with default values
    const newAssessment = await storage.createRiskAssessment({
      ...assessment,
      assessmentId: `ra_${uuidv4()}`,
      assessmentDate: assessment.assessmentDate || new Date(),
      status: assessment.status || AssessmentStatus.DRAFT,
      riskLevel: assessment.riskLevel || RiskLevel.MINIMAL,
      riskScore: assessment.riskScore || 0
    });
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_assessment_created',
      description: `Risk assessment initiated for ${system.name}`,
      userId: assessment.createdBy,
      systemId: system.systemId,
      timestamp: new Date(),
      metadata: { assessmentId: newAssessment.assessmentId }
    });
    
    return newAssessment;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to create risk assessment', error);
  }
}

/**
 * Update an existing risk assessment
 */
export async function updateRiskAssessment(
  assessmentId: string, 
  updates: Partial<RiskAssessment>,
  userId: string
): Promise<RiskAssessment> {
  try {
    // Get existing assessment
    const assessment = await storage.getRiskAssessmentByAssessmentId(assessmentId);
    
    if (!assessment) {
      throw new ResourceNotFoundError('Risk assessment', assessmentId);
    }
    
    // Apply updates
    const updatedAssessment = await storage.updateRiskAssessment(assessment.id, updates);
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_assessment_updated',
      description: `Risk assessment updated for system ID ${assessment.systemId}`,
      userId: userId,
      systemId: assessment.systemId,
      timestamp: new Date(),
      metadata: { assessmentId: assessment.assessmentId }
    });
    
    return updatedAssessment;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to update risk assessment', error);
  }
}

/**
 * Submit risk assessment for approval
 */
export async function submitRiskAssessment(
  assessmentId: string,
  userId: string,
  notes?: string
): Promise<RiskAssessment> {
  try {
    // Get existing assessment
    const assessment = await storage.getRiskAssessmentByAssessmentId(assessmentId);
    
    if (!assessment) {
      throw new ResourceNotFoundError('Risk assessment', assessmentId);
    }
    
    // Update status
    const updatedAssessment = await storage.updateRiskAssessment(assessment.id, {
      status: AssessmentStatus.COMPLETED,
      summaryNotes: notes || assessment.summaryNotes
    });
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_assessment_submitted',
      description: `Risk assessment submitted for approval for system ID ${assessment.systemId}`,
      userId: userId,
      systemId: assessment.systemId,
      timestamp: new Date(),
      metadata: { assessmentId: assessment.assessmentId }
    });
    
    return updatedAssessment;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to submit risk assessment', error);
  }
}

/**
 * Approve risk assessment
 */
export async function approveRiskAssessment(
  assessmentId: string,
  userId: string,
  notes?: string
): Promise<RiskAssessment> {
  try {
    // Get existing assessment
    const assessment = await storage.getRiskAssessmentByAssessmentId(assessmentId);
    
    if (!assessment) {
      throw new ResourceNotFoundError('Risk assessment', assessmentId);
    }
    
    // Update status
    const updatedAssessment = await storage.updateRiskAssessment(assessment.id, {
      status: AssessmentStatus.APPROVED,
      summaryNotes: notes ? `${assessment.summaryNotes || ''}\n\nApproval Notes: ${notes}` : assessment.summaryNotes
    });
    
    // Get system
    const system = await storage.getAiSystemBySystemId(assessment.systemId);
    
    // Update system with assessment results
    if (system) {
      await storage.updateAiSystem(system.id, {
        riskLevel: assessment.riskLevel,
        riskScore: assessment.riskScore,
        lastAssessmentDate: new Date()
      });
    }
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_assessment_approved',
      description: `Risk assessment approved for ${system?.name || 'unknown system'}`,
      userId: userId,
      systemId: assessment.systemId,
      timestamp: new Date(),
      metadata: { assessmentId: assessment.assessmentId }
    });
    
    return updatedAssessment;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to approve risk assessment', error);
  }
}

/**
 * Reject risk assessment
 */
export async function rejectRiskAssessment(
  assessmentId: string,
  userId: string,
  reason: string
): Promise<RiskAssessment> {
  try {
    // Get existing assessment
    const assessment = await storage.getRiskAssessmentByAssessmentId(assessmentId);
    
    if (!assessment) {
      throw new ResourceNotFoundError('Risk assessment', assessmentId);
    }
    
    // Update status
    const updatedAssessment = await storage.updateRiskAssessment(assessment.id, {
      status: AssessmentStatus.REJECTED,
      summaryNotes: `${assessment.summaryNotes || ''}\n\nRejection Reason: ${reason}`
    });
    
    // Create activity record
    await storage.createActivity({
      type: 'risk_assessment_rejected',
      description: `Risk assessment rejected for system ID ${assessment.systemId}`,
      userId: userId,
      systemId: assessment.systemId,
      timestamp: new Date(),
      metadata: { 
        assessmentId: assessment.assessmentId,
        reason
      }
    });
    
    return updatedAssessment;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to reject risk assessment', error);
  }
}

/**
 * Analyze system risk
 */
export async function analyzeSystemRisk(req: Request, res: Response): Promise<void> {
  try {
    const systemId = req.params.systemId;
    
    // Get system
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Call AI for risk analysis
    const prompt = `
      Perform a comprehensive EU AI Act risk assessment for the following AI system:
      
      System Name: ${system.name}
      Description: ${system.description || 'Not provided'}
      Department: ${system.department || 'Not provided'}
      Purpose: ${system.purpose || 'Not provided'}
      Vendor: ${system.vendor || 'Not provided'}
      Version: ${system.version || 'Not provided'}
      AI Capabilities: ${system.aiCapabilities || 'Not provided'}
      Training Datasets: ${system.trainingDatasets || 'Not provided'}
      Usage Context: ${system.usageContext || 'Not provided'}
      Potential Impact: ${system.potentialImpact || 'Not provided'}
      
      Based on the EU AI Act classification framework, analyze this system and provide:
      1. Risk Level: Unacceptable, High, Limited, or Minimal risk
      2. Risk Score: Numerical score from 0-100 representing overall risk
      3. Risk Justification: Detailed explanation of risk classification
      4. System Category: Primary category under EU AI Act 
      5. Key Risk Factors: List of the main risk factors
      
      Format your response as a JSON with the following structure:
      {
        "riskLevel": "High, Limited, Minimal, or Unacceptable",
        "riskScore": number from 0-100,
        "justification": "Detailed text explanation of risk classification",
        "systemCategory": "Category name",
        "keyRiskFactors": [
          "Risk factor 1",
          "Risk factor 2",
          "Risk factor 3"
        ],
        "applicableArticles": [
          "Article X: Brief description",
          "Article Y: Brief description"
        ]
      }
    `;
    
    const response = await callAI({
      prompt,
      model: AIModel.DEEPSEEK
    });
    
    // Parse AI response
    const analysis = safeJsonParse(response.text);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in analyzeSystemRisk:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.type,
        message: error.message,
        details: error.details
      });
    } else {
      res.status(500).json({
        error: 'internal_server_error',
        message: 'An unexpected error occurred during risk analysis'
      });
    }
  }
}

/**
 * Analyze prohibited use cases
 */
export async function analyzeProhibitedUse(req: Request, res: Response): Promise<void> {
  try {
    const systemId = req.params.systemId;
    
    // Get system
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Call AI for prohibited use analysis
    const prompt = `
      Analyze the following AI system against EU AI Act Article 5 prohibited practices:
      
      System Name: ${system.name}
      Description: ${system.description || 'Not provided'}
      Department: ${system.department || 'Not provided'}
      Purpose: ${system.purpose || 'Not provided'}
      Vendor: ${system.vendor || 'Not provided'}
      Version: ${system.version || 'Not provided'}
      AI Capabilities: ${system.aiCapabilities || 'Not provided'}
      Training Datasets: ${system.trainingDatasets || 'Not provided'}
      Usage Context: ${system.usageContext || 'Not provided'}
      Potential Impact: ${system.potentialImpact || 'Not provided'}
      
      Article 5 of the EU AI Act prohibits the following AI practices:
      1. Subliminal manipulation resulting in physical/psychological harm
      2. Exploitation of vulnerabilities of specific groups resulting in physical/psychological harm
      3. Social scoring by public authorities
      4. Real-time remote biometric identification in publicly accessible spaces for law enforcement
         (with specific exceptions)
      5. Emotion recognition in workplace/educational settings
      6. AI for categorizing people based on biometrics according to ethnicity, political views, etc.
      7. AI systems for untargeted scraping of facial images
      
      For each prohibited practice, assess whether this system potentially violates or complies with Article 5.
      
      Format your response as a JSON with the following structure:
      {
        "prohibitedPractices": [
          {
            "practice": "Name of prohibited practice",
            "article": "Specific article reference",
            "compliant": true/false,
            "riskLevel": "None, Low, Medium, High",
            "justification": "Detailed explanation",
            "mitigationAdvice": "Advice if non-compliant or at risk"
          }
        ],
        "overallAssessment": "Overall assessment text",
        "isCompliant": true/false
      }
    `;
    
    const response = await callAI({
      prompt,
      model: AIModel.DEEPSEEK
    });
    
    // Parse AI response
    const analysis = safeJsonParse(response.text);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in analyzeProhibitedUse:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.type,
        message: error.message,
        details: error.details
      });
    } else {
      res.status(500).json({
        error: 'internal_server_error',
        message: 'An unexpected error occurred during prohibited use analysis'
      });
    }
  }
}

/**
 * Generate risk assessment report
 */
export async function generateRiskReport(req: Request, res: Response): Promise<void> {
  try {
    const systemId = req.params.systemId;
    
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
    
    // Call AI for report generation
    const prompt = `
      Generate a comprehensive EU AI Act compliance risk assessment report for the following AI system:
      
      System Name: ${system.name}
      Description: ${system.description || 'Not provided'}
      Department: ${system.department || 'Not provided'}
      Purpose: ${system.purpose || 'Not provided'}
      Vendor: ${system.vendor || 'Not provided'}
      Version: ${system.version || 'Not provided'}
      AI Capabilities: ${system.aiCapabilities || 'Not provided'}
      Risk Level: ${latestAssessment?.riskLevel || system.riskLevel || 'Not determined'}
      
      ${latestAssessment ? `
      Assessment Date: ${new Date(latestAssessment.assessmentDate).toISOString().split('T')[0]}
      Assessment Status: ${latestAssessment.status}
      Risk Score: ${latestAssessment.riskScore}
      ` : ''}
      
      Format your report as a JSON with the following structure:
      {
        "executiveSummary": "Brief executive summary",
        "systemOverview": "Overview of the system",
        "methodology": "Assessment methodology used",
        "riskClassification": {
          "level": "Risk level",
          "score": number,
          "justification": "Detailed justification"
        },
        "keyFindings": [
          {
            "area": "Finding area",
            "description": "Detailed description",
            "severity": "Low, Medium, High, Critical"
          }
        ],
        "regulatoryImplications": {
          "applicableArticles": [
            {
              "article": "Article reference",
              "title": "Article title",
              "requirements": "Key requirements",
              "complianceStatus": "Compliant or Non-compliant or Partially compliant"
            }
          ]
        },
        "recommendations": [
          {
            "title": "Recommendation title",
            "description": "Detailed description",
            "priority": "Low, Medium, High",
            "timeframe": "Immediate, Short-term, Medium-term, Long-term"
          }
        ],
        "conclusion": "Overall conclusion"
      }
    `;
    
    const response = await callAI({
      prompt,
      model: AIModel.DEEPSEEK,
      temperature: 0.3
    });
    
    // Parse AI response
    const report = safeJsonParse(response.text);
    
    res.json({
      ...report,
      generatedAt: new Date(),
      assessmentId: latestAssessment?.assessmentId,
      systemId: system.systemId,
      systemName: system.name
    });
  } catch (error) {
    console.error('Error in generateRiskReport:', error);
    
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
 * Analyze compliance gaps
 */
export async function analyzeComplianceGaps(req: Request, res: Response): Promise<void> {
  try {
    const systemId = req.params.systemId;
    
    // Get system
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Get documents for the system
    const documents = await storage.getDocumentsForSystem(systemId);
    
    // Call AI for gap analysis
    const prompt = `
      Perform a compliance gap analysis for the following AI system under the EU AI Act:
      
      System Name: ${system.name}
      Description: ${system.description || 'Not provided'}
      Department: ${system.department || 'Not provided'}
      Purpose: ${system.purpose || 'Not provided'}
      Vendor: ${system.vendor || 'Not provided'}
      Risk Level: ${system.riskLevel || 'Not determined'}
      
      The system has the following documentation:
      ${documents.map(doc => `- ${doc.title} (${doc.type})`).join('\n')}
      
      Based on the EU AI Act requirements, identify compliance gaps in the following areas:
      1. Technical documentation
      2. Risk management
      3. Data governance
      4. Human oversight
      5. Transparency
      6. Accuracy and robustness
      
      For each area, analyze whether there are:
      - Missing documentation
      - Insufficient processes
      - Missing technical controls
      - Inadequate testing or validation
      
      Format your response as a JSON with the following structure:
      {
        "complianceGaps": [
          {
            "area": "Area name",
            "description": "Detailed description of the gap",
            "severity": "Critical, High, Medium, Low",
            "euAiActReference": "Relevant article reference",
            "remediation": "Suggested remediation"
          }
        ],
        "overallComplianceStatus": "text assessment of overall compliance",
        "missingDocumentation": [
          "List of missing documentation"
        ],
        "priorityActions": [
          "List of priority actions"
        ]
      }
    `;
    
    const response = await callAI({
      prompt,
      model: AIModel.DEEPSEEK
    });
    
    // Parse AI response
    const analysis = safeJsonParse(response.text);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in analyzeComplianceGaps:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.type,
        message: error.message,
        details: error.details
      });
    } else {
      res.status(500).json({
        error: 'internal_server_error',
        message: 'An unexpected error occurred during gap analysis'
      });
    }
  }
}

/**
 * Schedule periodic reassessment
 */
export async function scheduleReassessment(systemId: string, interval: string): Promise<any> {
  try {
    // Get system
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      throw new ResourceNotFoundError('System', systemId);
    }
    
    // Calculate next assessment date
    let nextAssessmentDate = new Date();
    
    switch (interval) {
      case 'monthly':
        nextAssessmentDate.setMonth(nextAssessmentDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextAssessmentDate.setMonth(nextAssessmentDate.getMonth() + 3);
        break;
      case 'semi-annual':
        nextAssessmentDate.setMonth(nextAssessmentDate.getMonth() + 6);
        break;
      case 'annual':
        nextAssessmentDate.setFullYear(nextAssessmentDate.getFullYear() + 1);
        break;
      default:
        nextAssessmentDate.setMonth(nextAssessmentDate.getMonth() + 6);
    }
    
    // Create deadline
    const deadline = await storage.createDeadline({
      title: `Reassessment of ${system.name}`,
      description: `Scheduled ${interval} reassessment of AI system "${system.name}"`,
      date: nextAssessmentDate,
      type: 'reassessment',
      relatedSystemId: systemId
    });
    
    return deadline;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new BusinessLogicError('Failed to schedule reassessment', error);
  }
}
