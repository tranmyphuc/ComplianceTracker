
import React from 'react';
import { ScenarioCard, ScenarioProps } from '@/components/demo-scenarios/scenario-card';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DemoScenarios: React.FC = () => {
  const scenarios: ScenarioProps[] = [
    {
      id: "healthcare-ai-diagnostics",
      title: "MediTech Solutions",
      industry: "Healthcare",
      companySize: "Enterprise (5,000+ employees)",
      riskLevel: "High",
      description: "A major healthcare provider implementing AI diagnostic tools across multiple EU hospitals.",
      aiSystems: ["Diagnostic Imaging AI", "Patient Risk Prediction", "Treatment Recommendation Engine"]
    },
    {
      id: "fintech-fraud-detection",
      title: "EuroBank Financial Services",
      industry: "Financial Services",
      companySize: "Large (1,000-5,000 employees)",
      riskLevel: "High",
      description: "A pan-European bank using AI for credit decisioning and fraud detection systems.",
      aiSystems: ["Credit Scoring AI", "Fraud Detection System", "Anti-Money Laundering AI"]
    },
    {
      id: "manufacturing-predictive-maintenance",
      title: "SmartFactory GmbH",
      industry: "Manufacturing",
      companySize: "Medium (250-999 employees)",
      riskLevel: "Medium",
      description: "A German industrial equipment manufacturer using AI for quality control and predictive maintenance.",
      aiSystems: ["Predictive Maintenance System", "Quality Control Vision System", "Production Optimization AI"]
    },
    {
      id: "retail-recommendation-engine",
      title: "EuroShop Retail Group",
      industry: "Retail",
      companySize: "Large (1,000-5,000 employees)",
      riskLevel: "Medium",
      description: "A multinational retailer using AI for personalized customer recommendations and inventory management.",
      aiSystems: ["Customer Recommendation Engine", "Inventory Optimization System", "Dynamic Pricing Algorithm"]
    },
    {
      id: "public-sector-eligibility",
      title: "Municipality of Metropolis",
      industry: "Public Sector",
      companySize: "Large (1,000-5,000 employees)",
      riskLevel: "High",
      description: "A European city implementing AI systems to determine citizen service eligibility and urban planning.",
      aiSystems: ["Benefits Eligibility Assessment", "Urban Planning AI", "Public Resource Allocation System"]
    }
  ];

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">EU AI Act Compliance Demo Scenarios</h1>
        <p className="text-muted-foreground">
          Explore detailed case studies showcasing how our compliance solution helps organizations 
          navigate the EU AI Act requirements across various industries.
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Industries</TabsTrigger>
          <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          <TabsTrigger value="finance">Financial Services</TabsTrigger>
          <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
          <TabsTrigger value="retail">Retail</TabsTrigger>
          <TabsTrigger value="public">Public Sector</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} {...scenario} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="healthcare" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios
              .filter(s => s.industry === 'Healthcare')
              .map((scenario) => (
                <ScenarioCard key={scenario.id} {...scenario} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios
              .filter(s => s.industry === 'Financial Services')
              .map((scenario) => (
                <ScenarioCard key={scenario.id} {...scenario} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="manufacturing" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios
              .filter(s => s.industry === 'Manufacturing')
              .map((scenario) => (
                <ScenarioCard key={scenario.id} {...scenario} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="retail" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios
              .filter(s => s.industry === 'Retail')
              .map((scenario) => (
                <ScenarioCard key={scenario.id} {...scenario} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="public" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios
              .filter(s => s.industry === 'Public Sector')
              .map((scenario) => (
                <ScenarioCard key={scenario.id} {...scenario} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemoScenarios;
