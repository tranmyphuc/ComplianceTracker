import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowRight, CheckIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";
import { Link } from "wouter";

// Import both wizard implementations
import { InteractiveRiskWizard } from "@/components/risk-assessment/interactive-wizard";
import { EnhancedRiskWizard } from "@/components/risk-assessment/enhanced-wizard";

const RiskAssessmentWizard: React.FC = () => {
  const { t } = useLanguage();
  const [wizardType, setWizardType] = useState<'enhanced' | 'standard'>('enhanced');

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('riskAssessment.wizard.title', 'Risk Assessment Wizard')}</h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="outline" size="sm" asChild>
            <Link to="/risk-assessment">
              {t('riskAssessment.backToOverview', 'Back to Overview')}
            </Link>
          </Button>
        </div>
      </div>

      <Alert className="mb-6">
        <InfoIcon className="h-5 w-5" />
        <AlertTitle>{t('riskAssessment.wizard.newFeature', 'New Feature Available!')}</AlertTitle>
        <AlertDescription>
          {t('riskAssessment.wizard.enhancedWizardInfo', 'Our enhanced risk assessment wizard now includes an AI assistant, progress tracking, and detailed explanations of EU AI Act requirements.')}
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>{t('riskAssessment.wizard.title', 'Risk Assessment Wizard')}</CardTitle>
              <CardDescription>
                {t('riskAssessment.wizard.description', 'Complete the step-by-step wizard to assess your AI system\'s risk level under the EU AI Act')}
              </CardDescription>
            </div>
            
            <Tabs value={wizardType} onValueChange={(v) => setWizardType(v as 'enhanced' | 'standard')} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-2 w-full md:w-[300px]">
                <TabsTrigger value="enhanced" className="flex items-center gap-1">
                  <CheckIcon className="h-3.5 w-3.5" />
                  {t('riskAssessment.wizard.enhancedMode', 'Enhanced Mode')}
                </TabsTrigger>
                <TabsTrigger value="standard">
                  {t('riskAssessment.wizard.standardMode', 'Standard Mode')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            {t('riskAssessment.wizard.instructions', 'This interactive wizard will guide you through a structured assessment to help you understand how the EU AI Act applies to your AI system. Upon completion, you will receive a detailed risk classification and compliance requirements.')}
          </p>

          {wizardType === 'enhanced' ? (
            <EnhancedRiskWizard />
          ) : (
            <InteractiveRiskWizard />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentWizard;