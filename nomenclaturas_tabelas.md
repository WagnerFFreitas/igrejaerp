# Nomenclatura Completa: Tabelas, Colunas, APIs e Campos do Sistema (IgrejaERP)

Este documento foi gerado através da extração física das tabelas do banco de dados **PostgreSQL** ativo e mapeamento com as rotas de API Express (Backend) e as interfaces TypeScript (Frontend/Sistema).

---

## 📊 1. Visão Geral das Tabelas do Banco de Dados

| Nome da Tabela no PostgreSQL | Estado Atual | Tradução Sugerida (PT) | Rota da API (Backend) | Interface TypeScript |
| :--- | :---: | :--- | :--- | :--- |
| `account_balances` | 🇬🇧 Inglês | saldos_contas | `/api/treasury/balances` | `AccountBalance` |
| `accounting_configs` | 🇬🇧 Inglês | configuracoes_contabeis | `/api/treasury/configs` | `AccountingConfig` |
| `accounting_entries` | 🇬🇧 Inglês | lancamentos_contabeis | `/api/treasury/accounting-entries` | `AccountingEntry` |
| `accounts` | 🇬🇧 Inglês | contas | `/api/accounts` | `ContaBancaria` |
| `active_employees` | 👁️ View (Visão) | - | `/api/employees` | `Funcionario[] (View)` |
| `active_members` | 👁️ View (Visão) | - | `/api/members` | `Member[] (View)` |
| `app_audit_logs` | ⚙️ Sistema/Auxiliar | - | `/api/audit` | `AuditLog[]` |
| `app_permission_modules` | ⚙️ Sistema/Auxiliar | - | `/api/auth/permissions` | `PermissionModule[]` |
| `app_role_permissions` | ⚙️ Sistema/Auxiliar | - | `/api/auth/permissions` | `RolePermission[]` |
| `app_user_permissions` | ⚙️ Sistema/Auxiliar | - | `/api/auth/permissions` | `UserPermission[]` |
| `asset_depreciations` | 🇬🇧 Inglês | depreciacoes_ativos | `/api/assets/:id/depreciations` | `AssetDepreciation` |
| `asset_maintenances` | 🇬🇧 Inglês | manutencoes_ativos | `/api/assets/:id/maintenances` | `AssetMaintenance` |
| `asset_summary_by_unit` | 👁️ View (Visão) | - | `/api/assets/summary` | `AssetSummary (View)` |
| `asset_transfers` | 🇬🇧 Inglês | transferencias_ativos | `/api/assets/:id/transfers` | `AssetTransfer` |
| `assets` | 🇬🇧 Inglês | patrimonio | `/api/assets` | `Asset` |
| `audit_logs` | 🇬🇧 Inglês | logs_auditoria | `/api/audit` | `AuditLog` |
| `bank_reconciliations` | 🇬🇧 Inglês | conciliacoes_bancarias | `/api/reconciliation` | `BankReconciliation` |
| `bank_statement_transactions` | 🇬🇧 Inglês | transacoes_extrato_bancario | `/api/reconciliation/statement-transactions` | `BankStatementTransaction` |
| `cash_closings` | 🇬🇧 Inglês | fechamentos_caixa | `/api/treasury/cash-closings` | `CashClosing` |
| `cash_movements` | 🇬🇧 Inglês | movimentacoes_caixa | `/api/treasury/cash-movements` | `CashMovement` |
| `categories` | 🇬🇧 Inglês | categorias | `/api/categories` | `Category` |
| `chart_of_accounts` | 🇬🇧 Inglês | plano_contas | `/api/treasury/chart-of-accounts` | `ChartOfAccount` |
| `church_events` | 🇬🇧 Inglês | eventos | `/api/events` | `ChurchEvent` |
| `contas_financeiras` | 🇬🇧 Inglês | contas_financeiras | `/api/accounts` | `ContaBancaria` |
| `contribuicoes_membros` | 🇧🇷 Português | **Já traduzida** | `/api/members/:id/contributions` | `MemberContribution` |
| `dependentes` | 🇧🇷 Português | **Já traduzida** | `/api/members/:id/dependents` | `Dependent` |
| `dependents` | 🇬🇧 Inglês | dependentes | `/api/members/:id/dependents` | `Dependent` |
| `employee_dependents` | 🇬🇧 Inglês | dependentes_funcionarios | `/api/employees/:id/dependents` | `Dependent` |
| `employee_leaves` | 🇬🇧 Inglês | afastamentos | `/api/employees/:id/leaves` | `EmployeeLeave` |
| `employees` | 🇬🇧 Inglês | funcionarios | `/api/employees` | `Funcionario` |
| `events` | 🇬🇧 Inglês | eventos | `/api/events` | `ChurchEvent` |
| `financial_accounts` | 🇬🇧 Inglês | contas_financeiras | `/api/accounts` | `ContaBancaria` |
| `financial_summary` | 👁️ View (Visão) | - | `/api/treasury/summary` | `FinancialSummary (View)` |
| `funcionarios` | 🇬🇧 Inglês | - | `N/A` | `N/A` |
| `inventory_adjustments` | 🇬🇧 Inglês | ajustes_inventario | `/api/assets/inventory/adjustments` | `InventoryAdjustment` |
| `inventory_counts` | 🇬🇧 Inglês | contagens_inventario | `/api/assets/inventory/counts` | `InventoryCount` |
| `inventory_items` | 🇬🇧 Inglês | itens_inventario | `/api/assets/inventory/items` | `InventoryItem` |
| `lgpd_consent_logs` | 🇬🇧 Inglês | logs_consentimento_lgpd | `/api/lgpd/consent` | `LgpdConsentLog` |
| `lgpd_policies` | 🇬🇧 Inglês | politicas_lgpd | `/api/lgpd/policies` | `LgpdPolicy` |
| `member_contributions` | 🇬🇧 Inglês | contribuicoes_membros | `/api/members/:id/contributions` | `MemberContribution` |
| `member_dependents` | 🇬🇧 Inglês | dependentes_membros | `/api/members/:id/dependents` | `Dependent` |
| `membros` | 🇧🇷 Português | **Já traduzida** | `/api/members` | `Membro` |
| `payroll` | 🇬🇧 Inglês | folha_pagamento | `/api/payroll` | `Payroll` |
| `payroll_calculations` | 🇬🇧 Inglês | calculos_folha | `/api/payroll/calculations` | `PayrollCalculation` |
| `payroll_periods` | 🇬🇧 Inglês | periodos_folha | `/api/payroll/periods` | `PayrollPeriod` |
| `pdi_plans` | 🇬🇧 Inglês | planos_pdi | `/api/rh/pdi` | `PdiPlan` |
| `perfil_permissoes` | ⚙️ Sistema/Auxiliar | - | `/api/auth/permissions` | `PerfilPermissao` |
| `perfis` | 🇧🇷 Português | **Já traduzida** | `/api/auth/permissions` | `Perfil` |
| `performance_evaluations` | 🇬🇧 Inglês | avaliacoes_desempenho | `/api/rh/evaluations` | `PerformanceEvaluation` |
| `permission_modules` | 🇬🇧 Inglês | modulos_permissao | `/api/auth/permissions` | `PermissionModule` |
| `permissoes` | 🇧🇷 Português | **Já traduzida** | `/api/auth/permissions` | `Permissao` |
| `pessoas` | 🇧🇷 Português | **Já traduzida** | `/api/members` | `Pessoa` |
| `role_permissions` | 🇬🇧 Inglês | permissoes_perfil | `/api/auth/permissions` | `RolePermission` |
| `schema_migrations` | ⚙️ Controle | - | `Interna PostgreSQL` | `N/A` |
| `system_logs` | 🇬🇧 Inglês | logs_sistema | `/api/audit/system` | `SystemLog` |
| `tax_configs` | 🇬🇧 Inglês | configuracoes_tributarias | `/api/payroll/tax-configs` | `TaxConfig` |
| `transacoes` | 🇧🇷 Português | **Já traduzida** | `/api/transactions` | `Transacao` |
| `transactions` | 🇬🇧 Inglês | transacoes | `/api/transactions` | `Transacao` |
| `treasury_alerts` | 🇬🇧 Inglês | alertas_tesouraria | `/api/treasury/alerts` | `TreasuryAlert` |
| `treasury_cash_flows` | 🇬🇧 Inglês | fluxos_caixa_tesouraria | `/api/treasury/cash-flows` | `TreasuryCashFlow` |
| `treasury_financial_positions` | 🇬🇧 Inglês | posicoes_financeiras_tesouraria | `/api/treasury/positions` | `TreasuryFinancialPosition` |
| `treasury_forecasts` | 🇬🇧 Inglês | previsoes_tesouraria | `/api/treasury/forecasts` | `TreasuryForecast` |
| `treasury_investments` | 🇬🇧 Inglês | investimentos_tesouraria | `/api/treasury/investments` | `TreasuryInvestment` |
| `treasury_loans` | 🇬🇧 Inglês | emprestimos_tesouraria | `/api/treasury/loans` | `TreasuryLoan` |
| `unidades` | 🇧🇷 Português | **Já traduzida** | `/api/units` | `Unidade` |
| `units` | 🇬🇧 Inglês | unidades | `/api/units` | `Unidade` |
| `user_permissions` | 🇬🇧 Inglês | permissoes_usuario | `/api/auth/permissions` | `UserPermission` |
| `users` | 🇬🇧 Inglês | usuarios | `/api/users` | `Usuario` |
| `usuarios` | 🇧🇷 Português | **Já traduzida** | `/api/users` | `Usuario` |
| `usuarios_perfis` | ⚙️ Sistema/Auxiliar | - | `/api/auth/permissions` | `UsuarioPerfil` |
| `volunteer_schedules` | 🇬🇧 Inglês | escalas_voluntarios | `/api/events/:id/volunteers` | `VolunteerSchedule` |

---

## 🔍 2. Dicionário Detalhado: Colunas, Tipos, Mapeamentos e APIs

### 📋 Tabela: `account_balances`
* **Tradução da Tabela (PT):** `saldos_contas`
* **Rota da API (Backend):** `/api/treasury/balances`
* **Interface TypeScript (TS):** `AccountBalance`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/balances` |
| `id_conta` | `uuid` | `id_conta` | `idConta` | `/api/treasury/balances` |
| `nome_conta` | `character varying` | `-` | `nomeConta` | `/api/treasury/balances` |
| `codigo_conta` | `character varying` | `-` | `codigoConta` | `/api/treasury/balances` |
| `nature` | `USER-DEFINED` | `-` | `nature` | `/api/treasury/balances` |
| `period` | `character varying` | `-` | `period` | `/api/treasury/balances` |
| `saldo_inicial` | `numeric` | `-` | `saldoInicial` | `/api/treasury/balances` |
| `debit_period` | `numeric` | `-` | `debitPeriod` | `/api/treasury/balances` |
| `credit_period` | `numeric` | `-` | `creditPeriod` | `/api/treasury/balances` |
| `saldo_final` | `numeric` | `-` | `saldoFinal` | `/api/treasury/balances` |
| `quantidade_lancamentos` | `integer` | `-` | `quantidadeLancamentos` | `/api/treasury/balances` |

### 📋 Tabela: `accounting_configs`
* **Tradução da Tabela (PT):** `configuracoes_contabeis`
* **Rota da API (Backend):** `/api/treasury/configs`
* **Interface TypeScript (TS):** `AccountingConfig`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/configs` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/configs` |
| `ano_fiscal` | `integer` | `-` | `anoFiscal` | `/api/treasury/configs` |
| `mes_inicio` | `integer` | `-` | `mesInicio` | `/api/treasury/configs` |
| `mes_fim` | `integer` | `-` | `mesFim` | `/api/treasury/configs` |
| `moeda` | `character varying` | `-` | `moeda` | `/api/treasury/configs` |
| `regime_tributario` | `character varying` | `-` | `regimeTributario` | `/api/treasury/configs` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/configs` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/treasury/configs` |

### 📋 Tabela: `accounting_entries`
* **Tradução da Tabela (PT):** `lancamentos_contabeis`
* **Rota da API (Backend):** `/api/treasury/accounting-entries`
* **Interface TypeScript (TS):** `AccountingEntry`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/accounting-entries` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/accounting-entries` |
| `numero_lancamento` | `integer` | `-` | `numeroLancamento` | `/api/treasury/accounting-entries` |
| `data_lancamento` | `date` | `-` | `dataLancamento` | `/api/treasury/accounting-entries` |
| `numero_documento` | `character varying` | `-` | `numeroDocumento` | `/api/treasury/accounting-entries` |
| `historico` | `text` | `-` | `historico` | `/api/treasury/accounting-entries` |
| `complement` | `text` | `complemento` | `complemento` | `/api/treasury/accounting-entries` |
| `valor_debito` | `numeric` | `-` | `valorDebito` | `/api/treasury/accounting-entries` |
| `valor_credito` | `numeric` | `-` | `valorCredito` | `/api/treasury/accounting-entries` |
| `conta_contrapartida` | `character varying` | `-` | `contaContrapartida` | `/api/treasury/accounting-entries` |
| `transaction_id` | `uuid` | `id_transaction` | `transactionId` | `/api/treasury/accounting-entries` |
| `project_id` | `uuid` | `id_projeto` | `idProjeto` | `/api/treasury/accounting-entries` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/accounting-entries` |
| `criado_por` | `character varying` | `-` | `criadoPor` | `/api/treasury/accounting-entries` |
| `revisado_por` | `character varying` | `-` | `revisadoPor` | `/api/treasury/accounting-entries` |
| `status` | `character varying` | `situacao` | `situacao` | `/api/treasury/accounting-entries` |

### 📋 Tabela: `accounts`
* **Tradução da Tabela (PT):** `contas`
* **Rota da API (Backend):** `/api/accounts`
* **Interface TypeScript (TS):** `ContaBancaria`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/accounts` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/accounts` |
| `nome_conta` | `text` | `-` | `nomeConta` | `/api/accounts` |
| `tipo_conta` | `text` | `-` | `tipoConta` | `/api/accounts` |
| `nome_banco` | `text` | `-` | `nomeBanco` | `/api/accounts` |
| `agency` | `text` | `-` | `agency` | `/api/accounts` |
| `numero_conta` | `text` | `-` | `numeroConta` | `/api/accounts` |
| `saldo_atual` | `numeric` | `-` | `saldoAtual` | `/api/accounts` |
| `currency` | `text` | `-` | `currency` | `/api/accounts` |
| `esta_ativo` | `boolean` | `-` | `estaAtivo` | `/api/accounts` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/accounts` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/accounts` |

### 📋 Tabela: `active_employees`
* **Tradução da Tabela (PT):** `funcionarios_ativos`
* **Rota da API (Backend):** `/api/employees`
* **Interface TypeScript (TS):** `Funcionario[] (View)`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/employees` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/employees` |
| `nome` | `text` | `-` | `nome` | `/api/employees` |
| `cpf` | `text` | `-` | `cpf` | `/api/employees` |
| `rg` | `text` | `-` | `rg` | `/api/employees` |
| `ctps` | `text` | `-` | `ctps` | `/api/employees` |
| `ctps_serie` | `text` | `-` | `ctpsSerie` | `/api/employees` |
| `pis` | `text` | `-` | `pis` | `/api/employees` |
| `birth_date` | `date` | `data_nascimento` | `dataNascimento` | `/api/employees` |
| `sexo` | `text` | `-` | `sexo` | `/api/employees` |
| `estado_civil` | `text` | `-` | `estadoCivil` | `/api/employees` |
| `blood_type` | `text` | `tipo_sanguineo` | `tipoSanguineo` | `/api/employees` |
| `email` | `text` | `email` | `email` | `/api/employees` |
| `telefone` | `text` | `-` | `telefone` | `/api/employees` |
| `celular` | `text` | `-` | `celular` | `/api/employees` |
| `emergency_contact` | `text` | `contato_emergencia` | `contatoEmergencia` | `/api/employees` |
| `naturalidade` | `text` | `-` | `naturalidade` | `/api/employees` |
| `escolaridade` | `text` | `escolaridade` | `escolaridade` | `/api/employees` |
| `raca_cor` | `text` | `-` | `racaCor` | `/api/employees` |
| `nome_mae` | `text` | `-` | `nomeMae` | `/api/employees` |
| `nome_pai` | `text` | `-` | `nomePai` | `/api/employees` |
| `deficiencia` | `text` | `-` | `deficiencia` | `/api/employees` |
| `deficiencia_obs` | `text` | `-` | `deficienciaObs` | `/api/employees` |
| `avatar` | `text` | `avatar` | `avatar` | `/api/employees` |
| `observacoes_saude` | `text` | `-` | `observacoesSaude` | `/api/employees` |
| `cep` | `text` | `-` | `cep` | `/api/employees` |
| `logradouro` | `text` | `-` | `logradouro` | `/api/employees` |
| `numero` | `text` | `-` | `numero` | `/api/employees` |
| `complemento` | `text` | `-` | `complemento` | `/api/employees` |
| `bairro` | `text` | `-` | `bairro` | `/api/employees` |
| `cidade` | `text` | `-` | `cidade` | `/api/employees` |
| `estado` | `text` | `-` | `estado` | `/api/employees` |
| `address_country` | `text` | `-` | `addressCountry` | `/api/employees` |
| `matricula` | `text` | `matricula` | `matricula` | `/api/employees` |
| `cargo` | `text` | `-` | `cargo` | `/api/employees` |
| `funcao` | `text` | `-` | `funcao` | `/api/employees` |
| `departamento` | `text` | `-` | `departamento` | `/api/employees` |
| `cbo` | `text` | `-` | `cbo` | `/api/employees` |
| `data_admissao` | `date` | `-` | `dataAdmissao` | `/api/employees` |
| `data_demissao` | `date` | `-` | `dataDemissao` | `/api/employees` |
| `tipo_contrato` | `text` | `-` | `tipoContrato` | `/api/employees` |
| `regime_trabalho` | `text` | `-` | `regimeTrabalho` | `/api/employees` |
| `sindicato` | `text` | `-` | `sindicato` | `/api/employees` |
| `convencao_coletiva` | `text` | `-` | `convencaoColetiva` | `/api/employees` |
| `salario_base` | `numeric` | `-` | `salarioBase` | `/api/employees` |
| `tipo_salario` | `text` | `-` | `tipoSalario` | `/api/employees` |
| `forma_pagamento` | `text` | `-` | `formaPagamento` | `/api/employees` |
| `dia_pagamento` | `text` | `-` | `diaPagamento` | `/api/employees` |
| `jornada_trabalho` | `text` | `-` | `jornadaTrabalho` | `/api/employees` |
| `escala_trabalho` | `text` | `-` | `escalaTrabalho` | `/api/employees` |
| `horario_entrada` | `time without time zone` | `-` | `horarioEntrada` | `/api/employees` |
| `horario_saida` | `time without time zone` | `-` | `horarioSaida` | `/api/employees` |
| `inicio_intervalo` | `time without time zone` | `-` | `inicioIntervalo` | `/api/employees` |
| `fim_intervalo` | `time without time zone` | `-` | `fimIntervalo` | `/api/employees` |
| `duracao_intervalo` | `time without time zone` | `-` | `duracaoIntervalo` | `/api/employees` |
| `segunda_a_sexta` | `text` | `-` | `segundaASexta` | `/api/employees` |
| `sabado` | `text` | `-` | `sabado` | `/api/employees` |
| `trabalha_feriados` | `boolean` | `-` | `trabalhaFeriados` | `/api/employees` |
| `controla_intervalo` | `boolean` | `-` | `controlaIntervalo` | `/api/employees` |
| `horas_extras_autorizadas` | `boolean` | `-` | `horasExtrasAutorizadas` | `/api/employees` |
| `tipo_registro_ponto` | `text` | `-` | `tipoRegistroPonto` | `/api/employees` |
| `tolerancia_ponto` | `text` | `-` | `toleranciaPonto` | `/api/employees` |
| `codigo_horario` | `text` | `-` | `codigoHorario` | `/api/employees` |
| `banco` | `text` | `-` | `banco` | `/api/employees` |
| `codigo_banco` | `text` | `-` | `codigoBanco` | `/api/employees` |
| `agencia` | `text` | `-` | `agencia` | `/api/employees` |
| `conta` | `text` | `-` | `conta` | `/api/employees` |
| `tipo_conta` | `text` | `-` | `tipoConta` | `/api/employees` |
| `titular` | `text` | `-` | `titular` | `/api/employees` |
| `chave_pix` | `text` | `-` | `chavePix` | `/api/employees` |
| `vt_ativo` | `boolean` | `-` | `vtAtivo` | `/api/employees` |
| `vt_valor_diario` | `numeric` | `-` | `vtValorDiario` | `/api/employees` |
| `vt_qtd_vales_dia` | `integer` | `-` | `vtQtdValesDia` | `/api/employees` |
| `vale_transporte_total` | `numeric` | `-` | `valeTransporteTotal` | `/api/employees` |
| `va_ativo` | `boolean` | `-` | `vaAtivo` | `/api/employees` |
| `va_operadora` | `text` | `-` | `vaOperadora` | `/api/employees` |
| `vale_alimentacao` | `numeric` | `-` | `valeAlimentacao` | `/api/employees` |
| `vr_ativo` | `boolean` | `-` | `vrAtivo` | `/api/employees` |
| `vr_operadora` | `text` | `-` | `vrOperadora` | `/api/employees` |
| `vale_refeicao` | `numeric` | `-` | `valeRefeicao` | `/api/employees` |
| `ps_ativo` | `boolean` | `-` | `psAtivo` | `/api/employees` |
| `ps_operadora` | `text` | `-` | `psOperadora` | `/api/employees` |
| `ps_tipo_plano` | `text` | `-` | `psTipoPlano` | `/api/employees` |
| `ps_carteirinha` | `text` | `-` | `psCarteirinha` | `/api/employees` |
| `plano_saude_colaborador` | `numeric` | `-` | `planoSaudeColaborador` | `/api/employees` |
| `ps_dependentes_ativo` | `boolean` | `-` | `psDependentesAtivo` | `/api/employees` |
| `plano_saude_dependentes` | `numeric` | `-` | `planoSaudeDependentes` | `/api/employees` |
| `po_ativo` | `boolean` | `-` | `poAtivo` | `/api/employees` |
| `po_operadora` | `text` | `-` | `poOperadora` | `/api/employees` |
| `po_carteirinha` | `text` | `-` | `poCarteirinha` | `/api/employees` |
| `plano_odontologico` | `numeric` | `-` | `planoOdontologico` | `/api/employees` |
| `auxilio_moradia` | `numeric` | `-` | `auxilioMoradia` | `/api/employees` |
| `vale_farmacia` | `numeric` | `-` | `valeFarmacia` | `/api/employees` |
| `seguro_vida` | `numeric` | `-` | `seguroVida` | `/api/employees` |
| `auxilio_creche` | `numeric` | `-` | `auxilioCreche` | `/api/employees` |
| `auxilio_educacao` | `numeric` | `-` | `auxilioEducacao` | `/api/employees` |
| `gympass_plano` | `text` | `-` | `gympassPlano` | `/api/employees` |
| `titulo_eleitor` | `text` | `-` | `tituloEleitor` | `/api/employees` |
| `titulo_eleitor_zona` | `text` | `-` | `tituloEleitorZona` | `/api/employees` |
| `titulo_eleitor_secao` | `text` | `-` | `tituloEleitorSecao` | `/api/employees` |
| `reservista` | `text` | `-` | `reservista` | `/api/employees` |
| `cnh_numero` | `text` | `-` | `cnhNumero` | `/api/employees` |
| `cnh_categoria` | `text` | `-` | `cnhCategoria` | `/api/employees` |
| `cnh_vencimento` | `date` | `-` | `cnhVencimento` | `/api/employees` |
| `aso_data` | `date` | `-` | `asoData` | `/api/employees` |
| `esocial_categoria` | `text` | `-` | `esocialCategoria` | `/api/employees` |
| `esocial_matricula` | `text` | `-` | `esocialMatricula` | `/api/employees` |
| `esocial_natureza_atividade` | `text` | `-` | `esocialNaturezaAtividade` | `/api/employees` |
| `esocial_tipo_regime_prev` | `text` | `-` | `esocialTipoRegimePrev` | `/api/employees` |
| `esocial_tipo_regime_trab` | `text` | `-` | `esocialTipoRegimeTrab` | `/api/employees` |
| `esocial_indicativo_admissao` | `text` | `-` | `esocialIndicativoAdmissao` | `/api/employees` |
| `esocial_tipo_jornada` | `text` | `-` | `esocialTipoJornada` | `/api/employees` |
| `esocial_descricao_jornada` | `text` | `-` | `esocialDescricaoJornada` | `/api/employees` |
| `esocial_contrato_parcial` | `boolean` | `-` | `esocialContratoParcial` | `/api/employees` |
| `esocial_teletrabalho` | `boolean` | `-` | `esocialTeletrabalho` | `/api/employees` |
| `esocial_clausula_asseguratoria` | `boolean` | `-` | `esocialClausulaAsseguratoria` | `/api/employees` |
| `esocial_sucessao_trab` | `boolean` | `-` | `esocialSucessaoTrab` | `/api/employees` |
| `esocial_tipo_admissao` | `text` | `-` | `esocialTipoAdmissao` | `/api/employees` |
| `esocial_cnpj_anterior` | `text` | `-` | `esocialCnpjAnterior` | `/api/employees` |
| `esocial_matricula_anterior` | `text` | `-` | `esocialMatriculaAnterior` | `/api/employees` |
| `esocial_data_admissao_origem` | `date` | `-` | `esocialDataAdmissaoOrigem` | `/api/employees` |
| `is_active` | `boolean` | `eh_active` | `isActive` | `/api/employees` |
| `created_at` | `timestamp with time zone` | `criado_em` | `criadoEm` | `/api/employees` |
| `updated_at` | `timestamp with time zone` | `atualizado_em` | `atualizadoEm` | `/api/employees` |
| `created_by` | `uuid` | `criado_por` | `criadoPor` | `/api/employees` |
| `unit_name` | `text` | `-` | `unitName` | `/api/employees` |
| `current_status` | `text` | `-` | `currentStatus` | `/api/employees` |

### 📋 Tabela: `active_members`
* **Tradução da Tabela (PT):** `membros_ativos`
* **Rota da API (Backend):** `/api/members`
* **Interface TypeScript (TS):** `Member[] (View)`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/members` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/members` |
| `nome` | `text` | `-` | `nome` | `/api/members` |
| `cpf` | `text` | `-` | `cpf` | `/api/members` |
| `rg` | `text` | `-` | `rg` | `/api/members` |
| `email` | `text` | `email` | `email` | `/api/members` |
| `telefone` | `text` | `-` | `telefone` | `/api/members` |
| `celular` | `text` | `-` | `celular` | `/api/members` |
| `data_nascimento` | `date` | `-` | `dataNascimento` | `/api/members` |
| `sexo` | `text` | `-` | `sexo` | `/api/members` |
| `estado_civil` | `text` | `-` | `estadoCivil` | `/api/members` |
| `logradouro` | `text` | `-` | `logradouro` | `/api/members` |
| `bairro` | `text` | `-` | `bairro` | `/api/members` |
| `cidade` | `text` | `-` | `cidade` | `/api/members` |
| `estado` | `text` | `-` | `estado` | `/api/members` |
| `cep` | `text` | `-` | `cep` | `/api/members` |
| `data_conversao` | `date` | `-` | `dataConversao` | `/api/members` |
| `data_batismo` | `text` | `-` | `dataBatismo` | `/api/members` |
| `data_membro` | `date` | `-` | `dataMembro` | `/api/members` |
| `status_membro` | `text` | `-` | `statusMembro` | `/api/members` |
| `cargo_igreja` | `text` | `-` | `cargoIgreja` | `/api/members` |
| `ministerio` | `text` | `-` | `ministerio` | `/api/members` |
| `grupo_pequeno` | `text` | `-` | `grupoPequeno` | `/api/members` |
| `dizimista` | `boolean` | `-` | `ehDizimista` | `/api/members` |
| `ofertante` | `boolean` | `-` | `ofertante` | `/api/members` |
| `valor_dizimo` | `numeric` | `-` | `valorDizimo` | `/api/members` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/members` |
| `created_at` | `timestamp with time zone` | `criado_em` | `criadoEm` | `/api/members` |
| `updated_at` | `timestamp with time zone` | `atualizado_em` | `atualizadoEm` | `/api/members` |
| `unit_name` | `text` | `-` | `unitName` | `/api/members` |

### 📋 Tabela: `app_audit_logs`
* **Tradução da Tabela (PT):** `logs_auditoria_app`
* **Rota da API (Backend):** `/api/audit`
* **Interface TypeScript (TS):** `AuditLog[]`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/audit` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/audit` |
| `usuario_id` | `uuid` | `id_usuario` | `usuarioId` | `/api/audit` |
| `nome_usuario` | `character varying` | `-` | `nomeUsuario` | `/api/audit` |
| `action` | `character varying` | `-` | `action` | `/api/audit` |
| `entidade` | `character varying` | `-` | `entidade` | `/api/audit` |
| `id_entidade` | `character varying` | `id_entidade` | `idEntidade` | `/api/audit` |
| `nome_entidade` | `character varying` | `-` | `nomeEntidade` | `/api/audit` |
| `data_evento` | `timestamp with time zone` | `-` | `dataEvento` | `/api/audit` |
| `ip` | `character varying` | `-` | `ip` | `/api/audit` |
| `agente_usuario` | `text` | `-` | `agenteUsuario` | `/api/audit` |
| `details` | `jsonb` | `-` | `details` | `/api/audit` |
| `success` | `boolean` | `-` | `success` | `/api/audit` |
| `mensagem_erro` | `text` | `-` | `mensagemErro` | `/api/audit` |
| `hash_anterior` | `character varying` | `-` | `hashAnterior` | `/api/audit` |
| `hash` | `character varying` | `-` | `hash` | `/api/audit` |
| `imutavel` | `boolean` | `-` | `imutavel` | `/api/audit` |
| `created_at` | `timestamp with time zone` | `criado_em` | `criadoEm` | `/api/audit` |

### 📋 Tabela: `app_permission_modules`
* **Tradução da Tabela (PT):** `modulos_permissao_app`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `PermissionModule[]`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/auth/permissions` |
| `codigo` | `character varying` | `-` | `codigo` | `/api/auth/permissions` |
| `name` | `character varying` | `nome` | `nome` | `/api/auth/permissions` |
| `categoria` | `character varying` | `-` | `categoria` | `/api/auth/permissions` |
| `description` | `text` | `descricao` | `descricao` | `/api/auth/permissions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/auth/permissions` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/auth/permissions` |

### 📋 Tabela: `app_role_permissions`
* **Tradução da Tabela (PT):** `permissoes_perfil_app`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `RolePermission[]`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/auth/permissions` |
| `role` | `character varying` | `perfil` | `perfil` | `/api/auth/permissions` |
| `codigo_modulo` | `character varying` | `-` | `codigoModulo` | `/api/auth/permissions` |
| `ler` | `boolean` | `-` | `ler` | `/api/auth/permissions` |
| `escrever` | `boolean` | `-` | `escrever` | `/api/auth/permissions` |
| `excluir` | `boolean` | `-` | `excluir` | `/api/auth/permissions` |
| `gerenciar` | `boolean` | `-` | `gerenciar` | `/api/auth/permissions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/auth/permissions` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/auth/permissions` |
| `administrador` | `boolean` | `-` | `administrador` | `/api/auth/permissions` |

### 📋 Tabela: `app_user_permissions`
* **Tradução da Tabela (PT):** `permissoes_usuario_app`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `UserPermission[]`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/auth/permissions` |
| `usuario_id` | `uuid` | `id_usuario` | `usuarioId` | `/api/auth/permissions` |
| `codigo_modulo` | `character varying` | `-` | `codigoModulo` | `/api/auth/permissions` |
| `ler` | `boolean` | `-` | `ler` | `/api/auth/permissions` |
| `escrever` | `boolean` | `-` | `escrever` | `/api/auth/permissions` |
| `excluir` | `boolean` | `-` | `excluir` | `/api/auth/permissions` |
| `gerenciar` | `boolean` | `-` | `gerenciar` | `/api/auth/permissions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/auth/permissions` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/auth/permissions` |
| `administrador` | `boolean` | `-` | `administrador` | `/api/auth/permissions` |

### 📋 Tabela: `asset_depreciations`
* **Tradução da Tabela (PT):** `depreciacoes_ativos`
* **Rota da API (Backend):** `/api/assets/:id/depreciations`
* **Interface TypeScript (TS):** `AssetDepreciation`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/assets/:id/depreciations` |
| `ativo_id` | `uuid` | `-` | `ativoId` | `/api/assets/:id/depreciations` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/assets/:id/depreciations` |
| `mes_referencia` | `integer` | `-` | `mesReferencia` | `/api/assets/:id/depreciations` |
| `ano_referencia` | `integer` | `-` | `anoReferencia` | `/api/assets/:id/depreciations` |
| `valor_contabil_inicial` | `numeric` | `-` | `valorContabilInicial` | `/api/assets/:id/depreciations` |
| `despesa_depreciacao` | `numeric` | `-` | `despesaDepreciacao` | `/api/assets/:id/depreciations` |
| `depreciacao_acumulada` | `numeric` | `-` | `depreciacaoAcumulada` | `/api/assets/:id/depreciations` |
| `valor_contabil_final` | `numeric` | `-` | `valorContabilFinal` | `/api/assets/:id/depreciations` |
| `conta_debito` | `character varying` | `-` | `contaDebito` | `/api/assets/:id/depreciations` |
| `conta_credito` | `character varying` | `-` | `contaCredito` | `/api/assets/:id/depreciations` |
| `numero_documento` | `character varying` | `-` | `numeroDocumento` | `/api/assets/:id/depreciations` |
| `processado` | `timestamp with time zone` | `-` | `processado` | `/api/assets/:id/depreciations` |

### 📋 Tabela: `asset_maintenances`
* **Tradução da Tabela (PT):** `manutencoes_ativos`
* **Rota da API (Backend):** `/api/assets/:id/maintenances`
* **Interface TypeScript (TS):** `AssetMaintenance`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/assets/:id/maintenances` |
| `asset_id` | `uuid` | `id_ativo` | `idAtivo` | `/api/assets/:id/maintenances` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/assets/:id/maintenances` |
| `data_manutencao` | `date` | `-` | `dataManutencao` | `/api/assets/:id/maintenances` |
| `tipo_manutencao` | `character varying` | `-` | `tipoManutencao` | `/api/assets/:id/maintenances` |
| `descricao` | `text` | `-` | `descricao` | `/api/assets/:id/maintenances` |
| `fornecedor` | `character varying` | `-` | `fornecedor` | `/api/assets/:id/maintenances` |
| `custo` | `numeric` | `-` | `custo` | `/api/assets/:id/maintenances` |
| `numero_documento` | `character varying` | `-` | `numeroDocumento` | `/api/assets/:id/maintenances` |
| `proxima_manutencao` | `date` | `-` | `proximaManutencao` | `/api/assets/:id/maintenances` |
| `executado_por` | `character varying` | `-` | `executadoPor` | `/api/assets/:id/maintenances` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/assets/:id/maintenances` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/assets/:id/maintenances` |

### 📋 Tabela: `asset_summary_by_unit`
* **Tradução da Tabela (PT):** `resumo_patrimonio_unidade`
* **Rota da API (Backend):** `/api/assets/summary`
* **Interface TypeScript (TS):** `AssetSummary (View)`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/assets/summary` |
| `nome_unidade` | `text` | `-` | `nomeUnidade` | `/api/assets/summary` |
| `total_ativos` | `bigint` | `-` | `totalAtivos` | `/api/assets/summary` |
| `valor_total_aquisicao` | `numeric` | `-` | `valorTotalAquisicao` | `/api/assets/summary` |
| `valor_total_atual` | `numeric` | `-` | `valorTotalAtual` | `/api/assets/summary` |
| `depreciacao_total` | `numeric` | `-` | `depreciacaoTotal` | `/api/assets/summary` |
| `ativos_ativos` | `bigint` | `-` | `ativosAtivos` | `/api/assets/summary` |

