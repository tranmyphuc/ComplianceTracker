import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, FileText, BarChart3, BookOpen, Shield } from "lucide-react";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface AnimatedJourneyTrackerProps {
  currentStep?: number;
  onStepClick?: (index: number) => void;
}

export function AnimatedJourneyTracker({ 
  currentStep = 0, 
  onStepClick 
}: AnimatedJourneyTrackerProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  
  // Update active step when currentStep prop changes
  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  const journeySteps: JourneyStep[] = [
    {
      id: "register",
      title: "Register AI Systems",
      description: "Add your AI systems to the inventory",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-blue-500"
    },
    {
      id: "assess",
      title: "Risk Assessment",
      description: "Evaluate compliance risks",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-amber-500"
    },
    {
      id: "document",
      title: "Documentation",
      description: "Generate required documents",
      icon: <FileText className="w-5 h-5" />,
      color: "bg-emerald-500"
    },
    {
      id: "monitor",
      title: "Monitoring",
      description: "Track compliance status",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-indigo-500"
    },
    {
      id: "learn",
      title: "Knowledge & Training",
      description: "Stay updated on regulations",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-purple-500"
    }
  ];

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    if (onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Journey line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 z-0"></div>
        
        {/* Progress line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-purple-500 transform -translate-y-1/2 z-10"
          initial={{ width: "0%" }}
          animate={{ 
            width: `${(activeStep / (journeySteps.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5 }}
        ></motion.div>
        
        {/* Journey steps */}
        <div className="relative z-20 flex justify-between">
          {journeySteps.map((step, index) => (
            <div 
              key={step.id}
              className="flex flex-col items-center"
              onClick={() => handleStepClick(index)}
            >
              <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
                  index <= activeStep ? step.color : "bg-gray-200"
                } text-white`}
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: index === activeStep ? 1.1 : 1, 
                  opacity: 1,
                  transition: { 
                    delay: index * 0.1,
                    duration: 0.3
                  }
                }}
              >
                {index < activeStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </motion.div>
              
              <motion.div
                className="mt-2 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: index * 0.1 + 0.2,
                    duration: 0.3
                  }
                }}
              >
                <p className={`text-sm font-medium ${
                  index <= activeStep ? "text-gray-900" : "text-gray-500"
                }`}>{step.title}</p>
                <p className="text-xs text-gray-500 mt-1 hidden md:block">{step.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}