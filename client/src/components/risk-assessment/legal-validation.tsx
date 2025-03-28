import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Gavel, 
  Loader2, 
  FileText, 
  Brain, 
  List, 
  ArrowRight,
  AlertCircle,
  BarChart4,
  Circle
} from 'lucide-react';

export interface ValidationResult {
  isValid: boolean;
  confidenceLevel: 'high' | 'medium' | 'low' | 'uncertain';
  reviewStatus: 'validated' | 'pending_review' | 'requires_legal_review' | 'outdated';
  issues: string[];
  warnings: string[];
  strengths: string[];
  recommendations: string[];
  reviewRequired: boolean;
  timestamp: Date;
  validator: 'ai' | 'expert' | 'system';
  validationNotes?: string;
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

const LegalValidationPanel: React.FC<LegalValidationPanelProps> = ({ 
  assessmentId, 
  systemId, 
  initialContent = "", 
  onValidated 
}) => {
  const [content, setContent] = useState(initialContent);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showAiProcessing, setShowAiProcessing] = useState(false);
  const [aiProcessingStep, setAiProcessingStep] = useState(0);
  const [currentTab, setCurrentTab] = useState('analysis');
  const { toast } = useToast();

  // Validate using backend API
  const validateMutation = {
    isPending: false,
    mutate: async (text: string) => {
      try {
        setShowAiProcessing(true);
        setAiProcessingStep(1);

        // Simulate first step of AI processing
        await new Promise(resolve => setTimeout(resolve, 800));
        setAiProcessingStep(2);

        // Simulate second step
        await new Promise(resolve => setTimeout(resolve, 1200));
        setAiProcessingStep(3);

        // Make actual API call
        const response = await axios.post('/api/legal-validation/validate', {
          text,
          type: 'assessment',
          context: {
            systemId,
            assessmentId
          }
        });

        if (response.data && response.data.success) {
          const result = response.data.result;
          setValidationResult(result);

          if (onValidated) {
            onValidated(result);
          }

          // Show success toast
          toast({
            title: result.isValid ? "Validation Successful" : "Validation Complete",
            description: result.isValid 
              ? "Assessment is valid according to EU AI Act requirements" 
              : "Assessment requires some improvements",
            variant: result.isValid ? "default" : "destructive",
          });
        } else {
          toast({
            title: "Validation failed",
            description: "Could not validate the assessment. Please try again.",
            variant: "destructive",
          });
        }

        setShowAiProcessing(false);
      } catch (error) {
        setShowAiProcessing(false);
        toast({
          title: "Error",
          description: "Failed to validate assessment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const renderAiProcessingSteps = () => {
    const steps = [
      { title: "Initializing AI models", description: "Preparing DeepSeek and OpenAI models for legal analysis" },
      { title: "Analyzing compliance", description: "Evaluating assessment against EU AI Act requirements" },
      { title: "Generating validation report", description: "Preparing detailed analysis with recommendations" }
    ];

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            AI Legal Validation in Progress
          </CardTitle>
          <CardDescription>
            Our advanced AI models are analyzing your assessment for legal compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <Progress value={(aiProcessingStep / steps.length) * 100} className="mb-4" />

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className={`mr-3 mt-0.5 ${
                  index < aiProcessingStep ? 'text-green-500' : 
                  index === aiProcessingStep ? 'text-blue-500 animate-pulse' : 
                  'text-gray-300'
                }`}>
                  {index < aiProcessingStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : index === aiProcessingStep ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${
                    index < aiProcessingStep ? 'text-green-700' : 
                    index === aiProcessingStep ? 'text-blue-700' : 
                    'text-gray-400'
                  }`}>{step.title}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderValidationResults = () => {
    if (!validationResult) return null;

    const getConfidenceBadge = (level: string) => {
      switch(level) {
        case 'high':
          return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">High Confidence</Badge>;
        case 'medium':
          return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium Confidence</Badge>;
        case 'low':
          return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Low Confidence</Badge>;
        default:
          return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Uncertain</Badge>;
      }
    };

    const getStatusBadge = (status: string) => {
      switch(status) {
        case 'validated':
          return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Validated</Badge>;
        case 'pending_review':
          return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Pending Review</Badge>;
        case 'requires_legal_review':
          return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Requires Legal Review</Badge>;
        case 'outdated':
          return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Outdated</Badge>;
        default:
          return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Unknown Status</Badge>;
      }
    };

    const strengthPercentage = validationResult.isValid ? 
      Math.min(80 + validationResult.strengths.length * 5, 100) : 
      Math.max(30, 100 - validationResult.issues.length * 15);

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Gavel className="h-5 w-5 mr-2 text-blue-600" />
              Legal Validation Results
            </CardTitle>
            <div className="flex space-x-2">
              {getConfidenceBadge(validationResult.confidenceLevel)}
              {getStatusBadge(validationResult.reviewStatus)}
            </div>
          </div>
          <CardDescription>
            AI-powered analysis of assessment compliance with EU AI Act requirements
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Overall Compliance Strength</span>
              <span className="text-sm font-medium">{strengthPercentage}%</span>
            </div>
            <Progress value={strengthPercentage} className="h-2.5" 
              style={{
                background: `linear-gradient(to right, 
                  ${strengthPercentage < 40 ? 'rgb(239, 68, 68)' : 
                    strengthPercentage < 70 ? 'rgb(234, 179, 8)' : 
                    'rgb(34, 197, 94)'
                  }, 
                  ${strengthPercentage < 40 ? 'rgb(248, 113, 113)' : 
                    strengthPercentage < 70 ? 'rgb(250, 204, 21)' : 
                    'rgb(74, 222, 128)'
                  })`
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-xl font-bold text-green-800">{validationResult.strengths.length}</span>
              <span className="text-sm text-green-600">Key Strengths</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
              <span className="text-xl font-bold text-red-800">{validationResult.issues.length}</span>
              <span className="text-sm text-red-600">Issues Found</span>
            </div>
          </div>

          <Tabs defaultValue="analysis" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="analysis" className="text-xs">Analysis</TabsTrigger>
              <TabsTrigger value="strengths" className="text-xs">Strengths</TabsTrigger>
              <TabsTrigger value="issues" className="text-xs">Issues</TabsTrigger>
              <TabsTrigger value="recommendations" className="text-xs">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              <div className="rounded-md bg-amber-50 p-4 mb-4">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">Validation Summary</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      {validationResult.validationNotes || 
                        (validationResult.isValid ? 
                          "This assessment appears compliant with EU AI Act requirements, with some recommendations for improvement." : 
                          "This assessment requires improvements to fully comply with EU AI Act requirements."
                        )
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">AI Validation Insights</h4>
                <p className="text-sm text-gray-600">
                  {validationResult.isValid ? 
                    "The assessment meets the core requirements of the EU AI Act, with strengths in risk identification and mitigation strategies." : 
                    "The assessment needs improvement in several areas to fully comply with EU AI Act requirements. Review the issues and recommendations tabs for detailed guidance."
                  }
                </p>
              </div>
            </TabsContent>

            <TabsContent value="strengths" className="space-y-3">
              {validationResult.strengths.length > 0 ? (
                validationResult.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start p-3 rounded-md border border-green-100 bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-green-800">{strength}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No specific strengths identified.</p>
              )}
            </TabsContent>

            <TabsContent value="issues" className="space-y-3">
              {validationResult.issues.length > 0 ? (
                validationResult.issues.map((issue, index) => (
                  <div key={index} className="flex items-start p-3 rounded-md border border-red-100 bg-red-50">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-800">{issue}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No significant issues identified.</p>
              )}

              {validationResult.warnings.length > 0 && (
                <>
                  <h4 className="font-medium text-gray-700 mt-4">Warnings</h4>
                  {validationResult.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start p-3 rounded-md border border-yellow-100 bg-yellow-50">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">{warning}</p>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-3">
              {validationResult.recommendations.length > 0 ? (
                validationResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start p-3 rounded-md border border-blue-100 bg-blue-50">
                    <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{recommendation}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No specific recommendations available.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="pt-0 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setValidationResult(null)}
            size="sm"
          >
            Reset
          </Button>
          <Button 
            variant="default" 
            onClick={() => validateMutation.mutate(content)}
            size="sm"
            disabled={validateMutation.isPending}
          >
            Re-validate
          </Button>
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
    </div>
  );
};

// Missing Circle component
const Circle: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`rounded-full border-2 ${className}`} style={{ width: '20px', height: '20px' }} />
);

export default LegalValidationPanel;