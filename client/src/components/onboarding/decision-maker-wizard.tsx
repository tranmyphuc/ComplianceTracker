import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AIJack } from "./ai-jack";
import { AnimatedJourneyTracker } from "./animated-journey-tracker";
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
  TrendingUp,
  PieChart,
  Target,
  Sparkles,
  Brain,
  BarChart3,
  Network,
  Briefcase,
  Zap
} from "lucide-react";

interface DecisionMakerWizardProps {
  onComplete: () => void;
}

export function DecisionMakerWizard({ onComplete }: DecisionMakerWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWizard, setShowWizard] = useState(true);
  
  // Define all the steps with their content and AI Jack states
  const wizardSteps = [
    {
      id: "welcome",
      title: "Welcome to the Enterprise AI Decision Platform",
      description: "Discover how our advanced AI-powered platform can transform your strategic decision-making processes",
      mascotMood: "happy" as const,
      mascotMessage: "Hi there! I'm AI Jack, your guide to making smarter, data-driven decisions with cutting-edge AI!",
      icon: Brain
    },
    {
      id: "insights",
      title: "AI-Powered Market Insights",
      description: "Access real-time market intelligence and predictive analytics to stay ahead of industry trends",
      mascotMood: "explaining" as const,
      mascotMessage: "Our AI analyzes vast amounts of market data to identify patterns that humans might miss, giving you a competitive edge.",
      icon: TrendingUp
    },
    {
      id: "strategic-planning",
      title: "Strategic Planning Tools",
      description: "Leverage AI-driven scenario planning and resource optimization algorithms for better strategic decisions",
      mascotMood: "thinking" as const,
      mascotMessage: "Strategic planning becomes easier with our AI models that can simulate thousands of business scenarios in seconds.",
      icon: Target
    },
    {
      id: "risk-intelligence",
      title: "Risk Intelligence Dashboard",
      description: "Identify, quantify and mitigate business risks with predictive analytics and early warning systems",
      mascotMood: "explaining" as const,
      mascotMessage: "Our risk intelligence system detects potential threats before they materialize, allowing proactive management.",
      icon: AlertTriangle
    },
    {
      id: "executive-dashboard",
      title: "Executive Decision Dashboard",
      description: "Access a customizable dashboard with key performance indicators and decision-critical metrics",
      mascotMood: "explaining" as const,
      mascotMessage: "Your personalized executive dashboard highlights the most important information for your decision-making needs.",
      icon: BarChart3
    },
    {
      id: "opportunity-detection",
      title: "AI Opportunity Detection",
      description: "Automatically identify new business opportunities and growth areas using advanced pattern recognition",
      mascotMood: "happy" as const,
      mascotMessage: "Our AI can spot emerging opportunities that align with your business strategy and resource capabilities.",
      icon: Lightbulb
    },
    {
      id: "generative-insights",
      title: "Generative AI Insights",
      description: "Generate creative solutions to complex business challenges with our advanced generative AI models",
      mascotMood: "thinking" as const,
      mascotMessage: "Tackle your toughest business problems with AI that can suggest innovative approaches you might not have considered.",
      icon: Sparkles
    },
    {
      id: "integration",
      title: "Seamless Data Integration",
      description: "Connect all your business systems and data sources for a unified view of your enterprise",
      mascotMood: "explaining" as const,
      mascotMessage: "No more siloed data! Our platform integrates information from across your organization for holistic insights.",
      icon: Network
    },
    {
      id: "complete",
      title: "Ready to Transform Your Decision-Making",
      description: "You're now equipped to harness the power of AI for smarter, faster, and more effective business decisions",
      mascotMood: "celebrating" as const,
      mascotMessage: "Congratulations! You're all set to revolutionize your strategic decision-making process with AI. Let's get started!",
      icon: Award
    }
  ];

  // Handle next step action
  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step, complete the onboarding
      handleComplete();
    }
  };

  // Handle completion
  const handleComplete = () => {
    // Animate out
    setShowWizard(false);
    
    // Call the completion callback after animation
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <AnimatePresence>
      {showWizard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-auto"
          >
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-2">
                      {wizardSteps[currentStep].icon && 
                        React.createElement(wizardSteps[currentStep].icon, { className: "h-5 w-5 text-primary" })
                      }
                    </span>
                    <CardTitle>{wizardSteps[currentStep].title}</CardTitle>
                  </div>
                  
                  <span className="text-sm text-neutral-500">
                    Step {currentStep + 1} of {wizardSteps.length}
                  </span>
                </div>
                <CardDescription>{wizardSteps[currentStep].description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-2">
                <AnimatedJourneyTracker
                  totalSteps={wizardSteps.length}
                  currentStep={currentStep}
                  stepLabels={wizardSteps.map(step => step.id)}
                  className="mb-6"
                />
                
                <div className="relative">
                  {/* Main content pane for each step */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`step-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column - AI Jack */}
                        <div className="flex flex-col items-center">
                          <div className="mb-4 relative">
                            <AIJack
                              mood={wizardSteps[currentStep].mascotMood}
                              size="lg"
                              animate={true}
                            />
                            
                            {/* Regulatory Emoji Reaction */}
                            <div className="absolute -top-2 -right-2">
                              <RegulatoryEmojiReaction 
                                sentiment={
                                  wizardSteps[currentStep].mascotMood === "celebrating" ? "excellent" :
                                  wizardSteps[currentStep].mascotMood === "happy" ? "good" :
                                  wizardSteps[currentStep].mascotMood === "thinking" ? "neutral" :
                                  "good"
                                } 
                              />
                            </div>
                          </div>
                          
                          {/* AI Jack's speech bubble */}
                          <div className="relative bg-primary/10 text-primary-foreground p-4 rounded-lg w-full text-center text-sm border border-primary/20 relative before:content-[''] before:absolute before:top-[-8px] before:left-1/2 before:w-4 before:h-4 before:bg-primary/10 before:rotate-45 before:border-l before:border-t before:border-primary/20 before:transform before:-translate-x-1/2">
                            {wizardSteps[currentStep].mascotMessage}
                          </div>
                        </div>
                        
                        {/* Right Column - Step specific content */}
                        <div className="md:col-span-2 space-y-4">
                          {currentStep === 0 && (
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
                          
                          {currentStep === 1 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Real-time Market Intelligence</h3>
                              <p>Stay ahead of market trends with AI that continuously analyzes vast amounts of data from multiple sources.</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="border rounded-lg p-3 bg-blue-50/50">
                                  <div className="flex items-center mb-2">
                                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                                    <span className="font-medium text-blue-700">Trend Analysis</span>
                                  </div>
                                  <p className="text-sm text-blue-800">Identify emerging market trends before your competitors</p>
                                </div>
                                <div className="border rounded-lg p-3 bg-purple-50/50">
                                  <div className="flex items-center mb-2">
                                    <PieChart className="h-4 w-4 text-purple-600 mr-2" />
                                    <span className="font-medium text-purple-700">Competitor Intelligence</span>
                                  </div>
                                  <p className="text-sm text-purple-800">Monitor competitor activities and strategic moves</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 2 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">AI-Enhanced Strategic Planning</h3>
                              <p>Transform your strategic planning with AI tools that optimize resource allocation and simulate business scenarios.</p>
                              <div className="relative h-32 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-4 overflow-hidden">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDEwMHYxMDBIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAwaDEwMHYxMDBIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNOTAgOTBIMTBWMTBoODB2ODBaIiBzdHJva2U9IiNFRUUiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMzAgOTBWNTVoMTV2MTV2MjBNNTAgNTBoMTV2NDBNNZAIIDE1djc1IiBzdHJva2U9IiM2MkIwRkYiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNCIvPjxwYXRoIGQ9Ik0xMCA1NWgyME00NSA1MGgyME02NSAxNWgyNSIgc3Ryb2tlPSIjNjJCMEZGIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] opacity-10"></div>
                                <div className="relative z-10">
                                  <h4 className="font-medium text-blue-800 mb-1">Strategic Forecasting</h4>
                                  <p className="text-sm text-blue-700">Our AI models can simulate thousands of business scenarios to help you identify the optimal strategy for your objectives.</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 3 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Proactive Risk Management</h3>
                              <p>Identify and mitigate business risks before they impact your operations with our AI risk intelligence system.</p>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="border rounded-lg p-3 bg-red-50/50 flex flex-col items-center">
                                  <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                                  <span className="text-sm text-center text-red-700">Risk Detection</span>
                                </div>
                                <div className="border rounded-lg p-3 bg-yellow-50/50 flex flex-col items-center">
                                  <BarChart className="h-8 w-8 text-yellow-500 mb-2" />
                                  <span className="text-sm text-center text-yellow-700">Impact Analysis</span>
                                </div>
                                <div className="border rounded-lg p-3 bg-green-50/50 flex flex-col items-center">
                                  <Shield className="h-8 w-8 text-green-500 mb-2" />
                                  <span className="text-sm text-center text-green-700">Mitigation Plans</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 4 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Executive Dashboard</h3>
                              <p>Your personalized command center with all the critical information you need for effective decision-making.</p>
                              <div className="border rounded-lg p-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  <div className="h-10 rounded bg-white/80 flex items-center justify-center text-sm text-blue-700 font-medium">Financial KPIs</div>
                                  <div className="h-10 rounded bg-white/80 flex items-center justify-center text-sm text-blue-700 font-medium">Operational Metrics</div>
                                  <div className="h-10 rounded bg-white/80 flex items-center justify-center text-sm text-blue-700 font-medium">Market Signals</div>
                                  <div className="h-10 rounded bg-white/80 flex items-center justify-center text-sm text-blue-700 font-medium">Strategic Indicators</div>
                                </div>
                                <div className="text-center text-xs text-blue-600">
                                  Fully customizable to display the information most relevant to your role
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 5 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Opportunity Discovery</h3>
                              <p>Let AI help you discover new business opportunities that align with your strategic goals.</p>
                              <div className="relative border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                                <div className="flex items-start space-x-3">
                                  <Lightbulb className="h-10 w-10 text-yellow-400 flex-shrink-0" />
                                  <div>
                                    <h4 className="font-medium text-purple-800">AI-Detected Opportunity Example</h4>
                                    <p className="text-sm text-purple-700 mt-1">
                                      "Based on emerging market patterns and your company's capabilities, there's a 78% probability of success in expanding your premium service offerings to the healthcare sector."
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 6 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Generative AI Solutions</h3>
                              <p>Leverage the creative power of generative AI to develop innovative approaches to business challenges.</p>
                              <div className="border rounded-lg p-4 bg-gradient-to-r from-pink-50 to-purple-50">
                                <div className="flex flex-col space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                    <span className="font-medium text-purple-800">Content Generation</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Zap className="h-5 w-5 text-purple-500" />
                                    <span className="font-medium text-purple-800">Problem-Solving Assistance</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Brain className="h-5 w-5 text-purple-500" />
                                    <span className="font-medium text-purple-800">Creative Strategy Development</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 7 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Seamless Integration Platform</h3>
                              <p>Connect all your business systems for a unified view of your organization and more informed decisions.</p>
                              <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                                <div className="flex justify-center">
                                  <div className="relative w-48 h-48">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-16 h-16 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                                        <Database className="h-8 w-8" />
                                      </div>
                                    </div>
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                      <div className="w-12 h-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700">
                                        <Briefcase className="h-6 w-6" />
                                      </div>
                                    </div>
                                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                                      <div className="w-12 h-12 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                                        <BarChart3 className="h-6 w-6" />
                                      </div>
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                      <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                                        <TrendingUp className="h-6 w-6" />
                                      </div>
                                    </div>
                                    <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                                      <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-700">
                                        <Network className="h-6 w-6" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 8 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Ready to Transform Your Decision-Making</h3>
                              <p>You've completed the overview of our Enterprise AI Decision Platform. Now it's time to experience the power of AI-driven decision-making!</p>
                              <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                                <div className="flex items-center space-x-3">
                                  <Award className="h-10 w-10 text-yellow-500" />
                                  <div>
                                    <h4 className="font-medium text-green-800">Next Steps</h4>
                                    <ul className="mt-2 space-y-2 text-sm">
                                      <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                                        <span>Explore the Strategic Planning section</span>
                                      </li>
                                      <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                                        <span>Check out your personalized Executive Dashboard</span>
                                      </li>
                                      <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                                        <span>Begin your first AI-assisted decision journey</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleComplete}
                >
                  {currentStep === wizardSteps.length - 1 ? "Close" : "Skip Tour"}
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="flex items-center"
                >
                  {currentStep === wizardSteps.length - 1 ? (
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