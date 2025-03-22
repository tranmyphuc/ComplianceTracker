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
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className={cn("bg-white border-r border-neutral-200 w-64 flex-shrink-0", className)}>
      <ScrollArea className="h-[calc(100vh-56px)]">
        <div className="p-4 space-y-1">
          <Link href="/">
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/") && "bg-primary/10 text-primary font-medium"
              )}
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </a>
          </Link>
          
          <div className="my-1 px-3 py-1.5">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">AI Systems</p>
          </div>
          
          <Link href="/inventory">
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/inventory") && "bg-primary/10 text-primary font-medium"
              )}
            >
              <CpuIcon className="h-5 w-5 mr-3" />
              <span>AI Inventory</span>
            </a>
          </Link>
          
          <Link href="/register-system">
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/register-system") && "bg-primary/10 text-primary font-medium"
              )}
            >
              <BrainIcon className="h-5 w-5 mr-3" />
              <span>Register System</span>
            </a>
          </Link>
          
          <Link href="/risk-assessment">
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/risk-assessment") && "bg-primary/10 text-primary font-medium"
              )}
            >
              <AlertTriangleIcon className="h-5 w-5 mr-3" />
              <span>Risk Assessment</span>
            </a>
          </Link>
          
          <div className="mt-3 mb-1 px-3 py-1.5">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Compliance</p>
          </div>
          
          <Link href="/documentation">
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/documentation") && "bg-primary/10 text-primary font-medium"
              )}
            >
              <FileTextIcon className="h-5 w-5 mr-3" />
              <span>Documentation</span>
            </a>
          </Link>
          
          <Link href="/tasks">
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/tasks") && "bg-primary/10 text-primary font-medium"
              )}
            >
              <CheckSquareIcon className="h-5 w-5 mr-3" />
              <span>Tasks</span>
            </a>
          </Link>
          
          <Link href="/reports">
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                isActive("/reports") && "bg-primary/10 text-primary font-medium"
              )}
            >
              <BarChartIcon className="h-5 w-5 mr-3" />
              <span>Reports</span>
            </a>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-neutral-200">
            <Link href="/knowledge-center">
              <a
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                  isActive("/knowledge-center") && "bg-primary/10 text-primary font-medium"
                )}
              >
                <BookOpenIcon className="h-5 w-5 mr-3" />
                <span>Knowledge Center</span>
              </a>
            </Link>
            
            <Link href="/training">
              <a
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                  isActive("/training") && "bg-primary/10 text-primary font-medium"
                )}
              >
                <AwardIcon className="h-5 w-5 mr-3" />
                <span>Training</span>
              </a>
            </Link>
            
            <Link href="/settings">
              <a
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md text-neutral-700 hover:bg-neutral-100",
                  isActive("/settings") && "bg-primary/10 text-primary font-medium"
                )}
              >
                <SettingsIcon className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </a>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
