
import { RiskAssessmentWizard } from "@/components/risk-assessment/risk-assessment-wizard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRouter } from "next/router";

export default function AssessRiskPage() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <RiskAssessmentWizard systemId={id as string} />
      </div>
    </DashboardLayout>
  );
}
