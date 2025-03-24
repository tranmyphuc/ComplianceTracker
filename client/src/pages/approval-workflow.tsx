import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ApprovalWorkflow } from "@/components/approval/approval-workflow";

export default function ApprovalWorkflowPage() {
  return (
    <AppLayout>
      <ApprovalWorkflow />
    </AppLayout>
  );
}