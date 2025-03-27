
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  return (
    <Tabs defaultValue={currentLanguage}>
      <TabsList>
        {languages.map(lang => (
          <TabsTrigger 
            key={lang.code}
            value={lang.code} 
            onClick={() => setLanguage(lang.code as any)}
            className={currentLanguage === lang.code ? 'bg-blue-50' : ''}
          >
            {lang.flag} {lang.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default LanguageSwitcher;
