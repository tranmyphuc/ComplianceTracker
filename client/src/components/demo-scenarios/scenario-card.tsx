
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users } from 'lucide-react';
import { Link } from 'wouter';

export interface ScenarioProps {
  id: string;
  title: string;
  industry: string;
  companySize: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  description: string;
  aiSystems: string[];
}

export const ScenarioCard: React.FC<ScenarioProps> = ({ 
  id, 
  title, 
  industry, 
  companySize, 
  riskLevel, 
  description, 
  aiSystems 
}) => {
  
  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge className={getRiskColor(riskLevel)}>{riskLevel} Risk</Badge>
        </div>
        <CardDescription className="flex items-center gap-2 mt-2">
          <Building className="h-4 w-4" />
          <span>{industry}</span>
          <span className="mx-1">•</span>
          <Users className="h-4 w-4" />
          <span>{companySize}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">AI Systems:</p>
          <div className="flex flex-wrap gap-2">
            {aiSystems.map((system, index) => (
              <Badge key={index} variant="outline" className="bg-primary/10">
                {system}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/demo-scenarios/${id}`}>
            View Scenario
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
