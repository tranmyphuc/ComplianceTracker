import { useState } from "react";
import { useLocation } from 'wouter';
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, BookOpen, User, Info, FileText, CheckCircle2, HelpCircle, ArrowRight } from "lucide-react";

export default function TrainingGuides() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => setLocation('/training')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Training
        </Button>
        <h1 className="text-3xl font-bold">Training Guides & Resources</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="general">
            <Info className="h-4 w-4 mr-2" />
            General Guides
          </TabsTrigger>
          <TabsTrigger value="role">
            <User className="h-4 w-4 mr-2" />
            Role-Specific
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Introduction to the EU AI Act</CardTitle>
              <CardDescription>
                A comprehensive overview of the EU AI Act and its key provisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The EU AI Act is the first comprehensive legal framework for artificial intelligence globally, focusing on a risk-based approach to regulation. Understanding its structure and requirements is essential for compliance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-primary/5">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Key Components
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Risk classification system</li>
                    <li>• Prohibited AI practices</li>
                    <li>• High-risk system requirements</li>
                    <li>• Transparency obligations</li>
                    <li>• Governance framework</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-primary/5">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Timeline
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Publication: Early 2024</li>
                    <li>• Entry into force: 20 days after publication</li>
                    <li>• Prohibited use provisions: 6 months after entry</li>
                    <li>• GPAI requirements: 12 months after entry</li>
                    <li>• High-risk provisions: 24 months after entry</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full sm:w-auto">
                Complete Guide
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk-Based Classification Explained</CardTitle>
              <CardDescription>
                Understanding how the EU AI Act categorizes AI systems by risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The EU AI Act's risk-based approach categorizes AI systems into four levels of risk, with specific requirements for each category. Understanding where your systems fall is the first step toward compliance.
              </p>
              <div className="space-y-4 my-6">
                <div className="border rounded-md p-4 bg-red-50 dark:bg-red-950/20">
                  <h4 className="font-medium mb-2 text-red-700 dark:text-red-400">Unacceptable Risk</h4>
                  <p className="text-sm">Systems that pose a clear threat to safety, livelihoods, or rights of people. These are prohibited outright.</p>
                </div>
                <div className="border rounded-md p-4 bg-amber-50 dark:bg-amber-950/20">
                  <h4 className="font-medium mb-2 text-amber-700 dark:text-amber-400">High Risk</h4>
                  <p className="text-sm">Systems with significant potential impact on health, safety, fundamental rights, etc. Subject to strict requirements.</p>
                </div>
                <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-950/20">
                  <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-400">Limited Risk</h4>
                  <p className="text-sm">Systems with specific transparency obligations (e.g., chatbots, emotion recognition).</p>
                </div>
                <div className="border rounded-md p-4 bg-green-50 dark:bg-green-950/20">
                  <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">Minimal Risk</h4>
                  <p className="text-sm">All other AI systems with minimal regulatory requirements. Voluntary codes encouraged.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full sm:w-auto">
                Risk Assessment Guide
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="role" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-950/20 border-b">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Decision Makers
                </CardTitle>
                <CardDescription>
                  For executives, compliance officers, and senior management
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Strategic Compliance Framework</h4>
                      <p className="text-sm text-muted-foreground">Develop organization-wide approaches to AI governance and compliance</p>
                    </div>
                  </li>
                  <Separator />
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Risk Management Strategies</h4>
                      <p className="text-sm text-muted-foreground">Approaches to identifying, assessing, and mitigating AI compliance risks</p>
                    </div>
                  </li>
                  <Separator />
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Resource Allocation Guide</h4>
                      <p className="text-sm text-muted-foreground">Planning for compliance costs, staffing, and implementation timelines</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Decision Maker Resources</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-950/20 border-b">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Developers & Engineers
                </CardTitle>
                <CardDescription>
                  For technical teams implementing AI systems
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Technical Requirements Guide</h4>
                      <p className="text-sm text-muted-foreground">Detailed breakdown of the technical aspects of EU AI Act compliance</p>
                    </div>
                  </li>
                  <Separator />
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Documentation Templates</h4>
                      <p className="text-sm text-muted-foreground">Technical documentation frameworks for high-risk AI systems</p>
                    </div>
                  </li>
                  <Separator />
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Implementation Checklist</h4>
                      <p className="text-sm text-muted-foreground">Step-by-step guide to implementing technical compliance measures</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Developer Resources</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation Templates</CardTitle>
                <CardDescription>Standardized templates for EU AI Act compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Risk Assessment Template</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Technical Documentation</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Conformity Assessment</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Data Governance Policy</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Download All</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Checklists & Guides</CardTitle>
                <CardDescription>Practical tools for implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Implementation Roadmap</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Compliance Checklist</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Audit Preparation Guide</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Vendor Assessment Tool</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View All Guides</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>External Resources</CardTitle>
                <CardDescription>Trusted sources for deeper learning</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">EU AI Act Full Text</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">European Commission Guidelines</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Industry Standards References</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Case Studies & Examples</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Access Resources</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about EU AI Act compliance training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Which modules are mandatory for my role?</h3>
                <p className="text-sm text-muted-foreground">
                  Training modules are prioritized based on your role in the organization. Modules marked with "High" relevance for your role should be considered mandatory, while "Medium" relevance modules are strongly recommended. You can see the relevance indicator on each module card.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">How often should I complete the training?</h3>
                <p className="text-sm text-muted-foreground">
                  We recommend completing the full training program annually, with refreshers on critical modules every six months. As regulatory updates occur, new or updated modules may be added to your training path.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Can I get a certification for completing the training?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, upon completion of all modules relevant to your role with a passing score of 70% or higher on assessments, you can generate a personalized certificate from the Certification section of the Training Center.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Where can I find additional learning resources?</h3>
                <p className="text-sm text-muted-foreground">
                  Additional resources are available in the Resources tab of this guide section. These include downloadable templates, checklists, and links to official EU AI Act documentation.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">How do I report issues or suggest improvements?</h3>
                <p className="text-sm text-muted-foreground">
                  We welcome your feedback to improve the training experience. Please use the Feedback button located in the bottom corner of any training page to report issues or suggest improvements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}