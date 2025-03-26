import { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import MainLayout from './layouts/MainLayout';
import Loading from './components/ui/loading';
import RiskAssessmentGuides from './pages/risk-assessment/guides';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const RiskAssessment = lazy(() => import('./pages/risk-assessment/RiskAssessment'));
const TextAnalyzer = lazy(() => import('./pages/risk-assessment/text-analyzer'));
const Documentation = lazy(() => import('./pages/Documentation'));
const RiskAssessmentDocumentation = lazy(() => import('./pages/risk-assessment/documentation'));
const TrainingDocumentation = lazy(() => import('./pages/training/documentation'));
const RegisterSystem = lazy(() => import('./pages/RegisterSystem'));
const KnowledgeCenter = lazy(() => import('./pages/KnowledgeCenter'));
const ISO42001 = lazy(() => import('./pages/knowledge/ISO42001'));
const Compliance = lazy(() => import('./pages/Compliance'));
const Governance = lazy(() => import('./pages/Governance'));
const Reports = lazy(() => import('./pages/Reports'));
const Training = lazy(() => import('./pages/Training'));
const TrainingModule = lazy(() => import('./pages/training/module'));
const TrainingPresentation = lazy(() => import('./pages/training/presentation'));
const TrainingCertificate = lazy(() => import('./pages/training/certificate'));
const ComprehensiveTraining = lazy(() => import('./pages/training/comprehensive-coaching'));
const RiskManagement = lazy(() => import('./pages/RiskManagement'));
const DecisionPlatform = lazy(() => import('./pages/enterprise/DecisionPlatform'));
const StrategicPlanning = lazy(() => import('./pages/enterprise/StrategicPlanning'));
const RegulatoryComplexity = lazy(() => import('./pages/enterprise/RegulatoryComplexity'));
const Workflow = lazy(() => import('./pages/Workflow'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const MarketIntelligence = lazy(() => import('./pages/enterprise/MarketIntelligence'));
const OperationsExcellence = lazy(() => import('./pages/enterprise/OperationsExcellence'));
const GrowthInnovation = lazy(() => import('./pages/enterprise/GrowthInnovation'));
const Guides = lazy(() => import('./pages/guides'));
const PlatformIntroduction = lazy(() => import('./pages/guides/platform-introduction'));
const PlatformGuide = lazy(() => import('./pages/guides/platform-guide'));
const EUAIACTGuides = lazy(() => import('./pages/training/eu-ai-act-guides')); // Added import for EU AI Act guides
// Demo Scenarios
const DemoScenarios = lazy(() => import('./pages/demo-scenarios'));
const HealthcareScenario = lazy(() => import('./pages/demo-scenarios/healthcare-ai-diagnostics'));
const SGHServiceScenario = lazy(() => import('./pages/demo-scenarios/sgh-service-consulting'));
const FintechScenario = lazy(() => import('./pages/demo-scenarios/fintech-fraud-detection'));
const ManufacturingScenario = lazy(() => import('./pages/demo-scenarios/manufacturing-predictive-maintenance'));
const RetailScenario = lazy(() => import('./pages/demo-scenarios/retail-recommendation-engine'));
const PublicSectorScenario = lazy(() => import('./pages/demo-scenarios/public-sector-eligibility'));
const InsuranceScenario = lazy(() => import('./pages/demo-scenarios/insurance-risk-assessment'));
const EnergyScenario = lazy(() => import('./pages/demo-scenarios/energy-smart-grid'));
const AutomotiveScenario = lazy(() => import('./pages/demo-scenarios/automotive-safety-systems'));
const AgricultureScenario = lazy(() => import('./pages/demo-scenarios/agriculture-precision-farming'));
const LogisticsScenario = lazy(() => import('./pages/demo-scenarios/logistics-supply-chain'));


const AppRoutes = () => {
  // Log all registered routes for debugging
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
    "/knowledge-center/iso42001",
    "/compliance",
    "/governance",
    "/reports",
    "/training",
    "/training/module/:id",
    "/training/presentation/:id",
    "/training/certificate/:id",
    "/training/comprehensive-coaching",
    "/training/eu-ai-act-guides", // Added route for EU AI Act guides
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
    "/growth-innovation",
    "/guides",
    "/guides/platform-introduction",
    "/guides/platform-guide",
    "/demo-scenarios",
    "/demo-scenarios/healthcare-ai-diagnostics",
    "/demo-scenarios/sgh-service-consulting",
    "/demo-scenarios/fintech-fraud-detection",
    "/demo-scenarios/manufacturing-predictive-maintenance",
    "/demo-scenarios/retail-recommendation-engine",
    "/demo-scenarios/public-sector-eligibility",
    "/demo-scenarios/insurance-risk-assessment",
    "/demo-scenarios/energy-smart-grid",
    "/demo-scenarios/automotive-safety-systems",
    "/demo-scenarios/agriculture-precision-farming",
    "/demo-scenarios/logistics-supply-chain"
  ];

  // Check for duplicate routes
  const findDuplicates = (arr: string[]) => {
    return arr.filter((item, index) => arr.indexOf(item) !== index);
  };

  console.log("All registered routes:", allRoutes);
  console.log("Route verification:", {
    totalRoutes: allRoutes.length,
    duplicates: findDuplicates(allRoutes)
  });

  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/">
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </Route>

        <Route path="/inventory">
          <MainLayout>
            <Inventory />
          </MainLayout>
        </Route>

        <Route path="/risk-assessment">
          <MainLayout>
            <RiskAssessment />
          </MainLayout>
        </Route>

        <Route path="/risk-assessment/guides">
          <MainLayout>
            <RiskAssessmentGuides />
          </MainLayout>
        </Route>

        <Route path="/risk-assessment/text-analyzer">
          <MainLayout>
            <TextAnalyzer />
          </MainLayout>
        </Route>

        <Route path="/documentation">
          <MainLayout>
            <Documentation />
          </MainLayout>
        </Route>

        <Route path="/documentation/risk-assessment">
          <MainLayout>
            <RiskAssessmentDocumentation />
          </MainLayout>
        </Route>

        <Route path="/documentation/training-documentation">
          <MainLayout>
            <TrainingDocumentation />
          </MainLayout>
        </Route>

        <Route path="/register-system">
          <MainLayout>
            <RegisterSystem />
          </MainLayout>
        </Route>

        <Route path="/knowledge-center">
          <MainLayout>
            <KnowledgeCenter />
          </MainLayout>
        </Route>

        <Route path="/knowledge-center/iso42001">
          <MainLayout>
            <ISO42001 />
          </MainLayout>
        </Route>

        <Route path="/compliance">
          <MainLayout>
            <Compliance />
          </MainLayout>
        </Route>

        <Route path="/governance">
          <MainLayout>
            <Governance />
          </MainLayout>
        </Route>

        <Route path="/reports">
          <MainLayout>
            <Reports />
          </MainLayout>
        </Route>

        <Route path="/training">
          <MainLayout>
            <Training />
          </MainLayout>
        </Route>

        <Route path="/training/module/:id">
          {(params) => (
            <MainLayout>
              <TrainingModule id={params.id} />
            </MainLayout>
          )}
        </Route>

        <Route path="/training/presentation/:id">
          {(params) => (
            <MainLayout>
              <TrainingPresentation id={params.id} />
            </MainLayout>
          )}
        </Route>

        <Route path="/training/certificate/:id">
          {(params) => (
            <MainLayout>
              <TrainingCertificate id={params.id} />
            </MainLayout>
          )}
        </Route>

        <Route path="/training/comprehensive-coaching">
          <MainLayout>
            <ComprehensiveTraining />
          </MainLayout>
        </Route>

        <Route path="/training/eu-ai-act-guides"> {/* Added route for EU AI Act guides */}
          <MainLayout>
            <EUAIACTGuides />
          </MainLayout>
        </Route>

        <Route path="/risk-management">
          <MainLayout>
            <RiskManagement />
          </MainLayout>
        </Route>

        <Route path="/enterprise-decision-platform">
          <MainLayout>
            <DecisionPlatform />
          </MainLayout>
        </Route>

        <Route path="/strategic-planning">
          <MainLayout>
            <StrategicPlanning />
          </MainLayout>
        </Route>

        <Route path="/regulatory-complexity">
          <MainLayout>
            <RegulatoryComplexity />
          </MainLayout>
        </Route>

        <Route path="/workflow">
          <MainLayout>
            <Workflow />
          </MainLayout>
        </Route>

        <Route path="/onboarding">
          <MainLayout>
            <Onboarding />
          </MainLayout>
        </Route>

        <Route path="/profile">
          <MainLayout>
            <Profile />
          </MainLayout>
        </Route>

        <Route path="/settings">
          <MainLayout>
            <Settings />
          </MainLayout>
        </Route>

        <Route path="/market-intelligence">
          <MainLayout>
            <MarketIntelligence />
          </MainLayout>
        </Route>

        <Route path="/operations-excellence">
          <MainLayout>
            <OperationsExcellence />
          </MainLayout>
        </Route>

        <Route path="/growth-innovation">
          <MainLayout>
            <GrowthInnovation />
          </MainLayout>
        </Route>

        <Route path="/guides">
          <MainLayout>
            <Guides />
          </MainLayout>
        </Route>

        <Route path="/guides/platform-introduction">
          <MainLayout>
            <PlatformIntroduction />
          </MainLayout>
        </Route>

        <Route path="/guides/platform-guide">
          <MainLayout>
            <PlatformGuide />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios">
          <MainLayout>
            <DemoScenarios />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/healthcare-ai-diagnostics">
          <MainLayout>
            <HealthcareScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/sgh-service-consulting">
          <MainLayout>
            <SGHServiceScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/fintech-fraud-detection">
          <MainLayout>
            <FintechScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/manufacturing-predictive-maintenance">
          <MainLayout>
            <ManufacturingScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/retail-recommendation-engine">
          <MainLayout>
            <RetailScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/public-sector-eligibility">
          <MainLayout>
            <PublicSectorScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/insurance-risk-assessment">
          <MainLayout>
            <InsuranceScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/energy-smart-grid">
          <MainLayout>
            <EnergyScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/automotive-safety-systems">
          <MainLayout>
            <AutomotiveScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/agriculture-precision-farming">
          <MainLayout>
            <AgricultureScenario />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios/logistics-supply-chain">
          <MainLayout>
            <LogisticsScenario />
          </MainLayout>
        </Route>
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;