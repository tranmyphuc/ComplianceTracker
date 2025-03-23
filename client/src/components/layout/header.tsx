import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  SearchIcon, 
  BellIcon, 
  HelpCircleIcon, 
  UserIcon,
  MonitorIcon,
  DatabaseIcon,
  AlertTriangleIcon,
  FileTextIcon,
  BookOpenIcon,
  ListIcon,
  BarChartIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NavItem = ({ 
  icon: Icon, 
  label, 
  to, 
  isActive = false 
}: { 
  icon: React.ElementType; 
  label: string; 
  to: string; 
  isActive?: boolean;
}) => {
  return (
    <Link to={to}>
      <div className={cn(
        "flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors text-white",
        isActive ? "bg-primary-dark" : "hover:bg-primary-dark"
      )}>
        <Icon size={18} className="mr-2" />
        <span>{label}</span>
      </div>
    </Link>
  );
};

export const Header = () => {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo and company name */}
        <div className="flex items-center">
          <Link to="/">
            <div className="flex items-center cursor-pointer">
              <MonitorIcon size={22} className="mr-2" />
              <span className="font-bold text-lg">SGH ASIA</span>
            </div>
          </Link>
        </div>

        {/* Main navigation - Removed to eliminate duplication */}
        {/* <nav className="hidden md:flex items-center space-x-1">
          <NavItem 
            icon={MonitorIcon} 
            label="Dashboard" 
            to="/" 
            isActive={location === "/"} 
          />

          <NavItem 
            icon={DatabaseIcon} 
            label="AI Systems" 
            to="/inventory" 
            isActive={location.startsWith("/inventory")} 
          />

          <NavItem 
            icon={AlertTriangleIcon} 
            label="Risk Assessment" 
            to="/risk-assessment" 
            isActive={location.startsWith("/risk-assessment")} 
          />

          <NavItem 
            icon={FileTextIcon} 
            label="Documentation" 
            to="/documentation" 
            isActive={location.startsWith("/documentation")} 
          />

          <NavItem 
            icon={BookOpenIcon} 
            label="Training" 
            to="/training" 
            isActive={location.startsWith("/training")} 
          />

          <NavItem 
            icon={ListIcon} 
            label="Tasks" 
            to="/tasks" 
            isActive={location === "/tasks"} 
          />

          <NavItem 
            icon={BarChartIcon} 
            label="Reports" 
            to="/reports" 
            isActive={location === "/reports"} 
          />
        </nav> */}

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 px-3 py-1 text-sm rounded-md bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <SearchIcon 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>

          <button className="relative p-1.5 rounded-full hover:bg-primary-dark transition-colors">
            <BellIcon size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-destructive"></span>
          </button>

          <button className="p-1.5 rounded-full hover:bg-primary-dark transition-colors">
            <HelpCircleIcon size={20} />
          </button>

          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-dark hover:ring-2 hover:ring-background transition-all">
            <UserIcon size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};