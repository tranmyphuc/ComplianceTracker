/**
 * Routes for development mode features
 */
import express from 'express';
import { db } from '../db';
import { featureFlags, systemSettings } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get all feature flags
router.get('/api/features', async (req, res) => {
  try {
    const features = await db.select().from(featureFlags).orderBy(featureFlags.name);
    res.json(features);
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a feature flag
router.post('/api/features/update', async (req, res) => {
  try {
    const { name, enabled } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Feature name is required' });
    }
    
    // Check if feature exists
    const existingFeature = await db.select()
      .from(featureFlags)
      .where(eq(featureFlags.name, name));
    
    if (existingFeature && existingFeature.length > 0) {
      // Update existing feature
      await db.update(featureFlags)
        .set({ 
          enabled: enabled, 
          updated_at: new Date() 
        })
        .where(eq(featureFlags.name, name));
      
      res.json({ success: true, message: 'Feature updated' });
    } else {
      // Create new feature
      await db.insert(featureFlags).values({
        name,
        enabled: enabled ?? false,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      res.json({ success: true, message: 'Feature created' });
    }
  } catch (error) {
    console.error('Error updating feature flag:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enable all features
router.post('/api/features/enable-all', async (req, res) => {
  try {
    // List of common features to ensure they exist
    const commonFeatures = [
      'risk_assessment',
      'system_registration',
      'training_modules',
      'expert_reviews',
      'knowledge_center',
      'regulatory_updates',
      'document_templates',
      'ai_autofill',
      'multilingual_support',
      'interactive_scenarios',
      'enterprise_dashboard',
      'strategic_planning',
      'literacy_modules'
    ];
    
    // First, create any missing features
    for (const featureName of commonFeatures) {
      const existingFeature = await db.select()
        .from(featureFlags)
        .where(eq(featureFlags.name, featureName));
      
      if (!existingFeature || existingFeature.length === 0) {
        await db.insert(featureFlags).values({
          name: featureName,
          enabled: true,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }
    
    // Now enable all features
    await db.update(featureFlags)
      .set({ 
        enabled: true, 
        updated_at: new Date() 
      });
    
    // Also set development mode settings
    await updateOrCreateSetting('development_mode', 'true');
    await updateOrCreateSetting('display_all_features', 'true');
    await updateOrCreateSetting('show_experimental', 'true');
    
    res.json({ success: true, message: 'All features enabled' });
  } catch (error) {
    console.error('Error enabling all features:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all system settings
router.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.select().from(systemSettings).orderBy(systemSettings.name);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a system setting
router.post('/api/settings/update', async (req, res) => {
  try {
    const { name, value } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Setting name is required' });
    }
    
    await updateOrCreateSetting(name, value);
    
    res.json({ success: true, message: 'Setting updated' });
  } catch (error) {
    console.error('Error updating system setting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to update or create a setting
async function updateOrCreateSetting(name: string, value: string) {
  const existingSetting = await db.select()
    .from(systemSettings)
    .where(eq(systemSettings.name, name));
  
  if (existingSetting && existingSetting.length > 0) {
    // Update existing setting
    await db.update(systemSettings)
      .set({ 
        value: value, 
        updated_at: new Date() 
      })
      .where(eq(systemSettings.name, name));
  } else {
    // Create new setting
    await db.insert(systemSettings).values({
      name,
      value: value || '',
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}

export default router;