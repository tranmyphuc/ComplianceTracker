
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon, HelpCircleIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Risk assessment wizard steps
const STEPS = [
  {
    id: 'purpose',
    title: 'System Purpose & Context',
    description: 'What is the purpose of your AI system?',
    questions: [
      {
        id: 'systemPurpose',
        type: 'textarea',
        label: 'Describe the purpose and functionality of your AI system',
        tooltip: 'Provide details about what your AI system is designed to do and its primary functions'
      },
      {
        id: 'usageDomain',
        type: 'radio',
        label: 'Which domain will this AI system be used in?',
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
    questions: [
      {
        id: 'manipulationCheck',
        type: 'radio',
        label: 'Does your AI system use subliminal techniques to manipulate a person's behavior in a manner that causes or is likely to cause harm?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'Any system using deceptive techniques to manipulate behavior causing harm is prohibited'
      },
      {
        id: 'vulnerabilitiesCheck',
        type: 'radio',
        label: 'Does your system exploit vulnerabilities of specific groups of persons due to their age, disability, or socioeconomic situation?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'Systems targeting vulnerable groups to materially distort behavior are prohibited'
      },
      {
        id: 'socialScoringCheck',
        type: 'radio',
        label: 'Does your system perform social scoring by public authorities?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'General purpose social scoring of individuals by public authorities is prohibited'
      },
      {
        id: 'biometricIdCheck',
        type: 'radio',
        label: 'Does your system use real-time remote biometric identification in publicly accessible spaces for law enforcement?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }],
        tooltip: 'With limited exceptions, real-time remote biometric identification in public spaces for law enforcement is prohibited'
      }
    ]
  },
  {
    id: 'high-risk',
    title: 'High-Risk Assessment',
    description: 'Determine if your AI system falls under high-risk categories (Annex III)',
    questions: [
      {
        id: 'biometricIdentification',
        type: 'radio',
        label: 'Is your system used for biometric identification or categorization of natural persons?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems for biometric identification are considered high-risk under Annex III'
      },
      {
        id: 'criticalInfrastructure',
        type: 'radio',
        label: 'Is your system a component of critical infrastructure (e.g., water, gas, electricity, transport)?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'AI systems used in critical infrastructure management are considered high-risk'
      },
      {
        id: 'educationTraining',
        type: 'radio',
        label: 'Is your system used for determining access to educational institutions or assessing students?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems for educational or vocational assessment are considered high-risk'
      },
      {
        id: 'employmentHR',
        type: 'radio',
        label: 'Is your system used for recruitment, HR decisions, or evaluating employees?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems for employment, worker management, or access to self-employment are high-risk'
      },
      {
        id: 'essentialServices',
        type: 'radio',
        label: 'Is your system used to evaluate access to essential services (credit scoring, social benefits, emergency services)?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        tooltip: 'Systems affecting access to essential private or public services are high-risk'
      }
    ]
  },
  {
    id: 'data-governance',
    title: 'Data Governance',
    description: 'Assess data practices for your AI system',
    questions: [
      {
        id: 'dataQuality',
        type: 'radio',
        label: 'Are data quality criteria established for training, validation, and testing datasets?',
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
        tooltip: 'Include information on data sources, collection, processing, and protection measures'
      }
    ]
  },
  {
    id: 'human-oversight',
    title: 'Human Oversight',
    description: 'Assess human oversight measures for your AI system',
    questions: [
      {
        id: 'oversightMeasures',
        type: 'radio',
        label: 'What level of human oversight is implemented for your AI system?',
        options: [
          { value: 'continuous', label: 'Continuous human oversight (human-in-the-loop)' },
          { value: 'periodic', label: 'Periodic human review and intervention capability' },
          { value: 'limited', label: 'Limited oversight for exceptional cases only' },
          { value: 'none', label: 'No human oversight implemented' }
        ],
        tooltip: 'Article 14 requires human oversight measures appropriate to the system's risk level'
      },
      {
        id: 'interventionCapability',
        type: 'radio',
        label: 'Can humans intervene or interrupt system operation when necessary?',
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
        tooltip: 'Include details on monitoring practices, intervention protocols, and oversight responsibilities'
      }
    ]
  }
];

export function InteractiveRiskWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [prohibitedDetected, setProhibitedDetected] = useState(false);

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
    
    return (
      <div className="space-y-8">
        {questions.map(question => (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">{question.label}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
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
                className="grid grid-cols-1 gap-2"
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
              {riskFactors.map((factor, index) => (
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
            {complianceRequirements.map((req, index) => (
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
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{STEPS[currentStep].title}</h3>
              <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
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
            
            {renderQuestions()}
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
