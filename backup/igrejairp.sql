--
-- PostgreSQL database cluster dump
--

-- Started on 2026-05-28 10:19:23

\restrict 4aLfqjC8ct5rtr7hb3IPDxoNhpDTiJx1DGINUQchwL7QmmzE09bqJy0wTMjqdaQ

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE adjpa_user;
ALTER ROLE adjpa_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:qyTO69bKgdobgCIA+CeTHw==$2hCNtV2zhxIWqeocntordVfp3X2DHojC6AxCLqNCqeI=:ms4jUhTV5WQQxIDY6ropDmanC/ss0r/p3ccZn6cJ2P0=';
CREATE ROLE desenvolvedor;
ALTER ROLE desenvolvedor WITH SUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:JR6rcb5XvzHWqHCt/dPxrg==$xd5wSmSvT6nTHA7jVklCxgxCIe50f+XYUorC7KFKKXk=:IJt9DgI2OaDvn2+lusBJ5TsRQxZGLIfWvauvZHHu1pI=';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:2s1bmO5Ib1gEBkcCbqcglA==$lnoBcHMyENACvR6Ge6+pCV+77fmQlVayCD08OiqpDW4=:NqdxID/z7OxjRcVXVnBqfb0yD+1j4LDLv+O2uyEAlGM=';

--
-- User Configurations
--








\unrestrict 4aLfqjC8ct5rtr7hb3IPDxoNhpDTiJx1DGINUQchwL7QmmzE09bqJy0wTMjqdaQ

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict eEQIXHtMlR2pFwimru9i67ccYzSz3JS6YHnuL56B32zT4WoFGacYatavrJNVx2u

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-28 10:19:23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2026-05-28 10:19:23

--
-- PostgreSQL database dump complete
--

\unrestrict eEQIXHtMlR2pFwimru9i67ccYzSz3JS6YHnuL56B32zT4WoFGacYatavrJNVx2u

--
-- Database "igrejaerp" dump
--

--
-- PostgreSQL database dump
--

\restrict g88gUfCTrnH9v6Z4Z83dZldbjphc6EHvcIDf32ANFWQVsxAcrrL1aF1oeWh2ucQ

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-28 10:19:23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5485 (class 1262 OID 23191)
-- Name: igrejaerp; Type: DATABASE; Schema: -; Owner: desenvolvedor
--

CREATE DATABASE igrejaerp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';


ALTER DATABASE igrejaerp OWNER TO desenvolvedor;

\unrestrict g88gUfCTrnH9v6Z4Z83dZldbjphc6EHvcIDf32ANFWQVsxAcrrL1aF1oeWh2ucQ
\connect igrejaerp
\restrict g88gUfCTrnH9v6Z4Z83dZldbjphc6EHvcIDf32ANFWQVsxAcrrL1aF1oeWh2ucQ

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5486 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'Schema principal IgrejaERP - Padronizado PT-BR, normalizado via pessoas, sem duplicidades, palavras reservadas corrigidas';


--
-- TOC entry 3 (class 3079 OID 23203)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5488 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 2 (class 3079 OID 23192)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5489 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 947 (class 1247 OID 23278)
-- Name: natureza_conta; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.natureza_conta AS ENUM (
    'ATIVO',
    'PASSIVO',
    'PATRIMONIO_LIQUIDO',
    'RECEITA',
    'DESPESA'
);


ALTER TYPE public.natureza_conta OWNER TO desenvolvedor;

--
-- TOC entry 956 (class 1247 OID 23302)
-- Name: perfil_usuario; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.perfil_usuario AS ENUM (
    'ADMIN',
    'SECRETARIO',
    'TESOUREIRO',
    'PASTOR',
    'RH',
    'FINANCEIRO',
    'DESENVOLVEDOR',
    'MEMBRO'
);


ALTER TYPE public.perfil_usuario OWNER TO desenvolvedor;

--
-- TOC entry 977 (class 1247 OID 23380)
-- Name: regime_trabalho; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.regime_trabalho AS ENUM (
    'CLT',
    'PRO_LABORE',
    'ESTAGIO',
    'AUTONOMO'
);


ALTER TYPE public.regime_trabalho OWNER TO desenvolvedor;

--
-- TOC entry 953 (class 1247 OID 23296)
-- Name: saldo_normal; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.saldo_normal AS ENUM (
    'DEBITO',
    'CREDITO'
);


ALTER TYPE public.saldo_normal OWNER TO desenvolvedor;

--
-- TOC entry 980 (class 1247 OID 23390)
-- Name: situacao_afastamento; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.situacao_afastamento AS ENUM (
    'AGENDADO',
    'ATIVO',
    'CONCLUIDO',
    'CANCELADO'
);


ALTER TYPE public.situacao_afastamento OWNER TO desenvolvedor;

--
-- TOC entry 971 (class 1247 OID 23364)
-- Name: situacao_conciliacao; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.situacao_conciliacao AS ENUM (
    'EM_ANDAMENTO',
    'CONCLUIDA',
    'CANCELADA'
);


ALTER TYPE public.situacao_conciliacao OWNER TO desenvolvedor;

--
-- TOC entry 965 (class 1247 OID 23346)
-- Name: situacao_patrimonio; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.situacao_patrimonio AS ENUM (
    'ATIVO',
    'MANUTENCAO',
    'OCIOSO',
    'BAIXADO',
    'SUCATA'
);


ALTER TYPE public.situacao_patrimonio OWNER TO desenvolvedor;

--
-- TOC entry 938 (class 1247 OID 23250)
-- Name: situacao_registro; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.situacao_registro AS ENUM (
    'ATIVO',
    'INATIVO',
    'PENDENTE',
    'SUSPENSO'
);


ALTER TYPE public.situacao_registro OWNER TO desenvolvedor;

--
-- TOC entry 944 (class 1247 OID 23268)
-- Name: situacao_transacao; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.situacao_transacao AS ENUM (
    'PAGO',
    'PENDENTE',
    'ATRASADO',
    'CANCELADO'
);


ALTER TYPE public.situacao_transacao OWNER TO desenvolvedor;

--
-- TOC entry 935 (class 1247 OID 23242)
-- Name: situacao_unidade; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.situacao_unidade AS ENUM (
    'ATIVO',
    'INATIVO',
    'SUSPENSO'
);


ALTER TYPE public.situacao_unidade OWNER TO desenvolvedor;

--
-- TOC entry 983 (class 1247 OID 23400)
-- Name: tipo_afastamento; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.tipo_afastamento AS ENUM (
    'FERIAS',
    'MEDICO',
    'MATERNIDADE',
    'PATERNIDADE',
    'MILITAR',
    'CASAMENTO',
    'LUTO',
    'NAO_REMUNERADO'
);


ALTER TYPE public.tipo_afastamento OWNER TO desenvolvedor;

--
-- TOC entry 974 (class 1247 OID 23372)
-- Name: tipo_ajuste_inventario; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.tipo_ajuste_inventario AS ENUM (
    'ENTRADA',
    'SAIDA',
    'BAIXA'
);


ALTER TYPE public.tipo_ajuste_inventario OWNER TO desenvolvedor;

--
-- TOC entry 950 (class 1247 OID 23290)
-- Name: tipo_conta_nivel; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.tipo_conta_nivel AS ENUM (
    'SINTETICO',
    'ANALITICO'
);


ALTER TYPE public.tipo_conta_nivel OWNER TO desenvolvedor;

--
-- TOC entry 959 (class 1247 OID 23320)
-- Name: tipo_evento; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.tipo_evento AS ENUM (
    'CULTO',
    'REUNIAO',
    'EVENTO',
    'TREINAMENTO',
    'CONFERENCIA'
);


ALTER TYPE public.tipo_evento OWNER TO desenvolvedor;

--
-- TOC entry 968 (class 1247 OID 23358)
-- Name: tipo_movimentacao; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.tipo_movimentacao AS ENUM (
    'RETIRADA',
    'SUPRIMENTO'
);


ALTER TYPE public.tipo_movimentacao OWNER TO desenvolvedor;

--
-- TOC entry 962 (class 1247 OID 23332)
-- Name: tipo_patrimonio; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.tipo_patrimonio AS ENUM (
    'IMOVEIS',
    'VEICULOS',
    'EQUIPAMENTOS',
    'MOVEIS',
    'COMPUTADORES',
    'MAQUINAS'
);


ALTER TYPE public.tipo_patrimonio OWNER TO desenvolvedor;

--
-- TOC entry 941 (class 1247 OID 23260)
-- Name: tipo_transacao; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.tipo_transacao AS ENUM (
    'RECEITA',
    'DESPESA',
    'TRANSFERENCIA'
);


ALTER TYPE public.tipo_transacao OWNER TO desenvolvedor;

--
-- TOC entry 312 (class 1255 OID 24018)
-- Name: atualizar_timestamp(); Type: FUNCTION; Schema: public; Owner: desenvolvedor
--

CREATE FUNCTION public.atualizar_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW.atualizado_em = CURRENT_TIMESTAMP; RETURN NEW; END;
$$;


ALTER FUNCTION public.atualizar_timestamp() OWNER TO desenvolvedor;

--
-- TOC entry 253 (class 1255 OID 24027)
-- Name: prevent_app_audit_logs_mutation(); Type: FUNCTION; Schema: public; Owner: desenvolvedor
--

CREATE FUNCTION public.prevent_app_audit_logs_mutation() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RAISE EXCEPTION 'app_audit_logs é imutável: alterações e exclusões não são permitidas pela aplicação';
    END;
    $$;


ALTER FUNCTION public.prevent_app_audit_logs_mutation() OWNER TO desenvolvedor;

--
-- TOC entry 313 (class 1255 OID 24025)
-- Name: validar_usuario_pessoa(); Type: FUNCTION; Schema: public; Owner: desenvolvedor
--

CREATE FUNCTION public.validar_usuario_pessoa() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.membros WHERE id_pessoa = NEW.id_pessoa) OR 
     EXISTS (SELECT 1 FROM public.funcionarios WHERE id_pessoa = NEW.id_pessoa) THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Pessoa não autorizada para acesso ao sistema';
END; $$;


ALTER FUNCTION public.validar_usuario_pessoa() OWNER TO desenvolvedor;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 23736)
-- Name: afastamentos_funcionarios; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.afastamentos_funcionarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid NOT NULL,
    id_funcionario uuid NOT NULL,
    tipo public.tipo_afastamento NOT NULL,
    data_inicio date NOT NULL,
    data_final date NOT NULL,
    situacao public.situacao_afastamento DEFAULT 'AGENDADO'::public.situacao_afastamento,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.afastamentos_funcionarios OWNER TO desenvolvedor;

--
-- TOC entry 238 (class 1259 OID 23821)
-- Name: ajustes_inventario; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.ajustes_inventario (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_contagem_estoque uuid NOT NULL,
    id_patrimonio uuid NOT NULL,
    tipo_ajuste public.tipo_ajuste_inventario NOT NULL,
    quantidade integer NOT NULL,
    motivo text NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ajustes_inventario OWNER TO desenvolvedor;

--
-- TOC entry 244 (class 1259 OID 23949)
-- Name: app_audit_logs; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.app_audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
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
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    hash_anterior character varying(255),
    hash character varying(255),
    nome_entidade character varying(255),
    agente_usuario text,
    mensagem_erro text
);


ALTER TABLE public.app_audit_logs OWNER TO desenvolvedor;

--
-- TOC entry 5490 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE app_audit_logs; Type: COMMENT; Schema: public; Owner: desenvolvedor
--

COMMENT ON TABLE public.app_audit_logs IS 'Tabela de sistema imutável. Não traduzir prefixo app_ nem alterar estrutura sem aprovação de segurança.';


--
-- TOC entry 250 (class 1259 OID 24055)
-- Name: app_permission_modules; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.app_permission_modules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    codigo character varying(100) NOT NULL,
    nome_modulo character varying(255) NOT NULL,
    categoria character varying(100) NOT NULL,
    descricao text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.app_permission_modules OWNER TO desenvolvedor;

