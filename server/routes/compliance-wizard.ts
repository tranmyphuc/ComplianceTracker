import express from 'express';
import { db } from '../db';
import { euAiActArticles } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { IStorage } from '../storage';

/**
 * Create and configure the compliance wizard routes
 * @param storage The storage implementation to use
 * @returns An Express router with all compliance wizard routes
 */
export function createComplianceWizardRoutes(storage: IStorage) {
  const router = express.Router();

  // Schema for validating the request body
  const complianceAnalysisSchema = z.object({
    description: z.string().min(10, "System description must be at least 10 characters long")
  });

  /**
   * Analyze AI system compliance against EU AI Act articles
   * 
   * This endpoint accepts a system description and uses AI analysis to generate
   * compliance recommendations based on EU AI Act articles in the database.
   */
  router.post('/analyze/compliance', async (req, res) => {
  try {
    // Validate request body
    const validatedData = complianceAnalysisSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: validatedData.error.format() 
      });
    }
    
    const { description } = validatedData.data;
    
    // Fetch EU AI Act articles from the database for context
    const articles = await db.select().from(euAiActArticles);
    
    if (!articles || articles.length === 0) {
      return res.status(500).json({ 
        error: "Could not load EU AI Act articles from the database" 
      });
    }
    
    // For this demo, we'll generate sample recommendations based on the description
    // In a real implementation, this would use an AI service to analyze the description
    const recommendations = generateSampleRecommendations(description, articles);
    
    // Return the recommendations
    res.json({
      success: true,
      recommendations: recommendations,
      analyzed_text: description
    });
    
  } catch (error: any) {
    console.error("Error in compliance analysis:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred during compliance analysis"
    });
  }
});

/**
 * Generate sample compliance recommendations based on system description
 * 
 * This is a placeholder implementation that creates sample recommendations
 * based on keywords in the description. In a real implementation, this would
 * be replaced with actual AI-powered analysis.
 */
function generateSampleRecommendations(description: string, articles: any[]) {
  const lowercaseDesc = description.toLowerCase();
  const recommendations = [];
  
  // Create a random ID for each recommendation
  const createId = () => Math.random().toString(36).substring(2, 9);
  
  // Check for healthcare-related keywords
  if (lowercaseDesc.includes('health') || lowercaseDesc.includes('medical') || 
      lowercaseDesc.includes('patient') || lowercaseDesc.includes('diagnosis') ||
      lowercaseDesc.includes('clinical')) {
    
    // Find articles related to high-risk AI systems
    const highRiskArticle = articles.find(a => a.articleNumber === "6" || a.title.includes("High-risk"));
    
    if (highRiskArticle) {
      recommendations.push({
        id: createId(),
        articleId: highRiskArticle.articleNumber,
        summary: "Your AI system appears to operate in healthcare, which is considered a high-risk domain under the EU AI Act.",
        complianceLevel: "partial",
        actionItems: [
          "Conduct a thorough risk assessment",
          "Implement a risk management system",
          "Ensure human oversight mechanisms",
          "Document technical specifications in detail"
        ]
      });
    }
  }
  
  // Check for data-related keywords
  if (lowercaseDesc.includes('data') || lowercaseDesc.includes('dataset') || 
      lowercaseDesc.includes('training') || lowercaseDesc.includes('model')) {
    
    // Find articles related to data and data governance
    const dataArticle = articles.find(a => a.articleNumber === "10" || a.title.includes("Data"));
    
    if (dataArticle) {
      recommendations.push({
        id: createId(),
        articleId: dataArticle.articleNumber,
        summary: "Your AI system requires high-quality data governance practices to ensure compliance.",
        complianceLevel: "non-compliant",
        actionItems: [
          "Implement data quality assurance measures",
          "Establish data governance protocols",
          "Document data sources and processing methods",
          "Perform bias detection and mitigation"
        ]
      });
    }
  }
  
  // Check for transparency-related keywords
  if (lowercaseDesc.includes('user') || lowercaseDesc.includes('interface') || 
      lowercaseDesc.includes('interact') || lowercaseDesc.includes('human')) {
    
    // Find articles related to transparency
    const transparencyArticle = articles.find(a => a.articleNumber === "13" || a.title.includes("Transparency"));
    
    if (transparencyArticle) {
      recommendations.push({
        id: createId(),
        articleId: transparencyArticle.articleNumber,
        summary: "Your AI system needs to implement transparency measures to inform users about its capabilities and limitations.",
        complianceLevel: "compliant",
        actionItems: [
          "Clearly disclose that users are interacting with an AI system",
          "Provide information about the system's capabilities and limitations",
          "Document how the system makes decisions",
          "Provide contact details for further information"
        ]
      });
    }
  }
  
  // Add a general recommendation if no specific ones were generated
  if (recommendations.length === 0) {
    const generalArticle = articles.find(a => a.articleNumber === "9" || a.title.includes("Risk"));
    
    if (generalArticle) {
      recommendations.push({
        id: createId(),
        articleId: generalArticle.articleNumber,
        summary: "Based on the limited information provided, your AI system requires basic compliance measures.",
        complianceLevel: "not-applicable",
        actionItems: [
          "Determine the risk category of your AI system",
          "Implement appropriate technical documentation",
          "Establish quality management systems",
          "Conduct a preliminary risk assessment"
        ]
      });
    }
  }
  
  return recommendations;
}

  return router;
}