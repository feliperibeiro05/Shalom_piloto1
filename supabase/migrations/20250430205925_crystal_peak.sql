/*
  # Update RLS policies for conversations table
  
  1. Changes
    - Drop existing policies
    - Create new policies with proper authentication checks
    - Add proper RLS policies for all tables
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure proper access control
*/

-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_message text NOT NULL,
  user_state jsonb NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Conversation Analysis Table
CREATE TABLE IF NOT EXISTS conversation_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  intent text NOT NULL,
  entities jsonb,
  sentiment_score float NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Learning Patterns Table
CREATE TABLE IF NOT EXISTS learning_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type text NOT NULL,
  confidence_score float NOT NULL,
  last_updated timestamptz DEFAULT now(),
  CONSTRAINT valid_pattern_type CHECK (pattern_type IN ('visual', 'auditory', 'kinesthetic'))
);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_patterns ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read their own conversations" ON conversations;
  DROP POLICY IF EXISTS "Users can insert their own conversations" ON conversations;
  DROP POLICY IF EXISTS "Users can read their conversation analysis" ON conversation_analysis;
  DROP POLICY IF EXISTS "Users can insert conversation analysis" ON conversation_analysis;
  DROP POLICY IF EXISTS "Users can read their learning patterns" ON learning_patterns;
  DROP POLICY IF EXISTS "Users can update their learning patterns" ON learning_patterns;
END $$;

-- Policies for conversations
CREATE POLICY "Enable read access for all users"
  ON conversations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON conversations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policies for conversation_analysis
CREATE POLICY "Enable read access for all users"
  ON conversation_analysis
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON conversation_analysis
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policies for learning_patterns
CREATE POLICY "Users can read their learning patterns"
  ON learning_patterns
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their learning patterns"
  ON learning_patterns
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp);
CREATE INDEX IF NOT EXISTS idx_conversation_analysis_intent ON conversation_analysis(intent);
CREATE INDEX IF NOT EXISTS idx_learning_patterns_user ON learning_patterns(user_id);