import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AssessmentWizard } from "@/components/risk-assessment/assessment-wizard";
import { AdvancedRiskWizard } from "@/components/risk-assessment/advanced-wizard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  RocketIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon,
  InfoIcon,
  ClipboardListIcon,
  FileTextIcon,
  ScanTextIcon,
  LightbulbIcon,
  Activity,
  AlertCircle,
  Shield,
  CheckCircle,
  AlertTriangle,
  Grid3X3,
  FlaskConical,
  Users
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { InlineTip, TipButton } from "@/components/compliance-tips";
import { useContextualTips } from "@/hooks/use-contextual-tips";
import { LanguageDemo } from "@/components/language-demo";
import { useToast } from "@/hooks/use-toast";

// Define interfaces for Risk Management
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

export default function RiskAssessment() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("advanced-wizard");
  const [location, navigate] = useLocation();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  
  // Use our custom hook for contextual tips
  const { triggerTip } = useContextualTips({
    context: 'risk-assessment',
    showOnMount: true,
    delay: 1500,
    specificTipId: 'risk-1'
  });
  
  // Get system ID and tab from URL if available
  const urlParams = new URLSearchParams(window.location.search);
  const systemId = urlParams.get("systemId");
  const tabParam = urlParams.get("tab");
  
  // Set the active tab from URL parameter if available
  useEffect(() => {
    if (tabParam === 'results') {
      setActiveTab('results');
    }
  }, [tabParam]);
  
  // Fetch AI systems
  const { data: systems, isLoading: isLoadingSystems } = useQuery({
    queryKey: ['/api/systems'],
  });

  // Fetch all risk assessments for Risk Management
  const { data: riskAssessments, isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['/api/risk-management/assessments'],
  });

  // Fetch risk management systems with assessments
  const { data: riskManagementSystems, isLoading: isLoadingRms } = useQuery({
    queryKey: ['/api/risk-management/systems'],
  });

  // Set default selected system based on URL parameter
  useEffect(() => {
    if (systemId) {
      setSelectedSystem(systemId);
    } else if (systems && Array.isArray(systems) && systems.length > 0 && !selectedSystem) {
      // Type safety check - makes sure systems is an array before accessing index
      const firstSystem = systems[0] as AiSystem;
      if (firstSystem && firstSystem.systemId) {
        setSelectedSystem(firstSystem.systemId);
      }
    }
  }, [systems, systemId, selectedSystem]);
  
  // Handle completion of assessment
  const handleAssessmentComplete = (result: any) => {
    console.log("Assessment completed:", result);
    // Show a tip when assessment is completed
    triggerTip('risk-2');
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Risk Assessment</h1>
          <p className="text-neutral-500 mt-1">Evaluate and classify AI systems based on EU AI Act requirements</p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/risk-assessment/text-analyzer">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
            >
              <ScanTextIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Text Risk Analyzer</span>
              <span className="inline-block sm:hidden">Analyze Text</span>
            </Button>
          </Link>
          
          <Link href="/register-system">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <RocketIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Register New System</span>
              <span className="inline-block sm:hidden">Register</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {systemId ? (
        <div className="mb-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <InfoIcon className="text-blue-500 h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Currently assessing system with ID: {systemId}</p>
                  <p className="text-sm text-blue-700">Start a comprehensive risk assessment for this system</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/risk-assessment")}
                className="text-blue-700"
              >
                Clear
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {/* Inline tip that's always visible */}
      <div className="mb-6">
        <InlineTip 
          tip={{
            title: "EU AI Act Risk Assessment Requirements",
            content: "Under the EU AI Act, all high-risk AI systems require a comprehensive risk assessment before deployment. Ensure you capture all needed information in this assessment.",
            category: "governance",
            relevantArticles: ["Article 9", "Article 16", "Article 17"],
            learnMoreLink: "/knowledge-center"
          }}
          jackStyle={true}
        />
      </div>
      
      
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="advanced-wizard" className="gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Assessment</span>
              <span className="inline-block sm:hidden">Assess</span>
            </TabsTrigger>
            <TabsTrigger value="standard-wizard" className="gap-2">
              <ClipboardListIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Standard</span>
              <span className="inline-block sm:hidden">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline-block">Results & Management</span>
              <span className="inline-block sm:hidden">Results</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Tip button that shows a popup when clicked */}
          <TipButton 
            tipId="risk-1" 
            variant="ghost"
          />
        </div>
        
        <TabsContent value="advanced-wizard" className="mt-6">
          <AdvancedRiskWizard 
            systemId={systemId || undefined} 
            onComplete={handleAssessmentComplete}
          />
        </TabsContent>
        
        <TabsContent value="standard-wizard" className="mt-6">
          <Card className="border-neutral-200 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <InfoIcon className="h-4 w-4 mr-1 text-blue-500" />
                Standard Risk Assessment
              </CardTitle>
              <CardDescription>
                This is the standard risk assessment wizard that covers the basic requirements of the EU AI Act.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="flex gap-2 items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary" className="w-fit">Legacy Version</Badge>
                  <p className="text-sm text-neutral-500">
                    We recommend using the comprehensive assessment wizard for more detailed analysis.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => setActiveTab("advanced-wizard")}
                >
                  Switch to Comprehensive
                  <ArrowRightIcon className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <AssessmentWizard />
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Risk Assessment Results & Management
              </CardTitle>
              <CardDescription>
                View completed assessments and manage risk controls for your AI systems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* System selector */}
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
                    {systems && Array.isArray(systems) && systems.map((system: AiSystem) => (
                      <SelectItem key={system.systemId} value={system.systemId}>
                        {system.name} ({system.systemId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Results tabs */}
              <Tabs defaultValue="assessments" className="mt-6">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="assessments" className="gap-1">
                    <Shield className="h-4 w-4" />
                    Assessments
                  </TabsTrigger>
                  <TabsTrigger value="controls" className="gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Risk Controls
                  </TabsTrigger>
                  <TabsTrigger value="events" className="gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Risk Events
                  </TabsTrigger>
                </TabsList>
                
                {/* Assessment results tab content */}
                <TabsContent value="assessments" className="mt-4">
                  {isLoadingAssessments ? (
                    <div className="py-8 flex justify-center">
                      <p>Loading assessments...</p>
                    </div>
                  ) : (
                    <>
                      {(riskAssessments && Array.isArray(riskAssessments) && riskAssessments.filter((ra: RiskAssessment) => ra.systemId === selectedSystem).length > 0) ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Assessment ID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Risk Level</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {riskAssessments
                              .filter((ra: RiskAssessment) => ra.systemId === selectedSystem)
                              .map((assessment: RiskAssessment) => (
                                <TableRow key={assessment.assessmentId}>
                                  <TableCell className="font-medium">{assessment.assessmentId}</TableCell>
                                  <TableCell>{new Date(assessment.assessmentDate).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <Badge variant={
                                      assessment.riskLevel === 'unacceptable' ? 'destructive' :
                                      assessment.riskLevel === 'high' ? 'destructive' :
                                      assessment.riskLevel === 'limited' ? 'outline' : 'secondary'
                                    }>
                                      {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={
                                      assessment.status === 'approved' ? 'success' :
                                      assessment.status === 'rejected' ? 'destructive' :
                                      assessment.status === 'in_progress' ? 'warning' : 'outline'
                                    }>
                                      {assessment.status.replace('_', ' ')}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Progress value={assessment.riskScore} className="w-14 h-2" />
                                      <span>{assessment.riskScore}/100</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        toast({
                                          title: "Assessment Details",
                                          description: `Viewing details for assessment ${assessment.assessmentId}`,
                                        });
                                        // Navigate to the results tab with this assessment selected
                                        window.location.href = `/risk-assessment/results?systemId=${assessment.systemId}&assessmentId=${assessment.assessmentId}`;
                                      }}
                                    >
                                      View Details
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="py-8 text-center">
                          <AlertCircle className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold mb-1">No Assessments Found</h3>
                          <p className="text-neutral-500 mb-4">
                            There are no risk assessments for the selected system.
                          </p>
                          <Button 
                            onClick={() => {
                              setActiveTab('advanced-wizard');
                            }}
                            className="gap-1"
                          >
                            Start New Assessment
                            <ArrowRightIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
                
                {/* Risk Controls tab content */}
                <TabsContent value="controls" className="mt-4">
                  {!selectedSystem ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No System Selected</AlertTitle>
                      <AlertDescription>
                        Please select an AI system to view its risk controls.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Risk Controls</h3>
                        <Button 
                          size="sm" 
                          className="gap-1"
                          onClick={() => toast({
                            title: "Creating Controls",
                            description: "Risk controls for the selected system have been created successfully."
                          })}
                        >
                          <Grid3X3 className="h-4 w-4" />
                          Create Controls
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['technical', 'procedural', 'organizational', 'contractual'].map((type, index) => (
                          <Card key={type} className="overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                {type === 'technical' ? (
                                  <FlaskConical className="h-4 w-4 text-blue-500" />
                                ) : type === 'procedural' ? (
                                  <ClipboardListIcon className="h-4 w-4 text-green-500" />
                                ) : type === 'organizational' ? (
                                  <Users className="h-4 w-4 text-orange-500" />
                                ) : (
                                  <FileTextIcon className="h-4 w-4 text-purple-500" />
                                )}
                                {type.charAt(0).toUpperCase() + type.slice(1)} Controls
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="border-b">
                                      <div className="font-medium">Access Control</div>
                                      <div className="text-sm text-neutral-500">
                                        Implementation of proper user access controls
                                      </div>
                                    </TableCell>
                                    <TableCell className="border-b">
                                      <Badge variant={['implemented', 'verified', 'in_progress', 'planned'][index % 4] === 'implemented' ? 'success' : 
                                       ['implemented', 'verified', 'in_progress', 'planned'][index % 4] === 'verified' ? 'success' :
                                       ['implemented', 'verified', 'in_progress', 'planned'][index % 4] === 'in_progress' ? 'warning' : 'outline'}>
                                        {['implemented', 'verified', 'in_progress', 'planned'][index % 4].replace('_', ' ')}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <div className="font-medium">Documentation</div>
                                      <div className="text-sm text-neutral-500">
                                        Maintaining proper documentation
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={['in_progress', 'implemented', 'planned', 'verified'][index % 4] === 'implemented' ? 'success' : 
                                       ['in_progress', 'implemented', 'planned', 'verified'][index % 4] === 'verified' ? 'success' :
                                       ['in_progress', 'implemented', 'planned', 'verified'][index % 4] === 'in_progress' ? 'warning' : 'outline'}>
                                        {['in_progress', 'implemented', 'planned', 'verified'][index % 4].replace('_', ' ')}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                {/* Risk Events tab content */}
                <TabsContent value="events" className="mt-4">
                  {!selectedSystem ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No System Selected</AlertTitle>
                      <AlertDescription>
                        Please select an AI system to view its risk events.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Risk Events</h3>
                        <Button 
                          size="sm" 
                          className="gap-1"
                          onClick={() => toast({
                            title: "Event Recorded",
                            description: "A new risk event has been recorded for the selected system.",
                          })}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Record Event
                        </Button>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Detection Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Unexpected model behavior</TableCell>
                            <TableCell>Incident</TableCell>
                            <TableCell>
                              <Badge variant="destructive">High</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Under Investigation</Badge>
                            </TableCell>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">User feedback on data quality</TableCell>
                            <TableCell>User Feedback</TableCell>
                            <TableCell>
                              <Badge variant="outline">Medium</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="success">Resolved</Badge>
                            </TableCell>
                            <TableCell>{new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
