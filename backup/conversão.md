# Análise de Conversão de Nomenclaturas — IgrejaERP

> Cruzamento entre `nomenclaturas_tabelas.md` ↔ `igrejairp.sql`
> Objetivo: identificar o que **pode e deve** ser traduzido para Português,
> respeitando as restrições do **PostgreSQL** e do **React/TypeScript**.

---

## 📋 Regras de Conversão por Camada

### 🐘 PostgreSQL — O que é permitido
- ✅ Renomear tabelas (`ALTER TABLE x RENAME TO y`)
- ✅ Renomear colunas (`ALTER TABLE x RENAME COLUMN a TO b`)
- ✅ Usar acentuação **somente com aspas duplas** (ex: `"número"`) — **NÃO recomendado**
- ✅ Usar `snake_case` em PT sem acentos (ex: `data_nascimento`, `nome_completo`)
- ❌ Não usar espaços, hífen ou caracteres especiais sem aspas
- ❌ Não usar palavras reservadas: `select`, `table`, `index`, `user`, `order`, `value`, `type`, `key`, `status`
- ⚠️  Ao renomear tabelas com FK, todas as referências e constraints precisam ser atualizadas

### ⚛️ React/TypeScript — O que é permitido
- ✅ Campos em `camelCase` PT (ex: `nomeCompleto`, `dataNascimento`)
- ✅ Interfaces e Types em PT (ex: `interface Membro`, `type StatusMembro`)
- ✅ Hooks em PT (ex: `useMembros()`, `useUnidades()`)
- ❌ Não usar acentos em nomes de variáveis (ex: `~~número~~` → use `numero`)
- ❌ Não iniciar nomes com número
- ⚠️  Manter consistência: se a tabela for PT no banco, o campo TS deve ser PT também

---

## 🔴 LEGENDA DE STATUS

| Ícone | Significado |
|-------|-------------|
| ✅ `PODE TRADUZIR` | Seguro para traduzir em todas as camadas |
| ⚠️ `TRADUZIR COM CUIDADO` | Requer atenção (FK, views, palavras reservadas) |
| 🔄 `JÁ EM PT` | Tabela/coluna já está em português |
| ❌ `NÃO TRADUZIR` | Sistema, controle interno ou sem benefício |
| 🔀 `DUPLICADA` | Existe par EN/PT — consolidar em uma só |

---

## 📊 1. TABELAS — Análise de Conversão

### Grupo A: Tabelas Principais (Dados de Negócio)

