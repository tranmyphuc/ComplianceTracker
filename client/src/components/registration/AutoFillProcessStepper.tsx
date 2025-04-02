import React from 'react';
import { 
  BotIcon, PencilIcon, DatabaseIcon, 
  FilterIcon, Globe, InfoIcon, ShieldIcon,
  CheckCircle, CircleSlash, Circle
} from 'lucide-react';
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

export type AutoFillStepStatus = 'pending' | 'processing' | 'complete' | 'error';

export interface AutoFillStep {
  id: string;
  title: string;
  description: string;
  status: AutoFillStepStatus;
  icon?: React.ReactNode;
  details?: string;
  duration?: number; // Duration in ms for animation
}

export interface AutoFillProcessStepperProps {
  steps: AutoFillStep[];
  currentStepId?: string;
  showDetails?: boolean;
  onViewDetails?: (stepId: string) => void;
  progressPercentage?: number;
  processingLabel?: string;
}

// Enhanced professional horizontal process stepper with line connector
export function AutoFillProcessStepper(props: AutoFillProcessStepperProps) {
  const { 
    steps, 
    currentStepId, 
    showDetails = false, 
    onViewDetails,
    progressPercentage,
    processingLabel = "Processing..."
  } = props;
  
  // Calculate overall progress if not provided
  const completedSteps = steps.filter(s => s.status === 'complete').length;
  const processingSteps = steps.filter(s => s.status === 'processing').length;
  const totalSteps = steps.length;
  const progress = progressPercentage !== undefined ? 
    progressPercentage : 
    Math.round(((completedSteps + (processingSteps * 0.5)) / totalSteps) * 100);
  
  // Get current step details
  const currentStep = steps.find(s => s.id === currentStepId);
  const currentStepIndex = currentStep ? steps.findIndex(s => s.id === currentStep.id) : -1;
  const activeStep = currentStep || steps.find(s => s.status === 'processing') || steps[0];
  
  // Short names for step labels
  const getShortName = (title: string): string => {
    if (title.includes("Input")) return "Input";
    if (title.includes("Web")) return "Web";
    if (title.includes("AI Analysis")) return "AI";
    if (title.includes("Classification")) return "EU";
    if (title.includes("Form") || title.includes("Completion")) return "Form";
    return title.split(' ')[0];
  };
  
  return (
    <div className="w-full space-y-6">
      {/* Horizontal step indicators with connecting line */}
      <div className="relative flex items-center justify-between mb-6">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -translate-y-1/2" />
        
        {steps.map((step, index) => {
          // Determine icon based on status
          let StepIcon: React.ReactNode;
          let iconColor: string;
          let bgColor: string;
          
          if (step.status === 'complete') {
            StepIcon = <CheckCircle className="h-4 w-4" />;
            iconColor = "text-white";
            bgColor = "bg-green-500";
          } else if (step.status === 'processing') {
            StepIcon = step.icon || <Circle className="h-4 w-4" />;
            iconColor = "text-white";
            bgColor = "bg-blue-500";
          } else if (step.status === 'error') {
            StepIcon = <CircleSlash className="h-4 w-4" />;
            iconColor = "text-white";
            bgColor = "bg-red-500";
          } else {
            StepIcon = step.icon || <Circle className="h-4 w-4" />;
            iconColor = "text-gray-400";
            bgColor = "bg-white";
          }
          
          return (
            <div key={step.id} className="flex flex-col items-center z-10">
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center
                  ${bgColor} ${iconColor} border-2
                  ${step.status === 'complete' ? 'border-green-500' : 
                    step.status === 'processing' ? 'border-blue-500' : 
                    step.status === 'error' ? 'border-red-500' : 
                    'border-gray-200'
                  }`}
              >
                {StepIcon}
              </div>
              <div className="mt-2 text-xs text-center font-medium">
                {getShortName(step.title)}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Current step info box */}
      {activeStep && (
        <div className={cn(
          "text-left p-2",
          activeStep.status === 'processing' ? "bg-blue-50" : 
          activeStep.status === 'complete' ? "bg-green-50" :
          activeStep.status === 'error' ? "bg-red-50" : ""
        )}>
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className={cn(
                "text-sm font-medium",
                activeStep.status === 'processing' ? "text-blue-800" : 
                activeStep.status === 'complete' ? "text-green-800" :
                activeStep.status === 'error' ? "text-red-800" : "text-gray-800"
              )}>
                {activeStep.title} {activeStep.status === 'processing' && <Badge variant="outline" className="ml-2 text-xs">Active</Badge>}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {activeStep.description}
              </p>
            </div>
            {activeStep.status === 'error' && (
              <div className="text-red-500 text-xs font-medium">
                Error
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Progress bar - modern gradient style */}
      <div className="space-y-1 mt-4">
        <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              progress >= 95 ? "bg-gradient-to-r from-green-500 to-green-400" : 
              "bg-gradient-to-r from-cyan-500 to-blue-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-medium">{Math.round(progress)}%</span>
          <span className="text-gray-600">{processingLabel}</span>
        </div>
      </div>
    </div>
  );
}

// Define default steps for the auto-fill process
export function getDefaultAutoFillSteps(): AutoFillStep[] {
  return [
    {
      id: 'input',
      title: 'Input Processing',
      description: 'Analyzing your AI system description to extract key information',
      status: 'pending',
      icon: <PencilIcon className="h-4 w-4 text-neutral-400" />,
      details: 'During this step, we process your input to identify key terms and phrases that describe your AI system. This includes extracting information about the system name, purpose, capabilities, and domain.',
      duration: 1000
    },
    {
      id: 'web_research',
      title: 'Web Research',
      description: 'Searching for the latest regulatory information relevant to your system',
      status: 'pending',
      icon: <Globe className="h-4 w-4 text-neutral-400" />,
      details: 'We conduct searches for the latest information about EU AI Act requirements and similar AI systems to yours. This helps ensure our suggestions reflect the most current regulatory guidance and industry practices.',
      duration: 3000
    },
    {
      id: 'ai_analysis',
      title: 'AI Analysis',
      description: 'Using multiple AI models to analyze your system characteristics',
      status: 'pending',
      icon: <BotIcon className="h-4 w-4 text-neutral-400" />,
      details: 'Our system uses advanced AI models to perform deep semantic analysis of your system description. This includes identifying key capabilities, potential risks, and applicable regulatory requirements.',
      duration: 5000
    },
    {
      id: 'classification',
      title: 'EU AI Act Classification',
      description: 'Determining your system\'s risk level according to the EU AI Act',
      status: 'pending',
      icon: <ShieldIcon className="h-4 w-4 text-neutral-400" />,
      details: 'We classify your AI system according to EU AI Act risk categories: Unacceptable, High, Limited, or Minimal Risk. This determines which specific articles and requirements apply to your system.',
      duration: 2000
    },
    {
      id: 'form_completion',
      title: 'Form Auto-Completion',
      description: 'Generating field values with confidence scores and justifications',
      status: 'pending',
      icon: <DatabaseIcon className="h-4 w-4 text-neutral-400" />,
      details: 'We prepare suggestions for all registration form fields based on our analysis. Each suggestion includes a confidence score and justification to help you evaluate and verify the information.',
      duration: 1500
    }
  ];
}

// For backward compatibility
export const defaultAutoFillSteps = getDefaultAutoFillSteps();