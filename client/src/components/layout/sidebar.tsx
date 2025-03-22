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
  PlusCircleIcon,
  BrainIcon,
  SparklesIcon,
  XIcon,
  FileText,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

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

  return (
    <div 
      className={cn(
        "bg-white border-r border-neutral-200 flex-shrink-0 transition-all duration-300 ease-in-out",
        "fixed lg:static inset-y-0 left-0 z-40",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "w-[280px] lg:w-64",
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
          {/* Mobile Logo */}
          <div className="flex items-center mb-4 lg:hidden">
            <div className="font-bold text-lg text-primary mr-1">SGH ASIA</div>
            <span className="font-semibold text-base">EU AI Act</span>
          </div>

          <Link 
            href="/"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <HomeIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Dashboard</span>
          </Link>

          <div className="my-1 px-3 py-1.5">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">AI Systems</p>
          </div>

          <Link 
            href="/inventory"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/inventory") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <CpuIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>AI Inventory</span>
          </Link>

          <Link 
            href="/register-system"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/register-system") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <BrainIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Register System</span>
          </Link>

          <Link 
            href="/risk-assessment"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/risk-assessment") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <AlertTriangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Risk Assessment</span>
          </Link>

          <div className="mt-3 mb-1 px-3 py-1.5">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Compliance</p>
          </div>

            <Link 
              href="/risk-assessment/guides"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/risk-assessment/guides") && "bg-primary/10 text-primary font-medium"
              )}
              onClick={handleItemClick}
            >
              <FileText className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>Risk Assessment Guides</span>
            </Link>
            
            <Link
              href="/documentation/risk-assessment"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/documentation/risk-assessment") && "bg-primary/10 text-primary font-medium"
              )}
              onClick={handleItemClick}
            >
              <BookOpen className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>Full Documentation</span>
            </Link>


          <Link 
            href="/documentation"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/documentation") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <FileTextIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Documentation</span>
          </Link>

          <Link 
            href="/tasks"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/tasks") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <CheckSquareIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Tasks</span>
          </Link>

          <Link 
            href="/reports"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
              isActive("/reports") && "bg-primary/10 text-primary font-medium"
            )}
            onClick={handleItemClick}
          >
            <BarChartIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Reports</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-neutral-200">
            <Link 
              href="/knowledge-center"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/knowledge-center") && "bg-primary/10 text-primary font-medium"
              )}
              onClick={handleItemClick}
            >
              <BookOpenIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>Knowledge Center</span>
            </Link>

            <Link 
              href="/training"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/training") && "bg-primary/10 text-primary font-medium"
              )}
              onClick={handleItemClick}
            >
              <AwardIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>Training</span>
            </Link>

            <Link 
              href="/settings"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/settings") && "bg-primary/10 text-primary font-medium"
              )}
              onClick={handleItemClick}
            >
              <SettingsIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>Settings</span>
            </Link>
          </div>

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