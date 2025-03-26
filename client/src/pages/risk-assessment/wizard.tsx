
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
import React, { useState } from 'react';
import { useNavigate } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoIcon, AlertTriangle, CheckCircle, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

const RiskAssessmentWizard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for wizard steps
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // State for form data
  const [formData, setFormData] = useState({
    // System identification
    systemName: '',
    systemDescription: '',
    systemPurpose: '',
    
    // Usage context
    usageContext: '',
    userTypes: [] as string[],
    autonomyLevel: '',
    
    // Data handling
    dataTypes: [] as string[],
    dataSources: '',
    dataRetention: '',
    
    // Risk factors
    criticalInfrastructure: false,
    humanRights: false,
    vulnerableGroups: false,
    biometricIdentification: false,
    
    // Mitigation measures
    humanOversight: '',
    transparencyMeasures: '',
    dataGovernance: '',
    technicalSafeguards: ''
  });
  
  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle checkbox changes for multi-select options
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      }
    });
  };
  
  // Move to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Move to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Submit the assessment
  const submitAssessment = async () => {
    try {
      // Here we would normally post to an API
      // For demonstration, we'll just show a success toast
      toast({
        title: "Assessment Submitted",
        description: "Your risk assessment has been successfully created.",
        variant: "default",
      });
      
      // Navigate to results page
      navigate("/risk-assessment/results");
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 1: System Identification</h2>
            <p className="text-muted-foreground">Let's start by identifying your AI system and its main purpose.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={formData.systemName}
                  onChange={(e) => handleInputChange('systemName', e.target.value)}
                  placeholder="Enter the name of your AI system"
                />
              </div>
              
              <div>
                <Label htmlFor="systemDescription">System Description</Label>
                <Textarea
                  id="systemDescription"
                  value={formData.systemDescription}
                  onChange={(e) => handleInputChange('systemDescription', e.target.value)}
                  placeholder="Provide a brief description of your AI system"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="systemPurpose">System Purpose</Label>
                <Textarea
                  id="systemPurpose"
                  value={formData.systemPurpose}
                  onChange={(e) => handleInputChange('systemPurpose', e.target.value)}
                  placeholder="What is the intended purpose of your AI system?"
                  rows={3}
                />
              </div>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Guidance</AlertTitle>
              <AlertDescription>
                Be as specific as possible when describing your system's purpose. This helps in accurately determining the risk level under the EU AI Act.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 2: Usage Context</h2>
            <p className="text-muted-foreground">Define how, where, and by whom the AI system will be used.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="usageContext">Usage Context</Label>
                <Textarea
                  id="usageContext"
                  value={formData.usageContext}
                  onChange={(e) => handleInputChange('usageContext', e.target.value)}
                  placeholder="Describe the context in which this AI system will be used"
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="text-base">User Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {['General Public', 'Employees', 'Professionals', 'Children', 'Vulnerable Groups', 'Authorities'].map((userType) => (
                    <div className="flex items-center space-x-2" key={userType}>
                      <Checkbox 
                        id={`userType-${userType}`} 
                        checked={formData.userTypes.includes(userType)}
                        onCheckedChange={(checked) => handleCheckboxChange('userTypes', userType, checked as boolean)}
                      />
                      <Label htmlFor={`userType-${userType}`}>{userType}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="autonomyLevel" className="text-base">Level of Autonomy</Label>
                <RadioGroup 
                  id="autonomyLevel" 
                  value={formData.autonomyLevel}
                  onValueChange={(value) => handleInputChange('autonomyLevel', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="human_oversight" id="human_oversight" />
                    <Label htmlFor="human_oversight">Human oversight for all decisions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial_autonomy" id="partial_autonomy" />
                    <Label htmlFor="partial_autonomy">Partial autonomy (human verification for important decisions)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full_autonomy" id="full_autonomy" />
                    <Label htmlFor="full_autonomy">Full autonomy (operates without human intervention)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Guidance</AlertTitle>
              <AlertDescription>
                The level of autonomy is a key factor in risk assessment. Systems with high autonomy in critical areas may be classified as high-risk under the EU AI Act.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 3: Data Handling</h2>
            <p className="text-muted-foreground">Tell us about the data your AI system uses and how it's managed.</p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base">Types of Data Used</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    'Personal Data', 
                    'Biometric Data', 
                    'Health Data', 
                    'Financial Data', 
                    'Location Data', 
                    'Behavioral Data',
                    'Professional Data',
                    'Public Data',
                    'Synthetic Data'
                  ].map((dataType) => (
                    <div className="flex items-center space-x-2" key={dataType}>
                      <Checkbox 
                        id={`dataType-${dataType}`} 
                        checked={formData.dataTypes.includes(dataType)}
                        onCheckedChange={(checked) => handleCheckboxChange('dataTypes', dataType, checked as boolean)}
                      />
                      <Label htmlFor={`dataType-${dataType}`}>{dataType}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="dataSources">Data Sources</Label>
                <Textarea
                  id="dataSources"
                  value={formData.dataSources}
                  onChange={(e) => handleInputChange('dataSources', e.target.value)}
                  placeholder="Describe where the data comes from and how it's collected"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="dataRetention">Data Retention Policy</Label>
                <Select
                  value={formData.dataRetention}
                  onValueChange={(value) => handleInputChange('dataRetention', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less_than_month">Less than a month</SelectItem>
                    <SelectItem value="one_to_six_months">1-6 months</SelectItem>
                    <SelectItem value="six_to_twelve_months">6-12 months</SelectItem>
                    <SelectItem value="one_to_five_years">1-5 years</SelectItem>
                    <SelectItem value="more_than_five_years">More than 5 years</SelectItem>
                    <SelectItem value="indefinite">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                Processing sensitive data such as biometric information, health data, or data about vulnerable groups may classify your system as high-risk under the EU AI Act.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 4: Risk Factors</h2>
            <p className="text-muted-foreground">Identify potential risk factors associated with your AI system.</p>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="criticalInfrastructure" 
                    checked={formData.criticalInfrastructure}
                    onCheckedChange={(checked) => handleInputChange('criticalInfrastructure', checked)}
                  />
                  <div>
                    <Label htmlFor="criticalInfrastructure" className="font-medium">Critical Infrastructure</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      The system is used in critical infrastructure (e.g., energy, transportation, water supply, healthcare)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="humanRights" 
                    checked={formData.humanRights}
                    onCheckedChange={(checked) => handleInputChange('humanRights', checked)}
                  />
                  <div>
                    <Label htmlFor="humanRights" className="font-medium">Fundamental Rights Impact</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      The system could impact fundamental rights (e.g., privacy, non-discrimination, freedom of expression)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="vulnerableGroups" 
                    checked={formData.vulnerableGroups}
                    onCheckedChange={(checked) => handleInputChange('vulnerableGroups', checked)}
                  />
                  <div>
                    <Label htmlFor="vulnerableGroups" className="font-medium">Vulnerable Groups</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      The system is used for or impacts vulnerable groups (e.g., children, elderly, persons with disabilities)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="biometricIdentification" 
                    checked={formData.biometricIdentification}
                    onCheckedChange={(checked) => handleInputChange('biometricIdentification', checked)}
                  />
                  <div>
                    <Label htmlFor="biometricIdentification" className="font-medium">Biometric Identification</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      The system performs biometric identification or categorization of natural persons
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>EU AI Act Classification</AlertTitle>
              <AlertDescription>
                These factors are directly aligned with the EU AI Act classification criteria for high-risk AI systems. Checking any of these boxes may indicate your system falls under high-risk categories defined in the regulation.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 5: Mitigation Measures</h2>
            <p className="text-muted-foreground">Describe measures implemented to mitigate potential risks.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="humanOversight">Human Oversight Measures</Label>
                <Textarea
                  id="humanOversight"
                  value={formData.humanOversight}
                  onChange={(e) => handleInputChange('humanOversight', e.target.value)}
                  placeholder="Describe how human oversight is implemented"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="transparencyMeasures">Transparency Measures</Label>
                <Textarea
                  id="transparencyMeasures"
                  value={formData.transparencyMeasures}
                  onChange={(e) => handleInputChange('transparencyMeasures', e.target.value)}
                  placeholder="Describe how system transparency is ensured"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="dataGovernance">Data Governance</Label>
                <Textarea
                  id="dataGovernance"
                  value={formData.dataGovernance}
                  onChange={(e) => handleInputChange('dataGovernance', e.target.value)}
                  placeholder="Describe your data governance practices"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="technicalSafeguards">Technical Safeguards</Label>
                <Textarea
                  id="technicalSafeguards"
                  value={formData.technicalSafeguards}
                  onChange={(e) => handleInputChange('technicalSafeguards', e.target.value)}
                  placeholder="Describe technical safeguards implemented"
                  rows={3}
                />
              </div>
            </div>
            
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Final Step</AlertTitle>
              <AlertDescription>
                Proper risk mitigation measures are essential for EU AI Act compliance, especially for high-risk systems. Documenting these measures will help demonstrate due diligence.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render the progress indicator and step navigation
  const renderProgressAndNavigation = () => {
    const progress = (currentStep / totalSteps) * 100;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{progress.toFixed(0)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submitAssessment}>
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Interactive Risk Assessment Wizard</h1>
        <p className="text-muted-foreground mt-2">
          Complete this step-by-step guide to assess your AI system's risk level under the EU AI Act.
        </p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex-col items-stretch">
          {renderProgressAndNavigation()}
        </CardFooter>
      </Card>
      
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <HelpCircle className="h-4 w-4" />
        <span>Need assistance? Visit our <a href="/documentation/risk-assessment" className="underline">documentation</a> or <a href="/compliance-chatbot" className="underline">chat with our AI assistant</a>.</span>
      </div>
    </div>
  );
};

export default RiskAssessmentWizard;
