-- Row Level Security (RLS) Policies para Igreja ERP
-- Executa este script após o 001_create_schema.sql

-- Habilitar RLS em todas as tabelas
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para obter o unit_id do usuário atual
CREATE OR REPLACE FUNCTION get_user_unit_id()
RETURNS UUID AS $$
  SELECT unit_id FROM system_users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Função para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM system_users 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Policies para Units
-- Admins podem ver todas as unidades, outros apenas sua própria
CREATE POLICY "units_select" ON units FOR SELECT
  USING (is_admin() OR id = get_user_unit_id());

CREATE POLICY "units_insert" ON units FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "units_update" ON units FOR UPDATE
  USING (is_admin());

CREATE POLICY "units_delete" ON units FOR DELETE
  USING (is_admin());

-- Policies para Members
CREATE POLICY "members_select" ON members FOR SELECT
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "members_insert" ON members FOR INSERT
  WITH CHECK (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "members_update" ON members FOR UPDATE
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "members_delete" ON members FOR DELETE
  USING (unit_id = get_user_unit_id() OR is_admin());

-- Policies para Employees
CREATE POLICY "employees_select" ON employees FOR SELECT
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "employees_insert" ON employees FOR INSERT
  WITH CHECK (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "employees_update" ON employees FOR UPDATE
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "employees_delete" ON employees FOR DELETE
  USING (unit_id = get_user_unit_id() OR is_admin());

-- Policies para Transactions
CREATE POLICY "transactions_select" ON transactions FOR SELECT
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "transactions_insert" ON transactions FOR INSERT
  WITH CHECK (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "transactions_update" ON transactions FOR UPDATE
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "transactions_delete" ON transactions FOR DELETE
  USING (unit_id = get_user_unit_id() OR is_admin());

-- Policies para Accounts
CREATE POLICY "accounts_select" ON accounts FOR SELECT
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "accounts_insert" ON accounts FOR INSERT
  WITH CHECK (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "accounts_update" ON accounts FOR UPDATE
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "accounts_delete" ON accounts FOR DELETE
  USING (unit_id = get_user_unit_id() OR is_admin());

-- Policies para Assets
CREATE POLICY "assets_select" ON assets FOR SELECT
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "assets_insert" ON assets FOR INSERT
  WITH CHECK (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "assets_update" ON assets FOR UPDATE
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "assets_delete" ON assets FOR DELETE
  USING (unit_id = get_user_unit_id() OR is_admin());

-- Policies para Leaves
CREATE POLICY "leaves_select" ON leaves FOR SELECT
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "leaves_insert" ON leaves FOR INSERT
  WITH CHECK (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "leaves_update" ON leaves FOR UPDATE
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "leaves_delete" ON leaves FOR DELETE
  USING (unit_id = get_user_unit_id() OR is_admin());

-- Policies para Events
CREATE POLICY "events_select" ON events FOR SELECT
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "events_insert" ON events FOR INSERT
  WITH CHECK (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "events_update" ON events FOR UPDATE
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "events_delete" ON events FOR DELETE
  USING (unit_id = get_user_unit_id() OR is_admin());

-- Policies para System Users
CREATE POLICY "system_users_select" ON system_users FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "system_users_insert" ON system_users FOR INSERT
  WITH CHECK (is_admin() OR id = auth.uid());

CREATE POLICY "system_users_update" ON system_users FOR UPDATE
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "system_users_delete" ON system_users FOR DELETE
  USING (is_admin());

-- Policies para Payroll
CREATE POLICY "payroll_select" ON payroll FOR SELECT
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "payroll_insert" ON payroll FOR INSERT
  WITH CHECK (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "payroll_update" ON payroll FOR UPDATE
  USING (unit_id = get_user_unit_id() OR is_admin());

CREATE POLICY "payroll_delete" ON payroll FOR DELETE
  USING (unit_id = get_user_unit_id() OR is_admin());
