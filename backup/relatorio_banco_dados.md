# Relatório Completo do Banco de Dados PostgreSQL

**Banco de Dados:** igrejaerp
**Host:** localhost
**Data da Geração:** 01/05/2026, 12:34:49

---

## 📊 Resumo

| Tabela | Comentário |
|--------|------------|
| **account_balances** | - |
| **accounting_configs** | - |
| **accounting_entries** | - |
| **accounts** | - |
| **app_audit_logs** | - |
| **app_permission_modules** | - |
| **app_role_permissions** | - |
| **app_user_permissions** | - |
| **asset_depreciations** | - |
| **asset_maintenances** | - |
| **asset_transfers** | - |
| **assets** | PatrimÃ´nio e bens da igreja |
| **audit_logs** | Logs de auditoria do sistema |
| **bank_reconciliations** | - |
| **bank_statement_transactions** | - |
| **cash_closings** | - |
| **cash_movements** | - |
| **categories** | - |
| **chart_of_accounts** | - |
| **church_events** | Eventos e programaÃ§Ãµes da igreja |
| **dependents** | - |
| **employee_dependents** | - |
| **employee_leaves** | - |
| **employees** | FuncionÃ¡rios e colaboradores |
| **events** | - |
| **financial_accounts** | - |
| **inventory_adjustments** | - |
| **inventory_counts** | - |
| **inventory_items** | - |
| **lgpd_consent_logs** | - |
| **lgpd_policies** | - |
| **member_contributions** | - |
| **member_dependents** | - |
| **membros** | Membros da igreja com dados completos |
| **payroll** | - |
| **payroll_calculations** | - |
| **payroll_periods** | - |
| **pdi_plans** | - |
| **performance_evaluations** | - |
| **permission_modules** | - |
| **role_permissions** | - |
| **schema_migrations** | - |
| **system_logs** | - |
| **tax_configs** | - |
| **transactions** | TransaÃ§Ãµes financeiras (receitas/despesas) |
| **treasury_alerts** | - |
| **treasury_cash_flows** | - |
| **treasury_financial_positions** | - |
| **treasury_forecasts** | - |
| **treasury_investments** | - |
| **treasury_loans** | - |
| **units** | Unidades da igreja (matriz e filiais) |
| **user_permissions** | - |
| **users** | UsuÃ¡rios do sistema com permissÃµes |
| **volunteer_schedules** | - |

---

## 📋 Detalhes das Tabelas

### Tabela: `account_balances`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_conta** | uuid | - | ❌ NÃO | - | - |
| **nome_conta** | character varying | 255 | ❌ NÃO | - | - |
| **codigo_conta** | character varying | 20 | ❌ NÃO | - | - |
| **nature** | USER-DEFINED | - | ❌ NÃO | - | - |
| **period** | character varying | 7 | ❌ NÃO | - | - |
| **saldo_inicial** | numeric | - | ✅ SIM | `0` | - |
| **debit_period** | numeric | - | ✅ SIM | `0` | - |
| **credit_period** | numeric | - | ✅ SIM | `0` | - |
| **saldo_final** | numeric | - | ✅ SIM | `0` | - |
| **quantidade_lancamentos** | integer | - | ✅ SIM | `0` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_conta** | `chart_of_accounts` | `id` | `account_balances_account_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `account_balances_account_id_period_key` | `id_conta`, `period` | ✅ SIM | ❌ NÃO |
| `account_balances_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `accounting_configs`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **ano_fiscal** | integer | - | ❌ NÃO | - | - |
| **mes_inicio** | integer | - | ❌ NÃO | - | - |
| **mes_fim** | integer | - | ❌ NÃO | - | - |
| **moeda** | character varying | 3 | ✅ SIM | `'BRL'::character varying` | - |
| **regime_tributario** | character varying | 20 | ✅ SIM | `'ISENTO'::character varying` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `accounting_configs_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `accounting_configs_pkey` | `id` | ✅ SIM | ✅ SIM |
| `accounting_configs_unit_id_fiscal_year_key` | `unit_id`, `ano_fiscal` | ✅ SIM | ❌ NÃO |

---

### Tabela: `accounting_entries`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **numero_lancamento** | integer | - | ❌ NÃO | - | - |
| **data_lancamento** | date | - | ❌ NÃO | - | - |
| **numero_documento** | character varying | 100 | ✅ SIM | - | - |
| **historico** | text | - | ❌ NÃO | - | - |
| **complement** | text | - | ✅ SIM | - | - |
| **valor_debito** | numeric | - | ❌ NÃO | - | - |
| **valor_credito** | numeric | - | ❌ NÃO | - | - |
| **conta_contrapartida** | character varying | 50 | ✅ SIM | - | - |
| **transaction_id** | uuid | - | ✅ SIM | - | - |
| **project_id** | uuid | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **criado_por** | character varying | 255 | ❌ NÃO | - | - |
| **revisado_por** | character varying | 255 | ✅ SIM | - | - |
| **status** | character varying | 20 | ✅ SIM | `'DRAFT'::character varying` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **transaction_id** | `transactions` | `id` | `accounting_entries_transaction_id_fkey` |
| **unit_id** | `units` | `id` | `accounting_entries_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `accounting_entries_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `accounts`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_unidade** | uuid | - | ✅ SIM | - | - |
| **nome_conta** | text | - | ❌ NÃO | - | - |
| **tipo_conta** | text | - | ❌ NÃO | - | - |
| **nome_banco** | text | - | ✅ SIM | - | - |
| **agency** | text | - | ✅ SIM | - | - |
| **numero_conta** | text | - | ✅ SIM | - | - |
| **saldo_atual** | numeric | - | ✅ SIM | `0.00` | - |
| **currency** | text | - | ✅ SIM | `'BRL'::text` | - |
| **esta_ativo** | boolean | - | ✅ SIM | `true` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_unidade** | `units` | `id` | `accounts_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `accounts_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `app_audit_logs`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_unidade** | uuid | - | ✅ SIM | - | - |
| **usuario_id** | uuid | - | ✅ SIM | - | - |
| **nome_usuario** | character varying | 255 | ❌ NÃO | - | - |
| **action** | character varying | 100 | ❌ NÃO | - | - |
| **entidade** | character varying | 100 | ❌ NÃO | - | - |
| **id_entidade** | character varying | 255 | ✅ SIM | - | - |
| **nome_entidade** | character varying | 255 | ✅ SIM | - | - |
| **data_evento** | timestamp with time zone | - | ❌ NÃO | `CURRENT_TIMESTAMP` | - |
| **ip** | character varying | 100 | ❌ NÃO | - | - |
| **agente_usuario** | text | - | ✅ SIM | - | - |
| **details** | jsonb | - | ✅ SIM | - | - |
| **success** | boolean | - | ❌ NÃO | `true` | - |
| **mensagem_erro** | text | - | ✅ SIM | - | - |
| **hash_anterior** | character varying | 255 | ✅ SIM | - | - |
| **hash** | character varying | 255 | ❌ NÃO | - | - |
| **imutavel** | boolean | - | ❌ NÃO | `true` | - |
| **created_at** | timestamp with time zone | - | ❌ NÃO | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `app_audit_logs_pkey` | `id` | ✅ SIM | ✅ SIM |
| `idx_app_audit_logs_action` | `action` | ❌ NÃO | ❌ NÃO |
| `idx_app_audit_logs_data_evento` | `data_evento` | ❌ NÃO | ❌ NÃO |
| `idx_app_audit_logs_event_date` | `data_evento` | ❌ NÃO | ❌ NÃO |
| `idx_app_audit_logs_id_unidade` | `id_unidade` | ❌ NÃO | ❌ NÃO |
| `idx_app_audit_logs_unit_id` | `id_unidade` | ❌ NÃO | ❌ NÃO |

---

### Tabela: `app_permission_modules`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **codigo** | character varying | 100 | ❌ NÃO | - | - |
| **name** | character varying | 255 | ❌ NÃO | - | - |
| **categoria** | character varying | 100 | ❌ NÃO | - | - |
| **description** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `app_permission_modules_code_key` | `codigo` | ✅ SIM | ❌ NÃO |
| `app_permission_modules_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `app_role_permissions`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **role** | character varying | 50 | ❌ NÃO | - | - |
| **codigo_modulo** | character varying | 100 | ❌ NÃO | - | - |
| **ler** | boolean | - | ✅ SIM | `false` | - |
| **escrever** | boolean | - | ✅ SIM | `false` | - |
| **excluir** | boolean | - | ✅ SIM | `false` | - |
| **gerenciar** | boolean | - | ✅ SIM | `false` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **administrador** | boolean | - | ✅ SIM | `false` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **codigo_modulo** | `app_permission_modules` | `codigo` | `app_role_permissions_module_code_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `app_role_permissions_pkey` | `id` | ✅ SIM | ✅ SIM |
| `app_role_permissions_role_module_code_key` | `role`, `codigo_modulo` | ✅ SIM | ❌ NÃO |

---

### Tabela: `app_user_permissions`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **usuario_id** | uuid | - | ❌ NÃO | - | - |
| **codigo_modulo** | character varying | 100 | ❌ NÃO | - | - |
| **ler** | boolean | - | ✅ SIM | - | - |
| **escrever** | boolean | - | ✅ SIM | - | - |
| **excluir** | boolean | - | ✅ SIM | - | - |
| **gerenciar** | boolean | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **administrador** | boolean | - | ✅ SIM | - | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **codigo_modulo** | `app_permission_modules` | `codigo` | `app_user_permissions_module_code_fkey` |
| **usuario_id** | `users` | `id` | `app_user_permissions_user_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `app_user_permissions_pkey` | `id` | ✅ SIM | ✅ SIM |
| `app_user_permissions_user_id_module_code_key` | `usuario_id`, `codigo_modulo` | ✅ SIM | ❌ NÃO |

---

