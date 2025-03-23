// Documentation Routes
{
  path: "documentation",
  children: [
    {
      path: "risk-assessment",
      element: <Suspense fallback={<PageLoader />}><RiskAssessmentDocumentation /></Suspense>
    }
  ]
},
{
  path: "risk-assessment/guides",
  element: <Suspense fallback={<PageLoader />}><RiskAssessmentGuides /></Suspense>
},
// ... other routes ...
{
  path: "/knowledge/regulatory",
  element: <RegulatoryContent />
},
{
  path: "/knowledge/glossary",
  element: <Glossary />
},
{
  path: "/knowledge/regulatory/:articleId",
  element: <RegulatoryArticle />
},
{
  path: "/documentation/training-documentation",
  element: <TrainingDocumentation />,
},
{
  path: "/training/module/:id",
  element: <TrainingModule />,
},
{
  path: "/training/presentation/:id",
  element: <TrainingPresentationPage />,
},
{
  path: "/training/certificate/:id",
  element: <TrainingCertificatePage />,
},
{
          path: "systems/:id/assess-risk",
          element: <AssessRiskPage />
        },
        {
          path: "risk-management/:id",
          element: <SystemRiskManagement />
        },
import React, { lazy } from 'react';
import { Route, Switch } from 'wouter';
import { AppLayout } from '../components/layout/app-layout';
import { Loading } from '../components/common/loading';
import { lazyImport } from './lazy-imports';

// Main pages
const Dashboard = lazyImport(() => import('../pages/dashboard'));
const AISystemsInventory = lazyImport(() => import('../pages/inventory'));
const RegisterSystem = lazyImport(() => import('../pages/register-system'));
const RiskAssessment = lazyImport(() => import('../pages/risk-assessment'));
const RiskAssessmentGuides = lazyImport(() => import('../pages/risk-assessment/guides'));
const Documentation = lazyImport(() => import('../pages/documentation'));
const Reports = lazyImport(() => import('../pages/reports'));
const KnowledgeCenter = lazyImport(() => import('../pages/knowledge-center'));
const Training = lazyImport(() => import('../pages/training'));
const TrainingModule = lazyImport(() => import('../pages/training/module'));
const TrainingPresentation = lazyImport(() => import('../pages/training/presentation'));
const TrainingCertificate = lazyImport(() => import('../pages/training/certificate'));
const Tasks = lazyImport(() => import('../pages/tasks'));
const Settings = lazyImport(() => import('../pages/settings'));
const Workflow = lazyImport(() => import('../pages/workflow'));
const Onboarding = lazyImport(() => import('../pages/onboarding'));
const RiskManagement = lazyImport(() => import('../pages/risk-management'));
const RiskManagementDetail = lazyImport(() => import('../pages/risk-management/[id]'));
const Profile = lazyImport(() => import('../pages/profile'));
const EnterprisePlatform = lazyImport(() => import('../pages/enterprise-decision-platform'));
const StrategicPlanning = lazyImport(() => import('../pages/strategic-planning'));
const MarketIntelligence = lazyImport(() => import('../pages/market-intelligence'));
const OperationsExcellence = lazyImport(() => import('../pages/operations-excellence'));
const GrowthInnovation = lazyImport(() => import('../pages/growth-innovation'));
const PlatformTour = lazyImport(() => import('../pages/platform-tour'));
const TrainingDocs = lazyImport(() => import('../pages/training-docs'));

export const Routes = () => (
  <AppLayout>
    <React.Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/inventory" component={AISystemsInventory} />
        <Route path="/register-system" component={RegisterSystem} />
        <Route path="/risk-assessment" component={RiskAssessment} />
        <Route path="/risk-assessment/guides" component={RiskAssessmentGuides} />
        <Route path="/documentation" component={Documentation} />
        <Route path="/reports" component={Reports} />
        <Route path="/knowledge-center" component={KnowledgeCenter} />
        <Route path="/training" component={Training} />
        <Route path="/training/module/:id" component={TrainingModule} />
        <Route path="/training/presentation/:id" component={TrainingPresentation} />
        <Route path="/training/certificate/:id" component={TrainingCertificate} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/settings" component={Settings} />
        <Route path="/workflow" component={Workflow} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/risk-management" component={RiskManagement} />
        <Route path="/risk-management/:id" component={RiskManagementDetail} />
        <Route path="/profile" component={Profile} />
        <Route path="/enterprise-decision-platform" component={EnterprisePlatform} />
        <Route path="/strategic-planning" component={StrategicPlanning} />
        <Route path="/market-intelligence" component={MarketIntelligence} />
        <Route path="/operations-excellence" component={OperationsExcellence} />
        <Route path="/growth-innovation" component={GrowthInnovation} />
        <Route path="/platform-tour" component={PlatformTour} />
        <Route path="/training-docs" component={TrainingDocs} />
      </Switch>
    </React.Suspense>
  </AppLayout>
);
