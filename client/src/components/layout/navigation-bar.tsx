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
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <HomeIcon className="w-4 h-4" />,
      isNew: false,
      badgeColor: '' 
    },
    // Settings moved to Cluster 2
  ];

  // ===== CLUSTER 1: EU AI Act Compliance Suite =====
  // Main compliance items - now including AI Inventory, Demo Scenarios and Pricing & Plans
  const complianceSuiteItems = [
    { 
      name: 'AI Inventory', 
      path: '/inventory', 
      icon: <CpuIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'AI Registration', 
      path: '/register-system', 
      icon: <BrainIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Demo Scenarios', 
      path: '/demo-scenarios', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Pricing & Plans', 
      path: '/pricing', 
      icon: <DollarSignIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Platform Tour', 
      path: '/guides/platform-guide', 
      icon: <HelpCircleIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: true,
      badgeColor: 'green'
    },
    { 
      name: 'Risk Assessment', 
      path: '/risk-assessment', 
      icon: <ShieldIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Risk Assessment Guides', 
      path: '/risk-assessment/guides', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Text Analyzer', 
      path: '/risk-assessment/text-analyzer', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Approval Workflow', 
      path: '/approval-workflow', 
      icon: <CheckSquareIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: true,
      badgeColor: 'green'
    },
    { 
      name: 'Compliance Reports', 
      path: '/reports', 
      icon: <BarChart3Icon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Governance Dashboard', 
      path: '/governance', 
      icon: <TargetIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Legal Review Platform', 
      path: '/legal-reviews', 
      icon: <ShieldIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
  ];

  // Knowledge & Training Resources
  const knowledgeResourcesItems = [
    { 
      name: 'EU AI Act Articles', 
      path: '/knowledge-center', 
      icon: <BookOpenIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Knowledge Center', 
      path: '/knowledge-center/advanced', 
      icon: <BookOpenIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'ISO 42001', 
      path: '/knowledge-center/iso42001', 
      icon: <BookOpenIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Training & Certification', 
      path: '/training', 
      icon: <AwardIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'EU AI Act Guides', 
      path: '/training/eu-ai-act-guides', 
      icon: <BookOpenIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: true,
      badgeColor: 'purple'
    },
    { 
      name: 'Documentation Center', 
      path: '/documentation', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Platform Guide', 
      path: '/guides/platform-guide', 
      icon: <HelpCircleIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
  ];

  // ===== CLUSTER 2: Decision Support Tools =====
  // Business Intelligence & Strategy Tools
  const businessIntelligenceItems = [
    { 
      name: 'Enterprise Decision Platform', 
      path: '/enterprise-decision-platform', 
      icon: <PieChartIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: true,
      badgeColor: 'blue'
    },
    { 
      name: 'Market Intelligence', 
      path: '/market-intelligence', 
      icon: <PieChartIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Strategic Planning', 
      path: '/strategic-planning', 
      icon: <TargetIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Regulatory Complexity', 
      path: '/regulatory-complexity', 
      icon: <NetworkIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Operations Excellence', 
      path: '/operations-excellence', 
      icon: <BriefcaseIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Growth & Innovation', 
      path: '/growth-innovation', 
      icon: <TrendingUpIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <SettingsIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false, 
      badgeColor: ''
    },
  ];

  // Demo Scenarios & Resources
  const demoItems = [
    { 
      name: 'Demo Scenarios', 
      path: '/demo-scenarios', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: true,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Healthcare AI', 
      path: '/demo-scenarios/healthcare-ai-diagnostics', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'SGH Consulting', 
      path: '/demo-scenarios/sgh-service-consulting', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Fintech Fraud Detection', 
      path: '/demo-scenarios/fintech-fraud-detection', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Manufacturing AI', 
      path: '/demo-scenarios/manufacturing-predictive-maintenance', 
      icon: <FileTextIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
    },
    { 
      name: 'Platform Introduction', 
      path: '/guides/platform-introduction', 
      icon: <HelpCircleIcon className="h-4 w-4 mr-2" />,
      isPriority: false,
      isNew: false,
      badgeColor: ''
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

            {/* Removed separate AI Inventory dropdown menu - now part of Compliance Suite */}

            {/* EU AI Act Compliance Suite Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-8 px-3 text-sm rounded-md whitespace-nowrap flex items-center gap-1.5 border-primary/30 bg-primary/5 font-medium",
                    complianceSuiteItems.some((item) => isActive(item.path)) && "bg-primary/20 text-primary font-medium border-primary/40"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldIcon className="h-4 w-4 text-primary" />
                    <span className="font-medium">Compliance Suite</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">92%</Badge>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel>EU AI Act Compliance Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  {complianceSuiteItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.name} 
                      asChild 
                      className={item.isPriority ? "bg-blue-50 font-medium mt-1" : "mt-1"}
                    >
                      <Link href={item.path} onClick={handleItemClick}>
                        {item.icon}
                        <span className={item.isPriority ? "font-medium" : ""}>{item.name}</span>
                        {item.isNew && renderBadge(item.badgeColor)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Knowledge Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-2 text-xs rounded-md whitespace-nowrap flex items-center gap-1",
                    knowledgeResourcesItems.some((item) => isActive(item.path)) && "bg-purple-50 text-purple-700 font-medium"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpenIcon className="h-4 w-4 text-purple-700" />
                    <span>Knowledge Resources</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Knowledge & Documentation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {knowledgeResourcesItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.name} 
                      asChild 
                      className={item.isPriority ? "bg-purple-50 font-medium mt-1" : "mt-1"}
                    >
                      <Link href={item.path} onClick={handleItemClick}>
                        {item.icon}
                        <span className={item.isPriority ? "font-medium" : ""}>{item.name}</span>
                        {item.isNew && renderBadge(item.badgeColor)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Business Intelligence Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-8 px-3 text-sm rounded-md whitespace-nowrap flex items-center gap-1.5 border-amber-300 bg-amber-50 font-medium",
                    businessIntelligenceItems.some((item) => isActive(item.path)) && "bg-amber-100 text-amber-700 font-medium border-amber-400"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <PieChartIcon className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Decision Support</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">New</Badge>
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel>Business Strategy & Planning</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {businessIntelligenceItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      asChild
                      className={item.isPriority ? "bg-amber-50 font-medium mt-1" : "mt-1"}
                    >
                      <Link href={item.path} onClick={handleItemClick}>
                        {item.icon}
                        <span className={item.isPriority ? "font-medium" : ""}>{item.name}</span>
                        {item.isNew && renderBadge(item.badgeColor)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Demo Scenarios Dropdown removed - now in Compliance Suite */}
            
            {/* Pricing Link removed from here and moved up next to AI Inventory */}
          </div>
        </ScrollArea>
      </div>
    </nav>
  );
}