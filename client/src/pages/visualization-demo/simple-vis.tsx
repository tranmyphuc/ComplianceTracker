import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

/**
 * Simple visualization demo page without the Three.js compatibility issues
 * Using standard web technologies instead of Three.js for now
 */
export default function SimpleVisualizationDemo() {
  const [activeTab, setActiveTab] = useState('risk-heatmap');

  // Sample risk data
  const riskData = [
    { id: 'risk-1', name: 'Data Privacy Breach', impact: 9, likelihood: 6, category: 'Data Protection' },
    { id: 'risk-2', name: 'Biased Decision Making', impact: 8, likelihood: 7, category: 'Fairness' },
    { id: 'risk-3', name: 'System Vulnerability', impact: 7, likelihood: 4, category: 'Security' },
    { id: 'risk-4', name: 'Documentation Gap', impact: 5, likelihood: 8, category: 'Compliance' },
    { id: 'risk-5', name: 'Algorithm Opacity', impact: 6, likelihood: 5, category: 'Transparency' },
    { id: 'risk-6', name: 'Inadequate Testing', impact: 7, likelihood: 7, category: 'Quality' }
  ];

  // Sample timeline data
  const timelineData = [
    {
      id: 'event-1',
      date: '2025-01-15',
      title: 'AI Act Adoption',
      description: 'Official adoption of the EU AI Act regulation',
      complianceScore: 10,
      type: 'milestone',
      status: 'completed'
    },
    {
      id: 'event-2',
      date: '2025-04-10',
      title: 'Gap Analysis Completion',
      description: 'Initial assessment of compliance gaps completed',
      complianceScore: 40,
      type: 'assessment',
      status: 'completed'
    },
    {
      id: 'event-3',
      date: '2025-06-01',
      title: 'Risk Management Framework',
      description: 'Implementation of risk assessment methodology',
      complianceScore: 60,
      type: 'implementation',
      status: 'completed'
    },
    {
      id: 'event-4',
      date: '2025-11-15',
      title: 'Full Compliance Deadline',
      description: 'Deadline for achieving full EU AI Act compliance',
      complianceScore: 80,
      type: 'deadline',
      status: 'pending'
    }
  ];

  // Simplified 2D risk heatmap using SVG
  const RiskHeatmap = () => {
    const width = 600;
    const height = 400; 
    const padding = 50;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;
    
    return (
      <div className="risk-heatmap">
        <svg width={width} height={height}>
          {/* Background grid */}
          <rect 
            x={padding} 
            y={padding} 
            width={innerWidth} 
            height={innerHeight}
            fill="#f8f9fa"
            stroke="#ddd"
          />
          
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(pos => (
            <React.Fragment key={`grid-v-${pos}`}>
              <line 
                x1={padding + innerWidth * pos} 
                y1={padding} 
                x2={padding + innerWidth * pos} 
                y2={padding + innerHeight}
                stroke="#ddd"
                strokeDasharray="5,5"
              />
              <line 
                x1={padding} 
                y1={padding + innerHeight * pos} 
                x2={padding + innerWidth} 
                y2={padding + innerHeight * pos}
                stroke="#ddd"
                strokeDasharray="5,5"
              />
            </React.Fragment>
          ))}
          
          {/* Axes */}
          <line 
            x1={padding} 
            y1={padding + innerHeight} 
            x2={padding + innerWidth} 
            y2={padding + innerHeight}
            stroke="#000"
            strokeWidth={2}
          />
          <line 
            x1={padding} 
            y1={padding + innerHeight} 
            x2={padding} 
            y2={padding}
            stroke="#000"
            strokeWidth={2}
          />
          
          {/* X axis labels */}
          <text 
            x={padding + innerWidth / 2} 
            y={padding + innerHeight + 40}
            textAnchor="middle"
            fontSize={14}
          >
            Likelihood
          </text>
          {[0, 2, 4, 6, 8, 10].map(value => (
            <text 
              key={`x-label-${value}`}
              x={padding + (value / 10) * innerWidth} 
              y={padding + innerHeight + 20}
              textAnchor="middle"
              fontSize={12}
            >
              {value}
            </text>
          ))}
          
          {/* Y axis labels */}
          <text 
            x={padding - 40} 
            y={padding + innerHeight / 2}
            textAnchor="middle"
            fontSize={14}
            transform={`rotate(-90, ${padding - 40}, ${padding + innerHeight / 2})`}
          >
            Impact
          </text>
          {[0, 2, 4, 6, 8, 10].map(value => (
            <text 
              key={`y-label-${value}`}
              x={padding - 10} 
              y={padding + innerHeight - (value / 10) * innerHeight}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize={12}
            >
              {value}
            </text>
          ))}
          
          {/* Risk zones */}
          <rect 
            x={padding + innerWidth * 0.7} 
            y={padding}
            width={innerWidth * 0.3} 
            height={innerHeight * 0.3}
            fill="rgba(255, 0, 0, 0.2)"
          />
          <rect 
            x={padding + innerWidth * 0.7} 
            y={padding + innerHeight * 0.3}
            width={innerWidth * 0.3} 
            height={innerHeight * 0.4}
            fill="rgba(255, 180, 0, 0.2)"
          />
          <rect 
            x={padding + innerWidth * 0.3} 
            y={padding}
            width={innerWidth * 0.4} 
            height={innerHeight * 0.3}
            fill="rgba(255, 180, 0, 0.2)"
          />
          <rect 
            x={padding} 
            y={padding}
            width={innerWidth * 0.3} 
            height={innerHeight * 0.3}
            fill="rgba(0, 180, 0, 0.2)"
          />
          <rect 
            x={padding} 
            y={padding + innerHeight * 0.3}
            width={innerWidth * 0.7} 
            height={innerHeight * 0.7}
            fill="rgba(0, 180, 0, 0.2)"
          />
          
          {/* Risk points */}
          {riskData.map(risk => {
            const x = padding + (risk.likelihood / 10) * innerWidth;
            const y = padding + innerHeight - (risk.impact / 10) * innerHeight;
            const score = (risk.impact * risk.likelihood) / 100;
            let color;
            if (score > 0.7) color = "red";
            else if (score > 0.5) color = "orange";
            else color = "green";
            
            return (
              <g key={risk.id}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r={10}
                  fill={color}
                  opacity={0.7}
                />
                <text 
                  x={x} 
                  y={y + 25}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#333"
                >
                  {risk.name.length > 15 ? risk.name.substring(0, 15) + '...' : risk.name}
                </text>
              </g>
            );
          })}
          
          {/* Legend */}
          <text x={padding + 10} y={padding + 20} fontSize={12} fill="#333">Risk Zones:</text>
          <rect x={padding + 10} y={padding + 30} width={12} height={12} fill="rgba(255, 0, 0, 0.2)" stroke="#999" />
          <text x={padding + 30} y={padding + 40} fontSize={10} fill="#333">High</text>
          <rect x={padding + 10} y={padding + 50} width={12} height={12} fill="rgba(255, 180, 0, 0.2)" stroke="#999" />
          <text x={padding + 30} y={padding + 60} fontSize={10} fill="#333">Medium</text>
          <rect x={padding + 10} y={padding + 70} width={12} height={12} fill="rgba(0, 180, 0, 0.2)" stroke="#999" />
          <text x={padding + 30} y={padding + 80} fontSize={10} fill="#333">Low</text>
        </svg>
      </div>
    );
  };

  // Simplified timeline visualization using SVG
  const ComplianceTimeline = () => {
    const width = 600;
    const height = 300;
    const padding = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - padding.left - padding.right;
    
    // Sort events chronologically
    const sortedEvents = [...timelineData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate date range
    const startDate = new Date(sortedEvents[0].date);
    const endDate = new Date(sortedEvents[sortedEvents.length - 1].date);
    const timeRange = endDate.getTime() - startDate.getTime();
    
    // Position events on timeline
    const getPosition = (dateStr: string) => {
      const date = new Date(dateStr);
      const position = (date.getTime() - startDate.getTime()) / timeRange;
      return padding.left + position * innerWidth;
    };
    
    return (
      <div className="compliance-timeline">
        <svg width={width} height={height}>
          {/* Timeline line */}
          <line 
            x1={padding.left} 
            y1={padding.top + 100} 
            x2={padding.left + innerWidth} 
            y2={padding.top + 100}
            stroke="#000"
            strokeWidth={2}
          />
          
          {/* Events */}
          {sortedEvents.map((event, index) => {
            const x = getPosition(event.date);
            const shape = (() => {
              switch(event.type) {
                case 'milestone':
                  return <circle cx={x} cy={padding.top + 100} r={8} fill="#9C27B0" />;
                case 'deadline':
                  return <rect x={x-8} y={padding.top + 92} width={16} height={16} fill="#FF9800" />;
                case 'assessment':
                  return (
                    <polygon 
                      points={`${x},${padding.top + 92} ${x+8},${padding.top + 108} ${x-8},${padding.top + 108}`} 
                      fill="#03A9F4" 
                    />
                  );
                case 'implementation':
                  return (
                    <polygon 
                      points={`${x-8},${padding.top + 92} ${x+8},${padding.top + 92} ${x},${padding.top + 108}`} 
                      fill="#4CAF50" 
                    />
                  );
                default:
                  return <circle cx={x} cy={padding.top + 100} r={8} fill="#9E9E9E" />;
              }
            })();
            
            // Status indicator
            const statusColor = (() => {
              switch(event.status) {
                case 'completed': return '#4CAF50';
                case 'in-progress': return '#2196F3';
                case 'overdue': return '#F44336';
                default: return '#9E9E9E';
              }
            })();
            
            return (
              <g key={event.id}>
                {/* Event shape */}
                {shape}
                
                {/* Status indicator */}
                <circle cx={x} cy={padding.top + 120} r={4} fill={statusColor} />
                
                {/* Event label */}
                <text 
                  x={x} 
                  y={padding.top + 80}
                  textAnchor="middle"
                  fontSize={10}
                  transform={`rotate(-30, ${x}, ${padding.top + 80})`}
                >
                  {event.title}
                </text>
                
                {/* Date label */}
                <text 
                  x={x} 
                  y={padding.top + 140}
                  textAnchor="middle"
                  fontSize={10}
                >
                  {new Date(event.date).toLocaleDateString()}
                </text>
                
                {/* Compliance score */}
                <text 
                  x={x} 
                  y={padding.top + 160}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#666"
                >
                  {event.complianceScore}% compliance
                </text>
              </g>
            );
          })}
          
          {/* Timeline labels */}
          <text 
            x={padding.left} 
            y={padding.top + 180}
            textAnchor="middle"
            fontSize={12}
          >
            {startDate.toLocaleDateString()}
          </text>
          <text 
            x={padding.left + innerWidth} 
            y={padding.top + 180}
            textAnchor="middle"
            fontSize={12}
          >
            {endDate.toLocaleDateString()}
          </text>
          
          {/* Legend */}
          <circle cx={padding.left + 20} cy={padding.top + 210} r={6} fill="#9C27B0" />
          <text x={padding.left + 35} y={padding.top + 213} fontSize={10}>Milestone</text>
          
          <rect x={padding.left + 100} y={padding.top + 204} width={12} height={12} fill="#FF9800" />
          <text x={padding.left + 120} y={padding.top + 213} fontSize={10}>Deadline</text>
          
          <polygon points={`${padding.left + 180},${padding.top + 204} ${padding.left + 188},${padding.top + 216} ${padding.left + 172},${padding.top + 216}`} fill="#03A9F4" />
          <text x={padding.left + 195} y={padding.top + 213} fontSize={10}>Assessment</text>
          
          <polygon points={`${padding.left + 270},${padding.top + 204} ${padding.left + 286},${padding.top + 204} ${padding.left + 278},${padding.top + 216}`} fill="#4CAF50" />
          <text x={padding.left + 290} y={padding.top + 213} fontSize={10}>Implementation</text>
        </svg>
      </div>
    );
  };

  // Requirements visualization using a simple force-directed layout simulation
  const RequirementDiagram = () => {
    const width = 600;
    const height = 400;
    
    // Define the requirement interface
    interface Requirement {
      id: string;
      name: string;
      category: string;
      completed: boolean;
      dependsOn?: string[];
    }
    
    // Simplified requirements data
    const requirements: Requirement[] = [
      { id: 'req-1', name: 'Risk Management', category: 'governance', completed: true },
      { id: 'req-2', name: 'Data Governance', category: 'technical', completed: true, dependsOn: ['req-1'] },
      { id: 'req-3', name: 'Documentation', category: 'documentation', completed: false, dependsOn: ['req-2'] },
      { id: 'req-4', name: 'Transparency', category: 'transparency', completed: false, dependsOn: ['req-2'] },
      { id: 'req-5', name: 'Human Oversight', category: 'governance', completed: true, dependsOn: ['req-1'] },
      { id: 'req-6', name: 'Record Keeping', category: 'documentation', completed: false, dependsOn: ['req-3'] }
    ];
    
    // Pre-calculated positions (normally would be computed with force simulation)
    const positions: Record<string, { x: number; y: number }> = {
      'req-1': { x: width / 2, y: 80 },
      'req-2': { x: width / 2, y: 160 },
      'req-3': { x: width / 3, y: 240 },
      'req-4': { x: 2 * width / 3, y: 240 },
      'req-5': { x: width / 4, y: 160 },
      'req-6': { x: width / 3, y: 320 }
    };
    
    // Get node color based on category and completion status
    const getNodeColor = (requirement: typeof requirements[0]) => {
      if (requirement.completed) return '#4CAF50';
      
      switch (requirement.category) {
        case 'governance': return '#673AB7';
        case 'technical': return '#2196F3';
        case 'documentation': return '#FFC107';
        case 'transparency': return '#E91E63';
        default: return '#9E9E9E';
      }
    };
    
    return (
      <div className="requirement-diagram">
        <svg width={width} height={height}>
          {/* Draw connections between nodes first */}
          {requirements
            .filter(req => req.dependsOn && req.dependsOn.length > 0)
            .map(req => 
              req.dependsOn!.map(depId => {
                const source = positions[req.id];
                const target = positions[depId];
                
                return (
                  <line 
                    key={`${req.id}-${depId}`}
                    x1={source.x} 
                    y1={source.y} 
                    x2={target.x} 
                    y2={target.y}
                    stroke="#999"
                    strokeWidth={1.5}
                    strokeDasharray={req.completed ? undefined : "5,5"}
                  />
                );
              })
            )
          }
          
          {/* Draw nodes on top of connections */}
          {requirements.map(req => {
            const pos = positions[req.id];
            return (
              <g key={req.id}>
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r={20}
                  fill={getNodeColor(req)}
                  stroke="#333"
                  strokeWidth={1}
                />
                <text 
                  x={pos.x} 
                  y={pos.y + 45}
                  textAnchor="middle"
                  fontSize={12}
                >
                  {req.name}
                </text>
              </g>
            );
          })}
          
          {/* Legend */}
          <g transform={`translate(${width - 150}, 20)`}>
            <text fontSize={12} fontWeight="bold">Categories:</text>
            
            <circle cx={10} cy={30} r={6} fill="#673AB7" />
            <text x={25} y={34} fontSize={10}>Governance</text>
            
            <circle cx={10} cy={50} r={6} fill="#2196F3" />
            <text x={25} y={54} fontSize={10}>Technical</text>
            
            <circle cx={10} cy={70} r={6} fill="#FFC107" />
            <text x={25} y={74} fontSize={10}>Documentation</text>
            
            <circle cx={10} cy={90} r={6} fill="#E91E63" />
            <text x={25} y={94} fontSize={10}>Transparency</text>
            
            <circle cx={10} cy={110} r={6} fill="#4CAF50" />
            <text x={25} y={114} fontSize={10}>Completed</text>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">2D Visualization Demo</h1>
          <p className="text-muted-foreground mt-2">
            Interactive 2D visualizations for EU AI Act compliance data
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
                <CardTitle>Risk Assessment Heatmap</CardTitle>
                <CardDescription>
                  Visualize risks by impact, likelihood, and calculated risk score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RiskHeatmap />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Color intensity indicates risk level. Position shows impact and likelihood.
                </p>
                <Button variant="outline">Export View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="compliance-timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Timeline</CardTitle>
                <CardDescription>
                  Track compliance progress and upcoming deadlines on an interactive timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplianceTimeline />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Different shapes represent different event types. Colors show status.
                </p>
                <Button variant="outline">Export View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="requirement-map" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirement Relationship Map</CardTitle>
                <CardDescription>
                  Explore relationships between different EU AI Act requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequirementDiagram />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Connections show dependencies between requirements. Colors represent categories.
                </p>
                <Button variant="outline">Export View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Note on Visualizations</h3>
          <p>
            These 2D visualizations provide a simpler alternative to the 3D versions while we 
            resolve compatibility issues with Three.js. The 3D versions will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}