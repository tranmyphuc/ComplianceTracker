
import React from 'react';
import { RegulationNotificationCenter } from '@/components/notification/regulation-notification-center';
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

export default function RegulatoryUpdatesPage() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t('regulatoryUpdates.title', 'Regulatory Updates & Notifications')}</h1>
        <LanguageSwitcher />
      </div>
      
      <div className="mb-6">
        <p className="text-muted-foreground">
          {t('regulatoryUpdates.description', 'Stay informed about EU AI Act changes, deadlines, and compliance requirements that affect your AI systems.')}
        </p>
      </div>
      
      <div className="grid gap-6">
        <RegulationNotificationCenter />
      </div>
    </div>
  );
}
