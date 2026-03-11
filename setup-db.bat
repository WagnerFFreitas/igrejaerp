@echo off
chcp 65001 > nul
echo ==========================================
echo Configurando Banco de Dados PostgreSQL
echo ==========================================
echo.

REM Configurações do banco de dados
set DB_NAME=erp_local
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo Este script vai criar o banco de dados "%DB_NAME%" e suas tabelas.
echo Certifique-se de que o PostgreSQL esta instalado e rodando na sua maquina.
echo.

REM Solicita a senha do usuário postgres
set /p PGPASSWORD="Digite a senha do usuario postgres (ou pressione Enter se nao tiver): "

echo.
echo [1/2] Criando o banco de dados "%DB_NAME%"...
REM Ignora o erro se o banco já existir
psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -c "CREATE DATABASE %DB_NAME%;" > nul 2>&1

echo [2/2] Criando as tabelas a partir do arquivo schema.sql...
psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -f database\schema.sql

echo.
echo ==========================================
echo Concluido! O banco de dados foi gerado.
echo ==========================================
pause
