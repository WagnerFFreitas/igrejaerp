/**
 * Teste final de todos os endpoints financeiros
 */
require('dotenv').config();
const http = require('http');

const BASE = 'http://localhost:3000/api';
const UNIT = '00000000-0000-0000-0000-000000000001';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(BASE + path);
    const opts = {
      hostname: url.hostname, port: url.port, path: url.pathname + url.search,
      method, headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) }
    };
    const req = http.request(opts, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  const results = [];

  const check = async (label, method, path, body) => {
    try {
      const r = await request(method, path, body);
      if (r.status >= 400) {
        results.push(`❌ ${label}: HTTP ${r.status} — ${r.body?.error?.details || r.body?.error?.message || JSON.stringify(r.body)}`);
      } else {
        const count = Array.isArray(r.body) ? ` (${r.body.length} registros)` : '';
        const id = r.body?.id ? ` id=${r.body.id}` : '';
        results.push(`✅ ${label}${count}${id}`);
      }
    } catch (e) {
      results.push(`❌ ${label}: ${e.message}`);
    }
  };

  await check('GET  /transactions',              'GET',  `/transactions?unitId=${UNIT}&limit=3`);
  await check('POST /transactions',              'POST', '/transactions', { unitId: UNIT, description: 'Dízimo teste', amount: 500, date: '2026-04-15', type: 'INCOME', category: 'Dizimo', costCenter: 'cc1', operationNature: 'nat6', status: 'PAID', paymentMethod: 'PIX', isInstallment: false });
  await check('GET  /accounts',                  'GET',  `/accounts?unitId=${UNIT}`);
  await check('POST /accounts',                  'POST', '/accounts', { unitId: UNIT, name: 'Conta Corrente BB', type: 'BANK', currentBalance: 5000, status: 'ACTIVE' });
  await check('GET  /treasury/cash-flows',       'GET',  `/treasury/cash-flows?unitId=${UNIT}`);
  await check('POST /treasury/cash-flows',       'POST', '/treasury/cash-flows', { unitId: UNIT, data: '2026-04-15', descricao: 'Oferta culto', categoria: 'RECEITA', valor: 800, tipo: 'ENTRADA', status: 'REALIZADO' });
  await check('GET  /treasury/investments',      'GET',  `/treasury/investments?unitId=${UNIT}`);
  await check('POST /treasury/investments',      'POST', '/treasury/investments', { unitId: UNIT, nome: 'Tesouro Direto', tipo: 'TESOURO', instituicao: 'Tesouro Nacional', dataAplicacao: '2026-01-01', valorAplicado: 20000, valorAtual: 20400, rentabilidadeAnual: 10.5, status: 'ATIVO' });
  await check('GET  /treasury/loans',            'GET',  `/treasury/loans?unitId=${UNIT}`);
  await check('POST /treasury/loans',            'POST', '/treasury/loans', { unitId: UNIT, nome: 'Empréstimo Reforma', credor: 'Banco Bradesco', dataContratacao: '2026-01-01', dataVencimento: '2027-01-01', valorOriginal: 50000, valorSaldo: 45000, taxaJuros: 1.5, totalParcelas: 12, status: 'ATIVO', parcelas: [] });
  await check('GET  /treasury/alerts',           'GET',  `/treasury/alerts?unitId=${UNIT}`);
  await check('POST /treasury/alerts',           'POST', '/treasury/alerts', { unitId: UNIT, tipo: 'SALDO_MINIMO', titulo: 'Saldo baixo', descricao: 'Caixa abaixo do mínimo', gravidade: 'ALTA', status: 'ATIVO', acoesSugeridas: ['Transferir fundos'] });
  await check('GET  /treasury/positions',        'GET',  `/treasury/positions?unitId=${UNIT}`);
  await check('POST /treasury/positions',        'POST', '/treasury/positions', { unitId: UNIT, data: '2026-04-15', ativoTotal: 75000, passivoTotal: 45000, patrimonioLiquido: 30000, disponibilidades: 5000, aplicacoes: 20400, emprestimos: 45000, indicadores: { liquidezCorrente: 1.2, liquidezSeca: 1.0, endividamento: 60, rentabilidade: 5 }, detalhamento: [] });
  await check('GET  /reconciliations',           'GET',  `/reconciliations?unitId=${UNIT}`);
  await check('POST /reconciliations',           'POST', '/reconciliations', { unitId: UNIT, dataInicio: '2026-04-01', dataFim: '2026-04-15', status: 'IN_PROGRESS' });

  console.log('\n=== RESULTADO FINAL ===');
  results.forEach(r => console.log(r));
  const erros = results.filter(r => r.startsWith('❌')).length;
  console.log(`\n${results.length - erros}/${results.length} endpoints OK`);
  if (erros > 0) process.exit(1);
}

run().catch(e => { console.error(e); process.exit(1); });
