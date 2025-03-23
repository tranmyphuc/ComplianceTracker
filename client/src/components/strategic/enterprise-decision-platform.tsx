import React from 'react';
import { EnterpriseWizard } from '../wizards/enterprise-wizard';

interface EnterpriseDecisionPlatformProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function EnterpriseDecisionPlatform({ onComplete, onSkip }: EnterpriseDecisionPlatformProps) {
  return (
    <EnterpriseWizard
      onComplete={onComplete}
      onSkip={onSkip}
      variant="default"
      title="Enterprise AI Decision Platform"
      description="Transform your decision-making with AI-powered insights"
    />
  );
}