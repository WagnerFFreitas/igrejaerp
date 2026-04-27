-- =====================================================
-- ERP IGREJA - MIGRAÇÃO FIRESTORE → POSTGRESQL
-- Estrutura completa do banco de dados relacional
-- =====================================================

-- Criar banco de dados
-- CREATE DATABASE igrejaerp;
-- \c igrejaerp;

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TIPOS ENUMS PERSONALIZADOS
-- =====================================================

-- Tipos de usuário e permissões
CREATE TYPE user_role AS ENUM ('ADMIN', 'SECRETARY', 'TREASURER', 'PASTOR', 'RH', 'DP', 'FINANCEIRO', 'DEVELOPER');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- Tipos para unidades
CREATE TYPE unit_status AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- Tipos para membros
CREATE TYPE member_role AS ENUM ('MEMBER', 'VISITOR', 'VOLUNTEER', 'STAFF', 'LEADER');
CREATE TYPE member_status AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');
CREATE TYPE gender AS ENUM ('M', 'F', 'OTHER');
CREATE TYPE marital_status AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- Tipos para funcionários
CREATE TYPE employment_regime AS ENUM ('CLT', 'PRO_LABORE', 'ESTAGIO', 'AUTONOMO');
CREATE TYPE leave_type AS ENUM ('VACATION', 'MEDICAL', 'MATERNITY', 'PATERNITY', 'MILITARY', 'WEDDING', 'BEREAVEMENT', 'UNPAID');
CREATE TYPE leave_status AS ENUM ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- Tipos financeiros
CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE transaction_status AS ENUM ('PAID', 'PENDING');
CREATE TYPE payment_method AS ENUM ('PIX', 'CASH', 'CREDIT_CARD', 'TRANSFER', 'DEBIT_CARD', 'CHECK', 'BOLETO');
CREATE TYPE account_type AS ENUM ('CASH', 'BANK', 'SAVINGS', 'INVESTMENT');
CREATE TYPE account_status_type AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- Tipos para eventos da igreja
CREATE TYPE event_type AS ENUM ('SERVICE', 'MEETING', 'EVENT');
CREATE TYPE recurrence_pattern AS ENUM ('NONE', 'WEEKLY', 'MONTHLY');

-- Tipos para patrimônio
CREATE TYPE asset_type AS ENUM ('IMOVEIS', 'VEICULOS', 'EQUIPAMENTOS', 'MOVEIS', 'COMPUTADORES', 'MAQUINAS');
CREATE TYPE asset_status AS ENUM ('ATIVO', 'MANUTENCAO', 'OCIOSO', 'BAIXADO', 'SUCATA');
CREATE TYPE depreciation_method AS ENUM ('LINEAR', 'ACELERADA');
CREATE TYPE asset_condition AS ENUM ('NOVO', 'BOM', 'REGULAR', 'RUIM', 'SUCATA');

-- Tipos contábeis
CREATE TYPE account_nature AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE');
CREATE TYPE account_type_level AS ENUM ('SYNTHETIC', 'ANALYTIC');
CREATE TYPE normal_balance AS ENUM ('DEBIT', 'CREDIT');

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Unidades da Igreja (sedes e filiais)
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    is_headquarter BOOLEAN DEFAULT FALSE,
    status unit_status DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usuários do Sistema
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    unit_id UUID NOT NULL REFERENCES units(id),
    status user_status DEFAULT 'ACTIVE',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Membros da Igreja
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    matricula VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    profession VARCHAR(100),
    role member_role DEFAULT 'MEMBER',
    status member_status DEFAULT 'ACTIVE',
    
    -- Dados pessoais
    birth_date DATE,
    gender gender,
    marital_status marital_status,
    spouse_name VARCHAR(255),
    marriage_date DATE,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    blood_type VARCHAR(10),
    emergency_contact VARCHAR(100),
    
    -- Endereço
    zip_code VARCHAR(10),
    street VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    
    -- Vida cristã
    conversion_date DATE,
    conversion_place VARCHAR(255),
    baptism_date DATE,
    baptism_church VARCHAR(255),
    baptizing_pastor VARCHAR(255),
    holy_spirit_baptism BOOLEAN DEFAULT FALSE,
    
    -- Formação e status
    membership_date DATE,
    church_of_origin VARCHAR(255),
    discipleship_course VARCHAR(20) DEFAULT 'NAO_INICIADO',
    biblical_school VARCHAR(20) DEFAULT 'INATIVO',
    
    -- Ministérios
    main_ministry VARCHAR(100),
    ministry_role VARCHAR(100),
    other_ministries TEXT[],
    ecclesiastical_position VARCHAR(100),
    consecration_date DATE,
    
    -- Financeiro
    is_tithable BOOLEAN DEFAULT TRUE,
    is_regular_giver BOOLEAN DEFAULT FALSE,
    participates_campaigns BOOLEAN DEFAULT FALSE,
    
    -- Dados bancários
    bank VARCHAR(100),
    bank_agency VARCHAR(20),
    bank_account VARCHAR(50),
    pix_key VARCHAR(100),
    
    -- Metadados
    observations TEXT,
    special_needs TEXT,
    talents TEXT,
    tags TEXT[],
    family_id UUID,
    avatar TEXT,
    profile_data JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dependentes dos Membros
CREATE TABLE dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    relationship VARCHAR(20) NOT NULL CHECK (relationship IN ('FILHO', 'FILHA', 'CONJUGE', 'PAI', 'MAE', 'OUTRO')),
    cpf VARCHAR(14),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contribuições dos Membros
CREATE TABLE member_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    value DECIMAL(15,2) NOT NULL,
    contribution_date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Dizimo', 'OFFERING', 'CAMPAIGN')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Funcionários/Colaboradores
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(20),
    pis VARCHAR(20) UNIQUE NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    regime employment_regime NOT NULL,
    admission_date DATE NOT NULL,
    salary DECIMAL(15,2) NOT NULL,
    work_hours INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    termination_date DATE,
    observations TEXT,
    
    -- Dados bancários
    bank VARCHAR(100),
    agency VARCHAR(20),
    account VARCHAR(50),
    profile_data JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Afastamentos de Funcionários
CREATE TABLE employee_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    employee_name VARCHAR(255) NOT NULL,
    type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cid10 VARCHAR(10),
    doctor_name VARCHAR(255),
    crm VARCHAR(20),
    status leave_status DEFAULT 'SCHEDULED',
    observations TEXT,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contas Financeiras
CREATE TABLE financial_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    name VARCHAR(255) NOT NULL,
    type account_type NOT NULL,
    current_balance DECIMAL(15,2) DEFAULT 0,
    minimum_balance DECIMAL(15,2),
    status account_status_type DEFAULT 'ACTIVE',
    bank_code VARCHAR(10),
    agency_number VARCHAR(20),
    account_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transações Financeiras
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transaction_date DATE NOT NULL,
    competency_date DATE NOT NULL,
    type transaction_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    cost_center VARCHAR(100) NOT NULL,
    account_id UUID NOT NULL REFERENCES financial_accounts(id),
    member_id UUID REFERENCES members(id),
    status transaction_status DEFAULT 'PENDING',
    is_conciliated BOOLEAN DEFAULT FALSE,
    operation_nature TEXT,
    project_id UUID,
    payment_method payment_method,
    provider_name VARCHAR(255),
    
    -- Campos para contas a pagar/receber
    due_date DATE,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    remaining_amount DECIMAL(15,2),
    
    -- Campos para parcelamento
    is_installment BOOLEAN DEFAULT FALSE,
    installment_number INTEGER,
    total_installments INTEGER,
    parent_id UUID REFERENCES transactions(id),
    
    -- Conciliação
    conciliation_date DATE,
    notes TEXT,
    external_id VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Eventos da Igreja
CREATE TABLE church_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    attendees_count INTEGER DEFAULT 0,
    type event_type NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern recurrence_pattern DEFAULT 'NONE',
    recurrence_end_date DATE,
    parent_event_id UUID REFERENCES church_events(id),
    is_generated_event BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Escala de Voluntários para Eventos
CREATE TABLE volunteer_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES church_events(id) ON DELETE CASCADE,
    ministry VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    volunteer_id UUID,
    volunteer_name VARCHAR(255),
    volunteer_phone VARCHAR(20),
    volunteer_email VARCHAR(255),
    confirmed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    required_count INTEGER NOT NULL DEFAULT 1,
    assigned_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patrimônio
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    category asset_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    acquisition_date DATE NOT NULL,
    acquisition_value DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2),
    supplier VARCHAR(255),
    invoice_number VARCHAR(100),
    serial_number VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    responsible VARCHAR(255),
    status asset_status DEFAULT 'ATIVO',
    photos TEXT[],
    documents TEXT[],
    useful_life_months INTEGER NOT NULL,
    depreciation_rate DECIMAL(5,2) NOT NULL,
    depreciation_method depreciation_method DEFAULT 'LINEAR',
    current_book_value DECIMAL(15,2),
    accumulated_depreciation DECIMAL(15,2) DEFAULT 0,
    residual_value DECIMAL(15,2),
    last_inventory_date DATE,
    inventory_count INTEGER,
    asset_number VARCHAR(50) UNIQUE NOT NULL,
    condition asset_condition DEFAULT 'NOVO',
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Depreciação de Ativos
CREATE TABLE asset_depreciations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id),
    reference_month INTEGER NOT NULL CHECK (reference_month BETWEEN 1 AND 12),
    reference_year INTEGER NOT NULL,
    beginning_book_value DECIMAL(15,2) NOT NULL,
    depreciation_expense DECIMAL(15,2) NOT NULL,
    accumulated_depreciation DECIMAL(15,2) NOT NULL,
    ending_book_value DECIMAL(15,2) NOT NULL,
    debit_account VARCHAR(50),
    credit_account VARCHAR(50),
    document_number VARCHAR(100),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_id, reference_month, reference_year)
);

-- Transferência de Ativos
CREATE TABLE asset_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id),
    from_unit_id UUID NOT NULL REFERENCES units(id),
    to_unit_id UUID NOT NULL REFERENCES units(id),
    transfer_date DATE NOT NULL,
    reason TEXT NOT NULL,
    responsible VARCHAR(255) NOT NULL,
    authorized_by VARCHAR(255),
    observations TEXT,
    status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'REALIZADA', 'CANCELADA')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Manutenção de Ativos
CREATE TABLE asset_maintenances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id),
    unit_id UUID NOT NULL REFERENCES units(id),
    maintenance_date DATE NOT NULL,
    maintenance_type VARCHAR(20) NOT NULL CHECK (maintenance_type IN ('PREVENTIVA', 'CORRETIVA', 'MELHORIA')),
    description TEXT NOT NULL,
    provider VARCHAR(255),
    cost DECIMAL(15,2),
    document_number VARCHAR(100),
    next_maintenance_date DATE,
    performed_by VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PROGRAMADA' CHECK (status IN ('PROGRAMADA', 'REALIZADA', 'CANCELADA')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contagem de Inventário
CREATE TABLE inventory_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    count_date DATE NOT NULL,
    counted_by VARCHAR(255) NOT NULL,
    reviewed_by VARCHAR(255),
    status VARCHAR(20) DEFAULT 'EM_ANDAMENTO' CHECK (status IN ('EM_ANDAMENTO', 'CONCLUIDO', 'REVISAO')),
    total_assets INTEGER DEFAULT 0,
    total_expected INTEGER DEFAULT 0,
    total_found INTEGER DEFAULT 0,
    total_difference INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Itens do Inventário
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_count_id UUID NOT NULL REFERENCES inventory_counts(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id),
    asset_name VARCHAR(255) NOT NULL,
    category asset_type NOT NULL,
    expected_quantity INTEGER NOT NULL,
    counted_quantity INTEGER NOT NULL,
    difference INTEGER NOT NULL,
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('BOM', 'REGULAR', 'RUIM', 'SUCATA')),
    location VARCHAR(255),
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ajuste de Inventário
CREATE TABLE inventory_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_count_id UUID NOT NULL REFERENCES inventory_counts(id),
    asset_id UUID NOT NULL REFERENCES assets(id),
    unit_id UUID NOT NULL REFERENCES units(id),
    adjustment_type VARCHAR(20) NOT NULL CHECK (adjustment_type IN ('ENTRADA', 'SAIDA', 'BAIXA')),
    quantity INTEGER NOT NULL,
    reason TEXT NOT NULL,
    justification TEXT NOT NULL,
    approved_by VARCHAR(255),
    accounting_entry BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MÓDULO CONTÁBIL
-- =====================================================

-- Plano de Contas
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    nature account_nature NOT NULL,
    type account_type_level NOT NULL,
    parent_id UUID REFERENCES chart_of_accounts(id),
    normal_balance normal_balance NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(unit_id, code)
);

-- Lançamentos Contábeis
CREATE TABLE accounting_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    entry_number INTEGER NOT NULL,
    entry_date DATE NOT NULL,
    document_number VARCHAR(100),
    history TEXT NOT NULL,
    complement TEXT,
    debit_value DECIMAL(15,2) NOT NULL,
    credit_value DECIMAL(15,2) NOT NULL,
    contra_account VARCHAR(50),
    transaction_id UUID REFERENCES transactions(id),
    project_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    reviewed_by VARCHAR(255),
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'POSTED', 'REVERSED'))
);

-- Saldos Contábeis
CREATE TABLE account_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    account_name VARCHAR(255) NOT NULL,
    account_code VARCHAR(20) NOT NULL,
    nature account_nature NOT NULL,
    period VARCHAR(7) NOT NULL, -- YYYY-MM
    opening_balance DECIMAL(15,2) DEFAULT 0,
    debit_period DECIMAL(15,2) DEFAULT 0,
    credit_period DECIMAL(15,2) DEFAULT 0,
    closing_balance DECIMAL(15,2) DEFAULT 0,
    entries_count INTEGER DEFAULT 0,
    UNIQUE(account_id, period)
);

-- =====================================================
-- MÓDULO DE TESOURARIA
-- =====================================================

-- Fechamento de Caixa Diário
CREATE TABLE cash_closings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    account_id UUID NOT NULL REFERENCES financial_accounts(id),
    closing_date DATE NOT NULL,
    opening_balance DECIMAL(15,2) NOT NULL,
    total_inflows DECIMAL(15,2) NOT NULL,
    total_outflows DECIMAL(15,2) NOT NULL,
    expected_balance DECIMAL(15,2) NOT NULL,
    actual_balance DECIMAL(15,2) NOT NULL,
    difference DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'RECONCILING')),
    observations TEXT,
    closed_by UUID REFERENCES users(id),
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(unit_id, account_id, closing_date)
);

-- Movimentos de Caixa (Sangria/Suprimento)
CREATE TABLE cash_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    account_id UUID NOT NULL REFERENCES financial_accounts(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('WITHDRAWAL', 'SUPPLY')),
    amount DECIMAL(15,2) NOT NULL,
    reason TEXT NOT NULL,
    document_number VARCHAR(100),
    responsible UUID NOT NULL REFERENCES users(id),
    authorized_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MÓDULO DE FOLHA DE PAGAMENTO
-- =====================================================

-- Períodos de Folha
CREATE TABLE payroll_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'PROCESSING')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    total_employees INTEGER DEFAULT 0,
    total_payroll DECIMAL(15,2) DEFAULT 0,
    total_inss DECIMAL(15,2) DEFAULT 0,
    total_fgts DECIMAL(15,2) DEFAULT 0,
    total_irrf DECIMAL(15,2) DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    notes TEXT,
    UNIQUE(unit_id, month, year)
);

