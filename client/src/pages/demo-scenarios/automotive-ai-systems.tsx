import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Car, Shield, Cpu, Activity, LineChart, BookCheck, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AIJack } from '@/components/onboarding/ai-jack';

const AutomotiveScenario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  // AI Jack message content based on current tab
  const getJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "Mercedes-Benz must ensure its high-risk AI systems for advanced driver assistance, autonomous driving, and vehicle health monitoring comply with the EU AI Act to maintain their leadership position in automotive safety.";
      case 'challenges':
        return "As a global automotive manufacturer, Mercedes-Benz faces complex compliance challenges including safety-critical systems, cross-jurisdictional requirements, and the need to balance innovation with stringent regulatory standards.";
      case 'solution':
        return "Our solution provides Mercedes-Benz with specialized automotive AI compliance including safety assurance frameworks, comprehensive testing protocols, and integration with existing automotive safety standards.";
      case 'features':
        return "Key features for automotive manufacturers include safety-critical AI validation tools, real-time monitoring systems for deployed AI, and comprehensive technical documentation automation tailored to vehicle systems.";
      case 'outcomes':
        return "By implementing our solution, Mercedes-Benz achieved full EU AI Act compliance while accelerating their innovation timeline by 35% and strengthening their reputation for safety leadership.";
      default:
        return "Welcome to the Mercedes-Benz case study. This global automotive leader needed to comply with the EU AI Act for their high-risk AI systems in advanced driver assistance, autonomous driving, and vehicle monitoring.";
    }
  };
  
  // German translations for AI Jack
  const getGermanJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "Mercedes-Benz muss sicherstellen, dass seine KI-Systeme mit hohem Risiko für fortschrittliche Fahrerassistenz, autonomes Fahren und Fahrzeugzustandsüberwachung dem EU AI Act entsprechen, um ihre Führungsposition in der Fahrzeugsicherheit zu behalten.";
      case 'challenges':
        return "Als globaler Automobilhersteller steht Mercedes-Benz vor komplexen Compliance-Herausforderungen, darunter sicherheitskritische Systeme, grenzüberschreitende Anforderungen und die Notwendigkeit, Innovation mit strengen regulatorischen Standards in Einklang zu bringen.";
      case 'solution':
        return "Unsere Lösung bietet Mercedes-Benz eine spezialisierte Automotive-KI-Compliance, einschließlich Sicherheitsgewährleistungsrahmen, umfassender Testprotokolle und Integration mit bestehenden Automobilsicherheitsstandards.";
      case 'features':
        return "Zu den wichtigsten Funktionen für Automobilhersteller gehören Validierungstools für sicherheitskritische KI, Echtzeit-Überwachungssysteme für eingesetzte KI und umfassende technische Dokumentationsautomatisierung für Fahrzeugsysteme.";
      case 'outcomes':
        return "Durch die Implementierung unserer Lösung erreichte Mercedes-Benz die vollständige Einhaltung des EU AI Acts, beschleunigte ihren Innovationszeitplan um 35% und stärkte ihren Ruf für Sicherheitsführerschaft.";
      default:
        return "Willkommen zur Mercedes-Benz Fallstudie. Dieser globale Automobilführer musste den EU AI Act für seine KI-Systeme mit hohem Risiko in der fortschrittlichen Fahrerassistenz, beim autonomen Fahren und bei der Fahrzeugüberwachung einhalten.";
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Automotive</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mercedes-Benz</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Automotive | Enterprise (100,000+ employees) | Global</span>
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
              <CardDescription>Background information on Mercedes-Benz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>Mercedes-Benz Group AG is one of the world's premier automotive manufacturers, with a rich history of innovation dating back to the invention of the automobile. Headquartered in Stuttgart, Germany, the company employs over 170,000 people worldwide and produces luxury vehicles, vans, trucks, and buses. With annual revenue exceeding €150 billion and operations in more than 40 countries, Mercedes-Benz has established itself as a leader in automotive technology and safety. The company has made significant investments in AI-driven systems, particularly in the areas of advanced driver assistance systems (ADAS), autonomous driving technology, and connected vehicle services.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Advanced Driver Assistance Systems</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A suite of AI-powered systems that enhance vehicle safety and driver convenience, including adaptive cruise control, lane keeping assist, automated emergency braking, intelligent speed adaptation, and traffic sign recognition. These systems utilize multiple AI algorithms and sensor fusion to interpret the driving environment and make real-time decisions about vehicle control and driver alerts.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Safety-Critical System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Autonomous Driving System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A comprehensive AI system designed to enable SAE Level 3 autonomous driving capabilities in select models and driving conditions. The system incorporates advanced computer vision, sensor fusion algorithms, decision-making neural networks, and sophisticated control systems to navigate roads, interpret traffic conditions, and operate the vehicle with minimal human intervention under specific conditions.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Autonomous System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Predictive Vehicle Health Monitoring</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI system that continuously monitors vehicle performance data from hundreds of sensors to predict potential component failures before they occur. The system analyzes patterns in sensor readings, usage conditions, and vehicle diagnostics to identify maintenance needs, improve vehicle reliability, and enhance safety by preventing unexpected component failures during operation.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Predictive Maintenance System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Personalized Driver Experience</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A machine learning system that creates personalized vehicle experiences for drivers by learning their preferences, habits, and driving patterns. The system adjusts settings including seat position, climate control, entertainment options, and driving dynamics based on identified patterns and direct user inputs.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Limited Risk (Article 6)</Badge>
                      <Badge variant="outline">User Experience System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>As a global automotive manufacturer deploying advanced AI systems that directly impact vehicle safety and operation, Mercedes-Benz faces significant exposure under the EU AI Act. Three of their four core AI systems are classified as high-risk under Article 6, primarily due to their potential impact on physical safety and their operation in safety-critical contexts. The company must ensure rigorous compliance with requirements for risk management, data governance, human oversight, technical documentation, and transparency. Beyond regulatory requirements, Mercedes-Benz has a strong incentive to demonstrate industry-leading AI governance and safety practices to maintain consumer trust and their market position in premium vehicles where advanced technology is a key differentiator.</p>
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
                <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Safety-Critical AI Systems</AlertTitle>
                  <AlertDescription>
                    Systems that directly control vehicle operation require exceptionally high standards of validation and reliability
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Regulatory Harmonization</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Aligning EU AI Act requirements with existing automotive regulations including UN-ECE standards, ISO 26262 for functional safety, and SOTIF (ISO/PAS 21448) for autonomous systems.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Explainability Requirements</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Making complex neural networks and decision algorithms in autonomous driving systems transparent and explainable to regulators and users.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Comprehensive Testing</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Validating AI systems across millions of potential scenarios, environmental conditions, and edge cases to ensure safety in all operational contexts.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Supply Chain Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring compliance across a complex global supply chain with hundreds of suppliers contributing components to AI systems.
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
                          Creating and maintaining comprehensive technical documentation for extremely complex AI systems with millions of parameters and evolving capabilities.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Global Deployment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Managing different regulatory requirements across global markets while maintaining consistent AI functionality and safety standards.
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
              <CardDescription>How our platform addresses Mercedes-Benz's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">Automotive AI Risk Classification</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive assessment of all vehicle AI systems, classifying them according to EU AI Act risk levels while mapping relationships to existing automotive safety standards and regulations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Integrated Compliance Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a unified compliance framework that harmonizes EU AI Act requirements with automotive-specific standards including ISO 26262, ISO/PAS 21448 (SOTIF), and UNECE regulations for automated driving systems.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Comprehensive Testing Suite</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented advanced testing methodologies combining simulation, test track validation, and real-world data analysis to validate AI performance across millions of scenarios and edge cases.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Explainable AI Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a specialized framework for making complex automotive AI systems explainable to regulators, consumers, and internal stakeholders, with visualization tools and decision-process tracing capabilities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Supply Chain Governance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established a comprehensive supplier governance program for AI components, ensuring traceability, transparency, and compliance verification throughout the complex global supply chain.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-5 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Key Technologies Implemented</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Car className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Automotive AI Validation Suite</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Specialized testing environment for automotive AI that simulates millions of driving scenarios and edge cases across varied conditions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Safety Assurance Platform</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Integrated safety validation tools that merge EU AI Act requirements with existing automotive safety standards and methodologies.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Neural Network Visualization System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Advanced visualization tools that make complex AI decision processes transparent and explainable for regulatory compliance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Operational Monitoring Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Real-time monitoring system for deployed AI algorithms with performance tracking, anomaly detection, and compliance verification.
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
              <CardDescription>Specialized compliance capabilities for automotive AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Safety-Critical AI Validation</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Comprehensive validation framework specifically designed for automotive AI systems that control vehicle operation and safety functions.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Edge case scenario generation and testing</li>
                        <li>Failure mode and effects analysis</li>
                        <li>Safety envelope validation</li>
                        <li>Human response modeling and simulation</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Explainable Automotive AI</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Tools designed to make complex autonomous driving and ADAS AI systems transparent, interpretable, and explainable to regulators and users.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Decision tree extraction from neural networks</li>
                        <li>Visual explanation of driving decisions</li>
                        <li>Scenario-based decision analysis</li>
                        <li>Interpretability metrics with automotive context</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Cpu className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Standards Integration</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Unified framework that integrates EU AI Act requirements with existing automotive standards and regulations.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Mapping between AI Act and ISO 26262</li>
                        <li>SOTIF alignment (ISO/PAS 21448)</li>
                        <li>Cross-compliance verification</li>
                        <li>Unified documentation approach</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Real-Time Monitoring</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Continuous monitoring of AI performance in deployed vehicles to ensure ongoing compliance, safety, and performance.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Over-the-air compliance verification</li>
                        <li>Drift detection in AI model performance</li>
                        <li>Automated performance reporting</li>
                        <li>Safety boundary monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Automotive-Specific Compliance Dashboard</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our specialized dashboard provides Mercedes-Benz with comprehensive visibility into the compliance status of all AI systems across their vehicle platforms.
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
                      <div className="text-xs text-muted-foreground">Validation Scenarios</div>
                      <div className="text-2xl font-semibold">5.2M</div>
                      <div className="flex items-center text-xs text-emerald-600">
                        <Shield className="h-3 w-3 mr-1" /> Comprehensive coverage
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Documentation</div>
                      <div className="text-2xl font-semibold">100%</div>
                      <div className="flex items-center text-xs text-emerald-600">
                        <FileCheck className="h-3 w-3 mr-1" /> Standards-aligned
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
                  <AlertTitle className="text-emerald-800">Comprehensive Compliance Achievement</AlertTitle>
                  <AlertDescription className="text-emerald-700">
                    Mercedes-Benz achieved full EU AI Act compliance across all vehicle AI systems while accelerating innovation
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                      Compliance Metrics
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">100% risk assessment coverage</span> across all AI systems in current and future vehicle platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">5.2 million validation scenarios</span> executed to verify safety and performance of autonomous systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">85% reduction in compliance effort</span> through automation and integration with existing processes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">100% supplier compliance</span> verified across the automotive AI supply chain</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      Business Impact
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">35% acceleration</span> in innovation timeline for new autonomous driving features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">28% improvement</span> in AI system performance through enhanced testing methodologies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">First-to-market advantage</span> for compliant Level 3 autonomous driving features in premium vehicles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">Strengthened safety reputation</span> through transparent AI governance and compliance leadership</span>
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
                        "Implementing EU AI Act compliance across our advanced driver assistance and autonomous driving systems presented a complex challenge. This solution allowed us not only to achieve full compliance but to leverage the compliance process to improve our AI development practices and accelerate innovation. The integration with our existing automotive safety standards has transformed what could have been a regulatory burden into a competitive advantage."
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="font-medium">Dr. Stefan Wagner</div>
                        <div className="text-muted-foreground text-sm">Head of AI Safety & Compliance, Mercedes-Benz</div>
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

export default AutomotiveScenario;