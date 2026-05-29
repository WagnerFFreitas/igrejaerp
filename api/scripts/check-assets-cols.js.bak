require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const r = await pool.query("SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name='assets' ORDER BY ordinal_position");
  console.log('NOT NULL sem default (obrigatórios):');
  r.rows.filter(c => c.is_nullable === 'NO' && !c.column_default).forEach(c => console.log(' ', c.column_name));
  console.log('\nTodos os campos:');
  r.rows.forEach(c => console.log(' ', c.column_name, '| nullable:', c.is_nullable, '| default:', c.column_default || '-'));
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
