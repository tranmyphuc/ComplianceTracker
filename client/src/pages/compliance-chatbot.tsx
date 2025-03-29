import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  Info, 
  User, 
  BookOpen, 
  FileText, 
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Brain,
  Briefcase,
  HeartHandshake,
  Shield,
  UserCircle,
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { AIJack } from '@/components/ai-mascot/ai-jack';
import { motion, AnimatePresence } from "framer-motion";

// Coaching persona types
type PersonaType = 'mentor' | 'expert' | 'cheerleader' | 'strategist' | 'jack';

// Interface for messages in the chat
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  persona?: PersonaType;
}

// Compliance Coach persona definitions
const PERSONAS: Record<PersonaType, {
  name: string;
  icon: React.ElementType;
  description: string;
  style: string;
  messageStyle: string;
  emoji: string;
}> = {
  mentor: {
    name: 'Mentor Coach',
    icon: UserCircle,
    description: 'Supportive guide who helps you learn at your own pace',
    style: 'bg-blue-50 text-blue-800 border-blue-200',
    messageStyle: 'bg-blue-50 border-blue-200',
    emoji: '🧠'
  },
  expert: {
    name: 'Expert Advisor',
    icon: Briefcase,
    description: 'Technical specialist with deep regulatory knowledge',
    style: 'bg-purple-50 text-purple-800 border-purple-200',
    messageStyle: 'bg-purple-50 border-purple-200',
    emoji: '👨‍⚖️'
  },
  cheerleader: {
    name: 'Supportive Ally',
    icon: HeartHandshake,
    description: 'Enthusiastic supporter who focuses on your successes',
    style: 'bg-green-50 text-green-800 border-green-200',
    messageStyle: 'bg-green-50 border-green-200',
    emoji: '🙌'
  },
  strategist: {
    name: 'Strategic Planner',
    icon: Shield,
    description: 'Goal-oriented advisor focused on efficient compliance',
    style: 'bg-amber-50 text-amber-800 border-amber-200',
    messageStyle: 'bg-amber-50 border-amber-200',
    emoji: '📊'
  },
  jack: {
    name: 'AI Jack',
    icon: Brain,
    description: 'Friendly AI mascot with EU AI Act expertise',
    style: 'bg-rose-50 text-rose-800 border-rose-200',
    messageStyle: 'bg-rose-50 border-rose-200',
    emoji: '🤖'
  }
};

// Common EU AI Act compliance topics for suggested questions
const SUGGESTED_TOPICS = [
  { 
    id: 'risk-levels', 
    title: 'Risk Levels', 
    questions: [
      'How do I determine if my AI system is high-risk?',
      'What are the requirements for limited risk AI systems?',
      'What makes an AI system unacceptable under the EU AI Act?'
    ] 
  },
  { 
    id: 'documentation', 
    title: 'Documentation', 
    questions: [
      'What technical documentation is required for high-risk systems?',
      'How detailed should my data governance documentation be?',
      'What should be included in a Declaration of Conformity?'
    ] 
  },
  { 
    id: 'implementation', 
    title: 'Implementation', 
    questions: [
      'How can I create an effective AI governance framework?',
      'What are the best practices for human oversight of AI systems?',
      'How should I implement a risk management system for AI?'
    ] 
  },
  { 
    id: 'timeline', 
    title: 'Timeline', 
    questions: [
      'What is the implementation timeline for the EU AI Act?',
      'When will high-risk system requirements become mandatory?',
      'How long do I have to prepare for compliance?'
    ] 
  }
];

