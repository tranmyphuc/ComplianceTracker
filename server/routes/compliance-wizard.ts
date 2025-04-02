import { Router } from 'express';
import { IStorage } from '../storage';
import { callDeepSeekApi } from '../ai-analysis';

interface ComplianceRecommendation {
  id: string;
  articleId: string;
  summary: string;
  complianceLevel: "compliant" | "partial" | "non-compliant" | "not-applicable";
  actionItems: string[];
}

/**
 * Creates routes for the compliance wizard functionality
 * @param storage - The storage instance
 * @returns Express Router
 */
export function createComplianceWizardRoutes(storage: IStorage) {
  const router = Router();

  /**
   * Analyze a system description and generate compliance recommendations
   */
  router.post('/analyze-wizard', async (req, res) => {
    try {
      const { systemName, systemPurpose, systemDescription } = req.body;

      if (!systemName || !systemDescription) {
        return res.status(400).json({ 
          error: 'System name and description are required' 
        });
      }

      // Get relevant EU AI Act articles from the database
      const articles = await storage.getAllEuAiActArticles();
      
      if (!articles || articles.length === 0) {
        return res.status(500).json({ 
          error: 'Unable to retrieve EU AI Act articles for analysis' 
        });
      }

      // Create a consolidated prompt for the AI to analyze
      const relevantArticleIds = articles.map(a => a.articleId).slice(0, 5); // Limit to 5 for performance
      
      const prompt = `
You are an EU AI Act compliance expert assistant. Analyze the AI system description below and provide compliance recommendations based on key EU AI Act articles.

AI SYSTEM INFORMATION:
Name: ${systemName}
Purpose: ${systemPurpose || 'Not specified'}
Description: ${systemDescription}

TASK:
Generate compliance recommendations for the following articles: ${relevantArticleIds.join(', ')}

For each article, provide:
1. A brief summary of how the article applies to this system
2. A compliance level assessment: "compliant", "partial", "non-compliant", or "not-applicable"
3. 2-3 specific action items to improve compliance

FORMAT YOUR RESPONSE AS A JSON ARRAY with objects having this structure:
[
  {
    "id": "unique-id", // Generate a unique string for each recommendation
    "articleId": "Article X", // The article identifier
    "summary": "How this article applies to the system",
    "complianceLevel": "one of: compliant, partial, non-compliant, not-applicable",
    "actionItems": ["Action 1", "Action 2", "Action 3"]
  },
  // More recommendations...
]

Focus on providing practical, actionable advice based only on the system information provided.
`;

      // Call the AI service to get analysis
      const aiResponse = await callDeepSeekApi(prompt);
      
      // Parse the JSON response
      // Be cautious - the AI might not always return perfect JSON
      try {
        // Try to extract JSON from the response
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
        
        // Parse the recommendations
        const recommendations = JSON.parse(jsonString) as ComplianceRecommendation[];
        
        // Ensure each recommendation has the required fields
        const validatedRecommendations = recommendations.map(rec => ({
          id: rec.id || `rec-${Math.random().toString(36).substring(2, 11)}`,
          articleId: rec.articleId,
          summary: rec.summary || `Compliance analysis for ${rec.articleId}`,
          complianceLevel: rec.complianceLevel || "partial",
          actionItems: rec.actionItems || []
        }));
        
        return res.json(validatedRecommendations);
      } catch (parseError) {
        console.error('Error parsing AI response as JSON:', parseError);
        return res.status(500).json({ 
          error: 'Failed to generate structured compliance recommendations',
          aiResponse // Include the raw response for debugging
        });
      }
    } catch (error) {
      console.error('Error in compliance analysis:', error);
      res.status(500).json({ 
        error: 'Failed to analyze system compliance',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}