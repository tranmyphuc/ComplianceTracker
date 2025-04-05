/**
 * AI Regulatory Updates Assistant
 * Uses AI to monitor, analyze, and summarize regulatory updates
 * related to the EU AI Act and provide impact analysis for AI systems
 */

import { aiServices } from './lib/ai-services';
import { db } from './db';
import { AiSystem, RegulatoryUpdate } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';
import { regulatoryUpdates, aiSystems } from '@shared/schema';
import axios from 'axios';
import { eq } from 'drizzle-orm';

// Official sources to monitor for regulatory updates
const OFFICIAL_SOURCES = [
  'https://digital-strategy.ec.europa.eu/',
  'https://ec.europa.eu/',
  'https://eur-lex.europa.eu/'
];

// Keywords for regulatory update searches
const REGULATORY_KEYWORDS = [
  'EU AI Act',
  'Artificial Intelligence Act',
  'AI regulation',
  'EU AI regulation',
  'high-risk AI',
  'AI compliance',
  'AI governance',
  'AI transparency',
  'AI oversight',
  'European AI'
];

/**
 * Check for new regulatory updates from official sources
 */
export async function checkForRegulatoryUpdates(): Promise<any> {
  try {
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    let updates: any[] = [];
    
    // Use AI to search for and analyze recent updates
    for (const source of OFFICIAL_SOURCES) {
      try {
        const searchResults = await searchForUpdates(source);
        if (searchResults && searchResults.length > 0) {
          updates = [...updates, ...searchResults];
        }
      } catch (error) {
        console.error(`Error searching for updates from ${source}:`, error);
      }
    }
    
    // If no updates from official sources, try a general search
    if (updates.length === 0) {
      console.log("No results from official sites, trying general search");
      try {
        const generalResults = await searchForUpdates(null);
        if (generalResults && generalResults.length > 0) {
          updates = [...updates, ...generalResults];
        }
      } catch (error) {
        console.error("Error in general search:", error);
      }
    }
    
    // Process and store the updates
    const processedUpdates = await processRegulatoryUpdates(updates);
    
    return {
      success: true,
      updates: processedUpdates,
      message: `Found ${processedUpdates.length} regulatory updates`
    };
  } catch (error) {
    console.error("Error checking for regulatory updates:", error);
    return {
      success: false,
      message: `Failed to check for updates: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Search for updates from a specific source or general search
 */
async function searchForUpdates(source: string | null): Promise<any[]> {
  console.log(`Searching for regulatory updates on: ${source || 'general search'}`);
  
  try {
    // In a real implementation, this would use APIs to search for content
    // For this demo, we'll use the AI to generate simulated search results
    
    console.log("Calling DeepSeek API...");
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    // Prompt to simulate search results
    let prompt = `As an AI regulatory expert, identify recent or important updates to the EU AI Act or related regulatory frameworks. `;
    
    if (source) {
      prompt += `Focus on content from ${source}. `;
    } else {
      prompt += `Consider updates from official EU sources and reputable regulatory news. `;
    }
    
    prompt += `Provide your analysis in JSON format with this structure:
    {
      "updates": [
        {
          "title": "Update title",
          "source": "Source URL or publication",
          "date": "Approximate date (YYYY-MM-DD)",
          "summary": "Brief summary of the update",
          "relevance": "High/Medium/Low relevance to AI compliance",
          "impactAreas": ["Area 1", "Area 2"]
        }
        // Include 3-5 updates, prioritizing the most recent and important
      ]
    }`;
    
    const response = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in EU AI regulation who monitors and reports on regulatory changes." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });
    
    if (!response?.content) {
      throw new Error("Empty AI response");
    }
    
    // Extract JSON from response
    let searchResults;
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        searchResults = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (error) {
      console.error("Error parsing AI search results:", error);
      throw error;
    }
    
    if (searchResults && searchResults.updates && Array.isArray(searchResults.updates)) {
      return searchResults.updates;
    }
    
    return [];
  } catch (error) {
    console.error(`Error searching ${source || 'general sources'}:`, error);
    throw error;
  }
}

/**
 * Process regulatory updates found from searches
 */
async function processRegulatoryUpdates(updates: any[]): Promise<any[]> {
  if (!updates || updates.length === 0) {
    return [];
  }
  
  const processedUpdates = [];
  
  for (const update of updates) {
    // Check if this update already exists (by title similarity)
    const existingUpdates = await db.select().from(regulatoryUpdates);
    const similarUpdate = existingUpdates.find(existing => 
      existing.title && update.title &&
      (existing.title.toLowerCase() === update.title.toLowerCase() ||
       existing.title.toLowerCase().includes(update.title.toLowerCase()) ||
       update.title.toLowerCase().includes(existing.title.toLowerCase()))
    );
    
    if (similarUpdate) {
      console.log(`Skipping duplicate update: ${update.title}`);
      continue;
    }
    
    // Process this update
    try {
      const updateId = uuidv4();
      const newUpdate = {
        updateId,
        title: update.title,
        source: update.source,
        publicationDate: new Date(update.date || Date.now()),
        summary: update.summary,
        content: update.summary, // In a real implementation, we would fetch the full content
        relevance: update.relevance || 'Medium',
        impactAreas: update.impactAreas || [],
        status: 'New',
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'Regulation',
        metadata: {
          discoveryMethod: 'ai',
          originalSource: update.source
        }
      };
      
      const [insertedUpdate] = await db.insert(regulatoryUpdates).values(newUpdate).returning();
      
      // Generate impact analysis for all registered AI systems
      await generateSystemImpactAnalysis(insertedUpdate);
      
      processedUpdates.push(insertedUpdate);
    } catch (error) {
      console.error(`Error processing update: ${update.title}`, error);
    }
  }
  
  return processedUpdates;
}

/**
 * Generate impact analysis for all registered AI systems based on a regulatory update
 */
async function generateSystemImpactAnalysis(update: any): Promise<void> {
  try {
    // Get all registered AI systems
    const systems = await db.select().from(aiSystems);
    
    if (!systems || systems.length === 0) {
      return;
    }
    
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      return;
    }
    
    for (const system of systems) {
      try {
        // Generate impact analysis for this specific system
        const prompt = `Analyze the impact of this regulatory update on the following AI system:
        
        Regulatory Update: "${update.title}"
        Summary: "${update.summary}"
        
        AI System:
        Name: ${system.name}
        Description: ${system.description || 'Not provided'}
        Risk Level: ${system.riskLevel || 'Unknown'}
        Purpose: ${system.purpose || 'Not provided'}
        Domain: ${system.domain || 'Not provided'}
        
        Provide your analysis in JSON format with this structure:
        {
          "impactLevel": "High/Medium/Low",
          "summary": "Brief summary of impact",
          "affectedAreas": ["Area 1", "Area 2"],
          "requiredActions": ["Action 1", "Action 2"],
          "timeline": "Suggested timeline for implementation",
          "complianceRisks": ["Risk 1", "Risk 2"]
        }`;
        
        const response = await aiService.complete({
          messages: [
            { role: "system", content: "You are an expert in analyzing the impact of AI regulations on specific AI systems." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2
        });
        
        if (!response?.content) {
          continue;
        }
        
        // Extract JSON from response
        let impactAnalysis;
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            impactAnalysis = JSON.parse(jsonMatch[0]);
          } else {
            continue;
          }
        } catch (error) {
          console.error(`Error parsing impact analysis for system ${system.name}:`, error);
          continue;
        }
        
        // Update the regulatory update with system-specific impact analysis
        const currentMetadata = update.metadata || {};
        const systemImpacts = currentMetadata.systemImpacts || {};
        
        systemImpacts[system.systemId] = {
          systemName: system.name,
          analysis: impactAnalysis,
          generatedAt: new Date().toISOString()
        };
        
        currentMetadata.systemImpacts = systemImpacts;
        
        // Update the regulatory update
        await db.update(regulatoryUpdates)
          .set({ 
            metadata: currentMetadata,
            updatedAt: new Date()
          })
          .where(eq(regulatoryUpdates.updateId, update.updateId));
      } catch (error) {
        console.error(`Error generating impact analysis for system ${system.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error generating system impact analysis:", error);
  }
}

/**
 * Get impact analysis for a specific AI system based on a regulatory update
 */
export async function getSystemImpactAnalysis(systemId: string, updateId: string): Promise<any> {
  try {
    // Get the regulatory update
    const [update] = await db.select().from(regulatoryUpdates).where(eq(regulatoryUpdates.updateId, updateId));
    
    if (!update) {
      throw new Error("Regulatory update not found");
    }
    
    // Get the system
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId));
    
    if (!system) {
      throw new Error("AI system not found");
    }
    
    // Check if we already have an impact analysis for this system
    const metadata = update.metadata || {};
    const systemImpacts = metadata.systemImpacts || {};
    
    if (systemImpacts[systemId]) {
      return {
        success: true,
        impact: systemImpacts[systemId],
        message: "Impact analysis retrieved"
      };
    }
    
    // If not, generate a new impact analysis
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    const prompt = `Analyze the impact of this regulatory update on the following AI system:
    
    Regulatory Update: "${update.title}"
    Summary: "${update.summary}"
    Content: "${update.content}"
    
    AI System:
    Name: ${system.name}
    Description: ${system.description || 'Not provided'}
    Risk Level: ${system.riskLevel || 'Unknown'}
    Purpose: ${system.purpose || 'Not provided'}
    Domain: ${system.domain || 'Not provided'}
    
    Provide your analysis in JSON format with this structure:
    {
      "impactLevel": "High/Medium/Low",
      "summary": "Brief summary of impact",
      "affectedAreas": ["Area 1", "Area 2"],
      "requiredActions": ["Action 1", "Action 2"],
      "timeline": "Suggested timeline for implementation",
      "complianceRisks": ["Risk 1", "Risk 2"]
    }`;
    
    const response = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in analyzing the impact of AI regulations on specific AI systems." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });
    
    if (!response?.content) {
      throw new Error("Empty AI response");
    }
    
    // Extract JSON from response
    let impactAnalysis;
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        impactAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (error) {
      console.error("Error parsing impact analysis:", error);
      throw error;
    }
    
    // Update the regulatory update with system-specific impact analysis
    systemImpacts[systemId] = {
      systemName: system.name,
      analysis: impactAnalysis,
      generatedAt: new Date().toISOString()
    };
    
    metadata.systemImpacts = systemImpacts;
    
    // Update the regulatory update
    await db.update(regulatoryUpdates)
      .set({ 
        metadata,
        updatedAt: new Date()
      })
      .where(eq(regulatoryUpdates.updateId, updateId));
    
    return {
      success: true,
      impact: systemImpacts[systemId],
      message: "Impact analysis generated"
    };
  } catch (error) {
    console.error("Error getting system impact analysis:", error);
    return {
      success: false,
      message: `Failed to get impact analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Generate compliance tips based on regulatory updates
 */
export async function generateComplianceTipUpdates(): Promise<any> {
  try {
    // Get recent regulatory updates
    const recentUpdates = await db.select().from(regulatoryUpdates).limit(5);
    
    if (!recentUpdates || recentUpdates.length === 0) {
      return {
        success: true,
        tips: [],
        message: "No recent updates to generate tips from"
      };
    }
    
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    // Create a summary of recent updates
    const updatesSummary = recentUpdates.map(update => 
      `- ${update.title}: ${update.summary}`
    ).join('\n');
    
    const prompt = `Based on these recent EU AI Act regulatory updates:
    
    ${updatesSummary}
    
    Generate practical compliance tips for organizations trying to maintain EU AI Act compliance.
    
    Provide your tips in JSON format with this structure:
    {
      "tips": [
        {
          "title": "Tip title",
          "description": "Detailed explanation",
          "relevance": "High/Medium/Low",
          "difficulty": "Easy/Moderate/Complex",
          "targetAudience": "Technical/Legal/Management",
          "timeframe": "Immediate/Short-term/Long-term"
        }
        // Generate 5-7 practical tips
      ]
    }`;
    
    const response = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in EU AI Act compliance who provides practical tips for organizations." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });
    
    if (!response?.content) {
      throw new Error("Empty AI response");
    }
    
    // Extract JSON from response
    let tipsResult;
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        tipsResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (error) {
      console.error("Error parsing compliance tips:", error);
      throw error;
    }
    
    if (!tipsResult || !tipsResult.tips || !Array.isArray(tipsResult.tips)) {
      throw new Error("Invalid compliance tips format");
    }
    
    return {
      success: true,
      tips: tipsResult.tips,
      message: `Generated ${tipsResult.tips.length} compliance tips`
    };
  } catch (error) {
    console.error("Error generating compliance tips:", error);
    return {
      success: false,
      message: `Failed to generate compliance tips: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Run a daily check for regulatory updates
 */
export async function runDailyUpdateCheck() {
  try {
    console.log("Checking for regulatory updates...");
    const updatesResult = await checkForRegulatoryUpdates();
    
    if (updatesResult.success && updatesResult.updates.length > 0) {
      console.log(`Found ${updatesResult.updates.length} new regulatory updates`);
    } else {
      console.log("No new regulatory updates found");
    }
    
    // Generate compliance tips based on recent updates
    console.log("Generating compliance tips...");
    const tipsResult = await generateComplianceTipUpdates();
    
    if (tipsResult.success && tipsResult.tips.length > 0) {
      console.log(`Generated ${tipsResult.tips.length} compliance tips`);
    } else {
      console.log("No compliance tips generated");
    }
    
    return {
      success: true,
      updates: updatesResult.success ? updatesResult.updates : [],
      tips: tipsResult.success ? tipsResult.tips : [],
      message: "Daily update check completed"
    };
  } catch (error) {
    console.error("Error running daily update check:", error);
    return {
      success: false,
      message: `Failed to run daily update check: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}