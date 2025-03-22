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
import { AuthProvider, useAuth } from "./components/auth/auth-context";
import { ToastProvider } from "./components/ui/use-toast";
import { useLocation } from "wouter";
import React, { useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { RiskAssessmentGuides } from "./routes/lazy-imports";

function Router() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  // Handle routing based on auth state
  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (
          location !== "/login" && 
          location !== "/register" &&
          !location.startsWith("/reset-password")
        ) {
          setLocation("/login");
        }
      } else if (location === "/login" || location === "/register") {
        setLocation("/");
      }
    }
  }, [user, loading, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
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
      <Route path="/register-system" component={RegisterSystem} />
      <Route path="/knowledge-center" component={KnowledgeCenter} />
      <Route path="/compliance" component={Documentation} />
      <Route path="/governance" component={Dashboard} />
      <Route path="/reports" component={Reports} />
      <Route path="/training" component={Training} />
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

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 text-center">
      © 2025 SGH ASIA Ltd. All rights reserved. We are compliant with EU AI Act, GDPR, PDPD of Vietnam and ISO 27001:2022. Developed and maintained by the Information Technology & Security Division.
    </footer>
  );
}

export default App;