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
      
      // AI analysis logic
      const aiAnalysis = {
        systemCategory: analyzeSystemCategory(systemData),
        riskClassification: determineRiskLevel(systemData),
        euAiActArticles: determineRelevantArticles(systemData),
        suggestedImprovements: generateImprovements(systemData),
        complianceScore: calculateComplianceScore(systemData),
        requiredDocumentation: determineRequiredDocs(systemData)
      };
      
      res.json(aiAnalysis);
    } catch (err) {
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

  // Setup HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
