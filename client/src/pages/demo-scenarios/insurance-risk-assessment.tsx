import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, Umbrella, ShieldCheck, FileSearch, PieChart, LineChart, BookCheck, UserCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AIJack } from '@/components/onboarding/ai-jack';

const InsuranceScenario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  // AI Jack message content based on current tab
  const getJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "AXA Insurance must ensure its high-risk AI systems for claims processing, risk assessment, and fraud detection comply with the EU AI Act to manage exposure across 15 European countries.";
      case 'challenges':
        return "AXA faces significant compliance challenges including algorithmic fairness in underwriting, model explainability, and navigating complex regulatory overlaps between the EU AI Act and insurance regulations.";
      case 'solution':
        return "Our solution provides AXA with a specialized insurance compliance framework that integrates EU AI Act requirements with existing insurance regulations across multiple jurisdictions.";
      case 'features':
        return "Key features for insurance companies include bias monitoring tools for underwriting algorithms, customized explainability interfaces, and cross-border compliance tracking systems.";
      case 'outcomes':
        return "By implementing our solution, AXA achieved full EU AI Act compliance while reducing model risk exposure and improving customer trust through enhanced transparency.";
      default:
        return "Welcome to the AXA Insurance case study. This major European insurer needed to comply with the EU AI Act for their high-risk AI systems in claims processing, risk assessment, and fraud detection.";
    }
  };
  
  // German translations for AI Jack
  const getGermanJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "AXA Versicherung muss sicherstellen, dass ihre KI-Systeme mit hohem Risiko für Schadenbearbeitung, Risikobewertung und Betrugserkennung dem EU AI Act entsprechen, um die Exposition in 15 europäischen Ländern zu managen.";
      case 'challenges':
        return "AXA steht vor erheblichen Compliance-Herausforderungen, darunter algorithmische Fairness bei der Risikoprüfung, Modellinterpretierbarkeit und die Navigation durch komplexe regulatorische Überschneidungen zwischen dem EU AI Act und Versicherungsvorschriften.";
      case 'solution':
        return "Unsere Lösung bietet AXA einen spezialisierten Compliance-Rahmen für Versicherungen, der die Anforderungen des EU AI Acts mit bestehenden Versicherungsvorschriften über mehrere Jurisdiktionen hinweg integriert.";
      case 'features':
        return "Zu den wichtigsten Funktionen für Versicherungsunternehmen gehören Tools zur Überwachung von Verzerrungen in Underwriting-Algorithmen, angepasste Erklärbarkeitsschnittstellen und Systeme zur Verfolgung der grenzüberschreitenden Compliance.";
      case 'outcomes':
        return "Durch die Implementierung unserer Lösung erreichte AXA die vollständige Einhaltung des EU AI Acts, reduzierte das Modellrisiko und verbesserte das Kundenvertrauen durch erhöhte Transparenz.";
      default:
        return "Willkommen zur AXA Versicherung Fallstudie. Dieser große europäische Versicherer musste den EU AI Act für seine KI-Systeme mit hohem Risiko in der Schadenbearbeitung, Risikobewertung und Betrugserkennung einhalten.";
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Insurance</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AXA Insurance</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Insurance | Enterprise (5,000+ employees) | Pan-European</span>
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
              <CardDescription>Background information on AXA Insurance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>AXA Insurance is one of Europe's largest insurance groups, providing a full range of insurance and asset management services to individuals and businesses. Operating in 15 European countries with over 50,000 employees globally, AXA serves more than 25 million customers across the continent. The company offers a comprehensive portfolio including life, health, property, casualty, and retirement products, with annual revenue exceeding €90 billion.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Claims Processing AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An advanced machine learning system that automates and accelerates insurance claims processing. The system analyzes claim documentation, validates coverage, evaluates damage assessments, detects potential fraud indicators, and determines appropriate settlement amounts. It processes approximately 60% of all claims with varying degrees of automation and human oversight based on complexity.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Financial Decision System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Risk Assessment Models</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sophisticated predictive modeling systems that evaluate insurance applicants' risk profiles for underwriting decisions. These models analyze hundreds of variables including demographic data, behavioral patterns, health indicators, property characteristics, and historical claims to determine policy eligibility, premium rates, and coverage terms.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Financial Risk System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Fraud Detection System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-powered system that identifies potential fraudulent insurance claims using pattern recognition, anomaly detection, and predictive analytics. The system flags suspicious claims for further investigation based on a complex set of indicators and behavioral patterns, helping to prevent fraudulent payouts while expediting legitimate claims.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Financial Security System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Customer Behavior Analysis</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A machine learning system that analyzes customer data to identify patterns in policy usage, claim frequency, life events, and other behaviors to predict customer needs, churn risk, and cross-selling opportunities. The system helps tailor personalized insurance offerings and preventive services to policyholders.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Customer Analytics System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>AXA's core insurance AI systems are classified primarily as high-risk under Article 6 of the EU AI Act, as they make or influence decisions about financial services access, rates, and claims that directly impact consumers' financial well-being. The systems process sensitive personal data across multiple jurisdictions, making compliance particularly complex. Additionally, insurance-specific regulatory requirements must be integrated with EU AI Act compliance, creating a multifaceted regulatory landscape.</p>
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
                  <AlertTitle>Significant Regulatory Exposure</AlertTitle>
                  <AlertDescription>
                    Multiple high-risk AI systems processing sensitive data across 15 countries with complex regulatory landscapes
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Algorithmic Fairness</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring risk assessment and claims processing algorithms don't discriminate based on protected characteristics or create unfair outcomes for certain demographic groups.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Model Explainability</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Making complex insurance risk models and claims decisions explainable to customers, regulators, and internal stakeholders.
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
                          Navigating complex interactions between EU AI Act, insurance regulations, data protection laws, and financial service requirements across multiple jurisdictions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Data Quality Management</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring the quality, representativeness, and fairness of training data used for insurance risk modeling and claims processing across diverse customer populations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Human Oversight Implementation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Designing effective human oversight systems for high-volume automated insurance decisions that balance efficiency with appropriate human judgment.
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
                          Managing compliance across 15 different European countries with potentially varying national implementations of the EU AI Act and insurance regulations.
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
              <CardDescription>How our platform addresses AXA Insurance's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">Insurance AI Systems Inventory</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted a comprehensive mapping of all AI systems across insurance operations, identifying four key systems requiring full EU AI Act compliance and classifying them by risk level and regulatory exposure.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Insurance-Specific Risk Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a specialized risk assessment methodology for insurance AI systems, with particular focus on fairness in underwriting, claims processing, and fraud detection across diverse demographic groups.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Integrated Regulatory Approach</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a unified compliance framework that integrates EU AI Act requirements with insurance-specific regulations, financial services laws, and data protection requirements across multiple jurisdictions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Tiered Human Oversight System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a risk-based human oversight framework that provides appropriate levels of human review for insurance decisions, with greater scrutiny for high-value claims, complex underwriting, and fraud investigations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Cross-Border Compliance Infrastructure</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established a centralized compliance platform with country-specific adaptations to manage variations in EU AI Act implementation and insurance regulations across all 15 operating countries.
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
                        <h4 className="font-medium">Insurance AI Explainability Tools</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed specialized explainability frameworks for insurance-specific decisions, providing clear rationales for underwriting, pricing, and claims outcomes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Customer Appeals Process</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a standardized process for customers to understand AI-driven insurance decisions and request human review of outcomes they believe are incorrect.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Fairness Monitoring System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Deployed an ongoing monitoring system that tracks algorithmic fairness across different demographic groups for all insurance operations and decisions.
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
                          Created comprehensive documentation templates and processes specifically designed for insurance AI systems, including testing methodologies and validation protocols.
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
                  <Umbrella className="h-5 w-5 text-primary" />
                  <CardTitle>Insurance AI Governance</CardTitle>
                </div>
                <CardDescription>Specialized governance for insurance AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Insurance-specific risk assessment templates aligned with actuarial standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Integrated governance framework connecting EU AI Act with insurance regulatory requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Cross-border compliance management for multi-jurisdiction insurance operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Automated tracking of compliance metrics across insurance decision systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle>Claims Processing Compliance</CardTitle>
                </div>
                <CardDescription>Ensuring fair and transparent claims decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Fairness monitoring across different claim types and policyholder demographics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Tiered human oversight framework based on claim complexity and value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Transparent explanation generators for automated claims decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Standardized appeals process with clear documentation requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileSearch className="h-5 w-5 text-primary" />
                  <CardTitle>Risk Model Compliance</CardTitle>
                </div>
                <CardDescription>Ensuring fair underwriting and pricing models</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Demographic parity analysis across all protected characteristics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Proxy discrimination detection in insurance risk variables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Data quality and representativeness assessment frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Actuarial validation protocols integrated with EU AI Act requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <CardTitle>Fraud Detection Safeguards</CardTitle>
                </div>
                <CardDescription>Balancing fraud prevention with fairness</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>False positive impact analysis across demographic groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Mandatory human review for all fraud determinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Evidence documentation requirements for fraud investigations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Clear explanation templates for fraud detection factors</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <CardTitle>Customer Analytics Ethics</CardTitle>
                </div>
                <CardDescription>Ethical use of customer behavior analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Transparency notifications for personalization and analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Customer data minimization and purpose limitation frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Ethical guidelines for behavior prediction and intervention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Customer opt-out mechanisms with clear documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookCheck className="h-5 w-5 text-primary" />
                  <CardTitle>Technical Documentation</CardTitle>
                </div>
                <CardDescription>Comprehensive insurance AI documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Insurance-specific model cards with actuarial validation data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Regulatory cross-reference tables mapping EU AI Act to insurance regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Data lineage tracking for insurance training datasets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Country-specific compliance evidence collections for each jurisdiction</span>
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
                  <p className="text-sm text-muted-foreground">High-risk insurance AI systems fully compliant with EU AI Act requirements</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">15</div>
                  <p className="text-sm text-muted-foreground">European countries with unified insurance AI governance framework</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">47%</div>
                  <p className="text-sm text-muted-foreground">Reduction in customer complaints about algorithmic insurance decisions</p>
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
                      <h4 className="font-medium">Enhanced Algorithmic Fairness</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implemented comprehensive fairness monitoring for insurance underwriting and claims processing, identifying and correcting biases across demographic groups. Statistical parity differences were reduced from 14.2% to 3.8% in pricing models, and claims approval rate disparities decreased by 63% across different policyholder groups.
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
                      <h4 className="font-medium">Transparent Decision Explanations</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Developed clear and accessible explanation systems for insurance decisions, making complex underwriting, pricing, and claims determinations understandable to policyholders. Customer satisfaction with decision explanations increased by 52%, and the rate of decision appeals decreased by 38% as customers gained better understanding of outcomes.
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
                        Implemented a tiered human oversight system that provides appropriate levels of human review based on decision complexity and impact. This approach allowed for meaningful human supervision of over 2.4 million automated insurance decisions annually while improving decision quality and reducing operational costs by 21%.
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
                      <h4 className="font-medium">Cross-Border Compliance Standardization</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Developed a unified compliance framework that accommodates variations in EU AI Act implementations across all 15 countries where AXA operates, reducing compliance management complexity by 68% while ensuring appropriate localization for country-specific requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Business Impact</h3>
                <p className="mb-4">
                  Beyond compliance, AXA realized significant business benefits from the EU AI Act implementation:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Improved Customer Trust:</strong> The fairness and transparency improvements led to a 23% increase in customer trust metrics and a 12% increase in customer retention rates, particularly among previously underserved demographic groups.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Higher Model Performance:</strong> The fairness and data quality improvements implemented for compliance also enhanced overall model performance, with fraud detection accuracy improving by 9.8% and claims processing efficiency increasing by 17%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Operational Efficiency:</strong> The standardized documentation and monitoring processes reduced compliance overhead by 43% and accelerated the deployment of new AI capabilities by providing clear governance guardrails.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Regulatory Leadership:</strong> AXA has established itself as an industry leader in responsible AI use, receiving recognition from both insurance regulators and EU authorities for its transparent and equitable approach to insurance AI applications.</span>
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

export default InsuranceScenario;