import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, TrendingUp, LineChart, BarChart3, PieChart, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Mock data for Market Intelligence
const marketTrends = [
  {
    id: 1,
    trend: "AI Regulations Expansion",
    impact: "High",
    growth: "+28%",
    region: "Global",
    category: "Regulatory",
    description: "Increasing regulatory framework adoption across sectors",
    prediction: "Continued growth in compliance requirements through 2025"
  },
  {
    id: 2,
    trend: "AI Ethics Standards",
    impact: "Medium",
    growth: "+15%",
    region: "EU",
    category: "Standards",
    description: "New AI ethics frameworks being established",
    prediction: "Mandatory ethics assessments likely by Q4 2025"
  },
  {
    id: 3,
    trend: "Compliance Technologies",
    impact: "High",
    growth: "+42%",
    region: "Global",
    category: "Technology",
    description: "Rapid adoption of automated compliance solutions",
    prediction: "Market size to reach €9.8B by end of 2025"
  },
  {
    id: 4,
    trend: "RegTech Integration",
    impact: "Medium",
    growth: "+24%",
    region: "North America",
    category: "Technology",
    description: "Increased integration of regulatory technology with AI systems",
    prediction: "65% of enterprises to implement RegTech solutions by 2026"
  },
  {
    id: 5,
    trend: "Cross-border Compliance",
    impact: "High",
    growth: "+18%",
    region: "Global",
    category: "Regulatory",
    description: "Growing demand for solutions that address multiple jurisdictions",
    prediction: "Unified compliance frameworks expected to emerge by 2026"
  }
];

const competitorInsights = [
  {
    id: 1,
    name: "ComplianceAI",
    marketShare: 22,
    growthRate: "+7%",
    strengths: ["Comprehensive documentation", "Strong EU market presence"],
    weaknesses: ["Limited integration capabilities", "Higher pricing point"],
    focus: "Financial sector compliance"
  },
  {
    id: 2,
    name: "RegulateIQ",
    marketShare: 18,
    growthRate: "+12%",
    strengths: ["Advanced risk assessment", "Intuitive user interface"],
    weaknesses: ["Limited sector coverage", "Newer to market"],
    focus: "Healthcare AI compliance"
  },
  {
    id: 3,
    name: "AIGovern",
    marketShare: 15,
    growthRate: "+5%",
    strengths: ["Established brand", "Strong documentation"],
    weaknesses: ["Outdated UI", "Slower innovation cycle"],
    focus: "General AI compliance"
  },
  {
    id: 4,
    name: "ComplianceTech",
    marketShare: 13,
    growthRate: "+14%",
    strengths: ["Innovative features", "Strong technical support"],
    weaknesses: ["Limited EU expertise", "Scalability issues"],
    focus: "Manufacturing sector compliance"
  },
  {
    id: 5,
    name: "RegTech Solutions",
    marketShare: 11,
    growthRate: "+9%",
    strengths: ["Cost-effective", "Good customization"],
    weaknesses: ["Limited documentation", "Customer support gaps"],
    focus: "Public sector compliance"
  }
];

const opportunityAreas = [
  {
    id: 1,
    area: "SME Compliance Solutions",
    potential: "High",
    timeframe: "Near-term",
    investmentRequired: "Medium",
    description: "Simplified compliance tools for small-to-medium enterprises",
    rationale: "Underserved market with growing regulatory pressure"
  },
  {
    id: 2,
    area: "Cross-Regional Compliance",
    potential: "Very High",
    timeframe: "Mid-term",
    investmentRequired: "High",
    description: "Solutions spanning EU, US, and Asia-Pacific regulations",
    rationale: "Growing demand for unified compliance management"
  },
  {
    id: 3,
    area: "AI Audit Automation",
    potential: "High",
    timeframe: "Near-term",
    investmentRequired: "Medium",
    description: "Automated tools for continuous AI system auditing",
    rationale: "Increasing frequency of required compliance checks"
  },
  {
    id: 4,
    area: "Compliance-as-a-Service",
    potential: "Medium",
    timeframe: "Mid-term",
    investmentRequired: "Medium",
    description: "Subscription-based ongoing compliance management",
    rationale: "Market shifting toward outsourced compliance expertise"
  },
  {
    id: 5,
    area: "Regulatory Change Management",
    potential: "High",
    timeframe: "Near-term",
    investmentRequired: "Low",
    description: "Tools to track and implement regulatory changes",
    rationale: "Rapidly evolving regulatory landscape creates constant demand"
  }
];

// Market Dashboard Component
const MarketDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Addressable Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€14.8B</div>
          <p className="text-xs text-muted-foreground">by 2028</p>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +24% YoY Growth
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Market Share</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8.5%</div>
          <p className="text-xs text-muted-foreground">EU AI Compliance Sector</p>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +2.1% Last Quarter
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Competitive Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Top 5</div>
          <p className="text-xs text-muted-foreground">in EU Market</p>
          <div className="mt-4 text-sm">
            <Badge variant="outline" className="bg-amber-50">Strong Challenger</Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Emerging Opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">SME Sector</div>
          <p className="text-xs text-muted-foreground">+37% Growth Potential</p>
          <div className="mt-4 text-sm">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Priority</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Market Trend Analysis</CardTitle>
        <CardDescription>Key trends and patterns affecting the AI compliance market</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center bg-neutral-50 rounded-md border mb-4">
          <div className="text-center">
            <LineChart className="h-16 w-16 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Market trend visualization would appear here</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium">Regulatory Expansion</div>
              <div className="text-sm text-green-600">+28%</div>
            </div>
            <Progress value={78} className="h-2" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium">Technology Adoption</div>
              <div className="text-sm text-green-600">+42%</div>
            </div>
            <Progress value={62} className="h-2" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium">Cross-border Compliance</div>
              <div className="text-sm text-green-600">+18%</div>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Market Trends Component
