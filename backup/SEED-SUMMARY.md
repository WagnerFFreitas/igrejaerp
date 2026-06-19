# 📦 IGREJAERP - Seed de Dados Fictícios - SUMMARY

## 🎯 O Que Foi Criado?

Um conjunto completo de scripts para popular o banco de dados PostgreSQL com **200+ registros realistas** em **26 tabelas**.

---

## 📁 Arquivos Criados

| Arquivo | Descrição | Tipo |
|---------|-----------|------|
| `seed_dados_ficticios.sql` | Script SQL com INSERT de dados ficticios | SQL |
| `seed.js` | Executor Node.js do seed com validações | Node.js |
| `verify.js` | Verifica dados inseridos com estatísticas | Node.js |
| `clean-data.sql` | Remove dados de teste (preserva schema) | SQL |
| `setup-seed.sh` | Script bash para setup automático | Bash |
| `README-SEED.md` | Documentação completa | Markdown |
| `SUMMARY.md` | Este arquivo | Markdown |

---

## 🚀 Como Usar (3 Opções)

### Opção 1: npm (Recomendada)

```bash
# Popular com dados fictícios
npm run db:seed

# Limpar e popular novamente
npm run db:seed:clean
```

### Opção 2: Script Bash (Automático)

```bash
cd database
chmod +x setup-seed.sh
./setup-seed.sh
```

### Opção 3: Direto PostgreSQL

```bash
psql -h localhost -U desenvolvedor -d igrejaerp -f database/seed_dados_ficticios.sql
```

---

## 📊 Dados Inseridos

### 🏢 Organizações
- **5 Unidades** (Igrejas): Central, Norte, Sul, Leste, Oeste
- **15 Endereços** distribuídos em São Paulo

### 👥 Pessoas
- **15 Pessoas** (Pastores, Funcionários, Membros)
- **12 Membros** com ministérios e dados de batismo
- **6 Funcionários** com regime de trabalho variado
- **7 Usuários** com 7 perfis diferentes

### 📞 Contatos
- **14 Contatos** (emails, telefones, WhatsApp, celulares)
- Associados a pessoas e unidades

### 💰 Financeiro
- **3 Contas Bancárias** (Caixa e Bancos)
- **9 Transações** (Receitas, Despesas, Transferências)
- **14 Contas do Plano de Contas** (Análiticas e Sintéticas)
- **4 Lançamentos Contábeis**
- **5 Fornecedores** (Empresas)

### 💼 Folha de Pagamento
- **6 Registros** de folha (Maio/2026)
- **3 Períodos** de folha
- **3 Afastamentos** (Férias, Médico, etc.)

### 🏗️ Patrimônio
- **8 Patrimônios** (Imóvel, Veículos, Computadores, Móveis, Equipamentos)
- **3 Contagens** de inventário
- **4 Itens** de inventário
- **2 Ajustes** de inventário

### ⛪ Igreja
- **5 Eventos** (Cultos, Estudos, Conferências)
- **5 Escalas** de voluntários

### 🔐 Sistema
- **12 Módulos** de permissão
- **30+ Permissões** por perfil (ADMIN, PASTOR, TESOUREIRO, etc.)
- **Políticas LGPD** e logs de consentimento

---

## 🔑 Usuários Criados

| Login | Perfil | Acesso |
|-------|--------|--------|
| `pastor_joao` | ADMIN | Acesso total a 12 módulos |
| `pastora_ana` | PASTOR | Gestão de membros e eventos |
| `carlos_tesoureiro` | TESOUREIRO | Transações e relatórios |
| `beatriz_secretaria` | SECRETARIO | Pessoas, membros e eventos |
| `pedro_rh` | RH | Funcionários e folha de pagamento |
| `gabriel_dev` | DESENVOLVEDOR | Acesso técnico |
| `marcos_membro` | MEMBRO | Leitura básica |

**Senha padrão:** (Hash bcrypt idêntico para todos - exigirá reset na primeiro login)

---

## ✅ Verificação Pós-Seed

```bash
# Executar verificação e ver estatísticas
node database/verify.js
```

**Saída esperada:**
```
✓ Base: 15 endereços, 5 unidades, 15 pessoas, 14 contatos
✓ Pessoas: 7 usuários, 12 membros, 6 funcionários, 3 dados bancários
✓ Financeiro: 4 contas financeiras, 3 contas bancárias, 14 contas, 5 fornecedores, 9 transações, 4 lançamentos
✓ RH: 6 folhas, 3 períodos, 3 afastamentos
✓ Patrimônio: 8 patrimônios, 3 contagens, 4 itens, 2 ajustes
✓ Igreja: 5 eventos, 5 escalas voluntários
✓ Sistema: 12 módulos, 30+ permissões
Total: 200+ registros
```

---

## 🗑️ Limpeza de Dados

```bash
# Remover todos os dados fictícios (preserva schema)
npm run db:seed:clean

# Ou manualmente
psql -h localhost -U desenvolvedor -d igrejaerp -f database/clean-data.sql
```

---

## 📋 Checklist de Setup

