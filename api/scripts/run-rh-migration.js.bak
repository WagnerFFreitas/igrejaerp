require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '../../database/migration/rh_evaluations_schema.sql'), 'utf8');
  console.log('⏳ Executando migration RH...');
  await pool.query(sql);
  const r = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename IN ('performance_evaluations','pdi_plans') ORDER BY tablename");
  console.log('✅ Tabelas criadas:', r.rows.map(t => t.tablename).join(', '));
  await pool.end();
}
run().catch(e => { console.error('❌', e.message); pool.end(); });
