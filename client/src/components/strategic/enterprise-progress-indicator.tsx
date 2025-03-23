import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnterpriseProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function EnterpriseProgressIndicator({ 
  steps, 
  currentStep, 
  className 
}: EnterpriseProgressIndicatorProps) {
  const activeStepIndex = currentStep - 1;
  
  return (
    <div className={cn("w-full", className)}>
      {/* Step indicators and labels */}
      <div className="relative flex justify-between mb-2">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex;
          const isCompleted = index < activeStepIndex;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div 
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isActive ? "text-primary font-semibold" : 
                  isCompleted ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        {/* Background gradient pattern */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20"></div>
        
        {/* Active progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: `${(Math.max(0, activeStepIndex) / (steps.length - 1)) * 100}%` 
          }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="absolute h-full left-0 top-0 bg-gradient-to-r from-primary/90 to-primary rounded-full"
        />
        
        {/* Step positions */}
        <div className="absolute inset-0 flex justify-between items-center px-[1px]">
          {steps.map((_, index) => {
            const isActive = index === activeStepIndex;
            const isCompleted = index < activeStepIndex;
            
            return (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isActive ? 1.2 : 1, 
                  opacity: 1 
                }}
                className={cn(
                  "h-3 w-3 rounded-full relative z-10 transition-colors duration-300",
                  isActive ? "bg-primary shadow-sm shadow-primary/20" : 
                  isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                )}
              >
                {(isActive || isCompleted) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-full bg-primary/20 animate-ping"
                    style={{ animationDuration: "3s" }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}