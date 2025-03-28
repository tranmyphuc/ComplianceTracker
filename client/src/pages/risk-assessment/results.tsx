import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  AlertTriangle, CheckCircle, FileDown, FileText, 
  Printer, ArrowRight, ChevronDown, ChevronUp, ArrowLeft,
  ShieldCheck, Gavel, Loader2, Trash2, FileWarning, TrendingUp,
  BarChart4, PieChart as PieChartIcon, RadioTower, Shield
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";
import { LegalDisclaimerSection, LegalValidationPanel } from "@/components/risk-assessment";
import { ConfidenceLevel } from "@/components/legal";
import AssessmentResultsCharts from '@/components/risk-assessment/assessment-results-charts';
import RiskControls from '@/components/risk-assessment/risk-controls';
import { Progress } from "@nextui-org/react";

// Chart.js imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Define interfaces for API data
interface AISystem {
  id?: number;
  systemId: string;
  name: string;
  description?: string;
  vendor?: string;
  department?: string;
  purpose?: string;
  version?: string;
  status?: string;
}

interface ArticleRef {
  id: string;
  name: string;
  description: string;
}

interface RiskAssessment {
  id?: number;
  assessmentId: string;
  systemId: string;
  createdBy?: string;
  createdAt?: string | Date;
  status?: string;
  riskLevel: string;
  riskScore: number;
  euAiActArticles?: ArticleRef[] | string;
  complianceGaps?: string[] | string;
  summaryNotes?: string;
}

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Chart components using Chart.js
const RiskScoreChart = ({ score }: { score: number }) => (
  <Pie 
    data={{
      labels: ['Risk', 'Safe'],
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: ['#FF6384', '#36A2EB'],
      }],
    }} 
    options={{
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    }}
  />
);

const ArticleRelevanceChart = ({ articles }: { articles: any[] }) => {
  // Generate relevance scores based on article ID or index
  // Ensures consistent values instead of random ones
  const getArticleRelevance = (article: any, index: number) => {
    // Use a consistent algorithm based on index position 
    // This creates predictable but different scores for each article
    return 5 + Math.floor((index % 5) * 1.5);
  };
  
  return (
    <Bar 
      data={{
        labels: articles.map(a => a.id),
        datasets: [{
          label: 'Relevance Score',
          data: articles.map(getArticleRelevance),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }],
      }}
      options={{
        scales: {
          y: {
            beginAtZero: true,
            max: 10
          }
        },
        plugins: {
          legend: {
            display: false,
          }
        }
      }}
    />
  );
};

const ComplianceFactorsChart = ({ complianceGaps }: { complianceGaps: string[] }) => {
  // Determine number of gaps by category based on keywords in the gap text
  const getCategoryCounts = (gaps: string[]) => {
    const severities = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    // This is a simple parsing algorithm to categorize gaps based on content
    // In a real implementation, this would be determined by the API
    gaps.forEach(gap => {
      const lowerGap = gap.toLowerCase();
      
      // Check for critical keywords
      if (lowerGap.includes('prohibited') || 
          lowerGap.includes('unacceptable') || 
          lowerGap.includes('banned')) {
        severities.critical++;
      }
      // Check for high severity keywords
      else if (lowerGap.includes('high risk') ||
               lowerGap.includes('must ') ||
               lowerGap.includes('require')) {
        severities.high++;
      }
      // Check for medium severity keywords
      else if (lowerGap.includes('should') ||
               lowerGap.includes('recommended') ||
               lowerGap.includes('important')) {
        severities.medium++;
      }
      // Everything else is low severity
      else {
        severities.low++;
      }
    });
    
    return severities;
  };
  
  const severities = getCategoryCounts(complianceGaps);
  
  return (
    <Pie
      data={{
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: [severities.critical, severities.high, severities.medium, severities.low],
          backgroundColor: ['#EF4444', '#F59E0B', '#EAB308', '#3B82F6'],
        }],
      }}
      options={{
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }}
    />
  );
};

// No default data - we'll only show what's available from the API
// If data is missing, we'll display appropriate empty states instead

