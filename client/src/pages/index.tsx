
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, BarChart3, PieChart, TrendingUp, AlertTriangle, CheckCircle, FileText, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import AIChatbotWidget from "@/components/dashboard/ai-chatbot-widget";
import RiskAssessmentMatrix from "@/components/dashboard/risk-assessment-matrix";
import ComplianceProgressChart from "@/components/dashboard/compliance-progress-chart";
import ResourceUsageChart from "@/components/dashboard/resource-usage-chart";
import AISystemsOverview from "@/components/dashboard/ai-systems-overview";
import DashboardGuide from "@/components/dashboard/dashboard-guide";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [openGuide, setOpenGuide] = useState(false);
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

      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="compliance">{t("dashboard.tabs.compliance")}</TabsTrigger>
          <TabsTrigger value="business">{t("dashboard.tabs.business")}</TabsTrigger>
        </TabsList>
        
        {/* EU AI Act Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.cards.systems.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : dashboardData?.totalSystems}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.cards.systems.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.cards.highRisk.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : dashboardData?.highRiskSystems}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.cards.highRisk.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.cards.compliant.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : dashboardData?.compliantSystems}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.cards.compliant.description")}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            <span className="text-xs text-muted-foreground">{update.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <RiskAssessmentMatrix />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AISystemsOverview className="lg:col-span-2" />
            <AIChatbotWidget />
          </div>
        </TabsContent>

        {/* Business Impact Tab */}
        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.business.roi.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : "€2.4M"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.business.roi.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <PieChart className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.business.efficiencyGain.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : "32%"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.business.efficiencyGain.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.business.marketAdvantage.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : "18%"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.business.marketAdvantage.description")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium mb-1">{t("dashboard.business.riskReduction.title")}</h3>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : "43%"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.business.riskReduction.description")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.business.resourceUsage.title")}</CardTitle>
                <CardDescription>
                  {t("dashboard.business.resourceUsage.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResourceUsageChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.business.successStories.title")}</CardTitle>
                <CardDescription>
                  {t("dashboard.business.successStories.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <p>{t("dashboard.loading")}</p>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="font-medium">Healthcare AI Diagnostics</div>
                        <Badge className="ml-auto">+€1.2M Value</Badge>
                      </div>
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="font-medium">Manufacturing Predictive Maintenance</div>
                        <Badge className="ml-auto">32% Efficiency</Badge>
                      </div>
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="font-medium">Financial Risk Assessment</div>
                        <Badge className="ml-auto">22% Risk Reduction</Badge>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="font-medium">SGH Service Consulting</div>
                        <Badge className="ml-auto">18% Growth</Badge>
                      </div>
                      <Separator className="my-2" />
                      <Button variant="outline" className="w-full" size="sm">
                        View All Case Studies
                      </Button>
                    </>
                  )}
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