### Tabela: `asset_depreciations`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **ativo_id** | uuid | - | ❌ NÃO | - | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **mes_referencia** | integer | - | ❌ NÃO | - | - |
| **ano_referencia** | integer | - | ❌ NÃO | - | - |
| **valor_contabil_inicial** | numeric | - | ❌ NÃO | - | - |
| **despesa_depreciacao** | numeric | - | ❌ NÃO | - | - |
| **depreciacao_acumulada** | numeric | - | ❌ NÃO | - | - |
| **valor_contabil_final** | numeric | - | ❌ NÃO | - | - |
| **conta_debito** | character varying | 50 | ✅ SIM | - | - |
| **conta_credito** | character varying | 50 | ✅ SIM | - | - |
| **numero_documento** | character varying | 100 | ✅ SIM | - | - |
| **processado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **ativo_id** | `assets` | `id` | `asset_depreciations_asset_id_fkey` |
| **unit_id** | `units` | `id` | `asset_depreciations_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `asset_depreciations_asset_id_reference_month_reference_year_key` | `ativo_id`, `mes_referencia`, `ano_referencia` | ✅ SIM | ❌ NÃO |
| `asset_depreciations_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `asset_maintenances`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **asset_id** | uuid | - | ❌ NÃO | - | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **data_manutencao** | date | - | ❌ NÃO | - | - |
| **tipo_manutencao** | character varying | 20 | ❌ NÃO | - | - |
| **descricao** | text | - | ❌ NÃO | - | - |
| **fornecedor** | character varying | 255 | ✅ SIM | - | - |
| **custo** | numeric | - | ✅ SIM | - | - |
| **numero_documento** | character varying | 100 | ✅ SIM | - | - |
| **proxima_manutencao** | date | - | ✅ SIM | - | - |
| **executado_por** | character varying | 255 | ✅ SIM | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'PROGRAMADA'::character varying` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **asset_id** | `assets` | `id` | `asset_maintenances_asset_id_fkey` |
| **unit_id** | `units` | `id` | `asset_maintenances_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `asset_maintenances_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `asset_transfers`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **ativo_id** | uuid | - | ❌ NÃO | - | - |
| **unidade_origem_id** | uuid | - | ❌ NÃO | - | - |
| **unidade_destino_id** | uuid | - | ❌ NÃO | - | - |
| **data_transferencia** | date | - | ❌ NÃO | - | - |
| **motivo** | text | - | ❌ NÃO | - | - |
| **responsavel** | character varying | 255 | ❌ NÃO | - | - |
| **autorizado_por** | character varying | 255 | ✅ SIM | - | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'PENDENTE'::character varying` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **ativo_id** | `assets` | `id` | `asset_transfers_asset_id_fkey` |
| **unidade_origem_id** | `units` | `id` | `asset_transfers_from_unit_id_fkey` |
| **unidade_destino_id** | `units` | `id` | `asset_transfers_to_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `asset_transfers_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `assets`

**Descrição:** PatrimÃ´nio e bens da igreja

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ✅ SIM | - | - |
| **nome** | text | - | ❌ NÃO | - | - |
| **descricao** | text | - | ✅ SIM | - | - |
| **categoria** | text | - | ❌ NÃO | - | - |
| **data_aquisicao** | date | - | ✅ SIM | - | - |
| **valor_aquisicao** | numeric | - | ✅ SIM | - | - |
| **valor_atual** | numeric | - | ✅ SIM | - | - |
| **taxa_depreciacao** | numeric | - | ✅ SIM | - | - |
| **localizacao** | text | - | ✅ SIM | - | - |
| **condicao** | text | - | ✅ SIM | `'BOM'::text` | - |
| **numero_ativo** | text | - | ✅ SIM | - | - |
| **situacao** | text | - | ✅ SIM | `'ATIVO'::text` | - |
| **vida_util_meses** | integer | - | ✅ SIM | - | - |
| **metodo_depreciacao** | text | - | ✅ SIM | `'LINEAR'::text` | - |
| **valor_contabil_atual** | numeric | - | ✅ SIM | - | - |
| **depreciacao_acumulada** | numeric | - | ✅ SIM | `0.00` | - |
| **funcionario_responsavel_id** | uuid | - | ✅ SIM | - | - |
| **nota_fiscal_aquisicao** | text | - | ✅ SIM | - | - |
| **numero_serie** | text | - | ✅ SIM | - | - |
| **validade_garantia** | date | - | ✅ SIM | - | - |
| **notas_manutencao** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **cep** | character varying | 10 | ✅ SIM | - | - |
| **logradouro** | text | - | ✅ SIM | - | - |
| **numero** | character varying | 20 | ✅ SIM | - | - |
| **complemento** | character varying | 100 | ✅ SIM | - | - |
| **bairro** | character varying | 100 | ✅ SIM | - | - |
| **cidade** | character varying | 100 | ✅ SIM | - | - |
| **estado** | character varying | 2 | ✅ SIM | - | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **funcionario_responsavel_id** | `employees` | `id` | `assets_responsible_employee_id_fkey` |
| **unit_id** | `units` | `id` | `assets_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `assets_asset_number_key` | `numero_ativo` | ✅ SIM | ❌ NÃO |
| `assets_pkey` | `id` | ✅ SIM | ✅ SIM |
| `idx_assets_category` | `categoria` | ❌ NÃO | ❌ NÃO |
| `idx_assets_status` | `situacao` | ❌ NÃO | ❌ NÃO |
| `idx_assets_unit_id` | `unit_id` | ❌ NÃO | ❌ NÃO |

---

### Tabela: `audit_logs`

**Descrição:** Logs de auditoria do sistema

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **usuario_id** | uuid | - | ✅ SIM | - | - |
| **nome_usuario** | character varying | 255 | ❌ NÃO | - | - |
| **acao** | character varying | 100 | ❌ NÃO | - | - |
| **entidade** | character varying | 100 | ❌ NÃO | - | - |
| **id_entidade** | uuid | - | ✅ SIM | - | - |
| **nome_entidade** | character varying | 255 | ✅ SIM | - | - |
| **data_acao** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **endereco_ip** | inet | - | ✅ SIM | - | - |
| **details** | jsonb | - | ✅ SIM | - | - |
| **success** | boolean | - | ✅ SIM | `true` | - |
| **hash** | character varying | 64 | ✅ SIM | - | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `audit_logs_unit_id_fkey` |
| **usuario_id** | `users` | `id` | `audit_logs_user_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `audit_logs_pkey` | `id` | ✅ SIM | ✅ SIM |
| `idx_audit_logs_action_date` | `data_acao` | ❌ NÃO | ❌ NÃO |
| `idx_audit_logs_entity` | `entidade` | ❌ NÃO | ❌ NÃO |
| `idx_audit_logs_unit_id` | `unit_id` | ❌ NÃO | ❌ NÃO |
| `idx_audit_logs_user_id` | `usuario_id` | ❌ NÃO | ❌ NÃO |

---

### Tabela: `bank_reconciliations`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **conta_bancaria_id** | uuid | - | ✅ SIM | - | - |
| **nome_conta_bancaria** | character varying | 255 | ✅ SIM | - | - |
| **nome_banco** | character varying | 255 | ✅ SIM | - | - |
| **data_inicio** | date | - | ❌ NÃO | - | - |
| **data_final** | date | - | ❌ NÃO | - | - |
| **saldo_inicial** | numeric | - | ✅ SIM | `0` | - |
| **saldo_final** | numeric | - | ✅ SIM | `0` | - |
| **saldo_conciliado** | numeric | - | ✅ SIM | `0` | - |
| **diferenca** | numeric | - | ✅ SIM | `0` | - |
| **status** | character varying | 20 | ✅ SIM | `'IN_PROGRESS'::character varying` | - |
| **percentual_conciliacao** | numeric | - | ✅ SIM | `0` | - |
| **total_transacoes_banco** | integer | - | ✅ SIM | `0` | - |
| **total_transacoes_sistema** | integer | - | ✅ SIM | `0` | - |
| **transacoes_conciliadas** | integer | - | ✅ SIM | `0` | - |
| **transacoes_nao_conciliadas** | integer | - | ✅ SIM | `0` | - |
| **divergencias** | jsonb | - | ✅ SIM | `'[]'::jsonb` | - |
| **conciliado_por** | character varying | 255 | ✅ SIM | - | - |
| **data_conciliacao** | timestamp with time zone | - | ✅ SIM | - | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **conta_bancaria_id** | `financial_accounts` | `id` | `bank_reconciliations_bank_account_id_fkey` |
| **unit_id** | `units` | `id` | `bank_reconciliations_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `bank_reconciliations_pkey` | `id` | ✅ SIM | ✅ SIM |
| `idx_bank_reconciliations_unit` | `unit_id` | ❌ NÃO | ❌ NÃO |

---

### Tabela: `bank_statement_transactions`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **reconciliation_id** | uuid | - | ✅ SIM | - | - |
| **bank_account_id** | uuid | - | ✅ SIM | - | - |
| **data_transacao** | date | - | ❌ NÃO | - | - |
| **descricao** | text | - | ❌ NÃO | - | - |
| **valor** | numeric | - | ❌ NÃO | - | - |
| **tipo** | character varying | 10 | ❌ NÃO | - | - |
| **metodo_pagamento** | character varying | 50 | ✅ SIM | - | - |
| **status_conciliacao** | character varying | 20 | ✅ SIM | `'PENDING'::character varying` | - |
| **transacao_id** | uuid | - | ✅ SIM | - | - |
| **origem** | character varying | 50 | ✅ SIM | `'BANK_STATEMENT'::character varying` | - |
| **id_externo** | character varying | 100 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **bank_account_id** | `financial_accounts` | `id` | `bank_statement_transactions_bank_account_id_fkey` |
| **reconciliation_id** | `bank_reconciliations` | `id` | `bank_statement_transactions_reconciliation_id_fkey` |
| **transacao_id** | `transactions` | `id` | `bank_statement_transactions_transaction_id_fkey` |
| **unit_id** | `units` | `id` | `bank_statement_transactions_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `bank_statement_transactions_pkey` | `id` | ✅ SIM | ✅ SIM |
| `idx_bank_statement_transactions_reconciliation` | `reconciliation_id` | ❌ NÃO | ❌ NÃO |
| `idx_bank_statement_transactions_unit` | `unit_id` | ❌ NÃO | ❌ NÃO |

---

### Tabela: `cash_closings`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **id_conta** | uuid | - | ❌ NÃO | - | - |
| **data_fechamento** | date | - | ❌ NÃO | - | - |
| **saldo_inicial** | numeric | - | ❌ NÃO | - | - |
| **total_entradas** | numeric | - | ❌ NÃO | - | - |
| **total_saidas** | numeric | - | ❌ NÃO | - | - |
| **saldo_esperado** | numeric | - | ❌ NÃO | - | - |
| **saldo_real** | numeric | - | ❌ NÃO | - | - |
| **diferenca** | numeric | - | ❌ NÃO | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'OPEN'::character varying` | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **fechado_por** | uuid | - | ✅ SIM | - | - |
| **fechado** | timestamp with time zone | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_conta** | `financial_accounts` | `id` | `cash_closings_account_id_fkey` |
| **fechado_por** | `users` | `id` | `cash_closings_closed_by_fkey` |
| **unit_id** | `units` | `id` | `cash_closings_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `cash_closings_pkey` | `id` | ✅ SIM | ✅ SIM |
| `cash_closings_unit_id_account_id_closing_date_key` | `unit_id`, `id_conta`, `data_fechamento` | ✅ SIM | ❌ NÃO |

---

