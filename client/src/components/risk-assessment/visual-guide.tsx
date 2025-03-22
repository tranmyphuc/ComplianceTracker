
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  CheckCircle, 
  ShieldAlert, 
  Book, 
  FileCheck, 
  Users, 
  Database, 
  Eye, 
  Brain, 
  Info,
  CalendarClock,
  ListChecks,
  AlertTriangle,
  Shield
} from "lucide-react";

const RiskAssessmentGuide: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6" />
          EU AI Act Risk Assessment Guide
        </CardTitle>
        <CardDescription>
          A comprehensive guide to understanding and conducting risk assessments for AI systems
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Risk Categories</TabsTrigger>
            <TabsTrigger value="process">Assessment Process</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Steps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="prose max-w-none dark:prose-invert">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Book className="h-5 w-5 text-blue-500" />
                Risk Assessment Under the EU AI Act
              </h3>
              
              <p className="text-muted-foreground">
                The EU AI Act takes a risk-based approach to regulation, with different requirements 
                based on the level of risk an AI system poses. This guide helps you understand how to 
                assess your system's risk level and comply with the applicable requirements.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card className="p-4 border bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    Why Conduct a Risk Assessment?
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-300">
                    <li>Determine your compliance obligations</li>
                    <li>Identify and mitigate potential risks</li>
                    <li>Document compliance for regulators</li>
                    <li>Protect users and affected individuals</li>
                    <li>Avoid penalties for non-compliance</li>
                  </ul>
                </Card>
                
                <Card className="p-4 border bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" />
                    When to Conduct Assessment
                  </h4>
                  <ul className="space-y-1 text-sm text-green-600 dark:text-green-300">
                    <li>Before deploying a new AI system</li>
                    <li>After significant updates or changes</li>
                    <li>When usage context changes</li>
                    <li>When relevant regulations change</li>
                    <li>Periodically (annually recommended)</li>
                  </ul>
                </Card>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Key Assessment Dimensions</h4>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <span className="font-medium">Fundamental Rights</span>
                      <p className="text-sm text-muted-foreground">Impact on privacy, non-discrimination, dignity</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <span className="font-medium">Technical Robustness</span>
                      <p className="text-sm text-muted-foreground">Accuracy, reliability, security</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Database className="h-5 w-5 text-amber-500 mt-1" />
                    <div>
                      <span className="font-medium">Data Governance</span>
                      <p className="text-sm text-muted-foreground">Data quality, protection, management</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <span className="font-medium">Human Oversight</span>
                      <p className="text-sm text-muted-foreground">Intervention mechanisms, decision review</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <span className="font-medium">Transparency</span>
                      <p className="text-sm text-muted-foreground">Explainability, disclosure, documentation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Brain className="h-5 w-5 text-indigo-500 mt-1" />
                    <div>
                      <span className="font-medium">AI System Purpose</span>
                      <p className="text-sm text-muted-foreground">Intended use case, domain, impact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-6">
            <div className="prose max-w-none dark:prose-invert">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Understanding Risk Categories
              </h3>
              
              <p className="text-muted-foreground">
                The EU AI Act classifies AI systems into four risk categories, each with its own set of 
                requirements. Understanding which category your system falls into is crucial for compliance.
              </p>
              
              <div className="space-y-6 mt-6">
                <Card className="p-4 border bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
                  <h4 className="font-medium text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Unacceptable Risk (Prohibited)
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-2">
                    AI systems that pose a clear threat to people's safety, livelihoods, or rights.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                    <p className="font-medium mb-1">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Social scoring systems by public authorities</li>
                      <li>Real-time biometric identification in public spaces (with exceptions)</li>
                      <li>Emotion recognition in workplaces or educational institutions</li>
                      <li>AI systems that manipulate behavior to cause harm</li>
                    </ul>
                  </div>
                </Card>
                
                <Card className="p-4 border bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                  <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    High Risk
                  </h4>
                  <p className="text-sm text-amber-600 dark:text-amber-300 mb-2">
                    AI systems that could cause significant harm to health, safety, or fundamental rights.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                    <p className="font-medium mb-1">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Critical infrastructure (transportation, utilities)</li>
                      <li>Educational or vocational training</li>
                      <li>Employment, worker management, self-employment access</li>
                      <li>Access to essential services (credit scoring, insurance)</li>
                      <li>Law enforcement and migration management</li>
                      <li>Administration of justice</li>
                    </ul>
                    <p className="font-medium mt-3 mb-1">Requirements:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Risk management system</li>
                      <li>Data governance</li>
                      <li>Technical documentation</li>
                      <li>Record keeping</li>
                      <li>Transparency</li>
                      <li>Human oversight</li>
                      <li>Accuracy and robustness</li>
                    </ul>
                  </div>
                </Card>
                
                <Card className="p-4 border bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Limited Risk
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">
                    AI systems with specific transparency obligations.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                    <p className="font-medium mb-1">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Chatbots</li>
                      <li>Emotion recognition systems</li>
                      <li>Biometric categorization systems</li>
                      <li>AI-generated content (deepfakes)</li>
                    </ul>
                    <p className="font-medium mt-3 mb-1">Requirements:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Notify users they are interacting with an AI system</li>
                      <li>Label AI-generated content</li>
                      <li>Disclose emotion recognition or biometric categorization</li>
                    </ul>
                  </div>
                </Card>
                
                <Card className="p-4 border bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Minimal Risk
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mb-2">
                    All other AI systems that aren't explicitly categorized above.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                    <p className="font-medium mb-1">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>AI-enabled video games</li>
                      <li>Spam filters</li>
                      <li>Inventory management systems</li>
                      <li>AI-powered recommendation systems (with limitations)</li>
                    </ul>
                    <p className="font-medium mt-3 mb-1">Requirements:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>No specific obligations</li>
                      <li>Voluntary codes of conduct encouraged</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="process" className="space-y-6">
            <div className="prose max-w-none dark:prose-invert">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <ListChecks className="h-5 w-5 text-green-500" />
                Risk Assessment Process
              </h3>
              
              <p className="text-muted-foreground">
                Following a structured approach to risk assessment ensures comprehensive evaluation 
                of your AI system and helps identify all relevant compliance requirements.
              </p>
              
              <div className="mt-6 space-y-8">
                <div className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full border-2 border-white dark:border-gray-900 dark:bg-blue-900 dark:text-blue-200">
                    1
                  </div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">System Identification & Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Document key details about your AI system:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>System name and version</li>
                    <li>Purpose and intended use cases</li>
                    <li>Technical approach and capabilities</li>
                    <li>Data sources and processing methods</li>
                    <li>Deployment context and user base</li>
                  </ul>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-full border-2 border-white dark:border-gray-900 dark:bg-green-900 dark:text-green-200">
                    2
                  </div>
                  <h4 className="font-medium text-green-700 dark:text-green-300">Initial Risk Categorization</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Determine which risk category your system likely falls into:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Check against prohibited use cases (Article 5)</li>
                    <li>Determine if your system is listed in Annex III (high-risk)</li>
                    <li>Check if transparency obligations apply (Articles 52-54)</li>
                    <li>Consider if it falls into minimal risk by default</li>
                  </ul>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-800 rounded-full border-2 border-white dark:border-gray-900 dark:bg-purple-900 dark:text-purple-200">
                    3
                  </div>
                  <h4 className="font-medium text-purple-700 dark:text-purple-300">Comprehensive Assessment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Complete a detailed assessment covering multiple dimensions:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Fundamental rights impact (privacy, discrimination, etc.)</li>
                    <li>Technical robustness and accuracy</li>
                    <li>Data governance and quality</li>
                    <li>Human oversight mechanisms</li>
                    <li>Transparency and explainability</li>
                  </ul>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-800 rounded-full border-2 border-white dark:border-gray-900 dark:bg-amber-900 dark:text-amber-200">
                    4
                  </div>
                  <h4 className="font-medium text-amber-700 dark:text-amber-300">Risk Evaluation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Analyze the assessment results:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Calculate risk scores for each dimension</li>
                    <li>Determine overall risk level based on scores</li>
                    <li>Consider both likelihood and severity of potential harm</li>
                    <li>Document reasoning for final risk classification</li>
                  </ul>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 rounded-full border-2 border-white dark:border-gray-900 dark:bg-red-900 dark:text-red-200">
                    5
                  </div>
                  <h4 className="font-medium text-red-700 dark:text-red-300">Risk Mitigation Planning</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Develop plans to address identified risks:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Identify specific measures to reduce each risk</li>
                    <li>Prioritize actions based on risk severity</li>
                    <li>Establish implementation timeline</li>
                    <li>Define metrics to measure effectiveness</li>
                  </ul>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full border-2 border-white dark:border-gray-900 dark:bg-indigo-900 dark:text-indigo-200">
                    6
                  </div>
                  <h4 className="font-medium text-indigo-700 dark:text-indigo-300">Documentation & Review</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Finalize the assessment process:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Document all findings, risks, and mitigation measures</li>
                    <li>Create or update technical documentation</li>
                    <li>Establish review schedule (at least annual)</li>
                    <li>Implement monitoring of actual system performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance" className="space-y-6">
            <div className="prose max-w-none dark:prose-invert">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <FileCheck className="h-5 w-5 text-green-500" />
                Compliance Steps Guide
              </h3>
              
              <p className="text-muted-foreground">
                Once you've determined your system's risk level, follow these steps to 
                ensure compliance with the EU AI Act requirements.
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="collapse-title">
                  <h4 className="font-medium text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    High-Risk Systems Compliance
                  </h4>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <ol className="space-y-4 list-decimal pl-5">
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Implement a Risk Management System</span>
                      <p className="text-sm mt-1">
                        Establish an ongoing, iterative process to identify, analyze, and address risks
                        throughout the system lifecycle. Document this process and its outcomes.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Data Governance Measures</span>
                      <p className="text-sm mt-1">
                        Implement data governance procedures to ensure high-quality training, validation, 
                        and testing datasets. Address potential biases and ensure data is representative.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Technical Documentation</span>
                      <p className="text-sm mt-1">
                        Create detailed technical documentation covering system design, development 
                        process, capabilities, limitations, and compliance measures. Include information 
                        to enable authorities to assess compliance.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Automatic Event Logging</span>
                      <p className="text-sm mt-1">
                        Implement logging capabilities to record events during system operation. 
                        Ensure sufficient detail to enable monitoring and incident investigation.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Human Oversight Measures</span>
                      <p className="text-sm mt-1">
                        Design and implement effective human oversight mechanisms that allow 
                        monitoring, understanding, and intervention in system operation.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Accuracy, Robustness, and Security</span>
                      <p className="text-sm mt-1">
                        Ensure the system achieves appropriate levels of accuracy for its intended purpose 
                        and is resilient against errors, inconsistencies, and cyberattacks.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Conformity Assessment</span>
                      <p className="text-sm mt-1">
                        Conduct a conformity assessment following the procedures specified in the AI Act. 
                        This may involve third-party assessment depending on the system.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">CE Marking and Declaration</span>
                      <p className="text-sm mt-1">
                        After successful conformity assessment, affix the CE marking and draw up 
                        an EU declaration of conformity.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Post-Market Monitoring</span>
                      <p className="text-sm mt-1">
                        Implement a post-market monitoring system to collect, document, and analyze 
                        data on system performance after deployment.
                      </p>
                    </li>
                  </ol>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Limited Risk Systems Compliance
                  </h4>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <ol className="space-y-4 list-decimal pl-5">
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Transparency Notifications</span>
                      <p className="text-sm mt-1">
                        Ensure users are notified that they are interacting with an AI system.
                        Make this notification clear and prominent.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">AI-Generated Content Labels</span>
                      <p className="text-sm mt-1">
                        Clearly label content (images, audio, video) that has been generated or 
                        manipulated by AI systems.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Emotional Recognition Disclosure</span>
                      <p className="text-sm mt-1">
                        If your system performs emotion recognition, inform users that their emotions 
                        are being recognized or categorized.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Biometric Categorization Disclosure</span>
                      <p className="text-sm mt-1">
                        If your system categorizes individuals based on biometric data, 
                        inform those individuals of this categorization.
                      </p>
                    </li>
                  </ol>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Minimal Risk Systems Compliance
                  </h4>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <ul className="space-y-4 list-disc pl-5">
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Voluntary Codes of Conduct</span>
                      <p className="text-sm mt-1">
                        Consider adhering to voluntary codes of conduct developed for your 
                        industry or application domain.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Best Practices Adoption</span>
                      <p className="text-sm mt-1">
                        Follow AI ethics and responsible AI best practices even when not 
                        specifically required by regulation.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Documentation</span>
                      <p className="text-sm mt-1">
                        Maintain basic documentation about the system even though it's not 
                        required for minimal risk systems.
                      </p>
                    </li>
                    
                    <li className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Monitoring</span>
                      <p className="text-sm mt-1">
                        Monitor for changes in system usage, capabilities, or context that might 
                        change its risk classification in the future.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentGuide;
