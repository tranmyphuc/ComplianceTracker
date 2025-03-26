
import React from 'react';
import { AiComplianceChatbot } from "@/components/ai-compliance-chatbot";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

const ComplianceChatbotPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">{t('complianceChatbot.title', 'AI Compliance Assistant')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('complianceChatbot.description', 'Get expert assistance with your EU AI Act compliance questions')}
          </p>
        </div>
        
        <Alert variant="default" className="bg-muted/50">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>{t('complianceChatbot.infoTitle', 'Interactive Assistance')}</AlertTitle>
          <AlertDescription>
            {t('complianceChatbot.infoDescription', 'This AI assistant provides guidance on EU AI Act compliance topics. For official legal advice, please consult with a regulatory compliance expert.')}
          </AlertDescription>
        </Alert>
        
        <AiComplianceChatbot />
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>{t('complianceChatbot.disclaimer', 'Disclaimer: This chatbot is designed to provide general guidance and information about EU AI Act compliance. The responses should not be considered legal advice.')}</p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceChatbotPage;
