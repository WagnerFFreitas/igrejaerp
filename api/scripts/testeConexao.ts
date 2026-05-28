/**
 * ============================================================================
 * TEST-CONNECTION.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a test-connection.
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

async function testDatabase() {
  try {
    console.log('🔧 Testando conexão com PostgreSQL...');
    
/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (test-connection).
 */

    const db = Database.getInstance();
    
    // Testar conexão básica
    const result = await db.query('SELECT 1 as test, CURRENT_TIMESTAMP as timestamp');
    console.log('✅ Conexão OK:', result.rows[0]);
    
    // Testar se tabelas existem
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Tabelas encontradas:');
    tables.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Testar contagem de registros
    const counts = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM units) as units,
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM members) as members,
        (SELECT COUNT(*) FROM employees) as employees,
        (SELECT COUNT(*) FROM transactions) as transactions
    `);
    
    console.log('📈 Registros atuais:');
    const count = counts.rows[0];
    Object.entries(count).forEach(([table, number]) => {
      console.log(`  - ${table}: ${number}`);
    });
    
    await db.close();
    console.log('✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  }
}

testDatabase();
