require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const assets = await pool.query('SELECT id, name, category, acquisition_value, current_value, depreciation_rate, depreciation_method, useful_life_months, accumulated_depreciation, current_book_value, status, condition, acquisition_date FROM assets ORDER BY asset_number');
  console.log(`=== ${assets.rows.length} bens no banco ===`);
  assets.rows.forEach(a => {
    console.log(`  ${a.name} | valor: R$${a.acquisition_value} | depr: ${a.depreciation_rate}% | vida: ${a.useful_life_months}m | acum: R$${a.accumulated_depreciation}`);
  });
  // Tabelas de inventário
  const inv = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE '%inventor%'");
  console.log('\nTabelas de inventário:', inv.rows.map(r => r.tablename).join(', ') || 'nenhuma');
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