| Tabela Atual (SQL) | Status | Tradução Recomendada (PT) | Risco | Observação |
|---|:---:|---|:---:|---|
| `accounts` | ✅ `PODE TRADUZIR` | `contas` | 🟡 Médio | Tem FK em `transactions`, `bank_reconciliations`. `contas` não é palavra reservada |
| `assets` | ✅ `PODE TRADUZIR` | `patrimonio` | 🟡 Médio | Referenciada por `asset_depreciations`, `asset_maintenances`, `asset_transfers` |
| `asset_depreciations` | ✅ `PODE TRADUZIR` | `depreciacoes_patrimonio` | 🟢 Baixo | Sem referência direta de outras tabelas |
| `asset_maintenances` | ✅ `PODE TRADUZIR` | `manutencoes_patrimonio` | 🟢 Baixo | Sem referência direta |
| `asset_transfers` | ✅ `PODE TRADUZIR` | `transferencias_patrimonio` | 🟢 Baixo | Sem referência direta |
| `audit_logs` | ✅ `PODE TRADUZIR` | `logs_auditoria` | 🟢 Baixo | Somente referência de `users` |
| `bank_reconciliations` | ✅ `PODE TRADUZIR` | `conciliacoes_bancarias` | 🟡 Médio | Referenciada por `bank_statement_transactions` |
| `bank_statement_transactions` | ✅ `PODE TRADUZIR` | `transacoes_extrato_bancario` | 🟢 Baixo | Sem referência direta |
| `cash_closings` | ✅ `PODE TRADUZIR` | `fechamentos_caixa` | 🟢 Baixo | Sem referência direta |
| `cash_movements` | ✅ `PODE TRADUZIR` | `movimentacoes_caixa` | 🟢 Baixo | Sem referência direta |
| `categories` | ⚠️ `CUIDADO` | `categorias` | 🟡 Médio | Verificar auto-referência (parent_id) |
| `chart_of_accounts` | ✅ `PODE TRADUZIR` | `plano_contas` | 🟡 Médio | Referenciada por `accounting_entries` |
| `church_events` | ✅ `PODE TRADUZIR` | `eventos_igreja` | 🟢 Baixo | Sem referência direta |
| `dependents` | 🔀 `DUPLICADA` | `dependentes` | 🟡 Médio | Já existe tabela `dependentes` em PT — CONSOLIDAR |
| `employee_dependents` | ✅ `PODE TRADUZIR` | `dependentes_funcionarios` | 🟢 Baixo | Sem referência direta |
| `employee_leaves` | ✅ `PODE TRADUZIR` | `afastamentos_funcionarios` | 🟢 Baixo | Sem referência direta |
| `employees` | ⚠️ `CUIDADO` | `funcionarios_rh` | 🔴 Alto | Muito referenciada. Já existe tabela `funcionarios` legada — CONSOLIDAR |
| `events` | 🔀 `DUPLICADA` | `eventos` | 🟡 Médio | Já existe `church_events` — avaliar unificação |
| `financial_accounts` | 🔀 `DUPLICADA` | `contas_financeiras` | 🟡 Médio | Já existe `contas_financeiras` em PT — CONSOLIDAR |
| `inventory_adjustments` | ✅ `PODE TRADUZIR` | `ajustes_inventario` | 🟢 Baixo | Sem referência direta |
| `inventory_counts` | ✅ `PODE TRADUZIR` | `contagens_inventario` | 🟡 Médio | Referenciada por `inventory_items` |
| `inventory_items` | ✅ `PODE TRADUZIR` | `itens_inventario` | 🟢 Baixo | Sem referência direta |
| `lgpd_consent_logs` | ✅ `PODE TRADUZIR` | `logs_consentimento_lgpd` | 🟢 Baixo | Sem referência direta |
| `lgpd_policies` | ✅ `PODE TRADUZIR` | `politicas_lgpd` | 🟡 Médio | Referenciada por `lgpd_consent_logs` |
| `member_contributions` | 🔀 `DUPLICADA` | `contribuicoes_membros` | 🟡 Médio | Já existe `contribuicoes_membros` em PT — CONSOLIDAR |
| `member_dependents` | ✅ `PODE TRADUZIR` | `dependentes_membros` | 🟢 Baixo | Sem referência direta |
| `payroll` | ✅ `PODE TRADUZIR` | `folha_pagamento` | 🟡 Médio | Referenciada por `payroll_calculations` |
| `payroll_calculations` | ✅ `PODE TRADUZIR` | `calculos_folha` | 🟢 Baixo | Sem referência direta |
| `payroll_periods` | ✅ `PODE TRADUZIR` | `periodos_folha` | 🟢 Baixo | Sem referência direta |
| `pdi_plans` | ✅ `PODE TRADUZIR` | `planos_pdi` | 🟢 Baixo | Sem referência direta |
| `performance_evaluations` | ✅ `PODE TRADUZIR` | `avaliacoes_desempenho` | 🟢 Baixo | Sem referência direta |
| `permission_modules` | ✅ `PODE TRADUZIR` | `modulos_permissao` | 🟡 Médio | Referenciada por `role_permissions`, `user_permissions` |
| `role_permissions` | ✅ `PODE TRADUZIR` | `permissoes_perfil` | 🟢 Baixo | Sem referência direta |
| `system_logs` | ✅ `PODE TRADUZIR` | `logs_sistema` | 🟢 Baixo | Sem referência direta |
| `tax_configs` | ✅ `PODE TRADUZIR` | `configuracoes_tributarias` | 🟢 Baixo | Sem referência direta |
| `transactions` | 🔀 `DUPLICADA` | `transacoes` | 🔴 Alto | Já existe `transacoes` em PT — CONSOLIDAR |
| `treasury_alerts` | ✅ `PODE TRADUZIR` | `alertas_tesouraria` | 🟢 Baixo | Sem referência direta |
| `treasury_cash_flows` | ✅ `PODE TRADUZIR` | `fluxos_caixa` | 🟢 Baixo | Sem referência direta |
| `treasury_financial_positions` | ✅ `PODE TRADUZIR` | `posicoes_financeiras` | 🟢 Baixo | Sem referência direta |
| `treasury_forecasts` | ✅ `PODE TRADUZIR` | `previsoes_financeiras` | 🟢 Baixo | Sem referência direta |
| `treasury_investments` | ✅ `PODE TRADUZIR` | `investimentos` | 🟢 Baixo | Sem referência direta |
| `treasury_loans` | ✅ `PODE TRADUZIR` | `emprestimos` | 🟢 Baixo | Sem referência direta |
| `units` | 🔀 `DUPLICADA` | `unidades` | 🔴 Alto | Já existe `unidades` em PT — CONSOLIDAR. Mais referenciada do sistema |
| `user_permissions` | ✅ `PODE TRADUZIR` | `permissoes_usuario` | 🟢 Baixo | Sem referência direta |
| `users` | 🔀 `DUPLICADA` | `usuarios` | 🔴 Alto | Já existe `usuarios` em PT — CONSOLIDAR |
| `volunteer_schedules` | ✅ `PODE TRADUZIR` | `escalas_voluntarios` | 🟢 Baixo | Sem referência direta |

