# Estratégia de Migração para Nomenclatura em Português

**Versão:** 2.0
**Data:** 2026-05-28
**Status:** Em Andamento

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
| Palavra "Service" | ❌ | Manter em inglês em arquivos, classes e rotas |

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
---

## 12. Execução da Migração

### 12.1 Status: Em Andamento

**Data de Início:** 2026-05-28

### 12.2 Alterações Realizadas

#### 12.2.1 Arquivos de Rotas (api/src/routes/)

| Arquivo Anterior | Arquivo Renomeado | Status |
|-----------------|-------------------|--------|
| `auth.ts` | `autenticacao.ts` | ✅ Concluído |
| `accounts.ts` | `contas-bancarias.ts` | ✅ Concluído |
| `assets.ts` | `patrimonios.ts` | ✅ Concluído |
| `audit.ts` | `auditoria.ts` | ✅ Concluído |
| `employees.ts` | `funcionarios.ts` | ✅ Concluído |
| `events.ts` | `eventos.ts` | ✅ Concluído |
| `members.ts` | `membros.ts` | ✅ Concluído |
| `payroll.ts` | `periodos-folha.ts` | ✅ Concluído |
| `reconciliation.ts` | `conciliacoes-bancarias.ts` | ✅ Concluído |
| `transactions.ts` | `transacoes.ts` | ✅ Concluído |
| `treasury.ts` | `tesouraria.ts` | ✅ Concluído |
| `treasury-alerts.ts` | `tesouraria-alertas.ts` | ✅ Concluído |
| `treasury-cash-flows.ts` | `tesouraria-fluxos-caixa.ts` | ✅ Concluído |
| `treasury-chart-of-accounts.ts` | `tesouraria-plano-contas.ts` | ✅ Concluído |
| `treasury-forecasts.ts` | `tesouraria-previsoes.ts` | ✅ Concluído |
| `treasury-investments.ts` | `tesouraria-investimentos.ts` | ✅ Concluído |
| `treasury-loans.ts` | `tesouraria-emprestimos.ts` | ✅ Concluído |
| `treasury-positions.ts` | `tesouraria-posicoes-financeiras.ts` | ✅ Concluído |
| `units.ts` | `unidades.ts` | ✅ Concluído |
| `users.ts` | `usuarios.ts` | ✅ Concluído |
| `lgpd.ts` | `lgpd.ts` | ✅ Concluído |
| `rh.ts` | `rh.ts` | ✅ Concluído |
| `cep.ts` | `cep.ts` | ✅ Concluído (já em PT) |

#### 12.2.2 Arquivos de Controllers (api/src/controllers/)

| Arquivo Anterior | Arquivo Renomeado | Status |
|-----------------|-------------------|--------|
| `authController.ts` | `autenticacao-controlador.ts` | ✅ Concluído |
| `lgpdController.ts` | `lgpd-controlador.ts` | ✅ Concluído |
| `membersController.ts` | `membros-controlador.ts` | ✅ Concluído |
| `unitController.ts` | `unidades-controlador.ts` | ✅ Concluído |

#### 12.2.3 Arquivos de Services (api/src/services/)

| Arquivo Anterior | Arquivo Renomeado | Status |
|-----------------|-------------------|--------|
| `auditService.ts` | `auditoria-servico.ts` | ✅ Concluído |
| `bootstrapAuthData.ts` | `bootstrap-dados-autenticacao.ts` | ✅ Concluído |
| `permissionsService.ts` | `permissoes-servico.ts` | ✅ Concluído |

#### 12.2.4 Arquivos de Middleware (api/src/middleware/)

| Arquivo Anterior | Arquivo Renomeado | Status |
|-----------------|-------------------|--------|
| `auth.ts` | `autenticacao.ts` | ✅ Concluído |

#### 12.2.5 Arquivos de Services (Frontend - src/services/)

| Arquivo Anterior | Arquivo Renomeado | Status |
|-----------------|-------------------|--------|
| `auditService.ts` | `auditoria-servico.ts` | ✅ Concluído |
| `memberService.ts` | `membroService.ts` | ✅ Concluído |
| `employeeService.ts` | `funcionarioService.ts` | ✅ Concluído |
| `authService.ts` | `autenticacaoService.ts` | ✅ Concluído |
| `unitService.ts` | `unidadeService.ts` | ✅ Concluído |
| `userService.ts` | `usuarioService.ts` | ✅ Concluído |
| `usersService.ts` | `usuariosService.ts` | ✅ Concluído |

#### 12.2.6 Arquivos de Hooks (Frontend - src/hooks/)

| Arquivo Anterior | Novo Import | Status |
|-----------------|-------------|--------|
| `useAudit.ts` | `auditoria-servico.ts` | ✅ Concluído |

### 12.3 Atualizações de Imports Realizadas

