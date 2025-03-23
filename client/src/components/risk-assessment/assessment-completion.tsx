
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ArrowRight, ShieldAlert } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface AssessmentCompletionProps {
  assessmentId: string;
  systemId: string;
  systemName: string;
  riskLevel: string;
  date: string;
}

export function AssessmentCompletion({ 
  assessmentId, 
  systemId, 
  systemName,
  riskLevel,
  date
}: AssessmentCompletionProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <CardTitle>Assessment Completed</CardTitle>
        </div>
        <CardDescription>
          Your risk assessment has been completed successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-white p-4 dark:bg-gray-950">
          <h3 className="font-medium mb-2">Assessment Summary</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-muted-foreground">System Name:</div>
            <div className="font-medium">{systemName}</div>
            <div className="text-muted-foreground">Risk Level:</div>
            <div className="font-medium">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' :
                riskLevel === 'limited' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400' :
                'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
              }`}>
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </span>
            </div>
            <div className="text-muted-foreground">Date:</div>
            <div className="font-medium">{date}</div>
            <div className="text-muted-foreground">Assessment ID:</div>
            <div className="font-medium truncate max-w-[180px]">{assessmentId}</div>
          </div>
        </div>
        
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Next Step: Risk Management</h3>
              <p className="text-sm text-muted-foreground">
                To manage the identified risks, create risk controls, and monitor potential risk events, 
                proceed to the Risk Management section for this system.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-3 w-full justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/systems/${systemId}`)}
          >
            View System
          </Button>
          <Button 
            onClick={() => navigate(`/risk-management/${systemId}`)}
            className="gap-1"
          >
            <ShieldAlert className="h-4 w-4" />
            Go to Risk Management
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AssessmentCompletion;
