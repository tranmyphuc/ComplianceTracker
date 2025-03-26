
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ChartBarIcon, AlertTriangle, CheckCircle, Ban, ExternalLink, FileDown, X, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

// Types for AI systems
interface AISystem {
  id: string;
  name: string;
  department: string;
  riskLevel: 'high' | 'medium' | 'low' | 'unacceptable';
  riskScore: number;
  docCompleteness: number;
  complianceStatus: 'compliant' | 'partially-compliant' | 'non-compliant' | 'prohibited';
  lastAssessmentDate: Date;
  implementationDate: Date;
  purpose: string;
  vendor?: string;
  version?: string;
  trainingDatasets?: string;
  complianceGaps?: string[];
}

// Mock data for AI systems
const mockAiSystems: AISystem[] = [
  {
    id: 'HR-AI-001',
    name: 'Recruitment Assistant',
    department: 'Human Resources',
    riskLevel: 'high',
    riskScore: 85,
    docCompleteness: 70,
    complianceStatus: 'partially-compliant',
    lastAssessmentDate: new Date('2025-01-15'),
    implementationDate: new Date('2024-05-10'),
    purpose: 'CV screening and candidate evaluation',
    vendor: 'AI Recruit Tech',
    version: '2.3.1',
    trainingDatasets: 'Historical hiring data, anonymized CVs',
    complianceGaps: [
      'Incomplete technical documentation',
      'Human oversight measures not fully implemented',
      'Training data quality assessment needed'
    ]
  },
  {
    id: 'CS-AI-002',
    name: 'Customer Support Chatbot',
    department: 'Customer Service',
    riskLevel: 'medium',
    riskScore: 63,
    docCompleteness: 85,
    complianceStatus: 'compliant',
    lastAssessmentDate: new Date('2025-02-20'),
    implementationDate: new Date('2024-06-05'),
    purpose: 'Automated customer inquiry handling',
    vendor: 'DialogFlow Enterprise',
    version: '3.1.0',
    trainingDatasets: 'Customer service transcripts, FAQ database',
    complianceGaps: []
  },
  {
    id: 'FIN-AI-003',
    name: 'Financial Risk Analyzer',
    department: 'Finance',
    riskLevel: 'high',
    riskScore: 92,
    docCompleteness: 45,
    complianceStatus: 'non-compliant',
    lastAssessmentDate: new Date('2025-01-05'),
    implementationDate: new Date('2024-04-15'),
    purpose: 'Credit risk assessment and fraud detection',
    vendor: 'FinTech Analytics',
    version: '1.7.5',
    trainingDatasets: 'Transaction history, credit records',
    complianceGaps: [
      'Missing risk management system',
      'Incomplete bias assessment',
      'Insufficient data governance measures',
      'Technical documentation incomplete',
      'Data quality control measures not implemented'
    ]
  },
  {
    id: 'MKT-AI-004',
    name: 'Customer Segmentation Tool',
    department: 'Marketing',
    riskLevel: 'low',
    riskScore: 30,
    docCompleteness: 90,
    complianceStatus: 'compliant',
    lastAssessmentDate: new Date('2025-03-01'),
    implementationDate: new Date('2024-07-20'),
    purpose: 'Customer grouping for targeted marketing',
    vendor: 'MarketSmart',
    version: '4.0.2',
    trainingDatasets: 'Customer purchasing data, demographic information',
    complianceGaps: []
  },
  {
    id: 'SEC-AI-005',
    name: 'Facial Recognition Security',
    department: 'Security',
    riskLevel: 'unacceptable',
    riskScore: 96,
    docCompleteness: 20,
    complianceStatus: 'prohibited',
    lastAssessmentDate: new Date('2025-01-10'),
    implementationDate: new Date('2023-12-01'),
    purpose: 'Real-time biometric identification in office areas',
    vendor: 'SecureTech AI',
    version: '2.1.3',
    trainingDatasets: 'Employee photos, security camera footage',
    complianceGaps: [
      'Falls under prohibited use case (real-time biometric identification in public space)',
      'Insufficient safeguards for biometric data',
      'Missing technical documentation',
      'No human oversight implementation'
    ]
  }
];

