import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangleIcon, 
  FilterIcon, 
  DownloadIcon, 
  PlusIcon, 
  SearchIcon, 
  MoreHorizontalIcon, 
  ViewIcon, 
  EditIcon, 
  TrashIcon, 
  SlidersHorizontalIcon,
  FileTextIcon,
  ClipboardCheckIcon,
  CalendarIcon,
  BarChart2Icon,
  ChevronDownIcon,
  CheckIcon,
  AlertCircleIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { format } from "date-fns";
import { SystemDetailView } from "@/components/inventory/system-detail-view";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock system data for development purposes
const mockSystems = [
  {
    id: 1,
    systemId: "AI-SYS-001",
    name: "Customer Service AI Assistant",
    description: "AI assistant for customer service representatives",
    vendor: "TechAI Solutions",
    department: "Customer Support",
    riskLevel: "High",
    riskScore: 78,
    docCompleteness: 65,
    trainingCompleteness: 80,
    implementationDate: "2023-09-15",
    lastAssessmentDate: "2024-02-20",
    version: "2.1.3",
    status: "Active",
    hasCompliance: true,
    hasCriticalIssues: true
  },
  {
    id: 2,
    systemId: "AI-SYS-002",
    name: "Product Recommendation Engine",
    description: "AI system for product recommendations based on user behavior",
    vendor: "DataSense Inc.",
    department: "Marketing",
    riskLevel: "Limited",
    riskScore: 42,
    docCompleteness: 75,
    trainingCompleteness: 90,
    implementationDate: "2023-06-10",
    lastAssessmentDate: "2024-01-15",
    version: "1.8.2",
    status: "Active",
    hasCompliance: true,
    hasCriticalIssues: false
  },
  {
    id: 3,
    systemId: "AI-SYS-003",
    name: "Document Analysis System",
    description: "AI for analyzing and extracting information from documents",
    vendor: "DocuAI",
    department: "Legal",
    riskLevel: "High",
    riskScore: 68,
    docCompleteness: 50,
    trainingCompleteness: 60,
    implementationDate: "2023-11-20",
    lastAssessmentDate: "2024-02-05",
    version: "1.2.0",
    status: "Active",
    hasCompliance: false,
    hasCriticalIssues: true
  },
  {
    id: 4,
    systemId: "AI-SYS-004",
    name: "HR Resume Screening",
    description: "AI system for initial resume screening and candidate ranking",
    vendor: "TalentAI",
    department: "Human Resources",
    riskLevel: "High",
    riskScore: 72,
    docCompleteness: 40,
    trainingCompleteness: 65,
    implementationDate: "2023-08-05",
    lastAssessmentDate: "2024-01-10",
    version: "2.0.1",
    status: "Under Review",
    hasCompliance: false,
    hasCriticalIssues: true
  },
  {
    id: 5,
    systemId: "AI-SYS-005",
    name: "Content Moderation AI",
    description: "AI system for moderating user-generated content",
    vendor: "SafeContent Technologies",
    department: "Community Management",
    riskLevel: "Limited",
    riskScore: 48,
    docCompleteness: 80,
    trainingCompleteness: 85,
    implementationDate: "2023-07-15",
    lastAssessmentDate: "2024-01-20",
    version: "3.1.4",
    status: "Active",
    hasCompliance: true,
    hasCriticalIssues: false
  },
  {
    id: 6,
    systemId: "AI-SYS-006",
    name: "Financial Fraud Detection",
    description: "AI for detecting fraudulent financial transactions",
    vendor: "SecureFinance AI",
    department: "Finance",
    riskLevel: "High",
    riskScore: 85,
    docCompleteness: 90,
    trainingCompleteness: 95,
    implementationDate: "2023-05-10",
    lastAssessmentDate: "2024-02-10",
    version: "4.2.0",
    status: "Active",
    hasCompliance: true,
    hasCriticalIssues: false
  },
  {
    id: 7,
    systemId: "AI-SYS-007",
    name: "Inventory Forecasting",
    description: "AI for predicting inventory needs based on historical data",
    vendor: "SmartStock AI",
    department: "Supply Chain",
    riskLevel: "Minimal",
    riskScore: 25,
    docCompleteness: 60,
    trainingCompleteness: 70,
    implementationDate: "2023-10-05",
    lastAssessmentDate: "2024-01-05",
    version: "1.5.3",
    status: "Active",
    hasCompliance: true,
    hasCriticalIssues: false
  },
  {
    id: 8,
    systemId: "AI-SYS-008",
    name: "Customer Sentiment Analysis",
    description: "AI for analyzing customer feedback and sentiment",
    vendor: "InsightAI",
    department: "Customer Support",
    riskLevel: "Limited",
    riskScore: 35,
    docCompleteness: 85,
    trainingCompleteness: 80,
    implementationDate: "2023-09-25",
    lastAssessmentDate: "2024-02-25",
    version: "2.3.1",
    status: "Active",
    hasCompliance: true,
    hasCriticalIssues: false
  },
  {
    id: 9,
    systemId: "AI-SYS-009",
    name: "Automated Quality Control",
    description: "AI for manufacturing quality control and defect detection",
    vendor: "QualityAI",
    department: "Manufacturing",
    riskLevel: "Limited",
    riskScore: 45,
    docCompleteness: 70,
    trainingCompleteness: 75,
    implementationDate: "2023-04-15",
    lastAssessmentDate: "2024-01-15",
    version: "3.0.2",
    status: "Maintenance",
    hasCompliance: true,
    hasCriticalIssues: false
  },
  {
    id: 10,
    systemId: "AI-SYS-010",
    name: "Predictive Maintenance System",
    description: "AI for predicting equipment failures and maintenance needs",
    vendor: "MaintenanceAI",
    department: "Operations",
    riskLevel: "Minimal",
    riskScore: 30,
    docCompleteness: 80,
    trainingCompleteness: 85,
    implementationDate: "2023-08-20",
    lastAssessmentDate: "2024-02-15",
    version: "2.4.0",
    status: "Active",
    hasCompliance: true,
    hasCriticalIssues: false
  }
];

