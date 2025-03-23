import { useState } from "react";
import { SystemsTable } from "@/components/inventory/systems-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  FolderIcon
} from "lucide-react";

export default function Inventory() {
  const [activeView, setActiveView] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string | null>(null);

  // Mock statistics data
  const stats = {
    totalSystems: 24,
    highRiskSystems: 8,
    limitedRiskSystems: 12,
    minimalRiskSystems: 4,
    pendingClassification: 3,
    recentlyAdded: 5,
    needsReview: 7,
    upToDate: 14,
    avgComplianceScore: 72
  };

  const handleRiskFilterClick = (risk: string) => {
    if (selectedRiskFilter === risk) {
      setSelectedRiskFilter(null);
    } else {
      setSelectedRiskFilter(risk);
    }
  };

  return (
    <div className="p-4 md:p-6">
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
