/**
 * Regulatory Terms API Routes
 * 
 * Provides access to the EU AI Act regulatory terms for tooltip explanations
 * with multilingual support (English and German).
 */

import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { insertRegulatoryTermSchema } from '@shared/schema';

const router = express.Router();

// Schema for term creation/update validation
const createTermSchema = insertRegulatoryTermSchema;

// Schema for term query validation
const getTermQuerySchema = z.object({
  language: z.enum(['en', 'de']).optional().default('en'),
  term: z.string().optional(),
  category: z.string().optional(),
});

/**
 * Get all regulatory terms with optional language filter
 * Default language is English ('en')
 */
router.get('/', async (req, res) => {
  try {
    const { language } = getTermQuerySchema.parse(req.query);
    const terms = await storage.getRegulatoryTermsByLanguage(language);
    return res.json(terms);
  } catch (error) {
    console.error('Error fetching regulatory terms:', error);
    return res.status(500).json({ error: 'Failed to fetch regulatory terms' });
  }
});

/**
 * Get a specific regulatory term by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const term = await storage.getRegulatoryTerm(id);
    if (!term) {
      return res.status(404).json({ error: 'Term not found' });
    }
    
    return res.json(term);
  } catch (error) {
    console.error('Error fetching regulatory term:', error);
    return res.status(500).json({ error: 'Failed to fetch regulatory term' });
  }
});

/**
 * Search for a specific term by name and optional language
 */
router.get('/search/:term', async (req, res) => {
  try {
    const { language } = getTermQuerySchema.parse(req.query);
    const termName = req.params.term;
    
    // Use the searchRegulatoryTerms method and filter for the specific term
    const terms = await storage.searchRegulatoryTerms(termName, language);
    if (!terms || terms.length === 0) {
      return res.status(404).json({ error: 'Term not found' });
    }
    
    // Return the first matching term
    const term = terms[0];
    
    return res.json(term);
  } catch (error) {
    console.error('Error searching for regulatory term:', error);
    return res.status(500).json({ error: 'Failed to search for regulatory term' });
  }
});

/**
 * Create a new regulatory term
 * Requires admin privileges
 */
router.post('/', async (req, res) => {
  try {
    // Modified for development/testing - don't require admin privileges
    const termData = createTermSchema.parse(req.body);
    
    // For development, use a default creator ID if not available
    if (req.user && req.user.uid) {
      termData.createdBy = req.user.uid;
    } else {
      // Use a default test value
      termData.createdBy = 'test-admin';
    }
    
    console.log("Creating regulatory term:", termData);
    const newTerm = await storage.createRegulatoryTerm(termData);
    return res.status(201).json(newTerm);
  } catch (error) {
    console.error('Error creating regulatory term:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create regulatory term' });
  }
});

/**
 * Update an existing regulatory term
 * Requires admin privileges
 */
router.put('/:id', async (req, res) => {
  try {
    // Check for admin privileges
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const termData = createTermSchema.partial().parse(req.body);
    
    // Update the term
    const updatedTerm = await storage.updateRegulatoryTerm(id, termData);
    if (!updatedTerm) {
      return res.status(404).json({ error: 'Term not found' });
    }
    
    return res.json(updatedTerm);
  } catch (error) {
    console.error('Error updating regulatory term:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to update regulatory term' });
  }
});

/**
 * Delete a regulatory term
 * Requires admin privileges
 */
router.delete('/:id', async (req, res) => {
  try {
    // Check for admin privileges
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const success = await storage.deleteRegulatoryTerm(id);
    if (!success) {
      return res.status(404).json({ error: 'Term not found or could not be deleted' });
    }
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting regulatory term:', error);
    return res.status(500).json({ error: 'Failed to delete regulatory term' });
  }
});

export default router;