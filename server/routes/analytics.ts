
import { Router } from 'express';
import { storage } from '../storage';
import { identifyTopRisks } from '../risk-management';

const router = Router();

// Get compliance trend data
router.get('/compliance-trend', async (req, res) => {
  try {
    const { timeRange = '6months' } = req.query;
    
    // In a real implementation, this would query database for historical compliance scores
    // Mock data for demonstration purposes
    const mockData = [
      { month: 'Jan', score: 45 },
      { month: 'Feb', score: 52 },
      { month: 'Mar', score: 58 },
      { month: 'Apr', score: 63 },
      { month: 'May', score: 70 },
      { month: 'Jun', score: 79 },
    ];
    
    res.json(mockData);
  } catch (error) {
    console.error('Error fetching compliance trend data:', error);
    res.status(500).json({ error: 'Failed to fetch compliance trend data' });
  }
});

// Get risk distribution data
router.get('/risk-distribution', async (req, res) => {
  try {
    // In a real implementation, this would aggregate systems by risk level
    const systems = await storage.getAllSystems();
    
    const riskDistribution = {
      'High Risk': systems.filter(s => s.riskLevel === 'high').length,
      'Medium Risk': systems.filter(s => s.riskLevel === 'medium').length,
      'Low Risk': systems.filter(s => s.riskLevel === 'low').length,
      'Minimal Risk': systems.filter(s => s.riskLevel === 'minimal').length,
    };
    
    const formattedData = Object.entries(riskDistribution).map(([name, value]) => ({ name, value }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching risk distribution data:', error);
    res.status(500).json({ error: 'Failed to fetch risk distribution data' });
  }
});

// Get systems by category
router.get('/systems-by-category', async (req, res) => {
  try {
    const systems = await storage.getAllSystems();
    
    // Group systems by category
    const categoryCounts = systems.reduce((acc, system) => {
      const category = system.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    const formattedData = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching systems by category:', error);
    res.status(500).json({ error: 'Failed to fetch systems by category' });
  }
});

// Get organizational readiness data
router.get('/organizational-readiness', async (req, res) => {
  try {
    // In a real implementation, this would fetch data from appropriate sources
    // Mock data for demonstration purposes
    const readinessData = [
      { department: 'R&D', readiness: 78 },
      { department: 'Marketing', readiness: 45 },
      { department: 'Operations', readiness: 65 },
      { department: 'Customer Service', readiness: 82 },
      { department: 'HR', readiness: 58 },
    ];
    
    res.json(readinessData);
  } catch (error) {
    console.error('Error fetching organizational readiness data:', error);
    res.status(500).json({ error: 'Failed to fetch organizational readiness data' });
  }
});

// Get top risks across all systems
router.get('/top-risks', async (req, res) => {
  try {
    const systems = await storage.getAllSystems();
    const events = await storage.getAllRiskEvents();
    const controls = await storage.getAllRiskControls();
    
    // Use existing risk management function to identify top risks
    const topRisks = await identifyTopRisks({ id: 'all' }, events, controls);
    
    res.json(topRisks);
  } catch (error) {
    console.error('Error fetching top risks data:', error);
    res.status(500).json({ error: 'Failed to fetch top risks data' });
  }
});

export const analyticsRouter = router;
