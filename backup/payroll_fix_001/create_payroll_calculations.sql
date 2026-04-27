-- Script de restauração da tabela payroll_calculations
-- Use este arquivo para criar a tabela que falta no banco atual.

CREATE TABLE IF NOT EXISTS payroll_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    competency_month VARCHAR(7) NOT NULL,
    gross_salary DECIMAL(15,2) NOT NULL,

    -- Proventos
    base_salary DECIMAL(15,2) NOT NULL,
    overtime DECIMAL(15,2) DEFAULT 0,
    night_shift DECIMAL(15,2) DEFAULT 0,
    hazard_pay DECIMAL(15,2) DEFAULT 0,
    commission DECIMAL(15,2) DEFAULT 0,
    bonuses DECIMAL(15,2) DEFAULT 0,
    family_salary DECIMAL(15,2) DEFAULT 0,
    other_allowances DECIMAL(15,2) DEFAULT 0,

    -- Descontos
    inss DECIMAL(15,2) NOT NULL,
    irrf DECIMAL(15,2) NOT NULL,
    fgts DECIMAL(15,2) NOT NULL,
    union DECIMAL(15,2) DEFAULT 0,
    health_insurance DECIMAL(15,2) DEFAULT 0,
    dental_insurance DECIMAL(15,2) DEFAULT 0,
    meal_allowance DECIMAL(15,2) DEFAULT 0,
    meal_ticket DECIMAL(15,2) DEFAULT 0,
    transport DECIMAL(15,2) DEFAULT 0,
    pharmacy DECIMAL(15,2) DEFAULT 0,
    life_insurance DECIMAL(15,2) DEFAULT 0,
    advance DECIMAL(15,2) DEFAULT 0,
    consignado DECIMAL(15,2) DEFAULT 0,
    coparticipation DECIMAL(15,2) DEFAULT 0,
    absences DECIMAL(15,2) DEFAULT 0,
    delays DECIMAL(15,2) DEFAULT 0,
    alimony DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,

    -- Totais
    total_allowances DECIMAL(15,2) NOT NULL,
    total_deductions DECIMAL(15,2) NOT NULL,
    net_salary DECIMAL(15,2) NOT NULL,
    employer_cost DECIMAL(15,2) NOT NULL,

    -- Detalhes dos cálculos
    inss_base DECIMAL(15,2) NOT NULL,
    inss_rate DECIMAL(5,2) NOT NULL,
    inss_value DECIMAL(15,2) NOT NULL,
    irrf_base DECIMAL(15,2) NOT NULL,
    irrf_rate DECIMAL(5,2) NOT NULL,
    irrf_deduction DECIMAL(15,2) NOT NULL,
    irrf_value DECIMAL(15,2) NOT NULL,
    fgts_base DECIMAL(15,2) NOT NULL,
    fgts_rate DECIMAL(5,2) NOT NULL,
    fgts_value DECIMAL(15,2) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, competency_month)
);

CREATE INDEX IF NOT EXISTS idx_payroll_calculations_employee_id ON payroll_calculations(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_calculations_competency ON payroll_calculations(competency_month);
