# Relatório Completo do Banco de Dados (PostgreSQL)

**Gerado em:** 01/05/2026, 12:21:09

> Este relatório contém a estrutura completa das tabelas, colunas e relacionamentos (Chaves Estrangeiras).

## Tabela: `account_balances`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_conta` | uuid | NO | - |
| `nome_conta` | character varying | NO | - |
| `codigo_conta` | character varying | NO | - |
| `nature` | USER-DEFINED | NO | - |
| `period` | character varying | NO | - |
| `saldo_inicial` | numeric | YES | 0 |
| `debit_period` | numeric | YES | 0 |
| `credit_period` | numeric | YES | 0 |
| `saldo_final` | numeric | YES | 0 |
| `quantidade_lancamentos` | integer | YES | 0 |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_conta` | `chart_of_accounts` | `id` |

---

## Tabela: `accounting_configs`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `ano_fiscal` | integer | NO | - |
| `mes_inicio` | integer | NO | - |
| `mes_fim` | integer | NO | - |
| `moeda` | character varying | YES | 'BRL'::character varying |
| `regime_tributario` | character varying | YES | 'ISENTO'::character varying |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

---

## Tabela: `accounting_entries`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `numero_lancamento` | integer | NO | - |
| `data_lancamento` | date | NO | - |
| `numero_documento` | character varying | YES | - |
| `historico` | text | NO | - |
| `complement` | text | YES | - |
| `valor_debito` | numeric | NO | - |
| `valor_credito` | numeric | NO | - |
| `conta_contrapartida` | character varying | YES | - |
| `transaction_id` | uuid | YES | - |
| `project_id` | uuid | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `criado_por` | character varying | NO | - |
| `revisado_por` | character varying | YES | - |
| `status` | character varying | YES | 'DRAFT'::character varying |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `transaction_id` | `transactions` | `id` |

---

## Tabela: `accounts`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_unidade` | uuid | YES | - |
| `nome_conta` | text | NO | - |
| `tipo_conta` | text | NO | - |
| `nome_banco` | text | YES | - |
| `agency` | text | YES | - |
| `numero_conta` | text | YES | - |
| `saldo_atual` | numeric | YES | 0.00 |
| `currency` | text | YES | 'BRL'::text |
| `esta_ativo` | boolean | YES | true |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `transactions` | `id_conta` | `id` |

---

## Tabela: `app_audit_logs`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_unidade` | uuid | YES | - |
| `usuario_id` | uuid | YES | - |
| `nome_usuario` | character varying | NO | - |
| `action` | character varying | NO | - |
| `entidade` | character varying | NO | - |
| `id_entidade` | character varying | YES | - |
| `nome_entidade` | character varying | YES | - |
| `data_evento` | timestamp with time zone | NO | CURRENT_TIMESTAMP |
| `ip` | character varying | NO | - |
| `agente_usuario` | text | YES | - |
| `details` | jsonb | YES | - |
| `success` | boolean | NO | true |
| `mensagem_erro` | text | YES | - |
| `hash_anterior` | character varying | YES | - |
| `hash` | character varying | NO | - |
| `imutavel` | boolean | NO | true |
| `created_at` | timestamp with time zone | NO | CURRENT_TIMESTAMP |

---

## Tabela: `app_permission_modules`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `codigo` | character varying | NO | - |
| `name` | character varying | NO | - |
| `categoria` | character varying | NO | - |
| `description` | text | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `app_role_permissions` | `codigo_modulo` | `codigo` |
| `app_user_permissions` | `codigo_modulo` | `codigo` |

---

## Tabela: `app_role_permissions`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `role` | character varying | NO | - |
| `codigo_modulo` | character varying | NO | - |
| `ler` | boolean | YES | false |
| `escrever` | boolean | YES | false |
| `excluir` | boolean | YES | false |
| `gerenciar` | boolean | YES | false |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `administrador` | boolean | YES | false |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `codigo_modulo` | `app_permission_modules` | `codigo` |

---

## Tabela: `app_user_permissions`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `usuario_id` | uuid | NO | - |
| `codigo_modulo` | character varying | NO | - |
| `ler` | boolean | YES | - |
| `escrever` | boolean | YES | - |
| `excluir` | boolean | YES | - |
| `gerenciar` | boolean | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `administrador` | boolean | YES | - |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `usuario_id` | `users` | `id` |
| `codigo_modulo` | `app_permission_modules` | `codigo` |

---

