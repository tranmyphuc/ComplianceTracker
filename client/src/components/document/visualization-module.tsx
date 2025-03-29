/**
 * Visualization Module Component
 * Renders dynamic visualizations for EU AI Act compliance documents
 */

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Treemap, RadarChart, Radar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { RiskLevel } from '@shared/types';

// Color palette for visualizations
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
  grey: '#6B7280',
  unacceptable: '#EF4444',
  high: '#F59E0B',
  limited: '#10B981',
  minimal: '#3B82F6',
};

// Risk level to color mapping
const RISK_COLORS = {
  [RiskLevel.UNACCEPTABLE]: COLORS.unacceptable,
  [RiskLevel.HIGH]: COLORS.warning,
  [RiskLevel.LIMITED]: COLORS.accent,
  [RiskLevel.MINIMAL]: COLORS.secondary,
};

interface VisualizationProps {
  type: string;
  data: any;
  title?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Renders a visualization based on the provided type and data
 */
export const VisualizationModule: React.FC<VisualizationProps> = ({ 
  type, 
  data, 
  title, 
  width = '100%', 
  height = 300 
}) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex items-center justify-center p-6 border rounded-md bg-muted">
        <p className="text-muted-foreground">No data available for visualization</p>
      </div>
    );
  }

  const renderTitle = () => {
    if (!title) return null;
    return <h3 className="text-lg font-medium mb-2">{title}</h3>;
  };

  // Render specific visualization based on type
  const renderVisualization = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={COLORS.primary} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill={COLORS.primary}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || Object.values(COLORS)[index % Object.keys(COLORS).length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <Treemap
              data={data}
              dataKey="value"
              nameKey="name"
              aspectRatio={4/3}
              stroke="#fff"
              fill={COLORS.primary}
            >
              {data.map((item: any, index: number) => (
                <Cell key={`cell-${index}`} fill={item.color || Object.values(COLORS)[index % Object.keys(COLORS).length]} />
              ))}
            </Treemap>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Value" dataKey="value" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'risk-heatmap':
        // Special case for risk heatmap
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill={COLORS.primary}
                    dataKey="value"
                    nameKey="name"
                  >
                    {data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.riskLevel] || COLORS.grey} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-md font-medium mb-2">Risk Level Summary</h4>
              <div className="space-y-2">
                {Object.keys(RiskLevel).map((level) => (
                  <div key={level} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: RISK_COLORS[level.toLowerCase() as RiskLevel] }}
                    />
                    <span className="text-sm capitalize">{level.toLowerCase().replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'compliance-timeline':
        // Specialized timeline view
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="complianceScore" stroke={COLORS.primary} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="targetScore" stroke={COLORS.grey} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center p-6 border rounded-md bg-muted">
            <p className="text-muted-foreground">Unsupported visualization type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className="visualization-module w-full" style={{ width }}>
      {renderTitle()}
      {renderVisualization()}
    </div>
  );
};

interface PolarGridProps {}
interface PolarAngleAxisProps {
  dataKey: string;
}
interface PolarRadiusAxisProps {
  angle: number;
  domain: [number, number];
}

// Helper components for TypeScript compatibility
const PolarGrid: React.FC<PolarGridProps> = () => null;
const PolarAngleAxis: React.FC<PolarAngleAxisProps> = () => null;
const PolarRadiusAxis: React.FC<PolarRadiusAxisProps> = () => null;