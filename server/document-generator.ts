/**
 * Document Generator Module
 * 
 * This module provides functionality for generating different types of compliance
 * document templates and filled documents based on AI system information and 
 * organizational needs.
 */

import { DocumentTemplateType, DocumentType, TemplateGenerationOptions } from '@shared/types';

/**
 * Generate a document template based on the document type
 * 
 * @param documentType The type of document to create a template for
 * @param options Optional configuration for the template
 * @returns Generated document template content
 */
export function generateDocumentTemplate(
  documentType: DocumentTemplateType | DocumentType,
  options?: TemplateGenerationOptions
): string {
  const companyName = options?.companyName || '[COMPANY NAME]';
  
  // Base templates by document type
  const templates: Record<string, string> = {
    [DocumentTemplateType.TECHNICAL_DOCUMENTATION]: `# Technical Documentation
## ${companyName}

### System Overview
[Provide a detailed description of the AI system, including its purpose, capabilities, and intended use cases.]

### Architecture
[Describe the system architecture, including components, data flows, and integration points.]

### Data Management
[Detail the data sources, data processing methods, and data governance measures.]

### AI Model Information
[Provide information about the AI models used, including training methodologies, key parameters, and performance metrics.]

### Risk Mitigation Measures
[Describe the technical and organizational measures implemented to address identified risks.]

### Monitoring and Maintenance
[Explain how the system is monitored and maintained, including update procedures and incident response protocols.]

### Compliance Considerations
[Detail how the technical implementation addresses specific EU AI Act requirements.]`,

    [DocumentTemplateType.RISK_ASSESSMENT]: `# Risk Assessment Report
## ${companyName}

### Executive Summary
[Provide a brief overview of the risk assessment process and key findings.]

### System Classification
[Specify the system's risk classification under the EU AI Act and the rationale.]

### Identified Risks
[List and describe all identified risks, categorized by type and severity.]

### Mitigation Measures
[Detail the measures implemented or planned to address each identified risk.]

### Residual Risks
[Describe any remaining risks after mitigation measures are applied.]

### Monitoring and Review Plan
[Outline the plan for ongoing monitoring and periodic review of risks.]

### Conclusion
[Summarize the overall risk posture and compliance status.]`,

    [DocumentTemplateType.COMPLIANCE_REPORT]: `# Compliance Report
## ${companyName}

### Executive Summary
[Provide a brief overview of the compliance status and key achievements.]

### Compliance Framework
[Describe the compliance framework in place, including policies, procedures, and responsible parties.]

### EU AI Act Requirements
[List the applicable requirements from the EU AI Act and how they are addressed.]

### Gap Analysis
[Identify any gaps in compliance and the planned remediation actions.]

### Compliance Evidence
[Provide evidence of compliance with key requirements.]

### Ongoing Compliance
[Describe how compliance will be maintained over time, including monitoring and testing.]

### Conclusion
[Summarize the overall compliance status and next steps.]`,

    [DocumentTemplateType.DATA_GOVERNANCE]: `# Data Governance Policy
## ${companyName}

### Data Management Principles
[Outline the key principles guiding data management in the organization.]

### Data Collection and Processing
[Describe the procedures for data collection, processing, and storage.]

### Data Quality and Integrity
[Detail the measures to ensure data quality and integrity throughout the data lifecycle.]

### Data Security and Privacy
[Explain the security and privacy protections in place for all data assets.]

### Data Roles and Responsibilities
[Define the roles and responsibilities for data management within the organization.]

### AI-Specific Data Governance
[Specify the additional governance measures applied to data used for AI systems.]

### Compliance with Data Protection Laws
[Explain how the policy ensures compliance with GDPR and other relevant regulations.]`,

    [DocumentTemplateType.EXECUTIVE_SUMMARY]: `# Executive Summary
## ${companyName} EU AI Act Compliance

### Overview
[Provide a high-level overview of the organization's AI systems and compliance approach.]

### Key Compliance Achievements
[Highlight the major compliance milestones achieved and their business impact.]

### Risk Assessment
[Summarize the key risks identified and how they are being managed.]

### Compliance Status
[Provide a snapshot of the current compliance status across all AI systems.]

### Resource Investment
[Outline the resources dedicated to achieving and maintaining compliance.]

### Next Steps
[Describe the planned future activities to enhance compliance posture.]

### Conclusion
[Summarize the organization's commitment to responsible AI and regulatory compliance.]`,

    [DocumentTemplateType.CONFORMITY_DECLARATION]: `# Declaration of Conformity
## ${companyName}

This Declaration of Conformity is issued under the sole responsibility of ${companyName}.

### System Identification
Name: [SYSTEM NAME]
Version: [VERSION NUMBER]
Unique Identifier: [SYSTEM ID]

### Applicable Requirements
We declare that the above-referenced AI system complies with all applicable requirements of the European Union Artificial Intelligence Act (Regulation EU YYYY/NNN).

### Standards Applied
[List the harmonized standards or other specifications applied]

### Risk Classification
The system is classified as [RISK CLASSIFICATION] risk under Article [ARTICLE NUMBER] of the EU AI Act.

### Compliance Assessment
[Describe the conformity assessment procedure followed]

### Additional Information
[Provide any additional information relevant to compliance]

Signed for and on behalf of: ${companyName}
Place and date of issue:
Name, function:
Signature:`,

    [DocumentTemplateType.PRODUCT_INSTRUCTIONS]: `# AI System Instructions
## ${companyName}

### System Overview
[Provide a concise description of the AI system and its intended use.]

### Installation and Setup
[Detail the installation and initial configuration process.]

### User Interface
[Explain the user interface and main controls.]

### Expected Performance
[Describe what users can expect in terms of system performance and capabilities.]

### Limitations and Constraints
[Clearly state the system's limitations and constraints, including known issues.]

### Human Oversight
[Explain how humans should oversee and interact with the system.]

### Maintenance and Updates
[Provide information on routine maintenance and how updates are managed.]

### Legal and Compliance Information
[Include relevant legal notices and compliance information.]

### Contact Information
[Provide contact information for technical support and compliance inquiries.]`,

    [DocumentTemplateType.CUSTOM]: `# Custom Document Template
## ${companyName}

### Section 1: [Title]
[Content]

### Section 2: [Title]
[Content]

### Section 3: [Title]
[Content]

### Section 4: [Title]
[Content]

### Section 5: [Title]
[Content]`
  };
  
  // Map DocumentType to DocumentTemplateType if needed
  let templateType = documentType as string;
  if (documentType in DocumentType) {
    // Map the DocumentType to the corresponding DocumentTemplateType
    const typeMapping: Record<string, DocumentTemplateType> = {
      [DocumentType.TECHNICAL_DOCUMENTATION]: DocumentTemplateType.TECHNICAL_DOCUMENTATION,
      [DocumentType.RISK_ASSESSMENT]: DocumentTemplateType.RISK_ASSESSMENT,
      [DocumentType.CONFORMITY_DECLARATION]: DocumentTemplateType.CONFORMITY_DECLARATION,
      [DocumentType.HUMAN_OVERSIGHT_PROTOCOL]: DocumentTemplateType.CUSTOM,
      [DocumentType.DATA_GOVERNANCE_POLICY]: DocumentTemplateType.DATA_GOVERNANCE,
      [DocumentType.INCIDENT_RESPONSE_PLAN]: DocumentTemplateType.CUSTOM
    };
    templateType = typeMapping[documentType] || DocumentTemplateType.CUSTOM;
  }
  
  // Get the base template
  let template = templates[templateType] || templates[DocumentTemplateType.CUSTOM];
  
  // Customize template based on options
  if (options) {
    // Add company name throughout the document
    if (options.companyName) {
      template = template.replace(/\[COMPANY NAME\]/g, options.companyName);
    }
    
    // Include relevant articles if requested
    if (options.includeArticles && options.relevantArticles && options.relevantArticles.length > 0) {
      let articlesSection = "\n\n### Relevant EU AI Act Articles\n";
      
      options.relevantArticles.forEach((article: any) => {
        articlesSection += `\n#### ${article.title || 'Article ' + article.number}\n`;
        articlesSection += `${article.summary || 'Summary not available'}\n`;
      });
      
      template += articlesSection;
    }
    
    // Include custom sections if specified
    if (options.customSections && options.customSections.length > 0) {
      let customSectionsContent = "\n\n";
      
      options.customSections.forEach((section: string) => {
        customSectionsContent += `### ${section}\n[Content for ${section}]\n\n`;
      });
      
      template += customSectionsContent;
    }
  }
  
  return template;
}

