require('dotenv').config({ path: '.env' });
const http = require('http');

const BASE = 'http://localhost:3000';

async function testLogin() {
  console.log('=== Testando Login ===\n');

  // Teste de login
  console.log('1. POST /api/auth/login');
  try {
    const loginData = {
      email: 'desenvolvedor',
      password: 'dev@ecclesia_secure_2024'
    };

    const postData = JSON.stringify(loginData);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response: ${JSON.stringify(response, null, 2)}`);
          
          // Se login foi bem-sucedido, testar a API de audit com o token real
          if (response.token) {
            console.log('\n2. Testando API de audit com token real');
            testAuditAPI(response.token);
          }
        } catch (e) {
          console.log(`   Response: ${data}`);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`   Erro: ${e.message}`);
    });
    req.write(postData);
    req.end();
  } catch (e) {
    console.log(`   Erro: ${e.message}`);
  }
}

function testAuditAPI(token) {
  const postData = JSON.stringify({
    unitId: '00000000-0000-0000-0000-000000000001',
    userId: '33333333-3333-3333-3333-333333333332',
    userName: 'admin@church.com',
    action: 'TEST',
    entidade: 'System',
    date: new Date().toISOString(),
    ip: '127.0.0.1',
    success: true
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/audit',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${JSON.stringify(response, null, 2)}`);
      } catch (e) {
        console.log(`   Response: ${data}`);
      }
    });
  });

  req.on('error', (e) => {
    console.log(`   Erro: ${e.message}`);
  });
  req.write(postData);
  req.end();
}

testLogin();