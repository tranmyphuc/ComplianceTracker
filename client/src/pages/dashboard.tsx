import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard";
import { CriticalAlerts } from "@/components/dashboard/critical-alerts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { Button } from "@/components/ui/button";
import { BotIcon } from "lucide-react";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLegacyDashboard, setShowLegacyDashboard] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className={sidebarOpen ? "" : "hidden"} />
        
        <main className="flex-1 overflow-y-auto pb-10">
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
              </div>
            </div>
          )}
        </main>
      </div>
      
      <Footer />
      
      {/* AI Chat Button (Mobile) */}
      <div className="fixed right-4 bottom-4 md:hidden z-50">
        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-[#7B1FA2] hover:bg-[#6A1B9A]">
          <BotIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