--
-- TOC entry 251 (class 1259 OID 24071)
-- Name: app_role_permissions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.app_role_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role character varying(50) NOT NULL,
    codigo_modulo character varying(100) NOT NULL,
    ler boolean DEFAULT false,
    escrever boolean DEFAULT false,
    excluir boolean DEFAULT false,
    gerenciar boolean DEFAULT false,
    administrador boolean DEFAULT false,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.app_role_permissions OWNER TO desenvolvedor;

--
-- TOC entry 252 (class 1259 OID 24094)
-- Name: app_user_permissions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.app_user_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid NOT NULL,
    codigo_modulo character varying(100) NOT NULL,
    ler boolean,
    escrever boolean,
    excluir boolean,
    gerenciar boolean,
    administrador boolean,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.app_user_permissions OWNER TO desenvolvedor;

--
-- TOC entry 232 (class 1259 OID 23687)
-- Name: calculos_folha; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.calculos_folha (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_funcionario uuid NOT NULL,
    mes_competencia character varying(7) NOT NULL,
    salario_bruto numeric(15,2) NOT NULL,
    sindicato_taxa numeric(15,2) DEFAULT 0,
    farmacia numeric(15,2) DEFAULT 0,
    seguro_vida numeric(15,2) DEFAULT 0,
    inss numeric(15,2) NOT NULL,
    irrf numeric(15,2) NOT NULL,
    fgts numeric(15,2) NOT NULL,
    salario_liquido numeric(15,2) NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.calculos_folha OWNER TO desenvolvedor;

--
-- TOC entry 236 (class 1259 OID 23781)
-- Name: contagens_inventario; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.contagens_inventario (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid NOT NULL,
    data_contagem date NOT NULL,
    situacao character varying(20) DEFAULT 'EM_ANDAMENTO'::character varying,
    iniciado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    concluido timestamp with time zone
);


ALTER TABLE public.contagens_inventario OWNER TO desenvolvedor;

--
-- TOC entry 227 (class 1259 OID 23546)
-- Name: contas_bancarias; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.contas_bancarias (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    nome_conta text NOT NULL,
    tipo_conta text NOT NULL,
    nome_banco text,
    agencia text,
    numero_conta text,
    moeda character varying(3) DEFAULT 'BRL'::character varying,
    esta_ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contas_bancarias OWNER TO desenvolvedor;

--
-- TOC entry 226 (class 1259 OID 23531)
-- Name: contas_financeiras; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.contas_financeiras (
    id_conta uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    nome character varying(100),
    tipo character varying(50),
    saldo numeric(15,2) DEFAULT 0,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contas_financeiras OWNER TO desenvolvedor;

--
-- TOC entry 240 (class 1259 OID 23869)
-- Name: escalas_voluntarios; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.escalas_voluntarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_evento uuid NOT NULL,
    ministerio character varying(100) NOT NULL,
    funcao character varying(100) NOT NULL,
    id_voluntario uuid,
    confirmado boolean DEFAULT false,
    quantidade_necessaria integer DEFAULT 1 NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.escalas_voluntarios OWNER TO desenvolvedor;

--
-- TOC entry 239 (class 1259 OID 23846)
-- Name: eventos_igreja; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.eventos_igreja (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid NOT NULL,
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


ALTER TABLE public.eventos_igreja OWNER TO desenvolvedor;

--
-- TOC entry 231 (class 1259 OID 23655)
-- Name: folha_pagamento; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.folha_pagamento (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    id_funcionario uuid,
    mes integer NOT NULL,
    ano integer NOT NULL,
    data_referencia date NOT NULL,
    salario_base numeric(15,2) DEFAULT 0,
    inss numeric(15,2) DEFAULT 0,
    irrf numeric(15,2) DEFAULT 0,
    fgts numeric(15,2) DEFAULT 0,
    salario_liquido numeric(15,2) DEFAULT 0,
    situacao text DEFAULT 'PROCESSADO'::text,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now(),
    CONSTRAINT folha_pagamento_ano_check CHECK ((ano >= 2020)),
    CONSTRAINT folha_pagamento_mes_check CHECK (((mes >= 1) AND (mes <= 12)))
);


ALTER TABLE public.folha_pagamento OWNER TO desenvolvedor;

--
-- TOC entry 225 (class 1259 OID 23505)
-- Name: funcionarios; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.funcionarios (
    id_funcionario uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_pessoa uuid NOT NULL,
    id_unidade uuid,
    matricula character varying(50),
    cargo character varying(100),
    departamento character varying(100),
    data_admissao date,
    data_demissao date,
    regime_trabalho public.regime_trabalho DEFAULT 'CLT'::public.regime_trabalho,
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


ALTER TABLE public.funcionarios OWNER TO desenvolvedor;

--
-- TOC entry 222 (class 1259 OID 23434)
-- Name: pessoas; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.pessoas (
    id_pessoa uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    nome character varying(255) NOT NULL,
    cpf character varying(14),
    rg character varying(20),
    data_nascimento date,
    sexo character varying(20),
    estado_civil character varying(50),
    email character varying(255),
    telefone character varying(20),
    celular character varying(20),
    whatsapp boolean DEFAULT false,
    logradouro character varying(255),
    numero character varying(20),
    complemento character varying(100),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    cep character varying(15),
    pais character varying(100) DEFAULT 'Brasil'::character varying,
    tipo_sanguineo character varying(10),
    contato_emergencia character varying(255),
    pcd boolean DEFAULT false,
    tipo_deficiencia character varying(255),
    ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pessoas OWNER TO desenvolvedor;

--
-- TOC entry 5491 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE pessoas; Type: COMMENT; Schema: public; Owner: desenvolvedor
--

COMMENT ON TABLE public.pessoas IS 'Fonte única de dados pessoais, contato e endereço. Membros, funcionários e usuários referenciam esta tabela.';


--
-- TOC entry 5492 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN pessoas.whatsapp; Type: COMMENT; Schema: public; Owner: desenvolvedor
--

COMMENT ON COLUMN public.pessoas.whatsapp IS 'FLAG booleana. TRUE = o número em "celular" possui WhatsApp ativo. Nunca armazena número.';


--
-- TOC entry 221 (class 1259 OID 23417)
-- Name: unidades; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.unidades (
    id_unidade uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(255) NOT NULL,
    cnpj character varying(20),
    telefone character varying(20),
    email character varying(255),
    logradouro character varying(255),
    numero character varying(20),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    cep character varying(15),
    pais character varying(100) DEFAULT 'Brasil'::character varying,
    situacao public.situacao_unidade DEFAULT 'ATIVO'::public.situacao_unidade,
    ativo boolean DEFAULT true,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.unidades OWNER TO desenvolvedor;

--
-- TOC entry 247 (class 1259 OID 24030)
-- Name: funcionarios_ativos; Type: VIEW; Schema: public; Owner: desenvolvedor
--

CREATE VIEW public.funcionarios_ativos AS
 SELECT f.id_funcionario AS id,
    f.matricula,
    f.cargo,
    f.departamento,
    f.data_admissao,
    p.nome,
    p.cpf,
    p.email,
    p.telefone,
    p.celular,
    p.whatsapp,
    p.logradouro,
    p.bairro,
    p.cidade,
    p.estado,
    p.cep,
    u.nome AS nome_unidade,
        CASE
            WHEN (f.data_demissao IS NULL) THEN 'ATIVO'::text
            ELSE 'INATIVO'::text
        END AS situacao_atual
   FROM ((public.funcionarios f
     JOIN public.pessoas p ON ((f.id_pessoa = p.id_pessoa)))
     LEFT JOIN public.unidades u ON ((f.id_unidade = u.id_unidade)))
  WHERE (f.ativo = true);


ALTER VIEW public.funcionarios_ativos OWNER TO desenvolvedor;

--
-- TOC entry 237 (class 1259 OID 23797)
-- Name: itens_inventario; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.itens_inventario (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_contagem_estoque uuid NOT NULL,
    id_patrimonio uuid NOT NULL,
    quantidade_esperada integer NOT NULL,
    quantidade_contada integer NOT NULL,
    diferenca integer NOT NULL,
    condicao character varying(20) NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.itens_inventario OWNER TO desenvolvedor;

--
-- TOC entry 230 (class 1259 OID 23627)
-- Name: lancamentos_contabeis; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.lancamentos_contabeis (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid NOT NULL,
    numero_lancamento integer NOT NULL,
    data_lancamento date NOT NULL,
    historico text NOT NULL,
    complemento text,
    valor_debito numeric(15,2) NOT NULL,
    valor_credito numeric(15,2) NOT NULL,
    id_transacao uuid,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    criado_por character varying(255) NOT NULL,
    situacao character varying(20) DEFAULT 'RASCUNHO'::character varying
);


ALTER TABLE public.lancamentos_contabeis OWNER TO desenvolvedor;

--
-- TOC entry 243 (class 1259 OID 23926)
-- Name: logs_auditoria; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.logs_auditoria (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    id_usuario uuid,
    acao character varying(100) NOT NULL,
    entidade character varying(100) NOT NULL,
    id_entidade uuid,
    data_acao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    endereco_ip inet,
    detalhes jsonb,
    sucesso boolean DEFAULT true
);


ALTER TABLE public.logs_auditoria OWNER TO desenvolvedor;

--
-- TOC entry 246 (class 1259 OID 23990)
-- Name: logs_consentimento_lgpd; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.logs_consentimento_lgpd (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_membro uuid,
    id_funcionario uuid,
    id_politica uuid NOT NULL,
    tipo_consentimento character varying(50) NOT NULL,
    concedido boolean NOT NULL,
    endereco_ip inet,
    data_consentimento timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.logs_consentimento_lgpd OWNER TO desenvolvedor;

--
-- TOC entry 224 (class 1259 OID 23480)
-- Name: membros; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.membros (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_pessoa uuid NOT NULL,
    id_unidade uuid,
    data_conversao date,
    data_batismo date,
    data_membro date,
    situacao public.situacao_registro DEFAULT 'ATIVO'::public.situacao_registro,
    ministerio character varying(100),
    grupo_pequeno character varying(100),
    dizimista boolean DEFAULT true,
    ofertante boolean DEFAULT true,
    cargo_eclesiastico character varying(100),
    data_consagracao date,
    observacoes text,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now(),
    dados_perfil jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.membros OWNER TO desenvolvedor;

--
-- TOC entry 248 (class 1259 OID 24035)
-- Name: membros_ativos; Type: VIEW; Schema: public; Owner: desenvolvedor
--

CREATE VIEW public.membros_ativos AS
 SELECT m.id,
    m.id_unidade,
    m.situacao AS situacao_membro,
    m.ministerio,
    m.dizimista,
    m.ofertante,
    p.nome,
    p.cpf,
    p.email,
    p.telefone,
    p.celular,
    p.whatsapp,
    p.logradouro,
    p.bairro,
    p.cidade,
    p.estado,
    p.cep,
    u.nome AS nome_unidade
   FROM ((public.membros m
     JOIN public.pessoas p ON ((m.id_pessoa = p.id_pessoa)))
     LEFT JOIN public.unidades u ON ((m.id_unidade = u.id_unidade)))
  WHERE (m.situacao = 'ATIVO'::public.situacao_registro);


ALTER VIEW public.membros_ativos OWNER TO desenvolvedor;

--
-- TOC entry 241 (class 1259 OID 23893)
-- Name: modulos_permissao; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.modulos_permissao (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    codigo character varying(100) NOT NULL,
    nome_modulo character varying(255) NOT NULL,
    categoria character varying(100) NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.modulos_permissao OWNER TO desenvolvedor;

--
-- TOC entry 235 (class 1259 OID 23761)
-- Name: patrimonios; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.patrimonios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    nome text NOT NULL,
    descricao text,
    categoria public.tipo_patrimonio NOT NULL,
    data_aquisicao date,
    valor_aquisicao numeric(15,2),
    situacao public.situacao_patrimonio DEFAULT 'ATIVO'::public.situacao_patrimonio,
    depreciacao_acumulada numeric(15,2) DEFAULT 0,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);


ALTER TABLE public.patrimonios OWNER TO desenvolvedor;

--
-- TOC entry 233 (class 1259 OID 23711)
-- Name: periodos_folha; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.periodos_folha (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid NOT NULL,
    mes integer NOT NULL,
    ano integer NOT NULL,
    situacao character varying(20) DEFAULT 'ABERTO'::character varying,
    data_inicio date NOT NULL,
    data_final date NOT NULL,
    criado_por uuid NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.periodos_folha OWNER TO desenvolvedor;

--
-- TOC entry 242 (class 1259 OID 23906)
-- Name: permissoes_perfil; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.permissoes_perfil (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    perfil character varying(50) NOT NULL,
    codigo_modulo character varying(100) NOT NULL,
    ler boolean DEFAULT false,
    escrever boolean DEFAULT false,
    excluir boolean DEFAULT false,
    gerenciar boolean DEFAULT false,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permissoes_perfil OWNER TO desenvolvedor;

--
-- TOC entry 228 (class 1259 OID 23566)
-- Name: plano_contas; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.plano_contas (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid NOT NULL,
    codigo character varying(20) NOT NULL,
    nome character varying(255) NOT NULL,
    natureza public.natureza_conta NOT NULL,
    tipo public.tipo_conta_nivel NOT NULL,
    id_conta_pai uuid,
    saldo_normal public.saldo_normal NOT NULL,
    esta_ativo boolean DEFAULT true
);


ALTER TABLE public.plano_contas OWNER TO desenvolvedor;

--
-- TOC entry 245 (class 1259 OID 23970)
-- Name: politicas_lgpd; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.politicas_lgpd (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid NOT NULL,
    versao character varying(20) NOT NULL,
    titulo character varying(255) NOT NULL,
    conteudo text NOT NULL,
    esta_ativa boolean DEFAULT true,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.politicas_lgpd OWNER TO desenvolvedor;

--
-- TOC entry 229 (class 1259 OID 23590)
-- Name: transacoes; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.transacoes (
    id_transacao uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    id_pessoa uuid,
    descricao text NOT NULL,
    valor numeric(15,2) NOT NULL,
    tipo public.tipo_transacao NOT NULL,
    id_conta uuid,
    data_transacao date NOT NULL,
    data_vencimento date,
    data_pagamento date,
    situacao public.situacao_transacao DEFAULT 'PENDENTE'::public.situacao_transacao,
    forma_pagamento text,
    conciliado boolean DEFAULT false,
    criado_por uuid,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);


ALTER TABLE public.transacoes OWNER TO desenvolvedor;

--
-- TOC entry 249 (class 1259 OID 24040)
-- Name: resumo_financeiro; Type: VIEW; Schema: public; Owner: desenvolvedor
--

CREATE VIEW public.resumo_financeiro AS
 SELECT u.id_unidade,
    u.nome AS nome_unidade,
    count(t.id_transacao) AS total_transacoes,
    sum(
        CASE
            WHEN (t.tipo = 'RECEITA'::public.tipo_transacao) THEN t.valor
            ELSE (0)::numeric
        END) AS total_receitas,
    sum(
        CASE
            WHEN (t.tipo = 'DESPESA'::public.tipo_transacao) THEN t.valor
            ELSE (0)::numeric
        END) AS total_despesas
   FROM (public.unidades u
     LEFT JOIN public.transacoes t ON ((u.id_unidade = t.id_unidade)))
  GROUP BY u.id_unidade, u.nome;


ALTER VIEW public.resumo_financeiro OWNER TO desenvolvedor;

--
-- TOC entry 223 (class 1259 OID 23457)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.usuarios (
    id_usuario uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_pessoa uuid NOT NULL,
    login character varying(100) NOT NULL,
    senha_hash text NOT NULL,
    perfil public.perfil_usuario DEFAULT 'MEMBRO'::public.perfil_usuario,
    esta_ativo boolean DEFAULT true,
    ultimo_login timestamp with time zone,
    criado_em timestamp with time zone DEFAULT now(),
    atualizado_em timestamp with time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO desenvolvedor;

--
-- TOC entry 5464 (class 0 OID 23736)
-- Dependencies: 234
-- Data for Name: afastamentos_funcionarios; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.afastamentos_funcionarios (id, id_unidade, id_funcionario, tipo, data_inicio, data_final, situacao, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5468 (class 0 OID 23821)
-- Dependencies: 238
-- Data for Name: ajustes_inventario; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.ajustes_inventario (id, id_contagem_estoque, id_patrimonio, tipo_ajuste, quantidade, motivo, criado) FROM stdin;
\.


--
-- TOC entry 5474 (class 0 OID 23949)
-- Dependencies: 244
-- Data for Name: app_audit_logs; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.app_audit_logs (id, id_unidade, usuario_id, nome_usuario, acao, entidade, id_entidade, data_evento, ip, detalhes, sucesso, imutavel, criado, hash_anterior, hash, nome_entidade, agente_usuario, mensagem_erro) FROM stdin;
5df2e326-d143-4639-a397-4f7d24f3e4f2	00000000-0000-0000-0000-000000000001	05e5af65-a73d-45d9-b075-8fb27d2c7eda	Desenvolvedor Master	USER_LOGIN	User	05e5af65-a73d-45d9-b075-8fb27d2c7eda	2026-05-27 18:27:13.082-03	127.0.0.1	null	t	t	2026-05-27 18:27:13.091505-03	\N	-406345e3	Desenvolvedor Master	\N	\N
\.


--
-- TOC entry 5477 (class 0 OID 24055)
-- Dependencies: 250
-- Data for Name: app_permission_modules; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.app_permission_modules (id, codigo, nome_modulo, categoria, descricao, criado, atualizado) FROM stdin;
31df4eac-8c87-42a9-8d16-688ab3723ec7	finance	Financeiro	finance	Lançamentos financeiros e tesouraria	2026-05-27 18:23:07.373333-03	2026-05-27 18:26:58.833509-03
e02546bd-6814-47d8-bef3-e6db46d5fa88	treasury	Tesouraria	finance	Fluxo de caixa, investimentos e alertas	2026-05-27 18:23:07.375717-03	2026-05-27 18:26:58.836111-03
1f28b1f7-179c-4894-8e98-4b78ba93def3	bank_reconciliation	Conciliação Bancária	finance	Importação e conciliação de extratos	2026-05-27 18:23:07.378483-03	2026-05-27 18:26:58.838862-03
97259cfc-8fd5-45b3-83b3-63113a111e8a	bank_accounts	Contas Bancárias	finance	Gestão de contas bancárias e saldos	2026-05-27 18:23:07.380858-03	2026-05-27 18:26:58.841622-03
0549e895-4d30-4f2d-a93b-fb5ee47e1ff9	assets	Patrimônio	assets	Cadastro e controle de bens	2026-05-27 18:23:07.383269-03	2026-05-27 18:26:58.844354-03
e1060a42-21f8-4047-832a-1f637317df94	hr	Recursos Humanos	hr	Avaliações, RH e desenvolvimento	2026-05-27 18:23:07.385836-03	2026-05-27 18:26:58.846984-03
03233bce-3f63-4178-a5bd-815bc0f0bcc6	employees	Funcionários	hr	Cadastro de colaboradores	2026-05-27 18:23:07.388064-03	2026-05-27 18:26:58.849711-03
decc9d46-cf48-4a1d-9f4f-63f323120926	leaves	Afastamentos	hr	Férias e afastamentos	2026-05-27 18:23:07.390641-03	2026-05-27 18:26:58.852625-03
df30dcd0-913d-4a08-926f-80ac0898e0e1	payroll	Folha de Pagamento	hr	Processamento de folha	2026-05-27 18:23:07.393412-03	2026-05-27 18:26:58.855349-03
5f628ea1-f48c-4729-8107-b8a3eeb30f6e	events	Eventos	operations	Agenda e eventos da igreja	2026-05-27 18:23:07.395921-03	2026-05-27 18:26:58.857922-03
c65e6329-f8a9-4027-9529-2642b51b3138	communication	Comunicação	operations	Envio de campanhas e notificações	2026-05-27 18:23:07.39833-03	2026-05-27 18:26:58.860676-03
31f24722-c40f-4052-b9b0-aef576c74f54	reports	Relatórios	reports	Exportações e relatórios	2026-05-27 18:23:07.40032-03	2026-05-27 18:26:58.863412-03
afdf0000-d16f-4177-ae3b-a4b5562b7f10	audit	Auditoria	security	Logs e trilha de auditoria	2026-05-27 18:23:07.402575-03	2026-05-27 18:26:58.866335-03
28945238-de3a-4270-9a00-30b30e536457	portal	Portal do Membro	portal	Portal de autoatendimento do membro	2026-05-27 18:23:07.404524-03	2026-05-27 18:26:58.869431-03
14123eea-5b53-4f07-b4ad-33a8f0935036	settings	Configurações	admin	Parâmetros globais da aplicação	2026-05-27 18:23:07.406558-03	2026-05-27 18:26:58.872387-03
28a59786-b967-4e93-bd6b-f8eb7a3f7993	users	Usuários	admin	Cadastro de usuários do sistema	2026-05-27 18:23:07.409189-03	2026-05-27 18:26:58.875077-03
5da88415-44c0-494c-9f78-c1488ee5fd9c	permissions	Permissões	admin	Configuração de perfis e acessos	2026-05-27 18:23:07.411889-03	2026-05-27 18:26:58.877704-03
7468aacc-5dca-4396-907a-53246527ac2e	dashboard	Dashboard	general	Acesso ao painel geral	2026-05-27 18:23:07.357268-03	2026-05-27 18:26:58.822828-03
15b5a8ce-22d3-4eaa-8d72-a3e019b7e5b7	members	Membros	people	Cadastro e gestão de membros	2026-05-27 18:23:07.371054-03	2026-05-27 18:26:58.830559-03
\.


--
-- TOC entry 5478 (class 0 OID 24071)
-- Dependencies: 251
-- Data for Name: app_role_permissions; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.app_role_permissions (id, role, codigo_modulo, ler, escrever, excluir, gerenciar, administrador, criado, atualizado) FROM stdin;
0c95bd78-ec5e-4e62-8ebd-40bf946a9f41	DEVELOPER	treasury	t	t	t	t	t	2026-05-27 18:23:07.427882-03	2026-05-27 18:26:58.889104-03
189d0f2a-0233-4cf8-bfcc-03d0be866e31	DEVELOPER	bank_reconciliation	t	t	t	t	t	2026-05-27 18:23:07.43062-03	2026-05-27 18:26:58.892179-03
8516a205-450f-4cf3-afad-0943b8630656	DEVELOPER	bank_accounts	t	t	t	t	t	2026-05-27 18:23:07.432915-03	2026-05-27 18:26:58.894846-03
932a9fa1-4a09-4e35-b02e-99d299f92d3c	DEVELOPER	assets	t	t	t	t	t	2026-05-27 18:23:07.435597-03	2026-05-27 18:26:58.897707-03
bde53b11-bd0f-43a7-883b-81d57d5d9359	DEVELOPER	hr	t	t	t	t	t	2026-05-27 18:23:07.438095-03	2026-05-27 18:26:58.900715-03
71331ff2-0944-498c-9009-4e2fe70ed22d	DEVELOPER	employees	t	t	t	t	t	2026-05-27 18:23:07.440707-03	2026-05-27 18:26:58.90357-03
60248966-aef5-400d-8635-3036a99cad71	DEVELOPER	leaves	t	t	t	t	t	2026-05-27 18:23:07.443272-03	2026-05-27 18:26:58.906266-03
ad6a1714-6b80-4fae-8bd7-5d073e78936f	DEVELOPER	payroll	t	t	t	t	t	2026-05-27 18:23:07.44574-03	2026-05-27 18:26:58.90897-03
b7c37055-ccbe-4a82-9751-de4dc4dedaa9	DEVELOPER	events	t	t	t	t	t	2026-05-27 18:23:07.448227-03	2026-05-27 18:26:58.91177-03
99d69f1d-e1c4-4ff6-9f72-f62a06df664c	DEVELOPER	communication	t	t	t	t	t	2026-05-27 18:23:07.450672-03	2026-05-27 18:26:58.914485-03
da32d834-3676-4e03-9389-ef3f408eeacc	DEVELOPER	reports	t	t	t	t	t	2026-05-27 18:23:07.452676-03	2026-05-27 18:26:58.918029-03
278aef06-ebca-48af-b32a-1c88de897a4b	DEVELOPER	audit	t	t	t	t	t	2026-05-27 18:23:07.454739-03	2026-05-27 18:26:58.920792-03
5f41e707-6621-46ab-9bb4-7bfeeb17d992	DEVELOPER	portal	t	t	t	t	t	2026-05-27 18:23:07.45737-03	2026-05-27 18:26:58.923503-03
0237d943-4e98-4e8a-b22e-c838b97c1f90	DEVELOPER	settings	t	t	t	t	t	2026-05-27 18:23:07.459918-03	2026-05-27 18:26:58.9262-03
9a127325-618b-4ab4-86c1-1858de6ce0fc	DEVELOPER	users	t	t	t	t	t	2026-05-27 18:23:07.462491-03	2026-05-27 18:26:58.929094-03
797c13b8-9ad6-4fb3-a7bd-3b291c9a89a8	DEVELOPER	permissions	t	t	t	t	t	2026-05-27 18:23:07.465078-03	2026-05-27 18:26:58.931898-03
0ae89d19-bf22-4cfa-b198-abdbf575cc05	ADMIN	dashboard	t	t	t	t	t	2026-05-27 18:23:07.467676-03	2026-05-27 18:26:58.934801-03
9a819c74-0319-44e5-ac6e-a3c13ff56183	ADMIN	members	t	t	t	t	t	2026-05-27 18:23:07.470235-03	2026-05-27 18:26:58.937588-03
f4379fb8-4061-4606-87e7-d4e0814ddeff	ADMIN	treasury	t	t	t	t	t	2026-05-27 18:23:07.474903-03	2026-05-27 18:26:58.943294-03
56f949ce-29b3-4776-ae37-2b189fad00de	ADMIN	bank_reconciliation	t	t	t	t	t	2026-05-27 18:23:07.477514-03	2026-05-27 18:26:58.946238-03
7dd318cc-870b-4b27-84a0-9de672ac6b4d	ADMIN	bank_accounts	t	t	t	t	t	2026-05-27 18:23:07.480193-03	2026-05-27 18:26:58.948985-03
42fda2cb-6aac-46ec-a2eb-23ad7aa7541e	ADMIN	assets	t	t	t	t	t	2026-05-27 18:23:07.482777-03	2026-05-27 18:26:58.951921-03
ab8b3951-0552-4e3a-8d0d-c657cce6c42e	ADMIN	hr	t	t	t	t	t	2026-05-27 18:23:07.485282-03	2026-05-27 18:26:58.955047-03
2abe3e35-a9f5-42d3-b441-246c05011042	ADMIN	employees	t	t	t	t	t	2026-05-27 18:23:07.487828-03	2026-05-27 18:26:58.957817-03
cf74f9a8-2959-44ca-b180-1701cff4d404	ADMIN	leaves	t	t	t	t	t	2026-05-27 18:23:07.490364-03	2026-05-27 18:26:58.96068-03
63b3d889-0045-44eb-8603-78bd2f8e4a1b	ADMIN	payroll	t	t	t	t	t	2026-05-27 18:23:07.493186-03	2026-05-27 18:26:58.963361-03
4d87ca80-8f97-49e7-88a3-68541fbe7b56	ADMIN	events	t	t	t	t	t	2026-05-27 18:23:07.495997-03	2026-05-27 18:26:58.96622-03
cb80a994-44bc-422c-856d-8aa86758ecd3	ADMIN	communication	t	t	t	t	t	2026-05-27 18:23:07.49866-03	2026-05-27 18:26:58.969491-03
94c0a02a-54f2-4550-a1d4-e61dfbae5ba1	ADMIN	reports	t	t	t	t	t	2026-05-27 18:23:07.501127-03	2026-05-27 18:26:58.972495-03
238d2433-4a72-48e3-9a3a-428ef2b28b25	ADMIN	audit	t	t	t	t	t	2026-05-27 18:23:07.503573-03	2026-05-27 18:26:58.975409-03
1f8536ab-d866-4557-a9c5-621df1e01adb	ADMIN	portal	t	t	t	t	t	2026-05-27 18:23:07.506017-03	2026-05-27 18:26:58.978221-03
ac67afbd-c637-4746-8364-53f252cbab57	ADMIN	settings	t	t	t	t	t	2026-05-27 18:23:07.508416-03	2026-05-27 18:26:58.98086-03
f5a864b7-b700-4865-8927-935ebe90fd8f	ADMIN	users	t	t	t	t	t	2026-05-27 18:23:07.510942-03	2026-05-27 18:26:58.983472-03
370d6fa8-81e8-4baf-ae48-4c81b66e68e6	ADMIN	permissions	t	t	t	t	t	2026-05-27 18:23:07.513518-03	2026-05-27 18:26:58.986256-03
6d438504-dfb4-47a8-a648-8de008f655e5	TREASURER	dashboard	t	t	f	f	f	2026-05-27 18:23:07.515986-03	2026-05-27 18:26:58.989026-03
0e38f5a3-c406-4ab6-ad82-9d4947ce4bc3	TREASURER	members	f	f	f	f	f	2026-05-27 18:23:07.518506-03	2026-05-27 18:26:58.9918-03
efb51a0b-f0a4-40dc-b5a8-b3b90abb4cf5	TREASURER	finance	t	t	f	f	f	2026-05-27 18:23:07.520975-03	2026-05-27 18:26:58.994565-03
a8113c5a-d281-4b8d-ae88-a93c8e28c53a	TREASURER	treasury	t	t	f	f	f	2026-05-27 18:23:07.523453-03	2026-05-27 18:26:58.997284-03
c5a8487f-f38b-4efa-b55e-2cdc05f2d2cf	TREASURER	bank_accounts	t	t	f	f	f	2026-05-27 18:23:07.527428-03	2026-05-27 18:26:59.002591-03
a7c3ccec-8ec5-42b4-88f2-48e06ee1473b	TREASURER	assets	f	f	f	f	f	2026-05-27 18:23:07.529464-03	2026-05-27 18:26:59.00517-03
47058483-41b9-4b95-932a-8bc6ef33785e	TREASURER	hr	f	f	f	f	f	2026-05-27 18:23:07.531502-03	2026-05-27 18:26:59.007795-03
8fdfa6b9-bd0b-4b1b-89c9-dad18f91d9e4	TREASURER	employees	f	f	f	f	f	2026-05-27 18:23:07.533526-03	2026-05-27 18:26:59.010466-03
8d071f58-fed7-4bca-a20b-c429ac2f03e5	TREASURER	leaves	f	f	f	f	f	2026-05-27 18:23:07.535538-03	2026-05-27 18:26:59.01321-03
f9cd3076-16fb-4d0f-b64e-fa149518df49	TREASURER	payroll	f	f	f	f	f	2026-05-27 18:23:07.537649-03	2026-05-27 18:26:59.016088-03
893b3603-d04c-424d-8327-40ce51eeca55	TREASURER	events	f	f	f	f	f	2026-05-27 18:23:07.539756-03	2026-05-27 18:26:59.018781-03
3099dac3-4a72-4fe0-9593-ec85f7840177	TREASURER	communication	f	f	f	f	f	2026-05-27 18:23:07.541721-03	2026-05-27 18:26:59.021463-03
8a2d12db-c491-426b-9190-122dff702350	TREASURER	reports	t	t	f	f	f	2026-05-27 18:23:07.544231-03	2026-05-27 18:26:59.024111-03
c29176ea-9156-4166-a7cd-2ca14219b9c2	TREASURER	audit	f	f	f	f	f	2026-05-27 18:23:07.547146-03	2026-05-27 18:26:59.026855-03
d5515780-a30f-4509-a065-adf163690ee3	TREASURER	portal	f	f	f	f	f	2026-05-27 18:23:07.550071-03	2026-05-27 18:26:59.029621-03
502de2d3-dd1c-4f20-b63a-d6e71af03392	TREASURER	settings	f	f	f	f	f	2026-05-27 18:23:07.552898-03	2026-05-27 18:26:59.032242-03
e9b0b49f-0d06-4abb-99eb-6950cc4ff168	TREASURER	users	f	f	f	f	f	2026-05-27 18:23:07.555082-03	2026-05-27 18:26:59.034888-03
d07d27de-f6ed-4475-97df-34c34a1b197f	TREASURER	permissions	f	f	f	f	f	2026-05-27 18:23:07.557047-03	2026-05-27 18:26:59.037701-03
885eb2b2-98cc-45bb-8301-bb6fda854f20	SECRETARY	dashboard	t	t	f	f	f	2026-05-27 18:23:07.559216-03	2026-05-27 18:26:59.040404-03
cedb8389-1255-40cb-9aeb-0542690ec785	SECRETARY	members	t	t	f	f	f	2026-05-27 18:23:07.56126-03	2026-05-27 18:26:59.043275-03
3b2c15a2-2254-4053-bb5c-92ba2555f50b	SECRETARY	finance	f	f	f	f	f	2026-05-27 18:23:07.563365-03	2026-05-27 18:26:59.045962-03
df58c90a-5613-44d1-80f2-e76eae6bcf23	SECRETARY	treasury	f	f	f	f	f	2026-05-27 18:23:07.565538-03	2026-05-27 18:26:59.048732-03
30d69bd1-926e-4ff3-9dde-612075206f22	SECRETARY	bank_reconciliation	f	f	f	f	f	2026-05-27 18:23:07.5675-03	2026-05-27 18:26:59.051378-03
5a411203-8b1e-4ae3-aa51-05cf2923fcd1	SECRETARY	bank_accounts	f	f	f	f	f	2026-05-27 18:23:07.56951-03	2026-05-27 18:26:59.054083-03
515fe8d0-ba68-4be4-ad18-d77cd9ff66b9	SECRETARY	assets	f	f	f	f	f	2026-05-27 18:23:07.571519-03	2026-05-27 18:26:59.057002-03
f6718213-fc8f-4aaf-a6e7-2addacf14bef	SECRETARY	hr	f	f	f	f	f	2026-05-27 18:23:07.573759-03	2026-05-27 18:26:59.059782-03
2657038c-61ba-4b9f-95cc-2dea847adae1	SECRETARY	leaves	f	f	f	f	f	2026-05-27 18:23:07.578741-03	2026-05-27 18:26:59.065118-03
f97fc93f-eef0-40d7-96dd-2b5794c7da16	SECRETARY	payroll	f	f	f	f	f	2026-05-27 18:23:07.580831-03	2026-05-27 18:26:59.067728-03
220b6cea-fb3f-4880-84f8-0032bb2c6fc7	SECRETARY	events	t	t	f	f	f	2026-05-27 18:23:07.58339-03	2026-05-27 18:26:59.070598-03
028db8e0-6784-4f1e-ab5b-d4c671d04413	SECRETARY	communication	t	t	f	f	f	2026-05-27 18:23:07.585372-03	2026-05-27 18:26:59.073323-03
2c846c12-1d38-4717-bf92-8197d037a1ff	SECRETARY	reports	t	t	f	f	f	2026-05-27 18:23:07.587275-03	2026-05-27 18:26:59.07596-03
6e9b928e-be28-42b0-8b7e-df4b5f806dc9	SECRETARY	audit	f	f	f	f	f	2026-05-27 18:23:07.589234-03	2026-05-27 18:26:59.078667-03
ee55fa62-3277-4d06-9d86-021f51abe4ff	SECRETARY	portal	t	t	f	f	f	2026-05-27 18:23:07.591269-03	2026-05-27 18:26:59.082645-03
a4b003ee-57d5-4870-b22c-cca0723c4042	SECRETARY	settings	f	f	f	f	f	2026-05-27 18:23:07.593147-03	2026-05-27 18:26:59.085333-03
c10dacca-89f0-4b49-a9bf-3061aca46910	SECRETARY	users	f	f	f	f	f	2026-05-27 18:23:07.595207-03	2026-05-27 18:26:59.088091-03
0e874244-c9b8-42d8-9526-87c53b3511da	SECRETARY	permissions	f	f	f	f	f	2026-05-27 18:23:07.597226-03	2026-05-27 18:26:59.090614-03
1002c576-2d6a-439b-aa0e-39c055658fae	PASTOR	dashboard	t	t	f	f	f	2026-05-27 18:23:07.599867-03	2026-05-27 18:26:59.093229-03
68e9e03e-c416-4198-9f01-ae43089c0116	PASTOR	members	t	t	f	f	f	2026-05-27 18:23:07.602277-03	2026-05-27 18:26:59.096018-03
64c2bf14-ea4c-4831-824c-6c22d78ea235	PASTOR	finance	f	f	f	f	f	2026-05-27 18:23:07.604231-03	2026-05-27 18:26:59.100324-03
383b2d77-ba68-4c90-bd4c-0754b82a04d7	PASTOR	treasury	f	f	f	f	f	2026-05-27 18:23:07.606165-03	2026-05-27 18:26:59.103108-03
a25fe72a-6bd4-43c8-b767-f0e9257675f9	PASTOR	bank_reconciliation	f	f	f	f	f	2026-05-27 18:23:07.608228-03	2026-05-27 18:26:59.105704-03
ddaf2458-d461-44a6-9acd-aeaff2201c04	PASTOR	bank_accounts	f	f	f	f	f	2026-05-27 18:23:07.610345-03	2026-05-27 18:26:59.108403-03
fde4b550-f84a-403f-b405-8125601c17ba	PASTOR	assets	f	f	f	f	f	2026-05-27 18:23:07.612344-03	2026-05-27 18:26:59.111133-03
d4730eba-bb96-4b74-b04d-f2868cc4a03d	PASTOR	hr	t	t	f	f	f	2026-05-27 18:23:07.61425-03	2026-05-27 18:26:59.113803-03
a66ed630-ce27-4c7b-b61e-0fea6d48a1de	PASTOR	employees	f	f	f	f	f	2026-05-27 18:23:07.616166-03	2026-05-27 18:26:59.116494-03
f9d5a0a1-37f0-471f-8afd-63aea9bf18c5	PASTOR	leaves	f	f	f	f	f	2026-05-27 18:23:07.61824-03	2026-05-27 18:26:59.119174-03
81915ce0-3c78-409e-9892-aef88469a6f4	PASTOR	payroll	f	f	f	f	f	2026-05-27 18:23:07.620132-03	2026-05-27 18:26:59.121869-03
ba554333-cafc-4640-9cf9-c0cc798032e8	PASTOR	events	t	t	f	f	f	2026-05-27 18:23:07.622018-03	2026-05-27 18:26:59.124579-03
a0d0010b-8664-4f63-85bd-6910b77fb5ca	PASTOR	reports	t	t	f	f	f	2026-05-27 18:23:07.625816-03	2026-05-27 18:26:59.130147-03
739cfe29-4096-4508-bdce-2d3f392525b2	PASTOR	audit	f	f	f	f	f	2026-05-27 18:23:07.627795-03	2026-05-27 18:26:59.132777-03
830aa0ec-d965-4a51-9aef-922e0b4f79fa	PASTOR	portal	t	t	f	f	f	2026-05-27 18:23:07.630091-03	2026-05-27 18:26:59.135399-03
db885169-9270-42d9-b4ed-29c2d8b7e7d1	PASTOR	settings	f	f	f	f	f	2026-05-27 18:23:07.632111-03	2026-05-27 18:26:59.138069-03
e966a43b-0e32-48fc-a12c-ce9e807944e5	PASTOR	users	f	f	f	f	f	2026-05-27 18:23:07.634065-03	2026-05-27 18:26:59.140707-03
b7357cd2-6a69-46bb-8ba3-1883ed0e47e6	DEVELOPER	members	t	t	t	t	t	2026-05-27 18:23:07.422555-03	2026-05-27 18:26:58.88367-03
60158406-f31f-4ad0-86a8-4e34b8aa957a	DEVELOPER	finance	t	t	t	t	t	2026-05-27 18:23:07.425218-03	2026-05-27 18:26:58.886338-03
bdd60cf0-4364-4136-b68a-c94909503744	RH	settings	f	f	f	f	f	2026-05-27 18:23:07.670973-03	2026-05-27 18:26:59.191321-03
f90fc519-0adb-42f8-bb8f-2cbb47cbdbe6	RH	users	f	f	f	f	f	2026-05-27 18:23:07.672926-03	2026-05-27 18:26:59.193962-03
e2a9ce4b-3378-4bd5-ac5f-5b82343160a3	RH	permissions	f	f	f	f	f	2026-05-27 18:23:07.675134-03	2026-05-27 18:26:59.19669-03
662d661c-275c-46d5-be04-3d6776f7b1c8	DP	dashboard	t	t	f	f	f	2026-05-27 18:23:07.677312-03	2026-05-27 18:26:59.203494-03
af4a97b1-3d4a-4ef0-8f72-e9f6af830660	DP	members	f	f	f	f	f	2026-05-27 18:23:07.679355-03	2026-05-27 18:26:59.206102-03
3c0855c2-3214-4130-a363-ab6761d05459	DP	finance	f	f	f	f	f	2026-05-27 18:23:07.681307-03	2026-05-27 18:26:59.208735-03
5f7921f5-6125-4bed-a276-0e4f875ef39c	FINANCEIRO	members	f	f	f	f	f	2026-05-27 18:23:07.719513-03	2026-05-27 18:26:59.257225-03
f3e2cc83-3d68-4c03-becb-fb56f49c50d8	FINANCEIRO	finance	t	t	f	f	f	2026-05-27 18:23:07.721427-03	2026-05-27 18:26:59.2602-03
7800c7e6-b12c-4f5e-a5d6-b1dd1c66b938	FINANCEIRO	treasury	t	t	f	f	f	2026-05-27 18:23:07.723303-03	2026-05-27 18:26:59.262929-03
e01886de-3b61-4069-8586-03c2df305e80	FINANCEIRO	bank_reconciliation	t	t	f	f	f	2026-05-27 18:23:07.725265-03	2026-05-27 18:26:59.265604-03
55d34033-6920-42d3-b07d-fa79e1e965a2	FINANCEIRO	bank_accounts	t	t	f	f	f	2026-05-27 18:23:07.727314-03	2026-05-27 18:26:59.268316-03
3efaee4f-b25e-485a-877a-89073cfa64bf	FINANCEIRO	assets	f	f	f	f	f	2026-05-27 18:23:07.729245-03	2026-05-27 18:26:59.270995-03
77da7448-e6a5-48bc-bd18-8e5a4a7a9409	FINANCEIRO	hr	f	f	f	f	f	2026-05-27 18:23:07.731207-03	2026-05-27 18:26:59.273846-03
0d1b54cf-f01b-4f50-95d0-b728aedad95f	FINANCEIRO	employees	f	f	f	f	f	2026-05-27 18:23:07.733133-03	2026-05-27 18:26:59.276527-03
957d00af-9f4d-4451-aa85-92cc38b25203	FINANCEIRO	leaves	f	f	f	f	f	2026-05-27 18:23:07.735042-03	2026-05-27 18:26:59.279809-03
16e1e3e9-6513-487f-9ef9-856051798a71	FINANCEIRO	payroll	f	f	f	f	f	2026-05-27 18:23:07.73708-03	2026-05-27 18:26:59.282464-03
fab20c64-08ef-49a5-9445-f9ca8c6f5d97	DEVELOPER	dashboard	t	t	t	t	t	2026-05-27 18:23:07.414817-03	2026-05-27 18:26:58.880747-03
1ca3bf74-a2b0-4fa9-a9e1-9cfce611ed9b	ADMIN	finance	t	t	t	t	t	2026-05-27 18:23:07.472838-03	2026-05-27 18:26:58.940383-03
5cca0ff6-b191-40af-acea-bca0bd5a3222	TREASURER	bank_reconciliation	t	t	f	f	f	2026-05-27 18:23:07.52544-03	2026-05-27 18:26:58.99988-03
57f3aaa7-431f-4d64-aa30-daa409d5c9fc	SECRETARY	employees	f	f	f	f	f	2026-05-27 18:23:07.576401-03	2026-05-27 18:26:59.06252-03
6fc899e3-eead-49b4-a73f-69524971b567	PASTOR	communication	t	t	f	f	f	2026-05-27 18:23:07.623917-03	2026-05-27 18:26:59.127364-03
152e0da8-4952-4c59-9839-7863678a9c06	PASTOR	permissions	f	f	f	f	f	2026-05-27 18:23:07.635964-03	2026-05-27 18:26:59.143377-03
58716ec4-f83f-4cbb-8a93-824ea16005db	RH	dashboard	t	t	f	f	f	2026-05-27 18:23:07.638721-03	2026-05-27 18:26:59.14608-03
37302b62-a465-476f-9094-10d258d2374c	RH	members	f	f	f	f	f	2026-05-27 18:23:07.640662-03	2026-05-27 18:26:59.148906-03
8ff77c67-0476-4a82-81fd-213e7e01040b	RH	finance	f	f	f	f	f	2026-05-27 18:23:07.642571-03	2026-05-27 18:26:59.151561-03
8a4afd81-6ad0-40f2-8391-7e9f2e611f93	RH	treasury	f	f	f	f	f	2026-05-27 18:23:07.64446-03	2026-05-27 18:26:59.154136-03
7f1c018d-d739-4505-ac8a-c7c2bd48a26a	RH	bank_reconciliation	f	f	f	f	f	2026-05-27 18:23:07.646356-03	2026-05-27 18:26:59.156856-03
9d041a4c-7bc6-49ae-ad6e-b6d5018f68ed	RH	bank_accounts	f	f	f	f	f	2026-05-27 18:23:07.648303-03	2026-05-27 18:26:59.159518-03
ed9f643e-1f9c-4af4-8600-04f3b64069c3	RH	assets	f	f	f	f	f	2026-05-27 18:23:07.650437-03	2026-05-27 18:26:59.162117-03
56acc6ff-caab-4281-835e-79b4161637f2	RH	hr	t	t	f	f	f	2026-05-27 18:23:07.652975-03	2026-05-27 18:26:59.164691-03
31312d50-ba6e-4a3d-88ae-080a4bffdefb	RH	employees	t	t	f	f	f	2026-05-27 18:23:07.654869-03	2026-05-27 18:26:59.167401-03
dfc69a63-928a-4e74-b74e-1de9b2b0dc27	RH	leaves	t	t	f	f	f	2026-05-27 18:23:07.656732-03	2026-05-27 18:26:59.171901-03
6e8b3b7d-05d1-4fad-80a6-e002c9aee0d4	RH	payroll	t	t	f	f	f	2026-05-27 18:23:07.658656-03	2026-05-27 18:26:59.174623-03
cb58849c-4244-48cd-b5ce-a7dbb9b1f743	RH	events	f	f	f	f	f	2026-05-27 18:23:07.660582-03	2026-05-27 18:26:59.17781-03
389fcbd9-79cf-4dea-98e7-8f2e4f0c00e1	RH	communication	f	f	f	f	f	2026-05-27 18:23:07.662463-03	2026-05-27 18:26:59.180554-03
877d877e-0cc7-45a4-8bca-d06d063849f0	RH	reports	t	t	f	f	f	2026-05-27 18:23:07.66486-03	2026-05-27 18:26:59.183245-03
86699d69-f796-4af6-8375-32a5457ab415	RH	audit	f	f	f	f	f	2026-05-27 18:23:07.666751-03	2026-05-27 18:26:59.185974-03
90f16d09-5bea-447f-92b7-eb4b09b69223	RH	portal	f	f	f	f	f	2026-05-27 18:23:07.668822-03	2026-05-27 18:26:59.188614-03
f3b4001c-7b26-45b1-b936-a733d3b4e73e	DP	treasury	f	f	f	f	f	2026-05-27 18:23:07.683219-03	2026-05-27 18:26:59.212006-03
53b19557-9463-4810-bfd1-bf25ef8faf4f	DP	bank_reconciliation	f	f	f	f	f	2026-05-27 18:23:07.685605-03	2026-05-27 18:26:59.214692-03
545e65d5-7b07-4309-82fe-92da6c63a8e9	DP	bank_accounts	f	f	f	f	f	2026-05-27 18:23:07.687506-03	2026-05-27 18:26:59.217323-03
bd55af5a-73a5-4cd5-a907-f1324bcb1890	DP	assets	f	f	f	f	f	2026-05-27 18:23:07.689582-03	2026-05-27 18:26:59.219907-03
4930761c-c155-4363-aeaa-ea2b862b9e0e	DP	hr	f	f	f	f	f	2026-05-27 18:23:07.691457-03	2026-05-27 18:26:59.222532-03
23de3e62-317b-4f6c-b312-837c011e2710	DP	employees	t	t	f	f	f	2026-05-27 18:23:07.693319-03	2026-05-27 18:26:59.225163-03
aae13f6e-2a00-4250-af42-95bcccf37c09	DP	leaves	t	t	f	f	f	2026-05-27 18:23:07.695708-03	2026-05-27 18:26:59.227918-03
63ee9d64-93f9-41db-8ed7-2a7643b39dd5	DP	payroll	t	t	f	f	f	2026-05-27 18:23:07.697583-03	2026-05-27 18:26:59.231016-03
2e63e478-a180-4be5-8aa5-d2292ec878db	DP	events	f	f	f	f	f	2026-05-27 18:23:07.699945-03	2026-05-27 18:26:59.233664-03
5670a9d8-a143-4a1b-9f15-874f5f6ee3bf	DP	communication	f	f	f	f	f	2026-05-27 18:23:07.702545-03	2026-05-27 18:26:59.236266-03
8575d6ba-9cd3-40d3-a747-f70269a47699	DP	reports	t	t	f	f	f	2026-05-27 18:23:07.70518-03	2026-05-27 18:26:59.238941-03
03efad89-ca21-477a-b435-1c1aab7cc4af	DP	audit	f	f	f	f	f	2026-05-27 18:23:07.707699-03	2026-05-27 18:26:59.241556-03
c6305394-24f4-4421-b3f1-6e392a84c298	DP	portal	f	f	f	f	f	2026-05-27 18:23:07.709763-03	2026-05-27 18:26:59.244241-03
8a657777-fed9-4331-a1a9-0f2df4c2156a	DP	settings	f	f	f	f	f	2026-05-27 18:23:07.711665-03	2026-05-27 18:26:59.246829-03
d1c48e75-6e01-47f4-8c29-3fbe70ac832b	DP	users	f	f	f	f	f	2026-05-27 18:23:07.713637-03	2026-05-27 18:26:59.249418-03
ba22cc97-10f1-4df0-ad24-4958c1099837	DP	permissions	f	f	f	f	f	2026-05-27 18:23:07.715566-03	2026-05-27 18:26:59.251981-03
42ebda2e-a576-432c-a0ae-dc49ccac9cad	FINANCEIRO	dashboard	t	t	f	f	f	2026-05-27 18:23:07.71747-03	2026-05-27 18:26:59.254598-03
d027cfbe-9fa6-4139-b433-0df701ffb11e	FINANCEIRO	events	f	f	f	f	f	2026-05-27 18:23:07.739444-03	2026-05-27 18:26:59.28543-03
b9a55187-96b0-43fa-9504-6e92b5a937e0	FINANCEIRO	communication	f	f	f	f	f	2026-05-27 18:23:07.741314-03	2026-05-27 18:26:59.288821-03
a47e74f6-020b-48f9-9cc9-f8728f81240d	FINANCEIRO	reports	t	t	f	f	f	2026-05-27 18:23:07.74318-03	2026-05-27 18:26:59.293571-03
ab11c053-59d1-43cb-945e-c7de8d329dfc	FINANCEIRO	audit	f	f	f	f	f	2026-05-27 18:23:07.745044-03	2026-05-27 18:26:59.296279-03
90e126d3-8898-4e9b-a4d9-807d03917c84	FINANCEIRO	portal	f	f	f	f	f	2026-05-27 18:23:07.74694-03	2026-05-27 18:26:59.30001-03
224e4dd5-d7dd-4c8d-83dc-212a18181a2b	FINANCEIRO	settings	f	f	f	f	f	2026-05-27 18:23:07.748822-03	2026-05-27 18:26:59.303674-03
aa901b33-493f-4ac7-b9bf-2e0bbf7d31ef	FINANCEIRO	users	f	f	f	f	f	2026-05-27 18:23:07.751517-03	2026-05-27 18:26:59.306463-03
050ebd6b-06ac-40f7-995b-6183cd7c9781	FINANCEIRO	permissions	f	f	f	f	f	2026-05-27 18:23:07.753641-03	2026-05-27 18:26:59.309129-03
\.


--
-- TOC entry 5479 (class 0 OID 24094)
-- Dependencies: 252
-- Data for Name: app_user_permissions; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.app_user_permissions (id, usuario_id, codigo_modulo, ler, escrever, excluir, gerenciar, administrador, criado, atualizado) FROM stdin;
\.


--
-- TOC entry 5462 (class 0 OID 23687)
-- Dependencies: 232
-- Data for Name: calculos_folha; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.calculos_folha (id, id_funcionario, mes_competencia, salario_bruto, sindicato_taxa, farmacia, seguro_vida, inss, irrf, fgts, salario_liquido, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5466 (class 0 OID 23781)
-- Dependencies: 236
-- Data for Name: contagens_inventario; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.contagens_inventario (id, id_unidade, data_contagem, situacao, iniciado, concluido) FROM stdin;
\.


--
-- TOC entry 5457 (class 0 OID 23546)
-- Dependencies: 227
-- Data for Name: contas_bancarias; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.contas_bancarias (id, id_unidade, nome_conta, tipo_conta, nome_banco, agencia, numero_conta, moeda, esta_ativo, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5456 (class 0 OID 23531)
-- Dependencies: 226
-- Data for Name: contas_financeiras; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.contas_financeiras (id_conta, id_unidade, nome, tipo, saldo, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5470 (class 0 OID 23869)
-- Dependencies: 240
-- Data for Name: escalas_voluntarios; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.escalas_voluntarios (id, id_evento, ministerio, funcao, id_voluntario, confirmado, quantidade_necessaria, criado) FROM stdin;
\.


--
-- TOC entry 5469 (class 0 OID 23846)
-- Dependencies: 239
-- Data for Name: eventos_igreja; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.eventos_igreja (id, id_unidade, titulo, descricao, data_evento, hora_evento, local_evento, tipo, recorrente, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5461 (class 0 OID 23655)
-- Dependencies: 231
-- Data for Name: folha_pagamento; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.folha_pagamento (id, id_unidade, id_funcionario, mes, ano, data_referencia, salario_base, inss, irrf, fgts, salario_liquido, situacao, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5455 (class 0 OID 23505)
-- Dependencies: 225
-- Data for Name: funcionarios; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.funcionarios (id_funcionario, id_pessoa, id_unidade, matricula, cargo, departamento, data_admissao, data_demissao, regime_trabalho, salario_base, banco, agencia, conta, tipo_conta, chave_pix, ativo, criado_em, atualizado_em) FROM stdin;
604b5000-e9f3-412b-8f98-78b6e6255d97	343a34fb-89a2-44ce-9a38-99f04b1d6e81	00000000-0000-0000-0000-000000000001	SYS-17076825	Desenvolvedor Master	Sistema	2026-05-27	\N	CLT	\N	\N	\N	\N	\N	\N	t	2026-05-27 18:24:36.83066-03	2026-05-27 18:24:36.83066-03
35589495-e661-49c0-b74b-8ed131351680	3f9814bf-e9d5-4fa4-aed4-6304ca3a3443	00000000-0000-0000-0000-000000000001	SYS-17076981	Administrador do Sistema	Sistema	2026-05-27	\N	CLT	\N	\N	\N	\N	\N	\N	t	2026-05-27 18:24:36.985876-03	2026-05-27 18:24:36.985876-03
\.


--
-- TOC entry 5467 (class 0 OID 23797)
-- Dependencies: 237
-- Data for Name: itens_inventario; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.itens_inventario (id, id_contagem_estoque, id_patrimonio, quantidade_esperada, quantidade_contada, diferenca, condicao, criado) FROM stdin;
\.


--
-- TOC entry 5460 (class 0 OID 23627)
-- Dependencies: 230
-- Data for Name: lancamentos_contabeis; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.lancamentos_contabeis (id, id_unidade, numero_lancamento, data_lancamento, historico, complemento, valor_debito, valor_credito, id_transacao, criado_em, criado_por, situacao) FROM stdin;
\.


--
-- TOC entry 5473 (class 0 OID 23926)
-- Dependencies: 243
-- Data for Name: logs_auditoria; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.logs_auditoria (id, id_unidade, id_usuario, acao, entidade, id_entidade, data_acao, endereco_ip, detalhes, sucesso) FROM stdin;
\.


--
-- TOC entry 5476 (class 0 OID 23990)
-- Dependencies: 246
-- Data for Name: logs_consentimento_lgpd; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.logs_consentimento_lgpd (id, id_membro, id_funcionario, id_politica, tipo_consentimento, concedido, endereco_ip, data_consentimento) FROM stdin;
\.


--
-- TOC entry 5454 (class 0 OID 23480)
-- Dependencies: 224
-- Data for Name: membros; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.membros (id, id_pessoa, id_unidade, data_conversao, data_batismo, data_membro, situacao, ministerio, grupo_pequeno, dizimista, ofertante, cargo_eclesiastico, data_consagracao, observacoes, criado_em, atualizado_em, dados_perfil) FROM stdin;
03779758-8669-4d40-9a55-cc106112fd6b	77814190-3509-4b05-88b5-6b3c68f79fbb	00000000-0000-0000-0000-000000000001	\N	\N	\N	INATIVO	\N	\N	f	f	\N	\N	teste temporario	2026-05-27 18:35:41.695397-03	2026-05-27 18:35:41.714141-03	{}
\.


--
-- TOC entry 5471 (class 0 OID 23893)
-- Dependencies: 241
-- Data for Name: modulos_permissao; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.modulos_permissao (id, codigo, nome_modulo, categoria, criado) FROM stdin;
\.


--
-- TOC entry 5465 (class 0 OID 23761)
-- Dependencies: 235
-- Data for Name: patrimonios; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.patrimonios (id, id_unidade, nome, descricao, categoria, data_aquisicao, valor_aquisicao, situacao, depreciacao_acumulada, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5463 (class 0 OID 23711)
-- Dependencies: 233
-- Data for Name: periodos_folha; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.periodos_folha (id, id_unidade, mes, ano, situacao, data_inicio, data_final, criado_por, criado_em) FROM stdin;
\.


--
-- TOC entry 5472 (class 0 OID 23906)
-- Dependencies: 242
-- Data for Name: permissoes_perfil; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.permissoes_perfil (id, perfil, codigo_modulo, ler, escrever, excluir, gerenciar, criado, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5452 (class 0 OID 23434)
-- Dependencies: 222
-- Data for Name: pessoas; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.pessoas (id_pessoa, id_unidade, nome, cpf, rg, data_nascimento, sexo, estado_civil, email, telefone, celular, whatsapp, logradouro, numero, complemento, bairro, cidade, estado, cep, pais, tipo_sanguineo, contato_emergencia, pcd, tipo_deficiencia, ativo, criado_em, atualizado_em) FROM stdin;
343a34fb-89a2-44ce-9a38-99f04b1d6e81	00000000-0000-0000-0000-000000000001	Desenvolvedor Master	\N	\N	\N	\N	\N	desenvolvedor@igrejaerp.com.br	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	Brasil	\N	\N	f	\N	t	2026-05-27 18:23:07.891855-03	2026-05-27 18:24:36.826336-03
3f9814bf-e9d5-4fa4-aed4-6304ca3a3443	00000000-0000-0000-0000-000000000001	Administrador do Sistema	\N	\N	\N	\N	\N	admin@igrejaerp.com.br	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	Brasil	\N	\N	f	\N	t	2026-05-27 18:24:36.982151-03	2026-05-27 18:24:36.982151-03
77814190-3509-4b05-88b5-6b3c68f79fbb	00000000-0000-0000-0000-000000000001	Membro Teste Codex	99999999440	TESTE	1990-01-02	OTHER	SINGLE	teste.codex@igrejaerp.com.br	\N	(11) 99999-0000	t	\N	\N	\N	\N	\N	\N	\N	Brasil	\N	\N	f	\N	t	2026-05-27 18:35:41.684868-03	2026-05-27 18:35:41.684868-03
\.


--
-- TOC entry 5458 (class 0 OID 23566)
-- Dependencies: 228
-- Data for Name: plano_contas; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.plano_contas (id, id_unidade, codigo, nome, natureza, tipo, id_conta_pai, saldo_normal, esta_ativo) FROM stdin;
\.


--
-- TOC entry 5475 (class 0 OID 23970)
-- Dependencies: 245
-- Data for Name: politicas_lgpd; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.politicas_lgpd (id, id_unidade, versao, titulo, conteudo, esta_ativa, criado) FROM stdin;
\.


--
-- TOC entry 5459 (class 0 OID 23590)
-- Dependencies: 229
-- Data for Name: transacoes; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.transacoes (id_transacao, id_unidade, id_pessoa, descricao, valor, tipo, id_conta, data_transacao, data_vencimento, data_pagamento, situacao, forma_pagamento, conciliado, criado_por, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5451 (class 0 OID 23417)
-- Dependencies: 221
-- Data for Name: unidades; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.unidades (id_unidade, nome, cnpj, telefone, email, logradouro, numero, bairro, cidade, estado, cep, pais, situacao, ativo, criado_em, atualizado_em) FROM stdin;
00000000-0000-0000-0000-000000000001	Igreja ADJPA Sede	00.000.000/0001-00	\N	\N	Endereço não informado	\N	\N	São Paulo	SP	\N	Brasil	ATIVO	t	2026-05-27 18:23:07.755766-03	2026-05-27 18:23:07.755766-03
\.


--
-- TOC entry 5453 (class 0 OID 23457)
-- Dependencies: 223
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: desenvolvedor
--

COPY public.usuarios (id_usuario, id_pessoa, login, senha_hash, perfil, esta_ativo, ultimo_login, criado_em, atualizado_em) FROM stdin;
3724d1a3-ec26-4394-98b6-8775c6fbd374	3f9814bf-e9d5-4fa4-aed4-6304ca3a3443	admin@igrejaerp.com.br	$2a$10$d9FHiRHRiBGUjcVu2I9jP.is/9xOiihqKNzRDWCVYPS6pjEAbdsdW	ADMIN	t	\N	2026-05-27 18:24:36.988595-03	2026-05-27 18:24:36.988595-03
05e5af65-a73d-45d9-b075-8fb27d2c7eda	343a34fb-89a2-44ce-9a38-99f04b1d6e81	desenvolvedor@igrejaerp.com.br	$2a$10$4/LCFuhTYa6nD3tePsEItui.BmY/Vy7kNeeuU1yWUYyJtujsLWJoy	DESENVOLVEDOR	t	2026-05-27 18:27:13.080582-03	2026-05-27 18:24:36.835646-03	2026-05-27 18:27:13.080582-03
\.


--
-- TOC entry 5207 (class 2606 OID 23750)
-- Name: afastamentos_funcionarios afastamentos_funcionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.afastamentos_funcionarios
    ADD CONSTRAINT afastamentos_funcionarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5215 (class 2606 OID 23835)
-- Name: ajustes_inventario ajustes_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.ajustes_inventario
    ADD CONSTRAINT ajustes_inventario_pkey PRIMARY KEY (id);


--
-- TOC entry 5230 (class 2606 OID 23969)
-- Name: app_audit_logs app_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_audit_logs
    ADD CONSTRAINT app_audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5239 (class 2606 OID 24070)
-- Name: app_permission_modules app_permission_modules_codigo_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_permission_modules
    ADD CONSTRAINT app_permission_modules_codigo_key UNIQUE (codigo);


--
-- TOC entry 5241 (class 2606 OID 24068)
-- Name: app_permission_modules app_permission_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_permission_modules
    ADD CONSTRAINT app_permission_modules_pkey PRIMARY KEY (id);


--
-- TOC entry 5243 (class 2606 OID 24086)
-- Name: app_role_permissions app_role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT app_role_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5245 (class 2606 OID 24088)
-- Name: app_role_permissions app_role_permissions_role_codigo_modulo_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT app_role_permissions_role_codigo_modulo_key UNIQUE (role, codigo_modulo);


--
-- TOC entry 5247 (class 2606 OID 24104)
-- Name: app_user_permissions app_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_user_permissions
    ADD CONSTRAINT app_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5249 (class 2606 OID 24106)
-- Name: app_user_permissions app_user_permissions_usuario_id_codigo_modulo_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_user_permissions
    ADD CONSTRAINT app_user_permissions_usuario_id_codigo_modulo_key UNIQUE (usuario_id, codigo_modulo);


--
-- TOC entry 5203 (class 2606 OID 23705)
-- Name: calculos_folha calculos_folha_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.calculos_folha
    ADD CONSTRAINT calculos_folha_pkey PRIMARY KEY (id);


--
-- TOC entry 5211 (class 2606 OID 23791)
-- Name: contagens_inventario contagens_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.contagens_inventario
    ADD CONSTRAINT contagens_inventario_pkey PRIMARY KEY (id);


--
-- TOC entry 5191 (class 2606 OID 23560)
-- Name: contas_bancarias contas_bancarias_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.contas_bancarias
    ADD CONSTRAINT contas_bancarias_pkey PRIMARY KEY (id);


--
-- TOC entry 5189 (class 2606 OID 23540)
-- Name: contas_financeiras contas_financeiras_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.contas_financeiras
    ADD CONSTRAINT contas_financeiras_pkey PRIMARY KEY (id_conta);


--
-- TOC entry 5219 (class 2606 OID 23882)
-- Name: escalas_voluntarios escalas_voluntarios_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.escalas_voluntarios
    ADD CONSTRAINT escalas_voluntarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5217 (class 2606 OID 23863)
-- Name: eventos_igreja eventos_igreja_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.eventos_igreja
    ADD CONSTRAINT eventos_igreja_pkey PRIMARY KEY (id);


--
-- TOC entry 5201 (class 2606 OID 23676)
-- Name: folha_pagamento folha_pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.folha_pagamento
    ADD CONSTRAINT folha_pagamento_pkey PRIMARY KEY (id);


--
-- TOC entry 5184 (class 2606 OID 23520)
-- Name: funcionarios funcionarios_matricula_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_matricula_key UNIQUE (matricula);


--
-- TOC entry 5186 (class 2606 OID 23518)
-- Name: funcionarios funcionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_pkey PRIMARY KEY (id_funcionario);


--
-- TOC entry 5213 (class 2606 OID 23810)
-- Name: itens_inventario itens_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.itens_inventario
    ADD CONSTRAINT itens_inventario_pkey PRIMARY KEY (id);


--
-- TOC entry 5199 (class 2606 OID 23644)
-- Name: lancamentos_contabeis lancamentos_contabeis_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lancamentos_contabeis
    ADD CONSTRAINT lancamentos_contabeis_pkey PRIMARY KEY (id);


--
-- TOC entry 5228 (class 2606 OID 23938)
-- Name: logs_auditoria logs_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_pkey PRIMARY KEY (id);


--
-- TOC entry 5237 (class 2606 OID 24002)
-- Name: logs_consentimento_lgpd logs_consentimento_lgpd_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.logs_consentimento_lgpd
    ADD CONSTRAINT logs_consentimento_lgpd_pkey PRIMARY KEY (id);


--
-- TOC entry 5182 (class 2606 OID 23494)
-- Name: membros membros_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.membros
    ADD CONSTRAINT membros_pkey PRIMARY KEY (id);


--
-- TOC entry 5221 (class 2606 OID 23905)
-- Name: modulos_permissao modulos_permissao_codigo_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.modulos_permissao
    ADD CONSTRAINT modulos_permissao_codigo_key UNIQUE (codigo);


--
-- TOC entry 5223 (class 2606 OID 23903)
-- Name: modulos_permissao modulos_permissao_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.modulos_permissao
    ADD CONSTRAINT modulos_permissao_pkey PRIMARY KEY (id);


--
-- TOC entry 5209 (class 2606 OID 23775)
-- Name: patrimonios patrimonios_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.patrimonios
    ADD CONSTRAINT patrimonios_pkey PRIMARY KEY (id);


--
-- TOC entry 5205 (class 2606 OID 23725)
-- Name: periodos_folha periodos_folha_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.periodos_folha
    ADD CONSTRAINT periodos_folha_pkey PRIMARY KEY (id);


--
-- TOC entry 5225 (class 2606 OID 23920)
-- Name: permissoes_perfil permissoes_perfil_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.permissoes_perfil
    ADD CONSTRAINT permissoes_perfil_pkey PRIMARY KEY (id);


--
-- TOC entry 5171 (class 2606 OID 23451)
-- Name: pessoas pessoas_cpf_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_cpf_key UNIQUE (cpf);


--
-- TOC entry 5173 (class 2606 OID 23449)
-- Name: pessoas pessoas_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_pkey PRIMARY KEY (id_pessoa);


--
-- TOC entry 5193 (class 2606 OID 23579)
-- Name: plano_contas plano_contas_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.plano_contas
    ADD CONSTRAINT plano_contas_pkey PRIMARY KEY (id);


--
-- TOC entry 5235 (class 2606 OID 23984)
-- Name: politicas_lgpd politicas_lgpd_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.politicas_lgpd
    ADD CONSTRAINT politicas_lgpd_pkey PRIMARY KEY (id);


--
-- TOC entry 5197 (class 2606 OID 23606)
-- Name: transacoes transacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pkey PRIMARY KEY (id_transacao);


--
-- TOC entry 5165 (class 2606 OID 23433)
-- Name: unidades unidades_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_cnpj_key UNIQUE (cnpj);


--
-- TOC entry 5167 (class 2606 OID 23431)
-- Name: unidades unidades_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_pkey PRIMARY KEY (id_unidade);


--
-- TOC entry 5177 (class 2606 OID 23474)
-- Name: usuarios usuarios_login_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_login_key UNIQUE (login);


--
-- TOC entry 5179 (class 2606 OID 23472)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 5231 (class 1259 OID 24119)
-- Name: idx_app_audit_logs_acao; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_app_audit_logs_acao ON public.app_audit_logs USING btree (acao);


--
-- TOC entry 5232 (class 1259 OID 24117)
-- Name: idx_app_audit_logs_data_evento; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_app_audit_logs_data_evento ON public.app_audit_logs USING btree (data_evento DESC);


--
-- TOC entry 5233 (class 1259 OID 24118)
-- Name: idx_app_audit_logs_id_unidade; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_app_audit_logs_id_unidade ON public.app_audit_logs USING btree (id_unidade);


--
-- TOC entry 5187 (class 1259 OID 24050)
-- Name: idx_funcionarios_pessoa; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_funcionarios_pessoa ON public.funcionarios USING btree (id_pessoa);


--
-- TOC entry 5226 (class 1259 OID 24053)
-- Name: idx_logs_auditoria_data; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_logs_auditoria_data ON public.logs_auditoria USING btree (data_acao);


--
-- TOC entry 5180 (class 1259 OID 24049)
-- Name: idx_membros_pessoa; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_membros_pessoa ON public.membros USING btree (id_pessoa);


--
-- TOC entry 5168 (class 1259 OID 24045)
-- Name: idx_pessoas_cpf; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_pessoas_cpf ON public.pessoas USING btree (cpf);


--
-- TOC entry 5169 (class 1259 OID 24046)
-- Name: idx_pessoas_email; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_pessoas_email ON public.pessoas USING btree (email);


--
-- TOC entry 5194 (class 1259 OID 24051)
-- Name: idx_transacoes_data; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transacoes_data ON public.transacoes USING btree (data_transacao);


--
-- TOC entry 5195 (class 1259 OID 24052)
-- Name: idx_transacoes_situacao; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transacoes_situacao ON public.transacoes USING btree (situacao);


--
-- TOC entry 5174 (class 1259 OID 24047)
-- Name: idx_usuarios_login; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_usuarios_login ON public.usuarios USING btree (login);


--
-- TOC entry 5175 (class 1259 OID 24048)
-- Name: idx_usuarios_perfil; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_usuarios_perfil ON public.usuarios USING btree (perfil);


--
-- TOC entry 5297 (class 2620 OID 24023)
-- Name: funcionarios trg_funcionarios; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_funcionarios BEFORE UPDATE ON public.funcionarios FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();


--
-- TOC entry 5296 (class 2620 OID 24022)
-- Name: membros trg_membros; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_membros BEFORE UPDATE ON public.membros FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();


--
-- TOC entry 5293 (class 2620 OID 24020)
-- Name: pessoas trg_pessoas; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_pessoas BEFORE UPDATE ON public.pessoas FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();


--
-- TOC entry 5299 (class 2620 OID 24128)
-- Name: app_audit_logs trg_prevent_app_audit_logs_delete; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_prevent_app_audit_logs_delete BEFORE DELETE ON public.app_audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_app_audit_logs_mutation();


--
-- TOC entry 5300 (class 2620 OID 24127)
-- Name: app_audit_logs trg_prevent_app_audit_logs_update; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_prevent_app_audit_logs_update BEFORE UPDATE ON public.app_audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_app_audit_logs_mutation();


--
-- TOC entry 5298 (class 2620 OID 24024)
-- Name: transacoes trg_transacoes; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_transacoes BEFORE UPDATE ON public.transacoes FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();


--
-- TOC entry 5292 (class 2620 OID 24019)
-- Name: unidades trg_unidades; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_unidades BEFORE UPDATE ON public.unidades FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();


--
-- TOC entry 5294 (class 2620 OID 24021)
-- Name: usuarios trg_usuarios; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_usuarios BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp();


--
-- TOC entry 5295 (class 2620 OID 24026)
-- Name: usuarios trg_validar_usuario; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_validar_usuario BEFORE INSERT ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.validar_usuario_pessoa();


--
-- TOC entry 5271 (class 2606 OID 23756)
-- Name: afastamentos_funcionarios afastamentos_funcionarios_id_funcionario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.afastamentos_funcionarios
    ADD CONSTRAINT afastamentos_funcionarios_id_funcionario_fkey FOREIGN KEY (id_funcionario) REFERENCES public.funcionarios(id_funcionario);


--
-- TOC entry 5272 (class 2606 OID 23751)
-- Name: afastamentos_funcionarios afastamentos_funcionarios_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.afastamentos_funcionarios
    ADD CONSTRAINT afastamentos_funcionarios_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5277 (class 2606 OID 23836)
-- Name: ajustes_inventario ajustes_inventario_id_contagem_estoque_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.ajustes_inventario
    ADD CONSTRAINT ajustes_inventario_id_contagem_estoque_fkey FOREIGN KEY (id_contagem_estoque) REFERENCES public.contagens_inventario(id) ON DELETE CASCADE;


--
-- TOC entry 5278 (class 2606 OID 23841)
-- Name: ajustes_inventario ajustes_inventario_id_patrimonio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.ajustes_inventario
    ADD CONSTRAINT ajustes_inventario_id_patrimonio_fkey FOREIGN KEY (id_patrimonio) REFERENCES public.patrimonios(id);


--
-- TOC entry 5289 (class 2606 OID 24089)
-- Name: app_role_permissions app_role_permissions_codigo_modulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT app_role_permissions_codigo_modulo_fkey FOREIGN KEY (codigo_modulo) REFERENCES public.app_permission_modules(codigo) ON DELETE CASCADE;


--
-- TOC entry 5290 (class 2606 OID 24112)
-- Name: app_user_permissions app_user_permissions_codigo_modulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_user_permissions
    ADD CONSTRAINT app_user_permissions_codigo_modulo_fkey FOREIGN KEY (codigo_modulo) REFERENCES public.app_permission_modules(codigo) ON DELETE CASCADE;


--
-- TOC entry 5291 (class 2606 OID 24107)
-- Name: app_user_permissions app_user_permissions_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_user_permissions
    ADD CONSTRAINT app_user_permissions_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 5268 (class 2606 OID 23706)
-- Name: calculos_folha calculos_folha_id_funcionario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.calculos_folha
    ADD CONSTRAINT calculos_folha_id_funcionario_fkey FOREIGN KEY (id_funcionario) REFERENCES public.funcionarios(id_funcionario);


--
-- TOC entry 5274 (class 2606 OID 23792)
-- Name: contagens_inventario contagens_inventario_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.contagens_inventario
    ADD CONSTRAINT contagens_inventario_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5257 (class 2606 OID 23561)
-- Name: contas_bancarias contas_bancarias_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.contas_bancarias
    ADD CONSTRAINT contas_bancarias_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5256 (class 2606 OID 23541)
-- Name: contas_financeiras contas_financeiras_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.contas_financeiras
    ADD CONSTRAINT contas_financeiras_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5280 (class 2606 OID 23883)
-- Name: escalas_voluntarios escalas_voluntarios_id_evento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.escalas_voluntarios
    ADD CONSTRAINT escalas_voluntarios_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos_igreja(id) ON DELETE CASCADE;


--
-- TOC entry 5281 (class 2606 OID 23888)
-- Name: escalas_voluntarios escalas_voluntarios_id_voluntario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.escalas_voluntarios
    ADD CONSTRAINT escalas_voluntarios_id_voluntario_fkey FOREIGN KEY (id_voluntario) REFERENCES public.pessoas(id_pessoa);


--
-- TOC entry 5279 (class 2606 OID 23864)
-- Name: eventos_igreja eventos_igreja_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.eventos_igreja
    ADD CONSTRAINT eventos_igreja_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5266 (class 2606 OID 23682)
-- Name: folha_pagamento folha_pagamento_id_funcionario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.folha_pagamento
    ADD CONSTRAINT folha_pagamento_id_funcionario_fkey FOREIGN KEY (id_funcionario) REFERENCES public.funcionarios(id_funcionario);


--
-- TOC entry 5267 (class 2606 OID 23677)
-- Name: folha_pagamento folha_pagamento_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.folha_pagamento
    ADD CONSTRAINT folha_pagamento_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5254 (class 2606 OID 23521)
-- Name: funcionarios funcionarios_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE;


--
-- TOC entry 5255 (class 2606 OID 23526)
-- Name: funcionarios funcionarios_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5275 (class 2606 OID 23811)
-- Name: itens_inventario itens_inventario_id_contagem_estoque_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.itens_inventario
    ADD CONSTRAINT itens_inventario_id_contagem_estoque_fkey FOREIGN KEY (id_contagem_estoque) REFERENCES public.contagens_inventario(id) ON DELETE CASCADE;


--
-- TOC entry 5276 (class 2606 OID 23816)
-- Name: itens_inventario itens_inventario_id_patrimonio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.itens_inventario
    ADD CONSTRAINT itens_inventario_id_patrimonio_fkey FOREIGN KEY (id_patrimonio) REFERENCES public.patrimonios(id);


--
-- TOC entry 5264 (class 2606 OID 23650)
-- Name: lancamentos_contabeis lancamentos_contabeis_id_transacao_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lancamentos_contabeis
    ADD CONSTRAINT lancamentos_contabeis_id_transacao_fkey FOREIGN KEY (id_transacao) REFERENCES public.transacoes(id_transacao);


--
-- TOC entry 5265 (class 2606 OID 23645)
-- Name: lancamentos_contabeis lancamentos_contabeis_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lancamentos_contabeis
    ADD CONSTRAINT lancamentos_contabeis_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5283 (class 2606 OID 23939)
-- Name: logs_auditoria logs_auditoria_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5284 (class 2606 OID 23944)
-- Name: logs_auditoria logs_auditoria_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5286 (class 2606 OID 24008)
-- Name: logs_consentimento_lgpd logs_consentimento_lgpd_id_funcionario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.logs_consentimento_lgpd
    ADD CONSTRAINT logs_consentimento_lgpd_id_funcionario_fkey FOREIGN KEY (id_funcionario) REFERENCES public.funcionarios(id_funcionario);


--
-- TOC entry 5287 (class 2606 OID 24003)
-- Name: logs_consentimento_lgpd logs_consentimento_lgpd_id_membro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.logs_consentimento_lgpd
    ADD CONSTRAINT logs_consentimento_lgpd_id_membro_fkey FOREIGN KEY (id_membro) REFERENCES public.membros(id);


--
-- TOC entry 5288 (class 2606 OID 24013)
-- Name: logs_consentimento_lgpd logs_consentimento_lgpd_id_politica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.logs_consentimento_lgpd
    ADD CONSTRAINT logs_consentimento_lgpd_id_politica_fkey FOREIGN KEY (id_politica) REFERENCES public.politicas_lgpd(id);


--
-- TOC entry 5252 (class 2606 OID 23495)
-- Name: membros membros_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.membros
    ADD CONSTRAINT membros_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE;


--
-- TOC entry 5253 (class 2606 OID 23500)
-- Name: membros membros_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.membros
    ADD CONSTRAINT membros_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5273 (class 2606 OID 23776)
-- Name: patrimonios patrimonios_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.patrimonios
    ADD CONSTRAINT patrimonios_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5269 (class 2606 OID 23731)
-- Name: periodos_folha periodos_folha_criado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.periodos_folha
    ADD CONSTRAINT periodos_folha_criado_por_fkey FOREIGN KEY (criado_por) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5270 (class 2606 OID 23726)
-- Name: periodos_folha periodos_folha_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.periodos_folha
    ADD CONSTRAINT periodos_folha_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5282 (class 2606 OID 23921)
-- Name: permissoes_perfil permissoes_perfil_codigo_modulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.permissoes_perfil
    ADD CONSTRAINT permissoes_perfil_codigo_modulo_fkey FOREIGN KEY (codigo_modulo) REFERENCES public.modulos_permissao(codigo) ON DELETE CASCADE;


--
-- TOC entry 5250 (class 2606 OID 23452)
-- Name: pessoas pessoas_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5258 (class 2606 OID 23585)
-- Name: plano_contas plano_contas_id_conta_pai_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.plano_contas
    ADD CONSTRAINT plano_contas_id_conta_pai_fkey FOREIGN KEY (id_conta_pai) REFERENCES public.plano_contas(id);


--
-- TOC entry 5259 (class 2606 OID 23580)
-- Name: plano_contas plano_contas_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.plano_contas
    ADD CONSTRAINT plano_contas_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5285 (class 2606 OID 23985)
-- Name: politicas_lgpd politicas_lgpd_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.politicas_lgpd
    ADD CONSTRAINT politicas_lgpd_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5260 (class 2606 OID 23622)
-- Name: transacoes transacoes_criado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_criado_por_fkey FOREIGN KEY (criado_por) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5261 (class 2606 OID 23617)
-- Name: transacoes transacoes_id_conta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_conta_fkey FOREIGN KEY (id_conta) REFERENCES public.contas_bancarias(id);


--
-- TOC entry 5262 (class 2606 OID 23612)
-- Name: transacoes transacoes_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoas(id_pessoa);


--
-- TOC entry 5263 (class 2606 OID 23607)
-- Name: transacoes transacoes_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5251 (class 2606 OID 23475)
-- Name: usuarios usuarios_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE;


--
-- TOC entry 5487 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO desenvolvedor;


-- Completed on 2026-05-28 10:19:23

--
-- PostgreSQL database dump complete
--

\unrestrict g88gUfCTrnH9v6Z4Z83dZldbjphc6EHvcIDf32ANFWQVsxAcrrL1aF1oeWh2ucQ

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict WGpYgKBhXop8ohW3xg8ZBkYwSNzmypA5xBAdE9dGQmSmwPl348VvRgCoiXNQaWm

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-28 10:19:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2026-05-28 10:19:24

--
-- PostgreSQL database dump complete
--

\unrestrict WGpYgKBhXop8ohW3xg8ZBkYwSNzmypA5xBAdE9dGQmSmwPl348VvRgCoiXNQaWm

-- Completed on 2026-05-28 10:19:24

--
-- PostgreSQL database cluster dump complete
--

