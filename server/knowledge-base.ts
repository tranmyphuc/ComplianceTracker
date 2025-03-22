
import { callDeepSeekApi } from "./ai-analysis";

// Sample knowledge base articles
const knowledgeBaseArticles = [
  {
    id: "kb-001",
    title: "EU AI Act Overview",
    category: "regulatory",
    content: `
      # EU AI Act Overview
      
      The EU AI Act is a comprehensive regulatory framework for artificial intelligence systems. 
      It takes a risk-based approach, categorizing AI systems based on their potential harm:
      
      ## Risk Categories
      
      1. **Unacceptable Risk**: Systems posing clear threats to safety, livelihoods, or rights are prohibited.
      2. **High-Risk**: Systems with significant potential for harm require strict compliance measures.
      3. **Limited Risk**: Systems with transparency obligations but fewer requirements than high-risk.
      4. **Minimal Risk**: Systems with minimal regulation, comprising the majority of AI applications.
      
      ## Key Requirements for High-Risk Systems
      
      - Risk management system
      - Data governance measures
      - Technical documentation
      - Record keeping
      - Transparency and provision of information to users
      - Human oversight
      - Accuracy, robustness, and cybersecurity
    `,
    tags: ["overview", "regulation", "compliance", "risk categories"]
  },
  {
    id: "kb-002",
    title: "Risk Assessment Methodology",
    category: "implementation",
    content: `
      # Risk Assessment Methodology
      
      Conducting a thorough risk assessment is crucial for EU AI Act compliance. Follow this methodology:
      
      ## 1. System Classification
      
      Determine if your AI system falls under high-risk categories by checking:
      - Is it used in a critical infrastructure sector?
      - Does it make decisions affecting individuals' rights?
      - Is it used for law enforcement or administration of justice?
      - Does it control essential private or public services?
      
      ## 2. Risk Identification
      
      Identify potential risks across these dimensions:
      - Technical robustness and safety
      - Bias and fairness
      - Privacy and data governance
      - Transparency
      - Human oversight capabilities
      - Societal and environmental impacts
      
      ## 3. Risk Analysis
      
      For each identified risk:
      - Assess likelihood (Low, Medium, High)
      - Evaluate impact severity (Low, Medium, High)
      - Calculate risk level (Likelihood × Impact)
      
      ## 4. Risk Mitigation
      
      Develop specific measures to address each risk:
      - Technical safeguards
      - Procedural controls
      - Documentation requirements
      - Monitoring mechanisms
      
      ## 5. Continuous Monitoring
      
      Establish processes for:
      - Regular risk reassessment
      - Monitoring system performance
      - Incident reporting
      - Compliance validation
    `,
    tags: ["risk assessment", "methodology", "implementation", "high-risk"]
  },
  {
    id: "kb-003",
    title: "Technical Documentation Requirements",
    category: "implementation",
    content: `
      # Technical Documentation Requirements
      
      The EU AI Act requires comprehensive technical documentation for high-risk AI systems.
      
      ## Required Documentation Elements
      
      1. **General Description**
         - System purpose and intended use
         - System architecture and components
         - Hardware specifications
         - Software dependencies and versions
      
      2. **Development Process**
         - Design specifications and methodologies
         - Development procedures and tools
         - Training methodologies (for ML systems)
         - Testing and validation processes
      
      3. **Risk Management**
         - Risk assessment methodology
         - Identified risks and mitigation measures
         - Ongoing monitoring procedures
      
      4. **Data Governance**
         - Data sources and collection methods
         - Data preprocessing techniques
         - Data quality assurance measures
         - Privacy and security safeguards
      
      5. **Performance Metrics**
         - Accuracy measurements
         - Robustness testing results
         - Bias evaluation
         - Explainability measures
      
      6. **Human Oversight**
         - Oversight mechanisms
         - User interface design
         - Training materials for human operators
      
      7. **Change Management**
         - Version control procedures
         - Update mechanisms
         - Post-deployment monitoring
      
      ## Documentation Format
      
      Documentation should be:
      - Comprehensive yet accessible
      - Regularly updated
      - Available in electronic format
      - Provided in EU official languages as required
    `,
    tags: ["documentation", "requirements", "technical", "compliance"]
  },
  {
    id: "kb-004",
    title: "Human Oversight Implementation Guide",
    category: "implementation",
    content: `
      # Human Oversight Implementation Guide
      
      Human oversight is a core requirement for high-risk AI systems under the EU AI Act.
      
      ## Key Elements of Effective Human Oversight
      
      1. **Oversight Design**
         - Integrated from the beginning of system development
         - Appropriate to the system's context and risk level
         - Enables meaningful intervention
      
      2. **Oversight Measures**
         - Real-time monitoring capabilities
         - Override mechanisms
         - Approval workflows for critical decisions
         - Inspection tools for system behavior
      
      3. **Human-AI Interface**
         - Clear presentation of AI-generated information
         - Explainable outputs
         - Uncertainty indicators
         - Alert systems for potential issues
      
      4. **Oversight Personnel**
         - Clearly defined roles and responsibilities
         - Appropriate training and competence
         - Independence from development team
         - Authority to intervene
      
      5. **Documentation Requirements**
         - Detailed oversight procedures
         - Decision logs
         - Intervention records
         - Regular oversight effectiveness reviews
      
      ## Implementation Strategies
      
      - **In-the-loop**: Humans validate every decision before action
      - **On-the-loop**: Humans supervise operation with real-time intervention capability
      - **Over-the-loop**: Humans design constraints and monitor overall performance
      
      Select the appropriate strategy based on risk level, operation speed, and context.
    `,
    tags: ["human oversight", "implementation", "requirements", "strategies"]
  },
  {
    id: "kb-005",
    title: "Compliance Timeline and Deadlines",
    category: "regulatory",
    content: `
      # EU AI Act Compliance Timeline and Deadlines
      
      Understanding the implementation timeline is crucial for compliance planning.
      
      ## Key Dates
      
      - **Publication**: [Publication date]
      - **Entry into Force**: 20 days after publication
      - **General Application**: 24 months after entry into force
      
      ## Phased Implementation
      
      1. **Immediate Prohibitions**: [Date]
         - Certain AI systems considered an unacceptable risk
      
      2. **First Phase**: [Date]
         - Governance structures established
         - Harmonized standards development begins
      
      3. **Second Phase**: [Date]
         - Requirements for high-risk AI systems become applicable
         - Conformity assessment procedures begin
      
      4. **Full Implementation**: [Date]
         - All provisions fully applicable
         - Complete enforcement mechanisms in place
      
      ## Grace Periods
      
      - **Existing Systems**: Systems placed on the market before application date have a transitional period of [X] months
      - **General Purpose AI**: Specific timelines for general purpose AI systems [details]
      
      ## Compliance Planning
      
      Recommended organizational timeline:
      
      1. **Assessment Phase** (Immediate)
         - Inventory all AI systems
         - Perform initial risk classification
      
      2. **Gap Analysis** (3-6 months)
         - Evaluate current compliance status
         - Identify required changes
      
      3. **Implementation** (6-18 months)
         - Develop documentation
         - Implement technical requirements
         - Establish governance procedures
      
      4. **Validation** (18-24 months)
         - Conduct conformity assessments
         - Perform final compliance checks
    `,
    tags: ["timeline", "deadlines", "compliance planning", "implementation"]
  }
];

