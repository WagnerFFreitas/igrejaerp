--
-- PostgreSQL database dump
--

\restrict EcQLZD2OevJ81rHw3SFgGRrahgfVdYV4oE1kwpcTXjZjNiuQHm3FeXckd1l09iW

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-26 16:20:56

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
-- TOC entry 6191 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'Schema principal do ADJPA ERP';


--
-- TOC entry 3 (class 3079 OID 18133)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 6192 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 2 (class 3079 OID 18122)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 6193 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1081 (class 1247 OID 19192)
-- Name: account_nature; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.account_nature AS ENUM (
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'INCOME',
    'EXPENSE'
);


ALTER TYPE public.account_nature OWNER TO desenvolvedor;

--
-- TOC entry 1060 (class 1247 OID 19124)
-- Name: account_status_type; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.account_status_type AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'BLOCKED'
);


ALTER TYPE public.account_status_type OWNER TO desenvolvedor;

--
-- TOC entry 1057 (class 1247 OID 19114)
-- Name: account_type; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.account_type AS ENUM (
    'CASH',
    'BANK',
    'SAVINGS',
    'INVESTMENT'
);


ALTER TYPE public.account_type OWNER TO desenvolvedor;

--
-- TOC entry 1084 (class 1247 OID 19204)
-- Name: account_type_level; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.account_type_level AS ENUM (
    'SYNTHETIC',
    'ANALYTIC'
);


ALTER TYPE public.account_type_level OWNER TO desenvolvedor;

--
-- TOC entry 1078 (class 1247 OID 19180)
-- Name: asset_condition; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.asset_condition AS ENUM (
    'NOVO',
    'BOM',
    'REGULAR',
    'RUIM',
    'SUCATA'
);


ALTER TYPE public.asset_condition OWNER TO desenvolvedor;

--
-- TOC entry 1072 (class 1247 OID 19162)
-- Name: asset_status; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.asset_status AS ENUM (
    'ATIVO',
    'MANUTENCAO',
    'OCIOSO',
    'BAIXADO',
    'SUCATA'
);


ALTER TYPE public.asset_status OWNER TO desenvolvedor;

--
-- TOC entry 1069 (class 1247 OID 19148)
-- Name: asset_type; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.asset_type AS ENUM (
    'IMOVEIS',
    'VEICULOS',
    'EQUIPAMENTOS',
    'MOVEIS',
    'COMPUTADORES',
    'MAQUINAS'
);


ALTER TYPE public.asset_type OWNER TO desenvolvedor;

--
-- TOC entry 1075 (class 1247 OID 19174)
-- Name: depreciation_method; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.depreciation_method AS ENUM (
    'LINEAR',
    'ACELERADA'
);


ALTER TYPE public.depreciation_method OWNER TO desenvolvedor;

--
-- TOC entry 1039 (class 1247 OID 19048)
-- Name: employment_regime; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.employment_regime AS ENUM (
    'CLT',
    'PRO_LABORE',
    'ESTAGIO',
    'AUTONOMO'
);


ALTER TYPE public.employment_regime OWNER TO desenvolvedor;

--
-- TOC entry 1063 (class 1247 OID 19132)
-- Name: event_type; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.event_type AS ENUM (
    'SERVICE',
    'MEETING',
    'EVENT'
);


ALTER TYPE public.event_type OWNER TO desenvolvedor;

--
-- TOC entry 1033 (class 1247 OID 19030)
-- Name: gender; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.gender AS ENUM (
    'M',
    'F',
    'OTHER'
);


ALTER TYPE public.gender OWNER TO desenvolvedor;

--
-- TOC entry 1045 (class 1247 OID 19076)
-- Name: leave_status; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.leave_status AS ENUM (
    'SCHEDULED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.leave_status OWNER TO desenvolvedor;

--
-- TOC entry 1042 (class 1247 OID 19058)
-- Name: leave_type; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.leave_type AS ENUM (
    'VACATION',
    'MEDICAL',
    'MATERNITY',
    'PATERNITY',
    'MILITARY',
    'WEDDING',
    'BEREAVEMENT',
    'UNPAID'
);


ALTER TYPE public.leave_type OWNER TO desenvolvedor;

--
-- TOC entry 1036 (class 1247 OID 19038)
-- Name: marital_status; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.marital_status AS ENUM (
    'SINGLE',
    'MARRIED',
    'DIVORCED',
    'WIDOWED'
);


ALTER TYPE public.marital_status OWNER TO desenvolvedor;

--
-- TOC entry 1027 (class 1247 OID 19010)
-- Name: member_role; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.member_role AS ENUM (
    'MEMBER',
    'VISITOR',
    'VOLUNTEER',
    'STAFF',
    'LEADER'
);


ALTER TYPE public.member_role OWNER TO desenvolvedor;

--
-- TOC entry 1030 (class 1247 OID 19022)
-- Name: member_status; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.member_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING'
);


ALTER TYPE public.member_status OWNER TO desenvolvedor;

--
-- TOC entry 1087 (class 1247 OID 19210)
-- Name: normal_balance; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.normal_balance AS ENUM (
    'DEBIT',
    'CREDIT'
);


ALTER TYPE public.normal_balance OWNER TO desenvolvedor;

--
-- TOC entry 1054 (class 1247 OID 19098)
-- Name: payment_method; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.payment_method AS ENUM (
    'PIX',
    'CASH',
    'CREDIT_CARD',
    'TRANSFER',
    'DEBIT_CARD',
    'CHECK',
    'BOLETO'
);


ALTER TYPE public.payment_method OWNER TO desenvolvedor;

--
-- TOC entry 1066 (class 1247 OID 19140)
-- Name: recurrence_pattern; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.recurrence_pattern AS ENUM (
    'NONE',
    'WEEKLY',
    'MONTHLY'
);


ALTER TYPE public.recurrence_pattern OWNER TO desenvolvedor;

--
-- TOC entry 1051 (class 1247 OID 19092)
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.transaction_status AS ENUM (
    'PAID',
    'PENDING'
);


ALTER TYPE public.transaction_status OWNER TO desenvolvedor;

--
-- TOC entry 1048 (class 1247 OID 19086)
-- Name: transaction_type; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.transaction_type AS ENUM (
    'INCOME',
    'EXPENSE'
);


ALTER TYPE public.transaction_type OWNER TO desenvolvedor;

--
-- TOC entry 1024 (class 1247 OID 19002)
-- Name: unit_status; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.unit_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING'
);


ALTER TYPE public.unit_status OWNER TO desenvolvedor;

--
-- TOC entry 1018 (class 1247 OID 18977)
-- Name: user_role; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.user_role AS ENUM (
    'ADMIN',
    'SECRETARY',
    'TREASURER',
    'PASTOR',
    'RH',
    'DP',
    'FINANCEIRO',
    'DEVELOPER'
);


ALTER TYPE public.user_role OWNER TO desenvolvedor;

--
-- TOC entry 1021 (class 1247 OID 18994)
-- Name: user_status; Type: TYPE; Schema: public; Owner: desenvolvedor
--

CREATE TYPE public.user_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public.user_status OWNER TO desenvolvedor;

--
-- TOC entry 342 (class 1255 OID 22077)
-- Name: atualizar_data_atualizacao(); Type: FUNCTION; Schema: public; Owner: desenvolvedor
--

CREATE FUNCTION public.atualizar_data_atualizacao() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.data_atualizacao = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.atualizar_data_atualizacao() OWNER TO desenvolvedor;

--
-- TOC entry 340 (class 1255 OID 21348)
-- Name: atualizar_timestamp_alteracao(); Type: FUNCTION; Schema: public; Owner: desenvolvedor
--

CREATE FUNCTION public.atualizar_timestamp_alteracao() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    BEGIN
        NEW.atualizado_em = CURRENT_TIMESTAMP;
    EXCEPTION WHEN undefined_column THEN
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
        EXCEPTION WHEN undefined_column THEN
        END;
    END;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.atualizar_timestamp_alteracao() OWNER TO desenvolvedor;

--
-- TOC entry 341 (class 1255 OID 19940)
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
-- TOC entry 339 (class 1255 OID 19772)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: desenvolvedor
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO desenvolvedor;

--
-- TOC entry 343 (class 1255 OID 22252)
-- Name: validar_usuario_pessoa(); Type: FUNCTION; Schema: public; Owner: desenvolvedor
--

CREATE FUNCTION public.validar_usuario_pessoa() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM membros WHERE id_pessoa = NEW.id_pessoa)
       OR EXISTS (SELECT 1 FROM funcionarios WHERE id_pessoa = NEW.id_pessoa) THEN
        RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Pessoa não autorizada para acesso';
END;
$$;


ALTER FUNCTION public.validar_usuario_pessoa() OWNER TO desenvolvedor;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 249 (class 1259 OID 19557)
-- Name: account_balances; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.account_balances (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_conta uuid CONSTRAINT account_balances_account_id_not_null NOT NULL,
    nome_conta character varying(255) CONSTRAINT account_balances_account_name_not_null NOT NULL,
    codigo_conta character varying(20) CONSTRAINT account_balances_account_code_not_null NOT NULL,
    nature public.account_nature NOT NULL,
    period character varying(7) NOT NULL,
    saldo_inicial numeric(15,2) DEFAULT 0,
    debit_period numeric(15,2) DEFAULT 0,
    credit_period numeric(15,2) DEFAULT 0,
    saldo_final numeric(15,2) DEFAULT 0,
    quantidade_lancamentos integer DEFAULT 0
);


ALTER TABLE public.account_balances OWNER TO desenvolvedor;

--
-- TOC entry 255 (class 1259 OID 19739)
-- Name: accounting_configs; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.accounting_configs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    ano_fiscal integer CONSTRAINT accounting_configs_fiscal_year_not_null NOT NULL,
    mes_inicio integer CONSTRAINT accounting_configs_start_month_not_null NOT NULL,
    mes_fim integer CONSTRAINT accounting_configs_end_month_not_null NOT NULL,
    moeda character varying(3) DEFAULT 'BRL'::character varying,
    regime_tributario character varying(20) DEFAULT 'ISENTO'::character varying,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT accounting_configs_end_month_check CHECK (((mes_fim >= 1) AND (mes_fim <= 12))),
    CONSTRAINT accounting_configs_start_month_check CHECK (((mes_inicio >= 1) AND (mes_inicio <= 12))),
    CONSTRAINT accounting_configs_tax_regime_check CHECK (((regime_tributario)::text = ANY ((ARRAY['SIMPLES'::character varying, 'LUCRO_PRESUMIDO'::character varying, 'ISENTO'::character varying])::text[])))
);


ALTER TABLE public.accounting_configs OWNER TO desenvolvedor;

--
-- TOC entry 248 (class 1259 OID 19528)
-- Name: accounting_entries; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.accounting_entries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    numero_lancamento integer CONSTRAINT accounting_entries_entry_number_not_null NOT NULL,
    data_lancamento date CONSTRAINT accounting_entries_entry_date_not_null NOT NULL,
    numero_documento character varying(100),
    historico text CONSTRAINT accounting_entries_history_not_null NOT NULL,
    complement text,
    valor_debito numeric(15,2) CONSTRAINT accounting_entries_debit_value_not_null NOT NULL,
    valor_credito numeric(15,2) CONSTRAINT accounting_entries_credit_value_not_null NOT NULL,
    conta_contrapartida character varying(50),
    transaction_id uuid,
    project_id uuid,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    criado_por character varying(255) CONSTRAINT accounting_entries_created_by_not_null NOT NULL,
    revisado_por character varying(255),
    status character varying(20) DEFAULT 'DRAFT'::character varying,
    CONSTRAINT accounting_entries_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'POSTED'::character varying, 'REVERSED'::character varying])::text[])))
);


ALTER TABLE public.accounting_entries OWNER TO desenvolvedor;

--
-- TOC entry 226 (class 1259 OID 18327)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    nome_conta text CONSTRAINT accounts_name_not_null NOT NULL,
    tipo_conta text CONSTRAINT accounts_type_not_null NOT NULL,
    nome_banco text,
    agency text,
    numero_conta text,
    saldo_atual numeric(15,2) DEFAULT 0.00,
    currency text DEFAULT 'BRL'::text,
    esta_ativo boolean DEFAULT true,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    CONSTRAINT accounts_type_check CHECK ((tipo_conta = ANY (ARRAY['CHECKING'::text, 'SAVINGS'::text, 'INVESTMENT'::text, 'CASH'::text])))
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 18218)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    nome text CONSTRAINT employees_employee_name_not_null NOT NULL,
    cpf text NOT NULL,
    rg text,
    ctps text,
    ctps_serie text,
    pis text,
    birth_date date,
    sexo text,
    estado_civil text,
    blood_type text,
    email text,
    telefone text,
    celular text,
    emergency_contact text,
    naturalidade text,
    escolaridade text,
    raca_cor text,
    nome_mae text,
    nome_pai text,
    deficiencia text,
    deficiencia_obs text,
    avatar text,
    observacoes_saude text,
    cep text,
    logradouro text,
    numero text,
    complemento text,
    bairro text,
    cidade text,
    estado text,
    address_country text,
    matricula text,
    cargo text,
    funcao text,
    departamento text,
    cbo text,
    data_admissao date,
    data_demissao date,
    tipo_contrato text,
    regime_trabalho text,
    sindicato text,
    convencao_coletiva text,
    salario_base numeric(10,2),
    tipo_salario text,
    forma_pagamento text,
    dia_pagamento text,
    jornada_trabalho text,
    escala_trabalho text,
    horario_entrada time without time zone,
    horario_saida time without time zone,
    inicio_intervalo time without time zone,
    fim_intervalo time without time zone,
    duracao_intervalo time without time zone,
    segunda_a_sexta text,
    sabado text,
    trabalha_feriados boolean DEFAULT false,
    controla_intervalo boolean DEFAULT false,
    horas_extras_autorizadas boolean DEFAULT false,
    tipo_registro_ponto text,
    tolerancia_ponto text,
    codigo_horario text,
    banco text,
    codigo_banco text,
    agencia text,
    conta text,
    tipo_conta text,
    titular text,
    chave_pix text,
    vt_ativo boolean DEFAULT false,
    vt_valor_diario numeric(5,2),
    vt_qtd_vales_dia integer,
    vale_transporte_total numeric(10,2),
    va_ativo boolean DEFAULT false,
    va_operadora text,
    vale_alimentacao numeric(10,2),
    vr_ativo boolean DEFAULT false,
    vr_operadora text,
    vale_refeicao numeric(10,2),
    ps_ativo boolean DEFAULT false,
    ps_operadora text,
    ps_tipo_plano text,
    ps_carteirinha text,
    plano_saude_colaborador numeric(10,2),
    ps_dependentes_ativo boolean DEFAULT false,
    plano_saude_dependentes numeric(10,2),
    po_ativo boolean DEFAULT false,
    po_operadora text,
    po_carteirinha text,
    plano_odontologico numeric(10,2),
    auxilio_moradia numeric(10,2),
    vale_farmacia numeric(10,2),
    seguro_vida numeric(10,2),
    auxilio_creche numeric(10,2),
    auxilio_educacao numeric(10,2),
    gympass_plano text,
    titulo_eleitor text,
    titulo_eleitor_zona text,
    titulo_eleitor_secao text,
    reservista text,
    cnh_numero text,
    cnh_categoria text,
    cnh_vencimento date,
    aso_data date,
    esocial_categoria text,
    esocial_matricula text,
    esocial_natureza_atividade text,
    esocial_tipo_regime_prev text,
    esocial_tipo_regime_trab text,
    esocial_indicativo_admissao text,
    esocial_tipo_jornada text,
    esocial_descricao_jornada text,
    esocial_contrato_parcial boolean DEFAULT false,
    esocial_teletrabalho boolean DEFAULT false,
    esocial_clausula_asseguratoria boolean DEFAULT false,
    esocial_sucessao_trab boolean DEFAULT false,
    esocial_tipo_admissao text,
    esocial_cnpj_anterior text,
    esocial_matricula_anterior text,
    esocial_data_admissao_origem date,
    ativo boolean DEFAULT true,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    created_by uuid,
    dados_perfil jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT employees_cpf_check CHECK ((cpf ~ '^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$'::text)),
    CONSTRAINT employees_estado_civil_check CHECK ((estado_civil = ANY (ARRAY['SOLTEIRO'::text, 'CASADO'::text, 'DIVORCIADO'::text, 'VIUVO'::text]))),
    CONSTRAINT employees_forma_pagamento_check CHECK ((forma_pagamento = ANY (ARRAY['TRANSFERENCIA'::text, 'PIX'::text, 'CHEQUE'::text, 'DINHEIRO'::text]))),
    CONSTRAINT employees_matricula_check CHECK (((matricula IS NULL) OR (matricula ~ '^[0-9]{4,}$'::text) OR (matricula ~ '^F[0-9]{2,}/[0-9]{4}$'::text))),
    CONSTRAINT employees_regime_trabalho_check CHECK ((regime_trabalho = ANY (ARRAY['PRESENCIAL'::text, 'HIBRIDO'::text, 'REMOTO'::text]))),
    CONSTRAINT employees_sexo_check CHECK ((sexo = ANY (ARRAY['M'::text, 'F'::text, 'O'::text]))),
    CONSTRAINT employees_tipo_conta_check CHECK ((tipo_conta = ANY (ARRAY['CORRENTE'::text, 'POUPANCA'::text]))),
    CONSTRAINT employees_tipo_contrato_check CHECK ((tipo_contrato = ANY (ARRAY['CLT'::text, 'PJ'::text, 'VOLUNTARIO'::text, 'TEMPORARIO'::text]))),
    CONSTRAINT employees_tipo_salario_check CHECK ((tipo_salario = ANY (ARRAY['MENSAL'::text, 'HORISTA'::text, 'COMISSIONADO'::text])))
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 6194 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE employees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employees IS 'FuncionÃ¡rios e colaboradores';


