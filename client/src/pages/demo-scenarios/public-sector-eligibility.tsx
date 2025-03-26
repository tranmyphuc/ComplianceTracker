import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Landmark, Users, MapPin, ClipboardList, Scale, BookOpen, ScrollText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AIJack } from '@/components/onboarding/ai-jack';

const PublicSectorScenario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  // AI Jack message content based on current tab
  const getJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "The Municipality of Metropolis needs to ensure its high-risk AI systems for benefit eligibility and urban planning comply with the EU AI Act to protect citizen rights and maintain public trust.";
      case 'challenges':
        return "This public sector entity faces unique compliance challenges including social fairness, heightened transparency expectations, and implementing effective human oversight with limited technical resources.";
      case 'solution':
        return "Our solution provides Metropolis with specialized public sector compliance including a fairness assessment methodology for benefit eligibility systems and a citizen-facing transparency portal.";
      case 'features':
        return "Key features for public sector entities include algorithmic impact assessment tools, public transparency interfaces, and tiered human oversight systems to handle high-volume decisions.";
      case 'outcomes':
        return "By implementing our solution, Metropolis achieved full EU AI Act compliance while ensuring their AI systems maintain high standards of fairness and transparency for all citizens.";
      default:
        return "Welcome to the Municipality of Metropolis case study. This public sector entity needed to comply with the EU AI Act for their high-risk AI systems in benefits eligibility and urban planning.";
    }
  };
  
  // German translations for AI Jack
  const getGermanJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "Die Stadtverwaltung von Metropolis muss sicherstellen, dass ihre KI-Systeme mit hohem Risiko für Leistungsansprüche und Stadtplanung dem EU AI Act entsprechen, um die Bürgerrechte zu schützen und das Vertrauen der Öffentlichkeit zu erhalten.";
      case 'challenges':
        return "Diese öffentliche Einrichtung steht vor einzigartigen Compliance-Herausforderungen, darunter soziale Fairness, erhöhte Transparenzanforderungen und die Implementierung einer effektiven menschlichen Aufsicht mit begrenzten technischen Ressourcen.";
      case 'solution':
        return "Unsere Lösung bietet Metropolis eine spezialisierte Compliance für den öffentlichen Sektor, einschließlich einer Fairness-Bewertungsmethodik für Anspruchsberechtigungssysteme und eines bürgerorientierten Transparenzportals.";
      case 'features':
        return "Zu den wichtigsten Funktionen für Einrichtungen des öffentlichen Sektors gehören Tools zur Bewertung der algorithmischen Auswirkungen, öffentliche Transparenzschnittstellen und mehrstufige Aufsichtssysteme, um Entscheidungen mit hohem Volumen zu bewältigen.";
      case 'outcomes':
        return "Durch die Implementierung unserer Lösung erreichte Metropolis die vollständige Einhaltung des EU AI Act und stellte sicher, dass ihre KI-Systeme hohe Standards an Fairness und Transparenz für alle Bürger erfüllen.";
      default:
        return "Willkommen zur Fallstudie der Stadtverwaltung von Metropolis. Diese öffentliche Einrichtung musste dem EU AI Act für ihre KI-Systeme mit hohem Risiko bei der Anspruchsberechtigung für Leistungen und der Stadtplanung entsprechen.";
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Public Sector</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Municipality of Metropolis</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Public Sector | Large (1,000-5,000 employees) | European City</span>
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
        onValueChange={(value) => setCurrentTab(value)}>
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
              <CardDescription>Background information on Municipality of Metropolis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Organization Overview</h3>
                <p>The Municipality of Metropolis is a major European city government serving approximately 1.2 million citizens. With 3,200 employees across 18 departments, the municipality is responsible for a wide range of public services including social welfare, urban planning, public transportation, waste management, and citizen services. As part of its digital transformation strategy, Metropolis has implemented several AI systems to improve service delivery, optimize resource allocation, and enhance urban planning.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Benefits Eligibility Assessment</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An automated system that evaluates citizen applications for social welfare programs, housing assistance, and other municipal benefits. The system analyzes demographic data, financial information, family composition, employment status, and other factors to determine eligibility and benefit amounts. It processes approximately 75,000 applications annually and makes preliminary approval or rejection recommendations.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Public Service Allocation System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Urban Planning AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A machine learning system that analyzes city data to support urban planning decisions and zoning policies. The system integrates data from traffic patterns, population density, economic indicators, environmental factors, and infrastructure capacity to model the impact of potential urban development scenarios and generate recommendations for optimizing city resources.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Critical Infrastructure System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Public Resource Allocation System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-powered system that optimizes the allocation of limited public resources such as maintenance crews, emergency services, public transportation, and municipal staffing. The system uses historical data, real-time inputs, and predictive analytics to distribute resources efficiently across the city based on need, priority, and impact.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Resource Management System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>As a public sector entity using AI systems that directly impact citizens' access to essential services and influence critical infrastructure decisions, the Municipality of Metropolis faces significant exposure under the EU AI Act. All three of their primary AI systems are classified as high-risk under Article 6, requiring comprehensive compliance measures including human oversight, rigorous documentation, bias monitoring, and transparency. Additionally, as a public authority, the municipality faces heightened scrutiny and expectations regarding its use of AI systems affecting citizens.</p>
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
                  <AlertTitle>Critical Public Trust at Stake</AlertTitle>
                  <AlertDescription>
                    AI systems directly affecting citizen services and rights require exceptional transparency and fairness
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Social Fairness and Equity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring AI systems for benefits eligibility and resource allocation avoid discriminatory outcomes against vulnerable populations and marginalized communities.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Public Transparency Requirements</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Meeting heightened transparency expectations for public sector AI use while maintaining system security and preventing gaming of algorithms.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Complex Stakeholder Landscape</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Balancing the diverse needs of citizens, elected officials, municipal staff, and regulatory authorities in AI governance and oversight.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Conflicting Regulatory Requirements</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Navigating complex interactions between the EU AI Act, GDPR, local government regulations, and specific social welfare laws.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Limited Technical Resources</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Addressing compliance requirements with constrained public sector budgets and limited specialized AI expertise within the municipal workforce.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Human Oversight Implementation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Designing effective human oversight mechanisms for high-volume automated decision processes without creating overwhelming workloads for municipal staff.
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
              <CardDescription>How our platform addresses Metropolis's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">Public Sector AI Assessment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive assessment of all AI systems against EU AI Act requirements, with special attention to social impact and fairness considerations for vulnerable populations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Public Service Fairness Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a specialized fairness assessment methodology for public service eligibility systems, evaluating impacts across different demographic groups and socioeconomic factors.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Public Transparency Solution</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a citizen-facing transparency portal that explains AI system operations, decision factors, and appeal mechanisms in clear, accessible language appropriate for diverse citizen populations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Tiered Human Oversight System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a risk-based human oversight framework that prioritizes review of edge cases, high-impact decisions, and potential algorithmic biases without overwhelming municipal staff resources.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Regulatory Integration Platform</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a unified compliance approach that addresses EU AI Act requirements alongside GDPR, local government regulations, and social welfare laws to minimize duplicate efforts.
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
                        <h4 className="font-medium">Citizen Appeal Process</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Designed and implemented a standardized process for citizens to understand, question, and appeal automated eligibility decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Multi-Stakeholder Governance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established a diverse AI oversight committee including municipal staff, elected representatives, and citizen advocates.
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
                          Created comprehensive AI system documentation that meets both technical EU AI Act requirements and public sector transparency standards.
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
                          Delivered specialized training for public sector employees on AI oversight, bias detection, and citizen communication around algorithmic decisions.
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
                  <Landmark className="h-5 w-5 text-primary" />
                  <CardTitle>Public Sector AI Governance</CardTitle>
                </div>
                <CardDescription>Specialized governance for government AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Multi-stakeholder governance framework with elected official, staff, and citizen representation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Public sector AI impact assessment templates addressing social welfare and equity concerns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Integration with administrative law and public sector decision-making requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Procurement guidelines for acquiring compliant AI systems in the public sector</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Social Fairness Framework</CardTitle>
                </div>
                <CardDescription>Ensuring equitable public service delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Comprehensive bias detection across demographic groups and socioeconomic factors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Social impact assessment frameworks for benefit eligibility algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Community representation in algorithm design and testing processes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Ongoing monitoring of distributional impacts and equity measures</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>Urban Planning Compliance</CardTitle>
                </div>
                <CardDescription>Specialized tools for urban planning AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Neighborhood impact assessment metrics for urban planning decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Comprehensive documentation templates for urban planning algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Public consultation mechanisms for AI-influenced urban development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Environmental and accessibility impact monitoring for planning decisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <CardTitle>Resource Allocation Oversight</CardTitle>
                </div>
                <CardDescription>Ensuring fair public resource distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Geographic equity monitoring for municipal service distribution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Community-based validation frameworks for resource allocation decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Prioritization transparency tools explaining allocation logic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Human oversight mechanisms for critical resource decisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <CardTitle>Citizen Rights Protection</CardTitle>
                </div>
                <CardDescription>Safeguarding rights in automated decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Standardized appeal and reconsideration process for AI decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Plain language explanation generators for algorithmic decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Accessible alternative processes for digitally excluded citizens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Special protection mechanisms for vulnerable population access to services</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>Public Transparency Portal</CardTitle>
                </div>
                <CardDescription>Citizen-facing AI transparency tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Multilingual public AI register describing all municipal AI systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Citizen-friendly algorithm explainability tools with visual aids</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Decision factor documentation for all automated public services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Regular public reporting on AI system performance and impact</span>
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
              <CardDescription>Measurable results and public impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">High-risk AI systems fully documented and compliant with EU AI Act</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">62%</div>
                  <p className="text-sm text-muted-foreground">Increase in citizen trust in automated municipal decision-making</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">35%</div>
                  <p className="text-sm text-muted-foreground">Reduction in appeals against algorithmic benefit eligibility decisions</p>
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
                      <h4 className="font-medium">Enhanced Social Equity</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implemented comprehensive fairness monitoring for the benefits eligibility system, identifying and correcting biases that disproportionately affected immigrant populations, single-parent households, and the elderly. Statistical parity differences were reduced from 18.3% to 4.2% across demographic groups, and approval rate disparities decreased by 73%.
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
                      <h4 className="font-medium">Transparent Public Communication</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Developed a multilingual public AI registry and transparency portal that explains all municipal AI systems in clear, accessible language. The portal includes decision factors, oversight mechanisms, and appeal processes, resulting in a 62% increase in public trust metrics and a 35% reduction in information requests about automated decisions.
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
                      <h4 className="font-medium">Effective Human Oversight</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implemented a tiered human oversight system that prioritizes review of high-risk decisions and edge cases without overwhelming municipal resources. This approach allowed for meaningful human supervision of approximately 85,000 automated decisions annually with just 8 full-time equivalent staff, while improving decision quality and reducing appeal rates by 35%.
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
                      <h4 className="font-medium">Integrated Regulatory Compliance</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Successfully implemented a unified compliance approach that addresses EU AI Act requirements alongside GDPR, administrative law, and social welfare regulations. This integrated approach reduced compliance documentation overhead by 54% while improving the quality and coherence of governance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Public Impact</h3>
                <p className="mb-4">
                  Beyond compliance, the Municipality of Metropolis realized significant public benefits from the EU AI Act implementation:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Improved Service Delivery:</strong> The fairness and oversight improvements led to more accurate and equitable benefit determinations, with a 29% reduction in erroneous denials and a 42% decrease in processing time for legitimate applications.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Public Trust Leadership:</strong> Metropolis has positioned itself as a leader in responsible public sector AI use, receiving recognition from both the national government and EU institutions for its transparent and equitable approach to algorithmic governance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Enhanced Urban Planning:</strong> The improved governance of the urban planning AI system led to more balanced development decisions that better serve diverse community needs, with neighborhood satisfaction scores increasing by 18% across previously underserved areas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Resource Optimization:</strong> The compliant resource allocation system improved municipal service efficiency while ensuring equitable distribution, resulting in a 23% improvement in response times for critical services and a 16% reduction in operational costs.</span>
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

export default PublicSectorScenario;