import { ArrowLeft, Check, AlertTriangle, Shield, Sparkles, FileText, CornerDownRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function RiskAssessmentGuide() {
  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <div className="mb-8">
        <Link href="/guides">
          <Button variant="ghost" className="flex items-center gap-1 px-0 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Risk Assessment Guide</h1>
        <p className="text-gray-500 mt-2">
          Learn how to assess AI systems for compliance with the EU AI Act
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Risk Assessment Overview</h2>
              <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                <img
                  src="/assets/image_1742657035341.png"
                  alt="Risk Assessment Interface"
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mb-4">
                The Risk Assessment module helps you evaluate AI systems against EU AI Act 
                requirements to determine their risk level and applicable compliance obligations.
                The platform provides both AI-assisted and manual assessment options.
              </p>
              <p>
                Risk assessment is a critical step in the compliance process as it determines 
                what controls and documentation are required for each AI system.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="assessment-process">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assessment-process">Assessment Process</TabsTrigger>
              <TabsTrigger value="ai-assistance">AI Assistance</TabsTrigger>
              <TabsTrigger value="results">Risk Levels & Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment-process" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Assessment Process</h3>
                  <ol className="space-y-4 mb-6 list-decimal ml-5">
                    <li>
                      <strong>System Selection</strong>
                      <div className="pl-5 mt-1 text-gray-600">
                        Choose a registered AI system from your inventory for assessment
                      </div>
                    </li>
                    <li>
                      <strong>Risk Parameters</strong>
                      <div className="pl-5 mt-1 text-gray-600">
                        Evaluate system against key risk parameters defined in the EU AI Act
                      </div>
                    </li>
                    <li>
                      <strong>AI-Powered Analysis</strong>
                      <div className="pl-5 mt-1 text-gray-600">
                        Use AI assistance to analyze system details and suggest risk classifications
                      </div>
                    </li>
                    <li>
                      <strong>Risk Determination</strong>
                      <div className="pl-5 mt-1 text-gray-600">
                        Determine final risk level (Unacceptable, High, Limited, or Minimal)
                      </div>
                    </li>
                    <li>
                      <strong>Compliance Gap Analysis</strong>
                      <div className="pl-5 mt-1 text-gray-600">
                        Identify missing controls and documentation based on risk level
                      </div>
                    </li>
                    <li>
                      <strong>Approval Submission</strong>
                      <div className="pl-5 mt-1 text-gray-600">
                        Submit assessment for review and approval in the approval workflow
                      </div>
                    </li>
                  </ol>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 flex items-center mb-2">
                      <Check className="h-4 w-4 mr-2" />
                      Pro Tip
                    </h4>
                    <p className="text-blue-700 text-sm">
                      For accurate risk assessment, ensure your system registration includes 
                      detailed information about the system's purpose, capabilities, and usage context.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-assistance" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">AI-Powered Risk Analysis</h3>
                  <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                    <img
                      src="/assets/image_1742657035341.png"
                      alt="AI-Powered Suggestions"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="mb-4">
                    The platform offers AI-powered assistance to streamline the risk assessment process:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Generate Suggestions</strong>: Click the "Generate Suggestions" button to analyze 
                        system details and receive AI-generated risk assessments
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>System Analysis</strong>: The AI evaluates your system description and details 
                        to suggest appropriate values for risk parameters
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Risk Classification</strong>: Receive an automatically determined risk level 
                        based on EU AI Act criteria
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Confidence Score</strong>: Each suggestion includes a confidence rating to 
                        help you evaluate its reliability
                      </div>
                    </li>
                  </ul>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Important Note
                    </h4>
                    <p className="text-amber-700 text-sm">
                      While AI suggestions are helpful, the final risk assessment should always 
                      be reviewed by a knowledgeable human evaluator who understands the specific 
                      context of the AI system and regulatory requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Risk Levels & Required Actions</h3>
                  <p className="mb-4">
                    Based on the assessment, AI systems are classified into risk levels that determine 
                    compliance requirements:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 mr-2">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Unacceptable Risk
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-sm text-red-800">
                        <p className="mb-2">Systems that pose unacceptable risks to safety, rights, or health.</p>
                        <p className="font-semibold">Required action: Prohibited under the EU AI Act.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-amber-200 bg-amber-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 mr-2">
                            <Shield className="h-3 w-3 mr-1" />
                            High Risk
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-sm text-amber-800">
                        <p className="mb-2">Systems with significant potential impact on safety, rights, or health.</p>
                        <p className="font-semibold">Required actions: Extensive documentation, risk management, human oversight, transparency, testing.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 mr-2">
                            <Shield className="h-3 w-3 mr-1" />
                            Limited Risk
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-sm text-blue-800">
                        <p className="mb-2">Systems with transparency obligations (e.g., chatbots, emotion recognition).</p>
                        <p className="font-semibold">Required actions: Transparency measures, disclosure of AI use.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 mr-2">
                            <Shield className="h-3 w-3 mr-1" />
                            Minimal Risk
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-sm text-green-800">
                        <p className="mb-2">Systems with minimal risk to rights or safety.</p>
                        <p className="font-semibold">Required actions: Voluntary compliance with codes of conduct.</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h4 className="font-bold mt-6 mb-3">Next Steps After Assessment</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Implementation Plan</strong>: Develop a plan to address identified compliance gaps
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Documentation</strong>: Generate required documentation based on risk level
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Risk Management</strong>: Implement ongoing risk management processes
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Periodic Review</strong>: Schedule regular reassessments to maintain compliance
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Risk Assessment Tools</h3>
              <ul className="space-y-4">
                <li>
                  <div className="font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-amber-500" />
                    Standard Assessment
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete assessment for registered AI systems
                  </p>
                  <Button variant="link" asChild className="px-0 h-auto mt-1">
                    <Link href="/risk-assessment">
                      Access Tool
                    </Link>
                  </Button>
                </li>
                <li>
                  <div className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    Text Analyzer
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Analyze text descriptions to estimate risk level
                  </p>
                  <Button variant="link" asChild className="px-0 h-auto mt-1">
                    <Link href="/risk-assessment/text-analyzer">
                      Access Tool
                    </Link>
                  </Button>
                </li>
                <li>
                  <div className="font-medium flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                    Comprehensive Wizard
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Step-by-step guided assessment process
                  </p>
                  <Button variant="link" asChild className="px-0 h-auto mt-1">
                    <Link href="/risk-assessment/guides">
                      Access Tool
                    </Link>
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Best Practices</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    Provide detailed system information during registration
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    Use AI suggestions but verify with human expertise
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    Document reasoning behind risk determinations
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    Update assessments when system functionality changes
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    Involve stakeholders from different departments
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Related Guides</h3>
              <ul className="space-y-4">
                <li>
                  <Button variant="link" asChild className="px-0 h-auto">
                    <Link href="/guides/registration-guide">
                      System Registration Guide
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="px-0 h-auto">
                    <Link href="/guides/documentation-guide">
                      Documentation Guide
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="px-0 h-auto">
                    <Link href="/guides/approval-workflow">
                      Approval Workflow Guide
                    </Link>
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/guides/platform-overview">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous: Platform Overview
          </Link>
        </Button>
        <Button asChild>
          <Link href="/guides/documentation-guide">
            Next: Documentation Guide
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Link>
        </Button>
      </div>
    </div>
  );
}