/*
  # Add User Metadata Fields

  1. Changes
    - Add metadata fields to auth.users table for storing user profile information
      - first_name (text)
      - last_name (text)
      - cpf (text)
      - birth_date (date)
    - Add validation for CPF format
  
  2. Security
    - Fields are managed through Supabase Auth, no direct table access needed
*/

-- Create an extension for additional string operations if not exists
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Add metadata columns to auth.users
ALTER TABLE auth.users 
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS birth_date date;

-- Add CPF format validation
ALTER TABLE auth.users 
  ADD CONSTRAINT valid_cpf_format 
  CHECK (cpf ~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$');

-- Add unique constraint on CPF
ALTER TABLE auth.users 
  ADD CONSTRAINT unique_cpf UNIQUE (cpf);