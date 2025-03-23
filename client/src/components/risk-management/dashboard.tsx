
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle, 
  Circle, 
  Clock, 
  Edit, 
  PlusCircle, 
  Shield, 
  ShieldAlert, 
  Activity, 
  FileText,
  Zap,
  Calendar,
  Search,
  RefreshCw,
  AlertCircle,
  ListChecks
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { RiskControlList } from './risk-control-list';
import { RiskEventList } from './risk-event-list';
import { CreateControlDialog } from './create-control-dialog';
import { RecordEventDialog } from './record-event-dialog';
import { ReviewRmsDialog } from './review-rms-dialog';

interface DashboardProps {
  userId: string;
}

export const RiskManagementDashboard: React.FC<DashboardProps> = ({ userId }) => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [system, setSystem] = useState<any>(null);
  const [rms, setRms] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [controls, setControls] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  const [createControlOpen, setCreateControlOpen] = useState(false);
  const [recordEventOpen, setRecordEventOpen] = useState(false);
  const [reviewRmsOpen, setReviewRmsOpen] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch system
      const systemResponse = await api.get(`/api/systems/${systemId}`);
      setSystem(systemResponse.data);
      
      // Fetch risk management system
      try {
        const rmsResponse = await api.get(`/api/system/${systemId}/risk-management`);
        setRms(rmsResponse.data);
      } catch (error) {
        // RMS might not exist yet
        setRms(null);
      }
      
      // Fetch controls
      const controlsResponse = await api.get(`/api/system/${systemId}/risk-controls`);
      setControls(controlsResponse.data);
      
      // Fetch events
      const eventsResponse = await api.get(`/api/system/${systemId}/risk-events`);
      setEvents(eventsResponse.data);
      
      // Fetch report
      try {
        const reportResponse = await api.get(`/api/system/${systemId}/risk-management/report`);
        setReport(reportResponse.data);
      } catch (error) {
        // Report might not be available
        setReport(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load risk management data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (systemId) {
      fetchData();
    }
  }, [systemId]);
  
  const handleCreateRms = async () => {
    try {
      const response = await api.post(`/api/system/${systemId}/risk-management`, {
        userId,
        reviewCycle: 'quarterly'
      });
      
      setRms(response.data);
      toast({
        title: 'Success',
        description: 'Risk management system created successfully',
      });
      
      fetchData();
    } catch (error) {
      console.error('Error creating RMS:', error);
      toast({
        title: 'Error',
        description: 'Failed to create risk management system',
        variant: 'destructive',
      });
    }
  };
  
  const handleRmsReviewed = () => {
    setReviewRmsOpen(false);
    fetchData();
  };
  
  const handleControlCreated = () => {
    setCreateControlOpen(false);
    fetchData();
  };
  
  const handleEventRecorded = () => {
    setRecordEventOpen(false);
    fetchData();
  };
  
  const handleGenerateControls = async () => {
    try {
      await api.post(`/api/system/${systemId}/risk-controls/generate-from-gaps`, {
        userId
      });
      
      toast({
        title: 'Success',
        description: 'Controls generated from compliance gaps',
      });
      
      fetchData();
    } catch (error) {
      console.error('Error generating controls:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate controls from gaps',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case 'outdated':
        return <Badge className="bg-yellow-100 text-yellow-800">Outdated</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!system) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">System Not Found</h2>
        <p className="text-gray-500 mb-4">The requested system could not be found.</p>
        <Button onClick={() => navigate('/systems')}>Back to Systems</Button>
      </div>
    );
  }
  
  if (!rms) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{system.name}</h1>
            <p className="text-gray-500">Risk Management System</p>
          </div>
          <Button onClick={handleCreateRms} className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Risk Management System
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2 text-yellow-500" />
              Risk Management System Required
            </CardTitle>
            <CardDescription>
              This system does not have a risk management system yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              According to the EU AI Act, high-risk AI systems require a risk management system
              throughout their entire lifecycle. Creating a risk management system will help you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identify and analyze known and foreseeable risks</li>
              <li>Implement effective risk mitigation measures</li>
              <li>Document your risk management approach</li>
              <li>Continuously monitor and update risk controls</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateRms} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Risk Management System
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{system.name}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-gray-500">Risk Management System</p>
            {getStatusBadge(rms.status)}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setReviewRmsOpen(true)} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Review
          </Button>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {report && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Risk Level Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {report.riskLevel === 'high' ? (
                    <ShieldAlert className="h-8 w-8 text-red-500" />
                  ) : report.riskLevel === 'limited' ? (
                    <Shield className="h-8 w-8 text-yellow-500" />
                  ) : (
                    <Shield className="h-8 w-8 text-green-500" />
                  )}
                  <div>
                    <p className="text-2xl font-bold capitalize">{report.riskLevel}</p>
                    <p className="text-xs text-gray-500">EU AI Act Classification</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Controls Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Controls Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {report.controlSummary.byStatus.implemented + 
                     report.controlSummary.byStatus.verified} / {report.controlSummary.total}
                  </p>
                  <p className="text-xs text-gray-500">Implemented Controls</p>
                  <Progress 
                    className="h-2 mt-2" 
                    value={report.controlSummary.total > 0 
                      ? ((report.controlSummary.byStatus.implemented + 
                         report.controlSummary.byStatus.verified) / 
                         report.controlSummary.total) * 100 
                      : 0} 
                  />
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          {/* Effectiveness Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Control Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{report.controlSummary.effectivenessRate}%</p>
                  <p className="text-xs text-gray-500">Effectiveness Rate</p>
                  <Progress 
                    className="h-2 mt-2" 
                    value={report.controlSummary.effectivenessRate} 
                    color={
                      report.controlSummary.effectivenessRate > 70 ? 'bg-green-500' :
                      report.controlSummary.effectivenessRate > 40 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }
                  />
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          {/* Open Events Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Risk Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {report.eventSummary.byStatus.new + 
                     report.eventSummary.byStatus.underInvestigation}
                  </p>
                  <p className="text-xs text-gray-500">
                    Including {report.eventSummary.openCriticalEvents} critical
                  </p>
                </div>
                <AlertCircle className={
                  report.eventSummary.openCriticalEvents > 0 
                    ? "h-8 w-8 text-red-500" 
                    : "h-8 w-8 text-yellow-500"
                } />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* RMS Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Risk Management System Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p>{getStatusBadge(rms.status)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Created Date</p>
              <p>{formatDate(rms.createdDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Last Review Date</p>
              <p>{formatDate(rms.lastReviewDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Next Review Date</p>
              <p>{formatDate(rms.nextReviewDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Review Cycle</p>
              <p className="capitalize">{rms.reviewCycle.replace('_', ' ')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Version</p>
              <p>{rms.version}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setReviewRmsOpen(true)}>
              <Clock className="h-4 w-4 mr-2" />
              Schedule Review
            </Button>
            {rms.documentReference && (
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="controls">Risk Controls</TabsTrigger>
          <TabsTrigger value="events">Risk Events</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Risks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Top Risks</CardTitle>
                <CardDescription>Highest priority risks to address</CardDescription>
              </CardHeader>
              <CardContent>
                {report && report.topRisks ? (
                  <div className="space-y-2">
                    {report.topRisks.map((risk: any, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 rounded bg-gray-50">
                        {risk.severity === 'critical' ? (
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        ) : risk.severity === 'high' ? (
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{risk.description}</span>
                            <Badge className={
                              risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {risk.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Source: {risk.source === 'event' ? 'Risk Event' : 'Control Failure'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Search className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">No top risks identified yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recommendations</CardTitle>
                <CardDescription>Actions to improve risk management</CardDescription>
              </CardHeader>
              <CardContent>
                {report && report.recommendations ? (
                  <div className="space-y-2">
                    {report.recommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 rounded bg-gray-50">
                        <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <ListChecks className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">No recommendations available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/systems/${systemId}/report/implementation-plan`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Implementation Plan
                </Button>
              </CardFooter>
            </Card>
            
            {/* Recent Activity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                <CardDescription>Latest risk management actions</CardDescription>
              </CardHeader>
              <CardContent>
                {report && report.recentActivities && report.recentActivities.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.recentActivities.map((activity: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(activity.date)}</TableCell>
                          <TableCell>{activity.description}</TableCell>
                          <TableCell>{activity.userId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Calendar className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">No recent activities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Controls Tab */}
        <TabsContent value="controls">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Risk Controls</h3>
            <div className="flex space-x-2">
              <Button onClick={handleGenerateControls} variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Generate from Gaps
              </Button>
              <Button onClick={() => setCreateControlOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Control
              </Button>
            </div>
          </div>
          
          <RiskControlList 
            controls={controls} 
            onControlUpdated={fetchData} 
            userId={userId}
          />
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Risk Events</h3>
            <Button onClick={() => setRecordEventOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Record Event
            </Button>
          </div>
          
          <RiskEventList 
            events={events} 
            onEventUpdated={fetchData} 
            userId={userId}
          />
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Management Report</CardTitle>
                <CardDescription>Comprehensive overview of your risk management system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  The report provides a detailed assessment of your risk management system, 
                  including control effectiveness, event analysis, and compliance status.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate(`/systems/${systemId}/report/risk-management`)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Implementation Plan</CardTitle>
                <CardDescription>Structured plan for implementing risk controls</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  The implementation plan provides a structured approach to implementing
                  risk controls, with timelines, responsibilities, and resource requirements.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate(`/systems/${systemId}/report/implementation-plan`)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      {createControlOpen && (
        <CreateControlDialog
          open={createControlOpen}
          onClose={() => setCreateControlOpen(false)}
          onControlCreated={handleControlCreated}
          systemId={systemId}
          userId={userId}
        />
      )}
      
      {recordEventOpen && (
        <RecordEventDialog
          open={recordEventOpen}
          onClose={() => setRecordEventOpen(false)}
          onEventRecorded={handleEventRecorded}
          systemId={systemId}
          userId={userId}
        />
      )}
      
      {reviewRmsOpen && (
        <ReviewRmsDialog
          open={reviewRmsOpen}
          onClose={() => setReviewRmsOpen(false)}
          onReviewed={handleRmsReviewed}
          systemId={systemId}
          userId={userId}
          rms={rms}
        />
      )}
    </div>
  );
};
