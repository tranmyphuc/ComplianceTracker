import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SendIcon, FileCheckIcon, AlertTriangleIcon } from 'lucide-react';

/**
 * Jack said: This component provides a button to submit items for approval workflow,
 * with options for customization and automatic submission.
 */

interface ApprovalButtonProps {
  moduleType: string;            // Type of module for approval (risk_assessment, system_registration, document, training)
  moduleId: string;              // ID of the module to be approved
  title: string;                 // Title of the item for approval
  description?: string;          // Description of the item for approval
  priority?: 'low' | 'medium' | 'high'; // Priority level
  buttonText?: string;           // Text to display on the button
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'; // Button variant
  onSuccess?: () => void;        // Callback when submission is successful
  disabled?: boolean;            // Disable the button
  autoSubmit?: boolean;          // Auto submit without showing dialog
}

export function ApprovalButton({
  moduleType,
  moduleId,
  title,
  description = '',
  priority = 'medium',
  buttonText = 'Submit for Approval',
  buttonVariant = 'default',
  onSuccess,
  disabled = false,
  autoSubmit = false
}: ApprovalButtonProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form for approval request submission
  const form = useForm({
    defaultValues: {
      title: title,
      description: description,
      priority: priority,
      notes: '',
      dueDate: ''
    }
  });

  // Mutation to create approval request
  const createApprovalMutation = useMutation({
    mutationFn: (data: any) => {
      return apiRequest('/api/approval/items', {
        method: 'POST',
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: 'Approval Submitted',
        description: 'Your approval request has been submitted successfully.',
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/approval/items'] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Unable to submit approval request',
        description: error?.message || 'An error occurred while submitting the approval request.',
        variant: 'destructive',
      });
    }
  });

  // Check if this module already has a pending approval request
  const { data: existingItems, isLoading } = useQuery({
    queryKey: ['/api/approval/items/check', moduleType, moduleId],
    queryFn: () =>
      apiRequest('/api/approval/items/check', {
        params: {
          moduleType,
          moduleId
        }
      }),
    enabled: open || autoSubmit // Only run when dialog is open or when autoSubmit = true
  });

  /**
   * Jack said: Handle form submission for approval request
   */
  const onSubmit = (data: any) => {
    createApprovalMutation.mutate({
      ...data,
      moduleType,
      moduleId,
      status: 'pending'
    });
  };

  /**
   * Jack said: Handle button click - either show dialog or auto-submit
   */
  const handleClick = () => {
    if (autoSubmit) {
      // If auto submitting, check existence first
      if (existingItems && existingItems.exists) {
        toast({
          title: 'Approval Request Already Exists',
          description: 'This module already has a pending approval request.',
          variant: 'default',
        });
        return;
      }
      
      // Submit with default values
      createApprovalMutation.mutate({
        title,
        description,
        priority,
        moduleType,
        moduleId,
        status: 'pending'
      });
    } else {
      // Open dialog if not auto-submitting
      setOpen(true);
    }
  };

  return (
    <>
      <Button 
        variant={buttonVariant} 
        onClick={handleClick} 
        disabled={disabled || createApprovalMutation.isPending || isLoading}
        className="gap-2"
      >
        {createApprovalMutation.isPending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Submitting...
          </>
        ) : (
          <>
            <SendIcon className="h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Approval Request</DialogTitle>
            <DialogDescription>
              Fill in the necessary information for your approval request.
            </DialogDescription>
          </DialogHeader>

          {existingItems && existingItems.exists ? (
            <div className="flex flex-col items-center justify-center space-y-3 p-4 text-center">
              <AlertTriangleIcon className="h-10 w-10 text-amber-500" />
              <h3 className="text-lg font-semibold">Approval Request Already Exists</h3>
              <p className="text-sm text-muted-foreground">
                This module already has a pending approval request. Please wait for the current process to complete before submitting a new request.
              </p>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date (optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Add any notes or instructions for approvers" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createApprovalMutation.isPending}>
                    {createApprovalMutation.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileCheckIcon className="mr-2 h-4 w-4" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}