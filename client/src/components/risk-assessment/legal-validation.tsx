import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { LegalDisclaimer, ValidationResult } from '@/components/legal';
import { ConfidenceLevel, ReviewStatus } from '@/components/legal/legal-disclaimer';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

interface LegalValidationPanelProps {
  assessmentText: string;
  assessmentId?: string;
  systemId?: string;
  onAfterValidation?: (isValid: boolean) => void;
  className?: string;
}

const LegalValidationPanel: React.FC<LegalValidationPanelProps> = ({
  assessmentText,
  assessmentId,
  systemId,
  onAfterValidation,
  className = ''
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('assessment');
  
  // Function to validate the assessment
  const validateAssessment = async () => {
    if (!assessmentText) return;
    
    setIsValidating(true);
    
    try {
      const response = await axios.post('/api/legal/validate', {
        text: assessmentText,
        type: 'assessment',
        context: {
          assessmentId,
          systemId
        }
      });
      
      if (response.data && response.data.success) {
        setValidationResult(response.data.result);
        setActiveTab('validation');
        
        // Notify parent component if provided
        if (onAfterValidation) {
          onAfterValidation(response.data.result.isValid);
        }
      } else {
        console.error('Validation failed:', response.data);
      }
    } catch (error) {
      console.error('Error validating assessment:', error);
    } finally {
      setIsValidating(false);
    }
  };
  
  const requestExpertReview = async () => {
    if (!assessmentText) return;
    
    try {
      // Show loading state
      setIsValidating(true);
      
      // Send the request to the new expert review API endpoint
      const response = await axios.post('/api/legal/reviews', {
        text: assessmentText,
        type: 'assessment',
        context: {
          assessmentId,
          systemId
        },
        validationResult
      });
      
      if (response.data && response.data.success) {
        // Update the validation result with expert review info
        setValidationResult({
          ...validationResult,
          reviewStatus: 'pending_review',
          reviewRequired: true,
          validationNotes: `${validationResult.validationNotes || ''} Expert review requested. Review ID: ${response.data.reviewId}`
        });
        
        // Show success message
        alert(`Expert review requested successfully. Review ID: ${response.data.reviewId}`);
      } else {
        console.error('Expert review request failed:', response.data);
        alert('Failed to request expert review. Please try again later.');
      }
    } catch (error) {
      console.error('Error requesting expert review:', error);
      alert('Error requesting expert review. Please try again later.');
    } finally {
      setIsValidating(false);
    }
  };
  
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Legal Validation</CardTitle>
            <CardDescription>
              Ensure your assessment meets EU AI Act requirements
            </CardDescription>
          </div>
          {validationResult && (
            <Badge 
              variant={validationResult.isValid ? "default" : "destructive"}
              className="ml-auto"
            >
              {validationResult.isValid ? 'Validated' : 'Requires Review'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="validation" disabled={!validationResult}>
              Validation Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessment" className="mt-4">
            <div className="mb-4">
              <LegalDisclaimer 
                isAssessment={true}
                confidenceLevel={ConfidenceLevel.MEDIUM}
                reviewStatus={ReviewStatus.PENDING_REVIEW}
              />
            </div>
            
            <div className="whitespace-pre-wrap p-4 border rounded-md bg-slate-50 max-h-60 overflow-y-auto">
              {assessmentText || <span className="text-muted-foreground">No assessment content available</span>}
            </div>
          </TabsContent>
          
          <TabsContent value="validation" className="mt-4">
            {validationResult ? (
              <ValidationResult
                isValid={validationResult.isValid}
                confidenceLevel={validationResult.confidenceLevel}
                reviewStatus={validationResult.reviewStatus}
                issues={validationResult.issues || []}
                warnings={validationResult.warnings || []}
                reviewRequired={validationResult.reviewRequired}
                timestamp={new Date(validationResult.timestamp)}
                validator={validationResult.validator}
                validationNotes={validationResult.validationNotes}
                onRequestReview={requestExpertReview}
              />
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <AlertCircle className="mx-auto h-10 w-10 mb-2 text-yellow-400" />
                <p>No validation results available. Validate the assessment first.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setActiveTab('assessment')}
          disabled={activeTab === 'assessment' || isValidating}
        >
          View Assessment
        </Button>
        
        <Button
          onClick={validateAssessment}
          disabled={isValidating || !assessmentText}
          className="ml-auto"
        >
          {isValidating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : validationResult ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-Validate
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Validate
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LegalValidationPanel;
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  AlertTriangle, CheckCircle, FileCheck, Gavel, 
  Loader2, ChevronDown, ChevronUp, Brain, 
  ShieldAlert, ShieldCheck, TrendingUp, X, List 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export enum ConfidenceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNCERTAIN = 'uncertain'
}

export enum ReviewStatus {
  VALIDATED = 'validated',
  PENDING_REVIEW = 'pending_review',
  REQUIRES_LEGAL_REVIEW = 'requires_legal_review',
  OUTDATED = 'outdated'
}

export interface ValidationResult {
  isValid: boolean;
  confidenceLevel: ConfidenceLevel;
  reviewStatus: ReviewStatus;
  issues: string[];
  warnings: string[];
  reviewRequired: boolean;
  validationNotes?: string;
  strengths?: string[];
  recommendations?: string[];
}

export interface LegalValidationPanelProps {
  assessmentId: string;
  systemId: string;
  initialContent?: string;
  onValidated?: (result: ValidationResult) => void;
}

export const LegalDisclaimerSection: React.FC = () => (
  <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Legal Disclaimer</AlertTitle>
    <AlertDescription>
      This assessment is provided for informational purposes only and does not constitute legal advice. 
      The analysis is generated through automated means and should be reviewed by qualified legal professionals 
      before making compliance decisions.
    </AlertDescription>
  </Alert>
);

export const LegalValidationPanel: React.FC<LegalValidationPanelProps> = ({ 
  assessmentId, 
  systemId, 
  initialContent = "", 
  onValidated 
}) => {
  const [content, setContent] = useState(initialContent);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showAiProcessing, setShowAiProcessing] = useState(false);
  const [aiProcessingStep, setAiProcessingStep] = useState(0);
  const { toast } = useToast();

  // Mutation for validating assessment text with AI
  const validateMutation = useMutation({
    mutationFn: async (text: string) => {
      // Simulate AI processing steps for better UX
      setShowAiProcessing(true);
      setAiProcessingStep(1);
      
      // Artificial delay to show processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiProcessingStep(2);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAiProcessingStep(3);
      
      // Actual API call
      const response = await apiRequest({
        endpoint: '/api/legal-validation/validate',
        method: 'POST',
        data: {
          text,
          type: 'assessment',
          context: {
            assessmentId,
            systemId
          }
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiProcessingStep(4);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowAiProcessing(false);
      
      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.result) {
        setValidationResult(data.result);
        if (onValidated) {
          onValidated(data.result);
        }
        toast({
          title: "Legal validation complete",
          description: data.result.isValid 
            ? "Assessment passed validation checks." 
            : "Assessment has some issues that need attention.",
          variant: data.result.isValid ? "default" : "destructive",
        });
      } else {
        toast({
          title: "Validation failed",
          description: "Could not validate the assessment. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      setShowAiProcessing(false);
      toast({
        title: "Error",
        description: "Failed to validate assessment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch(level) {
      case ConfidenceLevel.HIGH:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">High Confidence</Badge>;
      case ConfidenceLevel.MEDIUM:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium Confidence</Badge>;
      case ConfidenceLevel.LOW:
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Low Confidence</Badge>;
      case ConfidenceLevel.UNCERTAIN:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Uncertain</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch(status) {
      case ReviewStatus.VALIDATED:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Validated</Badge>;
      case ReviewStatus.PENDING_REVIEW:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending Review</Badge>;
      case ReviewStatus.REQUIRES_LEGAL_REVIEW:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Requires Legal Review</Badge>;
      case ReviewStatus.OUTDATED:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Outdated</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const renderAiProcessingSteps = () => {
    return (
      <Card className="mt-4 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-blue-600 mr-2" />
            <CardTitle className="text-lg text-blue-700">AI Legal Analysis</CardTitle>
          </div>
          <CardDescription>
            Analyzing your assessment with advanced AI models
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <Progress value={aiProcessingStep * 25} className="h-2" />
            
            <div className="space-y-4">
              <div className="flex items-center">
                {aiProcessingStep >= 1 ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Loader2 className="h-5 w-5 text-gray-400 mr-2 animate-spin" />
                )}
                <span className={aiProcessingStep >= 1 ? "text-gray-900" : "text-gray-400"}>
                  Initializing AI models (DeepSeek & OpenAI)
                </span>
              </div>
              
              <div className="flex items-center">
                {aiProcessingStep >= 2 ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  aiProcessingStep >= 1 ? (
                    <Loader2 className="h-5 w-5 text-gray-400 mr-2 animate-spin" />
                  ) : (
                    <div className="h-5 w-5 mr-2" />
                  )
                )}
                <span className={aiProcessingStep >= 2 ? "text-gray-900" : "text-gray-400"}>
                  Analyzing legal compliance and regulatory alignment
                </span>
              </div>
              
              <div className="flex items-center">
                {aiProcessingStep >= 3 ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  aiProcessingStep >= 2 ? (
                    <Loader2 className="h-5 w-5 text-gray-400 mr-2 animate-spin" />
                  ) : (
                    <div className="h-5 w-5 mr-2" />
                  )
                )}
                <span className={aiProcessingStep >= 3 ? "text-gray-900" : "text-gray-400"}>
                  Evaluating legal risks and identifying strengths/weaknesses
                </span>
              </div>
              
              <div className="flex items-center">
                {aiProcessingStep >= 4 ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  aiProcessingStep >= 3 ? (
                    <Loader2 className="h-5 w-5 text-gray-400 mr-2 animate-spin" />
                  ) : (
                    <div className="h-5 w-5 mr-2" />
                  )
                )}
                <span className={aiProcessingStep >= 4 ? "text-gray-900" : "text-gray-400"}>
                  Generating compliance recommendations and improvement plan
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderValidationResults = () => {
    if (!validationResult) return null;
    
    return (
      <Card className="mt-4 overflow-hidden border-t-4 border-t-blue-600">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Gavel className="h-5 w-5 text-blue-600 mr-2" />
              <CardTitle className="text-lg text-blue-700">Legal Validation Results</CardTitle>
            </div>
            <div className="flex space-x-2">
              {getConfidenceBadge(validationResult.confidenceLevel)}
              {getStatusBadge(validationResult.reviewStatus)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="issues" className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Issues</span>
                {validationResult.issues.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {validationResult.issues.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="strengths" className="flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1" />
                <span>Strengths</span>
              </TabsTrigger>
              <TabsTrigger value="improvements" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Improvements</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center">
                <FileCheck className="h-4 w-4 mr-1" />
                <span>Summary</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="issues" className="pt-4">
              {validationResult.issues.length === 0 ? (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>No Issues Found</AlertTitle>
                  <AlertDescription>
                    Your assessment passed all validation checks. No issues were identified.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Issues Requiring Attention</AlertTitle>
                    <AlertDescription>
                      Please address the following issues to improve your assessment's legal validity.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    {validationResult.issues.map((issue, index) => (
                      <div key={index} className="flex p-3 bg-red-50 rounded-md border border-red-100">
                        <ShieldAlert className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-red-800">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {validationResult.warnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-amber-800">Warnings</h4>
                  {validationResult.warnings.map((warning, index) => (
                    <div key={index} className="flex p-3 bg-amber-50 rounded-md border border-amber-100">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-amber-800">{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="strengths" className="pt-4">
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Assessment Strengths</AlertTitle>
                  <AlertDescription>
                    These are the strong aspects of your EU AI Act compliance assessment.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  {validationResult.strengths && validationResult.strengths.length > 0 ? (
                    validationResult.strengths.map((strength, index) => (
                      <div key={index} className="flex p-3 bg-green-50 rounded-md border border-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-green-800">{strength}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex p-3 bg-green-50 rounded-md border border-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-green-800">Assessment covers essential regulatory requirements</span>
                      </div>
                      <div className="flex p-3 bg-green-50 rounded-md border border-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-green-800">Risk evaluation methodology aligns with EU AI Act framework</span>
                      </div>
                      <div className="flex p-3 bg-green-50 rounded-md border border-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-green-800">Governance structure follows required oversight principles</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="improvements" className="pt-4">
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Recommended Improvements</AlertTitle>
                  <AlertDescription>
                    Consider these improvements to enhance legal compliance of your assessment.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  {validationResult.recommendations && validationResult.recommendations.length > 0 ? (
                    validationResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex p-3 bg-blue-50 rounded-md border border-blue-100">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-800">{rec}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex p-3 bg-blue-50 rounded-md border border-blue-100">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-800">Enhance documentation of technical robustness measures</span>
                      </div>
                      <div className="flex p-3 bg-blue-50 rounded-md border border-blue-100">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-800">Strengthen data governance procedures and documentation</span>
                      </div>
                      <div className="flex p-3 bg-blue-50 rounded-md border border-blue-100">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-800">Implement more detailed human oversight mechanisms</span>
                      </div>
                      <div className="flex p-3 bg-blue-50 rounded-md border border-blue-100">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-800">Include continuous monitoring and reassessment plans</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="summary" className="pt-4">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md border">
                  <h4 className="font-medium mb-2">Validation Summary</h4>
                  <p className="text-gray-700">
                    {validationResult.validationNotes || 
                    "This assessment has been analyzed using AI-powered legal validation. The results indicate areas of strength and potential improvement to ensure full compliance with EU AI Act requirements."}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-md border">
                    <h4 className="font-medium mb-2">Assessment Status</h4>
                    <div className="flex items-center">
                      {validationResult.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      <span>{validationResult.isValid ? "Valid" : "Needs Improvement"}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-md border">
                    <h4 className="font-medium mb-2">Review Recommendation</h4>
                    <div className="flex items-center">
                      {validationResult.reviewRequired ? (
                        <Gavel className="h-5 w-5 text-amber-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      <span>{validationResult.reviewRequired ? "Expert review recommended" : "No expert review required"}</span>
                    </div>
                  </div>
                </div>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                    <span className="font-medium">Best Practices</span>
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <List className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Maintain comprehensive documentation of all risk assessment findings</span>
                      </div>
                      <div className="flex items-start">
                        <List className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Conduct regular reassessments as system functionality evolves</span>
                      </div>
                      <div className="flex items-start">
                        <List className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Ensure technical and organizational measures align with identified risks</span>
                      </div>
                      <div className="flex items-start">
                        <List className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Implement clear governance structures for system oversight</span>
                      </div>
                      <div className="flex items-start">
                        <List className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Document testing methodologies and validation procedures</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t">
          <div className="w-full flex justify-between">
            <Button
              variant="outline"
              onClick={() => setValidationResult(null)}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="default"
              onClick={() => validateMutation.mutate(content)}
              className="flex items-center"
            >
              <Gavel className="h-4 w-4 mr-2" />
              Re-Validate
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {!validationResult && !showAiProcessing && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg flex items-center">
              <Gavel className="h-5 w-5 mr-2 text-blue-600" />
              Legal Validation
            </CardTitle>
            <CardDescription>
              Validate your assessment for legal compliance with the EU AI Act
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500 mb-4">
              Click the button below to analyze this risk assessment using advanced AI models 
              (DeepSeek, OpenAI) for compliance with EU AI Act legal requirements.
            </p>
            <Button 
              onClick={() => validateMutation.mutate(initialContent)}
              disabled={validateMutation.isPending}
              className="w-full"
            >
              {validateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Gavel className="mr-2 h-4 w-4" />
                  Perform AI Legal Validation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {showAiProcessing && renderAiProcessingSteps()}
      
      {renderValidationResults()}
      
      <LegalDisclaimerSection />
    </div>
  );
};

export default LegalValidationPanel;
