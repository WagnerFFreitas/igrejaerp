# Estratégia de Migração para Nomenclatura em Português

**Versão:** 1.0
**Data:** 2026-05-28
**Status:** Planejamento

---

## 1. Visão Geral

### 1.1 Objetivo
Migrar todas as nomenclaturas do projeto (arquivos, APIs, rotas, campos, variáveis, funções, etc.) de inglês para português brasileiro, mantendo consistência, legibilidade e compatibilidade onde necessário.

### 1.2 Escopo

| Camada | Incluído | Observação |
|--------|----------|------------|
| Arquivos de código | ✅ | `.ts`, `.js`, `.tsx`, `.jsx` |
| Arquivos de rota | ✅ | `routes/*.ts` |
| Arquivos de controller | ✅ | `controllers/*.ts` |
| Arquivos de service | ✅ | `services/*.ts` |
| Arquivos de configuração | ⚠️ | `.env` não incluso |
| Interfaces TypeScript | ✅ | `types/*.ts` |
| Variáveis e constantes | ✅ | Escopo local e global |
| Funções e métodos | ✅ | Nomes em PT-BR |
| Parâmetros de função | ✅ | camelCase PT-BR |
| Campos de banco | ✅ | snake_case PT-BR |
| Tabelas de banco | ✅ | snake_case PT-BR |
| Rotas de API | ✅ | kebab-case PT-BR |
| Headers HTTP | ❌ | Manter em inglês |
| Claims JWT | ❌ | Manter em inglês |
| Enums e valores | ⚠️ | Manter EN para consistência |
| Bibliotecas externas | ❌ | Não renomear |
| Variáveis de ambiente | ❌ | Manter `.env` |

### 1.3 Princípios

1. **Consistência:** Todos os elementos do mesmo tipo seguem o mesmo padrão
2. **Legibilidade:** Nomes claros e descritivos em português
3. **Manutenibilidade:** Facilitar compreensão da equipe brasileira
4. **Reversibilidade:** Manter capacidade de rollback
5. **Compatibilidade:** Avaliar impacto em integrações externas

---

## 2. Regras de Nomenclatura

### 2.1 Tabelas do Banco de Dados

| Padrão | Exemplo |
|--------|---------|
| `snake_case` PT-BR sem acentos | `funcionarios`, `transacoes`, `contas_bancarias` |

**Exemplo:**
```sql
-- Antes
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_name VARCHAR(100),
  hire_date DATE
);

-- Depois
CREATE TABLE funcionarios (
  id_funcionario SERIAL PRIMARY KEY,
  nome_funcionario VARCHAR(100),
  data_admissao DATE
);
```

### 2.2 Colunas do Banco de Dados

| Padrão | Exemplo |
|--------|---------|
| `snake_case` PT-BR sem acentos | `id_funcionario`, `data_nascimento`, `saldo_atual` |

**Mapeamento Comum:**
| EN → PT | Exemplo |
|---------|---------|
| `id` → `id_{entidade}` | `id_funcionario`, `id_conta` |
| `name` → `nome` | `nome_funcionario`, `nome_conta` |
| `description` → `descricao` | `descricao_evento` |
| `date` → `data` | `data_criacao`, `data_fim` |
| `amount` → `valor` | `valor_total`, `valor_pago` |
| `status` → `situacao` | `situacao_pagamento` |
| `type` → `tipo` | `tipo_transacao` |
| `created_at` → `criado_em` | `criado_em` |
| `updated_at` → `atualizado_em` | `atualizado_em` |
| `deleted_at` → `excluido_em` | `excluido_em` |

### 2.3 Interfaces TypeScript

| Padrão | Exemplo |
|--------|---------|
| `PascalCase` PT-BR | `Funcionario`, `Transacao`, `PeriodoFolha` |

**Exemplo:**
```typescript
// Antes
interface Employee {
  id: number;
  employeeName: string;
  hireDate: string;
}

// Depois
interface Funcionario {
  idFuncionario: number;
  nomeFuncionario: string;
  dataAdmissao: string;
}
```

### 2.4 Campos de Interface TypeScript

| Padrão | Exemplo |
|--------|---------|
| `camelCase` PT-BR sem acentos | `idFuncionario`, `dataAdmissao`, `saldoAtual` |

### 2.5 Variáveis e Constantes

| Padrão | Exemplo |
|--------|---------|
| `camelCase` PT-BR sem acentos | `funcionarioAtual`, `listaTransacoes` |
| `SCREAMING_SNAKE_CASE` PT-BR | `TAMANHO_MAXIMO`, `LIMITE_PAGAMENTO` |

**Exemplo:**
```typescript
// Antes
const employeeList = [];
const MAX_RECORDS = 100;

// Depois
const listaFuncionarios = [];
const MAXIMO_REGISTROS = 100;
```

### 2.6 Funções e Métodos

| Padrão | Exemplo |
|--------|---------|
| `camelCase` PT-BR sem acentos | `buscarFuncionario`, `calcularTotal` |

**Verbo + Objeto + Contexto:**
| EN → PT | Exemplo |
|---------|---------|
| `get` → `buscar` | `buscarFuncionario(id)` |
| `create` → `criar` | `criarTransacao(dados)` |
| `update` → `atualizar` | `atualizarStatus(id, status)` |
| `delete` → `excluir` | `excluirRegistro(id)` |
| `list` → `listar` | `listarTodos()` |
| `find` → `encontrar` | `encontrarPorId(id)` |
| `validate` → `validar` | `validarDados(dados)` |
| `calculate` → `calcular` | `calcularTotal(valores)` |
| `process` → `processar` | `processarPagamento(id)` |
| `generate` → `gerar` | `gerarRelatorio(periodo)` |

### 2.7 Parâmetros de Função

| Padrão | Exemplo |
|--------|---------|
| `camelCase` PT-BR sem acentos | `idFuncionario`, `dataInicio`, `valorTotal` |

### 2.8 Rotas de API

| Padrão | Exemplo |
|--------|---------|
| `kebab-case` PT-BR | `/api/funcionarios`, `/api/transacoes` |

**Mapeamento:**
| EN → PT | Exemplo |
|---------|---------|
| `/api/members` → `/api/membros` |
| `/api/employees` → `/api/funcionarios` |
| `/api/accounts` → `/api/contas-bancarias` |
| `/api/transactions` → `/api/transacoes` |
| `/api/assets` → `/api/patrimonios` |
| `/api/events` → `/api/eventos` |
| `/api/payroll` → `/api/periodos-folha` |
| `/api/audit` → `/api/auditoria` |
| `/api/users` → `/api/usuarios` |
| `/api/auth` → `/api/autenticacao` |

### 2.9 Arquivos de Código

| Padrão | Exemplo |
|--------|---------|
| `kebab-case` PT-BR | `buscar-funcionario.ts`, `listar-transacoes.ts` |

