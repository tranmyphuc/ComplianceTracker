
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, BookIcon, UserIcon, UsersIcon, BriefcaseIcon, BrainCircuitIcon } from "lucide-react";

export default function TrainingDocumentation() {
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">EU AI Act Training System</h1>
        <p className="text-muted-foreground text-lg">Comprehensive Training Framework Documentation</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structure">Module Structure</TabsTrigger>
          <TabsTrigger value="roles">Role Categories</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>EU AI Act Training System Overview</CardTitle>
              <CardDescription>
                Our comprehensive approach to EU AI Act compliance training
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The EU AI Act Training System is designed to provide tailored education on EU AI Act
                compliance to employees across all organizational levels. The training is structured 
                to deliver relevant content based on an individual's role and responsibilities 
                related to AI systems.
              </p>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Training Objectives</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Ensure all employees understand the EU AI Act at an appropriate level</li>
                    <li>Provide role-specific guidance on compliance responsibilities</li>
                    <li>Facilitate practical implementation of compliance measures</li>
                    <li>Track and verify completion of required training</li>
                    <li>Enable continuous learning as regulations evolve</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Module-Based Approach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Training is divided into focused modules covering specific aspects of the 
                      EU AI Act, with progressive complexity and different emphasis based on role.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Assessment Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Each module includes knowledge checks and practical exercises to verify 
                      understanding and application of compliance concepts.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Training Module Structure</CardTitle>
              <CardDescription>
                Core modules forming our EU AI Act training curriculum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      <BookIcon className="h-5 w-5 text-primary" />
                    </div>
                    Module 1: EU AI Act Introduction
                  </h3>
                  <div className="ml-9 mt-2">
                    <p className="text-muted-foreground">Introduction to the EU AI Act, its scope, and key provisions</p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>Overview of the regulation and its purpose</li>
                      <li>Key definitions and terminology</li>
                      <li>Risk-based approach overview</li>
                      <li>Timeline for implementation</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      <BookIcon className="h-5 w-5 text-primary" />
                    </div>
                    Module 2: Risk Classification System
                  </h3>
                  <div className="ml-9 mt-2">
                    <p className="text-muted-foreground">Understanding the risk categories and how to classify AI systems</p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>Unacceptable/prohibited practices</li>
                      <li>High-risk system identification</li>
                      <li>Limited and minimal risk categories</li>
                      <li>Classification methodology</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      <BookIcon className="h-5 w-5 text-primary" />
                    </div>
                    Module 3: Technical Requirements
                  </h3>
                  <div className="ml-9 mt-2">
                    <p className="text-muted-foreground">Technical requirements for high-risk AI systems</p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>Risk management systems</li>
                      <li>Data governance requirements</li>
                      <li>Technical documentation</li>
                      <li>Record keeping and logging</li>
                      <li>Accuracy, robustness, and cybersecurity</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      <BookIcon className="h-5 w-5 text-primary" />
                    </div>
                    Module 4: Documentation Requirements
                  </h3>
                  <div className="ml-9 mt-2">
                    <p className="text-muted-foreground">Essential documentation required for EU AI Act compliance</p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>Technical documentation standards</li>
                      <li>Conformity assessment documentation</li>
                      <li>Declaration of conformity</li>
                      <li>Record-keeping requirements</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      <BookIcon className="h-5 w-5 text-primary" />
                    </div>
                    Module 5: Governance Framework
                  </h3>
                  <div className="ml-9 mt-2">
                    <p className="text-muted-foreground">Implementing an effective governance structure for AI compliance</p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>Compliance officer roles</li>
                      <li>Risk management frameworks</li>
                      <li>Monitoring systems</li>
                      <li>Post-market surveillance</li>
                      <li>Human oversight implementation</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      <BookIcon className="h-5 w-5 text-primary" />
                    </div>
                    Module 6: Implementation Case Studies
                  </h3>
                  <div className="ml-9 mt-2">
                    <p className="text-muted-foreground">Real-world examples of EU AI Act implementation</p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>Industry-specific use cases</li>
                      <li>Implementation challenges and solutions</li>
                      <li>Best practices</li>
                      <li>Lessons learned</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Training Categories</CardTitle>
              <CardDescription>
                Tailored training paths for different organizational roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="p-4 border rounded-lg bg-background">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-medium">Level 1: AI Strategic Decision-Makers</h3>
                  </div>
                  <div className="ml-12">
                    <p className="mb-2">Senior executives, compliance officers, and governance leaders responsible for strategic decisions on AI deployment.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Focus Areas:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Governance frameworks</li>
                          <li>Strategic compliance planning</li>
                          <li>Risk management</li>
                          <li>Regulatory implications</li>
                          <li>Business impact analysis</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Required Modules:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>All modules (1-6)</li>
                          <li>Executive briefing supplements</li>
                          <li>Strategic implementation guides</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-background">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <BrainCircuitIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium">Level 2: AI System Developers</h3>
                  </div>
                  <div className="ml-12">
                    <p className="mb-2">Technical professionals directly involved in AI system design, development, and implementation.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Focus Areas:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Technical requirements</li>
                          <li>Development practices</li>
                          <li>Documentation standards</li>
                          <li>Testing and validation</li>
                          <li>Technical implementation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Required Modules:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Modules 1, 2, 3, 4, 6</li>
                          <li>Technical deep dives</li>
                          <li>Implementation code examples</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-background">
                  <div className="flex items-center mb-3">
                    <div className="bg-yellow-100 p-2 rounded-full mr-3">
                      <UsersIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-medium">Level 3: AI System Operators</h3>
                  </div>
                  <div className="ml-12">
                    <p className="mb-2">Staff responsible for day-to-day operation, monitoring, and oversight of AI systems.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Focus Areas:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Operational compliance</li>
                          <li>Monitoring procedures</li>
                          <li>Human oversight</li>
                          <li>Incident reporting</li>
                          <li>Record keeping</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Required Modules:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Modules 1, 2, 3, 6</li>
                          <li>Operational procedures</li>
                          <li>Monitoring guides</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-background">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <UserIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-medium">Level 4: AI System Users</h3>
                  </div>
                  <div className="ml-12">
                    <p className="mb-2">End users who interact with AI systems or use their outputs.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Focus Areas:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Basic awareness</li>
                          <li>System limitations</li>
                          <li>Proper usage</li>
                          <li>Issue reporting</li>
                          <li>Understanding AI outputs</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Required Modules:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Modules 1, 2</li>
                          <li>User guidelines</li>
                          <li>Awareness materials</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guidelines</CardTitle>
              <CardDescription>
                Practical guidance for deploying the training system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Training Delivery Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Self-paced Online Modules</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Interactive modules with knowledge checks, allowing employees to progress at their own pace.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Facilitated Workshops</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Live sessions for complex topics and role-specific discussions, particularly for decision-makers and developers.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Microlearning Updates</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Brief, focused updates on regulatory changes and implementation insights delivered regularly.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Training Assessment</h3>
                <p className="mb-4">Assess knowledge acquisition through multiple methods:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Knowledge checks within modules</li>
                  <li>End-of-module assessments with minimum passing scores</li>
                  <li>Practical application exercises for developers and operators</li>
                  <li>Role-play scenarios for decision-makers</li>
                  <li>Continuous assessment through updates and refreshers</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
                <p>The platform tracks individual progress through:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Module completion status</li>
                  <li>Assessment scores</li>
                  <li>Time spent on each module</li>
                  <li>Required vs. optional module completion</li>
                  <li>Certification status</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Customization Options</h3>
                <p>The training system supports organization-specific customization:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Industry-specific examples and case studies</li>
                  <li>Integration with organizational policies</li>
                  <li>Custom role definitions beyond the four standard levels</li>
                  <li>Additional assessment types based on organizational needs</li>
                  <li>Branded training materials and interfaces</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
