-- ====================================================================
-- ADJPA ERP - Schema Completo do Banco de Dados
-- Sistema de Gestão para Igrejas
-- Versão: 1.0.0
-- Data: 07/03/2026
-- ====================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- TABELAS PRINCIPAIS
-- ====================================================================

-- Tabela de Unidades (Igrejas/Congregações)
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  address TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'BR',
  phone TEXT,
  email TEXT,
  website TEXT,
  pastor_name TEXT,
  pastor_phone TEXT,
  is_headquarter BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  CONSTRAINT units_name_check CHECK (length(name) >= 3),
  CONSTRAINT units_cnpj_check CHECK (cnpj ~ '^[0-9]{2}\.[0-9]{3}\.[0-9]{3}/[0-9]{4}-[0-9]{2}$' OR cnpj IS NULL)
);

-- Tabela de Usuários do Sistema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'EMPLOYEE', 'MEMBER')),
  unit_id UUID REFERENCES units(id),
  employee_id UUID REFERENCES employees(id),
  member_id UUID REFERENCES members(id),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT users_email_check CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabela de Funcionários
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  rg TEXT,
  ctps TEXT,
  ctps_serie TEXT,
  pis TEXT,
  birth_date DATE,
  sexo TEXT CHECK (sexo IN ('M', 'F', 'O')),
  estado_civil TEXT CHECK (estado_civil IN ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO')),
  blood_type TEXT,
  email TEXT,
  phone TEXT,
  celular TEXT,
  emergency_contact TEXT,
  naturalidade TEXT,
  escolaridade TEXT,
  raca_cor TEXT,
  nome_mae TEXT,
  nome_pai TEXT,
  deficiencia TEXT,
  deficiencia_obs TEXT,
  avatar TEXT,
  observacoes_saude TEXT,
  
  -- Endereço
  address_zip_code TEXT,
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_country TEXT,
  
  -- Contrato
  matricula TEXT UNIQUE,
  cargo TEXT,
  funcao TEXT,
  departamento TEXT,
  cbo TEXT,
  data_admissao DATE,
  data_demissao DATE,
  tipo_contrato TEXT CHECK (tipo_contrato IN ('CLT', 'PJ', 'VOLUNTARIO', 'TEMPORARIO')),
  regime_trabalho TEXT CHECK (regime_trabalho IN ('PRESENCIAL', 'HIBRIDO', 'REMOTO')),
  sindicato TEXT,
  convencao_coletiva TEXT,
  salario_base DECIMAL(10,2),
  tipo_salario TEXT CHECK (tipo_salario IN ('MENSAL', 'HORISTA', 'COMISSIONADO')),
  forma_pagamento TEXT CHECK (forma_pagamento IN ('TRANSFERENCIA', 'PIX', 'CHEQUE', 'DINHEIRO')),
  dia_pagamento TEXT,
  
  -- Jornada
  jornada_trabalho TEXT,
  escala_trabalho TEXT,
  horario_entrada TIME,
  horario_saida TIME,
  inicio_intervalo TIME,
  fim_intervalo TIME,
  duracao_intervalo TIME,
  segunda_a_sexta TEXT,
  sabado TEXT,
  trabalha_feriados BOOLEAN DEFAULT FALSE,
  controla_intervalo BOOLEAN DEFAULT FALSE,
  horas_extras_autorizadas BOOLEAN DEFAULT FALSE,
  tipo_registro_ponto TEXT,
  tolerancia_ponto TEXT,
  codigo_horario TEXT,
  
  -- Dados Bancários
  banco TEXT,
  codigo_banco TEXT,
  agencia TEXT,
  conta TEXT,
  tipo_conta TEXT CHECK (tipo_conta IN ('CORRENTE', 'POUPANCA')),
  titular TEXT,
  chave_pix TEXT,
  
  -- Benefícios
  vt_ativo BOOLEAN DEFAULT FALSE,
  vt_valor_diario DECIMAL(5,2),
  vt_qtd_vales_dia INTEGER,
  vale_transporte_total DECIMAL(10,2),
  
  va_ativo BOOLEAN DEFAULT FALSE,
  va_operadora TEXT,
  vale_alimentacao DECIMAL(10,2),
  
  vr_ativo BOOLEAN DEFAULT FALSE,
  vr_operadora TEXT,
  vale_refeicao DECIMAL(10,2),
  
  ps_ativo BOOLEAN DEFAULT FALSE,
  ps_operadora TEXT,
  ps_tipo_plano TEXT,
  ps_carteirinha TEXT,
  plano_saude_colaborador DECIMAL(10,2),
  ps_dependentes_ativo BOOLEAN DEFAULT FALSE,
  plano_saude_dependentes DECIMAL(10,2),
  
  po_ativo BOOLEAN DEFAULT FALSE,
  po_operadora TEXT,
  po_carteirinha TEXT,
  plano_odontologico DECIMAL(10,2),
  
  auxilio_moradia DECIMAL(10,2),
  vale_farmacia DECIMAL(10,2),
  seguro_vida DECIMAL(10,2),
  auxilio_creche DECIMAL(10,2),
  auxilio_educacao DECIMAL(10,2),
  gympass_plano TEXT,
  
  -- Documentos
  titulo_eleitor TEXT,
  titulo_eleitor_zona TEXT,
  titulo_eleitor_secao TEXT,
  reservista TEXT,
  cnh_numero TEXT,
  cnh_categoria TEXT,
  cnh_vencimento DATE,
  aso_data DATE,
  
  -- eSocial
  esocial_categoria TEXT,
  esocial_matricula TEXT,
  esocial_natureza_atividade TEXT,
  esocial_tipo_regime_prev TEXT,
  esocial_tipo_regime_trab TEXT,
  esocial_indicativo_admissao TEXT,
  esocial_tipo_jornada TEXT,
  esocial_descricao_jornada TEXT,
  esocial_contrato_parcial BOOLEAN DEFAULT FALSE,
  esocial_teletrabalho BOOLEAN DEFAULT FALSE,
  esocial_clausula_asseguratoria BOOLEAN DEFAULT FALSE,
  esocial_sucessao_trab BOOLEAN DEFAULT FALSE,
  esocial_tipo_admissao TEXT,
  esocial_cnpj_anterior TEXT,
  esocial_matricula_anterior TEXT,
  esocial_data_admissao_origem DATE,
  
  -- Controle
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  
  CONSTRAINT employees_cpf_check CHECK (cpf ~ '^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$'),
  CONSTRAINT employees_matricula_check CHECK (matricula ~ '^[0-9]{4,}$' OR matricula IS NULL)
);

