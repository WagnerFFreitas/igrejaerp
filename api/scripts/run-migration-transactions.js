require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
});

async function run() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../../database/migration/add_transaction_columns.sql'), 'utf8');
    console.log('⏳ Adicionando colunas faltantes em transactions...');
    await client.query(sql);
    console.log('✅ Colunas adicionadas!');

    const r = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='transactions' ORDER BY ordinal_position"
    );
    console.log('\nColunas atuais:', r.rows.map(c => c.column_name).join(', '));
  } catch (e) {
    console.error('❌', e.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}
run();
