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

async function testAuditQuery() {
  try {
    console.log('=== Testando consulta de auditoria ===\n');
    
    // Testar a consulta exata da função listAuditLogs
    const result = await pool.query(`
      SELECT *
      FROM app_audit_logs
      WHERE unit_id = $1
      ORDER BY data_evento DESC, criado DESC
      LIMIT 10
    `, ['00000000-0000-0000-0000-000000000001']);
    
    console.log(`Encontrados ${result.rows.length} registros:\n`);
    
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}`);
      console.log(`   Nome: ${row.nome_usuario}`);
      console.log(`   Ação: ${row.action}`);
      console.log(`   Entidade: ${row.entidade}`);
      console.log(`   Data: ${row.data_evento}`);
      console.log(`   Criado: ${row.criado}`);
      console.log('');
    });
    
  } catch (error: any) {
    console.error('Erro:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await pool.end();
  }
}

testAuditQuery();