### Tabela: `cash_movements`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **account_id** | uuid | - | ❌ NÃO | - | - |
| **tipo** | character varying | 20 | ❌ NÃO | - | - |
| **valor** | numeric | - | ❌ NÃO | - | - |
| **motivo** | text | - | ❌ NÃO | - | - |
| **numero_documento** | character varying | 100 | ✅ SIM | - | - |
| **responsavel** | uuid | - | ❌ NÃO | - | - |
| **autorizado_por** | uuid | - | ✅ SIM | - | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **account_id** | `financial_accounts` | `id` | `cash_movements_account_id_fkey` |
| **autorizado_por** | `users` | `id` | `cash_movements_authorized_by_fkey` |
| **responsavel** | `users` | `id` | `cash_movements_responsible_fkey` |
| **unit_id** | `units` | `id` | `cash_movements_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `cash_movements_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `categories`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ✅ SIM | - | - |
| **nome_categoria** | text | - | ❌ NÃO | - | - |
| **tipo_categoria** | text | - | ❌ NÃO | - | - |
| **categoria_pai_id** | uuid | - | ✅ SIM | - | - |
| **cor** | text | - | ✅ SIM | `'#6366f1'::text` | - |
| **icone** | text | - | ✅ SIM | - | - |
| **descricao** | text | - | ✅ SIM | - | - |
| **esta_ativa** | boolean | - | ✅ SIM | `true` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **categoria_pai_id** | `categories` | `id` | `categories_parent_id_fkey` |
| **unit_id** | `units` | `id` | `categories_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `categories_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `chart_of_accounts`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **codigo** | character varying | 20 | ❌ NÃO | - | - |
| **nome** | character varying | 255 | ❌ NÃO | - | - |
| **natureza** | USER-DEFINED | - | ❌ NÃO | - | - |
| **type** | USER-DEFINED | - | ❌ NÃO | - | - |
| **parent_id** | uuid | - | ✅ SIM | - | - |
| **saldo_normal** | USER-DEFINED | - | ❌ NÃO | - | - |
| **esta_ativo** | boolean | - | ✅ SIM | `true` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **parent_id** | `chart_of_accounts` | `id` | `chart_of_accounts_parent_id_fkey` |
| **unit_id** | `units` | `id` | `chart_of_accounts_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `chart_of_accounts_pkey` | `id` | ✅ SIM | ✅ SIM |
| `chart_of_accounts_unit_id_code_key` | `unit_id`, `codigo` | ✅ SIM | ❌ NÃO |

---

### Tabela: `church_events`

**Descrição:** Eventos e programaÃ§Ãµes da igreja

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **titulo** | character varying | 255 | ❌ NÃO | - | - |
| **descricao** | text | - | ✅ SIM | - | - |
| **data_evento** | date | - | ❌ NÃO | - | - |
| **hora_evento** | time without time zone | - | ❌ NÃO | - | - |
| **local_evento** | character varying | 255 | ❌ NÃO | - | - |
| **quantidade_presentes** | integer | - | ✅ SIM | `0` | - |
| **type** | USER-DEFINED | - | ❌ NÃO | - | - |
| **recorrente** | boolean | - | ✅ SIM | `false` | - |
| **padrao_recorrencia** | USER-DEFINED | - | ✅ SIM | `'NONE'::recurrence_pattern` | - |
| **data_fim_recorrencia** | date | - | ✅ SIM | - | - |
| **evento_pai_id** | uuid | - | ✅ SIM | - | - |
| **evento_gerado** | boolean | - | ✅ SIM | `false` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **evento_pai_id** | `church_events` | `id` | `church_events_parent_event_id_fkey` |
| **unit_id** | `units` | `id` | `church_events_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `church_events_pkey` | `id` | ✅ SIM | ✅ SIM |
| `idx_church_events_date` | `data_evento` | ❌ NÃO | ❌ NÃO |
| `idx_church_events_unit_id` | `unit_id` | ❌ NÃO | ❌ NÃO |

---

### Tabela: `dependents`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_membro** | uuid | - | ❌ NÃO | - | - |
| **nome** | character varying | 255 | ❌ NÃO | - | - |
| **data_nascimento** | date | - | ✅ SIM | - | - |
| **parentesco** | character varying | 20 | ❌ NÃO | - | - |
| **cpf** | character varying | 14 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_membro** | `membros` | `id` | `dependents_member_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `dependents_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `employee_dependents`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_funcionario** | uuid | - | ✅ SIM | - | - |
| **nome** | text | - | ❌ NÃO | - | - |
| **data_nascimento** | date | - | ✅ SIM | - | - |
| **parentesco** | text | - | ✅ SIM | - | - |
| **cpf** | text | - | ✅ SIM | - | - |
| **estudante** | boolean | - | ✅ SIM | `false` | - |
| **dependencia_irrf** | boolean | - | ✅ SIM | `true` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_funcionario** | `employees` | `id` | `employee_dependents_employee_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `employee_dependents_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `employee_leaves`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **id_funcionario** | uuid | - | ❌ NÃO | - | - |
| **nome_funcionario** | character varying | 255 | ❌ NÃO | - | - |
| **tipo** | character varying | 20 | ❌ NÃO | - | - |
| **data_inicio** | date | - | ❌ NÃO | - | - |
| **data_final** | date | - | ❌ NÃO | - | - |
| **cid10** | character varying | 10 | ✅ SIM | - | - |
| **nome_medico** | character varying | 255 | ✅ SIM | - | - |
| **crm** | character varying | 20 | ✅ SIM | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'SCHEDULED'::character varying` | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **url_anexo** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `employee_leaves_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `employees`

**Descrição:** FuncionÃ¡rios e colaboradores

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_unidade** | uuid | - | ✅ SIM | - | - |
| **nome** | text | - | ❌ NÃO | - | - |
| **cpf** | text | - | ❌ NÃO | - | - |
| **rg** | text | - | ✅ SIM | - | - |
| **ctps** | text | - | ✅ SIM | - | - |
| **ctps_serie** | text | - | ✅ SIM | - | - |
| **pis** | text | - | ✅ SIM | - | - |
| **birth_date** | date | - | ✅ SIM | - | - |
| **sexo** | text | - | ✅ SIM | - | - |
| **estado_civil** | text | - | ✅ SIM | - | - |
| **blood_type** | text | - | ✅ SIM | - | - |
| **email** | text | - | ✅ SIM | - | - |
| **telefone** | text | - | ✅ SIM | - | - |
| **celular** | text | - | ✅ SIM | - | - |
| **emergency_contact** | text | - | ✅ SIM | - | - |
| **naturalidade** | text | - | ✅ SIM | - | - |
| **escolaridade** | text | - | ✅ SIM | - | - |
| **raca_cor** | text | - | ✅ SIM | - | - |
| **nome_mae** | text | - | ✅ SIM | - | - |
| **nome_pai** | text | - | ✅ SIM | - | - |
| **deficiencia** | text | - | ✅ SIM | - | - |
| **deficiencia_obs** | text | - | ✅ SIM | - | - |
| **avatar** | text | - | ✅ SIM | - | - |
| **observacoes_saude** | text | - | ✅ SIM | - | - |
| **cep** | text | - | ✅ SIM | - | - |
| **logradouro** | text | - | ✅ SIM | - | - |
| **numero** | text | - | ✅ SIM | - | - |
| **complemento** | text | - | ✅ SIM | - | - |
| **bairro** | text | - | ✅ SIM | - | - |
| **cidade** | text | - | ✅ SIM | - | - |
| **estado** | text | - | ✅ SIM | - | - |
| **address_country** | text | - | ✅ SIM | - | - |
| **matricula** | text | - | ✅ SIM | - | - |
| **cargo** | text | - | ✅ SIM | - | - |
| **funcao** | text | - | ✅ SIM | - | - |
| **departamento** | text | - | ✅ SIM | - | - |
| **cbo** | text | - | ✅ SIM | - | - |
| **data_admissao** | date | - | ✅ SIM | - | - |
| **data_demissao** | date | - | ✅ SIM | - | - |
| **tipo_contrato** | text | - | ✅ SIM | - | - |
| **regime_trabalho** | text | - | ✅ SIM | - | - |
| **sindicato** | text | - | ✅ SIM | - | - |
| **convencao_coletiva** | text | - | ✅ SIM | - | - |
| **salario_base** | numeric | - | ✅ SIM | - | - |
| **tipo_salario** | text | - | ✅ SIM | - | - |
| **forma_pagamento** | text | - | ✅ SIM | - | - |
| **dia_pagamento** | text | - | ✅ SIM | - | - |
| **jornada_trabalho** | text | - | ✅ SIM | - | - |
| **escala_trabalho** | text | - | ✅ SIM | - | - |
| **horario_entrada** | time without time zone | - | ✅ SIM | - | - |
| **horario_saida** | time without time zone | - | ✅ SIM | - | - |
| **inicio_intervalo** | time without time zone | - | ✅ SIM | - | - |
| **fim_intervalo** | time without time zone | - | ✅ SIM | - | - |
| **duracao_intervalo** | time without time zone | - | ✅ SIM | - | - |
| **segunda_a_sexta** | text | - | ✅ SIM | - | - |
| **sabado** | text | - | ✅ SIM | - | - |
| **trabalha_feriados** | boolean | - | ✅ SIM | `false` | - |
| **controla_intervalo** | boolean | - | ✅ SIM | `false` | - |
| **horas_extras_autorizadas** | boolean | - | ✅ SIM | `false` | - |
| **tipo_registro_ponto** | text | - | ✅ SIM | - | - |
| **tolerancia_ponto** | text | - | ✅ SIM | - | - |
| **codigo_horario** | text | - | ✅ SIM | - | - |
| **banco** | text | - | ✅ SIM | - | - |
| **codigo_banco** | text | - | ✅ SIM | - | - |
| **agencia** | text | - | ✅ SIM | - | - |
| **conta** | text | - | ✅ SIM | - | - |
| **tipo_conta** | text | - | ✅ SIM | - | - |
| **titular** | text | - | ✅ SIM | - | - |
| **chave_pix** | text | - | ✅ SIM | - | - |
| **vt_ativo** | boolean | - | ✅ SIM | `false` | - |
| **vt_valor_diario** | numeric | - | ✅ SIM | - | - |
| **vt_qtd_vales_dia** | integer | - | ✅ SIM | - | - |
| **vale_transporte_total** | numeric | - | ✅ SIM | - | - |
| **va_ativo** | boolean | - | ✅ SIM | `false` | - |
| **va_operadora** | text | - | ✅ SIM | - | - |
| **vale_alimentacao** | numeric | - | ✅ SIM | - | - |
| **vr_ativo** | boolean | - | ✅ SIM | `false` | - |
| **vr_operadora** | text | - | ✅ SIM | - | - |
| **vale_refeicao** | numeric | - | ✅ SIM | - | - |
| **ps_ativo** | boolean | - | ✅ SIM | `false` | - |
| **ps_operadora** | text | - | ✅ SIM | - | - |
| **ps_tipo_plano** | text | - | ✅ SIM | - | - |
| **ps_carteirinha** | text | - | ✅ SIM | - | - |
| **plano_saude_colaborador** | numeric | - | ✅ SIM | - | - |
| **ps_dependentes_ativo** | boolean | - | ✅ SIM | `false` | - |
| **plano_saude_dependentes** | numeric | - | ✅ SIM | - | - |
| **po_ativo** | boolean | - | ✅ SIM | `false` | - |
| **po_operadora** | text | - | ✅ SIM | - | - |
| **po_carteirinha** | text | - | ✅ SIM | - | - |
| **plano_odontologico** | numeric | - | ✅ SIM | - | - |
| **auxilio_moradia** | numeric | - | ✅ SIM | - | - |
| **vale_farmacia** | numeric | - | ✅ SIM | - | - |
| **seguro_vida** | numeric | - | ✅ SIM | - | - |
| **auxilio_creche** | numeric | - | ✅ SIM | - | - |
| **auxilio_educacao** | numeric | - | ✅ SIM | - | - |
| **gympass_plano** | text | - | ✅ SIM | - | - |
| **titulo_eleitor** | text | - | ✅ SIM | - | - |
| **titulo_eleitor_zona** | text | - | ✅ SIM | - | - |
| **titulo_eleitor_secao** | text | - | ✅ SIM | - | - |
| **reservista** | text | - | ✅ SIM | - | - |
| **cnh_numero** | text | - | ✅ SIM | - | - |
| **cnh_categoria** | text | - | ✅ SIM | - | - |
| **cnh_vencimento** | date | - | ✅ SIM | - | - |
| **aso_data** | date | - | ✅ SIM | - | - |
| **esocial_categoria** | text | - | ✅ SIM | - | - |
| **esocial_matricula** | text | - | ✅ SIM | - | - |
| **esocial_natureza_atividade** | text | - | ✅ SIM | - | - |
| **esocial_tipo_regime_prev** | text | - | ✅ SIM | - | - |
| **esocial_tipo_regime_trab** | text | - | ✅ SIM | - | - |
| **esocial_indicativo_admissao** | text | - | ✅ SIM | - | - |
| **esocial_tipo_jornada** | text | - | ✅ SIM | - | - |
| **esocial_descricao_jornada** | text | - | ✅ SIM | - | - |
| **esocial_contrato_parcial** | boolean | - | ✅ SIM | `false` | - |
| **esocial_teletrabalho** | boolean | - | ✅ SIM | `false` | - |
| **esocial_clausula_asseguratoria** | boolean | - | ✅ SIM | `false` | - |
| **esocial_sucessao_trab** | boolean | - | ✅ SIM | `false` | - |
| **esocial_tipo_admissao** | text | - | ✅ SIM | - | - |
| **esocial_cnpj_anterior** | text | - | ✅ SIM | - | - |
| **esocial_matricula_anterior** | text | - | ✅ SIM | - | - |
| **esocial_data_admissao_origem** | date | - | ✅ SIM | - | - |
| **ativo** | boolean | - | ✅ SIM | `true` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **created_by** | uuid | - | ✅ SIM | - | - |
| **dados_perfil** | jsonb | - | ✅ SIM | `'{}'::jsonb` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_unidade** | `units` | `id` | `employees_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `employees_cpf_key` | `cpf` | ✅ SIM | ❌ NÃO |
| `employees_matricula_key` | `matricula` | ✅ SIM | ❌ NÃO |
| `employees_pkey` | `id` | ✅ SIM | ✅ SIM |
| `idx_employees_active` | `ativo` | ❌ NÃO | ❌ NÃO |
| `idx_employees_cpf` | `cpf` | ❌ NÃO | ❌ NÃO |
| `idx_employees_matricula` | `matricula` | ❌ NÃO | ❌ NÃO |
| `idx_employees_name` | `nome` | ❌ NÃO | ❌ NÃO |
| `idx_employees_unit_id` | `id_unidade` | ❌ NÃO | ❌ NÃO |

---

### Tabela: `events`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `gen_random_uuid()` | - |
| **unit_id** | uuid | - | ✅ SIM | - | - |
| **titulo** | text | - | ❌ NÃO | - | - |
| **descricao** | text | - | ✅ SIM | - | - |
| **data_evento** | date | - | ❌ NÃO | - | - |
| **hora_evento** | text | - | ✅ SIM | - | - |
| **data_final** | date | - | ✅ SIM | - | - |
| **hora_fim** | text | - | ✅ SIM | - | - |
| **local_evento** | text | - | ✅ SIM | - | - |
| **tipo_evento** | text | - | ✅ SIM | `'SERVICE'::text` | - |
| **situacao** | text | - | ✅ SIM | `'SCHEDULED'::text` | - |
| **maximo_presentes** | integer | - | ✅ SIM | - | - |
| **quantidade_presentes** | integer | - | ✅ SIM | `0` | - |
| **publico** | boolean | - | ✅ SIM | `true` | - |
| **criado_por** | uuid | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **criado_por** | `users` | `id` | `events_created_by_fkey` |
| **unit_id** | `units` | `id` | `events_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `events_pkey` | `id` | ✅ SIM | ✅ SIM |
| `idx_events_date` | `data_evento` | ❌ NÃO | ❌ NÃO |
| `idx_events_unit_id` | `unit_id` | ❌ NÃO | ❌ NÃO |