-- Tabela de Membros
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  rg TEXT,
  email TEXT,
  phone TEXT,
  celular TEXT,
  data_nascimento DATE,
  sexo TEXT CHECK (sexo IN ('M', 'F', 'O')),
  estado_civil TEXT CHECK (estado_civil IN ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO')),
  endereco TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  data_conversao DATE,
  data_batismo TEXT,
  data_membro DATE,
  situacao TEXT DEFAULT 'ATIVO' CHECK (situacao IN ('ATIVO', 'INATIVO', 'TRANSFERIDO', 'FALECIDO', 'DESLIGADO')),
  cargo_igreja TEXT,
  ministerio TEXT,
  grupo_pequeno TEXT,
  dizimista BOOLEAN DEFAULT TRUE,
  ofertante BOOLEAN DEFAULT TRUE,
  valor_dizimo DECIMAL(10,2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT members_cpf_check CHECK (cpf ~ '^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$' OR cpf IS NULL)
);

-- Tabela de Dependentes (Funcionários)
CREATE TABLE employee_dependents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE,
  relationship TEXT CHECK (relationship IN ('FILHO', 'CONJUGE', 'PAI', 'MAE', 'OUTRO')),
  cpf TEXT,
  is_student BOOLEAN DEFAULT FALSE,
  is_irrf_dependent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Dependentes (Membros)
CREATE TABLE member_dependents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE,
  relationship TEXT CHECK (relationship IN ('FILHO', 'CONJUGE', 'PAI', 'MAE', 'OUTRO')),
  cpf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- FINANCEIRO
-- ====================================================================

-- Tabela de Contas Financeiras
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CHECKING', 'SAVINGS', 'INVESTMENT', 'CASH')),
  bank_name TEXT,
  agency TEXT,
  account_number TEXT,
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'BRL',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias Financeiras
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  parent_id UUID REFERENCES categories(id),
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Transações Financeiras
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  category_id UUID REFERENCES categories(id),
  account_id UUID REFERENCES accounts(id),
  date DATE NOT NULL,
  due_date DATE,
  payment_date DATE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PAID', 'PENDING', 'OVERDUE', 'CANCELLED')),
  payment_method TEXT CHECK (payment_method IN ('CASH', 'TRANSFER', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'OTHER')),
  provider_name TEXT,
  document_number TEXT,
  notes TEXT,
  tags TEXT[],
  attachments TEXT[],
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_id UUID,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Contas a Pagar
CREATE TABLE payables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  original_amount DECIMAL(15,2),
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PAID', 'PENDING', 'OVERDUE', 'PARTIAL', 'CANCELLED')),
  category_id UUID REFERENCES categories(id),
  provider_name TEXT NOT NULL,
  provider_cnpj TEXT,
  provider_phone TEXT,
  document_type TEXT CHECK (document_type IN ('NFE', 'NFSE', 'RECIBO', 'BOLETO', 'OUTRO')),
  document_number TEXT,
  installment_number INTEGER,
  total_installments INTEGER,
  parent_id UUID REFERENCES payables(id),
  interest_rate DECIMAL(5,2),
  interest_value DECIMAL(15,2),
  penalty_rate DECIMAL(5,2),
  penalty_value DECIMAL(15,2),
  discount_rate DECIMAL(5,2),
  discount_value DECIMAL(15,2),
  paid_amount DECIMAL(15,2) DEFAULT 0.00,
  remaining_amount DECIMAL(15,2),
  payment_method TEXT CHECK (payment_method IN ('CASH', 'TRANSFER', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'OTHER')),
  notes TEXT,
  attachments TEXT[],
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT payables_due_date_check CHECK (due_date >= created_at::date)
);

-- Tabela de Contas a Receber
CREATE TABLE receivables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  original_amount DECIMAL(15,2),
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PAID', 'PENDING', 'OVERDUE', 'PARTIAL', 'CANCELLED')),
  category_id UUID REFERENCES categories(id),
  member_id UUID REFERENCES members(id),
  member_name TEXT,
  member_phone TEXT,
  document_type TEXT CHECK (document_type IN ('NFE', 'NFSE', 'RECIBO', 'BOLETO', 'OUTRO')),
  document_number TEXT,
  installment_number INTEGER,
  total_installments INTEGER,
  parent_id UUID REFERENCES receivables(id),
  interest_rate DECIMAL(5,2),
  interest_value DECIMAL(15,2),
  discount_rate DECIMAL(5,2),
  discount_value DECIMAL(15,2),
  paid_amount DECIMAL(15,2) DEFAULT 0.00,
  remaining_amount DECIMAL(15,2),
  payment_method TEXT CHECK (payment_method IN ('CASH', 'TRANSFER', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'OTHER')),
  notes TEXT,
  attachments TEXT[],
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT receivables_due_date_check CHECK (due_date >= created_at::date)
);

-- ====================================================================
-- FOLHA DE PAGAMENTO
-- ====================================================================

-- Tabela de Folha de Pagamento
CREATE TABLE payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  reference_date DATE NOT NULL,
  
  -- Proventos
  salario_base DECIMAL(15,2),
  horas_extras_50 DECIMAL(10,2),
  horas_extras_100 DECIMAL(10,2),
  adicional_noturno DECIMAL(10,2),
  insalubridade DECIMAL(10,2),
  periculosidade DECIMAL(10,2),
  comissoes DECIMAL(10,2),
  gratificacoes DECIMAL(10,2),
  auxilios DECIMAL(10,2),
  outros_proventos DECIMAL(10,2),
  
  -- Deduções
  inss DECIMAL(15,2),
  irrf DECIMAL(15,2),
  fgts DECIMAL(15,2),
  pensao_alimenticia DECIMAL(15,2),
  adiantamento DECIMAL(15,2),
  faltas DECIMAL(15,2),
  atrasos DECIMAL(15,2),
  outras_deducoes DECIMAL(15,2),
  
  -- Totais
  total_proventos DECIMAL(15,2),
  total_deducoes DECIMAL(15,2),
  salario_liquido DECIMAL(15,2),
  
  -- Encargos Patronais
  inss_patronal DECIMAL(15,2),
  fgts_patronal DECIMAL(15,2),
  rat DECIMAL(15,2),
  terceiros DECIMAL(15,2),
  total_encargos DECIMAL(15,2),
  
  status TEXT DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'PROCESSED', 'PAID', 'CANCELLED')),
  processed_by UUID REFERENCES users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  paid_by UUID REFERENCES users(id),
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT payroll_unique UNIQUE(unit_id, employee_id, month, year)
);

