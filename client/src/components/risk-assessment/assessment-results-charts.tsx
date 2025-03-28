
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Zap, 
  FileText, 
  CheckCircle,
  AlertCircle,
  BarChart4
} from 'lucide-react';

// Interface for chart props
interface AssessmentResultsChartsProps {
  assessmentData: {
    riskLevel: string;
    riskScore: number;
    relevantArticles?: any[];
    complianceGaps?: string[];
    riskFactors?: any[];
    remediationActions?: any[];
  };
}

// Risk level color mapping
const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel.toLowerCase()) {
    case 'unacceptable':
      return 'rgb(239, 68, 68)'; // Red
    case 'high':
      return 'rgb(234, 88, 12)'; // Orange
    case 'limited':
      return 'rgb(234, 179, 8)'; // Yellow
    case 'minimal':
      return 'rgb(34, 197, 94)'; // Green
    default:
      return 'rgb(107, 114, 128)'; // Gray
  }
};

export const AssessmentResultsCharts: React.FC<AssessmentResultsChartsProps> = ({ 
  assessmentData 
}) => {
  const { riskLevel, riskScore, relevantArticles = [], complianceGaps = [] } = assessmentData;
  
  // Calculate compliance percentage based on risk score
  const compliancePercentage = Math.max(0, Math.min(100, riskScore));
  
  // Calculate gap impact - simplified for demo
  const gapImpact = {
    critical: complianceGaps.filter(gap => gap.includes('critical') || gap.includes('must')).length,
    high: complianceGaps.filter(gap => gap.includes('high')).length,
    medium: complianceGaps.filter(gap => 
      gap.includes('medium') || gap.includes('moderate') || 
      (!gap.includes('critical') && !gap.includes('high') && !gap.includes('low'))
    ).length,
    low: complianceGaps.filter(gap => gap.includes('low') || gap.includes('minor')).length,
  };
  
  const totalGaps = gapImpact.critical + gapImpact.high + gapImpact.medium + gapImpact.low || 1;
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overall Assessment</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="gaps">Compliance Gaps</TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                Risk Assessment Summary
              </CardTitle>
              <CardDescription>
                Visual overview of risk assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Risk level gauge */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className="text-sm font-medium">{riskScore}/100</span>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-in-out"
                    style={{ 
                      width: `${riskScore}%`, 
                      background: getRiskLevelColor(riskLevel)
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Minimal</span>
                  <span>Limited</span>
                  <span>High</span>
                  <span>Unacceptable</span>
                </div>
              </div>
              
              {/* Risk metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <div className="rounded-full p-2 bg-gray-100 mb-2">
                    <AlertTriangle 
                      className="h-6 w-6" 
                      style={{ color: getRiskLevelColor(riskLevel) }}
                    />
                  </div>
                  <span className="text-xl font-bold" style={{ color: getRiskLevelColor(riskLevel) }}>
                    {riskLevel}
                  </span>
                  <span className="text-sm text-gray-600">Risk Level</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <div className="rounded-full p-2 bg-gray-100 mb-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {relevantArticles.length}
                  </span>
                  <span className="text-sm text-gray-600">Applicable Articles</span>
                </div>
              </div>
              
              {/* Articles bars */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Relevant EU AI Act Articles</h4>
                <div className="space-y-3">
                  {relevantArticles.slice(0, 5).map((article, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{article.id}</span>
                        <span>Applicable</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* COMPLIANCE TAB */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                Compliance Status
              </CardTitle>
              <CardDescription>
                Current compliance with EU AI Act requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Compliance percentage circle */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="10" 
                    />
                    
                    {/* Progress circle with animation */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke={compliancePercentage > 75 ? '#10b981' : compliancePercentage > 50 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth="10" 
                      strokeDasharray={`${2 * Math.PI * 45 * compliancePercentage / 100} ${2 * Math.PI * 45 * (1 - compliancePercentage / 100)}`}
                      strokeDashoffset={2 * Math.PI * 45 * 0.25}
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                    
                    {/* Text in middle */}
                    <text 
                      x="50" y="50" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      fill={compliancePercentage > 75 ? '#10b981' : compliancePercentage > 50 ? '#f59e0b' : '#ef4444'}
                      fontSize="24"
                      fontWeight="bold"
                    >
                      {compliancePercentage}%
                    </text>
                    
                    <text 
                      x="50" y="65" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      fill="#6b7280"
                      fontSize="12"
                    >
                      Compliance
                    </text>
                  </svg>
                </div>
              </div>
              
              {/* Compliance metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="text-xl font-bold text-green-700">
                      {complianceGaps.length ? relevantArticles.length - complianceGaps.length : relevantArticles.length}
                    </div>
                    <div className="text-xs text-green-600">Requirements Met</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-red-50 border border-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <div className="text-xl font-bold text-red-700">
                      {complianceGaps.length}
                    </div>
                    <div className="text-xs text-red-600">Compliance Gaps</div>
                  </div>
                </div>
              </div>
              
              {/* Compliance status */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Compliance Status</h4>
                <p className="text-sm text-blue-700">
                  {compliancePercentage >= 80 ? 
                    "This AI system is largely compliant with EU AI Act requirements. Continue maintaining documentation and monitoring for regulatory changes." :
                    compliancePercentage >= 60 ?
                    "This AI system requires some improvements to achieve full compliance with the EU AI Act. Address identified gaps in the compliance plan." :
                    "This AI system needs significant improvements to meet EU AI Act requirements. Urgent remediation actions are required."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* GAPS TAB */}
        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-600" />
                Compliance Gaps Analysis
              </CardTitle>
              <CardDescription>
                Breakdown of identified compliance gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Gaps by severity */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Gap Severity Breakdown</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Critical</span>
                      <span>{gapImpact.critical} issues</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${gapImpact.critical * 100 / totalGaps}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>High</span>
                      <span>{gapImpact.high} issues</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${gapImpact.high * 100 / totalGaps}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Medium</span>
                      <span>{gapImpact.medium} issues</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${gapImpact.medium * 100 / totalGaps}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Low</span>
                      <span>{gapImpact.low} issues</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${gapImpact.low * 100 / totalGaps}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gap summary - focus areas */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Priority Focus Areas</h4>
                <ul className="space-y-2 text-sm text-amber-700">
                  {gapImpact.critical > 0 && (
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Address critical risk controls in prohibited use cases</span>
                    </li>
                  )}
                  {gapImpact.high > 0 && (
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Implement robust data governance and human oversight</span>
                    </li>
                  )}
                  {gapImpact.medium > 0 && (
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Enhance technical documentation and risk management</span>
                    </li>
                  )}
                  {gapImpact.low > 0 && (
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Improve transparency and reporting mechanisms</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Sample gaps list */}
              <div>
                <h4 className="text-sm font-medium mb-3">Top Compliance Gaps</h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {complianceGaps.map((gap, index) => (
                    <div key={index} className="p-2.5 bg-gray-50 rounded border text-sm text-gray-700">
                      {gap}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentResultsCharts;
