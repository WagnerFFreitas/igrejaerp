-- Schema para Igreja ERP no Supabase
-- Executa este script no SQL Editor do Supabase

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Unidades (Igrejas)
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Membros
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf TEXT,
  birth_date DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  gender TEXT,
  marital_status TEXT,
  baptism_date DATE,
  membership_date DATE,
  role TEXT,
  department TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Funcionários
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  employee_name TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  birth_date DATE,
  hire_date DATE,
  termination_date DATE,
  job_title TEXT,
  department TEXT,
  salary DECIMAL(12, 2) DEFAULT 0,
  bank TEXT,
  agency TEXT,
  account_number TEXT,
  pix_key TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  matricula TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Contas Bancárias
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  bank TEXT,
  agency TEXT,
  account_number TEXT,
  initial_balance DECIMAL(12, 2) DEFAULT 0,
  current_balance DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Transações Financeiras
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  payment_method TEXT,
  reference TEXT,
  document_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_type TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Ativos/Patrimônio
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  acquisition_date DATE,
  acquisition_value DECIMAL(12, 2) DEFAULT 0,
  current_value DECIMAL(12, 2) DEFAULT 0,
  location TEXT,
  serial_number TEXT,
  condition TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Férias/Afastamentos
CREATE TABLE IF NOT EXISTS leaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  type TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Usuários do Sistema (perfis)
CREATE TABLE IF NOT EXISTS system_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'employee', 'member')),
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Folha de Pagamento
CREATE TABLE IF NOT EXISTS payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  base_salary DECIMAL(12, 2) DEFAULT 0,
  overtime_hours DECIMAL(6, 2) DEFAULT 0,
  overtime_value DECIMAL(12, 2) DEFAULT 0,
  bonuses DECIMAL(12, 2) DEFAULT 0,
  deductions DECIMAL(12, 2) DEFAULT 0,
  inss DECIMAL(12, 2) DEFAULT 0,
  irrf DECIMAL(12, 2) DEFAULT 0,
  fgts DECIMAL(12, 2) DEFAULT 0,
  net_salary DECIMAL(12, 2) DEFAULT 0,
  payment_date DATE,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, month, year)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_members_unit_id ON members(unit_id);
CREATE INDEX IF NOT EXISTS idx_employees_unit_id ON employees(unit_id);
CREATE INDEX IF NOT EXISTS idx_transactions_unit_id ON transactions(unit_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_accounts_unit_id ON accounts(unit_id);
CREATE INDEX IF NOT EXISTS idx_assets_unit_id ON assets(unit_id);
CREATE INDEX IF NOT EXISTS idx_leaves_unit_id ON leaves(unit_id);
CREATE INDEX IF NOT EXISTS idx_events_unit_id ON events(unit_id);
CREATE INDEX IF NOT EXISTS idx_payroll_unit_id ON payroll(unit_id);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_units_updated_at ON units;
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leaves_updated_at ON leaves;
CREATE TRIGGER update_leaves_updated_at BEFORE UPDATE ON leaves FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_users_updated_at ON system_users;
CREATE TRIGGER update_system_users_updated_at BEFORE UPDATE ON system_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payroll_updated_at ON payroll;
CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
