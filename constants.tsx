import { Member, Transaction, ChurchEvent, Payroll, FinancialAccount, AuditLog, TaxConfig, Unit, Asset, EmployeeLeave } from './types';

export const MOCK_UNITS: Unit[] = [
  { id: 'u-sede', name: 'ADJPA - Sede Mundial', cnpj: '00.123.456/0001-99', address: 'Rua das Nações, 1000', city: 'São Paulo', state: 'SP', isHeadquarter: true },
  { id: 'u-filial1', name: 'ADJPA - Unidade Leste', cnpj: '00.123.456/0002-88', address: 'Av. Brasil, 500', city: 'São Paulo', state: 'SP', isHeadquarter: false },
];

// Dados Mock adicionados conforme solicitado
export const MOCK_MEMBERS: Member[] = [
  { id: 'm1', matricula: 'M01/2026', name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 98765-4321', birthDate: '1985-04-12', membershipDate: '2020-01-15', status: 'ACTIVE', role: 'MEMBER', address: { zipCode: '00000-000', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }, unitId: 'u-sede', gender: 'M', maritalStatus: 'SINGLE', isTithable: false, isRegularGiver: false, participatesCampaigns: false, contributions: [], avatar: '', cpf: '111.111.111-11', rg: '11111111' },
  { id: 'm2', matricula: 'M02/2026', name: 'Maria Oliveira', email: 'maria.o@email.com', phone: '(11) 91234-5678', birthDate: '1990-08-25', membershipDate: '2019-11-20', status: 'ACTIVE', role: 'LEADER', address: { zipCode: '00000-000', street: 'Av. Principal', number: '456', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }, unitId: 'u-sede', gender: 'F', maritalStatus: 'MARRIED', isTithable: false, isRegularGiver: false, participatesCampaigns: false, contributions: [], avatar: '', cpf: '222.222.222-22', rg: '22222222' },
  { id: 'm3', matricula: 'M03/2026', name: 'Pedro Santos', email: 'pedro.santos@email.com', phone: '(11) 99988-7766', birthDate: '1978-02-10', membershipDate: '2015-05-10', status: 'ACTIVE', role: 'VOLUNTEER', address: { zipCode: '00000-000', street: 'Rua do Bosque', number: '789', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }, unitId: 'u-sede', gender: 'M', maritalStatus: 'MARRIED', isTithable: false, isRegularGiver: false, participatesCampaigns: false, contributions: [], avatar: '', cpf: '333.333.333-33', rg: '33333333' },
  { id: 'm4', matricula: 'M04/2026', name: 'Ana Costa', email: 'ana.costa@email.com', phone: '(11) 97766-5544', birthDate: '1995-12-05', membershipDate: '2022-03-01', status: 'ACTIVE', role: 'MEMBER', address: { zipCode: '00000-000', street: 'Travessa da Paz', number: '321', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }, unitId: 'u-sede', gender: 'F', maritalStatus: 'SINGLE', isTithable: false, isRegularGiver: false, participatesCampaigns: false, contributions: [], avatar: '', cpf: '444.444.444-44', rg: '44444444' },
  { id: 'm5', matricula: 'M05/2026', name: 'Lucas Pereira', email: 'lucas.p@email.com', phone: '(11) 96655-4433', birthDate: '1988-07-18', membershipDate: '2018-09-12', status: 'INACTIVE', role: 'MEMBER', address: { zipCode: '00000-000', street: 'Rua Nova', number: '654', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }, unitId: 'u-sede', gender: 'M', maritalStatus: 'SINGLE', isTithable: false, isRegularGiver: false, participatesCampaigns: false, contributions: [], avatar: '', cpf: '555.555.555-55', rg: '55555555' },
  { id: 'm6', matricula: 'M06/2026', name: 'Juliana Lima', email: 'juliana.lima@email.com', phone: '(11) 95544-3322', birthDate: '1992-03-30', membershipDate: '2021-06-25', status: 'ACTIVE', role: 'MEMBER', address: { zipCode: '00000-000', street: 'Av. Central', number: '987', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }, unitId: 'u-sede', gender: 'F', maritalStatus: 'SINGLE', isTithable: false, isRegularGiver: false, participatesCampaigns: false, contributions: [], avatar: '', cpf: '666.666.666-66', rg: '66666666' }
];

export const MOCK_ACCOUNTS: FinancialAccount[] = [
  {
    id: 'a1',
    name: 'Caixa Principal',
    type: 'CASH',
    currentBalance: 5000,
    minimumBalance: 1000,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a2',
    name: 'Banco do Brasil - Conta Corrente',
    type: 'BANK',
    currentBalance: 25000,
    minimumBalance: 5000,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a3',
    name: 'Itaú - Conta Corrente',
    type: 'BANK',
    currentBalance: 18000,
    minimumBalance: 3000,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a4',
    name: 'Caixa - Unidade Leste',
    type: 'CASH',
    currentBalance: 2000,
    minimumBalance: 500,
    status: 'ACTIVE',
    unitId: 'u-filial1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a5',
    name: 'Caixa Econômica Federal - Poupança',
    type: 'SAVINGS',
    currentBalance: 35000,
    minimumBalance: 10000,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a6',
    name: 'Bradesco - Conta Corrente',
    type: 'BANK',
    currentBalance: 12000,
    minimumBalance: 2000,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a7',
    name: 'Santander - Conta Corrente',
    type: 'BANK',
    currentBalance: 15000,
    minimumBalance: 2500,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a8',
    name: 'Banco Inter - Conta Digital',
    type: 'BANK',
    currentBalance: 8000,
    minimumBalance: 1000,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a9',
    name: 'NuBank - Conta Corrente',
    type: 'BANK',
    currentBalance: 9000,
    minimumBalance: 1500,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'a10',
    name: 'XP Investimentos - CDB',
    type: 'INVESTMENT',
    currentBalance: 45000,
    minimumBalance: 0,
    status: 'ACTIVE',
    unitId: 'u-sede',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  }
];
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', description: 'Dízimo: João Silva', amount: 1500, date: '2026-03-01', competencyDate: '2026-03-01', type: 'INCOME', category: 'Dizimo', operationNature: 'nat6', costCenter: 'cc1', projectId: 'proj1', accountId: 'a1', status: 'PAID', unitId: 'u-sede', paymentMethod: 'PIX', memberId: 'm1' },
  { id: 't2', description: 'Dízimo: Maria Oliveira', amount: 2000, date: '2026-03-05', competencyDate: '2026-03-05', type: 'INCOME', category: 'Dizimo', operationNature: 'nat6', costCenter: 'cc1', projectId: 'proj1', accountId: 'a1', status: 'PAID', unitId: 'u-sede', paymentMethod: 'PIX', memberId: 'm2' },
  { id: 't3', description: 'Conta de Luz', amount: 500, date: '2026-03-10', competencyDate: '2026-03-10', type: 'EXPENSE', category: 'Despesa', operationNature: 'nat9', costCenter: 'cc11', projectId: 'proj1', accountId: 'a1', status: 'PAID', unitId: 'u-sede', paymentMethod: 'TRANSFER' },
  { id: 't4', description: 'Manutenção Ar Condicionado', amount: 300, date: '2026-03-12', competencyDate: '2026-03-12', type: 'EXPENSE', category: 'Despesa', operationNature: 'nat9', costCenter: 'cc11', projectId: 'proj1', accountId: 'a1', status: 'PAID', unitId: 'u-sede', paymentMethod: 'TRANSFER' }
];
export const MOCK_AUDIT: AuditLog[] = [];
export const MOCK_EVENTS: ChurchEvent[] = [];
export const MOCK_ASSETS: Asset[] = [];
export const MOCK_LEAVES: EmployeeLeave[] = [];

