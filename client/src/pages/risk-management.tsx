import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  FileText,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  FilePlus,
  Grid3X3,
  MoreHorizontal,
  ClipboardCheck,
  Activity,
  FlaskConical,
  Users,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { apiRequest } from '@/lib/queryClient';

// Define interfaces based on the server interfaces
interface RiskManagementSystem {
  rmsId: string;
  systemId: string;
  status: 'active' | 'inactive' | 'under_review' | 'outdated';
  createdDate: string;
  lastUpdateDate: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  reviewCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  responsiblePerson?: string;
  documentReference?: string;
  version: number;
  notes?: string;
}

interface RiskControl {
  controlId: string;
  systemId: string;
  name: string;
  description: string;
  controlType: 'technical' | 'procedural' | 'organizational' | 'contractual';
  implementationStatus: 'planned' | 'in_progress' | 'implemented' | 'verified' | 'failed';
  effectiveness?: 'very_effective' | 'effective' | 'partially_effective' | 'ineffective' | 'not_implemented' | 'not_tested';
  implementationDate?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  responsiblePerson?: string;
  relatedGaps?: string[];
  documentationLinks?: string[];
  testResults?: any[];
  notes?: string;
}

interface RiskEvent {
  eventId: string;
  systemId: string;
  eventType: 'incident' | 'near_miss' | 'performance_deviation' | 'external_factor' | 'user_feedback';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  detectionDate: string;
  reportedBy: string;
  status: 'new' | 'under_investigation' | 'resolved' | 'closed';
  impact?: string;
  rootCause?: string;
  mitigationActions?: string[];
  recurrencePrevention?: string;
  closureDate?: string;
  relatedControls?: string[];
}

interface RiskAssessment {
  assessmentId: string;
  systemId: string;
  createdBy: string;
  assessmentDate: string;
  status: 'draft' | 'in_progress' | 'completed' | 'approved' | 'rejected' | 'requires_update';
  riskLevel: 'unacceptable' | 'high' | 'limited' | 'minimal';
  riskScore: number;
  systemCategory?: string;
  prohibitedUseChecks?: any[];
  riskParameters?: any[];
  euAiActArticles?: string[];
  complianceGaps?: any[];
  remediationActions?: any[];
  evidenceDocuments?: any[];
  summaryNotes?: string;
}

interface AiSystem {
  id: number;
  systemId: string;
  name: string;
  description: string;
  vendor: string;
  department: string;
  purpose: string;
  version: string;
  aiCapabilities: string;
  trainingDatasets: string;
  riskLevel: string;
  registeredDate: string;
  lastUpdated: string;
  status: string;
  internalOwner: string;
}