| Arquivo | Alteração | Status |
|---------|-----------|--------|
| `index.ts` | Atualizado imports de rotas e services | ✅ Concluído |
| `autenticacao.ts` (rota) | Atualizado import do controller | ✅ Concluído |
| `membros.ts` (rota) | Atualizado import do controller | ✅ Concluído |
| `unidades.ts` (rota) | Atualizado import do controller | ✅ Concluído |
| `lgpd.ts` (rota) | Atualizado import do controller | ✅ Concluído |
| `usuarios.ts` (rota) | Atualizado import do service | ✅ Concluído |
| `auditoria.ts` (rota) | Atualizado import do service e middleware | ✅ Concluído |
| `autenticacao-controlador.ts` | Atualizado import dos services | ✅ Concluído |
| `bootstrap-dados-autenticacao.ts` | Atualizado import dos services | ✅ Concluído |
| `useAudit.ts` | Atualizado import do service | ✅ Concluído |
| `App.tsx` | Atualizado imports dos services renomeados | ✅ Concluído |

### 12.4 Próximos Passos Pendentes

- [x] Verificar se há mais referências aos arquivos antigos
- [x] Renomear services do frontend
- [x] Atualizar imports no App.tsx
- [ ] Verificar outros arquivos que importam os services renomeados
- [ ] Executar testes de compilação
- [ ] Executar testes de integração
- [ ] Testar endpoints da API
- [ ] Testar o frontend
- [ ] Executar validação completa

---

**Última atualização:** 2026-05-28
**Próxima revisão:** Após conclusão da migração

---

## 52. Varredura Completa de Arquivos com Nomes em Inglês (2026-05-28)

### 52.1 Status da Migração

| Categoria | Arquivos |
|-----------|----------|
| **Já migrados** (rotas, controllers, services, middleware do backend) | ✅ 31 |
| **Pendentes** (services, utils, types, scripts) | **128** |
| **Prioridade alta** (código da aplicação) | ~55 |
| **Prioridade média** (scripts de teste/debug) | ~73 |

### 52.2 Diretório Raiz (`E:\igrejaerp\`)

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `Readme.md` | `LEIAME.md` |
| `constants.ts` | `constantes.ts` |
| `types.ts` | `tipos.ts` |
| `.gitattributes` | `.gitatributos` |
| `.gitignore` | `.gitignorar` |

### 52.3 `services/` (raiz) — 20 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `accountService.ts` | `servico-contas.ts` |
| `databaseService.ts` | `servico-banco-dados.ts` |
| `treasuryService.ts` | `servico-tesouraria.ts` |
| `lgpdService.ts` | `servico-lgpd.ts` |
| `geminiService.ts` | `servico-gemini.ts` |
| `reportsService.ts` | `servico-relatorios.ts` |
| `accountingEngine.ts` | `motor-contabil.ts` |
| `payrollService.ts` | `servico-folha.ts` |
| `salaryHistoryService.ts` | `servico-historico-salarial.ts` |
| `payrollCalculator.ts` | `calculadora-folha.ts` |
| `bankReconciliationService.ts` | `servico-conciliacao-bancaria.ts` |
| `communicationService.ts` | `servico-comunicacao.ts` |
| `exportService.ts` | `servico-exportacao.ts` |
| `analyticsService.ts` | `servico-analitica.ts` |
| `transacoesService.ts` | `servico-transacoes.ts` |
| `contasReceberService.ts` | `servico-contas-receber.ts` |
| `projecaoFluxoCaixaService.ts` | `servico-projecao-fluxo-caixa.ts` |
| `esocialConfig.ts` | `configuracao-esocial.ts` |
| `importacaoExtratoService.ts` | `servico-importacao-extrato.ts` |
| `databaseService.test.ts` | `servico-banco-dados.test.ts` |

### 52.4 `utils/` (raiz) — 6 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `accountingUtils.ts` | `utilitarios-contabeis.ts` |
| `kpiCalculations.ts` | `calculos-kpi.ts` |
| `payrollCalculations.ts` | `calculos-folha.ts` |
| `ofxParser.ts` | `parser-ofx.ts` |
| `depreciacaoCalculations.ts` | `calculos-depreciacao.ts` |
| `cnabParser.ts` | `parser-cnab.ts` |

### 52.5 `types/` (raiz) — 2 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `accounting.ts` | `contabeis.ts` |
| `communication.ts` | `comunicacao.ts` |

### 52.6 `components/` — 3 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `UserPermissionsPanel.tsx` | `painel-permissoes-usuario.tsx` |
| `LGPDConsentModal.tsx` | `modal-consentimento-lgpd.tsx` |
| `Layout.tsx` | `layout.tsx` |

### 52.7 `constants/` — 2 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `accounting.ts` | `contabeis.ts` |
| `banks.ts` | `bancos.ts` |

### 52.8 `contexts/` — 1 arquivo

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `ThemeContext.tsx` | `contexto-tema.tsx` |

### 52.9 `config/` — 1 arquivo

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `env.ts` | `ambiente.ts` |