export const DEFAULT_TAX_CONFIG: TaxConfig = {
  inssBrackets: [
    { limit: 1412.00, rate: 0.075 },
    { limit: 2666.68, rate: 0.090 },
    { limit: 4000.03, rate: 0.120 },
    { limit: 7786.02, rate: 0.140 },
    { limit: Infinity, rate: 0.140 }
  ],
  irrfBrackets: [
    { limit: 2259.20, rate: 0.000, deduction: 0.00 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.150, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 }
  ],
  fgtsRate: 0.08,
  defaultVA: 0,
  defaultVR: 0,
  thirdPartyEntities: {
    sindicatoRate: 0.02,
    confederacaoRate: 0.0111,
    sistemaS: 0.0075,
    senai: 0.01,
    senac: 0.01,
    sesi: 0.015,
    sebrae: 0.006,
    incra: 0.022,
    terceirosRate: 0.058
  }
};

export const CHURCH_PROJECTS = [
  { id: 'proj1', name: 'Construção Templo', description: 'Projeto de construção do novo templo' },
  { id: 'proj2', name: 'Missões Mundiais', description: 'Suporte a missionários no campo' },
  { id: 'proj3', name: 'Ação Social', description: 'Programas de assistência social' },
  { id: 'proj4', name: 'Educação Teológica', description: 'Cursos e formação teológica' },
  { id: 'proj5', name: 'Comunicação', description: 'Rádio, TV e mídias sociais' },
  { id: 'proj6', name: 'Juventude', description: 'Eventos e programas para jovens' },
  { id: 'proj7', name: 'Educação Teológica', description: 'Cursos e formação teológica' }
];