const MarketTrends = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Key Market Trends</h3>
        <p className="text-sm text-muted-foreground">Current trends shaping the AI compliance landscape</p>
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          <SelectItem value="eu">European Union</SelectItem>
          <SelectItem value="na">North America</SelectItem>
          <SelectItem value="apac">Asia-Pacific</SelectItem>
          <SelectItem value="global">Global</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="space-y-4">
      {marketTrends.map((trend) => (
        <Card key={trend.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-base">{trend.trend}</CardTitle>
                <CardDescription>{trend.description}</CardDescription>
              </div>
              <Badge 
                variant={trend.impact === "High" ? "default" : "outline"}
                className={trend.impact === "High" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
              >
                {trend.impact} Impact
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Growth Rate</p>
                <p className="font-medium text-green-600">{trend.growth}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Region</p>
                <p className="font-medium">{trend.region}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{trend.category}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-neutral-50 text-sm">
            <p><span className="font-medium">Prediction:</span> {trend.prediction}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

// Competitor Analysis Component
const CompetitorAnalysis = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Competitor Analysis</h3>
        <p className="text-sm text-muted-foreground">Overview of key competitors in the AI compliance market</p>
      </div>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Market Share Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-neutral-50 rounded-md border mb-4">
          <div className="text-center">
            <PieChart className="h-16 w-16 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Market share visualization would appear here</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {competitorInsights.map((competitor) => (
            <div key={competitor.id} className="flex items-center space-x-4">
              <div className="w-[40%]">
                <div className="font-medium">{competitor.name}</div>
                <div className="text-sm text-muted-foreground">{competitor.focus}</div>
              </div>
              <div className="w-[30%]">
                <div className="text-sm">Market Share: <span className="font-medium">{competitor.marketShare}%</span></div>
                <div className="text-sm text-green-600">{competitor.growthRate} YoY</div>
              </div>
              <div className="w-[30%] text-sm">
                <Badge variant="outline" className="mr-1">{competitor.strengths[0]}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitorInsights.slice(0, 4).map((competitor) => (
        <Card key={competitor.id}>
          <CardHeader>
            <CardTitle>{competitor.name}</CardTitle>
            <CardDescription>{competitor.focus}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Market Share</p>
                <p className="font-medium">{competitor.marketShare}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="font-medium text-green-600">{competitor.growthRate}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Strengths</p>
              <div className="flex flex-wrap gap-1">
                {competitor.strengths.map((strength, i) => (
                  <Badge key={i} variant="outline" className="bg-green-50">{strength}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Weaknesses</p>
              <div className="flex flex-wrap gap-1">
                {competitor.weaknesses.map((weakness, i) => (
                  <Badge key={i} variant="outline" className="bg-red-50">{weakness}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Opportunity Analysis Component
const OpportunityAnalysis = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Market Opportunities</h3>
        <p className="text-sm text-muted-foreground">Emerging opportunities in the AI compliance sector</p>
      </div>
      <Select defaultValue="potential">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="potential">Highest Potential</SelectItem>
          <SelectItem value="timeframe">Nearest Timeframe</SelectItem>
          <SelectItem value="investment">Lowest Investment</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {opportunityAreas.map((opportunity) => (
        <Card key={opportunity.id}>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-base">{opportunity.area}</CardTitle>
              <Badge 
                variant={opportunity.potential === "High" || opportunity.potential === "Very High" ? "default" : "outline"}
                className={
                  opportunity.potential === "Very High" 
                    ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" 
                    : opportunity.potential === "High"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : ""
                }
              >
                {opportunity.potential} Potential
              </Badge>
            </div>
            <CardDescription>{opportunity.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Timeframe</p>
                <p className="font-medium">{opportunity.timeframe}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investment Required</p>
                <p className="font-medium">{opportunity.investmentRequired}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">Rationale</p>
              <p className="text-sm">{opportunity.rationale}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">View Detailed Analysis</Button>
            <Button size="sm">Add to Strategy</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

// Main Market Intelligence Component
export default function MarketIntelligence() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Market Intelligence</h1>
          <p className="text-muted-foreground">
            AI-powered market insights and competitive analysis
          </p>
        </div>
        <Button>
          <TrendingUp className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">
            <Activity className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Market Trends
          </TabsTrigger>
          <TabsTrigger value="competitors">
            <BarChart3 className="h-4 w-4 mr-2" />
            Competitor Analysis
          </TabsTrigger>
          <TabsTrigger value="opportunities">
            <LineChart className="h-4 w-4 mr-2" />
            Opportunity Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <MarketDashboard />
        </TabsContent>
        
        <TabsContent value="trends" className="mt-0">
          <MarketTrends />
        </TabsContent>
        
        <TabsContent value="competitors" className="mt-0">
          <CompetitorAnalysis />
        </TabsContent>
        
        <TabsContent value="opportunities" className="mt-0">
          <OpportunityAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}