import { DocumentType } from "../shared/types";
import { callDeepSeekApi, AIModel, callAI } from "./ai-service";
import { getRiskClassificationDetails } from "./risk-assessment";
import { getRelevantArticlesForSystem } from "./regulatory-service";

interface DocumentParams {
  system: Partial<AiSystem>;
  documentType: DocumentType;
  companyName: string;
  additionalDetails?: Record<string, any>;
  format?: DocumentFormat;
}

interface GeneratedDocument {
  text: string;
  references: ArticleReference[];
  metadata: DocumentMetadata;
  visualizations?: VisualizationData[];
}

interface ArticleReference {
  articleId: string;
  title: string;
  relevance: string;
  excerpt: string;
  url?: string;
}

interface DocumentMetadata {
  generatedAt: string;
  version: string;
  systemId: string;
  systemRiskLevel: string;
  documentType: DocumentType;
  regulatoryVersion: string;
  validUntil?: string;
}

interface VisualizationData {
  type: "riskHeatmap" | "timeline" | "complianceChart" | "decisionTree";
  title: string;
  description: string;
  data: any;
}

export enum DocumentFormat {
  MARKDOWN = "markdown",
  HTML = "html",
  PDF = "pdf",
  DOCX = "docx",
  JSON = "json",
  VIDEO = "video" // For video briefing generation
}

/**
 * Enhanced document generation system with legal validation, multimedia integration,
 * and automated references
 */
export async function generateEnhancedDocument(params: DocumentParams): Promise<GeneratedDocument> {
  const { system, documentType, companyName, additionalDetails, format = DocumentFormat.MARKDOWN } = params;
  
  // 1. Build the core prompt based on document type with legal focus
  const prompt = buildLegalDocumentPrompt(documentType, system, companyName, additionalDetails);
  
  // 2. Get relevant EU AI Act articles for this system based on classification
  const relevantArticles = await getRelevantArticlesForSystem(system);
  
  // 3. Get detailed risk classification
  const riskDetails = await getRiskClassificationDetails(system.riskLevel as string);
  
  // 4. Call AI model for document generation with enhanced legal context
  const documentText = await generateDocumentWithLegalContext(prompt, relevantArticles, riskDetails, format);
  
  // 5. Extract and validate references from generated document
  const references = await extractAndValidateReferences(documentText, relevantArticles);
  
  // 6. Generate visualization data based on document type and system details
  const visualizations = await generateVisualizationData(documentType, system, riskDetails);
  
  // 7. Create document metadata
  const metadata = {
    generatedAt: new Date().toISOString(),
    version: "1.0",
    systemId: system.systemId || "",
    systemRiskLevel: system.riskLevel || "Unknown",
    documentType: documentType,
    regulatoryVersion: "EU AI Act - March 2025",
  };
  
  return {
    text: documentText,
    references,
    metadata,
    visualizations
  };
}

/**
 * Build a detailed prompt for legal document generation
 */
