import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, 
  Sparkles, 
  LightbulbIcon, 
  LineChart, 
  BarChart3, 
  ArrowUpRight,
  BarChart,
  PieChart,
  Zap,
  Target,
  Beaker,
  Users
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Mock data for Growth & Innovation
const innovationInitiatives = [
  {
    id: 1,
    name: "AI Compliance Assistant",
    category: "Product Enhancement",
    status: "In Development",
    progress: 68,
    impact: "High",
    investmentRequired: "€120,000",
    expectedROI: "285%",
    timeToMarket: "Q2 2025",
    description: "AI-powered assistant that guides users through compliance processes and provides real-time recommendations"
  },
  {
    id: 2,
    name: "Multi-Jurisdiction Compliance Platform",
    category: "New Product",
    status: "Planning",
    progress: 25,
    impact: "Very High",
    investmentRequired: "€350,000",
    expectedROI: "320%",
    timeToMarket: "Q4 2025",
    description: "Unified platform for managing compliance across EU, US, and Asia-Pacific regulatory frameworks"
  },
  {
    id: 3,
    name: "Compliance-as-a-Service",
    category: "Business Model",
    status: "Market Research",
    progress: 32,
    impact: "High",
    investmentRequired: "€180,000",
    expectedROI: "240%",
    timeToMarket: "Q3 2025",
    description: "Subscription-based service providing full compliance management for SMEs"
  },
  {
    id: 4,
    name: "Automated Compliance Documentation",
    category: "Product Enhancement",
    status: "Testing",
    progress: 85,
    impact: "Medium",
    investmentRequired: "€80,000",
    expectedROI: "210%",
    timeToMarket: "Q2 2025",
    description: "Enhanced document generation system with advanced templating and auto-completion"
  },
  {
    id: 5,
    name: "Regulatory Change Management System",
    category: "New Product",
    status: "In Development",
    progress: 52,
    impact: "High",
    investmentRequired: "€140,000",
    expectedROI: "195%",
    timeToMarket: "Q3 2025",
    description: "System to track and implement regulatory changes with impact assessment and update automation"
  }
];

const marketExpansionOpportunities = [
  {
    id: 1,
    market: "SME Sector",
    region: "European Union",
    potentialRevenue: "€2.4M",
    marketSize: "14,000 potential clients",
    growthRate: "+24%",
    entryDifficulty: "Medium",
    competitiveIntensity: "Moderate",
    entryStrategy: "Simplified product offering with lower price point",
    targetDate: "Q3 2025"
  },
  {
    id: 2,
    market: "Healthcare AI Compliance",
    region: "Global",
    potentialRevenue: "€4.8M",
    marketSize: "5,200 potential clients",
    growthRate: "+32%",
    entryDifficulty: "High",
    competitiveIntensity: "Low",
    entryStrategy: "Specialized compliance package with healthcare-specific features",
    targetDate: "Q4 2025"
  },
  {
    id: 3,
    market: "Financial Services",
    region: "European Union",
    potentialRevenue: "€3.6M",
    marketSize: "8,500 potential clients",
    growthRate: "+18%",
    entryDifficulty: "High",
    competitiveIntensity: "High",
    entryStrategy: "Strategic partnerships with financial technology providers",
    targetDate: "Q2 2026"
  },
  {
    id: 4,
    market: "North American Expansion",
    region: "USA & Canada",
    potentialRevenue: "€5.2M",
    marketSize: "12,000 potential clients",
    growthRate: "+28%",
    entryDifficulty: "Very High",
    competitiveIntensity: "Moderate",
    entryStrategy: "Localized compliance solution with US regulatory framework",
    targetDate: "Q1 2026"
  },
  {
    id: 5,
    market: "Public Sector",
    region: "European Union",
    potentialRevenue: "€2.8M",
    marketSize: "3,200 potential clients",
    growthRate: "+15%",
    entryDifficulty: "Medium",
    competitiveIntensity: "Low",
    entryStrategy: "Specialized tender preparation and public sector compliance package",
    targetDate: "Q3 2025"
  }
];

