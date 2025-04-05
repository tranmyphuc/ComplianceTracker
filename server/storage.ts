/**
 * Storage module
 * 
 * Handles database operations for the EU AI Act Compliance Platform.
 * Uses DatabaseStorage from db-storage.ts to ensure application functionality.
 */

// Import and re-export the database storage from db-storage.ts
import { dbStorage } from "./db-storage";
import { 
  DocumentTemplate, 
  RegulatoryTerm, 
  type InsertDocumentTemplate,
  type InsertRegulatoryTerm 
} from "@shared/schema";
import type { IStorage } from "./storage-interface";

// Create a storage wrapper that implements any missing methods in the interface
class StorageWrapper implements IStorage {
  private dbStorage = dbStorage;

  // Regulatory Terms operations
  async getRegulatoryTerm(id: number): Promise<RegulatoryTerm | undefined> {
    return this.dbStorage.getRegulatoryTerm(id);
  }

  async getRegulatoryTermByTermId(termId: string): Promise<RegulatoryTerm | undefined> {
    return this.dbStorage.getRegulatoryTermByTermId(termId);
  }

  async getRegulatoryTermsByLanguage(language: string): Promise<RegulatoryTerm[]> {
    return this.dbStorage.getRegulatoryTermsByLanguage(language);
  }

  async getRegulatoryTermsByCategory(category: string, language?: string): Promise<RegulatoryTerm[]> {
    return this.dbStorage.getRegulatoryTermsByCategory(category, language);
  }

  async searchRegulatoryTerms(searchText: string, language?: string): Promise<RegulatoryTerm[]> {
    return this.dbStorage.searchRegulatoryTerms(searchText, language);
  }

  async createRegulatoryTerm(term: InsertRegulatoryTerm): Promise<RegulatoryTerm> {
    return this.dbStorage.createRegulatoryTerm(term);
  }

  async updateRegulatoryTerm(id: number, term: Partial<RegulatoryTerm>): Promise<RegulatoryTerm | undefined> {
    return this.dbStorage.updateRegulatoryTerm(id, term);
  }

  async deleteRegulatoryTerm(id: number): Promise<boolean> {
    return this.dbStorage.deleteRegulatoryTerm(id);
  }

  // Document Template operations
  async getDocumentTemplate(id: number): Promise<DocumentTemplate | undefined> {
    return this.dbStorage.getDocumentTemplateById(id);
  }

  async getDocumentTemplateByTemplateId(templateId: string): Promise<DocumentTemplate | undefined> {
    return this.dbStorage.getDocumentTemplateByTemplateId(templateId);
  }

  async getAllDocumentTemplates(options?: { 
    category?: string; 
    type?: string;
    language?: string;
    isDefault?: boolean;
  }): Promise<DocumentTemplate[]> {
    // For now, just return all templates since filtering is not implemented in the db-storage
    // In the future, implement filtering based on options
    return this.dbStorage.getDocumentTemplates();
  }

  async createDocumentTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate> {
    return this.dbStorage.createDocumentTemplate(template);
  }

  async updateDocumentTemplate(id: number, template: Partial<DocumentTemplate>): Promise<DocumentTemplate | undefined> {
    return this.dbStorage.updateDocumentTemplate(id, template);
  }

  async deleteDocumentTemplate(id: number): Promise<boolean> {
    return this.dbStorage.deleteDocumentTemplate(id);
  }

  // Forward all other methods to dbStorage
  async getUser(id: number) {
    return this.dbStorage.getUser(id);
  }

  async getUserByUsername(username: string) {
    return this.dbStorage.getUserByUsername(username);
  }

  async getUserByUid(uid: string) {
    return this.dbStorage.getUserByUid(uid);
  }

  async getUserByEmail(email: string) {
    return this.dbStorage.getUserByEmail(email);
  }

  async createUser(user: any) {
    return this.dbStorage.createUser(user);
  }

  // ... and all other methods from IStorage interface
  // Add forwarders for all other methods from the interface

  // Department operations (stub implementations)
  async getDepartment(id: number) {
    return { id, name: "Sample Department" };
  }

  async getAllDepartments() {
    return [
      { id: 1, name: "IT Department" },
      { id: 2, name: "HR Department" },
      { id: 3, name: "Legal Department" }
    ];
  }

  async createDepartment(department: any) {
    return { id: 1, ...department };
  }

  async updateDepartment(id: number, department: any) {
    return { id, ...department };
  }

  // Alert operations (stub implementations)
  async getCriticalAlerts(limit: number) {
    return [];
  }

  async createAlert(alert: any) {
    return { id: 1, ...alert };
  }

  async resolveAlert(id: number) {
    return { id, resolved: true };
  }

  // Deadline operations (stub implementations)
  async getUpcomingDeadlines(limit: number) {
    return [];
  }

  async createDeadline(deadline: any) {
    return { id: 1, ...deadline };
  }

  // Document operations (stub implementations)
  async getDocumentsForSystem(systemId: string) {
    return [];
  }

  async createDocument(document: any) {
    return { id: 1, ...document };
  }

  async updateDocument(id: number, document: any) {
    return { id, ...document };
  }

  // Risk Management System operations (stub implementations)
  async createRiskManagementSystem(rms: any) {
    return { id: 1, ...rms };
  }

  async getRiskManagementSystemBySystemId(systemId: string) {
    return { id: 1, systemId };
  }

  async updateRiskManagementSystem(rmsId: string, updates: any) {
    return { id: rmsId, ...updates };
  }

  // Risk Control operations (stub implementations)
  async createRiskControl(control: any) {
    return { id: 1, ...control };
  }

  async getRiskControlByControlId(controlId: string) {
    return { id: controlId };
  }

  async getRiskControlsBySystemId(systemId: string) {
    return [];
  }

  async getRiskControlsByGapId(gapId: string) {
    return [];
  }

  async updateRiskControl(controlId: string, updates: any) {
    return { id: controlId, ...updates };
  }

  // Risk Event operations (stub implementations)
  async createRiskEvent(event: any) {
    return { id: 1, ...event };
  }

  async getRiskEventByEventId(eventId: string) {
    return { id: eventId };
  }

  async getRiskEventsBySystemId(systemId: string) {
    return [];
  }

  async updateRiskEvent(eventId: string, updates: any) {
    return { id: eventId, ...updates };
  }

  // Forward other methods as needed
  async getAiSystem(id: number) {
    return this.dbStorage.getAiSystem(id);
  }

  async getAiSystemBySystemId(systemId: string) {
    return this.dbStorage.getAiSystemBySystemId(systemId);
  }

  async getAllAiSystems() {
    return this.dbStorage.getAllAiSystems();
  }

  async getHighRiskAiSystems(limit?: number) {
    return this.dbStorage.getHighRiskAiSystems(limit);
  }

  async createAiSystem(system: any) {
    return this.dbStorage.createAiSystem(system);
  }

  async updateAiSystem(id: number, system: any) {
    return this.dbStorage.updateAiSystem(id, system);
  }

  async deleteAiSystem(id: number) {
    return this.dbStorage.deleteAiSystem(id);
  }

  // Activity operations
  async getRecentActivities(limit: number) {
    return this.dbStorage.getRecentActivities(limit);
  }

  async createActivity(activity: any) {
    return this.dbStorage.createActivity(activity);
  }

  // Risk Assessment operations
  async getRiskAssessment(id: number) {
    return this.dbStorage.getRiskAssessment(id);
  }

  async getRiskAssessmentByAssessmentId(assessmentId: string) {
    return this.dbStorage.getRiskAssessmentByAssessmentId(assessmentId);
  }

  async getRiskAssessmentsForSystem(systemId: string) {
    return this.dbStorage.getRiskAssessmentsForSystem(systemId);
  }

  async getAllRiskAssessments() {
    return this.dbStorage.getAllRiskAssessments();
  }

  async createRiskAssessment(assessment: any) {
    return this.dbStorage.createRiskAssessment(assessment);
  }

  async updateRiskAssessment(id: number, assessment: any) {
    return this.dbStorage.updateRiskAssessment(id, assessment);
  }

  async deleteRiskAssessment(id: number) {
    return this.dbStorage.deleteRiskAssessment(id);
  }

  // API Key operations
  async getApiKeys(provider?: string) {
    return this.dbStorage.getApiKeys(provider);
  }

  async getApiKey(id: number) {
    return this.dbStorage.getApiKey(id);
  }

  async createApiKey(apiKey: any) {
    return this.dbStorage.createApiKey(apiKey);
  }

  async updateApiKey(id: number, apiKey: any) {
    return this.dbStorage.updateApiKey(id, apiKey);
  }

  async deleteApiKey(id: number) {
    return this.dbStorage.deleteApiKey(id);
  }

  // EU AI Act Article operations
  async getEuAiActArticle(id: number) {
    return this.dbStorage.getEuAiActArticle(id);
  }

  async getEuAiActArticleByArticleId(articleId: string) {
    return this.dbStorage.getEuAiActArticleByArticleId(articleId);
  }

  async getAllEuAiActArticles(options?: { riskLevel?: string; version?: string }) {
    return this.dbStorage.getAllEuAiActArticles(options);
  }

  async createEuAiActArticle(article: any) {
    return this.dbStorage.createEuAiActArticle(article);
  }

  async updateEuAiActArticle(id: number, article: any) {
    return this.dbStorage.updateEuAiActArticle(id, article);
  }

  // Article Version operations
  async getArticleVersions(articleId: string) {
    return this.dbStorage.getArticleVersions(articleId);
  }

  async createArticleVersion(version: any) {
    return this.dbStorage.createArticleVersion(version);
  }

  async getLatestArticleVersion(articleId: string) {
    return this.dbStorage.getLatestArticleVersion(articleId);
  }

  // Training Module operations
  async getTrainingModule(id: number) {
    return this.dbStorage.getTrainingModule(id);
  }

