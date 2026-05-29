const { Pool } = require('pg');
const pool = new Pool({ 
  host: 'localhost', 
  port: 5432, 
  database: 'igrejaerp', 
  user: 'desenvolvedor', 
  password: 'dev@ecclesia_secure_2024' 
});

async function listColumns() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'members'");
    console.log('Colunas encontradas:');
    console.log(res.rows.map(r => r.column_name).join(', '));
  } catch (err) {
    console.error(err.message);
  } finally {
    await pool.end();
  }
}

listColumns();
