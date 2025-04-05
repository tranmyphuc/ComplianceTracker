/**
 * IStorage Interface
 * Defines the storage operations interface for the EU AI Act Compliance Platform.
 */
import {
  User, InsertUser,
  AiSystem, InsertAiSystem,
  RiskAssessment, InsertRiskAssessment,
  EuAiActArticle, InsertEuAiActArticle,
  ArticleVersion, InsertArticleVersion,
  TrainingModule, InsertTrainingModule,
  TrainingProgress, InsertTrainingProgress,
  ApprovalItem, InsertApprovalItem,
  ApprovalAssignment, InsertApprovalAssignment,
  ApprovalHistory, InsertApprovalHistory,
  ApprovalNotification, InsertApprovalNotification,
  ApprovalSettings, InsertApprovalSettings,
  ExpertReview, InsertExpertReview,
  Activity, InsertActivity,
  ApiKey, InsertApiKey,
  RegulatoryTerm, InsertRegulatoryTerm,
  DocumentTemplate, InsertDocumentTemplate
} from "@shared/schema";

// Storage interface definition
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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

  // Department operations (stub implementations)
  getDepartment(id: number): Promise<any | undefined>;
  getAllDepartments(): Promise<any[]>;
  createDepartment(department: any): Promise<any>;
  updateDepartment(id: number, department: any): Promise<any | undefined>;

  // Activity operations
  getRecentActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Alert operations (stub implementations)
  getCriticalAlerts(limit: number): Promise<any[]>;
  createAlert(alert: any): Promise<any>;
  resolveAlert(id: number): Promise<any | undefined>;

  // Deadline operations (stub implementations)
  getUpcomingDeadlines(limit: number): Promise<any[]>;
  createDeadline(deadline: any): Promise<any>;

  // Document operations (stub implementations)
  getDocumentsForSystem(systemId: string): Promise<any[]>;
  createDocument(document: any): Promise<any>;
  updateDocument(id: number, document: any): Promise<any | undefined>;
  
  // Document File operations (stub implementations)
  createDocumentFile(document: any): Promise<any>;
  getDocumentFileById(documentId: string): Promise<any | null>;
  getDocumentFilesByAssessment(assessmentId: string): Promise<any[]>;
  getDocumentFilesBySystem(systemId: string): Promise<any[]>;
  deleteDocumentFile(documentId: string): Promise<boolean>;

  // API Key operations
  getApiKeys(provider?: string): Promise<ApiKey[]>;
  getApiKey(id: number): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: number, apiKey: Partial<ApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: number): Promise<boolean>;

  // Risk Assessment operations
  getRiskAssessment(id: number): Promise<RiskAssessment | undefined>;
  getRiskAssessmentByAssessmentId(assessmentId: string): Promise<RiskAssessment | undefined>;
  getRiskAssessmentsForSystem(systemId: string): Promise<RiskAssessment[]>;
  getAllRiskAssessments(): Promise<RiskAssessment[]>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessment(id: number, assessment: Partial<RiskAssessment>): Promise<RiskAssessment | undefined>;
  deleteRiskAssessment(id: number): Promise<boolean>;

  // Risk Management System operations (stub implementations)
  createRiskManagementSystem(rms: any): Promise<any>;
  getRiskManagementSystemBySystemId(systemId: string): Promise<any>;
  updateRiskManagementSystem(rmsId: string, updates: any): Promise<any>;

  // Risk Control operations (stub implementations)
  createRiskControl(control: any): Promise<any>;
  getRiskControlByControlId(controlId: string): Promise<any>;
  getRiskControlsBySystemId(systemId: string): Promise<any[]>;
  getRiskControlsByGapId(gapId: string): Promise<any[]>;
  updateRiskControl(controlId: string, updates: any): Promise<any>;

  // Risk Event operations (stub implementations)
  createRiskEvent(event: any): Promise<any>;
  getRiskEventByEventId(eventId: string): Promise<any>;
  getRiskEventsBySystemId(systemId: string): Promise<any[]>;
  updateRiskEvent(eventId: string, updates: any): Promise<any>;

  // EU AI Act Article operations
  getEuAiActArticle(id: number): Promise<EuAiActArticle | undefined>;
  getEuAiActArticleByArticleId(articleId: string): Promise<EuAiActArticle | undefined>;
  getAllEuAiActArticles(options?: { riskLevel?: string; version?: string }): Promise<EuAiActArticle[]>;
  createEuAiActArticle(article: InsertEuAiActArticle): Promise<EuAiActArticle>;
  updateEuAiActArticle(id: number, article: Partial<EuAiActArticle>): Promise<EuAiActArticle | undefined>;
  
  // Article Version operations
  getArticleVersions(articleId: string): Promise<ArticleVersion[]>;
  createArticleVersion(version: InsertArticleVersion): Promise<ArticleVersion>;
  getLatestArticleVersion(articleId: string): Promise<ArticleVersion | undefined>;

  // Training Module operations
  getTrainingModule(id: number): Promise<TrainingModule | undefined>;
  getAllTrainingModules(): Promise<TrainingModule[]>;
  createTrainingModule(module: InsertTrainingModule): Promise<TrainingModule>;
  updateTrainingModule(id: number, module: Partial<TrainingModule>): Promise<TrainingModule | undefined>;
  deleteTrainingModule(id: number): Promise<boolean>;

  // Training Progress operations
  getTrainingProgress(id: number): Promise<TrainingProgress | undefined>;
  getTrainingProgressByUser(userId: string): Promise<TrainingProgress[]>;
  getTrainingProgressByModule(moduleId: number): Promise<TrainingProgress[]>;
  createTrainingProgress(progress: InsertTrainingProgress): Promise<TrainingProgress>;
  updateTrainingProgress(id: number, progress: Partial<TrainingProgress>): Promise<TrainingProgress | undefined>;

  // Approval Workflow operations
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

  // Regulatory Terms operations
  getRegulatoryTerm(id: number): Promise<RegulatoryTerm | undefined>;
  getRegulatoryTermByTermId(termId: string): Promise<RegulatoryTerm | undefined>;
  getRegulatoryTermsByLanguage(language: string): Promise<RegulatoryTerm[]>;
  getRegulatoryTermsByCategory(category: string, language?: string): Promise<RegulatoryTerm[]>;
  searchRegulatoryTerms(searchText: string, language?: string): Promise<RegulatoryTerm[]>;
  createRegulatoryTerm(term: InsertRegulatoryTerm): Promise<RegulatoryTerm>;
  updateRegulatoryTerm(id: number, term: Partial<RegulatoryTerm>): Promise<RegulatoryTerm | undefined>;
  deleteRegulatoryTerm(id: number): Promise<boolean>;

  // Document Template operations
  getDocumentTemplate(id: number): Promise<DocumentTemplate | undefined>;
  getDocumentTemplateByTemplateId(templateId: string): Promise<DocumentTemplate | undefined>;
  getAllDocumentTemplates(options?: { 
    category?: string; 
    type?: string;
    language?: string;
    isDefault?: boolean;
  }): Promise<DocumentTemplate[]>;
  createDocumentTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate>;
  updateDocumentTemplate(id: number, template: Partial<DocumentTemplate>): Promise<DocumentTemplate | undefined>;
  deleteDocumentTemplate(id: number): Promise<boolean>;
}