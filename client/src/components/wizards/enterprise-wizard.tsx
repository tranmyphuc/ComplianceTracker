import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Brain, TrendingUp, Target, BarChart3, Lightbulb, Sparkles, AlertTriangle, Network, Award } from 'lucide-react';
import { WizardStep } from '@/types/wizard';

interface EnterpriseWizardProps {
  steps?: WizardStep[];
  onComplete: () => void;
  onSkip?: () => void;
  variant?: 'default' | 'centered';
  initialStep?: number;
  title?: string;
  description?: string;
}

// Default steps for the Enterprise Wizard
const defaultSteps: WizardStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Enterprise AI Decision Platform",
    subtitle: "Discover how our advanced AI-powered platform can transform your strategic decision-making processes",
    content: "Our platform integrates cutting-edge AI technology with your business expertise to provide actionable insights and recommendations for better decision-making.",
    mascotMood: "happy",
    mascotMessage: "Hi there! I'm your AI assistant, ready to help you make smarter, data-driven decisions!",
    icon: Brain,
    imageSrc: "/assets/images/tour/welcome-dashboard.png"
  },
  {
    id: "insights",
    title: "AI-Powered Market Insights",
    subtitle: "Access real-time market intelligence and predictive analytics",
    content: "Our AI analyzes vast amounts of market data to identify patterns and trends that might be missed by human analysis, giving you a competitive edge in your industry.",
    mascotMood: "explaining",
    mascotMessage: "I can analyze industry trends and market conditions to help you stay ahead of the competition!",
    icon: TrendingUp,
    imageSrc: "/assets/images/tour/market-insights.png"
  },
  {
    id: "strategic-planning",
    title: "Strategic Planning Tools",
    subtitle: "Leverage AI-driven scenario planning and resource optimization",
    content: "Use our advanced modeling tools to simulate various business scenarios and optimize resource allocation for maximum efficiency and profitability.",
    mascotMood: "thinking",
    mascotMessage: "Strategic planning becomes easier with models that can simulate thousands of business scenarios in seconds.",
    icon: Target,
    imageSrc: "/assets/images/tour/strategic-planning.png"
  },
  {
    id: "risk-assessment",
    title: "Risk Intelligence & Compliance",
    subtitle: "Identify and mitigate potential risks while ensuring compliance with EU AI Act requirements",
    content: "Our risk assessment tools help you identify, quantify, and mitigate various business risks, ensuring your operations remain resilient in challenging environments.",
    mascotMood: "alert",
    mascotMessage: "I'll help you identify potential risks and develop strategies to mitigate them effectively.",
    icon: AlertTriangle,
    imageSrc: "/assets/images/tour/risk-dashboard.png"
  },
  {
    id: "executive-dashboard",
    title: "Executive Dashboards",
    subtitle: "Gain a holistic view of your organization with customizable, AI-enhanced dashboards",
    content: "These dashboards filter out the noise to highlight what matters most for your key business decisions.",
    mascotMood: "explaining",
    mascotMessage: "These dashboards provide a holistic view of your organization, highlighting key performance indicators for better decision-making.",
    icon: BarChart3,
    imageSrc: "/assets/images/tour/executive-dashboard.png"
  },
  {
    id: "opportunity-discovery",
    title: "Opportunity Discovery",
    subtitle: "Let AI help you discover new business opportunities that align with your strategic goals",
    content: "Based on emerging market patterns and your company's capabilities, I can identify high-probability opportunities.",
    mascotMood: "surprised",
    mascotMessage: "I can help you discover new business opportunities based on your strategic goals and emerging market trends.",
    icon: Lightbulb,
    imageSrc: "/assets/images/tour/opportunity-discovery.png"
  },
  {
    id: "generative-ai",
    title: "Generative AI Solutions",
    subtitle: "Leverage the creative power of generative AI to develop innovative approaches to business challenges",
    content: "I can help generate creative solutions, content, and strategies tailored to your specific business needs!",
    mascotMood: "happy",
    mascotMessage: "I can help you generate creative solutions and content to address your business challenges.",
    icon: Sparkles,
    imageSrc: "/assets/images/tour/generative-ai.png"
  },
  {
    id: "integration",
    title: "Seamless Integration Platform",
    subtitle: "Connect all your business systems for a unified view of your organization and more informed decisions",
    content: "Bring together data from across your organization to make decisions based on the complete picture.",
    mascotMood: "explaining",
    mascotMessage: "I can help you integrate data from various sources to provide a comprehensive view of your organization.",
    icon: Network,
    imageSrc: "/assets/images/tour/integration.png"
  },
  {
    id: "completion",
    title: "Ready to Transform Your Decision-Making",
    subtitle: "You've completed the overview of our Enterprise AI Decision Platform. Now it's time to experience the power of AI-driven decision-making!",
    content: "Dive into our platform's features and start leveraging the power of AI to enhance your strategic decision-making processes and drive business growth.",
    mascotMood: "happy",
    mascotMessage: "I'm excited to help you get started with your first AI-assisted decision journey!",
    icon: Award,
    imageSrc: "/assets/images/tour/completion.png"
  }
];

