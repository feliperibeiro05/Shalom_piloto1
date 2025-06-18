-- Drop all existing tables and policies
DROP TABLE IF EXISTS learning_patterns CASCADE;
DROP TABLE IF EXISTS conversation_analysis CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- Recreate tables with correct structure
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_message text NOT NULL,
  user_state jsonb NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE conversation_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  intent text NOT NULL,
  entities jsonb,
  sentiment_score float NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE learning_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type text NOT NULL,
  confidence_score float NOT NULL,
  last_updated timestamptz DEFAULT now(),
  CONSTRAINT valid_pattern_type CHECK (pattern_type IN ('visual', 'auditory', 'kinesthetic'))
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_patterns ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read for all users" ON conversations FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for all users" ON conversations FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON conversation_analysis FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for all users" ON conversation_analysis FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Users can read their patterns" ON learning_patterns FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their patterns" ON learning_patterns FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp);
CREATE INDEX idx_conversation_analysis_intent ON conversation_analysis(intent);
CREATE INDEX idx_learning_patterns_user ON learning_patterns(user_id);