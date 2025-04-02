/**
 * Routes for approval assignment functionality (auto and manual assignment)
 */
import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { approvalItems, approvalAssignments, approvalHistory, approvalNotifications } from '../../shared/schema.js';
import { eq, and, or, not, desc, asc } from 'drizzle-orm';
import { AppError, ErrorType } from '../error-handling.js';
import { autoAssignApprovalItem, getAssignmentStrategy, updateAutoAssignmentSettings } from '../auto-assignment.js';

/**
 * Schema for validating manual assignment requests
 */
const manualAssignmentSchema = z.object({
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
  notes: z.string().optional(),
});

/**
 * Schema for validating auto-assignment requests 
 */
const autoAssignmentSchema = z.object({
  forceAssign: z.boolean().optional(),
});

/**
 * Schema for validating auto-assignment settings updates
 */
const updateSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  strategyType: z.enum(['round_robin', 'workload_balanced', 'department_based', 'expertise_based']).optional(),
  departments: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  fallbackUserId: z.string().optional(),
});

/**
 * Manually assign one or more users to an approval item
 */
export const manualAssign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const approvalId = parseInt(id, 10);
    
    if (isNaN(approvalId)) {
      throw new AppError(
        "Invalid approval item ID",
        ErrorType.VALIDATION,
        400
      );
    }
    
    // Validate request data
    const validatedData = manualAssignmentSchema.parse(req.body);
    
    // Verify the approval item exists
    const [item] = await db.select().from(approvalItems).where(eq(approvalItems.id, approvalId));
    
    if (!item) {
      throw new AppError(
        `Approval item with ID ${approvalId} not found`,
        ErrorType.RESOURCE_NOT_FOUND,
        404
      );
    }
    
    // Check if user has permission to assign
    // This would normally be handled by middleware but adding explicit checks here
    const userId = req.user?.uid;
    const userRole = req.user?.role?.toLowerCase();
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    if (userRole !== 'admin' && userRole !== 'approval_manager' && userRole !== 'decision_maker') {
      throw new AppError(
        "You don't have permission to assign approval workflows",
        ErrorType.AUTHORIZATION,
        403
      );
    }
    
    // Create assignments for each assigned user
    const timestamp = new Date();
    const { assignees, notes } = validatedData;
    
    for (const assigneeId of assignees) {
      await db.insert(approvalAssignments).values({
        itemId: String(approvalId),
        assignedTo: assigneeId,
        assignedBy: userId,
        status: 'pending',
        isAutoAssigned: false,
        assignedAt: timestamp,
        notes: notes || 'Manually assigned'
      });
      
      // Create notification for the assignee
      await db.insert(approvalNotifications).values({
        user: assigneeId,
        itemId: String(approvalId),
        title: 'New Approval Assignment',
        message: `You have been assigned to review: ${item.title}`,
        priority: item.priority,
        type: 'assignment',
        createdAt: timestamp,
        isRead: false
      });
    }
    
    // Update the status of the approval item to in_review
    await db.update(approvalItems)
      .set({ 
        status: 'in_review', 
        updatedAt: timestamp
      })
      .where(eq(approvalItems.id, approvalId));
    
    // Add to history
    await db.insert(approvalHistory).values({
      itemId: String(approvalId),
      action: 'assigned',
      status: 'in_review',
      timestamp: timestamp,
      performedBy: userId,
      notes: `Manually assigned to ${assignees.join(', ')} by ${req.user?.displayName || userId}`
    });
    
    res.status(200).json({
      success: true,
      message: 'Approval item has been assigned successfully',
      assignees
    });
    
  } catch (error) {
    console.error("Error assigning approval item:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        type: error.type
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to assign approval item'
    });
  }
};

/**
 * Automatically assign an approval item based on the configured strategy
 */
export const autoAssign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const approvalId = parseInt(id, 10);
    
    if (isNaN(approvalId)) {
      throw new AppError(
        "Invalid approval item ID",
        ErrorType.VALIDATION,
        400
      );
    }
    
    // Validate request data
    const validatedData = autoAssignmentSchema.parse(req.body);
    
    // Verify the approval item exists
    const [item] = await db.select().from(approvalItems).where(eq(approvalItems.id, approvalId));
    
    if (!item) {
      throw new AppError(
        `Approval item with ID ${approvalId} not found`,
        ErrorType.RESOURCE_NOT_FOUND,
        404
      );
    }
    
    // Use the auto-assignment system to assign the item
    const success = await autoAssignApprovalItem(approvalId, {
      forceAssign: validatedData.forceAssign
    });
    
    if (!success) {
      throw new AppError(
        "Auto-assignment failed. Please try manual assignment.",
        ErrorType.INTERNAL,
        500
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Approval item has been auto-assigned successfully'
    });
    
  } catch (error) {
    console.error("Error auto-assigning approval item:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        type: error.type
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to auto-assign approval item'
    });
  }
};

/**
 * Get the current auto-assignment settings
 */
export const getAutoAssignmentSettings = async (req: Request, res: Response) => {
  try {
    // Get the current strategy settings
    const strategy = await getAssignmentStrategy();
    
    // Return the settings
    res.status(200).json({
      enabled: true, // Default is enabled
      strategyType: strategy.type,
      // Additional settings based on strategy type
      ...(strategy.type === 'department_based' && { 
        departments: Object.values(strategy.moduleToDepartmentMap).flat() 
      }),
      ...(strategy.type === 'expertise_based' && {
        experts: Object.values(strategy.expertiseMap).flat()
      }),
      roles: ['admin', 'decision_maker'] // Default roles
    });
    
  } catch (error) {
    console.error("Error getting auto-assignment settings:", error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get auto-assignment settings'
    });
  }
};

/**
 * Update the auto-assignment settings
 */
export const updateAutoAssignmentSettings = async (req: Request, res: Response) => {
  try {
    // Validate request data
    const validatedData = updateSettingsSchema.parse(req.body);
    
    // Check if user has permission
    const userId = req.user?.uid;
    const userRole = req.user?.role?.toLowerCase();
    
    if (!userId) {
      throw new AppError(
        "Authentication required",
        ErrorType.AUTHENTICATION,
        401
      );
    }
    
    if (userRole !== 'admin') {
      throw new AppError(
        "Only administrators can update auto-assignment settings",
        ErrorType.AUTHORIZATION,
        403
      );
    }
    
    // Update settings
    const updatedSettings = await updateAutoAssignmentSettings(validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Auto-assignment settings updated',
      settings: updatedSettings
    });
    
  } catch (error) {
    console.error("Error updating auto-assignment settings:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        type: error.type
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update auto-assignment settings'
    });
  }
};