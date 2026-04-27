-- MIGRAÇÃO COMPLETA: Padronização de Colunas
-- Remove prefixos eh_, is_, created_, updated_ e sufixos _em
-- IGNORAR: \naousar

BEGIN;

-- UNIDADES (units)
ALTER TABLE units RENAME COLUMN e_sede TO sede;

-- MEMBROS (membros)
ALTER TABLE membros RENAME COLUMN eh_dizimista TO dizimista;
ALTER TABLE membros RENAME COLUMN eh_ofertante_regular TO ofertante_regular;
ALTER TABLE membros RENAME COLUMN eh_pcd TO pcd;
ALTER TABLE membros RENAME COLUMN eh_recorrente TO recorrente;
ALTER TABLE membros RENAME COLUMN eh_parcelado TO parcelado;
ALTER TABLE membros RENAME COLUMN eh_evento_gerado TO evento_gerado;
ALTER TABLE membros RENAME COLUMN eh_publico TO publico;
ALTER TABLE membros RENAME COLUMN eh_estudante TO estudante;

-- APP_AUDIT_LOGS
ALTER TABLE app_audit_logs RENAME COLUMN criado_em TO criado;

-- APP_PERMISSION_MODULES
ALTER TABLE app_permission_modules RENAME COLUMN criado_em TO criado;
ALTER TABLE app_permission_modules RENAME COLUMN atualizado_em TO atualizado;

-- APP_ROLE_PERMISSIONS
ALTER TABLE app_role_permissions RENAME COLUMN criado_em TO criado;
ALTER TABLE app_role_permissions RENAME COLUMN atualizado_em TO atualizado;

-- APP_USER_PERMISSIONS
ALTER TABLE app_user_permissions RENAME COLUMN criado_em TO criado;
ALTER TABLE app_user_permissions RENAME COLUMN atualizado_em TO atualizado;

-- ACCOUNTS
ALTER TABLE accounts RENAME COLUMN criado_em TO criado;
ALTER TABLE accounts RENAME COLUMN atualizado_em TO atualizado;

-- ASSET_DEPRECIATIONS
ALTER TABLE asset_depreciations RENAME COLUMN processado_em TO processado;

-- ASSET_MAINTENANCES
ALTER TABLE asset_maintenances RENAME COLUMN criado_em TO criado;

-- ASSET_TRANSFERS
ALTER TABLE asset_transfers RENAME COLUMN criado_em TO criado;

-- BANK_RECONCILIATIONS
ALTER TABLE bank_reconciliations RENAME COLUMN criado_em TO criado;
ALTER TABLE bank_reconciliations RENAME COLUMN atualizado_em TO atualizado;

-- BANK_STATEMENT_TRANSACTIONS
ALTER TABLE bank_statement_transactions RENAME COLUMN origem TO origem_externo;

-- CATEGORIES
ALTER TABLE categories RENAME COLUMN criado_em TO criado;
ALTER TABLE categories RENAME COLUMN atualizado_em TO atualizado;

-- CHURCH_EVENTS
ALTER TABLE church_events RENAME COLUMN eh_recorrente TO recorrente;
ALTER TABLE church_events RENAME COLUMN eh_evento_gerado TO evento_gerado;

-- CASH_CLOSINGS
ALTER TABLE cash_closings RENAME COLUMN criado_em TO criado;
ALTER TABLE cash_closings RENAME COLUMN fechado_em TO fechado;

-- CASH_MOVEMENTS
ALTER TABLE cash_movements RENAME COLUMN criado_em TO criado;
ALTER TABLE cash_movements RENAME COLUMN atualizado_em TO atualizado;

-- DEPENDENTS
ALTER TABLE dependents RENAME COLUMN criado_em TO criado;

-- EMPLOYEE_DEPENDENTS
ALTER TABLE employee_dependents RENAME COLUMN eh_estudante TO estudante;

