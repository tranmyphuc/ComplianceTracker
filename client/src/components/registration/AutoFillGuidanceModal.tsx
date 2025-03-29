import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { SparklesIcon, AlertCircleIcon, PencilIcon, SaveIcon, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface AutoFillGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAutoFill: (template?: string) => void;
}

// Sample description templates by category - these will be shown as examples
const categoryTemplates = {
  "biometric": {
    title: "Biometric Identification",
    example: "A facial recognition system used for employee access control at our headquarters. It captures facial biometric data from employees, converts it to encrypted templates, and matches against stored profiles to grant or deny access to secure areas.",
    icon: "🔐",
    riskLevel: "High Risk",
    badgeColor: "amber",
    technologies: ["Facial Recognition", "Biometric Data Processing", "Pattern Matching"]
  },
  "education": {
    title: "Education/Vocational",
    example: "AI-powered student assessment tool that analyzes essay responses to evaluate comprehension and provide automated feedback. It processes student submissions against established grading criteria to support educators in evaluating written work.",
    icon: "🎓",
    riskLevel: "Limited Risk",
    badgeColor: "blue",
    technologies: ["Natural Language Processing", "Semantic Analysis", "Automated Assessment"]
  },
  "employment": {
    title: "Employment/HR",
    example: "AI recruitment screening system that reviews resumes and matches candidates to job requirements. The system ranks applicants based on skills, experience, and qualifications to help HR teams identify suitable candidates for interviews.",
    icon: "👔",
    riskLevel: "High Risk",
    badgeColor: "amber",
    technologies: ["Document Analysis", "Candidate Ranking", "Automated Screening"]
  },
  "law": {
    title: "Law Enforcement",
    example: "Predictive policing algorithm used to analyze crime data and suggest patrol allocations. The system uses historical crime statistics and environmental factors to help police departments determine patrol strategies.",
    icon: "⚖️",
    riskLevel: "High Risk",
    badgeColor: "amber",
    technologies: ["Predictive Analytics", "Geospatial Analysis", "Statistical Modeling"]
  },
  "medical": {
    title: "Medical Imaging",
    example: "AI diagnostic support tool that analyzes chest X-rays to detect signs of pneumonia. The system highlights potential areas of concern on medical images to assist radiologists in making accurate diagnoses more efficiently.",
    icon: "🏥",
    riskLevel: "High Risk",
    badgeColor: "amber",
    technologies: ["Computer Vision", "Medical Image Analysis", "Diagnostic Support"]
  },
  "general": {
    title: "General Purpose AI",
    example: "An AI-powered content recommendation system that analyzes user behavior to suggest relevant articles, videos, and products. It processes user interaction data to personalize the content experience.",
    icon: "🤖",
    riskLevel: "Minimal Risk",
    badgeColor: "green",
    technologies: ["Recommendation Engine", "User Behavior Analysis", "Content Filtering"]
  }
};

