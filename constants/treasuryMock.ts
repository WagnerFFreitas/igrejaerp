/**
 * ============================================================================
 * DADOS MOCK PARA TESOURARIA
 * ============================================================================
 * 
 * Dados de demonstração para o sistema de gestão de tesouraria
 */

import { 
  CashFlow, 
  CashFlowForecast, 
  TreasuryAccount, 
  Investment, 
  Loan, 
  TreasuryAlert,
  FinancialPosition 
} from '../types';

// Mock de Fluxo de Caixa
export const MOCK_CASH_FLOWS: CashFlow[] = [
  {
    id: 'cf1',
    data: '2026-03-26',
    descricao: 'Dízimo - João Silva',
    valor: 1500,
    categoria: 'RECEITA',
    tipo: 'DIZIMO',
    contaOrigem: 'a1',
    contaDestino: 'a2',
    status: 'CONFIRMADO',
    unitId: 'u-sede',
    createdAt: '2026-03-26T10:00:00Z',
    updatedAt: '2026-03-26T10:00:00Z'
  },
  {
    id: 'cf2',
    data: '2026-03-26',
    descricao: 'Dízimo - Maria Oliveira',
    valor: 2000,
    categoria: 'RECEITA',
    tipo: 'DIZIMO',
    contaOrigem: 'a1',
    contaDestino: 'a2',
    status: 'CONFIRMADO',
    unitId: 'u-sede',
    createdAt: '2026-03-26T11:00:00Z',
    updatedAt: '2026-03-26T11:00:00Z'
  },
  {
    id: 'cf3',
    data: '2026-03-26',
    descricao: 'Oferta - Culto Noite',
    valor: 800,
    categoria: 'RECEITA',
    tipo: 'OFERTA',
    contaOrigem: 'a1',
    contaDestino: 'a2',
    status: 'CONFIRMADO',
    unitId: 'u-sede',
    createdAt: '2026-03-26T20:00:00Z',
    updatedAt: '2026-03-26T20:00:00Z'
  },
  {
    id: 'cf4',
    data: '2026-03-26',
    descricao: 'Pagamento - Conta de Luz',
    valor: 500,
    categoria: 'DESPESA',
    tipo: 'ENERGIA',
    contaOrigem: 'a2',
    contaDestino: 'a1',
    status: 'CONFIRMADO',
    unitId: 'u-sede',
    createdAt: '2026-03-26T14:00:00Z',
    updatedAt: '2026-03-26T14:00:00Z'
  },
  {
    id: 'cf5',
    data: '2026-03-26',
    descricao: 'Pagamento - Aluguel Templo',
    valor: 5000,
    categoria: 'DESPESA',
    tipo: 'ALUGUEL',
    contaOrigem: 'a2',
    contaDestino: 'a1',
    status: 'PENDENTE',
    unitId: 'u-sede',
    createdAt: '2026-03-26T09:00:00Z',
    updatedAt: '2026-03-26T09:00:00Z'
  },
  {
    id: 'cf6',
    data: '2026-03-26',
    descricao: 'Transferência - Tesouraria para Banco',
    valor: 3000,
    categoria: 'TRANSFERENCIA',
    tipo: 'TRANSFERENCIA_INTERNA',
    contaOrigem: 'a1',
    contaDestino: 'a2',
    status: 'CONFIRMADO',
    unitId: 'u-sede',
    createdAt: '2026-03-26T15:00:00Z',
    updatedAt: '2026-03-26T15:00:00Z'
  },
  {
    id: 'cf7',
    data: '2026-03-25',
    descricao: 'Dízimo - Pedro Santos',
    valor: 1200,
    categoria: 'RECEITA',
    tipo: 'DIZIMO',
    contaOrigem: 'a1',
    contaDestino: 'a2',
    status: 'CONFIRMADO',
    unitId: 'u-sede',
    createdAt: '2026-03-25T10:00:00Z',
    updatedAt: '2026-03-25T10:00:00Z'
  },
  {
    id: 'cf8',
    data: '2026-03-25',
    descricao: 'Compra - Material de Escritório',
    valor: 300,
    categoria: 'DESPESA',
    tipo: 'MATERIAL_ESCRITORIO',
    contaOrigem: 'a2',
    contaDestino: 'a1',
    status: 'CONFIRMADO',
    unitId: 'u-sede',
    createdAt: '2026-03-25T16:00:00Z',
    updatedAt: '2026-03-25T16:00:00Z'
  }
];

