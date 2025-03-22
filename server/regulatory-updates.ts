
import { callDeepSeekApi } from './ai-analysis';

// Regulatory update interface
export interface RegulatoryUpdate {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  impactLevel: 'high' | 'medium' | 'low';
  relevantArticles: string[];
  actionRequired: boolean;
  url?: string;
}

// Mock regulatory updates for development
const mockUpdates: RegulatoryUpdate[] = [
  {
    id: '1',
    title: 'EU AI Act Final Text Published',
    description: 'The final text of the EU AI Act has been published in the Official Journal of the European Union, starting the implementation timeline.',
    source: 'European Commission',
    date: '2024-06-01',
    impactLevel: 'high',
    relevantArticles: ['All'],
    actionRequired: true,
    url: 'https://ec.europa.eu/ai-act'
  },
  {
    id: '2',
    title: 'Guidance on Risk Assessment Methodology',
    description: 'The European Commission has published new guidance on risk assessment methodologies for high-risk AI systems.',
    source: 'European Commission',
    date: '2024-05-15',
    impactLevel: 'medium',
    relevantArticles: ['Article 9'],
    actionRequired: true,
    url: 'https://ec.europa.eu/ai-act/guidance'
  },
  {
    id: '3',
    title: 'Updated Technical Standards for Conformity Assessment',
    description: 'The European standardization bodies have released new technical standards for conformity assessment of high-risk AI systems.',
    source: 'CEN-CENELEC',
    date: '2024-04-20',
    impactLevel: 'high',
    relevantArticles: ['Article 40', 'Article 41'],
    actionRequired: true,
    url: 'https://www.cencenelec.eu/standards'
  },
  {
    id: '4',
    title: 'Implementation Timeline Clarification',
    description: 'The Commission has provided clarification on the phased implementation timeline for different requirements of the EU AI Act.',
    source: 'European Commission',
    date: '2024-03-10',
    impactLevel: 'medium',
    relevantArticles: ['Article 85'],
    actionRequired: false,
    url: 'https://ec.europa.eu/ai-act/timeline'
  },
  {
    id: '5',
    title: 'Guidance on Human Oversight Requirements',
    description: 'New guidance has been published on implementing effective human oversight measures for high-risk AI systems.',
    source: 'European Union Agency for Cybersecurity',
    date: '2024-02-25',
    impactLevel: 'medium',
    relevantArticles: ['Article 14'],
    actionRequired: true,
    url: 'https://www.enisa.europa.eu/ai-oversight'
  }
];

/**
 * Get recent regulatory updates
 */
export async function getRecentUpdates(limit: number = 5): Promise<RegulatoryUpdate[]> {
  // In a production environment, this would fetch from an API or database
  // For development, return mock data
  return mockUpdates.slice(0, limit);
}

/**
 * Get specific regulatory update by ID
 */
export function getUpdateById(id: string): RegulatoryUpdate | undefined {
  return mockUpdates.find(update => update.id === id);
}

/**
 * Analyze impact of regulatory update on an organization's AI systems
 */
export async function analyzeRegulatoryImpact(updateId: string, systemIds: string[]): Promise<any> {
  const update = getUpdateById(updateId);
  
  if (!update) {
    throw new Error('Regulatory update not found');
  }
  
  const prompt = `
    As an EU AI Act compliance expert, analyze the impact of the following regulatory update 
    on an organization's AI systems:
    
    Update: ${update.title}
    Description: ${update.description}
    Relevant Articles: ${update.relevantArticles.join(', ')}
    
    Provide an analysis of:
    1. Key implications for AI systems
    2. Required actions for compliance
    3. Suggested timeline for implementation
    4. Potential risks of non-compliance
    
    Output your analysis in JSON format with these sections as fields.
  `;
  
  try {
    const response = await callDeepSeekApi(prompt);
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      // If parsing fails, return the raw response with basic structure
      return {
        implications: response,
        requiredActions: [],
        timeline: "As soon as possible",
        nonComplianceRisks: []
      };
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('Error analyzing regulatory impact:', error);
    return {
      implications: "Unable to analyze impact at this time.",
      requiredActions: ["Review update manually"],
      timeline: "As soon as possible",
      nonComplianceRisks: ["Unknown"]
    };
  }
}

/**
 * Subscribe to regulatory update notifications
 */
export function subscribeToUpdates(email: string, updateTypes: string[]): boolean {
  // In a production environment, this would store subscription preferences
  console.log(`Subscribed ${email} to updates: ${updateTypes.join(', ')}`);
  return true;
}
