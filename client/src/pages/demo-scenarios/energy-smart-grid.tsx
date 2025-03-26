import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Zap, Shield, Cpu, Activity, LineChart, BookCheck, CircuitBoard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';

const EnergyScenario: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  const jackQuotes = {
    en: {
      intro: "Welcome to our EU AI Act Compliance solution demonstration for the energy sector. I'm Jack, your compliance guide. Today, we'll explore how EnergieNetz AG, a major European energy provider, successfully implemented our platform to align their AI systems with EU regulatory requirements.",
      urgency: "The EU AI Act is no longer on the horizon—it's here, with enforcement ramifications that energy companies simply cannot ignore. The financial penalties of up to 7% of global annual revenue for non-compliance could devastate even the largest utilities. But beyond penalties, there's reputational damage and potential operational shutdowns if your AI systems aren't compliant. Our platform provides immediate risk reduction and compliance acceleration that energy providers need RIGHT NOW, not months from now when enforcement actions begin.",
      benefits: "Our solution doesn't just protect you from penalties—it transforms compliance into competitive advantage. Within weeks, not years, you'll have fully traceable, documented AI systems that satisfy both regulators and customers. Don't let competitors gain the trust advantage while you're still figuring out what the regulations mean for your smart grid technologies.",
      callToAction: "Schedule your personalized compliance assessment today. Unlike generic solutions, we've developed sector-specific frameworks that understand the unique challenges of energy AI applications—from grid optimization to consumption forecasting. Let me walk you through how EnergieNetz AG achieved 100% compliance with their high-risk AI systems while actually improving their operational efficiency by 28%."
    },
    de: {
      intro: "Willkommen zu unserer EU-KI-Gesetz-Compliance-Lösungsdemonstration für den Energiesektor. Ich bin Jack, Ihr Compliance-Berater. Heute erkunden wir, wie EnergieNetz AG, ein großer europäischer Energieversorger, unsere Plattform erfolgreich implementiert hat, um ihre KI-Systeme mit den EU-Vorschriften in Einklang zu bringen.",
      urgency: "Das EU-KI-Gesetz ist keine Zukunftsmusik mehr – es ist da, mit Durchsetzungskonsequenzen, die Energieunternehmen einfach nicht ignorieren können. Die finanziellen Strafen von bis zu 7% des globalen Jahresumsatzes bei Nichteinhaltung könnten selbst die größten Versorgungsunternehmen ruinieren. Aber neben Strafen drohen Reputationsschäden und mögliche Betriebsschließungen, wenn Ihre KI-Systeme nicht konform sind. Unsere Plattform bietet die sofortige Risikominderung und Compliance-Beschleunigung, die Energieversorger JETZT brauchen, nicht erst in Monaten, wenn die Durchsetzungsmaßnahmen beginnen.",
      benefits: "Unsere Lösung schützt Sie nicht nur vor Strafen – sie verwandelt Compliance in einen Wettbewerbsvorteil. Innerhalb von Wochen, nicht Jahren, werden Sie vollständig nachvollziehbare, dokumentierte KI-Systeme haben, die sowohl Regulierungsbehörden als auch Kunden zufriedenstellen. Lassen Sie nicht zu, dass Wettbewerber den Vertrauensvorteil gewinnen, während Sie noch herausfinden, was die Vorschriften für Ihre Smart-Grid-Technologien bedeuten.",
      callToAction: "Vereinbaren Sie noch heute Ihre persönliche Compliance-Bewertung. Im Gegensatz zu allgemeinen Lösungen haben wir sektorspezifische Frameworks entwickelt, die die einzigartigen Herausforderungen von KI-Anwendungen im Energiebereich verstehen – von der Netzoptimierung bis zur Verbrauchsprognose. Lassen Sie mich Ihnen zeigen, wie EnergieNetz AG 100% Compliance für ihre Hochrisiko-KI-Systeme erreicht und gleichzeitig ihre betriebliche Effizienz um 28% verbessert hat."
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Energy</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">EnergieNetz AG</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Energy | Enterprise (10,000+ employees) | European Utility</span>
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
              <CardDescription>Background information on EnergieNetz AG</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>EnergieNetz AG is one of Europe's leading energy utilities, providing electricity, natural gas, and renewable energy solutions to over 15 million customers across 7 European countries. With more than 12,000 employees and annual revenue exceeding €45 billion, the company operates a vast infrastructure network including power plants, transmission lines, and an increasingly digitized smart grid system. EnergieNetz has made significant investments in renewable energy and digital transformation, with AI systems becoming central to their operations, energy management, and customer service strategies.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Smart Grid Management System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An advanced AI system that optimizes power distribution across the grid in real-time, balancing supply and demand, integrating renewable energy sources, and predicting potential failures or outages. The system makes autonomous decisions about load balancing, power routing, and emergency responses that directly impact critical infrastructure reliability.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Critical Infrastructure System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Energy Consumption Prediction</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A machine learning system that forecasts energy demand patterns at regional, city, and individual customer levels. These predictions inform energy production planning, grid management, and pricing strategies. The system analyzes historical consumption data, weather patterns, economic indicators, and special events to optimize energy production and distribution.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Resource Management System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Predictive Maintenance AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-powered system that predicts potential failures in power generation and distribution equipment before they occur. The system analyzes sensor data, operational patterns, environmental conditions, and component lifespans to schedule maintenance activities, prevent outages, and extend infrastructure lifespan.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Safety-Critical System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Customer Energy Management Platform</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A consumer-facing AI system that helps residential and commercial customers optimize their energy usage and reduce costs. The platform analyzes consumption patterns, provides personalized recommendations for energy efficiency, and enables participation in demand response programs. It also integrates with smart home devices and renewable energy installations.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Limited Risk (Article 6)</Badge>
                      <Badge variant="outline">Consumer Service System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>As an operator of critical energy infrastructure, EnergieNetz faces significant exposure under the EU AI Act. Three of their four core AI systems are classified as high-risk under Article 6, as they manage essential public infrastructure and impact critical services. The company must comply with stringent requirements including risk management, data governance, human oversight, technical documentation, and transparency. Non-compliance could result in penalties of up to 7% of global annual revenue, operational restrictions, and reputational damage. Additionally, as an energy provider operating across multiple European countries, EnergieNetz must navigate potentially varying national implementations of the EU AI Act.</p>
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
                  <AlertTitle>Critical Infrastructure Responsibility</AlertTitle>
                  <AlertDescription>
                    Energy grid AI systems directly affect public safety and essential services across multiple countries
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Complex Technical Systems</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Documenting and explaining complex ML models that balance multiple variables across vast grid networks with tens of thousands of data points.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Safety-Critical Systems</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Meeting stringent requirements for AI systems where failures could cause power outages affecting hospitals, public safety, and other essential services.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Regulatory Overlap</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Navigating complex interactions between EU AI Act, energy sector regulations, critical infrastructure laws, and cybersecurity requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Human Oversight Implementation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Designing effective human oversight mechanisms for automated grid management systems that make thousands of decisions per minute.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Legacy System Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bringing older energy infrastructure components with embedded AI capabilities into compliance with new EU AI Act requirements.
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
                          Managing compliance across 7 different European countries with interconnected energy systems and potentially varying national implementations.
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
              <CardDescription>How our platform addresses EnergieNetz's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">Energy AI Inventory & Risk Classification</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted comprehensive mapping of all AI systems in the energy infrastructure and operations, identifying 3 high-risk systems requiring full EU AI Act compliance and 1 limited-risk system with transparency obligations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Critical Infrastructure Risk Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a specialized risk assessment methodology for energy grid AI systems, with particular focus on safety, reliability, and resilience considerations for critical infrastructure.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Real-time Oversight Implementation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a tiered human oversight system for the Smart Grid Management System that balances autonomy for normal operations with appropriate human intervention for unusual or high-impact decisions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Technical Documentation Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented comprehensive documentation practices for all AI systems, including model specifications, training data characteristics, validation methodologies, and performance metrics tailored to energy sector requirements.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Integrated Regulatory Compliance System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a unified compliance framework that addresses EU AI Act requirements alongside energy sector regulations, critical infrastructure protections, and cybersecurity standards across all operating countries.
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
                        <h4 className="font-medium">Legacy System Compliance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a methodology for evaluating and upgrading legacy grid components with AI capabilities to meet EU AI Act requirements without disrupting essential services.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Grid Decision Explainability</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented specialized explainability tools for grid management decisions, making complex power distribution algorithms transparent to operators and regulators.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Continuous Monitoring System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created an automated monitoring framework that tracks AI system performance, detects drift, and ensures ongoing compliance with EU AI Act requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cross-Border Adaptability</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a flexible compliance approach that accommodates variations in national implementations of the EU AI Act across all 7 operating countries.
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
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Smart Grid Compliance</CardTitle>
                </div>
                <CardDescription>Specialized tools for energy grid AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Grid-specific risk assessment templates with critical infrastructure parameters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Real-time oversight dashboards for autonomous grid management decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Decision visualization tools for complex power distribution algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Failure impact modeling for critical grid management decisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Critical Infrastructure Protection</CardTitle>
                </div>
                <CardDescription>Ensuring safe and reliable energy supply</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Enhanced safety monitoring for AI-managed power distribution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Integration with emergency response and disaster recovery systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Reliability metrics tracking for AI predictions and recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Scenario testing framework for grid resilience during extreme events</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <CardTitle>Energy AI Documentation</CardTitle>
                </div>
                <CardDescription>Comprehensive technical compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Energy-specific model cards with grid performance metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Training data documentation with energy consumption patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Legacy system integration documentation and risk assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Cross-border data exchange and model sharing documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>Predictive Maintenance Compliance</CardTitle>
                </div>
                <CardDescription>Safe and reliable equipment predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Failure prediction accuracy monitoring and documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Safety impact assessment for maintenance prioritization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Human oversight integration for critical maintenance decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Model drift detection for equipment condition prediction</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <CardTitle>Consumption Forecasting Governance</CardTitle>
                </div>
                <CardDescription>Responsible energy demand prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Forecast accuracy monitoring across different customer segments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Environmental factor analysis for demand prediction models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Data quality assessment for consumption pattern analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Bias detection in demand response program recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <CircuitBoard className="h-5 w-5 text-primary" />
                  <CardTitle>Legacy System Integration</CardTitle>
                </div>
                <CardDescription>Bringing older grid AI into compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Legacy component assessment methodology for AI capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Retrofit compliance solutions for embedded intelligence systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Phase-out planning for non-compliant critical components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Documentation recovery for previously undocumented AI systems</span>
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
                  <p className="text-sm text-muted-foreground">High-risk energy AI systems fully compliant with EU AI Act requirements</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">28%</div>
                  <p className="text-sm text-muted-foreground">Increase in operational efficiency through improved AI governance</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">€11.3M</div>
                  <p className="text-sm text-muted-foreground">Estimated annual savings from optimized compliance processes</p>
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
                      <h4 className="font-medium">Enhanced Grid Reliability</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The implementation of the EU AI Act compliance framework for the Smart Grid Management System led to more robust oversight and validation processes. This resulted in a 23% reduction in AI-related decision errors, contributing to a 99.998% grid reliability rating – the highest in EnergieNetz's history. Emergency response capabilities also improved, with outage resolution times decreasing by 34%.
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
                      <h4 className="font-medium">Improved Predictive Accuracy</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The data quality and documentation requirements for the Energy Consumption Prediction system led to significant improvements in forecast accuracy. Mean absolute percentage error (MAPE) in consumption forecasts decreased from 4.8% to 2.1%, enabling more precise energy production planning and reducing both costs and environmental impact. The system now successfully integrates renewable energy sources with 41% greater efficiency.
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
                      <h4 className="font-medium">Optimized Maintenance Operations</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The compliance improvements to the Predictive Maintenance AI system led to a 28% increase in true positive equipment failure predictions while reducing false positives by 47%. This optimization resulted in annual maintenance cost savings of €8.2 million while extending average equipment lifespan by 15%. Documentation requirements also uncovered previously unidentified patterns in equipment failures, enabling proactive design improvements.
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
                      <h4 className="font-medium">Cross-Border Harmonization</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        The unified compliance framework developed for EnergieNetz successfully accommodates variations in EU AI Act implementation across all 7 operating countries. This harmonization reduced compliance management complexity by 64% while ensuring appropriate localization for country-specific requirements. It also enabled more efficient cross-border energy trading and grid balancing operations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Business Impact</h3>
                <p className="mb-4">
                  Beyond regulatory compliance, EnergieNetz realized significant business benefits from its EU AI Act implementation:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Enhanced Innovation Culture:</strong> The structured governance and documentation processes accelerated AI system development by providing clear guardrails and requirements. This led to a 37% increase in successful AI project implementations and a 42% reduction in project timeline delays.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Improved Stakeholder Trust:</strong> Transparent AI practices and documentation led to a 47% increase in regulator confidence metrics and a 31% improvement in customer trust scores, particularly for smart grid operations and dynamic pricing programs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Operational Excellence:</strong> The rigorous validation requirements improved overall AI system quality, contributing to a 28% increase in operational efficiency through better decision-making and resource allocation, particularly in grid management and maintenance operations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Industry Leadership:</strong> EnergieNetz has established itself as an industry leader in responsible AI use in critical infrastructure, receiving recognition from energy regulators, European authorities, and industry associations for its transparent and robust approach to AI governance.</span>
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

export default EnergyScenario;