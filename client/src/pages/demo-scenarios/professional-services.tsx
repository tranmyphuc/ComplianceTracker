import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Briefcase, Users, Code, Book, FileSpreadsheet, Laptop, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AIJack } from '@/components/onboarding/ai-jack';

const ProfessionalServicesScenario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  // AI Jack message content based on current tab
  const getJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "SGH Service needs to ensure its AI tools for consultancy, document management, and business process optimization comply with the EU AI Act while maintaining productivity and competitive edge.";
      case 'challenges':
        return "This professional services firm faces unique compliance challenges including balancing innovation with regulatory requirements, client data protection across projects, and addressing varied AI systems used in different business functions.";
      case 'solution':
        return "Our solution provides SGH Service with a comprehensive approach to compliance that integrates with existing workflows and tools like Odoo AI, ChatGPT, GitHub Copilot, and their document analysis systems.";
      case 'features':
        return "Key features for professional services include automated documentation of AI usage across tools, prompt engineering guidance for compliant generative AI usage, and client data protection impact assessments.";
      case 'outcomes':
        return "By implementing our solution, SGH Service achieved full EU AI Act compliance while maintaining productivity, enhancing client trust, and establishing a competitive advantage as an AI-compliant service provider.";
      default:
        return "Welcome to the SGH Service case study. This professional services firm needed to comply with the EU AI Act for their AI tools used in consultancy, document management, and business process optimization.";
    }
  };
  
  // German translations for AI Jack
  const getGermanJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "SGH Service muss sicherstellen, dass ihre KI-Tools für Beratung, Dokumentenmanagement und Geschäftsprozessoptimierung dem EU AI Act entsprechen und gleichzeitig Produktivität und Wettbewerbsvorteil erhalten.";
      case 'challenges':
        return "Diese Beratungsfirma steht vor einzigartigen Compliance-Herausforderungen, darunter die Balance zwischen Innovation und regulatorischen Anforderungen, Kundendatenschutz über Projekte hinweg und die Berücksichtigung verschiedener KI-Systeme in unterschiedlichen Geschäftsbereichen.";
      case 'solution':
        return "Unsere Lösung bietet SGH Service einen umfassenden Ansatz für Compliance, der sich in bestehende Workflows und Tools wie Odoo AI, ChatGPT, GitHub Copilot und ihre Dokumentenanalysesysteme integriert.";
      case 'features':
        return "Zu den wichtigsten Funktionen für Beratungsunternehmen gehören die automatisierte Dokumentation der KI-Nutzung über alle Tools hinweg, Anleitungen für Prompt-Engineering für konforme generative KI-Nutzung und Folgenabschätzungen zum Kundendatenschutz.";
      case 'outcomes':
        return "Durch die Implementierung unserer Lösung erreichte SGH Service die vollständige Einhaltung des EU AI Acts bei gleichzeitiger Aufrechterhaltung der Produktivität, Stärkung des Kundenvertrauens und Etablierung eines Wettbewerbsvorteils als KI-konformer Dienstleister.";
      default:
        return "Willkommen zur SGH Service Fallstudie. Diese Beratungsfirma musste den EU AI Act für ihre KI-Tools einhalten, die in Beratung, Dokumentenmanagement und Geschäftsprozessoptimierung eingesetzt werden.";
    }
  };
  
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
          <span className="text-muted-foreground">Professional Services | Medium (250-999 employees) | European</span>
        </div>
      </div>
      
      {/* AI Jack - Multilingual Guide */}
      <div className="my-6">
        <AIJack
          mood="explaining"
          message={getJackMessage()}
          germanMessage={getGermanJackMessage()}
          animate={true}
          size="md"
          language={language}
          allowLanguageSwitch={true}
          onLanguageChange={(lang) => setLanguage(lang)}
        />
      </div>
      
      <Tabs 
        defaultValue="profile" 
        className="mt-6"
        onValueChange={(value) => setCurrentTab(value)}
      >
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
                <p>SGH Service is a growing European professional services firm specializing in management consulting, digital transformation, and business process optimization. With 450 employees across offices in 5 European countries, the company serves clients in a wide range of industries including finance, healthcare, manufacturing, and retail. SGH's consultants leverage various AI tools and platforms to enhance their service delivery, improve efficiency, and provide data-driven insights to clients.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Odoo AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An integrated AI system within SGH's Odoo ERP platform that assists with business process management, task automation, and customer relationship management. The system helps consultants automate repetitive tasks, prioritize customer interactions, and generate initial drafts of reports and proposals based on project data and client requirements.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Business Process System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">ChatGPT Integration</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A custom integration of OpenAI's ChatGPT into SGH's workflow tools, used by consultants for research assistance, content generation, data analysis interpretation, and client communication drafting. The system is widely used across the organization to enhance consultant productivity and provide rapid insights based on complex business scenarios.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Generative AI System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">GitHub Copilot</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-powered code completion tool used by SGH's technology consultants and internal development team to accelerate software development, prototype solutions for clients, and implement digital transformation initiatives. The system increases coding efficiency and helps standardize development practices across the organization.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low Risk (Article 6)</Badge>
                      <Badge variant="outline">Developer Productivity Tool</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Document Analysis AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A machine learning system that processes client documentation to extract key information, identify patterns, and generate insights for consultants. The system handles various document types including financial statements, contracts, operational reports, and market research, helping consultants quickly analyze large volumes of information and identify critical business factors.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Document Processing System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>As a professional services firm using AI tools for client work and internal operations, SGH Service has varied exposure under the EU AI Act. While none of their AI systems fall into the highest risk categories, several are classified as medium risk under Article 6 due to their processing of client data, potential impact on business decisions, and use in professional services contexts. The firm must navigate compliance requirements while maintaining the productivity benefits these AI tools provide to their consultants and ensuring proper governance of AI systems used across various client engagements and internal processes.</p>
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
                <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Balancing Innovation and Compliance</AlertTitle>
                  <AlertDescription>
                    Maintaining competitive advantage while ensuring compliance across varied AI tools and use cases
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Client Data Protection</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring proper governance of sensitive client information processed by AI systems across multiple engagements and industries with varying data protection requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Generative AI Governance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Establishing appropriate controls and policies for consultant use of generative AI tools like ChatGPT while maintaining productivity and creative problem-solving capabilities.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Decentralized AI Usage</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tracking and managing AI usage across different business units, consultant teams, and client projects with varying requirements and technologies.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Third-Party AI Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring compliance when utilizing third-party AI services (OpenAI, GitHub Copilot) where SGH has limited control over the underlying models and processing.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Documentation Burden</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Managing the documentation requirements for multiple AI systems used across the organization without creating excessive administrative overhead for consultants.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Client Expectations</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Meeting increasingly sophisticated client requirements for AI governance and transparency in consulting deliverables that leverage AI technologies.
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
                        <h4 className="font-medium">Professional Services AI Assessment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive assessment of all AI tools used across the organization, mapping their applications, data flows, and risk levels according to EU AI Act criteria specifically tailored for professional services.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Integrated AI Governance Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed an AI governance framework that integrates with SGH's existing project management methodologies and tools, enabling compliance to be embedded within normal workflows rather than creating separate processes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Generative AI Usage Guidelines</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created comprehensive guidelines for compliant use of generative AI tools including prompt engineering best practices, data handling procedures, and appropriate use cases that maintain both compliance and productivity.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Client Data Protection Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a client data protection framework specifically designed for AI processing, with appropriate controls, anonymization techniques, and governance procedures aligned with both EU AI Act and GDPR requirements.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Automated Documentation System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Deployed an automated documentation system that tracks AI usage across tools and projects, minimizing administrative burden while maintaining complete records for compliance purposes and client transparency.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-5 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Key Technologies Implemented</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Bot className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">AI Inventory Management</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Centralized tracking system for all AI tools and usage across the organization with automated discovery and categorization features.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Code className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Prompt Engineering Guardian</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Real-time guidance and guardrails for generative AI interactions to prevent data leakage and ensure compliant usage patterns.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Documentation Automation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Lightweight integration with existing tools to automatically capture AI usage metadata without disrupting consultant workflows.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Client Transparency Portal</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Client-facing interface for transparent disclosure of AI usage in deliverables, building trust and demonstrating compliance leadership.
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
              <CardDescription>Specialized compliance capabilities for professional services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Multi-Tool AI Governance</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Unified governance framework that spans all AI tools used in the organization, from Odoo AI to ChatGPT to document analysis systems.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Centralized inventory of AI systems with usage tracking</li>
                        <li>Risk classification aligned with EU AI Act categories</li>
                        <li>Automated compliance monitoring across tools</li>
                        <li>Standardized assessment criteria for new AI tools</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Laptop className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Consultant-Centric Compliance</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Compliance solutions designed to minimize friction and administrative burden for busy consultants while maintaining regulatory adherence.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Workflow-integrated compliance checkpoints</li>
                        <li>Automated metadata capture during normal usage</li>
                        <li>Smart templates for required documentation</li>
                        <li>Minimal-click compliance verification</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Generative AI Compliance</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Specialized tools for ensuring compliant use of generative AI systems in professional services contexts.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Prompt engineering guidance and guardrails</li>
                        <li>Output validation and verification</li>
                        <li>Data protection scanning for prompts</li>
                        <li>Attribution and transparency for generated content</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Client Project Compliance</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Project-specific compliance tools that adapt to different client requirements and industry regulations.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Client-specific data handling configurations</li>
                        <li>Industry-specific compliance templates</li>
                        <li>Project-level AI usage dashboards</li>
                        <li>Deliverable transparency documentation</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Professional Services AI Compliance Dashboard</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our specialized dashboard provides SGH Service with real-time visibility into AI usage, compliance status, and governance metrics across their organization.
                  </p>
                  <div className="bg-card shadow-sm rounded-md p-4 grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">AI Systems</div>
                      <div className="text-2xl font-semibold">4</div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">100% Compliant</Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Compliance Score</div>
                      <div className="text-2xl font-semibold">97%</div>
                      <div className="flex items-center text-xs text-emerald-600">
                        <BarChart4 className="h-3 w-3 mr-1" /> Up 12% from baseline
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Documentation Coverage</div>
                      <div className="text-2xl font-semibold">99%</div>
                      <div className="flex items-center text-xs text-emerald-600">
                        <FileCheck className="h-3 w-3 mr-1" /> Fully automated
                      </div>
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
              <CardTitle>Outcomes</CardTitle>
              <CardDescription>Results achieved through EU AI Act compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert className="bg-emerald-50 border-emerald-200">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <AlertTitle className="text-emerald-800">Complete Compliance Achievement</AlertTitle>
                  <AlertDescription className="text-emerald-700">
                    SGH Service achieved full EU AI Act compliance across all their AI systems while maintaining productivity
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      Compliance Metrics
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">100% documentation coverage</span> across all AI systems with 85% reduction in manual documentation effort</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">97% compliance score</span> measured against comprehensive EU AI Act requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">Zero compliance gaps</span> identified in external audit of AI practices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">15 minutes average</span> for new AI tools to be onboarded to compliance framework</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Business Impact
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">22% increase</span> in consultant productivity through continued use of AI tools with compliance guardrails</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">15 new clients acquired</span> specifically citing SGH's AI compliance leadership as a differentiator</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">31% reduced risk exposure</span> from proper governance of AI systems across client engagements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">New service line launched</span> for helping clients achieve their own EU AI Act compliance</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <Separator />
                
                <div className="rounded-lg border p-5">
                  <h3 className="font-semibold text-lg mb-5">Client Testimonial</h3>
                  <div className="flex flex-col gap-4">
                    <div className="bg-card shadow-sm rounded p-4">
                      <p className="italic text-muted-foreground mb-3">
                        "Our compliance journey with the EU AI Act could have been a major productivity drain for our consultants who rely on AI tools every day. Instead, this solution allowed us to achieve full compliance with minimal disruption, and even improved our workflows. We've transformed compliance from a potential business obstacle into a competitive advantage that our clients recognize and value."
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="font-medium">Dr. Miriam Hauser</div>
                        <div className="text-muted-foreground text-sm">Chief Digital Officer, SGH Service</div>
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

export default ProfessionalServicesScenario;