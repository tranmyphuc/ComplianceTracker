import { 
  HomeIcon, 
  BoxesIcon, 
  ShieldAlertIcon, 
  ClipboardListIcon, 
  BookIcon, 
  ServerIcon,
  ScrollTextIcon,
  GraduationCapIcon,
  ActivityIcon,
  BuildingIcon,
  LineChartIcon,
  PieChartIcon,
  SettingsIcon,
  KeyIcon,
  LogInIcon,
  UserCircleIcon,
  BookMarkedIcon,
  InfoIcon,
  HelpCircleIcon,
  BrainCircuitIcon,
  BadgeCheckIcon,
  LayoutDashboardIcon
} from 'lucide-react';

// ... rest of the code (assuming this is part of a larger component) ...

{/* Settings navigation */}
  <NavigationSection title="Settings">
    <NavigationLink 
      to="/settings" 
      icon={<SettingsIcon className="h-4 w-4" />}
      activeRoutes={["/settings"]}
      endMatch={true}
    >
      General Settings
    </NavigationLink>
    <NavigationLink 
      to="/settings/api-keys" 
      icon={<KeyIcon className="h-4 w-4" />}
      activeRoutes={["/settings/api-keys"]}
    >
      API Keys
    </NavigationLink>
    <NavigationLink 
      to="/admin/dashboard" 
      icon={<LayoutDashboardIcon className="h-4 w-4" />}
      activeRoutes={["/admin/dashboard"]}
    >
      Admin Dashboard
    </NavigationLink>
  </NavigationSection>

// ... rest of the code ...