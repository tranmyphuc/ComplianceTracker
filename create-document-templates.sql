-- Create document_templates table
CREATE TABLE IF NOT EXISTS document_templates (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_by VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  version VARCHAR NOT NULL,
  tags VARCHAR[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_document_templates_template_id ON document_templates(template_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_type ON document_templates(type);
CREATE INDEX IF NOT EXISTS idx_document_templates_created_by ON document_templates(created_by);