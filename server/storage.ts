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
  approvalSettings, type ApprovalSettings, type InsertApprovalSettings
} from "@shared/schema";

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

  // Risk Assessment operations
  getRiskAssessment(id: number): Promise<RiskAssessment | undefined>;
  getRiskAssessmentByAssessmentId(assessmentId: string): Promise<RiskAssessment | undefined>;
  getRiskAssessmentsForSystem(systemId: string): Promise<RiskAssessment[]>;
  getAllRiskAssessments(): Promise<RiskAssessment[]>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessment(id: number, assessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiSystems: Map<number, AiSystem>;
  private departments: Map<number, Department>;
  private activities: Map<number, Activity>;
  private alerts: Map<number, Alert>;
  private deadlines: Map<number, Deadline>;
  private documents: Map<number, Document>;
  private riskAssessments: Map<number, RiskAssessment>;

  private userIdCounter: number;
  private systemIdCounter: number;
  private departmentIdCounter: number;
  private activityIdCounter: number;
  private alertIdCounter: number;
  private deadlineIdCounter: number;
  private documentIdCounter: number;
  private riskAssessmentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.aiSystems = new Map();
    this.departments = new Map();
    this.activities = new Map();
    this.alerts = new Map();
    this.deadlines = new Map();
    this.documents = new Map();
    this.riskAssessments = new Map();

    this.userIdCounter = 1;
    this.systemIdCounter = 1;
    this.departmentIdCounter = 1;
    this.activityIdCounter = 1;
    this.alertIdCounter = 1;
    this.deadlineIdCounter = 1;
    this.documentIdCounter = 1;
    this.riskAssessmentIdCounter = 1;

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
    return await db
      .select()
      .from(riskAssessments)
      .orderBy(desc(riskAssessments.assessmentDate));
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    // Generate a unique assessment ID if one isn't provided
    const assessmentId = assessment.assessmentId || `RA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newAssessment = {
      ...assessment,
      assessmentId,
      assessmentDate: assessment.assessmentDate || new Date(),
      createdAt: new Date()
    };

    const result = await db.insert(riskAssessments).values(newAssessment).returning();
    return result[0];
  }

  async updateRiskAssessment(id: number, assessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined> {
    const result = await db
      .update(riskAssessments)
      .set(assessment)
      .where(eq(riskAssessments.id, id))
      .returning();
    return result[0];
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
}

/**
 * Storage module
 * 
 * Handles database operations for the EU AI Act Compliance Platform.
 */
export const storage = new DatabaseStorage();