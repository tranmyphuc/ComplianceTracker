import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Info, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Presentation, 
  HelpCircle,
  AlertCircle 
} from "lucide-react";

export default function GuidesIndex() {
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">EU AI Act Compliance Platform Guides</h1>
        <p className="text-muted-foreground">
          Comprehensive guides to help you navigate the SGH ASIA EU AI Act Compliance Platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Get a comprehensive tour of the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A detailed walkthrough of all platform features, including navigation, key functions, and best practices.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/guides/platform-guide">
                View Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Platform Introduction</CardTitle>
            <CardDescription>Interactive overview with Jack</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A guided introduction to the platform with Jack, focusing on key features and how to use them effectively.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/guides/platform-introduction">
                View Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Learn how to assess AI system risks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A detailed guide on conducting risk assessments for AI systems under the EU AI Act requirements.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/risk-assessment/guides">
                View Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>System Registration</CardTitle>
            <CardDescription>Register AI systems for compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learn how to register and categorize your AI systems properly according to EU AI Act guidelines.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/guides/registration-guide">
                Coming Soon
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Create compliant documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              How to generate, manage, and maintain documentation required for EU AI Act compliance.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/guides/documentation-guide">
                Coming Soon
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <CheckSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Approval Workflows</CardTitle>
            <CardDescription>Manage compliance approvals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Guide to the approval workflow process for risk assessments, documentation, and other compliance elements.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/guides/approval-workflow">
                Coming Soon
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-muted/30 p-6 rounded-lg mb-8">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-xl font-semibold">Need assistance?</h2>
          <p className="text-sm text-muted-foreground">
            Use these helpful resources to get the most out of the platform:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Ask questions about EU AI Act compliance through the AI Assistant button.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Voice Commands</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Use voice commands to navigate the platform and access information.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Knowledge Center</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Access the Knowledge Center for detailed information about compliance requirements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/">
            Start Using the Platform
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}