---

### Tabela: `financial_accounts`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **nome** | character varying | 255 | ❌ NÃO | - | - |
| **tipo** | USER-DEFINED | - | ❌ NÃO | - | - |
| **saldo_atual** | numeric | - | ✅ SIM | `0` | - |
| **saldo_minimo** | numeric | - | ✅ SIM | - | - |
| **situacao** | USER-DEFINED | - | ✅ SIM | `'ACTIVE'::account_status_type` | - |
| **codigo_banco** | character varying | 10 | ✅ SIM | - | - |
| **numero_agencia** | character varying | 20 | ✅ SIM | - | - |
| **numero_conta** | character varying | 50 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `financial_accounts_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `financial_accounts_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `inventory_adjustments`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **contagem_estoque_id** | uuid | - | ❌ NÃO | - | - |
| **asset_id** | uuid | - | ❌ NÃO | - | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **tipo_ajuste** | character varying | 20 | ❌ NÃO | - | - |
| **quantidade** | integer | - | ❌ NÃO | - | - |
| **motivo** | text | - | ❌ NÃO | - | - |
| **justificativa** | text | - | ❌ NÃO | - | - |
| **aprovado_por** | character varying | 255 | ✅ SIM | - | - |
| **lancamento_contabil** | boolean | - | ✅ SIM | `false` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **asset_id** | `assets` | `id` | `inventory_adjustments_asset_id_fkey` |
| **contagem_estoque_id** | `inventory_counts` | `id` | `inventory_adjustments_inventory_count_id_fkey` |
| **unit_id** | `units` | `id` | `inventory_adjustments_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `inventory_adjustments_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `inventory_counts`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **data_contagem** | date | - | ❌ NÃO | - | - |
| **contagem_por** | character varying | 255 | ❌ NÃO | - | - |
| **revisado_por** | character varying | 255 | ✅ SIM | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'EM_ANDAMENTO'::character varying` | - |
| **total_ativos** | integer | - | ✅ SIM | `0` | - |
| **total_esperado** | integer | - | ✅ SIM | `0` | - |
| **total_encontrado** | integer | - | ✅ SIM | `0` | - |
| **diferenca_total** | integer | - | ✅ SIM | `0` | - |
| **percentual_conclusao** | numeric | - | ✅ SIM | `0` | - |
| **iniciado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **concluido** | timestamp with time zone | - | ✅ SIM | - | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `inventory_counts_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `inventory_counts_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `inventory_items`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **contagem_estoque_id** | uuid | - | ❌ NÃO | - | - |
| **ativo_id** | uuid | - | ❌ NÃO | - | - |
| **nome_ativo** | character varying | 255 | ❌ NÃO | - | - |
| **categoria** | USER-DEFINED | - | ❌ NÃO | - | - |
| **quantidade_esperada** | integer | - | ❌ NÃO | - | - |
| **quantidade_contada** | integer | - | ❌ NÃO | - | - |
| **diferenca** | integer | - | ❌ NÃO | - | - |
| **condicao** | character varying | 20 | ❌ NÃO | - | - |
| **location** | character varying | 255 | ✅ SIM | - | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **ativo_id** | `assets` | `id` | `inventory_items_asset_id_fkey` |
| **contagem_estoque_id** | `inventory_counts` | `id` | `inventory_items_inventory_count_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `inventory_items_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `lgpd_consent_logs`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_membro** | uuid | - | ✅ SIM | - | - |
| **id_funcionario** | uuid | - | ✅ SIM | - | - |
| **politica_id** | uuid | - | ❌ NÃO | - | - |
| **tipo_consentimento** | character varying | 50 | ❌ NÃO | - | - |
| **granted** | boolean | - | ❌ NÃO | - | - |
| **endereco_ip** | inet | - | ✅ SIM | - | - |
| **agente_usuario** | text | - | ✅ SIM | - | - |
| **data_consentimento** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_funcionario** | `employees` | `id` | `lgpd_consent_logs_employee_id_fkey` |
| **id_membro** | `membros` | `id` | `lgpd_consent_logs_member_id_fkey` |
| **politica_id** | `lgpd_policies` | `id` | `lgpd_consent_logs_policy_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_lgpd_consent_employee` | `id_funcionario` | ❌ NÃO | ❌ NÃO |
| `idx_lgpd_consent_member` | `id_membro` | ❌ NÃO | ❌ NÃO |
| `lgpd_consent_logs_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `lgpd_policies`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **versao** | character varying | 20 | ❌ NÃO | - | - |
| **titulo** | character varying | 255 | ❌ NÃO | - | - |
| **conteudo** | text | - | ❌ NÃO | - | - |
| **esta_ativa** | boolean | - | ✅ SIM | `true` | - |
| **obrigatorio** | boolean | - | ✅ SIM | `true` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `lgpd_policies_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_lgpd_policies_unit_active` | `unit_id`, `esta_ativa` | ❌ NÃO | ❌ NÃO |
| `lgpd_policies_pkey` | `id` | ✅ SIM | ✅ SIM |
| `lgpd_policies_unit_id_version_key` | `unit_id`, `versao` | ✅ SIM | ❌ NÃO |

---

### Tabela: `member_contributions`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_membro** | uuid | - | ❌ NÃO | - | - |
| **valor** | numeric | - | ❌ NÃO | - | - |
| **data_contribuicao** | date | - | ❌ NÃO | - | - |
| **tipo** | character varying | 20 | ❌ NÃO | - | - |
| **descricao** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_membro** | `membros` | `id` | `member_contributions_member_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `member_contributions_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `member_dependents`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_membro** | uuid | - | ✅ SIM | - | - |
| **nome** | text | - | ❌ NÃO | - | - |
| **data_nascimento** | date | - | ✅ SIM | - | - |
| **parentesco** | text | - | ✅ SIM | - | - |
| **cpf** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_membro** | `membros` | `id` | `member_dependents_member_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `member_dependents_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `membros`

