import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { ComplianceTip, TipBubble } from './tip-bubble';

// Sample tips by context with official EU AI Act source references
const tipsByContext: Record<string, ComplianceTip[]> = {
  '/risk-assessment': [
    {
      id: 'risk-1',
      title: 'Risk Assessment Best Practices',
      content: 'When assessing AI systems, consider both the intended use and reasonably foreseeable misuse scenarios to identify all potential risks.',
      contentGerman: 'Bei der Bewertung von KI-Systemen sollten Sie sowohl die beabsichtigte Verwendung als auch vernünftigerweise vorhersehbare Missbrauchsszenarien berücksichtigen, um alle potenziellen Risiken zu identifizieren.',
      category: 'risk',
      relevantArticles: ['Article 9', 'Article 10'],
      articleLinks: {
        'Article 9': 'https://artificialintelligenceact.eu/the-act/article-9-risk-management-system/',
        'Article 10': 'https://artificialintelligenceact.eu/the-act/article-10-data-and-data-governance/'
      },
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e1635-1-1',
      lastUpdated: 'March 25, 2025',
    },
    {
      id: 'risk-2',
      title: 'High-Risk System Identification',
      content: 'Remember that AI systems used in critical infrastructure, education, employment, or law enforcement are automatically considered high-risk under the EU AI Act.',
      contentGerman: 'Beachten Sie, dass KI-Systeme, die in kritischer Infrastruktur, Bildung, Beschäftigung oder Strafverfolgung eingesetzt werden, nach dem EU-KI-Gesetz automatisch als hochriskant eingestuft werden.',
      category: 'governance',
      relevantArticles: ['Article 6', 'Annex III'],
      articleLinks: {
        'Article 6': 'https://artificialintelligenceact.eu/the-act/article-6-classification-rules-for-high-risk-ai-systems/',
        'Annex III': 'https://artificialintelligenceact.eu/the-act/annex-iii-high-risk-ai-systems-referred-to-in-article-62/'
      },
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e1427-1-1',
      lastUpdated: 'March 25, 2025',
    },
  ],
  '/register-system': [
    {
      id: 'register-1',
      title: 'System Registration Requirements',
      content: 'All high-risk AI systems must be registered in the EU database before being placed on the market or put into service.',
      category: 'documentation',
      relevantArticles: ['Article 51'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e5193-1-1',
      lastUpdated: 'March 25, 2025',
    },
    {
      id: 'register-2',
      title: 'Technical Documentation for Registration',
      content: 'Registration requires detailed technical documentation covering AI system design, development methods, and performance metrics.',
      category: 'documentation',
      relevantArticles: ['Article 11', 'Article 51'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e2124-1-1',
      lastUpdated: 'March 25, 2025',
    },
  ],
  '/inventory': [
    {
      id: 'inventory-1',
      title: 'System Documentation Requirements',
      content: 'Ensure your AI system registration includes detailed information about data governance, technical documentation, and human oversight measures.',
      category: 'documentation',
      relevantArticles: ['Article 11', 'Article 18'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e2124-1-1',
      lastUpdated: 'March 25, 2025',
    },
    {
      id: 'inventory-2',
      title: 'Version Control Importance',
      content: 'Maintain detailed version history of your AI systems to track changes that may impact risk level or compliance status over time.',
      category: 'implementation',
      relevantArticles: ['Article 11'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e2124-1-1',
      lastUpdated: 'March 25, 2025',
    },
  ],
  '/documentation': [
    {
      id: 'docs-1',
      title: 'Technical Documentation Components',
      content: 'High-risk AI systems require comprehensive technical documentation including system architecture, data requirements, and validation methodologies.',
      category: 'documentation',
      relevantArticles: ['Article 11', 'Annex IV'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e2124-1-1',
      lastUpdated: 'March 25, 2025',
    },
  ],
  '/risk-management': [
    {
      id: 'risk-mgmt-1',
      title: 'Risk Management Cycle',
      content: 'Implement a continuous risk management cycle that includes identification, analysis, evaluation, mitigation, and ongoing monitoring of risks.',
      category: 'risk',
      relevantArticles: ['Article 9'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e1635-1-1',
      lastUpdated: 'March 25, 2025',
    },
    {
      id: 'risk-mgmt-2',
      title: 'Risk Mitigation Strategies',
      content: 'For high-risk AI systems, consider implementing redundant safety measures and fail-safe mechanisms to prevent harm.',
      category: 'implementation',
      relevantArticles: ['Article 9', 'Article 14'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e1635-1-1',
      lastUpdated: 'March 25, 2025',
    },
  ],
  '/workflow': [
    {
      id: 'workflow-1',
      title: 'Approval Process Documentation',
      content: 'Document all approval decisions and their justifications to demonstrate compliance with internal governance procedures.',
      category: 'governance',
      relevantArticles: ['Article 17', 'Article 29'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e2758-1-1',
      lastUpdated: 'March 25, 2025',
    },
  ],
  '/training': [
    {
      id: 'training-1',
      title: 'Staff Training Requirements',
      content: 'Ensure that staff working with high-risk AI systems receive appropriate training on human oversight procedures and risk management.',
      category: 'governance',
      relevantArticles: ['Article 14', 'Article 29'],
      learnMoreLink: '/knowledge-center',
      officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e2366-1-1',
      lastUpdated: 'March 25, 2025',
    },
  ],
};

// Default tips that can appear on any page
const defaultTips: ComplianceTip[] = [
  {
    id: 'default-1',
    title: 'EU AI Act Implementation Timeline',
    content: 'The EU AI Act applies in phases, with different compliance deadlines for different provisions. Ensure you\'re familiar with the timeline relevant to your systems.',
    contentGerman: 'Der EU-KI-Gesetz wird in Phasen angewendet, mit unterschiedlichen Fristen für verschiedene Bestimmungen. Stellen Sie sicher, dass Sie mit dem für Ihre Systeme relevanten Zeitplan vertraut sind.',
    category: 'general',
    relevantArticles: ['Article 85'],
    articleLinks: {
      'Article 85': 'https://artificialintelligenceact.eu/the-act/article-85-entry-into-force-and-application/'
    },
    learnMoreLink: '/knowledge-center',
    officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e7531-1-1',
    lastUpdated: 'March 25, 2025',
  },
  {
    id: 'default-2',
    title: 'Human Oversight Requirement',
    content: 'For high-risk AI systems, human oversight measures must be built into the system or established through organizational procedures.',
    contentGerman: 'Für Hochrisiko-KI-Systeme müssen Maßnahmen zur menschlichen Aufsicht in das System integriert oder durch organisatorische Verfahren festgelegt werden.',
    category: 'governance',
    relevantArticles: ['Article 14'],
    articleLinks: {
      'Article 14': 'https://artificialintelligenceact.eu/the-act/article-14-human-oversight/'
    },
    learnMoreLink: '/knowledge-center',
    officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e2366-1-1',
    lastUpdated: 'March 25, 2025',
  },
  {
    id: 'default-3',
    title: 'Data Governance Best Practices',
    content: 'Implement robust data governance practices for training, validation, and testing datasets to ensure representativeness and minimize biases.',
    contentGerman: 'Implementieren Sie robuste Datenverwaltungspraktiken für Trainings-, Validierungs- und Testdatensätze, um Repräsentativität zu gewährleisten und Verzerrungen zu minimieren.',
    category: 'implementation',
    relevantArticles: ['Article 10'],
    articleLinks: {
      'Article 10': 'https://artificialintelligenceact.eu/the-act/article-10-data-and-data-governance/'
    },
    learnMoreLink: '/knowledge-center',
    officialSourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689#d1e1882-1-1',
    lastUpdated: 'March 25, 2025',
  },
];

// Context for managing tips
interface ComplianceTipContextType {
  currentTip: ComplianceTip | null;
  showTip: (tipId?: string, context?: string) => void;
  dismissTip: () => void;
  recordFeedback: (tipId: string, isHelpful: boolean) => void;
  dismissedTips: string[];
  resetDismissedTips: () => void;
}

const ComplianceTipContext = createContext<ComplianceTipContextType | undefined>(undefined);

// Hook for accessing the tip context
export function useComplianceTips() {
  const context = useContext(ComplianceTipContext);
  if (context === undefined) {
    throw new Error('useComplianceTips must be used within a ComplianceTipProvider');
  }
  return context;
}

interface ComplianceTipProviderProps {
  children: ReactNode;
  disableAutoTips?: boolean;
  jackStyle?: boolean;
}

export function ComplianceTipProvider({ 
  children, 
  disableAutoTips = false,
  jackStyle = false
}: ComplianceTipProviderProps) {
  const [location] = useLocation();
  const [currentTip, setCurrentTip] = useState<ComplianceTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<Record<string, boolean>>({});
  
  // Get relevant tips for current context
  const getContextualTips = () => {
    // Get path-specific tips
    const contextTips = Object.entries(tipsByContext).find(([path]) => {
      return location.startsWith(path);
    });
    
    // Combine context-specific tips with default tips
    return [...(contextTips ? contextTips[1] : []), ...defaultTips]
      .filter(tip => !dismissedTips.includes(tip.id));
  };
  
  // Show a specific tip or a random one from the current context
  const showTip = (tipId?: string, context?: string) => {
    // If already showing a tip, don't show another
    if (currentTip) return;
    
    let availableTips: ComplianceTip[] = [];
    
    if (tipId) {
      // Find specific tip by ID
      const allTips = [...Object.values(tipsByContext).flat(), ...defaultTips];
      const specificTip = allTips.find(tip => tip.id === tipId);
      if (specificTip && !dismissedTips.includes(specificTip.id)) {
        setCurrentTip(specificTip);
        return;
      }
    } else if (context) {
      // Get tips for a specific context
      availableTips = [
        ...(tipsByContext[context] || []),
        ...defaultTips
      ].filter(tip => !dismissedTips.includes(tip.id));
    } else {
      // Get tips for current location
      availableTips = getContextualTips();
    }
    
    // If no available tips, don't show anything
    if (availableTips.length === 0) return;
    
    // Show a random tip
    const randomIndex = Math.floor(Math.random() * availableTips.length);
    setCurrentTip(availableTips[randomIndex]);
  };
  
  // Dismiss the current tip
  const dismissTip = () => {
    if (currentTip) {
      setDismissedTips(prev => [...prev, currentTip.id]);
      setCurrentTip(null);
    }
  };
  
  // Record user feedback on a tip
  const recordFeedback = (tipId: string, isHelpful: boolean) => {
    setFeedbackHistory(prev => ({
      ...prev,
      [tipId]: isHelpful
    }));
    
    // Analytics could be added here in the future
    console.log(`Tip ${tipId} feedback: ${isHelpful ? 'helpful' : 'not helpful'}`);
  };
  
  // Reset dismissed tips
  const resetDismissedTips = () => {
    setDismissedTips([]);
    setCurrentTip(null);
  };
  
  // Show tips on location change if auto tips are enabled
  useEffect(() => {
    if (disableAutoTips) return;
    
    // Small delay to avoid showing tips immediately on page load
    const timer = setTimeout(() => {
      showTip();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [location, disableAutoTips]);
  
  // Provide context value
  const contextValue: ComplianceTipContextType = {
    currentTip,
    showTip,
    dismissTip,
    recordFeedback,
    dismissedTips,
    resetDismissedTips
  };
  
  return (
    <ComplianceTipContext.Provider value={contextValue}>
      {children}
      
      {/* Render the current tip */}
      {currentTip && (
        <TipBubble
          tip={currentTip}
          position="bottom-right"
          onDismiss={dismissTip}
          onFeedback={recordFeedback}
          animate={true}
          jackStyle={jackStyle}
          autoDismiss={true}
          autoDismissDelay={20000} // Auto-dismiss after 20 seconds as requested
        />
      )}
    </ComplianceTipContext.Provider>
  );
}