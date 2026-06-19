require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

async function run() {
  const tables = ['members', 'employees', 'transactions', 'financial_accounts', 'units'];
  for (const t of tables) {
    const r = await pool.query(`SELECT COUNT(*) as total FROM ${t}`);
    console.log(`${t}: ${r.rows[0].total} registros`);
  }
  await pool.end();
}
run().catch(e => { console.error('ERRO:', e.message); pool.end(); });
