/*
  # Add long-term memory for Sophia

  1. New Tables
    - `sophia_memory`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `key` (text, for memory categorization)
      - `content` (jsonb, memory content)
      - `last_accessed` (timestamptz, for memory retrieval optimization)
      - `importance` (float, for memory prioritization)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to manage their memories

  3. Performance
    - Add indexes for efficient querying
*/

CREATE TABLE sophia_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  key text NOT NULL,
  content jsonb NOT NULL,
  last_accessed timestamptz DEFAULT now(),
  importance float DEFAULT 0.5,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sophia_memory ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their memories"
  ON sophia_memory
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_sophia_memory_user_id ON sophia_memory(user_id);
CREATE INDEX idx_sophia_memory_key ON sophia_memory(key);
CREATE INDEX idx_sophia_memory_last_accessed ON sophia_memory(last_accessed);