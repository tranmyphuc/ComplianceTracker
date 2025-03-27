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
  Users2,
  Database,
  Server as ServerIcon,
  Clock as ClockIcon,
  Cpu,
  FilePieChart,
  CheckCheck,
  AlertCircle,
  ClipboardEdit,
  FileCheck,
  CalendarClock,
  BookOpenText,
  Clock,
  Gavel
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LegalValidationPanel } from "@/components/legal/legal-validation-panel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  let currentLanguage = 'en';
  
  try {
    // Try to use the language context, but provide a fallback if it's not available
    const languageContext = useLanguage();
    currentLanguage = languageContext.currentLanguage;
  } catch (error) {
    console.warn("Language context not available, using fallback");
  }

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

  const renderAiInventoryTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Total AI Systems" 
            value="42" 
            icon={<Database className="h-5 w-5 text-blue-500" />} 
            description="Active systems in inventory" 
            onClick={() => console.log("Navigate to AI systems inventory")}
          />
          <StatCard 
            title="Deployed in Production" 
            value="27" 
            icon={<ServerIcon className="h-5 w-5 text-purple-500" />} 
            trend={{ value: 3, isPositive: true }}
            onClick={() => console.log("Navigate to production systems")}
          />
          <StatCard 
            title="Pending Registration" 
            value="8" 
            icon={<ClockIcon className="h-5 w-5 text-amber-500" />} 
            description="Systems needing registration"
            onClick={() => console.log("Navigate to pending systems")}
          />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{currentLanguage === 'de' ? 'KI-Systeme nach Risikoniveau' : 'AI Systems by Risk Level'}</h2>
            <Link href="/inventory">
              <Button variant="outline">{currentLanguage === 'de' ? 'Alle anzeigen' : 'View All'}</Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div className="col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-red-600">5</span>
                    </div>
                    <span className="text-sm font-medium text-center">{currentLanguage === 'de' ? 'Unzulässig' : 'Unacceptable'}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-amber-600">14</span>
                    </div>
                    <span className="text-sm font-medium text-center">{currentLanguage === 'de' ? 'Hohes Risiko' : 'High Risk'}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-blue-600">18</span>
                    </div>
                    <span className="text-sm font-medium text-center">{currentLanguage === 'de' ? 'Begrenztes Risiko' : 'Limited Risk'}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-green-600">10</span>
                    </div>
                    <span className="text-sm font-medium text-center">{currentLanguage === 'de' ? 'Minimales Risiko' : 'Minimal Risk'}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-gray-600">3</span>
                    </div>
                    <span className="text-sm font-medium text-center">{currentLanguage === 'de' ? 'Nicht klassifiziert' : 'Unclassified'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{currentLanguage === 'de' ? 'Neueste KI-System-Registrierungen' : 'Recent AI System Registrations'}</h2>
            <Link href="/register-system">
              <Button variant="outline">{currentLanguage === 'de' ? 'System registrieren' : 'Register System'}</Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Cpu className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Customer Sentiment Analysis AI</p>
                      <p className="text-sm text-gray-600">EuroBank Financial Services • Added 2 days ago</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 font-medium">High Risk</Badge>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Cpu className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Inventory Optimization System</p>
                      <p className="text-sm text-gray-600">SmartFactory GmbH • Added 5 days ago</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 font-medium">Limited Risk</Badge>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Cpu className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Traffic Flow Prediction</p>
                      <p className="text-sm text-gray-600">Municipality of Metropolis • Added 1 week ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 font-medium">Minimal Risk</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderLegalValidationTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="AI Assessments Validated" 
            value="28" 
            icon={<Gavel className="h-5 w-5 text-blue-500" />} 
            description="Legally reviewed assessments" 
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard 
            title="Pending Legal Review" 
            value="7" 
            icon={<Clock className="h-5 w-5 text-amber-500" />} 
            description="Assessments awaiting validation"
          />
          <StatCard 
            title="Confidence Level" 
            value="High" 
            icon={<CheckCheck className="h-5 w-5 text-emerald-500" />} 
            description="Overall legal confidence in assessments"
          />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Legal Validation Panel</h2>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Legal Validation Features</AlertTitle>
                <AlertDescription>
                  This panel allows you to validate AI-generated risk assessments and legal interpretations for legal compliance and accuracy.
                </AlertDescription>
              </Alert>
              
              <LegalValidationPanel 
                assessmentText={`The EuroBank Financial Services' Credit Scoring AI system is classified as high-risk under the EU AI Act, Article 6(2), as it is used for evaluating creditworthiness and determining access to essential private services. 
                
This classification requires the implementation of risk management systems (Article 9), appropriate data governance measures (Article 10), technical documentation (Article 11), record-keeping capabilities (Article 12), and human oversight mechanisms (Article 14).`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderRiskManagementTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Risk Assessments" 
            value="27" 
            icon={<FilePieChart className="h-5 w-5 text-amber-500" />} 
            description="Completed assessments" 
            onClick={() => console.log("Navigate to risk assessments")}
          />
          <StatCard 
            title="Compliance Score" 
            value="76%" 
            icon={<CheckCheck className="h-5 w-5 text-emerald-500" />} 
            trend={{ value: 4, isPositive: true }}
            onClick={() => console.log("Navigate to compliance dashboard")}
          />
          <StatCard 
            title="Open Risk Items" 
            value="18" 
            icon={<AlertCircle className="h-5 w-5 text-red-500" />} 
            description="Items requiring attention"
            onClick={() => console.log("Navigate to open risks")}
          />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{currentLanguage === 'de' ? 'Risikoverteilung nach Kategorie' : 'Risk Distribution by Category'}</h2>
            <Link href="/risk-management">
              <Button variant="outline">{currentLanguage === 'de' ? 'Vollständigen Bericht anzeigen' : 'View Full Report'}</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{currentLanguage === 'de' ? 'Top-Risikobereiche' : 'Top Risk Areas'}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Datenschutz' : 'Data Privacy'}</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Technische Robustheit' : 'Technical Robustness'}</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Menschliche Aufsicht' : 'Human Oversight'}</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Dokumentation' : 'Documentation'}</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{currentLanguage === 'de' ? 'Risikomanagement-Fortschritt' : 'Risk Management Progress'}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">EuroBank Financial Services</p>
                      <p className="text-sm text-gray-600">Credit Scoring AI</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 font-medium">92%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">MediTech Solutions</p>
                      <p className="text-sm text-gray-600">Diagnostic Imaging AI</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 font-medium">68%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Municipality of Metropolis</p>
                      <p className="text-sm text-gray-600">Benefits Eligibility System</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800 font-medium">45%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Mercedes-Benz</p>
                      <p className="text-sm text-gray-600">Autonomous Driving System</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 font-medium">87%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{currentLanguage === 'de' ? 'Laufende Risikobewertungen' : 'Ongoing Risk Assessments'}</h2>
            <Link href="/risk-assessment">
              <Button variant="outline">{currentLanguage === 'de' ? 'Neue Bewertung starten' : 'Start New Assessment'}</Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-lg mr-4">
                      <ClipboardEdit className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Patient Risk Prediction System</p>
                      <p className="text-sm text-gray-600">MediTech Solutions • Started 3 days ago</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 font-medium">In Progress</Badge>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-lg mr-4">
                      <ClipboardEdit className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Urban Planning AI</p>
                      <p className="text-sm text-gray-600">Municipality of Metropolis • Started 1 week ago</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 font-medium">Review</Badge>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-lg mr-4">
                      <ClipboardEdit className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Fraud Detection System</p>
                      <p className="text-sm text-gray-600">EuroBank Financial Services • Started yesterday</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 font-medium">Draft</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderRegulatoryReportingTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Reports Submitted" 
            value="12" 
            icon={<FileCheck className="h-5 w-5 text-green-500" />} 
            description="Reports filed on time" 
            onClick={() => console.log("Navigate to reports")}
          />
          <StatCard 
            title="Upcoming Deadlines" 
            value="4" 
            icon={<CalendarClock className="h-5 w-5 text-blue-500" />} 
            description="Due within 30 days"
            onClick={() => console.log("Navigate to deadlines")}
          />
          <StatCard 
            title="Regulatory Updates" 
            value="7" 
            icon={<BookOpenText className="h-5 w-5 text-amber-500" />} 
            description="In the last 90 days"
            onClick={() => console.log("Navigate to updates")}
          />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{currentLanguage === 'de' ? 'Regulatorischer Compliance-Kalender' : 'Regulatory Compliance Calendar'}</h2>
            <Link href="/reports">
              <Button variant="outline">{currentLanguage === 'de' ? 'Vollständigen Kalender anzeigen' : 'View Full Calendar'}</Button>
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
                      <p className="font-medium">Annual Conformity Assessment</p>
                      <p className="text-sm text-gray-600">For High-Risk Systems • Due April 15, 2025</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 font-medium">Due in 20 days</Badge>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Risk Management System Audit</p>
                      <p className="text-sm text-gray-600">For All Critical Systems • Due May 10, 2025</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 font-medium">Due in 45 days</Badge>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Technical Documentation Update</p>
                      <p className="text-sm text-gray-600">For New System Deployments • Due April 5, 2025</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 font-medium">Due in 10 days</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentLanguage === 'de' ? 'Aktuelle Compliance-Hinweise' : 'Recent Compliance Tips'}</h2>
              <Link href="/knowledge-center">
                <Button variant="outline">{currentLanguage === 'de' ? 'Mehr anzeigen' : 'View More'}</Button>
              </Link>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-100">
                    <h3 className="font-medium mb-1">Article 6 & 7 Implementation Timeline Clarification</h3>
                    <p className="text-sm text-gray-600 mb-2">High-risk AI system requirements will be enforced in phases, with initial compliance for core provisions required by August 2025.</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Published March 15, 2025</span>
                    </div>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100">
                    <h3 className="font-medium mb-1">Technical Documentation Structure Guidelines</h3>
                    <p className="text-sm text-gray-600 mb-2">New guidelines specify required documentation formats and minimum content for high-risk AI systems.</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Published March 2, 2025</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Prohibited AI Use Case Clarifications</h3>
                    <p className="text-sm text-gray-600 mb-2">Regulatory body has issued detailed examples of prohibited social scoring and subliminal technique applications.</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Published February 20, 2025</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentLanguage === 'de' ? 'Berichtsstatus' : 'Reporting Status'}</h2>
              <Link href="/reports">
                <Button variant="outline">{currentLanguage === 'de' ? 'Alle Berichte' : 'All Reports'}</Button>
              </Link>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Konformitätserklärungen' : 'Declarations of Conformity'}</span>
                      <span className="text-sm font-medium">86%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '86%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Risikobewertungsberichte' : 'Risk Assessment Reports'}</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Technische Dokumentation' : 'Technical Documentation'}</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Qualitätsmanagementsysteme' : 'Quality Management Systems'}</span>
                      <span className="text-sm font-medium">54%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '54%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{currentLanguage === 'de' ? 'Menschliche Aufsichtsprotokolle' : 'Human Oversight Logs'}</span>
                      <span className="text-sm font-medium">48%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  const renderOtherTab = (tabName: string) => {
    if (tabName === "AI Systems Inventory") {
      return renderAiInventoryTab();
    } else if (tabName === "Risk Management") {
      return renderRiskManagementTab();
    } else if (tabName === "Legal Validation") {
      return renderLegalValidationTab();
    } else if (tabName === "Regulatory Reporting") {
      return renderRegulatoryReportingTab();
    } else {
      return (
        <div className="py-8 text-center">
          <h3 className="text-xl font-semibold mb-4">{tabName} Module</h3>
          <p className="text-gray-600 mb-6">This dashboard module is coming soon in a future update.</p>
          <Button variant="outline" onClick={() => setActiveTab("euAiAct")}>
            Return to EU AI Act Dashboard
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Executive Dashboard</h1>
        <p className="text-gray-600">Overview of your organization's regulatory compliance and AI systems</p>
      </div>

      <Tabs defaultValue="euAiAct" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="euAiAct" className="text-sm">EU AI Act Compliance</TabsTrigger>
          <TabsTrigger value="aiInventory" className="text-sm">AI Systems Inventory</TabsTrigger>
          <TabsTrigger value="riskManagement" className="text-sm">Risk Management</TabsTrigger>
          <TabsTrigger value="legalValidation" className="text-sm">Legal Validation</TabsTrigger>
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
        
        <TabsContent value="legalValidation">
          {renderLegalValidationTab()}
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