--
-- TOC entry 221 (class 1259 OID 18171)
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome_unidade text CONSTRAINT units_name_not_null NOT NULL,
    cnpj text,
    endereco text,
    bairro text,
    cidade text,
    estado text,
    cep text,
    country text DEFAULT 'BR'::text,
    telefone text,
    email text,
    website text,
    pastor_name text,
    pastor_phone text,
    sede boolean DEFAULT false,
    status text DEFAULT 'ACTIVE'::text,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    criado_por uuid,
    endereco_linha1 text,
    endereco_linha2 text,
    CONSTRAINT units_cnpj_check CHECK (((cnpj ~ '^[0-9]{2}\.[0-9]{3}\.[0-9]{3}/[0-9]{4}-[0-9]{2}$'::text) OR (cnpj IS NULL))),
    CONSTRAINT units_name_check CHECK ((length(nome_unidade) >= 3)),
    CONSTRAINT units_status_check CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'SUSPENDED'::text])))
);


ALTER TABLE public.units OWNER TO postgres;

--
-- TOC entry 6195 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE units; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.units IS 'Unidades da igreja (matriz e filiais)';


--
-- TOC entry 229 (class 1259 OID 18736)
-- Name: active_employees; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_employees AS
 SELECT e.id,
    e.id_unidade AS unit_id,
    e.nome,
    e.cpf,
    e.rg,
    e.ctps,
    e.ctps_serie,
    e.pis,
    e.birth_date,
    e.sexo,
    e.estado_civil,
    e.blood_type,
    e.email,
    e.telefone,
    e.celular,
    e.emergency_contact,
    e.naturalidade,
    e.escolaridade,
    e.raca_cor,
    e.nome_mae,
    e.nome_pai,
    e.deficiencia,
    e.deficiencia_obs,
    e.avatar,
    e.observacoes_saude,
    e.cep,
    e.logradouro,
    e.numero,
    e.complemento,
    e.bairro,
    e.cidade,
    e.estado,
    e.address_country,
    e.matricula,
    e.cargo,
    e.funcao,
    e.departamento,
    e.cbo,
    e.data_admissao,
    e.data_demissao,
    e.tipo_contrato,
    e.regime_trabalho,
    e.sindicato,
    e.convencao_coletiva,
    e.salario_base,
    e.tipo_salario,
    e.forma_pagamento,
    e.dia_pagamento,
    e.jornada_trabalho,
    e.escala_trabalho,
    e.horario_entrada,
    e.horario_saida,
    e.inicio_intervalo,
    e.fim_intervalo,
    e.duracao_intervalo,
    e.segunda_a_sexta,
    e.sabado,
    e.trabalha_feriados,
    e.controla_intervalo,
    e.horas_extras_autorizadas,
    e.tipo_registro_ponto,
    e.tolerancia_ponto,
    e.codigo_horario,
    e.banco,
    e.codigo_banco,
    e.agencia,
    e.conta,
    e.tipo_conta,
    e.titular,
    e.chave_pix,
    e.vt_ativo,
    e.vt_valor_diario,
    e.vt_qtd_vales_dia,
    e.vale_transporte_total,
    e.va_ativo,
    e.va_operadora,
    e.vale_alimentacao,
    e.vr_ativo,
    e.vr_operadora,
    e.vale_refeicao,
    e.ps_ativo,
    e.ps_operadora,
    e.ps_tipo_plano,
    e.ps_carteirinha,
    e.plano_saude_colaborador,
    e.ps_dependentes_ativo,
    e.plano_saude_dependentes,
    e.po_ativo,
    e.po_operadora,
    e.po_carteirinha,
    e.plano_odontologico,
    e.auxilio_moradia,
    e.vale_farmacia,
    e.seguro_vida,
    e.auxilio_creche,
    e.auxilio_educacao,
    e.gympass_plano,
    e.titulo_eleitor,
    e.titulo_eleitor_zona,
    e.titulo_eleitor_secao,
    e.reservista,
    e.cnh_numero,
    e.cnh_categoria,
    e.cnh_vencimento,
    e.aso_data,
    e.esocial_categoria,
    e.esocial_matricula,
    e.esocial_natureza_atividade,
    e.esocial_tipo_regime_prev,
    e.esocial_tipo_regime_trab,
    e.esocial_indicativo_admissao,
    e.esocial_tipo_jornada,
    e.esocial_descricao_jornada,
    e.esocial_contrato_parcial,
    e.esocial_teletrabalho,
    e.esocial_clausula_asseguratoria,
    e.esocial_sucessao_trab,
    e.esocial_tipo_admissao,
    e.esocial_cnpj_anterior,
    e.esocial_matricula_anterior,
    e.esocial_data_admissao_origem,
    e.ativo AS is_active,
    e.criado AS created_at,
    e.atualizado AS updated_at,
    e.created_by,
    u.nome_unidade AS unit_name,
        CASE
            WHEN ((e.data_demissao IS NULL) OR (e.data_demissao > CURRENT_DATE)) THEN 'ATIVO'::text
            ELSE 'INATIVO'::text
        END AS current_status
   FROM (public.employees e
     JOIN public.units u ON ((e.id_unidade = u.id)))
  WHERE (e.ativo = true);


ALTER VIEW public.active_employees OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18263)
-- Name: membros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membros (
    id uuid DEFAULT public.uuid_generate_v4() CONSTRAINT members_id_not_null NOT NULL,
    id_unidade uuid,
    nome text CONSTRAINT members_name_not_null NOT NULL,
    cpf text,
    rg text,
    email text,
    telefone text,
    whatsapp text,
    data_nascimento date,
    sexo text,
    estado_civil text,
    logradouro text,
    bairro text,
    cidade text,
    estado text,
    cep text,
    data_conversao date,
    data_batismo text,
    data_membro date,
    status text DEFAULT 'ATIVO'::text,
    funcao text,
    ministerio text,
    grupo_pequeno text,
    dizimista boolean DEFAULT true,
    ofertante boolean DEFAULT true,
    valor_dizimo numeric(10,2),
    observacoes text,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    dados_perfil jsonb DEFAULT '{}'::jsonb,
    matricula character varying(50),
    profissao character varying(100),
    nome_conjuge character varying(255),
    data_casamento date,
    nome_pai character varying(255),
    nome_mae character varying(255),
    tipo_sanguineo character varying(10),
    contato_emergencia character varying(100),
    numero character varying(20),
    complemento character varying(100),
    local_conversao character varying(255),
    igreja_batismo character varying(255),
    pastor_batizador character varying(255),
    batismo_espirito_santo boolean DEFAULT false,
    igreja_origem character varying(255),
    curso_discipulado character varying(20) DEFAULT 'NAO_INICIADO'::character varying,
    escola_biblica character varying(20) DEFAULT 'INATIVO'::character varying,
    ministerio_principal character varying(100),
    funcao_ministerio character varying(100),
    outros_ministerios text[],
    cargo_eclesiastico character varying(100),
    data_consagracao date,
    ofertante_regular boolean DEFAULT false,
    participa_campanhas boolean DEFAULT false,
    banco character varying(100),
    agencia_bancaria character varying(20),
    conta_bancaria character varying(50),
    chave_pix character varying(100),
    necessidades_especiais text,
    talentos text,
    tags text[],
    familia_id uuid,
    avatar text,
    cell_group character varying(100),
    dons_espirituais character varying(255),
    escolaridade character varying(100),
    is_pcd boolean DEFAULT false,
    tipo_deficiencia character varying(100),
    celular character varying(20),
    lgpd_consent jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT members_cpf_check CHECK (((cpf ~ '^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$'::text) OR (cpf IS NULL))),
    CONSTRAINT members_gender_check CHECK ((sexo = ANY (ARRAY['M'::text, 'F'::text, 'OTHER'::text]))),
    CONSTRAINT members_marital_status_check CHECK ((estado_civil = ANY (ARRAY['SINGLE'::text, 'MARRIED'::text, 'DIVORCED'::text, 'WIDOWED'::text]))),
    CONSTRAINT members_status_check CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'PENDING'::text])))
);


ALTER TABLE public.membros OWNER TO postgres;

--
-- TOC entry 6196 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE membros; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.membros IS 'Membros da igreja com dados completos';


--
-- TOC entry 230 (class 1259 OID 18741)
-- Name: active_members; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_members AS
 SELECT m.id,
    m.id_unidade AS unit_id,
    m.nome,
    m.cpf,
    m.rg,
    m.email,
    m.telefone,
    m.whatsapp AS celular,
    m.data_nascimento,
    m.sexo,
    m.estado_civil,
    m.logradouro,
    m.bairro,
    m.cidade,
    m.estado,
    m.cep,
    m.data_conversao,
    m.data_batismo,
    m.data_membro,
    m.status AS status_membro,
    m.funcao AS cargo_igreja,
    m.ministerio,
    m.grupo_pequeno,
    m.dizimista,
    m.ofertante,
    m.valor_dizimo,
    m.observacoes,
    m.criado AS created_at,
    m.atualizado AS updated_at,
    u.nome_unidade AS unit_name
   FROM (public.membros m
     JOIN public.units u ON ((m.id_unidade = u.id)))
  WHERE (m.status = 'ATIVO'::text);


ALTER VIEW public.active_members OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 19915)
-- Name: app_audit_logs; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.app_audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    usuario_id uuid,
    nome_usuario character varying(255) CONSTRAINT app_audit_logs_user_name_not_null NOT NULL,
    action character varying(100) NOT NULL,
    entidade character varying(100) CONSTRAINT app_audit_logs_entity_not_null NOT NULL,
    id_entidade character varying(255),
    nome_entidade character varying(255),
    data_evento timestamp with time zone DEFAULT CURRENT_TIMESTAMP CONSTRAINT app_audit_logs_event_date_not_null NOT NULL,
    ip character varying(100) NOT NULL,
    agente_usuario text,
    details jsonb,
    success boolean DEFAULT true NOT NULL,
    mensagem_erro text,
    hash_anterior character varying(255),
    hash character varying(255) NOT NULL,
    imutavel boolean DEFAULT true CONSTRAINT app_audit_logs_immutable_not_null NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.app_audit_logs OWNER TO desenvolvedor;

--
-- TOC entry 261 (class 1259 OID 19854)
-- Name: app_permission_modules; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.app_permission_modules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    codigo character varying(100) CONSTRAINT app_permission_modules_code_not_null NOT NULL,
    name character varying(255) NOT NULL,
    categoria character varying(100) CONSTRAINT app_permission_modules_category_not_null NOT NULL,
    description text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.app_permission_modules OWNER TO desenvolvedor;

--
-- TOC entry 262 (class 1259 OID 19870)
-- Name: app_role_permissions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.app_role_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role character varying(50) NOT NULL,
    codigo_modulo character varying(100) CONSTRAINT app_role_permissions_module_code_not_null NOT NULL,
    ler boolean DEFAULT false,
    escrever boolean DEFAULT false,
    excluir boolean DEFAULT false,
    gerenciar boolean DEFAULT false,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    administrador boolean DEFAULT false
);


ALTER TABLE public.app_role_permissions OWNER TO desenvolvedor;

--
-- TOC entry 263 (class 1259 OID 19892)
-- Name: app_user_permissions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.app_user_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid CONSTRAINT app_user_permissions_user_id_not_null NOT NULL,
    codigo_modulo character varying(100) CONSTRAINT app_user_permissions_module_code_not_null NOT NULL,
    ler boolean,
    escrever boolean,
    excluir boolean,
    gerenciar boolean,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    administrador boolean
);


ALTER TABLE public.app_user_permissions OWNER TO desenvolvedor;

--
-- TOC entry 241 (class 1259 OID 19324)
-- Name: asset_depreciations; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.asset_depreciations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ativo_id uuid CONSTRAINT asset_depreciations_asset_id_not_null NOT NULL,
    unit_id uuid NOT NULL,
    mes_referencia integer CONSTRAINT asset_depreciations_reference_month_not_null NOT NULL,
    ano_referencia integer CONSTRAINT asset_depreciations_reference_year_not_null NOT NULL,
    valor_contabil_inicial numeric(15,2) CONSTRAINT asset_depreciations_beginning_book_value_not_null NOT NULL,
    despesa_depreciacao numeric(15,2) CONSTRAINT asset_depreciations_depreciation_expense_not_null NOT NULL,
    depreciacao_acumulada numeric(15,2) CONSTRAINT asset_depreciations_accumulated_depreciation_not_null NOT NULL,
    valor_contabil_final numeric(15,2) CONSTRAINT asset_depreciations_ending_book_value_not_null NOT NULL,
    conta_debito character varying(50),
    conta_credito character varying(50),
    numero_documento character varying(100),
    processado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT asset_depreciations_reference_month_check CHECK (((mes_referencia >= 1) AND (mes_referencia <= 12)))
);


ALTER TABLE public.asset_depreciations OWNER TO desenvolvedor;

--
-- TOC entry 243 (class 1259 OID 19386)
-- Name: asset_maintenances; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.asset_maintenances (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    asset_id uuid NOT NULL,
    unit_id uuid NOT NULL,
    data_manutencao date CONSTRAINT asset_maintenances_maintenance_date_not_null NOT NULL,
    tipo_manutencao character varying(20) CONSTRAINT asset_maintenances_maintenance_type_not_null NOT NULL,
    descricao text CONSTRAINT asset_maintenances_description_not_null NOT NULL,
    fornecedor character varying(255),
    custo numeric(15,2),
    numero_documento character varying(100),
    proxima_manutencao date,
    executado_por character varying(255),
    situacao character varying(20) DEFAULT 'PROGRAMADA'::character varying,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT asset_maintenances_maintenance_type_check CHECK (((tipo_manutencao)::text = ANY ((ARRAY['PREVENTIVA'::character varying, 'CORRETIVA'::character varying, 'MELHORIA'::character varying])::text[]))),
    CONSTRAINT asset_maintenances_status_check CHECK (((situacao)::text = ANY ((ARRAY['PROGRAMADA'::character varying, 'REALIZADA'::character varying, 'CANCELADA'::character varying])::text[])))
);


ALTER TABLE public.asset_maintenances OWNER TO desenvolvedor;

--
-- TOC entry 228 (class 1259 OID 18544)
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid,
    nome text CONSTRAINT assets_name_not_null NOT NULL,
    descricao text,
    categoria text CONSTRAINT assets_category_not_null NOT NULL,
    data_aquisicao date,
    valor_aquisicao numeric(15,2),
    valor_atual numeric(15,2),
    taxa_depreciacao numeric(5,2),
    localizacao text,
    condicao text DEFAULT 'BOM'::text,
    numero_ativo text,
    situacao text DEFAULT 'ATIVO'::text,
    vida_util_meses integer,
    metodo_depreciacao text DEFAULT 'LINEAR'::text,
    valor_contabil_atual numeric(15,2),
    depreciacao_acumulada numeric(15,2) DEFAULT 0.00,
    funcionario_responsavel_id uuid,
    nota_fiscal_aquisicao text,
    numero_serie text,
    validade_garantia date,
    notas_manutencao text,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    cep character varying(10),
    logradouro text,
    numero character varying(20),
    complemento character varying(100),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    CONSTRAINT assets_category_check CHECK ((categoria = ANY (ARRAY['IMOVEIS'::text, 'VEICULOS'::text, 'EQUIPAMENTOS'::text, 'MOBILIARIO'::text, 'TECNOLOGIA'::text, 'OUTROS'::text]))),
    CONSTRAINT assets_condition_check CHECK ((condicao = ANY (ARRAY['OTIMO'::text, 'BOM'::text, 'REGULAR'::text, 'RUIM'::text]))),
    CONSTRAINT assets_depreciation_check CHECK (((taxa_depreciacao >= (0)::numeric) AND (taxa_depreciacao <= (100)::numeric))),
    CONSTRAINT assets_depreciation_method_check CHECK ((metodo_depreciacao = ANY (ARRAY['LINEAR'::text, 'DECLINING'::text]))),
    CONSTRAINT assets_status_check CHECK ((situacao = ANY (ARRAY['ATIVO'::text, 'INATIVO'::text, 'MANUTENCAO'::text, 'BAIXADO'::text]))),
    CONSTRAINT assets_value_check CHECK ((valor_aquisicao > (0)::numeric))
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- TOC entry 6197 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE assets; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.assets IS 'PatrimÃ´nio e bens da igreja';


--
-- TOC entry 257 (class 1259 OID 19786)
-- Name: asset_summary_by_unit; Type: VIEW; Schema: public; Owner: desenvolvedor
--

CREATE VIEW public.asset_summary_by_unit AS
 SELECT u.id AS unit_id,
    u.nome_unidade,
    count(a.id) AS total_ativos,
    sum(a.valor_aquisicao) AS valor_total_aquisicao,
    sum(a.valor_atual) AS valor_total_atual,
    sum(a.depreciacao_acumulada) AS depreciacao_total,
    count(
        CASE
            WHEN (a.situacao = 'ATIVO'::text) THEN 1
            ELSE NULL::integer
        END) AS ativos_ativos
   FROM (public.units u
     LEFT JOIN public.assets a ON ((u.id = a.unit_id)))
  GROUP BY u.id, u.nome_unidade;


ALTER VIEW public.asset_summary_by_unit OWNER TO desenvolvedor;

--
-- TOC entry 242 (class 1259 OID 19353)
-- Name: asset_transfers; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.asset_transfers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ativo_id uuid CONSTRAINT asset_transfers_asset_id_not_null NOT NULL,
    unidade_origem_id uuid CONSTRAINT asset_transfers_from_unit_id_not_null NOT NULL,
    unidade_destino_id uuid CONSTRAINT asset_transfers_to_unit_id_not_null NOT NULL,
    data_transferencia date CONSTRAINT asset_transfers_transfer_date_not_null NOT NULL,
    motivo text CONSTRAINT asset_transfers_reason_not_null NOT NULL,
    responsavel character varying(255) CONSTRAINT asset_transfers_responsible_not_null NOT NULL,
    autorizado_por character varying(255),
    observacoes text,
    situacao character varying(20) DEFAULT 'PENDENTE'::character varying,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT asset_transfers_status_check CHECK (((situacao)::text = ANY ((ARRAY['PENDENTE'::character varying, 'REALIZADA'::character varying, 'CANCELADA'::character varying])::text[])))
);


ALTER TABLE public.asset_transfers OWNER TO desenvolvedor;

--
-- TOC entry 253 (class 1259 OID 19691)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    usuario_id uuid,
    nome_usuario character varying(255) CONSTRAINT audit_logs_user_name_not_null NOT NULL,
    acao character varying(100) CONSTRAINT audit_logs_action_not_null NOT NULL,
    entidade character varying(100) CONSTRAINT audit_logs_entity_not_null NOT NULL,
    id_entidade uuid,
    nome_entidade character varying(255),
    data_acao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    endereco_ip inet,
    details jsonb,
    success boolean DEFAULT true,
    hash character varying(64)
);


ALTER TABLE public.audit_logs OWNER TO desenvolvedor;

--
-- TOC entry 6198 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE audit_logs; Type: COMMENT; Schema: public; Owner: desenvolvedor
--

COMMENT ON TABLE public.audit_logs IS 'Logs de auditoria do sistema';


--
-- TOC entry 273 (class 1259 OID 20426)
-- Name: bank_reconciliations; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.bank_reconciliations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    conta_bancaria_id uuid,
    nome_conta_bancaria character varying(255),
    nome_banco character varying(255),
    data_inicio date NOT NULL,
    data_final date CONSTRAINT bank_reconciliations_data_fim_not_null NOT NULL,
    saldo_inicial numeric(15,2) DEFAULT 0,
    saldo_final numeric(15,2) DEFAULT 0,
    saldo_conciliado numeric(15,2) DEFAULT 0,
    diferenca numeric(15,2) DEFAULT 0,
    status character varying(20) DEFAULT 'IN_PROGRESS'::character varying,
    percentual_conciliacao numeric(5,2) DEFAULT 0,
    total_transacoes_banco integer DEFAULT 0,
    total_transacoes_sistema integer DEFAULT 0,
    transacoes_conciliadas integer DEFAULT 0,
    transacoes_nao_conciliadas integer DEFAULT 0,
    divergencias jsonb DEFAULT '[]'::jsonb,
    conciliado_por character varying(255),
    data_conciliacao timestamp with time zone,
    observacoes text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bank_reconciliations_status_check CHECK (((status)::text = ANY ((ARRAY['IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.bank_reconciliations OWNER TO desenvolvedor;

--
-- TOC entry 274 (class 1259 OID 20462)
-- Name: bank_statement_transactions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.bank_statement_transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    reconciliation_id uuid,
    bank_account_id uuid,
    data_transacao date NOT NULL,
    descricao text NOT NULL,
    valor numeric(15,2) NOT NULL,
    tipo character varying(10) NOT NULL,
    metodo_pagamento character varying(50),
    status_conciliacao character varying(20) DEFAULT 'PENDING'::character varying,
    transacao_id uuid,
    origem character varying(50) DEFAULT 'BANK_STATEMENT'::character varying,
    id_externo character varying(100),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bank_statement_transactions_status_conciliacao_check CHECK (((status_conciliacao)::text = ANY ((ARRAY['PENDING'::character varying, 'MATCHED'::character varying, 'UNMATCHED'::character varying, 'IGNORED'::character varying])::text[]))),
    CONSTRAINT bank_statement_transactions_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['CREDIT'::character varying, 'DEBIT'::character varying])::text[])))
);


ALTER TABLE public.bank_statement_transactions OWNER TO desenvolvedor;

--
-- TOC entry 250 (class 1259 OID 19581)
-- Name: cash_closings; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.cash_closings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    id_conta uuid CONSTRAINT cash_closings_account_id_not_null NOT NULL,
    data_fechamento date CONSTRAINT cash_closings_closing_date_not_null NOT NULL,
    saldo_inicial numeric(15,2) CONSTRAINT cash_closings_opening_balance_not_null NOT NULL,
    total_entradas numeric(15,2) CONSTRAINT cash_closings_total_inflows_not_null NOT NULL,
    total_saidas numeric(15,2) CONSTRAINT cash_closings_total_outflows_not_null NOT NULL,
    saldo_esperado numeric(15,2) CONSTRAINT cash_closings_expected_balance_not_null NOT NULL,
    saldo_real numeric(15,2) CONSTRAINT cash_closings_actual_balance_not_null NOT NULL,
    diferenca numeric(15,2) CONSTRAINT cash_closings_difference_not_null NOT NULL,
    situacao character varying(20) DEFAULT 'OPEN'::character varying,
    observacoes text,
    fechado_por uuid,
    fechado timestamp with time zone,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cash_closings_status_check CHECK (((situacao)::text = ANY ((ARRAY['OPEN'::character varying, 'CLOSED'::character varying, 'RECONCILING'::character varying])::text[])))
);


ALTER TABLE public.cash_closings OWNER TO desenvolvedor;

--
-- TOC entry 251 (class 1259 OID 19619)
-- Name: cash_movements; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.cash_movements (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    account_id uuid NOT NULL,
    tipo character varying(20) CONSTRAINT cash_movements_type_not_null NOT NULL,
    valor numeric(15,2) CONSTRAINT cash_movements_amount_not_null NOT NULL,
    motivo text CONSTRAINT cash_movements_reason_not_null NOT NULL,
    numero_documento character varying(100),
    responsavel uuid CONSTRAINT cash_movements_responsible_not_null NOT NULL,
    autorizado_por uuid,
    observacoes text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cash_movements_type_check CHECK (((tipo)::text = ANY ((ARRAY['WITHDRAWAL'::character varying, 'SUPPLY'::character varying])::text[])))
);


ALTER TABLE public.cash_movements OWNER TO desenvolvedor;

--
-- TOC entry 227 (class 1259 OID 18349)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid,
    nome_categoria text CONSTRAINT categories_name_not_null NOT NULL,
    tipo_categoria text CONSTRAINT categories_type_not_null NOT NULL,
    categoria_pai_id uuid,
    cor text DEFAULT '#6366f1'::text,
    icone text,
    descricao text,
    esta_ativa boolean DEFAULT true,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    CONSTRAINT categories_type_check CHECK ((tipo_categoria = ANY (ARRAY['INCOME'::text, 'EXPENSE'::text])))
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 19502)
-- Name: chart_of_accounts; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.chart_of_accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    codigo character varying(20) CONSTRAINT chart_of_accounts_code_not_null NOT NULL,
    nome character varying(255) CONSTRAINT chart_of_accounts_name_not_null NOT NULL,
    natureza public.account_nature CONSTRAINT chart_of_accounts_nature_not_null NOT NULL,
    type public.account_type_level NOT NULL,
    parent_id uuid,
    saldo_normal public.normal_balance CONSTRAINT chart_of_accounts_normal_balance_not_null NOT NULL,
    esta_ativo boolean DEFAULT true
);


ALTER TABLE public.chart_of_accounts OWNER TO desenvolvedor;

--
-- TOC entry 239 (class 1259 OID 19271)
-- Name: church_events; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.church_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    titulo character varying(255) CONSTRAINT church_events_title_not_null NOT NULL,
    descricao text,
    data_evento date CONSTRAINT church_events_event_date_not_null NOT NULL,
    hora_evento time without time zone CONSTRAINT church_events_event_time_not_null NOT NULL,
    local_evento character varying(255) CONSTRAINT church_events_location_not_null NOT NULL,
    quantidade_presentes integer DEFAULT 0,
    type public.event_type NOT NULL,
    recorrente boolean DEFAULT false,
    padrao_recorrencia public.recurrence_pattern DEFAULT 'NONE'::public.recurrence_pattern,
    data_fim_recorrencia date,
    evento_pai_id uuid,
    evento_gerado boolean DEFAULT false,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.church_events OWNER TO desenvolvedor;

--
-- TOC entry 6199 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE church_events; Type: COMMENT; Schema: public; Owner: desenvolvedor
--

COMMENT ON TABLE public.church_events IS 'Eventos e programaÃ§Ãµes da igreja';


--
-- TOC entry 290 (class 1259 OID 22214)
-- Name: contas_financeiras; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.contas_financeiras (
    id_conta uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid,
    nome character varying(100),
    tipo character varying(50),
    saldo numeric(15,2) DEFAULT 0,
    data_criacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contas_financeiras OWNER TO desenvolvedor;

--
-- TOC entry 237 (class 1259 OID 19232)
-- Name: member_contributions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.member_contributions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_membro uuid CONSTRAINT member_contributions_member_id_not_null NOT NULL,
    valor numeric(15,2) CONSTRAINT member_contributions_value_not_null NOT NULL,
    data_contribuicao date CONSTRAINT member_contributions_contribution_date_not_null NOT NULL,
    tipo character varying(20) CONSTRAINT member_contributions_type_not_null NOT NULL,
    descricao text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT member_contributions_type_check CHECK (((tipo)::text = ANY ((ARRAY['Dizimo'::character varying, 'OFFERING'::character varying, 'CAMPAIGN'::character varying])::text[])))
);


ALTER TABLE public.member_contributions OWNER TO desenvolvedor;

--
-- TOC entry 281 (class 1259 OID 21767)
-- Name: contribuicoes_membros; Type: VIEW; Schema: public; Owner: desenvolvedor
--

CREATE VIEW public.contribuicoes_membros AS
 SELECT id,
    id_membro AS membro_id,
    valor,
    data_contribuicao AS data,
    tipo,
    descricao,
    criado
   FROM public.member_contributions;


ALTER VIEW public.contribuicoes_membros OWNER TO desenvolvedor;

--
-- TOC entry 236 (class 1259 OID 19215)
-- Name: dependents; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.dependents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_membro uuid CONSTRAINT dependents_member_id_not_null NOT NULL,
    nome character varying(255) CONSTRAINT dependents_name_not_null NOT NULL,
    data_nascimento date,
    parentesco character varying(20) CONSTRAINT dependents_relationship_not_null NOT NULL,
    cpf character varying(14),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT dependents_relationship_check CHECK (((parentesco)::text = ANY ((ARRAY['FILHO'::character varying, 'FILHA'::character varying, 'CONJUGE'::character varying, 'PAI'::character varying, 'MAE'::character varying, 'OUTRO'::character varying])::text[])))
);


ALTER TABLE public.dependents OWNER TO desenvolvedor;

--
-- TOC entry 280 (class 1259 OID 21763)
-- Name: dependentes; Type: VIEW; Schema: public; Owner: desenvolvedor
--

CREATE VIEW public.dependentes AS
 SELECT id,
    id_membro AS membro_id,
    nome,
    data_nascimento,
    parentesco,
    cpf,
    criado
   FROM public.dependents;


ALTER VIEW public.dependentes OWNER TO desenvolvedor;

--
-- TOC entry 224 (class 1259 OID 18289)
-- Name: employee_dependents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_dependents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_funcionario uuid,
    nome text CONSTRAINT employee_dependents_name_not_null NOT NULL,
    data_nascimento date,
    parentesco text,
    cpf text,
    estudante boolean DEFAULT false,
    dependencia_irrf boolean DEFAULT true,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    CONSTRAINT employee_dependents_relationship_check CHECK ((parentesco = ANY (ARRAY['FILHO'::text, 'CONJUGE'::text, 'PAI'::text, 'MAE'::text, 'OUTRO'::text])))
);


ALTER TABLE public.employee_dependents OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 20872)
-- Name: employee_leaves; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.employee_leaves (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    id_funcionario uuid CONSTRAINT employee_leaves_employee_id_not_null NOT NULL,
    nome_funcionario character varying(255) CONSTRAINT employee_leaves_employee_name_not_null NOT NULL,
    tipo character varying(20) CONSTRAINT employee_leaves_type_not_null NOT NULL,
    data_inicio date CONSTRAINT employee_leaves_start_date_not_null NOT NULL,
    data_final date CONSTRAINT employee_leaves_end_date_not_null NOT NULL,
    cid10 character varying(10),
    nome_medico character varying(255),
    crm character varying(20),
    situacao character varying(20) DEFAULT 'SCHEDULED'::character varying,
    observacoes text,
    url_anexo text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_leaves OWNER TO desenvolvedor;

--
-- TOC entry 235 (class 1259 OID 18937)
-- Name: events; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_id uuid,
    titulo text CONSTRAINT events_title_not_null NOT NULL,
    descricao text,
    data_evento date CONSTRAINT events_date_not_null NOT NULL,
    hora_evento text,
    data_final date,
    hora_fim text,
    local_evento text,
    tipo_evento text DEFAULT 'SERVICE'::text,
    situacao text DEFAULT 'SCHEDULED'::text,
    maximo_presentes integer,
    quantidade_presentes integer DEFAULT 0,
    publico boolean DEFAULT true,
    criado_por uuid,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    CONSTRAINT events_status_check CHECK ((situacao = ANY (ARRAY['SCHEDULED'::text, 'ONGOING'::text, 'COMPLETED'::text, 'CANCELLED'::text]))),
    CONSTRAINT events_type_check CHECK ((tipo_evento = ANY (ARRAY['SERVICE'::text, 'MEETING'::text, 'COURSE'::text, 'RETREAT'::text, 'CONFERENCE'::text, 'OTHER'::text])))
);


ALTER TABLE public.events OWNER TO desenvolvedor;

--
-- TOC entry 238 (class 1259 OID 19252)
-- Name: financial_accounts; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.financial_accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    nome character varying(255) CONSTRAINT financial_accounts_name_not_null NOT NULL,
    tipo public.account_type CONSTRAINT financial_accounts_type_not_null NOT NULL,
    saldo_atual numeric(15,2) DEFAULT 0,
    saldo_minimo numeric(15,2),
    situacao public.account_status_type DEFAULT 'ACTIVE'::public.account_status_type,
    codigo_banco character varying(10),
    numero_agencia character varying(20),
    numero_conta character varying(50),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.financial_accounts OWNER TO desenvolvedor;

