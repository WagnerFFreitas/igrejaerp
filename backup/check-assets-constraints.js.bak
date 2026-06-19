require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const r = await pool.query("SELECT conname, pg_get_constraintdef(oid) as def FROM pg_constraint WHERE conrelid='assets'::regclass AND contype='c' ORDER BY conname");
  r.rows.forEach(c => console.log(c.conname + ':', c.def));
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
