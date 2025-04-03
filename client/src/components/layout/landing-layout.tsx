import React, { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header for landing page */}
      <header className="py-4 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="EU AI Act Compliance Platform" 
              className="h-10 w-auto mr-3"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/200x80/e2e8f0/475569?text=AI+Compliance";
              }}
            />
            <h1 className="text-xl font-bold text-slate-900">EU AI Act Compliance</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="mr-2">
                Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}