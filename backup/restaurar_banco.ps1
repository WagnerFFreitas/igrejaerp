# =============================================================================
# SCRIPT DE RESTAURAÇÃO DO BANCO DE DADOS - IgrejaERP
# =============================================================================
# Uso: .\restaurar_banco.ps1
# Pré-requisitos: PostgreSQL instalado na máquina de destino
# =============================================================================

param(
    [string]$Host = "localhost",
    [string]$Port = "5432",
    [string]$SuperUser = "postgres",
    [string]$DbName = "igrejaerp",
    [string]$DbUser = "desenvolvedor",
    [string]$DbPassword = "dev@ecclesia_secure_2024"
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  RESTAURAÇÃO DO BANCO - IgrejaERP" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Localiza o arquivo de backup mais recente
$backupDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backupFile = Get-ChildItem "$backupDir\*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $backupFile) {
    Write-Host "ERRO: Nenhum arquivo .sql encontrado em $backupDir" -ForegroundColor Red
    exit 1
}

Write-Host "Arquivo de backup encontrado:" -ForegroundColor Yellow
Write-Host "  $($backupFile.FullName)" -ForegroundColor White
Write-Host "  Tamanho: $([math]::Round($backupFile.Length / 1MB, 2)) MB" -ForegroundColor White
Write-Host "  Data: $($backupFile.LastWriteTime)" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Deseja continuar a restauração? (s/N)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "[1/4] Criando usuário '$DbUser' (se não existir)..." -ForegroundColor Green
$env:PGPASSWORD = Read-Host "Digite a senha do superusuário '$SuperUser'" -AsSecureString | ForEach-Object { [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($_)) }

$createUserSQL = "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DbUser') THEN CREATE ROLE $DbUser LOGIN PASSWORD '$DbPassword'; END IF; END `$`$;"
psql -h $Host -p $Port -U $SuperUser -c $createUserSQL
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: Não foi possível criar o usuário (pode já existir)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2/4] Criando banco de dados '$DbName' (se não existir)..." -ForegroundColor Green
$env:PGPASSWORD = $DbPassword
psql -h $Host -p $Port -U $SuperUser -c "CREATE DATABASE $DbName OWNER $DbUser ENCODING 'UTF8' LC_COLLATE 'Portuguese_Brazil.1252' LC_CTYPE 'Portuguese_Brazil.1252';" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: Banco pode já existir, tentando continuar..." -ForegroundColor Yellow
    # Tenta criar sem locale específico
    psql -h $Host -p $Port -U $SuperUser -c "CREATE DATABASE $DbName OWNER $DbUser ENCODING 'UTF8';" 2>&1
}

Write-Host ""
Write-Host "[3/4] Concedendo permissões ao usuário '$DbUser'..." -ForegroundColor Green
psql -h $Host -p $Port -U $SuperUser -c "GRANT ALL PRIVILEGES ON DATABASE $DbName TO $DbUser;" 2>&1

Write-Host ""
Write-Host "[4/4] Restaurando dump SQL..." -ForegroundColor Green
$env:PGPASSWORD = $DbPassword
psql -h $Host -p $Port -U $DbUser -d $DbName -f $backupFile.FullName -v ON_ERROR_STOP=0 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  RESTAURAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Host:     $Host`:$Port" -ForegroundColor White
    Write-Host "  Banco:    $DbName" -ForegroundColor White
    Write-Host "  Usuário:  $DbUser" -ForegroundColor White
    Write-Host ""
    Write-Host "  Configure o .env da aplicação com as credenciais acima." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "AVISO: Restauração concluída com alguns avisos (verifique acima)." -ForegroundColor Yellow
    Write-Host "Erros de duplicidade podem ser ignorados se o banco já tinha dados." -ForegroundColor Yellow
}
