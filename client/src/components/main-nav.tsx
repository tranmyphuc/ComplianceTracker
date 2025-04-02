import React from 'react';
import { Link } from 'wouter';
import {
  BarChart3,
  Bookmark,
  Boxes,
  Bot,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListChecks,
  MessageSquare,
  ScrollText,
  ServerIcon,
  Settings,
  ShieldAlert,
  Slack,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MainNav({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/enterprise-decision-platform">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Slack className="mr-2 h-4 w-4" />
                Decision Platform
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/compliance-chatbot">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Bot className="mr-2 h-4 w-4" />
                Compliance Chatbot
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/advanced-analytics">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Advanced Analytics
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={navigationMenuTriggerStyle()}>
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Risk Assessment
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem asChild>
                  <Link href="/risk-assessment">Risk Assessment</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/risk-assessment/wizard">Interactive Risk Wizard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/risk-assessment/text-analyzer">Free Text Risk Analyzer</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default MainNav;