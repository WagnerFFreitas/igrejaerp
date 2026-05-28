# IgrejaERP — Guia de Migração e Backup do Banco de Dados

## Estrutura da Pasta `/backup`

```
backup/
├── igrejaerp_backup_YYYY-MM-DD_HH-mm-ss.sql   ← Dump completo do banco
└── restaurar_banco.ps1                          ← Script de restauração
```

---

## Banco de Dados de Origem

| Parâmetro     | Valor                        |
|---------------|------------------------------|
| **Host**      | localhost                    |
| **Porta**     | 5432                         |
| **Banco**     | igrejaerp                    |
| **Usuário**   | desenvolvedor                |
| **Senha**     | dev@ecclesia_secure_2024     |
| **Encoding**  | UTF-8                        |
| **Tabelas**   | 61 tabelas                   |

---

## Como Restaurar em Outro Computador

### Pré-requisitos

1. **PostgreSQL 14+** instalado ([download](https://www.postgresql.org/download/windows/))
2. `pg_dump` e `psql` disponíveis no PATH do sistema
3. Pasta `backup/` copiada para a máquina de destino

### Passos

```powershell
# 1. Abra o PowerShell como Administrador
# 2. Navegue até a pasta backup copiada
cd C:\caminho\para\backup

# 3. Execute o script de restauração
.\restaurar_banco.ps1

# O script irá:
# - Criar o usuário 'desenvolvedor'
# - Criar o banco 'igrejaerp'
# - Importar todo o schema e dados
```

### Restauração Manual (alternativa)

```powershell
# Criar o usuário
psql -U postgres -c "CREATE ROLE desenvolvedor LOGIN PASSWORD 'dev@ecclesia_secure_2024';"

# Criar o banco
psql -U postgres -c "CREATE DATABASE igrejaerp OWNER desenvolvedor ENCODING 'UTF8';"

# Importar o dump
$env:PGPASSWORD = "dev@ecclesia_secure_2024"
psql -U desenvolvedor -d igrejaerp -f .\igrejaerp_backup_YYYY-MM-DD_HH-mm-ss.sql
```

---

## Como Gerar Novo Backup

Execute no PowerShell, dentro da pasta `E:\igrejaerp`:

```powershell
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$env:PGPASSWORD = "dev@ecclesia_secure_2024"
pg_dump -h localhost -p 5432 -U desenvolvedor -d igrejaerp -F p -E UTF8 -v -f ".\backup\igrejaerp_backup_$date.sql"
```

---

## Configuração do `.env` após Restauração

Após restaurar, configure o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://desenvolvedor:dev@ecclesia_secure_2024@localhost:5432/igrejaerp
DB_HOST=localhost
DB_PORT=5432
DB_NAME=igrejaerp
DB_USER=desenvolvedor
DB_PASSWORD=dev@ecclesia_secure_2024
```

---

## Observações

- O dump inclui **schema + dados** (estrutura de todas as 61 tabelas + registros)
- O script de restauração usa `ON_ERROR_STOP=0` — erros de objetos duplicados são ignorados
- Para restaurar **somente o schema** (sem dados), adicione `--schema-only` ao `pg_dump`
- Para restaurar **somente os dados**, adicione `--data-only` ao `pg_dump`
