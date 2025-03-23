import { lazy } from 'react';

// Documentation components
export const RiskAssessmentDocumentation = lazy(() => import('../pages/documentation/risk-assessment'));
export const RiskAssessmentGuides = lazy(() => import('../pages/risk-assessment/guides'));
export const TrainingDocumentation = lazy(() => import('../pages/documentation/training-documentation'));
export const TrainingModulePage = lazy(() => import('../pages/training/module/[id]'));
export const TrainingPage = lazy(() => import("../pages/training"));
export const TrainingGuidesPage = lazy(() => import("../pages/training/guides"));
export const TrainingPresentationPage = lazy(() => import("../pages/training/presentation"));
export const TrainingCertificatePage = lazy(() => import("../pages/training/certificate"));
import React from 'react';

export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name?: K) {
  return React.lazy(() => {
    if (name === undefined) {
      return factory();
    }
    return factory().then((module) => ({ default: module[name] }));
  });
}
