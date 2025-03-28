import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../schema";
import { riskAssessments } from "../schema";
import { aiSystems } from "../schema";

// Document files table for uploaded files
export const documentFiles = pgTable("document_files", {
  id: serial("id").primaryKey(),
  // UUID for the document provided by the client
  documentId: text("document_id").notNull().unique(),
  // Original file name
  name: text("name").notNull(),
  // File name after saving to disk
  fileName: text("file_name").notNull(),
  // Path to the file on disk
  path: text("path").notNull(),
  // URL to access the file
  url: text("url").notNull(),
  // MIME type
  type: text("type").notNull(),
  // File size in bytes
  size: integer("size").notNull(),
  // Category (e.g., "technical", "risk", "dataflow")
  category: text("category").default("general"),
  // Assessment ID if associated with a risk assessment
  assessmentId: text("assessment_id").references(() => riskAssessments.assessmentId),
  // System ID if associated with an AI system
  systemId: text("system_id").references(() => aiSystems.systemId),
  // User who uploaded the file
  uploadedBy: text("uploaded_by").references(() => users.uid),
  // Upload timestamp
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  // Description of the document
  description: text("description"),
});

// Insert schema for document files
export const insertDocumentFileSchema = createInsertSchema(documentFiles).omit({ 
  id: true, 
  uploadedAt: true 
});

// Type definitions
export type DocumentFile = typeof documentFiles.$inferSelect;
export type InsertDocumentFile = z.infer<typeof insertDocumentFileSchema>;

// API schema for uploading documents
export const uploadDocumentSchema = z.object({
  files: z.array(z.any()).min(1, "At least one file is required"),
  assessmentId: z.string().optional(),
  systemId: z.string().optional(),
  category: z.string().default("general"),
});

// API schema for retrieving documents
export const getDocumentsSchema = z.object({
  assessmentId: z.string().optional(),
  systemId: z.string().optional(),
  category: z.string().optional(),
});

// API schema for deleting a document
export const deleteDocumentSchema = z.object({
  documentId: z.string().nonempty("Document ID is required"),
});