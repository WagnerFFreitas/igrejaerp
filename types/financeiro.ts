// Tipos Financeiros Estendidos para Contas a Pagar/Receber

import { Transaction } from '../types';

/**
 * Extensão da interface Transaction com campos avançados
 */
export interface TransactionEnhanced extends Transaction {
  // Vencimento
  dueDate?: string;
  
  // Parcelas
  installmentNumber?: number; // Ex: 1
  totalInstallments?: number; // Ex: 12
  parentId?: string; // ID do título pai (para parcelas)
  
  // Juros e Multas
  interestRate?: number; // Taxa de juros mensal (%)
  interestValue?: number; // Valor dos juros calculado (R$)
  penaltyRate?: number; // Multa por atraso (%)
  penaltyValue?: number; // Valor da multa (R$)
  
  // Descontos
  discountRate?: number; // Desconto por antecipação (%)
  discountValue?: number; // Valor do desconto (R$)
  
  // Baixas Parciais
  paidAmount?: number; // Valor já pago (R$)
  remainingAmount?: number; // Saldo restante (R$)
  
  // Recorrência
  isRecurring?: boolean;
  recurrencePattern?: 'MONTHLY' | 'WEEKLY' | 'YEARLY' | 'DAILY';
  nextDueDate?: string;
  
  // Conciliação Bancária
  bankTransactionId?: string;
  conciliationDate?: string;
  bankStatement?: string;
  
  // Documentos Fiscais
  documentNumber?: string;
  documentSeries?: string;
  documentType?: DocumentType;
  
  // Observações
  notes?: string;
  
  // Categoria Financeira
  financialCategory?: FinancialCategory;
}

/**
 * Tipo de documento fiscal
 */
export type DocumentType = 'NFE' | 'NFSE' | 'RECIBO' | 'BOLETO' | 'OUTRO';

/**
 * Categoria financeira da transação
 */
export type FinancialCategory = 
  | 'OPERATIONAL'      // Despesas operacionais
  | 'PAYROLL'          // Folha de pagamento
  | 'TAXES'            // Impostos e contribuições
  | 'BENEFITS'         // Benefícios
  | 'INCOME'           // Receitas
  | 'TRANSFER'         // Transferências
  | 'INVESTMENT'       // Investimentos
  | 'LOAN'             // Empréstimos
  | 'OTHER';           // Outros

/**
 * Conciliação Bancária
 */
export interface BankReconciliation {
  id: string;
  unitId: string;
  accountId: string;
  accountName: string;
  statementDate: string;
  openingBalance: number;
  closingBalance: number;
  transactions: ReconciliationTransaction[];
  reconciledAt: string;
  reconciledBy: string;
  observations?: string;
}

/**
 * Transação na conciliação bancária
 */
export interface ReconciliationTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  transactionId?: string; // Vínculo com Transaction do sistema
  isMatched: boolean;
  matchConfidence?: number; // 0-100 (confiança no match automático)
}

/**
 * Projeção de Fluxo de Caixa
 */
export interface CashFlowProjection {
  id: string;
  unitId: string;
  month: number;
  year: number;
  projectedIncome: number;
  projectedExpense: number;
  projectedBalance: number;
  actualIncome?: number;
  actualExpense?: number;
  actualBalance?: number;
  variance: number;
  variancePercent: number;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transação Recorrente
 */
export interface RecurringTransaction {
  id: string;
  unitId: string;
  name: string;
  template: RecurringTransactionTemplate;
  frequency: 'MONTHLY' | 'WEEKLY' | 'YEARLY' | 'DAILY';
  startDate: string;
  endDate?: string;
  nextDate: string;
  isActive: boolean;
  generatedTransactions: string[]; // IDs das transações geradas
  lastGeneratedDate?: string;
  createdAt: string;
  createdBy: string;
}

/**
 * Template para transação recorrente
 */
export interface RecurringTransactionTemplate {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  costCenter: string;
  accountId: string;
  paymentMethod?: 'PIX' | 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER';
  providerName?: string;
  operationNature: string;
  projectId?: string;
}

/**
 * Centro de Custo
 */
export interface CostCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  isActive: boolean;
  budget?: number; // Orçamento mensal
  actualExpense?: number; // Despesa realizada no mês
  variance?: number; // Diferença (budget - actual)
}

/**
 * Natureza de Operação
 */
export interface OperationNature {
  id: string;
  code: string;
  name: string;
  description?: string;
  accountingAccountCode?: string; // Vínculo com conta contábil
  isFiscal: boolean;
}

/**
 * Resumo Financeiro Mensal
 */
export interface MonthlyFinancialSummary {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netResult: number;
  pendingPayables: number;
  pendingReceivables: number;
  cashBalance: number;
  projectionsVariance: number;
}

/**
 * Aging List (Análise de Vencimentos)
 */
export interface AgingList {
  total: number;
  notDue: number; // Ainda não venceu
  days1_30: number; // 1-30 dias vencido
  days31_60: number; // 31-60 dias vencido
  days61_90: number; // 61-90 dias vencido
  days91_plus: number; // Mais de 90 dias
  writeOff: number; // Perdas prováveis
}
