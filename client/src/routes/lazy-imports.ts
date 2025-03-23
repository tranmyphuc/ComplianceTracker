
import { lazy } from "react";

// Main pages
export const HomePage = lazy(() => import("../pages/home"));
export const LoginPage = lazy(() => import("../pages/login"));
export const RegisterPage = lazy(() => import("../pages/register"));
export const ProfilePage = lazy(() => import("../pages/profile"));
export const DashboardPage = lazy(() => import("../pages/dashboard"));
export const NotFound = lazy(() => import("../pages/not-found"));

// Training related pages
export const TrainingPage = lazy(() => import("../pages/training"));
export const TrainingGuidesPage = lazy(() => import("../pages/training/guides"));
export const TrainingPresentationPage = lazy(() => import("../pages/training/presentation"));
export const TrainingCertificatePage = lazy(() => import("../pages/training/certificate"));
export const TrainingModulePage = lazy(() => import("../pages/training/module/[id]"));

// Documentation pages
export const RiskAssessmentDocumentation = lazy(() => import('../pages/documentation/risk-assessment'));
export const RiskAssessmentGuides = lazy(() => import('../pages/risk-assessment/guides'));
export const TrainingDocumentation = lazy(() => import('../pages/documentation/training-documentation'));

// System pages
export const InventoryPage = lazy(() => import("../pages/inventory"));
export const RegisterSystemPage = lazy(() => import("../pages/register-system"));
export const RiskAssessmentPage = lazy(() => import("../pages/risk-assessment"));
export const RiskManagementPage = lazy(() => import("../pages/risk-management"));
export const ReportsPage = lazy(() => import("../pages/reports"));
export const KnowledgeCenterPage = lazy(() => import("../pages/knowledge-center"));
