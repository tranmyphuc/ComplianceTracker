/**
 * Auto Assignment System for Approval Workflows
 * 
 * This module handles automated assignment of approval workflows to users
 * based on various criteria like department, workload, expertise, etc.
 */

import { db } from './db.js';
import { approvalItems, approvalAssignments, approvalHistory, approvalNotifications, users } from '../shared/schema.js';
import { eq, and, or, desc, asc, sql, inArray } from 'drizzle-orm';
import { AppError, ErrorType } from './error-handling.js';

// Types for auto-assignment strategy settings
export interface AutoAssignmentSettings {
  enabled: boolean;
  strategyType: 'round_robin' | 'workload_balanced' | 'department_based' | 'expertise_based';
  departments?: string[];
  roles?: ('admin' | 'operator' | 'developer' | 'decision_maker')[];
  fallbackUserId?: string;
}

// Assignment strategy types
type RoundRobinStrategy = {
  type: 'round_robin';
  lastAssignedUserId?: string;
};

type WorkloadBalancedStrategy = {
  type: 'workload_balanced';
  maxAssignments?: number;
};

type DepartmentBasedStrategy = {
  type: 'department_based';
  moduleToDepartmentMap: Record<string, string[]>;
};

type ExpertiseBasedStrategy = {
  type: 'expertise_based';
  expertiseMap: Record<string, string[]>;
};

type AssignmentStrategy = 
  | RoundRobinStrategy 
  | WorkloadBalancedStrategy 
  | DepartmentBasedStrategy 
  | ExpertiseBasedStrategy;

/**
 * Default settings for auto-assignment
 */
export const defaultAutoAssignmentSettings: AutoAssignmentSettings = {
  enabled: true,
  strategyType: 'workload_balanced',
  roles: ['admin', 'decision_maker'],
  departments: ['Legal & Compliance', 'IT'],
};

/**
 * Module to department mapping for department-based strategy
 */
const defaultModuleToDepartmentMap: Record<string, string[]> = {
  'risk_assessment': ['Legal & Compliance', 'IT'],
  'system_registration': ['IT', 'R&D'],
  'document': ['Legal & Compliance'],
  'training': ['HR', 'Legal & Compliance'],
};

/**
 * Expertise mapping for expertise-based strategy
 */
const defaultExpertiseMap: Record<string, string[]> = {
  'risk_assessment': ['approver@example.com', 'admin@example.com'],
  'system_registration': ['developer@example.com', 'admin@example.com'],
  'document': ['admin@example.com'],
  'training': ['approver@example.com'],
};

/**
 * Get strategy settings from database or use defaults
 */
export async function getAssignmentStrategy(): Promise<AssignmentStrategy> {
  try {
    // In a real implementation, this would fetch from a settings table
    // For now, return a default strategy based on the current strategy type
    const settings = defaultAutoAssignmentSettings;
    
    switch(settings.strategyType) {
      case 'round_robin':
        return { 
          type: 'round_robin', 
          lastAssignedUserId: undefined 
        };
      
      case 'workload_balanced':
        return { 
          type: 'workload_balanced', 
          maxAssignments: 5 
        };
      
      case 'department_based':
        return { 
          type: 'department_based', 
          moduleToDepartmentMap: defaultModuleToDepartmentMap 
        };
      
      case 'expertise_based':
        return { 
          type: 'expertise_based', 
          expertiseMap: defaultExpertiseMap 
        };
      
      default:
        return { 
          type: 'workload_balanced', 
          maxAssignments: 5 
        };
    }
  } catch (error) {
    console.error("Error getting assignment strategy:", error);
    // Default to workload balanced if there's an error
    return { 
      type: 'workload_balanced', 
      maxAssignments: 5 
    };
  }
}

/**
 * Auto-assign an approval item to approvers based on the selected strategy
 */
