import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InteractiveRiskWizard } from "@/components/risk-assessment/interactive-wizard";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

const RiskAssessmentWizard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('riskAssessment.wizard.title', 'Risk Assessment Wizard')}</h1>
        <LanguageSwitcher />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('riskAssessment.wizard.title', 'Risk Assessment Wizard')}</CardTitle>
          <CardDescription>
            {t('riskAssessment.wizard.description', 'Complete the step-by-step wizard to assess your AI system\'s risk level under the EU AI Act')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            {t('riskAssessment.wizard.instructions', 'This interactive wizard will guide you through a structured assessment to help you understand how the EU AI Act applies to your AI system. Upon completion, you will receive a detailed risk classification and compliance requirements.')}
          </p>

          <InteractiveRiskWizard />
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentWizard;