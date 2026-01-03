-- Migration: Add user protection feature
-- Date: 2026-01-03
-- Description: Adds is_protected column to profiles table to prevent deletion of critical users

-- Add is_protected column to profiles table
ALTER TABLE profiles 
ADD COLUMN is_protected BOOLEAN DEFAULT false NOT NULL;

-- Create index for better query performance
CREATE INDEX idx_profiles_is_protected ON profiles(is_protected);

-- Optional: Mark existing admin users as protected
-- Uncomment and modify the following line to protect specific users:
-- UPDATE profiles SET is_protected = true WHERE email IN ('admin@example.com', 'user@example.com');

-- Or protect all current admins:
-- UPDATE profiles SET is_protected = true WHERE role = 'admin';
