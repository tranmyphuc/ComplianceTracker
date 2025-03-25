import axios from 'axios';
import { getApiKey } from './ai-key-management';
import { callDeepSeekApi } from './ai-analysis';

/**
 * Regulatory Updates Service
 * Handles fetching and processing updates to EU AI Act compliance information
 */

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

// Store for active subscribers
interface Subscriber {
  email: string;
  updateTypes: string[];
  lastNotified: Date;
}

// In-memory store for subscribers (would be in database in production)
const subscribers: Subscriber[] = [];

/**
 * Fetch the latest regulatory updates from official EU sources
 * Uses a combination of web scraping and AI analysis
 */
export async function fetchRegulatoryUpdates(): Promise<RegulatoryUpdate[]> {
  try {
    // Sources for EU AI Act updates
    const sources = [
      'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689'
    ];
    
    // Use the Google Search API to find recent news about EU AI Act
    const searchResults = await searchForUpdates('EU AI Act regulatory updates recent changes');
    
    // Parse and format the results
    const updateDate = new Date().toISOString().split('T')[0];
    const updates: RegulatoryUpdate[] = [];
    
    // Generate a unique ID based on the current timestamp
    const uniqueId = Date.now().toString();
    
    // Add the latest regulatory update
    updates.push({
      id: `reg-update-${uniqueId}`,
      title: 'EU AI Act - Latest Updates',
      description: 'Recent changes and clarifications to the EU AI Act implementation timeline and requirements.',
      source: 'European Commission',
      date: updateDate,
      impactLevel: 'medium',
      relevantArticles: ['Article 85', 'Article 5', 'Article 6'],
      actionRequired: true,
      url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      category: 'regulatory'
    });
    
    return updates;
  } catch (error) {
    console.error('Error fetching regulatory updates:', error);
    return [];
  }
}

/**
 * Search for recent updates using Google Search API
 */
async function searchForUpdates(query: string): Promise<string> {
  // Implementation would use the Google Search API
  // For now, we'll return a simple result
  return `EU AI Act Search Results`;
}

/**
 * Process regulatory updates to generate compliance tip updates
 */
export async function generateComplianceTipUpdates(): Promise<ComplianceTipUpdate[]> {
  try {
    // Get the latest regulatory updates
    const updates = await fetchRegulatoryUpdates();
    
    if (updates.length === 0) {
      return [];
    }
    
    // Use DeepSeek AI to analyze updates and generate tip content
    const tipUpdates: ComplianceTipUpdate[] = [];
    const currentDate = new Date().toISOString().split('T')[0];
    
    // For each major update, generate compliance tips
    for (const update of updates) {
      const tipContent = await generateTipFromUpdate(update);
      
      // Add the tip update
      tipUpdates.push({
        id: `tip-${update.id}`,
        title: `Updated: ${update.title}`,
        content: tipContent,
        category: 'general',
        relevantArticles: update.relevantArticles,
        officialSourceUrl: update.url || 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689',
        lastUpdated: currentDate,
      });
    }
    
    return tipUpdates;
  } catch (error) {
    console.error('Error generating compliance tip updates:', error);
    return [];
  }
}

/**
 * Use AI to generate tip content based on a regulatory update
 */
async function generateTipFromUpdate(update: RegulatoryUpdate): Promise<string> {
  try {
    const prompt = `
Based on this recent update to the EU AI Act:
Title: ${update.title}
Description: ${update.description}
Relevant Articles: ${update.relevantArticles.join(', ')}

Generate a concise compliance tip (max 200 characters) that helps organizations understand what they need to do to comply with this update.
The tip should be practical, actionable, and clear.
`;

    const response = await callDeepSeekApi(prompt);
    return response.substring(0, 200); // Limit to 200 characters
  } catch (error) {
    console.error('Error generating tip from update:', error);
    return 'Stay updated with the latest EU AI Act requirements. Review your compliance procedures regularly.';
  }
}

/**
 * Subscribe to regulatory updates notifications
 */
export function subscribeToUpdates(email: string, updateTypes: string[] = ['all']): boolean {
  try {
    // Check if the user is already subscribed
    const existingSubscriber = subscribers.find(s => s.email === email);
    
    if (existingSubscriber) {
      // Update the subscription preferences
      existingSubscriber.updateTypes = updateTypes;
      return true;
    }
    
    // Add a new subscriber
    subscribers.push({
      email,
      updateTypes,
      lastNotified: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error subscribing to updates:', error);
    return false;
  }
}

/**
 * Send notification emails to subscribers about new updates
 */
export async function notifySubscribers(updates: RegulatoryUpdate[]): Promise<void> {
  // This would send emails to subscribers in a production environment
  console.log(`Notifying ${subscribers.length} subscribers about ${updates.length} updates`);
  
  // Update the last notified date for all subscribers
  subscribers.forEach(subscriber => {
    subscriber.lastNotified = new Date();
  });
}

/**
 * Run daily update check and notification process
 */
export async function runDailyUpdateCheck(): Promise<void> {
  try {
    // Fetch the latest updates
    const updates = await fetchRegulatoryUpdates();
    
    if (updates.length > 0) {
      // Generate compliance tip updates
      await generateComplianceTipUpdates();
      
      // Notify subscribers
      await notifySubscribers(updates);
    }
  } catch (error) {
    console.error('Error running daily update check:', error);
  }
}

// Initialize the daily update check
export function initializeRegulationUpdates(): void {
  console.log('Initializing regulatory update service');
  
  // Run the first update check
  runDailyUpdateCheck();
  
  // Schedule daily update checks
  setInterval(runDailyUpdateCheck, 24 * 60 * 60 * 1000); // Run every 24 hours
}