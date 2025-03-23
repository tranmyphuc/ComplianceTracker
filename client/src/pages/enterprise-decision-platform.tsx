import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EnterpriseDecisionPlatform } from '@/components/strategic/enterprise-decision-platform';
import { Brain, TrendingUp, Target, BarChart3, Lightbulb, Sparkles, Network } from 'lucide-react';

export default function EnterprisePlatformPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [, setLocation] = useLocation();

  // Check if the wizard should be shown on first visit
  useEffect(() => {
    const wizardCompleted = localStorage.getItem("enterpriseWizardCompleted");
    if (wizardCompleted !== "true") {
      const timer = setTimeout(() => {
        setShowWizard(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle wizard completion
  const handleWizardComplete = () => {
    localStorage.setItem("enterpriseWizardCompleted", "true");
    setShowWizard(false);
  };

  // Handle restart wizard
  const handleRestartWizard = () => {
    setShowWizard(true);
  };

  // Features list
  const features = [
    {
      title: "AI-Powered Insights",
      description: "Access real-time market intelligence and predictive analytics",
      icon: Brain
    },
    {
      title: "Strategic Planning",
      description: "Leverage AI-driven scenario planning and optimization algorithms",
      icon: Target
    },
    {
      title: "Market Trends",
      description: "Stay ahead of market trends with AI pattern recognition",
      icon: TrendingUp
    },
    {
      title: "Executive Dashboard",
      description: "Customizable dashboard with decision-critical metrics",
      icon: BarChart3
    },
    {
      title: "Opportunity Detection",
      description: "Automatically identify new business opportunities",
      icon: Lightbulb
    },
    {
      title: "Generative AI",
      description: "Generate creative solutions to complex business challenges",
      icon: Sparkles
    },
    {
      title: "Data Integration",
      description: "Connect all your business systems and data sources",
      icon: Network
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 pt-16">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Enterprise AI Decision Platform</h1>
                <p className="text-muted-foreground mt-1">
                  Transform your strategic decision-making with advanced AI
                </p>
              </div>
              <Button onClick={handleRestartWizard}>
                Restart Tour
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
                    analyzes vast amounts of data to provide actionable insights and recommendations.
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
                <CardContent>
                  <ul className="space-y-2">
                    {features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          {React.createElement(feature.icon, { className: "h-4 w-4 text-primary" })}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={handleRestartWizard}>
                    Explore All Features
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
        
        {/* Enterprise Decision Platform Wizard */}
        {showWizard && (
          <EnterpriseDecisionPlatform 
            onComplete={handleWizardComplete} 
          />
        )}
      </div>
    </div>
  );
}