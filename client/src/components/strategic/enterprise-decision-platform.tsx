import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnterpriseTourWizard } from "@/components/wizards/enterprise-wizard";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { InfoIcon, ArrowRightIcon, PlayCircleIcon, BarChartIcon, PieChartIcon, ActivityIcon } from "lucide-react";

interface EnterpriseDecisionPlatformProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function EnterpriseDecisionPlatform({ onComplete, onSkip }: EnterpriseDecisionPlatformProps) {
  const [showTour, setShowTour] = useState(false);

  if (showTour) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Enterprise Decision Platform</h2>
            <p className="text-muted-foreground mt-2">
              Strategic tools to support AI investment and compliance decisions
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowTour(false)}>
            Exit Tour
          </Button>
        </div>

        <EnterpriseTourWizard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Enterprise Decision Platform</h2>
          <p className="text-muted-foreground mt-2">
            Strategic tools to support AI investment and compliance decisions
          </p>
        </div>
        <Button 
          onClick={() => setShowTour(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <PlayCircleIcon className="h-4 w-4" />
          Platform Tour
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <img 
                src="/assets/images/tour/placeholder.png" 
                alt="Decision Platform" 
                className="h-32 w-auto object-contain"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">EU AI Act Compliance Decision Platform</h3>
              <p className="text-blue-700 mb-4">
                Make strategic decisions about your AI investments and compliance priorities with our powerful analytics and decision support tools.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setShowTour(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Take the Tour
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-indigo-500" />
              AI Portfolio Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze your organization's AI portfolio to identify investment opportunities and compliance gaps
            </p>
            <Button className="w-full flex items-center justify-center gap-1">
              Start Analysis
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-emerald-500" />
              Compliance Cost Estimator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Estimate costs for achieving and maintaining compliance across your AI systems
            </p>
            <Button className="w-full flex items-center justify-center gap-1">
              Calculate Costs
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-amber-500" />
              Risk/Value Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Map your AI systems according to business value and compliance risk
            </p>
            <Button className="w-full flex items-center justify-center gap-1">
              View Matrix
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decision Support Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Answer a few questions about your organization's AI strategy and compliance needs to receive personalized recommendations
          </p>
          <div className="flex gap-3">
            <Button size="lg" className="flex items-center gap-2">
              Start Guided Assessment
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">View Sample Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}