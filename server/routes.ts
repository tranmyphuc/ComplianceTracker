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
  loginSchema,
  registerSchema,
} from "@shared/schema";
import { ZodError } from "zod";
import { 
  analyzeSystemCategory, 
  determineRiskLevel, 
  determineRelevantArticles, 
  generateImprovements, 
  calculateComplianceScore,
  handleChatbotQuery, 
  determineRequiredDocs,
  analyzeDocument,
  analyzeSystemCompliance,
  callDeepSeekApi
} from "./ai-analysis";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  const handleError = (err: Error, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
    return res.status(500).json({ message: "Internal server error" });
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });

  // AI Systems routes
  app.get("/api/systems", async (_req: Request, res: Response) => {
    try {
      const systems = await storage.getAllAiSystems();
      res.json(systems);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  app.get("/api/systems/high-risk", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const systems = await storage.getHighRiskAiSystems(limit);
      res.json(systems);
    } catch (err) {
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });

  app.post("/api/systems", async (req: Request, res: Response) => {
    try {
      const systemData = insertAiSystemSchema.parse(req.body);
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
      handleError(err as Error, res);
    }
  });

  app.put("/api/systems/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const systemData = req.body;
      const updatedSystem = await storage.updateAiSystem(id, systemData);
      
      if (!updatedSystem) {
        return res.status(404).json({ message: "System not found" });
      }
      
      // Create activity for system update
      await storage.createActivity({
        type: "system_updated",
        description: `System "${updatedSystem.name}" was updated`,
        userId: systemData.updatedBy || updatedSystem.createdBy,
        systemId: updatedSystem.systemId,
        timestamp: new Date(),
        metadata: { systemName: updatedSystem.name }
      });
      
      res.json(updatedSystem);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  // Department routes
  app.get("/api/departments", async (_req: Request, res: Response) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  // Activity routes
  app.get("/api/activities/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const newActivity = await storage.createActivity(activityData);
      res.status(201).json(newActivity);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  // Alert routes
  app.get("/api/alerts/critical", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const alerts = await storage.getCriticalAlerts(limit);
      res.json(alerts);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  // AI Analysis routes
  app.post("/api/analyze/system", async (req: Request, res: Response) => {
    try {
      const systemData = req.body;
      
      // AI analysis logic - calling DeepSeek AI
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
    } catch (err) {
      console.error("Error analyzing system with DeepSeek AI:", err);
      handleError(err as Error, res);
    }
  });
  
  // AI-powered system suggestion from name or description
  app.post("/api/suggest/system", async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      
      if (!name && !description) {
        return res.status(400).json({ message: "Either name or description is required" });
      }
      
      const prompt = `
        You are an EU AI Act compliance expert. Based on the following information about an AI system,
        generate comprehensive suggestions for all registration fields.
        
        ${name ? `System Name: ${name}` : ''}
        ${description ? `Description: ${description}` : ''}
        
        Provide suggestions for the following fields:
        - name (if not provided)
        - vendor (suggest a realistic vendor name)
        - version (suggest a realistic version number)
        - department (where this system would typically be used)
        - purpose (detailed purpose of the system)
        - aiCapabilities (technical capabilities like NLP, Computer Vision, etc.)
        - trainingDatasets (types of data used to train this system)
        - outputTypes (what outputs this system produces)
        - usageContext (where and how this system is used)
        - potentialImpact (potential impacts on individuals and society)
        - riskLevel (according to EU AI Act: Unacceptable, High, Limited, Minimal)
        
        Output your answer in JSON format with all these fields and a 'confidence' value from 0-100.
      `;
      
      const response = await callDeepSeekApi(prompt);
      let suggestions;
      
      try {
        suggestions = JSON.parse(response);
      } catch (error) {
        console.error("Error parsing DeepSeek response:", error);
        return res.status(500).json({ message: "Failed to parse AI suggestions" });
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
      handleError(err as Error, res);
    }
  });

  app.post("/api/analyze/document", async (req: Request, res: Response) => {
    try {
      const documentData = req.body;
      const aiAnalysis = await analyzeDocument(documentData);
      res.json(aiAnalysis);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  app.post("/api/analyze/compliance", async (req: Request, res: Response) => {
    try {
      const systemId = req.body.systemId;
      const complianceAnalysis = await analyzeSystemCompliance(systemId);
      res.json(complianceAnalysis);
    } catch (err) {
      handleError(err as Error, res);
    }
  });


  app.post("/api/alerts", async (req: Request, res: Response) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const newAlert = await storage.createAlert(alertData);
      res.status(201).json(newAlert);
    } catch (err) {
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });

  // Deadline routes
  app.get("/api/deadlines/upcoming", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const deadlines = await storage.getUpcomingDeadlines(limit);
      res.json(deadlines);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  app.post("/api/deadlines", async (req: Request, res: Response) => {
    try {
      const deadlineData = insertDeadlineSchema.parse(req.body);
      const newDeadline = await storage.createDeadline(deadlineData);
      res.status(201).json(newDeadline);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  // Document routes
  app.get("/api/documents/system/:systemId", async (req: Request, res: Response) => {
    try {
      const systemId = req.params.systemId;
      const documents = await storage.getDocumentsForSystem(systemId);
      res.json(documents);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const newDocument = await storage.createDocument(documentData);
      res.status(201).json(newDocument);
    } catch (err) {
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });
  
  // Chatbot endpoint using DeepSeek AI
  app.post("/api/chatbot/query", handleChatbotQuery);

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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });

  app.post("/api/compliance/roadmap", async (req: Request, res: Response) => {
    try {
      const systemData = req.body;
      const roadmap = generateComplianceRoadmap(systemData);
      res.json(roadmap);
    } catch (err) {
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });

  app.get("/api/documents/templates/:type", (req: Request, res: Response) => {
    try {
      const documentType = req.params.type as DocumentType;
      const template = generateDocumentTemplate(documentType);
      res.json(template);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  // Regulatory updates routes
  app.get("/api/regulatory/updates", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const updates = await getRecentUpdates(limit);
      res.json(updates);
    } catch (err) {
      handleError(err as Error, res);
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });

  // Audit and reporting routes
  app.post("/api/audit/record", async (req: Request, res: Response) => {
    try {
      const recordData = req.body;
      const record = await createAuditRecord(recordData);
      res.status(201).json(record);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  app.get("/api/audit/records/:systemId", async (req: Request, res: Response) => {
    try {
      const records = await getAuditRecords(req.params.systemId);
      res.json(records);
    } catch (err) {
      handleError(err as Error, res);
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });

  // Knowledge base routes
  app.get("/api/knowledge/articles", (_req: Request, res: Response) => {
    try {
      const articles = getAllArticles();
      res.json(articles);
    } catch (err) {
      handleError(err as Error, res);
    }
  });

  app.get("/api/knowledge/articles/category/:category", (req: Request, res: Response) => {
    try {
      const articles = getArticlesByCategory(req.params.category);
      res.json(articles);
    } catch (err) {
      handleError(err as Error, res);
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
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
      handleError(err as Error, res);
    }
  });

  // Initialize continuous monitoring system
  initializeMonitoring().catch(err => console.error('Error initializing monitoring:', err));

  // Setup HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
