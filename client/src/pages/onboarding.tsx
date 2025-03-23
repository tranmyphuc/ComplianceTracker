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