export default function ComplianceChatbotPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<PersonaType>('jack');
  const [chatTab, setChatTab] = useState('chat'); // 'chat' or 'guide'
  const [jackMood, setJackMood] = useState<'neutral' | 'happy' | 'thinking' | 'excited'>('neutral');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Add welcome message based on selected persona
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessages: Record<PersonaType, string> = {
        mentor: "Hello! I'm your EU AI Act Compliance Mentor. I'll guide you through your compliance journey at your own pace. What would you like to learn today?",
        expert: "Greetings. I'm your EU AI Act Technical Expert. I can provide detailed regulatory insights and specific article references. How may I assist you?",
        cheerleader: "Hi there! 👋 I'm your Compliance Ally, and I'm here to support your EU AI Act compliance journey! Together, we can tackle any regulatory challenge. What are you working on?",
        strategist: "Welcome. I'm your Strategic Compliance Advisor. Let's develop an efficient, goal-oriented plan for your EU AI Act compliance. What's your current compliance status?",
        jack: "Hey there! I'm AI Jack, your friendly EU AI Act guide. I'm here to make compliance simple and even fun! What can I help you with today?"
      };

      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessages[activePersona],
          timestamp: new Date(),
          persona: activePersona
        }
      ]);

      // Set Jack's mood based on persona
      if (activePersona === 'jack') {
        setJackMood('happy');
      }
    }
  }, [activePersona]);

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    // Create a new user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    
    // Update messages state with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery('');
    setLoading(true);
    
    try {
      // If Jack is the active persona, show thinking animation
      if (activePersona === 'jack') {
        setJackMood('thinking');
      }
      
      // Call API to get response from AI
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          query: userMessage.content,
          persona: activePersona
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get a response');
      }
      
      const data = await response.json();
      
      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        persona: activePersona
      };
      
      // Update messages with assistant response
      setMessages([...updatedMessages, assistantMessage]);
      
      // If Jack is the active persona, show happy/excited mood
      if (activePersona === 'jack') {
        setJackMood(Math.random() > 0.5 ? 'happy' : 'excited');
      }
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI assistant',
        variant: 'destructive'
      });
      
      // Reset Jack's mood if error occurs
      if (activePersona === 'jack') {
        setJackMood('neutral');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    setQuery(question);
    handleSubmit();
  };
  
  // Handle persona change
  const handlePersonaChange = (persona: PersonaType) => {
    setActivePersona(persona);
    // Clear messages when changing persona
    setMessages([]);
  };
  
  // Clear chat history
  const handleClearChat = () => {
    setMessages([]);
    toast({
      title: 'Chat cleared',
      description: 'All messages have been removed from your chat history',
    });
  };
  
  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      <PageHeader
        title="AI Compliance Coach"
        description="Get personalized EU AI Act guidance with different coaching styles"
        icon={<Bot className="h-10 w-10 text-primary" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left sidebar - Personas */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-primary" />
                Coaching Personas
              </CardTitle>
              <CardDescription>
                Choose your preferred coaching style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(PERSONAS).map(([id, persona]) => (
                <Button
                  key={id}
                  variant={activePersona === id ? "default" : "outline"}
                  className={`w-full justify-start gap-3 h-auto py-3 px-4 ${
                    activePersona === id ? "" : "hover:bg-accent"
                  }`}
                  onClick={() => handlePersonaChange(id as PersonaType)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activePersona === id ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <persona.icon className={`h-5 w-5 ${
                      activePersona === id ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{persona.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {persona.description}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
          
          {/* Popular topics */}
          <Card className="shadow-sm border mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Popular Topics
              </CardTitle>
              <CardDescription>
                Frequently asked questions about the EU AI Act
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={SUGGESTED_TOPICS[0].id}>
                <TabsList className="grid grid-cols-4">
                  {SUGGESTED_TOPICS.map(topic => (
                    <TabsTrigger key={topic.id} value={topic.id} className="text-xs">
                      {topic.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {SUGGESTED_TOPICS.map(topic => (
                  <TabsContent key={topic.id} value={topic.id} className="pt-4">
                    <div className="space-y-2">
                      {topic.questions.map((question, idx) => (
                        <Button 
                          key={idx} 
                          variant="ghost" 
                          className="w-full justify-start text-left h-auto py-2 text-sm"
                          onClick={() => handleSuggestedQuestion(question)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                          {question}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Main chat area */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border flex flex-col h-[calc(100vh-240px)]">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {activePersona === 'jack' ? (
                    <div className="h-9 w-9 relative">
                      <AIJack size="sm" mood="neutral" animate={false} />
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center h-9 w-9 rounded-full ${PERSONAS[activePersona].style}`}>
                      {React.createElement(PERSONAS[activePersona].icon, { className: "h-5 w-5" })}
                    </div>
                  )}
                  <div className="ml-2">
                    <CardTitle className="text-lg">{PERSONAS[activePersona].name}</CardTitle>
                    <CardDescription className="text-xs">
                      {PERSONAS[activePersona].description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={handleClearChat}
                    title="Clear chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`flex max-w-[85%] ${
                        message.role === 'user' 
                          ? 'items-end' 
                          : 'items-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="mr-2 flex-shrink-0">
                          {message.persona === 'jack' ? (
                            <div className="h-9 w-9 relative">
                              <AIJack size="sm" mood="neutral" animate={false} />
                            </div>
                          ) : (
                            <div className={`flex items-center justify-center h-9 w-9 rounded-full ${message.persona ? PERSONAS[message.persona].style : 'bg-primary text-primary-foreground'}`}>
                              {message.persona ? 
                                React.createElement(PERSONAS[message.persona].icon, { className: "h-5 w-5" })
                               : 
                                <Bot className="h-5 w-5" />
                              }
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : message.persona
                              ? PERSONAS[message.persona].messageStyle
                              : 'bg-muted'
                        } shadow-sm`}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                          {message.role === 'assistant' && message.persona && (
                            <span className="font-semibold text-xs mb-1 block">
                              {PERSONAS[message.persona].emoji} {PERSONAS[message.persona].name}
                            </span>
                          )}
                          {message.content}
                        </div>
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="ml-2 flex-shrink-0">
                          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground">
                            <User className="h-5 w-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-start">
                      <div className="mr-2 flex-shrink-0">
                        {activePersona === 'jack' ? (
                          <div className="h-9 w-9 relative">
                            <AIJack size="sm" mood="thinking" animate={true} />
                          </div>
                        ) : (
                          <div className={`flex items-center justify-center h-9 w-9 rounded-full ${PERSONAS[activePersona].style}`}>
                            {React.createElement(PERSONAS[activePersona].icon, { className: "h-5 w-5" })}
                          </div>
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${PERSONAS[activePersona].messageStyle} shadow-sm`}>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <CardFooter className="p-4 border-t mt-auto">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything about EU AI Act compliance..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !query.trim()}>
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Jack animation for the Jack persona */}
      {activePersona === 'jack' && (
        <div className="fixed bottom-4 right-4 z-10 lg:hidden">
          <div className="relative">
            <AIJack mood={jackMood} animate={true} size="lg" />
          </div>
        </div>
      )}
    </div>
  );
}