### 📋 Tabela: `asset_transfers`
* **Tradução da Tabela (PT):** `transferencias_ativos`
* **Rota da API (Backend):** `/api/assets/:id/transfers`
* **Interface TypeScript (TS):** `AssetTransfer`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/assets/:id/transfers` |
| `ativo_id` | `uuid` | `-` | `ativoId` | `/api/assets/:id/transfers` |
| `unidade_origem_id` | `uuid` | `id_unidade_origem` | `unidadeOrigemId` | `/api/assets/:id/transfers` |
| `unidade_destino_id` | `uuid` | `id_unidade_destino` | `unidadeDestinoId` | `/api/assets/:id/transfers` |
| `data_transferencia` | `date` | `-` | `dataTransferencia` | `/api/assets/:id/transfers` |
| `motivo` | `text` | `-` | `motivo` | `/api/assets/:id/transfers` |
| `responsavel` | `character varying` | `-` | `responsavel` | `/api/assets/:id/transfers` |
| `autorizado_por` | `character varying` | `-` | `autorizadoPor` | `/api/assets/:id/transfers` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/assets/:id/transfers` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/assets/:id/transfers` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/assets/:id/transfers` |

### 📋 Tabela: `assets`
* **Tradução da Tabela (PT):** `patrimonio`
* **Rota da API (Backend):** `/api/assets`
* **Interface TypeScript (TS):** `Asset`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/assets` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/assets` |
| `nome` | `text` | `-` | `nome` | `/api/assets` |
| `descricao` | `text` | `-` | `descricao` | `/api/assets` |
| `categoria` | `text` | `-` | `categoria` | `/api/assets` |
| `data_aquisicao` | `date` | `-` | `dataAquisicao` | `/api/assets` |
| `valor_aquisicao` | `numeric` | `-` | `valorAquisicao` | `/api/assets` |
| `valor_atual` | `numeric` | `-` | `valorAtual` | `/api/assets` |
| `taxa_depreciacao` | `numeric` | `-` | `taxaDepreciacao` | `/api/assets` |
| `localizacao` | `text` | `-` | `localizacao` | `/api/assets` |
| `condicao` | `text` | `-` | `condicao` | `/api/assets` |
| `numero_ativo` | `text` | `-` | `numeroAtivo` | `/api/assets` |
| `situacao` | `text` | `-` | `situacao` | `/api/assets` |
| `vida_util_meses` | `integer` | `-` | `vidaUtilMeses` | `/api/assets` |
| `metodo_depreciacao` | `text` | `-` | `metodoDepreciacao` | `/api/assets` |
| `valor_contabil_atual` | `numeric` | `-` | `valorContabilAtual` | `/api/assets` |
| `depreciacao_acumulada` | `numeric` | `-` | `depreciacaoAcumulada` | `/api/assets` |
| `funcionario_responsavel_id` | `uuid` | `id_funcionario_responsavel` | `funcionarioResponsavelId` | `/api/assets` |
| `nota_fiscal_aquisicao` | `text` | `-` | `notaFiscalAquisicao` | `/api/assets` |
| `numero_serie` | `text` | `-` | `numeroSerie` | `/api/assets` |
| `validade_garantia` | `date` | `-` | `validadeGarantia` | `/api/assets` |
| `notas_manutencao` | `text` | `-` | `notasManutencao` | `/api/assets` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/assets` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/assets` |
| `cep` | `character varying` | `-` | `cep` | `/api/assets` |
| `logradouro` | `text` | `-` | `logradouro` | `/api/assets` |
| `numero` | `character varying` | `-` | `numero` | `/api/assets` |
| `complemento` | `character varying` | `-` | `complemento` | `/api/assets` |
| `bairro` | `character varying` | `-` | `bairro` | `/api/assets` |
| `cidade` | `character varying` | `-` | `cidade` | `/api/assets` |
| `estado` | `character varying` | `-` | `estado` | `/api/assets` |

### 📋 Tabela: `audit_logs`
* **Tradução da Tabela (PT):** `logs_auditoria`
* **Rota da API (Backend):** `/api/audit`
* **Interface TypeScript (TS):** `AuditLog`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/audit` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/audit` |
| `usuario_id` | `uuid` | `id_usuario` | `usuarioId` | `/api/audit` |
| `nome_usuario` | `character varying` | `-` | `nomeUsuario` | `/api/audit` |
| `acao` | `character varying` | `-` | `acao` | `/api/audit` |
| `entidade` | `character varying` | `-` | `entidade` | `/api/audit` |
| `id_entidade` | `uuid` | `id_entidade` | `idEntidade` | `/api/audit` |
| `nome_entidade` | `character varying` | `-` | `nomeEntidade` | `/api/audit` |
| `data_acao` | `timestamp with time zone` | `-` | `dataAcao` | `/api/audit` |
| `endereco_ip` | `inet` | `-` | `enderecoIp` | `/api/audit` |
| `details` | `jsonb` | `-` | `details` | `/api/audit` |
| `success` | `boolean` | `-` | `success` | `/api/audit` |
| `hash` | `character varying` | `-` | `hash` | `/api/audit` |

### 📋 Tabela: `bank_reconciliations`
* **Tradução da Tabela (PT):** `conciliacoes_bancarias`
* **Rota da API (Backend):** `/api/reconciliation`
* **Interface TypeScript (TS):** `BankReconciliation`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/reconciliation` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/reconciliation` |
| `conta_bancaria_id` | `uuid` | `id_conta_bancaria` | `contaBancariaId` | `/api/reconciliation` |
| `nome_conta_bancaria` | `character varying` | `-` | `nomeContaBancaria` | `/api/reconciliation` |
| `nome_banco` | `character varying` | `-` | `nomeBanco` | `/api/reconciliation` |
| `data_inicio` | `date` | `-` | `dataInicio` | `/api/reconciliation` |
| `data_final` | `date` | `-` | `dataFinal` | `/api/reconciliation` |
| `saldo_inicial` | `numeric` | `-` | `saldoInicial` | `/api/reconciliation` |
| `saldo_final` | `numeric` | `-` | `saldoFinal` | `/api/reconciliation` |
| `saldo_conciliado` | `numeric` | `-` | `saldoConciliado` | `/api/reconciliation` |
| `diferenca` | `numeric` | `-` | `diferenca` | `/api/reconciliation` |
| `status` | `character varying` | `situacao` | `situacao` | `/api/reconciliation` |
| `percentual_conciliacao` | `numeric` | `-` | `percentualConciliacao` | `/api/reconciliation` |
| `total_transacoes_banco` | `integer` | `-` | `totalTransacoesBanco` | `/api/reconciliation` |
| `total_transacoes_sistema` | `integer` | `-` | `totalTransacoesSistema` | `/api/reconciliation` |
| `transacoes_conciliadas` | `integer` | `-` | `transacoesConciliadas` | `/api/reconciliation` |
| `transacoes_nao_conciliadas` | `integer` | `-` | `transacoesNaoConciliadas` | `/api/reconciliation` |
| `divergencias` | `jsonb` | `-` | `divergencias` | `/api/reconciliation` |
| `conciliado_por` | `character varying` | `-` | `conciliadoPor` | `/api/reconciliation` |
| `data_conciliacao` | `timestamp with time zone` | `-` | `dataConciliacao` | `/api/reconciliation` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/reconciliation` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/reconciliation` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/reconciliation` |

### 📋 Tabela: `bank_statement_transactions`
* **Tradução da Tabela (PT):** `transacoes_extrato_bancario`
* **Rota da API (Backend):** `/api/reconciliation/statement-transactions`
* **Interface TypeScript (TS):** `BankStatementTransaction`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/reconciliation/statement-transactions` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/reconciliation/statement-transactions` |
| `reconciliation_id` | `uuid` | `id_reconciliation` | `reconciliationId` | `/api/reconciliation/statement-transactions` |
| `bank_account_id` | `uuid` | `id_bank_account` | `bankAccountId` | `/api/reconciliation/statement-transactions` |
| `data_transacao` | `date` | `-` | `dataTransacao` | `/api/reconciliation/statement-transactions` |
| `descricao` | `text` | `-` | `descricao` | `/api/reconciliation/statement-transactions` |
| `valor` | `numeric` | `-` | `valor` | `/api/reconciliation/statement-transactions` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/reconciliation/statement-transactions` |
| `metodo_pagamento` | `character varying` | `-` | `metodoPagamento` | `/api/reconciliation/statement-transactions` |
| `status_conciliacao` | `character varying` | `-` | `statusConciliacao` | `/api/reconciliation/statement-transactions` |
| `transacao_id` | `uuid` | `id_transacao` | `transacaoId` | `/api/reconciliation/statement-transactions` |
| `origem` | `character varying` | `-` | `origem` | `/api/reconciliation/statement-transactions` |
| `id_externo` | `character varying` | `id_externo` | `idExterno` | `/api/reconciliation/statement-transactions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/reconciliation/statement-transactions` |

### 📋 Tabela: `cash_closings`
* **Tradução da Tabela (PT):** `fechamentos_caixa`
* **Rota da API (Backend):** `/api/treasury/cash-closings`
* **Interface TypeScript (TS):** `CashClosing`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/cash-closings` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/cash-closings` |
| `id_conta` | `uuid` | `id_conta` | `idConta` | `/api/treasury/cash-closings` |
| `data_fechamento` | `date` | `-` | `dataFechamento` | `/api/treasury/cash-closings` |
| `saldo_inicial` | `numeric` | `-` | `saldoInicial` | `/api/treasury/cash-closings` |
| `total_entradas` | `numeric` | `-` | `totalEntradas` | `/api/treasury/cash-closings` |
| `total_saidas` | `numeric` | `-` | `totalSaidas` | `/api/treasury/cash-closings` |
| `saldo_esperado` | `numeric` | `-` | `saldoEsperado` | `/api/treasury/cash-closings` |
| `saldo_real` | `numeric` | `-` | `saldoReal` | `/api/treasury/cash-closings` |
| `diferenca` | `numeric` | `-` | `diferenca` | `/api/treasury/cash-closings` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/treasury/cash-closings` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/treasury/cash-closings` |
| `fechado_por` | `uuid` | `-` | `fechadoPor` | `/api/treasury/cash-closings` |
| `fechado` | `timestamp with time zone` | `-` | `fechado` | `/api/treasury/cash-closings` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/cash-closings` |

### 📋 Tabela: `cash_movements`
* **Tradução da Tabela (PT):** `movimentacoes_caixa`
* **Rota da API (Backend):** `/api/treasury/cash-movements`
* **Interface TypeScript (TS):** `CashMovement`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/cash-movements` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/cash-movements` |
| `account_id` | `uuid` | `id_conta` | `idConta` | `/api/treasury/cash-movements` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/treasury/cash-movements` |
| `valor` | `numeric` | `-` | `valor` | `/api/treasury/cash-movements` |
| `motivo` | `text` | `-` | `motivo` | `/api/treasury/cash-movements` |
| `numero_documento` | `character varying` | `-` | `numeroDocumento` | `/api/treasury/cash-movements` |
| `responsavel` | `uuid` | `-` | `responsavel` | `/api/treasury/cash-movements` |
| `autorizado_por` | `uuid` | `-` | `autorizadoPor` | `/api/treasury/cash-movements` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/treasury/cash-movements` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/cash-movements` |

