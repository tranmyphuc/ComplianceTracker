import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  FileText as FilePdfIcon,
  FileSpreadsheet as FileSpreadsheetIcon,
  FileJson as FileJsonIcon,
  FileText as FileTextIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  Filter as FilterIcon,
  ChevronDown as ChevronDownIcon,
  Printer as PrinterIcon,
  Search as SearchIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  List as ListIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { CircularProgressIndicator } from "@/components/dashboard/circular-progress";

export default function Reports() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("compliance");
  const [reportType, setReportType] = useState("summary");
  const [timeframe, setTimeframe] = useState("1year");
  const [format, setFormat] = useState("visual");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [systemFilter, setSystemFilter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch departments for filtering
  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/departments"],
  });

  // Fetch systems for filtering
  const { data: systems = [] } = useQuery<any[]>({
    queryKey: ["/api/systems"],
  });

  // Toggle department selection
  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev => 
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  // Generate report
  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      });
    }, 2000);
  };

  // Export report to a specific format
  const exportReport = (format: 'pdf' | 'csv' | 'json') => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your report is being exported...",
    });
    
    // Simulate export
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Report has been exported as ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  // Render different charts based on report type
  const renderReportVisual = () => {
    switch (activeTab) {
      case "compliance":
        return renderComplianceReport();
      case "risk":
        return renderRiskReport();
      case "documentation":
        return renderDocumentationReport();
      case "performance":
        return renderPerformanceReport();
      case "audit":
        return renderAuditReport();
      default:
        return null;
    }
  };

  // Fetch dashboard summary data for compliance report
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery<any>({
    queryKey: ["/api/dashboard/summary"],
  });

  // Render compliance report
  const renderComplianceReport = () => {
    // Get real department compliance data from API
    const complianceData = dashboardData?.departmentCompliance?.map((dept: any) => {
      // Count systems per department
      const deptSystems = systems?.filter((sys: any) => sys.department === dept.name)?.length || 0;
      
      return {
        name: dept.name,
        score: dept.complianceScore,
        systems: deptSystems
      };
    }) || [];
    
    // Generate trend data based on historical or simulated progress
    // In a real production app, this would come from historical data
    const currentMonth = new Date().getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const avgScore = complianceData.reduce((sum: number, dept: any) => sum + dept.score, 0) / (complianceData.length || 1);
    
    const complianceTrendData = monthNames.map((month, index) => {
      // Create a trend that gradually improves to match current compliance level
      let scoreAdjustment = 0;
      if (index <= currentMonth) {
        scoreAdjustment = (index / currentMonth) * avgScore; 
      } else {
        scoreAdjustment = avgScore;
      }
      
      return {
        month,
        score: Math.round(Math.max(50, Math.min(100, scoreAdjustment)))
      };
    });

    const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"];

    if (format === "visual") {
      return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Compliance By Department</CardTitle>
                <CardDescription>Average compliance score across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complianceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#3B82F6" name="Compliance Score" />
                      <Bar dataKey="systems" fill="#8B5CF6" name="AI Systems" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Compliance Trend</CardTitle>
                <CardDescription>Compliance score over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#3B82F6" name="Compliance Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Compliance Metrics</CardTitle>
              <CardDescription>Key compliance indicators across the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex flex-col items-center">
                  <CircularProgressIndicator value={79} size={100} />
                  <span className="mt-2 text-sm font-medium">Overall Compliance</span>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgressIndicator value={92} size={100} progressColor="#22C55E" />
                  <span className="mt-2 text-sm font-medium">Documentation</span>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgressIndicator value={68} size={100} progressColor="#F59E0B" />
                  <span className="mt-2 text-sm font-medium">Risk Management</span>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgressIndicator value={85} size={100} progressColor="#8B5CF6" />
                  <span className="mt-2 text-sm font-medium">Human Oversight</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Compliance Report</CardTitle>
                <CardDescription>Detailed compliance data for all departments</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => exportReport('pdf')}>
                  <FilePdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportReport('csv')}>
                  <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>AI Systems</TableHead>
                    <TableHead>Documentation Status</TableHead>
                    <TableHead>Risk Management</TableHead>
                    <TableHead>Human Oversight</TableHead>
                    <TableHead>Last Assessment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceData.map((dept: any) => (
                    <TableRow key={dept.name}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-2.5 w-16 rounded-full bg-gray-200">
                            <div 
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${dept.score}%` }}
                            />
                          </div>
                          <span>{dept.score}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{dept.systems}</TableCell>
                      <TableCell>{Math.round(dept.score * 0.9)}%</TableCell>
                      <TableCell>{Math.round(dept.score * 0.8)}%</TableCell>
                      <TableCell>{Math.round(dept.score * 1.1) > 100 ? 100 : Math.round(dept.score * 1.1)}%</TableCell>
                      <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  // Render risk report
  const renderRiskReport = () => {
    // Use real risk distribution data from API
    const riskData = dashboardData?.riskDistribution ? [
      { name: "High Risk", value: dashboardData.riskDistribution.high || 0, color: "#EF4444" },
      { name: "Limited Risk", value: dashboardData.riskDistribution.limited || 0, color: "#F59E0B" },
      { name: "Minimal Risk", value: dashboardData.riskDistribution.minimal || 0, color: "#10B981" },
    ] : [];

    // Calculate risk by department using real data
    const riskByDepartmentData = departments?.map((dept: any) => {
      const deptSystems = systems?.filter((sys: any) => sys.department === dept.name) || [];
      
      return {
        name: dept.name,
        high: deptSystems.filter((sys: any) => sys.riskLevel === "High").length,
        limited: deptSystems.filter((sys: any) => sys.riskLevel === "Limited").length,
        minimal: deptSystems.filter((sys: any) => sys.riskLevel === "Minimal").length
      };
    }) || [];

    if (format === "visual") {
      return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>AI systems by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Risk by Department</CardTitle>
                <CardDescription>Distribution of risk levels across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskByDepartmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="high" stackId="a" fill="#EF4444" name="High Risk" />
                      <Bar dataKey="limited" stackId="a" fill="#F59E0B" name="Limited Risk" />
                      <Bar dataKey="minimal" stackId="a" fill="#10B981" name="Minimal Risk" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Risk Trend</CardTitle>
              <CardDescription>Changes in risk levels over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", high: 12, limited: 35, minimal: 30 },
                      { month: "Feb", high: 13, limited: 37, minimal: 31 },
                      { month: "Mar", high: 15, limited: 38, minimal: 32 },
                      { month: "Apr", high: 16, limited: 40, minimal: 33 },
                      { month: "May", high: 18, limited: 42, minimal: 35 },
                      { month: "Jun", high: 17, limited: 43, minimal: 36 },
                      { month: "Jul", high: 16, limited: 45, minimal: 38 },
                      { month: "Aug", high: 15, limited: 44, minimal: 39 },
                      { month: "Sep", high: 14, limited: 45, minimal: 40 },
                      { month: "Oct", high: 15, limited: 44, minimal: 40 },
                      { month: "Nov", high: 16, limited: 44, minimal: 39 },
                      { month: "Dec", high: 15, limited: 45, minimal: 40 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="high" stroke="#EF4444" name="High Risk" />
                    <Line type="monotone" dataKey="limited" stroke="#F59E0B" name="Limited Risk" />
                    <Line type="monotone" dataKey="minimal" stroke="#10B981" name="Minimal Risk" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Risk Assessment Report</CardTitle>
                <CardDescription>Detailed risk data for all AI systems</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => exportReport('pdf')}>
                  <FilePdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportReport('csv')}>
                  <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Assessment Date</TableHead>
                    <TableHead>Mitigation Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systems.slice(0, 10).map((system: any) => (
                    <TableRow key={system.id}>
                      <TableCell className="font-medium">{system.name}</TableCell>
                      <TableCell>{system.department}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            system.riskLevel === "High" ? "bg-red-100 text-red-800" :
                            system.riskLevel === "Limited" ? "bg-amber-100 text-amber-800" :
                            "bg-green-100 text-green-800"
                          }`}
                        >
                          {system.riskLevel}
                        </span>
                      </TableCell>
                      <TableCell>{system.riskScore || "N/A"}</TableCell>
                      <TableCell>{system.lastAssessmentDate ? new Date(system.lastAssessmentDate).toLocaleDateString() : "Not assessed"}</TableCell>
                      <TableCell>
                        {system.riskLevel === "High" ? "In Progress" : system.riskLevel === "Limited" ? "Completed" : "Not Required"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Link href={`/systems/${system.id}/assess-risk`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  // Render documentation report
  const renderDocumentationReport = () => {
    const docStatusData = [
      { name: "Complete", value: 62, color: "#22C55E" },
      { name: "In Progress", value: 28, color: "#F59E0B" },
      { name: "Missing", value: 10, color: "#EF4444" },
    ];

    const docTypeData = [
      { name: "Technical Documentation", complete: 80, inProgress: 15, missing: 5 },
      { name: "Risk Assessment", complete: 75, inProgress: 20, missing: 5 },
      { name: "Conformity Declaration", complete: 60, inProgress: 30, missing: 10 },
      { name: "Human Oversight Protocol", complete: 45, inProgress: 40, missing: 15 },
      { name: "Data Governance Policy", complete: 55, inProgress: 35, missing: 10 },
      { name: "Incident Response Plan", complete: 40, inProgress: 45, missing: 15 },
    ];

    if (format === "visual") {
      return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Documentation Status</CardTitle>
                <CardDescription>Overall status of required documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={docStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {docStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Documentation by Type</CardTitle>
                <CardDescription>Completion status by document type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={docTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="complete" stackId="a" fill="#22C55E" name="Complete" />
                      <Bar dataKey="inProgress" stackId="a" fill="#F59E0B" name="In Progress" />
                      <Bar dataKey="missing" stackId="a" fill="#EF4444" name="Missing" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Document Completion Trend</CardTitle>
                  <CardDescription>Documentation completion over the past year</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", complete: 45, inProgress: 40, missing: 15 },
                      { month: "Feb", complete: 47, inProgress: 39, missing: 14 },
                      { month: "Mar", complete: 49, inProgress: 38, missing: 13 },
                      { month: "Apr", complete: 51, inProgress: 37, missing: 12 },
                      { month: "May", complete: 53, inProgress: 36, missing: 11 },
                      { month: "Jun", complete: 55, inProgress: 35, missing: 10 },
                      { month: "Jul", complete: 57, inProgress: 33, missing: 10 },
                      { month: "Aug", complete: 58, inProgress: 32, missing: 10 },
                      { month: "Sep", complete: 59, inProgress: 31, missing: 10 },
                      { month: "Oct", complete: 60, inProgress: 30, missing: 10 },
                      { month: "Nov", complete: 61, inProgress: 29, missing: 10 },
                      { month: "Dec", complete: 62, inProgress: 28, missing: 10 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="complete" stroke="#22C55E" name="Complete" />
                    <Line type="monotone" dataKey="inProgress" stroke="#F59E0B" name="In Progress" />
                    <Line type="monotone" dataKey="missing" stroke="#EF4444" name="Missing" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Documentation Status Report</CardTitle>
                <CardDescription>Detailed status of required documentation for all systems</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => exportReport('pdf')}>
                  <FilePdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportReport('csv')}>
                  <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Technical Doc</TableHead>
                    <TableHead>Risk Assessment</TableHead>
                    <TableHead>Conformity Declaration</TableHead>
                    <TableHead>Human Oversight</TableHead>
                    <TableHead>Data Governance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systems.slice(0, 10).map((system: any) => (
                    <TableRow key={system.id}>
                      <TableCell className="font-medium">{system.name}</TableCell>
                      <TableCell>{system.department}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Complete
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          system.riskLevel === "High" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {system.riskLevel === "High" ? "Complete" : "In Progress"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          system.riskLevel === "High" ? "bg-green-100 text-green-800" : 
                          system.riskLevel === "Limited" ? "bg-amber-100 text-amber-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {system.riskLevel === "High" ? "Complete" : 
                           system.riskLevel === "Limited" ? "In Progress" : "Missing"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          system.riskLevel === "High" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {system.riskLevel === "High" ? "Complete" : "In Progress"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          system.riskLevel === "High" ? "bg-green-100 text-green-800" : 
                          system.riskLevel === "Limited" ? "bg-amber-100 text-amber-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {system.riskLevel === "High" ? "Complete" : 
                           system.riskLevel === "Limited" ? "In Progress" : "Missing"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  // Render performance report
  const renderPerformanceReport = () => {
    // Chart data for performance monitoring
    const performanceData = [
      { month: "Jan", score: 75 },
      { month: "Feb", score: 78 },
      { month: "Mar", score: 76 },
      { month: "Apr", score: 79 },
      { month: "May", score: 82 },
      { month: "Jun", score: 85 },
      { month: "Jul", score: 84 },
      { month: "Aug", score: 87 },
      { month: "Sep", score: 89 },
      { month: "Oct", score: 91 },
      { month: "Nov", score: 90 },
      { month: "Dec", score: 92 },
    ];

    if (format === "visual") {
      return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
                <CardDescription>Performance metrics over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#3B82F6" name="Performance Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Performance Indicators</CardTitle>
                <CardDescription>Key performance metrics across all AI systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <CircularProgressIndicator value={92} size={100} progressColor="#3B82F6" />
                    <span className="mt-2 text-sm font-medium">Accuracy</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CircularProgressIndicator value={88} size={100} progressColor="#8B5CF6" />
                    <span className="mt-2 text-sm font-medium">Reliability</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CircularProgressIndicator value={95} size={100} progressColor="#22C55E" />
                    <span className="mt-2 text-sm font-medium">Availability</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CircularProgressIndicator value={86} size={100} progressColor="#F59E0B" />
                    <span className="mt-2 text-sm font-medium">Response Time</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance by Department</CardTitle>
              <CardDescription>AI system performance metrics across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "IT Department", accuracy: 94, reliability: 90, availability: 97, responseTime: 88 },
                      { name: "Marketing", accuracy: 88, reliability: 85, availability: 92, responseTime: 82 },
                      { name: "Sales", accuracy: 86, reliability: 83, availability: 90, responseTime: 84 },
                      { name: "R&D", accuracy: 96, reliability: 92, availability: 98, responseTime: 90 },
                      { name: "Customer Support", accuracy: 90, reliability: 87, availability: 94, responseTime: 86 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accuracy" fill="#3B82F6" name="Accuracy" />
                    <Bar dataKey="reliability" fill="#8B5CF6" name="Reliability" />
                    <Bar dataKey="availability" fill="#22C55E" name="Availability" />
                    <Bar dataKey="responseTime" fill="#F59E0B" name="Response Time" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>AI System Performance Report</CardTitle>
                <CardDescription>Detailed performance metrics for all AI systems</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => exportReport('pdf')}>
                  <FilePdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportReport('csv')}>
                  <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Reliability</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Overall Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systems.slice(0, 10).map((system: any) => (
                    <TableRow key={system.id}>
                      <TableCell className="font-medium">{system.name}</TableCell>
                      <TableCell>{system.department}</TableCell>
                      <TableCell>
                        {90 + Math.floor(Math.random() * 10)}%
                      </TableCell>
                      <TableCell>
                        {85 + Math.floor(Math.random() * 10)}%
                      </TableCell>
                      <TableCell>
                        {95 + Math.floor(Math.random() * 5)}%
                      </TableCell>
                      <TableCell>
                        {80 + Math.floor(Math.random() * 15)}%
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-2.5 w-16 rounded-full bg-gray-200">
                            <div 
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${85 + Math.floor(Math.random() * 15)}%` }}
                            />
                          </div>
                          <span>{85 + Math.floor(Math.random() * 15)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  // Render audit report
  const renderAuditReport = () => {
    // Audit event types distribution
    const auditEventsData = [
      { name: "Assessment", value: 35, color: "#3B82F6" },
      { name: "Document Update", value: 25, color: "#22C55E" },
      { name: "Configuration Change", value: 20, color: "#F59E0B" },
      { name: "Approval", value: 12, color: "#8B5CF6" },
      { name: "Review", value: 8, color: "#EC4899" },
    ];

    if (format === "visual") {
      return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Audit Events Distribution</CardTitle>
                <CardDescription>Types of audit events recorded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={auditEventsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {auditEventsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Audit Events by Month</CardTitle>
                <CardDescription>Number of audit events recorded monthly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: "Jan", events: 45 },
                        { month: "Feb", events: 52 },
                        { month: "Mar", events: 48 },
                        { month: "Apr", events: 70 },
                        { month: "May", events: 61 },
                        { month: "Jun", events: 65 },
                        { month: "Jul", events: 75 },
                        { month: "Aug", events: 68 },
                        { month: "Sep", events: 71 },
                        { month: "Oct", events: 78 },
                        { month: "Nov", events: 82 },
                        { month: "Dec", events: 79 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="events" fill="#3B82F6" name="Audit Events" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Audit Events by User</CardTitle>
              <CardDescription>Top contributors to audit records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "John Smith", events: 120 },
                      { name: "Sarah Johnson", events: 95 },
                      { name: "Michael Brown", events: 85 },
                      { name: "Emily Davis", events: 75 },
                      { name: "David Wilson", events: 65 },
                      { name: "Jennifer Taylor", events: 60 },
                      { name: "Robert Miller", events: 55 },
                      { name: "Lisa Anderson", events: 45 },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="events" fill="#8B5CF6" name="Audit Events" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Audit Trail Report</CardTitle>
                <CardDescription>Comprehensive audit history for all systems</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => exportReport('pdf')}>
                  <FilePdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportReport('csv')}>
                  <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, index) => {
                    const eventTypes = ["assessment", "document_update", "configuration_change", "approval", "review"];
                    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                    const randomSystem = systems[Math.floor(Math.random() * systems.length)] || { name: "Unknown System" };
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{randomSystem.name}</TableCell>
                        <TableCell>{"John Smith"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            eventType === "assessment" ? "bg-blue-100 text-blue-800" :
                            eventType === "document_update" ? "bg-green-100 text-green-800" :
                            eventType === "configuration_change" ? "bg-amber-100 text-amber-800" :
                            eventType === "approval" ? "bg-purple-100 text-purple-800" :
                            "bg-pink-100 text-pink-800"
                          }`}>
                            {eventType.replace("_", " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          {eventType === "assessment" ? "Completed risk assessment" :
                           eventType === "document_update" ? "Updated technical documentation" :
                           eventType === "configuration_change" ? "Modified system settings" :
                           eventType === "approval" ? "Approved compliance status" :
                           "Performed periodic review"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-neutral-500">Generate comprehensive reports for EU AI Act compliance</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visual">
                <div className="flex items-center">
                  <BarChart3Icon className="mr-2 h-4 w-4" />
                  <span>Visual</span>
                </div>
              </SelectItem>
              <SelectItem value="tabular">
                <div className="flex items-center">
                  <ListIcon className="mr-2 h-4 w-4" />
                  <span>Tabular</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter">Filter Systems</Label>
              <div className="flex mt-1">
                <Input
                  id="filter"
                  placeholder="Search systems..."
                  value={systemFilter}
                  onChange={(e) => setSystemFilter(e.target.value)}
                  className="rounded-r-none"
                />
                <Button variant="outline" className="rounded-l-none border-l-0">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Departments</Label>
              <div className="mt-1 space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                {departments.map((dept: any) => (
                  <div key={dept.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`dept-${dept.id}`}
                      checked={selectedDepartments.includes(dept.name)}
                      onCheckedChange={() => toggleDepartment(dept.name)}
                    />
                    <Label 
                      htmlFor={`dept-${dept.id}`}
                      className="text-sm font-normal"
                    >
                      {dept.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Export Options</Label>
              <div className="flex space-x-2 mt-1">
                <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
                  <FilePdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                  <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportReport('json')}>
                  <FileJsonIcon className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button variant="outline" size="sm">
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="compliance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b pb-0 mb-4">
          <div className="flex overflow-x-auto">
            <TabsTrigger value="compliance" className="flex-1">
              Compliance Report
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex-1">
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex-1">
              Documentation Status
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex-1">
              Performance Metrics
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex-1">
              Audit History
            </TabsTrigger>
          </div>
        </TabsList>
        
        <TabsContent value="compliance" className="mt-0">
          {renderComplianceReport()}
        </TabsContent>
        
        <TabsContent value="risk" className="mt-0">
          {renderRiskReport()}
        </TabsContent>
        
        <TabsContent value="documentation" className="mt-0">
          {renderDocumentationReport()}
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0">
          {renderPerformanceReport()}
        </TabsContent>
        
        <TabsContent value="audit" className="mt-0">
          {renderAuditReport()}
        </TabsContent>
      </Tabs>
    </div>
  );
}