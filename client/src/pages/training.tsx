import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Clipboard, FileText, Play } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { TrainingModules } from "@/components/training/training-modules";

export default function Training() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("modules");
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});

  // Fetch all training modules
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/training/modules'],
    queryFn: async () => {
      try {
        const response = await apiRequest('/api/training/modules', { method: 'GET' });
        return response;
      } catch (error) {
        // If API not available yet, return mock modules for development
        return [
          {
            id: "1",
            title: "EU AI Act Introduction",
            description: "Overview of the EU AI Act, its objectives, scope, and implications for organizations.",
            estimated_time: "45 minutes",
            topics: ["AI Act Overview", "Key Definitions", "Prohibited Practices", "Risk Categories"],
            role_relevance: {
              decision_maker: "High",
              developer: "High",
              operator: "High",
              user: "Medium"
            }
          },
          {
            id: "2",
            title: "Risk Classification System",
            description: "Detailed exploration of the risk-based approach and classification criteria.",
            estimated_time: "60 minutes",
            topics: ["Risk-Based Approach", "Classification Criteria", "Examples by Category", "Risk Assessment Process"],
            role_relevance: {
              decision_maker: "High",
              developer: "High",
              operator: "Medium",
              user: "Low"
            }
          },
          {
            id: "3",
            title: "Technical Requirements",
            description: "Technical compliance requirements for AI systems under the EU AI Act.",
            estimated_time: "90 minutes",
            topics: ["Data Governance", "Technical Documentation", "Record Keeping", "Transparency"],
            role_relevance: {
              decision_maker: "Medium",
              developer: "High",
              operator: "High",
              user: "Low"
            }
          },
          {
            id: "4",
            title: "Documentation Requirements",
            description: "Comprehensive guide to required documentation for AI system compliance.",
            estimated_time: "75 minutes",
            topics: ["Technical Documentation", "Risk Management", "Data Sheets", "User Instructions"],
            role_relevance: {
              decision_maker: "Medium",
              developer: "High",
              operator: "Medium",
              user: "Low"
            }
          },
          {
            id: "5",
            title: "Governance Framework",
            description: "Organizational governance structures for EU AI Act compliance.",
            estimated_time: "60 minutes",
            topics: ["Compliance Roles", "Reporting Structure", "Oversight Mechanisms", "Incident Response"],
            role_relevance: {
              decision_maker: "High",
              developer: "Medium",
              operator: "Medium",
              user: "Low"
            }
          },
          {
            id: "6",
            title: "Implementation Case Studies",
            description: "Real-world examples of EU AI Act implementation across various industries.",
            estimated_time: "90 minutes",
            topics: ["Healthcare AI", "Financial Services", "Manufacturing", "Public Services"],
            role_relevance: {
              decision_maker: "High",
              developer: "High",
              operator: "High",
              user: "Medium"
            }
          }
        ];
      }
    }
  });

  // Fetch user training progress
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/training/progress', user?.uid],
    queryFn: async () => {
      try {
        const response = await apiRequest('/api/training/progress', { 
          method: 'GET',
          params: { userId: user?.uid }
        });
        return response;
      } catch (error) {
        // If API not available yet, return mock progress for development
        return {
          "1": { completion: 100 },
          "2": { completion: 75 },
          "3": { completion: 35 },
          "4": { completion: 0 },
          "5": { completion: 0 },
          "6": { completion: 0 }
        };
      }
    },
    enabled: !!user
  });

  // Fetch active module content when selected
  const { data: moduleContent, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/training/modules', activeModule],
    queryFn: async () => {
      if (!activeModule) return null;
      
      try {
        const response = await apiRequest(`/api/training/modules/${activeModule}`, { 
          method: 'GET',
          params: { role: user?.role || 'user' }
        });
        return response;
      } catch (error) {
        // If API not available yet, return mock content for development
        const mockContent = {
          title: modules?.find(m => m.id === activeModule)?.title || "Module Content",
          sections: [
            {
              title: "Introduction",
              content: `
                <h3>Welcome to this training module</h3>
                <p>The EU AI Act is a comprehensive regulatory framework designed to ensure AI systems used within the European Union are safe, transparent, traceable, non-discriminatory and environmentally friendly. The Act takes a risk-based approach, with different requirements based on the level of risk posed by AI systems.</p>
                <p>This module will provide you with a fundamental understanding of the EU AI Act, its key provisions, and how it impacts your organization's AI development and deployment practices.</p>
              `
            },
            {
              title: "Learning Objectives",
              content: `
                <p>By the end of this module, you will be able to:</p>
                <ul>
                  <li>Understand the purpose and scope of the EU AI Act</li>
                  <li>Identify the different risk categories for AI systems</li>
                  <li>Recognize prohibited AI practices</li>
                  <li>Understand basic compliance requirements for your role</li>
                </ul>
              `
            },
            {
              title: "Key Concepts",
              content: `
                <h3>Risk-Based Approach</h3>
                <p>The EU AI Act classifies AI systems into four risk categories:</p>
                <ol>
                  <li><strong>Unacceptable Risk:</strong> AI systems that pose a clear threat to people are prohibited.</li>
                  <li><strong>High Risk:</strong> AI systems that could harm people's safety or fundamental rights are subject to strict requirements.</li>
                  <li><strong>Limited Risk:</strong> AI systems with specific transparency obligations.</li>
                  <li><strong>Minimal Risk:</strong> All other AI systems are subject to minimal regulation.</li>
                </ol>
                <p>Your responsibilities and compliance requirements will vary depending on the risk classification of the AI systems you work with.</p>
              `
            }
          ],
          assessments: [
            {
              question: "Which of the following is NOT one of the risk categories in the EU AI Act?",
              options: [
                "Unacceptable Risk",
                "High Risk",
                "Medium Risk",
                "Limited Risk"
              ],
              correctAnswer: "Medium Risk"
            },
            {
              question: "What happens to AI systems classified as 'Unacceptable Risk'?",
              options: [
                "They require continuous monitoring",
                "They are prohibited",
                "They need special certification",
                "They must be registered in an EU database"
              ],
              correctAnswer: "They are prohibited"
            }
          ]
        };
        return mockContent;
      }
    },
    enabled: !!activeModule
  });

  // Update progress in state whenever API data changes
  useEffect(() => {
    if (progress) {
      setModuleProgress(prev => {
        const newProgress = {...prev};
        Object.entries(progress).forEach(([moduleId, data]) => {
          newProgress[moduleId] = (data as any).completion || 0;
        });
        return newProgress;
      });
    }
  }, [progress]);

  // Function to track module progress
  const trackProgress = async (moduleId: string, completion: number) => {
    try {
      await apiRequest('/api/training/progress', {
        method: 'POST',
        body: {
          moduleId,
          userId: user?.uid,
          completion
        }
      });
      
      // Update local state
      setModuleProgress(prev => ({
        ...prev,
        [moduleId]: completion
      }));
      
      toast({
        title: "Progress updated",
        description: `Training progress recorded: ${completion}%`,
      });
    } catch (error) {
      console.error("Failed to track progress:", error);
      
      // Still update local state for development
      setModuleProgress(prev => ({
        ...prev,
        [moduleId]: completion
      }));
    }
  };

  // Handle module completion
  const handleCompleteModule = async () => {
    if (!activeModule) return;
    
    await trackProgress(activeModule, 100);
    
    toast({
      title: "Module completed!",
      description: "Congratulations on completing this training module.",
      variant: "default",
    });
  };

  // Function to determine if a module should be locked
  const isModuleLocked = (moduleId: string, index: number) => {
    if (index === 0) return false; // First module is always unlocked
    const prevModuleId = String(parseInt(moduleId) - 1);
    return (moduleProgress[prevModuleId] || 0) < 80; // Previous module must be at least 80% complete
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">EU AI Act Training</h1>
        <Button variant="outline" onClick={() => setActiveModule(null)} disabled={!activeModule}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modules
        </Button>
      </div>
      
      <Tabs defaultValue="modules" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules" disabled={!!activeModule}>
            <BookOpen className="mr-2 h-4 w-4" /> Training Modules
          </TabsTrigger>
          <TabsTrigger value="progress" disabled={!!activeModule}>
            <Clipboard className="mr-2 h-4 w-4" /> Your Progress
          </TabsTrigger>
          <TabsTrigger value="certificates" disabled={!!activeModule}>
            <FileText className="mr-2 h-4 w-4" /> Certificates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="space-y-4">
          {activeModule ? (
            <div className="space-y-6">
              {contentLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{moduleContent?.title}</CardTitle>
                      <CardDescription>
                        Progress: {moduleProgress[activeModule] || 0}% complete
                        <Progress value={moduleProgress[activeModule] || 0} className="mt-2" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {moduleContent?.sections.map((section, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-xl font-semibold">{section.title}</h3>
                          <div 
                            className="prose max-w-none" 
                            dangerouslySetInnerHTML={{ __html: section.content }}
                          />
                          <Separator className="my-4" />
                        </div>
                      ))}
                      
                      {moduleContent?.assessments && moduleContent.assessments.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">Assessment</h3>
                          <p className="text-gray-600">Complete this short assessment to test your understanding.</p>
                          
                          {moduleContent.assessments.map((assessment, index) => (
                            <Card key={index} className="mt-4">
                              <CardHeader>
                                <CardTitle className="text-lg">{assessment.question}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {assessment.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                      <input 
                                        type="radio" 
                                        id={`question-${index}-option-${optionIndex}`} 
                                        name={`question-${index}`} 
                                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                      />
                                      <label 
                                        htmlFor={`question-${index}-option-${optionIndex}`}
                                        className="text-gray-700"
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveModule(null)}>
                        Back to Modules
                      </Button>
                      <Button onClick={handleCompleteModule}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </div>
          ) : (
            <TrainingModules 
              modules={modules || []} 
              progress={moduleProgress}
              isLoading={modulesLoading}
              onSelectModule={setActiveModule}
              isModuleLocked={isModuleLocked}
            />
          )}
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Training Progress</CardTitle>
              <CardDescription>Track your completion of EU AI Act training modules</CardDescription>
            </CardHeader>
            <CardContent>
              {progressLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules?.map((module) => (
                    <div key={module.id} className="flex items-center space-x-4">
                      <div className="w-12 text-center">
                        {moduleProgress[module.id] === 100 ? (
                          <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-lg font-semibold">{moduleProgress[module.id] || 0}%</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <Progress value={moduleProgress[module.id] || 0} className="h-2" />
                      </div>
                      <div className="flex-[2]">
                        <span className="font-medium">{module.title}</span>
                      </div>
                      <Button 
                        variant={moduleProgress[module.id] === 100 ? "ghost" : "outline"} 
                        size="sm"
                        onClick={() => setActiveModule(module.id)}
                        disabled={isModuleLocked(module.id, parseInt(module.id) - 1)}
                      >
                        {moduleProgress[module.id] === 100 ? 'Review' : 'Continue'} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-sm text-gray-500">
                Complete all modules to receive your EU AI Act Compliance Certificate
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Training Certificates</CardTitle>
              <CardDescription>Your EU AI Act training accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.values(moduleProgress).some(p => p === 100) ? (
                <div className="space-y-4">
                  {modules?.filter(m => (moduleProgress[m.id] || 0) === 100).map((module) => (
                    <Card key={module.id} className="bg-gray-50">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Certificate ID: EUAI-{user?.uid?.substring(0, 6)}-{module.id}-{Date.now().toString().substring(7, 12)}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" /> Download Certificate
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No Certificates Yet</h3>
                  <p className="text-gray-500 mt-2">
                    Complete training modules to earn your certificates
                  </p>
                  <Button className="mt-4" onClick={() => setActiveTab("modules")}>
                    <Play className="mr-2 h-4 w-4" /> Start Training
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}