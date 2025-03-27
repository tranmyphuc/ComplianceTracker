-- Create expert_reviews table
CREATE TABLE IF NOT EXISTS expert_reviews (
  id SERIAL PRIMARY KEY,
  review_id TEXT NOT NULL UNIQUE,
  assessment_id TEXT REFERENCES risk_assessments(assessment_id),
  system_id TEXT REFERENCES ai_systems(system_id),
  text TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  validation_result JSONB,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  requested_by TEXT REFERENCES users(uid),
  assigned_to TEXT REFERENCES users(uid),
  assigned_at TIMESTAMP,
  completed_at TIMESTAMP,
  expert_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);