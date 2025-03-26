import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, FileText } from "lucide-react";
import { Link } from 'wouter';
import { Separator } from '@/components/ui/separator';

interface RiskAssessmentDashboardProps {
  onStartAssessment?: () => void;
}

export const RiskAssessmentDashboard: React.FC<RiskAssessmentDashboardProps> = ({ 
  onStartAssessment 
}) => {
  // Jack's EU AI Act Risk Assessment Requirements content
  const aiActRequirements = {
    title: "Jack's Tip: EU AI Act Risk Assessment Requirements",
    text: "Under the EU AI Act, all high-risk AI systems require a comprehensive risk assessment before deployment. Ensure you capture all needed information in this assessment.",
    relevantArticles: ["Article 9", "Article 10", "Article 17"]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Risk Assessment</h1>
        <p className="text-muted-foreground">Evaluate and classify AI systems based on EU AI Act requirements</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href="/risk-assessment/text-analyzer">
            <FileText className="h-4 w-4" />
            Text Risk Analyzer
          </Link>
        </Button>
        <Button className="flex items-center gap-2" asChild>
          <Link href="/register-system">
            <ArrowRight className="h-4 w-4" />
            Register New System
          </Link>
        </Button>
      </div>

      <Card className="border-muted bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/1000048340-modified.png" 
              alt="Jack" 
              className="w-6 h-6 rounded-full"
            />
            <CardTitle className="text-base font-medium">{aiActRequirements.title}</CardTitle>
          </div>
          <CardDescription className="pt-1">
            {aiActRequirements.text}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-3">
          <p className="text-sm text-muted-foreground font-medium">Relevant Articles:</p>
          <div className="flex gap-2 mt-1">
            {aiActRequirements.relevantArticles.map((article, index) => (
              <div key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-sm">
                {article}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Risk Assessment Report</CardTitle>
            <CardDescription>System compliance status and requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Comprehensive overview of your AI systems' risk levels and compliance status with the EU AI Act requirements
            </p>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Assessment Methodology</h3>
              <p className="text-xs text-muted-foreground">
                Step-by-step process for conducting risk assessments
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Risk Categories</h3>
              <div className="flex gap-2 mt-1">
                <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-sm">High</div>
                <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-sm">Limited</div>
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-sm">Minimal</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">High-Risk System Requirements</h3>
              <p className="text-xs text-muted-foreground">
                Compliance requirements for high-risk AI systems
              </p>
              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                <li>Risk management system</li>
                <li>Data governance measures</li>
                <li>Technical documentation</li>
                <li>Human oversight capabilities</li>
              </ul>
            </div>
            
            <Button variant="outline" className="w-full" size="sm">
              View Assessment Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessmentDashboard;