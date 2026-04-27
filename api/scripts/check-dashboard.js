/**
 * Verifica se os dados necessários para o dashboard estão disponíveis
 */
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
  console.log('=== VERIFICAÇÃO DO DASHBOARD ===\n');

  // 1. Membros
  const m = await get(`/members?unitId=${UNIT}&limit=500`);
  const members = m.body?.members || [];
  console.log(`✅ Membros: ${members.length} registros`);
  const ativos = members.filter(m => m.situacao === 'ATIVO').length;
  console.log(`   Ativos: ${ativos} | Inativos: ${members.length - ativos}`);
  const comAniversario = members.filter(m => m.profile_data?.birthDate || m.data_nascimento).length;
  console.log(`   Com data de nascimento: ${comAniversario} (para widget aniversariantes)`);

  // 2. Funcionários
  const e = await get(`/employees?unitId=${UNIT}&limit=500`);
  const employees = Array.isArray(e.body) ? e.body : [];
  console.log(`\n✅ Funcionários: ${employees.length} registros`);
  const comCNH = employees.filter(emp => emp.profile_data?.cnh_vencimento || emp.cnh_vencimento).length;
  console.log(`   Com CNH cadastrada: ${comCNH} (para widget alertas CNH)`);
  const comAnivFunc = employees.filter(emp => emp.profile_data?.birthDate || emp.birth_date).length;
  console.log(`   Com data de nascimento: ${comAnivFunc} (para widget aniversariantes)`);

  // 3. Transações (para gráfico de arrecadação)
  const t = await get(`/transactions?unitId=${UNIT}&limit=500`);
  const transactions = Array.isArray(t.body) ? t.body : [];
  console.log(`\n✅ Transações: ${transactions.length} registros`);
  const receitas = transactions.filter(t => t.type === 'INCOME' && t.status === 'PAID');
  const despesas = transactions.filter(t => t.type === 'EXPENSE' && t.status === 'PAID');
  const totalReceita = receitas.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const totalDespesa = despesas.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  console.log(`   Receitas pagas: R$ ${totalReceita.toFixed(2)}`);
  console.log(`   Despesas pagas: R$ ${totalDespesa.toFixed(2)}`);
  console.log(`   Saldo: R$ ${(totalReceita - totalDespesa).toFixed(2)}`);

  // 4. Contas bancárias
  const a = await get(`/accounts?unitId=${UNIT}`);
  const accounts = Array.isArray(a.body) ? a.body : [];
  console.log(`\n✅ Contas bancárias: ${accounts.length} registros`);
  const saldoTotal = accounts.reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);
  console.log(`   Saldo total: R$ ${saldoTotal.toFixed(2)}`);

  // 5. Problemas identificados
  console.log('\n=== PROBLEMAS IDENTIFICADOS ===');

  // Gráfico de arrecadação usa dados hardcoded
  console.log('⚠️  Gráfico "Evolução da Arrecadação" usa dados HARDCODED (chartData estático)');
  console.log('   Deveria usar transações reais do banco');

  // Cards de KPI usam dados hardcoded
  console.log('⚠️  Cards KPI "Arrecadação", "Frequência Média", "Novos Visitantes" são HARDCODED');
  console.log('   Apenas "Total Membros" usa dado real');

  // Gemini API key expirada
  console.log('⚠️  API Gemini com chave expirada — widgets de IA não funcionam');

  // Dados reais disponíveis
  console.log('\n=== DADOS REAIS DISPONÍVEIS PARA O DASHBOARD ===');
  console.log(`✅ Total de membros: ${members.length}`);
  console.log(`✅ Membros ativos: ${ativos}`);
  console.log(`✅ Receita real do banco: R$ ${totalReceita.toFixed(2)}`);
  console.log(`✅ Despesa real do banco: R$ ${totalDespesa.toFixed(2)}`);
  console.log(`✅ Saldo em contas: R$ ${saldoTotal.toFixed(2)}`);
  console.log(`✅ Funcionários: ${employees.length}`);
}

run().catch(e => { console.error(e); process.exit(1); });
