/**
 * Testa se TODOS os campos do formulário de membros são salvos corretamente no banco.
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

// Payload completo com TODOS os campos do formulário
const fullPayload = {
  unit_id: UNIT,
  name: 'Teste Campos Completos',
  cpf: '111.222.333-44',
  rg: '1234567',
  email: 'teste@email.com',
  phone: '(21) 99999-1111',
  celular: '(21) 99999-2222',
  data_nascimento: '1990-05-15',
  sexo: 'M',
  estado_civil: 'CASADO',
  endereco: 'Rua das Flores',
  bairro: 'Centro',
  cidade: 'Duque de Caxias',
  estado: 'RJ',
  cep: '25240-170',
  data_conversao: '2010-01-01',
  data_batismo: '2010-06-01',
  data_membro: '2011-01-01',
  situacao: 'ATIVO',
  cargo_igreja: 'MEMBER',
  ministerio: 'Louvor',
  grupo_pequeno: 'Célula Norte',
  dizimista: true,
  ofertante: true,
  valor_dizimo: '200',
  observacoes: 'Observação de teste',
  profile_data: {
    matricula: 'M99/2026',
    avatar: '',
    whatsapp: '(21) 99999-2222',
    profession: 'Engenheiro',
    fatherName: 'João Pai',
    motherName: 'Maria Mãe',
    bloodType: 'O+',
    emergencyContact: '(21) 88888-0000',
    conversionDate: '2010-01-01',
    conversionPlace: 'Igreja Teste',
    baptismDate: '2010-06-01',
    baptismChurch: 'Igreja Batismo',
    baptizingPastor: 'Pastor Silva',
    holySpiritBaptism: 'SIM',
    membershipDate: '2011-01-01',
    churchOfOrigin: 'Igreja Origem',
    discipleshipCourse: 'CONCLUIDO',
    biblicalSchool: 'ATIVO',
    mainMinistry: 'Louvor',
    ministryRole: 'Músico',
    otherMinistries: ['Intercessão', 'Evangelismo'],
    ecclesiasticalPosition: 'Diácono',
    consecrationDate: '2015-03-01',
    isTithable: true,
    isRegularGiver: true,
    participatesCampaigns: true,
    bank: 'Bradesco',
    bankAgency: '1234',
    bankAccount: '56789-0',
    pixKey: 'teste@email.com',
    spouseName: 'Ana Cônjuge',
    marriageDate: '2012-06-15',
    spiritualGifts: 'Profecia, Cura',
    cellGroup: 'Célula Norte',
    address: {
      zipCode: '25240-170',
      street: 'Rua das Flores',
      number: '100',
      complement: 'Apto 2',
      neighborhood: 'Centro',
      city: 'Duque de Caxias',
      state: 'RJ'
    },
    specialNeeds: 'Nenhuma',
    talents: 'Música, Pregação',
    tags: ['dizimista', 'lider'],
    familyId: 'FAM-001',
    email_pessoal: 'pessoal@email.com',
    celular: '(21) 99999-2222',
    escolaridade: 'Superior Completo',
    is_pcd: false,
    tipo_deficiencia: '',
    dependents: [{ id: 'dep1', name: 'Filho Teste', relationship: 'FILHO', birthDate: '2015-01-01' }],
    contributions: [{ id: 'c1', value: 200, date: '2026-04-01', type: 'Dizimo', description: 'Dízimo Abril' }],
    lgpdConsent: { dataProcessing: true, communication: true, marketing: false, financial: true, policyVersion: '1.0' }
  }
};

async function run() {
  console.log('=== TESTE COMPLETO DE CAMPOS DO MEMBRO ===\n');

  // 1. Criar membro
  const postRes = await request('POST', '/members', fullPayload);
  if (postRes.status !== 201) {
    console.error('❌ Falha ao criar membro:', JSON.stringify(postRes.body));
    await pool.end(); return;
  }
  const memberId = postRes.body.id;
  console.log(`✅ Membro criado: ${memberId}\n`);

  // 2. Buscar direto do banco
  const dbRow = await pool.query('SELECT * FROM members WHERE id = $1', [memberId]);
  const row = dbRow.rows[0];
  const pd = row.profile_data || {};

  console.log('=== CAMPOS NA TABELA PRINCIPAL ===');
  const mainFields = {
    name: row.name,
    cpf: row.cpf,
    rg: row.rg,
    email: row.email,
    phone: row.phone,
    celular: row.celular,
    data_nascimento: row.data_nascimento,
    sexo: row.sexo,
    estado_civil: row.estado_civil,
    endereco: row.endereco,
    bairro: row.bairro,
    cidade: row.cidade,
    estado: row.estado,
    cep: row.cep,
    data_conversao: row.data_conversao,
    data_batismo: row.data_batismo,
    data_membro: row.data_membro,
    situacao: row.situacao,
    cargo_igreja: row.cargo_igreja,
    ministerio: row.ministerio,
    grupo_pequeno: row.grupo_pequeno,
    dizimista: row.dizimista,
    ofertante: row.ofertante,
    valor_dizimo: row.valor_dizimo,
    observacoes: row.observacoes,
  };
  Object.entries(mainFields).forEach(([k, v]) => {
    const ok = v !== null && v !== undefined && v !== '';
    console.log(`  ${ok ? '✅' : '❌'} ${k}: ${JSON.stringify(v)}`);
  });

  console.log('\n=== CAMPOS EM PROFILE_DATA ===');
  const profileFields = [
    'matricula', 'profession', 'fatherName', 'motherName', 'bloodType', 'emergencyContact',
    'conversionDate', 'conversionPlace', 'baptismDate', 'baptismChurch', 'baptizingPastor',
    'holySpiritBaptism', 'membershipDate', 'churchOfOrigin', 'discipleshipCourse', 'biblicalSchool',
    'mainMinistry', 'ministryRole', 'otherMinistries', 'ecclesiasticalPosition', 'consecrationDate',
    'isTithable', 'isRegularGiver', 'participatesCampaigns',
    'bank', 'bankAgency', 'bankAccount', 'pixKey',
    'spouseName', 'marriageDate', 'spiritualGifts', 'cellGroup',
    'address', 'specialNeeds', 'talents', 'tags', 'familyId',
    'email_pessoal', 'celular', 'escolaridade', 'is_pcd', 'tipo_deficiencia',
    'dependents', 'contributions', 'lgpdConsent'
  ];
  profileFields.forEach(k => {
    const v = pd[k];
    const ok = v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
    console.log(`  ${ok ? '✅' : '⚠️ '} ${k}: ${JSON.stringify(v)}`);
  });

  // 3. Limpar
  await pool.query('DELETE FROM members WHERE id = $1', [memberId]);
  console.log('\n✅ Membro de teste removido.');
  await pool.end();
}

run().catch(e => { console.error(e); pool.end(); });
