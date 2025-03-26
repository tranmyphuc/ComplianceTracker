
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Shell } from '../../components/shell';
import { SlidersHorizontal, Filter, Download, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdvancedAnalytics() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('compliance');
  const [complianceTrendData, setComplianceTrendData] = useState([]);
  const [riskDistributionData, setRiskDistributionData] = useState([]);
  const [systemCategoryData, setSystemCategoryData] = useState([]);
  const [readinessData, setReadinessData] = useState([]);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    // In a real implementation, these would be API calls
    // Example data for demonstration
    setComplianceTrendData([
      { month: 'Jan', score: 45 },
      { month: 'Feb', score: 52 },
      { month: 'Mar', score: 58 },
      { month: 'Apr', score: 63 },
      { month: 'May', score: 70 },
      { month: 'Jun', score: 79 },
    ]);

    setRiskDistributionData([
      { name: 'High Risk', value: 14 },
      { name: 'Medium Risk', value: 28 },
      { name: 'Low Risk', value: 42 },
      { name: 'Minimal Risk', value: 16 },
    ]);

    setSystemCategoryData([
      { category: 'Computer Vision', count: 12 },
      { category: 'NLP', count: 18 },
      { category: 'Predictive Analytics', count: 22 },
      { category: 'Decision Support', count: 14 },
      { category: 'Biometric', count: 8 },
    ]);

    setReadinessData([
      { department: 'R&D', readiness: 78 },
      { department: 'Marketing', readiness: 45 },
      { department: 'Operations', readiness: 65 },
      { department: 'Customer Service', readiness: 82 },
      { department: 'HR', readiness: 58 },
    ]);
  }, [timeRange]);

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">{t('advancedAnalytics.title')}</h1>
          <p className="text-muted-foreground">{t('advancedAnalytics.description')}</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('advancedAnalytics.timeRange')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">{t('advancedAnalytics.last30Days')}</SelectItem>
              <SelectItem value="3months">{t('advancedAnalytics.last3Months')}</SelectItem>
              <SelectItem value="6months">{t('advancedAnalytics.last6Months')}</SelectItem>
              <SelectItem value="1year">{t('advancedAnalytics.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="compliance" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance">{t('advancedAnalytics.complianceTrends')}</TabsTrigger>
          <TabsTrigger value="risks">{t('advancedAnalytics.riskPatterns')}</TabsTrigger>
          <TabsTrigger value="systems">{t('advancedAnalytics.systemsAnalysis')}</TabsTrigger>
          <TabsTrigger value="readiness">{t('advancedAnalytics.organizationalReadiness')}</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>{t('advancedAnalytics.complianceScoreTrend')}</CardTitle>
                <CardDescription>{t('advancedAnalytics.complianceScoreTrendDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#3B82F6" name={t('advancedAnalytics.complianceScore')} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('advancedAnalytics.complianceByRequirement')}</CardTitle>
                <CardDescription>{t('advancedAnalytics.complianceByRequirementDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { requirement: 'Documentation', percentage: 85 },
                        { requirement: 'Risk Management', percentage: 72 },
                        { requirement: 'Human Oversight', percentage: 64 },
                        { requirement: 'Technical Robust.', percentage: 78 },
                        { requirement: 'Data Governance', percentage: 68 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="requirement" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('advancedAnalytics.riskDistribution')}</CardTitle>
                <CardDescription>{t('advancedAnalytics.riskDistributionDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>{t('advancedAnalytics.topRiskCategories')}</CardTitle>
                <CardDescription>{t('advancedAnalytics.topRiskCategoriesDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: 'Data Privacy', count: 24 },
                        { category: 'Transparency', count: 18 },
                        { category: 'Fairness', count: 16 },
                        { category: 'Accountability', count: 12 },
                        { category: 'Safety', count: 10 },
                        { category: 'Human Oversight', count: 8 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#FF8042" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="systems">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>{t('advancedAnalytics.systemsByCategory')}</CardTitle>
                <CardDescription>{t('advancedAnalytics.systemsByCategoryDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={systemCategoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#00C49F" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('advancedAnalytics.systemRiskDistribution')}</CardTitle>
                <CardDescription>{t('advancedAnalytics.systemRiskDistributionDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Unacceptable', value: 4 },
                          { name: 'High-Risk', value: 14 },
                          { name: 'Limited-Risk', value: 26 },
                          { name: 'Minimal-Risk', value: 56 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="readiness">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>{t('advancedAnalytics.departmentalReadiness')}</CardTitle>
                <CardDescription>{t('advancedAnalytics.departmentalReadinessDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={readinessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="readiness" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('advancedAnalytics.readinessByComponent')}</CardTitle>
                <CardDescription>{t('advancedAnalytics.readinessByComponentDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      outerRadius={120} 
                      width={500} 
                      height={350} 
                      data={[
                        { subject: 'Training', score: 65 },
                        { subject: 'Documentation', score: 80 },
                        { subject: 'Systems', score: 72 },
                        { subject: 'Governance', score: 58 },
                        { subject: 'Risk Mgmt', score: 70 },
                      ]}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name={t('advancedAnalytics.readinessScore')} dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}
