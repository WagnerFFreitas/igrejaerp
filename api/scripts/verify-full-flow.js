/**
 * Script de verificação completa: salvar membro com todos os campos críticos,
 * recarregar do banco e confirmar persistência.
 */
const { Client } = require('pg');
const http = require('http');
const fs = require('fs');

const envContent = fs.readFileSync('E:/igrejaerp/api/.env', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  return match ? match[1].trim() : '';
};

const API_BASE = `http://localhost:${getEnv('PORT') || 3000}`;

// Utilitário para chamadas HTTP
function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: parseInt(getEnv('PORT') || '3000'),
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(responseData) });
        } catch {
          resolve({ status: res.statusCode, body: responseData });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('VERIFICAÇÃO COMPLETA DO SISTEMA DE MEMBROS');
  console.log('='.repeat(60));

  // 1. Buscar membros existentes
  console.log('\n[1] Buscando lista de membros...');
  const listResp = await apiRequest('GET', '/api/members?limit=5');
  if (listResp.status !== 200) {
    console.error('❌ Falha ao buscar membros:', listResp.status, listResp.body);
    return;
  }
  const members = listResp.body.members || [];
  console.log(`✅ ${members.length} membros encontrados`);
  
  if (members.length === 0) {
    console.error('❌ Nenhum membro para testar. Crie um membro primeiro.');
    return;
  }

  // 2. Pegar o primeiro membro para testar
  const testMember = members[0];
  console.log(`\n[2] Membro de teste: "${testMember.nome}" (ID: ${testMember.id})`);
  console.log(`    Matrícula: ${testMember.matricula || '(sem matrícula)'}`);
  console.log(`    nome_pai atual: ${testMember.nome_pai || '(vazio)'}`);
  console.log(`    nome_mae atual: ${testMember.nome_mae || '(vazio)'}`);

  // 3. Atualizar o membro com TODOS os campos críticos
  console.log('\n[3] Atualizando membro com campos críticos (PT snake_case)...');
  const updatePayload = {
    // Campos em PT snake_case - exatamente como o banco espera
    nome: testMember.nome,
    cpf: testMember.cpf,
    unidade_id: testMember.unidade_id,
    // Filiação
    nome_pai: 'TESTE NOME PAI VERIFICAÇÃO',
    nome_mae: 'TESTE NOME MAE VERIFICAÇÃO',
    // Financeiro
    eh_dizimista: true,
    eh_ofertante_regular: true,
    participa_campanhas: false,
    // Bancário
    banco: 'Banco do Brasil',
    agencia_bancaria: '1234-5',
    conta_bancaria: '99999-8',
    chave_pix: 'verificacao@teste.com',
    // Saúde
    tipo_sanguineo: 'O+',
    contato_emergencia: '(11) 99999-0000',
    // Ministérios
    ministerio_principal: 'Louvor',
    funcao_ministerio: 'Músico',
    cell_group: 'Célula Centro',
    // Outros
    observacoes: 'TESTE DE VERIFICAÇÃO ' + new Date().toISOString(),
  };

  const updateResp = await apiRequest('PUT', `/api/members/${testMember.id}`, updatePayload);
  if (updateResp.status !== 200) {
    console.error('❌ Falha ao atualizar membro:', updateResp.status);
    console.error('   Detalhes:', JSON.stringify(updateResp.body, null, 2));
    return;
  }
  console.log('✅ Membro atualizado com sucesso via API');

  // 4. Verificar diretamente no banco de dados
  console.log('\n[4] Verificando dados diretamente no banco de dados...');
  const client = new Client({
    host: getEnv('DB_HOST') || 'localhost',
    port: parseInt(getEnv('DB_PORT') || '5432'),
    database: getEnv('DB_NAME') || 'igrejaerp',
    user: getEnv('DB_USER') || 'desenvolvedor',
    password: getEnv('DB_PASSWORD') || '',
  });
  await client.connect();

  const dbResult = await client.query(
    `SELECT nome, nome_pai, nome_mae, eh_dizimista, eh_ofertante_regular,
            banco, agencia_bancaria, conta_bancaria, chave_pix,
            tipo_sanguineo, contato_emergencia, ministerio_principal,
            funcao_ministerio, cell_group, observacoes
     FROM membros WHERE id = $1`,
    [testMember.id]
  );

  if (dbResult.rows.length === 0) {
    console.error('❌ Membro não encontrado no banco!');
    await client.end();
    return;
  }

  const dbMember = dbResult.rows[0];
  console.log('\n  Verificando campos salvos no banco:');

  const checks = [
    ['nome_pai', dbMember.nome_pai, 'TESTE NOME PAI VERIFICAÇÃO'],
    ['nome_mae', dbMember.nome_mae, 'TESTE NOME MAE VERIFICAÇÃO'],
    ['eh_dizimista', dbMember.eh_dizimista, true],
    ['eh_ofertante_regular', dbMember.eh_ofertante_regular, true],
    ['banco', dbMember.banco, 'Banco do Brasil'],
    ['agencia_bancaria', dbMember.agencia_bancaria, '1234-5'],
    ['conta_bancaria', dbMember.conta_bancaria, '99999-8'],
    ['chave_pix', dbMember.chave_pix, 'verificacao@teste.com'],
    ['tipo_sanguineo', dbMember.tipo_sanguineo, 'O+'],
    ['contato_emergencia', dbMember.contato_emergencia, '(11) 99999-0000'],
    ['ministerio_principal', dbMember.ministerio_principal, 'Louvor'],
    ['cell_group', dbMember.cell_group, 'Célula Centro'],
  ];

  let allPassed = true;
  checks.forEach(([field, actual, expected]) => {
    const pass = String(actual) === String(expected);
    if (!pass) allPassed = false;
    console.log(`  ${pass ? '✅' : '❌'} ${field}: ${pass ? `"${actual}"` : `Esperado="${expected}" | Obtido="${actual}"`}`);
  });

  // 5. Re-buscar via API (simula o frontend recarregando)
  console.log('\n[5] Re-buscando membro via API (simula reload do frontend)...');
  const reloadResp = await apiRequest('GET', `/api/members/${testMember.id}`);
  if (reloadResp.status !== 200) {
    console.error('❌ Falha ao re-buscar membro:', reloadResp.status);
  } else {
    const reloaded = reloadResp.body;
    console.log('  Dados retornados pela API após reload:');
    console.log(`  nome_pai: ${reloaded.nome_pai || '(vazio)'}`);
    console.log(`  nome_mae: ${reloaded.nome_mae || '(vazio)'}`);
    console.log(`  eh_dizimista: ${reloaded.eh_dizimista}`);
    console.log(`  banco: ${reloaded.banco || '(vazio)'}`);
    console.log(`  agencia_bancaria: ${reloaded.agencia_bancaria || '(vazio)'}`);
    console.log(`  conta_bancaria: ${reloaded.conta_bancaria || '(vazio)'}`);
    console.log(`  chave_pix: ${reloaded.chave_pix || '(vazio)'}`);
    console.log(`  cell_group: ${reloaded.cell_group || '(vazio)'}`);
  }

  // 6. Testar adição de contribuição (Dízimo)
  console.log('\n[6] Testando adição de contribuição (Dízimo) via API...');
  const today = new Date().toISOString().split('T')[0];
  const contribPayload = {
    valor: 150.00,
    value: 150.00,
    tipo: 'Dizimo',
    type: 'Dizimo',
    data_contribuicao: today,
    contribution_date: today,
    descricao: 'Dízimo verificação de teste',
    description: 'Dízimo verificação de teste',
  };
  const contribResp = await apiRequest('POST', `/api/members/${testMember.id}/contributions`, contribPayload);
  if (contribResp.status === 201) {
    console.log('✅ Contribuição adicionada com sucesso na tabela member_contributions');
    console.log(`  ID contribuição: ${contribResp.body.id}`);
    
    // Verificar no banco
    const contribCheck = await client.query(
      'SELECT * FROM member_contributions WHERE membro_id = $1 ORDER BY created_at DESC LIMIT 3',
      [testMember.id]
    );
    console.log(`  Total de contribuições no banco para este membro: ${contribCheck.rows.length}`);
    contribCheck.rows.forEach(c => {
      console.log(`    - ${c.type || c.tipo}: R$ ${c.value || c.valor} em ${c.contribution_date}`);
    });
  } else {
    console.log(`⚠️  Adição de contribuição retornou status ${contribResp.status}`);
    console.log('   Isso pode ser normal se o endpoint não existir separadamente.');
    console.log('   Contribuições podem estar sendo salvas em profile_data via saveMember.');
  }

  // 7. Verificar Mapa de Fidelidade - lógica
  console.log('\n[7] Verificando lógica do Mapa de Fidelidade...');
  const contribsInBd = await client.query(
    'SELECT * FROM member_contributions WHERE membro_id = $1',
    [testMember.id]
  );
  const profileDataResult = await client.query(
    'SELECT profile_data FROM membros WHERE id = $1',
    [testMember.id]
  );
  const profileData = profileDataResult.rows[0]?.profile_data || {};
  const profileContribs = profileData.contribuicoes || [];
  
  console.log(`  Contribuições em member_contributions: ${contribsInBd.rows.length}`);
  console.log(`  Contribuições em profile_data.contribuicoes: ${profileContribs.length}`);
  
  const currentMonthYear = today.substring(0, 7);
  const hasTithe = contribsInBd.rows.some(c => {
    const tipo = c.type || c.tipo || '';
    const data = c.contribution_date ? String(c.contribution_date).substring(0, 7) : '';
    return tipo === 'Dizimo' && data === currentMonthYear;
  }) || profileContribs.some(c => {
    const tipo = c.tipo || c.type || '';
    const data = c.data || c.date || '';
    return tipo === 'Dizimo' && String(data).startsWith(currentMonthYear);
  });
  
  console.log(`  Mês atual (${currentMonthYear}): ${hasTithe ? '✅ DÍZIMO REGISTRADO' : '❌ SEM DÍZIMO'}`);

  await client.end();

  console.log('\n' + '='.repeat(60));
  console.log(allPassed ? '🎉 TODOS OS CAMPOS CRÍTICOS ESTÃO FUNCIONANDO!' : '⚠️  ALGUNS CAMPOS PRECISAM DE ATENÇÃO');
  console.log('='.repeat(60));
}

main().catch(e => {
  console.error('\n❌ ERRO FATAL:', e.message);
  process.exit(1);
});
