import React from 'react';
import { DecisionMakerWizard } from '../onboarding/decision-maker-wizard';

interface EnterpriseDecisionPlatformProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function EnterpriseDecisionPlatform({ onComplete, onSkip }: EnterpriseDecisionPlatformProps) {
  // We're using the Decision Maker Wizard for both components as requested
  return (
    <DecisionMakerWizard onComplete={onComplete} />
  );
}