**Descrição:** Membros da igreja com dados completos

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_unidade** | uuid | - | ✅ SIM | - | - |
| **nome** | text | - | ❌ NÃO | - | - |
| **cpf** | text | - | ✅ SIM | - | - |
| **rg** | text | - | ✅ SIM | - | - |
| **email** | text | - | ✅ SIM | - | - |
| **telefone** | text | - | ✅ SIM | - | - |
| **whatsapp** | text | - | ✅ SIM | - | - |
| **data_nascimento** | date | - | ✅ SIM | - | - |
| **sexo** | text | - | ✅ SIM | - | - |
| **estado_civil** | text | - | ✅ SIM | - | - |
| **logradouro** | text | - | ✅ SIM | - | - |
| **bairro** | text | - | ✅ SIM | - | - |
| **cidade** | text | - | ✅ SIM | - | - |
| **estado** | text | - | ✅ SIM | - | - |
| **cep** | text | - | ✅ SIM | - | - |
| **data_conversao** | date | - | ✅ SIM | - | - |
| **data_batismo** | text | - | ✅ SIM | - | - |
| **data_membro** | date | - | ✅ SIM | - | - |
| **status** | text | - | ✅ SIM | `'ATIVO'::text` | - |
| **funcao** | text | - | ✅ SIM | - | - |
| **ministerio** | text | - | ✅ SIM | - | - |
| **grupo_pequeno** | text | - | ✅ SIM | - | - |
| **dizimista** | boolean | - | ✅ SIM | `true` | - |
| **ofertante** | boolean | - | ✅ SIM | `true` | - |
| **valor_dizimo** | numeric | - | ✅ SIM | - | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **dados_perfil** | jsonb | - | ✅ SIM | `'{}'::jsonb` | - |
| **matricula** | character varying | 50 | ✅ SIM | - | - |
| **profissao** | character varying | 100 | ✅ SIM | - | - |
| **nome_conjuge** | character varying | 255 | ✅ SIM | - | - |
| **data_casamento** | date | - | ✅ SIM | - | - |
| **nome_pai** | character varying | 255 | ✅ SIM | - | - |
| **nome_mae** | character varying | 255 | ✅ SIM | - | - |
| **tipo_sanguineo** | character varying | 10 | ✅ SIM | - | - |
| **contato_emergencia** | character varying | 100 | ✅ SIM | - | - |
| **numero** | character varying | 20 | ✅ SIM | - | - |
| **complemento** | character varying | 100 | ✅ SIM | - | - |
| **local_conversao** | character varying | 255 | ✅ SIM | - | - |
| **igreja_batismo** | character varying | 255 | ✅ SIM | - | - |
| **pastor_batizador** | character varying | 255 | ✅ SIM | - | - |
| **batismo_espirito_santo** | boolean | - | ✅ SIM | `false` | - |
| **igreja_origem** | character varying | 255 | ✅ SIM | - | - |
| **curso_discipulado** | character varying | 20 | ✅ SIM | `'NAO_INICIADO'::character varying` | - |
| **escola_biblica** | character varying | 20 | ✅ SIM | `'INATIVO'::character varying` | - |
| **ministerio_principal** | character varying | 100 | ✅ SIM | - | - |
| **funcao_ministerio** | character varying | 100 | ✅ SIM | - | - |
| **outros_ministerios** | ARRAY | - | ✅ SIM | - | - |
| **cargo_eclesiastico** | character varying | 100 | ✅ SIM | - | - |
| **data_consagracao** | date | - | ✅ SIM | - | - |
| **ofertante_regular** | boolean | - | ✅ SIM | `false` | - |
| **participa_campanhas** | boolean | - | ✅ SIM | `false` | - |
| **banco** | character varying | 100 | ✅ SIM | - | - |
| **agencia_bancaria** | character varying | 20 | ✅ SIM | - | - |
| **conta_bancaria** | character varying | 50 | ✅ SIM | - | - |
| **chave_pix** | character varying | 100 | ✅ SIM | - | - |
| **necessidades_especiais** | text | - | ✅ SIM | - | - |
| **talentos** | text | - | ✅ SIM | - | - |
| **tags** | ARRAY | - | ✅ SIM | - | - |
| **familia_id** | uuid | - | ✅ SIM | - | - |
| **avatar** | text | - | ✅ SIM | - | - |
| **cell_group** | character varying | 100 | ✅ SIM | - | - |
| **dons_espirituais** | character varying | 255 | ✅ SIM | - | - |
| **escolaridade** | character varying | 100 | ✅ SIM | - | - |
| **is_pcd** | boolean | - | ✅ SIM | `false` | - |
| **tipo_deficiencia** | character varying | 100 | ✅ SIM | - | - |
| **celular** | character varying | 20 | ✅ SIM | - | - |
| **lgpd_consent** | jsonb | - | ✅ SIM | `'{}'::jsonb` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_unidade** | `units` | `id` | `members_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_members_cpf` | `cpf` | ❌ NÃO | ❌ NÃO |
| `idx_members_name` | `nome` | ❌ NÃO | ❌ NÃO |
| `idx_members_situacao` | `status` | ❌ NÃO | ❌ NÃO |
| `idx_members_unit_id` | `id_unidade` | ❌ NÃO | ❌ NÃO |
| `members_cpf_key` | `cpf` | ✅ SIM | ❌ NÃO |
| `members_matricula_key` | `matricula` | ✅ SIM | ❌ NÃO |
| `members_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `payroll`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `gen_random_uuid()` | - |
| **unit_id** | uuid | - | ✅ SIM | - | - |
| **id_funcionario** | uuid | - | ✅ SIM | - | - |
| **month** | integer | - | ❌ NÃO | - | - |
| **year** | integer | - | ❌ NÃO | - | - |
| **data_referencia** | date | - | ❌ NÃO | - | - |
| **salario_base** | numeric | - | ✅ SIM | `0` | - |
| **horas_extras_50** | numeric | - | ✅ SIM | `0` | - |
| **horas_extras_100** | numeric | - | ✅ SIM | `0` | - |
| **adicional_noturno** | numeric | - | ✅ SIM | `0` | - |
| **insalubridade** | numeric | - | ✅ SIM | `0` | - |
| **periculosidade** | numeric | - | ✅ SIM | `0` | - |
| **comissoes** | numeric | - | ✅ SIM | `0` | - |
| **gratificacoes** | numeric | - | ✅ SIM | `0` | - |
| **outros_proventos** | numeric | - | ✅ SIM | `0` | - |
| **inss** | numeric | - | ✅ SIM | `0` | - |
| **irrf** | numeric | - | ✅ SIM | `0` | - |
| **fgts** | numeric | - | ✅ SIM | `0` | - |
| **pensao_alimenticia** | numeric | - | ✅ SIM | `0` | - |
| **adiantamento** | numeric | - | ✅ SIM | `0` | - |
| **faltas** | numeric | - | ✅ SIM | `0` | - |
| **atrasos** | numeric | - | ✅ SIM | `0` | - |
| **outras_deducoes** | numeric | - | ✅ SIM | `0` | - |
| **total_proventos** | numeric | - | ✅ SIM | `0` | - |
| **total_deducoes** | numeric | - | ✅ SIM | `0` | - |
| **salario_liquido** | numeric | - | ✅ SIM | `0` | - |
| **inss_patronal** | numeric | - | ✅ SIM | `0` | - |
| **fgts_patronal** | numeric | - | ✅ SIM | `0` | - |
| **rat** | numeric | - | ✅ SIM | `0` | - |
| **terceiros** | numeric | - | ✅ SIM | `0` | - |
| **total_encargos** | numeric | - | ✅ SIM | `0` | - |
| **status** | text | - | ✅ SIM | `'PROCESSED'::text` | - |
| **processado_por** | uuid | - | ✅ SIM | - | - |
| **processado** | timestamp with time zone | - | ✅ SIM | - | - |
| **notes** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_funcionario** | `employees` | `id` | `payroll_employee_id_fkey` |
| **processado_por** | `users` | `id` | `payroll_processed_by_fkey` |
| **unit_id** | `units` | `id` | `payroll_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_payroll_period` | `month`, `year` | ❌ NÃO | ❌ NÃO |
| `idx_payroll_unit_id` | `unit_id` | ❌ NÃO | ❌ NÃO |
| `payroll_pkey` | `id` | ✅ SIM | ✅ SIM |
| `payroll_unique` | `unit_id`, `id_funcionario`, `month`, `year` | ✅ SIM | ❌ NÃO |

---

### Tabela: `payroll_calculations`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_funcionario** | uuid | - | ❌ NÃO | - | - |
| **mes_competencia** | character varying | 7 | ❌ NÃO | - | - |
| **salario_bruto** | numeric | - | ❌ NÃO | - | - |
| **salario_base** | numeric | - | ❌ NÃO | - | - |
| **horas_extras** | numeric | - | ✅ SIM | `0` | - |
| **adicional_noturno** | numeric | - | ✅ SIM | `0` | - |
| **insalubridade** | numeric | - | ✅ SIM | `0` | - |
| **comissao** | numeric | - | ✅ SIM | `0` | - |
| **bonificacoes** | numeric | - | ✅ SIM | `0` | - |
| **salario_familia** | numeric | - | ✅ SIM | `0` | - |
| **outros_proventos** | numeric | - | ✅ SIM | `0` | - |
| **inss** | numeric | - | ❌ NÃO | - | - |
| **irrf** | numeric | - | ❌ NÃO | - | - |
| **fgts** | numeric | - | ❌ NÃO | - | - |
| **union** | numeric | - | ✅ SIM | `0` | - |
| **plano_saude** | numeric | - | ✅ SIM | `0` | - |
| **plano_odontologico** | numeric | - | ✅ SIM | `0` | - |
| **vale_alimentacao** | numeric | - | ✅ SIM | `0` | - |
| **vale_refeicao** | numeric | - | ✅ SIM | `0` | - |
| **transporte** | numeric | - | ✅ SIM | `0` | - |
| **pharmacy** | numeric | - | ✅ SIM | `0` | - |
| **life_insurance** | numeric | - | ✅ SIM | `0` | - |
| **adiantamento** | numeric | - | ✅ SIM | `0` | - |
| **consignado** | numeric | - | ✅ SIM | `0` | - |
| **coparticipacao** | numeric | - | ✅ SIM | `0` | - |
| **faltas** | numeric | - | ✅ SIM | `0` | - |
| **atrasos** | numeric | - | ✅ SIM | `0` | - |
| **pensao_alimenticia** | numeric | - | ✅ SIM | `0` | - |
| **outras_deducoes** | numeric | - | ✅ SIM | `0` | - |
| **total_proventos** | numeric | - | ❌ NÃO | - | - |
| **total_descontos** | numeric | - | ❌ NÃO | - | - |
| **salario_liquido** | numeric | - | ❌ NÃO | - | - |
| **custo_empregador** | numeric | - | ❌ NÃO | - | - |
| **base_inss** | numeric | - | ❌ NÃO | - | - |
| **aliquota_inss** | numeric | - | ❌ NÃO | - | - |
| **valor_inss** | numeric | - | ❌ NÃO | - | - |
| **base_irrf** | numeric | - | ❌ NÃO | - | - |
| **aliquota_irrf** | numeric | - | ❌ NÃO | - | - |
| **deducao_irrf** | numeric | - | ❌ NÃO | - | - |
| **valor_irrf** | numeric | - | ❌ NÃO | - | - |
| **base_fgts** | numeric | - | ❌ NÃO | - | - |
| **aliquota_fgts** | numeric | - | ❌ NÃO | - | - |
| **valor_fgts** | numeric | - | ❌ NÃO | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_funcionario** | `employees` | `id` | `payroll_calculations_employee_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_payroll_calculations_competency` | `mes_competencia` | ❌ NÃO | ❌ NÃO |
| `idx_payroll_calculations_employee_id` | `id_funcionario` | ❌ NÃO | ❌ NÃO |
| `payroll_calculations_employee_id_competency_month_key` | `id_funcionario`, `mes_competencia` | ✅ SIM | ❌ NÃO |
| `payroll_calculations_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `payroll_periods`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_unidade** | uuid | - | ❌ NÃO | - | - |
| **mes** | integer | - | ❌ NÃO | - | - |
| **ano** | integer | - | ❌ NÃO | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'OPEN'::character varying` | - |
| **data_inicio** | date | - | ❌ NÃO | - | - |
| **data_final** | date | - | ❌ NÃO | - | - |
| **processado** | timestamp with time zone | - | ✅ SIM | - | - |
| **fechado** | timestamp with time zone | - | ✅ SIM | - | - |
| **total_funcionarios** | integer | - | ✅ SIM | `0` | - |
| **total_folha** | numeric | - | ✅ SIM | `0` | - |
| **total_inss** | numeric | - | ✅ SIM | `0` | - |
| **total_fgts** | numeric | - | ✅ SIM | `0` | - |
| **total_irrf** | numeric | - | ✅ SIM | `0` | - |
| **criado_por** | uuid | - | ❌ NÃO | - | - |
| **observacoes** | text | - | ✅ SIM | - | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **criado_por** | `users` | `id` | `payroll_periods_created_by_fkey` |
| **id_unidade** | `units` | `id` | `payroll_periods_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `payroll_periods_pkey` | `id` | ✅ SIM | ✅ SIM |
| `payroll_periods_unit_id_month_year_key` | `id_unidade`, `mes`, `ano` | ✅ SIM | ❌ NÃO |

