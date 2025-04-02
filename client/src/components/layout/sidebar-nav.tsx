import { Landmark, BookText, PanelLeft, PanelLeftClose, ChevronRight, Home, ShieldAlert, BookOpen, Database, ClipboardList, FileText, Book, Layers, AlertTriangle, Activity, LineChart, Briefcase, ArrowUpRight, Settings, HelpCircle, Users, FileStack, Boxes, Brain, History, BookMarked, BarChart4, Presentation } from 'lucide-react';

const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Demo Scenarios',
      href: '/demo-scenarios',
      icon: <Presentation className="h-5 w-5" />,
    },
    {
      title: 'Risk Assessment',
      href: '/risk-assessment',
      icon: <ShieldAlert className="h-5 w-5" />,
      submenu: [
        {
          title: 'Assessment',
          href: '/risk-assessment',
          icon: <Book className="h-5 w-5" />,
        },
        {
          title: 'Text Analyzer',
          href: '/risk-assessment/text-analyzer',
          icon: <FileText className="h-5 w-5" />,
        },
      ]
    },
    { 
      title: "Knowledge Center", 
      icon: <BookOpen />,
      href: "/knowledge-center",
      submenu: [
        { title: "AI Act Articles", href: "/knowledge-center" },
        { title: "ISO 42001", href: "/knowledge-center/iso42001" },
        { title: "Compliance Guides", href: "/knowledge-center" },
        { title: "Regulatory Updates", href: "/knowledge-center" },
      ]
    },
];

// ... rest of the file (assuming it uses mainNavItems) ...