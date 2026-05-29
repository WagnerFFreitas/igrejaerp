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
  // 1. Buscar um funcionário existente
  const empRes = await request('GET', `/employees?unitId=${UNIT}&limit=1`);
  const employees = Array.isArray(empRes.body) ? empRes.body : [];
  if (!employees.length) { console.error('Nenhum funcionário encontrado'); return; }
  const emp = employees[0];
  console.log(`Testando com: ${emp.employeeName} (${emp.id})`);

  // 2. Testar POST de avaliação — payload exato que o frontend envia
  const payload = {
    unitId: UNIT,
    employeeId: emp.id,
    employeeName: emp.employeeName,
    evaluationDate: '2026-04-15',
    evaluationType: 'ANNUAL',
    overallScore: 80,
    overallRating: 'GOOD',
    competencies: [{ name: 'Liderança', score: 85, category: 'BEHAVIORAL', weight: 0.25 }],
    goals: [],
    strengths: 'Pontualidade; Dedicação',
    improvements: 'Comunicação',
    actionPlan: 'Curso de comunicação',
    status: 'COMPLETED',
    evaluatedBy: 'Pastor Titular',
  };

  const postRes = await request('POST', '/rh/evaluations', payload);
  if (postRes.status === 201) {
    console.log('✅ POST /rh/evaluations OK — id:', postRes.body.id);
    // Limpar
    await request('DELETE', `/rh/evaluations/${postRes.body.id}`, null);
    console.log('   (removido)');
  } else {
    console.error(`❌ POST falhou (${postRes.status}):`, JSON.stringify(postRes.body, null, 2));
  }
}

run().catch(e => { console.error(e); process.exit(1); });