--
-- TOC entry 232 (class 1259 OID 18788)
-- Name: transactions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    id_unidade uuid,
    descricao text CONSTRAINT transactions_description_not_null NOT NULL,
    valor numeric(15,2) CONSTRAINT transactions_amount_not_null NOT NULL,
    tipo_transacao text CONSTRAINT transactions_type_not_null NOT NULL,
    id_conta uuid,
    data_transacao date CONSTRAINT transactions_date_not_null NOT NULL,
    data_vencimento date,
    data_pagamento date,
    situacao text DEFAULT 'PAID'::text,
    forma_pagamento text,
    categoria text,
    centro_custo text,
    natureza_operacao text,
    nome_fornecedor text,
    id_membro uuid,
    conciliado boolean DEFAULT false,
    observacoes text,
    created_by uuid,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    data_competencia date,
    projeto_id uuid,
    valor_pago numeric(15,2) DEFAULT 0,
    valor_restante numeric(15,2),
    parcelado boolean DEFAULT false,
    numero_parcela integer,
    total_parcelas integer,
    id_transacao_origem uuid,
    data_conciliacao date,
    id_externo character varying(100),
    CONSTRAINT transactions_amount_check CHECK ((valor > (0)::numeric)),
    CONSTRAINT transactions_payment_method_check CHECK ((forma_pagamento = ANY (ARRAY['CASH'::text, 'TRANSFER'::text, 'PIX'::text, 'CREDIT_CARD'::text, 'DEBIT_CARD'::text, 'CHECK'::text, 'OTHER'::text]))),
    CONSTRAINT transactions_status_check CHECK ((situacao = ANY (ARRAY['PAID'::text, 'PENDING'::text, 'OVERDUE'::text, 'CANCELLED'::text]))),
    CONSTRAINT transactions_type_check CHECK ((tipo_transacao = ANY (ARRAY['INCOME'::text, 'EXPENSE'::text])))
);


ALTER TABLE public.transactions OWNER TO desenvolvedor;

--
-- TOC entry 6200 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE transactions; Type: COMMENT; Schema: public; Owner: desenvolvedor
--

COMMENT ON TABLE public.transactions IS 'TransaÃ§Ãµes financeiras (receitas/despesas)';


--
-- TOC entry 256 (class 1259 OID 19781)
-- Name: financial_summary; Type: VIEW; Schema: public; Owner: desenvolvedor
--

CREATE VIEW public.financial_summary AS
 SELECT u.id AS unit_id,
    u.nome_unidade,
    count(t.id) AS total_transacoes,
    sum(
        CASE
            WHEN (t.tipo_transacao = 'INCOME'::text) THEN t.valor
            ELSE (0)::numeric
        END) AS total_receitas,
    sum(
        CASE
            WHEN (t.tipo_transacao = 'EXPENSE'::text) THEN t.valor
            ELSE (0)::numeric
        END) AS total_despesas,
    sum(t.valor) AS valor_liquido,
    count(DISTINCT t.id_conta) AS contas_usadas
   FROM (public.units u
     LEFT JOIN public.transactions t ON ((u.id = t.id_unidade)))
  GROUP BY u.id, u.nome_unidade;


ALTER VIEW public.financial_summary OWNER TO desenvolvedor;

--
-- TOC entry 284 (class 1259 OID 22118)
-- Name: funcionarios; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.funcionarios (
    id_funcionario uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_pessoa uuid,
    cargo character varying(100),
    departamento character varying(100),
    data_admissao date,
    data_rescisao date,
    salario numeric(15,2),
    data_criacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao uuid,
    usuario_atualizacao uuid,
    ativo boolean DEFAULT true,
    observacoes text
);


ALTER TABLE public.funcionarios OWNER TO desenvolvedor;

--
-- TOC entry 246 (class 1259 OID 19468)
-- Name: inventory_adjustments; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.inventory_adjustments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    contagem_estoque_id uuid CONSTRAINT inventory_adjustments_inventory_count_id_not_null NOT NULL,
    asset_id uuid NOT NULL,
    unit_id uuid NOT NULL,
    tipo_ajuste character varying(20) CONSTRAINT inventory_adjustments_adjustment_type_not_null NOT NULL,
    quantidade integer CONSTRAINT inventory_adjustments_quantity_not_null NOT NULL,
    motivo text CONSTRAINT inventory_adjustments_reason_not_null NOT NULL,
    justificativa text CONSTRAINT inventory_adjustments_justification_not_null NOT NULL,
    aprovado_por character varying(255),
    lancamento_contabil boolean DEFAULT false,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT inventory_adjustments_adjustment_type_check CHECK (((tipo_ajuste)::text = ANY ((ARRAY['ENTRADA'::character varying, 'SAIDA'::character varying, 'BAIXA'::character varying])::text[])))
);


ALTER TABLE public.inventory_adjustments OWNER TO desenvolvedor;

--
-- TOC entry 244 (class 1259 OID 19414)
-- Name: inventory_counts; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.inventory_counts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    data_contagem date CONSTRAINT inventory_counts_count_date_not_null NOT NULL,
    contagem_por character varying(255) CONSTRAINT inventory_counts_counted_by_not_null NOT NULL,
    revisado_por character varying(255),
    situacao character varying(20) DEFAULT 'EM_ANDAMENTO'::character varying,
    total_ativos integer DEFAULT 0,
    total_esperado integer DEFAULT 0,
    total_encontrado integer DEFAULT 0,
    diferenca_total integer DEFAULT 0,
    percentual_conclusao numeric(5,2) DEFAULT 0,
    iniciado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    concluido timestamp with time zone,
    CONSTRAINT inventory_counts_status_check CHECK (((situacao)::text = ANY ((ARRAY['EM_ANDAMENTO'::character varying, 'CONCLUIDO'::character varying, 'REVISAO'::character varying])::text[])))
);


ALTER TABLE public.inventory_counts OWNER TO desenvolvedor;

--
-- TOC entry 245 (class 1259 OID 19439)
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.inventory_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    contagem_estoque_id uuid CONSTRAINT inventory_items_inventory_count_id_not_null NOT NULL,
    ativo_id uuid CONSTRAINT inventory_items_asset_id_not_null NOT NULL,
    nome_ativo character varying(255) CONSTRAINT inventory_items_asset_name_not_null NOT NULL,
    categoria public.asset_type CONSTRAINT inventory_items_category_not_null NOT NULL,
    quantidade_esperada integer CONSTRAINT inventory_items_expected_quantity_not_null NOT NULL,
    quantidade_contada integer CONSTRAINT inventory_items_counted_quantity_not_null NOT NULL,
    diferenca integer CONSTRAINT inventory_items_difference_not_null NOT NULL,
    condicao character varying(20) CONSTRAINT inventory_items_condition_not_null NOT NULL,
    location character varying(255),
    observacoes text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT inventory_items_condition_check CHECK (((condicao)::text = ANY ((ARRAY['BOM'::character varying, 'REGULAR'::character varying, 'RUIM'::character varying, 'SUCATA'::character varying])::text[])))
);


ALTER TABLE public.inventory_items OWNER TO desenvolvedor;

--
-- TOC entry 266 (class 1259 OID 20163)
-- Name: lgpd_consent_logs; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.lgpd_consent_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_membro uuid,
    id_funcionario uuid,
    politica_id uuid CONSTRAINT lgpd_consent_logs_policy_id_not_null NOT NULL,
    tipo_consentimento character varying(50) CONSTRAINT lgpd_consent_logs_consent_type_not_null NOT NULL,
    granted boolean NOT NULL,
    endereco_ip inet,
    agente_usuario text,
    data_consentimento timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lgpd_consent_logs OWNER TO desenvolvedor;

--
-- TOC entry 265 (class 1259 OID 20139)
-- Name: lgpd_policies; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.lgpd_policies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    versao character varying(20) CONSTRAINT lgpd_policies_version_not_null NOT NULL,
    titulo character varying(255) CONSTRAINT lgpd_policies_title_not_null NOT NULL,
    conteudo text CONSTRAINT lgpd_policies_content_not_null NOT NULL,
    esta_ativa boolean DEFAULT true,
    obrigatorio boolean DEFAULT true,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lgpd_policies OWNER TO desenvolvedor;

--
-- TOC entry 225 (class 1259 OID 18309)
-- Name: member_dependents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member_dependents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_membro uuid,
    nome text CONSTRAINT member_dependents_name_not_null NOT NULL,
    data_nascimento date,
    parentesco text,
    cpf text,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    CONSTRAINT member_dependents_relationship_check CHECK ((parentesco = ANY (ARRAY['FILHO'::text, 'CONJUGE'::text, 'PAI'::text, 'MAE'::text, 'OUTRO'::text])))
);


ALTER TABLE public.member_dependents OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18856)
-- Name: payroll; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.payroll (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_id uuid,
    id_funcionario uuid,
    month integer NOT NULL,
    year integer NOT NULL,
    data_referencia date CONSTRAINT payroll_reference_date_not_null NOT NULL,
    salario_base numeric(15,2) DEFAULT 0,
    horas_extras_50 numeric(10,2) DEFAULT 0,
    horas_extras_100 numeric(10,2) DEFAULT 0,
    adicional_noturno numeric(10,2) DEFAULT 0,
    insalubridade numeric(10,2) DEFAULT 0,
    periculosidade numeric(10,2) DEFAULT 0,
    comissoes numeric(10,2) DEFAULT 0,
    gratificacoes numeric(10,2) DEFAULT 0,
    outros_proventos numeric(10,2) DEFAULT 0,
    inss numeric(15,2) DEFAULT 0,
    irrf numeric(15,2) DEFAULT 0,
    fgts numeric(15,2) DEFAULT 0,
    pensao_alimenticia numeric(15,2) DEFAULT 0,
    adiantamento numeric(15,2) DEFAULT 0,
    faltas numeric(15,2) DEFAULT 0,
    atrasos numeric(15,2) DEFAULT 0,
    outras_deducoes numeric(15,2) DEFAULT 0,
    total_proventos numeric(15,2) DEFAULT 0,
    total_deducoes numeric(15,2) DEFAULT 0,
    salario_liquido numeric(15,2) DEFAULT 0,
    inss_patronal numeric(15,2) DEFAULT 0,
    fgts_patronal numeric(15,2) DEFAULT 0,
    rat numeric(15,2) DEFAULT 0,
    terceiros numeric(15,2) DEFAULT 0,
    total_encargos numeric(15,2) DEFAULT 0,
    status text DEFAULT 'PROCESSED'::text,
    processado_por uuid,
    processado timestamp with time zone,
    notes text,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    CONSTRAINT payroll_month_check CHECK (((month >= 1) AND (month <= 12))),
    CONSTRAINT payroll_status_check CHECK ((status = ANY (ARRAY['PROCESSING'::text, 'PROCESSED'::text, 'PAID'::text, 'CANCELLED'::text]))),
    CONSTRAINT payroll_year_check CHECK ((year >= 2020))
);


ALTER TABLE public.payroll OWNER TO desenvolvedor;

--
-- TOC entry 278 (class 1259 OID 20962)
-- Name: payroll_calculations; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.payroll_calculations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_funcionario uuid CONSTRAINT payroll_calculations_employee_id_not_null NOT NULL,
    mes_competencia character varying(7) CONSTRAINT payroll_calculations_competency_month_not_null NOT NULL,
    salario_bruto numeric(15,2) CONSTRAINT payroll_calculations_gross_salary_not_null NOT NULL,
    salario_base numeric(15,2) CONSTRAINT payroll_calculations_base_salary_not_null NOT NULL,
    horas_extras numeric(15,2) DEFAULT 0,
    adicional_noturno numeric(15,2) DEFAULT 0,
    insalubridade numeric(15,2) DEFAULT 0,
    comissao numeric(15,2) DEFAULT 0,
    bonificacoes numeric(15,2) DEFAULT 0,
    salario_familia numeric(15,2) DEFAULT 0,
    outros_proventos numeric(15,2) DEFAULT 0,
    inss numeric(15,2) NOT NULL,
    irrf numeric(15,2) NOT NULL,
    fgts numeric(15,2) NOT NULL,
    "union" numeric(15,2) DEFAULT 0,
    plano_saude numeric(15,2) DEFAULT 0,
    plano_odontologico numeric(15,2) DEFAULT 0,
    vale_alimentacao numeric(15,2) DEFAULT 0,
    vale_refeicao numeric(15,2) DEFAULT 0,
    transporte numeric(15,2) DEFAULT 0,
    pharmacy numeric(15,2) DEFAULT 0,
    life_insurance numeric(15,2) DEFAULT 0,
    adiantamento numeric(15,2) DEFAULT 0,
    consignado numeric(15,2) DEFAULT 0,
    coparticipacao numeric(15,2) DEFAULT 0,
    faltas numeric(15,2) DEFAULT 0,
    atrasos numeric(15,2) DEFAULT 0,
    pensao_alimenticia numeric(15,2) DEFAULT 0,
    outras_deducoes numeric(15,2) DEFAULT 0,
    total_proventos numeric(15,2) CONSTRAINT payroll_calculations_total_allowances_not_null NOT NULL,
    total_descontos numeric(15,2) CONSTRAINT payroll_calculations_total_deductions_not_null NOT NULL,
    salario_liquido numeric(15,2) CONSTRAINT payroll_calculations_net_salary_not_null NOT NULL,
    custo_empregador numeric(15,2) CONSTRAINT payroll_calculations_employer_cost_not_null NOT NULL,
    base_inss numeric(15,2) CONSTRAINT payroll_calculations_inss_base_not_null NOT NULL,
    aliquota_inss numeric(5,2) CONSTRAINT payroll_calculations_inss_rate_not_null NOT NULL,
    valor_inss numeric(15,2) CONSTRAINT payroll_calculations_inss_value_not_null NOT NULL,
    base_irrf numeric(15,2) CONSTRAINT payroll_calculations_irrf_base_not_null NOT NULL,
    aliquota_irrf numeric(5,2) CONSTRAINT payroll_calculations_irrf_rate_not_null NOT NULL,
    deducao_irrf numeric(15,2) CONSTRAINT payroll_calculations_irrf_deduction_not_null NOT NULL,
    valor_irrf numeric(15,2) CONSTRAINT payroll_calculations_irrf_value_not_null NOT NULL,
    base_fgts numeric(15,2) CONSTRAINT payroll_calculations_fgts_base_not_null NOT NULL,
    aliquota_fgts numeric(5,2) CONSTRAINT payroll_calculations_fgts_rate_not_null NOT NULL,
    valor_fgts numeric(15,2) CONSTRAINT payroll_calculations_fgts_value_not_null NOT NULL,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payroll_calculations OWNER TO desenvolvedor;

--
-- TOC entry 252 (class 1259 OID 19656)
-- Name: payroll_periods; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.payroll_periods (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid CONSTRAINT payroll_periods_unit_id_not_null NOT NULL,
    mes integer CONSTRAINT payroll_periods_month_not_null NOT NULL,
    ano integer CONSTRAINT payroll_periods_year_not_null NOT NULL,
    situacao character varying(20) DEFAULT 'OPEN'::character varying,
    data_inicio date CONSTRAINT payroll_periods_start_date_not_null NOT NULL,
    data_final date CONSTRAINT payroll_periods_end_date_not_null NOT NULL,
    processado timestamp with time zone,
    fechado timestamp with time zone,
    total_funcionarios integer DEFAULT 0,
    total_folha numeric(15,2) DEFAULT 0,
    total_inss numeric(15,2) DEFAULT 0,
    total_fgts numeric(15,2) DEFAULT 0,
    total_irrf numeric(15,2) DEFAULT 0,
    criado_por uuid CONSTRAINT payroll_periods_created_by_not_null NOT NULL,
    observacoes text,
    CONSTRAINT payroll_periods_month_check CHECK (((mes >= 1) AND (mes <= 12))),
    CONSTRAINT payroll_periods_status_check CHECK (((situacao)::text = ANY ((ARRAY['OPEN'::character varying, 'CLOSED'::character varying, 'PROCESSING'::character varying])::text[])))
);


ALTER TABLE public.payroll_periods OWNER TO desenvolvedor;

--
-- TOC entry 276 (class 1259 OID 20714)
-- Name: pdi_plans; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.pdi_plans (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    id_funcionario uuid CONSTRAINT pdi_plans_employee_id_not_null NOT NULL,
    nome_funcionario character varying(255) CONSTRAINT pdi_plans_employee_name_not_null NOT NULL,
    meta text NOT NULL,
    prazo date,
    situacao character varying(20) DEFAULT 'PENDENTE'::character varying,
    observacoes text,
    created_by character varying(255),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pdi_plans_status_check CHECK (((situacao)::text = ANY ((ARRAY['PENDENTE'::character varying, 'EM_ANDAMENTO'::character varying, 'CONCLUIDO'::character varying, 'CANCELADO'::character varying])::text[])))
);


ALTER TABLE public.pdi_plans OWNER TO desenvolvedor;

--
-- TOC entry 289 (class 1259 OID 22197)
-- Name: perfil_permissoes; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.perfil_permissoes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_perfil uuid,
    id_permissao uuid
);


ALTER TABLE public.perfil_permissoes OWNER TO desenvolvedor;

--
-- TOC entry 286 (class 1259 OID 22160)
-- Name: perfis; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.perfis (
    id_perfil uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(50) NOT NULL
);


ALTER TABLE public.perfis OWNER TO desenvolvedor;

--
-- TOC entry 275 (class 1259 OID 20681)
-- Name: performance_evaluations; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.performance_evaluations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    id_funcionario uuid CONSTRAINT performance_evaluations_employee_id_not_null NOT NULL,
    nome_funcionario character varying(255) CONSTRAINT performance_evaluations_employee_name_not_null NOT NULL,
    data_avaliacao date CONSTRAINT performance_evaluations_evaluation_date_not_null NOT NULL,
    tipo_avaliacao character varying(50) DEFAULT 'ANNUAL'::character varying CONSTRAINT performance_evaluations_evaluation_type_not_null NOT NULL,
    nota_geral numeric(5,2) DEFAULT 0,
    conceito_geral character varying(30) DEFAULT 'SATISFACTORY'::character varying,
    competencias jsonb DEFAULT '[]'::jsonb,
    metas jsonb DEFAULT '[]'::jsonb,
    pontos_fortes text,
    melhorias text,
    plano_acao text,
    status character varying(20) DEFAULT 'DRAFT'::character varying,
    avaliado_por character varying(255),
    aprovado_por character varying(255),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT performance_evaluations_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'COMPLETED'::character varying, 'APPROVED'::character varying])::text[])))
);


ALTER TABLE public.performance_evaluations OWNER TO desenvolvedor;

--
-- TOC entry 259 (class 1259 OID 19811)
-- Name: permission_modules; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.permission_modules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    codigo character varying(100) CONSTRAINT permission_modules_code_not_null NOT NULL,
    nome_modulo character varying(255) CONSTRAINT permission_modules_name_not_null NOT NULL,
    categoria character varying(100) CONSTRAINT permission_modules_category_not_null NOT NULL,
    descricao text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permission_modules OWNER TO desenvolvedor;

--
-- TOC entry 287 (class 1259 OID 22170)
-- Name: permissoes; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.permissoes (
    id_permissao uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(100) NOT NULL
);


ALTER TABLE public.permissoes OWNER TO desenvolvedor;

--
-- TOC entry 283 (class 1259 OID 22095)
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
    tipo_sanguineo character varying(10),
    contato_emergencia character varying(255),
    pcd boolean DEFAULT false,
    tipo_deficiencia character varying(255),
    endereco character varying(255),
    numero character varying(20),
    complemento character varying(100),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    cep character varying(15),
    pais character varying(100) DEFAULT 'Brasil'::character varying,
    data_criacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao uuid,
    usuario_atualizacao uuid,
    ativo boolean DEFAULT true,
    observacoes text
);


ALTER TABLE public.pessoas OWNER TO desenvolvedor;

--
-- TOC entry 258 (class 1259 OID 19793)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.role_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    funcao text CONSTRAINT role_permissions_role_not_null NOT NULL,
    recurso text CONSTRAINT role_permissions_resource_not_null NOT NULL,
    ler boolean DEFAULT false,
    escrever boolean DEFAULT false,
    excluir boolean DEFAULT false,
    administrador boolean DEFAULT false,
    codigo_modulo character varying(100),
    gerenciar boolean DEFAULT false,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.role_permissions OWNER TO desenvolvedor;

--
-- TOC entry 279 (class 1259 OID 21038)
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO desenvolvedor;

--
-- TOC entry 234 (class 1259 OID 18916)
-- Name: system_logs; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.system_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    id_unidade uuid,
    usuario_id uuid,
    acao text CONSTRAINT system_logs_action_not_null NOT NULL,
    tipo_recurso text,
    id_recurso uuid,
    valores_anteriores jsonb,
    valores_novos jsonb,
    endereco_ip text,
    agente_usuario text,
    criado timestamp with time zone DEFAULT now()
);


ALTER TABLE public.system_logs OWNER TO desenvolvedor;

--
-- TOC entry 254 (class 1259 OID 19716)
-- Name: tax_configs; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.tax_configs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    faixa_inss jsonb CONSTRAINT tax_configs_inss_brackets_not_null NOT NULL,
    faixa_irrf jsonb CONSTRAINT tax_configs_irrf_brackets_not_null NOT NULL,
    taxa_fgts numeric(5,2) DEFAULT 8.0 CONSTRAINT tax_configs_fgts_rate_not_null NOT NULL,
    taxa_patronal numeric(5,2),
    taxa_rat numeric(5,2),
    terceiros_rate numeric(5,2),
    va_default numeric(15,2),
    vr_default numeric(15,2),
    entidades_terceiras jsonb,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tax_configs OWNER TO desenvolvedor;

--
-- TOC entry 291 (class 1259 OID 22229)
-- Name: transacoes; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.transacoes (
    id_transacao uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_conta uuid,
    id_pessoa uuid,
    descricao text,
    valor numeric(15,2) NOT NULL,
    tipo character varying(10),
    data_pagamento date,
    data_criacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao uuid,
    ativo boolean DEFAULT true
);


ALTER TABLE public.transacoes OWNER TO desenvolvedor;

--
-- TOC entry 271 (class 1259 OID 20353)
-- Name: treasury_alerts; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.treasury_alerts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid CONSTRAINT treasury_alerts_unit_id_not_null NOT NULL,
    tipo_alerta character varying(50) CONSTRAINT treasury_alerts_tipo_not_null NOT NULL,
    titulo_alerta character varying(255) CONSTRAINT treasury_alerts_titulo_not_null NOT NULL,
    descricao_alerta text CONSTRAINT treasury_alerts_descricao_not_null NOT NULL,
    nivel_gravidade character varying(20) CONSTRAINT treasury_alerts_gravidade_not_null NOT NULL,
    id_conta uuid,
    investimento_id uuid,
    emprestimo_id uuid,
    valor_alerta numeric(15,2),
    data_limite_alerta date,
    situacao character varying(20) DEFAULT 'ATIVO'::character varying,
    acoes_sugeridas jsonb DEFAULT '[]'::jsonb,
    criado_por character varying(255),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT treasury_alerts_gravidade_check CHECK (((nivel_gravidade)::text = ANY ((ARRAY['BAIXA'::character varying, 'MEDIA'::character varying, 'ALTA'::character varying, 'CRITICA'::character varying])::text[]))),
    CONSTRAINT treasury_alerts_status_check CHECK (((situacao)::text = ANY ((ARRAY['ATIVO'::character varying, 'RESOLVIDO'::character varying, 'IGNORADO'::character varying])::text[])))
);


ALTER TABLE public.treasury_alerts OWNER TO desenvolvedor;

--
-- TOC entry 267 (class 1259 OID 20232)
-- Name: treasury_cash_flows; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.treasury_cash_flows (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_unidade uuid CONSTRAINT treasury_cash_flows_unit_id_not_null NOT NULL,
    data_movimento date CONSTRAINT treasury_cash_flows_data_not_null NOT NULL,
    descricao_movimento text CONSTRAINT treasury_cash_flows_descricao_not_null NOT NULL,
    categoria_movimento character varying(50) CONSTRAINT treasury_cash_flows_categoria_not_null NOT NULL,
    valor_movimento numeric(15,2) CONSTRAINT treasury_cash_flows_valor_not_null NOT NULL,
    tipo_movimento character varying(20) CONSTRAINT treasury_cash_flows_tipo_not_null NOT NULL,
    id_conta uuid,
    situacao character varying(20) DEFAULT 'REALIZADO'::character varying,
    observacoes_movimento text,
    criado_por character varying(255),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT treasury_cash_flows_categoria_check CHECK (((categoria_movimento)::text = ANY ((ARRAY['RECEITA'::character varying, 'DESPESA'::character varying, 'TRANSFERENCIA'::character varying])::text[]))),
    CONSTRAINT treasury_cash_flows_status_check CHECK (((situacao)::text = ANY ((ARRAY['PREVISTO'::character varying, 'REALIZADO'::character varying, 'CANCELADO'::character varying])::text[]))),
    CONSTRAINT treasury_cash_flows_tipo_check CHECK (((tipo_movimento)::text = ANY ((ARRAY['ENTRADA'::character varying, 'SAIDA'::character varying])::text[])))
);


ALTER TABLE public.treasury_cash_flows OWNER TO desenvolvedor;

--
-- TOC entry 272 (class 1259 OID 20393)
-- Name: treasury_financial_positions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.treasury_financial_positions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    data date NOT NULL,
    ativo_total numeric(15,2) DEFAULT 0,
    passivo_total numeric(15,2) DEFAULT 0,
    patrimonio_liquido numeric(15,2) DEFAULT 0,
    disponibilidades numeric(15,2) DEFAULT 0,
    aplicacoes numeric(15,2) DEFAULT 0,
    contas_receber numeric(15,2) DEFAULT 0,
    estoques numeric(15,2) DEFAULT 0,
    ativo_fixo numeric(15,2) DEFAULT 0,
    fornecedores numeric(15,2) DEFAULT 0,
    emprestimos numeric(15,2) DEFAULT 0,
    outras_contas numeric(15,2) DEFAULT 0,
    variacao_patrimonial numeric(15,2) DEFAULT 0,
    variacao_percentual numeric(8,4) DEFAULT 0,
    indicadores jsonb DEFAULT '{}'::jsonb,
    detalhamento jsonb DEFAULT '[]'::jsonb,
    created_by character varying(255),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.treasury_financial_positions OWNER TO desenvolvedor;

--
-- TOC entry 268 (class 1259 OID 20263)
-- Name: treasury_forecasts; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.treasury_forecasts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    data_inicio date NOT NULL,
    data_final date CONSTRAINT treasury_forecasts_data_fim_not_null NOT NULL,
    tipo character varying(20) NOT NULL,
    saldo_inicial numeric(15,2) DEFAULT 0,
    entradas_previstas numeric(15,2) DEFAULT 0,
    saidas_previstas numeric(15,2) DEFAULT 0,
    saldo_final_previsto numeric(15,2) DEFAULT 0,
    entradas_realizadas numeric(15,2) DEFAULT 0,
    saidas_realizadas numeric(15,2) DEFAULT 0,
    saldo_final_real numeric(15,2) DEFAULT 0,
    precisao numeric(5,2) DEFAULT 0,
    status character varying(20) DEFAULT 'EM_ANDAMENTO'::character varying,
    detalhes jsonb DEFAULT '[]'::jsonb,
    criado_por character varying(255),
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT treasury_forecasts_status_check CHECK (((status)::text = ANY ((ARRAY['EM_ANDAMENTO'::character varying, 'CONCLUIDO'::character varying, 'CANCELADO'::character varying])::text[]))),
    CONSTRAINT treasury_forecasts_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['SEMANAL'::character varying, 'MENSAL'::character varying, 'TRIMESTRAL'::character varying, 'ANUAL'::character varying])::text[])))
);


ALTER TABLE public.treasury_forecasts OWNER TO desenvolvedor;

--
-- TOC entry 269 (class 1259 OID 20295)
-- Name: treasury_investments; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.treasury_investments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    nome character varying(255) NOT NULL,
    tipo character varying(50) NOT NULL,
    instituicao character varying(255) NOT NULL,
    data_aplicacao date NOT NULL,
    data_vencimento date,
    valor_aplicado numeric(15,2) NOT NULL,
    valor_atual numeric(15,2) NOT NULL,
    rentabilidade_anual numeric(8,4) DEFAULT 0,
    indexador character varying(50),
    status character varying(20) DEFAULT 'ATIVO'::character varying,
    observacoes text,
    rendimentos jsonb DEFAULT '[]'::jsonb,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT treasury_investments_status_check CHECK (((status)::text = ANY ((ARRAY['ATIVO'::character varying, 'RESGATADO'::character varying, 'VENCIDO'::character varying])::text[])))
);


ALTER TABLE public.treasury_investments OWNER TO desenvolvedor;

--
-- TOC entry 270 (class 1259 OID 20322)
-- Name: treasury_loans; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.treasury_loans (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unit_id uuid NOT NULL,
    nome character varying(255) NOT NULL,
    credor character varying(255) NOT NULL,
    data_contratacao date NOT NULL,
    data_vencimento date NOT NULL,
    valor_original numeric(15,2) NOT NULL,
    valor_saldo numeric(15,2) NOT NULL,
    taxa_juros numeric(8,4) NOT NULL,
    tipo_juros character varying(20) DEFAULT 'MENSAL'::character varying,
    total_parcelas integer NOT NULL,
    parcelas_pagas integer DEFAULT 0,
    status character varying(20) DEFAULT 'ATIVO'::character varying,
    parcelas jsonb DEFAULT '[]'::jsonb,
    observacoes text,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT treasury_loans_status_check CHECK (((status)::text = ANY ((ARRAY['ATIVO'::character varying, 'QUITADO'::character varying, 'INADIMPLENTE'::character varying, 'RENEGOCIADO'::character varying])::text[]))),
    CONSTRAINT treasury_loans_tipo_juros_check CHECK (((tipo_juros)::text = ANY ((ARRAY['MENSAL'::character varying, 'ANUAL'::character varying])::text[])))
);


ALTER TABLE public.treasury_loans OWNER TO desenvolvedor;

--
-- TOC entry 282 (class 1259 OID 22078)
-- Name: unidades; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.unidades (
    id_unidade uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(255) NOT NULL,
    cnpj character varying(20),
    telefone character varying(20),
    email character varying(255),
    endereco character varying(255),
    numero character varying(20),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    cep character varying(15),
    pais character varying(100) DEFAULT 'Brasil'::character varying,
    situacao character varying(20) DEFAULT 'Ativo'::character varying,
    data_criacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao uuid,
    usuario_atualizacao uuid,
    ativo boolean DEFAULT true,
    observacoes text
);


ALTER TABLE public.unidades OWNER TO desenvolvedor;

--
-- TOC entry 260 (class 1259 OID 19827)
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.user_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    codigo_modulo character varying(100) CONSTRAINT user_permissions_module_code_not_null NOT NULL,
    can_read boolean,
    can_write boolean,
    can_delete boolean,
    can_manage boolean,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_permissions OWNER TO desenvolvedor;

--
-- TOC entry 231 (class 1259 OID 18751)
-- Name: users; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    hash_senha text CONSTRAINT users_password_hash_not_null NOT NULL,
    nome_usuario text CONSTRAINT users_name_not_null NOT NULL,
    role text NOT NULL,
    id_unidade uuid,
    id_funcionario uuid,
    id_membro uuid,
    esta_ativo boolean DEFAULT true,
    ultimo_login timestamp with time zone,
    criado timestamp with time zone DEFAULT now(),
    atualizado timestamp with time zone DEFAULT now(),
    criado_por uuid,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['ADMIN'::text, 'MANAGER'::text, 'EMPLOYEE'::text, 'MEMBER'::text, 'DEVELOPER'::text])))
);


ALTER TABLE public.users OWNER TO desenvolvedor;

--
-- TOC entry 6201 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: desenvolvedor
--

COMMENT ON TABLE public.users IS 'UsuÃ¡rios do sistema com permissÃµes';


--
-- TOC entry 285 (class 1259 OID 22137)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.usuarios (
    id_usuario uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_pessoa uuid,
    login character varying(100) NOT NULL,
    senha_hash text NOT NULL,
    data_criacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ativo boolean DEFAULT true
);


ALTER TABLE public.usuarios OWNER TO desenvolvedor;

--
-- TOC entry 288 (class 1259 OID 22180)
-- Name: usuarios_perfis; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.usuarios_perfis (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_usuario uuid,
    id_perfil uuid
);


ALTER TABLE public.usuarios_perfis OWNER TO desenvolvedor;

--
-- TOC entry 240 (class 1259 OID 19302)
-- Name: volunteer_schedules; Type: TABLE; Schema: public; Owner: desenvolvedor
--

