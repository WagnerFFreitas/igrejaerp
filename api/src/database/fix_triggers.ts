
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Carregar configuração (executando da pasta api)
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: String(process.env.DB_PASSWORD || ''),
});

const sql = `
-- Nova função robusta
CREATE OR REPLACE FUNCTION atualizar_timestamp_alteracao()
RETURNS TRIGGER AS $$
BEGIN
    BEGIN
        NEW.atualizado = CURRENT_TIMESTAMP;
    EXCEPTION WHEN undefined_column THEN
        BEGIN
            NEW.atualizado = CURRENT_TIMESTAMP;
        EXCEPTION WHEN undefined_column THEN
        END;
    END;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função utilitária para recriar gatilho com segurança
DO $$
DECLARE
    t_name TEXT;
    tables TEXT[] := ARRAY['membros', 'units', 'users', 'employees', 'transactions', 'church_events', 'assets', 'financial_accounts'];
BEGIN
    FOREACH t_name IN ARRAY tables LOOP
        -- Remove gatilhos antigos (vários nomes possíveis)
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_atualizado ON %I', t_name, t_name);
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_timestamp ON %I', t_name, t_name);
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_atualizado ON %I', t_name, t_name);
        
        -- Cria o novo gatilho padrão
        EXECUTE format('CREATE TRIGGER update_%I_timestamp BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_alteracao()', t_name, t_name);
    END LOOP;
END $$;
`;

async function main() {
  const client = await pool.connect();
  try {
    console.log('Aplicando correções de gatilhos em todas as tabelas...');
    await client.query(sql);
    console.log('✅ Todos os gatilhos foram atualizados com sucesso.');
  } catch (err) {
    console.error('❌ Erro ao aplicar gatilhos:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
