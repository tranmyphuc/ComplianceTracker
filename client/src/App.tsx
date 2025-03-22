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
import RiskAssessment from "@/pages/risk-assessment"; // Assuming this is the correct path
import Documentation from "@/pages/documentation";
import RegisterSystem from "@/pages/register-system";
import KnowledgeCenter from "@/pages/knowledge-center";
import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { useLocation } from "wouter";
import { AuthProvider } from "./components/auth/auth-context"; // Assuming this is the correct path
import { ToastProvider } from "./components/ui/use-toast"; // Added ToastProvider import.  Path assumed.

// Create auth context
import { createContext } from "react";

// Define our own user type that works for both Firebase and backend auth
export interface AppUser {
  id?: number;
  uid: string;
  email: string;
  username?: string;
  displayName?: string;
  role?: string;
  department?: string;
  // Add any Firebase User properties we need to support
  emailVerified?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export { AuthContext };

function Router() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();
  const auth = getAuth();

  // Check local storage for user on mount
  useEffect(() => {
    // DEVELOPMENT MODE - Auto login with admin
    // Remove this for production
    const devModeEnabled = true; // Set to false to disable development mode

    if (devModeEnabled) {
      console.log("DEVELOPMENT MODE ACTIVATED: Auto-login with admin user");
      const adminUser: AppUser = {
        id: 1,
        uid: "admin-dev",
        email: "admin@example.com",
        username: "admin",
        displayName: "Admin (Dev Mode)",
        role: "admin",
        department: "Executive"
      };

      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setLoading(false);
      return;
    }

    // Normal flow - Try to get user from localStorage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Firebase auth state change listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Convert Firebase user to our AppUser format
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            emailVerified: firebaseUser.emailVerified
          };

          setUser(appUser);
          localStorage.setItem('user', JSON.stringify(appUser));
        } else if (!localStorage.getItem('user')) {
          // Only clear user if we don't have a localStorage user
          // This allows our backend auth to work even if Firebase auth fails
          setUser(null);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase auth error:', error);
      setLoading(false);
    }
  }, [auth]);

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

  const logout = () => {
    auth.signOut().catch(console.error);
    localStorage.removeItem('user');
    setUser(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/risk-assessment" component={RiskAssessment} />
        <Route path="/documentation" component={Documentation} />
        <Route path="/register-system" component={RegisterSystem} />
        <Route path="/knowledge-center" component={KnowledgeCenter} />
        <Route path="/compliance" component={Documentation} />
        <Route path="/governance" component={Dashboard} />
        <Route path="/reports" component={Documentation} />
        <Route path="/profile" component={Dashboard} />
        <Route path="/settings" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </AuthContext.Provider>
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