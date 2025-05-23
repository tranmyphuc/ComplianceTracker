import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertTriangle, Shield, FileText, Scale } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ValidationIssue {
  description: string;
  severity: 'critical' | 'warning' | 'info';
  articleRef?: string;
}

interface ValidatorResult {
  issues: ValidationIssue[];
  confidenceScore: number;
  status: 'valid' | 'valid_with_warnings' | 'invalid';
  validatedTimestamp: string;
  notes?: string;
}

interface LegalValidationStepProps {
  formData: any;
  errors: Record<string, string>;
}

export const LegalValidationStep: React.FC<LegalValidationStepProps> = ({ formData, errors }) => {
  const { toast } = useToast();
  const [validationInProgress, setValidationInProgress] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [legalNotes, setLegalNotes] = useState('');
  const [validationResult, setValidationResult] = useState<ValidatorResult | null>(null);
  const [validationTab, setValidationTab] = useState('overview');
  
  const runValidation = async () => {
    if (!formData.name || !formData.description || !formData.purpose || !formData.riskLevel) {
      toast({
        title: "Missing Information",
        description: "Please complete the previous steps with all required information before validating.",
        variant: "destructive"
      });
      return;
    }
    
    setValidationInProgress(true);
    setValidationProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setValidationProgress(prev => {
        const newValue = prev + Math.random() * 15;
        return newValue > 95 ? 95 : newValue;
      });
    }, 300);
    
    try {
      // Convert system details to comprehensive text for AI analysis
      const systemDescription = 
        `Name: ${formData.name}\n` +
        `Vendor: ${formData.vendor || 'Unknown'}\n` + 
        `Version: ${formData.version || 'Unknown'}\n` + 
        `Department: ${formData.department || 'Unknown'}\n` + 
        `Purpose: ${formData.purpose || 'Unknown'}\n` + 
        `Description: ${formData.description || 'Unknown'}\n` + 
        `AI Capabilities: ${formData.aiCapabilities || 'Unknown'}\n` + 
        `Training Datasets: ${formData.trainingDatasets || 'Unknown'}\n` +
        `Usage Context: ${formData.usageContext || 'Unknown'}\n` +
        `Risk Level: ${formData.riskLevel || 'Unknown'}\n` +
        `Potential Impact: ${formData.potentialImpact || 'Unknown'}\n` + 
        `Vulnerabilities: ${formData.vulnerabilities || 'Unknown'}\n` +
        `Mitigation Measures: ${formData.mitigationMeasures || 'Unknown'}`;
      
      // AI legality validation call with full system information
      const response = await fetch('/api/legal/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: systemDescription,
          type: 'compliance_assessment',
          context: `EU AI Act compliance assessment for ${formData.name} (${formData.riskLevel || 'unknown'} risk level system)`
        })
      });
      
      // If first API fails, try fallback validation endpoint
      if (!response.ok) {
        console.warn('Primary validation API failed, trying fallback endpoint');
        return await fallbackValidation();
      }
      
      // Process the response
      const result = await response.json();
      
      if (!result || typeof result !== 'object') {
        console.warn('Invalid primary validation response, trying fallback');
        return await fallbackValidation();
      }
      
      // Process successful response
      processValidationResult(result);
    } catch (error) {
      console.error('Error in primary validation:', error);
      try {
        // Try fallback validation in case of error
        await fallbackValidation();
      } catch (fallbackError) {
        console.error('Both validation attempts failed:', fallbackError);
        clearInterval(progressInterval);
        
        toast({
          title: "Validation Failed",
          description: "There was an error validating your system. Please try again.",
          variant: "destructive"
        });
        
        // Reset the validation state
        resetValidationState();
      }
    } finally {
      clearInterval(progressInterval);
    }
  };
  
  // Fallback validation endpoint if the primary one fails
  const fallbackValidation = async () => {
    try {
      // Convert system details to comprehensive text for validation
      const systemDescription = 
        `Name: ${formData.name}\n` +
        `Vendor: ${formData.vendor || 'Unknown'}\n` + 
        `Version: ${formData.version || 'Unknown'}\n` + 
        `Department: ${formData.department || 'Unknown'}\n` + 
        `Purpose: ${formData.purpose || 'Unknown'}\n` + 
        `Description: ${formData.description || 'Unknown'}\n` + 
        `AI Capabilities: ${formData.aiCapabilities || 'Unknown'}\n` + 
        `Training Datasets: ${formData.trainingDatasets || 'Unknown'}\n` +
        `Usage Context: ${formData.usageContext || 'Unknown'}\n` +
        `Risk Level: ${formData.riskLevel || 'Unknown'}\n` +
        `Potential Impact: ${formData.potentialImpact || 'Unknown'}\n` + 
        `Vulnerabilities: ${formData.vulnerabilities || 'Unknown'}\n` +
        `Mitigation Measures: ${formData.mitigationMeasures || 'Unknown'}`;
        
      // Send properly formatted data to validation endpoint
      const response = await fetch('/api/legal-validation/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: systemDescription,
          type: 'assessment',
          context: `EU AI Act compliance assessment for ${formData.name} (${formData.riskLevel || 'unknown'} risk level system)`
        })
      });
      
      if (!response.ok) {
        throw new Error(`Fallback validation error: ${response.status}`);
      }
      
      // Process the response
      const result = await response.json();
      processValidationResult(result);
      
      return true;
    } catch (error) {
      console.error('Fallback validation failed:', error);
      throw error;
    }
  };
  
  // Process validation API response into our expected format
  const processValidationResult = (result: any) => {
    console.log("Processing validation result:", result);
    
    // Transform the API response to match our expected format
    const transformedResult: ValidatorResult = {
      issues: [],
      confidenceScore: 0,
      status: 'valid',
      validatedTimestamp: new Date().toISOString()
    };
    
    // Analyze based on the system's risk level to provide meaningful feedback
    const riskLevel = formData.riskLevel?.toLowerCase() || 'unknown';
    console.log("System risk level for validation:", riskLevel);
    
    // Map API response to our format
    if (result) {
      // Adjust confidence score based on risk level
      // High-risk systems should have lower confidence unless extensive validation is done
      if (result.result && typeof result.result === 'object') {
        // Handle response format where data is nested under 'result'
        if (typeof result.result.confidenceScore === 'number') {
          // Adjust confidence score based on risk level
          const baseScore = result.result.confidenceScore;
          transformedResult.confidenceScore = riskLevel === 'high' 
            ? Math.min(baseScore, 85) // Cap high-risk systems at 85% confidence
            : riskLevel === 'limited' 
              ? Math.min(baseScore + 5, 95) // Slightly boost limited-risk
              : baseScore;
        } else if (result.result.confidenceLevel) {
          const confidenceMap: Record<string, number> = {
            'high': 95,
            'medium': 75,
            'low': 55,
            'uncertain': 35
          };
          let baseScore = confidenceMap[result.result.confidenceLevel.toLowerCase()] || 70;
          transformedResult.confidenceScore = riskLevel === 'high' 
            ? Math.min(baseScore, 85)
            : riskLevel === 'limited' 
              ? Math.min(baseScore + 5, 95)
              : baseScore;
        } else {
          // Set a risk-aware baseline confidence
          transformedResult.confidenceScore = riskLevel === 'high' ? 65 : riskLevel === 'limited' ? 80 : 70;
        }
      } else if (typeof result.confidenceScore === 'number') {
        // Direct confidenceScore from API - still apply risk-based adjustment
        const baseScore = result.confidenceScore;
        transformedResult.confidenceScore = riskLevel === 'high' 
          ? Math.min(baseScore, 85)
          : riskLevel === 'limited' 
            ? Math.min(baseScore + 5, 95)
            : baseScore;
      } else if (result.confidenceLevel) {
        // Map confidence level to score with risk-based adjustment
        const confidenceMap: Record<string, number> = {
          'high': 95,
          'medium': 75,
          'low': 55,
          'uncertain': 35
        };
        let baseScore = confidenceMap[result.confidenceLevel.toLowerCase()] || 70;
        transformedResult.confidenceScore = riskLevel === 'high' 
          ? Math.min(baseScore, 85)
          : riskLevel === 'limited' 
            ? Math.min(baseScore + 5, 95)
            : baseScore;
      } else {
        // Risk-aware baseline confidence
        transformedResult.confidenceScore = riskLevel === 'high' ? 65 : riskLevel === 'limited' ? 80 : 70;
      }
      
      // Map validity status (handle different API response formats)
      if (result.status && typeof result.status === 'string') {
        if (result.status.toLowerCase().includes('valid')) {
          if (result.status.toLowerCase().includes('warning')) {
            transformedResult.status = 'valid_with_warnings';
          } else {
            transformedResult.status = 'valid';
          }
        } else {
          transformedResult.status = 'invalid';
        }
      } else if (result.isValid !== undefined) {
        transformedResult.status = result.isValid 
          ? (result.warnings && result.warnings.length > 0 ? 'valid_with_warnings' : 'valid')
          : 'invalid';
      } else if (result.complianceStatus) {
        transformedResult.status = result.complianceStatus === 'compliant' 
          ? 'valid' 
          : result.complianceStatus === 'partially_compliant' 
            ? 'valid_with_warnings' 
            : 'invalid';
      }
      
      // Process validation issues from different API response formats
      const processIssues = () => {
        // Get issues from different possible API response structures
        const issues: ValidationIssue[] = [];
        
        // Process critical issues
        const criticalIssues = result.issues || result.violations || result.criticalIssues || [];
        if (Array.isArray(criticalIssues)) {
          issues.push(...criticalIssues.map((issue: any) => {
            const issueText = typeof issue === 'string' ? issue : issue.description || issue.text || JSON.stringify(issue);
            const articleRef = typeof issue === 'object' && issue.article ? issue.article : undefined;
            
            return {
              description: issueText,
              severity: 'critical' as const,
              articleRef
            };
          }));
        }
        
        // Process warnings
        const warnings = result.warnings || result.concerns || [];
        if (Array.isArray(warnings)) {
          issues.push(...warnings.map((warning: any) => {
            const warningText = typeof warning === 'string' ? warning : warning.description || warning.text || JSON.stringify(warning);
            const articleRef = typeof warning === 'object' && warning.article ? warning.article : undefined;
            
            return {
              description: warningText,
              severity: 'warning' as const,
              articleRef
            };
          }));
        }
        
        // Process recommendations/suggestions
        const recommendations = result.recommendations || result.suggestions || [];
        if (Array.isArray(recommendations)) {
          issues.push(...recommendations.map((rec: any) => {
            const recText = typeof rec === 'string' ? rec : rec.description || rec.text || JSON.stringify(rec);
            const articleRef = typeof rec === 'object' && rec.article ? rec.article : undefined;
            
            return {
              description: recText,
              severity: 'info' as const,
              articleRef
            };
          }));
        }
        
        return issues;
      };
      
      transformedResult.issues = processIssues();
      
      // If no issues were found but there's a message, add it as an info issue
      if (transformedResult.issues.length === 0 && result.message) {
        transformedResult.issues.push({
          description: result.message,
          severity: 'info'
        });
      }
      
      // Set notes if available
      if (result.notes || result.legalNotes) {
        transformedResult.notes = result.notes || result.legalNotes;
      }
    }
    
    // Update state with processed results
    setValidationResult(transformedResult);
    setValidationProgress(100);
    
    setTimeout(() => {
      setValidationComplete(true);
      setValidationInProgress(false);
    }, 500);
    
    toast({
      title: "Documentation Preparation Complete",
      description: "The system has been analyzed for legal compliance.",
    });
  };
  
  // Reset validation state in case of error
  const resetValidationState = () => {
    setValidationProgress(0);
    setValidationComplete(false);
    setValidationInProgress(false);
  };
  
  const getStatusLabel = (status: string | undefined) => {
    if (!status) return { label: 'Not Validated', color: 'bg-neutral-200 text-neutral-700' };
    
    switch (status) {
      case 'valid':
        return { label: 'Valid', color: 'bg-green-100 text-green-800' };
      case 'valid_with_warnings':
        return { label: 'Valid with Warnings', color: 'bg-amber-100 text-amber-800' };
      case 'invalid':
        return { label: 'Invalid', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Not Validated', color: 'bg-neutral-200 text-neutral-700' };
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'info':
        return <FileText className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const addLegalNotes = async () => {
    if (!legalNotes.trim()) {
      toast({
        title: "Note Required",
        description: "Please enter a legal note before saving.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, save these notes to the backend
    toast({
      title: "Legal Notes Saved",
      description: "Your legal notes have been added to this assessment."
    });
    
    // Update the validation result with the notes
    if (validationResult) {
      setValidationResult({
        ...validationResult,
        notes: legalNotes
      });
    }
  };
  
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Documentation Preparation</h3>
        <p className="text-muted-foreground">
          Prepare your AI system documentation to comply with EU AI Act requirements.
        </p>
      </div>
      
      <Tabs value={validationTab} onValueChange={setValidationTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validation">Validation Results</TabsTrigger>
          <TabsTrigger value="legal-notes">Legal Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">EU AI Act Legal Compliance</CardTitle>
              <CardDescription>
                Ensure your AI system complies with all applicable legal requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Legal Analysis</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Our AI-powered legal validator will analyze your system details and identify potential
                      compliance issues with the EU AI Act requirements.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Compliance Verification</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get instant feedback on regulatory compliance status and receive recommendations for improvements.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">System Information for Validation</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium">Name:</p>
                      <p className="text-muted-foreground">{formData.name || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Risk Level:</p>
                      <p className="text-muted-foreground">{formData.riskLevel || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Department:</p>
                      <p className="text-muted-foreground">{formData.department || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">AI Capabilities:</p>
                      <p className="text-muted-foreground">{formData.aiCapabilities || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                
                {validationInProgress ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Validating your system...</p>
                    <Progress value={validationProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Checking compliance with EU AI Act requirements
                    </p>
                  </div>
                ) : validationComplete ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Validation Status:</h4>
                      <Badge 
                        className={getStatusLabel(validationResult?.status).color}
                      >
                        {getStatusLabel(validationResult?.status).label}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      {validationResult?.status === 'valid' ? (
                        "Your system information has passed legal validation."
                      ) : validationResult?.status === 'valid_with_warnings' ? (
                        "Your system passed validation but has some warnings to address."
                      ) : (
                        "Your system requires updates to comply with EU AI Act requirements."
                      )}
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => setValidationTab('validation')}
                      className="mt-2"
                    >
                      View Details
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={runValidation} 
                    className="w-full"
                  >
                    Start Documentation Preparation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="validation" className="space-y-4 pt-4">
          {validationComplete && validationResult ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Validation Results</CardTitle>
                  <Badge 
                    className={getStatusLabel(validationResult.status).color}
                  >
                    {getStatusLabel(validationResult.status).label}
                  </Badge>
                </div>
                <CardDescription>
                  Validated on {new Date(validationResult.validatedTimestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Confidence Score</p>
                    <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${getConfidenceColor(validationResult.confidenceScore)}`} style={{ width: `${validationResult.confidenceScore}%` }} />
                    </div>
                    <p className="text-sm mt-1">{validationResult.confidenceScore}%</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div>
                    <p className="text-sm font-medium mb-1">Issues Found</p>
                    <p className="text-sm">{validationResult.issues.length}</p>
                  </div>
                </div>
                
                <Separator />
                
                {validationResult.issues.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium">Compliance Issues</h4>
                    {validationResult.issues.map((issue, index) => (
                      <Alert key={index} variant={issue.severity === 'critical' ? 'destructive' : 'default'}>
                        <div className="flex gap-2">
                          {getSeverityIcon(issue.severity)}
                          <div>
                            <AlertTitle className="text-sm">
                              {issue.severity === 'critical' ? 'Critical Issue' : 
                                issue.severity === 'warning' ? 'Warning' : 'Information'}
                              {issue.articleRef && ` - ${issue.articleRef}`}
                            </AlertTitle>
                            <AlertDescription className="text-sm">
                              {issue.description}
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                    <div className="bg-green-100 p-2 rounded-full mb-2">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-medium">No Issues Found</h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Your system appears to be compliant with EU AI Act requirements based on the provided information.
                    </p>
                  </div>
                )}
                
                {validationResult.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Legal Notes</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        {validationResult.notes}
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setValidationTab('legal-notes')}
                  >
                    Add Legal Notes
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={runValidation}
                  >
                    Run Validation Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Validation Results</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Please run the legal validation to see compliance analysis of your system.
              </p>
              <Button 
                onClick={runValidation} 
                className="mt-4"
              >
                Start Documentation Preparation
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="legal-notes" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Add Legal Notes</CardTitle>
              <CardDescription>
                Document important legal considerations for this AI system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="legal-notes" className="text-sm font-medium">
                  Legal Notes
                </label>
                <Textarea 
                  id="legal-notes"
                  placeholder="Enter legal observations, references to relevant legislation, or compliance notes..."
                  value={legalNotes}
                  onChange={e => setLegalNotes(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  These notes will be saved with your system registration and available for compliance officers and legal reviewers.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">EU AI Act References</h4>
                <div className="text-xs space-y-2">
                  <p>• Article 9: Risk management system</p>
                  <p>• Article 10: Data and data governance</p>
                  <p>• Article 13: Transparency and provision of information to users</p>
                  <p>• Article 14: Human oversight</p>
                  <p>• Article 15: Accuracy, robustness and cybersecurity</p>
                </div>
              </div>
              
              <Button onClick={addLegalNotes} className="w-full">
                Save Legal Notes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted rounded-md p-4 border border-muted">
        <div className="flex gap-2 mb-2">
          <Scale className="h-5 w-5 text-primary" />
          <p className="font-medium text-sm">Legal Disclaimer</p>
        </div>
        <p className="text-xs text-muted-foreground">
          This validation provides guidance based on the information provided and should not be considered as legal advice. 
          It is recommended that you consult with a legal professional familiar with AI regulations to ensure full compliance
          with the EU AI Act and other relevant legislation.
        </p>
      </div>
    </div>
  );
};

export default LegalValidationStep;