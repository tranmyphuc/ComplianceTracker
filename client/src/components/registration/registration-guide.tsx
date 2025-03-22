
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheckIcon, AlertCircleIcon, FileTextIcon, CheckCircleIcon, UploadIcon, SparklesIcon } from "lucide-react";

interface RegistrationGuideProps {
  currentStep: number;
  onClose: () => void;
}

export function RegistrationGuide({ currentStep = 1, onClose }: RegistrationGuideProps) {
  const [expanded, setExpanded] = useState(true);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.max(0, (currentStep / 6) * 100));
  
  const steps = [
    {
      title: "Basic Information",
      description: "Enter name, description, and department",
      icon: <FileTextIcon className="h-5 w-5" />,
      complete: currentStep > 1
    },
    {
      title: "AI Analysis",
      description: "Let our DeepSeek AI analyze your system",
      icon: <SparklesIcon className="h-5 w-5" />,
      complete: currentStep > 2
    },
    {
      title: "Technical Details",
      description: "Provide AI capabilities and training data",
      icon: <UploadIcon className="h-5 w-5" />,
      complete: currentStep > 3
    },
    {
      title: "Risk Assessment",
      description: "Verify risk classification and impact",
      icon: <AlertCircleIcon className="h-5 w-5" />,
      complete: currentStep > 4
    },
    {
      title: "Documentation",
      description: "Confirm required documentation",
      icon: <ClipboardCheckIcon className="h-5 w-5" />,
      complete: currentStep > 5
    },
    {
      title: "Submit Registration",
      description: "Complete and register your AI system",
      icon: <CheckCircleIcon className="h-5 w-5" />,
      complete: currentStep > 6
    }
  ];

  if (!expanded) {
    return (
      <Button 
        variant="outline" 
        className="fixed bottom-4 right-4 z-50 shadow-md"
        onClick={() => setExpanded(true)}
      >
        Show Registration Guide
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50 border-primary/20">
      <div className="bg-primary/5 p-3 flex justify-between items-center border-b">
        <h3 className="font-medium text-sm flex items-center">
          <ClipboardCheckIcon className="h-4 w-4 mr-2 text-primary" />
          Registration Guide
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setExpanded(false)}>
            <span className="sr-only">Minimize</span>
            <span aria-hidden>−</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <span className="sr-only">Close</span>
            <span aria-hidden>×</span>
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-start p-2 rounded ${currentStep === index + 1 ? 'bg-primary/10 border border-primary/20' : ''}`}
            >
              <div className={`flex items-center justify-center h-6 w-6 rounded-full ${step.complete ? 'bg-green-500 text-white' : currentStep === index + 1 ? 'bg-primary text-white' : 'bg-neutral-200'} mr-3`}>
                {step.complete ? <CheckCircleIcon className="h-4 w-4" /> : (index + 1)}
              </div>
              <div>
                <h4 className={`text-sm font-medium ${currentStep === index + 1 ? 'text-primary' : ''}`}>{step.title}</h4>
                <p className="text-xs text-neutral-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {currentStep <= steps.length && (
          <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <AlertCircleIcon className="h-4 w-4 mr-2" />
              Current Step: {steps[currentStep - 1].title}
            </h4>
            <p className="text-xs text-blue-700 mt-1">
              {currentStep === 1 && "Enter basic information about your AI system. Be detailed in your description for more accurate AI analysis."}
              {currentStep === 2 && "Click 'Run AI Analysis' to let our DeepSeek AI determine the most appropriate classification for your system."}
              {currentStep === 3 && "Enter technical information about AI capabilities, training datasets, and output types."}
              {currentStep === 4 && "Review the risk classification and verify potential impact assessments."}
              {currentStep === 5 && "Confirm the required documentation for your AI system's risk level."}
              {currentStep === 6 && "Review all information and submit your registration."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
