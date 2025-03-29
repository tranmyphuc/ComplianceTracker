import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  TreeMap, ScatterChart, Scatter 
} from 'recharts';
import { 
  AlertTriangle, CheckCircle, FileText, BarChart3, 
  PieChart as PieChartIcon, ActivitySquare, CalendarDays, 
  Network
} from 'lucide-react';

interface RiskHeatmapData {
  categories: string[];
  impacts: string[];
  likelihoods: string[];
  dataPoints: Array<{
    category: string;
    impact: string;
    likelihood: string;
    score: number;
    mitigation: string;
  }>;
}

interface ComplianceChartData {
  name: string;
  compliance: number;
}

interface TimelineData {
  date: string;
  event: string;
  description: string;
}

interface DecisionTreeData {
  name: string;
  children?: DecisionTreeData[];
}

interface VisualizationProps {
  type: "riskHeatmap" | "timeline" | "complianceChart" | "decisionTree";
  title: string;
  description: string;
  data: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const RISK_COLORS = {
  low: '#10B981', // green
  medium: '#F59E0B', // yellow/amber
  high: '#EF4444', // red
  critical: '#7F1D1D' // dark red
};

/**
 * Component for rendering document visualizations
 */
export function DocumentVisualization({ type, title, description, data }: VisualizationProps) {
  const renderVisualization = () => {
    switch (type) {
      case 'riskHeatmap':
        return <RiskHeatmap data={data} />;
      case 'timeline':
        return <ComplianceTimeline data={data} />;
      case 'complianceChart':
        return <ComplianceChart data={data} />;
      case 'decisionTree':
        return <DecisionTreeVisualization data={data} />;
      default:
        return <div>Unsupported visualization type</div>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          {getIcon(type)}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderVisualization()}
      </CardContent>
    </Card>
  );
}

/**
 * Get icon based on visualization type
 */
function getIcon(type: string) {
  switch (type) {
    case 'riskHeatmap':
      return <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />;
    case 'timeline':
      return <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />;
    case 'complianceChart':
      return <CheckCircle className="h-5 w-5 mr-2 text-green-500" />;
    case 'decisionTree':
      return <Network className="h-5 w-5 mr-2 text-purple-500" />;
    default:
      return <FileText className="h-5 w-5 mr-2" />;
  }
}

/**
 * Risk Heatmap Visualization
 */
function RiskHeatmap({ data }: { data: RiskHeatmapData }) {
  // Transform heat map data for visualization
  const heatmapData = data.dataPoints.map(point => ({
    name: point.category,
    score: point.score,
    impact: point.impact,
    likelihood: point.likelihood,
    mitigation: point.mitigation,
    // Map risk scores to colors
    fill: point.score <= 5 ? RISK_COLORS.low :
          point.score <= 10 ? RISK_COLORS.medium :
          point.score <= 15 ? RISK_COLORS.high :
          RISK_COLORS.critical
  }));

  return (
    <div className="space-y-6">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={heatmapData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name, props) => {
                const { impact, likelihood, mitigation } = props.payload;
                return [
                  <div key="tooltip" className="space-y-1">
                    <div>Score: {value}</div>
                    <div>Impact: {impact}</div>
                    <div>Likelihood: {likelihood}</div>
                    <div>Mitigation: {mitigation}</div>
                  </div>
                ];
              }}
            />
            <Legend />
            <Bar 
              dataKey="score" 
              name="Risk Score" 
              isAnimationActive={true}
              animationDuration={1000}
            >
              {heatmapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Risk Level Legend */}
      <div className="flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-1"></div>
          <span className="text-xs">Low (1-5)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 mr-1"></div>
          <span className="text-xs">Medium (6-10)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-1"></div>
          <span className="text-xs">High (11-15)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-900 mr-1"></div>
          <span className="text-xs">Critical (16-20)</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Compliance Chart Visualization
 */
function ComplianceChart({ data }: { data: ComplianceChartData[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip formatter={(value) => [`${value}%`, 'Compliance']} />
          <Legend />
          <Bar 
            dataKey="compliance" 
            name="Compliance %" 
            fill="#4F46E5"
            radius={[0, 4, 4, 0]} 
            isAnimationActive={true}
            animationDuration={1000}
            label={{ position: 'right', formatter: (value: number) => `${value}%` }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.compliance < 75 ? '#F59E0B' : 
                      entry.compliance < 90 ? '#10B981' : 
                      '#4F46E5'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Compliance Timeline Visualization
 */
function ComplianceTimeline({ data }: { data: TimelineData[] }) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-neutral-200"></div>
            
            {/* Timeline events */}
            <div className="relative flex justify-between pt-2 pb-8">
              {data.map((event, i) => (
                <div key={i} className="flex flex-col items-center w-1/5">
                  {/* Event dot */}
                  <div className="w-4 h-4 rounded-full bg-blue-500 z-10"></div>
                  
                  {/* Date */}
                  <div className="mt-2 text-xs font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  
                  {/* Connecting line */}
                  <div className="h-8 w-0.5 bg-blue-200 mt-1"></div>
                  
                  {/* Event card */}
                  <div className="bg-white border rounded-md p-2 shadow-sm w-28 mt-1">
                    <h4 className="text-xs font-medium">{event.event}</h4>
                    <p className="text-xs text-neutral-500 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile view as a vertical timeline */}
      <div className="lg:hidden space-y-4">
        {data.map((event, i) => (
          <div key={i} className="flex">
            <div className="mr-4 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              {i < data.length - 1 && <div className="w-0.5 bg-blue-200 h-full"></div>}
            </div>
            <div>
              <div className="text-xs font-medium">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <h4 className="text-sm font-medium">{event.event}</h4>
              <p className="text-xs text-neutral-500">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Decision Tree Visualization
 * Simplified version using nested divs
 */
function DecisionTreeVisualization({ data }: { data: DecisionTreeData }) {
  // For a proper tree visualization, we would use a library like react-d3-tree
  // This is a simplified representation
  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 p-2 rounded-md border border-blue-200 text-center font-medium">
          {data.name}
        </div>
        
        {data.children && data.children.length > 0 && (
          <div className="w-0.5 h-8 bg-gray-300"></div>
        )}
        
        {data.children && data.children.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 pt-2">
            {data.children.map((child, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-green-100 p-2 rounded-md border border-green-200 text-center font-medium">
                  {child.name}
                </div>
                
                {child.children && child.children.length > 0 && (
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                )}
                
                {child.children && child.children.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 pt-2">
                    {child.children.map((grandchild, j) => (
                      <div key={j} className="flex flex-col items-center">
                        <div className="bg-amber-100 p-2 rounded-md border border-amber-200 text-center font-medium">
                          {grandchild.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-xs text-center mt-6 text-gray-500">
        Simplified system decision flow visualization. See technical documentation for detailed process flow.
      </div>
    </div>
  );
}

/**
 * Document Visualizations Container
 * Container component to show multiple visualizations
 */
export function DocumentVisualizations({ visualizations }: { visualizations: any[] }) {
  if (!visualizations || visualizations.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
        Document Visualizations
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visualizations.map((viz, i) => (
          <DocumentVisualization key={i} {...viz} />
        ))}
      </div>
    </div>
  );
}

/**
 * References List Component
 * Component to show document references
 */
export function DocumentReferences({ references }: { references: any[] }) {
  if (!references || references.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <FileText className="h-5 w-5 mr-2 text-blue-500" />
        Regulatory References
      </h3>
      
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relevance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {references.map((ref, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Article {ref.articleId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ref.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ref.relevance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Document Metadata Component
 * Component to show document metadata
 */
export function DocumentMetadata({ metadata }: { metadata: any }) {
  if (!metadata) {
    return null;
  }
  
  return (
    <div className="bg-gray-50 border rounded-md p-4 space-y-3">
      <h3 className="text-sm font-semibold">Document Metadata</h3>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-gray-500">Generated:</div>
        <div>{new Date(metadata.generatedAt).toLocaleString()}</div>
        
        <div className="text-gray-500">Version:</div>
        <div>{metadata.version}</div>
        
        <div className="text-gray-500">System:</div>
        <div>{metadata.systemId}</div>
        
        <div className="text-gray-500">Risk Level:</div>
        <div>{metadata.systemRiskLevel}</div>
        
        <div className="text-gray-500">Regulatory:</div>
        <div>{metadata.regulatoryVersion}</div>
      </div>
    </div>
  );
}