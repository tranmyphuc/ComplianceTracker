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
import { AuthProvider, useAuth } from "./components/auth/auth-context";
import { ToastProvider } from "./components/ui/use-toast";
import { useLocation } from "wouter";
import React, { useEffect, lazy, Suspense } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  RiskAssessmentGuides, 
  RiskAssessmentDocumentation as LazyRiskAssessmentDocumentation,
  TrainingDocumentation as LazyTrainingDocumentation,
  TrainingModule as LazyTrainingModule,
  TrainingPresentationPage as LazyTrainingPresentationPage,
  TrainingCertificatePage as LazyTrainingCertificatePage
} from "./routes/lazy-imports";

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

  // Import route verification utility
import { verifyRoutes } from "./utils/route-checker";

// Verify all routes at startup
const allRoutes = [
  "/",
  "/inventory",
  "/risk-assessment",
  "/risk-assessment/guides",
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
  // Add other routes from your application
];

// Log route verification results
console.log('Route verification:', verifyRoutes(allRoutes));

return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/risk-assessment" component={RiskAssessment} />
      <Route path="/risk-assessment/guides">
        {() => (
          <Suspense fallback={<div className="p-8 text-center">Loading guide...</div>}>
            <RiskAssessmentGuides />
          </Suspense>
        )}
      </Route>
      <Route path="/documentation" component={Documentation} />
      <Route path="/documentation/risk-assessment">
        {() => (
          <Suspense fallback={<div className="p-8 text-center">Loading documentation...</div>}>
            <LazyRiskAssessmentDocumentation />
          </Suspense>
        )}
      </Route>
      <Route path="/documentation/training-documentation">
        {() => (
          <Suspense fallback={<div className="p-8 text-center">Loading documentation...</div>}>
            <LazyTrainingDocumentation />
          </Suspense>
        )}
      </Route>
      <Route path="/register-system" component={RegisterSystem} />
      <Route path="/knowledge-center" component={KnowledgeCenter} />
      <Route path="/compliance" component={Documentation} />
      <Route path="/governance" component={Dashboard} />
      <Route path="/reports" component={Reports} />
      <Route path="/training" component={Training} />
      <Route path="/training/module/:id">
        {(params) => (
          <Suspense fallback={<div className="p-8 text-center">Loading training module...</div>}>
            <LazyTrainingModule params={params} />
          </Suspense>
        )}
      </Route>
      <Route path="/training/presentation/:id">
        {(params) => (
          <Suspense fallback={<div className="p-8 text-center">Loading presentation...</div>}>
            <LazyTrainingPresentationPage params={params} />
          </Suspense>
        )}
      </Route>
      <Route path="/training/certificate/:id">
        {(params) => (
          <Suspense fallback={<div className="p-8 text-center">Loading certificate...</div>}>
            <LazyTrainingCertificatePage params={params} />
          </Suspense>
        )}
      </Route>
      <Route path="/workflow" component={Workflow} />
      <Route path="/strategic-planning" component={StrategicPlanning} />
      <Route path="/regulatory-complexity" component={RegulatoryComplexity} />
      <Route path="/enterprise-decision-platform" component={EnterpriseDecisionPlatform} />
      <Route path="/risk-management" component={RiskManagement} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/profile" component={Dashboard} />
      <Route path="/settings" component={Dashboard} />
      <Route component={NotFound} />
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