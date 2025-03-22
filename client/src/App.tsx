import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Login from "@/pages/login";
import Register from "@/pages/register";
import RiskAssessment from "@/pages/risk-assessment";
import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { useLocation } from "wouter";

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

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Redirect to login if not authenticated and trying to access protected routes
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
    });

    return () => unsubscribe();
  }, [auth, location, setLocation]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/risk-assessment" component={RiskAssessment} />
        <Route component={NotFound} />
      </Switch>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
