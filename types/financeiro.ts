/**
 * ============================================================================
 * FINANCEIRO.TS
 * ============================================================================
 *
 * Tipos financeiros estendidos para Contas a Pagar/Receber.
 * Nomenclatura PT-BR alinhada ao schema PostgreSQL.
 */

import { Transacao } from '../tipos';

// ============================================================================
// EXTENSÃO DE TRANSAÇÃO
// ============================================================================

/**
 * Extensão da interface Transacao com campos avançados
 */
export interface TransacaoEstendida extends Transacao {
  // Vencimento
  dataVencimento?: string;

  // Parcelas
  numeroParcela?: number;
  totalParcelas?: number;
  idOrigem?: string; // ID do título pai (para parcelas)

  // Juros e Multas
  taxaJuros?: number;
  valorJuros?: number;
  taxaMulta?: number;
  valorMulta?: number;

  // Descontos
  taxaDesconto?: number;
  valorDesconto?: number;

  // Baixas Parciais
  valorPago?: number;
  valorRestante?: number;

  // Recorrência
  recorrente?: boolean;
  padraoRecorrencia?: 'MONTHLY' | 'WEEKLY' | 'YEARLY' | 'DAILY';
  proximoVencimento?: string;

  // Conciliação Bancária
  idTransacaoBancaria?: string;
  dataConciliacao?: string;
  extratoBancario?: string;

  // Documentos Fiscais
  numeroDocumento?: string;
  serieDocumento?: string;
  tipoDocumento?: TipoDocumento;

  // Observações
  observacoes?: string;

  // Categoria Financeira
  categoriaFinanceira?: CategoriaFinanceira;
}

/** @deprecated Use TransacaoEstendida */
export type TransactionEnhanced = TransacaoEstendida;

// ============================================================================
// ENUMS
// ============================================================================

export type TipoDocumento = 'NFE' | 'NFSE' | 'RECIBO' | 'BOLETO' | 'OUTRO';
/** @deprecated Use TipoDocumento */
export type DocumentType = TipoDocumento;

export type CategoriaFinanceira =
  | 'OPERATIONAL'
  | 'PAYROLL'
  | 'TAXES'
  | 'BENEFITS'
  | 'INCOME'
  | 'TRANSFER'
  | 'INVESTMENT'
  | 'LOAN'
  | 'OTHER';
/** @deprecated Use CategoriaFinanceira */
export type FinancialCategory = CategoriaFinanceira;

// ============================================================================
// CONCILIAÇÃO BANCÁRIA
// ============================================================================

export interface ConciliacaoBancaria {
  id: string;
  idUnidade: string;
  idConta: string;
  nomeConta: string;
  dataExtrato: string;
  saldoInicial: number;
  saldoFinal: number;
  transacoes: TransacaoConciliacao[];
  conciliadoEm: string;
  conciliadoPor: string;
  observacoes?: string;
}
/** @deprecated Use ConciliacaoBancaria */
export type BankReconciliation = ConciliacaoBancaria;

export interface TransacaoConciliacao {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'DEBIT' | 'CREDIT';
  idTransacao?: string;
  conciliado: boolean;
  confiancaConciliacao?: number;
}
/** @deprecated Use TransacaoConciliacao */
export type ReconciliationTransaction = TransacaoConciliacao;

// ============================================================================
// FLUXO DE CAIXA
// ============================================================================

export interface ProjecaoFluxoCaixa {
  id: string;
  idUnidade: string;
  mes: number;
  ano: number;
  receitaPrevista: number;
  despesaPrevista: number;
  saldoPrevisto: number;
  receitaRealizada?: number;
  despesaRealizada?: number;
  saldoRealizado?: number;
  variacao: number;
  variacaoPercentual: number;
  observacoes?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
/** @deprecated Use ProjecaoFluxoCaixa */
export type CashFlowProjection = ProjecaoFluxoCaixa;

// ============================================================================
// TRANSAÇÃO RECORRENTE
// ============================================================================

export interface TransacaoRecorrente {
  id: string;
  idUnidade: string;
  nome: string;
  modelo: ModeloTransacaoRecorrente;
  frequencia: 'MONTHLY' | 'WEEKLY' | 'YEARLY' | 'DAILY';
  dataInicio: string;
  dataFim?: string;
  proximaData: string;
  ativo: boolean;
  transacoesGeradas: string[];
  ultimaDataGerada?: string;
  dataCriacao: string;
  criadoPor: string;
}
/** @deprecated Use TransacaoRecorrente */
export type RecurringTransaction = TransacaoRecorrente;

export interface ModeloTransacaoRecorrente {
  descricao: string;
  valor: number;
  tipo: 'INCOME' | 'EXPENSE';
  categoria: string;
  centroCusto: string;
  idConta: string;
  formaPagamento?: 'PIX' | 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER';
  nomeFornecedor?: string;
  naturezaOperacao: string;
  idProjeto?: string;
}
/** @deprecated Use ModeloTransacaoRecorrente */
export type RecurringTransactionTemplate = ModeloTransacaoRecorrente;

// ============================================================================
// CENTRO DE CUSTO
// ============================================================================

export interface CentroCusto {
  id: string;
  codigo: string;
  nome: string;
  departamento: string;
  ativo: boolean;
  orcamento?: number;
  despesaRealizada?: number;
  variacao?: number;
}
/** @deprecated Use CentroCusto */
export type CostCenter = CentroCusto;

// ============================================================================
// NATUREZA DE OPERAÇÃO
// ============================================================================

export interface NaturezaOperacao {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  codigoContaContabil?: string;
  fiscal: boolean;
}
/** @deprecated Use NaturezaOperacao */
export type OperationNature = NaturezaOperacao;

// ============================================================================
// RESUMO FINANCEIRO MENSAL
// ============================================================================

export interface ResumoFinanceiroMensal {
  mes: number;
  ano: number;
  totalReceitas: number;
  totalDespesas: number;
  resultadoLiquido: number;
  contasAPagar: number;
  contasAReceber: number;
  saldoCaixa: number;
  variacaoProjecoes: number;
}
/** @deprecated Use ResumoFinanceiroMensal */
export type MonthlyFinancialSummary = ResumoFinanceiroMensal;

// ============================================================================
// AGING LIST (terminologia contábil internacional — manter em inglês)
// ============================================================================

export interface AgingList {
  total: number;
  notDue: number;
  days1_30: number;
  days31_60: number;
  days61_90: number;
  days91_plus: number;
  writeOff: number;
}
