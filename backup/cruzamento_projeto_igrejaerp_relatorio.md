# Relatório de Cruzamento do Projeto IgrejaERP

## Arquivos analisados

### Projeto/API
- `api.zip`
- `igrejaerp.zip`

### Arquivos encontrados dentro do projeto
- `nomenclaturas_tabelas.md`
- `backup/igrejairp.sql`

### Arquivo NÃO encontrado
- `E:\igrejaerp\conversão.md`

O arquivo `conversão.md` não está presente nos arquivos enviados. Para um cruzamento completo, será necessário enviar esse arquivo.

---

# Estrutura identificada

## Banco de Dados
O arquivo `backup/igrejairp.sql` contém:

- 65 tabelas PostgreSQL identificadas
- tabelas financeiras
- tabelas de patrimônio
- tabelas de membros
- tabelas de funcionários
- módulos administrativos
- permissões
- auditoria
- eventos
- estoque
- tesouraria

---

# Cruzamento entre SQL e nomenclaturas_tabelas.md

## Estrutura validada

As tabelas abaixo possuem correspondência entre:

- SQL
- documentação
- rotas API
- interfaces TypeScript

### Financeiro
| SQL | API | Interface |
|---|---|---|
| `accounts` | `/api/accounts` | `ContaBancaria` |
| `financial_accounts` | `/api/accounts` | `ContaBancaria` |
| `cash_movements` | `/api/treasury/cash-movements` | `CashMovement` |
| `cash_closings` | `/api/treasury/cash-closings` | `CashClosing` |
| `bank_reconciliations` | `/api/reconciliation` | `BankReconciliation` |
| `bank_statement_transactions` | `/api/reconciliation/statement-transactions` | `BankStatementTransaction` |
| `accounting_entries` | `/api/treasury/accounting-entries` | `AccountingEntry` |
| `chart_of_accounts` | `/api/treasury/chart-of-accounts` | `ChartOfAccount` |

---

### Patrimônio
| SQL | API | Interface |
|---|---|---|
| `assets` | `/api/assets` | `Asset` |
| `asset_transfers` | `/api/assets/:id/transfers` | `AssetTransfer` |
| `asset_maintenances` | `/api/assets/:id/maintenances` | `AssetMaintenance` |
| `asset_depreciations` | `/api/assets/:id/depreciations` | `AssetDepreciation` |

---

### Funcionários
| SQL | API | Interface |
|---|---|---|
| `employees` | `/api/employees` | `Funcionario` |
| `employee_dependents` | `/api/employees/:id/dependents` | `Dependent` |
| `employee_leaves` | `/api/employees/:id/leaves` | `EmployeeLeave` |

---

### Membros
| SQL | API | Interface |
|---|---|---|
| `members` | `/api/members` | `Member` |
| `dependents` | `/api/members/:id/dependents` | `Dependent` |
| `member_contributions` | `/api/members/:id/contributions` | `MemberContribution` |

---

# Problemas encontrados

## 1. Duplicidade de tabelas

Foram identificadas tabelas duplicadas em português e inglês:

| Português | Inglês |
|---|---|
| `funcionarios` | `employees` |
| `dependentes` | `dependents` |
| `contas_financeiras` | `financial_accounts` |
| `eventos` | `events` |

### Impacto
- aumenta complexidade
- dificulta manutenção
- pode gerar inconsistência de dados
- aumenta risco em migrations
- dificulta padronização ORM/API

### Recomendação
Padronizar completamente:

OU
- tudo em português

OU
- tudo em inglês

Evitar sistema híbrido.

---

## 2. Inconsistência de nomenclatura

Exemplos:

| Encontrado | Problema |
|---|---|
| `contas_financeiras` | português |
| `financial_accounts` | inglês |
| `church_events` | inglês religioso |
| `events` | versão duplicada |

### Recomendação
Definir convenção única:

#### Opção recomendada
- banco: português
- APIs: inglês
- frontend: PascalCase

Exemplo:

