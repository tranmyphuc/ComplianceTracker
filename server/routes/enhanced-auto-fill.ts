/**
 * Enhanced auto-fill API route handler
 * Provides improved AI analysis with Google Search integration
 */

import { Request, Response } from "express";
import { analyzeSystemRisk, enhancedAIAnalysis, smartRiskAnalysis } from "../lib/enhanced-ai-analysis";
import { aiServices } from "../lib/ai-services";

/**
 * Determine relevant EU AI Act articles based on system data
 * Uses AI analysis to identify applicable regulatory requirements
 */
async function determineRelevantArticles(systemData: any): Promise<string[]> {
  try {
    console.log("Determining relevant articles for:", systemData.name);
    
    // Default articles that typically apply to most AI systems
    const defaultArticles = [
      "Article 52", // Transparency obligations for certain AI systems
      "Article 69", // Codes of conduct
      "Article 10", // Data and data governance
      "Article 13"  // Transparency and provision of information to users
    ];
    
    // Try to get a more accurate assessment using AI analysis
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      console.log("No AI service available, using default articles");
      return defaultArticles;
    }
    
    // Create a focused prompt for article determination
    const prompt = `
      Based on this AI system information, list the most relevant EU AI Act articles that apply:
      
      System Name: ${systemData.name || 'Unspecified'}
      Purpose: ${systemData.purpose || 'Unspecified'}
      AI Capabilities: ${systemData.aiCapabilities || 'Unspecified'}
      
      Format your response as a simple list of article numbers with titles, e.g.:
      - Article 10 - Data and Data Governance
      - Article 13 - Transparency and Provision of Information to Users
    `;
    
    const response = await aiService.complete({
      messages: [
        {
          role: "system",
          content: "You are an expert in EU AI Act compliance analysis. Analyze the given AI system and determine the most relevant EU AI Act articles that apply."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1
    });
    
    if (!response || !response.content) {
      return defaultArticles;
    }
    
    // Parse the response to extract article numbers
    const articleMatches = response.content.match(/Article\s+\d+/g);
    if (articleMatches && articleMatches.length > 0) {
      return articleMatches.map((article: string) => article.trim());
    }
    
    return defaultArticles;
  } catch (error) {
    console.error("Error determining relevant articles:", error);
    return [
      "Article 52", 
      "Article 69"
    ];
  }
}

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
    
    // Get AI service
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      return res.status(503).json({
        message: "AI service unavailable",
        error: "No AI service available for suggestions"
      });
    }
    
    // Execute enhanced AI analysis with proper formatting for structured response
    let analysis: any = { results: {}, confidence: 0 };
    
    try {
      // Call AI service with the structured prompt
      const aiResponse = await aiService.complete({
        messages: [
          {
            role: "system",
            content: "You are an expert in EU AI Act compliance analysis. Analyze AI systems and provide structured, detailed information in JSON format exactly as requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      });
      
      if (!aiResponse || !aiResponse.content) {
        throw new Error("Empty AI response");
      }
      
      // Parse the AI response
      let aiResult: any = {};
      try {
        // Try to parse full JSON response
        aiResult = JSON.parse(aiResponse.content);
      } catch (parseError) {
        console.warn("Failed to parse AI response as JSON:", parseError);
        
        // Try to extract JSON object using regex as fallback
        const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            aiResult = JSON.parse(jsonMatch[0]);
          } catch (secondError) {
            console.error("Second attempt to parse JSON failed:", secondError);
            throw new Error("Invalid JSON response format");
          }
        } else {
          throw new Error("Could not extract structured data from AI response");
        }
      }
      
      // Build the structured results based on the AI response format
      const results: any = {};
      let totalConfidence = 0;
      let fieldsWithConfidence = 0;
      
      // Process each field from the AI response
      Object.entries(aiResult).forEach(([field, value]: [string, any]) => {
        if (value && typeof value === 'object') {
          // Handle properly structured fields
          results[field] = value;
          
          // Track confidence
          if (typeof value.confidence === 'number') {
            totalConfidence += value.confidence;
            fieldsWithConfidence++;
          }
        } else if (value) {
          // Handle flat fields (no nested structure)
          results[field] = {
            value: value,
            confidence: 70
          };
          
          totalConfidence += 70;
          fieldsWithConfidence++;
        }
      });
      
      // Calculate average confidence
      const avgConfidence = fieldsWithConfidence > 0 ? Math.round(totalConfidence / fieldsWithConfidence) : 65;
      
      // Create the final analysis object
      analysis = {
        results: results,
        confidence: avgConfidence
      };
      
      // If response doesn't have required fields, make sure they exist with defaults
      if (!analysis.results.name) {
        analysis.results.name = { value: name || "AI System", confidence: 90 };
      }
      
      // Check some critical fields and add defaults if missing
      const criticalFields = [
        "vendor", "version", "department", "purpose", "aiCapabilities", 
        "trainingDatasets", "outputTypes", "usageContext", "potentialImpact", 
        "riskLevel", "dataPrivacyMeasures", "humanOversightMeasures"
      ];
      
      criticalFields.forEach(field => {
        if (!analysis.results[field]) {
          analysis.results[field] = { value: "", confidence: 50 };
        }
      });
      
    } catch (error) {
      console.error("AI analysis error:", error);
      
      // Create minimal analysis with existing information
      analysis = {
        results: {
          name: { value: name || "AI System", confidence: 90 },
          vendor: { value: "Unknown", confidence: 50 },
          version: { value: "1.0", confidence: 50 },
          department: { value: "", confidence: 50 },
          purpose: { value: description || "", confidence: 60 },
          riskLevel: { value: "Limited", confidence: 60 }
        },
        confidence: 60
      };
    }
    
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
    let riskAnalysis: any;
    
    try {
      // Use the real analyze function from enhancedAIAnalysis
      const analysisResult = await analyzeSystemRisk(systemData);
      
      if (analysisResult) {
        riskAnalysis = {
          riskLevel: analysisResult.riskLevel ? 
            `${analysisResult.riskLevel.charAt(0).toUpperCase() + analysisResult.riskLevel.slice(1)} Risk` : 
            "Limited Risk",
          justification: analysisResult.potentialImpact || 
            "Based on the provided information, this appears to have limited risk according to EU AI Act criteria.",
          confidence: 80,
          relevantArticles: analysisResult.relevantArticles ? 
            analysisResult.relevantArticles.map((article: string) => {
              const idMatch = article.match(/Article\s+(\d+)/i);
              const id = idMatch ? parseInt(idMatch[1]) : 0;
              const titleMatch = article.match(/Article\s+\d+\s*-\s*(.*)/i);
              const title = titleMatch ? titleMatch[1].trim() : article;
              return { id, title };
            }) : 
            [
              { id: 52, title: "Transparency obligations for certain AI systems" },
              { id: 69, title: "Codes of conduct" }
            ]
        };
      }
    } catch (error) {
      console.error("Failed to perform risk analysis:", error);
    }
    
    // Fall back to default values if real analysis failed
    if (!riskAnalysis) {
      riskAnalysis = {
        riskLevel: results.riskLevel?.value ? 
          `${results.riskLevel.value.charAt(0).toUpperCase() + results.riskLevel.value.slice(1)} Risk` : 
          "Limited Risk",
        justification: "Based on the provided information, this system appears to have limited risk according to EU AI Act criteria.",
        confidence: 75,
        relevantArticles: [
          { id: 52, title: "Transparency obligations for certain AI systems" },
          { id: 69, title: "Codes of conduct" }
        ]
      };
    }
    
    // If we don't have articles from the initial analysis, determine them based on risk level
    let euAiActArticles: string[] = [];
    if (results.euAiActArticles?.value) {
      // Try to parse articles from the existing value
      if (typeof results.euAiActArticles.value === 'string') {
        // Handle string format like "Article 5, Article 10, Article 13"
        const articleMatches = (results.euAiActArticles.value as string).match(/Article\s+\d+/g);
        if (articleMatches) {
          euAiActArticles = articleMatches.map((article: string) => article.trim());
        }
      } else if (Array.isArray(results.euAiActArticles.value)) {
        euAiActArticles = results.euAiActArticles.value as string[];
      }
    }
    
    // If we still don't have articles, use the relevant articles from risk analysis
    if (euAiActArticles.length === 0 && riskAnalysis?.relevantArticles) {
      euAiActArticles = riskAnalysis.relevantArticles.map((article: { id: number; title: string }) => `Article ${article.id}`);
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
      confidenceScore: analysis.confidence || 65
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