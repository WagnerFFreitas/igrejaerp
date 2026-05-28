require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function checkAnaPaulaMatricula() {
  try {
    console.log('=== Verificando Matrícula da Ana Paula ===\n');

    const result = await pool.query(
      'SELECT id, name, matricula, created_at, updated_at FROM members WHERE name ILIKE \'%Ana Paula%\''
    );

    if (result.rows.length === 0) {
      console.log('❌ Ana Paula não encontrada');
      await pool.end();
      return;
    }

    const member = result.rows[0];
    console.log(`📋 Nome: ${member.name}`);
    console.log(`🏷️  Matrícula no banco: ${member.matricula || '(VAZIO)'}`);
    console.log(`📅 Criado em: ${member.created_at}`);
    console.log(`📅 Atualizado em: ${member.updated_at}`);
    console.log(`🆔 ID: ${member.id}\n`);

    // Verificar todos os membros ordenados
    console.log('📋 Todos os membros ordenados por matrícula:');
    const allMembers = await pool.query(
      'SELECT name, matricula FROM members ORDER BY matricula'
    );

    allMembers.rows.forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.name}: ${m.matricula || '(VAZIO)'}`);
    });

    console.log('\n=== Verificação Concluída ===');
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkAnaPaulaMatricula();