export function AutoFillGuidanceModal({ isOpen, onClose, onStartAutoFill }: AutoFillGuidanceModalProps) {
  const [currentTab, setCurrentTab] = React.useState('about');
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | undefined>(undefined);
  const [customizedTemplate, setCustomizedTemplate] = React.useState<string | undefined>(undefined);
  const [isCustomizing, setIsCustomizing] = React.useState(false);

  React.useEffect(() => {
    if (selectedTemplate) {
      setCustomizedTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

  const handleStartAutoFill = () => {
    // Check if it's a custom input (direct entry)
    if (selectedTemplate === 'custom') {
      // For custom input, pass the customized template directly
      onStartAutoFill(customizedTemplate);
    } else {
      // For templates, use the customized version if available, otherwise use the original template
      onStartAutoFill(customizedTemplate || selectedTemplate);
    }
  };
  
  const handleCustomizeTemplate = () => {
    setIsCustomizing(true);
  };
  
  const handleSaveCustomization = () => {
    setIsCustomizing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">AI Auto-fill Guidance</DialogTitle>
          <DialogDescription>
            Let our AI analyze your system information and automatically complete the registration form
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">How Auto-fill Works</h3>
                <p className="text-muted-foreground mt-1">
                  Our AI system helps you accurately register your AI systems by:
                </p>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">1. Context Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      The system analyzes your description to understand what type of AI system you're registering.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">2. Form Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Based on the analysis, it extracts key details and fills in all relevant form fields.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">3. Risk Classification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      The system evaluates potential risks according to EU AI Act criteria and suggests an appropriate risk level.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">4. Compliance Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      It identifies potential compliance concerns and suggests documentation requirements.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Privacy Notice</AlertTitle>
                <AlertDescription>
                  Your description is processed securely. No data is stored long-term unless you complete registration.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4 py-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Below are examples of different AI systems and how they would be classified under the EU AI Act:
              </p>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card className="border-red-200">
                  <CardHeader className="pb-2 bg-red-50">
                    <CardTitle className="text-md">Unacceptable Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Social scoring systems used by public authorities</li>
                      <li>Systems using subliminal manipulation techniques</li>
                      <li>Real-time biometric identification systems in public spaces (with exceptions)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-amber-200">
                  <CardHeader className="pb-2 bg-amber-50">
                    <CardTitle className="text-md">High Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>CV scanning for recruitment</li>
                      <li>Credit scoring algorithms</li>
                      <li>Medical diagnostic systems</li>
                      <li>Remote biometric identification systems</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200">
                  <CardHeader className="pb-2 bg-blue-50">
                    <CardTitle className="text-md">Limited Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Chatbots with transparency obligations</li>
                      <li>Emotion recognition systems</li>
                      <li>AI-generated content systems</li>
                      <li>Biometric categorization systems</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200">
                  <CardHeader className="pb-2 bg-green-50">
                    <CardTitle className="text-md">Minimal Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>AI-powered video games</li>
                      <li>Spam filters</li>
                      <li>Inventory management systems</li>
                      <li>Manufacturing optimization tools</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4 py-4">
            <div className="space-y-4">
              {!isCustomizing ? (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      Select a template that's similar to your AI system to help our AI better understand your use case:
                    </p>
                    {selectedTemplate && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCustomizeTemplate}
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Customize
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {/* First add custom input option */}
                    <Card 
                      className={`cursor-pointer border-2 transition-colors hover:bg-neutral-50 ${selectedTemplate === 'custom' ? 'border-primary bg-blue-50' : 'border-neutral-200'}`}
                      onClick={() => {
                        setSelectedTemplate('custom');
                        setCustomizedTemplate('');
                        handleCustomizeTemplate();
                      }}
                    >
                      <CardHeader className="pb-2 flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-md flex items-center">
                            <span className="mr-2 text-xl" aria-hidden="true">✍️</span>
                            {selectedTemplate === 'custom' && (
                              <SparklesIcon className="h-4 w-4 mr-2 text-primary" />
                            )}
                            Custom Input
                          </CardTitle>
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                              Direct Entry
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">Enter your own detailed description directly without using a template</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded-md">Custom Text</span>
                          <span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded-md">Any AI System</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Then add all the template options */}
                    {Object.entries(categoryTemplates).map(([key, { title, example, icon, riskLevel, badgeColor, technologies }]) => (
                      <Card 
                        key={key}
                        className={`cursor-pointer border-2 transition-colors hover:bg-neutral-50 ${selectedTemplate === example ? 'border-primary bg-neutral-50' : 'border-neutral-200'}`}
                        onClick={() => setSelectedTemplate(example)}
                      >
                        <CardHeader className="pb-2 flex flex-row items-start justify-between">
                          <div>
                            <CardTitle className="text-md flex items-center">
                              <span className="mr-2 text-xl" aria-hidden="true">{icon}</span>
                              {selectedTemplate === example && (
                                <SparklesIcon className="h-4 w-4 mr-2 text-primary" />
                              )}
                              {title}
                            </CardTitle>
                            <div className="flex items-center mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                badgeColor === 'red' ? 'bg-red-100 text-red-800' :
                                badgeColor === 'amber' ? 'bg-amber-100 text-amber-800' :
                                badgeColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                                badgeColor === 'green' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {riskLevel}
                              </span>
                            </div>
                          </div>
                          {selectedTemplate === example && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCustomizeTemplate();
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-3 line-clamp-3">{example}</p>
                          {technologies && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {technologies.map((tech, idx) => (
                                <span 
                                  key={idx} 
                                  className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded-md"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      {selectedTemplate === 'custom' ? 'Enter Your AI System Description' : 'Customize Template'}
                    </h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsCustomizing(false)}
                      >
                        <XIcon className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={handleSaveCustomization}
                      >
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="customTemplateInput" className="mb-2 block">
                          {selectedTemplate === 'custom' 
                            ? 'Enter a detailed description of your AI system:' 
                            : 'Edit the template below to include your specific AI system details:'}
                        </Label>
                        <Textarea
                          id="customTemplateInput"
                          className="min-h-[250px] font-mono text-sm"
                          value={customizedTemplate || ''}
                          onChange={(e) => setCustomizedTemplate(e.target.value)}
                          placeholder="Describe your AI system in detail..."
                        />
                      </div>
                      
                      <div className="md:col-span-1 space-y-4">
                        <Alert className="bg-blue-50 border-blue-200">
                          <AlertCircleIcon className="h-4 w-4 text-blue-500" />
                          <AlertTitle className="text-blue-700">Customization Tips</AlertTitle>
                          <AlertDescription className="text-blue-600 text-sm">
                            <ul className="list-disc pl-5 space-y-1 mt-1">
                              <li>Include your system's purpose and primary functions</li>
                              <li>Mention key technologies used</li>
                              <li>Describe data sources and processing methods</li>
                              <li>Include information about the deployment environment</li>
                              <li>Specify user interactions and output formats</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2">
                          <h4 className="text-sm font-medium">Key Information to Include:</h4>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span className="text-xs font-medium">System Purpose</span>
                            </div>
                            <p className="text-xs text-neutral-600 ml-4">What problem does your AI system solve?</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span className="text-xs font-medium">Data Handling</span>
                            </div>
                            <p className="text-xs text-neutral-600 ml-4">What data does your system collect and process?</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="text-xs font-medium">Deployment Context</span>
                            </div>
                            <p className="text-xs text-neutral-600 ml-4">Where and how is your system deployed?</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              <span className="text-xs font-medium">Risk Considerations</span>
                            </div>
                            <p className="text-xs text-neutral-600 ml-4">Any potential risks or concerns your system addresses?</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartAutoFill}
            disabled={currentTab === 'templates' && !selectedTemplate}
            className="relative"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            {isCustomizing && selectedTemplate === 'custom' ? 'Start with Custom Input' :
              isCustomizing ? 'Apply Customized Template' : 
              selectedTemplate === 'custom' ? 'Start with Direct Input' :
              currentTab === 'templates' && selectedTemplate && customizedTemplate !== selectedTemplate ? 
              'Start Auto-fill with Custom Template' : 
              currentTab === 'templates' && selectedTemplate ? 
              'Start Auto-fill with Template' : 'Start Auto-fill'}
            {currentTab === 'templates' && selectedTemplate && customizedTemplate !== selectedTemplate && !isCustomizing && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}