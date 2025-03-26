import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface RiskAssessmentDashboardProps {
  onStartAssessment?: () => void;
}

export const RiskAssessmentDashboard: React.FC<RiskAssessmentDashboardProps> = ({ 
  onStartAssessment 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Risk Assessment</h1>
          <p className="text-muted-foreground">Evaluate and classify AI systems based on EU AI Act requirements</p>
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <Card className="max-w-3xl">
        <CardContent className="p-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-1">EU AI Act Compliance Platform</h2>
            <p className="text-sm text-muted-foreground mb-6">Current language: English</p>
            
            <p className="text-sm mb-6">
              Detailed guides and documentation to help you understand and implement EU AI Act risk assessments
            </p>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-1">Assessment Methodology</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Step-by-step process for conducting risk assessments
              </p>
              <p className="text-sm">
                Learn about the methodology for conducting a comprehensive risk assessment of AI systems, including risk identification, analysis, evaluation, and mitigation.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-1">High-Risk System Requirements</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Compliance requirements for high-risk AI systems
              </p>
              <p className="text-sm">
                Detailed explanation of the specific requirements that apply to high-risk AI systems under the EU AI Act, including risk management, data governance, and human oversight.
              </p>
            </div>
            
            <Button 
              variant="default" 
              className="bg-blue-700 hover:bg-blue-600 text-white"
            >
              View Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentDashboard;