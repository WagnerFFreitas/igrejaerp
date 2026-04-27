require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
async function run() {
  // Copiar contas de financial_accounts para accounts (se não existirem)
  const fa = await pool.query('SELECT * FROM financial_accounts WHERE status != $1', ['INACTIVE']);
  console.log(`Migrando ${fa.rows.length} contas de financial_accounts → accounts`);
  
  for (const a of fa.rows) {
    const exists = await pool.query('SELECT id FROM accounts WHERE id=$1', [a.id]);
    if (exists.rows.length === 0) {
      await pool.query(`
        INSERT INTO accounts (id, unit_id, name, type, balance, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `, [a.id, a.unit_id, a.name, a.type === 'CASH' ? 'CASH' : 'CHECKING', a.current_balance || 0, a.status === 'ACTIVE', a.created_at, a.updated_at]);
      console.log(`  ✅ ${a.name} (${a.id.slice(0,8)}) migrada`);
    } else {
      console.log(`  ⏭️  ${a.name} já existe`);
    }
  }
  
  const final = await pool.query('SELECT id, name, balance FROM accounts ORDER BY name');
  console.log('\nContas em accounts:');
  final.rows.forEach(a => console.log(`  ${a.id} | ${a.name} | R$${a.balance}`));
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
