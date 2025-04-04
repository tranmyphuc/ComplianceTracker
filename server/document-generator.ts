/**
 * Document generator for EU AI Act compliance documents
 * 
 * This module is responsible for generating document content
 * based on AI system data and risk assessments.
 */

export enum DocumentType {
  TECHNICAL_DOCUMENTATION = 'technical_documentation',
  RISK_ASSESSMENT = 'risk_assessment',
  COMPLIANCE_REPORT = 'compliance_report',
  DATA_GOVERNANCE = 'data_governance',
  EXECUTIVE_SUMMARY = 'executive_summary',
  CONFORMITY_DECLARATION = 'conformity_declaration',
  PRODUCT_INSTRUCTIONS = 'product_instructions'
}

/**
 * Generate document content based on type, system, and assessment data
 */
export async function generateDocument(
  documentType: DocumentType,
  system: any,
  assessment: any = null,
  options: {
    companyName?: string;
    includeArticles?: boolean;
    relevantArticles?: any[];
    evidenceDocuments?: any[];
  } = {}
): Promise<string> {
  const {
    companyName = 'SGH Group',
    includeArticles = true,
    relevantArticles = [],
    evidenceDocuments = []
  } = options;

  // Format current date for the document
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Define heading and content based on document type
  switch (documentType) {
    case DocumentType.TECHNICAL_DOCUMENTATION:
      return generateTechnicalDocumentation(system, assessment, {
        companyName,
        currentDate,
        includeArticles,
        relevantArticles,
        evidenceDocuments
      });

    case DocumentType.RISK_ASSESSMENT:
      return generateRiskAssessmentReport(system, assessment, {
        companyName,
        currentDate
      });

    case DocumentType.COMPLIANCE_REPORT:
      return generateComplianceReport(system, assessment, {
        companyName,
        currentDate,
        includeArticles,
        relevantArticles
      });

    case DocumentType.DATA_GOVERNANCE:
      return generateDataGovernanceDocumentation(system, {
        companyName,
        currentDate
      });

    case DocumentType.EXECUTIVE_SUMMARY:
      return generateExecutiveSummary(system, assessment, {
        companyName,
        currentDate
      });

    case DocumentType.CONFORMITY_DECLARATION:
      return generateConformityDeclaration(system, {
        companyName,
        currentDate
      });

    case DocumentType.PRODUCT_INSTRUCTIONS:
      return generateProductInstructions(system, {
        companyName,
        currentDate
      });

    default:
      throw new Error(`Document type not supported: ${documentType}`);
  }
}

/**
 * Generate template for a specific document type
 */
export function generateDocumentTemplate(documentType: DocumentType): string {
  switch (documentType) {
    case DocumentType.TECHNICAL_DOCUMENTATION:
      return `# Technical Documentation

## System Overview
[System Name]
[System Description]

## Technical Architecture
[Architecture Description]

## Data Flow
[Data Flow Description]

## Components
[Component Details]

## Algorithms and Models
[Algorithm and Model Details]

## Performance Metrics
[Performance Metric Details]

## Security Measures
[Security Measure Details]

## Testing Methodology
[Testing Details]

## EU AI Act Compliance Measures
[Compliance Details]
`;

    case DocumentType.RISK_ASSESSMENT:
      return `# Risk Assessment Report

## Executive Summary
[Summary of risk assessment findings]

## System Overview
[System description and purpose]

## Risk Assessment Methodology
[Description of methodology used]

## Identified Risks
[List of identified risks]

## Risk Analysis
[Analysis of each risk]

## Mitigation Measures
[Measures to address each risk]

## Residual Risks
[Remaining risks after mitigation]

## Monitoring Plan
[Plan for ongoing risk monitoring]

## Conclusion
[Overall risk assessment conclusion]
`;

    case DocumentType.COMPLIANCE_REPORT:
      return `# EU AI Act Compliance Report

## System Classification
[System risk classification and rationale]

## Applicable Requirements
[EU AI Act requirements applicable to this system]

## Compliance Status
[Current compliance status for each requirement]

## Gap Analysis
[Identified compliance gaps]

## Remediation Plan
[Plan to address compliance gaps]

## Documentation Status
[Status of required documentation]

## Testing Status
[Status of required testing and validation]

## Conclusion
[Overall compliance assessment]
`;

    case DocumentType.DATA_GOVERNANCE:
      return `# Data Governance Documentation

## Data Sources
[Description of data sources]

## Data Collection Methodology
[How data is collected]

## Data Processing
[Data processing procedures]

## Data Quality Measures
[Data quality control measures]

## Data Security
[Data security controls]

## Data Retention
[Data retention policies]

## Data Subject Rights
[Procedures for data subject rights]

## Responsible AI Practices
[Responsible AI governance practices]
`;

    case DocumentType.EXECUTIVE_SUMMARY:
      return `# Executive Summary

## System Purpose
[Brief description of the AI system and its purpose]

## EU AI Act Classification
[Risk classification and implications]

## Compliance Status
[Summary of compliance status]

## Key Risks
[Summary of key risks]

## Action Items
[Priority actions required]

## Timeline
[Compliance timeline]

## Resource Requirements
[Resources needed for compliance]
`;

    default:
      return `# Document Template
[Document Content]
`;
  }
}

/**
 * Generate technical documentation
 */
function generateTechnicalDocumentation(
  system: any,
  assessment: any,
  options: {
    companyName: string;
    currentDate: string;
    includeArticles?: boolean;
    relevantArticles?: any[];
    evidenceDocuments?: any[];
  }
): string {
  const {
    companyName,
    currentDate,
    includeArticles = true,
    relevantArticles = [],
    evidenceDocuments = []
  } = options;

  let content = `# Technical Documentation
## ${system.name}
**${companyName}**
**Generated on:** ${currentDate}

## 1. System Identification
- **System Name:** ${system.name}
- **System ID:** ${system.systemId || 'N/A'}
- **Version:** ${system.version || '1.0'}
- **Department:** ${system.department || 'N/A'}
- **Risk Level:** ${system.riskLevel || 'Unknown'}

## 2. System Purpose and Description
${system.description || system.purpose || 'No description provided.'}

## 3. System Architecture
### 3.1 Technical Overview
${system.technicalDetails || 'Technical details not provided.'}

### 3.2 AI Capabilities
${system.aiCapabilities || 'AI capabilities not specified.'}

### 3.3 Integration Points
${system.integrationPoints || 'Integration points not specified.'}

## 4. Data Governance
### 4.1 Data Sources
${system.trainingDatasets || 'Training datasets not specified.'}

### 4.2 Data Processing Methodology
${system.dataProcessingMethodology || 'Data processing methodology not specified.'}

### 4.3 Data Quality Measures
${system.dataQualityMeasures || 'Data quality measures not specified.'}

## 5. Implementation Details
### 5.1 Development Timeline
- **Implementation Date:** ${system.implementationDate ? new Date(system.implementationDate).toLocaleDateString() : 'Not specified'}
- **Last Updated:** ${system.updatedAt ? new Date(system.updatedAt).toLocaleDateString() : 'Not specified'}

### 5.2 Technical Components
${system.technicalComponents || 'Technical components not specified.'}

## 6. Performance and Monitoring
### 6.1 Performance Metrics
${system.performanceMetrics || 'Performance metrics not specified.'}

### 6.2 Monitoring Procedures
${system.monitoringProcedures || 'Monitoring procedures not specified.'}

## 7. Risk Management
`;

  // Add risk assessment details if available
  if (assessment) {
    content += `### 7.1 Last Risk Assessment
- **Assessment Date:** ${assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'Not specified'}
- **Assessment ID:** ${assessment.id || 'N/A'}
- **Risk Level Determination:** ${assessment.riskLevel || 'Not specified'}

### 7.2 Identified Risks
${assessment.identifiedRisks || assessment.riskIdentification || 'No risks specified.'}

### 7.3 Mitigation Measures
${assessment.mitigationMeasures || 'No mitigation measures specified.'}
`;
  } else {
    content += `### 7.1 Risk Assessment Status
No risk assessment has been conducted yet.
`;
  }

  // Add EU AI Act compliance section
  content += `
## 8. EU AI Act Compliance
### 8.1 Compliance Status
${system.complianceStatus || 'Compliance status not specified.'}

### 8.2 Applicable Requirements
Based on the system's risk level (${system.riskLevel || 'Unknown'}), the following requirements apply:
`;

  // Add relevant articles if specified
  if (includeArticles && relevantArticles && relevantArticles.length > 0) {
    content += `
### 8.3 Relevant EU AI Act Articles
`;
    
    relevantArticles.forEach(article => {
      content += `
#### Article ${article.articleNumber}: ${article.title || 'No title'}
${article.content || 'No content provided.'}
`;
    });
  }

  // Add supporting documentation section
  content += `
## 9. Supporting Documentation
`;

  if (evidenceDocuments && evidenceDocuments.length > 0) {
    content += `The following supporting documents are available:

| Document ID | Document Title | Created Date |
|-------------|---------------|--------------|
`;
    
    evidenceDocuments.forEach(doc => {
      const createdDate = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A';
      content += `| ${doc.id || 'N/A'} | ${doc.title || 'Untitled'} | ${createdDate} |\n`;
    });
  } else {
    content += `No supporting documents have been uploaded.
`;
  }

  // Append certification section
  content += `
## 10. Certification
This technical documentation is certified as complete and accurate as of ${currentDate}.

**Authorized by:** _________________________
**Position:** _________________________
**Date:** _________________________

${companyName}
`;

  return content;
}

/**
 * Generate risk assessment report
 */
function generateRiskAssessmentReport(
  system: any,
  assessment: any,
  options: {
    companyName: string;
    currentDate: string;
  }
): string {
  const { companyName, currentDate } = options;

  let content = `# Risk Assessment Report
## ${system.name}
**${companyName}**
**Generated on:** ${currentDate}

## 1. Executive Summary
`;

  if (assessment) {
    content += `This risk assessment report provides a comprehensive analysis of the risks associated with the AI system "${system.name}" (${system.systemId || 'N/A'}). The system has been classified as **${assessment.riskLevel || system.riskLevel || 'Unknown Risk'}** under the EU AI Act.

Key findings:
${assessment.summary || 'No summary provided.'}
`;
  } else {
    content += `This document provides a preliminary risk assessment framework for the AI system "${system.name}" (${system.systemId || 'N/A'}). The system has been classified as **${system.riskLevel || 'Unknown Risk'}** under the EU AI Act.

A full risk assessment has not yet been completed for this system.
`;
  }

  content += `
## 2. System Overview
- **System Name:** ${system.name}
- **System ID:** ${system.systemId || 'N/A'}
- **Department:** ${system.department || 'N/A'}
- **Purpose:** ${system.purpose || 'Not specified'}
- **AI Capabilities:** ${system.aiCapabilities || 'Not specified'}
- **Usage Context:** ${system.usageContext || 'Not specified'}

## 3. Risk Assessment Methodology
`;

  if (assessment && assessment.methodology) {
    content += assessment.methodology;
  } else {
    content += `The risk assessment follows a structured methodology aligned with the EU AI Act requirements and international standards for AI risk management. The process includes:

1. **Risk Identification:** Systematic identification of potential risks across technical, ethical, legal, and societal dimensions
2. **Risk Analysis:** Assessment of likelihood and impact of identified risks
3. **Risk Evaluation:** Determination of risk levels and prioritization
4. **Risk Treatment:** Development of mitigation strategies
5. **Continuous Monitoring:** Ongoing evaluation of risk status and effectiveness of controls
`;
  }

  content += `
## 4. Risk Identification
`;

  if (assessment && assessment.riskIdentification) {
    content += assessment.riskIdentification;
  } else {
    content += `Based on the system's characteristics, the following risk areas should be evaluated:

- **Technical Risks:** System failures, performance issues, security vulnerabilities
- **Data Risks:** Data quality, bias, privacy concerns
- **Operational Risks:** Integration issues, maintenance challenges
- **Compliance Risks:** Regulatory requirements, documentation needs
- **Ethical Risks:** Fairness, transparency, accountability concerns
- **Human Interaction Risks:** Misuse, over-reliance, human oversight issues
`;
  }

  content += `
## 5. Risk Analysis and Evaluation
`;

  if (assessment && assessment.riskAnalysis) {
    content += assessment.riskAnalysis;
  } else {
    content += `A detailed risk analysis has not yet been conducted. When completed, this section will include:

- Likelihood assessment for each identified risk
- Impact assessment for each identified risk
- Overall risk level determination
- Risk prioritization
`;
  }

  content += `
## 6. Risk Mitigation Strategies
`;

  if (assessment && assessment.mitigationMeasures) {
    content += assessment.mitigationMeasures;
  } else {
    content += `Risk mitigation strategies will be developed based on the comprehensive risk analysis. These strategies will address:

- Technical risk controls
- Process improvements
- Governance mechanisms
- Monitoring and review procedures
- Documentation requirements
- Training and awareness
`;
  }

  content += `
## 7. Residual Risk Assessment
`;

  if (assessment && assessment.residualRisks) {
    content += assessment.residualRisks;
  } else {
    content += `After implementing mitigation measures, residual risks will be assessed to determine if they fall within acceptable thresholds. This section will document:

- Remaining risks after controls are implemented
- Residual risk levels
- Acceptability determination
- Additional measures if needed
`;
  }

  content += `
## 8. Monitoring and Review Plan
`;

  if (assessment && assessment.monitoringPlan) {
    content += assessment.monitoringPlan;
  } else {
    content += `A monitoring and review plan will be established to ensure ongoing risk management. This will include:

- Key risk indicators
- Monitoring frequency and responsibilities
- Review triggers and procedures
- Documentation and reporting requirements
- Continuous improvement mechanisms
`;
  }

  content += `
## 9. Conclusion
`;

  if (assessment && assessment.conclusion) {
    content += assessment.conclusion;
  } else {
    content += `This risk assessment framework provides the foundation for comprehensive risk management of the "${system.name}" AI system. A detailed risk assessment should be conducted and this document updated accordingly.
`;
  }

  content += `
## 10. Approval and Certification

This risk assessment report is certified as complete and accurate as of ${currentDate}.

**Authorized by:** _________________________
**Position:** _________________________
**Date:** _________________________

${companyName}
`;

  return content;
}

