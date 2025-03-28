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
  AlertCircleIcon,
  XIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { format } from "date-fns";
import { SystemDetailView } from "@/components/inventory/system-detail-view";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { LegalValidationPanel } from "@/components/legal/legal-validation-panel";
import axios from "axios";

// Note: No mock data needed, we always fetch from the API
// and handle loading/error states appropriately

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
  
  // Legal validation dialog state
  const [legalValidationOpen, setLegalValidationOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<any>(null);
  
  // API data fetching with error handling
  const { data: systems, isLoading, error, isError } = useQuery({
    queryKey: ["/api/systems"],
    // Add error retry to handle temporary database connectivity issues
    retry: 3,
    retryDelay: 1000
  });
  
  // Use data from API, show empty state if there's an error or no data
  const systemsData = systems && Array.isArray(systems) && systems.length > 0 
    ? systems 
    : [];
  
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
  
  // Get unique departments for filtering using a different approach
  const departmentsMap: {[key: string]: boolean} = {};
  systemsData.forEach((system: any) => {
    if (system.department) departmentsMap[system.department] = true;
  });
  const departments = Object.keys(departmentsMap);
  
  // Get unique statuses for filtering using a different approach
  const statusesMap: {[key: string]: boolean} = {};
  systemsData.forEach((system: any) => {
    if (system.status) statusesMap[system.status] = true;
  });
  const statuses = Object.keys(statusesMap);
  
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
  
  // Render retry button for database errors
  const handleRetry = () => {
    window.location.reload();
  };
  
  // Handle legal validation
  const handleLegalValidation = (system: any) => {
    setSelectedSystem(system);
    setLegalValidationOpen(true);
  };
  
  // Render systems table
  return (
    <div className="space-y-4">
      {/* Legal Validation Dialog */}
      <Dialog open={legalValidationOpen} onOpenChange={setLegalValidationOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Legal Validation: {selectedSystem?.name}</DialogTitle>
            <DialogDescription>
              Verify EU AI Act compliance for this system with automated or expert legal review.
            </DialogDescription>
          </DialogHeader>
          
          <LegalValidationPanel
            systemId={selectedSystem?.id.toString()}
            systemName={selectedSystem?.name}
            systemDescription={selectedSystem?.description}
            riskLevel={selectedSystem?.riskLevel}
            onClose={() => setLegalValidationOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Error message if database connection failed */}
      {isError && (
        <div className="flex items-center justify-between px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
          <div className="flex items-center">
            <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mr-3" />
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> We're temporarily using local data because of a database connection issue. Some features may be limited.
            </p>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="ml-4 text-xs h-8"
          >
            Retry Connection
          </Button>
        </div>
      )}
      
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
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircleIcon className="h-10 w-10 text-yellow-500 mb-2" />
                    <p className="font-medium text-base mb-1">Connection Error</p>
                    <p className="text-sm text-neutral-500 mb-3">We couldn't connect to the database. Please try again later.</p>
                    <Button variant="default" size="sm" onClick={() => window.location.reload()}>
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Retry Connection
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSystems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    {(searchQuery || riskFilter || complianceFilter || departmentFilter || statusFilter) ? (
                      <>
                        <SearchXIcon className="h-10 w-10 text-neutral-300 mb-2" />
                        <p className="font-medium text-base mb-1">No matching systems found</p>
                        <p className="text-sm text-neutral-500 mb-3">Try adjusting your search or filters</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSearchQuery("");
                            setRiskFilter(null);
                            setComplianceFilter(null);
                            setDepartmentFilter(null);
                            setStatusFilter(null);
                          }}
                        >
                          Clear all filters
                        </Button>
                      </>
                    ) : (
                      <>
                        <FolderIcon className="h-10 w-10 text-neutral-300 mb-2" />
                        <p className="font-medium text-base mb-1">No AI Systems Found</p>
                        <p className="text-sm text-neutral-500 mb-3">Register your first AI system to start managing compliance</p>
                        <Button 
                          variant="default" 
                          onClick={() => window.location.href = '/register-system'}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Register New System
                        </Button>
                      </>
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
                        <DropdownMenuItem onClick={() => handleLegalValidation(system)}>
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          Legal Validation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart2Icon className="h-4 w-4 mr-2" />
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