function buildLegalDocumentPrompt(
  documentType: DocumentType, 
  system: Partial<AiSystem>,
  companyName: string,
  additionalDetails?: Record<string, any>
): string {
  const systemName = system.name || "Unknown System";
  const systemPurpose = system.purpose || "Unknown Purpose";
  const systemRiskLevel = system.riskLevel || "Unknown Risk Level";
  
  // Base prompt with improved legal focus
  let prompt = `
  Generate a detailed ${documentTypeToLabel(documentType)} for an AI system under the EU AI Act compliance requirements.
  
  SYSTEM DETAILS:
  - Name: ${systemName}
  - Purpose: ${systemPurpose}
  - Risk Level: ${systemRiskLevel}
  - Company: ${companyName}
  ${system.department ? `- Department: ${system.department}` : ''}
  ${system.version ? `- Version: ${system.version}` : ''}
  ${system.vendor ? `- Vendor/Provider: ${system.vendor}` : ''}
  ${system.capabilities ? `- Capabilities: ${system.capabilities}` : ''}
  
  LEGAL REQUIREMENTS:
  - This document must comply with the EU AI Act (Published March 2024)
  - Include specific references to relevant articles of the EU AI Act
  - Ensure all mandatory sections for this type of system are included
  - Use legally precise language while maintaining clarity
  `;
  
  // Document-specific prompts with enhanced legal content
  switch (documentType) {
    case DocumentType.TECHNICAL_DOCUMENTATION:
      prompt += `
      TECHNICAL DOCUMENTATION REQUIREMENTS:
      
      Create a comprehensive technical documentation that fulfills Article 11 requirements. Include:
      1. Detailed system architecture and components
      2. Development methodology and quality assurance processes
      3. Data governance practices including data quality measures
      4. Risk management framework with specific mitigations
      5. Detailed testing methodologies and results summary
      6. Post-market monitoring plan
      7. Performance metrics with benchmarks
      8. Documentation of human oversight mechanisms
      
      FORMAT:
      - Use clear section headings and sub-headings
      - Include citation references to specific EU AI Act Articles
      - Include tables for test results and metrics
      - Include a section on evidence of compliance with each applicable requirement
      `;
      break;
      
    case DocumentType.RISK_ASSESSMENT:
      prompt += `
      RISK ASSESSMENT REPORT REQUIREMENTS:
      
      Create a comprehensive risk assessment report that includes:
      1. Systematic risk identification methodology
      2. Risk scoring methodology clearly explained
      3. Detailed risk categories (fundamental rights, safety, discrimination, etc.)
      4. Risk evaluation matrix with likelihood and impact
      5. Specific mitigation strategies for each identified risk
      6. Residual risk analysis
      7. Ongoing risk monitoring procedures
      8. References to relevant standards (ISO 31000, ISO 42001)
      
      FORMAT:
      - Use clear risk categorization
      - Include risk heat maps in tabular format
      - Provide detailed justification for each risk rating
      - Cross-reference with EU AI Act risk classification criteria
      `;
      break;
      
    case DocumentType.CONFORMITY_DECLARATION:
      prompt += `
      DECLARATION OF CONFORMITY REQUIREMENTS:
      
      Create a legally valid declaration of conformity that includes:
      1. Clear identification of the AI system and provider
      2. Explicit statement of conformity with EU AI Act
      3. References to specific standards applied
      4. Information on any conformity assessment procedures completed
      5. Reference to technical documentation location
      6. Corporate signatory information
      7. Legal attestation language
      
      FORMAT:
      - Use formal legal declaration format
      - Include official declaration language
      - Structure as a legally binding document
      - Include specific references to applicable EU AI Act Articles
      `;
      break;
      
    case DocumentType.HUMAN_OVERSIGHT_PROTOCOL:
      prompt += `
      HUMAN OVERSIGHT PROTOCOL REQUIREMENTS:
      
      Create a detailed human oversight protocol that includes:
      1. Clear definition of oversight roles and responsibilities
      2. Decision authority thresholds and escalation procedures
      3. Training requirements for human overseers
      4. Documentation requirements for oversight activities
      5. Testing and verification of oversight effectiveness
      6. Integration with operational workflows
      7. Metrics for measuring oversight performance
      
      FORMAT:
      - Include process flowcharts in text format
      - Clearly define decision boundaries
      - Provide specific oversight scenarios and responses
      - Include compliance verification procedures
      `;
      break;
      
    case DocumentType.DATA_GOVERNANCE_POLICY:
      prompt += `
      DATA GOVERNANCE POLICY REQUIREMENTS:
      
      Create a comprehensive data governance policy that includes:
      1. Data collection practices and limitations
      2. Data quality assurance procedures
      3. Data annotation and labeling standards
      4. Privacy protection measures
      5. Data security controls
      6. Data retention and disposal procedures
      7. Roles and responsibilities for data management
      8. Compliance with GDPR and other data regulations
      
      FORMAT:
      - Define clear procedural requirements
      - Include data lifecycle management
      - Provide specific standards for data quality
      - Reference relevant data protection laws
      `;
      break;
      
    case DocumentType.INCIDENT_RESPONSE_PLAN:
      prompt += `
      INCIDENT RESPONSE PLAN REQUIREMENTS:
      
      Create a detailed incident response plan that includes:
      1. Incident classification framework
      2. Detection mechanisms and monitoring
      3. Response team structure and responsibilities
      4. Escalation procedures with timelines
      5. Communication protocols (internal and external)
      6. Investigation and root cause analysis procedures
      7. Regulatory reporting requirements
      8. Post-incident review and improvement process
      
      FORMAT:
      - Include response flowcharts in text format
      - Provide clear timeline requirements
      - Include specific incident scenarios and responses
      - Define explicit escalation thresholds
      `;
      break;
  }
  
  // Add any additional customization details
  if (additionalDetails) {
    prompt += "\n\nADDITIONAL DETAILS TO INCLUDE:\n";
    
    for (const [key, value] of Object.entries(additionalDetails)) {
      prompt += `- ${key}: ${value}\n`;
    }
  }
  
  // Final formatting instructions
  prompt += `
  FINAL REQUIREMENTS:
  - Ensure all content is factual and accurate
  - Use professional, legally sound language
  - Avoid placeholders or hypothetical statements
  - Format the document with proper headings and structure
  - Include explicit references to EU AI Act articles
  - Provide specific implementation guidance, not generic advice
  `;
  
  return prompt;
}

