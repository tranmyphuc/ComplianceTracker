import { lazy } from "react";

export const HomePage = lazy(() => import("../pages/home"));
export const LoginPage = lazy(() => import("../pages/login"));
export const RegisterPage = lazy(() => import("../pages/register"));
export const ProfilePage = lazy(() => import("../pages/profile"));
export const DashboardPage = lazy(() => import("../pages/dashboard"));
export const TrainingPage = lazy(() => import("../pages/training"));
export const TrainingCoursePage = lazy(() => import("../pages/training/course/[id]"));
export const TrainingCertificatePage = lazy(() => import("../pages/training/certificate/[id]"));
export const NotFound = lazy(() => import("../pages/not-found"));