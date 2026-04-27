-- =====================================================
-- MIGRAÇÃO: Avaliações de Desempenho e PDI
-- =====================================================

CREATE TABLE IF NOT EXISTS performance_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    employee_name VARCHAR(255) NOT NULL,
    evaluation_date DATE NOT NULL,
    evaluation_type VARCHAR(50) NOT NULL DEFAULT 'ANNUAL',
    overall_score DECIMAL(5,2) DEFAULT 0,
    overall_rating VARCHAR(30) DEFAULT 'SATISFACTORY',
    competencies JSONB DEFAULT '[]',
    goals JSONB DEFAULT '[]',
    strengths TEXT,
    improvements TEXT,
    action_plan TEXT,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','COMPLETED','APPROVED')),
    evaluated_by VARCHAR(255),
    approved_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pdi_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    employee_name VARCHAR(255) NOT NULL,
    meta TEXT NOT NULL,
    prazo DATE,
    status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE','EM_ANDAMENTO','CONCLUIDO','CANCELADO')),
    observacoes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_performance_evaluations_unit ON performance_evaluations(unit_id);
CREATE INDEX IF NOT EXISTS idx_performance_evaluations_employee ON performance_evaluations(employee_id);
CREATE INDEX IF NOT EXISTS idx_pdi_plans_unit ON pdi_plans(unit_id);
CREATE INDEX IF NOT EXISTS idx_pdi_plans_employee ON pdi_plans(employee_id);
