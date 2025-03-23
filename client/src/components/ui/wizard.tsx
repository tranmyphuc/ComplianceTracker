import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// This interface extends the basic WizardStep to include additional properties
// used by the enterprise-wizard.tsx component
export interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  mascotMood?: string;
  mascotMessage?: string;
  icon?: React.FC<{ className?: string }>;
  imageSrc?: string;
}

interface WizardProps {
  steps: WizardStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export function Wizard({ steps, onComplete, onSkip, showSkip = false }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepData = steps[currentStep];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStepData.icon && <currentStepData.icon className="h-6 w-6 text-primary" />}
            <CardTitle>{currentStepData.title}</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        <CardDescription>{currentStepData.subtitle}</CardDescription>
        <Separator className="mt-4" />
      </CardHeader>
      
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                  {currentStepData.content}
                </p>
                
                {currentStepData.mascotMessage && (
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mt-4">
                    <p className="text-sm italic">
                      {currentStepData.mascotMessage}
                    </p>
                  </div>
                )}
              </div>
              
              {currentStepData.imageSrc && (
                <div className="flex items-center justify-center">
                  <img 
                    src={currentStepData.imageSrc} 
                    alt={`Illustration for ${currentStepData.title}`} 
                    className="rounded-lg shadow-md max-h-60 object-contain"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-t">
        <div>
          {showSkip && currentStep === 0 && (
            <Button variant="ghost" onClick={onSkip}>
              Skip Tour
            </Button>
          )}
          
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </div>
        
        <Button onClick={nextStep}>
          {isLastStep ? 'Complete' : 'Next'}
          {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}