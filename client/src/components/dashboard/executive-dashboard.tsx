import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowUpRight, LightbulbIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// EU AI Act Compliance Component (from your existing component)
const EUAIActCompliance: React.FC = () => {
  return (
    <Card className="rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-1">EU AI Act Compliance Platform</h2>
      <p className="text-sm text-muted-foreground mb-4">Current language: English</p>
      
      <div className="mb-6">
        <p className="text-sm">
          Detailed guides and documentation to help you understand and implement EU AI Act risk assessments
        </p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1">Assessment Methodology</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Step-by-step process for conducting risk assessments
        </p>
        <p className="text-sm">
          Learn about the methodology for conducting a comprehensive risk assessment of AI systems, including risk identification, analysis, evaluation, and mitigation.
        </p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1">High-Risk System Requirements</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Compliance requirements for high-risk AI systems
        </p>
        <p className="text-sm">
          Detailed explanation of the specific requirements that apply to high-risk AI systems under the EU AI Act, including risk management, data governance, and human oversight.
        </p>
      </div>
      
      <Button 
        className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
      >
        View Guide
      </Button>
    </Card>
  );
};

// Main Dashboard Component
export const ExecutiveDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Executive Intelligence Dashboard</h1>
        <p className="text-muted-foreground">AI-powered insights for strategic decision making</p>
        <p className="text-sm mt-2">Good afternoon, Admin. Here's your business overview for {formattedDate}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Business Overview</TabsTrigger>
          <TabsTrigger value="compliance">EU AI Act Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Monthly Revenue */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                    <h3 className="text-2xl font-bold">€4.2M</h3>
                  </div>
                  <span className="text-green-500 text-xs">↑ 12%</span>
                </div>
                <Progress className="h-2 mt-4" value={80} />
                <p className="text-xs mt-2 text-muted-foreground">
                  <span className="text-green-500">6% above forecast</span>
                </p>
              </CardContent>
            </Card>

            {/* Operational Efficiency */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Operational Efficiency</p>
                  </div>
                  <span className="text-green-500 text-xs">↑ 5%</span>
                </div>
                <div className="flex justify-center items-center my-4 relative">
                  <div className="w-24 h-24 rounded-full border-8 border-blue-500 flex items-center justify-center">
                    <span className="text-xl font-bold">87%</span>
                  </div>
                </div>
                <p className="text-xs mt-1 text-muted-foreground text-center">
                  <span className="text-green-500">Improved in 3 key areas</span>
                </p>
              </CardContent>
            </Card>

            {/* Market Share */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Market Share</p>
                    <h3 className="text-2xl font-bold">32%</h3>
                  </div>
                  <span className="text-green-500 text-xs">↑ 2%</span>
                </div>
                <div className="mt-4 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }}></div>
                  <div className="h-full bg-green-400 rounded-full -mt-2" style={{ width: "15%" }}></div>
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  <span className="text-blue-500">Leading in 2 segments</span>
                </p>
              </CardContent>
            </Card>

            {/* EU AI Act Compliance */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">EU AI Act Compliance</p>
                    <h3 className="text-2xl font-bold">92%</h3>
                  </div>
                  <span className="text-green-500 text-xs">↑ 8%</span>
                </div>
                <Progress className="h-2 mt-4" value={92} />
                <p className="text-xs mt-2 text-muted-foreground">
                  <span className="text-amber-500">5 actions needed</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Strategic Opportunities and Pending Decisions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Strategic Opportunities */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <LightbulbIcon className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold">Strategic Opportunities</h3>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">AI-Generated</span>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium">Market Expansion Opportunity</h4>
                    <p className="text-sm mt-1">EU AI Act regulations create new market for compliance tools and services in the technology sector.</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">High Impact</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">92% Confidence</span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Explore <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="font-medium">Strategic Partnership Potential</h4>
                    <p className="text-sm mt-1">3 potential partners identified that could strengthen your AI compliance offerings in healthcare sector.</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">High Impact</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">87% Confidence</span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Explore <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    View All Insights <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Decisions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Pending Decisions</h3>
                </div>

                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-sm">Risk Assessment Approval</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High Priority</span>
                      <span className="text-xs text-muted-foreground">Due in 2 days</span>
                    </div>
                    <div className="mt-2">
                      <Button size="sm" className="w-full text-xs">Take Action</Button>
                    </div>
                  </div>

                  <div className="border-b pb-3">
                    <h4 className="font-medium text-sm">Compliance Report Review</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Medium Priority</span>
                      <span className="text-xs text-muted-foreground">Marketing</span>
                    </div>
                    <div className="mt-2">
                      <Button size="sm" className="w-full text-xs">Take Action</Button>
                    </div>
                  </div>

                  <div className="pb-2">
                    <h4 className="font-medium text-sm">AI System Registration</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Medium Priority</span>
                      <span className="text-xs text-muted-foreground">Operations</span>
                    </div>
                    <div className="mt-2">
                      <Button size="sm" className="w-full text-xs">Take Action</Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    Manage All Decisions <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance">
          <EUAIActCompliance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;