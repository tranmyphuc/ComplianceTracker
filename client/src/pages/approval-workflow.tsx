import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApprovalButton } from '@/components/approval/approval-button';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PencilIcon, CheckCircleIcon, XCircleIcon, ClockIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function ApprovalWorkflowPage() {
  const [activeTab, setActiveTab] = React.useState('pending');

  // Fetch approval items with the selected status
  const { data: approvalItems, isLoading, refetch } = useQuery({
    queryKey: ['/api/approval/items', { status: activeTab }],
    queryFn: () => 
      apiRequest('/api/approval/items', {
        params: { status: activeTab }
      }),
  });

  // Fetch assignments for the current user
  const { data: myAssignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['/api/approval/assignments/me'],
    queryFn: () => 
      apiRequest('/api/approval/assignments/me'),
  });

  // Handle tabChange
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Đang chờ</Badge>;
      case 'in_review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">Đang xem xét</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Đã phê duyệt</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cao</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Trung bình</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Thấp</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render approval items
  const renderApprovalItems = () => {
    if (isLoading) {
      return renderSkeletons();
    }

    if (!approvalItems?.items?.length) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Không có yêu cầu phê duyệt nào {activeTab === 'pending' ? 'đang chờ' : activeTab === 'approved' ? 'đã được phê duyệt' : 'bị từ chối'}.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {approvalItems.items.map((item: any) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" /> {item.createdBy}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" /> {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy') : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={item.status} />
                  <PriorityBadge priority={item.priority} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {}}
                >
                  <PencilIcon className="h-3 w-3 mr-1" /> Chi tiết
                </Button>
                
                {item.status === 'pending' && (
                  <>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="text-xs bg-green-600 hover:bg-green-700"
                      onClick={() => {}}
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> Phê duyệt
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {}}
                    >
                      <XCircleIcon className="h-3 w-3 mr-1" /> Từ chối
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render my assignments
  const renderMyAssignments = () => {
    if (isLoadingAssignments) {
      return renderSkeletons();
    }

    if (!myAssignments?.length) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Bạn không có công việc phê duyệt nào được giao.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {myAssignments.map((assignment: any) => (
          <Card key={assignment.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{assignment.item?.title || 'Không có tiêu đề'}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" /> Gán lúc: {assignment.assignedAt ? format(new Date(assignment.assignedAt), 'dd/MM/yyyy') : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={assignment.status} />
                  {assignment.item && (
                    <PriorityBadge priority={assignment.item.priority} />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {assignment.item?.description || 'Không có mô tả'}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {}}
                >
                  <PencilIcon className="h-3 w-3 mr-1" /> Xem chi tiết
                </Button>
                
                {assignment.status === 'pending' && (
                  <>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="text-xs bg-green-600 hover:bg-green-700"
                      onClick={() => {}}
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> Phê duyệt
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {}}
                    >
                      <XCircleIcon className="h-3 w-3 mr-1" /> Từ chối
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quy trình phê duyệt</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các yêu cầu phê duyệt và nhiệm vụ được giao cho bạn
          </p>
        </div>
        
        {/* Example of using ApprovalButton with a test module */}
        <ApprovalButton 
          moduleType="test_module"
          moduleId="test-id-123"
          title="Yêu cầu phê duyệt thử nghiệm"
          description="Đây là một ví dụ về quy trình phê duyệt tích hợp."
          buttonText="Tạo yêu cầu thử nghiệm"
          onSuccess={() => refetch()}
        />
      </div>

      <Tabs defaultValue="pending" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Đang chờ</TabsTrigger>
          <TabsTrigger value="in_review">Đang xem xét</TabsTrigger>
          <TabsTrigger value="approved">Đã phê duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
          <TabsTrigger value="my-assignments">Được giao cho tôi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {renderApprovalItems()}
        </TabsContent>
        
        <TabsContent value="in_review">
          {renderApprovalItems()}
        </TabsContent>
        
        <TabsContent value="approved">
          {renderApprovalItems()}
        </TabsContent>
        
        <TabsContent value="rejected">
          {renderApprovalItems()}
        </TabsContent>
        
        <TabsContent value="my-assignments">
          {renderMyAssignments()}
        </TabsContent>
      </Tabs>
    </div>
  );
}