-- Add OAuth columns to users table if they don't already exist
DO $$ 
BEGIN 
    -- Add google_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'google_id') THEN
        ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
    END IF;
    
    -- Add github_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'github_id') THEN
        ALTER TABLE users ADD COLUMN github_id VARCHAR(255) UNIQUE;
    END IF;
    
    -- Make password_hash nullable for OAuth users if not already nullable
    BEGIN
        ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
    EXCEPTION 
        WHEN OTHERS THEN NULL; -- Ignore if already nullable
    END;
END $$;

-- Add constraint to ensure either password or OAuth ID exists
ALTER TABLE users 
ADD CONSTRAINT check_auth_method 
CHECK (
  password_hash IS NOT NULL OR 
  google_id IS NOT NULL OR 
  github_id IS NOT NULL
);
