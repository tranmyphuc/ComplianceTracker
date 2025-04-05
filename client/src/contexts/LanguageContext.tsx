import React, { createContext, useContext, useState, useEffect } from 'react';

// Define supported languages
export type Language = 'en' | 'de';
export const DEFAULT_LANGUAGE: Language = 'en';

// Define language information
export interface LanguageInfo {
  code: Language;
  name: string;
  flag: string;
}

// Available languages
export const availableLanguages: LanguageInfo[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

// Language context type definition
type LanguageContextType = {
  language: Language;
  currentLanguage: Language; // Alias for language (for backward compatibility)
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Simple translation function
  languages: LanguageInfo[]; // Available languages
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common UI elements
    'app.title': 'EU AI Act Compliance Platform',
    'app.loading': 'Loading...',
    'app.error': 'An error occurred',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    'app.delete': 'Delete',
    'app.edit': 'Edit',
    'app.search': 'Search',
    'app.language': 'Language',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.inventory': 'AI Systems Inventory',
    'nav.risk': 'Risk Assessment',
    'nav.knowledge': 'Knowledge Center',
    'nav.documentation': 'Documentation',
    'nav.training': 'Training',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to your AI Act Compliance Platform',
    'dashboard.summary': 'Compliance Summary',
    'dashboard.recent': 'Recent Activities',
    
    // AI Systems
    'systems.title': 'AI Systems Inventory',
    'systems.new': 'Register New System',
    'systems.details': 'System Details',
    'systems.risk': 'Risk Level',
    'systems.status': 'Compliance Status',
    
    // Risk Assessment
    'risk.title': 'Risk Assessment',
    'risk.start': 'Start Assessment',
    'risk.results': 'Assessment Results',
    'risk.high': 'High Risk',
    'risk.limited': 'Limited Risk',
    'risk.minimal': 'Minimal Risk',
    'risk.prohibited': 'Prohibited',
    
    // Documentation
    'docs.title': 'Compliance Documentation',
    'docs.generate': 'Generate Document',
    'docs.templates': 'Document Templates',
    'docs.custom': 'Custom Templates',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.language': 'Language Settings',
    
    // Chatbot
    'chatbot.title': 'AI Compliance Assistant',
    'chatbot.description': 'Ask questions about EU AI Act compliance',
    'chatbot.inputPlaceholder': 'Type your question...',
    'complianceChatbot.title': 'AI Compliance Assistant',
    'complianceChatbot.description': 'Get expert assistance with your EU AI Act compliance questions',
    'complianceChatbot.infoTitle': 'Interactive Assistance',
    'complianceChatbot.infoDescription': 'This AI assistant provides guidance on EU AI Act compliance topics. For official legal advice, please consult with a regulatory compliance expert.',
    'complianceChatbot.disclaimer': 'Disclaimer: This chatbot is designed to provide general guidance and information about EU AI Act compliance. The responses should not be considered legal advice.'
  },
  de: {
    // Common UI elements
    'app.title': 'EU-KI-Gesetz Compliance-Plattform',
    'app.loading': 'Wird geladen...',
    'app.error': 'Ein Fehler ist aufgetreten',
    'app.save': 'Speichern',
    'app.cancel': 'Abbrechen',
    'app.delete': 'Löschen',
    'app.edit': 'Bearbeiten',
    'app.search': 'Suchen',
    'app.language': 'Sprache',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.inventory': 'KI-Systeminventar',
    'nav.risk': 'Risikobewertung',
    'nav.knowledge': 'Wissenszentrum',
    'nav.documentation': 'Dokumentation',
    'nav.training': 'Schulung',
    'nav.settings': 'Einstellungen',
    
    // Dashboard
    'dashboard.welcome': 'Willkommen auf Ihrer KI-Gesetz Compliance-Plattform',
    'dashboard.summary': 'Compliance-Zusammenfassung',
    'dashboard.recent': 'Aktuelle Aktivitäten',
    
    // AI Systems
    'systems.title': 'KI-Systeminventar',
    'systems.new': 'Neues System registrieren',
    'systems.details': 'Systemdetails',
    'systems.risk': 'Risikoniveau',
    'systems.status': 'Compliance-Status',
    
    // Risk Assessment
    'risk.title': 'Risikobewertung',
    'risk.start': 'Bewertung starten',
    'risk.results': 'Bewertungsergebnisse',
    'risk.high': 'Hohes Risiko',
    'risk.limited': 'Begrenztes Risiko',
    'risk.minimal': 'Minimales Risiko',
    'risk.prohibited': 'Verboten',
    
    // Documentation
    'docs.title': 'Compliance-Dokumentation',
    'docs.generate': 'Dokument generieren',
    'docs.templates': 'Dokumentvorlagen',
    'docs.custom': 'Benutzerdefinierte Vorlagen',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.profile': 'Profil',
    'settings.appearance': 'Erscheinungsbild',
    'settings.notifications': 'Benachrichtigungen',
    'settings.language': 'Spracheinstellungen',
    
    // Chatbot
    'chatbot.title': 'KI-Compliance-Assistent',
    'chatbot.description': 'Stellen Sie Fragen zur EU-KI-Gesetz-Compliance',
    'chatbot.inputPlaceholder': 'Geben Sie Ihre Frage ein...',
    'complianceChatbot.title': 'KI-Compliance-Assistent',
    'complianceChatbot.description': 'Erhalten Sie Expertenunterstützung zu Ihren Fragen zur EU-KI-Gesetz-Compliance',
    'complianceChatbot.infoTitle': 'Interaktive Unterstützung',
    'complianceChatbot.infoDescription': 'Dieser KI-Assistent bietet Anleitungen zu Themen der EU-KI-Gesetz-Compliance. Für offizielle Rechtsberatung wenden Sie sich bitte an einen Compliance-Experten.',
    'complianceChatbot.disclaimer': 'Haftungsausschluss: Dieser Chatbot soll allgemeine Anleitungen und Informationen zur EU-KI-Gesetz-Compliance bieten. Die Antworten sollten nicht als Rechtsberatung betrachtet werden.'
  }
};

// LanguageProvider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with browser language or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    // Check for stored preference
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && (storedLang === 'en' || storedLang === 'de')) {
      return storedLang as Language;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'de' ? 'de' : 'en') as Language;
  });
  
  // Update language and store preference
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
  };
  
  // Simple translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  // Set html lang attribute on mount and language change
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  const value = {
    language,
    currentLanguage: language, // Alias for backwards compatibility
    setLanguage,
    t,
    languages: availableLanguages // Make languages available to components
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}