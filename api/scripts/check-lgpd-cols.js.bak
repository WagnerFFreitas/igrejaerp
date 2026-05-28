require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='lgpd_policies' ORDER BY ordinal_position");
  console.log('Colunas lgpd_policies:', cols.rows.map(c => c.column_name).join(', '));
  const data = await pool.query("SELECT * FROM lgpd_policies LIMIT 3");
  data.rows.forEach(r => console.log(JSON.stringify(r)));
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
