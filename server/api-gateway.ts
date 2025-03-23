
/**
 * API Gateway - Central routing and middleware for all API endpoints
 */

import { Router, Request, Response, NextFunction } from 'express';
import { systemRegistrationRoutes } from './routes/system-registration-routes';
import { riskAssessmentRoutes } from './routes/risk-assessment-routes';
import { documentationRoutes } from './routes/documentation-routes';
import { userRoutes } from './routes/user-routes';
import { dashboardRoutes } from './routes/dashboard-routes';
import { knowledgeBaseRoutes } from './routes/knowledge-base-routes';
import { trainingRoutes } from './routes/training-routes';
import { complianceRoutes } from './routes/compliance-routes';
import { auditRoutes } from './routes/audit-routes';
import { requestTracker, errorHandler } from './error-handling';

// API versions
export enum ApiVersion {
  V1 = 'v1'
}

// Create API router
export function createApiRouter(): Router {
  const router = Router();
  
  // Apply common middleware
  router.use(requestTracker);
  
  // Version 1 API routes
  const v1Router = Router();
  
  // Register all route groups
  v1Router.use('/auth', userRoutes);
  v1Router.use('/systems', systemRegistrationRoutes);
  v1Router.use('/risk-assessment', riskAssessmentRoutes);
  v1Router.use('/documents', documentationRoutes);
  v1Router.use('/dashboard', dashboardRoutes);
  v1Router.use('/knowledge', knowledgeBaseRoutes);
  v1Router.use('/training', trainingRoutes);
  v1Router.use('/compliance', complianceRoutes);
  v1Router.use('/audit', auditRoutes);
  
  // Mount versioned router
  router.use(`/${ApiVersion.V1}`, v1Router);
  
  // For backward compatibility, also mount on root
  router.use('/', v1Router);
  
  // Global error handler
  router.use(errorHandler);
  
  return router;
}

// Export factory function for route handlers
export function createHandler(
  handlerFn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerFn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