/**
 * Generate compliance report
 */
function generateComplianceReport(
  system: any,
  assessment: any,
  options: {
    companyName: string;
    currentDate: string;
    includeArticles?: boolean;
    relevantArticles?: any[];
  }
): string {
  const {
    companyName,
    currentDate,
    includeArticles = true,
    relevantArticles = []
  } = options;

  const riskLevel = system.riskLevel || 'Unknown';

  let content = `# EU AI Act Compliance Report
## ${system.name}
**${companyName}**
**Generated on:** ${currentDate}

## 1. Executive Summary
This report assesses the compliance status of the AI system "${system.name}" with the requirements of the EU AI Act. The system has been classified as **${riskLevel} Risk** under the Act.

`;

  if (assessment) {
    content += `Based on the risk assessment conducted on ${assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'N/A'}, the system ${assessment.complianceStatus || 'requires further compliance measures'}.
`;
  } else {
    content += `A comprehensive risk assessment has not yet been conducted for this system. This report provides an initial compliance evaluation based on available information.
`;
  }

  content += `
## 2. System Classification and Scope
- **System Name:** ${system.name}
- **System ID:** ${system.systemId || 'N/A'}
- **Department:** ${system.department || 'N/A'}
- **Risk Level:** ${riskLevel}
- **Classification Rationale:** ${system.classificationRationale || 'Based on system purpose and capabilities'}

## 3. Applicable EU AI Act Requirements
`;

  // Add different requirements based on risk level
  if (riskLevel.toLowerCase().includes('high')) {
    content += `As a High-Risk AI system under the EU AI Act, the following key requirements apply:

1. **Risk Management System:** Establish and maintain a risk management system
2. **Data Governance:** Implement data governance and management practices
3. **Technical Documentation:** Maintain comprehensive technical documentation
4. **Record-Keeping:** Keep logs automatically generated by the AI system
5. **Transparency:** Ensure transparency and provision of information to users
6. **Human Oversight:** Design and implement appropriate human oversight measures
7. **Accuracy, Robustness, and Cybersecurity:** Ensure appropriate levels of accuracy, robustness, and cybersecurity
8. **Conformity Assessment:** Undergo conformity assessment procedures
`;
  } else if (riskLevel.toLowerCase().includes('limited')) {
    content += `As a Limited-Risk AI system under the EU AI Act, the following key requirements apply:

1. **Transparency Obligations:** Notify humans that they are interacting with an AI system
2. **Disclosure Requirements:** Disclose when content has been AI-generated or manipulated
3. **Emotion Recognition Notification:** Inform subjects when emotion recognition is being applied
4. **Biometric Categorization Disclosure:** Disclose when biometric categorization is being used
`;
  } else if (riskLevel.toLowerCase().includes('minimal')) {
    content += `As a Minimal-Risk AI system under the EU AI Act, the following applies:

1. **Voluntary Codes of Conduct:** While no specific obligations are mandated, adherence to voluntary codes of conduct is encouraged
2. **General Compliance:** Ensure the system does not drift into higher risk categories through usage or modifications
`;
  } else if (riskLevel.toLowerCase().includes('unacceptable')) {
    content += `This system has been classified as posing Unacceptable Risk under the EU AI Act. Systems in this category are prohibited and must not be deployed in the EU market. Immediate remediation is required.

Prohibited practices include:
1. Systems using subliminal manipulation techniques
2. Systems exploiting vulnerabilities of specific groups
3. Social scoring systems by public authorities
4. Real-time remote biometric identification in publicly accessible spaces for law enforcement (with limited exceptions)
`;
  } else {
    content += `The risk classification of this system is currently uncertain. A thorough assessment should be conducted to determine the applicable requirements under the EU AI Act.
`;
  }

  content += `
## 4. Compliance Status Assessment
`;

  if (assessment && assessment.complianceDetails) {
    content += assessment.complianceDetails;
  } else {
    content += `A detailed compliance assessment against each applicable requirement has not yet been completed. This section should be updated following a comprehensive review.
`;
  }

  content += `
## 5. Gap Analysis and Remediation Plan
`;

  if (assessment && assessment.gapAnalysis) {
    content += assessment.gapAnalysis;
    
    if (assessment.remediationPlan) {
      content += `
### Remediation Plan
${assessment.remediationPlan}
`;
    }
  } else {
    content += `A gap analysis should be conducted to identify specific areas where the system does not meet EU AI Act requirements. This analysis would form the basis of a remediation plan with clear actions, responsibilities, and timelines.
`;
  }

  content += `
## 6. Documentation Status
`;

  if (assessment && assessment.documentationStatus) {
    content += assessment.documentationStatus;
  } else {
    content += `The following documentation status reflects current compliance with EU AI Act requirements:

| Documentation | Status | Notes |
|---------------|--------|-------|
| Technical Documentation | ${system.technicalDocumentationStatus || 'Not completed'} | |
| Risk Assessment | ${assessment ? 'Completed' : 'Not completed'} | |
| Data Governance Documentation | ${system.dataGovernanceDocumentationStatus || 'Not completed'} | |
| Human Oversight Measures | ${system.humanOversightDocumentationStatus || 'Not completed'} | |
| Conformity Declaration | ${system.conformityDeclarationStatus || 'Not completed'} | |
`;
  }

  // Add relevant articles if specified
  if (includeArticles && relevantArticles && relevantArticles.length > 0) {
    content += `
## 7. Relevant EU AI Act Articles
`;
    
    relevantArticles.forEach(article => {
      content += `
### Article ${article.articleNumber}: ${article.title || 'No title'}
${article.content || 'No content provided.'}

**Compliance Status:** ${article.complianceStatus || 'Not assessed'}
`;
    });
  }

  content += `
## 8. Conclusion and Recommendations
`;

  if (assessment && assessment.conclusions) {
    content += assessment.conclusions;
  } else {
    content += `Based on the current evaluation, the following next steps are recommended:

1. Conduct a comprehensive risk assessment if not already completed
2. Develop full technical documentation in accordance with EU AI Act requirements
3. Establish governance procedures for ongoing compliance management
4. Implement necessary technical and organizational measures to address compliance gaps
5. Prepare for conformity assessment procedures as required
`;
  }

  content += `
## 9. Certification

This compliance report represents an assessment as of ${currentDate} and should be regularly updated as the system evolves and as compliance measures are implemented.

**Authorized by:** _________________________
**Position:** _________________________
**Date:** _________________________

${companyName}
`;

  return content;
}

