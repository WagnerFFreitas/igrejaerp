require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function removeTestMembers() {
  try {
    console.log('=== Removendo Membros de Teste ===\n');

    // Primeiro, encontrar os membros de teste
    const findResult = await pool.query(
      "SELECT id, name, cpf FROM members WHERE name ILIKE '%Membro Teste%'"
    );

    console.log(`📋 Encontrados ${findResult.rows.length} membros com nome "Membro Teste":\n`);
    
    if (findResult.rows.length === 0) {
      console.log('✅ Nenhum membro de teste encontrado.');
      await pool.end();
      return;
    }

    findResult.rows.forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.name} | CPF: ${m.cpf || 'N/A'}`);
      console.log(`     ID: ${m.id}\n`);
    });

    // Confirmar remoção
    console.log(`\n⚠️  Removendo ${findResult.rows.length} membro(s) de teste...`);
    
    const deleteResult = await pool.query(
      "DELETE FROM members WHERE name ILIKE '%Membro Teste%'"
    );

    console.log(`✅ ${deleteResult.rowCount} membro(s) removido(s) com sucesso!`);

    // Verificar se ainda existe algum
    const verifyResult = await pool.query(
      "SELECT COUNT(*) FROM members WHERE name ILIKE '%Membro Teste%'"
    );

    console.log(`\n🔍 Verificação: ${verifyResult.rows[0].count} membro(s) de teste restante(s)`);

    // Contar total de membros ativos
    const totalResult = await pool.query('SELECT COUNT(*) FROM members');
    console.log(`📊 Total de membros no banco: ${totalResult.rows[0].count}`);

    console.log('\n=== Operação Concluída ===');
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

removeTestMembers();
