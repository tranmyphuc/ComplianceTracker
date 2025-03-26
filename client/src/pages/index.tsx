import { HighRiskSystemsWidget } from "@/components/dashboard/high-risk-systems-widget";
import { DepartmentComplianceWidget } from "@/components/dashboard/department-compliance-widget";
import { ComplianceSummaryWidget } from "@/components/dashboard/compliance-summary-widget";
import { RiskDistributionWidget } from "@/components/dashboard/risk-distribution-widget";
import { AiChatbotWidget } from "@/components/dashboard/ai-chatbot-widget";


function Dashboard() {
  return (
    <div className="p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UpcomingDeadlinesWidget />
        <CriticalAlertsWidget />
        <RecentActivitiesWidget />
        <AiChatbotWidget />
      </div>


      {/* Rest of the Dashboard component */}
    </div>
  );
}

export default Dashboard;