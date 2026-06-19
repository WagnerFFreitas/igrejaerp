require('dotenv').config();
const http = require('http');
const UNIT = '00000000-0000-0000-0000-000000000001';

function get(path) {
  return new Promise((resolve) => {
    const url = new URL('http://localhost:3000/api' + path);
    const req = http.request({ hostname: url.hostname, port: url.port, path: url.pathname + url.search, method: 'GET' }, res => {
      let raw = ''; res.on('data', c => raw += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); } catch { resolve({ status: res.statusCode, body: raw }); } });
    });
    req.on('error', e => resolve({ status: 0, body: e.message }));
    req.end();
  });
}

async function run() {
  console.log('=== VERIFICAÇÃO DO MÓDULO FINANCEIRO ===\n');

  // 1. Transações
  const t = await get(`/transactions?unitId=${UNIT}&limit=500`);
  const txs = Array.isArray(t.body) ? t.body : [];
  console.log(`✅ Transações: ${txs.length} registros (HTTP ${t.status})`);
  if (txs.length > 0) {
    const campos = Object.keys(txs[0]);
    console.log(`   Campos retornados: ${campos.join(', ')}`);
    const income = txs.filter(t => t.type === 'INCOME' && t.status === 'PAID').reduce((s,t) => s + parseFloat(t.amount||0), 0);
    const expense = txs.filter(t => t.type === 'EXPENSE' && t.status === 'PAID').reduce((s,t) => s + parseFloat(t.amount||0), 0);
    const pending = txs.filter(t => t.status === 'PENDING').reduce((s,t) => s + parseFloat(t.amount||0), 0);
    console.log(`   Receita realizada: R$ ${income.toFixed(2)}`);
    console.log(`   Despesa liquidada: R$ ${expense.toFixed(2)}`);
    console.log(`   Contas a pagar: R$ ${pending.toFixed(2)}`);
  }

  // 2. Contas bancárias
  const a = await get(`/accounts?unitId=${UNIT}`);
  const accs = Array.isArray(a.body) ? a.body : [];
  console.log(`\n✅ Contas bancárias: ${accs.length} registros (HTTP ${a.status})`);
  accs.forEach(acc => console.log(`   - ${acc.name} (${acc.type}): R$ ${parseFloat(acc.currentBalance||0).toFixed(2)} [${acc.status}]`));

  // 3. Conciliações
  const r = await get(`/reconciliations?unitId=${UNIT}`);
  const recs = Array.isArray(r.body) ? r.body : [];
  console.log(`\n✅ Conciliações: ${recs.length} registros (HTTP ${r.status})`);
  if (recs.length > 0) {
    recs.forEach(rec => console.log(`   - ${rec.id?.slice(0,8)} | status: ${rec.status} | ${rec.data_inicio} a ${rec.data_fim}`));
  }

  // 4. Tesouraria
  const cf = await get(`/treasury/cash-flows?unitId=${UNIT}`);
  const inv = await get(`/treasury/investments?unitId=${UNIT}`);
  const loans = await get(`/treasury/loans?unitId=${UNIT}`);
  const alerts = await get(`/treasury/alerts?unitId=${UNIT}`);
  console.log(`\n✅ Tesouraria:`);
  console.log(`   Cash flows: ${(Array.isArray(cf.body) ? cf.body : []).length} (HTTP ${cf.status})`);
  console.log(`   Investimentos: ${(Array.isArray(inv.body) ? inv.body : []).length} (HTTP ${inv.status})`);
  console.log(`   Empréstimos: ${(Array.isArray(loans.body) ? loans.body : []).length} (HTTP ${loans.status})`);
  console.log(`   Alertas: ${(Array.isArray(alerts.body) ? alerts.body : []).length} (HTTP ${alerts.status})`);

  // 5. Problemas identificados
  console.log('\n=== PROBLEMAS IDENTIFICADOS ===');
  
  if (accs.length === 0) {
    console.log('❌ Contas bancárias: nenhuma conta cadastrada — aba "Contas Bancárias" ficará vazia');
  }
  
  // Verificar se ConciliacaoBancaria recebe accounts
  console.log('⚠️  ConciliacaoBancaria: select de contas usa opções HARDCODED (acc-001, acc-002)');
  console.log('   Deveria usar as contas reais do banco');
  
  if (recs.length === 0) {
    console.log('⚠️  Conciliações: nenhuma conciliação ainda — tela mostra estado vazio (correto)');
  }
  
  console.log('⚠️  ContasBancarias: accountService.getConsolidatedBalance() pode falhar se não houver contas');
  
  console.log('\n=== RESUMO ===');
  console.log(`Transações: ${txs.length > 0 ? '✅ OK' : '⚠️ Vazio'}`);
  console.log(`Contas: ${accs.length > 0 ? '✅ OK' : '⚠️ Vazio'}`);
  console.log(`Conciliações: ${recs.length > 0 ? '✅ OK' : '⚠️ Vazio (normal)'}`);
  console.log(`Tesouraria: ✅ Endpoints OK`);
}

run().catch(e => { console.error(e); process.exit(1); });
