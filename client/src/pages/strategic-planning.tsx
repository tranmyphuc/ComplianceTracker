import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnterpriseWizard } from "@/components/wizards/enterprise-wizard";
import { ComplianceTracker } from "@/components/compliance/compliance-tracker";
import { BotIcon, Brain, Lightbulb, TrendingUp, Target, AlertTriangle, ChevronRight } from "lucide-react";

export default function StrategicPlanning() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDecisionMakerWizard, setShowDecisionMakerWizard] = useState(false);
  const [hasCheckedWizard, setHasCheckedWizard] = useState(false);

  // Check if the decision maker wizard should be shown
  useEffect(() => {
    if (!hasCheckedWizard) {
      const wizardCompleted = localStorage.getItem("decisionWizardCompleted");
      if (wizardCompleted !== "true") {
        // Show wizard for first-time visitors after a short delay
        const timer = setTimeout(() => {
          setShowDecisionMakerWizard(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
      setHasCheckedWizard(true);
    }
  }, [hasCheckedWizard]);

  // Handle wizard completion
  const handleWizardComplete = () => {
    localStorage.setItem("decisionWizardCompleted", "true");
    setShowDecisionMakerWizard(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className={sidebarOpen ? "" : "hidden"} onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="p-4 md:p-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-800">Strategic Planning</h1>
                <p className="text-neutral-500 mt-1">Make smarter decisions with AI-powered insights and compliance tracking</p>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => setShowDecisionMakerWizard(true)}>
                  <Brain className="h-4 w-4 mr-1.5" />
                  Decision Wizard
                </Button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dashboard">
                    <Target className="mr-2 h-4 w-4" /> Executive View
                  </TabsTrigger>
                  <TabsTrigger value="compliance">
                    <AlertTriangle className="mr-2 h-4 w-4" /> Compliance
                  </TabsTrigger>
                  <TabsTrigger value="insights">
                    <Lightbulb className="mr-2 h-4 w-4" /> AI Insights
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard" className="pt-6">
                  {/* Executive Dashboard View */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Strategic Focus Areas */}
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Strategic Focus Areas</CardTitle>
                        <CardDescription>Key areas requiring attention based on AI analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg bg-blue-50/40">
                            <div className="flex items-start">
                              <div className="bg-blue-100 p-2 rounded mr-3">
                                <TrendingUp className="h-5 w-5 text-blue-700" />
                              </div>
                              <div>
                                <h3 className="font-medium text-blue-800">Market Expansion Opportunity</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                  AI analysis suggests a 68% probability of success with healthcare sector expansion.
                                </p>
                                <Button variant="link" className="text-xs text-blue-600 p-0 h-auto mt-1">
                                  View detailed analysis <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg bg-amber-50/40">
                            <div className="flex items-start">
                              <div className="bg-amber-100 p-2 rounded mr-3">
                                <AlertTriangle className="h-5 w-5 text-amber-700" />
                              </div>
                              <div>
                                <h3 className="font-medium text-amber-800">Compliance Risk Alert</h3>
                                <p className="text-sm text-amber-700 mt-1">
                                  EU AI Act compliance status requires attention with 2 critical tasks overdue.
                                </p>
                                <Button variant="link" className="text-xs text-amber-600 p-0 h-auto mt-1" onClick={() => setActiveTab("compliance")}>
                                  Review compliance tasks <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg bg-green-50/40">
                            <div className="flex items-start">
                              <div className="bg-green-100 p-2 rounded mr-3">
                                <Lightbulb className="h-5 w-5 text-green-700" />
                              </div>
                              <div>
                                <h3 className="font-medium text-green-800">Efficiency Improvement</h3>
                                <p className="text-sm text-green-700 mt-1">
                                  Process optimization analysis shows potential for 23% operational cost reduction.
                                </p>
                                <Button variant="link" className="text-xs text-green-600 p-0 h-auto mt-1" onClick={() => setActiveTab("insights")}>
                                  Explore recommendation <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Decision Support Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">AI Decision Support</CardTitle>
                        <CardDescription>Get AI-powered answers to business questions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-6 flex flex-col items-center justify-center h-[250px] bg-gradient-to-b from-blue-50 to-indigo-50 rounded-lg border text-center">
                          <Brain className="h-10 w-10 text-primary/70 mb-4" />
                          <h3 className="font-medium text-lg mb-2">Strategic AI Assistant</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Ask questions about market trends, competitive analysis, or business optimization
                          </p>
                          <Button>
                            <BotIcon className="mr-2 h-4 w-4" /> Start Conversation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="compliance" className="pt-6">
                  {/* Compliance Tracker */}
                  <ComplianceTracker />
                </TabsContent>
                
                <TabsContent value="insights" className="pt-6">
                  {/* AI Insights */}
                  <div className="p-8 flex flex-col items-center justify-center h-[400px] bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg border text-center">
                    <Lightbulb className="h-12 w-12 text-yellow-500 mb-4" />
                    <h3 className="font-medium text-xl mb-2">AI Insights Coming Soon</h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      We're working on a comprehensive AI insights dashboard that will provide actionable intelligence for your strategic decisions.
                    </p>
                    <div className="p-4 bg-white/80 backdrop-blur rounded-lg max-w-md text-left">
                      <h4 className="font-medium text-purple-800 mb-2">Preview: Efficiency Improvement Insight</h4>
                      <p className="text-sm text-gray-700">
                        "Analysis of your operational data indicates that integrating AI-powered workflow automation could 
                        reduce processing time by 31% and labor costs by 23%. Key areas for optimization include customer 
                        onboarding, document processing, and quality control procedures."
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
      
      {/* Enterprise Wizard */}
      {showDecisionMakerWizard && (
        <EnterpriseWizard
          onComplete={handleWizardComplete}
          variant="centered"
          title="Strategic Planning Tools"
          description="Optimize your strategic decision-making with AI"
        />
      )}
    </div>
  );
}