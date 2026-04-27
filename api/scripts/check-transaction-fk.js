require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  // Ver constraints da tabela transactions
  const fks = await pool.query(`
    SELECT conname, pg_get_constraintdef(oid) as def
    FROM pg_constraint WHERE conrelid='transactions'::regclass AND contype='f'
  `);
  console.log('FKs de transactions:');
  fks.rows.forEach(f => console.log(' ', f.conname, ':', f.def));

  // Testar inserção direta
  const accs = await pool.query('SELECT id FROM financial_accounts LIMIT 1');
  const accId = accs.rows[0]?.id;
  const units = await pool.query('SELECT id FROM units LIMIT 1');
  const unitId = units.rows[0]?.id;
  console.log('\nTestando INSERT direto com account_id:', accId, 'unit_id:', unitId);
  
  try {
    const r = await pool.query(`
      INSERT INTO transactions (id, unit_id, description, amount, type, status, date, category, account_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, 'Teste FK', 100, 'EXPENSE', 'PENDING', CURRENT_DATE, 'OUTROS', $2, NOW(), NOW())
      RETURNING id
    `, [unitId, accId]);
    console.log('✅ INSERT OK! id:', r.rows[0].id);
    await pool.query('DELETE FROM transactions WHERE id=$1', [r.rows[0].id]);
  } catch(e) {
    console.error('❌ INSERT falhou:', e.message);
  }
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
