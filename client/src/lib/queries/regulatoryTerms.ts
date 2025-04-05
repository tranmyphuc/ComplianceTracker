/**
 * Regulatory Terms Queries
 * API functions for fetching multilingual regulatory terms from the backend
 */
import { queryClient } from '@/lib/queryClient';

/**
 * Type definitions for regulatory terms
 */
export interface RegulatoryTerm {
  id: number;
  termId: string;
  term: string;
  definition: string;
  language: string;
  category?: string;
  importance?: string;
  source?: string;
  articleReference?: string;
  createdAt: string;
  updatedAt?: string | null;
  createdBy: string;
  isVerified: boolean;
  contextExample?: string;
  relatedTerms?: string[];
  metadata?: Record<string, any> | null;
}

/**
 * Fetch all regulatory terms with optional language filter
 * Default language is English (en)
 */
export async function fetchRegulatoryTerms(language: string = 'en'): Promise<RegulatoryTerm[]> {
  const response = await fetch(`/api/regulatory-terms?language=${language}`);
  if (!response.ok) {
    throw new Error('Failed to fetch regulatory terms');
  }
  return await response.json();
}

/**
 * Search for regulatory terms by text
 * Returns terms that match the search text in the given language
 * Default language is English (en)
 */
export async function searchRegulatoryTerms(
  searchText: string,
  language: string = 'en'
): Promise<RegulatoryTerm[]> {
  const response = await fetch(`/api/regulatory-terms/search/${encodeURIComponent(searchText)}?language=${language}`);
  if (!response.ok) {
    throw new Error('Failed to search regulatory terms');
  }
  const data = await response.json();
  // The API returns a single term, but we want to handle it as an array for consistency
  return Array.isArray(data) ? data : [data];
}

/**
 * Fetch a regulatory term by term name
 * Used to get the exact definition for a specific term
 */
export async function getRegulatoryTermByName(
  termName: string,
  language: string = 'en'
): Promise<RegulatoryTerm | null> {
  try {
    const terms = await searchRegulatoryTerms(termName, language);
    // Find exact match or close match
    const exactMatch = terms.find(t => t.term.toLowerCase() === termName.toLowerCase());
    if (exactMatch) return exactMatch;
    
    // If no exact match, return the first result
    return terms.length > 0 ? terms[0] : null;
  } catch (error) {
    console.error('Error getting regulatory term:', error);
    return null;
  }
}

/**
 * Invalidate regulatory terms cache
 * Call this after creating, updating, or deleting terms
 */
export function invalidateRegulatoryTermsCache() {
  queryClient.invalidateQueries({ queryKey: ['/api/regulatory-terms'] });
}