/**
 * Generate a complete document based on the provided system information and document type
 * 
 * @param documentType The type of document to generate
 * @param system System information 
 * @param assessment Risk assessment data (optional)
 * @param options Additional options and customizations
 * @returns Generated document content
 */
export function generateDocument(
  documentType: DocumentType,
  system: any,
  assessment: any = null,
  options: {
    companyName: string;
    includeArticles?: boolean;
    relevantArticles?: any[];
    evidenceDocuments?: any[];
    customSections?: string[];
  } = { companyName: 'SGH Group' }
): string {
  // Get a template to start with
  const template = generateDocumentTemplate(documentType, { 
    companyName: options.companyName,
    includeArticles: options.includeArticles,
    relevantArticles: options.relevantArticles,
    customSections: options.customSections
  });
  
  // Here we would typically fill in the template with actual data from the system
  // This is a simplified implementation that just does basic replacements
  let document = template;
  
  // Replace common placeholders
  if (system) {
    document = document.replace(/\[SYSTEM NAME\]/g, system.name || 'Unnamed System');
    document = document.replace(/\[VERSION NUMBER\]/g, system.version || '1.0');
    document = document.replace(/\[SYSTEM ID\]/g, system.systemId || 'ID not available');
    document = document.replace(/\[RISK CLASSIFICATION\]/g, system.riskLevel || 'Unclassified');
  }
  
  // Add risk assessment information if available
  if (assessment) {
    document = document.replace(/\[RISK SCORE\]/g, assessment.score?.toString() || 'Not Available');
    document = document.replace(/\[ASSESSMENT DATE\]/g, assessment.createdAt 
      ? new Date(assessment.createdAt).toLocaleDateString() 
      : 'Not Available');
    
    // Add risk details if available
    if (assessment.risks && Array.isArray(assessment.risks)) {
      let riskSections = '\n\n### Identified Risks\n';
      assessment.risks.forEach((risk: any, index: number) => {
        riskSections += `\n#### Risk ${index + 1}: ${risk.name || 'Unnamed Risk'}\n`;
        riskSections += `**Severity:** ${risk.severity || 'Unknown'}\n`;
        riskSections += `**Description:** ${risk.description || 'No description available'}\n`;
        riskSections += `**Mitigation:** ${risk.mitigation || 'No mitigation strategy defined'}\n\n`;
      });
      
      document = document.replace('[RISK_DETAILS]', riskSections);
    } else {
      document = document.replace('[RISK_DETAILS]', 'No risk details available.');
    }
  }
  
  // Process evidence documents if provided
  if (options.evidenceDocuments && Array.isArray(options.evidenceDocuments) && options.evidenceDocuments.length > 0) {
    let documentsList = '\n\n### Supporting Evidence Documents\n\n';
    options.evidenceDocuments.forEach((doc: any) => {
      documentsList += `- ${doc.name || 'Unnamed Document'}: ${doc.description || 'No description'}\n`;
    });
    
    document = document.replace('[SUPPORTING_DOCUMENTS]', documentsList);
  } else {
    document = document.replace('[SUPPORTING_DOCUMENTS]', '');
  }
  
  // Remove any remaining placeholders
  document = document.replace(/\[\w+\]/g, '');
  
  return document;
}

