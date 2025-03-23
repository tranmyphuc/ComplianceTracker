import React, { useState } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BotIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - now visible by default on all screens */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="flex-1 overflow-y-auto bg-background">
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
      <Footer />
      
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
  );
};