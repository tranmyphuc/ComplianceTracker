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
  // Calculate overall progress
  const completedSteps = steps.filter(s => s.status === 'complete').length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);
  
  // Get current step details
  const currentStep = steps.find(s => s.id === currentStepId);
  
  // Ultra-minimal design 
  return (
    <div className="w-full">
      <div className="flex items-center gap-1 mb-1">
        <div className="flex-1 flex items-center h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-600">{progress}%</span>
      </div>
      
      {/* Inline steps with no vertical padding */}
      <div className="flex items-center space-x-0.5 text-[9px] mb-1 overflow-x-auto pb-0.5">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`flex items-center whitespace-nowrap px-1.5 py-0.5 rounded-sm
              ${step.id === currentStepId ? 'bg-blue-100 text-blue-800' : 'text-slate-600'}
              ${step.status === 'complete' ? 'text-green-700' : ''}
            `}
          >
            <span className="mr-1">
              {step.status === 'complete' ? 
                <CheckIcon className="h-2 w-2 text-green-600" /> : 
                step.status === 'processing' ? 
                <LoaderIcon className="h-2 w-2 text-blue-600 animate-spin" /> :
                <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
              }
            </span>
            {step.title}
            {index < steps.length - 1 && <span className="mx-1 text-slate-300">•</span>}
          </div>
        ))}
      </div>
      
      {currentStep && (
        <div className="flex items-center border-t border-slate-200 pt-1">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-[10px] font-medium text-blue-800">{currentStep.title}</span>
              {currentStep.status === 'processing' && (
                <span className="ml-1.5 px-1 py-0 text-[8px] bg-blue-50 text-blue-600 rounded">Processing</span>
              )}
            </div>
            <p className="text-[9px] text-slate-600 line-clamp-1">{currentStep.description}</p>
          </div>
          <div className="flex-shrink-0 ml-2">
            <InfoIcon className="h-2.5 w-2.5 text-slate-400" title="AI auto-fill extracts compliance data" />
          </div>
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