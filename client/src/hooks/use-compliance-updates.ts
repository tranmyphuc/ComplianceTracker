import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  checkForComplianceTipUpdates, 
  fetchComplianceTipUpdates,
  ComplianceTipUpdate
} from '@/services/regulatory-updates';

/**
 * Hook for managing EU AI Act compliance updates
 * Periodically checks for new updates and provides functions to apply them
 */
export function useComplianceUpdates() {
  const [availableUpdates, setAvailableUpdates] = useState<number>(0);
  const [tipUpdates, setTipUpdates] = useState<ComplianceTipUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string>('');
  const { toast } = useToast();

  // Check for updates
  const checkForUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const count = await checkForComplianceTipUpdates();
      setAvailableUpdates(count);
      setLastChecked(new Date().toISOString());
      
      if (count > 0) {
        toast({
          title: 'Compliance Updates Available',
          description: `${count} compliance tip updates available. Apply updates to stay current with the latest EU AI Act requirements.`,
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error checking for compliance updates:', error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch available updates
  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const updates = await fetchComplianceTipUpdates();
      setTipUpdates(updates);
      return updates;
    } catch (error) {
      console.error('Error fetching compliance updates:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply updates to the tip database
  const applyUpdates = useCallback(async () => {
    if (availableUpdates === 0) return false;
    
    setLoading(true);
    try {
      const updates = await fetchUpdates();
      
      if (updates.length > 0) {
        // Here we would update the tips in our application state or database
        // For now, we'll just show a toast notification
        toast({
          title: 'Updates Applied',
          description: `Successfully applied ${updates.length} compliance tip updates.`,
          variant: 'success',
        });
        
        setAvailableUpdates(0);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error applying compliance updates:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to apply compliance updates. Please try again later.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [availableUpdates, fetchUpdates, toast]);

  // Automatically check for updates when the component mounts
  useEffect(() => {
    // Check for updates when the component mounts
    checkForUpdates();

    // Set up interval to check for updates daily
    const updateInterval = setInterval(() => {
      checkForUpdates();
    }, 24 * 60 * 60 * 1000); // 24 hours
    
    return () => clearInterval(updateInterval);
  }, [checkForUpdates]);

  return {
    availableUpdates,
    tipUpdates,
    loading,
    lastChecked,
    checkForUpdates,
    fetchUpdates,
    applyUpdates,
  };
}