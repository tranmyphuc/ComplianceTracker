import { Router, Request, Response } from 'express';
import {
  fetchRegulatoryUpdates,
  generateComplianceTipUpdates,
  subscribeToUpdates,
  RegulatoryUpdate,
  ComplianceTipUpdate
} from '../regulatory-service';

const router = Router();

/**
 * Get recent regulatory updates
 * GET /api/regulatory/updates
 */
router.get('/updates', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const updates = await fetchRegulatoryUpdates();
    res.json(updates.slice(0, limit));
  } catch (error) {
    console.error('Error fetching regulatory updates:', error);
    res.status(500).json({ error: 'Failed to fetch regulatory updates' });
  }
});

/**
 * Get compliance tip updates
 * GET /api/regulatory/tip-updates
 */
router.get('/tip-updates', async (req: Request, res: Response) => {
  try {
    const updates = await generateComplianceTipUpdates();
    res.json(updates);
  } catch (error) {
    console.error('Error fetching compliance tip updates:', error);
    res.status(500).json({ error: 'Failed to fetch compliance tip updates' });
  }
});

/**
 * Get count of available compliance tip updates
 * GET /api/regulatory/tip-updates/count
 */
router.get('/tip-updates/count', async (req: Request, res: Response) => {
  try {
    const updates = await generateComplianceTipUpdates();
    res.json({ count: updates.length });
  } catch (error) {
    console.error('Error checking for compliance tip updates:', error);
    res.status(500).json({ error: 'Failed to check for compliance tip updates' });
  }
});

/**
 * Subscribe to regulatory updates
 * POST /api/regulatory/subscribe
 */
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, updateTypes } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const success = subscribeToUpdates(email, updateTypes || ['all']);
    
    if (success) {
      res.json({ success: true, message: 'Successfully subscribed to regulatory updates' });
    } else {
      res.status(500).json({ error: 'Failed to subscribe to regulatory updates' });
    }
  } catch (error) {
    console.error('Error subscribing to regulatory updates:', error);
    res.status(500).json({ error: 'Failed to subscribe to regulatory updates' });
  }
});

/**
 * Generate compliance report
 * POST /api/regulatory/compliance-report
 */
router.post('/compliance-report', async (req: Request, res: Response) => {
  try {
    const { systemIds } = req.body;
    
    // In a real implementation, this would generate a compliance report
    // for the specified systems based on the latest regulatory requirements
    
    res.json({
      generatedDate: new Date().toISOString(),
      overallCompliance: 85,
      systems: systemIds.map((id: string) => ({
        systemId: id,
        complianceScore: Math.floor(Math.random() * 30) + 70,
        gaps: [],
        recommendations: []
      }))
    });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({ error: 'Failed to generate compliance report' });
  }
});

export const regulatoryRoutes = router;