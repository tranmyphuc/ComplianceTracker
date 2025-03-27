
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  BookOpen, FileText, Edit, CheckSquare, Award, 
  ArrowLeft, ArrowRight, Download, Check, AlertCircle,
  BookOpenCheck, BrainCircuit, Target, CalendarClock, 
  Clock, ThumbsUp, X, Lightbulb
} from "lucide-react";

interface ModuleContentProps {
  moduleId: string;
  title: string;
  content: any;
  onComplete: (score: number) => void;
  progress: number;
  userRole?: string;
}

export const TrainingContent = ({ 
  moduleId, 
  title, 
  content, 
  onComplete,
  progress,
  userRole = 'general'
}: ModuleContentProps) => {
  const [activeTab, setActiveTab] = useState("slides");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showSlideQuiz, setShowSlideQuiz] = useState(false);
  const [certificateExpiry, setCertificateExpiry] = useState<Date | null>(null);
  const [learningPath, setLearningPath] = useState<string | null>(null);
  
  // Set up personalized learning path based on userRole
  useEffect(() => {
    // Map user roles to learning paths
    const rolePaths: Record<string, string> = {
      'decision_maker': 'Strategic Path',
      'developer': 'Technical Path',
      'operator': 'Implementation Path',
      'legal': 'Compliance Path',
      'general': 'General Overview'
    };
    
    setLearningPath(rolePaths[userRole] || 'General Overview');
    
    // Set certificate expiry date (1 year from completion)
    if (progress >= 100) {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      setCertificateExpiry(expiryDate);
    }
  }, [userRole, progress]);
  
  // Handle slides navigation
  const handleNextSlide = () => {
    if (content.slides && currentSlide < content.slides.length - 1) {
      // If the slide has a quiz, show it before proceeding
      const currentSlideData = content.slides[currentSlide];
      if (currentSlideData.quiz && !quizAnswers[`slide-${currentSlide}`]) {
        setShowSlideQuiz(true);
        return;
      }
      
      setCurrentSlide(currentSlide + 1);
      setShowSlideQuiz(false);
    }
  };
  
  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setShowSlideQuiz(false);
    }
  };
  
  // Handle assessment selection
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (assessmentSubmitted) return;
    
    setAssessmentAnswers({
      ...assessmentAnswers,
      [questionIndex]: answerIndex
    });
  };
  
  // Handle quiz selection
  const handleQuizAnswerSelect = (quizId: string, answerIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [quizId]: answerIndex
    });
  };
  
  // Submit slide quiz
  const submitSlideQuiz = () => {
    setShowSlideQuiz(false);
    // Automatically move to the next slide after answering
    if (content.slides && currentSlide < content.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  // Submit assessment
  const handleSubmitAssessment = () => {
    if (!content.assessment || !content.assessment.questions) return;
    
    let correctAnswers = 0;
    content.assessment.questions.forEach((question: any, index: number) => {
      if (assessmentAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / content.assessment.questions.length) * 100);
    setAssessmentScore(score);
    setAssessmentSubmitted(true);
    
    if (score >= 70) {
      onComplete(score);
      
      // Set certificate expiry date (1 year from completion)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      setCertificateExpiry(expiryDate);
    }
  };
  
  // Reset assessment
  const handleResetAssessment = () => {
    setAssessmentAnswers({});
    setAssessmentSubmitted(false);
    setAssessmentScore(0);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Badge variant={progress >= 100 ? "success" : "outline"}>
          {progress >= 100 ? "Completed" : `${progress}% Complete`}
        </Badge>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="slides">
            <BookOpen className="h-4 w-4 mr-2" />
            Slides
          </TabsTrigger>
          <TabsTrigger value="document">
            <FileText className="h-4 w-4 mr-2" />
            Document
          </TabsTrigger>
          <TabsTrigger value="exercises">
            <Edit className="h-4 w-4 mr-2" />
            Exercises
          </TabsTrigger>
          <TabsTrigger value="assessment">
            <CheckSquare className="h-4 w-4 mr-2" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="certification" disabled={progress < 100}>
            <Award className="h-4 w-4 mr-2" />
            Certification
          </TabsTrigger>
        </TabsList>

        {/* Slides Content */}
        <TabsContent value="slides" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>
                  Slide {currentSlide + 1} of {content.slides?.length || 0}
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handlePrevSlide} 
                    disabled={currentSlide === 0}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleNextSlide}
                    disabled={!content.slides || currentSlide === content.slides.length - 1}>
                    Next <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {content.slides && content.slides[currentSlide] && !showSlideQuiz && (
                <div className="slide-content min-h-[400px]">
                  <h3 className="text-xl font-semibold mb-4">{content.slides[currentSlide].title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: content.slides[currentSlide].content }} />
                  
                  {/* Display learning path info if available */}
                  {learningPath && content.slides[currentSlide].pathRelevance && (
                    <Alert className="mt-4 bg-blue-50 border-blue-200">
                      <Target className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800 font-medium">Relevance to {learningPath}</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        {content.slides[currentSlide].pathRelevance[userRole] || 
                         content.slides[currentSlide].pathRelevance.general ||
                         "This content is relevant to all learning paths."}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Interactive tips based on role */}
                  {content.slides[currentSlide].roleTips && content.slides[currentSlide].roleTips[userRole] && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-amber-800">Tip for {userRole.replace('_', ' ')}s</p>
                          <p className="text-amber-700 text-sm mt-1">{content.slides[currentSlide].roleTips[userRole]}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interactive quiz after slide content */}
              {showSlideQuiz && content.slides && content.slides[currentSlide] && content.slides[currentSlide].quiz && (
                <div className="quiz-container bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-xl font-semibold mb-2">Quick Knowledge Check</h3>
                  <p className="mb-4 text-blue-700">Test your understanding before proceeding to the next slide.</p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3">{content.slides[currentSlide].quiz.question}</h4>
                    <div className="space-y-2">
                      {content.slides[currentSlide].quiz.options.map((option: string, index: number) => (
                        <Button
                          key={`quiz-option-${index}`}
                          variant={quizAnswers[`slide-${currentSlide}`] === index ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto py-3 px-4"
                          onClick={() => handleQuizAnswerSelect(`slide-${currentSlide}`, index)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={submitSlideQuiz}
                      disabled={quizAnswers[`slide-${currentSlide}`] === undefined}
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Content */}
        <TabsContent value="document" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Module Documentation</CardTitle>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" /> Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {content.document && (
                <div className="document-content">
                  <div dangerouslySetInnerHTML={{ __html: content.document }} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercises Content */}
        <TabsContent value="exercises" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Practical Exercises</CardTitle>
              <CardDescription>
                Complete these exercises to reinforce your understanding
              </CardDescription>
            </CardHeader>
            <CardContent>
              {content.exercises && content.exercises.map((exercise: any, index: number) => (
                <div key={`exercise-${index}`} className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Exercise {index + 1}: {exercise.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: exercise.description }} />
                  <div className="mt-3">
                    <h4 className="font-medium">Tasks:</h4>
                    <ul className="list-disc pl-5 mt-2">
                      {exercise.tasks.map((task: string, taskIndex: number) => (
                        <li key={`task-${taskIndex}`}>{task}</li>
                      ))}
                    </ul>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Content */}
        <TabsContent value="assessment" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Knowledge Assessment</CardTitle>
                  <CardDescription>
                    Complete this assessment to test your understanding
                  </CardDescription>
                </div>
                {assessmentSubmitted && (
                  <Badge 
                    variant={assessmentScore >= 70 ? "success" : "destructive"}
                    className="text-md py-1 px-3"
                  >
                    Score: {assessmentScore}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {assessmentSubmitted && assessmentScore < 70 && (
                <div className="bg-destructive/10 p-4 rounded-md mb-6 flex items-start">
                  <AlertCircle className="text-destructive h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">
                      You need a score of at least 70% to pass this assessment
                    </p>
                    <p className="text-sm mt-1">
                      Review the incorrect answers and try again
                    </p>
                  </div>
                </div>
              )}
              
              {content.assessment && content.assessment.questions && content.assessment.questions.map((question: any, qIndex: number) => (
                <div key={`question-${qIndex}`} className="mb-6">
                  <h3 className="text-lg font-medium mb-3">
                    Question {qIndex + 1}: {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option: string, oIndex: number) => (
                      <Button
                        key={`option-${qIndex}-${oIndex}`}
                        variant={
                          assessmentAnswers[qIndex] === oIndex
                            ? "default"
                            : "outline"
                        }
                        className={`w-full justify-start text-left h-auto py-3 px-4 ${
                          assessmentSubmitted && 
                          ((question.correctAnswer === oIndex && "border-green-500 bg-green-50") ||
                           (assessmentAnswers[qIndex] === oIndex && 
                            question.correctAnswer !== oIndex && "border-red-500 bg-red-50"))
                        }`}
                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                      >
                        <div className="flex items-start">
                          {assessmentSubmitted && question.correctAnswer === oIndex && (
                            <Check className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                          )}
                          {assessmentSubmitted && 
                           assessmentAnswers[qIndex] === oIndex && 
                           question.correctAnswer !== oIndex && (
                            <AlertCircle className="h-5 w-5 mr-2 text-red-600 flex-shrink-0" />
                          )}
                          <span>{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  {assessmentSubmitted && assessmentAnswers[qIndex] !== undefined && 
                   question.correctAnswer !== assessmentAnswers[qIndex] && (
                    <div className="mt-2 text-sm text-red-600">
                      <p><strong>Correct answer:</strong> {question.options[question.correctAnswer]}</p>
                      {question.explanation && (
                        <p className="mt-1"><strong>Explanation:</strong> {question.explanation}</p>
                      )}
                    </div>
                  )}
                  <Separator className="my-4" />
                </div>
              ))}
              
              <div className="flex justify-end gap-2 mt-4">
                {assessmentSubmitted ? (
                  <Button onClick={handleResetAssessment} variant="outline">
                    Try Again
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmitAssessment}
                    disabled={
                      !content.assessment || 
                      !content.assessment.questions || 
                      Object.keys(assessmentAnswers).length !== content.assessment.questions.length
                    }
                  >
                    Submit Assessment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certification Content */}
        <TabsContent value="certification" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Certificate of Completion</CardTitle>
              <CardDescription>
                You have successfully completed this training module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-4 border-primary/20 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Certificate of Achievement</h3>
                <p className="text-muted-foreground mb-6">EU AI Act Compliance Training</p>
                
                <h4 className="text-xl mb-1">This certifies that</h4>
                <p className="text-xl font-medium mb-6">[User's Name]</p>
                
                <p className="mb-1">has successfully completed the training module</p>
                <p className="text-lg font-semibold mb-6">{title}</p>
                
                <p className="text-sm mb-4">with an assessment score of {assessmentScore}%</p>
                
                {certificateExpiry && (
                  <div className="mb-6 flex flex-col items-center">
                    <div className="flex items-center text-amber-600 mb-1">
                      <CalendarClock className="h-4 w-4 mr-1.5" />
                      <span className="text-sm font-medium">Valid Until: {certificateExpiry.toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Please renew your certification before expiration to maintain compliance.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-center gap-3">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  {certificateExpiry && (
                    <Button variant="outline">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Add Renewal Reminder
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/10 flex flex-col items-stretch p-4">
              <div className="mb-4">
                <h4 className="font-medium mb-2">Certification Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Completed: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpenCheck className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Module: {moduleId}</span>
                  </div>
                  <div className="flex items-center">
                    <BrainCircuit className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Learning Path: {learningPath}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Score: {assessmentScore}%</span>
                  </div>
                </div>
              </div>
              
              <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <AlertTitle className="text-blue-800">Certificate Renewal Required</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      To maintain compliance with EU AI Act requirements, this certification must be renewed annually.
                    </AlertDescription>
                  </div>
                  <Button className="mt-3 sm:mt-0 sm:ml-4 bg-blue-600 hover:bg-blue-700" size="sm">
                    Set Renewal Notification
                  </Button>
                </div>
              </Alert>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
