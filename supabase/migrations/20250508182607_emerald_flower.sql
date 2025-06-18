-- Drop existing triggers and constraints that might conflict
DROP TRIGGER IF EXISTS check_cpf_unique_trigger ON auth.users;
ALTER TABLE auth.users DROP CONSTRAINT IF EXISTS valid_cpf_format;
ALTER TABLE auth.users DROP CONSTRAINT IF EXISTS unique_cpf;

-- Remove metadata columns from auth.users since we're using a separate users table
ALTER TABLE auth.users 
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name,
  DROP COLUMN IF EXISTS cpf,
  DROP COLUMN IF EXISTS birth_date;

-- Recreate users table with proper constraints
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  cpf text NOT NULL UNIQUE,
  birth_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_cpf CHECK (validate_cpf(cpf))
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;

-- Create comprehensive policies
CREATE POLICY "Users can manage their own profile"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policy to allow initial profile creation
CREATE POLICY "Users can create their initial profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Recreate updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();