CREATE TABLE public.volunteer_schedules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    evento_id uuid CONSTRAINT volunteer_schedules_event_id_not_null NOT NULL,
    ministerio character varying(100) CONSTRAINT volunteer_schedules_ministry_not_null NOT NULL,
    funcao character varying(100) CONSTRAINT volunteer_schedules_role_not_null NOT NULL,
    voluntario_id uuid,
    nome_voluntario character varying(255),
    telefone_voluntario character varying(20),
    email_voluntario character varying(255),
    confirmado boolean DEFAULT false,
    observacoes text,
    quantidade_necessaria integer DEFAULT 1 CONSTRAINT volunteer_schedules_required_count_not_null NOT NULL,
    quantidade_atribuida integer DEFAULT 0,
    criado timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.volunteer_schedules OWNER TO desenvolvedor;

--
-- TOC entry 5765 (class 2606 OID 19575)
-- Name: account_balances account_balances_account_id_period_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.account_balances
    ADD CONSTRAINT account_balances_account_id_period_key UNIQUE (id_conta, period);


--
-- TOC entry 5767 (class 2606 OID 19573)
-- Name: account_balances account_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.account_balances
    ADD CONSTRAINT account_balances_pkey PRIMARY KEY (id);


--
-- TOC entry 5789 (class 2606 OID 19756)
-- Name: accounting_configs accounting_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.accounting_configs
    ADD CONSTRAINT accounting_configs_pkey PRIMARY KEY (id);


--
-- TOC entry 5791 (class 2606 OID 19758)
-- Name: accounting_configs accounting_configs_unit_id_fiscal_year_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.accounting_configs
    ADD CONSTRAINT accounting_configs_unit_id_fiscal_year_key UNIQUE (unit_id, ano_fiscal);


--
-- TOC entry 5763 (class 2606 OID 19546)
-- Name: accounting_entries accounting_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.accounting_entries
    ADD CONSTRAINT accounting_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 5692 (class 2606 OID 18343)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 5818 (class 2606 OID 19936)
-- Name: app_audit_logs app_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_audit_logs
    ADD CONSTRAINT app_audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5806 (class 2606 OID 19869)
-- Name: app_permission_modules app_permission_modules_code_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_permission_modules
    ADD CONSTRAINT app_permission_modules_code_key UNIQUE (codigo);


--
-- TOC entry 5808 (class 2606 OID 19867)
-- Name: app_permission_modules app_permission_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_permission_modules
    ADD CONSTRAINT app_permission_modules_pkey PRIMARY KEY (id);


--
-- TOC entry 5810 (class 2606 OID 19884)
-- Name: app_role_permissions app_role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT app_role_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5812 (class 2606 OID 19886)
-- Name: app_role_permissions app_role_permissions_role_module_code_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT app_role_permissions_role_module_code_key UNIQUE (role, codigo_modulo);


--
-- TOC entry 5814 (class 2606 OID 19902)
-- Name: app_user_permissions app_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_user_permissions
    ADD CONSTRAINT app_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5816 (class 2606 OID 19904)
-- Name: app_user_permissions app_user_permissions_user_id_module_code_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_user_permissions
    ADD CONSTRAINT app_user_permissions_user_id_module_code_key UNIQUE (usuario_id, codigo_modulo);


--
-- TOC entry 5745 (class 2606 OID 19342)
-- Name: asset_depreciations asset_depreciations_asset_id_reference_month_reference_year_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_depreciations
    ADD CONSTRAINT asset_depreciations_asset_id_reference_month_reference_year_key UNIQUE (ativo_id, mes_referencia, ano_referencia);


--
-- TOC entry 5747 (class 2606 OID 19340)
-- Name: asset_depreciations asset_depreciations_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_depreciations
    ADD CONSTRAINT asset_depreciations_pkey PRIMARY KEY (id);


--
-- TOC entry 5751 (class 2606 OID 19403)
-- Name: asset_maintenances asset_maintenances_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_maintenances
    ADD CONSTRAINT asset_maintenances_pkey PRIMARY KEY (id);


--
-- TOC entry 5749 (class 2606 OID 19370)
-- Name: asset_transfers asset_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_pkey PRIMARY KEY (id);


--
-- TOC entry 5696 (class 2606 OID 18568)
-- Name: assets assets_asset_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_asset_number_key UNIQUE (numero_ativo);


--
-- TOC entry 5698 (class 2606 OID 18566)
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- TOC entry 5779 (class 2606 OID 19705)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5851 (class 2606 OID 20451)
-- Name: bank_reconciliations bank_reconciliations_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT bank_reconciliations_pkey PRIMARY KEY (id);


--
-- TOC entry 5854 (class 2606 OID 20480)
-- Name: bank_statement_transactions bank_statement_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.bank_statement_transactions
    ADD CONSTRAINT bank_statement_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 5769 (class 2606 OID 19601)
-- Name: cash_closings cash_closings_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_closings
    ADD CONSTRAINT cash_closings_pkey PRIMARY KEY (id);


--
-- TOC entry 5771 (class 2606 OID 19603)
-- Name: cash_closings cash_closings_unit_id_account_id_closing_date_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_closings
    ADD CONSTRAINT cash_closings_unit_id_account_id_closing_date_key UNIQUE (unit_id, id_conta, data_fechamento);


--
-- TOC entry 5773 (class 2606 OID 19635)
-- Name: cash_movements cash_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_pkey PRIMARY KEY (id);


--
-- TOC entry 5694 (class 2606 OID 18364)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5759 (class 2606 OID 19515)
-- Name: chart_of_accounts chart_of_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 5761 (class 2606 OID 19517)
-- Name: chart_of_accounts chart_of_accounts_unit_id_code_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_unit_id_code_key UNIQUE (unit_id, codigo);


--
-- TOC entry 5739 (class 2606 OID 19291)
-- Name: church_events church_events_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.church_events
    ADD CONSTRAINT church_events_pkey PRIMARY KEY (id);


--
-- TOC entry 5907 (class 2606 OID 22223)
-- Name: contas_financeiras contas_financeiras_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.contas_financeiras
    ADD CONSTRAINT contas_financeiras_pkey PRIMARY KEY (id_conta);


--
-- TOC entry 5733 (class 2606 OID 19226)
-- Name: dependents dependents_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.dependents
    ADD CONSTRAINT dependents_pkey PRIMARY KEY (id);


--
-- TOC entry 5688 (class 2606 OID 18303)
-- Name: employee_dependents employee_dependents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_dependents
    ADD CONSTRAINT employee_dependents_pkey PRIMARY KEY (id);


--
-- TOC entry 5866 (class 2606 OID 20889)
-- Name: employee_leaves employee_leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.employee_leaves
    ADD CONSTRAINT employee_leaves_pkey PRIMARY KEY (id);


--
-- TOC entry 5666 (class 2606 OID 18255)
-- Name: employees employees_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_cpf_key UNIQUE (cpf);


--
-- TOC entry 5668 (class 2606 OID 18257)
-- Name: employees employees_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_matricula_key UNIQUE (matricula);


--
-- TOC entry 5670 (class 2606 OID 18253)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 5729 (class 2606 OID 18955)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 5737 (class 2606 OID 19265)
-- Name: financial_accounts financial_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.financial_accounts
    ADD CONSTRAINT financial_accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 5885 (class 2606 OID 22131)
-- Name: funcionarios funcionarios_id_pessoa_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_id_pessoa_key UNIQUE (id_pessoa);


--
-- TOC entry 5887 (class 2606 OID 22129)
-- Name: funcionarios funcionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_pkey PRIMARY KEY (id_funcionario);


--
-- TOC entry 5757 (class 2606 OID 19486)
-- Name: inventory_adjustments inventory_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_pkey PRIMARY KEY (id);


--
-- TOC entry 5753 (class 2606 OID 19433)
-- Name: inventory_counts inventory_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_counts
    ADD CONSTRAINT inventory_counts_pkey PRIMARY KEY (id);


--
-- TOC entry 5755 (class 2606 OID 19457)
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5832 (class 2606 OID 20175)
-- Name: lgpd_consent_logs lgpd_consent_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lgpd_consent_logs
    ADD CONSTRAINT lgpd_consent_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5826 (class 2606 OID 20155)
-- Name: lgpd_policies lgpd_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lgpd_policies
    ADD CONSTRAINT lgpd_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 5828 (class 2606 OID 20157)
-- Name: lgpd_policies lgpd_policies_unit_id_version_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lgpd_policies
    ADD CONSTRAINT lgpd_policies_unit_id_version_key UNIQUE (unit_id, versao);


--
-- TOC entry 5735 (class 2606 OID 19246)
-- Name: member_contributions member_contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.member_contributions
    ADD CONSTRAINT member_contributions_pkey PRIMARY KEY (id);


--
-- TOC entry 5690 (class 2606 OID 18321)
-- Name: member_dependents member_dependents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_dependents
    ADD CONSTRAINT member_dependents_pkey PRIMARY KEY (id);


--
-- TOC entry 5682 (class 2606 OID 18283)
-- Name: membros members_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membros
    ADD CONSTRAINT members_cpf_key UNIQUE (cpf);


--
-- TOC entry 5684 (class 2606 OID 21162)
-- Name: membros members_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membros
    ADD CONSTRAINT members_matricula_key UNIQUE (matricula);


--
-- TOC entry 5686 (class 2606 OID 18281)
-- Name: membros members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membros
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- TOC entry 5870 (class 2606 OID 21015)
-- Name: payroll_calculations payroll_calculations_employee_id_competency_month_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll_calculations
    ADD CONSTRAINT payroll_calculations_employee_id_competency_month_key UNIQUE (id_funcionario, mes_competencia);


--
-- TOC entry 5872 (class 2606 OID 21013)
-- Name: payroll_calculations payroll_calculations_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll_calculations
    ADD CONSTRAINT payroll_calculations_pkey PRIMARY KEY (id);


--
-- TOC entry 5775 (class 2606 OID 19678)
-- Name: payroll_periods payroll_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll_periods
    ADD CONSTRAINT payroll_periods_pkey PRIMARY KEY (id);


--
-- TOC entry 5777 (class 2606 OID 19680)
-- Name: payroll_periods payroll_periods_unit_id_month_year_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll_periods
    ADD CONSTRAINT payroll_periods_unit_id_month_year_key UNIQUE (id_unidade, mes, ano);


--
-- TOC entry 5722 (class 2606 OID 18898)
-- Name: payroll payroll_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_pkey PRIMARY KEY (id);


--
-- TOC entry 5724 (class 2606 OID 18900)
-- Name: payroll payroll_unique; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_unique UNIQUE (unit_id, id_funcionario, month, year);


--
-- TOC entry 5864 (class 2606 OID 20730)
-- Name: pdi_plans pdi_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pdi_plans
    ADD CONSTRAINT pdi_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 5905 (class 2606 OID 22203)
-- Name: perfil_permissoes perfil_permissoes_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.perfil_permissoes
    ADD CONSTRAINT perfil_permissoes_pkey PRIMARY KEY (id);


--
-- TOC entry 5895 (class 2606 OID 22169)
-- Name: perfis perfis_nome_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.perfis
    ADD CONSTRAINT perfis_nome_key UNIQUE (nome);


--
-- TOC entry 5897 (class 2606 OID 22167)
-- Name: perfis perfis_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.perfis
    ADD CONSTRAINT perfis_pkey PRIMARY KEY (id_perfil);


--
-- TOC entry 5860 (class 2606 OID 20703)
-- Name: performance_evaluations performance_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.performance_evaluations
    ADD CONSTRAINT performance_evaluations_pkey PRIMARY KEY (id);


--
-- TOC entry 5798 (class 2606 OID 19826)
-- Name: permission_modules permission_modules_code_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.permission_modules
    ADD CONSTRAINT permission_modules_code_key UNIQUE (codigo);


--
-- TOC entry 5800 (class 2606 OID 19824)
-- Name: permission_modules permission_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.permission_modules
    ADD CONSTRAINT permission_modules_pkey PRIMARY KEY (id);


--
-- TOC entry 5899 (class 2606 OID 22179)
-- Name: permissoes permissoes_nome_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.permissoes
    ADD CONSTRAINT permissoes_nome_key UNIQUE (nome);


--
-- TOC entry 5901 (class 2606 OID 22177)
-- Name: permissoes permissoes_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.permissoes
    ADD CONSTRAINT permissoes_pkey PRIMARY KEY (id_permissao);


--
-- TOC entry 5881 (class 2606 OID 22112)
-- Name: pessoas pessoas_cpf_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_cpf_key UNIQUE (cpf);


--
-- TOC entry 5883 (class 2606 OID 22110)
-- Name: pessoas pessoas_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_pkey PRIMARY KEY (id_pessoa);


--
-- TOC entry 5793 (class 2606 OID 19807)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5796 (class 2606 OID 19809)
-- Name: role_permissions role_permissions_role_resource_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_resource_key UNIQUE (funcao, recurso);


--
-- TOC entry 5874 (class 2606 OID 21045)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 5727 (class 2606 OID 18926)
-- Name: system_logs system_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5785 (class 2606 OID 19731)
-- Name: tax_configs tax_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.tax_configs
    ADD CONSTRAINT tax_configs_pkey PRIMARY KEY (id);


--
-- TOC entry 5787 (class 2606 OID 19733)
-- Name: tax_configs tax_configs_unit_id_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.tax_configs
    ADD CONSTRAINT tax_configs_unit_id_key UNIQUE (unit_id);


--
-- TOC entry 5910 (class 2606 OID 22241)
-- Name: transacoes transacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pkey PRIMARY KEY (id_transacao);


--
-- TOC entry 5718 (class 2606 OID 18808)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 5847 (class 2606 OID 20372)
-- Name: treasury_alerts treasury_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_alerts
    ADD CONSTRAINT treasury_alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 5836 (class 2606 OID 20252)
-- Name: treasury_cash_flows treasury_cash_flows_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_cash_flows
    ADD CONSTRAINT treasury_cash_flows_pkey PRIMARY KEY (id);


--
-- TOC entry 5849 (class 2606 OID 20420)
-- Name: treasury_financial_positions treasury_financial_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_financial_positions
    ADD CONSTRAINT treasury_financial_positions_pkey PRIMARY KEY (id);


--
-- TOC entry 5838 (class 2606 OID 20289)
-- Name: treasury_forecasts treasury_forecasts_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_forecasts
    ADD CONSTRAINT treasury_forecasts_pkey PRIMARY KEY (id);


--
-- TOC entry 5841 (class 2606 OID 20316)
-- Name: treasury_investments treasury_investments_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_investments
    ADD CONSTRAINT treasury_investments_pkey PRIMARY KEY (id);


--
-- TOC entry 5844 (class 2606 OID 20347)
-- Name: treasury_loans treasury_loans_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_loans
    ADD CONSTRAINT treasury_loans_pkey PRIMARY KEY (id);


--
-- TOC entry 5876 (class 2606 OID 22094)
-- Name: unidades unidades_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_cnpj_key UNIQUE (cnpj);


--
-- TOC entry 5878 (class 2606 OID 22092)
-- Name: unidades unidades_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_pkey PRIMARY KEY (id_unidade);


--
-- TOC entry 5662 (class 2606 OID 18190)
-- Name: units units_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_cnpj_key UNIQUE (cnpj);


--
-- TOC entry 5664 (class 2606 OID 18188)
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- TOC entry 5802 (class 2606 OID 19837)
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5804 (class 2606 OID 19839)
-- Name: user_permissions user_permissions_user_id_module_code_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_module_code_key UNIQUE (user_id, codigo_modulo);


--
-- TOC entry 5706 (class 2606 OID 18769)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5708 (class 2606 OID 18767)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5889 (class 2606 OID 22152)
-- Name: usuarios usuarios_id_pessoa_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_pessoa_key UNIQUE (id_pessoa);


--
-- TOC entry 5891 (class 2606 OID 22154)
-- Name: usuarios usuarios_login_key; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_login_key UNIQUE (login);


--
-- TOC entry 5903 (class 2606 OID 22186)
-- Name: usuarios_perfis usuarios_perfis_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios_perfis
    ADD CONSTRAINT usuarios_perfis_pkey PRIMARY KEY (id);


--
-- TOC entry 5893 (class 2606 OID 22150)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 5743 (class 2606 OID 19318)
-- Name: volunteer_schedules volunteer_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.volunteer_schedules
    ADD CONSTRAINT volunteer_schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 5819 (class 1259 OID 19939)
-- Name: idx_app_audit_logs_action; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_app_audit_logs_action ON public.app_audit_logs USING btree (action);


--
-- TOC entry 5820 (class 1259 OID 21395)
-- Name: idx_app_audit_logs_data_evento; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_app_audit_logs_data_evento ON public.app_audit_logs USING btree (data_evento DESC);


--
-- TOC entry 5821 (class 1259 OID 19937)
-- Name: idx_app_audit_logs_event_date; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_app_audit_logs_event_date ON public.app_audit_logs USING btree (data_evento DESC);