### Grupo B: Tabelas Sistema/Auxiliar (Não Traduzir)

| Tabela Atual (SQL) | Status | Motivo |
|---|:---:|---|
| `account_balances` | ❌ `NÃO TRADUZIR` | View calculada — traduzir apenas campos de saída |
| `accounting_configs` | ✅ `PODE TRADUZIR` | `configuracoes_contabeis` |
| `accounting_entries` | ✅ `PODE TRADUZIR` | `lancamentos_contabeis` |
| `app_audit_logs` | ❌ `NÃO TRADUZIR` | Tabela de sistema — manter prefixo `app_` |
| `app_permission_modules` | ❌ `NÃO TRADUZIR` | Tabela de sistema |
| `app_role_permissions` | ❌ `NÃO TRADUZIR` | Tabela de sistema |
| `app_user_permissions` | ❌ `NÃO TRADUZIR` | Tabela de sistema |
| `schema_migrations` | ❌ `NÃO TRADUZIR` | Controle interno do PostgreSQL |

### Grupo C: Tabelas Já em Português (Manter)

| Tabela Atual (SQL) | Status | Observação |
|---|:---:|---|
| `membros` | 🔄 `JÁ EM PT` | Principal tabela de membros — manter |
| `funcionarios` | 🔄 `JÁ EM PT` | Legada — avaliar consolidação com `employees` |
| `unidades` | 🔄 `JÁ EM PT` | Principal — consolidar `units` nela |
| `usuarios` | 🔄 `JÁ EM PT` | Principal — consolidar `users` nela |
| `transacoes` | 🔄 `JÁ EM PT` | Principal — consolidar `transactions` nela |
| `pessoas` | 🔄 `JÁ EM PT` | Manter |
| `perfis` | 🔄 `JÁ EM PT` | Manter |
| `permissoes` | 🔄 `JÁ EM PT` | Manter |
| `contas_financeiras` | 🔄 `JÁ EM PT` | Consolidar `financial_accounts` nela |
| `contribuicoes_membros` | 🔄 `JÁ EM PT` | Consolidar `member_contributions` nela |
| `dependentes` | 🔄 `JÁ EM PT` | Consolidar `dependents` nela |
| `perfil_permissoes` | 🔄 `JÁ EM PT` | Manter |
| `usuarios_perfis` | 🔄 `JÁ EM PT` | Manter |

---

## 📊 2. COLUNAS — Análise de Conversão por Grupo

### Grupo 1: Colunas em Inglês Puro — ✅ PODEM SER TRADUZIDAS

Estas colunas estão totalmente em inglês e podem ser renomeadas com segurança:

| Coluna Original | Tabela(s) | Tradução PT Recomendada | TS (camelCase) |
|---|---|---|---|
| `unit_id` | múltiplas | `id_unidade` | `idUnidade` |
| `member_id` | múltiplas | `id_membro` | `idMembro` |
| `employee_id` | múltiplas | `id_funcionario` | `idFuncionario` |
| `asset_id` | múltiplas | `id_patrimonio` | `idPatrimonio` |
| `account_id` | múltiplas | `id_conta` | `idConta` |
| `user_id` | múltiplas | `id_usuario` | `idUsuario` |
| `created_at` | múltiplas | `criado_em` | `criadoEm` |
| `updated_at` | múltiplas | `atualizado_em` | `atualizadoEm` |
| `created_by` | múltiplas | `criado_por` | `criadoPor` |
| `deleted_at` | múltiplas | `excluido_em` | `excluidoEm` |
| `is_active` | múltiplas | `esta_ativo` | `estaAtivo` |
| `birth_date` | `employees` | `data_nascimento` | `dataNascimento` |
| `blood_type` | `employees` | `tipo_sanguineo` | `tipoSanguineo` |
| `emergency_contact` | `employees` | `contato_emergencia` | `contatoEmergencia` |
| `address_country` | `employees` | `pais` | `pais` |
| `name` | múltiplas | `nome` | `nome` |
| `description` | múltiplas | `descricao` | `descricao` |
| `status` | múltiplas | `situacao` | `situacao` |
| `type` | múltiplas | `tipo` | `tipo` |
| `complement` | `accounting_entries` | `complemento` | `complemento` |
| `role` | `app_role_permissions` | `perfil` | `perfil` |
| `currency` | `accounts` | `moeda` | `moeda` |
| `agency` | `accounts` | `agencia` | `agencia` |
| `action` | `app_audit_logs` | `acao` | `acao` |
| `success` | `app_audit_logs` | `sucesso` | `sucesso` |
| `details` | `app_audit_logs` | `detalhes` | `detalhes` |
| `period` | `account_balances` | `periodo` | `periodo` |
| `debit_period` | `account_balances` | `debito_periodo` | `debitoPeriodo` |
| `credit_period` | `account_balances` | `credito_periodo` | `creditoPeriodo` |
| `project_id` | `accounting_entries` | `id_projeto` | `idProjeto` |
| `transaction_id` | `accounting_entries` | `id_transacao` | `idTransacao` |

### Grupo 2: Colunas com Palavras Reservadas — ⚠️ TRADUZIR COM CUIDADO

> Estas colunas têm nomes que são palavras reservadas ou problemáticas no PostgreSQL/SQL padrão.

| Coluna Original | Tabela(s) | Problema | Tradução Segura | Observação |
|---|---|---|---|---|
| `status` | múltiplas | Palavra quasi-reservada | `situacao` | Funciona sem aspas no PG, mas `situacao` é mais seguro |
| `type` | múltiplas | Palavra reservada em alguns contextos | `tipo` | Usar `tipo` é mais seguro |
| `name` | múltiplas | Não reservada mas ambígua | `nome` | Recomendado traduzir |
| `role` | `app_role_permissions` | Palavra reservada SQL | `perfil` | **DEVE ser traduzida** |
| `value` | múltiplas | Palavra reservada | `valor` | **DEVE ser traduzida** |
| `key` | múltiplas | Palavra reservada | `chave` | **DEVE ser traduzida** |
| `index` | - | Palavra reservada | `indice` | **DEVE ser traduzida** |
| `order` | - | Palavra reservada | `ordem` | **DEVE ser traduzida** |
| `user` | - | Palavra reservada | `usuario` | **DEVE ser traduzida** |
| `table` | - | Palavra reservada | Não usar | |
| `select` | - | Palavra reservada | Não usar | |

### Grupo 3: Colunas Já em Português — 🔄 MANTER

| Coluna | Tabela(s) | Observação |
|---|---|---|
| `nome` | múltiplas | Manter |
| `criado` | múltiplas | Manter (equivale a `created_at`) |
| `atualizado` | múltiplas | Manter (equivale a `updated_at`) |
| `criado_por` | múltiplas | Manter |
| `id_unidade` | múltiplas | Manter — padrão PT |
| `data_nascimento` | `membros` | Manter |
| `data_admissao` | `employees` | Manter |
| `data_demissao` | `employees` | Manter |
| `salario_base` | `employees` | Manter |
| `situacao` | múltiplas | Manter |
| `descricao` | múltiplas | Manter |
| `observacoes` | múltiplas | Manter |
| `logradouro`, `bairro`, `cidade`, `estado`, `cep` | múltiplas | Manter — endereço em PT |

### Grupo 4: Colunas Mistas (Metade EN / Metade PT na mesma tabela) — ⚠️ PADRONIZAR

> Estas tabelas misturam idiomas nas colunas — devem ser padronizadas para PT:

