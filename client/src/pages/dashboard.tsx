import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { ComplianceChart } from "@/components/dashboard/compliance-chart";
import { RegulatoryTimeline } from "@/components/dashboard/regulatory-timeline";
import { HighRiskSystems } from "@/components/dashboard/high-risk-systems";
import { CriticalAlerts } from "@/components/dashboard/critical-alerts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CpuIcon, AlertTriangleIcon, FileTextIcon, UserIcon, PlusIcon, BarChart3Icon, CalendarIcon, Bot } from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { data: summary, isLoading } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className={sidebarOpen ? "" : "hidden"} />
        
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="md:flex">
            {/* Main Dashboard Content */}
            <div className="flex-1 p-4 md:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-neutral-800">Executive Dashboard</h1>
                <p className="text-neutral-500 mt-1">Overview of your AI systems compliance status</p>
              </div>
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-40" />
                  ))
                ) : (
                  <>
                    <KpiCard
                      title="Total AI Systems"
                      value={summary?.totalSystems || 0}
                      icon={CpuIcon}
                      change={4}
                      subtext="From previous month"
                    />
                    <KpiCard
                      title="High-Risk Systems"
                      value={summary?.highRiskSystems || 0}
                      icon={AlertTriangleIcon}
                      change={2}
                      iconColor="text-[#dc2626]"
                      iconBgColor="bg-[#dc2626]/10"
                      subtext={`${summary?.highRiskSystems && summary?.totalSystems ? 
                        ((summary.highRiskSystems / summary.totalSystems) * 100).toFixed(1) : 0}% of total systems`}
                    />
                    <KpiCard
                      title="Documentation Completeness"
                      value={summary?.docCompleteness || 0}
                      percentage={true}
                      icon={FileTextIcon}
                      progressValue={summary?.docCompleteness || 0}
                      iconColor="text-[#0284c7]"
                      iconBgColor="bg-[#0284c7]/10"
                      subtext="+12% from previous month"
                    />
                    <KpiCard
                      title="Training Completion"
                      value={summary?.trainingCompleteness || 0}
                      percentage={true}
                      icon={UserIcon}
                      progressValue={summary?.trainingCompleteness || 0}
                      iconColor="text-[#4f46e5]"
                      iconBgColor="bg-[#4f46e5]/10"
                      subtext="+5% from previous month"
                    />
                  </>
                )}
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-80" />
                  ))
                ) : (
                  <>
                    <RiskChart 
                      data={summary?.riskDistribution || { high: 0, limited: 0, minimal: 0 }} 
                      totalSystems={summary?.totalSystems || 0} 
                    />
                    <ComplianceChart data={summary?.departmentCompliance || []} />
                    <RegulatoryTimeline />
                  </>
                )}
              </div>
              
              {/* High-Risk Systems Table */}
              <div className="mb-6">
                <HighRiskSystems />
              </div>
              
              {/* Call to Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button className="flex items-center">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Register New System
                </Button>
                <Button variant="outline" className="flex items-center">
                  <BarChart3Icon className="mr-2 h-4 w-4" />
                  Generate Compliance Report
                </Button>
                <Button variant="outline" className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Schedule Assessment
                </Button>
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="w-full md:w-80 p-4 md:p-6 space-y-6 lg:border-l lg:border-neutral-200">
              <CriticalAlerts />
              <RecentActivity />
              <UpcomingDeadlines />
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
      
      {/* AI Chat Button (Mobile) */}
      <div className="fixed right-4 bottom-4 md:hidden z-50">
        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