-- Tabela de Banco de Horas
CREATE TABLE time_bank (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
  hours TIME NOT NULL,
  minutes INTEGER,
  reason TEXT NOT NULL,
  balance_hours TIME,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT time_bank_unique UNIQUE(unit_id, employee_id, date, type)
);

-- ====================================================================
-- PATRIMÔNIO
-- ====================================================================

-- Tabela de Ativos
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('IMOVEIS', 'VEICULOS', 'EQUIPAMENTOS', 'MOBILIARIO', 'TECNOLOGIA', 'OUTROS')),
  acquisition_date DATE,
  acquisition_value DECIMAL(15,2),
  current_value DECIMAL(15,2),
  depreciation_rate DECIMAL(5,2),
  location TEXT,
  condition TEXT DEFAULT 'BOM' CHECK (condition IN ('OTIMO', 'BOM', 'REGULAR', 'RUIM')),
  asset_number TEXT UNIQUE,
  status TEXT DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO', 'MANUTENCAO', 'BAIXADO')),
  useful_life_months INTEGER,
  depreciation_method TEXT DEFAULT 'LINEAR' CHECK (depreciation_method IN ('LINEAR', 'DECLINING')),
  current_book_value DECIMAL(15,2),
  accumulated_depreciation DECIMAL(15,2) DEFAULT 0.00,
  responsible_employee_id UUID REFERENCES employees(id),
  purchase_invoice TEXT,
  serial_number TEXT,
  warranty_expiry DATE,
  maintenance_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT assets_value_check CHECK (acquisition_value > 0),
  CONSTRAINT assets_depreciation_check CHECK (depreciation_rate >= 0 AND depreciation_rate <= 100)
);

-- Tabela de Movimentação de Ativos
CREATE TABLE asset_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('TRANSFER', 'MAINTENANCE', 'DEPRECIATION', 'DISPOSAL', 'ACQUISITION')),
  date DATE NOT NULL,
  from_location TEXT,
  to_location TEXT,
  value DECIMAL(15,2),
  description TEXT,
  responsible_employee_id UUID REFERENCES employees(id),
  document_number TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- TESOURARIA
-- ====================================================================

-- Tabela de Arquivos CNAB
CREATE TABLE cnab_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  bank_code TEXT,
  file_type TEXT CHECK (file_type IN ('PAYMENT', 'RETURN', 'STATEMENT')),
  processing_status TEXT DEFAULT 'PENDING' CHECK (processing_status IN ('PENDING', 'PROCESSING', 'PROCESSED', 'ERROR')),
  total_records INTEGER,
  processed_records INTEGER,
  error_records INTEGER,
  processing_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Conciliação Bancária
CREATE TABLE bank_reconciliation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  statement_date DATE NOT NULL,
  opening_balance DECIMAL(15,2),
  closing_balance DECIMAL(15,2),
  reconciled_balance DECIMAL(15,2),
  difference DECIMAL(15,2),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RECONCILED', 'DIFFERENCE')),
  reconciled_by UUID REFERENCES users(id),
  reconciled_at TIMESTAMP WITH TIME ZONE,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Transações de Conciliação
CREATE TABLE reconciliation_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reconciliation_id UUID REFERENCES bank_reconciliation(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id),
  statement_date DATE,
  description TEXT,
  amount DECIMAL(15,2),
  type TEXT CHECK (type IN ('DEBIT', 'CREDIT')),
  is_matched BOOLEAN DEFAULT FALSE,
  match_confidence INTEGER CHECK (match_confidence BETWEEN 0 AND 100),
  match_reasons TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- RELATÓRIOS E LOGS
