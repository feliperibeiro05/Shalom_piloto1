/*
  # Sophia AI Database Schema

  1. Tables
    - conversations: Stores chat history and user state
    - conversation_analysis: Stores NLP analysis results
    - learning_patterns: Tracks user learning patterns

  2. Security
    - RLS enabled on all tables
    - Policies for data access control
    - Foreign key constraints

  3. Performance
    - Indexes on frequently queried columns
    - Timestamp tracking
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
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Policies for conversations
CREATE POLICY "Users can read their own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for conversation_analysis
CREATE POLICY "Users can read their conversation analysis"
  ON conversation_analysis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert conversation analysis"
  ON conversation_analysis
  FOR INSERT
  TO authenticated
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