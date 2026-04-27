require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const r = await pool.query('SELECT id, name, type, current_balance, status FROM financial_accounts ORDER BY name');
  console.log(`Contas no banco (${r.rows.length}):`);
  r.rows.forEach(a => console.log(`  ${a.id} | ${a.name} | ${a.type} | R$${a.current_balance} | ${a.status}`));
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
