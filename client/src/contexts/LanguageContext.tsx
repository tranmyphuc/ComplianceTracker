
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the available languages
export type LanguageCode = 'en' | 'de' | 'vi';

// Add Vietnamese to meet the requirement in your message
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
];

// Interface for the language context
interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  languages: typeof languages;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create translations object
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Common UI elements
    'app.title': 'EU AI Act Compliance Platform',
    'nav.home': 'Home',
    'nav.inventory': 'AI Inventory',
    'nav.risk-assessment': 'Risk Assessment',
    'nav.compliance': 'Compliance',
    'nav.reports': 'Reports',
    'nav.training': 'Training',

    // Risk Assessment Guides
    'riskAssessment.guides.title': 'Risk Assessment Guides',
    'riskAssessment.guides.description': 'Detailed guides and documentation to help you understand and implement EU AI Act risk assessments',
    'riskAssessment.classification.title': 'Risk Classification Guide',
    'riskAssessment.classification.description': 'Understanding the EU AI Act risk classification framework',
    'riskAssessment.classification.content': 'This guide explains how to classify AI systems according to the risk categories defined in the EU AI Act: Unacceptable, High, Limited, and Minimal Risk.',
    'riskAssessment.methodology.title': 'Assessment Methodology',
    'riskAssessment.methodology.description': 'Step-by-step process for conducting risk assessments',
    'riskAssessment.methodology.content': 'Learn about the methodology for conducting a comprehensive risk assessment of AI systems, including risk identification, analysis, evaluation, and mitigation.',
    'riskAssessment.documentation.title': 'Documentation Requirements',
    'riskAssessment.documentation.description': 'Required documentation for EU AI Act compliance',
    'riskAssessment.documentation.content': 'This guide outlines the documentation requirements for AI systems, including technical documentation, risk assessments, and compliance records.',
    'riskAssessment.highRisk.title': 'High-Risk System Requirements',
    'riskAssessment.highRisk.description': 'Compliance requirements for high-risk AI systems',
    'riskAssessment.highRisk.content': 'Detailed explanation of the specific requirements that apply to high-risk AI systems under the EU AI Act, including risk management, data governance, and human oversight.',
    'riskAssessment.prohibited.title': 'Prohibited Use Cases',
    'riskAssessment.prohibited.description': 'Understanding prohibited AI applications',
    'riskAssessment.prohibited.content': 'This guide explains the AI applications that are explicitly prohibited under Article 5 of the EU AI Act, including social scoring systems and certain biometric systems.',
    'riskAssessment.faq.title': 'FAQ: Risk Assessment',
    'riskAssessment.faq.description': 'Frequently asked questions about risk assessment',
    'riskAssessment.faq.content': 'Answers to commonly asked questions about risk assessment under the EU AI Act, including timelines, responsibilities, and best practices.',
    
    // Buttons
    'button.view': 'View Guide',
    'button.viewFaq': 'View FAQ',
    'button.viewDocs': 'View Full Documentation',
    
    // Additional Resources
    'resources.title': 'Additional Resources',
    'resources.description': 'External guidance and information about the EU AI Act',
    'resources.official.title': 'EU AI Act Official Text',
    'resources.official.description': 'The official legal text of the EU AI Act from the European Commission.',
    'resources.commission.title': 'EU Commission Guidance',
    'resources.commission.description': 'Official guidance documents from the European Commission on implementing the Act.',
    'resources.best.title': 'Industry Best Practices',
    'resources.best.description': 'Industry standards and best practices for AI risk assessment and management.',
    'resources.standards.title': 'Risk Management Standards',
    'resources.standards.description': 'International standards for risk management in AI systems.'
  },
  de: {
    // Common UI elements
    'app.title': 'EU-KI-Gesetz Compliance-Plattform',
    'nav.home': 'Startseite',
    'nav.inventory': 'KI-Inventar',
    'nav.risk-assessment': 'Risikobewertung',
    'nav.compliance': 'Compliance',
    'nav.reports': 'Berichte',
    'nav.training': 'Schulung',
    
    // Risk Assessment Guides
    'riskAssessment.guides.title': 'Leitfäden zur Risikobewertung',
    'riskAssessment.guides.description': 'Detaillierte Leitfäden und Dokumentation, die Ihnen helfen, Risikobewertungen gemäß dem EU-KI-Gesetz zu verstehen und umzusetzen',
    'riskAssessment.classification.title': 'Leitfaden zur Risikoklassifizierung',
    'riskAssessment.classification.description': 'Verständnis des Risikoklassifizierungsrahmens des EU-KI-Gesetzes',
    'riskAssessment.classification.content': 'Dieser Leitfaden erklärt, wie KI-Systeme gemäß den im EU-KI-Gesetz definierten Risikokategorien klassifiziert werden: Inakzeptables, Hohes, Begrenztes und Minimales Risiko.',
    'riskAssessment.methodology.title': 'Bewertungsmethodik',
    'riskAssessment.methodology.description': 'Schrittweiser Prozess zur Durchführung von Risikobewertungen',
    'riskAssessment.methodology.content': 'Erfahren Sie mehr über die Methodik zur Durchführung einer umfassenden Risikobewertung von KI-Systemen, einschließlich Risikoidentifikation, -analyse, -bewertung und -minderung.',
    'riskAssessment.documentation.title': 'Dokumentationsanforderungen',
    'riskAssessment.documentation.description': 'Erforderliche Dokumentation für die Einhaltung des EU-KI-Gesetzes',
    'riskAssessment.documentation.content': 'Dieser Leitfaden beschreibt die Dokumentationsanforderungen für KI-Systeme, einschließlich technischer Dokumentation, Risikobewertungen und Compliance-Aufzeichnungen.',
    'riskAssessment.highRisk.title': 'Anforderungen an Hochrisikosysteme',
    'riskAssessment.highRisk.description': 'Compliance-Anforderungen für Hochrisiko-KI-Systeme',
    'riskAssessment.highRisk.content': 'Detaillierte Erklärung der spezifischen Anforderungen, die gemäß dem EU-KI-Gesetz für Hochrisiko-KI-Systeme gelten, einschließlich Risikomanagement, Daten-Governance und menschlicher Aufsicht.',
    'riskAssessment.prohibited.title': 'Verbotene Anwendungsfälle',
    'riskAssessment.prohibited.description': 'Verständnis verbotener KI-Anwendungen',
    'riskAssessment.prohibited.content': 'Dieser Leitfaden erklärt die KI-Anwendungen, die gemäß Artikel 5 des EU-KI-Gesetzes ausdrücklich verboten sind, einschließlich sozialer Bewertungssysteme und bestimmter biometrischer Systeme.',
    'riskAssessment.faq.title': 'FAQ: Risikobewertung',
    'riskAssessment.faq.description': 'Häufig gestellte Fragen zur Risikobewertung',
    'riskAssessment.faq.content': 'Antworten auf häufig gestellte Fragen zur Risikobewertung gemäß dem EU-KI-Gesetz, einschließlich Zeitpläne, Verantwortlichkeiten und bewährte Praktiken.',
    
    // Buttons
    'button.view': 'Leitfaden anzeigen',
    'button.viewFaq': 'FAQ anzeigen',
    'button.viewDocs': 'Vollständige Dokumentation anzeigen',
    
    // Additional Resources
    'resources.title': 'Zusätzliche Ressourcen',
    'resources.description': 'Externe Leitlinien und Informationen zum EU-KI-Gesetz',
    'resources.official.title': 'Offizieller Text des EU-KI-Gesetzes',
    'resources.official.description': 'Der offizielle Rechtstext des EU-KI-Gesetzes von der Europäischen Kommission.',
    'resources.commission.title': 'Leitlinien der EU-Kommission',
    'resources.commission.description': 'Offizielle Leitlinien der Europäischen Kommission zur Umsetzung des Gesetzes.',
    'resources.best.title': 'Branchenübliche Best Practices',
    'resources.best.description': 'Branchenstandards und bewährte Praktiken für die Risikobewertung und das Management von KI.',
    'resources.standards.title': 'Risikomanagementstandards',
    'resources.standards.description': 'Internationale Standards für das Risikomanagement in KI-Systemen.'
  },
  vi: {
    // Common UI elements
    'app.title': 'Nền tảng tuân thủ đạo luật AI của EU',
    'nav.home': 'Trang chủ',
    'nav.inventory': 'Kiểm kê AI',
    'nav.risk-assessment': 'Đánh giá rủi ro',
    'nav.compliance': 'Tuân thủ',
    'nav.reports': 'Báo cáo',
    'nav.training': 'Đào tạo',
    
    // Risk Assessment Guides
    'riskAssessment.guides.title': 'Hướng dẫn đánh giá rủi ro',
    'riskAssessment.guides.description': 'Hướng dẫn chi tiết và tài liệu để giúp bạn hiểu và thực hiện đánh giá rủi ro theo Đạo luật AI của EU',
    'riskAssessment.classification.title': 'Hướng dẫn phân loại rủi ro',
    'riskAssessment.classification.description': 'Hiểu khung phân loại rủi ro của Đạo luật AI của EU',
    'riskAssessment.classification.content': 'Hướng dẫn này giải thích cách phân loại hệ thống AI theo các danh mục rủi ro được xác định trong Đạo luật AI của EU: Không chấp nhận được, Cao, Hạn chế và Rủi ro tối thiểu.',
    'riskAssessment.methodology.title': 'Phương pháp đánh giá',
    'riskAssessment.methodology.description': 'Quy trình từng bước để tiến hành đánh giá rủi ro',
    'riskAssessment.methodology.content': 'Tìm hiểu về phương pháp để tiến hành đánh giá rủi ro toàn diện của hệ thống AI, bao gồm nhận diện rủi ro, phân tích, đánh giá và giảm thiểu.',
    'riskAssessment.documentation.title': 'Yêu cầu tài liệu',
    'riskAssessment.documentation.description': 'Tài liệu bắt buộc để tuân thủ Đạo luật AI của EU',
    'riskAssessment.documentation.content': 'Hướng dẫn này phác thảo các yêu cầu tài liệu cho hệ thống AI, bao gồm tài liệu kỹ thuật, đánh giá rủi ro và hồ sơ tuân thủ.',
    'riskAssessment.highRisk.title': 'Yêu cầu đối với hệ thống rủi ro cao',
    'riskAssessment.highRisk.description': 'Yêu cầu tuân thủ đối với hệ thống AI rủi ro cao',
    'riskAssessment.highRisk.content': 'Giải thích chi tiết về các yêu cầu cụ thể áp dụng cho hệ thống AI rủi ro cao theo Đạo luật AI của EU, bao gồm quản lý rủi ro, quản trị dữ liệu và giám sát của con người.',
    'riskAssessment.prohibited.title': 'Các trường hợp sử dụng bị cấm',
    'riskAssessment.prohibited.description': 'Hiểu các ứng dụng AI bị cấm',
    'riskAssessment.prohibited.content': 'Hướng dẫn này giải thích các ứng dụng AI bị cấm rõ ràng theo Điều 5 của Đạo luật AI của EU, bao gồm hệ thống chấm điểm xã hội và một số hệ thống sinh trắc học.',
    'riskAssessment.faq.title': 'Câu hỏi thường gặp: Đánh giá rủi ro',
    'riskAssessment.faq.description': 'Các câu hỏi thường gặp về đánh giá rủi ro',
    'riskAssessment.faq.content': 'Câu trả lời cho các câu hỏi thường gặp về đánh giá rủi ro theo Đạo luật AI của EU, bao gồm thời gian, trách nhiệm và thực tiễn tốt nhất.',
    
    // Buttons
    'button.view': 'Xem hướng dẫn',
    'button.viewFaq': 'Xem FAQ',
    'button.viewDocs': 'Xem tài liệu đầy đủ',
    
    // Additional Resources
    'resources.title': 'Tài nguyên bổ sung',
    'resources.description': 'Hướng dẫn và thông tin bên ngoài về Đạo luật AI của EU',
    'resources.official.title': 'Văn bản chính thức của Đạo luật AI của EU',
    'resources.official.description': 'Văn bản pháp lý chính thức của Đạo luật AI của EU từ Ủy ban Châu Âu.',
    'resources.commission.title': 'Hướng dẫn của Ủy ban EU',
    'resources.commission.description': 'Tài liệu hướng dẫn chính thức từ Ủy ban Châu Âu về việc thực hiện Đạo luật.',
    'resources.best.title': 'Thực tiễn tốt nhất trong ngành',
    'resources.best.description': 'Tiêu chuẩn ngành và thực tiễn tốt nhất cho đánh giá rủi ro và quản lý AI.',
    'resources.standards.title': 'Tiêu chuẩn quản lý rủi ro',
    'resources.standards.description': 'Tiêu chuẩn quốc tế cho quản lý rủi ro trong hệ thống AI.'
  }
};

// Language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Load language preference from localStorage on initial load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageCode;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Function to change language
  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  // Translation function
  const t = (key: string): string => {
    // Split the key to support nested translations (like pricing.calculator.title)
    const keyParts = key.split('.');
    let result: any = translations[currentLanguage];
    
    // Navigate through the nested objects to find the translation
    for (const part of keyParts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part];
      } else {
        // If not found in current language, fallback to English
        result = null;
        break;
      }
    }
    
    // If not found in current language, try English
    if (result === null) {
      result = translations.en;
      for (const part of keyParts) {
        if (result && typeof result === 'object' && part in result) {
          result = result[part];
        } else {
          // If not found in English either, return the key
          return key;
        }
      }
    }
    
    return result || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
