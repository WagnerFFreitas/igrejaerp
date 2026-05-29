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

async function renameColumns() {
  try {
    console.log('=== Renomeando colunas para padronização ===\n');
    
    const renames = [
      // account_balances
      { table: 'account_balances', old: 'conta_id', new: 'id_conta' },
      
      // audit_logs
      { table: 'audit_logs', old: 'entidade_id', new: 'id_entidade' },
      
      // bank_reconciliations
      { table: 'bank_reconciliations', old: 'data_fim', new: 'data_final' },
      
      // cash_closings
      { table: 'cash_closings', old: 'conta_id', new: 'id_conta' },
      
      // dependents
      { table: 'dependents', old: 'membro_id', new: 'id_membro' },
      
      // employee_dependents
      { table: 'employee_dependents', old: 'funcionario_id', new: 'id_funcionario' },
      
      // employee_leaves
      { table: 'employee_leaves', old: 'funcionario_id', new: 'id_funcionario' },
      { table: 'employee_leaves', old: 'data_fim', new: 'data_final' },
      
      // employees
      { table: 'employees', old: 'profile_data', new: 'dados_perfil' },
      
      // events
      { table: 'events', old: 'data_fim', new: 'data_final' },
      
      // lgpd_consent_logs
      { table: 'lgpd_consent_logs', old: 'membro_id', new: 'id_membro' },
      { table: 'lgpd_consent_logs', old: 'funcionario_id', new: 'id_funcionario' },
      
      // member_contributions
      { table: 'member_contributions', old: 'membro_id', new: 'id_membro' },
      
      // member_dependents
      { table: 'member_dependents', old: 'membro_id', new: 'id_membro' },
      
      // membros
      { table: 'membros', old: 'eh_dizimista', new: 'dizimista' },
      { table: 'membros', old: 'profile_data', new: 'dados_perfil' },
      { table: 'membros', old: 'eh_dizimista', new: 'dizimista' },
      { table: 'membros', old: 'profile_data', new: 'dados_perfil' },
      
      // payroll
      { table: 'payroll', old: 'funcionario_id', new: 'id_funcionario' },
      
      // payroll_calculations
      { table: 'payroll_calculations', old: 'funcionario_id', new: 'id_funcionario' },
      
      // payroll_periods
      { table: 'payroll_periods', old: 'unidade_id', new: 'id_unidade' },
      { table: 'payroll_periods', old: 'data_fim', new: 'data_final' },
      
      // pdi_plans
      { table: 'pdi_plans', old: 'funcionario_id', new: 'id_funcionario' },
      
      // performance_evaluations
      { table: 'performance_evaluations', old: 'funcionario_id', new: 'id_funcionario' },
      
      // system_logs
      { table: 'system_logs', old: 'unidade_id', new: 'id_unidade' },
      
      // transactions
      { table: 'transactions', old: 'conta_id', new: 'id_conta' },
      { table: 'transactions', old: 'membro_id', new: 'id_membro' },
      { table: 'transactions', old: 'pai_id', new: 'id_transacao_origem' },
      
      // treasury_alerts
      { table: 'treasury_alerts', old: 'unidade_id', new: 'id_unidade' },
      { table: 'treasury_alerts', old: 'conta_id', new: 'id_conta' },
      
      // treasury_cash_flows
      { table: 'treasury_cash_flows', old: 'unidade_id', new: 'id_unidade' },
      { table: 'treasury_cash_flows', old: 'conta_id', new: 'id_conta' },
      
      // treasury_forecasts
      { table: 'treasury_forecasts', old: 'data_fim', new: 'data_final' },
      
      // users
      { table: 'users', old: 'funcionario_id', new: 'id_funcionario' },
      { table: 'users', old: 'membro_id', new: 'id_membro' },
      
      // unit_id -> id_unidade
      { table: 'users', old: 'unit_id', new: 'id_unidade' },
      { table: 'app_audit_logs', old: 'unit_id', new: 'id_unidade' },
      { table: 'accounts', old: 'unit_id', new: 'id_unidade' },
      { table: 'transactions', old: 'unit_id', new: 'id_unidade' },
      { table: 'employees', old: 'unit_id', new: 'id_unidade' },
      { table: 'members', old: 'unit_id', new: 'id_unidade' },
      { table: 'payroll_periods', old: 'unit_id', new: 'id_unidade' },
      { table: 'system_logs', old: 'unit_id', new: 'id_unidade' },
      { table: 'treasury_alerts', old: 'unit_id', new: 'id_unidade' },
      { table: 'treasury_cash_flows', old: 'unit_id', new: 'id_unidade' },
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const { table, old, new: newName } of renames) {
      try {
        // Verificar se a coluna antiga existe
        const check = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = $1 
          AND column_name = $2 
          AND table_schema = 'public'
        `, [table, old]);

        if (check.rows.length === 0) {
          console.log(`⚠️  ${table}.${old} - coluna não encontrada (pode já ter sido renomeada)`);
          continue;
        }

        // Verificar se a coluna nova já existe
        const checkNew = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = $1 
          AND column_name = $2 
          AND table_schema = 'public'
        `, [table, newName]);

        if (checkNew.rows.length > 0) {
          console.log(`⚠️  ${table}.${newName} - coluna já existe`);
          continue;
        }

        // Renomear a coluna
        await pool.query(`ALTER TABLE ${table} RENAME COLUMN ${old} TO ${newName}`);
        console.log(`✅ ${table}: ${old} → ${newName}`);
        successCount++;
      } catch (error: any) {
        console.log(`❌ Erro ao renomear ${table}.${old}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n=== Resumo ===`);
    console.log(`✅ ${successCount} colunas renomeadas com sucesso`);
    console.log(`❌ ${errorCount} erros`);
    console.log(`⚠️  ${renames.length - successCount - errorCount} colunas ignoradas (já renomeadas ou não encontradas)`);

  } catch (error: any) {
    console.error('Erro geral:', error.message);
  } finally {
    await pool.end();
  }
}

renameColumns();