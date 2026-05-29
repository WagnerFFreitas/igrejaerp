/**
 * ============================================================================
 * VALIDATE-DATA.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a validate-data.
 *
 * ONDE É USADO?
 * -------------
 * Parte do projeto usada em runtime ou build.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import Database from '../src/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (validate-data).
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = Database.getInstance();

interface ValidationResult {
  table: string;
  firebaseCount: number;
  postgresCount: number;
  difference: number;
  status: 'OK' | 'WARNING' | 'ERROR';
}

async function loadFirebaseData(): Promise<{ [key: string]: number }> {
  const exportDir = path.join(__dirname, '../exports');
  const summaryPath = path.join(exportDir, 'export-summary.json');
  
  if (!fs.existsSync(summaryPath)) {
    console.error('❌ Arquivo export-summary.json não encontrado');
    return {};
  }
  
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  return summary.collections || {};
}

async function getPostgresCounts(): Promise<{ [key: string]: number }> {
  const tables = [
    'units',
    'users',
    'members', 
    'employees',
    'transactions',
    'assets',
    'church_events',
    'financial_accounts',
    'employee_leaves',
    'dependents',
    'member_contributions'
  ];
  
  const counts: { [key: string]: number } = {};
  
  for (const table of tables) {
    try {
      const result = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
      counts[table] = parseInt(result.rows[0].count);
    } catch (error) {
      console.warn(`⚠️  Tabela ${table} não existe ou não pode ser acessada`);
      counts[table] = 0;
    }
  }
  
  return counts;
}

function compareData(firebaseData: { [key: string]: number }, postgresData: { [key: string]: number }): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  const allTables = new Set([...Object.keys(firebaseData), ...Object.keys(postgresData)]);
  
  for (const table of allTables) {
    const firebaseCount = firebaseData[table] || 0;
    const postgresCount = postgresData[table] || 0;
    const difference = firebaseCount - postgresCount;
    
    let status: 'OK' | 'WARNING' | 'ERROR' = 'OK';
    
    if (Math.abs(difference) > 0) {
      status = 'WARNING';
      if (Math.abs(difference) > firebaseCount * 0.1) { // 10% de diferença
        status = 'ERROR';
      }
    }
    
    results.push({
      table,
      firebaseCount,
      postgresCount,
      difference,
      status
    });
  }
  
  return results;
}

function generateReport(results: ValidationResult[]): void {
  console.log('\n📊 RELATÓRIO DE VALIDAÇÃO');
  console.log('═'.repeat(80));
  console.log('Tabela'.padEnd(20) + 'Firebase'.padEnd(12) + 'PostgreSQL'.padEnd(12) + 'Diferença'.padEnd(12) + 'Status');
  console.log('─'.repeat(80));
  
  let totalOk = 0;
  let totalWarning = 0;
  let totalError = 0;
  
  for (const result of results) {
    const statusIcon = result.status === 'OK' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌';
    
    console.log(
      result.table.padEnd(20) +
      result.firebaseCount.toString().padEnd(12) +
      result.postgresCount.toString().padEnd(12) +
      (result.difference > 0 ? `+${result.difference}` : result.difference.toString()).padEnd(12) +
      `${statusIcon} ${result.status}`
    );
    
    switch (result.status) {
      case 'OK': totalOk++; break;
      case 'WARNING': totalWarning++; break;
      case 'ERROR': totalError++; break;
    }
  }
  
  console.log('═'.repeat(80));
  console.log(`Resumo: ${totalOk} OK, ${totalWarning} Avisos, ${totalError} Erros`);
  
  if (totalError > 0) {
    console.log('\n❌ VALIDAÇÃO FALHOU - Existem diferenças críticas!');
    console.log('Verifique os dados e execute a importação novamente.');
  } else if (totalWarning > 0) {
    console.log('\n⚠️  VALIDAÇÃO COM AVISOS - Existem algumas diferenças menores.');
    console.log('Verifique se as diferenças são esperadas.');
  } else {
    console.log('\n✅ VALIDAÇÃO BEM-SUCEDIDA - Todos os dados foram importados corretamente!');
  }
}

async function validateDataIntegrity(): Promise<void> {
  console.log('🔍 Iniciando validação de integridade de dados...');
  
  try {
    // Carregar dados do Firebase
    console.log('📂 Carregando dados do Firebase...');
    const firebaseData = await loadFirebaseData();
    
    // Contar dados no PostgreSQL
    console.log('📊 Contando dados no PostgreSQL...');
    const postgresData = await getPostgresCounts();
    
    // Comparar dados
    console.log('🔍 Comparando dados...');
    const results = compareData(firebaseData, postgresData);
    
    // Gerar relatório
    generateReport(results);
    
    // Validar relacionamentos básicos
    console.log('\n🔗 Validando relacionamentos...');
    await validateRelationships();
    
  } catch (error) {
    console.error('❌ Erro na validação:', error);
    throw error;
  } finally {
    await db.close();
  }
}

async function validateRelationships(): Promise<void> {
  try {
    // Verificar se todos os membros têm unidades válidas
    const result1 = await db.query(`
      SELECT COUNT(*) as count 
      FROM members m 
      LEFT JOIN units u ON m.unit_id = u.id 
      WHERE u.id IS NULL
    `);
    
    if (parseInt(result1.rows[0].count) > 0) {
      console.log(`⚠️  ${result1.rows[0].count} membros com unidades inválidas`);
    }
    
    // Verificar se todas as transações têm contas válidas
    const result2 = await db.query(`
      SELECT COUNT(*) as count 
      FROM transactions t 
      LEFT JOIN financial_accounts fa ON t.account_id = fa.id 
      WHERE fa.id IS NULL
    `);
    
    if (parseInt(result2.rows[0].count) > 0) {
      console.log(`⚠️  ${result2.rows[0].count} transações com contas inválidas`);
    }
    
    // Verificar se todos os dependentes têm membros válidos
    const result3 = await db.query(`
      SELECT COUNT(*) as count 
      FROM dependents d 
      LEFT JOIN members m ON d.member_id = m.id 
      WHERE m.id IS NULL
    `);
    
    if (parseInt(result3.rows[0].count) > 0) {
      console.log(`⚠️  ${result3.rows[0].count} dependentes com membros inválidos`);
    }
    
    console.log('✅ Validação de relacionamentos concluída');
    
  } catch (error) {
    console.error('❌ Erro na validação de relacionamentos:', error);
  }
}

async function main() {
  try {
    await validateDataIntegrity();
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Falha na validação:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateDataIntegrity };
