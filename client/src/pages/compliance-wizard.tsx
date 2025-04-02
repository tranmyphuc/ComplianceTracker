import React from "react";
import { WizardDemo } from "@/components/eu-ai-act/wizard-demo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ComplianceWizardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">EU AI Act Compliance Wizard</h1>
          <p className="text-muted-foreground mt-2">
            Analyze your AI systems against the EU AI Act requirements and get tailored recommendations
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Tabs defaultValue="wizard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wizard">Interactive Wizard</TabsTrigger>
            <TabsTrigger value="about">About EU AI Act</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wizard" className="space-y-4 py-4">
            <WizardDemo />
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>About the EU AI Act</CardTitle>
                <CardDescription>
                  Understanding the European Union's comprehensive legal framework for artificial intelligence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is the EU AI Act?</h3>
                  <p className="text-muted-foreground">
                    The EU AI Act is the world's first comprehensive legal framework specifically regulating artificial intelligence. 
                    It establishes a risk-based approach that categorizes AI systems based on their potential risks and sets 
                    compliance requirements accordingly.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Elements</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium text-foreground">Risk-based approach:</span> AI systems are 
                      categorized as minimal, limited, high, or unacceptable risk, with different compliance requirements for each.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Prohibited AI practices:</span> Systems considered a clear threat to 
                      people's safety, livelihoods, and rights are prohibited.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">High-risk systems requirements:</span> These must comply with strict 
                      requirements including risk assessment, high quality datasets, logging, human oversight, and transparency.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Transparency obligations:</span> Certain AI systems must disclose 
                      that users are interacting with an AI, and AI-generated content must be labeled.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Benefits of Compliance</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Build trust with users and customers by demonstrating ethical AI practices</li>
                    <li>Mitigate regulatory and reputational risks</li>
                    <li>Create competitive advantage through conformity with high standards</li>
                    <li>Prepare for smooth market access across the European Union</li>
                    <li>Foster innovation while ensuring safety and fundamental rights protection</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">How Our Wizard Helps</h3>
                  <p className="text-muted-foreground">
                    Our AI Compliance Wizard analyzes your AI system's description and provides tailored recommendations 
                    for compliance with the EU AI Act. It identifies which specific articles apply to your system and 
                    suggests necessary compliance actions. This interactive tool simplifies understanding complex regulatory 
                    requirements and helps prioritize your compliance efforts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}