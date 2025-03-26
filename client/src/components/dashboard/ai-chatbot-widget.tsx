
import React, { useState } from 'react';
import { Bot, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from 'wouter';

export function AiChatbotWidget() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{t('dashboard.chatbot.title', 'AI Assistant')}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '-' : '+'}
          </Button>
        </div>
        <CardDescription>
          {t('dashboard.chatbot.description', 'Get quick compliance answers')}
        </CardDescription>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex gap-2 items-start">
                <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">{t('dashboard.chatbot.greeting', 'How can I help with your EU AI Act compliance today?')}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('dashboard.chatbot.quickQuestions', 'Quick questions:')}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                  {t('dashboard.chatbot.q1', 'Compliance deadlines?')}
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                  {t('dashboard.chatbot.q2', 'Risk assessment tips')}
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                  {t('dashboard.chatbot.q3', 'Required documentation')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className={expanded ? "pt-0" : ""}>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/compliance-chatbot">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('dashboard.chatbot.openFull', 'Open full assistant')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
