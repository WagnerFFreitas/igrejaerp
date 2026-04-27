require('dotenv').config();
const http = require('http');
const { Pool } = require('pg');
const UNIT = '00000000-0000-0000-0000-000000000001';
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL('http://localhost:3000/api' + path);
    const opts = { hostname: url.hostname, port: url.port, path: url.pathname + url.search, method, headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } };
    const req = http.request(opts, res => { let raw = ''; res.on('data', c => raw += c); res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); } catch { resolve({ status: res.statusCode, body: raw }); } }); });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('=== TESTE SALVAMENTO PATRIMÔNIO ===\n');

  // Simula exatamente o que o Patrimonio.tsx envia (com unitId = u-sede)
  const payload = {
    unitId: 'u-sede',  // alias — deve ser normalizado para UUID
    name: 'Computador Dell Inspiron',
    category: 'COMPUTADORES',
    description: 'Computador para uso administrativo',
    acquisitionValue: 3500,
    acquisitionDate: '2026-01-15',
    usefulLifeMonths: 60,
    location: 'Secretaria',
    responsible: 'Secretária',
    status: 'ATIVO',
    currentValue: 3500,
    currentBookValue: 3500,
    accumulatedDepreciation: 0,
    depreciationMethod: 'LINEAR',
    depreciationRate: 20,
    condition: 'BOM',
  };

  // 1. POST
  const postRes = await request('POST', '/assets', payload);
  if (postRes.status === 201) {
    const id = postRes.body.id;
    console.log(`✅ POST /assets OK — id: ${id}`);
    console.log(`   name: ${postRes.body.name}`);
    console.log(`   category: ${postRes.body.category}`);
    console.log(`   acquisitionValue: ${postRes.body.acquisitionValue}`);
    console.log(`   location: ${postRes.body.location}`);

    // 2. GET para confirmar
    const getRes = await request('GET', `/assets?unitId=u-sede`);
    console.log(`\n✅ GET /assets?unitId=u-sede: ${Array.isArray(getRes.body) ? getRes.body.length : 'erro'} registros`);

    // 3. PUT
    const putRes = await request('PUT', `/assets/${id}`, { ...payload, name: 'Computador Dell Atualizado', location: 'Sala de Reuniões' });
    console.log(`✅ PUT /assets/${id.slice(0,8)}: ${putRes.status === 200 ? 'OK — ' + putRes.body.name : 'ERRO ' + putRes.status}`);

    // 4. Verificar no banco
    const dbRow = await pool.query('SELECT name, category, acquisition_value, location, unit_id FROM assets WHERE id=$1', [id]);
    const row = dbRow.rows[0];
    console.log(`\n✅ Banco: name="${row.name}" | category="${row.category}" | value=${row.acquisition_value} | location="${row.location}" | unit_id="${row.unit_id}"`);

    // 5. DELETE
    await request('DELETE', `/assets/${id}`, null);
    console.log('✅ DELETE OK — bem de teste removido');
  } else {
    console.error(`❌ POST falhou (${postRes.status}):`, JSON.stringify(postRes.body));
  }

  await pool.end();
}
run().catch(e => { console.error(e); pool.end(); });