export function SystemsTable() {
  // State management
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [complianceFilter, setComplianceFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // API data fetching - using mock data for development
  const { data: systems, isLoading, error } = useQuery({
    queryKey: ["/api/systems"],
  });
  
  // Use mock data while API endpoint is being developed
  const systemsData = systems || mockSystems;
  
  // Filter systems based on search query and selected filters
  const filteredSystems = systemsData.filter((system: any) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.systemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (system.vendor && system.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Risk level filter
    const matchesRisk = !riskFilter || system.riskLevel === riskFilter;
    
    // Compliance filter
    const matchesCompliance = !complianceFilter || 
      (complianceFilter === "Compliant" && system.hasCompliance) ||
      (complianceFilter === "Non-Compliant" && !system.hasCompliance);
    
    // Department filter
    const matchesDepartment = !departmentFilter || system.department === departmentFilter;
    
    // Status filter
    const matchesStatus = !statusFilter || system.status === statusFilter;
    
    return matchesSearch && matchesRisk && matchesCompliance && matchesDepartment && matchesStatus;
  })
  // Sort systems based on selected field and direction
  .sort((a: any, b: any) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortField === "riskScore") {
      return sortDirection === "asc" 
        ? a.riskScore - b.riskScore
        : b.riskScore - a.riskScore;
    }
    if (sortField === "compliance") {
      const aCompliance = (a.docCompleteness + a.trainingCompleteness) / 2;
      const bCompliance = (b.docCompleteness + b.trainingCompleteness) / 2;
      return sortDirection === "asc" 
        ? aCompliance - bCompliance
        : bCompliance - aCompliance;
    }
    if (sortField === "date") {
      const aDate = new Date(a.implementationDate).getTime();
      const bDate = new Date(b.implementationDate).getTime();
      return sortDirection === "asc" 
        ? aDate - bDate
        : bDate - aDate;
    }
    return 0;
  });
  
  // Get unique departments for filtering
  const departments = [...new Set(systemsData.map((system: any) => system.department))];
  
  // Get unique statuses for filtering
  const statuses = [...new Set(systemsData.map((system: any) => system.status))];
  
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
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (err) {
      return "Invalid date";
    }
  };
  
  // Handle system detail view
  const handleViewDetails = (systemId: string) => {
    setSelectedSystemId(systemId);
    setShowDetailView(true);
  };
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return (
      <div className="inline-block ml-1">
        {sortDirection === "asc" ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 transform rotate-180" />
        )}
      </div>
    );
  };

  // Render system detail view if a system is selected
  if (showDetailView && selectedSystemId) {
    return (
      <SystemDetailView 
        systemId={selectedSystemId} 
        onBack={() => setShowDetailView(false)} 
      />
    );
  }
  
  // Render systems table
  return (
    <div className="space-y-4">
      {/* Advanced filters for the table */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative max-w-md flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by name, ID, department..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                  {(riskFilter || complianceFilter || departmentFilter || statusFilter) && (
                    <Badge className="ml-2 bg-primary/20 text-primary">
                      {[riskFilter, complianceFilter, departmentFilter, statusFilter].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Risk Level</p>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={riskFilter === "High"}
                      onCheckedChange={() => setRiskFilter(riskFilter === "High" ? null : "High")}
                    >
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      High Risk
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={riskFilter === "Limited"}
                      onCheckedChange={() => setRiskFilter(riskFilter === "Limited" ? null : "Limited")}
                    >
                      <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                      Limited Risk
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={riskFilter === "Minimal"}
                      onCheckedChange={() => setRiskFilter(riskFilter === "Minimal" ? null : "Minimal")}
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Minimal Risk
                    </DropdownMenuCheckboxItem>
                  </div>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  <p className="text-sm font-medium mb-2">Compliance Status</p>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={complianceFilter === "Compliant"}
                      onCheckedChange={() => setComplianceFilter(complianceFilter === "Compliant" ? null : "Compliant")}
                    >
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      Compliant
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={complianceFilter === "Non-Compliant"}
                      onCheckedChange={() => setComplianceFilter(complianceFilter === "Non-Compliant" ? null : "Non-Compliant")}
                    >
                      <AlertCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                      Non-Compliant
                    </DropdownMenuCheckboxItem>
                  </div>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  <p className="text-sm font-medium mb-2">Department</p>
                  <Select
                    value={departmentFilter || ""}
                    onValueChange={(value) => setDepartmentFilter(value || null)}
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {departments.map((dept: string) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  <p className="text-sm font-medium mb-2">Status</p>
                  <Select
                    value={statusFilter || ""}
                    onValueChange={(value) => setStatusFilter(value || null)}
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      {statuses.map((status: string) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-3 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setRiskFilter(null);
                        setComplianceFilter(null);
                        setDepartmentFilter(null);
                        setStatusFilter(null);
                      }}
                    >
                      Clear All
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <SlidersHorizontalIcon className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">System Name</span>
                    <Switch checked={true} disabled />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">Vendor/Provider</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">Department</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">Risk Level</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">Compliance Status</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">Implementation Date</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">Last Assessment</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">Status</span>
                    <Switch checked={true} />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <BarChart2Icon className="h-4 w-4 mr-2" />
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("name")}>
                  {sortField === "name" && sortDirection === "asc" ? (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="w-4 mr-2" />
                  )}
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("name");
                  setSortDirection("desc");
                }}>
                  {sortField === "name" && sortDirection === "desc" ? (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="w-4 mr-2" />
                  )}
                  Name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("riskScore");
                  setSortDirection("desc");
                }}>
                  {sortField === "riskScore" && sortDirection === "desc" ? (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="w-4 mr-2" />
                  )}
                  Highest Risk First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("riskScore");
                  setSortDirection("asc");
                }}>
                  {sortField === "riskScore" && sortDirection === "asc" ? (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="w-4 mr-2" />
                  )}
                  Lowest Risk First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("compliance");
                  setSortDirection("asc");
                }}>
                  {sortField === "compliance" && sortDirection === "asc" ? (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="w-4 mr-2" />
                  )}
                  Lowest Compliance First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("compliance");
                  setSortDirection("desc");
                }}>
                  {sortField === "compliance" && sortDirection === "desc" ? (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="w-4 mr-2" />
                  )}
                  Highest Compliance First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("date");
                  setSortDirection("desc");
                }}>
                  {sortField === "date" && sortDirection === "desc" ? (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="w-4 mr-2" />
                  )}
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("date");
                  setSortDirection("asc");
                }}>
                  {sortField === "date" && sortDirection === "asc" ? (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <div className="w-4 mr-2" />
                  )}
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" className="h-10">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              className="h-10"
              onClick={() => window.location.href = "/register-system"}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Register New System
            </Button>
          </div>
        </div>
        
        {/* Active filters display */}
        {(riskFilter || complianceFilter || departmentFilter || statusFilter) && (
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="text-neutral-500 mr-1">Active filters:</div>
            
            {riskFilter && (
              <Badge variant="outline" className="bg-neutral-100 pl-1.5 pr-1">
                {riskFilter} Risk
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-neutral-200"
                  onClick={() => setRiskFilter(null)}
                >
                  <span className="sr-only">Remove filter</span>
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {complianceFilter && (
              <Badge variant="outline" className="bg-neutral-100 pl-1.5 pr-1">
                {complianceFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-neutral-200"
                  onClick={() => setComplianceFilter(null)}
                >
                  <span className="sr-only">Remove filter</span>
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {departmentFilter && (
              <Badge variant="outline" className="bg-neutral-100 pl-1.5 pr-1">
                Department: {departmentFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-neutral-200"
                  onClick={() => setDepartmentFilter(null)}
                >
                  <span className="sr-only">Remove filter</span>
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {statusFilter && (
              <Badge variant="outline" className="bg-neutral-100 pl-1.5 pr-1">
                Status: {statusFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-neutral-200"
                  onClick={() => setStatusFilter(null)}
                >
                  <span className="sr-only">Remove filter</span>
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(riskFilter || complianceFilter || departmentFilter || statusFilter) && (
              <Button 
                variant="link" 
                size="sm" 
                className="h-5 px-1 text-xs"
                onClick={() => {
                  setRiskFilter(null);
                  setComplianceFilter(null);
                  setDepartmentFilter(null);
                  setStatusFilter(null);
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Systems table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-neutral-50" 
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  System Name {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead>Vendor/Provider</TableHead>
              <TableHead>Department</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-neutral-50" 
                onClick={() => handleSort("riskScore")}
              >
                <div className="flex items-center">
                  Risk Level {getSortIcon("riskScore")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-neutral-50" 
                onClick={() => handleSort("compliance")}
              >
                <div className="flex items-center">
                  Compliance {getSortIcon("compliance")}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-neutral-50" 
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Implementation {getSortIcon("date")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-sm text-neutral-500">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500 mb-1" />
                    <p>Failed to load systems</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSystems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-sm text-neutral-500">
                    <p>No systems found</p>
                    {(searchQuery || riskFilter || complianceFilter || departmentFilter || statusFilter) && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => {
                          setSearchQuery("");
                          setRiskFilter(null);
                          setComplianceFilter(null);
                          setDepartmentFilter(null);
                          setStatusFilter(null);
                        }}
                        className="mt-1"
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSystems.map((system: any) => (
                <TableRow key={system.id} className="hover:bg-neutral-50 cursor-pointer" onClick={() => handleViewDetails(system.id.toString())}>
                  <TableCell>
                    <div className="font-medium">{system.name}</div>
                    <div className="text-xs text-neutral-500 flex items-center">
                      <span className="font-mono">{system.systemId}</span>
                      {system.hasCriticalIssues && (
                        <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                          Issues
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{system.vendor || "N/A"}</TableCell>
                  <TableCell>{system.department}</TableCell>
                  <TableCell>
                    <Badge 
                      {...getRiskBadgeProps(system.riskLevel)}
                    >
                      {system.riskLevel} {system.riskScore ? `(${system.riskScore})` : ""}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-20 h-1.5 bg-neutral-200 rounded-full mr-2">
                        <div 
                          className={`h-full rounded-full ${(system.docCompleteness + system.trainingCompleteness) / 2 >= 70 ? 'bg-green-500' : (system.docCompleteness + system.trainingCompleteness) / 2 >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${(system.docCompleteness + system.trainingCompleteness) / 2}%` }}
                        />
                      </div>
                      <span className="text-xs">{Math.round((system.docCompleteness + system.trainingCompleteness) / 2)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        system.status === "Active" 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : system.status === "Under Review"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-blue-100 text-blue-800 border-blue-200"
                      }
                    >
                      {system.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(system.implementationDate)}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(system.id.toString())}>
                          <ViewIcon className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <EditIcon className="h-4 w-4 mr-2" />
                          Edit System
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                          Run Assessment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          Manage Documentation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Schedule Review
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Delete System
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Table pagination and summary */}
      {filteredSystems && filteredSystems.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Showing {filteredSystems.length} of {systemsData.length} systems
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
