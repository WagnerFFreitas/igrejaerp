const { Client } = require('pg');
const fs = require('fs');

const envContent = fs.readFileSync('E:/igrejaerp/api/.env', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  return match ? match[1].trim() : '';
};

const client = new Client({
  host: getEnv('DB_HOST') || 'localhost',
  port: parseInt(getEnv('DB_PORT') || '5432'),
  database: getEnv('DB_NAME') || 'igrejaerp',
  user: getEnv('DB_USER') || 'desenvolvedor',
  password: getEnv('DB_PASSWORD') || '',
});

async function main() {
  await client.connect();
  console.log('✅ Conectado ao banco de dados!\n');

  // 1. Colunas da tabela membros
  const colResult = await client.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='membros' ORDER BY ordinal_position"
  );
  console.log('=== COLUNAS DA TABELA MEMBROS ===');
  colResult.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));
  
  // 2. Verificar campos críticos
  const criticalFields = ['nome_pai', 'nome_mae', 'eh_dizimista', 'chave_pix', 'banco', 'agencia_bancaria', 'conta_bancaria', 'whatsapp', 'cell_group'];
  console.log('\n=== VERIFICAÇÃO DE CAMPOS CRÍTICOS ===');
  const cols = colResult.rows.map(r => r.column_name);
  criticalFields.forEach(f => {
    const exists = cols.includes(f);
    console.log(`  ${exists ? '✅' : '❌'} ${f}`);
  });

  // 3. Colunas das tabelas relacionadas
  const relResult = await client.query(
    "SELECT table_name, column_name FROM information_schema.columns WHERE table_name IN ('dependents','member_contributions') ORDER BY table_name, ordinal_position"
  );
  console.log('\n=== TABELAS RELACIONADAS ===');
  relResult.rows.forEach(r => console.log(`  ${r.table_name}: ${r.column_name}`));

  // 4. Buscar um membro de exemplo para verificar dados
  const memberResult = await client.query(
    "SELECT id, nome, nome_pai, nome_mae, eh_dizimista, banco, agencia_bancaria, conta_bancaria, chave_pix, whatsapp, cell_group FROM membros WHERE status='ACTIVE' LIMIT 3"
  );
  console.log('\n=== DADOS DE EXEMPLO (MEMBROS ATIVOS) ===');
  memberResult.rows.forEach(m => {
    console.log(`\n  Membro: ${m.nome}`);
    console.log(`    ID: ${m.id}`);
    console.log(`    nome_pai: ${m.nome_pai || '(vazio)'}`);
    console.log(`    nome_mae: ${m.nome_mae || '(vazio)'}`);
    console.log(`    eh_dizimista: ${m.eh_dizimista}`);
    console.log(`    banco: ${m.banco || '(vazio)'}`);
    console.log(`    agencia_bancaria: ${m.agencia_bancaria || '(vazio)'}`);
    console.log(`    conta_bancaria: ${m.conta_bancaria || '(vazio)'}`);
    console.log(`    chave_pix: ${m.chave_pix || '(vazio)'}`);
    console.log(`    whatsapp: ${m.whatsapp || '(vazio)'}`);
    console.log(`    cell_group: ${m.cell_group || '(vazio)'}`);
  });

  // 5. Verificar member_contributions
  const contribResult = await client.query(
    "SELECT COUNT(*) as total FROM member_contributions"
  );
  console.log(`\n=== CONTRIBUIÇÕES ===`);
  console.log(`  Total de registros em member_contributions: ${contribResult.rows[0].total}`);

  // 6. Verificar profile_data com dizimos salvos (legado)
  const legacyResult = await client.query(
    "SELECT COUNT(*) as total FROM membros WHERE profile_data->>'contribuicoes' IS NOT NULL AND profile_data->>'contribuicoes' != '[]'"
  );
  console.log(`  Membros com contribuicoes em profile_data (legado): ${legacyResult.rows[0].total}`);

  await client.end();
  console.log('\n✅ Verificação concluída!');
}

main().catch(e => {
  console.error('❌ ERRO:', e.message);
  client.end();
});
