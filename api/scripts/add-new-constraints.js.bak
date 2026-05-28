require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function addConstraints() {
  try {
    console.log('=== Adding New CHECK Constraints ===\n');

    await pool.query("ALTER TABLE members ADD CONSTRAINT members_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING'))");
    console.log('✅ Added members_status_check');

    await pool.query("ALTER TABLE members ADD CONSTRAINT members_marital_status_check CHECK (marital_status IN ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'))");
    console.log('✅ Added members_marital_status_check');

    await pool.query("ALTER TABLE members ADD CONSTRAINT members_gender_check CHECK (gender IN ('M', 'F', 'OTHER'))");
    console.log('✅ Added members_gender_check');

    console.log('\n=== All Constraints Added Successfully ===');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addConstraints();
