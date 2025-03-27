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