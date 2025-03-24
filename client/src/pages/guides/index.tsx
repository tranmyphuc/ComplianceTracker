import { useState } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  BookOpen, 
  ChevronRight, 
  FileText, 
  LucideIcon, 
  Search,
  ShieldAlert,
  PenTool,
  CheckCircle2,
  GraduationCap,
  Layers,
  AlertCircle
} from "lucide-react";

// Guide categories
const CATEGORIES = [
  { id: "all", label: "All Guides" },
  { id: "getting-started", label: "Getting Started" },
  { id: "risk-assessment", label: "Risk Assessment" },
  { id: "documentation", label: "Documentation" },
  { id: "compliance", label: "Compliance" },
  { id: "training", label: "Training" }
];

// Guide data structure
type Guide = {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string; 
  icon: LucideIcon;
  isNew?: boolean;
  order: number;
};

// List of guides
const guides: Guide[] = [
  {
    id: "platform-overview",
    title: "Platform Overview",
    description: "Introduction to the EU AI Act Compliance Platform and its features",
    category: "getting-started",
    path: "/guides/platform-overview",
    icon: Layers,
    isNew: true,
    order: 1
  },
  {
    id: "risk-assessment-guide",
    title: "Risk Assessment",
    description: "How to assess AI systems for compliance with the EU AI Act",
    category: "risk-assessment",
    path: "/guides/risk-assessment-guide",
    icon: ShieldAlert,
    isNew: true,
    order: 2
  },
  {
    id: "registration-guide",
    title: "System Registration",
    description: "Guide to registering AI systems in the platform",
    category: "getting-started",
    path: "/guides/registration-guide",
    icon: PenTool,
    order: 3
  },
  {
    id: "documentation-guide",
    title: "Documentation Management",
    description: "How to create and manage compliance documentation",
    category: "documentation",
    path: "/guides/documentation-guide",
    icon: FileText,
    order: 4
  },
  {
    id: "approval-workflow",
    title: "Approval Workflow",
    description: "Guide to using the approval workflow for compliance activities",
    category: "compliance",
    path: "/guides/approval-workflow",
    icon: CheckCircle2,
    order: 5
  },
  {
    id: "training-guide",
    title: "Training Modules",
    description: "Using the training modules for EU AI Act education",
    category: "training",
    path: "/guides/training-guide",
    icon: GraduationCap,
    order: 6
  },
  {
    id: "common-questions",
    title: "Common Questions",
    description: "Frequently asked questions about EU AI Act compliance",
    category: "compliance",
    path: "/guides/common-questions",
    icon: AlertCircle,
    order: 7
  }
];

export default function GuidesIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter guides based on search query and active category
  const filteredGuides = guides
    .filter(guide => {
      const matchesSearch = 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = activeCategory === "all" || guide.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.order - b.order);

  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">EU AI Act Compliance Guides</h1>
        <p className="text-gray-500 mt-2">
          Visual guides to help you navigate EU AI Act compliance with the SGH ASIA platform
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-2/3">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveCategory}>
            <TabsList className="mb-6 flex flex-wrap h-auto">
              {CATEGORIES.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex-grow">
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                  {filteredGuides.length > 0 ? (
                    filteredGuides.map(guide => (
                      <Link key={guide.id} href={guide.path}>
                        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <guide.icon className="h-5 w-5 text-blue-500" />
                                <CardTitle className="text-lg">{guide.title}</CardTitle>
                                {guide.isNew && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                            <CardDescription className="mt-1">{guide.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No guides found matching your search criteria.</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>New to the EU AI Act Compliance Platform?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BookOpen className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Platform Introduction</h3>
                    <p className="text-sm text-gray-500">Learn about the platform and its features</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <ShieldAlert className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Risk Assessment</h3>
                    <p className="text-sm text-gray-500">Understand how to assess AI system risks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Documentation</h3>
                    <p className="text-sm text-gray-500">Learn about required documentation</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/guides/platform-overview">
                    Start with Platform Overview
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Get support for your compliance journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  If you need additional assistance with EU AI Act compliance, our team of experts is ready to help.
                </p>
                <p className="text-sm">
                  Open the AI Assistant button in the bottom right corner to ask questions directly.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full">Contact Support</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
  );
}