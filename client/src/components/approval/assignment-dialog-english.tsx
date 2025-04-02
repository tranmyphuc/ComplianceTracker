import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlusIcon, Users2Icon, ZapIcon, Settings2Icon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

/**
 * Jack said: The assignment dialog component handles both manual and automatic assignment
 * of approval items to users based on various strategies and settings.
 */

interface User {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  role: string;
  department: string;
}

interface AssignmentDialogProps {
  itemId: number;
  title: string;
  trigger?: React.ReactNode;
  onAssignmentComplete?: () => void;
}

export function AssignmentDialog({
  itemId,
  title,
  trigger,
  onAssignmentComplete
}: AssignmentDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [assignmentNote, setAssignmentNote] = useState('');
  const [autoSettings, setAutoSettings] = useState({
    enabled: true,
    strategyType: 'workload_balanced',
    roles: ['admin', 'decision_maker'],
    departments: ['Legal & Compliance', 'IT'],
  });

  // Fetch available users for assignment
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/users/available-for-assignment'],
    queryFn: () => apiRequest('/api/users/available-for-assignment'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch current auto-assignment settings
  const { data: currentSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['/api/approval/settings/auto-assignment'],
    queryFn: () => apiRequest('/api/approval/settings/auto-assignment'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data: any) => {
      if (data) {
        setAutoSettings(data);
      }
    }
  });

  // Mutation for manual assignment
  const manualAssignMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest(`/api/approval/items/${itemId}/assign`, {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      toast({
        title: 'Assignment successful',
        description: 'Approval request has been assigned to the selected users',
      });
      setOpen(false);
      setSelectedUsers([]);
      setAssignmentNote('');
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/approval/items'] });
      if (onAssignmentComplete) {
        onAssignmentComplete();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Assignment error',
        description: error.message || 'Unable to assign approval request. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Mutation for auto assignment
  const autoAssignMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest(`/api/approval/items/${itemId}/auto-assign`, {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      toast({
        title: 'Auto-assignment successful',
        description: 'Approval request has been automatically assigned',
      });
      setOpen(false);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/approval/items'] });
      if (onAssignmentComplete) {
        onAssignmentComplete();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Auto-assignment error',
        description: error.message || 'Unable to auto-assign approval request. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Mutation for updating auto-assignment settings
  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/approval/settings/auto-assignment', {
        method: 'PUT',
        body: data
      }),
    onSuccess: (data) => {
      setAutoSettings(data);
      toast({
        title: 'Settings updated',
        description: 'Auto-assignment settings have been updated',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/approval/settings/auto-assignment'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Settings update error',
        description: error.message || 'Unable to update auto-assignment settings. Please try again.',
        variant: 'destructive',
      });
    }
  });

  /**
   * Jack said: Handle manual assignment of approval items to selected users
   */
  const handleManualAssign = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select at least one user to assign',
        variant: 'destructive',
      });
      return;
    }

    manualAssignMutation.mutate({
      assignees: selectedUsers,
      notes: assignmentNote
    });
  };

  /**
   * Jack said: Handle automatic assignment based on configured strategy
   */
  const handleAutoAssign = () => {
    autoAssignMutation.mutate({
      forceAssign: true
    });
  };

  /**
   * Jack said: Update the auto-assignment settings
   */
  const handleUpdateSettings = () => {
    updateSettingsMutation.mutate(autoSettings);
  };

  /**
   * Jack said: Toggle user selection for manual assignment
   */
  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Get department options from users
  const departmentOptions = users 
    ? Array.from(new Set(users.map((user: User) => user.department)))
        .filter(Boolean)
        .sort()
    : [];

  // Get role options from users
  const roleOptions = users
    ? Array.from(new Set(users.map((user: User) => user.role)))
        .filter(Boolean)
        .sort()
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <UserPlusIcon className="h-4 w-4" />
            <span>Assign</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Assign Approval Request</DialogTitle>
          <DialogDescription>
            {title}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" onValueChange={(value) => setMode(value as 'manual' | 'auto')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">
              <div className="flex items-center gap-1">
                <Users2Icon className="h-4 w-4" />
                <span>Manual Assignment</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="auto">
              <div className="flex items-center gap-1">
                <ZapIcon className="h-4 w-4" />
                <span>Auto Assignment</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <Label>Select Approvers</Label>
                  <div className="max-h-[240px] overflow-y-auto border rounded-md">
                    {users && users.length > 0 ? (
                      <div className="divide-y">
                        {users.map((user: User) => (
                          <div key={user.uid} className="flex items-center p-3 hover:bg-muted/50">
                            <Checkbox 
                              id={`user-${user.uid}`}
                              checked={selectedUsers.includes(user.uid)}
                              onCheckedChange={() => handleUserSelection(user.uid)}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <Label 
                                htmlFor={`user-${user.uid}`}
                                className="font-medium cursor-pointer"
                              >
                                {user.displayName || user.email}
                              </Label>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex gap-2 mt-1">
                                {user.role && (
                                  <Badge variant="outline" className="text-xs">
                                    {user.role}
                                  </Badge>
                                )}
                                {user.department && (
                                  <Badge variant="outline" className="text-xs">
                                    {user.department}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="p-4 text-sm text-muted-foreground text-center">
                        No users with approval permission found
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="note">Assignment Note</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note for approvers..."
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleManualAssign}
                disabled={manualAssignMutation.isPending || selectedUsers.length === 0}
              >
                {manualAssignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>Assign</>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="auto" className="space-y-4">
            <Tabs defaultValue="assign" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="assign">Auto Assign</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="assign" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-2">
                    <p className="text-sm font-medium">Assignment Strategy</p>
                    <p className="text-sm text-muted-foreground">
                      {autoSettings.strategyType === 'workload_balanced' && 'Workload Balanced: Assign to users with the least pending work'}
                      {autoSettings.strategyType === 'round_robin' && 'Round Robin: Assign to eligible users in rotation'}
                      {autoSettings.strategyType === 'department_based' && 'Department Based: Assign to appropriate departments'}
                      {autoSettings.strategyType === 'expertise_based' && 'Expertise Based: Assign to domain experts'}
                    </p>
                    
                    <div className="space-y-1 mt-2">
                      <p className="text-sm font-medium">Eligible Roles</p>
                      <div className="flex flex-wrap gap-1">
                        {autoSettings.roles?.map(role => (
                          <Badge key={role} variant="secondary" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {autoSettings.departments && autoSettings.departments.length > 0 && (
                      <div className="space-y-1 mt-2">
                        <p className="text-sm font-medium">Priority Departments</p>
                        <div className="flex flex-wrap gap-1">
                          {autoSettings.departments.map(dept => (
                            <Badge key={dept} variant="secondary" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground">
                  The system will automatically assign this approval request to the most suitable users based on settings.
                </p>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-enabled" className="text-base">Enable Auto Assignment</Label>
                    <Switch 
                      id="auto-enabled"
                      checked={autoSettings.enabled}
                      onCheckedChange={(checked) => 
                        setAutoSettings(prev => ({ ...prev, enabled: checked }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="strategy-type">Assignment Strategy</Label>
                    <Select 
                      value={autoSettings.strategyType}
                      onValueChange={(value) => 
                        setAutoSettings(prev => ({ ...prev, strategyType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workload_balanced">Workload Balanced</SelectItem>
                        <SelectItem value="round_robin">Round Robin</SelectItem>
                        <SelectItem value="department_based">Department Based</SelectItem>
                        <SelectItem value="expertise_based">Expertise Based</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {autoSettings.strategyType === 'workload_balanced' && 'Assigns to users with the fewest pending items'}
                      {autoSettings.strategyType === 'round_robin' && 'Assigns to each eligible user in turn to ensure fairness'}
                      {autoSettings.strategyType === 'department_based' && 'Assigns to users in departments relevant to the request type'}
                      {autoSettings.strategyType === 'expertise_based' && 'Assigns to users with expertise relevant to the request type'}
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  onClick={handleUpdateSettings}
                  className="w-full mt-2"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Settings2Icon className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleAutoAssign}
                disabled={autoAssignMutation.isPending || !autoSettings.enabled}
              >
                {autoAssignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <ZapIcon className="mr-2 h-4 w-4" />
                    Auto Assign
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}