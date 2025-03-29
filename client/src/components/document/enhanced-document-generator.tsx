/**
 * Enhanced Document Generator Component
 * A comprehensive UI for generating advanced EU AI Act compliant documents
 */

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { marked } from 'marked';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DocumentType, DocumentFormat, RiskLevel } from '@shared/types';
import { VisualizationModule } from './visualization-module';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart,
  BookOpen,
  RefreshCw,
  FileDown,
  Link2,
  Image,
  Loader2,
  ChevronDown,
  ChevronRight,
  FileUp,
  FileSearch,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// Document templates
const DOCUMENT_TEMPLATES = [
  { 
    type: DocumentType.TECHNICAL_DOCUMENTATION, 
    title: 'Technical Documentation',
    description: 'Comprehensive technical details of the AI system',
    icon: <FileText className="h-5 w-5 mr-2" />,
    riskLevel: RiskLevel.HIGH,
    techTags: ['Detailed', 'Technical', 'Comprehensive']
  },
  { 
    type: DocumentType.RISK_ASSESSMENT, 
    title: 'Risk Assessment Report',
    description: 'Analysis of potential risks and mitigation measures',
    icon: <AlertCircle className="h-5 w-5 mr-2" />,
    riskLevel: RiskLevel.HIGH,
    techTags: ['Risk Analysis', 'Mitigation', 'Compliance']
  },
  { 
    type: DocumentType.CONFORMITY_DECLARATION, 
    title: 'Declaration of Conformity',
    description: 'Official declaration of EU AI Act compliance',
    icon: <CheckCircle2 className="h-5 w-5 mr-2" />,
    riskLevel: RiskLevel.LIMITED,
    techTags: ['Legal', 'Official', 'Certification']
  },
  { 
    type: DocumentType.HUMAN_OVERSIGHT_PROTOCOL, 
    title: 'Human Oversight Protocol',
    description: 'Procedures for human supervision of AI systems',
    icon: <BookOpen className="h-5 w-5 mr-2" />,
    riskLevel: RiskLevel.HIGH,
    techTags: ['Procedural', 'Supervision', 'Control']
  },
  { 
    type: DocumentType.DATA_GOVERNANCE_POLICY, 
    title: 'Data Governance Policy',
    description: 'Guidelines for AI data collection and management',
    icon: <BarChart className="h-5 w-5 mr-2" />,
    riskLevel: RiskLevel.LIMITED,
    techTags: ['Data Management', 'Privacy', 'Governance']
  },
  { 
    type: DocumentType.INCIDENT_RESPONSE_PLAN, 
    title: 'Incident Response Plan',
    description: 'Procedures for handling AI system incidents',
    icon: <RefreshCw className="h-5 w-5 mr-2" />,
    riskLevel: RiskLevel.HIGH,
    techTags: ['Emergency', 'Response', 'Mitigation']
  },
];

// Risk level colors
const RISK_COLORS = {
  [RiskLevel.UNACCEPTABLE]: 'bg-destructive text-destructive-foreground',
  [RiskLevel.HIGH]: 'bg-amber-500 text-white',
  [RiskLevel.LIMITED]: 'bg-blue-500 text-white',
  [RiskLevel.MINIMAL]: 'bg-green-500 text-white',
};

// Document schema
const documentFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  documentType: z.nativeEnum(DocumentType),
  systemId: z.string().optional(),
  content: z.string().min(20, { message: 'Content must be at least 20 characters' }),
  includeVisualization: z.boolean().default(true),
  visualizationTypes: z.array(z.string()).optional(),
  includeReferences: z.boolean().default(true),
  format: z.nativeEnum(DocumentFormat).default(DocumentFormat.PDF),
  additionalNotes: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

