
import React from 'react';
import { PageHeader } from '../components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Download } from 'react-feather';
import { Button } from '../components/ui/button';

const TrainingDocs = () => {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Training Documentation"
        description="Access comprehensive training materials for EU AI Act compliance"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" size={18} />
              EU AI Act Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Comprehensive overview of the EU AI Act requirements and implications.
            </p>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" size={18} />
              Risk Assessment Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Step-by-step guide for conducting AI system risk assessments.
            </p>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" size={18} />
              Compliance Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Detailed checklist for ensuring AI systems comply with EU requirements.
            </p>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" size={18} />
              Technical Documentation Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Templates for creating technical documentation required by the EU AI Act.
            </p>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download size={16} className="mr-2" />
              Download Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingDocs;
