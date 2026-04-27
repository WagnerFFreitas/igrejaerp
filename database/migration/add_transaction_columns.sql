-- =====================================================
-- MIGRAÇÃO: Adicionar colunas faltantes em transactions
-- Executar apenas se a tabela já existir sem essas colunas
-- =====================================================

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS competency_date    DATE,
  ADD COLUMN IF NOT EXISTS project_id         UUID,
  ADD COLUMN IF NOT EXISTS paid_amount        DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remaining_amount   DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS is_installment     BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS installment_number INTEGER,
  ADD COLUMN IF NOT EXISTS total_installments INTEGER,
  ADD COLUMN IF NOT EXISTS parent_id          UUID REFERENCES transactions(id),
  ADD COLUMN IF NOT EXISTS conciliation_date  DATE,
  ADD COLUMN IF NOT EXISTS external_id        VARCHAR(100);

-- Preencher competency_date com date onde estiver nulo
UPDATE transactions SET competency_date = date WHERE competency_date IS NULL;

-- Índices úteis para as novas colunas
CREATE INDEX IF NOT EXISTS idx_transactions_parent_id      ON transactions(parent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_is_installment ON transactions(is_installment);
CREATE INDEX IF NOT EXISTS idx_transactions_due_date       ON transactions(due_date);
