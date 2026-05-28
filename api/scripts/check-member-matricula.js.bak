require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function checkMemberMatricula() {
  try {
    console.log('=== Verificando Matrícula dos Membros ===\n');

    // Buscar todos os membros com suas matrículas
    const result = await pool.query(
      'SELECT id, name, matricula, created_at, updated_at FROM members ORDER BY matricula'
    );

    console.log(`📋 Total de membros: ${result.rows.length}\n`);
    
    result.rows.forEach((m, i) => {
      console.log(`${i + 1}. ${m.name}`);
      console.log(`   Matrícula: ${m.matricula || '(VAZIO)'}`);
      console.log(`   Atualizado em: ${m.updated_at}\n`);
    });

    // Verificar se há membros sem matrícula
    const semMatricula = result.rows.filter(m => !m.matricula || m.matricula === '');
    if (semMatricula.length > 0) {
      console.log(`\n⚠️  ${semMatricula.length} membro(s) sem matrícula:`);
      semMatricula.forEach(m => {
        console.log(`   - ${m.name} (ID: ${m.id})`);
      });
    }

    console.log('\n=== Verificação Concluída ===');
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkMemberMatricula();
