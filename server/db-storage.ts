import {
  users, type User, type InsertUser,
  aiSystems, type AiSystem, type InsertAiSystem,
  riskAssessments, type RiskAssessment, type InsertRiskAssessment,
  euAiActArticles, type EuAiActArticle, type InsertEuAiActArticle,
  articleVersions, type ArticleVersion, type InsertArticleVersion,
  trainingModules, type TrainingModule, type InsertTrainingModule,
  trainingProgress, type TrainingProgress, type InsertTrainingProgress,
  approvalItems, type ApprovalItem, type InsertApprovalItem,
  approvalAssignments, type ApprovalAssignment, type InsertApprovalAssignment,
  approvalHistory, type ApprovalHistory, type InsertApprovalHistory,
  approvalNotifications, type ApprovalNotification, type InsertApprovalNotification,
  approvalSettings, type ApprovalSettings, type InsertApprovalSettings,
  expertReviews, type ExpertReview, type InsertExpertReview,
  activities, type Activity, type InsertActivity,
  apiKeys, type ApiKey, type InsertApiKey,
  regulatoryTerms, type RegulatoryTerm, type InsertRegulatoryTerm,
  documentTemplates, type DocumentTemplate, type InsertDocumentTemplate
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, like, and, asc, SQL, sql, isNull, inArray } from "drizzle-orm";
import { IStorage } from "./storage-interface";