// System comparison component
const SystemComparison: React.FC = () => {
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [availableSystems, setAvailableSystems] = useState<AISystem[]>(mockAiSystems);
  const [comparingSystems, setComparingSystems] = useState<AISystem[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLanguage();
  
  // Add system to comparison
  const addSystem = (systemId: string) => {
    if (selectedSystems.length >= 3) {
      alert('You can compare a maximum of 3 systems at a time');
      return;
    }
    
    if (!selectedSystems.includes(systemId)) {
      setSelectedSystems([...selectedSystems, systemId]);
    }
  };
  
  // Remove system from comparison
  const removeSystem = (systemId: string) => {
    setSelectedSystems(selectedSystems.filter(id => id !== systemId));
  };
  
  // Update systems being compared when selection changes
  useEffect(() => {
    const systemsToCompare = availableSystems.filter(system => 
      selectedSystems.includes(system.id)
    );
    setComparingSystems(systemsToCompare);
  }, [selectedSystems, availableSystems]);
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': 
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partially-compliant': 
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'non-compliant': 
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'prohibited': 
        return <Ban className="h-4 w-4 text-red-500" />;
      default: 
        return null;
    }
  };
  
  // Get risk level badge
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high': 
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium': 
        return <Badge variant="secondary">Medium Risk</Badge>;
      case 'low': 
        return <Badge variant="outline">Low Risk</Badge>;
      case 'unacceptable': 
        return <Badge variant="destructive">Prohibited</Badge>;
      default: 
        return null;
    }
  };
  
  // Export comparison as PDF/CSV
  const exportComparison = () => {
    console.log('Exporting comparison for systems:', selectedSystems);
    // In a real implementation, this would generate and download a PDF or CSV
    alert('Export feature would generate a PDF or CSV in the actual implementation');
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">AI System Comparison Tool</h1>
        <p className="text-muted-foreground">
          Compare multiple AI systems to identify common compliance gaps and patterns
        </p>
      </div>
      
      {/* System selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Systems to Compare</CardTitle>
          <CardDescription>Choose up to 3 AI systems from your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {selectedSystems.length > 0 ? (
              selectedSystems.map((systemId) => {
                const system = availableSystems.find(s => s.id === systemId);
                return system ? (
                  <Card key={system.id} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)]">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{system.name}</CardTitle>
                          <CardDescription>{system.department}</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => removeSystem(system.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(system.complianceStatus)}
                          <span className="ml-1 text-sm">
                            {system.complianceStatus === 'compliant' ? 'Compliant' : 
                             system.complianceStatus === 'partially-compliant' ? 'Partially Compliant' : 
                             system.complianceStatus === 'non-compliant' ? 'Non-Compliant' : 
                             'Prohibited'}
                          </span>
                        </div>
                        <div>{getRiskBadge(system.riskLevel)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null;
              })
            ) : (
              <div className="w-full text-center py-4 text-muted-foreground bg-muted/40 rounded-lg">
                No systems selected. Please select systems to compare.
              </div>
            )}
            
            {selectedSystems.length < 3 && (
              <Card className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] border-dashed bg-background">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Add System</CardTitle>
                  <CardDescription>Select from inventory</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Select onValueChange={addSystem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a system" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSystems
                        .filter(system => !selectedSystems.includes(system.id))
                        .map(system => (
                          <SelectItem key={system.id} value={system.id}>
                            {system.name} ({system.department})
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSystems([])}
            disabled={selectedSystems.length === 0}
          >
            Clear Selection
          </Button>
          <Button 
            onClick={exportComparison}
            disabled={selectedSystems.length === 0}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export Comparison
          </Button>
        </CardFooter>
      </Card>
      
      {/* Comparison content */}
      {comparingSystems.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
            <CardDescription>
              {comparingSystems.length === 1 
                ? 'Viewing details for one system' 
                : `Comparing ${comparingSystems.length} AI systems`}
            </CardDescription>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="compliance">Compliance Gaps</TabsTrigger>
                <TabsTrigger value="details">System Details</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="overview" className="m-0">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Aspect</TableHead>
                      {comparingSystems.map(system => (
                        <TableHead key={system.id}>{system.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Risk Level</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{getRiskBadge(system.riskLevel)}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Risk Score</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{system.riskScore}/100</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Documentation Completeness</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>
                          <div className="flex items-center gap-2">
                            <Progress value={system.docCompleteness} className="w-[100px]" />
                            <span>{system.docCompleteness}%</span>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Compliance Status</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>
                          <div className="flex items-center">
                            {getStatusIcon(system.complianceStatus)}
                            <span className="ml-2">
                              {system.complianceStatus === 'compliant' ? 'Compliant' : 
                               system.complianceStatus === 'partially-compliant' ? 'Partially Compliant' : 
                               system.complianceStatus === 'non-compliant' ? 'Non-Compliant' : 
                               'Prohibited'}
                            </span>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Last Assessment</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{formatDate(system.lastAssessmentDate)}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Implementation Date</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{formatDate(system.implementationDate)}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Department</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{system.department}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Purpose</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{system.purpose}</TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="m-0">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Compliance Gaps Analysis</h3>
                
                {comparingSystems.map(system => (
                  <Card key={system.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{system.name}</CardTitle>
                        {getRiskBadge(system.riskLevel)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {system.complianceGaps && system.complianceGaps.length > 0 ? (
                        <ul className="space-y-2">
                          {system.complianceGaps.map((gap, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 mt-1 text-amber-500 flex-shrink-0" />
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>No compliance gaps identified</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {comparingSystems.length > 1 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Common Compliance Issues</h3>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        {/* This would require more sophisticated analysis in a real implementation */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-1 text-amber-500 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Documentation Gaps</p>
                              <p className="text-sm text-muted-foreground">
                                {comparingSystems.filter(s => 
                                  s.complianceGaps?.some(gap => 
                                    gap.toLowerCase().includes('documentation')
                                  )
                                ).length} of {comparingSystems.length} systems have documentation issues
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-1 text-amber-500 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Human Oversight Implementation</p>
                              <p className="text-sm text-muted-foreground">
                                {comparingSystems.filter(s => 
                                  s.complianceGaps?.some(gap => 
                                    gap.toLowerCase().includes('human oversight')
                                  )
                                ).length} of {comparingSystems.length} systems have human oversight issues
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-1 text-amber-500 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Data Governance</p>
                              <p className="text-sm text-muted-foreground">
                                {comparingSystems.filter(s => 
                                  s.complianceGaps?.some(gap => 
                                    gap.toLowerCase().includes('data')
                                  )
                                ).length} of {comparingSystems.length} systems have data governance issues
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="m-0">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Property</TableHead>
                      {comparingSystems.map(system => (
                        <TableHead key={system.id}>{system.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">System ID</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{system.id}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Vendor</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{system.vendor || 'N/A'}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Version</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{system.version || 'N/A'}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Training Datasets</TableCell>
                      {comparingSystems.map(system => (
                        <TableCell key={system.id}>{system.trainingDatasets || 'N/A'}</TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="m-0">
              <div className="p-6 space-y-6">
                {comparingSystems.map(system => (
                  <Card key={system.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{system.name}</CardTitle>
                        <div className="flex items-center">
                          {getStatusIcon(system.complianceStatus)}
                          <span className="ml-2 text-sm">
                            {system.complianceStatus === 'compliant' ? 'Compliant' : 
                             system.complianceStatus === 'partially-compliant' ? 'Partially Compliant' : 
                             system.complianceStatus === 'non-compliant' ? 'Non-Compliant' : 
                             'Prohibited'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {system.complianceStatus === 'compliant' && (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                            <span>System is compliant with all requirements. Continue with regular monitoring.</span>
                          </div>
                        </div>
                      )}
                      
                      {system.complianceStatus === 'partially-compliant' && (
                        <div className="space-y-2">
                          {system.complianceGaps?.map((gap, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 mt-1 text-amber-500 flex-shrink-0" />
                              <div>
                                <p>{gap}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {gap.toLowerCase().includes('documentation') && 'Update technical documentation according to Article 11 requirements.'}
                                  {gap.toLowerCase().includes('human oversight') && 'Implement human oversight measures as required by Article 14.'}
                                  {gap.toLowerCase().includes('training data') && 'Perform data quality assessment as outlined in Article 10.'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {system.complianceStatus === 'non-compliant' && (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Urgent Action Required</p>
                              <p className="text-sm text-muted-foreground">
                                This system requires significant remediation to meet EU AI Act requirements.
                              </p>
                            </div>
                          </div>
                          {system.complianceGaps?.map((gap, index) => (
                            <div key={index} className="flex items-start gap-2 mt-2">
                              <AlertTriangle className="h-4 w-4 mt-1 text-amber-500 flex-shrink-0" />
                              <div>
                                <p>{gap}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {gap.toLowerCase().includes('risk management') && 'Develop and implement a risk management system according to Article 9.'}
                                  {gap.toLowerCase().includes('bias') && 'Conduct a comprehensive bias assessment and mitigation plan.'}
                                  {gap.toLowerCase().includes('data governance') && 'Implement data governance measures as required by Article 10.'}
                                  {gap.toLowerCase().includes('documentation') && 'Create technical documentation according to Article 11 requirements.'}
                                  {gap.toLowerCase().includes('data quality') && 'Establish data quality control measures as outlined in Article 10.'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {system.complianceStatus === 'prohibited' && (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Ban className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
                            <div>
                              <p className="font-medium">System Prohibited Under EU AI Act</p>
                              <p className="text-sm text-muted-foreground">
                                This system appears to fall under prohibited practices defined in Article 5.
                                Immediate discontinuation is recommended.
                              </p>
                            </div>
                          </div>
                          {system.complianceGaps?.map((gap, index) => (
                            <div key={index} className="flex items-start gap-2 mt-2">
                              <AlertTriangle className="h-4 w-4 mt-1 text-red-500 flex-shrink-0" />
                              <span>{gap}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {/* Common recommendations for multiple systems */}
                {comparingSystems.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Cross-System Recommendations</h3>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-start gap-2">
                          <ChartBarIcon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">Standardize Documentation Approach</p>
                            <p className="text-sm text-muted-foreground">
                              Implement a consistent documentation framework across all systems to ensure compliance with Article 11.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <ChartBarIcon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">Centralized Risk Management</p>
                            <p className="text-sm text-muted-foreground">
                              Develop organization-wide risk management standards to streamline compliance across all high-risk AI systems.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <ChartBarIcon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">Regular Compliance Audits</p>
                            <p className="text-sm text-muted-foreground">
                              Establish a regular audit schedule for all AI systems to ensure ongoing compliance with EU AI Act requirements.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <ExternalLink className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium">Additional Resources</p>
                            <div className="flex space-x-2 mt-1">
                              <Button variant="outline" size="sm" asChild>
                                <a href="/documentation/risk-assessment" className="text-xs">Risk Assessment Guide</a>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <a href="/documentation/technical-documentation" className="text-xs">Documentation Templates</a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <ChartBarIcon className="h-10 w-10 text-primary/80" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Select Systems to Compare</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Use this tool to compare multiple AI systems side-by-side, identify common compliance gaps, and get tailored recommendations.
            </p>
            <Button onClick={() => addSystem(availableSystems[0].id)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First System
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemComparison;
