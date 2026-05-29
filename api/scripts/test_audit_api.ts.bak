require('dotenv').config({ path: '.env' });
const http = require('http');

const BASE = 'http://localhost:3000';
const UNIT = '00000000-0000-0000-0000-000000000001';

// Simular token JWT válido (do usuário logado)
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMzMzMzMzMy0zMzMzLTMzMzMtMzMzMy0zMzMzMzMzMzMzMzMiLCJ1bml0SWQiOiIwMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwMSIsInJvbGUiOiJBRE1JTiIsImVtYWlsIjoiYWRtaW5AY2h1cmNoLmNvbSIsImlhdCI6MTc0NjM3NjAwMH0.test';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('=== Testando API de Audit ===\n');

  // Teste 1: GET audit sem parâmetros
  console.log('1. GET /api/audit');
  try {
    const r = await makeRequest('GET', '/api/audit');
    console.log(`   Status: ${r.status}`);
    console.log(`   Response: ${JSON.stringify(r.body).substring(0, 500)}`);
  } catch (e) {
    console.log(`   Erro: ${e.message}`);
  }

  // Teste 2: GET audit com unitId
  console.log('\n2. GET /api/audit?unitId=' + UNIT);
  try {
    const r = await makeRequest('GET', `/api/audit?unitId=${UNIT}`);
    console.log(`   Status: ${r.status}`);
    console.log(`   Response: ${JSON.stringify(r.body).substring(0, 500)}`);
  } catch (e) {
    console.log(`   Erro: ${e.message}`);
  }

  // Teste 3: POST audit
  console.log('\n3. POST /api/audit');
  try {
    const r = await makeRequest('POST', '/api/audit', {
      unitId: UNIT,
      userId: '33333333-3333-3333-3333-333333333332',
      userName: 'admin@church.com',
      action: 'TEST',
      entidade: 'System',
      date: new Date().toISOString(),
      ip: '127.0.0.1',
      success: true
    });
    console.log(`   Status: ${r.status}`);
    console.log(`   Response: ${JSON.stringify(r.body).substring(0, 500)}`);
  } catch (e) {
    console.log(`   Erro: ${e.message}`);
  }
}

test().catch(e => console.error('Erro fatal:', e));