
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  languages?: Array<{code: string, name: string, flag: string}>;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
  languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ]
}) => {
  return (
    <TabsList>
      {languages.map(lang => (
        <TabsTrigger 
          key={lang.code}
          value={lang.code} 
          onClick={() => onLanguageChange(lang.code)} 
          className={currentLanguage === lang.code ? 'bg-blue-50' : ''}
        >
          {lang.flag} {lang.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default LanguageSwitcher;
