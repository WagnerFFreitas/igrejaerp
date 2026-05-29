require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
pool.query(`
  SELECT conname, pg_get_constraintdef(oid) as definition
  FROM pg_constraint
  WHERE conrelid = 'members'::regclass AND contype = 'c'
  ORDER BY conname
`).then(r => {
  console.log('=== CHECK constraints da tabela members ===');
  r.rows.forEach(c => console.log(`${c.conname}: ${c.definition}`));
  pool.end();
}).catch(e => { console.error(e.message); pool.end(); });
