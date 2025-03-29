import React from 'react';
import { CheckIcon, ClockIcon, SparklesIcon, LoaderIcon, XIcon, SearchIcon, BotIcon, PencilIcon } from 'lucide-react';

type AutoFillStepStatus = 'pending' | 'processing' | 'complete' | 'error';

interface AutoFillStep {
  id: string;
  title: string;
  description: string;
  status: AutoFillStepStatus;
}

interface AutoFillProcessStepperProps {
  steps: AutoFillStep[];
  currentStepId?: string;
}

export function AutoFillProcessStepper({ steps, currentStepId }: AutoFillProcessStepperProps) {
  return (
    <div className="w-full">
      {/* Horizontal Stepper */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator with status icon */}
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 
                ${step.status === 'complete' ? 'bg-green-50 border-green-500' : 
                  step.status === 'processing' ? 'bg-blue-50 border-blue-500' : 
                  step.status === 'error' ? 'bg-red-50 border-red-500' : 
                  'bg-neutral-50 border-neutral-300'}`}>
                {step.status === 'complete' && <CheckIcon className="h-4 w-4 text-green-500" />}
                {step.status === 'processing' && <LoaderIcon className="h-4 w-4 text-blue-500 animate-spin" />}
                {step.status === 'error' && <XIcon className="h-4 w-4 text-red-500" />}
                {step.status === 'pending' && <ClockIcon className="h-4 w-4 text-neutral-400" />}
              </div>
              
              {/* Step name below the icon - only visible for current or completed steps */}
              <span className={`text-[10px] mt-1 text-center font-medium px-1
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
                  step.status === 'processing' ? 'bg-blue-500' : 
                  'bg-neutral-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Current step description */}
      {currentStepId && (
        <div className="bg-blue-50 rounded-md p-3 mt-2 text-center">
          <h4 className="text-sm font-medium text-blue-700">
            {steps.find(s => s.id === currentStepId)?.title}
          </h4>
          <p className="text-xs text-blue-600 mt-1">
            {steps.find(s => s.id === currentStepId)?.description}
          </p>
        </div>
      )}
    </div>
  );
}

// Default steps for the auto-fill process
export const defaultAutoFillSteps: AutoFillStep[] = [
  {
    id: 'input',
    title: 'Input System Description',
    description: 'Enter a detailed description of your AI system or select a template',
    status: 'pending'
  },
  {
    id: 'web_research',
    title: 'Web Research',
    description: 'The system will search for additional information about similar AI systems',
    status: 'pending'
  },
  {
    id: 'ai_analysis',
    title: 'AI Analysis',
    description: 'Deep semantic analysis of the description to identify system characteristics',
    status: 'pending'
  },
  {
    id: 'classification',
    title: 'EU AI Act Classification',
    description: 'Determining risk level and applicable requirements based on EU AI Act',
    status: 'pending'
  },
  {
    id: 'form_completion',
    title: 'Form Auto-Completion',
    description: 'Automatically filling the registration form with extracted information',
    status: 'pending'
  }
];