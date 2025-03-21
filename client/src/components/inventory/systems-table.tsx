import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertTriangleIcon, FilterIcon, DownloadIcon, PlusIcon, SearchIcon, MoreHorizontalIcon, ViewIcon, EditIcon, TrashIcon, MoreVerticalIcon, SlidersHorizontalIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { format } from "date-fns";

export function SystemsTable() {
  const { data: systems, isLoading, error } = useQuery({
    queryKey: ["/api/systems"],
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter systems based on search query
  const filteredSystems = systems?.filter((system: any) => {
    if (!searchQuery) return true;
    return (
      system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.systemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.vendor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Get risk badge styling
  const getRiskBadgeProps = (riskLevel: string) => {
    if (riskLevel === "High") {
      return { 
        variant: "outline", 
        className: "bg-[#dc2626]/10 hover:bg-[#dc2626]/10 text-[#dc2626] border-[#dc2626]/20"
      };
    }
    if (riskLevel === "Limited") {
      return { 
        variant: "outline", 
        className: "bg-[#f59e0b]/10 hover:bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20"
      };
    }
    return { 
      variant: "outline", 
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search systems..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-10">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
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
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" className="h-10">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button size="sm" className="h-10">
            <PlusIcon className="h-4 w-4 mr-2" />
            Register New System
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>System Name</TableHead>
              <TableHead>Vendor/Provider</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Implementation Date</TableHead>
              <TableHead>Last Assessment</TableHead>
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
            ) : filteredSystems?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-sm text-neutral-500">
                    <p>No systems found</p>
                    {searchQuery && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => setSearchQuery("")}
                        className="mt-1"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSystems?.map((system: any) => (
                <TableRow key={system.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div className="font-medium">{system.name}</div>
                    <div className="text-xs text-neutral-500">{system.systemId}</div>
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
                      <div className="w-24 h-1.5 bg-neutral-200 rounded-full mr-2">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(system.docCompleteness + system.trainingCompleteness) / 2}%` }}
                        />
                      </div>
                      <span className="text-xs">{Math.round((system.docCompleteness + system.trainingCompleteness) / 2)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(system.implementationDate)}</TableCell>
                  <TableCell>{formatDate(system.lastAssessmentDate)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ViewIcon className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <EditIcon className="h-4 w-4 mr-2" />
                          Edit System
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Run Assessment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Manage Documentation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View Training
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
      
      {filteredSystems && filteredSystems.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Showing {filteredSystems.length} of {systems.length} systems
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
