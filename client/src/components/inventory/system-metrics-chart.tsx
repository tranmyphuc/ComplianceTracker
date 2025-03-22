import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, Sector } from "recharts";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangleIcon, InfoIcon } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Mock data - to be replaced with actual API data
const riskDistributionData = [
  { name: 'High Risk', value: 8, color: '#ef4444' },
  { name: 'Limited Risk', value: 12, color: '#f59e0b' },
  { name: 'Minimal Risk', value: 4, color: '#10b981' }
];

const complianceDistributionData = [
  { name: '< 25%', value: 3, color: '#ef4444' },
  { name: '25-50%', value: 5, color: '#f59e0b' },
  { name: '50-75%', value: 9, color: '#3b82f6' },
  { name: '> 75%', value: 7, color: '#10b981' }
];

const departmentDistributionData = [
  { name: 'IT', value: 7 },
  { name: 'HR', value: 3 },
  { name: 'Finance', value: 5 },
  { name: 'Marketing', value: 4 },
  { name: 'R&D', value: 3 },
  { name: 'Operations', value: 2 }
];

const monthlyTrendData = [
  { name: 'Jan', totalSystems: 10, highRiskSystems: 2, compliance: 60 },
  { name: 'Feb', totalSystems: 12, highRiskSystems: 3, compliance: 58 },
  { name: 'Mar', totalSystems: 15, highRiskSystems: 4, compliance: 62 },
  { name: 'Apr', totalSystems: 18, highRiskSystems: 5, compliance: 65 },
  { name: 'May', totalSystems: 20, highRiskSystems: 6, compliance: 68 },
  { name: 'Jun', totalSystems: 24, highRiskSystems: 8, compliance: 72 }
];

// Active pie sector rendering for better UI
const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-midAngle * Math.PI / 180);
  const cos = Math.cos(-midAngle * Math.PI / 180);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} systems`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

export function SystemMetricsChart() {
  const [activeRiskIndex, setActiveRiskIndex] = useState(0);
  const [activeComplianceIndex, setActiveComplianceIndex] = useState(0);
  const [activeDepartmentIndex, setActiveDepartmentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("distribution");

  // This would be replaced with actual API data fetching
  const { data: systems, isLoading, error } = useQuery({
    queryKey: ["/api/systems"],
  });

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
        <p className="text-sm">Failed to load system metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="distribution">Distribution Analysis</TabsTrigger>
          <TabsTrigger value="trends">Compliance Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="distribution" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Distribution Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Risk Level Distribution</CardTitle>
                <CardDescription>Systems categorized by EU AI Act risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeRiskIndex}
                        activeShape={renderActiveShape}
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveRiskIndex(index)}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Distribution Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Compliance Completion</CardTitle>
                <CardDescription>Systems grouped by documentation completion %</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeComplianceIndex}
                        activeShape={renderActiveShape}
                        data={complianceDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveComplianceIndex(index)}
                      >
                        {complianceDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Department Distribution Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Department Distribution</CardTitle>
                <CardDescription>AI systems by department ownership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeDepartmentIndex}
                        activeShape={renderActiveShape}
                        data={departmentDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveDepartmentIndex(index)}
                      >
                        {departmentDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Monthly Trends Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Monthly Trends</CardTitle>
                <CardDescription>System counts and compliance progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyTrendData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="totalSystems" name="Total Systems" fill="#3b82f6" />
                      <Bar yAxisId="left" dataKey="highRiskSystems" name="High Risk Systems" fill="#ef4444" />
                      <Bar yAxisId="right" dataKey="compliance" name="Avg. Compliance %" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-700 font-medium">EU AI Act Insight</p>
            <p className="text-sm text-blue-600 mt-1">
              The distribution of AI systems across risk categories helps prioritize compliance efforts, as high-risk systems require extensive documentation, testing, and human oversight measures under the EU AI Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}