### 📋 Tabela: `categories`
* **Tradução da Tabela (PT):** `categorias`
* **Rota da API (Backend):** `/api/categories`
* **Interface TypeScript (TS):** `Category`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/categories` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/categories` |
| `nome_categoria` | `text` | `-` | `nomeCategoria` | `/api/categories` |
| `tipo_categoria` | `text` | `-` | `tipoCategoria` | `/api/categories` |
| `categoria_pai_id` | `uuid` | `id_categoria_pai` | `categoriaPaiId` | `/api/categories` |
| `cor` | `text` | `-` | `cor` | `/api/categories` |
| `icone` | `text` | `-` | `icone` | `/api/categories` |
| `descricao` | `text` | `-` | `descricao` | `/api/categories` |
| `esta_ativa` | `boolean` | `-` | `estaAtiva` | `/api/categories` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/categories` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/categories` |

### 📋 Tabela: `chart_of_accounts`
* **Tradução da Tabela (PT):** `plano_contas`
* **Rota da API (Backend):** `/api/treasury/chart-of-accounts`
* **Interface TypeScript (TS):** `ChartOfAccount`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/chart-of-accounts` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/chart-of-accounts` |
| `codigo` | `character varying` | `-` | `codigo` | `/api/treasury/chart-of-accounts` |
| `nome` | `character varying` | `-` | `nome` | `/api/treasury/chart-of-accounts` |
| `natureza` | `USER-DEFINED` | `-` | `natureza` | `/api/treasury/chart-of-accounts` |
| `type` | `USER-DEFINED` | `tipo` | `tipo` | `/api/treasury/chart-of-accounts` |
| `parent_id` | `uuid` | `id_parent` | `parentId` | `/api/treasury/chart-of-accounts` |
| `saldo_normal` | `USER-DEFINED` | `-` | `saldoNormal` | `/api/treasury/chart-of-accounts` |
| `esta_ativo` | `boolean` | `-` | `estaAtivo` | `/api/treasury/chart-of-accounts` |

### 📋 Tabela: `church_events`
* **Tradução da Tabela (PT):** `eventos`
* **Rota da API (Backend):** `/api/events`
* **Interface TypeScript (TS):** `ChurchEvent`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/events` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/events` |
| `titulo` | `character varying` | `-` | `titulo` | `/api/events` |
| `descricao` | `text` | `-` | `descricao` | `/api/events` |
| `data_evento` | `date` | `-` | `dataEvento` | `/api/events` |
| `hora_evento` | `time without time zone` | `-` | `horaEvento` | `/api/events` |
| `local_evento` | `character varying` | `-` | `localEvento` | `/api/events` |
| `quantidade_presentes` | `integer` | `-` | `quantidadePresentes` | `/api/events` |
| `type` | `USER-DEFINED` | `tipo` | `tipo` | `/api/events` |
| `recorrente` | `boolean` | `-` | `recorrente` | `/api/events` |
| `padrao_recorrencia` | `USER-DEFINED` | `-` | `padraoRecorrencia` | `/api/events` |
| `data_fim_recorrencia` | `date` | `-` | `dataFimRecorrencia` | `/api/events` |
| `evento_pai_id` | `uuid` | `id_evento_pai` | `eventoPaiId` | `/api/events` |
| `evento_gerado` | `boolean` | `-` | `eventoGerado` | `/api/events` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/events` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/events` |

### 📋 Tabela: `contas_financeiras`
* **Tradução da Tabela (PT):** `contas_financeiras`
* **Rota da API (Backend):** `/api/accounts`
* **Interface TypeScript (TS):** `ContaBancaria`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id_conta` | `uuid` | `id_conta` | `idConta` | `/api/accounts` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/accounts` |
| `nome` | `character varying` | `-` | `nome` | `/api/accounts` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/accounts` |
| `saldo` | `numeric` | `-` | `saldo` | `/api/accounts` |
| `data_criacao` | `timestamp with time zone` | `-` | `dataCriacao` | `/api/accounts` |
| `data_atualizacao` | `timestamp with time zone` | `-` | `dataAtualizacao` | `/api/accounts` |

### 📋 Tabela: `contribuicoes_membros`
* **Tradução da Tabela (PT):** `contribuicoes_membros`
* **Rota da API (Backend):** `/api/members/:id/contributions`
* **Interface TypeScript (TS):** `MemberContribution`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/members/:id/contributions` |
| `membro_id` | `uuid` | `-` | `membroId` | `/api/members/:id/contributions` |
| `valor` | `numeric` | `-` | `valor` | `/api/members/:id/contributions` |
| `data` | `date` | `-` | `data` | `/api/members/:id/contributions` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/members/:id/contributions` |
| `descricao` | `text` | `-` | `descricao` | `/api/members/:id/contributions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/members/:id/contributions` |

### 📋 Tabela: `dependentes`
* **Tradução da Tabela (PT):** `dependentes`
* **Rota da API (Backend):** `/api/members/:id/dependents`
* **Interface TypeScript (TS):** `Dependent`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/members/:id/dependents` |
| `membro_id` | `uuid` | `-` | `membroId` | `/api/members/:id/dependents` |
| `nome` | `character varying` | `-` | `nome` | `/api/members/:id/dependents` |
| `data_nascimento` | `date` | `-` | `dataNascimento` | `/api/members/:id/dependents` |
| `parentesco` | `character varying` | `-` | `parentesco` | `/api/members/:id/dependents` |
| `cpf` | `character varying` | `-` | `cpf` | `/api/members/:id/dependents` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/members/:id/dependents` |

### 📋 Tabela: `dependents`
* **Tradução da Tabela (PT):** `dependentes`
* **Rota da API (Backend):** `/api/members/:id/dependents`
* **Interface TypeScript (TS):** `Dependent`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/members/:id/dependents` |
| `id_membro` | `uuid` | `id_membro` | `idMembro` | `/api/members/:id/dependents` |
| `nome` | `character varying` | `-` | `nome` | `/api/members/:id/dependents` |
| `data_nascimento` | `date` | `-` | `dataNascimento` | `/api/members/:id/dependents` |
| `parentesco` | `character varying` | `-` | `parentesco` | `/api/members/:id/dependents` |
| `cpf` | `character varying` | `-` | `cpf` | `/api/members/:id/dependents` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/members/:id/dependents` |

### 📋 Tabela: `employee_dependents`
* **Tradução da Tabela (PT):** `dependentes_funcionarios`
* **Rota da API (Backend):** `/api/employees/:id/dependents`
* **Interface TypeScript (TS):** `Dependent`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/employees/:id/dependents` |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `/api/employees/:id/dependents` |
| `nome` | `text` | `-` | `nome` | `/api/employees/:id/dependents` |
| `data_nascimento` | `date` | `-` | `dataNascimento` | `/api/employees/:id/dependents` |
| `parentesco` | `text` | `-` | `parentesco` | `/api/employees/:id/dependents` |
| `cpf` | `text` | `-` | `cpf` | `/api/employees/:id/dependents` |
| `estudante` | `boolean` | `-` | `estudante` | `/api/employees/:id/dependents` |
| `dependencia_irrf` | `boolean` | `-` | `dependenciaIrrf` | `/api/employees/:id/dependents` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/employees/:id/dependents` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/employees/:id/dependents` |

### 📋 Tabela: `employee_leaves`
* **Tradução da Tabela (PT):** `afastamentos`
* **Rota da API (Backend):** `/api/employees/:id/leaves`
* **Interface TypeScript (TS):** `EmployeeLeave`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/employees/:id/leaves` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/employees/:id/leaves` |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `/api/employees/:id/leaves` |
| `nome_funcionario` | `character varying` | `-` | `nomeFuncionario` | `/api/employees/:id/leaves` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/employees/:id/leaves` |
| `data_inicio` | `date` | `-` | `dataInicio` | `/api/employees/:id/leaves` |
| `data_final` | `date` | `-` | `dataFinal` | `/api/employees/:id/leaves` |
| `cid10` | `character varying` | `-` | `cid10` | `/api/employees/:id/leaves` |
| `nome_medico` | `character varying` | `-` | `nomeMedico` | `/api/employees/:id/leaves` |
| `crm` | `character varying` | `-` | `crm` | `/api/employees/:id/leaves` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/employees/:id/leaves` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/employees/:id/leaves` |
| `url_anexo` | `text` | `-` | `urlAnexo` | `/api/employees/:id/leaves` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/employees/:id/leaves` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/employees/:id/leaves` |

### 📋 Tabela: `employees`
* **Tradução da Tabela (PT):** `funcionarios`
* **Rota da API (Backend):** `/api/employees`
* **Interface TypeScript (TS):** `Funcionario`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/employees` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/employees` |
| `nome` | `text` | `-` | `nome` | `/api/employees` |
| `cpf` | `text` | `-` | `cpf` | `/api/employees` |
| `rg` | `text` | `-` | `rg` | `/api/employees` |
| `ctps` | `text` | `-` | `ctps` | `/api/employees` |
| `ctps_serie` | `text` | `-` | `ctpsSerie` | `/api/employees` |
| `pis` | `text` | `-` | `pis` | `/api/employees` |
| `birth_date` | `date` | `data_nascimento` | `dataNascimento` | `/api/employees` |
| `sexo` | `text` | `-` | `sexo` | `/api/employees` |
| `estado_civil` | `text` | `-` | `estadoCivil` | `/api/employees` |
| `blood_type` | `text` | `tipo_sanguineo` | `tipoSanguineo` | `/api/employees` |
| `email` | `text` | `email` | `email` | `/api/employees` |
| `telefone` | `text` | `-` | `telefone` | `/api/employees` |
| `celular` | `text` | `-` | `celular` | `/api/employees` |
| `emergency_contact` | `text` | `contato_emergencia` | `contatoEmergencia` | `/api/employees` |
| `naturalidade` | `text` | `-` | `naturalidade` | `/api/employees` |
| `escolaridade` | `text` | `escolaridade` | `escolaridade` | `/api/employees` |
| `raca_cor` | `text` | `-` | `racaCor` | `/api/employees` |
| `nome_mae` | `text` | `-` | `nomeMae` | `/api/employees` |
| `nome_pai` | `text` | `-` | `nomePai` | `/api/employees` |
| `deficiencia` | `text` | `-` | `deficiencia` | `/api/employees` |
| `deficiencia_obs` | `text` | `-` | `deficienciaObs` | `/api/employees` |
| `avatar` | `text` | `avatar` | `avatar` | `/api/employees` |
| `observacoes_saude` | `text` | `-` | `observacoesSaude` | `/api/employees` |
| `cep` | `text` | `-` | `cep` | `/api/employees` |
| `logradouro` | `text` | `-` | `logradouro` | `/api/employees` |
| `numero` | `text` | `-` | `numero` | `/api/employees` |
| `complemento` | `text` | `-` | `complemento` | `/api/employees` |
| `bairro` | `text` | `-` | `bairro` | `/api/employees` |
| `cidade` | `text` | `-` | `cidade` | `/api/employees` |
| `estado` | `text` | `-` | `estado` | `/api/employees` |
| `address_country` | `text` | `-` | `addressCountry` | `/api/employees` |
| `matricula` | `text` | `matricula` | `matricula` | `/api/employees` |
| `cargo` | `text` | `-` | `cargo` | `/api/employees` |
| `funcao` | `text` | `-` | `funcao` | `/api/employees` |
| `departamento` | `text` | `-` | `departamento` | `/api/employees` |
| `cbo` | `text` | `-` | `cbo` | `/api/employees` |
| `data_admissao` | `date` | `-` | `dataAdmissao` | `/api/employees` |
| `data_demissao` | `date` | `-` | `dataDemissao` | `/api/employees` |
| `tipo_contrato` | `text` | `-` | `tipoContrato` | `/api/employees` |
| `regime_trabalho` | `text` | `-` | `regimeTrabalho` | `/api/employees` |
| `sindicato` | `text` | `-` | `sindicato` | `/api/employees` |
| `convencao_coletiva` | `text` | `-` | `convencaoColetiva` | `/api/employees` |
| `salario_base` | `numeric` | `-` | `salarioBase` | `/api/employees` |
| `tipo_salario` | `text` | `-` | `tipoSalario` | `/api/employees` |
| `forma_pagamento` | `text` | `-` | `formaPagamento` | `/api/employees` |
| `dia_pagamento` | `text` | `-` | `diaPagamento` | `/api/employees` |
| `jornada_trabalho` | `text` | `-` | `jornadaTrabalho` | `/api/employees` |
| `escala_trabalho` | `text` | `-` | `escalaTrabalho` | `/api/employees` |
| `horario_entrada` | `time without time zone` | `-` | `horarioEntrada` | `/api/employees` |
| `horario_saida` | `time without time zone` | `-` | `horarioSaida` | `/api/employees` |
| `inicio_intervalo` | `time without time zone` | `-` | `inicioIntervalo` | `/api/employees` |
| `fim_intervalo` | `time without time zone` | `-` | `fimIntervalo` | `/api/employees` |
| `duracao_intervalo` | `time without time zone` | `-` | `duracaoIntervalo` | `/api/employees` |
| `segunda_a_sexta` | `text` | `-` | `segundaASexta` | `/api/employees` |
| `sabado` | `text` | `-` | `sabado` | `/api/employees` |
| `trabalha_feriados` | `boolean` | `-` | `trabalhaFeriados` | `/api/employees` |
| `controla_intervalo` | `boolean` | `-` | `controlaIntervalo` | `/api/employees` |
| `horas_extras_autorizadas` | `boolean` | `-` | `horasExtrasAutorizadas` | `/api/employees` |
| `tipo_registro_ponto` | `text` | `-` | `tipoRegistroPonto` | `/api/employees` |
| `tolerancia_ponto` | `text` | `-` | `toleranciaPonto` | `/api/employees` |
| `codigo_horario` | `text` | `-` | `codigoHorario` | `/api/employees` |
| `banco` | `text` | `-` | `banco` | `/api/employees` |
| `codigo_banco` | `text` | `-` | `codigoBanco` | `/api/employees` |
| `agencia` | `text` | `-` | `agencia` | `/api/employees` |
| `conta` | `text` | `-` | `conta` | `/api/employees` |
| `tipo_conta` | `text` | `-` | `tipoConta` | `/api/employees` |
| `titular` | `text` | `-` | `titular` | `/api/employees` |
| `chave_pix` | `text` | `-` | `chavePix` | `/api/employees` |
| `vt_ativo` | `boolean` | `-` | `vtAtivo` | `/api/employees` |
| `vt_valor_diario` | `numeric` | `-` | `vtValorDiario` | `/api/employees` |
| `vt_qtd_vales_dia` | `integer` | `-` | `vtQtdValesDia` | `/api/employees` |
| `vale_transporte_total` | `numeric` | `-` | `valeTransporteTotal` | `/api/employees` |
| `va_ativo` | `boolean` | `-` | `vaAtivo` | `/api/employees` |
| `va_operadora` | `text` | `-` | `vaOperadora` | `/api/employees` |
| `vale_alimentacao` | `numeric` | `-` | `valeAlimentacao` | `/api/employees` |
| `vr_ativo` | `boolean` | `-` | `vrAtivo` | `/api/employees` |
| `vr_operadora` | `text` | `-` | `vrOperadora` | `/api/employees` |
| `vale_refeicao` | `numeric` | `-` | `valeRefeicao` | `/api/employees` |
| `ps_ativo` | `boolean` | `-` | `psAtivo` | `/api/employees` |
| `ps_operadora` | `text` | `-` | `psOperadora` | `/api/employees` |
| `ps_tipo_plano` | `text` | `-` | `psTipoPlano` | `/api/employees` |
| `ps_carteirinha` | `text` | `-` | `psCarteirinha` | `/api/employees` |
| `plano_saude_colaborador` | `numeric` | `-` | `planoSaudeColaborador` | `/api/employees` |
| `ps_dependentes_ativo` | `boolean` | `-` | `psDependentesAtivo` | `/api/employees` |
| `plano_saude_dependentes` | `numeric` | `-` | `planoSaudeDependentes` | `/api/employees` |
| `po_ativo` | `boolean` | `-` | `poAtivo` | `/api/employees` |
| `po_operadora` | `text` | `-` | `poOperadora` | `/api/employees` |
| `po_carteirinha` | `text` | `-` | `poCarteirinha` | `/api/employees` |
| `plano_odontologico` | `numeric` | `-` | `planoOdontologico` | `/api/employees` |
| `auxilio_moradia` | `numeric` | `-` | `auxilioMoradia` | `/api/employees` |
| `vale_farmacia` | `numeric` | `-` | `valeFarmacia` | `/api/employees` |
| `seguro_vida` | `numeric` | `-` | `seguroVida` | `/api/employees` |
| `auxilio_creche` | `numeric` | `-` | `auxilioCreche` | `/api/employees` |
| `auxilio_educacao` | `numeric` | `-` | `auxilioEducacao` | `/api/employees` |
| `gympass_plano` | `text` | `-` | `gympassPlano` | `/api/employees` |
| `titulo_eleitor` | `text` | `-` | `tituloEleitor` | `/api/employees` |
| `titulo_eleitor_zona` | `text` | `-` | `tituloEleitorZona` | `/api/employees` |
| `titulo_eleitor_secao` | `text` | `-` | `tituloEleitorSecao` | `/api/employees` |
| `reservista` | `text` | `-` | `reservista` | `/api/employees` |
| `cnh_numero` | `text` | `-` | `cnhNumero` | `/api/employees` |
| `cnh_categoria` | `text` | `-` | `cnhCategoria` | `/api/employees` |
| `cnh_vencimento` | `date` | `-` | `cnhVencimento` | `/api/employees` |
| `aso_data` | `date` | `-` | `asoData` | `/api/employees` |
| `esocial_categoria` | `text` | `-` | `esocialCategoria` | `/api/employees` |
| `esocial_matricula` | `text` | `-` | `esocialMatricula` | `/api/employees` |
| `esocial_natureza_atividade` | `text` | `-` | `esocialNaturezaAtividade` | `/api/employees` |
| `esocial_tipo_regime_prev` | `text` | `-` | `esocialTipoRegimePrev` | `/api/employees` |
| `esocial_tipo_regime_trab` | `text` | `-` | `esocialTipoRegimeTrab` | `/api/employees` |
| `esocial_indicativo_admissao` | `text` | `-` | `esocialIndicativoAdmissao` | `/api/employees` |
| `esocial_tipo_jornada` | `text` | `-` | `esocialTipoJornada` | `/api/employees` |
| `esocial_descricao_jornada` | `text` | `-` | `esocialDescricaoJornada` | `/api/employees` |
| `esocial_contrato_parcial` | `boolean` | `-` | `esocialContratoParcial` | `/api/employees` |
| `esocial_teletrabalho` | `boolean` | `-` | `esocialTeletrabalho` | `/api/employees` |
| `esocial_clausula_asseguratoria` | `boolean` | `-` | `esocialClausulaAsseguratoria` | `/api/employees` |
| `esocial_sucessao_trab` | `boolean` | `-` | `esocialSucessaoTrab` | `/api/employees` |
| `esocial_tipo_admissao` | `text` | `-` | `esocialTipoAdmissao` | `/api/employees` |
| `esocial_cnpj_anterior` | `text` | `-` | `esocialCnpjAnterior` | `/api/employees` |
| `esocial_matricula_anterior` | `text` | `-` | `esocialMatriculaAnterior` | `/api/employees` |
| `esocial_data_admissao_origem` | `date` | `-` | `esocialDataAdmissaoOrigem` | `/api/employees` |
| `ativo` | `boolean` | `-` | `ativo` | `/api/employees` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/employees` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/employees` |
| `created_by` | `uuid` | `criado_por` | `criadoPor` | `/api/employees` |
| `dados_perfil` | `jsonb` | `dados_perfil` | `dadosPerfil` | `/api/employees` |

### 📋 Tabela: `events`
* **Tradução da Tabela (PT):** `eventos`
* **Rota da API (Backend):** `/api/events`
* **Interface TypeScript (TS):** `ChurchEvent`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/events` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/events` |
| `titulo` | `text` | `-` | `titulo` | `/api/events` |
| `descricao` | `text` | `-` | `descricao` | `/api/events` |
| `data_evento` | `date` | `-` | `dataEvento` | `/api/events` |
| `hora_evento` | `text` | `-` | `horaEvento` | `/api/events` |
| `data_final` | `date` | `-` | `dataFinal` | `/api/events` |
| `hora_fim` | `text` | `-` | `horaFim` | `/api/events` |
| `local_evento` | `text` | `-` | `localEvento` | `/api/events` |
| `tipo_evento` | `text` | `-` | `tipoEvento` | `/api/events` |
| `situacao` | `text` | `-` | `situacao` | `/api/events` |
| `maximo_presentes` | `integer` | `-` | `maximoPresentes` | `/api/events` |
| `quantidade_presentes` | `integer` | `-` | `quantidadePresentes` | `/api/events` |
| `publico` | `boolean` | `-` | `publico` | `/api/events` |
| `criado_por` | `uuid` | `-` | `criadoPor` | `/api/events` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/events` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/events` |

### 📋 Tabela: `financial_accounts`
* **Tradução da Tabela (PT):** `contas_financeiras`
* **Rota da API (Backend):** `/api/accounts`
* **Interface TypeScript (TS):** `ContaBancaria`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/accounts` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/accounts` |
| `nome` | `character varying` | `-` | `nome` | `/api/accounts` |
| `tipo` | `USER-DEFINED` | `-` | `tipo` | `/api/accounts` |
| `saldo_atual` | `numeric` | `-` | `saldoAtual` | `/api/accounts` |
| `saldo_minimo` | `numeric` | `-` | `saldoMinimo` | `/api/accounts` |
| `situacao` | `USER-DEFINED` | `-` | `situacao` | `/api/accounts` |
| `codigo_banco` | `character varying` | `-` | `codigoBanco` | `/api/accounts` |
| `numero_agencia` | `character varying` | `-` | `numeroAgencia` | `/api/accounts` |
| `numero_conta` | `character varying` | `-` | `numeroConta` | `/api/accounts` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/accounts` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/accounts` |

### 📋 Tabela: `financial_summary`
* **Tradução da Tabela (PT):** `resumo_financeiro`
* **Rota da API (Backend):** `/api/treasury/summary`
* **Interface TypeScript (TS):** `FinancialSummary (View)`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/summary` |
| `nome_unidade` | `text` | `-` | `nomeUnidade` | `/api/treasury/summary` |
| `total_transacoes` | `bigint` | `-` | `totalTransacoes` | `/api/treasury/summary` |
| `total_receitas` | `numeric` | `-` | `totalReceitas` | `/api/treasury/summary` |
| `total_despesas` | `numeric` | `-` | `totalDespesas` | `/api/treasury/summary` |
| `valor_liquido` | `numeric` | `-` | `valorLiquido` | `/api/treasury/summary` |
| `contas_usadas` | `bigint` | `-` | `contasUsadas` | `/api/treasury/summary` |

