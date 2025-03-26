
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Building, FileCheck, ShieldAlert, Settings, FileText, BarChart4, AlertTriangle, HelpCircle, Info, CheckCircle2, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AIJack } from '@/components/onboarding/ai-jack';

const HealthcareScenario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  
  // AI Jack message content based on current tab
  const getJackMessage = () => {
    switch(currentTab) {
      case 'profile':
        return "This healthcare client has multiple high-risk AI systems under the EU AI Act. They need to ensure compliance to avoid penalties of up to €35M or 7% of global revenue.";
      case 'challenges':
        return "MediTech faces several compliance challenges including regulatory uncertainty, cross-border complexity, and extensive documentation requirements.";
      case 'solution':
        return "Our solution provides a comprehensive approach to address MediTech's compliance challenges through system registration, risk assessment, and documentation generation.";
      case 'features':
        return "Key features of our solution include comprehensive risk assessment, technical documentation automation, and cross-border compliance management.";
      case 'outcomes':
        return "By implementing our solution, MediTech achieved full EU AI Act compliance, reducing compliance costs by 40% and avoiding potential penalties.";
      default:
        return "Welcome to the MediTech Solutions case study. This healthcare provider needed to comply with the EU AI Act for their high-risk AI diagnostic systems.";
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/demo-scenarios">
          <Button variant="link" className="p-0">Demo Scenarios</Button>
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">Healthcare</span>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">MediTech Solutions</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">High Risk</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Healthcare | Enterprise (5,000+ employees) | Multiple EU Countries</span>
        </div>
      </div>
      
      {/* AI Jack - Multilingual Guide */}
      <div className="my-6">
        <AIJack
          mood="explaining"
          message={getJackMessage()}
          animate={true}
          size="md"
          language="en"
          allowLanguageSwitch={true}
        />
      </div>
      
      <Tabs defaultValue="profile" className="mt-6" onValueChange={(value) => setCurrentTab(value)}>
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
              <CardDescription>Background information on MediTech Solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Company Overview</h3>
                <p>MediTech Solutions is a leading healthcare provider operating in 7 EU countries with over 5,000 employees. The company manages 12 hospitals and 45 specialist clinics across Europe, serving more than 2 million patients annually.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Systems Portfolio</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Diagnostic Imaging AI</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI system that analyzes medical images (X-rays, MRIs, CT scans) to assist radiologists in detecting abnormalities and suggesting potential diagnoses.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Class IIb Medical Device</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Patient Risk Prediction</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An algorithm that analyzes patient data to predict potential complications, readmission risks, and deterioration likelihood.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Clinical Decision Support</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h4 className="font-medium">Treatment Recommendation Engine</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An AI system that suggests personalized treatment plans based on patient data, medical history, and comparative outcomes analysis.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk (Article 6)</Badge>
                      <Badge variant="outline">Clinical Decision Support</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">EU AI Act Exposure</h3>
                <p>As a healthcare provider using AI for diagnosis and treatment decisions, MediTech Solutions' AI systems are classified as high-risk under Article 6 of the EU AI Act. Their systems require rigorous compliance measures, including risk assessments, technical documentation, and human oversight.</p>
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
                  <AlertTitle>Significant Financial Risk</AlertTitle>
                  <AlertDescription>
                    Potential penalties of up to €35M or 7% of global revenue for non-compliance
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Regulatory Uncertainty</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Confusion over how EU AI Act requirements apply specifically to healthcare AI systems and how they intersect with existing medical device regulations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cross-Border Complexity</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Operating in 7 EU countries creates challenges tracking compliance across potentially varying national implementations of the EU AI Act.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Documentation Burden</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Extensive technical documentation requirements for high-risk AI systems strain internal resources and expertise.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Vendor Compliance Verification</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Difficulty verifying that third-party AI components and vendors are EU AI Act compliant.
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
                          Challenges establishing appropriate human oversight mechanisms for AI diagnostic and treatment recommendation systems.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Risk Management Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Difficulty integrating EU AI Act risk management requirements with existing clinical risk assessment frameworks.
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
              <CardDescription>How our platform addresses MediTech's compliance challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Compliance Implementation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">1</div>
                      <div>
                        <h4 className="font-medium">System Registration & Classification</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Our platform cataloged and classified all of MediTech's AI systems according to the EU AI Act risk criteria, identifying three high-risk AI systems requiring comprehensive compliance measures.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">2</div>
                      <div>
                        <h4 className="font-medium">Risk Assessment Framework</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Applied our healthcare-specific risk assessment methodology to evaluate each system against EU AI Act requirements, integrating with MediTech's existing medical device risk management processes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">3</div>
                      <div>
                        <h4 className="font-medium">Documentation Generation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Automatically generated required technical documentation for each AI system, including system architecture, data governance plans, and performance metrics documentation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">4</div>
                      <div>
                        <h4 className="font-medium">Human Oversight Implementation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Designed and implemented appropriate human oversight mechanisms for each AI system, ensuring clinician review and intervention capabilities for all AI-generated diagnostic and treatment recommendations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">5</div>
                      <div>
                        <h4 className="font-medium">Compliance Monitoring Setup</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Established ongoing monitoring protocols to track system performance, detect potential biases or accuracy issues, and log human oversight interventions.
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
                        <h4 className="font-medium">Regulatory Integration</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Streamlined compliance by integrating EU AI Act requirements with existing medical device regulations (MDR/IVDR), avoiding duplicative compliance efforts.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cross-Border Management</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implemented country-specific compliance tracking to manage variations in national implementations across MediTech's 7 operating countries.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Vendor Assessment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conducted compliance verification for all third-party AI vendors and components, identifying and remediating gaps in supplier documentation.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Training Implementation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Deployed role-specific training for clinicians, developers, and leadership on EU AI Act requirements and compliance processes.
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
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>Platform capabilities showcased during the demonstration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Healthcare-Specific Risk Framework</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        A specialized risk assessment framework tailored to healthcare AI applications that integrates EU AI Act requirements with medical device regulations.
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
                      <h4 className="font-medium">Automated Documentation Generator</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generates comprehensive technical documentation compliant with Article 11 of the EU AI Act, including data governance, system architecture, and performance metrics.
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
                      <BarChart4 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Compliance Dashboard</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Real-time visualization of compliance status across all AI systems, with country-specific views for cross-border operations and alerts for potential issues.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Human Oversight Tools</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implementation guides and templates for establishing appropriate human oversight mechanisms for diagnostic and treatment recommendation AI systems.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Vendor Compliance Verification</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assessment tools to verify and document third-party AI vendor compliance with EU AI Act requirements, including supplier questionnaires and documentation checklists.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Regulatory Update Notifications</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automated alerts about changes to EU AI Act implementation guidelines, with specific focus on healthcare AI applications and medical device integration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outcomes" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outcomes & Results</CardTitle>
              <CardDescription>Measurable benefits achieved for MediTech Solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-primary">90%</h4>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-primary">65%</h4>
                    <p className="text-sm text-muted-foreground">Time Savings</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-primary">100%</h4>
                    <p className="text-sm text-muted-foreground">Systems Documented</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-primary">€2.8M</h4>
                    <p className="text-sm text-muted-foreground">Estimated Cost Savings</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">Key Business Impact</h4>
                      <p className="text-sm text-green-700 mt-1">
                        MediTech Solutions successfully achieved EU AI Act compliance for all three high-risk AI systems, allowing them to continue operating these systems across all EU jurisdictions without disruption to patient care. The company avoided potential penalties of up to €35M while preserving their innovation roadmap.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Specific Results</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Comprehensive Documentation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Generated complete technical documentation for all three high-risk AI systems, meeting Article 11 requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Risk Mitigation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Identified and remediated 28 potential compliance gaps across MediTech's AI systems.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Resource Optimization</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Reduced compliance resource requirements by 65% compared to manual approaches.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Vendor Alignment</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Successfully verified compliance for 87% of third-party AI components, with remediation plans for the remainder.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-5 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Client Testimonial</h3>
                  <blockquote className="border-l-4 border-primary/30 pl-4 italic">
                    "The EU AI Act compliance platform allowed us to navigate complex regulatory requirements efficiently while maintaining our focus on patient care. The healthcare-specific risk assessment framework and automated documentation tools saved us significant time and resources while ensuring we met all compliance obligations."
                  </blockquote>
                  <p className="text-sm text-muted-foreground mt-2">— Chief Compliance Officer, MediTech Solutions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthcareScenario;
