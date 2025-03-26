
import React, { useState } from 'react';
import { useNavigate } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertTriangle, Info, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

// Define the wizard steps and questions
const wizardSteps = [
  {
    id: 'basics',
    title: 'Basic Information',
    description: 'Let\'s start with the basic information about your AI system',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: 'What is the name of your AI system?',
        placeholder: 'e.g., Customer Support Chatbot'
      },
      {
        id: 'purpose',
        type: 'textarea',
        label: 'What is the primary purpose of this AI system?',
        placeholder: 'Describe what the system does and its main functions'
      },
      {
        id: 'department',
        type: 'text',
        label: 'Which department will use this system?',
        placeholder: 'e.g., Customer Service, HR, Finance'
      }
    ]
  },
  {
    id: 'capabilities',
    title: 'AI Capabilities',
    description: 'Tell us about the capabilities of your AI system',
    questions: [
      {
        id: 'decision_making',
        type: 'radio',
        label: 'Does the system make autonomous decisions?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'partial', label: 'Partially (with human oversight)' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'data_processing',
        type: 'radio',
        label: 'What type of data does the system process?',
        options: [
          { value: 'personal', label: 'Personal data (including special categories)' },
          { value: 'personal_general', label: 'General personal data (no special categories)' },
          { value: 'non_personal', label: 'Non-personal data only' }
        ]
      },
      {
        id: 'biometric',
        type: 'radio',
        label: 'Does the system process biometric or behavioral data?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'usage',
    title: 'Usage Context',
    description: 'Help us understand how and where the system will be used',
    questions: [
      {
        id: 'critical_infrastructure',
        type: 'radio',
        label: 'Will the system be used as part of critical infrastructure?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'Unsure' }
        ]
      },
      {
        id: 'vulnerable_groups',
        type: 'radio',
        label: 'Will the system interact with or affect vulnerable groups?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'Unsure' }
        ]
      },
      {
        id: 'public_spaces',
        type: 'radio',
        label: 'Will the system be deployed in public spaces?',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'impact',
    title: 'Potential Impact',
    description: 'Assess the potential impact of your AI system',
    questions: [
      {
        id: 'fundamental_rights',
        type: 'radio',
        label: 'Could the system impact fundamental rights?',
        options: [
          { value: 'significant', label: 'Significant impact' },
          { value: 'limited', label: 'Limited impact' },
          { value: 'none', label: 'No impact' }
        ]
      },
      {
        id: 'safety',
        type: 'radio',
        label: 'Could failures of the system impact health or safety?',
        options: [
          { value: 'serious', label: 'Serious impact' },
          { value: 'limited', label: 'Limited impact' },
          { value: 'none', label: 'No impact' }
        ]
      },
      {
        id: 'scale',
        type: 'radio',
        label: 'What is the scale of deployment for this system?',
        options: [
          { value: 'large', label: 'Large scale (many users/wide geographic area)' },
          { value: 'medium', label: 'Medium scale' },
          { value: 'small', label: 'Small scale (limited users/geographic area)' }
        ]
      }
    ]
  }
];

// Helper function to calculate risk level based on answers
const calculateRiskLevel = (answers) => {
  // This is a simplified calculation for demonstration
  let riskScore = 0;
  
  // Decision making autonomy
  if (answers.decision_making === 'yes') riskScore += 3;
  else if (answers.decision_making === 'partial') riskScore += 1;
  
  // Data processing
  if (answers.data_processing === 'personal') riskScore += 3;
  else if (answers.data_processing === 'personal_general') riskScore += 2;
  
  // Biometric data
  if (answers.biometric === 'yes') riskScore += 3;
  
  // Critical infrastructure
  if (answers.critical_infrastructure === 'yes') riskScore += 3;
  else if (answers.critical_infrastructure === 'unsure') riskScore += 1;
  
  // Vulnerable groups
  if (answers.vulnerable_groups === 'yes') riskScore += 3;
  else if (answers.vulnerable_groups === 'unsure') riskScore += 1;
  
  // Public spaces
  if (answers.public_spaces === 'yes') riskScore += 2;
  
  // Fundamental rights impact
  if (answers.fundamental_rights === 'significant') riskScore += 3;
  else if (answers.fundamental_rights === 'limited') riskScore += 1;
  
  // Safety impact
  if (answers.safety === 'serious') riskScore += 3;
  else if (answers.safety === 'limited') riskScore += 1;
  
  // Scale
  if (answers.scale === 'large') riskScore += 2;
  else if (answers.scale === 'medium') riskScore += 1;
  
  // Determine risk level based on score
  if (riskScore >= 12) return 'high';
  else if (riskScore >= 6) return 'medium';
  else return 'low';
};

const RiskAssessmentWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [riskLevel, setRiskLevel] = useState(null);
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
  };
  
  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // If we're on the last step, calculate the risk level
      const level = calculateRiskLevel(answers);
      setRiskLevel(level);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSave = () => {
    // In a real implementation, this would save the assessment to the database
    console.log('Assessment answers:', answers);
    console.log('Calculated risk level:', riskLevel);
    navigate('/risk-assessment/submitted');
  };
  
  const progress = ((currentStep + 1) / wizardSteps.length) * 100;
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Interactive Risk Assessment Wizard</h1>
      
      {riskLevel ? (
        // Show results once risk level is calculated
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Risk Assessment Results</CardTitle>
            <CardDescription>Based on your responses, we've assessed the risk level of your AI system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-6">
              {riskLevel === 'high' && (
                <div className="text-center">
                  <div className="bg-red-100 p-4 rounded-full inline-block mb-3">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-600">High Risk</h2>
                  <p className="text-muted-foreground mt-2">
                    Your AI system falls into the high-risk category under the EU AI Act.
                  </p>
                </div>
              )}
              
              {riskLevel === 'medium' && (
                <div className="text-center">
                  <div className="bg-amber-100 p-4 rounded-full inline-block mb-3">
                    <AlertTriangle className="h-12 w-12 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-amber-600">Medium Risk</h2>
                  <p className="text-muted-foreground mt-2">
                    Your AI system falls into the medium-risk category with specific obligations.
                  </p>
                </div>
              )}
              
              {riskLevel === 'low' && (
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full inline-block mb-3">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600">Low Risk</h2>
                  <p className="text-muted-foreground mt-2">
                    Your AI system falls into the low-risk category under the EU AI Act.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ul className="space-y-1">
                {riskLevel === 'high' && (
                  <>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Conduct a full risk assessment and implement risk management systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Prepare technical documentation according to Article 11</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Implement data governance and human oversight measures</span>
                    </li>
                  </>
                )}
                
                {riskLevel === 'medium' && (
                  <>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Meet transparency obligations for users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Implement appropriate risk mitigation measures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Consider voluntary codes of conduct</span>
                    </li>
                  </>
                )}
                
                {riskLevel === 'low' && (
                  <>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Follow general AI best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Consider voluntary codes of conduct</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span>Monitor for changing use cases that may affect risk classification</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setRiskLevel(null)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Assessment
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Assessment
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // Show wizard steps
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle>{wizardSteps[currentStep].title}</CardTitle>
              <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {wizardSteps.length}</span>
            </div>
            <CardDescription>{wizardSteps[currentStep].description}</CardDescription>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {wizardSteps[currentStep].questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <h3 className="font-medium">{question.label}</h3>
                
                {question.type === 'text' && (
                  <Input 
                    placeholder={question.placeholder} 
                    value={answers[question.id] || ''} 
                    onChange={(e) => handleAnswer(question.id, e.target.value)} 
                  />
                )}
                
                {question.type === 'textarea' && (
                  <Textarea 
                    placeholder={question.placeholder} 
                    value={answers[question.id] || ''} 
                    onChange={(e) => handleAnswer(question.id, e.target.value)} 
                  />
                )}
                
                {question.type === 'radio' && (
                  <RadioGroup 
                    value={answers[question.id] || ''} 
                    onValueChange={(value) => handleAnswer(question.id, value)}
                  >
                    {question.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep < wizardSteps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Calculate Risk
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default RiskAssessmentWizard;
