import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function fixDizimistaColumn() {
  try {
    console.log('=== Corrigindo coluna eh_dizimista na tabela membros ===\n');
    
    // 1. Verificar se ambas as colunas existem
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      AND column_name IN ('eh_dizimista', 'dizimista')
      AND table_schema = 'public'
    `);
    
    console.log('Colunas encontradas:', columns.rows.map(r => r.column_name));
    
    if (columns.rows.length < 2) {
      console.log('⚠️  Uma das colunas não existe. Abortando.');
      return;
    }
    
    // 2. Copiar dados da coluna antiga para a nova (se necessário)
    console.log('\nCopiando dados de eh_dizimista para dizimista...');
    await pool.query(`
      UPDATE membros 
      SET dizimista = eh_dizimista 
      WHERE dizimista IS NULL AND eh_dizimista IS NOT NULL
    `);
    console.log('✅ Dados copiados');
    
    // 3. Verificar e remover constraints da coluna antiga
    console.log('\nVerificando constraints na coluna eh_dizimista...');
    const constraints = await pool.query(`
      SELECT conname, contype
      FROM pg_constraint 
      WHERE conrelid = 'membros'::regclass 
      AND conname LIKE '%dizimista%'
    `);
    
    console.log(`Encontradas ${constraints.rows.length} constraint(s):`);
    constraints.rows.forEach(c => {
      console.log(`  - ${c.conname} (tipo: ${c.contype})`);
    });
    
    // 4. Remover constraints
    for (const constraint of constraints.rows) {
      try {
        await pool.query(`ALTER TABLE membros DROP CONSTRAINT ${constraint.conname}`);
        console.log(`✅ Constraint ${constraint.conname} removida`);
      } catch (error: any) {
        console.log(`❌ Erro ao remover constraint ${constraint.conname}: ${error.message}`);
      }
    }
    
    // 5. Remover a coluna antiga
    console.log('\nRemovendo coluna antiga eh_dizimista...');
    try {
      await pool.query(`ALTER TABLE membros DROP COLUMN eh_dizimista`);
      console.log('✅ Coluna eh_dizimista removida com sucesso!');
    } catch (error: any) {
      console.log(`❌ Erro ao remover coluna: ${error.message}`);
    }
    
    // 6. Verificação final
    console.log('\n=== Verificação final ===');
    const finalCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      AND column_name IN ('eh_dizimista', 'dizimista')
      AND table_schema = 'public'
    `);
    
    console.log('Colunas finais:', finalCheck.rows.map(r => r.column_name));
    
  } catch (error: any) {
    console.error('Erro geral:', error.message);
  } finally {
    await pool.end();
  }
}

fixDizimistaColumn();