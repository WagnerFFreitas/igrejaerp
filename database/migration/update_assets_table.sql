-- =====================================================
-- EXPANSÃO DA TABELA ASSETS
-- Adição de campos de Endereço, Responsável e Notas
-- =====================================================

-- Adicionar novos valores ao ENUM asset_type se necessário
-- Nota: PostgreSQL não permite ALTER TYPE ADD VALUE dentro de transações em algumas versões, 
-- mas aqui estamos apenas listando as colunas.

ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS address_zip_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS address_street VARCHAR(255),
ADD COLUMN IF NOT EXISTS address_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS address_complement VARCHAR(100),
ADD COLUMN IF NOT EXISTS address_neighborhood VARCHAR(100),
ADD COLUMN IF NOT EXISTS address_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS address_state VARCHAR(2),
ADD COLUMN IF NOT EXISTS responsible_employee_id UUID,
ADD COLUMN IF NOT EXISTS purchase_invoice VARCHAR(100),
ADD COLUMN IF NOT EXISTS warranty_expiry DATE,
ADD COLUMN IF NOT EXISTS maintenance_notes TEXT;

-- Garantir que o status BAIXADO seja aceito (já existe no enum asset_status como 'BAIXADO')
