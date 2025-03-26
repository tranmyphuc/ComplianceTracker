import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, ShoppingBag, Package, PieChart, Layers, Database, UserCheck, LineChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AIJack } from '@/components/onboarding/ai-jack';

const RetailScenario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  
  // AI Jack message content based on current tab
  const getJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "EuroShop Retail Group operates recommendation engines and dynamic pricing systems that are classified as medium-risk under the EU AI Act. They need to ensure these systems are fair and transparent.";
      case 'challenges':
        return "EuroShop faces challenges with ensuring algorithmic fairness across customer demographics, maintaining pricing transparency, and managing compliance in 9 different European countries.";
      case 'solution':
        return "Our solution provides EuroShop with specialized fairness assessment frameworks for retail recommendation systems and ethics guidelines for dynamic pricing algorithms.";
      case 'features':
        return "Key features for retail include fairness monitoring across customer segments, price optimization ethics tools, and comprehensive integration with existing GDPR compliance measures.";
      case 'outcomes':
        return "By implementing our solution, EuroShop achieved full EU AI Act compliance for their recommendation and pricing systems while improving customer satisfaction by 18%.";
      default:
        return "Welcome to the EuroShop Retail Group case study. This retail organization needed to comply with the EU AI Act for their medium-risk AI systems including recommendation engines and dynamic pricing.";
    }
  };
  
  // German translations for AI Jack
  const getGermanJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "Die EuroShop Retail Group betreibt Empfehlungssysteme und dynamische Preisgestaltungsalgorithmen, die gemäß dem EU AI Act als Systeme mit mittlerem Risiko eingestuft werden. Sie müssen sicherstellen, dass diese Systeme fair und transparent sind.";
      case 'challenges':
        return "EuroShop steht vor Herausforderungen, algorithmische Fairness über verschiedene Kundendemografien hinweg zu gewährleisten, Preistransparenz zu wahren und die Einhaltung von Vorschriften in 9 verschiedenen europäischen Ländern zu managen.";
      case 'solution':
        return "Unsere Lösung bietet EuroShop spezialisierte Fairness-Bewertungsrahmen für Empfehlungssysteme im Einzelhandel und Ethikrichtlinien für dynamische Preisalgorithmen.";
      case 'features':
        return "Zu den wichtigsten Funktionen für den Einzelhandel gehören Fairness-Monitoring über Kundensegmente hinweg, Ethik-Tools für die Preisoptimierung und umfassende Integration mit bestehenden GDPR-Compliance-Maßnahmen.";
      case 'outcomes':
        return "Durch die Implementierung unserer Lösung erreichte EuroShop die vollständige Einhaltung des EU AI Act für ihre Empfehlungs- und Preissysteme und verbesserte gleichzeitig die Kundenzufriedenheit um 18%.";
      default:
        return "Willkommen zur EuroShop Retail Group Fallstudie. Diese Einzelhandelsorganisation musste den EU AI Act für ihre KI-Systeme mit mittlerem Risiko einhalten, einschließlich Empfehlungssystemen und dynamischer Preisgestaltung.";
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Retail</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">EuroShop Retail Group</h1>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">Medium Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Retail | Large (1,000-5,000 employees) | Multinational</span>
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
              <CardDescription>Background information on EuroShop Retail Group</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>EuroShop Retail Group is a multinational retailer headquartered in Amsterdam, with operations across 9 European countries. Founded in 1975, the company has grown to include 230 physical stores and a robust e-commerce presence, employing approximately 3,800 people. EuroShop specializes in fashion, home goods, electronics, and personal care products, serving over 15 million customers annually with annual revenue exceeding €2.3 billion.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Customer Recommendation Engine</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A sophisticated machine learning system that analyzes customer browsing history, purchase patterns, demographic information, and preference data to deliver personalized product recommendations across both online and in-store channels. The system influences approximately 35% of all purchases and uses reinforcement learning to continuously optimize conversion rates.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Personalization System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Inventory Optimization System</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI-powered forecasting and inventory management solution that predicts demand patterns across different store locations, optimizes stock levels, and automates replenishment decisions. The system analyzes historical sales data, seasonal trends, local events, and external factors to ensure optimal product availability while minimizing overstock situations.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Resource Allocation System</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Dynamic Pricing Algorithm</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A real-time pricing optimization system that adjusts product prices based on factors including demand patterns, competitor pricing, inventory levels, product lifecycle, and margin requirements. The system manages pricing for over 50,000 SKUs and uses reinforcement learning to maximize revenue while maintaining competitive market positioning.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk (Article 6)</Badge>
                      <Badge variant="outline">Pricing Optimization System</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>EuroShop's AI systems primarily fall into the medium-risk category under the EU AI Act, with potential concerns around consumer influence, algorithmic fairness, and data protection. Their recommendation engine and dynamic pricing systems raise particular compliance concerns due to potential impacts on consumer behavior, price discrimination risks, and the processing of personal data for product recommendations. Additionally, as a multinational retailer, EuroShop must navigate varying implementations of the EU AI Act across different member states.</p>
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
                  <AlertTitle>Consumer Protection Concerns</AlertTitle>
                  <AlertDescription>
                    Ensuring recommendation and pricing systems don't manipulate consumer behavior in potentially harmful ways
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">AI Fairness Across Demographics</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ensuring recommendation algorithms don't discriminate or create unfair outcomes across different customer segments and demographics.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Pricing Transparency</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Maintaining appropriate transparency about dynamic pricing practices while protecting proprietary pricing algorithms and strategies.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Data Protection Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Balancing GDPR compliance with EU AI Act requirements for recommendation systems that process personal data from millions of customers.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cross-Border Compliance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Managing compliance across 9 different European countries with potentially varying national implementations of the EU AI Act.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Documentation Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Creating comprehensive technical documentation for complex recommendation and pricing algorithms with thousands of variables and frequent updates.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Continuous Monitoring at Scale</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implementing ongoing monitoring across multiple AI systems operating at massive scale with millions of daily predictions and decisions.
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
              <CardDescription>How our platform addresses EuroShop's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">Retail AI Compliance Assessment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted comprehensive mapping of all AI systems against EU AI Act requirements, with special attention to recommendation engines, dynamic pricing, and inventory management systems.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Consumer Fairness Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a specialized fairness assessment framework for retail recommendation systems, evaluating demographic parity, equal opportunity, and other fairness metrics across customer segments.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Pricing Ethics & Transparency System</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented a pricing ethics framework with guardrails against unfair practices, alongside a transparency system that provides appropriate disclosures about dynamic pricing.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Integrated Compliance Documentation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created comprehensive technical documentation for all medium-risk AI systems, with templates specifically designed for retail applications and integration with existing data protection documentation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Automated Monitoring Infrastructure</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Deployed a scalable monitoring system that tracks fairness metrics, algorithm performance, and compliance parameters across millions of AI-driven recommendations and pricing decisions daily.
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
                        <h4 className="font-medium">Multi-Country Compliance Mapping</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a comprehensive compliance matrix tracking EU AI Act implementations across all 9 operating countries, with country-specific adjustments where needed.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">GDPR-EUAIA Integration Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Developed a unified approach that addresses both GDPR and EU AI Act requirements for recommendation systems that process personal data.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Algorithmic Transparency Portal</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created a customer-facing transparency portal explaining recommendation and pricing practices in clear, accessible language without revealing proprietary details.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Executive Training Program</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Delivered specialized training for retail executives on EU AI Act implications for customer-facing AI technologies and marketing practices.
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
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <CardTitle>Retail AI Governance</CardTitle>
                </div>
                <CardDescription>Specialized governance for retail AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Retail-specific AI assessment templates for recommendation engines, pricing systems, and inventory management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Governance frameworks specifically designed for customer-facing retail AI applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Integration with existing retail compliance processes and e-commerce regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Omnichannel compliance frameworks that bridge online and physical retail environments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Recommendation Engine Compliance</CardTitle>
                </div>
                <CardDescription>Ensuring recommendation system fairness</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Demographic fairness analysis tools across customer segments and protected characteristics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Product recommendation diversity and filter bubble mitigation tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Dark pattern detection and remediation in recommendation interfaces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Customer-facing explanation and transparency controls for personalization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <CardTitle>Pricing Ethics Framework</CardTitle>
                </div>
                <CardDescription>Ensuring fair and transparent pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Dynamic pricing ethics guidelines with algorithmic guardrails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Price discrimination detection and prevention tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Pricing transparency templates that comply with EU AI Act requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Cross-border pricing compliance monitoring with market-specific rules</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <CardTitle>Inventory AI Compliance</CardTitle>
                </div>
                <CardDescription>Ensuring inventory system compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Predictive accuracy and performance monitoring for inventory forecasting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Resource allocation fairness across different store locations and markets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Documentation templates for inventory management AI systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Human oversight mechanisms for inventory replenishment decisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>Data Protection Integration</CardTitle>
                </div>
                <CardDescription>Combining AI and data protection compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Unified GDPR and EU AI Act assessment framework for retail applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Combined data protection impact and AI risk assessment templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Customer data governance frameworks for recommendation systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Cross-border data management compliance with country-specific requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <CardTitle>Continuous Monitoring</CardTitle>
                </div>
                <CardDescription>Scalable monitoring for retail AI systems</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>High-volume recommendation fairness monitoring with real-time alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Pricing pattern analysis with compliance threshold enforcement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Model drift detection for retail-specific applications and behaviors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span>Centralized compliance dashboard with cross-country monitoring</span>
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
                  <p className="text-sm text-muted-foreground">AI systems documented and compliant with EU AI Act requirements</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">43%</div>
                  <p className="text-sm text-muted-foreground">Reduction in recommendation and pricing bias across demographic segments</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">9</div>
                  <p className="text-sm text-muted-foreground">Countries with coherent, unified AI governance despite local variations</p>
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
                      <h4 className="font-medium">Enhanced Recommendation Fairness</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implemented comprehensive fairness monitoring for the recommendation engine, identifying and correcting biases in product recommendations across different demographic groups. Statistical parity differences were reduced from 12.7% to 5.2%, and recommendation diversity increased by 28%.
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
                      <h4 className="font-medium">Pricing Ethics Implementation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Established clear guardrails for the dynamic pricing system to prevent potentially discriminatory pricing patterns, with automated monitoring detecting and preventing problematic pricing scenarios. Price transparency increased customer trust scores by 31%, with a 24% reduction in pricing-related complaints.
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
                        Developed a unified compliance framework that accommodates variations in EU AI Act implementations across all 9 countries where EuroShop operates, reducing compliance management complexity by 65% while ensuring appropriate localization for country-specific requirements.
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
                      <h4 className="font-medium">GDPR and EU AI Act Integration</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Successfully implemented a unified approach to data protection and AI governance, creating integrated documentation and processes that address both GDPR and EU AI Act requirements for recommendation systems. This reduced compliance overhead by 47% and strengthened overall data governance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Business Impact</h3>
                <p className="mb-4">
                  Beyond compliance, EuroShop realized significant business benefits from the EU AI Act implementation:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Improved Customer Trust:</strong> The transparency portal and fairness improvements led to a 23% increase in customer trust metrics and a 17% increase in recommendation click-through rates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Ethical Brand Positioning:</strong> EuroShop has positioned itself as an ethical leader in retail AI, using their compliance as a marketing differentiator that has resonated with increasingly privacy-conscious European consumers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Better Algorithm Performance:</strong> The fairness and ethics improvements implemented for EU AI Act compliance also enhanced algorithm performance, with inventory forecasting accuracy improving by 8.5% and recommendation relevance scores increasing by 12%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5"><FileCheck className="h-4 w-4" /></span>
                    <span><strong>Streamlined Innovation:</strong> The clear compliance framework has accelerated new AI feature development by providing guardrails and validation methods for product teams, reducing time-to-market for new AI capabilities by 34%.</span>
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

export default RetailScenario;