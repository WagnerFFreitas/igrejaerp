-- =====================================================
-- MIGRATION: RENAME MEMBERS COLUMNS TO ENGLISH STANDARD
-- =====================================================
-- This migration renames Portuguese column names to English
-- to match the application code expectations.
-- =====================================================

BEGIN;

-- Rename columns to English standard
ALTER TABLE members RENAME COLUMN data_nascimento TO birth_date;
ALTER TABLE members RENAME COLUMN sexo TO gender;
ALTER TABLE members RENAME COLUMN estado_civil TO marital_status;
ALTER TABLE members RENAME COLUMN celular TO whatsapp;
ALTER TABLE members RENAME COLUMN cep TO zip_code;
ALTER TABLE members RENAME COLUMN endereco TO street;
ALTER TABLE members RENAME COLUMN bairro TO neighborhood;
ALTER TABLE members RENAME COLUMN cidade TO city;
ALTER TABLE members RENAME COLUMN estado TO state;
ALTER TABLE members RENAME COLUMN data_conversao TO conversion_date;
ALTER TABLE members RENAME COLUMN data_batismo TO baptism_date;
ALTER TABLE members RENAME COLUMN data_membro TO membership_date;
ALTER TABLE members RENAME COLUMN situacao TO status;
ALTER TABLE members RENAME COLUMN cargo_igreja TO role;
ALTER TABLE members RENAME COLUMN observacoes TO observations;

-- Add missing columns that don't exist yet
DO $$ 
BEGIN 
    -- matricula
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='matricula') THEN
        ALTER TABLE members ADD COLUMN matricula VARCHAR(50) UNIQUE;
    END IF;
    
    -- profession
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='profession') THEN
        ALTER TABLE members ADD COLUMN profession VARCHAR(100);
    END IF;
    
    -- spouse_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='spouse_name') THEN
        ALTER TABLE members ADD COLUMN spouse_name VARCHAR(255);
    END IF;
    
    -- marriage_date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='marriage_date') THEN
        ALTER TABLE members ADD COLUMN marriage_date DATE;
    END IF;
    
    -- father_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='father_name') THEN
        ALTER TABLE members ADD COLUMN father_name VARCHAR(255);
    END IF;
    
    -- mother_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='mother_name') THEN
        ALTER TABLE members ADD COLUMN mother_name VARCHAR(255);
    END IF;
    
    -- blood_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='blood_type') THEN
        ALTER TABLE members ADD COLUMN blood_type VARCHAR(10);
    END IF;
    
    -- emergency_contact
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='emergency_contact') THEN
        ALTER TABLE members ADD COLUMN emergency_contact VARCHAR(100);
    END IF;
    
    -- number (address)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='number') THEN
        ALTER TABLE members ADD COLUMN number VARCHAR(20);
    END IF;
    
    -- complement (address)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='complement') THEN
        ALTER TABLE members ADD COLUMN complement VARCHAR(100);
    END IF;
    
    -- conversion_place
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='conversion_place') THEN
        ALTER TABLE members ADD COLUMN conversion_place VARCHAR(255);
    END IF;
    
    -- baptism_church
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='baptism_church') THEN
        ALTER TABLE members ADD COLUMN baptism_church VARCHAR(255);
    END IF;
    
    -- baptizing_pastor
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='baptizing_pastor') THEN
        ALTER TABLE members ADD COLUMN baptizing_pastor VARCHAR(255);
    END IF;
    
    -- holy_spirit_baptism
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='holy_spirit_baptism') THEN
        ALTER TABLE members ADD COLUMN holy_spirit_baptism BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- church_of_origin
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='church_of_origin') THEN
        ALTER TABLE members ADD COLUMN church_of_origin VARCHAR(255);
    END IF;
    
    -- discipleship_course
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='discipleship_course') THEN
        ALTER TABLE members ADD COLUMN discipleship_course VARCHAR(20) DEFAULT 'NAO_INICIADO';
    END IF;
    
    -- biblical_school
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='biblical_school') THEN
        ALTER TABLE members ADD COLUMN biblical_school VARCHAR(20) DEFAULT 'INATIVO';
    END IF;
    
    -- main_ministry
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='main_ministry') THEN
        ALTER TABLE members ADD COLUMN main_ministry VARCHAR(100);
    END IF;
    
    -- ministry_role
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='ministry_role') THEN
        ALTER TABLE members ADD COLUMN ministry_role VARCHAR(100);
    END IF;
    
    -- other_ministries
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='other_ministries') THEN
        ALTER TABLE members ADD COLUMN other_ministries TEXT[];
    END IF;
    
    -- ecclesiastical_position
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='ecclesiastical_position') THEN
        ALTER TABLE members ADD COLUMN ecclesiastical_position VARCHAR(100);
    END IF;
    
    -- consecration_date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='consecration_date') THEN
        ALTER TABLE members ADD COLUMN consecration_date DATE;
    END IF;
    
    -- is_tithable
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='is_tithable') THEN
        ALTER TABLE members ADD COLUMN is_tithable BOOLEAN DEFAULT TRUE;
    END IF;
    
    -- is_regular_giver
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='is_regular_giver') THEN
        ALTER TABLE members ADD COLUMN is_regular_giver BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- participates_campaigns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='participates_campaigns') THEN
        ALTER TABLE members ADD COLUMN participates_campaigns BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- bank
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='bank') THEN
        ALTER TABLE members ADD COLUMN bank VARCHAR(100);
    END IF;
    
    -- bank_agency
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='bank_agency') THEN
        ALTER TABLE members ADD COLUMN bank_agency VARCHAR(20);
    END IF;
    
    -- bank_account
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='bank_account') THEN
        ALTER TABLE members ADD COLUMN bank_account VARCHAR(50);
    END IF;
    
    -- pix_key
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='pix_key') THEN
        ALTER TABLE members ADD COLUMN pix_key VARCHAR(100);
    END IF;
    
    -- special_needs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='special_needs') THEN
        ALTER TABLE members ADD COLUMN special_needs TEXT;
    END IF;
    
    -- talents
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='talents') THEN
        ALTER TABLE members ADD COLUMN talents TEXT;
    END IF;
    
    -- tags
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='tags') THEN
        ALTER TABLE members ADD COLUMN tags TEXT[];
    END IF;
    
    -- family_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='family_id') THEN
        ALTER TABLE members ADD COLUMN family_id UUID;
    END IF;
    
    -- avatar
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='avatar') THEN
        ALTER TABLE members ADD COLUMN avatar TEXT;
    END IF;
    
    -- cell_group
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='cell_group') THEN
        ALTER TABLE members ADD COLUMN cell_group VARCHAR(100);
    END IF;
