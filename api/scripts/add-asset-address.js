require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  await pool.query(`
    ALTER TABLE assets
      ADD COLUMN IF NOT EXISTS address_zip_code    VARCHAR(10),
      ADD COLUMN IF NOT EXISTS address_street      TEXT,
      ADD COLUMN IF NOT EXISTS address_number      VARCHAR(20),
      ADD COLUMN IF NOT EXISTS address_complement  VARCHAR(100),
      ADD COLUMN IF NOT EXISTS address_neighborhood VARCHAR(100),
      ADD COLUMN IF NOT EXISTS address_city        VARCHAR(100),
      ADD COLUMN IF NOT EXISTS address_state       VARCHAR(2)
  `);
  console.log('✅ Colunas de endereço adicionadas em assets');
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
