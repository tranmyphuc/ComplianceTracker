import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  PaperPlaneIcon,
  InfoCircledIcon,
  ReloadIcon,
  Cross2Icon
} from '@radix-ui/react-icons';
import { 
  MessagesSquare, 
  Brain, 
  CircleHelp, 
  Info, 
  AlertTriangle, 
  Lightbulb,
  Languages,
  BookOpen
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AssistantAction {
  type: string;
  data: any;
}

interface AssistantProps {
  systemId?: string;
  assessmentId?: string;
  context?: 'wizard' | 'results' | 'controls' | 'general';
  defaultHelp?: string;
  className?: string;
  onSuggestAction?: (action: AssistantAction) => void;
  onClose?: () => void;
}

const RiskAssessmentAssistant: React.FC<AssistantProps> = ({
  systemId,
  assessmentId,
  context = 'general',
  defaultHelp,
  className = '',
  onSuggestAction,
  onClose
}) => {
  const { currentLanguage: language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add default assistant message when component mounts
  useEffect(() => {
    if (defaultHelp) {
      setMessages([
        {
          role: 'assistant',
          content: defaultHelp,
          timestamp: new Date()
        }
      ]);
    } else {
      // Default initial message based on context
      let initialMessage = '';
      
      if (language === 'de') {
        // German language messages
        switch (context) {
          case 'wizard':
            initialMessage = 'Hallo! Ich bin Ihr EU AI Act Compliance-Assistent. Ich kann Ihnen helfen, die Risikobewertung für Ihr AI-System durchzuführen. Fragen Sie mich etwas über Risikostufen, Compliance-Anforderungen oder wie Sie bestimmte Felder ausfüllen sollten.';
            break;
          case 'results':
            initialMessage = 'Ich kann Ihnen helfen, die Ergebnisse Ihrer Risikobewertung zu verstehen. Fragen Sie mich nach Erklärungen zu Risikoscores, Compliance-Lücken oder nächsten Schritten.';
            break;
          case 'controls':
            initialMessage = 'Benötigen Sie Hilfe bei der Auswahl geeigneter Risikokontrollmaßnahmen? Ich kann Ihnen Empfehlungen geben und Fragen zu spezifischen Kontrollen beantworten.';
            break;
          default:
            initialMessage = 'Hallo! Ich bin Ihr EU AI Act Compliance-Assistent. Wie kann ich Ihnen heute helfen?';
        }
      } else {
        // English language (default)
        switch (context) {
          case 'wizard':
            initialMessage = 'Hello! I\'m your EU AI Act Compliance Assistant. I can help you complete the risk assessment for your AI system. Ask me about risk levels, compliance requirements, or how to fill in specific fields.';
            break;
          case 'results':
            initialMessage = 'I can help you understand the results of your risk assessment. Ask me for explanations about risk scores, compliance gaps, or next steps.';
            break;
          case 'controls':
            initialMessage = 'Need help selecting appropriate risk control measures? I can provide recommendations and answer questions about specific controls.';
            break;
          default:
            initialMessage = 'Hello! I\'m your EU AI Act Compliance Assistant. How can I help you today?';
        }
      }
      
      setMessages([
        {
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [defaultHelp, context, language]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare the request payload
      const payload = {
        query: input,
        context: {
          systemId,
          assessmentId,
          context,
          language,
          previousMessages: messages.map(m => ({ role: m.role, content: m.content }))
        }
      };
      
      // Send the request to the backend
      const response = await axios.post('/api/assistant/risk-assessment', payload);
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If there's an action suggestion, pass it to the handler
      if (response.data.action && onSuggestAction) {
        onSuggestAction(response.data.action);
      }
      
    } catch (error) {
      console.error('Error querying assistant:', error);
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: language === 'de'
          ? 'Beim Abrufen einer Antwort ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
          : 'An error occurred while fetching a response. Please try again later.',
        variant: 'destructive',
      });
      
      // Add error message from assistant
      const errorMessage: Message = {
        role: 'assistant',
        content: language === 'de'
          ? 'Es tut mir leid, ich konnte keine Antwort erhalten. Bitte versuchen Sie es später erneut.'
          : 'I\'m sorry, I couldn\'t get a response. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearConversation = () => {
    // Keep only the initial message
    setMessages(messages.slice(0, 1));
  };

  const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper components for message display
  const MessageBubble = ({ message }: { message: Message }) => {
    const isAssistant = message.role === 'assistant';
    
    return (
      <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-2`}>
        <div
          className={`px-4 py-2 rounded-lg max-w-[85%] ${
            isAssistant
              ? 'bg-muted text-foreground mr-auto'
              : 'bg-primary text-primary-foreground ml-auto'
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          <div className={`text-xs mt-1 ${isAssistant ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
            {getFormattedTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  const QuickSuggestion = ({ text, onClick }: { text: string; onClick: () => void }) => (
    <Button
      variant="outline"
      size="sm"
      className="mr-2 mb-2 text-xs h-auto py-1"
      onClick={onClick}
    >
      {text}
    </Button>
  );

  const renderQuickSuggestions = () => {
    // Return different suggestions based on context
    if (language === 'de') {
      // German suggestions
      switch (context) {
        case 'wizard':
          return (
            <>
              <QuickSuggestion 
                text="Was sind Hochrisiko-KI-Systeme?" 
                onClick={() => {
                  setInput('Was sind Hochrisiko-KI-Systeme?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Welche Dokumente benötige ich?" 
                onClick={() => {
                  setInput('Welche Dokumente benötige ich für die Compliance mit dem EU AI Act?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Erklären Sie die Risikostufen" 
                onClick={() => {
                  setInput('Erklären Sie die verschiedenen Risikostufen im EU AI Act.');
                  handleSubmit();
                }}
              />
            </>
          );
        case 'results':
          return (
            <>
              <QuickSuggestion 
                text="Wie verbessere ich meinen Score?" 
                onClick={() => {
                  setInput('Wie kann ich meinen Compliance-Score verbessern?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Erklären Sie die Compliance-Lücken" 
                onClick={() => {
                  setInput('Können Sie die identifizierten Compliance-Lücken erklären?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Nächste Schritte?" 
                onClick={() => {
                  setInput('Was sind die nächsten Schritte für mein System?');
                  handleSubmit();
                }}
              />
            </>
          );
        case 'controls':
          return (
            <>
              <QuickSuggestion 
                text="Empfohlene Kontrollen?" 
                onClick={() => {
                  setInput('Welche Risikokontrollen empfehlen Sie für mein System?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Menschliche Aufsicht" 
                onClick={() => {
                  setInput('Wie implementiere ich angemessene menschliche Aufsicht?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Technische Robustheit" 
                onClick={() => {
                  setInput('Wie kann ich die technische Robustheit meines KI-Systems verbessern?');
                  handleSubmit();
                }}
              />
            </>
          );
        default:
          return (
            <>
              <QuickSuggestion 
                text="Was ist der EU AI Act?" 
                onClick={() => {
                  setInput('Was ist der EU AI Act?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Compliance-Fristen" 
                onClick={() => {
                  setInput('Was sind die wichtigsten Compliance-Fristen?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Verbotene KI-Anwendungen" 
                onClick={() => {
                  setInput('Welche KI-Anwendungen sind verboten?');
                  handleSubmit();
                }}
              />
            </>
          );
      }
    } else {
      // English suggestions
      switch (context) {
        case 'wizard':
          return (
            <>
              <QuickSuggestion 
                text="What are high-risk AI systems?" 
                onClick={() => {
                  setInput('What are high-risk AI systems?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="What documents do I need?" 
                onClick={() => {
                  setInput('What documents do I need for EU AI Act compliance?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Explain risk levels" 
                onClick={() => {
                  setInput('Explain the different risk levels in the EU AI Act.');
                  handleSubmit();
                }}
              />
            </>
          );
        case 'results':
          return (
            <>
              <QuickSuggestion 
                text="How to improve my score?" 
                onClick={() => {
                  setInput('How can I improve my compliance score?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Explain compliance gaps" 
                onClick={() => {
                  setInput('Can you explain the compliance gaps identified?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Next steps?" 
                onClick={() => {
                  setInput('What are the next steps for my system?');
                  handleSubmit();
                }}
              />
            </>
          );
        case 'controls':
          return (
            <>
              <QuickSuggestion 
                text="Recommended controls?" 
                onClick={() => {
                  setInput('What risk controls do you recommend for my system?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Human oversight" 
                onClick={() => {
                  setInput('How do I implement adequate human oversight?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Technical robustness" 
                onClick={() => {
                  setInput('How can I improve the technical robustness of my AI system?');
                  handleSubmit();
                }}
              />
            </>
          );
        default:
          return (
            <>
              <QuickSuggestion 
                text="What is the EU AI Act?" 
                onClick={() => {
                  setInput('What is the EU AI Act?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Compliance deadlines" 
                onClick={() => {
                  setInput('What are the key compliance deadlines?');
                  handleSubmit();
                }}
              />
              <QuickSuggestion 
                text="Prohibited AI applications" 
                onClick={() => {
                  setInput('What AI applications are prohibited?');
                  handleSubmit();
                }}
              />
            </>
          );
      }
    }
  };

  // Render help content based on context
  const renderHelpContent = () => {
    if (language === 'de') {
      // German help content
      switch (context) {
        case 'wizard':
          return (
            <div className="space-y-2">
              <h3 className="font-medium">So nutzen Sie den Assistenten im Risikobewertungs-Assistenten:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Stellen Sie Fragen zu spezifischen EU AI Act-Anforderungen</li>
                <li>Bitten Sie um Hilfe beim Ausfüllen bestimmter Felder im Formular</li>
                <li>Fragen Sie nach Beispielen für Best Practices</li>
                <li>Bitten Sie um Erklärungen zu Risikokategorien und Bewertungskriterien</li>
              </ul>
            </div>
          );
        case 'results':
          return (
            <div className="space-y-2">
              <h3 className="font-medium">So nutzen Sie den Assistenten für Risikobewertungsergebnisse:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Bitten Sie um Erklärungen zu Ihrem Risikoscore und dessen Berechnung</li>
                <li>Fragen Sie nach Details zu identifizierten Compliance-Lücken</li>
                <li>Erhalten Sie Vorschläge zur Verbesserung Ihrer Compliance</li>
                <li>Verstehen Sie die relevanten EU AI Act-Artikel für Ihr System</li>
              </ul>
            </div>
          );
        case 'controls':
          return (
            <div className="space-y-2">
              <h3 className="font-medium">So nutzen Sie den Assistenten für Risikokontrollmaßnahmen:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Erhalten Sie Empfehlungen für spezifische Kontrollen für Ihr System</li>
                <li>Fragen Sie nach Umsetzungsleitlinien für bestimmte Kontrollen</li>
                <li>Verstehen Sie die Zusammenhänge zwischen Kontrollen und Compliance-Anforderungen</li>
                <li>Bitten Sie um Prioritätslisten für Kontrollen basierend auf Ihrem Risikoprofil</li>
              </ul>
            </div>
          );
        default:
          return (
            <div className="space-y-2">
              <h3 className="font-medium">So nutzen Sie den EU AI Act Compliance-Assistenten:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Stellen Sie Fragen zu allen Aspekten des EU AI Act</li>
                <li>Erhalten Sie Erklärungen zu Compliance-Anforderungen</li>
                <li>Fragen Sie nach Definitionen und Beispielen</li>
                <li>Bitten Sie um Hilfe bei der Navigation durch den Compliance-Prozess</li>
              </ul>
            </div>
          );
      }
    } else {
      // English help content (default)
      switch (context) {
        case 'wizard':
          return (
            <div className="space-y-2">
              <h3 className="font-medium">How to use the assistant in risk assessment wizard:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Ask questions about specific EU AI Act requirements</li>
                <li>Request help filling in particular fields in the form</li>
                <li>Ask for examples of best practices</li>
                <li>Request explanations of risk categories and assessment criteria</li>
              </ul>
            </div>
          );
        case 'results':
          return (
            <div className="space-y-2">
              <h3 className="font-medium">How to use the assistant for risk assessment results:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Ask for explanations about your risk score and how it was calculated</li>
                <li>Inquire about details on identified compliance gaps</li>
                <li>Get suggestions for improving your compliance</li>
                <li>Understand the relevant EU AI Act articles for your system</li>
              </ul>
            </div>
          );
        case 'controls':
          return (
            <div className="space-y-2">
              <h3 className="font-medium">How to use the assistant for risk controls:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Get recommendations for specific controls for your system</li>
                <li>Ask for implementation guidance for particular controls</li>
                <li>Understand the connections between controls and compliance requirements</li>
                <li>Request prioritized lists of controls based on your risk profile</li>
              </ul>
            </div>
          );
        default:
          return (
            <div className="space-y-2">
              <h3 className="font-medium">How to use the EU AI Act Compliance Assistant:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Ask questions about any aspect of the EU AI Act</li>
                <li>Get explanations about compliance requirements</li>
                <li>Ask for definitions and examples</li>
                <li>Request help navigating the compliance process</li>
              </ul>
            </div>
          );
      }
    }
  };

  // Minimized version (just the button)
  if (!isExpanded) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsExpanded(true)}
                className="h-12 w-12 rounded-full shadow-lg"
              >
                <MessagesSquare className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {language === 'de' ? 'Compliance-Assistent öffnen' : 'Open Compliance Assistant'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Full expanded assistant
  return (
    <Card 
      className={`fixed bottom-4 right-4 w-80 sm:w-96 max-h-[70vh] shadow-lg z-50 flex flex-col ${className}`}
    >
      <CardHeader className="p-3 flex-row items-center justify-between space-y-0 border-b">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium">
            {language === 'de' ? 'EU AI Act-Assistent' : 'EU AI Act Assistant'}
          </CardTitle>
          <Badge variant="outline" className="text-xs h-6">
            {language === 'de' ? 'Beta' : 'Beta'}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setShowHelp(!showHelp)}
          >
            <CircleHelp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setIsExpanded(false)}
          >
            <Cross2Icon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {showHelp && (
        <div className="p-3 bg-muted/50 border-b">
          {renderHelpContent()}
        </div>
      )}
      
      <CardContent className="p-0 overflow-y-auto flex-grow">
        <div className="p-3 space-y-3">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <div className="p-2 border-t">
        <div className="flex flex-wrap mb-2">
          {renderQuickSuggestions()}
        </div>
      </div>
      
      <CardFooter className="p-3 pt-0">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            placeholder={language === 'de' ? 'Frage eingeben...' : 'Type your question...'}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? (
              <ReloadIcon className="h-4 w-4 animate-spin" />
            ) : (
              <PaperPlaneIcon className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default RiskAssessmentAssistant;