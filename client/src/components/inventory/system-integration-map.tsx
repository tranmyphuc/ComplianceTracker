import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangleIcon, DatabaseIcon, ServerIcon, CloudIcon, GlobeIcon, SmartphoneIcon, MonitorIcon, SettingsIcon, MailIcon, FileIcon, InfoIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Color palette for nodes
const NODE_COLORS = {
  "AI System": "#3b82f6",
  "Database": "#8b5cf6",
  "API": "#10b981",
  "Service": "#f59e0b",
  "Application": "#ef4444",
  "External": "#6b7280"
};

// Types of nodes
const NODE_ICONS = {
  "AI System": <SettingsIcon />,
  "Database": <DatabaseIcon />,
  "API": <ServerIcon />,
  "Service": <CloudIcon />,
  "Application": <MonitorIcon />,
  "External": <GlobeIcon />
};

// Mock data for the integration map
const mockSystemsIntegrations = [
  {
    id: 1,
    name: "Customer Service AI",
    type: "AI System",
    dependencies: [
      { id: 101, name: "Customer Database", type: "Database" },
      { id: 102, name: "Email Service", type: "Service" },
      { id: 103, name: "CRM System", type: "Application" }
    ]
  },
  {
    id: 2,
    name: "Product Recommendation Engine",
    type: "AI System",
    dependencies: [
      { id: 104, name: "Product Catalog", type: "Database" },
      { id: 105, name: "Customer Behavior API", type: "API" },
      { id: 106, name: "Analytics Platform", type: "External" }
    ]
  },
  {
    id: 3,
    name: "Document Analysis System",
    type: "AI System",
    dependencies: [
      { id: 107, name: "Document Storage", type: "Database" },
      { id: 108, name: "Extraction API", type: "API" },
      { id: 109, name: "Reporting Service", type: "Service" }
    ]
  },
  {
    id: 4,
    name: "HR Resume Screening",
    type: "AI System",
    dependencies: [
      { id: 110, name: "Applicant Database", type: "Database" },
      { id: 111, name: "Job Description API", type: "API" },
      { id: 112, name: "Email Notification", type: "Service" }
    ]
  }
];

export function SystemIntegrationMap() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  
  // This would be replaced with actual API data fetching
  const { data: systems, isLoading, error } = useQuery({
    queryKey: ["/api/systems"],
  });

  // Get current system to display
  const currentSystem = selectedSystem 
    ? mockSystemsIntegrations.find(sys => sys.id.toString() === selectedSystem)
    : mockSystemsIntegrations[0];
    
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
        <p className="text-sm">Failed to load system integration data</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">System Integrations & Dependencies</h3>
        
        <div className="w-64">
          <Select value={selectedSystem || mockSystemsIntegrations[0].id.toString()} onValueChange={setSelectedSystem}>
            <SelectTrigger>
              <SelectValue placeholder="Select a system" />
            </SelectTrigger>
            <SelectContent>
              {mockSystemsIntegrations.map(system => (
                <SelectItem key={system.id} value={system.id.toString()}>
                  {system.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {currentSystem && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{currentSystem.name}</CardTitle>
            <CardDescription>Integration map showing data flows and dependencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-6 min-h-[30rem] relative">
              {/* Central node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div 
                  className="w-36 h-36 rounded-full flex items-center justify-center flex-col text-white shadow-lg border-4 border-white"
                  style={{ backgroundColor: NODE_COLORS[currentSystem.type as keyof typeof NODE_COLORS] }}
                >
                  <div className="h-8 w-8 mb-1">
                    {NODE_ICONS[currentSystem.type as keyof typeof NODE_ICONS]}
                  </div>
                  <div className="text-center px-2 font-medium">{currentSystem.name}</div>
                </div>
                
                {/* Connection lines to dependencies */}
                {currentSystem.dependencies.map((dep, index) => {
                  // Calculate position in a circle around the center
                  const angle = (index * (360 / currentSystem.dependencies.length)) * (Math.PI / 180);
                  const radius = 180; // Distance from center
                  
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div key={dep.id}>
                      {/* Connection line */}
                      <div 
                        className="absolute top-1/2 left-1/2 h-1 bg-neutral-300 origin-left z-0"
                        style={{ 
                          width: radius, 
                          transform: `rotate(${angle * (180 / Math.PI)}deg)`
                        }}
                      />
                      
                      {/* Dependency node */}
                      <div 
                        className="absolute h-24 w-24 rounded-full flex items-center justify-center flex-col text-white shadow-md border-2 border-white z-10"
                        style={{ 
                          backgroundColor: NODE_COLORS[dep.type as keyof typeof NODE_COLORS],
                          top: `calc(50% + ${y}px)`,
                          left: `calc(50% + ${x}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="h-6 w-6 mb-1">
                          {NODE_ICONS[dep.type as keyof typeof NODE_ICONS]}
                        </div>
                        <div className="text-center px-2 text-xs font-medium">{dep.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-sm border text-sm">
                <div className="font-medium mb-2">Integration Types</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {Object.entries(NODE_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center">
                      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color }} />
                      <span>{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-700 font-medium">EU AI Act Compliance Note</p>
            <p className="text-sm text-blue-600 mt-1">
              Understanding system integrations is crucial for compliance as the EU AI Act requires comprehensive documentation of data flows, processing chains, and third-party components. Integration mapping helps identify potential compliance risks when AI systems connect to external services or data sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}