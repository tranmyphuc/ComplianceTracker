import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AiAssistantButton } from "@/components/ai-assistant/assistant-button";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Login from "@/pages/login";
import Register from "@/pages/register";
import RiskAssessment from "@/pages/risk-assessment";
import Documentation from "@/pages/documentation";
import RegisterSystem from "@/pages/register-system";
import KnowledgeCenter from "@/pages/knowledge-center";
import Reports from "@/pages/reports";
import Training from "@/pages/training";
import Workflow from "@/pages/workflow";
import OnboardingPage from "@/pages/onboarding";
import StrategicPlanning from "@/pages/strategic-planning";
import RegulatoryComplexity from "@/pages/regulatory-complexity";
import EnterpriseDecisionPlatform from "@/pages/enterprise-decision-platform";
import RiskManagement from "@/pages/risk-management";
import MarketIntelligence from "@/pages/market-intelligence";
import OperationsExcellence from "@/pages/operations-excellence";
import GrowthInnovation from "@/pages/growth-innovation";
import TextRiskAnalyzerPage from "@/pages/risk-assessment/text-analyzer";
import { AuthProvider, useAuth } from "./components/auth/auth-context";
import { ToastProvider } from "./components/ui/use-toast";
import { useLocation } from "wouter";
import React, { useEffect, lazy, Suspense } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  RiskAssessmentGuides, 
  RiskAssessmentDocumentation as LazyRiskAssessmentDocumentation,
  TrainingDocumentation as LazyTrainingDocumentation,
  TrainingGuidesPage as LazyTrainingGuidesPage,
  TrainingPresentationPage as LazyTrainingPresentationPage,
  TrainingCertificatePage as LazyTrainingCertificatePage,
  TrainingModulePage as LazyTrainingModulePage
} from "./routes/lazy-imports.ts";


function Router() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  // Temporary bypass of login check - login page removed
  useEffect(() => {
    // Force authentication to be always available
    if (location === "/login" || location === "/register") {
      setLocation("/");
    }
  }, [location, setLocation]);

  // Define all routes for verification
  const allRoutes = [
    "/",
    "/inventory",
    "/risk-assessment",
    "/risk-assessment/guides",
    "/risk-assessment/text-analyzer",
    "/documentation",
    "/documentation/risk-assessment",
    "/documentation/training-documentation", 
    "/register-system",
    "/knowledge-center",
    "/compliance",
    "/governance",
    "/reports",
    "/training",
    "/training/module/:id",
    "/training/presentation/:id",
    "/training/certificate/:id",
    "/risk-management",
    "/enterprise-decision-platform",
    "/strategic-planning",
    "/regulatory-complexity",
    "/workflow",
    "/onboarding",
    "/profile",
    "/settings",
    "/market-intelligence",
    "/operations-excellence",
    "/growth-innovation"
  ];

  // For debugging - route verification results
  useEffect(() => {
    import('./utils/route-checker').then(({ verifyRoutes }) => {
      console.log('Route verification:', verifyRoutes(allRoutes));
    });
  }, []);

  // Render content inside App Layout to ensure consistent navigation
  const renderWithLayout = (Component: any, props?: any) => {
    return (
      <AppLayout>
        <Component {...props} />
      </AppLayout>
    );
  };

  // Render suspense components inside App Layout
  const renderSuspense = (Component: any, props?: any) => {
    return (
      <AppLayout>
        <Suspense fallback={<div className="p-8 text-center">Loading content...</div>}>
          <Component {...props} />
        </Suspense>
      </AppLayout>
    );
  };

  return (
    <Switch>
      <Route path="/">
        {() => renderWithLayout(Dashboard)}
      </Route>
      <Route path="/inventory">
        {() => renderWithLayout(Inventory)}
      </Route>
      <Route path="/risk-assessment">
        {() => renderWithLayout(RiskAssessment)}
      </Route>
      <Route path="/risk-assessment/guides">
        {() => renderSuspense(RiskAssessmentGuides)}
      </Route>
      <Route path="/risk-assessment/text-analyzer">
        {() => renderWithLayout(TextRiskAnalyzerPage)}
      </Route>
      <Route path="/documentation">
        {() => renderWithLayout(Documentation)}
      </Route>
      <Route path="/documentation/risk-assessment">
        {() => renderSuspense(LazyRiskAssessmentDocumentation)}
      </Route>
      <Route path="/documentation/training-documentation">
        {() => renderSuspense(LazyTrainingDocumentation)}
      </Route>
      <Route path="/register-system">
        {() => renderWithLayout(RegisterSystem)}
      </Route>
      <Route path="/knowledge-center">
        {() => renderWithLayout(KnowledgeCenter)}
      </Route>
      <Route path="/compliance">
        {() => renderWithLayout(Documentation)}
      </Route>
      <Route path="/governance">
        {() => renderWithLayout(Dashboard)}
      </Route>
      <Route path="/reports">
        {() => renderWithLayout(Reports)}
      </Route>
      <Route path="/training">
        {() => renderWithLayout(Training)}
      </Route>
      <Route path="/training/module/:id">
        {(params) => renderSuspense(LazyTrainingModulePage, { id: params.id })}
      </Route>
      <Route path="/training/presentation/:id">
        {(params) => renderSuspense(LazyTrainingPresentationPage, { id: params.id })}
      </Route>
      <Route path="/training/certificate/:id">
        {(params) => renderSuspense(LazyTrainingCertificatePage, { id: params.id })}
      </Route>
      <Route path="/workflow">
        {() => renderWithLayout(Workflow)}
      </Route>
      <Route path="/strategic-planning">
        {() => renderWithLayout(StrategicPlanning)}
      </Route>
      <Route path="/regulatory-complexity">
        {() => renderWithLayout(RegulatoryComplexity)}
      </Route>
      <Route path="/enterprise-decision-platform">
        {() => renderWithLayout(EnterpriseDecisionPlatform)}
      </Route>
      <Route path="/risk-management">
        {() => renderWithLayout(RiskManagement)}
      </Route>
      <Route path="/onboarding">
        {() => renderWithLayout(OnboardingPage)}
      </Route>
      <Route path="/profile">
        {() => renderWithLayout(Dashboard)}
      </Route>
      <Route path="/settings">
        {() => renderWithLayout(Dashboard)}
      </Route>
      <Route path="/market-intelligence">
        {() => renderWithLayout(MarketIntelligence)}
      </Route>
      <Route path="/operations-excellence">
        {() => renderWithLayout(OperationsExcellence)}
      </Route>
      <Route path="/growth-innovation">
        {() => renderWithLayout(GrowthInnovation)}
      </Route>
      <Route>
        {() => renderWithLayout(NotFound)}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Router />
          <AiAssistantButton />
          <Toaster />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;