/**
 * Compliance suggestion API route handler
 * Provides EU AI Act article suggestions and compliance guidance
 */

import { Request, Response } from "express";
import { enhancedAIAnalysis } from "../lib/enhanced-ai-analysis";
import { determineRelevantArticles } from "../ai-analysis";
import { db } from "../db";
import { euAiActArticles } from "../../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Generate compliance suggestions based on system information
 */
export async function complianceSuggestionHandler(req: Request, res: Response) {
  try {
    const { systemId, systemDesc, searchQuery } = req.body;

    // Input validation
    if (!systemDesc && !searchQuery) {
      return res.status(400).json({ 
        message: "Either system description or search query is required"
      });
    }

    // Compose prompt based on available input data
    let prompt = "Analyze this information for EU AI Act compliance and identify the most relevant articles and compliance requirements.";
    
    if (systemDesc) {
      prompt += `\n\nSystem Description: ${systemDesc}`;
    }

    if (searchQuery) {
      prompt += `\n\nSearch Query: ${searchQuery}`;
    }

    // Use enhanced AI analysis to get suggestions
    const systemName = systemDesc?.substring(0, 50) || searchQuery?.substring(0, 50) || "AI System";
    const analysisResult = await enhancedAIAnalysis(prompt, systemName);

    // Determine relevant articles using our existing function
    const relevantArticleIds = await determineRelevantArticles(
      systemDesc || searchQuery || ""
    );

    // Get detailed information for identified articles
    const enhancedArticles = await getEnhancedArticleInfo(relevantArticleIds);

    // Calculate a basic compliance score
    // This could be improved with more sophisticated scoring logic
    const compliance = calculateComplianceScore(analysisResult, enhancedArticles);

    // Extract remediation actions from AI result
    let suggestedRemediation: string[] = [];
    let complianceGaps: string[] = [];
    
    // Try to extract data from the AI results - this is fallback logic in case the analysis
    // doesn't provide these fields directly
    if (analysisResult.results) {
      if (typeof analysisResult.results === 'object') {
        suggestedRemediation = analysisResult.results.remediationActions || 
                             analysisResult.results.suggestedRemediation || 
                             analysisResult.results.recommendations || [];
                             
        complianceGaps = analysisResult.results.complianceGaps || 
                      analysisResult.results.gaps || 
                      analysisResult.results.issues || [];
      }
    }
    
    // Prepare the response
    const response = {
      relevantArticles: enhancedArticles,
      complianceScore: compliance.score,
      suggestedRemediation,
      gaps: complianceGaps
    };

    return res.json(response);
  } catch (error) {
    console.error("Error in compliance suggestion handler:", error);
    return res.status(500).json({
      message: "An error occurred while generating compliance suggestions",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Fetch enhanced article information for a list of article IDs
 */
async function getEnhancedArticleInfo(articleIds: string[]) {
  try {
    // Try to get articles from the database
    // Since the drizzle-orm .in() method may not be available, using a workaround
    const articles = await db.select({
      articleId: euAiActArticles.articleId,
      title: euAiActArticles.title,
      content: euAiActArticles.content,
      riskLevel: euAiActArticles.riskLevel
    }).from(euAiActArticles)
      .where(sql`${euAiActArticles.articleId} IN (${articleIds.map(id => `'${id}'`).join(',')})`);
      
    // Filter out any null results just in case
    const validArticles = articles.filter(article => article && article.articleId);

    // Transform the result to include relevance information
    return articles.map(article => ({
      articleId: article.articleId,
      title: article.title,
      relevance: determineArticleRelevance(article.riskLevel),
      excerpt: generateExcerpt(article.content, 150)
    }));
  } catch (error) {
    console.error("Error fetching enhanced article info:", error);
    // Return basic info if database query fails
    return articleIds.map(id => ({
      articleId: id,
      title: `Article ${id.replace("Article ", "")}`,
      relevance: "Relevant",
      excerpt: "This article contains requirements relevant to your system. View the full article for details."
    }));
  }
}

/**
 * Determine article relevance based on risk level
 */
function determineArticleRelevance(riskLevel?: string | null): string {
  if (!riskLevel) return "Relevant";
  
  switch (riskLevel.toLowerCase()) {
    case "prohibited":
      return "Critical";
    case "high":
      return "Highly Relevant";
    case "limited":
      return "Moderately Relevant";
    case "minimal":
      return "Somewhat Relevant";
    default:
      return "Relevant";
  }
}

/**
 * Generate a plain text excerpt from HTML content
 */
function generateExcerpt(htmlContent: string, maxLength: number = 150): string {
  // Simple HTML tag removal (a more robust solution would use proper HTML parsing)
  const plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength) + '...';
}

/**
 * Calculate compliance score based on analysis results
 */
function calculateComplianceScore(
  analysisResult: any, 
  articles: Array<{ articleId: string; relevance: string }>
): { score: number; level: string } {
  // Start with a base score
  let score = 70;
  
  // Adjust based on number of gaps
  if (analysisResult.complianceGaps && Array.isArray(analysisResult.complianceGaps)) {
    score -= analysisResult.complianceGaps.length * 5;
  }
  
  // Adjust based on article relevance
  for (const article of articles) {
    if (article.relevance === "Critical") {
      score -= 15;
    } else if (article.relevance === "Highly Relevant") {
      score -= 5;
    }
  }
  
  // Ensure score is within 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  // Determine compliance level
  let level = "Unknown";
  if (score >= 80) {
    level = "High";
  } else if (score >= 50) {
    level = "Medium";
  } else {
    level = "Low";
  }
  
  return { score, level };
}