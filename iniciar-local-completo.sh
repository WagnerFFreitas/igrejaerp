#!/bin/bash
echo "========================================"
echo "ADJPA ERP - INICIAR SISTEMA LOCAL"
echo "========================================"
echo ""
echo "Este script vai:"
echo "1. Iniciar os emuladores Firebase"
echo "2. Iniciar o sistema web"
echo "3. Abrir o navegador automaticamente"
echo ""
read -p "Pressione Enter para iniciar..."
echo ""

echo "[1/3] Iniciando emuladores Firebase..."
firebase emulators:start &
EMULATORS_PID=$!

echo "Aguardando 15 segundos para os emuladores iniciarem..."
sleep 15

echo ""
echo "[2/3] Iniciando sistema web..."
npm run dev &
WEB_PID=$!

echo "Aguardando 10 segundos para o servidor iniciar..."
sleep 10

echo ""
echo "[3/3] Abrindo navegador..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
else
    echo "Abra manualmente: http://localhost:3000"
fi

echo ""
echo "========================================"
echo "✅ SISTEMA INICIADO COM SUCESSO!"
echo "========================================"
echo ""
echo "URLs importantes:"
echo "- Sistema: http://localhost:3000"
echo "- Emuladores UI: http://localhost:4000"
echo "- Firestore: http://localhost:8080"
echo ""
echo "Usuario: desenvolvedor"
echo "Senha: dev@ecclesia_secure_2024"
echo ""
echo "Para parar: Ctrl+C ou feche as janelas"
