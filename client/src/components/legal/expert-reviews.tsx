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
import { CheckCircle, Clock, XCircle, AlertCircle, ExternalLink, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
        <Spinner size="lg" />
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
  
  useEffect(() => {
    setFeedbackText(review.expertFeedback || '');
    setNewStatus(review.status);
  }, [review]);

  const updateMutation = useMutation({
    mutationFn: async (data: { reviewId: string; status: string; expertFeedback?: string }) => {
      // Fix for double-JSON string issue
      const requestData = {
        status: data.status,
        expertFeedback: data.expertFeedback,
        assignedTo: 'Legal Expert' // Default assignee
      };
      
      console.log('Sending update request with data:', requestData);
      
      return apiRequest(`/api/legal/expert-reviews/${data.reviewId}`, {
        method: 'PATCH',
        body: requestData
      });
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
    onError: (error) => {
      console.error('Error updating review:', error);
      toast({
        title: 'Error Updating Review',
        description: `Failed to update review: ${(error as Error).message || 'Unknown error'}`,
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
                <Spinner size="sm" className="mr-2" />
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