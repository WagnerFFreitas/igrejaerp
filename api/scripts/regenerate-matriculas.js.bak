require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function regenerateMatriculas() {
  try {
    console.log('=== Regenerando Matrículas dos Membros ===\n');

    const currentYear = new Date().getFullYear();
    
    // Buscar todos os membros ordenados por data de criação
    const result = await pool.query(
      'SELECT id, name, matricula, created_at FROM members ORDER BY created_at ASC'
    );

    console.log(`📋 Total de membros: ${result.rows.length}\n`);

    let updatedCount = 0;
    let matriculaNumber = 1;

    for (const member of result.rows) {
      // Se já tem matrícula, mantém
      if (member.matricula && member.matricula.trim() !== '') {
        console.log(`✅ ${member.name}: ${member.matricula} (já possui)`);
        continue;
      }

      // Gerar nova matrícula no formato M01/2026, M02/2026, etc.
      const newMatricula = `M${matriculaNumber.toString().padStart(2, '0')}/${currentYear}`;
      
      await pool.query(
        'UPDATE members SET matricula = $1, updated_at = NOW() WHERE id = $2',
        [newMatricula, member.id]
      );

      console.log(`🔄 ${member.name}: ${newMatricula} (gerada)`);
      matriculaNumber++;
      updatedCount++;
    }

    console.log(`\n✅ ${updatedCount} matrícula(s) gerada(s)`);

    // Verificar resultado final
    const verifyResult = await pool.query(
      'SELECT COUNT(*) as total, COUNT(matricula) as with_matricula FROM members'
    );
    
    console.log(`\n📊 Resumo:`);
    console.log(`   Total de membros: ${verifyResult.rows[0].total}`);
    console.log(`   Com matrícula: ${verifyResult.rows[0].with_matricula}`);
    console.log(`   Sem matrícula: ${verifyResult.rows[0].total - verifyResult.rows[0].with_matricula}`);

    console.log('\n=== Regeneração Concluída ===');
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

regenerateMatriculas();
