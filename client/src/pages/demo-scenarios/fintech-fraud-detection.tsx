
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, FileText, Check, AlertTriangle, ArrowRight, Users, ShieldAlert } from 'lucide-react';
import { Link } from 'wouter';

const FintechScenario: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Financial Services</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">EuroBank Financial Services</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Financial Services | Large (1,000-5,000 employees) | Pan-European Operations</span>
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
              EuroBank Financial Services is a prominent financial institution operating across multiple EU countries. With over 3,000 employees and serving more than 5 million customers, they provide a comprehensive range of banking, lending, and investment services to both retail and corporate clients.
            </p>
            
            <h4 className="font-medium mt-6 mb-2">AI System Portfolio:</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Credit Scoring AI System</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advanced ML model that processes applicant data to determine credit risk and lending decisions. Has direct impact on financial opportunities for EU citizens.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Fraud Detection System</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Real-time transaction monitoring using behavioral analysis and anomaly detection to flag potential fraudulent activities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Anti-Money Laundering (AML) AI</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI system that monitors account behavior, identifies suspicious patterns, and helps comply with AML regulations.
                  </p>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium mt-6 mb-2">Regulatory Landscape:</h4>
            <p className="text-sm text-muted-foreground">
              As a financial institution operating in the EU, EuroBank must comply with multiple overlapping regulations:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
              <li>EU AI Act (systems classified as high-risk under Annex III)</li>
              <li>GDPR for data protection concerns</li>
              <li>Banking sector regulations</li>
              <li>National financial regulatory requirements</li>
              <li>European Banking Authority (EBA) guidelines</li>
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
                  <h4 className="font-medium">High-Risk Classification Uncertainty</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    EuroBank's credit scoring and fraud detection AI systems are clearly classified as high-risk under the EU AI Act, requiring enhanced compliance measures. However, there is ambiguity about whether certain components of their AML system also qualify as high-risk, creating uncertainty about the precise compliance requirements.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Algorithmic Transparency Requirements</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The EU AI Act requires "appropriate levels of transparency" for high-risk AI systems, but EuroBank struggles to balance this with the complexity of their ML models and proprietary algorithms. They need to demonstrate traceability and explainability without compromising competitive advantage or system security.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Cross-Border Compliance Complexity</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Operating in multiple EU countries creates complex compliance challenges as different national authorities may have varying interpretations of the EU AI Act requirements. EuroBank needs to maintain consistent documentation and risk management practices while addressing these national variations.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Legacy System Integration</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    EuroBank has incorporated AI capabilities into existing legacy banking systems, making it difficult to isolate and document AI components for compliance purposes. They need to determine clear system boundaries and establish appropriate testing and monitoring frameworks.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Human Oversight Implementation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Implementing meaningful human oversight for real-time, high-volume AI systems poses practical challenges. EuroBank needs to establish when and how human intervention occurs in automated decision processes while maintaining operational efficiency.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Financial Penalty Exposure</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    With penalties under the EU AI Act reaching up to €35M or 7% of global revenue, EuroBank faces significant financial risk from non-compliance. Their board requires assurance that all necessary measures are being implemented consistently across all systems and regions.
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
                  <h4 className="font-medium">Initial Assessment & System Inventory</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Our platform begins with a comprehensive inventory of EuroBank's AI systems, collecting key information about data sources, decision models, and deployment contexts. 
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show how the platform automatically maps each AI system to relevant EU AI Act provisions, 
                      clearly identifying high-risk systems requiring enhanced compliance measures.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Risk Classification & Gap Analysis</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    The platform applies a sophisticated classification framework to determine the exact risk level for each AI system component, then identifies compliance gaps.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Demonstrate the visual risk matrix showing how EuroBank's AML system components are assessed against specific criteria from Annex III of the EU AI Act, highlighting areas requiring additional compliance measures.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Cross-Border Compliance Mapping</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    The solution maps compliance requirements across different EU jurisdictions, creating a unified compliance framework that accounts for national variations.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show the interactive map feature that displays jurisdiction-specific implementation details and how EuroBank can maintain consistent documentation while addressing national interpretations.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Technical Documentation Generation</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    The platform generates comprehensive technical documentation that satisfies Article 11 requirements, including system architecture, data governance, and human oversight mechanisms.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Demonstrate how the platform creates tailored documentation packages for each AI system that balance transparency requirements with protection of proprietary algorithms.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">5</span>
                </div>
                <div>
                  <h4 className="font-medium">Continuous Compliance Monitoring</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Implementation of ongoing monitoring protocols that track system performance, detect potential compliance drifts, and provide alerts when regulatory updates occur.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show the real-time compliance dashboard that EuroBank's compliance team can use to monitor the status of all AI systems across different jurisdictions, with automated alerts for potential issues.
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
                  <h4 className="font-medium">Financial Services Risk Framework</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Specialized risk assessment framework tailored to financial AI applications, incorporating EU AI Act requirements alongside banking sector regulations.
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
                  <h4 className="font-medium">Cross-Border Compliance Manager</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tracks and manages compliance requirements across different EU jurisdictions, highlighting national variations in interpretation and implementation.
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
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Explainability Enhancement Tools</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tools to improve algorithmic transparency and model explainability without compromising intellectual property or security considerations.
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
                  <h4 className="font-medium">Human Oversight Framework</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configurable workflows for implementing appropriate human oversight mechanisms that balance automation efficiency with meaningful human intervention.
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
                  <h4 className="font-medium">Compliance Confidence</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    EuroBank achieves over 95% compliance readiness across all AI systems, with clear documentation and evidence for regulatory inspections.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Risk Reduction</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Potential financial penalties are mitigated through comprehensive compliance documentation and continuous monitoring systems.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Operational Efficiency</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    70% reduction in time spent on compliance documentation through automated generation and standardized templates.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Cross-Border Consistency</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Unified compliance approach across all EU jurisdictions while addressing specific national requirements where necessary.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Innovation Protection</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Balanced transparency requirements that satisfy regulatory needs while protecting proprietary algorithms and competitive advantage.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Reputation Enhancement</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Positioning as a responsible financial institution with transparent AI practices, building trust with customers and regulators.
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
                    "The EU AI Act compliance platform has transformed our approach to AI governance. What was once a complex, resource-intensive challenge is now a streamlined, confident process. We've reduced our compliance overhead while significantly improving our risk position."
                  </p>
                  <p className="text-sm text-blue-700 mt-2 font-medium">
                    — Chief Compliance Officer, EuroBank Financial Services
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

export default FintechScenario;
