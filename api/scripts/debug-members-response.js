require('dotenv').config();
const http = require('http');

const UNIT = '00000000-0000-0000-0000-000000000001';

function get(path) {
  return new Promise((resolve) => {
    const url = new URL('http://localhost:3000/api' + path);
    const req = http.request({ hostname: url.hostname, port: url.port, path: url.pathname + url.search, method: 'GET' }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); } catch { resolve({ status: res.statusCode, body: raw }); } });
    });
    req.on('error', e => resolve({ status: 0, body: e.message }));
    req.end();
  });
}

async function run() {
  // 1. Testar sem unitId
  const r1 = await get('/members?limit=5');
  console.log('GET /members (sem unitId):', r1.status, '— total:', r1.body?.pagination?.total, '— count:', r1.body?.members?.length);

  // 2. Testar com unitId correto
  const r2 = await get(`/members?unitId=${UNIT}&limit=500`);
  console.log(`GET /members?unitId=${UNIT}:`, r2.status, '— total:', r2.body?.pagination?.total, '— count:', r2.body?.members?.length);
  if (r2.body?.members?.length > 0) {
    console.log('Primeiro membro:', r2.body.members[0].name, '| situacao:', r2.body.members[0].situacao, '| unitId:', r2.body.members[0].unit_id);
  }

  // 3. Verificar se o filtro de unitId está funcionando
  const r3 = await get('/members?unitId=u-sede&limit=5');
  console.log('GET /members?unitId=u-sede:', r3.status, '— count:', r3.body?.members?.length);

  // 4. Verificar o que o App.tsx recebe (com limit=500)
  const r4 = await get(`/members?unitId=${UNIT}&limit=500`);
  console.log('\nResposta completa para o frontend:');
  console.log('  members.length:', r4.body?.members?.length);
  console.log('  pagination:', JSON.stringify(r4.body?.pagination));
  if (r4.body?.members?.length > 0) {
    const m = r4.body.members[0];
    console.log('  Campos do primeiro membro:', Object.keys(m).join(', '));
    console.log('  unitId:', m.unitId, '| unit_id:', m.unit_id);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