/**
 * Generate data governance documentation
 */
function generateDataGovernanceDocumentation(
  system: any,
  options: {
    companyName: string;
    currentDate: string;
  }
): string {
  const { companyName, currentDate } = options;

  let content = `# Data Governance Documentation
## ${system.name}
**${companyName}**
**Generated on:** ${currentDate}

## 1. Introduction
This document outlines the data governance framework for the AI system "${system.name}" (${system.systemId || 'N/A'}). It establishes the policies, procedures, and standards for data management throughout the system lifecycle, ensuring compliance with the EU AI Act and other applicable regulations.

## 2. System Overview
- **System Name:** ${system.name}
- **System ID:** ${system.systemId || 'N/A'}
- **Department:** ${system.department || 'N/A'}
- **Risk Level:** ${system.riskLevel || 'Unknown'}
- **Purpose:** ${system.purpose || 'Not specified'}

## 3. Data Sources and Collection
### 3.1 Data Sources
${system.trainingDatasets || 'Training datasets not specified.'}

### 3.2 Data Collection Methodology
${system.dataCollectionMethodology || 'Data collection methodology not specified.'}

### 3.3 Data Categories
${system.dataCategories || 'Data categories not specified.'}

## 4. Data Quality Management
### 4.1 Data Quality Standards
${system.dataQualityStandards || 'Data quality standards not specified.'}

### 4.2 Data Validation Procedures
${system.dataValidationProcedures || 'Data validation procedures not specified.'}

### 4.3 Data Correction and Cleansing
${system.dataCorrectionProcedures || 'Data correction procedures not specified.'}

## 5. Data Bias and Fairness
### 5.1 Bias Identification Methods
${system.biasIdentificationMethods || 'Bias identification methods not specified.'}

### 5.2 Fairness Metrics
${system.fairnessMetrics || 'Fairness metrics not specified.'}

### 5.3 Bias Mitigation Strategies
${system.biasMitigationStrategies || 'Bias mitigation strategies not specified.'}

## 6. Data Security and Privacy
### 6.1 Data Protection Measures
${system.dataProtectionMeasures || 'Data protection measures not specified.'}

### 6.2 Access Control
${system.accessControlMeasures || 'Access control measures not specified.'}

### 6.3 Data Encryption
${system.dataEncryptionMeasures || 'Data encryption measures not specified.'}

### 6.4 Data Anonymization/Pseudonymization
${system.dataAnonymizationMeasures || 'Data anonymization measures not specified.'}

## 7. Data Retention and Disposal
### 7.1 Data Retention Policy
${system.dataRetentionPolicy || 'Data retention policy not specified.'}

### 7.2 Data Disposal Procedures
${system.dataDisposalProcedures || 'Data disposal procedures not specified.'}

## 8. Data Management Roles and Responsibilities
### 8.1 Data Governance Structure
${system.dataGovernanceStructure || 'Data governance structure not specified.'}

### 8.2 Key Roles and Responsibilities
${system.dataRolesResponsibilities || 'Data roles and responsibilities not specified.'}

## 9. Data Documentation and Metadata
### 9.1 Metadata Standards
${system.metadataStandards || 'Metadata standards not specified.'}

### 9.2 Documentation Requirements
${system.dataDocumentationRequirements || 'Data documentation requirements not specified.'}

## 10. Data Governance Monitoring and Compliance
### 10.1 Monitoring Procedures
${system.dataGovernanceMonitoring || 'Data governance monitoring procedures not specified.'}

### 10.2 Compliance Auditing
${system.dataComplianceAuditing || 'Data compliance auditing not specified.'}

### 10.3 Incident Response
${system.dataIncidentResponse || 'Data incident response procedures not specified.'}

## 11. Certification

This data governance documentation is certified as complete and accurate as of ${currentDate}.

**Authorized by:** _________________________
**Position:** _________________________
**Date:** _________________________

${companyName}
`;

  return content;
}

