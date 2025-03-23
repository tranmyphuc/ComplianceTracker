import React, { useEffect, useState } from 'react';
import { useApiClient } from '@/hooks/useApiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'wouter';
import { 
  AlertTriangle, BarChart, CheckCircle, ClipboardList, Clock, 
  FileText, Info, PieChart, ShieldAlert, Users, ArrowRight, 
  Activity, Bell, HelpCircle
} from 'lucide-react';
import RecentActivities from '@/components/dashboard/recent-activities';
import CriticalAlerts from '@/components/dashboard/critical-alerts';
import UpcomingDeadlines from '@/components/dashboard/upcoming-deadlines';
import RiskDistributionChart from '@/components/dashboard/risk-distribution-chart';
import SystemsByDepartmentChart from '@/components/dashboard/systems-by-department';
import DepartmentComplianceChart from '@/components/dashboard/department-compliance';
import Skeleton from '@/components/ui/skeleton';
import SystemComplianceProgress from '@/components/dashboard/system-compliance-progress';
import DashboardGuide from '@/components/dashboard/dashboard-guide';

interface DashboardSummary {
  recentActivities: any[];
  criticalAlerts: any[];
  upcomingDeadlines: any[];
  riskDistribution: any[];
  systemsByDepartment: any[];
  departmentCompliance: any[];
  systemComplianceProgress: any;
}

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const { apiClient } = useApiClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await apiClient.get('/api/dashboard/summary');
        setSummary(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching dashboard summary',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [apiClient, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Skeleton className="w-full max-w-lg" />
      </div>
    );
  }

  if (!summary) {
    return <p>Error loading dashboard</p>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your EU AI Act compliance status and activities
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowGuide(true)}
          className="gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          How to Use This Platform
        </Button>
      </div>

      <DashboardGuide open={showGuide} onOpenChange={setShowGuide} />

      <Tabs defaultValue="recentActivities">
        <TabsList>
          <TabsTrigger value="recentActivities">Recent Activities</TabsTrigger>
          <TabsTrigger value="criticalAlerts">Critical Alerts</TabsTrigger>
          <TabsTrigger value="upcomingDeadlines">Upcoming Deadlines</TabsTrigger>
        </TabsList>
        <TabsContent value="recentActivities">
          <RecentActivities activities={summary.recentActivities} />
        </TabsContent>
        <TabsContent value="criticalAlerts">
          <CriticalAlerts alerts={summary.criticalAlerts} />
        </TabsContent>
        <TabsContent value="upcomingDeadlines">
          <UpcomingDeadlines deadlines={summary.upcomingDeadlines} />
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Breakdown of risks across your systems</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart data={summary.riskDistribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Systems by Department</CardTitle>
            <CardDescription>Number of systems per department</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemsByDepartmentChart data={summary.systemsByDepartment} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Department Compliance</CardTitle>
            <CardDescription>Overall compliance status per department</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentComplianceChart data={summary.departmentCompliance} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>System Compliance Progress</CardTitle>
            <CardDescription>Overall progress towards full compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemComplianceProgress progress={summary.systemComplianceProgress} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;