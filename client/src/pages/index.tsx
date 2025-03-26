
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InfoIcon, ArrowRight, Clock, FileText, BarChart3, AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

import ComplianceProgressChart from "@/components/dashboard/compliance-progress-chart";
import RiskDistributionChart from "@/components/dashboard/risk-distribution-chart";
import ResourceUsageChart from "@/components/dashboard/resource-usage-chart";
import AIChatbotWidget from "@/components/dashboard/ai-chatbot-widget";
import DashboardGuide from "@/components/dashboard/dashboard-guide";
import { useDashboardSummary } from "@/lib/api/dashboard";

export default function Dashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [openGuide, setOpenGuide] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-compliance");
  const { data: dashboardData, isLoading, error } = useDashboardSummary();
  
  useEffect(() => {
    if (error) {
      toast({
        title: t("dashboard.error"),
        description: t("dashboard.errorDescription"),
        variant: "destructive",
      });
    }
  }, [error, toast, t]);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.subtitle")}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Button variant="outline" size="sm" onClick={() => setOpenGuide(true)}>
            <InfoIcon className="h-4 w-4 mr-2" />
            {t("dashboard.guide")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ai-compliance">{t("dashboard.tabs.aiCompliance")}</TabsTrigger>
          <TabsTrigger value="business-intelligence">{t("dashboard.tabs.businessIntelligence")}</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-compliance" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.cards.totalSystems.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : dashboardData?.totalSystems}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.cards.totalSystems.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.cards.highRiskSystems.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : dashboardData?.highRiskSystems}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.cards.highRiskSystems.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.cards.complianceRate.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : `${dashboardData?.complianceRate || 0}%`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.cards.complianceRate.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.cards.pendingActions.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : dashboardData?.pendingActions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.cards.pendingActions.description")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("dashboard.cards.complianceProgress.title")}</CardTitle>
                <CardDescription>
                  {t("dashboard.cards.complianceProgress.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplianceProgressChart data={isLoading ? [] : dashboardData?.complianceProgressData || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.cards.riskDistribution.title")}</CardTitle>
                <CardDescription>
                  {t("dashboard.cards.riskDistribution.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RiskDistributionChart data={isLoading ? [] : dashboardData?.riskDistributionData || []} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("dashboard.cards.recentUpdates.title")}</CardTitle>
                <CardDescription>
                  {t("dashboard.cards.recentUpdates.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <p>{t("dashboard.loading")}</p>
                  ) : (
                    dashboardData?.recentUpdates?.map((update, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <div className="mt-0.5">
                          {update.type === "regulatory" ? (
                            <FileText className="h-5 w-5 text-blue-600" />
                          ) : update.type === "system" ? (
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{update.title}</div>
                          <p className="text-sm text-muted-foreground">{update.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{update.category}</Badge>
                            {update.importance === "high" && (
                              <Badge variant="destructive">
                                {t("dashboard.highImportance")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.cards.aiAssistant.title")}</CardTitle>
                <CardDescription>
                  {t("dashboard.cards.aiAssistant.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIChatbotWidget />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business-intelligence" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.businessIntelligence.monthlyRevenue")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€4.2M</div>
                <p className="text-xs text-muted-foreground">+ 12% above forecast</p>
                <ResourceUsageChart className="h-10 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.businessIntelligence.operationalEfficiency")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+ 5% improvement</p>
                <div className="flex justify-center mt-2">
                  <div className="h-20 w-20 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle className="text-slate-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                      <circle className="text-blue-500" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" 
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - 0.87)}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">Improved in 3 key areas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.businessIntelligence.marketShare")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <p className="text-xs text-muted-foreground">+ 2% growth</p>
                <div className="h-2 bg-slate-200 rounded-full mt-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '32%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Leading in 2 segments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.businessIntelligence.complianceScore")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">+ 6% improvement</p>
                <div className="h-2 bg-slate-200 rounded-full mt-2">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">5 actions needed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("dashboard.businessIntelligence.strategicOpportunities")}</CardTitle>
                <CardDescription>
                  {t("dashboard.businessIntelligence.aiPoweredAnalysis")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">{t("dashboard.businessIntelligence.marketExpansion")}</h3>
                    <p className="text-sm text-muted-foreground my-2">
                      {t("dashboard.businessIntelligence.marketExpansionDesc")}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">High Impact</Badge>
                        <Badge variant="secondary">92% Confidence</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        {t("dashboard.businessIntelligence.explore")}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">{t("dashboard.businessIntelligence.strategicPartnership")}</h3>
                    <p className="text-sm text-muted-foreground my-2">
                      {t("dashboard.businessIntelligence.strategicPartnershipDesc")}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">High Impact</Badge>
                        <Badge variant="secondary">87% Confidence</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        {t("dashboard.businessIntelligence.explore")}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">{t("dashboard.businessIntelligence.efficiencyImprovement")}</h3>
                    <p className="text-sm text-muted-foreground my-2">
                      {t("dashboard.businessIntelligence.efficiencyImprovementDesc")}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Medium Impact</Badge>
                        <Badge variant="secondary">94% Confidence</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        {t("dashboard.businessIntelligence.explore")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.businessIntelligence.pendingDecisions")}</CardTitle>
                <CardDescription>
                  {t("dashboard.businessIntelligence.decisionsRequiringAttention")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{t("dashboard.businessIntelligence.riskAssessmentApproval")}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="destructive">High Priority</Badge>
                          <span className="text-xs text-muted-foreground">Due in 2 days</span>
                        </div>
                      </div>
                      <Button size="sm">{t("dashboard.businessIntelligence.takeAction")}</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{t("dashboard.businessIntelligence.complianceReportReview")}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Medium Priority</Badge>
                          <span className="text-xs text-muted-foreground">Marketing</span>
                        </div>
                      </div>
                      <Button size="sm">{t("dashboard.businessIntelligence.takeAction")}</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{t("dashboard.businessIntelligence.aiSystemRegistration")}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Medium Priority</Badge>
                          <span className="text-xs text-muted-foreground">Operations</span>
                        </div>
                      </div>
                      <Button size="sm">{t("dashboard.businessIntelligence.takeAction")}</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="text-sm" size="sm">
                    {t("dashboard.businessIntelligence.manageAllDecisions")}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <DashboardGuide open={openGuide} onOpenChange={setOpenGuide} />
    </div>
  );
}
