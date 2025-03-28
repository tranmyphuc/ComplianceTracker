import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  HelpCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  DatabaseIcon,
  UsersIcon,
  BookOpenIcon,
  FileTextIcon,
  ShieldIcon,
  CheckCircleIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import RiskAssessmentAssistant from './risk-assessment-assistant';

// Types
interface Question {
  id: string;
  type: string;
  label: string;
  explanation?: string;
  options?: { value: string; label: string }[];
  tooltip: string;
  articleLink?: string;
  articleName?: string;
}

interface Step {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: any;
  legislation?: string;
  questions: Question[];
}

// Reuse the existing steps from interactive-wizard.tsx
const STEPS = [
  {
    id: 'purpose',
    title: 'System Purpose & Context',
    description: 'What is the purpose of your AI system?',
    longDescription: 'Understanding your AI system\'s purpose and application domain is the first step in determining its risk level under the EU AI Act. This information helps establish the context for subsequent assessment steps and identifies potential domain-specific risk factors.',
    icon: InfoIcon,
    legislation: 'Article 85 of the EU AI Act requires providers to register AI systems and provide basic information about their purpose and functionality.',
    questions: [
      {
        id: 'systemPurpose',
        type: 'textarea',
        label: 'Describe the purpose and functionality of your AI system',
        explanation: 'A clear description helps regulatory authorities understand what your AI system does, its intended use cases, and its potential impact on users and stakeholders.',
        tooltip: 'Provide details about what your AI system is designed to do and its primary functions',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-10-data-and-data-governance/',
        articleName: 'Article 10'
      },
      {
        id: 'usageDomain',
        type: 'radio',
        label: 'Which domain will this AI system be used in?',
        explanation: 'The domain of application is crucial for risk assessment as the EU AI Act imposes specific requirements for systems used in sensitive domains such as healthcare, education, and law enforcement.',
        options: [
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'education', label: 'Education' },
          { value: 'legal', label: 'Legal & Law Enforcement' },
          { value: 'finance', label: 'Financial Services' },
          { value: 'hr', label: 'Human Resources' },
          { value: 'infrastructure', label: 'Critical Infrastructure' },
          { value: 'other', label: 'Other' }
        ],
        tooltip: 'Domain selection helps determine applicable risk categories under the EU AI Act',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-6-classification-rules-for-high-risk-ai-systems/',
        articleName: 'Article 6'
      }
    ]
  },
  {
    id: 'prohibited',
    title: 'Prohibited AI Practices',
    description: 'Check for prohibited practices under EU AI Act Article 5',
    longDescription: 'The EU AI Act strictly prohibits certain AI applications that are deemed incompatible with EU values and fundamental rights. This step helps identify whether your system employs any practices that would be categorically prohibited under Article 5.',
    icon: AlertTriangleIcon,
    legislation: 'Article 5 of the EU AI Act outlines specific AI practices that are prohibited due to their unacceptable risk to individuals\' rights and safety.',
    questions: [
      {
        id: 'manipulationCheck',
        type: 'radio',
        label: "Does your AI system use subliminal techniques to manipulate a person's behavior in a manner that causes or is likely to cause harm?",
        explanation: "Subliminal techniques operate below the threshold of consciousness and can manipulate behavior without the person's awareness. The EU AI Act prohibits such techniques when they cause harm.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'Any system using deceptive techniques to manipulate behavior causing harm is prohibited',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-5-prohibited-artificial-intelligence-practices/',
        articleName: 'Article 5'
      },
      {
        id: 'vulnerabilitiesCheck',
        type: 'radio',
        label: 'Does your system exploit vulnerabilities of specific groups of persons due to their age, disability, or socioeconomic situation?',
        explanation: "The EU AI Act specifically protects vulnerable individuals from exploitation by AI systems. Systems that target vulnerabilities of specific groups to distort behavior are prohibited.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'Systems targeting vulnerable groups to materially distort behavior are prohibited',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-5-prohibited-artificial-intelligence-practices/',
        articleName: 'Article 5'
      },
      {
        id: 'socialScoringCheck',
        type: 'radio',
        label: 'Does your system perform social scoring by public authorities?',
        explanation: "Social scoring systems evaluate citizens based on behavior or characteristics. The EU AI Act prohibits systems that allow public authorities to evaluate people's trustworthiness based on social behavior or predicted personal characteristics.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'General purpose social scoring of individuals by public authorities is prohibited',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-5-prohibited-artificial-intelligence-practices/',
        articleName: 'Article 5'
      },
      {
        id: 'biometricIdCheck',
        type: 'radio',
        label: 'Does your system use real-time remote biometric identification in publicly accessible spaces for law enforcement?',
        explanation: "Real-time biometric identification in public spaces for law enforcement is a significant privacy concern. The EU AI Act generally prohibits this practice with only narrow exceptions for specific serious crimes.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'With limited exceptions, real-time remote biometric identification in public spaces for law enforcement is prohibited',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-5-prohibited-artificial-intelligence-practices/',
        articleName: 'Article 5'
      }
    ]
  },
  {
    id: 'high-risk',
    title: 'High-Risk Assessment',
    description: 'Determine if your AI system falls under high-risk categories (Annex III)',
    longDescription: 'Annex III of the EU AI Act identifies specific categories of AI systems that are considered high-risk and subject to more stringent regulatory requirements. This step helps determine if your system falls into one of these high-risk categories.',
    icon: AlertCircleIcon,
    legislation: 'Annex III of the EU AI Act specifies the categories of AI systems that are considered high-risk and require compliance with Articles 8-15.',
    questions: [
      {
        id: 'biometricIdentification',
        type: 'radio',
        label: 'Is your system used for biometric identification or categorization of natural persons?',
        explanation: "Biometric identification systems analyze physical, physiological or behavioral characteristics to identify individuals. The EU AI Act classifies these as high-risk due to their potential privacy implications.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems for biometric identification are considered high-risk under Annex III',
        articleLink: 'https://artificialintelligenceact.eu/the-act/annex-iii-high-risk-ai-systems-referred-to-in-article-62/',
        articleName: 'Annex III'
      },
      {
        id: 'criticalInfrastructure',
        type: 'radio',
        label: 'Is your system a component of critical infrastructure (e.g., water, gas, electricity, transport)?',
        explanation: "AI systems that manage or make decisions affecting critical infrastructure can impact essential services and public safety. The EU AI Act considers these high-risk due to their potential societal impact.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'AI systems used in critical infrastructure management are considered high-risk',
        articleLink: 'https://artificialintelligenceact.eu/the-act/annex-iii-high-risk-ai-systems-referred-to-in-article-62/',
        articleName: 'Annex III'
      },
      {
        id: 'educationTraining',
        type: 'radio',
        label: 'Is your system used for determining access to educational institutions or assessing students?',
        explanation: "AI systems used in educational settings can significantly impact students' futures and career opportunities. The EU AI Act classifies these as high-risk because of their potential to affect equal access to education.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems for educational or vocational assessment are considered high-risk',
        articleLink: 'https://artificialintelligenceact.eu/the-act/annex-iii-high-risk-ai-systems-referred-to-in-article-62/',
        articleName: 'Annex III'
      },
      {
        id: 'employmentHR',
        type: 'radio',
        label: 'Is your system used for recruitment, HR decisions, or evaluating employees?',
        explanation: "AI systems in HR and employment can significantly affect individuals' livelihoods and career opportunities. The EU AI Act classifies these as high-risk due to potential discrimination risks and impact on labor rights.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems for employment, worker management, or access to self-employment are high-risk',
        articleLink: 'https://artificialintelligenceact.eu/the-act/annex-iii-high-risk-ai-systems-referred-to-in-article-62/',
        articleName: 'Annex III'
      },
      {
        id: 'essentialServices',
        type: 'radio',
        label: 'Is your system used to evaluate access to essential services (credit scoring, social benefits, emergency services)?',
        explanation: "AI systems that determine access to essential services directly impact individuals' basic needs and rights. The EU AI Act designates these as high-risk because limited access to services like healthcare, public benefits, or emergency services can have severe consequences.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems affecting access to essential private or public services are high-risk',
        articleLink: 'https://artificialintelligenceact.eu/the-act/annex-iii-high-risk-ai-systems-referred-to-in-article-62/',
        articleName: 'Annex III'
      }
    ]
  },
  {
    id: 'data-governance',
    title: 'Data Governance',
    description: 'Assess data practices for your AI system',
    longDescription: 'Data governance is a critical component of AI compliance under the EU AI Act. This step examines your data management practices to ensure training data is representative, free from bias, and handles personal data appropriately.',
    icon: DatabaseIcon,
    legislation: 'Article 10 of the EU AI Act mandates data governance measures including quality criteria for training data, relevant design choices, and data processing techniques.',
    questions: [
      {
        id: 'dataQuality',
        type: 'radio',
        label: 'Are data quality criteria established for training, validation, and testing datasets?',
        explanation: "The EU AI Act requires high-risk AI systems to be trained on data that meets quality criteria to ensure accuracy and reliability. This includes having clear processes for identifying and managing data deficiencies, biases, and gaps.",
        options: [
          { value: 'yes', label: 'Yes, comprehensive criteria are established' },
          { value: 'partial', label: 'Partially implemented' },
          { value: 'no', label: 'No criteria established' }
        ],
        tooltip: 'Article 10 requires appropriate data governance and management practices',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-10-data-and-data-governance/',
        articleName: 'Article 10'
      },
      {
        id: 'biasMitigation',
        type: 'radio',
        label: 'Are there measures to identify and mitigate possible biases in datasets?',
        explanation: "Bias in AI systems can lead to discriminatory outcomes. The EU AI Act requires providers to identify and address potential biases in training, validation, and testing datasets to ensure fairness and prevent discrimination against protected groups.",
        options: [
          { value: 'yes', label: 'Yes, comprehensive measures exist' },
          { value: 'partial', label: 'Basic measures exist' },
          { value: 'no', label: 'No measures exist' }
        ],
        tooltip: 'Article 10 requires examination for possible biases that could lead to discrimination',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-10-data-and-data-governance/',
        articleName: 'Article 10'
      },
      {
        id: 'dataGovernance',
        type: 'textarea',
        label: 'Describe your data governance and management practices',
        explanation: "Comprehensive data governance is essential for AI compliance. Providers must document their data sources, collection methodologies, processing techniques, and protection measures to ensure transparency and accountability throughout the AI system's lifecycle.",
        tooltip: 'Include information on data sources, collection, processing, and protection measures',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-10-data-and-data-governance/',
        articleName: 'Article 10'
      }
    ]
  },
  {
    id: 'human-oversight',
    title: 'Human Oversight',
    description: 'Assess human oversight measures for your AI system',
    longDescription: 'Human oversight is a fundamental requirement for high-risk AI systems under the EU AI Act. This step evaluates whether your system has adequate measures for humans to monitor, understand, and intervene in the operation of AI systems when necessary.',
    icon: UsersIcon,
    legislation: 'Article 14 of the EU AI Act requires human oversight measures to minimize risks to health, safety, and fundamental rights.',
    questions: [
      {
        id: 'oversightMeasures',
        type: 'radio',
        label: 'What level of human oversight is implemented for your AI system?',
        explanation: "Human oversight is a cornerstone of the EU AI Act to ensure AI systems remain under human control. The appropriate level of oversight depends on the system's risk level and application context, with high-risk AI systems requiring more comprehensive human monitoring.",
        options: [
          { value: 'continuous', label: 'Continuous human oversight (human-in-the-loop)' },
          { value: 'periodic', label: 'Periodic human review and intervention capability' },
          { value: 'limited', label: 'Limited oversight for exceptional cases only' },
          { value: 'none', label: 'No human oversight implemented' }
        ],
        tooltip: "Article 14 requires human oversight measures appropriate to the system's risk level",
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-14-human-oversight/',
        articleName: 'Article 14'
      },
      {
        id: 'interventionCapability',
        type: 'radio',
        label: 'Can humans intervene or interrupt system operation when necessary?',
        explanation: "The EU AI Act requires high-risk AI systems to include mechanisms that allow humans to safely interrupt operations. This 'stop button' functionality ensures that AI systems can be halted if they begin operating outside of intended parameters or produce harmful outputs.",
        options: [
          { value: 'yes', label: 'Yes, comprehensive intervention capabilities exist' },
          { value: 'partial', label: 'Limited intervention capabilities exist' },
          { value: 'no', label: 'No intervention capabilities' }
        ],
        tooltip: 'Article 14 requires capabilities to intervene or interrupt AI systems through a "stop" button or similar procedure',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-14-human-oversight/',
        articleName: 'Article 14'
      },
      {
        id: 'oversightProcedures',
        type: 'textarea',
        label: 'Describe your human oversight procedures and mechanisms',
        explanation: "Effective human oversight requires documented procedures and clearly defined roles. The EU AI Act expects providers of high-risk AI systems to establish protocols for monitoring system performance, detecting anomalies, and assigning oversight responsibilities to qualified personnel.",
        tooltip: 'Include details on monitoring practices, intervention protocols, and oversight responsibilities',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-14-human-oversight/',
        articleName: 'Article 14'
      }
    ]
  },
  {
    id: 'technical-documentation',
    title: 'Technical Documentation',
    description: 'Confirm documentation requirements',
    longDescription: 'The EU AI Act requires comprehensive technical documentation for high-risk AI systems. This step helps ensure you understand and can prepare the required documentation to demonstrate compliance.',
    icon: FileTextIcon,
    legislation: 'Article 11 and Annex IV of the EU AI Act detail the technical documentation requirements for high-risk AI systems.',
    questions: [
      {
        id: 'docSystemDesign',
        type: 'radio',
        label: 'Do you have documentation describing the system design and development process?',
        explanation: "Technical documentation must include a detailed description of the system's design, development methodology, and architecture. This helps regulators understand how the system was built and assess compliance.",
        options: [
          { value: 'yes', label: 'Yes, comprehensive documentation exists' },
          { value: 'partial', label: 'Partial documentation exists' },
          { value: 'no', label: 'No documentation exists' },
          { value: 'planned', label: 'Documentation is planned but not yet created' }
        ],
        tooltip: 'Article 11 requires technical documentation describing system design and architecture',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-11-technical-documentation/',
        articleName: 'Article 11'
      },
      {
        id: 'docRiskManagement',
        type: 'radio',
        label: 'Do you have risk management documentation that identifies and analyzes foreseeable risks?',
        explanation: "Risk management documentation must identify known and foreseeable risks, describe risk assessment methods, and document mitigation measures. This is essential for demonstrating a systematic approach to risk.",
        options: [
          { value: 'yes', label: 'Yes, comprehensive risk documentation exists' },
          { value: 'partial', label: 'Basic risk documentation exists' },
          { value: 'no', label: 'No risk documentation exists' },
          { value: 'planned', label: 'Documentation is planned but not yet created' }
        ],
        tooltip: 'Article 9 requires risk management documentation including foreseeable risks and mitigations',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-9-risk-management-system/',
        articleName: 'Article 9'
      },
      {
        id: 'docPerformanceMetrics',
        type: 'radio',
        label: 'Do you have documentation of performance metrics and testing procedures?',
        explanation: "The EU AI Act requires documentation of metrics used to measure system performance, accuracy, robustness, and security. This includes test results, validation procedures, and performance evaluations against defined metrics.",
        options: [
          { value: 'yes', label: 'Yes, performance metrics are well-documented' },
          { value: 'partial', label: 'Some performance metrics are documented' },
          { value: 'no', label: 'No performance documentation exists' },
          { value: 'planned', label: 'Documentation is planned but not yet created' }
        ],
        tooltip: 'Annex IV requires documentation of metrics, testing procedures, and performance evaluation',
        articleLink: 'https://artificialintelligenceact.eu/the-act/annex-iv-technical-documentation-referred-to-in-article-11/',
        articleName: 'Annex IV'
      }
    ]
  },
  {
    id: 'risk-mitigation',
    title: 'Risk Mitigation Measures',
    description: 'Identify risk control measures',
    longDescription: 'Implementing appropriate risk mitigation measures is essential for EU AI Act compliance. This step helps identify the controls you have in place or need to implement to address identified risks.',
    icon: ShieldIcon,
    legislation: 'Articles 9 and 15 of the EU AI Act require appropriate risk mitigation measures and technical safeguards for high-risk AI systems.',
    questions: [
      {
        id: 'mitigationAccuracy',
        type: 'radio',
        label: 'What measures are in place to ensure accuracy, robustness, and cybersecurity?',
        explanation: "AI systems must be designed to perform consistently and accurately across different scenarios and be resilient against attempts to exploit vulnerabilities. The EU AI Act requires technical measures to ensure these characteristics.",
        options: [
          { value: 'comprehensive', label: 'Comprehensive measures across all aspects' },
          { value: 'partial', label: 'Some measures implemented' },
          { value: 'minimal', label: 'Minimal or basic measures only' },
          { value: 'none', label: 'No specific measures implemented' }
        ],
        tooltip: 'Article 15 requires measures to ensure accuracy, robustness, and cybersecurity',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-15-accuracy-robustness-and-cybersecurity/',
        articleName: 'Article 15'
      },
      {
        id: 'mitigationTransparency',
        type: 'radio',
        label: 'What transparency measures are implemented for system users?',
        explanation: "Transparency is essential for users to understand an AI system's capabilities and limitations. The EU AI Act requires appropriate transparency measures, including instructions for use, specifications of input data, and information about system performance.",
        options: [
          { value: 'comprehensive', label: 'Comprehensive user documentation and transparency' },
          { value: 'partial', label: 'Basic user documentation exists' },
          { value: 'minimal', label: 'Minimal user information provided' },
          { value: 'none', label: 'No specific transparency measures' }
        ],
        tooltip: 'Article 13 requires transparency measures including instructions for use',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-13-transparency-and-provision-of-information-to-users/',
        articleName: 'Article 13'
      },
      {
        id: 'mitigationMonitoring',
        type: 'radio',
        label: 'What post-market monitoring systems are in place?',
        explanation: "Post-market monitoring is required to detect issues after deployment. The EU AI Act requires high-risk AI providers to implement systems for collecting and analyzing data about performance and incidents in real-world use.",
        options: [
          { value: 'comprehensive', label: 'Comprehensive monitoring and feedback systems' },
          { value: 'partial', label: 'Basic monitoring capabilities' },
          { value: 'planned', label: 'Monitoring system planned but not implemented' },
          { value: 'none', label: 'No post-market monitoring' }
        ],
        tooltip: 'Article 61 requires post-market monitoring systems for high-risk AI systems',
        articleLink: 'https://artificialintelligenceact.eu/the-act/article-61-post-market-monitoring-system/',
        articleName: 'Article 61'
      }
    ]
  }
];

export function EnhancedRiskWizard() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showArticleContent, setShowArticleContent] = useState<{open: boolean, url: string, title: string}>({
    open: false,
    url: '',
    title: ''
  });
  
  // References for scrolling
  const topRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Progress calculation
  const totalQuestions = STEPS.reduce((acc, step) => acc + step.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  // Scroll to top when changing steps
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep]);

  // Handle input changes
  const handleInputChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Jump to a specific step
  const jumpToStep = (index: number) => {
    if (index >= 0 && index < STEPS.length) {
      setCurrentStep(index);
    }
  };

  // Submit assessment
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // You can add validation here if needed
      
      // Submit answers to API
      const response = await fetch('/api/risk-assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      const result = await response.json();

      // Show success toast
      toast({
        title: t('riskAssessment.wizard.submitSuccess', 'Assessment Submitted'),
        description: t('riskAssessment.wizard.submitDescription', 'Your risk assessment has been successfully submitted.'),
        variant: 'default',
      });

      // Redirect to results page
      window.location.href = `/risk-assessment/results?assessmentId=${result.assessmentId}&systemId=${result.systemId}`;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: t('riskAssessment.wizard.submitError', 'Submission Error'),
        description: t('riskAssessment.wizard.submitErrorDescription', 'There was an error submitting your assessment. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle AI assistant action
  const handleAssistantAction = (action: AssistantAction) => {
    const { type: actionType, data } = action;
    if (actionType === 'jump_to_step' && typeof data?.stepIndex === 'number') {
      jumpToStep(data.stepIndex);
    } else if (actionType === 'focus_question' && data?.questionId) {
      // Focus on a specific question
      if (questionRefs.current[data.questionId]) {
        questionRefs.current[data.questionId]?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Open article content dialog
  const openArticleContent = (url: string, title: string) => {
    setShowArticleContent({
      open: true,
      url,
      title
    });
  };

  // Determine if current step is complete
  const isStepComplete = (stepIndex: number) => {
    const step = STEPS[stepIndex];
    return step.questions.every(q => answers[q.id] !== undefined);
  };

  // Current step details
  const currentStepData = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const Icon = currentStepData.icon;

  // Render questions based on type
  const renderQuestion = (question: Question, index: number) => {
    return (
      <div 
        key={question.id} 
        className="mb-8 p-4 border border-border rounded-lg hover:border-primary/50 transition-all"
        ref={el => { questionRefs.current[question.id] = el; }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className="text-sm bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div>
              <Label htmlFor={question.id} className="text-base font-medium">
                {question.label}
              </Label>
              {question.explanation && (
                <p className="text-sm text-muted-foreground mt-1 mb-4">{question.explanation}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircleIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{question.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {question.articleLink && question.articleName && (
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs"
                onClick={() => openArticleContent(question.articleLink!, question.articleName!)}
              >
                <BookOpenIcon className="h-3 w-3 mr-1" />
                {question.articleName}
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          {question.type === 'radio' && question.options && (
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={(value) => handleInputChange(question.id, value)}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`} className="flex-grow cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'textarea' && (
            <Textarea
              id={question.id}
              value={answers[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={t('riskAssessment.wizard.typeHere', 'Type your answer here...')}
              rows={5}
              className="w-full"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={topRef}>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            {t('riskAssessment.wizard.step', 'Step')} {currentStep + 1} {t('riskAssessment.wizard.of', 'of')} {STEPS.length}
          </div>
          <div className="text-sm font-medium">
            {progressPercentage}% {t('riskAssessment.wizard.complete', 'complete')}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        
        {/* Step navigation tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar">
          {STEPS.map((step, index) => (
            <Button
              key={step.id}
              variant={index === currentStep ? "default" : "outline"}
              size="sm"
              className={`min-w-max ${
                isStepComplete(index) 
                  ? "border-green-500 dark:border-green-700" 
                  : ""
              }`}
              onClick={() => jumpToStep(index)}
            >
              {isStepComplete(index) && (
                <CheckIcon className="h-3.5 w-3.5 mr-1 text-green-500" />
              )}
              {step.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Step content card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {currentStepData.longDescription && (
              <Alert className="mb-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>{t('riskAssessment.wizard.aboutThisStep', 'About this step')}</AlertTitle>
                <AlertDescription>
                  {currentStepData.longDescription}
                </AlertDescription>
              </Alert>
            )}
            
            {currentStepData.legislation && (
              <div className="text-sm text-muted-foreground mb-6 p-3 bg-muted/50 rounded-lg border border-border">
                <div className="font-medium mb-1">{t('riskAssessment.wizard.legalRequirement', 'Legal Requirement')}:</div>
                {currentStepData.legislation}
              </div>
            )}
            
            <div className="space-y-4">
              {currentStepData.questions.map((question, index) => 
                renderQuestion(question, index)
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              {t('riskAssessment.wizard.previous', 'Previous')}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('riskAssessment.wizard.submitting', 'Submitting...')}
                </>
              ) : (
                <>
                  {isLastStep 
                    ? t('riskAssessment.wizard.submit', 'Submit Assessment')
                    : t('riskAssessment.wizard.next', 'Next')}
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Assistant panel */}
        <div className="hidden lg:block">
          <div className="sticky top-4">
            <RiskAssessmentAssistant 
              context="wizard" 
              onSuggestAction={handleAssistantAction}
              className="h-[600px]"
            />
          </div>
        </div>
        
        {/* Mobile assistant trigger */}
        <div className="lg:hidden fixed bottom-4 right-4 z-10">
          <Button 
            onClick={() => setShowAssistant(true)}
            className="rounded-full h-12 w-12 shadow-lg"
          >
            <HelpCircleIcon className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Mobile assistant sheet */}
        <Sheet open={showAssistant} onOpenChange={setShowAssistant}>
          <SheetContent side="bottom" className="h-[80vh] p-0">
            <SheetHeader className="px-4 py-2 border-b">
              <SheetTitle>{t('riskAssessment.assistant.title', 'Risk Assessment Assistant')}</SheetTitle>
              <SheetDescription>
                {t('riskAssessment.assistant.description', 'Get help with your risk assessment')}
              </SheetDescription>
            </SheetHeader>
            <div className="p-0">
              <RiskAssessmentAssistant 
                context="wizard" 
                onSuggestAction={handleAssistantAction}
                className="h-[calc(80vh-64px)] border-none shadow-none"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Article content sheet */}
      <Sheet 
        open={showArticleContent.open} 
        onOpenChange={(open) => setShowArticleContent(prev => ({...prev, open}))}
      >
        <SheetContent side="right" className="sm:max-w-lg w-full overflow-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>{showArticleContent.title}</SheetTitle>
            <SheetDescription>
              EU AI Act Reference
            </SheetDescription>
          </SheetHeader>
          
          <div className="h-full">
            <iframe 
              src={showArticleContent.url} 
              className="w-full h-[calc(100vh-150px)]"
              title={showArticleContent.title}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}