## Tabela: `asset_depreciations`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `ativo_id` | uuid | NO | - |
| `unit_id` | uuid | NO | - |
| `mes_referencia` | integer | NO | - |
| `ano_referencia` | integer | NO | - |
| `valor_contabil_inicial` | numeric | NO | - |
| `despesa_depreciacao` | numeric | NO | - |
| `depreciacao_acumulada` | numeric | NO | - |
| `valor_contabil_final` | numeric | NO | - |
| `conta_debito` | character varying | YES | - |
| `conta_credito` | character varying | YES | - |
| `numero_documento` | character varying | YES | - |
| `processado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `ativo_id` | `assets` | `id` |
| `unit_id` | `units` | `id` |

---

## Tabela: `asset_maintenances`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `asset_id` | uuid | NO | - |
| `unit_id` | uuid | NO | - |
| `data_manutencao` | date | NO | - |
| `tipo_manutencao` | character varying | NO | - |
| `descricao` | text | NO | - |
| `fornecedor` | character varying | YES | - |
| `custo` | numeric | YES | - |
| `numero_documento` | character varying | YES | - |
| `proxima_manutencao` | date | YES | - |
| `executado_por` | character varying | YES | - |
| `situacao` | character varying | YES | 'PROGRAMADA'::character varying |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `asset_id` | `assets` | `id` |
| `unit_id` | `units` | `id` |

---

## Tabela: `asset_transfers`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `ativo_id` | uuid | NO | - |
| `unidade_origem_id` | uuid | NO | - |
| `unidade_destino_id` | uuid | NO | - |
| `data_transferencia` | date | NO | - |
| `motivo` | text | NO | - |
| `responsavel` | character varying | NO | - |
| `autorizado_por` | character varying | YES | - |
| `observacoes` | text | YES | - |
| `situacao` | character varying | YES | 'PENDENTE'::character varying |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `ativo_id` | `assets` | `id` |
| `unidade_origem_id` | `units` | `id` |
| `unidade_destino_id` | `units` | `id` |

---

## Tabela: `assets`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | YES | - |
| `nome` | text | NO | - |
| `descricao` | text | YES | - |
| `categoria` | text | NO | - |
| `data_aquisicao` | date | YES | - |
| `valor_aquisicao` | numeric | YES | - |
| `valor_atual` | numeric | YES | - |
| `taxa_depreciacao` | numeric | YES | - |
| `localizacao` | text | YES | - |
| `condicao` | text | YES | 'BOM'::text |
| `numero_ativo` | text | YES | - |
| `situacao` | text | YES | 'ATIVO'::text |
| `vida_util_meses` | integer | YES | - |
| `metodo_depreciacao` | text | YES | 'LINEAR'::text |
| `valor_contabil_atual` | numeric | YES | - |
| `depreciacao_acumulada` | numeric | YES | 0.00 |
| `funcionario_responsavel_id` | uuid | YES | - |
| `nota_fiscal_aquisicao` | text | YES | - |
| `numero_serie` | text | YES | - |
| `validade_garantia` | date | YES | - |
| `notas_manutencao` | text | YES | - |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |
| `cep` | character varying | YES | - |
| `logradouro` | text | YES | - |
| `numero` | character varying | YES | - |
| `complemento` | character varying | YES | - |
| `bairro` | character varying | YES | - |
| `cidade` | character varying | YES | - |
| `estado` | character varying | YES | - |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `funcionario_responsavel_id` | `employees` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `asset_depreciations` | `ativo_id` | `id` |
| `asset_transfers` | `ativo_id` | `id` |
| `asset_maintenances` | `asset_id` | `id` |
| `inventory_items` | `ativo_id` | `id` |
| `inventory_adjustments` | `asset_id` | `id` |

---

## Tabela: `audit_logs`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `usuario_id` | uuid | YES | - |
| `nome_usuario` | character varying | NO | - |
| `acao` | character varying | NO | - |
| `entidade` | character varying | NO | - |
| `id_entidade` | uuid | YES | - |
| `nome_entidade` | character varying | YES | - |
| `data_acao` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `endereco_ip` | inet | YES | - |
| `details` | jsonb | YES | - |
| `success` | boolean | YES | true |
| `hash` | character varying | YES | - |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `usuario_id` | `users` | `id` |

---

## Tabela: `bank_reconciliations`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `conta_bancaria_id` | uuid | YES | - |
| `nome_conta_bancaria` | character varying | YES | - |
| `nome_banco` | character varying | YES | - |
| `data_inicio` | date | NO | - |
| `data_final` | date | NO | - |
| `saldo_inicial` | numeric | YES | 0 |
| `saldo_final` | numeric | YES | 0 |
| `saldo_conciliado` | numeric | YES | 0 |
| `diferenca` | numeric | YES | 0 |
| `status` | character varying | YES | 'IN_PROGRESS'::character varying |
| `percentual_conciliacao` | numeric | YES | 0 |
| `total_transacoes_banco` | integer | YES | 0 |
| `total_transacoes_sistema` | integer | YES | 0 |
| `transacoes_conciliadas` | integer | YES | 0 |
| `transacoes_nao_conciliadas` | integer | YES | 0 |
| `divergencias` | jsonb | YES | '[]'::jsonb |
| `conciliado_por` | character varying | YES | - |
| `data_conciliacao` | timestamp with time zone | YES | - |
| `observacoes` | text | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `conta_bancaria_id` | `financial_accounts` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `bank_statement_transactions` | `reconciliation_id` | `id` |

---

## Tabela: `bank_statement_transactions`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `reconciliation_id` | uuid | YES | - |
| `bank_account_id` | uuid | YES | - |
| `data_transacao` | date | NO | - |
| `descricao` | text | NO | - |
| `valor` | numeric | NO | - |
| `tipo` | character varying | NO | - |
| `metodo_pagamento` | character varying | YES | - |
| `status_conciliacao` | character varying | YES | 'PENDING'::character varying |
| `transacao_id` | uuid | YES | - |
| `origem` | character varying | YES | 'BANK_STATEMENT'::character varying |
| `id_externo` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `reconciliation_id` | `bank_reconciliations` | `id` |
| `bank_account_id` | `financial_accounts` | `id` |
| `transacao_id` | `transactions` | `id` |

---

## Tabela: `cash_closings`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `id_conta` | uuid | NO | - |
| `data_fechamento` | date | NO | - |
| `saldo_inicial` | numeric | NO | - |
| `total_entradas` | numeric | NO | - |
| `total_saidas` | numeric | NO | - |
| `saldo_esperado` | numeric | NO | - |
| `saldo_real` | numeric | NO | - |
| `diferenca` | numeric | NO | - |
| `situacao` | character varying | YES | 'OPEN'::character varying |
| `observacoes` | text | YES | - |
| `fechado_por` | uuid | YES | - |
| `fechado` | timestamp with time zone | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `id_conta` | `financial_accounts` | `id` |
| `fechado_por` | `users` | `id` |

---

## Tabela: `cash_movements`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `account_id` | uuid | NO | - |
| `tipo` | character varying | NO | - |
| `valor` | numeric | NO | - |
| `motivo` | text | NO | - |
| `numero_documento` | character varying | YES | - |
| `responsavel` | uuid | NO | - |
| `autorizado_por` | uuid | YES | - |
| `observacoes` | text | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `account_id` | `financial_accounts` | `id` |
| `responsavel` | `users` | `id` |
| `autorizado_por` | `users` | `id` |

---

## Tabela: `categories`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | YES | - |
| `nome_categoria` | text | NO | - |
| `tipo_categoria` | text | NO | - |
| `categoria_pai_id` | uuid | YES | - |
| `cor` | text | YES | '#6366f1'::text |
| `icone` | text | YES | - |
| `descricao` | text | YES | - |
| `esta_ativa` | boolean | YES | true |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `categoria_pai_id` | `categories` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `categories` | `categoria_pai_id` | `id` |

---

## Tabela: `chart_of_accounts`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `codigo` | character varying | NO | - |
| `nome` | character varying | NO | - |
| `natureza` | USER-DEFINED | NO | - |
| `type` | USER-DEFINED | NO | - |
| `parent_id` | uuid | YES | - |
| `saldo_normal` | USER-DEFINED | NO | - |
| `esta_ativo` | boolean | YES | true |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `parent_id` | `chart_of_accounts` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `chart_of_accounts` | `parent_id` | `id` |
| `account_balances` | `id_conta` | `id` |

---

## Tabela: `church_events`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `titulo` | character varying | NO | - |
| `descricao` | text | YES | - |
| `data_evento` | date | NO | - |
| `hora_evento` | time without time zone | NO | - |
| `local_evento` | character varying | NO | - |
| `quantidade_presentes` | integer | YES | 0 |
| `type` | USER-DEFINED | NO | - |
| `recorrente` | boolean | YES | false |
| `padrao_recorrencia` | USER-DEFINED | YES | 'NONE'::recurrence_pattern |
| `data_fim_recorrencia` | date | YES | - |
| `evento_pai_id` | uuid | YES | - |
| `evento_gerado` | boolean | YES | false |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `evento_pai_id` | `church_events` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `church_events` | `evento_pai_id` | `id` |
| `volunteer_schedules` | `evento_id` | `id` |

---

## Tabela: `dependents`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_membro` | uuid | NO | - |
| `nome` | character varying | NO | - |
| `data_nascimento` | date | YES | - |
| `parentesco` | character varying | NO | - |
| `cpf` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_membro` | `membros` | `id` |

---

## Tabela: `employee_dependents`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_funcionario` | uuid | YES | - |
| `nome` | text | NO | - |
| `data_nascimento` | date | YES | - |
| `parentesco` | text | YES | - |
| `cpf` | text | YES | - |
| `estudante` | boolean | YES | false |
| `dependencia_irrf` | boolean | YES | true |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_funcionario` | `employees` | `id` |

---

## Tabela: `employee_leaves`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `id_funcionario` | uuid | NO | - |
| `nome_funcionario` | character varying | NO | - |
| `tipo` | character varying | NO | - |
| `data_inicio` | date | NO | - |
| `data_final` | date | NO | - |
| `cid10` | character varying | YES | - |
| `nome_medico` | character varying | YES | - |
| `crm` | character varying | YES | - |
| `situacao` | character varying | YES | 'SCHEDULED'::character varying |
| `observacoes` | text | YES | - |
| `url_anexo` | text | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

---

## Tabela: `employees`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_unidade` | uuid | YES | - |
| `nome` | text | NO | - |
| `cpf` | text | NO | - |
| `rg` | text | YES | - |
| `ctps` | text | YES | - |
| `ctps_serie` | text | YES | - |
| `pis` | text | YES | - |
| `birth_date` | date | YES | - |
| `sexo` | text | YES | - |
| `estado_civil` | text | YES | - |
| `blood_type` | text | YES | - |
| `email` | text | YES | - |
| `telefone` | text | YES | - |
| `celular` | text | YES | - |
| `emergency_contact` | text | YES | - |
| `naturalidade` | text | YES | - |
| `escolaridade` | text | YES | - |
| `raca_cor` | text | YES | - |
| `nome_mae` | text | YES | - |
| `nome_pai` | text | YES | - |
| `deficiencia` | text | YES | - |
| `deficiencia_obs` | text | YES | - |
| `avatar` | text | YES | - |
| `observacoes_saude` | text | YES | - |
| `cep` | text | YES | - |
| `logradouro` | text | YES | - |
| `numero` | text | YES | - |
| `complemento` | text | YES | - |
| `bairro` | text | YES | - |
| `cidade` | text | YES | - |
| `estado` | text | YES | - |
| `address_country` | text | YES | - |
| `matricula` | text | YES | - |
| `cargo` | text | YES | - |
| `funcao` | text | YES | - |
| `departamento` | text | YES | - |
| `cbo` | text | YES | - |
| `data_admissao` | date | YES | - |
| `data_demissao` | date | YES | - |
| `tipo_contrato` | text | YES | - |
| `regime_trabalho` | text | YES | - |
| `sindicato` | text | YES | - |
| `convencao_coletiva` | text | YES | - |
| `salario_base` | numeric | YES | - |
| `tipo_salario` | text | YES | - |
| `forma_pagamento` | text | YES | - |
| `dia_pagamento` | text | YES | - |
| `jornada_trabalho` | text | YES | - |
| `escala_trabalho` | text | YES | - |
| `horario_entrada` | time without time zone | YES | - |
| `horario_saida` | time without time zone | YES | - |
| `inicio_intervalo` | time without time zone | YES | - |
| `fim_intervalo` | time without time zone | YES | - |
| `duracao_intervalo` | time without time zone | YES | - |
| `segunda_a_sexta` | text | YES | - |
| `sabado` | text | YES | - |
| `trabalha_feriados` | boolean | YES | false |
| `controla_intervalo` | boolean | YES | false |
| `horas_extras_autorizadas` | boolean | YES | false |
| `tipo_registro_ponto` | text | YES | - |
| `tolerancia_ponto` | text | YES | - |
| `codigo_horario` | text | YES | - |
| `banco` | text | YES | - |
| `codigo_banco` | text | YES | - |
| `agencia` | text | YES | - |
| `conta` | text | YES | - |
| `tipo_conta` | text | YES | - |
| `titular` | text | YES | - |
| `chave_pix` | text | YES | - |
| `vt_ativo` | boolean | YES | false |
| `vt_valor_diario` | numeric | YES | - |
| `vt_qtd_vales_dia` | integer | YES | - |
| `vale_transporte_total` | numeric | YES | - |
| `va_ativo` | boolean | YES | false |
| `va_operadora` | text | YES | - |
| `vale_alimentacao` | numeric | YES | - |
| `vr_ativo` | boolean | YES | false |
| `vr_operadora` | text | YES | - |
| `vale_refeicao` | numeric | YES | - |
| `ps_ativo` | boolean | YES | false |
| `ps_operadora` | text | YES | - |
| `ps_tipo_plano` | text | YES | - |
| `ps_carteirinha` | text | YES | - |
| `plano_saude_colaborador` | numeric | YES | - |
| `ps_dependentes_ativo` | boolean | YES | false |
| `plano_saude_dependentes` | numeric | YES | - |
| `po_ativo` | boolean | YES | false |
| `po_operadora` | text | YES | - |
| `po_carteirinha` | text | YES | - |
| `plano_odontologico` | numeric | YES | - |
| `auxilio_moradia` | numeric | YES | - |
| `vale_farmacia` | numeric | YES | - |
| `seguro_vida` | numeric | YES | - |
| `auxilio_creche` | numeric | YES | - |
| `auxilio_educacao` | numeric | YES | - |
| `gympass_plano` | text | YES | - |
| `titulo_eleitor` | text | YES | - |
| `titulo_eleitor_zona` | text | YES | - |
| `titulo_eleitor_secao` | text | YES | - |
| `reservista` | text | YES | - |
| `cnh_numero` | text | YES | - |
| `cnh_categoria` | text | YES | - |
| `cnh_vencimento` | date | YES | - |
| `aso_data` | date | YES | - |
| `esocial_categoria` | text | YES | - |
| `esocial_matricula` | text | YES | - |
| `esocial_natureza_atividade` | text | YES | - |
| `esocial_tipo_regime_prev` | text | YES | - |
| `esocial_tipo_regime_trab` | text | YES | - |
| `esocial_indicativo_admissao` | text | YES | - |
| `esocial_tipo_jornada` | text | YES | - |
| `esocial_descricao_jornada` | text | YES | - |
| `esocial_contrato_parcial` | boolean | YES | false |
| `esocial_teletrabalho` | boolean | YES | false |
| `esocial_clausula_asseguratoria` | boolean | YES | false |
| `esocial_sucessao_trab` | boolean | YES | false |
| `esocial_tipo_admissao` | text | YES | - |
| `esocial_cnpj_anterior` | text | YES | - |
| `esocial_matricula_anterior` | text | YES | - |
| `esocial_data_admissao_origem` | date | YES | - |
| `ativo` | boolean | YES | true |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |
| `created_by` | uuid | YES | - |
| `dados_perfil` | jsonb | YES | '{}'::jsonb |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `users` | `id_funcionario` | `id` |
| `employee_dependents` | `id_funcionario` | `id` |
| `assets` | `funcionario_responsavel_id` | `id` |
| `payroll` | `id_funcionario` | `id` |
| `payroll_calculations` | `id_funcionario` | `id` |
| `lgpd_consent_logs` | `id_funcionario` | `id` |
| `performance_evaluations` | `id_funcionario` | `id` |
| `pdi_plans` | `id_funcionario` | `id` |