### 52.10 `src/services/` — 12 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `apiService.ts` | `servico-api.ts` |
| `dataInitializer.ts` | `inicializador-dados.ts` |
| `storageService.ts` | `servico-armazenamento.ts` |
| `cryptoService.ts` | `servico-criptografia.ts` |
| `localStorageService.ts` | `servico-localstorage.ts` |
| `indexedDBService.ts` | `servico-indexeddb.ts` |
| `usuarioService.ts` | `servico-usuario.ts` |
| `autenticacaoService.ts` | `servico-autenticacao.ts` |
| `membroService.ts` | `servico-membros.ts` |
| `usuariosService.ts` | `servico-usuarios.ts` |
| `unidadeService.ts` | `servico-unidades.ts` |
| `funcionarioService.ts` | `servico-funcionarios.ts` |

### 52.11 `src/hooks/` — 1 arquivo

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `useAudit.ts` | `usarAuditoria.ts` |

### 52.12 `src/utils/` — 2 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `promiseUtils.ts` | `utilitarios-promessa.ts` |
| `fieldMapping.ts` | `mapeamento-campos.ts` |

### 52.13 `api/` (raiz) — Scripts de teste/verificação — 17 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `fix_mock_data.js` | `corrigir_dados_mock.js` |
| `fill_mock_data.js` | `preencher_dados_mock.js` |
| `find_missing.js` | `encontrar_faltantes.js` |
| `check_data.js` | `verificar_dados.js` |
| `generate_db_report.ts` | `gerar-relatorio-banco.ts` |
| `db_inspect.ts` | `inspecionar-banco.ts` |
| `db_inspect_v2.ts` | `inspecionar-banco-v2.ts` |
| `test.js` | `teste.js` |
| `test_put_valid.js` | `teste-put-valido.js` |
| `test_func.js` | `teste-func.js` |
| `test_func2.js` | `teste-func2.js` |
| `test_triggers.js` | `teste-triggers.js` |
| `test_db_update.js` | `teste-atualizacao-banco.js` |
| `test_put.js` | `teste-put.js` |
| `test_db.js` | `teste-banco.js` |
| `test_api.ts` | `teste-api.ts` |
| `test_db.ts` | `teste-banco.ts` |

### 52.14 `api/src/` — 2 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `check_db.ts` | `verificar-banco.ts` |
| `test-server.ts` | `teste-servidor.ts` |

### 52.15 `api/src/database/` — 2 arquivos

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `001_create_initial_schema.sql` | `001_criar_esquema_inicial.sql` |
| `fix_triggers.ts` | `corrigir-triggers.ts` |

### 52.16 `api/scripts/` — 69 arquivos (verificação/debug/testes)

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `rename_columns_to_standard.ts` | `renomear-colunas-padronizacao.ts` |
| `find_dependencies.ts` | `encontrar-dependencias.ts` |
| `test_audit_query.ts` | `teste-consulta-auditoria.ts` |
| `test_audit_api.ts` | `teste-api-auditoria.ts` |
| `test_audit_api.js` | `teste-api-auditoria.js` |
| `test_login_and_audit.js` | `teste-login-auditoria.js` |
| `validate-data.ts` | `validar-dados.ts` |
| `test-connection.ts` | `teste-conexao.ts` |
| `import-postgres.ts` | `importar-postgres.ts` |
| `export-firebase.ts` | `exportar-firebase.ts` |
| `drop_column_cascade.ts` | `remover-coluna-cascade.ts` |
| `drop_old_columns.ts` | `remover-colunas-antigas.ts` |
| `check_specific_columns.ts` | `verificar-colunas-especificas.ts` |
| `check_naming_standardization.ts` | `verificar-padronizacao-nomes.ts` |
| `check_audit_structure.ts` | `verificar-estrutura-auditoria.ts` |
| `check_audit_tables.ts` | `verificar-tabelas-auditoria.ts` |
| `check_users.js` | `verificar-usuarios.js` |
| `verify-full-flow.js` | `verificar-fluxo-completo.js` |
| `check-schema-and-data.js` | `verificar-esquema-dados.js` |
| `check-whatsapp.js` | `verificar-whatsapp.js` |
| `check-ana-paula.js` | `verificar-ana-paula.js` |
| `test-matricula-protection.js` | `teste-protecao-matricula.js` |
| `regenerate-matriculas.js` | `regenerar-matriculas.js` |
| `check-member-matricula.js` | `verificar-matricula-membro.js` |
| `remove-test-members.js` | `remover-membros-teste.js` |
| `test-whatsapp-update.js` | `teste-atualizacao-whatsapp.js` |
| `add-new-constraints.js` | `adicionar-novas-constraints.js` |
| `migrate-data-english.js` | `migrar-dados-ingles.js` |
| `test-member-update.js` | `teste-atualizacao-membro.js` |
| `extract-db-metadata.js` | `extrair-metadados-banco.js` |
| `list-columns-real.js` | `listar-colunas-reais.js` |
| `debug-update-member.js` | `depurar-atualizacao-membro.js` |
| `check-transaction-constraints.js` | `verificar-constraints-transacoes.js` |
| `check-accounts-schema.js` | `verificar-esquema-contas.js` |
| `check-accounts-tables.js` | `verificar-tabelas-contas.js` |
| `check-transaction-fk.js` | `verificar-fk-transacoes.js` |
| `check-accounts-real.js` | `verificar-contas-reais.js` |
| `test-transaction-save.js` | `teste-salvar-transacao.js` |
| `test-eval-frontend-payload.js` | `teste-payload-frontend-avaliacao.js` |
| `test-evaluation-save.js` | `teste-salvar-avaliacao.js` |
| `check-assets-data.js` | `verificar-dados-patrimonios.js` |
| `fix-asset-numbers.js` | `corrigir-numeros-patrimonios.js` |
| `add-asset-address.js` | `adicionar-endereco-patrimonio.js` |
| `check-assets-constraints.js` | `verificar-constraints-patrimonios.js` |
| `test-asset-save.js` | `teste-salvar-patrimonio.js` |
| `check-assets-cols.js` | `verificar-colunas-patrimonios.js` |
| `check-rh-patrimonio.js` | `verificar-rh-patrimonio.js` |
| `check-employees-full.js` | `verificar-funcionarios-completo.js` |
| `check-financeiro.js` | `verificar-financeiro.js` |
| `check-dashboard.js` | `verificar-painel.js` |
| `test-member-fields.js` | `teste-campos-membro.js` |
| `check-lgpd-cols.js` | `verificar-colunas-lgpd.js` |
| `check-lgpd.js` | `verificar-lgpd.js` |
| `fix-address-line2.js` | `corrigir-endereco-linha2.js` |
| `fix-unit-data.js` | `corrigir-dados-unidade.js` |
| `check-units.js` | `verificar-unidades.js` |
| `debug-members-response.js` | `depurar-resposta-membros.js` |
| `check-api.js` | `verificar-api.js` |
| `check-data.js` | `verificar-dados.js` |
| `test-member-save.js` | `teste-salvar-membro.js` |
| `check-constraints.js` | `verificar-constraints.js` |
| `verify-profile-data.js` | `verificar-dados-perfil.js` |
| `check-members-columns.js` | `verificar-colunas-membros.js` |
| `test-endpoints.js` | `teste-endpoints.js` |
| `check-columns.js` | `verificar-colunas.js` |
| `run-migration.js` | `executar-migracao.js` |
| `run-migration-transactions.js` | `executar-migracao-transacoes.js` |
| `run-rh-migration.js` | `executar-migracao-rh.js` |
| `migrate-accounts.js` | `migrar-contas.js` |

