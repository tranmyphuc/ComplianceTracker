import React, { useState } from 'react';
import { 
  CheckIcon, ClockIcon, SparklesIcon, LoaderIcon, XIcon, 
  SearchIcon, BotIcon, PencilIcon, DatabaseIcon, FilterIcon,
  Globe, InfoIcon, ShieldIcon, AlertCircleIcon
} from 'lucide-react';
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

// Jack said: "Show progress visually to keep users engaged during processing"
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

interface AutoFillProcessStepperProps {
  steps: AutoFillStep[];
  currentStepId?: string;
  showDetails?: boolean;
  onViewDetails?: (stepId: string) => void;
}

export function AutoFillProcessStepper({ 
  steps, 
  currentStepId, 
  showDetails = false,
  onViewDetails
}: AutoFillProcessStepperProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  
  // Calculate overall progress
  const completedSteps = steps.filter(s => s.status === 'complete').length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);
  
  // Get appropriate icon for each step
  const getStepIcon = (step: AutoFillStep) => {
    if (step.icon) return step.icon;
    
    switch (step.id) {
      case 'input':
        return <PencilIcon className="h-4 w-4" />;
      case 'web_research':
        return <Globe className="h-4 w-4" />;
      case 'ai_analysis':
        return <BotIcon className="h-4 w-4" />;
      case 'classification':
        return <FilterIcon className="h-4 w-4" />;
      case 'form_completion':
        return <DatabaseIcon className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };
  
  const toggleStepDetails = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
    if (onViewDetails) onViewDetails(stepId);
  };
  
  return (
    <div className="w-full">
      {/* Overall progress indicator */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-700">Auto-fill Progress</span>
          <span className="text-sm font-medium text-slate-700">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Horizontal Stepper */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator with status icon */}
            <div 
              className="flex flex-col items-center cursor-pointer" 
              onClick={() => toggleStepDetails(step.id)}
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 
                ${step.status === 'complete' ? 'bg-green-50 border-green-500' : 
                  step.status === 'processing' ? 'bg-blue-50 border-blue-500 animate-pulse' : 
                  step.status === 'error' ? 'bg-red-50 border-red-500' : 
                  'bg-neutral-50 border-neutral-300'}`}>
                {step.status === 'complete' && <CheckIcon className="h-5 w-5 text-green-500" />}
                {step.status === 'processing' && <LoaderIcon className="h-5 w-5 text-blue-500 animate-spin" />}
                {step.status === 'error' && <XIcon className="h-5 w-5 text-red-500" />}
                {step.status === 'pending' && getStepIcon(step)}
              </div>
              
              {/* Step name below the icon */}
              <span className={`text-xs mt-1 text-center font-medium px-1
                ${step.status === 'complete' ? 'text-green-700' : 
                  step.status === 'processing' ? 'text-blue-700' : 
                  step.status === 'error' ? 'text-red-700' : 
                  'text-neutral-500'}`}>
                {step.title.split(' ').slice(0, 2).join(' ')}
              </span>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-grow mx-1
                ${step.status === 'complete' ? 'bg-green-500' : 
                  step.status === 'processing' ? 'bg-blue-300' : 
                  'bg-neutral-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Current step description */}
      {currentStepId && (
        <div className={`rounded-md p-4 mt-2 ${
          steps.find(s => s.id === currentStepId)?.status === 'error' 
            ? 'bg-red-50 border border-red-200'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <h4 className="text-sm font-medium text-blue-800">
                  {steps.find(s => s.id === currentStepId)?.title}
                </h4>
                {steps.find(s => s.id === currentStepId)?.status === 'processing' && (
                  <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 text-[10px]">
                    Processing
                  </Badge>
                )}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {steps.find(s => s.id === currentStepId)?.description}
              </p>
            </div>
            
            {steps.find(s => s.id === currentStepId)?.details && showDetails && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-800 p-0 h-6"
                onClick={() => toggleStepDetails(currentStepId)}
              >
                <InfoIcon className="h-4 w-4 mr-1" />
                Details
              </Button>
            )}
          </div>
          
          {/* Expanded details section */}
          {expandedStep === currentStepId && steps.find(s => s.id === currentStepId)?.details && (
            <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-blue-700">
              {steps.find(s => s.id === currentStepId)?.details}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Default steps for the auto-fill process
// Jack said: "Use more descriptive steps with detailed explanations"
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