### 📋 Tabela: `funcionarios`
* **Tradução da Tabela (PT):** `funcionarios`
* **Rota da API (Backend):** `N/A`
* **Interface TypeScript (TS):** `N/A`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `N/A` |
| `id_pessoa` | `uuid` | `id_pessoa` | `idPessoa` | `N/A` |
| `cargo` | `character varying` | `-` | `cargo` | `N/A` |
| `departamento` | `character varying` | `-` | `departamento` | `N/A` |
| `data_admissao` | `date` | `-` | `dataAdmissao` | `N/A` |
| `data_rescisao` | `date` | `-` | `dataRescisao` | `N/A` |
| `salario` | `numeric` | `-` | `salario` | `N/A` |
| `data_criacao` | `timestamp with time zone` | `-` | `dataCriacao` | `N/A` |
| `data_atualizacao` | `timestamp with time zone` | `-` | `dataAtualizacao` | `N/A` |
| `usuario_criacao` | `uuid` | `-` | `usuarioCriacao` | `N/A` |
| `usuario_atualizacao` | `uuid` | `-` | `usuarioAtualizacao` | `N/A` |
| `ativo` | `boolean` | `-` | `ativo` | `N/A` |
| `observacoes` | `text` | `-` | `observacoes` | `N/A` |

### 📋 Tabela: `inventory_adjustments`
* **Tradução da Tabela (PT):** `ajustes_inventario`
* **Rota da API (Backend):** `/api/assets/inventory/adjustments`
* **Interface TypeScript (TS):** `InventoryAdjustment`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/assets/inventory/adjustments` |
| `contagem_estoque_id` | `uuid` | `id_contagem_estoque` | `contagemEstoqueId` | `/api/assets/inventory/adjustments` |
| `asset_id` | `uuid` | `id_ativo` | `idAtivo` | `/api/assets/inventory/adjustments` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/assets/inventory/adjustments` |
| `tipo_ajuste` | `character varying` | `-` | `tipoAjuste` | `/api/assets/inventory/adjustments` |
| `quantidade` | `integer` | `-` | `quantidade` | `/api/assets/inventory/adjustments` |
| `motivo` | `text` | `-` | `motivo` | `/api/assets/inventory/adjustments` |
| `justificativa` | `text` | `-` | `justificativa` | `/api/assets/inventory/adjustments` |
| `aprovado_por` | `character varying` | `-` | `aprovadoPor` | `/api/assets/inventory/adjustments` |
| `lancamento_contabil` | `boolean` | `-` | `lancamentoContabil` | `/api/assets/inventory/adjustments` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/assets/inventory/adjustments` |

### 📋 Tabela: `inventory_counts`
* **Tradução da Tabela (PT):** `contagens_inventario`
* **Rota da API (Backend):** `/api/assets/inventory/counts`
* **Interface TypeScript (TS):** `InventoryCount`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/assets/inventory/counts` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/assets/inventory/counts` |
| `data_contagem` | `date` | `-` | `dataContagem` | `/api/assets/inventory/counts` |
| `contagem_por` | `character varying` | `-` | `contagemPor` | `/api/assets/inventory/counts` |
| `revisado_por` | `character varying` | `-` | `revisadoPor` | `/api/assets/inventory/counts` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/assets/inventory/counts` |
| `total_ativos` | `integer` | `-` | `totalAtivos` | `/api/assets/inventory/counts` |
| `total_esperado` | `integer` | `-` | `totalEsperado` | `/api/assets/inventory/counts` |
| `total_encontrado` | `integer` | `-` | `totalEncontrado` | `/api/assets/inventory/counts` |
| `diferenca_total` | `integer` | `-` | `diferencaTotal` | `/api/assets/inventory/counts` |
| `percentual_conclusao` | `numeric` | `-` | `percentualConclusao` | `/api/assets/inventory/counts` |
| `iniciado` | `timestamp with time zone` | `-` | `iniciado` | `/api/assets/inventory/counts` |
| `concluido` | `timestamp with time zone` | `-` | `concluido` | `/api/assets/inventory/counts` |

### 📋 Tabela: `inventory_items`
* **Tradução da Tabela (PT):** `itens_inventario`
* **Rota da API (Backend):** `/api/assets/inventory/items`
* **Interface TypeScript (TS):** `InventoryItem`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/assets/inventory/items` |
| `contagem_estoque_id` | `uuid` | `id_contagem_estoque` | `contagemEstoqueId` | `/api/assets/inventory/items` |
| `ativo_id` | `uuid` | `-` | `ativoId` | `/api/assets/inventory/items` |
| `nome_ativo` | `character varying` | `-` | `nomeAtivo` | `/api/assets/inventory/items` |
| `categoria` | `USER-DEFINED` | `-` | `categoria` | `/api/assets/inventory/items` |
| `quantidade_esperada` | `integer` | `-` | `quantidadeEsperada` | `/api/assets/inventory/items` |
| `quantidade_contada` | `integer` | `-` | `quantidadeContada` | `/api/assets/inventory/items` |
| `diferenca` | `integer` | `-` | `diferenca` | `/api/assets/inventory/items` |
| `condicao` | `character varying` | `-` | `condicao` | `/api/assets/inventory/items` |
| `location` | `character varying` | `-` | `location` | `/api/assets/inventory/items` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/assets/inventory/items` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/assets/inventory/items` |

### 📋 Tabela: `lgpd_consent_logs`
* **Tradução da Tabela (PT):** `logs_consentimento_lgpd`
* **Rota da API (Backend):** `/api/lgpd/consent`
* **Interface TypeScript (TS):** `LgpdConsentLog`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/lgpd/consent` |
| `id_membro` | `uuid` | `id_membro` | `idMembro` | `/api/lgpd/consent` |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `/api/lgpd/consent` |
| `politica_id` | `uuid` | `id_politica` | `politicaId` | `/api/lgpd/consent` |
| `tipo_consentimento` | `character varying` | `-` | `tipoConsentimento` | `/api/lgpd/consent` |
| `granted` | `boolean` | `-` | `granted` | `/api/lgpd/consent` |
| `endereco_ip` | `inet` | `-` | `enderecoIp` | `/api/lgpd/consent` |
| `agente_usuario` | `text` | `-` | `agenteUsuario` | `/api/lgpd/consent` |
| `data_consentimento` | `timestamp with time zone` | `-` | `dataConsentimento` | `/api/lgpd/consent` |

### 📋 Tabela: `lgpd_policies`
* **Tradução da Tabela (PT):** `politicas_lgpd`
* **Rota da API (Backend):** `/api/lgpd/policies`
* **Interface TypeScript (TS):** `LgpdPolicy`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/lgpd/policies` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/lgpd/policies` |
| `versao` | `character varying` | `-` | `versao` | `/api/lgpd/policies` |
| `titulo` | `character varying` | `-` | `titulo` | `/api/lgpd/policies` |
| `conteudo` | `text` | `-` | `conteudo` | `/api/lgpd/policies` |
| `esta_ativa` | `boolean` | `-` | `estaAtiva` | `/api/lgpd/policies` |
| `obrigatorio` | `boolean` | `-` | `obrigatorio` | `/api/lgpd/policies` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/lgpd/policies` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/lgpd/policies` |

### 📋 Tabela: `member_contributions`
* **Tradução da Tabela (PT):** `contribuicoes_membros`
* **Rota da API (Backend):** `/api/members/:id/contributions`
* **Interface TypeScript (TS):** `MemberContribution`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/members/:id/contributions` |
| `id_membro` | `uuid` | `id_membro` | `idMembro` | `/api/members/:id/contributions` |
| `valor` | `numeric` | `-` | `valor` | `/api/members/:id/contributions` |
| `data_contribuicao` | `date` | `-` | `dataContribuicao` | `/api/members/:id/contributions` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/members/:id/contributions` |
| `descricao` | `text` | `-` | `descricao` | `/api/members/:id/contributions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/members/:id/contributions` |

