import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  moduleId: text("module_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  topics: jsonb("topics").notNull(),
  roleRelevance: jsonb("role_relevance").notNull(),
  content: jsonb("content").notNull(), // Content will include sections and assessments
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trainingProgress = pgTable("training_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.uid).notNull(),
  moduleId: text("module_id").references(() => trainingModules.moduleId).notNull(),
  completion: integer("completion").default(0),
  assessmentScore: integer("assessment_score"),
  lastAttemptDate: timestamp("last_attempt_date"),
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
