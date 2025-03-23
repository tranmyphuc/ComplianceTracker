
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Clock, BookOpen, CheckCircle2, Shield, BarChart4, User, Users, Award } from "lucide-react";
import axios from "axios";

type TrainingModule = {
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
};

type Progress = {
  [key: string]: {
    completion: number;
    assessmentScore?: number;
  };
};

type ModuleContent = {
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
};

export default function Training() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("modules");
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/training/modules');
        setModules(response.data);
        
        // Fetch progress if user is logged in
        if (user?.uid) {
          const progressResponse = await axios.get(`/api/training/progress?userId=${user.uid}`);
          setProgress(progressResponse.data);
        }
      } catch (error) {
        console.error("Error fetching training modules:", error);
        toast({
          title: "Error",
          description: "Failed to load training modules. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [user?.uid, toast]);

  const fetchModuleContent = async (moduleId: string) => {
    try {
      setIsLoading(true);
      // Get user role or default to 'user'
      const role = user?.role || 'user';
      
      const response = await axios.get(`/api/training/modules/${moduleId}?role=${role}`);
      setModuleContent(response.data);
      setCurrentSection(0);
      setQuizMode(false);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error("Error fetching module content:", error);
      toast({
        title: "Error",
        description: "Failed to load module content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trackProgress = async (moduleId: string, completion: number) => {
    if (!user?.uid) return;
    
    try {
      await axios.post('/api/training/track-progress', {
        userId: user.uid,
        moduleId,
        completion
      });
      
      // Update local progress state
      setProgress(prev => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          completion
        }
      }));
    } catch (error) {
      console.error("Error tracking progress:", error);
    }
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    fetchModuleContent(moduleId);
    setActiveTab("content");
    
    // Track that user started the module if no progress yet
    if (!progress[moduleId]) {
      trackProgress(moduleId, 5); // 5% for starting
    }
  };

  const handleNextSection = () => {
    if (!moduleContent || !selectedModuleId) return;
    
    if (currentSection < moduleContent.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      
      // Calculate progress percentage
      const newProgress = Math.round(((currentSection + 2) / (moduleContent.sections.length + 1)) * 100);
      trackProgress(selectedModuleId, newProgress);
    } else {
      // Move to quiz mode after completing all sections
      setQuizMode(true);
      trackProgress(selectedModuleId, 80); // 80% for reaching quiz
    }
  };

  const handlePrevSection = () => {
    if (quizMode) {
      setQuizMode(false);
      setCurrentSection(moduleContent?.sections.length ? moduleContent.sections.length - 1 : 0);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex.toString()]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!moduleContent?.assessments) return;
    
    if (currentQuestion < moduleContent.assessments.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Show results when all questions are answered
      setShowResults(true);
      
      // Calculate score
      if (selectedModuleId) {
        const score = calculateScore();
        const newProgress = score >= 70 ? 100 : 90; // 100% for passing, 90% for trying
        trackProgress(selectedModuleId, newProgress);
        
        // Update assessment score
        setProgress(prev => ({
          ...prev,
          [selectedModuleId]: {
            ...prev[selectedModuleId],
            completion: newProgress,
            assessmentScore: score
          }
        }));
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = (): number => {
    if (!moduleContent?.assessments) return 0;
    
    let correct = 0;
    moduleContent.assessments.forEach((q, index) => {
      if (selectedAnswers[index.toString()] === q.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / moduleContent.assessments.length) * 100);
  };

  // Filter modules by role
  const filteredModules = Array.isArray(modules) ? 
    modules.filter(m => {
      // Only show if relevance for user's role is Medium or High
      const role = user?.role || "user";
      const relevance = m.role_relevance[role as keyof typeof m.role_relevance];
      return relevance !== "Low";
    }) : [];
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'decision_maker':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'developer':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'operator':
        return <Users className="h-5 w-5 text-amber-500" />;
      default:
        return <User className="h-5 w-5 text-purple-500" />;
    }
  };
  
  const getModuleRelevance = (module: TrainingModule) => {
    const role = user?.role || 'user';
    return module.role_relevance[role as keyof typeof module.role_relevance] || 'Medium';
  };
  
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

      {!selectedModuleId ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="modules">Training Modules</TabsTrigger>
            <TabsTrigger value="role">Your Learning Path</TabsTrigger>
            <TabsTrigger value="progress">Progress Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="h-6 bg-muted rounded-md w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded-md w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded-md w-5/6"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-9 bg-muted rounded-md w-1/3"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                filteredModules.map(module => {
                  const moduleProgress = progress[module.id] || { completion: 0 };
                  const relevance = getModuleRelevance(module);
                  
                  return (
                    <Card key={module.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle>{module.title}</CardTitle>
                          <Badge variant={
                            relevance === 'High' ? "default" : 
                            relevance === 'Medium' ? "secondary" : "outline"
                          }>
                            {relevance} Relevance
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {module.estimated_time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {module.topics.map(topic => (
                            <Badge key={topic} variant="outline">{topic}</Badge>
                          ))}
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{moduleProgress.completion}%</span>
                          </div>
                          <Progress value={moduleProgress.completion} className="h-2" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={() => handleModuleSelect(module.id)}
                          className="w-full"
                        >
                          {moduleProgress.completion === 0 ? 'Start Module' : 
                           moduleProgress.completion === 100 ? 'Review Module' : 'Continue Module'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="role">
            <Card>
              <CardHeader>
                <CardTitle>Your Personalized Learning Path</CardTitle>
                <CardDescription>
                  Training tailored to your role as {user?.role ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'User'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4 pb-4 border-b">
                  <div className="p-3 rounded-full bg-primary/10 mr-4">
                    {getRoleIcon(user?.role || 'user')}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {user?.role === 'decision_maker' ? 'AI Strategic Decision-Maker' :
                       user?.role === 'developer' ? 'AI System Developer' :
                       user?.role === 'operator' ? 'AI System Operator' : 'AI System User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.role === 'decision_maker' ? 'Focus on governance, strategic compliance, and risk management' :
                       user?.role === 'developer' ? 'Focus on technical implementation requirements and development practices' :
                       user?.role === 'operator' ? 'Focus on operational compliance, monitoring, and human oversight' : 
                       'Focus on basic awareness, proper usage, and limitation understanding'}
                    </p>
                  </div>
                </div>

                <h3 className="font-medium mb-3">Recommended Learning Path:</h3>
                <ol className="space-y-3">
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <li key={i} className="animate-pulse flex items-center">
                        <div className="h-8 w-8 rounded-full bg-muted mr-3 flex-shrink-0"></div>
                        <div className="h-5 bg-muted rounded-md w-2/3"></div>
                      </li>
                    ))
                  ) : (
                    filteredModules
                      .filter(m => getModuleRelevance(m) === 'High')
                      .map((module, index) => {
                        const moduleProgress = progress[module.id] || { completion: 0 };
                        return (
                          <li key={module.id} className="flex items-start">
                            <div className={`h-8 w-8 rounded-full mr-3 flex items-center justify-center text-white flex-shrink-0 ${
                              moduleProgress.completion === 100 ? 'bg-green-500' : 
                              moduleProgress.completion > 0 ? 'bg-amber-500' : 'bg-blue-500'
                            }`}>
                              {moduleProgress.completion === 100 ? 
                                <CheckCircle2 className="h-4 w-4" /> : 
                                <span>{index + 1}</span>
                              }
                            </div>
                            <div>
                              <div className="font-medium">{module.title}</div>
                              <div className="text-sm text-muted-foreground">{module.description}</div>
                              <div className="mt-1">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleModuleSelect(module.id)}
                                >
                                  {moduleProgress.completion === 0 ? 'Start' : 
                                   moduleProgress.completion === 100 ? 'Review' : 'Continue'}
                                </Button>
                              </div>
                            </div>
                          </li>
                        );
                      })
                  )}
                </ol>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Additional Recommended Modules:</h3>
                  <ul className="space-y-2">
                    {filteredModules
                      .filter(m => getModuleRelevance(m) === 'Medium')
                      .map(module => {
                        const moduleProgress = progress[module.id] || { completion: 0 };
                        return (
                          <li key={module.id} className="flex items-center">
                            <div className={`h-2 w-2 rounded-full mr-2 ${
                              moduleProgress.completion === 100 ? 'bg-green-500' : 
                              moduleProgress.completion > 0 ? 'bg-amber-500' : 'bg-blue-500'
                            }`}></div>
                            <span>{module.title}</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="ml-auto"
                              onClick={() => handleModuleSelect(module.id)}
                            >
                              {moduleProgress.completion === 0 ? 'Start' : 
                               moduleProgress.completion === 100 ? 'Review' : 'Continue'}
                            </Button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Training Progress Dashboard</CardTitle>
                <CardDescription>
                  Track your learning journey through the EU AI Act curriculum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" /> Overall Completion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="animate-pulse h-24 bg-muted rounded-md"></div>
                      ) : (
                        <>
                          <div className="flex justify-center items-center h-24">
                            <div className="relative h-20 w-20">
                              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#e9ecef"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#4361ee"
                                  strokeDasharray={`${getOverallProgress()}, 100`}
                                  strokeWidth="3"
                                />
                              </svg>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
                                {getOverallProgress()}%
                              </div>
                            </div>
                          </div>
                          <p className="text-center text-muted-foreground text-sm mt-2">
                            {getProgressMessage()}
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Award className="h-4 w-4 mr-2" /> Completed Modules
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="animate-pulse h-24 bg-muted rounded-md"></div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <div className="text-3xl font-bold">
                            {Object.values(progress).filter(p => p.completion === 100).length}
                            <span className="text-muted-foreground text-sm font-normal"> / {filteredModules.length}</span>
                          </div>
                          <p className="text-muted-foreground text-sm mt-2">
                            {Object.values(progress).filter(p => p.completion === 100).length === filteredModules.length
                              ? "All modules completed!"
                              : "Keep going to complete your training"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <BarChart4 className="h-4 w-4 mr-2" /> Assessment Scores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="animate-pulse h-24 bg-muted rounded-md"></div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <div className="text-3xl font-bold">
                            {getAverageScore()}%
                          </div>
                          <p className="text-muted-foreground text-sm mt-2">
                            Average assessment score
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <h3 className="font-medium mb-3">Module Progress</h3>
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded-md"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredModules.map(module => {
                      const moduleProgress = progress[module.id] || { completion: 0 };
                      return (
                        <div key={module.id} className="flex items-center">
                          <div className="w-1/3 font-medium truncate" title={module.title}>
                            {module.title}
                          </div>
                          <div className="w-1/2 px-4">
                            <Progress value={moduleProgress.completion} className="h-2" />
                          </div>
                          <div className="w-1/6 text-right">
                            {moduleProgress.completion}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {getCompletedModules() > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-3">Assessment Scores</h3>
                    <div className="space-y-3">
                      {Object.entries(progress)
                        .filter(([_, p]) => p.assessmentScore !== undefined)
                        .map(([moduleId, p]) => {
                          const module = modules.find(m => m.id === moduleId);
                          if (!module) return null;
                          
                          return (
                            <div key={moduleId} className="flex items-center">
                              <div className="w-1/3 font-medium truncate" title={module.title}>
                                {module.title}
                              </div>
                              <div className="w-1/2 px-4">
                                <Progress 
                                  value={p.assessmentScore} 
                                  className="h-2"
                                  indicator={p.assessmentScore! >= 70 ? "bg-green-500" : "bg-amber-500"}
                                />
                              </div>
                              <div className="w-1/6 text-right">
                                {p.assessmentScore}%
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div>
          {isLoading ? (
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded-md w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-1/4"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded-md w-full"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
                <div className="h-4 bg-muted rounded-md w-4/6"></div>
              </CardContent>
            </Card>
          ) : moduleContent ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{moduleContent.title}</CardTitle>
                  <Badge>
                    {quizMode ? 'Assessment' : `Section ${currentSection + 1}/${moduleContent.sections.length}`}
                  </Badge>
                </div>
                <CardDescription>
                  <div className="flex justify-between">
                    <span>
                      {quizMode
                        ? `Question ${currentQuestion + 1}/${moduleContent.assessments?.length || 0}`
                        : moduleContent.sections[currentSection]?.title}
                    </span>
                    <span>
                      {selectedModuleId && progress[selectedModuleId]?.completion || 0}% complete
                    </span>
                  </div>
                  <Progress 
                    value={selectedModuleId ? progress[selectedModuleId]?.completion || 0 : 0} 
                    className="h-2 mt-2" 
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizMode ? (
                  showResults ? (
                    <div className="py-4">
                      <h3 className="text-xl font-bold mb-4">Assessment Results</h3>
                      <div className="text-center py-8">
                        <div className={`text-4xl font-bold mb-2 ${calculateScore() >= 70 ? 'text-green-500' : 'text-amber-500'}`}>
                          {calculateScore()}%
                        </div>
                        <p className="text-muted-foreground mb-6">
                          {calculateScore() >= 70 
                            ? "Congratulations! You've successfully completed this module."
                            : "You didn't reach the passing score (70%). Consider reviewing the module and trying again."}
                        </p>
                        
                        <div className="flex justify-center gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setQuizMode(false);
                              setCurrentSection(0);
                              setShowResults(false);
                            }}
                          >
                            Review Module
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedModuleId(null);
                              setActiveTab("modules");
                            }}
                          >
                            Back to Modules
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t">
                        <h4 className="font-medium mb-4">Question Review</h4>
                        <div className="space-y-6">
                          {moduleContent.assessments.map((assessment, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <p className="font-medium mb-2">{assessment.question}</p>
                              <div className="space-y-2">
                                {assessment.options.map((option) => (
                                  <div 
                                    key={option} 
                                    className={`p-3 rounded-md text-sm ${
                                      option === assessment.correctAnswer
                                        ? 'bg-green-100 border border-green-300'
                                        : selectedAnswers[index.toString()] === option && option !== assessment.correctAnswer
                                          ? 'bg-red-100 border border-red-300'
                                          : 'bg-muted'
                                    }`}
                                  >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      {moduleContent.assessments && moduleContent.assessments[currentQuestion] && (
                        <div>
                          <h3 className="text-lg font-medium mb-4">{moduleContent.assessments[currentQuestion].question}</h3>
                          <div className="space-y-3">
                            {moduleContent.assessments[currentQuestion].options.map((option) => (
                              <div
                                key={option}
                                className={`p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                                  selectedAnswers[currentQuestion.toString()] === option
                                    ? 'bg-primary/10 border-primary'
                                    : ''
                                }`}
                                onClick={() => handleAnswerSelect(currentQuestion, option)}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: moduleContent.sections[currentSection]?.content }} />
                  </ScrollArea>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button
                  variant="outline"
                  onClick={quizMode ? handlePrevQuestion : handlePrevSection}
                  disabled={(quizMode && currentQuestion === 0) || (!quizMode && currentSection === 0)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={quizMode ? handleNextQuestion : handleNextSection}
                  disabled={quizMode && showResults}
                >
                  {quizMode && currentQuestion === (moduleContent.assessments?.length || 0) - 1
                    ? 'Finish'
                    : 'Next'} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p>Module content could not be loaded. Please try again.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setSelectedModuleId(null)}
                >
                  Back to Modules
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  // Helper functions
  function getOverallProgress(): number {
    if (!filteredModules.length) return 0;
    
    const totalModules = filteredModules.length;
    const completedProgress = filteredModules.reduce((sum, module) => {
      return sum + (progress[module.id]?.completion || 0);
    }, 0);
    
    return Math.round(completedProgress / totalModules);
  }
  
  function getProgressMessage(): string {
    const overall = getOverallProgress();
    
    if (overall === 0) return "Start your training journey";
    if (overall < 25) return "Just getting started";
    if (overall < 50) return "Making good progress";
    if (overall < 75) return "Well on your way";
    if (overall < 100) return "Almost there!";
    return "Training complete";
  }
  
  function getCompletedModules(): number {
    return Object.values(progress).filter(p => p.completion === 100).length;
  }
  
  function getAverageScore(): number {
    const scores = Object.values(progress)
      .filter(p => p.assessmentScore !== undefined)
      .map(p => p.assessmentScore!);
    
    if (!scores.length) return 0;
    
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
  }
}
