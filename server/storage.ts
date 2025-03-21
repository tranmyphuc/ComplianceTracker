import {
  users, type User, type InsertUser,
  aiSystems, type AiSystem, type InsertAiSystem,
  departments, type Department, type InsertDepartment,
  activities, type Activity, type InsertActivity,
  alerts, type Alert, type InsertAlert,
  deadlines, type Deadline, type InsertDeadline,
  documents, type Document, type InsertDocument
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiSystems: Map<number, AiSystem>;
  private departments: Map<number, Department>;
  private activities: Map<number, Activity>;
  private alerts: Map<number, Alert>;
  private deadlines: Map<number, Deadline>;
  private documents: Map<number, Document>;
  
  private userIdCounter: number;
  private systemIdCounter: number;
  private departmentIdCounter: number;
  private activityIdCounter: number;
  private alertIdCounter: number;
  private deadlineIdCounter: number;
  private documentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.aiSystems = new Map();
    this.departments = new Map();
    this.activities = new Map();
    this.alerts = new Map();
    this.deadlines = new Map();
    this.documents = new Map();
    
    this.userIdCounter = 1;
    this.systemIdCounter = 1;
    this.departmentIdCounter = 1;
    this.activityIdCounter = 1;
    this.alertIdCounter = 1;
    this.deadlineIdCounter = 1;
    this.documentIdCounter = 1;
    
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
}

export const storage = new MemStorage();
