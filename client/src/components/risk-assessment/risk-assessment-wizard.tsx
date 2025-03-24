
import { useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  AlertCircleIcon, 
  CheckCircleIcon, 
  ChevronRightIcon,
  FileTextIcon,
  InfoIcon, 
  LightbulbIcon, 
  ListChecksIcon,
  ShieldIcon
} from "lucide-react";

export function RiskAssessmentWizard({ systemId }: { systemId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("initiate");
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    systemId: systemId || "",
    assessmentName: "",
    assessorName: "",
    assessmentDate: new Date().toISOString().split("T")[0],
    department: "",
    relevantStakeholders: "",
    // Prohibited use assessment
    socialScoring: false,
    vulnerabilityExploitation: false,
    subliminalTechniques: false,
    biometricIdentification: false,
    // High-risk determination
    biometricCategory: false,
    criticalInfrastructure: false,
    educationVocational: false,
    employmentWorkManagement: false,
    essentialServices: false,
    lawEnforcement: false,
    migrationAsylumBorder: false,
    justiceProcesses: false,
    // Risk parameters
    autonomyLevel: "medium",
    technicalMaturity: "medium",
    impactSeverity: "medium",
    scaleOfDeployment: "medium",
    userVulnerability: "medium"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextTab = (currentTabName: string) => {
    const tabs = ["initiate", "prohibited", "high-risk", "parameters", "results"];
    const currentIndex = tabs.indexOf(currentTabName);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const runAiAnalysis = async () => {
    if (!systemId) {
      toast({
        title: "System Required",
        description: "Please select a system to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setAiAnalysisLoading(true);
    
    try {
      // Use the correct endpoint to analyze the system risk
      const response = await fetch(`/api/risk-assessment/${systemId}/analyze`);
      
      if (!response.ok) {
        throw new Error(`Failed to analyze system risk: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data) {
        throw new Error("Analysis returned empty results");
      }
      
      // Transform the data to match the expected structure if needed
      const formattedData = {
        complianceScore: data.riskScore || 0,
        systemCategory: data.systemCategory || "Unknown",
        riskLevel: data.riskLevel?.toLowerCase() || "unknown",
        keyRiskFactors: data.keyRiskFactors || [],
        relevantArticles: data.applicableArticles || [],
        justification: data.justification || "",
      };
      
      setAiAnalysisResults(formattedData);
      
      toast({
        title: "AI Analysis Complete",
        description: "SGH ASIA AI has analyzed your system successfully",
      });
    } catch (error) {
      console.error("Error running AI analysis:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze system. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Here you would submit the assessment data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Assessment Submitted",
        description: "Your risk assessment has been saved successfully",
      });
      
      // Redirect to the system detail page or assessment summary
      if (systemId) {
        router.push(`/systems/${systemId}`);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSystem = () => {
    // This would register the assessment and update the system info
    toast({
      title: "System Registered",
      description: "The system risk assessment has been registered",
    });
    
    // Redirect to the system detail page
    if (systemId) {
      router.push(`/systems/${systemId}`);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <ShieldIcon className="mr-2 h-5 w-5 text-primary" />
          EU AI Act Risk Assessment
        </CardTitle>
        <CardDescription>
          Evaluate your AI system against EU AI Act requirements to determine risk classification.
        </CardDescription>
      </CardHeader>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="initiate">Initiate</TabsTrigger>
            <TabsTrigger value="prohibited">Prohibited Use</TabsTrigger>
            <TabsTrigger value="high-risk">High-Risk</TabsTrigger>
            <TabsTrigger value="parameters">Risk Parameters</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="initiate" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Assessment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessmentName">Assessment Name</Label>
                  <input
                    id="assessmentName"
                    name="assessmentName"
                    value={formData.assessmentName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input px-3 py-2"
                    placeholder="Q2 2024 Risk Assessment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assessorName">Assessor Name</Label>
                  <input
                    id="assessorName"
                    name="assessorName"
                    value={formData.assessorName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input px-3 py-2"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assessmentDate">Assessment Date</Label>
                  <input
                    id="assessmentDate"
                    name="assessmentDate"
                    type="date"
                    value={formData.assessmentDate}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input px-3 py-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input px-3 py-2"
                    placeholder="IT Department"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relevantStakeholders">Relevant Stakeholders</Label>
                <textarea
                  id="relevantStakeholders"
                  name="relevantStakeholders"
                  value={formData.relevantStakeholders}
                  onChange={(e) => setFormData({...formData, relevantStakeholders: e.target.value})}
                  className="w-full rounded-md border border-input px-3 py-2 min-h-[100px]"
                  placeholder="List stakeholders involved in this assessment"
                />
              </div>
              
              <div className="border rounded-md p-4 bg-primary/5">
                <h3 className="font-medium flex items-center">
                  <InfoIcon className="h-4 w-4 mr-2 text-primary" />
                  AI-Assisted Assessment
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Let our AI analyze your system against EU AI Act requirements to speed up the assessment process.
                </p>
                
                <div className="mt-4">
                  <Button 
                    type="button" 
                    onClick={runAiAnalysis}
                    disabled={aiAnalysisLoading}
                    className="gap-2"
                  >
                    {aiAnalysisLoading ? (
                      <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Analyzing with SGH ASIA AI...
                    </>
                    ) : (
                      <>
                        Run AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {aiAnalysisResults && (
                <div className="border rounded-md p-4 space-y-6 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">AI Analysis Results</h3>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Compliance Score: {aiAnalysisResults.complianceScore}%
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">System Classification</h4>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-neutral-700">
                          <p className="font-medium">Category:</p>
                          <p>{aiAnalysisResults.systemCategory}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Risk Classification</h4>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-neutral-700">
                          <p className="font-medium">Risk Level:</p>
                          <p>{aiAnalysisResults.riskLevel}</p>
                          <p className="mt-2 text-xs">{aiAnalysisResults.riskJustification}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Relevant EU AI Act Articles</h4>
                      <div className="border rounded-md p-3">
                        <ul className="text-sm text-neutral-700 list-disc pl-5 space-y-1">
                          {aiAnalysisResults.relevantArticles?.map((article: string, index: number) => (
                            <li key={index}>
                              {article}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  
                    <div className="space-y-3">
                      <h4 className="font-medium">Required Documentation</h4>
                      <div className="border rounded-md p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {aiAnalysisResults.requiredDocumentation?.map((doc: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircleIcon className="h-4 w-4 text-primary" />
                              {doc}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Suggested Improvements</h4>
                      <div className="border rounded-md p-3">
                        <div className="space-y-2">
                          {aiAnalysisResults.suggestedImprovements?.map((improvement: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="min-w-4 mt-0.5">
                                <LightbulbIcon className="h-4 w-4 text-primary" />
                              </div>
                              <p>{improvement}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      className="gap-2" 
                      onClick={handleRegisterSystem}
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Register this Assessment
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAiAnalysisResults(null)}>
                      Reset Analysis
                    </Button>
                  </div>
                </div>
              )}
              
              {!aiAnalysisResults && !aiAnalysisLoading && (
                <div className="text-neutral-500 text-center py-8">
                  <p>This section would include risk parameter evaluation based on:</p>
                  <ul className="list-disc list-inside text-left max-w-md mx-auto mt-4 space-y-2">
                    <li>Intended purpose of the system</li>
                    <li>Technical characteristics</li>
                    <li>Potential harm to individuals</li>
                    <li>Autonomy level of the system</li>
                    <li>Data quality and governance</li>
                    <li>Human oversight mechanisms</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => nextTab("initiate")}>
                Next Step <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="prohibited" className="space-y-4">
            <h3 className="text-lg font-medium">Prohibited Use Assessment</h3>
            <p className="text-sm text-muted-foreground">
              The EU AI Act prohibits certain AI applications. Evaluate your system against these criteria.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="socialScoring" 
                  name="socialScoring"
                  checked={formData.socialScoring}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, socialScoring: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="socialScoring" 
                    className="font-medium"
                  >
                    Social Scoring
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Does this system evaluate or classify individuals based on social behavior or characteristics in contexts unrelated to data origin?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="vulnerabilityExploitation" 
                  name="vulnerabilityExploitation"
                  checked={formData.vulnerabilityExploitation}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, vulnerabilityExploitation: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="vulnerabilityExploitation" 
                    className="font-medium"
                  >
                    Exploitation of Vulnerabilities
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Does this system exploit vulnerabilities of specific groups (age, disability, socioeconomic situation) to materially distort behavior?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="subliminalTechniques" 
                  name="subliminalTechniques"
                  checked={formData.subliminalTechniques}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, subliminalTechniques: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="subliminalTechniques" 
                    className="font-medium"
                  >
                    Subliminal Techniques
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Does this system use subliminal techniques beyond a person's consciousness to materially distort behavior in harmful ways?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="biometricIdentification" 
                  name="biometricIdentification"
                  checked={formData.biometricIdentification}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, biometricIdentification: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="biometricIdentification" 
                    className="font-medium"
                  >
                    Real-time Biometric Identification
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Does this system perform real-time remote biometric identification in publicly accessible spaces for law enforcement purposes?
                  </p>
                </div>
              </div>
            </div>
            
            {(formData.socialScoring || formData.vulnerabilityExploitation || 
              formData.subliminalTechniques || formData.biometricIdentification) && (
              <div className="bg-destructive/10 border-destructive/50 border rounded-md p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircleIcon className="h-5 w-5 text-destructive mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">Potential Prohibited Use Detected</h4>
                    <p className="text-sm mt-1">
                      Your system may fall under prohibited uses in Article 5 of the EU AI Act. Please consult with a legal expert before proceeding with implementation.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentTab("initiate")}>
                Previous
              </Button>
              <Button onClick={() => nextTab("prohibited")}>
                Next Step <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="high-risk" className="space-y-4">
            <h3 className="text-lg font-medium">High-Risk Determination</h3>
            <p className="text-sm text-muted-foreground">
              The EU AI Act designates certain AI systems as high-risk based on their application area. Check all that apply to your system.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="biometricCategory" 
                  name="biometricCategory"
                  checked={formData.biometricCategory}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, biometricCategory: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="biometricCategory" 
                    className="font-medium"
                  >
                    Biometric Identification and Categorization
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Does this system perform biometric identification or categorization of natural persons?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="criticalInfrastructure" 
                  name="criticalInfrastructure"
                  checked={formData.criticalInfrastructure}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, criticalInfrastructure: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="criticalInfrastructure" 
                    className="font-medium"
                  >
                    Critical Infrastructure
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this system used in management or operation of critical infrastructure (water, gas, heating, electricity, transport)?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="educationVocational" 
                  name="educationVocational"
                  checked={formData.educationVocational}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, educationVocational: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="educationVocational" 
                    className="font-medium"
                  >
                    Education and Vocational Training
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this system used to determine access to educational institutions or to evaluate students/participants?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="employmentWorkManagement" 
                  name="employmentWorkManagement"
                  checked={formData.employmentWorkManagement}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, employmentWorkManagement: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="employmentWorkManagement" 
                    className="font-medium"
                  >
                    Employment, Worker Management, and Self-Employment
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this system used for recruitment, promotion, termination, task allocation, performance monitoring, or behavior evaluation in work contexts?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="essentialServices" 
                  name="essentialServices"
                  checked={formData.essentialServices}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, essentialServices: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="essentialServices" 
                    className="font-medium"
                  >
                    Access to Essential Services
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this system used to evaluate eligibility for public assistance, creditworthiness, emergency services, or insurance premium services?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="lawEnforcement" 
                  name="lawEnforcement"
                  checked={formData.lawEnforcement}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, lawEnforcement: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="lawEnforcement" 
                    className="font-medium"
                  >
                    Law Enforcement
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this system used by law enforcement for individual risk assessments, lie detection, crime prediction, or emotion recognition?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="migrationAsylumBorder" 
                  name="migrationAsylumBorder"
                  checked={formData.migrationAsylumBorder}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, migrationAsylumBorder: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="migrationAsylumBorder" 
                    className="font-medium"
                  >
                    Migration, Asylum, and Border Control
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this system used for migration, asylum, or border control management, including security risk assessment or document verification?
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-md">
                <Checkbox 
                  id="justiceProcesses" 
                  name="justiceProcesses"
                  checked={formData.justiceProcesses}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, justiceProcesses: checked as boolean})
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="justiceProcesses" 
                    className="font-medium"
                  >
                    Administration of Justice and Democratic Processes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this system used to assist judicial authorities in researching, interpreting, or applying the law?
                  </p>
                </div>
              </div>
            </div>
            
            {(formData.biometricCategory || formData.criticalInfrastructure || 
              formData.educationVocational || formData.employmentWorkManagement || 
              formData.essentialServices || formData.lawEnforcement || 
              formData.migrationAsylumBorder || formData.justiceProcesses) && (
              <div className="bg-amber-50 border-amber-200 border rounded-md p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircleIcon className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">High-Risk System Detected</h4>
                    <p className="text-sm mt-1 text-amber-700">
                      Your system likely falls under high-risk categories in Annex III of the EU AI Act. Additional compliance requirements apply, including risk management, data governance, technical documentation, record-keeping, transparency, and human oversight.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentTab("prohibited")}>
                Previous
              </Button>
              <Button onClick={() => nextTab("high-risk")}>
                Next Step <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="parameters" className="space-y-4">
            <h3 className="text-lg font-medium">Risk Parameter Evaluation</h3>
            <p className="text-sm text-muted-foreground">
              Evaluate specific risk parameters to determine the overall risk profile of your AI system.
            </p>
            
            <div className="space-y-6 mt-6">
              <div className="space-y-3">
                <h4 className="font-medium">Autonomy Level</h4>
                <p className="text-sm text-muted-foreground">
                  To what extent does the system operate autonomously without human intervention?
                </p>
                
                <RadioGroup 
                  value={formData.autonomyLevel}
                  onValueChange={(value) => handleRadioChange("autonomyLevel", value)}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_low" id="autonomy_very_low" />
                    <Label htmlFor="autonomy_very_low">Very Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="autonomy_low" />
                    <Label htmlFor="autonomy_low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="autonomy_medium" />
                    <Label htmlFor="autonomy_medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="autonomy_high" />
                    <Label htmlFor="autonomy_high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_high" id="autonomy_very_high" />
                    <Label htmlFor="autonomy_very_high">Very High</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Technical Maturity</h4>
                <p className="text-sm text-muted-foreground">
                  How mature and well-tested is the technology used in this system?
                </p>
                
                <RadioGroup 
                  value={formData.technicalMaturity}
                  onValueChange={(value) => handleRadioChange("technicalMaturity", value)}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_low" id="maturity_very_low" />
                    <Label htmlFor="maturity_very_low">Very Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="maturity_low" />
                    <Label htmlFor="maturity_low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="maturity_medium" />
                    <Label htmlFor="maturity_medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="maturity_high" />
                    <Label htmlFor="maturity_high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_high" id="maturity_very_high" />
                    <Label htmlFor="maturity_very_high">Very High</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Impact Severity</h4>
                <p className="text-sm text-muted-foreground">
                  What is the potential severity of harm if the system malfunctions or is misused?
                </p>
                
                <RadioGroup 
                  value={formData.impactSeverity}
                  onValueChange={(value) => handleRadioChange("impactSeverity", value)}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_low" id="impact_very_low" />
                    <Label htmlFor="impact_very_low">Very Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="impact_low" />
                    <Label htmlFor="impact_low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="impact_medium" />
                    <Label htmlFor="impact_medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="impact_high" />
                    <Label htmlFor="impact_high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_high" id="impact_very_high" />
                    <Label htmlFor="impact_very_high">Very High</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Scale of Deployment</h4>
                <p className="text-sm text-muted-foreground">
                  How widely will this system be deployed or used?
                </p>
                
                <RadioGroup 
                  value={formData.scaleOfDeployment}
                  onValueChange={(value) => handleRadioChange("scaleOfDeployment", value)}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_low" id="scale_very_low" />
                    <Label htmlFor="scale_very_low">Very Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="scale_low" />
                    <Label htmlFor="scale_low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="scale_medium" />
                    <Label htmlFor="scale_medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="scale_high" />
                    <Label htmlFor="scale_high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_high" id="scale_very_high" />
                    <Label htmlFor="scale_very_high">Very High</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">User Vulnerability</h4>
                <p className="text-sm text-muted-foreground">
                  To what extent are vulnerable individuals or groups affected by this system?
                </p>
                
                <RadioGroup 
                  value={formData.userVulnerability}
                  onValueChange={(value) => handleRadioChange("userVulnerability", value)}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_low" id="vulnerability_very_low" />
                    <Label htmlFor="vulnerability_very_low">Very Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="vulnerability_low" />
                    <Label htmlFor="vulnerability_low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="vulnerability_medium" />
                    <Label htmlFor="vulnerability_medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="vulnerability_high" />
                    <Label htmlFor="vulnerability_high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_high" id="vulnerability_very_high" />
                    <Label htmlFor="vulnerability_very_high">Very High</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentTab("high-risk")}>
                Previous
              </Button>
              <Button onClick={() => nextTab("parameters")}>
                Next Step <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <h3 className="text-lg font-medium">Assessment Results</h3>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-md">
                <h4 className="font-medium">Risk Classification</h4>
                
                <div className="flex items-center justify-center space-x-4 my-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700">
                      <ListChecksIcon className="h-8 w-8" />
                    </div>
                    <p className="mt-2 text-sm font-medium">Minimal Risk</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700">
                      <InfoIcon className="h-8 w-8" />
                    </div>
                    <p className="mt-2 text-sm font-medium">Limited Risk</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 text-amber-700 border-2 border-amber-500">
                      <ShieldIcon className="h-8 w-8" />
                    </div>
                    <p className="mt-2 text-sm font-medium">High Risk</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-700">
                      <AlertCircleIcon className="h-8 w-8" />
                    </div>
                    <p className="mt-2 text-sm font-medium">Prohibited</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border-amber-200 border rounded-md p-4 mt-4">
                  <h5 className="font-medium">Classification Result: High Risk</h5>
                  <p className="text-sm mt-2">
                    Based on the assessment, this system is classified as High Risk under the EU AI Act. 
                    This is due to its intended use in employment decision-making contexts, which falls under Annex III.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium flex items-center">
                    <FileTextIcon className="h-4 w-4 mr-2 text-primary" />
                    Required Documentation
                  </h4>
                  
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Risk Management System Documentation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Technical Documentation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Data Governance Documentation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Human Oversight Protocol</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Conformity Assessment Documentation</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium flex items-center">
                    <ListChecksIcon className="h-4 w-4 mr-2 text-primary" />
                    Compliance Requirements
                  </h4>
                  
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Risk Management System (Article 9)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Data Governance (Article 10)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Technical Documentation (Article 11)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Record Keeping (Article 12)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span className="text-sm">Human Oversight (Article 14)</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="font-medium">Next Steps and Recommendations</h4>
                
                <ul className="mt-3 space-y-3">
                  <li className="flex items-start">
                    <div className="flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center mr-2 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium">Implement Risk Management System</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Establish a comprehensive risk management system that identifies, analyzes, and mitigates risks associated with the AI system.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center mr-2 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">Document Data Governance Practices</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Document data quality criteria, data preparation processes, and bias detection and mitigation techniques.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center mr-2 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">Implement Human Oversight Measures</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Design and implement appropriate human oversight mechanisms that allow for monitoring, intervention, and override.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center mr-2 mt-0.5">
                      4
                    </div>
                    <div>
                      <p className="text-sm font-medium">Prepare for Conformity Assessment</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Compile all required documentation and evidence for conformity assessment according to Article 43.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentTab("parameters")}>
                Previous
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Assessment"
                )}
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="border-t px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-muted-foreground">
            EU AI Act Risk Assessment Wizard
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Save Assessment"}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
