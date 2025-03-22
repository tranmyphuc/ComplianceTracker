
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Book, CheckCircle, FileText, Info, List, HelpCircle } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';

const RiskAssessmentGuides: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Risk Assessment Guides</h1>
        <p className="text-muted-foreground">
          Detailed guides and documentation to help you understand and implement EU AI Act risk assessments
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Risk Classification Guide
            </CardTitle>
            <CardDescription>
              Understanding the EU AI Act risk classification framework
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              This guide explains how to classify AI systems according to the risk categories defined
              in the EU AI Act: Unacceptable, High, Limited, and Minimal Risk.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#risk-classification">
                View Guide
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Assessment Methodology
            </CardTitle>
            <CardDescription>
              Step-by-step process for conducting risk assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              Learn about the methodology for conducting a comprehensive risk assessment of AI systems,
              including risk identification, analysis, evaluation, and mitigation.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#assessment-methodology">
                View Guide
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Documentation Requirements
            </CardTitle>
            <CardDescription>
              Required documentation for EU AI Act compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              This guide outlines the documentation requirements for AI systems, including technical
              documentation, risk assessments, and compliance records.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#documentation-requirements">
                View Guide
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
            <h2 className="text-xl font-semibold mb-2">Comprehensive Documentation</h2>
            <p className="text-muted-foreground">
              Access our detailed technical documentation for the Risk Assessment Module
            </p>
          </div>
          <Button asChild>
            <Link to="/documentation/risk-assessment">
              View Full Documentation
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>External guidance and information about the EU AI Act</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-3">
              <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">EU AI Act Official Text</h3>
                <p className="text-sm text-muted-foreground">
                  The official legal text of the EU AI Act from the European Commission.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">EU Commission Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Official guidance documents from the European Commission on implementing the Act.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Industry Best Practices</h3>
                <p className="text-sm text-muted-foreground">
                  Industry standards and best practices for AI risk assessment and management.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Risk Management Standards</h3>
                <p className="text-sm text-muted-foreground">
                  International standards for risk management in AI systems.
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