export function EnhancedDocumentGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentType | null>(null);
  const [previewMarkdown, setPreviewMarkdown] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('template');
  const [generatedDocumentId, setGeneratedDocumentId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Fetch AI systems for selection
  const { data: systems } = useQuery({
    queryKey: ['/api/systems'],
  });
  
  // Form initialization with default values
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: '',
      documentType: DocumentType.TECHNICAL_DOCUMENTATION,
      content: '',
      includeVisualization: true,
      visualizationTypes: ['risk-heatmap', 'compliance-timeline'],
      includeReferences: true,
      format: DocumentFormat.PDF,
      additionalNotes: '',
    },
  });
  
  // Update form when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const template = DOCUMENT_TEMPLATES.find(t => t.type === selectedTemplate);
      if (template) {
        form.setValue('documentType', template.type);
        form.setValue('title', `${template.title} - ${new Date().toISOString().split('T')[0]}`);
      }
    }
  }, [selectedTemplate, form]);
  
  // Document generation mutation
  const generateDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormValues) => {
      setIsGenerating(true);
      try {
        const response = await apiRequest('/api/enhanced-documents/generate', {
          method: 'POST',
          body: data,
        });
        return response;
      } finally {
        setIsGenerating(false);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Document Generated Successfully",
        description: `Your ${data.documentType} has been created.`,
      });
      setPreviewMarkdown(data.content);
      setGeneratedDocumentId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/enhanced-documents'] });
      setActiveTab('preview');
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate document",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });
  
  // Document export mutation
  const exportDocumentMutation = useMutation({
    mutationFn: async (data: { id: string; format: DocumentFormat }) => {
      const response = await apiRequest('/api/enhanced-documents/export', {
        method: 'POST',
        body: data,
      });
      return response;
    },
    onSuccess: (data) => {
      // Trigger download
      window.open(`/api/enhanced-documents/download/${data.filename}`, '_blank');
      toast({
        title: "Document Exported Successfully",
        description: `Your document has been exported in ${data.format.toUpperCase()} format.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to export document",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  function onSubmit(data: DocumentFormValues) {
    generateDocumentMutation.mutate(data);
  }
  
  // Export the generated document
  const handleExport = () => {
    if (generatedDocumentId) {
      exportDocumentMutation.mutate({
        id: generatedDocumentId,
        format: form.getValues('format'),
      });
    }
  };
  
  // Handle document file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle document import and analysis
  const handleImportDocument = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('document', selectedFile);
      
      // Call the API to analyze the document
      const response = await fetch('/api/enhanced-documents/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }
      
      const data = await response.json();
      
      // Update the form with the analyzed content
      if (data.content) {
        form.setValue('content', data.content);
      }
      
      // Set AI suggestions if available
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
      
      // Show success message
      toast({
        title: "Document Analyzed Successfully",
        description: "The content has been extracted and analyzed.",
      });
      
    } catch (error: any) {
      toast({
        title: "Document Analysis Failed",
        description: error.message || "Please try again with a different file",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  // Risk level badge component
  const RiskLevelBadge = ({ riskLevel }: { riskLevel: RiskLevel }) => (
    <Badge className={RISK_COLORS[riskLevel]}>
      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
    </Badge>
  );
  
  // Tech tag component
  const TechTag = ({ tag }: { tag: string }) => (
    <Badge variant="outline" className="mr-1 mb-1">
      {tag}
    </Badge>
  );
  
  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="template">
            <ChevronRight className={`h-4 w-4 mr-1 ${activeTab === 'template' ? 'transform rotate-90' : ''}`} />
            Select Template
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedTemplate && activeTab !== 'details'}>
            <ChevronRight className={`h-4 w-4 mr-1 ${activeTab === 'details' ? 'transform rotate-90' : ''}`} />
            Document Details
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!previewMarkdown && activeTab !== 'preview'}>
            <ChevronRight className={`h-4 w-4 mr-1 ${activeTab === 'preview' ? 'transform rotate-90' : ''}`} />
            Preview & Export
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="template" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Choose a Document Template</CardTitle>
              <CardDescription>
                Select the type of document you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOCUMENT_TEMPLATES.map((template) => (
                  <Card 
                    key={template.type}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate === template.type ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedTemplate(template.type)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {template.icon}
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                        </div>
                        <RiskLevelBadge riskLevel={template.riskLevel} />
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap mt-2">
                        {template.techTags.map((tag, index) => (
                          <TechTag key={index} tag={tag} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button 
                className="mt-6 w-full md:w-auto" 
                disabled={!selectedTemplate}
                onClick={() => setActiveTab('details')}
              >
                Continue with Selected Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>
                Provide information about your document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter document title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="systemId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI System (Optional)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an AI system" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None (Generic Document)</SelectItem>
                              {Array.isArray(systems) && systems.map((system: any) => (
                                <SelectItem key={system.id} value={system.systemId}>
                                  {system.name} ({system.systemId})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Link this document to a specific AI system for better context
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Document Import */}
                  <div className="p-4 border rounded-md mb-4 bg-muted/30">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <FileUp className="h-4 w-4 mr-2" />
                      Import from Existing Document
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.docx,.txt,.md"
                          className="max-w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported formats: PDF, DOCX, TXT, Markdown
                        </p>
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          className="w-full"
                          variant="outline"
                          onClick={handleImportDocument}
                          disabled={!selectedFile || isImporting}
                        >
                          {isImporting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <FileSearch className="mr-2 h-4 w-4" />
                              Analyze & Import
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {aiSuggestions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">AI Suggestions</h4>
                        <ul className="space-y-1">
                          {aiSuggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter or paste the content for your document" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about your AI system. More detailed content will result in better document generation.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="includeVisualization"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center">
                              <Image className="h-4 w-4 mr-2" />
                              Include Visualizations
                            </FormLabel>
                            <FormDescription>
                              Add charts and graphics to enhance your document
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="includeReferences"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center">
                              <Link2 className="h-4 w-4 mr-2" />
                              Include Legal References
                            </FormLabel>
                            <FormDescription>
                              Add links to relevant EU AI Act articles and regulations
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Export Format</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(DocumentFormat).map((format) => (
                              <SelectItem key={format} value={format}>
                                {format.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the format for exporting your document
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('template')}
                    >
                      Back to Templates
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Document...
                        </>
                      ) : (
                        'Generate Document'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{form.getValues('title')}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {form.getValues('documentType').replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {form.getValues('format').toUpperCase()}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Preview your generated document before exporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-6 bg-white">
                <ScrollArea className="h-96">
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: previewMarkdown ? marked.parse(previewMarkdown) : '<p>No preview available</p>'
                    }}
                  />
                </ScrollArea>
              </div>
              
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="visualizations">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      Document Visualizations
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {form.getValues('includeVisualization') ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <VisualizationModule 
                          type="risk-heatmap"
                          title="AI System Risk Assessment"
                          data={[
                            { name: 'Fundamental Rights', value: 35, riskLevel: RiskLevel.LIMITED },
                            { name: 'Data Privacy', value: 20, riskLevel: RiskLevel.MINIMAL },
                            { name: 'Technical Robustness', value: 30, riskLevel: RiskLevel.HIGH },
                            { name: 'Transparency', value: 15, riskLevel: RiskLevel.LIMITED }
                          ]}
                        />
                        <VisualizationModule 
                          type="compliance-timeline"
                          title="Compliance Readiness Timeline"
                          data={[
                            { date: 'Jan 2024', complianceScore: 30, targetScore: 40 },
                            { date: 'Apr 2024', complianceScore: 45, targetScore: 60 },
                            { date: 'Jul 2024', complianceScore: 70, targetScore: 80 },
                            { date: 'Oct 2024', complianceScore: 85, targetScore: 90 },
                            { date: 'Jan 2025', complianceScore: 95, targetScore: 100 }
                          ]}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No visualizations included in this document.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="legalRefs">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Legal References
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {form.getValues('includeReferences') ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Link2 className="h-4 w-4 mt-1 text-blue-500" />
                          <div>
                            <p className="font-medium">Article 9 - Risk Management System</p>
                            <p className="text-sm text-muted-foreground">
                              Requirements for high-risk AI systems to implement risk management processes
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-2">
                          <Link2 className="h-4 w-4 mt-1 text-blue-500" />
                          <div>
                            <p className="font-medium">Article 11 - Technical Documentation</p>
                            <p className="text-sm text-muted-foreground">
                              Requirements for comprehensive documentation of high-risk AI systems
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-2">
                          <Link2 className="h-4 w-4 mt-1 text-blue-500" />
                          <div>
                            <p className="font-medium">Article 17 - Quality Management System</p>
                            <p className="text-sm text-muted-foreground">
                              Requirements for implementing quality standards in high-risk AI development
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No legal references included in this document.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('details')}
              >
                Back to Edit
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setSelectedTemplate(null);
                    setPreviewMarkdown('');
                    setGeneratedDocumentId(null);
                    setActiveTab('template');
                  }}
                >
                  Start Over
                </Button>
                <Button 
                  onClick={handleExport}
                  disabled={exportDocumentMutation.isPending}
                >
                  {exportDocumentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Export Document
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}