import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, PaperclipIcon, SendIcon } from "lucide-react";
import { useState } from "react";

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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Compliance Assistant. How can I help you with EU AI Act compliance today?",
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 h-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            AI Compliance Assistant
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[85%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0 h-9 w-9">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Ask anything about EU AI Act compliance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="icon" className="flex-shrink-0 h-9 w-9" onClick={handleSend}>
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Mock AI responses for demo purposes
function getAIResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes("high-risk") || lowerQuestion.includes("high risk")) {
    return `<b>About High-Risk AI Classification</b><br/><br/>Under the EU AI Act, high-risk AI systems include those used in:<br/><br/>• Critical infrastructure (e.g., transport)<br/>• Educational or vocational training<br/>• Employment, worker management, and access to self-employment<br/>• Access to essential private and public services<br/>• Law enforcement<br/>• Migration, asylum, and border control management<br/>• Administration of justice and democratic processes<br/><br/>High-risk systems require compliance with strict requirements around data quality, documentation, human oversight, and risk management.`;
  }
  
  if (lowerQuestion.includes("deadline") || lowerQuestion.includes("timeline")) {
    return "The EU AI Act implementation timeline is staggered:<br/><br/>• August 2025: Initial compliance deadline for high-risk AI systems<br/>• February 2026: Extended compliance for providers with limited risk systems<br/>• August 2026: Full enforcement across all categories<br/><br/>I recommend starting compliance preparations now, especially for high-risk systems.";
  }
  
  if (lowerQuestion.includes("document") || lowerQuestion.includes("documentation")) {
    return "Required documentation for high-risk AI systems includes:<br/><br/>1. Technical documentation<br/>2. Risk assessment report<br/>3. Human oversight measures<br/>4. Post-market monitoring plan<br/>5. Instructions for use<br/><br/>Would you like me to help you prepare any of these documents for a specific system?";
  }
  
  return "I'd be happy to help with your EU AI Act compliance questions. Could you provide more specific details about what you'd like to know? I can assist with risk classification, documentation requirements, compliance timelines, and implementation strategies.";
}