--
-- TOC entry 5822 (class 1259 OID 21943)
-- Name: idx_app_audit_logs_id_unidade; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_app_audit_logs_id_unidade ON public.app_audit_logs USING btree (id_unidade);


--
-- TOC entry 5823 (class 1259 OID 19938)
-- Name: idx_app_audit_logs_unit_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_app_audit_logs_unit_id ON public.app_audit_logs USING btree (id_unidade);


--
-- TOC entry 5699 (class 1259 OID 18734)
-- Name: idx_assets_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assets_category ON public.assets USING btree (categoria);


--
-- TOC entry 5700 (class 1259 OID 18735)
-- Name: idx_assets_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assets_status ON public.assets USING btree (situacao);


--
-- TOC entry 5701 (class 1259 OID 18733)
-- Name: idx_assets_unit_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assets_unit_id ON public.assets USING btree (unit_id);


--
-- TOC entry 5780 (class 1259 OID 19770)
-- Name: idx_audit_logs_action_date; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_audit_logs_action_date ON public.audit_logs USING btree (data_acao);


--
-- TOC entry 5781 (class 1259 OID 19771)
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entidade);


--
-- TOC entry 5782 (class 1259 OID 19768)
-- Name: idx_audit_logs_unit_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_audit_logs_unit_id ON public.audit_logs USING btree (unit_id);


--
-- TOC entry 5783 (class 1259 OID 19769)
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (usuario_id);


--
-- TOC entry 5852 (class 1259 OID 20506)
-- Name: idx_bank_reconciliations_unit; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_bank_reconciliations_unit ON public.bank_reconciliations USING btree (unit_id);


--
-- TOC entry 5855 (class 1259 OID 20508)
-- Name: idx_bank_statement_transactions_reconciliation; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_bank_statement_transactions_reconciliation ON public.bank_statement_transactions USING btree (reconciliation_id);


--
-- TOC entry 5856 (class 1259 OID 20507)
-- Name: idx_bank_statement_transactions_unit; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_bank_statement_transactions_unit ON public.bank_statement_transactions USING btree (unit_id);


--
-- TOC entry 5740 (class 1259 OID 19767)
-- Name: idx_church_events_date; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_church_events_date ON public.church_events USING btree (data_evento);


--
-- TOC entry 5741 (class 1259 OID 19766)
-- Name: idx_church_events_unit_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_church_events_unit_id ON public.church_events USING btree (unit_id);


--
-- TOC entry 5671 (class 1259 OID 18728)
-- Name: idx_employees_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_active ON public.employees USING btree (ativo);


--
-- TOC entry 5672 (class 1259 OID 18725)
-- Name: idx_employees_cpf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_cpf ON public.employees USING btree (cpf);


--
-- TOC entry 5673 (class 1259 OID 18726)
-- Name: idx_employees_matricula; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_matricula ON public.employees USING btree (matricula);


--
-- TOC entry 5674 (class 1259 OID 18727)
-- Name: idx_employees_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_name ON public.employees USING btree (nome);


--
-- TOC entry 5675 (class 1259 OID 18724)
-- Name: idx_employees_unit_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_unit_id ON public.employees USING btree (id_unidade);


--
-- TOC entry 5730 (class 1259 OID 18975)
-- Name: idx_events_date; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_events_date ON public.events USING btree (data_evento);


--
-- TOC entry 5731 (class 1259 OID 18974)
-- Name: idx_events_unit_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_events_unit_id ON public.events USING btree (unit_id);


--
-- TOC entry 5829 (class 1259 OID 20193)
-- Name: idx_lgpd_consent_employee; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_lgpd_consent_employee ON public.lgpd_consent_logs USING btree (id_funcionario);


--
-- TOC entry 5830 (class 1259 OID 20192)
-- Name: idx_lgpd_consent_member; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_lgpd_consent_member ON public.lgpd_consent_logs USING btree (id_membro);


--
-- TOC entry 5824 (class 1259 OID 20191)
-- Name: idx_lgpd_policies_unit_active; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_lgpd_policies_unit_active ON public.lgpd_policies USING btree (unit_id, esta_ativa);


--
-- TOC entry 5676 (class 1259 OID 18730)
-- Name: idx_members_cpf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_members_cpf ON public.membros USING btree (cpf);


--
-- TOC entry 5677 (class 1259 OID 18731)
-- Name: idx_members_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_members_name ON public.membros USING btree (nome);


--
-- TOC entry 5678 (class 1259 OID 18732)
-- Name: idx_members_situacao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_members_situacao ON public.membros USING btree (status);


--
-- TOC entry 5679 (class 1259 OID 18729)
-- Name: idx_members_unit_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_members_unit_id ON public.membros USING btree (id_unidade);


--
-- TOC entry 5680 (class 1259 OID 22258)
-- Name: idx_membro_matricula; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_membro_matricula ON public.membros USING btree (matricula);


--
-- TOC entry 5867 (class 1259 OID 21022)
-- Name: idx_payroll_calculations_competency; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_payroll_calculations_competency ON public.payroll_calculations USING btree (mes_competencia);


--
-- TOC entry 5868 (class 1259 OID 21021)
-- Name: idx_payroll_calculations_employee_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_payroll_calculations_employee_id ON public.payroll_calculations USING btree (id_funcionario);


--
-- TOC entry 5719 (class 1259 OID 18972)
-- Name: idx_payroll_period; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_payroll_period ON public.payroll USING btree (month, year);


--
-- TOC entry 5720 (class 1259 OID 18971)
-- Name: idx_payroll_unit_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_payroll_unit_id ON public.payroll USING btree (unit_id);


--
-- TOC entry 5861 (class 1259 OID 20744)
-- Name: idx_pdi_plans_employee; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_pdi_plans_employee ON public.pdi_plans USING btree (id_funcionario);


--
-- TOC entry 5862 (class 1259 OID 20743)
-- Name: idx_pdi_plans_unit; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_pdi_plans_unit ON public.pdi_plans USING btree (unit_id);


--
-- TOC entry 5857 (class 1259 OID 20742)
-- Name: idx_performance_evaluations_employee; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_performance_evaluations_employee ON public.performance_evaluations USING btree (id_funcionario);


--
-- TOC entry 5858 (class 1259 OID 20741)
-- Name: idx_performance_evaluations_unit; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_performance_evaluations_unit ON public.performance_evaluations USING btree (unit_id);


--
-- TOC entry 5879 (class 1259 OID 22257)
-- Name: idx_pessoa_cpf; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_pessoa_cpf ON public.pessoas USING btree (cpf);


--
-- TOC entry 5725 (class 1259 OID 18973)
-- Name: idx_system_logs_created_at; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_system_logs_created_at ON public.system_logs USING btree (criado);


--
-- TOC entry 5908 (class 1259 OID 22259)
-- Name: idx_transacao_data; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transacao_data ON public.transacoes USING btree (data_pagamento);


--
-- TOC entry 5709 (class 1259 OID 19765)
-- Name: idx_transactions_account_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transactions_account_id ON public.transactions USING btree (id_conta);


--
-- TOC entry 5710 (class 1259 OID 18967)
-- Name: idx_transactions_date; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transactions_date ON public.transactions USING btree (data_transacao);


--
-- TOC entry 5711 (class 1259 OID 20525)
-- Name: idx_transactions_due_date; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transactions_due_date ON public.transactions USING btree (data_vencimento);


--
-- TOC entry 5712 (class 1259 OID 20524)
-- Name: idx_transactions_is_installment; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transactions_is_installment ON public.transactions USING btree (parcelado);


--
-- TOC entry 5713 (class 1259 OID 20523)
-- Name: idx_transactions_parent_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transactions_parent_id ON public.transactions USING btree (id_transacao_origem);


--
-- TOC entry 5714 (class 1259 OID 19764)
-- Name: idx_transactions_status; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transactions_status ON public.transactions USING btree (situacao);


--
-- TOC entry 5715 (class 1259 OID 18968)
-- Name: idx_transactions_type; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transactions_type ON public.transactions USING btree (tipo_transacao);


--
-- TOC entry 5716 (class 1259 OID 18966)
-- Name: idx_transactions_unit_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_transactions_unit_id ON public.transactions USING btree (id_unidade);


--
-- TOC entry 5845 (class 1259 OID 20505)
-- Name: idx_treasury_alerts_unit; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_treasury_alerts_unit ON public.treasury_alerts USING btree (id_unidade);


--
-- TOC entry 5833 (class 1259 OID 20502)
-- Name: idx_treasury_cash_flows_data; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_treasury_cash_flows_data ON public.treasury_cash_flows USING btree (data_movimento);


--
-- TOC entry 5834 (class 1259 OID 20501)
-- Name: idx_treasury_cash_flows_unit; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_treasury_cash_flows_unit ON public.treasury_cash_flows USING btree (id_unidade);


--
-- TOC entry 5839 (class 1259 OID 20503)
-- Name: idx_treasury_investments_unit; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_treasury_investments_unit ON public.treasury_investments USING btree (unit_id);


--
-- TOC entry 5842 (class 1259 OID 20504)
-- Name: idx_treasury_loans_unit; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_treasury_loans_unit ON public.treasury_loans USING btree (unit_id);


--
-- TOC entry 5659 (class 1259 OID 18722)
-- Name: idx_units_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_units_name ON public.units USING btree (nome_unidade);


--
-- TOC entry 5660 (class 1259 OID 18723)
-- Name: idx_units_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_units_status ON public.units USING btree (status);


--
-- TOC entry 5702 (class 1259 OID 18785)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 5703 (class 1259 OID 18787)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 5704 (class 1259 OID 18786)
-- Name: idx_users_unit_id; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE INDEX idx_users_unit_id ON public.users USING btree (id_unidade);


--
-- TOC entry 5794 (class 1259 OID 19853)
-- Name: role_permissions_role_module_code_idx; Type: INDEX; Schema: public; Owner: desenvolvedor
--

CREATE UNIQUE INDEX role_permissions_role_module_code_idx ON public.role_permissions USING btree (funcao, codigo_modulo);


--
-- TOC entry 6020 (class 2620 OID 22305)
-- Name: app_audit_logs trg_prevent_app_audit_logs_delete; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_prevent_app_audit_logs_delete BEFORE DELETE ON public.app_audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_app_audit_logs_mutation();


--
-- TOC entry 6021 (class 2620 OID 22304)
-- Name: app_audit_logs trg_prevent_app_audit_logs_update; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_prevent_app_audit_logs_update BEFORE UPDATE ON public.app_audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_app_audit_logs_mutation();


--
-- TOC entry 6023 (class 2620 OID 22256)
-- Name: funcionarios trg_update_funcionarios; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_update_funcionarios BEFORE UPDATE ON public.funcionarios FOR EACH ROW EXECUTE FUNCTION public.atualizar_data_atualizacao();


--
-- TOC entry 6022 (class 2620 OID 22254)
-- Name: pessoas trg_update_pessoas; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_update_pessoas BEFORE UPDATE ON public.pessoas FOR EACH ROW EXECUTE FUNCTION public.atualizar_data_atualizacao();


--
-- TOC entry 6024 (class 2620 OID 22253)
-- Name: usuarios trg_validar_usuario; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER trg_validar_usuario BEFORE INSERT ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.validar_usuario_pessoa();


--
-- TOC entry 6015 (class 2620 OID 21367)
-- Name: assets update_assets_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_assets_timestamp BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp_alteracao();


--
-- TOC entry 6019 (class 2620 OID 21366)
-- Name: church_events update_church_events_timestamp; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER update_church_events_timestamp BEFORE UPDATE ON public.church_events FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp_alteracao();


--
-- TOC entry 6013 (class 2620 OID 21364)
-- Name: employees update_employees_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_employees_timestamp BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp_alteracao();


--
-- TOC entry 6018 (class 2620 OID 21368)
-- Name: financial_accounts update_financial_accounts_timestamp; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER update_financial_accounts_timestamp BEFORE UPDATE ON public.financial_accounts FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp_alteracao();


--
-- TOC entry 6014 (class 2620 OID 21361)
-- Name: membros update_membros_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_membros_timestamp BEFORE UPDATE ON public.membros FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp_alteracao();


--
-- TOC entry 6017 (class 2620 OID 21365)
-- Name: transactions update_transactions_timestamp; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER update_transactions_timestamp BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp_alteracao();


--
-- TOC entry 6012 (class 2620 OID 21362)
-- Name: units update_units_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_units_timestamp BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp_alteracao();


--
-- TOC entry 6016 (class 2620 OID 21363)
-- Name: users update_users_timestamp; Type: TRIGGER; Schema: public; Owner: desenvolvedor
--

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.atualizar_timestamp_alteracao();


--
-- TOC entry 5958 (class 2606 OID 19576)
-- Name: account_balances account_balances_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.account_balances
    ADD CONSTRAINT account_balances_account_id_fkey FOREIGN KEY (id_conta) REFERENCES public.chart_of_accounts(id);


--
-- TOC entry 5971 (class 2606 OID 19759)
-- Name: accounting_configs accounting_configs_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.accounting_configs
    ADD CONSTRAINT accounting_configs_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5956 (class 2606 OID 19552)
-- Name: accounting_entries accounting_entries_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.accounting_entries
    ADD CONSTRAINT accounting_entries_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id);


--
-- TOC entry 5957 (class 2606 OID 19547)
-- Name: accounting_entries accounting_entries_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.accounting_entries
    ADD CONSTRAINT accounting_entries_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5915 (class 2606 OID 18344)
-- Name: accounts accounts_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- TOC entry 5974 (class 2606 OID 19887)
-- Name: app_role_permissions app_role_permissions_module_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT app_role_permissions_module_code_fkey FOREIGN KEY (codigo_modulo) REFERENCES public.app_permission_modules(codigo) ON DELETE CASCADE;


--
-- TOC entry 5975 (class 2606 OID 19910)
-- Name: app_user_permissions app_user_permissions_module_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_user_permissions
    ADD CONSTRAINT app_user_permissions_module_code_fkey FOREIGN KEY (codigo_modulo) REFERENCES public.app_permission_modules(codigo) ON DELETE CASCADE;


--
-- TOC entry 5976 (class 2606 OID 19905)
-- Name: app_user_permissions app_user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.app_user_permissions
    ADD CONSTRAINT app_user_permissions_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5941 (class 2606 OID 19343)
-- Name: asset_depreciations asset_depreciations_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_depreciations
    ADD CONSTRAINT asset_depreciations_asset_id_fkey FOREIGN KEY (ativo_id) REFERENCES public.assets(id) ON DELETE CASCADE;


--
-- TOC entry 5942 (class 2606 OID 19348)
-- Name: asset_depreciations asset_depreciations_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_depreciations
    ADD CONSTRAINT asset_depreciations_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5946 (class 2606 OID 19404)
-- Name: asset_maintenances asset_maintenances_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_maintenances
    ADD CONSTRAINT asset_maintenances_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);


--
-- TOC entry 5947 (class 2606 OID 19409)
-- Name: asset_maintenances asset_maintenances_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_maintenances
    ADD CONSTRAINT asset_maintenances_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5943 (class 2606 OID 19371)
-- Name: asset_transfers asset_transfers_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_asset_id_fkey FOREIGN KEY (ativo_id) REFERENCES public.assets(id);


--
-- TOC entry 5944 (class 2606 OID 19376)
-- Name: asset_transfers asset_transfers_from_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_from_unit_id_fkey FOREIGN KEY (unidade_origem_id) REFERENCES public.units(id);


--
-- TOC entry 5945 (class 2606 OID 19381)
-- Name: asset_transfers asset_transfers_to_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_to_unit_id_fkey FOREIGN KEY (unidade_destino_id) REFERENCES public.units(id);


--
-- TOC entry 5918 (class 2606 OID 18574)
-- Name: assets assets_responsible_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_responsible_employee_id_fkey FOREIGN KEY (funcionario_responsavel_id) REFERENCES public.employees(id);


--
-- TOC entry 5919 (class 2606 OID 18569)
-- Name: assets assets_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- TOC entry 5968 (class 2606 OID 19706)
-- Name: audit_logs audit_logs_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5969 (class 2606 OID 19711)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id);


--
-- TOC entry 5991 (class 2606 OID 20457)
-- Name: bank_reconciliations bank_reconciliations_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT bank_reconciliations_bank_account_id_fkey FOREIGN KEY (conta_bancaria_id) REFERENCES public.financial_accounts(id);


