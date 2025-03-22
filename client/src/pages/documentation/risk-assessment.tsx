
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Book, AlertTriangle, CheckCircle, FileText, Shield, BrainCog, BarChart3 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RiskAssessmentDocumentation: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Risk Assessment Module Documentation</h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="bg-muted/50">
          <CardTitle>EU AI Act Compliance Platform</CardTitle>
          <CardDescription>Version 1.0 • June 2024</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              This documentation provides comprehensive technical specifications and design details for 
              the Risk Assessment Module within the EU AI Act Compliance Platform.
            </AlertDescription>
          </Alert>
          
          <div className="prose max-w-none dark:prose-invert">
            <p>
              The Risk Assessment Module is a critical component of the EU AI Act Compliance Platform, 
              designed to help organizations systematically evaluate their AI systems against the EU AI Act 
              requirements, identify compliance gaps, and implement necessary remediation measures.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Regulatory Requirements</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="ux">User Experience</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="functions">Core Functions</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Purpose of the Risk Assessment Module</h3>
                <p className="text-muted-foreground">
                  The Risk Assessment Module provides a systematic, evidence-based approach to evaluating AI systems 
                  for compliance with the EU AI Act. It enables organizations to classify AI systems according to 
                  risk levels defined in the regulation, identify compliance gaps, and develop remediation plans to 
                  achieve and maintain compliance.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Regulatory Context</h3>
                <p className="text-muted-foreground">
                  The EU AI Act requires organizations to assess and classify AI systems based on their potential 
                  risk to individuals, society, and fundamental rights. Systems are classified into four risk categories 
                  (Unacceptable, High, Limited, and Minimal), with specific compliance requirements for each category.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Business Value</h3>
                <p className="text-muted-foreground">
                  The module delivers significant business value by:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Reducing compliance risk and potential penalties</li>
                  <li>Streamlining the compliance assessment process</li>
                  <li>Providing clear guidance on regulatory requirements</li>
                  <li>Enabling risk-based prioritization of compliance efforts</li>
                  <li>Supporting evidence-based compliance documentation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Integration with Platform Ecosystem</h3>
                <p className="text-muted-foreground">
                  The Risk Assessment Module integrates with other platform components to provide a comprehensive 
                  compliance solution:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>AI Inventory Module for system registration and details</li>
                  <li>Documentation Management for storing compliance evidence</li>
                  <li>Task Management for remediation activities</li>
                  <li>Compliance Reporting for regulatory documentation</li>
                  <li>Training Module for staff awareness and capabilities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                EU AI Act Risk Assessment Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Legal Basis for Risk Assessment</h3>
                <p className="text-muted-foreground">
                  Article 9 of the EU AI Act requires providers of high-risk AI systems to establish, implement, 
                  document, and maintain a risk management system throughout the AI system lifecycle. This risk 
                  management system must include systematic risk assessment processes.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Risk Classification Framework</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4 border bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
                    <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Unacceptable Risk Systems</h4>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Systems that are explicitly prohibited under Article 5, including social scoring systems, 
                      certain real-time biometric identification systems in public spaces, emotion recognition in 
                      workplace/educational settings, and AI for manipulating human behavior.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
                    <h4 className="font-medium text-orange-700 dark:text-orange-300 mb-2">High-Risk Systems</h4>
                    <p className="text-sm text-orange-600 dark:text-orange-300">
                      Systems classified as high-risk under Article 6 and Annex III, including AI used in critical 
                      infrastructure, education, employment, access to essential services, law enforcement, 
                      migration, and the administration of justice.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Limited Risk Systems</h4>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300">
                      Systems with transparency obligations under Article 52, including chatbots, emotion recognition 
                      systems, biometric categorization systems, and AI-generated content (deepfakes).
                    </p>
                  </Card>
                  
                  <Card className="p-4 border bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Minimal Risk Systems</h4>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Systems that do not fall into the above categories, with minimal regulatory requirements 
                      beyond existing law. Organizations are encouraged to apply voluntary codes of practice.
                    </p>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">High-Risk System Requirements</h3>
                <p className="text-muted-foreground mb-3">
                  High-risk AI systems must comply with specific requirements under the EU AI Act:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                  <li><span className="font-medium">Article 9:</span> Risk management system</li>
                  <li><span className="font-medium">Article 10:</span> Data governance measures</li>
                  <li><span className="font-medium">Article 11:</span> Technical documentation</li>
                  <li><span className="font-medium">Article 12:</span> Record-keeping</li>
                  <li><span className="font-medium">Article 13:</span> Transparency and information provision</li>
                  <li><span className="font-medium">Article 14:</span> Human oversight</li>
                  <li><span className="font-medium">Article 15:</span> Accuracy, robustness, and cybersecurity</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Assessment Methodology Requirements</h3>
                <p className="text-muted-foreground">
                  The risk assessment methodology must:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Identify and analyze known and foreseeable risks</li>
                  <li>Estimate risks that may emerge during system use</li>
                  <li>Evaluate risks in expected use and reasonably foreseeable misuse</li>
                  <li>Adopt suitable measures to eliminate or reduce risks</li>
                  <li>Include testing procedures to evaluate effectiveness of risk mitigation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Documentation Requirements</h3>
                <p className="text-muted-foreground">
                  The EU AI Act requires comprehensive documentation of the risk assessment process, including:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>System description and intended purpose</li>
                  <li>Identified risks and their assessment</li>
                  <li>Risk data used in the assessment</li>
                  <li>Risk mitigation measures implemented</li>
                  <li>Testing results and validation of mitigation measures</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Ongoing Monitoring and Reassessment</h3>
                <p className="text-muted-foreground">
                  The risk management process must be iterative and continuous throughout the AI system lifecycle. 
                  Organizations must:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Regularly review and update risk assessments</li>
                  <li>Monitor system performance and compliance</li>
                  <li>Update risk mitigation measures as needed</li>
                  <li>Document changes and reassessments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Regulatory Deadlines and Timeline</h3>
                <div className="relative">
                  <div className="absolute h-full w-0.5 bg-muted-foreground/20 left-0"></div>
                  <div className="space-y-4 ml-6">
                    <div className="relative">
                      <div className="absolute -left-6 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h4 className="font-medium">August 2023</h4>
                        <p className="text-sm text-muted-foreground">EU AI Act agreed in principle</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h4 className="font-medium">Early 2024</h4>
                        <p className="text-sm text-muted-foreground">Final text approval</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h4 className="font-medium">Mid 2024</h4>
                        <p className="text-sm text-muted-foreground">Entry into force</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 w-3 h-3 rounded-full bg-muted"></div>
                      <div>
                        <h4 className="font-medium">Mid 2025</h4>
                        <p className="text-sm text-muted-foreground">Prohibited use provisions apply</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 w-3 h-3 rounded-full bg-muted"></div>
                      <div>
                        <h4 className="font-medium">Mid 2026</h4>
                        <p className="text-sm text-muted-foreground">High-risk system requirements apply</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Assessment Module Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">System Overview</h3>
                <p className="text-muted-foreground">
                  The Risk Assessment Module is designed as a comprehensive solution for evaluating AI systems against 
                  EU AI Act requirements. It features a modular architecture with several key components:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground mt-2">
                  <li>Assessment Wizard interface for guided risk evaluation</li>
                  <li>AI-powered analysis engine for risk classification</li>
                  <li>Gap analysis component for compliance evaluation</li>
                  <li>Documentation generator for compliance evidence</li>
                  <li>Notification system for assessment updates and deadlines</li>
                  <li>Integration layer for connecting with other platform modules</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Data Model</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border px-4 py-2 text-left">Entity</th>
                        <th className="border px-4 py-2 text-left">Key Attributes</th>
                        <th className="border px-4 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">RiskAssessment</td>
                        <td className="border px-4 py-2">id, systemId, date, status, riskLevel, version</td>
                        <td className="border px-4 py-2">Main assessment record</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">AssessmentParameter</td>
                        <td className="border px-4 py-2">id, assessmentId, category, name, value, score</td>
                        <td className="border px-4 py-2">Individual assessment parameters</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">ComplianceGap</td>
                        <td className="border px-4 py-2">id, assessmentId, requirement, status, description</td>
                        <td className="border px-4 py-2">Identified compliance gaps</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">RemediationAction</td>
                        <td className="border px-4 py-2">id, gapId, description, status, dueDate, assignee</td>
                        <td className="border px-4 py-2">Actions to address gaps</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">AssessmentEvidence</td>
                        <td className="border px-4 py-2">id, assessmentId, type, filename, description</td>
                        <td className="border px-4 py-2">Evidence supporting assessment</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">AssessmentRevision</td>
                        <td className="border px-4 py-2">id, assessmentId, date, reviewer, status, comments</td>
                        <td className="border px-4 py-2">Assessment review history</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Services and Components</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Assessment Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Core service for managing the assessment process, including initialization, 
                      parameter evaluation, and result calculation.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">AI Analysis Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Service for AI-powered analysis of system descriptions, capabilities, and 
                      potential impacts to assist with risk classification.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Gap Analysis Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Service for identifying compliance gaps based on assessment results and 
                      regulatory requirements.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Document Generation Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Service for generating compliance documentation based on assessment results 
                      and evidence.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Notification Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Service for managing notifications related to assessments, gaps, and deadlines.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Integration Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Service for integrating with other platform modules and external systems.
                    </p>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Integration Points</h3>
                <p className="text-muted-foreground mb-3">
                  The Risk Assessment Module integrates with other components of the platform:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li><span className="font-medium">AI Inventory Module:</span> Retrieves AI system details for assessment</li>
                  <li><span className="font-medium">Documentation Management:</span> Stores assessment documentation and evidence</li>
                  <li><span className="font-medium">Task Management:</span> Creates and tracks remediation actions</li>
                  <li><span className="font-medium">Training Module:</span> Links to relevant training for identified gaps</li>
                  <li><span className="font-medium">Compliance Reporting:</span> Provides data for compliance reports</li>
                  <li><span className="font-medium">Regulatory Updates:</span> Incorporates regulatory changes into assessment criteria</li>
                  <li><span className="font-medium">External AI Providers:</span> DeepSeek AI for enhanced analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Security Architecture</h3>
                <p className="text-muted-foreground mb-3">
                  The module implements comprehensive security measures:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Role-based access control for assessment data</li>
                  <li>Audit logging of all assessment activities</li>
                  <li>Encryption of assessment data at rest and in transit</li>
                  <li>Secure API endpoints with authentication and authorization</li>
                  <li>Data minimization and purpose limitation for AI analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Scalability Considerations</h3>
                <p className="text-muted-foreground mb-3">
                  The module is designed for scalability:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Microservices architecture for independent scaling of components</li>
                  <li>Asynchronous processing for resource-intensive operations</li>
                  <li>Caching mechanisms for frequently accessed data</li>
                  <li>Database sharding for large assessment repositories</li>
                  <li>Elastic infrastructure support for variable load handling</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Performance Optimization</h3>
                <p className="text-muted-foreground mb-3">
                  Performance optimizations include:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Progressive loading of assessment data</li>
                  <li>Background processing of AI analysis tasks</li>
                  <li>Caching of regulatory requirements and assessment templates</li>
                  <li>Optimized database queries with appropriate indexing</li>
                  <li>Lazy loading of assessment evidence and documentation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ux" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                User Experience Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Primary User Personas</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Compliance Officer</h4>
                    <p className="text-sm text-muted-foreground">
                      Responsible for ensuring organizational compliance with the EU AI Act. 
                      Needs comprehensive assessment tools and clear reporting.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">AI Project Manager</h4>
                    <p className="text-sm text-muted-foreground">
                      Oversees AI system development and implementation. Needs to integrate 
                      compliance requirements into project planning.
                    </p>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Risk Manager</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluates organizational risk exposure. Needs tools to assess and 
                      quantify compliance risks and mitigation effectiveness.
                    </p>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">User Journey Maps</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute h-full w-0.5 bg-muted-foreground/20 left-0"></div>
                    <div className="space-y-4 ml-6">
                      <div className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">1</div>
                        <div>
                          <h4 className="font-medium">Assessment Initiation</h4>
                          <p className="text-sm text-muted-foreground">
                            User selects an AI system from inventory and initiates the risk assessment process.
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">2</div>
                        <div>
                          <h4 className="font-medium">Prohibited Use Check</h4>
                          <p className="text-sm text-muted-foreground">
                            System is evaluated against prohibited use cases to ensure it doesn't violate Article 5.
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">3</div>
                        <div>
                          <h4 className="font-medium">Risk Classification</h4>
                          <p className="text-sm text-muted-foreground">
                            AI-assisted analysis determines the system's risk level under the EU AI Act.
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">4</div>
                        <div>
                          <h4 className="font-medium">Parameter Evaluation</h4>
                          <p className="text-sm text-muted-foreground">
                            User completes detailed assessment of system parameters and provides supporting evidence.
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">5</div>
                        <div>
                          <h4 className="font-medium">Gap Analysis</h4>
                          <p className="text-sm text-muted-foreground">
                            System analyzes compliance gaps based on assessment results and regulatory requirements.
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">6</div>
                        <div>
                          <h4 className="font-medium">Remediation Planning</h4>
                          <p className="text-sm text-muted-foreground">
                            User creates action plans to address identified compliance gaps.
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">7</div>
                        <div>
                          <h4 className="font-medium">Assessment Review</h4>
                          <p className="text-sm text-muted-foreground">
                            Stakeholders review and approve the assessment and remediation plans.
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">8</div>
                        <div>
                          <h4 className="font-medium">Documentation Generation</h4>
                          <p className="text-sm text-muted-foreground">
                            System generates comprehensive documentation for compliance evidence.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">UI/UX Design Specifications</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="design-system">
                    <AccordionTrigger>Design System and Principles</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        The Risk Assessment Module follows these design principles:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>Clarity and simplicity in presenting complex regulatory requirements</li>
                        <li>Guided user experience with step-by-step workflows</li>
                        <li>Visual representation of risk levels and compliance status</li>
                        <li>Consistent use of color, typography, and components</li>
                        <li>Accessible design meeting WCAG 2.1 AA standards</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="navigation">
                    <AccordionTrigger>Navigation and Information Architecture</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        The module's navigation structure includes:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>Dashboard view with assessment status and metrics</li>
                        <li>System list with risk level indicators</li>
                        <li>Assessment wizard with guided workflow</li>
                        <li>Detailed system view with compliance status</li>
                        <li>Remediation planning and tracking interface</li>
                        <li>Documentation repository and generator</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="dashboard">
                    <AccordionTrigger>Assessment Dashboard</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        The dashboard provides an overview of:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>Risk assessment status for all AI systems</li>
                        <li>Distribution of systems by risk level</li>
                        <li>Compliance gap metrics and trends</li>
                        <li>Upcoming assessment deadlines and reviews</li>
                        <li>Recent assessment activities and changes</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="wizard">
                    <AccordionTrigger>Assessment Wizard Interface</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        The assessment wizard guides users through:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>System identification and basic information</li>
                        <li>Prohibited use screening with clear explanations</li>
                        <li>Risk level classification with regulatory context</li>
                        <li>Detailed parameter evaluation with guidance</li>
                        <li>Evidence collection and documentation</li>
                        <li>Review and submission workflow</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="gap-analysis">
                    <AccordionTrigger>Gap Analysis Interface</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        The gap analysis interface provides:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>Visual representation of compliance status by requirement</li>
                        <li>Detailed description of each compliance gap</li>
                        <li>Regulatory context and citation for requirements</li>
                        <li>Severity and priority indicators for gaps</li>
                        <li>Links to guidance and best practices</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="mitigation">
                    <AccordionTrigger>Mitigation Planning Interface</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        The mitigation planning interface enables:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>Creation of action plans for each compliance gap</li>
                        <li>Assignment of responsibilities and deadlines</li>
                        <li>Progress tracking and status updates</li>
                        <li>Resource allocation and prioritization</li>
                        <li>Integration with task management systems</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="review">
                    <AccordionTrigger>Assessment Review Interface</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        The review interface provides:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>Comprehensive summary of assessment results</li>
                        <li>Compliance status visualization</li>
                        <li>Review and approval workflow</li>
                        <li>Comment and feedback mechanisms</li>
                        <li>Version comparison for reassessments</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCog className="h-5 w-5" />
                AI-Assisted Functionality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Classification Assistance</h3>
                <p className="text-muted-foreground mb-3">
                  The module leverages AI to assist with system classification:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Analyzing system descriptions to identify potential risk factors</li>
                  <li>Matching system characteristics to EU AI Act categories</li>
                  <li>Identifying relevant regulatory provisions and articles</li>
                  <li>Providing confidence scores for classification decisions</li>
                  <li>Explaining classification rationale with regulatory references</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Risk Parameter Evaluation</h3>
                <p className="text-muted-foreground mb-3">
                  AI enhances risk parameter evaluation by:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Suggesting parameter values based on system characteristics</li>
                  <li>Highlighting potential risk factors in system descriptions</li>
                  <li>Providing contextual guidance for parameter assessment</li>
                  <li>Identifying inconsistencies in parameter evaluations</li>
                  <li>Suggesting additional evidence requirements</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Gap Analysis Automation</h3>
                <p className="text-muted-foreground mb-3">
                  AI streamlines gap analysis through:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Automated mapping of system attributes to requirements</li>
                  <li>Analysis of documentation for compliance evidence</li>
                  <li>Identification of missing or incomplete documentation</li>
                  <li>Pattern recognition to identify common compliance gaps</li>
                  <li>Severity and priority scoring for identified gaps</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Mitigation Recommendation</h3>
                <p className="text-muted-foreground mb-3">
                  AI provides intelligent mitigation recommendations:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Suggesting specific actions to address compliance gaps</li>
                  <li>Prioritizing actions based on risk level and impact</li>
                  <li>Recommending best practices from similar systems</li>
                  <li>Estimating effort and resource requirements</li>
                  <li>Identifying potential implementation challenges</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Documentation Generation</h3>
                <p className="text-muted-foreground mb-3">
                  AI enhances documentation through:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Automated generation of assessment reports</li>
                  <li>Creation of structured documentation templates</li>
                  <li>Extraction of key information from assessment data</li>
                  <li>Consistency checking across documentation artifacts</li>
                  <li>Regulatory citation and reference management</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Regulatory Guidance Integration</h3>
                <p className="text-muted-foreground mb-3">
                  AI integrates regulatory guidance by:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Providing contextual regulatory information during assessment</li>
                  <li>Interpreting regulatory requirements for specific system types</li>
                  <li>Highlighting recent regulatory updates and changes</li>
                  <li>Suggesting relevant case studies and examples</li>
                  <li>Answering regulatory compliance questions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">AI Provider Integration Architecture</h3>
                <p className="text-muted-foreground mb-3">
                  The module integrates with AI providers through:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Secure API integration with DeepSeek AI</li>
                  <li>Fallback mechanisms using alternative providers</li>
                  <li>Prompt engineering for consistent responses</li>
                  <li>Response validation and quality control</li>
                  <li>Privacy-preserving data handling</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="functions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Core Functionality Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Assessment Initiation and Planning</h3>
                <p className="text-muted-foreground mb-3">
                  The module supports comprehensive assessment planning:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Selection of AI systems from inventory for assessment</li>
                  <li>Assessment scheduling and deadline management</li>
                  <li>Stakeholder identification and notification</li>
                  <li>Assessment scope definition and customization</li>
                  <li>Preliminary risk classification based on system attributes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Prohibited Use Assessment</h3>
                <p className="text-muted-foreground mb-3">
                  A critical first step in the assessment process:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Evaluation against Article 5 prohibited use cases</li>
                  <li>AI-assisted analysis of system purpose and capabilities</li>
                  <li>Identification of potential prohibited applications</li>
                  <li>Guidance for borderline cases and exceptions</li>
                  <li>Clear explanation of prohibited use determination</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">High-Risk Determination</h3>
                <p className="text-muted-foreground mb-3">
                  Comprehensive evaluation of high-risk status:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Assessment against Annex III high-risk categories</li>
                  <li>Evaluation of system purpose and application domain</li>
                  <li>Analysis of potential impact on rights and safety</li>
                  <li>Consideration of intended and foreseeable uses</li>
                  <li>Documentation of high-risk determination rationale</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Detailed Risk Parameter Evaluation</h3>
                <p className="text-muted-foreground mb-3">
                  In-depth assessment of system risk parameters:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Evaluation of technical robustness and safety</li>
                  <li>Assessment of data governance and quality</li>
                  <li>Analysis of transparency and explainability</li>
                  <li>Evaluation of human oversight mechanisms</li>
                  <li>Assessment of accuracy, performance, and security</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Evidence Collection and Management</h3>
                <p className="text-muted-foreground mb-3">
                  Comprehensive evidence management:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Document upload and management for compliance evidence</li>
                  <li>Structured evidence categorization by requirement</li>
                  <li>Evidence quality and completeness validation</li>
                  <li>Gap identification for missing evidence</li>
                  <li>Version control and audit trail for evidence</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Gap Analysis and Remediation Planning</h3>
                <p className="text-muted-foreground mb-3">
                  Comprehensive gap management:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Automated identification of compliance gaps</li>
                  <li>Severity and priority classification of gaps</li>
                  <li>Detailed gap descriptions with regulatory context</li>
                  <li>Remediation action planning and assignment</li>
                  <li>Deadline setting and progress tracking</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Assessment Review and Approval</h3>
                <p className="text-muted-foreground mb-3">
                  Structured review and governance:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Review workflow with stakeholder approval stages</li>
                  <li>Comment and feedback tracking</li>
                  <li>Assessment revision and version control</li>
                  <li>Approval documentation and audit trail</li>
                  <li>Final assessment report generation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Reassessment and Monitoring</h3>
                <p className="text-muted-foreground mb-3">
                  Ongoing compliance management:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Scheduled reassessment triggers and notifications</li>
                  <li>Change-based reassessment for system modifications</li>
                  <li>Regulatory update impact analysis</li>
                  <li>Continuous monitoring of high-risk systems</li>
                  <li>Compliance status dashboards and reporting</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Implementation Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Development Approach</h3>
                <p className="text-muted-foreground mb-3">
                  The module implementation follows these approaches:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Iterative development with regular stakeholder feedback</li>
                  <li>Component-based architecture for modularity</li>
                  <li>Test-driven development for quality assurance</li>
                  <li>Continuous integration and deployment pipeline</li>
                  <li>Regulatory compliance verification throughout development</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Technology Stack Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Frontend</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                      <li>React with TypeScript for UI components</li>
                      <li>Shadcn UI for design system components</li>
                      <li>React Query for data fetching and caching</li>
                      <li>React Hook Form for form management</li>
                      <li>React Router for navigation</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="font-medium mb-2">Backend</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                      <li>Node.js with Express for API endpoints</li>
                      <li>TypeScript for type safety</li>
                      <li>Integrations with DeepSeek and Gemini AI APIs</li>
                      <li>PostgreSQL for relational data storage</li>
                      <li>Redis for caching and session management</li>
                    </ul>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">API Specifications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border px-4 py-2 text-left">Endpoint</th>
                        <th className="border px-4 py-2 text-left">Method</th>
                        <th className="border px-4 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">/api/risk-assessment/:systemId</td>
                        <td className="border px-4 py-2">GET</td>
                        <td className="border px-4 py-2">Retrieve system risk assessment results</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">/api/risk-assessment/:systemId/prohibited</td>
                        <td className="border px-4 py-2">GET</td>
                        <td className="border px-4 py-2">Check system for prohibited use cases</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">/api/risk-assessment/:systemId/report</td>
                        <td className="border px-4 py-2">GET</td>
                        <td className="border px-4 py-2">Generate comprehensive risk assessment report</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">/api/risk-assessment/:systemId/gaps</td>
                        <td className="border px-4 py-2">GET</td>
                        <td className="border px-4 py-2">Analyze system compliance gaps</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Testing Strategy</h3>
                <p className="text-muted-foreground mb-3">
                  The comprehensive testing approach includes:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Unit testing for individual components and services</li>
                  <li>Integration testing for service interactions</li>
                  <li>End-to-end testing for user workflows</li>
                  <li>Performance testing for scalability validation</li>
                  <li>Security testing for vulnerability assessment</li>
                  <li>Regulatory compliance testing with expert review</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Performance Benchmarks</h3>
                <p className="text-muted-foreground mb-3">
                  The module is designed to meet these performance targets:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Assessment initiation response time: &lt; 2 seconds</li>
                  <li>AI analysis completion time: &lt; 10 seconds</li>
                  <li>Page load times: &lt; 1.5 seconds</li>
                  <li>Report generation time: &lt; 5 seconds</li>
                  <li>Concurrent user support: 500+ users</li>
                  <li>Assessment storage capacity: 10,000+ assessments</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4 border">
              <h4 className="font-medium mb-2">EU AI Act Full Text</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The complete legal text of the EU AI Act regulation.
              </p>
              <Badge variant="outline" className="text-xs">External Resource</Badge>
            </Card>
            
            <Card className="p-4 border">
              <h4 className="font-medium mb-2">Implementation Guide</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Detailed guide for implementing the Risk Assessment Module.
              </p>
              <Badge variant="outline" className="text-xs">Internal Document</Badge>
            </Card>
            
            <Card className="p-4 border">
              <h4 className="font-medium mb-2">API Documentation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Technical documentation for the Risk Assessment Module APIs.
              </p>
              <Badge variant="outline" className="text-xs">Developer Resource</Badge>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentDocumentation;
