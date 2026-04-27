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
  // Buscar conta real
  const accs = await request('GET', `/accounts?unitId=${UNIT}`);
  const accountId = Array.isArray(accs.body) ? accs.body[0]?.id : null;
  console.log('accountId:', accountId);

  // Simula exatamente o que gerarParcelas envia (3 parcelas de R$333,33)
  const parcela = {
    unitId: UNIT,
    description: 'Compra MASTERSOM (1/3)',
    amount: 333.33,
    date: '2026-05-01',
    dueDate: '2026-05-01',
    type: 'EXPENSE',
    category: 'MAINTENANCE',
    costCenter: 'cc7',
    operationNature: 'nat7',
    accountId,
    status: 'PENDING',
    paymentMethod: 'PIX',
    isInstallment: true,
    installmentNumber: 1,
    totalInstallments: 3,
    parentId: null,
    notes: 'Parcela 1/3',
    competencyDate: '2026-05-01',
  };

  console.log('\nTestando POST /transactions (parcela)...');
  const res = await request('POST', '/transactions', parcela);
  if (res.status === 201) {
    console.log('✅ Parcela salva! id:', res.body.id);
    await request('DELETE', `/transactions/${res.body.id}`, null);
    console.log('   (removida)');
  } else {
    console.error(`❌ Falhou (${res.status}):`, JSON.stringify(res.body, null, 2));
  }
}
run().catch(e => { console.error(e); process.exit(1); });
