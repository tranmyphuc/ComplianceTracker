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

/**
 * Jack said: The Approval Workflow page provides an interface for managing
 * approval requests and viewing assigned tasks.
 */
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

  /**
   * Jack said: Component for displaying approval status with appropriate styling
   */
  const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'in_review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">In Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /**
   * Jack said: Component for displaying priority levels with appropriate styling
   */
  const PriorityBadge = ({ priority }: { priority: string }) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>;
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
            <p className="text-muted-foreground">No approval requests {activeTab === 'pending' ? 'pending' : activeTab === 'approved' ? 'approved' : 'rejected'}.</p>
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
                  <PencilIcon className="h-3 w-3 mr-1" /> Details
                </Button>
                
                {item.status === 'pending' && (
                  <>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="text-xs bg-green-600 hover:bg-green-700"
                      onClick={() => {}}
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {}}
                    >
                      <XCircleIcon className="h-3 w-3 mr-1" /> Reject
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
            <p className="text-muted-foreground">You don't have any assigned approval tasks.</p>
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
                  <CardTitle className="text-xl">{assignment.item?.title || 'No title'}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" /> Assigned: {assignment.assignedAt ? format(new Date(assignment.assignedAt), 'dd/MM/yyyy') : 'N/A'}
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
                {assignment.item?.description || 'No description'}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {}}
                >
                  <PencilIcon className="h-3 w-3 mr-1" /> View Details
                </Button>
                
                {assignment.status === 'pending' && (
                  <>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="text-xs bg-green-600 hover:bg-green-700"
                      onClick={() => {}}
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {}}
                    >
                      <XCircleIcon className="h-3 w-3 mr-1" /> Reject
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
          <h1 className="text-3xl font-bold tracking-tight">Approval Workflow</h1>
          <p className="text-muted-foreground mt-1">
            Manage approval requests and tasks assigned to you
          </p>
        </div>
        
        {/* Example of using ApprovalButton with a test module */}
        <ApprovalButton 
          moduleType="test_module"
          moduleId="test-id-123"
          title="Test Approval Request"
          description="This is an example of the integrated approval workflow."
          buttonText="Create Test Request"
          onSuccess={() => refetch()}
        />
      </div>

      <Tabs defaultValue="pending" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_review">In Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="my-assignments">Assigned to Me</TabsTrigger>
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