/**
 * Executa a migration de tesouraria e conciliação bancária
 * Uso: node scripts/run-migration.js
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'igrejaerp',
  user:     process.env.DB_USER     || 'desenvolvedor',
  password: process.env.DB_PASSWORD,
});

async function run() {
  const client = await pool.connect();
  try {
    // 1. Testar conexão
    const ver = await client.query('SELECT version()');
    console.log('✅ Conectado ao PostgreSQL:', ver.rows[0].version.split(' ').slice(0,2).join(' '));

    // 2. Verificar tabelas existentes antes
    const before = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename LIKE 'treasury_%' OR tablename LIKE 'bank_%'
      ORDER BY tablename
    `);
    console.log('\n📋 Tabelas treasury_*/bank_* existentes ANTES:', before.rows.map(r => r.tablename).join(', ') || 'nenhuma');

    // 3. Ler e executar a migration
    const migrationPath = path.join(__dirname, '../../database/migration/treasury_reconciliation_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('\n⏳ Executando migration treasury_reconciliation_schema.sql...');
    await client.query(sql);
    console.log('✅ Migration executada com sucesso!');

    // 4. Verificar tabelas criadas
    const after = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
        AND (tablename LIKE 'treasury_%' OR tablename LIKE 'bank_%')
      ORDER BY tablename
    `);
    console.log('\n📋 Tabelas criadas DEPOIS:');
    after.rows.forEach(r => console.log('  ✅', r.tablename));

    const expected = [
      'treasury_cash_flows', 'treasury_forecasts', 'treasury_investments',
      'treasury_loans', 'treasury_alerts', 'treasury_financial_positions',
      'bank_reconciliations', 'bank_statement_transactions'
    ];
    const created = after.rows.map(r => r.tablename);
    const missing = expected.filter(t => !created.includes(t));
    if (missing.length) {
      console.warn('\n⚠️  Tabelas não encontradas:', missing.join(', '));
    } else {
      console.log('\n🎉 Todas as 8 tabelas criadas com sucesso!');
    }

  } catch (err) {
    console.error('\n❌ Erro durante a migration:', err.message);
    if (err.detail) console.error('   Detalhe:', err.detail);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
