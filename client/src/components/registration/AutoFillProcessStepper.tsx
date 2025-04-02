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
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Auto-fill Progress:</span>
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm font-medium text-slate-700 w-8 text-right">{progress}%</span>
      </div>
      
      {/* Compact Horizontal Layout */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {/* Steps on the left */}
        <div className="border rounded-md p-3 bg-slate-50">
          <h4 className="text-xs text-slate-500 uppercase font-medium mb-2">Process Steps</h4>
          <div className="space-y-1.5">
            {steps.map((step) => (
              <div 
                key={step.id}
                onClick={() => toggleStepDetails(step.id)}
                className={`flex items-center cursor-pointer p-1.5 rounded-md
                  ${step.id === currentStepId ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-100'}
                  ${step.status === 'complete' ? 'text-green-700' : 
                    step.status === 'processing' ? 'text-blue-700' : 
                    step.status === 'error' ? 'text-red-700' : 
                    'text-neutral-500'}`}
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2
                  ${step.status === 'complete' ? 'bg-green-100' : 
                    step.status === 'processing' ? 'bg-blue-100 animate-pulse' : 
                    step.status === 'error' ? 'bg-red-100' : 
                    'bg-slate-200'}`}>
                  {step.status === 'complete' && <CheckIcon className="h-3.5 w-3.5 text-green-600" />}
                  {step.status === 'processing' && <LoaderIcon className="h-3.5 w-3.5 text-blue-600 animate-spin" />}
                  {step.status === 'error' && <XIcon className="h-3.5 w-3.5 text-red-600" />}
                  {step.status === 'pending' && getStepIcon(step)}
                </div>
                <span className="text-xs font-medium flex-1 truncate">{step.title}</span>
                {step.status === 'processing' && (
                  <Badge variant="outline" className="ml-1 p-0 h-4 px-1 bg-blue-50 text-blue-600 text-[9px]">
                    Active
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Current step details on the right */}
        <div className="border rounded-md p-3 bg-slate-50">
          <h4 className="text-xs text-slate-500 uppercase font-medium mb-2">Current Activity</h4>
          {currentStepId && (
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
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {steps.find(s => s.id === currentStepId)?.description}
              </p>
            </div>
          )}
        </div>
        
        {/* System details on the bottom row - spanning both columns */}
        <div className="col-span-2 border rounded-md p-3 bg-slate-50 flex items-start gap-2">
          <InfoIcon className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-600">
            <span className="font-medium text-slate-700">AI auto-fill:</span> Uses advanced AI to analyze your system description and automatically extract information for EU AI Act compliance using deep semantic analysis.
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