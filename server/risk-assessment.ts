
import { Request, Response } from 'express';
import { callDeepSeekApi } from './ai-analysis';
import { storage } from './storage';
import { handleError } from './error-handling';

interface RiskAssessmentResult {
  systemCategory: string;
  riskLevel: string;
  riskJustification: string;
  complianceScore: number;
  relevantArticles: string[];
  requiredDocumentation: string[];
  suggestedImprovements: string[];
}

/**
 * Analyze system risk based on EU AI Act criteria
 */
export async function analyzeSystemRisk(req: Request, res: Response) {
  try {
    const { systemId } = req.params;
    
    if (!systemId) {
      return res.status(400).json({ message: "System ID is required" });
    }
    
    // Get the system details from the database
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      return res.status(404).json({ message: "System not found" });
    }
    
    // Run comprehensive risk analysis
    const riskLevel = await determineRiskLevel(system);
    const systemCategory = await analyzeSystemCategory(system);
    const relevantArticles = await determineRelevantArticles(system);
    const suggestedImprovements = await generateImprovements(system);
    const requiredDocumentation = determineRequiredDocs(system);
    const complianceScore = calculateComplianceScore(system);
    
    // Create risk assessment record
    const assessmentData = {
      systemId: system.systemId,
      assessmentDate: new Date(),
      riskLevel,
      systemCategory,
      relevantArticles,
      requiredDocumentation,
      suggestedImprovements,
      complianceScore
    };
    
    // Save the assessment (this would be implemented in the storage module)
    // const assessment = await storage.createRiskAssessment(assessmentData);
    
    // Return the assessment results
    res.json({
      systemId: system.systemId,
      systemName: system.name,
      systemCategory,
      riskLevel,
      riskJustification: getRiskJustification(riskLevel, system),
      complianceScore,
      relevantArticles,
      requiredDocumentation,
      suggestedImprovements
    });
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * Generate risk justification based on risk level and system details
 */
function getRiskJustification(riskLevel: string, system: any): string {
  if (riskLevel.includes('High')) {
    if (system.department?.toLowerCase().includes('hr') || 
        system.purpose?.toLowerCase().includes('hiring') ||
        system.purpose?.toLowerCase().includes('recruitment')) {
      return 'This system is classified as High Risk under EU AI Act Annex III because it is used for employment, worker management, and access to self-employment (Article 6.2). Systems used for recruitment or selection of candidates require rigorous compliance with all high-risk system obligations.';
    } else if (system.purpose?.toLowerCase().includes('biometric') || 
               system.capabilities?.toLowerCase().includes('facial')) {
      return 'This system is classified as High Risk under EU AI Act Annex III because it involves biometric identification (Article 6.2). Biometric systems require rigorous compliance with all high-risk system obligations.';
    } else {
      return 'This system is classified as High Risk based on its purpose and potential impact on fundamental rights or safety. It requires full compliance with EU AI Act high-risk system obligations.';
    }
  } else if (riskLevel.includes('Limited')) {
    return 'This system is classified as Limited Risk, requiring specific transparency obligations but not the full compliance requirements of high-risk systems.';
  } else {
    return 'This system is classified as Minimal Risk under the EU AI Act. While no specific obligations apply beyond existing law, voluntary codes of practice are recommended.';
  }
}

/**
 * Analyze a system to determine prohibited usage
 */
export async function analyzeProhibitedUse(req: Request, res: Response) {
  try {
    const { systemId } = req.params;
    
    if (!systemId) {
      return res.status(400).json({ message: "System ID is required" });
    }
    
    // Get the system details from the database
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      return res.status(404).json({ message: "System not found" });
    }
    
    // Perform prohibited use analysis
    const prohibitedUsePrompt = `
      You are an EU AI Act compliance expert. Based on the following AI system details,
      determine if this system violates any prohibited use cases under Article 5 of the EU AI Act.
      
      System Name: ${system.name || 'N/A'}
      Description: ${system.description || 'N/A'}
      Purpose: ${system.purpose || 'N/A'}
      Department: ${system.department || 'N/A'}
      Capabilities: ${system.aiCapabilities || 'N/A'}
      
      Article 5 prohibits:
      1. Social scoring systems affecting fundamental rights
      2. Exploitation of vulnerabilities of specific groups
      3. Subliminal manipulation techniques
      4. Real-time remote biometric identification in public spaces (with limited exceptions)
      
      Provide a detailed analysis of whether this system falls under any prohibited categories.
      Return your answer in JSON format with isProhibited (boolean) and analysis (string) fields.
    `;
    
    const response = await callDeepSeekApi(prohibitedUsePrompt);
    
    try {
      const parsedResponse = JSON.parse(response);
      res.json({
        systemId: system.systemId,
        systemName: system.name,
        isProhibited: parsedResponse.isProhibited || false,
        analysis: parsedResponse.analysis || response
      });
    } catch (e) {
      // If parsing fails, return the raw response
      res.json({
        systemId: system.systemId,
        systemName: system.name,
        isProhibited: response.toLowerCase().includes('prohibited') || false,
        analysis: response
      });
    }
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * Generate a full risk assessment report
 */
export async function generateRiskReport(req: Request, res: Response) {
  try {
    const { systemId } = req.params;
    
    if (!systemId) {
      return res.status(400).json({ message: "System ID is required" });
    }
    
    // Get the system details from the database
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      return res.status(404).json({ message: "System not found" });
    }
    
    // Run comprehensive risk analysis
    const riskLevel = await determineRiskLevel(system);
    const systemCategory = await analyzeSystemCategory(system);
    const relevantArticles = await determineRelevantArticles(system);
    const suggestedImprovements = await generateImprovements(system);
    const requiredDocumentation = determineRequiredDocs(system);
    const complianceScore = calculateComplianceScore(system);
    
    // Generate the report content
    const reportPrompt = `
      You are an EU AI Act compliance expert generating a comprehensive risk assessment report.
      Create a detailed, professionally formatted risk assessment report based on the following information:
      
      System Name: ${system.name || 'N/A'}
      Description: ${system.description || 'N/A'}
      Purpose: ${system.purpose || 'N/A'}
      Department: ${system.department || 'N/A'}
      Capabilities: ${system.aiCapabilities || 'N/A'}
      Risk Level: ${riskLevel}
      System Category: ${systemCategory}
      Compliance Score: ${complianceScore}%
      Relevant Articles: ${relevantArticles.join(', ')}
      Required Documentation: ${requiredDocumentation.join(', ')}
      
      Include the following sections:
      1. Executive Summary
      2. System Overview
      3. Risk Classification Analysis
      4. Regulatory Requirements
      5. Gap Analysis
      6. Remediation Recommendations
      7. Conclusion
      
      Format the report with proper headings, subheadings, and professional language.
    `;
    
    const reportContent = await callDeepSeekApi(reportPrompt);
    
    res.json({
      systemId: system.systemId,
      systemName: system.name,
      reportDate: new Date(),
      reportContent,
      assessmentSummary: {
        riskLevel,
        systemCategory,
        complianceScore,
        relevantArticles,
        requiredDocumentation,
        suggestedImprovements
      }
    });
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * These functions are imported from ai-analysis.ts
 */
import { 
  analyzeSystemCategory, 
  determineRiskLevel, 
  determineRelevantArticles, 
  generateImprovements, 
  determineRequiredDocs, 
  calculateComplianceScore 
} from './ai-analysis';

/**
 * Create compliance gap analysis
 */
export async function analyzeComplianceGaps(req: Request, res: Response) {
  try {
    const { systemId } = req.params;
    
    if (!systemId) {
      return res.status(400).json({ message: "System ID is required" });
    }
    
    // Get the system details from the database
    const system = await storage.getAiSystemBySystemId(systemId);
    
    if (!system) {
      return res.status(404).json({ message: "System not found" });
    }
    
    // Run risk classification first to determine applicable requirements
    const riskLevel = await determineRiskLevel(system);
    
    // If not high risk, there are fewer requirements
    if (!riskLevel.includes('High')) {
      return res.json({
        systemId: system.systemId,
        systemName: system.name,
        riskLevel,
        gaps: [
          {
            requirementCategory: "Transparency",
            requirementReference: "Article 52",
            requirementDescription: "Transparency obligations for certain AI systems",
            complianceStatus: "Unknown",
            gapDescription: "Assessment needed for transparency requirements"
          }
        ]
      });
    }
    
    // For high risk systems, analyze gaps for all requirements
    res.json({
      systemId: system.systemId,
      systemName: system.name,
      riskLevel,
      gaps: [
        {
          requirementCategory: "RiskManagement",
          requirementReference: "Article 9",
          requirementDescription: "Risk management system implementation",
          complianceStatus: "NonCompliant",
          gapDescription: "No risk management system documented"
        },
        {
          requirementCategory: "DataGovernance",
          requirementReference: "Article 10",
          requirementDescription: "Data governance measures",
          complianceStatus: "PartiallyCompliant",
          gapDescription: "Incomplete data quality criteria documentation"
        },
        {
          requirementCategory: "TechnicalDocumentation",
          requirementReference: "Article 11",
          requirementDescription: "Technical documentation requirements",
          complianceStatus: "NonCompliant",
          gapDescription: "Missing technical documentation"
        },
        {
          requirementCategory: "RecordKeeping",
          requirementReference: "Article 12",
          requirementDescription: "Record-keeping obligation",
          complianceStatus: "Unknown",
          gapDescription: "Logging capabilities not assessed"
        },
        {
          requirementCategory: "Transparency",
          requirementReference: "Article 13",
          requirementDescription: "Transparency and information to users",
          complianceStatus: "NonCompliant",
          gapDescription: "No transparency information provided to users"
        },
        {
          requirementCategory: "HumanOversight",
          requirementReference: "Article 14",
          requirementDescription: "Human oversight measures",
          complianceStatus: "NonCompliant",
          gapDescription: "No human oversight measures documented"
        },
        {
          requirementCategory: "Accuracy",
          requirementReference: "Article 15",
          requirementDescription: "Accuracy, robustness and cybersecurity",
          complianceStatus: "PartiallyCompliant",
          gapDescription: "Incomplete accuracy metrics and security measures"
        }
      ]
    });
  } catch (error) {
    handleError(error, res);
  }
}
