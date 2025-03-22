
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { BrainIcon, Upload, PencilIcon, SparklesIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import RegistrationGuide from './registration-guide';

// Initial form data structure
const initialFormData = {
  name: '',
  description: '',
  purpose: '',
  version: '',
  department: '',
  vendor: '',
  riskLevel: 'Limited',
  systemId: '',
  aiCapabilities: '',
  trainingDatasets: '',
  outputTypes: '',
  usageContext: '',
  potentialImpact: '',
  mitigationMeasures: '',
  implementationDate: '',
  lastAssessmentDate: '',
  expectedLifetime: '',
  maintenanceSchedule: '',
  owner: '',
  deploymentScope: '',
  integrations: [],
  changeHistory: [],
  dataSources: [],
  trainingDataDescription: ''
};

export const SystemRegistration: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [sghAsiaAiInProgress, setSghAsiaAiInProgress] = useState(false);
  const [sghAsiaAiResults, setSghAsiaAiResults] = useState<any>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTab, setAiTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionInProgress, setExtractionInProgress] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [aiTextInput, setAiTextInput] = useState('');
  const [aiResults, setAiResults] = useState<any>(null);
  const [confidenceScore, setConfidenceScore] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({
      ...formData,
      department: value
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

      toast({
        title: "AI Analysis Complete",
        description: `System classified as ${results.riskClassification} risk with ${results.complianceScore}% compliance score.`,
      });
    } catch (error) {
      console.error("Error running AI analysis:", error);
      setSghAsiaAiInProgress(false);
      toast({
        title: "Analysis Error",
        description: "There was a problem running the AI analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Extract information from the document using DeepSeek AI
  const extractInformation = async () => {
    setExtractionInProgress(true);
    setExtractionProgress(0);

    // Simulate the extraction process with progress
    const progressInterval = setInterval(() => {
      setExtractionProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 10);
      });
    }, 300);

    try {
      // Mock extraction for demo - in production, this would call the DeepSeek API
      setTimeout(() => {
        clearInterval(progressInterval);
        setExtractionProgress(100);
        
        // Sample extraction results
        const extractedData = {
          name: uploadedFile ? 'HR Candidate Evaluation Tool v3' : 'Customer Service AI Chatbot',
          vendor: uploadedFile ? 'TalentAI Inc.' : 'ServiceBot Technologies',
          version: uploadedFile ? '3.2.1' : '2.5.0',
          department: uploadedFile ? 'Human Resources' : 'Customer Support',
          purpose: uploadedFile 
            ? 'Analyzes candidate resumes and applications to rank job candidates based on skill matching, experience, and qualification criteria.' 
            : 'Provides automated customer support through natural language understanding of customer queries.',
          aiCapabilities: uploadedFile 
            ? 'Natural Language Processing, Supervised Learning, Ranking Algorithms' 
            : 'NLP, Intent Recognition, Knowledge Base Retrieval',
          dataTypes: uploadedFile 
            ? 'Resumes, Job Applications, Job Descriptions, Historical Hiring Data' 
            : 'Customer Questions, Support Tickets, Product Knowledge Base',
          riskLevel: uploadedFile ? 'High' : 'Limited'
        };
        
        setAiResults(extractedData);
        setConfidenceScore(uploadedFile ? 92 : 87);
        setExtractionInProgress(false);
      }, 3000);
    } catch (error) {
      console.error("Error extracting information:", error);
      setExtractionInProgress(false);
      toast({
        title: "Extraction Error",
        description: "There was a problem extracting information. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Extract information from text description
  const analyzeTextDescription = async () => {
    if (!aiTextInput) {
      toast({
        title: "Input Required",
        description: "Please enter a description of the AI system.",
        variant: "destructive"
      });
      return;
    }

    setExtractionInProgress(true);
    setExtractionProgress(0);

    // Simulate the extraction process with progress
    const progressInterval = setInterval(() => {
      setExtractionProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 10);
      });
    }, 200);

    try {
      // Mock text analysis for demo - in production, this would call the DeepSeek API
      setTimeout(() => {
        clearInterval(progressInterval);
        setExtractionProgress(100);
        
        const extractedData = {
          name: aiTextInput.includes('TalentAI') ? 'HR Candidate Evaluation System' : 'Customer Interaction AI',
          vendor: aiTextInput.includes('TalentAI') ? 'TalentAI Inc.' : 'AI Service Solutions',
          version: aiTextInput.includes('3.2.1') ? '3.2.1' : '1.0',
          department: aiTextInput.includes('HR') ? 'Human Resources' : 'Customer Service',
          purpose: aiTextInput.substring(0, 120) + '...',
          aiCapabilities: aiTextInput.includes('machine learning') ? 'Machine Learning, Ranking, Pattern Recognition' : 'NLP, Intent Recognition, Sentiment Analysis',
          dataTypes: aiTextInput.includes('resume') ? 'Resumes, Applications, Candidate Data' : 'Customer Conversations, Support Tickets',
          riskLevel: aiTextInput.includes('HR') || aiTextInput.includes('recruitment') ? 'High' : 'Limited'
        };
        
        setAiResults(extractedData);
        setConfidenceScore(85);
        setExtractionInProgress(false);
      }, 2500);
    } catch (error) {
      console.error("Error analyzing text:", error);
      setExtractionInProgress(false);
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing the text. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Apply all AI results to form data
  const applyAllResults = () => {
    if (aiResults) {
      setFormData({
        ...formData,
        name: aiResults.name || formData.name,
        vendor: aiResults.vendor || formData.vendor,
        version: aiResults.version || formData.version,
        department: aiResults.department || formData.department,
        purpose: aiResults.purpose || formData.purpose,
        aiCapabilities: aiResults.aiCapabilities || formData.aiCapabilities,
        trainingDatasets: aiResults.dataTypes || formData.trainingDatasets,
        riskLevel: aiResults.riskLevel || formData.riskLevel
      });
      
      setAiModalOpen(false);
      
      toast({
        title: "Information Applied",
        description: "AI-extracted information has been applied to the form.",
      });
    }
  };

  // Apply a single result field
  const applyField = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    toast({
      title: "Field Updated",
      description: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated.`,
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Submit system registration:", formData);
    
    try {
      const response = await fetch('/api/systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          createdBy: "system", // In a real app, this would be the user's ID
        })
      });
      
      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "The AI system has been registered successfully.",
        });
        
        setLocation('/dashboard');
      } else {
        const errorData = await response.json();
        toast({
          title: "Registration Failed",
          description: errorData.message || "Failed to register the AI system.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting the form. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <RegistrationGuide />
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
                Let our SGH ASIA AI analyze your system details and suggest appropriate classification and compliance requirements
              </p>
            </div>
            <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="whitespace-nowrap">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>AI-Assisted System Registration</span>
                    <span className="text-xs text-blue-600 font-normal">Powered by SGH ASIA AI</span>
                  </DialogTitle>
                  <DialogDescription>
                    Our AI will analyze your information and suggest fields based on available information.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs value={aiTab} onValueChange={setAiTab}>
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="upload" className="flex-1">Upload Documentation</TabsTrigger>
                    <TabsTrigger value="text" className="flex-1">Enter Description</TabsTrigger>
                    <TabsTrigger value="url" className="flex-1">URL/API Endpoint</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload">
                    <div className="space-y-4">
                      <div 
                        className="border-2 border-dashed border-neutral-300 rounded-md p-8 text-center cursor-pointer hover:bg-neutral-50 transition-colors"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                        <p className="text-sm font-medium">Drag & drop system documentation or click to browse</p>
                        <p className="text-xs text-neutral-500 mt-1">Supported formats: PDF, DOCX, TXT, JSON</p>
                        
                        <input 
                          id="file-upload" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.docx,.txt,.json"
                          onChange={handleFileUpload}
                        />
                        
                        {uploadedFile && (
                          <div className="mt-4 text-sm bg-blue-50 p-2 rounded flex items-center justify-center">
                            <span className="truncate max-w-[280px]">{uploadedFile.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={extractInformation}
                        disabled={!uploadedFile || extractionInProgress}
                      >
                        {extractionInProgress ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>Extract Information</>
                        )}
                      </Button>
                      
                      {extractionInProgress && (
                        <div className="space-y-2">
                          <Progress value={extractionProgress} className="h-2" />
                          <p className="text-xs text-center text-neutral-500">SGH ASIA AI is analyzing the document...</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text">
                    <div className="space-y-4">
                      <div>
                        <Textarea 
                          placeholder="Describe the AI system in your own words..." 
                          className="min-h-[120px]"
                          value={aiTextInput}
                          onChange={(e) => setAiTextInput(e.target.value)}
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          Provide details about functionality, purpose, technology used, and deployment context
                        </p>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={analyzeTextDescription}
                        disabled={!aiTextInput || extractionInProgress}
                      >
                        {extractionInProgress ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2"></div>
                            DeepSeek is analyzing...
                          </>
                        ) : (
                          <>Analyze with DeepSeek</>
                        )}
                      </Button>
                      
                      {extractionInProgress && (
                        <div className="space-y-2">
                          <Progress value={extractionProgress} className="h-2" />
                          <p className="text-xs text-center text-neutral-500">DeepSeek AI is analyzing your description...</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="api-url">API Endpoint or Documentation URL</Label>
                        <Input id="api-url" placeholder="https://api.example.com/ai-system/info" />
                        <p className="text-xs text-neutral-500 mt-1">
                          Enter a URL to your system's API documentation or specification
                        </p>
                      </div>
                      
                      <Button className="w-full" disabled>
                        Fetch Information
                      </Button>
                      <p className="text-xs text-center text-neutral-500">
                        URL/API analysis coming soon
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {aiResults && !extractionInProgress && (
                  <div className="mt-6 border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">DeepSeek Analysis Results</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {confidenceScore}% Confidence
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {Object.entries(aiResults).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between border-b border-neutral-100 pb-2">
                          <div>
                            <span className="text-sm font-medium capitalize">
                              {key === 'name' ? 'System Name' : key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <p className="text-sm text-neutral-700 truncate max-w-[300px]">{value as string}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => applyField(key === 'dataTypes' ? 'trainingDatasets' : key, value as string)}
                            >
                              Apply
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <PencilIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {aiResults && aiResults.riskLevel && (
                      <div className="mt-4 bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                        <p className="font-medium text-amber-800">EU AI Act Classification:</p>
                        <p className="text-amber-700">
                          Based on the analysis, this appears to be a {aiResults.riskLevel.toLowerCase()} risk system
                          {aiResults.riskLevel === 'High' && " under EU AI Act Article 6.2"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setAiModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applyAllResults}
                    disabled={!aiResults || extractionInProgress}
                  >
                    Apply All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">System Name*</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="E.g., Customer Service Chatbot"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={aiResults && aiResults.name === formData.name ? "bg-blue-50 border-blue-200" : ""}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="description">System Description*</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what the AI system does..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className={aiResults && aiResults.purpose === formData.description ? "bg-blue-50 border-blue-200" : ""}
                />
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    name="version"
                    placeholder="E.g., 1.0.0"
                    value={formData.version}
                    onChange={handleInputChange}
                    className={aiResults && aiResults.version === formData.version ? "bg-blue-50 border-blue-200" : ""}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    name="vendor"
                    placeholder="E.g., OpenAI"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    className={aiResults && aiResults.vendor === formData.vendor ? "bg-blue-50 border-blue-200" : ""}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="department">Department*</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={handleDepartmentChange}
                    required
                  >
                    <SelectTrigger className={aiResults && aiResults.department === formData.department ? "bg-blue-50 border-blue-200" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="R&D">R&D</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label>Risk Level Classification*</Label>
                <RadioGroup 
                  value={formData.riskLevel} 
                  onValueChange={(value) => handleRadioChange('riskLevel', value)}
                  className="flex flex-col space-y-1"
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Unacceptable" id="unacceptable" />
                    <Label htmlFor="unacceptable" className="font-normal">Unacceptable Risk</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="High" id="high" />
                    <Label htmlFor="high" className="font-normal">High Risk</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Limited" id="limited" />
                    <Label htmlFor="limited" className="font-normal">Limited Risk</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Minimal" id="minimal" />
                    <Label htmlFor="minimal" className="font-normal">Minimal Risk</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="aiCapabilities">AI Capabilities</Label>
                <Textarea
                  id="aiCapabilities"
                  name="aiCapabilities"
                  placeholder="Describe the AI techniques and capabilities..."
                  value={formData.aiCapabilities}
                  onChange={handleInputChange}
                  className={aiResults && aiResults.aiCapabilities === formData.aiCapabilities ? "bg-blue-50 border-blue-200" : ""}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="trainingDatasets">Training Datasets</Label>
                <Textarea
                  id="trainingDatasets"
                  name="trainingDatasets"
                  placeholder="Describe the data used to train the system..."
                  value={formData.trainingDatasets}
                  onChange={handleInputChange}
                  className={aiResults && aiResults.dataTypes === formData.trainingDatasets ? "bg-blue-50 border-blue-200" : ""}
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="usageContext">Usage Context</Label>
                  <Textarea
                    id="usageContext"
                    name="usageContext"
                    placeholder="Describe how and where the system is used..."
                    value={formData.usageContext}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="potentialImpact">Potential Impact</Label>
                  <Textarea
                    id="potentialImpact"
                    name="potentialImpact"
                    placeholder="Describe potential impacts on users, society..."
                    value={formData.potentialImpact}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="mitigationMeasures">Risk Mitigation Measures</Label>
                <Textarea
                  id="mitigationMeasures"
                  name="mitigationMeasures"
                  placeholder="Describe measures to mitigate risks..."
                  value={formData.mitigationMeasures}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {sghAsiaAiResults && (
              <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">AI Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Risk Classification:</span> {sghAsiaAiResults.riskClassification}</p>
                    <p><span className="font-medium">EU AI Act Articles:</span> {sghAsiaAiResults.euAiActArticles.join(', ')}</p>
                    <p><span className="font-medium">Compliance Score:</span> {sghAsiaAiResults.complianceScore}%</p>
                    
                    {sghAsiaAiResults.suggestedImprovements && (
                      <div>
                        <p className="font-medium mt-2">Suggested Improvements:</p>
                        <ul className="list-disc list-inside mt-1 pl-2">
                          {sghAsiaAiResults.suggestedImprovements.map((item: string, index: number) => (
                            <li key={index} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => runSghAsiaAiAnalysis()}
                disabled={sghAsiaAiInProgress || !formData.description}
              >
                {sghAsiaAiInProgress ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="mr-2 h-4 w-4" />
                    Analyze with SGH AI
                  </>
                )}
              </Button>
              
              <Button type="submit">Register System</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
