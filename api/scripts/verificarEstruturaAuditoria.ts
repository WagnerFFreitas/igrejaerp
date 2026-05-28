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

async function checkAuditTableStructure() {
  try {
    console.log('=== Verificando estrutura da tabela app_audit_logs ===\n');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'app_audit_logs' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('Colunas da tabela:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.column_name} (${row.data_type}) - Nullable: ${row.is_nullable} - Default: ${row.column_default}`);
    });
    
    // Testar consulta sem ordenar por criado
    console.log('\n=== Testando consulta sem ordenar por criado ===');
    const result2 = await pool.query(`
      SELECT id, nome_usuario, action, entidade, data_evento
      FROM app_audit_logs
      WHERE unit_id = $1
      ORDER BY data_evento DESC
      LIMIT 5
    `, ['00000000-0000-0000-0000-000000000001']);
    
    console.log(`\nEncontrados ${result2.rows.length} registros:\n`);
    result2.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.nome_usuario} - ${row.action} - ${row.entidade} - ${row.data_evento}`);
    });
    
  } catch (error: any) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkAuditTableStructure();