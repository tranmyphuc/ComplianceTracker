import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Factory, Wrench, Camera, LineChart, ActivitySquare, Database, Brain, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AIJack } from '@/components/onboarding/ai-jack';

const ManufacturingScenario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  
  // AI Jack message content based on current tab
  const getJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "SmartFactory GmbH operates multiple medium-risk AI systems that require careful compliance measures under the EU AI Act. They need a comprehensive compliance strategy that integrates with their existing industrial standards.";
      case 'challenges':
        return "As both a user and provider of AI systems, SmartFactory faces unique dual-role compliance challenges and must ensure their systems meet safety requirements in critical environments.";
      case 'solution':
        return "Our solution provides SmartFactory with a comprehensive compliance approach including manufacturing-specific AI inventory, dual-role compliance strategy, and integrated risk assessment frameworks.";
      case 'features':
        return "Key features for manufacturing include industrial-specific risk evaluation, technical documentation templates, and real-time compliance monitoring across multiple production facilities.";
      case 'outcomes':
        return "By implementing our solution, SmartFactory achieved full EU AI Act compliance while reducing documentation effort by 60% and ensuring seamless integration with existing safety standards.";
      default:
        return "Welcome to the SmartFactory GmbH case study. This manufacturer needed to comply with the EU AI Act for their medium-risk predictive maintenance AI systems.";
    }
  };
  
  // German translations for AI Jack
  const getGermanJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "SmartFactory GmbH betreibt mehrere KI-Systeme mit mittlerem Risiko, die sorgfältige Compliance-Maßnahmen gemäß dem EU AI Act erfordern. Sie benötigen eine umfassende Compliance-Strategie, die sich in ihre bestehenden Industriestandards integriert.";
      case 'challenges':
        return "Als Nutzer und Anbieter von KI-Systemen steht SmartFactory vor einzigartigen Compliance-Herausforderungen und muss sicherstellen, dass ihre Systeme die Sicherheitsanforderungen in kritischen Umgebungen erfüllen.";
      case 'solution':
        return "Unsere Lösung bietet SmartFactory einen umfassenden Compliance-Ansatz, einschließlich fertigungsspezifischem KI-Inventar, Dual-Role-Compliance-Strategie und integrierten Risikobewertungsrahmen.";
      case 'features':
        return "Zu den wichtigsten Funktionen für die Fertigung gehören industriespezifische Risikobewertung, technische Dokumentationsvorlagen und Echtzeit-Compliance-Überwachung über mehrere Produktionsstätten hinweg.";
      case 'outcomes':
        return "Durch die Implementierung unserer Lösung erreichte SmartFactory die vollständige Einhaltung des EU AI Act, reduzierte den Dokumentationsaufwand um 60% und gewährleistete eine nahtlose Integration mit bestehenden Sicherheitsstandards.";
      default:
        return "Willkommen zur SmartFactory GmbH Fallstudie. Dieser Hersteller musste den EU AI Act für seine KI-Systeme zur vorausschauenden Wartung mit mittlerem Risiko einhalten.";
    }
  };
  
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Manufacturing</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">SmartFactory GmbH</h1>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">Medium Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Manufacturing | Medium (250-999 employees) | Germany</span>
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
      
      <Tabs defaultValue="profile" className="mt-6" onValueChange={(value) => setCurrentTab(value)}>
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
              <CardDescription>Background information on SmartFactory GmbH</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>SmartFactory GmbH is a German industrial equipment manufacturer specializing in precision machinery and automation solutions for the automotive, aerospace, and electronics industries. Founded in 1982 in Stuttgart, the company employs approximately 650 people across three manufacturing facilities in Germany. As a leader in Industry 4.0 implementation, SmartFactory has been progressively incorporating AI technologies into its production processes and product offerings.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Predictive Maintenance System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An advanced machine learning system that monitors equipment sensor data to predict potential failures before they occur. The system analyzes vibration patterns, temperature fluctuations, acoustic signatures, and operational parameters from hundreds of sensors across the production line. It generates maintenance alerts and recommendations to prevent unplanned downtime and optimize maintenance scheduling.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Industrial Safety System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Quality Control Vision System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A computer vision AI system that inspects manufactured components for defects with superhuman precision. Using multiple high-resolution cameras and deep learning algorithms, the system can detect microscopic flaws, dimensional irregularities, and surface imperfections that might be missed by human inspectors. The system makes accept/reject decisions in real-time and classifies defect types.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Quality Assurance System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Production Optimization AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A reinforcement learning system that continuously analyzes production data to optimize manufacturing parameters and workflows. The system adjusts machine settings, production schedules, and resource allocation in real-time to maximize output quality, minimize energy consumption, and reduce waste. It learns from outcomes and continuously improves its recommendations.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Process Optimization System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>SmartFactory's AI systems fall primarily into the medium-risk category under the EU AI Act, with potential elevation to high-risk classification depending on specific applications within safety-critical environments. The systems require comprehensive technical documentation, risk assessments, and ongoing compliance monitoring. Additionally, as SmartFactory sells these AI-enhanced production systems to other manufacturers, they must ensure their customers can maintain compliance with the EU AI Act when deploying these technologies.</p>
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
                  <AlertTitle>Complex Risk Assessment</AlertTitle>
                  <AlertDescription>
                    Determining exact risk levels for AI systems that operate in various contexts with different potential impacts
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Dual Role Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Managing compliance both as a user of AI systems in their own operations and as a provider of AI-enhanced equipment to other companies.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Safety-Critical Applications</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring AI systems meet heightened safety requirements when deployed in environments where failures could have serious consequences.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Technical Documentation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Creating and maintaining comprehensive technical documentation for complex industrial AI systems with numerous components and integrations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Continuous Monitoring</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implementing effective monitoring of AI system performance and compliance across multiple production facilities and customer deployments.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Integration with Existing Standards</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Harmonizing EU AI Act requirements with existing industrial standards (ISO, IEC) and machinery safety regulations already in place.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Knowledge and Expertise Gap</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Limited internal expertise in AI regulation and compliance, despite strong technical knowledge of manufacturing systems.
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
              <CardDescription>How our platform addresses SmartFactory's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">Manufacturing-Specific AI Inventory</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive inventory of all AI systems used in production processes and embedded in products, with detailed mapping of their functionalities, data inputs, and potential impacts.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Dual-Role Compliance Strategy</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a differentiated compliance approach addressing SmartFactory's responsibilities both as an AI user in their own facilities and as a provider of AI-enhanced equipment to customers.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Integrated Risk Assessment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a risk assessment methodology that integrates EU AI Act requirements with existing ISO machinery safety standards and industry-specific risk frameworks.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Technical Documentation System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created standardized documentation templates and processes specifically designed for industrial AI systems, including testing protocols, validation methodologies, and performance metrics.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Compliance Monitoring Platform</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Deployed an automated monitoring system that tracks AI performance, data quality, and drift metrics across all production lines, with alerts for potential compliance issues.
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
                        <h4 className="font-medium">Customer Compliance Package</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed comprehensive EU AI Act compliance documentation packages that SmartFactory can provide to customers purchasing their AI-enhanced equipment.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Safety-Critical Validation Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented rigorous validation protocols for AI systems operating in safety-critical environments, with scenario-based testing and failure mode analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Standards Harmonization</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a unified compliance approach that maps EU AI Act requirements to existing industrial standards, avoiding duplication of compliance efforts.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Training and Knowledge Transfer</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted specialized training for engineering, quality, and compliance teams on EU AI Act requirements specific to manufacturing contexts.
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
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="h-5 w-5 text-primary" />
                  <CardTitle>Manufacturing AI Governance</CardTitle>
                </div>
                <CardDescription>Specialized compliance for industrial AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Industry-specific risk assessment templates for predictive maintenance, quality control, and optimization systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Integrated compliance framework linking EU AI Act with ISO 9001, ISO/TS 16949, and machinery safety standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Dual-role compliance management for both internal AI use and AI systems provided to customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Industry 4.0 governance models with clear roles and responsibilities for AI oversight</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  <CardTitle>Maintenance AI Compliance</CardTitle>
                </div>
                <CardDescription>Ensuring predictive maintenance system compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Reliability and accuracy metrics specifically designed for predictive maintenance applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>False positive/negative analysis tools with safety impact evaluation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Human oversight mechanisms designed for maintenance workflows and critical alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Documentation templates for sensor data quality management and system monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <CardTitle>Vision System Compliance</CardTitle>
                </div>
                <CardDescription>Quality control vision system compliance tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Computer vision bias detection and validation methodologies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Lighting and environmental condition impact assessment on system reliability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Edge case testing frameworks for quality control applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Visual explainability tools for quality control decisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <CardTitle>Optimization AI Compliance</CardTitle>
                </div>
                <CardDescription>Ensuring production optimization system compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Reinforcement learning system monitoring and safety boundary enforcement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Production parameter change tracking with compliance audit trails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Energy efficiency and sustainability impact assessment tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Human override mechanisms and intervention effectiveness tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <ActivitySquare className="h-5 w-5 text-primary" />
                  <CardTitle>Continuous Monitoring</CardTitle>
                </div>
                <CardDescription>Real-time compliance and performance monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Manufacturing-specific performance metrics with compliance thresholds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Model drift detection for industrial applications and environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Automated risk threshold alerting with escalation protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Multi-site monitoring with centralized compliance dashboard</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>Customer Compliance Support</CardTitle>
                </div>
                <CardDescription>Tools for supporting customer compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Comprehensive EU AI Act compliance packages for customer deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Implementation guidelines for maintaining compliance in various operational contexts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Remote monitoring options for ongoing compliance support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Customer training materials and compliance management guidance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="outcomes" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Outcomes</CardTitle>
              <CardDescription>Measurable results and business impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">AI systems fully documented and assessed according to EU AI Act standards</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">37%</div>
                  <p className="text-sm text-muted-foreground">Increase in customer confidence due to comprehensive compliance packages</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">68%</div>
                  <p className="text-sm text-muted-foreground">Reduction in time spent on compliance activities through automation and standardization</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Key Compliance Achievements</h3>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-green-100 text-green-800 rounded-full p-1">
                      <BarChart4 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Streamlined Multi-Standard Compliance</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Successfully integrated EU AI Act requirements with existing ISO standards and machinery safety regulations, creating a unified compliance framework that reduced documentation overlap by 58% and simplified compliance management.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-green-100 text-green-800 rounded-full p-1">
                      <BarChart4 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Enhanced Risk Management</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implemented a comprehensive risk assessment framework specifically for manufacturing AI applications, resulting in identification and mitigation of 14 previously unrecognized risk factors across production systems.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-green-100 text-green-800 rounded-full p-1">
                      <BarChart4 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Competitive Advantage</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Developed comprehensive customer compliance packages that differentiated SmartFactory in the market, resulting in a 23% increase in new equipment sales as customers valued pre-established EU AI Act compliance documentation.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-green-100 text-green-800 rounded-full p-1">
                      <BarChart4 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Compliance Monitoring Automation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Established automated monitoring of AI systems across three manufacturing facilities, reducing compliance management workload by 68% while improving detection of potential compliance issues by 42%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Business Impact</h3>
                <p className="mb-4">
                  Beyond compliance, SmartFactory realized significant business benefits from the EU AI Act implementation:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Enhanced Product Quality:</strong> The implementation of compliance monitoring for the vision system improved defect detection accuracy by 18%, reducing customer returns by 27%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Increased Operational Efficiency:</strong> The more robust predictive maintenance system reduced unplanned downtime by 32% and extended machine lifespan by approximately 15%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Improved Innovation Process:</strong> The standardized compliance framework has accelerated new AI feature deployment by providing clear guidelines for development and testing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Market Differentiation:</strong> SmartFactory now markets their equipment as "EU AI Act Compliant Ready," creating a competitive advantage in the European manufacturing equipment market.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturingScenario;