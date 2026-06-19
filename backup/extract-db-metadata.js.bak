const { Pool } = require('pg');
const pool = new Pool({ 
  host: 'localhost', 
  port: 5432, 
  database: 'igrejaerp', 
  user: 'desenvolvedor', 
  password: 'dev@ecclesia_secure_2024' 
});

async function extractMetadata() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'members'
      ORDER BY ordinal_position
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err.message);
  } finally {
    await pool.end();
  }
}

extractMetadata();
