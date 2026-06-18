# 🌱 IGREJAERP - Script de Seed com Dados Fictícios

## 📋 Visão Geral

Este script popula o banco de dados PostgreSQL do IgrejaERP com dados fictícios realistas para fins de desenvolvimento, testes e demonstração.

### O que é incluído?

O seed insere dados em **26 tabelas** com um total de **~200+ registros** incluindo:

✓ **5 Igrejas/Unidades** com diferentes situações  
✓ **15 Pessoas** (pastores, funcionários, membros)  
✓ **12 Membros** com informações de batismo, conversão e ministérios  
✓ **6 Funcionários** com dados de folha de pagamento  
✓ **7 Usuários** com diferentes perfis (ADMIN, PASTOR, TESOUREIRO, etc.)  
✓ **14 Contatos** (emails, telefones, WhatsApp)  
✓ **3 Contas Bancárias** com transações reais  
✓ **9 Transações** (receitas, despesas, transferências)  
✓ **14 Contas do Plano de Contas** (sintéticas e analíticas)  
✓ **6 Registros de Folha de Pagamento** (maio/2026)  
✓ **8 Patrimônios** (imóveis, veículos, equipamentos)  
✓ **5 Eventos da Igreja** com escalas de voluntários  
✓ **12 Módulos de Permissão** com controle de acesso por perfil  
✓ **Políticas LGPD** e logs de consentimento  

---

## 🚀 Como Usar

### Pré-requisitos

1. **PostgreSQL** instalado e rodando
2. **Node.js 14+** instalado
3. **Schema do banco criado** (migrations já executadas)
4. **Arquivo `.env`** configurado com credenciais do banco

### Arquivo `.env` (exemplo)

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=igrejaerp
DB_USER=desenvolvedor
DB_PASSWORD=sua_senha_aqui
NODE_ENV=development
```

### Execução

#### Opção 1: Comando npm (recomendado)

```bash
# Popular o banco com dados fictícios
npm run db:seed

# Limpar e popular novamente
npm run db:seed:clean
```

#### Opção 2: Execução direta

```bash
# Via node
node database/seed.js

# Via CLI do PostgreSQL (sem Node.js)
psql -h localhost -U desenvolvedor -d igrejaerp -f database/seed_dados_ficticios.sql
```

---

## 📊 Estrutura de Dados Inseridos

### Organização Hierárquica

```
Igreja Central (Unidade)
├── Pastor João Silva (Membro + Funcionário + Usuário/ADMIN)
├── Pastora Ana Silva (Membro + Funcionário + Usuário/PASTOR)
├── Membros (12 total)
│   ├── Marcos Ferreira (Ministério: Música)
│   ├── Gabriel Lima (Ministério: Jovens)
│   └── ... (10 mais)
├── Funcionários (6 total)
│   ├── Carlos Santos (Tesoureiro)
│   ├── Beatriz Oliveira (Secretária)
│   └── ... (4 mais)
└── Eventos Mensais
    ├── Culto Dominical (recorrente)
    ├── Estudo Bíblico (recorrente)
    └── ... (3 mais)
```

### Dados Financeiros

**Contas Bancárias:**
- Caixa Principal: R$ 15.000,00
- Banco Caixa Econômica: R$ 45.000,00

**Transações Exemplo:**
- Dízimos: R$ 500 → R$ 600 (4 membros)
- Ofertas: R$ 200
- Despesas: Limpeza (R$ 350), Manutenção (R$ 800)

**Folha de Pagamento (Maio/2026):**
- Pastor João: R$ 3.500 (PRO_LABORE)
- Pastora Ana: R$ 3.000 (PRO_LABORE)
- Tesoureiro: R$ 2.056 (líquido CLT)
- Secretária: R$ 1.843,75 (líquida CLT)

### Controle de Acesso (RBAC)

Perfis de usuário criados:

| Perfil | Módulos Acessíveis | Permissões |
|--------|-------------------|-----------|
| **ADMIN** | Todos (12) | Total (ler, escrever, deletar, gerenciar) |
| **PASTOR** | Dashboard, Pessoas, Membros, Eventos | Gerenciar membros e eventos |
| **TESOUREIRO** | Transações, Relatórios, Pessoas | Gerenciar transações |
| **SECRETARIO** | Pessoas, Membros, Eventos | Gerenciar administrativo |
| **RH** | Funcionários, Folha, Relatórios | Gerenciar RH |
| **DESENVOLVEDOR** | Dashboard, Pessoas, Transações, Auditoria | Acesso técnico |
| **MEMBRO** | Dashboard, Pessoas | Leitura apenas |

---

## 🔐 Credenciais Padrão

Os usuários são criados com senhas criptografadas (bcrypt hash):

```sql
Todos os usuários têm a mesma senha de teste (criptografada):
$2b$10$DKKKK4/5z8z8z8z8z8z8u2N3O4P5Q6R7S8T9U0V1W2
```

Para fins de teste, você precisará:
1. Resetar a senha via application
2. Ou atualizar diretamente no banco com novo hash

**Contas criadas:**
- `pastor_joao` → ADMIN (pode fazer de tudo)
- `pastora_ana` → PASTOR
- `carlos_tesoureiro` → TESOUREIRO
- `beatriz_secretaria` → SECRETARIO
- `pedro_rh` → RH
- `marcos_membro` → MEMBRO
- `gabriel_dev` → DESENVOLVEDOR

---

## 🔄 Limpeza de Dados

Se você deseja **remover todos os dados fictícios** antes de executar o seed novamente:

```bash
# Usar a opção clean (recomendado)
npm run db:seed:clean

