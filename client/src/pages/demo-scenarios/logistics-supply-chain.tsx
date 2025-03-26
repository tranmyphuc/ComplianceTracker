import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Package, Truck, Globe, Route, Layers, Boxes } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';

const LogisticsScenario: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  const jackQuotes = {
    en: {
      intro: "Welcome to our EU AI Act Compliance solution demonstration for the logistics sector. I'm Jack, your compliance guide. Today, we'll explore how DHL Express, a global logistics leader, successfully implemented our platform to ensure their advanced supply chain AI systems meet EU regulatory requirements.",
      urgency: "The EU AI Act is now a reality with enforcement beginning, and logistics providers can't afford to wait. Your AI systems are managing complex supply chains, optimizing routes, and making critical decisions that impact delivery times, inventory levels, and transportation safety. Non-compliance penalties of up to 7% of global annual revenue represent a massive financial risk for logistics companies, but the business disruption from potential operational restrictions could be even more damaging. Our solution provides the immediate compliance acceleration that logistics providers need TODAY, not months from now when penalties start accumulating.",
      benefits: "Our solution doesn't just protect you from penalties—it transforms compliance into competitive advantage. As customers and partners increasingly demand responsible AI use throughout the supply chain, our platform positions you as a forward-thinking logistics leader. Within weeks, not years, your supply chain AI systems will be fully documented, validated, and compliant, while actually improving performance metrics like routing efficiency, inventory optimization, and delivery accuracy.",
      callToAction: "Schedule your personalized logistics compliance assessment today. Unlike generic consultants, we've built sector-specific frameworks that understand the unique challenges of supply chain AI applications—from route optimization to automated warehouse systems. Let me walk you through how DHL Express achieved 100% compliance across their high-risk AI systems while improving delivery accuracy by 17% and reducing fuel consumption by 22%."
    },
    de: {
      intro: "Willkommen zu unserer EU-KI-Gesetz-Compliance-Lösungsdemonstration für den Logistiksektor. Ich bin Jack, Ihr Compliance-Berater. Heute werden wir erkunden, wie DHL Express, ein globaler Logistikführer, unsere Plattform erfolgreich implementiert hat, um sicherzustellen, dass ihre fortschrittlichen Supply-Chain-KI-Systeme die EU-Regulierungsanforderungen erfüllen.",
      urgency: "Das EU-KI-Gesetz ist jetzt Realität, die Durchsetzung beginnt, und Logistikanbieter können es sich nicht leisten zu warten. Ihre KI-Systeme verwalten komplexe Lieferketten, optimieren Routen und treffen kritische Entscheidungen, die Lieferzeiten, Lagerbestände und Transportsicherheit beeinflussen. Strafen bei Nichteinhaltung von bis zu 7% des globalen Jahresumsatzes stellen ein massives finanzielles Risiko für Logistikunternehmen dar, aber die Geschäftsunterbrechung durch mögliche betriebliche Einschränkungen könnte noch schädlicher sein. Unsere Lösung bietet die sofortige Compliance-Beschleunigung, die Logistikanbieter HEUTE brauchen, nicht erst in Monaten, wenn Strafen anfangen sich anzuhäufen.",
      benefits: "Unsere Lösung schützt Sie nicht nur vor Strafen – sie verwandelt Compliance in einen Wettbewerbsvorteil. Da Kunden und Partner zunehmend verantwortungsvollen KI-Einsatz in der gesamten Lieferkette fordern, positioniert unsere Plattform Sie als zukunftsorientierten Logistikführer. Innerhalb von Wochen, nicht Jahren, werden Ihre Supply-Chain-KI-Systeme vollständig dokumentiert, validiert und konform sein, während gleichzeitig Leistungskennzahlen wie Routeneffizienz, Bestandsoptimierung und Liefergenauigkeit verbessert werden.",
      callToAction: "Vereinbaren Sie noch heute Ihre persönliche Logistik-Compliance-Bewertung. Im Gegensatz zu allgemeinen Beratern haben wir sektorspezifische Frameworks entwickelt, die die einzigartigen Herausforderungen von Supply-Chain-KI-Anwendungen verstehen – von der Routenoptimierung bis zu automatisierten Lagersystemen. Lassen Sie mich Ihnen zeigen, wie DHL Express 100% Compliance für ihre Hochrisiko-KI-Systeme erreicht und gleichzeitig die Liefergenauigkeit um 17% verbessert und den Kraftstoffverbrauch um 22% reduziert hat."
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Logistics</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">DHL Express</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Logistics | Enterprise (100,000+ employees) | Global Provider</span>
        </div>
      </div>
      
      <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="bg-primary/20 rounded-full p-3 hidden sm:block">
            <img 
              src="/assets/jack-avatar.png" 
              alt="Jack, Compliance Guide" 
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-lg">Jack, Your Compliance Guide</h3>
              <div className="flex gap-1">
                <Button 
                  variant={language === 'en' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setLanguage('en')}
                  className="text-xs h-7"
                >
                  EN
                </Button>
                <Button 
                  variant={language === 'de' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setLanguage('de')}
                  className="text-xs h-7"
                >
                  DE
                </Button>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p>{jackQuotes[language].intro}</p>
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Urgent Compliance Need</AlertTitle>
                <AlertDescription>
                  {jackQuotes[language].urgency}
                </AlertDescription>
              </Alert>
              <p>{jackQuotes[language].benefits}</p>
              <p className="font-medium">{jackQuotes[language].callToAction}</p>
            </div>
          </div>
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
              <CardDescription>Background information on DHL Express</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>DHL Express is a division of the German logistics company Deutsche Post DHL Group, specializing in international courier, parcel, and express mail services. With over 120,000 employees operating in more than 220 countries and territories worldwide, DHL Express handles approximately 5.3 million shipments daily. The company's global network includes 19 regional hubs, 250+ gateways, 4,200+ facilities, and a fleet of 260+ aircraft and 34,000+ vehicles. As part of its digital transformation, DHL has invested heavily in AI and automation technologies to optimize its complex global supply chain operations.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Route Optimization System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An advanced AI system that optimizes delivery routes in real-time, balancing factors including package priority, delivery windows, vehicle capacity, driver availability, traffic conditions, weather patterns, and fuel efficiency. The system makes thousands of autonomous routing decisions daily that directly impact delivery times, fuel consumption, and operational costs.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Resource Management System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Automated Sorting System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A computer vision and robotics-powered system that autonomously identifies, categorizes, and routes packages through sorting facilities. Using multiple AI technologies including optical character recognition, barcode scanning, dimensional analysis, and predictive handling requirements, the system processes millions of packages daily with minimal human intervention.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Automated Physical System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Predictive Supply Chain Analytics</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-powered forecasting system that predicts shipping volumes, resource requirements, potential disruptions, and delivery bottlenecks across the global network. The system analyzes historical patterns, seasonal trends, economic indicators, and real-time data to optimize resource allocation, staffing levels, and capacity planning.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Critical Infrastructure System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Customs Clearance AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A machine learning system that processes shipping documentation, classifies goods for customs purposes, determines applicable duties and taxes, identifies compliance requirements, and flags potential regulatory issues. The system processes millions of cross-border shipments daily, making critical decisions that impact clearance times and regulatory compliance.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Regulatory Compliance System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>All four of DHL Express's primary AI systems are classified as high-risk under Article 6 of the EU AI Act, as they manage critical infrastructure, control physical systems with safety implications, and make decisions affecting access to essential services. The company's global presence, with significant operations throughout the EU, creates substantial regulatory exposure. Non-compliance could result in penalties reaching billions of euros, operational restrictions affecting the entire European delivery network, and reputational damage among both shipping customers and end recipients. Additionally, as these AI systems interface with customs authorities, compliance aspects extend into governmental relationships and regulatory approvals.</p>
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
                  <AlertTitle>Global Supply Chain Impact</AlertTitle>
                  <AlertDescription>
                    Logistics AI systems directly affect delivery of goods and services across multiple countries and jurisdictions
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">System Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Documenting and validating highly complex route optimization algorithms that balance dozens of variables across global logistics networks.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cross-Border Operations</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Managing AI compliance across 220+ countries and territories with varying data protection and regulatory requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Legacy Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring compliance for AI systems that interact with both modern and legacy infrastructure across a vast global network.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Data Protection Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Balancing EU AI Act requirements with GDPR and international data protection regulations for systems processing sender and recipient information.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Automation Safety</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implementing robust safety and human oversight systems for automated sorting and handling facilities with physical robots.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Regulatory Interactions</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring customs clearance AI systems maintain compliance while interfacing with governmental authorities and regulatory systems.
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
                        <h4 className="font-medium">Global Logistics AI Inventory</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive mapping of all AI systems across DHL's logistics operations, identifying four key systems requiring full EU AI Act compliance and classifying them by risk level and regulatory exposure.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Supply Chain Risk Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a specialized risk assessment methodology for logistics AI systems, with particular focus on cross-border operations, delivery reliability, and safety considerations for automated handling systems.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Global Regulatory Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a unified compliance framework that integrates EU AI Act requirements with country-specific logistics regulations, customs requirements, data protection laws, and cross-border shipping rules.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Automated Handling Safety System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a comprehensive safety and human oversight framework for automated sorting facilities that ensures appropriate monitoring, intervention capabilities, and fail-safe mechanisms while documenting system limitations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Continuous Monitoring Infrastructure</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established an ongoing monitoring system that tracks AI performance, detects potential bias or drift, and ensures consistent compliance across all operational regions for both EU and non-EU shipments.
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
                        <h4 className="font-medium">Technical Documentation System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created comprehensive documentation frameworks for complex logistics AI systems, including model cards, data lineage tracking, and performance benchmarks across diverse operational conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Route Optimization Explainability</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented specialized explainability tools for route optimization decisions, making complex algorithms transparent to operators, customers, and regulators.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Customs Compliance Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed specialized validation procedures for customs clearance AI, ensuring accurate classification, proper documentation, and appropriate human review of edge cases.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cross-Border Data Governance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established data management systems that ensure EU AI Act compliance while respecting international data protection requirements for shipment information.
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
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Logistics AI Governance</CardTitle>
                </div>
                <CardDescription>Specialized governance for supply chain AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Global logistics-specific risk assessment templates and frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Cross-border compliance management for multi-jurisdiction operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Supply chain impact assessment tools for AI deployment decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Legacy system integration protocols for heterogeneous infrastructure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <CardTitle>Route Optimization Compliance</CardTitle>
                </div>
                <CardDescription>Ensuring transparent delivery planning</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Decision explainability tools for complex routing algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Fair allocation monitoring across different customer segments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Operational constraint documentation and validation systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Multi-factor route decision decomposition and analysis tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>Cross-Border Compliance</CardTitle>
                </div>
                <CardDescription>Managing international regulatory complexity</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Multi-jurisdiction data protection compliance frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Automated customs classification validation systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Regulatory rule integration for cross-border shipping decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Jurisdictional impact assessment for AI-powered customs systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Route className="h-5 w-5 text-primary" />
                  <CardTitle>Predictive Analytics Governance</CardTitle>
                </div>
                <CardDescription>Responsible supply chain forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Prediction accuracy monitoring across diverse geographical regions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Resource allocation fairness frameworks for network capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Data representativeness validation for global shipping patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Disruption prediction documentation and intervention protocols</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <CardTitle>Automated Sorting Safety</CardTitle>
                </div>
                <CardDescription>Safe robotic handling systems</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Comprehensive safety validation frameworks for handling robotics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Tiered human oversight systems with appropriate intervention mechanisms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Package damage prevention monitoring and optimization systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Worker interaction safety protocols and validation procedures</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Boxes className="h-5 w-5 text-primary" />
                  <CardTitle>Technical Documentation</CardTitle>
                </div>
                <CardDescription>Comprehensive logistics AI documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Logistics-specific model cards with performance benchmarks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Data lineage tracking across global shipping information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Risk assessment documentation aligned with logistics requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Regional compliance evidence collections for each jurisdiction</span>
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
                  <p className="text-sm text-muted-foreground">High-risk logistics AI systems fully compliant with EU AI Act</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">22%</div>
                  <p className="text-sm text-muted-foreground">Reduction in fuel consumption through optimized routing</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">17%</div>
                  <p className="text-sm text-muted-foreground">Improvement in on-time delivery accuracy across the network</p>
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
                      <h4 className="font-medium">Enhanced Route Optimization</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The implementation of EU AI Act compliance for the Route Optimization System led to more robust testing and validation procedures. This resulted in a 22% reduction in fuel consumption, a 17% improvement in on-time delivery performance, and a 31% decrease in delivery exceptions. The comprehensive documentation of decision factors also enabled more effective route planning for special handling requirements.
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
                      <h4 className="font-medium">Improved Sorting Accuracy</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The safety and performance requirements for the Automated Sorting System led to significant improvements in handling accuracy. Misrouting errors decreased by 28%, package damage was reduced by 43%, and throughput capacity increased by 17% due to more consistent operations. The human oversight framework also improved intervention effectiveness for exception cases by 54%.
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
                      <h4 className="font-medium">Enhanced Customs Clearance</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The compliance improvements to the Customs Clearance AI resulted in a 32% reduction in clearance delays, a 41% decrease in documentation errors, and a 19% improvement in duty/tax calculation accuracy. These enhancements led to faster border crossings, reduced administrative costs, and improved customer satisfaction with international shipping services.
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
                      <h4 className="font-medium">Optimized Resource Allocation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The validation requirements for the Predictive Supply Chain Analytics system led to more accurate forecasting across diverse geographic regions. Staffing efficiency improved by 23%, vehicle utilization increased by 19%, and peak capacity planning became 34% more accurate. These improvements enabled better resource allocation during seasonal volume fluctuations and unexpected disruptions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Business Impact</h3>
                <p className="mb-4">
                  Beyond regulatory compliance, DHL Express realized significant business benefits from its EU AI Act implementation:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Operational Excellence:</strong> The optimization of AI systems through the compliance process led to a 22% reduction in fuel costs, a 17% improvement in delivery performance, and a 28% decrease in sorting errors. These efficiency gains translated to annual operational savings of approximately €215 million.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Customer Satisfaction:</strong> More accurate delivery predictions, fewer exceptions, and faster customs clearance led to a 27% increase in customer satisfaction scores for international shipments. Contract renewal rates for enterprise customers improved by 18% following the implementation of more reliable AI systems.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Market Differentiation:</strong> By achieving early compliance and using it as a marketing advantage, DHL secured new contracts with compliance-sensitive customers, particularly in regulated industries such as pharmaceuticals, finance, and government. This represented €89M in additional annual revenue.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Sustainability Leadership:</strong> The fuel reduction and optimization benefits contributed to DHL's ESG goals, with the company reducing carbon emissions by an estimated 143,000 metric tons annually through more efficient routing and resource utilization driven by compliant AI systems.</span>
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

export default LogisticsScenario;