// Mock de Contas de Tesouraria
export const MOCK_TREASURY_ACCOUNTS: TreasuryAccount[] = [
  {
    id: 'ta1',
    nome: 'Caixa Principal',
    banco: 'Caixa Físico',
    agencia: '',
    numero: '',
    tipo: 'CAIXA',
    saldo: 5000,
    saldoDisponivel: 5000,
    saldoBloqueado: 0,
    status: 'ATIVA',
    dataAbertura: '2020-01-01',
    dataFechamento: null,
    limite: 0,
    unitId: 'u-sede',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'ta2',
    nome: 'Banco do Brasil - Conta Corrente',
    banco: 'Banco do Brasil',
    agencia: '1234',
    numero: '56789-0',
    tipo: 'CONTA_CORRENTE',
    saldo: 25000,
    saldoDisponivel: 23000,
    saldoBloqueado: 2000,
    status: 'ATIVA',
    dataAbertura: '2020-01-15',
    dataFechamento: null,
    limite: 5000,
    unitId: 'u-sede',
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'ta3',
    nome: 'Itaú - Conta Corrente',
    banco: 'Itaú',
    agencia: '3456',
    numero: '78901-2',
    tipo: 'CONTA_CORRENTE',
    saldo: 18000,
    saldoDisponivel: 18000,
    saldoBloqueado: 0,
    status: 'ATIVA',
    dataAbertura: '2020-02-01',
    dataFechamento: null,
    limite: 3000,
    unitId: 'u-sede',
    createdAt: '2020-02-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'ta4',
    nome: 'Caixa Econômica - Poupança',
    banco: 'Caixa Econômica Federal',
    agencia: '2345',
    numero: '34567-8',
    tipo: 'POUPANCA',
    saldo: 35000,
    saldoDisponivel: 35000,
    saldoBloqueado: 0,
    status: 'ATIVA',
    dataAbertura: '2020-03-01',
    dataFechamento: null,
    limite: 0,
    unitId: 'u-sede',
    createdAt: '2020-03-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'ta5',
    nome: 'Bradesco - Conta Investimento',
    banco: 'Bradesco',
    agencia: '4567',
    numero: '89012-3',
    tipo: 'CONTA_INVESTIMENTO',
    saldo: 45000,
    saldoDisponivel: 42000,
    saldoBloqueado: 3000,
    status: 'ATIVA',
    dataAbertura: '2020-04-01',
    dataFechamento: null,
    limite: 0,
    unitId: 'u-sede',
    createdAt: '2020-04-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  }
];

// Mock de Investimentos
export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: 'inv1',
    nome: 'CDB Banco do Brasil',
    tipo: 'CDB',
    instituicao: 'Banco do Brasil',
    valorAplicado: 20000,
    valorAtual: 21200,
    taxaJuros: 12.5,
    dataAplicacao: '2025-01-15',
    dataVencimento: '2026-01-15',
    status: 'ATIVO',
    unitId: 'u-sede',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'inv2',
    nome: 'Tesouro Selic 2025',
    tipo: 'TESOURO_SELIC',
    instituicao: 'Tesouro Direto',
    valorAplicado: 15000,
    valorAtual: 15800,
    taxaJuros: 13.75,
    dataAplicacao: '2025-03-01',
    dataVencimento: '2028-03-01',
    status: 'ATIVO',
    unitId: 'u-sede',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'inv3',
    nome: 'Fundo DI Itaú',
    tipo: 'FUNDO_DI',
    instituicao: 'Itaú Asset Management',
    valorAplicado: 10000,
    valorAtual: 10500,
    taxaJuros: 11.8,
    dataAplicacao: '2025-06-01',
    dataVencimento: '2026-06-01',
    status: 'ATIVO',
    unitId: 'u-sede',
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'inv4',
    nome: 'LCI Bradesco',
    tipo: 'LCI',
    instituicao: 'Bradesco',
    valorAplicado: 8000,
    valorAtual: 8400,
    taxaJuros: 10.5,
    dataAplicacao: '2025-09-01',
    dataVencimento: '2026-09-01',
    status: 'ATIVO',
    unitId: 'u-sede',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  }
];

// Mock de Empréstimos
export const MOCK_LOANS: Loan[] = [
  {
    id: 'loan1',
    nome: 'Financiamento Templo',
    tipo: 'FINANCIAMENTO_IMOBILIARIO',
    instituicao: 'Banco do Brasil',
    valorTotal: 200000,
    valorAtual: 185000,
    taxaJuros: 9.5,
    dataContratacao: '2023-01-01',
    dataVencimento: '2033-01-01',
    status: 'ATIVO',
    proximoVencimento: '2026-04-05',
    valorProximaParcela: 2500,
    unitId: 'u-sede',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'loan2',
    nome: 'Empréstimo Caixa',
    tipo: 'EMPRESTIMO_PESSOAL',
    instituicao: 'Caixa Econômica',
    valorTotal: 30000,
    valorAtual: 15000,
    taxaJuros: 12.0,
    dataContratacao: '2024-06-01',
    dataVencimento: '2026-06-01',
    status: 'ATIVO',
    proximoVencimento: '2026-04-10',
    valorProximaParcela: 800,
    unitId: 'u-sede',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  }
];

