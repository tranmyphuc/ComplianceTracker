/**
 * AI Features API Routes
 * Routes for accessing AI-powered features in the application
 */

import express from 'express';
import { db } from '../db';
import { aiSystems, documentTemplates, riskAssessments } from '@shared/schema';
import { checkForRegulatoryUpdates, getSystemImpactAnalysis, generateComplianceTipUpdates } from '../ai-regulatory-updates';
import { generateDetailedRiskAssessment, analyzeSystemRiskCategory, analyzeSystemDescription, identifyHighRiskElements } from '../ai-risk-assessment';
import { suggestTemplates, createAiGeneratedTemplate, enhanceExistingTemplate } from '../ai-template-generator';
import { eq } from 'drizzle-orm';

// Create router
const router = express.Router();

// Authorization middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // For now, we'll allow all requests in development
  // In production, we would check for valid authentication
  next();
};

/**
 * GET /api/ai/regulatory-updates
 * Get recent regulatory updates with AI analysis
 */
router.get('/regulatory-updates', requireAuth, async (_req, res) => {
  try {
    const result = await checkForRegulatoryUpdates();
    res.json(result);
  } catch (error) {
    console.error('Error fetching regulatory updates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch regulatory updates' 
    });
  }
});

/**
 * GET /api/ai/regulatory-updates/tips
 * Get AI-generated compliance tips based on recent updates
 */
router.get('/regulatory-updates/tips', requireAuth, async (_req, res) => {
  try {
    const result = await generateComplianceTipUpdates();
    res.json(result);
  } catch (error) {
    console.error('Error generating compliance tips:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate compliance tips' 
    });
  }
});

/**
 * GET /api/ai/regulatory-updates/:updateId/impact/:systemId
 * Get impact analysis of a regulatory update for a specific AI system
 */
router.get('/regulatory-updates/:updateId/impact/:systemId', requireAuth, async (req, res) => {
  try {
    const { updateId, systemId } = req.params;
    const result = await getSystemImpactAnalysis(systemId, updateId);
    res.json(result);
  } catch (error) {
    console.error('Error fetching impact analysis:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch impact analysis' 
    });
  }
});

/**
 * POST /api/ai/risk-assessment/:systemId
 * Generate AI risk assessment for a specific system
 */
router.post('/risk-assessment/:systemId', requireAuth, async (req, res) => {
  try {
    const { systemId } = req.params;
    
    // Get the system from the database
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId));
    
    if (!system) {
      return res.status(404).json({ 
        success: false, 
        message: 'AI system not found' 
      });
    }
    
    const result = await generateDetailedRiskAssessment(system);
    res.json(result);
  } catch (error) {
    console.error('Error generating risk assessment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate risk assessment' 
    });
  }
});

/**
 * POST /api/ai/risk-category/:systemId
 * Analyze risk category for a specific system
 */
router.post('/risk-category/:systemId', requireAuth, async (req, res) => {
  try {
    const { systemId } = req.params;
    
    // Get the system from the database
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId));
    
    if (!system) {
      return res.status(404).json({ 
        success: false, 
        message: 'AI system not found' 
      });
    }
    
    const result = await analyzeSystemRiskCategory(system);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing risk category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze risk category' 
    });
  }
});

/**
 * POST /api/ai/analyze-description
 * Analyze a text description to identify potential risks
 */
router.post('/analyze-description', requireAuth, async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid description is required' 
      });
    }
    
    const result = await analyzeSystemDescription(description);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing description:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze description' 
    });
  }
});

/**
 * POST /api/ai/high-risk-elements/:systemId
 * Identify high-risk elements in a specific system
 */
router.post('/high-risk-elements/:systemId', requireAuth, async (req, res) => {
  try {
    const { systemId } = req.params;
    
    // Get the system from the database
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId));
    
    if (!system) {
      return res.status(404).json({ 
        success: false, 
        message: 'AI system not found' 
      });
    }
    
    const result = await identifyHighRiskElements(system);
    res.json(result);
  } catch (error) {
    console.error('Error identifying high-risk elements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to identify high-risk elements' 
    });
  }
});

/**
 * GET /api/ai/template-suggestions/:systemId
 * Get AI-powered template suggestions for a specific system
 */
router.get('/template-suggestions/:systemId', requireAuth, async (req, res) => {
  try {
    const { systemId } = req.params;
    
    // Get the system from the database
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId));
    
    if (!system) {
      return res.status(404).json({ 
        success: false, 
        message: 'AI system not found' 
      });
    }
    
    // Get the latest risk assessment for this system if available
    const [assessment] = await db
      .select()
      .from(riskAssessments)
      .where(eq(riskAssessments.systemId, systemId))
      .orderBy(riskAssessments.createdAt);
    
    const result = await suggestTemplates(system, assessment);
    res.json(result);
  } catch (error) {
    console.error('Error getting template suggestions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get template suggestions' 
    });
  }
});

/**
 * POST /api/ai/generate-template/:systemId
 * Create a new AI-generated template for a specific system
 */
router.post('/generate-template/:systemId', requireAuth, async (req, res) => {
  try {
    const { systemId } = req.params;
    const { templateType, name } = req.body;
    
    if (!templateType || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Template type and name are required' 
      });
    }
    
    // Get the system from the database
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId));
    
    if (!system) {
      return res.status(404).json({ 
        success: false, 
        message: 'AI system not found' 
      });
    }
    
    // Get the latest risk assessment for this system if available
    const [assessment] = await db
      .select()
      .from(riskAssessments)
      .where(eq(riskAssessments.systemId, systemId))
      .orderBy(riskAssessments.createdAt);
    
    const result = await createAiGeneratedTemplate(templateType, name, system, assessment);
    res.json(result);
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate template' 
    });
  }
});

/**
 * POST /api/ai/enhance-template/:templateId/:systemId
 * Enhance an existing template for a specific system
 */
router.post('/enhance-template/:templateId/:systemId', requireAuth, async (req, res) => {
  try {
    const { templateId, systemId } = req.params;
    
    // Get the system from the database
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId));
    
    if (!system) {
      return res.status(404).json({ 
        success: false, 
        message: 'AI system not found' 
      });
    }
    
    // Check if the template exists
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.templateId, templateId));
    
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }
    
    // Get the latest risk assessment for this system if available
    const [assessment] = await db
      .select()
      .from(riskAssessments)
      .where(eq(riskAssessments.systemId, systemId))
      .orderBy(riskAssessments.createdAt);
    
    const result = await enhanceExistingTemplate(templateId, system, assessment);
    res.json(result);
  } catch (error) {
    console.error('Error enhancing template:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to enhance template' 
    });
  }
});

export default router;