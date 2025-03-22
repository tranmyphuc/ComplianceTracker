import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  AlertTriangleIcon,
  ArrowRightIcon, 
  BrainIcon, 
  CheckIcon,
  ChevronRightIcon, 
  ClipboardCheckIcon, 
  DatabaseIcon, 
  FileIcon, 
  InfoIcon, 
  PencilIcon,
  SaveIcon, 
  SearchIcon,
  ShieldIcon,
  SparklesIcon,
  UploadIcon,
  XIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function SystemRegistration() {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    purpose: "",
    version: "1.0",
    department: "",
    vendor: "",
    riskLevel: "",
    systemId: "",
    aiCapabilities: "",
    trainingDatasets: "",
    outputTypes: "",
    usageContext: "",
    potentialImpact: "",
    mitigationMeasures: "",
    implementationDate: "",
    lastAssessmentDate: "",
    expectedLifetime: "",
    maintenanceSchedule: "",
    owner: "",
    deploymentScope: "",
    integrations: [],
    changeHistory: [],
    dataSources: [],
    trainingDataDescription: ""
  });

  const [registrationProgress, setRegistrationProgress] = useState<{
    basic: boolean;
    classification: boolean;
    technical: boolean;
    impact: boolean;
  }>({
    basic: false,
    classification: false,
    technical: false,
    impact: false
  });

  const [sghAsiaAiInProgress, setSghAsiaAiInProgress] = useState(false);
  const [sghAsiaAiResults, setSghAsiaAiResults] = useState<any>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [systemDescription, setSystemDescription] = useState("");
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionInProgress, setExtractionInProgress] = useState(false);
  const [extractionResults, setExtractionResults] = useState<any>(null);
  const [confidence, setConfidence] = useState(0);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Run the SGH ASIA AI analysis using the DeepSeek API
  const runSghAsiaAiAnalysis = async () => {
    setSghAsiaAiInProgress(true);

    try {
      const response = await fetch('/api/analyze/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          purpose: formData.purpose,
          department: formData.department
        })
      });

      const results = await response.json();
      setSghAsiaAiResults(results);
      setSghAsiaAiInProgress(false);

      // Auto-fill some form fields based on SGH ASIA AI analysis
      setFormData(prev => ({
        ...prev,
        riskLevel: results.riskClassification
      }));
    } catch (error) {
      console.error("Error running AI analysis:", error);
      setSghAsiaAiInProgress(false);
      // Handle error appropriately, e.g., display an error message to the user
    }
  };
  
  // Extract information from the document using DeepSeek AI
  const extractInformation = async () => {
    setExtractionInProgress(true);
    setExtractionProgress(0);
    
    // Simulate progress for demo purposes
    const interval = setInterval(() => {
      setExtractionProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      setTimeout(() => {
        // Simulate AI extraction results
        clearInterval(interval);
        setExtractionProgress(100);
        setConfidence(92);
        
        const results = {
          systemName: "HR Candidate Evaluation Tool v3",
          vendor: "TalentAI Inc.",
          version: "3.2.1",
          department: "Human Resources",
          systemPurpose: "Analyzes candidate resumes and applications to rank job candidates based on skill matching, experience, and qualification criteria. Utilizes natural language processing and supervised machine learning to evaluate candidate fit.",
          aiTechniques: "Natural Language Processing, Supervised Learning, Ranking Algorithms",
          dataTypes: "Resumes, Job Applications, Job Descriptions, Historical Hiring Data",
          integrationPoints: "HRIS System, Applicant Tracking System",
          userRoles: "HR Managers, Recruiters",
          implementationDate: "March 15, 2024",
          riskClassification: "High Risk",
          euAiActArticles: ["Article 6.2", "Article 9", "Article 10", "Article 13"],
          complianceConsiderations: "Based on system description, this is identified as a potential high-risk system under EU AI Act Article 6.2 (Employment/worker management)",
          documentationRequirements: ["Technical Documentation", "Risk Assessment", "Human Oversight Protocol", "Data Governance Documentation"]
        };
        
        setExtractionResults(results);
        setExtractionInProgress(false);
      }, 2500);
    } catch (error) {
      console.error("Error extracting information:", error);
      clearInterval(interval);
      setExtractionInProgress(false);
    }
  };
  
  // Extract information from text description using DeepSeek AI
  const analyzeDescription = async () => {
    setExtractionInProgress(true);
    setExtractionProgress(0);
    
    // Simulate progress for demo purposes
    const interval = setInterval(() => {
      setExtractionProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 8;
      });
    }, 100);
    
    try {
      setTimeout(() => {
        // Simulate AI extraction results
        clearInterval(interval);
        setExtractionProgress(100);
        setConfidence(88);
        
        const results = {
          systemName: "TalentAI's Candidate Evaluation System",
          vendor: "TalentAI",
          version: "3.2.1",
          department: "HR",
          systemPurpose: "Analyzes resumes and ranks job applicants based on qualifications, skills, and experience to help recruitment team identify promising candidates more efficiently.",
          aiTechniques: "Machine Learning, Natural Language Processing",
          dataTypes: "Resumes, Job Applications, Applicant Data",
          integrationPoints: "Applicant Tracking System, HRIS",
          userRoles: "Recruitment Team",
          implementationDate: "Recently",
          riskClassification: "High Risk",
          euAiActArticles: ["Article 6.2", "Article 9", "Article 10"],
          complianceConsiderations: "Likely High-Risk (Employment Category) under EU AI Act",
          documentationRequirements: ["Technical Documentation", "Risk Assessment", "Human Oversight Protocol"]
        };
        
        setExtractionResults(results);
        setExtractionInProgress(false);
      }, 1500);
    } catch (error) {
      console.error("Error analyzing description:", error);
      clearInterval(interval);
      setExtractionInProgress(false);
    }
  };
  
  // Apply a single extracted field to the form
  const applyField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Apply all extracted information to the form
  const applyAllFields = () => {
    if (!extractionResults) return;
    
    setFormData(prev => ({
      ...prev,
      name: extractionResults.systemName || prev.name,
      vendor: extractionResults.vendor || prev.vendor,
      version: extractionResults.version || prev.version,
      department: extractionResults.department || prev.department,
      purpose: extractionResults.systemPurpose || prev.purpose,
      aiCapabilities: extractionResults.aiTechniques || prev.aiCapabilities,
      trainingDatasets: extractionResults.dataTypes || prev.trainingDatasets,
      implementationDate: extractionResults.implementationDate || prev.implementationDate,
      riskLevel: extractionResults.riskClassification || prev.riskLevel
    }));
    
    setShowAiModal(false);
    
    // Show toast notification (simulated)
    console.log("All fields applied successfully");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Mark previous sections as complete
    const updatedProgress = {...registrationProgress};
    if (tab === "classification" && formData.name && formData.description && formData.purpose) {
      updatedProgress.basic = true;
    } else if (tab === "technical" && formData.riskLevel) {
      updatedProgress.classification = true;
    } else if (tab === "impact" && formData.aiCapabilities && formData.trainingDatasets) {
      updatedProgress.technical = true;
    }

    setRegistrationProgress(updatedProgress);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit system registration:", formData);
    // Here you would submit the data to your backend API
  };

  return (
    <div className="space-y-6">
      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <BrainIcon className="h-5 w-5 mr-2 text-primary" />
            SGH ASIA AI-Powered System Registration
          </CardTitle>
          <CardDescription>
            Use AI assistance to accurately classify and register your AI systems according to EU AI Act requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 items-center p-4 bg-neutral-50 rounded-md mb-6">
            <div className="flex-1">
              <h3 className="font-medium text-sm">Accelerate Your System Registration</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Let our SGH ASIA AI analyze your system description and suggest appropriate classification and compliance requirements
              </p>
            </div>
            <Button 
              variant="default" 
              className="whitespace-nowrap"
              onClick={runSghAsiaAiAnalysis}
              disabled={sghAsiaAiInProgress || !formData.description}
            >
              {sghAsiaAiInProgress ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-1.5" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>

          {sghAsiaAiResults && (
            <Card className="border-primary/20 bg-primary/5 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <SparklesIcon className="h-4 w-4 mr-1.5 text-primary" />
                  SGH ASIA AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-neutral-500">System Category</p>
                    <p className="text-sm font-medium">{sghAsiaAiResults.systemCategory}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Risk Classification</p>
                    <p className="text-sm font-medium text-amber-600">{sghAsiaAiResults.riskClassification}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Compliance Score</p>
                    <div className="flex items-center">
                      <div className="w-16 h-1.5 bg-neutral-200 rounded-full mr-2">
                        <div 
                          className={`h-full rounded-full ${
                            sghAsiaAiResults.complianceScore > 80 ? "bg-green-500" : 
                            sghAsiaAiResults.complianceScore > 60 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${sghAsiaAiResults.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{sghAsiaAiResults.complianceScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-neutral-500">Applicable EU AI Act Articles</p>
                  <div className="flex flex-wrap gap-1">
                    {sghAsiaAiResults.euAiActArticles.map((article: string) => (
                      <span 
                        key={article} 
                        className="text-xs bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full"
                      >
                        {article}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-neutral-500 mb-1">Suggested Improvements</p>
                  <ul className="text-xs space-y-1">
                    {sghAsiaAiResults.suggestedImprovements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <ChevronRightIcon className="h-3 w-3 text-primary mt-0.5 mr-1.5 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="text-xs">
                  <SaveIcon className="h-3 w-3 mr-1.5" />
                  Apply Recommendations
                </Button>
              </CardFooter>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="basic" className="relative">
                  Basic Info
                  {registrationProgress.basic && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                      <ClipboardCheckIcon className="h-2 w-2 text-white" />
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger value="classification" className="relative">
                  Classification
                  {registrationProgress.classification && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                      <ClipboardCheckIcon className="h-2 w-2 text-white" />
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger value="technical" className="relative">
                  Technical Details
                  {registrationProgress.technical && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                      <ClipboardCheckIcon className="h-2 w-2 text-white" />
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger value="impact" className="relative">
                  Impact Assessment
                  {registrationProgress.impact && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                      <ClipboardCheckIcon className="h-2 w-2 text-white" />
                    </div>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">System Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="e.g., HR Candidate Evaluation Tool" 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input 
                      id="version"
                      name="version"
                      placeholder="e.g., 1.0" 
                      value={formData.version}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department"
                    name="department"
                    placeholder="e.g., Human Resources" 
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">System Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of your AI system..." 
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Intended Purpose</Label>
                  <Textarea 
                    id="purpose"
                    name="purpose"
                    placeholder="Describe the intended purpose and use cases of the system..." 
                    rows={3}
                    value={formData.purpose}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => handleTabChange("classification")}
                    disabled={!formData.name || !formData.description || !formData.purpose}
                  >
                    Next Step
                    <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="classification" className="space-y-4 pt-4">
                <div className="space-y-3">
                  <Label>Risk Classification</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div 
                      className={`border rounded-md p-3 cursor-pointer ${
                        formData.riskLevel === "Unacceptable Risk" 
                          ? "border-red-500 bg-red-50"
                          : "hover:border-neutral-300"
                      }`}
                      onClick={() => handleRadioChange("riskLevel", "Unacceptable Risk")}
                    >
                      <RadioGroup value={formData.riskLevel} className="flex items-center mb-2">
                        <RadioGroupItem 
                          value="Unacceptable Risk" 
                          id="unacceptable" 
                          className={formData.riskLevel === "Unacceptable Risk" ? "text-red-500" : ""}
                        />
                        <Label 
                          htmlFor="unacceptable" 
                          className={`ml-2 font-medium ${
                            formData.riskLevel === "Unacceptable Risk" ? "text-red-600" : ""
                          }`}
                        >
                          Unacceptable Risk
                        </Label>
                      </RadioGroup>
                      <p className="text-xs text-neutral-500">
                        Systems posing a clear threat to safety, livelihoods, or rights of people.
                      </p>
                    </div>

                    <div 
                      className={`border rounded-md p-3 cursor-pointer ${
                        formData.riskLevel === "High Risk" 
                          ? "border-amber-500 bg-amber-50"
                          : "hover:border-neutral-300"
                      }`}
                      onClick={() => handleRadioChange("riskLevel", "High Risk")}
                    >
                      <RadioGroup value={formData.riskLevel} className="flex items-center mb-2">
                        <RadioGroupItem 
                          value="High Risk" 
                          id="high" 
                          className={formData.riskLevel === "High Risk" ? "text-amber-500" : ""}
                        />
                        <Label 
                          htmlFor="high" 
                          className={`ml-2 font-medium ${
                            formData.riskLevel === "High Risk" ? "text-amber-600" : ""
                          }`}
                        >
                          High Risk
                        </Label>
                      </RadioGroup>
                      <p className="text-xs text-neutral-500">
                        Systems with significant potential to harm health, safety, or fundamental rights.
                      </p>
                    </div>

                    <div 
                      className={`border rounded-md p-3 cursor-pointer ${
                        formData.riskLevel === "Limited Risk" 
                          ? "border-blue-500 bg-blue-50"
                          : "hover:border-neutral-300"
                      }`}
                      onClick={() => handleRadioChange("riskLevel", "Limited Risk")}
                    >
                      <RadioGroup value={formData.riskLevel} className="flex items-center mb-2">
                        <RadioGroupItem 
                          value="Limited Risk" 
                          id="limited" 
                          className={formData.riskLevel === "Limited Risk" ? "text-blue-500" : ""}
                        />
                        <Label 
                          htmlFor="limited" 
                          className={`ml-2 font-medium ${
                            formData.riskLevel === "Limited Risk" ? "text-blue-600" : ""
                          }`}
                        >
                          Limited Risk
                        </Label>
                      </RadioGroup>
                      <p className="text-xs text-neutral-500">
                        Systems requiring transparency measures but with lower risk profile.
                      </p>
                    </div>

                    <div 
                      className={`border rounded-md p-3 cursor-pointer ${
                        formData.riskLevel === "Minimal Risk" 
                          ? "border-green-500 bg-green-50"
                          : "hover:border-neutral-300"
                      }`}
                      onClick={() => handleRadioChange("riskLevel", "Minimal Risk")}
                    >
                      <RadioGroup value={formData.riskLevel} className="flex items-center mb-2">
                        <RadioGroupItem 
                          value="Minimal Risk" 
                          id="minimal" 
                          className={formData.riskLevel === "Minimal Risk" ? "text-green-500" : ""}
                        />
                        <Label 
                          htmlFor="minimal" 
                          className={`ml-2 font-medium ${
                            formData.riskLevel === "Minimal Risk" ? "text-green-600" : ""
                          }`}
                        >
                          Minimal Risk
                        </Label>
                      </RadioGroup>
                      <p className="text-xs text-neutral-500">
                        Systems presenting minimal or no risk to fundamental rights or safety.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-md mt-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Risk Classification Guidance</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Not sure about risk level? Use the SGH ASIA AI analysis to get a recommendation based on the system description or consult the official EU AI Act guidelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => handleTabChange("basic")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => handleTabChange("technical")}
                    disabled={!formData.riskLevel}
                  >
                    Next Step
                    <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="aiCapabilities">AI Capabilities</Label>
                  <Textarea 
                    id="aiCapabilities"
                    name="aiCapabilities"
                    placeholder="Describe the AI capabilities (e.g., machine learning, NLP, computer vision, etc.)" 
                    rows={3}
                    value={formData.aiCapabilities}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainingDatasets">Training Datasets</Label>
                  <Textarea 
                    id="trainingDatasets"
                    name="trainingDatasets"
                    placeholder="Describe the data used to train the system" 
                    rows={3}
                    value={formData.trainingDatasets}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outputTypes">Output Types</Label>
                  <Textarea 
                    id="outputTypes"
                    name="outputTypes"
                    placeholder="Describe the outputs produced by the system" 
                    rows={2}
                    value={formData.outputTypes}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => handleTabChange("classification")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => handleTabChange("impact")}
                    disabled={!formData.aiCapabilities || !formData.trainingDatasets}
                  >
                    Next Step
                    <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="usageContext">Usage Context</Label>
                  <Textarea 
                    id="usageContext"
                    name="usageContext"
                    placeholder="Describe the context and who will use the system" 
                    rows={3}
                    value={formData.usageContext}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="potentialImpact">
                    <span className="flex items-center">
                      <span>Potential Impact</span>
                      {formData.riskLevel === "High Risk" && (
                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800">Required for High Risk Systems</span>
                      )}
                    </span>
                  </Label>
                  <Textarea 
                    id="potentialImpact"
                    name="potentialImpact"
                    placeholder="Describe potential impacts on individuals, groups, or society" 
                    rows={3}
                    value={formData.potentialImpact}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mitigationMeasures">
                    <span className="flex items-center">
                      <span>Mitigation Measures</span>
                      {formData.riskLevel === "High Risk" && (
                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800">Required for High Risk Systems</span>
                      )}
                    </span>
                  </Label>
                  <Textarea 
                    id="mitigationMeasures"
                    name="mitigationMeasures"
                    placeholder="Describe measures to mitigate risks" 
                    rows={3}
                    value={formData.mitigationMeasures}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => handleTabChange("technical")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!formData.usageContext || (formData.riskLevel === "High Risk" && (!formData.potentialImpact || !formData.mitigationMeasures))}
                  >
                    Register System
                    <ShieldIcon className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}