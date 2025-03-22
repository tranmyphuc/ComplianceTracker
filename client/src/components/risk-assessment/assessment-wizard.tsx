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
import { HelpCircleIcon, AlertTriangleIcon, ArrowRightIcon, ArrowLeftIcon, SaveIcon, CheckCircleIcon, XCircleIcon, InfoIcon, PlusCircleIcon } from "lucide-react";

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
                                <div className="flex items-center mt-1">
                                  <div 
                                    className={`h-2 flex-grow rounded-full ${
                                      factor.score > 70 
                                        ? 'bg-red-300' 
                                        : factor.score > 30 
                                          ? 'bg-amber-300' 
                                          : 'bg-green-300'
                                    }`}
                                  >
                                    <div 
                                      className={`h-2 rounded-full ${
                                        factor.score > 70 
                                          ? 'bg-red-500' 
                                          : factor.score > 30 
                                            ? 'bg-amber-500' 
                                            : 'bg-green-500'
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
            <div className="flex items-center justify-center h-48">
              <p className="text-neutral-500">Evidence Collection section would be implemented here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="gap-analysis" className="mt-0">
            <div className="flex items-center justify-center h-48">
              <p className="text-neutral-500">Gap Analysis section would be implemented here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="action-plan" className="mt-0">
            <div className="flex items-center justify-center h-48">
              <p className="text-neutral-500">Action Planning section would be implemented here</p>
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
