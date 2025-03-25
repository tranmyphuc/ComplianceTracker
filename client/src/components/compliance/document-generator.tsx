
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon, DownloadIcon, ClipboardCheckIcon, RefreshCwIcon, InfoIcon, SparklesIcon, CheckIcon, ArrowLeftIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { AISuggestionPanel } from "../documentation/ai-suggestion-panel";

// Document template types that match server-side types
enum DocumentType {
  TECHNICAL_DOCUMENTATION = 'technical_documentation',
  RISK_ASSESSMENT = 'risk_assessment',
  CONFORMITY_DECLARATION = 'conformity_declaration',
  HUMAN_OVERSIGHT_PROTOCOL = 'human_oversight_protocol',
  DATA_GOVERNANCE_POLICY = 'data_governance_policy',
  INCIDENT_RESPONSE_PLAN = 'incident_response_plan'
}

const documentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.TECHNICAL_DOCUMENTATION]: 'Technical Documentation',
  [DocumentType.RISK_ASSESSMENT]: 'Risk Assessment Report',
  [DocumentType.CONFORMITY_DECLARATION]: 'Declaration of Conformity',
  [DocumentType.HUMAN_OVERSIGHT_PROTOCOL]: 'Human Oversight Protocol',
  [DocumentType.DATA_GOVERNANCE_POLICY]: 'Data Governance Policy',
  [DocumentType.INCIDENT_RESPONSE_PLAN]: 'Incident Response Plan'
};

