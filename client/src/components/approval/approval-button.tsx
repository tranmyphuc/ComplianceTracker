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

interface ApprovalButtonProps {
  moduleType: string;            // Loại module cần phê duyệt (risk_assessment, system_registration, document, training)
  moduleId: string;              // ID của module cần phê duyệt
  title: string;                 // Tiêu đề của mục cần phê duyệt
  description?: string;          // Mô tả về mục cần phê duyệt
  priority?: 'low' | 'medium' | 'high'; // Mức độ ưu tiên
  buttonText?: string;           // Văn bản hiển thị trên nút
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'; // Biến thể nút
  onSuccess?: () => void;        // Callback khi gửi thành công
  disabled?: boolean;            // Vô hiệu hóa nút
  autoSubmit?: boolean;          // Tự động gửi mà không hiển thị dialog
}

export function ApprovalButton({
  moduleType,
  moduleId,
  title,
  description = '',
  priority = 'medium',
  buttonText = 'Gửi phê duyệt',
  buttonVariant = 'default',
  onSuccess,
  disabled = false,
  autoSubmit = false
}: ApprovalButtonProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form để gửi yêu cầu phê duyệt
  const form = useForm({
    defaultValues: {
      title: title,
      description: description,
      priority: priority,
      notes: '',
      dueDate: ''
    }
  });

  // Mutation để tạo yêu cầu phê duyệt
  const createApprovalMutation = useMutation({
    mutationFn: (data: any) => {
      return apiRequest('/api/approval/items', {
        method: 'POST',
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: 'Đã gửi phê duyệt',
        description: 'Yêu cầu phê duyệt của bạn đã được gửi thành công.',
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/approval/items'] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Không thể gửi yêu cầu phê duyệt',
        description: error?.message || 'Đã xảy ra lỗi khi gửi yêu cầu phê duyệt.',
        variant: 'destructive',
      });
    }
  });

  // Kiểm tra xem module này đã có yêu cầu phê duyệt đang chờ xử lý chưa
  const { data: existingItems, isLoading } = useQuery({
    queryKey: ['/api/approval/items/check', moduleType, moduleId],
    queryFn: () =>
      apiRequest('/api/approval/items/check', {
        params: {
          moduleType,
          moduleId
        }
      }),
    enabled: open || autoSubmit // Chỉ chạy khi dialog mở hoặc khi autoSubmit = true
  });

  // Xử lý khi nhấn nút gửi
  const onSubmit = (data: any) => {
    createApprovalMutation.mutate({
      ...data,
      moduleType,
      moduleId,
      status: 'pending'
    });
  };

  // Xử lý khi nhấn nút
  const handleClick = () => {
    if (autoSubmit) {
      // Nếu tự động gửi, kiểm tra sự tồn tại trước
      if (existingItems && existingItems.exists) {
        toast({
          title: 'Yêu cầu phê duyệt đã tồn tại',
          description: 'Module này đã có yêu cầu phê duyệt đang chờ xử lý.',
          variant: 'default',
        });
        return;
      }
      
      // Gửi với các giá trị mặc định
      createApprovalMutation.mutate({
        title,
        description,
        priority,
        moduleType,
        moduleId,
        status: 'pending'
      });
    } else {
      // Mở dialog nếu không tự động gửi
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
            Đang gửi...
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
            <DialogTitle>Gửi yêu cầu phê duyệt</DialogTitle>
            <DialogDescription>
              Điền thông tin cần thiết cho yêu cầu phê duyệt của bạn.
            </DialogDescription>
          </DialogHeader>

          {existingItems && existingItems.exists ? (
            <div className="flex flex-col items-center justify-center space-y-3 p-4 text-center">
              <AlertTriangleIcon className="h-10 w-10 text-amber-500" />
              <h3 className="text-lg font-semibold">Yêu cầu phê duyệt đã tồn tại</h3>
              <p className="text-sm text-muted-foreground">
                Module này đã có yêu cầu phê duyệt đang chờ xử lý. Vui lòng đợi quy trình hiện tại hoàn tất trước khi gửi yêu cầu mới.
              </p>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Đóng
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
                      <FormLabel>Tiêu đề</FormLabel>
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
                      <FormLabel>Mô tả</FormLabel>
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
                      <FormLabel>Mức độ ưu tiên</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mức độ ưu tiên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Thấp</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="high">Cao</SelectItem>
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
                      <FormLabel>Ngày đến hạn (tùy chọn)</FormLabel>
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
                      <FormLabel>Ghi chú thêm (tùy chọn)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Thêm bất kỳ ghi chú hoặc hướng dẫn nào cho người phê duyệt" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={createApprovalMutation.isPending}>
                    {createApprovalMutation.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <FileCheckIcon className="mr-2 h-4 w-4" />
                        Gửi yêu cầu
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