import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BellIcon, Bot, MenuIcon, SearchIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/firebase";
import { getAuth, signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState, useContext } from "react";
import { AiAssistantDialog } from "@/components/ai-assistant/assistant-dialog";
import { AuthContext } from "../../App";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { toast } = useToast();
  const auth = getAuth();
  // Get the authenticated user from AuthContext (supports both Firebase and development mode)
  const { user, logout } = useContext(AuthContext);
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

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      {/* Development Mode Banner */}
      <div className="bg-green-500 text-white text-center text-xs py-1 font-medium">
        DEVELOPMENT MODE - Automatically logged in as Admin
      </div>
      <div className="flex items-center justify-between px-4 py-2 lg:px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <MenuIcon className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center ml-2 lg:ml-0">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ml-2 text-lg font-semibold">ComplianceAI</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              type="text" 
              placeholder="Search for systems, documents, or regulations..." 
              className="pl-10 bg-neutral-100 border-neutral-200"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          
          <Button 
            variant="default" 
            className="hidden md:flex items-center"
            size="sm"
            onClick={() => setIsAssistantOpen(true)}
          >
            <Bot className="mr-1.5 h-4 w-4" />
            AI Assistant
          </Button>
          
          <div className="border-l border-neutral-200 h-8 mx-1 hidden md:block"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{user ? getInitials(user.displayName) : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.displayName || "User"}</span>
                  <span className="text-xs text-neutral-500">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <AiAssistantDialog 
        open={isAssistantOpen} 
        onOpenChange={setIsAssistantOpen} 
      />
    </header>
  );
}
