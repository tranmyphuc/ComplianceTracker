import React, { useState } from "react";
import { BotIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuProvider } from "@/providers/menu-context";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // ID to ensure we only render one instance
  const layoutId = React.useId();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <MenuProvider>
      <div id={`app-layout-${layoutId}`} className="min-h-screen flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar className={sidebarOpen ? "" : "hidden"} />

          <main className="flex-1 overflow-y-auto pb-10">
            {/* Mobile Sidebar Toggle Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="fixed top-16 left-4 z-50 h-10 w-10 rounded-full bg-background shadow-md"
              >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )}
            {children}
          </main>
        </div>

        <Footer preventDuplicate={true} />

        {/* AI Chat Button (Mobile) */}
        <div className="fixed right-4 bottom-4 md:hidden z-50">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-[#7B1FA2] hover:bg-[#6A1B9A]"
          >
            <BotIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </MenuProvider>
  );
};