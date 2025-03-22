
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  SparklesIcon, 
  SendIcon, 
  HistoryIcon, 
  InfoIcon, 
  BookmarkIcon, 
  TrashIcon,
  ArrowRightIcon,
  ClipboardCheckIcon,
  UploadIcon,
  FileTextIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AiAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiAssistantDialog({ open, onOpenChange }: AiAssistantDialogProps) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(1);
  const [_, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showGuide]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    try {
      // Add user message to chat
      const newMessages = [
        ...messages,
        { role: "user", content: query }
      ];
      setMessages(newMessages);
      setLoading(true);

      // Call backend API
      const response = await fetch("/api/chatbot/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.response }
      ]);
      setQuery("");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegistration = () => {
    onOpenChange(false);
    navigate("/register-system");
  };

  const navigateToRiskAssessment = () => {
    onOpenChange(false);
    navigate("/risk-assessment");
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed from your chat history",
    });
  };

  const renderGuideContent = () => {
    switch (guideStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Understanding AI System Registration</h3>
            <p>Our platform helps you comply with the EU AI Act through a systematic approach:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start">
                  <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Identify Your AI Systems</h4>
                    <p className="text-sm text-neutral-600">Catalog all AI systems in use or development within your organization</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-amber-500">
                <div className="flex items-start">
                  <AlertCircleIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Assess Risk Levels</h4>
                    <p className="text-sm text-neutral-600">Determine if your systems fall into high, limited, or minimal risk categories</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-start">
                  <FileTextIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Document Compliance</h4>
                    <p className="text-sm text-neutral-600">Create and maintain required documentation based on risk level</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-purple-500">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Monitor & Update</h4>
                    <p className="text-sm text-neutral-600">Continuously assess and update your compliance status</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={() => setGuideStep(2)} className="gap-2">
                Next Step <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Registering Your AI System</h3>
            
            <div className="relative border rounded-lg p-4 bg-white shadow-sm">
              <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 1</div>
              <div className="mt-2 flex items-start">
                <UploadIcon className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Navigate to System Registration</h4>
                  <p className="text-sm text-neutral-600 mt-1">Click "Register New System" from the dashboard or use the side navigation menu.</p>
                </div>
              </div>
            </div>
            
            <div className="relative border rounded-lg p-4 bg-white shadow-sm">
              <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 2</div>
              <div className="mt-2 flex items-start">
                <FileTextIcon className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Enter Basic System Information</h4>
                  <p className="text-sm text-neutral-600 mt-1">Provide a name, description, department, and purpose for your AI system.</p>
                  <div className="bg-neutral-50 p-2 rounded mt-2 text-sm">
                    <strong>Pro tip:</strong> Be detailed in your system description to get the most accurate classification from our AI analysis.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative border rounded-lg p-4 bg-white shadow-sm">
              <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 3</div>
              <div className="mt-2 flex items-start">
                <SparklesIcon className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Use SGH ASIA AI Analysis</h4>
                  <p className="text-sm text-neutral-600 mt-1">Click "Run AI Analysis" to let our DeepSeek-powered AI determine the appropriate classification and compliance requirements.</p>
                  <div className="bg-amber-50 p-2 rounded mt-2 text-sm border-l-2 border-amber-400">
                    <strong>Important:</strong> The AI analysis uses DeepSeek AI for consistent and accurate risk classifications.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setGuideStep(1)}>
                Previous
              </Button>
              <Button onClick={() => setGuideStep(3)} className="gap-2">
                Next Step <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Completing Registration & Next Steps</h3>
            
            <div className="relative border rounded-lg p-4 bg-white shadow-sm">
              <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 4</div>
              <div className="mt-2 flex items-start">
                <ClipboardCheckIcon className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Complete Technical Details</h4>
                  <p className="text-sm text-neutral-600 mt-1">Fill in AI capabilities, training datasets, output types, and other technical information.</p>
                </div>
              </div>
            </div>
            
            <div className="relative border rounded-lg p-4 bg-white shadow-sm">
              <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 5</div>
              <div className="mt-2 flex items-start">
                <AlertCircleIcon className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Review Risk Assessment</h4>
                  <p className="text-sm text-neutral-600 mt-1">Verify the AI-determined risk level and make adjustments if necessary based on your knowledge.</p>
                </div>
              </div>
            </div>
            
            <div className="relative border rounded-lg p-4 bg-white shadow-sm">
              <div className="absolute -top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">Step 6</div>
              <div className="mt-2 flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-medium">Submit Registration</h4>
                  <p className="text-sm text-neutral-600 mt-1">Once all required information is provided, submit your system registration.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6">
              <h4 className="font-medium flex items-center text-green-800">
                <CheckCircleIcon className="h-5 w-5 mr-2" /> What Happens Next?
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-green-800">
                <li className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-800 mr-2 mt-0.5">1</div>
                  <span>Your system will appear in the AI inventory dashboard</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-800 mr-2 mt-0.5">2</div>
                  <span>Required documentation will be added to your compliance tasks</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-800 mr-2 mt-0.5">3</div>
                  <span>Compliance monitoring will begin for your system</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setGuideStep(2)}>
                Previous
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setShowGuide(false)}>
                  Close Guide
                </Button>
                <Button onClick={navigateToRegistration} className="gap-2">
                  Start Registration <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
            EU AI Act Compliance Assistant
          </DialogTitle>
          <DialogDescription>
            Get expert guidance on EU AI Act compliance requirements and implementation
          </DialogDescription>
        </DialogHeader>
        
        {showGuide ? (
          <ScrollArea ref={scrollRef} className="flex-1 px-6 pb-4">
            {renderGuideContent()}
          </ScrollArea>
        ) : (
          <>
            <div className="flex px-6 space-x-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={() => setShowGuide(true)}
              >
                <InfoIcon className="h-3.5 w-3.5" />
                Registration Guide
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={navigateToRegistration}
              >
                <UploadIcon className="h-3.5 w-3.5" />
                Register System
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={navigateToRiskAssessment}
              >
                <AlertCircleIcon className="h-3.5 w-3.5" />
                Risk Assessment
              </Button>
            </div>
            
            <ScrollArea ref={scrollRef} className="flex-1 px-6 pb-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <SparklesIcon className="h-12 w-12 text-primary/20 mb-4" />
                  <h3 className="text-xl font-medium mb-2">EU AI Act Compliance Assistant</h3>
                  <p className="text-neutral-500 max-w-md mb-6">
                    Ask me anything about EU AI Act compliance, risk assessment, or system registration requirements.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
                    <Button 
                      variant="outline" 
                      className="justify-start text-left h-auto py-3" 
                      onClick={() => setQuery("What are high-risk AI systems?")}
                    >
                      What are high-risk AI systems?
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start text-left h-auto py-3" 
                      onClick={() => setQuery("What documentation is required?")}
                    >
                      What documentation is required?
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start text-left h-auto py-3" 
                      onClick={() => setQuery("Explain human oversight requirements")}
                    >
                      Explain human oversight requirements
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start text-left h-auto py-3" 
                      onClick={() => setQuery("What are the penalties for non-compliance?")}
                    >
                      What are the penalties for non-compliance?
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-neutral-100"
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-4 py-2 max-w-[80%] bg-neutral-100">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0"
                  onClick={clearChat}
                  disabled={messages.length === 0}
                  title="Clear chat"
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about EU AI Act compliance..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-10"
                  />
                  {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0"
                  disabled={!query.trim() || loading}
                >
                  <SendIcon className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
