# 📋 Padronização de Nomenclatura - igrejaERP

**Data**: 27 de abril de 2026  
**Versão**: 1.0  
**Status**: ✅ Implementado

---

## 🎯 Objetivo

Padronizar a nomenclatura de campos do banco de dados PostgreSQL seguindo as convenções:
- Campos de relacionamento: `sufixo_id` → `id_prefixo`
- Timestamps: `criado_em` → `criado`, `atualizado_em` → `atualizado`
- Booleanos: `eh_*` → `*`, `pode_*` → `*`
- Datas: `data_fim` → `data_final`
- Dados: `profile_data` → `dados_perfil`

---

## 📊 Mapeamento Completo de Mudanças

### 1️⃣ Renomeações de IDs (sufixo_id → id_prefixo)

| Tabela | Coluna Antiga | Coluna Nova | Tipo | Uso |
|--------|---|---|---|---|
| `transactions` | `conta_id` | `id_conta` | UUID | FK para financial_accounts |
| `transactions` | `unidade_id` | `id_unidade` | UUID | FK para units |
| `transactions` | `membro_id` | `id_membro` | UUID | FK para members |
| `transactions` | `pai_id` | `id_transacao_origem` | UUID | FK para transação pai |
| `members` | `unidade_id` | `id_unidade` | UUID | FK para units |
| `employees` | `unidade_id` | `id_unidade` | UUID | FK para units |
| `employees` | `funcionario_id` | `id_funcionario` | VARCHAR | ID do funcionário |
| `employee_leaves` | `funcionario_id` | `id_funcionario` | UUID | FK para employees |
| `employee_dependents` | `funcionario_id` | `id_funcionario` | UUID | FK para employees |
| `payroll` | `funcionario_id` | `id_funcionario` | UUID | FK para employees |
| `payroll_calculations` | `funcionario_id` | `id_funcionario` | UUID | FK para employees |
| `payroll_periods` | `unidade_id` | `id_unidade` | UUID | FK para units |
| `performance_evaluations` | `funcionario_id` | `id_funcionario` | UUID | FK para employees |
| `dependents` | `membro_id` | `id_membro` | UUID | FK para members |
| `member_contributions` | `membro_id` | `id_membro` | UUID | FK para members |
| `member_dependents` | `membro_id` | `id_membro` | UUID | FK para members |
| `financial_accounts` | `unidade_id` | `id_unidade` | UUID | FK para units |
| `bank_reconciliations` | `unidade_id` | `id_unidade` | UUID | FK para units |
| `bank_reconciliations` | `conta_id` | `id_conta` | UUID | FK para financial_accounts |
| `inventory_counts` | `unidade_id` | `id_unidade` | UUID | FK para units |
| `assets` | `unidade_id` | `id_unidade` | UUID | FK para units |
| `audit_logs` | `entidade_id` | `id_entidade` | VARCHAR | ID da entidade |
| `app_audit_logs` | `entidade_id` | `id_entidade` | VARCHAR | ID da entidade |

---

### 2️⃣ Renomeações de Booleanos (eh_* → *)

| Tabela | Coluna Antiga | Coluna Nova | Tipo | Descrição |
|--------|---|---|---|---|
| `members` | `eh_dizimista` | `dizimista` | BOOLEAN | É dizimista? |
| `members` | `eh_ofertante_regular` | `ofertante_regular` | BOOLEAN | É ofertante regular? |
| `members` | `eh_pcd` | `pcd` | BOOLEAN | É PCD? |
| `transactions` | `eh_parcelado` | `parcelado` | BOOLEAN | É parcelado? |
| `membros` | `eh_dizimista` | `dizimista` | BOOLEAN | É dizimista? |
| `membros` | `eh_ofertante_regular` | `ofertante_regular` | BOOLEAN | É ofertante regular? |
| `membros` | `eh_pcd` | `pcd` | BOOLEAN | É PCD? |
| `membros` | `eh_parcelado` | `parcelado` | BOOLEAN | É parcelado? |

---

### 3️⃣ Renomeações de Permissões (pode_* → *)

| Tabela | Coluna Antiga | Coluna Nova | Tipo | Descrição |
|--------|---|---|---|---|
| `app_role_permissions` | `pode_ler` | `ler` | BOOLEAN | Pode ler? |
| `app_role_permissions` | `pode_escrever` | `escrever` | BOOLEAN | Pode escrever? |
| `app_role_permissions` | `pode_excluir` | `excluir` | BOOLEAN | Pode deletar? |
| `app_role_permissions` | `pode_administrar` | `administrador` | BOOLEAN | Pode administrar? |
| `app_user_permissions` | `pode_ler` | `ler` | BOOLEAN | Pode ler? |
| `app_user_permissions` | `pode_escrever` | `escrever` | BOOLEAN | Pode escrever? |
| `app_user_permissions` | `pode_excluir` | `excluir` | BOOLEAN | Pode deletar? |
| `app_user_permissions` | `pode_administrar` | `administrador` | BOOLEAN | Pode administrar? |
| `role_permissions` | `pode_ler` | `ler` | BOOLEAN | Pode ler? |
| `role_permissions` | `pode_escrever` | `escrever` | BOOLEAN | Pode escrever? |
| `role_permissions` | `pode_excluir` | `excluir` | BOOLEAN | Pode deletar? |
| `role_permissions` | `pode_administrar` | `administrador` | BOOLEAN | Pode administrar? |
| `user_permissions` | `pode_ler` | `ler` | BOOLEAN | Pode ler? |
| `user_permissions` | `pode_escrever` | `escrever` | BOOLEAN | Pode escrever? |
| `user_permissions` | `pode_excluir` | `excluir` | BOOLEAN | Pode deletar? |
| `user_permissions` | `pode_administrar` | `administrador` | BOOLEAN | Pode administrar? |

