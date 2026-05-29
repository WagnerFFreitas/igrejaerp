require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD
});

async function checkTables() {
  try {
    // Verificar tabelas com 'audit' no nome
    const auditTables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%audit%'"
    );
    console.log('=== Tabelas com audit ===');
    console.log(auditTables.rows);

    // Verificar estrutura da tabela app_audit_logs
    const columns = await pool.query(
      "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'app_audit_logs' ORDER BY ordinal_position"
    );
    console.log('\n=== Estrutura da tabela app_audit_logs ===');
    console.log(columns.rows);

    // Verificar se há dados
    const count = await pool.query('SELECT COUNT(*) as total FROM app_audit_logs');
    console.log('\n=== Total de registros ===');
    console.log(count.rows);

  } catch (e: any) {
    console.error('Erro:', e.message);
  } finally {
    await pool.end();
  }
}

checkTables();