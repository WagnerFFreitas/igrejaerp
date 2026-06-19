-- ============================================================================
-- MIGRAÇÃO: Normalização de Dados Bancários de Pessoas
-- Data: 2026-05-29
-- Descrição: Cria tabela dados_bancarios_pessoa, migra dados de funcionarios,
--            remove colunas bancárias de funcionarios.
-- ============================================================================

-- 1. Criar tabela dados_bancarios_pessoa (se não existir)
CREATE TABLE IF NOT EXISTS public.dados_bancarios_pessoa (
    id_dado_bancario uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_pessoa uuid NOT NULL REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE,
    banco character varying(100),
    agencia character varying(20),
    conta character varying(50),
    tipo_conta character varying(20),
    chave_pix character varying(100),
    principal boolean DEFAULT true,
    ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualizar timestamp
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_dados_bancarios_pessoa'
    ) THEN
        CREATE TRIGGER trg_dados_bancarios_pessoa BEFORE UPDATE ON public.dados_bancarios_pessoa
        FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();
    END IF;
END
$$;

-- 2. Migrar dados bancários de FUNCIONARIOS
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT id_pessoa, banco, agencia, conta, tipo_conta, chave_pix
        FROM public.funcionarios
        WHERE (banco IS NOT NULL AND banco <> '')
           OR (agencia IS NOT NULL AND agencia <> '')
           OR (conta IS NOT NULL AND conta <> '')
           OR (chave_pix IS NOT NULL AND chave_pix <> '')
    LOOP
        -- Inserir apenas se não existir dados bancários para esta pessoa
        IF NOT EXISTS (
            SELECT 1 FROM public.dados_bancarios_pessoa WHERE id_pessoa = r.id_pessoa
        ) THEN
            INSERT INTO public.dados_bancarios_pessoa (id_pessoa, banco, agencia, conta, tipo_conta, chave_pix, principal)
            VALUES (r.id_pessoa, r.banco, r.agencia, r.conta, r.tipo_conta, r.chave_pix, true);
        END IF;
    END LOOP;
END
$$;

-- 3. Remover colunas bancárias de FUNCIONARIOS
-- (Só execute após confirmar que backend não usa mais essas colunas)
-- ALTER TABLE public.funcionarios DROP COLUMN IF EXISTS banco;
-- ALTER TABLE public.funcionarios DROP COLUMN IF EXISTS agencia;
-- ALTER TABLE public.funcionarios DROP COLUMN IF EXISTS conta;
-- ALTER TABLE public.funcionarios DROP COLUMN IF EXISTS tipo_conta;
-- ALTER TABLE public.funcionarios DROP COLUMN IF EXISTS chave_pix;

-- 4. Validação
SELECT 'FUNCIONÁRIOS com dados bancários migrados' AS status, COUNT(*) AS total
FROM public.dados_bancarios_pessoa;

SELECT 'Total de registros em dados_bancarios_pessoa' AS status, COUNT(*) AS total
FROM public.dados_bancarios_pessoa;
