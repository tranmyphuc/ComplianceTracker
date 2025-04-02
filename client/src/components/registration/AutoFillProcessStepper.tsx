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
        return <PencilIcon className="h-3.5 w-3.5" />;
      case 'web_research':
        return <Globe className="h-3.5 w-3.5" />;
      case 'ai_analysis':
        return <BotIcon className="h-3.5 w-3.5" />;
      case 'classification':
        return <FilterIcon className="h-3.5 w-3.5" />;
      case 'form_completion':
        return <DatabaseIcon className="h-3.5 w-3.5" />;
      default:
        return <InfoIcon className="h-3.5 w-3.5" />;
    }
  };
  
  const toggleStepDetails = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
    if (onViewDetails) onViewDetails(stepId);
  };
  
  // Get current step details
  const currentStep = steps.find(s => s.id === currentStepId);
  
  return (
    <div className="w-full">
      {/* Super compact horizontal progress with step indicators */}
      <div className="flex items-center space-x-1 mb-2">
        <span className="text-xs font-medium text-slate-700 whitespace-nowrap">Progress:</span>
        <div className="flex-1 flex items-center space-x-1">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step indicator dot */}
              <div 
                className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                  step.status === 'complete' ? 'bg-green-500' : 
                  step.status === 'processing' ? 'bg-blue-500 animate-pulse' : 
                  step.status === 'error' ? 'bg-red-500' : 
                  'bg-slate-300'
                } ${step.id === currentStepId ? 'ring-2 ring-blue-300' : ''}`}
                title={step.title}
              />
              {/* Connector line between dots (except after last dot) */}
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 ${
                  steps[index].status === 'complete' && steps[index + 1].status === 'complete' 
                    ? 'bg-green-500' 
                    : 'bg-slate-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <span className="text-xs font-medium text-slate-700 w-8 text-right">{progress}%</span>
      </div>
      
      {/* Ultra-compact horizontal layout */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-1">
        {/* Step list - first column (25%) */}
        <div className="col-span-1 border rounded p-1.5 bg-slate-50">
          <div className="space-y-0.5">
            {steps.map((step) => (
              <div 
                key={step.id}
                onClick={() => toggleStepDetails(step.id)}
                className={`flex items-center cursor-pointer rounded py-0.5 px-1 text-[11px]
                  ${step.id === currentStepId ? 'bg-blue-50 font-medium' : 'hover:bg-slate-100'}
                  ${step.status === 'complete' ? 'text-green-700' : 
                    step.status === 'processing' ? 'text-blue-700' : 
                    step.status === 'error' ? 'text-red-700' : 
                    'text-slate-600'}`}
              >
                <div className={`h-4 w-4 rounded-full flex-shrink-0 flex items-center justify-center mr-1.5
                  ${step.status === 'complete' ? 'bg-green-100' : 
                    step.status === 'processing' ? 'bg-blue-100' : 
                    step.status === 'error' ? 'bg-red-100' : 
                    'bg-slate-200'}`}
                >
                  {step.status === 'complete' && <CheckIcon className="h-2.5 w-2.5 text-green-600" />}
                  {step.status === 'processing' && <LoaderIcon className="h-2.5 w-2.5 text-blue-600 animate-spin" />}
                  {step.status === 'error' && <XIcon className="h-2.5 w-2.5 text-red-600" />}
                  {step.status === 'pending' && getStepIcon(step)}
                </div>
                <span className="truncate leading-tight">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current step details - middle two columns (50%) */}
        <div className="col-span-2 border rounded p-1.5 bg-slate-50 flex flex-col justify-center">
          {currentStep ? (
            <>
              <div className="flex items-center">
                <h4 className="text-xs font-medium text-blue-800 truncate mr-1">
                  {currentStep.title}
                </h4>
                {currentStep.status === 'processing' && (
                  <Badge variant="outline" className="ml-auto h-3.5 px-1 py-0 bg-blue-50 text-blue-600 text-[9px]">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-1">
                {currentStep.description}
              </p>
            </>
          ) : (
            <p className="text-[10px] text-slate-500 text-center">No active step</p>
          )}
        </div>
        
        {/* Info box - last column (25%) */}
        <div className="col-span-1 border rounded p-1.5 bg-slate-50 flex items-center">
          <InfoIcon className="h-3 w-3 text-blue-600 mr-1 flex-shrink-0" />
          <div className="text-[9px] text-slate-600 leading-tight">
            AI auto-fill extracts compliance data from your description
          </div>
        </div>
      </div>
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