const strategicPartnerships = [
  {
    id: 1,
    partner: "TechRegulatory Solutions",
    status: "Negotiation",
    type: "Technology Integration",
    benefitAreas: ["Market Access", "Technical Capability"],
    potentialRevenue: "€1.2M",
    synergy: "High",
    timeline: "3-4 months",
    notes: "Leading provider of regulatory technology solutions with strong financial sector presence"
  },
  {
    id: 2,
    partner: "Global Compliance Consultancy",
    status: "Due Diligence",
    type: "Service Delivery",
    benefitAreas: ["Domain Expertise", "Client Access"],
    potentialRevenue: "€1.8M",
    synergy: "Medium",
    timeline: "4-6 months",
    notes: "International consulting firm specializing in regulatory compliance across industries"
  },
  {
    id: 3,
    partner: "HealthTech Innovations",
    status: "Initial Discussions",
    type: "Industry Specialization",
    benefitAreas: ["Sector Expertise", "Market Entry"],
    potentialRevenue: "€950K",
    synergy: "High",
    timeline: "5-7 months",
    notes: "Healthcare technology provider with extensive industry connections and expertise"
  },
  {
    id: 4,
    partner: "AI Ethics Research Institute",
    status: "Agreement Drafted",
    type: "Research & Innovation",
    benefitAreas: ["Thought Leadership", "Product Innovation"],
    potentialRevenue: "€600K",
    synergy: "Medium",
    timeline: "2-3 months",
    notes: "Leading research organization focused on ethical AI implementation and governance"
  },
  {
    id: 5,
    partner: "Public Sector Solutions",
    status: "Initial Discussions",
    type: "Market Access",
    benefitAreas: ["Public Sector Entry", "Credibility"],
    potentialRevenue: "€1.4M",
    synergy: "High",
    timeline: "6-8 months",
    notes: "Specialized firm with established relationships in government and public sector"
  }
];

