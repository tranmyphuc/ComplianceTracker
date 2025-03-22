import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  HelpCircleIcon, AlertTriangleIcon, ArrowRightIcon, ArrowLeftIcon, SaveIcon, 
  CheckCircleIcon, XCircleIcon, InfoIcon, PlusCircleIcon, FileTextIcon, 
  CheckSquareIcon, CircleIcon, BarChartIcon, ClipboardListIcon, 
  CalendarClockIcon, UploadIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export function AssessmentWizard() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("system-selection");
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [prohibitedAnswers, setProhibitedAnswers] = useState({
    socialScoring: "",
    biometricCategorization: "",
    emotionRecognition: "",
    predictivePolicing: ""
  });
  const [justifications, setJustifications] = useState({
    socialScoring: "",
    biometricCategorization: "",
    emotionRecognition: "",
    predictivePolicing: ""
  });
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  const [detailedRiskParameters, setDetailedRiskParameters] = useState<any>(null);
  const [manualSystemInput, setManualSystemInput] = useState({
    name: "",
    description: "",
    department: "",
    purpose: "",
    version: "",
    vendor: "",
    aiCapabilities: ""
  });

  const { data: systems, isLoading } = useQuery({
    queryKey: ["/api/systems"],
  });

  const handleSystemSelect = (systemId: string) => {
    setSelectedSystem(systemId);
  };

  const handleRadioChange = (question: keyof typeof prohibitedAnswers, value: string) => {
    setProhibitedAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleJustificationChange = (question: keyof typeof justifications, value: string) => {
    setJustifications(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleContinue = () => {
    switch (activeTab) {
      case "system-selection":
        // Allow users to directly go to Risk Parameters tab without selecting a system
        if (!selectedSystem) {
          setActiveTab("risk-params");  // Go directly to risk-params for manual entry
        } else {
          setActiveTab("prohibited-use");
        }
        break;
      case "prohibited-use":
        // Validate that all questions have been answered
        const unansweredQuestions = Object.entries(prohibitedAnswers).filter(([_, value]) => value === "");
        if (unansweredQuestions.length > 0) {
          toast({
            title: "Incomplete assessment",
            description: "Please answer all prohibited use questions to continue",
            variant: "destructive"
          });
          return;
        }
        setActiveTab("high-risk-category");
        break;
      case "high-risk-category":
        setActiveTab("risk-params");
        break;
      case "risk-params":
        setActiveTab("evidence");
        break;
      case "evidence":
        setActiveTab("gap-analysis");
        break;
      case "gap-analysis":
        setActiveTab("action-plan");
        break;
      case "action-plan":
        handleSubmitAssessment();
        break;
    }
  };

  const handleBack = () => {
    switch (activeTab) {
      case "prohibited-use":
        setActiveTab("system-selection");
        break;
      case "high-risk-category":
        setActiveTab("prohibited-use");
        break;
      case "risk-params":
        setActiveTab("high-risk-category");
        break;
      case "evidence":
        setActiveTab("risk-params");
        break;
      case "gap-analysis":
        setActiveTab("evidence");
        break;
      case "action-plan":
        setActiveTab("gap-analysis");
        break;
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your assessment has been saved as a draft",
    });
  };
  
  const handleSubmitAssessment = () => {
    toast({
      title: "Assessment completed",
      description: "Your risk assessment has been submitted successfully",
    });
  };
  
  const handleRegisterSystem = () => {
    if (!aiAnalysisResults) return;
    
    // Store system data in localStorage to pre-fill registration form
    const systemToRegister = {
      name: selectedSystem ? getSelectedSystem()?.name : manualSystemInput.name,
      department: selectedSystem ? getSelectedSystem()?.department : manualSystemInput.department,
      description: selectedSystem ? getSelectedSystem()?.description : manualSystemInput.description,
      purpose: selectedSystem ? getSelectedSystem()?.purpose : manualSystemInput.purpose,
      riskLevel: aiAnalysisResults.riskClassification || "Unknown",
      systemCategory: aiAnalysisResults.systemCategory || "",
      complianceScore: aiAnalysisResults.complianceScore || 0
    };
    
    localStorage.setItem('systemToRegister', JSON.stringify(systemToRegister));
    
    // Navigate to the register system page
    navigate('/register-system');
    
    toast({
      title: "Registration form opened",
      description: "The registration form has been pre-filled with your analyzed system data",
    });
  };

  const getSelectedSystem = () => {
    if (!systems) return null;
    return systems.find((system: any) => system.systemId === selectedSystem);
  };

  const runAIAnalysis = async () => {
    setAiAnalysisLoading(true);
    setAiAnalysisResults(null);
    setDetailedRiskParameters(null);

    try {
      // Use manually entered data if no system is selected
      let systemData;
      
      if (selectedSystem) {
        systemData = getSelectedSystem();
      } else if (manualSystemInput.name) {
        // Create a temporary system object using manual input
        systemData = {
          name: manualSystemInput.name,
          description: manualSystemInput.description,
          department: manualSystemInput.department,
          purpose: manualSystemInput.purpose,
          version: manualSystemInput.version,
          vendor: manualSystemInput.vendor,
          aiCapabilities: manualSystemInput.aiCapabilities,
          // Add minimal required fields for analysis
          systemId: `TEMP-${Date.now()}`,
          status: "Draft",
          riskLevel: "Unknown"
        };
      } else {
        toast({
          title: "Missing information",
          description: "Please enter system details or select an existing system",
          variant: "destructive"
        });
        setAiAnalysisLoading(false);
        return;
      }
      
      // Step 1: Get basic system analysis
      const response = await fetch('/api/analyze/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(systemData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAiAnalysisResults(data);
      
      // Step 2: Request detailed risk parameters analysis
      try {
        // Create a more focused risk analysis prompt for detailed evaluation of risk parameters
        const riskParametersData = {
          ...systemData,
          riskClassification: data.riskClassification, // Include the initially determined risk level
          systemCategory: data.systemCategory, // Include the initially determined category
          
          // Request specialized risk parameters analysis
          analysisType: 'detailed_risk_parameters'
        };
        
        const riskParamsResponse = await fetch('/api/analyze/system', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(riskParametersData)
        });
        
        if (riskParamsResponse.ok) {
          const detailedData = await riskParamsResponse.json();
          setDetailedRiskParameters(detailedData);
        }
      } catch (paramError) {
        console.error("Error getting detailed risk parameters:", paramError);
        // We don't show error toast for this since we already have the basic analysis
      }
      
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

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader>
        <CardTitle>Risk Assessment Wizard</CardTitle>
        <CardDescription>
          Evaluate your AI system against EU AI Act requirements
        </CardDescription>
      </CardHeader>
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-6 overflow-auto">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger 
              value="system-selection"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              1. System
            </TabsTrigger>
            <TabsTrigger 
              value="prohibited-use"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={!selectedSystem}
            >
              2. Prohibited
            </TabsTrigger>
            <TabsTrigger 
              value="high-risk-category"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={!selectedSystem}
            >
              3. Category
            </TabsTrigger>
            <TabsTrigger 
              value="risk-params"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              4. Parameters
            </TabsTrigger>
            <TabsTrigger 
              value="evidence"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={!selectedSystem}
            >
              5. Evidence
            </TabsTrigger>
            <TabsTrigger 
              value="gap-analysis"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={!selectedSystem}
            >
              6. Gaps
            </TabsTrigger>
            <TabsTrigger 
              value="action-plan"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={!selectedSystem}
            >
              7. Actions
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          {/* System Selection Tab */}
          <TabsContent value="system-selection" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Select AI System</h3>
                <p className="text-sm text-neutral-500">
                  Choose the AI system you want to assess for EU AI Act compliance, or proceed to the Risk Parameters tab to analyze a new system manually
                </p>
              </div>
              
              {isLoading ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : systems?.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-neutral-500">No AI systems found. Please register a system first.</p>
                  <Button className="mt-4">Register New System</Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  {systems?.map((system: any) => (
                    <div
                      key={system.systemId}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedSystem === system.systemId
                          ? "border-primary bg-primary/5"
                          : "hover:bg-neutral-50"
                      }`}
                      onClick={() => handleSystemSelect(system.systemId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-md flex items-center justify-center mr-3 ${
                            system.riskLevel === "High" 
                              ? "bg-red-100 text-[#dc2626]" 
                              : system.riskLevel === "Limited"
                                ? "bg-amber-100 text-[#f59e0b]"
                                : "bg-green-100 text-[#16a34a]"
                          }`}>
                            <AlertTriangleIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{system.name}</div>
                            <div className="text-sm text-neutral-500">
                              {system.department} • {system.systemId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            system.riskLevel === "High" 
                              ? "bg-[#dc2626]/10 text-[#dc2626]" 
                              : system.riskLevel === "Limited"
                                ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                                : "bg-[#16a34a]/10 text-[#16a34a]"
                          }`}>
                            {system.riskLevel} Risk
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Prohibited Use Screening Tab */}
          <TabsContent value="prohibited-use" className="mt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Prohibited Use Screening</h3>
                <p className="text-sm text-neutral-500">
                  Determine if the system falls under prohibited use cases defined by the EU AI Act
                </p>
              </div>
              
              {selectedSystem && (
                <div className="bg-neutral-50 p-4 rounded-md border">
                  <h4 className="font-medium">Selected System</h4>
                  <div className="text-sm mt-1">
                    <span className="font-medium">{getSelectedSystem()?.name}</span> • {getSelectedSystem()?.systemId}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    Department: {getSelectedSystem()?.department}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <TooltipProvider>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800">
                    <div className="flex items-start">
                      <AlertTriangleIcon className="h-5 w-5 mt-0.5 mr-2 text-amber-600" />
                      <div>
                        <p className="font-medium">Important</p>
                        <p className="text-sm mt-1">
                          The EU AI Act prohibits certain AI applications. If any question below is answered with "Yes", the system is prohibited and cannot be deployed in the EU.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Question 1 */}
                  <div className="space-y-3 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <h4 className="font-medium">Social Scoring</h4>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                              <HelpCircleIcon className="h-4 w-4 text-neutral-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>Systems that evaluate or classify individuals based on social behavior or personality characteristics leading to detrimental or unfavorable treatment.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-xs bg-neutral-100 px-2 py-1 rounded">
                        Article 5(1)(c)
                      </div>
                    </div>
                    
                    <p className="text-sm">
                      Does the system implement social scoring that leads to detrimental or unfavorable treatment of persons or groups?
                    </p>
                    
                    <RadioGroup 
                      value={prohibitedAnswers.socialScoring}
                      onValueChange={(value) => handleRadioChange("socialScoring", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="social-yes" />
                        <Label htmlFor="social-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="social-no" />
                        <Label htmlFor="social-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {prohibitedAnswers.socialScoring && (
                      <div>
                        <Label htmlFor="social-justification">Justification</Label>
                        <Textarea 
                          id="social-justification" 
                          placeholder="Provide justification for your answer..."
                          value={justifications.socialScoring}
                          onChange={(e) => handleJustificationChange("socialScoring", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Question 2 */}
                  <div className="space-y-3 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <h4 className="font-medium">Biometric Categorization</h4>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                              <HelpCircleIcon className="h-4 w-4 text-neutral-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>Use of biometric categorization systems based on sensitive or protected characteristics.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-xs bg-neutral-100 px-2 py-1 rounded">
                        Article 5(1)(d)
                      </div>
                    </div>
                    
                    <p className="text-sm">
                      Does the system use biometric categorization to deduce or infer race, political opinion, religious beliefs, or other protected characteristics?
                    </p>
                    
                    <RadioGroup 
                      value={prohibitedAnswers.biometricCategorization}
                      onValueChange={(value) => handleRadioChange("biometricCategorization", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="biometric-yes" />
                        <Label htmlFor="biometric-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="biometric-no" />
                        <Label htmlFor="biometric-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {prohibitedAnswers.biometricCategorization && (
                      <div>
                        <Label htmlFor="biometric-justification">Justification</Label>
                        <Textarea 
                          id="biometric-justification" 
                          placeholder="Provide justification for your answer..."
                          value={justifications.biometricCategorization}
                          onChange={(e) => handleJustificationChange("biometricCategorization", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Question 3 */}
                  <div className="space-y-3 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <h4 className="font-medium">Emotion Recognition</h4>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                              <HelpCircleIcon className="h-4 w-4 text-neutral-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>AI systems that use emotion recognition in workplace and educational contexts.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-xs bg-neutral-100 px-2 py-1 rounded">
                        Article 5(1)(a)
                      </div>
                    </div>
                    
                    <p className="text-sm">
                      Does the system use emotion recognition in the workplace or educational institutions to make decisions affecting people's opportunities or evaluations?
                    </p>
                    
                    <RadioGroup 
                      value={prohibitedAnswers.emotionRecognition}
                      onValueChange={(value) => handleRadioChange("emotionRecognition", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="emotion-yes" />
                        <Label htmlFor="emotion-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="emotion-no" />
                        <Label htmlFor="emotion-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {prohibitedAnswers.emotionRecognition && (
                      <div>
                        <Label htmlFor="emotion-justification">Justification</Label>
                        <Textarea 
                          id="emotion-justification" 
                          placeholder="Provide justification for your answer..."
                          value={justifications.emotionRecognition}
                          onChange={(e) => handleJustificationChange("emotionRecognition", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Question 4 */}
                  <div className="space-y-3 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <h4 className="font-medium">Predictive Policing</h4>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                              <HelpCircleIcon className="h-4 w-4 text-neutral-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>AI systems that predict criminal or offensive acts based solely on profiling or personality assessments.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-xs bg-neutral-100 px-2 py-1 rounded">
                        Article 5(1)(e)
                      </div>
                    </div>
                    
                    <p className="text-sm">
                      Does the system use predictive policing based on profiling of individuals to assess their risk of criminal behavior?
                    </p>
                    
                    <RadioGroup 
                      value={prohibitedAnswers.predictivePolicing}
                      onValueChange={(value) => handleRadioChange("predictivePolicing", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="policing-yes" />
                        <Label htmlFor="policing-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="policing-no" />
                        <Label htmlFor="policing-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {prohibitedAnswers.predictivePolicing && (
                      <div>
                        <Label htmlFor="policing-justification">Justification</Label>
                        <Textarea 
                          id="policing-justification" 
                          placeholder="Provide justification for your answer..."
                          value={justifications.predictivePolicing}
                          onChange={(e) => handleJustificationChange("predictivePolicing", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Prohibited Use Warning */}
                  {Object.values(prohibitedAnswers).includes("yes") && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800">
                      <div className="flex items-start">
                        <XCircleIcon className="h-5 w-5 mt-0.5 mr-2 text-red-600" />
                        <div>
                          <p className="font-medium">Prohibited Use Detected</p>
                          <p className="text-sm mt-1">
                            Based on your responses, this AI system appears to fall under prohibited uses according to the EU AI Act. Such systems cannot be deployed within the EU. Please review your system design or consult with legal experts.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {Object.values(prohibitedAnswers).every(val => val === "no") && Object.values(prohibitedAnswers).length === 4 && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-md text-green-800">
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 mt-0.5 mr-2 text-green-600" />
                        <div>
                          <p className="font-medium">No Prohibited Use Detected</p>
                          <p className="text-sm mt-1">
                            Based on your responses, this AI system does not appear to fall under prohibited uses according to the EU AI Act. You may proceed to the next section.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </TooltipProvider>
              </div>
            </div>
          </TabsContent>
          
          {/* Mock for High-Risk Category Tab */}
          <TabsContent value="high-risk-category" className="mt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">High-Risk Category Evaluation</h3>
                <p className="text-sm text-neutral-500">
                  Determine if the system falls into one of the high-risk categories defined by the EU AI Act
                </p>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">High-Risk Classification</h4>
                    <p className="text-sm text-neutral-500 mt-1">Does the system fall into any of these high-risk categories?</p>
                  </div>
                  <InfoIcon className="h-5 w-5 text-neutral-400" />
                </div>
                
                <div className="mt-4 space-y-3">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical-infrastructure">Critical Infrastructure</SelectItem>
                      <SelectItem value="education">Educational or Vocational Training</SelectItem>
                      <SelectItem value="employment">Employment & Worker Management</SelectItem>
                      <SelectItem value="essential-services">Access to Essential Services</SelectItem>
                      <SelectItem value="law-enforcement">Law Enforcement</SelectItem>
                      <SelectItem value="migration">Migration & Border Control</SelectItem>
                      <SelectItem value="justice">Administration of Justice</SelectItem>
                      <SelectItem value="none">None of the above</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    placeholder="Provide justification for your selection..."
                    className="mt-2"
                  />
                </div>
              </div>
              
              <p className="text-sm text-neutral-500 italic">
                Note: This is a simplified assessment. In the full implementation, this section would include detailed questions for each high-risk category.
              </p>
            </div>
          </TabsContent>
          
          {/* Placeholder content for other tabs */}
          <TabsContent value="risk-params" className="mt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Risk Parameters Assessment</h3>
                <p className="text-sm text-neutral-500">
                  Evaluate specific risk factors and parameters related to the AI system
                </p>
              </div>
              
              {selectedSystem ? (
                <div className="bg-neutral-50 p-4 rounded-md border">
                  <h4 className="font-medium">Selected System</h4>
                  <div className="text-sm mt-1">
                    <span className="font-medium">{getSelectedSystem()?.name}</span> • {getSelectedSystem()?.systemId}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    Department: {getSelectedSystem()?.department}
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Enter AI System Details</h4>
                    <p className="text-sm text-neutral-500">
                      No system selected. Enter details below to analyze a new AI system.
                    </p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="system-name">System Name</Label>
                        <Input 
                          id="system-name" 
                          placeholder="e.g., Customer Service Chatbot" 
                          value={manualSystemInput.name}
                          onChange={(e) => setManualSystemInput({...manualSystemInput, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department" 
                          placeholder="e.g., Customer Support" 
                          value={manualSystemInput.department}
                          onChange={(e) => setManualSystemInput({...manualSystemInput, department: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="vendor">Vendor/Developer</Label>
                        <Input 
                          id="vendor" 
                          placeholder="e.g., OpenAI, In-house" 
                          value={manualSystemInput.vendor}
                          onChange={(e) => setManualSystemInput({...manualSystemInput, vendor: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="version">Version</Label>
                        <Input 
                          id="version" 
                          placeholder="e.g., 1.0, 2023.1" 
                          value={manualSystemInput.version}
                          onChange={(e) => setManualSystemInput({...manualSystemInput, version: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Primary Purpose</Label>
                      <Textarea 
                        id="purpose" 
                        placeholder="Describe the main purpose and functionality of this AI system..." 
                        value={manualSystemInput.purpose}
                        onChange={(e) => setManualSystemInput({...manualSystemInput, purpose: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aiCapabilities">AI Capabilities</Label>
                      <Textarea 
                        id="aiCapabilities" 
                        placeholder="List the key AI capabilities (e.g., natural language processing, image recognition, predictive analytics...)" 
                        value={manualSystemInput.aiCapabilities}
                        onChange={(e) => setManualSystemInput({...manualSystemInput, aiCapabilities: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Detailed Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Provide more details about how the system works, technologies used, and integration points..." 
                        value={manualSystemInput.description}
                        onChange={(e) => setManualSystemInput({...manualSystemInput, description: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="gap-2" 
                  onClick={runAIAnalysis}
                  disabled={aiAnalysisLoading || (!selectedSystem && !manualSystemInput.name)}
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
                      
                      <h4 className="font-medium">Risk Assessment</h4>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-neutral-700">
                          <p className="font-medium">Risk Level:</p>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            aiAnalysisResults.riskClassification === 'High' 
                              ? 'bg-red-100 text-red-800' 
                              : aiAnalysisResults.riskClassification === 'Limited'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {aiAnalysisResults.riskClassification}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Relevant EU AI Act Articles</h4>
                      <div className="border rounded-md p-3 h-[120px] overflow-y-auto">
                        <ul className="space-y-1 text-sm">
                          {aiAnalysisResults.euAiActArticles?.map((article: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                              {article}
                            </li>
                          ))}
                        </ul>
                      </div>
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
                              <InfoIcon className="h-4 w-4 text-primary" />
                            </div>
                            <p>{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Risk Parameters Section */}
                  {detailedRiskParameters && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Detailed Risk Parameters</h4>
                      <div className="border rounded-md p-3">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {detailedRiskParameters.riskFactors?.map((factor: any, index: number) => (
                              <div key={index} className="border rounded p-3 bg-slate-50">
                                <div className="font-medium text-sm">{factor.name}</div>
                                {factor.euAiActArticle && (
                                  <div className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded inline-block mt-1">
                                    Article {factor.euAiActArticle}
                                  </div>
                                )}
                                <div className="flex items-center mt-1">
                                  <div 
                                    className={`h-2 flex-grow rounded-full ${
                                      factor.score > 70 
                                        ? 'bg-green-300' 
                                        : factor.score > 30 
                                          ? 'bg-amber-300' 
                                          : 'bg-red-300'
                                    }`}
                                  >
                                    <div 
                                      className={`h-2 rounded-full ${
                                        factor.score > 70 
                                          ? 'bg-green-500' 
                                          : factor.score > 30 
                                            ? 'bg-amber-500' 
                                            : 'bg-red-500'
                                      }`}
                                      style={{ width: `${factor.score}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-xs font-medium">{factor.score}%</span>
                                </div>
                                <p className="text-xs mt-2 text-neutral-600">{factor.description}</p>
                              </div>
                            ))}
                          </div>

                          {detailedRiskParameters.specificConcerns && (
                            <div className="border-t pt-3 mt-3">
                              <h5 className="font-medium text-sm mb-2">Specific EU AI Act Concerns</h5>
                              <ul className="space-y-1">
                                {detailedRiskParameters.specificConcerns.map((concern: string, index: number) => (
                                  <li key={index} className="text-sm flex items-start gap-2">
                                    <AlertTriangleIcon className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span>{concern}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {detailedRiskParameters.mitigationStrategies && (
                            <div className="border-t pt-3 mt-3">
                              <h5 className="font-medium text-sm mb-2">Risk Mitigation Strategies</h5>
                              <ul className="space-y-1">
                                {detailedRiskParameters.mitigationStrategies.map((strategy: string, index: number) => (
                                  <li key={index} className="text-sm flex items-start gap-2">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>{strategy}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button 
                      className="gap-2" 
                      onClick={handleRegisterSystem}
                    >
                      <PlusCircleIcon className="h-4 w-4" />
                      Register this System
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setAiAnalysisResults(null);
                      setDetailedRiskParameters(null);
                    }}>
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
          </TabsContent>
          
          <TabsContent value="evidence" className="mt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Evidence Collection</h3>
                <p className="text-sm text-neutral-500">
                  Collect and document evidence to demonstrate compliance with EU AI Act requirements
                </p>
              </div>
              
              {selectedSystem && (
                <div className="bg-neutral-50 p-4 rounded-md border">
                  <h4 className="font-medium">Selected System</h4>
                  <div className="text-sm mt-1">
                    <span className="font-medium">{getSelectedSystem()?.name}</span> • {getSelectedSystem()?.systemId}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    Department: {getSelectedSystem()?.department}
                  </div>
                </div>
              )}
              
              <div className="border rounded-md">
                <div className="bg-neutral-50 border-b p-4">
                  <h4 className="font-medium flex items-center">
                    <FileTextIcon className="h-4 w-4 mr-2 text-primary" />
                    Required Documentation
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    Based on the system risk level, the following documentation is required
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Technical Documentation */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Technical Documentation</h5>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Required</Badge>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Documentation that describes the AI system's architecture, algorithms, data requirements, and performance metrics
                      </p>
                      <div className="flex items-center gap-2">
                        <input type="file" id="technical-doc" className="hidden" />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="technical-doc" className="cursor-pointer flex items-center gap-2">
                            <UploadIcon className="h-4 w-4" />
                            Upload
                          </label>
                        </Button>
                        <span className="text-sm text-neutral-500">No file selected</span>
                      </div>
                    </div>
                    
                    {/* Risk Assessment */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Risk Assessment Report</h5>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Required</Badge>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Evaluation of potential risks associated with the system's use and corresponding mitigation measures
                      </p>
                      <div className="flex items-center gap-2">
                        <input type="file" id="risk-doc" className="hidden" />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="risk-doc" className="cursor-pointer flex items-center gap-2">
                            <UploadIcon className="h-4 w-4" />
                            Upload
                          </label>
                        </Button>
                        <span className="text-sm text-neutral-500">No file selected</span>
                      </div>
                    </div>
                    
                    {/* Data Governance */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Data Governance Documentation</h5>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Required</Badge>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Documentation on data collection, processing, and quality management procedures
                      </p>
                      <div className="flex items-center gap-2">
                        <input type="file" id="data-doc" className="hidden" />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="data-doc" className="cursor-pointer flex items-center gap-2">
                            <UploadIcon className="h-4 w-4" />
                            Upload
                          </label>
                        </Button>
                        <span className="text-sm text-neutral-500">No file selected</span>
                      </div>
                    </div>
                    
                    {/* Human Oversight */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Human Oversight Protocol</h5>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Required</Badge>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Documentation describing human oversight mechanisms and intervention procedures
                      </p>
                      <div className="flex items-center gap-2">
                        <input type="file" id="oversight-doc" className="hidden" />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="oversight-doc" className="cursor-pointer flex items-center gap-2">
                            <UploadIcon className="h-4 w-4" />
                            Upload
                          </label>
                        </Button>
                        <span className="text-sm text-neutral-500">No file selected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="bg-neutral-50 border-b p-4">
                  <h4 className="font-medium flex items-center">
                    <CheckSquareIcon className="h-4 w-4 mr-2 text-primary" />
                    Compliance Attestation
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    Confirm compliance with key EU AI Act requirements
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Checkbox id="attestation-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="attestation-1" className="text-sm font-medium">
                          Risk Management System (Article 9)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          We have established and maintain a risk management system for this AI system throughout its lifecycle
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox id="attestation-2" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="attestation-2" className="text-sm font-medium">
                          Data and Data Governance (Article 10)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Training, validation, and testing datasets are subject to appropriate data governance and management practices
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox id="attestation-3" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="attestation-3" className="text-sm font-medium">
                          Technical Documentation (Article 11)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          We maintain up-to-date technical documentation for this AI system
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox id="attestation-4" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="attestation-4" className="text-sm font-medium">
                          Record-Keeping (Article 12)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatic logging capabilities are in place for this AI system
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox id="attestation-5" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="attestation-5" className="text-sm font-medium">
                          Transparency (Article 13)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          This AI system is designed to be transparent to users and impacted individuals
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox id="attestation-6" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="attestation-6" className="text-sm font-medium">
                          Human Oversight (Article 14)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Human oversight measures are designed, built into, and can be implemented for this AI system
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gap-analysis" className="mt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Gap Analysis</h3>
                <p className="text-sm text-neutral-500">
                  Identify compliance gaps and prioritize remediation actions
                </p>
              </div>
              
              {selectedSystem && (
                <div className="bg-neutral-50 p-4 rounded-md border">
                  <h4 className="font-medium">Selected System</h4>
                  <div className="text-sm mt-1">
                    <span className="font-medium">{getSelectedSystem()?.name}</span> • {getSelectedSystem()?.systemId}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    Department: {getSelectedSystem()?.department}
                  </div>
                </div>
              )}
              
              <div className="border rounded-md">
                <div className="bg-neutral-50 border-b p-4">
                  <h4 className="font-medium flex items-center">
                    <AlertTriangleIcon className="h-4 w-4 mr-2 text-amber-500" />
                    Compliance Gaps
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    The following gaps have been identified based on risk assessment and evidence review
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-4">
                    {/* Data Governance Gap */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium flex items-center">
                          <CircleIcon className="h-2 w-2 mr-2 fill-red-500" />
                          Data Governance Gap
                        </h5>
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">High Priority</Badge>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Insufficient documentation of training data sources and quality assurance measures
                      </p>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <h6 className="text-xs font-medium text-neutral-700 mb-1">EU AI Act Reference</h6>
                        <p className="text-xs text-neutral-600">
                          Article 10: Training, validation and testing data sets shall be relevant, representative, 
                          and free of errors and complete. They shall have the appropriate statistical properties.
                        </p>
                      </div>
                    </div>
                    
                    {/* Transparency Gap */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium flex items-center">
                          <CircleIcon className="h-2 w-2 mr-2 fill-amber-500" />
                          Transparency Gap
                        </h5>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium Priority</Badge>
                      </div>
                      <p className="text-sm text-neutral-600">
                        System does not adequately inform users that they are interacting with an AI system
                      </p>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <h6 className="text-xs font-medium text-neutral-700 mb-1">EU AI Act Reference</h6>
                        <p className="text-xs text-neutral-600">
                          Article 13: High-risk AI systems shall be designed and developed in such a way that they 
                          are sufficiently transparent to enable users to interpret the system's output.
                        </p>
                      </div>
                    </div>
                    
                    {/* Human Oversight Gap */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium flex items-center">
                          <CircleIcon className="h-2 w-2 mr-2 fill-red-500" />
                          Human Oversight Gap
                        </h5>
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">High Priority</Badge>
                      </div>
                      <p className="text-sm text-neutral-600">
                        No formal human oversight protocol or measures to implement human-in-the-loop validation
                      </p>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <h6 className="text-xs font-medium text-neutral-700 mb-1">EU AI Act Reference</h6>
                        <p className="text-xs text-neutral-600">
                          Article 14: High-risk AI systems shall be designed and developed in such a way that they can be 
                          effectively overseen by natural persons during the period in which the AI system is in use.
                        </p>
                      </div>
                    </div>
                    
                    {/* Risk Management Gap */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium flex items-center">
                          <CircleIcon className="h-2 w-2 mr-2 fill-amber-500" />
                          Risk Management Gap
                        </h5>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium Priority</Badge>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Incomplete risk management system for continuous monitoring and system lifecycle management
                      </p>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <h6 className="text-xs font-medium text-neutral-700 mb-1">EU AI Act Reference</h6>
                        <p className="text-xs text-neutral-600">
                          Article 9: A risk management system shall be established, implemented, documented and maintained for high-risk AI systems.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="bg-neutral-50 border-b p-4">
                  <h4 className="font-medium flex items-center">
                    <BarChartIcon className="h-4 w-4 mr-2 text-primary" />
                    Compliance Summary
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    Overall compliance status by EU AI Act requirement area
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Data Governance */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Data Governance (Article 10)</span>
                        <span className="text-sm text-neutral-500">40%</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    
                    {/* Technical Documentation */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Technical Documentation (Article 11)</span>
                        <span className="text-sm text-neutral-500">65%</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    {/* Record-Keeping */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Record-Keeping (Article 12)</span>
                        <span className="text-sm text-neutral-500">75%</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    {/* Transparency */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Transparency (Article 13)</span>
                        <span className="text-sm text-neutral-500">50%</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    
                    {/* Human Oversight */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Human Oversight (Article 14)</span>
                        <span className="text-sm text-neutral-500">35%</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    
                    {/* Technical Robustness */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Technical Robustness (Article 15)</span>
                        <span className="text-sm text-neutral-500">70%</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="action-plan" className="mt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Action Plan</h3>
                <p className="text-sm text-neutral-500">
                  Define actions to address compliance gaps and assign responsibilities
                </p>
              </div>
              
              {selectedSystem && (
                <div className="bg-neutral-50 p-4 rounded-md border">
                  <h4 className="font-medium">Selected System</h4>
                  <div className="text-sm mt-1">
                    <span className="font-medium">{getSelectedSystem()?.name}</span> • {getSelectedSystem()?.systemId}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    Department: {getSelectedSystem()?.department}
                  </div>
                </div>
              )}
              
              <div className="border rounded-md">
                <div className="bg-neutral-50 border-b p-4">
                  <h4 className="font-medium flex items-center">
                    <ClipboardListIcon className="h-4 w-4 mr-2 text-primary" />
                    Remediation Actions
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    Actions to address identified compliance gaps
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-4">
                    {/* Action 1 */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Data Governance Documentation</h5>
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">High Priority</Badge>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Description</h6>
                          <p className="text-sm text-neutral-600">
                            Develop comprehensive documentation on data sources, data quality assessment, and data governance processes
                          </p>
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">EU AI Act Reference</h6>
                          <p className="text-sm text-neutral-600">
                            Article 10 - Data and Data Governance
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Responsible</h6>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select person" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="john">John Smith</SelectItem>
                              <SelectItem value="sarah">Sarah Johnson</SelectItem>
                              <SelectItem value="michael">Michael Williams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Due Date</h6>
                          <input
                            type="date"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Status</h6>
                          <Select defaultValue="not-started">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action 2 */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Human Oversight Protocol</h5>
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">High Priority</Badge>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Description</h6>
                          <p className="text-sm text-neutral-600">
                            Develop and implement formal protocol for human oversight including monitoring, intervention procedures, and training
                          </p>
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">EU AI Act Reference</h6>
                          <p className="text-sm text-neutral-600">
                            Article 14 - Human Oversight
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Responsible</h6>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select person" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="john">John Smith</SelectItem>
                              <SelectItem value="sarah">Sarah Johnson</SelectItem>
                              <SelectItem value="michael">Michael Williams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Due Date</h6>
                          <input
                            type="date"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Status</h6>
                          <Select defaultValue="not-started">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action 3 */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Transparency Enhancements</h5>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium Priority</Badge>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Description</h6>
                          <p className="text-sm text-neutral-600">
                            Implement clear UI indicators and explanations that users are interacting with an AI system
                          </p>
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">EU AI Act Reference</h6>
                          <p className="text-sm text-neutral-600">
                            Article 13 - Transparency and Provision of Information to Users
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Responsible</h6>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select person" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="john">John Smith</SelectItem>
                              <SelectItem value="sarah">Sarah Johnson</SelectItem>
                              <SelectItem value="michael">Michael Williams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Due Date</h6>
                          <input
                            type="date"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Status</h6>
                          <Select defaultValue="not-started">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action 4 */}
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Risk Management System</h5>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium Priority</Badge>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Description</h6>
                          <p className="text-sm text-neutral-600">
                            Establish comprehensive risk management system with continuous monitoring and assessment
                          </p>
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">EU AI Act Reference</h6>
                          <p className="text-sm text-neutral-600">
                            Article 9 - Risk Management System
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Responsible</h6>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select person" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="john">John Smith</SelectItem>
                              <SelectItem value="sarah">Sarah Johnson</SelectItem>
                              <SelectItem value="michael">Michael Williams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Due Date</h6>
                          <input
                            type="date"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        
                        <div>
                          <h6 className="text-xs font-medium text-neutral-700 mb-1">Status</h6>
                          <Select defaultValue="not-started">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="bg-neutral-50 border-b p-4">
                  <h4 className="font-medium flex items-center">
                    <CalendarClockIcon className="h-4 w-4 mr-2 text-primary" />
                    Implementation Timeline
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    Scheduled timeline for implementing remediation actions
                  </p>
                </div>
                
                <div className="p-4">
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-neutral-200"></div>
                    
                    <div className="space-y-8">
                      {/* Month 1 */}
                      <div className="relative pl-16">
                        <div className="absolute left-0 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white">
                          <span className="font-medium">M1</span>
                        </div>
                        
                        <div className="pt-3">
                          <h5 className="text-lg font-medium mb-3">Month 1: Initial Documentation</h5>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Complete initial data governance documentation</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Draft human oversight protocol</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Establish risk management framework</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      {/* Month 2 */}
                      <div className="relative pl-16">
                        <div className="absolute left-0 flex items-center justify-center w-14 h-14 rounded-full bg-primary/80 text-white">
                          <span className="font-medium">M2</span>
                        </div>
                        
                        <div className="pt-3">
                          <h5 className="text-lg font-medium mb-3">Month 2: Implementation</h5>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Implement transparency enhancements in UI</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Deploy human oversight training program</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Begin data quality assessment processes</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      {/* Month 3 */}
                      <div className="relative pl-16">
                        <div className="absolute left-0 flex items-center justify-center w-14 h-14 rounded-full bg-primary/60 text-white">
                          <span className="font-medium">M3</span>
                        </div>
                        
                        <div className="pt-3">
                          <h5 className="text-lg font-medium mb-3">Month 3: Review & Validation</h5>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Complete internal compliance review</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Validate and test human oversight procedures</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span>Finalize all compliance documentation</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Assessment Summary</h4>
                <Textarea 
                  placeholder="Enter a summary of the assessment findings and actions..." 
                  className="min-h-[120px]"
                  defaultValue="The AI system has been assessed against EU AI Act requirements with several compliance gaps identified in key areas. The most critical gaps are in data governance and human oversight, which require immediate attention. A comprehensive action plan has been developed with assigned responsibilities and deadlines to address all identified issues within the next three months."
                />
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={activeTab === "system-selection"}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleSaveDraft}
        >
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        
        <Button 
          onClick={handleContinue}
        >
          {activeTab === "action-plan" ? "Submit Assessment" : "Continue"}
          {activeTab !== "action-plan" && <ArrowRightIcon className="h-4 w-4 ml-2" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
