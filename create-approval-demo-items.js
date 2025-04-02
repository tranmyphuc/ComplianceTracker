/**
 * Script to create demo approval items for testing the approval workflow functionality
 */
import 'dotenv/config';
import { db } from './server/db.js';
import { approvalItems, approvalAssignments, approvalHistory } from './shared/schema.js';

/**
 * Demo approval items to populate the system with
 */
const demoApprovalItems = [
  {
    title: 'Customer Sentiment Analysis AI Registration',
    description: 'New AI system for analyzing customer sentiment in service interactions',
    moduleType: 'system_registration',
    moduleId: 'sys-demo-001',
    status: 'pending',
    priority: 'high',
    createdBy: 'developer@example.com',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
  {
    title: 'Fraud Detection System Risk Assessment',
    description: 'Risk assessment for fraud detection AI system used in financial transactions',
    moduleType: 'risk_assessment',
    moduleId: 'risk-assess-001',
    status: 'pending',
    priority: 'high',
    createdBy: 'operator@example.com',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: 'HR Resume Screening System Registration',
    description: 'Registration of new AI system for initial candidate resume screening',
    moduleType: 'system_registration',
    moduleId: 'sys-demo-002',
    status: 'in_review',
    priority: 'medium',
    createdBy: 'user@example.com',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    title: 'Product Recommendation Engine Risk Assessment',
    description: 'Risk assessment for AI recommendation system for e-commerce platform',
    moduleType: 'risk_assessment',
    moduleId: 'risk-assess-002',
    status: 'approved',
    priority: 'medium',
    createdBy: 'developer@example.com',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (already completed)
    completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Completed 3 days ago
  },
  {
    title: 'Document Compliance Verification Tool',
    description: 'New tool to automatically verify document compliance with EU AI Act',
    moduleType: 'document',
    moduleId: 'doc-001',
    status: 'rejected',
    priority: 'low',
    createdBy: 'user@example.com',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // Completed 6 days ago
  }
];

/**
 * Demo approval assignments
 */
const createDemoAssignments = (approvalItemIds) => [
  {
    itemId: approvalItemIds[0], // Customer Sentiment Analysis
    assignedTo: 'approver@example.com',
    assignedBy: 'admin@example.com',
    status: 'pending',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    notes: 'Please review with high priority'
  },
  {
    itemId: approvalItemIds[1], // Fraud Detection
    assignedTo: 'admin@example.com',
    assignedBy: 'approver@example.com',
    status: 'pending',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    notes: 'Needs thorough review of risk levels'
  },
  {
    itemId: approvalItemIds[2], // HR Resume Screening
    assignedTo: 'approver@example.com',
    assignedBy: 'admin@example.com',
    status: 'in_progress',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    notes: 'Check bias mitigation measures'
  },
  {
    itemId: approvalItemIds[3], // Product Recommendation
    assignedTo: 'approver@example.com',
    assignedBy: 'admin@example.com',
    status: 'completed',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Completed 3 days ago
    notes: 'Approved with standard requirements'
  },
  {
    itemId: approvalItemIds[4], // Document Compliance Tool
    assignedTo: 'admin@example.com',
    assignedBy: 'approver@example.com',
    status: 'completed',
    deadline: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // Completed 6 days ago
    notes: 'Needs significant rework on compliance verification'
  }
];

/**
 * Demo approval history events
 */
const createDemoHistory = (approvalItemIds) => [
  {
    itemId: approvalItemIds[0], // Customer Sentiment Analysis
    action: 'created',
    status: 'pending',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    performedBy: 'developer@example.com',
    notes: 'Initial submission'
  },
  {
    itemId: approvalItemIds[0], 
    action: 'assigned',
    status: 'pending',
    timestamp: new Date(Date.now() - 0.9 * 24 * 60 * 60 * 1000), // 0.9 days ago
    performedBy: 'admin@example.com',
    notes: 'Assigned to compliance team'
  },
  {
    itemId: approvalItemIds[1], // Fraud Detection
    action: 'created',
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    performedBy: 'operator@example.com',
    notes: 'Initial submission'
  },
  {
    itemId: approvalItemIds[1],
    action: 'assigned',
    status: 'pending',
    timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000), // 1.8 days ago
    performedBy: 'approver@example.com',
    notes: 'Assigned to admin'
  },
  {
    itemId: approvalItemIds[2], // HR Resume Screening
    action: 'created',
    status: 'pending',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    performedBy: 'user@example.com',
    notes: 'Initial submission'
  },
  {
    itemId: approvalItemIds[2],
    action: 'status_changed',
    status: 'in_review',
    timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000), // 2.5 days ago
    performedBy: 'admin@example.com',
    notes: 'Started review process'
  },
  {
    itemId: approvalItemIds[3], // Product Recommendation
    action: 'created',
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    performedBy: 'developer@example.com',
    notes: 'Initial submission'
  },
  {
    itemId: approvalItemIds[3],
    action: 'status_changed',
    status: 'approved',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    performedBy: 'approver@example.com',
    notes: 'Approved after review'
  },
  {
    itemId: approvalItemIds[4], // Document Compliance Tool
    action: 'created',
    status: 'pending',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    performedBy: 'user@example.com',
    notes: 'Initial submission'
  },
  {
    itemId: approvalItemIds[4],
    action: 'status_changed',
    status: 'rejected',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    performedBy: 'admin@example.com',
    notes: 'Rejected due to incomplete compliance detection capabilities'
  }
];

/**
 * Create all demo approval data
 */
async function createApprovalDemoData() {
  try {
    console.log('Starting to create demo approval items...');
    
    // First check if demo data already exists
    const existingItems = await db.select({ count: db.fn.count() }).from(approvalItems);
    if (existingItems[0].count > 0) {
      console.log(`Found ${existingItems[0].count} existing approval items. Skipping demo data creation.`);
      console.log('If you want to recreate demo data, please clear the existing data first.');
      process.exit(0);
    }
    
    // Create approval items
    const insertedItemsResult = await db.insert(approvalItems).values(demoApprovalItems).returning();
    const insertedItemIds = insertedItemsResult.map(item => item.id);
    
    console.log(`Created ${insertedItemIds.length} demo approval items`);
    
    // Create assignments using the real IDs of inserted items
    const demoAssignments = createDemoAssignments(insertedItemIds);
    await db.insert(approvalAssignments).values(demoAssignments);
    
    console.log(`Created ${demoAssignments.length} demo approval assignments`);
    
    // Create history entries using the real IDs of inserted items
    const demoHistory = createDemoHistory(insertedItemIds);
    await db.insert(approvalHistory).values(demoHistory);
    
    console.log(`Created ${demoHistory.length} demo approval history entries`);
    
    console.log('Demo approval data creation completed successfully!');
    console.log('You can now test the approval workflow with these demo items.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo approval data:', error);
    process.exit(1);
  }
}

// Run the function
createApprovalDemoData();