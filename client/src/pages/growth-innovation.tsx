
import React from 'react';
import { PageHeader } from '../components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const GrowthInnovation = () => {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Growth & Innovation"
        description="Drive business growth through AI innovation"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Innovation Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track and manage upcoming AI innovations and developments.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Identify new business opportunities enabled by AI technologies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrowthInnovation;
