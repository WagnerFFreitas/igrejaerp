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

async function checkSpecificColumns() {
  try {
    console.log('=== Verificando colunas específicas ===\n');
    
    // Verificar employees.profile_data
    const empProfile = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'employees' 
      AND column_name IN ('profile_data', 'dados_perfil')
      AND table_schema = 'public'
    `);
    
    console.log('Tabela employees - colunas profile_data/dados_perfil:');
    if (empProfile.rows.length === 0) {
      console.log('  ❌ Nenhuma das duas encontradas');
    } else {
      empProfile.rows.forEach(row => console.log(`  ✅ ${row.column_name}`));
    }
    
    // Verificar membros.eh_dizimista
    const memDizimista = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      AND column_name IN ('eh_dizimista', 'dizimista')
      AND table_schema = 'public'
    `);
    
    console.log('\nTabela membros - colunas eh_dizimista/dizimista:');
    if (memDizimista.rows.length === 0) {
      console.log('  ❌ Nenhuma das duas encontradas');
    } else {
      memDizimista.rows.forEach(row => console.log(`  ✅ ${row.column_name}`));
    }
    
    // Verificar membros.profile_data
    const memProfile = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      AND column_name IN ('profile_data', 'dados_perfil')
      AND table_schema = 'public'
    `);
    
    console.log('\nTabela membros - colunas profile_data/dados_perfil:');
    if (memProfile.rows.length === 0) {
      console.log('  ❌ Nenhuma das duas encontradas');
    } else {
      memProfile.rows.forEach(row => console.log(`  ✅ ${row.column_name}`));
    }
    
  } catch (error: any) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkSpecificColumns();