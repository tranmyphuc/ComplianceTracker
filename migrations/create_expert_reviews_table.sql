-- Create expert_reviews table
CREATE TABLE IF NOT EXISTS expert_reviews (
    id SERIAL PRIMARY KEY,
    review_id TEXT NOT NULL UNIQUE,
    assessment_id TEXT,
    system_id TEXT,
    text TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    validation_result JSONB,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    assigned_to TEXT REFERENCES users(uid),
    completed_at TIMESTAMP,
    expert_feedback TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS expert_reviews_review_id_idx ON expert_reviews(review_id);
CREATE INDEX IF NOT EXISTS expert_reviews_assessment_id_idx ON expert_reviews(assessment_id);
CREATE INDEX IF NOT EXISTS expert_reviews_system_id_idx ON expert_reviews(system_id);
CREATE INDEX IF NOT EXISTS expert_reviews_status_idx ON expert_reviews(status);
CREATE INDEX IF NOT EXISTS expert_reviews_assigned_to_idx ON expert_reviews(assigned_to);