---

## Tabela: `events`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | gen_random_uuid() |
| `unit_id` | uuid | YES | - |
| `titulo` | text | NO | - |
| `descricao` | text | YES | - |
| `data_evento` | date | NO | - |
| `hora_evento` | text | YES | - |
| `data_final` | date | YES | - |
| `hora_fim` | text | YES | - |
| `local_evento` | text | YES | - |
| `tipo_evento` | text | YES | 'SERVICE'::text |
| `situacao` | text | YES | 'SCHEDULED'::text |
| `maximo_presentes` | integer | YES | - |
| `quantidade_presentes` | integer | YES | 0 |
| `publico` | boolean | YES | true |
| `criado_por` | uuid | YES | - |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `criado_por` | `users` | `id` |

---

## Tabela: `financial_accounts`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `nome` | character varying | NO | - |
| `tipo` | USER-DEFINED | NO | - |
| `saldo_atual` | numeric | YES | 0 |
| `saldo_minimo` | numeric | YES | - |
| `situacao` | USER-DEFINED | YES | 'ACTIVE'::account_status_type |
| `codigo_banco` | character varying | YES | - |
| `numero_agencia` | character varying | YES | - |
| `numero_conta` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `cash_closings` | `id_conta` | `id` |
| `cash_movements` | `account_id` | `id` |
| `treasury_cash_flows` | `id_conta` | `id` |
| `treasury_alerts` | `id_conta` | `id` |
| `bank_reconciliations` | `conta_bancaria_id` | `id` |
| `bank_statement_transactions` | `bank_account_id` | `id` |

