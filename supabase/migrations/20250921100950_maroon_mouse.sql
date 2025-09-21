/*
  # Create feedback table

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `rating` (text, 'good'|'medium'|'poor')
      - `comment` (text, nullable)
      - `language` (text, user's selected language)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `feedback` table
    - Add policy for anonymous users to insert feedback
    - Add policy for authenticated users to read all feedback
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating text NOT NULL CHECK (rating IN ('good', 'medium', 'poor')),
  comment text,
  language text NOT NULL DEFAULT 'english',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users (police officers) to read all feedback
CREATE POLICY "Authenticated users can read all feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback (rating);
CREATE INDEX IF NOT EXISTS idx_feedback_language ON feedback (language);