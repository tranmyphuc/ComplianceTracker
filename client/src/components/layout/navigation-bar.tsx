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

            {/* EU AI Act - Main dropdown with prominent styling */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-8 px-3 text-sm rounded-md whitespace-nowrap flex items-center gap-1.5 border-primary/30 bg-primary/5 font-medium",
                    complianceItems.some(item => isActive(item.path)) && "bg-primary/20 text-primary font-medium border-primary/40"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldIcon className="h-4 w-4 text-primary" />
                    <span className="font-medium">EU AI Act</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">92%</Badge>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>EU AI Act Compliance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {/* High-Priority Items with badges and special styling */}
                  <DropdownMenuItem asChild>
                    <Link href="/inventory" onClick={handleItemClick} className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 mb-1">
                      <CpuIcon className="h-4 w-4 mr-2" />
                      <span className="font-medium">AI Systems Inventory</span>
                      <Badge variant="outline" className="ml-auto px-1.5 py-0.5 h-5 bg-blue-100 border-blue-200 text-blue-700 text-[10px]">Important</Badge>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register-system" onClick={handleItemClick} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 mb-1">
                      <BrainIcon className="h-4 w-4 mr-2" />
                      <span className="font-medium">Register New AI System</span>
                      <Badge variant="outline" className="ml-auto px-1.5 py-0.5 h-5 bg-emerald-100 border-emerald-200 text-emerald-700 text-[10px]">Key</Badge>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/risk-assessment" onClick={handleItemClick} className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 mb-1">
                      <ShieldIcon className="h-4 w-4 mr-2" />
                      <span className="font-medium">Risk Assessment</span>
                      <Badge variant="outline" className="ml-auto px-1.5 py-0.5 h-5 bg-amber-100 border-amber-200 text-amber-700 text-[10px]">Critical</Badge>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/knowledge-center" onClick={handleItemClick} className="mb-1">
                      <BookOpenIcon className="h-4 w-4 mr-2" />
                      <span>Knowledge Center</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/documentation" onClick={handleItemClick} className="mb-1">
                      <FileTextIcon className="h-4 w-4 mr-2" />
                      <span>Documentation</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reports" onClick={handleItemClick} className="mb-1">
                      <BarChart3Icon className="h-4 w-4 mr-2" />
                      <span>Compliance Reports</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/training" onClick={handleItemClick} className="mb-1">
                      <AwardIcon className="h-4 w-4 mr-2" />
                      <span>Training & Certification</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* AI Systems dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-2 text-xs rounded-md whitespace-nowrap",
                    isActive("/inventory") || isActive("/register-system") ? "bg-blue-50 text-blue-700 border border-blue-200" : ""
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <CpuIcon className="h-4 w-4" />
                    <span>AI Systems</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>AI System Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/inventory" onClick={handleItemClick}>
                      <CpuIcon className="h-4 w-4 mr-2" />
                      <span>AI Systems Inventory</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register-system" onClick={handleItemClick}>
                      <BrainIcon className="h-4 w-4 mr-2" />
                      <span>Register New AI System</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/workflow" onClick={handleItemClick}>
                      <NetworkIcon className="h-4 w-4 mr-2" />
                      <span>AI Workflow Diagram</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs rounded-md whitespace-nowrap"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldIcon className="h-4 w-4" />
                    <span>Risk Assessment</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Risk Assessment Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/risk-assessment" onClick={handleItemClick}>
                      <ShieldIcon className="h-4 w-4 mr-2" />
                      <span>Risk Assessment Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/risk-assessment/wizard" onClick={handleItemClick}>
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      <span>Risk Assessment Wizard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/risk-assessment/results" onClick={handleItemClick}>
                      <BarChart3Icon className="h-4 w-4 mr-2" />
                      <span>Assessment Results</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs rounded-md whitespace-nowrap"
                >
                  <span className="flex items-center gap-1.5">
                    <FileTextIcon className="h-4 w-4" />
                    <span>Compliance</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Compliance Resources</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/documentation" onClick={handleItemClick}>
                      <FileTextIcon className="h-4 w-4 mr-2" />
                      <span>Documentation</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/knowledge-center" onClick={handleItemClick}>
                      <BookOpenIcon className="h-4 w-4 mr-2" />
                      <span>Knowledge Center</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/training" onClick={handleItemClick}>
                      <AwardIcon className="h-4 w-4 mr-2" />
                      <span>Training & Certification</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reports" onClick={handleItemClick}>
                      <BarChart3Icon className="h-4 w-4 mr-2" />
                      <span>Compliance Reports</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-2 text-xs rounded-md whitespace-nowrap",
                    isActive("/approval-workflow") && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <CheckSquareIcon className="h-4 w-4" />
                    <span>Workflows</span>
                    <Badge variant="outline" className="ml-1 px-1.5 py-0.5 h-5 bg-green-100 border-green-200 text-green-700 text-[10px]">New</Badge>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Workflow Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/approval-workflow" onClick={handleItemClick}>
                      <CheckSquareIcon className="h-4 w-4 mr-2 text-green-600" />
                      <span>Approval Workflow</span>
                      <Badge variant="outline" className="ml-2 px-1.5 py-0.5 h-5 bg-green-100 border-green-200 text-green-700 text-[10px]">New</Badge>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tasks" onClick={handleItemClick}>
                      <CheckSquareIcon className="h-4 w-4 mr-2" />
                      <span>Tasks & Assignments</span>
                    </Link>
                  </DropdownMenuItem>
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