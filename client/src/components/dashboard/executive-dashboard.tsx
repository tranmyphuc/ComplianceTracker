import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck, 
  AlertTriangle, 
  FileText, 
  BookOpen, 
  BarChart4,
  Building2,
  Calendar,
  Users2
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompanyCardProps {
  name: string;
  industry: string;
  size: string;
  riskLevel: "High Risk" | "Medium Risk" | "Limited Risk";
  description: string;
  systems: string[];
  onClick?: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  industry,
  size,
  riskLevel,
  description,
  systems,
  onClick
}) => {
  const riskColorClass = 
    riskLevel === "High Risk" 
      ? "bg-red-100 text-red-800" 
      : riskLevel === "Medium Risk" 
        ? "bg-yellow-100 text-yellow-800" 
        : "bg-green-100 text-green-800";

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-sm h-full">
      <div className="flex items-start justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <span className="flex items-center text-sm text-gray-600">
              <Building2 className="h-4 w-4 mr-1" /> {industry}
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center text-sm text-gray-600">
              <Users2 className="h-4 w-4 mr-1" /> {size}
            </span>
          </div>
        </div>
        <Badge className={`${riskColorClass} font-medium`}>{riskLevel}</Badge>
      </div>
      
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <div className="px-4 pb-3">
        <h4 className="text-sm font-medium mb-2">AI Systems:</h4>
        <div className="flex flex-wrap gap-2">
          {systems.map((system, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {system}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-3">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          onClick={onClick}
        >
          View Scenario
        </Button>
      </div>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  onClick
}) => {
  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-end space-x-1 mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              {trend && (
                <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="p-2 rounded-full bg-blue-50">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ExecutiveDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("euAiAct");
  const { currentLanguage } = useLanguage();

  const companies = [
    {
      name: "Municipality of Metropolis",
      industry: "Public Sector",
      size: "Large (1,000-5,000 employees)",
      riskLevel: "High Risk" as const,
      description: "A European city implementing AI systems to determine citizen service eligibility and urban planning.",
      systems: ["Benefits Eligibility Assessment", "Urban Planning AI", "Public Resource Allocation System"],
      route: "/demo-scenarios/public-sector-eligibility"
    },
    {
      name: "SGH Service",
      industry: "Professional Services",
      size: "Medium (250-999 employees)",
      riskLevel: "Medium Risk" as const,
      description: "A European professional services firm implementing AI tools for consultancy, document management, and business process optimization.",
      systems: ["Odoo AI", "ChatGPT Integration", "GitHub Copilot", "Document Analysis AI"],
      route: "/demo-scenarios/sgh-service-consulting"
    },
    {
      name: "EuroBank Financial Services",
      industry: "Financial Services",
      size: "Large (1,000-5,000 employees)",
      riskLevel: "High Risk" as const,
      description: "A pan-European bank using AI for credit decisioning and fraud detection systems.",
      systems: ["Credit Scoring AI", "Fraud Detection System", "Anti-Money Laundering AI"],
      route: "/demo-scenarios/fintech-fraud-detection"
    },
    {
      name: "SmartFactory GmbH",
      industry: "Manufacturing",
      size: "Medium (250-999 employees)",
      riskLevel: "Medium Risk" as const,
      description: "A German industrial equipment manufacturer using AI for quality control and predictive maintenance.",
      systems: ["Predictive Maintenance System", "Quality Control Vision System", "Production Optimization AI"],
      route: "/demo-scenarios/manufacturing-predictive-maintenance"
    },
    {
      name: "MediTech Solutions",
      industry: "Healthcare",
      size: "Enterprise (5,000+ employees)",
      riskLevel: "High Risk" as const,
      description: "A major healthcare provider implementing AI diagnostic tools across multiple EU hospitals.",
      systems: ["Diagnostic Imaging AI", "Patient Risk Prediction", "Treatment Recommendation Engine"],
      route: "/demo-scenarios/healthcare-ai-diagnostics"
    },
    {
      name: "Mercedes-Benz",
      industry: "Automotive",
      size: "Enterprise (100,000+ employees)",
      riskLevel: "High Risk" as const,
      description: "A global automotive manufacturer implementing advanced driver assistance systems, autonomous driving, and vehicle health monitoring.",
      systems: ["Advanced Driver Assistance Systems", "Autonomous Driving System", "Predictive Vehicle Health Monitoring"],
      route: "/demo-scenarios/automotive-safety-systems"
    }
  ];

  const renderAIActTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="High-Risk AI Systems" 
            value="14" 
            icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} 
            description="Requires immediate compliance actions" 
            onClick={() => console.log("Navigate to high-risk systems")}
          />
          <StatCard 
            title="Risk Assessments Completed" 
            value="62%" 
            icon={<ClipboardCheck className="h-5 w-5 text-emerald-500" />} 
            trend={{ value: 12, isPositive: true }}
            onClick={() => console.log("Navigate to risk assessments")}
          />
          <StatCard 
            title="Compliance Documentation" 
            value="48%" 
            icon={<FileText className="h-5 w-5 text-blue-500" />} 
            description="Required documentation status"
            onClick={() => console.log("Navigate to documentation")}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Client Scenarios</h2>
            <Link href="/demo-scenarios">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <CompanyCard
                key={index}
                name={company.name}
                industry={company.industry}
                size={company.size}
                riskLevel={company.riskLevel}
                description={company.description}
                systems={company.systems}
                onClick={() => window.location.href = company.route}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Resources & Guides</h2>
            <Link href="/knowledge-center">
              <Button variant="outline">Knowledge Center</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = "/risk-assessment/guides"}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentLanguage === 'de' ? 'Risikobewertungsmethodik' : 'Risk Assessment Methodology'}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentLanguage === 'de' 
                        ? 'Schrittweiser Prozess zur Durchführung von Risikobewertungen' 
                        : 'Step-by-step process for conducting risk assessments'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = "/knowledge-center"}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentLanguage === 'de' ? 'Anforderungen an Hochrisikosysteme' : 'High-Risk System Requirements'}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentLanguage === 'de' 
                        ? 'Compliance-Anforderungen für Hochrisiko-KI-Systeme' 
                        : 'Compliance requirements for high-risk AI systems'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Deadlines</h2>
            <Link href="/workflow">
              <Button variant="outline">View Workflow</Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">High-Risk System Documentation Review</p>
                      <p className="text-sm text-gray-600">For MediTech Solutions' Diagnostic Imaging AI</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 font-medium">Due in 5 days</Badge>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Conformity Assessment Submission</p>
                      <p className="text-sm text-gray-600">For EuroBank Financial Services' Credit Scoring AI</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 font-medium">Due tomorrow</Badge>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Risk Management System Update</p>
                      <p className="text-sm text-gray-600">For Mercedes-Benz Autonomous Driving System</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 font-medium">Due in 14 days</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderOtherTab = (tabName: string) => {
    return (
      <div className="py-8 text-center">
        <h3 className="text-xl font-semibold mb-4">{tabName} Module</h3>
        <p className="text-gray-600 mb-6">This dashboard module is coming soon in a future update.</p>
        <Button variant="outline" onClick={() => setActiveTab("euAiAct")}>
          Return to EU AI Act Dashboard
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Executive Dashboard</h1>
        <p className="text-gray-600">Overview of your organization's regulatory compliance and AI systems</p>
      </div>

      <Tabs defaultValue="euAiAct" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="euAiAct" className="text-sm">EU AI Act Compliance</TabsTrigger>
          <TabsTrigger value="aiInventory" className="text-sm">AI Systems Inventory</TabsTrigger>
          <TabsTrigger value="riskManagement" className="text-sm">Risk Management</TabsTrigger>
          <TabsTrigger value="regulatoryReporting" className="text-sm">Regulatory Reporting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="euAiAct">
          {renderAIActTab()}
        </TabsContent>
        
        <TabsContent value="aiInventory">
          {renderOtherTab("AI Systems Inventory")}
        </TabsContent>
        
        <TabsContent value="riskManagement">
          {renderOtherTab("Risk Management")}
        </TabsContent>
        
        <TabsContent value="regulatoryReporting">
          {renderOtherTab("Regulatory Reporting")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { ExecutiveDashboard };
export default ExecutiveDashboard;