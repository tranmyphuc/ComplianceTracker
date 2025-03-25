
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, FileText, Check, AlertTriangle, ArrowRight, Users, ShieldAlert, BarChart } from 'lucide-react';
import { Link } from 'wouter';

const ManufacturingScenario: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Manufacturing</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">SmartFactory GmbH</h1>
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">Medium Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Manufacturing | Medium (250-999 employees) | German-based with EU Operations</span>
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
              SmartFactory GmbH is a German industrial equipment manufacturer that has embraced Industry 4.0 principles by implementing various AI solutions throughout their production facilities. With 750 employees and production sites in Germany, Poland, and France, they produce precision components for the automotive and aerospace industries.
            </p>
            
            <h4 className="font-medium mt-6 mb-2">AI System Portfolio:</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Predictive Maintenance System</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    ML-based system that monitors equipment sensors to predict potential failures and schedule maintenance before breakdowns occur.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Quality Control Vision System</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Computer vision system that inspects manufactured components for defects with higher precision than traditional visual inspection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-medium">Production Optimization AI</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI system that analyzes production data to optimize manufacturing processes for efficiency and resource utilization.
                  </p>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium mt-6 mb-2">Regulatory Context:</h4>
            <p className="text-sm text-muted-foreground">
              SmartFactory GmbH must navigate a complex regulatory environment that includes:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
              <li>EU AI Act requirements for industrial AI systems</li>
              <li>German national AI strategy guidelines</li>
              <li>Industry-specific safety and quality standards</li>
              <li>Machinery Directive requirements</li>
              <li>Worker safety regulations related to automated systems</li>
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
                  <h4 className="font-medium">Risk Level Classification Ambiguity</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    SmartFactory struggles to determine whether their AI systems fall under high-risk categories in the EU AI Act. While their systems don't directly control critical infrastructure, they influence manufacturing processes for safety-critical components, creating uncertainty about proper classification.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Integration with Safety Standards</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The company needs to reconcile EU AI Act requirements with existing machinery safety standards and industry-specific quality certifications. They're uncertain how these regulatory frameworks interact and which takes precedence in case of overlapping requirements.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Supply Chain Compliance Verification</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    SmartFactory integrates third-party AI components and software libraries into their systems. They lack a systematic approach to verify these components' compliance with EU AI Act requirements and determine their own liability for supplier components.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Technical Documentation Burden</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Creating and maintaining the extensive technical documentation required by the EU AI Act presents a significant resource challenge. Their engineering team lacks familiarity with regulatory documentation standards and struggles to translate their technical understanding into compliant documentation.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Resource Constraints</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    As a medium-sized manufacturer, SmartFactory lacks dedicated compliance personnel with AI regulatory expertise. They need to achieve compliance without significant expansion of their compliance team or diversion of engineering resources from core business activities.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Cross-Border Operations</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    With facilities in multiple EU countries, SmartFactory must navigate potential variations in how national authorities implement the EU AI Act, while maintaining consistent compliance practices across all operations.
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
                  <h4 className="font-medium">AI System Inventory & Classification</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Our platform creates a comprehensive inventory of SmartFactory's AI systems, including their components, data sources, and deployment contexts.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show how the platform analyses system specifications against EU AI Act criteria 
                      to determine correct risk classifications, with special attention to systems that process 
                      safety-critical manufacturing data.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Regulatory Framework Integration</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    The platform maps EU AI Act requirements against existing industry standards and machinery safety regulations to create a unified compliance framework.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Demonstrate the regulatory mapping feature that shows where EU AI Act requirements 
                      overlap with machinery safety standards, allowing SmartFactory to leverage existing 
                      compliance measures and identify gaps.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Supplier Compliance Management</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Implementation of a supplier assessment framework that evaluates third-party AI components against EU AI Act requirements.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show the supplier compliance questionnaire and assessment tool that generates 
                      compliance requirements for vendors and tracks their responses, with automated 
                      risk flagging for non-compliant components.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Automated Documentation Generation</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    The platform automatically generates technical documentation that meets EU AI Act requirements, leveraging existing technical specifications and test results.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Demonstrate how engineers can input technical system information in familiar formats, 
                      which the platform then transforms into compliant documentation, including risk management 
                      measures, validation protocols, and performance metrics.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="font-semibold">5</span>
                </div>
                <div>
                  <h4 className="font-medium">Implementation Roadmap & Monitoring</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Creation of a prioritized compliance roadmap that aligns with SmartFactory's resource constraints and establishes ongoing monitoring protocols.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Demo Highlight:</p>
                    <p>
                      Show the compliance planning tool that creates an optimized implementation timeline 
                      based on risk levels and resource availability, with automated progress tracking and 
                      regulatory update notifications.
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
                  <h4 className="font-medium">Manufacturing AI Risk Framework</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Specialized risk assessment framework that evaluates manufacturing AI applications against EU AI Act criteria while considering industry-specific safety standards.
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
                  <h4 className="font-medium">Regulatory Crosswalk Mapper</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Interactive tool that maps EU AI Act requirements against industrial standards like ISO, IEC, and machinery safety directives to identify overlaps and gaps.
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
                  <h4 className="font-medium">Supplier Compliance Portal</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tool for assessing and managing third-party AI component compliance, with automated questionnaires and documentation verification.
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
                  <h4 className="font-medium">Resource-Optimized Implementation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI-powered planning tool that creates an efficient compliance roadmap based on risk priorities and available resources.
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
                  <h4 className="font-medium">Clear Risk Classification</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Definitive determination of risk levels for all AI systems, with proper classification of their predictive maintenance and quality inspection systems.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Documentation Efficiency</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    80% reduction in documentation effort through automated generation and integration with existing technical specifications.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Supplier Management</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive verification of third-party AI components with clear documentation of compliance status for all supplier systems.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Standards Integration</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Unified compliance approach that harmonizes EU AI Act requirements with existing industry standards, eliminating redundant compliance activities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Resource Optimization</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Achievement of full compliance with minimal additional headcount by leveraging automated tools and prioritized implementation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Future-Proof Implementation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scalable compliance infrastructure that accommodates system updates and new AI deployments with minimal additional effort.
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
                    "As a medium-sized manufacturer, we faced significant challenges understanding how the EU AI Act would impact our operations. This compliance platform transformed a complex regulatory challenge into a manageable process that actually complemented our existing safety and quality systems."
                  </p>
                  <p className="text-sm text-blue-700 mt-2 font-medium">
                    — Director of Operations, SmartFactory GmbH
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

export default ManufacturingScenario;
