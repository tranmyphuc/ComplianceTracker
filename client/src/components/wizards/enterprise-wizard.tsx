import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnterpriseProgressIndicator } from '../strategic/enterprise-progress-indicator';
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
  CheckCircle,
  Zap
} from 'lucide-react';

export interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  mascotMood: "happy" | "explaining" | "thinking" | "surprised" | "neutral" | "celebrating";
  mascotMessage: string;
  icon: React.ComponentType<{ className?: string }>;
  content?: React.ReactNode;
}

export interface EnterpriseWizardProps {
  steps?: WizardStep[];
  onComplete: () => void;
  onSkip?: () => void;
  variant?: 'default' | 'centered';
  initialStep?: number;
  title?: string;
  description?: string;
}

// Default steps that will be used if none are provided
const defaultSteps: WizardStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Enterprise AI Decision Platform",
    subtitle: "Discover how our advanced AI-powered platform can transform your strategic decision-making processes",
    mascotMood: "happy",
    mascotMessage: "Hi there! I'm AI Jack, your guide to making smarter, data-driven decisions with cutting-edge AI!",
    icon: Brain
  },
  {
    id: "insights",
    title: "AI-Powered Market Insights",
    subtitle: "Access real-time market intelligence and predictive analytics to stay ahead of industry trends",
    mascotMood: "explaining",
    mascotMessage: "Our AI analyzes vast amounts of market data to identify patterns that humans might miss, giving you a competitive edge.",
    icon: TrendingUp
  },
  {
    id: "strategic-planning",
    title: "Strategic Planning Tools",
    subtitle: "Leverage AI-driven scenario planning and resource optimization algorithms for better strategic decisions",
    mascotMood: "thinking",
    mascotMessage: "Strategic planning becomes easier with our AI models that can simulate thousands of business scenarios in seconds.",
    icon: Target
  },
  {
    id: "risk-intelligence",
    title: "Risk Intelligence & Compliance",
    subtitle: "Identify and mitigate potential risks while ensuring compliance with EU AI Act requirements",
    mascotMood: "thinking",
    mascotMessage: "Our risk assessment framework evaluates potential issues before they impact your business, keeping you compliant and secure.",
    icon: AlertTriangle
  },
  {
    id: "executive-dashboard",
    title: "Executive Dashboards",
    subtitle: "Gain a holistic view of your organization with customizable, AI-enhanced dashboards",
    mascotMood: "explaining",
    mascotMessage: "These dashboards filter out the noise to highlight what matters most for your key business decisions.",
    icon: BarChart3
  },
  {
    id: "opportunity-discovery",
    title: "Opportunity Discovery",
    subtitle: "Let AI help you discover new business opportunities that align with your strategic goals",
    mascotMood: "surprised",
    mascotMessage: "Based on emerging market patterns and your company's capabilities, I can identify high-probability opportunities.",
    icon: Lightbulb
  },
  {
    id: "generative-ai",
    title: "Generative AI Solutions",
    subtitle: "Leverage the creative power of generative AI to develop innovative approaches to business challenges",
    mascotMood: "happy",
    mascotMessage: "I can help generate creative solutions, content, and strategies tailored to your specific business needs!",
    icon: Sparkles
  },
  {
    id: "integration",
    title: "Seamless Integration Platform",
    subtitle: "Connect all your business systems for a unified view of your organization and more informed decisions",
    mascotMood: "explaining",
    mascotMessage: "Bring together data from across your organization to make decisions based on the complete picture.",
    icon: Network
  },
  {
    id: "completion",
    title: "Ready to Transform Your Decision-Making",
    subtitle: "You've completed the overview of our Enterprise AI Decision Platform. Now it's time to experience the power of AI-driven decision-making!",
    mascotMood: "happy",
    mascotMessage: "I'm excited to help you get started with your first AI-assisted decision journey!",
    icon: Award
  }
];

export function EnterpriseWizard({ 
  steps = defaultSteps, 
  onComplete, 
  onSkip, 
  variant = 'default',
  initialStep = 1,
  title = "Enterprise AI Decision Platform",
  description = "Enhance your decision making with AI-powered insights"
}: EnterpriseWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showWizard, setShowWizard] = useState(true);
  
  // Get step labels for the progress indicator
  const stepLabels = steps.map(step => step.id);
  
  // Get current step data
  const currentStepData = steps[currentStep - 1];
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle completion
  const handleComplete = () => {
    setShowWizard(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.1, duration: 0.3 }
    },
    exit: { 
      scale: 0.95, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {showWizard && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <motion.div
            className={`max-w-4xl w-full p-4 ${variant === 'centered' ? 'mx-auto' : ''}`}
            variants={cardVariants}
          >
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {React.createElement(currentStepData.icon, { 
                      className: "h-8 w-8 text-primary" 
                    })}
                    <div>
                      <CardTitle>{currentStepData.title}</CardTitle>
                      <CardDescription>{currentStepData.subtitle}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Step {currentStep} of {steps.length}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                {/* Progress Indicator */}
                <EnterpriseProgressIndicator 
                  steps={stepLabels}
                  currentStep={currentStep}
                  className="mb-8"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Left Column - Content */}
                  <div className="space-y-4">
                    {/* If the step has custom content, render it, otherwise render default content */}
                    {currentStepData.content ? (
                      currentStepData.content
                    ) : (
                      currentStep === 1 && (
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
                      )
                    )}
                  </div>
                  
                  {/* Right Column - AI Jack */}
                  <div className="flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <div className="relative w-full">
                          <AIJack
                            mood={currentStepData.mascotMood}
                            message={currentStepData.mascotMessage}
                            size="lg"
                            animate={true}
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={onSkip || handleComplete}
                >
                  {currentStep === steps.length ? "Close" : "Skip Tour"}
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="flex items-center"
                >
                  {currentStep === steps.length ? (
                    <>Get Started <CheckCircle className="ml-2 h-4 w-4" /></>
                  ) : (
                    <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}