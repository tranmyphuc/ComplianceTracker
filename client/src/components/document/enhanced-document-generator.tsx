import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Download, Copy, ArrowLeft, Save, FileDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentType } from "@/shared/types";
import { queryClient } from "@/lib/queryClient";
import { DocumentVisualizations, DocumentReferences, DocumentMetadata } from './visualization-module';

// Available document formats
const documentFormats = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'html', label: 'HTML' },
  { value: 'pdf', label: 'PDF (Coming Soon)' },
  { value: 'docx', label: 'DOCX (Coming Soon)' }
];

// Document type labels
const documentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.TECHNICAL_DOCUMENTATION]: 'Technical Documentation',
  [DocumentType.RISK_ASSESSMENT]: 'Risk Assessment Report',
  [DocumentType.CONFORMITY_DECLARATION]: 'Declaration of Conformity',
  [DocumentType.HUMAN_OVERSIGHT_PROTOCOL]: 'Human Oversight Protocol',
  [DocumentType.DATA_GOVERNANCE_POLICY]: 'Data Governance Policy',
  [DocumentType.INCIDENT_RESPONSE_PLAN]: 'Incident Response Plan'
};

// Document type descriptions
const documentTypeDescriptions: Record<DocumentType, string> = {
  [DocumentType.TECHNICAL_DOCUMENTATION]: 'Comprehensive technical documentation as required by Article 11 of the EU AI Act.',
  [DocumentType.RISK_ASSESSMENT]: 'Detailed risk assessment report identifying and analyzing risks posed by the AI system.',
  [DocumentType.CONFORMITY_DECLARATION]: 'Declaration of conformity with EU AI Act requirements and applicable standards.',
  [DocumentType.HUMAN_OVERSIGHT_PROTOCOL]: 'Protocols for effective human oversight of AI system operation.',
  [DocumentType.DATA_GOVERNANCE_POLICY]: 'Policies and procedures for data management throughout the AI lifecycle.',
  [DocumentType.INCIDENT_RESPONSE_PLAN]: 'Structured approach to handling, reporting, and resolving incidents.'
};

/**
 * Enhanced Document Generator Component
 * A comprehensive UI for generating advanced EU AI Act compliant documents
 */