| Camada | Padrão |
|---|---|
| SQL | `contas_financeiras` |
| API | `/api/financial-accounts` |
| TS Interface | `FinancialAccount` |

---

## 3. Rotas repetidas para tabelas diferentes

Foi identificado:

| Tabela | API |
|---|---|
| `accounts` | `/api/accounts` |
| `financial_accounts` | `/api/accounts` |
| `contas_financeiras` | `/api/accounts` |

### Risco
- conflito lógico
- retorno incorreto
- confusão no backend
- inconsistência ORM

### Recomendação
Separar claramente:

| Entidade | API sugerida |
|---|---|
| contas bancárias | `/api/bank-accounts` |
| contas contábeis | `/api/chart-of-accounts` |
| contas financeiras | `/api/financial-accounts` |

---

# Cruzamento com Frontend React

## Componentes encontrados

O frontend possui forte relação com:

- financeiro
- RH
- patrimônio
- tesouraria
- auditoria
- eventos
- fluxo de caixa
- folha de pagamento

### Componentes identificados

- `Financeiro.tsx`
- `ContasReceber.tsx`
- `ContasPagar.tsx`
- `FluxoCaixaProjetado.tsx`
- `FolhaPagamento.tsx`
- `Funcionarios.tsx`
- `Patrimonio.tsx`
- `Eventos.tsx`
- `Auditoria.tsx`

---

# Estrutura do sistema identificada

## Backend
Possui:

- Express
- PostgreSQL
- APIs REST
- rotas organizadas por módulo

## Frontend
Possui:

- React
- TypeScript
- componentes modulares

## Banco
Possui:

- estrutura financeira avançada
- controle patrimonial
- RH
- permissões
- auditoria
- tesouraria
- conciliação bancária
- estoque
- eventos

---

# Cruzamento Integrado com conversão.md

## Consolidação de nomenclaturas

O arquivo `conversão.md` confirmou que o projeto possui um ambiente híbrido:

- tabelas em português
- tabelas em inglês
- APIs parcialmente em inglês
- interfaces TypeScript parcialmente em português
- duplicidade estrutural

---

## Pares duplicados confirmados

| Inglês | Português | Situação Recomendada |
|---|---|---|
| `units` | `unidades` | manter `unidades` |
| `users` | `usuarios` | manter `usuarios` |
| `transactions` | `transacoes` | manter `transacoes` |
| `employees` | `funcionarios` | manter `funcionarios` |
| `dependents` | `dependentes` | manter `dependentes` |
| `financial_accounts` | `contas_financeiras` | manter `contas_financeiras` |
| `member_contributions` | `contribuicoes_membros` | manter `contribuicoes_membros` |

---

## Tabelas com maior risco estrutural

O cruzamento identificou tabelas críticas altamente referenciadas:

| Tabela | Risco |
|---|---|
| `units` | muito alto |
| `users` | muito alto |
| `employees` | muito alto |
| `transactions` | muito alto |
| `chart_of_accounts` | médio |
| `accounts` | médio |

Essas tabelas possuem:

- múltiplas FKs
- dependências no React
- dependências em interfaces TS
- dependências nas rotas Express
- dependências em views PostgreSQL

---

## Views dependentes identificadas

O arquivo `conversão.md` confirmou dependência das views:

- `active_employees`
- `active_members`
- `financial_summary`
- `asset_summary_by_unit`

### Impacto
Qualquer renomeação de tabela exigirá:

1. DROP VIEW
2. ALTER TABLE
3. atualização das FKs
4. recriação das views
5. atualização do backend
6. atualização do frontend

---

## Colunas problemáticas identificadas

### Palavras reservadas

| Coluna | Problema | Recomendação |
|---|---|---|
| `role` | reservada SQL | usar `perfil` |
| `value` | reservada SQL | usar `valor` |
| `key` | reservada SQL | usar `chave` |
| `order` | reservada SQL | usar `ordem` |
| `type` | conflito ORM | usar `tipo` |
| `status` | ambígua | usar `situacao` |
| `user` | reservada | usar `usuario` |

