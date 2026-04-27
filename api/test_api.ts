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
    // 1. Get a member from DB
    const res = await pool.query('SELECT id, nome, nome_pai, nome_mae FROM membros LIMIT 1');
    const member = res.rows[0];
    
    if (!member) {
      console.log('No members found to test.');
      return;
    }
    
    console.log('--- BEFORE API CALL ---');
    console.log(member);

    // 2. Prepare payload matching mapMemberToApi output
    const testFather = 'Father API Test ' + Date.now();
    const testMother = 'Mother API Test ' + Date.now();
    
    const payload = {
      id: member.id,
      nome_pai: testFather,
      nome_mae: testMother,
      // Include minimum required fields based on your schema or assume PATCH
      nome: member.nome || 'Test Name',
      role: 'MEMBER',
      status: 'ACTIVE'
    };

    console.log('\n--- SENDING API REQUEST ---');
    console.log(payload);

    // 3. Make the API call to local server
    // (Assuming server is running on port 3000)
    const response = await fetch(`http://localhost:3000/api/members/${member.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    console.log('\n--- API RESPONSE ---');
    console.log('Status:', response.status);
    console.log(responseData);

    // 4. Verify in DB
    const checkRes = await pool.query('SELECT id, nome_pai, nome_mae, dados_perfil FROM membros WHERE id = $1', [member.id]);
    console.log('\n--- DB AFTER UPDATE ---');
    console.log(checkRes.rows[0]);

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await pool.end();
  }
}

run();
