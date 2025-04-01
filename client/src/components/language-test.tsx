import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageTest: React.FC = () => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  
  // Debug the translations object
  useEffect(() => {
    console.log("Current language:", currentLanguage);
    console.log("Translation for nav.home:", t('nav.home'));
    console.log("Translation for pricing.title:", t('pricing.title'));
    console.log("Available translations:", Object.keys(languages).join(", "));
  }, [currentLanguage, t]);

  return (
    <div className="p-4 border rounded mb-4 bg-white">
      <h2 className="text-xl font-bold mb-2">Language Switcher Test</h2>
      <p className="mb-4">Current language: <strong>{currentLanguage}</strong></p>
      <div className="flex space-x-2 mb-4">
        {languages.map(lang => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? "default" : "outline"}
            onClick={() => {
              console.log(`Setting language to ${lang.code}`);
              setLanguage(lang.code as any);
            }}
          >
            {lang.flag} {lang.name}
          </Button>
        ))}
      </div>
      <div className="mt-4 p-3 border rounded">
        <h3 className="font-medium mb-1">Translation test:</h3>
        <p>nav.home = {t('nav.home')}</p>
        <p>nav.inventory = {t('nav.inventory')}</p>
        <p>pricing.title = {t('pricing.title')}</p>
        <p>pricing.subtitle = {t('pricing.subtitle')}</p>
        <p>pricing.calculator.title = {t('pricing.calculator.title')}</p>
      </div>
    </div>
  );
};

export default LanguageTest;