import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // Check if onboarding is already completed
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (onboardingCompleted === "true") {
      setShowOnboarding(false);
    }
  }, []);
  
  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setLocation("/dashboard");
  };
  
  // Reset onboarding status (for development/testing)
  const handleResetOnboarding = () => {
    localStorage.removeItem("onboardingCompleted");
    setShowOnboarding(true);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      {showOnboarding ? (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      ) : (
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-purple-800">Onboarding Complete</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            You've already completed the onboarding process. You can now explore the platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/dashboard")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResetOnboarding}
            >
              Restart Onboarding
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { useOnboarding } from "@/services/onboarding-service";

export default function OnboardingPage() {
  const { user } = useUser();
  const { startOnboarding } = useOnboarding(user?.uid);
  
  const handleStartOnboarding = () => {
    startOnboarding();
  };
  
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Welcome to the EU AI Act Compliance Platform</CardTitle>
            </div>
            <CardDescription>
              Your comprehensive solution for navigating EU AI Act compliance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p>
              We've designed this platform to guide you through every step of your compliance journey.
              From registering your AI systems to generating required documentation and training your team,
              we're here to help you achieve and maintain compliance with the EU AI Act.
            </p>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll learn in the onboarding tour:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>How to register and classify your AI systems</li>
                <li>How to assess risks and identify compliance gaps</li>
                <li>How to generate required documentation automatically</li>
                <li>How to access role-specific training modules</li>
                <li>How to set up continuous compliance monitoring</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button onClick={handleStartOnboarding} className="w-full gap-2">
              Start Guided Tour
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
