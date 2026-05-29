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
- `GET /api/membros` - Listar membros
- `GET /api/membros/:id` - Buscar membro
- `POST /api/membros` - Criar membro
- `PUT /api/membros/:id` - Atualizar membro
- `DELETE /api/membros/:id` - Remover membro

### Outros
- `GET /api/funcionarios` - Funcionários
- `GET /api/transacoes` - Transações
- `GET /api/unidades` - Unidades
- `GET /api/patrimonios` - Ativos
- `GET /api/eventos-igreja` - Eventos

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
