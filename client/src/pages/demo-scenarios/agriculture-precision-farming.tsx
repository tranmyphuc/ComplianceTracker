import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Leaf, LineChart, Droplet, CloudRain, Tractor, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';

const AgricultureScenario: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  const jackQuotes = {
    en: {
      intro: "Welcome to our EU AI Act Compliance solution demonstration for the agricultural sector. I'm Jack, your compliance guide. Today, we'll explore how AgroTech Solutions, a leading European precision agriculture company, successfully implemented our platform to ensure their advanced farming AI systems meet EU regulatory requirements.",
      urgency: "The EU AI Act is now in force, and agricultural technology providers must act quickly. With your AI systems directly affecting food production, environmental impact, and rural livelihoods, non-compliance risks are substantial. Financial penalties of up to 7% of global revenue aren't just theoretical—they're imminent for unprepared agribusinesses. Beyond penalties, there's the risk of losing market access, operational restrictions, and reputational damage if your systems aren't brought into compliance. Our solution provides immediate risk mitigation and compliance acceleration that modern agriculture needs TODAY, not months from now when enforcement begins.",
      benefits: "Our solution doesn't just shield you from regulatory penalties—it transforms compliance into competitive advantage. As consumers and business partners increasingly demand responsible AI use in food production, our platform positions you as a trusted, forward-thinking agricultural technology leader. Within weeks, not years, your farming AI systems will be fully documented, validated, and compliant, while actually improving performance and sustainability metrics.",
      callToAction: "Schedule your personalized agricultural compliance assessment today. Unlike generic consultants, we've built sector-specific frameworks that understand the unique challenges of farming AI applications—from crop monitoring to precision spraying systems. Let me show you how AgroTech Solutions achieved 100% compliance with their high-risk AI systems while improving crop yield predictions by 23% and reducing agrochemical usage by 31%."
    },
    de: {
      intro: "Willkommen zu unserer EU-KI-Gesetz-Compliance-Lösungsdemonstration für den Agrarsektor. Ich bin Jack, Ihr Compliance-Berater. Heute werden wir erkunden, wie AgroTech Solutions, ein führendes europäisches Unternehmen für Präzisionslandwirtschaft, unsere Plattform erfolgreich implementiert hat, um sicherzustellen, dass ihre fortschrittlichen landwirtschaftlichen KI-Systeme die EU-Regulierungsanforderungen erfüllen.",
      urgency: "Das EU-KI-Gesetz ist jetzt in Kraft, und Anbieter von Agrartechnologie müssen schnell handeln. Da Ihre KI-Systeme direkte Auswirkungen auf die Lebensmittelproduktion, Umwelteinflüsse und ländliche Existenzgrundlagen haben, sind die Risiken bei Nichteinhaltung erheblich. Finanzielle Strafen von bis zu 7% des globalen Umsatzes sind keine Theorie – sie stehen für unvorbereitete Agrarunternehmen unmittelbar bevor. Über Strafen hinaus besteht das Risiko, Marktzugang zu verlieren, betriebliche Einschränkungen zu erfahren und Reputationsschäden zu erleiden, wenn Ihre Systeme nicht in Einklang gebracht werden. Unsere Lösung bietet sofortige Risikominderung und Compliance-Beschleunigung, die die moderne Landwirtschaft HEUTE braucht, nicht erst in Monaten, wenn die Durchsetzung beginnt.",
      benefits: "Unsere Lösung schützt Sie nicht nur vor regulatorischen Strafen – sie verwandelt Compliance in einen Wettbewerbsvorteil. Da Verbraucher und Geschäftspartner zunehmend verantwortungsvollen KI-Einsatz in der Lebensmittelproduktion fordern, positioniert unsere Plattform Sie als vertrauenswürdigen, zukunftsorientierten Agrartechnologieführer. Innerhalb von Wochen, nicht Jahren, werden Ihre landwirtschaftlichen KI-Systeme vollständig dokumentiert, validiert und konform sein, während gleichzeitig Leistungs- und Nachhaltigkeitskennzahlen verbessert werden.",
      callToAction: "Vereinbaren Sie noch heute Ihre persönliche landwirtschaftliche Compliance-Bewertung. Im Gegensatz zu allgemeinen Beratern haben wir sektorspezifische Frameworks entwickelt, die die einzigartigen Herausforderungen von KI-Anwendungen in der Landwirtschaft verstehen – von der Ernteüberwachung bis zu Präzisionssprühsystemen. Lassen Sie mich Ihnen zeigen, wie AgroTech Solutions 100% Compliance für ihre Hochrisiko-KI-Systeme erreicht und gleichzeitig die Ernteertragsprognosen um 23% verbessert und den Agrochemikalieneinsatz um 31% reduziert hat."
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Agriculture</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AgroTech Solutions</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Agriculture | Medium Enterprise (500-1,000 employees) | European AgTech</span>
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
              <CardDescription>Background information on AgroTech Solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>AgroTech Solutions is a leading European precision agriculture technology provider headquartered in the Netherlands with operations across 11 EU countries. With approximately 850 employees and annual revenue of €175 million, the company develops advanced technology solutions for modern farming operations. Their product portfolio includes precision farming equipment, IoT sensor networks, agricultural drones, satellite imagery analysis tools, and AI-powered decision support systems. AgroTech serves over 18,000 farms throughout Europe, ranging from small family operations to large industrial agricultural enterprises.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Crop Health Analysis System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-powered computer vision system that analyzes imagery from drones, satellites, and ground sensors to detect crop diseases, pest infestations, nutrient deficiencies, and growth anomalies. The system provides early detection of issues affecting crop health and automatically generates treatment recommendations including pesticide application specifications, fertilizer prescriptions, and irrigation adjustments.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Environmental Impact System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Precision Application Control</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An automated system that controls the application of agricultural inputs (fertilizers, pesticides, herbicides) with centimeter-level precision. Using real-time data from multiple sensors and AI algorithms, the system determines optimal application rates, timing, and patterns for each field section, controlling robotic sprayers and applicators to minimize chemical usage while maximizing effectiveness.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Agricultural Automation System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Harvest Prediction & Planning</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A predictive AI system that forecasts crop yields, harvest timing, and quality parameters by analyzing historical data, current growing conditions, weather patterns, and crop development metrics. The system generates harvest planning recommendations that influence critical decisions about workforce scheduling, equipment deployment, storage requirements, and market timing.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Resource Planning System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Autonomous Equipment Guidance</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI system that enables semi-autonomous and autonomous operation of agricultural machinery including tractors, harvesters, and specialized equipment. The system uses computer vision, LiDAR, GPS, and machine learning algorithms to navigate fields, detect obstacles, optimize routes, and perform precision operations while minimizing soil compaction and fuel usage.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Autonomous Vehicle System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>All four of AgroTech's primary AI systems are classified as high-risk under Article 6 of the EU AI Act, as they directly impact food safety, environmental outcomes, worker safety, and critical resource management. The company faces significant regulatory exposure, with systems that control chemical applications and machinery operations having particularly high-risk profiles. With operations across 11 EU countries and systems that make autonomous decisions affecting both farm operations and environmental impacts, AgroTech must navigate complex compliance requirements including risk management, data governance, human oversight, technical documentation, and transparency. Non-compliance could result in substantial penalties and disruption to their customer operations.</p>
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
                  <AlertTitle>Environmental and Food Safety Impacts</AlertTitle>
                  <AlertDescription>
                    Agricultural AI systems directly affect food production, chemical usage, and environmental outcomes
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Environmental Impact Assessment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Evaluating and documenting the environmental impact of AI systems that control chemical applications across diverse ecosystems and soil types.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Variable Operating Conditions</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring AI systems perform reliably across unpredictable farming conditions, weather patterns, crop varieties, and seasonal variations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Data Representativeness</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Building and documenting training datasets that adequately represent the diversity of European agricultural conditions, crop varieties, and farming practices.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Rural Connectivity Limitations</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implementing effective human oversight systems in environments with limited internet connectivity and remote operational locations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Diverse User Base</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Creating transparent, understandable AI systems for a user population with varying levels of technical expertise and digital literacy.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cross-Border Compliance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Managing compliance across 11 different EU countries with varying national implementations of the EU AI Act and agricultural regulations.
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
              <CardDescription>How our platform addresses AgroTech's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">Agricultural AI Systems Inventory</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive mapping of all AI systems across AgroTech's product portfolio, identifying four key systems requiring full EU AI Act compliance and classifying them by risk level and regulatory exposure.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Agricultural-Specific Risk Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a specialized risk assessment methodology for agricultural AI systems, with particular focus on environmental impact, food safety implications, and operational reliability across diverse farming conditions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Rural-Adapted Oversight System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a human oversight framework specifically designed for agricultural environments with limited connectivity, incorporating offline monitoring capabilities, escalation protocols, and simplified interfaces for varying technical literacy.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Environmental Impact Documentation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented comprehensive documentation practices for all AI systems that influence environmental outcomes, including detailed analysis of chemical application controls, biodiversity impacts, and soil health considerations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Cross-European Compliance Approach</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established a unified compliance framework that addresses EU AI Act requirements alongside local agricultural regulations, environmental standards, and food safety requirements across all 11 operating countries.
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
                        <h4 className="font-medium">Diverse Data Validation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a framework for validating and documenting training datasets to ensure representation of different agricultural regions, crop varieties, and farming practices.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Farmer-Centric Explainability</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed agricultural-specific explainability tools that communicate AI recommendations in practical, non-technical language appropriate for farming audiences.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Safety Fallback Systems</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created robust fallback mechanisms for autonomous equipment and chemical application systems that ensure safe operation even when connectivity or sensor data is compromised.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Field Validation Protocols</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established comprehensive field testing methodologies to validate AI system performance across diverse environmental conditions and operational scenarios.
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
                  <Leaf className="h-5 w-5 text-primary" />
                  <CardTitle>Agricultural AI Governance</CardTitle>
                </div>
                <CardDescription>Specialized governance for farming AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Farm-specific risk assessment templates with environmental impact sections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Integrated governance framework connecting AI Act with agricultural regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Seasonal variation assessment protocols for AI system performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Cross-border agricultural regulation compliance mapping tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <CardTitle>Crop Analysis Compliance</CardTitle>
                </div>
                <CardDescription>Ensuring reliable crop health systems</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Detection accuracy monitoring across different crop varieties and growth stages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Disease and pest identification performance validation frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Responsible treatment recommendation guidelines and constraints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>False positive/negative impact assessment for intervention recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="h-5 w-5 text-primary" />
                  <CardTitle>Chemical Application Oversight</CardTitle>
                </div>
                <CardDescription>Safe and responsible input application</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Environmental impact documentation for chemical application decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Real-time monitoring of application rates with safety parameter constraints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Human override systems with simplified emergency controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Residue and runoff prediction analytics with environmental safeguards</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <CloudRain className="h-5 w-5 text-primary" />
                  <CardTitle>Weather-Resilient AI</CardTitle>
                </div>
                <CardDescription>Ensuring reliability in all conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Cross-weather validation protocols for all critical AI systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Performance degradation documentation under adverse conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Automated operational constraints based on weather conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Weather-related safety fallback mechanisms for autonomous systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Tractor className="h-5 w-5 text-primary" />
                  <CardTitle>Autonomous Equipment Safety</CardTitle>
                </div>
                <CardDescription>Ensuring safe farm automation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Comprehensive obstacle detection verification frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Field boundary respect validation with safety buffer zones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Human presence detection with multi-sensor redundancy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Emergency stop certification and validation tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-5 w-5 text-primary" />
                  <CardTitle>Rural-Optimized Human Oversight</CardTitle>
                </div>
                <CardDescription>Effective oversight in remote areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Offline-capable monitoring and control systems for limited connectivity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Simplified user interfaces designed for varying technical literacy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Local validation and emergency response capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Delayed synchronization protocols for intermittent connectivity</span>
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
                  <p className="text-sm text-muted-foreground">High-risk agricultural AI systems fully compliant with EU AI Act</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">31%</div>
                  <p className="text-sm text-muted-foreground">Average reduction in agrochemical usage through precision application</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">23%</div>
                  <p className="text-sm text-muted-foreground">Improvement in crop yield prediction accuracy across diverse conditions</p>
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
                      <h4 className="font-medium">Improved Environmental Outcomes</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The implementation of EU AI Act compliance for the Precision Application Control system led to more accurate targeting and reduced overspray. This resulted in a 31% average reduction in agrochemical usage across client farms while maintaining or improving crop protection efficacy. Environmental impact monitoring documented reduced chemical runoff in waterways adjacent to farms using the system by 47%.
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
                      <h4 className="font-medium">Enhanced Prediction Accuracy</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The data quality and validation requirements for the Harvest Prediction & Planning system led to significant improvements in forecast accuracy. Mean absolute percentage error (MAPE) in yield predictions decreased from 18.7% to 14.4%, while harvest timing predictions improved by 23%. These enhancements enabled more efficient resource planning, reduced waste, and improved market timing for AgroTech's customers.
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
                      <h4 className="font-medium">Rural-Optimized Human Oversight</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The human oversight implementation specifically designed for rural environments resulted in a system that remained effective despite connectivity challenges. The offline-capable monitoring and simplified interfaces led to an 86% successful intervention rate in situations requiring human judgment, compared to only 42% with the previous system. User satisfaction among farmers with limited technical background increased by 67%.
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
                      <h4 className="font-medium">Crop Health Analysis Improvements</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The comprehensive validation procedures implemented for the Crop Health Analysis System led to a 28% reduction in false positives for disease detection and a 19% improvement in early detection of nutrient deficiencies. These improvements enabled more targeted interventions, reducing unnecessary treatments while improving crop outcomes through earlier and more accurate detection of issues.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Business Impact</h3>
                <p className="mb-4">
                  Beyond regulatory compliance, AgroTech Solutions realized significant business benefits from the EU AI Act implementation:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Competitive Differentiation:</strong> AgroTech has positioned itself as a leader in responsible AI for agriculture, with 76% of customers citing compliance and environmental benefits as key factors in their purchasing decisions. Sales of high-risk AI systems increased by 18% following compliance certification.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Performance Optimization:</strong> The rigorous validation requirements improved overall AI system quality, resulting in more accurate disease detection, better chemical application control, and more precise harvest predictions. These improvements translated to quantifiable benefits for farmers including 8% average yield increases and 31% reduced chemical costs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Broader Market Access:</strong> By achieving early compliance with the EU AI Act, AgroTech gained access to environmentally sensitive markets and secured partnerships with major food producers requiring certified sustainable production methods. These new markets represented €23M in additional annual revenue.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Streamlined Development:</strong> The standardized compliance frameworks reduced duplication of effort across product lines, enabling faster development cycles for new features and products. Time-to-market for new AI capabilities decreased by 27% while development costs were reduced by 19%.</span>
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

export default AgricultureScenario;