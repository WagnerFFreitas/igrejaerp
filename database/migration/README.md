# 🛠️ Scripts de Migração

Este diretório contém os scripts necessários para executar a migração do Firebase para PostgreSQL.

## 📁 Estrutura

```
migration/
├── postgres_schema.sql         # Schema completo do PostgreSQL
├── scripts/
│   ├── export-firebase.js      # Exportação de dados do Firebase
│   ├── import-postgres.js       # Importação para PostgreSQL
│   ├── validate-data.js        # Validação de integridade
│   └── rollback.js             # Rollback para Firebase
└── README.md                   # Este arquivo
```

## 🚀 Como Usar

### 1. Preparar Ambiente
```bash
# Instalar PostgreSQL
brew install postgresql  # macOS
# ou
sudo apt install postgresql  # Linux

# Criar banco de dados
createdb igrejaerp
psql igrejaerp < postgres_schema.sql
```

### 2. Exportar do Firebase
```bash
cd scripts
npm install firebase-admin
node export-firebase.js
```

### 3. Importar para PostgreSQL
```bash
npm install pg
node import-postgres.js
```

### 4. Validação
```bash
node validate-data.js
```

## ⚠️ Importante

- Faça backup completo antes de iniciar
- Teste em ambiente de staging primeiro
- Mantenha o Firebase ativo durante 30 dias após a migração
