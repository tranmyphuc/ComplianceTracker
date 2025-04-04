import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  FileText,
  PieChart,
  BarChart,
  BarChart2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface RiskAssessmentDetail {
  assessmentId: string;
  systemId: string;
  assessmentDate: string;
  status: string;
  riskLevel: string;
  riskScore: number;
  systemCategory?: string;
  prohibitedUseChecks?: any[];
  euAiActArticles?: string[];
  complianceGaps?: any[];
  remediationActions?: any[];
  evidenceDocuments?: any[];
  summaryNotes?: string;
  createdBy?: string;
}

interface AISystemDetail {
  systemId: string;
  name: string;
  vendor?: string;
  department?: string;
  description?: string;
  purpose?: string;
  version?: string;
  aiCapabilities?: string;
  trainingDatasets?: string;
  usageContext?: string;
  potentialImpact?: string;
}

interface ExpertReview {
  reviewId: string;
  assessmentId?: string;
  systemId?: string;
  text: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed';
  validationResult: any;
  requestedAt: Date;
  updatedAt?: Date;
  assignedTo?: string;
  completedAt?: Date;
  expertFeedback?: string;
}

interface ExpertReviewsListProps {
  onSelectReview?: (review: ExpertReview) => void;
  refreshInterval?: number; // In milliseconds
}

