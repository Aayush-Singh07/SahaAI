/*
  # Disable Row Level Security for Feedback Table

  1. Changes
    - Disable RLS on feedback table to allow unrestricted access
    - Drop existing RLS policies

  This removes all security restrictions on the feedback table as requested.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit feedback" ON feedback;
DROP POLICY IF EXISTS "Authenticated users can read all feedback" ON feedback;

-- Disable Row Level Security
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;