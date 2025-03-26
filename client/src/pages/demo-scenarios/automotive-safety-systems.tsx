import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Car, Shield, GitMerge, Target, Cog, GitCommit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';

const AutomotiveScenario: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  const jackQuotes = {
    en: {
      intro: "Welcome to our EU AI Act Compliance solution demonstration for the automotive industry. I'm Jack, your compliance guide. Today, we'll explore how Mercedes-Benz, a leading global automotive manufacturer, successfully implemented our platform to ensure their advanced vehicle AI systems meet EU regulatory requirements.",
      urgency: "The EU AI Act is now a reality, presenting urgent compliance challenges that automotive manufacturers cannot afford to delay addressing. With the automotive sector specifically targeted in the regulation due to safety-critical AI systems, your company faces imminent legal exposure. Non-compliance penalties of up to 7% of global revenue could translate to billions in fines for major manufacturers, not to mention potential production halts and vehicle recalls. Every day of operation with non-compliant AI systems increases your legal exposure and safety risks.",
      benefits: "Our solution doesn't just protect you from regulatory penalties—it transforms your AI compliance into a competitive advantage that builds consumer trust. We provide automotive-specific frameworks that translate complex regulatory requirements into industry-specific implementations. With our platform, you'll achieve compliance in weeks instead of years, while simultaneously improving your advanced driver assistance systems and autonomous driving capabilities.",
      callToAction: "Schedule your personalized compliance assessment today. Unlike generic consultants, we've built sector-specific frameworks that understand the unique challenges of automotive AI applications—from lane assist to autonomous driving systems. Let me show you how Mercedes-Benz achieved 100% compliance across their safety-critical AI systems while enhancing their vehicle performance and reducing development cycles by 35%."
    },
    de: {
      intro: "Willkommen zu unserer EU-KI-Gesetz-Compliance-Lösungsdemonstration für die Automobilindustrie. Ich bin Jack, Ihr Compliance-Berater. Heute werden wir erkunden, wie Mercedes-Benz, ein führender globaler Automobilhersteller, unsere Plattform erfolgreich implementiert hat, um sicherzustellen, dass ihre fortschrittlichen Fahrzeug-KI-Systeme die EU-Regulierungsanforderungen erfüllen.",
      urgency: "Das EU-KI-Gesetz ist jetzt Realität und stellt dringende Compliance-Herausforderungen dar, deren Bewältigung Automobilhersteller nicht verzögern können. Da der Automobilsektor aufgrund sicherheitskritischer KI-Systeme speziell in der Verordnung angesprochen wird, ist Ihr Unternehmen unmittelbar rechtlichen Risiken ausgesetzt. Strafen für Nichteinhaltung von bis zu 7% des globalen Umsatzes könnten für große Hersteller Milliarden an Bußgeldern bedeuten, ganz zu schweigen von möglichen Produktionsstopps und Fahrzeugrückrufen. Jeder Tag des Betriebs mit nicht konformen KI-Systemen erhöht Ihr rechtliches Risiko und die Sicherheitsrisiken.",
      benefits: "Unsere Lösung schützt Sie nicht nur vor regulatorischen Strafen – sie verwandelt Ihre KI-Compliance in einen Wettbewerbsvorteil, der Verbrauchervertrauen aufbaut. Wir bieten automobilspezifische Frameworks, die komplexe regulatorische Anforderungen in branchenspezifische Implementierungen übersetzen. Mit unserer Plattform erreichen Sie Compliance in Wochen statt Jahren und verbessern gleichzeitig Ihre fortschrittlichen Fahrerassistenzsysteme und autonomen Fahrfähigkeiten.",
      callToAction: "Vereinbaren Sie noch heute Ihre persönliche Compliance-Bewertung. Im Gegensatz zu allgemeinen Beratern haben wir sektorspezifische Frameworks entwickelt, die die einzigartigen Herausforderungen von KI-Anwendungen im Automobilbereich verstehen – vom Spurassistenten bis zu autonomen Fahrsystemen. Lassen Sie mich Ihnen zeigen, wie Mercedes-Benz 100% Compliance bei ihren sicherheitskritischen KI-Systemen erreicht und gleichzeitig ihre Fahrzeugleistung verbessert und Entwicklungszyklen um 35% reduziert hat."
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
          <span className="text-muted-foreground">Automotive | Enterprise (100,000+ employees) | Global Manufacturer</span>
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
              <CardDescription>Background information on Mercedes-Benz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>Mercedes-Benz is one of the world's leading luxury vehicle manufacturers headquartered in Stuttgart, Germany. With a global workforce exceeding 170,000 employees and annual revenue of approximately €150 billion, the company operates manufacturing facilities in 17 countries and sells vehicles in nearly every market worldwide. Mercedes-Benz has a strong heritage of innovation, with significant recent investments in electrification, autonomous driving technologies, and connected vehicle systems.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Advanced Driver Assistance Systems (ADAS)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A comprehensive suite of AI-powered safety and assistance features including adaptive cruise control, lane keeping assistance, automated emergency braking, blind spot detection, and driver attention monitoring. These systems use computer vision, sensor fusion, and deep learning to interpret the vehicle's environment and take safety-critical actions, either by alerting the driver or intervening directly.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Safety-Critical System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Autonomous Driving System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A Level 3 conditional automation system that enables supervised autonomous driving on highways and in traffic jams. The system can control vehicle speed, steering, and braking without driver input under defined conditions, but requires driver availability for takeover when needed. It relies on a complex array of AI technologies including perception, prediction, path planning, and decision-making algorithms.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Vehicle Control System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Predictive Vehicle Health Monitoring</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-based system that continuously monitors vehicle component health, analyzing sensor data to predict potential failures before they occur. The system uses machine learning algorithms to identify patterns indicative of developing issues, enabling proactive maintenance recommendations and preventing safety-critical failures in vehicle operation.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Safety Monitoring System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Personalized Driver Experience</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI system that learns driver preferences and behaviors to personalize the in-vehicle experience. The system adapts seat positions, climate settings, entertainment options, navigation preferences, and driving dynamics based on identified patterns and explicit user choices. It integrates with other vehicle systems to create a cohesive experience tailored to individual drivers.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Limited Risk (Article 52)</Badge>
                      <Badge variant="outline">User Experience System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>Mercedes-Benz faces significant regulatory exposure under the EU AI Act, with three of its four key AI systems classified as high-risk under Article 6. These systems directly impact vehicle safety and control, making them subject to stringent requirements for risk management, data quality, technical documentation, human oversight, accuracy, and robustness. The company's global presence and EU market importance make compliance especially critical, with potential penalties reaching billions of euros. Additionally, as vehicles have long lifecycles, Mercedes-Benz must address compliance for both new models in development and existing vehicles already in the market.</p>
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
                    Vehicle safety systems directly impact human lives, requiring exceptionally rigorous compliance measures
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">System Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Documenting and validating highly complex autonomous driving algorithms with millions of parameters and emergent behaviors.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Real-world Robustness</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring AI systems function reliably across all driving conditions, weather scenarios, and edge cases encountered globally.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Continuous Updates</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Managing compliance for over-the-air software updates that modify AI system behavior in vehicles already on the road.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Human-Machine Interaction</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Designing compliant human oversight systems for autonomous driving features that may require immediate driver takeover.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Supply Chain Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring compliance across complex supply chains with hundreds of Tier 1-3 suppliers providing AI components and subsystems.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Regulatory Harmonization</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Aligning EU AI Act requirements with existing automotive regulations like UNECE standards and type approval processes.
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
                        <h4 className="font-medium">Automotive AI Systems Inventory</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive mapping of all AI systems across vehicle platforms, identifying four key systems requiring EU AI Act compliance and classifying them by risk level and regulatory exposure.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Vehicle Safety Risk Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a specialized risk assessment methodology for automotive AI systems, with particular focus on safety-critical functions, edge case performance, and driver interaction scenarios.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Regulatory Integration Approach</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a unified compliance framework that integrates EU AI Act requirements with automotive-specific regulations like UNECE standards, type approval processes, and functional safety requirements.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Driver-AI Interaction Design</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a human oversight framework for autonomous driving systems that provides appropriate levels of human control, clear handover protocols, and comprehensive monitoring of system limitations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Lifecycle Compliance Management</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established a comprehensive system for managing AI compliance throughout the vehicle lifecycle, including development, production, over-the-air updates, and field monitoring of deployed systems.
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
                        <h4 className="font-medium">Supplier Compliance Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a standardized approach for ensuring EU AI Act compliance across all AI components and subsystems provided by third-party suppliers.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Comprehensive Testing Approach</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented rigorous validation methodologies that combine simulation, closed-track testing, and real-world monitoring to verify AI system performance.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Update Validation System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a specialized process for validating over-the-air updates to ensure all changes to AI systems maintain regulatory compliance throughout the vehicle lifecycle.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Technical Documentation System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented comprehensive documentation practices for all AI systems, including model cards, training data information, and validation results for regulatory submission.
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
                  <Car className="h-5 w-5 text-primary" />
                  <CardTitle>Automotive AI Governance</CardTitle>
                </div>
                <CardDescription>Specialized governance for vehicle AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Vehicle-specific risk assessment templates aligned with safety standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Integrated governance connecting EU AI Act with automotive regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Cross-functional review boards for safety-critical AI approvals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Change management processes for AI algorithm modifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>ADAS Compliance Tools</CardTitle>
                </div>
                <CardDescription>Ensuring safety system compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Safety performance monitoring across different driving scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Edge case identification and documentation frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Explainability tools for driver assistance decision-making</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Intervention monitoring and override documentation systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <GitMerge className="h-5 w-5 text-primary" />
                  <CardTitle>Autonomous Driving Oversight</CardTitle>
                </div>
                <CardDescription>Ensuring compliant self-driving systems</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Driver attention monitoring and handover validation frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Operational design domain documentation and compliance tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Decision verification and explainability for autonomous actions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Minimum risk maneuver documentation and validation tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Predictive Maintenance Compliance</CardTitle>
                </div>
                <CardDescription>Safe and reliable component monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Failure prediction accuracy monitoring and validation tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Safety component prioritization and critical alert frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Sensor data quality assessment and validation systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>False positive/negative impact analysis for maintenance alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Cog className="h-5 w-5 text-primary" />
                  <CardTitle>Supplier Compliance Management</CardTitle>
                </div>
                <CardDescription>Ensuring compliant AI components</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Supplier qualification frameworks for AI component compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Component-level documentation requirements and templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Integration testing protocols for third-party AI systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Supply chain risk monitoring and compliance validation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <GitCommit className="h-5 w-5 text-primary" />
                  <CardTitle>Over-the-Air Update Management</CardTitle>
                </div>
                <CardDescription>Maintaining compliance post-deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Update validation frameworks with pre-deployment compliance checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Performance comparison tools between AI system versions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Rollback mechanisms and contingency planning for field updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>In-field monitoring systems for deployed algorithm performance</span>
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
                  <p className="text-sm text-muted-foreground">High-risk automotive AI systems fully compliant with EU AI Act</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">35%</div>
                  <p className="text-sm text-muted-foreground">Reduction in AI system development and validation cycles</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">42%</div>
                  <p className="text-sm text-muted-foreground">Increase in driver trust ratings for autonomous features</p>
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
                      <h4 className="font-medium">Enhanced ADAS Safety Performance</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The implementation of EU AI Act compliance for Advanced Driver Assistance Systems led to more robust testing and validation procedures. This resulted in a 27% reduction in false positive interventions and a 31% improvement in detection accuracy for critical safety scenarios. The standardized testing methodology identified previously undetected edge cases, enabling preemptive corrections before deployment.
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
                      <h4 className="font-medium">Accelerated Development Cycles</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        By implementing standardized validation frameworks and documentation templates early in the development process, Mercedes-Benz reduced AI system development and validation cycles by 35%. This was achieved through front-loading compliance requirements into the design phase, enabling parallel development and validation activities, and creating reusable compliance assets across vehicle platforms.
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
                      <h4 className="font-medium">Effective Human-AI Interaction</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The human oversight implementation for autonomous driving features resulted in clearer driver communication, more intuitive handover protocols, and improved driver monitoring systems. This led to a 42% increase in driver trust ratings, a 48% improvement in takeover performance metrics, and a 29% reduction in disengagement rates during autonomous operation.
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
                      <h4 className="font-medium">Streamlined Supplier Management</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The supplier compliance framework enabled effective management of AI components across the supply chain, reducing compliance verification time by 58% while improving documentation quality. The standardized approach for supplier qualification ensured consistent EU AI Act compliance across all third-party components while strengthening collaborative development practices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Business Impact</h3>
                <p className="mb-4">
                  Beyond regulatory compliance, Mercedes-Benz realized significant business benefits from the EU AI Act implementation:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Market Differentiation:</strong> By achieving early compliance and using it as a quality hallmark, Mercedes-Benz strengthened its brand position as a technology and safety leader. Customer surveys showed a 23% increase in perceived value of compliant AI features compared to competitors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Development Efficiency:</strong> The standardized compliance frameworks reduced duplication of effort across vehicle programs, enabling a 35% reduction in development cycles and a 22% decrease in verification costs for AI systems.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Enhanced Customer Experience:</strong> The transparency and human oversight improvements led to better driver understanding and trust in AI systems, resulting in a 31% increase in feature usage and a 42% improvement in customer satisfaction with advanced driving features.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Regulatory Leadership:</strong> Mercedes-Benz has established itself as an industry leader in responsible AI use in automotive applications, actively participating in regulatory discussions and helping shape implementation standards that balance innovation with safety requirements.</span>
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

export default AutomotiveScenario;