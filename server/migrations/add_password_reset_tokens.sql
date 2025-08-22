-- Add password reset token columns to users table
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expires TIMESTAMP WITH TIME ZONE;
