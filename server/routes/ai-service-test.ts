/**
 * AI Service Test Routes
 * For testing and demonstrating AI service functionality
 */

import express from 'express';
import { aiServices } from '../lib/ai-services';

const router = express.Router();

// Test route for the generateText method
router.post('/generate-text', async (req, res) => {
  try {
    const { prompt, type = 'general' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false,
        message: 'Prompt is required' 
      });
    }
    
    // Use the new generateText method
    const generatedText = await aiServices.generateText(prompt, type);
    
    res.json({
      success: true,
      result: generatedText,
      serviceInfo: {
        availableServices: aiServices.getServices().map(service => service.name),
        primaryService: aiServices.getPrimaryService()?.name || 'none'
      }
    });
  } catch (error) {
    console.error('Error in generate-text test:', error);
    res.status(500).json({
      success: false,
      message: `Error generating text: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});

// Test route to get information about available AI services
router.get('/services-info', async (_req, res) => {
  try {
    const services = aiServices.getServices();
    
    res.json({
      success: true,
      services: services.map(service => ({
        name: service.name,
        available: service.available
      })),
      primaryService: aiServices.getPrimaryService()?.name || 'none',
      totalServices: services.length
    });
  } catch (error) {
    console.error('Error getting AI services info:', error);
    res.status(500).json({
      success: false,
      message: `Error getting services info: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});

export default router;