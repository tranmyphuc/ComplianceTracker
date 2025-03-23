
-- Create Risk Management System table
CREATE TABLE IF NOT EXISTS "risk_management_systems" (
  "id" SERIAL PRIMARY KEY,
  "rms_id" TEXT NOT NULL UNIQUE,
  "system_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "created_date" TIMESTAMP NOT NULL DEFAULT NOW(),
  "last_update_date" TIMESTAMP NOT NULL DEFAULT NOW(),
  "last_review_date" TIMESTAMP,
  "next_review_date" TIMESTAMP,
  "review_cycle" TEXT NOT NULL,
  "responsible_person" TEXT NOT NULL,
  "document_reference" TEXT,
  "version" TEXT NOT NULL,
  "notes" TEXT,
  CONSTRAINT "risk_management_systems_system_id_fk" FOREIGN KEY ("system_id") REFERENCES "ai_systems"("system_id") ON DELETE CASCADE
);

-- Create Risk Controls table
CREATE TABLE IF NOT EXISTS "risk_controls" (
  "id" SERIAL PRIMARY KEY,
  "control_id" TEXT NOT NULL UNIQUE,
  "system_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "control_type" TEXT NOT NULL,
  "implementation_status" TEXT NOT NULL,
  "effectiveness" INTEGER,
  "implementation_date" TIMESTAMP,
  "last_review_date" TIMESTAMP,
  "next_review_date" TIMESTAMP,
  "responsible_person" TEXT NOT NULL,
  "related_gaps" TEXT[],
  "documentation_links" TEXT[],
  "test_results" TEXT,
  "notes" TEXT,
  CONSTRAINT "risk_controls_system_id_fk" FOREIGN KEY ("system_id") REFERENCES "ai_systems"("system_id") ON DELETE CASCADE
);

-- Create Risk Events table
CREATE TABLE IF NOT EXISTS "risk_events" (
  "id" SERIAL PRIMARY KEY,
  "event_id" TEXT NOT NULL UNIQUE,
  "system_id" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "detection_date" TIMESTAMP NOT NULL,
  "reported_by" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "impact" TEXT NOT NULL,
  "root_cause" TEXT,
  "mitigation_actions" TEXT,
  "recurrence_prevention" TEXT,
  "closure_date" TIMESTAMP,
  "related_controls" TEXT[],
  CONSTRAINT "risk_events_system_id_fk" FOREIGN KEY ("system_id") REFERENCES "ai_systems"("system_id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "risk_management_systems_system_id_idx" ON "risk_management_systems"("system_id");
CREATE INDEX IF NOT EXISTS "risk_controls_system_id_idx" ON "risk_controls"("system_id");
CREATE INDEX IF NOT EXISTS "risk_events_system_id_idx" ON "risk_events"("system_id");

-- Insert sample risk management system data
INSERT INTO "risk_management_systems" (
  "rms_id", "system_id", "status", "created_date", "last_update_date", 
  "review_cycle", "responsible_person", "version", "notes"
)
VALUES 
  ('RMS-TEST-001', 'SGH-AI-001', 'active', NOW(), NOW(), 'quarterly', 'admin-01', '1.0', 'Initial RMS setup'),
  ('RMS-TEST-002', 'SGH-AI-002', 'active', NOW(), NOW(), 'quarterly', 'admin-01', '1.0', 'Initial RMS setup'),
  ('RMS-TEST-003', 'SGH-AI-003', 'active', NOW(), NOW(), 'quarterly', 'admin-01', '1.0', 'Initial RMS setup')
ON CONFLICT (rms_id) DO NOTHING;

-- Insert sample risk controls
INSERT INTO "risk_controls" (
  "control_id", "system_id", "name", "description", "control_type", 
  "implementation_status", "effectiveness", "responsible_person"
)
VALUES 
  ('CTRL-TEST-001', 'SGH-AI-001', 'Data Quality Control', 'Regular checks of data quality and bias', 'preventive', 'implemented', 85, 'admin-01'),
  ('CTRL-TEST-002', 'SGH-AI-001', 'Human Oversight', 'Human review of system decisions', 'detective', 'implemented', 90, 'admin-01'),
  ('CTRL-TEST-003', 'SGH-AI-002', 'Accuracy Monitoring', 'Continuous monitoring of prediction accuracy', 'detective', 'implemented', 75, 'admin-01'),
  ('CTRL-TEST-004', 'SGH-AI-002', 'Explainability Features', 'Features to explain AI decisions', 'preventive', 'in-progress', 60, 'admin-01'),
  ('CTRL-TEST-005', 'SGH-AI-003', 'Bias Detection', 'Automated bias detection in hiring decisions', 'preventive', 'implemented', 80, 'admin-01')
ON CONFLICT (control_id) DO NOTHING;

-- Insert sample risk events
INSERT INTO "risk_events" (
  "event_id", "system_id", "event_type", "severity", "description",
  "detection_date", "reported_by", "status", "impact"
)
VALUES 
  ('EVT-TEST-001', 'SGH-AI-001', 'anomaly', 'low', 'Minor data processing anomaly', NOW() - INTERVAL '7 days', 'system', 'closed', 'No impact on users'),
  ('EVT-TEST-002', 'SGH-AI-002', 'incident', 'medium', 'System downtime during maintenance', NOW() - INTERVAL '14 days', 'admin-01', 'closed', 'Limited availability for 30 minutes'),
  ('EVT-TEST-003', 'SGH-AI-003', 'compliance_issue', 'high', 'Potential bias in candidate screening', NOW() - INTERVAL '3 days', 'admin-01', 'in-progress', 'Potential compliance issue with Article 10')
ON CONFLICT (event_id) DO NOTHING;
