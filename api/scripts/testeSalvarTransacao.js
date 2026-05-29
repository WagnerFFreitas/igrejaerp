require('dotenv').config();
const http = require('http');
const UNIT = '00000000-0000-0000-0000-000000000001';

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
  // 1. Buscar contas disponíveis
  const accs = await request('GET', `/accounts?unitId=${UNIT}`);
  const accounts = Array.isArray(accs.body) ? accs.body : [];
  console.log(`Contas disponíveis: ${accounts.length}`);
  accounts.forEach(a => console.log(`  ${a.id} | ${a.name} | ${a.type}`));

  // 2. Testar POST de transação simples
  const accountId = accounts[0]?.id || null;
  const payload = {
    unitId: UNIT,
    description: 'Teste lançamento manual',
    amount: 500,
    date: '2026-04-15',
    type: 'EXPENSE',
    category: 'OUTROS',
    costCenter: 'cc1',
    operationNature: 'nat6',
    status: 'PENDING',
    paymentMethod: 'PIX',
    accountId,
  };
  console.log('\nTestando POST /transactions com accountId:', accountId);
  const res = await request('POST', '/transactions', payload);
  if (res.status === 201) {
    console.log('✅ Transação salva! id:', res.body.id);
    await request('DELETE', `/transactions/${res.body.id}`, null);
    console.log('   (removida)');
  } else {
    console.error(`❌ Falhou (${res.status}):`, JSON.stringify(res.body));
  }

  // 3. Testar sem accountId (null)
  const payload2 = { ...payload, accountId: null, description: 'Teste sem conta' };
  const res2 = await request('POST', '/transactions', payload2);
  if (res2.status === 201) {
    console.log('✅ Transação sem conta salva! id:', res2.body.id);
    await request('DELETE', `/transactions/${res2.body.id}`, null);
  } else {
    console.error(`❌ Sem conta falhou (${res2.status}):`, JSON.stringify(res2.body));
  }
}
run().catch(e => { console.error(e); process.exit(1); });
