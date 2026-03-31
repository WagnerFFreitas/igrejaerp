# Migração Firebase → PostgreSQL

## Status da Migração

### ✅ Concluído:
- Análise da estrutura de dados do Firebase
- Criação de scripts de exportação e importação
- Exportação bem-sucedida dos dados do Firebase (1 unit e 1 user)
- Geração de arquivo SQL com dados convertidos

### ❌ Problema Atual:
- **Autenticação PostgreSQL falhando** com as credenciais fornecidas
- O PostgreSQL está rodando mas não aceita as senhas testadas

## Dados Exportados do Firebase

### Units (1 registro):
- **ID**: EBmaDijKcpQFYi6wHZ4J
- **Nome**: Igreja Batista Central
- **CNPJ**: 12.345.678/0001-90
- **Endereço**: Rua Principal, 1000, Centro, Belo Horizonte - MG
- **Pastor**: Carlos Alberto Silva
- **Status**: ACTIVE

### Users (1 registro):
- **ID**: TJx1zTZT13andg2Jtgo0
- **Email**: admin@igrejaexemplo.com
- **Nome**: Administrador
- **Role**: ADMIN
- **Unit ID**: EBmaDijKcpQFYi6wHZ4J

## Arquivos Criados

1. **export-firebase-data.js** - Script para exportar dados do Firebase
2. **import-to-postgres.js** - Script para importar para PostgreSQL
3. **sql-import-data.sql** - Script SQL com dados convertidos
4. **create-user-and-import.sql** - Script completo para criar usuário e importar
5. **firebase-export-2026-03-31T22-12-23-684Z.json** - Dados exportados

## Próximos Passos

### Opção 1: Conectar como PostgreSQL Admin
```bash
# Tentar conectar como postgres com senha vazia ou padrão
psql -U postgres

# Ou tentar com senha 123456
psql -U postgres -W
```

### Opção 2: Executar Script Completo
```bash
# Executar script que cria usuário e importa dados
psql -U postgres -f create-user-and-import.sql
```

### Opção 3: Verificar Configuração PostgreSQL
- Verificar arquivo `pg_hba.conf` para método de autenticação
- Reiniciar serviço PostgreSQL se necessário

## Comandos Úteis

```bash
# Verificar bancos de dados disponíveis
psql -l

# Verificar usuários
psql -c "\du"

# Testar conexão
psql -h localhost -U dev -d ecclesia_secure_2024 -c "SELECT version();"
```

## Estrutura das Tabelas

As tabelas já existem no PostgreSQL conforme schema.sql:
- `units` - Unidades (igrejas/congregações)
- `users` - Usuários do sistema
- `members` - Membros
- `employees` - Funcionários
- `transactions` - Transações financeiras
- `payables` - Contas a pagar
- `receivables` - Contas a receber
- `assets` - Ativos

## Notas

- Os dados do Firebase foram convertidos para o formato PostgreSQL
- Timestamps do Firebase foram convertidos para datetime PostgreSQL
- IDs do Firebase são mantidos como strings no PostgreSQL
- Relacionamentos entre tabelas foram preservados

## Contato

Se precisar de ajuda para resolver o problema de autenticação PostgreSQL, verifique:
1. Se o serviço PostgreSQL está rodando corretamente
2. Se as senhas dos usuários estão corretas
3. Se o método de autenticação está configurado corretamente
