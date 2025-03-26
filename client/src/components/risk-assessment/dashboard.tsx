import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RiskAssessmentDashboardProps {
  onStartAssessment?: () => void;
}

export const RiskAssessmentDashboard: React.FC<RiskAssessmentDashboardProps> = ({ 
  onStartAssessment 
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-1">EU AI Act Compliance Platform</h2>
        <p className="text-sm text-muted-foreground mb-4">Current language: English</p>
        
        <div className="mb-6">
          <p className="text-sm">
            Detailed guides and documentation to help you understand and implement EU AI Act risk assessments
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-base font-semibold mb-1">Assessment Methodology</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Step-by-step process for conducting risk assessments
          </p>
          <p className="text-sm">
            Learn about the methodology for conducting a comprehensive risk assessment of AI systems, including risk identification, analysis, evaluation, and mitigation.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-base font-semibold mb-1">High-Risk System Requirements</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Compliance requirements for high-risk AI systems
          </p>
          <p className="text-sm">
            Detailed explanation of the specific requirements that apply to high-risk AI systems under the EU AI Act, including risk management, data governance, and human oversight.
          </p>
        </div>
        
        <Button 
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          View Guide
        </Button>
      </Card>
    </div>
  );
};

export default RiskAssessmentDashboard;