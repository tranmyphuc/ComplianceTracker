import React, { useState, ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiAssistantDialog } from "@/components/ai-assistant/assistant-dialog";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assistantDialogOpen, setAssistantDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header with top navigation bar */}
      <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      {/* New horizontal navigation bar */}
      <NavigationBar 
        isMobile={isMobile} 
        onItemClick={() => isMobile && setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-10">
        {children}
      </main>

      <Footer />

      {/* AI Chat Button (Mobile) */}
      <div className="fixed right-4 bottom-4 md:hidden z-50">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg bg-[#7B1FA2] hover:bg-[#6A1B9A]"
          onClick={() => setAssistantDialogOpen(true)}
        >
          <SparklesIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* AI Assistant Dialog */}
      <AiAssistantDialog 
        open={assistantDialogOpen}
        onOpenChange={setAssistantDialogOpen}
      />
    </div>
  );
}