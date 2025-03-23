
-- CreateTable
CREATE TABLE IF NOT EXISTS "risk_management_systems" (
    "id" SERIAL PRIMARY KEY,
    "system_id" TEXT NOT NULL REFERENCES "ai_systems"("system_id") ON DELETE CASCADE,
    "rms_id" TEXT NOT NULL UNIQUE,
    "status" TEXT NOT NULL,
    "created_date" TIMESTAMP NOT NULL,
    "last_update_date" TIMESTAMP NOT NULL,
    "last_review_date" TIMESTAMP,
    "next_review_date" TIMESTAMP,
    "review_cycle" TEXT NOT NULL,
    "responsible_person" TEXT,
    "document_reference" TEXT,
    "version" INTEGER NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "risk_controls" (
    "id" SERIAL PRIMARY KEY,
    "control_id" TEXT NOT NULL UNIQUE,
    "system_id" TEXT NOT NULL REFERENCES "ai_systems"("system_id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "control_type" TEXT NOT NULL,
    "implementation_status" TEXT NOT NULL,
    "effectiveness" TEXT,
    "implementation_date" TIMESTAMP,
    "last_review_date" TIMESTAMP,
    "next_review_date" TIMESTAMP,
    "responsible_person" TEXT,
    "related_gaps" TEXT[],
    "documentation_links" TEXT[],
    "test_results" JSONB,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "risk_events" (
    "id" SERIAL PRIMARY KEY,
    "event_id" TEXT NOT NULL UNIQUE,
    "system_id" TEXT NOT NULL REFERENCES "ai_systems"("system_id") ON DELETE CASCADE,
    "event_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detection_date" TIMESTAMP NOT NULL,
    "reported_by" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "impact" TEXT,
    "root_cause" TEXT,
    "mitigation_actions" TEXT[],
    "recurrence_prevention" TEXT,
    "closure_date" TIMESTAMP,
    "related_controls" TEXT[]
);

-- CreateIndex
CREATE INDEX "risk_management_systems_system_id_idx" ON "risk_management_systems"("system_id");
CREATE INDEX "risk_controls_system_id_idx" ON "risk_controls"("system_id");
CREATE INDEX "risk_events_system_id_idx" ON "risk_events"("system_id");
