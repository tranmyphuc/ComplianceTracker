import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface RiskDistribution {
  high: number;
  limited: number;
  minimal: number;
}

interface RiskChartProps {
  data: RiskDistribution;
  totalSystems: number;
}

export function RiskChart({ data, totalSystems }: RiskChartProps) {
  const chartData = [
    { name: "High Risk", value: data.high, color: "#dc2626" },
    { name: "Limited Risk", value: data.limited, color: "#f59e0b" },
    { name: "Minimal Risk", value: data.minimal, color: "#16a34a" },
  ];

  const getPercentage = (value: number) => {
    return totalSystems > 0 ? ((value / totalSystems) * 100).toFixed(1) : "0";
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium text-neutral-800">Systems by Risk Level</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `${value} (${getPercentage(value)}%)`, 
                    "Systems"
                  ]}
                  contentStyle={{
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-semibold text-neutral-800">{totalSystems}</span>
              <span className="text-sm text-neutral-500">Total Systems</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-neutral-800">{item.name.split(" ")[0]}</span>
              </div>
              <span className="text-sm font-medium">
                {item.value} ({getPercentage(item.value)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
