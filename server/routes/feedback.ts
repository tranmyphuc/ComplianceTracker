import express from 'express';
import { storage } from '../storage';
import { insertUserFeedbackSchema, submitFeedbackSchema, voteFeedbackSchema, updateFeedbackStatusSchema } from '@shared/schemas/feedback';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all feedback (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const userId = req.session?.user?.uid;
    const { systemId, assessmentId, status, category, isPublic } = req.query;
    
    // Get all feedback with optional filters
    const allFeedback = await storage.getAllFeedback({
      systemId: systemId as string,
      assessmentId: assessmentId as string,
      status: status as string,
      category: category as string,
      isPublic: isPublic === 'true'
    });

    // Return all feedback
    res.json(allFeedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

// Get feedback by ID
router.get('/:feedbackId', async (req, res) => {
  try {
    const { feedbackId } = req.params;
    
    // Get feedback by ID
    const feedback = await storage.getFeedbackById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

// Submit new feedback
router.post('/', async (req, res) => {
  try {
    const userId = req.session?.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Validate request body
    const validationResult = submitFeedbackSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Invalid feedback data', errors: validationResult.error.errors });
    }
    
    const feedbackData = validationResult.data;
    
    // Create new feedback
    const newFeedback = await storage.createFeedback({
      ...insertUserFeedbackSchema.parse({
        ...feedbackData,
        feedbackId: uuidv4(),
        submittedBy: userId
      })
    });
    
    // Log activity
    await storage.createActivity({
      description: `Submitted feedback: ${feedbackData.title}`,
      activityType: 'feedback_submission',
      userId,
      details: { feedbackId: newFeedback.feedbackId, title: feedbackData.title }
    });
    
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// Vote on feedback
router.post('/:feedbackId/vote', async (req, res) => {
  try {
    const userId = req.session?.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { feedbackId } = req.params;
    
    // Validate request body
    const validationResult = voteFeedbackSchema.safeParse({
      ...req.body,
      feedbackId
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Invalid vote data', errors: validationResult.error.errors });
    }
    
    const voteData = validationResult.data;
    
    // Check if feedback exists
    const feedback = await storage.getFeedbackById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Check if user already voted
    const existingVote = await storage.getUserVote(feedbackId, userId);
    
    if (existingVote) {
      // Update existing vote if different
      if (existingVote.isUpvote !== voteData.isUpvote) {
        await storage.updateVote(existingVote.id, { isUpvote: voteData.isUpvote });
        
        // Update vote count
        const voteChange = voteData.isUpvote ? 2 : -2; // +2 if changing from down to up, -2 if changing from up to down
        await storage.updateFeedbackVoteCount(feedbackId, voteChange);
        
        return res.json({ message: 'Vote updated successfully' });
      }
      
      // Vote is the same, so remove it (toggling vote)
      await storage.deleteVote(existingVote.id);
      
      // Update vote count
      const voteChange = existingVote.isUpvote ? -1 : 1; // -1 if removing upvote, +1 if removing downvote
      await storage.updateFeedbackVoteCount(feedbackId, voteChange);
      
      return res.json({ message: 'Vote removed successfully' });
    }
    
    // Create new vote
    await storage.createVote({
      feedbackId,
      userId,
      isUpvote: voteData.isUpvote
    });
    
    // Update vote count
    const voteChange = voteData.isUpvote ? 1 : -1; // +1 for upvote, -1 for downvote
    await storage.updateFeedbackVoteCount(feedbackId, voteChange);
    
    res.status(201).json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).json({ message: 'Failed to process vote' });
  }
});

// Update feedback status (admin only)
router.patch('/:feedbackId/status', async (req, res) => {
  try {
    const userId = req.session?.user?.uid;
    const { feedbackId } = req.params;
    
    // Check if user is admin
    const user = await storage.getUserByUsername(req.session?.user?.username);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can update feedback status' });
    }
    
    // Validate request body
    const validationResult = updateFeedbackStatusSchema.safeParse({
      ...req.body,
      feedbackId
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Invalid status data', errors: validationResult.error.errors });
    }
    
    const updateData = validationResult.data;
    
    // Check if feedback exists
    const feedback = await storage.getFeedbackById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update feedback status
    const updatedFeedback = await storage.updateFeedback(feedbackId, {
      status: updateData.status,
      response: updateData.response,
      implementationNotes: updateData.implementationNotes,
      plannedImplementation: updateData.plannedImplementation,
      respondedBy: userId,
      respondedAt: new Date(),
      priority: updateData.priority,
      isPublic: updateData.isPublic
    });
    
    // Log activity
    await storage.createActivity({
      description: `Updated feedback status to ${updateData.status}: ${feedback.title}`,
      activityType: 'feedback_status_update',
      userId,
      details: { feedbackId, newStatus: updateData.status, title: feedback.title }
    });
    
    res.json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ message: 'Failed to update feedback status' });
  }
});

export default router;