  async getAllTrainingModules() {
    return this.dbStorage.getAllTrainingModules();
  }

  async createTrainingModule(module: any) {
    return this.dbStorage.createTrainingModule(module);
  }

  async updateTrainingModule(id: number, module: any) {
    return this.dbStorage.updateTrainingModule(id, module);
  }

  async deleteTrainingModule(id: number) {
    return this.dbStorage.deleteTrainingModule(id);
  }

  // Training Progress operations
  async getTrainingProgress(id: number) {
    return this.dbStorage.getTrainingProgress(id);
  }

  async getTrainingProgressByUser(userId: string) {
    return this.dbStorage.getTrainingProgressByUser(userId);
  }

  async getTrainingProgressByModule(moduleId: number) {
    return this.dbStorage.getTrainingProgressByModule(moduleId);
  }

  async createTrainingProgress(progress: any) {
    return this.dbStorage.createTrainingProgress(progress);
  }

  async updateTrainingProgress(id: number, progress: any) {
    return this.dbStorage.updateTrainingProgress(id, progress);
  }

  // Document File operations
  async createDocumentFile(document: any) {
    return this.dbStorage.createDocumentFile(document);
  }

  async getDocumentFileById(documentId: string) {
    return this.dbStorage.getDocumentFileById(documentId);
  }

  async getDocumentFilesByAssessment(assessmentId: string) {
    return this.dbStorage.getDocumentFilesByAssessment(assessmentId);
  }

  async getDocumentFilesBySystem(systemId: string) {
    return this.dbStorage.getDocumentFilesBySystem(systemId);
  }

  async deleteDocumentFile(documentId: string) {
    return this.dbStorage.deleteDocumentFile(documentId);
  }

  // Approval Workflow operations
  async createApprovalItem(item: any) {
    return this.dbStorage.createApprovalItem(item);
  }

  async getApprovalItem(id: number) {
    return this.dbStorage.getApprovalItem(id);
  }

  async getApprovalItemByWorkflowId(workflowId: string) {
    return this.dbStorage.getApprovalItemByWorkflowId(workflowId);
  }

  async getAllApprovalItems(options?: any) {
    return this.dbStorage.getAllApprovalItems(options);
  }

  async updateApprovalItem(workflowId: string, updates: any) {
    return this.dbStorage.updateApprovalItem(workflowId, updates);
  }

  // Approval Assignment operations
  async createApprovalAssignment(assignment: any) {
    return this.dbStorage.createApprovalAssignment(assignment);
  }

  async getApprovalAssignment(id: number) {
    return this.dbStorage.getApprovalAssignment(id);
  }

  async getApprovalAssignmentsByWorkflowId(workflowId: string) {
    return this.dbStorage.getApprovalAssignmentsByWorkflowId(workflowId);
  }

  async getApprovalAssignmentsByUserId(userId: string) {
    return this.dbStorage.getApprovalAssignmentsByUserId(userId);
  }

  async updateApprovalAssignment(id: number, updates: any) {
    return this.dbStorage.updateApprovalAssignment(id, updates);
  }

  // Approval History operations
  async createApprovalHistory(history: any) {
    return this.dbStorage.createApprovalHistory(history);
  }

  async getApprovalHistoryByWorkflowId(workflowId: string) {
    return this.dbStorage.getApprovalHistoryByWorkflowId(workflowId);
  }

  // Approval Notification operations
  async createApprovalNotification(notification: any) {
    return this.dbStorage.createApprovalNotification(notification);
  }

  async getApprovalNotificationsByUserId(userId: string, options?: any) {
    return this.dbStorage.getApprovalNotificationsByUserId(userId, options);
  }

  async markNotificationsAsRead(notificationIds: number[]) {
    return this.dbStorage.markNotificationsAsRead(notificationIds);
  }

  // Approval Settings operations
  async getApprovalSettings(userId: string) {
    return this.dbStorage.getApprovalSettings(userId);
  }

  async createApprovalSettings(settings: any) {
    return this.dbStorage.createApprovalSettings(settings);
  }

  async updateApprovalSettings(userId: string, updates: any) {
    return this.dbStorage.updateApprovalSettings(userId, updates);
  }

  // Expert Review operations
  async getExpertReviews(options?: { status?: string; type?: string }) {
    return this.dbStorage.getExpertReviews(options);
  }

  async getExpertReviewById(reviewId: string) {
    return this.dbStorage.getExpertReviewById(reviewId);
  }

  async createExpertReview(review: any) {
    return this.dbStorage.createExpertReview(review);
  }

  async updateExpertReview(reviewId: string, updates: any) {
    return this.dbStorage.updateExpertReview(reviewId, updates);
  }

  async deleteExpertReview(reviewId: string) {
    return this.dbStorage.deleteExpertReview(reviewId);
  }
}

// Export the storage wrapper as the primary storage interface
export const storage = new StorageWrapper();

// Re-export the IStorage interface for type checking
import { IStorage } from "./storage-interface";
export type { IStorage };