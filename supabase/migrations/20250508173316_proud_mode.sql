/*
  # Update user validation to use CPF instead of email

  1. Changes
    - Add unique constraint on auth.users metadata CPF
    - Create function to validate CPF before user creation
    - Add trigger to check CPF uniqueness
*/

-- Create function to check CPF uniqueness in user metadata
CREATE OR REPLACE FUNCTION public.check_cpf_unique()
RETURNS trigger AS $$
DECLARE
  existing_user_id uuid;
BEGIN
  -- Check if CPF already exists in user metadata
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE raw_user_meta_data->>'cpf' = NEW.raw_user_meta_data->>'cpf'
  AND id != NEW.id;

  IF existing_user_id IS NOT NULL THEN
    RAISE EXCEPTION 'CPF already registered'
      USING HINT = 'Choose a different CPF';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to check CPF before user insert/update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'check_cpf_unique_trigger'
  ) THEN
    CREATE TRIGGER check_cpf_unique_trigger
      BEFORE INSERT OR UPDATE ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.check_cpf_unique();
  END IF;
END $$;