/**
 * Generate executive summary
 */
function generateExecutiveSummary(
  system: any,
  assessment: any,
  options: {
    companyName: string;
    currentDate: string;
  }
): string {
  const { companyName, currentDate } = options;

  let content = `# Executive Summary
## ${system.name}
**${companyName}**
**Generated on:** ${currentDate}

## 1. Introduction
This executive summary provides an overview of the AI system "${system.name}" and its compliance status with the EU AI Act. It highlights key findings, risks, and recommended actions for executive decision-making.

## 2. System Overview
- **System Name:** ${system.name}
- **System ID:** ${system.systemId || 'N/A'}
- **Department:** ${system.department || 'N/A'}
- **Purpose:** ${system.purpose || 'Not specified'}
- **Implementation Date:** ${system.implementationDate ? new Date(system.implementationDate).toLocaleDateString() : 'Not specified'}

## 3. EU AI Act Classification
The system has been classified as **${system.riskLevel || 'Unknown Risk'}** under the EU AI Act.

`;

  // Add classification implications based on risk level
  if (system.riskLevel) {
    const riskLevel = system.riskLevel.toLowerCase();
    
    if (riskLevel.includes('high')) {
      content += `**Implications:** As a High-Risk AI system, stringent compliance requirements apply, including risk management, data governance, technical documentation, transparency, human oversight, and conformity assessment procedures.`;
    } else if (riskLevel.includes('limited')) {
      content += `**Implications:** As a Limited-Risk AI system, transparency obligations apply, requiring notification to users and disclosure of AI-generated content.`;
    } else if (riskLevel.includes('minimal')) {
      content += `**Implications:** As a Minimal-Risk AI system, no specific obligations apply under the EU AI Act, though voluntary compliance with codes of conduct is encouraged.`;
    } else if (riskLevel.includes('unacceptable')) {
      content += `**Implications:** As an Unacceptable-Risk AI system, deployment is prohibited under the EU AI Act. Immediate remediation is required.`;
    }
  } else {
    content += `**Implications:** The risk classification needs to be determined to identify applicable compliance requirements.`;
  }

  content += `

## 4. Compliance Status
`;

  if (assessment && assessment.complianceStatus) {
    content += assessment.complianceStatus;
  } else {
    content += `A comprehensive compliance assessment has not yet been completed. Based on the available information, the following areas require attention:

1. **Documentation:** Technical documentation needs to be developed or updated
2. **Risk Management:** A formal risk assessment should be conducted
3. **Data Governance:** Data management practices should be reviewed and documented
4. **Conformity Assessment:** Preparations for conformity assessment should begin if classified as high-risk
`;
  }

  content += `

## 5. Key Risks
`;

  if (assessment && assessment.keyRisks) {
    content += assessment.keyRisks;
  } else {
    content += `The following key risks have been identified based on preliminary assessment:

1. **Compliance Risk:** Potential non-compliance with EU AI Act requirements
2. **Operational Risk:** Potential disruption if compliance issues require significant system changes
3. **Reputational Risk:** Potential reputational damage if system fails to meet regulatory standards
4. **Financial Risk:** Potential financial penalties for non-compliance with the EU AI Act
`;
  }

  content += `

## 6. Priority Actions
`;

  if (assessment && assessment.priorityActions) {
    content += assessment.priorityActions;
  } else {
    content += `The following priority actions are recommended:

1. Complete a comprehensive risk assessment
2. Develop or update technical documentation in accordance with EU AI Act requirements
3. Establish a data governance framework for the system
4. Implement risk mitigation measures identified during assessment
5. Prepare for conformity assessment if classified as high-risk
`;
  }

  content += `

## 7. Resource Requirements
`;

  if (assessment && assessment.resourceRequirements) {
    content += assessment.resourceRequirements;
  } else {
    content += `The following resources are likely required to achieve compliance:

1. **Personnel:** Dedicated compliance team members or consultants
2. **Time:** Estimated 3-6 months for full compliance implementation
3. **Budget:** Financial resources for documentation, technical adjustments, and potential conformity assessment
4. **Technical Support:** Engineering resources for implementing required changes
`;
  }

  content += `

## 8. Implementation Timeline
`;

  if (assessment && assessment.implementationTimeline) {
    content += assessment.implementationTimeline;
  } else {
    content += `A detailed implementation timeline should be developed after a comprehensive assessment. Key milestones should include:

1. Risk assessment completion
2. Documentation development
3. Technical adjustments implementation
4. Conformity assessment (if required)
5. Ongoing monitoring and maintenance
`;
  }

  content += `

## 9. Conclusion
`;

  if (assessment && assessment.conclusions) {
    content += assessment.conclusions;
  } else {
    content += `Achieving compliance with the EU AI Act is essential for the continued operation of this AI system within the European Union. The recommended actions outlined in this executive summary provide a roadmap toward compliance. Executive decision-making and resource allocation are required to support this compliance effort.
`;
  }

  content += `

**Prepared for:** Executive Leadership
**Prepared by:** Compliance Team
**Date:** ${currentDate}

${companyName}
`;

  return content;
}