### 📋 Tabela: `member_dependents`
* **Tradução da Tabela (PT):** `dependentes_membros`
* **Rota da API (Backend):** `/api/members/:id/dependents`
* **Interface TypeScript (TS):** `Dependent`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/members/:id/dependents` |
| `id_membro` | `uuid` | `id_membro` | `idMembro` | `/api/members/:id/dependents` |
| `nome` | `text` | `-` | `nome` | `/api/members/:id/dependents` |
| `data_nascimento` | `date` | `-` | `dataNascimento` | `/api/members/:id/dependents` |
| `parentesco` | `text` | `-` | `parentesco` | `/api/members/:id/dependents` |
| `cpf` | `text` | `-` | `cpf` | `/api/members/:id/dependents` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/members/:id/dependents` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/members/:id/dependents` |

### 📋 Tabela: `membros`
* **Tradução da Tabela (PT):** `membros`
* **Rota da API (Backend):** `/api/members`
* **Interface TypeScript (TS):** `Membro`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/members` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/members` |
| `nome` | `text` | `-` | `nome` | `/api/members` |
| `cpf` | `text` | `-` | `cpf` | `/api/members` |
| `rg` | `text` | `-` | `rg` | `/api/members` |
| `email` | `text` | `email` | `email` | `/api/members` |
| `telefone` | `text` | `-` | `telefone` | `/api/members` |
| `whatsapp` | `text` | `-` | `whatsapp` | `/api/members` |
| `data_nascimento` | `date` | `-` | `dataNascimento` | `/api/members` |
| `sexo` | `text` | `-` | `sexo` | `/api/members` |
| `estado_civil` | `text` | `-` | `estadoCivil` | `/api/members` |
| `logradouro` | `text` | `-` | `logradouro` | `/api/members` |
| `bairro` | `text` | `-` | `bairro` | `/api/members` |
| `cidade` | `text` | `-` | `cidade` | `/api/members` |
| `estado` | `text` | `-` | `estado` | `/api/members` |
| `cep` | `text` | `-` | `cep` | `/api/members` |
| `data_conversao` | `date` | `-` | `dataConversao` | `/api/members` |
| `data_batismo` | `text` | `-` | `dataBatismo` | `/api/members` |
| `data_membro` | `date` | `-` | `dataMembro` | `/api/members` |
| `status` | `text` | `situacao` | `situacao` | `/api/members` |
| `funcao` | `text` | `-` | `funcao` | `/api/members` |
| `ministerio` | `text` | `-` | `ministerio` | `/api/members` |
| `grupo_pequeno` | `text` | `-` | `grupoPequeno` | `/api/members` |
| `dizimista` | `boolean` | `-` | `ehDizimista` | `/api/members` |
| `ofertante` | `boolean` | `-` | `ofertante` | `/api/members` |
| `valor_dizimo` | `numeric` | `-` | `valorDizimo` | `/api/members` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/members` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/members` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/members` |
| `dados_perfil` | `jsonb` | `dados_perfil` | `dadosPerfil` | `/api/members` |
| `matricula` | `character varying` | `matricula` | `matricula` | `/api/members` |
| `profissao` | `character varying` | `profissao` | `profissao` | `/api/members` |
| `nome_conjuge` | `character varying` | `-` | `nomeConjuge` | `/api/members` |
| `data_casamento` | `date` | `-` | `dataCasamento` | `/api/members` |
| `nome_pai` | `character varying` | `-` | `nomePai` | `/api/members` |
| `nome_mae` | `character varying` | `-` | `nomeMae` | `/api/members` |
| `tipo_sanguineo` | `character varying` | `-` | `tipoSanguineo` | `/api/members` |
| `contato_emergencia` | `character varying` | `-` | `contatoEmergencia` | `/api/members` |
| `numero` | `character varying` | `-` | `numero` | `/api/members` |
| `complemento` | `character varying` | `-` | `complemento` | `/api/members` |
| `local_conversao` | `character varying` | `-` | `localConversao` | `/api/members` |
| `igreja_batismo` | `character varying` | `-` | `igrejaBatismo` | `/api/members` |
| `pastor_batizador` | `character varying` | `-` | `pastorBatizador` | `/api/members` |
| `batismo_espirito_santo` | `boolean` | `-` | `batismoEspiritoSanto` | `/api/members` |
| `igreja_origem` | `character varying` | `-` | `igrejaOrigem` | `/api/members` |
| `curso_discipulado` | `character varying` | `-` | `cursoDiscipulado` | `/api/members` |
| `escola_biblica` | `character varying` | `-` | `escolaBiblica` | `/api/members` |
| `ministerio_principal` | `character varying` | `-` | `ministerioPrincipal` | `/api/members` |
| `funcao_ministerio` | `character varying` | `-` | `funcaoMinisterio` | `/api/members` |
| `outros_ministerios` | `ARRAY` | `-` | `outrosMinisterios` | `/api/members` |
| `cargo_eclesiastico` | `character varying` | `-` | `cargoEclesiastico` | `/api/members` |
| `data_consagracao` | `date` | `-` | `dataConsagracao` | `/api/members` |
| `ofertante_regular` | `boolean` | `-` | `ehOfertanteRegular` | `/api/members` |
| `participa_campanhas` | `boolean` | `-` | `participaCampanhas` | `/api/members` |
| `banco` | `character varying` | `-` | `banco` | `/api/members` |
| `agencia_bancaria` | `character varying` | `-` | `agenciaBancaria` | `/api/members` |
| `conta_bancaria` | `character varying` | `-` | `contaBancaria` | `/api/members` |
| `chave_pix` | `character varying` | `-` | `chavePix` | `/api/members` |
| `necessidades_especiais` | `text` | `-` | `necessidadesEspeciais` | `/api/members` |
| `talentos` | `text` | `-` | `talentos` | `/api/members` |
| `tags` | `ARRAY` | `-` | `tags` | `/api/members` |
| `familia_id` | `uuid` | `id_familia` | `familiaId` | `/api/members` |
| `avatar` | `text` | `avatar` | `avatar` | `/api/members` |
| `cell_group` | `character varying` | `cell_group` | `cellGroup` | `/api/members` |
| `dons_espirituais` | `character varying` | `dons_espirituais` | `donsEspirituais` | `/api/members` |
| `escolaridade` | `character varying` | `escolaridade` | `escolaridade` | `/api/members` |
| `is_pcd` | `boolean` | `is_pcd` | `isPcd` | `/api/members` |
| `tipo_deficiencia` | `character varying` | `tipo_deficiencia` | `tipoDeficiencia` | `/api/members` |
| `celular` | `character varying` | `-` | `celular` | `/api/members` |
| `lgpd_consent` | `jsonb` | `lgpd_consent` | `lgpdConsent` | `/api/members` |

### 📋 Tabela: `payroll`
* **Tradução da Tabela (PT):** `folha_pagamento`
* **Rota da API (Backend):** `/api/payroll`
* **Interface TypeScript (TS):** `Payroll`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/payroll` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/payroll` |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `/api/payroll` |
| `month` | `integer` | `-` | `month` | `/api/payroll` |
| `year` | `integer` | `-` | `year` | `/api/payroll` |
| `data_referencia` | `date` | `-` | `dataReferencia` | `/api/payroll` |
| `salario_base` | `numeric` | `-` | `salarioBase` | `/api/payroll` |
| `horas_extras_50` | `numeric` | `-` | `horasExtras_50` | `/api/payroll` |
| `horas_extras_100` | `numeric` | `-` | `horasExtras_100` | `/api/payroll` |
| `adicional_noturno` | `numeric` | `-` | `adicionalNoturno` | `/api/payroll` |
| `insalubridade` | `numeric` | `-` | `insalubridade` | `/api/payroll` |
| `periculosidade` | `numeric` | `-` | `periculosidade` | `/api/payroll` |
| `comissoes` | `numeric` | `-` | `comissoes` | `/api/payroll` |
| `gratificacoes` | `numeric` | `-` | `gratificacoes` | `/api/payroll` |
| `outros_proventos` | `numeric` | `-` | `outrosProventos` | `/api/payroll` |
| `inss` | `numeric` | `-` | `inss` | `/api/payroll` |
| `irrf` | `numeric` | `-` | `irrf` | `/api/payroll` |
| `fgts` | `numeric` | `-` | `fgts` | `/api/payroll` |
| `pensao_alimenticia` | `numeric` | `-` | `pensaoAlimenticia` | `/api/payroll` |
| `adiantamento` | `numeric` | `-` | `adiantamento` | `/api/payroll` |
| `faltas` | `numeric` | `-` | `faltas` | `/api/payroll` |
| `atrasos` | `numeric` | `-` | `atrasos` | `/api/payroll` |
| `outras_deducoes` | `numeric` | `-` | `outrasDeducoes` | `/api/payroll` |
| `total_proventos` | `numeric` | `-` | `totalProventos` | `/api/payroll` |
| `total_deducoes` | `numeric` | `-` | `totalDeducoes` | `/api/payroll` |
| `salario_liquido` | `numeric` | `-` | `salarioLiquido` | `/api/payroll` |
| `inss_patronal` | `numeric` | `-` | `inssPatronal` | `/api/payroll` |
| `fgts_patronal` | `numeric` | `-` | `fgtsPatronal` | `/api/payroll` |
| `rat` | `numeric` | `-` | `rat` | `/api/payroll` |
| `terceiros` | `numeric` | `-` | `terceiros` | `/api/payroll` |
| `total_encargos` | `numeric` | `-` | `totalEncargos` | `/api/payroll` |
| `status` | `text` | `situacao` | `situacao` | `/api/payroll` |
| `processado_por` | `uuid` | `-` | `processadoPor` | `/api/payroll` |
| `processado` | `timestamp with time zone` | `-` | `processado` | `/api/payroll` |
| `notes` | `text` | `observacoes` | `observacoes` | `/api/payroll` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/payroll` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/payroll` |

### 📋 Tabela: `payroll_calculations`
* **Tradução da Tabela (PT):** `calculos_folha`
* **Rota da API (Backend):** `/api/payroll/calculations`
* **Interface TypeScript (TS):** `PayrollCalculation`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/payroll/calculations` |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `/api/payroll/calculations` |
| `mes_competencia` | `character varying` | `-` | `mesCompetencia` | `/api/payroll/calculations` |
| `salario_bruto` | `numeric` | `-` | `salarioBruto` | `/api/payroll/calculations` |
| `salario_base` | `numeric` | `-` | `salarioBase` | `/api/payroll/calculations` |
| `horas_extras` | `numeric` | `-` | `horasExtras` | `/api/payroll/calculations` |
| `adicional_noturno` | `numeric` | `-` | `adicionalNoturno` | `/api/payroll/calculations` |
| `insalubridade` | `numeric` | `-` | `insalubridade` | `/api/payroll/calculations` |
| `comissao` | `numeric` | `-` | `comissao` | `/api/payroll/calculations` |
| `bonificacoes` | `numeric` | `-` | `bonificacoes` | `/api/payroll/calculations` |
| `salario_familia` | `numeric` | `-` | `salarioFamilia` | `/api/payroll/calculations` |
| `outros_proventos` | `numeric` | `-` | `outrosProventos` | `/api/payroll/calculations` |
| `inss` | `numeric` | `-` | `inss` | `/api/payroll/calculations` |
| `irrf` | `numeric` | `-` | `irrf` | `/api/payroll/calculations` |
| `fgts` | `numeric` | `-` | `fgts` | `/api/payroll/calculations` |
| `union` | `numeric` | `-` | `union` | `/api/payroll/calculations` |
| `plano_saude` | `numeric` | `-` | `planoSaude` | `/api/payroll/calculations` |
| `plano_odontologico` | `numeric` | `-` | `planoOdontologico` | `/api/payroll/calculations` |
| `vale_alimentacao` | `numeric` | `-` | `valeAlimentacao` | `/api/payroll/calculations` |
| `vale_refeicao` | `numeric` | `-` | `valeRefeicao` | `/api/payroll/calculations` |
| `transporte` | `numeric` | `-` | `transporte` | `/api/payroll/calculations` |
| `pharmacy` | `numeric` | `-` | `pharmacy` | `/api/payroll/calculations` |
| `life_insurance` | `numeric` | `-` | `lifeInsurance` | `/api/payroll/calculations` |
| `adiantamento` | `numeric` | `-` | `adiantamento` | `/api/payroll/calculations` |
| `consignado` | `numeric` | `-` | `consignado` | `/api/payroll/calculations` |
| `coparticipacao` | `numeric` | `-` | `coparticipacao` | `/api/payroll/calculations` |
| `faltas` | `numeric` | `-` | `faltas` | `/api/payroll/calculations` |
| `atrasos` | `numeric` | `-` | `atrasos` | `/api/payroll/calculations` |
| `pensao_alimenticia` | `numeric` | `-` | `pensaoAlimenticia` | `/api/payroll/calculations` |
| `outras_deducoes` | `numeric` | `-` | `outrasDeducoes` | `/api/payroll/calculations` |
| `total_proventos` | `numeric` | `-` | `totalProventos` | `/api/payroll/calculations` |
| `total_descontos` | `numeric` | `-` | `totalDescontos` | `/api/payroll/calculations` |
| `salario_liquido` | `numeric` | `-` | `salarioLiquido` | `/api/payroll/calculations` |
| `custo_empregador` | `numeric` | `-` | `custoEmpregador` | `/api/payroll/calculations` |
| `base_inss` | `numeric` | `-` | `baseInss` | `/api/payroll/calculations` |
| `aliquota_inss` | `numeric` | `-` | `aliquotaInss` | `/api/payroll/calculations` |
| `valor_inss` | `numeric` | `-` | `valorInss` | `/api/payroll/calculations` |
| `base_irrf` | `numeric` | `-` | `baseIrrf` | `/api/payroll/calculations` |
| `aliquota_irrf` | `numeric` | `-` | `aliquotaIrrf` | `/api/payroll/calculations` |
| `deducao_irrf` | `numeric` | `-` | `deducaoIrrf` | `/api/payroll/calculations` |
| `valor_irrf` | `numeric` | `-` | `valorIrrf` | `/api/payroll/calculations` |
| `base_fgts` | `numeric` | `-` | `baseFgts` | `/api/payroll/calculations` |
| `aliquota_fgts` | `numeric` | `-` | `aliquotaFgts` | `/api/payroll/calculations` |
| `valor_fgts` | `numeric` | `-` | `valorFgts` | `/api/payroll/calculations` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/payroll/calculations` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/payroll/calculations` |

### 📋 Tabela: `payroll_periods`
* **Tradução da Tabela (PT):** `periodos_folha`
* **Rota da API (Backend):** `/api/payroll/periods`
* **Interface TypeScript (TS):** `PayrollPeriod`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/payroll/periods` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/payroll/periods` |
| `mes` | `integer` | `-` | `mes` | `/api/payroll/periods` |
| `ano` | `integer` | `-` | `ano` | `/api/payroll/periods` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/payroll/periods` |
| `data_inicio` | `date` | `-` | `dataInicio` | `/api/payroll/periods` |
| `data_final` | `date` | `-` | `dataFinal` | `/api/payroll/periods` |
| `processado` | `timestamp with time zone` | `-` | `processado` | `/api/payroll/periods` |
| `fechado` | `timestamp with time zone` | `-` | `fechado` | `/api/payroll/periods` |
| `total_funcionarios` | `integer` | `-` | `totalFuncionarios` | `/api/payroll/periods` |
| `total_folha` | `numeric` | `-` | `totalFolha` | `/api/payroll/periods` |
| `total_inss` | `numeric` | `-` | `totalInss` | `/api/payroll/periods` |
| `total_fgts` | `numeric` | `-` | `totalFgts` | `/api/payroll/periods` |
| `total_irrf` | `numeric` | `-` | `totalIrrf` | `/api/payroll/periods` |
| `criado_por` | `uuid` | `-` | `criadoPor` | `/api/payroll/periods` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/payroll/periods` |

### 📋 Tabela: `pdi_plans`
* **Tradução da Tabela (PT):** `planos_pdi`
* **Rota da API (Backend):** `/api/rh/pdi`
* **Interface TypeScript (TS):** `PdiPlan`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/rh/pdi` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/rh/pdi` |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `/api/rh/pdi` |
| `nome_funcionario` | `character varying` | `-` | `nomeFuncionario` | `/api/rh/pdi` |
| `meta` | `text` | `-` | `meta` | `/api/rh/pdi` |
| `prazo` | `date` | `-` | `prazo` | `/api/rh/pdi` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/rh/pdi` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/rh/pdi` |
| `created_by` | `character varying` | `criado_por` | `criadoPor` | `/api/rh/pdi` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/rh/pdi` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/rh/pdi` |

### 📋 Tabela: `perfil_permissoes`
* **Tradução da Tabela (PT):** `perfil_permissoes`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `PerfilPermissao`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/auth/permissions` |
| `id_perfil` | `uuid` | `id_perfil` | `idPerfil` | `/api/auth/permissions` |
| `id_permissao` | `uuid` | `id_permissao` | `idPermissao` | `/api/auth/permissions` |

