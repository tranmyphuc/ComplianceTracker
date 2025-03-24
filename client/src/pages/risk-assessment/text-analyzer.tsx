import React from 'react';
import { Helmet } from 'react-helmet';
import RootLayout from '@/components/layout/root-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextRiskAnalyzer from '@/components/risk-assessment/text-risk-analyzer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, FileText, HelpCircle } from 'lucide-react';

export default function TextRiskAnalyzerPage() {
  return (
    <RootLayout>
      <Helmet>
        <title>AI Text Risk Analyzer | EU AI Act Compliance Platform</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">AI Text Risk Analyzer</h1>
            <p className="text-muted-foreground">
              Quickly analyze AI system descriptions for EU AI Act risk classification
            </p>
          </div>
          <Link href="/risk-assessment">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Risk Assessment
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="analyzer" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analyzer">Risk Analyzer</TabsTrigger>
            <TabsTrigger value="help">Help & Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyzer" className="space-y-4">
            <TextRiskAnalyzer />
          </TabsContent>
          
          <TabsContent value="help">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    How to Use This Tool
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">Step 1: Enter Description</h3>
                    <p className="text-muted-foreground">
                      Enter a detailed description of your AI system in the text area. The more 
                      information you provide, the more accurate the analysis will be.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Step 2: Analyze</h3>
                    <p className="text-muted-foreground">
                      Click the "Analyze Risk" button. Our system will process the text and identify 
                      potential risk factors according to the EU AI Act.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Step 3: Review Results</h3>
                    <p className="text-muted-foreground">
                      The analysis results will show you the potential risk level, relevant EU AI Act articles,
                      and suggested improvements for compliance.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    EU AI Act Risk Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-medium text-red-600">Unacceptable Risk</h3>
                    <p className="text-sm text-muted-foreground">
                      AI systems that pose a clear threat to people's safety, livelihoods, or rights.
                      Examples include social scoring, real-time biometric identification in public spaces,
                      and systems that exploit vulnerabilities of specific groups.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-orange-600">High Risk</h3>
                    <p className="text-sm text-muted-foreground">
                      AI systems used in critical infrastructure, education, employment, essential services,
                      law enforcement, migration, and other sensitive areas. These systems require extensive
                      documentation, risk assessment, and human oversight.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-yellow-600">Limited Risk</h3>
                    <p className="text-sm text-muted-foreground">
                      Systems like chatbots, emotion recognition, or content generators that require
                      transparency measures. Users must be informed when interacting with AI or when
                      content is AI-generated.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-green-600">Minimal Risk</h3>
                    <p className="text-sm text-muted-foreground">
                      The majority of AI systems fall here, including AI-enabled video games, spam filters,
                      and other applications that pose minimal risk to users' rights or safety.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}