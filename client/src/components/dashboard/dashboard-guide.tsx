
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  LayoutDashboard, 
  ShieldAlert, 
  FileCheck, 
  BookOpen,
  ArrowRight 
} from 'lucide-react';

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
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Platform Overview
              </h3>
              <p className="text-muted-foreground">
                The EU AI Act Compliance Platform helps organizations register, assess, and monitor AI systems for compliance with the European Union's AI Act regulations.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Key Features:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">1</div>
                  <div>
                    <span className="font-medium">System Registration</span>
                    <p className="text-sm text-muted-foreground">Register your AI systems and document their capabilities and use cases</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">2</div>
                  <div>
                    <span className="font-medium">Risk Assessment</span>
                    <p className="text-sm text-muted-foreground">Evaluate potential risks of your AI systems and get guidance on mitigation</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">3</div>
                  <div>
                    <span className="font-medium">Compliance Monitoring</span>
                    <p className="text-sm text-muted-foreground">Continuously monitor compliance status and get alerted to new requirements</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">4</div>
                  <div>
                    <span className="font-medium">Documentation Generation</span>
                    <p className="text-sm text-muted-foreground">Generate required compliance documentation automatically</p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="registration" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
                <FileCheck className="h-5 w-5 text-primary" />
                System Registration
              </h3>
              <p className="text-muted-foreground">
                The first step in compliance is registering your AI systems to document their purposes, capabilities, and risk factors.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Registration Process:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">1</div>
                  <div>
                    <span className="font-medium">Navigate to System Registration</span>
                    <p className="text-sm text-muted-foreground">Click on "System Registration" in the main navigation menu</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">2</div>
                  <div>
                    <span className="font-medium">Provide Basic Information</span>
                    <p className="text-sm text-muted-foreground">Enter essential details about your AI system, including name, purpose, and domain</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">3</div>
                  <div>
                    <span className="font-medium">Document Technical Aspects</span>
                    <p className="text-sm text-muted-foreground">Record technical specifications, data sources, and algorithms used</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">4</div>
                  <div>
                    <span className="font-medium">Submit for Preliminary Classification</span>
                    <p className="text-sm text-muted-foreground">The platform will analyze your system and suggest an initial risk classification</p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Risk Assessment
              </h3>
              <p className="text-muted-foreground">
                The risk assessment module helps evaluate potential risks and compliance requirements based on the EU AI Act's risk categories.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Risk Assessment Process:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">1</div>
                  <div>
                    <span className="font-medium">Review Preliminary Classification</span>
                    <p className="text-sm text-muted-foreground">Check the suggested risk level for your registered system</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">2</div>
                  <div>
                    <span className="font-medium">Complete Risk Questionnaire</span>
                    <p className="text-sm text-muted-foreground">Answer detailed questions about your system's use cases and potential impacts</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">3</div>
                  <div>
                    <span className="font-medium">Review Risk Analysis</span>
                    <p className="text-sm text-muted-foreground">Examine the identified risks and their severity levels</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">4</div>
                  <div>
                    <span className="font-medium">Get Compliance Requirements</span>
                    <p className="text-sm text-muted-foreground">Receive a list of specific compliance requirements based on your risk classification</p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Compliance Monitoring
              </h3>
              <p className="text-muted-foreground">
                The platform continuously monitors your systems' compliance status and alerts you to any changes in requirements or potential issues.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Compliance Features:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">1</div>
                  <div>
                    <span className="font-medium">Compliance Dashboard</span>
                    <p className="text-sm text-muted-foreground">View the overall compliance status of all your registered systems</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">2</div>
                  <div>
                    <span className="font-medium">Documentation Center</span>
                    <p className="text-sm text-muted-foreground">Access and generate all required compliance documentation</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">3</div>
                  <div>
                    <span className="font-medium">Regulatory Updates</span>
                    <p className="text-sm text-muted-foreground">Stay informed about changes to the EU AI Act and other relevant regulations</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary font-medium">4</div>
                  <div>
                    <span className="font-medium">Audit Preparation</span>
                    <p className="text-sm text-muted-foreground">Get guidance on preparing for compliance audits and inspections</p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Guide
          </Button>
          <Button className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardGuide;