// Export types for backward compatibility
export { DocumentType };

// Export an enum to string mapper function for display purposes
export function documentTypeToString(type: DocumentType | DocumentTemplateType): string {
  // Handle both DocumentType and DocumentTemplateType enums
  const typeMap: Record<string, string> = {};
  
  // Document Types
  typeMap[DocumentType.TECHNICAL_DOCUMENTATION] = 'Technical Documentation';
  typeMap[DocumentType.RISK_ASSESSMENT] = 'Risk Assessment Report';
  typeMap[DocumentType.CONFORMITY_DECLARATION] = 'Declaration of Conformity';
  typeMap[DocumentType.HUMAN_OVERSIGHT_PROTOCOL] = 'Human Oversight Protocol';
  typeMap[DocumentType.DATA_GOVERNANCE_POLICY] = 'Data Governance Policy';
  typeMap[DocumentType.INCIDENT_RESPONSE_PLAN] = 'Incident Response Plan';
  
  // Document Template Types
  typeMap[DocumentTemplateType.TECHNICAL_DOCUMENTATION] = 'Technical Documentation';
  typeMap[DocumentTemplateType.RISK_ASSESSMENT] = 'Risk Assessment Report';
  typeMap[DocumentTemplateType.COMPLIANCE_REPORT] = 'Compliance Report';
  typeMap[DocumentTemplateType.DATA_GOVERNANCE] = 'Data Governance Policy';
  typeMap[DocumentTemplateType.EXECUTIVE_SUMMARY] = 'Executive Summary';
  typeMap[DocumentTemplateType.CONFORMITY_DECLARATION] = 'Declaration of Conformity';
  typeMap[DocumentTemplateType.PRODUCT_INSTRUCTIONS] = 'Product Instructions';
  typeMap[DocumentTemplateType.CUSTOM] = 'Custom Document';
  
  return typeMap[type] || 'Unknown Document Type';
}