---

## Colunas híbridas confirmadas

O cruzamento detectou tabelas parcialmente traduzidas.

### Exemplo

#### `employees`

Mistura:

- `birth_date`
- `blood_type`
- `is_active`

com:

- `nome`
- `cpf`
- `cargo`
- `salario_base`

### Impacto
- aumenta complexidade ORM
- dificulta manutenção
- aumenta erros de tipagem TS
- aumenta erros em migrations

---

## Padrão recomendado consolidado

### Banco PostgreSQL

- português
- snake_case
- sem acentos

### Backend Express

- rotas em inglês
- DTOs padronizados
- services padronizados

### Frontend React/TypeScript

- interfaces em português
- camelCase
- sem acentos

---

## Estrutura recomendada

| Camada | Exemplo |
|---|---|
| SQL | `contas_financeiras` |
| API | `/api/financial-accounts` |
| TS Interface | `ContaFinanceira` |
| React State | `contasFinanceiras` |

---

## Interfaces TypeScript afetadas

O arquivo `conversão.md` confirmou necessidade de atualização de:

- `AccountingEntry`
- `Asset`
- `AssetTransfer`
- `AuditLog`
- `BankReconciliation`
- `Category`
- `ChartOfAccount`
- `ChurchEvent`
- `Dependent`
- `EmployeeLeave`
- `InventoryAdjustment`
- `Payroll`
- `TaxConfig`
- `TreasuryForecast`
- `VolunteerSchedule`

---

## Ordem técnica recomendada

### Fase 1
Baixo risco:

- treasury
- payroll
- inventory
- lgpd
- volunteer

### Fase 2
Dependências médias:

- cash
- bank
- employee_dependents
- member_dependents

### Fase 3
Intermediárias:

- categories
- chart_of_accounts
- permission_modules

### Fase 4
Maior risco:

- units
- users
- employees
- transactions

### Fase 5
Frontend/Backend:

- interfaces TS
- hooks React
- rotas Express
- repositories
- services
- queries SQL

---

## Recomendações adicionais após cruzamento

### Criar imediatamente

1. dicionário oficial de entidades
2. dicionário oficial de colunas
3. padronização única PT-BR
4. migrations oficiais
5. mapa de FKs
6. mapa de dependências React
7. mapa de rotas Express

---

## Recomendação arquitetural final

O cruzamento completo indica que o sistema já atingiu complexidade suficiente para exigir:

- arquitetura oficial de nomenclatura
- migrations controladas
- versionamento de banco
- padronização ORM
- documentação técnica centralizada
- remoção definitiva das duplicidades

---

# Conclusão Técnica

## Estado atual
O projeto possui:

- boa separação modular
- backend relativamente organizado
- frontend estruturado
- documentação parcial
- banco robusto

Porém existem problemas importantes:

- duplicidade de tabelas
- mistura PT/EN
- APIs compartilhadas para entidades diferentes
- inconsistência de nomenclatura
- ausência do arquivo `conversão.md`

---

# Recomendações prioritárias

## Alta prioridade

1. Padronizar nomenclaturas
2. Eliminar tabelas duplicadas
3. Revisar rotas repetidas
4. Criar dicionário oficial de entidades
5. Consolidar models/interfaces

---

## Próximo passo recomendado

Enviar:

- `conversão.md`

para realizar:

- cruzamento completo
- análise de migrations
- análise de compatibilidade
- detecção de conflitos estruturais
- análise de tabelas antigas vs novas
- validação de conversão PT → EN
- análise de impacto no frontend/backend


# Complemento do Cruzamento — Relação de Nomenclaturas por Tabela

## 📊 Relação Consolidada de Colunas ↔ Tabelas

Mantendo o padrão visual e estrutural do arquivo `conversão.md`, abaixo está o complemento com a identificação exata das tabelas relacionadas a cada nomenclatura.

### Grupo: IDs e Relacionamentos

