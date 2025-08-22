-- Add last_active column to users table for real-time status tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT NOW();

-- Update existing users to have current timestamp as last_active
UPDATE users SET last_active = NOW() WHERE last_active IS NULL;
