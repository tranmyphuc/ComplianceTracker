/**
 * Expert review API handlers and service functions
 */
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';
import { ExpertReview, InsertExpertReview } from '../shared/schema';

/**
 * Get all expert reviews
 * Optionally filter by status or type
 */
export async function getExpertReviews(options: { status?: string; type?: string } = {}): Promise<ExpertReview[]> {
  try {
    // Pass the filter options directly to the storage layer
    return await storage.getExpertReviews(options);
  } catch (error) {
    console.error('Error getting expert reviews:', error);
    throw error;
  }
}

/**
 * Get a single expert review by ID
 */
export async function getExpertReviewById(reviewId: string): Promise<ExpertReview | null> {
  try {
    return await storage.getExpertReviewById(reviewId);
  } catch (error) {
    console.error(`Error getting expert review with ID ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Create a new expert review
 */
export async function createExpertReview(data: Omit<InsertExpertReview, 'reviewId' | 'requestedAt' | 'createdAt' | 'updatedAt'>): Promise<ExpertReview> {
  try {
    const reviewId = `review_${uuidv4()}`;
    const now = new Date();
    
    const reviewData: InsertExpertReview = {
      ...data,
      reviewId,
      requestedAt: now,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
    };
    
    const newReview = await storage.createExpertReview(reviewData);
    
    // Log the creation of a new review
    console.log(`New expert review created: ${reviewId}`);
    
    return newReview;
  } catch (error) {
    console.error('Error creating expert review:', error);
    throw error;
  }
}

/**
 * Update an existing expert review
 */
export async function updateExpertReview(
  reviewId: string, 
  data: Partial<Omit<InsertExpertReview, 'reviewId' | 'createdAt'>>
): Promise<ExpertReview> {
  try {
    const review = await storage.getExpertReviewById(reviewId);
    
    if (!review) {
      throw new Error(`Expert review with ID ${reviewId} not found`);
    }
    
    // Handle status transitions
    if (data.status && data.status !== review.status) {
      if (data.status === 'in_progress' && !data.assignedTo && !review.assignedTo) {
        throw new Error('Cannot transition to in_progress without assigning a reviewer');
      }
      
      // Auto-update timestamps based on status transitions
      if (data.status === 'in_progress' && review.status === 'pending') {
        data.assignedAt = new Date();
      } else if (data.status === 'completed' && review.status !== 'completed') {
        data.completedAt = new Date();
      }
    }
    
    // Always update the updatedAt timestamp
    data.updatedAt = new Date();
    
    const updatedReview = await storage.updateExpertReview(reviewId, data);
    
    return updatedReview;
  } catch (error) {
    console.error(`Error updating expert review with ID ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Delete an expert review
 * Note: In production, consider soft deletion or archiving instead
 */
export async function deleteExpertReview(reviewId: string): Promise<boolean> {
  try {
    return await storage.deleteExpertReview(reviewId);
  } catch (error) {
    console.error(`Error deleting expert review with ID ${reviewId}:`, error);
    throw error;
  }
}