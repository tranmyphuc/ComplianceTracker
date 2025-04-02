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
        title: 'Phân công thành công',
        description: 'Yêu cầu phê duyệt đã được phân công cho người dùng đã chọn',
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
        title: 'Lỗi khi phân công',
        description: error.message || 'Không thể phân công yêu cầu phê duyệt. Vui lòng thử lại.',
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
        title: 'Tự động phân công thành công',
        description: 'Yêu cầu phê duyệt đã được tự động phân công',
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
        title: 'Lỗi khi tự động phân công',
        description: error.message || 'Không thể tự động phân công yêu cầu phê duyệt. Vui lòng thử lại.',
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
        title: 'Cập nhật cài đặt thành công',
        description: 'Cài đặt tự động phân công đã được cập nhật',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/approval/settings/auto-assignment'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi khi cập nhật cài đặt',
        description: error.message || 'Không thể cập nhật cài đặt tự động phân công. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  });

  const handleManualAssign = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'Chưa chọn người dùng',
        description: 'Vui lòng chọn ít nhất một người dùng để phân công',
        variant: 'destructive',
      });
      return;
    }

    manualAssignMutation.mutate({
      assignees: selectedUsers,
      notes: assignmentNote
    });
  };

  const handleAutoAssign = () => {
    autoAssignMutation.mutate({
      forceAssign: true
    });
  };

  const handleUpdateSettings = () => {
    updateSettingsMutation.mutate(autoSettings);
  };

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
            <span>Phân công</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Phân công yêu cầu phê duyệt</DialogTitle>
          <DialogDescription>
            {title}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" onValueChange={(value) => setMode(value as 'manual' | 'auto')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">
              <div className="flex items-center gap-1">
                <Users2Icon className="h-4 w-4" />
                <span>Phân công thủ công</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="auto">
              <div className="flex items-center gap-1">
                <ZapIcon className="h-4 w-4" />
                <span>Tự động phân công</span>
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
                  <Label>Chọn người phê duyệt</Label>
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
                        Không tìm thấy người dùng có quyền phê duyệt
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú phân công</Label>
                <Textarea
                  id="note"
                  placeholder="Thêm ghi chú cho người phê duyệt..."
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
                Hủy
              </Button>
              <Button 
                type="button"
                onClick={handleManualAssign}
                disabled={manualAssignMutation.isPending || selectedUsers.length === 0}
              >
                {manualAssignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang phân công...
                  </>
                ) : (
                  <>Phân công</>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="auto" className="space-y-4">
            <Tabs defaultValue="assign" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="assign">Tự động phân công</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>

              <TabsContent value="assign" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-2">
                    <p className="text-sm font-medium">Chiến lược phân công</p>
                    <p className="text-sm text-muted-foreground">
                      {autoSettings.strategyType === 'workload_balanced' && 'Cân bằng tải công việc: Phân công cho người có ít công việc nhất'}
                      {autoSettings.strategyType === 'round_robin' && 'Luân phiên: Phân công luân phiên cho tất cả người dùng đủ điều kiện'}
                      {autoSettings.strategyType === 'department_based' && 'Theo phòng ban: Phân công dựa trên phòng ban phù hợp'}
                      {autoSettings.strategyType === 'expertise_based' && 'Theo chuyên môn: Phân công cho chuyên gia trong lĩnh vực'}
                    </p>
                    
                    <div className="space-y-1 mt-2">
                      <p className="text-sm font-medium">Vai trò đủ điều kiện</p>
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
                        <p className="text-sm font-medium">Phòng ban ưu tiên</p>
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
                  Hệ thống sẽ tự động phân công yêu cầu phê duyệt này cho những người phù hợp nhất dựa trên cài đặt.
                </p>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-enabled" className="text-base">Bật tự động phân công</Label>
                    <Switch 
                      id="auto-enabled"
                      checked={autoSettings.enabled}
                      onCheckedChange={(checked) => 
                        setAutoSettings(prev => ({ ...prev, enabled: checked }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="strategy-type">Chiến lược phân công</Label>
                    <Select 
                      value={autoSettings.strategyType}
                      onValueChange={(value) => 
                        setAutoSettings(prev => ({ ...prev, strategyType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chiến lược phân công" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workload_balanced">Cân bằng tải</SelectItem>
                        <SelectItem value="round_robin">Luân phiên</SelectItem>
                        <SelectItem value="department_based">Theo phòng ban</SelectItem>
                        <SelectItem value="expertise_based">Theo chuyên môn</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {autoSettings.strategyType === 'workload_balanced' && 'Phân công cho người có ít công việc đang chờ nhất'}
                      {autoSettings.strategyType === 'round_robin' && 'Phân công lần lượt cho mọi người để đảm bảo công bằng'}
                      {autoSettings.strategyType === 'department_based' && 'Phân công dựa trên mối liên hệ giữa loại phê duyệt và phòng ban'}
                      {autoSettings.strategyType === 'expertise_based' && 'Phân công cho chuyên gia trong từng lĩnh vực cụ thể'}
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handleUpdateSettings}
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Settings2Icon className="mr-2 h-4 w-4" />
                      Lưu cài đặt
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
                Hủy
              </Button>
              <Button 
                type="button"
                onClick={handleAutoAssign}
                disabled={autoAssignMutation.isPending || !autoSettings.enabled}
              >
                {autoAssignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang phân công...
                  </>
                ) : (
                  <>
                    <ZapIcon className="mr-2 h-4 w-4" />
                    Tự động phân công
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