---

## Tabela: `inventory_adjustments`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `contagem_estoque_id` | uuid | NO | - |
| `asset_id` | uuid | NO | - |
| `unit_id` | uuid | NO | - |
| `tipo_ajuste` | character varying | NO | - |
| `quantidade` | integer | NO | - |
| `motivo` | text | NO | - |
| `justificativa` | text | NO | - |
| `aprovado_por` | character varying | YES | - |
| `lancamento_contabil` | boolean | YES | false |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `contagem_estoque_id` | `inventory_counts` | `id` |
| `asset_id` | `assets` | `id` |
| `unit_id` | `units` | `id` |

---

## Tabela: `inventory_counts`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `data_contagem` | date | NO | - |
| `contagem_por` | character varying | NO | - |
| `revisado_por` | character varying | YES | - |
| `situacao` | character varying | YES | 'EM_ANDAMENTO'::character varying |
| `total_ativos` | integer | YES | 0 |
| `total_esperado` | integer | YES | 0 |
| `total_encontrado` | integer | YES | 0 |
| `diferenca_total` | integer | YES | 0 |
| `percentual_conclusao` | numeric | YES | 0 |
| `iniciado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `concluido` | timestamp with time zone | YES | - |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `inventory_items` | `contagem_estoque_id` | `id` |
| `inventory_adjustments` | `contagem_estoque_id` | `id` |

---

## Tabela: `inventory_items`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `contagem_estoque_id` | uuid | NO | - |
| `ativo_id` | uuid | NO | - |
| `nome_ativo` | character varying | NO | - |
| `categoria` | USER-DEFINED | NO | - |
| `quantidade_esperada` | integer | NO | - |
| `quantidade_contada` | integer | NO | - |
| `diferenca` | integer | NO | - |
| `condicao` | character varying | NO | - |
| `location` | character varying | YES | - |
| `observacoes` | text | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `contagem_estoque_id` | `inventory_counts` | `id` |
| `ativo_id` | `assets` | `id` |

---

## Tabela: `lgpd_consent_logs`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_membro` | uuid | YES | - |
| `id_funcionario` | uuid | YES | - |
| `politica_id` | uuid | NO | - |
| `tipo_consentimento` | character varying | NO | - |
| `granted` | boolean | NO | - |
| `endereco_ip` | inet | YES | - |
| `agente_usuario` | text | YES | - |
| `data_consentimento` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_membro` | `membros` | `id` |
| `id_funcionario` | `employees` | `id` |
| `politica_id` | `lgpd_policies` | `id` |

---

## Tabela: `lgpd_policies`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `versao` | character varying | NO | - |
| `titulo` | character varying | NO | - |
| `conteudo` | text | NO | - |
| `esta_ativa` | boolean | YES | true |
| `obrigatorio` | boolean | YES | true |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `lgpd_consent_logs` | `politica_id` | `id` |

---

## Tabela: `member_contributions`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_membro` | uuid | NO | - |
| `valor` | numeric | NO | - |
| `data_contribuicao` | date | NO | - |
| `tipo` | character varying | NO | - |
| `descricao` | text | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_membro` | `membros` | `id` |

---

## Tabela: `member_dependents`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_membro` | uuid | YES | - |
| `nome` | text | NO | - |
| `data_nascimento` | date | YES | - |
| `parentesco` | text | YES | - |
| `cpf` | text | YES | - |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_membro` | `membros` | `id` |

---

## Tabela: `membros`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_unidade` | uuid | YES | - |
| `nome` | text | NO | - |
| `cpf` | text | YES | - |
| `rg` | text | YES | - |
| `email` | text | YES | - |
| `telefone` | text | YES | - |
| `whatsapp` | text | YES | - |
| `data_nascimento` | date | YES | - |
| `sexo` | text | YES | - |
| `estado_civil` | text | YES | - |
| `logradouro` | text | YES | - |
| `bairro` | text | YES | - |
| `cidade` | text | YES | - |
| `estado` | text | YES | - |
| `cep` | text | YES | - |
| `data_conversao` | date | YES | - |
| `data_batismo` | text | YES | - |
| `data_membro` | date | YES | - |
| `status` | text | YES | 'ATIVO'::text |
| `funcao` | text | YES | - |
| `ministerio` | text | YES | - |
| `grupo_pequeno` | text | YES | - |
| `dizimista` | boolean | YES | true |
| `ofertante` | boolean | YES | true |
| `valor_dizimo` | numeric | YES | - |
| `observacoes` | text | YES | - |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |
| `dados_perfil` | jsonb | YES | '{}'::jsonb |
| `matricula` | character varying | YES | - |
| `profissao` | character varying | YES | - |
| `nome_conjuge` | character varying | YES | - |
| `data_casamento` | date | YES | - |
| `nome_pai` | character varying | YES | - |
| `nome_mae` | character varying | YES | - |
| `tipo_sanguineo` | character varying | YES | - |
| `contato_emergencia` | character varying | YES | - |
| `numero` | character varying | YES | - |
| `complemento` | character varying | YES | - |
| `local_conversao` | character varying | YES | - |
| `igreja_batismo` | character varying | YES | - |
| `pastor_batizador` | character varying | YES | - |
| `batismo_espirito_santo` | boolean | YES | false |
| `igreja_origem` | character varying | YES | - |
| `curso_discipulado` | character varying | YES | 'NAO_INICIADO'::character varying |
| `escola_biblica` | character varying | YES | 'INATIVO'::character varying |
| `ministerio_principal` | character varying | YES | - |
| `funcao_ministerio` | character varying | YES | - |
| `outros_ministerios` | ARRAY | YES | - |
| `cargo_eclesiastico` | character varying | YES | - |
| `data_consagracao` | date | YES | - |
| `ofertante_regular` | boolean | YES | false |
| `participa_campanhas` | boolean | YES | false |
| `banco` | character varying | YES | - |
| `agencia_bancaria` | character varying | YES | - |
| `conta_bancaria` | character varying | YES | - |
| `chave_pix` | character varying | YES | - |
| `necessidades_especiais` | text | YES | - |
| `talentos` | text | YES | - |
| `tags` | ARRAY | YES | - |
| `familia_id` | uuid | YES | - |
| `avatar` | text | YES | - |
| `cell_group` | character varying | YES | - |
| `dons_espirituais` | character varying | YES | - |
| `escolaridade` | character varying | YES | - |
| `is_pcd` | boolean | YES | false |
| `tipo_deficiencia` | character varying | YES | - |
| `celular` | character varying | YES | - |
| `lgpd_consent` | jsonb | YES | '{}'::jsonb |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `users` | `id_membro` | `id` |
| `member_contributions` | `id_membro` | `id` |
| `member_dependents` | `id_membro` | `id` |
| `transactions` | `id_membro` | `id` |
| `dependents` | `id_membro` | `id` |
| `lgpd_consent_logs` | `id_membro` | `id` |

