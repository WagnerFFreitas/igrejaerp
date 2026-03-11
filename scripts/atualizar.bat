@echo off
echo Iniciando atualizacao do IndexedDB...
powershell -Command "& {Get-Content 'scripts\completar_final.ps1' | Out-String}"
pause