### 52.17 Configurações API

| Arquivo Atual | Sugestão PT-BR |
|---------------|----------------|
| `api/.env.example` | `api/.env.exemplo` |
| `api/.gitignore` | `api/.gitignorar` |

---

**Varredura realizada em:** 2026-05-28

---

## 53. Processo de Migração — Scripts Criados (2026-05-28)

### 53.1 Scripts Disponíveis

| Script | Função | Comando |
|--------|--------|---------|
| `scripts/renomear-arquivos.js` | Renomeia arquivos de inglês para português | `npm run migracao:renomear` |
| `scripts/substituir-nomenclatura.js` | Substitui conteúdo (imports, classes, etc.) | `npm run migracao:executar` |
| `scripts/validar-nomenclatura.js` | Valida se há termos em inglês restantes | `npm run migracao:validar` |
| `scripts/dicionario-renomeacao-arquivos.json` | Dicionário de mapeamento de arquivos | — |
| `scripts/dicionario_nomenclaturas.json` | Dicionário de mapeamento de conteúdo | — |
| `scripts/README-MIGRACAO.md` | Documentação completa do processo | — |

### 53.2 Fluxo de Execução

```
1. Simulação (dry-run)
   └─ npm run migracao:dry-run

2. Renomeação de arquivos
   └─ npm run migracao:renomear

3. Atualização de conteúdo
   └─ npm run migracao:executar

4. Validação
   └─ npm run migracao:validar

5. Build e testes
   └─ npm run lint && npm run build

6. Limpeza de backups
   └─ find . -name "*.bak" -delete
```

### 53.3 Execução por Fases

```bash
# Fase 1: services/ (raiz) — 20 arquivos
node scripts/renomear-arquivos.js --fase 1

# Fase 2: utils/ (raiz) — 11 arquivos
node scripts/renomear-arquivos.js --fase 2

# Fase 3: types/ (raiz) — 2 arquivos
node scripts/renomear-arquivos.js --fase 3

# Fase 4: components/ — 3 arquivos
node scripts/renomear-arquivos.js --fase 4

# Fase 5: src/services/ — 12 arquivos
node scripts/renomear-arquivos.js --fase 5

# Fase 6: src/hooks/ e src/utils/ — 3 arquivos
node scripts/renomear-arquivos.js --fase 6

# Fase 7: api/scripts/ — 69 arquivos
node scripts/renomear-arquivos.js --fase 7

# Fase 8: api/ (raiz, src, database) — 19 arquivos
node scripts/renomear-arquivos.js --fase 8

# Fase 9: configurações — 5 arquivos
node scripts/renomear-arquivos.js --fase 9

# Fase 10: raiz do projeto — 3 arquivos
node scripts/renomear-arquivos.js --fase 10

# Fase 11: Atualização de imports (automático)
node scripts/renomear-arquivos.js --fase 11

# Fase 12: Validação final (automático)
node scripts/renomear-arquivos.js --fase 12
```