export const OPERATION_NATURES = [
  { id: 'nat1', name: 'Vendas de Serviços', tax: 0.09 },
  { id: 'nat2', name: 'Vendas de Mercadorias', tax: 0.12 },
  { id: 'nat3', name: 'Receitas Financeiras', tax: 0.04 },
  { id: 'nat4', name: 'Outras Receitas', tax: 0.06 },
  { id: 'nat5', name: 'Compras de Material', tax: 0.15 },
  { id: 'nat6', name: 'Dízimos e Ofertas', tax: 0.00 },
  { id: 'nat7', name: 'Despesas Administrativas', tax: 0.10 },
  { id: 'nat8', name: 'Despesas com Pessoal', tax: 0.20 },
  { id: 'nat9', name: 'Despesas de Manutenção', tax: 0.12 },
  { id: 'nat10', name: 'Investimentos', tax: 0.08 },
  { id: 'nat11', name: 'Doações Recebidas', tax: 0.00 },
  { id: 'nat12', name: 'Outras Despesas', tax: 0.16 }
];

export const COST_CENTERS = [
  { id: 'cc1', name: 'Administração Geral', description: 'Despesas administrativas da igreja' },
  { id: 'cc2', name: 'Missões e Evangelismo', description: 'Atividades missionárias e evangelísticas' },
  { id: 'cc3', name: 'Educação Cristã', description: 'EBD, escolas dominicais e cursos' },
  { id: 'cc4', name: 'Ação Social', description: 'Programas assistenciais e sociais' },
  { id: 'cc5', name: 'Louvor e Adoração', description: 'Ministério de música e louvor' },
  { id: 'cc6', name: 'Juventude e Adolescentes', description: 'Ministérios jovens e adolescentes' },
  { id: 'cc7', name: 'Infância', description: 'Ministério com crianças' },
  { id: 'cc8', name: 'Mulheres', description: 'Ministério feminino' },
  { id: 'cc9', name: 'Homens', description: 'Ministério masculino' },
  { id: 'cc10', name: 'Família', description: 'Programas para famílias' },
  { id: 'cc11', name: 'Construção e Manutenção', description: 'Obras e manutenção do templo' },
  { id: 'cc12', name: 'Comunicação', description: 'Mídia, marketing e comunicação' },
  { id: 'cc13', name: 'Eventos Especiais', description: 'Conferências, congressos e eventos' },
  { id: 'cc14', name: 'Transporte', description: 'Veículos e transporte' },
  { id: 'cc15', name: 'Tecnologia', description: 'Sistemas e equipamentos de TI' }
];

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];