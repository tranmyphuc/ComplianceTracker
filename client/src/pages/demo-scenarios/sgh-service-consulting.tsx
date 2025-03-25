import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, CheckCircle2, Code, Terminal, Bot, FileSearch } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';

const SGHServiceScenario: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Professional Services</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">SGH Service</h1>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">Medium Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Professional Services | Medium (250-999 employees) | Multiple EU Countries</span>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="profile">Client Profile</TabsTrigger>
          <TabsTrigger value="challenges">Compliance Challenges</TabsTrigger>
          <TabsTrigger value="solution">Solution Walkthrough</TabsTrigger>
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Profile</CardTitle>
              <CardDescription>Background information on SGH Service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>SGH Service (https://sgh-service.com/en/) is a comprehensive professional services firm operating across multiple European countries. With approximately 500 employees, the company specializes in technical service management, SAP consulting, enterprise resource planning, and digital transformation for clients in manufacturing, logistics, and healthcare industries. Founded in 1978 and headquartered in Vienna, Austria, they have established a reputation for technical excellence and innovative service solutions.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Odoo AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      SGH Service has integrated Odoo AI into their enterprise resource planning (ERP) stack to automate service management workflows, enhance customer relationship management through predictive analytics, and optimize operational efficiency for their technical consulting services. The AI components analyze client service patterns, predict maintenance needs, and automate administrative tasks.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Business Process System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">ChatGPT Integration</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      SGH Service has implemented ChatGPT (GPT-4) through the Azure OpenAI Service to enhance their consulting operations. The system is used for summarizing technical service documentation, generating preliminary service reports, assisting with client communications, and providing initial consulting recommendations based on input parameters. They've built custom prompts and implemented guardrails to ensure quality and accuracy.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">General Purpose AI System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">GitHub Copilot</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      SGH Service has deployed GitHub Copilot across their development teams to enhance productivity when creating custom client-facing applications, ERP customizations, and internal automation tools. The AI code assistant is used for accelerating development of Odoo modules, implementing custom API integrations, and building technical service management tools. The team has established usage guidelines that govern appropriate use cases and documentation practices.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Limited Risk (Article 6)</Badge>
                      <Badge variant="outline">Development Tool</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Document Analysis AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      SGH Service has developed a proprietary document analysis system that specializes in technical documentation processing for their service management operations. The system analyzes service contracts, equipment documentation, maintenance records, and client requirements to extract key information, identify process inefficiencies, and generate optimization recommendations. Built on a combination of Azure's Document Intelligence and custom-trained ML models, it helps consultants quickly digest large volumes of technical documentation.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Document Analysis System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>As a professional services firm using AI tools for client work and business processes, SGH Service needs to ensure compliance with the EU AI Act. Their systems span multiple risk levels, with most falling into the limited to medium risk categories, requiring transparency, documentation, and risk management measures.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="challenges" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Challenges</CardTitle>
              <CardDescription>Key pain points and regulatory challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Complex Regulatory Landscape</AlertTitle>
                  <AlertDescription>
                    Navigating multiple AI systems across different risk classifications with varied compliance requirements
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Third-Party AI Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Difficulty determining compliance responsibilities when using third-party AI tools like ChatGPT and GitHub Copilot that are integrated into business processes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Client Data Handling</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Concerns about processing sensitive client data through AI systems while maintaining compliance with both AI Act and GDPR requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Documentation Requirements</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Maintaining comprehensive documentation for multiple AI systems with different risk profiles and use cases.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Transparency Obligations</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Meeting transparency requirements when AI systems are used for client-facing services and advice generation.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Risk Assessment Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducting comprehensive risk assessments for diverse AI applications used across different business functions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Compliance Resource Constraints</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Limited internal expertise and resources dedicated to AI compliance initiatives across multiple countries of operation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="solution" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solution Walkthrough</CardTitle>
              <CardDescription>How our platform addresses SGH Service's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">AI Systems Inventory & Classification</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a comprehensive inventory of all AI systems used at SGH Service, including third-party tools, classifying each according to EU AI Act risk categories.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Risk Assessment Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a tailored risk assessment methodology for professional services AI applications, with special focus on client data processing and advice generation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Third-Party AI Compliance Management</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established a framework for managing compliance when using third-party AI tools, including vendor assessment templates and usage policies.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Documentation & Transparency System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created standardized documentation templates for each AI system, along with client disclosure documents for AI-assisted services.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Compliance Monitoring & Update System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented ongoing monitoring protocols to track regulatory changes, system performance, and compliance status across all AI applications.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Dual Compliance Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Integrated EU AI Act compliance with existing GDPR compliance measures to create a unified data and AI governance framework.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Client Communication Tools</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed client-facing disclosure templates and communication guides for transparent disclosure of AI usage in service delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Staff Training Program</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a comprehensive training program for employees on compliant use of AI tools, especially when handling client data and generating client advice.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Compliance Responsibility Matrix</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a clear responsibility matrix for AI compliance across departments, with designated compliance champions in each business unit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>Platform capabilities showcased during the demonstration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <FileSearch className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Third-Party AI Evaluation Framework</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Specialized tools for assessing and documenting third-party AI systems like Odoo AI, ChatGPT, and GitHub Copilot for compliance purposes.
                      </p>
                      <div className="mt-3">
                        <Badge variant="outline" className="bg-primary/10">Demo Highlight</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Client Data Processing Documentation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Templates and tools for documenting AI systems that process client data, integrating both GDPR and EU AI Act requirements.
                      </p>
                      <div className="mt-3">
                        <Badge variant="outline" className="bg-primary/10">Demo Highlight</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI Usage Transparency Tools</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Client disclosure templates and frameworks for transparent communication about AI usage in professional services delivery.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Multi-System Compliance Dashboard</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Centralized dashboard for monitoring compliance status across all AI systems with different risk classifications.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Developer Compliance Tools</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Guidelines and documentation templates for development teams using AI coding assistants like GitHub Copilot.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <Terminal className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI Integration Audit Tools</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tools for auditing the integration points between third-party AI systems and internal processes to ensure compliant data flows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outcomes" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outcomes & Results</CardTitle>
              <CardDescription>Measurable benefits achieved for SGH Service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-primary">85%</h4>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-primary">70%</h4>
                    <p className="text-sm text-muted-foreground">Time Savings</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-primary">100%</h4>
                    <p className="text-sm text-muted-foreground">Systems Documented</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-primary">€1.2M</h4>
                    <p className="text-sm text-muted-foreground">Est. Cost Savings</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">Key Business Impact</h4>
                      <p className="text-sm text-green-700 mt-1">
                        SGH Service successfully achieved EU AI Act compliance for all their AI systems while maintaining their competitive advantage in using cutting-edge AI tools. The compliance framework allowed them to confidently expand their AI usage for client services with transparent disclosure and proper risk management.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Specific Results</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Compliant AI Integration</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Successfully integrated third-party AI tools like Odoo AI, ChatGPT, and GitHub Copilot with proper compliance documentation and safeguards.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Client Trust Enhancement</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Increased client trust through transparent communication about AI usage in service delivery with proper disclosures.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Unified Compliance Framework</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Created an integrated compliance framework that addresses both EU AI Act and GDPR requirements for AI systems.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Staff Competency Increase</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            100% of client-facing staff completed AI compliance training, enabling informed discussions with clients about AI usage.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Scalable Compliance Infrastructure</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Established a scalable compliance infrastructure that can accommodate new AI tools and systems as they're adopted.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Competitive Differentiation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Leveraged EU AI Act compliance as a competitive advantage in client proposals and marketing materials.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SGHServiceScenario;