---

## Tabela: `payroll`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | gen_random_uuid() |
| `unit_id` | uuid | YES | - |
| `id_funcionario` | uuid | YES | - |
| `month` | integer | NO | - |
| `year` | integer | NO | - |
| `data_referencia` | date | NO | - |
| `salario_base` | numeric | YES | 0 |
| `horas_extras_50` | numeric | YES | 0 |
| `horas_extras_100` | numeric | YES | 0 |
| `adicional_noturno` | numeric | YES | 0 |
| `insalubridade` | numeric | YES | 0 |
| `periculosidade` | numeric | YES | 0 |
| `comissoes` | numeric | YES | 0 |
| `gratificacoes` | numeric | YES | 0 |
| `outros_proventos` | numeric | YES | 0 |
| `inss` | numeric | YES | 0 |
| `irrf` | numeric | YES | 0 |
| `fgts` | numeric | YES | 0 |
| `pensao_alimenticia` | numeric | YES | 0 |
| `adiantamento` | numeric | YES | 0 |
| `faltas` | numeric | YES | 0 |
| `atrasos` | numeric | YES | 0 |
| `outras_deducoes` | numeric | YES | 0 |
| `total_proventos` | numeric | YES | 0 |
| `total_deducoes` | numeric | YES | 0 |
| `salario_liquido` | numeric | YES | 0 |
| `inss_patronal` | numeric | YES | 0 |
| `fgts_patronal` | numeric | YES | 0 |
| `rat` | numeric | YES | 0 |
| `terceiros` | numeric | YES | 0 |
| `total_encargos` | numeric | YES | 0 |
| `status` | text | YES | 'PROCESSED'::text |
| `processado_por` | uuid | YES | - |
| `processado` | timestamp with time zone | YES | - |
| `notes` | text | YES | - |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `id_funcionario` | `employees` | `id` |
| `processado_por` | `users` | `id` |

