
import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, Book, CheckCircle, FileText, Info, Users, 
  BarChart, Layers, Award, ChevronLeft, BookOpen,
  Calendar, Clock, ShieldAlert, Lightbulb
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const EuAiActTrainingGuide: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => setLocation('/training')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Training
        </Button>
        <h1 className="text-3xl font-bold">EU AI Act Training Guide</h1>
      </div>
      
      <Alert className="mb-6 bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertTitle>Training Guide</AlertTitle>
        <AlertDescription>
          This comprehensive guide covers all aspects of the EU AI Act training program, 
          helping you understand the training structure, content, and certification process.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4 grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Info className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="modules">
            <Layers className="h-4 w-4 mr-2" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Users className="h-4 w-4 mr-2" />
            Role-Based Paths
          </TabsTrigger>
          <TabsTrigger value="certification">
            <Award className="h-4 w-4 mr-2" />
            Certification
          </TabsTrigger>
          <TabsTrigger value="resources">
            <BookOpen className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">EU AI Act Training Program Overview</CardTitle>
              <CardDescription>A comprehensive introduction to the training program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our EU AI Act Training Program provides structured, role-based education to ensure all stakeholders understand their 
                compliance responsibilities. The program is designed to deliver practical knowledge that can be immediately applied 
                to your organization's AI systems.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Program Structure</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The program consists of core modules and specialized tracks based on your role and 
                    responsibilities within the organization.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Time Commitment</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Core modules take approximately 1-2 hours each. The entire program can be completed in 8-12 hours, 
                    depending on your role and learning pace.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <ShieldAlert className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Compliance Focus</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The training directly maps to EU AI Act requirements, ensuring you gain knowledge that translates 
                    to regulatory compliance.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Practical Application</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Each module includes practical exercises and examples to help you apply concepts to your specific 
                    organizational context.
                  </p>
                </div>
              </div>
              
              <Alert variant="default" className="bg-muted/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Training Objectives</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc space-y-1 pl-5 mt-2">
                    <li>Understand the EU AI Act's scope, requirements, and implications</li>
                    <li>Develop skills for AI system risk assessment and classification</li>
                    <li>Learn compliant documentation and governance practices</li>
                    <li>Implement appropriate technical and organizational measures</li>
                    <li>Prepare for enforcement and maintain ongoing compliance</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Training Methods</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Interactive Course Modules</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Comprehensive Documentation</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Practical Assessments</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <Users className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Role-Specific Content</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            size="lg" 
            className="w-full" 
            onClick={() => setLocation('/training/module/1')}
          >
            Get Started with Training
          </Button>
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Training Modules</CardTitle>
              <CardDescription>Core and specialized modules in the EU AI Act training program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Core Modules
                  </h3>
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Module 1: EU AI Act Introduction</h4>
                        <Badge variant="outline">20-30 minutes</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Introduction to the EU AI Act, its scope, and key provisions.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">Overview</Badge>
                        <Badge variant="secondary">Scope</Badge>
                        <Badge variant="secondary">Key Definitions</Badge>
                        <Badge variant="secondary">Risk-Based Approach</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setLocation('/training/module/1')}>
                        Start Module
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Module 2: Risk Classification System</h4>
                        <Badge variant="outline">25-35 minutes</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Understanding the risk categories and how to classify AI systems.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">Risk Management</Badge>
                        <Badge variant="secondary">AI Categories</Badge>
                        <Badge variant="secondary">Assessment Methods</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setLocation('/training/module/2')}>
                        Start Module
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Module 3: Technical Requirements</h4>
                        <Badge variant="outline">40-50 minutes</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Technical requirements for high-risk AI systems.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">Technical Compliance</Badge>
                        <Badge variant="secondary">Data Quality</Badge>
                        <Badge variant="secondary">Documentation</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setLocation('/training/module/3')}>
                        Start Module
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Specialized Modules
                  </h3>
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Module 4: Governance & Documentation</h4>
                        <Badge variant="outline">30-40 minutes</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Implementing effective governance and documentation practices for AI systems.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">Policy Development</Badge>
                        <Badge variant="secondary">Record Keeping</Badge>
                        <Badge variant="secondary">Internal Controls</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" disabled>
                        Coming Soon
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Module 5: Compliance Monitoring</h4>
                        <Badge variant="outline">35-45 minutes</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Establishing ongoing monitoring systems for AI compliance.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">Monitoring Methods</Badge>
                        <Badge variant="secondary">Auditing</Badge>
                        <Badge variant="secondary">Correction Actions</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Role-Based Learning Paths</CardTitle>
              <CardDescription>Tailored training paths based on your organizational role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                The EU AI Act affects different organizational roles in various ways. Our training program
                offers customized learning paths to ensure you receive the most relevant information for your 
                specific responsibilities.
              </p>
              
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Decision Makers</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    For executives, directors, and senior managers responsible for strategic decisions 
                    regarding AI systems.
                  </p>
                  <div className="mb-3">
                    <h4 className="font-medium mb-2">Recommended Modules:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Module 1: EU AI Act Introduction</Badge>
                      <Badge>Module 2: Risk Classification System</Badge>
                      <Badge>Module 4: Governance & Documentation</Badge>
                    </div>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium mb-1">Key Learning Outcomes:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Strategic implications of the EU AI Act</li>
                      <li>Resource allocation for compliance</li>
                      <li>Legal and reputational risk management</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Developers</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    For AI developers, data scientists, and engineers building or implementing AI systems.
                  </p>
                  <div className="mb-3">
                    <h4 className="font-medium mb-2">Recommended Modules:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Module 1: EU AI Act Introduction</Badge>
                      <Badge>Module 2: Risk Classification System</Badge>
                      <Badge>Module 3: Technical Requirements</Badge>
                    </div>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium mb-1">Key Learning Outcomes:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Technical compliance requirements</li>
                      <li>Documentation standards for algorithms and datasets</li>
                      <li>Risk mitigation through technical measures</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Operators</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    For team members who operate, monitor, or supervise AI systems in production.
                  </p>
                  <div className="mb-3">
                    <h4 className="font-medium mb-2">Recommended Modules:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Module 1: EU AI Act Introduction</Badge>
                      <Badge>Module 3: Technical Requirements</Badge>
                      <Badge>Module 5: Compliance Monitoring</Badge>
                    </div>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium mb-1">Key Learning Outcomes:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Operational compliance requirements</li>
                      <li>Monitoring for compliance drift</li>
                      <li>Incident response procedures</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Compliance Officers</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    For legal, risk, and compliance professionals responsible for ensuring regulatory adherence.
                  </p>
                  <div className="mb-3">
                    <h4 className="font-medium mb-2">Recommended Modules:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>All Modules (Comprehensive Path)</Badge>
                    </div>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium mb-1">Key Learning Outcomes:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>In-depth understanding of all compliance aspects</li>
                      <li>Ability to coordinate compliance across departments</li>
                      <li>Audit preparation and regulatory interaction</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Certification Process</CardTitle>
              <CardDescription>Validate and document your EU AI Act knowledge with official certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our certification program verifies your knowledge of the EU AI Act and provides official documentation
                of your compliance competency. Complete the required modules and assessments to receive your certification.
              </p>
              
              <div className="space-y-8 mt-4">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    Certification Requirements
                  </h3>
                  <div className="pl-7 space-y-4">
                    <div>
                      <h4 className="font-medium">1. Module Completion</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete all required modules for your role-based learning path.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">2. Assessment Performance</h4>
                      <p className="text-sm text-muted-foreground">
                        Achieve a minimum score of 70% on all module assessments.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">3. Final Certification Exam</h4>
                      <p className="text-sm text-muted-foreground">
                        Pass the comprehensive certification exam covering all relevant modules.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    Available Certifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">EU AI Act Foundations Certificate</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Certifies basic understanding of the EU AI Act and its key requirements.
                      </p>
                      <Badge variant="outline" className="mb-2">Prerequisites: Modules 1-3</Badge>
                      <div className="text-sm">
                        <p className="mb-1 font-medium">Recognition:</p>
                        <p className="text-muted-foreground">
                          Recognized as entry-level qualification for EU AI Act understanding.
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">EU AI Act Professional Certificate</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Comprehensive certification covering all aspects of EU AI Act compliance.
                      </p>
                      <Badge variant="outline" className="mb-2">Prerequisites: All Modules</Badge>
                      <div className="text-sm">
                        <p className="mb-1 font-medium">Recognition:</p>
                        <p className="text-muted-foreground">
                          Recognized as professional-level qualification for EU AI Act implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    Certification Process
                  </h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <ol className="space-y-4">
                      <li className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm mr-3">1</span>
                        <div>
                          <h4 className="font-medium">Complete Required Modules</h4>
                          <p className="text-sm text-muted-foreground">
                            Finish all modules in your designated learning path.
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm mr-3">2</span>
                        <div>
                          <h4 className="font-medium">Pass Module Assessments</h4>
                          <p className="text-sm text-muted-foreground">
                            Score at least 70% on each module's assessment.
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm mr-3">3</span>
                        <div>
                          <h4 className="font-medium">Take Certification Exam</h4>
                          <p className="text-sm text-muted-foreground">
                            Complete the final comprehensive examination.
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm mr-3">4</span>
                        <div>
                          <h4 className="font-medium">Receive Digital Certificate</h4>
                          <p className="text-sm text-muted-foreground">
                            Download your official certification documentation.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Training Resources</CardTitle>
              <CardDescription>Additional materials to support your EU AI Act learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    Downloadable Materials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-3" />
                        <span>EU AI Act Compliance Checklist</span>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-3" />
                        <span>Risk Assessment Template</span>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-3" />
                        <span>AI Documentation Guide</span>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-3" />
                        <span>Compliance Roadmap Template</span>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Book className="h-5 w-5 text-primary mr-2" />
                    External Resources
                  </h3>
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Official EU AI Act Documentation</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Original legislative text and guidance from the European Commission.
                      </p>
                      <Button variant="outline" size="sm">Visit Website</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Industry Implementation Guidelines</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Practical implementation guidance from industry associations.
                      </p>
                      <Button variant="outline" size="sm">Visit Website</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">AI Standardization Efforts</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Information about emerging standards related to AI governance.
                      </p>
                      <Button variant="outline" size="sm">Visit Website</Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <BarChart className="h-5 w-5 text-primary mr-2" />
                    Assessment Tools
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Self-Assessment Quiz</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Test your knowledge with practice questions.
                      </p>
                      <Button variant="outline" size="sm">Start Quiz</Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Organizational Readiness Tool</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Evaluate your organization's compliance preparedness.
                      </p>
                      <Button variant="outline" size="sm">Access Tool</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button 
          size="lg" 
          onClick={() => setLocation('/training')}
        >
          Return to Training Center
        </Button>
      </div>
    </div>
  );
};

export default EuAiActTrainingGuide;
