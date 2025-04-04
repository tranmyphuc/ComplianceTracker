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
          {/* Industry-specific recommendations removed as requested */}

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