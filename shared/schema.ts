import { relations } from "drizzle-orm";
import { text, integer, timestamp, pgTable, serial, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'operator', 'developer', 'decision_maker']);

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
}));

// AI System table
export const aiSystems = pgTable('ai_systems', {
  id: serial('id').primaryKey(),
  systemId: text('system_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  vendor: text('vendor'),
  department: text('department'),
  purpose: text('purpose'),
  version: text('version'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: text('created_by').references(() => users.uid),
});

export const aiSystemsRelations = relations(aiSystems, ({ many, one }) => ({
  assessments: many(riskAssessments),
  creator: one(users, {
    fields: [aiSystems.createdBy],
    references: [users.uid],
  }),
}));

// Risk Assessment table
export const riskAssessments = pgTable('risk_assessments', {
  id: serial('id').primaryKey(),
  assessmentId: text('assessment_id').notNull().unique(),
  systemId: text('system_id').references(() => aiSystems.systemId),
  createdBy: text('created_by').references(() => users.uid),
  createdAt: timestamp('created_at').defaultNow(),
  status: text('status').default('draft'),
  riskLevel: text('risk_level').notNull(),
  riskScore: integer('risk_score').notNull(),
  euAiActArticles: jsonb('eu_ai_act_articles'),
  complianceGaps: jsonb('compliance_gaps'),
  summaryNotes: text('summary_notes'),
});

export const riskAssessmentsRelations = relations(riskAssessments, ({ one }) => ({
  system: one(aiSystems, {
    fields: [riskAssessments.systemId],
    references: [aiSystems.systemId],
  }),
  creator: one(users, {
    fields: [riskAssessments.createdBy],
    references: [users.uid],
  }),
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