END $$;

-- Migrate data from old columns to new columns where needed
-- Note: Since we renamed the columns, the data is already in place
-- But we need to handle the 'celular' -> 'whatsapp' rename
-- The data is already in the renamed column, so no additional migration needed

-- Handle 'ministerio' column - check if it exists and migrate to main_ministry if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='ministerio') THEN
        -- Copy data from ministerio to main_ministry where main_ministry is null
        UPDATE members SET main_ministry = ministerio WHERE main_ministry IS NULL AND ministerio IS NOT NULL;
        -- Optionally drop the old column
        -- ALTER TABLE members DROP COLUMN ministerio;
    END IF;
END $$;

-- Handle 'grupo_pequeno' column - check if it exists and migrate to cell_group if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='grupo_pequeno') THEN
        -- Copy data from grupo_pequeno to cell_group where cell_group is null
        UPDATE members SET cell_group = grupo_pequeno WHERE cell_group IS NULL AND grupo_pequeno IS NOT NULL;
        -- Optionally drop the old column
        -- ALTER TABLE members DROP COLUMN grupo_pequeno;
    END IF;
END $$;

-- Handle 'dizimista' column - migrate to is_tithable
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='dizimista') THEN
        -- Copy data from dizimista to is_tithable
        UPDATE members SET is_tithable = dizimista WHERE is_tithable IS NULL AND dizimista IS NOT NULL;
    END IF;
END $$;

-- Handle 'ofertante' column - migrate to is_regular_giver
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='ofertante') THEN
        -- Copy data from ofertante to is_regular_giver
        UPDATE members SET is_regular_giver = ofertante WHERE is_regular_giver IS NULL AND ofertante IS NOT NULL;
    END IF;
END $$;

-- Handle 'valor_dizimo' column - this might need to go to profile_data or be removed
-- For now, we'll keep it but it's not in the new schema

COMMIT;
