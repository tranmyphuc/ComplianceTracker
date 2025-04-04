import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users, aiSystems, riskAssessments } from "../schema";

// Feedback status enum as a regular type since we don't need a DB enum
export type FeedbackStatus = 'pending' | 'under_review' | 'implemented' | 'rejected' | 'planned';

// Feedback category enum as a regular type
export type FeedbackCategory = 'ui_ux' | 'compliance_gap' | 'feature_request' | 'error_report' | 'documentation' | 'other';

// Feedback priority enum as a regular type
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

// User feedback table for the integrated feedback system
export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  // UUID for the feedback item
  feedbackId: text("feedback_id").notNull().unique(),
  // Feedback title/summary
  title: text("title").notNull(),
  // Detailed feedback description
  description: text("description").notNull(),
  // User who submitted the feedback
  submittedBy: text("submitted_by").references(() => users.uid),
  // Submission timestamp
  submittedAt: timestamp("submitted_at").defaultNow(),
  // Current status of the feedback
  status: text("status").default('pending'),
  // Category of feedback
  category: text("category").default('other'),
  // Priority level
  priority: text("priority").default('medium'),
  // Context information (page URL, feature being used, etc.)
  context: text("context"),
  // Screenshots or attachments IDs (linked to document_files)
  attachments: jsonb("attachments"),
  // Associated AI system if applicable
  systemId: text("system_id").references(() => aiSystems.systemId),
  // Associated assessment if applicable
  assessmentId: text("assessment_id").references(() => riskAssessments.assessmentId),
  // User votes/upvotes count
  votes: integer("votes").default(0),
  // Staff/admin response
  response: text("response"),
  // Response timestamp
  respondedAt: timestamp("responded_at"),
  // Responded by (staff/admin user)
  respondedBy: text("responded_by").references(() => users.uid),
  // Implementation details or notes
  implementationNotes: text("implementation_notes"),
  // Expected implementation date if planned
  plannedImplementation: timestamp("planned_implementation"),
  // Feedback tags
  tags: jsonb("tags"),
  // Is the feedback public/visible to all users
  isPublic: boolean("is_public").default(true),
  // Has the submitter been notified of status changes
  notificationSent: boolean("notification_sent").default(false),
});

// Define relationships for user feedback
export const userFeedbackRelations = relations(userFeedback, ({ one }) => ({
  // Relation to the user who submitted the feedback
  submitter: one(users, {
    fields: [userFeedback.submittedBy],
    references: [users.uid],
    relationName: 'user_submitted_feedback'
  }),
  // Relation to the system that the feedback is about
  system: one(aiSystems, {
    fields: [userFeedback.systemId],
    references: [aiSystems.systemId],
    relationName: 'system_feedback'
  }),
  // Relation to the assessment that the feedback is about
  assessment: one(riskAssessments, {
    fields: [userFeedback.assessmentId],
    references: [riskAssessments.assessmentId],
    relationName: 'assessment_feedback'
  }),
  // Relation to the admin who responded to the feedback
  responder: one(users, {
    fields: [userFeedback.respondedBy],
    references: [users.uid],
    relationName: 'user_responded_feedback'
  })
}));

// Suggestion votes table to track which users voted for which suggestions
export const feedbackVotes = pgTable("feedback_votes", {
  id: serial("id").primaryKey(),
  // The feedback that was voted on
  feedbackId: text("feedback_id").references(() => userFeedback.feedbackId),
  // User who cast the vote
  userId: text("user_id").references(() => users.uid),
  // Vote timestamp
  votedAt: timestamp("voted_at").defaultNow(),
  // Is this an upvote (true) or downvote (false)
  isUpvote: boolean("is_upvote").default(true),
});

// Define relationships for feedback votes
export const feedbackVotesRelations = relations(feedbackVotes, ({ one }) => ({
  // Relation to the user who cast the vote
  user: one(users, {
    fields: [feedbackVotes.userId],
    references: [users.uid],
    relationName: 'user_feedback_votes'
  }),
  // Relation to the feedback item that was voted on
  feedback: one(userFeedback, {
    fields: [feedbackVotes.feedbackId],
    references: [userFeedback.feedbackId]
  })
}));

// Insert schema for user feedback
export const insertUserFeedbackSchema = createInsertSchema(userFeedback).omit({ 
  id: true, 
  submittedAt: true,
  votes: true,
  respondedAt: true,
  notificationSent: true
});

// Insert schema for feedback votes
export const insertFeedbackVoteSchema = createInsertSchema(feedbackVotes).omit({ 
  id: true, 
  votedAt: true
});

// Type definitions
export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;
export type FeedbackVote = typeof feedbackVotes.$inferSelect;
export type InsertFeedbackVote = z.infer<typeof insertFeedbackVoteSchema>;

// API schema for submitting feedback
export const submitFeedbackSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  category: z.string().default('other'),
  priority: z.string().default('medium'),
  context: z.string().optional(),
  systemId: z.string().optional(),
  assessmentId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
});

// API schema for voting on feedback
export const voteFeedbackSchema = z.object({
  feedbackId: z.string().nonempty("Feedback ID is required"),
  isUpvote: z.boolean().default(true),
});

// API schema for updating feedback status (admin)
export const updateFeedbackStatusSchema = z.object({
  feedbackId: z.string().nonempty("Feedback ID is required"),
  status: z.string().nonempty("Status is required"),
  response: z.string().optional(),
  implementationNotes: z.string().optional(),
  plannedImplementation: z.date().optional(),
  priority: z.string().optional(),
  isPublic: z.boolean().optional(),
});