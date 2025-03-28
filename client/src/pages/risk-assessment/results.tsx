
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  AlertTriangle, CheckCircle, FileDown, FileText, 
  Printer, ArrowRight, ChevronDown, ChevronUp, ArrowLeft,
  ShieldCheck, Gavel, Loader2, Trash2
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";
import { LegalDisclaimerSection, LegalValidationPanel } from "@/components/risk-assessment";
import { ConfidenceLevel } from "@/components/legal";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Component to display risk assessment results
const RiskAssessmentResults: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [openSections, setOpenSections] = React.useState<string[]>(['overview', 'classification']);
  const [activeTab, setActiveTab] = useState('assessment');
  const [validationLoaded, setValidationLoaded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Extract parameters from URL query string using window.location instead of wouter location
  const getParamsFromUrl = (): { systemId?: string; assessmentId?: string } => {
    // Use window.location.search to get query parameters
    const params = new URLSearchParams(window.location.search);
    const systemId = params.get('systemId') || undefined;
    const assessmentId = params.get('assessmentId') || undefined;
    
    console.log("Extracted query parameters:", { systemId, assessmentId });
    return { systemId, assessmentId };
  };
  
  // For debugging
  console.log("Current location:", location);
  console.log("Window location search:", window.location.search);
  
  const { systemId, assessmentId } = getParamsFromUrl();
  
  // Toggle section visibility
  const toggleSection = (section: string) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter(s => s !== section));
    } else {
      setOpenSections([...openSections, section]);
    }
  };
  
  // Check if a section is open
  const isSectionOpen = (section: string) => openSections.includes(section);
  
  // Fetch the system data
  const { data: system, isLoading: systemLoading } = useQuery({
    queryKey: ['/api/systems', systemId],
    queryFn: () => systemId ? apiRequest(`/api/systems/${systemId}`) : null,
    enabled: !!systemId
  });
  
  // Use the full assessment ID now that the API supports string IDs
  // Fetch the assessment data
  const { data: assessment, isLoading: assessmentLoading } = useQuery({
    queryKey: ['/api/risk-assessments', assessmentId],
    queryFn: () => assessmentId ? apiRequest(`/api/risk-assessments/${assessmentId}`) : null,
    enabled: !!assessmentId
  });
  
  // Delete assessment mutation
  const deleteAssessmentMutation = useMutation({
    mutationFn: () => {
      if (!assessmentId) return Promise.reject('No assessment ID provided');
      return apiRequest(`/api/risk-assessments/${assessmentId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/risk-assessments'] });
      toast({
        title: "Assessment Deleted",
        description: "Risk assessment has been successfully deleted",
        variant: "default"
      });
      // Navigate back to the risk assessment page
      navigate('/risk-assessment');
    },
    onError: (error) => {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the risk assessment. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Simulate validation loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setValidationLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!systemId || !assessmentId) {
      toast({
        title: "Missing Parameters",
        description: "System ID or Assessment ID is missing from the URL",
        variant: "destructive"
      });
    }
  }, [systemId, assessmentId, toast]);
  
  // If we're still loading data, show a loading indicator
  if (systemLoading || assessmentLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading assessment data...</p>
        </div>
      </div>
    );
  }
  
  // If data is missing, show an error
  if (!system || !assessment) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Data Missing</AlertTitle>
          <AlertDescription>
            Could not load the requested assessment data. Please check the URL parameters and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link to="/risk-assessment">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Risk Assessment
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Process the data for display - use only data from the API
  const assessmentData = {
    systemName: system.name,
    riskLevel: assessment.riskLevel,
    date: new Date(assessment.assessmentDate || Date.now()).toLocaleDateString(),
    assessmentId: assessment.assessmentId,
    riskScore: assessment.riskScore || 0,
    // Process risk parameters if they exist
    riskFactors: assessment.riskParameters ? 
      (typeof assessment.riskParameters === 'string' ? 
        JSON.parse(assessment.riskParameters) : 
        assessment.riskParameters) || [] : [],
    // Process relevant articles if they exist
    relevantArticles: assessment.euAiActArticles ? 
      (typeof assessment.euAiActArticles === 'string' ? 
        JSON.parse(assessment.euAiActArticles).map((article: string) => {
          const parts = article.split(':');
          return {
            id: parts[0].trim(),
            name: parts.slice(1).join(':').trim() || "EU AI Act Article",
            description: "Requirements related to this AI system category"
          };
        }) : 
        assessment.euAiActArticles.map((article: string) => {
          const parts = article.split(':');
          return {
            id: parts[0].trim(),
            name: parts.slice(1).join(':').trim() || "EU AI Act Article",
            description: "Requirements related to this AI system category"
          };
        })) : [],
    // Process compliance gaps if they exist
    complianceGaps: assessment.complianceGaps ? 
      (typeof assessment.complianceGaps === 'string' ? 
        JSON.parse(assessment.complianceGaps).map((gap: any) => 
          typeof gap === 'string' ? gap : gap.description || gap
        ) : 
        assessment.complianceGaps.map((gap: any) => 
          typeof gap === 'string' ? gap : gap.description || gap
        )) : [],
    // Process remediation actions if they exist
    mitigationMeasures: assessment.remediationActions ? 
      (typeof assessment.remediationActions === 'string' ? 
        JSON.parse(assessment.remediationActions) : 
        assessment.remediationActions) : []
  };
  
  console.log("Processed assessment data:", assessmentData);
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Risk Assessment Results</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Assessment ID: {assessmentData.assessmentId} | Date: {assessmentData.date}
          </p>
        </div>
      </div>
      
      {/* Tabs for Assessment and Legal Validation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="assessment" className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Assessment Results</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-1.5">
            <Gavel className="h-4 w-4" />
            <span>Legal Validation</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessment" className="mt-0">
          {/* Overview Section */}
          <Collapsible open={isSectionOpen('overview')} className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>System Overview</CardTitle>
                  <CollapsibleTrigger onClick={() => toggleSection('overview')} className="hover:bg-muted p-1 rounded">
                    {isSectionOpen('overview') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CollapsibleTrigger>
                </div>
                <CardDescription>{assessmentData.systemName}</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="grid gap-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Risk Classification</h3>
                      <p className="text-sm text-muted-foreground">EU AI Act compliance status</p>
                    </div>
                    <Badge variant={assessmentData.riskLevel === "High Risk" ? "destructive" : "default"} className="text-sm">
                      {assessmentData.riskLevel}
                    </Badge>
                  </div>
                  
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>High-Risk AI System</AlertTitle>
                    <AlertDescription>
                      This system is classified as high-risk under the EU AI Act Article 6.2 as it is used in employment context for evaluation of natural persons.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
          
          {/* Classification Section */}
          <Collapsible open={isSectionOpen('classification')} className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Classification Factors</CardTitle>
                  <CollapsibleTrigger onClick={() => toggleSection('classification')} className="hover:bg-muted p-1 rounded">
                    {isSectionOpen('classification') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CollapsibleTrigger>
                </div>
                <CardDescription>Key factors that influenced the risk classification</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    {assessmentData.riskFactors.length === 0 ? (
                      <Alert variant="default">
                        <AlertDescription>No risk factors have been identified for this assessment.</AlertDescription>
                      </Alert>
                    ) : (
                      assessmentData.riskFactors.map((factor, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{factor.name}</h3>
                            <Badge variant={factor.severity === "high" ? "destructive" : "default"}>
                              {factor.severity === "high" ? "High Impact" : "Medium Impact"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{factor.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
          
          {/* Relevant Articles Section */}
          <Collapsible open={isSectionOpen('articles')} className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Relevant EU AI Act Articles</CardTitle>
                  <CollapsibleTrigger onClick={() => toggleSection('articles')} className="hover:bg-muted p-1 rounded">
                    {isSectionOpen('articles') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CollapsibleTrigger>
                </div>
                <CardDescription>Articles that apply to this system</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    {assessmentData.relevantArticles.length === 0 ? (
                      <Alert variant="default">
                        <AlertDescription>No EU AI Act articles have been identified for this assessment.</AlertDescription>
                      </Alert>
                    ) : (
                      assessmentData.relevantArticles.map((article, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono">{article.id}</Badge>
                            <h3 className="font-semibold">{article.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{article.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
          
          {/* Compliance Gaps Section */}
          <Collapsible open={isSectionOpen('gaps')} className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Compliance Gaps</CardTitle>
                  <CollapsibleTrigger onClick={() => toggleSection('gaps')} className="hover:bg-muted p-1 rounded">
                    {isSectionOpen('gaps') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CollapsibleTrigger>
                </div>
                <CardDescription>Areas requiring improvement to ensure compliance</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    {assessmentData.complianceGaps.length === 0 ? (
                      <Alert variant="default">
                        <AlertDescription>No compliance gaps have been identified for this assessment.</AlertDescription>
                      </Alert>
                    ) : (
                      <ul className="list-disc pl-5 space-y-2">
                        {assessmentData.complianceGaps.map((gap, index) => (
                          <li key={index} className="text-muted-foreground">{gap}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
          
          {/* Mitigation Measures Section */}
          <Collapsible open={isSectionOpen('mitigation')} className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Recommended Mitigation Measures</CardTitle>
                  <CollapsibleTrigger onClick={() => toggleSection('mitigation')} className="hover:bg-muted p-1 rounded">
                    {isSectionOpen('mitigation') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CollapsibleTrigger>
                </div>
                <CardDescription>Actions to address compliance gaps</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    {assessmentData.mitigationMeasures.length === 0 ? (
                      <Alert variant="default">
                        <AlertDescription>No mitigation measures have been identified for this assessment.</AlertDescription>
                      </Alert>
                    ) : (
                      <ul className="space-y-2">
                        {assessmentData.mitigationMeasures.map((measure, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <Button variant="outline" asChild>
              <Link to="/risk-assessment/wizard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wizard
              </Link>
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/documentation/risk-assessment">
                  <FileText className="mr-2 h-4 w-4" /> View Documentation
                </Link>
              </Button>
              <Button asChild>
                <Link to="/compliance">
                  Continue to Compliance Plan <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="legal" className="mt-0">
          <div className="space-y-8">
            {/* Legal Validation Panel */}
            <LegalValidationPanel 
              assessmentText={`Risk Assessment for ${assessmentData.systemName}
              
Risk Level: ${assessmentData.riskLevel}
Assessment ID: ${assessmentData.assessmentId}
Date: ${assessmentData.date}

Key Findings:
- ${assessmentData.riskFactors.map(f => f.name + ': ' + f.description).join('\n- ')}

Relevant Articles:
- ${assessmentData.relevantArticles.map(a => a.id + ' ' + a.name).join('\n- ')}

Compliance Gaps:
- ${assessmentData.complianceGaps.join('\n- ')}

Mitigation Measures:
- ${assessmentData.mitigationMeasures.join('\n- ')}
`}
              assessmentId={assessmentData.assessmentId}
              systemId="sys-123"
              className="mb-4"
            />
            
            {/* Legal Disclaimer */}
            <LegalDisclaimerSection 
              riskLevel={assessmentData.riskLevel.split(' ')[0].toLowerCase()}
              confidenceLevel={ConfidenceLevel.MEDIUM}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the risk assessment
              with ID <span className="font-mono font-semibold">{assessmentData?.assessmentId}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteAssessmentMutation.mutate()}
              disabled={deleteAssessmentMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteAssessmentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RiskAssessmentResults;
