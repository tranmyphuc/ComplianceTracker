import { HighRiskSystemsWidget } from "@/components/dashboard/high-risk-systems-widget";
import { DepartmentComplianceWidget } from "@/components/dashboard/department-compliance-widget";
import { ComplianceSummaryWidget } from "@/components/dashboard/compliance-summary-widget";
import { RiskDistributionWidget } from "@/components/dashboard/risk-distribution-widget";
import { AiChatbotWidget } from "@/components/dashboard/ai-chatbot-widget";
import { Card, CardHeader, CardTitle, CardContent, Button, Link, CircleHelp, ArrowRight } from "@nextui-org/react"; // Assuming these imports are needed


function Dashboard() {
  const dashboardData = { totalAssessments: 5 }; // Example data, replace with actual data fetching
  const pendingAssessments = 2;
  const completedAssessments = 3;

  return (
    <div className="p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UpcomingDeadlinesWidget /> {/*  Assuming this component exists */}
        <CriticalAlertsWidget /> {/* Assuming this component exists */}
        <RecentActivitiesWidget /> {/* Assuming this component exists */}
        <AiChatbotWidget />
        <Card className="col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
                <CircleHelp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-2xl font-bold">{dashboardData.totalAssessments || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {pendingAssessments} pending, {completedAssessments} completed
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/risk-assessment/wizard">
                      <ArrowRight className="h-3 w-3 mr-1" /> 
                      New Assessment
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild> {/* Added Advanced Analytics Link */}
                    <Link href="/advanced-analytics">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Advanced Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
      </div>


      {/* Rest of the Dashboard component */}
    </div>
  );
}

export default Dashboard;