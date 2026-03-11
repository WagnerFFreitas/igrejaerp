// Tipos Contábeis para Módulo de Departamento Pessoal

/**
 * Tipos de conta no plano de contas
 */
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

/**
 * Grupo de contas contábeis
 */
export type AccountGroup = 
  | 'Salários e Ordenados'
  | 'Encargos Sociais e Trabalhistas'
  | 'Benefícios'
  | 'Provisões Trabalhistas'
  | 'Rescisões'
  | 'Contas a Pagar - Folha'
  | 'Contas de Compensação';

/**
 * Conta Contábil do Plano de Contas
 */
export interface AccountingAccount {
  id: string;
  code: string; // Ex: "3.1.1.01"
  name: string; // Ex: "Salários CLT"
  type: AccountType;
  group: AccountGroup;
  unitId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
  parentCode?: string; // Código da conta pai (para hierarquia)
}

/**
 * Linha de um lançamento contábil (débito ou crédito)
 */
export interface JournalEntryLine {
  id: string;
  entryId: string;
  accountId: string;
  accountCode: string;
  description: string;
  debit: number;
  credit: number;
  costCenterId?: string;
  employeeId?: string;
  projectId?: string;
  documentNumber?: string;
}

/**
 * Lançamento Contábil completo (Livro Diário)
 */
export interface JournalEntry {
  id: string;
  unitId: string;
  date: string;
  history: string;
  documentNumber?: string;
  entries: JournalEntryLine[];
  source: JournalEntrySource;
  createdAt: string;
  createdBy: string;
  isPosted: boolean;
  postedAt?: string;
  postedBy?: string;
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

/**
 * Fonte do lançamento contábil
 */
export type JournalEntrySource = 'PAYROLL' | 'MANUAL' | 'ESOCIAL' | 'BANK' | 'PROVISION';

/**
 * Tipo de provisão trabalhista
 */
export type ProvisionType = 'VACATION' | 'CHRISTMAS_BONUS' | 'FINE_40' | 'NOTICE_PERIOD';

/**
 * Status da provisão
 */
export type ProvisionStatus = 'ACCRUED' | 'USED' | 'REVERSED';

/**
 * Provisão Trabalhista (Férias, 13º, Multa FGTS, etc.)
 */
export interface PayrollProvision {
  id: string;
  unitId: string;
  employeeId: string;
  employeeName: string;
  type: ProvisionType;
  month: number;
  year: number;
  accruedValue: number;
  usedValue?: number;
  balance: number;
  status: ProvisionStatus;
  createdAt: string;
  reversedAt?: string;
  usedAt?: string;
  observations?: string;
}

/**
 * Evento do eSocial
 */
export interface ESocialEvent {
  id: string;
  unitId: string;
  eventType: string; // Ex: "S-1200", "S-2200"
  employeeId?: string;
  xml: string;
  receipt?: string;
  status: ESocialEventStatus;
  errorMessage?: string;
  sentAt?: string;
  processedAt?: string;
  protocol?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Status do evento eSocial
 */
export type ESocialEventStatus = 'GENERATED' | 'SENT' | 'ERROR' | 'PROCESSED' | 'CANCELLED';

/**
 * Resultado do processamento da folha
 */
export interface PayrollProcessingResult {
  employeesProcessed: number;
  totalGrossSalary: number;
  totalINSS: number;
  totalIRRF: number;
  totalFGTS: number;
  totalEmployerCharges: number;
  totalNetSalary: number;
  journalEntryGenerated: boolean;
  esocialEventsGenerated: boolean;
  errors: PayrollError[];
}

/**
 * Erro no processamento da folha
 */
export interface PayrollError {
  employeeId: string;
  employeeName: string;
  error: string;
  field?: string;
  severity: 'ERROR' | 'WARNING';
}

/**
 * Configuração de impostos e taxas
 */
export interface TaxConfiguration {
  inssBrackets: TaxBracket[];
  irrfBrackets: IRRFBracket[];
  fgtsRate: number;
  patronalRate: number;
  ratRate: number;
  terceirosRate: number;
  salarioEducacaoRate: number;
  incraRate: number;
  sebraeRate: number;
  updated: string;
}

/**
 * Faixa de INSS
 */
export interface TaxBracket {
  limit: number;
  rate: number;
}

/**
 * Faixa de IRRF com parcela a deduzir
 */
export interface IRRFBracket {
  limit: number;
  rate: number;
  deduction: number;
}

/**
 * Resumo contábil do mês
 */
export interface MonthlyAccountingSummary {
  month: number;
  year: number;
  totalSalaries: number;
  totalCharges: number;
  totalBenefits: number;
  totalProvisions: number;
  totalRescisions: number;
  journalEntriesCount: number;
  esocialEventsCount: number;
}