// Mock de Alertas
export const MOCK_TREASURY_ALERTS: TreasuryAlert[] = [
  {
    id: 'alert1',
    titulo: 'Saldo Baixo - Caixa Principal',
    descricao: 'O saldo da caixa principal está abaixo do mínimo recomendado de R$ 1.000,00',
    tipo: 'SALDO_BAIXO',
    gravidade: 'ALTA',
    status: 'ATIVO',
    valor: 5000,
    dataGeracao: '2026-03-26',
    dataLimite: '2026-03-28',
    contaId: 'ta1',
    acoesSugeridas: [
      'Transferir fundos do banco',
      'Solicitar depósito adicional',
      'Revisar despesas imediatas'
    ],
    unitId: 'u-sede',
    createdAt: '2026-03-26T08:00:00Z',
    updatedAt: '2026-03-26T08:00:00Z'
  },
  {
    id: 'alert2',
    titulo: 'Vencimento Próximo - Aluguel',
    descricao: 'Pagamento do aluguel do templo vence em 2 dias',
    tipo: 'VENCIMENTO_PROXIMO',
    gravidade: 'MEDIA',
    status: 'ATIVO',
    valor: 5000,
    dataGeracao: '2026-03-26',
    dataLimite: '2026-03-28',
    acoesSugeridas: [
      'Programar pagamento',
      'Verificar saldo disponível',
      'Avisar tesoureiro'
    ],
    unitId: 'u-sede',
    createdAt: '2026-03-26T09:00:00Z',
    updatedAt: '2026-03-26T09:00:00Z'
  },
  {
    id: 'alert3',
    titulo: 'Oportunidade - Rendimento Acima da Média',
    descricao: 'CDB Banco do Brasil está com rendimento 2% acima da média do mercado',
    tipo: 'OPORTUNIDADE_INVESTIMENTO',
    gravidade: 'BAIXA',
    status: 'ATIVO',
    valor: 20000,
    dataGeracao: '2026-03-26',
    dataLimite: '2026-04-05',
    investimentoId: 'inv1',
    acoesSugeridas: [
      'Avaliar aplicação adicional',
      'Comparar com outras opções',
      'Consultar assessor financeiro'
    ],
    unitId: 'u-sede',
    createdAt: '2026-03-26T10:00:00Z',
    updatedAt: '2026-03-26T10:00:00Z'
  },
  {
    id: 'alert4',
    titulo: 'Crítico - Saldo Insuficiente',
    descricao: 'Conta do Itaú não tem saldo suficiente para o pagamento programado de R$ 2.500,00',
    tipo: 'SALDO_INSUFICIENTE',
    gravidade: 'CRITICA',
    status: 'ATIVO',
    valor: 2500,
    dataGeracao: '2026-03-26',
    dataLimite: '2026-03-27',
    contaId: 'ta3',
    acoesSugeridas: [
      'Transferir fundos urgentemente',
      'Negociar data de pagamento',
      'Usar conta reserva'
    ],
    unitId: 'u-sede',
    createdAt: '2026-03-26T11:00:00Z',
    updatedAt: '2026-03-26T11:00:00Z'
  }
];

// Mock de Projeções
export const MOCK_CASH_FLOW_FORECASTS: CashFlowForecast[] = [
  {
    id: 'forecast1',
    dataInicio: '2026-03-26',
    dataFim: '2026-04-26',
    tipo: 'MENSAL',
    precisao: 85.5,
    valorProjetado: 45000,
    valorReal: 0,
    status: 'EM_ANDAMENTO',
    unitId: 'u-sede',
    createdAt: '2026-03-26T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  },
  {
    id: 'forecast2',
    dataInicio: '2026-02-26',
    dataFim: '2026-03-26',
    tipo: 'MENSAL',
    precisao: 92.3,
    valorProjetado: 42000,
    valorReal: 43500,
    status: 'CONCLUIDO',
    unitId: 'u-sede',
    createdAt: '2026-02-26T00:00:00Z',
    updatedAt: '2026-03-26T00:00:00Z'
  }
];

// Mock de Posição Financeira
export const MOCK_FINANCIAL_POSITION: FinancialPosition = {
  id: 'pos1',
  data: '2026-03-26',
  saldoTotal: 128000,
  ativos: 153000,
  passivos: 25000,
  patrimonioLiquido: 128000,
  liquidezImediata: 23000,
  liquidezCorrente: 2.5,
  grauEndividamento: 19.5,
  margemLucro: 15.8,
  rotatividadeAtivos: 1.2,
  retornoPatrimonio: 18.5,
  status: 'SAUDAVEL',
  unitId: 'u-sede',
  createdAt: '2026-03-26T00:00:00Z',
  updatedAt: '2026-03-26T00:00:00Z'
};
