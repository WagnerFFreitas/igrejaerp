-- =====================================================
-- MIGRATION: ADD PROFILE_DATA COLUMN
-- =====================================================

-- Adicionar coluna profile_data à tabela de membros (se não existir)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='profile_data') THEN
        ALTER TABLE members ADD COLUMN profile_data JSONB DEFAULT '{}';
        COMMENT ON COLUMN members.profile_data IS 'Dados auxiliares e configurações estendidas (incluindo LGPD)';
    END IF;
END $$;

-- Adicionar coluna profile_data à tabela de funcionários (se não existir)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='profile_data') THEN
        ALTER TABLE employees ADD COLUMN profile_data JSONB DEFAULT '{}';
        COMMENT ON COLUMN employees.profile_data IS 'Dados auxiliares e configurações estendidas (incluindo LGPD)';
    END IF;
END $$;
