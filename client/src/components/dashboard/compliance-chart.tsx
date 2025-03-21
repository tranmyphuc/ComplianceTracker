import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface Department {
  name: string;
  complianceScore: number;
}

interface ComplianceChartProps {
  data: Department[];
}

export function ComplianceChart({ data }: ComplianceChartProps) {
  // Sort departments by compliance score descending
  const sortedData = [...data].sort((a, b) => b.complianceScore - a.complianceScore);

  const getBarColor = (score: number) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#f59e0b";
    return "#dc2626";
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium text-neutral-800">Compliance by Department</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((department, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-700">{department.name}</span>
                <span className="text-sm font-medium text-neutral-700">{department.complianceScore}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${department.complianceScore}%`,
                    backgroundColor: getBarColor(department.complianceScore)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
