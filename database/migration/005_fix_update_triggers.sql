-- =====================================================
-- CORREÇÃO DE TRIGGERS: SUPORTE A NOMES PT/EN
-- =====================================================

-- 1. Criar função de gatilho robusta que verifica a existência da coluna
-- Esta função é superior à anterior pois não quebra se a coluna for renomeada
CREATE OR REPLACE FUNCTION atualizar_timestamp_alteracao()
RETURNS TRIGGER AS $$
BEGIN
    -- Tentativa de atualizar atualizado_em (Padrão PT)
    BEGIN
        NEW.atualizado_em = CURRENT_TIMESTAMP;
    EXCEPTION WHEN undefined_column THEN
        -- Fallback para updated_at (Padrão EN)
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
        EXCEPTION WHEN undefined_column THEN
            -- Caso nenhuma das colunas exista, apenas ignora
        END;
    END;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Atualizar o gatilho da tabela membros para o novo padrão
DROP TRIGGER IF EXISTS update_members_updated_at ON membros;
CREATE TRIGGER update_members_atualizado_em 
BEFORE UPDATE ON membros 
FOR EACH ROW 
EXECUTE FUNCTION atualizar_timestamp_alteracao();

-- 3. Atualizar outras tabelas principais para prevenir erros em migrações futuras
DROP TRIGGER IF EXISTS update_units_updated_at ON units;
CREATE TRIGGER update_units_timestamp BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_alteracao();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_alteracao();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_timestamp BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_alteracao();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_timestamp BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_alteracao();

DROP TRIGGER IF EXISTS update_church_events_updated_at ON church_events;
CREATE TRIGGER update_church_events_timestamp BEFORE UPDATE ON church_events FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_alteracao();

DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
CREATE TRIGGER update_assets_timestamp BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_alteracao();

DROP TRIGGER IF EXISTS update_financial_accounts_updated_at ON financial_accounts;
CREATE TRIGGER update_financial_accounts_timestamp BEFORE UPDATE ON financial_accounts FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp_alteracao();
