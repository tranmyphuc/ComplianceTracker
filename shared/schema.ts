import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for approval workflow
export enum ApprovalStatus {
  PENDING = "pending",
  IN_REVIEW = "in_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled"
}

export enum ApprovalPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low"
}

export enum ModuleType {
  RISK_ASSESSMENT = "risk_assessment",
  SYSTEM_REGISTRATION = "system_registration", 
  DOCUMENT = "document",
  TRAINING = "training"
}

export enum NotificationFrequency {
  IMMEDIATELY = "immediately",
  DAILY = "daily",
  WEEKLY = "weekly"
}

export enum Language {
  ENGLISH = "en",
  VIETNAMESE = "vi",
  GERMAN = "de"
}

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Add password field for backend auth
  displayName: text("display_name"),
  role: text("role").default("user"),
  department: text("department"),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiSystems = pgTable("ai_systems", {
  id: serial("id").primaryKey(),
  systemId: text("system_id").notNull().unique(),
  name: text("name").notNull(),
  vendor: text("vendor"),
  department: text("department").notNull(),
  riskLevel: text("risk_level").notNull(),
  riskScore: integer("risk_score"),
  implementationDate: timestamp("implementation_date"),
  lastAssessmentDate: timestamp("last_assessment_date"),
  docCompleteness: integer("doc_completeness").default(0),
  trainingCompleteness: integer("training_completeness").default(0),
  description: text("description"),
  status: text("status").default("active"),
  purpose: text("purpose"), // Primary purpose of the AI system
  version: text("version"), // System version
  aiCapabilities: text("ai_capabilities"), // Description of AI capabilities
  trainingDatasets: text("training_datasets"), // Description of training data
  usageContext: text("usage_context"), // Context in which the system is used
  potentialImpact: text("potential_impact"), // Potential impact on users/society
  keywords: jsonb("keywords").default([]), // Keywords for classification
  expectedLifetime: text("expected_lifetime"), // Expected operational lifetime
  maintenanceSchedule: text("maintenance_schedule"), // Maintenance schedule
  deploymentScope: text("deployment_scope"), // Scope of deployment
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: text("created_by").references(() => users.uid),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  complianceScore: integer("compliance_score").default(0),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  userId: text("user_id").references(() => users.uid),
  systemId: text("system_id").references(() => aiSystems.systemId),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(), 
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  systemId: text("system_id").references(() => aiSystems.systemId),
  createdAt: timestamp("created_at").defaultNow(),
  isResolved: boolean("is_resolved").default(false),
});

