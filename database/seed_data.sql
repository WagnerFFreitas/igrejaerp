-- Inserir dados iniciais para funcionários
INSERT INTO employees (
    id, 
    unit_id, 
    name, 
    cpf, 
    email, 
    phone, 
    position, 
    department, 
    salary, 
    admission_date, 
    status, 
    created_at, 
    updated_at
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    '00000000-0000-0000-0000-000000000001',
    'João Silva',
    '111.222.333-44',
    'joao@igreja.com',
    '(11) 98765-4321',
    'Pastor',
    'Pastoral',
    5000.00,
    '2020-01-15',
    'ACTIVE',
    '2020-01-15T00:00:00Z',
    '2024-01-01T00:00:00Z'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    '00000000-0000-0000-0000-000000000001',
    'Maria Santos',
    '222.333.444-55',
    'maria@igreja.com',
    '(11) 97654-3210',
    'Secretária',
    'Administrativo',
    2500.00,
    '2021-03-20',
    'ACTIVE',
    '2021-03-20T00:00:00Z',
    '2024-01-01T00:00:00Z'
)
ON CONFLICT (id) DO NOTHING;

-- Inserir dados iniciais para transações financeiras
INSERT INTO transactions (
    id,
    unit_id,
    description,
    amount,
    type,
    status,
    transaction_date,
    category,
    created_at,
    updated_at
) VALUES 
(
    '660e8400-e29b-41d4-a716-446655440001',
    '00000000-0000-0000-0000-000000000001',
    'Dízimos - Janeiro 2024',
    15000.00,
    'INCOME',
    'PAID',
    '2024-01-31',
    'Dízimos',
    '2024-01-31T00:00:00Z',
    '2024-01-31T00:00:00Z'
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '00000000-0000-0000-0000-000000000001',
    'Contas de Luz - Janeiro 2024',
    800.00,
    'EXPENSE',
    'PAID',
    '2024-01-25',
    'Despesas Administrativas',
    '2024-01-25T00:00:00Z',
    '2024-01-25T00:00:00Z'
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    '00000000-0000-0000-0000-000000000001',
    'Ofertas - Culto de Domingo',
    3500.00,
    'INCOME',
    'PAID',
    '2024-01-28',
    'Ofertas',
    '2024-01-28T00:00:00Z',
    '2024-01-28T00:00:00Z'
)
ON CONFLICT (id) DO NOTHING;