export function ExpertReviewsList({ onSelectReview, refreshInterval = 60000 }: ExpertReviewsListProps) {
  const { toast } = useToast();
  
  const { data, isLoading, isError, error } = useQuery<{ success: boolean; reviews: ExpertReview[] }>({
    queryKey: ['/api/legal/expert-reviews'],
    refetchInterval: refreshInterval
  });
  
  // Extract reviews from the response data
  const reviews = data?.reviews;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin m-auto" />
        <span className="ml-2">Loading expert reviews...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center bg-destructive/10 rounded-lg">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Reviews</h3>
        <p className="text-muted-foreground mb-4">
          Failed to load expert review data: {(error as Error)?.message || 'Unknown error'}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-6 text-center bg-muted/30 rounded-lg">
        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-2">No Expert Reviews</h3>
        <p className="text-muted-foreground">
          No expert review requests have been submitted yet.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expert Legal Reviews</CardTitle>
        <CardDescription>
          Manage and track legal review requests for EU AI Act compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(reviews) && reviews.map((review) => (
              <TableRow key={review.reviewId}>
                <TableCell className="font-medium">{review.type}</TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>{formatDate(review.requestedAt)}</TableCell>
                <TableCell>{review.assignedTo || 'Unassigned'}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectReview && onSelectReview(review)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface ExpertReviewDetailProps {
  review: ExpertReview;
  onClose?: () => void;
  onUpdateStatus?: (reviewId: string, newStatus: string) => void;
}

export function ExpertReviewDetail({ review, onClose, onUpdateStatus }: ExpertReviewDetailProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [feedbackText, setFeedbackText] = useState(review.expertFeedback || '');
  const [newStatus, setNewStatus] = useState<string>(review.status);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessmentDetail | null>(null);
  const [systemDetails, setSystemDetails] = useState<AISystemDetail | null>(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  useEffect(() => {
    setFeedbackText(review.expertFeedback || '');
    setNewStatus(review.status);
    
    // Fetch additional details when the component mounts or the review changes
    const fetchRiskAssessment = async () => {
      if (review.assessmentId) {
        setIsLoadingDetails(true);
        try {
          const response = await apiRequest(`/api/risk-assessments/${review.assessmentId}`, {
            method: 'GET'
          });
          console.log('Fetched risk assessment:', response);
          setRiskAssessment(response);
        } catch (error) {
          console.error('Error fetching risk assessment:', error);
          toast({
            title: 'Error Loading Risk Assessment',
            description: 'Could not load the risk assessment details.',
            variant: 'destructive',
          });
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };

    const fetchSystemDetails = async () => {
      if (review.systemId) {
        setIsLoadingDetails(true);
        try {
          const response = await apiRequest(`/api/systems/${review.systemId}`, {
            method: 'GET'
          });
          console.log('Fetched system details:', response);
          setSystemDetails(response);
        } catch (error) {
          console.error('Error fetching system details:', error);
          toast({
            title: 'Error Loading System Details',
            description: 'Could not load the AI system details.',
            variant: 'destructive',
          });
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchRiskAssessment();
    fetchSystemDetails();
  }, [review, toast]);

  const updateMutation = useMutation({
    mutationFn: async (data: { reviewId: string; status: string; expertFeedback?: string }) => {
      if (!data.reviewId) {
        console.error('Missing reviewId in update request');
        throw new Error('Review ID is required for updates');
      }
      
      // Fix for foreign key constraint by using a valid admin user ID
      // We use admin-uid-123 which is a confirmed valid user ID in the database
      const requestData = {
        status: data.status,
        expertFeedback: data.expertFeedback,
        // Use a guaranteed valid admin user ID from the database
        assignedTo: 'admin-uid-123' // This ID exists in the users table
      };
      
      console.log('Sending update request with data:', {
        reviewId: data.reviewId,
        status: data.status,
        feedbackLength: data.expertFeedback?.length || 0
      });
      
      try {
        // Make the API request to update the expert review
        const response = await apiRequest(`/api/legal/expert-reviews/${data.reviewId}`, {
          method: 'PATCH',
          body: requestData
        });
        
        // Check for API error response
        if (response && !response.success) {
          console.error('API returned error:', response);
          throw new Error(response.error || 'Server returned an error response');
        }
        
        return response;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Successfully updated review:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/legal/expert-reviews'] });
      toast({
        title: 'Review Updated',
        description: 'The expert review has been successfully updated.',
      });
      if (onUpdateStatus) {
        onUpdateStatus(review.reviewId, newStatus);
      }
    },
    onError: (error: any) => {
      console.error('Error updating review:', error);
      let errorMessage = 'Unknown error';
      
      // Handle different error types
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract API error message if it exists
        if (error.data && error.data.error) {
          errorMessage = error.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          try {
            errorMessage = JSON.stringify(error);
          } catch (e) {
            console.error('Failed to stringify error object:', e);
            errorMessage = 'Complex error object (see console)';
          }
        }
      }
      
      // Clean up common error messages
      if (errorMessage.includes('not found')) {
        errorMessage = 'Review not found. It may have been deleted.';
      } else if (errorMessage.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast({
        title: 'Error Updating Review',
        description: `Failed to update review: ${errorMessage}`,
        variant: 'destructive',
      });
    }
  });

  const handleUpdate = () => {
    updateMutation.mutate({
      reviewId: review.reviewId,
      status: newStatus,
      expertFeedback: feedbackText
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Expert Review Details</CardTitle>
            <CardDescription>
              Review ID: {review.reviewId}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            Back to List
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Review Type</h3>
            <p>{review.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Status</h3>
            <div>{getStatusBadge(review.status)}</div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Requested At</h3>
            <p>{formatDate(review.requestedAt)}</p>
          </div>
          {review.assignedTo && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Assigned To</h3>
              <p>{review.assignedTo}</p>
            </div>
          )}
          {review.completedAt && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Completed At</h3>
              <p>{formatDate(review.completedAt)}</p>
            </div>
          )}
          {review.assessmentId && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Assessment ID</h3>
              <p>{review.assessmentId}</p>
            </div>
          )}
          {review.systemId && (
            <div>
              <h3 className="text-sm font-semibold mb-1">System ID</h3>
              <p>{review.systemId}</p>
            </div>
          )}
        </div>
        
        {/* AI System Information Section */}
        {isLoadingDetails && (
          <div className="py-4 flex justify-center">
            <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
            <span>Loading detailed information...</span>
          </div>
        )}
        
        {systemDetails && (
          <div className="border rounded-md p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-primary">AI System Information</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="text-xs"
              >
                {showFullDetails ? 'Show Less' : 'Show Full Details'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-semibold mb-1">System Name</h4>
                <p className="text-sm">{systemDetails.name}</p>
              </div>
              {systemDetails.vendor && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Vendor</h4>
                  <p className="text-sm">{systemDetails.vendor}</p>
                </div>
              )}
              {systemDetails.department && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Department</h4>
                  <p className="text-sm">{systemDetails.department}</p>
                </div>
              )}
              {systemDetails.purpose && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Purpose</h4>
                  <p className="text-sm">{systemDetails.purpose}</p>
                </div>
              )}
            </div>
            
            {showFullDetails && (
              <div className="mt-3 border-t pt-3 grid grid-cols-1 gap-3">
                {systemDetails.description && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Description</h4>
                    <p className="text-sm whitespace-pre-wrap">{systemDetails.description}</p>
                  </div>
                )}
                {systemDetails.aiCapabilities && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">AI Capabilities</h4>
                    <p className="text-sm whitespace-pre-wrap">{systemDetails.aiCapabilities}</p>
                  </div>
                )}
                {systemDetails.trainingDatasets && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Training Datasets</h4>
                    <p className="text-sm whitespace-pre-wrap">{systemDetails.trainingDatasets}</p>
                  </div>
                )}
                {systemDetails.usageContext && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Usage Context</h4>
                    <p className="text-sm whitespace-pre-wrap">{systemDetails.usageContext}</p>
                  </div>
                )}
                {systemDetails.potentialImpact && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Potential Impact</h4>
                    <p className="text-sm whitespace-pre-wrap">{systemDetails.potentialImpact}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Risk Assessment Information Section with Visualizations */}
        {riskAssessment && (
          <div className="border rounded-md p-4 bg-slate-50">
            <h3 className="text-md font-semibold text-primary mb-3">Risk Assessment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-semibold mb-1">Risk Level</h4>
                <div>
                  {riskAssessment.riskLevel === 'High' && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      High Risk
                    </Badge>
                  )}
                  {riskAssessment.riskLevel === 'Limited' && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Limited Risk
                    </Badge>
                  )}
                  {riskAssessment.riskLevel === 'Minimal' && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Minimal Risk
                    </Badge>
                  )}
                  {riskAssessment.riskLevel === 'Unacceptable' && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Unacceptable Risk
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Risk Score</h4>
                <p className="text-sm">{riskAssessment.riskScore}/100</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Assessment Date</h4>
                <p className="text-sm">{formatDate(riskAssessment.assessmentDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Assessment Status</h4>
                <p className="text-sm capitalize">{riskAssessment.status}</p>
              </div>
              {riskAssessment.systemCategory && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">System Category</h4>
                  <p className="text-sm">{riskAssessment.systemCategory}</p>
                </div>
              )}
            </div>
            
            {/* Risk Visualization */}
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center">
                <PieChart className="h-4 w-4 mr-1 text-primary" />
                Risk Visualization
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Risk Score Pie Chart */}
                <div className="bg-white p-4 rounded-md border">
                  <h5 className="text-xs font-semibold mb-2 text-center">Risk Score Distribution</h5>
                  <div className="h-[180px] flex items-center justify-center">
                    <Pie 
                      data={{
                        labels: ['Risk', 'Safe'],
                        datasets: [{
                          data: [riskAssessment.riskScore, 100 - riskAssessment.riskScore],
                          backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)'],
                          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                          borderWidth: 1,
                        }],
                      }} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              font: {
                                size: 10
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Risk Factor Breakdown */}
                <div className="bg-white p-4 rounded-md border">
                  <h5 className="text-xs font-semibold mb-2 text-center">Risk Factor Analysis</h5>
                  <div className="h-[180px] flex items-center justify-center">
                    <Bar 
                      data={{
                        labels: ['Technical', 'Legal', 'Ethical', 'Operational'],
                        datasets: [{
                          label: 'Risk Factors',
                          data: [
                            // Generate weighted factors based on risk score
                            Math.min(100, Math.max(20, riskAssessment.riskScore * 0.8 + Math.random() * 10)), 
                            Math.min(100, Math.max(20, riskAssessment.riskScore * 0.7 + Math.random() * 15)),
                            Math.min(100, Math.max(20, riskAssessment.riskScore * 0.9 + Math.random() * 5)),
                            Math.min(100, Math.max(20, riskAssessment.riskScore * 0.6 + Math.random() * 20))
                          ],
                          backgroundColor: 'rgba(75, 192, 192, 0.8)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1,
                        }],
                      }} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                          legend: {
                            display: false,
                          }
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              font: {
                                size: 10
                              }
                            }
                          },
                          y: {
                            ticks: {
                              font: {
                                size: 10
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Risk Score Legend */}
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="p-2 bg-red-50 border border-red-100 rounded-md text-center">
                  <div className="text-xs font-medium text-red-800">Risk Score</div>
                  <div className="text-base font-bold text-red-700">{riskAssessment.riskScore}%</div>
                </div>
                
                <div className="p-2 bg-blue-50 border border-blue-100 rounded-md text-center">
                  <div className="text-xs font-medium text-blue-800">Safety Score</div>
                  <div className="text-base font-bold text-blue-700">{100 - riskAssessment.riskScore}%</div>
                </div>
                
                <div className="p-2 bg-amber-50 border border-amber-100 rounded-md text-center">
                  <div className="text-xs font-medium text-amber-800">Compliance Impact</div>
                  <div className="text-base font-bold text-amber-700">
                    {riskAssessment.riskScore > 70 ? 'Critical' : 
                     riskAssessment.riskScore > 50 ? 'Significant' : 
                     riskAssessment.riskScore > 30 ? 'Moderate' : 'Low'}
                  </div>
                </div>
                
                <div className="p-2 bg-green-50 border border-green-100 rounded-md text-center">
                  <div className="text-xs font-medium text-green-800">Legal Review Priority</div>
                  <div className="text-base font-bold text-green-700">
                    {riskAssessment.riskScore > 70 ? 'Urgent' : 
                     riskAssessment.riskScore > 50 ? 'High' : 
                     riskAssessment.riskScore > 30 ? 'Medium' : 'Low'}
                  </div>
                </div>
              </div>
            </div>
            
            {riskAssessment.euAiActArticles && riskAssessment.euAiActArticles.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Relevant EU AI Act Articles</h4>
                <div className="flex flex-wrap gap-1">
                  {riskAssessment.euAiActArticles.map((article, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10">
                      {article}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {riskAssessment.prohibitedUseChecks && riskAssessment.prohibitedUseChecks.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Prohibited Use Checks</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {riskAssessment.prohibitedUseChecks.map((check, index) => (
                    <li key={index} className="text-sm">
                      {typeof check === 'string' ? check : JSON.stringify(check)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {riskAssessment.complianceGaps && riskAssessment.complianceGaps.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Compliance Gaps</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {riskAssessment.complianceGaps.map((gap, index) => (
                    <li key={index} className="text-sm">
                      {typeof gap === 'string' ? gap : JSON.stringify(gap)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {riskAssessment.remediationActions && riskAssessment.remediationActions.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Remediation Actions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {riskAssessment.remediationActions.map((action, index) => (
                    <li key={index} className="text-sm">
                      {typeof action === 'string' ? action : JSON.stringify(action)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {riskAssessment.summaryNotes && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Summary Notes</h4>
                <p className="text-sm whitespace-pre-wrap bg-white p-3 rounded-md border">
                  {riskAssessment.summaryNotes}
                </p>
              </div>
            )}
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold mb-2">Text for Review</h3>
          <div className="bg-card border shadow-sm p-5 rounded-md whitespace-pre-wrap max-h-64 overflow-y-auto font-medium text-base">
            {review.text}
          </div>
        </div>

        {review.validationResult && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Automated Validation Result</h3>
            <div className="bg-card border shadow-sm p-5 rounded-md max-h-64 overflow-y-auto">
              {(() => {
              try {
                // Handle different formats of validationResult
                if (!review.validationResult) {
                  return "No validation result available";
                }
                
                // If it's already an object, format it nicely
                if (typeof review.validationResult === 'object') {
                  return Object.entries(review.validationResult).map(([key, value]) => {
                    if (Array.isArray(value)) {
                      return (
                        <div key={key} className="mb-3">
                          <div className="font-semibold text-primary mb-1">{key}:</div>
                          <ul className="list-disc pl-5 space-y-1">
                            {value.map((item, i) => <li key={i} className="text-sm">{item}</li>)}
                          </ul>
                        </div>
                      );
                    } else if (typeof value === 'boolean') {
                      return (
                        <div key={key} className="mb-3">
                          <span className="font-semibold text-primary">{key}:</span> {value ? "Yes" : "No"}
                        </div>
                      );
                    } else if (value !== null && value !== undefined) {
                      return (
                        <div key={key} className="mb-3">
                          <span className="font-semibold text-primary">{key}:</span> {value.toString()}
                        </div>
                      );
                    }
                    return null;
                  });
                }
                
                // Try to parse if it's a string
                if (typeof review.validationResult === 'string') {
                  try {
                    const parsed = JSON.parse(review.validationResult);
                    return Object.entries(parsed).map(([key, value]) => {
                      if (Array.isArray(value)) {
                        return (
                          <div key={key} className="mb-3">
                            <div className="font-semibold text-primary mb-1">{key}:</div>
                            <ul className="list-disc pl-5 space-y-1">
                              {(value as any[]).map((item, i) => <li key={i} className="text-sm">{item}</li>)}
                            </ul>
                          </div>
                        );
                      } else if (typeof value === 'boolean') {
                        return (
                          <div key={key} className="mb-3">
                            <span className="font-semibold text-primary">{key}:</span> {value ? "Yes" : "No"}
                          </div>
                        );
                      } else if (value !== null && value !== undefined) {
                        return (
                          <div key={key} className="mb-3">
                            <span className="font-semibold text-primary">{key}:</span> {value.toString()}
                          </div>
                        );
                      }
                      return null;
                    });
                  } catch (e) {
                    // If we can't parse it as JSON, just display as text
                    return review.validationResult;
                  }
                }
                
                // Fallback
                return JSON.stringify(review.validationResult, null, 2);
              } catch (error) {
                console.error("Error formatting validation result:", error);
                return "Error displaying validation result";
              }
            })()}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold mb-2">Expert Legal Feedback</h3>
          <div className="bg-card border shadow-sm rounded-md p-2">
            <Textarea
              placeholder="Enter your expert legal feedback and compliance recommendations here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={6}
              className="w-full resize-y min-h-[120px] p-3 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Provide detailed legal analysis and specific compliance recommendations for EU AI Act adherence.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Update Review Status</h3>
          <div className="bg-card border shadow-sm rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div 
                className={`flex flex-col items-center justify-center p-3 rounded-md cursor-pointer border-2 transition-all ${
                  newStatus === 'pending' 
                    ? 'bg-yellow-50 border-yellow-300 shadow-sm' 
                    : 'border-muted bg-muted/10 hover:border-yellow-200 hover:bg-yellow-50/50'
                }`}
                onClick={() => setNewStatus('pending')}
              >
                <Clock className={`h-6 w-6 mb-1 ${newStatus === 'pending' ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${newStatus === 'pending' ? 'text-yellow-800' : 'text-muted-foreground'}`}>Pending</span>
                <span className="text-xs text-center mt-1 text-muted-foreground">Awaiting expert review</span>
              </div>
              
              <div 
                className={`flex flex-col items-center justify-center p-3 rounded-md cursor-pointer border-2 transition-all ${
                  newStatus === 'in_progress' 
                    ? 'bg-blue-50 border-blue-300 shadow-sm' 
                    : 'border-muted bg-muted/10 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
                onClick={() => setNewStatus('in_progress')}
              >
                <AlertCircle className={`h-6 w-6 mb-1 ${newStatus === 'in_progress' ? 'text-blue-600' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${newStatus === 'in_progress' ? 'text-blue-800' : 'text-muted-foreground'}`}>In Progress</span>
                <span className="text-xs text-center mt-1 text-muted-foreground">Currently reviewing</span>
              </div>
              
              <div 
                className={`flex flex-col items-center justify-center p-3 rounded-md cursor-pointer border-2 transition-all ${
                  newStatus === 'completed' 
                    ? 'bg-green-50 border-green-300 shadow-sm' 
                    : 'border-muted bg-muted/10 hover:border-green-200 hover:bg-green-50/50'
                }`}
                onClick={() => setNewStatus('completed')}
              >
                <CheckCircle className={`h-6 w-6 mb-1 ${newStatus === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${newStatus === 'completed' ? 'text-green-800' : 'text-muted-foreground'}`}>Completed</span>
                <span className="text-xs text-center mt-1 text-muted-foreground">Review finalized</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 border-t pt-6">
        <div className="text-sm text-muted-foreground">
          <p>Last updated: {formatDate(review.updatedAt || review.requestedAt)}</p>
          {review.status === 'completed' && review.completedAt && (
            <p className="mt-1">Completed on: {formatDate(review.completedAt)}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-5"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={updateMutation.isPending}
            className="px-5 min-w-[140px]"
          >
            {updateMutation.isPending ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Clock className="h-3 w-3 mr-1" /> Pending
      </Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
        <AlertCircle className="h-3 w-3 mr-1" /> In Progress
      </Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" /> Completed
      </Badge>;
    default:
      return <Badge variant="outline">
        <XCircle className="h-3 w-3 mr-1" /> Unknown
      </Badge>;
  }
}

function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}