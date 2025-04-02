import React, { useState } from "react";
import { ComplianceTooltipWizard } from "./compliance-tooltip-wizard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ComplianceRecommendation {
  id: string;
  articleId: string;
  summary: string;
  complianceLevel: "compliant" | "partial" | "non-compliant" | "not-applicable";
  actionItems: string[];
}

export function WizardDemo() {
  const [recommendations, setRecommendations] = useState<ComplianceRecommendation[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  
  const handleRecommendationsGenerated = (data: ComplianceRecommendation[]) => {
    setRecommendations(data);
    setShowSummary(true);
  };
  
  const getOverallComplianceStatus = () => {
    if (!recommendations.length) return "Unknown";
    
    const nonCompliantCount = recommendations.filter(r => r.complianceLevel === "non-compliant").length;
    const partialCount = recommendations.filter(r => r.complianceLevel === "partial").length;
    const compliantCount = recommendations.filter(r => r.complianceLevel === "compliant").length;
    
    if (nonCompliantCount > 0) {
      return "Major compliance issues detected";
    } else if (partialCount > 0) {
      return "Partial compliance - improvements needed";
    } else if (compliantCount > 0) {
      return "Mostly compliant with recommendations";
    } else {
      return "Compliance status unknown";
    }
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>EU AI Act Compliance Assessment</CardTitle>
          <CardDescription>
            Use the AI-powered compliance wizard to assess your AI system against the EU AI Act requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-2/3 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">AI System Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our AI-powered wizard will analyze your system description and provide article-specific 
                compliance recommendations based on the EU AI Act.
              </p>
              
              <ComplianceTooltipWizard 
                systemDescription="Our HR recruitment AI system uses machine learning to automatically screen job applicants by analyzing their resumes, cover letters, and online profiles. The system ranks candidates based on their qualifications, experience, and predicted cultural fit with the company. It also generates automated responses to applicants and schedules interviews with top candidates."
                onRecommendationsGenerated={handleRecommendationsGenerated}
              />
            </div>
            
            {showSummary && (
              <div className="w-full sm:w-1/3 border rounded-lg p-4">
                <h3 className="font-medium mb-2">Assessment Summary</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {getOverallComplianceStatus()}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Articles Analyzed:</span>
                    <span className="font-medium">{recommendations.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Non-compliant Issues:</span>
                    <span className="font-medium text-red-600">
                      {recommendations.filter(r => r.complianceLevel === "non-compliant").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Partial Compliance:</span>
                    <span className="font-medium text-amber-600">
                      {recommendations.filter(r => r.complianceLevel === "partial").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fully Compliant:</span>
                    <span className="font-medium text-green-600">
                      {recommendations.filter(r => r.complianceLevel === "compliant").length}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    This assessment is based on the provided system description and should be 
                    reviewed by legal and compliance experts.
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => setShowSummary(false)}
                  >
                    Clear Results
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          The compliance wizard is a tool to help you understand your obligations under the EU AI Act.
          It does not provide legal advice and should be used as part of a comprehensive compliance strategy.
        </CardFooter>
      </Card>
    </div>
  );
}