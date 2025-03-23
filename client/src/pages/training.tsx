import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Clock, BookOpen, CheckCircle2, Shield, BarChart4, User, Users, Award } from "lucide-react";
import axios from "axios";
import { useLocation } from 'wouter';
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrainingVisualGuidelines } from "@/components/training/visual-guidelines";
import {
  BookOpen as BookOpenIcon, Clock as ClockIcon, CheckCircle, BarChart4 as BarChart4Icon,
  BookMarked, Award as AwardIcon, User as UserIcon, AlertCircle, Layers, Info
} from "lucide-react";


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
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
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
  const [userRole, setUserRole] = useState('user'); // Added userRole state
  const [showGuidelines, setShowGuidelines] = useState(true);

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
        setUserRole(user?.role || 'user'); // Set userRole based on user data

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
        return <BookOpenIcon className="h-5 w-5 text-green-500" />;
      case 'operator':
        return <Users className="h-5 w-5 text-amber-500" />;
      default:
        return <UserIcon className="h-5 w-5 text-purple-500" />;
    }
  };

  const getModuleRelevance = (module: TrainingModule) => {
    const role = user?.role || 'user';
    return module.role_relevance[role as keyof typeof module.role_relevance] || 'Medium';
  };

  const calculateOverallProgress = () => {
    if (filteredModules.length === 0) return 0;

    const totalModules = filteredModules.length;
    const completedProgress = filteredModules.reduce((sum, module) => {
      return sum + (progress[module.id]?.completion || 0);
    }, 0);

    return Math.round(completedProgress / totalModules);
  };

  const getRelevantModules = () => {
    if (!filteredModules.length) return [];

    return filteredModules.filter(module =>
      module.role_relevance[userRole as keyof typeof module.role_relevance] === 'High' ||
      module.role_relevance[userRole as keyof typeof module.role_relevance] === 'Medium'
    ).sort((a, b) => {
      const aProgress = progress[a.id]?.completion || 0;
      const bProgress = progress[b.id]?.completion || 0;

      // Sort by completion (in-progress first, then not started, then completed)
      if (aProgress > 0 && aProgress < 100 && (bProgress === 0 || bProgress === 100)) return -1;
      if (bProgress > 0 && bProgress < 100 && (aProgress === 0 || aProgress === 100)) return 1;
      if (aProgress === 0 && bProgress === 100) return -1;
      if (bProgress === 0 && aProgress === 100) return 1;

      // Otherwise sort by module ID (assuming numerical order)
      return parseInt(a.id) - parseInt(b.id);
    });
  };

  const renderModuleCard = (module: TrainingModule) => {
    const moduleProgress = progress[module.id] || { completion: 0 };
    const isCompleted = moduleProgress.completion === 100;
    const isStarted = moduleProgress.completion > 0 && moduleProgress.completion < 100;

    return (
      <Card key={module.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{module.title}</CardTitle>
            <Badge variant={isCompleted ? "default" : isStarted ? "outline" : "secondary"} 
                   className={isCompleted ? "bg-green-500" : ""}>
              {isCompleted ? "Completed" : isStarted ? `${moduleProgress.completion}% Complete` : "Not Started"}
            </Badge>
          </div>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {module.topics.map((topic, index) => (
              <Badge key={`${module.id}-topic-${index}`} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>
          {moduleProgress.completion > 0 && (
            <Progress value={moduleProgress.completion} className="h-2" />
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4 mr-1" />
            {module.estimated_time}
          </div>
          <Button
            size="sm"
            onClick={() => setLocation(`/training/module/${module.id}`)}
          >
            {isCompleted ? "Review" : isStarted ? "Continue" : "Start"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    );
  };


  const getProgressMessage = () => {
    const overall = calculateOverallProgress();

    if (overall === 0) return "Start your training journey";
    if (overall < 25) return "Just getting started";
    if (overall < 50) return "Making good progress";
    if (overall < 75) return "Well on your way";
    if (overall < 100) return "Almost there!";
    return "Training complete";
  };

  const getCompletedModules = (): number => {
    return Object.values(progress).filter(p => p.completion === 100).length;
  };

  const getAverageScore = (): number => {
    const scores = Object.values(progress)
      .filter(p => p.assessmentScore !== undefined)
      .map(p => p.assessmentScore!);

    if (!scores.length) return 0;

    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">EU AI Act Training</h1>

        <Skeleton className="h-[200px] w-full mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>

        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">EU AI Act Training</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuidelines(!showGuidelines)}
          >
            {showGuidelines ? "Hide Guidelines" : "Show Guidelines"}
          </Button>
          {/* Placeholder for changing role - needs backend integration */}
          <Button size="sm" disabled>
            <UserIcon className="h-4 w-4 mr-2" />
            Change Role
          </Button>
        </div>
      </div>

      {showGuidelines && <TrainingVisualGuidelines />}

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart4Icon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="learning-path">
            <Layers className="h-4 w-4 mr-2" />
            Learning Path
          </TabsTrigger>
          <TabsTrigger value="all-modules">
            <BookMarked className="h-4 w-4 mr-2" />
            All Modules
          </TabsTrigger>
          <TabsTrigger value="certification">
            <AwardIcon className="h-4 w-4 mr-2" />
            Certification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {calculateOverallProgress()}%
                </div>
                <Progress value={calculateOverallProgress()} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Required Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {getRelevantModules().length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on your {userRole.replace('_', ' ')} role
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completed Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {getCompletedModules()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {calculateOverallProgress() === 100 ? "All modules completed" : "Continue your learning path"}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Continue Learning</h2>

              {getRelevantModules().filter(module =>
                progress[module.id]?.completion > 0 &&
                progress[module.id]?.completion < 100
              ).slice(0, 3).map(renderModuleCard)}

              {getRelevantModules().filter(module =>
                !progress[module.id] || progress[module.id]?.completion === 0
              ).slice(0, 3 - getRelevantModules().filter(module =>
                progress[module.id]?.completion > 0 &&
                progress[module.id]?.completion < 100
              ).length).map(renderModuleCard)}

              {getRelevantModules().every(module => progress[module.id]?.completion === 100) && (
                <div className="bg-primary/10 rounded-md p-4 flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Congratulations!</p>
                    <p className="text-sm">
                      You've completed all the required modules for your role.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Your Role</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="font-semibold mb-1">
                      {userRole === 'decision_maker' ? 'Decision Maker' :
                        userRole === 'developer' ? 'Developer' :
                        userRole === 'operator' ? 'Operator' : 'User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userRole === 'decision_maker' ? 'Strategic compliance and governance focus' :
                        userRole === 'developer' ? 'Technical implementation details focus' :
                        userRole === 'operator' ? 'Day-to-day operation and monitoring focus' :
                        'Basic awareness and proper usage focus'}
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h4 className="font-medium mb-2">Recommended Focus Areas:</h4>
                    <ul className="space-y-2">
                      {userRole === 'decision_maker' && (
                        <>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                            <span>Governance structures</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                            <span>Strategic compliance</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                            <span>Risk management</span>
                          </li>
                        </>
                      )}

                      {userRole === 'developer' && (
                        <>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Technical requirements</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Data governance</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                            <span>Technical documentation</span>
                          </li>
                        </>
                      )}

                      {userRole === 'operator' && (
                        <>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span>Human oversight</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span>Monitoring systems</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                            <span>Record keeping</span>
                          </li>
                        </>
                      )}

                      {userRole === 'user' && (
                        <>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-indigo-500" />
                            <span>Basic awareness</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-indigo-500" />
                            <span>System limitations</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 text-indigo-500" />
                            <span>Proper usage</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learning-path" className="mt-6">
          {/* ...rest of the learning path tab content... */}
        </TabsContent>

        <TabsContent value="all-modules" className="mt-6">
          {/* ...rest of the all modules tab content... */}
        </TabsContent>

        <TabsContent value="certification" className="mt-6">
          {/* ...rest of the certification tab content... */}
        </TabsContent>
      </Tabs>
    </div>
  );
}