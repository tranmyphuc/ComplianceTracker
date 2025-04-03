import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AssignmentDialog } from './assignment-dialog';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, BadgeCheck, UserCheck2, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface IntegratedApprovalButtonProps {
  // Module info for creating approval item
  moduleType: 'system_registration' | 'risk_assessment' | 'document' | 'training';
  moduleId: string;
  moduleName?: string;
  
  // Override default button appearance/behavior
  buttonText?: string;
  buttonVariant?: 'default' | 'primary' | 'outline' | 'secondary';
  buttonSize?: 'default' | 'sm' | 'lg';
  
  // Additional data to pass to approval workflow
  moduleData?: Record<string, any>;
  
  // Submit mode (quick for direct submit, normal for dialog with options)
  submitMode?: 'quick' | 'normal';
  
  // Callback functions
  onSubmitStart?: () => void;
  onSubmitSuccess?: (approvalItemId: number) => void;
  onSubmitError?: (error: Error) => void;
  
  // Classes
  className?: string;
}

export function IntegratedApprovalButton({
  moduleType,
  moduleId,
  moduleName,
  buttonText = 'Send for Approval',
  buttonVariant = 'default',
  buttonSize = 'default',
  moduleData,
  submitMode = 'normal',
  onSubmitStart,
  onSubmitSuccess,
  onSubmitError,
  className
}: IntegratedApprovalButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [newApprovalItemId, setNewApprovalItemId] = useState<number | null>(null);
  
  // Create approval workflow item
  const createApprovalMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/approval/workflows', {
      method: 'POST',
      body: data
    }),
    onSuccess: (data) => {
      toast({
        title: 'Approval Request Submitted',
        description: 'Approval request has been created and is awaiting processing',
      });
      setIsSubmitDialogOpen(false);
      setNewApprovalItemId(data.id);
      
      // For quick submit, we're done here
      if (submitMode === 'quick') {
        queryClient.invalidateQueries({ queryKey: ['/api/approval/workflows'] });
        if (onSubmitSuccess) onSubmitSuccess(data.id);
        return;
      }
      
      // For normal submit, ask if user wants to assign now
      setIsAssignDialogOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: 'Error Submitting Approval',
        description: error.message || 'Unable to create approval request. Please try again.',
        variant: 'destructive',
      });
      if (onSubmitError) onSubmitError(error);
    }
  });
  
  // Auto-assign workflow (after creation)
  const autoAssignMutation = useMutation({
    mutationFn: (itemId: number) => apiRequest(`/api/approval/workflows/${itemId}/auto-assign`, {
      method: 'POST',
    }),
    onSuccess: () => {
      toast({
        title: 'Auto-assignment Successful',
        description: 'Approval request has been automatically assigned to appropriate reviewers',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/approval/workflows'] });
      setIsAssignDialogOpen(false);
      if (onSubmitSuccess && newApprovalItemId) onSubmitSuccess(newApprovalItemId);
    },
    onError: (error: any) => {
      toast({
        title: 'Auto-assignment Failed',
        description: error.message || 'Unable to automatically assign approval request. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = () => {
    if (onSubmitStart) onSubmitStart();
    
    // For quick submit, create approval immediately
    if (submitMode === 'quick') {
      submitApproval();
      return;
    }
    
    // For normal submit, open dialog first
    setIsSubmitDialogOpen(true);
  };
  
  const submitApproval = () => {
    const displayName = moduleName || `${moduleType.replace('_', ' ')} approval - ${moduleId}`;
    
    createApprovalMutation.mutate({
      moduleType,
      moduleId,
      name: displayName,
      description: comments,
      priority: 'medium',
      details: moduleData || {}
    });
  };
  
  const handleAutoAssign = () => {
    if (newApprovalItemId) {
      autoAssignMutation.mutate(newApprovalItemId);
    }
  };
  
  // After creating an approval item, show options dialog
  const renderAssignOptionsDialog = () => {
    if (!newApprovalItemId) return null;
    
    return (
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign for Approval</DialogTitle>
            <DialogDescription>
              Approval request has been created. Would you like to assign it now?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <Button
              onClick={handleAutoAssign}
              disabled={autoAssignMutation.isPending}
              className="w-full flex items-center justify-center"
            >
              {autoAssignMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BadgeCheck className="mr-2 h-4 w-4" />
              )}
              Auto-assign
            </Button>
            
            <AssignmentDialog
              itemId={newApprovalItemId}
              title="Choose Manual Approver"
              trigger={
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <UserCheck2 className="mr-2 h-4 w-4" />
                  Manual Assignment
                </Button>
              }
              onAssignmentComplete={() => {
                setIsAssignDialogOpen(false);
                if (onSubmitSuccess) onSubmitSuccess(newApprovalItemId);
              }}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => {
                setIsAssignDialogOpen(false);
                if (onSubmitSuccess) onSubmitSuccess(newApprovalItemId);
              }}
            >
              Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Render the main submit dialog with comments entry
  const renderSubmitDialog = () => (
    <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit for Approval</DialogTitle>
          <DialogDescription>
            Add notes or details for the approval reviewer
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="comments">Notes</Label>
            <Textarea
              id="comments"
              placeholder="Add detailed information about this approval request..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsSubmitDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={submitApproval}
            disabled={createApprovalMutation.isPending}
          >
            {createApprovalMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : 'Submit for approval'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  // Main button/dropdown rendering
  if (submitMode === 'normal') {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={buttonVariant as any} 
              size={buttonSize}
              className={className}
              disabled={createApprovalMutation.isPending}
            >
              {createApprovalMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  {buttonText}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleSubmit}>
              Submit with notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (onSubmitStart) onSubmitStart();
                submitApproval();
              }}
            >
              Quick submit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {renderSubmitDialog()}
        {renderAssignOptionsDialog()}
      </>
    );
  }
  
  // Simple quick-submit button
  return (
    <>
      <Button
        variant={buttonVariant as any}
        size={buttonSize}
        className={className}
        disabled={createApprovalMutation.isPending}
        onClick={handleSubmit}
      >
        {createApprovalMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : buttonText}
      </Button>
      
      {renderAssignOptionsDialog()}
    </>
  );
}