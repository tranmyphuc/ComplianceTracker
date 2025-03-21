import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from "@/components/auth/auth-form";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      toast({
        title: "Login successful",
        description: "You are now logged in",
      });
      
      setLocation("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
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
        default:
          setErrorMessage("Failed to login. Please check your credentials");
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
            <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ml-2 text-2xl font-semibold">ComplianceAI</span>
          </div>
        </div>
        
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the compliance platform
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
                <a className="text-primary font-medium hover:underline">
                  Sign up
                </a>
              </Link>
            </div>
            
            <div className="text-xs text-neutral-400 text-center mt-2">
              By signing in, you agree to our
              <a href="#" className="text-primary hover:underline mx-1">Terms of Service</a>
              and
              <a href="#" className="text-primary hover:underline mx-1">Privacy Policy</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
