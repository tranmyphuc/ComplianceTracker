
import { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import LoadingScreen from './components/loading-screen';
import AppLayout from './layout/app-layout';

// Lazy-loaded page components
const Dashboard = lazy(() => import('./pages/dashboard'));
const Inventory = lazy(() => import('./pages/inventory'));
const RiskAssessment = lazy(() => import('./pages/risk-assessment'));
const RiskAssessmentGuides = lazy(() => import('./pages/risk-assessment/guides'));
const RiskTextAnalyzer = lazy(() => import('./pages/risk-assessment/text-analyzer'));
const Documentation = lazy(() => import('./pages/documentation'));
const DocumentationRiskAssessment = lazy(() => import('./pages/documentation/risk-assessment'));
const DocumentationTraining = lazy(() => import('./pages/documentation/training-documentation'));
const SystemRegistration = lazy(() => import('./pages/register-system'));
const KnowledgeCenter = lazy(() => import('./pages/knowledge-center'));
const ISO42001 = lazy(() => import('./pages/knowledge-center/iso42001'));
const Compliance = lazy(() => import('./pages/compliance'));
const Governance = lazy(() => import('./pages/governance'));
const Reports = lazy(() => import('./pages/reports'));
const Training = lazy(() => import('./pages/training'));
const TrainingModule = lazy(() => import('./pages/training/module'));
const TrainingPresentation = lazy(() => import('./pages/training/presentation'));
const TrainingCertificate = lazy(() => import('./pages/training/certificate'));
const RiskManagement = lazy(() => import('./pages/risk-management'));
const EnterprisePlatform = lazy(() => import('./pages/enterprise-decision-platform'));
const StrategicPlanning = lazy(() => import('./pages/strategic-planning'));
const RegulatoryComplexity = lazy(() => import('./pages/regulatory-complexity'));
const Workflow = lazy(() => import('./pages/workflow'));
const Onboarding = lazy(() => import('./pages/onboarding'));
const Profile = lazy(() => import('./pages/profile'));
const Settings = lazy(() => import('./pages/settings'));
const MarketIntelligence = lazy(() => import('./pages/market-intelligence'));
const OperationsExcellence = lazy(() => import('./pages/operations-excellence'));
const GrowthInnovation = lazy(() => import('./pages/growth-innovation'));
const GuidesIndex = lazy(() => import('./pages/guides'));
const PlatformOverviewGuide = lazy(() => import('./pages/guides/platform-overview'));
const PlatformGuide = lazy(() => import('./pages/guides/platform-guide'));

export const routes = [
  { path: '/', component: Dashboard },
  { path: '/inventory', component: Inventory },
  { path: '/risk-assessment', component: RiskAssessment },
  { path: '/risk-assessment/guides', component: RiskAssessmentGuides },
  { path: '/risk-assessment/text-analyzer', component: RiskTextAnalyzer },
  { path: '/documentation', component: Documentation },
  { path: '/documentation/risk-assessment', component: DocumentationRiskAssessment },
  { path: '/documentation/training-documentation', component: DocumentationTraining },
  { path: '/register-system', component: SystemRegistration },
  { path: '/knowledge-center', component: KnowledgeCenter },
  { path: '/knowledge-center/iso42001', component: ISO42001 },
  { path: '/compliance', component: Compliance },
  { path: '/governance', component: Governance },
  { path: '/reports', component: Reports },
  { path: '/training', component: Training },
  { path: '/training/module/:id', component: TrainingModule },
  { path: '/training/presentation/:id', component: TrainingPresentation },
  { path: '/training/certificate/:id', component: TrainingCertificate },
  { path: '/risk-management', component: RiskManagement },
  { path: '/enterprise-decision-platform', component: EnterprisePlatform },
  { path: '/strategic-planning', component: StrategicPlanning },
  { path: '/regulatory-complexity', component: RegulatoryComplexity },
  { path: '/workflow', component: Workflow },
  { path: '/onboarding', component: Onboarding },
  { path: '/profile', component: Profile },
  { path: '/settings', component: Settings },
  { path: '/market-intelligence', component: MarketIntelligence },
  { path: '/operations-excellence', component: OperationsExcellence },
  { path: '/growth-innovation', component: GrowthInnovation },
  { path: '/guides', component: GuidesIndex },
  { path: '/guides/platform-overview', component: PlatformOverviewGuide },
  { path: '/guides/platform-guide', component: PlatformGuide },
];

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AppLayout>
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
        </Switch>
      </AppLayout>
    </Suspense>
  );
}
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
    "/guides/platform-guide"
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
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
