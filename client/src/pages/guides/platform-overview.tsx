import { ArrowLeft, Check, CornerDownRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlatformOverviewGuide() {
  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <div className="mb-8">
        <Link href="/guides">
          <Button variant="ghost" className="flex items-center gap-1 px-0 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">EU AI Act Compliance Platform Overview</h1>
        <p className="text-gray-500 mt-2">
          A comprehensive guide to the SGH ASIA platform features for managing EU AI Act compliance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Platform Introduction</h2>
              <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                <img
                  src="/assets/image_1742743429066.png"
                  alt="Platform Overview"
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mb-4">
                The SGH ASIA EU AI Act Compliance Platform provides organizations with 
                a comprehensive toolkit for maintaining compliance with the European Union's 
                Artificial Intelligence Act. The intuitive interface makes it easy to navigate 
                through all the necessary compliance steps.
              </p>
              <p>
                This visual guide will take you through the key features of the platform, 
                showing real examples of how to use each component to ensure your AI systems 
                meet regulatory requirements.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="navigation">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="workflow">Compliance Workflow</TabsTrigger>
            </TabsList>

            <TabsContent value="navigation" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Platform Navigation</h3>
                  <div className="flex mb-6">
                    <div className="w-1/3 pr-4">
                      <div className="aspect-auto relative overflow-hidden rounded-lg border">
                        <img
                          src="/assets/image_1742813861269.png"
                          alt="Sidebar Navigation"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="w-2/3">
                      <p className="mb-4">
                        The platform features an intuitive sidebar navigation that organizes 
                        features into logical categories:
                      </p>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <strong>Main Navigation</strong>: Dashboard, Strategic Planning, Market Intelligence, etc.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <strong>EU AI Act Compliance</strong>: AI Systems, Risk Assessment, Documentation, etc.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <strong>Additional Tools</strong>: Register AI System, Knowledge Center, AI Workflow, etc.
                          </div>
                        </li>
                      </ul>
                      <p>
                        The sidebar shows your overall compliance score (92%) for quick reference 
                        and highlights new features with badges.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Dashboard Overview</h3>
                  <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                    <img
                      src="/assets/image_1742668518185.png"
                      alt="Dashboard Overview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="mb-4">
                    The dashboard provides a comprehensive overview of your organization's 
                    compliance status, featuring:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Compliance Summary</strong>: Overall compliance score and progress indicators
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>System Inventory</strong>: Count and categorization of AI systems by risk level
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Recent Activities</strong>: Latest compliance actions and updates
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Critical Alerts</strong>: Urgent compliance matters requiring attention
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CornerDownRight className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Upcoming Deadlines</strong>: Timeline of approaching compliance milestones
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Compliance Workflow</h3>
                  <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                    <img
                      src="/assets/image_1742669332289.png"
                      alt="Compliance Workflow"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="mb-4">
                    The platform guides you through a structured compliance workflow:
                  </p>
                  <ol className="space-y-4 mb-4 list-decimal ml-5">
                    <li>
                      <strong>System Registration</strong>: Register AI systems with detailed information
                      <div className="pl-5 mt-1 text-gray-600">
                        Identify and catalog all AI systems in your organization with relevant details
                      </div>
                    </li>
                    <li>
                      <strong>Risk Assessment</strong>: Determine risk level and required controls
                      <div className="pl-5 mt-1 text-gray-600">
                        Evaluate systems against EU AI Act criteria to determine appropriate compliance requirements
                      </div>
                    </li>
                    <li>
                      <strong>Documentation</strong>: Generate and maintain required documentation
                      <div className="pl-5 mt-1 text-gray-600">
                        Create technical documentation, conformity declarations, and other required materials
                      </div>
                    </li>
                    <li>
                      <strong>Monitoring & Reporting</strong>: Track compliance status and generate reports
                      <div className="pl-5 mt-1 text-gray-600">
                        Ongoing monitoring of systems and compliance status with regular reporting
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Key Platform Features</h3>
              <ul className="space-y-4">
                <li>
                  <div className="font-medium">AI System Registration</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Register and catalog all AI systems in use or development
                  </p>
                  <Button variant="link" asChild className="px-0 h-auto mt-1">
                    <Link href="/guides/registration-guide">
                      View Guide
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </li>
                <li>
                  <div className="font-medium">Risk Assessment</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Evaluate AI systems against EU AI Act risk criteria
                  </p>
                  <Button variant="link" asChild className="px-0 h-auto mt-1">
                    <Link href="/guides/risk-assessment-guide">
                      View Guide
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </li>
                <li>
                  <div className="font-medium">Documentation Management</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Generate and maintain required compliance documentation
                  </p>
                  <Button variant="link" asChild className="px-0 h-auto mt-1">
                    <Link href="/guides/documentation-guide">
                      View Guide
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </li>
                <li>
                  <div className="font-medium">Training & Knowledge</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Access educational resources on EU AI Act compliance
                  </p>
                  <Button variant="link" asChild className="px-0 h-auto mt-1">
                    <Link href="/guides/training-guide">
                      View Guide
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </li>
                <li>
                  <div className="font-medium">Approval Workflows</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Streamline review and approval of compliance activities
                  </p>
                  <Button variant="link" asChild className="px-0 h-auto mt-1">
                    <Link href="/guides/approval-workflow">
                      View Guide
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" asChild className="px-0 h-auto">
                    <Link href="/knowledge-center">
                      EU AI Act Knowledge Center
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="px-0 h-auto">
                    <Link href="/training">
                      Training Modules
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="px-0 h-auto">
                    <Link href="/workflow">
                      AI Workflow Diagram
                      <ExternalLink className="h-3 w-3 ml-1" />
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
          <Link href="/guides">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Link>
        </Button>
        <Button asChild>
          <Link href="/guides/registration-guide">
            Next: AI System Registration
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Link>
        </Button>
      </div>
    </div>
  );
}