# Ou manualmente:
node database/clean-data.sql
npm run db:seed
```

---

## 📝 Dados Reais vs Fictícios

### Dados Realistas Inclusos

✓ CPFs válidos (formato) - educacionais apenas  
✓ CNPJs válidos (formato) - educacionais apenas  
✓ Nomes brasileiros reais  
✓ Estrutura de salary realista com descontos (INSS, IRRF, FGTS)  
✓ Datas de batismo, conversão e admissão coerentes  
✓ Endereços em bairros reais de São Paulo  
✓ Transações financeiras com tipos variados (PIX, Boleto, Cheque, Débito)  
✓ Patrimônio com depreciação acumulada  

### O que NÃO incluir

⚠️ **NUNCA** commitar credenciais reais  
⚠️ **NUNCA** usar dados de pessoas reais  
⚠️ **NUNCA** em ambiente de produção  

---

## 🐛 Troubleshooting

### Erro: "Conexão recusada"

```bash
# Verificar se PostgreSQL está rodando
psql -h localhost -U desenvolvedor -d igrejaerp

# Se falhar, iniciar serviço
# Windows: net start PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### Erro: "Tabelas não encontradas"

```bash
# Executar migrations primeiro
npm run db:setup

# Ou manualmente
psql -h localhost -U desenvolvedor -d igrejaerp -f database/migration/postgres_schema.sql
```

### Erro: "Violação de constraint única"

Dados já existem. Limpar primeiro:

```bash
npm run db:seed:clean
```

### Erro de permissão

Verificar usuário PostgreSQL tem permissão:

```bash
# Conectar como superuser (postgres)
psql -h localhost -U postgres -d igrejaerp

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE igrejaerp TO desenvolvedor;
```

---

## 📚 Estrutura de Arquivos

```
/database/
├── igrejaerp.sql ...................... Schema completo
├── seed_dados_ficticios.sql ........... Script de seed
├── seed.js ............................ Executor Node.js
├── clean-data.sql ..................... Limpeza de dados
└── migration/
    └── postgres_schema.sql ............ Migrações iniciais
```

---

## 🔗 Relacionamentos Principais

```
unidades (5)
├── enderecos (15)
│
pessoas (15)
├── enderecos (15)
├── contatos (14)
├── dados_bancarios_pessoa (3)
├── membros (12)
├── funcionarios (6)
└── usuarios (7)

transacoes (9)
├── contas_bancarias (3)
├── fornecedores (5)
└── lancamentos_contabeis (4)

folha_pagamento (6)
├── funcionarios (6)
└── periodos_folha (3)

eventos_igreja (5)
└── escalas_voluntarios (5)

patrimonios (8)
├── contagens_inventario (3)
├── itens_inventario (4)
└── ajustes_inventario (2)
```

---

## ✅ Verificação Pós-Seed

Após executar o seed, você deve ter:

```sql
-- Contar registros por tabela
SELECT 'enderecos' as tabela, COUNT(*) as registros FROM public.enderecos
UNION ALL
SELECT 'unidades', COUNT(*) FROM public.unidades
UNION ALL
SELECT 'pessoas', COUNT(*) FROM public.pessoas
UNION ALL
SELECT 'usuarios', COUNT(*) FROM public.usuarios
UNION ALL
SELECT 'membros', COUNT(*) FROM public.membros
UNION ALL
SELECT 'funcionarios', COUNT(*) FROM public.funcionarios
UNION ALL
SELECT 'transacoes', COUNT(*) FROM public.transacoes
UNION ALL
SELECT 'eventos_igreja', COUNT(*) FROM public.eventos_igreja;
```

---

## 📖 Próximos Passos

1. **Iniciar aplicação:** `npm run dev`
2. **Login:** Usar credenciais dos usuários criados
3. **Explorar:** Navegar pelos módulos disponíveis
4. **Testar:** Confirmar funcionalidades com dados exemplo
5. **Modificar:** Adaptar dados segundo necessidade

---

## 🚨 Avisos de Segurança

⚠️ Este script é APENAS para desenvolvimento  
⚠️ NÃO usar em ambiente de produção  
⚠️ Dados são fictícios para testes  
⚠️ Senhas são apenas exemplos  
⚠️ Remover antes de deploy em produção  

---

## 📞 Suporte

Dúvidas ou problemas?

1. Verificar `.env` está configurado corretamente
2. Confirmar PostgreSQL está rodando
3. Executar `npm run db:test` para diagnóstico
4. Consultar logs de erro detalhado

---

**Versão:** 1.0  
**Data:** 2026-05-31  
**Status:** ✅ Production Ready para Desenvolvimento
