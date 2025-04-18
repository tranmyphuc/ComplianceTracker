import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircleIcon, ClipboardCheckIcon, AlertTriangleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { ValidationResult } from './validation-result';
import { ConfidenceLevel, ReviewStatus } from './legal-disclaimer';

interface LegalValidationPanelProps {
  systemId?: string;
  systemName?: string;
  systemDescription?: string;
  riskLevel?: string;
  onRequestReview?: () => void;
  onClose?: () => void;
}

export function LegalValidationPanel({
  systemId,
  systemName = "AI System",
  systemDescription = "",
  riskLevel = "High",
  onRequestReview,
  onClose
}: LegalValidationPanelProps) {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [activeTab, setActiveTab] = useState("automated");
  const [validationResult, setValidationResult] = useState<any>(null);
  
  // Function to validate the system
  const handleValidate = async () => {
    if (!systemId) {
      toast({
        title: "Validation Error",
        description: "System ID is required for validation",
        variant: "destructive"
      });
      return;
    }
    
    setIsValidating(true);
    
    try {
      // Fetch the actual assessment data for the system
      const assessmentResponse = await axios.get(`/api/risk-assessments/system/${systemId}/latest`);
      
      // If there's no assessment for this system, use basic system details
      let textToValidate = '';
      let assessmentId = '';
      
      if (assessmentResponse.data && assessmentResponse.data.assessmentId) {
        const assessment = assessmentResponse.data;
        assessmentId = assessment.assessmentId;
        
        // Parse JSON arrays if they're stored as strings
        const euAiActArticles = typeof assessment.euAiActArticles === 'string' 
          ? JSON.parse(assessment.euAiActArticles) 
          : assessment.euAiActArticles || [];
          
        const complianceGaps = typeof assessment.complianceGaps === 'string'
          ? JSON.parse(assessment.complianceGaps)
          : assessment.complianceGaps || [];
          
        const remediationActions = typeof assessment.remediationActions === 'string'
          ? JSON.parse(assessment.remediationActions)
          : assessment.remediationActions || [];
        
        // Generate text from the actual assessment data
        textToValidate = `
          System Name: ${systemName}
          System ID: ${systemId}
          Assessment ID: ${assessment.assessmentId}
          Risk Level: ${assessment.riskLevel}
          Risk Score: ${assessment.riskScore}
          System Category: ${assessment.systemCategory}
          
          This AI system is categorized as a ${assessment.riskLevel} risk system under the EU AI Act.
          
          Relevant EU AI Act Articles:
          ${euAiActArticles.map((article: string) => `- ${article}`).join('\n')}
          
          Identified Compliance Gaps:
          ${complianceGaps.map((gap: string) => `- ${gap}`).join('\n')}
          
          Recommended Remediation Actions:
          ${remediationActions.map((action: string) => `- ${action}`).join('\n')}
          
          Additional Notes:
          ${assessment.summaryNotes || 'No additional notes provided.'}
        `;
      } else {
        // Fallback to basic system info if no assessment exists
        textToValidate = `
          System Name: ${systemName}
          System Description: ${systemDescription}
          Risk Level: ${riskLevel || 'Unknown'}
          
          This AI system requires validation against the EU AI Act requirements.
          Without a completed risk assessment, detailed compliance analysis is limited.
          A full risk assessment is recommended to determine specific requirements.
        `;
      }
      
      // Call validation API with the real assessment data
      const response = await axios.post('/api/legal/validate', {
        text: textToValidate,
        type: 'assessment',
        context: {
          systemId,
          assessmentId
        }
      });
      
      if (response.data && response.data.success) {
        setValidationResult(response.data.result);
        toast({
          title: "Validation Complete",
          description: "Legal validation was completed successfully",
        });
      } else {
        throw new Error("Validation failed");
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast({
        title: "Validation Error",
        description: "There was an error validating the system",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  // Function to request expert review
  const handleRequestExpertReview = async () => {
    if (!systemId) {
      toast({
        title: "Error",
        description: "System ID is required to request an expert review",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Fetch the latest assessment data for the system
      const assessmentResponse = await axios.get(`/api/risk-assessments/system/${systemId}/latest`);
      
      let assessmentText = '';
      let assessmentId = '';
      
      if (assessmentResponse.data && assessmentResponse.data.assessmentId) {
        const assessment = assessmentResponse.data;
        assessmentId = assessment.assessmentId;
        
        // Parse JSON arrays if they're stored as strings
        const euAiActArticles = typeof assessment.euAiActArticles === 'string' 
          ? JSON.parse(assessment.euAiActArticles) 
          : assessment.euAiActArticles || [];
          
        const complianceGaps = typeof assessment.complianceGaps === 'string'
          ? JSON.parse(assessment.complianceGaps)
          : assessment.complianceGaps || [];
          
        const remediationActions = typeof assessment.remediationActions === 'string'
          ? JSON.parse(assessment.remediationActions)
          : assessment.remediationActions || [];
        
        // Generate text from the actual assessment data
        assessmentText = `
          System Name: ${systemName}
          System ID: ${systemId}
          Assessment ID: ${assessment.assessmentId}
          Risk Level: ${assessment.riskLevel}
          Risk Score: ${assessment.riskScore}
          System Category: ${assessment.systemCategory}
          
          This AI system is categorized as a ${assessment.riskLevel} risk system under the EU AI Act.
          
          Relevant EU AI Act Articles:
          ${euAiActArticles.map((article: string) => `- ${article}`).join('\n')}
          
          Identified Compliance Gaps:
          ${complianceGaps.map((gap: string) => `- ${gap}`).join('\n')}
          
          Recommended Remediation Actions:
          ${remediationActions.map((action: string) => `- ${action}`).join('\n')}
          
          Additional Notes:
          ${assessment.summaryNotes || 'No additional notes provided.'}
        `;
      } else {
        // Fallback to basic system info if no assessment exists
        assessmentText = `
          System Name: ${systemName}
          System Description: ${systemDescription}
          Risk Level: ${riskLevel || 'Unknown'}
          
          This AI system requires expert legal review for EU AI Act compliance.
          No risk assessment data is available for this system.
        `;
      }
      
      // Send expert review request
      const response = await axios.post('/api/legal/expert-review', {
        text: assessmentText,
        type: 'assessment',
        context: {
          systemId,
          assessmentId
        }
      });
      
      if (response.data && response.data.success) {
        toast({
          title: "Review Requested",
          description: "Expert legal review has been requested for this system",
        });
        
        if (onRequestReview) {
          onRequestReview();
        }
      } else {
        throw new Error("Failed to request expert review");
      }
    } catch (error) {
      console.error("Error requesting expert review:", error);
      toast({
        title: "Request Error",
        description: "There was an error requesting an expert review",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="w-full max-w-4xl">
      <Tabs defaultValue="automated" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="automated">Automated Validation</TabsTrigger>
          <TabsTrigger value="expert">Expert Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="automated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 mr-2 text-primary" />
                Automated Legal Validation
              </CardTitle>
              <CardDescription>
                Verify EU AI Act compliance with automated analysis of your system description and documentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border">
                <AlertTitle className="flex items-center font-medium">
                  <AlertTriangleIcon className="h-4 w-4 mr-2" />
                  Important Information
                </AlertTitle>
                <AlertDescription>
                  <p className="mt-2 text-sm">
                    Automated validation provides an initial assessment of legal compliance but is not a substitute for expert legal review, 
                    especially for high-risk AI systems. For comprehensive legal assurance, request an expert review.
                  </p>
                </AlertDescription>
              </Alert>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">System Information</h3>
                <div className="bg-muted/50 p-3 rounded-md text-sm">
                  <p><span className="font-medium">System:</span> {systemName}</p>
                  <p><span className="font-medium">Risk Level:</span> {riskLevel}</p>
                  <p className="mt-1"><span className="font-medium">Description:</span> {systemDescription || "No description provided"}</p>
                </div>
              </div>
              
              {validationResult ? (
                <ValidationResult
                  isValid={validationResult.isValid}
                  confidenceLevel={validationResult.confidenceLevel || ConfidenceLevel.MEDIUM}
                  reviewStatus={validationResult.reviewStatus || ReviewStatus.PENDING_REVIEW}
                  issues={validationResult.issues || []}
                  warnings={validationResult.warnings || []}
                  reviewRequired={validationResult.reviewRequired}
                  timestamp={new Date(validationResult.timestamp) || new Date()}
                  validator="ai"
                  validationNotes={validationResult.validationNotes}
                  onRequestReview={handleRequestExpertReview}
                />
              ) : (
                <div className="flex justify-center py-6">
                  <Button onClick={handleValidate} disabled={isValidating}>
                    {isValidating ? (
                      <>Validating...</>
                    ) : (
                      <>
                        <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                        Start Validation
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <p className="text-xs text-muted-foreground">
                Validation results are based on current understanding of EU AI Act requirements
              </p>
              
              {validationResult && (
                <Button variant="outline" size="sm" onClick={() => setValidationResult(null)}>
                  Reset Validation
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="expert" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-primary" />
                Expert Legal Review
              </CardTitle>
              <CardDescription>
                Request comprehensive legal review from our expert team for full compliance assurance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border bg-primary/5">
                <AlertTitle className="flex items-center font-medium">
                  <AlertCircleIcon className="h-4 w-4 mr-2" />
                  Why Expert Review?
                </AlertTitle>
                <AlertDescription>
                  <p className="mt-2 text-sm">
                    Expert legal review is strongly recommended for all high-risk AI systems under 
                    the EU AI Act. Our legal experts provide comprehensive analysis and customized 
                    compliance recommendations specific to your industry and use case.
                  </p>
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Review Process</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-card border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2">1</div>
                        <h4 className="font-medium">Document Review</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive review of system documentation and technical specifications
                      </p>
                    </div>
                    
                    <div className="bg-card border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2">2</div>
                        <h4 className="font-medium">Legal Analysis</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        In-depth legal assessment against all applicable EU AI Act provisions
                      </p>
                    </div>
                    
                    <div className="bg-card border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2">3</div>
                        <h4 className="font-medium">Compliance Report</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Detailed compliance report with actionable recommendations
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Expert Review Benefits</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Comprehensive legal analysis specific to your industry and use case</li>
                    <li>Identification of non-obvious compliance gaps and risks</li>
                    <li>Detailed mitigation strategies with implementation guidance</li>
                    <li>Certification documentation for regulatory submissions</li>
                    <li>Ongoing support for evolving compliance requirements</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button onClick={handleRequestExpertReview}>
                  Request Expert Review
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Expert reviews are typically completed within 5-7 business days with priority options available
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {onClose && (
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
}

export default LegalValidationPanel;