import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { FileTextIcon, SparklesIcon, BrainIcon, UploadIcon, BotIcon, SearchIcon, CheckIcon, FileIcon, ShieldAlertIcon, AlertCircleIcon, AlertTriangleIcon, Globe, LinkIcon, PenIcon, X as XIcon, ZapIcon, Info as InfoIcon } from "lucide-react";

// Extend the Window interface to add our smart completion timer
declare global {
  interface Window {
    smartCompletionTimer: ReturnType<typeof setTimeout> | undefined;
  }
}
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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
import { BasicInformationStep } from './basic-information-step';
import { TechnicalDetailsStep } from './technical-details-step';
import { RiskAssessmentStep } from './risk-assessment-step';
import { DocumentationStep } from './documentation-step';
import { LegalValidationStep } from './legal-validation-step';
import { ReviewSubmitStep } from './review-submit-step';
import { AutoFillGuidanceModal } from './AutoFillGuidanceModal';
import { AutoFillProcessStepper, getDefaultAutoFillSteps } from './AutoFillProcessStepper';

const initialFormData = {
  name: '',
  description: '',
  purpose: '',
  version: '',
  department: '',
  vendor: '',
  internalOwner: '',  // Added for ReviewSubmitStep
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
  humanOversight: '',  // Added for human oversight measures
  dataProtectionMeasures: '',  // Added for data protection measures
  deploymentScope: '',
  integrations: [],
  changeHistory: [],
  dataSources: '', // Changed from array to string to match expected type
  trainingDataDescription: '',
  // Added missing fields required by the review step
  humansInLoop: false,
  dataProtection: '',
  usesPersonalData: false,
  usesSensitiveData: false,
  vulnerabilities: '',
  impactsAutonomous: false,
  impactsVulnerableGroups: false,
  usesDeepLearning: false,
  isTransparent: false,
  confirmAccuracy: false,
  confirmCompliance: false
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
  { id: "Unacceptable", name: "Unacceptable", description: "Prohibited under Article 5" },
  { id: "High", name: "High", description: "Systems in Annex III areas" },
  { id: "Limited", name: "Limited", description: "Systems with transparency obligations" },
  { id: "Minimal", name: "Minimal", description: "All other AI systems" }
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

export interface SystemRegistrationProps {
  onFormChange?: () => void;
}

export const SystemRegistration: React.FC<SystemRegistrationProps> = ({ onFormChange }) => {
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
  const [smartCompletionActive, setSmartCompletionActive] = useState(false);
  
  // New state variables for the auto-fill guidance
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [autoFillSteps, setAutoFillSteps] = useState(getDefaultAutoFillSteps());
  const [currentAutoFillStep, setCurrentAutoFillStep] = useState<string | undefined>(undefined);

  // Handle input changes with smart completion
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
    
    // Check if field has significant changes and trigger smart completion
    if (name === 'name' || name === 'description' || name === 'purpose') {
      // Only trigger smart completion if the value is substantial enough
      if (value && value.length > 15) {
        console.log(`Detected substantial content in ${name}, length: ${value.length}`);
        // Debounce the smart completion to avoid multiple calls
        if (window.smartCompletionTimer) {
          clearTimeout(window.smartCompletionTimer);
        }
        // Set smart completion active flag immediately for visual feedback
        setSmartCompletionActive(true);
        window.smartCompletionTimer = setTimeout(() => {
          console.log("Triggering smart completion check");
          checkForSmartCompletion();
        }, 1000);
      }
    }
    
    // Trigger the onFormChange callback if provided
    if (onFormChange) {
      onFormChange();
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
    
    // Trigger the onFormChange callback if provided
    if (onFormChange) {
      onFormChange();
    }
  };

  // Navigate to the next step
  const goToNextStep = () => {
    if (currentStep < 5) {
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
    
    // Validate the confirmation checkboxes in the final step
    if (currentStep === 5) {
      if (!formData.confirmAccuracy) {
        errors.confirmAccuracy = "You must confirm that the information is accurate";
      }
      
      if (!formData.confirmCompliance) {
        errors.confirmCompliance = "You must confirm understanding of regulatory compliance";
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setMissingFields(missing);

      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and confirm the statements",
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
  
  // Smart completion function to auto-complete partially filled forms
  const checkForSmartCompletion = async () => {
    // Determine if we have enough information to trigger smart completion
    // We need at least one substantial field filled out to make good suggestions
    const hasSubstantialContent = (
      (formData.name && formData.name.length > 15) ||
      (formData.description && formData.description.length > 20) ||
      (formData.purpose && formData.purpose.length > 20)
    );
    
    // Check if there are missing fields that could benefit from smart completion
    const importantMissingFields = [
      'name', 'description', 'purpose', 'vendor', 'department', 
      'aiCapabilities', 'trainingDatasets', 'riskLevel'
    ].filter(field => {
      const value = formData[field as keyof typeof formData];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    
    // Only proceed if we have substantial content and missing fields that need completion
    if (hasSubstantialContent && importantMissingFields.length > 0) {
      // Indicate that smart completion is active
      setSmartCompletionActive(true);
      
      try {
        // Show a notification that smart completion is running
        toast({
          title: "Smart Completion",
          description: "Analyzing your input to suggest missing fields...",
          duration: 3000,
        });
        
        // Create a payload with the fields we have
        const payload = {
          name: formData.name || "",
          description: formData.description || "",
          purpose: formData.purpose || "",
          partialData: true,
          missingFields: importantMissingFields
        };
        
        // Call the API to get suggestions
        const response = await fetch('/api/suggest/system', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const suggestions = await response.json();
        
        // If we got valid suggestions
        if (suggestions && typeof suggestions === 'object') {
          // Show dialog to prompt user to apply smart completion suggestions
          setAiResults(suggestions);
          setConfidenceScore(suggestions.confidenceScore || 65);
          setAiModalOpen(true);
          
          // Auto-select the Text tab
          setAiTab('text');
          
          toast({
            title: "Smart Completion Ready",
            description: "AI has suggested completions for your form. Review and apply them as needed.",
          });
        }
      } catch (error) {
        console.error("Smart completion error:", error);
        // Don't show an error to avoid disturbing the user
        // This is a background enhancement feature
      } finally {
        // After completion (whether successful or not), reset the flag
        setTimeout(() => {
          setSmartCompletionActive(false);
        }, 3000);
      }
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep 
            formData={formData} 
            setFormData={setFormData}
            errors={validationErrors}
          />
        );

      case 2:
        return (
          <TechnicalDetailsStep 
            formData={formData} 
            setFormData={setFormData}
            errors={validationErrors}
          />
        );

      case 3:
        return (
          <RiskAssessmentStep 
            formData={formData} 
            setFormData={setFormData}
            errors={validationErrors}
            sghAsiaAiResults={sghAsiaAiResults}
            setSghAsiaAiResults={setSghAsiaAiResults}
            sghAsiaAiInProgress={sghAsiaAiInProgress}
            setSghAsiaAiInProgress={setSghAsiaAiInProgress}
          />
        );

      case 4:
        return (
          <LegalValidationStep 
            formData={formData}
            errors={validationErrors}
          />
        );

      case 5:
        return (
          <ReviewSubmitStep 
            formData={formData} 
            setFormData={setFormData}
            errors={validationErrors}
          />
        );

      default:
        return null;
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  // Extract data from uploaded file
  const extractFromFile = async () => {
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

    // Show processing progress
    const progressInterval = setInterval(() => {
      setExtractionProgress(prev => {
        const newProgress = prev + (Math.random() * 10);
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 300);

    try {
      // Read file content
      const reader = new FileReader();

      // Create a promise to handle the FileReader
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            resolve(e.target.result);
          } else {
            reject(new Error('Failed to read file as text'));
          }
        };
        reader.onerror = () => reject(reader.error);

        // Read the file as text
        if (uploadedFile.type === 'application/pdf') {
          // For PDFs, extract the filename since we can't read PDF content directly in browser
          resolve(`AI System from document: ${uploadedFile.name}`);
        } else {
          reader.readAsText(uploadedFile);
        }
      });

      // Set a timeout to ensure the request doesn't hang indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      // Detect document type based on filename and content
      let documentType = 'unspecified';
      if (uploadedFile.name.toLowerCase().includes('technical') || 
          fileContent.toLowerCase().includes('technical specification')) {
        documentType = 'technical_specification';
      } else if (uploadedFile.name.toLowerCase().includes('datasheet') || 
                 fileContent.toLowerCase().includes('datasheet')) {
        documentType = 'datasheet';
      } else if (uploadedFile.name.toLowerCase().includes('manual') || 
                 uploadedFile.name.toLowerCase().includes('guide') || 
                 fileContent.toLowerCase().includes('user manual') ||
                 fileContent.toLowerCase().includes('user guide')) {
        documentType = 'user_manual';
      } else if (uploadedFile.name.toLowerCase().includes('compliance') || 
                fileContent.toLowerCase().includes('compliance') ||
                fileContent.toLowerCase().includes('regulation')) {
        documentType = 'compliance_document';
      }
      
      // Use the enhanced suggest/system endpoint with document processing capabilities
      const response = await fetch('/api/suggest/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/-|_/g, " "),
          description: fileContent.substring(0, 5000), // Limit to first 5000 chars
          documentType: documentType,
          fileContent: fileContent.substring(0, 10000), // Limit to first 10000 chars for OCR processing
          fileName: uploadedFile.name
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const results = await response.json();
      clearInterval(progressInterval);
      setExtractionProgress(100);

      // Verify results
      if (!results || typeof results !== 'object') {
        throw new Error('Invalid response format');
      }

      setAiResults(results);
      setConfidenceScore(results.confidenceScore || 70);
      setAiExtractionStatus('success');

      toast({
        title: "File Processed Successfully",
        description: "We've extracted AI system details from your file."
      });

      setTimeout(() => {
        setExtractionProgress(0);
        setExtractionInProgress(false);
      }, 1000);

    } catch (error) {
      console.error('Error extracting from file:', error);
      clearInterval(progressInterval);
      setExtractionProgress(0);
      setAiExtractionStatus('error');
      setExtractionInProgress(false);

      let errorMessage = "There was an error processing your file.";
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "Request timed out. The service might be experiencing delays.";
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }

      toast({
        title: "File Processing Failed",
        description: errorMessage + " Please try again or enter details manually.",
        variant: "destructive"
      });

      // Generate fallback results to avoid breaking the UI
      setAiResults({
        name: uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/-|_/g, " "),
        vendor: "Unknown",
        version: "1.0",
        department: "Information Technology",
        purpose: "AI system extracted from document",
        aiCapabilities: "Natural Language Processing",
        trainingDatasets: "Proprietary data",
        outputTypes: "Text, Recommendations",
        usageContext: "Business operations",
        potentialImpact: "Improved efficiency",
        riskLevel: "Limited",
        confidenceScore: 60
      });
    }
  };

  // Apply a specific field from AI results
  const applyField = (field: string) => {
    if (aiResults && aiResults[field]) {
      const value = aiResults[field];
      console.log(`Applying field ${field} with value:`, value);
      
      // Create a new copy of formData for the update
      const newFormData = { ...formData };
      
      // Define a comprehensive field mapping to ensure all fields are properly mapped
      const fieldMapping: Record<string, string> = {
        // Direct field mappings (same name)
        'name': 'name',
        'description': 'description',
        'purpose': 'purpose',
        'version': 'version',
        'department': 'department',
        'vendor': 'vendor',
        'internalOwner': 'internalOwner',
        'systemId': 'systemId',
        'outputTypes': 'outputTypes',
        'usageContext': 'usageContext',
        'potentialImpact': 'potentialImpact',
        'aiCapabilities': 'aiCapabilities',
        'trainingDatasets': 'trainingDatasets',
        'riskLevel': 'riskLevel',
        'thirdPartyComponents': 'thirdPartyComponents',
        'humanOversight': 'humanOversight',
        'dataProtectionMeasures': 'dataProtectionMeasures',
        'accuracyMetrics': 'accuracyMetrics',
        'mitigationMeasures': 'mitigationMeasures',
        'maintenanceProcess': 'maintenanceProcess',
        
        // Field mappings with different names
        'riskClassification': 'riskLevel',
        'capabilities': 'aiCapabilities',
        'dataSources': 'trainingDatasets',
        'impactAssessment': 'potentialImpact',
        'oversight': 'humanOversight',
        'humanOversightMeasures': 'humanOversight', // Add mapping for humanOversightMeasures
        'oversightMeasures': 'humanOversight', // Add mapping for oversightMeasures
        'dataProtection': 'dataProtectionMeasures',
        'dataPrivacyMeasures': 'dataProtectionMeasures', // Add mapping for dataPrivacyMeasures
        'privacyMeasures': 'dataProtectionMeasures', // Add mapping for privacyMeasures
        'security': 'securityMeasures',
        'accuracy': 'accuracyMetrics',
        'mitigation': 'mitigationMeasures',
        'maintenance': 'maintenanceProcess',
        'compliance': 'complianceMeasures',
        'thirdParty': 'thirdPartyComponents'
      };
      
      // Get the corresponding form field name from the mapping
      const formField = fieldMapping[field] || field.charAt(0).toLowerCase() + field.slice(1);
      
      // Update the field in the form data
      if (formField in newFormData) {
        (newFormData as any)[formField] = value;
        console.log(`✅ Successfully updated ${formField} with value from ${field}`);
      } else {
        // If field doesn't exist in our direct mapping, try more variations
        const alternateFieldName = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        const camelCaseField = field.charAt(0).toLowerCase() + field.slice(1);
        
        if (alternateFieldName in newFormData) {
          (newFormData as any)[alternateFieldName] = value;
          console.log(`✅ Successfully updated ${alternateFieldName} with value from ${field}`);
        } else if (camelCaseField in newFormData) {
          (newFormData as any)[camelCaseField] = value;
          console.log(`✅ Successfully updated ${camelCaseField} with value from ${field}`);
        } else {
          console.warn(`⚠️ Field ${field} does not have a corresponding form field`);
        }
      }
      
      // Update form data with all changes
      setFormData(newFormData);
      
      // Clear any validation errors related to this field
      const normalizedFieldName = fieldMapping[field] || field;
      
      // Create a list of potential validation error keys
      const potentialErrorKeys = [
        field, 
        normalizedFieldName,
        normalizedFieldName.charAt(0).toLowerCase() + normalizedFieldName.slice(1)
      ];
      
      // Clear validation errors for any matching keys
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        potentialErrorKeys.forEach(key => {
          if (newErrors[key]) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
      
      // Also update missingFields list
      setMissingFields(prev => {
        return prev.filter(item => !potentialErrorKeys.includes(item));
      });
      
      // Show toast notification for confirmation
      toast({
        title: "Field Applied",
        description: `Applied "${field.replace(/([A-Z])/g, ' $1').trim()}" to the form`,
      });
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

  // Show the guidance modal before starting auto-fill
  const showAutoFillGuidance = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowGuidanceModal(true);
  };
  
  // Handle starting the auto-fill process after guidance
  const handleStartAutoFill = (template?: string) => {
    // If a template was selected, use it as input
    if (template) {
      setAiTextInput(template);
    }
    
    // Close the guidance modal
    setShowGuidanceModal(false);
    
    // Show the AI modal with process tab for visualization
    setAiModalOpen(true);
    setAiTab('process');
    
    // Initialize the steps for visualization
    const initialSteps = [...getDefaultAutoFillSteps()].map(step => ({
      ...step,
      status: step.id === 'input' ? 'complete' as const : 
              step.id === 'web_research' ? 'processing' as const : 
              'pending' as const
    }));
    setAutoFillSteps(initialSteps);
    setCurrentAutoFillStep('web_research');
    
    // Start progress visualization
    setExtractionInProgress(true);
    setExtractionProgress(10);
    
    // Start the actual AI suggestion process with visualization updates
    getAiSuggestions(template, true);
  };
  
  // AI-powered suggestions from name or description
  const getAiSuggestions = async (templateText?: string, visualizeSteps: boolean = false) => {
    const systemDescription = templateText || formData.name || formData.description || aiTextInput;
    if (!systemDescription || systemDescription.trim().length < 5) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please provide a more detailed system name or description (at least 5 characters) to generate accurate suggestions.",
      });
      return;
    }

    console.log("Generating suggestions for:", systemDescription);

    setExtractionInProgress(true);
    setAiExtractionStatus('extracting');
    
    // Reset and update steps for the process visualization
    const updatedSteps = [...autoFillSteps].map(step => ({
      ...step,
      status: step.id === 'input' ? 'complete' as const : 
              step.id === 'ai_analysis' ? 'processing' as const : 
              'pending' as const
    }));
    setAutoFillSteps(updatedSteps);
    setCurrentAutoFillStep('ai_analysis');
    
    // Show the auto-fill modal with the process visualization
    setAiModalOpen(true);
    setAiTab('process');

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setExtractionProgress(prev => {
        const newProgress = prev + (Math.random() * 12);
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 500);

    try {
      // Update process steps to show progress
      if (visualizeSteps) {
        // After a delay, update to show next step (web research)
        setTimeout(() => {
          const updatedSteps = [...autoFillSteps].map(step => ({
            ...step,
            status: step.id === 'input' ? 'complete' as const : 
                    step.id === 'web_research' ? 'complete' as const :
                    step.id === 'ai_analysis' ? 'complete' as const :
                    step.id === 'classification' ? 'processing' as const : 
                    'pending' as const
          }));
          setAutoFillSteps(updatedSteps);
          setCurrentAutoFillStep('classification');
        }, 3000);
      }

      // Set a timeout to ensure the request doesn't hang indefinitely
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 60000); // 60 second timeout (increased to prevent timeouts during processing)

      // Detect if the input appears to be a document type based on keywords
      let documentType = 'unspecified';
      const textInput = systemDescription || formData.description || aiTextInput || '';
      
      if (textInput.toLowerCase().includes('technical specification') || 
          textInput.toLowerCase().includes('specification document')) {
        documentType = 'technical_specification';
      } else if (textInput.toLowerCase().includes('datasheet')) {
        documentType = 'datasheet';
      } else if (textInput.toLowerCase().includes('user manual') || 
                textInput.toLowerCase().includes('user guide')) {
        documentType = 'user_manual';
      } else if (textInput.toLowerCase().includes('compliance document') || 
                textInput.toLowerCase().includes('regulation requirements')) {
        documentType = 'compliance_document';
      }
      
      const response = await fetch('/api/suggest/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name || aiTextInput,
          description: systemDescription || formData.description || aiTextInput,
          documentType: documentType
        }),
        signal: abortController.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const results = await response.json();
      clearInterval(progressInterval);
      setExtractionProgress(100);

      // Verify that we have valid results
      if (!results || typeof results !== 'object') {
        throw new Error('Invalid response format');
      }

      // Update to the final step (validation) and mark it complete
      if (visualizeSteps) {
        const finalSteps = [...autoFillSteps].map(step => ({
          ...step,
          status: step.id === 'validation' ? 'processing' as const : 
                  step.id === 'classification' || step.id === 'web_research' || 
                  step.id === 'ai_analysis' || step.id === 'input' ? 
                  'complete' as const : 'pending' as const
        }));
        setAutoFillSteps(finalSteps);
        setCurrentAutoFillStep('validation');
        
        // After a short delay, mark as complete
        setTimeout(() => {
          const completedSteps = [...finalSteps].map(step => ({
            ...step,
            status: step.id === 'validation' ? 'complete' as const : 
                    step.status
          }));
          setAutoFillSteps(completedSteps);
        }, 1500);
      }

      setAiResults(results);
      setConfidenceScore(results.confidenceScore || 75);
      setAiExtractionStatus('success');

      // If we received suggestions, show a success message
      toast({
        title: "AI Suggestions Generated",
        description: "AI suggestions have been generated based on your input.",
      });

      // First set to 100% to show completion (removes the "Processing..." text)
      setExtractionProgress(100);
      
      // Reset extraction status completely after a short delay
      setTimeout(() => {
        setExtractionInProgress(false);
        setExtractionProgress(0);
      }, 800);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      clearInterval(progressInterval);
      setExtractionProgress(0);
      setAiExtractionStatus('error');
      setExtractionInProgress(false);

      let errorMessage = "There was an error generating AI suggestions.";
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "Request timed out. The AI service might be experiencing delays.";
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }

      toast({
        title: "Suggestion Process Failed",
        description: errorMessage + " Please try again or enter details manually.",
        variant: "destructive"
      });

      // Clear results to show error state properly
      setAiResults(null);
    }
  };

  // Apply all AI suggestions to form
  const applyAllResults = () => {
    if (!aiResults) return;

    const newFormData = { ...formData };

    // Track which required fields are now filled
    const filledRequiredFields: string[] = [];

    // Explicitly map each field in a type-safe way
    // Handle standard fields
    if (aiResults.name) {
      newFormData.name = aiResults.name;
      filledRequiredFields.push('name');
    }
    
    if (aiResults.description) {
      newFormData.description = aiResults.description;
      filledRequiredFields.push('description');
    }
    
    if (aiResults.purpose) {
      newFormData.purpose = aiResults.purpose;
      filledRequiredFields.push('purpose');
    }
    
    if (aiResults.vendor) {
      newFormData.vendor = aiResults.vendor;
      filledRequiredFields.push('vendor');
    }
    
    if (aiResults.version) {
      newFormData.version = aiResults.version;
    }
    
    if (aiResults.department) {
      newFormData.department = aiResults.department;
      filledRequiredFields.push('department');
    }
    
    // Handle the new fields specifically for the technical details step
    if (aiResults.dataSources) {
      newFormData.dataSources = aiResults.dataSources;
    }
    
    // Handle boolean fields correctly
    if (aiResults.humansInLoop !== undefined) {
      newFormData.humansInLoop = !!aiResults.humansInLoop; // Convert to boolean
    }
    
    if (aiResults.usesPersonalData !== undefined) {
      newFormData.usesPersonalData = !!aiResults.usesPersonalData; // Convert to boolean
    }
    
    if (aiResults.usesSensitiveData !== undefined) {
      newFormData.usesSensitiveData = !!aiResults.usesSensitiveData; // Convert to boolean
    }
    
    if (aiResults.internalOwner) {
      newFormData.internalOwner = aiResults.internalOwner;
    }
    
    if (aiResults.systemId) {
      newFormData.systemId = aiResults.systemId;
    }
    
    // Handle AI capabilities fields
    if (aiResults.aiCapabilities) {
      newFormData.aiCapabilities = aiResults.aiCapabilities;
    }
    
    if (aiResults.trainingDatasets) {
      newFormData.trainingDatasets = aiResults.trainingDatasets;
    }
    
    if (aiResults.outputTypes) {
      newFormData.outputTypes = aiResults.outputTypes;
    }
    
    if (aiResults.usageContext) {
      newFormData.usageContext = aiResults.usageContext;
    }
    
    if (aiResults.potentialImpact) {
      newFormData.potentialImpact = aiResults.potentialImpact;
    }
    
    // Handle special case mappings
    if (aiResults.capabilities) {
      newFormData.aiCapabilities = aiResults.capabilities;
    }
    
    if (aiResults.dataSources) {
      newFormData.trainingDatasets = aiResults.dataSources;
    }
    
    // Risk level handling - try multiple possible field names
    const riskFieldNames = ['riskLevel', 'riskClassification', 'risk_level', 'risk', 'euRiskLevel'];
    
    for (const fieldName of riskFieldNames) {
      if (aiResults[fieldName]) {
        let riskValue = aiResults[fieldName];
        
        // Normalize the risk level value
        if (typeof riskValue === 'string') {
          const riskValueLower = riskValue.toLowerCase();
          
          // Map different formats to our expected values
          if (riskValueLower.includes('high')) {
            newFormData.riskLevel = 'High';
          } else if (riskValueLower.includes('limit')) {
            newFormData.riskLevel = 'Limited';
          } else if (riskValueLower.includes('minimal') || riskValueLower.includes('low')) {
            newFormData.riskLevel = 'Minimal';
          } else if (riskValueLower.includes('unaccept') || riskValueLower.includes('prohibit')) {
            newFormData.riskLevel = 'Unacceptable';
          } else {
            // First try to match with our riskLevel ids directly
            const matchingRiskLevel = riskLevels.find(rl => 
              rl.id.toLowerCase() === riskValueLower || 
              rl.name.toLowerCase() === riskValueLower
            );
            
            if (matchingRiskLevel) {
              newFormData.riskLevel = matchingRiskLevel.id;
            } else {
              // Direct assignment if no pattern match
              newFormData.riskLevel = riskValue;
            }
          }
          
          console.log(`✅ Applied Risk Level from ${fieldName}:`, newFormData.riskLevel);
          filledRequiredFields.push('riskLevel');
          break; // Stop after first successful match
        }
      }
    }

    // Human Oversight handling - check all possible field names from API
    if (aiResults.humanOversight) {
      newFormData.humanOversight = aiResults.humanOversight;
      console.log('✅ Applied Human Oversight:', aiResults.humanOversight);
    } else if (aiResults.humanOversightMeasures) {
      newFormData.humanOversight = aiResults.humanOversightMeasures;
      console.log('✅ Applied Human Oversight from humanOversightMeasures:', aiResults.humanOversightMeasures);
    } else if (aiResults.oversight) {
      newFormData.humanOversight = aiResults.oversight;
      console.log('✅ Applied Human Oversight from oversight:', aiResults.oversight);
    } else if (aiResults.oversightMeasures) {
      newFormData.humanOversight = aiResults.oversightMeasures;
      console.log('✅ Applied Human Oversight from oversightMeasures:', aiResults.oversightMeasures);
    } else if (aiResults.humanInTheLoop) {
      newFormData.humanOversight = aiResults.humanInTheLoop;
      console.log('✅ Applied Human Oversight from humanInTheLoop:', aiResults.humanInTheLoop);
    }
    
    // Data Protection handling - check all possible field names from API
    if (aiResults.dataProtectionMeasures) {
      newFormData.dataProtectionMeasures = aiResults.dataProtectionMeasures;
      newFormData.dataProtection = aiResults.dataProtectionMeasures;
      console.log('✅ Applied Data Protection Measures:', aiResults.dataProtectionMeasures);
    } else if (aiResults.dataPrivacyMeasures) {
      newFormData.dataProtectionMeasures = aiResults.dataPrivacyMeasures;
      newFormData.dataProtection = aiResults.dataPrivacyMeasures;
      console.log('✅ Applied Data Protection from dataPrivacyMeasures:', aiResults.dataPrivacyMeasures);
    } else if (aiResults.dataProtection) {
      newFormData.dataProtectionMeasures = aiResults.dataProtection;
      newFormData.dataProtection = aiResults.dataProtection;
      console.log('✅ Applied Data Protection from dataProtection:', aiResults.dataProtection);
    } else if (aiResults.privacyMeasures) {
      newFormData.dataProtectionMeasures = aiResults.privacyMeasures;
      newFormData.dataProtection = aiResults.privacyMeasures;
      console.log('✅ Applied Data Protection from privacyMeasures:', aiResults.privacyMeasures);
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

  // Add logging for step changes
  useEffect(() => {
    console.log("Current step:", currentStep);
  }, [currentStep]);

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

      {/* Auto-fill Guidance Modal */}
      <AutoFillGuidanceModal 
        isOpen={showGuidanceModal}
        onClose={() => setShowGuidanceModal(false)}
        onStartAutoFill={handleStartAutoFill}
      />

      {/* AI Auto-fill Dialog */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SGH ASIA AI Auto-fill</DialogTitle>
            <DialogDescription>
              Let our AI analyze system details and auto-fill form fields for you
            </DialogDescription>
          </DialogHeader>

          <Tabs value={aiTab} onValueChange={setAiTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="input">Text Input</TabsTrigger>
              <TabsTrigger value="upload">File Upload</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
            </TabsList>
            <TabsContent value="input" className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div className="grid gap-3">
                    <Label htmlFor="aiTextInput">Enter AI System Description</Label>
                    <Textarea
                      id="aiTextInput"
                      className="min-h-[200px]"
                      placeholder="Enter a detailed description of the AI system you want to register..."
                      value={aiTextInput}
                      onChange={(e) => setAiTextInput(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        getAiSuggestions();
                      }} 
                      disabled={extractionInProgress || aiTextInput.length < 5}
                      className="px-6"
                    >
                      {extractionInProgress ? (
                        <>
                          <SparklesIcon className="mr-2 h-4 w-4 animate-pulse" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="mr-2 h-4 w-4" />
                          Generate Suggestions
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                  <h3 className="text-sm font-medium text-slate-700">Tips for Better Results</h3>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                    <li>Include the purpose and functionality of the AI system</li>
                    <li>Mention the technology stack being used</li>
                    <li>Describe who will use the system</li>
                    <li>Include any risk considerations</li>
                    <li>Specify data sources and security protocols</li>
                  </ul>
                  <div className="text-xs text-slate-600 mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <p className="font-medium text-blue-700">Example description:</p>
                    <p className="mt-1 italic text-blue-600">
                      "Our image recognition system uses convolutional neural networks to detect objects in photos for retail inventory management. It processes customer-uploaded images with consent, storing only anonymized data. The system is used by store managers to automate inventory counts."
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fileUpload">Upload System Documentation</Label>
                    <div 
                      className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-neutral-50 h-[180px] flex flex-col items-center justify-center"
                      onClick={() => document.getElementById('fileUpload')?.click()}
                    >
                      <UploadIcon className="h-10 w-10 mx-auto mb-3 text-neutral-400" />
                      <p className="text-sm text-neutral-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-neutral-400 mt-1">PDF, DOC, TXT (max 5MB)</p>
                      <input 
                        type="file" 
                        id="fileUpload" 
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                      />
                    </div>
                    {uploadedFile && (
                      <div className="flex items-center gap-2 mt-2 p-3 bg-slate-100 rounded-md border border-slate-200">
                        <FileTextIcon className="h-5 w-5 text-slate-700" />
                        <span className="text-sm truncate flex-1">{uploadedFile.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setUploadedFile(null)}
                          className="h-7 w-7 p-0"
                        >
                          <XIcon className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                  <h3 className="text-sm font-medium text-slate-700">Accepted File Types</h3>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-blue-500" />
                      <span>PDF Documents (.pdf)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-green-500" />
                      <span>Word Documents (.doc, .docx)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-gray-500" />
                      <span>Text Files (.txt)</span>
                    </li>
                  </ul>
                  <div className="text-xs text-slate-600 mt-4">
                    <p className="font-medium">File size limit: 5MB</p>
                    <p className="mt-1">For larger files, please split into multiple documents or use the text input option instead.</p>
                  </div>
                  <div className="mt-6">
                    <Button 
                      onClick={extractFromFile}
                      disabled={!uploadedFile || extractionInProgress}
                      className="w-full"
                    >
                      {extractionInProgress ? (
                        <>
                          <SparklesIcon className="mr-2 h-4 w-4 animate-pulse" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="mr-2 h-4 w-4" />
                          Extract From File
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="process" className="space-y-4 py-4">
              <div className="space-y-6">
                <div className="text-center py-2">
                  <h3 className="text-lg font-medium">AI Auto-fill Process</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                    Follow the steps below to automatically extract and analyze AI system information
                  </p>
                </div>
                
                <AutoFillProcessStepper steps={autoFillSteps} currentStepId={currentAutoFillStep} />
                
                <div className="bg-blue-50 p-4 rounded-md text-sm">
                  <div className="flex items-start">
                    <InfoIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">About our AI auto-fill technology:</p>
                      <p className="mt-1 text-blue-800">
                        This feature uses advanced AI to analyze your system description and 
                        automatically extract relevant information for EU AI Act compliance. 
                        Our AI doesn't use simple keyword matching - instead, it performs 
                        deep semantic analysis to accurately categorize systems according to 
                        EU AI Act classifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Extraction progress indicator removed as requested */}

          {aiResults && aiExtractionStatus === 'success' && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium">System Details Extracted</span>
                </div>
                <Badge variant="outline" className="bg-blue-50">
                  {confidenceScore}% Confidence
                </Badge>
              </div>

              <div className="border rounded-md divide-y">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(aiResults)
                    .filter(([key]) => key !== 'confidenceScore' && typeof aiResults[key] !== 'object')
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 hover:bg-neutral-50 border rounded-md">
                        <div className="flex-1 mr-2">
                          <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <p className="text-xs text-neutral-500 mt-1 truncate max-w-[350px]">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 shrink-0"
                          onClick={() => applyField(key)}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {aiExtractionStatus === 'error' && (
            <div className="rounded-md bg-red-50 p-4 my-4">
              <div className="flex">
                <AlertCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Extraction Failed</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>There was an error extracting information. Please try again or enter details manually.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAiModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={applyAllResults}
              disabled={!aiResults || aiExtractionStatus !== 'success'}
            >
              Apply All Fields
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Register AI System</CardTitle>
                {smartCompletionActive && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 flex items-center gap-1 cursor-help">
                          <ZapIcon className="h-3 w-3 animate-pulse" />
                          Smart Completion
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>AI is analyzing your input to suggest completions for missing fields in real-time.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <CardDescription>
                Add an AI system to your inventory to track EU AI Act compliance
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showAutoFillGuidance}
                  >
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    AI Auto-fill
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Upload documents or enter text to automatically extract AI system information and fill the form.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              {['Basic Information', 'AI Details', 'Risk Assessment', 'Documentation Preparation', 'Review & Submit'].map((step, index) => (
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
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show different step content based on currentStep */}
            {currentStep === 1 && (
              <BasicInformationStep 
                formData={formData} 
                setFormData={setFormData}
                errors={validationErrors}
                smartCompletionActive={smartCompletionActive}
              />
            )}

            {currentStep === 2 && (
              <TechnicalDetailsStep 
                formData={formData} 
                setFormData={setFormData}
                errors={validationErrors}
              />
            )}

            {currentStep === 3 && (
              <RiskAssessmentStep 
                formData={formData} 
                setFormData={setFormData}
                errors={validationErrors}
                sghAsiaAiResults={sghAsiaAiResults}
                setSghAsiaAiResults={setSghAsiaAiResults}
                sghAsiaAiInProgress={sghAsiaAiInProgress}
                setSghAsiaAiInProgress={setSghAsiaAiInProgress}
              />
            )}

            {currentStep === 4 && (
              <DocumentationStep 
                formData={formData}
                errors={validationErrors}
              />
            )}

            {currentStep === 5 && (
              <ReviewSubmitStep 
                formData={formData} 
                setFormData={setFormData}
                errors={validationErrors}
              />
            )}

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

              {currentStep < 5 ? (
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