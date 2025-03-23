import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  TrendingUpIcon, 
  LightbulbIcon, 
  CheckCircleIcon, 
  ArrowRightIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  PlusIcon,
  ClockIcon,
  ExternalLinkIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CircularProgressIndicator as CircularProgress } from "@/components/dashboard/circular-progress";

export function ExecutiveDashboard() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

  // Get current date for personalized welcome message
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Time of day greeting
  const getTimeOfDay = () => {
    const hour = today.getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page title and welcome message */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-neutral-800">Executive Intelligence Dashboard</h1>
        <p className="text-neutral-500">AI-powered insights for strategic decision making</p>
        <p className="text-lg font-medium text-neutral-700 mt-3">
          Good {getTimeOfDay()}, {summary?.user?.displayName || 'User'}. Here's your business overview for {formattedDate}
        </p>
      </div>

      {/* KPI Overview Section - Row of 4 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))
        ) : (
          <>
            {/* Card 1: Business Performance */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Monthly Revenue</span>
                  <div className="flex items-center text-green-500 text-sm font-normal">
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    <span>12%</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">€4.2M</div>
                <div className="h-10 flex items-end">
                  {/* Mini sparkline visualization would go here */}
                  <div className="w-full h-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-md relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-500">
                      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-primary font-medium mt-2 flex items-center">
                  <LightbulbIcon className="h-3 w-3 mr-1" />
                  <span>6% above forecast</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Operational Efficiency */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Operational Efficiency</span>
                  <div className="flex items-center text-green-500 text-sm font-normal">
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    <span>5%</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative mb-2">
                  <CircularProgress value={87} size={80} strokeWidth={8} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">87%</span>
                  </div>
                </div>
                <div className="text-xs text-primary font-medium mt-3 flex items-center">
                  <LightbulbIcon className="h-3 w-3 mr-1" />
                  <span>Improved in 3 key areas</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Market Position */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Market Share</span>
                  <div className="flex items-center text-green-500 text-sm font-normal">
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    <span>3%</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">32%</div>
                <div className="h-8 flex items-end mt-2">
                  {/* Small market share visualization */}
                  <div className="flex w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-l-full"
                      style={{width: "32%"}}
                    ></div>
                    <div 
                      className="bg-orange-400 h-full"
                      style={{width: "28%"}}
                    ></div>
                    <div 
                      className="bg-green-400 h-full"
                      style={{width: "20%"}}
                    ></div>
                    <div 
                      className="bg-gray-300 h-full rounded-r-full"
                      style={{width: "20%"}}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-primary font-medium mt-3 flex items-center">
                  <LightbulbIcon className="h-3 w-3 mr-1" />
                  <span>Leading in 2 segments</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Compliance Status */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>EU AI Act Compliance</span>
                  <div className="flex items-center text-green-500 text-sm font-normal">
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    <span>8%</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <div className="mt-2">
                  <Progress value={92} className="h-3" />
                </div>
                <div className="text-xs text-primary font-medium mt-3 flex items-center">
                  <LightbulbIcon className="h-3 w-3 mr-1" />
                  <span>5 actions needed</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Strategic Insights Section - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: AI-Generated Insights */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LightbulbIcon className="h-5 w-5 mr-2 text-amber-500" />
                <CardTitle>Strategic Opportunities</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">AI-Generated</Badge>
            </div>
            <CardDescription>AI-powered analysis of potential business opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : (
              <>
                {/* Insight Card 1 */}
                <Card className="bg-blue-50/50 border-blue-100">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base font-medium">Market Expansion Opportunity</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-4">
                    <p className="text-sm text-neutral-700">EU AI Act regulations create new market for compliance tools and services in the technology sector.</p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">High Impact</Badge>
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">92% Confidence</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="py-2 px-4 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-primary h-7">
                      <span>Explore</span>
                      <ArrowRightIcon className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Insight Card 2 */}
                <Card className="bg-purple-50/50 border-purple-100">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base font-medium">Strategic Partnership Potential</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-4">
                    <p className="text-sm text-neutral-700">3 potential partners identified that could strengthen your AI compliance offerings in healthcare sector.</p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">High Impact</Badge>
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">87% Confidence</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="py-2 px-4 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-primary h-7">
                      <span>Explore</span>
                      <ArrowRightIcon className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Insight Card 3 */}
                <Card className="bg-amber-50/50 border-amber-100">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base font-medium">Efficiency Improvement Identified</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-4">
                    <p className="text-sm text-neutral-700">Automated documentation workflows could reduce compliance costs by 23% within 6 months.</p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Medium Impact</Badge>
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">94% Confidence</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="py-2 px-4 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-primary h-7">
                      <span>Explore</span>
                      <ArrowRightIcon className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
            <div className="text-center mt-2">
              <Button variant="link" className="text-primary">
                View All Insights
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Decision Support */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
              <CardTitle>Pending Decisions</CardTitle>
            </div>
            <CardDescription>Decisions requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : (
              <>
                {/* Decision 1 */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <h4 className="font-medium text-sm">Risk Assessment Approval</h4>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">High Priority</Badge>
                      <span className="text-xs text-neutral-500 ml-2">Due in 2 days</span>
                    </div>
                  </div>
                  <Button size="sm">Take Action</Button>
                </div>

                {/* Decision 2 */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <h4 className="font-medium text-sm">Compliance Report Review</h4>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Medium Priority</Badge>
                      <span className="text-xs text-neutral-500 ml-2">Marketing</span>
                    </div>
                  </div>
                  <Button size="sm">Take Action</Button>
                </div>

                {/* Decision 3 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">AI System Registration</h4>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Medium Priority</Badge>
                      <span className="text-xs text-neutral-500 ml-2">Operations</span>
                    </div>
                  </div>
                  <Button size="sm">Take Action</Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="pt-2 pb-4 flex justify-center">
            <Button variant="link" className="text-primary">
              Manage All Decisions
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Business Performance Visualization */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Business Performance</CardTitle>
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-neutral-200 rounded-md px-2 py-1">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Placeholder for revenue chart */}
              <div className="h-64 bg-gradient-to-b from-blue-50 to-white border border-neutral-100 rounded-md flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart3Icon className="h-6 w-6 mx-auto text-blue-500" />
                  <p className="text-sm text-neutral-600">Professional Revenue Chart Visualization</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <h4 className="font-medium text-sm mb-3">AI-Generated Insights</h4>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <TrendingUpIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-neutral-700">12% revenue growth compared to previous period, exceeding projections by 3%.</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <AlertTriangleIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-neutral-700">Product line A showing declining performance in Southern European market.</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <LightbulbIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-neutral-700">Opportunity to increase market share in healthcare sector based on recent regulatory changes.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">View Full Analysis</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Compliance Center */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>EU AI Act Compliance</CardTitle>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">On Track</Badge>
          </div>
          <CardDescription>Progress toward EU AI Act compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Overall Compliance Score</h4>
                <span className="text-2xl font-bold text-primary">92%</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Documentation</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span>Risk Management</span>
                  <span className="font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span>Technical Requirements</span>
                  <span className="font-medium">90%</span>
                </div>
                <Progress value={90} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span>Human Oversight</span>
                  <span className="font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Compliance Timeline</h4>
              <div className="space-y-4 relative before:absolute before:top-0 before:bottom-0 before:left-[11px] before:w-0.5 before:bg-neutral-200">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs flex-shrink-0 z-10">
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">August 2025</p>
                    <p className="text-xs text-neutral-500">Prohibitions Effective</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs flex-shrink-0 z-10">
                    <ClockIcon className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">February 2026</p>
                    <p className="text-xs text-neutral-500">High-Risk Requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-xs flex-shrink-0 z-10">
                    <span>3</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">August 2026</p>
                    <p className="text-xs text-neutral-500">Full Compliance</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">AI Systems Risk Distribution</h4>
              <div className="flex justify-center">
                <div className="relative h-40 w-40">
                  {/* Donut chart placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-28 w-28 rounded-full border-8 border-primary flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{summary?.totalSystems || 38}</div>
                        <div className="text-xs text-neutral-500">Systems</div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0">
                      <svg height="160" width="160" viewBox="0 0 160 160">
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="70" 
                          fill="transparent" 
                          stroke="#F44336" 
                          strokeWidth="16" 
                          strokeDasharray="88 360"
                          transform="rotate(-90 80 80)"
                        />
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="70" 
                          fill="transparent" 
                          stroke="#FF9800" 
                          strokeWidth="16" 
                          strokeDasharray="110 360" 
                          strokeDashoffset="-88"
                          transform="rotate(-90 80 80)"
                        />
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="70" 
                          fill="transparent" 
                          stroke="#4CAF50" 
                          strokeWidth="16" 
                          strokeDasharray="162 360" 
                          strokeDashoffset="-198"
                          transform="rotate(-90 80 80)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-6 mt-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs">High (24%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-xs">Limited (31%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs">Minimal (45%)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="flex items-center justify-center">
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              Compliance Dashboard
            </Button>
            <Button variant="outline" className="flex items-center justify-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Register New AI System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <Button variant="outline" className="flex flex-col h-auto py-3 px-4 space-y-1">
          <FileTextIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">New Strategic Plan</span>
        </Button>
        <Button variant="outline" className="flex flex-col h-auto py-3 px-4 space-y-1">
          <BarChart3Icon className="h-5 w-5 mb-1" />
          <span className="text-xs">Run Market Analysis</span>
        </Button>
        <Button variant="outline" className="flex flex-col h-auto py-3 px-4 space-y-1">
          <LightbulbIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Register AI System</span>
        </Button>
        <Button variant="outline" className="flex flex-col h-auto py-3 px-4 space-y-1">
          <FileTextIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Generate Report</span>
        </Button>
        <Button variant="outline" className="flex flex-col h-auto py-3 px-4 space-y-1">
          <CalendarIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Schedule Training</span>
        </Button>
      </div>
    </div>
  );
}