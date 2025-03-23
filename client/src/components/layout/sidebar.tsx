import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Dashboard, BarChart2, AlertTriangle, FileText, BookOpen, 
  Settings, Activity, Clock, Shield, Database, Award, 
  BarChart, List, TrendingUp, Cpu, MessageSquare, Sliders
} from 'react-feather';
import { cn } from '../../utils/cn';

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  to, 
  badge, 
  isNew, 
  isActive = false 
}: { 
  icon: React.ElementType; 
  label: string; 
  to: string; 
  badge?: string; 
  isNew?: boolean; 
  isActive?: boolean;
}) => {
  return (
    <Link to={to}>
      <div 
        className={cn(
          "flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors",
          isActive 
            ? "text-primary-foreground bg-primary" 
            : "text-muted-foreground hover:text-primary hover:bg-accent"
        )}
      >
        <Icon size={18} className="mr-2" />
        <span>{label}</span>

        {badge && (
          <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-success text-success-foreground">
            {badge}
          </span>
        )}

        {isNew && (
          <span className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
            New
          </span>
        )}
      </div>
    </Link>
  );
};

export const Sidebar = () => {
  const [location] = useLocation();

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <h2 className="text-lg font-bold">SGH ASIA</h2>
        </div>
        <div className="text-xs text-muted-foreground">Enterprise AI Decision Platform</div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="px-2 space-y-1">
          <SidebarItem 
            icon={Dashboard} 
            label="Home/Dashboard" 
            to="/" 
            isActive={location === "/"} 
          />

          <SidebarItem 
            icon={BarChart2} 
            label="Strategic Planning" 
            to="/strategic-planning" 
            isActive={location === "/strategic-planning"} 
          />

          <SidebarItem 
            icon={Activity} 
            label="Market Intelligence" 
            to="/market-intelligence"
            isActive={location === "/market-intelligence"}  
          />

          <SidebarItem 
            icon={BarChart} 
            label="Operations Excellence"
            to="/operations-excellence" 
            isActive={location === "/operations-excellence"} 
          />

          <SidebarItem 
            icon={AlertTriangle} 
            label="Risk Management" 
            to="/risk-management" 
            isActive={location === "/risk-management"} 
          />

          <SidebarItem 
            icon={TrendingUp} 
            label="Growth & Innovation" 
            to="/growth-innovation"
            isActive={location === "/growth-innovation"} 
          />

          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            to="/settings" 
            isActive={location === "/settings"} 
          />
        </nav>

        <div className="mt-6 px-3 py-2">
          <div className="text-xs font-medium text-muted-foreground">EU AI ACT COMPLIANCE <span className="ml-1 px-1.5 py-0.5 rounded bg-success text-success-foreground">92%</span></div>
        </div>

        <nav className="px-2 space-y-1">
          <SidebarItem 
            icon={Cpu} 
            label="AI Systems" 
            to="/inventory" 
            isActive={location.startsWith("/inventory")} 
          />

          <SidebarItem 
            icon={AlertTriangle} 
            label="Risk Assessment" 
            to="/risk-assessment" 
            isActive={location.startsWith("/risk-assessment")} 
          />

          <SidebarItem 
            icon={FileText} 
            label="Documentation" 
            to="/documentation" 
            isActive={location.startsWith("/documentation")} 
          />

          <SidebarItem 
            icon={BookOpen} 
            label="Training" 
            to="/training" 
            isActive={location.startsWith("/training")} 
          />

          <SidebarItem 
            icon={List} 
            label="Training Docs" 
            to="/training-docs" 
            isActive={location === "/training-docs"} 
          />

          <SidebarItem 
            icon={List} 
            label="Tasks" 
            to="/tasks" 
            isActive={location === "/tasks"} 
          />

          <SidebarItem 
            icon={BarChart} 
            label="Reports" 
            to="/reports" 
            isActive={location === "/reports"} 
          />

          <SidebarItem 
            icon={Database} 
            label="Register AI System" 
            to="/register-system" 
            isActive={location === "/register-system"} 
          />

          <SidebarItem 
            icon={MessageSquare} 
            label="Knowledge Center" 
            to="/knowledge-center"
            isActive={location === "/knowledge-center"} 
          />

          <SidebarItem 
            icon={Sliders} 
            label="AI Workflow Diagram" 
            to="/workflow" 
            isActive={location === "/workflow"} 
          />

          <SidebarItem 
            icon={Clock} 
            label="Platform Tour" 
            to="/platform-tour" 
            isNew 
            isActive={location === "/platform-tour"} 
          />

          <SidebarItem 
            icon={Shield} 
            label="Enterprise Decision Platform" 
            to="/enterprise-decision-platform" 
            isNew 
            isActive={location === "/enterprise-decision-platform"} 
          />
        </nav>
      </div>

      <div className="p-3 mt-auto">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Award size={16} />
          <span>AI Assistant</span>
        </button>
      </div>
    </div>
  );
};