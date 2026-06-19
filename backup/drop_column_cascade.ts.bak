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

async function dropColumnCascade() {
  try {
    console.log('=== Removendo coluna eh_dizimista com CASCADE ===\n');
    
    // Verificar se a coluna ainda existe
    const check = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      AND column_name = 'eh_dizimista'
      AND table_schema = 'public'
    `);
    
    if (check.rows.length === 0) {
      console.log('⚠️  Coluna eh_dizimista não encontrada (já removida)');
      return;
    }
    
    // Tentar remover com CASCADE
    try {
      await pool.query(`ALTER TABLE membros DROP COLUMN eh_dizimista CASCADE`);
      console.log('✅ Coluna eh_dizimista removida com sucesso!');
    } catch (error: any) {
      console.log(`❌ Erro ao remover com CASCADE: ${error.message}`);
      
      // Se falhar, tentar identificar o que está bloqueando
      console.log('\nVerificando dependências...');
      const deps = await pool.query(`
        SELECT pg_get_viewdef(c.oid, true) as view_def
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname LIKE '%membros%'
        AND c.relkind = 'v'
      `);
      
      if (deps.rows.length > 0) {
        console.log('Views encontradas:');
        deps.rows.forEach(v => {
          console.log(`  - ${v.view_def?.substring(0, 200)}...`);
        });
      }
    }
    
    // Verificação final
    const finalCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      AND column_name IN ('eh_dizimista', 'dizimista')
      AND table_schema = 'public'
    `);
    
    console.log('\n=== Verificação final ===');
    console.log('Colunas encontradas:', finalCheck.rows.map(r => r.column_name));
    
  } catch (error: any) {
    console.error('Erro geral:', error.message);
  } finally {
    await pool.end();
  }
}

dropColumnCascade();