export const deadlines = pgTable("deadlines", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  type: text("type"),
  relatedSystemId: text("related_system_id").references(() => aiSystems.systemId),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  systemId: text("system_id").references(() => aiSystems.systemId),
  content: text("content"),
  version: text("version"),
  status: text("status").default("draft"),
  createdBy: text("created_by").references(() => users.uid),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  assessmentId: text("assessment_id").notNull().unique(),
  systemId: text("system_id").references(() => aiSystems.systemId).notNull(),
  assessmentDate: timestamp("assessment_date").defaultNow(),
  status: text("status").default("completed").notNull(),
  riskLevel: text("risk_level").notNull(),
  riskScore: integer("risk_score"),
  systemCategory: text("system_category"),
  prohibitedUseChecks: jsonb("prohibited_use_checks"),
  euAiActArticles: jsonb("eu_ai_act_articles"),
  complianceGaps: jsonb("compliance_gaps"),
  remediationActions: jsonb("remediation_actions"),
  evidenceDocuments: jsonb("evidence_documents"),
  summaryNotes: text("summary_notes"),
  createdBy: text("created_by").references(() => users.uid),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingModules = pgTable("training_modules", {
  id: serial("id").primaryKey(),
  module_id: text("module_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  estimated_time: text("estimated_time").notNull(),
  topics: jsonb("topics").notNull(),
  role_relevance: jsonb("role_relevance").notNull(),
  content: jsonb("content").notNull(), // Content will include sections and assessments
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trainingProgress = pgTable("training_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.uid).notNull(),
  moduleId: text("module_id").references(() => trainingModules.module_id).notNull(),
  completion: integer("completion").default(0),
  assessmentScore: integer("assessment_score"),
  lastAttemptDate: timestamp("last_attempt_date"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Approval workflow tables
export const approvalItems = pgTable("approval_items", {
  id: serial("id").primaryKey(),
  workflowId: text("workflow_id").notNull().unique(), // Unique identifier for the approval workflow
  moduleType: text("module_type").notNull(), // risk_assessment, system_registration, document, training
  moduleId: text("module_id").notNull(), // ID of the item being approved (assessmentId, systemId, etc.)
  name: text("name").notNull(), // Name of the item
  description: text("description"),
  submittedBy: text("submitted_by").references(() => users.uid),
  submitterName: text("submitter_name"), // Display name of submitter
  department: text("department"),
  submittedDate: timestamp("submitted_date").defaultNow(),
  dueDate: timestamp("due_date"),
  status: text("status").default("pending").notNull(), // pending, in_review, approved, rejected, cancelled
  priority: text("priority").default("medium").notNull(), // high, medium, low
  details: jsonb("details"), // JSON object with additional details specific to the module type
  language: text("language").default("en").notNull(), // en, vi, de
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const approvalAssignments = pgTable("approval_assignments", {
  id: serial("id").primaryKey(),
  workflowId: text("workflow_id").references(() => approvalItems.workflowId).notNull(),
  assignedTo: text("assigned_to").references(() => users.uid).notNull(),
  assignedBy: text("assigned_by").references(() => users.uid),
  assignedDate: timestamp("assigned_date").defaultNow(),
  dueDate: timestamp("due_date"),
  isAutoAssigned: boolean("is_auto_assigned").default(false),
  status: text("status").default("pending").notNull(), // pending, in_progress, completed
  priority: text("priority").default("medium").notNull(), // high, medium, low
  comments: text("comments"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const approvalHistory = pgTable("approval_history", {
  id: serial("id").primaryKey(),
  workflowId: text("workflow_id").references(() => approvalItems.workflowId).notNull(),
  actionType: text("action_type").notNull(), // submitted, assigned, reviewed, approved, rejected, reassigned, cancelled
  actionBy: text("action_by").references(() => users.uid),
  actionByName: text("action_by_name"), // Display name of the person who performed the action
  actionDate: timestamp("action_date").defaultNow(),
  details: jsonb("details"), // JSON object with additional details about the action
  comments: text("comments"),
  previousStatus: text("previous_status"),
  newStatus: text("new_status"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const approvalNotifications = pgTable("approval_notifications", {
  id: serial("id").primaryKey(),
  workflowId: text("workflow_id").references(() => approvalItems.workflowId).notNull(),
  userId: text("user_id").references(() => users.uid).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  priority: text("priority").default("medium").notNull(), // high, medium, low
  type: text("type").notNull(), // assignment, update, reminder, deadline
  relatedAction: text("related_action"), // Reference to an action in the approval history
  language: text("language").default("en").notNull(), // en, vi, de
});

// Expert Legal Reviews
export const expertReviews = pgTable("expert_reviews", {
  id: serial("id").primaryKey(),
  reviewId: text("review_id").notNull().unique(),
  assessmentId: text("assessment_id").references(() => riskAssessments.assessmentId),
  systemId: text("system_id").references(() => aiSystems.systemId),
  text: text("text").notNull(), // The content to be reviewed
  type: text("type").notNull(), // Assessment, System, Document, etc.
  status: text("status").default("pending").notNull(), // pending, in_progress, completed
  validationResult: jsonb("validation_result"), // Result from automated validation
  requestedAt: timestamp("requested_at").defaultNow(),
  requestedBy: text("requested_by").references(() => users.uid),
  assignedTo: text("assigned_to").references(() => users.uid),
  assignedAt: timestamp("assigned_at"),
  completedAt: timestamp("completed_at"),
  expertFeedback: text("expert_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const approvalSettings = pgTable("approval_settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.uid).notNull(),
  autoAssignEnabled: boolean("auto_assign_enabled").default(true),
  defaultAssignees: jsonb("default_assignees").default([]), // Array of user IDs for auto-assignment
  notificationFrequency: text("notification_frequency").default("immediately").notNull(), // immediately, daily, weekly
  emailNotificationsEnabled: boolean("email_notifications_enabled").default(true),
  language: text("language").default("en").notNull(), // en, vi, de
  departmentRules: jsonb("department_rules").default([]), // Rules for department-based routing
  moduleTypeRules: jsonb("module_type_rules").default([]), // Rules for module-type-based routing
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAiSystemSchema = createInsertSchema(aiSystems).omit({ id: true });
export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });
export const insertDeadlineSchema = createInsertSchema(deadlines).omit({ id: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true });
export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({ id: true });
export const insertTrainingModuleSchema = createInsertSchema(trainingModules).omit({ id: true });
export const insertTrainingProgressSchema = createInsertSchema(trainingProgress).omit({ id: true });
export const insertExpertReviewSchema = createInsertSchema(expertReviews).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AiSystem = typeof aiSystems.$inferSelect;
export type InsertAiSystem = z.infer<typeof insertAiSystemSchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Deadline = typeof deadlines.$inferSelect;
export type InsertDeadline = z.infer<typeof insertDeadlineSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;

export type TrainingModule = typeof trainingModules.$inferSelect;
export type InsertTrainingModule = z.infer<typeof insertTrainingModuleSchema>;

export type TrainingProgress = typeof trainingProgress.$inferSelect;
export type InsertTrainingProgress = z.infer<typeof insertTrainingProgressSchema>;

export type ExpertReview = typeof expertReviews.$inferSelect;
export type InsertExpertReview = z.infer<typeof insertExpertReviewSchema>;

// Specialized schemas for the API
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
});

// Expert review schemas for APIs
export const createExpertReviewSchema = z.object({
  assessmentId: z.string().optional(),
  systemId: z.string().optional(),
  text: z.string().min(1, "Review text is required"),
  type: z.string(),
  validationResult: z.any().optional(),
});

export const updateExpertReviewSchema = z.object({
  reviewId: z.string(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  assignedTo: z.string().optional(),
  expertFeedback: z.string().optional(),
});

// Development mode tables
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  enabled: boolean("enabled").default(false),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Insert schemas for development mode
export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({ id: true });
export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({ id: true });

// Types for development mode
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