- [ ] PostgreSQL instalado e rodando
- [ ] Node.js 14+ instalado
- [ ] `.env` configurado com credenciais
- [ ] Schema do banco criado (migrations executadas)
- [ ] Executar `npm run db:seed`
- [ ] Executar `npm run db:seed:clean` se precisar resetar
- [ ] Verificar com `node database/verify.js`
- [ ] Iniciar aplicação com `npm run dev`
- [ ] Fazer login com `pastor_joao` / senha padrão

---

## 🔒 Dados Realistas vs Fictícios

### ✅ Inclusos (Realistas)
- ✓ CPFs válidos (formato educacional)
- ✓ CNPJs válidos (formato educacional)
- ✓ Nomes brasileiros reais
- ✓ Endereços em bairros reais (SP)
- ✓ Estrutura de salary realista com descontos
- ✓ Transações com múltiplos tipos de pagamento
- ✓ Patrimônio com depreciação

### ❌ NÃO Inclusos
- ✗ CPF/CNPJ de pessoas reais
- ✗ Dados de produção
- ✗ Credenciais reais
- ✗ Informações sensíveis

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Conexão recusada" | Verificar se PostgreSQL está rodando |
| "Tabelas não encontradas" | Executar `npm run db:setup` para migrations |
| "Violação de constraint" | Dados já existem - usar `npm run db:seed:clean` |
| "Erro de permissão" | Verificar permissões do usuário PostgreSQL |
| "Node: comando não encontrado" | Instalar Node.js 14+ |

---

## 📚 Documentação Completa

Ver arquivo: `database/README-SEED.md`

Inclui:
- Pré-requisitos detalhados
- Estrutura de dados em profundidade
- Troubleshooting avançado
- Informações sobre RBAC
- Referência de relacionamentos

---

## 🔄 Fluxo Recomendado

```
1. Clone/pull do repositório
   └─ cd igrejaerp

2. Instale dependências
   └─ npm install

3. Configure .env
   └─ Copie .env.example e ajuste credenciais

4. Execute migrations
   └─ npm run db:setup

5. Popular com dados fictícios
   └─ npm run db:seed

6. Verifique dados
   └─ node database/verify.js

7. Inicie a aplicação
   └─ npm run dev

8. Faça login
   └─ Use credenciais criadas (ex: pastor_joao)
```

---

## 💡 Casos de Uso

### Desenvolvimento
```bash
npm run db:seed:clean  # Limpar e popular novamente
npm run api:dev        # Testar com dados reais
```

### Testes
```bash
# Usar dados fictícios para unit/integration tests
npm run db:seed        # Seed uma vez
# Tests rodam contra dados conhecidos
```

### Demo/Apresentação
```bash
npm run db:seed:clean  # Dados sempre "frescos"
npm run dev            # Mostrar interface funcional
```

### CI/CD
```bash
# Configurar .env no pipeline
npm run db:setup       # Migrations
npm run db:seed        # Dados de teste
npm run test           # Testes
```

---

## ⚠️ Avisos Importantes

🚨 **NUNCA usar em produção**  
🚨 **NÃO commitar credenciais reais**  
🚨 **NÃO usar dados de pessoas reais**  
🚨 **REMOVER antes de deployment**  
🚨 **REDEFINIR senhas antes de qualquer uso real**

---

## 📞 Próximos Passos

1. **Explorar dados:** Login e navegar pelos módulos
2. **Testar CRUD:** Criar, editar, deletar registros
3. **Validar permissões:** Testar acesso por perfil
4. **Verificar relatórios:** Visualizar estatísticas
5. **Adaptar dados:** Modificar conforme necessário

---

## 🎓 Estrutura do Banco (Resumida)

```
igrejaerp
├── Schema Core
│   ├── enderecos (15)
│   ├── unidades (5)
│   ├── pessoas (15)
│   └── contatos (14)
├── Especialização
│   ├── membros (12)
│   ├── funcionarios (6)
│   ├── usuarios (7)
│   └── dados_bancarios (3)
├── Financeiro
│   ├── transacoes (9)
│   ├── contas_bancarias (3)
│   ├── plano_contas (14)
│   └── lancamentos_contabeis (4)
├── RH
│   ├── folha_pagamento (6)
│   ├── periodos_folha (3)
│   └── afastamentos_funcionarios (3)
├── Patrimônio
│   ├── patrimonios (8)
│   ├── contagens_inventario (3)
│   ├── itens_inventario (4)
│   └── ajustes_inventario (2)
├── Igreja
│   ├── eventos_igreja (5)
│   └── escalas_voluntarios (5)
└── Sistema
    ├── app_permission_modules (12)
    ├── app_role_permissions (30+)
    ├── app_user_permissions
    ├── app_audit_logs
    └── politicas_lgpd (3)
```

---

## 📦 Total de Registros

```
Base:        49 registros
Financeiro:  41 registros
RH:          12 registros
Patrimônio:  17 registros
Igreja:      10 registros
Sistema:     75+ registros
───────────────────────
TOTAL:       200+ registros
```

---

**Versão:** 1.0  
**Data:** 2026-05-31  
**Status:** ✅ Pronto para Desenvolvimento

Para dúvidas ou problemas, consulte `database/README-SEED.md`
