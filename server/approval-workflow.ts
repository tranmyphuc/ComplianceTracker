import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { storage } from "./storage";
import { AppError, ErrorType } from "./error-handling";
import { 
  ApprovalStatus, 
  ApprovalPriority, 
  ModuleType, 
  NotificationFrequency,
  approvalItems,
  approvalAssignments,
  approvalHistory,
  approvalNotifications,
  approvalSettings
} from "@shared/schema";

// Define Language enum since it's not in the schema
export enum Language {
  ENGLISH = 'en',
  FRENCH = 'fr',
  GERMAN = 'de',
  SPANISH = 'es',
  ITALIAN = 'it',
  PORTUGUESE = 'pt',
  DUTCH = 'nl',
  SWEDISH = 'sv',
  DANISH = 'da',
  FINNISH = 'fi',
  NORWEGIAN = 'no',
  POLISH = 'pl',
  CZECH = 'cs',
  SLOVAK = 'sk',
  HUNGARIAN = 'hu',
  ROMANIAN = 'ro',
  BULGARIAN = 'bg',
  GREEK = 'el',
  TURKISH = 'tr',
  RUSSIAN = 'ru',
  UKRAINIAN = 'uk',
  ARABIC = 'ar',
  HEBREW = 'he',
  HINDI = 'hi',
  CHINESE = 'zh',
  JAPANESE = 'ja',
  KOREAN = 'ko',
}
import { eq, and, desc, asc, isNull, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create schemas for insert operations
export const insertApprovalItemSchema = createInsertSchema(approvalItems).omit({ id: true });
export const insertApprovalAssignmentSchema = createInsertSchema(approvalAssignments).omit({ id: true });
export const insertApprovalHistorySchema = createInsertSchema(approvalHistory).omit({ id: true });
export const insertApprovalNotificationSchema = createInsertSchema(approvalNotifications).omit({ id: true });
export const insertApprovalSettingsSchema = createInsertSchema(approvalSettings).omit({ id: true });

// Types
export type ApprovalItem = typeof approvalItems.$inferSelect;
export type InsertApprovalItem = z.infer<typeof insertApprovalItemSchema>;
export type ApprovalAssignment = typeof approvalAssignments.$inferSelect;
export type InsertApprovalAssignment = z.infer<typeof insertApprovalAssignmentSchema>;
export type ApprovalHistory = typeof approvalHistory.$inferSelect;
export type InsertApprovalHistory = z.infer<typeof insertApprovalHistorySchema>;
export type ApprovalNotification = typeof approvalNotifications.$inferSelect;
export type InsertApprovalNotification = z.infer<typeof insertApprovalNotificationSchema>;
export type ApprovalSettings = typeof approvalSettings.$inferSelect;
export type InsertApprovalSettings = z.infer<typeof insertApprovalSettingsSchema>;

// Zod schemas for API requests
export const createApprovalRequestSchema = z.object({
  moduleType: z.nativeEnum(ModuleType),
  moduleId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(), // ISO string
  priority: z.nativeEnum(ApprovalPriority).default(ApprovalPriority.MEDIUM),
  details: z.record(z.any()).optional(),
  language: z.nativeEnum(Language).default(Language.ENGLISH),
});

export const updateApprovalStatusRequestSchema = z.object({
  status: z.nativeEnum(ApprovalStatus),
  comments: z.string().optional(),
});

export const assignApprovalRequestSchema = z.object({
  assignedTo: z.string(),
  dueDate: z.string().optional(), // ISO string
  priority: z.nativeEnum(ApprovalPriority).optional(),
  comments: z.string().optional(),
});

export const approvalSettingsRequestSchema = z.object({
  autoAssignEnabled: z.boolean().optional(),
  defaultAssignees: z.array(z.string()).optional(),
  notificationFrequency: z.nativeEnum(NotificationFrequency).optional(),
  emailNotificationsEnabled: z.boolean().optional(),
  language: z.nativeEnum(Language).optional(),
  departmentRules: z.array(z.record(z.any())).optional(),
  moduleTypeRules: z.array(z.record(z.any())).optional(),
});

// Helper functions
/**
 * Get appropriate assignees based on module type and settings
 */
async function getAppropriateAssignees(
  moduleType: ModuleType, 
  department?: string
): Promise<string[]> {
  try {
    // Get global approval settings
    const adminSettings = await db.query.approvalSettings.findMany({
      where: eq(approvalSettings.userId, sql`(SELECT uid FROM users WHERE role = 'admin' LIMIT 1)`)
    });

    if (adminSettings.length > 0 && adminSettings[0].defaultAssignees) {
      // Use admin-defined default assignees
      const defaultAssignees = adminSettings[0].defaultAssignees as string[];
      if (defaultAssignees.length > 0) {
        return defaultAssignees;
      }
    }

    // No admin settings or no default assignees, find users with appropriate roles
    let roleToAssign = 'compliance_officer';
    
    // Determine appropriate role based on module type
    if (moduleType === ModuleType.RISK_ASSESSMENT) {
      roleToAssign = 'compliance_officer';
    } else if (moduleType === ModuleType.SYSTEM_REGISTRATION) {
      roleToAssign = 'admin';
    } else if (moduleType === ModuleType.DOCUMENT) {
      roleToAssign = 'legal';
    } else if (moduleType === ModuleType.TRAINING) {
      roleToAssign = 'admin';
    }

    // Get users with the appropriate role
    const users = await db.query.users.findMany({
      where: eq(sql`LOWER(role)`, roleToAssign.toLowerCase()),
      limit: 2
    });

    // If no users found with the appropriate role, fallback to admins
    if (users.length === 0) {
      const admins = await db.query.users.findMany({
        where: eq(sql`LOWER(role)`, 'admin'),
        limit: 2
      });
      return admins.map(admin => admin.uid);
    }

    return users.map(user => user.uid);
  } catch (error) {
    console.error("Error getting appropriate assignees:", error);
    // Fallback to empty list - will need manual assignment
    return [];
  }
}

/**
 * Auto-assign the approval workflow based on settings and rules
 */
async function autoAssignApproval(
  workflowId: string, 
  moduleType: ModuleType,
  department?: string
): Promise<boolean> {
  try {
    // Check if auto-assignment is enabled in settings
    const settings = await db.query.approvalSettings.findMany({
      where: eq(approvalSettings.userId, sql`(SELECT uid FROM users WHERE role = 'admin' LIMIT 1)`)
    });

    const autoAssignEnabled = settings.length === 0 || settings[0].autoAssignEnabled;
    
    if (!autoAssignEnabled) {
      console.log("Auto-assignment is disabled");
      return false;
    }

    // Get appropriate assignees
    const assignees = await getAppropriateAssignees(moduleType, department);
    
    if (assignees.length === 0) {
      console.log("No appropriate assignees found");
      return false;
    }

    // Create assignment for the first assignee
    const newAssignment: InsertApprovalAssignment = {
      workflowId,
      assignedTo: assignees[0],
      isAutoAssigned: true,
      status: 'pending',
      priority: 'medium',
    };

    await db.insert(approvalAssignments).values(newAssignment);
    
    // Create history entry
    await db.insert(approvalHistory).values({
      historyId: `HIST-${uuidv4().substring(0, 8)}`, // Generate unique history ID
      workflowId,
      actionType: 'assigned',
      actionBy: null, // System-generated
      actionByName: 'System',
      details: { autoAssigned: true, assignee: assignees[0] },
      previousStatus: 'pending',
      newStatus: 'in_review',
    });

    // Update approval item status
    await db.update(approvalItems)
      .set({ status: 'in_review', updatedAt: new Date() })
      .where(eq(approvalItems.workflowId, workflowId));

    // Create notification for the assignee
    await db.insert(approvalNotifications).values({
      workflowId,
      userId: assignees[0],
      title: 'New Approval Assignment',
      message: 'You have been assigned a new item for approval',
      type: 'assignment',
      priority: 'medium',
      language: 'en', // Default language
    });

    return true;
  } catch (error) {
    console.error("Error auto-assigning approval:", error);
    return false;
  }
}

/**
 * Send notifications based on approval workflow events
 */
async function sendNotifications(
  workflowId: string,
  eventType: 'submission' | 'assignment' | 'update' | 'reminder' | 'completion',
  affectedUsers: string[],
  details: any
): Promise<void> {
  try {
    // Create notification for each affected user
    for (const userId of affectedUsers) {
      let title = 'Approval Workflow Update';
      let message = 'There has been an update to an approval workflow.';
      let priority: ApprovalPriority = ApprovalPriority.MEDIUM;
      
      // Determine notification content based on event type
      switch (eventType) {
        case 'submission':
          title = 'New Approval Item Submitted';
          message = `A new ${details.moduleType} has been submitted for approval: ${details.name}`;
          break;
        case 'assignment':
          title = 'New Approval Assignment';
          message = `You have been assigned to review: ${details.name}`;
          priority = details.priority || ApprovalPriority.MEDIUM;
          break;
        case 'update':
          title = 'Approval Status Update';
          message = `The status of ${details.name} has been updated to ${details.status}`;
          break;
        case 'reminder':
          title = 'Approval Reminder';
          message = `Reminder: You have an approval task due for ${details.name}`;
          priority = ApprovalPriority.HIGH;
          break;
        case 'completion':
          title = 'Approval Process Completed';
          message = `The approval process for ${details.name} has been completed with status: ${details.status}`;
          break;
      }

      // Get user's preferred language
      const userSettings = await db.query.approvalSettings.findMany({
        where: eq(approvalSettings.userId, userId)
      });
      
      const language = userSettings.length > 0 ? userSettings[0].language : Language.ENGLISH;

      // Create notification
      await db.insert(approvalNotifications).values({
        workflowId,
        userId,
        title,
        message,
        type: eventType === 'reminder' ? 'reminder' : eventType === 'assignment' ? 'assignment' : 'update',
        priority,
        language: language as Language,
      });
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

/**
 * Schedule reminders for approaching deadlines
 */
export async function scheduleReminders(): Promise<void> {
  try {
    // Get assignments with due dates approaching in next 48 hours
    const oneDayFromNow = new Date();
    oneDayFromNow.setHours(oneDayFromNow.getHours() + 24);
    
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setHours(twoDaysFromNow.getHours() + 48);
    
    const approachingAssignments = await db.query.approvalAssignments.findMany({
      where: and(
        sql`dueDate IS NOT NULL`,
        sql`dueDate <= ${twoDaysFromNow.toISOString()}`,
        sql`dueDate > NOW()`,
        eq(approvalAssignments.status, 'pending')
      ),
      with: {
        item: true
      }
    });
    
    // Send reminder notifications for each approaching assignment
    for (const assignment of approachingAssignments) {
      await sendNotifications(
        assignment.workflowId,
        'reminder',
        [assignment.assignedTo],
        {
          name: assignment.item?.name || 'Unknown Item',
          dueDate: assignment.dueDate,
          priority: ApprovalPriority.HIGH
        }
      );
    }
  } catch (error) {
    console.error("Error scheduling reminders:", error);
  }
}

// API Endpoints
/**
 * Create a new approval workflow item
 */
export const createApprovalWorkflow = async (req: Request, res: Response) => {
  try {
    // For development mode, use default values if user is not available
    const isDevelopmentMode = process.env.NODE_ENV === 'development';
    const userId = req.user?.uid || (isDevelopmentMode ? 'demo-user-id' : undefined);
    const userName = req.user?.displayName || req.user?.username || 'Demo User';
    
    if (!userId && !isDevelopmentMode) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    // Validate request data
    const validatedData = createApprovalRequestSchema.parse(req.body);
    
    // Generate a unique workflow ID
    const workflowId = `WF-${validatedData.moduleType.substring(0, 3)}-${uuidv4().substring(0, 8)}`;
    
    // For development mode, ensure we don't cause foreign key issues
    const isDev = process.env.NODE_ENV === 'development';
        
    // Create the approval item - in dev mode, we null the submittedBy to avoid foreign key constraints
    const newApprovalItem: InsertApprovalItem = {
      workflowId,
      moduleType: validatedData.moduleType,
      moduleId: validatedData.moduleId,
      name: validatedData.name,
      description: validatedData.description || '',
      submittedBy: isDev ? null : userId, // In development mode, set to null to avoid FK constraint
      submitterName: userName,
      department: req.user?.department || 'Unknown Department',
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      status: ApprovalStatus.PENDING,
      priority: validatedData.priority,
      details: validatedData.details || {},
      language: validatedData.language,
    };
    
    // Insert the approval item
    const [createdItem] = await db.insert(approvalItems).values(newApprovalItem).returning();
    
    // Create approval history entry for submission
    await db.insert(approvalHistory).values({
      historyId: `HIST-${uuidv4().substring(0, 8)}`, // Generate unique history ID
      workflowId,
      actionType: 'submitted',
      actionBy: isDev ? null : userId, // In development mode, set to null to avoid FK constraint
      actionByName: userName,
      details: { moduleType: validatedData.moduleType, moduleId: validatedData.moduleId },
      newStatus: ApprovalStatus.PENDING,
    });
    
    // Check for auto-assignment based on settings
    const isAutoAssigned = await autoAssignApproval(
      workflowId, 
      validatedData.moduleType as ModuleType,
      isDev ? 'Development Department' : req.user?.department // Use default department in dev mode
    );
    
    // Find admin users to notify about the new submission
    const adminUsers = await db.query.users.findMany({
      where: eq(sql`LOWER(role)`, 'admin')
    });
    
    // Send notifications
    await sendNotifications(
      workflowId,
      'submission',
      adminUsers.map(user => user.uid),
      {
        moduleType: validatedData.moduleType,
        name: validatedData.name,
        priority: validatedData.priority
      }
    );
    
    res.status(201).json({
      ...createdItem,
      isAutoAssigned
    });
  } catch (error) {
    console.error("Error creating approval workflow:", error);
    if (error instanceof z.ZodError) {
      throw new AppError(
        "Invalid approval data",
        ErrorType.VALIDATION,
        400,
        error.errors
      );
    }
    throw new AppError(
      "Failed to create approval workflow",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Get all approval workflow items with pagination and filtering
 */
export const getApprovalWorkflows = async (req: Request, res: Response) => {
  try {
    // Parse query params for pagination and filtering
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const moduleType = req.query.moduleType as string;
    const priority = req.query.priority as string;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    
    // Build query conditions
    let query = db.select().from(approvalItems);
    
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
      query = query.where(sql`name ILIKE ${`%${search}%`}`);
    }
    
    // Add sorting
    if (sortOrder === 'asc') {
      query = query.orderBy(asc(approvalItems[sortBy as keyof typeof approvalItems]));
    } else {
      query = query.orderBy(desc(approvalItems[sortBy as keyof typeof approvalItems]));
    }
    
    // Execute count query
    const countResult = await db.select({ count: sql<number>`COUNT(*)` }).from(approvalItems);
    const totalItems = countResult[0].count;
    
    // Execute paginated query
    query = query.limit(limit).offset(offset);
    const items = await query;
    
    res.json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    });
  } catch (error) {
    console.error("Error getting approval workflows:", error);
    throw new AppError(
      "Failed to get approval workflows",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Get a specific approval workflow by ID
 */
export const getApprovalWorkflowById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get the approval item
    const [item] = await db.select().from(approvalItems).where(eq(approvalItems.workflowId, id));
    
    if (!item) {
      throw new AppError(
        `Approval workflow with ID ${id} not found`,
        ErrorType.RESOURCE_NOT_FOUND,
        404
      );
    }
    
    // Get assignments
    const assignments = await db.select().from(approvalAssignments)
      .where(eq(approvalAssignments.workflowId, id))
      .orderBy(desc(approvalAssignments.createdAt));
    
    // Get history
    const history = await db.select().from(approvalHistory)
      .where(eq(approvalHistory.workflowId, id))
      .orderBy(desc(approvalHistory.actionDate));
    
    res.json({
      item,
      assignments,
      history
    });
  } catch (error) {
    console.error("Error getting approval workflow:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get approval workflow",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Update an approval workflow status
 */
export const updateApprovalStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isDevelopmentMode = process.env.NODE_ENV === "development";
    const userId = req.user?.uid || (isDevelopmentMode ? "demo-user-id" : undefined);
    const userName = req.user?.displayName || req.user?.username || 'Unknown User';
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    // Validate request data
    const validatedData = updateApprovalStatusRequestSchema.parse(req.body);
    
    // Check if the workflow exists
    const [item] = await db.select().from(approvalItems).where(eq(approvalItems.workflowId, id));
    
    if (!item) {
      throw new AppError(
        `Approval workflow with ID ${id} not found`,
        ErrorType.RESOURCE_NOT_FOUND,
        404
      );
    }
    
    // Check if the user is assigned to this workflow
    const [assignment] = await db.select().from(approvalAssignments)
      .where(
        and(
          eq(approvalAssignments.workflowId, id),
          eq(approvalAssignments.assignedTo, userId),
          eq(approvalAssignments.status, 'pending')
        )
      );
    
    // Only assigned users or admins can update status
    const userRole = req.user?.role?.toLowerCase();
    const isAdmin = userRole === 'admin' || userRole === 'compliance_officer';
    
    if (!assignment && !isAdmin) {
      throw new AppError(
        "You are not authorized to update this approval workflow",
        ErrorType.AUTHORIZATION,
        403
      );
    }
    
    // Update the approval status
    const [updatedItem] = await db.update(approvalItems)
      .set({ 
        status: validatedData.status,
        updatedAt: new Date()
      })
      .where(eq(approvalItems.workflowId, id))
      .returning();
    
    // Create approval history entry
    await db.insert(approvalHistory).values({
      historyId: `HIST-${uuidv4().substring(0, 8)}`, // Generate unique history ID
      workflowId: id,
      actionType: validatedData.status === ApprovalStatus.APPROVED ? 'approved' : 'rejected',
      actionBy: userId,
      actionByName: userName,
      comments: validatedData.comments,
      previousStatus: item.status,
      newStatus: validatedData.status,
    });
    
    // If there was an assignment, update it
    if (assignment) {
      await db.update(approvalAssignments)
        .set({ 
          status: 'completed',
          completedDate: new Date(),
          comments: validatedData.comments
        })
        .where(eq(approvalAssignments.id, assignment.id));
    }
    
    // Update the referenced module based on the approval status
    if (validatedData.status === ApprovalStatus.APPROVED) {
      await updateModuleStatus(item, 'approved');
    } else if (validatedData.status === ApprovalStatus.REJECTED) {
      await updateModuleStatus(item, 'rejected');
    }
    
    // Notify the submitter and any other assignees
    const submitter = item.submittedBy;
    const otherAssignees = await db.select()
      .from(approvalAssignments)
      .where(
        and(
          eq(approvalAssignments.workflowId, id),
          sql`assigned_to != ${userId}`
        )
      );
    
    const notifyUsers = [
      submitter,
      ...otherAssignees.map(a => a.assignedTo)
    ].filter(Boolean) as string[];
    
    // Send notifications
    await sendNotifications(
      id,
      'completion',
      notifyUsers,
      {
        name: item.name,
        status: validatedData.status,
        comments: validatedData.comments
      }
    );
    
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating approval status:", error);
    if (error instanceof z.ZodError) {
      throw new AppError(
        "Invalid status update data",
        ErrorType.VALIDATION,
        400,
        error.errors
      );
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update approval status",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Assign an approval workflow to a user
 */
export const assignApprovalWorkflow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;
    const userName = req.user?.displayName || req.user?.username || 'Unknown User';
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    // Check if user has permission to assign
    const userRole = req.user?.role?.toLowerCase();
    if (userRole !== 'admin' && userRole !== 'compliance_officer') {
      throw new AppError(
        "You don't have permission to assign approval workflows",
        ErrorType.AUTHORIZATION,
        403
      );
    }
    
    // Validate request data
    const validatedData = assignApprovalRequestSchema.parse(req.body);
    
    // Check if the workflow exists
    const [item] = await db.select().from(approvalItems).where(eq(approvalItems.workflowId, id));
    
    if (!item) {
      throw new AppError(
        `Approval workflow with ID ${id} not found`,
        ErrorType.RESOURCE_NOT_FOUND,
        404
      );
    }
    
    // Check if the assignee exists
    const [assignee] = await db.select().from(sql`users`).where(eq(sql`uid`, validatedData.assignedTo));
    
    if (!assignee) {
      throw new AppError(
        `User with ID ${validatedData.assignedTo} not found`,
        ErrorType.RESOURCE_NOT_FOUND,
        404
      );
    }
    
    // Create the assignment
    const [createdAssignment] = await db.insert(approvalAssignments).values({
      workflowId: id,
      assignedTo: validatedData.assignedTo,
      assignedBy: userId,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      priority: validatedData.priority || item.priority as ApprovalPriority,
      comments: validatedData.comments,
      status: 'pending',
      isAutoAssigned: false,
    }).returning();
    
    // Update approval item status to in_review if it's pending
    if (item.status === ApprovalStatus.PENDING) {
      await db.update(approvalItems)
        .set({ 
          status: ApprovalStatus.IN_REVIEW,
          updatedAt: new Date()
        })
        .where(eq(approvalItems.workflowId, id));
    }
    
    // Create approval history entry
    await db.insert(approvalHistory).values({
      historyId: `HIST-${uuidv4().substring(0, 8)}`, // Generate unique history ID
      workflowId: id,
      actionType: 'assigned',
      actionBy: userId,
      actionByName: userName,
      details: { 
        assignedTo: validatedData.assignedTo,
        dueDate: validatedData.dueDate
      },
      comments: validatedData.comments,
      previousStatus: item.status,
      newStatus: ApprovalStatus.IN_REVIEW,
    });
    
    // Send notification to the assignee
    await sendNotifications(
      id,
      'assignment',
      [validatedData.assignedTo],
      {
        name: item.name,
        priority: validatedData.priority || item.priority,
        dueDate: validatedData.dueDate
      }
    );
    
    res.json(createdAssignment);
  } catch (error) {
    console.error("Error assigning approval workflow:", error);
    if (error instanceof z.ZodError) {
      throw new AppError(
        "Invalid assignment data",
        ErrorType.VALIDATION,
        400,
        error.errors
      );
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to assign approval workflow",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Get user notifications with pagination
 */
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    // Parse query params for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const unreadOnly = req.query.unreadOnly === 'true';
    
    // Build query
    let query = db.select().from(approvalNotifications)
      .where(eq(approvalNotifications.userId, userId));
    
    if (unreadOnly) {
      query = query.where(eq(approvalNotifications.isRead, false));
    }
    
    // Execute count query
    const countResult = await db.select({ count: sql<number>`COUNT(*)` })
      .from(approvalNotifications)
      .where(eq(approvalNotifications.userId, userId))
      .where(unreadOnly ? eq(approvalNotifications.isRead, false) : sql`1=1`);
    
    const totalItems = countResult[0].count;
    
    // Execute paginated query
    const notifications = await query
      .orderBy(desc(approvalNotifications.createdAt))
      .limit(limit)
      .offset(offset);
    
    res.json({
      notifications,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        unreadCount: unreadOnly ? totalItems : null
      }
    });
  } catch (error) {
    console.error("Error getting user notifications:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get notifications",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Mark notifications as read
 */
export const markNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(
        "Invalid notification IDs",
        ErrorType.VALIDATION,
        400
      );
    }
    
    // Update notifications
    await db.update(approvalNotifications)
      .set({ isRead: true })
      .where(
        and(
          eq(approvalNotifications.userId, userId),
          sql`id = ANY(${ids})`
        )
      );
    
    res.json({ success: true, count: ids.length });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to mark notifications as read",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    // Execute count query
    const countResult = await db.select({ count: sql<number>`COUNT(*)` })
      .from(approvalNotifications)
      .where(
        and(
          eq(approvalNotifications.userId, userId),
          eq(approvalNotifications.isRead, false)
        )
      );
    
    const unreadCount = countResult[0].count;
    
    res.json({ unreadCount });
  } catch (error) {
    console.error("Error getting unread notification count:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get unread notification count",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Get user approval settings
 */
export const getUserApprovalSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    // Get user settings
    const [settings] = await db.select().from(approvalSettings)
      .where(eq(approvalSettings.userId, userId));
    
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings: InsertApprovalSettings = {
        userId,
        autoAssignEnabled: true,
        defaultAssignees: [],
        notificationFrequency: NotificationFrequency.IMMEDIATELY,
        emailNotificationsEnabled: true,
        language: Language.ENGLISH,
        departmentRules: [],
        moduleTypeRules: []
      };
      
      const [createdSettings] = await db.insert(approvalSettings).values(defaultSettings).returning();
      return res.json(createdSettings);
    }
    
    res.json(settings);
  } catch (error) {
    console.error("Error getting user approval settings:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to get approval settings",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Update user approval settings
 */
export const updateUserApprovalSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    // Validate request data
    const validatedData = approvalSettingsRequestSchema.parse(req.body);
    
    // Check if settings exist
    const [existingSettings] = await db.select().from(approvalSettings)
      .where(eq(approvalSettings.userId, userId));
    
    if (!existingSettings) {
      // Create new settings
      const newSettings: InsertApprovalSettings = {
        userId,
        autoAssignEnabled: validatedData.autoAssignEnabled ?? true,
        defaultAssignees: validatedData.defaultAssignees ?? [],
        notificationFrequency: validatedData.notificationFrequency ?? NotificationFrequency.IMMEDIATELY,
        emailNotificationsEnabled: validatedData.emailNotificationsEnabled ?? true,
        language: validatedData.language ?? Language.ENGLISH,
        departmentRules: validatedData.departmentRules ?? [],
        moduleTypeRules: validatedData.moduleTypeRules ?? []
      };
      
      const [createdSettings] = await db.insert(approvalSettings).values(newSettings).returning();
      return res.json(createdSettings);
    }
    
    // Update existing settings
    const [updatedSettings] = await db.update(approvalSettings)
      .set({
        autoAssignEnabled: validatedData.autoAssignEnabled ?? existingSettings.autoAssignEnabled,
        defaultAssignees: validatedData.defaultAssignees ?? existingSettings.defaultAssignees,
        notificationFrequency: validatedData.notificationFrequency ?? existingSettings.notificationFrequency,
        emailNotificationsEnabled: validatedData.emailNotificationsEnabled ?? existingSettings.emailNotificationsEnabled,
        language: validatedData.language ?? existingSettings.language,
        departmentRules: validatedData.departmentRules ?? existingSettings.departmentRules,
        moduleTypeRules: validatedData.moduleTypeRules ?? existingSettings.moduleTypeRules,
        updatedAt: new Date()
      })
      .where(eq(approvalSettings.userId, userId))
      .returning();
    
    res.json(updatedSettings);
  } catch (error) {
    console.error("Error updating approval settings:", error);
    if (error instanceof z.ZodError) {
      throw new AppError(
        "Invalid settings data",
        ErrorType.VALIDATION,
        400,
        error.errors
      );
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update approval settings",
      ErrorType.DATABASE,
      500
    );
  }
};

/**
 * Update the module that is referenced by the approval item
 */
async function updateModuleStatus(
  item: ApprovalItem, 
  status: 'approved' | 'rejected'
): Promise<void> {
  try {
    const { moduleType, moduleId } = item;
    
    switch (moduleType) {
      case ModuleType.RISK_ASSESSMENT:
        await db.update(sql`risk_assessments`)
          .set({ status: status === 'approved' ? 'approved' : 'rejected' })
          .where(eq(sql`assessment_id`, moduleId));
        break;
        
      case ModuleType.SYSTEM_REGISTRATION:
        await db.update(sql`ai_systems`)
          .set({ status: status === 'approved' ? 'active' : 'inactive' })
          .where(eq(sql`system_id`, moduleId));
        break;
        
      case ModuleType.DOCUMENT:
        await db.update(sql`documents`)
          .set({ status: status === 'approved' ? 'final' : 'rejected' })
          .where(eq(sql`id`, parseInt(moduleId)));
        break;
        
      case ModuleType.TRAINING:
        await db.update(sql`training_modules`)
          .set({ status: status === 'approved' ? 'active' : 'inactive' })
          .where(eq(sql`module_id`, moduleId));
        break;
        
      default:
        console.warn(`Unknown module type: ${moduleType}`);
    }
  } catch (error) {
    console.error("Error updating module status:", error);
    throw error;
  }
}

/**
 * Get approval statistics
 */
export const getApprovalStatistics = async (req: Request, res: Response) => {
  try {
    // Count by status
    const statusCounts = await db.select({
      status: approvalItems.status,
      count: sql<number>`COUNT(*)`
    })
    .from(approvalItems)
    .groupBy(approvalItems.status);
    
    // Count by module type
    const moduleTypeCounts = await db.select({
      moduleType: approvalItems.moduleType,
      count: sql<number>`COUNT(*)`
    })
    .from(approvalItems)
    .groupBy(approvalItems.moduleType);
    
    // Count by priority
    const priorityCounts = await db.select({
      priority: approvalItems.priority,
      count: sql<number>`COUNT(*)`
    })
    .from(approvalItems)
    .groupBy(approvalItems.priority);
    
    // Items created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentItems = await db.select({ count: sql<number>`COUNT(*)` })
      .from(approvalItems)
      .where(sql`created_at >= ${thirtyDaysAgo.toISOString()}`);
    
    // Items with approaching deadlines
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    const approachingDeadlines = await db.select({ count: sql<number>`COUNT(*)` })
      .from(approvalItems)
      .where(
        and(
          sql`due_date IS NOT NULL`,
          sql`due_date <= ${twoDaysFromNow.toISOString()}`,
          sql`due_date > NOW()`,
          sql`status IN ('pending', 'in_review')`
        )
      );
    
    // Average time to approval
    const avgTimeResult = await db.select({
      avgTime: sql<number>`AVG(EXTRACT(EPOCH FROM (updated_at - created_at)))`
    })
    .from(approvalItems)
    .where(eq(approvalItems.status, ApprovalStatus.APPROVED));
    
    const avgTimeInHours = avgTimeResult[0].avgTime 
      ? Math.round(avgTimeResult[0].avgTime / 3600 * 10) / 10 
      : 0;
    
    res.json({
      statusCounts: Object.fromEntries(statusCounts.map(item => [item.status, item.count])),
      moduleTypeCounts: Object.fromEntries(moduleTypeCounts.map(item => [item.moduleType, item.count])),
      priorityCounts: Object.fromEntries(priorityCounts.map(item => [item.priority, item.count])),
      recentItemsCount: recentItems[0].count,
      approachingDeadlinesCount: approachingDeadlines[0].count,
      averageApprovalTimeHours: avgTimeInHours
    });
  } catch (error) {
    console.error("Error getting approval statistics:", error);
    throw new AppError(
      "Failed to get approval statistics",
      ErrorType.DATABASE,
      500
    );
  }
};