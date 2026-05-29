require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

async function run() {
  // Ver todas as unidades
  const all = await pool.query("SELECT id, name, address_line1, address_line2 FROM units ORDER BY name");
  console.log('Unidades existentes:');
  all.rows.forEach(r => console.log(`  ${r.id} | ${r.name} | line1: ${r.address_line1}`));

  // Atualizar TODAS as unidades que são a ADJPA (pelo nome ou pela que for a sede)
  const result = await pool.query(`
    UPDATE units 
    SET 
      name = 'Assembleia de Deus Jesus Que Alimenta',
      cnpj = '09.432.897/0001-05',
      email = 'adjpamatriz@gmail.com',
      phone = '(21) 2675-7036',
      address = 'Rua Gericino, QD04 LT22 - Sta Cruz da Serra - Duque de Caxias/RJ - CEP 25240-170',
      address_line1 = 'Rua Gericino, QD04 LT22 - Sta Cruz da Serra',
      address_line2 = 'Duque de Caxias/RJ - CEP 25240-170',
      city = 'Duque de Caxias',
      state = 'RJ',
      updated_at = CURRENT_TIMESTAMP
    WHERE is_headquarter = true
    RETURNING id, name, address_line1, address_line2, phone
  `);
  
  console.log('\nUnidades atualizadas:');
  result.rows.forEach(r => console.log(`  ✅ ${r.id} | ${r.name}`));
  console.log('  address_line1:', result.rows[0]?.address_line1);
  console.log('  address_line2:', result.rows[0]?.address_line2);
  console.log('  phone:', result.rows[0]?.phone);
  
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
