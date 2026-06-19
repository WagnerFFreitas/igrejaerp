import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'desenvolvedor',
  database: process.env.DB_NAME || 'igrejaerp',
  password: process.env.DB_PASSWORD || ''
});

async function run() {
  try {
    const res = await pool.query('SELECT id, nome, nome_pai, nome_mae FROM membros LIMIT 1');
    const member = res.rows[0];
    console.log('Member Before:', member);

    if (!member) {
      console.log('No member found');
      return;
    }

    const testFather = 'Pai Teste ' + Date.now();
    const testMother = 'Mãe Teste ' + Date.now();

    await pool.query(
      'UPDATE membros SET nome_pai = $1, nome_mae = $2 WHERE id = $3',
      [testFather, testMother, member.id]
    );

    const updatedRes = await pool.query('SELECT id, nome, nome_pai, nome_mae FROM membros WHERE id = $1', [member.id]);
    console.log('Member After Direct DB Update:', updatedRes.rows[0]);
    
    // Now simulate an API call (if I had access to fetch or similar, but let's just do a direct import and run controller)
    // Actually, setting up the express context might be tricky in a simple script. 
    // I can just test via HTTP request to the API since it's running locally on port 5000.
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
