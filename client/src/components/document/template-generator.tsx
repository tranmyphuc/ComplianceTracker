
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, DownloadIcon, FileTextIcon, ClipboardCopyIcon, CheckIcon, RefreshCwIcon } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Document template type enumeration
enum DocumentType {
  TECHNICAL_DOCUMENTATION = 'technical_documentation',
  RISK_ASSESSMENT = 'risk_assessment',
  CONFORMITY_DECLARATION = 'conformity_declaration',
  HUMAN_OVERSIGHT_PROTOCOL = 'human_oversight_protocol',
  DATA_GOVERNANCE_POLICY = 'data_governance_policy',
  INCIDENT_RESPONSE_PLAN = 'incident_response_plan'
}

// Template structure
interface TemplateSection {
  title: string;
  content: string;
}

interface DocumentTemplate {
  title: string;
  sections: TemplateSection[];
}

// AI system interface
interface AiSystem {
  systemId: string;
  name: string;
  description?: string;
  purpose?: string;
  department?: string;
  riskLevel?: string;
  vendor?: string;
  version?: string;
  lastAssessmentDate?: string;
}

export function DocumentTemplateGenerator() {
  // State for the template generator
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(DocumentType.TECHNICAL_DOCUMENTATION);
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [format, setFormat] = useState<string>('markdown');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<DocumentTemplate | null>(null);
  const [companyName, setCompanyName] = useState('Your Company Name');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('preview');

  // Mock AI systems for demo
  const mockSystems: AiSystem[] = [
    {
      systemId: 'sys-1',
      name: 'Healthcare Diagnostic Assistant',
      description: 'AI system for assisting healthcare professionals with diagnostic suggestions',
      purpose: 'Medical diagnostic support',
      department: 'Healthcare',
      riskLevel: 'High',
      vendor: 'Internal',
      version: '1.2.0',
      lastAssessmentDate: '2024-05-10'
    },
    {
      systemId: 'sys-2',
      name: 'Employee Recruitment Analyzer',
      description: 'AI system for analyzing job applicant resumes and suggesting candidates',
      purpose: 'Recruitment support',
      department: 'Human Resources',
      riskLevel: 'High',
      vendor: 'TalentTech Solutions',
      version: '2.0.1',
      lastAssessmentDate: '2024-04-22'
    },
    {
      systemId: 'sys-3',
      name: 'Customer Service Chatbot',
      description: 'AI-powered chatbot for handling customer inquiries',
      purpose: 'Customer support automation',
      department: 'Customer Service',
      riskLevel: 'Limited',
      vendor: 'Internal',
      version: '3.5.2',
      lastAssessmentDate: '2024-05-05'
    },
    {
      systemId: 'sys-4',
      name: 'Fraud Detection Engine',
      description: 'AI system for detecting potentially fraudulent transactions',
      purpose: 'Fraud prevention',
      department: 'Security',
      riskLevel: 'High',
      vendor: 'SecureAI Inc.',
      version: '2.3.0',
      lastAssessmentDate: '2024-04-30'
    }
  ];

  // Get document type label
  const getDocTypeLabel = (docType: DocumentType): string => {
    switch (docType) {
      case DocumentType.TECHNICAL_DOCUMENTATION:
        return 'Technical Documentation';
      case DocumentType.RISK_ASSESSMENT:
        return 'Risk Assessment Report';
      case DocumentType.CONFORMITY_DECLARATION:
        return 'Declaration of Conformity';
      case DocumentType.HUMAN_OVERSIGHT_PROTOCOL:
        return 'Human Oversight Protocol';
      case DocumentType.DATA_GOVERNANCE_POLICY:
        return 'Data Governance Policy';
      case DocumentType.INCIDENT_RESPONSE_PLAN:
        return 'Incident Response Plan';
      default:
        return 'Unknown Document Type';
    }
  };

  // Get selected system details
  const getSelectedSystemDetails = (): AiSystem | undefined => {
    return mockSystems.find(system => system.systemId === selectedSystem);
  };

  // Generate template based on selected type
  const generateTemplate = async () => {
    setIsGenerating(true);
    setActiveTab('preview');
    
    // In a real implementation, this would call an API endpoint
    // For the demo, we'll use mock templates
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const system = getSelectedSystemDetails();
      
      // Generate template based on document type
      let template: DocumentTemplate;
      
      switch (selectedDocType) {
        case DocumentType.TECHNICAL_DOCUMENTATION:
          template = generateTechnicalDocTemplate(system);
          break;
        case DocumentType.RISK_ASSESSMENT:
          template = generateRiskAssessmentTemplate(system);
          break;
        case DocumentType.CONFORMITY_DECLARATION:
          template = generateConformityDeclarationTemplate(system);
          break;
        case DocumentType.HUMAN_OVERSIGHT_PROTOCOL:
          template = generateHumanOversightTemplate(system);
          break;
        case DocumentType.DATA_GOVERNANCE_POLICY:
          template = generateDataGovernanceTemplate(system);
          break;
        case DocumentType.INCIDENT_RESPONSE_PLAN:
          template = generateIncidentResponseTemplate(system);
          break;
        default:
          template = {
            title: 'Generic Document Template',
            sections: [
              {
                title: 'Introduction',
                content: 'This is a placeholder template. Please select a valid document type.'
              }
            ]
          };
      }
      
      setGeneratedTemplate(template);
    } catch (error) {
      console.error('Error generating template:', error);
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  // Templates for different document types
  const generateTechnicalDocTemplate = (system?: AiSystem): DocumentTemplate => {
    return {
      title: `Technical Documentation: ${system?.name || 'AI System'}`,
      sections: [
        {
          title: '1. General Description',
          content: `[Provide a general description of ${system?.name || 'the AI system'}, including its intended purpose, scope of application, and main functionalities.]\n\nSystem Name: ${system?.name || '[Enter system name]'}\nVersion: ${system?.version || '[Enter version]'}\nVendor: ${system?.vendor || '[Enter vendor]'}\nPurpose: ${system?.purpose || '[Enter purpose]'}\n\n[Describe the core functionality and capabilities of the system in detail, including its primary use cases and intended users.]`
        },
        {
          title: '2. System Architecture',
          content: '[Describe the system architecture, including components, data flows, and interfaces.]\n\n[Provide diagrams or visual representations of the system architecture, showing how different components interact.]\n\n[List and describe all major system components including:\n- Frontend interfaces\n- Backend services\n- Database systems\n- AI/ML models and their integration\n- External services and APIs\n- Networking and communication protocols]'
        },
        {
          title: '3. Development Process',
          content: '[Detail the development methodology, quality assurance processes, and tools used.]\n\n[Describe the development lifecycle, including:\n- Requirements gathering and analysis\n- Design phase\n- Implementation approach\n- Testing methodology\n- Deployment process\n- Maintenance procedures\n\nInclude information about version control, code review processes, and development standards followed.]'
        },
        {
          title: '4. Training Methodology',
          content: '[If applicable, describe the training methodology for the AI system, datasets used, and validation procedures.]\n\n[Include details on:\n- Training data sources and collection methods\n- Data preprocessing techniques\n- Model selection and architecture\n- Training hyperparameters and optimization methods\n- Cross-validation approach\n- Performance metrics used\n- Testing and evaluation procedures]'
        },
        {
          title: '5. Testing & Validation',
          content: '[Document testing procedures, validation methods, and performance metrics.]\n\n[Detail the following aspects:\n- Unit testing approach\n- Integration testing methodology\n- System testing procedures\n- Performance testing metrics and results\n- Security testing protocols\n- User acceptance testing\n- Validation methodologies used to verify system accuracy and reliability\n\nInclude test results, benchmark performance, and validation outcomes.]'
        },
        {
          title: '6. Risk Management',
          content: '[Outline risk management measures implemented in accordance with Article 9 of the EU AI Act.]\n\n[Document:\n- Risk identification methodology\n- Risk assessment process\n- Identified risks and their categorization\n- Risk mitigation strategies\n- Risk monitoring procedures\n- Incident response protocols\n\nInclude a risk register with identified risks, their likelihood, impact, and mitigation measures.]'
        },
        {
          title: '7. Change Management',
          content: '[Describe the process for managing and documenting changes to the system.]\n\n[Detail the following procedures:\n- Change request process\n- Change evaluation and approval workflow\n- Implementation procedures for changes\n- Testing requirements for changes\n- Documentation update processes\n- Stakeholder notification protocols\n- Rollback procedures\n\nInclude a change log template for tracking modifications to the system.]'
        },
        {
          title: '8. Accuracy and Performance Metrics',
          content: '[Document the accuracy, robustness, and performance metrics of the system.]\n\n[Include:\n- Accuracy measurements and methodology\n- Precision and recall metrics (if applicable)\n- Error rates and analysis\n- Performance under different conditions\n- Stress testing results\n- Consistency evaluations\n- Comparisons to benchmarks or standards\n\nProvide quantitative data and analysis of the system\'s performance.]'
        },
        {
          title: '9. Compliance Declarations',
          content: '[Document compliance with relevant standards, regulations, and best practices.]\n\n[List all applicable standards and regulations:\n- EU AI Act compliance status\n- Industry-specific regulations compliance\n- Data protection and privacy compliance (GDPR, etc.)\n- Technical standards compliance\n- Ethical guidelines adherence\n\nInclude references to compliance testing and certification if applicable.]'
        }
      ]
    };
  };

  const generateRiskAssessmentTemplate = (system?: AiSystem): DocumentTemplate => {
    return {
      title: `Risk Assessment Report: ${system?.name || 'AI System'}`,
      sections: [
        {
          title: '1. Executive Summary',
          content: `[Provide an executive summary of the risk assessment for ${system?.name || 'the AI system'}, including key findings and recommendations.]\n\nSystem Name: ${system?.name || '[Enter system name]'}\nRisk Level: ${system?.riskLevel || '[Enter risk level]'}\nAssessment Date: ${new Date().toISOString().split('T')[0]}\n\n[Summarize the overall risk profile, key risk factors identified, and critical recommendations.]`
        },
        {
          title: '2. System Overview',
          content: `[Provide a brief overview of ${system?.name || 'the AI system'} and its intended purpose.]\n\nSystem Purpose: ${system?.purpose || '[Enter purpose]'}\nDepartment: ${system?.department || '[Enter department]'}\nVendor: ${system?.vendor || '[Enter vendor]'}\nVersion: ${system?.version || '[Enter version]'}\n\n[Include additional context about how the system is used, its deployment environment, and key stakeholders.]`
        },
        {
          title: '3. Risk Assessment Methodology',
          content: '[Describe the methodology used for identifying and assessing risks.]\n\n[Detail the risk assessment framework, including:\n- Risk identification approach\n- Risk categorization criteria\n- Risk scoring methodology\n- Likelihood and impact definitions\n- Assessment participants and their roles\n- Assessment timeline and process\n\nReference any standards or frameworks used for the assessment (ISO 31000, NIST, etc.).]'
        },
        {
          title: '4. Identified Risks',
          content: '[List and categorize identified risks by severity.]\n\n[For each identified risk, document:\n1. Risk ID and name\n2. Risk category (technical, ethical, legal, operational)\n3. Risk description\n4. Likelihood rating (1-5 scale)\n5. Impact rating (1-5 scale)\n6. Overall risk score\n7. Risk owner\n\nOrganize risks by severity (Critical, High, Medium, Low) for clear prioritization.]'
        },
        {
          title: '5. Potential Harm Analysis',
          content: '[Analyze potential harm to individuals, groups, or society.]\n\n[For significant risks, provide in-depth analysis of potential harms, including:\n- Nature and scope of potential harm\n- Affected stakeholders or groups\n- Factors that could exacerbate harm\n- Cascading effects or indirect harms\n- Precedents or similar incidents\n- Regulatory implications\n\nInclude specific examples and scenarios where applicable.]'
        },
        {
          title: '6. Mitigation Measures',
          content: '[Detail measures implemented to mitigate identified risks.]\n\n[For each significant risk, document:\n1. Mitigation strategy overview\n2. Specific controls implemented\n3. Implementation status\n4. Effectiveness evaluation\n5. Residual risk after mitigation\n6. Responsible parties\n7. Implementation timeline\n\nGroup mitigations by type (technical, procedural, governance) where appropriate.]'
        },
        {
          title: '7. Residual Risks',
          content: '[Document residual risks that remain after mitigation measures.]\n\n[For each residual risk, include:\n1. Description of remaining risk\n2. Justification for acceptance\n3. Residual risk score\n4. Monitoring requirements\n5. Review frequency\n6. Escalation triggers\n\nClearly indicate which residual risks require ongoing attention versus those deemed acceptable.]'
        },
        {
          title: '8. Monitoring & Review',
          content: '[Outline procedures for ongoing monitoring and periodic review of risks.]\n\n[Detail the monitoring framework, including:\n- Key risk indicators to be tracked\n- Monitoring frequency and methods\n- Responsible parties for monitoring\n- Reporting mechanisms\n- Escalation procedures\n- Scheduled reassessment dates\n- Triggers for ad-hoc reassessments\n\nInclude a monitoring schedule and specific metrics for each significant risk.]'
        },
        {
          title: '9. EU AI Act Compliance Status',
          content: `[Evaluate compliance with EU AI Act requirements based on the system's risk classification.]\n\nRisk Classification: ${system?.riskLevel || '[Enter risk classification]'}\n\n[Provide detailed analysis of compliance status for each applicable EU AI Act requirement, including:\n- Article 9: Risk management system\n- Article 10: Data governance\n- Article 11: Technical documentation\n- Article 12: Record keeping\n- Article 13: Transparency\n- Article 14: Human oversight\n- Article 15: Accuracy and robustness\n\nIdentify any compliance gaps and remediation plans.]`
        }
      ]
    };
  };

  const generateConformityDeclarationTemplate = (system?: AiSystem): DocumentTemplate => {
    return {
      title: `EU AI Act Declaration of Conformity: ${system?.name || 'AI System'}`,
      sections: [
        {
          title: '1. System Identification',
          content: `This declaration of conformity is issued under the sole responsibility of ${companyName}.\n\nAI System Name: ${system?.name || '[Enter system name]'}\nVersion Number: ${system?.version || '[Enter version]'}\nUnique Identifier: ${system?.systemId || '[Enter unique identifier]'}\nManufacturer/Provider: ${system?.vendor || companyName}\nAddress: [Enter company address]`
        },
        {
          title: '2. Declaration Statement',
          content: `The AI system identified above is in conformity with the Regulation (EU) 2024/1689 of the European Parliament and of the Council on Artificial Intelligence (Artificial Intelligence Act).\n\nRisk Classification: ${system?.riskLevel || '[Enter risk classification]'}\n\nThis declaration confirms that all applicable requirements of the EU AI Act have been fulfilled and that appropriate technical documentation has been prepared.`
        },
        {
          title: '3. Applicable Requirements',
          content: `This AI system complies with the following requirements of the EU AI Act:\n\n- Article 9: Risk management system\n- Article 10: Data and data governance\n- Article 11: Technical documentation\n- Article 12: Record-keeping\n- Article 13: Transparency and provision of information to users\n- Article 14: Human oversight\n- Article 15: Accuracy, robustness and cybersecurity\n\n[List any additional applicable requirements or indicate "Not Applicable" as appropriate]`
        },
        {
          title: '4. Technical Standards',
          content: 'The following harmonized standards, common specifications, or other technical specifications have been applied in the conformity assessment:\n\n- [List applicable standards]\n- [List applicable specifications]\n\n[Note: Once harmonized standards are published in the Official Journal of the EU, they should be listed here]'
        },
        {
          title: '5. Conformity Assessment',
          content: 'The following conformity assessment procedure has been applied:\n\n- [Internal control procedure according to Article 43(1)]\n- [Conformity assessment based on assessment of quality management system and assessment of technical documentation according to Article 43(3)]\n\n[Select applicable procedure based on risk classification and system characteristics]'
        },
        {
          title: '6. Notified Body Details',
          content: '[If applicable, provide details of the notified body involved in conformity assessment]\n\nNotified Body Name: [If applicable]\nNotified Body Number: [If applicable]\nCertificate Number: [If applicable]\n\n[If no notified body was involved, state "Conformity assessment was conducted through internal control procedures"]'
        },
        {
          title: '7. Additional Information',
          content: '[Include any additional information relevant to the declaration, such as links to technical documentation, special conditions of use, etc.]\n\n[This section can also include information about testing conducted, risk mitigations implemented, and other relevant details supporting the declaration]'
        },
        {
          title: '8. Authorized Representative',
          content: 'Signed for and on behalf of: [Company Name]\n\nPlace and date of issue: [Place, Date]\n\nName: [Name of authorized representative]\nPosition: [Position/Title]\nSignature: _______________________'
        }
      ]
    };
  };

  const generateHumanOversightTemplate = (system?: AiSystem): DocumentTemplate => {
    return {
      title: `Human Oversight Protocol: ${system?.name || 'AI System'}`,
      sections: [
        {
          title: '1. Introduction',
          content: `This document outlines the human oversight protocol for ${system?.name || 'the AI system'}, designed to fulfill the requirements of Article 14 of the EU AI Act.\n\nSystem Name: ${system?.name || '[Enter system name]'}\nVersion: ${system?.version || '[Enter version]'}\nRisk Classification: ${system?.riskLevel || '[Enter risk classification]'}\nDepartment: ${system?.department || '[Enter department]'}`
        },
        {
          title: '2. Oversight Objectives',
          content: '[Define the objectives of human oversight for this AI system.]\n\nThe human oversight protocol aims to ensure that:\n- Human overseers can fully understand the system\'s capabilities and limitations\n- Effective monitoring of the system\'s operation is maintained\n- Humans can intervene in system operations when necessary\n- The system\'s outputs are properly interpreted and reviewed before action\n- Potential risks are identified and addressed promptly\n- Decisions with significant impacts receive appropriate human review\n\n[Add or modify objectives based on the specific context and risk profile of the system]'
        },
        {
          title: '3. Designated Roles & Responsibilities',
          content: '[Define the roles and responsibilities for human oversight.]\n\nThe following roles are established for the human oversight process:\n\n1. **System Operators**\n   - Day-to-day monitoring of system performance\n   - First-level review of system outputs\n   - Routine intervention decisions\n   - Incident reporting\n\n2. **Expert Reviewers**\n   - Review of complex or high-impact cases\n   - Second-level verification of system outputs\n   - Analysis of system behavior in edge cases\n   - Feedback on system performance improvements\n\n3. **Oversight Manager**\n   - Supervision of the oversight process\n   - Allocation of oversight resources\n   - Escalation point for complex issues\n   - Reporting to senior management\n\n4. **Technical Support**\n   - Technical assistance for the oversight team\n   - System behavior explanation\n   - Implementation of technical interventions\n\n[Detail specific qualifications, training requirements, and expected competencies for each role]'
        },
        {
          title: '4. Oversight Mechanisms',
          content: '[Describe the specific mechanisms implemented to enable effective human oversight.]\n\n1. **Monitoring Dashboard**\n   - Real-time system performance metrics\n   - Key risk indicators with alert thresholds\n   - Visualization of system decision patterns\n   - Log of system actions and interventions\n\n2. **Review Procedures**\n   - Systematic sampling of system outputs for human review\n   - Mandatory review thresholds based on confidence scores\n   - Specialized review for high-impact decisions\n   - Periodic random audits of system behavior\n\n3. **Decision Support Tools**\n   - Explainability features for system recommendations\n   - Confidence scoring for all system outputs\n   - Alternate recommendation suggestions\n   - Decision justification documentation\n\n4. **System Limitation Indicators**\n   - Clear display of system operating boundaries\n   - Uncertainty visualization\n   - Edge case detection and flagging\n   - Data quality warnings\n\n[Include screenshots, interface descriptions, or workflow diagrams where appropriate]'
        },
        {
          title: '5. Intervention Procedures',
          content: '[Detail the procedures for human intervention in the AI system.]\n\n1. **Intervention Triggers**\n   - System confidence below [threshold]\n   - Detection of novel or unusual patterns\n   - Potential high-impact decisions\n   - System health metrics outside normal parameters\n   - User-initiated intervention requests\n   - Specific regulatory or compliance situations\n\n2. **Intervention Methods**\n   - Emergency stop functionality\n   - Decision override process\n   - System parameter adjustment\n   - Partial functionality restriction\n   - Complete system deactivation\n\n3. **Intervention Authorization Levels**\n   - Level 1: Operator interventions (routine adjustments)\n   - Level 2: Expert reviewer interventions (significant modifications)\n   - Level 3: Management interventions (critical situations)\n\n4. **Post-Intervention Procedures**\n   - Documentation requirements\n   - Root cause analysis\n   - System adjustment recommendations\n   - Intervention effectiveness review\n\n[Include detailed step-by-step procedures for each intervention type]'
        },
        {
          title: '6. Training Requirements',
          content: '[Specify training requirements for human overseers.]\n\n1. **Initial Training Program**\n   - System functionality and limitations (8 hours)\n   - Risk recognition and assessment (4 hours)\n   - Intervention procedures and tools (6 hours)\n   - Documentation and reporting (2 hours)\n   - Practical exercises and simulations (8 hours)\n   - Assessment and certification (2 hours)\n\n2. **Ongoing Training**\n   - Quarterly refresher sessions (2 hours)\n   - System update training as needed\n   - Annual recertification\n   - Incident response drills\n\n3. **Specialized Training**\n   - Role-specific advanced modules\n   - Technical deep dives for expert reviewers\n   - New feature training\n   - Emerging risk awareness\n\n[Include training materials references, competency assessment criteria, and certification requirements]'
        },
        {
          title: '7. Documentation & Reporting',
          content: '[Outline documentation and reporting requirements for the oversight process.]\n\n1. **Required Documentation**\n   - Oversight activity logs\n   - Intervention records\n   - Training completion records\n   - System performance reviews\n   - Incident reports\n\n2. **Reporting Schedule**\n   - Daily oversight summaries\n   - Weekly performance reports\n   - Monthly oversight effectiveness reviews\n   - Quarterly compliance assessments\n   - Annual comprehensive oversight evaluation\n\n3. **Reporting Templates**\n   - Oversight activity report\n   - Intervention documentation form\n   - System performance assessment\n   - Incident analysis template\n   - Improvement recommendation form\n\n[Include sample templates and documentation standards]'
        },
        {
          title: '8. Oversight Effectiveness Evaluation',
          content: '[Describe how the effectiveness of human oversight will be evaluated.]\n\n1. **Key Performance Indicators**\n   - Intervention response time\n   - Issue detection rate\n   - False positive/negative oversight alerts\n   - System improvement recommendations implemented\n   - User satisfaction with oversight process\n\n2. **Evaluation Methods**\n   - Periodic simulated incidents\n   - External audit of oversight effectiveness\n   - Peer review of intervention decisions\n   - Stakeholder feedback collection\n   - Comparison against industry benchmarks\n\n3. **Continuous Improvement Process**\n   - Regular oversight protocol reviews\n   - Feedback integration mechanism\n   - Lessons learned documentation\n   - Protocol update procedure\n\n[Detail the evaluation schedule, responsible parties, and improvement implementation process]'
        }
      ]
    };
  };

  const generateDataGovernanceTemplate = (system?: AiSystem): DocumentTemplate => {
    return {
      title: `Data Governance Policy: ${system?.name || 'AI System'}`,
      sections: [
        {
          title: '1. Introduction',
          content: `This Data Governance Policy outlines the principles, processes, and controls implemented for ${system?.name || 'the AI system'} to ensure compliance with Article 10 of the EU AI Act.\n\nSystem Name: ${system?.name || '[Enter system name]'}\nVersion: ${system?.version || '[Enter version]'}\nRisk Classification: ${system?.riskLevel || '[Enter risk classification]'}\nDepartment: ${system?.department || '[Enter department]'}`
        },
        {
          title: '2. Data Governance Framework',
          content: '[Outline the overall data governance framework.]\n\nThis data governance framework establishes:\n- Organizational structure for data governance\n- Roles and responsibilities\n- Data governance processes and workflows\n- Governance controls and monitoring\n- Compliance and reporting mechanisms\n\nThe framework applies to all data used in training, validation, testing, and operation of the AI system, including both input and output data.'
        },
        {
          title: '3. Data Quality Assurance',
          content: '[Detail data quality criteria and assurance processes.]\n\n1. **Data Quality Dimensions**\n   - Accuracy: Correctness of data values\n   - Completeness: Required data present\n   - Consistency: Data coherence across datasets\n   - Timeliness: Data currency and availability\n   - Relevance: Alignment with intended purpose\n   - Representativeness: Coverage of relevant scenarios\n\n2. **Data Quality Assessment**\n   - Initial data profiling and quality assessment\n   - Quality scoring methodology\n   - Automated quality checks and flagging\n   - Manual verification procedures\n   - Periodic reassessment schedule\n\n3. **Quality Improvement Process**\n   - Data cleansing procedures\n   - Missing data handling\n   - Anomaly detection and resolution\n   - Data enrichment methods\n   - Feedback loops for continuous improvement\n\n[Include specific quality thresholds and metrics for each data source]'
        },
        {
          title: '4. Data Protection Measures',
          content: '[Document measures to protect data and ensure privacy.]\n\n1. **Data Classification**\n   - Public data\n   - Internal data\n   - Confidential data\n   - Sensitive personal data\n   - Special category data (Article 9 GDPR)\n\n2. **Protection Controls**\n   - Access control mechanisms\n   - Encryption standards for storage and transfer\n   - Anonymization and pseudonymization techniques\n   - Data minimization practices\n   - Retention and deletion procedures\n\n3. **GDPR Compliance**\n   - Legal basis for processing\n   - Data subject rights handling\n   - Impact assessments\n   - Breach notification procedures\n   - Cross-border transfer safeguards\n\n[Detail specific technical and organizational measures implemented]'
        },
        {
          title: '5. Data Processing Procedures',
          content: '[Describe the procedures for data processing throughout the AI lifecycle.]\n\n1. **Data Collection**\n   - Sources and methods\n   - Documentation requirements\n   - Consent management (if applicable)\n   - Collection frequency and triggers\n\n2. **Data Preparation**\n   - Preprocessing workflows\n   - Feature engineering standards\n   - Transformation documentation\n   - Version control for processed datasets\n\n3. **Model Training Use**\n   - Training/validation/test split methodology\n   - Cross-validation procedures\n   - Dataset versioning and tracking\n   - Training data documentation requirements\n\n4. **Operational Data Handling**\n   - Input data validation\n   - Output data management\n   - Feedback data collection\n   - Retraining data selection\n\n[Include data flow diagrams and process maps where appropriate]'
        },
        {
          title: '6. Training Data Management',
          content: '[Outline specific management practices for training data.]\n\n1. **Dataset Documentation**\n   - Dataset purpose and scope\n   - Collection methodology\n   - Preprocessing steps applied\n   - Known limitations or biases\n   - Version history and changes\n\n2. **Dataset Composition Analysis**\n   - Statistical properties and distributions\n   - Demographic representation assessment\n   - Class balance evaluation\n   - Edge case coverage\n   - Temporal distribution analysis\n\n3. **Dataset Maintenance**\n   - Update frequency and triggers\n   - Curation and expansion methods\n   - Historical snapshot preservation\n   - Deprecated data handling\n\n[Include details on specific datasets used, their properties, and management practices]'
        },
        {
          title: '7. Bias Monitoring & Mitigation',
          content: '[Detail processes for identifying and addressing biases.]\n\n1. **Bias Assessment Framework**\n   - Bias types monitored (selection, measurement, etc.)\n   - Assessment methodology for each bias type\n   - Benchmark datasets for bias testing\n   - Threshold definitions for acceptable bias levels\n\n2. **Monitoring Procedures**\n   - Pre-training dataset analysis\n   - Training process monitoring\n   - Post-training output evaluation\n   - Production bias monitoring\n   - Demographic performance parity checks\n\n3. **Mitigation Strategies**\n   - Dataset balancing techniques\n   - Model architecture adjustments\n   - Training process modifications\n   - Post-processing corrections\n   - Human review protocols for high-risk decisions\n\n4. **Bias Documentation Requirements**\n   - Identified biases and their potential impacts\n   - Mitigation measures implemented\n   - Residual biases and limitations\n   - Testing results and improvements\n\n[Include specific metrics and tools used for bias monitoring]'
        },
        {
          title: '8. Data Access Controls',
          content: '[Describe the data access control framework.]\n\n1. **Access Control Model**\n   - Role-based access control structure\n   - Principle of least privilege implementation\n   - Segregation of duties\n   - Privileged access management\n\n2. **Authentication & Authorization**\n   - Authentication methods and requirements\n   - Authorization workflow\n   - Access request and approval process\n   - Periodic access review schedule\n\n3. **Access Monitoring**\n   - Logging requirements\n   - Audit trail maintenance\n   - Unusual access pattern detection\n   - Access violation handling\n\n4. **Third-Party Access Management**\n   - Vendor access requirements\n   - Contractual obligations\n   - Access termination procedures\n   - Compliance verification\n\n[Detail the specific access controls for each data type and environment]'
        },
        {
          title: '9. Documentation & Compliance',
          content: '[Outline documentation requirements and compliance verification.]\n\n1. **Required Documentation**\n   - Data inventories and flows\n   - Processing activities register\n   - Data quality assessments\n   - Bias evaluations and mitigations\n   - Security controls implementation\n   - Access authorization records\n\n2. **Compliance Verification**\n   - Periodic compliance assessments\n   - Documentation review procedures\n   - Control testing methodology\n   - Third-party audit provisions\n   - Regulatory reporting process\n\n3. **Non-Compliance Handling**\n   - Deviation identification and classification\n   - Remediation planning and tracking\n   - Root cause analysis requirements\n   - Escalation procedures\n   - Regulatory notification criteria\n\n[Include documentation templates and compliance checklists]'
        }
      ]
    };
  };

  const generateIncidentResponseTemplate = (system?: AiSystem): DocumentTemplate => {
    return {
      title: `Incident Response Plan: ${system?.name || 'AI System'}`,
      sections: [
        {
          title: '1. Introduction',
          content: `This Incident Response Plan outlines the procedures for handling incidents related to ${system?.name || 'the AI system'} in accordance with the EU AI Act requirements.\n\nSystem Name: ${system?.name || '[Enter system name]'}\nVersion: ${system?.version || '[Enter version]'}\nRisk Classification: ${system?.riskLevel || '[Enter risk classification]'}\nDepartment: ${system?.department || '[Enter department]'}`
        },
        {
          title: '2. Incident Classification',
          content: '[Define incident categories and severity levels.]\n\n1. **Incident Categories**\n   - System malfunction or operational failure\n   - Security breach or unauthorized access\n   - Data integrity or quality incident\n   - Bias or discrimination incident\n   - Privacy breach or data protection incident\n   - Performance degradation\n   - Unexpected system behavior\n   - Regulatory compliance incident\n\n2. **Severity Levels**\n   - **Critical (Level 1)**: Significant harm to individuals, breach of fundamental rights, widespread impact, or regulatory violations\n   - **High (Level 2)**: Potential for harm to multiple individuals, significant system malfunction, or limited regulatory impact\n   - **Medium (Level 3)**: Limited impact on individuals, temporary system issues, or minor compliance concerns\n   - **Low (Level 4)**: Minimal impact, easily remediated issues, or isolated technical problems\n\n[Include a severity assessment matrix with specific examples for each category and level]'
        },
        {
          title: '3. Notification Procedures',
          content: '[Detail internal and external notification requirements.]\n\n1. **Internal Notification**\n   - Initial incident reporter responsibilities\n   - Escalation path based on severity\n   - Management notification timeline\n   - Communication templates and channels\n   - Status update frequency\n\n2. **External Notification**\n   - Regulatory notification requirements and timelines\n     - EU AI Act notification criteria\n     - GDPR breach notification (if applicable)\n     - Sector-specific regulatory requirements\n   - Customer/user notification criteria\n   - Stakeholder communication strategy\n   - Public relations approach for significant incidents\n\n3. **Communication Templates**\n   - Initial incident alert template\n   - Situation update template\n   - Regulatory notification template\n   - User/customer notification template\n   - Resolution and lessons learned communication\n\n[Include contact information for key personnel and authorities]'
        },
        {
          title: '4. Response Team Structure',
          content: '[Define the incident response team structure and responsibilities.]\n\n1. **Core Response Team**\n   - Incident Response Manager: [Role/Position]\n   - Technical Lead: [Role/Position]\n   - Data Protection Officer: [Role/Position]\n   - Legal Counsel: [Role/Position]\n   - Communications Specialist: [Role/Position]\n\n2. **Extended Response Team**\n   - Executive Sponsor: [Role/Position]\n   - AI Ethics Specialist: [Role/Position]\n   - Security Officer: [Role/Position]\n   - Business Unit Representative: [Role/Position]\n   - Customer Support Lead: [Role/Position]\n\n3. **Team Activation**\n   - Activation criteria by severity level\n   - On-call roster and contact procedures\n   - Virtual command center setup\n   - Tools and resources availability\n\n4. **Decision Authority Matrix**\n   - Decision-making authority by role and severity\n   - Escalation triggers\n   - Documentation requirements for decisions\n\n[Include contact information and backup personnel for each role]'
        },
        {
          title: '5. Investigation Process',
          content: '[Outline the incident investigation methodology.]\n\n1. **Initial Assessment**\n   - Information gathering procedures\n   - Immediate impact evaluation\n   - Preliminary cause identification\n   - Evidence preservation protocols\n   - System isolation determination\n\n2. **Technical Investigation**\n   - System log analysis\n   - Data examination procedures\n   - Model behavior assessment\n   - Performance metrics review\n   - External factors evaluation\n\n3. **Root Cause Analysis**\n   - Analysis methodologies (5 Whys, Fishbone, etc.)\n   - Contributing factor identification\n   - Systemic issue assessment\n   - Documentation requirements\n   - Technical review process\n\n4. **Impact Assessment**\n   - User/individual impact evaluation\n   - Operational impact analysis\n   - Regulatory compliance impact\n   - Reputational impact assessment\n   - Financial impact calculation\n\n[Include investigation templates and technical resources available to the team]'
        },
        {
          title: '6. Containment & Remediation Steps',
          content: '[Describe containment strategies and remediation procedures.]\n\n1. **Containment Strategies**\n   - System isolation procedures\n   - Feature disablement options\n   - Access restriction protocols\n   - Traffic routing alternatives\n   - Backup activation process\n\n2. **Emergency Response Actions**\n   - System shutdown procedure\n   - Data protection measures\n   - User notification mechanisms\n   - Emergency patches or fixes\n   - Rollback procedures\n\n3. **Remediation Planning**\n   - Prioritization criteria\n   - Solution development process\n   - Testing requirements before implementation\n   - Phased correction approach\n   - User impact minimization strategies\n\n4. **Implementation & Verification**\n   - Change management process\n   - Deployment procedures\n   - Verification testing methodology\n   - Success criteria definition\n   - Documentation requirements\n\n[Include technical playbooks for common incident types]'
        },
        {
          title: '7. Reporting Requirements',
          content: '[Detail reporting requirements throughout the incident lifecycle.]\n\n1. **Regulatory Reporting**\n   - EU AI Act reporting requirements\n     - Serious incident definition\n     - Required information\n     - Submission procedure\n     - Follow-up obligations\n   - GDPR reporting (if applicable)\n   - Sector-specific reporting obligations\n\n2. **Internal Reporting**\n   - Initial incident report\n   - Investigation findings report\n   - Remediation status updates\n   - Executive briefing template\n   - Board reporting for significant incidents\n\n3. **Documentation Standards**\n   - Required incident documentation\n   - Evidence preservation guidelines\n   - Record retention periods\n   - Confidentiality markings\n   - Distribution limitations\n\n[Include templates for each report type and submission instructions]'
        },
        {
          title: '8. Post-Incident Analysis',
          content: '[Outline the post-incident review and improvement process.]\n\n1. **Lessons Learned Session**\n   - Facilitation methodology\n   - Required participants\n   - Discussion structure\n   - Documentation format\n   - Follow-up assignment process\n\n2. **Improvement Identification**\n   - Categorization of improvement areas\n     - Technical changes\n     - Process improvements\n     - Training needs\n     - Resource requirements\n     - Governance adjustments\n   - Prioritization methodology\n   - Implementation planning\n\n3. **Incident Response Evaluation**\n   - Response effectiveness assessment\n   - Timeline analysis\n   - Communication effectiveness review\n   - Team performance evaluation\n   - Resource adequacy assessment\n\n4. **Knowledge Integration**\n   - Incident knowledge base updates\n   - Procedure revision process\n   - Training material updates\n   - Simulation scenario development\n   - Best practice documentation\n\n[Include post-incident analysis templates and examples]'
        },
        {
          title: '9. Testing & Maintenance',
          content: '[Describe the plan testing and maintenance procedures.]\n\n1. **Incident Response Drills**\n   - Annual tabletop exercise schedule\n   - Technical simulation requirements\n   - Scenario development process\n   - Participation requirements\n   - Evaluation methodology\n\n2. **Plan Review Schedule**\n   - Quarterly review process\n   - Trigger events for ad-hoc reviews\n     - Major system changes\n     - Organizational restructuring\n     - Regulatory updates\n     - Post-significant incidents\n   - Approval process for updates\n\n3. **Contact Information Maintenance**\n   - Monthly verification procedure\n   - Update responsibility\n   - Distribution method\n   - Backup contact requirements\n\n4. **Resource Readiness Checks**\n   - Tool and system access verification\n   - Documentation accessibility testing\n   - Response kit maintenance\n   - External vendor readiness confirmation\n\n[Include testing schedule and responsibility matrix]'
        }
      ]
    };
  };

  // Format document for display based on selected format
  const formatDocument = (template: DocumentTemplate): string => {
    if (!template) return '';
    
    switch (format) {
      case 'markdown':
        return `# ${template.title}\n\n${template.sections.map(section => 
          `## ${section.title}\n\n${section.content}\n\n`
        ).join('')}`;
      case 'html':
        return `<h1>${template.title}</h1>\n\n${template.sections.map(section => 
          `<h2>${section.title}</h2>\n<div>${section.content.replace(/\n/g, '<br>')}</div>\n\n`
        ).join('')}`;
      default:
        return formatMarkdown(template);
    }
  };
  
  // Format markdown for display
  const formatMarkdown = (template: DocumentTemplate): string => {
    return `# ${template.title}\n\n${template.sections.map(section => 
      `## ${section.title}\n\n${section.content}\n\n`
    ).join('')}`;
  };

  // Copy template to clipboard
  const copyToClipboard = () => {
    if (!generatedTemplate) return;
    
    const formattedContent = formatDocument(generatedTemplate);
    navigator.clipboard.writeText(formattedContent);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate formatted document for download
  const downloadDocument = () => {
    if (!generatedTemplate) return;
    
    const formattedContent = formatDocument(generatedTemplate);
    const blob = new Blob([formattedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedTemplate.title.replace(/\s+/g, '_')}.${format === 'html' ? 'html' : 'md'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5 text-primary" />
          Document Template Generator
        </CardTitle>
        <CardDescription>
          Automatically generate EU AI Act compliant document templates based on your AI system's risk level
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="options">Template Options</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedTemplate}>Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="options" className="space-y-6 pt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select 
                  value={selectedDocType}
                  onValueChange={(value) => setSelectedDocType(value as DocumentType)}
                >
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DocumentType.TECHNICAL_DOCUMENTATION}>Technical Documentation</SelectItem>
                    <SelectItem value={DocumentType.RISK_ASSESSMENT}>Risk Assessment Report</SelectItem>
                    <SelectItem value={DocumentType.CONFORMITY_DECLARATION}>Declaration of Conformity</SelectItem>
                    <SelectItem value={DocumentType.HUMAN_OVERSIGHT_PROTOCOL}>Human Oversight Protocol</SelectItem>
                    <SelectItem value={DocumentType.DATA_GOVERNANCE_POLICY}>Data Governance Policy</SelectItem>
                    <SelectItem value={DocumentType.INCIDENT_RESPONSE_PLAN}>Incident Response Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-system">AI System</Label>
                <Select 
                  value={selectedSystem}
                  onValueChange={setSelectedSystem}
                >
                  <SelectTrigger id="ai-system">
                    <SelectValue placeholder="Select an AI system" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSystems.map(system => (
                      <SelectItem key={system.systemId} value={system.systemId}>
                        {system.name} ({system.riskLevel} Risk)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select 
                  value={format}
                  onValueChange={setFormat}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional-details">Additional Details (Optional)</Label>
                <Textarea 
                  id="additional-details" 
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Enter any additional details or specific requirements for the document template"
                  rows={4}
                />
              </div>
            </div>
            
            <Button 
              onClick={generateTemplate} 
              disabled={!selectedDocType || !selectedSystem || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                  Generating Template...
                </>
              ) : (
                'Generate Document Template'
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            {generatedTemplate ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{generatedTemplate.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? (
                        <>
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <ClipboardCopyIcon className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadDocument}>
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/30">
                  <div className="space-y-6">
                    {generatedTemplate.sections.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="text-base font-medium">{section.title}</h4>
                        <div className="whitespace-pre-line text-sm text-muted-foreground">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <Alert>
                <FileIcon className="h-4 w-4" />
                <AlertDescription>
                  No template generated yet. Please select options and generate a template first.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {generatedTemplate && (
          <div className="text-sm text-muted-foreground">
            Template generated for: {getSelectedSystemDetails()?.name || 'Unknown System'}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
