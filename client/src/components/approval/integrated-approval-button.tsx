import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-context';

interface IntegratedApprovalButtonProps {
  moduleId: string;
  moduleType: 'risk_assessment' | 'system_registration' | 'document' | 'training';
  title: string;
  description?: string;
  onSuccess?: () => void;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  priority?: 'low' | 'medium' | 'high';
}

export function IntegratedApprovalButton({
  moduleId,
  moduleType,
  title,
  description = '',
  onSuccess,
  className = '',
  variant = 'default',
  priority = 'medium'
}: IntegratedApprovalButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mutation to submit for approval
  const submitForApprovalMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/approval/items', {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      toast({
        title: 'Submitted for approval',
        description: 'Your request has been submitted for approval',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/approval/items'] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit for approval',
        variant: 'destructive',
      });
    }
  });

  const handleSubmitForApproval = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit for approval',
        variant: 'destructive',
      });
      return;
    }

    const approvalData = {
      title,
      description,
      moduleType,
      moduleId,
      status: 'pending',
      priority,
      createdBy: user.displayName || user.email,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
    };

    submitForApprovalMutation.mutate(approvalData);
  };

  return (
    <Button
      onClick={handleSubmitForApproval}
      className={className}
      variant={variant}
      disabled={submitForApprovalMutation.isPending}
    >
      {submitForApprovalMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Clock className="mr-2 h-4 w-4" />
          Submit for Approval
        </>
      )}
    </Button>
  );
}