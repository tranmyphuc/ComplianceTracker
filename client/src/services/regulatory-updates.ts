import axios from 'axios';

// Types for regulatory updates
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
  category?: string;
}

// Interface for the compliance tip updates
export interface ComplianceTipUpdate {
  id: string;
  title: string;
  content: string;
  category: 'risk' | 'documentation' | 'governance' | 'implementation' | 'audit' | 'general';
  relevantArticles: string[];
  learnMoreLink?: string;
  officialSourceUrl: string;
  lastUpdated: string;
}

/**
 * Fetch the latest regulatory updates from the EU AI Act official sources
 * This function calls our backend API which aggregates updates from multiple sources
 */
export async function fetchLatestRegulatoryUpdates(limit: number = 5): Promise<RegulatoryUpdate[]> {
  try {
    const response = await axios.get(`/api/regulatory/updates?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching regulatory updates:', error);
    return [];
  }
}

/**
 * Fetch updates for compliance tips
 * This keeps our compliance tips current with the latest regulatory changes
 */
export async function fetchComplianceTipUpdates(): Promise<ComplianceTipUpdate[]> {
  try {
    const response = await axios.get('/api/regulatory/tip-updates');
    return response.data;
  } catch (error) {
    console.error('Error fetching compliance tip updates:', error);
    return [];
  }
}

/**
 * Check if there are any available updates for the compliance tips
 * Returns the number of available updates
 */
export async function checkForComplianceTipUpdates(): Promise<number> {
  try {
    const response = await axios.get('/api/regulatory/tip-updates/count');
    return response.data.count;
  } catch (error) {
    console.error('Error checking for compliance tip updates:', error);
    return 0;
  }
}

/**
 * Subscribe to receive notifications about regulatory updates
 */
export async function subscribeToRegulatoryUpdates(
  email: string, 
  updateTypes: string[] = ['all']
): Promise<boolean> {
  try {
    await axios.post('/api/regulatory/subscribe', { email, updateTypes });
    return true;
  } catch (error) {
    console.error('Error subscribing to regulatory updates:', error);
    return false;
  }
}

/**
 * Generate a report of current compliance status against the latest regulatory requirements
 */
export async function generateComplianceReport(systemIds: string[] = []): Promise<any> {
  try {
    const response = await axios.post('/api/regulatory/compliance-report', { systemIds });
    return response.data;
  } catch (error) {
    console.error('Error generating compliance report:', error);
    return null;
  }
}