/**
 * Generate conformity declaration
 */
function generateConformityDeclaration(
  system: any,
  options: {
    companyName: string;
    currentDate: string;
  }
): string {
  const { companyName, currentDate } = options;

  // Only applicable for high-risk AI systems
  const isHighRisk = system.riskLevel && system.riskLevel.toLowerCase().includes('high');

  let content = `# EU Declaration of Conformity
**${companyName}**
**Generated on:** ${currentDate}

`;

  if (!isHighRisk) {
    content += `## Notice
This Declaration of Conformity template is applicable only to High-Risk AI systems under the EU AI Act. The system "${system.name}" is classified as ${system.riskLevel || 'Unknown Risk'}, and therefore may not require a formal Declaration of Conformity.

`;
  }

  content += `## 1. AI System Identification
- **Name of AI System:** ${system.name}
- **System ID:** ${system.systemId || 'N/A'}
- **Version Number:** ${system.version || '1.0'}
- **Serial Number (if applicable):** ${system.serialNumber || 'N/A'}
- **Provider/Manufacturer:** ${companyName}

## 2. Declaration
${companyName}, established at [COMPANY ADDRESS], hereby declares under sole responsibility that the AI system described above:

1. Complies with the requirements of the Regulation of the European Parliament and of the Council Laying Down Harmonised Rules on Artificial Intelligence (EU AI Act)

2. Has undergone all required conformity assessment procedures

3. Meets the essential requirements outlined in the EU AI Act, particularly those applicable to high-risk AI systems

## 3. References to Relevant Harmonized Standards
This declaration of conformity is issued with reference to the following standards:
- [LIST APPLICABLE STANDARDS]

## 4. Conformity Assessment Procedure
The system has undergone the following conformity assessment procedure:
- ${system.conformityAssessmentProcedure || '[SPECIFY CONFORMITY ASSESSMENT PROCEDURE]'}

## 5. Notified Body Information (if applicable)
- Name of Notified Body: ${system.notifiedBodyName || 'N/A'}
- Identification Number: ${system.notifiedBodyId || 'N/A'}
- Certificate Number: ${system.certificateNumber || 'N/A'}
- Date of Issue: ${system.certificateDate || 'N/A'}

## 6. Technical Documentation
The technical documentation for this AI system is maintained at:
${companyName}
[COMPANY ADDRESS]
[CONTACT INFORMATION]

## 7. Additional Information
${system.additionalConformityInformation || 'No additional information provided.'}

## 8. Signature
Signed for and on behalf of: ${companyName}

**Place and Date of Issue:** [LOCATION], ${currentDate}

**Name:** _________________________
**Position:** _________________________
**Signature:** _________________________

`;

  return content;
}