-- EMPLOYEE_LEAVES
ALTER TABLE employee_leaves RENAME COLUMN criado_em TO criado;
ALTER TABLE employee_leaves RENAME COLUMN atualizado_em TO atualizado;

-- EMPLOYEES
ALTER TABLE employees RENAME COLUMN is_active TO ativo;

-- EVENTS
ALTER TABLE eventos RENAME COLUMN eh_recorrente TO recorrente;
ALTER TABLE eventos RENAME COLUMN eh_publico TO publico;
ALTER TABLE eventos RENAME COLUMN eh_evento_gerado TO evento_gerado;
ALTER TABLE eventos RENAME COLUMN criado_em TO criado;
ALTER TABLE eventos RENAME COLUMN atualizado_em TO atualizado;

-- FINANCIAL_ACCOUNTS
ALTER TABLE financial_accounts RENAME COLUMN criado_em TO criado;
ALTER TABLE financial_accounts RENAME COLUMN atualizado_em TO atualizado;

-- INVENTORY_ADJUSTMENTS
ALTER TABLE inventory_adjustments RENAME COLUMN criado_em TO criado;
ALTER TABLE inventory_adjustments RENAME COLUMN atualizado_em TO atualizado;

-- INVENTORY_COUNTS
ALTER TABLE inventory_counts RENAME COLUMN iniciado_em TO iniciado;
ALTER TABLE inventory_counts RENAME COLUMN concluido_em TO concluido;
ALTER TABLE inventory_counts RENAME COLUMN criado_em TO criado;
ALTER TABLE inventory_counts RENAME COLUMN atualizado_em TO atualizado;

-- INVENTORY_ITEMS
ALTER TABLE inventory_items RENAME COLUMN criado_em TO criado;

-- LGPD_CONSENT_LOGS
ALTER TABLE lgpd_consent_logs RENAME COLUMN criado_em TO criado;

-- LGPD_POLICIES
ALTER TABLE lgpd_policies RENAME COLUMN criado_em TO criado;
ALTER TABLE lgpd_policies RENAME COLUMN atualizado_em TO atualizado;

-- MEMBER_CONTRIBUTIONS
ALTER TABLE member_contributions RENAME COLUMN criado_em TO criado;

-- MEMBER_DEPENDENTS
ALTER TABLE member_dependents RENAME COLUMN criado_em TO criado;
ALTER TABLE member_dependents RENAME COLUMN atualizado_em TO atualizado;

-- MEMBERS
ALTER TABLE members RENAME COLUMN eh_dizimista TO dizimista;
ALTER TABLE members RENAME COLUMN eh_ofertante_regular TO ofertante_regular;
ALTER TABLE members RENAME COLUMN eh_pcd TO pcd;

-- PAYROLL
ALTER TABLE payroll RENAME COLUMN criado_em TO criado;
ALTER TABLE payroll RENAME COLUMN atualizado_em TO atualizado;
ALTER TABLE payroll RENAME COLUMN processado_em TO processado;

-- PAYROLL_CALCULATIONS
ALTER TABLE payroll_calculations RENAME COLUMN created_at TO criado;
ALTER TABLE payroll_calculations RENAME COLUMN updated_at TO atualizado;

-- PAYROLL_PERIODS
ALTER TABLE payroll_periods RENAME COLUMN fechado_em TO fechado;
ALTER TABLE payroll_periods RENAME COLUMN processado_em TO processado;
ALTER TABLE payroll_periods RENAME COLUMN criado_em TO criado;
ALTER TABLE payroll_periods RENAME COLUMN atualizado_em TO atualizado;

-- PDI_PLANS
ALTER TABLE pdi_plans RENAME COLUMN criado_em TO criado;
ALTER TABLE pdi_plans RENAME COLUMN atualizado_em TO atualizado;

-- PERFORMANCE_EVALUATIONS
ALTER TABLE performance_evaluations RENAME COLUMN criado_em TO criado;
ALTER TABLE performance_evaluations RENAME COLUMN atualizado_em TO atualizado;

