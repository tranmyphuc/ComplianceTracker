
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, FileLineChart, AlertTriangle, ShieldCheck } from "lucide-react";
import ComprehensiveRiskAssessment from './comprehensive-assessment';
import RiskAssessmentGuide from './visual-guide';
import RiskAssessmentDashboard from './dashboard';

interface AssessmentResult {
  categoryScores: Record<string, number>;
  overallScore: number;
  riskLevel: 'High' | 'Limited' | 'Minimal';
  recommendations: string[];
}

const RiskAssessmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  
  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
  };
  
  const handleStartAssessment = () => {
    setActiveTab('assessment');
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {assessmentResult && (
        <Card className="mb-6 bg-muted/40">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {assessmentResult.riskLevel === 'High' ? (
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                ) : assessmentResult.riskLevel === 'Limited' ? (
                  <div className="rounded-full bg-amber-100 p-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                ) : (
                  <div className="rounded-full bg-green-100 p-3">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                )}
                
                <div>
                  <h2 className="text-xl font-semibold">
                    {assessmentResult.riskLevel} Risk Level Detected
                  </h2>
                  <p className="text-muted-foreground">
                    Overall compliance score: {Math.round(assessmentResult.overallScore)}/100
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <FileLineChart className="h-4 w-4" />
                  Generate Report
                </Button>
                <Button>View Detailed Results</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="assessment">Assessment Tool</TabsTrigger>
          <TabsTrigger value="guide">Visual Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <RiskAssessmentDashboard onStartAssessment={handleStartAssessment} />
        </TabsContent>
        
        <TabsContent value="assessment">
          <ComprehensiveRiskAssessment onComplete={handleAssessmentComplete} />
        </TabsContent>
        
        <TabsContent value="guide">
          <RiskAssessmentGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskAssessmentPage;