-- Cálculos de Folha
CREATE TABLE payroll_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    competency_month VARCHAR(7) NOT NULL, -- YYYY-MM
    gross_salary DECIMAL(15,2) NOT NULL,
    
    -- Proventos
    base_salary DECIMAL(15,2) NOT NULL,
    overtime DECIMAL(15,2) DEFAULT 0,
    night_shift DECIMAL(15,2) DEFAULT 0,
    hazard_pay DECIMAL(15,2) DEFAULT 0,
    commission DECIMAL(15,2) DEFAULT 0,
    bonuses DECIMAL(15,2) DEFAULT 0,
    family_salary DECIMAL(15,2) DEFAULT 0,
    other_allowances DECIMAL(15,2) DEFAULT 0,
    
    -- Descontos
    inss DECIMAL(15,2) NOT NULL,
    irrf DECIMAL(15,2) NOT NULL,
    fgts DECIMAL(15,2) NOT NULL,
    "union" DECIMAL(15,2) DEFAULT 0,
    health_insurance DECIMAL(15,2) DEFAULT 0,
    dental_insurance DECIMAL(15,2) DEFAULT 0,
    meal_allowance DECIMAL(15,2) DEFAULT 0,
    meal_ticket DECIMAL(15,2) DEFAULT 0,
    transport DECIMAL(15,2) DEFAULT 0,
    pharmacy DECIMAL(15,2) DEFAULT 0,
    life_insurance DECIMAL(15,2) DEFAULT 0,
    advance DECIMAL(15,2) DEFAULT 0,
    consignado DECIMAL(15,2) DEFAULT 0,
    coparticipation DECIMAL(15,2) DEFAULT 0,
    absences DECIMAL(15,2) DEFAULT 0,
    delays DECIMAL(15,2) DEFAULT 0,
    alimony DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    
    -- Totais
    total_allowances DECIMAL(15,2) NOT NULL,
    total_deductions DECIMAL(15,2) NOT NULL,
    net_salary DECIMAL(15,2) NOT NULL,
    employer_cost DECIMAL(15,2) NOT NULL,
    
    -- Detalhes dos cálculos
    inss_base DECIMAL(15,2) NOT NULL,
    inss_rate DECIMAL(5,2) NOT NULL,
    inss_value DECIMAL(15,2) NOT NULL,
    irrf_base DECIMAL(15,2) NOT NULL,
    irrf_rate DECIMAL(5,2) NOT NULL,
    irrf_deduction DECIMAL(15,2) NOT NULL,
    irrf_value DECIMAL(15,2) NOT NULL,
    fgts_base DECIMAL(15,2) NOT NULL,
    fgts_rate DECIMAL(5,2) NOT NULL,
    fgts_value DECIMAL(15,2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
-- =====================================================

-- Logs de Auditoria
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    entity_name VARCHAR(255),
    action_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    details JSONB,
    success BOOLEAN DEFAULT TRUE,
    hash VARCHAR(64)
);

-- =====================================================
-- CONFIGURAÇÕES E PARAMETRIZAÇÃO
-- =====================================================

-- Configuração Tributária
CREATE TABLE tax_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    inss_brackets JSONB NOT NULL,
    irrf_brackets JSONB NOT NULL,
    fgts_rate DECIMAL(5,2) NOT NULL DEFAULT 8.0,
    patronal_rate DECIMAL(5,2),
    rat_rate DECIMAL(5,2),
    terceiros_rate DECIMAL(5,2),
    default_va DECIMAL(15,2),
    default_vr DECIMAL(15,2),
    third_party_entities JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(unit_id)
);