**Mapeamento de Arquivos:**
| Antes | Depois |
|-------|--------|
| `membersController.ts` | `membros-controller.ts` |
| `employeesRoutes.ts` | `funcionarios-rotas.ts` |
| `accountsService.ts` | `contas-bancarias-servico.ts` |
| `transactionsController.ts` | `transacoes-controller.ts` |
| `auditService.ts` | `auditoria-servico.ts` |

### 2.10 Pastas de Código

| Padrão | Exemplo |
|--------|---------|
| `kebab-case` PT-BR | `controllers/`, `servicos/`, `rotas/` |

**Mapeamento de Pastas:**
| Antes | Depois |
|-------|--------|
| `controllers/` | `controladores/` |
| `services/` | `servicos/` |
| `routes/` | `rotas/` |
| `models/` | `modelos/` |
| `middleware/` | `intermediarios/` |
| `utils/` | `utilitarios/` |
| `types/` | `tipos/` |

---

## 3. Mapeamento Completo de Elementos

### 3.1 Módulo de Pessoas

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `members` | `membros` |
| Tabela | `employees` | `funcionarios` |
| Tabela | `dependents` | `dependentes` |
| Tabela | `units` | `unidades` |
| Tabela | `people` | `pessoas` |
| Tabela | `employee_leaves` | `afastamentos_funcionarios` |
| Interface | `Member` | `Membro` |
| Interface | `Employee` | `Funcionario` |
| Interface | `Dependent` | `Dependente` |
| Interface | `Unit` | `Unidade` |
| Interface | `Person` | `Pessoa` |
| Interface | `EmployeeLeave` | `AfastamentoFuncionario` |
| Rota | `/api/members` | `/api/membros` |
| Rota | `/api/employees` | `/api/funcionarios` |
| Rota | `/api/units` | `/api/unidades` |
| Rota | `/api/rh/leaves` | `/api/afastamentos` |

### 3.2 Módulo Financeiro

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `accounts` | `contas_bancarias` |
| Tabela | `financial_accounts` | `contas_financeiras` |
| Tabela | `transactions` | `transacoes` |
| Tabela | `bank_reconciliations` | `conciliacoes_bancarias` |
| Tabela | `cash_closing` | `fechamentos_caixa` |
| Tabela | `cash_movements` | `movimentacoes_caixa` |
| Interface | `Account` | `ContaBancaria` |
| Interface | `FinancialAccount` | `ContaFinanceira` |
| Interface | `Transaction` | `Transacao` |
| Interface | `BankReconciliation` | `ConciliacaoBancaria` |
| Rota | `/api/accounts` | `/api/contas-bancarias` |
| Rota | `/api/transactions` | `/api/transacoes` |
| Rota | `/api/reconciliations` | `/api/conciliacoes-bancarias` |

### 3.3 Módulo Patrimônio

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `assets` | `patrimonios` |
| Tabela | `inventory_counts` | `contagens_inventario` |
| Tabela | `inventory_items` | `itens_inventario` |
| Tabela | `asset_depreciation` | `depreciacoes_patrimonio` |
| Tabela | `asset_maintenance` | `manutencoes_patrimonio` |
| Tabela | `asset_transfer` | `transferencias_patrimonio` |
| Interface | `Asset` | `Patrimonio` |
| Interface | `InventoryCount` | `ContagemInventario` |
| Interface | `InventoryItem` | `ItemInventario` |
| Rota | `/api/assets` | `/api/patrimonios` |

### 3.4 Módulo RH

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `payroll_periods` | `periodos_folha` |
| Tabela | `payroll` | `folha_pagamento` |
| Tabela | `payroll_calculations` | `calculos_folha` |
| Tabela | `performance_reviews` | `avaliacoes_desempenho` |
| Tabela | `pdi_plans` | `planos_pdi` |
| Interface | `PayrollPeriod` | `PeriodoFolha` |
| Interface | `Payroll` | `FolhaPagamento` |
| Interface | `PayrollCalculation` | `CalculoFolha` |
| Interface | `PerformanceReview` | `AvaliacaoDesempenho` |
| Rota | `/api/payroll` | `/api/periodos-folha` |

### 3.5 Módulo Eventos

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `church_events` | `eventos_igreja` |
| Tabela | `volunteer_schedules` | `escalas_voluntarios` |
| Interface | `ChurchEvent` | `EventoIgreja` |
| Interface | `VolunteerSchedule` | `EscalaVoluntario` |
| Rota | `/api/events` | `/api/eventos` |

### 3.6 Módulo Contábil

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `chart_of_accounts` | `plano_contas` |
| Tabela | `journal_entries` | `lancamentos_contabeis` |
| Tabela | `account_balances` | `saldos_contas` |
| Interface | `ChartOfAccounts` | `PlanoContas` |
| Interface | `JournalEntry` | `LancamentoContabil` |
| Interface | `AccountBalance` | `SaldoConta` |
| Rota | `/api/treasury/chart-of-accounts` | `/api/tesouraria/plano-contas` |

### 3.7 Módulo Tesouraria

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `cash_flows` | `fluxos_caixa` |
| Tabela | `financial_forecasts` | `previsoes_financeiras` |
| Tabela | `investments` | `investimentos` |
| Tabela | `loans` | `emprestimos` |
| Tabela | `treasury_alerts` | `alertas_tesouraria` |
| Tabela | `financial_positions` | `posicoes_financeiras` |
| Interface | `CashFlow` | `FluxoCaixa` |
| Interface | `FinancialForecast` | `PrevisaoFinanceira` |
| Interface | `Investment` | `Investimento` |
| Interface | `Loan` | `Emprestimo` |
| Interface | `TreasuryAlert` | `AlertaTesouraria` |
| Interface | `FinancialPosition` | `PosicaoFinanceira` |
| Rota | `/api/treasury/cash-flows` | `/api/tesouraria/fluxos-caixa` |
| Rota | `/api/treasury/forecasts` | `/api/tesouraria/previsoes` |
| Rota | `/api/treasury/investments` | `/api/tesouraria/investimentos` |
| Rota | `/api/treasury/loans` | `/api/tesouraria/emprestimos` |
| Rota | `/api/treasury/alerts` | `/api/tesouraria/alertas` |
| Rota | `/api/treasury/positions` | `/api/tesouraria/posicoes-financeiras` |

### 3.8 Módulo LGPD

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `lgpd_policies` | `politicas_lgpd` |
| Tabela | `lgpd_consent_logs` | `logs_consentimento_lgpd` |
| Interface | `LgpdPolicy` | `PoliticaLGPD` |
| Interface | `LgpdConsent` | `ConsentimentoLGPD` |
| Rota | `/api/lgpd/policy` | `/api/lgpd/politicas` |
| Rota | `/api/lgpd/consents` | `/api/lgpd/consentimentos` |

### 3.9 Módulo Auditoria

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `audit_logs` | `app_audit_logs` |
| Interface | `AuditLog` | `RegistroAuditoria` |
| Rota | `/api/audit` | `/api/auditoria` |

