require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

async function run() {
  const r = await pool.query(`
    UPDATE units 
    SET address_line2 = 'Duque de Caxias/RJ - CEP 25240-170', updated_at = CURRENT_TIMESTAMP
    WHERE id = '00000000-0000-0000-0000-000000000001'
    RETURNING id, address_line1, address_line2
  `);
  console.log('✅ Atualizado:');
  console.log('  line1:', r.rows[0].address_line1);
  console.log('  line2:', r.rows[0].address_line2);
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