| Tabela | Colunas EN (traduzir) | Colunas PT (manter) |
|---|---|---|
| `employees` | `birth_date`, `blood_type`, `emergency_contact`, `is_active`, `created_at`, `updated_at`, `address_country` | `nome`, `cpf`, `rg`, `cargo`, `salario_base`, `data_admissao`, `data_demissao` |
| `accounts` | `agency`, `currency`, `is_active` (→ `esta_ativo`) | `nome_conta`, `tipo_conta`, `nome_banco`, `saldo_atual`, `criado`, `atualizado` |
| `accounting_entries` | `complement`, `transaction_id`, `project_id`, `status` | `numero_lancamento`, `data_lancamento`, `historico`, `valor_debito`, `valor_credito`, `criado_por` |
| `app_audit_logs` | `action`, `success`, `details` | `nome_usuario`, `entidade`, `data_evento`, `ip`, `mensagem_erro` |
| `app_permission_modules` | `name`, `description` | `codigo`, `categoria`, `criado`, `atualizado` |
| `membros` | — | Já 100% em PT ✅ |
| `unidades` | — | Já 100% em PT ✅ |

---

## 📊 3. INTERFACES TYPESCRIPT — Análise de Conversão

### Interfaces que precisam ser atualizadas após conversão

| Interface Atual (TS) | Status | Interface PT Recomendada | Campos a Renomear |
|---|:---:|---|---|
| `AccountBalance` | ✅ Pode | `SaldoConta` | `debitPeriod` → `debitoPeriodo`, `creditPeriod` → `creditoPeriodo` |
| `AccountingConfig` | ✅ Pode | `ConfiguracaoContabil` | Todos já em PT no banco |
| `AccountingEntry` | ✅ Pode | `LancamentoContabil` | `complement` → `complemento`, `status` → `situacao` |
| `Asset` | ✅ Pode | `Patrimonio` | `unitId` → `idUnidade` |
| `AssetDepreciation` | ✅ Pode | `DepreciacaoPatrimonio` | `unitId` → `idUnidade` |
| `AssetMaintenance` | ✅ Pode | `ManutencaoPatrimonio` | `assetId` → `idPatrimonio` |
| `AssetTransfer` | ✅ Pode | `TransferenciaPatrimonio` | — |
| `AuditLog` | ✅ Pode | `LogAuditoria` | `action` → `acao`, `success` → `sucesso` |
| `BankReconciliation` | ✅ Pode | `ConciliacaoBancaria` | `bankAccountId` → `idContaBancaria` |
| `CashClosing` | ✅ Pode | `FechamentoCaixa` | — |
| `CashMovement` | ✅ Pode | `MovimentacaoCaixa` | — |
| `Category` | ✅ Pode | `Categoria` | `parentId` → `idCategoriaPai` |
| `ChartOfAccount` | ✅ Pode | `PlanoContas` | `parentId` → `idContaPai` |
| `ChurchEvent` | ✅ Pode | `EventoIgreja` | `unitId` → `idUnidade` |
| `ContaBancaria` | 🔄 Já PT | Manter | — |
| `Dependent` | ✅ Pode | `Dependente` | `memberId` → `idMembro` |
| `EmployeeLeave` | ✅ Pode | `AfastamentoFuncionario` | — |
| `Funcionario` | 🔄 Já PT | Padronizar campos EN | `birthDate` → `dataNascimento`, `isActive` → `estaAtivo` |
| `InventoryAdjustment` | ✅ Pode | `AjusteInventario` | — |
| `InventoryCount` | ✅ Pode | `ContagemInventario` | — |
| `LgpdConsentLog` | ✅ Pode | `LogConsentimentoLgpd` | — |
| `LgpdPolicy` | ✅ Pode | `PoliticaLgpd` | — |
| `MemberContribution` | 🔄 Já PT | Manter | — |
| `Membro` | 🔄 Já PT | Manter | — |
| `Payroll` | ✅ Pode | `FolhaPagamento` | — |
| `PayrollCalculation` | ✅ Pode | `CalculoFolha` | — |
| `PayrollPeriod` | ✅ Pode | `PeriodoFolha` | — |
| `PdiPlan` | ✅ Pode | `PlanoPdi` | — |
| `PerformanceEvaluation` | ✅ Pode | `AvaliacaoDesempenho` | — |
| `PermissionModule` | ✅ Pode | `ModuloPermissao` | `name` → `nome`, `description` → `descricao` |
| `RolePermission` | ✅ Pode | `PermissaoPerfil` | `role` → `perfil` |
| `SystemLog` | ✅ Pode | `LogSistema` | — |
| `TaxConfig` | ✅ Pode | `ConfiguracaoTributaria` | — |
| `Transacao` | 🔄 Já PT | Manter | — |
| `TreasuryAlert` | ✅ Pode | `AlertaTesouraria` | — |
| `TreasuryCashFlow` | ✅ Pode | `FluxoCaixa` | — |
| `TreasuryFinancialPosition` | ✅ Pode | `PosicaoFinanceira` | — |
| `TreasuryForecast` | ✅ Pode | `PrevisaoFinanceira` | — |
| `TreasuryInvestment` | ✅ Pode | `Investimento` | — |
| `TreasuryLoan` | ✅ Pode | `Emprestimo` | — |
| `Unidade` | 🔄 Já PT | Manter | — |
| `UserPermission` | ✅ Pode | `PermissaoUsuario` | — |
| `Usuario` | 🔄 Já PT | Manter | — |
| `VolunteerSchedule` | ✅ Pode | `EscalaVoluntario` | — |