| Coluna | Tabelas Relacionadas | Finalidade |
|---|---|---|
| `unit_id` | `employees`, `members`, `church_events`, `assets`, `transactions` | vínculo com unidades/filiais |
| `member_id` | `member_contributions`, `member_dependents`, `transactions` | vínculo com membros |
| `employee_id` | `employee_dependents`, `employee_leaves`, `payroll`, `performance_evaluations` | vínculo com funcionários |
| `asset_id` | `asset_depreciations`, `asset_maintenances`, `asset_transfers` | vínculo patrimonial |
| `account_id` | `transactions`, `cash_movements`, `bank_reconciliations` | vínculo financeiro |
| `user_id` | `audit_logs`, `user_permissions`, `system_logs`, `app_audit_logs` | auditoria/permissões |
| `transaction_id` | `accounting_entries`, `cash_movements` | integração financeira |
| `project_id` | `accounting_entries` | vínculo contábil/projeto |

---

### Grupo: Auditoria e Controle

| Coluna | Tabelas Relacionadas | Finalidade |
|---|---|---|
| `created_at` | praticamente todas as tabelas auditáveis | criação de registro |
| `updated_at` | praticamente todas as tabelas auditáveis | atualização de registro |
| `created_by` | `accounting_entries`, `audit_logs`, `transactions` | usuário criador |
| `deleted_at` | tabelas com soft delete | exclusão lógica |
| `is_active` | `employees`, `accounts`, `users`, `units` | status ativo/inativo |

---

### Grupo: Funcionários/RH

| Coluna | Tabela Pertencente | Tradução Recomendada |
|---|---|---|
| `birth_date` | `employees` | `data_nascimento` |
| `blood_type` | `employees` | `tipo_sanguineo` |
| `emergency_contact` | `employees` | `contato_emergencia` |
| `address_country` | `employees` | `pais` |
| `salary` | `employees` | `salario` |
| `role` | `employees`, `app_role_permissions` | `perfil` |

---

### Grupo: Financeiro/Contábil

| Coluna | Tabela Pertencente | Tradução Recomendada |
|---|---|---|
| `currency` | `accounts` | `moeda` |
| `agency` | `accounts` | `agencia` |
| `status` | `transactions`, `accounting_entries`, `employees` | `situacao` |
| `type` | `accounts`, `transactions`, `assets` | `tipo` |
| `complement` | `accounting_entries` | `complemento` |
| `debit_period` | `account_balances` | `debito_periodo` |
| `credit_period` | `account_balances` | `credito_periodo` |
| `period` | `account_balances` | `periodo` |

---

### Grupo: Sistema e Permissões

| Coluna | Tabela Pertencente | Tradução Recomendada |
|---|---|---|
| `name` | `permission_modules`, `categories`, `accounts` | `nome` |
| `description` | `permission_modules`, `church_events`, `categories` | `descricao` |
| `action` | `app_audit_logs` | `acao` |
| `success` | `app_audit_logs` | `sucesso` |
| `details` | `app_audit_logs` | `detalhes` |
| `key` | tabelas de configuração | `chave` |
| `value` | tabelas de configuração | `valor` |

---

### Grupo: Tabelas com Maior Dependência Estrutural

| Tabela | Colunas Críticas Relacionadas |
|---|---|
| `units` | `unit_id`, `created_at`, `updated_at` |
| `users` | `user_id`, `is_active`, `created_at` |
| `employees` | `employee_id`, `birth_date`, `role`, `status` |
| `transactions` | `transaction_id`, `account_id`, `status`, `type` |
| `accounts` | `account_id`, `currency`, `agency`, `type` |
| `chart_of_accounts` | `parent_id`, `type`, `status` |

---

### Observação Técnica

O cruzamento confirmou que diversas nomenclaturas são reutilizadas em múltiplas tabelas.

Por isso, a padronização deve ser feita:

1. primeiro nas tabelas principais
2. depois nas FKs
3. depois nas interfaces TS
4. depois no frontend React
5. por último nas views PostgreSQL

