import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, XCircle, ArrowRight, Cpu, Database, FileText, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIWorkflowDiagram({ activeStep = 0 }: { activeStep?: number }) {
  const steps = [
    { 
      id: 'input', 
      title: 'Data Input', 
      description: 'User submits AI system details or uploads documentation for analysis',
      icon: FileText,
      potential_issues: ['Missing required fields', 'Incorrect file format', 'Large file size limitations']
    },
    { 
      id: 'processing', 
      title: 'AI Processing', 
      description: 'DeepSeek AI analyzes the data according to EU AI Act criteria',
      icon: Cpu,
      potential_issues: ['API timeout', 'Malformed JSON response', 'Network connectivity issues']
    },
    { 
      id: 'fallback', 
      title: 'Fallback Chain', 
      description: 'If DeepSeek fails, system falls back to Gemini AI, then Google Search API',
      icon: RefreshCw,
      potential_issues: ['Secondary API timeout', 'Inconsistent data between APIs', 'Rate limiting issues']
    },
    { 
      id: 'enrichment', 
      title: 'Data Enrichment', 
      description: 'System enriches results with relevant EU AI Act articles and requirements',
      icon: Database,
      potential_issues: ['Missing regulatory references', 'Incorrect article mapping', 'Outdated regulatory information']
    },
    { 
      id: 'output', 
      title: 'Results', 
      description: 'Processed data presented with risk assessment and compliance recommendations',
      icon: Shield,
      potential_issues: ['Missing visualizations', 'Unclear recommendations', 'Missing compliance scores']
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">SGH ASIA AI Processing Workflow</h2>
      <p className="text-muted-foreground">
        This diagram shows how our system processes data and handles errors when analyzing AI systems for EU AI Act compliance.
      </p>
      
      <div className="relative mt-8">
        {/* Progress line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
        
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            let status: 'pending' | 'processing' | 'complete' | 'error' = 'pending';
            
            if (index < activeStep) status = 'complete';
            else if (index === activeStep) status = 'processing';
            
            return (
              <div key={step.id} className="relative pl-16 pr-4">
                {/* Step Icon */}
                <div className={cn(
                  "absolute left-0 rounded-full p-2 flex items-center justify-center",
                  status === 'pending' ? 'bg-muted text-muted-foreground' : 
                  status === 'processing' ? 'bg-blue-100 text-blue-700 animate-pulse' : 
                  status === 'complete' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                )}>
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-white">
                    <StepIcon className="h-6 w-6" />
                  </div>
                </div>
                
                {/* Step Content */}
                <Card className={cn(
                  "shadow-sm",
                  status === 'processing' ? 'border-blue-200 bg-blue-50' : 
                  status === 'complete' ? 'border-green-200' : 
                  status === 'error' ? 'border-red-200' : ''
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{step.title}</h3>
                      {status === 'complete' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {status === 'processing' && <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />}
                      {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                    
                    {/* Potential Issues */}
                    <div className="mt-3">
                      <details className="text-sm">
                        <summary className="font-medium cursor-pointer text-muted-foreground hover:text-foreground">
                          Potential issues to check
                        </summary>
                        <ul className="mt-2 pl-5 list-disc text-muted-foreground space-y-1">
                          {step.potential_issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Connector arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 ml-[-8px] mt-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <Alert className="mt-6 bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle>If you encounter issues</AlertTitle>
        <AlertDescription className="text-amber-800">
          If your analysis fails, check the following:
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Ensure all required fields are completed with specific details</li>
            <li>Check your internet connection as API calls require reliable connectivity</li>
            <li>The system may be experiencing high demand - try again after a few minutes</li>
            <li>Contact SGH ASIA support if persistent issues occur</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
}