---

### Tabela: `pdi_plans`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **id_funcionario** | uuid | - | ❌ NÃO | - | - |
| **nome_funcionario** | character varying | 255 | ❌ NÃO | - | - |
| **meta** | text | - | ❌ NÃO | - | - |
| **prazo** | date | - | ✅ SIM | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'PENDENTE'::character varying` | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **created_by** | character varying | 255 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_funcionario** | `employees` | `id` | `pdi_plans_employee_id_fkey` |
| **unit_id** | `units` | `id` | `pdi_plans_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_pdi_plans_employee` | `id_funcionario` | ❌ NÃO | ❌ NÃO |
| `idx_pdi_plans_unit` | `unit_id` | ❌ NÃO | ❌ NÃO |
| `pdi_plans_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `performance_evaluations`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **id_funcionario** | uuid | - | ❌ NÃO | - | - |
| **nome_funcionario** | character varying | 255 | ❌ NÃO | - | - |
| **data_avaliacao** | date | - | ❌ NÃO | - | - |
| **tipo_avaliacao** | character varying | 50 | ❌ NÃO | `'ANNUAL'::character varying` | - |
| **nota_geral** | numeric | - | ✅ SIM | `0` | - |
| **conceito_geral** | character varying | 30 | ✅ SIM | `'SATISFACTORY'::character varying` | - |
| **competencias** | jsonb | - | ✅ SIM | `'[]'::jsonb` | - |
| **metas** | jsonb | - | ✅ SIM | `'[]'::jsonb` | - |
| **pontos_fortes** | text | - | ✅ SIM | - | - |
| **melhorias** | text | - | ✅ SIM | - | - |
| **plano_acao** | text | - | ✅ SIM | - | - |
| **status** | character varying | 20 | ✅ SIM | `'DRAFT'::character varying` | - |
| **avaliado_por** | character varying | 255 | ✅ SIM | - | - |
| **aprovado_por** | character varying | 255 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_funcionario** | `employees` | `id` | `performance_evaluations_employee_id_fkey` |
| **unit_id** | `units` | `id` | `performance_evaluations_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_performance_evaluations_employee` | `id_funcionario` | ❌ NÃO | ❌ NÃO |
| `idx_performance_evaluations_unit` | `unit_id` | ❌ NÃO | ❌ NÃO |
| `performance_evaluations_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `permission_modules`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **codigo** | character varying | 100 | ❌ NÃO | - | - |
| **nome_modulo** | character varying | 255 | ❌ NÃO | - | - |
| **categoria** | character varying | 100 | ❌ NÃO | - | - |
| **descricao** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `permission_modules_code_key` | `codigo` | ✅ SIM | ❌ NÃO |
| `permission_modules_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `role_permissions`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `gen_random_uuid()` | - |
| **funcao** | text | - | ❌ NÃO | - | - |
| **recurso** | text | - | ❌ NÃO | - | - |
| **ler** | boolean | - | ✅ SIM | `false` | - |
| **escrever** | boolean | - | ✅ SIM | `false` | - |
| **excluir** | boolean | - | ✅ SIM | `false` | - |
| **administrador** | boolean | - | ✅ SIM | `false` | - |
| **codigo_modulo** | character varying | 100 | ✅ SIM | - | - |
| **gerenciar** | boolean | - | ✅ SIM | `false` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `role_permissions_pkey` | `id` | ✅ SIM | ✅ SIM |
| `role_permissions_role_module_code_idx` | `funcao`, `codigo_modulo` | ✅ SIM | ❌ NÃO |
| `role_permissions_role_resource_key` | `funcao`, `recurso` | ✅ SIM | ❌ NÃO |

---

### Tabela: `schema_migrations`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **version** | character varying | 255 | ❌ NÃO | - | - |
| **applied_at** | timestamp with time zone | - | ❌ NÃO | `now()` | - |

#### Chave Primária

| Coluna |
|--------|
| **version** |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `schema_migrations_pkey` | `version` | ✅ SIM | ✅ SIM |

---

### Tabela: `system_logs`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `gen_random_uuid()` | - |
| **id_unidade** | uuid | - | ✅ SIM | - | - |
| **usuario_id** | uuid | - | ✅ SIM | - | - |
| **acao** | text | - | ❌ NÃO | - | - |
| **tipo_recurso** | text | - | ✅ SIM | - | - |
| **id_recurso** | uuid | - | ✅ SIM | - | - |
| **valores_anteriores** | jsonb | - | ✅ SIM | - | - |
| **valores_novos** | jsonb | - | ✅ SIM | - | - |
| **endereco_ip** | text | - | ✅ SIM | - | - |
| **agente_usuario** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_unidade** | `units` | `id` | `system_logs_unit_id_fkey` |
| **usuario_id** | `users` | `id` | `system_logs_user_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_system_logs_created_at` | `criado` | ❌ NÃO | ❌ NÃO |
| `system_logs_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `tax_configs`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **faixa_inss** | jsonb | - | ❌ NÃO | - | - |
| **faixa_irrf** | jsonb | - | ❌ NÃO | - | - |
| **taxa_fgts** | numeric | - | ❌ NÃO | `8.0` | - |
| **taxa_patronal** | numeric | - | ✅ SIM | - | - |
| **taxa_rat** | numeric | - | ✅ SIM | - | - |
| **terceiros_rate** | numeric | - | ✅ SIM | - | - |
| **va_default** | numeric | - | ✅ SIM | - | - |
| **vr_default** | numeric | - | ✅ SIM | - | - |
| **entidades_terceiras** | jsonb | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `tax_configs_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `tax_configs_pkey` | `id` | ✅ SIM | ✅ SIM |
| `tax_configs_unit_id_key` | `unit_id` | ✅ SIM | ❌ NÃO |

---

### Tabela: `transactions`

