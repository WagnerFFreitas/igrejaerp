// Teste direto do backend para verificar se a proteção da matrícula funciona
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function testMatriculaProtection() {
  try {
    console.log('=== Testando Proteção da Matrícula ===\n');

    // Pegar um membro para testar
    const memberResult = await pool.query(
      'SELECT id, name, matricula FROM members WHERE matricula IS NOT NULL LIMIT 1'
    );

    if (memberResult.rows.length === 0) {
      console.log('❌ Nenhum membro com matrícula encontrado');
      await pool.end();
      return;
    }

    const member = memberResult.rows[0];
    console.log(`📋 Membro selecionado: ${member.name}`);
    console.log(`   Matrícula atual: ${member.matricula}\n`);

    const originalMatricula = member.matricula;

    // Simular UPDATE com matrícula vazia (como o frontend envia)
    console.log('🔄 Simulando UPDATE com matricula = ""...');
    await pool.query(
      'UPDATE members SET matricula = $1, updated_at = NOW() WHERE id = $2',
      ['', member.id]
    );

    // Verificar se a matrícula foi perdida
    const checkAfterEmpty = await pool.query(
      'SELECT matricula FROM members WHERE id = $1',
      [member.id]
    );

    console.log(`   Matrícula após update com "": ${checkAfterEmpty.rows[0].matricula || '(VAZIO)'}\n`);

    // Restaurar a matrícula original
    console.log('🔄 Restaurando matrícula original...');
    await pool.query(
      'UPDATE members SET matricula = $1, updated_at = NOW() WHERE id = $2',
      [originalMatricula, member.id]
    );

    const checkRestored = await pool.query(
      'SELECT matricula FROM members WHERE id = $1',
      [member.id]
    );

    console.log(`   Matrícula restaurada: ${checkRestored.rows[0].matricula}\n`);

    console.log('⚠️  Este teste mostra que o backend SALVA string vazia se enviado!');
    console.log('✅ A proteção no sanitizeMemberPayload deve impedir que isso aconteça.\n');

    console.log('=== Teste Concluído ===');
    console.log('\n📌 IMPORTANTE: Reinicie o servidor API para aplicar a proteção!');
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

testMatriculaProtection();
