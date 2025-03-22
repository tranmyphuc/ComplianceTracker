
import { callDeepSeekApi } from './ai-analysis';
import type { AiSystem } from '@shared/schema';

// Document template types
export enum DocumentType {
  TECHNICAL_DOCUMENTATION = 'technical_documentation',
  RISK_ASSESSMENT = 'risk_assessment',
  CONFORMITY_DECLARATION = 'conformity_declaration',
  HUMAN_OVERSIGHT_PROTOCOL = 'human_oversight_protocol',
  DATA_GOVERNANCE_POLICY = 'data_governance_policy',
  INCIDENT_RESPONSE_PLAN = 'incident_response_plan'
}

// Document generation parameters
interface DocumentParams {
  system: Partial<AiSystem>;
  documentType: DocumentType;
  companyName: string;
  additionalDetails?: Record<string, any>;
}

/**
 * Generate structured document based on AI system details and EU AI Act requirements
 */
export async function generateDocument(params: DocumentParams): Promise<string> {
  const { system, documentType, companyName, additionalDetails } = params;
  
  // Build the prompt based on document type
  const prompt = buildDocumentPrompt(documentType, system, companyName, additionalDetails);
  
  try {
    // Call DeepSeek API for document generation
    const response = await callDeepSeekApi(prompt);
    return response;
  } catch (error) {
    console.error(`Error generating ${documentType} document:`, error);
    return `Error generating document: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Build prompt for document generation based on type
 */
function buildDocumentPrompt(
  documentType: DocumentType,
  system: Partial<AiSystem>,
  companyName: string,
  additionalDetails?: Record<string, any>
): string {
  const baseSystemInfo = `
    System Name: ${system.name || 'N/A'}
    Description: ${system.description || 'N/A'}
    Purpose: ${system.purpose || 'N/A'}
    Department: ${system.department || 'N/A'}
    Risk Level: ${system.riskLevel || 'N/A'}
    Vendor: ${system.vendor || 'N/A'}
    Version: ${system.version || 'N/A'}
  `;
  
  switch (documentType) {
    case DocumentType.TECHNICAL_DOCUMENTATION:
      return `
        As an EU AI Act compliance expert, generate a comprehensive Technical Documentation 
        for the following AI system in accordance with EU AI Act Article 11 requirements.
        
        Company: ${companyName}
        ${baseSystemInfo}
        
        Please include the following sections:
        1. General Description
        2. System Architecture
        3. Development Process
        4. Training Methodology (if applicable)
        5. Testing & Validation Procedures
        6. Risk Management Measures
        7. Change Management Process
        
        Format the document with proper headings, subheadings, and professional structure.
      `;
      
    case DocumentType.RISK_ASSESSMENT:
      return `
        As an EU AI Act compliance expert, generate a detailed Risk Assessment Report
        for the following AI system in accordance with EU AI Act Article 9 requirements.
        
        Company: ${companyName}
        ${baseSystemInfo}
        
        Please include the following sections:
        1. Risk Assessment Methodology
        2. Identified Risks (categorized by severity)
        3. Potential Harm Analysis
        4. Mitigation Measures
        5. Residual Risks
        6. Monitoring & Review Procedures
        
        Format the document with proper headings, subheadings, and professional structure.
      `;
      
    case DocumentType.CONFORMITY_DECLARATION:
      return `
        As an EU AI Act compliance expert, generate a Declaration of EU AI Act Conformity
        for the following high-risk AI system.
        
        Company: ${companyName}
        ${baseSystemInfo}
        
        Please create a formal declaration document that includes:
        1. System identifier and general information
        2. Statement of conformity with EU AI Act
        3. List of applicable requirements
        4. Reference to technical standards used
        5. Conformity assessment procedure applied
        6. Place for authorized representative signature
        
        Format the document as a formal declaration with appropriate legal language.
      `;
      
    case DocumentType.HUMAN_OVERSIGHT_PROTOCOL:
      return `
        As an EU AI Act compliance expert, generate a Human Oversight Protocol
        for the following AI system in accordance with EU AI Act Article 14 requirements.
        
        Company: ${companyName}
        ${baseSystemInfo}
        
        Please include the following sections:
        1. Oversight Objectives
        2. Designated Roles & Responsibilities
        3. Oversight Mechanisms
        4. Intervention Procedures
        5. Training Requirements
        6. Documentation & Reporting
        
        Format the document with proper headings, subheadings, and professional structure.
      `;
      
    case DocumentType.DATA_GOVERNANCE_POLICY:
      return `
        As an EU AI Act compliance expert, generate a Data Governance Policy
        for the following AI system in accordance with EU AI Act Article 10 requirements.
        
        Company: ${companyName}
        ${baseSystemInfo}
        
        Please include the following sections:
        1. Data Quality Assurance
        2. Data Protection Measures
        3. Data Processing Procedures
        4. Training Data Management
        5. Bias Monitoring & Mitigation
        6. Data Access Controls
        
        Format the document with proper headings, subheadings, and professional structure.
      `;
      
    case DocumentType.INCIDENT_RESPONSE_PLAN:
      return `
        As an EU AI Act compliance expert, generate an Incident Response Plan
        for the following AI system to manage serious incidents as required by the EU AI Act.
        
        Company: ${companyName}
        ${baseSystemInfo}
        
        Please include the following sections:
        1. Incident Classification
        2. Notification Procedures
        3. Response Team Structure
        4. Investigation Process
        5. Containment & Remediation Steps
        6. Reporting Requirements
        7. Post-Incident Analysis
        
        Format the document with proper headings, subheadings, and professional structure.
      `;
      
    default:
      return `
        Generate a professional document about the following AI system
        for EU AI Act compliance purposes.
        
        Company: ${companyName}
        ${baseSystemInfo}
      `;
  }
}

/**
 * Generate document template with placeholders for manual completion
 */
export function generateDocumentTemplate(documentType: DocumentType): Record<string, any> {
  // Return document templates with sections and placeholders
  switch (documentType) {
    case DocumentType.TECHNICAL_DOCUMENTATION:
      return {
        title: "Technical Documentation",
        sections: [
          {
            title: "1. General Description",
            content: "[Provide a general description of the AI system, including its intended purpose, scope of application, and main functionalities.]"
          },
          {
            title: "2. System Architecture",
            content: "[Describe the system architecture, including components, data flows, and interfaces.]"
          },
          {
            title: "3. Development Process",
            content: "[Detail the development methodology, quality assurance processes, and tools used.]"
          },
          {
            title: "4. Training Methodology",
            content: "[If applicable, describe the training methodology, datasets used, and validation procedures.]"
          },
          {
            title: "5. Testing & Validation",
            content: "[Document testing procedures, validation methods, and performance metrics.]"
          },
          {
            title: "6. Risk Management",
            content: "[Outline risk management measures implemented in accordance with Article 9.]"
          },
          {
            title: "7. Change Management",
            content: "[Describe the process for managing and documenting changes to the system.]"
          }
        ]
      };
      
    case DocumentType.RISK_ASSESSMENT:
      return {
        title: "Risk Assessment Report",
        sections: [
          {
            title: "1. Risk Assessment Methodology",
            content: "[Describe the methodology used for identifying and assessing risks.]"
          },
          {
            title: "2. Identified Risks",
            content: "[List and categorize identified risks by severity.]"
          },
          {
            title: "3. Potential Harm Analysis",
            content: "[Analyze potential harm to individuals, groups, or society.]"
          },
          {
            title: "4. Mitigation Measures",
            content: "[Detail measures implemented to mitigate identified risks.]"
          },
          {
            title: "5. Residual Risks",
            content: "[Document residual risks that remain after mitigation measures.]"
          },
          {
            title: "6. Monitoring & Review",
            content: "[Outline procedures for ongoing monitoring and periodic review of risks.]"
          }
        ]
      };
      
    // Add templates for other document types...
    
    default:
      return {
        title: "Document Template",
        sections: [
          {
            title: "1. Introduction",
            content: "[Provide an introduction to this document.]"
          },
          {
            title: "2. Main Content",
            content: "[Add the main content here.]"
          },
          {
            title: "3. Conclusion",
            content: "[Provide a conclusion.]"
          }
        ]
      };
  }
}
