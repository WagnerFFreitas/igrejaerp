/**
 * Verifica o fluxo completo de salvamento de funcionários
 */
require('dotenv').config();
const http = require('http');
const { Pool } = require('pg');

const BASE = 'http://localhost:3000/api';
const UNIT = '00000000-0000-0000-0000-000000000001';
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(BASE + path);
    const opts = { hostname: url.hostname, port: url.port, path: url.pathname + url.search, method, headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } };
    const req = http.request(opts, res => { let raw = ''; res.on('data', c => raw += c); res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); } catch { resolve({ status: res.statusCode, body: raw }); } }); });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('=== VERIFICAÇÃO COMPLETA — FUNCIONÁRIOS ===\n');

  // 1. Colunas reais da tabela
  const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='employees' ORDER BY ordinal_position");
  console.log('=== Colunas da tabela employees ===');
  console.log(cols.rows.map(c => c.column_name).join(', '));

  // 2. Funcionários existentes
  const listRes = await request('GET', `/employees?unitId=${UNIT}&limit=20`);
  const employees = Array.isArray(listRes.body) ? listRes.body : [];
  console.log(`\n=== Funcionários no banco: ${employees.length} ===`);
  employees.forEach(e => {
    const mat = e.matricula || e.profile_data?.matricula || '?';
    const name = e.employeeName || e.employee_name || e.name || '?';
    const cargo = e.cargo || e.profile_data?.cargo || '?';
    console.log(`  ${mat} | ${name} | ${cargo} | status: ${e.status || e.is_active}`);
  });

  // 3. Verificar ordenação
  console.log('\n=== Verificação de Ordenação ===');
  const mats = employees.map(e => e.matricula || e.profile_data?.matricula || '').filter(Boolean);
  console.log('Matrículas na ordem retornada:', mats.join(', '));

  // 4. Testar POST com payload completo
  console.log('\n=== Teste de Salvamento Completo ===');
  const testPayload = {
    unit_id: UNIT,
    employee_name: 'Funcionario Teste Completo',
    cpf: '444.555.666-77',
    rg: '9876543',
    pis: '999.88888.77-6',
    matricula: 'F99/2026',
    cargo: 'Auxiliar Administrativo',
    departamento: 'Administrativo',
    regime: 'CLT',
    admission_date: '2026-01-01',
    salary: 2500.00,
    work_hours: 44,
    active: true,
    email: 'teste@adjpa.com',
    phone: '(21) 99999-0000',
    profile_data: {
      birthDate: '1990-03-15',
      gender: 'M',
      maritalStatus: 'SINGLE',
      address: { zipCode: '25240-170', street: 'Rua Teste', number: '100', neighborhood: 'Centro', city: 'Duque de Caxias', state: 'RJ' },
      bloodType: 'B+',
      emergencyContact: '(21) 88888-0000',
      funcao: 'Auxiliar',
      jornada_trabalho: '44h',
      tipo_contrato: 'CLT',
      salario_base: 2500.00,
      banco: 'Bradesco',
      agencia: '1234',
      conta: '56789-0',
      chave_pix: 'teste@adjpa.com',
      vt_ativo: true,
      vale_transporte_total: 200,
      va_ativo: false,
      vale_alimentacao: 0,
      is_pcd: false,
      cnh_categoria: 'B',
      cnh_vencimento: '2028-12-31',
    }
  };

  const postRes = await request('POST', '/employees', testPayload);
  if (postRes.status === 201) {
    const empId = postRes.body.id;
    console.log(`✅ POST /employees OK — id: ${empId}`);

    // Verificar no banco
    const dbRow = await pool.query('SELECT * FROM employees WHERE id = $1', [empId]);
    const row = dbRow.rows[0];
    const pd = row.profile_data || {};

    console.log('\n=== Campos na tabela principal ===');
    const mainFields = { 
      employee_name: row.employee_name,
      cpf: row.cpf, rg: row.rg, pis: row.pis,
      matricula: row.matricula, cargo: row.cargo, departamento: row.departamento,
      regime_trabalho: row.regime_trabalho,
      data_admissao: row.data_admissao,
      salario_base: row.salario_base,
      is_active: row.is_active,
      email: row.email, phone: row.phone
    };
    Object.entries(mainFields).forEach(([k, v]) => console.log(`  ${v !== null && v !== undefined ? '✅' : '❌'} ${k}: ${JSON.stringify(v)}`));

    console.log('\n=== Campos em profile_data ===');
    const profileFields = ['birthDate', 'gender', 'maritalStatus', 'address', 'bloodType', 'emergencyContact', 'funcao', 'jornada_trabalho', 'tipo_contrato', 'salario_base', 'banco', 'agencia', 'conta', 'chave_pix', 'vt_ativo', 'vale_transporte_total', 'va_ativo', 'vale_alimentacao', 'is_pcd', 'cnh_categoria', 'cnh_vencimento'];
    profileFields.forEach(k => {
      const v = pd[k];
      const ok = v !== null && v !== undefined && v !== '';
      console.log(`  ${ok ? '✅' : '⚠️ '} ${k}: ${JSON.stringify(v)}`);
    });

    // Limpar
    await pool.query('DELETE FROM employees WHERE id = $1', [empId]);
    console.log('\n✅ Funcionário de teste removido.');
  } else {
    console.error(`❌ POST falhou (${postRes.status}):`, JSON.stringify(postRes.body));
  }

  // 5. Verificar constraints da tabela
  const constraints = await pool.query(`
    SELECT conname, pg_get_constraintdef(oid) as def
    FROM pg_constraint WHERE conrelid = 'employees'::regclass AND contype = 'c'
  `);
  if (constraints.rows.length > 0) {
    console.log('\n=== CHECK constraints ===');
    constraints.rows.forEach(c => console.log(`  ${c.conname}: ${c.def}`));
  }

  await pool.end();
}

run().catch(e => { console.error(e); pool.end(); });
