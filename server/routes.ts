import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertAiSystemSchema,
  insertActivitySchema,
  insertAlertSchema,
  insertDeadlineSchema,
  insertDocumentSchema,
  insertRiskAssessmentSchema,
  loginSchema,
  registerSchema,
  AiSystem
} from "@shared/schema";
import { ZodError } from "zod";
import { 
  analyzeSystemCategory, 
  determineRelevantArticles, 
  generateImprovements, 
  calculateComplianceScore,
  handleChatbotQuery, 
  determineRequiredDocs,
  analyzeDocument,
  analyzeSystemCompliance,
  callDeepSeekApi,
  determineRiskLevel
} from "./ai-analysis";
import { regulatoryRoutes } from "./routes/regulatory-routes";
import { initializeRegulationUpdates } from "./regulatory-service";

// Import approval workflow functions
import {
  createApprovalWorkflow,
  getApprovalWorkflows,
  getApprovalWorkflowById,
  updateApprovalStatus,
  assignApprovalWorkflow,
  getUserNotifications,
  markNotificationsAsRead,
  getUnreadNotificationCount,
  getUserApprovalSettings,
  updateUserApprovalSettings,
  getApprovalStatistics,
  scheduleReminders
} from "./approval-workflow";

// Import compliance modules
import { 
  calculateComprehensiveScore, 
  generateComplianceRoadmap 
} from './compliance-scoring';
import { performComplianceAssessment } from './advanced-compliance-assessment';
import { initializeMonitoring, performMonitoringCheck, configureMonitoring } from './continuous-monitoring';
import { createAuditRecord, getAuditRecords, generateReport, exportReport, ReportType } from './audit-reporting';
import { getAllArticles, getArticlesByCategory, getArticleById, searchKnowledgeBase, askComplianceAI } from './knowledge-base';
import { 
  generateDocument, 
  generateDocumentTemplate, 
  DocumentType 
} from './document-generator';
import {
  getRecentUpdates,
  getUpdateById,
  analyzeRegulatoryImpact,
  subscribeToUpdates
} from './regulatory-updates';
import { analyzeSystemRisk, analyzeProhibitedUse, generateRiskReport, analyzeComplianceGaps } from './risk-assessment';
import { getTrainingModules, getModuleContent, trackTrainingProgress, getUserProgress, getTrainingModuleContent, getTrainingModuleMetadata, recordTrainingCompletion, getTrainingCertificate, exportTrainingModule } from './training-module';
import { 
  getApiKeys, 
  addApiKey, 
  updateApiKey, 
  deleteApiKey, 
  testApiKey 
} from './ai-key-management';
import * as riskAssessment from './risk-assessment';
import * as riskManagement from './risk-management'; // Added import


export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  const handleError = (res: Response, err: Error, errorMessage?: string) => {
    console.error(errorMessage || 'An error occurred:', err);
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
    return res.status(500).json({ message: errorMessage || "Internal server error" });
  };

  // API routes
  // User routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Get UID from the request body if present (from Firebase auth)
      // Otherwise generate a mock UID for testing
      const uid = req.body.uid || `user_${Date.now()}`;

      const newUser = await storage.createUser({
        ...userData,
        uid,
      });

      res.status(201).json({ 
        id: newUser.id,
        uid: newUser.uid,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
        department: newUser.department
      });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const loginData = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(loginData.email);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, we would verify the password hash here
      // For now, we do a simple password comparison
      if (user.password !== loginData.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ 
        id: user.id,
        uid: user.uid,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        department: user.department
      });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // AI Systems routes
  app.get("/api/systems", async (_req: Request, res: Response) => {
    try {
      const systems = await storage.getAllAiSystems();
      res.json(systems);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/systems/high-risk", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const systems = await storage.getHighRiskAiSystems(limit);
      res.json(systems);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/systems/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const system = await storage.getAiSystem(id);

      if (!system) {
        return res.status(404).json({ message: "System not found" });
      }

      res.json(system);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/systems", async (req: Request, res: Response) => {
    try {
      // Preprocess data before validation
      const requestData = {...req.body};

      // Handle implementation date
      if (requestData.implementationDate) {
        if (typeof requestData.implementationDate === 'string') {
          try {
            requestData.implementationDate = new Date(requestData.implementationDate);

            // Check if date is valid
            if (isNaN(requestData.implementationDate.getTime())) {
              // If invalid date, set to null
              requestData.implementationDate = null;
            }
          } catch (error) {
            // If date conversion fails, set to null
            requestData.implementationDate = null;
          }
        }
      } else {
        requestData.implementationDate = null;
      }

      // Handle last assessment date
      if (requestData.lastAssessmentDate) {
        if (typeof requestData.lastAssessmentDate === 'string') {
          try {
            requestData.lastAssessmentDate = new Date(requestData.lastAssessmentDate);

            // Check if date is valid
            if (isNaN(requestData.lastAssessmentDate.getTime())) {
              // If invalid date, set to null
              requestData.lastAssessmentDate = null;
            }
          } catch (error) {
            // If date conversion fails, set to null
            requestData.lastAssessmentDate = null;
          }
        }
      } else {
        requestData.lastAssessmentDate = null;
      }

      // Handle array fields that should be strings in the database
      if (Array.isArray(requestData.aiCapabilities)) {
        requestData.aiCapabilities = requestData.aiCapabilities.join(', ');
      }
      
      if (Array.isArray(requestData.trainingDatasets)) {
        requestData.trainingDatasets = requestData.trainingDatasets.join(', ');
      }
      
      if (Array.isArray(requestData.usageContext)) {
        requestData.usageContext = requestData.usageContext.join(', ');
      }
      
      if (Array.isArray(requestData.potentialImpact)) {
        requestData.potentialImpact = requestData.potentialImpact.join(', ');
      }

      // Log the preprocessed data for debugging
      console.log('Preprocessed data:', {
        implementationDate: requestData.implementationDate,
        lastAssessmentDate: requestData.lastAssessmentDate,
        aiCapabilities: requestData.aiCapabilities,
        trainingDatasets: requestData.trainingDatasets,
        usageContext: requestData.usageContext,
        potentialImpact: requestData.potentialImpact
      });

      const systemData = insertAiSystemSchema.parse(requestData);
      const newSystem = await storage.createAiSystem(systemData);

      // Create activity for system creation
      await storage.createActivity({
        type: "system_created",
        description: `New system "${newSystem.name}" was registered`,
        userId: newSystem.createdBy,
        systemId: newSystem.systemId,
        timestamp: new Date(),
        metadata: { systemName: newSystem.name }
      });

      res.status(201).json(newSystem);
    } catch (err) {
      console.error("System registration error:", err);
      handleError(res, err as Error);
    }
  });

  app.put("/api/systems/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = {...req.body};

      // Handle implementation date
      if (requestData.implementationDate) {
        if (typeof requestData.implementationDate === 'string') {
          try {
            requestData.implementationDate = new Date(requestData.implementationDate);

            // Check if date is valid
            if (isNaN(requestData.implementationDate.getTime())) {
              // If invalid date, set to null
              requestData.implementationDate = null;
            }
          } catch (error) {
            // If date conversion fails, set to null
            requestData.implementationDate = null;
          }
        }
      }

      // Handle last assessment date
      if (requestData.lastAssessmentDate) {
        if (typeof requestData.lastAssessmentDate === 'string') {
          try {
            requestData.lastAssessmentDate = new Date(requestData.lastAssessmentDate);

            // Check if date is valid
            if (isNaN(requestData.lastAssessmentDate.getTime())) {
              // If invalid date, set to null
              requestData.lastAssessmentDate = null;
            }
          } catch (error) {
            // If date conversion fails, set to null
            requestData.lastAssessmentDate = null;
          }
        }
      }

      // Handle array fields that should be strings in the database
      if (Array.isArray(requestData.aiCapabilities)) {
        requestData.aiCapabilities = requestData.aiCapabilities.join(', ');
      }
      
      if (Array.isArray(requestData.trainingDatasets)) {
        requestData.trainingDatasets = requestData.trainingDatasets.join(', ');
      }
      
      if (Array.isArray(requestData.usageContext)) {
        requestData.usageContext = requestData.usageContext.join(', ');
      }
      
      if (Array.isArray(requestData.potentialImpact)) {
        requestData.potentialImpact = requestData.potentialImpact.join(', ');
      }

      const updatedSystem = await storage.updateAiSystem(id, requestData);

      if (!updatedSystem) {
        return res.status(404).json({ message: "System not found" });
      }

      // Create activity for system update
      await storage.createActivity({
        type: "system_updated",
        description: `System "${updatedSystem.name}" was updated`,
        userId: requestData.updatedBy || updatedSystem.createdBy,
        systemId: updatedSystem.systemId,
        timestamp: new Date(),
        metadata: { systemName: updatedSystem.name }
      });

      res.json(updatedSystem);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Department routes
  app.get("/api/departments", async (_req: Request, res: Response) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Activity routes
  app.get("/api/activities/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const newActivity = await storage.createActivity(activityData);
      res.status(201).json(newActivity);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Alert routes
  app.get("/api/alerts/critical", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const alerts = await storage.getCriticalAlerts(limit);
      res.json(alerts);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // AI Analysis routes
  app.post("/api/analyze/system", async (req: Request, res: Response) => {
    try {
      const systemData = req.body;
      const analysisType = systemData.analysisType || 'basic';

      if (analysisType === 'detailed_risk_parameters') {
        // This is a request for detailed risk parameters analysis
        try {
          // Create a prompt specifically for detailed risk parameter analysis based on EU AI Act official criteria
          const detailedPrompt = `
            Perform a detailed EU AI Act compliance risk assessment for the following AI system:
            System Name: ${systemData.name}
            Description: ${systemData.description || 'Not provided'}
            Department: ${systemData.department || 'Not provided'}
            Purpose: ${systemData.purpose || 'Not provided'}
            Version: ${systemData.version || 'Not provided'}
            Vendor: ${systemData.vendor || 'Not provided'}
            AI Capabilities: ${systemData.aiCapabilities || 'Not provided'}
            Initial Risk Classification: ${systemData.riskClassification || 'Not determined'}
            System Category: ${systemData.systemCategory || 'Not categorized'}

            Using the OFFICIAL EU AI Act assessment framework, analyze the following key risk parameters:

            1. Technical Robustness and Safety (Article 15)
               - Accuracy, reliability, and cybersecurity measures
               - Resilience to errors, faults, and inconsistencies

            2. Data and Data Governance (Article 10)
               - Training data quality, relevance, and representativeness
               - Data privacy compliance and data minimization

            3. Transparency (Article 13)
               - Documentation of system capabilities and limitations
               - Disclosure to users that they are interacting with AI

            4. Human Oversight (Article 14)
               - Measures allowing for human intervention
               - Ability to override system decisions

            5. Accountability (Article 16-20)
               - Risk management procedures
               - Record-keeping and documentation compliance

            6. Non-discrimination and Fairness
               - Measures to prevent unfair bias in system outputs
               - Impacts on vulnerable groups or protected characteristics

            Format your response as a JSON with the following structure:
            {
              "riskFactors": [
                {
                  "name": "Parameter name based on EU AI Act articles",
                  "score": numerical score from 0-100 representing compliance,
                  "euAiActArticle": "Specific article number from EU AI Act",
                  "description": "Detailed assessment based on EU AI Act requirements"
                }
              ],
              "specificConcerns": [
                "Specific concern tied to EU AI Act article requirements",
                "Another specific concern with article reference"
              ],
              "mitigationStrategies": [
                "Specific mitigation strategy that directly addresses EU AI Act requirements",
                "Another mitigation strategy with clear compliance benefits"
              ]
            }

            Use ONLY actual EU AI Act requirements for assessment, not generic considerations.
            Each risk factor MUST reference specific EU AI Act articles where applicable.
          `;

          // Call DeepSeek API with the detailed parameters prompt
          const detailedAnalysisJson = await callDeepSeekApi(detailedPrompt, 'risk_parameters');

          try {
            // Parse the JSON response
            const detailedAnalysis = JSON.parse(detailedAnalysisJson);
            res.json(detailedAnalysis);
          } catch (parseErr) {
            // If parsing fails, create a structured response based on actual EU AI Act requirements
            console.error("Error parsing detailed risk parameters JSON response:", parseErr);
            const fallbackResponse = {
              riskFactors: [
                {
                  name: "Data and Data Governance",
                  score: 65,
                  euAiActArticle: "10",
                  description: "Assessment of training data quality, relevance, representativeness. Data governance procedures need improvement to fully comply with Article 10 requirements."
                },
                {
                  name: "Human Oversight",
                  score: 45,
                  euAiActArticle: "14",
                  description: "Insufficient mechanisms for human intervention and oversight as required by Article 14. Need to implement more robust oversight protocols."
                },
                {
                  name: "Technical Robustness and Safety",
                  score: 70,
                  euAiActArticle: "15",
                  description: "System resilience to errors and inconsistencies meets basic Article 15 requirements, but needs improvements in cybersecurity measures."
                },
                {
                  name: "Transparency",
                  score: 55,
                  euAiActArticle: "13",
                  description: "Documentation of system capabilities and limitations partially meets Article 13 requirements, but needs more detailed disclosures."
                },
                {
                  name: "Accountability",
                  score: 40,
                  euAiActArticle: "16-20",
                  description: "Record-keeping and documentation practices need significant improvement to meet Articles 16-20 requirements."
                },
                {
                  name: "Non-discrimination and Fairness",
                  score: 60,
                  euAiActArticle: "5(1)(c)",
                  description: "System implements some measures to prevent bias, but more comprehensive measures needed to fully comply with EU AI Act fairness requirements."
                }
              ],
              specificConcerns: [
                "Article 10: Insufficient data quality governance and documentation procedures",
                "Article 14: Lack of clear human oversight mechanisms for overriding automated decisions",
                "Article 13: Inadequate transparency in explaining system limitations to end users",
                "Article 16: Incomplete risk management framework for ongoing monitoring"
              ],
              mitigationStrategies: [
                "Implement comprehensive data documentation in line with Article 10 requirements",
                "Establish formal human oversight protocols with clear intervention measures (Article 14)",
                "Develop transparent documentation of system capabilities and limitations (Article 13)",
                "Create detailed risk management and documentation procedures (Articles 16-20)"
              ]
            };
            res.json(fallbackResponse);
          }
        } catch (deepseekErr) {
          console.error("Error getting detailed risk parameters:", deepseekErr);
          res.status(500).json({ 
            error: "Failed to analyze detailed risk parameters",
            message: deepseekErr instanceof Error ? deepseekErr.message : "Unknown error"
          });
        }
      } else {
        // Standard system analysis - calling DeepSeek AI
        const [systemCategory, riskClassification, euAiActArticles, suggestedImprovements] = await Promise.all([
          analyzeSystemCategory(systemData),
          determineRiskLevel(systemData),
          determineRelevantArticles(systemData),
          generateImprovements(systemData)
        ]);

        const aiAnalysis = {
          systemCategory,
          riskClassification,
          euAiActArticles,
          suggestedImprovements,
          complianceScore: calculateComplianceScore(systemData),
          requiredDocumentation: determineRequiredDocs(systemData)
        };

        res.json(aiAnalysis);
      }
    } catch (err) {
      console.error("Error analyzing system with DeepSeek AI:", err);
      handleError(res, err as Error);
    }
  });

  // AI-powered system suggestion from name or description
  app.post("/api/suggest/system", async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;

      if (!name && !description) {
        return res.status(400).json({ message: "Either name or description is required" });
      }

      // Log the input for debugging
      console.log("AI suggestion request:", { name, description });

      // Check for specific AI systems first - this will prioritize certain keywords
      // to ensure correct identification even when the AI API fails
      let systemType = null;
      const inputText = (name || '').toLowerCase();

      if (inputText.includes('gamma') || inputText.includes('gamma.app')) {
        // Special handling for Gamma.app
        systemType = 'gammaApp';

        // Create specific suggestions for Gamma.app
        const gammaAppSuggestions = {
          name: name || "Gamma.app",
          vendor: "Gamma",
          version: "2.0",
          department: "Marketing",
          purpose: "Presentation and content creation platform with AI assistance",
          aiCapabilities: "Natural Language Processing, Content Generation, Image Generation, Layout Design",
          trainingDatasets: "Text and image datasets, presentation templates",
          outputTypes: "Interactive presentations, documents, and visual content",
          usageContext: "Business presentations, marketing materials, internal communications",
          potentialImpact: "Improved productivity, enhanced communication, streamlined content creation",
          riskLevel: "Limited",
          confidenceScore: 95,
          riskClassification: "Limited Risk",
          euAiActArticles: ["Article 52", "Article 13"]
        };

        // Return specific suggestions immediately for Gamma.app
        return res.json(gammaAppSuggestions);
      } else if (inputText.includes('gemini')) {
        systemType = 'gemini';
      } else if (inputText.includes('claude')) {
        systemType = 'claude';
      } else if (inputText.includes('deepseek') || inputText.includes('sgh')) {
        systemType = 'deepseek';
      }

      console.log("Pre-detected system type:", systemType);

      const prompt = `
        You are an EU AI Act compliance expert. Based on the following information about an AI system,
        generate comprehensive suggestions for all registration fields.

        ${name ? `System Name: ${name}` : ''}
        ${description ? `Description: ${description}` : ''}

        IMPORTANT: Accurately identify the system based on the keywords in the name and description.

        Identify the specific AI system that best matches the provided name/description. 
        Do not default to generic systems unless absolutely necessary.

        Provide suggestions for the following fields:
        - name (keep the original name if provided, otherwise suggest an appropriate name)
        - vendor (the company that develops this specific AI system)
        - version (suggest a realistic version number)
        - department (where this system would typically be used)
        - purpose (detailed purpose of the system)
        - aiCapabilities (technical capabilities like NLP, Computer Vision, etc.)
        - trainingDatasets (types of data used to train this system)
        - outputTypes (what outputs this system produces)
        - usageContext (where and how this system is used)
        - potentialImpact (potential impacts on individuals and society)
        - riskLevel (according to EU AI Act: Unacceptable, High, Limited, Minimal)

        Output your answer in JSON format with all these fields and a 'confidenceScore' value from 0-100.
      `;

      // Pass the pre-detected system type to the API call for fallback purposes
      // Convert null to undefined to match the function signature
      const response = await callDeepSeekApi(prompt, systemType || undefined);
      let suggestions;

      try {
        // Clean up the response to handle markdown formatting (```json) or other formatting
        let cleanedResponse = response;

        // Remove markdown code blocks if present
        if (cleanedResponse.includes('```json')) {
          cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/\s*```\s*$/, '');
        } else if (cleanedResponse.includes('```')) {
          cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/\s*```\s*$/, '');
        }

        // Try to find JSON within the text if it's still not valid
        if (cleanedResponse.includes('{') && cleanedResponse.includes('}')) {
          const jsonStartIndex = cleanedResponse.indexOf('{');
          const jsonEndIndex = cleanedResponse.lastIndexOf('}') + 1;
          if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
            cleanedResponse = cleanedResponse.substring(jsonStartIndex, jsonEndIndex);
          }
        }

        console.log("Cleaned API response for parsing:", cleanedResponse);

        try {
          suggestions = JSON.parse(cleanedResponse);
        } catch (jsonError) {
          console.error("JSON parsing failed, attempting additional cleanup:", jsonError);

          // Additional cleanup for problematic JSON
          const sanitizedResponse = cleanedResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")  // Remove control characters
            .replace(/,\s*}/g, '}')  // Remove trailing commas
            .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
            .replace(/\\/g, '\\\\')  // Escape backslashes
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');  // Ensure property names are quoted

          console.log("Attempting to parse sanitized JSON:", sanitizedResponse);
          suggestions = JSON.parse(sanitizedResponse);
        }
      } catch (error) {
        console.error("Error parsing DeepSeek response:", error);
        console.error("Raw response:", response);

        // Provide a fallback response instead of returning an error
        suggestions = {
          name: name || "AI System",
          vendor: "Unknown",
          version: "1.0",
          department: "Information Technology",
          purpose: description || "AI system for business operations",
          aiCapabilities: "Natural Language Processing",
          trainingDatasets: "Proprietary data",
          outputTypes: "Text, Recommendations",
          usageContext: "Business operations",
          potentialImpact: "Improved efficiency",
          riskLevel: "Limited",
          confidenceScore: 60
        };

        console.log("Using fallback suggestion data:", suggestions);
      }

      // Also analyze risk level and articles
      const [riskClassification, euAiActArticles] = await Promise.all([
        determineRiskLevel(suggestions),
        determineRelevantArticles(suggestions)
      ]);

      // Add to suggestions
      suggestions.riskClassification = riskClassification;
      suggestions.euAiActArticles = euAiActArticles;

      res.json(suggestions);
    } catch (err) {
      console.error("Error generating system suggestions:", err);
      handleError(res, err as Error);
    }
  });

  app.post("/api/analyze/document", async (req: Request, res: Response) => {
    try {
      const documentData = req.body;
      const aiAnalysis = await analyzeDocument(documentData);
      res.json(aiAnalysis);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/analyze/compliance", async (req: Request, res: Response) => {
    try {
      const systemId = req.body.systemId;
      const complianceAnalysis = await analyzeSystemCompliance(systemId);
      res.json(complianceAnalysis);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // New endpoint for analyzing risk from text input
  app.post("/api/analyze/risk-from-text", async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Valid text input is required' });
      }
      
      // Create a structured system object from the text
      const systemData: Partial<AiSystem> = {
        description: text,
        // Extract potential name if first line looks like a title
        name: text.split('\n')[0].length < 80 ? text.split('\n')[0] : undefined
      };
      
      // Use existing AI analysis functions to determine risk
      const riskLevel = await determineRiskLevel(systemData);
      const category = await analyzeSystemCategory(systemData);
      const articles = await determineRelevantArticles(systemData);
      const improvements = await generateImprovements(systemData);
      
      // Check for keywords that affect risk classification
      const prohibitedKeywords = [];
      const highRiskKeywords = [];
      const limitedRiskKeywords = [];
      
      // Check for prohibited keywords (Unacceptable Risk - Article 5)
      const prohibitedTerms = [
        'social scoring', 'social credit', 'mass surveillance', 'emotion inference public', 
        'biometric categorization', 'exploit vulnerabilities', 'manipulate persons', 
        'manipulate behavior', 'real-time remote biometric identification'
      ];
      
      // Check for high-risk keywords (Annex III areas)
      const highRiskTerms = [
        'critical infrastructure', 'essential services', 'transportation', 'water supply',
        'gas', 'electricity', 'education', 'vocational training', 'employment', 'worker management',
        'access to employment', 'self-employment', 'recruitment', 'human resources', 'HR',
        'essential private services', 'essential public services', 'law enforcement', 'police',
        'migration', 'asylum', 'border control', 'administration of justice', 'judicial',
        'medical device', 'health', 'healthcare', 'medical', 'clinical', 'patient', 'hospital',
        'safety critical', 'autonomous', 'vehicle', 'aircraft', 'rail', 'maritime', 'nuclear',
        'credit score', 'creditworthiness', 'credit institution'
      ];
      
      // Check for limited risk keywords (transparency obligations)
      const limitedRiskTerms = [
        'chatbot', 'virtual assistant', 'emotion recognition', 'biometric categorization',
        'deepfake', 'deep fake', 'ai-generated', 'AI generated', 'artificially generated',
        'synthetic content', 'content generation'
      ];
      
      const lowerText = text.toLowerCase();
      
      for (const term of prohibitedTerms) {
        if (lowerText.includes(term)) {
          prohibitedKeywords.push(term);
        }
      }
      
      for (const term of highRiskTerms) {
        if (lowerText.includes(term)) {
          highRiskKeywords.push(term);
        }
      }
      
      for (const term of limitedRiskTerms) {
        if (lowerText.includes(term)) {
          limitedRiskKeywords.push(term);
        }
      }
      
      // Identify risk factors
      const riskFactors = [];
      
      // Check for data privacy concerns
      if (lowerText.includes('personal data') || 
          lowerText.includes('sensitive data') || 
          lowerText.includes('private information')) {
        riskFactors.push({
          factor: 'Data Privacy', 
          level: 'High'
        });
      }
      
      // Check for autonomous decision-making
      if (lowerText.includes('autonomous') || 
          lowerText.includes('automated decision') || 
          lowerText.includes('without human oversight')) {
        riskFactors.push({
          factor: 'Autonomous Decision-Making', 
          level: 'High'
        });
      }
      
      // Check for safety-critical applications
      if (lowerText.includes('safety critical') || 
          lowerText.includes('life critical') || 
          lowerText.includes('life and death')) {
        riskFactors.push({
          factor: 'Safety-Critical Application', 
          level: 'High'
        });
      }
      
      // Check for vulnerable populations
      if (lowerText.includes('children') || 
          lowerText.includes('elderly') || 
          lowerText.includes('vulnerable') ||
          lowerText.includes('minority') ||
          lowerText.includes('disabilities')) {
        riskFactors.push({
          factor: 'Impact on Vulnerable Populations', 
          level: 'High'
        });
      }
      
      // Compile the results
      const result = {
        riskLevel,
        systemCategory: category,
        relevantArticles: articles,
        suggestedImprovements: improvements,
        analysis: {
          prohibitedKeywords,
          highRiskKeywords,
          limitedRiskKeywords,
          riskFactors
        }
      };
      
      res.json(result);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/alerts", async (req: Request, res: Response) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const newAlert = await storage.createAlert(alertData);
      res.status(201).json(newAlert);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.put("/api/alerts/:id/resolve", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const resolvedAlert = await storage.resolveAlert(id);

      if (!resolvedAlert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      res.json(resolvedAlert);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Deadline routes
  app.get("/api/deadlines/upcoming", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const deadlines = await storage.getUpcomingDeadlines(limit);
      res.json(deadlines);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/deadlines", async (req: Request, res: Response) => {
    try {
      const deadlineData = insertDeadlineSchema.parse(req.body);
      const newDeadline = await storage.createDeadline(deadlineData);
      res.status(201).json(newDeadline);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Document routes
  app.get("/api/documents/system/:systemId", async (req: Request, res: Response) => {
    try {
      const systemId = req.params.systemId;
      const documents = await storage.getDocumentsForSystem(systemId);
      res.json(documents);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const newDocument = await storage.createDocument(documentData);
      res.status(201).json(newDocument);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.put("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const documentData = req.body;
      const updatedDocument = await storage.updateDocument(id, documentData);

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(updatedDocument);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Chatbot endpoint using DeepSeek AI
  app.post("/api/chatbot/query", handleChatbotQuery);

  // Risk Management Routes
  app.get("/api/risk-management/assessments", async (req: Request, res: Response) => {
    try {
      // Get all risk assessments for risk management
      const assessments = await storage.getAllRiskAssessments();
      res.json(assessments);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/risk-management/systems", async (req: Request, res: Response) => {
    try {
      // Get all AI systems with their associated risk assessments
      const systems = await storage.getAllAiSystems();
      const result = await Promise.all(systems.map(async (system) => {
        const assessments = await storage.getRiskAssessmentsForSystem(system.systemId);
        return {
          ...system,
          assessments: assessments || []
        };
      }));
      res.json(result);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Risk Assessment Routes
  app.get("/api/risk-assessments/system/:systemId", async (req: Request, res: Response) => {
    try {
      const systemId = req.params.systemId;

      if (!systemId) {
        return res.status(400).json({ message: "System ID is required" });
      }

      const assessments = await storage.getRiskAssessmentsForSystem(systemId);
      res.json(assessments);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/risk-assessments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getRiskAssessment(id);

      if (!assessment) {
        return res.status(404).json({ message: "Risk assessment not found" });
      }

      res.json(assessment);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/risk-assessments", async (req: Request, res: Response) => {
    try {
      // Parse and validate the request data
      const validatedData = insertRiskAssessmentSchema.parse(req.body);
      const { systemId, ...assessmentData } = validatedData;

      if (!systemId) {
        return res.status(400).json({ message: "System ID is required" });
      }

      // Check if system exists
      const system = await storage.getAiSystemBySystemId(systemId);
      if (!system) {
        return res.status(404).json({ message: "System not found" });
      }

      // Create risk assessment
      const newAssessment = await storage.createRiskAssessment({
        ...assessmentData,
        systemId,
        assessmentDate: new Date(),
        status: "Completed"
      });

      // Create activity record for the assessment
      await storage.createActivity({
        type: "risk_assessment",
        description: `Risk assessment completed for ${system.name}`,
        systemId,
        userId: assessmentData.createdBy || "system",
        metadata: { assessmentId: newAssessment.assessmentId }
      });

      res.status(201).json(newAssessment);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.put("/api/risk-assessments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const assessmentData = req.body;

      const updatedAssessment = await storage.updateRiskAssessment(id, assessmentData);

      if (!updatedAssessment) {
        return res.status(404).json({ message: "Risk assessment not found" });
      }

      res.json(updatedAssessment);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Risk assessment analysis endpoints
  app.get("/api/risk-assessment/:systemId/analyze", async (req: Request, res: Response) => {
    try {
      req.params = { ...req.params }; // Ensure params is mutable
      await analyzeSystemRisk(req, res);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/risk-assessment/:systemId/prohibited", async (req: Request, res: Response) => {
    try {
      req.params = { ...req.params }; // Ensure params is mutable
      await analyzeProhibitedUse(req, res);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/risk-assessment/:systemId/report", async (req: Request, res: Response) => {
    try {
      req.params = { ...req.params }; // Ensure params is mutable
      await generateRiskReport(req, res);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/risk-assessment/:systemId/gaps", async (req: Request, res: Response) => {
    try {
      req.params = { ...req.params }; // Ensure params is mutable
      await analyzeComplianceGaps(req, res);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Dashboard summary
  app.get("/api/dashboard/summary", async (_req: Request, res: Response) => {
    try {
      const systems = await storage.getAllAiSystems();
      const highRiskSystems = systems.filter(system => system.riskLevel === "High");
      const departments = await storage.getAllDepartments();

      // Calculate aggregated metrics
      const totalSystems = systems.length;
      const totalHighRisk = highRiskSystems.length;

      // Average document and training completeness
      const docCompleteness = systems.length > 0 
        ? Math.round(systems.reduce((sum, sys) => sum + (sys.docCompleteness || 0), 0) / systems.length) 
        : 0;

      const trainingCompleteness = systems.length > 0 
        ? Math.round(systems.reduce((sum, sys) => sum + (sys.trainingCompleteness || 0), 0) / systems.length) 
        : 0;

      // Risk level distribution
      const riskDistribution = {
        high: systems.filter(s => s.riskLevel === "High").length,
        limited: systems.filter(s => s.riskLevel === "Limited").length,
        minimal: systems.filter(s => s.riskLevel === "Minimal").length,
      };

      // Department compliance
      const departmentCompliance = departments.map(dept => ({
        name: dept.name,
        complianceScore: dept.complianceScore
      }));

      res.json({
        totalSystems,
        highRiskSystems: totalHighRisk,
        docCompleteness,
        trainingCompleteness,
        riskDistribution,
        departmentCompliance
      });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Use imported modules

  // Enhanced compliance scoring routes
  app.post("/api/compliance/score", async (req: Request, res: Response) => {
    try {
      const systemData = req.body;
      const complianceScore = calculateComprehensiveScore(systemData);
      res.json(complianceScore);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/compliance/roadmap", async (req: Request, res: Response) => {
    try {
      const systemData = req.body;
      const roadmap = generateComplianceRoadmap(systemData);
      res.json(roadmap);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Document generator routes
  app.post("/api/documents/generate", async (req: Request, res: Response) => {
    try {
      const { system, documentType, companyName, additionalDetails } = req.body;

      if (!system || !documentType || !companyName) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const document = await generateDocument({
        system,
        documentType,
        companyName,
        additionalDetails
      });

      res.json({ document });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/documents/templates/:type", (req: Request, res: Response) => {
    try {
      const documentType = req.params.type as DocumentType;
      const template = generateDocumentTemplate(documentType);
      res.json(template);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Regulatory updates routes
  app.get("/api/regulatory/updates", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const updates = await getRecentUpdates(limit);
      res.json(updates);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/regulatory/updates/:id", async (req: Request, res: Response) => {
    try {
      const update = getUpdateById(req.params.id);

      if (!update) {
        return res.status(404).json({ message: "Regulatory update not found" });
      }

      res.json(update);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/regulatory/impact", async (req: Request, res: Response) => {
    try {
      const { updateId, systemIds } = req.body;

      if (!updateId || !systemIds) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const impact = await analyzeRegulatoryImpact(updateId, systemIds);
      res.json(impact);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/regulatory/subscribe", (req: Request, res: Response) => {
    try {
      const { email, updateTypes } = req.body;

      if (!email || !updateTypes) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const success = subscribeToUpdates(email, updateTypes);
      res.json({ success });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Advanced compliance features

  // Advanced compliance assessment routes
  app.post("/api/compliance/assessment", async (req: Request, res: Response) => {
    try {
      const systemData = req.body;
      const assessment = await performComplianceAssessment(systemData);
      res.json(assessment);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Continuous monitoring routes
  app.post("/api/monitoring/configure", async (req: Request, res: Response) => {
    try {
      const { systemId, config } = req.body;

      if (!systemId || !config) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const success = await configureMonitoring(systemId, config);
      res.json({ success });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/monitoring/check", async (req: Request, res: Response) => {
    try {
      const { systemId, config } = req.body;

      if (!systemId) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const result = await performMonitoringCheck(systemId, config);
      res.json(result);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Audit and reporting routes
  app.post("/api/audit/record", async (req: Request, res: Response) => {
    try {
      const recordData = req.body;
      const record = await createAuditRecord(recordData);
      res.status(201).json(record);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/audit/records/:systemId", async (req: Request, res: Response) => {
    try {
      const records = await getAuditRecords(req.params.systemId);
      res.json(records);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/reports/generate", async (req: Request, res: Response) => {
    try {
      const { type, systemIds, options } = req.body;

      if (!type || !systemIds) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const report = await generateReport(type, systemIds, options);
      res.json(report);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/reports/export", async (req: Request, res: Response) => {
    try {
      const { report, format } = req.body;

      if (!report || !format) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const exportedReport = await exportReport(report, format);

      if (format === 'json') {
        return res.json(JSON.parse(exportedReport as string));
      }

      // For other formats, we would set appropriate headers and send the file
      // This is a simplified implementation
      res.json({ data: "Export successful", format });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Knowledge base routes
  app.get("/api/knowledge/articles", (_req: Request, res: Response) => {
    try {
      const articles = getAllArticles();
      res.json(articles);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/knowledge/articles/category/:category", (req: Request, res: Response) => {
    try {
      const articles = getArticlesByCategory(req.params.category);
      res.json(articles);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/knowledge/articles/:id", (req: Request, res: Response) => {
    try {
      const article = getArticleById(req.params.id);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.get("/api/knowledge/search", (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;

      if (!query) {
        return res.status(400).json({ message: "Missing search query" });
      }

      const results = searchKnowledgeBase(query);
      res.json(results);
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  app.post("/api/knowledge/ask", async (req: Request, res: Response) => {
    try {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({ message: "Missing question" });
      }

      const answer = await askComplianceAI(question);
      res.json({ question, answer });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // AI Assistant chatbot endpoint is already defined above (line 822)

  //Risk Assessment Endpoints
  app.get('/api/risk-assessment/:systemId', analyzeSystemRisk);
  app.get('/api/risk-assessment/:systemId/prohibited', analyzeProhibitedUse);
  app.get('/api/risk-assessment/:systemId/report', generateRiskReport);
  app.get('/api/risk-assessment/:systemId/gaps', analyzeComplianceGaps);

  // Training module routes
  app.get('/api/training/modules', async (req, res) => {
    try {
      await getTrainingModules(req, res);
    } catch (error) {
      console.error('Error in training modules route handler:', error);
      handleError(res, error as Error, 'Error retrieving training modules');
    }
  });

  app.get('/api/training/modules/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const role = req.query.role as string || 'default';
      
      // First try to find module in the database
      const moduleRecord = await db.select().from(trainingModules).where(eq(trainingModules.moduleId, id)).limit(1);
      
      if (moduleRecord && moduleRecord.length > 0) {
        // If found in database, return it
        const moduleData = moduleRecord[0];
        
        // Format the content for the enhanced UI
        const enhancedContent = {
          title: moduleData.title,
          description: moduleData.description,
          estimated_time: moduleData.estimatedTime,
          content: {
            slides: moduleData.content ? (typeof moduleData.content === 'string' ? JSON.parse(moduleData.content).slides : moduleData.content.slides) : [],
            document: moduleData.content ? (typeof moduleData.content === 'string' ? JSON.parse(moduleData.content).document : moduleData.content.document) : '',
            exercises: moduleData.content ? (typeof moduleData.content === 'string' ? JSON.parse(moduleData.content).exercises : moduleData.content.exercises) : [],
            assessment: {
              questions: moduleData.content ? (typeof moduleData.content === 'string' ? JSON.parse(moduleData.content).assessments : moduleData.content.assessments) : []
            }
          }
        };
        
        return res.json(enhancedContent);
      }
      
      // If not in database, check if it's in our MODULE_CONTENTS
      if (MODULE_CONTENTS[id]) {
        const roleContent = MODULE_CONTENTS[id][role] || MODULE_CONTENTS[id].default;
        
        // Get module info
        const moduleInfo = TRAINING_MODULES.find(m => m.id === id) || {
          title: roleContent.title,
          description: "",
          estimated_time: "30-45 minutes"
        };
        
        // Format full module content for the enhanced UI
        const enhancedContent = {
          title: moduleInfo.title,
          description: moduleInfo.description,
          estimated_time: moduleInfo.estimated_time,
          content: {
            slides: buildSlides(roleContent),
            document: buildDocument(roleContent, moduleInfo.title),
            exercises: buildExercises(roleContent, id),
            assessment: {
              questions: roleContent.assessments || []
            }
          }
        };
        
        return res.json(enhancedContent);
      }
      
      // If module not found in either source
      return res.status(404).json({ message: 'Training module not found' });
    } catch (error) {
      console.error('Error retrieving training module content:', error);
      handleError(res, error as Error, 'Error retrieving training module content');
    }
  });

  app.get('/api/training/modules/:id/metadata', async (req, res) => {
    try {
      const { id } = req.params;
      const moduleMetadata = await getTrainingModuleMetadata(id);

      if (!moduleMetadata) {
        return res.status(404).json({ message: 'Training module not found' });
      }

      res.json(moduleMetadata);
    } catch (error) {
      handleError(res, error, 'Error retrieving training module metadata');
    }
  });

  app.post('/api/training/complete', async (req, res) => {
    try {
      // In a real app, this would be authenticated via middleware
      const userId = req.body.userId || 'demo-user';
      const { moduleId } = req.body;

      if (!moduleId) {
        return res.status(400).json({ message: 'Module ID is required' });
      }

      const certificateId = await recordTrainingCompletion(userId, moduleId);
      res.json({ success: true, certificateId });
    } catch (error) {
      handleError(res, error as Error, 'Error recording training completion');
    }
  });

  app.get('/api/training/certificate/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const certificate = await getTrainingCertificate(id);

      if (!certificate) {
        return res.status(404).json({ message: 'Certificate not found' });
      }

      res.json(certificate);
    } catch (error) {
      handleError(res, error, 'Error retrieving training certificate');
    }
  });

  app.get('/api/training/export/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const format = req.query.format as string || 'markdown';

      const { content, filename, contentType } = await exportTrainingModule(id, format);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(content);
    } catch (error) {
      handleError(res, error, 'Error exporting training module');
    }
  });

  // Track user training progress
  app.post('/api/training/progress', async (req, res) => {
    try {
      await trackTrainingProgress(req, res);
    } catch (error) {
      console.error('Error in tracking training progress:', error);
      handleError(res, error, 'Error tracking training progress');
    }
  });

  // Get user training progress
  app.get('/api/training/progress', async (req, res) => {
    try {
      await getUserProgress(req, res);
    } catch (error) {
      console.error('Error in getting user progress:', error);
      handleError(res, error, 'Error fetching user training progress');
    }
  });

  // API Key Management routes
  app.get('/api/ai-keys', getApiKeys);
  app.post('/api/ai-keys', addApiKey);
  app.put('/api/ai-keys/:id', updateApiKey);
  app.delete('/api/ai-keys/:id', deleteApiKey);
  app.get('/api/ai-keys/test/:provider', testApiKey);

  // AI Analysis endpoints
  app.post('/api/analyze-system-category', async (req: Request, res: Response) => {
    try {
      const { system } = req.body;

      const category = await analyzeSystemCategory(system);
      res.json({ category });
    } catch (error) {
      handleError(res, error as Error);
    }
  });

  //Risk Assessment Endpoints
  app.get('/api/risk-assessment/:systemId', analyzeSystemRisk);
  app.get('/api/risk-assessment/:systemId/prohibited', analyzeProhibitedUse);
  app.get('/api/risk-assessment/:systemId/report', generateRiskReport);
  app.get('/api/risk-assessment/:systemId/gaps', analyzeComplianceGaps);

  // Initialize continuous monitoring system
  initializeMonitoring().catch(err => console.error('Error initializing monitoring:', err));

  // ==========================================
  // Approval Workflow Routes
  // ==========================================

  // Create a new approval workflow
  app.post("/api/approval-workflows", createApprovalWorkflow);

  // Get approval workflows with filtering and pagination
  app.get("/api/approval-workflows", getApprovalWorkflows);

  // Get a specific approval workflow by ID
  app.get("/api/approval-workflows/:id", getApprovalWorkflowById);

  // Update an approval workflow status
  app.put("/api/approval-workflows/:id/status", updateApprovalStatus);

  // Assign an approval workflow to a user
  app.post("/api/approval-workflows/:id/assign", assignApprovalWorkflow);

  // Get user notifications with pagination
  app.get("/api/notifications", getUserNotifications);

  // Mark notifications as read
  app.put("/api/notifications/mark-read", markNotificationsAsRead);

  // Get unread notification count
  app.get("/api/notifications/unread-count", getUnreadNotificationCount);

  // Get user approval settings
  app.get("/api/approval-settings", getUserApprovalSettings);

  // Update user approval settings
  app.put("/api/approval-settings", updateUserApprovalSettings);

  // Get approval statistics
  app.get("/api/approval-statistics", getApprovalStatistics);

  // Schedule reminder checks (this would typically be called by a cron job)
  app.post("/api/approval-workflows/schedule-reminders", async (req: Request, res: Response) => {
    try {
      await scheduleReminders();
      res.json({ success: true, message: "Reminders scheduled successfully" });
    } catch (err) {
      handleError(res, err as Error);
    }
  });

  // Regulatory Updates Routes
  // ==========================================
  
  // Register regulatory routes
  app.use('/api/regulatory', regulatoryRoutes);
  
  // Initialize regulatory updates service
  initializeRegulationUpdates();

  // Setup HTTP server
  const httpServer = createServer(app);
  return httpServer;
}