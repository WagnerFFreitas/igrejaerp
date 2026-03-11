@echo off
echo ========================================
echo CONFIGURADOR FIREBASE - ADJPA ERP
echo ========================================
echo.
echo ANTES DE EXECUTAR:
echo 1. Acesse https://console.firebase.google.com
echo 2. Crie um novo projeto
echo 3. Adicione um app Web
echo 4. Copie as credenciais
echo.
echo Pressione qualquer tecla para continuar...
pause > nul
echo.

set /p API_KEY="Digite sua API KEY: "
set /p AUTH_DOMAIN="Digite seu AUTH DOMAIN: "
set /p PROJECT_ID="Digite seu PROJECT ID: "
set /p STORAGE_BUCKET="Digite seu STORAGE BUCKET: "
set /p SENDER_ID="Digite seu MESSAGING SENDER ID: "
set /p APP_ID="Digite seu APP ID: "

echo.
echo Atualizando .env.local...

(
echo # CONFIGURAÇÕES DO FIREBASE
echo # Credenciais obtidas do Firebase Console
echo.
echo VITE_FIREBASE_API_KEY=%API_KEY%
echo VITE_FIREBASE_AUTH_DOMAIN=%AUTH_DOMAIN%
echo VITE_FIREBASE_PROJECT_ID=%PROJECT_ID%
echo VITE_FIREBASE_STORAGE_BUCKET=%STORAGE_BUCKET%
echo VITE_FIREBASE_MESSAGING_SENDER_ID=%SENDER_ID%
echo VITE_FIREBASE_APP_ID=%APP_ID%
echo.
echo # Configurações adicionais (opcional)
echo GEMINI_API_KEY=sua_chave_gemini_aqui
) > .env.local

echo.
echo ✅ Arquivo .env.local atualizado com sucesso!
echo.
echo Próximos passos:
echo 1. Execute: npm run dev
echo 2. Acesse: http://localhost:3000
echo 3. Teste o cadastro de membros
echo.
pause