export function DocumentGenerator() {
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(DocumentType.TECHNICAL_DOCUMENTATION);
  const [companyName, setCompanyName] = useState<string>('SGH ASIA Ltd.');
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [generatingDocument, setGeneratingDocument] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('generate');
  const { toast } = useToast();

  // Mock systems for demo purposes
  const mockSystems = [
    { id: '1', name: 'HR Candidate Screening System', riskLevel: 'High' },
    { id: '2', name: 'Customer Recommendation Engine', riskLevel: 'Limited' },
    { id: '3', name: 'Fraud Detection System', riskLevel: 'High' },
    { id: '4', name: 'Sentiment Analysis Tool', riskLevel: 'Minimal' }
  ];

  // Handle document generation
  const handleGenerateDocument = async () => {
    if (!selectedSystem || !selectedDocType) {
      toast({
        title: "Missing information",
        description: "Please select both a system and document type.",
        variant: "destructive"
      });
      return;
    }

    setGeneratingDocument(true);
    setGeneratedDocument('');

    try {
      // Get system details - in a real implementation, this would get the actual system data
      const system = mockSystems.find(s => s.id === selectedSystem);
      
      if (!system) {
        throw new Error("System not found");
      }
      
      // Create a system object that matches what the API expects
      // In a real implementation, we would fetch the actual system from the database
      const systemData = {
        name: system.name,
        description: `A ${system.riskLevel.toLowerCase()} risk AI system used in the organization.`,
        purpose: system.id === '1' ? 'HR candidate screening and evaluation' : 
                 system.id === '2' ? 'Customer recommendation and personalization' :
                 system.id === '3' ? 'Fraud detection and prevention' :
                 'Customer feedback sentiment analysis',
        department: system.id === '1' ? 'Human Resources' :
                    system.id === '2' ? 'Marketing' :
                    system.id === '3' ? 'Security' : 'Customer Support',
        riskLevel: system.riskLevel,
        vendor: system.id === '1' ? 'SGH HR Solutions' :
                system.id === '2' ? 'SGH Customer Analytics' :
                system.id === '3' ? 'SGH Security Systems' : 'SGH Support Tech',
        version: '1.0',
        systemId: system.id
      };
      
      // Call the API to generate the document
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system: systemData,
          documentType: selectedDocType,
          companyName: companyName,
          additionalDetails: {
            generatedBy: "EU AI Act Compliance Platform",
            generationDate: new Date().toISOString(),
            includeSummary: true
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store the generated document
      setGeneratedDocument(data.document);
      
      // Save to database (optional - would call another endpoint in a real implementation)
      // This would be using the documents endpoint to save the document
      const saveDocumentResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${documentTypeLabels[selectedDocType]} - ${system.name}`,
          type: selectedDocType,
          systemId: system.id,
          content: data.document,
          version: '1.0',
          status: 'draft',
          // createdBy would be the current user's ID
        }),
      });
      
      // Change to preview tab
      setActiveTab('preview');
      
      toast({
        title: "Document generated",
        description: "Your document has been generated successfully and saved as a draft.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating document:', error);
      
      // Fallback to offline mode if API fails
      // This ensures users can still generate basic documents even when the API is unavailable
      const system = mockSystems.find(s => s.id === selectedSystem);
      
      toast({
        title: "API Connection Issue",
        description: "Unable to connect to AI service. A basic document template has been generated instead.",
        variant: "destructive"
      });
      
      // Generate a basic document template
      const templateResponse = await fetch(`/api/documents/templates/${selectedDocType}`);
      if (templateResponse.ok) {
        const template = await templateResponse.json();
        let documentContent = `# ${template.title}\n## ${system?.name || 'AI System'}\n### ${companyName}\n\n`;
        
        template.sections.forEach((section: { title: string; content: string }) => {
          documentContent += `## ${section.title}\n${section.content}\n\n`;
        });
        
        setGeneratedDocument(documentContent);
        setActiveTab('preview');
      } else {
        setGeneratedDocument(`# ${documentTypeLabels[selectedDocType]}\n\nFailed to generate document. Please try again later.`);
      }
    } finally {
      setGeneratingDocument(false);
    }
  };

  // Handle document download
  const handleDownloadDocument = () => {
    if (!generatedDocument) return;
    
    const blob = new Blob([generatedDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTypeLabels[selectedDocType]}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Document downloaded",
      description: "Your document has been downloaded successfully.",
      variant: "default"
    });
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    if (!generatedDocument) return;
    
    navigator.clipboard.writeText(generatedDocument);
    
    toast({
      title: "Copied to clipboard",
      description: "Document content copied to clipboard successfully.",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>EU AI Act Document Generator</CardTitle>
          <CardDescription>
            Generate compliant documentation for your AI systems based on EU AI Act requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="generate">Generate Document</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedDocument}>Preview Document</TabsTrigger>
              <TabsTrigger value="templates">Document Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <div className="lg:grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system">Select AI System</Label>
                    <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                      <SelectTrigger id="system">
                        <SelectValue placeholder="Select an AI system" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSystems.map(system => (
                          <SelectItem key={system.id} value={system.id}>
                            {system.name} ({system.riskLevel} Risk)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="docType">Document Type</Label>
                    <Select 
                      value={selectedDocType} 
                      onValueChange={(value) => setSelectedDocType(value as DocumentType)}
                    >
                      <SelectTrigger id="docType">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(documentTypeLabels).map(([type, label]) => (
                          <SelectItem key={type} value={type}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="docDescription">
                      <AccordionTrigger>Document Description</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-gray-600 space-y-2">
                          <p><strong>{documentTypeLabels[selectedDocType]}</strong></p>
                          
                          {selectedDocType === DocumentType.TECHNICAL_DOCUMENTATION && (
                            <p>Technical Documentation is a comprehensive record of your AI system's design, development, and operation. The EU AI Act requires this documentation to include system specifications, development methodologies, risk management measures, and validation procedures.</p>
                          )}
                          
                          {selectedDocType === DocumentType.RISK_ASSESSMENT && (
                            <p>The Risk Assessment Report documents the process of identifying, analyzing, and evaluating risks associated with your AI system. This is a key requirement under EU AI Act Article 9 for high-risk systems and recommended for all AI systems.</p>
                          )}
                          
                          {selectedDocType === DocumentType.CONFORMITY_DECLARATION && (
                            <p>The Declaration of Conformity is a formal statement that your high-risk AI system complies with all applicable requirements of the EU AI Act. This document is required before placing a high-risk AI system on the market.</p>
                          )}
                          
                          {selectedDocType === DocumentType.HUMAN_OVERSIGHT_PROTOCOL && (
                            <p>The Human Oversight Protocol outlines the measures implemented to ensure effective human oversight of your AI system as required by EU AI Act Article 14 for high-risk systems.</p>
                          )}
                          
                          {selectedDocType === DocumentType.DATA_GOVERNANCE_POLICY && (
                            <p>The Data Governance Policy documents your organization's approach to data quality, data protection, and data management for AI systems in compliance with EU AI Act Article 10.</p>
                          )}
                          
                          {selectedDocType === DocumentType.INCIDENT_RESPONSE_PLAN && (
                            <p>The Incident Response Plan outlines procedures for detecting, addressing, and reporting serious incidents or malfunctions of your AI system as required by the EU AI Act.</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Button 
                    onClick={handleGenerateDocument} 
                    className="mt-4 w-full"
                    disabled={!selectedSystem || !selectedDocType || generatingDocument}
                  >
                    {generatingDocument ? (
                      <>
                        <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                        Generating Document...
                      </>
                    ) : (
                      <>
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        Generate Document
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="hidden lg:block">
                  {/* Document tips */}
                  <div className="border rounded-md p-4 bg-neutral-50">
                    <h3 className="font-medium mb-2 flex items-center text-neutral-800">
                      <SparklesIcon className="h-4 w-4 mr-2 text-primary" />
                      AI Suggestions
                    </h3>
                    <p className="text-sm text-neutral-600 mb-3">
                      Get AI-powered suggestions to enhance your documentation based on EU AI Act requirements.
                    </p>
                    <ul className="text-sm space-y-2 text-neutral-700">
                      <li className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Include specific oversight mechanisms</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Document data quality measures</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Detail testing methodology</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Describe risk management approach</span>
                      </li>
                    </ul>
                    
                    <p className="text-xs text-neutral-500 mt-4 italic">
                      After document generation, you can access the full AI Document Assistant for more detailed suggestions.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              {generatedDocument ? (
                <div className="lg:grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleDownloadDocument}>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" onClick={handleCopyToClipboard}>
                        <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('generate')}>
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Generator
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-neutral-50 whitespace-pre-wrap font-mono text-sm h-[calc(100vh-24rem)] overflow-auto">
                      {generatedDocument}
                    </div>
                  </div>
                  
                  {/* AI Suggestion Panel */}
                  <div className="hidden lg:block">
                    {/* We're importing our new AI Suggestion Panel component */}
                    <AISuggestionPanel 
                      documentType={selectedDocType} 
                      documentContent={generatedDocument} 
                      onInsertSuggestion={(text) => {
                        setGeneratedDocument(prev => prev + "\n\n" + text);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No document has been generated yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('generate')}
                  >
                    Go to Generator
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="templates">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  The EU AI Act requires specific documentation for AI systems, especially for high-risk systems. 
                  Below are templates for key documents required for compliance.
                </p>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(documentTypeLabels).map(([type, label]) => (
                    <Card key={type} className="cursor-pointer hover:bg-neutral-50" onClick={() => {
                      setSelectedDocType(type as DocumentType);
                      setActiveTab('generate');
                    }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{label}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-neutral-500">
                          {type === DocumentType.TECHNICAL_DOCUMENTATION && "Article 11: Required technical documentation"}
                          {type === DocumentType.RISK_ASSESSMENT && "Article 9: Risk management system"}
                          {type === DocumentType.CONFORMITY_DECLARATION && "Article 48: Declaration of conformity"}
                          {type === DocumentType.HUMAN_OVERSIGHT_PROTOCOL && "Article 14: Human oversight measures"}
                          {type === DocumentType.DATA_GOVERNANCE_POLICY && "Article 10: Data governance requirements"}
                          {type === DocumentType.INCIDENT_RESPONSE_PLAN && "Article 62: Incident management procedures"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex items-center justify-between bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 font-medium">Documentation Requirements</p>
                <p className="text-sm text-blue-600 mt-1">
                  Comprehensive documentation is a cornerstone of EU AI Act compliance, especially for high-risk systems.
                  These generated documents provide a starting point that should be customized with specific details of your AI systems.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Mobile-only AI suggestion panel - shown for smaller screens */}
      {generatedDocument && activeTab === 'preview' && (
        <div className="lg:hidden">
          <AISuggestionPanel 
            documentType={selectedDocType} 
            documentContent={generatedDocument} 
            onInsertSuggestion={(text) => {
              setGeneratedDocument(prev => prev + "\n\n" + text);
            }}
          />
        </div>
      )}
    </div>
  );
}
