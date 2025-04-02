import React from 'react';
import { 
  BotIcon, PencilIcon, DatabaseIcon, 
  FilterIcon, Globe, InfoIcon, ShieldIcon
} from 'lucide-react';
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

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
}

// Create a compact, horizontally-oriented process stepper
export function AutoFillProcessStepper(props: AutoFillProcessStepperProps) {
  const { steps, currentStepId, showDetails = false, onViewDetails } = props;
  
  // Calculate overall progress
  const completedSteps = steps.filter(s => s.status === 'complete').length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);
  
  // Get current step details
  const currentStep = steps.find(s => s.id === currentStepId);
  
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center mb-2">
        <Progress 
          value={progress} 
          className="h-1.5 flex-1 mr-2" 
        />
        <span className="text-xs font-medium text-slate-600">{progress}%</span>
      </div>
      
      {/* Horizontal step indicators */}
      <div className="flex justify-between mb-2 px-0.5">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={`h-3 w-3 rounded-full 
                ${step.status === 'complete' ? 'bg-green-500' : 
                  step.status === 'processing' ? 'bg-blue-500 animate-pulse' : 
                  step.status === 'error' ? 'bg-red-500' : 
                  'bg-slate-300'
                } ${step.id === currentStepId ? 'ring-1 ring-blue-300' : ''}`}
            />
            <div className="mt-1 text-[8px] text-center hidden sm:block">
              {step.title.split(' ')[0]}
            </div>
          </div>
        ))}
      </div>
      
      {/* Current step info - ultra compact */}
      {currentStep && (
        <div className="flex items-center text-[10px] border-t border-slate-200 pt-1">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium text-blue-800">{currentStep.title}</span>
              {currentStep.status === 'processing' && (
                <Badge variant="outline" className="ml-1 h-3.5 px-1 py-0 text-[8px]">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-slate-600 line-clamp-1 pr-2">{currentStep.description}</p>
          </div>
          <div className="flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <InfoIcon className="h-3 w-3 text-slate-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs max-w-[300px]">{currentStep.details}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
}

// Define default steps in a separate export
export const defaultAutoFillSteps: AutoFillStep[] = [
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