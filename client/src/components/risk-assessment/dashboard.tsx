import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from 'wouter';

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

      <Card className="border-muted bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <img 
                src="/assets/1000048340-modified.png" 
                alt="Jack" 
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">Jack's Tip: EU AI Act Risk Assessment Requirements</h3>
              <p className="text-sm text-muted-foreground">
                Under the EU AI Act, all high-risk AI systems require a comprehensive risk assessment before deployment. Ensure you capture all needed information in this assessment.
              </p>
              <div className="flex gap-2 mt-2">
                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-sm">Article 9</div>
                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-sm">Article 16</div>
                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-sm">Article 17</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-muted bg-card/50">
        <CardContent className="p-0">
          <div className="bg-yellow-300 p-4">
            <h2 className="text-lg font-medium">EU AI Act Compliance Platform</h2>
            <p className="text-sm">Current language: English</p>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-sm">
              Detailed guides and documentation to help you understand and implement EU AI Act risk assessments
            </p>
            
            <div className="space-y-2">
              <h3 className="text-base font-medium">Assessment Methodology</h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step process for conducting risk assessments
              </p>
              <p className="text-sm mt-2">
                Learn about the methodology for conducting a comprehensive risk assessment of AI systems, including risk identification, analysis, evaluation, and mitigation.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-medium">High-Risk System Requirements</h3>
              <p className="text-sm text-muted-foreground">
                Compliance requirements for high-risk AI systems
              </p>
              <p className="text-sm mt-2">
                Detailed explanation of the specific requirements that apply to high-risk AI systems under the EU AI Act, including risk management, data governance, and human oversight.
              </p>
            </div>
            
            <Button variant="primary" className="bg-blue-800 text-white hover:bg-blue-700">
              View Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentDashboard;