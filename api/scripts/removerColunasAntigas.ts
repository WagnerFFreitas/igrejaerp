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

async function dropOldColumns() {
  try {
    console.log('=== Removendo colunas antigas (que já foram renomeadas) ===\n');
    
    const oldColumns = [
      { table: 'employees', column: 'profile_data' },
      { table: 'membros', column: 'eh_dizimista' },
      { table: 'membros', column: 'profile_data' },
    ];

    let droppedCount = 0;

    for (const { table, column } of oldColumns) {
      try {
        // Verificar se a coluna antiga ainda existe
        const check = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = $1 
          AND column_name = $2 
          AND table_schema = 'public'
        `, [table, column]);

        if (check.rows.length === 0) {
          console.log(`⚠️  ${table}.${column} - coluna não encontrada (já removida)`);
          continue;
        }

        // Verificar se a coluna nova existe
        let newColumn = '';
        if (column === 'profile_data') newColumn = 'dados_perfil';
        if (column === 'eh_dizimista') newColumn = 'dizimista';

        const checkNew = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = $1 
          AND column_name = $2 
          AND table_schema = 'public'
        `, [table, newColumn]);

        if (checkNew.rows.length === 0) {
          console.log(`❌ ${table}.${column} - coluna nova ${newColumn} não existe. Abortando remoção.`);
          continue;
        }

        // Remover a coluna antiga
        await pool.query(`ALTER TABLE ${table} DROP COLUMN ${column}`);
        console.log(`✅ ${table}: removida coluna antiga '${column}' (nova '${newColumn}' já existe)`);
        droppedCount++;

      } catch (error: any) {
        console.log(`❌ Erro ao remover ${table}.${column}: ${error.message}`);
      }
    }

    console.log(`\n=== Resumo ===`);
    console.log(`✅ ${droppedCount} colunas antigas removidas`);

  } catch (error: any) {
    console.error('Erro geral:', error.message);
  } finally {
    await pool.end();
  }
}

dropOldColumns();