### 53.4 Comandos npm

| Comando | Descrição |
|---------|-----------|
| `npm run migracao:dry-run` | Simula renomeação (sem alterar nada) |
| `npm run migracao:renomear` | Executa renomeação de arquivos |
| `npm run migracao:substituir` | Simula substituição de conteúdo |
| `npm run migracao:executar` | Executa substituição de conteúdo |
| `npm run migracao:validar` | Valida nomenclatura restante |

### 53.5 Rollback

```bash
# Reverter renomeações (usando backups .bak)
find . -name "*.bak" -exec bash -c 'mv "$1" "${1%.bak}"' _ {} \;

# Ou reverter tudo via git
git checkout .

# Ou reverter para o tag de backup
git checkout backup-pre-migracao-ptbr
```

### 53.6 Checklist de Validação

**Arquivos:**
- [ ] Todos os 128 arquivos foram renomeados
- [ ] Nenhum arquivo antigo permanece
- [ ] Backups criados (.bak)

**Imports:**
- [ ] Todos os imports foram atualizados
- [ ] Nenhum import quebrado
- [ ] `npm run lint` passa sem erros

**Build:**
- [ ] `npm run build` funciona
- [ ] `cd api && npm run build` funciona
- [ ] Nenhum erro de compilação

**Testes:**
- [ ] Testes unitários passam
- [ ] Testes de integração passam
- [ ] API responde corretamente
- [ ] Frontend renderiza corretamente

---

**Processo documentado em:** 2026-05-28
**Próxima revisão:** Após execução da migração

---

## 54. Exceções de Nomenclatura — Palavras Mantidas em Inglês (2026-05-28)

### 54.1 Palavras que NÃO devem ser traduzidas

| Palavra | Motivo | Exemplo de uso |
|---------|--------|----------------|
| **Service** | Padrão de nomenclatura de camada de serviço | `FuncionarioService`, `ContaService` |
| **Config** | Padrão técnico de configuração | `EsocialConfig` |
| **Utils** | Padrão técnico de utilitários | `AccountingUtils` |
| **Parser** | Padrão técnico de processamento | `OfxParser`, `CnabParser` |
| **Calculator** | Padrão técnico de cálculo | `PayrollCalculator` |
| **Engine** | Padrão técnico de motor/processador | `AccountingEngine` |
| **API** | Acrônimo técnico universal | `ApiService` |
| **DB** | Acrônimo técnico de database | `DatabaseService` |
| **JWT** | Acrônimo técnico de autenticação | `JWT_SECRET` |
| **CORS** | Acrônimo técnico de segurança | `CORS_ORIGIN` |
| **URL** | Acrônimo técnico universal | `API_URL` |
| **ID** | Acrônimo técnico de identificação | `idUser` |

### 54.2 Padrão de Nomes de Arquivos com "Service"

| Arquivo Original | Arquivo Renomeado (correto) | Arquivo NÃO deve ser |
|------------------|----------------------------|---------------------|
| `accountService.ts` | `contasService.ts` | ~~`servico-contas.ts`~~ |
| `databaseService.ts` | `bancoDadosService.ts` | ~~`servico-banco-dados.ts`~~ |
| `treasuryService.ts` | `tesourariaService.ts` | ~~`servico-tesouraria.ts`~~ |
| `payrollService.ts` | `folhaService.ts` | ~~`servico-folha.ts`~~ |
| `auditService.ts` | `auditoriaService.ts` | ~~`servico-auditoria.ts`~~ |
| `authService.ts` | `autenticacaoService.ts` | ~~`servico-autenticacao.ts`~~ |
| `userService.ts` | `usuarioService.ts` | ~~`servico-usuario.ts`~~ |
| `memberService.ts` | `membroService.ts` | ~~`servico-membros.ts`~~ |
| `employeeService.ts` | `funcionarioService.ts` | ~~`servico-funcionarios.ts`~~ |
| `unitService.ts` | `unidadeService.ts` | ~~`servico-unidades.ts`~~ |

### 54.3 Padrão de Classes com "Service"

