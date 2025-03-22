import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ChevronDownIcon
} from "lucide-react";

export function DocumentCreator() {
  const [activeSection, setActiveSection] = useState("human-oversight");
  const [documentTitle, setDocumentTitle] = useState("Technical Documentation - HR Candidate Evaluation Tool v3");
  const [content, setContent] = useState(`The HR Candidate Evaluation Tool incorporates several human oversight mechanisms to ensure that the AI system operates in a transparent, fair, and controllable manner. These mechanisms are designed to prevent or minimize risks to fundamental rights and ensure that human judgment plays a decisive role in the employment decision-making process.`);
  const [expanded, setExpanded] = useState<string[]>(["suggestions"]);
  
  const toggleExpanded = (section: string) => {
    if (expanded.includes(section)) {
      setExpanded(expanded.filter(s => s !== section));
    } else {
      setExpanded([...expanded, section]);
    }
  };
  
  const insertSuggestion = (text: string) => {
    setContent(content + "\n\n" + text);
  };
  
  const sections = [
    { id: "system-overview", name: "1. System Overview", completion: 100 },
    { id: "purpose-scope", name: "2. Purpose and Scope", completion: 100 },
    { id: "system-design", name: "3. System Design", completion: 75 },
    { id: "human-oversight", name: "3.2 Human Oversight Mechanisms", completion: 60 },
    { id: "data-governance", name: "4. Data Governance", completion: 10 },
    { id: "technical-robustness", name: "5. Technical Robustness", completion: 0 },
    { id: "accuracy-metrics", name: "6. Accuracy Metrics", completion: 0 },
    { id: "risk-assessment", name: "7. Risk Assessment", completion: 0 },
  ];
  
  const suggestions = [
    {
      id: "suggestion-1",
      text: "• Pre-deployment review - HR managers review and approve the ranking criteria before the system is used for any hiring process.",
      applied: false
    },
    {
      id: "suggestion-2",
      text: "• Human-in-the-loop validation - All system recommendations require explicit review and approval from HR staff before being considered in employment decisions.",
      applied: false
    },
    {
      id: "suggestion-3",
      text: "• Override capability - Recruiters can override or adjust system recommendations with appropriate justification, which is logged in the system.",
      applied: false
    },
    {
      id: "suggestion-4",
      text: "• Regular auditing - Quarterly audits are conducted to evaluate system outputs and human intervention patterns to identify potential issues.",
      applied: false
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
                    Based on your system description, consider adding these human oversight mechanisms:
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
                  <div className="px-4 py-3 border-t space-y-3">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="space-y-2">
                        <div className="text-sm">{suggestion.text}</div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => insertSuggestion(suggestion.text)}
                          >
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
                      <Button variant="outline" size="sm" className="w-full">
                        Regenerate
                      </Button>
                      <Button size="sm" className="w-full">
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
                    <CheckIcon className="h-4 w-4 text-neutral-400 mr-2" />
                    EU AI Act Compliance Tips
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
                  <div className="px-4 py-3 border-t">
                    <div className="text-sm text-neutral-600">
                      <p className="font-medium mb-1">Article 14 requires:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Clear description of human oversight measures</li>
                        <li>Mechanisms to prevent automation bias</li>
                        <li>Human ability to override the system</li>
                        <li>Audit trail of human decisions</li>
                      </ul>
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