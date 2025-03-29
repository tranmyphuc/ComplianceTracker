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
import ExecutiveDashboardPage from "@/pages/executive-dashboard";
import LegalReviewsPage from "@/pages/legal-reviews";
import { AuthProvider, useAuth } from "./components/auth/auth-context";
import { ToastProvider } from "./components/ui/use-toast";
import { useLocation } from "wouter";
import React, { useEffect, lazy, Suspense } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/app-layout";
import { ComplianceTipProvider } from "@/components/compliance-tips";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { 
  RiskAssessmentGuides, 
  RiskAssessmentDocumentation as LazyRiskAssessmentDocumentation,
  TrainingDocumentation as LazyTrainingDocumentation,
  TrainingGuidesPage as LazyTrainingGuidesPage,
  TrainingPresentationPage as LazyTrainingPresentationPage,
  TrainingCertificatePage as LazyTrainingCertificatePage,
  TrainingModulePage as LazyTrainingModulePage
} from "./routes/lazy-imports.ts";
import PlatformIntroduction from './pages/guides/platform-introduction'; 
import PlatformGuide from './pages/guides/platform-guide'; 
import DemoScenarios from '@/pages/demo-scenarios';
import HealthcareScenario from '@/pages/demo-scenarios/healthcare-ai-diagnostics';
import FintechScenario from '@/pages/demo-scenarios/fintech-fraud-detection';
import RetailScenario from '@/pages/demo-scenarios/retail-recommendation-engine';
import PublicSectorScenario from '@/pages/demo-scenarios/public-sector-eligibility';
import InsuranceScenario from '@/pages/demo-scenarios/insurance-risk-assessment';
import EnergyScenario from '@/pages/demo-scenarios/energy-smart-grid';
import ManufacturingScenario from '@/pages/demo-scenarios/manufacturing-predictive-maintenance';
import ProfessionalServicesScenario from '@/pages/demo-scenarios/professional-services';
import AutomotiveScenario from '@/pages/demo-scenarios/automotive-ai-systems';
import LogisticsScenario from '@/pages/demo-scenarios/logistics-transportation';
import VendorManagement from '@/pages/vendor-management';
import ComplianceChatbotPage from "./pages/compliance-chatbot";
import AdminApiKeys from "@/pages/admin/api-keys";
import AdminDashboard from "@/pages/admin/dashboard";
import DevelopmentMode from "@/pages/development-mode";
import EnhancedDocumentsPage from "@/pages/enhanced-documents";


