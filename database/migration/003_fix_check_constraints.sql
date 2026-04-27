-- =====================================================
-- FIX: UPDATE CHECK CONSTRAINTS TO ENGLISH VALUES
-- =====================================================
-- This script drops old CHECK constraints with Portuguese
-- values and creates new ones with English values.
-- =====================================================

BEGIN;

-- First, migrate existing data from Portuguese to English values
-- Status migration
UPDATE members SET status = 'ACTIVE' WHERE status = 'ATIVO';
UPDATE members SET status = 'INACTIVE' WHERE status = 'INATIVO';
UPDATE members SET status = 'INACTIVE' WHERE status = 'TRANSFERIDO';
UPDATE members SET status = 'INACTIVE' WHERE status = 'FALECIDO';
UPDATE members SET status = 'INACTIVE' WHERE status = 'DESLIGADO';
-- Set default for any NULL or unrecognized values
UPDATE members SET status = 'ACTIVE' WHERE status NOT IN ('ATIVO', 'INATIVO', 'TRANSFERIDO', 'FALECIDO', 'DESLIGADO', 'ACTIVE', 'INACTIVE', 'PENDING') OR status IS NULL;

-- Marital status migration
UPDATE members SET marital_status = 'SINGLE' WHERE marital_status = 'SOLTEIRO';
UPDATE members SET marital_status = 'MARRIED' WHERE marital_status = 'CASADO';
UPDATE members SET marital_status = 'DIVORCED' WHERE marital_status = 'DIVORCIADO';
UPDATE members SET marital_status = 'WIDOWED' WHERE marital_status = 'VIUVO';
-- Set default for any NULL or unrecognized values
UPDATE members SET marital_status = 'SINGLE' WHERE marital_status NOT IN ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED') OR marital_status IS NULL;

-- Gender migration (should already be M/F/O but let's standardize)
UPDATE members SET gender = 'OTHER' WHERE gender = 'O';
-- Set default for any NULL or unrecognized values
UPDATE members SET gender = 'OTHER' WHERE gender NOT IN ('M', 'F', 'O', 'OTHER') OR gender IS NULL;

-- Now drop old CHECK constraints
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_situacao_check;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_estado_civil_check;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_sexo_check;

-- Create new CHECK constraints with English values
ALTER TABLE members ADD CONSTRAINT members_status_check 
  CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING'));

ALTER TABLE members ADD CONSTRAINT members_marital_status_check 
  CHECK (marital_status IN ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'));

ALTER TABLE members ADD CONSTRAINT members_gender_check 
  CHECK (gender IN ('M', 'F', 'OTHER'));

COMMIT;
