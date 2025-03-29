
import { useEffect } from "react";
import { useUser } from "@/contexts/user-context";
import { useOnboarding } from "@/services/onboarding-service";
import { OnboardingWizard } from "./onboarding-wizard";

/**
 * AutoOnboarding Component
 * This component automatically shows the onboarding flow when a new user logs in.
 * It checks if the user has completed onboarding before and only shows it if they haven't.
 */
export function AutoOnboarding() {
  const { user, isLoading } = useUser();
  const { onboardingState, startOnboarding } = useOnboarding(user?.uid);
  
  // Start onboarding automatically when a user logs in and hasn't completed onboarding
  useEffect(() => {
    if (!isLoading && user && !localStorage.getItem(`eu_ai_act_onboarding_state_${user.uid}`)) {
      startOnboarding();
    }
  }, [user, isLoading, startOnboarding]);
  
  // Render the onboarding wizard if onboarding is active
  if (onboardingState.isActive) {
    return <OnboardingWizard />;
  }
  
  return null;
}
