require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='units' ORDER BY ordinal_position");
  console.log('Colunas:', cols.rows.map(r => r.column_name).join(', '));
  const data = await pool.query("SELECT * FROM units LIMIT 1");
  console.log('\nDados:', JSON.stringify(data.rows[0], null, 2));
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
