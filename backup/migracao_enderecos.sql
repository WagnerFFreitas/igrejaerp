-- ============================================================================
-- MIGRAÇÃO: Normalização de Endereços
-- Data: 2026-05-29
-- Descrição: Cria tabela enderecos, migra dados de pessoas/unidades,
--            remove colunas antigas de endereço.
-- ============================================================================

-- 1. Criar tabela enderecos (se não existir)
CREATE TABLE IF NOT EXISTS public.enderecos (
    id_endereco uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    logradouro character varying(255),
    numero character varying(20),
    complemento character varying(100),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    cep character varying(15),
    pais character varying(100) DEFAULT 'Brasil',
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION public.atualizar_timestamp() RETURNS trigger AS $$
BEGIN NEW.atualizado_em = CURRENT_TIMESTAMP; RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enderecos'
    ) THEN
        CREATE TRIGGER trg_enderecos BEFORE UPDATE ON public.enderecos
        FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();
    END IF;
END
$$;

-- 2. Adicionar coluna id_endereco em pessoas (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pessoas' AND column_name = 'id_endereco'
    ) THEN
        ALTER TABLE public.pessoas ADD COLUMN id_endereco uuid REFERENCES public.enderecos(id_endereco);
    END IF;
END
$$;

-- 3. Adicionar coluna id_endereco em unidades (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'unidades' AND column_name = 'id_endereco'
    ) THEN
        ALTER TABLE public.unidades ADD COLUMN id_endereco uuid REFERENCES public.enderecos(id_endereco);
    END IF;
END
$$;

-- 4. Migrar endereços de PESSOAS para tabela enderecos
DO $$
DECLARE
    r RECORD;
    v_id_endereco uuid;
BEGIN
    FOR r IN
        SELECT id_pessoa, logradouro, numero, complemento, bairro, cidade, estado, cep, pais
        FROM public.pessoas
        WHERE (logradouro IS NOT NULL AND logradouro <> '')
           OR (cidade IS NOT NULL AND cidade <> '')
           OR (cep IS NOT NULL AND cep <> '')
    LOOP
        INSERT INTO public.enderecos (logradouro, numero, complemento, bairro, cidade, estado, cep, pais)
        VALUES (r.logradouro, r.numero, r.complemento, r.bairro, r.cidade, r.estado, r.cep, COALESCE(r.pais, 'Brasil'))
        RETURNING id_endereco INTO v_id_endereco;

        UPDATE public.pessoas SET id_endereco = v_id_endereco WHERE id_pessoa = r.id_pessoa;
    END LOOP;
END
$$;

-- 5. Migrar endereços de UNIDADES para tabela enderecos
DO $$
DECLARE
    r RECORD;
    v_id_endereco uuid;
BEGIN
    FOR r IN
        SELECT id_unidade, logradouro, numero, bairro, cidade, estado, cep, pais
        FROM public.unidades
        WHERE (logradouro IS NOT NULL AND logradouro <> '')
           OR (cidade IS NOT NULL AND cidade <> '')
           OR (cep IS NOT NULL AND cep <> '')
    LOOP
        INSERT INTO public.enderecos (logradouro, numero, bairro, cidade, estado, cep, pais)
        VALUES (r.logradouro, r.numero, r.bairro, r.cidade, r.estado, r.cep, COALESCE(r.pais, 'Brasil'))
        RETURNING id_endereco INTO v_id_endereco;

        UPDATE public.unidades SET id_endereco = v_id_endereco WHERE id_unidade = r.id_unidade;
    END LOOP;
END
$$;

-- 6. Atualizar views que referenciam endereços
CREATE OR REPLACE VIEW public.funcionarios_ativos AS
SELECT f.id_funcionario AS id, f.matricula, f.cargo, f.departamento, f.data_admissao,
       p.nome, p.cpf, p.email, p.telefone, p.celular, p.whatsapp,
       e.logradouro, e.bairro, e.cidade, e.estado, e.cep,
       u.nome AS nome_unidade,
       CASE WHEN f.data_demissao IS NULL THEN 'ATIVO' ELSE 'INATIVO' END AS situacao_atual
FROM public.funcionarios f
JOIN public.pessoas p ON f.id_pessoa = p.id_pessoa
LEFT JOIN public.enderecos e ON e.id_endereco = p.id_endereco
LEFT JOIN public.unidades u ON f.id_unidade = u.id_unidade
WHERE f.ativo = true;

CREATE OR REPLACE VIEW public.membros_ativos AS
SELECT m.id, m.id_unidade, m.situacao AS situacao_membro, m.ministerio, m.dizimista, m.ofertante,
       p.nome, p.cpf, p.email, p.telefone, p.celular, p.whatsapp,
       e.logradouro, e.bairro, e.cidade, e.estado, e.cep,
       u.nome AS nome_unidade
FROM public.membros m
JOIN public.pessoas p ON m.id_pessoa = p.id_pessoa
LEFT JOIN public.enderecos e ON e.id_endereco = p.id_endereco
LEFT JOIN public.unidades u ON m.id_unidade = u.id_unidade
WHERE m.situacao = 'ATIVO';

-- 7. Remover colunas antigas de endereço de PESSOAS
-- (Só execute após confirmar que backend e frontend não usam mais essas colunas)
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS logradouro;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS numero;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS complemento;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS bairro;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS cidade;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS estado;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS cep;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS pais;

-- 8. Remover colunas antigas de endereço de UNIDADES
-- (Só execute após confirmar que backend e frontend não usam mais essas colunas)
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS logradouro;
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS numero;
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS bairro;
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS cidade;
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS estado;
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS cep;
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS pais;

-- 9. Validação
SELECT 'PESSOAS com endereço migrado' AS status, COUNT(*) AS total
FROM public.pessoas WHERE id_endereco IS NOT NULL;

SELECT 'UNIDADES com endereço migrado' AS status, COUNT(*) AS total
FROM public.unidades WHERE id_endereco IS NOT NULL;

SELECT 'Total de endereços criados' AS status, COUNT(*) AS total
FROM public.enderecos;