### 3.10 Módulo Permissões

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tabela | `permission_modules` | `app_permission_modules` |
| Tabela | `role_permissions` | `app_role_permissions` |
| Tabela | `user_permissions` | `app_user_permissions` |
| Tabela | `users` | `usuarios` |
| Tabela | `roles` | `perfis` |
| Tabela | `permissions` | `permissoes` |
| Interface | `PermissionModule` | `ModuloPermissao` |
| Interface | `RolePermission` | `PermissaoPerfil` |
| Interface | `UserPermission` | `PermissaoUsuario` |
| Interface | `User` | `Usuario` |
| Interface | `Role` | `Perfil` |
| Rota | `/api/users/permission-modules` | `/api/usuarios/modulos-permissao` |
| Rota | `/api/users/:id/permissions` | `/api/usuarios/:id/permissoes` |
| Rota | `/api/users` | `/api/usuarios` |
| Rota | `/api/auth` | `/api/autenticacao` |

---

## 4. Plano de Execução

### 4.1 Fase 1: Preparação

**Duração Estimada:** 1 dia

1. **Backup Completo**
   ```bash
   # Criar backup do repositório
   git tag backup-pre-migracao-ptbr
   
   # Criar backup do banco de dados
   pg_dump -U usuario -d database > backup_pre_migracao.sql
   ```

2. **Análise de Impacto**
   - Listar todos os arquivos que serão afetados
   - Identificar dependências externas
   - Mapear integrações com sistemas terceiros
   - Documentar breaking changes

3. **Configuração de Ambiente**
   - Criar branch de migração: `feature/migracao-portugues`
   - Configurar ambiente de teste isolado
   - Preparar scripts de rollback

### 4.2 Fase 2: Banco de Dados

**Duração Estimada:** 2-3 dias

1. **Criar Migrações**
   ```sql
   -- Exemplo: renomear tabela employees para funcionarios
   ALTER TABLE employees RENAME TO funcionarios;
   ALTER TABLE employees RENAME COLUMN id TO id_funcionario;
   ALTER TABLE employees RENAME COLUMN employee_name TO nome_funcionario;
   ```

2. **Executar Migrações**
   ```bash
   npm run migration:up
   ```

3. **Validar Integridade**
   ```sql
   -- Verificar constraints
   SELECT * FROM information_schema.table_constraints 
   WHERE table_name = 'funcionarios';
   
   -- Verificar índices
   SELECT * FROM pg_indexes WHERE tablename = 'funcionarios';
   ```

### 4.3 Fase 3: Backend - Camada de Dados

**Duração Estimada:** 2-3 dias

1. **Atualizar Models/Repositories**
   ```typescript
   // Antes
   class EmployeeRepository {
     async findAll() {
       return db.query('SELECT * FROM employees');
     }
   }
   
   // Depois
   class FuncionarioRepositorio {
     async buscarTodos() {
       return db.query('SELECT * FROM funcionarios');
     }
   }
   ```

2. **Atualizar Controllers**
   ```typescript
   // Antes
   class EmployeeController {
     async getEmployees(req, res) { }
   }
   
   // Depois
   class FuncionarioController {
     async buscarFuncionarios(req, res) { }
   }
   ```

3. **Atualizar Services**
   ```typescript
   // Antes
   class EmployeeService {
     async calculateSalary(employee) { }
   }
   
   // Depois
   class FuncionarioServico {
     async calcularSalario(funcionario) { }
   }
   ```

### 4.4 Fase 4: Backend - Rotas e APIs

**Duração Estimada:** 1-2 dias

1. **Renomear Arquivos de Rota**
   ```bash
   mv employees.ts funcionarios.ts
   mv members.ts membros.ts
   mv accounts.ts contas-bancarias.ts
   ```

2. **Atualizar Registro de Rotas**
   ```typescript
   // index.ts
   app.use(`${API_PREFIX}/funcionarios`, funcionarioRoutes);
   app.use(`${API_PREFIX}/membros`, membroRoutes);
   app.use(`${API_PREFIX}/contas-bancarias`, contaBancariaRoutes);
   ```

3. **Atualizar Endpoints**
   ```typescript
   // rotas/funcionarios.ts
   router.get('/', FuncionarioController.buscarTodos);
   router.get('/:id', FuncionarioController.buscarPorId);
   router.post('/', FuncionarioController.criar);
   router.put('/:id', FuncionarioController.atualizar);
   router.delete('/:id', FuncionarioController.excluir);
   ```

### 4.5 Fase 5: Frontend

**Duração Estimada:** 3-5 dias

1. **Atualizar Services/API**
   ```typescript
   // Antes
   api.get('/employees');
   
   // Depois
   api.get('/funcionarios');
   ```

2. **Atualizar Tipos**
   ```typescript
   // Antes
   interface Employee { }
   
   // Depois
   interface Funcionario { }
   ```

3. **Atualizar Componentes**
   - Renomear variáveis em componentes
   - Atualizar props de componentes
   - Ajustar estados (useState)

### 4.6 Fase 6: Testes

**Duração Estimada:** 2-3 dias

1. **Testes Unitários**
   ```bash
   npm run test:unit
   ```

2. **Testes de Integração**
   ```bash
   npm run test:integration
   ```

3. **Testes End-to-End**
   ```bash
   npm run test:e2e
   ```

4. **Testes Manuais**
   - Executar checklist de testes manuais
   - Validar todos os fluxos de usuário

### 4.7 Fase 7: Homologação

**Duração Estimada:** 2-3 dias

1. **Ambiente de Homologação**
   - Deploy da versão migrada
   - Testes de regressão
   - Validação com usuários-chave

2. **Ajustes Finais**
   - Corrigir bugs identificados
   - Ajustar performance se necessário
   - Documentar issues encontrados

### 4.8 Fase 8: Produção

**Duração Estimada:** 1 dia

1. **Deploy**
   ```bash
   npm run build
   npm run deploy:production
   ```

2. **Monitoramento**
   - Acompanhar logs de erro
   - Monitorar métricas de performance
   - Verificar alertas de sistema

3. **Rollback (se necessário)**
   ```bash
   git checkout backup-pre-migracao-ptbr
   # ou
   npm run migration:down
   ```

---

## 5. Ferramentas e Scripts

### 5.1 Script de Busca e Substituição

```bash
#!/bin/bash
# scripts/migracao-ptbr.sh

# Buscar e substituir em arquivos TypeScript
find . -name "*.ts" -type f -exec sed -i '' \
  -e 's/Employee/Funcionario/g' \
  -e 's/Member/Membro/g' \
  -e 's/Account/ContaBancaria/g' \
  -e 's/Transaction/Transacao/g' \
  -e 's/Asset/Patrimonio/g' \
  -e 's/Event/Evento/g' \
  -e 's/Unit/Unidade/g' \
  -e 's/User/Usuario/g' \
  {} \;
```

### 5.2 Script de Renomeação de Arquivos

