
/**
 * Risk Assessment Routes
 */

import { Router } from 'express';
import { createHandler } from '../api-gateway';
import * as riskAssessmentService from '../risk-assessment';
import { ValidationError } from '../error-handling';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createAssessmentSchema = z.object({
  systemId: z.string(),
  createdBy: z.string(),
  riskLevel: z.string().optional(),
  riskScore: z.number().optional(),
  systemCategory: z.string().optional(),
  summaryNotes: z.string().optional()
});

const updateAssessmentSchema = z.object({
  riskLevel: z.string().optional(),
  riskScore: z.number().optional(),
  systemCategory: z.string().optional(),
  prohibitedUseChecks: z.array(z.any()).optional(),
  euAiActArticles: z.array(z.string()).optional(),
  complianceGaps: z.array(z.any()).optional(),
  remediationActions: z.array(z.any()).optional(),
  evidenceDocuments: z.array(z.any()).optional(),
  summaryNotes: z.string().optional(),
  status: z.string().optional()
});

const submitAssessmentSchema = z.object({
  userId: z.string(),
  notes: z.string().optional()
});

const approveRejectSchema = z.object({
  userId: z.string(),
  notes: z.string().optional(),
  reason: z.string().optional()
});

// Get all risk assessments for a system
router.get('/system/:systemId', createHandler(async (req, res) => {
  const systemId = req.params.systemId;
  
  if (!systemId) {
    throw new ValidationError('System ID is required');
  }
  
  const assessments = await riskAssessmentService.storage.getRiskAssessmentsForSystem(systemId);
  res.json(assessments);
}));

// Get a specific risk assessment
router.get('/:assessmentId', createHandler(async (req, res) => {
  const assessmentId = req.params.assessmentId;
  
  if (!assessmentId) {
    throw new ValidationError('Assessment ID is required');
  }
  
  const assessment = await riskAssessmentService.storage.getRiskAssessmentByAssessmentId(assessmentId);
  
  if (!assessment) {
    throw new ValidationError('Risk assessment not found');
  }
  
  res.json(assessment);
}));

// Create a new risk assessment
router.post('/', createHandler(async (req, res) => {
  const validatedData = createAssessmentSchema.parse(req.body);
  const newAssessment = await riskAssessmentService.createRiskAssessment(validatedData);
  res.status(201).json(newAssessment);
}));

// Update a risk assessment
router.put('/:assessmentId', createHandler(async (req, res) => {
  const assessmentId = req.params.assessmentId;
  const userId = req.body.userId;
  
  if (!assessmentId) {
    throw new ValidationError('Assessment ID is required');
  }
  
  if (!userId) {
    throw new ValidationError('User ID is required');
  }
  
  const updates = updateAssessmentSchema.parse(req.body);
  const updatedAssessment = await riskAssessmentService.updateRiskAssessment(
    assessmentId,
    updates,
    userId
  );
  
  res.json(updatedAssessment);
}));

// Submit assessment for approval
router.post('/:assessmentId/submit', createHandler(async (req, res) => {
  const assessmentId = req.params.assessmentId;
  
  if (!assessmentId) {
    throw new ValidationError('Assessment ID is required');
  }
  
  const { userId, notes } = submitAssessmentSchema.parse(req.body);
  const assessment = await riskAssessmentService.submitRiskAssessment(
    assessmentId,
    userId,
    notes
  );
  
  res.json(assessment);
}));

// Approve assessment
router.post('/:assessmentId/approve', createHandler(async (req, res) => {
  const assessmentId = req.params.assessmentId;
  
  if (!assessmentId) {
    throw new ValidationError('Assessment ID is required');
  }
  
  const { userId, notes } = approveRejectSchema.parse(req.body);
  const assessment = await riskAssessmentService.approveRiskAssessment(
    assessmentId,
    userId,
    notes
  );
  
  res.json(assessment);
}));

// Reject assessment
router.post('/:assessmentId/reject', createHandler(async (req, res) => {
  const assessmentId = req.params.assessmentId;
  
  if (!assessmentId) {
    throw new ValidationError('Assessment ID is required');
  }
  
  const { userId, reason } = approveRejectSchema.parse(req.body);
  
  if (!reason) {
    throw new ValidationError('Rejection reason is required');
  }
  
  const assessment = await riskAssessmentService.rejectRiskAssessment(
    assessmentId,
    userId,
    reason
  );
  
  res.json(assessment);
}));

// Schedule reassessment
router.post('/:systemId/schedule', createHandler(async (req, res) => {
  const systemId = req.params.systemId;
  const { interval } = req.body;
  
  if (!systemId) {
    throw new ValidationError('System ID is required');
  }
  
  if (!interval) {
    throw new ValidationError('Interval is required');
  }
  
  const deadline = await riskAssessmentService.scheduleReassessment(systemId, interval);
  res.json(deadline);
}));

// Analyze system risk
router.get('/:systemId/analyze', riskAssessmentService.analyzeSystemRisk);

// Analyze prohibited use
router.get('/:systemId/prohibited', riskAssessmentService.analyzeProhibitedUse);

// Generate risk report
router.get('/:systemId/report', riskAssessmentService.generateRiskReport);

// Analyze compliance gaps
router.get('/:systemId/gaps', riskAssessmentService.analyzeComplianceGaps);

export const riskAssessmentRoutes = router;
