-- =====================================================
-- LGPD MODULE - POLICIES AND CONSENTS
-- =====================================================

-- Privacy Policies
CREATE TABLE IF NOT EXISTS lgpd_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    version VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(unit_id, version)
);

-- Consent Logs
CREATE TABLE IF NOT EXISTS lgpd_consent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id),
    employee_id UUID REFERENCES employees(id),
    policy_id UUID NOT NULL REFERENCES lgpd_policies(id),
    consent_type VARCHAR(50) NOT NULL, -- DATA_PROCESSING, COMMUNICATION, etc.
    granted BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for LGPD
CREATE INDEX IF NOT EXISTS idx_lgpd_policies_unit_active ON lgpd_policies(unit_id, is_active);
CREATE INDEX IF NOT EXISTS idx_lgpd_consent_member ON lgpd_consent_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_lgpd_consent_employee ON lgpd_consent_logs(employee_id);

-- Insert a default policy for existing units
INSERT INTO lgpd_policies (unit_id, version, title, content)
SELECT id, '1.0', 'Política de Privacidade Padrão', 'Esta é a política de privacidade padrão para tratamento de dados pessoais da igreja.'
FROM units
ON CONFLICT DO NOTHING;