---

## Tabela: `payroll_calculations`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_funcionario` | uuid | NO | - |
| `mes_competencia` | character varying | NO | - |
| `salario_bruto` | numeric | NO | - |
| `salario_base` | numeric | NO | - |
| `horas_extras` | numeric | YES | 0 |
| `adicional_noturno` | numeric | YES | 0 |
| `insalubridade` | numeric | YES | 0 |
| `comissao` | numeric | YES | 0 |
| `bonificacoes` | numeric | YES | 0 |
| `salario_familia` | numeric | YES | 0 |
| `outros_proventos` | numeric | YES | 0 |
| `inss` | numeric | NO | - |
| `irrf` | numeric | NO | - |
| `fgts` | numeric | NO | - |
| `union` | numeric | YES | 0 |
| `plano_saude` | numeric | YES | 0 |
| `plano_odontologico` | numeric | YES | 0 |
| `vale_alimentacao` | numeric | YES | 0 |
| `vale_refeicao` | numeric | YES | 0 |
| `transporte` | numeric | YES | 0 |
| `pharmacy` | numeric | YES | 0 |
| `life_insurance` | numeric | YES | 0 |
| `adiantamento` | numeric | YES | 0 |
| `consignado` | numeric | YES | 0 |
| `coparticipacao` | numeric | YES | 0 |
| `faltas` | numeric | YES | 0 |
| `atrasos` | numeric | YES | 0 |
| `pensao_alimenticia` | numeric | YES | 0 |
| `outras_deducoes` | numeric | YES | 0 |
| `total_proventos` | numeric | NO | - |
| `total_descontos` | numeric | NO | - |
| `salario_liquido` | numeric | NO | - |
| `custo_empregador` | numeric | NO | - |
| `base_inss` | numeric | NO | - |
| `aliquota_inss` | numeric | NO | - |
| `valor_inss` | numeric | NO | - |
| `base_irrf` | numeric | NO | - |
| `aliquota_irrf` | numeric | NO | - |
| `deducao_irrf` | numeric | NO | - |
| `valor_irrf` | numeric | NO | - |
| `base_fgts` | numeric | NO | - |
| `aliquota_fgts` | numeric | NO | - |
| `valor_fgts` | numeric | NO | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_funcionario` | `employees` | `id` |

---

## Tabela: `payroll_periods`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_unidade` | uuid | NO | - |
| `mes` | integer | NO | - |
| `ano` | integer | NO | - |
| `situacao` | character varying | YES | 'OPEN'::character varying |
| `data_inicio` | date | NO | - |
| `data_final` | date | NO | - |
| `processado` | timestamp with time zone | YES | - |
| `fechado` | timestamp with time zone | YES | - |
| `total_funcionarios` | integer | YES | 0 |
| `total_folha` | numeric | YES | 0 |
| `total_inss` | numeric | YES | 0 |
| `total_fgts` | numeric | YES | 0 |
| `total_irrf` | numeric | YES | 0 |
| `criado_por` | uuid | NO | - |
| `observacoes` | text | YES | - |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |
| `criado_por` | `users` | `id` |

---

## Tabela: `pdi_plans`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `id_funcionario` | uuid | NO | - |
| `nome_funcionario` | character varying | NO | - |
| `meta` | text | NO | - |
| `prazo` | date | YES | - |
| `situacao` | character varying | YES | 'PENDENTE'::character varying |
| `observacoes` | text | YES | - |
| `created_by` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `id_funcionario` | `employees` | `id` |

---

## Tabela: `performance_evaluations`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `id_funcionario` | uuid | NO | - |
| `nome_funcionario` | character varying | NO | - |
| `data_avaliacao` | date | NO | - |
| `tipo_avaliacao` | character varying | NO | 'ANNUAL'::character varying |
| `nota_geral` | numeric | YES | 0 |
| `conceito_geral` | character varying | YES | 'SATISFACTORY'::character varying |
| `competencias` | jsonb | YES | '[]'::jsonb |
| `metas` | jsonb | YES | '[]'::jsonb |
| `pontos_fortes` | text | YES | - |
| `melhorias` | text | YES | - |
| `plano_acao` | text | YES | - |
| `status` | character varying | YES | 'DRAFT'::character varying |
| `avaliado_por` | character varying | YES | - |
| `aprovado_por` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |
| `id_funcionario` | `employees` | `id` |

---

## Tabela: `permission_modules`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `codigo` | character varying | NO | - |
| `nome_modulo` | character varying | NO | - |
| `categoria` | character varying | NO | - |
| `descricao` | text | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `user_permissions` | `codigo_modulo` | `codigo` |

---

## Tabela: `role_permissions`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | gen_random_uuid() |
| `funcao` | text | NO | - |
| `recurso` | text | NO | - |
| `ler` | boolean | YES | false |
| `escrever` | boolean | YES | false |
| `excluir` | boolean | YES | false |
| `administrador` | boolean | YES | false |
| `codigo_modulo` | character varying | YES | - |
| `gerenciar` | boolean | YES | false |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

---

## Tabela: `schema_migrations`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `version` | character varying | NO | - |
| `applied_at` | timestamp with time zone | NO | now() |

---

## Tabela: `system_logs`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | gen_random_uuid() |
| `id_unidade` | uuid | YES | - |
| `usuario_id` | uuid | YES | - |
| `acao` | text | NO | - |
| `tipo_recurso` | text | YES | - |
| `id_recurso` | uuid | YES | - |
| `valores_anteriores` | jsonb | YES | - |
| `valores_novos` | jsonb | YES | - |
| `endereco_ip` | text | YES | - |
| `agente_usuario` | text | YES | - |
| `criado` | timestamp with time zone | YES | now() |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |
| `usuario_id` | `users` | `id` |

---