-- PERMISSION_MODULES
ALTER TABLE permission_modules RENAME COLUMN criado_em TO criado;
ALTER TABLE permission_modules RENAME COLUMN atualizado_em TO atualizado;

-- ROLE_PERMISSIONS
ALTER TABLE role_permissions RENAME COLUMN criado_em TO criado;
ALTER TABLE role_permissions RENAME COLUMN atualizado_em TO atualizado;

-- SYSTEM_LOGS
ALTER TABLE system_logs RENAME COLUMN criado_em TO criado;

-- TAX_CONFIGS
ALTER TABLE tax_configs RENAME COLUMN criado_em TO criado;
ALTER TABLE tax_configs RENAME COLUMN atualizado_em TO atualizado;

-- TRANSACTIONS
ALTER TABLE transactions RENAME COLUMN eh_parcelado TO parcelado;
ALTER TABLE transactions RENAME COLUMN criado_em TO criado;
ALTER TABLE transactions RENAME COLUMN atualizado_em TO atualizado;

-- TREASURY_ALERTS
ALTER TABLE treasury_alerts RENAME COLUMN criado_em TO criado;
ALTER TABLE treasury_alerts RENAME COLUMN atualizado_em TO atualizado;

-- TREASURY_CASH_FLOWS
ALTER TABLE treasury_cash_flows RENAME COLUMN criado_em TO criado;
ALTER TABLE treasury_cash_flows RENAME COLUMN atualizado_em TO atualizado;

-- TREASURY_FINANCIAL_POSITIONS
ALTER TABLE treasury_financial_positions RENAME COLUMN created_at TO criado;
ALTER TABLE treasury_financial_positions RENAME COLUMN updated_at TO atualizado;

-- TREASURY_FORECASTS
ALTER TABLE treasury_forecasts RENAME COLUMN created_at TO criado;
ALTER TABLE treasury_forecasts RENAME COLUMN updated_at TO atualizado;

-- TREASURY_INVESTMENTS
ALTER TABLE treasury_investments RENAME COLUMN criado_em TO criado;
ALTER TABLE treasury_investments RENAME COLUMN atualizado_em TO atualizado;

-- TREASURY_LOANS
ALTER TABLE treasury_loans RENAME COLUMN created_at TO criado;
ALTER TABLE treasury_loans RENAME COLUMN updated_at TO atualizado;

-- UNITS
ALTER TABLE units RENAME COLUMN e_sede TO sede;
ALTER TABLE units RENAME COLUMN eh_sede TO sede;
ALTER TABLE units RENAME COLUMN criado_em TO criado;
ALTER TABLE units RENAME COLUMN atualizado_em TO atualizado;

-- USER_PERMISSIONS
ALTER TABLE user_permissions RENAME COLUMN created_at TO criado;
ALTER TABLE user_permissions RENAME COLUMN updated_at TO atualizado;

-- USERS
ALTER TABLE users RENAME COLUMN criado_em TO criado;
ALTER TABLE users RENAME COLUMN atualizado_em TO atualizado;

-- VOLUNTEER_SCHEDULES
ALTER TABLE volunteer_schedules RENAME COLUMN criado_em TO criado;
ALTER TABLE volunteer_schedules RENAME COLUMN atualizado_em TO atualizado;

-- PADRONIZAÇÃO: Renomear IDs (sufixo id → prefixo id_)
ALTER TABLE transactions RENAME COLUMN conta_id TO id_conta;
ALTER TABLE transactions RENAME COLUMN unidade_id TO id_unidade;
ALTER TABLE transactions RENAME COLUMN membro_id TO id_membro;
ALTER TABLE transactions RENAME COLUMN pai_id TO id_transacao_origem;
ALTER TABLE transactions RENAME COLUMN profile_data TO dados_perfil;

