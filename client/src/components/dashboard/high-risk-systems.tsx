import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, MoreHorizontalIcon, Bot, CodeIcon, LineChartIcon, MessageSquareIcon, PiggyBankIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function HighRiskSystems() {
  const { data: systems, isLoading, error } = useQuery({
    queryKey: ["/api/systems/high-risk"],
  });
  
  // Map system names to appropriate icons
  const getSystemIcon = (name: string) => {
    if (name.toLowerCase().includes("candidate") || name.toLowerCase().includes("hr")) 
      return <Bot className="h-4 w-4 text-[#dc2626]" />;
    if (name.toLowerCase().includes("chatbot") || name.toLowerCase().includes("service")) 
      return <MessageSquareIcon className="h-4 w-4 text-[#dc2626]" />;
    if (name.toLowerCase().includes("fraud") || name.toLowerCase().includes("finance")) 
      return <LineChartIcon className="h-4 w-4 text-[#dc2626]" />;
    if (name.toLowerCase().includes("ad") || name.toLowerCase().includes("target")) 
      return <PiggyBankIcon className="h-4 w-4 text-[#dc2626]" />;
    if (name.toLowerCase().includes("code") || name.toLowerCase().includes("analysis")) 
      return <CodeIcon className="h-4 w-4 text-[#dc2626]" />;
    return <AlertTriangleIcon className="h-4 w-4 text-[#dc2626]" />;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-neutral-800">High-Risk Systems Overview</CardTitle>
          <Link href="/inventory">
            <Button variant="link" size="sm" className="text-primary">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>System Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Documentation</TableHead>
                <TableHead>Training</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-10 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-neutral-500">
                    Failed to load high-risk systems
                  </TableCell>
                </TableRow>
              ) : systems?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-neutral-500">
                    No high-risk systems found
                  </TableCell>
                </TableRow>
              ) : (
                systems?.map((system: any) => (
                  <TableRow key={system.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-red-100 flex items-center justify-center mr-3">
                          {getSystemIcon(system.name)}
                        </div>
                        <div>
                          <div className="font-medium text-neutral-800">{system.name}</div>
                          <div className="text-xs text-neutral-500">{system.systemId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-600">{system.department}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-[#dc2626]/10 text-[#dc2626] text-xs rounded-full font-medium">
                        High ({system.riskScore || "N/A"})
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-16 h-1.5 bg-neutral-200 rounded-full mr-2">
                          <div 
                            className={`h-full rounded-full ${getProgressColorClass(system.docCompleteness)}`} 
                            style={{ width: `${system.docCompleteness}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-600">{system.docCompleteness}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-16 h-1.5 bg-neutral-200 rounded-full mr-2">
                          <div 
                            className={`h-full rounded-full ${getProgressColorClass(system.trainingCompleteness)}`} 
                            style={{ width: `${system.trainingCompleteness}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-600">{system.trainingCompleteness}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit System</DropdownMenuItem>
                          <DropdownMenuItem>Add Documentation</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Assessment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="sm">
            Export to CSV
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-500">
              Showing {systems?.length || 0} of {systems?.length || 0} systems
            </span>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getProgressColorClass(value: number): string {
  if (value >= 80) return "bg-[#16a34a]";
  if (value >= 50) return "bg-[#f59e0b]";
  return "bg-[#dc2626]";
}