## Tabela: `tax_configs`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `faixa_inss` | jsonb | NO | - |
| `faixa_irrf` | jsonb | NO | - |
| `taxa_fgts` | numeric | NO | 8.0 |
| `taxa_patronal` | numeric | YES | - |
| `taxa_rat` | numeric | YES | - |
| `terceiros_rate` | numeric | YES | - |
| `va_default` | numeric | YES | - |
| `vr_default` | numeric | YES | - |
| `entidades_terceiras` | jsonb | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

---

## Tabela: `transactions`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | gen_random_uuid() |
| `id_unidade` | uuid | YES | - |
| `descricao` | text | NO | - |
| `valor` | numeric | NO | - |
| `tipo_transacao` | text | NO | - |
| `id_conta` | uuid | YES | - |
| `data_transacao` | date | NO | - |
| `data_vencimento` | date | YES | - |
| `data_pagamento` | date | YES | - |
| `situacao` | text | YES | 'PAID'::text |
| `forma_pagamento` | text | YES | - |
| `categoria` | text | YES | - |
| `centro_custo` | text | YES | - |
| `natureza_operacao` | text | YES | - |
| `nome_fornecedor` | text | YES | - |
| `id_membro` | uuid | YES | - |
| `conciliado` | boolean | YES | false |
| `observacoes` | text | YES | - |
| `created_by` | uuid | YES | - |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |
| `data_competencia` | date | YES | - |
| `projeto_id` | uuid | YES | - |
| `valor_pago` | numeric | YES | 0 |
| `valor_restante` | numeric | YES | - |
| `parcelado` | boolean | YES | false |
| `numero_parcela` | integer | YES | - |
| `total_parcelas` | integer | YES | - |
| `id_transacao_origem` | uuid | YES | - |
| `data_conciliacao` | date | YES | - |
| `id_externo` | character varying | YES | - |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |
| `id_conta` | `accounts` | `id` |
| `id_membro` | `membros` | `id` |
| `created_by` | `users` | `id` |
| `id_transacao_origem` | `transactions` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `accounting_entries` | `transaction_id` | `id` |
| `bank_statement_transactions` | `transacao_id` | `id` |
| `transactions` | `id_transacao_origem` | `id` |

---

## Tabela: `treasury_alerts`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_unidade` | uuid | NO | - |
| `tipo_alerta` | character varying | NO | - |
| `titulo_alerta` | character varying | NO | - |
| `descricao_alerta` | text | NO | - |
| `nivel_gravidade` | character varying | NO | - |
| `id_conta` | uuid | YES | - |
| `investimento_id` | uuid | YES | - |
| `emprestimo_id` | uuid | YES | - |
| `valor_alerta` | numeric | YES | - |
| `data_limite_alerta` | date | YES | - |
| `situacao` | character varying | YES | 'ATIVO'::character varying |
| `acoes_sugeridas` | jsonb | YES | '[]'::jsonb |
| `criado_por` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |
| `id_conta` | `financial_accounts` | `id` |
| `investimento_id` | `treasury_investments` | `id` |
| `emprestimo_id` | `treasury_loans` | `id` |

---

## Tabela: `treasury_cash_flows`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `id_unidade` | uuid | NO | - |
| `data_movimento` | date | NO | - |
| `descricao_movimento` | text | NO | - |
| `categoria_movimento` | character varying | NO | - |
| `valor_movimento` | numeric | NO | - |
| `tipo_movimento` | character varying | NO | - |
| `id_conta` | uuid | YES | - |
| `situacao` | character varying | YES | 'REALIZADO'::character varying |
| `observacoes_movimento` | text | YES | - |
| `criado_por` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |
| `id_conta` | `financial_accounts` | `id` |

---

## Tabela: `treasury_financial_positions`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `data` | date | NO | - |
| `ativo_total` | numeric | YES | 0 |
| `passivo_total` | numeric | YES | 0 |
| `patrimonio_liquido` | numeric | YES | 0 |
| `disponibilidades` | numeric | YES | 0 |
| `aplicacoes` | numeric | YES | 0 |
| `contas_receber` | numeric | YES | 0 |
| `estoques` | numeric | YES | 0 |
| `ativo_fixo` | numeric | YES | 0 |
| `fornecedores` | numeric | YES | 0 |
| `emprestimos` | numeric | YES | 0 |
| `outras_contas` | numeric | YES | 0 |
| `variacao_patrimonial` | numeric | YES | 0 |
| `variacao_percentual` | numeric | YES | 0 |
| `indicadores` | jsonb | YES | '{}'::jsonb |
| `detalhamento` | jsonb | YES | '[]'::jsonb |
| `created_by` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

---

## Tabela: `treasury_forecasts`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `data_inicio` | date | NO | - |
| `data_final` | date | NO | - |
| `tipo` | character varying | NO | - |
| `saldo_inicial` | numeric | YES | 0 |
| `entradas_previstas` | numeric | YES | 0 |
| `saidas_previstas` | numeric | YES | 0 |
| `saldo_final_previsto` | numeric | YES | 0 |
| `entradas_realizadas` | numeric | YES | 0 |
| `saidas_realizadas` | numeric | YES | 0 |
| `saldo_final_real` | numeric | YES | 0 |
| `precisao` | numeric | YES | 0 |
| `status` | character varying | YES | 'EM_ANDAMENTO'::character varying |
| `detalhes` | jsonb | YES | '[]'::jsonb |
| `criado_por` | character varying | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

---

## Tabela: `treasury_investments`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `nome` | character varying | NO | - |
| `tipo` | character varying | NO | - |
| `instituicao` | character varying | NO | - |
| `data_aplicacao` | date | NO | - |
| `data_vencimento` | date | YES | - |
| `valor_aplicado` | numeric | NO | - |
| `valor_atual` | numeric | NO | - |
| `rentabilidade_anual` | numeric | YES | 0 |
| `indexador` | character varying | YES | - |
| `status` | character varying | YES | 'ATIVO'::character varying |
| `observacoes` | text | YES | - |
| `rendimentos` | jsonb | YES | '[]'::jsonb |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `treasury_alerts` | `investimento_id` | `id` |

---

