import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Cog, 
  BarChart3, 
  Activity, 
  LineChart, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Users,
  FileText,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Mock data for Operations Excellence
const complianceProcesses = [
  {
    id: 1,
    name: "AI System Registration",
    efficiency: 87,
    status: "Optimized",
    avgTime: "1.2 days",
    taskCount: 14,
    bottlenecks: ["Documentation collection", "Technical review"],
    lastOptimized: "2025-02-15",
  },
  {
    id: 2,
    name: "Risk Assessment",
    efficiency: 72,
    status: "Improvement Needed",
    avgTime: "3.5 days",
    taskCount: 26,
    bottlenecks: ["Expert verification", "Regulatory mapping", "Stakeholder reviews"],
    lastOptimized: "2024-11-08",
  },
  {
    id: 3,
    name: "Compliance Documentation",
    efficiency: 93,
    status: "Optimized",
    avgTime: "0.8 days",
    taskCount: 8,
    bottlenecks: ["Final approvals"],
    lastOptimized: "2025-03-01",
  },
  {
    id: 4,
    name: "Compliance Monitoring",
    efficiency: 65,
    status: "Needs Attention",
    avgTime: "2.1 days",
    taskCount: 18,
    bottlenecks: ["Data collection", "Manual verification", "Reporting"],
    lastOptimized: "2024-09-22",
  },
  {
    id: 5,
    name: "Change Management",
    efficiency: 79,
    status: "Good",
    avgTime: "1.7 days",
    taskCount: 12,
    bottlenecks: ["Impact analysis", "Documentation updates"],
    lastOptimized: "2025-01-10",
  }
];

const resourceUtilization = [
  {
    id: 1,
    resourceType: "Compliance Officers",
    utilizationRate: 88,
    capacity: 12,
    allocated: 10.6,
    trend: "+5%",
    status: "Optimal"
  },
  {
    id: 2,
    resourceType: "Technical Reviewers",
    utilizationRate: 95,
    capacity: 8,
    allocated: 7.6,
    trend: "+12%",
    status: "Over-utilized"
  },
  {
    id: 3,
    resourceType: "Legal Specialists",
    utilizationRate: 72,
    capacity: 5,
    allocated: 3.6,
    trend: "-3%",
    status: "Under-utilized"
  },
  {
    id: 4,
    resourceType: "Documentation Specialists",
    utilizationRate: 90,
    capacity: 6,
    allocated: 5.4,
    trend: "+8%",
    status: "Optimal"
  },
  {
    id: 5,
    resourceType: "Automation Systems",
    utilizationRate: 62,
    capacity: "85 hrs/week",
    allocated: "53 hrs/week",
    trend: "+15%",
    status: "Under-utilized"
  }
];

const optimizationOpportunities = [
  {
    id: 1,
    area: "Technical Review Automation",
    impact: "High",
    effort: "Medium",
    timeToImplement: "4-6 weeks",
    expectedGains: "45% time reduction in reviews",
    description: "Implement AI-assisted preliminary technical reviews to reduce manual effort and time spent"
  },
  {
    id: 2,
    area: "Documentation Generation",
    impact: "Medium",
    effort: "Low",
    timeToImplement: "2-3 weeks",
    expectedGains: "70% reduction in documentation time",
    description: "Enhance automated documentation generation with improved templates and pre-filled sections"
  },
  {
    id: 3,
    area: "Compliance Monitoring Automation",
    impact: "High",
    effort: "High",
    timeToImplement: "8-10 weeks",
    expectedGains: "60% less manual monitoring",
    description: "Implement continuous automated monitoring for regulatory compliance with real-time alerts"
  },
  {
    id: 4,
    area: "Assessment Workflow Optimization",
    impact: "Medium",
    effort: "Medium",
    timeToImplement: "5-7 weeks",
    expectedGains: "30% faster end-to-end assessments",
    description: "Redesign assessment workflows to eliminate redundancies and improve parallel processing"
  },
  {
    id: 5,
    area: "Integration with Enterprise Systems",
    impact: "High",
    effort: "Medium",
    timeToImplement: "6-8 weeks",
    expectedGains: "50% reduction in data entry",
    description: "Improve integrations with existing enterprise systems to reduce manual data transfer and duplication"
  }
];

