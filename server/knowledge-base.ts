
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
