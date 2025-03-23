import React from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block w-64 overflow-y-auto">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-background">
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