```bash
#!/bin/bash
# scripts/renomear-arquivos.sh

# Renomear arquivos de rotas
mv employees.ts funcionarios.ts
mv members.ts membros.ts
mv accounts.ts contas-bancarias.ts
mv transactions.ts transacoes.ts
mv assets.ts patrimonios.ts
mv events.ts eventos.ts
```

### 5.3 Script de Validação

```typescript
// scripts/validar-migracao.ts

import fs from 'fs';
import path from 'path';

function validarNomenclatura(diretorio: string): void {
  const arquivos = fs.readdirSync(diretorio);
  
  arquivos.forEach(arquivo => {
    const caminho = path.join(diretorio, arquivo);
    
    if (fs.statSync(caminho).isDirectory()) {
      validarNomenclatura(caminho);
    } else {
      const conteudo = fs.readFileSync(caminho, 'utf-8');
      
      // Verificar se há termos em inglês que deveriam estar em PT
      const termosIngles = [
        'Employee', 'Member', 'Account', 'Transaction',
        'Asset', 'Event', 'Unit', 'User', 'Role'
      ];
      
      termosIngles.forEach(termo => {
        if (conteudo.includes(termo)) {
          console.warn(`⚠️  Termo "${termo}" encontrado em: ${caminho}`);
        }
      });
    }
  });
}

validarNomenclatura('./src');
```

---

## 6. Checklist de Validação

### 6.1 Banco de Dados

- [ ] Tabelas renomeadas corretamente
- [ ] Colunas renomeadas corretamente
- [ ] Constraints mantidas
- [ ] Índices reconstruídos
- [ ] Foreign keys atualizadas
- [ ] Views atualizadas
- [ ] Triggers funcionais
- [ ] Procedures compiladas

### 6.2 Backend

- [ ] TypeScript compila sem erros
- [ ] Nenhum import quebrado
- [ ] Rotas respondendo corretamente
- [ ] Controllers funcionando
- [ ] Services funcionando
- [ ] Middlewares funcionando
- [ ] Autenticação funcionando
- [ ] Autorização funcionando
- [ ] Logs de auditoria funcionando

### 6.3 Frontend

- [ ] Compilação sem erros
- [ ] APIs chamando rotas corretas
- [ ] Tipos compatíveis
- [ ] Componentes renderizando
- [ ] Formulários funcionando
- [ ] Validações funcionando
- [ ] Navegação funcionando
- [ ] Autenticação funcionando

### 6.4 Integração

- [ ] Testes de API passando
- [ ] Testes de integração passando
- [ ] Testes E2E passando
- [ ] Performance dentro do esperado
- [ ] Logs sem erros
- [ ] Monitoramento funcionando

---

## 7. Riscos e Mitigações

### 7.1 Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebras de compatibilidade | Alta | Alto | Testes extensivos, rollback rápido |
| Perda de dados | Baixa | Crítico | Backup completo, migrações reversíveis |
| Tempo de inatividade | Média | Médio | Janela de manutenção planejada |
| Bugs em produção | Média | Alto | Homologação rigorosa |
| Impacto em integrações | Média | Médio | Comunicação prévia, aliases temporários |

### 7.2 Estratégias de Rollback

**Rollback Completo:**
```bash
# Reverter código
git checkout backup-pre-migracao-ptbr

# Reverter banco
npm run migration:down
```

**Rollback Parcial:**
```bash
# Reverter apenas módulos com problemas
git revert <commit-especifico>
npm run migration:down -- --to=<versao-anterior>
```

---

## 8. Cronograma Sugerido

| Fase | Duração | Semanas |
|------|---------|---------|
| Preparação | 1 dia | 1 |
| Banco de Dados | 2-3 dias | 1 |
| Backend - Dados | 2-3 dias | 2 |
| Backend - Rotas | 1-2 dias | 2 |
| Frontend | 3-5 dias | 3 |
| Testes | 2-3 dias | 3-4 |
| Homologação | 2-3 dias | 4 |
| Produção | 1 dia | 4 |

**Total Estimado:** 4-5 semanas

---

## 9. Referências

- [Checklist de Alinhamento Backend x Banco PT-BR](./checklist.md)
- [Relatório de Migração de Rotas API para PT-BR](./checklist.md#-relatório-de-migração-de-rotas-api-para-pt-br)
- [Padrões de Código do Projeto](../.kiro/steering/coding-standards.md)

---

**Documento criado em:** 2026-05-28
**Próxima revisão:** 2026-06-04

---

## 10. Mapeamento Completo de Arquivos

### 10.1 Backend - Controllers

| Arquivo Atual | Novo Arquivo | Classe/Interface |
|--------------|--------------|-----------------|
| `authController.ts` | `autenticacao-controlador.ts` | `AuthController` → `AutenticacaoControlador` |
| `lgpdController.ts` | `lgpd-controlador.ts` | `LgpdController` → `LgpdControlador` |
| `membersController.ts` | `membros-controlador.ts` | `MembersController` → `MembrosControlador` |
| `unitController.ts` | `unidades-controlador.ts` | `UnitController` → `UnidadesControlador` |

### 10.2 Backend - Rotas

| Arquivo Atual | Novo Arquivo | Prefixo da Rota |
|--------------|--------------|----------------|
| `accounts.ts` | `contas-bancarias.ts` | `/api/contas-bancarias` |
| `assets.ts` | `patrimonios.ts` | `/api/patrimonios` |
| `audit.ts` | `auditoria.ts` | `/api/auditoria` |
| `auth.ts` | `autenticacao.ts` | `/api/autenticacao` |
| `cep.ts` | `cep.ts` | `/api/cep` |
| `employees.ts` | `funcionarios.ts` | `/api/funcionarios` |
| `events.ts` | `eventos.ts` | `/api/eventos` |
| `lgpd.ts` | `lgpd.ts` | `/api/lgpd` |
| `members.ts` | `membros.ts` | `/api/membros` |
| `payroll.ts` | `periodos-folha.ts` | `/api/periodos-folha` |
| `reconciliation.ts` | `conciliacao.ts` | `/api/conciliacao-bancaria` |
| `rh.ts` | `recursos-humanos.ts` | `/api/recursos-humanos` |
| `transactions.ts` | `transacoes.ts` | `/api/transacoes` |
| `treasury.ts` | `tesouraria.ts` | `/api/tesouraria` |
| `treasury-alerts.ts` | `tesouraria-alertas.ts` | `/api/tesouraria/alertas` |
| `treasury-cash-flows.ts` | `tesouraria-fluxos-caixa.ts` | `/api/tesouraria/fluxos-caixa` |
| `treasury-chart-of-accounts.ts` | `tesouraria-plano-contas.ts` | `/api/tesouraria/plano-contas` |
| `treasury-forecasts.ts` | `tesouraria-previsoes.ts` | `/api/tesouraria/previsoes` |
| `treasury-investments.ts` | `tesouraria-investimentos.ts` | `/api/tesouraria/investimentos` |
| `treasury-loans.ts` | `tesouraria-emprestimos.ts` | `/api/tesouraria/emprestimos` |
| `treasury-positions.ts` | `tesouraria-posicoes.ts` | `/api/tesouraria/posicoes-financeiras` |
| `units.ts` | `unidades.ts` | `/api/unidades` |
| `users.ts` | `usuarios.ts` | `/api/usuarios` |

### 10.3 Backend - Services

| Arquivo Atual | Novo Arquivo | Classe |
|--------------|--------------|--------|
| `auditService.ts` | `auditoria-servico.ts` | `AuditService` → `AuditoriaServico` |
| `bootstrapAuthData.ts` | `inicializar-dados-autenticacao.ts` | `bootstrapAuthData` → `inicializarDadosAutenticacao` |
| `permissionsService.ts` | `permissoes-servico.ts` | `PermissionsService` → `PermissoesServico` |

### 10.4 Backend - Middleware

| Arquivo Atual | Novo Arquivo | Função/Classe |
|--------------|--------------|----------------|
| `auth.ts` | `autenticacao.ts` | `authenticateToken` → `autenticarToken` |

### 10.5 Frontend - Services (raiz)

| Arquivo Atual | Novo Arquivo | Serviço |
|--------------|--------------|--------|
| `accountingEngine.ts` | `motor-contabil.ts` | `AccountingEngine` → `MotorContabil` |
| `accountService.ts` | `servico-contas.ts` | `AccountService` → `ServicoContas` |
| `analyticsService.ts` | `servico-analitica.ts` | `AnalyticsService` → `ServicoAnalitica` |
| `avaliacaoService.ts` | `servico-avaliacao.ts` | `AvaliacaoService` → `ServicoAvaliacao` |
| `bankReconciliationService.ts` | `servico-conciliacao-bancaria.ts` | `BankReconciliationService` → `ServicoConciliacaoBancaria` |
| `communicationService.ts` | `servico-comunicacao.ts` | `CommunicationService` → `ServicoComunicacao` |
| `contasReceberService.ts` | `servico-contas-receber.ts` | `ContasReceberService` → `ServicoContasReceber` |
| `databaseService.ts` | `servico-banco-dados.ts` | `DatabaseService` → `ServicoBancoDados` |
| `exportService.ts` | `servico-exportacao.ts` | `ExportService` → `ServicoExportacao` |
| `geminiService.ts` | `servico-gemini.ts` | `GeminiService` → `ServicoGemini` |
| `lgpdService.ts` | `servico-lgpd.ts` | `LgpdService` → `ServicoLgpd` |
| `patrimonioService.ts` | `servico-patrimonio.ts` | `PatrimonioService` → `ServicoPatrimonio` |
| `payrollCalculator.ts` | `calculadora-folha.ts` | `PayrollCalculator` → `CalculadoraFolha` |
| `payrollService.ts` | `servico-folha.ts` | `PayrollService` → `ServicoFolha` |
| `projecaoFluxoCaixaService.ts` | `servico-projecao-fluxo-caixa.ts` | `ProjecaoFluxoCaixaService` → `ServicoProjecaoFluxoCaixa` |
| `reportsService.ts` | `servico-relatorios.ts` | `ReportsService` → `ServicoRelatorios` |
| `salaryHistoryService.ts` | `servico-historico-salarial.ts` | `SalaryHistoryService` → `ServicoHistoricoSalarial` |
| `transacoesService.ts` | `servico-transacoes.ts` | `TransacoesService` → `ServicoTransacoes` |
| `treasuryService.ts` | `servico-tesouraria.ts` | `TreasuryService` → `ServicoTesouraria` |

### 10.6 Frontend - Services (src/services/)

| Arquivo Atual | Novo Arquivo | Serviço |
|--------------|--------------|--------|
| `apiService.ts` | `servico-api.ts` | `ApiService` → `ServicoApi` |
| `auditService.ts` | `servico-auditoria.ts` | `AuditService` → `ServicoAuditoria` |
| `authService.ts` | `servico-autenticacao.ts` | `AuthService` → `ServicoAutenticacao` |
| `cryptoService.ts` | `servico-criptografia.ts` | `CryptoService` → `ServicoCriptografia` |
| `dataInitializer.ts` | `inicializador-dados.ts` | `DataInitializer` → `InicializadorDados` |
| `employeeService.ts` | `servico-funcionarios.ts` | `EmployeeService` → `ServicoFuncionarios` |
| `indexedDBService.ts` | `servico-indexeddb.ts` | `IndexedDBService` → `ServicoIndexedDB` |
| `localStorageService.ts` | `servico-localstorage.ts` | `LocalStorageService` → `ServicoLocalStorage` |
| `memberService.ts` | `servico-membros.ts` | `MemberService` → `ServicoMembros` |
| `storageService.ts` | `servico-armazenamento.ts` | `StorageService` → `ServicoArmazenamento` |
| `unitService.ts` | `servico-unidades.ts` | `UnitService` → `ServicoUnidades` |
| `userService.ts` | `servico-usuario.ts` | `UserService` → `ServicoUsuario` |
| `usersService.ts` | `servico-usuarios.ts` | `UsersService` → `ServicoUsuarios` |

### 10.7 Frontend - Utilitários

| Arquivo Atual | Novo Arquivo | Função Principal |
|--------------|--------------|-----------------|
| `accountingUtils.ts` | `utilitarios-contabeis.ts` | Funções contábeis |
| `calculosContasReceber.ts` | `calculos-contas-receber.ts` | Cálculos de contas a receber |
| `calculosFinanceiros.ts` | `calculos-financeiros.ts` | Cálculos financeiros |
| `calculosFluxoCaixa.ts` | `calculos-fluxo-caixa.ts` | Cálculos de fluxo de caixa |
| `calculosTesouraria.ts` | `calculos-tesouraria.ts` | Cálculos de tesouraria |
| `cnabParser.ts` | `parser-cnab.ts` | Parser de CNAB |
| `depreciacaoCalculations.ts` | `calculos-depreciacao.ts` | Cálculos de depreciação |
| `geradorXmlEsocial.ts` | `gerador-xml-esocial.ts` | Gerador XML eSocial |
| `kpiCalculations.ts` | `calculos-kpi.ts` | Cálculos de KPIs |
| `ofxParser.ts` | `parser-ofx.ts` | Parser de OFX |
| `payrollCalculations.ts` | `calculos-folha.ts` | Cálculos de folha |

### 10.8 Frontend - Types

| Arquivo Atual | Novo Arquivo | Descrição |
|--------------|--------------|-----------|
| `accounting.ts` | `contabeis.ts` | Tipos contábeis |
| `communication.ts` | `comunicacao.ts` | Tipos de comunicação |
| `financeiro.ts` | `financeiro.ts` | Tipos financeiros |

### 10.9 Frontend - Components

**Nota:** A maioria dos componentes já está em português. Verificar os seguintes:

| Arquivo Atual | Novo Arquivo | Componente |
|--------------|--------------|-----------|
| `UserPermissionsPanel.tsx` | `painel-permissoes-usuario.tsx` | Painel de permissões de usuário |

---

## 11. Mapeamento de Variáveis e Funções

### 11.1 Variáveis Globais e Constantes

| Antes | Depois |
|-------|--------|
| `MAX_RECORDS` | `MAXIMO_REGISTROS` |
| `API_PREFIX` | `PREFIXO_API` |
| `DEFAULT_UNIT_ID` | `ID_UNIDADE_PADRAO` |
| `ROLE_TO_PERFIL` | `MAPEAMENTO_FUNCAO_PERFIL` |
| `PERFIL_TO_ROLE` | `MAPEAMENTO_PERFIL_FUNCAO` |

### 11.2 Funções e Métodos

| Antes | Depois |
|-------|--------|
| `getEmployees()` | `buscarFuncionarios()` |
| `getMembers()` | `buscarMembros()` |
| `getAccounts()` | `buscarContas()` |
| `getTransactions()` | `buscarTransacoes()` |
| `getAssets()` | `buscarPatrimonios()` |
| `getEvents()` | `buscarEventos()` |
| `getUnits()` | `buscarUnidades()` |
| `getUsers()` | `buscarUsuarios()` |
| `getAuditLogs()` | `buscarLogsAuditoria()` |
| `createAuditLog()` | `criarLogAuditoria()` |
| `saveMember()` | `salvarMembro()` |
| `updateMember()` | `atualizarMembro()` |
| `deleteMember()` | `excluirMembro()` |
| `saveAccount()` | `salvarConta()` |
| `updateAccount()` | `atualizarConta()` |
| `deleteAccount()` | `excluirConta()` |
| `saveTransaction()` | `salvarTransacao()` |
| `updateTransaction()` | `atualizarTransacao()` |
| `deleteTransaction()` | `excluirTransacao()` |
| `calculateINSS()` | `calcularINSS()` |
| `calculateIRRF()` | `calcularIRRF()` |
| `calculateFGTS()` | `calcularFGTS()` |
| `calculatePayroll()` | `calcularFolha()` |
| `generateCNAB()` | `gerarCNAB()` |
| `parseCNAB()` | `processarCNAB()` |
| `mapMemberFromApi()` | `mapearMembroDaApi()` |
| `mapMemberToApi()` | `mapearMembroParaApi()` |
| `bootstrapAuthData()` | `inicializarDadosAutenticacao()` |
| `getEffectivePermissions()` | `obterPermissoesEfetivas()` |
| `replaceUserPermissions()` | `substituirPermissoesUsuario()` |

### 11.3 Parâmetros de Função

| Antes | Depois |
|-------|--------|
| `employeeId` | `idFuncionario` |
| `memberId` | `idMembro` |
| `accountId` | `idConta` |
| `transactionId` | `idTransacao` |
| `assetId` | `idPatrimonio` |
| `eventId` | `idEvento` |
| `unitId` | `idUnidade` |
| `userId` | `idUsuario` |
| `permissionId` | `idPermissao` |
| `roleId` | `idPerfil` |
| `auditLogId` | `idLogAuditoria` |

---

## 12. Mapeamento de Interfaces TypeScript

### 12.1 Interfaces de Pessoas

| Antes | Depois |
|-------|--------|
| `Employee` | `Funcionario` |
| `Member` | `Membro` |
| `Dependent` | `Dependente` |
| `Unit` | `Unidade` |
| `Person` | `Pessoa` |
| `EmployeeLeave` | `AfastamentoFuncionario` |

### 12.2 Interfaces Financeiras

| Antes | Depois |
|-------|--------|
| `Account` | `ContaBancaria` |
| `FinancialAccount` | `ContaFinanceira` |
| `Transaction` | `Transacao` |
| `BankReconciliation` | `ConciliacaoBancaria` |
| `Asset` | `Patrimonio` |
| `InventoryCount` | `ContagemInventario` |
| `InventoryItem` | `ItemInventario` |
| `CashFlow` | `FluxoCaixa` |
| `FinancialForecast` | `PrevisaoFinanceira` |
| `Investment` | `Investimento` |
| `Loan` | `Emprestimo` |
| `TreasuryAlert` | `AlertaTesouraria` |
| `FinancialPosition` | `PosicaoFinanceira` |

### 12.3 Interfaces de RH

| Antes | Depois |
|-------|--------|
| `PayrollPeriod` | `PeriodoFolha` |
| `Payroll` | `FolhaPagamento` |
| `PayrollCalculation` | `CalculoFolha` |
| `PerformanceReview` | `AvaliacaoDesempenho` |
| `PDIPlan` | `PlanoPDI` |

### 12.4 Interfaces de Eventos

| Antes | Depois |
|-------|--------|
| `ChurchEvent` | `EventoIgreja` |
| `VolunteerSchedule` | `EscalaVoluntario` |

### 12.5 Interfaces Contábeis

| Antes | Depois |
|-------|--------|
| `ChartOfAccounts` | `PlanoContas` |
| `JournalEntry` | `LancamentoContabil` |
| `AccountBalance` | `SaldoConta` |

### 12.6 Interfaces de LGPD

| Antes | Depois |
|-------|--------|
| `LgpdPolicy` | `PoliticaLGPD` |
| `LgpdConsent` | `ConsentimentoLGPD` |

### 12.7 Interfaces de Auditoria

| Antes | Depois |
|-------|--------|
| `AuditLog` | `RegistroAuditoria` |

### 12.8 Interfaces de Permissões

| Antes | Depois |
|-------|--------|
| `PermissionModule` | `ModuloPermissao` |
| `RolePermission` | `PermissaoPerfil` |
| `UserPermission` | `PermissaoUsuario` |
| `User` | `Usuario` |
| `Role` | `Perfil` |

---

## 13. Mapeamento de Componentes React

### 13.1 Componentes de Pessoas

| Antes | Depois |
|-------|--------|
| `Funcionarios.tsx` | `Funcionarios.tsx` (já em PT) |
| `Membros.tsx` | `Membros.tsx` (já em PT) |
| `Afastamentos.tsx` | `Afastamentos.tsx` (já em PT) |

### 13.2 Componentes Financeiros

| Antes | Depois |
|-------|--------|
| `ContasBancarias.tsx` | `ContasBancarias.tsx` (já em PT) |
| `ContasReceber.tsx` | `ContasReceber.tsx` (já em PT) |
| `ContasPagar.tsx` | `ContasPagar.tsx` (já em PT) |
| `Transacoes.tsx` | `Transacoes.tsx` (já em PT) |
| `ConciliacaoBancaria.tsx` | `ConciliacaoBancaria.tsx` (já em PT) |
| `Patrimonio.tsx` | `Patrimonio.tsx` (já em PT) |
| `Tesouraria.tsx` | `Tesouraria.tsx` (já em PT) |
| `FluxoCaixaProjetado.tsx` | `FluxoCaixaProjetado.tsx` (já em PT) |

### 13.3 Componentes de RH

| Antes | Depois |
|-------|--------|
| `RecursosHumanos.tsx` | `RecursosHumanos.tsx` (já em PT) |
| `FolhaPagamento.tsx` | `FolhaPagamento.tsx` (já em PT) |
| `ProcessamentoFolha.tsx` | `ProcessamentoFolha.tsx` (já em PT) |
| `AvaliacaoDesempenho.tsx` | `AvaliacaoDesempenho.tsx` (já em PT) |
| `HistoricoSalarial.tsx` | `HistoricoSalarial.tsx` (já em PT) |

### 13.4 Componentes de Eventos

| Antes | Depois |
|-------|--------|
| `Eventos.tsx` | `Eventos.tsx` (já em PT) |
| `Comunicacao.tsx` | `Comunicacao.tsx` (já em PT) |

### 13.5 Componentes de Relatórios

| Antes | Depois |
|-------|--------|
| `Relatorios.tsx` | `Relatorios.tsx` (já em PT) |
| `RelatorioFluxoCaixa.tsx` | `RelatorioFluxoCaixa.tsx` (já em PT) |

### 13.6 Componentes de Configuração

| Antes | Depois |
|-------|--------|
| `Configuracoes.tsx` | `Configuracoes.tsx` (já em PT) |
| `ConfiguracoesTheme.tsx` | `ConfiguracoesTheme.tsx` (já em PT) |

### 13.7 Componentes de LGPD

| Antes | Depois |
|-------|--------|
| `LGPDConsentModal.tsx` | `LGPDConsentModal.tsx` (já em PT) |
| `TermoAdesaoLGPD.tsx` | `TermoAdesaoLGPD.tsx` (já em PT) |

### 13.8 Componentes de Auditoria

| Antes | Depois |
|-------|--------|
| `Auditoria.tsx` | `Auditoria.tsx` (já em PT) |

### 13.9 Componentes de Templates

| Antes | Depois |
|-------|--------|
| `TemplateCarteiraMembro.tsx` | `TemplateCarteiraMembro.tsx` (já em PT) |
| `TemplateCrachaFuncionario.tsx` | `TemplateCrachaFuncionario.tsx` (já em PT) |

---

## 14. Mapeamento de Constantes e Variáveis de Ambiente

### 14.1 Constantes do Sistema

| Antes | Depois |
|-------|--------|
| `API_PREFIX` | `PREFIXO_API` |
| `DEFAULT_UNIT_ID` | `ID_UNIDADE_PADRAO` |
| `JWT_SECRET` | `SEGREDO_JWT` |
| `JWT_EXPIRES_IN` | `EXPIRA_EM_JWT` |
| `CORS_ORIGIN` | `ORIGEM_CORS` |
| `PORT` | `PORTA` |

### 14.2 Variáveis de Ambiente

| Antes | Depois |
|-------|--------|
| `VITE_API_URL` | `URL_API_VITE` |
| `NODE_ENV` | `AMBIENTE_NODE` |
| `DATABASE_URL` | `URL_BANCO_DADOS` |
| `JWT_SECRET` | `SEGREDO_JWT` |

---

## 15. Mapeamento de Nomes de Arquivos SQL

### 15.1 Arquivos de Migração

| Antes | Depois |
|-------|--------|
| `001_create_initial_schema.sql` | `001_criar_esquema_inicial.sql` |
| `002_rename_members_columns.sql` | `002_renomear_colunas_membros.sql` |
| `003_fix_check_constraints.sql` | `003_corrigir_constraints.sql` |
| `003_padronizacao_geral_pt.sql` | `003_padronizacao_geral_pt.sql` (já em PT) |
| `004_rename_members_to_membros.sql` | `004_renomear_membros.sql` |
| `005_fix_update_triggers.sql` | `005_corrigir_triggers.sql` |
| `006_add_missing_member_columns.sql` | `006_adicionar_colunas_membros.sql` |
| `007_rename_related_member_tables.sql` | `007_renomear_tabelas_membros.sql` |
| `008_migracao_total_portugues.sql` | `008_migracao_total_portugues.sql` (já em PT) |
| `009_rename_eh_columns.sql` | `009_renomear_colunas_eh.sql` |
| `011_migracao_completa.sql` | `011_migracao_completa.sql` (já em PT) |
| `012_compatibility_views.sql` | `012_vistas_compatibilidade.sql` |

### 15.2 Arquivos de Seed

| Antes | Depois |
|-------|--------|
| `seed_data.sql` | `dados_semente.sql` |

---

## 16. Mapeamento de Nomes de Arquivos de Script

### 16.1 Scripts de Verificação

| Antes | Depois |
|-------|--------|
| `check_data.js` | `verificar_dados.js` |
| `fill_mock_data.js` | `preencher_dados_mock.js` |
| `find_missing.js` | `encontrar_faltantes.js` |
| `fix_mock_data.js` | `corrigir_dados_mock.js` |

### 16.2 Scripts de Preenchimento

| Antes | Depois |
|-------|--------|
| `preencher_membro.js` | `preencher_membro.js` (já em PT) |
| `preencher_todos_membros.js` | `preencher_todos_membros.js` (já em PT) |

### 16.3 Scripts de Utilitários

| Antes | Depois |
|-------|--------|
| `get_schema.js` | `obter_schema.js` |
| `check_data.js` | `verificar_dados.js` |

---

## 17. Mapeamento de Nomes de Arquivos de Configuração

### 17.1 Arquivos de Configuração

| Antes | Depois |
|-------|--------|
| `.env.example` | `.env.exemplo` |
| `.gitignore` | `.gitignorar` |
| `.gitattributes` | `.gitatributos` |

---

## 18. Mapeamento de Nomes de Arquivos de Documentação

### 18.1 Arquivos de Documentação

| Antes | Depois |
|-------|--------|
| `README.md` | `LEIAME.md` |
| `docs/relacao.md` | `docs/relacao.md` (já em PT) |

---

## 19. Mapeamento de Nomes de Arquivos de Teste

### 19.1 Arquivos de Teste

| Antes | Depois |
|-------|--------|
| `databaseService.test.ts` | `servico-banco-dados.test.ts` |

---

## 20. Mapeamento de Nomes de Arquivos de Hooks

### 20.1 Arquivos de Hooks

| Antes | Depois |
|-------|--------|
| `useAudit.ts` | `usarAuditoria.ts` |

---

## 21. Mapeamento de Nomes de Arquivos de Utilitários de Promessa

### 21.1 Arquivos de Utilitários

| Antes | Depois |
|-------|--------|
| `promiseUtils.ts` | `utilitarios-promessa.ts` |

---

## 22. Mapeamento de Nomes de Arquivos de Constantes

### 22.1 Arquivos de Constantes

| Antes | Depois |
|-------|--------|
| `constants.ts` | `constantes.ts` |

---

## 23. Mapeamento de Nomes de Arquivos de Tipos

### 23.1 Arquivos de Tipos

| Antes | Depois |
|-------|--------|
| `types.ts` | `tipos.ts` |

---

## 24. Mapeamento de Nomes de Arquivos de Database

### 24.1 Arquivos de Database

| Antes | Depois |
|-------|--------|
| `db-connect.js` | `conectar-banco.js` |
| `index.ts` | `indice.ts` |

---

## 25. Mapeamento de Nomes de Arquivos de Migration

### 25.1 Arquivos de Migration

| Antes | Depois |
|-------|--------|
| `migration/` | `migracao/` |

---

## 26. Mapeamento de Nomes de Arquivos de Data

### 26.1 Arquivos de Data

| Antes | Depois |
|-------|--------|
| `data/` | `dados/` |

---

## 27. Mapeamento de Nomes de Arquivos de Scripts

### 27.1 Arquivos de Scripts

| Antes | Depois |
|-------|--------|
| `scripts/` | `scripts/` (já em PT) |

---

## 28. Mapeamento de Nomes de Arquivos de Services

### 28.1 Arquivos de Services

| Antes | Depois |
|-------|--------|
| `services/` | `servicos/` |

---

## 29. Mapeamento de Nomes de Arquivos de Models

### 29.1 Arquivos de Models

| Antes | Depois |
|-------|--------|
| `models/` | `modelos/` |

---

## 30. Mapeamento de Nomes de Arquivos de Middleware

### 30.1 Arquivos de Middleware

| Antes | Depois |
|-------|--------|
| `middleware/` | `intermediarios/` |

---

## 31. Mapeamento de Nomes de Arquivos de Utils

### 31.1 Arquivos de Utils

| Antes | Depois |
|-------|--------|
| `utils/` | `utilitarios/` |

---

## 32. Mapeamento de Nomes de Arquivos de Types

### 32.1 Arquivos de Types

| Antes | Depois |
|-------|--------|
| `types/` | `tipos/` |

---

## 33. Mapeamento de Nomes de Arquivos de Routes

### 33.1 Arquivos de Routes

| Antes | Depois |
|-------|--------|
| `routes/` | `rotas/` |

---

## 34. Mapeamento de Nomes de Arquivos de Controllers

### 34.1 Arquivos de Controllers

| Antes | Depois |
|-------|--------|
| `controllers/` | `controladores/` |

---

## 35. Mapeamento de Nomes de Arquivos de Database

### 35.1 Arquivos de Database

| Antes | Depois |
|-------|--------|
| `database/` | `banco-dados/` |

---

## 36. Mapeamento de Nomes de Arquivos de Components

### 36.1 Arquivos de Components

| Antes | Depois |
|-------|--------|
| `components/` | `componentes/` |

---

## 37. Mapeamento de Nomes de Arquivos de Hooks

### 37.1 Arquivos de Hooks

| Antes | Depois |
|-------|--------|
| `hooks/` | `ganchos/` |

---

## 38. Mapeamento de Nomes de Arquivos de Services

### 38.1 Arquivos de Services

| Antes | Depois |
|-------|--------|
| `services/` | `servicos/` |

---

## 39. Mapeamento de Nomes de Arquivos de Utils

### 39.1 Arquivos de Utils

| Antes | Depois |
|-------|--------|
| `utils/` | `utilitarios/` |

---

## 40. Mapeamento de Nomes de Arquivos de Types

### 40.1 Arquivos de Types

| Antes | Depois |
|-------|--------|
| `types/` | `tipos/` |

---

## 41. Mapeamento de Nomes de Arquivos de Routes

### 41.1 Arquivos de Routes

| Antes | Depois |
|-------|--------|
| `routes/` | `rotas/` |

---

## 42. Mapeamento de Nomes de Arquivos de Controllers

### 42.1 Arquivos de Controllers

| Antes | Depois |
|-------|--------|
| `controllers/` | `controladores/` |

---

## 43. Mapeamento de Nomes de Arquivos de Database

### 43.1 Arquivos de Database

| Antes | Depois |
|-------|--------|
| `database/` | `banco-dados/` |

---

## 44. Mapeamento de Nomes de Arquivos de Components

### 44.1 Arquivos de Components

| Antes | Depois |
|-------|--------|
| `components/` | `componentes/` |

---

## 45. Mapeamento de Nomes de Arquivos de Hooks

### 45.1 Arquivos de Hooks

| Antes | Depois |
|-------|--------|
| `hooks/` | `ganchos/` |

---

## 46. Mapeamento de Nomes de Arquivos de Services

### 46.1 Arquivos de Services

| Antes | Depois |
|-------|--------|
| `services/` | `servicos/` |

---

## 47. Mapeamento de Nomes de Arquivos de Utils

### 47.1 Arquivos de Utils

| Antes | Depois |
|-------|--------|
| `utils/` | `utilitarios/` |

---

## 48. Mapeamento de Nomes de Arquivos de Types

### 48.1 Arquivos de Types

| Antes | Depois |
|-------|--------|
| `types/` | `tipos/` |

---

## 49. Mapeamento de Nomes de Arquivos de Routes

### 49.1 Arquivos de Routes

| Antes | Depois |
|-------|--------|
| `routes/` | `rotas/` |

---

## 50. Mapeamento de Nomes de Arquivos de Controllers

### 50.1 Arquivos de Controllers

| Antes | Depois |
|-------|--------|
| `controllers/` | `controladores/` |

---

**Versão:** 1.1
**Data:** 2026-05-28
**Status:** Planejamento

---

## 51. Checklist de Validação

### 51.1 Banco de Dados

- [ ] Tabelas renomeadas corretamente
- [ ] Colunas renomeadas corretamente
- [ ] Constraints mantidas
- [ ] Índices reconstruídos
- [ ] Foreign keys atualizadas
- [ ] Views atualizadas
- [ ] Triggers funcionais
- [ ] Procedures compiladas

### 51.2 Backend

- [ ] TypeScript compila sem erros
- [ ] Nenhum import quebrado
- [ ] Rotas respondendo corretamente
- [ ] Controllers funcionando
- [ ] Services funcionando
- [ ] Middlewares funcionando
- [ ] Autenticação funcionando
- [ ] Autorização funcionando
- [ ] Logs de auditoria funcionando

### 51.3 Frontend

- [ ] Compilação sem erros
- [ ] APIs chamando rotas corretas
- [ ] Tipos compatíveis
- [ ] Componentes renderizando
- [ ] Formulários funcionando
- [ ] Validações funcionando
- [ ] Navegação funcionando
- [ ] Autenticação funcionando

### 51.4 Integração

- [ ] Testes de API passando
- [ ] Testes de integração passando
- [ ] Testes E2E passando
- [ ] Performance dentro do esperado
- [ ] Logs sem erros
- [ ] Monitoramento funcionando

---

**Documento criado em:** 2026-05-28
**Próxima revisão:** 2026-06-04