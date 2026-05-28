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

async function checkDatabaseNaming() {
  try {
    console.log('=== Verificando padronização de nomenclatura no Banco de Dados ===\n');
    
    // Buscar todas as tabelas
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log(`Encontradas ${tables.rows.length} tabelas:\n`);
    
    const renameMap: Record<string, string> = {
      'criado_em': 'criado',
      'atualizado_em': 'atualizado',
      'eh_dizimista': 'dizimista',
      'eh_parcelado': 'parcelado',
      'data_fim': 'data_final',
      'pode_ler': 'ler',
      'pode_escrever': 'escrever',
      'pode_excluir': 'excluir',
      'pode_administrar': 'administrador',
      'conta_id': 'id_conta',
      'unidade_id': 'id_unidade',
      'profile_data': 'dados_perfil',
      'membro_id': 'id_membro',
      'pai_id': 'id_transacao_origem',
      'funcionario_id': 'id_funcionario',
      'processado_em': 'processado',
      'entidade_id': 'id_entidade'
    };
    
    let totalOldNames = 0;
    
    for (const tableRow of tables.rows) {
      const tableName = tableRow.table_name;
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName]);
      
      // Verificar se há colunas com nomes antigos
      const oldColumns = columns.rows.filter(col => renameMap[col.column_name]);
      
      if (oldColumns.length > 0) {
        console.log(`⚠️  Tabela: ${tableName} - ${oldColumns.length} coluna(s) com nome antigo:`);
        oldColumns.forEach(col => {
          console.log(`   - ${col.column_name} → deveria ser: ${renameMap[col.column_name]}`);
          totalOldNames++;
        });
        console.log('');
      }
    }
    
    if (totalOldNames === 0) {
      console.log('✅ Nenhuma coluna com nome antigo encontrada no banco de dados!');
    } else {
      console.log(`\n⚠️  Total de ${totalOldNames} coluna(s) ainda usando nomenclatura antiga.`);
    }
    
    // Verificar especificamente a tabela users
    console.log('\n=== Verificando tabela users ===');
    const usersColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('Colunas da tabela users:');
    usersColumns.rows.forEach((col, idx) => {
      console.log(`  ${idx + 1}. ${col.column_name}`);
    });
    
    // Verificar tabela app_audit_logs
    console.log('\n=== Verificando tabela app_audit_logs ===');
    const auditColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'app_audit_logs' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('Colunas da tabela app_audit_logs:');
    auditColumns.rows.forEach((col, idx) => {
      console.log(`  ${idx + 1}. ${col.column_name}`);
    });
    
  } catch (error: any) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabaseNaming();