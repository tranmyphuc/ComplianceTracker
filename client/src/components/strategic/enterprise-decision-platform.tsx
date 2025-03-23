import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnterpriseTourWizard } from "@/components/wizards/enterprise-wizard";
import { PlayCircleIcon, BarChart3, ShieldAlert, Building, Target, TrendingUp } from "lucide-react";

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
            <h2 className="text-3xl font-bold tracking-tight">🚀 Enterprise Decision Platform</h2>
            <p className="text-muted-foreground mt-2">
              Strategic tools to support AI investment and compliance decisions ✨
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
          <h2 className="text-3xl font-bold tracking-tight">🚀 Enterprise Decision Platform</h2>
          <p className="text-muted-foreground mt-2">
            Strategic tools to support AI investment and compliance decisions ✨
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
                src="/assets/images/tour/platform-overview.png" 
                alt="Decision Platform" 
                className="h-32 w-auto object-contain"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">✨ EU AI Act Compliance Decision Platform</h3>
              <p className="text-blue-700 mb-4">
                Make strategic decisions about your AI investments and compliance priorities with our powerful analytics and decision support tools.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setShowTour(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  🚀 Take the Tour
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  📚 Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">📊 Dashboard Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive overview of your AI compliance status
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-medium mb-1">🛡️ Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Evaluate and categorize AI systems by risk level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">🏢 Organization View</h3>
              <p className="text-sm text-muted-foreground">
                Department-level compliance insights and reporting
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">🎯 Decision Support</h3>
              <p className="text-sm text-muted-foreground">
                Strategic recommendations for compliance priorities
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">📈 Market Trends</TabsTrigger>
          <TabsTrigger value="investment">💰 Investment Analysis</TabsTrigger>
          <TabsTrigger value="compliance">✅ Compliance Strategy</TabsTrigger>
        </TabsList>
        <TabsContent value="trends" className="p-4 bg-muted/30 rounded-md mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Market Trends</h3>
            <Badge variant="outline" className="bg-blue-50">Real-time</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Interactive trend data will be displayed here, showing market movements relevant to your AI systems and compliance requirements.
          </p>
        </TabsContent>
        <TabsContent value="investment" className="p-4 bg-muted/30 rounded-md mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Investment Recommendations</h3>
            <Badge variant="outline" className="bg-green-50">AI-generated</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Personalized investment recommendations for optimizing your compliance efforts and AI strategy will appear here.
          </p>
        </TabsContent>
        <TabsContent value="compliance" className="p-4 bg-muted/30 rounded-md mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Strategic Compliance Roadmap</h3>
            <Badge variant="outline" className="bg-amber-50">Priority-based</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Your customized compliance strategy with prioritized actions and timelines will be shown in this section.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}