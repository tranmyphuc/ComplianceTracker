import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Check, 
  ChevronRight, 
  Lightbulb, 
  FileText, 
  Shield, 
  AlertTriangle,
  FileCheck,
  Database,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";

export default function PlatformIntroduction() {
  const [, navigate] = useLocation();
  
  // Get user profile if available
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user/profile'],
    retry: false,
    refetchOnWindowFocus: false
  });
  
  return (
    <AppLayout>
      <Helmet>
        <title>Platform Introduction | EU AI Act Compliance</title>
      </Helmet>
      
      <div className="container px-4 py-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Getting Started with Your Compliance Journey</h1>
          <p className="text-slate-600 mb-4">
            Welcome to the EU AI Act Compliance Platform. This guide will help you navigate the platform and 
            get started with your compliance journey.
          </p>
          
          {/* Welcome card with personalized greeting */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-blue-100 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-blue-800">
                <span className="mr-2">👋</span> 
                Welcome, {userProfile?.displayName || "Compliance Professional"}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-3">
                You've taken the first step towards EU AI Act compliance. This platform is designed to guide you through the entire 
                compliance process with interactive tools, expert guidance, and comprehensive resources.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white text-blue-700 border-blue-200"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard <ChevronRight size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white text-blue-700 border-blue-200"
                  onClick={() => navigate("/register-system")}
                >
                  Register Your First AI System <ChevronRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Main guide content */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="border-l-4 border-blue-400 pl-4 pb-2">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">1</span>
                Register Your AI Systems
              </h2>
              <p className="text-slate-600 my-2">
                Start by registering your AI systems in the inventory. This helps you track all your systems and their compliance status.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <Card className="border-slate-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-lg mr-3">
                        <Database className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">AI System Inventory</h3>
                        <p className="text-xs text-slate-500 mb-2">
                          Create a comprehensive inventory of all your AI systems and track their compliance status.
                        </p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-blue-600"
                          onClick={() => navigate("/register-system")}
                        >
                          Register a System
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-lg mr-3">
                        <FileCheck className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Classification Guide</h3>
                        <p className="text-xs text-slate-500 mb-2">
                          Learn how to properly classify your AI systems according to the EU AI Act requirements.
                        </p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-blue-600"
                          onClick={() => navigate("/knowledge-center")}
                        >
                          View Classification Guide
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="border-l-4 border-purple-400 pl-4 pb-2">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="bg-purple-100 text-purple-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">2</span>
                Conduct Risk Assessments
              </h2>
              <p className="text-slate-600 my-2">
                Assess the risk level of your AI systems using our structured assessment tools. This helps determine the compliance requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <Card className="border-slate-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-lg mr-3">
                        <AlertTriangle className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Risk Assessment Wizard</h3>
                        <p className="text-xs text-slate-500 mb-2">
                          Step-by-step guide to assess the risk level of your AI systems according to the EU AI Act criteria.
                        </p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-blue-600"
                          onClick={() => navigate("/risk-assessment/guides")}
                        >
                          Start Risk Assessment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-lg mr-3">
                        <Shield className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Risk Mitigation Strategies</h3>
                        <p className="text-xs text-slate-500 mb-2">
                          Learn about effective strategies to mitigate risks identified in your AI systems.
                        </p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-blue-600"
                          onClick={() => navigate("/dashboard")}
                        >
                          View Strategies
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="border-l-4 border-green-400 pl-4 pb-2">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="bg-green-100 text-green-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">3</span>
                Generate Required Documentation
              </h2>
              <p className="text-slate-600 my-2">
                Based on the risk assessment, generate the required documentation for your AI systems.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <Card className="border-slate-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-lg mr-3">
                        <FileText className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Documentation Templates</h3>
                        <p className="text-xs text-slate-500 mb-2">
                          Access templates for technical documentation, conformity declarations, and other required documents.
                        </p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-blue-600"
                          onClick={() => navigate("/dashboard")}
                        >
                          Access Templates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-lg mr-3">
                        <BookOpen className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Documentation Guide</h3>
                        <p className="text-xs text-slate-500 mb-2">
                          Learn what documentation is required for different risk categories under the EU AI Act.
                        </p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-blue-600"
                          onClick={() => navigate("/dashboard")}
                        >
                          View Documentation Guide
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Tips section */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center text-amber-800">
              <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
              Pro Tips for Successful Compliance
            </h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-800">
                  <strong>Start with high-risk systems</strong>: Focus on your high-risk AI systems first as they require the most comprehensive compliance measures.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-800">
                  <strong>Document everything</strong>: Maintain detailed records of your compliance activities, including risk assessments, mitigation measures, and testing results.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-800">
                  <strong>Involve key stakeholders</strong>: Ensure collaboration between technical teams, legal/compliance personnel, and business decision-makers.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-amber-800">
                  <strong>Regular updates</strong>: Review and update your compliance measures regularly, especially when there are changes to your AI systems or the regulatory landscape.
                </span>
              </li>
            </ul>
          </div>
          
          {/* Get started CTA */}
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <span className="text-lg">Go to Your Dashboard</span>
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}