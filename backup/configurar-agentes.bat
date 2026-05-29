@echo off
chcp 65001 >nul
title Configurar Agentes IA - Links Simbólicos
setlocal enabledelayedexpansion

echo.
echo =====================================
echo   CONFIGURANDO AGENTES IA (2026)
echo =====================================
echo.
echo Projeto Atual: %CD%
echo Origem das Skills: D:\agentes
echo.

:: Verifica se a pasta de origem existe
if not exist "D:\agentes\" (
    echo [ERRO] A pasta D:\agentes nao foi encontrada!
    echo Verifique se suas skills estao nessa pasta.
    pause
    exit /b
)

:: Lista de pastas de agentes
set "AGENT_FOLDERS=.claude .cursor .codex .roo .continue .windsurf .gemini .github .qodo .cline .vscode .aider .amazonq .opencode .amp .trae .kiro .goose .antigravity .agents"

set "CRIADOS=0"
set "PULADOS=0"
set "ERROS=0"

echo.
echo [1/2] Criando links simbolicos...
echo.

for %%f in (%AGENT_FOLDERS%) do (
    set "ORIGEM=D:\agentes\%%f"
    set "LINK=%%f"
    
    :: 1. Verifica se a pasta de origem existe
    if exist "!ORIGEM!\" (
        :: 2. Verifica se ja existe algo no destino
        if not exist "!LINK!" (
            mklink /J "!LINK!" "!ORIGEM!" >nul 2>&1
            if !errorlevel! equ 0 (
                echo [OK] !LINK!
                set /a CRIADOS+=1
            ) else (
                echo [ERRO] !LINK! - Falha de permissao
                set /a ERROS+=1
            )
        ) else (
            echo [SKIP] !LINK! ja existe
            set /a PULADOS+=1
        )
    ) else (
        echo [IGNORAR] !ORIGEM! nao existe
    )
)

echo.
echo [2/2] Resumo:
echo • Links criados:   %CRIADOS%
echo • Ja existiam:     %PULADOS%
echo • Erros:           %ERROS%
echo.

if %ERROS% gtr 0 (
    echo [!] Para corrigir erros de permissao:
    echo     1. Execute o terminal como Administrador
    echo     2. Execute novamente
    echo.
)

echo =====================================
echo Configuracao concluida!
echo =====================================
pause