import { relations, sql } from "drizzle-orm";
import { text, integer, timestamp, pgTable, serial, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import feedback schema
import { userFeedback, feedbackVotes } from "./schemas/feedback";

// User role enum
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'operator', 'developer', 'decision_maker']);

// API Keys table
export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  provider: text('provider').notNull(),
  key: text('key').notNull(),
  description: text('description'),
  active: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  lastUsed: timestamp('last_used')
});

// User table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  username: text('username').notNull(),
  displayName: text('display_name'),
  department: text('department'),
  role: userRoleEnum('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login'),
});

export const usersRelations = relations(users, ({ many }) => ({
  systems: many(aiSystems),
  assessments: many(riskAssessments),
  feedback: many(userFeedback, { relationName: 'user_feedback' }),
  feedbackVotes: many(feedbackVotes, { relationName: 'feedback_votes' }),
}));

// AI System table
export const aiSystems = pgTable('ai_systems', {
  id: serial('id').primaryKey(),
  systemId: text('system_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  vendor: text('vendor'),
  department: text('department'),
  riskLevel: text('risk_level').notNull(), // Added as required field
  riskScore: integer('risk_score'),
  implementationDate: timestamp('implementation_date'),
  lastAssessmentDate: timestamp('last_assessment_date'),
  docCompleteness: integer('doc_completeness').default(0),
  trainingCompleteness: integer('training_completeness').default(0),
  purpose: text('purpose'),
  version: text('version'),
  aiCapabilities: text('ai_capabilities'),
  trainingDatasets: text('training_datasets'),
  usageContext: text('usage_context'),
  potentialImpact: text('potential_impact'),
  keywords: jsonb('keywords'),
  expectedLifetime: text('expected_lifetime'),
  maintenanceSchedule: text('maintenance_schedule'),
  deploymentScope: text('deployment_scope'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  createdBy: text('created_by').references(() => users.uid),
});

export const aiSystemsRelations = relations(aiSystems, ({ many, one }) => ({
  assessments: many(riskAssessments),
  creator: one(users, {
    fields: [aiSystems.createdBy],
    references: [users.uid],
  }),
  feedback: many(userFeedback, { relationName: 'system_feedback' }),
}));

// Risk Assessment table
export const riskAssessments = pgTable('risk_assessments', {
  id: serial('id').primaryKey(),
  assessmentId: text('assessment_id').notNull().unique(),
  systemId: text('system_id').references(() => aiSystems.systemId),
  assessmentDate: timestamp('assessment_date'), // Added to match database structure
  createdBy: text('created_by').references(() => users.uid),
  createdAt: timestamp('created_at').defaultNow(),
  status: text('status').default('draft'),
  riskLevel: text('risk_level').notNull(),
  riskScore: integer('risk_score').notNull(),
  systemCategory: text('system_category'),
  prohibitedUseChecks: jsonb('prohibited_use_checks'),
  euAiActArticles: jsonb('eu_ai_act_articles'),
  complianceGaps: jsonb('compliance_gaps'),
  remediationActions: jsonb('remediation_actions'),
  evidenceDocuments: jsonb('evidence_documents'),
  summaryNotes: text('summary_notes'),
});

export const riskAssessmentsRelations = relations(riskAssessments, ({ one, many }) => ({
  system: one(aiSystems, {
    fields: [riskAssessments.systemId],
    references: [aiSystems.systemId],
  }),
  creator: one(users, {
    fields: [riskAssessments.createdBy],
    references: [users.uid],
  }),
  feedback: many(userFeedback, { relationName: 'assessment_feedback' }),
}));

// EU AI Act Articles table
export const euAiActArticles = pgTable('eu_ai_act_articles', {
  id: serial('id').primaryKey(),
  articleId: text('article_id').notNull().unique(), // e.g., "Article 5"
  number: integer('number').notNull(), // e.g., 5
  title: text('title').notNull(), // e.g., "Prohibited AI Practices"
  content: text('content').notNull(), // Full text of the article
  officialUrl: text('official_url'), // Link to the official source
  riskLevel: text('risk_level'), // e.g., 'high', 'limited', 'minimal', 'prohibited'
  keyPoints: jsonb('key_points'), // Summary points about the article
  version: text('version').default('1.0'), // Version of the regulation
  lastUpdated: timestamp('last_updated').defaultNow(),
  isLatest: boolean('is_latest').default(true), // Flag for the latest version
  changeDescription: text('change_description'), // Description of changes if updated
  exampleSummary: text('example_summary'), // Brief practical example
  exampleDetails: text('example_details'), // Detailed practical example
  imageUrl: text('image_url'), // URL to screenshot or illustration
});

// Article Version History table to track changes
export const articleVersions = pgTable('article_versions', {
  id: serial('id').primaryKey(),
  articleId: text('article_id').references(() => euAiActArticles.articleId),
  version: text('version').notNull(),
  content: text('content').notNull(),
  changedAt: timestamp('changed_at').defaultNow(),
  changedBy: text('changed_by').references(() => users.uid),
  changeNotes: text('change_notes'),
  previousVersion: text('previous_version'),
});

export const articleVersionsRelations = relations(articleVersions, ({ one }) => ({
  article: one(euAiActArticles, {
    fields: [articleVersions.articleId],
    references: [euAiActArticles.articleId],
  }),
  changedByUser: one(users, {
    fields: [articleVersions.changedBy],
    references: [users.uid],
  }),
}));

// Training modules table
export const trainingModules = pgTable('training_modules', {
  id: serial('id').primaryKey(),
  moduleId: text('module_id').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  duration: text('duration'),
  topics: jsonb('topics'),
  targetAudience: jsonb('target_audience'),
  content: jsonb('content'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  status: text('status').default('active'),
});

// Training progress table
export const trainingProgress = pgTable('training_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid),
  moduleId: text('module_id').references(() => trainingModules.moduleId),
  completion: integer('completion').default(0),
  assessmentScore: integer('assessment_score'),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

// Insertion Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertAiSystemSchema = createInsertSchema(aiSystems).omit({ id: true, createdAt: true });
export type InsertAiSystem = z.infer<typeof insertAiSystemSchema>;
export type AiSystem = typeof aiSystems.$inferSelect;

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({ id: true, createdAt: true });
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;
export type RiskAssessment = typeof riskAssessments.$inferSelect;

export const insertEuAiActArticleSchema = createInsertSchema(euAiActArticles).omit({ id: true, lastUpdated: true });
export type InsertEuAiActArticle = z.infer<typeof insertEuAiActArticleSchema>;
export type EuAiActArticle = typeof euAiActArticles.$inferSelect;

export const insertArticleVersionSchema = createInsertSchema(articleVersions).omit({ id: true, changedAt: true });
export type InsertArticleVersion = z.infer<typeof insertArticleVersionSchema>;
export type ArticleVersion = typeof articleVersions.$inferSelect;

export const insertTrainingModuleSchema = createInsertSchema(trainingModules).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTrainingModule = z.infer<typeof insertTrainingModuleSchema>;
export type TrainingModule = typeof trainingModules.$inferSelect;

export const insertTrainingProgressSchema = createInsertSchema(trainingProgress).omit({ id: true, lastUpdated: true });
export type InsertTrainingProgress = z.infer<typeof insertTrainingProgressSchema>;
export type TrainingProgress = typeof trainingProgress.$inferSelect;

// Enums for approval workflow
export enum ApprovalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_REVIEW = 'in_review',
  REQUESTED_CHANGES = 'requested_changes',
}

export enum ModuleType {
  TRAINING = 'training',
  RISK_ASSESSMENT = 'risk_assessment',
  COMPLIANCE = 'compliance',
  DOCUMENTATION = 'documentation',
  POLICY = 'policy',
  SYSTEM_REGISTRATION = 'system_registration',
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  NEVER = 'never',
}

// Tables for approval workflow
export const approvalItems = pgTable('approval_items', {
  id: serial('id').primaryKey(),
  workflowId: text('item_id').notNull().unique(), // Maps to item_id in the database
  name: text('title').notNull(), // Maps to title in the database
  description: text('description'),
  moduleType: text('module_type').notNull(),
  moduleId: text('content_id').notNull(), // Maps to content_id in the database
  status: text('status').default('pending'),
  priority: text('priority').default('medium'),
  createdAt: timestamp('created_at').defaultNow(),
  submittedBy: text('created_by').references(() => users.uid), // Maps to created_by in the database
  updatedAt: timestamp('updated_at'),
  // Additional fields needed by the implementation
  submitterName: text('submitter_name'),
  department: text('department'),
  dueDate: timestamp('due_date'),
  details: jsonb('details'),
  language: text('language'),
});

export const approvalAssignments = pgTable('approval_assignments', {
  id: serial('id').primaryKey(),
  assignmentId: text('assignment_id').notNull().unique(),
  itemId: text('item_id'), // Removed constraint for now to avoid db migration issues
  assignedTo: text('assigned_to').references(() => users.uid),
  assignedBy: text('assigned_by').references(() => users.uid),
  assignedAt: timestamp('assigned_at').defaultNow(),
  dueDate: timestamp('due_date'),
  status: text('status').default('pending'),
  notes: text('notes'),
});

export const approvalHistory = pgTable('approval_history', {
  id: serial('id').primaryKey(),
  historyId: text('history_id').notNull().unique(),
  itemId: text('item_id'), // Removed constraint for now to avoid db migration issues
  action: text('action').notNull(),
  actionBy: text('action_by').references(() => users.uid),
  actionAt: timestamp('action_at').defaultNow(),
  comments: text('comments'),
  previousStatus: text('previous_status'),
  newStatus: text('new_status'),
});

export const approvalNotifications = pgTable('approval_notifications', {
  id: serial('id').primaryKey(),
  notificationId: text('notification_id').notNull().unique(),
  userId: text('user_id').references(() => users.uid),
  itemId: text('item_id'), // Removed constraint for now to avoid db migration issues
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const approvalSettings = pgTable('approval_settings', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).unique(),
  notificationFrequency: text('notification_frequency').default('immediate'),
  emailNotifications: boolean('email_notifications').default(true),
  assignmentAlerts: boolean('assignment_alerts').default(true),
  statusChangeAlerts: boolean('status_change_alerts').default(true),
  updatedAt: timestamp('updated_at'),
});

// Approval workflow schemas
export const insertApprovalItemSchema = createInsertSchema(approvalItems).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertApprovalItem = z.infer<typeof insertApprovalItemSchema>;
export type ApprovalItem = typeof approvalItems.$inferSelect;

export const insertApprovalAssignmentSchema = createInsertSchema(approvalAssignments).omit({ id: true, assignedAt: true });
export type InsertApprovalAssignment = z.infer<typeof insertApprovalAssignmentSchema>;
export type ApprovalAssignment = typeof approvalAssignments.$inferSelect;

export const insertApprovalHistorySchema = createInsertSchema(approvalHistory).omit({ id: true, actionAt: true });
export type InsertApprovalHistory = z.infer<typeof insertApprovalHistorySchema>;
export type ApprovalHistory = typeof approvalHistory.$inferSelect;

export const insertApprovalNotificationSchema = createInsertSchema(approvalNotifications).omit({ id: true, createdAt: true });
export type InsertApprovalNotification = z.infer<typeof insertApprovalNotificationSchema>;
export type ApprovalNotification = typeof approvalNotifications.$inferSelect;

export const insertApprovalSettingsSchema = createInsertSchema(approvalSettings).omit({ id: true, updatedAt: true });
export type InsertApprovalSettings = z.infer<typeof insertApprovalSettingsSchema>;
export type ApprovalSettings = typeof approvalSettings.$inferSelect;

// Feature flags table for development features
export const featureFlags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  enabled: boolean('enabled').default(false),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at'),
});

// System settings table for global configurations
export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  value: text('value'),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at'),
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({ id: true, created_at: true, updated_at: true });
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({ id: true, created_at: true, updated_at: true });
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;

// Regulatory Terms table for tooltip explanations
export const regulatoryTerms = pgTable('regulatory_terms', {
  id: serial('id').primaryKey(),
  termId: text('term_id').notNull().unique(),
  term: text('term').notNull(),
  definition: text('definition').notNull(),
  language: text('language').notNull().default('en'), // 'en' or 'de'
  category: text('category'),
  importance: text('importance').default('medium'), // high, medium, low
  source: text('source'),
  articleReference: text('article_reference'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  createdBy: text('created_by').references(() => users.uid),
  isVerified: boolean('is_verified').default(false),
  contextExample: text('context_example'),
  relatedTerms: text('related_terms').array(),
  metadata: jsonb('metadata')
});

export const insertRegulatoryTermSchema = createInsertSchema(regulatoryTerms).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRegulatoryTerm = z.infer<typeof insertRegulatoryTermSchema>;
export type RegulatoryTerm = typeof regulatoryTerms.$inferSelect;

// Document Templates table
export const documentTemplates = pgTable('document_templates', {
  id: serial('id').primaryKey(),
  templateId: text('template_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // technical_documentation, risk_assessment, etc.
  content: text('content').notNull(), // Markdown template content
  isDefault: boolean('is_default').default(false),
  isPublic: boolean('is_public').default(true),
  createdBy: text('created_by').references(() => users.uid),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  version: text('version').default('1.0'),
  tags: text('tags').array(),
  metadata: jsonb('metadata'), // For additional configuration
});

// Regulatory Updates table for tracking AI Act updates
export const regulatoryUpdates = pgTable('regulatory_updates', {
  id: serial('id').primaryKey(),
  updateId: text('update_id').notNull().unique(),
  title: text('title').notNull(),
  source: text('source'),
  publicationDate: timestamp('publication_date'),
  summary: text('summary'),
  content: text('content'),
  relevance: text('relevance'), // High, Medium, Low
  impactAreas: text('impact_areas').array(),
  status: text('status').default('new'), // new, reviewed, archived
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  type: text('type').default('regulation'), // regulation, guidance, opinion, news
  metadata: jsonb('metadata'), // For storing system impact analysis and other details
});

// Table for system-specific impact assessments of regulatory updates
export const regulatoryImpacts = pgTable('regulatory_impacts', {
  id: serial('id').primaryKey(),
  impactId: text('impact_id').notNull().unique(),
  updateId: text('update_id').references(() => regulatoryUpdates.updateId),
  systemId: text('system_id').references(() => aiSystems.systemId),
  impactLevel: text('impact_level'), // High, Medium, Low
  summary: text('summary'),
  affectedAreas: text('affected_areas').array(),
  requiredActions: text('required_actions').array(),
  timeline: text('timeline'),
  complianceRisks: text('compliance_risks').array(),
  status: text('status').default('pending'), // pending, in-progress, implemented, waived
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  createdBy: text('created_by').references(() => users.uid),
});

export const documentTemplatesRelations = relations(documentTemplates, ({ one }) => ({
  creator: one(users, {
    fields: [documentTemplates.createdBy],
    references: [users.uid],
  }),
}));

// Expert Reviews table
export const expertReviews = pgTable('expert_reviews', {
  id: serial('id').primaryKey(),
  reviewId: text('review_id').notNull().unique(),
  assessmentId: text('assessment_id'),
  systemId: text('system_id'),
  text: text('text').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull().default('pending'),
  validationResult: jsonb('validation_result'),
  requestedAt: timestamp('requested_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  assignedTo: text('assigned_to').references(() => users.uid),
  completedAt: timestamp('completed_at'),
  expertFeedback: text('expert_feedback'),
});

export const expertReviewsRelations = relations(expertReviews, ({ one }) => ({
  system: one(aiSystems, {
    fields: [expertReviews.systemId],
    references: [aiSystems.systemId],
  }),
  assessment: one(riskAssessments, {
    fields: [expertReviews.assessmentId],
    references: [riskAssessments.assessmentId],
  }),
  assignedExpert: one(users, {
    fields: [expertReviews.assignedTo],
    references: [users.uid],
  }),
}));

export const expertReviewSchema = createInsertSchema(expertReviews).omit({ id: true });
export type InsertExpertReview = z.infer<typeof expertReviewSchema>;
export type ExpertReview = typeof expertReviews.$inferSelect;

// API Keys schema
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true, lastUsed: true });
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;

// User activity logging
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid),
  activityType: text('activity_type').notNull(),
  description: text('description').notNull(),
  details: jsonb('details'),
  timestamp: timestamp('timestamp').defaultNow(),
  targetId: text('target_id'),
  targetType: text('target_type'),
  ip: text('ip'),
  // Support for legacy fields
  type: text('type'),
  systemId: text('system_id'),
  metadata: jsonb('metadata')
});

export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, timestamp: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Document Templates schema
export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;

// Regulatory Updates schema
export const insertRegulatoryUpdateSchema = createInsertSchema(regulatoryUpdates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRegulatoryUpdate = z.infer<typeof insertRegulatoryUpdateSchema>;
export type RegulatoryUpdate = typeof regulatoryUpdates.$inferSelect;

// Regulatory Impacts schema
export const insertRegulatoryImpactSchema = createInsertSchema(regulatoryImpacts).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRegulatoryImpact = z.infer<typeof insertRegulatoryImpactSchema>;
export type RegulatoryImpact = typeof regulatoryImpacts.$inferSelect;