import { useState } from "react";
import { Link } from "wouter";
import { 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  Database, 
  CpuIcon, 
  Server, 
  BarChart4, 
  BookOpenCheck, 
  ClipboardCheck, 
  Brain, 
  Workflow 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VisualGuides() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container py-8 mx-auto max-w-7xl">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          EU AI Act Compliance Visual Guide
        </h1>
        <p className="mt-4 text-lg text-gray-500 md:text-xl max-w-3xl">
          A comprehensive visual tour of the SGH ASIA platform for managing EU AI Act compliance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="registration">System Registration</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50">
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  The SGH ASIA Enterprise AI Decision Platform helps organizations maintain compliance with the EU AI Act.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden border-b">
                  <img
                    src="/assets/image_1742743429066.png"
                    alt="Platform Overview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <p>
                    Our comprehensive platform provides all the tools necessary to register, assess, monitor, 
                    and document AI systems according to EU AI Act requirements.
                  </p>
                  <p>
                    The intuitive interface allows for easy navigation through all compliance-related activities.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" asChild>
                  <Link href="/guides/platform-overview">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-purple-50">
                <CardTitle>Key Compliance Features</CardTitle>
                <CardDescription>
                  Explore the essential features designed to help maintain EU AI Act compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden border-b">
                  <img
                    src="/assets/image_1742813861269.png"
                    alt="Compliance Features"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CpuIcon className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>AI Systems Inventory</strong>: Catalog and track all AI systems.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheck className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Risk Assessment</strong>: Evaluate AI system risks under the EU AI Act.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Documentation</strong>: Generate and manage required documentation.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <BookOpen className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Training & Knowledge Center</strong>: Access educational resources.
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" asChild>
                  <Link href="/guides/key-features">Explore Features</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-500" />
                  AI-Powered Assistance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Leverage AI suggestions to streamline system registration and risk assessment.</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="px-0">
                  <Link href="/guides/ai-features">View Details</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Workflow className="h-5 w-5 mr-2 text-green-500" />
                  Approval Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Streamline the review and approval process for compliance activities.</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="px-0">
                  <Link href="/guides/approval-workflow">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2 text-amber-500" />
                  Compliance Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Monitor overall compliance status and key metrics in one place.</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="px-0">
                  <Link href="/guides/dashboard-overview">View Dashboard</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registration" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-50">
              <CardTitle>AI System Registration</CardTitle>
              <CardDescription>
                Register and classify AI systems according to EU AI Act requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video relative overflow-hidden border-b">
                <img
                  src="/assets/image_1742743429066.png"
                  alt="AI System Registration"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium">Registration Process</h3>
                <ol className="space-y-2 list-decimal pl-5">
                  <li>Navigate to the "Register AI System" section in the sidebar</li>
                  <li>Fill in the required system details (name, description, purpose, etc.)</li>
                  <li>Use AI-powered suggestions to help classify your system</li>
                  <li>Submit the system for risk assessment and approval</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-6">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Server className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>AI Suggestions</strong>: Get intelligent recommendations based on system description
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Database className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>System Inventory</strong>: Maintain a comprehensive catalog of all AI systems
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" asChild>
                <Link href="/guides/registration-guide">Complete Registration Guide</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-red-50">
              <CardTitle>Risk Assessment & Management</CardTitle>
              <CardDescription>
                Evaluate AI system risks and implement appropriate controls
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video relative overflow-hidden border-b">
                <img
                  src="/assets/image_1742657035341.png"
                  alt="Risk Assessment"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium">Assessment Process</h3>
                <ol className="space-y-2 list-decimal pl-5">
                  <li>Access the Risk Assessment module from the sidebar</li>
                  <li>Select a registered AI system for assessment</li>
                  <li>Review AI-generated risk suggestions or conduct manual assessment</li>
                  <li>Identify compliance gaps and required controls</li>
                  <li>Submit for approval and ongoing management</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-6">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>AI Risk Classification</strong>: Automatically determine risk level based on system details
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ClipboardCheck className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Compliance Gap Analysis</strong>: Identify missing controls and documentation
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" asChild>
                <Link href="/guides/risk-assessment-guide">Complete Risk Guide</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-green-50">
              <CardTitle>Documentation Management</CardTitle>
              <CardDescription>
                Generate and maintain required EU AI Act documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Documentation Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    Technical Documentation
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Detailed system specifications, architecture, and implementation details
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-red-500" />
                    Risk Assessment Reports
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Comprehensive evaluation of system risks and mitigating controls
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-green-500" />
                    Conformity Declarations
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Official statements of compliance with EU AI Act requirements
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                    Training Materials
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Resources for staff training on system usage and compliance
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-6">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <BookOpenCheck className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>AI-Powered Document Generation</strong>: Create documentation drafts based on system details
                  </div>
                </li>
                <li className="flex items-start">
                  <ClipboardCheck className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Document Versioning</strong>: Track changes and maintain document history
                  </div>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" asChild>
                <Link href="/guides/documentation-guide">Documentation Guide</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-amber-50">
              <CardTitle>Compliance Monitoring & Reporting</CardTitle>
              <CardDescription>
                Track compliance status and generate insightful reports
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Monitoring Dashboard</h3>
              <p>
                The compliance dashboard provides a real-time overview of your organization's 
                EU AI Act compliance status, highlighting key metrics and areas requiring attention.
              </p>
              
              <h3 className="text-lg font-medium mt-6">Key Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <BarChart4 className="h-4 w-4 mr-2 text-blue-500" />
                    Compliance Summary
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Overall compliance status across all AI systems
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <BarChart4 className="h-4 w-4 mr-2 text-red-500" />
                    Risk Assessment Status
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Progress and results of system risk assessments
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <BarChart4 className="h-4 w-4 mr-2 text-green-500" />
                    Documentation Status
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Completeness of required documentation
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <BarChart4 className="h-4 w-4 mr-2 text-purple-500" />
                    Training Completion
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Staff training progress and certification
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" asChild>
                <Link href="/guides/reporting-guide">Reporting Guide</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold">Ready to Explore?</h2>
        <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
          Our visual guides provide step-by-step instructions for using each feature 
          of the SGH ASIA EU AI Act Compliance Platform.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/training">Access Training</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}