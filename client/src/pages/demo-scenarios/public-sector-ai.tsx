
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, FileText, Check, AlertTriangle, ArrowRight, Users, ShieldAlert, Lock } from 'lucide-react';
import { Link } from 'wouter';

const PublicSectorScenario: React.FC = () => {
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
          <h1 className="text-3xl font-bold">Municipal Services Authority</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Public Sector | Large (1,000-5,000 employees) | Regional Government</span>
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
            <h3 className="text-xl font-semibold mb-4">Organization Overview</h3>
            <p>
              The Municipal Services Authority is a regional government body serving a population of 1.2 million citizens across multiple urban and rural communities. With 2,800 employees, it provides essential public services including social welfare administration, public safety, urban planning, and resource allocation.
            </p>
            
            <h4 className="font-medium mt-6 mb-2">AI System Portfolio:</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Social Benefits Assessment System</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI system that evaluates citizen applications for various social benefits and welfare programs, assessing eligibility based on multiple data points.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Public Safety Resource Allocation</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Predictive system that analyzes historical data to optimize the deployment of emergency services and public safety resources across the region.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Urban Planning Decision Support</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI system that supports urban development decisions by analyzing various data sources including demographics, infrastructure, and environmental factors.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Public Service Chatbot</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Natural language processing system that helps citizens access information and services through the municipal website and service centers.
                  </p>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium mt-6 mb-2">Regulatory Context:</h4>
            <p className="text-sm text-muted-foreground">
              As a public authority using AI systems that directly impact citizens, the Municipal Services Authority faces stringent regulatory requirements:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
              <li>EU AI Act provisions for public sector high-risk systems</li>
              <li>GDPR requirements for processing citizen data</li>
              <li>National public administration transparency laws</li>
              <li>Equal treatment and anti-discrimination regulations</li>
              <li>Administrative procedure laws governing public decision-making</li>
              <li>Accessibility requirements for public services</li>
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
                  <h4 className="font-medium">High-Risk System Obligations</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Several of the Authority's AI systems are explicitly classified as high-risk under the EU AI Act due to their use in essential public services and impact on citizens' access to benefits. The organization needs to implement comprehensive compliance measures while maintaining service delivery.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Algorithmic Transparency Requirements</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Public authorities face enhanced transparency obligations for algorithmic decision-making under both the EU AI Act and administrative law. The Authority struggles to explain complex AI models in terms that satisfy both regulatory requirements and public understanding.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Bias and Fairness Concerns</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The social benefits assessment system must avoid perpetuating historical biases or creating new forms of discrimination. The Authority needs robust methods to detect, measure, and mitigate algorithmic bias while ensuring fair outcomes across diverse population groups.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Human Oversight Implementation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Implementing meaningful human oversight of AI decisions presents operational challenges, particularly in determining which decisions require human review, how to equip staff with appropriate skills, and how to document oversight processes for regulatory purposes.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Legacy System Integration</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The Authority's AI systems interact with older government IT systems that weren't designed with AI governance in mind. Ensuring end-to-end compliance across these hybrid environments poses significant technical and documentation challenges.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Resource and Expertise Constraints</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Like many public sector organizations, the Authority faces budget constraints and challenges in recruiting specialized AI governance expertise, making it difficult to implement comprehensive compliance measures without external support.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Citizen Recourse Mechanisms</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The EU AI Act requires appropriate mechanisms for citizens to challenge AI-based decisions. The Authority needs to establish accessible, efficient processes for citizens to question or appeal decisions while maintaining administrative efficiency.
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
                  <h4 className="font-medium">High-Risk System Assessment & Documentation</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Comprehensive assessment of the Authority's AI systems against EU AI Act high-risk criteria and implementation of structured documentation workflows.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show how the platform guides public sector users through the specific documentation 
                      requirements for high-risk systems under Article 11, with particular attention to the 
                      social benefits assessment system's compliance files.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Algorithmic Fairness Assessment</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Implementation of statistical fairness testing across different demographic groups to identify and mitigate potential bias.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Demonstrate the bias detection dashboard showing how the platform analyzes outcomes 
                      across different population groups, identifying potential disparities in benefit 
                      approvals and suggesting mitigation measures.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Public Transparency Framework</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Development of layered transparency materials that explain AI-based decisions to citizens in clear, accessible language.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show sample citizen communications that explain how the AI system contributed to 
                      specific decisions, with different levels of detail accessible through an interactive 
                      portal that satisfies both regulatory transparency and citizen understanding.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Human Oversight Implementation</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Design and implementation of risk-based human oversight protocols that focus staff attention on cases requiring human judgment.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Demonstrate the human oversight workflow system that identifies which types of cases 
                      require human review, routes them to appropriate staff, and documents review decisions 
                      for compliance purposes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">5</span>
                </div>
                <div>
                  <h4 className="font-medium">Citizen Recourse System</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Implementation of structured processes for citizens to request explanations, challenge decisions, and seek human review.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show the citizen appeal management system that tracks requests for reconsideration, 
                      manages the review process, and documents outcomes to demonstrate regulatory compliance 
                      with recourse requirements.
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
                  <h4 className="font-medium">Public Sector Risk Framework</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Specialized risk assessment framework for public service AI applications, with specific attention to requirements for systems affecting citizen rights and access to benefits.
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
                  <h4 className="font-medium">Algorithmic Impact Assessment</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive tools for analyzing and documenting the potential impact of AI systems on different citizen groups, with particular focus on vulnerable populations.
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
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Fairness Analysis Toolkit</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Statistical tools for measuring and monitoring algorithmic fairness across different demographic groups, with automated disparate impact detection.
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
                  <h4 className="font-medium">Citizen Appeal Management</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    End-to-end system for handling citizen requests for reconsideration, managing review processes, and documenting outcomes for compliance purposes.
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
                  <h4 className="font-medium">Comprehensive Compliance</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Full compliance with EU AI Act high-risk system requirements for all public service AI applications, with complete technical documentation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Enhanced Fairness</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Statistical validation of algorithmic fairness across demographic groups, with 85% reduction in outcome disparities for the social benefits assessment system.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Increased Transparency</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Implementation of accessible explanations for AI-based decisions, with 70% improvement in citizen understanding of how decisions are made.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Efficient Human Oversight</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Risk-based human review processes that focus staff resources on cases requiring judgment while maintaining full documentation of oversight activities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Improved Citizen Recourse</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Structured appeal processes that provide citizens with clear pathways to challenge decisions, with 40% faster resolution times.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Enhanced Public Trust</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Significant improvement in citizen trust in AI-based government services, with 65% increase in positive perceptions of algorithmic decision-making.
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
                    "As a public authority, we have a special responsibility to ensure our AI systems are fair, transparent, and accountable. This compliance platform has transformed how we govern our systems, helping us meet EU AI Act requirements while actually improving our service to citizens."
                  </p>
                  <p className="text-sm text-blue-700 mt-2 font-medium">
                    — Director of Digital Transformation, Municipal Services Authority
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

export default PublicSectorScenario;
