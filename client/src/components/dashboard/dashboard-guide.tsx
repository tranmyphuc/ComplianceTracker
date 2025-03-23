
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, FileText, HelpCircle, ShieldAlert, Users, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

const DashboardGuide: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
  open,
  onOpenChange
}) => {
  const [currentTab, setCurrentTab] = useState("overview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            EU AI Act Compliance Platform Guide
          </DialogTitle>
          <DialogDescription>
            Welcome to the EU AI Act Compliance Platform. This guide will help you understand how to use the platform effectively.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Platform Overview</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The EU AI Act Compliance Platform helps organizations inventory, assess, and ensure compliance of their AI systems with the European Union's AI Act regulations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-1">Step 1: System Registration</h4>
                  <p className="text-sm text-muted-foreground">Register all AI systems in your organization's inventory</p>
                </Card>
                
                <Card className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <ShieldAlert className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-1">Step 2: Risk Assessment</h4>
                  <p className="text-sm text-muted-foreground">Evaluate risk levels and compliance requirements</p>
                </Card>
                
                <Card className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-1">Step 3: Documentation</h4>
                  <p className="text-sm text-muted-foreground">Maintain required documentation and monitor compliance</p>
                </Card>
              </div>
              
              <div className="mt-4">
                <Button onClick={() => setCurrentTab("registration")} className="mt-4 w-full gap-2">
                  Start with System Registration <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="registration" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">System Registration Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The first step to compliance is creating a comprehensive inventory of all AI systems used within your organization.
              </p>
              
              <div className="space-y-4">
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 1</div>
                  <div className="mt-2 flex items-start">
                    <Users className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Navigate to System Registration</h4>
                      <p className="text-sm text-muted-foreground mt-1">Click on "System Registration" in the main navigation menu to access the registration form.</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 2</div>
                  <div className="mt-2 flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Complete the Registration Form</h4>
                      <p className="text-sm text-muted-foreground mt-1">Fill in all required fields with accurate information about your AI system.</p>
                      <div className="bg-amber-50 p-2 rounded mt-2 text-sm border-l-2 border-amber-400">
                        <strong>Tip:</strong> Be as detailed as possible when describing your system's purpose and capabilities.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 3</div>
                  <div className="mt-2 flex items-start">
                    <Lightbulb className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Run AI Analysis</h4>
                      <p className="text-sm text-muted-foreground mt-1">Our DeepSeek-powered AI will analyze your system details to determine risk classification and compliance requirements.</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 4</div>
                  <div className="mt-2 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Review & Submit</h4>
                      <p className="text-sm text-muted-foreground mt-1">Review the AI analysis results and submit the registration to add the system to your inventory.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setCurrentTab("risk")} className="mt-6 w-full gap-2">
                Continue to Risk Assessment <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Risk Assessment Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                After registering your AI systems, the next step is to conduct thorough risk assessments to determine compliance requirements.
              </p>
              
              <div className="space-y-4">
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 1</div>
                  <div className="mt-2 flex items-start">
                    <ShieldAlert className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Navigate to Risk Assessment</h4>
                      <p className="text-sm text-muted-foreground mt-1">Click on "Risk Assessment" in the main navigation menu to access the assessment tools.</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 2</div>
                  <div className="mt-2 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Select a System to Assess</h4>
                      <p className="text-sm text-muted-foreground mt-1">Choose a registered AI system from your inventory to conduct its risk assessment.</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 3</div>
                  <div className="mt-2 flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Complete the Assessment Questionnaire</h4>
                      <p className="text-sm text-muted-foreground mt-1">Answer all questions accurately to determine the risk level and applicable EU AI Act requirements.</p>
                      <div className="bg-amber-50 p-2 rounded mt-2 text-sm border-l-2 border-amber-400">
                        <strong>Important:</strong> Risk assessments must be thorough and honest to ensure proper compliance.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 4</div>
                  <div className="mt-2 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Review Results & Document</h4>
                      <p className="text-sm text-muted-foreground mt-1">Review the assessment results and document any required compliance measures based on the identified risk level.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setCurrentTab("compliance")} className="mt-6 w-full gap-2">
                Continue to Compliance Documentation <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Compliance Documentation Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Maintaining proper documentation is crucial for EU AI Act compliance. Follow these steps to ensure you have all necessary documentation.
              </p>
              
              <div className="space-y-4">
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 1</div>
                  <div className="mt-2 flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">View Required Documentation</h4>
                      <p className="text-sm text-muted-foreground mt-1">Access the system details page to view all documentation requirements based on the risk assessment.</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 2</div>
                  <div className="mt-2 flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Create Required Documents</h4>
                      <p className="text-sm text-muted-foreground mt-1">Use the document templates provided to create all required documentation for your AI system.</p>
                      <div className="bg-amber-50 p-2 rounded mt-2 text-sm border-l-2 border-amber-400">
                        <strong>Tip:</strong> The platform provides AI-assisted document generation to help create compliant documentation.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 3</div>
                  <div className="mt-2 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Upload & Manage Documents</h4>
                      <p className="text-sm text-muted-foreground mt-1">Upload all required documents to the platform to maintain a complete compliance record.</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative border rounded-lg p-4 bg-white shadow-sm">
                  <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 4</div>
                  <div className="mt-2 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Monitor Compliance Status</h4>
                      <p className="text-sm text-muted-foreground mt-1">Regularly check the dashboard to monitor compliance status and address any outstanding issues.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setCurrentTab("overview")} className="mt-6 w-full gap-2">
                Return to Overview
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardGuide;