/**
 * Generate product instructions
 */
function generateProductInstructions(
  system: any,
  options: {
    companyName: string;
    currentDate: string;
  }
): string {
  const { companyName, currentDate } = options;

  let content = `# User Instructions
## ${system.name}
**${companyName}**
**Document version:** 1.0
**Generated on:** ${currentDate}

## 1. Introduction
This document provides instructions for the proper use of the AI system "${system.name}". Please read these instructions carefully before using the system to ensure safe and effective operation in compliance with the EU AI Act requirements.

## 2. System Overview
- **System Name:** ${system.name}
- **System ID:** ${system.systemId || 'N/A'}
- **Version:** ${system.version || '1.0'}
- **Purpose:** ${system.purpose || 'Not specified'}

## 3. Intended Use
${system.intendedUse || system.purpose || 'The intended use of this system has not been specified.'}

## 4. User Qualifications
${system.userQualifications || 'No specific qualifications have been specified for users of this system.'}

## 5. Operating Instructions
${system.operatingInstructions || 'Detailed operating instructions have not been provided.'}

## 6. System Limitations and Known Issues
${system.systemLimitations || 'System limitations have not been specified.'}

## 7. Safety Information and Warnings
${system.safetyInformation || 'No specific safety information has been provided.'}

## 8. Human Oversight Measures
${system.humanOversightMeasures || 'Human oversight measures have not been specified.'}

## 9. Transparency Information
This AI system operates with the following characteristics:
- **AI Capabilities:** ${system.aiCapabilities || 'Not specified'}
- **Level of Automation:** ${system.automationLevel || 'Not specified'}
- **Expected Accuracy:** ${system.expectedAccuracy || 'Not specified'}

## 10. Privacy and Data Protection
${system.privacyInformation || 'Privacy and data protection information has not been specified.'}

## 11. Maintenance and Support
For maintenance and support of this AI system, please contact:
- **Support Contact:** ${system.supportContact || '[SUPPORT CONTACT INFORMATION]'}
- **Support Hours:** ${system.supportHours || '[SUPPORT HOURS]'}

## 12. Compliance Information
This AI system has been classified as **${system.riskLevel || 'Unknown Risk'}** under the EU AI Act.

${system.complianceInformation || 'Additional compliance information has not been specified.'}

## 13. Version History
- **Current Version:** ${system.version || '1.0'}
- **Release Date:** ${system.releaseDate || currentDate}
- **Previous Versions:** ${system.previousVersions || 'None'}

## 14. Contact Information
For further information or inquiries about this AI system, please contact:

${companyName}
[COMPANY ADDRESS]
[CONTACT EMAIL/PHONE]

**Document Version:** 1.0
**Last Updated:** ${currentDate}
`;

  return content;
}