ALTER TABLE members RENAME COLUMN unidade_id TO id_unidade;
ALTER TABLE members RENAME COLUMN profile_data TO dados_perfil;

ALTER TABLE employees RENAME COLUMN unidade_id TO id_unidade;
ALTER TABLE employees RENAME COLUMN profile_data TO dados_perfil;
ALTER TABLE employees RENAME COLUMN funcionario_id TO id_funcionario;

ALTER TABLE employee_leaves RENAME COLUMN funcionario_id TO id_funcionario;

ALTER TABLE employee_dependents RENAME COLUMN funcionario_id TO id_funcionario;

ALTER TABLE payroll RENAME COLUMN funcionario_id TO id_funcionario;

ALTER TABLE payroll_calculations RENAME COLUMN funcionario_id TO id_funcionario;

ALTER TABLE payroll_periods RENAME COLUMN unidade_id TO id_unidade;

ALTER TABLE performance_evaluations RENAME COLUMN funcionario_id TO id_funcionario;

ALTER TABLE dependents RENAME COLUMN membro_id TO id_membro;

ALTER TABLE member_contributions RENAME COLUMN membro_id TO id_membro;

ALTER TABLE member_dependents RENAME COLUMN membro_id TO id_membro;

ALTER TABLE financial_accounts RENAME COLUMN unidade_id TO id_unidade;

ALTER TABLE bank_reconciliations RENAME COLUMN unidade_id TO id_unidade;
ALTER TABLE bank_reconciliations RENAME COLUMN conta_id TO id_conta;

ALTER TABLE inventory_counts RENAME COLUMN unidade_id TO id_unidade;

ALTER TABLE assets RENAME COLUMN unidade_id TO id_unidade;

ALTER TABLE audit_logs RENAME COLUMN entidade_id TO id_entidade;

ALTER TABLE app_audit_logs RENAME COLUMN entidade_id TO id_entidade;

-- PADRONIZAÇÃO: Permissões (pode_* → *)
ALTER TABLE app_role_permissions RENAME COLUMN pode_ler TO ler;
ALTER TABLE app_role_permissions RENAME COLUMN pode_escrever TO escrever;
ALTER TABLE app_role_permissions RENAME COLUMN pode_excluir TO excluir;
ALTER TABLE app_role_permissions RENAME COLUMN pode_administrar TO administrador;

ALTER TABLE app_user_permissions RENAME COLUMN pode_ler TO ler;
ALTER TABLE app_user_permissions RENAME COLUMN pode_escrever TO escrever;
ALTER TABLE app_user_permissions RENAME COLUMN pode_excluir TO excluir;
ALTER TABLE app_user_permissions RENAME COLUMN pode_administrar TO administrador;

ALTER TABLE role_permissions RENAME COLUMN pode_ler TO ler;
ALTER TABLE role_permissions RENAME COLUMN pode_escrever TO escrever;
ALTER TABLE role_permissions RENAME COLUMN pode_excluir TO excluir;
ALTER TABLE role_permissions RENAME COLUMN pode_administrar TO administrador;

ALTER TABLE user_permissions RENAME COLUMN pode_ler TO ler;
ALTER TABLE user_permissions RENAME COLUMN pode_escrever TO escrever;
ALTER TABLE user_permissions RENAME COLUMN pode_excluir TO excluir;
ALTER TABLE user_permissions RENAME COLUMN pode_administrar TO administrador;

-- PADRONIZAÇÃO: Datas (data_fim → data_final)
ALTER TABLE employee_leaves RENAME COLUMN data_fim TO data_final;
ALTER TABLE payroll_periods RENAME COLUMN data_fim TO data_final;

-- PADRONIZAÇÃO: Timestamps (processado_em → processado)
ALTER TABLE payroll RENAME COLUMN processado_em TO processado;
ALTER TABLE payroll_periods RENAME COLUMN processado_em TO processado;

COMMIT;