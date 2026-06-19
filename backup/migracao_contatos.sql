-- ============================================================================
-- MIGRAÇÃO: Normalização de Contatos
-- Data: 2026-05-29
-- Descrição: Cria tabela contatos, migra dados de pessoas/unidades,
--            remove colunas antigas de contato.
-- ============================================================================

-- 1. Criar tabela contatos (se não existir)
CREATE TABLE IF NOT EXISTS public.contatos (
    id_contato uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    tipo_entidade character varying(30) NOT NULL, -- 'PESSOA' ou 'UNIDADE'
    id_entidade uuid NOT NULL,
    tipo_contato character varying(30) NOT NULL, -- 'EMAIL', 'TELEFONE', 'CELULAR', 'WHATSAPP'
    valor character varying(255) NOT NULL,
    principal boolean DEFAULT false,
    ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualizar timestamp
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_contatos'
    ) THEN
        CREATE TRIGGER trg_contatos BEFORE UPDATE ON public.contatos
        FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();
    END IF;
END
$$;

-- 2. Migrar contatos de PESSOAS
DO $$
DECLARE
    r RECORD;
BEGIN
    -- EMAIL
    FOR r IN SELECT id_pessoa, email FROM public.pessoas WHERE email IS NOT NULL AND email <> '' LOOP
        INSERT INTO public.contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
        VALUES ('PESSOA', r.id_pessoa, 'EMAIL', r.email, true);
    END LOOP;

    -- TELEFONE
    FOR r IN SELECT id_pessoa, telefone FROM public.pessoas WHERE telefone IS NOT NULL AND telefone <> '' LOOP
        INSERT INTO public.contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
        VALUES ('PESSOA', r.id_pessoa, 'TELEFONE', r.telefone, true);
    END LOOP;

    -- CELULAR
    FOR r IN SELECT id_pessoa, celular FROM public.pessoas WHERE celular IS NOT NULL AND celular <> '' LOOP
        INSERT INTO public.contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
        VALUES ('PESSOA', r.id_pessoa, 'CELULAR', r.celular, true);
    END LOOP;

    -- WHATSAPP (quando flag=true, o número é o celular)
    FOR r IN SELECT id_pessoa, celular FROM public.pessoas WHERE whatsapp = true AND celular IS NOT NULL AND celular <> '' LOOP
        INSERT INTO public.contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
        VALUES ('PESSOA', r.id_pessoa, 'WHATSAPP', r.celular, true);
    END LOOP;
END
$$;

-- 3. Migrar contatos de UNIDADES
DO $$
DECLARE
    r RECORD;
BEGIN
    -- EMAIL
    FOR r IN SELECT id_unidade, email FROM public.unidades WHERE email IS NOT NULL AND email <> '' LOOP
        INSERT INTO public.contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
        VALUES ('UNIDADE', r.id_unidade, 'EMAIL', r.email, true);
    END LOOP;

    -- TELEFONE
    FOR r IN SELECT id_unidade, telefone FROM public.unidades WHERE telefone IS NOT NULL AND telefone <> '' LOOP
        INSERT INTO public.contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
        VALUES ('UNIDADE', r.id_unidade, 'TELEFONE', r.telefone, true);
    END LOOP;
END
$$;

-- 4. Atualizar views que referenciam contatos
CREATE OR REPLACE VIEW public.funcionarios_ativos AS
SELECT f.id_funcionario AS id, f.matricula, f.cargo, f.departamento, f.data_admissao,
       p.nome, p.cpf,
       ce.valor AS email,
       ct.valor AS telefone,
       cc.valor AS celular,
       cw.valor AS whatsapp,
       e.logradouro, e.bairro, e.cidade, e.estado, e.cep,
       u.nome AS nome_unidade,
       CASE WHEN f.data_demissao IS NULL THEN 'ATIVO' ELSE 'INATIVO' END AS situacao_atual
FROM public.funcionarios f
JOIN public.pessoas p ON f.id_pessoa = p.id_pessoa
LEFT JOIN public.enderecos e ON e.id_endereco = p.id_endereco
LEFT JOIN public.contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
LEFT JOIN public.contatos ct ON ct.id_entidade = p.id_pessoa AND ct.tipo_entidade = 'PESSOA' AND ct.tipo_contato = 'TELEFONE' AND ct.principal = true
LEFT JOIN public.contatos cc ON cc.id_entidade = p.id_pessoa AND cc.tipo_entidade = 'PESSOA' AND cc.tipo_contato = 'CELULAR' AND cc.principal = true
LEFT JOIN public.contatos cw ON cw.id_entidade = p.id_pessoa AND cw.tipo_entidade = 'PESSOA' AND cw.tipo_contato = 'WHATSAPP' AND cw.principal = true
LEFT JOIN public.unidades u ON f.id_unidade = u.id_unidade
WHERE f.ativo = true;

CREATE OR REPLACE VIEW public.membros_ativos AS
SELECT m.id, m.id_unidade, m.situacao AS situacao_membro, m.ministerio, m.dizimista, m.ofertante,
       p.nome, p.cpf,
       ce.valor AS email,
       ct.valor AS telefone,
       cc.valor AS celular,
       cw.valor AS whatsapp,
       e.logradouro, e.bairro, e.cidade, e.estado, e.cep,
       u.nome AS nome_unidade
FROM public.membros m
JOIN public.pessoas p ON m.id_pessoa = p.id_pessoa
LEFT JOIN public.enderecos e ON e.id_endereco = p.id_endereco
LEFT JOIN public.contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
LEFT JOIN public.contatos ct ON ct.id_entidade = p.id_pessoa AND ct.tipo_entidade = 'PESSOA' AND ct.tipo_contato = 'TELEFONE' AND ct.principal = true
LEFT JOIN public.contatos cc ON cc.id_entidade = p.id_pessoa AND cc.tipo_entidade = 'PESSOA' AND cc.tipo_contato = 'CELULAR' AND cc.principal = true
LEFT JOIN public.contatos cw ON cw.id_entidade = p.id_pessoa AND cw.tipo_entidade = 'PESSOA' AND cw.tipo_contato = 'WHATSAPP' AND cw.principal = true
LEFT JOIN public.unidades u ON m.id_unidade = u.id_unidade
WHERE m.situacao = 'ATIVO';

-- 5. Remover colunas antigas de contato de PESSOAS
-- (Só execute após confirmar que backend e frontend não usam mais essas colunas)
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS email;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS telefone;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS celular;
-- ALTER TABLE public.pessoas DROP COLUMN IF EXISTS whatsapp;

-- 6. Remover colunas antigas de contato de UNIDADES
-- (Só execute após confirmar que backend e frontend não usam mais essas colunas)
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS email;
-- ALTER TABLE public.unidades DROP COLUMN IF EXISTS telefone;

-- 7. Validação
SELECT 'PESSOAS com contatos migrados' AS status, COUNT(DISTINCT id_entidade) AS total
FROM public.contatos WHERE tipo_entidade = 'PESSOA';

SELECT 'UNIDADES com contatos migrados' AS status, COUNT(DISTINCT id_entidade) AS total
FROM public.contatos WHERE tipo_entidade = 'UNIDADE';

SELECT 'Total de contatos criados' AS status, COUNT(*) AS total
FROM public.contatos;

SELECT 'Contatos por tipo' AS status, tipo_contato, COUNT(*) AS total
FROM public.contatos
GROUP BY tipo_contato
ORDER BY tipo_contato;
