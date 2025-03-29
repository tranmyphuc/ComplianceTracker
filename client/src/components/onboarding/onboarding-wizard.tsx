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
  CheckCheck,
  Download
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
const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to the EU AI Act Compliance Platform",
    description: "Let's take a quick tour of the platform and learn how to become compliant with the EU AI Act regulations.",
    mascotMood: "happy" as const,
    mascotMessage: "Hi there! I'm your AI compliance guide. I'll help you navigate through the EU AI Act requirements!",
    icon: Shield
  },
  {
    id: "systems-inventory",
    title: "Register Your AI Systems",
    description: "Register your AI systems for comprehensive risk assessment and continuous compliance monitoring.",
    mascotMood: "explaining" as const,
    mascotMessage: "Start by registering your AI systems in the inventory. This is the foundation of your compliance journey.",
    icon: Database
  },
  {
    id: "risk-assessment",
    title: "Assess Your AI System Risks",
    description: "Our advanced risk assessment tool evaluates your AI systems against EU AI Act requirements and identifies compliance gaps.",
    mascotMood: "thinking" as const,
    mascotMessage: "Risk assessment helps you understand your compliance obligations based on your AI system's risk level.",
    icon: AlertTriangle
  },
  {
    id: "documentation",
    title: "Generate Required Documentation",
    description: "Generate essential documentation tailored to your AI systems' risk level and compliance requirements.",
    mascotMood: "explaining" as const,
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
                          {/* Organization Type - Changed to Dropdown */}
                          <div className="space-y-2">
                            <Label htmlFor="org-type">Your Organization Type</Label>
                            <Select
                              value={userProfile.organizationType || ""}
                              onValueChange={(value) => updateUserProfile('organizationType', value)}
                            >
                              <SelectTrigger id="org-type" className="w-full">
                                <SelectValue placeholder="Select organization type" />
                              </SelectTrigger>
                              <SelectContent>
                                {["Large Enterprise", "Mid-size Organization", "Small Business", "Startup", "Government/Public Sector", "Non-profit/NGO"].map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Industry Selection - Changed to Dropdown */}
                          <div className="space-y-2">
                            <Label htmlFor="industry">Your Industry</Label>
                            <Select
                              value={userProfile.industry || ""}
                              onValueChange={(value) => updateUserProfile('industry', value)}
                            >
                              <SelectTrigger id="industry" className="w-full">
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                              <SelectContent>
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
                                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Organization Size - Changed to Dropdown */}
                          <div className="space-y-2">
                            <Label htmlFor="org-size">Organization Size</Label>
                            <Select
                              value={userProfile.organizationSize || ""}
                              onValueChange={(value) => updateUserProfile('organizationSize', value)}
                            >
                              <SelectTrigger id="org-size" className="w-full">
                                <SelectValue placeholder="Select organization size" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Small (<50 employees)",
                                  "Medium (50-249 employees)",
                                  "Large (250-999 employees)",
                                  "Enterprise (1,000+ employees)"
                                ].map((size) => (
                                  <SelectItem key={size} value={size}>{size}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* AI System Types - Simplified grid of checkboxes */}
                          <div className="space-y-3">
                            <Label>AI System Types <span className="text-xs text-muted-foreground ml-1">(select all that apply)</span></Label>
                            <div className="grid grid-cols-3 gap-x-2 gap-y-1 border rounded-md p-2">
                              {[
                                "Computer Vision",
                                "NLP",
                                "Decision Support",
                                "Analytics",
                                "Autonomous Systems",
                                "Biometrics",
                                "Healthcare AI",
                                "Risk Scoring",
                                "Generative AI",
                                "Recommendation",
                                "Facial Recognition",
                                "Voice Analysis"
                              ].map((type) => (
                                <div key={type} className="flex items-center space-x-1">
                                  <Checkbox 
                                    id={`ai-type-${type}`}
                                    checked={userProfile.aiSystemTypes?.includes(type) || false}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        toggleArraySelection('aiSystemTypes', type);
                                      } else {
                                        toggleArraySelection('aiSystemTypes', type);
                                      }
                                    }}
                                  />
                                  <Label 
                                    htmlFor={`ai-type-${type}`}
                                    className="text-xs font-normal cursor-pointer"
                                  >
                                    {type}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Primary Compliance Goals - Simplified with fewer options */}
                          <div className="space-y-3">
                            <Label>Primary Goals <span className="text-xs text-muted-foreground ml-1">(select all that apply)</span></Label>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 border rounded-md p-2">
                              {[
                                "Proactive compliance",
                                "Risk assessment",
                                "Documentation",
                                "Staff training",
                                "Monitoring",
                                "Legal protection"
                              ].map((goal) => (
                                <div key={goal} className="flex items-center space-x-1">
                                  <Checkbox 
                                    id={`goal-${goal}`}
                                    checked={userProfile.complianceGoals?.includes(goal) || false}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        toggleArraySelection('complianceGoals', goal);
                                      } else {
                                        toggleArraySelection('complianceGoals', goal);
                                      }
                                    }}
                                  />
                                  <Label 
                                    htmlFor={`goal-${goal}`}
                                    className="text-xs font-normal cursor-pointer"
                                  >
                                    {goal}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* User Role - Changed to Dropdown */}
                          <div className="space-y-2">
                            <Label htmlFor="user-role">Your Role</Label>
                            <Select
                              value={userProfile.role || ""}
                              onValueChange={(value) => updateUserProfile('role', value)}
                            >
                              <SelectTrigger id="user-role" className="w-full">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Decision Maker",
                                  "Legal/Compliance",
                                  "Technical Team",
                                  "Project Manager",
                                  "Data Scientist",
                                  "Executive"
                                ].map((role) => (
                                  <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Industry-specific recommendations - Simplified */}
                        {userProfile.industry && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
                            <div className="bg-white rounded-full p-2 mr-3 text-blue-600">
                              <Lightbulb className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-blue-700 text-sm">
                                {userProfile.industry} Focus
                              </h4>
                              <p className="text-xs text-blue-600">
                                Your dashboard will be tailored for {userProfile.industry.toLowerCase()} compliance needs.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {currentStepData.id === "complete" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Your Personalized Compliance Journey:</h3>
                        
                        {/* Simplified profile card */}
                        <div className="bg-purple-50 rounded-lg border border-purple-200 overflow-hidden mb-4">
                          <div className="bg-purple-100 px-3 py-2 border-b border-purple-200">
                            <h4 className="font-medium text-purple-800 flex items-center text-sm">
                              <CheckCheck className="w-4 h-4 mr-1 text-purple-600" />
                              Your Personalized Profile
                            </h4>
                          </div>
                          
                          <div className="p-3 grid grid-cols-2 gap-x-2 gap-y-1">
                            {userProfile.industry && (
                              <div className="flex items-center gap-1 text-xs">
                                <span className="bg-purple-200 rounded-full p-1">
                                  <Settings className="h-3 w-3 text-purple-700" />
                                </span>
                                <span className="text-purple-800">{userProfile.industry}</span>
                              </div>
                            )}
                            
                            {userProfile.organizationType && (
                              <div className="flex items-center gap-1 text-xs">
                                <span className="bg-purple-200 rounded-full p-1">
                                  <Award className="h-3 w-3 text-purple-700" />
                                </span>
                                <span className="text-purple-800">{userProfile.organizationType}</span>
                              </div>
                            )}
                            
                            {userProfile.role && (
                              <div className="flex items-center gap-1 text-xs">
                                <span className="bg-purple-200 rounded-full p-1">
                                  <CheckCircle className="h-3 w-3 text-purple-700" />
                                </span>
                                <span className="text-purple-800">{userProfile.role}</span>
                              </div>
                            )}
                            
                            {/* Show 2 selected AI types as badges */}
                            {userProfile.aiSystemTypes && userProfile.aiSystemTypes.length > 0 && (
                              <div className="col-span-2 flex flex-wrap gap-1 mt-1">
                                {userProfile.aiSystemTypes.slice(0, 3).map(type => (
                                  <Badge key={type} variant="outline" className="text-xs py-0 bg-purple-100 text-purple-700 border-purple-200">
                                    {type}
                                  </Badge>
                                ))}
                                {userProfile.aiSystemTypes.length > 3 && (
                                  <Badge variant="outline" className="text-xs py-0 bg-purple-100 text-purple-700 border-purple-200">
                                    +{userProfile.aiSystemTypes.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Quick start guide - simplified */}
                        <div className="bg-blue-50 rounded-lg border border-blue-100 p-3 mb-4">
                          <h3 className="font-medium text-blue-800 text-sm mb-2 flex items-center">
                            <ClipboardList className="w-4 h-4 mr-1 text-blue-600" />
                            Quick Start Guide
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs justify-start bg-white hover:bg-blue-50 text-blue-700 border-blue-200 flex items-center"
                              onClick={() => handleNavigateTo("/register-system")}
                            >
                              <span className="bg-blue-100 rounded-full p-1 mr-1">
                                <Database className="h-3 w-3 text-blue-600" />
                              </span>
                              Register AI System
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs justify-start bg-white hover:bg-blue-50 text-blue-700 border-blue-200 flex items-center"
                              onClick={() => handleNavigateTo("/risk-assessment/guides")}
                            >
                              <span className="bg-blue-100 rounded-full p-1 mr-1">
                                <AlertTriangle className="h-3 w-3 text-blue-600" />
                              </span>
                              Risk Assessment
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs justify-start bg-white hover:bg-blue-50 text-blue-700 border-blue-200 flex items-center"
                              onClick={() => handleNavigateTo("/dashboard")}
                            >
                              <span className="bg-blue-100 rounded-full p-1 mr-1">
                                <BookOpen className="h-3 w-3 text-blue-600" />
                              </span>
                              Dashboard
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs justify-start bg-white hover:bg-blue-50 text-blue-700 border-blue-200 flex items-center"
                              onClick={() => handleNavigateTo("/guides/platform-introduction")}
                            >
                              <span className="bg-blue-100 rounded-full p-1 mr-1">
                                <FileText className="h-3 w-3 text-blue-600" />
                              </span>
                              Getting Started
                            </Button>
                          </div>
                        </div>
                        
                        {/* Recommended learning resources based on role - Simplified */}
                        {userProfile.role && (
                          <div className="bg-green-50 rounded-lg border border-green-100 overflow-hidden mb-4">
                            <div className="bg-green-100 px-3 py-2 border-b border-green-200 flex justify-between items-center">
                              <h4 className="font-medium text-green-800 flex items-center text-sm">
                                <BookOpen className="w-4 h-4 mr-1 text-green-700" />
                                Training Resources
                              </h4>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 text-xs text-green-700"
                                onClick={() => handleNavigateTo("/training")}
                              >
                                View All
                              </Button>
                            </div>
                            
                            <div className="p-2 grid grid-cols-2 gap-2">
                              {userProfile.role === "Decision Maker" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Strategic Planning
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Compliance ROI
                                  </Button>
                                </>
                              )}
                              
                              {userProfile.role === "Legal/Compliance" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Legal Requirements
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Article Guides
                                  </Button>
                                </>
                              )}
                              
                              {userProfile.role === "Technical Team" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Technical Docs
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Testing Methods
                                  </Button>
                                </>
                              )}
                              
                              {userProfile.role === "Data Scientist" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Bias & Fairness
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Explainability
                                  </Button>
                                </>
                              )}
                              
                              {userProfile.role === "Project Manager" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Project Planning
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Risk Management
                                  </Button>
                                </>
                              )}
                              
                              {userProfile.role === "Executive" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Executive Brief
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleNavigateTo("/training")} 
                                    className="text-xs justify-start bg-white border-green-200 text-green-700 hover:bg-green-50">
                                    Strategic Planning
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Personalized compliance brief with download option */}
                        <div className="mb-6 p-4 rounded-lg border border-orange-200 bg-orange-50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-orange-800 flex items-center text-sm">
                              <FileText className="w-4 h-4 mr-1 text-orange-700" />
                              Your Personalized Compliance Brief
                            </h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
                              onClick={() => handleNavigateTo("/dashboard")}
                            >
                              <Download className="h-3 w-3 mr-1" /> Download PDF
                            </Button>
                          </div>
                          
                          <div className="text-xs text-orange-800">
                            <p>Based on your profile, we've prepared a professional compliance brief for your organization. This report includes:</p>
                            <ul className="mt-2 space-y-1 list-disc list-inside">
                              <li>Personalized compliance roadmap for {userProfile.industry || "your industry"}</li>
                              <li>Key EU AI Act requirements for your specific use cases</li>
                              <li>Risk assessment checklist for {userProfile.aiSystemTypes?.[0] || "your AI systems"}</li>
                              <li>Timeline of implementation milestones</li>
                              <li>Expert recommendations for your compliance journey</li>
                            </ul>
                          </div>
                        </div>
                        
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