-- ====================================================================

-- Tabela de Relatórios Gerados
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('FINANCIAL', 'PAYROLL', 'PATRIMONY', 'MEMBERS', 'EMPLOYEES', 'TAX')),
  parameters JSONB,
  file_path TEXT,
  file_size INTEGER,
  format TEXT CHECK (format IN ('PDF', 'EXCEL', 'CSV')),
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE
);

-- Tabela de Logs do Sistema
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Backup
CREATE TABLE backups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id),
  type TEXT NOT NULL CHECK (type IN ('FULL', 'INCREMENTAL', 'DIFFERENTIAL')),
  file_path TEXT NOT NULL,
  file_size INTEGER,
  compressed BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'UPLOADING', 'COMPLETED', 'FAILED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id)
);

-- ====================================================================
-- ÍNDICES
-- ====================================================================

-- Índices para performance
CREATE INDEX idx_units_name ON units(name);
CREATE INDEX idx_units_status ON units(status);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_unit_id ON users(unit_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_employees_unit_id ON employees(unit_id);
CREATE INDEX idx_employees_cpf ON employees(cpf);
CREATE INDEX idx_employees_matricula ON employees(matricula);
CREATE INDEX idx_employees_name ON employees(employee_name);
CREATE INDEX idx_employees_active ON employees(is_active);

CREATE INDEX idx_members_unit_id ON members(unit_id);
CREATE INDEX idx_members_cpf ON members(cpf);
CREATE INDEX idx_members_name ON members(name);
CREATE INDEX idx_members_situacao ON members(situacao);

CREATE INDEX idx_transactions_unit_id ON transactions(unit_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_category ON transactions(category_id);

CREATE INDEX idx_payables_unit_id ON payables(unit_id);
CREATE INDEX idx_payables_due_date ON payables(due_date);
CREATE INDEX idx_payables_status ON payables(status);

CREATE INDEX idx_receivables_unit_id ON receivables(unit_id);
CREATE INDEX idx_receivables_due_date ON receivables(due_date);
CREATE INDEX idx_receivables_status ON receivables(status);
CREATE INDEX idx_receivables_member_id ON receivables(member_id);

CREATE INDEX idx_assets_unit_id ON assets(unit_id);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_status ON assets(status);

CREATE INDEX idx_payroll_unit_id ON payroll(unit_id);
CREATE INDEX idx_payroll_employee_id ON payroll(employee_id);
CREATE INDEX idx_payroll_period ON payroll(month, year);

CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_action ON system_logs(action);

-- ====================================================================
-- TRIGGERS
-- ====================================================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger às tabelas
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payables_updated_at BEFORE UPDATE ON payables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_receivables_updated_at BEFORE UPDATE ON receivables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para log de auditoria
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO system_logs (action, resource_type, resource_id, new_values, created_by)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW), NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO system_logs (action, resource_type, resource_id, old_values, new_values, created_by)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW), NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO system_logs (action, resource_type, resource_id, old_values)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de auditoria
CREATE TRIGGER audit_units_trigger AFTER INSERT OR UPDATE OR DELETE ON units FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_users_trigger AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_employees_trigger AFTER INSERT OR UPDATE OR DELETE ON employees FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_members_trigger AFTER INSERT OR UPDATE OR DELETE ON members FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_transactions_trigger AFTER INSERT OR UPDATE OR DELETE ON transactions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ====================================================================
-- VIEWS
-- ====================================================================

-- View de Resumo Financeiro
CREATE VIEW financial_summary AS
SELECT 
    u.id as unit_id,
    u.name as unit_name,
    COUNT(CASE WHEN t.type = 'INCOME' THEN 1 END) as income_count,
    COUNT(CASE WHEN t.type = 'EXPENSE' THEN 1 END) as expense_count,
    COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount END), 0) as total_income,
    COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount END), 0) as total_expense,
    COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount END), 0) - 
    COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount END), 0) as net_balance
FROM units u
LEFT JOIN transactions t ON u.id = t.unit_id 
    AND t.date >= date_trunc('month', CURRENT_DATE)
    AND t.date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY u.id, u.name;

