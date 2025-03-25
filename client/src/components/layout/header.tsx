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
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
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
  GlobeIcon
} from "lucide-react";
import { getCurrentUser } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState, useContext } from "react";
import { AiAssistantDialog } from "@/components/ai-assistant/assistant-dialog";
import { useAuth } from "@/components/auth/auth-context";
import { Badge } from "@/components/ui/badge";
import { LanguageCode } from "@/contexts/LanguageContext";

// Safe language access without the hook - we'll use an alternative approach
// that doesn't throw errors when the context is unavailable
const defaultLanguage = { 
  currentLanguage: 'en' as LanguageCode, 
  setLanguage: () => {}, 
  languages: [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
  ]
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { toast } = useToast();
  const auth = getAuth();
  // Get the authenticated user from useAuth hook
  const { user, logout } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  // Use default language values to avoid the context error
  // This is a temporary solution until we properly integrate with the language context
  const { currentLanguage, setLanguage, languages } = defaultLanguage;

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

          {/* Center: Empty space */}
          <div className="hidden lg:flex-1"></div>

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

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                  <GlobeIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={currentLanguage} onValueChange={(value) => setLanguage(value as LanguageCode)}>
                  {languages.map((lang) => (
                    <DropdownMenuRadioItem key={lang.code} value={lang.code} className="cursor-pointer">
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

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