import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { 
  CheckCircle2, 
  ClipboardList, 
  FileText, 
  ShieldAlert, 
  Calendar, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Info, 
  Clock, 
  CheckSquare,
  AlertTriangle,
  Ban,
  Bot,
  Database,
  Shield,
  Users
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const RegistrationGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const toggleStepCompletion = (step: string) => {
    if (completedSteps.includes(step)) {
      setCompletedSteps(completedSteps.filter(s => s !== step));
    } else {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const completionPercentage = Math.round((completedSteps.length / 7) * 100);

  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Registration Guide
            </CardTitle>
            <CardDescription>
              Learn about AI system registration under the EU AI Act
            </CardDescription>
          </div>
          <Badge className="bg-blue-600 hover:bg-blue-700">
            EU AI Act Compliant
          </Badge>
        </div>
      </CardHeader>

      {/* Progress tracker */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Registration Checklist Progress</span>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-[400px] md:h-[500px]">
          <TabsContent value="overview" className="px-6 py-4 space-y-4">
            {/* Executive Summary */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Executive Summary</h3>
              <p className="text-sm text-blue-700">
                The EU AI Act is the world's first comprehensive legislative framework governing artificial 
                intelligence, effective from 2024. It categorizes AI systems by risk level and imposes 
                varying compliance requirements. Registration is mandatory for high-risk systems and helps
                organizations demonstrate due diligence and maintain transparency.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                Why Register AI Systems?
              </h3>
              <p className="text-sm text-muted-foreground">
                The EU AI Act requires organizations to register AI systems based on their risk level.
                Registration helps ensure compliance, transparency, and accountability. Failure to register 
                high-risk systems can result in significant penalties up to 30 million EUR or 6% of global annual turnover.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Key Compliance Timeline
              </h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">Q2 2024</Badge>
                  <p className="text-sm">EU AI Act entry into force</p>
                </div>
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">Q3 2024</Badge>
                  <p className="text-sm">Prohibited AI systems ban effective</p>
                </div>
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">Q3 2025</Badge>
                  <p className="text-sm">High-risk AI system requirements apply</p>
                </div>
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">Q3 2026</Badge>
                  <p className="text-sm">All remaining provisions apply</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Info className="h-4 w-4 mr-2 text-primary" />
                Benefits of Registration
              </h3>
              <ul className="space-y-1 pl-6 text-sm list-disc text-muted-foreground">
                <li>Demonstrates regulatory compliance and due diligence</li>
                <li>Establishes transparent AI governance processes</li>
                <li>Mitigates legal and reputational risks</li>
                <li>Builds trust with customers and stakeholders</li>
                <li>Facilitates market access across the European Union</li>
              </ul>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="overview_complete" 
                  checked={completedSteps.includes('overview')}
                  onChange={() => toggleStepCompletion('overview')}
                  className="h-4 w-4 text-primary" 
                />
                <label htmlFor="overview_complete" className="text-sm font-medium cursor-pointer">
                  Mark overview as reviewed
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="classification" className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <ShieldAlert className="h-4 w-4 mr-2 text-primary" />
                Risk Classification Framework
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                The EU AI Act categorizes AI systems based on risk levels. Understanding your system's 
                classification is crucial for determining compliance requirements.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="unacceptable" className="border bg-red-50 rounded-lg px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center">
                    <Ban className="h-5 w-5 mr-2 text-red-600" />
                    <span className="font-medium text-red-700">Unacceptable Risk</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm space-y-3 pb-4">
                  <p className="text-red-700">
                    Systems posing unacceptable risks to safety, fundamental rights, or EU values. 
                    These are prohibited under the EU AI Act.
                  </p>
                  <div>
                    <p className="font-medium text-red-800 mb-1">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1 text-red-700">
                      <li>Social scoring systems used by governments</li>
                      <li>Real-time biometric identification in public spaces (with limited exceptions)</li>
                      <li>Emotion recognition in workplaces or educational settings</li>
                      <li>AI systems exploiting vulnerabilities of specific groups</li>
                      <li>Subliminal manipulation techniques causing harm</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Badge className="bg-red-600">Prohibited</Badge>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="high" className="border bg-amber-50 rounded-lg px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    <span className="font-medium text-amber-700">High Risk</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm space-y-3 pb-4">
                  <p className="text-amber-700">
                    Systems with significant potential to harm health, safety, or fundamental rights. 
                    Subject to strict compliance requirements.
                  </p>
                  <div>
                    <p className="font-medium text-amber-800 mb-1">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1 text-amber-700">
                      <li>AI for critical infrastructure (water, gas, electricity, transportation)</li>
                      <li>Educational/vocational training systems determining access or assessment</li>
                      <li>Employment systems for recruitment and HR decisions</li>
                      <li>Essential private/public services (credit scoring, social benefits)</li>
                      <li>Law enforcement systems for risk assessments</li>
                      <li>Medical devices and healthcare AI applications</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Badge className="bg-amber-600">Registration Required</Badge>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="limited" className="border bg-blue-50 rounded-lg px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-700">Limited Risk</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm space-y-3 pb-4">
                  <p className="text-blue-700">
                    Systems with specific transparency obligations, requiring clear disclosure 
                    to users that they are interacting with AI.
                  </p>
                  <div>
                    <p className="font-medium text-blue-800 mb-1">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
                      <li>Chatbots and conversational AI assistants</li>
                      <li>Emotion recognition systems</li>
                      <li>Biometric categorization systems</li>
                      <li>AI-generated or manipulated content (deepfakes)</li>
                      <li>Recommendation systems for content or products</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Badge className="bg-blue-600">Transparency Required</Badge>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="minimal" className="border bg-green-50 rounded-lg px-4">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center">
                    <CheckSquare className="h-5 w-5 mr-2 text-green-600" />
                    <span className="font-medium text-green-700">Minimal Risk</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm space-y-3 pb-4">
                  <p className="text-green-700">
                    All other AI systems with minimal regulatory requirements. Voluntary compliance 
                    with codes of conduct is encouraged.
                  </p>
                  <div>
                    <p className="font-medium text-green-800 mb-1">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1 text-green-700">
                      <li>AI-enhanced spam filters</li>
                      <li>Basic inventory management systems</li>
                      <li>AI-powered video games</li>
                      <li>Simple productivity tools</li>
                      <li>Basic image recognition for photos</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Badge className="bg-green-600">Voluntary Codes</Badge>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="bg-slate-50 p-4 rounded-lg border mt-4">
              <h3 className="font-medium mb-2 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                How to Determine Your Classification
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Use these steps to help determine your AI system's risk classification:
              </p>
              <ol className="pl-5 list-decimal text-sm text-muted-foreground space-y-1">
                <li>Review the specific use case and application context</li>
                <li>Assess potential impacts on individuals and society</li>
                <li>Check if your system falls under Annex I (prohibited) or Annex III (high-risk)</li>
                <li>Consider if transparency requirements apply (limited risk)</li>
                <li>Use our built-in Risk Assessment Wizard for guidance</li>
              </ol>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="classification_complete" 
                  checked={completedSteps.includes('classification')}
                  onChange={() => toggleStepCompletion('classification')}
                  className="h-4 w-4 text-primary" 
                />
                <label htmlFor="classification_complete" className="text-sm font-medium cursor-pointer">
                  Mark classification as reviewed
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="process" className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                Registration Process
              </h3>
              <p className="text-sm text-muted-foreground">
                Follow this step-by-step process to register your AI system. The registration process 
                typically takes 2-4 hours to complete, depending on the complexity of your system.
              </p>
            </div>

            <div className="space-y-4 mt-2">
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Basic Information</h4>
                      <input 
                        type="checkbox" 
                        id="step1_complete" 
                        checked={completedSteps.includes('step1')}
                        onChange={() => toggleStepCompletion('step1')}
                        className="h-4 w-4 text-primary" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Provide system name, description, purpose, and ownership details.
                    </p>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs mt-2 px-2 py-1 h-auto"
                      onClick={() => toggleSection('section1')}
                    >
                      {expandedSection === 'section1' ? 'Hide Details' : 'Show Details'}
                      {expandedSection === 'section1' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </Button>

                    {expandedSection === 'section1' && (
                      <div className="mt-2 pl-2 border-l-2 border-slate-200 text-xs space-y-2">
                        <p><strong>Required Information:</strong></p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>System name and version</li>
                          <li>Primary purpose and use cases</li>
                          <li>Owning department and responsible personnel</li>
                          <li>Deployment scope (internal, customer-facing, etc.)</li>
                          <li>Vendor information (if applicable)</li>
                        </ul>
                        <p><strong>Tips:</strong> Be specific about the system's purpose and intended users. This helps determine the appropriate risk classification.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Technical Details</h4>
                      <input 
                        type="checkbox" 
                        id="step2_complete" 
                        checked={completedSteps.includes('step2')}
                        onChange={() => toggleStepCompletion('step2')}
                        className="h-4 w-4 text-primary" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Document AI capabilities, training data, and deployment context.
                    </p>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs mt-2 px-2 py-1 h-auto"
                      onClick={() => toggleSection('section2')}
                    >
                      {expandedSection === 'section2' ? 'Hide Details' : 'Show Details'}
                      {expandedSection === 'section2' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </Button>

                    {expandedSection === 'section2' && (
                      <div className="mt-2 pl-2 border-l-2 border-slate-200 text-xs space-y-2">
                        <p><strong>Required Information:</strong></p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>AI techniques used (machine learning, deep learning, etc.)</li>
                          <li>Model architecture and capabilities</li>
                          <li>Training datasets and data governance policies</li>
                          <li>Data processing activities and data flows</li>
                          <li>Integration with other systems</li>
                          <li>API usage or exposures</li>
                          <li>Testing and validation methodologies</li>
                        </ul>
                        <p><strong>Tips:</strong> Include detailed information about data processing and model training. For high-risk systems, thorough documentation is mandatory.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Risk Assessment</h4>
                      <input 
                        type="checkbox" 
                        id="step3_complete" 
                        checked={completedSteps.includes('step3')}
                        onChange={() => toggleStepCompletion('step3')}
                        className="h-4 w-4 text-primary" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Evaluate potential risks and impacts of the system.
                    </p>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs mt-2 px-2 py-1 h-auto"
                      onClick={() => toggleSection('section3')}
                    >
                      {expandedSection === 'section3' ? 'Hide Details' : 'Show Details'}
                      {expandedSection === 'section3' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </Button>

                    {expandedSection === 'section3' && (
                      <div className="mt-2 pl-2 border-l-2 border-slate-200 text-xs space-y-2">
                        <p><strong>Required Assessment Areas:</strong></p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Fundamental rights impact (privacy, non-discrimination)</li>
                          <li>Safety risks and potential for harm</li>
                          <li>Accuracy, reliability, and performance metrics</li>
                          <li>Cybersecurity vulnerabilities</li>
                          <li>Environmental impacts (for applicable systems)</li>
                          <li>Risk mitigation measures implemented</li>
                          <li>Ongoing monitoring mechanisms</li>
                        </ul>
                        <p><strong>Tips:</strong> Use our integrated Risk Assessment Wizard to conduct a thorough analysis based on EU AI Act guidelines. Document all mitigation strategies thoroughly.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Documentation Preparation</h4>
                      <input 
                        type="checkbox" 
                        id="step4_complete" 
                        checked={completedSteps.includes('step4')}
                        onChange={() => toggleStepCompletion('step4')}
                        className="h-4 w-4 text-primary" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prepare and organize all required documentation.
                    </p>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs mt-2 px-2 py-1 h-auto"
                      onClick={() => toggleSection('section4')}
                    >
                      {expandedSection === 'section4' ? 'Hide Details' : 'Show Details'}
                      {expandedSection === 'section4' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </Button>

                    {expandedSection === 'section4' && (
                      <div className="mt-2 pl-2 border-l-2 border-slate-200 text-xs space-y-2">
                        <p><strong>Required Documentation:</strong></p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Technical documentation (system architecture, data flows)</li>
                          <li>Risk assessment report</li>
                          <li>Data governance policy</li>
                          <li>Testing and validation reports</li>
                          <li>Human oversight measures (for high-risk systems)</li>
                          <li>Incident response procedures</li>
                          <li>Instructions for users</li>
                        </ul>
                        <p><strong>Tips:</strong> Our system can help generate documentation templates that adhere to EU AI Act requirements. Keep all documentation version-controlled and updated.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-xs font-bold">5</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Review & Submit</h4>
                      <input 
                        type="checkbox" 
                        id="step5_complete" 
                        checked={completedSteps.includes('step5')}
                        onChange={() => toggleStepCompletion('step5')}
                        className="h-4 w-4 text-primary" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verify information and submit for compliance tracking.
                    </p>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs mt-2 px-2 py-1 h-auto"
                      onClick={() => toggleSection('section5')}
                    >
                      {expandedSection === 'section5' ? 'Hide Details' : 'Show Details'}
                      {expandedSection === 'section5' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </Button>

                    {expandedSection === 'section5' && (
                      <div className="mt-2 pl-2 border-l-2 border-slate-200 text-xs space-y-2">
                        <p><strong>Final Review Checklist:</strong></p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>All required fields completed with accurate information</li>
                          <li>Risk assessment thoroughly conducted and documented</li>
                          <li>All supporting documentation attached</li>
                          <li>Appropriate stakeholders have reviewed the submission</li>
                          <li>Legal/compliance team approval (recommended)</li>
                          <li>Declarations of conformity (for high-risk systems)</li>
                        </ul>
                        <p><strong>After Submission:</strong> Once submitted, the system will be registered in your organization's AI inventory for compliance tracking. For high-risk systems, additional conformity assessment procedures may be required.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        
            <div className="mt-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="process_complete" 
                  checked={completedSteps.includes('process')}
                  onChange={() => toggleStepCompletion('process')}
                  className="h-4 w-4 text-primary" 
                />
                <label htmlFor="process_complete" className="text-sm font-medium cursor-pointer">
                  Mark process as reviewed
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="px-6 py-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                  Tips for Successful Registration
                </h3>
                <ul className="space-y-2 pl-6 list-disc text-sm text-muted-foreground">
                  <li className="space-y-1">
                    <strong>Be thorough and accurate</strong>
                    <p>When describing system capabilities, provide detailed information about functionality, limitations, and performance metrics.</p>
                  </li>
                  <li className="space-y-1">
                    <strong>Document data sources and methodologies clearly</strong>
                    <p>Include information about training datasets, data collection methods, preprocessing techniques, and data governance procedures.</p>
                  </li>
                  <li className="space-y-1">
                    <strong>Consider all potential impacts</strong>
                    <p>Assess impacts on various stakeholders, including vulnerable groups, and document how the system addresses potential biases or discrimination risks.</p>
                  </li>
                  <li className="space-y-1">
                    <strong>Detail risk mitigation measures</strong>
                    <p>Describe all measures implemented to mitigate identified risks, including technical safeguards, human oversight, and operational controls.</p>
                  </li>
                  <li className="space-y-1">
                    <strong>Keep documentation updated</strong>
                    <p>Establish a process for regularly updating technical documentation as the system evolves through version changes or training updates.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Who is responsible for registering AI systems?</p>
                    <p className="text-sm text-blue-600">The provider (creator/developer) of a high-risk AI system is primarily responsible for registration before placing it on the market. For systems developed in-house, the deploying organization is responsible.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">How often do I need to update my registration?</p>
                    <p className="text-sm text-blue-600">Registration should be updated whenever there are substantial modifications to the system that could affect its risk classification or compliance with requirements. Annual reviews are recommended as best practice.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">What happens if I don't register a high-risk AI system?</p>
                    <p className="text-sm text-blue-600">Non-compliance with registration requirements for high-risk systems can result in penalties up to 30 million EUR or 6% of global annual turnover, whichever is higher.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">How long does the registration process take?</p>
                    <p className="text-sm text-blue-600">The initial registration typically takes 2-4 hours to complete, depending on the complexity of your system and the availability of documentation. Ongoing compliance management requires dedicated resources.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Available Resources
                </h3>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                  <div className="border rounded p-3 bg-white flex items-start">
                    <Database className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Documentation Templates</h4>
                      <p className="text-xs text-muted-foreground">Standardized templates for all required documentation</p>
                    </div>
                  </div>
                  <div className="border rounded p-3 bg-white flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Risk Assessment Tool</h4>
                      <p className="text-xs text-muted-foreground">Interactive tool for comprehensive risk analysis</p>
                    </div>
                  </div>
                  <div className="border rounded p-3 bg-white flex items-start">
                    <Bot className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">AI Assistant</h4>
                      <p className="text-xs text-muted-foreground">AI-powered guidance for compliance questions</p>
                    </div>
                  </div>
                  <div className="border rounded p-3 bg-white flex items-start">
                    <Users className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Expert Support</h4>
                      <p className="text-xs text-muted-foreground">Access to compliance specialists</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="resources_complete" 
                  checked={completedSteps.includes('resources')}
                  onChange={() => toggleStepCompletion('resources')}
                  className="h-4 w-4 text-primary" 
                />
                <label htmlFor="resources_complete" className="text-sm font-medium cursor-pointer">
                  Mark resources as reviewed
                </label>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <CardFooter className="flex justify-between border-t bg-slate-50 px-6 py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Download Guide (PDF)</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Save this guide for offline reference</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="default" size="sm" className="gap-1">
          <Clock className="h-4 w-4" />
          <span>Start Registration</span>
        </Button>
      </CardFooter>
    </Card>
  );
};