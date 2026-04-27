-- =====================================================
-- MIGRAÇÃO: Tesouraria e Conciliação Bancária
-- =====================================================

-- Fluxo de Caixa (Tesouraria)
CREATE TABLE IF NOT EXISTS treasury_cash_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    data DATE NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('RECEITA','DESPESA','TRANSFERENCIA')),
    valor DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA')),
    conta_id UUID REFERENCES financial_accounts(id),
    status VARCHAR(20) DEFAULT 'REALIZADO' CHECK (status IN ('PREVISTO','REALIZADO','CANCELADO')),
    observacoes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projeções de Fluxo de Caixa
CREATE TABLE IF NOT EXISTS treasury_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('SEMANAL','MENSAL','TRIMESTRAL','ANUAL')),
    saldo_inicial DECIMAL(15,2) DEFAULT 0,
    entradas_previstas DECIMAL(15,2) DEFAULT 0,
    saidas_previstas DECIMAL(15,2) DEFAULT 0,
    saldo_final_previsto DECIMAL(15,2) DEFAULT 0,
    entradas_realizadas DECIMAL(15,2) DEFAULT 0,
    saidas_realizadas DECIMAL(15,2) DEFAULT 0,
    saldo_final_real DECIMAL(15,2) DEFAULT 0,
    precisao DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'EM_ANDAMENTO' CHECK (status IN ('EM_ANDAMENTO','CONCLUIDO','CANCELADO')),
    detalhes JSONB DEFAULT '[]',
    criado_por VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Investimentos
CREATE TABLE IF NOT EXISTS treasury_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    instituicao VARCHAR(255) NOT NULL,
    data_aplicacao DATE NOT NULL,
    data_vencimento DATE,
    valor_aplicado DECIMAL(15,2) NOT NULL,
    valor_atual DECIMAL(15,2) NOT NULL,
    rentabilidade_anual DECIMAL(8,4) DEFAULT 0,
    indexador VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO','RESGATADO','VENCIDO')),
    observacoes TEXT,
    rendimentos JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Empréstimos
CREATE TABLE IF NOT EXISTS treasury_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    nome VARCHAR(255) NOT NULL,
    credor VARCHAR(255) NOT NULL,
    data_contratacao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    valor_original DECIMAL(15,2) NOT NULL,
    valor_saldo DECIMAL(15,2) NOT NULL,
    taxa_juros DECIMAL(8,4) NOT NULL,
    tipo_juros VARCHAR(20) DEFAULT 'MENSAL' CHECK (tipo_juros IN ('MENSAL','ANUAL')),
    total_parcelas INTEGER NOT NULL,
    parcelas_pagas INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO','QUITADO','INADIMPLENTE','RENEGOCIADO')),
    parcelas JSONB DEFAULT '[]',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alertas de Tesouraria
CREATE TABLE IF NOT EXISTS treasury_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    gravidade VARCHAR(20) NOT NULL CHECK (gravidade IN ('BAIXA','MEDIA','ALTA','CRITICA')),
    conta_id UUID REFERENCES financial_accounts(id),
    investimento_id UUID REFERENCES treasury_investments(id),
    emprestimo_id UUID REFERENCES treasury_loans(id),
    valor DECIMAL(15,2),
    data_limite DATE,
    status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO','RESOLVIDO','IGNORADO')),
    acoes_sugeridas JSONB DEFAULT '[]',
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posições Financeiras
CREATE TABLE IF NOT EXISTS treasury_financial_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    data DATE NOT NULL,
    ativo_total DECIMAL(15,2) DEFAULT 0,
    passivo_total DECIMAL(15,2) DEFAULT 0,
    patrimonio_liquido DECIMAL(15,2) DEFAULT 0,
    disponibilidades DECIMAL(15,2) DEFAULT 0,
    aplicacoes DECIMAL(15,2) DEFAULT 0,
    contas_receber DECIMAL(15,2) DEFAULT 0,
    estoques DECIMAL(15,2) DEFAULT 0,
    ativo_fixo DECIMAL(15,2) DEFAULT 0,
    fornecedores DECIMAL(15,2) DEFAULT 0,
    emprestimos DECIMAL(15,2) DEFAULT 0,
    outras_contas DECIMAL(15,2) DEFAULT 0,
    variacao_patrimonial DECIMAL(15,2) DEFAULT 0,
    variacao_percentual DECIMAL(8,4) DEFAULT 0,
    indicadores JSONB DEFAULT '{}',
    detalhamento JSONB DEFAULT '[]',
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conciliações Bancárias
CREATE TABLE IF NOT EXISTS bank_reconciliations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    bank_account_id UUID REFERENCES financial_accounts(id),
    bank_account_name VARCHAR(255),
    bank_name VARCHAR(255),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    saldo_inicial DECIMAL(15,2) DEFAULT 0,
    saldo_final DECIMAL(15,2) DEFAULT 0,
    saldo_conciliado DECIMAL(15,2) DEFAULT 0,
    diferenca DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS','COMPLETED','CANCELLED')),
    percentual_conciliacao DECIMAL(5,2) DEFAULT 0,
    total_transacoes_banco INTEGER DEFAULT 0,
    total_transacoes_sistema INTEGER DEFAULT 0,
    transacoes_conciliadas INTEGER DEFAULT 0,
    transacoes_nao_conciliadas INTEGER DEFAULT 0,
    divergencias JSONB DEFAULT '[]',
    conciliado_por VARCHAR(255),
    data_conciliacao TIMESTAMP WITH TIME ZONE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transações Bancárias (extrato importado)
CREATE TABLE IF NOT EXISTS bank_statement_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id),
    reconciliation_id UUID REFERENCES bank_reconciliations(id),
    bank_account_id UUID REFERENCES financial_accounts(id),
    data_transacao DATE NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('CREDIT','DEBIT')),
    metodo_pagamento VARCHAR(50),
    status_conciliacao VARCHAR(20) DEFAULT 'PENDING' CHECK (status_conciliacao IN ('PENDING','MATCHED','UNMATCHED','IGNORED')),
    transaction_id UUID REFERENCES transactions(id),
    origem VARCHAR(50) DEFAULT 'BANK_STATEMENT',
    external_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_treasury_cash_flows_unit ON treasury_cash_flows(unit_id);
CREATE INDEX IF NOT EXISTS idx_treasury_cash_flows_data ON treasury_cash_flows(data);
CREATE INDEX IF NOT EXISTS idx_treasury_investments_unit ON treasury_investments(unit_id);
CREATE INDEX IF NOT EXISTS idx_treasury_loans_unit ON treasury_loans(unit_id);
CREATE INDEX IF NOT EXISTS idx_treasury_alerts_unit ON treasury_alerts(unit_id);
CREATE INDEX IF NOT EXISTS idx_bank_reconciliations_unit ON bank_reconciliations(unit_id);
CREATE INDEX IF NOT EXISTS idx_bank_statement_transactions_unit ON bank_statement_transactions(unit_id);
CREATE INDEX IF NOT EXISTS idx_bank_statement_transactions_reconciliation ON bank_statement_transactions(reconciliation_id);
