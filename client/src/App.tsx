import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AiAssistantButton } from "@/components/ai-assistant/assistant-button";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages";
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
import VendorManagement from '@/pages/vendor-management';
import { TranslationsProvider, useTranslationsContext } from "@/contexts/TranslationsContext";
import ISO42001 from "@/pages/knowledge-center/iso42001";
import Compliance from "@/pages/compliance";
import Governance from "@/pages/governance";
import TrainingModule from "@/pages/training/module";
import TrainingPresentation from "@/pages/training/presentation";
import TrainingCertificate from "@/pages/training/certificate";
import Onboarding from "@/pages/onboarding";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import ApiKeys from "@/pages/settings/api-keys";
import Guides from "@/pages/guides";
import FintechScenario from "@/pages/demo-scenarios/fintech-fraud-detection";
import ManufacturingScenario from "@/pages/demo-scenarios/manufacturing-predictive-maintenance";
import RetailScenario from "@/pages/demo-scenarios/retail-recommendation-engine";
import PublicSectorScenario from "@/pages/demo-scenarios/public-sector-ai";
import TextAnalyzer from "@/pages/risk-assessment/text-analyzer";


function App() {
  const translations = useTranslationsContext();
  console.log("Firebase Config:", {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID,
    hasMessagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    hasStorageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  });

  // Add all registered routes for verification
  const routes = [
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
    "/guides",
    "/guides/platform-introduction",
    "/guides/platform-guide",
    "/demo-scenarios",
    "/demo-scenarios/healthcare-ai-diagnostics",
    "/demo-scenarios/fintech-fraud-detection",
    "/demo-scenarios/manufacturing-predictive-maintenance",
    "/demo-scenarios/retail-recommendation-engine",
    "/demo-scenarios/public-sector-ai"
  ];

  // Check for duplicate routes
  const duplicateRoutes = routes.filter((item, index) => routes.indexOf(item) !== index);

  console.log("All registered routes:", routes);
  console.log("Route verification:", {
    totalRoutes: routes.length,
    duplicates: duplicateRoutes,
  });

  // Initialize Firebase
  console.log("Firebase initialized successfully");

  if (translations.loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <>
      <AuthProvider>
        <LanguageProvider>
          <ComplianceTipsProvider>
            <AppLayout>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/inventory" component={Inventory} />
                <Route path="/risk-assessment" component={RiskAssessment} />
                <Route path="/risk-assessment/guides" component={RiskAssessmentGuides} />
                <Route path="/risk-assessment/text-analyzer" component={TextAnalyzer} />
                <Route path="/documentation" component={Documentation} />
                <Route path="/documentation/risk-assessment" component={LazyRiskAssessmentDocumentation} />
                <Route path="/documentation/training-documentation" component={LazyTrainingDocumentation} />
                <Route path="/register-system" component={RegisterSystem} />
                <Route path="/knowledge-center" component={KnowledgeCenter} />
                <Route path="/knowledge-center/iso42001" component={ISO42001} />
                <Route path="/compliance" component={Compliance} />
                <Route path="/governance" component={Governance} />
                <Route path="/reports" component={Reports} />
                <Route path="/training" component={Training} />
                <Route path="/training/module/:id" component={TrainingModule} />
                <Route path="/training/presentation/:id" component={TrainingPresentation} />
                <Route path="/training/certificate/:id" component={TrainingCertificate} />
                <Route path="/risk-management" component={RiskManagement} />
                <Route path="/enterprise-decision-platform" component={EnterpriseDecisionPlatform} />
                <Route path="/strategic-planning" component={StrategicPlanning} />
                <Route path="/regulatory-complexity" component={RegulatoryComplexity} />
                <Route path="/workflow" component={Workflow} />
                <Route path="/onboarding" component={Onboarding} />
                <Route path="/profile" component={Profile} />
                <Route path="/settings" component={Settings} />
                <Route path="/settings/api-keys" component={ApiKeys} />
                <Route path="/market-intelligence" component={MarketIntelligence} />
                <Route path="/operations-excellence" component={OperationsExcellence} />
                <Route path="/growth-innovation" component={GrowthInnovation} />
                <Route path="/guides" component={Guides} />
                <Route path="/guides/platform-introduction" component={PlatformIntroduction} />
                <Route path="/guides/platform-guide" component={PlatformGuide} />
                <Route path="/demo-scenarios" component={DemoScenarios} />
                <Route path="/demo-scenarios/healthcare-ai-diagnostics" component={HealthcareScenario} />
                <Route path="/demo-scenarios/fintech-fraud-detection" component={FintechScenario} />
                <Route path="/demo-scenarios/manufacturing-predictive-maintenance" component={ManufacturingScenario} />
                <Route path="/demo-scenarios/retail-recommendation-engine" component={RetailScenario} />
                <Route path="/demo-scenarios/public-sector-ai" component={PublicSectorScenario} />
              </Switch>
            </AppLayout>
          </ComplianceTipsProvider>
        </LanguageProvider>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationsProvider>
        <App />
        <AiAssistantButton />
      </TranslationsProvider>
    </QueryClientProvider>
  );
}