-- View de Funcionários Ativos
CREATE VIEW active_employees AS
SELECT 
    e.*,
    u.name as unit_name,
    CASE 
        WHEN e.data_demissao IS NULL OR e.data_demissao > CURRENT_DATE THEN 'ATIVO'
        ELSE 'INATIVO'
    END as current_status
FROM employees e
JOIN units u ON e.unit_id = u.id
WHERE e.is_active = true;

-- View de Membros Ativos
CREATE VIEW active_members AS
SELECT 
    m.*,
    u.name as unit_name
FROM members m
JOIN units u ON m.unit_id = u.id
WHERE m.situacao = 'ATIVO';

-- ====================================================================
-- DADOS INICIAIS (INSERTS)
-- ====================================================================

-- Inserir unidade sede padrão
INSERT INTO units (id, name, cnpj, is_headquarter, status) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Igreja ADJPA Sede', '00.000.000/0001-00', true, 'ACTIVE');

-- Inserir usuário admin padrão
INSERT INTO users (id, email, password_hash, name, role, unit_id, is_active, email_verified)
VALUES (
    '00000000-0000-0000-0000-000000000002', 
    'admin@adjpa.local', 
    crypt('admin123', gen_salt('bf')), 
    'Administrador Sistema', 
    'ADMIN', 
    '00000000-0000-0000-0000-000000000001', 
    true, 
    true
);

-- Inserir categorias financeiras padrão
INSERT INTO categories (id, unit_id, name, type) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Dízimos', 'INCOME'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Ofertas', 'INCOME'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Salários', 'EXPENSE'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Aluguel', 'EXPENSE'),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Água/Luz', 'EXPENSE'),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Material de Escritório', 'EXPENSE');

-- Inserir conta bancária padrão
INSERT INTO accounts (id, unit_id, name, type, balance) 
VALUES ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Conta Principal', 'CHECKING', 0.00);

-- ====================================================================
-- COMENTÁRIOS FINAIS
-- ====================================================================

COMMENT ON DATABASE adjpa_erp IS 'ADJPA ERP - Sistema de Gestão para Igrejas';
COMMENT ON SCHEMA public IS 'Schema principal do ADJPA ERP';

-- Estatísticas do schema
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
ORDER BY tablename, attname;

-- Resumo final
SELECT 
    'Schema ADJPA ERP criado com sucesso!' as status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
    (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') as total_views,
    (SELECT COUNT(*) FROM pg_trigger WHERE tgrelid IN (SELECT oid FROM pg_class WHERE relkind = 'r')) as total_triggers,
    (SELECT COUNT(*) FROM pg_index WHERE indisunique = true) as total_indexes;employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  rg TEXT,
  birth_date DATE,
  gender TEXT,
  marital_status TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  
  -- Endereço
  address_zip TEXT,
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  
  -- Contrato
  matricula TEXT,
  cargo TEXT,
  funcao TEXT,
  departamento TEXT,
  data_admissao DATE,
  tipo_contrato TEXT,
  salario_base DECIMAL(10, 2),
  forma_pagamento TEXT,
  
  -- Jornada
  jornada_trabalho TEXT,
  escala_trabalho TEXT,
  horario_entrada TIME,
  horario_saida TIME,
  intervalo TEXT,
  descanso_semanal TEXT,
  
  -- Banco de Horas
  bh_saldo_atual TEXT,
  
  -- Bancários
  banco TEXT,
  agencia TEXT,
  conta TEXT,
  tipo_conta TEXT,
  chave_pix TEXT,
  
  -- eSocial
  esocial_matricula TEXT,
  esocial_categoria TEXT,
  
  -- Status
  status TEXT DEFAULT 'ATIVO',
  unit_id UUID REFERENCES units(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) para todas as tabelas
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público (Apenas para desenvolvimento, em produção deve-se usar autenticação)
CREATE POLICY "Permitir acesso total às unidades" ON units FOR ALL USING (true);
CREATE POLICY "Permitir acesso total aos membros" ON members FOR ALL USING (true);
CREATE POLICY "Permitir acesso total às contas" ON accounts FOR ALL USING (true);
CREATE POLICY "Permitir acesso total às transações" ON transactions FOR ALL USING (true);
CREATE POLICY "Permitir acesso total aos funcionários" ON employees FOR ALL USING (true);
