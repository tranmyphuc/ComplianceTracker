
import React from 'react';
import { DocumentTemplateGenerator } from '@/components/document/template-generator';
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

export default function DocumentTemplatesPage() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t('documentTemplates.title', 'Document Template Generator')}</h1>
        <LanguageSwitcher />
      </div>
      
      <div className="mb-6">
        <p className="text-muted-foreground">
          {t('documentTemplates.description', 'Automatically generate EU AI Act compliant document templates based on your AI system\'s risk level and specific needs.')}
        </p>
      </div>
      
      <div className="grid gap-6">
        <DocumentTemplateGenerator />
      </div>
    </div>
  );
}
