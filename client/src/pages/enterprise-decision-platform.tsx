import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnterpriseDecisionPlatform } from '@/components/strategic/enterprise-decision-platform';
import { EnterpriseTourWizard } from '@/components/wizards/enterprise-wizard';
import { 
  TrendingUp, 
  BarChart3, 
  Lightbulb, 
  PlayCircle, 
  LineChart, 
  PieChart, 
  ArrowUpRight,
  Cpu,
  Activity,
  Cog,
  Rocket,
  Zap,
  Sparkles,
  BookOpen,
  LayoutGrid,
  Diamond
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function EnterprisePage() {
  const [showWizard, setShowWizard] = useState(false);
  const [, setLocation] = useLocation();

  const handleRestartWizard = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
  };

  const handleWizardSkip = () => {
    setShowWizard(false);
  };

  if (showWizard) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">✨ Enterprise AI Decision Platform</h1>
            <p className="text-muted-foreground mt-1">
              Tour of key features and capabilities
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowWizard(false)}>
            Exit Tour
          </Button>
        </div>
        <EnterpriseTourWizard 
          onComplete={handleWizardComplete}
          onSkip={handleWizardSkip}
        />
      </div>
    );
  }

  return (
    <div className="p-6 pt-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">🚀 Enterprise AI Decision Platform</h1>
            <p className="text-muted-foreground mt-1">
              Transform your strategic decision-making with advanced AI
            </p>
          </div>
          <Button onClick={handleRestartWizard} className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" /> {/* Added PlayCircle icon */}
            🔄 Restart Tour
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Welcome to the Enterprise AI Decision Platform</CardTitle>
              <CardDescription>
                Revolutionize your business decision-making with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The Enterprise AI Decision Platform combines cutting-edge artificial intelligence 
                with your business expertise to enhance strategic decision-making. Our platform
                analyzes vast amounts of data to provide actionable insights and recommendations, 
                helping you navigate the complexities of the EU AI Act with confidence.
              </p>
              <p className="mb-4 text-muted-foreground">
                Use our AI-powered tools to assess your systems, prioritize compliance efforts, 
                and optimize resource allocation while staying ahead of regulatory changes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Button className="w-full" onClick={() => setLocation("/strategic-planning")}>
                  Strategic Planning Tools
                </Button>
                <Button variant="outline" className="w-full" onClick={handleRestartWizard}>
                  Platform Tour
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Quick access to key platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-start h-auto py-3" onClick={() => setLocation("/market-insights")}>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Market Insights</div>
                      <div className="text-sm text-muted-foreground">Access real-time market intelligence</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3" onClick={() => setLocation("/risk-intelligence")}>
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-lg mr-3">
                      <BarChart3 className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Risk Intelligence</div>
                      <div className="text-sm text-muted-foreground">Identify and mitigate business risks</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3" onClick={() => setLocation("/decision-support")}>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <Lightbulb className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Decision Support</div>
                      <div className="text-sm text-muted-foreground">AI-powered recommendations</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}