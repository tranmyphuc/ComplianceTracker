/**
 * Enhanced auto-fill API route handler
 * Provides improved AI analysis with Google Search integration
 */

import { Request, Response } from "express";
import { enhancedAIAnalysis, smartRiskAnalysis } from "../lib/enhanced-ai-analysis";
import { determineRelevantArticles } from "../ai-analysis";

/**
 * Enhanced auto-fill handler with multi-stage processing
 * Jack said: "Combine Google Search with AI for more accurate suggestions"
 */
export async function enhancedAutoFillHandler(req: Request, res: Response) {
  try {
    const { name, description, documentType, documentContent } = req.body;

    // Input validation
    if (!name && !description && !documentContent) {
      return res.status(400).json({ 
        message: "Either system name, description, or document content is required"
      });
    }

    // Compose prompt based on available input data
    let prompt = "Based on the information provided, analyze this AI system for EU AI Act compliance and suggest system registration details.";
    
    if (name) {
      prompt += `\n\nSystem Name: ${name}`;
    }
    
    if (description) {
      prompt += `\n\nSystem Description: ${description}`;
    }
    
    if (documentType) {
      prompt += `\n\nDocument Type: ${documentType}`;
    }
    
    if (documentContent) {
      // If document content exceeds reasonable size, truncate it
      const truncatedContent = documentContent.length > 5000 
        ? documentContent.substring(0, 5000) + "... [content truncated]"
        : documentContent;
        
      prompt += `\n\nDocument Content: ${truncatedContent}`;
    }
    
    // Add detailed instructions for what we need
    prompt += `\n\nBased on this information, provide structured suggestions for the following fields:
    - name: The AI system name (keep original if provided)
    - vendor: The company that develops this system
    - version: A realistic version number
    - department: Where this system would typically be used
    - purpose: Detailed purpose of the system
    - aiCapabilities: Technical capabilities (NLP, Computer Vision, etc.)
    - trainingDatasets: Types of data used to train this system
    - outputTypes: What outputs this system produces
    - usageContext: Where and how this system is used
    - potentialImpact: Potential impacts on individuals or society
    - riskLevel: According to EU AI Act (Unacceptable, High, Limited, Minimal)
    - specificRisks: List of specific risks identified
    - euAiActArticles: Relevant EU AI Act articles that apply
    - dataPrivacyMeasures: Measures for data privacy
    - humanOversightMeasures: Measures for human oversight
    
    For each field, provide a confidence score (0-100) and justification.
    Structure your response in JSON format with this structure for each field:
    {
      "fieldName": {
        "value": "value string",
        "confidence": number,
        "justification": "justification string"
      },
      ... other fields ...
    }`;
    
    console.log(`Running enhanced auto-fill for ${name || "unnamed system"}`);
    
    // Execute enhanced AI analysis with web search integration
    const analysis = await enhancedAIAnalysis(prompt, name || "AI System");
    
    // Get structured results
    const results = analysis.results;
    
    // If no valid results were found, return appropriate error
    if (!results || Object.keys(results).length === 0) {
      return res.status(500).json({
        message: "Could not generate valid suggestions",
        error: "No structured data could be extracted from AI response"
      });
    }
    
    // Create response structure that's compatible with the frontend
    const systemName = (results.name?.value || name || "AI System").trim();
    
    // Extract values for risk analysis
    const systemData = {
      name: systemName,
      purpose: results.purpose?.value || description || "",
      description: description || "",
      aiCapabilities: results.aiCapabilities?.value || "",
      trainingDatasets: results.trainingDatasets?.value || "",
      usageContext: results.usageContext?.value || "",
      potentialImpact: results.potentialImpact?.value || "",
      specificRisks: results.specificRisks?.value || ""
    };
    
    // Run specialized risk analysis based on EU AI Act
    const riskAnalysis = smartRiskAnalysis(systemData);
    
    // If we don't have articles from the initial analysis, determine them based on risk level
    let euAiActArticles = [];
    if (results.euAiActArticles?.value) {
      // Try to parse articles from the existing value
      if (typeof results.euAiActArticles.value === 'string') {
        // Handle string format like "Article 5, Article 10, Article 13"
        const articleMatches = results.euAiActArticles.value.match(/Article\s+\d+/g);
        if (articleMatches) {
          euAiActArticles = articleMatches.map((article: string) => article.trim());
        }
      } else if (Array.isArray(results.euAiActArticles.value)) {
        euAiActArticles = results.euAiActArticles.value;
      }
    }
    
    // If we still don't have articles, use the relevant articles from risk analysis
    if (euAiActArticles.length === 0 && riskAnalysis?.relevantArticles) {
      euAiActArticles = riskAnalysis.relevantArticles.map((article: any) => `Article ${article.id}`);
    }
    
    // If we still don't have articles, determine them through the AI analysis
    if (euAiActArticles.length === 0) {
      try {
        const determinedArticles = await determineRelevantArticles(systemData);
        euAiActArticles = determinedArticles;
      } catch (error) {
        console.warn("Failed to determine articles:", error);
        // Set default minimal articles if everything else fails
        euAiActArticles = ["Article 69"];
      }
    }
    
    // Prepare the response object
    const suggestionsResponse = {
      name: systemName,
      vendor: results.vendor?.value || "Unknown Vendor",
      version: results.version?.value || "1.0",
      department: results.department?.value || "IT Department",
      purpose: results.purpose?.value || description || "Purpose not specified",
      aiCapabilities: results.aiCapabilities?.value || "Not specified",
      trainingDatasets: results.trainingDatasets?.value || "Not specified",
      outputTypes: results.outputTypes?.value || "Not specified",
      usageContext: results.usageContext?.value || "Not specified",
      potentialImpact: results.potentialImpact?.value || "Not specified",
      
      // Use risk level from our specialized analysis if available, otherwise use the one from general analysis
      riskLevel: riskAnalysis?.riskLevel || results.riskLevel?.value || "Limited Risk",
      
      // Add risk justification
      riskJustification: riskAnalysis?.justification || results.riskLevel?.justification || "Risk level determined based on system description",
      
      // Other fields
      specificRisks: results.specificRisks?.value || "None identified",
      euAiActArticles: euAiActArticles,
      dataPrivacyMeasures: results.dataPrivacyMeasures?.value || "Not specified",
      humanOversightMeasures: results.humanOversightMeasures?.value || "Not specified",
      
      // Add confidence information
      fieldConfidence: {
        name: results.name?.confidence || 70,
        vendor: results.vendor?.confidence || 60,
        version: results.version?.confidence || 60,
        department: results.department?.confidence || 60,
        purpose: results.purpose?.confidence || 70,
        aiCapabilities: results.aiCapabilities?.confidence || 70,
        trainingDatasets: results.trainingDatasets?.confidence || 60,
        outputTypes: results.outputTypes?.confidence || 60,
        usageContext: results.usageContext?.confidence || 60,
        potentialImpact: results.potentialImpact?.confidence || 60,
        riskLevel: riskAnalysis?.confidence || results.riskLevel?.confidence || 70,
        specificRisks: results.specificRisks?.confidence || 60,
        euAiActArticles: results.euAiActArticles?.confidence || 70,
        dataPrivacyMeasures: results.dataPrivacyMeasures?.confidence || 60,
        humanOversightMeasures: results.humanOversightMeasures?.confidence || 60
      },
      
      // Add average confidence score
      confidenceScore: analysis.confidence || 65,
      
      // Web search information
      webSearchUsed: analysis.webSearchUsed,
      sources: analysis.sources || [],
      
      // Add model information
      modelUsed: analysis.modelUsed || "AI model"
    };
    
    return res.json(suggestionsResponse);
  } catch (error: any) {
    console.error("Enhanced auto-fill error:", error);
    return res.status(500).json({ 
      message: "Error generating system suggestions", 
      error: error.message || "Unknown error"
    });
  }
}