### 📋 Tabela: `perfis`
* **Tradução da Tabela (PT):** `perfis`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `Perfil`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id_perfil` | `uuid` | `id_perfil` | `idPerfil` | `/api/auth/permissions` |
| `nome` | `character varying` | `-` | `nome` | `/api/auth/permissions` |

### 📋 Tabela: `performance_evaluations`
* **Tradução da Tabela (PT):** `avaliacoes_desempenho`
* **Rota da API (Backend):** `/api/rh/evaluations`
* **Interface TypeScript (TS):** `PerformanceEvaluation`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/rh/evaluations` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/rh/evaluations` |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `/api/rh/evaluations` |
| `nome_funcionario` | `character varying` | `-` | `nomeFuncionario` | `/api/rh/evaluations` |
| `data_avaliacao` | `date` | `-` | `dataAvaliacao` | `/api/rh/evaluations` |
| `tipo_avaliacao` | `character varying` | `-` | `tipoAvaliacao` | `/api/rh/evaluations` |
| `nota_geral` | `numeric` | `-` | `notaGeral` | `/api/rh/evaluations` |
| `conceito_geral` | `character varying` | `-` | `conceitoGeral` | `/api/rh/evaluations` |
| `competencias` | `jsonb` | `-` | `competencias` | `/api/rh/evaluations` |
| `metas` | `jsonb` | `-` | `metas` | `/api/rh/evaluations` |
| `pontos_fortes` | `text` | `-` | `pontosFortes` | `/api/rh/evaluations` |
| `melhorias` | `text` | `-` | `melhorias` | `/api/rh/evaluations` |
| `plano_acao` | `text` | `-` | `planoAcao` | `/api/rh/evaluations` |
| `status` | `character varying` | `situacao` | `situacao` | `/api/rh/evaluations` |
| `avaliado_por` | `character varying` | `-` | `avaliadoPor` | `/api/rh/evaluations` |
| `aprovado_por` | `character varying` | `-` | `aprovadoPor` | `/api/rh/evaluations` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/rh/evaluations` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/rh/evaluations` |

### 📋 Tabela: `permission_modules`
* **Tradução da Tabela (PT):** `modulos_permissao`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `PermissionModule`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/auth/permissions` |
| `codigo` | `character varying` | `-` | `codigo` | `/api/auth/permissions` |
| `nome_modulo` | `character varying` | `-` | `nomeModulo` | `/api/auth/permissions` |
| `categoria` | `character varying` | `-` | `categoria` | `/api/auth/permissions` |
| `descricao` | `text` | `-` | `descricao` | `/api/auth/permissions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/auth/permissions` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/auth/permissions` |

### 📋 Tabela: `permissoes`
* **Tradução da Tabela (PT):** `permissoes`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `Permissao`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id_permissao` | `uuid` | `id_permissao` | `idPermissao` | `/api/auth/permissions` |
| `nome` | `character varying` | `-` | `nome` | `/api/auth/permissions` |

### 📋 Tabela: `pessoas`
* **Tradução da Tabela (PT):** `pessoas`
* **Rota da API (Backend):** `/api/members`
* **Interface TypeScript (TS):** `Pessoa`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id_pessoa` | `uuid` | `id_pessoa` | `idPessoa` | `/api/members` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/members` |
| `nome` | `character varying` | `-` | `nome` | `/api/members` |
| `cpf` | `character varying` | `-` | `cpf` | `/api/members` |
| `rg` | `character varying` | `-` | `rg` | `/api/members` |
| `data_nascimento` | `date` | `-` | `dataNascimento` | `/api/members` |
| `sexo` | `character varying` | `-` | `sexo` | `/api/members` |
| `estado_civil` | `character varying` | `-` | `estadoCivil` | `/api/members` |
| `email` | `character varying` | `email` | `email` | `/api/members` |
| `telefone` | `character varying` | `-` | `telefone` | `/api/members` |
| `celular` | `character varying` | `-` | `celular` | `/api/members` |
| `whatsapp` | `boolean` | `-` | `whatsapp` | `/api/members` |
| `tipo_sanguineo` | `character varying` | `-` | `tipoSanguineo` | `/api/members` |
| `contato_emergencia` | `character varying` | `-` | `contatoEmergencia` | `/api/members` |
| `pcd` | `boolean` | `-` | `pcd` | `/api/members` |
| `tipo_deficiencia` | `character varying` | `tipo_deficiencia` | `tipoDeficiencia` | `/api/members` |
| `endereco` | `character varying` | `-` | `endereco` | `/api/members` |
| `numero` | `character varying` | `-` | `numero` | `/api/members` |
| `complemento` | `character varying` | `-` | `complemento` | `/api/members` |
| `bairro` | `character varying` | `-` | `bairro` | `/api/members` |
| `cidade` | `character varying` | `-` | `cidade` | `/api/members` |
| `estado` | `character varying` | `-` | `estado` | `/api/members` |
| `cep` | `character varying` | `-` | `cep` | `/api/members` |
| `pais` | `character varying` | `-` | `pais` | `/api/members` |
| `data_criacao` | `timestamp with time zone` | `-` | `dataCriacao` | `/api/members` |
| `data_atualizacao` | `timestamp with time zone` | `-` | `dataAtualizacao` | `/api/members` |
| `usuario_criacao` | `uuid` | `-` | `usuarioCriacao` | `/api/members` |
| `usuario_atualizacao` | `uuid` | `-` | `usuarioAtualizacao` | `/api/members` |
| `ativo` | `boolean` | `-` | `ativo` | `/api/members` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/members` |

### 📋 Tabela: `role_permissions`
* **Tradução da Tabela (PT):** `permissoes_perfil`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `RolePermission`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/auth/permissions` |
| `funcao` | `text` | `-` | `funcao` | `/api/auth/permissions` |
| `recurso` | `text` | `-` | `recurso` | `/api/auth/permissions` |
| `ler` | `boolean` | `-` | `ler` | `/api/auth/permissions` |
| `escrever` | `boolean` | `-` | `escrever` | `/api/auth/permissions` |
| `excluir` | `boolean` | `-` | `excluir` | `/api/auth/permissions` |
| `administrador` | `boolean` | `-` | `administrador` | `/api/auth/permissions` |
| `codigo_modulo` | `character varying` | `-` | `codigoModulo` | `/api/auth/permissions` |
| `gerenciar` | `boolean` | `-` | `gerenciar` | `/api/auth/permissions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/auth/permissions` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/auth/permissions` |

### 📋 Tabela: `schema_migrations`
* **Tradução da Tabela (PT):** `migracoes_schema`
* **Rota da API (Backend):** `Interna PostgreSQL`
* **Interface TypeScript (TS):** `N/A`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `version` | `character varying` | `-` | `version` | `Interna PostgreSQL` |
| `applied_at` | `timestamp with time zone` | `-` | `appliedAt` | `Interna PostgreSQL` |

### 📋 Tabela: `system_logs`
* **Tradução da Tabela (PT):** `logs_sistema`
* **Rota da API (Backend):** `/api/audit/system`
* **Interface TypeScript (TS):** `SystemLog`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/audit/system` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/audit/system` |
| `usuario_id` | `uuid` | `id_usuario` | `usuarioId` | `/api/audit/system` |
| `acao` | `text` | `-` | `acao` | `/api/audit/system` |
| `tipo_recurso` | `text` | `-` | `tipoRecurso` | `/api/audit/system` |
| `id_recurso` | `uuid` | `id_recurso` | `idRecurso` | `/api/audit/system` |
| `valores_anteriores` | `jsonb` | `-` | `valoresAnteriores` | `/api/audit/system` |
| `valores_novos` | `jsonb` | `-` | `valoresNovos` | `/api/audit/system` |
| `endereco_ip` | `text` | `-` | `enderecoIp` | `/api/audit/system` |
| `agente_usuario` | `text` | `-` | `agenteUsuario` | `/api/audit/system` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/audit/system` |

### 📋 Tabela: `tax_configs`
* **Tradução da Tabela (PT):** `configuracoes_tributarias`
* **Rota da API (Backend):** `/api/payroll/tax-configs`
* **Interface TypeScript (TS):** `TaxConfig`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/payroll/tax-configs` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/payroll/tax-configs` |
| `faixa_inss` | `jsonb` | `-` | `faixaInss` | `/api/payroll/tax-configs` |
| `faixa_irrf` | `jsonb` | `-` | `faixaIrrf` | `/api/payroll/tax-configs` |
| `taxa_fgts` | `numeric` | `-` | `taxaFgts` | `/api/payroll/tax-configs` |
| `taxa_patronal` | `numeric` | `-` | `taxaPatronal` | `/api/payroll/tax-configs` |
| `taxa_rat` | `numeric` | `-` | `taxaRat` | `/api/payroll/tax-configs` |
| `terceiros_rate` | `numeric` | `-` | `terceirosRate` | `/api/payroll/tax-configs` |
| `va_default` | `numeric` | `-` | `vaDefault` | `/api/payroll/tax-configs` |
| `vr_default` | `numeric` | `-` | `vrDefault` | `/api/payroll/tax-configs` |
| `entidades_terceiras` | `jsonb` | `-` | `entidadesTerceiras` | `/api/payroll/tax-configs` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/payroll/tax-configs` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/payroll/tax-configs` |

### 📋 Tabela: `transacoes`
* **Tradução da Tabela (PT):** `transacoes`
* **Rota da API (Backend):** `/api/transactions`
* **Interface TypeScript (TS):** `Transacao`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id_transacao` | `uuid` | `id_transacao` | `idTransacao` | `/api/transactions` |
| `id_conta` | `uuid` | `id_conta` | `idConta` | `/api/transactions` |
| `id_pessoa` | `uuid` | `id_pessoa` | `idPessoa` | `/api/transactions` |
| `descricao` | `text` | `-` | `descricao` | `/api/transactions` |
| `valor` | `numeric` | `-` | `valor` | `/api/transactions` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/transactions` |
| `data_pagamento` | `date` | `-` | `dataPagamento` | `/api/transactions` |
| `data_criacao` | `timestamp with time zone` | `-` | `dataCriacao` | `/api/transactions` |
| `data_atualizacao` | `timestamp with time zone` | `-` | `dataAtualizacao` | `/api/transactions` |
| `usuario_criacao` | `uuid` | `-` | `usuarioCriacao` | `/api/transactions` |
| `ativo` | `boolean` | `-` | `ativo` | `/api/transactions` |

### 📋 Tabela: `transactions`
* **Tradução da Tabela (PT):** `transacoes`
* **Rota da API (Backend):** `/api/transactions`
* **Interface TypeScript (TS):** `Transacao`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/transactions` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/transactions` |
| `descricao` | `text` | `-` | `descricao` | `/api/transactions` |
| `valor` | `numeric` | `-` | `valor` | `/api/transactions` |
| `tipo_transacao` | `text` | `-` | `tipoTransacao` | `/api/transactions` |
| `id_conta` | `uuid` | `id_conta` | `idConta` | `/api/transactions` |
| `data_transacao` | `date` | `-` | `dataTransacao` | `/api/transactions` |
| `data_vencimento` | `date` | `-` | `dataVencimento` | `/api/transactions` |
| `data_pagamento` | `date` | `-` | `dataPagamento` | `/api/transactions` |
| `situacao` | `text` | `-` | `situacao` | `/api/transactions` |
| `forma_pagamento` | `text` | `-` | `formaPagamento` | `/api/transactions` |
| `categoria` | `text` | `-` | `categoria` | `/api/transactions` |
| `centro_custo` | `text` | `-` | `centroCusto` | `/api/transactions` |
| `natureza_operacao` | `text` | `-` | `naturezaOperacao` | `/api/transactions` |
| `nome_fornecedor` | `text` | `-` | `nomeFornecedor` | `/api/transactions` |
| `id_membro` | `uuid` | `id_membro` | `idMembro` | `/api/transactions` |
| `conciliado` | `boolean` | `-` | `conciliado` | `/api/transactions` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/transactions` |
| `created_by` | `uuid` | `criado_por` | `criadoPor` | `/api/transactions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/transactions` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/transactions` |
| `data_competencia` | `date` | `-` | `dataCompetencia` | `/api/transactions` |
| `projeto_id` | `uuid` | `-` | `projetoId` | `/api/transactions` |
| `valor_pago` | `numeric` | `-` | `valorPago` | `/api/transactions` |
| `valor_restante` | `numeric` | `-` | `valorRestante` | `/api/transactions` |
| `parcelado` | `boolean` | `-` | `parcelado` | `/api/transactions` |
| `numero_parcela` | `integer` | `-` | `numeroParcela` | `/api/transactions` |
| `total_parcelas` | `integer` | `-` | `totalParcelas` | `/api/transactions` |
| `id_transacao_origem` | `uuid` | `id_transacao_origem` | `idTransacaoOrigem` | `/api/transactions` |
| `data_conciliacao` | `date` | `-` | `dataConciliacao` | `/api/transactions` |
| `id_externo` | `character varying` | `id_externo` | `idExterno` | `/api/transactions` |

### 📋 Tabela: `treasury_alerts`
* **Tradução da Tabela (PT):** `alertas_tesouraria`
* **Rota da API (Backend):** `/api/treasury/alerts`
* **Interface TypeScript (TS):** `TreasuryAlert`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/alerts` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/alerts` |
| `tipo_alerta` | `character varying` | `-` | `tipoAlerta` | `/api/treasury/alerts` |
| `titulo_alerta` | `character varying` | `-` | `tituloAlerta` | `/api/treasury/alerts` |
| `descricao_alerta` | `text` | `-` | `descricaoAlerta` | `/api/treasury/alerts` |
| `nivel_gravidade` | `character varying` | `-` | `nivelGravidade` | `/api/treasury/alerts` |
| `id_conta` | `uuid` | `id_conta` | `idConta` | `/api/treasury/alerts` |
| `investimento_id` | `uuid` | `id_investimento` | `investimentoId` | `/api/treasury/alerts` |
| `emprestimo_id` | `uuid` | `id_emprestimo` | `emprestimoId` | `/api/treasury/alerts` |
| `valor_alerta` | `numeric` | `-` | `valorAlerta` | `/api/treasury/alerts` |
| `data_limite_alerta` | `date` | `-` | `dataLimiteAlerta` | `/api/treasury/alerts` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/treasury/alerts` |
| `acoes_sugeridas` | `jsonb` | `-` | `acoesSugeridas` | `/api/treasury/alerts` |
| `criado_por` | `character varying` | `-` | `criadoPor` | `/api/treasury/alerts` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/alerts` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/treasury/alerts` |

### 📋 Tabela: `treasury_cash_flows`
* **Tradução da Tabela (PT):** `fluxos_caixa_tesouraria`
* **Rota da API (Backend):** `/api/treasury/cash-flows`
* **Interface TypeScript (TS):** `TreasuryCashFlow`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/cash-flows` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/cash-flows` |
| `data_movimento` | `date` | `-` | `dataMovimento` | `/api/treasury/cash-flows` |
| `descricao_movimento` | `text` | `-` | `descricaoMovimento` | `/api/treasury/cash-flows` |
| `categoria_movimento` | `character varying` | `-` | `categoriaMovimento` | `/api/treasury/cash-flows` |
| `valor_movimento` | `numeric` | `-` | `valorMovimento` | `/api/treasury/cash-flows` |
| `tipo_movimento` | `character varying` | `-` | `tipoMovimento` | `/api/treasury/cash-flows` |
| `id_conta` | `uuid` | `id_conta` | `idConta` | `/api/treasury/cash-flows` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/treasury/cash-flows` |
| `observacoes_movimento` | `text` | `-` | `observacoesMovimento` | `/api/treasury/cash-flows` |
| `criado_por` | `character varying` | `-` | `criadoPor` | `/api/treasury/cash-flows` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/cash-flows` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/treasury/cash-flows` |

