import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { FileTextIcon, SparklesIcon, BrainIcon, UploadIcon, BotIcon, SearchIcon, CheckIcon, FileIcon, ShieldAlertIcon, AlertCircleIcon } from "lucide-react";
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

  const handleNextStep = () => {
    if (currentStep < 4) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      } else {
        toast({
          title: "Validation Error",
          description: `Please complete all required fields in Step ${currentStep}`,
          variant: "destructive"
        });
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name?.trim()) errors.name = "System name is required";
      if (!formData.vendor?.trim()) errors.vendor = "Vendor name is required";
      if (!formData.department?.trim()) errors.department = "Department is required";
    } else if (currentStep === 2) {
      if (!formData.purpose?.trim()) errors.purpose = "Purpose is required";
      if (!formData.aiCapabilities?.trim()) errors.aiCapabilities = "AI capabilities are required";
    } else if (currentStep === 3) {
      if (!formData.trainingDatasets?.trim()) errors.trainingDatasets = "Training datasets information is required";
      if (!formData.outputTypes?.trim()) errors.outputTypes = "Output types are required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const requiredFields = ['name', 'vendor', 'department', 'purpose', 'riskLevel'];
    return requiredFields.every(field => !!formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
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

  // AI-powered suggestions from name or description
  const getAiSuggestions = async () => {
    setExtractionInProgress(true);
    setAiExtractionStatus('extracting');

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setExtractionProgress(prev => {
        const newProgress = prev + (Math.random() * 15);
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 500);

    try {
      const response = await fetch('/api/suggest/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name || aiTextInput,
          description: formData.description || aiTextInput
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const results = await response.json();
      clearInterval(progressInterval);
      setExtractionProgress(100);
      setAiResults(results);
      setConfidenceScore(results.confidenceScore || 75);
      setAiExtractionStatus('success');

      setTimeout(() => {
        setExtractionProgress(0);
        setExtractionInProgress(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      clearInterval(progressInterval);
      setExtractionProgress(0);
      setAiExtractionStatus('error');
      setExtractionInProgress(false);

      toast({
        title: "Suggestion Failed",
        description: "There was an error generating AI suggestions. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Apply a specific field from AI results
  const applyField = (field: string) => {
    if (aiResults && aiResults[field]) {
      setFormData(prev => ({ ...prev, [field]: aiResults[field] }));

      // Clear validation errors and missing fields for this field
      if (validationErrors[field]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });

        // Also update missingFields list
        setMissingFields(prev => prev.filter(item => item !== field));
      }

      toast({
        title: "Field Applied",
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} field has been updated`,
      });
    }
  };

  // Apply all AI suggestions to form
  const applyAllResults = () => {
    if (!aiResults) return;

    const newFormData = { ...formData };

    // Apply each field from AI results if present
    const fields = [
      'name', 'vendor', 'version', 'department', 'purpose',
      'aiCapabilities', 'trainingDatasets', 'outputTypes',
      'usageContext', 'potentialImpact', 'riskLevel'
    ];

    // Track which required fields are now filled
    const filledRequiredFields: string[] = [];

    fields.forEach(field => {
      if (aiResults[field]) {
        newFormData[field as keyof typeof newFormData] = aiResults[field];

        // If this is a required field, add it to our tracking array
        if (['name', 'description', 'purpose', 'vendor', 'department', 'riskLevel'].includes(field)) {
          filledRequiredFields.push(field);
        }
      }
    });

    // Handle special fields
    if (aiResults.capabilities) {
      newFormData.aiCapabilities = aiResults.capabilities;
    }

    if (aiResults.dataSources) {
      newFormData.trainingDatasets = aiResults.dataSources;
    }

    // Set risk level if available
    if (aiResults.riskClassification) {
      newFormData.riskLevel = aiResults.riskClassification;

      // Add risk level to filled fields if it's one of the required fields
      if (!filledRequiredFields.includes('riskLevel')) {
        filledRequiredFields.push('riskLevel');
      }
    }

    setFormData(newFormData);

    // Clear validation errors for fields that are now filled
    if (filledRequiredFields.length > 0) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        filledRequiredFields.forEach(field => {
          delete newErrors[field];
        });
        return newErrors;
      });

      // Also update missingFields
      setMissingFields(prev => 
        prev.filter(field => !filledRequiredFields.includes(field))
      );
    }

    setAiModalOpen(false);

    toast({
      title: "All Fields Applied",
      description: "All suggested fields have been applied to the form",
    });
  };

  // Search for similar AI systems
  const searchSimilarSystems = () => {
    if (!formData.name && !formData.description) {
      toast({
        title: "Error",
        description: "Please provide a system name or description before searching",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call an API
    // For now, simulate a search based on the text
    const searchText = (formData.name + " " + formData.description).toLowerCase();

    const results = sampleAiSystems.filter(system => {
      const systemText = (system.name + " " + system.description).toLowerCase();
      return systemText.includes(searchText) || searchText.includes(systemText.substring(0, 10));
    });

    setSearchResults(results);
    setShowSimilarSystems(true);
  };

  // Select a similar system
  const selectSimilarSystem = (system: any) => {
    setSelectedSystem(system);

    // Pre-fill form with selected system data
    setFormData(prev => ({
      ...prev,
      name: system.name,
      vendor: system.vendor,
      description: system.description,
      // Other fields would be filled here in a real implementation
    }));

    // Clear validation errors for fields that are now filled
    const filledFields = ['name', 'vendor', 'description'];

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      filledFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });

    // Also update missingFields
    setMissingFields(prev => 
      prev.filter(field => !filledFields.includes(field))
    );

    setShowSimilarSystems(false);

    toast({
      title: "System Selected",
      description: `${system.name} has been selected as a template`,
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  // Extract data from uploaded file
  const extractFromFile = () => {
    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a file first",
        variant: "destructive"
      });
      return;
    }

    setExtractionInProgress(true);
    setAiExtractionStatus('extracting');

    // Simulate file processing progress
    const progressInterval = setInterval(() => {
      setExtractionProgress(prev => {
        const newProgress = prev + (Math.random() * 10);
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 300);

    // In a real implementation, this would send the file to an API
    // For now, simulate file processing
    setTimeout(() => {
      clearInterval(progressInterval);
      setExtractionProgress(100);

      // Generate mock results based on filename
      const mockResults = {
        name: uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/-|_/g, " "),
        description: `This AI system was extracted from the uploaded documentation. It appears to be a ${
          uploadedFile.name.toLowerCase().includes("chatbot") 
            ? "conversational AI system" 
            : "machine learning model for data analysis"
        }.`,
        vendor: "Extracted from documentation",
        version: "1.0",
        department: "IT",
        purpose: "Automatically extracted from documentation. Please review and update.",
        riskLevel: "Limited",
        confidenceScore: 65
      };

      setAiResults(mockResults);
      setConfidenceScore(65);
      setAiExtractionStatus('success');

      setTimeout(() => {
        setExtractionProgress(0);
        setExtractionInProgress(false);
      }, 1000);
    }, 3000);
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

  // Reset all AI results
  const resetAiResults = () => {
    setSghAsiaAiResults(null);
    setAiResults(null);
    setConfidenceScore(0);
    setShowSystemRecommendations(false);
  };

  // Complete form with realistic data
  const autofillWithRealisticData = () => {
    const newData = {
      ...formData,
      version: formData.version || "1.0.0",
      implementationDate: formData.implementationDate || new Date().toISOString().split('T')[0],
      lastAssessmentDate: formData.lastAssessmentDate || new Date().toISOString().split('T')[0],
      expectedLifetime: formData.expectedLifetime || "5 years",
      maintenanceSchedule: formData.maintenanceSchedule || "Quarterly",
      owner: formData.owner || "AI Governance Team",
      deploymentScope: formData.deploymentScope || "Production",
      mitigationMeasures: formData.mitigationMeasures || "Human oversight, explainability reports, regular auditing"
    };

    setFormData(newData);

    toast({
      title: "Form Autofilled",
      description: "Realistic data has been added to empty fields",
    });
  };

  return (
    <div className="space-y-6">
      <RegistrationGuide />
      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <BrainIcon className="h-5 w-5 mr-2 text-primary" />
            SGH ASIA AI-Powered System Registration
          </CardTitle>
          <CardDescription>
            Use AI assistance to accurately classify and register your AI systems according to EU AI Act requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showProgressSteps && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Registration Progress</h3>
                <Button 
                  variant="ghost" 
                  className="h-8 text-xs" 
                  onClick={() => setShowProgressSteps(false)}
                >
                  Hide
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 1 ? "bg-primary text-white" : "bg-neutral-200 text-neutral-600"
                }`}>1</div>
                <div className={`h-1 flex-1 ${currentStep >= 2 ? "bg-primary" : "bg-neutral-200"}`}></div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 2 ? "bg-primary text-white" : "bg-neutral-200 text-neutral-600"
                }`}>2</div>
                <div className={`h-1 flex-1 ${currentStep >= 3 ? "bg-primary" : "bg-neutral-200"}`}></div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 3 ? "bg-primary text-white" : "bg-neutral-200 text-neutral-600"
                }`}>3</div>
                <div className={`h-1 flex-1 ${currentStep >= 4 ? "bg-primary" : "bg-neutral-200"}`}></div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 4 ? "bg-primary text-white" : "bg-neutral-200 text-neutral-600"
                }`}>4</div>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 px-1">
                <div className={currentStep >= 1 ? "text-primary font-medium" : ""}>Basic Info</div>
                <div className={currentStep >= 2 ? "text-primary font-medium" : ""}>AI Details</div>
                <div className={currentStep >= 3 ? "text-primary font-medium" : ""}>Risk Assessment</div>
                <div className={currentStep >= 4 ? "text-primary font-medium" : ""}>Review</div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 items-center p-4 bg-neutral-50 rounded-md mb-6">
            <div className="flex-1">
              <h3 className="font-medium text-sm">Accelerate Your System Registration</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Let our SGH ASIA AI analyze your system details and suggest appropriate classification and compliance requirements
              </p>
            </div>
            <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="whitespace-nowrap">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-primary" />
                    AI-Powered System Registration
                  </DialogTitle>
                  <DialogDescription>
                    Let our DeepSeek AI analyze your system and suggest appropriate registration details
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue={aiTab} onValueChange={setAiTab} className="mt-2">
                  <TabsList className="grid grid-cols-3 mb-2">
                    <TabsTrigger value="upload" className="text-xs">Upload Document</TabsTrigger>
                    <TabsTrigger value="text" className="text-xs">Text Input</TabsTrigger>
                    <TabsTrigger value="search" className="text-xs">Similar Systems</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center">
                      <UploadIcon className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                      <h3 className="text-sm font-medium mb-1">Upload System Documentation</h3>
                      <p className="text-xs text-neutral-500 mb-4">
                        Upload PDF, Word, or text files with your AI system documentation
                      </p>
                      <Input 
                        type="file" 
                        id="file-upload"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button variant="outline" type="button" className="h-9 px-4">
                            Choose File
                          </Button>
                        </label>
                        {uploadedFile && (
                          <p className="text-xs mt-2 flex items-center">
                            <FileIcon className="h-3 w-3 mr-1" />
                            {uploadedFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {uploadedFile && (
                      <div className="space-y-4">
                        <Button 
                          type="button" 
                          onClick={extractFromFile}
                          disabled={extractionInProgress}
                          className="w-full"
                        >
                          {extractionInProgress ? (
                            <>
                              <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2"></div>
                              Extracting...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-4 w-4 mr-2" />
                              Extract System Information
                            </>
                          )}
                        </Button>

                        {extractionInProgress && (
                          <div className="space-y-2">
                            <Progress value={extractionProgress} className="h-2" />
                            <p className="text-xs text-center text-neutral-500">
                              {extractionProgress < 100 
                                ? "Analyzing document and extracting AI system details..." 
                                : "Analysis complete!"
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="ai-text-input">System Description</Label>
                      <Textarea
                        id="ai-text-input"
                        placeholder="Describe your AI system in detail (e.g., 'A machine learning model for customer service that predicts customer needs based on past interactions')"
                        value={aiTextInput}
                        onChange={(e) => setAiTextInput(e.target.value)}
                        className="min-h-[120px] mt-1"
                      />
                    </div>

                    <Button 
                      type="button" 
                      onClick={getAiSuggestions}
                      disabled={!aiTextInput || aiTextInput.length < 10 || extractionInProgress}
                      className="w-full"
                    >
                      {extractionInProgress ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4 mr-2" />
                          Generate Suggestions
                        </>
                      )}
                    </Button>

                    {extractionInProgress && (
                      <div className="space-y-2">
                        <Progress value={extractionProgress} className="h-2" />
                        <p className="text-xs text-center text-neutral-500">
                          {extractionProgress < 100 
                            ? "Analyzing your description and generating suggestions..." 
                            : "Analysis complete!"
                          }
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="search" className="space-y-4">
                    <div>
                      <Label htmlFor="search-input">Search for Similar Systems</Label>
                      <div className="flex mt-1">
                        <Input
                          id="search-input"
                          placeholder="Type system name or keywords..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button 
                          type="button" 
                          variant="default" 
                          className="rounded-l-none"
                          onClick={() => {
                            setSearchResults(
                              sampleAiSystems.filter(system => 
                                system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                system.description.toLowerCase().includes(searchQuery.toLowerCase())
                              )
                            );
                          }}
                          disabled={!searchQuery || searchQuery.length < 3}
                        >
                          <SearchIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="px-3 py-2 bg-neutral-50 border-b text-xs font-medium">
                        Similar AI Systems
                      </div>
                      <div className="divide-y max-h-[200px] overflow-y-auto">
                        {searchResults.length > 0 ? (
                          searchResults.map((system, index) => (
                            <div key={index} className="p-3 hover:bg-neutral-50 cursor-pointer transition-colors" onClick={() => selectSimilarSystem(system)}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-medium">{system.name}</h4>
                                  <p className="text-xs text-neutral-500 mt-1">{system.description}</p>
                                </div>
                                <Badge variant={system.type === "High-Risk" ? "destructive" : "secondary"} className="text-[10px] h-5">
                                  {system.type}
                                </Badge>
                              </div>
                              <div className="flex items-center mt-2 text-xs text-neutral-500">
                                <span>{system.vendor}</span>
                              </div>
                            </div>
                          ))
                        ) : searchQuery.length >= 3 ? (
                          <div className="p-4 text-center text-sm text-neutral-500">
                            No matching systems found
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-neutral-500">
                            Enter at least 3 characters to search
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {aiResults && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">AI Suggestions</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-neutral-500">Confidence:</span>
                        <Badge variant={
                          confidenceScore >= 80 ? "default" : 
                          confidenceScore >= 60 ? "secondary" : 
                          "outline"
                        } className="text-[10px]">
                          {confidenceScore}%
                        </Badge>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-2 divide-x divide-y">
                        {Object.entries(aiResults).map(([key, value]) => {
                          // Skip some fields
                          if (['confidenceScore', 'riskClassification', 'euAiActArticles'].includes(key)) return null;

                          return (
                            <div key={key} className="p-3 relative group">
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => applyField(key)}
                                >
                                  <CheckIcon className="h-3 w-3" />
                                </Button>
                              </div>
                              <h4 className="text-xs font-medium text-neutral-500 mb-1">
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-sm line-clamp-2">{value as string}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {aiResults.riskClassification && (
                      <div className="flex items-center space-x-2 p-3 bg-neutral-50 rounded-lg">
                        <ShieldAlertIcon className={`h-5 w-5 ${
                          aiResults.riskClassification === 'High' 
                            ? 'text-red-500' 
                            : aiResults.riskClassification === 'Limited' 
                              ? 'text-amber-500' 
                              : 'text-green-500'
                        }`} />
                        <div>
                          <h4 className="text-sm font-medium">Risk Classification</h4>
                          <p className="text-xs text-neutral-600">
                            This system appears to be a <span className="font-medium">{aiResults.riskClassification} Risk</span> system
                          </p>
                        </div>
                      </div>
                    )}

                    {aiResults.euAiActArticles && (
                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">Relevant EU AI Act Articles</h4>
                        <div className="flex flex-wrap gap-1">
                          {(aiResults.euAiActArticles as string[]).map((article, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px]">
                              {article}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <DialogFooter className="gap-2 mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setAiModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applyAllResults}
                    disabled={!aiResults || extractionInProgress}
                  >
                    Apply All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {missingFields.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Missing Required Fields</AlertTitle>
              <AlertDescription>
                <div className="text-sm">Please fill in the following fields:</div>
                <ul className="list-disc list-inside mt-1 pl-2">
                  {missingFields.map((field) => (
                    <li key={field} className="text-sm">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">System Name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="name" 
                        placeholder="Enter system name" 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={validationErrors.name ? "border-red-500" : ""}
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor">Vendor Name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="vendor" 
                        placeholder="Enter vendor name" 
                        value={formData.vendor || ''} 
                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                        className={validationErrors.vendor ? "border-red-500" : ""}
                      />
                      {validationErrors.vendor && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.vendor}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="version">Version</Label>
                      <Input 
                        id="version" 
                        placeholder="e.g., 1.0.0" 
                        value={formData.version || ''} 
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                      <Select 
                        value={formData.department || ''}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                      >
                        <SelectTrigger id="department" className={validationErrors.department ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Research and Development">Research and Development</SelectItem>
                          <SelectItem value="Human Resources">Human Resources</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Customer Service">Customer Service</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Legal">Legal</SelectItem>
                          <SelectItem value="Business Intelligence">Business Intelligence</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.department && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.department}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">System Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Provide a brief description of the system" 
                      value={formData.description || ''} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: System Capabilities */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="purpose" 
                      placeholder="What is the main purpose of this AI system?" 
                      value={formData.purpose || ''} 
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      rows={3}
                      className={validationErrors.purpose ? "border-red-500" : ""}
                    />
                    {validationErrors.purpose && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.purpose}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="aiCapabilities">AI Capabilities <span className="text-red-500">*</span></Label>
                      <Textarea 
                        id="aiCapabilities" 
                        placeholder="Describe the AI capabilities (e.g., NLP, computer vision, decision support)" 
                        value={formData.aiCapabilities || ''} 
                        onChange={(e) => setFormData({ ...formData, aiCapabilities: e.target.value })}
                        rows={3}
                        className={validationErrors.aiCapabilities ? "border-red-500" : ""}
                      />
                      {validationErrors.aiCapabilities && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.aiCapabilities}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Data & Outputs */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="trainingDatasets">Training Datasets <span className="text-red-500">*</span></Label>
                      <Textarea 
                        id="trainingDatasets" 
                        placeholder="Describe the data used to train this system" 
                        value={formData.trainingDatasets || ''} 
                        onChange={(e) => setFormData({ ...formData, trainingDatasets: e.target.value })}
                        rows={3}
                        className={validationErrors.trainingDatasets ? "border-red-500" : ""}
                      />
                      {validationErrors.trainingDatasets && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.trainingDatasets}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="outputTypes">Output Types <span className="text-red-500">*</span></Label>
                      <Textarea 
                        id="outputTypes" 
                        placeholder="What outputs does this system produce?" 
                        value={formData.outputTypes || ''} 
                        onChange={(e) => setFormData({ ...formData, outputTypes: e.target.value })}
                        rows={3}
                        className={validationErrors.outputTypes ? "border-red-500" : ""}
                      />
                      {validationErrors.outputTypes && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.outputTypes}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="usageContext">Usage Context</Label>
                      <Textarea 
                        id="usageContext" 
                        placeholder="Where and how is this system used?" 
                        value={formData.usageContext || ''} 
                        onChange={(e) => setFormData({ ...formData, usageContext: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Risk Assessment */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="potentialImpact">Potential Impact</Label>
                      <Textarea 
                        id="potentialImpact" 
                        placeholder="What are the potential impacts on individuals or society?" 
                        value={formData.potentialImpact || ''} 
                        onChange={(e) => setFormData({ ...formData, potentialImpact: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">Risk Level <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.riskLevel || ''}
                      onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                    >
                      <SelectTrigger id="riskLevel" className={validationErrors.riskLevel ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unacceptable">Unacceptable - Prohibited by the EU AI Act</SelectItem>
                        <SelectItem value="High">High - Strict requirements under the EU AI Act</SelectItem>
                        <SelectItem value="Limited">Limited - Transparency obligations apply</SelectItem>
                        <SelectItem value="Minimal">Minimal - Limited requirements</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.riskLevel && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.riskLevel}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                {currentStep > 1 && (
                  <Button type="button" onClick={handlePreviousStep} variant="ghost" className="mr-4">Previous</Button>
                )}
                {currentStep < 4 ? (
                  <Button type="button" onClick={handleNextStep}>Next</Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};