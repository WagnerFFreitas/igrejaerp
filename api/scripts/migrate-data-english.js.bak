require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function migrateData() {
  try {
    console.log('=== Migrating Data to English Values ===\n');

    // Migrate status
    let result = await pool.query("UPDATE members SET status = 'ACTIVE' WHERE status = 'ATIVO'");
    console.log(`✅ Updated ${result.rowCount} rows: ATIVO -> ACTIVE`);

    result = await pool.query("UPDATE members SET status = 'INACTIVE' WHERE status IN ('INATIVO', 'TRANSFERIDO', 'FALECIDO', 'DESLIGADO')");
    console.log(`✅ Updated ${result.rowCount} rows: INATIVO/TRANSFERIDO/FALECIDO/DESLIGADO -> INACTIVE`);

    // Migrate marital_status
    result = await pool.query("UPDATE members SET marital_status = 'SINGLE' WHERE marital_status = 'SOLTEIRO'");
    console.log(`✅ Updated ${result.rowCount} rows: SOLTEIRO -> SINGLE`);

    result = await pool.query("UPDATE members SET marital_status = 'MARRIED' WHERE marital_status = 'CASADO'");
    console.log(`✅ Updated ${result.rowCount} rows: CASADO -> MARRIED`);

    result = await pool.query("UPDATE members SET marital_status = 'DIVORCED' WHERE marital_status = 'DIVORCIADO'");
    console.log(`✅ Updated ${result.rowCount} rows: DIVORCIADO -> DIVORCED`);

    result = await pool.query("UPDATE members SET marital_status = 'WIDOWED' WHERE marital_status = 'VIUVO'");
    console.log(`✅ Updated ${result.rowCount} rows: VIUVO -> WIDOWED`);

    // Migrate gender
    result = await pool.query("UPDATE members SET gender = 'OTHER' WHERE gender = 'O'");
    console.log(`✅ Updated ${result.rowCount} rows: O -> OTHER`);

    // Verify migration
    const statusCheck = await pool.query('SELECT DISTINCT status FROM members');
    console.log('\n📊 Current status values:', statusCheck.rows.map(r => r.status));

    const maritalCheck = await pool.query('SELECT DISTINCT marital_status FROM members WHERE marital_status IS NOT NULL');
    console.log('📊 Current marital_status values:', maritalCheck.rows.map(r => r.marital_status));

    const genderCheck = await pool.query('SELECT DISTINCT gender FROM members WHERE gender IS NOT NULL');
    console.log('📊 Current gender values:', genderCheck.rows.map(r => r.gender));

    console.log('\n=== Data Migration Complete ===');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
  } finally {
    await pool.end();
  }
}

migrateData();
