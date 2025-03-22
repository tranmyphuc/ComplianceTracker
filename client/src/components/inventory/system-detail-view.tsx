import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangleIcon, 
  ClipboardListIcon, 
  ClockIcon, 
  FileTextIcon, 
  InfoIcon, 
  UserIcon, 
  ShieldIcon, 
  ServerIcon, 
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  XIcon,
  EditIcon,
  DownloadIcon,
  ArrowLeftIcon
} from "lucide-react";

interface SystemDetailViewProps {
  systemId: string;
  onBack: () => void;
}

export function SystemDetailView({ systemId, onBack }: SystemDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // This would normally fetch from the API
  const { data: system, isLoading, error } = useQuery({
    queryKey: [`/api/systems/${systemId}`],
  });
  
  // Mock data for the system details
  const mockSystem = {
    id: 1,
    systemId: "AI-SYS-001",
    name: "Customer Service AI Assistant",
    description: "An AI-powered assistant that helps customer service representatives by providing real-time recommendations and automated responses to common customer inquiries.",
    version: "2.1.3",
    riskLevel: "High",
    riskScore: 78,
    vendor: "TechAI Solutions",
    department: "Customer Support",
    owner: "Sarah Johnson",
    implementationDate: "2023-09-15",
    lastAssessmentDate: "2024-02-20",
    expectedLifetime: "5 years",
    maintenanceSchedule: "Quarterly",
    deploymentScope: "Customer Service Department (42 users)",
    primaryPurpose: "Automate responses to customer inquiries",
    capabilities: [
      "Natural language understanding",
      "Sentiment analysis",
      "Response generation",
      "Customer query classification",
      "Escalation recommendation"
    ],
    dataSources: [
      "Customer interaction history",
      "Product knowledge base",
      "Service request database"
    ],
    trainingDataDescription: "Customer service interactions from the past 3 years, manually annotated by subject matter experts.",
    complianceStatus: {
      docCompleteness: 65,
      trainingCompleteness: 80,
      testingCompleteness: 70,
      oversightCompleteness: 60,
      riskManagementCompleteness: 50,
      overallCompleteness: 65
    },
    documents: [
      { id: 1, title: "Technical Documentation", status: "Completed", lastUpdated: "2024-01-15" },
      { id: 2, title: "Data Governance Plan", status: "In Progress", lastUpdated: "2024-02-05" },
      { id: 3, title: "Risk Assessment Report", status: "Completed", lastUpdated: "2024-02-18" },
      { id: 4, title: "Human Oversight Procedures", status: "Draft", lastUpdated: "2024-01-30" },
      { id: 5, title: "Accuracy & Performance Report", status: "Not Started", lastUpdated: null }
    ],
    complianceIssues: [
      { 
        id: 1, 
        severity: "Critical", 
        description: "Missing documentation on human oversight mechanisms", 
        recommendation: "Create and implement procedures for human oversight of AI decisions",
        dueDate: "2024-04-15",
        status: "Open"
      },
      { 
        id: 2, 
        severity: "Medium", 
        description: "Incomplete data governance documentation", 
        recommendation: "Update data governance plan with data quality measures and bias detection procedures",
        dueDate: "2024-04-30",
        status: "In Progress"
      }
    ],
    upcomingDeadlines: [
      {
        id: 1,
        title: "Complete Human Oversight Documentation",
        dueDate: "2024-04-15",
        description: "Document procedures for human oversight of AI-generated responses"
      },
      {
        id: 2,
        title: "Quarterly Risk Assessment",
        dueDate: "2024-04-01",
        description: "Conduct quarterly risk assessment and update documentation"
      }
    ],
    integrations: [
      { id: 1, name: "Customer Database", type: "Database", direction: "Bi-directional" },
      { id: 2, name: "Knowledge Base API", type: "API", direction: "Input" },
      { id: 3, name: "Ticketing System", type: "Application", direction: "Output" },
      { id: 4, name: "Email Service", type: "Service", direction: "Output" }
    ],
    changeHistory: [
      { 
        id: 1, 
        date: "2024-02-15", 
        type: "Version Update", 
        description: "Updated from v2.1.2 to v2.1.3",
        user: "System Admin",
        impactAssessment: "Minor update with bug fixes, no significant impact on risk level"
      },
      { 
        id: 2, 
        date: "2024-01-10", 
        type: "Feature Addition", 
        description: "Added sentiment analysis capability",
        user: "Development Team",
        impactAssessment: "Medium impact - new capability requires updated documentation"
      },
      { 
        id: 3, 
        date: "2023-11-22", 
        type: "Data Update", 
        description: "Updated training data with new customer interactions",
        user: "Data Team",
        impactAssessment: "Low impact - expanded training data improves performance"
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
        <AlertTriangleIcon className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm">Failed to load system details</p>
      </div>
    );
  }

  const systemData = system || mockSystem;
  
  // Get risk badge styling
  const getRiskBadgeProps = (riskLevel: string) => {
    if (riskLevel === "High") {
      return { 
        variant: "outline" as const, 
        className: "bg-[#dc2626]/10 hover:bg-[#dc2626]/10 text-[#dc2626] border-[#dc2626]/20"
      };
    }
    if (riskLevel === "Limited") {
      return { 
        variant: "outline" as const, 
        className: "bg-[#f59e0b]/10 hover:bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20"
      };
    }
    return { 
      variant: "outline" as const, 
      className: "bg-[#16a34a]/10 hover:bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20"
    };
  };
  
  const getDocStatusBadge = (status: string) => {
    if (status === "Completed") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    }
    if (status === "In Progress") {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
    }
    if (status === "Draft") {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Draft</Badge>;
    }
    return <Badge className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100">Not Started</Badge>;
  };
  
  const getIssueSeverityBadge = (severity: string) => {
    if (severity === "Critical") {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>;
    }
    if (severity === "High") {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
    }
    if (severity === "Medium") {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>;
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (err) {
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="mr-2"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold">{systemData.name}</h2>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <EditIcon className="h-4 w-4 mr-1" />
            Edit System
          </Button>
        </div>
      </div>
      
      {/* System ID and Risk Level */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
        <div className="flex items-center">
          <div className="text-sm text-neutral-500 mr-2">System ID:</div>
          <div className="font-mono text-sm bg-neutral-100 px-2 py-0.5 rounded">{systemData.systemId}</div>
        </div>
        
        <div className="flex items-center">
          <div className="text-sm text-neutral-500 mr-2">Risk Level:</div>
          <Badge {...getRiskBadgeProps(systemData.riskLevel)}>
            {systemData.riskLevel} {systemData.riskScore ? `(${systemData.riskScore})` : ""}
          </Badge>
        </div>
        
        <div className="flex items-center">
          <div className="text-sm text-neutral-500 mr-2">Version:</div>
          <div className="text-sm">{systemData.version}</div>
        </div>
      </div>
      
      {/* Content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none pb-px mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="change-history">Change History</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">System Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700">{systemData.description}</p>
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Primary Purpose</div>
                    <p className="text-neutral-700">{systemData.primaryPurpose}</p>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">System Capabilities</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {systemData.capabilities.map((capability, index) => (
                        <li key={index} className="text-neutral-700">{capability}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Data Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {systemData.dataSources.map((source, index) => (
                        <li key={index} className="text-neutral-700">{source}</li>
                      ))}
                    </ul>
                    
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Training Data</div>
                      <p className="text-neutral-700">{systemData.trainingDataDescription}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">System Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center mb-1">
                        <CalendarIcon className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-sm font-medium">Implementation Date</span>
                      </div>
                      <p className="text-neutral-700 pl-6">{formatDate(systemData.implementationDate)}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <CalendarIcon className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-sm font-medium">Last Assessment</span>
                      </div>
                      <p className="text-neutral-700 pl-6">{formatDate(systemData.lastAssessmentDate)}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <ClockIcon className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-sm font-medium">Expected Lifetime</span>
                      </div>
                      <p className="text-neutral-700 pl-6">{systemData.expectedLifetime}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <ClockIcon className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-sm font-medium">Maintenance Schedule</span>
                      </div>
                      <p className="text-neutral-700 pl-6">{systemData.maintenanceSchedule}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ownership & Responsibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <UserIcon className="h-4 w-4 text-neutral-500 mr-2" />
                      <span className="text-sm font-medium">System Owner</span>
                    </div>
                    <p className="text-neutral-700 pl-6">{systemData.owner}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <ServerIcon className="h-4 w-4 text-neutral-500 mr-2" />
                      <span className="text-sm font-medium">Department</span>
                    </div>
                    <p className="text-neutral-700 pl-6">{systemData.department}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <InfoIcon className="h-4 w-4 text-neutral-500 mr-2" />
                      <span className="text-sm font-medium">Vendor/Provider</span>
                    </div>
                    <p className="text-neutral-700 pl-6">{systemData.vendor}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <UserIcon className="h-4 w-4 text-neutral-500 mr-2" />
                      <span className="text-sm font-medium">Deployment Scope</span>
                    </div>
                    <p className="text-neutral-700 pl-6">{systemData.deploymentScope}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemData.upcomingDeadlines.map(deadline => (
                      <div key={deadline.id} className="border-l-2 border-amber-500 pl-3 py-0.5">
                        <div className="font-medium">{deadline.title}</div>
                        <div className="flex items-center text-sm text-neutral-500 mt-1">
                          <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                          <span>Due by {formatDate(deadline.dueDate)}</span>
                        </div>
                        <p className="text-sm mt-1">{deadline.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Compliance Dashboard</CardTitle>
                  <CardDescription>Status of compliance requirements based on EU AI Act</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Technical Documentation</span>
                        <span className="text-sm">{systemData.complianceStatus.docCompleteness}%</span>
                      </div>
                      <Progress value={systemData.complianceStatus.docCompleteness} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Training & Validation</span>
                        <span className="text-sm">{systemData.complianceStatus.trainingCompleteness}%</span>
                      </div>
                      <Progress value={systemData.complianceStatus.trainingCompleteness} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Testing & Performance</span>
                        <span className="text-sm">{systemData.complianceStatus.testingCompleteness}%</span>
                      </div>
                      <Progress value={systemData.complianceStatus.testingCompleteness} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Human Oversight</span>
                        <span className="text-sm">{systemData.complianceStatus.oversightCompleteness}%</span>
                      </div>
                      <Progress value={systemData.complianceStatus.oversightCompleteness} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Risk Management</span>
                        <span className="text-sm">{systemData.complianceStatus.riskManagementCompleteness}%</span>
                      </div>
                      <Progress value={systemData.complianceStatus.riskManagementCompleteness} className="h-2" />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Overall Compliance</span>
                        <span>{systemData.complianceStatus.overallCompleteness}%</span>
                      </div>
                      <Progress value={systemData.complianceStatus.overallCompleteness} className="h-3" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-neutral-50 rounded-b-lg pt-3 pb-4">
                  <div className="text-sm text-neutral-600">
                    <div className="flex items-start">
                      <ShieldIcon className="h-4 w-4 text-neutral-500 mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">EU AI Act Compliance Status: </span>
                        {systemData.complianceStatus.overallCompleteness >= 80 ? (
                          <span className="text-green-600">Compliant</span>
                        ) : systemData.complianceStatus.overallCompleteness >= 50 ? (
                          <span className="text-amber-600">Partially Compliant</span>
                        ) : (
                          <span className="text-red-600">Non-Compliant</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Compliance Issues</CardTitle>
                  <CardDescription>Open issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemData.complianceIssues.map(issue => (
                      <div key={issue.id} className="border rounded-md p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <AlertTriangleIcon className="h-5 w-5 text-amber-500 mr-2.5 mt-0.5" />
                            <div>
                              <div className="font-medium">{issue.description}</div>
                              <div className="flex items-center mt-1 space-x-3">
                                {getIssueSeverityBadge(issue.severity)}
                                <span className="text-sm text-neutral-500">Due by {formatDate(issue.dueDate)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            className={issue.status === "Open" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-blue-100 text-blue-800"
                            }
                          >
                            {issue.status}
                          </Badge>
                        </div>
                        
                        <div className="mt-3 ml-7.5 text-sm">
                          <div className="font-medium text-neutral-900">Recommendation:</div>
                          <p className="mt-1 text-neutral-700">{issue.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <div 
                      className="h-36 w-36 rounded-full flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: systemData.riskLevel === "High" ? "#dc2626" : systemData.riskLevel === "Limited" ? "#f59e0b" : "#16a34a" }}
                    >
                      <div className="text-center">
                        <div className="text-3xl font-bold">{systemData.riskScore}</div>
                        <div className="text-sm mt-1">{systemData.riskLevel} Risk</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span>Last assessed on {formatDate(systemData.lastAssessmentDate)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
                      <span>High-risk classification based on Annex III of EU AI Act</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-amber-500 mr-2" />
                      <span>Next assessment due on {formatDate("2024-05-20")}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View Full Risk Assessment</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Compliance Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">Risk Management System</div>
                        <p className="text-xs text-neutral-500 mt-0.5">Implemented and documented</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-3 w-3 bg-amber-600 rounded-full"></div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">Data Governance</div>
                        <p className="text-xs text-neutral-500 mt-0.5">Partial implementation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">Technical Documentation</div>
                        <p className="text-xs text-neutral-500 mt-0.5">Complete and up-to-date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XIcon className="h-3 w-3 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">Human Oversight</div>
                        <p className="text-xs text-neutral-500 mt-0.5">Documentation incomplete</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">Record-Keeping</div>
                        <p className="text-xs text-neutral-500 mt-0.5">Automated logging implemented</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-3 w-3 bg-amber-600 rounded-full"></div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">Accuracy & Robustness</div>
                        <p className="text-xs text-neutral-500 mt-0.5">Testing in progress</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View All Requirements</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Documentation Tab */}
        <TabsContent value="documentation">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Documentation Repository</CardTitle>
                  <Button size="sm">
                    <FileTextIcon className="h-4 w-4 mr-1.5" />
                    Add Document
                  </Button>
                </div>
                <CardDescription>All documentation for EU AI Act compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-md border">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Document Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Updated</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {systemData.documents.map(doc => (
                        <tr key={doc.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileTextIcon className="h-4 w-4 text-neutral-400 mr-2" />
                              <div className="text-sm font-medium text-neutral-900">{doc.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getDocStatusBadge(doc.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {formatDate(doc.lastUpdated)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Download</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Required Documentation</CardTitle>
                  <CardDescription>Based on EU AI Act requirements for high-risk systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-green-500 pl-3 py-1">
                      <div className="font-medium">Technical Documentation</div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Comprehensive documentation of system design, development, and performance metrics
                      </p>
                    </div>
                    
                    <div className="border-l-2 border-amber-500 pl-3 py-1">
                      <div className="font-medium">Risk Management System</div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Documentation of risk identification, assessment, and mitigation measures
                      </p>
                    </div>
                    
                    <div className="border-l-2 border-red-500 pl-3 py-1">
                      <div className="font-medium">Human Oversight Mechanisms</div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Documentation of human oversight procedures, roles, and intervention capabilities
                      </p>
                    </div>
                    
                    <div className="border-l-2 border-amber-500 pl-3 py-1">
                      <div className="font-medium">Data Governance</div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Documentation of data quality measures, bias detection, and privacy controls
                      </p>
                    </div>
                    
                    <div className="border-l-2 border-amber-500 pl-3 py-1">
                      <div className="font-medium">Accuracy & Performance</div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Testing results for accuracy, robustness, and cybersecurity measures
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Documentation Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <BookOpenIcon className="h-5 w-5 text-blue-500 mr-2.5 mt-0.5" />
                      <div>
                        <div className="font-medium">EU AI Act Documentation Templates</div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Access pre-approved templates for all required documentation
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">View Templates</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <ClipboardListIcon className="h-5 w-5 text-blue-500 mr-2.5 mt-0.5" />
                      <div>
                        <div className="font-medium">Documentation Best Practices</div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Guidelines for creating compliant technical documentation
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">Read Guidelines</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-blue-500 mr-2.5 mt-0.5" />
                      <div>
                        <div className="font-medium">AI-Assisted Documentation</div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Generate documentation drafts with AI assistance
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">Start Generation</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Integrations</CardTitle>
              <CardDescription>Data flows and dependencies with other systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-md border">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">System Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Data Flow</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Compliance Impact</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {systemData.integrations.map(integration => (
                      <tr key={integration.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">{integration.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="bg-neutral-100 text-neutral-800">
                            {integration.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            className={
                              integration.direction === "Input" 
                                ? "bg-blue-100 text-blue-800" 
                                : integration.direction === "Output"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }
                          >
                            {integration.direction}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {integration.type === "Database" ? "Data governance required" : 
                           integration.type === "API" ? "API documentation needed" :
                           integration.type === "Service" ? "Service provider assessment" :
                           "Interface documentation"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <div className="flex items-start">
                  <InfoIcon className="h-5 w-5 text-blue-500 mr-2.5 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-800">EU AI Act Integration Requirements</div>
                    <p className="text-sm text-blue-700 mt-1">
                      The EU AI Act requires documentation of all data flows, processing chains, and dependencies. 
                      System integrations must be assessed for their impact on risk classification and compliance requirements.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Change History Tab */}
        <TabsContent value="change-history">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Change History</CardTitle>
              <CardDescription>Record of all system modifications and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {systemData.changeHistory.map((change, index) => (
                  <div key={change.id} className="relative pl-8">
                    {/* Timeline connector */}
                    {index !== systemData.changeHistory.length - 1 && (
                      <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-neutral-200" />
                    )}
                    
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 h-7 w-7 rounded-full bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center">
                      {change.type === "Version Update" ? (
                        <div className="h-3 w-3 bg-green-500 rounded-full" />
                      ) : change.type === "Feature Addition" ? (
                        <div className="h-3 w-3 bg-blue-500 rounded-full" />
                      ) : (
                        <div className="h-3 w-3 bg-amber-500 rounded-full" />
                      )}
                    </div>
                    
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="font-medium">{change.description}</div>
                          <div className="flex items-center mt-1 space-x-3">
                            <Badge 
                              className={
                                change.type === "Version Update" 
                                  ? "bg-green-100 text-green-800" 
                                  : change.type === "Feature Addition"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }
                            >
                              {change.type}
                            </Badge>
                            <span className="text-sm text-neutral-500">{formatDate(change.date)}</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-neutral-500">
                          <span>By: {change.user}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-sm font-medium">Impact Assessment:</div>
                        <p className="text-sm text-neutral-600 mt-1">{change.impactAssessment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <div className="flex items-start">
                  <InfoIcon className="h-5 w-5 text-blue-500 mr-2.5 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-800">Substantial Modification Assessment</div>
                    <p className="text-sm text-blue-700 mt-1">
                      The EU AI Act requires that "substantial modifications" to high-risk AI systems trigger 
                      a reassessment of compliance. All changes must be evaluated for their impact on system 
                      behavior, performance, and risk level.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}