| Classe Original | Classe Renomeada (correta) | Classe NÃO deve ser |
|-----------------|---------------------------|---------------------|
| `EmployeeService` | `FuncionarioService` | ~~`ServicoFuncionarios`~~ |
| `MemberService` | `MembroService` | ~~`ServicoMembros`~~ |
| `AccountService` | `ContaService` | ~~`ServicoContas`~~ |
| `TransactionService` | `TransacaoService` | ~~`ServicoTransacoes`~~ |
| `AuditService` | `AuditoriaService` | ~~`ServicoAuditoria`~~ |
| `AuthService` | `AutenticacaoService` | ~~`ServicoAutenticacao`~~ |
| `UserService` | `UsuarioService` | ~~`ServicoUsuario`~~ |
| `UnitService` | `UnidadeService` | ~~`ServicoUnidades`~~ |
| `PayrollService` | `FolhaService` | ~~`ServicoFolha`~~ |
| `TreasuryService` | `TesourariaService` | ~~`ServicoTesouraria`~~ |
| `DatabaseService` | `BancoDadosService` | ~~`ServicoBancoDados`~~ |

---

## 55. Protocolo de Migração (2026-05-28)

### 55.1 Pré-Requisitos

| # | Ação | Responsável | Status |
|---|------|-------------|--------|
| 1 | Backup completo do repositório | — | ☐ |
| 2 | Backup do banco de dados | — | ☐ |
| 3 | Branch dedicada criada | — | ☐ |
| 4 | Equipe notificada | — | ☐ |
| 5 | Janela de manutenção agendada | — | ☐ |

### 55.2 Ordem de Execução

```
FASE 1 — PREPARAÇÃO
├── 1.1 Criar backup: git tag backup-pre-migracao-ptbr
├── 1.2 Criar branch: git checkout -b feature/migracao-portugues
├── 1.3 Backup do banco: pg_dump > backup_pre_migracao.sql
└── 1.4 Validar backups

FASE 2 — RENOMEAÇÃO DE ARQUIVOS
├── 2.1 Executar dry-run: npm run migracao:dry-run
├── 2.2 Revisar resultados do dry-run
├── 2.3 Executar renomeação: npm run migracao:renomear
├── 2.4 Validar renomeação
└── 2.5 Commit: git add . && git commit -m "refactor: renomear arquivos para PT-BR"

FASE 3 — ATUALIZAÇÃO DE CONTEÚDO
├── 3.1 Executar dry-run: npm run migracao:substituir
├── 3.2 Revisar resultados do dry-run
├── 3.3 Executar substituição: npm run migracao:executar
├── 3.4 Validar substituição
└── 3.5 Commit: git add . && git commit -m "refactor: atualizar imports e classes para PT-BR"

FASE 4 — VALIDAÇÃO
├── 4.1 Validar nomenclatura: npm run migracao:validar
├── 4.2 Verificar TypeScript: npm run lint
├── 4.3 Build frontend: npm run build
├── 4.4 Build backend: cd api && npm run build
└── 4.5 Corrigir erros encontrados

FASE 5 — TESTES
├── 5.1 Testes unitários: npm run test:unit
├── 5.2 Testes de integração: npm run test:integration
├── 5.3 Testes E2E: npm run test:e2e
├── 5.4 Testes manuais de API
└── 5.5 Testes manuais de frontend

FASE 6 — HOMOLOGAÇÃO
├── 6.1 Deploy em homologação
├── 6.2 Testes de regressão
├── 6.3 Validação com usuários-chave
└── 6.4 Ajustes finais

FASE 7 — PRODUÇÃO
├── 7.1 Merge da branch: git merge feature/migracao-portugues
├── 7.2 Deploy em produção
├── 7.3 Monitoramento pós-deploy
├── 7.4 Limpeza de backups: find . -name "*.bak" -delete
└── 7.5 Delete da branch: git branch -d feature/migracao-portugues
```

### 55.3 Comandos de Execução

| Etapa | Comando | Observação |
|-------|---------|------------|
| Dry-run renomeação | `npm run migracao:dry-run` | Sempre executar primeiro |
| Renomear arquivos | `npm run migracao:renomear` | Cria backups .bak |
| Dry-run conteúdo | `npm run migracao:substituir` | Sempre executar primeiro |
| Atualizar conteúdo | `npm run migracao:executar` | Cria backups .bak |
| Validar nomenclatura | `npm run migracao:validar` | Verifica termos em inglês |
| Verificar TypeScript | `npm run lint` | Deve passar sem erros |
| Build frontend | `npm run build` | Deve compilar |
| Build backend | `cd api && npm run build` | Deve compilar |

### 55.4 Comandos de Rollback

| Cenário | Comando | Observação |
|---------|---------|------------|
| Reverter renomeações | `find . -name "*.bak" -exec bash -c 'mv "$1" "${1%.bak}"' _ {} \;` | Usa backups |
| Reverter tudo via git | `git checkout .` | Perde alterações não commitadas |
| Reverter para tag | `git checkout backup-pre-migracao-ptbr` | Revert completo |
| Reverter último commit | `git revert HEAD` | Desfaz último commit |

### 55.5 Checklist de Validação Pós-Migração

**Arquivos:**
- [ ] Todos os 128 arquivos foram renomeados
- [ ] Nenhum arquivo antigo permanece
- [ ] Backups criados (.bak)
- [ ] Palavra "Service" mantida em inglês

