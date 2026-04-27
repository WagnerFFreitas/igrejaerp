require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'members' ORDER BY ordinal_position")
  .then(r => { console.log('=== Colunas da tabela members ==='); r.rows.forEach(c => console.log(' ', c.column_name, '-', c.data_type)); pool.end(); })
  .catch(e => { console.error(e.message); pool.end(); });