export async function autoAssignApprovalItem(itemId: number, options?: {
  forceAssign?: boolean;
  specificAssignees?: string[];
}): Promise<boolean> {
  try {
    // 1. Get the item details
    const [item] = await db.select().from(approvalItems).where(eq(approvalItems.id, itemId));
    
    if (!item) {
      console.error(`Cannot auto-assign: Approval item with ID ${itemId} not found`);
      return false;
    }
    
    // Check if item is already assigned
    const existingAssignments = await db.select().from(approvalAssignments)
      .where(eq(approvalAssignments.itemId, String(itemId)));
    
    if (existingAssignments.length > 0 && !options?.forceAssign) {
      console.log(`Approval item ${itemId} already has assignments. Skipping auto-assignment.`);
      return false;
    }
    
    // If specific assignees are provided, use them instead of auto-selection
    let assigneeIds: string[] = [];
    
    if (options?.specificAssignees && options.specificAssignees.length > 0) {
      assigneeIds = options.specificAssignees;
    } else {
      // 2. Get the current strategy
      const currentStrategy = await getAssignmentStrategy();
      
      // 3. Use the strategy to select assignees
      assigneeIds = await selectAssignees(item, currentStrategy);
    }
    
    if (assigneeIds.length === 0) {
      console.error(`No suitable assignees found for approval item ${itemId}`);
      return false;
    }
    
    // 4. Create assignments
    const timestamp = new Date();
    const currentStrategy = await getAssignmentStrategy();
    
    for (const assigneeId of assigneeIds) {
      await db.insert(approvalAssignments).values({
        itemId: String(itemId),
        assignedTo: assigneeId,
        assignedBy: null, // System assignment
        status: 'pending',
        isAutoAssigned: options?.specificAssignees ? false : true,
        assignedAt: timestamp,
        notes: options?.specificAssignees 
          ? 'Manually assigned' 
          : `Auto-assigned using ${currentStrategy.type} strategy`
      });
    }
    
    // 5. Update the status of the approval item
    await db.update(approvalItems)
      .set({ 
        status: 'in_review', 
        updatedAt: timestamp
      })
      .where(eq(approvalItems.id, itemId));
    
    // 6. Record in history
    await db.insert(approvalHistory).values({
      itemId: String(itemId),
      action: 'assigned',
      status: 'in_review',
      timestamp: timestamp,
      performedBy: options?.specificAssignees ? 'manual_assignment' : 'auto_assignment',
      notes: options?.specificAssignees 
        ? `Manually assigned to ${assigneeIds.join(', ')}` 
        : `Auto-assigned to ${assigneeIds.join(', ')} using ${currentStrategy.type} strategy`
    });
    
    // 7. Create notifications for assignees
    for (const assigneeId of assigneeIds) {
      await db.insert(approvalNotifications).values({
        user: assigneeId,
        itemId: String(itemId),
        title: 'New Approval Assignment',
        message: `You have been assigned to review: ${item.title}`,
        type: 'assignment',
        priority: item.priority,
        createdAt: timestamp,
        isRead: false
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error in auto-assignment:", error);
    return false;
  }
}

/**
 * Select assignees based on the chosen strategy
 */
async function selectAssignees(
  item: any, 
  strategy: AssignmentStrategy
): Promise<string[]> {
  try {
    // Default filters for eligible users
    const eligibleRoles = ['admin', 'decision_maker'];
    const settings = defaultAutoAssignmentSettings;
    
    // Build user query based on strategy
    let userQuery = db.select()
      .from(users)
      .where(inArray(users.role, settings.roles || eligibleRoles));
    
    // Apply additional filters based on strategy
    switch(strategy.type) {
      case 'round_robin':
        // Get all eligible users in a fixed order
        userQuery = userQuery.orderBy(users.email);
        break;
        
      case 'workload_balanced':
        // Get users with lowest current workload
        // First, get current assignment counts per user
        const assignmentCounts = await db.select({
          userId: approvalAssignments.assignedTo,
          count: sql<number>`count(*)`.as('count')
        })
        .from(approvalAssignments)
        .where(
          and(
            eq(approvalAssignments.status, 'pending'),
            sql`${approvalAssignments.assignedTo} IS NOT NULL`
          )
        )
        .groupBy(approvalAssignments.assignedTo);
        
        // Convert to a map for easier lookup
        const workloadMap = new Map<string, number>();
        assignmentCounts.forEach(count => {
          workloadMap.set(count.userId, count.count);
        });
        
        // Get eligible users
        const eligibleUsers = await userQuery;
        
        // Sort by workload
        const sortedUsers = eligibleUsers.sort((a, b) => {
          const aWorkload = workloadMap.get(a.uid) || 0;
          const bWorkload = workloadMap.get(b.uid) || 0;
          return aWorkload - bWorkload;
        });
        
        // Return the users with lowest workload (up to 2)
        return sortedUsers.slice(0, 2).map(user => user.uid);
        
      case 'department_based':
        const deptStrategy = strategy as DepartmentBasedStrategy;
        const relevantDepts = deptStrategy.moduleToDepartmentMap[item.moduleType] || [];
        
        if (relevantDepts.length > 0) {
          userQuery = userQuery.where(inArray(users.department, relevantDepts));
        }
        break;
        
      case 'expertise_based':
        const expStrategy = strategy as ExpertiseBasedStrategy;
        const experts = expStrategy.expertiseMap[item.moduleType] || [];
        
        if (experts.length > 0) {
          return experts.slice(0, 2); // Return up to 2 experts
        }
        
        // Fallback to department-based if no experts defined
        const deptMap = defaultModuleToDepartmentMap;
        const relevantDepartments = deptMap[item.moduleType] || [];
        
        if (relevantDepartments.length > 0) {
          userQuery = userQuery.where(inArray(users.department, relevantDepartments));
        }
        break;
    }
    
    // Execute query to get potential assignees
    const potentialAssignees = await userQuery;
    
    // Return up to 2 assignees
    return potentialAssignees.slice(0, 2).map(user => user.uid);
  } catch (error) {
    console.error("Error selecting assignees:", error);
    return [];
  }
}

/**
 * Update auto-assignment settings
 */
export async function updateAutoAssignmentSettings(
  newSettings: Partial<AutoAssignmentSettings>
): Promise<AutoAssignmentSettings> {
  try {
    // In a real implementation, this would update a settings table
    // For now, just log and return merged settings
    const mergedSettings = {
      ...defaultAutoAssignmentSettings,
      ...newSettings
    };
    
    console.log("Auto-assignment settings updated:", mergedSettings);
    return mergedSettings;
  } catch (error) {
    console.error("Error updating auto-assignment settings:", error);
    return defaultAutoAssignmentSettings;
  }
}