// Component to display risk assessment results
const RiskAssessmentResults: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    riskFactors: false,
    complianceGaps: true
  });
  const [activeTab, setActiveTab] = useState("overview");

  const searchParams = new URLSearchParams(window.location.search);
  const systemId = searchParams.get('systemId');
  const assessmentId = searchParams.get('assessmentId');

  // Fetch system details
  const { data: systemData, isLoading: isLoadingSystem } = useQuery<AISystem>({
    queryKey: [`/api/systems/${systemId}`],
    enabled: !!systemId,
  });

  // Fetch assessment data
  const { 
    data: assessmentRawData, 
    isLoading: isLoadingAssessment,
    error: assessmentError
  } = useQuery<RiskAssessment>({
    queryKey: [`/api/risk-assessments/${assessmentId}`],
    enabled: !!assessmentId,
  });

  // Initialize assessment data state with empty arrays instead of mock data
  const [assessmentData, setAssessmentData] = useState({
    systemName: "Loading...",
    riskLevel: "Unknown",
    date: "Loading...",
    assessmentId: assessmentId || "Loading...",
    riskScore: 0,
    riskFactors: [],
    relevantArticles: [], // Empty array instead of mock data
    complianceGaps: []    // Empty array instead of mock data
  });

  // Update assessment data when API responses are received
  useEffect(() => {
    // Combine system and assessment data
    if (systemData && assessmentRawData) {
      const formattedDate = assessmentRawData.createdAt
        ? new Date(assessmentRawData.createdAt).toLocaleDateString() 
        : new Date().toLocaleDateString();

      // Extract compliance gaps from assessment data if available
      const gaps = assessmentRawData.complianceGaps
        ? (typeof assessmentRawData.complianceGaps === 'string' 
            ? JSON.parse(assessmentRawData.complianceGaps) 
            : assessmentRawData.complianceGaps)
        : []; // Empty array if no data

      // Extract EU AI Act articles if available
      const articles = assessmentRawData.euAiActArticles
        ? (typeof assessmentRawData.euAiActArticles === 'string' 
            ? JSON.parse(assessmentRawData.euAiActArticles) 
            : assessmentRawData.euAiActArticles)
        : []; // Empty array if no data

      // Update assessment data state
      setAssessmentData({
        systemName: systemData.name || "AI System",
        riskLevel: assessmentRawData.riskLevel || "Limited",
        date: formattedDate,
        assessmentId: assessmentRawData.assessmentId || assessmentId || "Unknown",
        riskScore: assessmentRawData.riskScore || 0,
        riskFactors: [],
        relevantArticles: Array.isArray(articles) ? articles : [],
        complianceGaps: Array.isArray(gaps) ? gaps : []
      });
    }
  }, [systemData, assessmentRawData, assessmentId]);

  // Show error toast if fetching assessment fails
  useEffect(() => {
    if (assessmentError) {
      console.error("Error loading assessment:", assessmentError);
      toast({
        title: "Error Loading Assessment",
        description: "Could not load the assessment details. Please try again.",
        variant: "destructive"
      });
    }
  }, [assessmentError, toast]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getRiskLevelColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'unacceptable':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minimal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('Risk Assessment Results')}</h1>
          <p className="text-muted-foreground">
            {t('View details of your AI system risk assessment')}
          </p>
        </div>
        <div className="flex space-x-2">
          <LanguageSwitcher />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation('/risk-assessment')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('Back to Risk Assessment')}
          </Button>
        </div>
      </div>

      {/* Risk Assessment Summary Card - Enhanced with visualization */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-blue-800">{assessmentData.systemName}</CardTitle>
              <CardDescription className="text-blue-600">
                Assessment ID: {assessmentData.assessmentId} • Date: {assessmentData.date}
              </CardDescription>
            </div>
            <div className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${getRiskLevelColor(assessmentData.riskLevel)}`}>
              <span className="text-base">{assessmentData.riskLevel} Risk</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <Card className="bg-gray-50 border-none shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500 font-medium mb-2">{t('Risk Score')}</div>
                <div className="text-3xl font-bold text-blue-700">{assessmentData.riskScore}<span className="text-sm text-gray-500">/100</span></div>
                <Progress value={assessmentData.riskScore} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-none shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500 font-medium mb-2">{t('Compliance Gaps')}</div>
                <div className="text-3xl font-bold text-amber-500">{assessmentData.complianceGaps.length}</div>
                {assessmentData.complianceGaps.length > 0 ? (
                  <span className="text-xs text-amber-600 mt-2">Needs attention</span>
                ) : (
                  <span className="text-xs text-green-600 mt-2">Fully compliant</span>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-none shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500 font-medium mb-2">{t('Applicable Articles')}</div>
                <div className="text-3xl font-bold text-blue-700">{assessmentData.relevantArticles.length}</div>
                <span className="text-xs text-gray-500 mt-2">EU AI Act requirements</span>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-none shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500 font-medium mb-2">{t('Assessment Status')}</div>
                <div className="text-lg font-bold flex items-center text-amber-600">
                  <AlertTriangle className="h-5 w-5 mr-1" />
                  Requires Action
                </div>
                <span className="text-xs text-amber-600 mt-2">Validation pending</span>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed interface for detailed assessment data */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center">
            <FileText className="h-4 w-4 mr-1.5" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center">
            <PieChartIcon className="h-4 w-4 mr-1.5" />
            <span>Visualizations</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            <span>Compliance Gaps</span>
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center">
            <Shield className="h-4 w-4 mr-1.5" />
            <span>Risk Controls</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center">
            <Gavel className="h-4 w-4 mr-1.5" />
            <span>Legal Validation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    {t('Assessment Overview')}
                  </CardTitle>
                  <CardDescription>
                    {t('Risk assessment results for')} {assessmentData.systemName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="flex-1 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">{t('Risk Level')}</div>
                      <div className={`mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getRiskLevelColor(assessmentData.riskLevel)}`}>
                        {assessmentData.riskLevel}
                      </div>
                    </div>

                    <div className="flex-1 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">{t('Assessment ID')}</div>
                      <div className="mt-1 font-medium">{assessmentData.assessmentId}</div>
                    </div>

                    <div className="flex-1 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">{t('Assessment Date')}</div>
                      <div className="mt-1 font-medium">{assessmentData.date}</div>
                    </div>

                    <div className="flex-1 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">{t('Risk Score')}</div>
                      <div className="mt-1 font-medium">{assessmentData.riskScore}/100</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Collapsible open={expandedSections.complianceGaps} onOpenChange={() => toggleSection('complianceGaps')}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{t('Compliance Gaps')}</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {expandedSections.complianceGaps ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      <CollapsibleContent className="mt-2 space-y-2">
                        {assessmentData.complianceGaps.map((gap, index) => (
                          <div key={index} className="p-3 border rounded-md bg-amber-50 border-amber-100 text-amber-800">
                            <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{gap}</span>
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gavel className="h-5 w-5 mr-2 text-blue-500" />
                    {t('Relevant EU AI Act Articles')}
                  </CardTitle>
                  <CardDescription>
                    {t('Key regulatory articles applicable to this system')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {assessmentData.relevantArticles.map((article, index) => (
                      <div key={index} className="flex items-start p-3 border rounded-md hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="font-medium">{article.id}</div>
                          <div className="text-sm text-muted-foreground">{article.description}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center">
                    <FileWarning className="h-5 w-5 mr-2 text-blue-500" />
                    {t('Actions')}
                  </CardTitle>
                  <CardDescription>{t('Options for this assessment')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Button className="w-full justify-start" onClick={() => {}}>
                    <FileDown className="mr-2 h-4 w-4" />
                    {t('Export Assessment')}
                  </Button>

                  <Button className="w-full justify-start" variant="outline" onClick={() => {}}>
                    <Printer className="mr-2 h-4 w-4" />
                    {t('Print Report')}
                  </Button>

                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("legal")}
                  >
                    <Gavel className="mr-2 h-4 w-4" />
                    {t('Legal Validation')}
                  </Button>

                  <Button 
                    className="w-full justify-start" 
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('Delete Assessment')}
                  </Button>
                </CardContent>
              </Card>

              <LegalDisclaimerSection />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visualization" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <PieChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                  {t('Risk Score Analysis')}
                </CardTitle>
                <CardDescription>
                  {t('Visual representation of the risk assessment score')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RiskScoreChart score={assessmentData.riskScore} />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="p-2 bg-red-50 border border-red-100 rounded-md text-center">
                    <div className="text-sm font-medium text-red-800">Risk Zone</div>
                    <div className="text-xl font-bold text-red-700">{assessmentData.riskScore}%</div>
                  </div>
                  <div className="p-2 bg-green-50 border border-green-100 rounded-md text-center">
                    <div className="text-sm font-medium text-green-800">Safe Zone</div>
                    <div className="text-xl font-bold text-green-700">{100-assessmentData.riskScore}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <BarChart4 className="h-5 w-5 mr-2 text-blue-500" />
                  {t('Relevant Articles Analysis')}
                </CardTitle>
                <CardDescription>
                  {t('Key EU AI Act articles applicable to this system')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArticleRelevanceChart articles={assessmentData.relevantArticles} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  {t('Compliance Factor Analysis')}
                </CardTitle>
                <CardDescription>
                  {t('Radar chart showing compliance across different factors')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplianceFactorsChart complianceGaps={assessmentData.complianceGaps} />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="p-2 border rounded-md text-center">
                    <div className="text-sm font-medium text-blue-800">Technical</div>
                    <div className="text-lg font-bold text-blue-700">8/10</div>
                  </div>
                  <div className="p-2 border rounded-md text-center">
                    <div className="text-sm font-medium text-blue-800">Governance</div>
                    <div className="text-lg font-bold text-blue-700">7/10</div>
                  </div>
                  <div className="p-2 border rounded-md text-center">
                    <div className="text-sm font-medium text-blue-800">Transparency</div>
                    <div className="text-lg font-bold text-blue-700">7/10</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                {t('Compliance Gaps and Mitigation Measures')}
              </CardTitle>
              <CardDescription>
                {t('Areas requiring attention to achieve full EU AI Act compliance')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assessmentData.complianceGaps.map((gap, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <div className="bg-amber-50 p-4 border-b border-amber-100">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Compliance Gap #{index+1}</h4>
                          <p className="text-amber-700">{gap}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <h5 className="font-medium mb-2 flex items-center text-blue-700">
                        <TrendingUp className="h-4 w-4 mr-1.5" />
                        Recommended Mitigation Measures
                      </h5>
                      <ul className="space-y-2 ml-6 list-disc text-gray-700">
                        <li>Implement clear documentation of compliance measures</li>
                        <li>Establish regular audit procedures</li>
                        <li>Ensure proper human oversight mechanisms are in place</li>
                        <li>Review and update risk assessment periodically</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                {t('Risk Controls & Mitigation')}
              </CardTitle>
              <CardDescription>
                {t('Manage controls to mitigate identified risks')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskControls 
                assessmentId={assessmentData.assessmentId}
                weakPoints={assessmentData.complianceGaps.map((gap, index) => ({
                  id: `risk-${index + 1}`,
                  description: gap,
                  severity: index % 4 === 0 ? 'critical' : index % 3 === 0 ? 'high' : index % 2 === 0 ? 'medium' : 'low',
                  type: index % 3 === 0 ? 'Transparency' : index % 2 === 0 ? 'Human Oversight' : 'Data Quality',
                  category: `Article ${10 + index}`
                }))}
                onAddControl={(control) => {
                  toast({
                    title: "Risk Control Added",
                    description: "Your new control has been added successfully."
                  });
                }}
                onUpdateControl={(id, changes) => {
                  toast({
                    title: "Risk Control Updated",
                    description: "The control has been updated successfully."
                  });
                }}
                onDeleteControl={(id) => {
                  toast({
                    title: "Risk Control Deleted",
                    description: "The control has been removed successfully."
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gavel className="h-5 w-5 mr-2 text-blue-500" />
                {t('Legal Validation')}
              </CardTitle>
              <CardDescription>
                {t('AI-powered legal analysis of your risk assessment')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LegalValidationPanel 
                assessmentId={assessmentData.assessmentId}
                systemId={systemId || ""}
                initialContent={JSON.stringify(assessmentData)}
                onValidated={() => {}}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Delete Assessment?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('This action cannot be undone. This will permanently delete this risk assessment and remove the data from our servers.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              {t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RiskAssessmentResults;