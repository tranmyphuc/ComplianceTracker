
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Book, CheckCircle, FileText, Info, List, HelpCircle, Bot, MessageSquare } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <Card className="flex flex-col border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Interactive Risk Assessment Wizard
            </CardTitle>
            <CardDescription>
              Step-by-step guide to assess your AI system's risk level
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              Complete a guided assessment process with explanations at each step to help you accurately classify your AI system and identify compliance requirements.
            </p>
            <Button variant="default" size="sm" asChild className="w-full">
              <Link to="/risk-assessment/wizard">
                Start Wizard
              </Link>
            </Button>
          </CardContent>
        </Card>
        
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
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/risk-assessment/submitted">
                {t('button.manageAssessments', 'Manage Assessments')}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/documentation/risk-assessment">
                {t('button.viewDocs')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="flex-1">
          <Card className="h-full">
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
        
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>{t('chatbot.assistantTitle', 'Compliance Assistant')}</CardTitle>
              </div>
              <CardDescription>{t('chatbot.assistantDescription', 'Get help with risk assessment questions')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-2 items-start">
                    <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{t('chatbot.assistantGreeting', 'Hello! I can help with your EU AI Act risk assessment questions. What would you like to know?')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('chatbot.commonQuestions', 'Common questions:')}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                      {t('chatbot.question1', 'How do I classify my AI system?')}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                      {t('chatbot.question2', 'What documentation is required?')}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                      {t('chatbot.question3', 'High-risk system requirements?')}
                    </Badge>
                  </div>
                </div>
                
                <Button variant="default" className="w-full" asChild>
                  <a href="/compliance-chatbot">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('chatbot.openAssistant', 'Open Compliance Assistant')}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentGuides;
