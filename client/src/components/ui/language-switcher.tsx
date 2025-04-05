import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LanguageSwitcher({ 
  variant = 'outline',
  size = 'sm'
}: LanguageSwitcherProps) {
  // Default values as fallback
  let language: Language = 'en';
  let setLanguage = (code: Language) => console.log('Language would change to:', code);
  let t = (key: string) => key;
  
  // Try to use the language context
  try {
    const languageContext = useLanguage();
    language = languageContext.language;
    setLanguage = languageContext.setLanguage;
    t = languageContext.t;
  } catch (error) {
    console.warn('Language context not available in LanguageSwitcher, using fallback');
  }
  
  const languages: {code: Language; name: string; flag: string}[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{size !== 'icon' ? t('app.language') : null}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="gap-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}