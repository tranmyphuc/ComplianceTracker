import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  CpuIcon,
  FileTextIcon,
  AwardIcon,
  CheckSquareIcon,
  BarChart3Icon,
  BookOpenIcon,
  SettingsIcon,
  HomeIcon,
  BrainIcon,
  ShieldIcon,
  TargetIcon,
  PieChartIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  SparklesIcon,
  NetworkIcon,
  HelpCircleIcon,
  DollarSignIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface NavigationBarProps {
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export function NavigationBar({ className, isMobile = false, onItemClick }: NavigationBarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // Handle item click for mobile
  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  // Main navigation items that will be in the horizontal bar
  const mainNavigationItems = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon className="w-4 h-4" /> },
    { name: 'Demo Scenarios', path: '/demo-scenarios', icon: <FileTextIcon className="w-4 h-4" /> },
    { name: 'Strategic Planning', path: '/strategic-planning', icon: <TargetIcon className="w-4 h-4" /> },
    { name: 'Market Intelligence', path: '/market-intelligence', icon: <PieChartIcon className="w-4 h-4" /> },
    { name: 'Operations Excellence', path: '/operations-excellence', icon: <BriefcaseIcon className="w-4 h-4" /> },
    { name: 'Growth & Innovation', path: '/growth-innovation', icon: <TrendingUpIcon className="w-4 h-4" /> },
    { name: 'Legal Reviews', path: '/legal-reviews', icon: <ShieldIcon className="w-4 h-4" /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  // EU AI Act Compliance items for dropdown
  const complianceItems = [
    { name: 'AI Systems', path: '/inventory', icon: <CpuIcon className="h-4 w-4 mr-2" /> },
    { name: 'Risk Assessment', path: '/risk-assessment', icon: <ShieldIcon className="h-4 w-4 mr-2" /> },
    { name: 'Documentation', path: '/documentation', icon: <FileTextIcon className="h-4 w-4 mr-2" /> },
    { name: 'Training', path: '/training', icon: <AwardIcon className="h-4 w-4 mr-2" /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquareIcon className="h-4 w-4 mr-2" /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3Icon className="h-4 w-4 mr-2" /> },
    { name: 'Register AI System', path: '/register-system', icon: <BrainIcon className="h-4 w-4 mr-2" /> },
    { name: 'Knowledge Center', path: '/knowledge-center', icon: <BookOpenIcon className="h-4 w-4 mr-2" /> },
  ];

  // Platform features items for dropdown
  const platformItems = [
    { 
      name: 'Platform Guides', 
      path: '/guides', 
      icon: <HelpCircleIcon className="h-4 w-4 mr-2 text-orange-500" />,
      isNew: true,
      badgeColor: 'orange' 
    },
    { 
      name: 'AI Workflow Diagram', 
      path: '/workflow', 
      icon: <NetworkIcon className="h-4 w-4 mr-2" /> 
    },
    { 
      name: 'Approval Workflow', 
      path: '/approval-workflow', 
      icon: <CheckSquareIcon className="h-4 w-4 mr-2 text-green-600" />,
      isNew: true,
      badgeColor: 'green'
    },
    { 
      name: 'Platform Tour', 
      path: '/onboarding', 
      icon: <SparklesIcon className="h-4 w-4 mr-2 text-purple-500" />,
      isNew: true,
      badgeColor: 'purple'
    },
    { 
      name: 'Enterprise Decision Platform', 
      path: '/enterprise-decision-platform', 
      icon: <PieChartIcon className="h-4 w-4 mr-2 text-blue-500" />,
      isNew: true,
      badgeColor: 'blue'
    },
    { 
      name: 'Service Packages & Pricing', 
      path: '/pricing', 
      icon: <DollarSignIcon className="h-4 w-4 mr-2 text-green-500" />,
      isNew: true,
      badgeColor: 'green'
    },
  ];

  const renderBadge = (color: string) => {
    const colorMap: Record<string, string> = {
      orange: "bg-orange-100 border-orange-200 text-orange-700",
      green: "bg-green-100 border-green-200 text-green-700",
      purple: "bg-purple-100 border-purple-200 text-purple-700",
      blue: "bg-blue-100 border-blue-200 text-blue-700",
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`ml-2 px-1.5 py-0.5 h-5 ${colorMap[color]} text-[10px]`}
      >
        New
      </Badge>
    );
  };

  return (
    <nav className={cn("bg-white border-b border-neutral-200 py-1", className)}>
      <div className="container mx-auto">
        <ScrollArea className="w-full">
          <div className="flex items-center space-x-1 sm:space-x-2 px-2 py-1 min-w-max">
            {/* Main navigation items */}
            {!isMobile && mainNavigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "flex items-center px-2 py-1.5 text-xs rounded-md text-neutral-700 hover:bg-neutral-100 whitespace-nowrap",
                  isActive(item.path) && "bg-primary/10 text-primary font-medium"
                )}
                onClick={handleItemClick}
              >
                <span className="flex items-center">
                  {item.icon}
                  <span className="ml-1.5">{item.name}</span>
                </span>
              </Link>
            ))}

            {/* EU AI Act Compliance Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-2 text-xs rounded-md whitespace-nowrap flex items-center gap-1",
                    complianceItems.some(item => isActive(item.path)) && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldIcon className="h-4 w-4" />
                    <span>EU AI Act</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">92%</Badge>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>EU AI Act Compliance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {complianceItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.path}
                        className={cn(
                          "flex w-full cursor-pointer",
                          isActive(item.path) && "bg-primary/10 text-primary font-medium"
                        )}
                        onClick={handleItemClick}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Platform Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-2 text-xs rounded-md whitespace-nowrap flex items-center gap-1",
                    platformItems.some(item => isActive(item.path)) && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <SparklesIcon className="h-4 w-4" />
                    <span>Platform Features</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Platform Features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {platformItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.path}
                        className={cn(
                          "flex w-full cursor-pointer",
                          isActive(item.path) && "bg-primary/10 text-primary font-medium"
                        )}
                        onClick={handleItemClick}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                        {item.isNew && renderBadge(item.badgeColor)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ScrollArea>
      </div>
    </nav>
  );
}