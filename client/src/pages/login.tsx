import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from "@/components/auth/auth-form";
import { getFirebaseAuth } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { AuthContext, AppUser } from "../App";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [useFirebase, setUseFirebase] = useState(true);
  const { setUser } = useContext(AuthContext);
  
  // Check if Firebase Auth is available
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.log("Firebase Auth is not available, using backend authentication");
      setUseFirebase(false);
    }
  }, []);
  
  // Bypass function for development purposes only
  const bypassLogin = () => {
    // Create a temporary admin user
    const adminUser: AppUser = {
      id: 1,
      uid: "admin-temp",
      email: "admin@example.com",
      username: "admin",
      displayName: "Admin User",
      role: "admin",
      department: "Executive"
    };
    
    // Update AuthContext with the admin user
    setUser(adminUser);
    
    // Store user in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    console.log("DEVELOPMENT MODE: Auto-login with admin user");
    
    toast({
      title: "Development Mode",
      description: "Auto-logged in as admin",
    });
    
    setLocation("/");
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage("");
    
    // TEMPORARY FOR DEVELOPMENT: Skip normal login and use bypass
    // Remove the line below when authentication is fixed
    bypassLogin();
    return;
    
    try {
      if (useFirebase) {
        // Firebase Authentication
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        // Fallback to our backend authentication
        console.log("Attempting backend login with:", { email: data.email });
        let response;
        try {
          response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password
            })
          });
          
          const responseData = await response.json();
          console.log("Login response:", { status: response.status, data: responseData });
          
          if (!response.ok) {
            throw new Error(responseData.message || "Authentication failed");
          }
          
          // Create an AppUser from the response data
          const user: AppUser = {
            id: responseData.id,
            uid: responseData.uid,
            email: responseData.email,
            username: responseData.username,
            displayName: responseData.displayName,
            role: responseData.role,
            department: responseData.department
          };
          
          // Update AuthContext with the user
          setUser(user);
          
          // Store user in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(user));
          
          console.log("Login successful, user set:", user);
        } catch (error) {
          console.error("Backend login error:", error);
          throw error;
        }
      }
      
      toast({
        title: "Login successful",
        description: "You are now logged in",
      });
      
      setLocation("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (useFirebase && error.code) {
        // Handle specific Firebase auth errors
        switch (error.code) {
          case "auth/user-not-found":
            setErrorMessage("No account found with this email address");
            break;
          case "auth/wrong-password":
            setErrorMessage("Incorrect password");
            break;
          case "auth/invalid-email":
            setErrorMessage("Invalid email format");
            break;
          case "auth/too-many-requests":
            setErrorMessage("Too many failed attempts. Please try again later");
            break;
          case "auth/configuration-not-found":
            // Switch to backend authentication and retry
            console.log("Firebase configuration issue, switching to backend authentication");
            setUseFirebase(false);
            handleLogin(data);
            return;
          default:
            setErrorMessage("Failed to login. Please check your credentials");
        }
      } else {
        // Handle backend auth errors
        setErrorMessage(error.message || "Failed to login. Please check your credentials");
      }
      
      toast({
        title: "Login failed",
        description: errorMessage || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <img src="/images/sgh-logo-color.svg" alt="SGH ASIA" className="h-14 w-auto" />
            <span className="ml-2 text-2xl font-semibold hidden">SGH ASIA</span>
          </div>
        </div>
        
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the EU AI Act compliance platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm
              isRegister={false}
              onSubmit={handleLogin}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 items-center border-t pt-6">
            <div className="text-sm text-neutral-500">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="text-primary font-medium hover:underline">
                  Sign up
                </span>
              </Link>
            </div>
            
            <div className="text-xs text-neutral-400 text-center mt-2">
              By signing in, you agree to our
              <a href="#" className="text-primary hover:underline mx-1">Terms of Service</a>
              and
              <a href="#" className="text-primary hover:underline mx-1">Privacy Policy</a>
            </div>
            
            {!useFirebase && (
              <div className="text-xs text-amber-500 mt-2">
                Using fallback authentication (Firebase not configured)
              </div>
            )}
            
            <div className="text-xs text-green-500 mt-2 font-semibold">
              DEVELOPMENT MODE: Click Sign In for automatic admin access
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
