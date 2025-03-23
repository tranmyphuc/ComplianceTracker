import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnterpriseProgressIndicator } from './enterprise-progress-indicator';
import { AIJack } from '../onboarding/ai-jack';
import { 
  ChevronRight, 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  BarChart3,
  Lightbulb,
  Sparkles,
  Network,
  Award,
  CheckCircle
} from 'lucide-react';

interface EnterpriseDecisionPlatformProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function EnterpriseDecisionPlatform({ onComplete, onSkip }: EnterpriseDecisionPlatformProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showWizard, setShowWizard] = useState(true);
  
  // Define wizard steps
  const wizardSteps = [
    {
      id: "welcome",
      title: "Welcome to the Enterprise AI Decision Platform",
      subtitle: "Discover how our advanced AI-powered platform can transform your strategic decision-making processes",
      mascotMood: "happy" as const,
      mascotMessage: "Hi there! I'm AI Jack, your guide to making smarter, data-driven decisions with cutting-edge AI!",
      icon: Brain
    },
    {
      id: "insights",
      title: "AI-Powered Market Insights",
      subtitle: "Access real-time market intelligence and predictive analytics to stay ahead of industry trends",
      mascotMood: "explaining" as const,
      mascotMessage: "Our AI analyzes vast amounts of market data to identify patterns that humans might miss, giving you a competitive edge.",
      icon: TrendingUp
    },
    {
      id: "strategic-planning",
      title: "Strategic Planning Tools",
      subtitle: "Leverage AI-driven scenario planning and resource optimization algorithms for better strategic decisions",
      mascotMood: "thinking" as const,
      mascotMessage: "Strategic planning becomes easier with our AI models that can simulate thousands of business scenarios in seconds.",
      icon: Target
    },
    {
      id: "risk-intelligence",
      title: "Risk Intelligence Dashboard",
      subtitle: "Identify, quantify and mitigate business risks with predictive analytics and early warning systems",
      mascotMood: "explaining" as const,
      mascotMessage: "Our risk intelligence system detects potential threats before they materialize, allowing proactive management.",
      icon: AlertTriangle
    },
    {
      id: "executive-dashboard",
      title: "Executive Decision Dashboard",
      subtitle: "Access a customizable dashboard with key performance indicators and decision-critical metrics",
      mascotMood: "explaining" as const,
      mascotMessage: "Your personalized executive dashboard highlights the most important information for your decision-making needs.",
      icon: BarChart3
    },
    {
      id: "opportunity-detection",
      title: "AI Opportunity Detection",
      subtitle: "Automatically identify new business opportunities and growth areas using advanced pattern recognition",
      mascotMood: "happy" as const,
      mascotMessage: "Our AI can spot emerging opportunities that align with your business strategy and resource capabilities.",
      icon: Lightbulb
    },
    {
      id: "generative-insights",
      title: "Generative AI Insights",
      subtitle: "Generate creative solutions to complex business challenges with our advanced generative AI models",
      mascotMood: "thinking" as const,
      mascotMessage: "Tackle your toughest business problems with AI that can suggest innovative approaches you might not have considered.",
      icon: Sparkles
    },
    {
      id: "integration",
      title: "Seamless Data Integration",
      subtitle: "Connect all your business systems and data sources for a unified view of your enterprise",
      mascotMood: "explaining" as const,
      mascotMessage: "No more siloed data! Our platform integrates information from across your organization for holistic insights.",
      icon: Network
    },
    {
      id: "complete",
      title: "Ready to Transform Your Decision-Making",
      subtitle: "You're now equipped to harness the power of AI for smarter, faster, and more effective business decisions",
      mascotMood: "celebrating" as const,
      mascotMessage: "Congratulations! You're all set to revolutionize your strategic decision-making process with AI. Let's get started!",
      icon: Award
    }
  ];
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < wizardSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle skip
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      handleComplete();
    }
  };
  
  // Handle completion
  const handleComplete = () => {
    setShowWizard(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };
  
  // Get current step data
  const currentStepData = wizardSteps[currentStep - 1];
  
  // Step labels for the progress indicator
  const stepLabels = [
    "welcome", 
    "insights", 
    "strategic-planning", 
    "risk-intelligence", 
    "executive-dashboard",
    "opportunity",
    "generative-ai",
    "integration",
    "complete"
  ];
  
  return (
    <AnimatePresence>
      {showWizard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-auto"
          >
            <Card className="shadow-xl border-primary/10">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      {currentStepData.icon && React.createElement(currentStepData.icon, { 
                        className: "h-5 w-5 text-primary" 
                      })}
                    </div>
                    <div>
                      <CardTitle>{currentStepData.title}</CardTitle>
                      <CardDescription>{currentStepData.subtitle}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Step {currentStep} of {wizardSteps.length}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                {/* Progress Indicator - Improved version */}
                <EnterpriseProgressIndicator 
                  steps={stepLabels}
                  currentStep={currentStep}
                  className="mb-8"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Left Column - Content */}
                  <div className="space-y-4">
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Revolutionize Your Business Decisions</h3>
                        <p>The Enterprise AI Decision Platform combines cutting-edge artificial intelligence with your business expertise to enhance strategic decision-making.</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>AI-powered predictive analytics and forecasting</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Strategic scenario planning and opportunity identification</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Executive dashboards with decision-critical insights</span>
                          </li>
                        </ul>
                      </div>
                    )}
                    
                    {currentStep === 9 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Get Started Today</h3>
                        <p>You've completed the overview of our Enterprise AI Decision Platform. Now it's time to experience the power of AI-driven decision-making!</p>
                        <div className="pt-2">
                          <Button className="w-full" onClick={handleComplete}>
                            Begin Your AI Journey <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column - AI Jack */}
                  <div className="flex flex-col items-center justify-center">
                    <AIJack
                      mood={currentStepData.mascotMood}
                      message={currentStepData.mascotMessage}
                      size="lg"
                      animate={true}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex justify-between">
                {currentStep === 1 ? (
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip Tour
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
                
                {currentStep < wizardSteps.length && (
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                )}
                
                {currentStep === wizardSteps.length && (
                  <Button onClick={handleComplete}>
                    Complete
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}