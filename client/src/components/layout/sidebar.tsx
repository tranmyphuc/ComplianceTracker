import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CpuIcon,
  AlertTriangleIcon,
  FileTextIcon,
  AwardIcon,
  CheckSquareIcon,
  BarChartIcon,
  BookOpenIcon,
  SettingsIcon,
  HomeIcon,
  BrainIcon,
  XIcon,
  FileText,
  BookOpen,
  LightbulbIcon,
  TrendingUpIcon,
  BriefcaseIcon,
  ShieldIcon,
  TargetIcon,
  BarChart3Icon,
  BotIcon,
  PieChartIcon,
  SmartphoneIcon,
  NetworkIcon,
  HelpCircleIcon,
  Sparkles,
  SparklesIcon,
  TrendingUpIcon as TrendingUpIconLucide, // Added Lucide version
  BriefcaseIcon as BriefcaseIconLucide, // Added Lucide version
  PieChartIcon as PieChartIconLucide, // Added Lucide version
  AlertTriangleIcon as AlertTriangleIconLucide, // Added Lucide version

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AiAssistantDialog } from "@/components/ai-assistant/assistant-dialog";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [assistantDialogOpen, setAssistantDialogOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // Conditionally handle item click on mobile to close the sidebar
  const handleItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Handle AI Assistant button click
  const handleAssistantClick = () => {
    setAssistantDialogOpen(true);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const mainNavigationItems = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Demo Scenarios', path: '/demo-scenarios', icon: <FileTextIcon className="w-5 h-5" /> },
    { name: 'Strategic Planning', path: '/strategic-planning', icon: <TargetIcon className="w-5 h-5" /> },
    { name: 'Market Intelligence', path: '/market-intelligence', icon: <PieChartIconLucide className="w-5 h-5" />, highlight: true },
    { name: 'Operations Excellence', path: '/operations-excellence', icon: <BriefcaseIconLucide className="w-5 h-5" />, highlight: true },
    { name: 'Growth & Innovation', path: '/growth-innovation', icon: <TrendingUpIconLucide className="w-5 h-5" />, highlight: true },
    { name: 'Legal Reviews', path: '/legal-reviews', icon: <ShieldIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];


  return (
    <div
      className={cn(
        "bg-gradient-to-b from-[#1976D2]/5 to-white border-r border-neutral-200 flex-shrink-0 transition-all duration-300 ease-in-out",
        "fixed lg:static inset-y-0 left-0 z-40",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "w-[260px] sm:w-[280px] lg:w-64",
        className
      )}
    >
      {isMobile && (
        <div className="absolute right-2 top-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
      )}

      <ScrollArea className="h-full">
        <div className="p-4 space-y-1">
          {/* Company/user branding area */}
          <div className="flex items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-neutral-200">
            <div className="flex flex-col">
              <div className="font-bold text-base sm:text-lg text-primary">SGH ASIA</div>
              <div className="text-xs text-neutral-600">Enterprise AI Decision Platform</div>
            </div>
          </div>

          {/* Navigation menu with icons and text */}
          <div className="space-y-1">
            {mainNavigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                  isActive(item.path) && "bg-primary/10 text-primary font-medium"
                )}
                onClick={handleItemClick}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>


          {/* Rest of the original sidebar content remains unchanged */}
          <div className="mt-4 sm:mt-6 mb-2 sm:mb-3 px-3 py-1 sm:py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider">EU AI Act Compliance</p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] sm:text-xs">92%</Badge>
            </div>
          </div>

          <Link 
            href="/inventory"
            className={cn(
              "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/inventory") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <CpuIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>AI Systems</span>
          </Link>

          <Link 
            href="/risk-assessment"
            className={cn(
              "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/risk-assessment") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <ShieldIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>Risk Assessment</span>
          </Link>

          {/* Risk Management is now integrated into Risk Assessment */}

          <Link 
            href="/documentation"
            className={cn(
              "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/documentation") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <FileTextIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>Documentation</span>
          </Link>

          <Link 
            href="/training"
            className={cn(
              "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/training") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <AwardIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>Training</span>
          </Link>



          <Link 
            href="/tasks"
            className={cn(
              "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/tasks") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <CheckSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>Tasks</span>
          </Link>

          <Link 
            href="/reports"
            className={cn(
              "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/reports") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <BarChart3Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>Reports</span>
          </Link>

          {/* Additional Links */}
          <div className="pt-4 mt-4 border-t border-neutral-200">
            <Link 
              href="/register-system"
              className={cn(
                "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/register-system") && "bg-primary/10 text-primary font-medium"
              )}
              onClick={handleItemClick}
            >
              <BrainIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
              <span>Register AI System</span>
            </Link>

            <Link 
              href="/knowledge-center"
              className={cn(
                "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/knowledge-center") && "bg-primary/10 text-primary font-medium"
              )}
              onClick={handleItemClick}
            >
              <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
              <span>Knowledge Center</span>
            </Link>

            <Link 
              href="/guides"
              className={cn(
                "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors duration-200",
                isActive("/guides") && "bg-primary/10 text-primary font-medium",
                "bg-orange-50"
              )}
              onClick={handleItemClick}
            >
              <HelpCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 text-orange-500" />
              <span>Platform Guides</span>
              <Badge variant="outline" className="ml-2 px-1.5 py-0.5 h-5 bg-orange-100 border-orange-200 text-orange-700 text-[10px]">New</Badge>
            </Link>

            <Link 
              href="/workflow"
              className={cn(
                "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/workflow") && "bg-primary/10 text-primary font-medium"
              )}
              onClick={handleItemClick}
            >
              <NetworkIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
              <span>AI Workflow Diagram</span>
            </Link>
            
            <Link 
              href="/approval-workflow"
              className={cn(
                "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/approval-workflow") && "bg-primary/10 text-primary font-medium",
                "bg-green-50"
              )}
              onClick={handleItemClick}
            >
              <CheckSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 text-green-600" />
              <span>Approval Workflow</span>
              <Badge variant="outline" className="ml-2 px-1.5 py-0.5 h-5 bg-green-100 border-green-200 text-green-700 text-[10px]">New</Badge>
            </Link>

            <Link 
              href="/onboarding"
              className={cn(
                "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/onboarding") && "bg-primary/10 text-primary font-medium",
                "mt-2 bg-purple-50"
              )}
              onClick={handleItemClick}
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 text-purple-500" />
              <span className="font-medium">Platform Tour</span>
              <Badge variant="outline" className="ml-2 px-1.5 py-0.5 h-5 bg-purple-100 border-purple-200 text-purple-700 text-[10px]">New</Badge>
            </Link>

            <Link 
              href="/enterprise-decision-platform"
              className={cn(
                "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/enterprise-decision-platform") && "bg-primary/10 text-primary font-medium",
                "mt-2 bg-blue-50"
              )}
              onClick={handleItemClick}
            >
              <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 text-blue-500" />
              <span className="font-medium">Enterprise Decision Platform</span>
              <Badge variant="outline" className="ml-2 px-1.5 py-0.5 h-5 bg-blue-100 border-blue-200 text-blue-700 text-[10px]">New</Badge>
            </Link>
          </div>

          {/* AI Assistant button at bottom */}
          <div className="pt-8 mt-4">
            <Button 
              className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-[#7B1FA2]/90 hover:bg-[#7B1FA2] text-xs sm:text-sm"
              onClick={handleAssistantClick}
            >
              <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>AI Assistant</span>
            </Button>
          </div>

          {/* AI Assistant Dialog */}
          <AiAssistantDialog 
            open={assistantDialogOpen}
            onOpenChange={setAssistantDialogOpen}
          />

          {/* Mobile-only footer links */}
          <div className="lg:hidden pt-8 pb-4">
            <div className="text-xs text-center text-neutral-500">
              © 2025 SGH ASIA Ltd.<br/>
              All rights reserved
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
}