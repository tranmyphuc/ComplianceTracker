import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  BellIcon, 
  Bot, 
  MenuIcon, 
  SearchIcon, 
  HelpCircleIcon, 
  BotIcon,
  LayoutDashboardIcon,
  CpuIcon,
  ShieldCheckIcon,
  FileTextIcon,
  AwardIcon,
  CheckSquareIcon,
  BarChart3Icon,
  LightbulbIcon,
} from "lucide-react";
import { getCurrentUser } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AiAssistantDialog } from "@/components/ai-assistant/assistant-dialog";
import { useAuth } from "@/components/auth/auth-context";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { toast } = useToast();
  const auth = getAuth();
  // Get the authenticated user from useAuth hook
  const { user, logout } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      // Use the logout function from AuthContext, which works for both Firebase and development mode
      logout();

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  const getInitials = (displayName?: string | null) => {
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Development Mode Banner */}
      <div className="bg-green-500 text-white text-center text-xs py-1 font-medium">
        DEVELOPMENT MODE - Automatically logged in as Admin
      </div>
      
      {/* Main header with blue gradient */}
      <div className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 lg:px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-white hover:bg-white/20">
              <MenuIcon className="h-5 w-5" />
            </Button>

            <div className="flex items-center ml-2 lg:ml-0">
              <div className="font-bold text-lg mr-1">SGH ASIA</div>
              <span className="font-medium text-xs xs:text-sm sm:text-base hidden xs:inline">
                Enterprise AI <span className="hidden sm:inline">Decision Platform</span>
              </span>
            </div>
          </div>

          {/* Center: Main navigation tabs */}
          <div className="hidden lg:flex items-center space-x-1 mx-4">
            <Button variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <LayoutDashboardIcon className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <CpuIcon className="h-4 w-4 mr-2" />
              AI Systems
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Risk Assessment
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Documentation
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <AwardIcon className="h-4 w-4 mr-2" />
              Training
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <CheckSquareIcon className="h-4 w-4 mr-2" />
              Tasks
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <BarChart3Icon className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>

          {/* Right-aligned items */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search bar */}
            <div className="relative hidden md:block w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
              <BellIcon className="h-5 w-5" />
              <Badge className="absolute top-0 right-0 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">3</Badge>
            </Button>

            {/* Help */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <HelpCircleIcon className="h-5 w-5" />
            </Button>

            {/* User profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0.5 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20">
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-white bg-primary">{user ? getInitials(user.displayName) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CpuIcon className="mr-2 h-4 w-4" />
                  <span>AI Systems</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LightbulbIcon className="mr-2 h-4 w-4" />
                  <span>Strategic Planning</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Optional: New Feature Announcement Banner */}
      <div className="bg-[#7B1FA2]/10 border-b border-[#7B1FA2]/20 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center text-xs sm:text-sm">
          <Badge variant="outline" className="bg-[#7B1FA2] text-white border-none mr-2 text-[10px] sm:text-xs">New</Badge>
          <span className="font-medium text-[#7B1FA2] line-clamp-1">
            AI-powered strategic recommendations <span className="hidden xs:inline">now available</span>
          </span>
        </div>
        <Button variant="ghost" className="text-[10px] sm:text-xs h-6 px-2 sm:px-3 text-[#7B1FA2] hover:bg-[#7B1FA2]/10 ml-1">
          <span className="hidden xs:inline">Learn More</span>
          <span className="inline xs:hidden">More</span>
        </Button>
      </div>

      <AiAssistantDialog 
        open={isAssistantOpen} 
        onOpenChange={setIsAssistantOpen} 
      />
    </header>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Server, 
  AlertTriangle, 
  FileText, 
  GraduationCap, 
  CheckSquare,
  BarChart
} from "lucide-react";

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const companyName = "SGH ASIA";
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">{companyName}</span>
          </Link>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center gap-1 text-sm font-medium">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/inventory" className="flex items-center gap-1 text-sm font-medium">
              <Server className="h-4 w-4" />
              AI Systems
            </Link>
            <Link to="/risk-assessment" className="flex items-center gap-1 text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Risk Assessment
            </Link>
            <Link to="/documentation" className="flex items-center gap-1 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Documentation
            </Link>
            <Link to="/training" className="flex items-center gap-1 text-sm font-medium">
              <GraduationCap className="h-4 w-4" />
              Training
            </Link>
            <Link to="/reports" className="flex items-center gap-1 text-sm font-medium">
              <BarChart className="h-4 w-4" />
              Reports
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