--
-- TOC entry 5992 (class 2606 OID 20452)
-- Name: bank_reconciliations bank_reconciliations_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT bank_reconciliations_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5993 (class 2606 OID 20491)
-- Name: bank_statement_transactions bank_statement_transactions_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.bank_statement_transactions
    ADD CONSTRAINT bank_statement_transactions_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.financial_accounts(id);


--
-- TOC entry 5994 (class 2606 OID 20486)
-- Name: bank_statement_transactions bank_statement_transactions_reconciliation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.bank_statement_transactions
    ADD CONSTRAINT bank_statement_transactions_reconciliation_id_fkey FOREIGN KEY (reconciliation_id) REFERENCES public.bank_reconciliations(id);


--
-- TOC entry 5995 (class 2606 OID 20496)
-- Name: bank_statement_transactions bank_statement_transactions_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.bank_statement_transactions
    ADD CONSTRAINT bank_statement_transactions_transaction_id_fkey FOREIGN KEY (transacao_id) REFERENCES public.transactions(id);


--
-- TOC entry 5996 (class 2606 OID 20481)
-- Name: bank_statement_transactions bank_statement_transactions_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.bank_statement_transactions
    ADD CONSTRAINT bank_statement_transactions_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5959 (class 2606 OID 19609)
-- Name: cash_closings cash_closings_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_closings
    ADD CONSTRAINT cash_closings_account_id_fkey FOREIGN KEY (id_conta) REFERENCES public.financial_accounts(id);


--
-- TOC entry 5960 (class 2606 OID 19614)
-- Name: cash_closings cash_closings_closed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_closings
    ADD CONSTRAINT cash_closings_closed_by_fkey FOREIGN KEY (fechado_por) REFERENCES public.users(id);


--
-- TOC entry 5961 (class 2606 OID 19604)
-- Name: cash_closings cash_closings_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_closings
    ADD CONSTRAINT cash_closings_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5962 (class 2606 OID 19641)
-- Name: cash_movements cash_movements_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.financial_accounts(id);


--
-- TOC entry 5963 (class 2606 OID 19651)
-- Name: cash_movements cash_movements_authorized_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_authorized_by_fkey FOREIGN KEY (autorizado_por) REFERENCES public.users(id);


--
-- TOC entry 5964 (class 2606 OID 19646)
-- Name: cash_movements cash_movements_responsible_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_responsible_fkey FOREIGN KEY (responsavel) REFERENCES public.users(id);


--
-- TOC entry 5965 (class 2606 OID 19636)
-- Name: cash_movements cash_movements_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.cash_movements
    ADD CONSTRAINT cash_movements_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5916 (class 2606 OID 18370)
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (categoria_pai_id) REFERENCES public.categories(id);


--
-- TOC entry 5917 (class 2606 OID 18365)
-- Name: categories categories_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- TOC entry 5954 (class 2606 OID 19523)
-- Name: chart_of_accounts chart_of_accounts_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.chart_of_accounts(id);


--
-- TOC entry 5955 (class 2606 OID 19518)
-- Name: chart_of_accounts chart_of_accounts_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5938 (class 2606 OID 19297)
-- Name: church_events church_events_parent_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.church_events
    ADD CONSTRAINT church_events_parent_event_id_fkey FOREIGN KEY (evento_pai_id) REFERENCES public.church_events(id);


--
-- TOC entry 5939 (class 2606 OID 19292)
-- Name: church_events church_events_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.church_events
    ADD CONSTRAINT church_events_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 6009 (class 2606 OID 22224)
-- Name: contas_financeiras contas_financeiras_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.contas_financeiras
    ADD CONSTRAINT contas_financeiras_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5935 (class 2606 OID 19227)
-- Name: dependents dependents_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.dependents
    ADD CONSTRAINT dependents_member_id_fkey FOREIGN KEY (id_membro) REFERENCES public.membros(id) ON DELETE CASCADE;


--
-- TOC entry 5913 (class 2606 OID 18304)
-- Name: employee_dependents employee_dependents_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_dependents
    ADD CONSTRAINT employee_dependents_employee_id_fkey FOREIGN KEY (id_funcionario) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5911 (class 2606 OID 18258)
-- Name: employees employees_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- TOC entry 5933 (class 2606 OID 18961)
-- Name: events events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (criado_por) REFERENCES public.users(id);


--
-- TOC entry 5934 (class 2606 OID 18956)
-- Name: events events_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- TOC entry 5937 (class 2606 OID 19266)
-- Name: financial_accounts financial_accounts_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.financial_accounts
    ADD CONSTRAINT financial_accounts_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 6003 (class 2606 OID 22132)
-- Name: funcionarios funcionarios_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE;


--
-- TOC entry 5951 (class 2606 OID 19492)
-- Name: inventory_adjustments inventory_adjustments_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);


--
-- TOC entry 5952 (class 2606 OID 19487)
-- Name: inventory_adjustments inventory_adjustments_inventory_count_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_inventory_count_id_fkey FOREIGN KEY (contagem_estoque_id) REFERENCES public.inventory_counts(id);


--
-- TOC entry 5953 (class 2606 OID 19497)
-- Name: inventory_adjustments inventory_adjustments_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5948 (class 2606 OID 19434)
-- Name: inventory_counts inventory_counts_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_counts
    ADD CONSTRAINT inventory_counts_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5949 (class 2606 OID 19463)
-- Name: inventory_items inventory_items_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_asset_id_fkey FOREIGN KEY (ativo_id) REFERENCES public.assets(id);


--
-- TOC entry 5950 (class 2606 OID 19458)
-- Name: inventory_items inventory_items_inventory_count_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_inventory_count_id_fkey FOREIGN KEY (contagem_estoque_id) REFERENCES public.inventory_counts(id) ON DELETE CASCADE;


--
-- TOC entry 5978 (class 2606 OID 20181)
-- Name: lgpd_consent_logs lgpd_consent_logs_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lgpd_consent_logs
    ADD CONSTRAINT lgpd_consent_logs_employee_id_fkey FOREIGN KEY (id_funcionario) REFERENCES public.employees(id);


--
-- TOC entry 5979 (class 2606 OID 20176)
-- Name: lgpd_consent_logs lgpd_consent_logs_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lgpd_consent_logs
    ADD CONSTRAINT lgpd_consent_logs_member_id_fkey FOREIGN KEY (id_membro) REFERENCES public.membros(id);


--
-- TOC entry 5980 (class 2606 OID 20186)
-- Name: lgpd_consent_logs lgpd_consent_logs_policy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lgpd_consent_logs
    ADD CONSTRAINT lgpd_consent_logs_policy_id_fkey FOREIGN KEY (politica_id) REFERENCES public.lgpd_policies(id);


--
-- TOC entry 5977 (class 2606 OID 20158)
-- Name: lgpd_policies lgpd_policies_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.lgpd_policies
    ADD CONSTRAINT lgpd_policies_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5936 (class 2606 OID 19247)
-- Name: member_contributions member_contributions_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.member_contributions
    ADD CONSTRAINT member_contributions_member_id_fkey FOREIGN KEY (id_membro) REFERENCES public.membros(id) ON DELETE CASCADE;


--
-- TOC entry 5914 (class 2606 OID 18322)
-- Name: member_dependents member_dependents_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member_dependents
    ADD CONSTRAINT member_dependents_member_id_fkey FOREIGN KEY (id_membro) REFERENCES public.membros(id) ON DELETE CASCADE;


--
-- TOC entry 5912 (class 2606 OID 18284)
-- Name: membros members_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membros
    ADD CONSTRAINT members_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- TOC entry 6001 (class 2606 OID 21016)
-- Name: payroll_calculations payroll_calculations_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll_calculations
    ADD CONSTRAINT payroll_calculations_employee_id_fkey FOREIGN KEY (id_funcionario) REFERENCES public.employees(id);


--
-- TOC entry 5928 (class 2606 OID 18906)
-- Name: payroll payroll_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_employee_id_fkey FOREIGN KEY (id_funcionario) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 5966 (class 2606 OID 19686)
-- Name: payroll_periods payroll_periods_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll_periods
    ADD CONSTRAINT payroll_periods_created_by_fkey FOREIGN KEY (criado_por) REFERENCES public.users(id);


--
-- TOC entry 5967 (class 2606 OID 19681)
-- Name: payroll_periods payroll_periods_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll_periods
    ADD CONSTRAINT payroll_periods_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id);


--
-- TOC entry 5929 (class 2606 OID 18911)
-- Name: payroll payroll_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_processed_by_fkey FOREIGN KEY (processado_por) REFERENCES public.users(id);


--
-- TOC entry 5930 (class 2606 OID 18901)
-- Name: payroll payroll_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- TOC entry 5999 (class 2606 OID 20736)
-- Name: pdi_plans pdi_plans_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pdi_plans
    ADD CONSTRAINT pdi_plans_employee_id_fkey FOREIGN KEY (id_funcionario) REFERENCES public.employees(id);


--
-- TOC entry 6000 (class 2606 OID 20731)
-- Name: pdi_plans pdi_plans_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pdi_plans
    ADD CONSTRAINT pdi_plans_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 6007 (class 2606 OID 22204)
-- Name: perfil_permissoes perfil_permissoes_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.perfil_permissoes
    ADD CONSTRAINT perfil_permissoes_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfis(id_perfil);


--
-- TOC entry 6008 (class 2606 OID 22209)
-- Name: perfil_permissoes perfil_permissoes_id_permissao_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.perfil_permissoes
    ADD CONSTRAINT perfil_permissoes_id_permissao_fkey FOREIGN KEY (id_permissao) REFERENCES public.permissoes(id_permissao);


--
-- TOC entry 5997 (class 2606 OID 20709)
-- Name: performance_evaluations performance_evaluations_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.performance_evaluations
    ADD CONSTRAINT performance_evaluations_employee_id_fkey FOREIGN KEY (id_funcionario) REFERENCES public.employees(id);


--
-- TOC entry 5998 (class 2606 OID 20704)
-- Name: performance_evaluations performance_evaluations_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.performance_evaluations
    ADD CONSTRAINT performance_evaluations_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 6002 (class 2606 OID 22113)
-- Name: pessoas pessoas_id_unidade_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id_unidade);


--
-- TOC entry 5931 (class 2606 OID 18927)
-- Name: system_logs system_logs_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id);


--
-- TOC entry 5932 (class 2606 OID 18932)
-- Name: system_logs system_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id);


--
-- TOC entry 5970 (class 2606 OID 19734)
-- Name: tax_configs tax_configs_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.tax_configs
    ADD CONSTRAINT tax_configs_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 6010 (class 2606 OID 22242)
-- Name: transacoes transacoes_id_conta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_conta_fkey FOREIGN KEY (id_conta) REFERENCES public.contas_financeiras(id_conta);


--
-- TOC entry 6011 (class 2606 OID 22247)
-- Name: transacoes transacoes_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoas(id_pessoa);


--
-- TOC entry 5923 (class 2606 OID 18814)
-- Name: transactions transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (id_conta) REFERENCES public.accounts(id);


--
-- TOC entry 5924 (class 2606 OID 18824)
-- Name: transactions transactions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 5925 (class 2606 OID 18819)
-- Name: transactions transactions_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_member_id_fkey FOREIGN KEY (id_membro) REFERENCES public.membros(id);


--
-- TOC entry 5926 (class 2606 OID 20518)
-- Name: transactions transactions_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_parent_id_fkey FOREIGN KEY (id_transacao_origem) REFERENCES public.transactions(id);


--
-- TOC entry 5927 (class 2606 OID 18809)
-- Name: transactions transactions_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- TOC entry 5986 (class 2606 OID 20378)
-- Name: treasury_alerts treasury_alerts_conta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_alerts
    ADD CONSTRAINT treasury_alerts_conta_id_fkey FOREIGN KEY (id_conta) REFERENCES public.financial_accounts(id);


--
-- TOC entry 5987 (class 2606 OID 20388)
-- Name: treasury_alerts treasury_alerts_emprestimo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_alerts
    ADD CONSTRAINT treasury_alerts_emprestimo_id_fkey FOREIGN KEY (emprestimo_id) REFERENCES public.treasury_loans(id);


--
-- TOC entry 5988 (class 2606 OID 20383)
-- Name: treasury_alerts treasury_alerts_investimento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_alerts
    ADD CONSTRAINT treasury_alerts_investimento_id_fkey FOREIGN KEY (investimento_id) REFERENCES public.treasury_investments(id);


--
-- TOC entry 5989 (class 2606 OID 20373)
-- Name: treasury_alerts treasury_alerts_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_alerts
    ADD CONSTRAINT treasury_alerts_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id);


--
-- TOC entry 5981 (class 2606 OID 20258)
-- Name: treasury_cash_flows treasury_cash_flows_conta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_cash_flows
    ADD CONSTRAINT treasury_cash_flows_conta_id_fkey FOREIGN KEY (id_conta) REFERENCES public.financial_accounts(id);


--
-- TOC entry 5982 (class 2606 OID 20253)
-- Name: treasury_cash_flows treasury_cash_flows_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_cash_flows
    ADD CONSTRAINT treasury_cash_flows_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id);


--
-- TOC entry 5990 (class 2606 OID 20421)
-- Name: treasury_financial_positions treasury_financial_positions_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_financial_positions
    ADD CONSTRAINT treasury_financial_positions_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5983 (class 2606 OID 20290)
-- Name: treasury_forecasts treasury_forecasts_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_forecasts
    ADD CONSTRAINT treasury_forecasts_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5984 (class 2606 OID 20317)
-- Name: treasury_investments treasury_investments_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_investments
    ADD CONSTRAINT treasury_investments_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5985 (class 2606 OID 20348)
-- Name: treasury_loans treasury_loans_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.treasury_loans
    ADD CONSTRAINT treasury_loans_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5972 (class 2606 OID 19845)
-- Name: user_permissions user_permissions_module_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_module_code_fkey FOREIGN KEY (codigo_modulo) REFERENCES public.permission_modules(codigo) ON DELETE CASCADE;


--
-- TOC entry 5973 (class 2606 OID 19840)
-- Name: user_permissions user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5920 (class 2606 OID 18775)
-- Name: users users_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_employee_id_fkey FOREIGN KEY (id_funcionario) REFERENCES public.employees(id);


--
-- TOC entry 5921 (class 2606 OID 18780)
-- Name: users users_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_member_id_fkey FOREIGN KEY (id_membro) REFERENCES public.membros(id);


--
-- TOC entry 5922 (class 2606 OID 18770)
-- Name: users users_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unit_id_fkey FOREIGN KEY (id_unidade) REFERENCES public.units(id);


--
-- TOC entry 6004 (class 2606 OID 22155)
-- Name: usuarios usuarios_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoas(id_pessoa) ON DELETE CASCADE;


--
-- TOC entry 6005 (class 2606 OID 22192)
-- Name: usuarios_perfis usuarios_perfis_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios_perfis
    ADD CONSTRAINT usuarios_perfis_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfis(id_perfil);


--
-- TOC entry 6006 (class 2606 OID 22187)
-- Name: usuarios_perfis usuarios_perfis_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.usuarios_perfis
    ADD CONSTRAINT usuarios_perfis_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5940 (class 2606 OID 19319)
-- Name: volunteer_schedules volunteer_schedules_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: desenvolvedor
--

ALTER TABLE ONLY public.volunteer_schedules
    ADD CONSTRAINT volunteer_schedules_event_id_fkey FOREIGN KEY (evento_id) REFERENCES public.church_events(id) ON DELETE CASCADE;


--
-- TOC entry 6183 (class 3256 OID 18749)
-- Name: employees Permitir acesso total aos funcionários; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir acesso total aos funcionários" ON public.employees USING (true);


--
-- TOC entry 6184 (class 3256 OID 18747)
-- Name: membros Permitir acesso total aos membros; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir acesso total aos membros" ON public.membros USING (true);


--
-- TOC entry 6185 (class 3256 OID 18748)
-- Name: accounts Permitir acesso total às contas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir acesso total às contas" ON public.accounts USING (true);


--
-- TOC entry 6182 (class 3256 OID 18746)
-- Name: units Permitir acesso total às unidades; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permitir acesso total às unidades" ON public.units USING (true);


--
-- TOC entry 6181 (class 0 OID 18327)
-- Dependencies: 226
-- Name: accounts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 6179 (class 0 OID 18218)
-- Dependencies: 222
-- Name: employees; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 6180 (class 0 OID 18263)
-- Dependencies: 223
-- Name: membros; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 6178 (class 0 OID 18171)
-- Dependencies: 221
-- Name: units; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Completed on 2026-05-26 16:20:57

--
-- PostgreSQL database dump complete
--

\unrestrict EcQLZD2OevJ81rHw3SFgGRrahgfVdYV4oE1kwpcTXjZjNiuQHm3FeXckd1l09iW

