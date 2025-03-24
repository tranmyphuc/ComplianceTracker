
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
