import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, SendIcon, FileText, Download, Upload, BookOpen, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  pending?: boolean;
}

interface ChatInterfaceProps {
  onGenerateTemplate?: (data: any) => void;
  mode?: 'registration' | 'risk-assessment' | 'documentation';
  initialContext?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onGenerateTemplate,
  mode = 'registration',
  initialContext = '',
}) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add initial system message based on selected mode
    const initialMessage = {
      id: '1',
      content: getWelcomeMessage(),
      sender: 'assistant' as const,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [mode]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const getWelcomeMessage = () => {
    switch (mode) {
      case 'registration':
        return t.chat.welcomeRegistration;
      case 'risk-assessment':
        return t.chat.welcomeRiskAssessment;
      case 'documentation':
        return t.chat.welcomeDocumentation;
      default:
        return t.chat.welcomeGeneral;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Add pending assistant message
    const pendingId = Date.now().toString() + '-pending';
    const pendingMessage: Message = {
      id: pendingId,
      content: '...',
      sender: 'assistant',
      timestamp: new Date(),
      pending: true,
    };
    
    setMessages(prev => [...prev, pendingMessage]);
    setIsProcessing(true);
    
    try {
      // Make API call to chatbot
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages.map(m => ({
            role: m.sender,
            content: m.content,
          })),
          mode,
          language,
          context: initialContext,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Remove pending message and add actual response
      setMessages(prev => prev.filter(m => m.id !== pendingId));
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If response contains structured data for template
      if (data.extractedData) {
        setGeneratedData(data.extractedData);
        setActiveTab('review');
      }
    } catch (error) {
      console.error('Error in chat:', error);
      // Remove pending and add error message
      setMessages(prev => 
        prev.filter(m => m.id !== pendingId).concat({
          id: Date.now().toString(),
          content: t.chat.errorMessage,
          sender: 'assistant',
          timestamp: new Date(),
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGenerateTemplate = () => {
    if (onGenerateTemplate && generatedData) {
      onGenerateTemplate(generatedData);
    }
  };
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{t.chat.title}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {mode === 'registration' && t.chat.modeRegistration}
            {mode === 'risk-assessment' && t.chat.modeRiskAssessment}
            {mode === 'documentation' && t.chat.modeDocumentation}
          </Badge>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4">
          <TabsTrigger value="chat">
            {t.chat.tabChat}
          </TabsTrigger>
          <TabsTrigger value="review" disabled={!generatedData}>
            {t.chat.tabReview}
          </TabsTrigger>
          <TabsTrigger value="help">
            {t.chat.tabHelp}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-0">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start max-w-[80%]">
                  {message.sender === 'assistant' && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/images/assistant-avatar.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`rounded-lg p-3 ${message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'}`}
                  >
                    {message.pending ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t.chat.thinking}</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src="/images/user-avatar.png" />
                      <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.inputPlaceholder}
              className="flex-1 min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-10 w-10"
              disabled={!input.trim() || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
              <span className="sr-only">{t.chat.send}</span>
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="review" className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
          {generatedData && (
            <>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-green-800">{t.chat.dataGenerated}</h3>
                  <p className="text-sm text-green-700 mt-1">{t.chat.reviewInstructions}</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">{t.chat.extractedData}</h3>
                <div className="space-y-3">
                  {Object.entries(generatedData).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 border-b pb-2">
                      <div className="font-medium capitalize col-span-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </div>
                      <div className="col-span-2">
                        {typeof value === 'string' ? value : JSON.stringify(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('chat')}
                >
                  {t.chat.backToChat}
                </Button>
                <Button 
                  onClick={handleGenerateTemplate}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {t.chat.applyData}
                </Button>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="help" className="flex-1 overflow-y-auto p-4 pt-0">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-700 mb-2">{t.chat.helpTitle}</h3>
              <p className="text-sm text-blue-600">{t.chat.helpDescription}</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">{t.chat.exampleQuestions}</h4>
              <ul className="space-y-2 list-disc pl-5">
                {mode === 'registration' && (
                  <>
                    <li className="text-sm">{t.chat.exampleRegistration1}</li>
                    <li className="text-sm">{t.chat.exampleRegistration2}</li>
                    <li className="text-sm">{t.chat.exampleRegistration3}</li>
                  </>
                )}
                {mode === 'risk-assessment' && (
                  <>
                    <li className="text-sm">{t.chat.exampleRisk1}</li>
                    <li className="text-sm">{t.chat.exampleRisk2}</li>
                    <li className="text-sm">{t.chat.exampleRisk3}</li>
                  </>
                )}
                {mode === 'documentation' && (
                  <>
                    <li className="text-sm">{t.chat.exampleDoc1}</li>
                    <li className="text-sm">{t.chat.exampleDoc2}</li>
                    <li className="text-sm">{t.chat.exampleDoc3}</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-1">{t.chat.supportedLanguages}</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">English</Badge>
                <Badge variant="outline">German (Deutsch)</Badge>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};