**Imports:**
- [ ] Todos os imports foram atualizados
- [ ] Nenhum import quebrado
- [ ] `npm run lint` passa sem erros

**Build:**
- [ ] `npm run build` funciona
- [ ] `cd api && npm run build` funciona
- [ ] Nenhum erro de compilação

**Testes:**
- [ ] Testes unitários passam
- [ ] Testes de integração passam
- [ ] API responde corretamente
- [ ] Frontend renderiza corretamente

**Produção:**
- [ ] Deploy realizado com sucesso
- [ ] Monitoramento ativo
- [ ] Logs sem erros
- [ ] Usuários validando funcionalidades

### 55.6 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Imports quebrados | Média | Alto | Dry-run + validação |
| Build quebrado | Baixa | Crítico | Testar build após cada fase |
| Perda de dados | Baixa | Crítico | Backup completo antes de tudo |
| Tempo de inatividade | Baixa | Médio | Janela de manutenção planejada |
| Bugs em produção | Média | Alto | Homologação rigorosa |

### 55.7 Critérios de Aceite

A migração será considerada bem-sucedida quando:

1. ✅ Todos os arquivos foram renomeados para PT-BR
2. ✅ A palavra "Service" foi mantida em inglês
3. ✅ Todos os imports foram atualizados
4. ✅ TypeScript compila sem erros
5. ✅ Build frontend funciona
6. ✅ Build backend funciona
7. ✅ Testes passam
8. ✅ API responde corretamente
9. ✅ Frontend renderiza corretamente
10. ✅ Homologação aprovada
11. ✅ Deploy em produção realizado
12. ✅ Monitoramento pós-deploy OK

---

**Protocolo documentado em:** 2026-05-28
**Última atualização:** 2026-05-28
**Próxima revisão:** Após execução da migração

---

## 56. Progresso da Migração (2026-05-28)

### 56.1 Etapas Concluídas

| # | Etapa | Status | Data |
|---|-------|--------|------|
| 1 | Backup do banco de dados | ✅ Concluído | 2026-05-28 |
| 2 | Dry-run da renomeação | ✅ Concluído | 2026-05-28 |
| 3 | Renomeação de arquivos (124 arquivos) | ✅ Concluído | 2026-05-28 |
| 4 | Substituição de conteúdo (98 arquivos) | ✅ Concluído | 2026-05-28 |
| 5 | Correção de imports (64 arquivos) | ✅ Concluído | 2026-05-28 |
| 6 | Adição de aliases de tipos | ✅ Concluído | 2026-05-28 |
| 7 | Adição de constantes faltantes | ✅ Concluído | 2026-05-28 |
| 8 | Correção de imports Firebase | ✅ Concluído | 2026-05-28 |
| 9 | Criação de páginas Login/Dashboard | ✅ Concluído | 2026-05-28 |
| 10 | Instalação @types/jest | ✅ Concluído | 2026-05-28 |
| 11 | Correção de imports adicionais (19 arquivos) | ✅ Concluído | 2026-05-28 |
| 12 | Build frontend | ✅ Concluído | 2026-05-28 |
| 13 | Build backend | ✅ Concluído | 2026-05-28 |
| 14 | Correção de endpoints API (38 endpoints) | ✅ Concluído | 2026-05-28 |
| 15 | Testes | ⏳ Pendente | — |
| 15 | Homologação | ⏳ Pendente | — |
| 16 | Produção | ⏳ Pendente | — |

### 56.2 Arquivos Alterados nesta Sessão

