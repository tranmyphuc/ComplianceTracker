import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageTest: React.FC = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();

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
        <p>nav.home = {useLanguage().t('nav.home')}</p>
        <p>nav.inventory = {useLanguage().t('nav.inventory')}</p>
        <p>pricing.title = {useLanguage().t('pricing.title')}</p>
      </div>
    </div>
  );
};

export default LanguageTest;