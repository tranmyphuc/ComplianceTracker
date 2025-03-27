
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  InfoIcon, 
  AlertTriangleIcon, 
  HelpCircleIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon,
  AlertCircleIcon,
  BookOpenIcon,
  ChevronRightIcon,
  DatabaseIcon,
  UsersIcon,
  CheckIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

// Types
interface Question {
  id: string;
  type: string;
  label: string;
  explanation?: string;
  options?: { value: string; label: string }[];
  tooltip: string;
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

// Risk assessment wizard steps
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
        tooltip: 'Provide details about what your AI system is designed to do and its primary functions'
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
        tooltip: 'Domain selection helps determine applicable risk categories under the EU AI Act'
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
        tooltip: 'Any system using deceptive techniques to manipulate behavior causing harm is prohibited'
      },
      {
        id: 'vulnerabilitiesCheck',
        type: 'radio',
        label: 'Does your system exploit vulnerabilities of specific groups of persons due to their age, disability, or socioeconomic situation?',
        explanation: "The EU AI Act specifically protects vulnerable individuals from exploitation by AI systems. Systems that target vulnerabilities of specific groups to distort behavior are prohibited.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'Systems targeting vulnerable groups to materially distort behavior are prohibited'
      },
      {
        id: 'socialScoringCheck',
        type: 'radio',
        label: 'Does your system perform social scoring by public authorities?',
        explanation: "Social scoring systems evaluate citizens based on behavior or characteristics. The EU AI Act prohibits systems that allow public authorities to evaluate people's trustworthiness based on social behavior or predicted personal characteristics.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'General purpose social scoring of individuals by public authorities is prohibited'
      },
      {
        id: 'biometricIdCheck',
        type: 'radio',
        label: 'Does your system use real-time remote biometric identification in publicly accessible spaces for law enforcement?',
        explanation: "Real-time biometric identification in public spaces for law enforcement is a significant privacy concern. The EU AI Act generally prohibits this practice with only narrow exceptions for specific serious crimes.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'With limited exceptions, real-time remote biometric identification in public spaces for law enforcement is prohibited'
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
        tooltip: 'Systems for biometric identification are considered high-risk under Annex III'
      },
      {
        id: 'criticalInfrastructure',
        type: 'radio',
        label: 'Is your system a component of critical infrastructure (e.g., water, gas, electricity, transport)?',
        explanation: "AI systems that manage or make decisions affecting critical infrastructure can impact essential services and public safety. The EU AI Act considers these high-risk due to their potential societal impact.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'AI systems used in critical infrastructure management are considered high-risk'
      },
      {
        id: 'educationTraining',
        type: 'radio',
        label: 'Is your system used for determining access to educational institutions or assessing students?',
        explanation: "AI systems used in educational settings can significantly impact students' futures and career opportunities. The EU AI Act classifies these as high-risk because of their potential to affect equal access to education.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems for educational or vocational assessment are considered high-risk'
      },
      {
        id: 'employmentHR',
        type: 'radio',
        label: 'Is your system used for recruitment, HR decisions, or evaluating employees?',
        explanation: "AI systems in HR and employment can significantly affect individuals' livelihoods and career opportunities. The EU AI Act classifies these as high-risk due to potential discrimination risks and impact on labor rights.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems for employment, worker management, or access to self-employment are high-risk'
      },
      {
        id: 'essentialServices',
        type: 'radio',
        label: 'Is your system used to evaluate access to essential services (credit scoring, social benefits, emergency services)?',
        explanation: "AI systems that determine access to essential services directly impact individuals' basic needs and rights. The EU AI Act designates these as high-risk because limited access to services like healthcare, public benefits, or emergency services can have severe consequences.",
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems affecting access to essential private or public services are high-risk'
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
        tooltip: 'Article 10 requires appropriate data governance and management practices'
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
        tooltip: 'Article 10 requires examination for possible biases that could lead to discrimination'
      },
      {
        id: 'dataGovernance',
        type: 'textarea',
        label: 'Describe your data governance and management practices',
        explanation: "Comprehensive data governance is essential for AI compliance. Providers must document their data sources, collection methodologies, processing techniques, and protection measures to ensure transparency and accountability throughout the AI system's lifecycle.",
        tooltip: 'Include information on data sources, collection, processing, and protection measures'
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
        tooltip: "Article 14 requires human oversight measures appropriate to the system's risk level"
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
        tooltip: 'Article 14 requires capabilities to intervene or interrupt AI systems through a "stop" button or similar procedure'
      },
      {
        id: 'oversightProcedures',
        type: 'textarea',
        label: 'Describe your human oversight procedures and mechanisms',
        explanation: "Effective human oversight requires documented procedures and clearly defined roles. The EU AI Act expects providers of high-risk AI systems to establish protocols for monitoring system performance, detecting anomalies, and assigning oversight responsibilities to qualified personnel.",
        tooltip: 'Include details on monitoring practices, intervention protocols, and oversight responsibilities'
      }
    ]
  }
];

export function InteractiveRiskWizard() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [prohibitedDetected, setProhibitedDetected] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'info'>('questions');

  // Handle response changes
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Check for prohibited practices after step 2 (prohibited practices check)
    if (currentStep === 1) {
      const hasProhibited = 
        value === 'yes' || 
        responses.manipulationCheck === 'yes' || 
        responses.vulnerabilitiesCheck === 'yes' || 
        responses.socialScoringCheck === 'yes' || 
        responses.biometricIdCheck === 'yes';
      
      setProhibitedDetected(hasProhibited);
    }
  };

  // Move to the next step
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate results
      calculateResults();
    }
  };

  // Move to the previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Calculate risk assessment results
  const calculateResults = () => {
    // Determine risk level based on responses
    let riskLevel = 'minimal';
    let riskScore = 0;
    
    // Check for prohibited practices
    if (
      responses.manipulationCheck === 'yes' ||
      responses.vulnerabilitiesCheck === 'yes' ||
      responses.socialScoringCheck === 'yes' ||
      responses.biometricIdCheck === 'yes'
    ) {
      riskLevel = 'unacceptable';
      riskScore = 100;
    } 
    // Check for high-risk categories
    else if (
      responses.biometricIdentification === 'yes' ||
      responses.criticalInfrastructure === 'yes' ||
      responses.educationTraining === 'yes' ||
      responses.employmentHR === 'yes' ||
      responses.essentialServices === 'yes'
    ) {
      riskLevel = 'high';
      riskScore = 75;
    }
    // Check for limited risk (transparency obligations)
    else if (
      responses.usageDomain === 'finance' ||
      responses.usageDomain === 'healthcare'
    ) {
      riskLevel = 'limited';
      riskScore = 40;
    }
    // Otherwise minimal risk
    else {
      riskLevel = 'minimal';
      riskScore = 15;
    }
    
    // Set results and mark assessment as complete
    setResults({
      riskLevel,
      riskScore,
      responses,
      riskFactors: getRiskFactors(),
      complianceRequirements: getComplianceRequirements(riskLevel)
    });
    
    setIsComplete(true);
  };

  // Get risk factors based on responses
  const getRiskFactors = () => {
    const factors = [];
    
    if (responses.usageDomain === 'healthcare') {
      factors.push('Healthcare domain with potential impact on patient outcomes');
    }
    
    if (responses.usageDomain === 'legal') {
      factors.push('Legal domain with potential impact on fundamental rights');
    }
    
    if (responses.biometricIdentification === 'yes') {
      factors.push('Biometric identification capabilities (Annex III)');
    }
    
    if (responses.criticalInfrastructure === 'yes') {
      factors.push('Critical infrastructure management application (Annex III)');
    }
    
    if (responses.educationTraining === 'yes') {
      factors.push('Educational or vocational training application (Annex III)');
    }
    
    if (responses.employmentHR === 'yes') {
      factors.push('Employment, worker management, or access to self-employment (Annex III)');
    }
    
    if (responses.essentialServices === 'yes') {
      factors.push('Access to essential private or public services (Annex III)');
    }
    
    return factors;
  };

  // Get compliance requirements based on risk level
  const getComplianceRequirements = (riskLevel: string) => {
    switch (riskLevel) {
      case 'unacceptable':
        return ['This AI system appears to be prohibited under Article 5 of the EU AI Act and cannot be deployed.'];
      case 'high':
        return [
          'Risk management system (Article 9)',
          'Data governance measures (Article 10)',
          'Technical documentation (Article 11)',
          'Record keeping (Article 12)',
          'Transparency for users (Article 13)',
          'Human oversight (Article 14)',
          'Accuracy, robustness, and cybersecurity (Article 15)',
          'Conformity assessment before market placement',
          'Registration in EU database of high-risk AI systems'
        ];
      case 'limited':
        return [
          'Transparency obligations (Article 52)',
          'Users must be informed they are interacting with an AI system',
          'Limited record keeping requirements',
          'Basic technical documentation'
        ];
      case 'minimal':
        return [
          'Voluntary application of requirements for high-risk systems',
          'Voluntary codes of conduct'
        ];
      default:
        return ['Unknown risk level'];
    }
  };

  // Check if all required questions for current step are answered
  const areCurrentQuestionsAnswered = () => {
    const currentQuestions = STEPS[currentStep].questions;
    
    for (const question of currentQuestions) {
      if (!responses[question.id]) {
        return false;
      }
    }
    
    return true;
  };

  // Render current step questions
  const renderQuestions = () => {
    const { questions } = STEPS[currentStep];
    const currentStepData = STEPS[currentStep];
    
    return (
      <div className="space-y-8">
        {/* Step explanation section */}
        {currentStepData.longDescription && (
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">About this step</AlertTitle>
            <AlertDescription className="text-blue-600 mt-2">
              {currentStepData.longDescription}
            </AlertDescription>
            {currentStepData.legislation && (
              <div className="mt-2 text-sm text-blue-600 border-t border-blue-100 pt-2">
                <strong>Relevant legislation:</strong> {currentStepData.legislation}
              </div>
            )}
          </Alert>
        )}
        
        {questions.map(question => (
          <div key={question.id} className="space-y-3 border border-muted rounded-lg p-4 bg-card">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <Label className="text-base font-medium">{question.label}</Label>
                {question.explanation && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {question.explanation}
                  </p>
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0 mt-1">
                      <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>{question.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {question.type === 'radio' && (
              <RadioGroup
                value={responses[question.id] || ''}
                onValueChange={value => handleResponseChange(question.id, value)}
                className="grid grid-cols-1 gap-2 mt-2"
              >
                {question.options?.map(option => (
                  <div key={option.value} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50">
                    <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                    <Label htmlFor={`${question.id}-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {question.type === 'textarea' && (
              <Textarea
                value={responses[question.id] || ''}
                onChange={e => handleResponseChange(question.id, e.target.value)}
                placeholder="Enter your response..."
                rows={4}
                className="mt-2"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    if (!results) return null;
    
    const { riskLevel, riskScore, riskFactors, complianceRequirements } = results;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Risk Assessment Results</h2>
          <p className="text-muted-foreground">Assessment completed based on your responses</p>
        </div>
        
        <div className="bg-muted p-4 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">
            {riskLevel === 'unacceptable' && 'Unacceptable Risk'}
            {riskLevel === 'high' && 'High Risk'}
            {riskLevel === 'limited' && 'Limited Risk'}
            {riskLevel === 'minimal' && 'Minimal Risk'}
          </h3>
          
          <div className="relative h-6 w-full bg-muted-foreground/20 rounded-full overflow-hidden mb-2">
            <div 
              className={`absolute top-0 left-0 h-full rounded-full ${
                riskLevel === 'unacceptable' ? 'bg-destructive' :
                riskLevel === 'high' ? 'bg-warning' :
                riskLevel === 'limited' ? 'bg-amber-400' : 'bg-green-500'
              }`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">Risk Score: {riskScore}/100</p>
        </div>
        
        {riskLevel === 'unacceptable' && (
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              This AI system appears to be prohibited under EU AI Act Article 5 and cannot be placed on the market
              or put into service in the European Union.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Risk Factors</h3>
          {riskFactors.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {riskFactors.map((factor: string, index: number) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No specific risk factors identified</p>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Compliance Requirements</h3>
          <ul className="list-disc pl-5 space-y-1">
            {complianceRequirements.map((req: string, index: number) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
          {riskLevel === 'unacceptable' ? (
            <p>Redesign your AI system to remove prohibited functionalities before proceeding with deployment.</p>
          ) : riskLevel === 'high' ? (
            <p>Complete all required documentation and implement all compliance measures for high-risk AI systems before deployment.</p>
          ) : riskLevel === 'limited' ? (
            <p>Implement transparency measures and ensure users are properly informed about interacting with your AI system.</p>
          ) : (
            <p>Consider voluntarily implementing some high-risk system requirements as best practices for your AI system.</p>
          )}
        </div>
      </div>
    );
  };

  // Progress percentage
  const progressPercentage = isComplete ? 100 : (currentStep / (STEPS.length - 1)) * 100;

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Interactive Risk Assessment Wizard</CardTitle>
        <CardDescription>
          {isComplete 
            ? 'Assessment completed. Review your results below.'
            : `Step ${currentStep + 1} of ${STEPS.length}: ${STEPS[currentStep].title}`
          }
        </CardDescription>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>
      
      <CardContent>
        {!isComplete ? (
          <>
            {/* Step Navigation Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div 
                    key={step.id}
                    className="flex flex-col items-center"
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        index < currentStep 
                          ? 'bg-primary text-primary-foreground' 
                          : index === currentStep
                            ? 'bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs font-medium text-center ${
                      index === currentStep ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-0.5 bg-muted"></div>
                </div>
                <div 
                  className="absolute inset-0 flex items-center"
                  style={{ 
                    width: `calc(${(currentStep / (STEPS.length - 1)) * 100}%)`,
                    transition: 'width 300ms ease-in-out'
                  }}
                >
                  <div className="w-full h-0.5 bg-primary"></div>
                </div>
                <div className="relative flex justify-between">
                  {STEPS.map((_, index) => (
                    <div key={index} className="w-0 h-0"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{STEPS[currentStep].title}</h3>
                  <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
                </div>
                
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'questions' | 'info')} className="w-auto">
                  <TabsList className="grid w-[180px] grid-cols-2">
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <Separator className="my-4" />
            </div>
            
            {prohibitedDetected && currentStep === 1 && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  Warning: Your responses indicate this AI system may be prohibited under Article 5 of the EU AI Act.
                  Continue the assessment for full analysis.
                </AlertDescription>
              </Alert>
            )}
            
            {activeTab === 'questions' ? renderQuestions() : (
              <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold flex items-center gap-2">
                  <BookOpenIcon className="h-4 w-4 text-blue-600" />
                  <span>EU AI Act Requirements</span>
                </h4>
                <div className="prose prose-sm max-w-none">
                  {currentStep === 0 && (
                    <div>
                      <p>The first step to compliance is clearly identifying your AI system's purpose and domain of operation. Article 85 of the EU AI Act establishes requirements for provider registration where you must specify:</p>
                      <ul>
                        <li>The purpose of the AI system</li>
                        <li>Its intended use cases</li>
                        <li>Primary functionality</li>
                        <li>Target users and domains</li>
                      </ul>
                      <p>This information helps regulatory authorities determine applicable compliance requirements based on risk categories in the Act.</p>
                    </div>
                  )}
                  
                  {currentStep === 1 && (
                    <div>
                      <p>Article 5 of the EU AI Act prohibits certain AI practices considered unacceptable risk, including:</p>
                      <ul>
                        <li>Subliminal manipulation techniques causing harm</li>
                        <li>Exploitation of vulnerabilities of specific groups</li>
                        <li>Social scoring by public authorities</li>
                        <li>Real-time remote biometric identification in public spaces (with limited exceptions)</li>
                      </ul>
                      <p>These practices are prohibited and systems employing them cannot be placed on the EU market.</p>
                    </div>
                  )}
                  
                  {currentStep === 2 && (
                    <div>
                      <p>Annex III of the EU AI Act identifies high-risk AI systems that require enhanced compliance measures:</p>
                      <ul>
                        <li>Biometric identification and categorization systems</li>
                        <li>Management of critical infrastructure</li>
                        <li>Educational/vocational training access determinants</li>
                        <li>Employment, worker management and access to self-employment</li>
                        <li>Access to essential services</li>
                        <li>Law enforcement applications</li>
                        <li>Migration, asylum and border control management</li>
                        <li>Administration of justice and democratic processes</li>
                      </ul>
                      <p>High-risk systems must meet stringent requirements in Articles 9-15.</p>
                    </div>
                  )}
                  
                  {currentStep === 3 && (
                    <div>
                      <p>Article 10 of the EU AI Act requires high-risk AI systems to implement data governance measures:</p>
                      <ul>
                        <li>Data quality criteria for training, validation, and testing datasets</li>
                        <li>Bias monitoring and mitigation procedures</li>
                        <li>Examination of potential data anomalies</li>
                        <li>Data protection and privacy compliance</li>
                      </ul>
                      <p>Proper data governance helps ensure AI systems function reliably and avoid discriminatory outcomes.</p>
                    </div>
                  )}
                  
                  {currentStep === 4 && (
                    <div>
                      <p>Article 14 requires appropriate human oversight measures for high-risk AI systems:</p>
                      <ul>
                        <li>Ability to understand system capabilities and limitations</li>
                        <li>Awareness of automation bias tendencies</li>
                        <li>Ability to correctly interpret system output</li>
                        <li>Capability to intervene or interrupt system operation via "stop" function</li>
                        <li>Clear allocation of oversight responsibilities</li>
                      </ul>
                      <p>Human oversight ensures AI systems remain under human control and can be interrupted when necessary.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          renderResults()
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!isComplete ? (
          <>
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!areCurrentQuestionsAnswered()}
            >
              {currentStep < STEPS.length - 1 ? 'Next' : 'Calculate Results'}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => {
              setIsComplete(false);
              setCurrentStep(0);
              setResponses({});
              setResults(null);
              setProhibitedDetected(false);
            }}>
              Start New Assessment
            </Button>
            <Button>Save Results</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
