
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, FileText, Check, AlertTriangle, ArrowRight, Users, ShieldAlert, BarChart } from 'lucide-react';
import { Link } from 'wouter';

const RetailScenario: React.FC = () => {
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
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">Medium Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Retail | Large (1,000-5,000 employees) | Operations in 8 EU Countries</span>
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
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Company Overview</h3>
            <p>
              EuroShop Retail Group is a leading omnichannel retailer with physical stores across 8 EU countries and a substantial online presence. With 3,500 employees and serving millions of customers, they have invested heavily in AI technologies to enhance customer experience and optimize their operations.
            </p>
            
            <h4 className="font-medium mt-6 mb-2">AI System Portfolio:</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Personalized Recommendation Engine</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI system that analyzes customer behavior and purchase history to deliver personalized product recommendations across digital channels.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Inventory Optimization AI</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Predictive system that forecasts demand and optimizes inventory levels across distribution centers and retail locations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Customer Segmentation & Targeting</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI that segments customers based on behavioral data and predicts propensity to purchase for targeted marketing campaigns.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Dynamic Pricing System</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Algorithmic system that adjusts product pricing based on demand, competition, and other market factors.
                  </p>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium mt-6 mb-2">Regulatory Context:</h4>
            <p className="text-sm text-muted-foreground">
              EuroShop's AI systems must comply with:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
              <li>EU AI Act provisions for medium and potentially high-risk systems</li>
              <li>GDPR requirements for customer data processing</li>
              <li>National consumer protection laws</li>
              <li>Digital Services Act provisions</li>
              <li>Emerging regulations on algorithmic pricing and targeting</li>
            </ul>
          </Card>
        </TabsContent>
        
        <TabsContent value="challenges" className="mt-6 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Key Compliance Challenges</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Regulatory Classification Uncertainty</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    EuroShop is uncertain whether their recommendation systems and dynamic pricing algorithms fall under high-risk categories in the EU AI Act. They need clarity about which specific requirements apply to their systems, particularly regarding consumer protection and potential manipulation concerns.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Balancing Personalization & Transparency</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Their recommendation and segmentation algorithms are key competitive assets. EuroShop struggles to balance the transparency requirements of the EU AI Act with protecting their proprietary algorithms and maintaining the effectiveness of their personalization systems.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Cross-Regulation Compliance</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    EuroShop needs to navigate the intersection of the EU AI Act with GDPR, the Digital Services Act, and various consumer protection regulations across multiple EU countries. They struggle to create a coherent compliance strategy that addresses all relevant regulatory requirements.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Dynamic System Management</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Their AI systems are constantly evolving with frequent updates to algorithms and data inputs. EuroShop needs to implement compliance measures that can adapt to these changes without creating excessive documentation burdens or disrupting business operations.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">User Information Requirements</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    EuroShop is concerned about how to appropriately inform consumers about AI-driven recommendations and pricing without creating information overload or negatively impacting user experience across their digital platforms and physical stores.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Fragmented Technical Ownership</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    EuroShop's AI systems are developed and managed by different internal teams and external vendors, creating challenges in establishing consistent compliance practices and clear accountability for regulatory requirements.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="solution" className="mt-6 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Solution Walkthrough</h3>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">AI System Mapping & Classification</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Our platform creates a comprehensive inventory of EuroShop's AI systems, with detailed assessments of risk classifications under the EU AI Act.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show the detailed risk classification analysis for their recommendation engine, 
                      highlighting specific articles of the EU AI Act that apply and explaining why certain 
                      features may elevate the risk classification based on consumer impact.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Cross-Regulation Compliance Framework</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Development of an integrated compliance framework that addresses EU AI Act requirements alongside GDPR, DSA, and consumer protection regulations.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Demonstrate the regulatory mapping matrix that shows overlapping requirements 
                      across different regulations and creates unified compliance actions that satisfy 
                      multiple regulatory frameworks simultaneously.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Transparency Implementation Strategy</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Creation of a balanced transparency approach that meets regulatory requirements while protecting proprietary algorithms and user experience.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show the layered transparency design templates for both digital interfaces and in-store 
                      communications, demonstrating how EuroShop can provide appropriate AI disclosures without 
                      overwhelming customers or revealing sensitive details.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Continuous Compliance Monitoring</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Implementation of automated monitoring tools that track algorithm changes, data inputs, and performance metrics against compliance requirements.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Demonstrate the continuous monitoring dashboard that automatically flags potential 
                      compliance issues when system updates occur, with version control tracking and 
                      documentation generation for regulatory submissions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">5</span>
                </div>
                <div>
                  <h4 className="font-medium">Governance Structure Implementation</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Development of a clear governance framework that establishes roles, responsibilities, and coordination mechanisms across different teams and vendors.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show the governance matrix tool that defines compliance responsibilities across the 
                      organization and creates accountability mechanisms for both internal teams and external 
                      vendors, with integrated approval workflows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-muted/50 p-5 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Retail AI Risk Classifier</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Specialized assessment framework for retail-specific AI applications like recommendation engines, dynamic pricing, and customer segmentation systems.
                  </p>
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-primary/10">Demo Highlight</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-5 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Multi-Regulation Compliance Mapper</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tool that aligns EU AI Act requirements with GDPR, DSA, and consumer protection regulations to create unified compliance actions.
                  </p>
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-primary/10">Demo Highlight</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-5 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Consumer Transparency Templates</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ready-to-implement disclosure templates for different customer touchpoints that satisfy regulatory requirements without overwhelming users.
                  </p>
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-primary/10">Demo Highlight</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-5 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Algorithm Change Monitor</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automated tool that tracks changes to AI algorithms and data inputs, flagging potential compliance implications and updating documentation.
                  </p>
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-primary/10">Demo Highlight</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="outcomes" className="mt-6 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Expected Outcomes & Results</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Regulatory Clarity</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Definitive risk classifications for all AI systems with clear understanding of applicable requirements across multiple regulatory frameworks.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Balanced Transparency</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Implementation of appropriate transparency measures that satisfy regulatory requirements while maintaining user experience and protecting proprietary algorithms.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Streamlined Compliance Process</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    65% reduction in compliance overhead through unified approaches that address multiple regulatory requirements simultaneously.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Continuous Compliance</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automated monitoring that maintains compliance even as AI systems evolve, with 90% reduction in documentation update time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Clear Accountability</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Established governance framework with defined roles and responsibilities across teams and vendors, eliminating compliance gaps.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Customer Trust Enhancement</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Improved customer perception through responsible AI disclosures, differentiating EuroShop as a trustworthy retailer.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-lg mt-8">
              <div className="flex items-start gap-3">
                <div className="text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700">Client Testimonial</h4>
                  <p className="text-sm text-blue-600 mt-2 italic">
                    "The EU AI Act initially seemed like it would restrict our ability to deliver personalized customer experiences. With this compliance platform, we've found a way to meet regulatory requirements while preserving our competitive edge in customer personalization and even strengthening consumer trust."
                  </p>
                  <p className="text-sm text-blue-700 mt-2 font-medium">
                    — Digital Innovation Director, EuroShop Retail Group
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetailScenario;
