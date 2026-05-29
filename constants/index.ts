/**
 * ============================================================================
 * INDEX.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a index.
 *
 * ONDE É USADO?
 * -------------
 * Parte do projeto usada em runtime ou build.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

// Constants temporários para compatibilidade
/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (index).
 */

export const POPULAR_BANKS = [
  { name: 'Banco do Brasil', code: '001' },
  { name: 'Caixa Econômica', code: '104' },
  { name: 'Bradesco', code: '237' },
  { name: 'Itaú', code: '341' },
  { name: 'Santander', code: '033' }
];

export const ACCOUNT_TYPES = [
  { value: 'CHECKING', label: 'Conta Corrente' },
  { value: 'SAVINGS', label: 'Conta Poupança' },
  { value: 'INVESTMENT', label: 'Conta Investimento' }
];

// =====================================================
// DEFAULT_TAX_CONFIG - Para cálculos de folha
// =====================================================
export const DEFAULT_INSS_BRACKETS = [
  { limit: 1518.0, rate: 0.075, deduction: 0 },
  { limit: 2793.88, rate: 0.09, deduction: 11.38 },
  { limit: 4190.83, rate: 0.12, deduction: 93.92 },
  { limit: 8157.41, rate: 0.14, deduction: 177.49 }
];

export const DEFAULT_IRRF_BRACKETS = [
  { limit: 2259.2, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 896.0 }
];

export const DEFAULT_TAX_CONFIG = {
  inssBrackets: DEFAULT_INSS_BRACKETS,
  irrfBrackets: DEFAULT_IRRF_BRACKETS,
  fgtsRate: 0.08,
  patronalRate: 0.2,
  ratRate: 0.02,
  terceirosRate: 0.058,
  inss: DEFAULT_INSS_BRACKETS,
  irrf: DEFAULT_IRRF_BRACKETS,
  fgts: { rate: 0.08 },
  patronal: { rate: 0.2 }
};

// =====================================================
// COST_CENTERS - Centros de Custo
// =====================================================
export const COST_CENTERS = [
  { id: 'cc1',  name: 'Sede / Matriz' },
  { id: 'cc2',  name: 'Evangelismo' },
  { id: 'cc3',  name: 'Educação / Escola Bíblica' },
  { id: 'cc4',  name: 'Música / Louvor' },
  { id: 'cc5',  name: 'Ação Social' },
  { id: 'cc6',  name: 'Administrativo' },
  { id: 'cc7',  name: 'Manutenção / Obras' },
  { id: 'cc8',  name: 'Missões' },
  { id: 'cc9',  name: 'Juventude' },
  { id: 'cc10', name: 'Infantil' },
];

// =====================================================
// OPERATION_NATURES - Naturezas de Operação
// =====================================================
export const OPERATION_NATURES = [
  { id: 'nat1',  name: 'Receitas de Contribuições (Dízimos/Ofertas)' },
  { id: 'nat2',  name: 'Receitas de Campanhas' },
  { id: 'nat3',  name: 'Receitas de Aluguéis' },
  { id: 'nat4',  name: 'Receitas Diversas' },
  { id: 'nat5',  name: 'Despesas com Pessoal' },
  { id: 'nat6',  name: 'Despesas Administrativas' },
  { id: 'nat7',  name: 'Despesas com Manutenção' },
  { id: 'nat8',  name: 'Despesas com Eventos' },
  { id: 'nat9',  name: 'Despesas com Missões' },
  { id: 'nat10', name: 'Investimentos / Obras' },
  { id: 'nat11', name: 'Transferências entre Contas' },
];

// =====================================================
// CHURCH_PROJECTS - Projetos da Igreja
// =====================================================
export const CHURCH_PROJECTS = [
  { id: 'proj1', name: 'Construção do Templo' },
  { id: 'proj2', name: 'Missões Nacionais' },
  { id: 'proj3', name: 'Missões Internacionais' },
  { id: 'proj4', name: 'Eventos Especiais' },
  { id: 'proj5', name: 'Manutenção Geral' },
  { id: 'proj6', name: 'Ação Social / Assistência' },
];