export function EnhancedDocumentGenerator() {
  // State for document generation
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(DocumentType.TECHNICAL_DOCUMENTATION);
  const [companyName, setCompanyName] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('markdown');
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [exportFilename, setExportFilename] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<string>('markdown');
  
  // Generated document state
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);
  
  const { toast } = useToast();
  
  // Fetch AI systems
  const { data: systems, isLoading: loadingSystems } = useQuery({
    queryKey: ['/api/systems'],
    staleTime: 60000, // 1 minute
  });
  
  // Document generation mutation
  const { mutate: generateDocument, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const system = systems?.find((s: any) => s.id.toString() === selectedSystem);
      
      if (!system) {
        throw new Error("System not found");
      }
      
      const response = await fetch('/api/enhanced-documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system,
          documentType: selectedDocType,
          companyName,
          additionalDetails: additionalDetails ? { customNotes: additionalDetails } : undefined,
          format: selectedFormat
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate document');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedDocument(data.document);
      setActiveTab('preview');
      toast({
        title: "Document Generated",
        description: "Your document has been successfully generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Generating Document",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    }
  });
  
  // Document export mutation
  const { mutate: exportDocument, isPending: isExporting } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/enhanced-documents/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: generatedDocument,
          format: exportFormat,
          filename: exportFilename || `${selectedDocType}-${Date.now()}`
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to export document');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setShowExportDialog(false);
      
      toast({
        title: "Document Exported",
        description: "Your document has been exported successfully.",
      });
      
      // Trigger download
      window.location.href = `/api/enhanced-documents/download/${data.file.filename}`;
    },
    onError: (error) => {
      toast({
        title: "Error Exporting Document",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    }
  });
  
  // Handle document generation
  const handleGenerateDocument = () => {
    if (!selectedSystem || !selectedDocType) {
      toast({
        title: "Missing information",
        description: "Please select both a system and document type.",
        variant: "destructive"
      });
      return;
    }
    
    generateDocument();
  };
  
  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    if (generatedDocument) {
      navigator.clipboard.writeText(generatedDocument.text);
      
      toast({
        title: "Copied to Clipboard",
        description: "Document content copied to clipboard",
      });
    }
  };
  
  // Handle export dialog
  const handleOpenExportDialog = () => {
    setExportFilename(`${selectedDocType}-${Date.now()}`);
    setShowExportDialog(true);
  };
  
  // Handle export document
  const handleExportDocument = () => {
    exportDocument();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Document Generator</CardTitle>
          <CardDescription>
            Generate comprehensive, legally sound documentation with visualizations and regulatory references
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedDocument}>Preview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system">AI System</Label>
                  <Select
                    value={selectedSystem}
                    onValueChange={setSelectedSystem}
                    disabled={loadingSystems || isGenerating}
                  >
                    <SelectTrigger id="system">
                      <SelectValue placeholder="Select an AI system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>AI Systems</SelectLabel>
                        {loadingSystems ? (
                          <SelectItem value="loading" disabled>
                            Loading systems...
                          </SelectItem>
                        ) : (
                          systems?.map((system: any) => (
                            <SelectItem key={system.id} value={system.id.toString()}>
                              {system.name} ({system.riskLevel})
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="docType">Document Type</Label>
                  <Select
                    value={selectedDocType}
                    onValueChange={(value) => setSelectedDocType(value as DocumentType)}
                    disabled={isGenerating}
                  >
                    <SelectTrigger id="docType">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Document Types</SelectLabel>
                        {Object.entries(documentTypeLabels).map(([type, label]) => (
                          <SelectItem key={type} value={type}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  <p className="text-xs text-neutral-500 mt-1">
                    {documentTypeDescriptions[selectedDocType]}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                    disabled={isGenerating}
                  >
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select output format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Formats</SelectLabel>
                        {documentFormats.map((format) => (
                          <SelectItem 
                            key={format.value} 
                            value={format.value}
                            disabled={format.value === 'pdf' || format.value === 'docx'}
                          >
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalDetails">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalDetails"
                    placeholder="Enter any additional information to include in the document..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    rows={4}
                    disabled={isGenerating}
                  />
                </div>
                
                <Button 
                  onClick={handleGenerateDocument} 
                  disabled={!selectedSystem || !selectedDocType || isGenerating}
                  className="w-full mt-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Document...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="pt-4">
              {generatedDocument ? (
                <div className="lg:grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleOpenExportDialog}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" onClick={handleCopyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('generate')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-neutral-50 whitespace-pre-wrap font-mono text-sm h-[calc(100vh-24rem)] overflow-auto">
                      {generatedDocument.text}
                    </div>
                  </div>
                  
                  <div className="mt-6 lg:mt-0 space-y-6">
                    <DocumentMetadata metadata={generatedDocument.metadata} />
                    <DocumentReferences references={generatedDocument.references} />
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
            
            <TabsContent value="templates" className="pt-4">
              <div className="space-y-6">
                <p className="text-sm text-gray-600">
                  Select from predefined document templates required for EU AI Act compliance.
                  Each template is tailored to specific risk levels and system types.
                </p>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(documentTypeLabels).map(([type, label]) => (
                    <Card 
                      key={type} 
                      className="cursor-pointer hover:bg-neutral-50 transition-colors"
                      onClick={() => {
                        setSelectedDocType(type as DocumentType);
                        setActiveTab('generate');
                      }}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{label}</CardTitle>
                        <CardDescription className="text-xs">
                          {documentTypeDescriptions[type as DocumentType]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="text-xs text-neutral-600">
                          <p className="font-medium">Key Components:</p>
                          <ul className="list-disc pl-4 mt-1 space-y-1">
                            {type === DocumentType.TECHNICAL_DOCUMENTATION && (
                              <>
                                <li>System architecture details</li>
                                <li>Data governance frameworks</li>
                                <li>Quality assurance measures</li>
                              </>
                            )}
                            
                            {type === DocumentType.RISK_ASSESSMENT && (
                              <>
                                <li>Risk identification methodology</li>
                                <li>Impact evaluation matrix</li>
                                <li>Mitigation strategies</li>
                              </>
                            )}
                            
                            {type === DocumentType.CONFORMITY_DECLARATION && (
                              <>
                                <li>Legal attestations</li>
                                <li>Standard compliance statements</li>
                                <li>Verification procedures</li>
                              </>
                            )}
                            
                            {type === DocumentType.HUMAN_OVERSIGHT_PROTOCOL && (
                              <>
                                <li>Oversight roles and responsibilities</li>
                                <li>Intervention procedures</li>
                                <li>Training requirements</li>
                              </>
                            )}
                            
                            {type === DocumentType.DATA_GOVERNANCE_POLICY && (
                              <>
                                <li>Data quality safeguards</li>
                                <li>Privacy protection measures</li>
                                <li>Data lifecycle management</li>
                              </>
                            )}
                            
                            {type === DocumentType.INCIDENT_RESPONSE_PLAN && (
                              <>
                                <li>Incident classification framework</li>
                                <li>Escalation procedures</li>
                                <li>Regulatory reporting guidelines</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocType(type as DocumentType);
                            setActiveTab('generate');
                          }}
                        >
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Document visualizations section */}
      {generatedDocument?.visualizations && activeTab === 'preview' && (
        <DocumentVisualizations visualizations={generatedDocument.visualizations} />
      )}
      
      {/* Export dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Document</DialogTitle>
            <DialogDescription>
              Export your document in various formats for sharing and offline use.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="export-filename">Filename</Label>
              <Input
                id="export-filename"
                placeholder="Enter filename"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="export-format">Format</Label>
              <Select
                value={exportFormat}
                onValueChange={setExportFormat}
              >
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Formats</SelectLabel>
                    {documentFormats.map((format) => (
                      <SelectItem 
                        key={format.value} 
                        value={format.value}
                        disabled={format.value === 'pdf' || format.value === 'docx'}
                      >
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExportDocument}
              disabled={isExporting || !exportFilename}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}