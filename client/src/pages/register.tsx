import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AuthForm } from "@/components/auth/auth-form";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleRegister = async (data: { 
    email: string; 
    password: string; 
    username: string; 
    displayName?: string;
    department?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      // Update profile with display name
      if (data.displayName) {
        await updateProfile(user, {
          displayName: data.displayName
        });
      }
      
      // Create user in backend
      await apiRequest("POST", "/api/auth/register", {
        uid: user.uid,
        email: data.email,
        username: data.username,
        displayName: data.displayName || data.username,
        department: data.department,
        role: "user"
      });
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      });
      
      setLocation("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("This email is already in use");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email format");
          break;
        case "auth/weak-password":
          setErrorMessage("Password is too weak");
          break;
        default:
          setErrorMessage("Failed to register. Please try again");
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage || "An error occurred during registration",
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
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Register to access the EU AI Act compliance platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm
              isRegister={true}
              onSubmit={handleRegister}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 items-center border-t pt-6">
            <div className="text-sm text-neutral-500">
              Already have an account?{" "}
              <Link href="/login">
                <a className="text-primary font-medium hover:underline">
                  Sign in
                </a>
              </Link>
            </div>
            
            <div className="text-xs text-neutral-400 text-center mt-2">
              By creating an account, you agree to our
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