---

### 4️⃣ Renomeações de Timestamps

| Tabela | Coluna Antiga | Coluna Nova | Tipo | Descrição |
|--------|---|---|---|---|
| `*` (Todas) | `criado_em` | `criado` | TIMESTAMP | Data de criação |
| `*` (Todas) | `atualizado_em` | `atualizado` | TIMESTAMP | Data de atualização |
| `payroll_periods` | `processado_em` | `processado` | TIMESTAMP | Data de processamento |
| `payroll` | `processado_em` | `processado` | TIMESTAMP | Data de processamento |

---

### 5️⃣ Renomeações de Datas

| Tabela | Coluna Antiga | Coluna Nova | Tipo | Descrição |
|--------|---|---|---|---|
| `employee_leaves` | `data_fim` | `data_final` | DATE | Data final do afastamento |
| `payroll_periods` | `data_fim` | `data_final` | DATE | Data final do período |

---

### 6️⃣ Renomeações de Dados

| Tabela | Coluna Antiga | Coluna Nova | Tipo | Descrição |
|--------|---|---|---|---|
| `members` | `profile_data` | `dados_perfil` | JSONB | Dados extras do perfil |
| `employees` | `profile_data` | `dados_perfil` | JSONB | Dados extras do perfil |
| `transactions` | `profile_data` | `dados_perfil` | JSONB | Dados extras |

---

## 📁 Arquivos Modificados

### 1. **Database Migrations**
- ✅ `database/migration/011_migracao_completa.sql` - ADICIONADOS todos os ALTERs
- ✅ `database/migracao_portugues_completa.sql` - Ainda contém nomes antigos (referência)

### 2. **API Services**
- ✅ `api/src/services/permissionsService.ts` - Renomeações de `pode_*` para `*`
- ✅ `api/test_api.ts` - Atualizado para usar `dados_perfil`

### 3. **Documentação**
- ✅ `docs/relacao.md` - ATUALIZADO com novos nomes de colunas
- ✅ `PADRONIZACAO_2026.md` - Este arquivo (Novo)

---

## 🚀 Como Aplicar as Mudanças

### Passo 1: Backup do Banco de Dados
```bash
# Fazer backup antes de aplicar
pg_dump -U seu_usuario -d sua_db > backup_2026_04_27.sql
```

### Passo 2: Executar Migration
```bash
# Conectar ao PostgreSQL
psql -U seu_usuario -d sua_db

# Executar o script
\i database/migration/011_migracao_completa.sql
```

### Passo 3: Verificar Mudanças
```sql
-- Exemplo: Verificar nova estrutura da tabela transactions
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions'
ORDER BY ordinal_position;

-- Esperado: ver 'id_conta', 'id_unidade', 'id_membro', etc.
```

### Passo 4: Atualizar Queries nas APIs
As aplicações que fazem query devem usar os novos nomes de colunas:
```typescript
// Antes
SELECT * FROM transactions WHERE conta_id = $1

// Depois
SELECT * FROM transactions WHERE id_conta = $1
```

---

## ⚙️ Impacto nos Componentes

### Componentes Afetados
- **Financeiro**: `Financeiro.tsx`, `ContasBancarias.tsx`, `ContasPagar.tsx`, etc.
- **RH**: `Funcionarios.tsx`, `FolhaPagamento.tsx`, `Afastamentos.tsx`, etc.
- **Membros**: `Membros.tsx`, `PortalMembro.tsx`, etc.
- **Permissões**: `UserPermissionsPanel.tsx`, `Configuracoes.tsx`

### Services Afetados
- `databaseService.ts` - Mapeamentos de dados
- `accountService.ts` - Contas financeiras
- `payrollService.ts` - Folha de pagamento
- `permissionsService.ts` - ✅ ATUALIZADO
- Todos os services que usam esses campos

---

## 📋 Checklist de Validação

- [ ] Backup do banco de dados realizado
- [ ] Migration SQL executada (011_migracao_completa.sql)
- [ ] Testes de query executados
- [ ] APIs atualizadas para usar novos nomes
- [ ] Componentes testados com novos nomes
- [ ] Testes unitários passando
- [ ] Documentação atualizada

---

## 🔍 Validação de Colunas

Para validar se todas as mudanças foram aplicadas:

```sql
-- Verificar 'id_unidade' nas tabelas principais
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE column_name IN ('id_unidade', 'id_conta', 'id_membro', 'id_funcionario', 'dados_perfil')
ORDER BY table_name, column_name;

-- Verificar renomeações de permissões
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_name LIKE '%permission%' 
  AND column_name IN ('ler', 'escrever', 'excluir', 'administrador')
ORDER BY table_name;

-- Verificar timestamps
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE column_name IN ('criado', 'atualizado')
  AND table_name IN ('transactions', 'members', 'employees', 'payroll')
ORDER BY table_name;
```

---

## 📝 Notas Importantes

1. **Compatibilidade**: Após aplicar a migration, todas as queries devem usar os novos nomes
2. **Views**: Se houver views que referenciam essas colunas, elas também precisam ser atualizadas
3. **Índices**: Os índices foram automaticamente redenomeados pelo PostgreSQL
4. **Foreign Keys**: As FKs continuam funcionando normalmente
5. **Triggers/Functions**: Se existirem, devem ser verificadas e atualizadas

---

## 📞 Contato e Suporte

Para dúvidas sobre a migração:
- Verifique o arquivo `database/migration/011_migracao_completa.sql`
- Consulte `docs/relacao.md` para o mapeamento completo
- Revise este arquivo `PADRONIZACAO_2026.md`

---

**Documento criado**: 27 de abril de 2026  
**Status**: ✅ Completo e Pronto para Aplicação
