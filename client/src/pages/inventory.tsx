import { useState } from "react";
import { SystemsTable } from "@/components/inventory/systems-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  FolderIcon,
  AlertTriangleIcon
} from "lucide-react";

export default function Inventory() {
  const [activeView, setActiveView] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string | null>(null);

  // Use react-query to fetch systems directly to calculate statistics
  const { data: systemsData, isLoading: systemsLoading, isError } = useQuery({
    queryKey: ["/api/systems"],
    // Add error retry to handle temporary database connectivity issues
    retry: 3,
    retryDelay: 1000
  });
  
  // Mock data for when database is unavailable
  const mockSystems = [
    {
      id: "1",
      systemId: "AI-SYS-001",
      name: "Smart Assistant",
      description: "Customer service AI assistant",
      vendor: "OpenAI",
      department: "Customer Support",
      riskLevel: "Limited",
      riskScore: 65,
      docCompleteness: 80,
      trainingCompleteness: 75,
      status: "Active",
      implementationDate: "2023-06-15",
      hasCompliance: true,
      hasCriticalIssues: false
    },
    {
      id: "2",
      systemId: "AI-SYS-002",
      name: "HR Screening Tool",
      description: "AI-based CV screening and candidate evaluation",
      vendor: "HireIA",
      department: "Human Resources",
      riskLevel: "High",
      riskScore: 85,
      docCompleteness: 65,
      trainingCompleteness: 50,
      status: "Under Review",
      implementationDate: "2023-08-22",
      hasCompliance: false,
      hasCriticalIssues: true
    },
    {
      id: "3",
      systemId: "AI-SYS-003",
      name: "Product Recommendation Engine",
      description: "AI for personalized product recommendations",
      vendor: "RecommendAI",
      department: "Marketing",
      riskLevel: "Minimal",
      riskScore: 30,
      docCompleteness: 90,
      trainingCompleteness: 85,
      status: "Active",
      implementationDate: "2023-04-10",
      hasCompliance: true,
      hasCriticalIssues: false
    },
    {
      id: "4",
      systemId: "AI-SYS-004",
      name: "Supply Chain Predictor",
      description: "Predictive analytics for supply chain optimization",
      vendor: "LogisticsMind",
      department: "Operations",
      riskLevel: "Limited",
      riskScore: 55,
      docCompleteness: 70,
      trainingCompleteness: 65,
      status: "Active",
      implementationDate: "2023-09-05",
      hasCompliance: true,
      hasCriticalIssues: false
    },
    {
      id: "5",
      systemId: "AI-SYS-005",
      name: "Fraud Detection System",
      description: "AI-based fraud detection and prevention",
      vendor: "SecureAI",
      department: "Finance",
      riskLevel: "High",
      riskScore: 90,
      docCompleteness: 85,
      trainingCompleteness: 80,
      status: "Active",
      implementationDate: "2023-07-18",
      hasCompliance: true,
      hasCriticalIssues: false
    }
  ];

  // Calculate statistics directly from systems data
  const calculateStats = (systems: any[] = []) => {
    if (!systems || systems.length === 0) {
      return {
        totalSystems: 0,
        highRiskSystems: 0,
        limitedRiskSystems: 0,
        minimalRiskSystems: 0,
        pendingClassification: 0,
        recentlyAdded: 0,
        needsReview: 0,
        upToDate: 0,
        avgComplianceScore: 0
      };
    }

    // Count systems by risk level
    const highRisk = systems.filter(s => s.riskLevel === "High").length;
    const limitedRisk = systems.filter(s => s.riskLevel === "Limited").length;
    const minimalRisk = systems.filter(s => s.riskLevel === "Minimal").length;
    const unclassified = systems.filter(s => !s.riskLevel || s.riskLevel === "").length;
    
    // Calculate average compliance score
    const complianceScores = systems.map(s => {
      if (typeof s.docCompleteness === 'number' && typeof s.trainingCompleteness === 'number') {
        return (s.docCompleteness + s.trainingCompleteness) / 2;
      }
      return 0;
    });
    
    const avgScore = complianceScores.length > 0 
      ? Math.round(complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length) 
      : 0;
    
    // Count recently added systems (in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyAdded = systems.filter(s => {
      if (s.implementationDate) {
        const date = new Date(s.implementationDate);
        return date >= thirtyDaysAgo;
      }
      return false;
    }).length;
    
    // Count systems that need review (compliance score < 70)
    const needsReview = systems.filter(s => {
      const score = typeof s.docCompleteness === 'number' && typeof s.trainingCompleteness === 'number'
        ? (s.docCompleteness + s.trainingCompleteness) / 2
        : 0;
      return score < 70;
    }).length;
    
    // Count systems with up-to-date documentation
    const upToDate = systems.filter(s => {
      return typeof s.docCompleteness === 'number' && s.docCompleteness >= 80;
    }).length;
    
    return {
      totalSystems: systems.length,
      highRiskSystems: highRisk,
      limitedRiskSystems: limitedRisk,
      minimalRiskSystems: minimalRisk,
      pendingClassification: unclassified,
      recentlyAdded,
      needsReview,
      upToDate,
      avgComplianceScore: avgScore
    };
  };

  // Calculate stats based on the systems data with fallback to mock data if there's an error
  const stats = calculateStats(isError ? mockSystems : (systemsData as any[] | undefined));

  const handleRiskFilterClick = (risk: string) => {
    if (selectedRiskFilter === risk) {
      setSelectedRiskFilter(null);
    } else {
      setSelectedRiskFilter(risk);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Database connection status alert */}
      {isError && (
        <div className="flex items-center justify-between p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800">Database connection unavailable</p>
              <p className="text-sm text-yellow-700 mt-0.5">
                The system is currently using demo data. Some features may be limited.
              </p>
            </div>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="ml-4 text-sm h-9 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-800"
          >
            Retry Connection
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">AI Systems Inventory</h1>
          <p className="text-neutral-500 mt-1">Manage and monitor all AI systems across your organization</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="default" onClick={() => window.location.href = "/register-system"}>
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Register New System
          </Button>
          <Button variant="outline">
            <FolderIcon className="h-4 w-4 mr-1.5" />
            Import Systems
          </Button>
        </div>
      </div>
      
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500">Total AI Systems</p>
                <p className="text-2xl font-bold mt-1">{stats.totalSystems}</p>
              </div>
              <Badge className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200">{stats.recentlyAdded} new</Badge>
            </div>
            <div className="flex items-center mt-3 text-xs">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-1.5"></div>
                <span className="mr-2">High: {stats.highRiskSystems}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-1.5"></div>
                <span className="mr-2">Limited: {stats.limitedRiskSystems}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1.5"></div>
                <span>Minimal: {stats.minimalRiskSystems}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500">Compliance Status</p>
                <p className="text-2xl font-bold mt-1">{stats.avgComplianceScore}%</p>
              </div>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{stats.needsReview} needs review</Badge>
            </div>
            <div className="mt-3">
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${stats.avgComplianceScore}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500">Classification Status</p>
                <p className="text-2xl font-bold mt-1">{stats.totalSystems - stats.pendingClassification}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{stats.pendingClassification} pending</Badge>
            </div>
            <div className="flex items-center mt-3">
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${((stats.totalSystems - stats.pendingClassification) / stats.totalSystems) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">
              {((stats.totalSystems - stats.pendingClassification) / stats.totalSystems * 100).toFixed(0)}% classified
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-neutral-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500">Documentation Status</p>
                <p className="text-2xl font-bold mt-1">{stats.upToDate}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Up to date</Badge>
            </div>
            <div className="flex items-center mt-3">
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${(stats.upToDate / stats.totalSystems) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">
              {(stats.upToDate / stats.totalSystems * 100).toFixed(0)}% complete documentation
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search AI systems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedRiskFilter === "high" ? "default" : "outline"}
            size="sm"
            onClick={() => handleRiskFilterClick("high")}
            className={selectedRiskFilter === "high" ? "" : "border-red-200 text-red-700 hover:bg-red-50"}
          >
            <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>
            High Risk
          </Button>
          
          <Button 
            variant={selectedRiskFilter === "limited" ? "default" : "outline"}
            size="sm"
            onClick={() => handleRiskFilterClick("limited")}
            className={selectedRiskFilter === "limited" ? "" : "border-amber-200 text-amber-700 hover:bg-amber-50"}
          >
            <div className="h-2 w-2 rounded-full bg-amber-500 mr-1.5"></div>
            Limited Risk
          </Button>
          
          <Button 
            variant={selectedRiskFilter === "minimal" ? "default" : "outline"}
            size="sm"
            onClick={() => handleRiskFilterClick("minimal")}
            className={selectedRiskFilter === "minimal" ? "" : "border-green-200 text-green-700 hover:bg-green-50"}
          >
            <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
            Minimal Risk
          </Button>
          
          <Button variant="outline" size="sm">
            <FilterIcon className="h-4 w-4 mr-1.5" />
            More Filters
          </Button>
        </div>
      </div>
      
      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="integrations">Integration Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="mt-4">
          <SystemsTable />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          <div className="p-8 text-center text-neutral-500 border rounded-md">
            <p>System metrics visualization will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-4">
          <div className="p-8 text-center text-neutral-500 border rounded-md">
            <p>System integration map will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
