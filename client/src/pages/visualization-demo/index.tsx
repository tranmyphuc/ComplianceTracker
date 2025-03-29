import React from 'react';
import { ThreeDRiskHeatmap } from '../../components/visualization/3d-risk-heatmap';
import { ThreeDComplianceTimeline } from '../../components/visualization/3d-compliance-timeline';
import { ThreeDRequirementMap } from '../../components/visualization/3d-requirement-map';
import { AppLayout } from '../../components/layout/app-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function VisualizationDemoPage() {
  // Sample data for risk heatmap
  const riskData = [
    {
      id: 'risk-1',
      name: 'Data Privacy Breach',
      impact: 9,
      likelihood: 6,
      category: 'Data Protection'
    },
    {
      id: 'risk-2',
      name: 'Biased Decision Making',
      impact: 8,
      likelihood: 7,
      category: 'Fairness'
    },
    {
      id: 'risk-3',
      name: 'System Vulnerability',
      impact: 7,
      likelihood: 4,
      category: 'Security'
    },
    {
      id: 'risk-4',
      name: 'Documentation Gap',
      impact: 5,
      likelihood: 8,
      category: 'Compliance'
    },
    {
      id: 'risk-5',
      name: 'Algorithm Opacity',
      impact: 6,
      likelihood: 5,
      category: 'Transparency'
    },
    {
      id: 'risk-6',
      name: 'Inadequate Testing',
      impact: 7,
      likelihood: 7,
      category: 'Quality'
    },
    {
      id: 'risk-7',
      name: 'Supply Chain Risk',
      impact: 4,
      likelihood: 3,
      category: 'Operations'
    }
  ];

  // Sample data for compliance timeline
  const timelineData = [
    {
      id: 'event-1',
      date: '2025-01-15',
      title: 'AI Act Adoption',
      description: 'Official adoption of the EU AI Act regulation',
      complianceScore: 10,
      type: 'milestone' as const
    },
    {
      id: 'event-2',
      date: '2025-04-10',
      title: 'Gap Analysis Completion',
      description: 'Initial assessment of compliance gaps completed',
      complianceScore: 40,
      type: 'assessment' as const,
      status: 'completed' as const
    },
    {
      id: 'event-3',
      date: '2025-06-01',
      title: 'Risk Management Framework',
      description: 'Implementation of risk assessment methodology',
      complianceScore: 60,
      type: 'implementation' as const,
      status: 'completed' as const
    },
    {
      id: 'event-4',
      date: '2025-07-15',
      title: 'Technical Documentation Update',
      description: 'Comprehensive update of all technical documentation',
      complianceScore: 75,
      type: 'implementation' as const,
      status: 'in-progress' as const
    },
    {
      id: 'event-5',
      date: '2025-09-01',
      title: 'Third-party Audit',
      description: 'External audit of compliance status',
      complianceScore: 60,
      type: 'assessment' as const,
      status: 'pending' as const
    },
    {
      id: 'event-6',
      date: '2025-11-15',
      title: 'Full Compliance Deadline',
      description: 'Deadline for achieving full EU AI Act compliance',
      complianceScore: 80,
      type: 'deadline' as const,
      status: 'pending' as const
    }
  ];

  // Sample data for requirement map
  const requirementData = [
    {
      id: 'req-1',
      name: 'Risk Management System',
      category: 'governance',
      description: 'Establish a risk management system for continuous identification and analysis of risks',
      completed: true,
      importance: 'high' as const
    },
    {
      id: 'req-2',
      name: 'Data Governance',
      category: 'technical',
      description: 'Implement data governance measures for training, validation and testing datasets',
      completed: true,
      importance: 'high' as const,
      dependencies: ['req-1']
    },
    {
      id: 'req-3',
      name: 'Technical Documentation',
      category: 'documentation',
      description: 'Create and maintain comprehensive technical documentation',
      completed: false,
      importance: 'medium' as const,
      dependencies: ['req-2']
    },
    {
      id: 'req-4',
      name: 'Record Keeping',
      category: 'documentation',
      description: 'Maintain automatic recording of events during operation',
      completed: false,
      importance: 'medium' as const,
      dependencies: ['req-3']
    },
    {
      id: 'req-5',
      name: 'Transparency',
      category: 'transparency',
      description: 'Ensure AI systems are designed to be transparent in operation',
      completed: false,
      importance: 'high' as const,
      dependencies: ['req-2']
    },
    {
      id: 'req-6',
      name: 'Human Oversight',
      category: 'governance',
      description: 'Implement appropriate human oversight measures',
      completed: true,
      importance: 'high' as const,
      dependencies: ['req-1']
    },
    {
      id: 'req-7',
      name: 'Accuracy',
      category: 'technical',
      description: 'Ensure appropriate levels of accuracy for the intended purpose',
      completed: false,
      importance: 'medium' as const,
      dependencies: ['req-2']
    },
    {
      id: 'req-8',
      name: 'Robustness',
      category: 'technical',
      description: 'Ensure resilience against errors, faults, and inconsistencies',
      completed: false,
      importance: 'high' as const,
      dependencies: ['req-7']
    },
    {
      id: 'req-9',
      name: 'Cybersecurity',
      category: 'technical',
      description: 'Implement resilience against attempts to alter use or performance',
      completed: false,
      importance: 'high' as const,
      dependencies: ['req-8']
    },
    {
      id: 'req-10',
      name: 'Conformity Assessment',
      category: 'governance',
      description: 'Complete required conformity assessment procedures',
      completed: false,
      importance: 'high' as const,
      dependencies: ['req-3', 'req-5', 'req-6', 'req-9']
    },
    {
      id: 'req-11',
      name: 'CE Marking',
      category: 'documentation',
      description: 'Affix the CE marking after successful conformity assessment',
      completed: false,
      importance: 'medium' as const,
      dependencies: ['req-10']
    },
    {
      id: 'req-12',
      name: 'Post-market Monitoring',
      category: 'monitoring',
      description: 'Establish and document a post-market monitoring system',
      completed: false,
      importance: 'medium' as const,
      dependencies: ['req-11']
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">3D Visualization Demo</h1>
          <p className="text-muted-foreground mt-2">
            Interactive 3D visualizations for EU AI Act compliance data
          </p>
        </div>

        <Tabs defaultValue="risk-heatmap">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="risk-heatmap">Risk Heatmap</TabsTrigger>
            <TabsTrigger value="compliance-timeline">Compliance Timeline</TabsTrigger>
            <TabsTrigger value="requirement-map">Requirement Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="risk-heatmap" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>3D Risk Assessment Heatmap</CardTitle>
                <CardDescription>
                  Visualize risks by impact, likelihood, and calculated risk score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThreeDRiskHeatmap 
                  data={riskData} 
                  height={500}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Hover over cubes for details. Drag to rotate, scroll to zoom.
                </p>
                <Button variant="outline">Export View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="compliance-timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>3D Compliance Timeline</CardTitle>
                <CardDescription>
                  Track compliance progress and upcoming deadlines in an interactive timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThreeDComplianceTimeline 
                  data={timelineData} 
                  height={500}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Different shapes represent different event types. Height shows compliance score.
                </p>
                <Button variant="outline">Export View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="requirement-map" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>3D Requirement Relationship Map</CardTitle>
                <CardDescription>
                  Explore relationships between different EU AI Act requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThreeDRequirementMap 
                  data={requirementData} 
                  height={600}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Click on a node to highlight its connections. Different colors represent requirement categories.
                </p>
                <Button variant="outline">Export View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}