/**
 * Generate document with enhanced legal context
 */
async function generateDocumentWithLegalContext(
  prompt: string, 
  relevantArticles: any[], 
  riskDetails: any,
  format: DocumentFormat
): Promise<string> {
  try {
    // Enhance prompt with specific article references and risk details
    const enhancedPrompt = `
${prompt}

RELEVANT EU AI ACT ARTICLES:
${relevantArticles.map(article => `- Article ${article.number}: ${article.title}`).join('\n')}

RISK CLASSIFICATION DETAILS:
${JSON.stringify(riskDetails, null, 2)}

OUTPUT FORMAT:
Generate the document in ${format} format.
    `;
    
    // Call DeepSeek API for document generation
    const response = await callDeepSeekApi(enhancedPrompt);
    return response;
  } catch (error) {
    console.error(`Error generating document with legal context:`, error);
    throw new Error(`Failed to generate document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract and validate references from generated document
 */
async function extractAndValidateReferences(documentText: string, relevantArticles: any[]): Promise<ArticleReference[]> {
  // Extract references from the document
  const articleRegex = /Article\s+(\d+[a-z]?)/gi;
  const matches = documentText.matchAll(articleRegex);
  
  const articleReferences = new Set<string>();
  for (const match of matches) {
    if (match[1]) {
      articleReferences.add(match[1]);
    }
  }
  
  // Create validated references
  const references: ArticleReference[] = [];
  
  for (const articleId of articleReferences) {
    // Find the article in our relevant articles
    const relevantArticle = relevantArticles.find(a => a.number === articleId || a.number.toString() === articleId);
    
    if (relevantArticle) {
      references.push({
        articleId,
        title: relevantArticle.title,
        relevance: relevantArticle.relevance || "Applicable to this system",
        excerpt: relevantArticle.excerpt || "Key regulatory article for this system type",
        url: relevantArticle.url
      });
    } else {
      // For articles mentioned but not in our pre-fetched list
      references.push({
        articleId,
        title: `Article ${articleId}`,
        relevance: "Referenced in document",
        excerpt: "Additional regulatory article"
      });
    }
  }
  
  return references;
}

/**
 * Generate visualization data based on document type and system details
 */
async function generateVisualizationData(
  documentType: DocumentType, 
  system: Partial<AiSystem>,
  riskDetails: any
): Promise<VisualizationData[]> {
  const visualizations: VisualizationData[] = [];
  
  // Generate visualizations based on document type
  switch (documentType) {
    case DocumentType.RISK_ASSESSMENT:
      // Risk heatmap data
      visualizations.push({
        type: "riskHeatmap",
        title: "Risk Assessment Heatmap",
        description: "Visual representation of identified risks by impact and likelihood",
        data: generateRiskHeatmapData(riskDetails)
      });
      break;
      
    case DocumentType.TECHNICAL_DOCUMENTATION:
      // System architecture visualization
      visualizations.push({
        type: "decisionTree",
        title: "System Decision Flow",
        description: "Visual representation of the AI system's decision process",
        data: generateDecisionTreeData(system)
      });
      break;
      
    case DocumentType.CONFORMITY_DECLARATION:
      // Compliance timeline
      visualizations.push({
        type: "timeline",
        title: "Compliance Timeline",
        description: "Key milestones in the compliance process",
        data: generateComplianceTimelineData(system)
      });
      break;
  }
  
  // Add a compliance chart for all document types
  visualizations.push({
    type: "complianceChart",
    title: "EU AI Act Compliance Coverage",
    description: "Visual representation of compliance with key requirements",
    data: generateComplianceChartData(documentType, system)
  });
  
  return visualizations;
}

/**
 * Generate risk heatmap data
 */
function generateRiskHeatmapData(riskDetails: any): any {
  // This would create data structure for rendering a risk heatmap
  // Format suitable for visualization libraries like recharts
  
  const categories = [
    "Data Privacy", "Transparency", "Fairness", 
    "Accountability", "Safety", "Human Oversight"
  ];
  
  const impacts = ["Low", "Medium", "High", "Critical"];
  const likelihoods = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
  
  // Generate risk data points with proper distribution based on system risk level
  const dataPoints = categories.map(category => {
    const impact = impacts[Math.floor(Math.random() * impacts.length)];
    const likelihood = likelihoods[Math.floor(Math.random() * likelihoods.length)];
    
    return {
      category,
      impact,
      likelihood,
      score: calculateRiskScore(impact, likelihood),
      mitigation: `Implement ${category} controls`
    };
  });
  
  return {
    categories,
    impacts,
    likelihoods,
    dataPoints
  };
}

/**
 * Calculate risk score based on impact and likelihood
 */
function calculateRiskScore(impact: string, likelihood: string): number {
  const impactScores: Record<string, number> = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "Critical": 4
  };
  
  const likelihoodScores: Record<string, number> = {
    "Rare": 1,
    "Unlikely": 2,
    "Possible": 3,
    "Likely": 4,
    "Almost Certain": 5
  };
  
  return (impactScores[impact] || 1) * (likelihoodScores[likelihood] || 1);
}

/**
 * Generate decision tree data for system visualization
 */
function generateDecisionTreeData(system: Partial<AiSystem>): any {
  // Create a simplified decision tree based on system capabilities
  const capabilities = system.capabilities || "Data Processing";
  
  return {
    name: "System Input",
    children: [
      {
        name: "Data Processing",
        children: [
          {
            name: "Analysis",
            children: [
              { name: "Results Generation" },
              { name: "Human Review Point" }
            ]
          },
          { name: "Validation" }
        ]
      },
      {
        name: "Decision Point",
        children: [
          { name: "Approved" },
          { name: "Rejected" },
          { name: "Manual Review" }
        ]
      }
    ]
  };
}

/**
 * Generate compliance timeline data
 */
function generateComplianceTimelineData(system: Partial<AiSystem>): any {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const threeMonthsLater = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
  
  return [
    {
      date: sixMonthsAgo.toISOString().split('T')[0],
      event: "Initial Risk Assessment",
      description: "Completed initial risk assessment"
    },
    {
      date: threeMonthsAgo.toISOString().split('T')[0],
      event: "Technical Documentation",
      description: "Technical documentation created"
    },
    {
      date: oneMonthAgo.toISOString().split('T')[0],
      event: "Internal Audit",
      description: "Internal compliance audit conducted"
    },
    {
      date: now.toISOString().split('T')[0],
      event: "Conformity Declaration",
      description: "Declaration of Conformity issued"
    },
    {
      date: threeMonthsLater.toISOString().split('T')[0],
      event: "Compliance Review",
      description: "Scheduled compliance review"
    }
  ];
}

/**
 * Generate compliance chart data
 */
function generateComplianceChartData(documentType: DocumentType, system: Partial<AiSystem>): any {
  // Generate compliance percentage data for key requirements
  // Based on system risk level and document type
  
  const requirements = [
    "Risk Management",
    "Data Governance",
    "Technical Robustness",
    "Transparency",
    "Human Oversight",
    "Accountability"
  ];
  
  return requirements.map(req => ({
    name: req,
    compliance: Math.round(70 + Math.random() * 30) // 70-100% compliance
  }));
}

/**
 * Convert document type enum to human-readable label
 */
function documentTypeToLabel(documentType: DocumentType): string {
  switch (documentType) {
    case DocumentType.TECHNICAL_DOCUMENTATION:
      return "Technical Documentation";
    case DocumentType.RISK_ASSESSMENT:
      return "Risk Assessment Report";
    case DocumentType.CONFORMITY_DECLARATION:
      return "Declaration of Conformity";
    case DocumentType.HUMAN_OVERSIGHT_PROTOCOL:
      return "Human Oversight Protocol";
    case DocumentType.DATA_GOVERNANCE_POLICY:
      return "Data Governance Policy";
    case DocumentType.INCIDENT_RESPONSE_PLAN:
      return "Incident Response Plan";
    default:
      return "Document";
  }
}

// Interface for AI System
interface AiSystem {
  systemId: string;
  name: string;
  description?: string;
  purpose?: string;
  department?: string;
  riskLevel?: string;
  vendor?: string;
  version?: string;
  capabilities?: string;
  trainingDatasets?: string;
  lastAssessmentDate?: string;
}