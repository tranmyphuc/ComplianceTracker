import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  BookOpen, 
  PenTool, 
  Shield, 
  FileText, 
  CheckCircle2,
  GraduationCap,
  ChevronLeft
} from "lucide-react";

export default function PlatformIntroduction() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/guides">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Guides
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">EU AI Act Compliance Platform Introduction</h1>
        <p className="text-muted-foreground">
          A comprehensive guide to getting started with the SGH ASIA EU AI Act Compliance Platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Introduction with Jack */}
        <Card className="border-primary/50">
          <CardContent className="p-0">
            <div className="relative">
              <div className="aspect-video bg-muted">
                <img 
                  src="/assets/image_1742743429066.png" 
                  alt="Platform Dashboard" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 left-0 bg-black/60 p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-primary bg-white">
                  <img 
                    src="/assets/1000048340-modified.png" 
                    alt="Jack from SGH ASIA" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Jack from SGH ASIA</p>
                  <p className="text-white text-sm mt-1">
                    Welcome to the EU AI Act Compliance Platform! I'm Jack, and I'll be your guide through this platform. 
                    Our goal is to help your organization navigate the complex requirements of the EU AI Act with ease.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Platform Overview</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The SGH ASIA EU AI Act Compliance Platform is a comprehensive solution designed to help organizations navigate 
                the complex requirements of the EU AI Act. Our platform provides a suite of tools and features to help you assess, 
                document, and monitor your AI systems for compliance with the EU AI Act.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Button variant="outline" asChild className="justify-between">
                  <Link href="/guides/platform-guide">
                    <span>Take a Platform Tour with Jack</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-between">
                  <Link href="/onboarding">
                    <span>Start Onboarding</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Key Features</CardTitle>
            <CardDescription>
              Explore the main components of the SGH ASIA EU AI Act Compliance Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Risk Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Assess your AI systems against EU AI Act risk criteria and determine compliance requirements
                  </p>
                  <Button variant="link" size="sm" asChild className="pl-0">
                    <Link href="/risk-assessment">
                      <span>Go to Risk Assessment</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <PenTool className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">System Registration</h3>
                  <p className="text-sm text-muted-foreground">
                    Register and manage your AI systems with detailed information and categorization
                  </p>
                  <Button variant="link" size="sm" asChild className="pl-0">
                    <Link href="/inventory">
                      <span>Go to System Inventory</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate and manage required documentation for AI systems based on risk level
                  </p>
                  <Button variant="link" size="sm" asChild className="pl-0">
                    <Link href="/documentation">
                      <span>Go to Documentation</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Knowledge Center</h3>
                  <p className="text-sm text-muted-foreground">
                    Access comprehensive resources about the EU AI Act and compliance requirements
                  </p>
                  <Button variant="link" size="sm" asChild className="pl-0">
                    <Link href="/knowledge-center">
                      <span>Go to Knowledge Center</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Approval Workflow</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage compliance approvals with structured workflows and notifications
                  </p>
                  <Button variant="link" size="sm" asChild className="pl-0">
                    <Link href="/workflow">
                      <span>Go to Approval Workflow</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Training</h3>
                  <p className="text-sm text-muted-foreground">
                    Access role-specific training modules to educate your team about EU AI Act compliance
                  </p>
                  <Button variant="link" size="sm" asChild className="pl-0">
                    <Link href="/training">
                      <span>Go to Training</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Getting Started Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to begin your EU AI Act compliance journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-6 list-decimal list-inside ml-2">
              <li className="pl-2">
                <span className="font-medium">Complete your profile</span>
                <p className="mt-1 text-sm text-muted-foreground ml-6">
                  Ensure your organization profile is complete with all relevant information
                </p>
              </li>
              <li className="pl-2">
                <span className="font-medium">Register your AI systems</span>
                <p className="mt-1 text-sm text-muted-foreground ml-6">
                  Add your AI systems to the inventory with detailed information about their purpose and functionality
                </p>
              </li>
              <li className="pl-2">
                <span className="font-medium">Conduct risk assessments</span>
                <p className="mt-1 text-sm text-muted-foreground ml-6">
                  Assess each AI system to determine its risk level under the EU AI Act
                </p>
              </li>
              <li className="pl-2">
                <span className="font-medium">Generate required documentation</span>
                <p className="mt-1 text-sm text-muted-foreground ml-6">
                  Create and maintain the documentation required for your AI systems based on their risk level
                </p>
              </li>
              <li className="pl-2">
                <span className="font-medium">Set up approval workflows</span>
                <p className="mt-1 text-sm text-muted-foreground ml-6">
                  Configure approval processes for risk assessments and documentation
                </p>
              </li>
              <li className="pl-2">
                <span className="font-medium">Train your team</span>
                <p className="mt-1 text-sm text-muted-foreground ml-6">
                  Assign relevant training modules to team members based on their roles
                </p>
              </li>
            </ol>
            
            <div className="mt-8">
              <Button asChild>
                <Link href="/onboarding">
                  Start Onboarding Process
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Additional Resources</CardTitle>
            <CardDescription>
              Explore these additional resources to enhance your understanding of EU AI Act compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" asChild className="justify-between h-auto py-4">
                <Link href="/guides/risk-assessment-guide">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Risk Assessment Guide</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Detailed guide to assessing AI system risks
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="justify-between h-auto py-4">
                <Link href="/knowledge-center">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">EU AI Act Knowledge Center</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Comprehensive resources about the legislation
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="justify-between h-auto py-4">
                <Link href="/documentation">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Documentation Templates</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Ready-to-use templates for required documentation
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="justify-between h-auto py-4">
                <Link href="/training">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Training Modules</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      Role-specific training content for your team
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}