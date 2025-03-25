import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface for translations context
interface TranslationsContextType {
  translations: Record<string, Record<string, string>>;
  currentLocale: string;
  loading: boolean;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// Create context
const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

// Default translations for fallback
const defaultTranslations: Record<string, Record<string, string>> = {
  en: {
    'app.welcome': 'Welcome to EU AI Act Compliance Platform',
    'common.loading': 'Loading...',
  }
};

interface TranslationsProviderProps {
  children: ReactNode;
}

export const TranslationsProvider = ({ children }: TranslationsProviderProps) => {
  const [translations, setTranslations] = useState(defaultTranslations);
  const [currentLocale, setCurrentLocale] = useState('en');
  const [loading, setLoading] = useState(false);

  // Load translations if needed
  useEffect(() => {
    // This would typically load translations from an API or local files
    // For now, we're just using the built-in translations
    setLoading(false);
  }, [currentLocale]);

  // Function to change locale
  const setLocale = (locale: string) => {
    setCurrentLocale(locale);
    localStorage.setItem('locale', locale);
  };

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[currentLocale]?.[key] || translations.en[key] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value);
      });
    }
    
    return translation;
  };

  return (
    <TranslationsContext.Provider value={{ translations, currentLocale, loading, setLocale, t }}>
      {children}
    </TranslationsContext.Provider>
  );
};

// Hook to use the translations context
export const useTranslationsContext = (): TranslationsContextType => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslationsContext must be used within a TranslationsProvider');
  }
  return context;
};