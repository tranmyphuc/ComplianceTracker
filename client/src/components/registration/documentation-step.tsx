import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, CheckCircle2, Upload, Plus, Paperclip } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface DocumentationStepProps {
  formData: any;
  errors: Record<string, string>;
}

export const DocumentationStep: React.FC<DocumentationStepProps> = ({ formData, errors }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [technicalDoc, setTechnicalDoc] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Files Added",
        description: `Added ${newFiles.length} file(s) to documentation`,
      });
    }
  };

  // Remove an uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Generate technical documentation from system details
  const generateDocumentation = async () => {
    if (!formData.name || !formData.description || !formData.purpose) {
      toast({
        title: "Missing Information",
        description: "Please complete the previous steps with all required information before generating documentation.",
        variant: "destructive"
      });
      return;
    }
    
    setGeneratingDocs(true);
    setGenerationProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newValue = prev + Math.random() * 15;
        return newValue > 95 ? 95 : newValue;
      });
    }, 300);
    
    try {
      // Prepare system details for the documentation generation
      const systemDetails = {
        name: formData.name,
        description: formData.description,
        purpose: formData.purpose,
        vendor: formData.vendor || 'Not specified',
        version: formData.version || '1.0',
        riskLevel: formData.riskLevel || 'Unknown',
        aiCapabilities: formData.aiCapabilities || 'Not specified',
        trainingDatasets: formData.trainingDatasets || 'Not specified',
        mitigationMeasures: formData.mitigationMeasures || 'None specified',
        humanOversight: formData.humanOversight || 'Not specified',
        dataProtectionMeasures: formData.dataProtectionMeasures || 'Not specified'
      };
      
      // In a real application, we would call the backend API to generate documentation
      // For now, simulate an API call with a timeout
      setTimeout(() => {
        const documentTemplate = generateDocumentationTemplate(systemDetails);
        setTechnicalDoc(documentTemplate);
        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        toast({
          title: "Documentation Generated",
          description: "Technical documentation has been generated successfully.",
        });
        
        setTimeout(() => {
          setGeneratingDocs(false);
        }, 500);
      }, 2000);
    } catch (error) {
      console.error('Error generating documentation:', error);
      clearInterval(progressInterval);
      
      toast({
        title: "Generation Failed",
        description: "There was an error generating documentation. Please try again.",
        variant: "destructive"
      });
      
      setGeneratingDocs(false);
      setGenerationProgress(0);
    }
  };

  // Generate a documentation template based on the system details
  const generateDocumentationTemplate = (system: any) => {
    return `# Technical Documentation: ${system.name}

## System Overview
${system.description}

## Purpose and Intended Use
${system.purpose}

## System Specifications
- **Vendor**: ${system.vendor}
- **Version**: ${system.version}
- **Risk Classification**: ${system.riskLevel}

## AI Capabilities
${system.aiCapabilities}

## Training Data Information
${system.trainingDatasets}

## Risk Mitigation Measures
${system.mitigationMeasures}

## Human Oversight Mechanisms
${system.humanOversight}

## Data Protection Measures
${system.dataProtectionMeasures}

## EU AI Act Compliance Notes
This system has been registered in compliance with the EU AI Act requirements for documentation and transparency.
`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl mb-2">System Documentation</CardTitle>
            <CardDescription>
              Document your AI system's technical details according to EU AI Act Article 13 requirements
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            Step 4 of 5
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Alert className="bg-blue-50 text-blue-700 border-blue-200">
              <FileText className="h-5 w-5" />
              <AlertTitle>Documentation Requirements</AlertTitle>
              <AlertDescription>
                The EU AI Act requires detailed documentation for AI systems, especially for high-risk systems. 
                Complete this step to ensure your system meets regulatory requirements.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Documentation Checklist</h3>
              <div className="grid gap-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Technical Documentation</p>
                    <p className="text-sm text-gray-500">System design, capabilities, and architecture</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Training Methodology</p>
                    <p className="text-sm text-gray-500">Description of training data and training processes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Risk Management</p>
                    <p className="text-sm text-gray-500">Risk assessment, mitigation measures, and compliance</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Supporting Documentation</p>
                    <p className="text-sm text-gray-500">Any additional files or evidence of compliance</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setActiveTab('technical')} 
                className="mt-4"
              >
                Go to Technical Documentation
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Technical Documentation</h3>
              <Button 
                onClick={generateDocumentation} 
                disabled={generatingDocs}
                variant="outline"
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                {generatingDocs ? 'Generating...' : 'Generate Documentation'}
              </Button>
            </div>
            
            {generatingDocs && (
              <div className="space-y-2 my-4">
                <div className="flex justify-between text-sm">
                  <span>Generating documentation...</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}
            
            <Textarea 
              value={technicalDoc} 
              onChange={(e) => setTechnicalDoc(e.target.value)} 
              placeholder="Enter or generate technical documentation for your AI system..."
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setActiveTab('attachments')} 
                className="mt-2"
              >
                Continue to Attachments
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="attachments" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Supporting Documentation</h3>
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                  <Upload className="h-4 w-4" />
                  <span>Upload Files</span>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            
            <div className="border rounded-md p-4">
              {uploadedFiles.length > 0 ? (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <span className="sr-only">Remove</span>
                        <span className="h-4 w-4">×</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Paperclip className="h-8 w-8 mb-2" />
                  <p>No files uploaded yet</p>
                  <p className="text-sm mt-1">
                    Upload supporting documentation such as system diagrams, test results, or compliance certificates
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};