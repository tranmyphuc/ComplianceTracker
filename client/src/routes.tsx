import { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import Loading from './components/ui/loading';

// Basic layout component
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-container">
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

// Lazy-loaded components - only include what we know exists
const Dashboard = lazy(() => import('./pages/dashboard'));
const DemoScenarios = lazy(() => import('./pages/demo-scenarios/index').then(m => ({ default: m.default || (() => <div>Demo Scenarios</div>) })));
const RiskManagement = lazy(() => import('./pages/risk-management'));

// Simplified Routes
const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/">
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </Route>

        <Route path="/risk-management">
          <MainLayout>
            <RiskManagement />
          </MainLayout>
        </Route>

        <Route path="/demo-scenarios">
          <MainLayout>
            <DemoScenarios />
          </MainLayout>
        </Route>

        <Route path="/:rest*">
          <MainLayout>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <p>The page you are looking for does not exist or is under construction.</p>
            </div>
          </MainLayout>
        </Route>
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;