# Script PowerShell para completar cadastros
Write-Host "🔧 COMPLETANDO CADASTROS..." -ForegroundColor Green

$dbPath = "$env:LOCALAPPDATA\ADJPA_ERP_DB"

if (Test-Path $dbPath) {
    $backupPath = "$dbPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Copy-Item $dbPath $backupPath -ErrorAction SilentlyContinue
    Write-Host "✅ Backup criado" -ForegroundColor Green
    
    $json = @"
{
  ""employees"": [
    {
      ""id"": ""E1773008810676"",
      ""unitId"": ""u-sede"",
      ""matricula"": ""EMP2024005"",
      ""employeeName"": ""Wagner Ferreira Freitas"",
      ""email"": ""wagner.freitas@igreja.com.br"",
      ""cpf"": ""111.222.333-44"",
      ""rg"": ""MG-11.222.333"",
      ""pis"": ""999.88877.99-9"",
      ""ctps"": ""00987654321"",
      ""titulo"": ""111222333444"",
      ""reservista"": ""AM999888"",
      ""aso_data"": ""2024-01-15"",
      ""blood_type"": ""A+"",
      ""emergency_contact"": ""(31) 98877-6654 - Maria Freitas (esposa)"",
      ""birthDate"": ""1980-03-15"",
      ""cargo"": ""Desenvolvedor de Sistemas"",
      ""funcao"": ""Desenvolvedor Full Stack"",
      ""departamento"": ""TI"",
      ""cbo"": ""2521-05"",
      ""data_admissao"": ""2019-01-15"",
      ""tipo_contrato"": ""CLT"",
      ""jornada_trabalho"": ""08:00 às 17:00"",
      ""regime_trabalho"": ""HIBRIDO"",
      ""salario_base"": 5500.00,
      ""tipo_salario"": ""MENSAL"",
      ""sindicato"": ""Sindicato dos Tecnologistas"",
      ""convencao_coletiva"": ""Convenção Coletiva 2024/2025"",
      ""banco"": ""Banco do Brasil"",
      ""codigo_banco"": ""001"",
      ""agencia"": ""1234-5"",
      ""conta"": ""54321-0"",
      ""tipo_conta"": ""CORRENTE"",
      ""titular"": ""Wagner Ferreira Freitas"",
      ""chave_pix"": ""wagner.freitas@igreja.com.br"",
      ""vale_transporte_total"": 200.00,
      ""vale_alimentacao"": 300.00,
      ""vale_refeicao"": 0,
      ""plano_saude_colaborador"": 250.00,
      ""vale_farmacia"": 100.00,
      ""seguro_vida"": 0
    }
  ]
}
"@
    
    $json | Out-File -FilePath $dbPath -Encoding UTF8 -Force
    Write-Host "✅ Arquivo atualizado!" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo não encontrado" -ForegroundColor Red
}

Write-Host "🎉 CONCLUÍDO!" -ForegroundColor Green
