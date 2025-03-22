
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type RiskMatrixProps = {
  systems: any[];
}

export function RiskAssessmentMatrix({ systems = [] }: RiskMatrixProps) {
  // Group systems by risk level and impact
  const matrixData = {
    high: { critical: [], significant: [], moderate: [], minimal: [] },
    limited: { critical: [], significant: [], moderate: [], minimal: [] },
    minimal: { critical: [], significant: [], moderate: [], minimal: [] },
  };

  // Process systems and place them in the matrix
  systems.forEach(system => {
    const riskLevel = system.riskLevel?.toLowerCase() || 'minimal';
    const impact = system.impact?.toLowerCase() || 'moderate';
    
    if (matrixData[riskLevel] && matrixData[riskLevel][impact]) {
      matrixData[riskLevel][impact].push(system);
    }
  });

  const impactLevels = ['critical', 'significant', 'moderate', 'minimal'];
  const riskLevels = ['high', 'limited', 'minimal'];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>EU AI Act Risk Assessment Matrix</CardTitle>
            <CardDescription>Distribution of AI systems by risk level and potential impact</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full bg-blue-100 p-1.5 text-blue-500 hover:bg-blue-200">
                  <InfoIcon className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>The EU AI Act Risk Matrix helps visualize your organization's AI risk exposure, categorizing systems based on their risk level (as defined by the EU AI Act) and potential impact.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100 w-1/5">Risk / Impact</th>
                {impactLevels.map((impact, i) => (
                  <th key={impact} className="border p-2 bg-gray-100 capitalize w-1/5">{impact}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskLevels.map((risk, i) => (
                <tr key={risk}>
                  <td className={`border p-2 font-medium capitalize ${
                    risk === 'high' ? 'bg-red-50' : 
                    risk === 'limited' ? 'bg-amber-50' : 'bg-green-50'
                  }`}>
                    {risk} Risk
                  </td>
                  {impactLevels.map(impact => {
                    const count = matrixData[risk][impact].length;
                    const bgColorClass = count > 0 ? (
                      risk === 'high' && impact === 'critical' ? 'bg-red-100' :
                      risk === 'high' && impact === 'significant' ? 'bg-red-50' :
                      risk === 'limited' && impact === 'critical' ? 'bg-amber-100' :
                      risk === 'limited' && impact === 'significant' ? 'bg-amber-50' :
                      risk === 'minimal' && impact === 'critical' ? 'bg-yellow-50' :
                      'bg-gray-50'
                    ) : 'bg-gray-50';
                    
                    return (
                      <td key={`${risk}-${impact}`} className={`border p-2 text-center ${bgColorClass}`}>
                        {count > 0 ? (
                          <div className="font-medium">{count}</div>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-100 mr-2"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-amber-100 mr-2"></div>
            <span>Limited Risk</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-50 mr-2"></div>
            <span>Minimal Risk</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-700 font-medium">EU AI Act Compliance Insight</p>
              <p className="text-sm text-blue-600 mt-1">
                Under the EU AI Act, systems in the high-risk category require rigorous compliance measures including comprehensive technical documentation, 
                conformity assessments, risk management systems, and human oversight protocols. Focus your compliance efforts on the red and amber zones of this matrix.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