### 📋 Tabela: `treasury_financial_positions`
* **Tradução da Tabela (PT):** `posicoes_financeiras_tesouraria`
* **Rota da API (Backend):** `/api/treasury/positions`
* **Interface TypeScript (TS):** `TreasuryFinancialPosition`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/positions` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/positions` |
| `data` | `date` | `-` | `data` | `/api/treasury/positions` |
| `ativo_total` | `numeric` | `-` | `ativoTotal` | `/api/treasury/positions` |
| `passivo_total` | `numeric` | `-` | `passivoTotal` | `/api/treasury/positions` |
| `patrimonio_liquido` | `numeric` | `-` | `patrimonioLiquido` | `/api/treasury/positions` |
| `disponibilidades` | `numeric` | `-` | `disponibilidades` | `/api/treasury/positions` |
| `aplicacoes` | `numeric` | `-` | `aplicacoes` | `/api/treasury/positions` |
| `contas_receber` | `numeric` | `-` | `contasReceber` | `/api/treasury/positions` |
| `estoques` | `numeric` | `-` | `estoques` | `/api/treasury/positions` |
| `ativo_fixo` | `numeric` | `-` | `ativoFixo` | `/api/treasury/positions` |
| `fornecedores` | `numeric` | `-` | `fornecedores` | `/api/treasury/positions` |
| `emprestimos` | `numeric` | `-` | `emprestimos` | `/api/treasury/positions` |
| `outras_contas` | `numeric` | `-` | `outrasContas` | `/api/treasury/positions` |
| `variacao_patrimonial` | `numeric` | `-` | `variacaoPatrimonial` | `/api/treasury/positions` |
| `variacao_percentual` | `numeric` | `-` | `variacaoPercentual` | `/api/treasury/positions` |
| `indicadores` | `jsonb` | `-` | `indicadores` | `/api/treasury/positions` |
| `detalhamento` | `jsonb` | `-` | `detalhamento` | `/api/treasury/positions` |
| `created_by` | `character varying` | `criado_por` | `criadoPor` | `/api/treasury/positions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/positions` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/treasury/positions` |

### 📋 Tabela: `treasury_forecasts`
* **Tradução da Tabela (PT):** `previsoes_tesouraria`
* **Rota da API (Backend):** `/api/treasury/forecasts`
* **Interface TypeScript (TS):** `TreasuryForecast`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/forecasts` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/forecasts` |
| `data_inicio` | `date` | `-` | `dataInicio` | `/api/treasury/forecasts` |
| `data_final` | `date` | `-` | `dataFinal` | `/api/treasury/forecasts` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/treasury/forecasts` |
| `saldo_inicial` | `numeric` | `-` | `saldoInicial` | `/api/treasury/forecasts` |
| `entradas_previstas` | `numeric` | `-` | `entradasPrevistas` | `/api/treasury/forecasts` |
| `saidas_previstas` | `numeric` | `-` | `saidasPrevistas` | `/api/treasury/forecasts` |
| `saldo_final_previsto` | `numeric` | `-` | `saldoFinalPrevisto` | `/api/treasury/forecasts` |
| `entradas_realizadas` | `numeric` | `-` | `entradasRealizadas` | `/api/treasury/forecasts` |
| `saidas_realizadas` | `numeric` | `-` | `saidasRealizadas` | `/api/treasury/forecasts` |
| `saldo_final_real` | `numeric` | `-` | `saldoFinalReal` | `/api/treasury/forecasts` |
| `precisao` | `numeric` | `-` | `precisao` | `/api/treasury/forecasts` |
| `status` | `character varying` | `situacao` | `situacao` | `/api/treasury/forecasts` |
| `detalhes` | `jsonb` | `-` | `detalhes` | `/api/treasury/forecasts` |
| `criado_por` | `character varying` | `-` | `criadoPor` | `/api/treasury/forecasts` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/forecasts` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/treasury/forecasts` |

### 📋 Tabela: `treasury_investments`
* **Tradução da Tabela (PT):** `investimentos_tesouraria`
* **Rota da API (Backend):** `/api/treasury/investments`
* **Interface TypeScript (TS):** `TreasuryInvestment`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/investments` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/investments` |
| `nome` | `character varying` | `-` | `nome` | `/api/treasury/investments` |
| `tipo` | `character varying` | `-` | `tipo` | `/api/treasury/investments` |
| `instituicao` | `character varying` | `-` | `instituicao` | `/api/treasury/investments` |
| `data_aplicacao` | `date` | `-` | `dataAplicacao` | `/api/treasury/investments` |
| `data_vencimento` | `date` | `-` | `dataVencimento` | `/api/treasury/investments` |
| `valor_aplicado` | `numeric` | `-` | `valorAplicado` | `/api/treasury/investments` |
| `valor_atual` | `numeric` | `-` | `valorAtual` | `/api/treasury/investments` |
| `rentabilidade_anual` | `numeric` | `-` | `rentabilidadeAnual` | `/api/treasury/investments` |
| `indexador` | `character varying` | `-` | `indexador` | `/api/treasury/investments` |
| `status` | `character varying` | `situacao` | `situacao` | `/api/treasury/investments` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/treasury/investments` |
| `rendimentos` | `jsonb` | `-` | `rendimentos` | `/api/treasury/investments` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/investments` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/treasury/investments` |

### 📋 Tabela: `treasury_loans`
* **Tradução da Tabela (PT):** `emprestimos_tesouraria`
* **Rota da API (Backend):** `/api/treasury/loans`
* **Interface TypeScript (TS):** `TreasuryLoan`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/treasury/loans` |
| `unit_id` | `uuid` | `id_unidade` | `idUnidade` | `/api/treasury/loans` |
| `nome` | `character varying` | `-` | `nome` | `/api/treasury/loans` |
| `credor` | `character varying` | `-` | `credor` | `/api/treasury/loans` |
| `data_contratacao` | `date` | `-` | `dataContratacao` | `/api/treasury/loans` |
| `data_vencimento` | `date` | `-` | `dataVencimento` | `/api/treasury/loans` |
| `valor_original` | `numeric` | `-` | `valorOriginal` | `/api/treasury/loans` |
| `valor_saldo` | `numeric` | `-` | `valorSaldo` | `/api/treasury/loans` |
| `taxa_juros` | `numeric` | `-` | `taxaJuros` | `/api/treasury/loans` |
| `tipo_juros` | `character varying` | `-` | `tipoJuros` | `/api/treasury/loans` |
| `total_parcelas` | `integer` | `-` | `totalParcelas` | `/api/treasury/loans` |
| `parcelas_pagas` | `integer` | `-` | `parcelasPagas` | `/api/treasury/loans` |
| `status` | `character varying` | `situacao` | `situacao` | `/api/treasury/loans` |
| `parcelas` | `jsonb` | `-` | `parcelas` | `/api/treasury/loans` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/treasury/loans` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/treasury/loans` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/treasury/loans` |

### 📋 Tabela: `unidades`
* **Tradução da Tabela (PT):** `unidades`
* **Rota da API (Backend):** `/api/units`
* **Interface TypeScript (TS):** `Unidade`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/units` |
| `nome` | `character varying` | `-` | `nome` | `/api/units` |
| `cnpj` | `character varying` | `-` | `cnpj` | `/api/units` |
| `telefone` | `character varying` | `-` | `telefone` | `/api/units` |
| `email` | `character varying` | `email` | `email` | `/api/units` |
| `endereco` | `character varying` | `-` | `endereco` | `/api/units` |
| `numero` | `character varying` | `-` | `numero` | `/api/units` |
| `bairro` | `character varying` | `-` | `bairro` | `/api/units` |
| `cidade` | `character varying` | `-` | `cidade` | `/api/units` |
| `estado` | `character varying` | `-` | `estado` | `/api/units` |
| `cep` | `character varying` | `-` | `cep` | `/api/units` |
| `pais` | `character varying` | `-` | `pais` | `/api/units` |
| `situacao` | `character varying` | `-` | `situacao` | `/api/units` |
| `data_criacao` | `timestamp with time zone` | `-` | `dataCriacao` | `/api/units` |
| `data_atualizacao` | `timestamp with time zone` | `-` | `dataAtualizacao` | `/api/units` |
| `usuario_criacao` | `uuid` | `-` | `usuarioCriacao` | `/api/units` |
| `usuario_atualizacao` | `uuid` | `-` | `usuarioAtualizacao` | `/api/units` |
| `ativo` | `boolean` | `-` | `ativo` | `/api/units` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/units` |

### 📋 Tabela: `units`
* **Tradução da Tabela (PT):** `unidades`
* **Rota da API (Backend):** `/api/units`
* **Interface TypeScript (TS):** `Unidade`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/units` |
| `nome_unidade` | `text` | `-` | `nomeUnidade` | `/api/units` |
| `cnpj` | `text` | `-` | `cnpj` | `/api/units` |
| `endereco` | `text` | `-` | `endereco` | `/api/units` |
| `bairro` | `text` | `-` | `bairro` | `/api/units` |
| `cidade` | `text` | `-` | `cidade` | `/api/units` |
| `estado` | `text` | `-` | `estado` | `/api/units` |
| `cep` | `text` | `-` | `cep` | `/api/units` |
| `country` | `text` | `pais` | `pais` | `/api/units` |
| `telefone` | `text` | `-` | `telefone` | `/api/units` |
| `email` | `text` | `email` | `email` | `/api/units` |
| `website` | `text` | `website` | `website` | `/api/units` |
| `pastor_name` | `text` | `-` | `pastorName` | `/api/units` |
| `pastor_phone` | `text` | `-` | `pastorPhone` | `/api/units` |
| `sede` | `boolean` | `-` | `ehSede` | `/api/units` |
| `status` | `text` | `situacao` | `situacao` | `/api/units` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/units` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/units` |
| `criado_por` | `uuid` | `-` | `criadoPor` | `/api/units` |
| `endereco_linha1` | `text` | `-` | `enderecoLinha1` | `/api/units` |
| `endereco_linha2` | `text` | `-` | `enderecoLinha2` | `/api/units` |

### 📋 Tabela: `user_permissions`
* **Tradução da Tabela (PT):** `permissoes_usuario`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `UserPermission`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/auth/permissions` |
| `user_id` | `uuid` | `id_user` | `userId` | `/api/auth/permissions` |
| `codigo_modulo` | `character varying` | `-` | `codigoModulo` | `/api/auth/permissions` |
| `can_read` | `boolean` | `-` | `canRead` | `/api/auth/permissions` |
| `can_write` | `boolean` | `-` | `canWrite` | `/api/auth/permissions` |
| `can_delete` | `boolean` | `-` | `canDelete` | `/api/auth/permissions` |
| `can_manage` | `boolean` | `-` | `canManage` | `/api/auth/permissions` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/auth/permissions` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/auth/permissions` |

### 📋 Tabela: `users`
* **Tradução da Tabela (PT):** `usuarios`
* **Rota da API (Backend):** `/api/users`
* **Interface TypeScript (TS):** `Usuario`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/users` |
| `email` | `text` | `email` | `email` | `/api/users` |
| `hash_senha` | `text` | `-` | `hashSenha` | `/api/users` |
| `nome_usuario` | `text` | `-` | `nomeUsuario` | `/api/users` |
| `role` | `text` | `perfil` | `perfil` | `/api/users` |
| `id_unidade` | `uuid` | `id_unidade` | `idUnidade` | `/api/users` |
| `id_funcionario` | `uuid` | `id_funcionario` | `idFuncionario` | `/api/users` |
| `id_membro` | `uuid` | `id_membro` | `idMembro` | `/api/users` |
| `esta_ativo` | `boolean` | `-` | `estaAtivo` | `/api/users` |
| `ultimo_login` | `timestamp with time zone` | `-` | `ultimoLogin` | `/api/users` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/users` |
| `atualizado` | `timestamp with time zone` | `-` | `atualizado` | `/api/users` |
| `criado_por` | `uuid` | `-` | `criadoPor` | `/api/users` |

### 📋 Tabela: `usuarios`
* **Tradução da Tabela (PT):** `usuarios`
* **Rota da API (Backend):** `/api/users`
* **Interface TypeScript (TS):** `Usuario`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id_usuario` | `uuid` | `id_usuario` | `idUsuario` | `/api/users` |
| `id_pessoa` | `uuid` | `id_pessoa` | `idPessoa` | `/api/users` |
| `login` | `character varying` | `-` | `login` | `/api/users` |
| `senha_hash` | `text` | `-` | `senhaHash` | `/api/users` |
| `data_criacao` | `timestamp with time zone` | `-` | `dataCriacao` | `/api/users` |
| `data_atualizacao` | `timestamp with time zone` | `-` | `dataAtualizacao` | `/api/users` |
| `ativo` | `boolean` | `-` | `ativo` | `/api/users` |

### 📋 Tabela: `usuarios_perfis`
* **Tradução da Tabela (PT):** `usuarios_perfis`
* **Rota da API (Backend):** `/api/auth/permissions`
* **Interface TypeScript (TS):** `UsuarioPerfil`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/auth/permissions` |
| `id_usuario` | `uuid` | `id_usuario` | `idUsuario` | `/api/auth/permissions` |
| `id_perfil` | `uuid` | `id_perfil` | `idPerfil` | `/api/auth/permissions` |

### 📋 Tabela: `volunteer_schedules`
* **Tradução da Tabela (PT):** `escalas_voluntarios`
* **Rota da API (Backend):** `/api/events/:id/volunteers`
* **Interface TypeScript (TS):** `VolunteerSchedule`

| Coluna Real (PostgreSQL) | Tipo no Banco | Tradução Sugerida (PT) | Campo no Frontend / TS | Rota/API Associada |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `id` | `id` | `/api/events/:id/volunteers` |
| `evento_id` | `uuid` | `-` | `eventoId` | `/api/events/:id/volunteers` |
| `ministerio` | `character varying` | `-` | `ministerio` | `/api/events/:id/volunteers` |
| `funcao` | `character varying` | `-` | `funcao` | `/api/events/:id/volunteers` |
| `voluntario_id` | `uuid` | `-` | `voluntarioId` | `/api/events/:id/volunteers` |
| `nome_voluntario` | `character varying` | `-` | `nomeVoluntario` | `/api/events/:id/volunteers` |
| `telefone_voluntario` | `character varying` | `-` | `telefoneVoluntario` | `/api/events/:id/volunteers` |
| `email_voluntario` | `character varying` | `-` | `emailVoluntario` | `/api/events/:id/volunteers` |
| `confirmado` | `boolean` | `-` | `confirmado` | `/api/events/:id/volunteers` |
| `observacoes` | `text` | `-` | `observacoes` | `/api/events/:id/volunteers` |
| `quantidade_necessaria` | `integer` | `-` | `quantidadeNecessaria` | `/api/events/:id/volunteers` |
| `quantidade_atribuida` | `integer` | `-` | `quantidadeAtribuida` | `/api/events/:id/volunteers` |
| `criado` | `timestamp with time zone` | `-` | `criado` | `/api/events/:id/volunteers` |

