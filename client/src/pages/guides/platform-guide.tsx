import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { 
  Activity, 
  BarChart3, 
  BookOpen, 
  Briefcase, 
  FileCog, 
  FileText, 
  Gauge, 
  Settings, 
  Shield, 
  TrendingUp 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PlatformGuide() {
  // Menu items that match the screenshot
  const menuItems = [
    { icon: <Gauge className="h-5 w-5" />, label: "EU AI ACT COMPLIANCE", badge: "92%", highlight: true },
    { icon: <Activity className="h-5 w-5" />, label: "AI Systems" },
    { icon: <Shield className="h-5 w-5" />, label: "Risk Assessment" },
    { icon: <FileText className="h-5 w-5" />, label: "Documentation", highlight: true },
    { icon: <BookOpen className="h-5 w-5" />, label: "Training" },
    { icon: <FileCog className="h-5 w-5" />, label: "Training Docs" },
    { icon: <Briefcase className="h-5 w-5" />, label: "Tasks" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Reports" },
    { icon: <Settings className="h-5 w-5" />, label: "Register AI System" },
    { icon: <BookOpen className="h-5 w-5" />, label: "Knowledge Center" },
  ];
  
  // Second menu items
  const secondMenuItems = [
    { icon: <Shield className="h-5 w-5" />, label: "Risk Management" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Growth & Innovation" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings" },
    { icon: <Gauge className="h-5 w-5" />, label: "EU AI ACT COMPLIANCE", badge: "92%" },
    { icon: <Activity className="h-5 w-5" />, label: "AI Systems" },
    { icon: <Shield className="h-5 w-5" />, label: "Risk Assessment" },
    { icon: <FileText className="h-5 w-5" />, label: "Documentation", highlight: true },
    { icon: <BookOpen className="h-5 w-5" />, label: "Training" },
    { icon: <FileCog className="h-5 w-5" />, label: "Training Docs" },
  ];
  
  // Chapter links that appear on the right side
  const chapterLinks = [
    { number: 2, title: "Purpose and Scope" },
    { number: 3, title: "System Design" },
    { number: 3.2, title: "Human Oversight Mechanism", highlight: true },
    { number: 4, title: "Data Governance" },
    { number: 5, title: "Technical Robustness" },
    { number: 6, title: "Accuracy Metrics" },
    { number: 7, title: "Risk Assessment" },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/guides">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Guides
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">EU AI Act Compliance Platform Guide</h1>
        <p className="text-muted-foreground">
          A visual tour of the SGH ASIA EU AI Act Compliance Platform with Jack
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Left Menu Column */}
        <div className="bg-background rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Dashboard Overview</h3>
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer ${item.highlight ? 'bg-blue-50' : ''}`}
              >
                <span className="text-gray-500">{item.icon}</span>
                <span className={`flex-1 text-sm ${item.highlight ? 'text-blue-600 font-medium' : ''}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {item.badge}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Middle Column - Replica of Menu + Dashboard */}
        <div className="bg-background rounded-lg border p-4 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              {secondMenuItems.slice(0, 3).map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer ${item.highlight ? 'bg-blue-50' : ''}`}
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span className={`flex-1 text-sm ${item.highlight ? 'text-blue-600 font-medium' : ''}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <div>
              {/* Placeholder for any content on right side */}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            {secondMenuItems.slice(3).map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer ${item.highlight ? 'bg-blue-50' : ''}`}
              >
                <span className="text-gray-500">{item.icon}</span>
                <span className={`flex-1 text-sm ${item.highlight ? 'text-blue-600 font-medium' : ''}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {item.badge}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Column - Chapter Links */}
        <div className="bg-background rounded-lg border p-4">
          <div className="space-y-4">
            {chapterLinks.map((chapter, index) => (
              <div 
                key={index} 
                className={`p-2 ${chapter.highlight ? 'bg-blue-500 text-white rounded-md' : ''}`}
              >
                <div className={`text-sm font-medium ${chapter.highlight ? 'text-white' : ''}`}>
                  {chapter.number}. {chapter.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Jack's Message */}
      <div className="bg-gray-800 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 bg-white">
            <img 
              src="/assets/1000048340-modified.png" 
              alt="Jack from SGH ASIA" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Jack from SGH ASIA</p>
            <p className="text-white text-sm mt-1">
              The dashboard is your home base - from here you can see your compliance status at a glance and access all key features.
            </p>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="mb-8 p-4 bg-white rounded-lg border">
        <p className="text-muted-foreground">
          The dashboard provides a quick overview of your AI systems, compliance status, and upcoming deadlines.
        </p>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/guides">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          1 of 9
        </div>
        <Button variant="outline">
          Next
          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  );
}