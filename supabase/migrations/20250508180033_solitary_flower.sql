/*
  # Enhance CPF validation and uniqueness

  1. Changes
    - Add CPF validation function
    - Add trigger to validate CPF before insert/update
    - Ensure CPF format and uniqueness constraints
    - Add proper error messages

  2. Security
    - Validate CPF format and check digits
    - Prevent duplicate CPFs across users
*/

-- Create function to validate CPF format and check digits
CREATE OR REPLACE FUNCTION validate_cpf(cpf text)
RETURNS boolean AS $$
DECLARE
    numbers int[];
    sum int;
    dv1 int;
    dv2 int;
BEGIN
    -- Remove non-digits
    cpf := regexp_replace(cpf, '[^0-9]', '', 'g');
    
    -- Check length
    IF length(cpf) != 11 THEN
        RETURN false;
    END IF;

    -- Check for repeated digits
    IF cpf ~ '^(\d)\1*$' THEN
        RETURN false;
    END IF;

    -- Convert to int array
    numbers := string_to_array(cpf, null)::int[];

    -- Calculate first digit
    sum := 0;
    FOR i IN 1..9 LOOP
        sum := sum + (numbers[i] * (11 - i));
    END LOOP;
    dv1 := 11 - (sum % 11);
    IF dv1 >= 10 THEN
        dv1 := 0;
    END IF;
    IF dv1 != numbers[10] THEN
        RETURN false;
    END IF;

    -- Calculate second digit
    sum := 0;
    FOR i IN 1..10 LOOP
        sum := sum + (numbers[i] * (12 - i));
    END LOOP;
    dv2 := 11 - (sum % 11);
    IF dv2 >= 10 THEN
        dv2 := 0;
    END IF;
    RETURN dv2 = numbers[11];
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add CPF validation constraint
ALTER TABLE users
    DROP CONSTRAINT IF EXISTS valid_cpf,
    ADD CONSTRAINT valid_cpf CHECK (validate_cpf(cpf));

-- Enhance CPF uniqueness check trigger
CREATE OR REPLACE FUNCTION check_cpf_unique()
RETURNS trigger AS $$
BEGIN
    -- Validate CPF format and check digits
    IF NOT validate_cpf(NEW.raw_user_meta_data->>'cpf') THEN
        RAISE EXCEPTION 'Invalid CPF format or check digits'
            USING HINT = 'Please provide a valid CPF';
    END IF;

    -- Check if CPF already exists
    IF EXISTS (
        SELECT 1 FROM auth.users
        WHERE raw_user_meta_data->>'cpf' = NEW.raw_user_meta_data->>'cpf'
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'CPF already registered'
            USING HINT = 'This CPF is already in use by another user';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS check_cpf_unique_trigger ON auth.users;
CREATE TRIGGER check_cpf_unique_trigger
    BEFORE INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION check_cpf_unique();