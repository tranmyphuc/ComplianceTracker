
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon, DownloadIcon, ClipboardCheckIcon, RefreshCwIcon, InfoIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

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
      // In production, this would be a real API call
      // For now, simulate API response with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock document content
      const system = mockSystems.find(s => s.id === selectedSystem);
      
      // Generate a mock document based on the selected type and system
      let documentContent = '';
      
      switch (selectedDocType) {
        case DocumentType.TECHNICAL_DOCUMENTATION:
          documentContent = `# Technical Documentation
## ${system?.name || 'AI System'}
### ${companyName}

## 1. General Description
${system?.name || 'This AI system'} is designed to ${system?.id === '1' ? 'screen job candidates based on their resume and application data' : system?.id === '2' ? 'provide personalized product recommendations to customers' : system?.id === '3' ? 'detect potentially fraudulent transactions in real-time' : 'analyze the sentiment of customer feedback and support tickets'}.

## 2. System Architecture
The system employs a multi-layered architecture:
- Data ingestion layer
- Preprocessing module
- Core AI/ML engine (${system?.id === '1' ? 'based on BERT language model' : system?.id === '2' ? 'collaborative filtering algorithm' : system?.id === '3' ? 'ensemble of gradient boosting and neural networks' : 'fine-tuned RoBERTa model'})
- Post-processing layer
- API layer for integration

## 3. Development Process
The development followed a rigorous process in compliance with EU AI Act requirements:
- Requirements analysis with stakeholder input
- Design phase with ethical considerations
- Development with continuous testing
- Validation with representative data
- Deployment with monitoring capabilities

## 4. Training Methodology
Training was conducted using a diverse dataset of ${system?.id === '1' ? 'anonymized resumes and hiring outcomes' : system?.id === '2' ? 'customer interaction and purchase history' : system?.id === '3' ? 'labeled transaction data with known fraud cases' : 'labeled customer feedback data'}.

## 5. Testing & Validation
Comprehensive testing included:
- Unit tests for all components
- Integration testing
- Performance validation
- Bias and fairness testing
- Security testing

## 6. Risk Management
Risk assessment identified the following key risks:
- ${system?.id === '1' ? 'Potential bias in candidate selection' : system?.id === '2' ? 'Reinforcement of existing preferences leading to filter bubbles' : system?.id === '3' ? 'False positives impacting legitimate customers' : 'Misinterpretation of customer intent'}
- Data privacy concerns
- System accuracy degradation over time

Mitigation measures implemented include:
- Regular bias testing and monitoring
- Human oversight for critical decisions
- Periodic retraining and validation

## 7. Change Management
All changes follow a strict change management process:
- Change request review
- Impact assessment
- Testing in staging environment
- Approval by governance committee
- Controlled deployment
- Post-deployment monitoring`;
          break;
          
        case DocumentType.RISK_ASSESSMENT:
          documentContent = `# Risk Assessment Report
## ${system?.name || 'AI System'}
### ${companyName}

## 1. Risk Assessment Methodology
This risk assessment follows the ISO 31000 framework combined with specific EU AI Act requirements.

## 2. Identified Risks

### High Severity
- ${system?.id === '1' ? 'Algorithmic bias leading to discrimination in hiring decisions' : system?.id === '2' ? 'Privacy violations through inference attacks' : system?.id === '3' ? 'High rate of false positives leading to legitimate transaction blocking' : 'Misclassification of critical customer issues'}
- System security vulnerabilities

### Medium Severity
- Data quality degradation over time
- ${system?.id === '1' ? 'Lack of explainability for rejection decisions' : system?.id === '2' ? 'Over-personalization creating filter bubbles' : system?.id === '3' ? 'Adaptation lag when new fraud patterns emerge' : 'Inconsistent performance across different languages'}

### Low Severity
- System performance variations
- Integration issues with other systems

## 3. Potential Harm Analysis
The identified risks could lead to:
- ${system?.id === '1' ? 'Discrimination against protected groups' : system?.id === '2' ? 'Manipulation of user preferences' : system?.id === '3' ? 'Financial damage to legitimate customers' : 'Failure to address critical customer needs'}
- Regulatory non-compliance penalties
- Reputational damage
- ${system?.id === '1' ? 'Legal liability from affected candidates' : system?.id === '2' ? 'Erosion of customer trust' : system?.id === '3' ? 'Increased operational costs from manual reviews' : 'Customer churn due to poor support experience'}

## 4. Mitigation Measures
Implemented mitigation measures include:
- Regular bias and fairness audits
- Human oversight mechanism for ${system?.id === '1' ? 'final hiring decisions' : system?.id === '2' ? 'recommendation algorithms' : system?.id === '3' ? 'fraud determinations' : 'critical sentiment classifications'}
- Robust data governance framework
- Regular model retraining and validation
- Comprehensive system documentation
- Staff training on system limitations

## 5. Residual Risks
After mitigation, the following residual risks remain:
- Low probability of undetected bias in edge cases
- Potential for adversarial attacks
- System performance degradation with data drift

## 6. Monitoring & Review
Continuous monitoring includes:
- Quarterly comprehensive risk assessment reviews
- Automated performance monitoring dashboards
- Regular compliance checks
- User feedback collection and analysis
- External audit every 12 months`;
          break;
          
        default:
          documentContent = `# ${documentTypeLabels[selectedDocType]}
## ${system?.name || 'AI System'}
### ${companyName}

This is a document template for ${documentTypeLabels[selectedDocType]}.
The complete document would contain all sections required by the EU AI Act for compliance.

This document would typically include:
- System specifications
- Compliance measures
- Testing procedures
- Risk management approach
- Human oversight mechanisms
- Monitoring procedures

For a complete document, please use the document generator feature with your specific system details.`;
      }
      
      setGeneratedDocument(documentContent);
      setActiveTab('preview');
      
      toast({
        title: "Document generated",
        description: "Your document has been generated successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your document. Please try again.",
        variant: "destructive"
      });
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
            <div className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="preview">
            {generatedDocument ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDownloadDocument}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={handleCopyToClipboard}>
                    <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50 whitespace-pre-wrap font-mono text-sm">
                  {generatedDocument}
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
              
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(documentTypeLabels).map(([type, label]) => (
                  <Card key={type} className="cursor-pointer hover:bg-gray-50" onClick={() => {
                    setSelectedDocType(type as DocumentType);
                    setActiveTab('generate');
                  }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-500">
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
  );
}
