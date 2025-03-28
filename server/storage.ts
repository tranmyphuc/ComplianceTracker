import {
  users, type User, type InsertUser,
  aiSystems, type AiSystem, type InsertAiSystem,
  departments, type Department, type InsertDepartment,
  activities, type Activity, type InsertActivity,
  alerts, type Alert, type InsertAlert,
  deadlines, type Deadline, type InsertDeadline,
  documents, type Document, type InsertDocument,
  riskAssessments, type RiskAssessment, type InsertRiskAssessment,
  approvalItems, type ApprovalItem, type InsertApprovalItem,
  approvalAssignments, type ApprovalAssignment, type InsertApprovalAssignment,
  approvalHistory, type ApprovalHistory, type InsertApprovalHistory,
  approvalNotifications, type ApprovalNotification, type InsertApprovalNotification,
  approvalSettings, type ApprovalSettings, type InsertApprovalSettings,
  expertReviews, type ExpertReview, type InsertExpertReview
} from "@shared/schema";
import { documentFiles, type DocumentFile, type InsertDocumentFile } from "@shared/schemas/document";
import { eq, desc, or, like, sql } from "drizzle-orm";
import { db } from "./db";

// Implement storage interface with CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // AI System operations
  getAiSystem(id: number): Promise<AiSystem | undefined>;
  getAiSystemBySystemId(systemId: string): Promise<AiSystem | undefined>;
  getAllAiSystems(): Promise<AiSystem[]>;
  getHighRiskAiSystems(limit?: number): Promise<AiSystem[]>;
  createAiSystem(system: InsertAiSystem): Promise<AiSystem>;
  updateAiSystem(id: number, system: Partial<AiSystem>): Promise<AiSystem | undefined>;
  deleteAiSystem(id: number): Promise<boolean>;

  // Department operations
  getDepartment(id: number): Promise<Department | undefined>;
  getAllDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<Department>): Promise<Department | undefined>;

  // Activity operations
  getRecentActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Alert operations
  getCriticalAlerts(limit: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<Alert | undefined>;

  // Deadline operations
  getUpcomingDeadlines(limit: number): Promise<Deadline[]>;
  createDeadline(deadline: InsertDeadline): Promise<Deadline>;

  // Document operations
  getDocumentsForSystem(systemId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined>;
  
  // Document File operations
  createDocumentFile(document: InsertDocumentFile): Promise<DocumentFile>;
  getDocumentFileById(documentId: string): Promise<DocumentFile | null>;
  getDocumentFilesByAssessment(assessmentId: string): Promise<DocumentFile[]>;
  getDocumentFilesBySystem(systemId: string): Promise<DocumentFile[]>;
  deleteDocumentFile(documentId: string): Promise<boolean>;

  // Risk Assessment operations
  getRiskAssessment(id: number): Promise<RiskAssessment | undefined>;
  getRiskAssessmentByAssessmentId(assessmentId: string): Promise<RiskAssessment | undefined>;
  getRiskAssessmentsForSystem(systemId: string): Promise<RiskAssessment[]>;
  getAllRiskAssessments(): Promise<RiskAssessment[]>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessment(id: number, assessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined>;
  deleteRiskAssessment(id: number): Promise<boolean>;

  /**
   * Risk Management System operations
   */
  createRiskManagementSystem(rms: any): Promise<any>;
  getRiskManagementSystemBySystemId(systemId: string): Promise<any>;
  updateRiskManagementSystem(rmsId: string, updates: any): Promise<any>;


  /**
   * Risk Control operations
   */
  createRiskControl(control: any): Promise<any>;
  getRiskControlByControlId(controlId: string): Promise<any>;
  getRiskControlsBySystemId(systemId: string): Promise<any[]>;
  getRiskControlsByGapId(gapId: string): Promise<any[]>;
  updateRiskControl(controlId: string, updates: any): Promise<any>;

  /**
   * Risk Event operations
   */
  createRiskEvent(event: any): Promise<any>;
  getRiskEventByEventId(eventId: string): Promise<any>;
  getRiskEventsBySystemId(systemId: string): Promise<any[]>;
  updateRiskEvent(eventId: string, updates: any): Promise<any>;

  /**
   * Approval Workflow operations
   */
  // Approval Item operations
  createApprovalItem(item: InsertApprovalItem): Promise<ApprovalItem>;
  getApprovalItem(id: number): Promise<ApprovalItem | undefined>;
  getApprovalItemByWorkflowId(workflowId: string): Promise<ApprovalItem | undefined>;
  getAllApprovalItems(options?: { 
    status?: string;
    moduleType?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApprovalItem[]>;
  updateApprovalItem(workflowId: string, updates: Partial<ApprovalItem>): Promise<ApprovalItem | undefined>;
  
  // Approval Assignment operations
  createApprovalAssignment(assignment: InsertApprovalAssignment): Promise<ApprovalAssignment>;
  getApprovalAssignment(id: number): Promise<ApprovalAssignment | undefined>;
  getApprovalAssignmentsByWorkflowId(workflowId: string): Promise<ApprovalAssignment[]>;
  getApprovalAssignmentsByUserId(userId: string): Promise<ApprovalAssignment[]>;
  updateApprovalAssignment(id: number, updates: Partial<ApprovalAssignment>): Promise<ApprovalAssignment | undefined>;
  
  // Approval History operations
  createApprovalHistory(history: InsertApprovalHistory): Promise<ApprovalHistory>;
  getApprovalHistoryByWorkflowId(workflowId: string): Promise<ApprovalHistory[]>;
  
  // Approval Notification operations
  createApprovalNotification(notification: InsertApprovalNotification): Promise<ApprovalNotification>;
  getApprovalNotificationsByUserId(userId: string, options?: {
    isRead?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApprovalNotification[]>;
  markNotificationsAsRead(notificationIds: number[]): Promise<void>;
  
  // Approval Settings operations
  getApprovalSettings(userId: string): Promise<ApprovalSettings | undefined>;
  createApprovalSettings(settings: InsertApprovalSettings): Promise<ApprovalSettings>;
  updateApprovalSettings(userId: string, updates: Partial<ApprovalSettings>): Promise<ApprovalSettings | undefined>;

  // Expert Review operations
  getExpertReviews(options?: { status?: string; type?: string }): Promise<ExpertReview[]>;
  getExpertReviewById(reviewId: string): Promise<ExpertReview | null>;
  createExpertReview(review: InsertExpertReview): Promise<ExpertReview>;
  updateExpertReview(reviewId: string, updates: Partial<InsertExpertReview>): Promise<ExpertReview>;
  deleteExpertReview(reviewId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiSystems: Map<number, AiSystem>;
  private departments: Map<number, Department>;
  private activities: Map<number, Activity>;
  private alerts: Map<number, Alert>;

  /**
   * Initialize demo data for memory storage
   * This method is called when database is unavailable to ensure the application has data to work with
   */
  public initializeDemoData(): void {
    console.log("Initializing demo data for memory storage as database is unavailable");
    
    // Initialize users if empty
    if (this.users.size === 0) {
      this.users.set(1, {
        id: 1,
        uid: "demo-admin-uid",
        email: "admin@sghasia.com",
        displayName: "Demo Admin",
        username: "admin",
        department: "IT",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Initialize departments if empty
    if (this.departments.size === 0) {
      this.departments.set(1, {
        id: 1,
        name: "IT",
        description: "Information Technology Department",
        createdAt: new Date()
      });
      
      this.departments.set(2, {
        id: 2,
        name: "R&D",
        description: "Research and Development",
        createdAt: new Date()
      });
      
      this.departments.set(3, {
        id: 3,
        name: "HR",
        description: "Human Resources",
        createdAt: new Date()
      });
    }
    
    // Initialize AI systems if empty
    if (this.aiSystems.size === 0) {
      this.aiSystems.set(1, {
        id: 1,
        systemId: "AI-SYS-1001",
        name: "Recruitment Assistant",
        description: "AI system for screening job applicants and suggesting candidates",
        vendor: "SGH ASIA",
        department: "HR",
        purpose: "Automate initial screening of job applications",
        version: "1.0.0",
        aiCapabilities: "Natural language processing, resume parsing, candidate ranking",
        trainingDatasets: "Historical hiring data, anonymized resumes",
        usageContext: "Internal HR department only",
        potentialImpact: "Medium impact on hiring decisions",
        category: "employment",
        riskLevel: "high_risk",
        status: "active",
        createdBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.aiSystems.set(2, {
        id: 2,
        systemId: "AI-SYS-1002",
        name: "Customer Sentiment Analyzer",
        description: "Analyzes customer feedback to identify sentiment and key issues",
        vendor: "SGH ASIA",
        department: "Customer Service",
        purpose: "Improve customer satisfaction and response times",
        version: "2.1.0",
        aiCapabilities: "Sentiment analysis, keyword extraction, trend identification",
        trainingDatasets: "Customer feedback, support tickets, call transcripts",
        usageContext: "Internal customer service team",
        potentialImpact: "Low impact on individual customers",
        category: "recommendation",
        riskLevel: "limited_risk",
        status: "active",
        createdBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.aiSystems.set(3, {
        id: 3,
        systemId: "AI-SYS-1003",
        name: "Predictive Maintenance System",
        description: "Predicts equipment failures before they occur",
        vendor: "SGH ASIA",
        department: "Operations",
        purpose: "Reduce downtime and maintenance costs",
        version: "1.5.0",
        aiCapabilities: "Anomaly detection, time series analysis, predictive modeling",
        trainingDatasets: "Sensor data, maintenance logs, equipment specifications",
        usageContext: "Manufacturing floor operations",
        potentialImpact: "Medium impact on operational decisions",
        category: "critical_infrastructure",
        riskLevel: "high_risk",
        status: "active",
        createdBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Initialize activities if empty
    if (this.activities.size === 0) {
      this.activities.set(1, {
        id: 1,
        userId: 1,
        action: "System Registration",
        description: "Registered new AI system: Recruitment Assistant",
        timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
        metadata: JSON.stringify({ systemId: "AI-SYS-1001" })
      });
      
      this.activities.set(2, {
        id: 2,
        userId: 1,
        action: "Risk Assessment",
        description: "Completed risk assessment for Customer Sentiment Analyzer",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        metadata: JSON.stringify({ systemId: "AI-SYS-1002", riskLevel: "limited_risk" })
      });
      
      this.activities.set(3, {
        id: 3,
        userId: 1,
        action: "Document Generation",
        description: "Generated technical documentation for Predictive Maintenance System",
        timestamp: new Date(),
        metadata: JSON.stringify({ systemId: "AI-SYS-1003", documentType: "technical_documentation" })
      });
    }
    
    // Initialize alerts if empty
    if (this.alerts.size === 0) {
      this.alerts.set(1, {
        id: 1,
        title: "High-risk system needs review",
        description: "Recruitment Assistant system requires a detailed risk assessment",
        severity: "high",
        status: "active",
        systemId: "AI-SYS-1001",
        createdAt: new Date(),
        resolvedAt: null
      });
      
      this.alerts.set(2, {
        id: 2,
        title: "Documentation update required",
        description: "EU AI Act Article 11 compliance documentation needs update for Predictive Maintenance System",
        severity: "medium",
        status: "active",
        systemId: "AI-SYS-1003",
        createdAt: new Date(),
        resolvedAt: null
      });
    }
  }
  private deadlines: Map<number, Deadline>;
  private documents: Map<number, Document>;
  private documentFiles: Map<string, DocumentFile>;
  private riskAssessments: Map<number, RiskAssessment>;
  private expertReviews: Map<number, ExpertReview>;

  private userIdCounter: number;
  private systemIdCounter: number;
  private departmentIdCounter: number;
  private activityIdCounter: number;
  private alertIdCounter: number;
  private deadlineIdCounter: number;
  private documentIdCounter: number;
  private riskAssessmentIdCounter: number;
  private expertReviewIdCounter: number;

  constructor() {
    this.users = new Map();
    this.aiSystems = new Map();
    this.departments = new Map();
    this.activities = new Map();
    this.alerts = new Map();
    this.deadlines = new Map();
    this.documents = new Map();
    this.documentFiles = new Map();
    this.riskAssessments = new Map();
    this.expertReviews = new Map();

    this.userIdCounter = 1;
    this.systemIdCounter = 1;
    this.departmentIdCounter = 1;
    this.activityIdCounter = 1;
    this.alertIdCounter = 1;
    this.deadlineIdCounter = 1;
    this.documentIdCounter = 1;
    this.riskAssessmentIdCounter = 1;
    this.expertReviewIdCounter = 1;

    // Initialize with some sample departments
    this.initializeDepartments();
  }

  private initializeDepartments() {
    const departments = [
      { name: "Engineering", complianceScore: 87 },
      { name: "Marketing", complianceScore: 65 },
      { name: "Human Resources", complianceScore: 92 },
      { name: "Customer Service", complianceScore: 78 },
      { name: "Finance", complianceScore: 56 }
    ];

    departments.forEach(dept => {
      this.createDepartment(dept);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const newUser: User = { ...user, id, createdAt: now };
    this.users.set(id, newUser);
    return newUser;
  }

  // AI System methods
  async getAiSystem(id: number): Promise<AiSystem | undefined> {
    return this.aiSystems.get(id);
  }

  async getAiSystemBySystemId(systemId: string): Promise<AiSystem | undefined> {
    return Array.from(this.aiSystems.values()).find(system => system.systemId === systemId);
  }

  async getAllAiSystems(): Promise<AiSystem[]> {
    return Array.from(this.aiSystems.values());
  }

  async getHighRiskAiSystems(limit = 5): Promise<AiSystem[]> {
    return Array.from(this.aiSystems.values())
      .filter(system => system.riskLevel === "High")
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
      .slice(0, limit);
  }

  async createAiSystem(system: InsertAiSystem): Promise<AiSystem> {
    const id = this.systemIdCounter++;
    const now = new Date();
    const newSystem: AiSystem = { 
      ...system, 
      id, 
      createdAt: now, 
      updatedAt: now
    };
    this.aiSystems.set(id, newSystem);
    return newSystem;
  }

  async updateAiSystem(id: number, system: Partial<AiSystem>): Promise<AiSystem | undefined> {
    const existingSystem = this.aiSystems.get(id);
    if (!existingSystem) return undefined;

    const updatedSystem = { 
      ...existingSystem, 
      ...system, 
      updatedAt: new Date() 
    };
    this.aiSystems.set(id, updatedSystem);
    return updatedSystem;
  }

  async deleteAiSystem(id: number): Promise<boolean> {
    return this.aiSystems.delete(id);
  }

  // Department methods
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async getAllDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const id = this.departmentIdCounter++;
    const newDepartment: Department = { ...department, id };
    this.departments.set(id, newDepartment);
    return newDepartment;
  }

  async updateDepartment(id: number, department: Partial<Department>): Promise<Department | undefined> {
    const existingDepartment = this.departments.get(id);
    if (!existingDepartment) return undefined;

    const updatedDepartment = { ...existingDepartment, ...department };
    this.departments.set(id, updatedDepartment);
    return updatedDepartment;
  }

  // Activity methods
  async getRecentActivities(limit = 5): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const newActivity: Activity = { 
      ...activity, 
      id, 
      timestamp: activity.timestamp || new Date() 
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Alert methods
  async getCriticalAlerts(limit = 3): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.isResolved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.alertIdCounter++;
    const newAlert: Alert = { 
      ...alert, 
      id, 
      createdAt: alert.createdAt || new Date(), 
      isResolved: alert.isResolved || false 
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    const existingAlert = this.alerts.get(id);
    if (!existingAlert) return undefined;

    const resolvedAlert = { ...existingAlert, isResolved: true };
    this.alerts.set(id, resolvedAlert);
    return resolvedAlert;
  }

  // Deadline methods
  async getUpcomingDeadlines(limit = 3): Promise<Deadline[]> {
    const now = new Date();
    return Array.from(this.deadlines.values())
      .filter(deadline => deadline.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  }

  async createDeadline(deadline: InsertDeadline): Promise<Deadline> {
    const id = this.deadlineIdCounter++;
    const newDeadline: Deadline = { ...deadline, id };
    this.deadlines.set(id, newDeadline);
    return newDeadline;
  }

  // Document methods
  async getDocumentsForSystem(systemId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.systemId === systemId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentIdCounter++;
    const now = new Date();
    const newDocument: Document = { 
      ...document, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined> {
    const existingDocument = this.documents.get(id);
    if (!existingDocument) return undefined;

    const updatedDocument = { 
      ...existingDocument, 
      ...document, 
      updatedAt: new Date() 
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  // Document File operations
  async createDocumentFile(document: InsertDocumentFile): Promise<DocumentFile> {
    const newDocumentFile: DocumentFile = {
      ...document,
      uploadedAt: new Date()
    };
    this.documentFiles.set(document.documentId, newDocumentFile);
    return newDocumentFile;
  }
  
  async getDocumentFileById(documentId: string): Promise<DocumentFile | null> {
    const documentFile = this.documentFiles.get(documentId);
    return documentFile || null;
  }
  
  async getDocumentFilesByAssessment(assessmentId: string): Promise<DocumentFile[]> {
    return Array.from(this.documentFiles.values())
      .filter(doc => doc.assessmentId === assessmentId);
  }
  
  async getDocumentFilesBySystem(systemId: string): Promise<DocumentFile[]> {
    return Array.from(this.documentFiles.values())
      .filter(doc => doc.systemId === systemId);
  }
  
  async deleteDocumentFile(documentId: string): Promise<boolean> {
    const exists = this.documentFiles.has(documentId);
    if (exists) {
      this.documentFiles.delete(documentId);
      return true;
    }
    return false;
  }

  // Risk Assessment methods
  async getRiskAssessment(id: number): Promise<RiskAssessment | undefined> {
    return this.riskAssessments.get(id);
  }

  async getRiskAssessmentByAssessmentId(assessmentId: string): Promise<RiskAssessment | undefined> {
    return Array.from(this.riskAssessments.values()).find(assessment => assessment.assessmentId === assessmentId);
  }

  async getRiskAssessmentsForSystem(systemId: string): Promise<RiskAssessment[]> {
    return Array.from(this.riskAssessments.values())
      .filter(assessment => assessment.systemId === systemId)
      .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());
  }

  async getAllRiskAssessments(): Promise<RiskAssessment[]> {
    return Array.from(this.riskAssessments.values())
      .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const id = this.riskAssessmentIdCounter++;
    const now = new Date();

    // Make sure we have assessment date and ID
    const assessmentDate = assessment.assessmentDate || now;
    const assessmentId = assessment.assessmentId || `RA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newAssessment: RiskAssessment = { 
      ...assessment, 
      id,
      assessmentId,
      assessmentDate, 
      createdAt: now
    };

    this.riskAssessments.set(id, newAssessment);
    return newAssessment;
  }

  async updateRiskAssessment(id: number, assessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined> {
    const existingAssessment = this.riskAssessments.get(id);
    if (!existingAssessment) return undefined;

    const updatedAssessment = { 
      ...existingAssessment, 
      ...assessment
    };

    this.riskAssessments.set(id, updatedAssessment);
    return updatedAssessment;
  }
  
  async deleteRiskAssessment(id: number): Promise<boolean> {
    return this.riskAssessments.delete(id);
  }

  createRiskManagementSystem(rms: any): Promise<any> { throw new Error("Method not implemented."); }
  getRiskManagementSystemBySystemId(systemId: string): Promise<any> { throw new Error("Method not implemented."); }
  updateRiskManagementSystem(rmsId: string, updates: any): Promise<any> { throw new Error("Method not implemented."); }
  createRiskControl(control: any): Promise<any> { throw new Error("Method not implemented."); }
  getRiskControlByControlId(controlId: string): Promise<any> { throw new Error("Method not implemented."); }
  getRiskControlsBySystemId(systemId: string): Promise<any[]> { throw new Error("Method not implemented."); }
  getRiskControlsByGapId(gapId: string): Promise<any[]> { throw new Error("Method not implemented."); }
  updateRiskControl(controlId: string, updates: any): Promise<any> { throw new Error("Method not implemented."); }
  createRiskEvent(event: any): Promise<any> { throw new Error("Method not implemented."); }
  getRiskEventByEventId(eventId: string): Promise<any> { throw new Error("Method not implemented."); }
  getRiskEventsBySystemId(systemId: string): Promise<any[]> { throw new Error("Method not implemented."); }
  updateRiskEvent(eventId: string, updates: any): Promise<any> { throw new Error("Method not implemented."); }

  // Approval Item operations
  createApprovalItem(item: InsertApprovalItem): Promise<ApprovalItem> { throw new Error("Method not implemented."); }
  getApprovalItem(id: number): Promise<ApprovalItem | undefined> { throw new Error("Method not implemented."); }
  getApprovalItemByWorkflowId(workflowId: string): Promise<ApprovalItem | undefined> { throw new Error("Method not implemented."); }
  getAllApprovalItems(options?: { 
    status?: string;
    moduleType?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApprovalItem[]> { throw new Error("Method not implemented."); }
  updateApprovalItem(workflowId: string, updates: Partial<ApprovalItem>): Promise<ApprovalItem | undefined> { throw new Error("Method not implemented."); }
  
  // Approval Assignment operations
  createApprovalAssignment(assignment: InsertApprovalAssignment): Promise<ApprovalAssignment> { throw new Error("Method not implemented."); }
  getApprovalAssignment(id: number): Promise<ApprovalAssignment | undefined> { throw new Error("Method not implemented."); }
  getApprovalAssignmentsByWorkflowId(workflowId: string): Promise<ApprovalAssignment[]> { throw new Error("Method not implemented."); }
  getApprovalAssignmentsByUserId(userId: string): Promise<ApprovalAssignment[]> { throw new Error("Method not implemented."); }
  updateApprovalAssignment(id: number, updates: Partial<ApprovalAssignment>): Promise<ApprovalAssignment | undefined> { throw new Error("Method not implemented."); }
  
  // Approval History operations
  createApprovalHistory(history: InsertApprovalHistory): Promise<ApprovalHistory> { throw new Error("Method not implemented."); }
  getApprovalHistoryByWorkflowId(workflowId: string): Promise<ApprovalHistory[]> { throw new Error("Method not implemented."); }
  
  // Approval Notification operations
  createApprovalNotification(notification: InsertApprovalNotification): Promise<ApprovalNotification> { throw new Error("Method not implemented."); }
  getApprovalNotificationsByUserId(userId: string, options?: {
    isRead?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApprovalNotification[]> { throw new Error("Method not implemented."); }
  markNotificationsAsRead(notificationIds: number[]): Promise<void> { throw new Error("Method not implemented."); }
  
  // Approval Settings operations
  getApprovalSettings(userId: string): Promise<ApprovalSettings | undefined> { throw new Error("Method not implemented."); }
  createApprovalSettings(settings: InsertApprovalSettings): Promise<ApprovalSettings> { throw new Error("Method not implemented."); }
  updateApprovalSettings(userId: string, updates: Partial<ApprovalSettings>): Promise<ApprovalSettings | undefined> { throw new Error("Method not implemented."); }

  // Expert Review operations
  async getExpertReviews(options: { status?: string; type?: string } = {}): Promise<ExpertReview[]> {
    let reviews = Array.from(this.expertReviews.values());
    
    if (options.status) {
      reviews = reviews.filter(review => review.status === options.status);
    }
    
    if (options.type) {
      reviews = reviews.filter(review => review.type === options.type);
    }
    
    return reviews.sort((a, b) => {
      // Sort by most recent first
      return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
    });
  }
  
  async getExpertReviewById(reviewId: string): Promise<ExpertReview | null> {
    const review = Array.from(this.expertReviews.values()).find(
      review => review.reviewId === reviewId
    );
    
    return review || null;
  }
  
  async createExpertReview(review: InsertExpertReview): Promise<ExpertReview> {
    const id = this.expertReviewIdCounter++;
    const newReview: ExpertReview = { ...review, id };
    this.expertReviews.set(id, newReview);
    return newReview;
  }
  
  async updateExpertReview(reviewId: string, updates: Partial<InsertExpertReview>): Promise<ExpertReview> {
    const review = await this.getExpertReviewById(reviewId);
    
    if (!review) {
      throw new Error(`Expert review with ID ${reviewId} not found`);
    }
    
    const updatedReview: ExpertReview = {
      ...review,
      ...updates,
      updatedAt: new Date()
    };
    
    this.expertReviews.set(review.id, updatedReview);
    return updatedReview;
  }
  
  async deleteExpertReview(reviewId: string): Promise<boolean> {
    const review = await this.getExpertReviewById(reviewId);
    
    if (!review) {
      return false;
    }
    
    return this.expertReviews.delete(review.id);
  }
}


// DatabaseStorage implementation using Drizzle ORM
import { db } from "./db";
import { eq, desc, sql, and, like, or, not, isNull, count } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = {
      ...user,
      createdAt: new Date()
    };
    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  }

  // AI System operations
  async getAiSystem(id: number): Promise<AiSystem | undefined> {
    const result = await db.select().from(aiSystems).where(eq(aiSystems.id, id)).limit(1);
    return result[0];
  }

  async getAiSystemBySystemId(systemId: string): Promise<AiSystem | undefined> {
    const result = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId)).limit(1);
    return result[0];
  }

  async getAllAiSystems(): Promise<AiSystem[]> {
    return await db.select().from(aiSystems).orderBy(desc(aiSystems.createdAt));
  }

  async getHighRiskAiSystems(limit: number = 5): Promise<AiSystem[]> {
    return await db
      .select()
      .from(aiSystems)
      .where(eq(aiSystems.riskLevel, "High Risk"))
      .orderBy(desc(aiSystems.createdAt))
      .limit(limit);
  }

  async createAiSystem(system: InsertAiSystem): Promise<AiSystem> {
    const newSystem = {
      ...system,
      createdAt: new Date()
    };
    const result = await db.insert(aiSystems).values(newSystem).returning();
    return result[0];
  }

  async updateAiSystem(id: number, system: Partial<AiSystem>): Promise<AiSystem | undefined> {
    const updatedSystem = {
      ...system,
      updatedAt: new Date()
    };
    const result = await db
      .update(aiSystems)
      .set(updatedSystem)
      .where(eq(aiSystems.id, id))
      .returning();
    return result[0];
  }

  async deleteAiSystem(id: number): Promise<boolean> {
    const result = await db.delete(aiSystems).where(eq(aiSystems.id, id)).returning();
    return result.length > 0;
  }

  // Department operations
  async getDepartment(id: number): Promise<Department | undefined> {
    const result = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    return result[0];
  }

  async getAllDepartments(): Promise<Department[]> {
    return await db.select().from(departments).orderBy(departments.name);
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const result = await db.insert(departments).values(department).returning();
    return result[0];
  }

  async updateDepartment(id: number, department: Partial<Department>): Promise<Department | undefined> {
    const result = await db
      .update(departments)
      .set(department)
      .where(eq(departments.id, id))
      .returning();
    return result[0];
  }

  // Activity operations
  async getRecentActivities(limit: number = 5): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .orderBy(desc(activities.timestamp))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity = {
      ...activity,
      timestamp: new Date()
    };
    const result = await db.insert(activities).values(newActivity).returning();
    return result[0];
  }

  // Alert operations
  async getCriticalAlerts(limit: number = 3): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.severity, "Critical"))
      .where(eq(alerts.isResolved, false))
      .orderBy(desc(alerts.createdAt))
      .limit(limit);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const newAlert = {
      ...alert,
      createdAt: new Date()
    };
    const result = await db.insert(alerts).values(newAlert).returning();
    return result[0];
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    const result = await db
      .update(alerts)
      .set({ isResolved: true })
      .where(eq(alerts.id, id))
      .returning();
    return result[0];
  }

  // Deadline operations
  async getUpcomingDeadlines(limit: number = 3): Promise<Deadline[]> {
    return await db
      .select()
      .from(deadlines)
      .where(sql`${deadlines.date} >= CURRENT_DATE`)
      .orderBy(deadlines.date)
      .limit(limit);
  }

  async createDeadline(deadline: InsertDeadline): Promise<Deadline> {
    const result = await db.insert(deadlines).values(deadline).returning();
    return result[0];
  }

  // Document operations
  async getDocumentsForSystem(systemId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.systemId, systemId))
      .orderBy(desc(documents.createdAt));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const newDocument = {
      ...document,
      createdAt: new Date()
    };
    const result = await db.insert(documents).values(newDocument).returning();
    return result[0];
  }

  async updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined> {
    const updatedDocument = {
      ...document,
      updatedAt: new Date()
    };
    const result = await db
      .update(documents)
      .set(updatedDocument)
      .where(eq(documents.id, id))
      .returning();
    return result[0];
  }
  
  // Document File operations
  async createDocumentFile(document: InsertDocumentFile): Promise<DocumentFile> {
    const newDocumentFile = {
      ...document,
      uploadedAt: new Date()
    };
    const result = await db.insert(documentFiles).values(newDocumentFile).returning();
    return result[0];
  }
  
  async getDocumentFileById(documentId: string): Promise<DocumentFile | null> {
    const result = await db
      .select()
      .from(documentFiles)
      .where(eq(documentFiles.documentId, documentId))
      .limit(1);
    return result[0] || null;
  }
  
  async getDocumentFilesByAssessment(assessmentId: string): Promise<DocumentFile[]> {
    return await db
      .select()
      .from(documentFiles)
      .where(eq(documentFiles.assessmentId, assessmentId));
  }
  
  async getDocumentFilesBySystem(systemId: string): Promise<DocumentFile[]> {
    return await db
      .select()
      .from(documentFiles)
      .where(eq(documentFiles.systemId, systemId));
  }
  
  async deleteDocumentFile(documentId: string): Promise<boolean> {
    const result = await db
      .delete(documentFiles)
      .where(eq(documentFiles.documentId, documentId))
      .returning();
    return result.length > 0;
  }

  // Risk Assessment operations
  async getRiskAssessment(id: number): Promise<RiskAssessment | undefined> {
    const result = await db.select().from(riskAssessments).where(eq(riskAssessments.id, id)).limit(1);
    return result[0];
  }

  async getRiskAssessmentByAssessmentId(assessmentId: string): Promise<RiskAssessment | undefined> {
    const result = await db.select().from(riskAssessments).where(eq(riskAssessments.assessmentId, assessmentId)).limit(1);
    return result[0];
  }

  async getRiskAssessmentsForSystem(systemId: string): Promise<RiskAssessment[]> {
    return await db
      .select()
      .from(riskAssessments)
      .where(eq(riskAssessments.systemId, systemId))
      .orderBy(desc(riskAssessments.assessmentDate));
  }

  async getAllRiskAssessments(): Promise<RiskAssessment[]> {
    try {
      const results = await db
        .select()
        .from(riskAssessments)
        .orderBy(desc(riskAssessments.assessmentDate));
      
      // Process results to ensure JSON fields are properly parsed
      return results.map(assessment => {
        try {
          // Parse JSON string fields if they exist
          if (assessment.prohibitedUseChecks && typeof assessment.prohibitedUseChecks === 'string') {
            assessment.prohibitedUseChecks = JSON.parse(assessment.prohibitedUseChecks);
          }
          
          // Skip riskParameters parsing as it's not defined in the schema
          
          if (assessment.euAiActArticles && typeof assessment.euAiActArticles === 'string') {
            assessment.euAiActArticles = JSON.parse(assessment.euAiActArticles);
          }
          
          if (assessment.complianceGaps && typeof assessment.complianceGaps === 'string') {
            assessment.complianceGaps = JSON.parse(assessment.complianceGaps);
          }
          
          if (assessment.remediationActions && typeof assessment.remediationActions === 'string') {
            assessment.remediationActions = JSON.parse(assessment.remediationActions);
          }
          
          if (assessment.evidenceDocuments && typeof assessment.evidenceDocuments === 'string') {
            assessment.evidenceDocuments = JSON.parse(assessment.evidenceDocuments);
          }
        } catch (e) {
          console.error("Error parsing JSON fields for assessment:", assessment.assessmentId, e);
        }
        
        return assessment;
      });
    } catch (error) {
      console.error("Error in getAllRiskAssessments:", error);
      return [];
    }
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    try {
      // Generate a unique assessment ID if one isn't provided
      const assessmentId = assessment.assessmentId || `RA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Convert JSON fields to proper format if they're not already
      const processedAssessment = {
        ...assessment,
        assessmentId,
        assessmentDate: assessment.assessmentDate || new Date(),
        createdAt: new Date(),
        // Ensure JSON fields are properly formatted
        prohibitedUseChecks: this.ensureJsonField(assessment.prohibitedUseChecks),
        euAiActArticles: this.ensureJsonField(assessment.euAiActArticles),
        complianceGaps: this.ensureJsonField(assessment.complianceGaps),
        remediationActions: this.ensureJsonField(assessment.remediationActions),
        evidenceDocuments: this.ensureJsonField(assessment.evidenceDocuments)
      };

      console.log('Inserting risk assessment with processed data:', processedAssessment);
      
      const result = await db.insert(riskAssessments).values(processedAssessment).returning();
      console.log('Risk assessment insertion result:', result);
      return result[0];
    } catch (error) {
      console.error('Error in createRiskAssessment:', error);
      throw error;
    }
  }
  
  // Helper method to ensure JSON fields are properly formatted
  private ensureJsonField(field: any): any {
    if (field === undefined || field === null) {
      return null;
    }
    
    if (typeof field === 'string') {
      try {
        // If it's already a JSON string, parse it to make sure it's valid, then return the original string
        JSON.parse(field);
        return field;
      } catch (e) {
        // If it's not valid JSON, stringify it
        return JSON.stringify(field);
      }
    }
    
    // If it's an object/array, stringify it
    return JSON.stringify(field);
  }

  async updateRiskAssessment(id: number, assessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined> {
    const result = await db
      .update(riskAssessments)
      .set(assessment)
      .where(eq(riskAssessments.id, id))
      .returning();
    return result[0];
  }
  
  async deleteRiskAssessment(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(riskAssessments)
        .where(eq(riskAssessments.id, id))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error in deleteRiskAssessment:', error);
      return false;
    }
  }

  private mapDbResultToObject(row: any): any {
    //Implementation to map database row to a JavaScript object
    return row;
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  async createRiskManagementSystem(rms: any): Promise<any> {
    try {
      const result = await db.query(
        `INSERT INTO risk_management_systems 
         (system_id, rms_id, status, created_date, last_update_date, last_review_date, 
          next_review_date, review_cycle, responsible_person, document_reference, version, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          rms.systemId,
          rms.rmsId,
          rms.status,
          rms.createdDate,
          rms.lastUpdateDate,
          rms.lastReviewDate,
          rms.nextReviewDate,
          rms.reviewCycle,
          rms.responsiblePerson,
          rms.documentReference,
          rms.version,
          rms.notes
        ]
      );

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in createRiskManagementSystem:', error);
      throw error;
    }
  }

  async getRiskManagementSystemBySystemId(systemId: string): Promise<any> {
    try {
      const result = await db.query(
        `SELECT * FROM risk_management_systems WHERE system_id = $1`,
        [systemId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in getRiskManagementSystemBySystemId:', error);
      throw error;
    }
  }

  async updateRiskManagementSystem(rmsId: string, updates: any): Promise<any> {
    try {
      const fields = Object.keys(updates)
        .map((key, i) => `${this.camelToSnake(key)} = $${i + 2}`)
        .join(', ');

      const values = Object.values(updates);

      const result = await db.query(
        `UPDATE risk_management_systems
         SET ${fields}
         WHERE rms_id = $1
         RETURNING *`,
        [rmsId, ...values]
      );

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in updateRiskManagementSystem:', error);
      throw error;
    }
  }

  /**
   * Risk Control operations
   */

  async createRiskControl(control: any): Promise<any> {
    try {
      const result = await db.query(
        `INSERT INTO risk_controls
         (control_id, system_id, name, description, control_type, implementation_status,
          effectiveness, implementation_date, last_review_date, next_review_date,
          responsible_person, related_gaps, documentation_links, test_results, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          control.controlId,
          control.systemId,
          control.name,
          control.description,
          control.controlType,
          control.implementationStatus,
          control.effectiveness,
          control.implementationDate,
          control.lastReviewDate,
          control.nextReviewDate,
          control.responsiblePerson,
          control.relatedGaps,
          control.documentationLinks,
          control.testResults,
          control.notes
        ]
      );

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in createRiskControl:', error);
      throw error;
    }
  }

  async getRiskControlByControlId(controlId: string): Promise<any> {
    try {
      const result = await db.query(
        `SELECT * FROM risk_controls WHERE control_id = $1`,
        [controlId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in getRiskControlByControlId:', error);
      throw error;
    }
  }

  async getRiskControlsBySystemId(systemId: string): Promise<any[]> {
    try {
      const result = await db.query(
        `SELECT * FROM risk_controls WHERE system_id = $1`,
        [systemId]
      );

      return result.rows.map(row => this.mapDbResultToObject(row));
    } catch (error) {
      console.error('Error in getRiskControlsBySystemId:', error);
      throw error;
    }
  }

  async getRiskControlsByGapId(gapId: string): Promise<any[]> {
    try {
      const result = await db.query(
        `SELECT * FROM risk_controls WHERE $1 = ANY(related_gaps)`,
        [gapId]
      );

      return result.rows.map(row => this.mapDbResultToObject(row));
    } catch (error) {
      console.error('Error in getRiskControlsByGapId:', error);
      throw error;
    }
  }

  async updateRiskControl(controlId: string, updates: any): Promise<any> {
    try {
      const fields = Object.keys(updates)
        .map((key, i) => `${this.camelToSnake(key)} = $${i + 2}`)
        .join(', ');

      const values = Object.values(updates);

      const result = await db.query(
        `UPDATE risk_controls
         SET ${fields}
         WHERE control_id = $1
         RETURNING *`,
        [controlId, ...values]
      );

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in updateRiskControl:', error);
      throw error;
    }
  }

  /**
   * Risk Event operations
   */

  async createRiskEvent(event: any): Promise<any> {
    try {
      const result = await db.query(
        `INSERT INTO risk_events
         (event_id, system_id, event_type, severity, description, detection_date,
          reported_by, status, impact, root_cause, mitigation_actions,
          recurrence_prevention, closure_date, related_controls)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [
          event.eventId,
          event.systemId,
          event.eventType,
          event.severity,
          event.description,
          event.detectionDate,
          event.reportedBy,
          event.status,
          event.impact,
          event.rootCause,
          event.mitigationActions,
          event.recurrencePrevention,
          event.closureDate,
          event.relatedControls
        ]
      );

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in createRiskEvent:', error);
      throw error;
    }
  }

  async getRiskEventByEventId(eventId: string): Promise<any> {
    try {
      const result = await db.query(
        `SELECT * FROM risk_events WHERE event_id = $1`,
        [eventId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in getRiskEventByEventId:', error);
      throw error;
    }
  }

  async getRiskEventsBySystemId(systemId: string): Promise<any[]> {
    try {
      const result = await db.query(
        `SELECT * FROM risk_events WHERE system_id = $1`,
        [systemId]
      );

      return result.rows.map(row => this.mapDbResultToObject(row));
    } catch (error) {
      console.error('Error in getRiskEventsBySystemId:', error);
      throw error;
    }
  }

  async updateRiskEvent(eventId: string, updates: any): Promise<any> {
    try {
      const fields = Object.keys(updates)
        .map((key, i) => `${this.camelToSnake(key)}} = $${i + 2}`)
        .join(', ');

      const values = Object.values(updates);

      const result = await db.query(
        `UPDATE risk_events
         SET ${fields}
         WHERE event_id = $1
         RETURNING *`,
        [eventId, ...values]
      );

      return this.mapDbResultToObject(result.rows[0]);
    } catch (error) {
      console.error('Error in updateRiskEvent:', error);
      throw error;
    }
  }

  // Approval Item operations
  async createApprovalItem(item: InsertApprovalItem): Promise<ApprovalItem> {
    const now = new Date();
    const newItem = {
      ...item,
      createdAt: now,
      updatedAt: now
    };
    const result = await db.insert(approvalItems).values(newItem).returning();
    return result[0];
  }

  async getApprovalItem(id: number): Promise<ApprovalItem | undefined> {
    const result = await db.select().from(approvalItems).where(eq(approvalItems.id, id)).limit(1);
    return result[0];
  }

  async getApprovalItemByWorkflowId(workflowId: string): Promise<ApprovalItem | undefined> {
    const result = await db.select().from(approvalItems).where(eq(approvalItems.workflowId, workflowId)).limit(1);
    return result[0];
  }

  async getAllApprovalItems(options?: { 
    status?: string;
    moduleType?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApprovalItem[]> {
    let query = db.select().from(approvalItems);
    
    // Apply filters
    if (options?.status) {
      query = query.where(eq(approvalItems.status, options.status));
    }
    
    if (options?.moduleType) {
      query = query.where(eq(approvalItems.moduleType, options.moduleType));
    }
    
    if (options?.priority) {
      query = query.where(eq(approvalItems.priority, options.priority));
    }
    
    if (options?.search) {
      query = query.where(
        or(
          like(approvalItems.title, `%${options.search}%`),
          like(approvalItems.description, `%${options.search}%`)
        )
      );
    }
    
    // Apply sorting
    if (options?.sortBy) {
      const column = approvalItems[options.sortBy as keyof typeof approvalItems];
      if (column) {
        query = options.sortOrder === 'asc' 
          ? query.orderBy(column) 
          : query.orderBy(desc(column));
      } else {
        query = query.orderBy(desc(approvalItems.updatedAt));
      }
    } else {
      query = query.orderBy(desc(approvalItems.updatedAt));
    }
    
    // Apply pagination
    if (options?.page && options?.limit) {
      const offset = (options.page - 1) * options.limit;
      query = query.limit(options.limit).offset(offset);
    }
    
    return await query;
  }

  async updateApprovalItem(workflowId: string, updates: Partial<ApprovalItem>): Promise<ApprovalItem | undefined> {
    const updatedItem = {
      ...updates,
      updatedAt: new Date()
    };
    
    const result = await db
      .update(approvalItems)
      .set(updatedItem)
      .where(eq(approvalItems.workflowId, workflowId))
      .returning();
      
    return result[0];
  }
  
  // Approval Assignment operations
  async createApprovalAssignment(assignment: InsertApprovalAssignment): Promise<ApprovalAssignment> {
    const now = new Date();
    const newAssignment = {
      ...assignment,
      assignedAt: now
    };
    
    const result = await db.insert(approvalAssignments).values(newAssignment).returning();
    return result[0];
  }
  
  async getApprovalAssignment(id: number): Promise<ApprovalAssignment | undefined> {
    const result = await db
      .select()
      .from(approvalAssignments)
      .where(eq(approvalAssignments.id, id))
      .limit(1);
      
    return result[0];
  }
  
  async getApprovalAssignmentsByWorkflowId(workflowId: string): Promise<ApprovalAssignment[]> {
    return await db
      .select()
      .from(approvalAssignments)
      .where(eq(approvalAssignments.workflowId, workflowId))
      .orderBy(approvalAssignments.assignedAt);
  }
  
  async getApprovalAssignmentsByUserId(userId: string): Promise<ApprovalAssignment[]> {
    return await db
      .select()
      .from(approvalAssignments)
      .where(eq(approvalAssignments.assignedTo, userId))
      .orderBy(desc(approvalAssignments.assignedAt));
  }
  
  async updateApprovalAssignment(id: number, updates: Partial<ApprovalAssignment>): Promise<ApprovalAssignment | undefined> {
    const result = await db
      .update(approvalAssignments)
      .set(updates)
      .where(eq(approvalAssignments.id, id))
      .returning();
      
    return result[0];
  }
  
  // Approval History operations
  async createApprovalHistory(history: InsertApprovalHistory): Promise<ApprovalHistory> {
    const newHistory = {
      ...history,
      timestamp: new Date()
    };
    
    const result = await db.insert(approvalHistory).values(newHistory).returning();
    return result[0];
  }
  
  async getApprovalHistoryByWorkflowId(workflowId: string): Promise<ApprovalHistory[]> {
    return await db
      .select()
      .from(approvalHistory)
      .where(eq(approvalHistory.workflowId, workflowId))
      .orderBy(desc(approvalHistory.timestamp));
  }
  
  // Approval Notification operations
  async createApprovalNotification(notification: InsertApprovalNotification): Promise<ApprovalNotification> {
    const newNotification = {
      ...notification,
      createdAt: new Date(),
      isRead: false
    };
    
    const result = await db.insert(approvalNotifications).values(newNotification).returning();
    return result[0];
  }
  
  async getApprovalNotificationsByUserId(userId: string, options?: {
    isRead?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApprovalNotification[]> {
    let query = db
      .select()
      .from(approvalNotifications)
      .where(eq(approvalNotifications.userId, userId));
      
    // Filter by read status if specified
    if (options?.isRead !== undefined) {
      query = query.where(eq(approvalNotifications.isRead, options.isRead));
    }
    
    // Apply pagination
    if (options?.page && options?.limit) {
      const offset = (options.page - 1) * options.limit;
      query = query.limit(options.limit).offset(offset);
    }
    
    // Sort by creation date (newest first)
    query = query.orderBy(desc(approvalNotifications.createdAt));
    
    return await query;
  }
  
  async markNotificationsAsRead(notificationIds: number[]): Promise<void> {
    await db
      .update(approvalNotifications)
      .set({ isRead: true, readAt: new Date() })
      .where(sql`id = ANY(${notificationIds})`);
  }
  
  // Approval Settings operations
  async getApprovalSettings(userId: string): Promise<ApprovalSettings | undefined> {
    const result = await db
      .select()
      .from(approvalSettings)
      .where(eq(approvalSettings.userId, userId))
      .limit(1);
      
    return result[0];
  }
  
  async createApprovalSettings(settings: InsertApprovalSettings): Promise<ApprovalSettings> {
    const result = await db.insert(approvalSettings).values(settings).returning();
    return result[0];
  }
  
  async updateApprovalSettings(userId: string, updates: Partial<ApprovalSettings>): Promise<ApprovalSettings | undefined> {
    const result = await db
      .update(approvalSettings)
      .set(updates)
      .where(eq(approvalSettings.userId, userId))
      .returning();
      
    return result[0];
  }

  // Expert Review operations
  async getExpertReviews(options: { status?: string; type?: string } = {}): Promise<ExpertReview[]> {
    try {
      let query = db.select().from(expertReviews);
      
      if (options.status) {
        query = query.where(eq(expertReviews.status, options.status));
      }
      
      if (options.type) {
        query = query.where(eq(expertReviews.type, options.type));
      }
      
      // Sort by most recent first
      return await query.orderBy(desc(expertReviews.requestedAt));
    } catch (error) {
      console.error('Error in getExpertReviews:', error);
      return [];
    }
  }
  
  async getExpertReviewById(reviewId: string): Promise<ExpertReview | null> {
    try {
      const result = await db
        .select()
        .from(expertReviews)
        .where(eq(expertReviews.reviewId, reviewId))
        .limit(1);
        
      return result[0] || null;
    } catch (error) {
      console.error('Error in getExpertReviewById:', error);
      return null;
    }
  }
  
  async createExpertReview(review: InsertExpertReview): Promise<ExpertReview> {
    try {
      const result = await db
        .insert(expertReviews)
        .values(review)
        .returning();
        
      return result[0];
    } catch (error) {
      console.error('Error in createExpertReview:', error);
      throw error;
    }
  }
  
  async updateExpertReview(reviewId: string, updates: Partial<InsertExpertReview>): Promise<ExpertReview> {
    try {
      const result = await db
        .update(expertReviews)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(expertReviews.reviewId, reviewId))
        .returning();
        
      if (result.length === 0) {
        throw new Error(`Expert review with ID ${reviewId} not found`);
      }
      
      return result[0];
    } catch (error) {
      console.error('Error in updateExpertReview:', error);
      throw error;
    }
  }
  
  async deleteExpertReview(reviewId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(expertReviews)
        .where(eq(expertReviews.reviewId, reviewId))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error('Error in deleteExpertReview:', error);
      return false;
    }
  }
}

/**
 * Hybrid Storage Class
 * 
 * Uses database storage when available and falls back to memory storage when database is unavailable.
 * This ensures the application continues to function even during database connectivity issues.
 */
export class HybridStorage implements IStorage {
  private dbStorage: DatabaseStorage;
  private memStorage: MemStorage;
  private useDatabase: boolean = true;

  constructor() {
    this.dbStorage = new DatabaseStorage();
    this.memStorage = new MemStorage();
    
    // Check database connectivity periodically
    this.checkDatabaseConnection();
    setInterval(() => this.checkDatabaseConnection(), 30000); // Check every 30 seconds
  }

  private async checkDatabaseConnection(): Promise<void> {
    try {
      // Perform a simple query to check database connectivity
      const result = await sql`SELECT 1 as value`;
      
      if (result && result.length > 0) {
        // Connection is successful
        if (!this.useDatabase) {
          console.log("Database connection restored. Switching to database storage.");
          this.useDatabase = true;
        }
      }
    } catch (error) {
      if (this.useDatabase) {
        console.error("Database connection failed. Falling back to memory storage:", error);
        this.useDatabase = false;
      }
    }
  }

  // Method to access current storage based on database availability
  private get storage(): IStorage {
    return this.useDatabase ? this.dbStorage : this.memStorage;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      return await this.storage.getUser(id);
    } catch (error) {
      console.error("Error in getUser, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getUser(id);
    }
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    try {
      return await this.storage.getUserByUid(uid);
    } catch (error) {
      console.error("Error in getUserByUid, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getUserByUid(uid);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.storage.getUserByEmail(email);
    } catch (error) {
      console.error("Error in getUserByEmail, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getUserByEmail(email);
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      return await this.storage.createUser(user);
    } catch (error) {
      console.error("Error in createUser, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.createUser(user);
    }
  }

  // AI System operations
  async getAiSystem(id: number): Promise<AiSystem | undefined> {
    try {
      return await this.storage.getAiSystem(id);
    } catch (error) {
      console.error("Error in getAiSystem, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getAiSystem(id);
    }
  }

  async getAiSystemBySystemId(systemId: string): Promise<AiSystem | undefined> {
    try {
      return await this.storage.getAiSystemBySystemId(systemId);
    } catch (error) {
      console.error("Error in getAiSystemBySystemId, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getAiSystemBySystemId(systemId);
    }
  }

  async getAllAiSystems(): Promise<AiSystem[]> {
    try {
      return await this.storage.getAllAiSystems();
    } catch (error) {
      console.error("Error in getAllAiSystems, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getAllAiSystems();
    }
  }

  async getHighRiskAiSystems(limit?: number): Promise<AiSystem[]> {
    try {
      return await this.storage.getHighRiskAiSystems(limit);
    } catch (error) {
      console.error("Error in getHighRiskAiSystems, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getHighRiskAiSystems(limit);
    }
  }

  async createAiSystem(system: InsertAiSystem): Promise<AiSystem> {
    try {
      return await this.storage.createAiSystem(system);
    } catch (error) {
      console.error("Error in createAiSystem, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.createAiSystem(system);
    }
  }

  async updateAiSystem(id: number, system: Partial<AiSystem>): Promise<AiSystem | undefined> {
    try {
      return await this.storage.updateAiSystem(id, system);
    } catch (error) {
      console.error("Error in updateAiSystem, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.updateAiSystem(id, system);
    }
  }

  async deleteAiSystem(id: number): Promise<boolean> {
    try {
      return await this.storage.deleteAiSystem(id);
    } catch (error) {
      console.error("Error in deleteAiSystem, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.deleteAiSystem(id);
    }
  }

  // Forward all other methods to the current active storage
  // Department operations
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.storage.getDepartment(id);
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.storage.getAllDepartments();
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    return this.storage.createDepartment(department);
  }

  async updateDepartment(id: number, department: Partial<Department>): Promise<Department | undefined> {
    return this.storage.updateDepartment(id, department);
  }

  // Activity operations
  async getRecentActivities(limit: number): Promise<Activity[]> {
    return this.storage.getRecentActivities(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    return this.storage.createActivity(activity);
  }

  // Alert operations
  async getCriticalAlerts(limit: number): Promise<Alert[]> {
    return this.storage.getCriticalAlerts(limit);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    return this.storage.createAlert(alert);
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    return this.storage.resolveAlert(id);
  }

  // Deadline operations
  async getUpcomingDeadlines(limit: number): Promise<Deadline[]> {
    return this.storage.getUpcomingDeadlines(limit);
  }

  async createDeadline(deadline: InsertDeadline): Promise<Deadline> {
    return this.storage.createDeadline(deadline);
  }

  // Document operations
  async getDocumentsForSystem(systemId: string): Promise<Document[]> {
    return this.storage.getDocumentsForSystem(systemId);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    return this.storage.createDocument(document);
  }

  async updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined> {
    return this.storage.updateDocument(id, document);
  }
  
  // Document File operations
  async createDocumentFile(document: InsertDocumentFile): Promise<DocumentFile> {
    try {
      return await this.storage.createDocumentFile(document);
    } catch (error) {
      console.error("Error in createDocumentFile, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.createDocumentFile(document);
    }
  }
  
  async getDocumentFileById(documentId: string): Promise<DocumentFile | null> {
    try {
      return await this.storage.getDocumentFileById(documentId);
    } catch (error) {
      console.error("Error in getDocumentFileById, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getDocumentFileById(documentId);
    }
  }
  
  async getDocumentFilesByAssessment(assessmentId: string): Promise<DocumentFile[]> {
    try {
      return await this.storage.getDocumentFilesByAssessment(assessmentId);
    } catch (error) {
      console.error("Error in getDocumentFilesByAssessment, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getDocumentFilesByAssessment(assessmentId);
    }
  }
  
  async getDocumentFilesBySystem(systemId: string): Promise<DocumentFile[]> {
    try {
      return await this.storage.getDocumentFilesBySystem(systemId);
    } catch (error) {
      console.error("Error in getDocumentFilesBySystem, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getDocumentFilesBySystem(systemId);
    }
  }
  
  async deleteDocumentFile(documentId: string): Promise<boolean> {
    try {
      return await this.storage.deleteDocumentFile(documentId);
    } catch (error) {
      console.error("Error in deleteDocumentFile, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.deleteDocumentFile(documentId);
    }
  }

  // Risk Assessment operations
  async getRiskAssessment(id: number): Promise<RiskAssessment | undefined> {
    return this.storage.getRiskAssessment(id);
  }

  async getRiskAssessmentByAssessmentId(assessmentId: string): Promise<RiskAssessment | undefined> {
    return this.storage.getRiskAssessmentByAssessmentId(assessmentId);
  }

  async getRiskAssessmentsForSystem(systemId: string): Promise<RiskAssessment[]> {
    return this.storage.getRiskAssessmentsForSystem(systemId);
  }
  
  async getAllRiskAssessments(): Promise<RiskAssessment[]> {
    return this.storage.getAllRiskAssessments();
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    return this.storage.createRiskAssessment(assessment);
  }

  async updateRiskAssessment(id: number, assessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined> {
    return this.storage.updateRiskAssessment(id, assessment);
  }
  
  async deleteRiskAssessment(id: number): Promise<boolean> {
    return this.storage.deleteRiskAssessment(id);
  }

  // Approval workflow operations
  async getApprovalItems(options?: {
    status?: string;
    assignedTo?: string;
    moduleType?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApprovalItem[]> {
    return this.storage.getApprovalItems(options);
  }

  async getApprovalItem(id: number): Promise<ApprovalItem | undefined> {
    return this.storage.getApprovalItem(id);
  }

  async createApprovalItem(item: InsertApprovalItem): Promise<ApprovalItem> {
    return this.storage.createApprovalItem(item);
  }

  async updateApprovalItem(id: number, updates: Partial<ApprovalItem>): Promise<ApprovalItem | undefined> {
    return this.storage.updateApprovalItem(id, updates);
  }

  async getApprovalAssignments(itemId: number): Promise<ApprovalAssignment[]> {
    return this.storage.getApprovalAssignments(itemId);
  }

  async createApprovalAssignment(assignment: InsertApprovalAssignment): Promise<ApprovalAssignment> {
    return this.storage.createApprovalAssignment(assignment);
  }

  async getApprovalHistory(itemId: number): Promise<ApprovalHistory[]> {
    return this.storage.getApprovalHistory(itemId);
  }

  async createApprovalHistory(history: InsertApprovalHistory): Promise<ApprovalHistory> {
    return this.storage.createApprovalHistory(history);
  }

  async getApprovalNotifications(userId: string, options?: {
    read?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApprovalNotification[]> {
    return this.storage.getApprovalNotifications(userId, options);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    return this.storage.getUnreadNotificationCount(userId);
  }

  async createApprovalNotification(notification: InsertApprovalNotification): Promise<ApprovalNotification> {
    return this.storage.createApprovalNotification(notification);
  }

  async markNotificationsAsRead(userId: string, notificationIds: number[]): Promise<void> {
    return this.storage.markNotificationsAsRead(userId, notificationIds);
  }

  async getApprovalSettings(userId: string): Promise<ApprovalSettings | undefined> {
    return this.storage.getApprovalSettings(userId);
  }
  
  async updateApprovalSettings(userId: string, updates: Partial<ApprovalSettings>): Promise<ApprovalSettings | undefined> {
    return this.storage.updateApprovalSettings(userId, updates);
  }

  // Expert Review operations
  async getExpertReviews(options: { status?: string; type?: string } = {}): Promise<ExpertReview[]> {
    try {
      return await this.storage.getExpertReviews(options);
    } catch (error) {
      console.error("Error in getExpertReviews, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getExpertReviews(options);
    }
  }
  
  async getExpertReviewById(reviewId: string): Promise<ExpertReview | null> {
    try {
      return await this.storage.getExpertReviewById(reviewId);
    } catch (error) {
      console.error("Error in getExpertReviewById, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.getExpertReviewById(reviewId);
    }
  }
  
  async createExpertReview(review: InsertExpertReview): Promise<ExpertReview> {
    try {
      return await this.storage.createExpertReview(review);
    } catch (error) {
      console.error("Error in createExpertReview, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.createExpertReview(review);
    }
  }
  
  async updateExpertReview(reviewId: string, updates: Partial<InsertExpertReview>): Promise<ExpertReview> {
    try {
      return await this.storage.updateExpertReview(reviewId, updates);
    } catch (error) {
      console.error("Error in updateExpertReview, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.updateExpertReview(reviewId, updates);
    }
  }
  
  async deleteExpertReview(reviewId: string): Promise<boolean> {
    try {
      return await this.storage.deleteExpertReview(reviewId);
    } catch (error) {
      console.error("Error in deleteExpertReview, falling back to memory storage:", error);
      this.useDatabase = false;
      return this.memStorage.deleteExpertReview(reviewId);
    }
  }
}

/**
 * Storage module
 * 
 * Handles database operations for the EU AI Act Compliance Platform.
 * Uses HybridStorage to ensure application functionality even during database connectivity issues.
 */
export const storage = new HybridStorage();