**Descrição:** TransaÃ§Ãµes financeiras (receitas/despesas)

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `gen_random_uuid()` | - |
| **id_unidade** | uuid | - | ✅ SIM | - | - |
| **descricao** | text | - | ❌ NÃO | - | - |
| **valor** | numeric | - | ❌ NÃO | - | - |
| **tipo_transacao** | text | - | ❌ NÃO | - | - |
| **id_conta** | uuid | - | ✅ SIM | - | - |
| **data_transacao** | date | - | ❌ NÃO | - | - |
| **data_vencimento** | date | - | ✅ SIM | - | - |
| **data_pagamento** | date | - | ✅ SIM | - | - |
| **situacao** | text | - | ✅ SIM | `'PAID'::text` | - |
| **forma_pagamento** | text | - | ✅ SIM | - | - |
| **categoria** | text | - | ✅ SIM | - | - |
| **centro_custo** | text | - | ✅ SIM | - | - |
| **natureza_operacao** | text | - | ✅ SIM | - | - |
| **nome_fornecedor** | text | - | ✅ SIM | - | - |
| **id_membro** | uuid | - | ✅ SIM | - | - |
| **conciliado** | boolean | - | ✅ SIM | `false` | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **created_by** | uuid | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **data_competencia** | date | - | ✅ SIM | - | - |
| **projeto_id** | uuid | - | ✅ SIM | - | - |
| **valor_pago** | numeric | - | ✅ SIM | `0` | - |
| **valor_restante** | numeric | - | ✅ SIM | - | - |
| **parcelado** | boolean | - | ✅ SIM | `false` | - |
| **numero_parcela** | integer | - | ✅ SIM | - | - |
| **total_parcelas** | integer | - | ✅ SIM | - | - |
| **id_transacao_origem** | uuid | - | ✅ SIM | - | - |
| **data_conciliacao** | date | - | ✅ SIM | - | - |
| **id_externo** | character varying | 100 | ✅ SIM | - | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_conta** | `accounts` | `id` | `transactions_account_id_fkey` |
| **created_by** | `users` | `id` | `transactions_created_by_fkey` |
| **id_membro** | `membros` | `id` | `transactions_member_id_fkey` |
| **id_transacao_origem** | `transactions` | `id` | `transactions_parent_id_fkey` |
| **id_unidade** | `units` | `id` | `transactions_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_transactions_account_id` | `id_conta` | ❌ NÃO | ❌ NÃO |
| `idx_transactions_date` | `data_transacao` | ❌ NÃO | ❌ NÃO |
| `idx_transactions_due_date` | `data_vencimento` | ❌ NÃO | ❌ NÃO |
| `idx_transactions_is_installment` | `parcelado` | ❌ NÃO | ❌ NÃO |
| `idx_transactions_parent_id` | `id_transacao_origem` | ❌ NÃO | ❌ NÃO |
| `idx_transactions_status` | `situacao` | ❌ NÃO | ❌ NÃO |
| `idx_transactions_type` | `tipo_transacao` | ❌ NÃO | ❌ NÃO |
| `idx_transactions_unit_id` | `id_unidade` | ❌ NÃO | ❌ NÃO |
| `transactions_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `treasury_alerts`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_unidade** | uuid | - | ❌ NÃO | - | - |
| **tipo_alerta** | character varying | 50 | ❌ NÃO | - | - |
| **titulo_alerta** | character varying | 255 | ❌ NÃO | - | - |
| **descricao_alerta** | text | - | ❌ NÃO | - | - |
| **nivel_gravidade** | character varying | 20 | ❌ NÃO | - | - |
| **id_conta** | uuid | - | ✅ SIM | - | - |
| **investimento_id** | uuid | - | ✅ SIM | - | - |
| **emprestimo_id** | uuid | - | ✅ SIM | - | - |
| **valor_alerta** | numeric | - | ✅ SIM | - | - |
| **data_limite_alerta** | date | - | ✅ SIM | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'ATIVO'::character varying` | - |
| **acoes_sugeridas** | jsonb | - | ✅ SIM | `'[]'::jsonb` | - |
| **criado_por** | character varying | 255 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_conta** | `financial_accounts` | `id` | `treasury_alerts_conta_id_fkey` |
| **emprestimo_id** | `treasury_loans` | `id` | `treasury_alerts_emprestimo_id_fkey` |
| **investimento_id** | `treasury_investments` | `id` | `treasury_alerts_investimento_id_fkey` |
| **id_unidade** | `units` | `id` | `treasury_alerts_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_treasury_alerts_unit` | `id_unidade` | ❌ NÃO | ❌ NÃO |
| `treasury_alerts_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `treasury_cash_flows`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **id_unidade** | uuid | - | ❌ NÃO | - | - |
| **data_movimento** | date | - | ❌ NÃO | - | - |
| **descricao_movimento** | text | - | ❌ NÃO | - | - |
| **categoria_movimento** | character varying | 50 | ❌ NÃO | - | - |
| **valor_movimento** | numeric | - | ❌ NÃO | - | - |
| **tipo_movimento** | character varying | 20 | ❌ NÃO | - | - |
| **id_conta** | uuid | - | ✅ SIM | - | - |
| **situacao** | character varying | 20 | ✅ SIM | `'REALIZADO'::character varying` | - |
| **observacoes_movimento** | text | - | ✅ SIM | - | - |
| **criado_por** | character varying | 255 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_conta** | `financial_accounts` | `id` | `treasury_cash_flows_conta_id_fkey` |
| **id_unidade** | `units` | `id` | `treasury_cash_flows_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_treasury_cash_flows_data` | `data_movimento` | ❌ NÃO | ❌ NÃO |
| `idx_treasury_cash_flows_unit` | `id_unidade` | ❌ NÃO | ❌ NÃO |
| `treasury_cash_flows_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `treasury_financial_positions`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **data** | date | - | ❌ NÃO | - | - |
| **ativo_total** | numeric | - | ✅ SIM | `0` | - |
| **passivo_total** | numeric | - | ✅ SIM | `0` | - |
| **patrimonio_liquido** | numeric | - | ✅ SIM | `0` | - |
| **disponibilidades** | numeric | - | ✅ SIM | `0` | - |
| **aplicacoes** | numeric | - | ✅ SIM | `0` | - |
| **contas_receber** | numeric | - | ✅ SIM | `0` | - |
| **estoques** | numeric | - | ✅ SIM | `0` | - |
| **ativo_fixo** | numeric | - | ✅ SIM | `0` | - |
| **fornecedores** | numeric | - | ✅ SIM | `0` | - |
| **emprestimos** | numeric | - | ✅ SIM | `0` | - |
| **outras_contas** | numeric | - | ✅ SIM | `0` | - |
| **variacao_patrimonial** | numeric | - | ✅ SIM | `0` | - |
| **variacao_percentual** | numeric | - | ✅ SIM | `0` | - |
| **indicadores** | jsonb | - | ✅ SIM | `'{}'::jsonb` | - |
| **detalhamento** | jsonb | - | ✅ SIM | `'[]'::jsonb` | - |
| **created_by** | character varying | 255 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `treasury_financial_positions_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `treasury_financial_positions_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `treasury_forecasts`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **data_inicio** | date | - | ❌ NÃO | - | - |
| **data_final** | date | - | ❌ NÃO | - | - |
| **tipo** | character varying | 20 | ❌ NÃO | - | - |
| **saldo_inicial** | numeric | - | ✅ SIM | `0` | - |
| **entradas_previstas** | numeric | - | ✅ SIM | `0` | - |
| **saidas_previstas** | numeric | - | ✅ SIM | `0` | - |
| **saldo_final_previsto** | numeric | - | ✅ SIM | `0` | - |
| **entradas_realizadas** | numeric | - | ✅ SIM | `0` | - |
| **saidas_realizadas** | numeric | - | ✅ SIM | `0` | - |
| **saldo_final_real** | numeric | - | ✅ SIM | `0` | - |
| **precisao** | numeric | - | ✅ SIM | `0` | - |
| **status** | character varying | 20 | ✅ SIM | `'EM_ANDAMENTO'::character varying` | - |
| **detalhes** | jsonb | - | ✅ SIM | `'[]'::jsonb` | - |
| **criado_por** | character varying | 255 | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `treasury_forecasts_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `treasury_forecasts_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `treasury_investments`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **nome** | character varying | 255 | ❌ NÃO | - | - |
| **tipo** | character varying | 50 | ❌ NÃO | - | - |
| **instituicao** | character varying | 255 | ❌ NÃO | - | - |
| **data_aplicacao** | date | - | ❌ NÃO | - | - |
| **data_vencimento** | date | - | ✅ SIM | - | - |
| **valor_aplicado** | numeric | - | ❌ NÃO | - | - |
| **valor_atual** | numeric | - | ❌ NÃO | - | - |
| **rentabilidade_anual** | numeric | - | ✅ SIM | `0` | - |
| **indexador** | character varying | 50 | ✅ SIM | - | - |
| **status** | character varying | 20 | ✅ SIM | `'ATIVO'::character varying` | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **rendimentos** | jsonb | - | ✅ SIM | `'[]'::jsonb` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `treasury_investments_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_treasury_investments_unit` | `unit_id` | ❌ NÃO | ❌ NÃO |
| `treasury_investments_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `treasury_loans`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **unit_id** | uuid | - | ❌ NÃO | - | - |
| **nome** | character varying | 255 | ❌ NÃO | - | - |
| **credor** | character varying | 255 | ❌ NÃO | - | - |
| **data_contratacao** | date | - | ❌ NÃO | - | - |
| **data_vencimento** | date | - | ❌ NÃO | - | - |
| **valor_original** | numeric | - | ❌ NÃO | - | - |
| **valor_saldo** | numeric | - | ❌ NÃO | - | - |
| **taxa_juros** | numeric | - | ❌ NÃO | - | - |
| **tipo_juros** | character varying | 20 | ✅ SIM | `'MENSAL'::character varying` | - |
| **total_parcelas** | integer | - | ❌ NÃO | - | - |
| **parcelas_pagas** | integer | - | ✅ SIM | `0` | - |
| **status** | character varying | 20 | ✅ SIM | `'ATIVO'::character varying` | - |
| **parcelas** | jsonb | - | ✅ SIM | `'[]'::jsonb` | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **unit_id** | `units` | `id` | `treasury_loans_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_treasury_loans_unit` | `unit_id` | ❌ NÃO | ❌ NÃO |
| `treasury_loans_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `units`

**Descrição:** Unidades da igreja (matriz e filiais)

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **nome_unidade** | text | - | ❌ NÃO | - | - |
| **cnpj** | text | - | ✅ SIM | - | - |
| **endereco** | text | - | ✅ SIM | - | - |
| **bairro** | text | - | ✅ SIM | - | - |
| **cidade** | text | - | ✅ SIM | - | - |
| **estado** | text | - | ✅ SIM | - | - |
| **cep** | text | - | ✅ SIM | - | - |
| **country** | text | - | ✅ SIM | `'BR'::text` | - |
| **telefone** | text | - | ✅ SIM | - | - |
| **email** | text | - | ✅ SIM | - | - |
| **website** | text | - | ✅ SIM | - | - |
| **pastor_name** | text | - | ✅ SIM | - | - |
| **pastor_phone** | text | - | ✅ SIM | - | - |
| **sede** | boolean | - | ✅ SIM | `false` | - |
| **status** | text | - | ✅ SIM | `'ACTIVE'::text` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **criado_por** | uuid | - | ✅ SIM | - | - |
| **endereco_linha1** | text | - | ✅ SIM | - | - |
| **endereco_linha2** | text | - | ✅ SIM | - | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_units_name` | `nome_unidade` | ❌ NÃO | ❌ NÃO |
| `idx_units_status` | `status` | ❌ NÃO | ❌ NÃO |
| `units_cnpj_key` | `cnpj` | ✅ SIM | ❌ NÃO |
| `units_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `user_permissions`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **user_id** | uuid | - | ❌ NÃO | - | - |
| **codigo_modulo** | character varying | 100 | ❌ NÃO | - | - |
| **can_read** | boolean | - | ✅ SIM | - | - |
| **can_write** | boolean | - | ✅ SIM | - | - |
| **can_delete** | boolean | - | ✅ SIM | - | - |
| **can_manage** | boolean | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **codigo_modulo** | `permission_modules` | `codigo` | `user_permissions_module_code_fkey` |
| **user_id** | `users` | `id` | `user_permissions_user_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `user_permissions_pkey` | `id` | ✅ SIM | ✅ SIM |
| `user_permissions_user_id_module_code_key` | `user_id`, `codigo_modulo` | ✅ SIM | ❌ NÃO |

---

### Tabela: `users`

**Descrição:** UsuÃ¡rios do sistema com permissÃµes

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **email** | text | - | ❌ NÃO | - | - |
| **hash_senha** | text | - | ❌ NÃO | - | - |
| **nome_usuario** | text | - | ❌ NÃO | - | - |
| **role** | text | - | ❌ NÃO | - | - |
| **id_unidade** | uuid | - | ✅ SIM | - | - |
| **id_funcionario** | uuid | - | ✅ SIM | - | - |
| **id_membro** | uuid | - | ✅ SIM | - | - |
| **esta_ativo** | boolean | - | ✅ SIM | `true` | - |
| **ultimo_login** | timestamp with time zone | - | ✅ SIM | - | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **atualizado** | timestamp with time zone | - | ✅ SIM | `now()` | - |
| **criado_por** | uuid | - | ✅ SIM | - | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **id_funcionario** | `employees` | `id` | `users_employee_id_fkey` |
| **id_membro** | `membros` | `id` | `users_member_id_fkey` |
| **id_unidade** | `units` | `id` | `users_unit_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `idx_users_email` | `email` | ❌ NÃO | ❌ NÃO |
| `idx_users_role` | `role` | ❌ NÃO | ❌ NÃO |
| `idx_users_unit_id` | `id_unidade` | ❌ NÃO | ❌ NÃO |
| `users_email_key` | `email` | ✅ SIM | ❌ NÃO |
| `users_pkey` | `id` | ✅ SIM | ✅ SIM |

