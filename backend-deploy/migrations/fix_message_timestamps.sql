-- Fix message timestamps to use proper timezone
-- Convert existing created_at column to TIMESTAMP WITH TIME ZONE

-- First, add a new column with timezone
ALTER TABLE messages ADD COLUMN created_at_new TIMESTAMP WITH TIME ZONE;

-- Update the new column with UTC timezone assumption for existing data
UPDATE messages SET created_at_new = created_at AT TIME ZONE 'UTC';

-- Drop the old column
ALTER TABLE messages DROP COLUMN created_at;

-- Rename the new column
ALTER TABLE messages RENAME COLUMN created_at_new TO created_at;

-- Set default for new records
ALTER TABLE messages ALTER COLUMN created_at SET DEFAULT NOW();
