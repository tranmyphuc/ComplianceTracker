
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Book, CheckCircle, FileText, Info, List, HelpCircle } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';

import { useComplianceTips } from "@/components/compliance-tips";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

const RiskAssessmentGuides: React.FC = () => {
  const { showTip, setJackStyle } = useComplianceTips();
  const { t } = useLanguage();
  
  // Show Jack's tip when the page loads
  useEffect(() => {
    setJackStyle(true);
    // Display Jack's tip after a short delay
    const timer = setTimeout(() => {
      showTip("jack-tip", "risk-assessment-guides");
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      setJackStyle(false);
    };
  }, [showTip, setJackStyle]);
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">{t('riskAssessment.guides.title')}</h1>
        <p className="text-muted-foreground">
          {t('riskAssessment.guides.description')}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              {t('riskAssessment.classification.title')}
            </CardTitle>
            <CardDescription>
              {t('riskAssessment.classification.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              {t('riskAssessment.classification.content')}
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#risk-classification">
                {t('button.view')}
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('riskAssessment.methodology.title')}
            </CardTitle>
            <CardDescription>
              {t('riskAssessment.methodology.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              {t('riskAssessment.methodology.content')}
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#assessment-methodology">
                {t('button.view')}
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              {t('riskAssessment.documentation.title')}
            </CardTitle>
            <CardDescription>
              {t('riskAssessment.documentation.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              {t('riskAssessment.documentation.content')}
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#documentation-requirements">
                {t('button.view')}
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              High-Risk System Requirements
            </CardTitle>
            <CardDescription>
              Compliance requirements for high-risk AI systems
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              Detailed explanation of the specific requirements that apply to high-risk AI systems
              under the EU AI Act, including risk management, data governance, and human oversight.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#high-risk-requirements">
                View Guide
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Prohibited Use Cases
            </CardTitle>
            <CardDescription>
              Understanding prohibited AI applications
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              This guide explains the AI applications that are explicitly prohibited under Article 5
              of the EU AI Act, including social scoring systems and certain biometric systems.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#prohibited-uses">
                View Guide
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              FAQ: Risk Assessment
            </CardTitle>
            <CardDescription>
              Frequently asked questions about risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              Answers to commonly asked questions about risk assessment under the EU AI Act, including
              timelines, responsibilities, and best practices.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#faq">
                View FAQ
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">{t('riskAssessment.guides.title')}</h2>
            <p className="text-muted-foreground">
              {t('riskAssessment.guides.description')}
            </p>
          </div>
          <Button asChild>
            <Link to="/documentation/risk-assessment">
              {t('button.viewDocs')}
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t('resources.title')}</CardTitle>
          <CardDescription>{t('resources.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-3">
              <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t('resources.official.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('resources.official.description')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t('resources.commission.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('resources.commission.description')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t('resources.best.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('resources.best.description')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">{t('resources.standards.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('resources.standards.description')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentGuides;
