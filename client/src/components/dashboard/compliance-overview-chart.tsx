
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Documentation', compliant: 65, nonCompliant: 35 },
  { name: 'Risk Management', compliant: 78, nonCompliant: 22 },
  { name: 'Human Oversight', compliant: 45, nonCompliant: 55 },
  { name: 'Transparency', compliant: 82, nonCompliant: 18 },
  { name: 'Technical Robustness', compliant: 70, nonCompliant: 30 },
  { name: 'Data Governance', compliant: 58, nonCompliant: 42 },
];

export function ComplianceOverviewChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Compliance Status by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name === 'compliant' ? 'Compliant' : 'Non-Compliant']}
              labelFormatter={(value) => `Category: ${value}`}
            />
            <Legend formatter={(value) => value === 'compliant' ? 'Compliant' : 'Non-Compliant'} />
            <Bar dataKey="compliant" stackId="a" fill="#4ade80" />
            <Bar dataKey="nonCompliant" stackId="a" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700 font-medium">EU AI Act Insight</p>
          <p className="text-sm text-blue-600 mt-1">
            Focus on improving Human Oversight and Data Governance areas to strengthen your overall compliance posture.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
