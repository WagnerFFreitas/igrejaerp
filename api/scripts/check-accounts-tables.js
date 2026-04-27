require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const tables = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE '%account%' ORDER BY tablename");
  console.log('Tabelas com "account":', tables.rows.map(r => r.tablename).join(', '));
  
  for (const t of tables.rows) {
    const count = await pool.query(`SELECT COUNT(*) as total FROM ${t.tablename}`);
    console.log(`  ${t.tablename}: ${count.rows[0].total} registros`);
  }
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
