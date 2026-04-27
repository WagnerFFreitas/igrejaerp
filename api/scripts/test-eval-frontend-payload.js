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
  const empRes = await request('GET', `/employees?unitId=${UNIT}&limit=1`);
  const emp = (Array.isArray(empRes.body) ? empRes.body : [])[0];
  if (!emp) { console.error('Nenhum funcionário'); return; }

  // Simula exatamente o payload que Funcionarios.tsx monta após o fix
  const avaliacaoFromModal = {
    id: `tmp-${Date.now()}`,  // após o fix do AvaliacaoModal
    employeeId: emp.id,
    employeeName: emp.employeeName,
    evaluatorId: 'current-user',
    evaluatorName: 'Pastor Titular',
    evaluationPeriod: '2026-Q1',
    evaluationDate: '2026-04-15',
    evaluationType: 'QUARTERLY',
    status: 'COMPLETED',
    overallScore: 85,
    overallRating: 'GOOD',
    strengths: ['Pontualidade', 'Dedicação'],
    improvementAreas: ['Comunicação'],
    comments: 'Bom desempenho geral',
    competencies: [{ id: 'c1', name: 'Liderança', score: 85, category: 'BEHAVIORAL', weight: 0.25 }],
    goals: [],
    pdiPlan: [],
    unitId: 'current-unit',  // valor original do modal (será sobrescrito)
  };

  // Payload final após handleSaveAvaliacao processar
  const payload = {
    ...avaliacaoFromModal,
    unitId: UNIT,  // sobrescrito
    employeeId: emp.id,
    employeeName: emp.employeeName,
    evaluationDate: avaliacaoFromModal.evaluationDate,
    evaluationType: avaliacaoFromModal.evaluationType,
    overallScore: avaliacaoFromModal.overallScore,
    overallRating: avaliacaoFromModal.overallRating,
    competencies: avaliacaoFromModal.competencies,
    goals: avaliacaoFromModal.goals,
    strengths: Array.isArray(avaliacaoFromModal.strengths) ? avaliacaoFromModal.strengths.join('; ') : null,
    improvements: Array.isArray(avaliacaoFromModal.improvementAreas) ? avaliacaoFromModal.improvementAreas.join('; ') : null,
    actionPlan: avaliacaoFromModal.comments,
    status: 'COMPLETED',
    evaluatedBy: avaliacaoFromModal.evaluatorName,
  };

  console.log('Payload enviado:', JSON.stringify(payload, null, 2));

  const res = await request('POST', '/rh/evaluations', payload);
  if (res.status === 201) {
    console.log('✅ Avaliação salva! id:', res.body.id, '| score:', res.body.overall_score);
    await request('DELETE', `/rh/evaluations/${res.body.id}`, null);
    console.log('   (removido)');
  } else {
    console.error(`❌ Falhou (${res.status}):`, JSON.stringify(res.body, null, 2));
  }
}

run().catch(e => { console.error(e); process.exit(1); });
