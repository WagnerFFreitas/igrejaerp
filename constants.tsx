import { Member, Transaction, ChurchEvent, Payroll, FinancialAccount, AuditLog, TaxConfig, Unit, Asset, EmployeeLeave } from './types';

export const MOCK_UNITS: Unit[] = [
  { id: 'u-sede', name: 'ADJPA - Sede Mundial', cnpj: '00.123.456/0001-99', address: 'Rua das Nações, 1000', city: 'São Paulo', state: 'SP', isHeadquarter: true },
  { id: 'u-filial1', name: 'ADJPA - Unidade Leste', cnpj: '00.123.456/0002-88', address: 'Av. Brasil, 500', city: 'São Paulo', state: 'SP', isHeadquarter: false },
];

// Dados Mock removidos para teste de salvamento manual
export const MOCK_MEMBERS: Member[] = [];
export const MOCK_PAYROLL: Payroll[] = [];
export const MOCK_ACCOUNTS: FinancialAccount[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
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