## Tabela: `treasury_loans`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `unit_id` | uuid | NO | - |
| `nome` | character varying | NO | - |
| `credor` | character varying | NO | - |
| `data_contratacao` | date | NO | - |
| `data_vencimento` | date | NO | - |
| `valor_original` | numeric | NO | - |
| `valor_saldo` | numeric | NO | - |
| `taxa_juros` | numeric | NO | - |
| `tipo_juros` | character varying | YES | 'MENSAL'::character varying |
| `total_parcelas` | integer | NO | - |
| `parcelas_pagas` | integer | YES | 0 |
| `status` | character varying | YES | 'ATIVO'::character varying |
| `parcelas` | jsonb | YES | '[]'::jsonb |
| `observacoes` | text | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `unit_id` | `units` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `treasury_alerts` | `emprestimo_id` | `id` |

---

## Tabela: `units`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `nome_unidade` | text | NO | - |
| `cnpj` | text | YES | - |
| `endereco` | text | YES | - |
| `bairro` | text | YES | - |
| `cidade` | text | YES | - |
| `estado` | text | YES | - |
| `cep` | text | YES | - |
| `country` | text | YES | 'BR'::text |
| `telefone` | text | YES | - |
| `email` | text | YES | - |
| `website` | text | YES | - |
| `pastor_name` | text | YES | - |
| `pastor_phone` | text | YES | - |
| `sede` | boolean | YES | false |
| `status` | text | YES | 'ACTIVE'::text |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |
| `criado_por` | uuid | YES | - |
| `endereco_linha1` | text | YES | - |
| `endereco_linha2` | text | YES | - |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `users` | `id_unidade` | `id` |
| `financial_accounts` | `unit_id` | `id` |
| `employees` | `id_unidade` | `id` |
| `membros` | `id_unidade` | `id` |
| `assets` | `unit_id` | `id` |
| `accounts` | `id_unidade` | `id` |
| `categories` | `unit_id` | `id` |
| `transactions` | `id_unidade` | `id` |
| `payroll` | `unit_id` | `id` |
| `system_logs` | `id_unidade` | `id` |
| `events` | `unit_id` | `id` |
| `church_events` | `unit_id` | `id` |
| `asset_depreciations` | `unit_id` | `id` |
| `asset_transfers` | `unidade_origem_id` | `id` |
| `asset_transfers` | `unidade_destino_id` | `id` |
| `asset_maintenances` | `unit_id` | `id` |
| `inventory_counts` | `unit_id` | `id` |
| `inventory_adjustments` | `unit_id` | `id` |
| `chart_of_accounts` | `unit_id` | `id` |
| `accounting_entries` | `unit_id` | `id` |
| `cash_closings` | `unit_id` | `id` |
| `cash_movements` | `unit_id` | `id` |
| `payroll_periods` | `id_unidade` | `id` |
| `audit_logs` | `unit_id` | `id` |
| `tax_configs` | `unit_id` | `id` |
| `accounting_configs` | `unit_id` | `id` |
| `treasury_loans` | `unit_id` | `id` |
| `lgpd_policies` | `unit_id` | `id` |
| `treasury_cash_flows` | `id_unidade` | `id` |
| `treasury_forecasts` | `unit_id` | `id` |
| `treasury_investments` | `unit_id` | `id` |
| `treasury_alerts` | `id_unidade` | `id` |
| `treasury_financial_positions` | `unit_id` | `id` |
| `bank_reconciliations` | `unit_id` | `id` |
| `bank_statement_transactions` | `unit_id` | `id` |
| `performance_evaluations` | `unit_id` | `id` |
| `pdi_plans` | `unit_id` | `id` |

---

## Tabela: `user_permissions`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `user_id` | uuid | NO | - |
| `codigo_modulo` | character varying | NO | - |
| `can_read` | boolean | YES | - |
| `can_write` | boolean | YES | - |
| `can_delete` | boolean | YES | - |
| `can_manage` | boolean | YES | - |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |
| `atualizado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `user_id` | `users` | `id` |
| `codigo_modulo` | `permission_modules` | `codigo` |

---

## Tabela: `users`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `email` | text | NO | - |
| `hash_senha` | text | NO | - |
| `nome_usuario` | text | NO | - |
| `role` | text | NO | - |
| `id_unidade` | uuid | YES | - |
| `id_funcionario` | uuid | YES | - |
| `id_membro` | uuid | YES | - |
| `esta_ativo` | boolean | YES | true |
| `ultimo_login` | timestamp with time zone | YES | - |
| `criado` | timestamp with time zone | YES | now() |
| `atualizado` | timestamp with time zone | YES | now() |
| `criado_por` | uuid | YES | - |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `id_unidade` | `units` | `id` |
| `id_funcionario` | `employees` | `id` |
| `id_membro` | `membros` | `id` |

### Referenciada por

| Tabela Origem | Coluna Origem | Coluna Local |
| :--- | :--- | :--- |
| `transactions` | `created_by` | `id` |
| `payroll` | `processado_por` | `id` |
| `system_logs` | `usuario_id` | `id` |
| `events` | `criado_por` | `id` |
| `cash_closings` | `fechado_por` | `id` |
| `cash_movements` | `responsavel` | `id` |
| `cash_movements` | `autorizado_por` | `id` |
| `payroll_periods` | `criado_por` | `id` |
| `audit_logs` | `usuario_id` | `id` |
| `user_permissions` | `user_id` | `id` |
| `app_user_permissions` | `usuario_id` | `id` |

---

## Tabela: `volunteer_schedules`

### Colunas

| Coluna | Tipo | Nulo | Padrão |
| :--- | :--- | :--- | :--- |
| `id` | uuid | NO | uuid_generate_v4() |
| `evento_id` | uuid | NO | - |
| `ministerio` | character varying | NO | - |
| `funcao` | character varying | NO | - |
| `voluntario_id` | uuid | YES | - |
| `nome_voluntario` | character varying | YES | - |
| `telefone_voluntario` | character varying | YES | - |
| `email_voluntario` | character varying | YES | - |
| `confirmado` | boolean | YES | false |
| `observacoes` | text | YES | - |
| `quantidade_necessaria` | integer | NO | 1 |
| `quantidade_atribuida` | integer | YES | 0 |
| `criado` | timestamp with time zone | YES | CURRENT_TIMESTAMP |

### Relacionamentos (Chaves Estrangeiras)

| Coluna Local | Tabela Estrangeira | Coluna Estrangeira |
| :--- | :--- | :--- |
| `evento_id` | `church_events` | `id` |

---

