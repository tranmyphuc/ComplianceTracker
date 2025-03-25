import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApprovalList } from './approval-list';
import { ApprovalStatistics } from './approval-statistics';
import { ApprovalSettings } from './approval-settings';
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Settings,
  InBox,
  Filter,
  User
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-context';

// Approval status mapping to appropriate icon and color
const statusConfig = {
  pending: { icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  in_review: { icon: <FileText className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800 border-blue-300' },
  approved: { icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800 border-green-300' },
  rejected: { icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-800 border-red-300' },
  cancelled: { icon: <AlertCircle className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800 border-gray-300' }
};

// Module type mapping to icon
const moduleTypeConfig = {
  risk_assessment: <AlertCircle className="h-4 w-4" />,
  system_registration: <FileText className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  training: <FileText className="h-4 w-4" />
};

export function ApprovalDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [filter, setFilter] = useState('all');

  const { data: approvalData, isLoading, error } = useQuery({ 
    queryKey: ['/api/approval/workflows'],
    enabled: !!user
  });

  const { data: notificationCount } = useQuery({ 
    queryKey: ['/api/approval/notifications/unread/count'],
    enabled: !!user
  });

  // Filter the approval items based on the active tab and filter
  const filteredApprovals = React.useMemo(() => {
    if (!approvalData) return [];
    
    let filtered = approvalData.filter(item => {
      // Filter by status (tab)
      if (activeTab !== 'all' && item.status !== activeTab) {
        return false;
      }
      
      // Filter by module type
      if (filter !== 'all' && item.moduleType !== filter) {
        return false;
      }
      
      // Filter for "mine" - assigned to current user
      if (filter === 'mine' && !item.assignments?.some(a => a.assignedTo === user?.uid)) {
        return false;
      }
      
      return true;
    });
    
    // Sort by createdAt, newest first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [approvalData, activeTab, filter, user]);

  // Calculate counts for the tabs
  const counts = React.useMemo(() => {
    if (!approvalData) return { all: 0, pending: 0, in_review: 0, approved: 0, rejected: 0, cancelled: 0 };
    
    return approvalData.reduce((acc, item) => {
      acc.all++;
      acc[item.status]++;
      return acc;
    }, { all: 0, pending: 0, in_review: 0, approved: 0, rejected: 0, cancelled: 0 });
  }, [approvalData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CardDescription>Items awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.pending || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <CardDescription>Items currently being reviewed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.in_review || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CardDescription>Successfully approved items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.approved || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <CardDescription>Items that did not pass review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.rejected || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Approval Workflows</CardTitle>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    className="text-sm border rounded p-1"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="risk_assessment">Risk Assessments</option>
                    <option value="system_registration">System Registrations</option>
                    <option value="document">Documents</option>
                    <option value="training">Training</option>
                    <option value="mine">Assigned to Me</option>
                  </select>
                </div>
              </div>
              
              <CardDescription>
                Review and manage approval workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-6 mb-4">
                  <TabsTrigger value="all">
                    All 
                    <Badge variant="outline" className="ml-2">{counts.all}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                    <Badge variant="outline" className="ml-2">{counts.pending}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="in_review">
                    In Review
                    <Badge variant="outline" className="ml-2">{counts.in_review}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved
                    <Badge variant="outline" className="ml-2">{counts.approved}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected
                    <Badge variant="outline" className="ml-2">{counts.rejected}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Cancelled
                    <Badge variant="outline" className="ml-2">{counts.cancelled}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ApprovalList 
                    approvals={filteredApprovals} 
                    isLoading={isLoading} 
                    statusConfig={statusConfig}
                    moduleTypeConfig={moduleTypeConfig}
                  />
                </TabsContent>
                
                <TabsContent value="pending">
                  <ApprovalList 
                    approvals={filteredApprovals} 
                    isLoading={isLoading} 
                    statusConfig={statusConfig}
                    moduleTypeConfig={moduleTypeConfig}
                  />
                </TabsContent>
                
                <TabsContent value="in_review">
                  <ApprovalList 
                    approvals={filteredApprovals} 
                    isLoading={isLoading} 
                    statusConfig={statusConfig}
                    moduleTypeConfig={moduleTypeConfig}
                  />
                </TabsContent>
                
                <TabsContent value="approved">
                  <ApprovalList 
                    approvals={filteredApprovals} 
                    isLoading={isLoading} 
                    statusConfig={statusConfig}
                    moduleTypeConfig={moduleTypeConfig}
                  />
                </TabsContent>
                
                <TabsContent value="rejected">
                  <ApprovalList 
                    approvals={filteredApprovals} 
                    isLoading={isLoading} 
                    statusConfig={statusConfig}
                    moduleTypeConfig={moduleTypeConfig}
                  />
                </TabsContent>
                
                <TabsContent value="cancelled">
                  <ApprovalList 
                    approvals={filteredApprovals} 
                    isLoading={isLoading} 
                    statusConfig={statusConfig}
                    moduleTypeConfig={moduleTypeConfig}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Approval Statistics
                </CardTitle>
                <CardDescription>
                  Overview of approval workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApprovalStatistics />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Approval Settings
                </CardTitle>
                <CardDescription>
                  Configure your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApprovalSettings />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}