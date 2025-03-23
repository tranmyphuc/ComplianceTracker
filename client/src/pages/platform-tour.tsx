
import React from 'react';
import { PageHeader } from '../components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const PlatformTour = () => {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Platform Tour"
        description="Get to know the EU AI Act Compliance Platform"
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Welcome to SGH Asia Platform</CardTitle>
          <CardDescription>
            This guided tour will walk you through the key features of the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium">Step 1: Dashboard Overview</h3>
            <p className="text-muted-foreground mt-2">
              The dashboard provides a comprehensive view of your AI systems compliance status, 
              risk assessment metrics, and upcoming deadlines.
            </p>
            <Button variant="outline" className="mt-3">View Dashboard</Button>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium">Step 2: AI System Registration</h3>
            <p className="text-muted-foreground mt-2">
              Register your AI systems to manage their compliance with the EU AI Act requirements.
            </p>
            <Button variant="outline" className="mt-3">Register System</Button>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium">Step 3: Risk Assessment</h3>
            <p className="text-muted-foreground mt-2">
              Evaluate and classify your AI systems based on EU AI Act criteria.
            </p>
            <Button variant="outline" className="mt-3">Try Risk Assessment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformTour;
