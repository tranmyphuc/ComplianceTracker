import { useState } from "react";
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
import { SparklesIcon, SendIcon, HistoryIcon, InfoIcon, BookmarkIcon } from "lucide-react";

interface AiAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AiAssistantDialog({ open, onOpenChange }: AiAssistantDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Assistant for EU AI Act compliance. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 h-[80vh] flex flex-col">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-primary" />
            EU AI Act Compliance Assistant
          </DialogTitle>
          <DialogDescription>
            Get expert guidance on EU AI Act compliance requirements and implementation
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Message Area */}
          <div className="flex-1 flex flex-col overflow-hidden border-t">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-neutral-100 text-neutral-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-neutral-100 text-neutral-900">
                      <div className="flex space-x-2 items-center">
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about EU AI Act compliance..."
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button type="submit" disabled={isProcessing || !inputValue.trim()}>
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0 border-l hidden md:block">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium">Suggestions</h3>
            </div>
            <ScrollArea className="h-[calc(100%-57px)]">
              <div className="p-2 space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-auto py-2"
                  onClick={() => {
                    setInputValue("What are the requirements for high-risk AI systems?");
                  }}
                >
                  <InfoIcon className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-left">High-risk system requirements</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-auto py-2"
                  onClick={() => {
                    setInputValue("How do I document human oversight mechanisms?");
                  }}
                >
                  <InfoIcon className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-left">Human oversight documentation</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-auto py-2"
                  onClick={() => {
                    setInputValue("What exemptions apply to research AI systems?");
                  }}
                >
                  <InfoIcon className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-left">Research exemptions</span>
                </Button>
                
                <Separator className="my-2" />
                
                <h4 className="text-xs font-medium text-neutral-500 px-3 py-1">Recent Questions</h4>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-auto py-2"
                  onClick={() => {
                    setInputValue("How long is the compliance transition period?");
                  }}
                >
                  <HistoryIcon className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-left">Transition period length</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-auto py-2"
                  onClick={() => {
                    setInputValue("What are the penalties for non-compliance?");
                  }}
                >
                  <HistoryIcon className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-left">Non-compliance penalties</span>
                </Button>
                
                <Separator className="my-2" />
                
                <h4 className="text-xs font-medium text-neutral-500 px-3 py-1">Saved</h4>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-auto py-2"
                >
                  <BookmarkIcon className="h-3 w-3 mr-2 text-neutral-500" />
                  <span className="text-left">Risk assessment guidance</span>
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getAIResponse(question: string): string {
  // In a real app, this would be an API call to your AI service
  const responses = {
    "requirements": "High-risk AI systems must comply with several requirements including risk assessment and mitigation systems, data governance measures, technical documentation, record-keeping, transparency, human oversight, accuracy, robustness and cybersecurity. These requirements aim to ensure these systems are safe, transparent, and accountable.",
    "documentation": "Human oversight documentation should include: 1) A clear description of oversight mechanisms, 2) Details on how humans can monitor, intervene or disable the system, 3) Training requirements for human overseers, and 4) Measures to prevent automation bias. It should demonstrate that human judgment plays a decisive role in system operation.",
    "exemptions": "Research AI systems developed exclusively for scientific research and development are generally exempt from many requirements of the EU AI Act, provided they're not placed on the market or put into service. However, good practices like risk assessment are still encouraged even for research systems.",
    "period": "The EU AI Act has a phased implementation timeline: 6 months after publication for prohibitions on unacceptable risk AI, 12 months for the AI Office establishment, 24 months for codes of practice, and full application of all provisions after 36 months.",
    "penalties": "The EU AI Act includes severe penalties for non-compliance, with fines up to €35 million or 7% of global annual turnover, whichever is higher, for the most serious violations. Lesser violations may result in fines up to €15 million or 3% of global annual turnover."
  };
  
  if (question.toLowerCase().includes("requirements") && question.toLowerCase().includes("high-risk")) {
    return responses.requirements;
  } else if (question.toLowerCase().includes("document") && question.toLowerCase().includes("human oversight")) {
    return responses.documentation;
  } else if (question.toLowerCase().includes("exemptions") && question.toLowerCase().includes("research")) {
    return responses.exemptions;
  } else if (question.toLowerCase().includes("transition period") || question.toLowerCase().includes("compliance") && question.toLowerCase().includes("period")) {
    return responses.period;
  } else if (question.toLowerCase().includes("penalties") || question.toLowerCase().includes("non-compliance")) {
    return responses.penalties;
  }
  
  return "I don't have specific information about that topic yet. For detailed guidance on EU AI Act compliance, I recommend consulting the official EU AI Act documentation or speaking with a compliance expert.";
}