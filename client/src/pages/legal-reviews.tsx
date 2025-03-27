import React, { useState } from 'react';
import { 
  PageHeader, 
  PageHeaderDescription, 
  PageHeaderHeading 
} from '@/components/page-header';
import { 
  ExpertReviewsList, 
  ExpertReviewDetail 
} from '@/components/legal/expert-reviews';
import { PageContainer } from '@/components/page-container';

interface ExpertReview {
  reviewId: string;
  assessmentId?: string;
  systemId?: string;
  text: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed';
  validationResult: any;
  requestedAt: Date;
  assignedTo?: string;
  completedAt?: Date;
  expertFeedback?: string;
}

export default function LegalReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<ExpertReview | null>(null);
  const [reviews, setReviews] = useState<ExpertReview[]>([]);

  const handleSelectReview = (review: ExpertReview) => {
    setSelectedReview(review);
  };

  const handleCloseReview = () => {
    setSelectedReview(null);
  };

  const handleUpdateStatus = (reviewId: string, newStatus: string) => {
    // Update the status in the local state
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.reviewId === reviewId ? { ...review, status: newStatus as 'pending' | 'in_progress' | 'completed' } : review
      )
    );
    
    // Also update the selected review if it's the one being updated
    if (selectedReview && selectedReview.reviewId === reviewId) {
      setSelectedReview({
        ...selectedReview,
        status: newStatus as 'pending' | 'in_progress' | 'completed'
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderHeading>Expert Legal Reviews</PageHeaderHeading>
        <PageHeaderDescription>
          Manage and track expert reviews for EU AI Act compliance validation
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid gap-6">
        {selectedReview ? (
          <ExpertReviewDetail 
            review={selectedReview} 
            onClose={handleCloseReview}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <ExpertReviewsList 
            onSelectReview={handleSelectReview}
            refreshInterval={30000} // Refresh every 30 seconds
          />
        )}
      </div>
    </PageContainer>
  );
}