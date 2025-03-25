import React, { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  Check, 
  CheckCircle, 
  ClipboardCheck, 
  FileText, 
  HelpCircle, 
  Info, 
  Shield, 
  Sparkles, 
  Users, 
  Database, 
  Eye, 
  Brain, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Save,
  ArrowRight,
  LightbulbIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

// Define interfaces for the risk assessment
interface RiskCategory {
  id: string;
  name: string;
  description: string;
  questions: RiskQuestion[];
  euArticles?: string[];
  relevance?: 'high' | 'medium' | 'low';
}

interface RiskQuestion {
  id: string;
  question: string;
  description: string;
  type: 'slider' | 'radio' | 'text' | 'checkbox' | 'select';
  options?: string[];
  weight: number;
  euArticleReference?: string;
  complianceRequirement?: string;
}

interface AssessmentResult {
  systemId?: string;
  assessmentId?: string;
  date: string;
  assessor: string;
  categoryScores: Record<string, number>;
  overallScore: number;
  riskLevel: 'High' | 'Limited' | 'Minimal' | 'Unacceptable';
  prohibitedUse: boolean;
  prohibitedJustification?: string;
  recommendations: string[];
  requiredDocumentation: string[];
  relevantArticles: string[];
  complianceGaps: string[];
  nextSteps: string[];
}

interface RiskWizardProps {
  systemId?: string;
  onComplete?: (result: AssessmentResult) => void;
  onSaveDraft?: (data: any) => void;
}

export function AdvancedRiskWizard({ systemId, onComplete, onSaveDraft }: RiskWizardProps) {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('system-info');
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, any>>({});
  const [assessmentMeta, setAssessmentMeta] = useState({
    assessorName: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessmentTitle: '',
    department: '',
    version: '1.0',
    stakeholders: ''
  });
  const [highlightedArticles, setHighlightedArticles] = useState<string[]>([]);
  const [isProhibited, setIsProhibited] = useState(false);
  const [prohibitedReason, setProhibitedReason] = useState('');
  const [manualSystemInfo, setManualSystemInfo] = useState({
    name: '',
    description: '',
    purpose: '',
    capabilities: '',
    vendor: '',
    version: '',
    department: ''
  });
  const [documentationFiles, setDocumentationFiles] = useState<Array<{ name: string, uploaded: boolean }>>([]);
  const [evidenceProvided, setEvidenceProvided] = useState<Record<string, boolean>>({});
  
  // Query system data if systemId is provided
  const { data: systemData, isLoading: isSystemLoading } = useQuery({
    queryKey: ['/api/systems', systemId],
    enabled: !!systemId,
  });
  
  // Query all systems for dropdown
  const { data: allSystems, isLoading: isAllSystemsLoading } = useQuery({
    queryKey: ['/api/systems'],
  });

  // Tabs configuration
  const tabs = [
    { id: 'system-info', label: 'System Info', icon: <Info className="h-4 w-4" /> },
    { id: 'prohibited-use', label: 'Prohibited Use', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'risk-categorization', label: 'Risk Category', icon: <Shield className="h-4 w-4" /> },
    { id: 'risk-parameters', label: 'Risk Parameters', icon: <Brain className="h-4 w-4" /> },
    { id: 'governance', label: 'Governance', icon: <Users className="h-4 w-4" /> },
    { id: 'documentation', label: 'Documentation', icon: <FileText className="h-4 w-4" /> },
    { id: 'evidence', label: 'Evidence', icon: <ClipboardCheck className="h-4 w-4" /> },
    { id: 'assessment', label: 'Assessment', icon: <Check className="h-4 w-4" /> }
  ];

  // Risk categories definition
  const riskCategories: RiskCategory[] = [
    {
      id: 'prohibited',
      name: 'Prohibited Use Assessment',
      description: 'Determine if the system falls under prohibited use cases defined by Article 5 of the EU AI Act',
      euArticles: ['Article 5'],
      relevance: 'high',
      questions: [
        {
          id: 'subliminal_techniques',
          question: 'Does the system use subliminal techniques to materially distort behavior?',
          description: 'AI systems that deploy subliminal techniques beyond a person\'s consciousness with the intention to materially distort human behavior in a manner that causes or is likely to cause psychological or physical harm are prohibited.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 2.0,
          euArticleReference: 'Article 5(1)(a)',
          complianceRequirement: 'Systems must not use subliminal techniques to distort behavior causing harm'
        },
        {
          id: 'vulnerability_exploitation',
          question: 'Does the system exploit vulnerabilities of specific groups?',
          description: 'AI systems that exploit the vulnerabilities of a specific group of persons due to their age, physical or mental disability are prohibited if used to materially distort behavior causing harm.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 2.0,
          euArticleReference: 'Article 5(1)(b)',
          complianceRequirement: 'Systems must not exploit vulnerabilities of specific groups'
        },
        {
          id: 'social_scoring',
          question: 'Does the system perform social scoring or evaluation of natural persons?',
          description: 'AI systems used for general purpose social scoring of natural persons by public authorities are prohibited.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 2.0,
          euArticleReference: 'Article 5(1)(c)',
          complianceRequirement: 'Systems must not perform general purpose social scoring'
        },
        {
          id: 'real_time_biometrics',
          question: 'Does the system use real-time remote biometric identification in publicly accessible spaces?',
          description: 'Real-time remote biometric identification systems in publicly accessible spaces for law enforcement are prohibited except for specific, limited purposes.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 2.0,
          euArticleReference: 'Article 5(1)(d)',
          complianceRequirement: 'Systems must not use real-time remote biometric identification except in specific cases'
        },
        {
          id: 'emotion_recognition',
          question: 'Does the system use emotion recognition in workplace or educational contexts?',
          description: 'AI systems for emotion recognition in the workplace and educational institutions are prohibited.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 2.0,
          euArticleReference: 'Article 5(1)(a) and (b)',
          complianceRequirement: 'Emotion recognition should not be used in workplace/educational contexts'
        },
        {
          id: 'biometric_categorization',
          question: 'Does the system use biometric categorization to infer sensitive data?',
          description: 'AI systems that use biometric categorization to infer or deduce sensitive data (race, political opinions, religious beliefs, etc.) are prohibited.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 2.0,
          euArticleReference: 'Article 5(1)(c)',
          complianceRequirement: 'Systems must not use biometric categorization to infer sensitive data'
        }
      ]
    },
    {
      id: 'high_risk_categories',
      name: 'High-Risk Categorization',
      description: 'Determine if the system falls under high-risk categories as defined in Articles 6 and 7',
      euArticles: ['Article 6', 'Article 7', 'Annex III'],
      relevance: 'high',
      questions: [
        {
          id: 'product_safety',
          question: 'Is the system a safety component of a product subject to Union harmonization legislation?',
          description: 'AI systems that are safety components of products subject to third-party conformity assessment under Union harmonization legislation.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 1.8,
          euArticleReference: 'Article 6(1)(a)',
          complianceRequirement: 'Product safety components must meet harmonization requirements'
        },
        {
          id: 'critical_infrastructure',
          question: 'Is the system used in critical infrastructure management or operation?',
          description: 'AI systems used for management and operation of critical infrastructure that could put life and health at risk.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 1.8,
          euArticleReference: 'Annex III(2)',
          complianceRequirement: 'Systems for critical infrastructure require strict risk management'
        },
        {
          id: 'education_vocational',
          question: 'Is the system used for educational or vocational training purposes?',
          description: 'AI systems used to determine access to educational institutions or for assessment of students.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 1.8,
          euArticleReference: 'Annex III(3)',
          complianceRequirement: 'Educational/vocational systems must ensure fairness and non-discrimination'
        },
        {
          id: 'employment',
          question: 'Is the system used for employment, worker management, or self-employment access?',
          description: 'AI systems used for recruitment, promotion, termination, task allocation, or monitoring and evaluating performance and behavior.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 1.8,
          euArticleReference: 'Annex III(4)',
          complianceRequirement: 'Employment systems must ensure transparency and non-discrimination'
        },
        {
          id: 'essential_services',
          question: 'Is the system used for access to essential services?',
          description: 'AI systems used to evaluate creditworthiness or establish credit scores, for dispatch or prioritization in emergency services, etc.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 1.8,
          euArticleReference: 'Annex III(5)',
          complianceRequirement: 'Essential services systems must ensure equitable access'
        },
        {
          id: 'law_enforcement',
          question: 'Is the system used for law enforcement purposes?',
          description: 'AI systems for individual risk assessment, polygraphs, detecting emotional states, detecting deepfakes, crime analytics, etc.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 1.8,
          euArticleReference: 'Annex III(6)',
          complianceRequirement: 'Law enforcement systems must ensure strict safeguards'
        },
        {
          id: 'migration_asylum',
          question: 'Is the system used for migration, asylum, or border control management?',
          description: 'AI systems for verification of authenticity of travel documents, security risk assessment, or assistance with examining asylum/visa applications.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 1.8,
          euArticleReference: 'Annex III(7)',
          complianceRequirement: 'Migration/asylum systems must ensure human rights protection'
        },
        {
          id: 'justice_democratic',
          question: 'Is the system used for administration of justice or democratic processes?',
          description: 'AI systems assisting judicial authorities in researching and interpreting facts and the law, and in applying the law to specific facts.',
          type: 'radio',
          options: ['Yes', 'No', 'Unclear/Needs further assessment'],
          weight: 1.8,
          euArticleReference: 'Annex III(8)',
          complianceRequirement: 'Justice systems must ensure fairness and due process'
        }
      ]
    },
    {
      id: 'fundamental_rights',
      name: 'Fundamental Rights Impact',
      description: 'Assess the potential impact on fundamental rights such as privacy, non-discrimination, and human dignity',
      euArticles: ['Article 10', 'Article 14', 'Article 15'],
      relevance: 'high',
      questions: [
        {
          id: 'privacy_impact',
          question: 'Privacy Impact',
          description: 'How significantly could the system impact individual privacy?',
          type: 'slider',
          weight: 1.5,
          euArticleReference: 'Article 10(2)',
          complianceRequirement: 'Systems must protect privacy and data by design'
        },
        {
          id: 'discrimination_potential',
          question: 'Discrimination Potential',
          description: 'Could the system perpetuate or amplify discrimination against protected groups?',
          type: 'radio',
          options: [
            'No risk of discrimination',
            'Low potential for unintended bias',
            'Moderate discrimination concerns',
            'High risk of systematic discrimination'
          ],
          weight: 1.8,
          euArticleReference: 'Article 10(5)',
          complianceRequirement: 'Systems must not discriminate against protected groups'
        },
        {
          id: 'vulnerable_groups',
          question: 'Vulnerable Groups',
          description: 'Does the system interact with or make decisions affecting vulnerable groups?',
          type: 'radio',
          options: [
            'No interaction with vulnerable groups',
            'Limited interaction with minimal impact',
            'Regular interaction with moderate impact',
            'Significant decision-making affecting vulnerable populations'
          ],
          weight: 1.5,
          euArticleReference: 'Article 10(5)',
          complianceRequirement: 'Special consideration for impact on vulnerable groups'
        },
        {
          id: 'human_agency',
          question: 'Impact on Human Agency',
          description: 'To what extent does the system impact human autonomy and decision-making capability?',
          type: 'slider',
          weight: 1.4,
          euArticleReference: 'Article 14',
          complianceRequirement: 'Systems must maintain human agency and decision-making'
        }
      ]
    },
    {
      id: 'technical_robustness',
      name: 'Technical Robustness',
      description: 'Evaluate the technical robustness, reliability and security of the AI system',
      euArticles: ['Article 10', 'Article 15', 'Article 17'],
      relevance: 'high',
      questions: [
        {
          id: 'accuracy',
          question: 'System Accuracy',
          description: 'How accurately does the system perform its intended function?',
          type: 'slider',
          weight: 1.2,
          euArticleReference: 'Article 10(2)',
          complianceRequirement: 'Systems must achieve appropriate levels of accuracy'
        },
        {
          id: 'reliability',
          question: 'System Reliability',
          description: 'How reliable is the system in terms of consistent performance?',
          type: 'slider',
          weight: 1.0,
          euArticleReference: 'Article 15(1)',
          complianceRequirement: 'Systems must maintain consistent performance'
        },
        {
          id: 'security',
          question: 'Cybersecurity Measures',
          description: 'How comprehensive are the cybersecurity measures protecting the system?',
          type: 'radio',
          options: [
            'Basic security measures only',
            'Standard industry security practices',
            'Enhanced security with regular testing',
            'Comprehensive security with continuous monitoring'
          ],
          weight: 1.3,
          euArticleReference: 'Article 15(3)',
          complianceRequirement: 'Systems must implement appropriate cybersecurity measures'
        },
        {
          id: 'resilience',
          question: 'Resilience to Attacks',
          description: 'How resilient is the system against attempts to circumvent or manipulate it?',
          type: 'slider',
          weight: 1.2,
          euArticleReference: 'Article 15(4)',
          complianceRequirement: 'Systems must be resilient against manipulation attempts'
        }
      ]
    },
    {
      id: 'data_governance',
      name: 'Data Governance',
      description: 'Assess the data quality, management, and protection practices',
      euArticles: ['Article 10', 'Article 17', 'Article 61'],
      relevance: 'high',
      questions: [
        {
          id: 'data_quality',
          question: 'Data Quality',
          description: 'How would you rate the quality of data used by the system?',
          type: 'slider',
          weight: 1.2,
          euArticleReference: 'Article 10(3)',
          complianceRequirement: 'Data used must be relevant, representative, and free of errors'
        },
        {
          id: 'data_protection',
          question: 'Data Protection Measures',
          description: 'What level of data protection measures are implemented?',
          type: 'radio',
          options: [
            'Basic data protection',
            'Standard compliance with regulations',
            'Enhanced protection beyond requirements',
            'Comprehensive protection with regular audits'
          ],
          weight: 1.4,
          euArticleReference: 'Article 10(5)',
          complianceRequirement: 'Systems must implement appropriate data protection'
        },
        {
          id: 'data_sources',
          question: 'Data Sources',
          description: 'What are the primary sources of data used by the system?',
          type: 'select',
          options: [
            'Internal proprietary data only',
            'Public datasets with proper licensing',
            'Purchased third-party data',
            'User-generated data',
            'Mixed sources with validation',
            'Unknown/needs verification'
          ],
          weight: 0.8,
          euArticleReference: 'Article 10(3)',
          complianceRequirement: 'Data sources must be properly documented and validated'
        },
        {
          id: 'data_management',
          question: 'Data Management Processes',
          description: 'How structured and documented are the data management processes?',
          type: 'radio',
          options: [
            'Ad-hoc or minimal documentation',
            'Basic structured processes',
            'Well-documented processes with regular reviews',
            'Comprehensive data governance framework'
          ],
          weight: 1.0,
          euArticleReference: 'Article 17',
          complianceRequirement: 'Structured data management processes are required'
        }
      ]
    },
    {
      id: 'human_oversight',
      name: 'Human Oversight',
      description: 'Evaluate the level and effectiveness of human oversight implemented for the AI system',
      euArticles: ['Article 14', 'Article 29'],
      relevance: 'high',
      questions: [
        {
          id: 'oversight_mechanisms',
          question: 'Oversight Mechanisms',
          description: 'What human oversight mechanisms are in place?',
          type: 'radio',
          options: [
            'No specific oversight mechanisms',
            'Basic review of system outputs',
            'Regular human review of critical decisions',
            'Comprehensive oversight with intervention capabilities'
          ],
          weight: 1.5,
          euArticleReference: 'Article 14(4)',
          complianceRequirement: 'Human oversight mechanisms must be implemented'
        },
        {
          id: 'human_autonomy',
          question: 'Human Autonomy',
          description: 'To what extent does the system preserve human autonomy in decision-making?',
          type: 'slider',
          weight: 1.3,
          euArticleReference: 'Article 14(1)',
          complianceRequirement: 'Systems must preserve human autonomy in decision-making'
        },
        {
          id: 'override_capabilities',
          question: 'Override Capabilities',
          description: 'Can humans effectively override system decisions when necessary?',
          type: 'radio',
          options: [
            'No override capability',
            'Limited override with restrictions',
            'Standard override for most functions',
            'Comprehensive override capabilities'
          ],
          weight: 1.4,
          euArticleReference: 'Article 14(4)(d)',
          complianceRequirement: 'Humans must be able to override system decisions'
        },
        {
          id: 'oversight_training',
          question: 'Oversight Training',
          description: 'Are humans overseeing the system properly trained for this responsibility?',
          type: 'radio',
          options: [
            'No specific training provided',
            'Basic introduction to the system',
            'Structured training program',
            'Comprehensive training with regular updates'
          ],
          weight: 1.2,
          euArticleReference: 'Article 14(4)',
          complianceRequirement: 'Staff must be properly trained for oversight responsibilities'
        }
      ]
    },
    {
      id: 'transparency',
      name: 'Transparency',
      description: 'Assess the explainability and transparency of the AI system and its decisions',
      euArticles: ['Article 13', 'Article 52'],
      relevance: 'high',
      questions: [
        {
          id: 'explainability',
          question: 'System Explainability',
          description: 'How explainable are the system\'s decisions to end users?',
          type: 'slider',
          weight: 1.3,
          euArticleReference: 'Article 13(1)',
          complianceRequirement: 'High-risk AI systems must be sufficiently transparent'
        },
        {
          id: 'documentation',
          question: 'Documentation Quality',
          description: 'How comprehensive is the system documentation?',
          type: 'radio',
          options: [
            'Minimal documentation',
            'Basic technical documentation',
            'Comprehensive technical documentation',
            'Full documentation with user-friendly explanations'
          ],
          weight: 1.1,
          euArticleReference: 'Article 11',
          complianceRequirement: 'Technical documentation must be comprehensive'
        },
        {
          id: 'disclosure',
          question: 'AI Disclosure',
          description: 'How clearly is the use of AI disclosed to users?',
          type: 'radio',
          options: [
            'No disclosure',
            'Limited disclosure in terms of service',
            'Clear disclosure during system use',
            'Comprehensive disclosure with educational resources'
          ],
          weight: 1.2,
          euArticleReference: 'Article 52',
          complianceRequirement: 'Users must be informed when interacting with AI systems'
        },
        {
          id: 'logging_capabilities',
          question: 'Logging Capabilities',
          description: 'What level of logging and record-keeping does the system implement?',
          type: 'radio',
          options: [
            'Minimal or no logging',
            'Basic error and access logging',
            'Detailed activity and decision logging',
            'Comprehensive logging with audit trails'
          ],
          weight: 1.0,
          euArticleReference: 'Article 12',
          complianceRequirement: 'Systems must maintain appropriate logging of operations'
        }
      ]
    }
  ];

  // Get total number of questions
  const totalQuestions = riskCategories.reduce((total, category) => total + category.questions.length, 0);

  // Calculate progress percentage
  const calculateProgress = () => {
    const answeredQuestions = Object.keys(responses).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  // Update responses
  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Special handling for prohibited use responses
    if (questionId.includes('prohibited') && value === 'Yes') {
      setIsProhibited(true);
    }
  };

  // Calculate score for a specific category
  const calculateCategoryScore = (categoryId: string) => {
    const category = riskCategories.find(cat => cat.id === categoryId);
    if (!category) return 0;
    
    let score = 0;
    let totalWeight = 0;
    
    category.questions.forEach(question => {
      const response = responses[question.id];
      totalWeight += question.weight;
      
      if (response !== undefined) {
        if (question.type === 'slider') {
          score += (response / 100) * question.weight;
        } else if (question.type === 'radio' && question.options) {
          // Reverse the score for risk questions (higher index = higher risk)
          const valueIndex = question.options.indexOf(response);
          if (valueIndex !== -1) {
            const normalizedScore = question.id.includes('prohibited') || categoryId === 'high_risk_categories'
              ? ((valueIndex + 1) / question.options.length) 
              : (1 - (valueIndex / (question.options.length - 1)));
            score += normalizedScore * question.weight;
          }
        } else if (question.type === 'select' && question.options) {
          const valueIndex = question.options.indexOf(response);
          if (valueIndex !== -1) {
            score += ((valueIndex + 1) / question.options.length) * question.weight;
          }
        } else if (question.type === 'checkbox' && response) {
          // If checkbox is checked, add full weight
          score += question.weight;
        } else if (question.type === 'text' && response.trim() !== '') {
          // For text inputs, give partial score for completion
          score += 0.5 * question.weight;
        }
      }
    });
    
    return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
  };

  // Next tab handler
  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  // Previous tab handler
  const handlePrevTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  // AI assistance for recommendations
  const getAiAssistance = async (category: string) => {
    if (!aiAssistEnabled) return;
    
    setAiLoading(true);
    
    try {
      // Create a prompt for the AI to analyze based on the provided responses
      const systemInfo = systemId ? systemData : manualSystemInfo;
      const categoryData = riskCategories.find(cat => cat.id === category);
      
      const aiData = {
        systemName: systemInfo?.name || manualSystemInfo.name,
        systemDescription: systemInfo?.description || manualSystemInfo.description,
        systemPurpose: systemInfo?.purpose || manualSystemInfo.purpose,
        category: categoryData?.name,
        responses: Object.entries(responses)
          .filter(([key]) => categoryData?.questions.some(q => q.id === key))
          .map(([key, value]) => {
            const question = categoryData?.questions.find(q => q.id === key);
            return {
              question: question?.question,
              response: value,
              weight: question?.weight
            };
          })
      };
      
      // Set up an abort controller with timeout to prevent hanging requests
      const abortController = new AbortController();
      let timeoutId: number | null = window.setTimeout(() => {
        abortController.abort();
      }, 25000); // 25 second timeout
      
      const result = await apiRequest(`/api/suggest/system`, {
        method: 'POST',
        body: JSON.stringify({
          data: aiData,
          analysis_type: 'risk_assessment',
          category: category
        }),
        signal: abortController.signal
      });
      
      // Clear the timeout when request completes
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      if (result) {
        setAiSuggestions(prev => ({
          ...prev,
          [category]: result
        }));

        // If we're looking at the prohibited use category and there's a clear determination
        if (category === 'prohibited' && result.isProhibited !== undefined) {
          setIsProhibited(result.isProhibited);
          setProhibitedReason(result.prohibitedJustification || '');
        }
        
        toast({
          title: "AI Assistance Generated",
          description: "SGH ASIA AI has provided recommendations for this section.",
        });
      }
    } catch (error) {
      console.error("Error getting AI assistance:", error);
      
      let errorMessage = "Unable to generate AI recommendations. Proceed with manual assessment.";
      
      // Check for abort errors (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "Request timed out. The AI service might be experiencing delays.";
      } else if (error instanceof Error) {
        // Log the specific error but show a generic message to the user
        console.error(`AI suggestion error details: ${error.message}`);
      }
      
      toast({
        title: "AI Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Complete assessment
  const completeAssessment = async () => {
    setIsAssessing(true);
    
    try {
      // Calculate scores for each category
      const categoryScores: Record<string, number> = {};
      riskCategories.forEach(category => {
        categoryScores[category.name] = calculateCategoryScore(category.id);
      });
      
      // Handle special case for prohibited use
      // If any prohibited use questions were answered with "Yes", override risk level
      const isProhibitedUse = riskCategories
        .find(cat => cat.id === 'prohibited')
        ?.questions.some(q => responses[q.id] === 'Yes');
      
      // Calculate overall score (weighted average, excluding prohibited since those are binary)
      const relevantCategories = riskCategories.filter(cat => cat.id !== 'prohibited');
      const totalScore = relevantCategories.reduce((sum, category) => {
        return sum + calculateCategoryScore(category.id);
      }, 0);
      const overallScore = totalScore / relevantCategories.length;
      
      // Determine risk level
      let riskLevel: 'High' | 'Limited' | 'Minimal' | 'Unacceptable';
      if (isProhibitedUse) {
        riskLevel = 'Unacceptable';
      } else if (overallScore >= 75) {
        riskLevel = 'Minimal';
      } else if (overallScore >= 50) {
        riskLevel = 'Limited';
      } else {
        riskLevel = 'High';
      }
      
      // Identify relevant articles based on high-risk areas
      const relevantArticles: string[] = [];
      riskCategories.forEach(category => {
        const categoryScore = calculateCategoryScore(category.id);
        if (categoryScore < 70 && category.euArticles) {
          relevantArticles.push(...category.euArticles);
        }
      });
      
      // Generate compliance gaps
      const complianceGaps: string[] = [];
      riskCategories.forEach(category => {
        const categoryScore = calculateCategoryScore(category.id);
        if (categoryScore < 50) {
          category.questions.forEach(question => {
            const response = responses[question.id];
            if (!response || 
                (question.type === 'slider' && response < 50) ||
                (question.type === 'radio' && question.options && 
                 question.options.indexOf(response) >= Math.floor(question.options.length / 2))) {
              if (question.complianceRequirement) {
                complianceGaps.push(question.complianceRequirement);
              }
            }
          });
        }
      });
      
      // Determine required documentation
      const requiredDocumentation = determineRequiredDocumentation(riskLevel, categoryScores);
      
      // Generate recommendations
      const recommendations = generateRecommendations(categoryScores, riskLevel);
      
      // Generate next steps
      const nextSteps = generateNextSteps(categoryScores, riskLevel, complianceGaps);
      
      // Create final assessment result
      const result: AssessmentResult = {
        systemId: systemId,
        assessmentId: `RA-${Date.now()}`,
        date: assessmentMeta.assessmentDate,
        assessor: assessmentMeta.assessorName,
        categoryScores,
        overallScore,
        riskLevel,
        prohibitedUse: isProhibitedUse || false,
        prohibitedJustification: prohibitedReason,
        recommendations,
        requiredDocumentation,
        relevantArticles: [...new Set(relevantArticles)], // Remove duplicates
        complianceGaps: [...new Set(complianceGaps)], // Remove duplicates
        nextSteps
      };
      
      // Set assessment result
      setAssessmentResult(result);
      
      // Save assessment to database
      try {
        // Prepare assessment data with required fields
        const assessmentData = {
          assessmentId: result.assessmentId,
          systemId: result.systemId,
          assessmentDate: result.date || new Date(),
          riskLevel: result.riskLevel,
          riskScore: result.overallScore,
          systemCategory: assessmentMeta.systemCategory || "other",
          prohibitedUseChecks: result.prohibitedUse ? [{ reason: result.prohibitedJustification || "Flagged as prohibited use" }] : [],
          euAiActArticles: result.relevantArticles || [],
          complianceGaps: result.complianceGaps || [],
          remediationActions: result.recommendations || [],
          evidenceDocuments: result.requiredDocumentation || [], 
          summaryNotes: "Comprehensive risk assessment completed via advanced wizard",
          createdBy: "admin-01", // Using a valid uid from users table
          status: "completed" // Ensure status field is included
        };
        
        console.log("Sending assessment data:", assessmentData);
        
        try {
          const response = await apiRequest('/api/risk-assessments', {
            method: 'POST',
            body: assessmentData
          });
          
          console.log("Assessment saved:", response);
        } catch (apiError: any) {
          console.error("API error details:", apiError.message);
          // If there's a more detailed error response available
          if (apiError.response) {
            console.error("Response data:", apiError.response);
          }
          throw apiError; // Re-throw to be caught by outer try/catch
        }
        
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete(result);
        }
        
        toast({
          title: "Risk Assessment Complete",
          description: `Your assessment has been saved and will redirect to Risk Management.`,
        });
        
        // Redirect to Risk Management page after a short delay
        // Use window.location for navigation since we're in a callback
        setTimeout(() => {
          window.location.href = '/risk-management';
        }, 1500);
      } catch (saveError) {
        console.error("Error saving assessment:", saveError);
        toast({
          title: "Save Error",
          description: "The assessment was completed but could not be saved. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error completing assessment:", error);
      toast({
        title: "Assessment Error",
        description: "There was an error completing the risk assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAssessing(false);
    }
  };

  // Determine required documentation based on risk level
  const determineRequiredDocumentation = (riskLevel: string, categoryScores: Record<string, number>): string[] => {
    const basicDocs = [
      'System Description Document',
      'Risk Assessment Report'
    ];
    
    if (riskLevel === 'Minimal') {
      return [
        ...basicDocs,
        'Basic Data Quality Statement'
      ];
    }
    
    if (riskLevel === 'Limited') {
      return [
        ...basicDocs,
        'Data Quality and Governance Documentation',
        'Technical Robustness Test Results',
        'User Guidance Documentation',
        'System Limitations Description'
      ];
    }
    
    // For High Risk and Unacceptable
    return [
      ...basicDocs,
      'Comprehensive Technical Documentation',
      'Data Governance Documentation',
      'Human Oversight Protocol',
      'Conformity Assessment Report',
      'Incident Response Plan',
      'Post-Market Monitoring Plan',
      'Compliance Roadmap',
      'Training Materials for System Operators',
      'Explainability Statement',
      'Data Protection Impact Assessment'
    ];
  };

  // Generate recommendations based on scores
  const generateRecommendations = (categoryScores: Record<string, number>, riskLevel: string): string[] => {
    const recommendations: string[] = [];
    
    if (riskLevel === 'Unacceptable') {
      recommendations.push('Discontinue the development or deployment of this system as it falls under prohibited use cases in the EU AI Act.');
      recommendations.push('Restructure the system purpose and design to eliminate prohibited functionality.');
      recommendations.push('Consult legal experts regarding compliance with EU AI Act Article 5.');
      return recommendations;
    }
    
    // Add recommendations based on category scores
    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score < 50) {
        switch (category) {
          case 'Fundamental Rights Impact':
            recommendations.push("Conduct a comprehensive Fundamental Rights Impact Assessment (FRIA).");
            recommendations.push("Implement specific safeguards for privacy and anti-discrimination measures.");
            break;
          case 'Technical Robustness':
            recommendations.push("Enhance technical robustness through additional testing and validation procedures.");
            recommendations.push("Implement a comprehensive error handling and fallback system.");
            break;
          case 'Data Governance':
            recommendations.push("Review and enhance data quality management processes and data protection measures.");
            recommendations.push("Document data sources and implement regular data quality audits.");
            break;
          case 'Human Oversight':
            recommendations.push("Strengthen human oversight mechanisms with clear intervention protocols.");
            recommendations.push("Implement training for human overseers to effectively monitor and intervene in AI operations.");
            break;
          case 'Transparency':
            recommendations.push("Improve system explainability and documentation to enhance transparency.");
            recommendations.push("Develop clear communication materials about AI functionality for end-users.");
            break;
        }
      } else if (score < 70) {
        switch (category) {
          case 'Fundamental Rights Impact':
            recommendations.push("Review fundamental rights protections and consider additional safeguards.");
            break;
          case 'Technical Robustness':
            recommendations.push("Consider enhancing technical validation procedures for improved system reliability.");
            break;
          case 'Data Governance':
            recommendations.push("Review data governance practices to ensure ongoing compliance with best practices.");
            break;
          case 'Human Oversight':
            recommendations.push("Evaluate and potentially enhance human oversight mechanisms for critical decisions.");
            break;
          case 'Transparency':
            recommendations.push("Consider improvements to system documentation and user communications.");
            break;
        }
      }
    });
    
    // Add risk level specific recommendations
    if (riskLevel === 'High') {
      recommendations.push("Establish a compliance monitoring team to oversee the implementation of EU AI Act requirements.");
      recommendations.push("Develop a comprehensive conformity assessment plan before deployment.");
      recommendations.push("Implement continuous monitoring and post-market surveillance protocols.");
    } else if (riskLevel === 'Limited') {
      recommendations.push("Regularly review system performance and risk status as functionality evolves.");
      recommendations.push("Document transparency measures for users interacting with the system.");
    } else {
      recommendations.push("Maintain current compliance measures and continue regular monitoring.");
      recommendations.push("Consider periodic reassessment as the system evolves or regulations change.");
    }
    
    return recommendations;
  };

  // Generate next steps
  const generateNextSteps = (categoryScores: Record<string, number>, riskLevel: string, gaps: string[]): string[] => {
    const nextSteps: string[] = [];
    
    if (riskLevel === 'Unacceptable') {
      nextSteps.push('Cease development or deployment immediately');
      nextSteps.push('Redesign system purpose and functionality');
      nextSteps.push('Seek legal consultation for compliance requirements');
      return nextSteps;
    }
    
    if (riskLevel === 'High') {
      nextSteps.push('Complete all required documentation for high-risk AI systems');
      nextSteps.push('Conduct a conformity assessment with a notified body');
      nextSteps.push('Implement continuous monitoring and post-market surveillance');
      nextSteps.push('Register the system in the EU database for high-risk AI systems');
    } else if (riskLevel === 'Limited') {
      nextSteps.push('Document transparency measures and user information requirements');
      nextSteps.push('Develop and maintain technical documentation');
      nextSteps.push('Implement a quality management system for ongoing compliance');
    } else {
      nextSteps.push('Maintain documentation of system purpose and functionality');
      nextSteps.push('Monitor for changes that could affect risk classification');
    }
    
    // Add steps to address the most critical gaps
    if (gaps.length > 0) {
      // Limit to 3 critical gaps to avoid overwhelming
      gaps.slice(0, 3).forEach(gap => {
        nextSteps.push(`Address compliance gap: ${gap}`);
      });
    }
    
    // Add record-keeping steps
    nextSteps.push('Document this risk assessment and retain records');
    
    return nextSteps;
  };

  // Save draft assessment
  const saveDraft = () => {
    const draftData = {
      systemId,
      responses,
      assessmentMeta,
      activeTab,
      prohibitedReason,
      isProhibited,
      manualSystemInfo,
      lastUpdated: new Date().toISOString()
    };
    
    if (onSaveDraft) {
      onSaveDraft(draftData);
    }
    
    // Also save to localStorage as a backup
    localStorage.setItem('riskAssessmentDraft', JSON.stringify(draftData));
    
    toast({
      title: "Draft Saved",
      description: "Your assessment progress has been saved.",
    });
  };

  // Highlight relevant articles when a question is answered
  useEffect(() => {
    const newHighlightedArticles: string[] = [];
    
    Object.keys(responses).forEach(questionId => {
      riskCategories.forEach(category => {
        const question = category.questions.find(q => q.id === questionId);
        if (question?.euArticleReference && !newHighlightedArticles.includes(question.euArticleReference)) {
          newHighlightedArticles.push(question.euArticleReference);
        }
      });
    });
    
    setHighlightedArticles(newHighlightedArticles);
  }, [responses]);

  // Render a question based on its type
  const renderQuestion = (question: RiskQuestion, categoryId: string) => {
    const aiSuggestion = aiSuggestions[categoryId]?.questionSuggestions?.[question.id];
    
    return (
      <div className="space-y-4 mb-6 p-4 border border-neutral-100 rounded-lg">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h4 className="font-medium flex items-center">
              {question.question}
              {question.euArticleReference && (
                <Badge variant="outline" className="ml-2">
                  {question.euArticleReference}
                </Badge>
              )}
            </h4>
            <p className="text-sm text-neutral-500">{question.description}</p>
          </div>
          {aiAssistEnabled && aiSuggestion && (
            <div className="flex items-start">
              <Sparkles className="h-4 w-4 text-amber-500 mr-1 mt-1" />
              <div className="text-xs bg-amber-50 p-2 rounded-md border border-amber-100 max-w-xs">
                <span className="font-medium text-amber-800">AI Suggestion:</span> {aiSuggestion}
              </div>
            </div>
          )}
        </div>

        {question.type === 'slider' && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
            <Slider
              value={[responses[question.id] || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={values => handleResponseChange(question.id, values[0])}
              className="w-full"
            />
            <div className="text-right text-sm font-medium">
              {responses[question.id] || 50}%
            </div>
          </div>
        )}

        {question.type === 'radio' && question.options && (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={value => handleResponseChange(question.id, value)}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'select' && question.options && (
          <Select
            value={responses[question.id] || ''}
            onValueChange={value => handleResponseChange(question.id, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {question.type === 'checkbox' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={question.id}
              checked={responses[question.id] || false}
              onCheckedChange={value => handleResponseChange(question.id, value)}
            />
            <Label htmlFor={question.id} className="text-sm">
              Yes, this applies to our system
            </Label>
          </div>
        )}

        {question.type === 'text' && (
          <Textarea
            id={question.id}
            value={responses[question.id] || ''}
            onChange={e => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your response here..."
            className="w-full h-24"
          />
        )}
      </div>
    );
  };

  // Load system data from API if systemId is provided
  useEffect(() => {
    if (systemData) {
      setManualSystemInfo({
        name: systemData.name || '',
        description: systemData.description || '',
        purpose: systemData.purpose || '',
        capabilities: systemData.aiCapabilities || '',
        vendor: systemData.vendor || '',
        version: systemData.version || '',
        department: systemData.department || ''
      });
    }
  }, [systemData]);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          EU AI Act Comprehensive Risk Assessment Wizard
        </CardTitle>
        <CardDescription>
          Evaluate your AI system against the EU AI Act requirements to determine its risk classification and compliance needs.
        </CardDescription>
      </CardHeader>

      <div className="px-6 pb-4">
        <Progress value={calculateProgress()} className="h-2" />
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          <span>Assessment Progress</span>
          <span>{Math.round(calculateProgress())}%</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 overflow-auto">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid min-w-[700px] md:min-w-0 grid-cols-4 md:grid-cols-8 w-full">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <CardContent className="pt-6">
          {/* System Information Tab */}
          <TabsContent value="system-info" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  System Information
                </h3>
                {systemId && (
                  <Badge variant="outline" className="text-primary">
                    System ID: {systemId}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-neutral-500">
                Provide essential information about your AI system and this assessment.
              </p>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* System selector or display section */}
                <div className="col-span-2 mb-4">
                  {!systemId && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Select an Existing AI System</h4>
                        <p className="text-sm text-neutral-500 mb-4">
                          Choose an existing AI system from the dropdown to perform a comprehensive risk assessment,
                          or enter details manually below if you're assessing a new system.
                        </p>
                        
                        {isAllSystemsLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Select
                            onValueChange={(value) => {
                              if (value) {
                                // Navigate to the same page with systemId parameter
                                navigate(`/risk-assessment?systemId=${value}`);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select an AI system" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.isArray(allSystems) && allSystems.map((system) => (
                                <SelectItem key={system.id} value={system.systemId}>
                                  {system.name} ({system.systemId})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <Separator />
                      <h4 className="font-medium pt-2">Or Enter AI System Details Manually</h4>
                    </div>
                  )}
                </div>
                
                {systemId ? (
                  // If system is selected, show its information
                  isSystemLoading ? (
                    // Loading state
                    <>
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </>
                  ) : (
                    // System info display
                    <div className="col-span-2 border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">System Details</h4>
                        {systemData && (
                          <Badge variant="outline" className={`
                            ${systemData.riskLevel === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                              systemData.riskLevel === 'Limited' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-green-50 text-green-700 border-green-200'}
                          `}>
                            {systemData.riskLevel || 'Unknown'} Risk
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium">System Name</h5>
                          <p className="text-sm">{systemData?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Department</h5>
                          <p className="text-sm">{systemData?.department || 'N/A'}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Vendor</h5>
                          <p className="text-sm">{systemData?.vendor || 'N/A'}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Version</h5>
                          <p className="text-sm">{systemData?.version || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium">Description</h5>
                        <p className="text-sm">{systemData?.description || 'No description provided.'}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium">Purpose</h5>
                        <p className="text-sm">{systemData?.purpose || 'No purpose provided.'}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium">AI Capabilities</h5>
                        <p className="text-sm">{systemData?.aiCapabilities || 'No capabilities information provided.'}</p>
                      </div>
                    </div>
                  )
                ) : (
                  // If no system is selected, show manual input form
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="system-name">System Name</Label>
                      <Input 
                        id="system-name" 
                        value={manualSystemInfo.name}
                        onChange={(e) => setManualSystemInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter AI system name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="system-department">Department</Label>
                      <Input 
                        id="system-department" 
                        value={manualSystemInfo.department}
                        onChange={(e) => setManualSystemInfo(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="Enter department name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="system-vendor">Vendor</Label>
                      <Input 
                        id="system-vendor" 
                        value={manualSystemInfo.vendor}
                        onChange={(e) => setManualSystemInfo(prev => ({ ...prev, vendor: e.target.value }))}
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="system-version">Version</Label>
                      <Input 
                        id="system-version" 
                        value={manualSystemInfo.version}
                        onChange={(e) => setManualSystemInfo(prev => ({ ...prev, version: e.target.value }))}
                        placeholder="Enter version number"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="system-description">System Description</Label>
                      <Textarea 
                        id="system-description" 
                        value={manualSystemInfo.description}
                        onChange={(e) => setManualSystemInfo(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the AI system, its components and functionality"
                        className="h-24"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="system-purpose">System Purpose</Label>
                      <Textarea 
                        id="system-purpose" 
                        value={manualSystemInfo.purpose}
                        onChange={(e) => setManualSystemInfo(prev => ({ ...prev, purpose: e.target.value }))}
                        placeholder="Describe the intended purpose and use cases of the system"
                        className="h-24"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="system-capabilities">AI Capabilities</Label>
                      <Textarea 
                        id="system-capabilities" 
                        value={manualSystemInfo.capabilities}
                        onChange={(e) => setManualSystemInfo(prev => ({ ...prev, capabilities: e.target.value }))}
                        placeholder="Describe the AI capabilities and techniques used"
                        className="h-24"
                      />
                    </div>
                  </>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessor-name">Assessor Name</Label>
                  <Input 
                    id="assessor-name" 
                    value={assessmentMeta.assessorName}
                    onChange={(e) => setAssessmentMeta(prev => ({ ...prev, assessorName: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-date">Assessment Date</Label>
                  <Input 
                    id="assessment-date" 
                    type="date" 
                    value={assessmentMeta.assessmentDate}
                    onChange={(e) => setAssessmentMeta(prev => ({ ...prev, assessmentDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-title">Assessment Title</Label>
                  <Input 
                    id="assessment-title" 
                    value={assessmentMeta.assessmentTitle}
                    onChange={(e) => setAssessmentMeta(prev => ({ ...prev, assessmentTitle: e.target.value }))}
                    placeholder="E.g., Annual review, Pre-deployment assessment"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-version">Assessment Version</Label>
                  <Input 
                    id="assessment-version" 
                    value={assessmentMeta.version}
                    onChange={(e) => setAssessmentMeta(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="assessment-stakeholders">Relevant Stakeholders</Label>
                  <Textarea 
                    id="assessment-stakeholders" 
                    value={assessmentMeta.stakeholders}
                    onChange={(e) => setAssessmentMeta(prev => ({ ...prev, stakeholders: e.target.value }))}
                    placeholder="List stakeholders involved in this assessment (e.g., data scientists, legal team, etc.)"
                    className="h-24"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Switch 
                  id="ai-assist" 
                  checked={aiAssistEnabled}
                  onCheckedChange={setAiAssistEnabled}
                />
                <Label htmlFor="ai-assist" className="text-sm">Enable AI-assisted assessment</Label>
                <HelpCircle className="h-4 w-4 text-neutral-400" />
              </div>
            </div>
          </TabsContent>

          {/* Prohibited Use Tab */}
          <TabsContent value="prohibited-use" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                <h3 className="text-lg font-medium">Prohibited Use Screening</h3>
              </div>

              <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-md text-red-700">
                <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  The EU AI Act prohibits certain AI applications. This screening helps determine if your system falls under prohibited use cases as defined in Article 5 of the EU AI Act.
                </p>
              </div>

              <div className="space-y-4">
                {riskCategories
                  .find(category => category.id === 'prohibited')
                  ?.questions.map(question => renderQuestion(question, 'prohibited'))}
              </div>

              {aiAssistEnabled && (
                <div className="flex justify-center my-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    disabled={aiLoading}
                    onClick={() => getAiAssistance('prohibited')}
                  >
                    <Sparkles className="h-4 w-4" />
                    {aiLoading ? 'Analyzing...' : 'Get AI Assistance'}
                    {aiLoading && <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>}
                  </Button>
                </div>
              )}

              {isProhibited && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-md space-y-2">
                  <h4 className="font-medium text-red-800 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Prohibited Use Detected
                  </h4>
                  <p className="text-sm text-red-700">
                    Based on your responses, this system appears to fall under prohibited use cases according to Article 5 of the EU AI Act.
                  </p>
                  <div className="mt-2">
                    <Label htmlFor="prohibited-justification" className="text-red-800 font-medium">Provide justification or additional context:</Label>
                    <Textarea 
                      id="prohibited-justification" 
                      value={prohibitedReason}
                      onChange={(e) => setProhibitedReason(e.target.value)}
                      placeholder="Provide details about why this system might be classified as prohibited use..."
                      className="mt-1 bg-white border-red-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Risk Categorization Tab */}
          <TabsContent value="risk-categorization" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-amber-500" />
                <h3 className="text-lg font-medium">High-Risk Categorization</h3>
              </div>

              <p className="text-sm text-neutral-500">
                Determine if your system falls under high-risk categories as defined in Articles 6 and 7 and Annex III of the EU AI Act.
              </p>

              <div className="space-y-4">
                {riskCategories
                  .find(category => category.id === 'high_risk_categories')
                  ?.questions.map(question => renderQuestion(question, 'high_risk_categories'))}
              </div>

              {aiAssistEnabled && (
                <div className="flex justify-center my-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    disabled={aiLoading}
                    onClick={() => getAiAssistance('high_risk_categories')}
                  >
                    <Sparkles className="h-4 w-4" />
                    {aiLoading ? 'Analyzing...' : 'Get AI Assistance'}
                    {aiLoading && <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>}
                  </Button>
                </div>
              )}

              {aiSuggestions['high_risk_categories'] && (
                <div className="p-4 border bg-amber-50 border-amber-100 rounded-md space-y-2">
                  <h4 className="font-medium text-amber-800 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    AI Risk Analysis
                  </h4>
                  <p className="text-sm text-amber-700">
                    {aiSuggestions['high_risk_categories'].summary || 'Based on your responses, the AI has analyzed the risk categorization.'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Risk Parameters Tab */}
          <TabsContent value="risk-parameters" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                <h3 className="text-lg font-medium">Risk Parameters Assessment</h3>
              </div>

              <p className="text-sm text-neutral-500">
                Evaluate technical and operational aspects of your AI system against key risk parameters.
              </p>

              <div className="grid grid-cols-1 gap-6">
                {/* Fundamental Rights Impact */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    Fundamental Rights Impact
                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">
                      Articles 10, 14, 15
                    </Badge>
                  </h4>
                  
                  <div className="space-y-4">
                    {riskCategories
                      .find(category => category.id === 'fundamental_rights')
                      ?.questions.map(question => renderQuestion(question, 'fundamental_rights'))}
                  </div>
                </div>

                {/* Technical Robustness */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    Technical Robustness
                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">
                      Articles 10, 15, 17
                    </Badge>
                  </h4>
                  
                  <div className="space-y-4">
                    {riskCategories
                      .find(category => category.id === 'technical_robustness')
                      ?.questions.map(question => renderQuestion(question, 'technical_robustness'))}
                  </div>
                </div>
              </div>

              {aiAssistEnabled && (
                <div className="flex justify-center my-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    disabled={aiLoading}
                    onClick={() => {
                      getAiAssistance('fundamental_rights');
                      setTimeout(() => getAiAssistance('technical_robustness'), 1000);
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {aiLoading ? 'Analyzing...' : 'Get AI Assistance'}
                    {aiLoading && <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                <h3 className="text-lg font-medium">Governance & Transparency</h3>
              </div>

              <p className="text-sm text-neutral-500">
                Evaluate data governance, human oversight, and transparency requirements.
              </p>

              <div className="grid grid-cols-1 gap-6">
                {/* Data Governance */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Database className="h-4 w-4 mr-2 text-primary" />
                    Data Governance
                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">
                      Articles 10, 17, 61
                    </Badge>
                  </h4>
                  
                  <div className="space-y-4">
                    {riskCategories
                      .find(category => category.id === 'data_governance')
                      ?.questions.map(question => renderQuestion(question, 'data_governance'))}
                  </div>
                </div>

                {/* Human Oversight */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-primary" />
                    Human Oversight
                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">
                      Articles 14, 29
                    </Badge>
                  </h4>
                  
                  <div className="space-y-4">
                    {riskCategories
                      .find(category => category.id === 'human_oversight')
                      ?.questions.map(question => renderQuestion(question, 'human_oversight'))}
                  </div>
                </div>

                {/* Transparency */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Transparency
                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">
                      Articles 13, 52
                    </Badge>
                  </h4>
                  
                  <div className="space-y-4">
                    {riskCategories
                      .find(category => category.id === 'transparency')
                      ?.questions.map(question => renderQuestion(question, 'transparency'))}
                  </div>
                </div>
              </div>

              {aiAssistEnabled && (
                <div className="flex justify-center my-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    disabled={aiLoading}
                    onClick={() => {
                      getAiAssistance('data_governance');
                      setTimeout(() => getAiAssistance('human_oversight'), 1000);
                      setTimeout(() => getAiAssistance('transparency'), 2000);
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {aiLoading ? 'Analyzing...' : 'Get AI Assistance'}
                    {aiLoading && <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-500" />
                <h3 className="text-lg font-medium">Documentation Requirements</h3>
              </div>

              <p className="text-sm text-neutral-500">
                Identify and assess documentation requirements based on your system's risk profile.
              </p>

              <div className="space-y-4 p-4 border rounded-md">
                <h4 className="font-medium">EU AI Act Documentation Requirements</h4>
                
                <p className="text-sm">
                  Based on your assessment so far, the following documentation is likely required:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {[
                    {
                      name: "Technical Documentation",
                      article: "Article 11",
                      description: "Details of system architecture, capabilities, and limitations",
                      required: true
                    },
                    {
                      name: "Risk Management System",
                      article: "Article 9",
                      description: "Documentation of risk assessment and mitigation measures",
                      required: true
                    },
                    {
                      name: "Data Governance Documentation",
                      article: "Article 10",
                      description: "Documentation of data quality measures and data management",
                      required: true
                    },
                    {
                      name: "Human Oversight Protocol",
                      article: "Article 14",
                      description: "Documentation of human oversight measures",
                      required: Object.keys(responses).some(key => key.includes('human_oversight'))
                    },
                    {
                      name: "Logs and Record-Keeping",
                      article: "Article 12",
                      description: "Documentation of system activity logs and record-keeping",
                      required: Object.keys(responses).some(key => key.includes('technical_robustness'))
                    },
                    {
                      name: "Instructions for Use",
                      article: "Article 13",
                      description: "User documentation and transparency information",
                      required: true
                    },
                    {
                      name: "Conformity Assessment",
                      article: "Article 43",
                      description: "Documentation of conformity assessment procedures",
                      required: Object.keys(responses).some(key => 
                        key.includes('high_risk_categories') && 
                        responses[key] === 'Yes')
                    },
                    {
                      name: "Post-Market Monitoring",
                      article: "Article 61",
                      description: "Documentation of post-market monitoring plan",
                      required: Object.keys(responses).some(key => 
                        key.includes('high_risk_categories') && 
                        responses[key] === 'Yes')
                    },
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-md bg-neutral-50">
                      <Checkbox 
                        id={`doc-${index}`} 
                        checked={doc.required}
                        disabled={true}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={`doc-${index}`} 
                          className="font-medium flex items-center"
                        >
                          {doc.name}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {doc.article}
                          </Badge>
                        </Label>
                        <p className="text-xs text-neutral-500">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 p-4 border rounded-md">
                <h4 className="font-medium">Current Documentation Status</h4>
                
                <div className="space-y-2 mt-3">
                  {documentationFiles.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400">
                      <p>No documentation files added yet</p>
                    </div>
                  ) : (
                    documentationFiles.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-neutral-500" />
                          <span>{doc.name}</span>
                        </div>
                        <Badge variant={doc.uploaded ? "outline" : "secondary"}>
                          {doc.uploaded ? "Uploaded" : "Pending"}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      setDocumentationFiles(prev => [
                        ...prev, 
                        { name: `Document_${prev.length + 1}.pdf`, uploaded: false }
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Documentation File
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2 text-green-500" />
                <h3 className="text-lg font-medium">Evidence Collection</h3>
              </div>

              <p className="text-sm text-neutral-500">
                Collect evidence demonstrating compliance with EU AI Act requirements.
              </p>

              <div className="space-y-4">
                {highlightedArticles.length > 0 ? (
                  <div className="space-y-4">
                    {highlightedArticles.map((article, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <h4 className="font-medium flex items-center">
                          {article}
                          <Badge 
                            variant="outline" 
                            className={`ml-2 ${
                              evidenceProvided[article]
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {evidenceProvided[article] ? 'Evidence Provided' : 'Evidence Required'}
                          </Badge>
                        </h4>
                        
                        <p className="text-sm text-neutral-500 mt-2">
                          {getArticleDescription(article)}
                        </p>
                        
                        <div className="mt-4 space-y-3">
                          <Label htmlFor={`evidence-${index}`}>Evidence Description</Label>
                          <Textarea 
                            id={`evidence-${index}`}
                            placeholder="Describe the evidence you have to demonstrate compliance with this article..."
                            className="h-24"
                            onChange={() => {
                              // Mark evidence as provided when user inputs text
                              setEvidenceProvided(prev => ({
                                ...prev,
                                [article]: true
                              }));
                            }}
                          />
                          
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Upload className="h-4 w-4" />
                              Upload Evidence
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-neutral-50 rounded-md border">
                    <p className="text-neutral-500">
                      No relevant articles have been identified yet. 
                      Complete more of the assessment to see relevant articles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-500" />
                <h3 className="text-lg font-medium">Assessment Results</h3>
              </div>

              {!assessmentResult ? (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-500">
                    Complete the assessment to generate results and recommendations.
                  </p>
                  
                  <div className="p-6 border rounded-md bg-neutral-50 flex flex-col items-center justify-center text-center gap-4">
                    <Button 
                      onClick={completeAssessment}
                      disabled={isAssessing}
                      className="gap-2"
                    >
                      {isAssessing ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                          Generating Assessment...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Complete Assessment
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-neutral-400">
                      This will analyze your responses and generate a comprehensive assessment report.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <Card className="overflow-hidden">
                    <CardHeader className={`
                      ${assessmentResult.riskLevel === 'High' ? 'bg-red-50 border-b border-red-100' :
                        assessmentResult.riskLevel === 'Limited' ? 'bg-amber-50 border-b border-amber-100' :
                        assessmentResult.riskLevel === 'Minimal' ? 'bg-green-50 border-b border-green-100' :
                        'bg-red-50 border-b border-red-100'}
                    `}>
                      <CardTitle className="flex items-center justify-between">
                        <span>Assessment Summary</span>
                        <Badge className={`
                          ${assessmentResult.riskLevel === 'High' ? 'bg-red-600' :
                            assessmentResult.riskLevel === 'Limited' ? 'bg-amber-600' :
                            assessmentResult.riskLevel === 'Minimal' ? 'bg-green-600' :
                            'bg-red-600'}
                        `}>
                          {assessmentResult.riskLevel} Risk
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Assessment ID: {assessmentResult.assessmentId} | Date: {assessmentResult.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-neutral-700">Overall Compliance Score</h4>
                          <div className="flex items-center gap-2">
                            <Progress value={assessmentResult.overallScore} className="h-2" />
                            <span className="text-sm font-medium">
                              {Math.round(assessmentResult.overallScore)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-neutral-700">Assessor</h4>
                          <p className="text-sm">{assessmentResult.assessor}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-neutral-700">System ID</h4>
                          <p className="text-sm">{assessmentResult.systemId || 'Manual Assessment'}</p>
                        </div>
                      </div>
                      
                      {assessmentResult.prohibitedUse && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md mt-4">
                          <h4 className="text-sm font-medium text-red-800 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Prohibited Use Detected
                          </h4>
                          <p className="text-xs text-red-700 mt-1">
                            {assessmentResult.prohibitedJustification || 
                              'This system falls under prohibited use cases as defined in Article 5 of the EU AI Act.'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Category Scores */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Category Compliance Scores</CardTitle>
                      <CardDescription>
                        Breakdown of compliance scores across assessment categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(assessmentResult.categoryScores).map(([category, score], index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{category}</span>
                              <span className="text-sm">{Math.round(score)}%</span>
                            </div>
                            <Progress 
                              value={score} 
                              className={`h-2 ${
                                score >= 75 ? 'bg-green-600' :
                                score >= 50 ? 'bg-amber-500' :
                                'bg-red-600'
                              }`} 
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Relevant Articles */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Relevant EU AI Act Articles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {assessmentResult.relevantArticles.length > 0 ? (
                          <ul className="space-y-2">
                            {assessmentResult.relevantArticles.map((article, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span>{article}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-neutral-500">No specific articles identified.</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Required Documentation */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Required Documentation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {assessmentResult.requiredDocumentation.length > 0 ? (
                          <ul className="space-y-2">
                            {assessmentResult.requiredDocumentation.map((doc, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <FileText className="h-4 w-4 mt-0.5 text-primary" />
                                <span className="text-sm">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-neutral-500">No specific documentation required.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Compliance Gaps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Identified Compliance Gaps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assessmentResult.complianceGaps.length > 0 ? (
                        <div className="space-y-2">
                          {assessmentResult.complianceGaps.map((gap, index) => (
                            <div key={index} className="flex items-start p-2 border rounded-md">
                              <AlertCircle className="h-4 w-4 mt-0.5 mr-2 text-amber-500" />
                              <span className="text-sm">{gap}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-500">No significant compliance gaps identified.</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assessmentResult.recommendations.length > 0 ? (
                        <div className="space-y-2">
                          {assessmentResult.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start p-2 border rounded-md">
                              <LightbulbIcon className="h-4 w-4 mt-0.5 mr-2 text-amber-500" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-500">No specific recommendations at this time.</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Next Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assessmentResult.nextSteps.length > 0 ? (
                        <div className="space-y-2">
                          {assessmentResult.nextSteps.map((step, index) => (
                            <div key={index} className="flex items-start p-2 border rounded-md">
                              <ArrowRight className="h-4 w-4 mt-0.5 mr-2 text-primary" />
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-500">No specific next steps at this time.</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-center mt-4">
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" />
                      Export Assessment Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="flex justify-between border-t p-4 bg-neutral-50">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevTab}
            disabled={activeTab === tabs[0].id}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={saveDraft}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>
        
        <Button
          onClick={handleNextTab}
          disabled={activeTab === tabs[tabs.length - 1].id && !assessmentResult}
          className="gap-1"
        >
          {activeTab === tabs[tabs.length - 1].id && !assessmentResult ? (
            <>Complete Assessment</>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function for article descriptions
function getArticleDescription(article: string): string {
  const articleDescriptions: Record<string, string> = {
    'Article 5': 'Prohibited AI practices including subliminal manipulation, exploitation of vulnerabilities, social scoring, and certain uses of biometric identification.',
    'Article 6': 'Classification of AI systems as high-risk according to specific criteria in the regulation.',
    'Article 7': 'Amendment of high-risk AI system categories in Annex III through delegated acts.',
    'Article 9': 'Risk management system requirements for high-risk AI systems.',
    'Article 10': 'Data governance and data quality requirements for training, validation, and testing datasets.',
    'Article 11': 'Technical documentation requirements for high-risk AI systems.',
    'Article 12': 'Record-keeping and logging requirements for high-risk AI systems.',
    'Article 13': 'Transparency and information provision requirements for AI systems.',
    'Article 14': 'Human oversight requirements ensuring effective oversight of high-risk AI systems.',
    'Article 15': 'Requirements for accuracy, robustness, and cybersecurity of high-risk AI systems.',
    'Article 17': 'Quality management system requirements for providers of high-risk AI systems.',
    'Article 29': 'Requirements for users of high-risk AI systems regarding monitoring and oversight.',
    'Article 43': 'Conformity assessment procedures for high-risk AI systems.',
    'Article 52': 'Transparency obligations for certain AI systems, including emotion recognition and biometric categorization.',
    'Article 61': 'Post-market monitoring requirements for providers of high-risk AI systems.',
    'Annex III': 'List of high-risk AI systems referred to in Article 6(2).'
  };
  
  return articleDescriptions[article] || 'Specific requirements related to AI system compliance under the EU AI Act.';
}

// Add a Plus icon since we're using it in the UI
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
    </svg>
  );
}

// Add an Upload icon since we're using it in the UI
function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  );
}