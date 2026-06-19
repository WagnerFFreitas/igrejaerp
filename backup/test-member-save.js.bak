require('dotenv').config();
const http = require('http');

const BASE = 'http://localhost:3000/api';
const UNIT = '00000000-0000-0000-0000-000000000001';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(BASE + path);
    const opts = {
      hostname: url.hostname, port: url.port,
      path: url.pathname + url.search, method,
      headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) }
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
  // 1. Buscar membro existente
  const listRes = await request('GET', `/members?unitId=${UNIT}&limit=1`);
  const m = listRes.body.members[0];
  console.log(`Testando com: ${m.id} - ${m.name}`);

  const payload = {
    unit_id: UNIT,
    name: m.name,
    cpf: m.cpf,
    rg: m.rg || '',
    email: m.email || '',
    phone: m.phone || '',
    situacao: 'ATIVO',
    cargo_igreja: 'MEMBER',
    ministerio: 'Louvor',
    grupo_pequeno: 'Célula 1',
    data_nascimento: '1990-01-01',
    sexo: 'M',
    estado_civil: 'SOLTEIRO',
    endereco: 'Rua Teste',
    bairro: 'Bairro Teste',
    cidade: 'Duque de Caxias',
    estado: 'RJ',
    cep: '25240-170',
    data_conversao: '2010-01-01',
    data_batismo: '2010-06-01',
    data_membro: '2010-01-01',
    dizimista: true,
    ofertante: false,
    valor_dizimo: '0',
    observacoes: 'Teste de salvamento completo',
    profile_data: {
      matricula: m.matricula || 'M01/2026',
      fatherName: 'Pai Teste',
      motherName: 'Mae Teste',
      bloodType: 'A+',
      emergencyContact: '(21) 99999-9999',
      conversionDate: '2010-01-01',
      baptismDate: '2010-06-01',
      discipleshipCourse: 'CONCLUIDO',
      biblicalSchool: 'ATIVO',
      mainMinistry: 'Louvor',
      ecclesiasticalPosition: 'MEMBER',
      bank: 'Bradesco',
      bankAgency: '1234',
      bankAccount: '56789-0',
      pixKey: 'teste@email.com',
      talents: 'Música',
    },
  };

  // 2. PUT
  const putRes = await request('PUT', `/members/${m.id}`, payload);
  if (putRes.status === 200) {
    console.log('✅ PUT OK — situacao:', putRes.body.situacao, '| ministerio:', putRes.body.ministerio);
    console.log('   profile_data.fatherName:', putRes.body.profile_data?.fatherName);
    console.log('   profile_data.bloodType:', putRes.body.profile_data?.bloodType);
    console.log('   profile_data.discipleshipCourse:', putRes.body.profile_data?.discipleshipCourse);
  } else {
    console.error('❌ PUT falhou:', JSON.stringify(putRes.body));
  }

  // 3. POST com CPF único
  const uniqueCpf = `${Math.floor(Math.random()*900+100)}.${Math.floor(Math.random()*900+100)}.${Math.floor(Math.random()*900+100)}-${Math.floor(Math.random()*90+10)}`;
  const postRes = await request('POST', '/members', { ...payload, name: 'Membro Teste Auto', cpf: uniqueCpf });
  if (postRes.status === 201) {
    console.log('✅ POST OK — id:', postRes.body.id);
    await request('DELETE', `/members/${postRes.body.id}`, null);
    console.log('   (removido)');
  } else {
    console.error('❌ POST falhou:', JSON.stringify(postRes.body));
  }
}

run().catch(e => { console.error(e); process.exit(1); });
