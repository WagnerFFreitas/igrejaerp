-- Adiciona a coluna 'role' à tabela 'members' se ela não existir.
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='role') THEN
    ALTER TABLE members ADD COLUMN role TEXT;
    RAISE NOTICE 'Coluna "role" adicionada à tabela "members".';
  ELSE
    RAISE NOTICE 'Coluna "role" já existe na tabela "members".';
  END IF;
END $$;
