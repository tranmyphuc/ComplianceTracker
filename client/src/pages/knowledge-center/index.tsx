
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, BookIcon, GavelIcon, AlertTriangleIcon, ShieldIcon } from "lucide-react";
import EuAiActOverview from "@/components/knowledge/regulatory-content/eu-ai-act-overview";
import Iso42001Overview from "@/components/knowledge/regulatory-content/iso-42001-overview";
import RiskClassification from "@/components/knowledge/regulatory-content/risk-classification";
import GdprAiAct from "@/components/knowledge/regulatory-content/gdpr-ai-act";

export default function KnowledgeCenter() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-2">Knowledge Center</h1>
      <p className="text-muted-foreground mb-6">
        Access comprehensive resources on EU AI Act compliance and related standards
      </p>
      
      <div className="flex items-center mb-6 gap-2">
        <Input
          placeholder="Search knowledge center..."
          className="max-w-md"
        />
        <Button variant="ghost" size="icon">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="regulatory" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="regulatory">Regulatory Knowledge</TabsTrigger>
          <TabsTrigger value="guides">Compliance Guides</TabsTrigger>
          <TabsTrigger value="templates">Templates & Tools</TabsTrigger>
          <TabsTrigger value="industry">Industry Practices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="regulatory">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center">
                  <BookIcon className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>EU AI Act Overview</CardTitle>
                </div>
                <CardDescription>Comprehensive guide to the regulation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  A complete breakdown of the EU AI Act including key provisions, timelines, and compliance requirements.
                </p>
                <Button variant="link" className="p-0 mt-2">Read More</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center">
                  <GavelIcon className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>ISO 42001</CardTitle>
                </div>
                <CardDescription>AI Management System Standard</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Overview of ISO 42001, the international standard for AI management systems and how it complements EU AI Act compliance.
                </p>
                <Button variant="link" className="p-0 mt-2">Read More</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center">
                  <AlertTriangleIcon className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Risk Classification</CardTitle>
                </div>
                <CardDescription>Understanding AI risk categories</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Detailed explanation of the EU AI Act's risk-based approach, including unacceptable, high, limited, and minimal risk categories.
                </p>
                <Button variant="link" className="p-0 mt-2">Read More</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center">
                  <ShieldIcon className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>GDPR & AI Act</CardTitle>
                </div>
                <CardDescription>Intersection of data protection and AI</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  How the EU AI Act works alongside GDPR for comprehensive data protection in AI systems.
                </p>
                <Button variant="link" className="p-0 mt-2">Read More</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <EuAiActOverview />
            
            <div className="mt-8">
              <Iso42001Overview />
            </div>
            
            <div className="mt-8">
              <RiskClassification />
            </div>
            
            <div className="mt-8">
              <GdprAiAct />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Implementation Roadmap</CardTitle>
                <CardDescription>Step-by-step guide to EU AI Act compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  A practical roadmap for implementing EU AI Act requirements in your organization.
                </p>
                <Button variant="link" className="p-0 mt-2">View Guide</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Risk Assessment Guide</CardTitle>
                <CardDescription>How to assess AI system risks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Methodology for conducting thorough risk assessments of AI systems under the EU AI Act.
                </p>
                <Button variant="link" className="p-0 mt-2">View Guide</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Documentation Guide</CardTitle>
                <CardDescription>Creating compliant technical documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Guidance on creating and maintaining technical documentation required for high-risk AI systems.
                </p>
                <Button variant="link" className="p-0 mt-2">View Guide</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Technical Documentation Template</CardTitle>
                <CardDescription>For high-risk AI systems</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Comprehensive template for creating EU AI Act compliant technical documentation.
                </p>
                <Button variant="link" className="p-0 mt-2">Download Template</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Risk Assessment Worksheet</CardTitle>
                <CardDescription>Risk evaluation tool</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Structured worksheet for evaluating AI system risks and determining risk classification.
                </p>
                <Button variant="link" className="p-0 mt-2">Download Template</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Conformity Assessment Checklist</CardTitle>
                <CardDescription>High-risk system compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Detailed checklist for conducting conformity assessments for high-risk AI systems.
                </p>
                <Button variant="link" className="p-0 mt-2">Download Checklist</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="industry">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Healthcare AI Compliance</CardTitle>
                <CardDescription>Sector-specific guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Specialized guidance for implementing EU AI Act requirements in healthcare AI applications.
                </p>
                <Button variant="link" className="p-0 mt-2">Read More</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Financial Services AI</CardTitle>
                <CardDescription>Compliance in finance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Implementation guidance for financial institutions using AI systems under the EU AI Act.
                </p>
                <Button variant="link" className="p-0 mt-2">Read More</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>HR & Recruitment AI</CardTitle>
                <CardDescription>Employment application guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Compliance guidance for AI systems used in recruitment and human resources management.
                </p>
                <Button variant="link" className="p-0 mt-2">Read More</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
