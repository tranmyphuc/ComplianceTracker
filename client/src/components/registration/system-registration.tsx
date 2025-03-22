import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { FileTextIcon, SparklesIcon, BrainIcon, UploadIcon, BotIcon, SearchIcon, CheckIcon, FileIcon, ShieldAlertIcon, AlertCircleIcon, AlertTriangleIcon, Globe, LinkIcon, PenIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { RegistrationGuide } from "./registration-guide";

const initialFormData = {
  name: '',
  description: '',
  purpose: '',
  version: '',
  department: '',
  vendor: '',
  riskLevel: 'Limited',
  systemId: '',
  aiCapabilities: '',
  trainingDatasets: '',
  outputTypes: '',
  usageContext: '',
  potentialImpact: '',
  mitigationMeasures: '',
  implementationDate: '',
  lastAssessmentDate: '',
  expectedLifetime: '',
  maintenanceSchedule: '',
  owner: '',
  deploymentScope: '',
  integrations: [],
  changeHistory: [],
  dataSources: [],
  trainingDataDescription: ''
};

const departments = [
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Sales" },
  { id: "hr", name: "Human Resources" },
  { id: "it", name: "Information Technology" },
  { id: "rd", name: "Research & Development" },
  { id: "finance", name: "Finance" },
  { id: "legal", name: "Legal & Compliance" },
  { id: "operations", name: "Operations" },
  { id: "customerservice", name: "Customer Service" },
  { id: "executive", name: "Executive" }
];

const riskLevels = [
  { id: "unacceptable", name: "Unacceptable", description: "Prohibited under Article 5" },
  { id: "high", name: "High", description: "Systems in Annex III areas" },
  { id: "limited", name: "Limited", description: "Systems with transparency obligations" },
  { id: "minimal", name: "Minimal", description: "All other AI systems" }
];

const sampleAiSystems = [
  {
    name: "Content Generation Assistant",
    vendor: "AI Creative Solutions Ltd.",
    description: "AI system that generates content for marketing materials, blog posts, and social media content.",
    type: "Natural Language Processing"
  },
  {
    name: "HR Resume Screening",
    vendor: "TalentAI",
    description: "AI system for initial resume screening and candidate ranking based on job requirements.",
    type: "High-Risk"
  },
  {
    name: "Customer Service Chatbot",
    vendor: "DialogueTech",
    description: "AI-powered chatbot for handling customer inquiries and providing automated support.",
    type: "NLP"
  },
  {
    name: "Fraud Detection System",
    vendor: "SecureFinance AI",
    description: "AI for detecting potential fraudulent financial transactions using pattern recognition.",
    type: "High-Risk"
  },
  {
    name: "Inventory Forecasting",
    vendor: "SmartStock AI",
    description: "AI system that predicts inventory needs based on historical data and sales trends.",
    type: "Prediction"
  }
];

export const SystemRegistration: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [sghAsiaAiInProgress, setSghAsiaAiInProgress] = useState(false);
  const [sghAsiaAiResults, setSghAsiaAiResults] = useState<any>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTab, setAiTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionInProgress, setExtractionInProgress] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [aiTextInput, setAiTextInput] = useState('');
  const [aiResults, setAiResults] = useState<any>(null);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<any | null>(null);
  const [showSimilarSystems, setShowSimilarSystems] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<'basic' | 'comprehensive'>('comprehensive');
  const [guidanceVisible, setGuidanceVisible] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [aiExtractionStatus, setAiExtractionStatus] = useState<'idle' | 'extracting' | 'success' | 'error'>('idle');
  const [showProgressSteps, setShowProgressSteps] = useState(true);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showSystemRecommendations, setShowSystemRecommendations] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      // Also update missingFields to remove this field
      setMissingFields(prev => prev.filter(field => field !== name));
    }
  };

  // Handle selection changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      // Also update missingFields to remove this field
      setMissingFields(prev => prev.filter(field => field !== name));
    }
  };

  // Navigate to the next step
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to the previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate the current step
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};
    const missing: string[] = [];

    // Different validation for different steps
    if (currentStep === 1) {
      // Basic info validation
      const basicInfoFields = ['name', 'description', 'purpose', 'vendor', 'department'];
      
      basicInfoFields.forEach(field => {
        if (!formData[field as keyof typeof formData]) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          missing.push(field);
        }
      });
    } 
    else if (currentStep === 2) {
      // AI Details validation
      const aiDetailsFields = ['aiCapabilities', 'trainingDatasets'];
      
      aiDetailsFields.forEach(field => {
        if (!formData[field as keyof typeof formData]) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          missing.push(field);
        }
      });
    }
    else if (currentStep === 3) {
      // Risk Assessment validation
      if (!formData.riskLevel) {
        errors.riskLevel = "Risk Level is required";
        missing.push('riskLevel');
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setMissingFields(missing);

      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for this step",
        variant: "destructive"
      });

      return false;
    }

    return true;
  };

  // Handle next step button click
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      goToNextStep();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation of all required fields
    const errors: Record<string, string> = {};
    const requiredFields = ['name', 'description', 'purpose', 'vendor', 'department', 'riskLevel'];
    const missing: string[] = [];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        missing.push(field);
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setMissingFields(missing);

      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });

      return;
    }

    // Generate a system ID if not provided
    const dataToSubmit = { ...formData };
    if (!dataToSubmit.systemId) {
      dataToSubmit.systemId = `AI-SYS-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    try {
      // Submit data to backend
      const response = await fetch('/api/systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      // Show success message
      toast({
        title: "Success",
        description: `AI System "${result.name}" registered successfully`,
      });

      // Reset form and redirect to inventory
      setFormData(initialFormData);
      setLocation('/inventory');
    } catch (error) {
      console.error('Error registering system:', error);

      toast({
        title: "Registration Failed",
        description: "There was an error registering your AI system. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Run AI analysis
  const runSghAsiaAiAnalysis = async () => {
    if (!formData.description) {
      toast({
        title: "Error",
        description: "Please provide a system description before running the analysis",
        variant: "destructive"
      });
      return;
    }

    setSghAsiaAiInProgress(true);

    try {
      const response = await fetch('/api/analyze/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const results = await response.json();
      setSghAsiaAiResults(results);

      // Update form with AI suggestions
      if (results.riskClassification) {
        setFormData(prev => ({
          ...prev,
          riskLevel: results.riskClassification
        }));

        // Clear validation errors for risk level if it was previously missing
        if (validationErrors.riskLevel) {
          setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.riskLevel;
            return newErrors;
          });

          // Also update missingFields
          setMissingFields(prev => prev.filter(field => field !== 'riskLevel'));
        }
      }

      toast({
        title: "Analysis Complete",
        description: "AI analysis of your system has been completed successfully",
      });
    } catch (error) {
      console.error('Error analyzing system:', error);

      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your AI system. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSghAsiaAiInProgress(false);
    }
  };

  // Reset all AI results
  const resetAiResults = () => {
    setSghAsiaAiResults(null);
    setAiResults(null);
    setConfidenceScore(0);
    setShowSystemRecommendations(false);
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name" className={validationErrors.name ? "text-destructive" : ""}>
                    System Name*
                  </Label>
                  {validationErrors.name && (
                    <span className="text-xs text-destructive">{validationErrors.name}</span>
                  )}
                </div>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Customer Support Chatbot"
                  className={validationErrors.name ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vendor" className={validationErrors.vendor ? "text-destructive" : ""}>
                    Vendor/Provider*
                  </Label>
                  {validationErrors.vendor && (
                    <span className="text-xs text-destructive">{validationErrors.vendor}</span>
                  )}
                </div>
                <Input
                  id="vendor"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  placeholder="e.g., OpenAI, Google, In-house"
                  className={validationErrors.vendor ? "border-destructive" : ""}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className={validationErrors.description ? "text-destructive" : ""}>
                  Description*
                </Label>
                {validationErrors.description && (
                  <span className="text-xs text-destructive">{validationErrors.description}</span>
                )}
              </div>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the AI system and its capabilities"
                className={`min-h-[100px] ${validationErrors.description ? "border-destructive" : ""}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="department" className={validationErrors.department ? "text-destructive" : ""}>
                    Department*
                  </Label>
                  {validationErrors.department && (
                    <span className="text-xs text-destructive">{validationErrors.department}</span>
                  )}
                </div>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department" className={validationErrors.department ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.0, 2.3.1"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="purpose" className={validationErrors.purpose ? "text-destructive" : ""}>
                  Purpose*
                </Label>
                {validationErrors.purpose && (
                  <span className="text-xs text-destructive">{validationErrors.purpose}</span>
                )}
              </div>
              <Textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                placeholder="Describe the intended purpose and use cases of this AI system"
                className={`min-h-[100px] ${validationErrors.purpose ? "border-destructive" : ""}`}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="grid gap-6">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="aiCapabilities" className={validationErrors.aiCapabilities ? "text-destructive" : ""}>
                  AI Capabilities*
                </Label>
                {validationErrors.aiCapabilities && (
                  <span className="text-xs text-destructive">{validationErrors.aiCapabilities}</span>
                )}
              </div>
              <Textarea
                id="aiCapabilities"
                name="aiCapabilities"
                value={formData.aiCapabilities}
                onChange={handleInputChange}
                placeholder="e.g., Natural Language Processing, Image Recognition, Predictive Analytics"
                className={`min-h-[100px] ${validationErrors.aiCapabilities ? "border-destructive" : ""}`}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="trainingDatasets" className={validationErrors.trainingDatasets ? "text-destructive" : ""}>
                  Training Datasets*
                </Label>
                {validationErrors.trainingDatasets && (
                  <span className="text-xs text-destructive">{validationErrors.trainingDatasets}</span>
                )}
              </div>
              <Textarea
                id="trainingDatasets"
                name="trainingDatasets"
                value={formData.trainingDatasets}
                onChange={handleInputChange}
                placeholder="Describe the data used to train the AI system"
                className={`min-h-[100px] ${validationErrors.trainingDatasets ? "border-destructive" : ""}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="outputTypes">Output Types</Label>
                <Input
                  id="outputTypes"
                  name="outputTypes"
                  value={formData.outputTypes}
                  onChange={handleInputChange}
                  placeholder="e.g., Text, Images, Predictions"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="usageContext">Usage Context</Label>
                <Input
                  id="usageContext"
                  name="usageContext"
                  value={formData.usageContext}
                  onChange={handleInputChange}
                  placeholder="e.g., Customer-facing, Internal only"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="potentialImpact">Potential Impact</Label>
              <Textarea
                id="potentialImpact"
                name="potentialImpact"
                value={formData.potentialImpact}
                onChange={handleInputChange}
                placeholder="Describe potential impacts on individuals, groups, or society"
                className="min-h-[100px]"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="grid gap-6">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="riskLevel" className={validationErrors.riskLevel ? "text-destructive" : ""}>
                  Risk Level*
                </Label>
                {validationErrors.riskLevel && (
                  <span className="text-xs text-destructive">{validationErrors.riskLevel}</span>
                )}
              </div>
              <Select
                value={formData.riskLevel}
                onValueChange={(value) => handleSelectChange("riskLevel", value)}
              >
                <SelectTrigger id="riskLevel" className={validationErrors.riskLevel ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a risk level" />
                </SelectTrigger>
                <SelectContent>
                  {riskLevels.map((risk) => (
                    <SelectItem key={risk.id} value={risk.name}>
                      <div className="flex items-center">
                        <span>{risk.name}</span>
                        <span className="text-xs text-neutral-500 ml-2">({risk.description})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="mitigationMeasures">Risk Mitigation Measures</Label>
              <Textarea
                id="mitigationMeasures"
                name="mitigationMeasures"
                value={formData.mitigationMeasures}
                onChange={handleInputChange}
                placeholder="Describe measures in place to mitigate risks"
                className="min-h-[100px]"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
              <div className="flex space-x-2">
                <AlertTriangleIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Risk Assessment</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Based on the information provided, this system is classified as <strong>{formData.riskLevel}</strong> risk.
                    {formData.riskLevel === 'High' && (
                      <span className="block mt-2">
                        High-risk AI systems require additional documentation and compliance measures under the EU AI Act.
                      </span>
                    )}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={runSghAsiaAiAnalysis}
                    disabled={sghAsiaAiInProgress}
                  >
                    {sghAsiaAiInProgress ? "Analyzing..." : "Run AI Risk Analysis"}
                  </Button>
                </div>
              </div>
            </div>

            {sghAsiaAiResults && (
              <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mt-2">
                <h3 className="text-sm font-medium">SGH ASIA AI Analysis Results</h3>
                <div className="mt-2 text-sm">
                  <p><strong>Risk Classification:</strong> {sghAsiaAiResults.riskClassification}</p>
                  <p className="mt-1"><strong>Relevant Articles:</strong> {sghAsiaAiResults.relevantArticles?.join(", ")}</p>
                  {sghAsiaAiResults.suggestedImprovements && (
                    <div className="mt-2">
                      <p><strong>Suggested Improvements:</strong></p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {Array.isArray(sghAsiaAiResults.suggestedImprovements) ? (
                          sghAsiaAiResults.suggestedImprovements.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>{sghAsiaAiResults.suggestedImprovements}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="grid gap-6">
            <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
              <h3 className="text-sm font-medium">Review and Submit</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Please review the information before submitting. Once submitted, the system will be registered in your AI inventory.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Basic Information</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Description:</strong> {formData.description}</p>
                    <p><strong>Vendor:</strong> {formData.vendor}</p>
                    <p><strong>Department:</strong> {formData.department}</p>
                    <p><strong>Version:</strong> {formData.version}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">AI Capabilities & Risk</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Purpose:</strong> {formData.purpose}</p>
                    <p><strong>Capabilities:</strong> {formData.aiCapabilities}</p>
                    <p><strong>Training Data:</strong> {formData.trainingDatasets}</p>
                    <p>
                      <strong>Risk Level:</strong> {" "}
                      <Badge variant={formData.riskLevel === "High" ? "destructive" : "outline"}>
                        {formData.riskLevel}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="mt-2">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                By registering this AI system, you confirm that all information provided is accurate and that the system will be used in compliance with the EU AI Act and organizational policies.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  // Check if there's a quick recommendation for the current system description
  useEffect(() => {
    if (formData.description && formData.description.length > 20) {
      // Check if we should show recommendations based on the description
      const shouldShowRecommendations = !showSystemRecommendations && 
        !sghAsiaAiResults &&
        !aiResults;

      if (shouldShowRecommendations) {
        setShowSystemRecommendations(true);
      }
    }
  }, [formData.description]);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {guidanceVisible && (
        <div className="mb-8">
          <RegistrationGuide />
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setGuidanceVisible(false)}
          >
            Hide Guide
          </Button>
        </div>
      )}

      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Register AI System</CardTitle>
              <CardDescription>
                Add an AI system to your inventory to track EU AI Act compliance
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiModalOpen(true)}
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI Auto-fill
            </Button>
          </div>

          {missingFields.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Required Fields Missing</AlertTitle>
              <AlertDescription>
                Please complete the following fields: {missingFields.join(", ")}
              </AlertDescription>
            </Alert>
          )}

          {/* Steps indicator */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {['Basic Information', 'AI Details', 'Risk Assessment', 'Review & Submit'].map((step, index) => (
                <div 
                  key={index} 
                  className={`text-xs font-medium ${currentStep > index + 1 ? 'text-primary' : 
                    currentStep === index + 1 ? 'text-primary' : 'text-neutral-400'}`}
                >
                  Step {index + 1}: {step}
                </div>
              ))}
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Render content based on current step */}
            {renderStepContent()}

            {/* Show different buttons based on current step */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPreviousStep}
                >
                  Previous Step
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  className="ml-auto" 
                  onClick={handleNextStep}
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="ml-auto"
                >
                  Register System
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};