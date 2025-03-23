import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/components/auth/auth-context";
import { TrainingModules } from "@/components/training/training-modules";
import { BookOpen, CheckCircle, ChevronLeft, FileText, GraduationCap, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// Type definitions
interface TrainingModule {
  id: string;
  title: string;
  description: string;
  estimated_time: string;
  topics: string[];
  role_relevance: {
    decision_maker: string;
    developer: string;
    operator: string;
    user: string;
  };
}

interface ModuleContent {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
  assessments: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export default function Training() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("modules");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [assessmentResponses, setAssessmentResponses] = useState<Record<number, string>>({});
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<{
    correct: number;
    total: number;
    passed: boolean;
  } | null>(null);

  // Fetch all training modules
  const { data: modules, isLoading: isLoadingModules } = useQuery({
    queryKey: ['/api/training/modules'],
    queryFn: async () => {
      const response = await apiRequest<TrainingModule[]>('/api/training/modules');
      return response;
    },
  });

  // Fetch user progress
  const { data: userProgress = {}, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['/api/training/progress', user?.uid],
    queryFn: async () => {
      const response = await apiRequest<Record<string, { completion: number }>>('/api/training/progress', {
        params: { userId: user?.uid }
      });
      return response;
    },
    enabled: !!user?.uid
  });

  // Fetch specific module content when a module is selected
  const { data: moduleContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ['/api/training/modules', selectedModuleId, user?.role],
    queryFn: async () => {
      const response = await apiRequest<ModuleContent>(`/api/training/modules/${selectedModuleId}?role=${user?.role || 'user'}`);
      return response;
    },
    enabled: !!selectedModuleId
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { moduleId: string; completion: number }) => {
      return await apiRequest<{ success: boolean }>('/api/training/progress', {
        method: 'POST',
        body: {
          moduleId: data.moduleId,
          userId: user?.uid,
          completion: data.completion
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/training/progress'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating progress",
        description: "Your progress could not be saved. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating progress:", error);
    }
  });

  // Check if specified module is locked
  const isModuleLocked = (moduleId: string, index: number) => {
    if (index === 0) return false; // First module is never locked
    
    // For subsequent modules, check if previous module has enough progress
    const prevModuleId = String(Number(moduleId) - 1);
    
    // Safely check if userProgress exists and has the property
    const progressData = userProgress && typeof userProgress === 'object' ? userProgress : {};
    const prevModuleProgress = progressData[prevModuleId]?.completion || 0;
    
    return prevModuleProgress < 80; // 80% completion required to unlock next module
  };

  // Handle module selection
  const handleSelectModule = (moduleId: string) => {
    const module = Array.isArray(modules) && modules.find(m => m.id === moduleId);
    if (!module) return;

    // Check if module is locked
    const moduleIndex = Array.isArray(modules) ? modules.findIndex(m => m.id === moduleId) : -1;
    if (moduleIndex > 0 && isModuleLocked(moduleId, moduleIndex)) {
      toast({
        title: "Module Locked",
        description: "You need to complete the previous module first (minimum 80% progress).",
        variant: "destructive"
      });
      return;
    }

    setSelectedModuleId(moduleId);
    setActiveTab("content");
    setActiveSection(0);
    setAssessmentResponses({});
    setAssessmentCompleted(false);
    setAssessmentResults(null);
  };

  // Update progress as user navigates through sections
  useEffect(() => {
    if (!selectedModuleId || !moduleContent) return;

    // Calculate current progress based on active section and assessments
    const sections = moduleContent.sections?.length || 0;
    const hasCompletedAssessment = assessmentCompleted;
    let progressPercentage = 0;

    if (sections > 0) {
      // If we're still in content sections
      if (activeSection < sections) {
        // Calculate progress based on sections viewed
        progressPercentage = Math.floor((activeSection / sections) * 70);
      } else {
        // User is in assessment section
        progressPercentage = 70;

        // Add up to 30% more for assessment completion
        if (hasCompletedAssessment) {
          progressPercentage = 100;
        } else {
          // Calculate progress based on answered questions
          const answeredCount = Object.keys(assessmentResponses).length;
          const totalQuestions = moduleContent.assessments?.length || 0;
          
          if (totalQuestions > 0) {
            const assessmentProgress = (answeredCount / totalQuestions) * 30;
            progressPercentage += assessmentProgress;
          }
        }
      }
    }

    // Update user progress in the database if it's higher than current
    const progressData = userProgress && typeof userProgress === 'object' ? userProgress : {};
    const currentProgress = progressData[selectedModuleId]?.completion || 0;
    if (progressPercentage > currentProgress) {
      updateProgressMutation.mutate({
        moduleId: selectedModuleId,
        completion: progressPercentage
      });
    }
  }, [selectedModuleId, activeSection, assessmentResponses, assessmentCompleted, moduleContent]);

  // Handle assessment submission
  const handleSubmitAssessment = () => {
    if (!moduleContent || !moduleContent.assessments) return;

    const totalQuestions = moduleContent.assessments.length;
    if (Object.keys(assessmentResponses).length < totalQuestions) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Calculate score
    let correctCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
      const userAnswer = assessmentResponses[i];
      const correctAnswer = moduleContent.assessments[i].correctAnswer;
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    }

    const percentCorrect = (correctCount / totalQuestions) * 100;
    const passed = percentCorrect >= 70; // 70% to pass

    setAssessmentResults({
      correct: correctCount,
      total: totalQuestions,
      passed
    });
    setAssessmentCompleted(true);

    // If passed, ensure 100% completion is recorded
    if (passed && selectedModuleId) {
      updateProgressMutation.mutate({
        moduleId: selectedModuleId,
        completion: 100
      });
    }
  };

  // Handle starting a new module after completing one
  const handleStartNextModule = () => {
    if (!modules || !selectedModuleId) return;
    
    const currentIndex = Array.isArray(modules) ? 
      modules.findIndex(m => m.id === selectedModuleId) : -1;
    
    if (currentIndex >= 0 && currentIndex < modules.length - 1) {
      const nextModule = modules[currentIndex + 1];
      handleSelectModule(nextModule.id);
    } else {
      // If we're at the last module, go back to modules list
      setActiveTab("modules");
      setSelectedModuleId(null);
    }
  };

  // Filter modules by role
  const filteredModules = Array.isArray(modules) ? 
    modules.filter(m => {
      // Only show if relevance for user's role is Medium or High
      const role = user?.role || "user";
      const relevance = m.role_relevance[role as keyof typeof m.role_relevance];
      return relevance !== "Low";
    }) : [];
  
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">EU AI Act Training</h1>
            <p className="text-muted-foreground">Learn about the EU AI Act and ensure your organization stays compliant</p>
          </div>
          {selectedModuleId && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedModuleId(null);
                setActiveTab("modules");
              }}
              className="flex items-center"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to modules
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules" disabled={!!selectedModuleId}>
            <BookOpen className="mr-2 h-4 w-4" /> Training Modules
          </TabsTrigger>
          <TabsTrigger value="content" disabled={!selectedModuleId}>
            <FileText className="mr-2 h-4 w-4" /> Module Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" /> Available Training Modules
              </CardTitle>
              <CardDescription>
                Select a module to start or continue your training on the EU AI Act
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrainingModules
                modules={filteredModules}
                progress={userProgress}
                isLoading={isLoadingModules || isLoadingProgress}
                onSelectModule={handleSelectModule}
                isModuleLocked={isModuleLocked}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          {isLoadingContent ? (
            <Card>
              <CardHeader>
                <div className="h-7 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ) : moduleContent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{moduleContent.title}</CardTitle>
                  <CardDescription>
                    {selectedModuleId && Array.isArray(modules) && 
                      modules.find(m => m.id === selectedModuleId)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{userProgress && typeof userProgress === 'object' && selectedModuleId ? 
                        userProgress[selectedModuleId]?.completion || 0 : 0}%</span>
                    </div>
                    <Progress value={userProgress && typeof userProgress === 'object' && selectedModuleId ? 
                      userProgress[selectedModuleId]?.completion || 0 : 0} />
                  </div>

                  {/* Content or Assessment display */}
                  {moduleContent.sections && activeSection < moduleContent.sections.length ? (
                    /* Content Section */
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold mb-2">
                        {moduleContent.sections[activeSection].title}
                      </h2>
                      <div 
                        className="prose max-w-none" 
                        dangerouslySetInnerHTML={{ 
                          __html: moduleContent.sections[activeSection].content 
                        }} 
                      />
                    </div>
                  ) : (
                    /* Assessment Section */
                    assessmentCompleted ? (
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-2">Assessment Results</h2>
                        
                        {assessmentResults && (
                          <div className="space-y-4">
                            <Alert variant={assessmentResults.passed ? "default" : "destructive"}>
                              <div className="flex items-center">
                                {assessmentResults.passed ? (
                                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 mr-2" />
                                )}
                                <AlertTitle>
                                  {assessmentResults.passed ? 
                                    "Congratulations! You've passed the assessment." :
                                    "Assessment not passed"
                                  }
                                </AlertTitle>
                              </div>
                              <AlertDescription>
                                You answered {assessmentResults.correct} out of {assessmentResults.total} questions correctly 
                                ({Math.round((assessmentResults.correct / assessmentResults.total) * 100)}%).
                              </AlertDescription>
                            </Alert>
                            
                            {assessmentResults.passed ? (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-green-800 font-medium">
                                  You have successfully completed this module. You can now proceed to the next module.
                                </p>
                              </div>
                            ) : (
                              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                                <p className="text-amber-800 font-medium">
                                  Review the module content and try again to improve your understanding of the EU AI Act.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-2">Module Assessment</h2>
                        <p className="mb-4">Complete this assessment to validate your understanding of the module content.</p>
                        
                        {moduleContent.assessments && moduleContent.assessments.map((assessment, index) => (
                          <div key={index} className="border rounded-md p-4 mb-4">
                            <p className="font-medium mb-2">{index + 1}. {assessment.question}</p>
                            <div className="space-y-2 mt-3">
                              {assessment.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center">
                                  <input
                                    type="radio"
                                    id={`q${index}-opt${optionIndex}`}
                                    name={`question-${index}`}
                                    className="mr-2"
                                    checked={assessmentResponses[index] === option}
                                    onChange={() => {
                                      setAssessmentResponses({
                                        ...assessmentResponses,
                                        [index]: option
                                      });
                                    }}
                                  />
                                  <label htmlFor={`q${index}-opt${optionIndex}`}>{option}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {/* Navigation buttons based on current section */}
                  {moduleContent.sections && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          if (activeSection > 0) {
                            setActiveSection(activeSection - 1);
                          } else if (selectedModuleId) {
                            // Go back to modules list
                            setSelectedModuleId(null);
                            setActiveTab("modules");
                          }
                        }}
                        disabled={activeSection === 0 && !selectedModuleId}
                      >
                        Previous
                      </Button>
                      
                      {activeSection < moduleContent.sections.length - 1 ? (
                        <Button onClick={() => setActiveSection(activeSection + 1)}>
                          Next
                        </Button>
                      ) : activeSection === moduleContent.sections.length - 1 ? (
                        <Button onClick={() => setActiveSection(activeSection + 1)}>
                          Go to Assessment
                        </Button>
                      ) : !assessmentCompleted ? (
                        <Button onClick={handleSubmitAssessment}>
                          Submit Assessment
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleStartNextModule}
                          disabled={!assessmentResults?.passed}
                        >
                          {assessmentResults?.passed ? 
                            "Start Next Module" : 
                            "Retry Assessment"
                          }
                        </Button>
                      )}
                    </>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Module Not Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p>The requested training module could not be found. Please select a different module.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  setSelectedModuleId(null);
                  setActiveTab("modules");
                }}>
                  Return to Modules
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}