-- Configuração Contábil
CREATE TABLE accounting_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    fiscal_year INTEGER NOT NULL,
    start_month INTEGER NOT NULL CHECK (start_month BETWEEN 1 AND 12),
    end_month INTEGER NOT NULL CHECK (end_month BETWEEN 1 AND 12),
    currency VARCHAR(3) DEFAULT 'BRL',
    tax_regime VARCHAR(20) DEFAULT 'ISENTO' CHECK (tax_regime IN ('SIMPLES', 'LUCRO_PRESUMIDO', 'ISENTO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(unit_id, fiscal_year)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas frequentes
CREATE INDEX idx_members_unit_id ON members(unit_id);
CREATE INDEX idx_members_cpf ON members(cpf);
CREATE INDEX idx_members_name ON members(name);
CREATE INDEX idx_members_status ON members(status);

CREATE INDEX idx_employees_unit_id ON employees(unit_id);
CREATE INDEX idx_employees_cpf ON employees(cpf);
CREATE INDEX idx_employees_name ON employees(name);
CREATE INDEX idx_employees_active ON employees(active);

CREATE INDEX idx_transactions_unit_id ON transactions(unit_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);

CREATE INDEX idx_assets_unit_id ON assets(unit_id);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_status ON assets(status);

CREATE INDEX idx_church_events_unit_id ON church_events(unit_id);
CREATE INDEX idx_church_events_date ON church_events(event_date);

CREATE INDEX idx_payroll_calculations_employee_id ON payroll_calculations(employee_id);
CREATE INDEX idx_payroll_calculations_competency ON payroll_calculations(competency_month);

CREATE INDEX idx_audit_logs_unit_id ON audit_logs(unit_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_date ON audit_logs(action_date);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);

-- Índices compostos para performance
CREATE INDEX idx_transactions_unit_date ON transactions(unit_id, transaction_date);
CREATE INDEX idx_members_unit_status ON members(unit_id, status);
CREATE INDEX idx_employees_unit_active ON employees(unit_id, active);

-- =====================================================
-- TRIGGERS E FUNÇÕES
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualização automática de updated_at
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_church_events_updated_at BEFORE UPDATE ON church_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_accounts_updated_at BEFORE UPDATE ON financial_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para resumo financeiro
CREATE VIEW financial_summary AS
SELECT 
    u.id as unit_id,
    u.name as unit_name,
    COUNT(t.id) as total_transactions,
    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) as total_expense,
    SUM(t.amount) as net_amount,
    COUNT(DISTINCT t.account_id) as accounts_used
FROM units u
LEFT JOIN transactions t ON u.id = t.unit_id
GROUP BY u.id, u.name;

-- View para membros ativos por unidade
CREATE VIEW active_members_by_unit AS
SELECT 
    u.id as unit_id,
    u.name as unit_name,
    COUNT(m.id) as total_members,
    COUNT(CASE WHEN m.status = 'ACTIVE' THEN 1 END) as active_members,
    COUNT(CASE WHEN m.is_tithable = TRUE THEN 1 END) as tithing_members,
    COUNT(CASE WHEN m.is_regular_giver = TRUE THEN 1 END) as regular_givers
FROM units u
LEFT JOIN members m ON u.id = m.unit_id
GROUP BY u.id, u.name;

-- View para patrimônio por unidade
CREATE VIEW asset_summary_by_unit AS
SELECT 
    u.id as unit_id,
    u.name as unit_name,
    COUNT(a.id) as total_assets,
    SUM(a.acquisition_value) as total_acquisition_value,
    SUM(a.current_value) as total_current_value,
    SUM(a.accumulated_depreciation) as total_depreciation,
    COUNT(CASE WHEN a.status = 'ATIVO' THEN 1 END) as active_assets
FROM units u
LEFT JOIN assets a ON u.id = a.unit_id
GROUP BY u.id, u.name;

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Inserir unidade matriz padrão
INSERT INTO units (id, name, cnpj, address, city, state, is_headquarter) 
VALUES (
    uuid_generate_v4(),
    'Igreja Matriz',
    '00.000.000/0001-00',
    'Rua Principal, 123',
    'São Paulo',
    'SP',
    TRUE
) ON CONFLICT (cnpj) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON DATABASE igrejaerp IS 'ERP para Gestão de Igreja - Migrado do Firebase Firestore';

COMMENT ON TABLE units IS 'Unidades da igreja (matriz e filiais)';
COMMENT ON TABLE users IS 'Usuários do sistema com permissões';
COMMENT ON TABLE members IS 'Membros da igreja com dados completos';
COMMENT ON TABLE employees IS 'Funcionários e colaboradores';
COMMENT ON TABLE transactions IS 'Transações financeiras (receitas/despesas)';
COMMENT ON TABLE assets IS 'Patrimônio e bens da igreja';
COMMENT ON TABLE church_events IS 'Eventos e programações da igreja';
COMMENT ON TABLE audit_logs IS 'Logs de auditoria do sistema';

-- Finalização
SELECT 'PostgreSQL database schema for Igreja ERP created successfully!' as status;
