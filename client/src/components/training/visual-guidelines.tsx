
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, Users, ListChecks, Award, BarChart4, 
  Layout, PanelLeft, Layers, FileText, CheckSquare
} from "lucide-react";

export function TrainingVisualGuidelines() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          EU AI Act Training Visual Guidelines
        </CardTitle>
        <CardDescription>
          Step-by-step guide for navigating and completing your training program
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="navigation">
          <TabsList className="mb-4">
            <TabsTrigger value="navigation">
              <Layout className="h-4 w-4 mr-2" />
              Dashboard Navigation
            </TabsTrigger>
            <TabsTrigger value="modules">
              <Layers className="h-4 w-4 mr-2" />
              Training Modules
            </TabsTrigger>
            <TabsTrigger value="completion">
              <CheckSquare className="h-4 w-4 mr-2" />
              Completion Path
            </TabsTrigger>
            <TabsTrigger value="certification">
              <Award className="h-4 w-4 mr-2" />
              Certification
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="navigation" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Dashboard Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start p-3 border rounded-md">
                    <PanelLeft className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Navigation Sidebar</h4>
                      <p className="text-sm text-muted-foreground">
                        Access your learning path, progress dashboard, module catalog, and certifications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <BarChart4 className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Progress Dashboard</h4>
                      <p className="text-sm text-muted-foreground">
                        View your overall progress, completed modules, and remaining requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <Layers className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Module Catalog</h4>
                      <p className="text-sm text-muted-foreground">
                        Browse all available training modules with relevance indicators
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <Users className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Role Selector</h4>
                      <p className="text-sm text-muted-foreground">
                        Select your organizational role to customize training content
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Navigation Flow</h3>
                <div className="relative pl-8 space-y-6 before:absolute before:top-0 before:bottom-0 before:left-3 before:w-0.5 before:bg-border">
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <h4 className="font-medium">Visit the Training Dashboard</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Access your personalized learning path and progress overview
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <h4 className="font-medium">Select Your Role</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose your organizational role to get role-specific content
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <h4 className="font-medium">Review Your Learning Path</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      See recommended modules based on your role and current progress
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <h4 className="font-medium">Start or Continue Training</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a module to begin or continue your training
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="modules" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Module Components</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start p-3 border rounded-md">
                    <BookOpen className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Interactive Slides</h4>
                      <p className="text-sm text-muted-foreground">
                        Step through visual presentations of key concepts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <FileText className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Comprehensive Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Access detailed written materials for in-depth learning
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <ListChecks className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Practical Exercises</h4>
                      <p className="text-sm text-muted-foreground">
                        Apply concepts through hands-on activities and scenarios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <CheckSquare className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Knowledge Assessment</h4>
                      <p className="text-sm text-muted-foreground">
                        Test your understanding with interactive quizzes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Module Navigation</h3>
                <div className="relative pl-8 space-y-6 before:absolute before:top-0 before:bottom-0 before:left-3 before:w-0.5 before:bg-border">
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <h4 className="font-medium">Review Module Information</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check the module title, description, estimated time, and current progress
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <h4 className="font-medium">Navigate Content Tabs</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Switch between slides, documentation, exercises, and assessment
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <h4 className="font-medium">Complete Each Component</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Progress through slides, review documentation, complete exercises
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <h4 className="font-medium">Take Assessment</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete the knowledge assessment to test your understanding
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertDescription>
                  <strong>Pro tip:</strong> You can download module documentation as PDF for offline reference or future review.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="completion" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Completion Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start p-3 border rounded-md">
                    <BookOpen className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Content Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Review all slides and documentation for each module
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <ListChecks className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Exercise Completion</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete the practical exercises for each module
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <CheckSquare className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Assessment Passing</h4>
                      <p className="text-sm text-muted-foreground">
                        Score at least 70% on each module's assessment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <Users className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Role Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete all modules required for your role
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Completion Path</h3>
                <div className="relative pl-8 space-y-6 before:absolute before:top-0 before:bottom-0 before:left-3 before:w-0.5 before:bg-border">
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <h4 className="font-medium">Review All Content</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Go through all slides and documentation thoroughly
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <h4 className="font-medium">Complete Practical Exercises</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Apply the concepts through hands-on exercises
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <h4 className="font-medium">Pass the Assessment</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Score at least 70% on the module assessment
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <h4 className="font-medium">Unlock Certificate</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gain access to your module completion certificate
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">5</span>
                    </div>
                    <h4 className="font-medium">Progress to Next Module</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Continue to the next module in your learning path
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> You can retry assessments as many times as needed to achieve a passing score.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="certification" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Certification Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start p-3 border rounded-md">
                    <Award className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Module Certification</h4>
                      <p className="text-sm text-muted-foreground">
                        Awarded upon successful completion of each individual module
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <Award className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Role Certification</h4>
                      <p className="text-sm text-muted-foreground">
                        Awarded after completing all modules required for your role
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <Award className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Expert Certification</h4>
                      <p className="text-sm text-muted-foreground">
                        Awarded for completing all available training modules
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <Award className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Organizational Certification</h4>
                      <p className="text-sm text-muted-foreground">
                        Available for organizations with over 80% staff completion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Certification Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Professional Recognition</p>
                      <p className="text-sm text-muted-foreground">
                        Demonstrate your expertise in EU AI Act compliance
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Verified Knowledge</p>
                      <p className="text-sm text-muted-foreground">
                        Validate your understanding of regulatory requirements
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Career Advancement</p>
                      <p className="text-sm text-muted-foreground">
                        Enhance your resume with in-demand compliance skills
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Organizational Value</p>
                      <p className="text-sm text-muted-foreground">
                        Help your organization demonstrate regulatory compliance
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Managing Certifications</h3>
                <div className="relative pl-8 space-y-6 before:absolute before:top-0 before:bottom-0 before:left-3 before:w-0.5 before:bg-border">
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <h4 className="font-medium">Access Certification Tab</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      View all your earned certificates in one place
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <h4 className="font-medium">Download Certificates</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Download your certificates in PDF format for your records
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <h4 className="font-medium">Share Certificates</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your achievements on professional networks
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 mt-1.5 h-5 w-5 rounded-full border bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <h4 className="font-medium">Verify Certificates</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Each certificate includes a unique verification code
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
