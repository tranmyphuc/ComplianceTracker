
import { useState, useEffect } from 'react';

// Define onboarding steps
export enum OnboardingStep {
  WELCOME = 'welcome',
  SYSTEMS_INVENTORY = 'systems-inventory',
  RISK_ASSESSMENT = 'risk-assessment',
  DOCUMENTATION = 'documentation',
  TRAINING = 'training',
  COMPLIANCE_MONITORING = 'compliance-monitoring',
  COMPLETED = 'completed',
}

export interface OnboardingState {
  isActive: boolean;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  skipOnboarding: boolean;
}

// Default state for new users
const defaultOnboardingState: OnboardingState = {
  isActive: true,
  currentStep: OnboardingStep.WELCOME,
  completedSteps: [],
  skipOnboarding: false,
};

// Local storage key for onboarding state
const ONBOARDING_STATE_KEY = 'eu_ai_act_onboarding_state';

/**
 * Hook to manage onboarding state
 */
export const useOnboarding = (userId?: string) => {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(defaultOnboardingState);
  
  // Load onboarding state on component mount
  useEffect(() => {
    if (!userId) return;
    
    const storedState = localStorage.getItem(`${ONBOARDING_STATE_KEY}_${userId}`);
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        setOnboardingState(parsedState);
      } catch (error) {
        console.error('Failed to parse onboarding state:', error);
      }
    }
  }, [userId]);
  
  // Save onboarding state to local storage when it changes
  useEffect(() => {
    if (!userId) return;
    
    localStorage.setItem(`${ONBOARDING_STATE_KEY}_${userId}`, JSON.stringify(onboardingState));
  }, [onboardingState, userId]);
  
  /**
   * Start the onboarding process
   */
  const startOnboarding = () => {
    setOnboardingState({
      ...defaultOnboardingState,
      isActive: true,
    });
  };
  
  /**
   * Complete the current step and move to the next one
   */
  const completeStep = (step: OnboardingStep) => {
    let nextStep = OnboardingStep.COMPLETED;
    
    // Determine the next step based on the current step
    switch (step) {
      case OnboardingStep.WELCOME:
        nextStep = OnboardingStep.SYSTEMS_INVENTORY;
        break;
      case OnboardingStep.SYSTEMS_INVENTORY:
        nextStep = OnboardingStep.RISK_ASSESSMENT;
        break;
      case OnboardingStep.RISK_ASSESSMENT:
        nextStep = OnboardingStep.DOCUMENTATION;
        break;
      case OnboardingStep.DOCUMENTATION:
        nextStep = OnboardingStep.TRAINING;
        break;
      case OnboardingStep.TRAINING:
        nextStep = OnboardingStep.COMPLIANCE_MONITORING;
        break;
      case OnboardingStep.COMPLIANCE_MONITORING:
        nextStep = OnboardingStep.COMPLETED;
        break;
    }
    
    setOnboardingState(prev => ({
      ...prev,
      currentStep: nextStep,
      completedSteps: [...prev.completedSteps.filter(s => s !== step), step],
      isActive: nextStep !== OnboardingStep.COMPLETED,
    }));
  };
  
  /**
   * Skip the onboarding process completely
   */
  const skipOnboarding = () => {
    setOnboardingState(prev => ({
      ...prev,
      isActive: false,
      skipOnboarding: true,
    }));
  };
  
  /**
   * Reset the onboarding process
   */
  const resetOnboarding = () => {
    setOnboardingState(defaultOnboardingState);
  };

  return {
    onboardingState,
    startOnboarding,
    completeStep,
    skipOnboarding,
    resetOnboarding,
  };
};
