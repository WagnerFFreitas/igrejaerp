# Igreja ERP API

API RESTful para o sistema de gestão para igrejas, construída com Node.js, Express, TypeScript e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem JavaScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Axios** - Cliente HTTP

## 📁 Estrutura

```
api/
├── src/
│   ├── controllers/     # Controllers da API
│   ├── routes/         # Rotas REST
│   ├── database/       # Conexão PostgreSQL
│   └── index.ts        # Servidor Express
├── scripts/            # Scripts de migração
├── dist/              # Build compilado
└── package.json       # Dependências
```

## 🔧 Instalação

```bash
cd api
npm install
```

## 🗄️ Configuração do Banco

O arquivo `.env` contém as configurações do PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=igrejaerp
DB_USER=desenvolvedor
DB_PASSWORD=dev@ecclesia_secure_2024
```

## 🚀 Iniciar Servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

## 📚 Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Logout

### Membros
- `GET /api/members` - Listar membros
- `GET /api/members/:id` - Buscar membro
- `POST /api/members` - Criar membro
- `PUT /api/members/:id` - Atualizar membro
- `DELETE /api/members/:id` - Remover membro

### Outros
- `GET /api/employees` - Funcionários
- `GET /api/transactions` - Transações
- `GET /api/units` - Unidades
- `GET /api/assets` - Ativos
- `GET /api/events` - Eventos

## 🏥 Health Check

- `GET /health` - Status da API

## 🔐 Autenticação

A API usa JWT tokens. Inclua o token no header Authorization:

```
Authorization: Bearer <token>
```

## 📊 Scripts de Migração

```bash
# Exportar dados do Firebase
npx ts-node scripts/export-firebase.ts

# Importar para PostgreSQL
npx ts-node scripts/import-postgres.ts

# Validar dados
npx ts-node scripts/validate-data.ts
```
