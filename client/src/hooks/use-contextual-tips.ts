import { useEffect, useCallback } from 'react';
import { useComplianceTips } from '@/components/compliance-tips';

/**
 * Custom hook to show contextual tips based on user interactions or application state
 * 
 * @param {Object} options Configuration options for contextual tips
 * @param {string} options.context The current context (e.g., 'risk-assessment', 'inventory')
 * @param {boolean} options.showOnMount Whether to show a tip when the component mounts
 * @param {number} options.delay Delay in milliseconds before showing the tip (default: 2000)
 * @param {string} options.specificTipId Specific tip ID to show (overrides context-based tips)
 * @param {() => boolean} options.shouldShowTip Function that determines if a tip should be shown
 * @param {boolean} options.jackStyle Whether to use Jack-style tips
 */
export function useContextualTips({
  context,
  showOnMount = true,
  delay = 2000,
  specificTipId,
  shouldShowTip = () => true,
  jackStyle = true,
}: {
  context: string;
  showOnMount?: boolean;
  delay?: number;
  specificTipId?: string;
  shouldShowTip?: () => boolean;
  jackStyle?: boolean;
}) {
  const { showTip, dismissTip, resetDismissedTips } = useComplianceTips();
  
  // Show a tip on mount if specified
  useEffect(() => {
    if (showOnMount && shouldShowTip()) {
      const timer = setTimeout(() => {
        if (specificTipId) {
          showTip(specificTipId);
        } else {
          showTip(undefined, context);
        }
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [showOnMount, context, specificTipId, delay, showTip, shouldShowTip]);
  
  // Function to trigger a tip based on an event or action
  const triggerTip = useCallback((tipId?: string, customContext?: string) => {
    if (shouldShowTip()) {
      showTip(tipId, customContext || context);
    }
  }, [context, showTip, shouldShowTip]);
  
  return {
    triggerTip,
    dismissTip,
    resetDismissedTips,
  };
}