require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const cols = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='accounts' ORDER BY ordinal_position");
  console.log('Colunas de accounts:', cols.rows.map(c => c.column_name).join(', '));
  const data = await pool.query('SELECT * FROM accounts');
  console.log('Dados:', JSON.stringify(data.rows, null, 2));
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
