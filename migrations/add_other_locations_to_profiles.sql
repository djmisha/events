-- Add other_locations column to profiles table
-- This column will store an array of location IDs that the user has saved

ALTER TABLE profiles 
ADD COLUMN other_locations INTEGER[] DEFAULT '{}';

-- Add a comment to the column for documentation
COMMENT ON COLUMN profiles.other_locations IS 'Array of location IDs that the user has saved as additional locations of interest';
