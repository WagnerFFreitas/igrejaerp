require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  const r = await pool.query("SELECT conname, pg_get_constraintdef(oid) as def FROM pg_constraint WHERE conrelid='transactions'::regclass AND contype='c' ORDER BY conname");
  console.log('CHECK constraints de transactions:');
  r.rows.forEach(c => console.log(' ', c.conname, ':', c.def));
  
  // Testar inserção com os valores exatos das parcelas
  const accs = await pool.query('SELECT id FROM accounts LIMIT 1');
  const accId = accs.rows[0]?.id;
  const units = await pool.query("SELECT id FROM units WHERE id='00000000-0000-0000-0000-000000000001'");
  const unitId = units.rows[0]?.id;
  
  console.log('\nTestando INSERT direto com category=MAINTENANCE...');
  try {
    const r2 = await pool.query(`
      INSERT INTO transactions (id, unit_id, description, amount, type, status, date, category, account_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, 'Teste parcela', 333.33, 'EXPENSE', 'PENDING', CURRENT_DATE, 'MAINTENANCE', $2, NOW(), NOW())
      RETURNING id
    `, [unitId, accId]);
    console.log('✅ OK! id:', r2.rows[0].id);
    await pool.query('DELETE FROM transactions WHERE id=$1', [r2.rows[0].id]);
  } catch(e) {
    console.error('❌ Falhou:', e.message);
    // Tentar com OUTROS
    try {
      const r3 = await pool.query(`
        INSERT INTO transactions (id, unit_id, description, amount, type, status, date, category, account_id, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, 'Teste parcela', 333.33, 'EXPENSE', 'PENDING', CURRENT_DATE, 'OUTROS', $2, NOW(), NOW())
        RETURNING id
      `, [unitId, accId]);
      console.log('✅ Com OUTROS OK! id:', r3.rows[0].id);
      await pool.query('DELETE FROM transactions WHERE id=$1', [r3.rows[0].id]);
    } catch(e2) {
      console.error('❌ Com OUTROS também falhou:', e2.message);
    }
  }
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