function Router() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    if (location === "/login" || location === "/register") {
      setLocation("/");
    }
  }, [location, setLocation]);

  const allRoutes = [
    "/",
    "/inventory",
    "/risk-assessment",
    "/risk-assessment/guides",
    "/risk-assessment/wizard",
    "/risk-assessment/results",
    "/risk-assessment/text-analyzer",
    "/documentation",
    "/documentation/risk-assessment",
    "/documentation/training-documentation", 
    "/register-system",
    "/knowledge-center",
    "/knowledge-center/iso42001",
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
    "/settings/api-keys",
    "/market-intelligence",
    "/operations-excellence",
    "/growth-innovation",
    "/legal-reviews",
    "/guides",
    "/guides/platform-introduction", 
    "/guides/platform-guide",
    "/demo-scenarios",
    "/demo-scenarios/healthcare-ai-diagnostics",
    "/demo-scenarios/fintech-fraud-detection",
    "/demo-scenarios/retail-recommendation-engine",
    "/demo-scenarios/public-sector-eligibility",
    "/demo-scenarios/insurance-risk-assessment",
    "/demo-scenarios/energy-smart-grid",
    "/demo-scenarios/manufacturing-predictive-maintenance",
    "/demo-scenarios/sgh-service-consulting",
    "/demo-scenarios/automotive-safety-systems",
    "/demo-scenarios/logistics-supply-chain",
    "/compliance-chatbot",
    "/advanced-analytics",
    "/executive-dashboard",
    "/enhanced-documents",
    "/admin/dashboard", // Added route
    "/development-mode" // Development mode page
  ];

  useEffect(() => {
    import('./utils/route-checker').then(({ verifyRoutes }) => {
      console.log('Route verification:', verifyRoutes(allRoutes));
    });
  }, []);

  const renderWithLayout = (Component: any, props?: any) => {
    return (
      <AppLayout>
        <Component {...props} />
      </AppLayout>
    );
  };

  const renderSuspense = (Component: any, props?: any) => {
    return (
      <AppLayout>
        <React.Suspense fallback={<div className="p-8 text-center">Loading content...</div>}>
          <Component {...props} />
        </React.Suspense>
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
      <Route path="/risk-assessment/wizard">
        {() => renderSuspense(lazy(() => import('./pages/risk-assessment/wizard')))}
      </Route>
      <Route path="/risk-assessment/results/:systemId?/:assessmentId?">
        {() => renderSuspense(lazy(() => import('./pages/risk-assessment/results')))}
      </Route>
      <Route path="/risk-assessment/results">
        {() => renderSuspense(lazy(() => import('./pages/risk-assessment/results')))}
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
      <Route path="/knowledge-center/iso42001">
        {() => renderSuspense(lazy(() => import('./pages/knowledge-center/iso42001')))}
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
        {() => 
          <React.Suspense fallback={<div className="p-6">Loading settings...</div>}>
            {renderWithLayout(lazy(() => import('./pages/settings')))}
          </React.Suspense>
        }
      </Route>
      <Route path="/settings/api-keys">
        {() => 
          <React.Suspense fallback={<div className="p-6">Loading API keys management...</div>}>
            {renderWithLayout(lazy(() => import('./pages/settings/api-keys')))}
          </React.Suspense>
        }
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
      <Route path="/guides">
        {() => renderSuspense(lazy(() => import('./pages/guides')))}
      </Route>
      <Route path="/guides/platform-introduction">
        {() => renderSuspense(PlatformIntroduction)}
      </Route>
      <Route path="/guides/platform-guide">
        {() => renderSuspense(PlatformGuide)}
      </Route>
      <Route path="/demo-scenarios">
        {() => renderSuspense(DemoScenarios)}
      </Route>
      <Route path="/demo-scenarios/healthcare-ai-diagnostics">
        {() => renderSuspense(HealthcareScenario)}
      </Route>
      <Route path="/demo-scenarios/fintech-fraud-detection">
        {() => renderSuspense(FintechScenario)}
      </Route>
      <Route path="/demo-scenarios/retail-recommendation-engine">
        {() => renderSuspense(RetailScenario)}
      </Route>
      <Route path="/demo-scenarios/public-sector-eligibility">
        {() => renderSuspense(PublicSectorScenario)}
      </Route>
      <Route path="/demo-scenarios/insurance-risk-assessment">
        {() => renderSuspense(InsuranceScenario)}
      </Route>
      <Route path="/demo-scenarios/energy-smart-grid">
        {() => renderSuspense(EnergyScenario)}
      </Route>
      <Route path="/demo-scenarios/manufacturing-predictive-maintenance">
        {() => renderSuspense(ManufacturingScenario)}
      </Route>
      <Route path="/demo-scenarios/sgh-service-consulting">
        {() => renderSuspense(ProfessionalServicesScenario)}
      </Route>
      <Route path="/demo-scenarios/automotive-safety-systems">
        {() => renderSuspense(AutomotiveScenario)}
      </Route>
      <Route path="/demo-scenarios/logistics-supply-chain">
        {() => renderSuspense(LogisticsScenario)}
      </Route>
      <Route path="/compliance-chatbot">
        {() => renderWithLayout(ComplianceChatbotPage)}
      </Route>
      <Route path="/advanced-analytics"> {/* Added route */}
        {() => renderWithLayout(() => <div>Advanced Analytics Placeholder</div>)} {/* Placeholder component */}
      </Route>
      <Route path="/executive-dashboard">
        {() => renderWithLayout(ExecutiveDashboardPage)}
      </Route>
      <Route path="/legal-reviews">
        {() => renderWithLayout(LegalReviewsPage)}
      </Route>
      <Route path="/enhanced-documents">
        {() => renderWithLayout(EnhancedDocumentsPage)}
      </Route>
      <Route path="/admin/dashboard"> {/* Added route */}
        {() => renderWithLayout(AdminDashboard)} {/* Added route */}
      </Route>
      <Route path="/development-mode">
        {() => renderWithLayout(DevelopmentMode)}
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
          <LanguageProvider>
            <ComplianceTipProvider jackStyle={true}>
              <Router />
              <AiAssistantButton />
              <Toaster />
            </ComplianceTipProvider>
          </LanguageProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;