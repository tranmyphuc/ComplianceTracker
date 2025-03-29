import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon, 
  ListIcon, 
  ListOrderedIcon, 
  AlignLeftIcon, 
  AlignCenterIcon, 
  AlignRightIcon, 
  LinkIcon, 
  ImageIcon, 
  Heading1Icon, 
  Heading2Icon, 
  SaveIcon, 
  EyeIcon, 
  SendIcon,
  SparklesIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  AlertTriangle,
  Clock,
  FileText,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define document content types
type DocumentSection = {
  id: string;
  name: string;
  completion: number;
  content?: string;
  articleRef?: string;
};

type Suggestion = {
  id: string;
  text: string;
  applied: boolean;
  articleRef?: string;
};

export function DocumentCreator() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("human-oversight");
  const [documentTitle, setDocumentTitle] = useState("");
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState<string[]>(["suggestions"]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>({});
  
  // Load user profile from localStorage on component mount
  useEffect(() => {
    try {
      const profile = localStorage.getItem("userOnboardingProfile");
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setUserProfile(parsedProfile);
        
        // Set document title based on company name
        if (parsedProfile.companyName) {
          setDocumentTitle(`Technical Documentation - ${parsedProfile.companyName} AI System`);
        } else {
          setDocumentTitle("Technical Documentation - AI System");
        }
        
        // Set content based on active section
        setContent(getContentForSection("human-oversight"));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
    
    setLoading(false);
  }, []);
  
  const toggleExpanded = (section: string) => {
    if (expanded.includes(section)) {
      setExpanded(expanded.filter(s => s !== section));
    } else {
      setExpanded([...expanded, section]);
    }
  };
  
  const insertSuggestion = (text: string) => {
    setContent(current => {
      if (current.trim() === "") {
        return text;
      }
      return current + "\n\n" + text;
    });
    
    toast({
      title: "Content Added",
      description: "The suggested content has been added to your document.",
      variant: "default"
    });
  };
  
  // Function to get content based on selected section
  const getContentForSection = (sectionId: string): string => {
    switch (sectionId) {
      case "system-overview":
        return "This document provides a comprehensive technical description of our AI system in accordance with EU AI Act requirements. It outlines the system's architecture, functionality, performance metrics, and compliance measures implemented to ensure safe and ethical operation.";
      
      case "purpose-scope":
        return "The purpose of this technical documentation is to demonstrate compliance with the EU AI Act requirements and to provide transparency about the AI system's design, development, and operational characteristics. This document covers all aspects of the system from data management to monitoring procedures.";
      
      case "system-design":
        return "Our AI system architecture consists of multiple integrated components, including data preprocessing modules, core algorithmic models, and output interpretation layers. The system utilizes a combination of supervised learning techniques and rule-based validation processes to ensure accurate and reliable performance.";
      
      case "human-oversight":
        return "In accordance with Article 14 of the EU AI Act, our AI system incorporates robust human oversight mechanisms to ensure that human judgment plays a decisive role in the decision-making process. These mechanisms are designed to prevent or minimize risks to fundamental rights and ensure that the system operates in a transparent, fair, and controllable manner.";
      
      case "data-governance":
        return "Our data governance framework ensures that all data used by the AI system is collected, processed, and stored in compliance with GDPR and EU AI Act requirements. This includes comprehensive data quality assurance, bias detection and mitigation, and regular data audits.";
      
      case "technical-robustness":
        return "The AI system has been designed with technical robustness and safety as core principles. This includes measures to ensure resilience to attacks, fallback plans for technical failures, and accuracy, reliability, and reproducibility of outcomes.";
      
      case "accuracy-metrics":
        return "Our AI system's performance is continuously monitored using a comprehensive set of metrics including accuracy, precision, recall, and fairness indicators. Tests are performed on diverse datasets to ensure reliable performance across different scenarios and user groups.";
      
      case "risk-assessment":
        return "A thorough risk assessment has been conducted in accordance with Article 9 of the EU AI Act. Potential risks to fundamental rights, safety, and non-discrimination have been identified and appropriate mitigation measures have been implemented.";
      
      default:
        return "";
    }
  };
  
  // Sections with real EU AI Act requirements
  const sections: DocumentSection[] = [
    { 
      id: "system-overview", 
      name: "1. System Overview", 
      completion: 100,
      articleRef: "Article 11" 
    },
    { 
      id: "purpose-scope", 
      name: "2. Purpose and Scope", 
      completion: 100,
      articleRef: "Article 11" 
    },
    { 
      id: "system-design", 
      name: "3. System Design", 
      completion: 75,
      articleRef: "Article 11(2)(a)" 
    },
    { 
      id: "human-oversight", 
      name: "3.2 Human Oversight Mechanisms", 
      completion: 60,
      articleRef: "Article 14" 
    },
    { 
      id: "data-governance", 
      name: "4. Data Governance", 
      completion: 10,
      articleRef: "Article 10" 
    },
    { 
      id: "technical-robustness", 
      name: "5. Technical Robustness", 
      completion: 0,
      articleRef: "Article 15" 
    },
    { 
      id: "accuracy-metrics", 
      name: "6. Accuracy Metrics", 
      completion: 0,
      articleRef: "Article 15(3)" 
    },
    { 
      id: "risk-assessment", 
      name: "7. Risk Assessment", 
      completion: 0,
      articleRef: "Article 9" 
    },
  ];
  
  // Real content suggestions based on EU AI Act
  const suggestions: Suggestion[] = [
    {
      id: "suggestion-1",
      text: "• Human-in-the-loop validation: All system outputs require explicit review and approval by designated human operators before any decisions are finalized. This includes a mandatory review process for all high-risk decisions identified by the system.",
      applied: false,
      articleRef: "Article 14(4)(a)"
    },
    {
      id: "suggestion-2",
      text: "• Real-time monitoring capability: The system includes interfaces that allow human operators to monitor operation in real-time, with clear visualization of the decision-making process and reasoning behind recommendations.",
      applied: false,
      articleRef: "Article 14(4)(b)"
    },
    {
      id: "suggestion-3",
      text: "• Intervention mechanisms: Human operators can intervene in the operation of the system at any point through clearly defined override controls that allow for immediate system stoppage or decision reversals.",
      applied: false,
      articleRef: "Article 14(4)(c)"
    },
    {
      id: "suggestion-4",
      text: "• Regular auditing and review: Quarterly audits are conducted to evaluate system outputs and human intervention patterns. This includes reviewing all cases where human operators overrode system recommendations to identify potential issues and improve system performance.",
      applied: false,
      articleRef: "Article 14(4)(d)"
    },
  ];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
      {/* Document Navigation (Hidden on Mobile) */}
      <Card className="border-neutral-200 shadow-sm hidden lg:block lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Document Sections</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="p-4 space-y-1">
              {sections.map(section => (
                <Button 
                  key={section.id}
                  variant={activeSection === section.id ? "secondary" : "ghost"} 
                  className="w-full justify-start h-auto py-2"
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">{section.name}</span>
                    <div className="flex items-center">
                      <div className="w-8 h-1.5 bg-neutral-200 rounded-full mr-2">
                        <div 
                          className={`h-full rounded-full ${
                            section.completion === 100 ? "bg-green-500" : "bg-primary"
                          }`}
                          style={{ width: `${section.completion}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-500">{section.completion}%</span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Main Editor */}
      <Card className="border-neutral-200 shadow-sm lg:col-span-5">
        <CardHeader className="pb-3">
          <Input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-lg font-semibold h-auto py-1 px-2"
          />
        </CardHeader>
        <Separator />
        
        {/* Editor Toolbar */}
        <div className="p-1 flex flex-wrap gap-1 border-b bg-neutral-50">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <BoldIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ItalicIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6 my-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heading1Icon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heading2Icon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6 my-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ListOrderedIcon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6 my-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignCenterIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignRightIcon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6 my-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <div className="flex-1"></div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => console.log("Ask for AI suggestions")}
          >
            <SparklesIcon className="h-4 w-4 mr-1.5" />
            AI Suggest
          </Button>
        </div>
        
        {/* Document Editor */}
        <CardContent className="pt-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-neutral-800">3.2 Human Oversight Mechanisms</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Describe all human oversight and control mechanisms incorporated into the system
            </p>
          </div>
          
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-md p-3 h-96 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </CardContent>
        
        {/* Document Actions */}
        <div className="px-4 py-3 border-t flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-neutral-500 flex items-center">
            <span>Last saved: 5 minutes ago</span>
            <Separator orientation="vertical" className="mx-2 h-3" />
            <span>Version: 0.3</span>
            <Separator orientation="vertical" className="mx-2 h-3" />
            <span>Author: Alexander Mitchell</span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <SaveIcon className="h-4 w-4 mr-1.5" />
              Save Draft
            </Button>
            <Button variant="outline" size="sm">
              <EyeIcon className="h-4 w-4 mr-1.5" />
              Preview
            </Button>
            <Button size="sm">
              <SendIcon className="h-4 w-4 mr-1.5" />
              Submit for Review
            </Button>
          </div>
        </div>
      </Card>
      
      {/* AI Assistant Panel */}
      <Card className="border-neutral-200 shadow-sm lg:col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">AI Suggestions</CardTitle>
          <CardDescription>
            Get intelligent content suggestions powered by AI
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="p-4 space-y-4">
              {/* Current Suggestions */}
              <div className="rounded-md border bg-neutral-50 overflow-hidden">
                <div 
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-neutral-100"
                  onClick={() => toggleExpanded("suggestions")}
                >
                  <div className="font-medium flex items-center">
                    <SparklesIcon className="h-4 w-4 text-primary mr-2" />
                    Based on Article 14 EU AI Act requirements, consider adding:
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {expanded.includes("suggestions") ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {expanded.includes("suggestions") && (
                  <div className="px-4 py-3 border-t space-y-4">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="space-y-2 pb-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-start gap-2">
                          <div className="bg-blue-50 p-1 rounded-full mt-0.5">
                            <Shield className="h-3.5 w-3.5 text-blue-500" />
                          </div>
                          <div>
                            <div className="text-sm">{suggestion.text}</div>
                            {suggestion.articleRef && (
                              <div className="text-xs text-blue-600 mt-1 font-medium">
                                Reference: {suggestion.articleRef}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-6">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => insertSuggestion(suggestion.text)}
                          >
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Insert
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                          >
                            Modify
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between gap-2">
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                        <SparklesIcon className="h-3.5 w-3.5" />
                        Regenerate
                      </Button>
                      <Button size="sm" className="w-full flex items-center gap-1">
                        <CheckIcon className="h-3.5 w-3.5" />
                        Insert All
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Previous Suggestions (Collapsed) */}
              <div className="rounded-md border overflow-hidden">
                <div 
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-neutral-100"
                  onClick={() => toggleExpanded("previous")}
                >
                  <div className="font-medium flex items-center">
                    <SparklesIcon className="h-4 w-4 text-neutral-400 mr-2" />
                    Previous suggestion: Risk assessment approaches
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {expanded.includes("previous") ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {expanded.includes("previous") && (
                  <div className="px-4 py-3 border-t">
                    <div className="text-sm text-neutral-600">
                      Previous suggestions for other sections will appear here...
                    </div>
                  </div>
                )}
              </div>
              
              {/* Compliance Tips */}
              <div className="rounded-md border overflow-hidden">
                <div 
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-neutral-100"
                  onClick={() => toggleExpanded("compliance")}
                >
                  <div className="font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                    EU AI Act Article 14 Requirements
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {expanded.includes("compliance") ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {expanded.includes("compliance") && (
                  <div className="px-4 py-3 border-t bg-amber-50">
                    <div className="text-sm text-amber-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <p className="font-medium">Latest Update: March 13, 2025</p>
                      </div>
                      
                      <p className="font-medium mb-2">Article 14 (Human Oversight) requires:</p>
                      <ul className="list-disc list-inside space-y-2 pl-1">
                        <li>Implementation of appropriate human oversight measures before, during, and after system deployment</li>
                        <li>Human oversight interfaces that enable monitoring of system operation and output</li>
                        <li>Ability for humans to intervene or override AI decisions in high-risk scenarios</li>
                        <li>Measures to prevent "automation bias" where humans automatically defer to AI recommendations</li>
                        <li>Training and competence verification for human overseers</li>
                        <li>Documentation of all human oversight activities and decisions</li>
                      </ul>
                      
                      <div className="mt-3 p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs font-medium text-amber-700">Related Articles:</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs py-0 bg-white text-amber-700 border-amber-200">
                            Article 9 (Risk Management)
                          </Badge>
                          <Badge variant="outline" className="text-xs py-0 bg-white text-amber-700 border-amber-200">
                            Article 13 (Transparency)
                          </Badge>
                          <Badge variant="outline" className="text-xs py-0 bg-white text-amber-700 border-amber-200">
                            Article 29 (Obligations of Users)
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Ask AI input */}
              <div className="pt-2">
                <div className="relative">
                  <Input 
                    placeholder="Ask AI for suggestions..." 
                    className="pr-10"
                  />
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                    <SparklesIcon className="h-4 w-4 text-primary" />
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Analyze Document
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Suggest Improvements
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}