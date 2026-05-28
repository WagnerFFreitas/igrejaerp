require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

async function run() {
  const year = new Date().getFullYear();

  // 1. Converter formato antigo PAT-YYYY-NNNN → PATNN/YYYY
  const old = await pool.query("SELECT id, name, asset_number FROM assets WHERE asset_number LIKE 'PAT-%' ORDER BY asset_number");
  console.log(`Bens com formato antigo: ${old.rows.length}`);
  for (let i = 0; i < old.rows.length; i++) {
    const seq = (i + 1).toString().padStart(2, '0');
    const newNum = `PAT${seq}/${year}`;
    await pool.query('UPDATE assets SET asset_number = $1 WHERE id = $2', [newNum, old.rows[i].id]);
    console.log(`  ✅ ${old.rows[i].asset_number} → ${newNum} (${old.rows[i].name})`);
  }

  // 2. Preencher os que ainda estão nulos
  const nulls = await pool.query("SELECT id, name FROM assets WHERE asset_number IS NULL OR asset_number = '' ORDER BY created_at");
  console.log(`Bens sem número: ${nulls.rows.length}`);
  const offset = old.rows.length;
  for (let i = 0; i < nulls.rows.length; i++) {
    const seq = (offset + i + 1).toString().padStart(2, '0');
    const newNum = `PAT${seq}/${year}`;
    await pool.query('UPDATE assets SET asset_number = $1 WHERE id = $2', [newNum, nulls.rows[i].id]);
    console.log(`  ✅ ${nulls.rows[i].name} → ${newNum}`);
  }

  // 3. Verificação final
  const check = await pool.query('SELECT name, asset_number FROM assets ORDER BY asset_number');
  console.log('\nResultado final:');
  check.rows.forEach(r => console.log(`  ${r.asset_number} | ${r.name}`));

  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