/**
 * Database Storage implementation
 * Serves as a primary storage interface using Drizzle ORM with PostgreSQL
 */
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.uid, uid));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // AI System operations
  async getAiSystem(id: number): Promise<AiSystem | undefined> {
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.id, id));
    return system || undefined;
  }

  async getAiSystemBySystemId(systemId: string): Promise<AiSystem | undefined> {
    const [system] = await db.select().from(aiSystems).where(eq(aiSystems.systemId, systemId));
    return system || undefined;
  }

  async getAllAiSystems(): Promise<AiSystem[]> {
    return await db.select().from(aiSystems).orderBy(desc(aiSystems.createdAt));
  }

  async getHighRiskAiSystems(limit: number = 10): Promise<AiSystem[]> {
    return await db.select().from(aiSystems)
      .where(eq(aiSystems.riskLevel, 'high_risk'))
      .orderBy(desc(aiSystems.createdAt))
      .limit(limit);
  }

  async createAiSystem(system: InsertAiSystem): Promise<AiSystem> {
    const [newSystem] = await db.insert(aiSystems).values(system).returning();
    return newSystem;
  }

  async updateAiSystem(id: number, system: Partial<AiSystem>): Promise<AiSystem | undefined> {
    const [updatedSystem] = await db
      .update(aiSystems)
      .set(system)
      .where(eq(aiSystems.id, id))
      .returning();
    return updatedSystem || undefined;
  }

  async deleteAiSystem(id: number): Promise<boolean> {
    try {
      await db.delete(aiSystems).where(eq(aiSystems.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting AI system:", error);
      return false;
    }
  }

  // Department operations - Stub implementations
  async getDepartment(id: number): Promise<any> {
    // Not implemented yet
    return undefined;
  }

  async getAllDepartments(): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async createDepartment(department: any): Promise<any> {
    // Not implemented yet
    return { id: 1, name: "IT Department", createdAt: new Date() };
  }

  async updateDepartment(id: number, department: any): Promise<any> {
    // Not implemented yet
    return undefined;
  }

  // Activity operations
  async getRecentActivities(limit: number): Promise<Activity[]> {
    return await db.select().from(activities)
      .orderBy(desc(activities.timestamp))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  // Alert and Deadline operations - Stub implementations
  async getCriticalAlerts(limit: number): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async createAlert(alert: any): Promise<any> {
    // Not implemented yet
    return { id: 1, severity: "high", message: "Test alert", createdAt: new Date() };
  }

  async resolveAlert(id: number): Promise<any> {
    // Not implemented yet
    return undefined;
  }

  async getUpcomingDeadlines(limit: number): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async createDeadline(deadline: any): Promise<any> {
    // Not implemented yet
    return { id: 1, title: "Test deadline", dueDate: new Date(), createdAt: new Date() };
  }

  // Document operations - Stub implementations
  async getDocumentsForSystem(systemId: string): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async createDocument(document: any): Promise<any> {
    // Not implemented yet
    return { id: 1, title: "Test document", content: "Content", createdAt: new Date() };
  }

  async updateDocument(id: number, document: any): Promise<any> {
    // Not implemented yet
    return undefined;
  }

  // Document Template operations
  async createDocumentFile(file: any): Promise<any> {
    // Not implemented yet
    return { id: 1, name: "Test file", path: "/path/to/file", type: "pdf" };
  }

  async getDocumentFileById(documentId: string): Promise<any> {
    // Not implemented yet
    return null;
  }

  async getDocumentFilesByAssessment(assessmentId: string): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async getDocumentFilesBySystem(systemId: string): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async deleteDocumentFile(documentId: string): Promise<boolean> {
    // Not implemented yet
    return true;
  }

  // Risk Assessment operations
  async getRiskAssessment(id: number): Promise<RiskAssessment | undefined> {
    const [assessment] = await db.select().from(riskAssessments).where(eq(riskAssessments.id, id));
    return assessment || undefined;
  }

  async getRiskAssessmentByAssessmentId(assessmentId: string): Promise<RiskAssessment | undefined> {
    const [assessment] = await db.select().from(riskAssessments).where(eq(riskAssessments.assessmentId, assessmentId));
    return assessment || undefined;
  }

  async getRiskAssessmentsForSystem(systemId: string): Promise<RiskAssessment[]> {
    return await db.select().from(riskAssessments)
      .where(eq(riskAssessments.systemId, systemId))
      .orderBy(desc(riskAssessments.createdAt));
  }

  async getAllRiskAssessments(): Promise<RiskAssessment[]> {
    return await db.select().from(riskAssessments).orderBy(desc(riskAssessments.createdAt));
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const [newAssessment] = await db.insert(riskAssessments).values(assessment).returning();
    return newAssessment;
  }

  async updateRiskAssessment(id: number, assessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined> {
    const [updatedAssessment] = await db
      .update(riskAssessments)
      .set(assessment)
      .where(eq(riskAssessments.id, id))
      .returning();
    return updatedAssessment || undefined;
  }

  async deleteRiskAssessment(id: number): Promise<boolean> {
    try {
      await db.delete(riskAssessments).where(eq(riskAssessments.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting risk assessment:", error);
      return false;
    }
  }

  // Risk Management Systems and Controls - Stub implementations
  async createRiskManagementSystem(rms: any): Promise<any> {
    // Not implemented yet
    return { id: 1, systemId: "test-system-id" };
  }

  async getRiskManagementSystemBySystemId(systemId: string): Promise<any> {
    // Not implemented yet
    return null;
  }

  async updateRiskManagementSystem(rmsId: string, updates: any): Promise<any> {
    // Not implemented yet
    return { id: 1, systemId: "test-system-id" };
  }

  async createRiskControl(control: any): Promise<any> {
    // Not implemented yet
    return { id: 1, controlId: "test-control-id" };
  }

  async getRiskControlByControlId(controlId: string): Promise<any> {
    // Not implemented yet
    return null;
  }

  async getRiskControlsBySystemId(systemId: string): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async getRiskControlsByGapId(gapId: string): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async updateRiskControl(controlId: string, updates: any): Promise<any> {
    // Not implemented yet
    return { id: 1, controlId: "test-control-id" };
  }

  async createRiskEvent(event: any): Promise<any> {
    // Not implemented yet
    return { id: 1, eventId: "test-event-id" };
  }

  async getRiskEventByEventId(eventId: string): Promise<any> {
    // Not implemented yet
    return null;
  }

  async getRiskEventsBySystemId(systemId: string): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async updateRiskEvent(eventId: string, updates: any): Promise<any> {
    // Not implemented yet
    return { id: 1, eventId: "test-event-id" };
  }

  // API Key operations
  async getApiKeys(provider?: string): Promise<ApiKey[]> {
    if (provider) {
      return await db.select().from(apiKeys).where(eq(apiKeys.provider, provider));
    }
    return await db.select().from(apiKeys);
  }

  async getApiKey(id: number): Promise<ApiKey | undefined> {
    const [key] = await db.select().from(apiKeys).where(eq(apiKeys.id, id));
    return key || undefined;
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const [newKey] = await db.insert(apiKeys).values(apiKey).returning();
    return newKey;
  }

  async updateApiKey(id: number, apiKey: Partial<ApiKey>): Promise<ApiKey | undefined> {
    const [updatedKey] = await db
      .update(apiKeys)
      .set(apiKey)
      .where(eq(apiKeys.id, id))
      .returning();
    return updatedKey || undefined;
  }

  async deleteApiKey(id: number): Promise<boolean> {
    try {
      await db.delete(apiKeys).where(eq(apiKeys.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting API key:", error);
      return false;
    }
  }

  // EU AI Act Article operations
  async getEuAiActArticle(id: number): Promise<EuAiActArticle | undefined> {
    const [article] = await db.select().from(euAiActArticles).where(eq(euAiActArticles.id, id));
    return article || undefined;
  }

  async getEuAiActArticleByArticleId(articleId: string): Promise<EuAiActArticle | undefined> {
    const [article] = await db.select().from(euAiActArticles).where(eq(euAiActArticles.articleId, articleId));
    return article || undefined;
  }

  async getAllEuAiActArticles(options?: { riskLevel?: string; version?: string }): Promise<EuAiActArticle[]> {
    let query = db.select().from(euAiActArticles);
    
    if (options?.riskLevel) {
      query = query.where(eq(euAiActArticles.riskLevel, options.riskLevel));
    }
    
    if (options?.version) {
      query = query.where(eq(euAiActArticles.version, options.version));
    }
    
    return await query.orderBy(asc(euAiActArticles.number));
  }

  async createEuAiActArticle(article: InsertEuAiActArticle): Promise<EuAiActArticle> {
    const [newArticle] = await db.insert(euAiActArticles).values(article).returning();
    return newArticle;
  }

  async updateEuAiActArticle(id: number, article: Partial<EuAiActArticle>): Promise<EuAiActArticle | undefined> {
    const [updatedArticle] = await db
      .update(euAiActArticles)
      .set(article)
      .where(eq(euAiActArticles.id, id))
      .returning();
    return updatedArticle || undefined;
  }

  // Article Version operations
  async getArticleVersions(articleId: string): Promise<ArticleVersion[]> {
    return await db.select().from(articleVersions)
      .where(eq(articleVersions.articleId, articleId))
      .orderBy(desc(articleVersions.changedAt));
  }

  async createArticleVersion(version: InsertArticleVersion): Promise<ArticleVersion> {
    const [newVersion] = await db.insert(articleVersions).values(version).returning();
    return newVersion;
  }

  async getLatestArticleVersion(articleId: string): Promise<ArticleVersion | undefined> {
    const [version] = await db.select().from(articleVersions)
      .where(eq(articleVersions.articleId, articleId))
      .orderBy(desc(articleVersions.changedAt))
      .limit(1);
    return version || undefined;
  }

  // Training Module operations
  async getTrainingModule(id: number): Promise<TrainingModule | undefined> {
    const [module] = await db.select().from(trainingModules).where(eq(trainingModules.id, id));
    return module || undefined;
  }

  async getAllTrainingModules(): Promise<TrainingModule[]> {
    return await db.select().from(trainingModules).orderBy(asc(trainingModules.moduleOrder));
  }

  async createTrainingModule(module: InsertTrainingModule): Promise<TrainingModule> {
    const [newModule] = await db.insert(trainingModules).values(module).returning();
    return newModule;
  }

  async updateTrainingModule(id: number, module: Partial<TrainingModule>): Promise<TrainingModule | undefined> {
    const [updatedModule] = await db
      .update(trainingModules)
      .set(module)
      .where(eq(trainingModules.id, id))
      .returning();
    return updatedModule || undefined;
  }

  async deleteTrainingModule(id: number): Promise<boolean> {
    try {
      await db.delete(trainingModules).where(eq(trainingModules.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting training module:", error);
      return false;
    }
  }

  // Training Progress operations
  async getTrainingProgress(id: number): Promise<TrainingProgress | undefined> {
    const [progress] = await db.select().from(trainingProgress).where(eq(trainingProgress.id, id));
    return progress || undefined;
  }

  async getTrainingProgressByUser(userId: string): Promise<TrainingProgress[]> {
    return await db.select().from(trainingProgress).where(eq(trainingProgress.userId, userId));
  }

  async getTrainingProgressByModule(moduleId: number): Promise<TrainingProgress[]> {
    return await db.select().from(trainingProgress).where(eq(trainingProgress.moduleId, moduleId));
  }

  async createTrainingProgress(progress: InsertTrainingProgress): Promise<TrainingProgress> {
    const [newProgress] = await db.insert(trainingProgress).values(progress).returning();
    return newProgress;
  }

  async updateTrainingProgress(id: number, progress: Partial<TrainingProgress>): Promise<TrainingProgress | undefined> {
    const [updatedProgress] = await db
      .update(trainingProgress)
      .set(progress)
      .where(eq(trainingProgress.id, id))
      .returning();
    return updatedProgress || undefined;
  }

  // Approval Workflow operations
  // Approval Item operations
  async createApprovalItem(item: InsertApprovalItem): Promise<ApprovalItem> {
    const [newItem] = await db.insert(approvalItems).values(item).returning();
    return newItem;
  }

  async getApprovalItem(id: number): Promise<ApprovalItem | undefined> {
    const [item] = await db.select().from(approvalItems).where(eq(approvalItems.id, id));
    return item || undefined;
  }

  async getApprovalItemByWorkflowId(workflowId: string): Promise<ApprovalItem | undefined> {
    const [item] = await db.select().from(approvalItems).where(eq(approvalItems.workflowId, workflowId));
    return item || undefined;
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
    const { status, moduleType, priority, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
    
    // Apply filters
    if (status) {
      query = query.where(eq(approvalItems.status, status));
    }
    
    if (moduleType) {
      query = query.where(eq(approvalItems.moduleType, moduleType));
    }
    
    if (priority) {
      query = query.where(eq(approvalItems.priority, priority));
    }
    
    if (search) {
      query = query.where(
        or(
          like(approvalItems.title, `%${search}%`),
          like(approvalItems.description, `%${search}%`)
        )
      );
    }
    
    // Apply sorting
    if (sortOrder === 'asc') {
      if (sortBy === 'title') {
        query = query.orderBy(asc(approvalItems.title));
      } else if (sortBy === 'status') {
        query = query.orderBy(asc(approvalItems.status));
      } else if (sortBy === 'priority') {
        query = query.orderBy(asc(approvalItems.priority));
      } else if (sortBy === 'moduleType') {
        query = query.orderBy(asc(approvalItems.moduleType));
      } else {
        query = query.orderBy(asc(approvalItems.createdAt));
      }
    } else {
      if (sortBy === 'title') {
        query = query.orderBy(desc(approvalItems.title));
      } else if (sortBy === 'status') {
        query = query.orderBy(desc(approvalItems.status));
      } else if (sortBy === 'priority') {
        query = query.orderBy(desc(approvalItems.priority));
      } else if (sortBy === 'moduleType') {
        query = query.orderBy(desc(approvalItems.moduleType));
      } else {
        query = query.orderBy(desc(approvalItems.createdAt));
      }
    }
    
    // Apply pagination
    query = query.limit(limit).offset((page - 1) * limit);
    
    return await query;
  }

  async updateApprovalItem(workflowId: string, updates: Partial<ApprovalItem>): Promise<ApprovalItem | undefined> {
    const [updatedItem] = await db
      .update(approvalItems)
      .set(updates)
      .where(eq(approvalItems.workflowId, workflowId))
      .returning();
    return updatedItem || undefined;
  }

  // Approval Assignment operations
  async createApprovalAssignment(assignment: InsertApprovalAssignment): Promise<ApprovalAssignment> {
    const [newAssignment] = await db.insert(approvalAssignments).values(assignment).returning();
    return newAssignment;
  }

  async getApprovalAssignment(id: number): Promise<ApprovalAssignment | undefined> {
    const [assignment] = await db.select().from(approvalAssignments).where(eq(approvalAssignments.id, id));
    return assignment || undefined;
  }

  async getApprovalAssignmentsByWorkflowId(workflowId: string): Promise<ApprovalAssignment[]> {
    return await db.select().from(approvalAssignments).where(eq(approvalAssignments.workflowId, workflowId));
  }

  async getApprovalAssignmentsByUserId(userId: string): Promise<ApprovalAssignment[]> {
    return await db.select().from(approvalAssignments).where(eq(approvalAssignments.userId, userId));
  }

  async updateApprovalAssignment(id: number, updates: Partial<ApprovalAssignment>): Promise<ApprovalAssignment | undefined> {
    const [updatedAssignment] = await db
      .update(approvalAssignments)
      .set(updates)
      .where(eq(approvalAssignments.id, id))
      .returning();
    return updatedAssignment || undefined;
  }

  // Approval History operations
  async createApprovalHistory(history: InsertApprovalHistory): Promise<ApprovalHistory> {
    const [newHistory] = await db.insert(approvalHistory).values(history).returning();
    return newHistory;
  }

  async getApprovalHistoryByWorkflowId(workflowId: string): Promise<ApprovalHistory[]> {
    return await db.select().from(approvalHistory)
      .where(eq(approvalHistory.workflowId, workflowId))
      .orderBy(desc(approvalHistory.actionAt));
  }

  // Approval Notification operations
  async createApprovalNotification(notification: InsertApprovalNotification): Promise<ApprovalNotification> {
    const [newNotification] = await db.insert(approvalNotifications).values(notification).returning();
    return newNotification;
  }

  async getApprovalNotificationsByUserId(userId: string, options?: {
    isRead?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApprovalNotification[]> {
    let query = db.select().from(approvalNotifications).where(eq(approvalNotifications.userId, userId));
    
    if (options?.isRead !== undefined) {
      query = query.where(eq(approvalNotifications.isRead, options.isRead));
    }
    
    query = query.orderBy(desc(approvalNotifications.createdAt));
    
    if (options?.page !== undefined && options?.limit !== undefined) {
      const { page, limit } = options;
      query = query.limit(limit).offset((page - 1) * limit);
    }
    
    return await query;
  }

  async markNotificationsAsRead(notificationIds: number[]): Promise<void> {
    await db
      .update(approvalNotifications)
      .set({ isRead: true })
      .where(inArray(approvalNotifications.id, notificationIds));
  }

  // Approval Settings operations
  async getApprovalSettings(userId: string): Promise<ApprovalSettings | undefined> {
    const [settings] = await db.select().from(approvalSettings).where(eq(approvalSettings.userId, userId));
    return settings || undefined;
  }

  async createApprovalSettings(settings: InsertApprovalSettings): Promise<ApprovalSettings> {
    const [newSettings] = await db.insert(approvalSettings).values(settings).returning();
    return newSettings;
  }

  async updateApprovalSettings(userId: string, updates: Partial<ApprovalSettings>): Promise<ApprovalSettings | undefined> {
    const [updatedSettings] = await db
      .update(approvalSettings)
      .set(updates)
      .where(eq(approvalSettings.userId, userId))
      .returning();
    return updatedSettings || undefined;
  }

  // Expert Review operations
  async getExpertReviews(options?: { status?: string; type?: string }): Promise<ExpertReview[]> {
    let query = db.select().from(expertReviews);
    
    if (options?.status) {
      query = query.where(eq(expertReviews.status, options.status));
    }
    
    if (options?.type) {
      query = query.where(eq(expertReviews.type, options.type));
    }
    
    return await query.orderBy(desc(expertReviews.requestedAt));
  }

  async getExpertReviewById(reviewId: string): Promise<ExpertReview | null> {
    const [review] = await db.select().from(expertReviews).where(eq(expertReviews.reviewId, reviewId));
    return review || null;
  }

  async createExpertReview(review: InsertExpertReview): Promise<ExpertReview> {
    const [newReview] = await db.insert(expertReviews).values(review).returning();
    return newReview;
  }

  async updateExpertReview(reviewId: string, updates: Partial<InsertExpertReview>): Promise<ExpertReview> {
    const [updatedReview] = await db
      .update(expertReviews)
      .set(updates)
      .where(eq(expertReviews.reviewId, reviewId))
      .returning();
    
    if (!updatedReview) {
      throw new Error(`Expert review with ID ${reviewId} not found`);
    }
    
    return updatedReview;
  }

  async deleteExpertReview(reviewId: string): Promise<boolean> {
    try {
      await db.delete(expertReviews).where(eq(expertReviews.reviewId, reviewId));
      return true;
    } catch (error) {
      console.error("Error deleting expert review:", error);
      return false;
    }
  }

  // Regulatory Terms operations
  async getRegulatoryTerms(language: string = 'en'): Promise<RegulatoryTerm[]> {
    return await db.select().from(regulatoryTerms)
      .where(eq(regulatoryTerms.language, language))
      .orderBy(asc(regulatoryTerms.term));
  }

  async getRegulatoryTermById(id: number): Promise<RegulatoryTerm | undefined> {
    const [term] = await db.select().from(regulatoryTerms).where(eq(regulatoryTerms.id, id));
    return term || undefined;
  }

  async getRegulatoryTermByTerm(term: string, language: string = 'en'): Promise<RegulatoryTerm | undefined> {
    const [regulatoryTerm] = await db.select().from(regulatoryTerms)
      .where(and(
        eq(regulatoryTerms.term, term),
        eq(regulatoryTerms.language, language)
      ));
    return regulatoryTerm || undefined;
  }

  async createRegulatoryTerm(term: InsertRegulatoryTerm): Promise<RegulatoryTerm> {
    const [newTerm] = await db.insert(regulatoryTerms).values(term).returning();
    return newTerm;
  }

  async updateRegulatoryTerm(id: number, term: Partial<RegulatoryTerm>): Promise<RegulatoryTerm | undefined> {
    const [updatedTerm] = await db
      .update(regulatoryTerms)
      .set(term)
      .where(eq(regulatoryTerms.id, id))
      .returning();
    return updatedTerm || undefined;
  }

  async deleteRegulatoryTerm(id: number): Promise<boolean> {
    try {
      await db.delete(regulatoryTerms).where(eq(regulatoryTerms.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting regulatory term:", error);
      return false;
    }
  }

  // Document Templates operations
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates)
      .orderBy(asc(documentTemplates.name));
  }

  async getDocumentTemplateById(id: number): Promise<DocumentTemplate | undefined> {
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
    return template || undefined;
  }

  async getDocumentTemplateByTemplateId(templateId: string): Promise<DocumentTemplate | undefined> {
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.templateId, templateId));
    return template || undefined;
  }

  async createDocumentTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const [newTemplate] = await db.insert(documentTemplates).values(template).returning();
    return newTemplate;
  }

  async updateDocumentTemplate(id: number, template: Partial<DocumentTemplate>): Promise<DocumentTemplate | undefined> {
    const [updatedTemplate] = await db
      .update(documentTemplates)
      .set(template)
      .where(eq(documentTemplates.id, id))
      .returning();
    return updatedTemplate || undefined;
  }

  async deleteDocumentTemplate(id: number): Promise<boolean> {
    try {
      await db.delete(documentTemplates).where(eq(documentTemplates.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting document template:", error);
      return false;
    }
  }

  // Feedback operations
  async getAllFeedback(options?: { 
    systemId?: string; 
    assessmentId?: string; 
    status?: string; 
    category?: string; 
    isPublic?: boolean 
  }): Promise<any[]> {
    // Not implemented yet
    return [];
  }

  async getFeedbackById(feedbackId: string): Promise<any | undefined> {
    // Not implemented yet
    return undefined;
  }

  async createFeedback(feedback: any): Promise<any> {
    // Not implemented yet
    return { id: 1, title: "Test feedback", description: "Description" };
  }

  async updateFeedback(feedbackId: string, updates: any): Promise<any | undefined> {
    // Not implemented yet
    return undefined;
  }

  async getUserVote(feedbackId: string, userId: string): Promise<any | undefined> {
    // Not implemented yet
    return undefined;
  }

  async createVote(vote: any): Promise<any> {
    // Not implemented yet
    return { id: 1, feedbackId: "test-feedback-id", userId: "test-user-id" };
  }

  async updateVote(id: number, updates: any): Promise<any | undefined> {
    // Not implemented yet
    return undefined;
  }

  async deleteVote(id: number): Promise<boolean> {
    // Not implemented yet
    return true;
  }

  async updateFeedbackVoteCount(feedbackId: string, change: number): Promise<void> {
    // Not implemented yet
  }
}

// Export an instance of the DatabaseStorage
export const dbStorage = new DatabaseStorage();