@echo off
echo ========================================
echo ADJPA ERP - INICIAR SISTEMA LOCAL
echo ========================================
echo.
echo Este script vai:
echo 1. Iniciar os emuladores Firebase
echo 2. Iniciar o sistema web
echo 3. Abrir o navegador automaticamente
echo.
echo Pressione qualquer tecla para iniciar...
pause > nul

echo.
echo [1/3] Iniciando emuladores Firebase...
start "Firebase Emulators" cmd /c "firebase emulators:start"

echo Aguardando 15 segundos para os emuladores iniciarem...
timeout /t 15 /nobreak > nul

echo.
echo [2/3] Iniciando sistema web...
start "ADJPA ERP" cmd /c "npm run dev"

echo Aguardando 10 segundos para o servidor iniciar...
timeout /t 10 /nobreak > nul

echo.
echo [3/3] Abrindo navegador...
start http://localhost:3000

echo.
echo ========================================
echo ✅ SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo URLs importantes:
echo - Sistema: http://localhost:3000
echo - Emuladores UI: http://localhost:4000
echo - Firestore: http://localhost:8080
echo.
echo Usuario: desenvolvedor
echo Senha: dev@ecclesia_secure_2024
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