// Process Efficiency Dashboard Component
const ProcessDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Process Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">79.2%</div>
          <Progress value={79.2} className="h-2 mt-2" />
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +8.5% from previous quarter
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Compliance Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.86 days</div>
          <p className="text-xs text-muted-foreground">per system registration</p>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            -0.4 days from target
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Process Automation Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">62%</div>
          <Progress value={62} className="h-2 mt-2" />
          <div className="mt-4 flex items-center text-sm text-amber-600">
            <Clock className="mr-1 h-4 w-4" />
            13% below target
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Compliance Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94.8%</div>
          <Progress value={94.8} className="h-2 mt-2" />
          <div className="mt-4 text-sm">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Exceeds Target</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Process Efficiency Trends</CardTitle>
        <CardDescription>Performance trends for key compliance processes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center bg-neutral-50 rounded-md border mb-4">
          <div className="text-center">
            <LineChart className="h-16 w-16 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Process efficiency visualization would appear here</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {complianceProcesses.slice(0, 3).map((process) => (
            <div key={process.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">{process.name}</div>
                <div className="text-sm">{process.efficiency}%</div>
              </div>
              <Progress 
                value={process.efficiency} 
                className={`h-2 ${
                  process.efficiency >= 85 ? 'bg-green-100' : 
                  process.efficiency >= 75 ? 'bg-blue-100' : 
                  process.efficiency >= 65 ? 'bg-amber-100' : 'bg-red-100'
                }`} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Process Efficiency Component
const ProcessEfficiency = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Compliance Processes</h3>
        <p className="text-sm text-muted-foreground">Current efficiency metrics for key processes</p>
      </div>
      <Select defaultValue="efficiency">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="efficiency">Highest Efficiency</SelectItem>
          <SelectItem value="time">Shortest Time</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="space-y-4">
      {complianceProcesses.map((process) => (
        <Card key={process.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-base">{process.name}</CardTitle>
                <CardDescription>{process.taskCount} tasks, avg. {process.avgTime} completion time</CardDescription>
              </div>
              <Badge 
                variant="outline"
                className={
                  process.status === "Optimized" 
                    ? "bg-green-100 text-green-800" 
                    : process.status === "Good"
                    ? "bg-blue-100 text-blue-800"
                    : process.status === "Improvement Needed"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {process.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm">Process Efficiency</div>
              <div className="text-sm font-medium">{process.efficiency}%</div>
            </div>
            <Progress 
              value={process.efficiency} 
              className={`h-3 ${
                process.efficiency >= 85 ? 'bg-green-100' : 
                process.efficiency >= 75 ? 'bg-blue-100' : 
                process.efficiency >= 65 ? 'bg-amber-100' : 'bg-red-100'
              }`} 
            />
            
            {process.bottlenecks.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Current Bottlenecks:</p>
                <div className="flex flex-wrap gap-1">
                  {process.bottlenecks.map((bottleneck, i) => (
                    <Badge key={i} variant="outline" className="bg-amber-50">{bottleneck}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-neutral-50 text-sm flex justify-between">
            <p>Last optimized: {new Date(process.lastOptimized).toLocaleDateString()}</p>
            <Button size="sm" variant="outline">Optimize Process</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

// Resource Utilization Component
const ResourceUtilization = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Resource Utilization</h3>
        <p className="text-sm text-muted-foreground">Current utilization of compliance resources</p>
      </div>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-neutral-50 rounded-md border mb-4">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Resource allocation visualization would appear here</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {resourceUtilization.map((resource) => (
            <div key={resource.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{resource.resourceType}</div>
                  <div className="text-sm text-muted-foreground">
                    Allocated: {resource.allocated} / {resource.capacity} capacity
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={
                    resource.status === "Optimal" 
                      ? "bg-green-100 text-green-800" 
                      : resource.status === "Under-utilized"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {resource.status}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Progress 
                  value={resource.utilizationRate} 
                  className={`h-3 flex-1 ${
                    resource.status === "Optimal" 
                      ? 'bg-green-100' : 
                      resource.status === "Under-utilized" 
                      ? 'bg-blue-100' 
                      : 'bg-red-100'
                  }`} 
                />
                <span className="text-sm font-medium w-16">{resource.utilizationRate}%</span>
                <span className={`text-sm w-16 ${
                  resource.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {resource.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Rebalance Resources</Button>
        <Button>Optimize Allocation</Button>
      </CardFooter>
    </Card>
  </div>
);

// Optimization Opportunities Component
const OptimizationOpportunities = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Optimization Opportunities</h3>
        <p className="text-sm text-muted-foreground">Identified opportunities for process improvement</p>
      </div>
      <Select defaultValue="impact">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="impact">Highest Impact</SelectItem>
          <SelectItem value="effort">Lowest Effort</SelectItem>
          <SelectItem value="time">Quickest Implementation</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {optimizationOpportunities.map((opportunity) => (
        <Card key={opportunity.id}>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-base">{opportunity.area}</CardTitle>
              <Badge 
                variant={opportunity.impact === "High" ? "default" : "outline"}
                className={
                  opportunity.impact === "High" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : ""
                }
              >
                {opportunity.impact} Impact
              </Badge>
            </div>
            <CardDescription>{opportunity.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Implementation Effort</p>
                <Badge 
                  variant="outline"
                  className={
                    opportunity.effort === "Low" 
                      ? "bg-green-50" 
                      : opportunity.effort === "Medium"
                      ? "bg-amber-50"
                      : "bg-red-50"
                  }
                >
                  {opportunity.effort}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time to Implement</p>
                <p className="text-sm font-medium">{opportunity.timeToImplement}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Expected Benefits</p>
              <p className="text-sm font-medium text-green-600">{opportunity.expectedGains}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">View Details</Button>
            <Button size="sm">Implement</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

// Main Operations Excellence Component
export default function OperationsExcellence() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Operations Excellence</h1>
          <p className="text-muted-foreground">
            Optimize compliance processes and resource utilization
          </p>
        </div>
        <Button>
          <Cog className="mr-2 h-4 w-4" />
          Process Optimization
        </Button>
      </div>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">
            <Activity className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="processes">
            <Cog className="h-4 w-4 mr-2" />
            Process Efficiency
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Users className="h-4 w-4 mr-2" />
            Resource Utilization
          </TabsTrigger>
          <TabsTrigger value="optimization">
            <Zap className="h-4 w-4 mr-2" />
            Optimization Opportunities
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <ProcessDashboard />
        </TabsContent>
        
        <TabsContent value="processes" className="mt-0">
          <ProcessEfficiency />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-0">
          <ResourceUtilization />
        </TabsContent>
        
        <TabsContent value="optimization" className="mt-0">
          <OptimizationOpportunities />
        </TabsContent>
      </Tabs>
    </div>
  );
}