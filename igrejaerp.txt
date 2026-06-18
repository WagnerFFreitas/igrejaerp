-- ============================================================================
-- IGREJAERP - SCHEMA CONSOLIDADO (PT-BR)
-- Banco 0 | Data: 2026-05-28
-- Regras: Normalização via 'pessoas', zero duplicidade, palavras reservadas
-- corrigidas, 'whatsapp' como flag booleana, timestamps padronizados.
-- ============================================================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- ENUMS PT-BR
CREATE TYPE public.situacao_unidade AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO');
CREATE TYPE public.situacao_registro AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE', 'SUSPENSO');
CREATE TYPE public.tipo_transacao AS ENUM ('RECEITA', 'DESPESA', 'TRANSFERENCIA');
CREATE TYPE public.situacao_transacao AS ENUM ('PAGO', 'PENDENTE', 'ATRASADO', 'CANCELADO');
CREATE TYPE public.natureza_conta AS ENUM ('ATIVO', 'PASSIVO', 'PATRIMONIO_LIQUIDO', 'RECEITA', 'DESPESA');
CREATE TYPE public.tipo_conta_nivel AS ENUM ('SINTETICO', 'ANALITICO');
CREATE TYPE public.saldo_normal AS ENUM ('DEBITO', 'CREDITO');
CREATE TYPE public.perfil_usuario AS ENUM ('ADMIN', 'SECRETARIO', 'TESOUREIRO', 'PASTOR', 'RH', 'FINANCEIRO', 'DESENVOLVEDOR', 'MEMBRO');
CREATE TYPE public.tipo_evento AS ENUM ('CULTO', 'REUNIAO', 'EVENTO', 'TREINAMENTO', 'CONFERENCIA');
CREATE TYPE public.tipo_patrimonio AS ENUM ('IMOVEIS', 'VEICULOS', 'EQUIPAMENTOS', 'MOVEIS', 'COMPUTADORES', 'MAQUINAS');
CREATE TYPE public.situacao_patrimonio AS ENUM ('ATIVO', 'MANUTENCAO', 'OCIOSO', 'BAIXADO', 'SUCATA');
CREATE TYPE public.tipo_movimentacao AS ENUM ('RETIRADA', 'SUPRIMENTO');
CREATE TYPE public.situacao_conciliacao AS ENUM ('EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE public.tipo_ajuste_inventario AS ENUM ('ENTRADA', 'SAIDA', 'BAIXA');
CREATE TYPE public.regime_trabalho AS ENUM ('CLT', 'PRO_LABORE', 'ESTAGIO', 'AUTONOMO');
CREATE TYPE public.situacao_afastamento AS ENUM ('AGENDADO', 'ATIVO', 'CONCLUIDO', 'CANCELADO');
CREATE TYPE public.tipo_afastamento AS ENUM ('FERIAS', 'MEDICO', 'MATERNIDADE', 'PATERNIDADE', 'MILITAR', 'CASAMENTO', 'LUTO', 'NAO_REMUNERADO');

-- TABELAS CORE (NORMALIZADAS VIA 'pessoas')
CREATE TABLE public.unidades (
    id_unidade uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    nome character varying(255) NOT NULL,
    cnpj character varying(20) UNIQUE,
    telefone character varying(20),
    email character varying(255),
    logradouro character varying(255),
    numero character varying(20),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    cep character varying(15),
    pais character varying(100) DEFAULT 'Brasil',
    situacao public.situacao_unidade DEFAULT 'ATIVO',
    ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.pessoas (
    id_pessoa uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    nome character varying(255) NOT NULL,
    cpf character varying(14) UNIQUE,
    rg character varying(20),
    data_nascimento date,
    sexo character varying(20),
    estado_civil character varying(50),
    email character varying(255),
    telefone character varying(20),
    celular character varying(20),
    whatsapp boolean DEFAULT false, -- ✅ FLAG: TRUE = possui WhatsApp no celular
    logradouro character varying(255),
    numero character varying(20),
    complemento character varying(100),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    cep character varying(15),
    pais character varying(100) DEFAULT 'Brasil',
    tipo_sanguineo character varying(10),
    contato_emergencia character varying(255),
    pcd boolean DEFAULT false,
    tipo_deficiencia character varying(255),
    ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.usuarios (
    id_usuario uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_pessoa uuid NOT NULL REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE,
    login character varying(100) NOT NULL UNIQUE,
    senha_hash text NOT NULL,
    perfil public.perfil_usuario DEFAULT 'MEMBRO',
    esta_ativo boolean DEFAULT true,
    ultimo_login timestamp with time zone,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE public.membros (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_pessoa uuid NOT NULL REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    data_conversao date,
    data_batismo date,
    data_membro date,
    situacao public.situacao_registro DEFAULT 'ATIVO',
    ministerio character varying(100),
    grupo_pequeno character varying(100),
    dizimista boolean DEFAULT true,
    ofertante boolean DEFAULT true,
    cargo_eclesiastico character varying(100),
    data_consagracao date,
    observacoes text,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE public.funcionarios (
    id_funcionario uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_pessoa uuid NOT NULL REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    matricula character varying(50) UNIQUE,
    cargo character varying(100),
    departamento character varying(100),
    data_admissao date,
    data_demissao date,
    regime_trabalho public.regime_trabalho DEFAULT 'CLT',
    salario_base numeric(10,2),
    banco character varying(100),
    agencia character varying(20),
    conta character varying(50),
    tipo_conta character varying(20),
    chave_pix character varying(100),
    ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

-- FINANCEIRO & CONTABILIDADE
CREATE TABLE public.contas_financeiras (
    id_conta uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    nome character varying(100),
    tipo character varying(50),
    saldo numeric(15,2) DEFAULT 0,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.contas_bancarias (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    nome_conta text NOT NULL,
    tipo_conta text NOT NULL,
    nome_banco text,
    agencia text,
    numero_conta text,
    moeda character varying(3) DEFAULT 'BRL',
    esta_ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE public.plano_contas (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid NOT NULL REFERENCES public.unidades(id_unidade),
    codigo character varying(20) NOT NULL,
    nome character varying(255) NOT NULL,
    natureza public.natureza_conta NOT NULL,
    tipo public.tipo_conta_nivel NOT NULL,
    id_conta_pai uuid REFERENCES public.plano_contas(id),
    saldo_normal public.saldo_normal NOT NULL,
    esta_ativo boolean DEFAULT true
);

CREATE TABLE public.transacoes (
    id_transacao uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    id_pessoa uuid REFERENCES public.pessoas(id_pessoa),
    descricao text NOT NULL,
    valor numeric(15,2) NOT NULL,
    tipo public.tipo_transacao NOT NULL,
    id_conta uuid REFERENCES public.contas_bancarias(id),
    data_transacao date NOT NULL,
    data_vencimento date,
    data_pagamento date,
    situacao public.situacao_transacao DEFAULT 'PENDENTE',
    forma_pagamento text,
    conciliado boolean DEFAULT false,
    criado_por uuid REFERENCES public.usuarios(id_usuario),
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE public.lancamentos_contabeis (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid NOT NULL REFERENCES public.unidades(id_unidade),
    numero_lancamento integer NOT NULL,
    data_lancamento date NOT NULL,
    historico text NOT NULL,
    complemento text,
    valor_debito numeric(15,2) NOT NULL,
    valor_credito numeric(15,2) NOT NULL,
    id_transacao uuid REFERENCES public.transacoes(id_transacao),
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    criado_por character varying(255) NOT NULL,
    situacao character varying(20) DEFAULT 'RASCUNHO'
);

-- FOLHA DE PAGAMENTO & RH
CREATE TABLE public.folha_pagamento (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    id_funcionario uuid REFERENCES public.funcionarios(id_funcionario),
    mes integer NOT NULL CHECK (mes BETWEEN 1 AND 12),
    ano integer NOT NULL CHECK (ano >= 2020),
    data_referencia date NOT NULL,
    salario_base numeric(15,2) DEFAULT 0,
    inss numeric(15,2) DEFAULT 0,
    irrf numeric(15,2) DEFAULT 0,
    fgts numeric(15,2) DEFAULT 0,
    salario_liquido numeric(15,2) DEFAULT 0,
    situacao text DEFAULT 'PROCESSADO',
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE public.calculos_folha (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_funcionario uuid NOT NULL REFERENCES public.funcionarios(id_funcionario),
    mes_competencia character varying(7) NOT NULL,
    salario_bruto numeric(15,2) NOT NULL,
    sindicato_taxa numeric(15,2) DEFAULT 0, -- ✅ Substitui "union " (palavra reservada + espaço)
    farmacia numeric(15,2) DEFAULT 0,
    seguro_vida numeric(15,2) DEFAULT 0,
    inss numeric(15,2) NOT NULL,
    irrf numeric(15,2) NOT NULL,
    fgts numeric(15,2) NOT NULL,
    salario_liquido numeric(15,2) NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.periodos_folha (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid NOT NULL REFERENCES public.unidades(id_unidade),
    mes integer NOT NULL,
    ano integer NOT NULL,
    situacao character varying(20) DEFAULT 'ABERTO',
    data_inicio date NOT NULL,
    data_final date NOT NULL,
    criado_por uuid NOT NULL REFERENCES public.usuarios(id_usuario),
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.afastamentos_funcionarios (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid NOT NULL REFERENCES public.unidades(id_unidade),
    id_funcionario uuid NOT NULL REFERENCES public.funcionarios(id_funcionario),
    tipo public.tipo_afastamento NOT NULL,
    data_inicio date NOT NULL,
    data_final date NOT NULL,
    situacao public.situacao_afastamento DEFAULT 'AGENDADO',
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- PATRIMÔNIO & INVENTÁRIO
CREATE TABLE public.patrimonios (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    nome text NOT NULL,
    descricao text,
    categoria public.tipo_patrimonio NOT NULL,
    data_aquisicao date,
    valor_aquisicao numeric(15,2),
    situacao public.situacao_patrimonio DEFAULT 'ATIVO',
    depreciacao_acumulada numeric(15,2) DEFAULT 0,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE public.contagens_inventario (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid NOT NULL REFERENCES public.unidades(id_unidade),
    data_contagem date NOT NULL,
    situacao character varying(20) DEFAULT 'EM_ANDAMENTO',
    iniciado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    concluido timestamp with time zone
);

CREATE TABLE public.itens_inventario (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_contagem_estoque uuid NOT NULL REFERENCES public.contagens_inventario(id) ON DELETE CASCADE,
    id_patrimonio uuid NOT NULL REFERENCES public.patrimonios(id),
    quantidade_esperada integer NOT NULL,
    quantidade_contada integer NOT NULL,
    diferenca integer NOT NULL,
    condicao character varying(20) NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.ajustes_inventario (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_contagem_estoque uuid NOT NULL REFERENCES public.contagens_inventario(id) ON DELETE CASCADE,
    id_patrimonio uuid NOT NULL REFERENCES public.patrimonios(id),
    tipo_ajuste public.tipo_ajuste_inventario NOT NULL,
    quantidade integer NOT NULL,
    motivo text NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- EVENTOS & VOLUNTÁRIOS
CREATE TABLE public.eventos_igreja (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid NOT NULL REFERENCES public.unidades(id_unidade),
    titulo character varying(255) NOT NULL,
    descricao text,
    data_evento date NOT NULL,
    hora_evento time without time zone NOT NULL,
    local_evento character varying(255) NOT NULL,
    tipo public.tipo_evento NOT NULL,
    recorrente boolean DEFAULT false,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.escalas_voluntarios (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_evento uuid NOT NULL REFERENCES public.eventos_igreja(id) ON DELETE CASCADE,
    ministerio character varying(100) NOT NULL,
    funcao character varying(100) NOT NULL,
    id_voluntario uuid REFERENCES public.pessoas(id_pessoa),
    confirmado boolean DEFAULT false,
    quantidade_necessaria integer DEFAULT 1 NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- PERMISSÕES, AUDITORIA & LGPD
CREATE TABLE public.modulos_permissao (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    codigo character varying(100) NOT NULL UNIQUE,
    nome_modulo character varying(255) NOT NULL,
    categoria character varying(100) NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.permissoes_perfil (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    perfil character varying(50) NOT NULL,
    codigo_modulo character varying(100) NOT NULL REFERENCES public.modulos_permissao(codigo) ON DELETE CASCADE,
    ler boolean DEFAULT false,
    escrever boolean DEFAULT false,
    excluir boolean DEFAULT false,
    gerenciar boolean DEFAULT false,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.logs_auditoria (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid REFERENCES public.unidades(id_unidade),
    id_usuario uuid REFERENCES public.usuarios(id_usuario),
    acao character varying(100) NOT NULL,
    entidade character varying(100) NOT NULL,
    id_entidade uuid,
    data_acao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    endereco_ip inet,
    detalhes jsonb,
    sucesso boolean DEFAULT true
);

CREATE TABLE public.app_audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid,
    usuario_id uuid,
    nome_usuario character varying(255) NOT NULL,
    acao character varying(100) NOT NULL,
    entidade character varying(100) NOT NULL,
    id_entidade character varying(255),
    data_evento timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip character varying(100) NOT NULL,
    detalhes jsonb,
    sucesso boolean DEFAULT true NOT NULL,
    imutavel boolean DEFAULT true NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.politicas_lgpd (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_unidade uuid NOT NULL REFERENCES public.unidades(id_unidade),
    versao character varying(20) NOT NULL,
    titulo character varying(255) NOT NULL,
    conteudo text NOT NULL,
    esta_ativa boolean DEFAULT true,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.logs_consentimento_lgpd (
    id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    id_membro uuid REFERENCES public.membros(id),
    id_funcionario uuid REFERENCES public.funcionarios(id_funcionario),
    id_politica uuid NOT NULL REFERENCES public.politicas_lgpd(id),
    tipo_consentimento character varying(50) NOT NULL,
    concedido boolean NOT NULL,
    endereco_ip inet,
    data_consentimento timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- TRIGGERS & FUNÇÕES
CREATE OR REPLACE FUNCTION public.atualizar_timestamp() RETURNS trigger AS $$
BEGIN NEW.atualizado_em = CURRENT_TIMESTAMP; RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_unidades BEFORE UPDATE ON public.unidades FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();
CREATE TRIGGER trg_pessoas BEFORE UPDATE ON public.pessoas FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();
CREATE TRIGGER trg_usuarios BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();
CREATE TRIGGER trg_membros BEFORE UPDATE ON public.membros FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();
CREATE TRIGGER trg_funcionarios BEFORE UPDATE ON public.funcionarios FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();
CREATE TRIGGER trg_transacoes BEFORE UPDATE ON public.transacoes FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();

CREATE OR REPLACE FUNCTION public.validar_usuario_pessoa() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.membros WHERE id_pessoa = NEW.id_pessoa) OR 
     EXISTS (SELECT 1 FROM public.funcionarios WHERE id_pessoa = NEW.id_pessoa) THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Pessoa não autorizada para acesso ao sistema';
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_usuario BEFORE INSERT ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.validar_usuario_pessoa();

CREATE OR REPLACE FUNCTION public.prevent_app_audit_logs_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'app_audit_logs é imutável: alterações e exclusões não são permitidas';
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_app_audit_logs_delete BEFORE DELETE ON public.app_audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_app_audit_logs_mutation();
CREATE TRIGGER trg_prevent_app_audit_logs_update BEFORE UPDATE ON public.app_audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_app_audit_logs_mutation();

-- VIEWS CONSOLIDADAS
CREATE OR REPLACE VIEW public.funcionarios_ativos AS
SELECT f.id_funcionario AS id, f.matricula, f.cargo, f.departamento, f.data_admissao,
       p.nome, p.cpf, p.email, p.telefone, p.celular, p.whatsapp,
       p.logradouro, p.bairro, p.cidade, p.estado, p.cep,
       u.nome AS nome_unidade,
       CASE WHEN f.data_demissao IS NULL THEN 'ATIVO' ELSE 'INATIVO' END AS situacao_atual
FROM public.funcionarios f
JOIN public.pessoas p ON f.id_pessoa = p.id_pessoa
LEFT JOIN public.unidades u ON f.id_unidade = u.id_unidade
WHERE f.ativo = true;

CREATE OR REPLACE VIEW public.membros_ativos AS
SELECT m.id, m.id_unidade, m.situacao AS situacao_membro, m.ministerio, m.dizimista, m.ofertante,
       p.nome, p.cpf, p.email, p.telefone, p.celular, p.whatsapp,
       p.logradouro, p.bairro, p.cidade, p.estado, p.cep,
       u.nome AS nome_unidade
FROM public.membros m
JOIN public.pessoas p ON m.id_pessoa = p.id_pessoa
LEFT JOIN public.unidades u ON m.id_unidade = u.id_unidade
WHERE m.situacao = 'ATIVO';

CREATE OR REPLACE VIEW public.resumo_financeiro AS
SELECT u.id_unidade, u.nome AS nome_unidade,
       count(t.id_transacao) AS total_transacoes,
       sum(CASE WHEN t.tipo = 'RECEITA' THEN t.valor ELSE 0 END) AS total_receitas,
       sum(CASE WHEN t.tipo = 'DESPESA' THEN t.valor ELSE 0 END) AS total_despesas
FROM public.unidades u
LEFT JOIN public.transacoes t ON u.id_unidade = t.id_unidade
GROUP BY u.id_unidade, u.nome;

-- ÍNDICES ESTRATÉGICOS
CREATE INDEX idx_pessoas_cpf ON public.pessoas(cpf);
CREATE INDEX idx_pessoas_email ON public.pessoas(email);
CREATE INDEX idx_usuarios_login ON public.usuarios(login);
CREATE INDEX idx_usuarios_perfil ON public.usuarios(perfil);
CREATE INDEX idx_membros_pessoa ON public.membros(id_pessoa);
CREATE INDEX idx_funcionarios_pessoa ON public.funcionarios(id_pessoa);
CREATE INDEX idx_transacoes_data ON public.transacoes(data_transacao);
CREATE INDEX idx_transacoes_situacao ON public.transacoes(situacao);
CREATE INDEX idx_logs_auditoria_data ON public.logs_auditoria(data_acao);

COMMENT ON SCHEMA public IS 'Schema principal IgrejaERP - Padronizado PT-BR, normalizado via pessoas, sem duplicidades, palavras reservadas corrigidas';
COMMENT ON TABLE public.pessoas IS 'Fonte única de dados pessoais, contato e endereço. Membros, funcionários e usuários referenciam esta tabela.';
COMMENT ON COLUMN public.pessoas.whatsapp IS 'FLAG booleana. TRUE = o número em "celular" possui WhatsApp ativo. Nunca armazena número.';
COMMENT ON TABLE public.app_audit_logs IS 'Tabela de sistema imutável. Não traduzir prefixo app_ nem alterar estrutura sem aprovação de segurança.';
