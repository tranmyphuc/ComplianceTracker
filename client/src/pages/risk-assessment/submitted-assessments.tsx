
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";
import { Separator } from "@/components/ui/separator";

// Define assessment status types
enum AssessmentStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_UPDATE = 'requires_update'
}

// Define risk levels
enum RiskLevel {
  UNACCEPTABLE = 'unacceptable',
  HIGH = 'high',
  LIMITED = 'limited',
  MINIMAL = 'minimal'
}

// Define assessment interface
interface RiskAssessment {
  id: number;
  assessmentId: string;
  systemId: string;
  systemName?: string;
  createdBy: string;
  assessmentDate: string;
  status: AssessmentStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  summaryNotes?: string;
}

const SubmittedAssessments: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("all");

  useEffect(() => {
    // Fetch all assessments
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/risk-assessments');
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        const data = await response.json();
        setAssessments(data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        toast({
          title: "Error",
          description: "Failed to load assessments. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [toast]);

  // Filter assessments based on current tab
  const filteredAssessments = assessments.filter(assessment => {
    if (currentTab === 'all') return true;
    if (currentTab === 'pending') return assessment.status === AssessmentStatus.COMPLETED;
    if (currentTab === 'approved') return assessment.status === AssessmentStatus.APPROVED;
    if (currentTab === 'rejected') return assessment.status === AssessmentStatus.REJECTED;
    return true;
  });

  // Handle view assessment details
  const handleViewDetails = (assessmentId: string) => {
    navigate(`/risk-assessment/details/${assessmentId}`);
  };

  // Handle approve assessment
  const handleApprove = async (assessmentId: string) => {
    try {
      const response = await fetch(`/api/risk-assessments/${assessmentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'current-user', // Replace with actual user ID from auth
          notes: 'Approved after review'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to approve assessment');
      }

      // Update local state
      setAssessments(prev => 
        prev.map(assessment => 
          assessment.assessmentId === assessmentId 
            ? { ...assessment, status: AssessmentStatus.APPROVED } 
            : assessment
        )
      );

      toast({
        title: "Success",
        description: "Assessment has been approved successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error approving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to approve assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle reject assessment
  const handleReject = async (assessmentId: string) => {
    try {
      const response = await fetch(`/api/risk-assessments/${assessmentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'current-user', // Replace with actual user ID from auth
          reason: 'Requires additional information'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reject assessment');
      }

      // Update local state
      setAssessments(prev => 
        prev.map(assessment => 
          assessment.assessmentId === assessmentId 
            ? { ...assessment, status: AssessmentStatus.REJECTED } 
            : assessment
        )
      );

      toast({
        title: "Success",
        description: "Assessment has been rejected",
        variant: "default"
      });
    } catch (error) {
      console.error('Error rejecting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to reject assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get status badge color
  const getStatusBadge = (status: AssessmentStatus) => {
    switch (status) {
      case AssessmentStatus.DRAFT:
        return <Badge variant="outline">Draft</Badge>;
      case AssessmentStatus.IN_PROGRESS:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">In Progress</Badge>;
      case AssessmentStatus.COMPLETED:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending Review</Badge>;
      case AssessmentStatus.APPROVED:
        return <Badge variant="outline" className="bg-green-50 text-green-700">Approved</Badge>;
      case AssessmentStatus.REJECTED:
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>;
      case AssessmentStatus.REQUIRES_UPDATE:
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Requires Update</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get risk level badge
  const getRiskBadge = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.UNACCEPTABLE:
        return <Badge className="bg-red-500">Unacceptable</Badge>;
      case RiskLevel.HIGH:
        return <Badge className="bg-orange-500">High</Badge>;
      case RiskLevel.LIMITED:
        return <Badge className="bg-yellow-500">Limited</Badge>;
      case RiskLevel.MINIMAL:
        return <Badge className="bg-green-500">Minimal</Badge>;
      default:
        return <Badge>{riskLevel}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">{t('riskAssessment.submittedAssessments.title', 'Submitted Risk Assessments')}</h1>
        <p className="text-muted-foreground">
          {t('riskAssessment.submittedAssessments.description', 'Review, approve, or reject submitted risk assessments for AI systems.')}
        </p>
      </div>

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <Button onClick={() => navigate('/risk-assessment')}>
            New Assessment
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>System</TableHead>
                  <TableHead>Assessment ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading assessments...
                    </TableCell>
                  </TableRow>
                ) : filteredAssessments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No assessments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.assessmentId}>
                      <TableCell className="font-medium">{assessment.systemName || assessment.systemId}</TableCell>
                      <TableCell>{assessment.assessmentId}</TableCell>
                      <TableCell>{new Date(assessment.assessmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getRiskBadge(assessment.riskLevel)}</TableCell>
                      <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(assessment.assessmentId)}>
                            <FileText className="w-4 h-4 mr-1" /> View
                          </Button>
                          
                          {assessment.status === AssessmentStatus.COMPLETED && (
                            <>
                              <Button variant="outline" size="sm" className="text-green-600" 
                                onClick={() => handleApprove(assessment.assessmentId)}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600"
                                onClick={() => handleReject(assessment.assessmentId)}>
                                <AlertCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Assessment Management Guide</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Approval Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Review assessment details thoroughly before approval. Approved assessments update the AI system's risk status.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Rejection Guidance</h3>
                  <p className="text-sm text-muted-foreground">
                    When rejecting, provide clear reasons for the assessment creator to address in their update.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Documentation Requirements</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure all high-risk systems have thorough documentation that meets EU AI Act standards.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Risk Level Guidelines</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify risk levels are appropriate based on the system's use case and potential impact.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmittedAssessments;
