#!/bin/bash
echo "========================================"
echo "CONFIGURADOR FIREBASE - ADJPA ERP"
echo "========================================"
echo ""
echo "ANTES DE EXECUTAR:"
echo "1. Acesse https://console.firebase.google.com"
echo "2. Crie um novo projeto"
echo "3. Adicione um app Web"
echo "4. Copie as credenciais"
echo ""
read -p "Pressione Enter para continuar..."
echo ""

read -p "Digite sua API KEY: " API_KEY
read -p "Digite seu AUTH DOMAIN: " AUTH_DOMAIN
read -p "Digite seu PROJECT ID: " PROJECT_ID
read -p "Digite seu STORAGE BUCKET: " STORAGE_BUCKET
read -p "Digite seu MESSAGING SENDER ID: " SENDER_ID
read -p "Digite seu APP ID: " APP_ID

echo ""
echo "Atualizando .env.local..."

cat > .env.local << EOF
# CONFIGURAÇÕES DO FIREBASE
# Credenciais obtidas do Firebase Console

VITE_FIREBASE_API_KEY=$API_KEY
VITE_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=$PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=$SENDER_ID
VITE_FIREBASE_APP_ID=$APP_ID

# Configurações adicionais (opcional)
GEMINI_API_KEY=sua_chave_gemini_aqui
EOF

echo ""
echo "✅ Arquivo .env.local atualizado com sucesso!"
echo ""
echo "Próximos passos:"
echo "1. Execute: npm run dev"
echo "2. Acesse: http://localhost:3000"
echo "3. Teste o cadastro de membros"
echo ""
