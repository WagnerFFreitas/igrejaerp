#!/bin/bash

# ============================================================================
# IGREJAERP - Setup Rápido de Dados Fictícios
# ============================================================================

set -e

echo -e "\n\033[1;36m🌱 IGREJAERP - Setup de Dados Fictícios\033[0m\n"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Funções
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; exit 1; }

# Verificar Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado. Instale Node.js 14+ e tente novamente."
fi
log_success "Node.js $(node -v)"

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    log_error "PostgreSQL não encontrado. Instale PostgreSQL e tente novamente."
fi
log_success "PostgreSQL instalado"

# Verificar .env
if [ ! -f .env ]; then
    log_warn ".env não encontrado. Criando arquivo de exemplo..."
    cat > .env.example << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=igrejaerp
DB_USER=desenvolvedor
DB_PASSWORD=
NODE_ENV=development
EOF
    log_warn "Criar arquivo .env baseado em .env.example"
    exit 1
fi

log_success ".env encontrado"

# Verificar conexão com banco
echo -e "\n${BLUE}→${NC} Testando conexão com banco de dados..."
cd database
node test-connection.js 2>/dev/null && log_success "Conexão OK" || log_error "Falha na conexão"

# Executar seed
echo -e "\n${BLUE}→${NC} Executando seed..."
node seed.js || log_error "Falha ao executar seed"

# Verificar dados
echo -e "\n${BLUE}→${NC} Verificando dados inseridos..."
node verify.js || log_error "Falha na verificação"

# Sucesso
echo -e "\n${GREEN}✓ Setup concluído com sucesso!${NC}"
echo -e "\n${BLUE}Próximos passos:${NC}"
echo "  1. npm run dev           # Iniciar aplicação"
echo "  2. npm run api:dev       # Iniciar API"
echo "  3. Fazer login com um dos usuários criados"
echo "  4. Explorar os dados de teste"
echo -e "\n${YELLOW}Credenciais padrão (todos têm a mesma senha de teste):${NC}"
echo "  • pastor_joao (ADMIN)"
echo "  • pastora_ana (PASTOR)"
echo "  • carlos_tesoureiro (TESOUREIRO)"
echo "  • beatriz_secretaria (SECRETARIO)"
echo "  • pedro_rh (RH)"
echo -e "\n"
