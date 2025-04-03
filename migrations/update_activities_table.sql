-- Add missing columns to the activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS activity_type text,
ADD COLUMN IF NOT EXISTS target_id text,
ADD COLUMN IF NOT EXISTS target_type text,
ADD COLUMN IF NOT EXISTS details jsonb,
ADD COLUMN IF NOT EXISTS ip text;

-- Update existing records to populate activity_type from type
UPDATE activities
SET activity_type = type
WHERE activity_type IS NULL AND type IS NOT NULL;

-- Make activity_type not null after migration
ALTER TABLE activities
ALTER COLUMN activity_type SET NOT NULL;