export function EnterpriseWizard({
  steps = defaultSteps,
  onComplete,
  onSkip,
  variant = 'default',
  initialStep = 1,
  title = "Enterprise AI Decision Platform",
  description = "Transform your decision-making with AI-powered insights"
}: EnterpriseWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);

  // Handle next step button click
  const handleNext = () => {
    if (currentStep === steps.length) {
      handleComplete();
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step button click
  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle completion of the wizard
  const handleComplete = () => {
    onComplete();
  };

  // Animation variants for the wizard
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0
    })
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / steps.length) * 100;

  // Get current step data
  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData?.icon || Brain;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/50 flex ${variant === 'centered' ? 'items-center justify-center' : 'items-start justify-end'} p-4 z-50`}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.3 }}
          className={`${variant === 'centered' ? 'w-full max-w-2xl' : 'w-full max-w-md'}`}
        >
          <Card className="border-none shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-t-lg pb-3">
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <div className="text-sm font-medium">Step {currentStep} of {steps.length}</div>
              </div>
              <CardDescription className="text-white opacity-90">{description}</CardDescription>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full mt-3">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  <StepIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{currentStepData.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentStepData.subtitle}</p>
                </div>
              </div>

              {/* Step content with image */}
              <div className="space-y-4">
                {currentStepData.imageSrc && (
                  <div className="overflow-hidden rounded-lg border shadow-sm mb-4">
                    <img
                      src={currentStepData.imageSrc}
                      alt={`${currentStepData.title} illustration`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        // Fallback if image doesn't load
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/images/tour/placeholder.png";
                      }}
                    />
                  </div>
                )}

                <p className="text-sm leading-relaxed">{currentStepData.content}</p>

                {/* Mascot message */}
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mt-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full p-2 mt-1">
                      <Brain className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-800">AI Assistant</p>
                      <p className="text-sm text-indigo-700">{currentStepData.mascotMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between p-4 pt-2 border-t">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? (onSkip || handleComplete) : handlePrevious}
                className="flex items-center"
              >
                {currentStep === 1 ? (
                  "Skip Tour"
                ) : (
                  <>Previous</>
                )}
              </Button>

              <Button
                onClick={handleNext}
                className="flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
      </AnimatePresence>
    </motion.div>
  );
}

export function EnterpriseTourWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Tour step content with images and descriptions
  const tourSteps = [
    {
      title: "Welcome to Enterprise Decision Platform",
      description: "This platform helps you make strategic decisions about AI investments and compliance with the EU AI Act.",
      image: "/assets/images/tour/platform-overview.png",
      alt: "Platform Overview",
      features: [
        "Comprehensive AI inventory management",
        "Risk assessment and categorization",
        "Compliance monitoring dashboard",
        "Strategic decision support tools"
      ]
    },
    {
      title: "Analyzing Your AI Portfolio",
      description: "Get a comprehensive view of your AI systems and their compliance status across your organization.",
      image: "/assets/images/tour/portfolio-analysis.png",
      alt: "Portfolio Analysis",
      features: [
        "Visual representation of AI systems by risk level",
        "Compliance gap analysis",
        "Department-level insights",
        "Trend analysis and forecasting"
      ]
    },
    {
      title: "Risk Assessment Tools",
      description: "Powerful tools to evaluate and mitigate risks in your AI implementations according to EU AI Act requirements.",
      image: "/assets/images/tour/risk-assessment.png",
      alt: "Risk Assessment Tools",
      features: [
        "Automated risk categorization",
        "Guided assessment workflows",
        "Evidence collection and documentation",
        "Mitigation strategy recommendations"
      ]
    },
    {
      title: "Compliance Roadmap",
      description: "Clear actionable steps to achieve and maintain compliance with the EU AI Act.",
      image: "/assets/images/tour/compliance-roadmap.png",
      alt: "Compliance Roadmap",
      features: [
        "Personalized compliance journey",
        "Timeline and milestone tracking",
        "Required documentation checklist",
        "Implementation guidance for each step"
      ]
    },
    {
      title: "Decision Support Analytics",
      description: "Advanced analytics to support your strategic decisions about AI investments and compliance priorities.",
      image: "/assets/images/tour/decision-analytics.png",
      alt: "Decision Analytics",
      features: [
        "Cost-benefit analysis for compliance measures",
        "Resource allocation optimization",
        "Impact assessment visualizations",
        "Executive reporting and insights"
      ]
    }
  ];

  const currentStep = tourSteps[step - 1];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Decision Platform Tour</h3>

        <div className="mb-8">
          <div className="space-y-5">
            <h4 className="text-lg font-medium text-primary">{currentStep.title}</h4>
            <p className="text-gray-600">
              {currentStep.description}
            </p>

            <div className="bg-gray-50 rounded-md p-4 border border-gray-100 overflow-hidden">
              <div className="relative h-64 w-full mb-4">
                {/* Fallback to placeholder if image doesn't exist */}
                <img 
                  src={currentStep.image} 
                  alt={currentStep.alt}
                  className="rounded-md object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/assets/images/tour/placeholder.png";
                  }}
                />
              </div>

              <div className="bg-white p-4 rounded-md border border-gray-100">
                <h5 className="font-medium text-sm text-gray-700 mb-2">Key Features:</h5>
                <ul className="space-y-1">
                  {currentStep.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-5 w-5 text-primary mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({length: totalSteps}).map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 w-2 rounded-full ${idx + 1 === step ? 'bg-primary' : 'bg-gray-300'}`}
                onClick={() => setStep(idx + 1)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>

          <Button 
            onClick={step === totalSteps ? () => window.location.href = '/dashboard' : nextStep}
            className="flex items-center gap-1"
          >
            {step === totalSteps ? 'Get Started' : 'Next'}
            {step !== totalSteps && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}