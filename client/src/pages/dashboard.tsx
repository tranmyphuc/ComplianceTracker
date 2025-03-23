import { useState, useEffect } from "react";
import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard";
import { CriticalAlerts } from "@/components/dashboard/critical-alerts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { TrainingInsights } from "@/components/dashboard/training-insights"; // Added import

export default function Dashboard() {
  const [showLegacyDashboard, setShowLegacyDashboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  // Check if the onboarding wizard should be shown
  useEffect(() => {
    if (!hasCheckedOnboarding) {
      const onboardingCompleted = localStorage.getItem("onboardingCompleted");
      if (onboardingCompleted !== "true") {
        // Show onboarding for first-time visitors
        setShowOnboarding(true);
      }
      setHasCheckedOnboarding(true);
    }
  }, [hasCheckedOnboarding]);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setShowOnboarding(false);
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
        <div className="flex">
          <div className="flex-1">
            <ExecutiveDashboard />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Existing dashboard components would go here */}
              <TrainingInsights data={{ // Added TrainingInsights component
                totalModules: 6,
                completedModules: 2,
                inProgressModules: 1,
                roleCompletionPercentage: 40,
                recentCertificates: [
                  {
                    id: "cert-1",
                    title: "EU AI Act Introduction",
                    date: "2 days ago"
                  }
                ]
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}
    </>
  );
}