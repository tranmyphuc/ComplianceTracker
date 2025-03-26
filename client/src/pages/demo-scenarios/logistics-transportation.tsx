import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Truck, Globe, Package, BarChart, LineChart, BookCheck, RouteIcon, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AIJack } from '@/components/onboarding/ai-jack';

const LogisticsScenario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  // AI Jack message content based on current tab
  const getJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "DHL Express needs to ensure its AI systems for route optimization, automated sorting, predictive analytics, and customs clearance comply with the EU AI Act across over 220 countries and territories.";
      case 'challenges':
        return "This global logistics leader faces unique compliance challenges including cross-border regulatory complexity, high-volume automated decision-making, and the need to maintain operational efficiency during compliance implementation.";
      case 'solution':
        return "Our solution provides DHL with specialized logistics compliance including global regulatory mapping, integration with existing transportation standards, and operational-efficiency focused implementation.";
      case 'features':
        return "Key features for logistics companies include real-time compliance monitoring for cross-border operations, automated logistics decision explainability, and high-volume system validation frameworks.";
      case 'outcomes':
        return "By implementing our solution, DHL achieved full EU AI Act compliance while improving operational efficiency by 23% and maintaining their global leadership in logistics innovation.";
      default:
        return "Welcome to the DHL Express case study. This global logistics leader needed to comply with the EU AI Act for their AI systems in route optimization, automated sorting, predictive analytics, and customs clearance.";
    }
  };
  
  // German translations for AI Jack
  const getGermanJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "DHL Express muss sicherstellen, dass seine KI-Systeme für Routenoptimierung, automatisierte Sortierung, prädiktive Analytik und Zollabfertigung dem EU AI Act in über 220 Ländern und Territorien entsprechen.";
      case 'challenges':
        return "Dieser globale Logistikführer steht vor einzigartigen Compliance-Herausforderungen, darunter grenzüberschreitende regulatorische Komplexität, automatisierte Entscheidungsfindung in hohem Volumen und die Notwendigkeit, die betriebliche Effizienz während der Compliance-Implementierung aufrechtzuerhalten.";
      case 'solution':
        return "Unsere Lösung bietet DHL eine spezialisierte Logistik-Compliance, einschließlich globaler regulatorischer Kartierung, Integration mit bestehenden Transportstandards und einer auf Betriebseffizienz fokussierten Implementierung.";
      case 'features':
        return "Zu den wichtigsten Funktionen für Logistikunternehmen gehören Echtzeit-Compliance-Überwachung für grenzüberschreitende Operationen, automatisierte Erklärbarkeit von Logistikentscheidungen und Validierungsrahmen für Systeme mit hohem Volumen.";
      case 'outcomes':
        return "Durch die Implementierung unserer Lösung erreichte DHL die vollständige Einhaltung des EU AI Acts, verbesserte gleichzeitig die betriebliche Effizienz um 23% und behielt seine globale Führungsposition in der Logistikinnovation bei.";
      default:
        return "Willkommen zur DHL Express Fallstudie. Dieser globale Logistikführer musste den EU AI Act für seine KI-Systeme in der Routenoptimierung, automatisierten Sortierung, prädiktiven Analytik und Zollabfertigung einhalten.";
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Logistics & Transportation</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">DHL Express</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Logistics | Enterprise (100,000+ employees) | Global</span>
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
              <CardDescription>Background information on DHL Express</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>DHL Express is a global leader in international express shipping and logistics services, operating in over 220 countries and territories worldwide. As part of Deutsche Post DHL Group, the company employs more than 120,000 people and handles approximately 5 million shipments daily. With annual revenue exceeding €20 billion, DHL Express operates a complex network of logistics hubs, sorting centers, delivery vehicles, and aircraft. The company has heavily invested in digital transformation and AI technologies to optimize operations, enhance customer experience, and maintain its competitive edge in the rapidly evolving logistics industry.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Route Optimization System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An advanced AI system that dynamically optimizes delivery routes for thousands of vehicles across global operations. The system incorporates real-time traffic data, weather conditions, package priorities, delivery time windows, vehicle capacity, fuel efficiency, and driver constraints to create optimal delivery routes that minimize costs while maximizing service quality and on-time performance.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Resource Management System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Automated Sorting System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-powered computer vision and robotics system that automates the sorting of packages in DHL's logistics centers. The system uses machine learning algorithms to recognize package dimensions, read address information, identify special handling requirements, and direct packages to appropriate sorting lanes and loading areas. It processes millions of packages daily with minimal human intervention.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Automated Physical System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Predictive Supply Chain Analytics</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A sophisticated AI system that analyzes historical shipping data, economic indicators, seasonal patterns, and market trends to predict future shipping volumes, resource needs, and potential disruptions. The system helps optimize network capacity planning, staffing levels, and asset allocation to ensure operational efficiency during peak periods and disruptions.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Critical Planning System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Customs Clearance AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI system that processes international shipping documentation to facilitate customs clearance across borders. The system analyzes shipping declarations, identifies missing or incorrect information, classifies goods according to customs categories, determines applicable duties and taxes, and flags potential compliance issues. It significantly reduces customs clearance times and compliance errors in cross-border shipments.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Regulatory System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>As a global logistics provider operating throughout the European Union, DHL Express faces significant exposure under the EU AI Act. All four of their primary AI systems are classified as high-risk under Article 6 due to their impact on critical infrastructure operations, management of essential services, and role in cross-border regulatory compliance. These systems make millions of automated decisions daily that directly affect operational efficiency, service quality, regulatory compliance, and ultimately the movement of goods that underpin global supply chains. Additionally, DHL's operations span multiple jurisdictions, requiring compliance with varied and sometimes conflicting regulatory frameworks while maintaining the efficiency that is essential to logistics operations.</p>
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
                  <AlertTitle>Global Operation Complexity</AlertTitle>
                  <AlertDescription>
                    Ensuring compliance across 220+ countries while maintaining the operational efficiency required for time-critical logistics
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cross-Border Regulatory Variance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Navigating different regulatory frameworks across EU member states and third countries while maintaining consistent AI operations for a global logistics network.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">High-Volume Decision Making</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring compliance for AI systems making millions of automated decisions daily while maintaining the speed and efficiency required for logistics operations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Operational Efficiency Impact</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implementing compliance measures without negatively impacting the operational efficiency that is critical to competitive logistics services.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Data Governance Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Managing cross-border data flows and governance requirements across diverse jurisdictions with varying standards for data protection and AI regulation.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Robotic System Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring compliance for physical AI systems in automated sorting facilities that operate continuously in time-sensitive environments.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Documentation at Scale</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Creating and maintaining comprehensive documentation for AI systems operating at massive scale across diverse global operations.
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
              <CardDescription>How our platform addresses DHL Express's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">Global Logistics AI Mapping</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive global mapping of all AI systems across DHL's logistics network, identifying their decision-making impacts, data flows, and regulatory exposures across different jurisdictions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Efficiency-Preserving Compliance Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a specialized compliance framework optimized for high-throughput logistics operations, ensuring regulatory compliance without compromising the speed and efficiency critical to logistics services.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Cross-Border AI Governance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a unified governance system for AI operations spanning multiple regulatory environments, with localized compliance interfaces for different jurisdictions while maintaining global operational consistency.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Automated Documentation System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a scalable, automated documentation system specifically designed for logistics AI, capable of handling the massive volume of decisions and operations while ensuring complete traceability and compliance evidence.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Real-Time Compliance Monitoring</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Deployed a real-time monitoring system that continuously verifies AI compliance across global operations, with specialized attention to critical logistics functions and cross-border handoffs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-5 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Key Technologies Implemented</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Logistics AI Validation Suite</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Specialized validation tools for logistics AI systems that can operate at the massive scale required for global operations while ensuring compliance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Cross-Border Compliance Engine</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Automated regulatory mapping system that ensures AI operations comply with varying requirements as shipments cross international borders.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Operational Efficiency Optimizer</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Performance monitoring tools that ensure compliance measures don't negatively impact critical logistics efficiency metrics.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <RouteIcon className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Decision Audit System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Specialized audit tools for high-volume decision-making that provide traceability without creating performance bottlenecks.
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
              <CardDescription>Specialized compliance capabilities for logistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Global Regulatory Navigation</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Comprehensive tools for managing AI compliance across multiple regulatory frameworks and international boundaries.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Jurisdiction-specific compliance mapping</li>
                        <li>Cross-border AI operation management</li>
                        <li>Regulatory overlap resolution</li>
                        <li>Global compliance positioning</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">High-Volume Decision Compliance</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Specialized tools for ensuring compliance in AI systems making millions of automated decisions daily in time-sensitive operations.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Performance-optimized compliance monitoring</li>
                        <li>Statistical validation for high-volume decisions</li>
                        <li>Sampling-based oversight mechanisms</li>
                        <li>Exception-based human review triggers</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Logistics-Specific Explainability</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Tools designed to make complex logistics AI systems transparent and explainable in operational context.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Route optimization decision explanations</li>
                        <li>Automated sorting decision traceability</li>
                        <li>Context-aware decision visualization</li>
                        <li>Business-impact translators for technical decisions</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-5 rounded-lg border border-muted-foreground/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <RouteIcon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Operational Efficiency Preservation</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Compliance solutions designed to maintain critical logistics performance metrics while ensuring regulatory adherence.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Performance impact modeling for compliance measures</li>
                        <li>Efficiency-optimized implementation paths</li>
                        <li>Operational KPI integration</li>
                        <li>Latency-minimal monitoring strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Logistics-Specific Compliance Dashboard</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our specialized dashboard provides DHL Express with comprehensive visibility into the compliance status of all AI systems across their global logistics network.
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
                      <div className="text-xs text-muted-foreground">Daily Decisions</div>
                      <div className="text-2xl font-semibold">7.3M</div>
                      <div className="flex items-center text-xs text-emerald-600">
                        <Shield className="h-3 w-3 mr-1" /> Fully monitored
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Countries Covered</div>
                      <div className="text-2xl font-semibold">220+</div>
                      <div className="flex items-center text-xs text-emerald-600">
                        <FileCheck className="h-3 w-3 mr-1" /> Global compliance
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
                  <AlertTitle className="text-emerald-800">Global Compliance Achievement</AlertTitle>
                  <AlertDescription className="text-emerald-700">
                    DHL Express achieved full EU AI Act compliance across global operations while improving operational efficiency
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
                        <span><span className="font-medium">100% AI system compliance</span> across all four high-risk logistics AI systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">220+ countries</span> covered by consistent compliance framework with local adaptations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">7.3M daily decisions</span> monitored and documented without operational impact</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">92% reduction</span> in manual compliance documentation effort through automation</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Business Impact
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">23% improvement</span> in operational efficiency through enhanced AI system performance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">18% reduction</span> in cross-border shipment processing time due to compliant AI systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">Zero operational disruptions</span> during compliance implementation across global network</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span><span className="font-medium">Competitive advantage</span> in securing contracts with EU-based clients requiring AI Act compliance</span>
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
                        "As a global logistics provider operating in over 220 countries, achieving EU AI Act compliance presented a significant challenge given our scale and the time-sensitive nature of our operations. This solution allowed us to implement a comprehensive compliance framework without compromising the operational efficiency that is critical to our business. We've not only achieved full compliance but actually improved our operational performance through the enhanced AI governance and optimization capabilities."
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="font-medium">Dr. Thomas Schmidt</div>
                        <div className="text-muted-foreground text-sm">Chief Digital Officer, DHL Express</div>
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

export default LogisticsScenario;