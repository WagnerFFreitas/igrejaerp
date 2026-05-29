require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const r = await pool.query("SELECT id, version, title, effective_date, is_active, unit_id FROM lgpd_policies ORDER BY created_at DESC LIMIT 5");
  console.log('Políticas LGPD:');
  r.rows.forEach(p => console.log(JSON.stringify(p)));
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