| Arquivo | Alteração |
|---------|-----------|
| `tipos.ts` | Adicionados aliases: `Payroll`, `UserAuth`, `Unit`, `Transaction`, `Member`, `Employee` |
| `constants/index.ts` | Adicionados: `DEFAULT_TAX_CONFIG`, `DEFAULT_INSS_BRACKETS`, `DEFAULT_IRRF_BRACKETS`, `COST_CENTERS`, `OPERATION_NATURES`, `CHURCH_PROJECTS` |
| `services/relatoriosService.ts` | Import Firebase removido (comentado) |
| `services/analiticaService.ts` | Import Firebase removido (comentado) |
| `src/pages/Login.tsx` | Criado (página de login) |
| `src/pages/Dashboard.tsx` | Criado (painel de controle) |
| `App.tsx` | Imports corrigidos: `types` → `tipos`, `ThemeContext` → `temaContext`, `useAudit` → `useAuditoria` |
| `components/Auditoria.tsx` | Import corrigido: `auditService` → `auditoria-servico` |
| `api/src/routes/funcionarios.ts` | Propriedades duplicadas removidas |
| `tipos.ts` | Import corrigido: `./types/accounting` → `./types/contabil` |
| `types/financeiro.ts` | Import corrigido: `../types` → `../tipos` |
| `constants/contabil.ts` | Import corrigido: `../types/accounting` → `../types/contabil` |
| `components/ConciliacaoBancaria.tsx` | Import corrigido: `bankReconciliationService` → `conciliacaoBancariaService` |
| `components/Configuracoes.tsx` | Import corrigido: `cryptoService` → `criptografiaService` |
| `components/Comunicacao.tsx` | Import corrigido: `../types/communication` → `../types/comunicacao` |
| `components/Notificacoes.tsx` | Import corrigido: `../types/communication` → `../types/comunicacao` |
| `components/ContasBancarias.tsx` | Import corrigido: `../constants/banks` → `../constants/bancos` |
| `services/comunicacaoService.ts` | Import corrigido: `../types/communication` → `../types/comunicacao` |
| `src/utils/mapeamentoCampos.ts` | Import corrigido: `../tipos` → `../../tipos` |
| `src/services/inicializadorDados.ts` | Import corrigido: `../../types` → `../../tipos` |
| `src/services/usuariosService.ts` | Import corrigido: `../../types` → `../../tipos` |
| `src/services/usuarioService.ts` | Import corrigido: `../../types` → `../../tipos`, `../utils/promiseUtils` → `../utils/promessaUtils` |
| `src/services/unidadeService.ts` | Import corrigido: `../../types` → `../../tipos` |
| `src/services/funcionarioService.ts` | Import corrigido: `../../types` → `../../tipos` |
| `src/services/autenticacaoService.ts` | Import corrigido: `../../types` → `../../tipos` |
| `src/services/membroService.ts` | Import corrigido: `../../types` → `../../tipos` |
| `src/hooks/useAuditoria.ts` | Import corrigido: `../../types` → `../../tipos` |
| `package.json` | Adicionado `@types/jest` em devDependencies |
| `services/tesourariaService.ts` | Endpoints corrigidos: `contas_bancarias` → `contas-bancarias` |
| `services/contasService.ts` | Endpoints corrigidos: `contas_bancarias` → `contas-bancarias` |
| `services/lgpdService.ts` | Endpoints corrigidos: `policy` → `politicas`, `consent` → `consentimentos` |
| `services/conciliacaoBancariaService.ts` | Endpoints corrigidos: `reconciliations` → `conciliacoes-bancarias` |
| `services/bancoDadosService.ts` | Endpoints corrigidos: `members` → `membros`, `contas_bancarias` → `contas-bancarias`, `rh/leaves` → `afastamentos` |

### 56.3 Erros Corrigidos

| Tipo de Erro | Quantidade | Status |
|--------------|------------|--------|
| Imports de `../types` → `../tipos` | ~50 | ✅ Corrigido |
| Imports de services antigos | ~20 | ✅ Corrigido |
| Imports de components antigos | ~5 | ✅ Corrigido |
| Imports de hooks antigos | ~3 | ✅ Corrigido |
| Imports de constants antigos | ~3 | ✅ Corrigido |
| Imports de contexts antigos | ~2 | ✅ Corrigido |
| Imports de utils antigos | ~2 | ✅ Corrigido |
| Endpoints API (inglês → português) | 38 | ✅ Corrigido |
| Tipos não exportados | 6 | ✅ Corrigido |
| Constantes faltantes | 1 | ✅ Corrigido |
| Imports Firebase | 2 | ✅ Corrigido (comentados) |
| Páginas faltantes | 2 | ✅ Corrigido (criadas) |
| Propriedades duplicadas | 2 | ✅ Corrigido |
| **Total** | **~134** | **✅** |

### 56.4 Erros Restantes (pendentes)

| Tipo de Erro | Quantidade | Observação |
|--------------|------------|------------|
| Erros de propriedades em tipos | ~30 | Requer revisão manual dos tipos |
| Erros de sobrecarga (NumberFormat) | ~20 | Requer revisão do uso de `"moeda"` |
| `firebase-admin` em api/scripts | 1 | Script de migração - não afeta build |

### 56.5 Build Concluído

| Componente | Status |
|------------|--------|
| **Frontend (Vite)** | ✅ Build OK |
| **Backend (TypeScript)** | ✅ Build OK |

### 56.5 Backup

| Item | Localização |
|------|-------------|
| Backup do banco | `E:\igrejaerp 282526\backup_igrejaerp_20260528.dump` |
| Backup dos arquivos | Arquivos `.bak` em cada diretório |
| Backup do projeto | `E:\igrejaerp 282526` (cópia completa) |

### 56.6 Próximos Passos

1. ✅ ~~Corrigir propriedades não encontradas nos tipos~~ (parcialmente corrigido)
2. ✅ ~~Verificar se `firebase/firestore` está instalado~~ (imports comentados)
3. ✅ ~~Criar páginas `Login` e `Dashboard` em `src/pages/`~~ (criadas)
4. ✅ ~~Instalar `@types/jest` para testes~~ (instalado)
5. ✅ ~~Executar `npm run build` para validar~~ (build OK)
6. ✅ ~~Executar `cd api && npm run build` para validar backend~~ (build OK)
7. ⏳ Executar testes manuais de funcionalidade
8. ⏳ Deploy em homologação
9. ⏳ Validação com usuários-chave
10. ⏳ Deploy em produção