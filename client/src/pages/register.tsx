import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AuthForm } from "@/components/auth/auth-form";
import { getFirebaseAuth } from "@/lib/firebase";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [useFirebase, setUseFirebase] = useState(true);
  
  // Check if Firebase Auth is available
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.log("Firebase Auth is not available, using backend authentication only");
      setUseFirebase(false);
    }
  }, []);
  
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
      let uid = "";
      
      if (useFirebase) {
        // Firebase Authentication
        try {
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          const user = userCredential.user;
          uid = user.uid;
          
          // Update profile with display name
          if (data.displayName) {
            await updateProfile(user, {
              displayName: data.displayName
            });
          }
        } catch (error: any) {
          if (error.code === "auth/configuration-not-found") {
            // Switch to backend-only if Firebase is not configured
            console.log("Firebase configuration issue, switching to backend-only registration");
            setUseFirebase(false);
            // Continue with backend registration without Firebase
            uid = "backend-" + Date.now(); // Generate a temporary UID for backend only
          } else {
            throw error; // Re-throw other Firebase errors
          }
        }
      } else {
        // Backend-only registration (no Firebase)
        uid = "backend-" + Date.now(); // Generate a temporary UID for backend only
      }
      
      // Create user in backend
      await apiRequest(
        "POST", 
        "/api/auth/register", 
        {
          uid,
          email: data.email,
          password: data.password, // Only needed for backend auth
          username: data.username,
          displayName: data.displayName || data.username,
          department: data.department,
          role: "user"
        }
      );
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      });
      
      setLocation("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (useFirebase && error.code) {
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
      } else {
        // Handle backend auth errors
        setErrorMessage(error.message || "Failed to register. Please try again");
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
            <img src="/images/sgh-logo-color.svg" alt="SGH ASIA" className="h-14 w-auto" />
            <span className="ml-2 text-2xl font-semibold hidden">SGH ASIA</span>
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
                <span className="text-primary font-medium hover:underline">
                  Sign in
                </span>
              </Link>
            </div>
            
            <div className="text-xs text-neutral-400 text-center mt-2">
              By creating an account, you agree to our
              <a href="#" className="text-primary hover:underline mx-1">Terms of Service</a>
              and
              <a href="#" className="text-primary hover:underline mx-1">Privacy Policy</a>
            </div>
            
            {!useFirebase && (
              <div className="text-xs text-amber-500 mt-2">
                Using backend-only registration (Firebase not configured)
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
