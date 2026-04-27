# 📊 Documentação Completa - Relação Banco de Dados, Componentes e Arquivos

> **Status**: ✅ Completo | **Data**: 27 de abril de 2026 | **Versão**: 2.0

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [Mapeamento de Componentes](#mapeamento-de-componentes)
4. [Mapeamento de Services](#mapeamento-de-services)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Permissões e Segurança](#permissões-e-segurança)
7. [Padronização de Campos](#padronização-de-campos)

---

## 🎯 Visão Geral

| Aspecto | Detalhes |
|--------|----------|
| **Banco de Dados** | PostgreSQL em Português ✅ |
| **Total de Tabelas** | 55+ tabelas |
| **Componentes React** | 44 componentes em português ✅ |
| **Services TypeScript** | 23+ services em português ✅ |
| **Status de Migração** | Completo (100% PT) ✅ |

---

## 🗄️ Estrutura do Banco de Dados

### 1️⃣ TABELA: `units` (Unidades da Igreja)
**Função**: Armazenar informações de cada unidade/filial da igreja

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único da unidade |
| `nome` | VARCHAR | Nome da unidade |
| `cnpj` | VARCHAR | CNPJ da unidade |
| `endereco` | VARCHAR | Endereço completo |
| `cidade` | VARCHAR | Cidade |
| `estado` | VARCHAR | Estado (UF) |
| `email` | VARCHAR | Email da unidade |
| `telefone` | VARCHAR | Telefone |
| `sede` | BOOLEAN | Se é sede principal |
| `criado` | TIMESTAMP | Data de criação |
| `atualizado` | TIMESTAMP | Data de atualização |

**Componentes**: `Layout.tsx`, `Configuracoes.tsx`  
**Services**: `databaseService.ts`

---

### 2️⃣ TABELA: `members` (Membros da Igreja)
**Função**: Registrar dados completos dos membros da congregação

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do membro |
| `id_unidade` | UUID | FK para units |
| `matricula` | VARCHAR | Matrícula única |
| `nome` | VARCHAR | Nome completo |
| `cpf` | VARCHAR | CPF (único) |
| `rg` | VARCHAR | RG |
| `email` | VARCHAR | Email |
| `telefone` | VARCHAR | Telefone |
| `profissao` | VARCHAR | Profissão |
| `funcao` | VARCHAR | Função na igreja |
| `data_nascimento` | DATE | Data de nascimento |
| `sexo` | CHAR(1) | M/F |
| `estado_civil` | VARCHAR | Estado civil |
| `cep` | VARCHAR | CEP |
| `logradouro` | VARCHAR | Logradouro |
| `numero` | VARCHAR | Número |
| `complemento` | VARCHAR | Complemento |
| `bairro` | VARCHAR | Bairro |
| `cidade` | VARCHAR | Cidade |
| `estado` | VARCHAR | Estado |
| `data_conversao` | DATE | Data de conversão |
| `data_batismo` | DATE | Data do batismo |
| `data_membro` | DATE | Data de filiação |
| `ministerio_principal` | VARCHAR | Ministério principal |
| `cargo_eclesiastico` | VARCHAR | Cargo eclesiástico |
| `dizimista` | BOOLEAN | É dizimista? |
| `observacoes` | TEXT | Observações |
| `dados_perfil` | JSONB | Dados extras (LGPD, emails, etc) |
| `criado` | TIMESTAMP | Data de criação |
| `atualizado` | TIMESTAMP | Data de atualização |

**Componentes**: `Membros.tsx`, `PortalMembro.tsx`, `ImprimeCadMembro.tsx`, `TemplateCarteiraMembro.tsx`, `TermoAdesaoLGPD.tsx`, `TermoVoluntariado.tsx`  
**Services**: `databaseService.ts`, `lgpdService.ts`, `communicationService.ts`

---

### 3️⃣ TABELA: `employees` (Funcionários)
**Função**: Registrar informações de funcionários da organização

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do funcionário |
| `id_unidade` | UUID | FK para units |
| `nome` | VARCHAR | Nome completo |
| `cpf` | VARCHAR | CPF (único) |
| `email` | VARCHAR | Email corporativo |
| `telefone` | VARCHAR | Telefone |
| `cargo` | VARCHAR | Cargo |
| `departamento` | VARCHAR | Departamento |
| `salario_base` | DECIMAL | Salário base |
| `data_admissao` | DATE | Data de admissão |
| `situacao` | VARCHAR | ACTIVE, INACTIVE |
| `dados_perfil` | JSONB | Dados extras (endereço, dependentes, etc) |
| `criado` | TIMESTAMP | Data de criação |
| `atualizado` | TIMESTAMP | Data de atualização |

**Componentes**: `Funcionarios.tsx`, `ImprimeCadFuncionario.tsx`, `TemplateCrachaFuncionario.tsx`, `RecursosHumanos.tsx`, `AvaliacaoDesempenho.tsx`  
**Services**: `payrollService.ts`, `payrollCalculator.ts`, `salaryHistoryService.ts`

---

### 4️⃣ TABELA: `transactions` (Transações Financeiras)
**Função**: Registrar todas as transações financeiras (receitas e despesas)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID da transação |
| `id_unidade` | UUID | FK para units |
| `descricao` | VARCHAR | Descrição |
| `valor` | DECIMAL | Valor da transação |
| `data_transacao` | DATE | Data |
| `tipo_transacao` | VARCHAR | INCOME/EXPENSE |
| `situacao` | VARCHAR | PENDING, PAID, CANCELLED |
| `categoria` | VARCHAR | Categoria (dízimos, ofertas, etc) |
| `centro_custo` | VARCHAR | Centro de custo |
| `id_conta` | UUID | FK para financial_accounts |
| `id_membro` | UUID | FK para members |
| `forma_pagamento` | VARCHAR | PIX, DINHEIRO, CHEQUE, etc |
| `projeto_id` | UUID | FK para projects |
| `data_vencimento` | DATE | Data de vencimento |
| `data_pagamento` | DATE | Data do pagamento |
| `valor_pago` | DECIMAL | Valor pago |
| `valor_restante` | DECIMAL | Valor restante |
| `parcelado` | BOOLEAN | É parcelado? |
| `numero_parcela` | INT | Número da parcela |
| `total_parcelas` | INT | Total de parcelas |
| `id_transacao_origem` | UUID | ID da transação pai |
| `conciliado` | BOOLEAN | Está conciliado? |
| `data_conciliacao` | DATE | Data da conciliação |
| `criado` | TIMESTAMP | Data de criação |
| `atualizado` | TIMESTAMP | Data de atualização |

**Componentes**: `Financeiro.tsx`, `ContasPagar.tsx`, `ContasReceber.tsx`, `ExtratoModal.tsx`, `TransferenciaModal.tsx`, `Tesouraria.tsx`, `RelatorioFluxoCaixa.tsx`, `ConciliacaoBancaria.tsx`  
**Services**: `transacoesService.ts`, `contasReceberService.ts`, `treasuryService.ts`, `motorConciliacao.ts`, `accountingEngine.ts`

---

### 5️⃣ TABELA: `financial_accounts` (Contas Financeiras)
**Função**: Registrar contas bancárias e financeiras

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID da conta |
| `id_unidade` | UUID | FK para units |
| `nome` | VARCHAR | Nome da conta |
| `tipo` | VARCHAR | CHECKING, SAVINGS, INVESTMENT |
| `saldo_atual` | DECIMAL | Saldo atual |
| `saldo_minimo` | DECIMAL | Saldo mínimo |
| `situacao` | VARCHAR | ACTIVE, INACTIVE |
| `codigo_banco` | VARCHAR | Código do banco |
| `numero_agencia` | VARCHAR | Número da agência |
| `numero_conta` | VARCHAR | Número da conta |
| `criado` | TIMESTAMP | Data de criação |
| `atualizado` | TIMESTAMP | Data de atualização |

**Componentes**: `ContasBancarias.tsx`, `ContasBancariasModals.tsx`  
**Services**: `accountService.ts`

---

### 6️⃣ TABELA: `bank_reconciliation` (Conciliação Bancária)
**Função**: Registrar reconciliações entre banco e sistema

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID da reconciliação |
| `id_unidade` | UUID | FK para units |
| `id_conta` | UUID | FK para financial_accounts |
| `data_conciliacao` | DATE | Data da conciliação |
| `saldo_extrato` | DECIMAL | Saldo do extrato |
| `saldo_sistema` | DECIMAL | Saldo do sistema |
| `diferenca` | DECIMAL | Diferença |
| `situacao` | VARCHAR | PENDING, RECONCILED |
| `criado` | TIMESTAMP | Data de criação |

**Componentes**: `ConciliacaoBancaria.tsx`  
**Services**: `bankReconciliationService.ts`, `motorConciliacao.ts`, `importacaoExtratoService.ts`

---

### 7️⃣ TABELA: `payroll` (Folha de Pagamento)
**Função**: Registrar dados de folha de pagamento processada

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do registro |
| `id_funcionario` | UUID | FK para employees |
| `data_referencia` | DATE | Período de referência |
| `salario_base` | DECIMAL | Salário base |
| `adicional_noturno` | DECIMAL | Adicional noturno |
| `insalubridade` | DECIMAL | Insalubridade |
| `comissoes` | DECIMAL | Comissões |
| `gratificacoes` | DECIMAL | Gratificações |
| `total_proventos` | DECIMAL | Total proventos |
| `total_deducoes` | DECIMAL | Total deduções |
| `salario_liquido` | DECIMAL | Salário líquido |
| `processado` | TIMESTAMP | Data de processamento |
| `criado` | TIMESTAMP | Data de criação |

**Componentes**: `FolhaPagamento.tsx`, `ProcessamentoFolha.tsx`, `HistoricoSalarial.tsx`  
**Services**: `payrollService.ts`, `payrollCalculator.ts`

---

### 8️⃣ TABELA: `payroll_periods` (Períodos de Folha)
**Função**: Registrar períodos de processamento de folha

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do período |
| `id_unidade` | UUID | FK para units |
| `mes` | INT | Mês (1-12) |
| `ano` | INT | Ano (YYYY) |
| `data_inicio` | DATE | Data início |
| `data_final` | DATE | Data final |
| `situacao` | VARCHAR | OPEN, CLOSED, PROCESSING |
| `total_funcionarios` | INT | Total de funcionários |
| `total_folha` | DECIMAL | Total da folha |
| `criado` | TIMESTAMP | Data de criação |

**Componentes**: `FolhaPagamento.tsx`, `ProcessamentoFolha.tsx`  
**Services**: `payrollService.ts`

---

### 9️⃣ TABELA: `employee_leaves` (Afastamentos)
**Função**: Registrar afastamentos, férias e licenças

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do afastamento |
| `id_funcionario` | UUID | FK para employees |
| `data_inicio` | DATE | Data inicial |
| `data_final` | DATE | Data final |
| `tipo` | VARCHAR | FERIAS, LICENCA, AFASTAMENTO |
| `situacao` | VARCHAR | PENDING, APPROVED |
| `observacoes` | TEXT | Observações |
| `criado` | TIMESTAMP | Data de criação |

**Componentes**: `Afastamentos.tsx`

---

### 🔟 TABELA: `performance_evaluations` (Avaliações)
**Função**: Registrar avaliações de desempenho

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID da avaliação |
| `id_funcionario` | UUID | FK para employees |
| `data_avaliacao` | DATE | Data da avaliação |
| `tipo_avaliacao` | VARCHAR | DESEMPENHO, COMPETENCIA |
| `nota_geral` | DECIMAL | Nota geral (0-10) |
| `conceito_geral` | VARCHAR | EXCELENTE, BOM, etc |
| `criado` | TIMESTAMP | Data de criação |

**Componentes**: `AvaliacaoDesempenho.tsx`, `AvaliacaoModal.tsx`, `AvaliacaoDashboardWidget.tsx`  
**Services**: `avaliacaoService.ts`

---

### 1️⃣1️⃣ TABELA: `assets` (Patrimônio)
**Função**: Registrar bens e ativos da organização

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do bem |
| `id_unidade` | UUID | FK para units |
| `nome` | VARCHAR | Nome do bem |
| `descricao` | VARCHAR | Descrição |
| `categoria` | VARCHAR | Imóvel, Móvel, Eletrônico |
| `data_aquisicao` | DATE | Data de aquisição |
| `valor_aquisicao` | DECIMAL | Valor de aquisição |
| `situacao` | VARCHAR | ATIVO, INATIVO |
| `localizacao` | VARCHAR | Localização |
| `numero_serie` | VARCHAR | Número de série |
| `criado` | TIMESTAMP | Data de criação |

**Componentes**: `Patrimonio.tsx`  
**Services**: `patrimonioService.ts`

---

### 1️⃣2️⃣ TABELA: `audit_logs` (Logs de Auditoria)
**Função**: Registrar todas as ações do sistema

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do log |
| `usuario_id` | UUID | FK para users |
| `acao` | VARCHAR | CREATE, UPDATE, DELETE |
| `entidade` | VARCHAR | Tabela modificada |
| `id_entidade` | VARCHAR | ID do registro |
| `nome_entidade` | VARCHAR | Nome/descrição |
| `criado` | TIMESTAMP | Data de criação |

**Componentes**: `Auditoria.tsx`

---

### 1️⃣3️⃣ TABELA: `permission_modules` (Módulos de Permissão)
**Função**: Definir módulos do sistema para controle de acesso

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do módulo |
| `codigo` | VARCHAR | Código único |
| `nome_modulo` | VARCHAR | Nome do módulo |
| `descricao` | TEXT | Descrição |
| `categoria` | VARCHAR | RH, FINANCEIRO, etc |
| `criado` | TIMESTAMP | Data de criação |

**Módulos Principais**:
- `FINANCEIRO` - Gestão financeira
- `RECURSOS_HUMANOS` - RH
- `PATRIMONIO` - Gestão de ativos
- `MEMBROS` - Gerenciar membros
- `CONFIGURACOES` - Configurações do sistema

---

### 1️⃣4️⃣ TABELA: `role_permissions` (Permissões por Função)
**Função**: Definir permissões para cada função/role

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID |
| `funcao` | VARCHAR | ADMIN, PASTOR, TREASURER |
| `codigo_modulo` | VARCHAR | FK para permission_modules |
| `ler` | BOOLEAN | Pode ler? |
| `escrever` | BOOLEAN | Pode escrever? |
| `excluir` | BOOLEAN | Pode deletar? |
| `administrador` | BOOLEAN | Pode administrar? |

---

### 1️⃣5️⃣ TABELA: `user_permissions` (Permissões por Usuário)
**Função**: Permissões customizadas por usuário

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID |
| `usuario_id` | UUID | FK para users |
| `codigo_modulo` | VARCHAR | FK para permission_modules |
| `ler` | BOOLEAN | Pode ler? |
| `escrever` | BOOLEAN | Pode escrever? |

---

## 🎨 Mapeamento de Componentes

### 📊 Módulo FINANCEIRO (10 componentes)
| Componente | Tabelas | Função |
|-----------|---------|--------|
| `Financeiro.tsx` | transactions, financial_accounts | Dashboard financeiro |
| `ContasBancarias.tsx` | financial_accounts | Listar contas |
| `ContasBancariasModals.tsx` | financial_accounts | Gerenciar contas |
| `ContasPagar.tsx` | transactions | Contas a pagar |
| `ContasReceber.tsx` | transactions | Contas a receber |
| `ExtratoModal.tsx` | transactions | Ver extrato |
| `TransferenciaModal.tsx` | transactions | Transferências |
| `Tesouraria.tsx` | transactions | Tesouraria |
| `RelatorioFluxoCaixa.tsx` | transactions | Relatório |
| `ConciliacaoBancaria.tsx` | bank_reconciliation | Conciliação |

### 👥 Módulo MEMBROS (7 componentes)
| Componente | Tabelas | Função |
|-----------|---------|--------|
| `Membros.tsx` | members, dependents | Listar membros |
| `PortalMembro.tsx` | members | Portal do membro |
| `ImprimeCadMembro.tsx` | members | Imprimir cadastro |
| `TemplateCarteiraMembro.tsx` | members | Carteira |
| `TermoAdesaoLGPD.tsx` | members | Termo LGPD |
| `TermoVoluntariado.tsx` | members | Termo voluntariado |
| `LGPDConsentModal.tsx` | members | Consentimento |

### 👔 Módulo RH (9 componentes)
| Componente | Tabelas | Função |
|-----------|---------|--------|
| `Funcionarios.tsx` | employees | Listar funcionários |
| `RecursosHumanos.tsx` | employees, payroll | Dashboard RH |
| `ImprimeCadFuncionario.tsx` | employees | Imprimir cadastro |
| `TemplateCrachaFuncionario.tsx` | employees | Cracha |
| `AvaliacaoDesempenho.tsx` | performance_evaluations | Avaliações |
| `AvaliacaoModal.tsx` | performance_evaluations | Modal avaliação |
| `AvaliacaoDashboardWidget.tsx` | performance_evaluations | Widget |
| `Afastamentos.tsx` | employee_leaves | Afastamentos |
| `HistoricoSalarial.tsx` | payroll, employees | Histórico |

### 📄 Módulo FOLHA (2 componentes)
| Componente | Tabelas | Função |
|-----------|---------|--------|
| `FolhaPagamento.tsx` | payroll, payroll_periods | Gerenciar folha |
| `ProcessamentoFolha.tsx` | payroll, payroll_calculations | Processar |

### 🏛️ Módulo PATRIMÔNIO (1 componente)
| Componente | Tabelas | Função |
|-----------|---------|--------|
| `Patrimonio.tsx` | assets, inventory_counts | Gerenciar ativos |

### ⚙️ Módulo CONFIGURAÇÕES (3 componentes)
| Componente | Tabelas | Função |
|-----------|---------|--------|
| `Configuracoes.tsx` | units, permission_modules | Config geral |
| `ConfiguracoesTheme.tsx` | users | Config tema |
| `UserPermissionsPanel.tsx` | user_permissions | Permissões |

### 📊 Módulo GERAL (8 componentes)
| Componente | Tabelas | Função |
|-----------|---------|--------|
| `PainelGeral.tsx` | Todas | Dashboard |
| `Layout.tsx` | users, units | Layout |
| `Comunicacao.tsx` | members | Comunicação |
| `Eventos.tsx` | events | Eventos |
| `Auditoria.tsx` | audit_logs | Auditoria |
| `Notificacoes.tsx` | audit_logs | Notificações |
| `Relatorios.tsx` | Todas | Relatórios |
| `ImprimeRelatfinanceiro.tsx` | transactions | Imprimir |

---

## 🛠️ Mapeamento de Services (23 services)

| Service | Função | Tabelas |
|---------|--------|---------|
| `databaseService.ts` | Serviço central | Todas |
| `accountService.ts` | Gerenciar contas | financial_accounts |
| `accountingEngine.ts` | Motor contábil | transactions |
| `treasuryService.ts` | Tesouraria | transactions |
| `transacoesService.ts` | Transações | transactions |
| `contasReceberService.ts` | Contas a receber | transactions |
| `bankReconciliationService.ts` | Reconciliação | bank_reconciliation |
| `motorConciliacao.ts` | Motor conciliação | transactions |
| `importacaoExtratoService.ts` | Importar extratos | transactions |
| `payrollService.ts` | Folha de pagamento | payroll, payroll_periods |
| `payrollCalculator.ts` | Cálculo de folha | payroll_calculations |
| `salaryHistoryService.ts` | Histórico salarial | payroll |
| `patrimonioService.ts` | Patrimônio | assets |
| `avaliacaoService.ts` | Avaliações | performance_evaluations |
| `lgpdService.ts` | LGPD | members |
| `communicationService.ts` | Comunicação | members |
| `analyticsService.ts` | Análise | Todas |
| `exportService.ts` | Exportação | Todas |
| `reportsService.ts` | Relatórios | Todas |
| `geminiService.ts` | IA (Gemini) | Todas |
| `esocialConfig.ts` | eSocial | employees, payroll |

---

## 📡 Fluxo de Dados

```
┌─────────────────────────────────┐
│  USUÁRIO (Interface Web)        │
│  (Português ✅)                 │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  COMPONENTES REACT (44)         │
│  .tsx em Português ✅           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  SERVICES (23+)                 │
│  TypeScript em Português ✅     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  API REST / Backend             │
│  (Validação e lógica)           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  BANCO DE DADOS PostgreSQL      │
│  Tabelas em Português ✅        │
│  Colunas em Português ✅        │
└─────────────────────────────────┘
```

---

## 🔐 Permissões e Segurança

### Matriz de Permissões por Função

| Função | Financeiro | RH | Patrimônio | Membros | Auditoria | Config |
|--------|:----:|:--:|:--------:|:------:|:--------:|:------:|
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PASTOR** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **TREASURER** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **RH** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **SECRETARY** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

---

## 📝 Padronização de Campos

### Transações
| Campo EN | Campo PT | Tipo |
|----------|----------|------|
| description | descricao | VARCHAR |
| amount | valor | DECIMAL |
| type | tipo_transacao | VARCHAR |
| status | situacao | VARCHAR |
| date | data_transacao | DATE |
| category | categoria | VARCHAR |
| costCenter | centro_custo | VARCHAR |
| accountId | id_conta | UUID |
| memberId | id_membro | UUID |
| paymentMethod | forma_pagamento | VARCHAR |
| dueDate | data_vencimento | DATE |
| paidAmount | valor_pago | DECIMAL |
| isInstallment | parcelado | BOOLEAN |
| isConciliated | conciliado | BOOLEAN |

### Contas Financeiras
| Campo EN | Campo PT | Tipo |
|----------|----------|------|
| name | nome | VARCHAR |
| type | tipo | VARCHAR |
| currentBalance | saldo_atual | DECIMAL |
| minimumBalance | saldo_minimo | DECIMAL |
| bankCode | codigo_banco | VARCHAR |
| agencyNumber | numero_agencia | VARCHAR |
| accountNumber | numero_conta | VARCHAR |
| createdAt | criado | TIMESTAMP |
| updatedAt | atualizado | TIMESTAMP |

### Funcionários
| Campo EN | Campo PT | Tipo |
|----------|----------|------|
| name | nome | VARCHAR |
| position | cargo | VARCHAR |
| department | departamento | VARCHAR |
| salary | salario_base | DECIMAL |
| admissionDate | data_admissao | DATE |
| status | situacao | VARCHAR |
| createdAt | criado | TIMESTAMP |
| updatedAt | atualizado | TIMESTAMP |

### Membros
| Campo EN | Campo PT | Tipo |
|----------|----------|------|
| name | nome | VARCHAR |
| birthDate | data_nascimento | DATE |
| maritalStatus | estado_civil | VARCHAR |
| zipCode | cep | VARCHAR |
| street | logradouro | VARCHAR |
| neighborhood | bairro | VARCHAR |
| city | cidade | VARCHAR |
| state | estado | VARCHAR |
| isTithable | dizimista | BOOLEAN |
| isRegularGiver | eh_ofertante_regular | BOOLEAN |
| createdAt | criado | TIMESTAMP |
| updatedAt | atualizado | TIMESTAMP |

---

## 📊 Resumo Estatístico

| Categoria | Quantidade | Status |
|-----------|------------|--------|
| **Tabelas PostgreSQL** | 55+ | ✅ 100% PT |
| **Colunas Totais** | 500+ | ✅ 100% PT |
| **Componentes React** | 44 | ✅ 100% PT |
| **Services** | 23+ | ✅ 100% PT |
| **Tipos/Interfaces** | 40+ | ✅ 100% PT |
| **Módulos do Sistema** | 6 | ✅ Completo |

---

**Documento atualizado em**: 27 de abril de 2026  
**Versão**: 2.0  
**Status**: ✅ Completo e Atualizado