/**
 * Get all knowledge base articles
 */
export function getAllArticles(): any[] {
  return knowledgeBaseArticles.map(article => ({
    id: article.id,
    title: article.title,
    category: article.category,
    tags: article.tags,
    // Exclude content to reduce payload size
  }));
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): any[] {
  return knowledgeBaseArticles
    .filter(article => article.category.toLowerCase() === category.toLowerCase())
    .map(article => ({
      id: article.id,
      title: article.title,
      category: article.category,
      tags: article.tags
    }));
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): any {
  return knowledgeBaseArticles.find(article => article.id === id);
}

/**
 * Search knowledge base articles
 */
export function searchKnowledgeBase(query: string): any[] {
  query = query.toLowerCase();
  
  return knowledgeBaseArticles
    .filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    )
    .map(article => ({
      id: article.id,
      title: article.title,
      category: article.category,
      tags: article.tags,
      // Include a snippet of content that matches the query
      snippet: extractSnippet(article.content, query)
    }));
}

/**
 * Extract a relevant snippet from content based on query
 */
function extractSnippet(content: string, query: string): string {
  const maxSnippetLength = 200;
  const lowerContent = content.toLowerCase();
  const queryIndex = lowerContent.indexOf(query);
  
  if (queryIndex === -1) {
    // Query not found in content, return beginning of content
    return content.substring(0, maxSnippetLength) + "...";
  }
  
  // Calculate snippet start and end positions
  const snippetStart = Math.max(0, queryIndex - 100);
  const snippetEnd = Math.min(content.length, queryIndex + query.length + 100);
  
  // Extract and format snippet
  let snippet = content.substring(snippetStart, snippetEnd);
  
  // Add ellipsis if needed
  if (snippetStart > 0) {
    snippet = "..." + snippet;
  }
  if (snippetEnd < content.length) {
    snippet = snippet + "...";
  }
  
  return snippet;
}

