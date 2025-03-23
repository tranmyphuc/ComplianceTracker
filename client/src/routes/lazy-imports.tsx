import { lazy } from 'react';

// Documentation components
export const RiskAssessmentDocumentation = lazy(() => import('@/pages/documentation/risk-assessment'));
export const RiskAssessmentGuides = lazy(() => import('@/pages/risk-assessment/guides'));
export const TrainingDocumentation = lazy(() => import('../pages/documentation/training-documentation'));
export const TrainingModule = lazy(() => import('../pages/training/module/[id]'));