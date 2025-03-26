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
  Stack as StackIcon,
  Users,
} from "lucide-react";

// ... rest of the Navigation component ...

          <NavigationItem href="/enterprise-decision-platform" icon={<StackIcon />}>
            Decision Platform
          </NavigationItem>

          <NavigationItem href="/compliance-chatbot" icon={<Bot />}>
            Compliance Chatbot
          </NavigationItem>

          <NavigationItem href="/advanced-analytics" icon={<BarChart3 />}> {/* Added Advanced Analytics */}
            Advanced Analytics
          </NavigationItem>

          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem asChild>
              <Link href="/risk-assessment">Risk Assessment</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/risk-assessment/wizard">Interactive Risk Wizard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/risk-assessment/guides">Risk Assessment Guides</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/risk-assessment/text-analyzer">Free Text Risk Analyzer</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>


// ... rest of the Navigation component ...