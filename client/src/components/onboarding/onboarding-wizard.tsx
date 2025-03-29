import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIJack } from "./ai-jack";
// Journey tracker import removed since we're using a simpler progress bar
import { RegulatoryEmojiReaction } from "./regulatory-emoji-reaction";
import { 
  CheckCircle, 
  ChevronRight, 
  ArrowRight, 
  ClipboardList, 
  AlertTriangle, 
  FileText, 
  BarChart, 
  Shield, 
  Database,
  Award, 
  Settings,
  BookOpen,
  Lightbulb,
  CheckCheck
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

// Define the onboarding steps
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "wouter";
import { useUser } from "@/contexts/user-context";
import { Shield, Database, AlertTriangle, FileText, Graduation, BarChart2, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingStep, useOnboarding } from "@/services/onboarding-service";

// Define onboarding steps with detailed information
const onboardingSteps = [
  {
    id: OnboardingStep.WELCOME,
    title: "Welcome to the EU AI Act Compliance Platform",
    description: "Let's take a quick tour of the platform and learn how to become compliant with the EU AI Act regulations.",
    mascotMood: "happy" as const,
    mascotMessage: "Hi there! I'm your AI compliance guide. I'll help you navigate through the EU AI Act requirements!",
    icon: Shield,
    path: "/onboarding",
    actionLabel: "Start Tour"
  },
  {
    id: OnboardingStep.SYSTEMS_INVENTORY,
    title: "Register Your AI Systems",
    description: "Register your AI systems for comprehensive risk assessment and continuous compliance monitoring.",
    mascotMood: "explaining" as const,
    mascotMessage: "Start by registering your AI systems in the inventory. This is the foundation of your compliance journey.",
    icon: Database,
    path: "/inventory",
    actionLabel: "View AI Inventory"
  },
  {
    id: OnboardingStep.RISK_ASSESSMENT,
    title: "Assess Your AI System Risks",
    description: "Our advanced risk assessment tool evaluates your AI systems against EU AI Act requirements and identifies compliance gaps.",
    mascotMood: "thinking" as const,
    mascotMessage: "Risk assessment helps you understand your compliance obligations based on your AI system's risk level.",
    icon: AlertTriangle,
    path: "/risk-assessment",
    actionLabel: "Explore Risk Assessment"
  },
  {
    id: OnboardingStep.DOCUMENTATION,
    title: "Generate Required Documentation",
    description: "Generate essential documentation tailored to your AI systems' risk level and compliance requirements.",
    mascotMood: "explaining" as const,
    mascotMessage: "Having proper documentation is critical for EU AI Act compliance. Let's learn how to generate it automatically.",
    icon: FileText,
    path: "/documentation",
    actionLabel: "View Documentation Tools"
  },
  {
    id: OnboardingStep.TRAINING,
    title: "Train Your Team",
    description: "Access role-specific training modules to ensure your team understands EU AI Act compliance requirements.",
    mascotMood: "teaching" as const,
    mascotMessage: "Training is essential for long-term compliance success. We have modules for all roles in your organization.",
    icon: Graduation,
    path: "/training",
    actionLabel: "Explore Training Modules"
  },
  {
    id: OnboardingStep.COMPLIANCE_MONITORING,
    title: "Monitor Compliance",
    description: "Track your compliance progress and stay up to date with changes to the EU AI Act.",
    mascotMood: "focused" as const,
    mascotMessage: "Compliance is an ongoing process. Our monitoring tools help you stay on top of requirements.",
    icon: BarChart2,
    path: "/compliance",
    actionLabel: "Set Up Monitoring"
  }
];

export function OnboardingWizard() {
  const { user } = useUser();
  const [location, navigate] = useLocation();
  const { onboardingState, completeStep, skipOnboarding } = useOnboarding(user?.uid);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Find the current step index based on the onboarding state
  useEffect(() => {
    const index = onboardingSteps.findIndex(step => step.id === onboardingState.currentStep);
    if (index !== -1) {
      setCurrentStepIndex(index);
    }
  }, [onboardingState.currentStep]);
  
  // Get the current step data
  const currentStep = onboardingSteps[currentStepIndex];
  
  // Handle next step action
  const handleNextStep = () => {
    completeStep(currentStep.id as OnboardingStep);
    
    // Navigate to the path for the next step
    const nextStepIndex = (currentStepIndex + 1) % onboardingSteps.length;
    const nextStep = onboardingSteps[nextStepIndex];
    navigate(nextStep.path);
  };
  
  // Handle skip onboarding
  const handleSkipOnboarding = () => {
    skipOnboarding();
    navigate("/");
  };
  
  // If onboarding is not active, don't render the wizard
  if (!onboardingState.isActive) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleSkipOnboarding}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {currentStep.icon && <currentStep.icon className="h-6 w-6 text-primary" />}
            <CardTitle>{currentStep.title}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="mb-6">
            <p className="text-muted-foreground">{currentStep.description}</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg mb-4 flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-1">AI Compliance Assistant</p>
              <p className="text-sm text-muted-foreground">{currentStep.mascotMessage}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              {onboardingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-2 w-10 rounded-full ${
                    index === currentStepIndex
                      ? "bg-primary"
                      : index < currentStepIndex
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {onboardingSteps.length}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSkipOnboarding}>
            Skip Tour
          </Button>
          <Button onClick={handleNextStep} className="gap-2">
            {currentStep.actionLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
    mascotMessage: "Proper documentation is crucial for EU AI Act compliance. I'll help you generate all required documents.",
    icon: FileText
  },
  {
    id: "monitoring",
    title: "Monitor Compliance Status",
    description: "Track your compliance status, receive alerts about regulatory updates, and visualize your progress.",
    mascotMood: "explaining" as const,
    mascotMessage: "Staying compliant requires continuous monitoring. Our dashboard shows your compliance status at a glance.",
    icon: BarChart
  },
  {
    id: "training",
    title: "Training and Knowledge Center",
    description: "Access interactive training modules and a comprehensive knowledge base on EU AI Act requirements.",
    mascotMood: "happy" as const,
    mascotMessage: "Continuous learning is key! Explore our training modules to deepen your understanding of the EU AI Act.",
    icon: BookOpen
  },
  {
    id: "personalization",
    title: "Personalize Your Experience",
    description: "Customize your compliance journey based on your organization's specific needs and goals.",
    mascotMood: "explaining" as const,
    mascotMessage: "Let's tailor your experience to your specific needs. This will help us provide more relevant guidance and recommendations.",
    icon: Settings
  },
  {
    id: "complete",
    title: "You're Ready to Start!",
    description: "Congratulations! You're now ready to begin your EU AI Act compliance journey.",
    mascotMood: "celebrating" as const,
    mascotMessage: "Excellent! You're all set to start your compliance journey. Remember, I'm here to help you every step of the way!",
    icon: Award
  }
];

// Define user profile type for onboarding
export interface UserOnboardingProfile {
  organizationType?: string;
  industry?: string;
  organizationSize?: string;
  aiSystemTypes?: string[];
  complianceGoals?: string[];
  preferredLanguage?: 'en' | 'de';
  role?: string;
}

interface OnboardingWizardProps {
  onComplete?: (profile?: UserOnboardingProfile) => void;
  initialStep?: number;
}

export function OnboardingWizard({ onComplete, initialStep = 0 }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [, setLocation] = useLocation();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<UserOnboardingProfile>({
    aiSystemTypes: [],
    complianceGoals: [],
    preferredLanguage: 'en'
  });
  
  // Get the current step data
  const currentStepData = onboardingSteps[currentStep];

  // Check local storage for onboarding status on component mount
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (onboardingCompleted === "true") {
      setIsOnboardingComplete(true);
    }
    
    // Try to load saved profile data
    const savedProfile = localStorage.getItem("userOnboardingProfile");
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Error parsing saved profile:", e);
      }
    }
  }, []);

  // Navigate to next step
  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user profile data
      localStorage.setItem("userOnboardingProfile", JSON.stringify(userProfile));
      
      // Mark onboarding as complete
      localStorage.setItem("onboardingCompleted", "true");
      setIsOnboardingComplete(true);
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(userProfile);
      }
    }
  };

  // Navigate to previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle skip onboarding
  const handleSkipOnboarding = () => {
    // Still save any partial data collected
    localStorage.setItem("userOnboardingProfile", JSON.stringify(userProfile));
    localStorage.setItem("onboardingCompleted", "true");
    setIsOnboardingComplete(true);
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(userProfile);
    }
  };

  // Update user profile data
  const updateUserProfile = (key: keyof UserOnboardingProfile, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle selection in arrays (for multi-select options)
  const toggleArraySelection = (key: 'aiSystemTypes' | 'complianceGoals', value: string) => {
    setUserProfile(prev => {
      const currentArray = prev[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [key]: newArray
      };
    });
  };

  // Navigate to specific pages based on step
  const handleNavigateTo = (path: string) => {
    setLocation(path);
  };

  // When onboarding is complete, return null
  if (isOnboardingComplete) {
    return null;
  }

  // Animations for the cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        className="w-full max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
            className="bg-purple-600 h-2"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (onboardingSteps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-6 px-2">
          {onboardingSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`flex flex-col items-center`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                  index <= currentStep ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
                whileHover={{ scale: 1.1 }}
                onClick={() => setCurrentStep(index)}
              >
                {index < currentStep ? (
                  <CheckCircle size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <span className={`text-xs mt-1 ${
                index <= currentStep ? "text-purple-600 font-medium" : "text-gray-500"
              }`}>
                {step.id === "welcome" ? "Start" : 
                 step.id === "complete" ? "Done" : 
                 `Step ${index}`}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="w-full bg-white shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    {currentStepData.icon && <currentStepData.icon className="w-8 h-8 text-purple-600" />}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{currentStepData.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {currentStepData.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Simple progress indicator */}
                {currentStep > 0 && (
                  <div className="mb-6">
                    <div className="text-sm text-muted-foreground text-center mb-2">
                      Step {currentStep + 1} of {onboardingSteps.length}
                    </div>
                    <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between py-4">
                  <div className="w-full md:w-1/2">
                    {/* Content varies based on current step */}
                    {currentStepData.id === "welcome" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Key Features:</h3>
                        <ul className="space-y-2">
                          {[
                            "AI System Registration and Risk Assessment",
                            "Automated Document Generation",
                            "Continuous Compliance Monitoring",
                            "Regulatory Updates and Alerts",
                            "Training and Knowledge Resources"
                          ].map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {currentStepData.id === "systems-inventory" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">System Registration Process:</h3>
                        <ol className="space-y-3 list-decimal list-inside">
                          <li>Enter your AI system details and purpose</li>
                          <li>Provide information about your system's capabilities</li>
                          <li>Specify data sources and processing methods</li>
                          <li>Submit for automatic risk categorization</li>
                        </ol>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => handleNavigateTo("/inventory")}
                          >
                            Go to Inventory <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {currentStepData.id === "risk-assessment" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Risk Assessment Components:</h3>
                        <ul className="space-y-2">
                          {[
                            "EU AI Act risk categorization (High, Limited, Minimal)",
                            "Prohibited use detection",
                            "Compliance gap analysis with recommendations",
                            "Required documentation checklist",
                            "Relevant EU AI Act articles mapping"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ClipboardList className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => handleNavigateTo("/risk-assessment")}
                          >
                            Explore Risk Assessment <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {currentStepData.id === "documentation" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Document Types:</h3>
                        <ul className="space-y-2">
                          {[
                            "Technical Documentation (All Systems)",
                            "Data Governance Policies (All Systems)",
                            "Risk Assessment Reports (High-Risk)",
                            "Conformity Declarations (High-Risk)",
                            "Human Oversight Protocols (High-Risk)",
                            "Incident Response Plans (High & Limited Risk)"
                          ].map((doc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <FileText className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => handleNavigateTo("/documentation")}
                          >
                            View Documentation <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {currentStepData.id === "monitoring" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Dashboard Features:</h3>
                        <ul className="space-y-2">
                          {[
                            "Overall compliance status visualization",
                            "System-level compliance scores",
                            "Critical alerts and notifications",
                            "Upcoming compliance deadlines",
                            "Regulatory updates and impact analysis"
                          ].map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <BarChart className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => handleNavigateTo("/dashboard")}
                          >
                            View Dashboard <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {currentStepData.id === "training" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Learning Resources:</h3>
                        <ul className="space-y-2">
                          {[
                            "Interactive training modules with progress tracking",
                            "Role-specific content for different stakeholders",
                            "EU AI Act full text with annotations",
                            "Knowledge base with searchable articles",
                            "Compliance best practices and case studies"
                          ].map((resource, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <BookOpen className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex gap-3">
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => handleNavigateTo("/training")}
                          >
                            Explore Training <ArrowRight size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => handleNavigateTo("/knowledge-center")}
                          >
                            Visit Knowledge Center <ArrowRight size={16} />
                          </Button>
                        </div>
                        
                        {/* Regulatory Emoji Reaction */}
                        <div className="mt-6">
                          <RegulatoryEmojiReaction 
                            articleTitle="Article 5: Prohibited AI Practices"
                            articleText="AI systems that deploy subliminal techniques beyond a person's consciousness or exploit vulnerabilities due to age or disability in order to materially distort behavior are prohibited under the EU AI Act."
                            onReactionSubmit={(reaction, comment) => {
                              console.log("Reaction:", reaction, "Comment:", comment);
                              // In a real implementation, this would be sent to the server
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {currentStepData.id === "personalization" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Customize Your Experience:</h3>
                        
                        <div className="space-y-6 mt-4">
                          {/* Organization Type */}
                          <div className="space-y-2">
                            <div className="font-medium mb-1">Your Organization Type</div>
                            <div className="grid grid-cols-2 gap-2">
                              {["Large Enterprise", "Mid-size Organization", "Small Business", "Startup", "Government/Public Sector", "Non-profit/NGO"].map((type) => (
                                <Button 
                                  key={type} 
                                  variant="outline" 
                                  className={`justify-start ${userProfile.organizationType === type ? 'bg-primary/20 border-primary' : ''}`}
                                  onClick={() => updateUserProfile('organizationType', type)}
                                >
                                  {type}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Industry Selection - appears after org type is selected */}
                          {userProfile.organizationType && (
                            <div className="space-y-2">
                              <div className="font-medium mb-1">Your Industry</div>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  "Healthcare", 
                                  "Financial Services",
                                  "Manufacturing",
                                  "Public Sector",
                                  "Retail & E-commerce",
                                  "Logistics & Transportation",
                                  "Energy & Utilities",
                                  "Professional Services",
                                  "Insurance",
                                  "Telecommunications",
                                  "Education",
                                  "Software & Technology"
                                ].map((industry) => (
                                  <Button 
                                    key={industry} 
                                    variant="outline" 
                                    className={`justify-start ${userProfile.industry === industry ? 'bg-primary/20 border-primary' : ''}`}
                                    onClick={() => updateUserProfile('industry', industry)}
                                  >
                                    {industry}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Organization Size - appears after industry is selected */}
                          {userProfile.industry && (
                            <div className="space-y-2">
                              <div className="font-medium mb-1">Organization Size</div>
                              <div className="grid grid-cols-1 gap-2">
                                {[
                                  "Small (<50 employees)",
                                  "Medium (50-249 employees)",
                                  "Large (250-999 employees)",
                                  "Enterprise (1,000+ employees)"
                                ].map((size) => (
                                  <Button 
                                    key={size} 
                                    variant="outline" 
                                    className={`justify-start ${userProfile.organizationSize === size ? 'bg-primary/20 border-primary' : ''}`}
                                    onClick={() => updateUserProfile('organizationSize', size)}
                                  >
                                    {size}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* AI System Types */}
                          <div className="space-y-2">
                            <div className="font-medium mb-1">AI System Types of Interest <span className="text-xs text-muted-foreground">(select multiple)</span></div>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                "Computer Vision",
                                "Natural Language Processing",
                                "Decision Support Systems",
                                "Predictive Analytics",
                                "Autonomous Systems",
                                "Biometric Identification",
                                "Healthcare Diagnostics",
                                "Risk Scoring",
                                "Generative AI",
                                "Recommendation Systems",
                                "Facial Recognition",
                                "Emotion Analysis"
                              ].map((type) => (
                                <Button 
                                  key={type} 
                                  variant="outline" 
                                  className={`justify-start ${userProfile.aiSystemTypes?.includes(type) ? 'bg-primary/20 border-primary' : ''}`}
                                  onClick={() => toggleArraySelection('aiSystemTypes', type)}
                                >
                                  {type}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Primary Compliance Goals */}
                          <div className="space-y-2">
                            <div className="font-medium mb-1">Primary Compliance Goals <span className="text-xs text-muted-foreground">(select multiple)</span></div>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                "Proactive compliance before enforcement",
                                "Risk assessment and mitigation",
                                "Documentation and record-keeping",
                                "Staff training and awareness",
                                "Continuous monitoring and updating",
                                "Legal liability reduction",
                                "Conformity assessment preparation",
                                "Integration with existing governance"
                              ].map((goal) => (
                                <Button 
                                  key={goal} 
                                  variant="outline" 
                                  className={`justify-start ${userProfile.complianceGoals?.includes(goal) ? 'bg-primary/20 border-primary' : ''}`}
                                  onClick={() => toggleArraySelection('complianceGoals', goal)}
                                >
                                  {goal}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          {/* User Role */}
                          <div className="space-y-2">
                            <div className="font-medium mb-1">Your Role</div>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                "Decision Maker",
                                "Legal/Compliance",
                                "Technical Team",
                                "Project Manager",
                                "Data Scientist",
                                "Executive"
                              ].map((role) => (
                                <Button 
                                  key={role} 
                                  variant="outline" 
                                  className={`justify-start ${userProfile.role === role ? 'bg-primary/20 border-primary' : ''}`}
                                  onClick={() => updateUserProfile('role', role)}
                                >
                                  {role}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Industry-specific recommendations */}
                        {userProfile.industry && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-700 mb-2">
                              <span className="mr-2">✨</span>
                              Recommended for {userProfile.industry}
                            </h4>
                            <p className="text-sm text-blue-600 mb-3">
                              {userProfile.industry === "Healthcare" && "We'll focus on patient safety, data privacy, and diagnostic system compliance for healthcare organizations."}
                              {userProfile.industry === "Financial Services" && "We'll emphasize fraud detection, credit scoring, and financial risk assessment compliance requirements."}
                              {userProfile.industry === "Manufacturing" && "We'll highlight quality control, predictive maintenance, and production optimization compliance needs."}
                              {userProfile.industry === "Public Sector" && "We'll address citizen service eligibility, resource allocation, and transparent algorithmic decision-making requirements."}
                              {userProfile.industry === "Retail & E-commerce" && "We'll focus on recommendation systems, customer analytics, and pricing algorithm transparency requirements."}
                              {userProfile.industry === "Professional Services" && "We'll emphasize client management, document analysis, and business process optimization compliance needs."}
                              {userProfile.industry === "Insurance" && "We'll address risk scoring, claims processing, and customer profiling compliance requirements."}
                              {userProfile.industry === "Energy & Utilities" && "We'll focus on grid management, consumption prediction, and infrastructure maintenance compliance."}
                              {userProfile.industry === "Logistics & Transportation" && "We'll highlight route optimization, supply chain management, and autonomous systems safety requirements."}
                              {!["Healthcare", "Financial Services", "Manufacturing", "Public Sector", "Retail & E-commerce", "Professional Services", "Insurance", "Energy & Utilities", "Logistics & Transportation"].includes(userProfile.industry || "") && "We'll tailor compliance requirements to your specific industry needs and use cases."}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {currentStepData.id === "complete" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Your Personalized Compliance Journey:</h3>
                        
                        {/* Show personalized details based on collected data */}
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-6">
                          <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                            <CheckCheck className="w-5 h-5 mr-2 text-purple-600" />
                            Your Profile
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {userProfile.organizationType && (
                              <div>
                                <span className="text-purple-700 font-medium">Organization:</span> {userProfile.organizationType}
                              </div>
                            )}
                            {userProfile.industry && (
                              <div>
                                <span className="text-purple-700 font-medium">Industry:</span> {userProfile.industry}
                              </div>
                            )}
                            {userProfile.organizationSize && (
                              <div>
                                <span className="text-purple-700 font-medium">Size:</span> {userProfile.organizationSize}
                              </div>
                            )}
                            {userProfile.role && (
                              <div>
                                <span className="text-purple-700 font-medium">Role:</span> {userProfile.role}
                              </div>
                            )}
                          </div>
                          
                          {userProfile.aiSystemTypes && userProfile.aiSystemTypes.length > 0 && (
                            <div className="mt-3">
                              <span className="text-purple-700 font-medium text-sm">AI Systems:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {userProfile.aiSystemTypes.map(type => (
                                  <Badge key={type} variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {userProfile.complianceGoals && userProfile.complianceGoals.length > 0 && (
                            <div className="mt-3">
                              <span className="text-purple-700 font-medium text-sm">Compliance Goals:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {userProfile.complianceGoals.map(goal => (
                                  <Badge key={goal} variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                                    {goal}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg">Your Next Steps:</h3>
                        
                        {/* Industry-specific next steps */}
                        {userProfile.industry ? (
                          <div>
                            <ol className="space-y-3 list-decimal list-inside mb-4">
                              {/* Default steps for all industries */}
                              <li className="font-medium">Register your first AI system in the inventory</li>
                              
                              {/* Industry-specific steps */}
                              {userProfile.industry === "Healthcare" && (
                                <>
                                  <li>Complete a risk assessment for your diagnostic systems</li>
                                  <li>Generate conformity declarations for high-risk medical AI</li>
                                  <li>Review patient data governance requirements</li>
                                  <li>Establish human oversight protocols for clinical decision support</li>
                                </>
                              )}
                              
                              {userProfile.industry === "Financial Services" && (
                                <>
                                  <li>Complete a risk assessment for your credit scoring systems</li>
                                  <li>Develop explainability documentation for decision systems</li>
                                  <li>Review algorithmic fairness requirements</li>
                                  <li>Establish continuous monitoring for fraud detection systems</li>
                                </>
                              )}
                              
                              {userProfile.industry === "Manufacturing" && (
                                <>
                                  <li>Complete risk assessments for production optimization systems</li>
                                  <li>Develop technical documentation for predictive maintenance</li>
                                  <li>Review safety requirements for automated systems</li>
                                  <li>Establish quality control verification procedures</li>
                                </>
                              )}
                              
                              {userProfile.industry === "Public Sector" && (
                                <>
                                  <li>Complete risk assessments for citizen service systems</li>
                                  <li>Implement transparency documentation for eligibility decisions</li>
                                  <li>Develop human oversight protocols for resource allocation</li>
                                  <li>Establish audit procedures for algorithmic decisions</li>
                                </>
                              )}
                              
                              {userProfile.industry === "Professional Services" && (
                                <>
                                  <li>Complete risk assessments for client management systems</li>
                                  <li>Implement data governance for document analysis</li>
                                  <li>Review compliance requirements for generative AI tools</li>
                                  <li>Establish best practices for secure AI integration</li>
                                </>
                              )}
                              
                              {/* Default ending steps for all industries */}
                              <li>Explore the knowledge center for {userProfile.industry} compliance guides</li>
                            </ol>
                          </div>
                        ) : (
                          <ol className="space-y-3 list-decimal list-inside">
                            <li>Register your first AI system in the inventory</li>
                            <li>Complete a risk assessment for your system</li>
                            <li>Generate required documentation based on risk level</li>
                            <li>Set up continuous monitoring and compliance checks</li>
                            <li>Explore the knowledge center to deepen your understanding</li>
                          </ol>
                        )}
                        
                        {/* Recommended learning resources based on role */}
                        {userProfile.role && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                              Recommended for {userProfile.role}s
                            </h4>
                            <ul className="space-y-2 text-sm list-disc list-inside text-blue-800">
                              {userProfile.role === "Decision Maker" && (
                                <>
                                  <li>Strategic Planning for EU AI Act Compliance</li>
                                  <li>Cost-Benefit Analysis of Compliance Investments</li>
                                  <li>Governance Framework Implementation</li>
                                </>
                              )}
                              
                              {userProfile.role === "Legal/Compliance" && (
                                <>
                                  <li>Legal Requirements Analysis for AI Systems</li>
                                  <li>Detailed Article Interpretation Guides</li>
                                  <li>Conformity Assessment Procedures</li>
                                </>
                              )}
                              
                              {userProfile.role === "Technical Team" && (
                                <>
                                  <li>Technical Documentation Requirements</li>
                                  <li>Implementation of Testing and Validation</li>
                                  <li>Monitoring and Post-Market Surveillance</li>
                                </>
                              )}
                              
                              {userProfile.role === "Data Scientist" && (
                                <>
                                  <li>Bias and Fairness Evaluation Methods</li>
                                  <li>Data Quality and Documentation Requirements</li>
                                  <li>Model Explainability Techniques</li>
                                </>
                              )}
                              
                              {userProfile.role === "Project Manager" && (
                                <>
                                  <li>AI Compliance Project Planning</li>
                                  <li>Risk Management Methodologies</li>
                                  <li>Stakeholder Communication Guidelines</li>
                                </>
                              )}
                              
                              {userProfile.role === "Executive" && (
                                <>
                                  <li>Executive Briefing on EU AI Act Responsibilities</li>
                                  <li>Strategic Compliance Planning and Budgeting</li>
                                  <li>Market Implications of the EU AI Act</li>
                                </>
                              )}
                            </ul>
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-2 text-blue-700 border-blue-300"
                                onClick={() => handleNavigateTo("/training")}
                              >
                                Browse Training Resources <BookOpen size={14} />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-6 flex justify-center">
                          <Button 
                            onClick={() => handleNavigateTo("/dashboard")}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                          >
                            <span className="text-lg">Start Your Compliance Journey</span>
                            <ArrowRight size={20} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Jack character - always visible */}
                  <div className="flex justify-center">
                    <AIJack 
                      mood={currentStepData.mascotMood}
                      message={currentStepData.mascotMessage}
                      size="lg"
                      animate={true}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                {currentStep === 0 ? (
                  <Button variant="ghost" onClick={handleSkipOnboarding}>
                    Skip Tour
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Back
                  </Button>
                )}
                
                <Button 
                  onClick={handleNextStep}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {currentStep === onboardingSteps.length - 1 ? (
                    "Complete Tour"
                  ) : (
                    <div className="flex items-center gap-1">
                      Next <ChevronRight size={16} />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}