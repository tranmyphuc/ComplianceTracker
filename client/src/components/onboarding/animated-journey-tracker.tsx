import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedJourneyTrackerProps {
  totalSteps: number;
  currentStep: number;
  stepLabels?: string[];
  className?: string;
}

export function AnimatedJourneyTracker({
  totalSteps,
  currentStep,
  stepLabels = [],
  className = ""
}: AnimatedJourneyTrackerProps) {
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className={`relative ${className}`}>
      {/* Progress bar */}
      <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div 
          className="absolute left-0 top-0 h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
        />
      </div>
      
      {/* Step markers */}
      <div className="relative mt-1 h-8">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const label = stepLabels[i] || `Step ${i + 1}`;
          
          return (
            <div 
              key={i}
              className="absolute transform -translate-x-1/2"
              style={{ 
                left: `${(i / (totalSteps - 1)) * 100}%`, 
                top: 0 
              }}
            >
              <motion.div 
                className={`w-4 h-4 rounded-full mb-1 mx-auto flex items-center justify-center
                  ${isCompleted ? 'bg-primary' : isCurrent ? 'bg-primary' : 'bg-neutral-200'}`}
                initial={false}
                animate={{ 
                  scale: isCurrent ? [1, 1.2, 1] : 1,
                  backgroundColor: isCompleted || isCurrent ? 'var(--primary)' : 'var(--neutral-200)'
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: isCurrent ? Infinity : 0,
                  repeatDelay: 2
                }}
              >
                {isCompleted && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </motion.div>
              
              <div className="text-xs font-medium text-center text-neutral-600 max-w-[80px] mx-auto truncate">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}