---

## 🗺️ 4. PARES DUPLICADOS — Consolidação Necessária

> Existem tabelas em paralelo (EN + PT) que devem ser **consolidadas** antes de qualquer tradução:

| Tabela EN (eliminar) | Tabela PT (manter) | Risco | Estratégia |
|---|---|:---:|---|
| `units` | `unidades` | 🔴 Alto | Migrar dados → atualizar todas FKs → `DROP TABLE units` |
| `users` | `usuarios` | 🔴 Alto | Migrar dados → atualizar todas FKs → `DROP TABLE users` |
| `transactions` | `transacoes` | 🔴 Alto | Migrar dados → atualizar todas FKs → `DROP TABLE transactions` |
| `employees` | `funcionarios` | 🔴 Alto | Migrar dados → unificar schema → `DROP TABLE employees` |
| `dependents` | `dependentes` | 🟡 Médio | Migrar dados → `DROP TABLE dependents` |
| `financial_accounts` | `contas_financeiras` | 🟡 Médio | Migrar dados → `DROP TABLE financial_accounts` |
| `member_contributions` | `contribuicoes_membros` | 🟡 Médio | Migrar dados → `DROP TABLE member_contributions` |

---

## 📋 5. ORDEM DE EXECUÇÃO RECOMENDADA

> Execute **nesta ordem** para minimizar erros de FK:

```
Fase 1 — Sem dependências (risco baixo, executar primeiro)
  └── Traduzir tabelas sem FK de entrada:
      treasury_*, payroll_*, inventory_*, asset_*, lgpd_*, volunteer_schedules

Fase 2 — Dependências simples (1 nível)
  └── cash_closings, cash_movements, bank_statement_transactions,
      employee_leaves, employee_dependents, member_dependents

Fase 3 — Tabelas intermediárias (referenciadas por outras)
  └── categories, chart_of_accounts, permission_modules, lgpd_policies,
      audit_logs, system_logs, accounting_configs, tax_configs

Fase 4 — Consolidação dos pares duplicados (maior risco)
  └── units → unidades, users → usuarios, transactions → transacoes,
      employees → funcionarios, dependents → dependentes,
      financial_accounts → contas_financeiras, member_contributions → contribuicoes_membros

Fase 5 — Atualização das camadas
  └── Atualizar interfaces TypeScript, hooks React, queries do backend Express
```

---

## ⚠️ 6. PONTOS DE ATENÇÃO

> [!WARNING]
> **Palavras Reservadas no PostgreSQL** — As colunas `role`, `value`, `key`, `order`, `type`, `status`, `name`, `user`, `index`, `select` são palavras reservadas ou quasi-reservadas. Ao renomear **para** um nome em PT como `situacao`, `tipo`, `nome`, `perfil`, o problema é eliminado. Ao manter o nome EN, sempre use aspas duplas na query (`"status"`).

> [!IMPORTANT]
> **Acentuação** — Nunca use caracteres acentuados (`ã`, `ç`, `é`, `ó`) em nomes de colunas ou tabelas no PostgreSQL **sem aspas duplas**. Use sempre a versão sem acento: `funcao`, `criacao`, `numero`, `configuracoes`.

> [!NOTE]
> **React/TypeScript** — Em interfaces e variáveis JavaScript, acentos também são proibidos em identificadores. Use sempre `camelCase` sem acento: `dataNascimento`, `situacao`, `configuracaoContabil`.

> [!CAUTION]
> **Views** — As views `active_employees`, `active_members`, `financial_summary`, `asset_summary_by_unit` dependem dos nomes das tabelas e colunas. Ao renomear as tabelas base, as views devem ser **recriadas**. Execute `DROP VIEW` antes de renomear e `CREATE VIEW` depois.

---

*Documento gerado em: 2026-05-26 | Cruzamento: `nomenclaturas_tabelas.md` ↔ `igrejairp.sql`*
