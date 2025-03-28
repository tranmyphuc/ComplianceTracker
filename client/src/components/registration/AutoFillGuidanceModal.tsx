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
import { SparklesIcon, AlertCircleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

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
  },
  "education": {
    title: "Education/Vocational",
    example: "AI-powered student assessment tool that analyzes essay responses to evaluate comprehension and provide automated feedback. It processes student submissions against established grading criteria to support educators in evaluating written work.",
  },
  "employment": {
    title: "Employment/HR",
    example: "AI recruitment screening system that reviews resumes and matches candidates to job requirements. The system ranks applicants based on skills, experience, and qualifications to help HR teams identify suitable candidates for interviews.",
  },
  "law": {
    title: "Law Enforcement",
    example: "Predictive policing algorithm used to analyze crime data and suggest patrol allocations. The system uses historical crime statistics and environmental factors to help police departments determine patrol strategies.",
  },
  "medical": {
    title: "Medical Imaging",
    example: "AI diagnostic support tool that analyzes chest X-rays to detect signs of pneumonia. The system highlights potential areas of concern on medical images to assist radiologists in making accurate diagnoses more efficiently.",
  },
  "general": {
    title: "General Purpose AI",
    example: "An AI-powered content recommendation system that analyzes user behavior to suggest relevant articles, videos, and products. It processes user interaction data to personalize the content experience.",
  }
};

export function AutoFillGuidanceModal({ isOpen, onClose, onStartAutoFill }: AutoFillGuidanceModalProps) {
  const [currentTab, setCurrentTab] = React.useState('about');
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | undefined>(undefined);

  const handleStartAutoFill = () => {
    onStartAutoFill(selectedTemplate);
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
              <p className="text-muted-foreground">
                Select a template that's similar to your AI system to help our AI better understand your use case:
              </p>
              
              <div className="grid gap-4 grid-cols-1">
                {Object.entries(categoryTemplates).map(([key, { title, example }]) => (
                  <Card 
                    key={key}
                    className={`cursor-pointer border-2 transition-colors hover:bg-neutral-50 ${selectedTemplate === example ? 'border-primary' : 'border-neutral-200'}`}
                    onClick={() => setSelectedTemplate(example)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center">
                        {selectedTemplate === example && (
                          <SparklesIcon className="h-4 w-4 mr-2 text-primary" />
                        )}
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{example}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            Start Auto-fill {currentTab === 'templates' && selectedTemplate ? 'with Template' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}