// Innovation Dashboard Component
const InnovationDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Innovation Pipeline Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€4.2M</div>
          <p className="text-xs text-muted-foreground">projected annual revenue</p>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +35% YoY Growth Potential
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Time to Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.8 mo</div>
          <p className="text-xs text-muted-foreground">average for innovations</p>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            -1.2 months from target
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Innovation Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">72%</div>
          <Progress value={72} className="h-2 mt-2" />
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +12% above industry average
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">New Market Potential</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€18.8M</div>
          <p className="text-xs text-muted-foreground">Total Opportunity</p>
          <div className="mt-4 text-sm">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">High Priority</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Innovation & Growth Portfolio</CardTitle>
        <CardDescription>Current portfolio distribution and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center bg-neutral-50 rounded-md border mb-4">
          <div className="text-center">
            <PieChart className="h-16 w-16 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Portfolio allocation visualization would appear here</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Top Innovations by ROI</h4>
            <div className="space-y-4">
              {innovationInitiatives.slice(0, 3).map((initiative) => (
                <div key={initiative.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{initiative.name}</div>
                    <div className="text-sm">{initiative.expectedROI}</div>
                  </div>
                  <Progress value={parseInt(initiative.expectedROI)} className="h-2" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Market Expansion Priorities</h4>
            <div className="space-y-4">
              {marketExpansionOpportunities.slice(0, 3).map((opportunity) => (
                <div key={opportunity.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{opportunity.market}</div>
                    <div className="text-sm text-green-600">{opportunity.growthRate}</div>
                  </div>
                  <Progress 
                    value={parseInt(opportunity.growthRate)} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Innovation Initiatives Component
const InnovationInitiatives = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Innovation Initiatives</h3>
        <p className="text-sm text-muted-foreground">Current product and service innovations in development</p>
      </div>
      <Select defaultValue="impact">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="impact">Highest Impact</SelectItem>
          <SelectItem value="progress">Development Progress</SelectItem>
          <SelectItem value="roi">Expected ROI</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {innovationInitiatives.map((initiative) => (
        <Card key={initiative.id}>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-base">{initiative.name}</CardTitle>
              <Badge 
                variant={initiative.impact === "High" || initiative.impact === "Very High" ? "default" : "outline"}
                className={
                  initiative.impact === "Very High" 
                    ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" 
                    : initiative.impact === "High"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : ""
                }
              >
                {initiative.impact} Impact
              </Badge>
            </div>
            <CardDescription>{initiative.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm">Development Progress</div>
                <div className="text-sm font-medium">{initiative.progress}%</div>
              </div>
              <Progress value={initiative.progress} className="h-2" />
              <div className="mt-1 text-xs">
                <Badge variant="outline">{initiative.status}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-sm font-medium">{initiative.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time to Market</p>
                <p className="text-sm font-medium">{initiative.timeToMarket}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investment Required</p>
                <p className="text-sm font-medium">{initiative.investmentRequired}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected ROI</p>
                <p className="text-sm font-medium text-green-600">{initiative.expectedROI}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" size="sm">View Details</Button>
            <Button size="sm">Accelerate Development</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

// Market Expansion Component
const MarketExpansion = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Market Expansion Opportunities</h3>
        <p className="text-sm text-muted-foreground">Potential new markets and expansion strategies</p>
      </div>
      <Select defaultValue="revenue">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="revenue">Highest Revenue</SelectItem>
          <SelectItem value="growth">Growth Rate</SelectItem>
          <SelectItem value="difficulty">Entry Difficulty</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Market Expansion Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-neutral-50 rounded-md border mb-4">
          <div className="text-center">
            <BarChart className="h-16 w-16 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Market expansion map visualization would appear here</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {marketExpansionOpportunities.map((opportunity) => (
        <Card key={opportunity.id}>
          <CardHeader>
            <CardTitle>{opportunity.market}</CardTitle>
            <CardDescription>{opportunity.region}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Potential Revenue</p>
                <p className="text-sm font-medium">{opportunity.potentialRevenue}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-sm font-medium text-green-600">{opportunity.growthRate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Market Size</p>
                <p className="text-sm font-medium">{opportunity.marketSize}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Date</p>
                <p className="text-sm font-medium">{opportunity.targetDate}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Market Entry Profile</p>
              <div className="flex space-x-2">
                <Badge 
                  variant="outline" 
                  className={
                    opportunity.entryDifficulty === "Low" 
                      ? "bg-green-50" 
                      : opportunity.entryDifficulty === "Medium"
                      ? "bg-yellow-50"
                      : opportunity.entryDifficulty === "High"
                      ? "bg-orange-50"
                      : "bg-red-50"
                  }
                >
                  {opportunity.entryDifficulty} Difficulty
                </Badge>
                <Badge 
                  variant="outline"
                  className={
                    opportunity.competitiveIntensity === "Low" 
                      ? "bg-green-50" 
                      : opportunity.competitiveIntensity === "Moderate"
                      ? "bg-yellow-50"
                      : "bg-red-50"
                  }
                >
                  {opportunity.competitiveIntensity} Competition
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Entry Strategy</p>
              <p className="text-sm">{opportunity.entryStrategy}</p>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" size="sm">Detailed Analysis</Button>
            <Button size="sm">Develop Entry Plan</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

// Strategic Partnerships Component
const StrategicPartnerships = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Strategic Partnership Opportunities</h3>
        <p className="text-sm text-muted-foreground">Potential partnerships to accelerate growth</p>
      </div>
      <Select defaultValue="synergy">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="synergy">Highest Synergy</SelectItem>
          <SelectItem value="revenue">Potential Revenue</SelectItem>
          <SelectItem value="timeline">Shortest Timeline</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="space-y-4">
      {strategicPartnerships.map((partnership) => (
        <Card key={partnership.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-base">{partnership.partner}</CardTitle>
                <CardDescription>{partnership.type}</CardDescription>
              </div>
              <Badge 
                variant={partnership.synergy === "High" ? "default" : "outline"}
                className={partnership.synergy === "High" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
              >
                {partnership.synergy} Synergy
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline">{partnership.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue Potential</p>
                <p className="text-sm font-medium">{partnership.potentialRevenue}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="text-sm font-medium">{partnership.timeline}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Benefit Areas</p>
              <div className="flex flex-wrap gap-1">
                {partnership.benefitAreas.map((benefit, i) => (
                  <Badge key={i} variant="outline" className="bg-blue-50">{benefit}</Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm">{partnership.notes}</p>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" size="sm">Partnership Brief</Button>
            <Button size="sm">Advance Discussion</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

// Main Growth & Innovation Component
export default function GrowthInnovation() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Growth & Innovation</h1>
          <p className="text-muted-foreground">
            Strategic initiatives for business growth and innovation
          </p>
        </div>
        <Button>
          <Rocket className="mr-2 h-4 w-4" />
          Innovation Strategy
        </Button>
      </div>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">
            <Target className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="innovations">
            <Sparkles className="h-4 w-4 mr-2" />
            Innovation Initiatives
          </TabsTrigger>
          <TabsTrigger value="markets">
            <BarChart3 className="h-4 w-4 mr-2" />
            Market Expansion
          </TabsTrigger>
          <TabsTrigger value="partnerships">
            <Users className="h-4 w-4 mr-2" />
            Strategic Partnerships
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <InnovationDashboard />
        </TabsContent>
        
        <TabsContent value="innovations" className="mt-0">
          <InnovationInitiatives />
        </TabsContent>
        
        <TabsContent value="markets" className="mt-0">
          <MarketExpansion />
        </TabsContent>
        
        <TabsContent value="partnerships" className="mt-0">
          <StrategicPartnerships />
        </TabsContent>
      </Tabs>
    </div>
  );
}