import { useState, useEffect } from "react";
import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard";
import { CriticalAlerts } from "@/components/dashboard/critical-alerts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { OnboardingWizard, UserOnboardingProfile } from "@/components/onboarding/onboarding-wizard";
import { TrainingInsights } from "@/components/dashboard/training-insights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Lightbulb, BookOpen, ListChecks, Building, User } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const [showLegacyDashboard, setShowLegacyDashboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserOnboardingProfile | null>(null);
  const [industryFocus, setIndustryFocus] = useState<string | null>(null);
  
  // Check if the onboarding wizard should be shown and load profile
  useEffect(() => {
    if (!hasCheckedOnboarding) {
      const onboardingCompleted = localStorage.getItem("onboardingCompleted");
      
      // Try to load saved profile data
      const savedProfile = localStorage.getItem("userOnboardingProfile");
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          setUserProfile(profileData);
          if (profileData.industry) {
            setIndustryFocus(profileData.industry);
          }
        } catch (e) {
          console.error("Error parsing saved profile:", e);
        }
      }
      
      if (onboardingCompleted !== "true") {
        // Show onboarding for first-time visitors
        setShowOnboarding(true);
      }
      
      setHasCheckedOnboarding(true);
    }
  }, [hasCheckedOnboarding]);

  // Handle onboarding completion with user profile data
  const handleOnboardingComplete = (profileData?: UserOnboardingProfile) => {
    localStorage.setItem("onboardingCompleted", "true");
    setShowOnboarding(false);
    
    // If we have user profile data, customize the dashboard experience
    if (profileData) {
      setUserProfile(profileData);
      if (profileData.industry) {
        setIndustryFocus(profileData.industry);
      }
    }
  };

  return (
    <>
      {showLegacyDashboard ? (
        /* Legacy Dashboard Content */
        <div className="md:flex">
          <div className="flex-1 p-4 md:p-6">
            {/* Put legacy dashboard content here if needed, 
            or simply remove the toggle option if not required */}
          </div>

          {/* Right Sidebar */}
          <div className="w-full md:w-80 p-4 md:p-6 space-y-6 lg:border-l lg:border-neutral-200">
            <CriticalAlerts />
            <RecentActivity />
            <UpcomingDeadlines />
          </div>
        </div>
      ) : (
        /* New Enterprise AI Decision Platform Dashboard */
        <div className="space-y-6">
          <ExecutiveDashboard />
          
          {/* Industry-specific recommendations if we have user profile data */}
          {userProfile && industryFocus && (
            <Card className="border-blue-200 shadow-md mb-6">
              
              <CardContent>
                <div className="space-y-4">
                  {/* Industry-specific recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {industryFocus === "Healthcare" && (
                      <>
                        <Link to="/demo-scenarios/healthcare-ai-diagnostics">
                          <div className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <Lightbulb className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Healthcare AI Diagnostics Demo</h4>
                              <p className="text-sm text-blue-600">Explore compliance for medical diagnostic AI</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </div>
                        </Link>
                        <Link to="/risk-assessment/guides">
                          <div className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <ListChecks className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Patient Data Compliance Guide</h4>
                              <p className="text-sm text-blue-600">Healthcare data protection requirements</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </div>
                        </Link>
                      </>
                    )}
                    
                    {industryFocus === "Financial Services" && (
                      <>
                        <Link to="/demo-scenarios/fintech-fraud-detection">
                          <div className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <Lightbulb className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Fintech Fraud Detection Demo</h4>
                              <p className="text-sm text-blue-600">Explore compliance for financial AI systems</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </div>
                        </Link>
                        <Link to="/knowledge-center">
                          <div className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Financial Risk Assessment Guide</h4>
                              <p className="text-sm text-blue-600">Credit scoring compliance requirements</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </div>
                        </Link>
                      </>
                    )}
                    
                    {industryFocus === "Manufacturing" && (
                      <>
                        <Link href="/risk-assessment">
                          <a className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <Lightbulb className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Manufacturing AI Safety Guide</h4>
                              <p className="text-sm text-blue-600">Safety requirements for production systems</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </a>
                        </Link>
                        <Link href="/documentation">
                          <a className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <ListChecks className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Quality Control Documentation</h4>
                              <p className="text-sm text-blue-600">Technical documentation templates</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </a>
                        </Link>
                      </>
                    )}
                    
                    {industryFocus === "Public Sector" && (
                      <>
                        <Link href="/demo-scenarios/public-sector-eligibility">
                          <a className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <Lightbulb className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Public Sector AI Demo</h4>
                              <p className="text-sm text-blue-600">Resource allocation compliance guide</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </a>
                        </Link>
                        <Link href="/documentation">
                          <a className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Transparency Documentation</h4>
                              <p className="text-sm text-blue-600">Public sector algorithmic transparency</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </a>
                        </Link>
                      </>
                    )}
                    
                    {/* Default recommendations for other industries */}
                    {!["Healthcare", "Financial Services", "Manufacturing", "Public Sector"].includes(industryFocus) && (
                      <>
                        <Link href="/inventory">
                          <a className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <Lightbulb className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Industry Compliance Guide</h4>
                              <p className="text-sm text-blue-600">Tailored to {industryFocus} requirements</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </a>
                        </Link>
                        <Link href="/risk-assessment">
                          <a className="flex items-center p-3 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="mr-3 p-2 bg-blue-500 text-white rounded-full">
                              <ListChecks className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-800">Risk Assessment</h4>
                              <p className="text-sm text-blue-600">Evaluate your AI system risks</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                          </a>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Role-specific recommendations removed as requested */}

          {/* Training & Compliance section removed as requested */}
        </div>
      )}

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}
    </>
  );
}