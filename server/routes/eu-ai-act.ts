import { Router } from 'express';
import { IStorage } from '../storage';
import { z } from 'zod';
import type { EuAiActArticle, InsertEuAiActArticle } from '@shared/schema';

/**
 * Creates the EU AI Act routes
 * @param storage - The storage instance
 * @returns Express Router
 */
export function createEuAiActRoutes(storage: IStorage) {
  const router = Router();

  // Get all EU AI Act articles
  router.get('/articles', async (req, res) => {
    try {
      const riskLevel = req.query.riskLevel as string | undefined;
      const version = req.query.version as string | undefined;

      const articles = await storage.getAllEuAiActArticles({ riskLevel, version });
      
      res.json(articles);
    } catch (error) {
      console.error('Error getting EU AI Act articles:', error);
      res.status(500).json({ error: 'Failed to retrieve EU AI Act articles' });
    }
  });

  // Get specific EU AI Act article by ID
  router.get('/articles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid article ID' });
      }
      
      const article = await storage.getEuAiActArticle(id);
      
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      res.json(article);
    } catch (error) {
      console.error('Error getting EU AI Act article:', error);
      res.status(500).json({ error: 'Failed to retrieve EU AI Act article' });
    }
  });

  // Get specific EU AI Act article by article ID (e.g., "Article 5")
  router.get('/articles/by-article-id/:articleId', async (req, res) => {
    try {
      const articleId = req.params.articleId;
      
      if (!articleId) {
        return res.status(400).json({ error: 'Article ID is required' });
      }
      
      const article = await storage.getEuAiActArticleByArticleId(articleId);
      
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      res.json(article);
    } catch (error) {
      console.error('Error getting EU AI Act article by article ID:', error);
      res.status(500).json({ error: 'Failed to retrieve EU AI Act article' });
    }
  });

  // Create a new EU AI Act article (admin only)
  router.post('/articles', async (req, res) => {
    try {
      // Check if user is admin (simplified - enhance with proper auth middleware)
      const userRole = req.headers['x-user-role'] as string;
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }

      const articleSchema = z.object({
        articleId: z.string(),
        number: z.number(),
        title: z.string(),
        content: z.string(),
        officialUrl: z.string().optional(),
        riskLevel: z.string().optional(),
        keyPoints: z.any().optional(),
        version: z.string().optional(),
        changeDescription: z.string().optional(),
        exampleSummary: z.string().optional(),
        exampleDetails: z.string().optional(),
        imageUrl: z.string().optional(),
      });

      const validatedData = articleSchema.parse(req.body);
      const newArticle = await storage.createEuAiActArticle(validatedData as InsertEuAiActArticle);
      
      res.status(201).json(newArticle);
    } catch (error) {
      console.error('Error creating EU AI Act article:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid article data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create EU AI Act article' });
    }
  });

  // Update an EU AI Act article (admin only)
  router.patch('/articles/:id', async (req, res) => {
    try {
      // Check if user is admin (simplified - enhance with proper auth middleware)
      const userRole = req.headers['x-user-role'] as string;
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }

      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid article ID' });
      }
      
      const articleSchema = z.object({
        articleId: z.string().optional(),
        number: z.number().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        officialUrl: z.string().optional(),
        riskLevel: z.string().optional(),
        keyPoints: z.any().optional(),
        version: z.string().optional(),
        isLatest: z.boolean().optional(),
        changeDescription: z.string().optional(),
        exampleSummary: z.string().optional(),
        exampleDetails: z.string().optional(),
        imageUrl: z.string().optional(),
      });

      const validatedData = articleSchema.parse(req.body);
      
      // If this is a version update, create a version history record
      if (validatedData.version) {
        const currentArticle = await storage.getEuAiActArticle(id);
        
        if (currentArticle && currentArticle.version !== validatedData.version) {
          await storage.createArticleVersion({
            articleId: currentArticle.articleId,
            version: currentArticle.version,
            content: currentArticle.content,
            changedBy: req.headers['x-user-uid'] as string,
            changeNotes: validatedData.changeDescription || 'Updated to new version',
            previousVersion: currentArticle.version,
          });
          
          // Set all other versions of this article to not be the latest
          if (validatedData.isLatest) {
            // This would need to be implemented in storage
            // await storage.updateArticleVersionsLatestFlag(currentArticle.articleId, validatedData.version);
          }
        }
      }
      
      const updatedArticle = await storage.updateEuAiActArticle(id, validatedData as Partial<EuAiActArticle>);
      
      if (!updatedArticle) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      res.json(updatedArticle);
    } catch (error) {
      console.error('Error updating EU AI Act article:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid article data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update EU AI Act article' });
    }
  });

  // Get version history for an article
  router.get('/articles/:articleId/versions', async (req, res) => {
    try {
      const articleId = req.params.articleId;
      
      if (!articleId) {
        return res.status(400).json({ error: 'Article ID is required' });
      }
      
      const versions = await storage.getArticleVersions(articleId);
      
      res.json(versions);
    } catch (error) {
      console.error('Error getting article versions:', error);
      res.status(500).json({ error: 'Failed to retrieve article versions' });
    }
  });

  return router;
}