/**
 * Ask a question to the compliance AI
 */
export async function askComplianceAI(question: string): Promise<string> {
  try {
    // Create a comprehensive prompt for the AI
    const prompt = `
      You are an expert on the EU AI Act and AI compliance regulations. Please answer the following question
      with accurate, helpful information based on the latest regulatory knowledge:
      
      Question: ${question}
      
      Provide a clear, concise answer that is technically accurate and helpful for compliance professionals.
      Include references to specific articles or sections of the EU AI Act when relevant.
    `;
    
    const response = await callDeepSeekApi(prompt);
    return response;
  } catch (error) {
    console.error("Error querying compliance AI:", error);
    return "I'm sorry, I encountered an error while trying to answer your question. Please try again later.";
  }
}


import { callDeepSeekApi } from './ai-analysis';

// Knowledge base article interface
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'risk_assessment' | 'documentation' | 'governance' | 'technical' | 'implementation';
  relevantArticles: string[];
  tags: string[];
  lastUpdated: Date;
}

// Mock knowledge base for development
const knowledgeBase: KnowledgeArticle[] = [
  {
    id: 'kb_general_overview',
    title: 'EU AI Act Overview',
    content: `
      # EU AI Act Overview
      
      The EU AI Act is the world's first comprehensive legal framework for artificial intelligence. 
      It establishes a risk-based approach to regulating AI systems based on the level of risk they pose.
      
      ## Risk Categories
      
      - **Unacceptable Risk**: AI systems that pose a clear threat to people are prohibited
      - **High Risk**: AI systems subject to strict obligations before they can be put on the market
      - **Limited Risk**: Systems with specific transparency obligations
      - **Minimal/No Risk**: Systems with no specific obligations
      
      ## Key Implementation Dates
      
      - Official Journal Publication: Q2 2024 (expected)
      - Entry into Force: 20 days after publication
      - General Application: 24 months after entry into force
      - Prohibition provisions: 6 months after entry into force
      - General purpose AI rules: 12 months after entry into force
    `,
    category: 'general',
    relevantArticles: ['Article 5', 'Article 6', 'Article 7', 'Article 8'],
    tags: ['overview', 'risk categories', 'timeline'],
    lastUpdated: new Date('2024-05-15')
  },
  {
    id: 'kb_risk_assessment',
    title: 'Conducting Risk Assessments',
    content: `
      # Conducting Risk Assessments Under the EU AI Act
      
      Article 9 of the EU AI Act requires providers of high-risk AI systems to establish, implement, 
      document, and maintain a risk management system.
      
      ## Key Components of Risk Assessment
      
      1. **Identification and Analysis**: Identify and analyze known and foreseeable risks
      2. **Risk Estimation**: Estimate and evaluate risks that may emerge when the system is used
      3. **Risk Evaluation**: Evaluate risks in expected use and reasonably foreseeable misuse
      4. **Risk Management Measures**: Adopt suitable measures to eliminate or reduce risks
      
      ## Risk Management Process
      
      The risk management process should be iterative and continuous throughout the lifecycle of the AI system.
      
      ## Documentation Requirements
      
      Risk management documentation must include:
      - Description of the system
      - Known or foreseeable risks
      - Risk data used for assessment
      - Risk mitigation measures
      - Testing results and validation
    `,
    category: 'risk_assessment',
    relevantArticles: ['Article 9'],
    tags: ['risk management', 'documentation', 'high-risk'],
    lastUpdated: new Date('2024-05-10')
  },
  // Add more knowledge articles...
];

/**
 * Get all knowledge base articles
 */
export function getAllArticles(): KnowledgeArticle[] {
  return knowledgeBase;
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): KnowledgeArticle[] {
  return knowledgeBase.filter(article => article.category === category);
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): KnowledgeArticle | undefined {
  return knowledgeBase.find(article => article.id === id);
}

/**
 * Search knowledge base
 */
export function searchKnowledgeBase(query: string): KnowledgeArticle[] {
  const normalizedQuery = query.toLowerCase();
  return knowledgeBase.filter(article => 
    article.title.toLowerCase().includes(normalizedQuery) ||
    article.content.toLowerCase().includes(normalizedQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * Ask AI about compliance topics
 */
export async function askComplianceAI(question: string): Promise<string> {
  const prompt = `
    As an EU AI Act compliance expert, please answer the following question:
    
    ${question}
    
    Provide a clear, authoritative answer based on the EU AI Act, focusing on practical implementation advice.
  `;
  
  try {
    const response = await callDeepSeekApi(prompt);
    return response;
  } catch (error) {
    console.error('Error asking compliance AI:', error);
    return 'Sorry, I could not process your question. Please try again later.';
  }
}
