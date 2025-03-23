
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Users, Award } from "lucide-react";

interface TrainingInsightsProps {
  data: {
    totalModules: number;
    completedModules: number;
    inProgressModules: number;
    roleCompletionPercentage: number;
    recentCertificates: {
      id: string;
      title: string;
      date: string;
    }[];
  };
}

export function TrainingInsights({ data }: TrainingInsightsProps) {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Training & Compliance</CardTitle>
            <CardDescription>EU AI Act training progress and certifications</CardDescription>
          </div>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {data.completedModules}/{data.totalModules} Modules
              </span>
            </div>
            <Progress value={(data.completedModules / data.totalModules) * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Role-Specific Compliance</span>
              <span className="text-sm text-muted-foreground">
                {data.roleCompletionPercentage}%
              </span>
            </div>
            <Progress value={data.roleCompletionPercentage} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {data.totalModules} Total
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 bg-primary/10">
                <Award className="h-3 w-3" />
                {data.completedModules} Completed
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/training")}>
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {data.recentCertificates.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <span className="text-sm font-medium block mb-2">Recent Certificates</span>
              <div className="space-y-2">
                {data.recentCertificates.map(cert => (
                  <div key={cert.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Award className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                      {cert.title}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