// Main component
export default function RiskManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [controlDialogOpen, setControlDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [rmsDialogOpen, setRmsDialogOpen] = useState(false);
  
  // New control form state
  const [newControl, setNewControl] = useState<Partial<RiskControl>>({
    name: '',
    description: '',
    controlType: 'technical',
    implementationStatus: 'planned',
  });
  
  // New event form state
  const [newEvent, setNewEvent] = useState<Partial<RiskEvent>>({
    eventType: 'incident',
    severity: 'medium',
    description: '',
    status: 'new',
  });
  
  // New RMS form state
  const [newRms, setNewRms] = useState<Partial<RiskManagementSystem>>({
    reviewCycle: 'quarterly',
    status: 'active',
    version: 1.0,
  });

  // Fetch AI systems
  const { data: systems, isLoading: isLoadingSystems } = useQuery({
    queryKey: ['/api/systems'],
  });

  // Fetch all risk assessments for Risk Management
  const { data: riskAssessments, isLoading: isLoadingAssessments, error: riskAssessmentError } = useQuery({
    queryKey: ['/api/risk-assessments'],
  });
  
  useEffect(() => {
    if (riskAssessmentError) {
      console.error('Error fetching risk assessments:', riskAssessmentError);
      toast({
        title: "Error",
        description: "Failed to load risk assessments data",
        variant: "destructive"
      });
    }
  }, [riskAssessmentError, toast]);

  // Fetch risk management systems with assessments
  const { data: riskManagementSystems, isLoading: isLoadingRms, error: rmsError, refetch: refetchRms } = useQuery({
    queryKey: ['/api/risk-management/systems'],
  });
  
  useEffect(() => {
    if (rmsError) {
      console.error('Error fetching risk management systems:', rmsError);
      toast({
        title: "Error",
        description: "Failed to load risk management systems data",
        variant: "destructive"
      });
    }
  }, [rmsError, toast]);

  // Fetch risk controls for the selected system
  const { data: riskControls, isLoading: isLoadingControls, refetch: refetchControls } = useQuery({
    queryKey: ['/api/risk-management/controls', selectedSystem],
    enabled: !!selectedSystem && false, // Will be enabled later when endpoint is available
  });

  // Fetch risk events for the selected system
  const { data: riskEvents, isLoading: isLoadingEvents, refetch: refetchEvents } = useQuery({
    queryKey: ['/api/risk-management/events', selectedSystem],
    enabled: !!selectedSystem && false, // Will be enabled later when endpoint is available
  });

  // Simulate data for development (remove this when backend is available)
  const mockSystems: AiSystem[] = Array.isArray(systems) ? systems : Array(5).fill(0).map((_, i) => ({
    id: i + 1,
    systemId: `AI-SYS-100${i+1}`,
    name: `AI System ${i+1}`,
    description: 'An AI system for business operations',
    vendor: 'SGH ASIA',
    department: 'IT Department',
    purpose: 'Automation and data analysis',
    version: '1.0',
    aiCapabilities: 'Natural Language Processing, Computer Vision',
    trainingDatasets: 'Internal data',
    riskLevel: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Limited' : 'Minimal',
    registeredDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    status: 'Active',
    internalOwner: 'Jane Doe'
  }));

  const mockRiskManagementSystems: RiskManagementSystem[] = Array.isArray(riskManagementSystems) ? riskManagementSystems : 
    (Array.isArray(mockSystems) && mockSystems.length > 0 
      ? mockSystems.slice(0, 3).map((system: AiSystem) => ({
          rmsId: `RMS-${system.systemId}`,
          systemId: system.systemId,
          status: 'active' as const,
          createdDate: new Date().toISOString(),
          lastUpdateDate: new Date().toISOString(),
          reviewCycle: 'quarterly' as const,
          responsiblePerson: 'John Smith',
          version: 1.0,
          notes: 'Initial risk management system setup'
        })) 
      : []);

  const mockRiskControls: RiskControl[] = Array.isArray(riskControls) ? riskControls : Array(4).fill(0).map((_, i) => ({
    controlId: `CTRL-${i+1}`,
    systemId: selectedSystem || '',
    name: `Control ${i+1}`,
    description: 'This control addresses compliance requirements',
    controlType: ['technical', 'procedural', 'organizational', 'contractual'][i % 4] as 'technical' | 'procedural' | 'organizational' | 'contractual',
    implementationStatus: ['planned', 'in_progress', 'implemented', 'verified'][i % 4] as 'planned' | 'in_progress' | 'implemented' | 'verified',
    effectiveness: ['effective', 'partially_effective', 'very_effective', 'not_tested'][i % 4] as 'effective' | 'partially_effective' | 'very_effective' | 'not_tested',
    implementationDate: new Date().toISOString(),
    responsiblePerson: 'Jane Smith',
    notes: 'This control addresses technical risks'
  }));

  const mockRiskEvents: RiskEvent[] = Array.isArray(riskEvents) ? riskEvents : Array(3).fill(0).map((_, i) => ({
    eventId: `EVENT-${i+1}`,
    systemId: selectedSystem || '',
    eventType: ['incident', 'near_miss', 'user_feedback'][i % 3] as 'incident' | 'near_miss' | 'user_feedback',
    severity: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high',
    description: 'Unexpected behavior in the system',
    detectionDate: new Date().toISOString(),
    reportedBy: 'System Monitor',
    status: ['new', 'under_investigation', 'resolved'][i % 3] as 'new' | 'under_investigation' | 'resolved',
    impact: 'Minor impact on system performance',
    rootCause: 'Configuration error',
    mitigationActions: ['Update configuration', 'Restart system'],
    relatedControls: [`CTRL-${i+1}`]
  }));

  // Set default selected system
  useEffect(() => {
    if (mockSystems && mockSystems.length > 0 && !selectedSystem) {
      setSelectedSystem(mockSystems[0].systemId);
    }
  }, [mockSystems, selectedSystem]);

  // Handle creating a new risk control
  const handleCreateControl = async () => {
    if (!selectedSystem) {
      toast({
        title: "Error",
        description: "Please select a system first",
        variant: "destructive"
      });
      return;
    }

    try {
      // In the real implementation, make an API call to create a control
      /*
      await apiRequest('/api/risk-management/controls', {
        method: 'POST',
        body: JSON.stringify({
          ...newControl,
          systemId: selectedSystem
        })
      });
      */
      
      // For now, just show success message
      toast({
        title: "Control Created",
        description: "The risk control has been created successfully",
      });
      
      setControlDialogOpen(false);
      setNewControl({
        name: '',
        description: '',
        controlType: 'technical',
        implementationStatus: 'planned',
      });
      
      // Refetch controls
      // refetchControls();
      
    } catch (error) {
      console.error('Error creating control:', error);
      toast({
        title: "Error",
        description: "Failed to create risk control",
        variant: "destructive"
      });
    }
  };

  // Handle creating a new risk event
  const handleCreateEvent = async () => {
    if (!selectedSystem) {
      toast({
        title: "Error",
        description: "Please select a system first",
        variant: "destructive"
      });
      return;
    }

    try {
      // In the real implementation, make an API call to create an event
      /*
      await apiRequest('/api/risk-management/events', {
        method: 'POST',
        body: JSON.stringify({
          ...newEvent,
          systemId: selectedSystem,
          detectionDate: new Date().toISOString(),
          reportedBy: 'Current User' // Would come from authentication
        })
      });
      */
      
      // For now, just show success message
      toast({
        title: "Event Recorded",
        description: "The risk event has been recorded successfully",
      });
      
      setEventDialogOpen(false);
      setNewEvent({
        eventType: 'incident',
        severity: 'medium',
        description: '',
        status: 'new',
      });
      
      // Refetch events
      // refetchEvents();
      
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to record risk event",
        variant: "destructive"
      });
    }
  };

  // Handle creating a new risk management system
  const handleCreateRMS = async () => {
    if (!selectedSystem) {
      toast({
        title: "Error",
        description: "Please select a system first",
        variant: "destructive"
      });
      return;
    }

    try {
      // In the real implementation, make an API call to create a RMS
      /*
      await apiRequest('/api/risk-management/systems', {
        method: 'POST',
        body: JSON.stringify({
          ...newRms,
          systemId: selectedSystem,
          createdDate: new Date().toISOString(),
          lastUpdateDate: new Date().toISOString()
        })
      });
      */
      
      // For now, just show success message
      toast({
        title: "Risk Management System Created",
        description: "The risk management system has been set up successfully",
      });
      
      setRmsDialogOpen(false);
      setNewRms({
        reviewCycle: 'quarterly',
        status: 'active',
        version: 1.0,
      });
      
      // Refetch RMS
      // refetchRms();
      
    } catch (error) {
      console.error('Error creating RMS:', error);
      toast({
        title: "Error",
        description: "Failed to create risk management system",
        variant: "destructive"
      });
    }
  };

  // Get the currently selected system
  const getSelectedSystemData = () => {
    return mockSystems?.find((system: AiSystem) => system.systemId === selectedSystem);
  };

  // Get the RMS for the selected system
  const getSelectedRms = () => {
    return mockRiskManagementSystems?.find((rms: RiskManagementSystem) => rms.systemId === selectedSystem);
  };

  // Function to render the system selector
  const renderSystemSelector = () => (
    <div className="w-full mb-6">
      <Label htmlFor="system-select">Select AI System</Label>
      <Select
        value={selectedSystem || ''}
        onValueChange={(value) => setSelectedSystem(value)}
      >
        <SelectTrigger className="w-full mt-2">
          <SelectValue placeholder="Select an AI system" />
        </SelectTrigger>
        <SelectContent>
          {mockSystems?.map((system: AiSystem) => (
            <SelectItem key={system.systemId} value={system.systemId}>
              {system.name} ({system.systemId})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Function to render the risk management overview
  // Function to render risk assessments section
  const renderRiskAssessments = () => {
    // Filter assessments for the current system if a system is selected
    const filteredAssessments = selectedSystem && Array.isArray(riskAssessments)
      ? riskAssessments.filter((assessment: any) => assessment.systemId === selectedSystem)
      : Array.isArray(riskAssessments) ? riskAssessments : [];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Risk Assessments</h3>
          <Button variant="outline" size="sm" asChild>
            <a href="/risk-assessment/wizard">
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </a>
          </Button>
        </div>
        
        {isLoadingAssessments ? (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading assessments...</p>
            </div>
          </div>
        ) : filteredAssessments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment: any) => (
                <TableRow key={assessment.assessmentId}>
                  <TableCell className="font-mono text-xs">
                    {assessment.assessmentId}
                  </TableCell>
                  <TableCell>
                    {mockSystems && mockSystems.find((sys: AiSystem) => sys.systemId === assessment.systemId)?.name || assessment.systemId}
                  </TableCell>
                  <TableCell>
                    {assessment.assessmentDate ? new Date(assessment.assessmentDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      assessment.riskLevel === 'High' || assessment.riskLevel === 'high' ? 'destructive' : 
                      assessment.riskLevel === 'Limited' || assessment.riskLevel === 'limited' ? 'outline' : 
                      'secondary'
                    }>
                      {assessment.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{assessment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <a href={`/risk-assessment?tab=results&assessmentId=${assessment.assessmentId}&systemId=${assessment.systemId}`}>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Assessments</AlertTitle>
            <AlertDescription>
              {selectedSystem 
                ? "No risk assessments have been conducted for this system yet." 
                : "No risk assessments have been conducted yet."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderOverview = () => {
    const selectedSystem = getSelectedSystemData();
    const selectedRms = getSelectedRms();
    
    if (!selectedSystem) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No System Selected</AlertTitle>
          <AlertDescription>
            Please select an AI system to view its risk management details.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedSystem.name}</CardTitle>
                <CardDescription>{selectedSystem.systemId} - {selectedSystem.purpose}</CardDescription>
              </div>
              <Badge 
                variant={
                  selectedSystem.riskLevel === 'High' ? 'destructive' : 
                  selectedSystem.riskLevel === 'Limited' ? 'outline' : 'secondary'
                }
              >
                {selectedSystem.riskLevel} Risk
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">System Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Vendor</span>
                    <span className="text-sm font-medium">{selectedSystem.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Department</span>
                    <span className="text-sm font-medium">{selectedSystem.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Version</span>
                    <span className="text-sm font-medium">{selectedSystem.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">Owner</span>
                    <span className="text-sm font-medium">{selectedSystem.internalOwner}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Risk Management Status</h4>
                {selectedRms ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500">Status</span>
                      <Badge variant="outline" className="capitalize">{selectedRms.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500">Review Cycle</span>
                      <span className="text-sm font-medium capitalize">{selectedRms.reviewCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500">Last Updated</span>
                      <span className="text-sm font-medium">{new Date(selectedRms.lastUpdateDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500">Version</span>
                      <span className="text-sm font-medium">{selectedRms.version}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 space-y-2">
                    <AlertCircle className="h-10 w-10 text-amber-500" />
                    <p className="text-sm text-center">No risk management system configured</p>
                    <Button variant="outline" size="sm" onClick={() => setRmsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Configure Risk Management
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Risk Assessments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessments</CardTitle>
            <CardDescription>Completed and ongoing risk assessments for this system</CardDescription>
          </CardHeader>
          <CardContent>
            {renderRiskAssessments()}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Risk Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockRiskControls?.length || 0}</div>
              <p className="text-sm text-neutral-500">Active controls</p>
              <div className="mt-4">
                <Progress 
                  value={
                    mockRiskControls?.filter((c: RiskControl) => c.implementationStatus === 'implemented' || c.implementationStatus === 'verified').length 
                    / (mockRiskControls?.length || 1) * 100
                  } 
                />
                <p className="text-sm mt-2">
                  {mockRiskControls?.filter((c: RiskControl) => c.implementationStatus === 'implemented' || c.implementationStatus === 'verified').length || 0} implemented
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('controls')}>
                View Controls
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Risk Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockRiskEvents?.length || 0}</div>
              <p className="text-sm text-neutral-500">Recorded events</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Open</span>
                  <Badge variant="outline" className="text-xs">
                    {mockRiskEvents?.filter((e: RiskEvent) => e.status === 'new' || e.status === 'under_investigation').length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Resolved</span>
                  <Badge variant="outline" className="text-xs">
                    {mockRiskEvents?.filter(e => e.status === 'resolved' || e.status === 'closed').length || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('events')}>
                View Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockRiskControls?.length ? Math.round((mockRiskControls?.filter(c => c.effectiveness === 'effective' || c.effectiveness === 'very_effective').length / mockRiskControls?.length) * 100) : 0}%
              </div>
              <p className="text-sm text-neutral-500">Overall compliance</p>
              <div className="mt-4 space-y-2">
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300" 
                    style={{ width: `${mockRiskControls?.length ? (mockRiskControls?.filter(c => c.effectiveness === 'very_effective').length / mockRiskControls?.length) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span>Needs Improvement</span>
                  <span>Excellent</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('reports')}>
                View Reports
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };

  // Function to render risk controls tab
  const renderControls = () => {
    if (!selectedSystem) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No System Selected</AlertTitle>
          <AlertDescription>
            Please select an AI system to view its risk controls.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Risk Controls</h2>
          <Button onClick={() => setControlDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Control
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effectiveness</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRiskControls?.map((control) => (
                  <TableRow key={control.controlId}>
                    <TableCell className="font-medium">{control.name}</TableCell>
                    <TableCell className="capitalize">{control.controlType}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          control.implementationStatus === 'implemented' || control.implementationStatus === 'verified' ? 'default' :
                          control.implementationStatus === 'in_progress' ? 'outline' :
                          control.implementationStatus === 'failed' ? 'destructive' : 'secondary'
                        }
                        className="capitalize"
                      >
                        {control.implementationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {control.effectiveness ? (
                        <div className="flex items-center">
                          {control.effectiveness === 'very_effective' && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                          {control.effectiveness === 'effective' && <CheckCircle className="h-4 w-4 text-blue-500 mr-1" />}
                          {control.effectiveness === 'partially_effective' && <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />}
                          {control.effectiveness === 'ineffective' && <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                          {control.effectiveness === 'not_tested' && <AlertCircle className="h-4 w-4 text-neutral-400 mr-1" />}
                          <span className="text-sm capitalize">{control.effectiveness.replace('_', ' ')}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">Not assessed</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Control</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete Control</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!mockRiskControls || mockRiskControls.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-neutral-500">
                      No risk controls found. Click "Add Control" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Function to render risk events tab
  const renderEvents = () => {
    if (!selectedSystem) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No System Selected</AlertTitle>
          <AlertDescription>
            Please select an AI system to view its risk events.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Risk Events</h2>
          <Button onClick={() => setEventDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Event
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRiskEvents?.map((event) => (
                  <TableRow key={event.eventId}>
                    <TableCell className="capitalize">{event.eventType.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          event.severity === 'critical' || event.severity === 'high' ? 'destructive' :
                          event.severity === 'medium' ? 'outline' : 'secondary'
                        }
                        className="capitalize"
                      >
                        {event.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{event.description}</TableCell>
                    <TableCell>{new Date(event.detectionDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          event.status === 'new' ? 'outline' :
                          event.status === 'under_investigation' ? 'secondary' :
                          'default'
                        }
                        className="capitalize"
                      >
                        {event.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Add Mitigation</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete Event</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!mockRiskEvents || mockRiskEvents.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-neutral-500">
                      No risk events found. Click "Record Event" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Function to render reports tab
  const renderReports = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Risk Management Reports</h2>
          <Button>
            <FilePlus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Summary</CardTitle>
              <CardDescription>Overall compliance status by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Technical Controls</span>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Procedural Controls</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Organizational Controls</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Contractual Controls</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View Full Report
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Risk Trend Analysis</CardTitle>
              <CardDescription>Risk events over the past 3 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <div className="text-center text-neutral-400">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Chart visualization would appear here</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View Trend Analysis
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Quarterly Risk Assessment</TableCell>
                  <TableCell>Compliance Report</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Current</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Download</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Risk Control Effectiveness</TableCell>
                  <TableCell>Analytics Report</TableCell>
                  <TableCell>{new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Archived</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Download</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Function to render documentation tab
  const renderDocumentation = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Risk Management Documentation</h2>
          <Button>
            <FilePlus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Risk Management Plan</TableCell>
                  <TableCell>Policy Document</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="default">Approved</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Control Implementation Guide</TableCell>
                  <TableCell>Technical Document</TableCell>
                  <TableCell>{new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Draft</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Test Cases & Evidence</TableCell>
                  <TableCell>Technical Document</TableCell>
                  <TableCell>{new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="default">Approved</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                <CardTitle className="text-base">EU AI Act Templates</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Risk Assessment Template
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Technical Documentation Template
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Conformity Declaration
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Access Templates
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-500" />
                <CardTitle className="text-base">Compliance Guides</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Control Implementation Guide
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Testing Procedures
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Evidence Collection Guide
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Access Guides
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-500" />
                <CardTitle className="text-base">Risk Management Handbook</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Risk Management Process
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Roles & Responsibilities
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Review Procedures
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View Handbook
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Risk Management</h1>
          <p className="text-neutral-500 mt-1">
            Manage and monitor compliance risks for your AI systems
          </p>
        </div>
        <div>
          <Button variant="outline" className="mr-2">
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Assess New Risk
          </Button>
        </div>
      </div>

      {renderSystemSelector()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="controls">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Controls
          </TabsTrigger>
          <TabsTrigger value="events">
            <Activity className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="documentation">
            <FileText className="h-4 w-4 mr-2" />
            Documentation
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="overview">
            {renderOverview()}
          </TabsContent>
          <TabsContent value="controls">
            {renderControls()}
          </TabsContent>
          <TabsContent value="events">
            {renderEvents()}
          </TabsContent>
          <TabsContent value="reports">
            {renderReports()}
          </TabsContent>
          <TabsContent value="documentation">
            {renderDocumentation()}
          </TabsContent>
        </div>
      </Tabs>

      {/* Control Dialog */}
      <Dialog open={controlDialogOpen} onOpenChange={setControlDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Risk Control</DialogTitle>
            <DialogDescription>
              Define a risk control to manage compliance requirements
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="control-name">Control Name</Label>
              <Input
                id="control-name"
                placeholder="Enter control name"
                value={newControl.name}
                onChange={(e) => setNewControl({ ...newControl, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="control-description">Description</Label>
              <Textarea
                id="control-description"
                placeholder="Describe the purpose and implementation of this control"
                value={newControl.description}
                onChange={(e) => setNewControl({ ...newControl, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="control-type">Control Type</Label>
                <Select
                  value={newControl.controlType}
                  onValueChange={(value) => setNewControl({ ...newControl, controlType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select control type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="procedural">Procedural</SelectItem>
                    <SelectItem value="organizational">Organizational</SelectItem>
                    <SelectItem value="contractual">Contractual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="implementation-status">Implementation Status</Label>
                <Select
                  value={newControl.implementationStatus}
                  onValueChange={(value) => setNewControl({ ...newControl, implementationStatus: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="implemented">Implemented</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="responsible-person">Responsible Person</Label>
              <Input
                id="responsible-person"
                placeholder="Enter name of responsible person"
                value={newControl.responsiblePerson || ''}
                onChange={(e) => setNewControl({ ...newControl, responsiblePerson: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setControlDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateControl}>Create Control</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Event Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Record Risk Event</DialogTitle>
            <DialogDescription>
              Document a risk event or incident related to the AI system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select
                  value={newEvent.eventType}
                  onValueChange={(value) => setNewEvent({ ...newEvent, eventType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="near_miss">Near Miss</SelectItem>
                    <SelectItem value="performance_deviation">Performance Deviation</SelectItem>
                    <SelectItem value="external_factor">External Factor</SelectItem>
                    <SelectItem value="user_feedback">User Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={newEvent.severity}
                  onValueChange={(value) => setNewEvent({ ...newEvent, severity: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Describe what happened"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-impact">Impact</Label>
              <Textarea
                id="event-impact"
                placeholder="Describe the impact of this event"
                value={newEvent.impact || ''}
                onChange={(e) => setNewEvent({ ...newEvent, impact: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-status">Status</Label>
              <Select
                value={newEvent.status}
                onValueChange={(value) => setNewEvent({ ...newEvent, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="under_investigation">Under Investigation</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent}>Record Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* RMS Dialog */}
      <Dialog open={rmsDialogOpen} onOpenChange={setRmsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configure Risk Management System</DialogTitle>
            <DialogDescription>
              Set up risk management for this AI system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="review-cycle">Review Cycle</Label>
                <Select
                  value={newRms.reviewCycle}
                  onValueChange={(value) => setNewRms({ ...newRms, reviewCycle: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select review cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rms-status">Status</Label>
                <Select
                  value={newRms.status}
                  onValueChange={(value) => setNewRms({ ...newRms, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="responsible-person">Responsible Person</Label>
              <Input
                id="responsible-person"
                placeholder="Enter name of responsible person"
                value={newRms.responsiblePerson || ''}
                onChange={(e) => setNewRms({ ...newRms, responsiblePerson: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="document-reference">Document Reference</Label>
              <Input
                id="document-reference"
                placeholder="Enter document reference (if applicable)"
                value={newRms.documentReference || ''}
                onChange={(e) => setNewRms({ ...newRms, documentReference: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="rms-notes">Notes</Label>
              <Textarea
                id="rms-notes"
                placeholder="Additional notes about this risk management system"
                value={newRms.notes || ''}
                onChange={(e) => setNewRms({ ...newRms, notes: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRmsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRMS}>Configure</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}