---

### Tabela: `volunteer_schedules`

#### Colunas

| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |
|--------|------|----------|----------|--------|------------|
| **id** | uuid | - | ❌ NÃO | `uuid_generate_v4()` | - |
| **evento_id** | uuid | - | ❌ NÃO | - | - |
| **ministerio** | character varying | 100 | ❌ NÃO | - | - |
| **funcao** | character varying | 100 | ❌ NÃO | - | - |
| **voluntario_id** | uuid | - | ✅ SIM | - | - |
| **nome_voluntario** | character varying | 255 | ✅ SIM | - | - |
| **telefone_voluntario** | character varying | 20 | ✅ SIM | - | - |
| **email_voluntario** | character varying | 255 | ✅ SIM | - | - |
| **confirmado** | boolean | - | ✅ SIM | `false` | - |
| **observacoes** | text | - | ✅ SIM | - | - |
| **quantidade_necessaria** | integer | - | ❌ NÃO | `1` | - |
| **quantidade_atribuida** | integer | - | ✅ SIM | `0` | - |
| **criado** | timestamp with time zone | - | ✅ SIM | `CURRENT_TIMESTAMP` | - |

#### Chave Primária

| Coluna |
|--------|
| **id** |

#### Chaves Estrangeiras (Relacionamentos)

| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |
|--------|---------------------|--------------------|------------|
| **evento_id** | `church_events` | `id` | `volunteer_schedules_event_id_fkey` |

#### Índices

| Índice | Colunas | Único | Primário |
|--------|---------|--------|----------|
| `volunteer_schedules_pkey` | `id` | ✅ SIM | ✅ SIM |

---

## 🔗 Relacionamentos (Visão Geral)

| Tabela Origem | Coluna | Tabela Destino | Coluna Destino |
|---------------|--------|----------------|------------------|
| `account_balances` | **id_conta** | `chart_of_accounts` | **id** |
| `accounting_configs` | **unit_id** | `units` | **id** |
| `accounting_entries` | **transaction_id** | `transactions` | **id** |
| `accounting_entries` | **unit_id** | `units` | **id** |
| `accounts` | **id_unidade** | `units` | **id** |
| `app_role_permissions` | **codigo_modulo** | `app_permission_modules` | **codigo** |
| `app_user_permissions` | **codigo_modulo** | `app_permission_modules` | **codigo** |
| `app_user_permissions` | **usuario_id** | `users` | **id** |
| `asset_depreciations` | **unit_id** | `units` | **id** |
| `asset_depreciations` | **ativo_id** | `assets` | **id** |
| `asset_maintenances` | **unit_id** | `units` | **id** |
| `asset_maintenances` | **asset_id** | `assets` | **id** |
| `asset_transfers` | **unidade_origem_id** | `units` | **id** |
| `asset_transfers` | **unidade_destino_id** | `units` | **id** |
| `asset_transfers` | **ativo_id** | `assets` | **id** |
| `assets` | **funcionario_responsavel_id** | `employees` | **id** |
| `assets` | **unit_id** | `units` | **id** |
| `audit_logs` | **unit_id** | `units` | **id** |
| `audit_logs` | **usuario_id** | `users` | **id** |
| `bank_reconciliations` | **unit_id** | `units` | **id** |
| `bank_reconciliations` | **conta_bancaria_id** | `financial_accounts` | **id** |
| `bank_statement_transactions` | **transacao_id** | `transactions` | **id** |
| `bank_statement_transactions` | **unit_id** | `units` | **id** |
| `bank_statement_transactions` | **reconciliation_id** | `bank_reconciliations` | **id** |
| `bank_statement_transactions` | **bank_account_id** | `financial_accounts` | **id** |
| `cash_closings` | **id_conta** | `financial_accounts` | **id** |
| `cash_closings` | **unit_id** | `units` | **id** |
| `cash_closings` | **fechado_por** | `users` | **id** |
| `cash_movements` | **autorizado_por** | `users` | **id** |
| `cash_movements` | **responsavel** | `users` | **id** |
| `cash_movements` | **account_id** | `financial_accounts` | **id** |
| `cash_movements` | **unit_id** | `units` | **id** |
| `categories` | **categoria_pai_id** | `categories` | **id** |
| `categories` | **unit_id** | `units` | **id** |
| `chart_of_accounts` | **parent_id** | `chart_of_accounts` | **id** |
| `chart_of_accounts` | **unit_id** | `units` | **id** |
| `church_events` | **evento_pai_id** | `church_events` | **id** |
| `church_events` | **unit_id** | `units` | **id** |
| `dependents` | **id_membro** | `membros` | **id** |
| `employee_dependents` | **id_funcionario** | `employees` | **id** |
| `employees` | **id_unidade** | `units` | **id** |
| `events` | **unit_id** | `units` | **id** |
| `events` | **criado_por** | `users` | **id** |
| `financial_accounts` | **unit_id** | `units` | **id** |
| `inventory_adjustments` | **unit_id** | `units` | **id** |
| `inventory_adjustments` | **asset_id** | `assets` | **id** |
| `inventory_adjustments` | **contagem_estoque_id** | `inventory_counts` | **id** |
| `inventory_counts` | **unit_id** | `units` | **id** |
| `inventory_items` | **ativo_id** | `assets` | **id** |
| `inventory_items` | **contagem_estoque_id** | `inventory_counts` | **id** |
| `lgpd_consent_logs` | **id_funcionario** | `employees` | **id** |
| `lgpd_consent_logs` | **politica_id** | `lgpd_policies` | **id** |
| `lgpd_consent_logs` | **id_membro** | `membros` | **id** |
| `lgpd_policies` | **unit_id** | `units` | **id** |
| `member_contributions` | **id_membro** | `membros` | **id** |
| `member_dependents` | **id_membro** | `membros` | **id** |
| `membros` | **id_unidade** | `units` | **id** |
| `payroll` | **id_funcionario** | `employees` | **id** |
| `payroll` | **unit_id** | `units` | **id** |
| `payroll` | **processado_por** | `users` | **id** |
| `payroll_calculations` | **id_funcionario** | `employees` | **id** |
| `payroll_periods` | **criado_por** | `users` | **id** |
| `payroll_periods` | **id_unidade** | `units` | **id** |
| `pdi_plans` | **id_funcionario** | `employees` | **id** |
| `pdi_plans` | **unit_id** | `units` | **id** |
| `performance_evaluations` | **id_funcionario** | `employees` | **id** |
| `performance_evaluations` | **unit_id** | `units` | **id** |
| `system_logs` | **id_unidade** | `units` | **id** |
| `system_logs` | **usuario_id** | `users` | **id** |
| `tax_configs` | **unit_id** | `units` | **id** |
| `transactions` | **id_transacao_origem** | `transactions` | **id** |
| `transactions` | **created_by** | `users` | **id** |
| `transactions` | **id_membro** | `membros` | **id** |
| `transactions` | **id_conta** | `accounts` | **id** |
| `transactions` | **id_unidade** | `units` | **id** |
| `treasury_alerts` | **id_conta** | `financial_accounts` | **id** |
| `treasury_alerts` | **investimento_id** | `treasury_investments` | **id** |
| `treasury_alerts` | **emprestimo_id** | `treasury_loans` | **id** |
| `treasury_alerts` | **id_unidade** | `units` | **id** |
| `treasury_cash_flows` | **id_conta** | `financial_accounts` | **id** |
| `treasury_cash_flows` | **id_unidade** | `units` | **id** |
| `treasury_financial_positions` | **unit_id** | `units` | **id** |
| `treasury_forecasts` | **unit_id** | `units` | **id** |
| `treasury_investments` | **unit_id** | `units` | **id** |
| `treasury_loans` | **unit_id** | `units` | **id** |
| `user_permissions` | **user_id** | `users` | **id** |
| `user_permissions` | **codigo_modulo** | `permission_modules` | **codigo** |
| `users` | **id_funcionario** | `employees` | **id** |
| `users` | **id_membro** | `membros` | **id** |
| `users` | **id_unidade** | `units` | **id** |
| `volunteer_schedules` | **evento_id** | `church_events` | **id** |

---

## 📈 Estatísticas

| Tabela | Número de Linhas (aprox.) |
|--------|---------------------------|
| `schema_migrations` | 0 |
| `accounting_entries` | 0 |
| `account_balances` | 0 |
| `units` | 0 |
| `tax_configs` | 0 |
| `treasury_investments` | 0 |
| `users` | 0 |
| `payroll_calculations` | 0 |
| `treasury_cash_flows` | 0 |
| `church_events` | 0 |
| `dependents` | 0 |
| `lgpd_policies` | 0 |
| `user_permissions` | 0 |
| `accounting_configs` | 0 |
| `bank_reconciliations` | 0 |
| `treasury_alerts` | 0 |
| `treasury_loans` | 0 |
| `membros` | 0 |
| `cash_closings` | 0 |
| `employees` | 0 |
| `audit_logs` | 0 |
| `inventory_items` | 0 |
| `member_contributions` | 0 |
| `app_audit_logs` | 0 |
| `employee_leaves` | 0 |
| `app_role_permissions` | 0 |
| `app_permission_modules` | 0 |
| `payroll_periods` | 0 |
| `pdi_plans` | 0 |
| `bank_statement_transactions` | 0 |
| `inventory_counts` | 0 |
| `permission_modules` | 0 |
| `system_logs` | 0 |
| `asset_depreciations` | 0 |
| `role_permissions` | 0 |
| `member_dependents` | 0 |
| `lgpd_consent_logs` | 0 |
| `events` | 0 |
| `cash_movements` | 0 |
| `transactions` | 0 |
| `accounts` | 0 |
| `payroll` | 0 |
| `treasury_forecasts` | 0 |
| `asset_maintenances` | 0 |
| `treasury_financial_positions` | 0 |
| `financial_accounts` | 0 |
| `employee_dependents` | 0 |
| `chart_of_accounts` | 0 |
| `categories` | 0 |
| `asset_transfers` | 0 |
| `assets` | 0 |
| `app_user_permissions` | 0 |
| `volunteer_schedules` | 0 |
| `performance_evaluations` | 0 |
| `inventory_adjustments` | 0 |

---

*Relatório gerado automaticamente.*
