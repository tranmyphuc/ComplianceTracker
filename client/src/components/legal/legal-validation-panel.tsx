import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertTriangle, FileText, XCircle } from "lucide-react";
import { ValidationResult } from './validation-result';
import { LegalDisclaimer, ConfidenceLevel, ReviewStatus } from './legal-disclaimer';

export interface LegalValidationPanelProps {
  assessmentText: string;
  onValidate?: (text: string) => Promise<any>;
  onRequestReview?: (text: string, result: any) => Promise<void>;
  className?: string;
}

export const LegalValidationPanel: React.FC<LegalValidationPanelProps> = ({
  assessmentText,
  onValidate,
  onRequestReview,
  className = ''
}) => {
  const [text, setText] = useState(assessmentText);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("assessment");
  
  // Handle validation of assessment text
  const handleValidate = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    
    try {
      // If onValidate prop is provided, use it
      if (onValidate) {
        const result = await onValidate(text);
        setValidationResult(result);
      } else {
        // Mock validation result (will be replaced with actual API call)
        setTimeout(() => {
          const mockResult = {
            isValid: true,
            confidenceLevel: ConfidenceLevel.HIGH,
            reviewStatus: ReviewStatus.VALIDATED,
            issues: [],
            warnings: [
              "Reference to Article 6(2) is correct, but consider including more specific subsections.",
              "Consider adding details about record-keeping requirements for high-risk systems."
            ],
            reviewRequired: false,
            timestamp: new Date(),
            validator: 'ai' as const,
            validationNotes: "This assessment correctly identifies the system as high-risk under Article 6(2) and lists appropriate requirements. The assessment is legally sound but could benefit from more specific references to subsections and expanded discussion of record-keeping requirements."
          };
          
          setValidationResult(mockResult);
          setLoading(false);
          setActiveTab("results");
        }, 1500);
      }
    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        isValid: false,
        confidenceLevel: ConfidenceLevel.LOW,
        reviewStatus: ReviewStatus.REQUIRES_LEGAL_REVIEW,
        issues: ["An error occurred during validation. Please try again."],
        warnings: [],
        reviewRequired: true,
        timestamp: new Date(),
        validator: 'system' as const
      });
      setLoading(false);
    }
  };
  
  // Handle requesting expert review
  const handleRequestReview = async () => {
    if (onRequestReview && validationResult) {
      await onRequestReview(text, validationResult);
    }
    // Show confirmation or feedback to user
    alert("Expert review requested. A legal professional will review this assessment.");
  };
  
  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assessment">Assessment Text</TabsTrigger>
          <TabsTrigger value="results" disabled={!validationResult && !loading}>
            Validation Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessment" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="assessment-text">Enter AI Assessment Text for Validation</Label>
              <Textarea
                id="assessment-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] mt-2"
                placeholder="Paste your AI-generated assessment text here for legal validation..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleValidate}
                disabled={loading || !text.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Validate Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Validating assessment for legal compliance...</p>
            </div>
          ) : validationResult ? (
            <div className="space-y-6">
              <ValidationResult
                {...validationResult}
                onRequestReview={handleRequestReview}
              />
              
              <div>
                <h3 className="font-medium mb-3">Assessment Text</h3>
                <Card>
                  <CardContent className="p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {text}
                    </pre>
                  </CardContent>
                </Card>
              </div>
              
              <LegalDisclaimer 
                confidenceLevel={validationResult.confidenceLevel}
                reviewStatus={validationResult.reviewStatus}
                isAssessment={true}
                issues={validationResult.issues}
                warnings={validationResult.warnings}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p>No validation results yet. Validate an assessment to see results.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalValidationPanel;