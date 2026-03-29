
export type UserRole = 'ADMIN' | 'SECRETARY' | 'TREASURER' | 'PASTOR' | 'RH' | 'DP' | 'FINANCEIRO' | 'DEVELOPER';

export interface UserAuth {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
  unitId: string;
}

export interface Unit {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  isHeadquarter: boolean;
}

export interface Asset {
  id: string;
  unitId: string;                    // Unidade responsável
  category: AssetType;               // Categoria do bem
  name: string;                      // Nome descritivo
  description: string;               // Descrição detalhada
  acquisitionDate: string;           // Data de aquisição
  acquisitionValue: number;          // Valor de aquisição (R$)
  currentValue: number;              // Valor atualizado
  supplier?: string;                 // Fornecedor
  invoiceNumber?: string;            // Número da nota fiscal
  serialNumber?: string;             // Número de série
  brand?: string;                    // Marca
  model?: string;                    // Modelo
  location: string;                  // Localização atual (sala, departamento)
  responsible?: string;              // Responsável pelo bem
  status: AssetStatus;               // Status atual
  photos?: string[];                 // URLs das fotos
  documents?: string[];              // URLs de documentos (NF, contrato)
  usefulLifeMonths: number;          // Vida útil em meses
  depreciationRate: number;          // Taxa de depreciação anual (%)
  depreciationMethod: DepreciationMethod;
  currentBookValue: number;          // Valor contábil atual
  accumulatedDepreciation: number;   // Depreciação acumulada
  residualValue?: number;            // Valor residual (opcional)
  lastInventoryDate?: string;        // Última conferência de inventário
  inventoryCount?: number;           // Quantidade no último inventário
  assetNumber: string;               // Número de patrimônio
  condition: 'NOVO' | 'BOM' | 'REGULAR' | 'RUIM' | 'SUCATA';
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = 'VACATION' | 'MEDICAL' | 'MATERNITY' | 'PATERNITY' | 'MILITARY' | 'WEDDING' | 'BEREAVEMENT' | 'UNPAID';

export interface EmployeeLeave {
  id: string;
  unitId: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  cid10?: string;
  doctorName?: string;
  crm?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  observations?: string;
  attachmentUrl?: string;
}

export interface MemberContribution {
  id: string;
  value: number;
  date: string;
  type: 'Dizimo' | 'OFFERING' | 'CAMPAIGN';
  description?: string;
}

export interface Dependent {
  id: string;
  name: string;
  birthDate: string;
  relationship: 'FILHO' | 'FILHA' | 'CONJUGE' | 'PAI' | 'MAE' | 'OUTRO';
  cpf?: string;
}

// Added missing FinancialAccount interface
export interface FinancialAccount {
  id: string;
  unitId: string;
  name: string;
  type: 'CASH' | 'BANK' | 'SAVINGS' | 'INVESTMENT';
  currentBalance: number;
  minimumBalance?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  bankCode?: string;
  agencyNumber?: string;
  accountNumber?: string;
  createdAt?: string;        // Data de criação
  updatedAt?: string;        // Data de atualização
}

// Added missing Transaction interface
export interface Transaction {
  id: string;
  unitId: string;
  description: string;
  amount: number;
  date: string;
  competencyDate: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  costCenter: string;
  accountId: string;
  memberId?: string;
  status: 'PAID' | 'PENDING';
  isConciliated?: boolean;
  operationNature: string;
  projectId?: string;
  createdAt?: string;
  paymentMethod?: 'PIX' | 'CASH' | 'CREDIT_CARD' | 'TRANSFER'; // Adicionado TRANSFER
  providerName?: string;
  
  // NOVOS CAMPOS PARA CONTAS A PAGAR/RECEBER
  dueDate?: string;              // Data de vencimento
  paidAmount?: number;           // Quanto já foi pago (para baixa parcial)
  remainingAmount?: number;      // Saldo restante a pagar
  
  // NOVOS CAMPOS PARA PARCELAMENTO
  isInstallment?: boolean;       // Se é parcela
  installmentNumber?: number;    // Número da parcela (1, 2, 3...)
  totalInstallments?: number;    // Total de parcelas (ex: 12)
  parentId?: string;             // ID da transação pai (vincula parcelas)
  installmentCount?: number;     // Quantidade de parcelas ao criar (campo temporário)
  
  // NOVOS CAMPOS PARA CONCILIAÇÃO
  conciliationDate?: string;     // Data da conciliação bancária
  notes?: string;                // Observações adicionais
  externalId?: string;           // ID externo (banco/OFX) para conciliação
}

// ============================================================================
// INTERFACES DE RH E FOLHA DE PAGAMENTO (FASE 5)
// ============================================================================

/**
 * REGIME DE CONTRATAÇÃO
 * =====================
 */
export type EmploymentRegime = 'CLT' | 'PRO_LABORE' | 'ESTAGIO' | 'AUTONOMO';

/**
 * FUNCIONÁRIO / PASTOR / COLABORADOR
 * ===================================
 */
export interface Employee {
  id: string;
  unitId: string;
  name: string;
  cpf: string;
  rg?: string;
  pis: string;
  matricula: string;
  cargo: string;
  departamento: string;
  regime: EmploymentRegime;
  admissionDate: string;
  salary: number;              // Salário base
  workHours: number;           // Carga horária semanal (ex: 40)
  dependents: Dependent[];
  bankAccount?: {
    bank: string;
    agency: string;
    account: string;
  };
  active: boolean;
  terminationDate?: string;
  observations?: string;
}

/**
 * ESTRUTURA DE CÁLCULO DE FOLHA
 * ==============================
 */
export interface PayrollCalculation {
  employeeId: string;
  competencyMonth: string;     // Mês de competência (YYYY-MM)
  grossSalary: number;         // Salário bruto
  
  // PROVENTOS
  allowances: {
    baseSalary: number;        // Salário base
    overtime?: number;         // Horas extras
    nightShift?: number;       // Adicional noturno
    hazardPay?: number;        // Insalubridade
    commission?: number;       // Comissões
    bonuses?: number;          // Bonificações
    familySalary?: number;     // Salário família
    other?: number;            // Outros
  };
  
  // DESCONTOS
  deductions: {
    inss: number;              // INSS
    irrf: number;              // IRRF
    fgts: number;              // FGTS (não desconta, só informa)
    union?: number;            // Contribuição sindical
    healthInsurance?: number;  // Plano de saúde
    dentalInsurance?: number;  // Plano odontológico
    mealAllowance?: number;    // Vale alimentação
    mealTicket?: number;       // Vale refeição
    transport?: number;        // Vale transporte
    pharmacy?: number;         // Vale farmácia
    lifeInsurance?: number;    // Seguro de vida
    advance?: number;          // Adiantamento
    consignado?: number;       // Consignado
    coparticipation?: number;  // Coparticipações
    absences?: number;         // Faltas
    delays?: number;           // Atrasos
    alimony?: number;          // Pensão alimentícia
    other?: number;            // Outros
  };
  
  // TOTAIS
  totals: {
    totalAllowances: number;   // Total proventos
    totalDeductions: number;   // Total descontos
    netSalary: number;         // Salário líquido
    employerCost: number;      // Custo total empregador
  };
  
  // DETALHES DOS CÁLCULOS
  calculationDetails: {
    inssBase: number;          // Base de cálculo INSS
    inssRate: number;          // Alíquota INSS
    inssValue: number;         // Valor INSS
    irrfBase: number;          // Base de cálculo IRRF
    irrfRate: number;          // Alíquota IRRF
    irrfDeduction: number;     // Dedução IRRF
    irrfValue: number;         // Valor IRRF
    fgtsBase: number;          // Base FGTS
    fgtsRate: number;          // Alíquota FGTS
    fgtsValue: number;         // Valor FGTS
  };
}

// Interface para relatório consolidado de encargos sociais
export interface SocialChargesReport {
  competencyMonth: string;           // Mês de competência (YYYY-MM)
  totalEmployees: number;           // Total de funcionários
  grossSalaryTotal: number;         // Total salários brutos
  
  // ENCARGOS SOCIAIS - EMPREGADOR
  employerCharges: {
    fgts: {
      base: number;               // Base de cálculo FGTS
      rate: number;               // Alíquota FGTS
      value: number;              // Valor total FGTS
    };
    inssEmployer: {
      base: number;               // Base INSS empregador
      rate: number;               // Alíquota INSS empregador
      value: number;              // Valor total INSS empregador
    };
    rat: {
      base: number;               // Base RAT
      rate: number;               // Alíquota RAT
      value: number;              // Valor total RAT
    };
    thirdParties: {
      base: number;               // Base terceiros
      rate: number;               // Alíquota terceiros
      value: number;              // Valor total terceiros
    };
    totalEmployerCharges: number;  // Total encargos empregador
  };
  
  // DESCONTOS - EMPREGADO
  employeeDeductions: {
    inss: {
      base: number;               // Base de cálculo INSS
      rate: number;               // Alíquota INSS
      value: number;              // Valor total INSS descontado
    };
    irrf: {
      base: number;               // Base de cálculo IRRF
      rate: number;               // Alíquota IRRF
      value: number;              // Valor total IRRF descontado
    };
    totalDeductions: number;     // Total descontos funcionários
  };
  
  // RESUMO FINANCEIRO
  financialSummary: {
    totalGrossSalary: number;     // Total salários brutos
    totalNetSalary: number;       // Total salários líquidos
    totalEmployerCost: number;     // Custo total empregador
    averageEmployerCost: number;  // Custo médio por funcionário
    employerCostPercentage: number; // Percentual custo/bruto
  };
  
  // DETALHES POR FUNCIONÁRIO
  employeeDetails: Array<{
    employeeId: string;
    employeeName: string;
    employeeCpf: string;
    grossSalary: number;
    netSalary: number;
    employerCost: number;
    inssValue: number;
    irrfValue: number;
    fgtsValue: number;
  }>;
}

/**
 * RECIBO DE PAGAMENTO (HOLERITE)
 * ===============================
 */
export interface PaySlip {
  payrollId: string;
  employee: Employee;
  calculation: PayrollCalculation;
  generatedAt: string;
  pdfUrl?: string;
}

/**
 * TABELAS OFICIAIS (INSS, IRRF)
 * ==============================
 */
export interface TaxBracket {
  bracket: number;
  min: number;
  max?: number;
  rate: number;
  deduction: number;           // Parcela a deduzir
}

/**
 * CONFIGURAÇÃO DE FOLHA
 * =====================
 */
export interface PayrollConfig {
  year: number;
  month: number;             // 1-12
  minWage: number;           // Salário mínimo
  inssTable: TaxBracket[];   // Tabela INSS
  irrfTable: TaxBracket[];   // Tabela IRRF
  fgtsRate: number;          // Alíquota FGTS padrão
  thirdPartyRate: number;    // Rateio para terceiros (se tiver)
}

/**
 * PARÂMETROS PARA CÁLCULO DE FOLHA
 * =================================
 */
export interface PayrollInput {
  employee: Employee;
  competencyMonth: string;         // YYYY-MM
  
  // PROVENTOS VARIÁVEIS
  overtimeHours50?: number;        // Horas extras 50%
  overtimeHours100?: number;       // Horas extras 100%
  nightShiftHours?: number;        // Horas noturnas
  hazardPayDegree?: 'NONE' | 'MIN' | 'MED' | 'MAX';  // Insalubridade
  periculosidade?: boolean;        // Periculosidade (30%)
  dsr?: boolean;                   // Descanso Semanal Remunerado
  commission?: number;             // Comissões
  bonuses?: number;                // Bonificações
  familySalary?: number;           // Salário família (manual ou auto)
  otherAllowances?: number;        // Outros adicionais
  
  // DESCONTOS
  absenceDays?: number;            // Dias faltados
  delayMinutes?: number;           // Minutos atrasado
  alimony?: number;                // Pensão alimentícia
  healthInsurance?: number;        // Plano de saúde
  dentalInsurance?: number;        // Plano odontológico
  mealAllowance?: number;          // Vale alimentação (VA)
  mealTicket?: number;             // Vale refeição (VR)
  transport?: number;              // Vale transporte
  pharmacy?: number;               // Vale farmácia
  lifeInsurance?: number;          // Seguro de vida
  advance?: number;                // Adiantamento
  consignado?: number;             // Consignado
  coparticipation?: number;        // Coparticipações
  inssManual?: number;             // INSS manual (se informado)
  irrfManual?: number;             // IRRF manual (se informado)
  otherDeductions?: number;        // Outros descontos
  
  // CONFIGURAÇÕES
  workingDays?: number;            // Dias úteis no mês (padrão: 22)
  fgtsRate?: number;               // Alíquota FGTS (padrão: 8%)
}

// Added missing ChurchEvent interface
export interface ChurchEvent {
  id: string;
  unitId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  type: 'SERVICE' | 'MEETING' | 'EVENT';
  // Campos para escala de voluntários
  volunteerSchedule?: VolunteerSchedule[];
  // Campos para recorrência de eventos
  isRecurring: boolean;
  recurrencePattern?: 'NONE' | 'WEEKLY' | 'MONTHLY';
  recurrenceEndDate?: string;
  parentEventId?: string;
  isGeneratedEvent?: boolean;
}

export interface VolunteerSchedule {
  id: string;
  ministry: string;              // Ministério (Louvor, Ensino, Ação Social, etc.)
  role: string;                  // Função dentro do evento (Líder, Músico, Professor, etc.)
  volunteerId?: string;          // ID do voluntário escalado
  volunteerName?: string;         // Nome do voluntário
  volunteerPhone?: string;        // Telefone do voluntário
  volunteerEmail?: string;        // Email do voluntário
  confirmed: boolean;             // Se o voluntário confirmou participação
  notes?: string;                // Observações sobre a escala
  requiredCount: number;          // Quantidade de voluntários necessários
  assignedCount: number;         // Quantidade de voluntários já escalados
}

// Added missing AuditLog interface
export interface AuditLog {
  id: string;
  unitId: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  entityName?: string;
  date: string;
  ip: string;
  details?: any;
  success?: boolean;
  hash?: string;
}

// Added missing TaxConfig interface
export interface TaxConfig {
  inssBrackets: { limit: number; rate: number }[];
  irrfBrackets: { limit: number; rate: number; deduction: number }[];
  fgtsRate: number;
  patronalRate?: number;
  ratRate?: number;
  terceirosRate?: number;
  defaultVA?: number;
  defaultVR?: number;
  thirdPartyEntities?: {
    sindicatoRate: number;
    confederacaoRate: number;
    sistemaS: number;
    senai: number;
    senac: number;
    sesi: number;
    sebrae: number;
    incra: number;
    terceirosRate: number;
  };
}

// ============================================================================
// INTERFACES DE CONTABILIDADE (FASE 6)
// ============================================================================

/**
 * NATUREZA DE LANÇAMENTO CONTÁBIL
 * ================================
 */
export type AccountNature = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';

/**
 * TIPO DE CONTA CONTÁBIL
 * ======================
 */
export type AccountType = 'SYNTHETIC' | 'ANALYTIC';

/**
 * PLANO DE CONTAS
 * ===============
 * Estrutura hierárquica de contas contábeis
 */
export interface ChartOfAccount {
  id: string;
  unitId: string;
  code: string;              // Código da conta (ex: 1.1.01.001)
  name: string;              // Nome da conta
  nature: AccountNature;     // Natureza
  type: AccountType;         // Tipo (sintética ou analítica)
  parentId?: string;         // Conta pai (se for nível inferior)
  normalBalance: 'DEBIT' | 'CREDIT';  // Saldo normal
  isActive: boolean;
}

/**
 * LANÇAMENTO CONTÁBIL NO DIÁRIO
 * ==============================
 */
export interface AccountingEntry {
  id: string;
  unitId: string;
  entryNumber: number;       // Número do lançamento no diário
  date: string;              // Data do lançamento
  documentNumber?: string;   // Número do documento (NF, recibo, etc.)
  
  // HISTÓRICO DO LANÇAMENTO
  history: string;           // Descrição detalhada
  complement?: string;       // Complemento do histórico
  
  // VALORES
  debitValue: number;        // Valor do débito
  creditValue: number;       // Valor do crédito
  
  // CONTRAPARTIDA
  contraAccount?: string;    // Conta de contrapartida
  
  // VÍNCULOS
  transactionId?: string;    // ID da transação financeira original
  projectId?: string;        // ID do projeto/centro de custo
  
  // AUDITORIA
  createdAt: string;
  createdBy: string;
  reviewedBy?: string;
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
}

/**
// SALDO CONTÁBIL POR CONTA
// =========================
*/
export interface AccountBalance {
  accountId: string;
  accountName: string;
  accountCode: string;
  nature: AccountNature;
  
  // SALDOS DO PERÍODO
  openingBalance: number;    // Saldo inicial
  debitPeriod: number;       // Débitos no período
  creditPeriod: number;      // Créditos no período
  closingBalance: number;    // Saldo final
  
  // DETALHAMENTO
  entriesCount: number;      // Quantidade de lançamentos
}

/**
// LIVRO RAZÃO
// ============
*/
export interface GeneralLedger {
  accountId: string;
  accountName: string;
  accountCode: string;
  period: string;            // YYYY-MM
  
  // LANÇAMENTOS
  entries: Array<{
    entryId: string;
    entryNumber: number;
    date: string;
    documentNumber?: string;
    history: string;
    debitValue: number;
    creditValue: number;
    balance: number;         // Saldo após lançamento
  }>;
  
  // TOTAIS
  totalDebits: number;
  totalCredits: number;
  openingBalance: number;
  closingBalance: number;
}

/**
// BALANCETE DE VERIFICAÇÃO
// ========================
*/
export interface TrialBalance {
  period: string;            // YYYY-MM
  generatedAt: string;
  
  // CONTAS COM MOVIMENTO
  accounts: AccountBalance[];
  
  // TOTAIS GERAIS
  totalAssets: number;       // Total do Ativo
  totalLiabilities: number;  // Total do Passivo
  totalEquity: number;       // Total Patrimônio Líquido
  totalIncome: number;       // Total Receitas
  totalExpense: number;      // Total Despesas
  
  // VERIFICAÇÃO
  isBalanced: boolean;       // Se débitos = créditos
  difference: number;        // Diferença (se houver)
}

/**
// BALANÇO PATRIMONIAL
// ===================
*/
export interface BalanceSheet {
  period: string;            // YYYY-MM
  generatedAt: string;
  
  // ATIVO
  assets: {
    current: AccountBalance[];       // Circulante
    nonCurrent: AccountBalance[];    // Não Circulante
  };
  
  // PASSIVO
  liabilities: {
    current: AccountBalance[];       // Circulante
    nonCurrent: AccountBalance[];    // Não Circulante
  };
  
  // PATRIMÔNIO LÍQUIDO
  equity: AccountBalance[];
  
  // TOTAIS
  totalAssets: number;
  totalLiabilitiesAndEquity: number;
  
  // VERIFICAÇÃO
  isBalanced: boolean;       // Ativo = Passivo + PL
}

/**
// DEMONSTRAÇÃO DE RESULTADO (DRE)
// =================================
*/
export interface IncomeStatement {
  period: string;            // YYYY-MM
  generatedAt: string;
  
  // RECEITAS
  grossRevenue: number;      // Receita Bruta
  deductions: number;        // Deduções e Abatimentos
  netRevenue: number;        // Receita Líquida
  
  // CUSTOS E DESPESAS
  costOfServices: number;    // Custo dos Serviços
  grossProfit: number;       // Lucro Bruto
  
  operatingExpenses: {
    administrative: number;  // Despesas Administrativas
    general: number;         // Despesas Gerais
    other: number;           // Outras Despesas Operacionais
  };
  
  operatingResult: number;   // Resultado Operacional
  otherIncome: number;       // Outras Receitas
  otherExpenses: number;     // Outras Despesas
  
  // RESULTADO FINAL
  netResultBeforeTaxes: number;  // Resultado antes IR/CSLL
  incomeTax: number;             // IRPJ (se houver)
  socialContribution: number;    // CSLL (se houver)
  netResult: number;             // Resultado Líquido
  
  // MARGENS
  grossMargin: number;       // % Lucro Bruto
  operatingMargin: number;   // % Resultado Operacional
  netMargin: number;         // % Resultado Líquido
}

/**
// CONFIGURAÇÃO CONTÁBIL
// =====================
*/
export interface AccountingConfig {
  unitId: string;
  fiscalYear: number;        // Ano fiscal
  startMonth: number;        // Mês de início (1-12)
  endMonth: number;          // Mês de término (1-12)
  currency: string;          // Moeda (BRL)
  taxRegime: 'SIMPLES' | 'LUCRO_PRESUMIDO' | 'ISENTO';
}

// ============================================================================
// INTERFACES ESOCIAL (FASE 7)
// ============================================================================

/**
 * AMBIENTE ESOCIAL
 * ================
 */
export type ESocialEnvironment = 'PRODUCAO' | 'HOMOLOGACAO';

/**
 * TIPO DE EVENTO ESOCIAL
 * ======================
 */
export type ESocialEventType = 
  // INICIAIS
  | 'S-1000'  // Informações do empregador
  | 'S-1010'  // Tabela de rubricas
  | 'S-1020'  // Tabela de lotações tributárias
  | 'S-1030'  // Tabela de cargos/empregos
  | 'S-1040'  // Tabela de funções/cargos públicos
  | 'S-1050'  // Tabela de horários/turnos
  | 'S-1060'  // Tabela de ambientes periculosos
  | 'S-1070'  // Tabela de processos judiciais
  | 'S-1080'  // Tabela de operadores de produção
  
  // PERIÓDICOS
  | 'S-1200'  // Remuneração de trabalhador
  | 'S-1210'  // Pagamentos de rendimentos
  | 'S-1260'  // Cessão de mão-de-obra
  | 'S-1270'  // Contratação por prazo determinado
  | 'S-1280'  // Informações complementares
  | 'S-1290'  // Contribuição sindical
  
  // NÃO PERIÓDICOS
  | 'S-2110'  // Admissão de trabalhador
  | 'S-2120'  // Alteração cadastral
  | 'S-2130'  // Desligamento
  | 'S-2140'  // Reabertura de férias
  | 'S-2190'  // Situação especial de trabalho
  
  // EXCLUSÕES
  | 'S-3000'; // Exclusão de eventos

/**
 * STATUS DO EVENTO
 * ================
 */
export type ESocialEventStatus = 
  | 'DRAFT'       // Rascunho
  | 'PENDING'     // Pendente de envio
  | 'SENT'        // Enviado
  | 'PROCESSING'  // Em processamento na Receita
  | 'ACCEPTED'    // Aceito
  | 'REJECTED'    // Rejeitado
  | 'ERROR';      // Erro no envio

/**
 * CONFIGURAÇÃO ESOCIAL
 * ====================
 */
export interface ESocialConfig {
  unitId: string;
  environment: ESocialEnvironment;
  cnpj: string;
  certificate?: string;      // Certificado digital (base64)
  certificatePassword?: string;
  
  // URLs dos serviços
  productionUrl?: string;
  homologationUrl?: string;
  
  // Layout version
  layoutVersion: 'S-1.0' | 'S-1.1' | 'S-1.2';
  
  // Credenciais
  clientId?: string;
  clientSecret?: string;
  
  lastUpdate?: string;
}

/**
// EVENTO ESOCIAL GENÉRICO
// =======================
*/
export interface ESocialEvent {
  id: string;
  unitId: string;
  eventType: ESocialEventType;
  eventNumber: number;       // Sequencial do evento
  
  // DADOS DO EVENTO
  data: any;                 // Dados específicos do evento
  xmlContent?: string;       // XML gerado
  
  // ENVIO
  sentAt?: string;
  receipt?: string;          // Recibo de entrega
  protocol?: string;         // Número do protocolo
  
  // RETORNO
  status: ESocialEventStatus;
  statusCode?: number;       // Código de retorno
  statusMessage?: string;    // Mensagem de retorno
  errors?: ESocialError[];   // Erros encontrados
  
  // AUDITORIA
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

/**
// ERRO ESOCIAL
// ============
*/
export interface ESocialError {
  code: string;            // Código do erro
  message: string;         // Descrição
  field?: string;          // Campo afetado
  severity: 'WARNING' | 'ERROR' | 'FATAL';
}

/**
// TRABALHADOR PARA ESOCIAL
// ========================
*/
export interface ESocialWorker {
  employeeId: string;
  cpf: string;
  nis: string;               // NIT/PIS/PASEP
  name: string;
  birthDate: string;
  motherName?: string;
  
  // DOCUMENTOS
  rg?: string;
  issuer?: string;
  issueDate?: string;
  
  // ENDEREÇO
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  
  // CONTRATAÇÃO
  admissionDate: string;
  jobTitle: string;
  jobCode: string;
  salary: number;
  workHours: number;
  regime: 'CLT' | 'ESTATUTARIO' | 'AUTONOMO' | 'ESTAGIARIO';
  
  // BANCO
  bankAccount?: {
    bank: string;
    agency: string;
    account: string;
    accountDigit?: string;
  };
}

export interface Member {
  id: string;
  unitId: string;
  matricula: string;
  name: string;
  cpf: string;
  rg: string;
  email: string;
  phone: string;
  whatsapp?: string;
  profession?: string;
  role: 'MEMBER' | 'VISITOR' | 'VOLUNTEER' | 'STAFF' | 'LEADER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  
  // Filiação
  fatherName?: string;
  motherName?: string;

  // Emergência e Saúde
  bloodType?: string;
  emergencyContact?: string;
  
  // Vida Cristã
  conversionDate?: string;
  conversionPlace?: string;
  baptismDate?: string;
  baptismChurch?: string;
  baptizingPastor?: string;
  holySpiritBaptism?: 'SIM' | 'NAO';
  
  // Formação e Status
  membershipDate?: string;
  churchOfOrigin?: string;
  discipleshipCourse?: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  biblicalSchool?: 'ATIVO' | 'INATIVO' | 'NAO_FREQUENTA';
  
  // Ministérios e Cargos
  mainMinistry?: string;
  ministryRole?: string;
  otherMinistries?: string[];
  ecclesiasticalPosition?: string;
  consecrationDate?: string;

  // Financeiro Individual
  isTithable: boolean;
  isRegularGiver: boolean;
  participatesCampaigns: boolean;
  contributions: MemberContribution[];
  
  // Dados de RH / Pagamento
  bank?: string;
  bankAgency?: string;
  bankAccount?: string;
  pixKey?: string;
  dependents?: Dependent[];

  birthDate: string;
  gender: 'M' | 'F' | 'OTHER';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  spouseName?: string;
  marriageDate?: string;
  spiritualGifts?: string;
  cellGroup?: string;
  
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  
  observations?: string;
  specialNeeds?: string;
  talents?: string;
  tags?: string[];
  familyId?: string;
  avatar: string;
  
  // LGPD - Consentimento de Tratamento de Dados
  lgpdConsent?: {
    dataProcessing: boolean;
    communication: boolean;
    marketing: boolean;
    financial: boolean;
    consentDate?: string;
    policyVersion?: string;
    documentUrl?: string;
  };
}

export interface Payroll {
  id: string;
  unitId: string;
  membro_id?: string;
  matricula: string;
  employeeName: string;
  email?: string;
  phone?: string;
  cpf: string;
  rg: string;
  pis: string;
  ctps: string;
  titulo_eleitor?: string;
  reservista?: string;
  aso_data?: string;
  blood_type?: string;
  emergency_contact?: string;
  cargo: string;
  funcao: string;
  departamento: string;
  cbo: string;
  data_admissao: string;
  data_demissao?: string;
  birthDate: string;
  tipo_contrato: 'CLT' | 'PJ' | 'VOLUNTARIO' | 'TEMPORARIO';
  jornada_trabalho: string;
  regime_trabalho: 'PRESENCIAL' | 'HIBRIDO' | 'REMOTO';
  salario_base: number;
  tipo_salario: 'MENSAL' | 'HORISTA' | 'COMISSIONADO';
  sindicato?: string;
  convencao_coletiva?: string;
  he50_qtd: number;
  he100_qtd: number;
  dsr_ativo: boolean;
  adic_noturno_qtd: number;
  insalubridade_grau: 'NONE' | 'MIN' | 'MED' | 'MAX';
  periculosidade_ativo: boolean;
  comissoes: number;
  gratificacoes: number;
  premios: number;
  ats_percentual: number;
  auxilio_moradia: number;
  salario_familia: number;
  arredondamento: number;
  dependentes_qtd: number;
  dependentes_lista?: Dependent[];
  is_pcd: boolean;
  tipo_deficiencia: string;
  banco: string;
  codigo_banco: string;
  agencia: string;
  conta: string;
  tipo_conta: 'CORRENTE' | 'POUPANCA';
  titular: string;
  chave_pix: string;
  vt_ativo: boolean;
  vale_transporte_total: number;
  va_ativo: boolean;
  vale_alimentacao: number;
  vr_ativo: boolean;
  vale_refeicao: number;
  cep?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
  ps_ativo: boolean;
  plano_saude_colaborador: number;
  po_ativo: boolean;
  plano_saude_dependentes: number;
  vale_farmacia: number;
  seguro_vida: number;
  faltas: number;
  atrasos: number;
  adiantamento: number;
  pensao_alimenticia: number;
  consignado: number;
  outros_descontos: number;
  coparticipacoes: number;
  inss: number;
  fgts_retido: number;
  irrf: number;
  fgts_patronal: number;
  inss_patronal: number;
  rat: number;
  terceiros: number;
  month: string;
  year: string;
  total_proventos: number;
  total_descontos: number;
  salario_liquido: number;
  status: 'PAID' | 'PENDING' | 'ACTIVE' | 'INACTIVE';
  cnh_numero?: string;
  cnh_categoria?: string;
  cnh_vencimento?: string;
  // Novos campos adicionados
  sexo?: string;
  estado_civil?: string;
  nacionalidade?: string;
  naturalidade?: string;
  escolaridade?: string;
  raca_cor?: string;
  nome_mae?: string;
  nome_pai?: string;
  email_pessoal?: string;
  telefone?: string;
  celular?: string;
  deficiencia_obs?: string;
  avatar?: string;                    // Avatar do funcionário
  observacoes_saude?: string;         // Observações de saúde
  bh_lancamentos?: any[];            // Lançamentos de banco de horas

  ctps_serie?: string;
  ctps_uf?: string;
  ctps_data_emissao?: string;
  pis_data_cadastro?: string;
  rg_orgao_emissor?: string;
  rg_data_emissao?: string;
  titulo_eleitor_zona?: string;
  titulo_eleitor_secao?: string;
  reservista_numero?: string;
  reservista_categoria?: string;
  documentos_upload?: string;

  data_termino_contrato?: string;
  exame_admissional?: string;
  centro_custo?: string;
  local_trabalho?: string;
  convencao_coletiva_ref?: string;
  forma_pagamento?: string;
  dia_pagamento?: string;
  primeiro_emprego?: boolean;
  optante_fgts?: boolean;

  carga_horaria_semanal?: string;
  escala_trabalho?: string;
  horario_entrada?: string;
  horario_saida?: string;
  inicio_intervalo?: string;
  fim_intervalo?: string;
  duracao_intervalo?: string;
  segunda_a_sexta?: string;
  sabado?: string;
  trabalha_feriados?: boolean;
  tipo_registro_ponto?: string;
  tolerancia_ponto?: string;
  codigo_horario?: string;
  utiliza_banco_horas?: boolean;
  controla_intervalo?: boolean;
  horas_extras_autorizadas?: boolean;

  bh_credito_total?: string;
  bh_debito_total?: string;
  bh_saldo_atual?: string;
  bh_periodo_apuracao?: string;
  bh_data_inicio_acordo?: string;
  bh_data_fim_acordo?: string;
  bh_limite_saldo?: string;
  bh_periodo_compensacao?: string;
  bh_multiplicador_diurna?: string;
  bh_multiplicador_noturna?: string;

  banco_digito_agencia?: string;
  banco_digito_conta?: string;
  banco_tipo_chave_pix?: string;

  vt_optante?: boolean;
  vt_valor_diario?: number;
  vt_qtd_vales_dia?: number;
  vt_linhas_trajeto?: string;
  va_valor_mensal?: number;
  vr_valor_diario?: number;
  vr_operadora?: string;
  vr_desconto_percentual?: number;
  ps_operadora?: string;
  ps_tipo_plano?: string;
  ps_desconto_percentual?: number;
  ps_carteirinha?: string;
  ps_inclui_dependentes?: boolean;
  ps_dependentes_ativo?: boolean;  // Campo faltante adicionado
  va_operadora?: string;          // Campo faltante adicionado
  po_operadora?: string;
  po_valor_mensal?: number;
  po_desconto_percentual?: number;
  po_carteirinha?: string;        // Campo faltante adicionado
  plano_odontologico?: number;    // Campo faltante adicionado
  auxilio_creche?: number;
  auxilio_educacao?: number;
  gympass_plano?: string;

  esocial_categoria?: string;
  esocial_matricula?: string;
  esocial_natureza_atividade?: string;
  esocial_tipo_regime_prev?: string;
  esocial_tipo_regime_trab?: string;
  esocial_indicativo_admissao?: string;
  esocial_tipo_jornada?: string;
  esocial_descricao_jornada?: string;
  esocial_contrato_parcial?: boolean;
  esocial_teletrabalho?: boolean;
  esocial_clausula_asseguratoria?: boolean;
  esocial_sucessao_trab?: boolean;
  esocial_tipo_admissao?: string;
  esocial_cnpj_anterior?: string;
  esocial_matricula_anterior?: string;
  esocial_data_admissao_origem?: string;

  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country?: string;               // Campo adicionado
  };
  
  // LGPD - Consentimento de Tratamento de Dados
  lgpdConsent?: {
    dataProcessing: boolean;
    communication: boolean;
    marketing: boolean;
    financial: boolean;
    consentDate?: string;
    policyVersion?: string;
    documentUrl?: string;
  };
}

// ============================================================================
// INTERFACES DE TESOURARIA (MÓDULO TESOURARIA)
// ============================================================================

/**
 * TIPO DE MOVIMENTO DE TESOURARIA
 * ================================
 */
export type TreasuryMovementType = 
  | 'CLOSING'           // Fechamento de caixa
  | 'WITHDRAWAL'        // Sangria (retirada)
  | 'SUPPLY'            // Suprimento (entrada)
  | 'CARD_RECONCILIATION' // Conciliação de cartão
  | 'CNAB_TRANSFER'     // Transferência via CNAB
  | 'CONSOLIDATION';    // Consolidação de saldos

/**
 * FECHAMENTO DE CAIXA DIÁRIO
 * ==========================
 */
export interface CashClosing {
  id: string;
  unitId: string;
  accountId: string;             // Conta bancária/caixa
  date: string;                  // Data do fechamento (YYYY-MM-DD)
  openingBalance: number;        // Saldo inicial
  totalInflows: number;          // Total de entradas
  totalOutflows: number;         // Total de saídas
  expectedBalance: number;       // Saldo esperado (cálculo)
  actualBalance: number;         // Saldo real (contado)
  difference: number;            // Diferença (quebra de caixa)
  status: 'OPEN' | 'CLOSED' | 'RECONCILING';
  observations?: string;
  closedBy?: string;             // ID do usuário
  closedAt?: string;             // Data/hora fechamento
  createdAt: string;
}

/**
 * SANGRIA / SUPRIMENTO DE CAIXA
 * ==============================
 */
export interface CashMovement {
  id: string;
  unitId: string;
  accountId: string;
  type: 'WITHDRAWAL' | 'SUPPLY';
  amount: number;
  reason: string;                // Motivo da sangria/suprimento
  documentNumber?: string;       // Número do documento (se tiver)
  responsible: string;           // ID do responsável
  authorizedBy?: string;         // ID de quem autorizou
  createdAt: string;
  notes?: string;
}

/**
 * CONCILIAÇÃO DE CARTÕES DE CRÉDITO
 * ==================================
 */
export interface CardReconciliation {
  id: string;
  unitId: string;
  cardOperator: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'HIPERCARD';
  statementMonth: number;        // Mês da fatura (1-12)
  statementYear: number;         // Ano da fatura
  invoiceTotal: number;          // Valor total da fatura
  totalSales: number;            // Total de vendas no período
  totalFees: number;             // Total de taxas/descontos
  netValue: number;              // Valor líquido a receber
  installmentsSales: InstallmentSale[];  // Vendas parceladas
  status: 'PENDING' | 'RECONCILED' | 'PAID';
  paidAt?: string;
  createdAt: string;
}

/**
 * VENDA PARCELADA NO CARTÃO
 * =========================
 */
export interface InstallmentSale {
  id: string;
  reconciliationId: string;
  transactionDate: string;       // Data da venda
  cardNumber: string;            // Nº final do cartão (****1234)
  totalAmount: number;           // Valor total da venda
  installmentNumber: number;     // Parcela atual (ex: 1 de 10)
  totalInstallments: number;     // Total de parcelas
  installmentValue: number;      // Valor da parcela
  feeRate: number;               // Taxa de juros %
  feeValue: number;              // Valor da taxa
  netValue: number;              // Valor líquido da parcela
  expectedDate: string;          // Data esperada de recebimento
  receivedAt?: string;           // Data efetiva do recebimento
}

/**
 * ARQUIVO CNAB (INTEGRAÇÃO BANCÁRIA)
 * ===================================
 */
export interface CNABFile {
  id: string;
  unitId: string;
  accountId: string;
  bank: string;                  // Código do banco (001, 341, etc.)
  fileType: 'REMessa' | 'RETORNO';
  layout: '400' | '240' | '500'; // Layout do CNAB
  filename: string;
  processedAt?: string;
  status: 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'ERROR';
  errorMessage?: string;
  recordsCount: number;
  createdAt: string;
}

/**
 * REGISTRO DE LOTE CNAB
 * =====================
 */
export interface CNABRecord {
  id: string;
  fileId: string;
  lineType: number;              // Tipo de linha (0-9)
  segmentCode?: string;          // Código do segmento
  movementCode?: string;         // Código de movimento
  ourNumber?: string;            // Nosso número
  documentNumber?: string;
  amount: number;
  dates: {
    dueDate?: string;
    processingDate?: string;
    paymentDate?: string;
  };
  beneficiary?: {
    name: string;
    document: string;
    account: string;
    agency: string;
  };
  payer?: {
    name: string;
    document: string;
  };
  rawLine: string;               // Linha original do arquivo
}

/**
 * RESUMO CONSOLIDADO DE TESOURARIA
 * =================================
 */
export interface TreasuryConsolidated {
  unitId: string;
  period: {
    start: string;
    end: string;
  };
  accounts: {
    accountId: string;
    accountName: string;
    openingBalance: number;
    closingBalance: number;
    totalInflows: number;
    totalOutflows: number;
  }[];
  paymentMethods: {
    method: 'CASH' | 'PIX' | 'TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD';
    totalAmount: number;
    count: number;
  }[];
  cardOperators: {
    operator: string;
    totalSales: number;
    totalFees: number;
    netValue: number;
  }[];
  grandTotal: {
    openingBalance: number;
    closingBalance: number;
    inflows: number;
    outflows: number;
    variance: number;            // Variação cambial/quebra de caixa
  };
}

/**
 * ============================================================================
 * MÓDULO DE PATRIMÔNIO
 * ============================================================================
 */

/**
 * Tipos de Bens Patrimoniais
 */
export type AssetType = 
  | 'IMOVEIS'           // Imóveis
  | 'VEICULOS'          // Veículos
  | 'EQUIPAMENTOS'      // Equipamentos
  | 'MOVEIS'            // Móveis e Utensílios
  | 'COMPUTADORES'      // Informática
  | 'MAQUINAS';         // Máquinas e Ferramentas

/**
 * Status do Bem Patrimonial
 */
export type AssetStatus = 
  | 'ATIVO'             // Em uso
  | 'MANUTENCAO'        // Em manutenção
  | 'OCIOSO'            // Sem uso
  | 'BAIXADO'           // Baixado/disponibilizado
  | 'SUCATA';           // Para descarte

/**
 * Método de Depreciação
 */
export type DepreciationMethod = 
  | 'LINEAR'            // Depreciação linear (padrão)
  | 'ACELERADA';        // Depreciação acelerada

/**
 * ============================================================================
 * MÓDULO DE PATRIMÔNIO - INTERFACES AUXILIARES
 * ============================================================================
 */

/**
 * Registro de Depreciação Mensal
 */
export interface AssetDepreciation {
  id: string;
  assetId: string;                   // ID do bem
  unitId: string;
  referenceMonth: number;            // Mês de referência (1-12)
  referenceYear: number;             // Ano de referência
  beginningBookValue: number;        // Valor contábil no início do mês
  depreciationExpense: number;       // Despesa de depreciação do mês
  accumulatedDepreciation: number;   // Depreciação acumulada até o mês
  endingBookValue: number;           // Valor contábil no fim do mês
  accountingEntry?: {                // Lançamento contábil (opcional)
    debitAccount: string;
    creditAccount: string;
    documentNumber: string;
  };
  processedAt: string;
}

/**
 * Transferência de Bem entre Unidades
 */
export interface AssetTransfer {
  id: string;
  assetId: string;
  fromUnitId: string;                // Unidade de origem
  toUnitId: string;                  // Unidade de destino
  transferDate: string;              // Data da transferência
  reason: string;                    // Motivo da transferência
  responsible: string;               // Responsável pela transferência
  authorizedBy: string;              // Autorizado por
  observations?: string;
  status: 'PENDENTE' | 'REALIZADA' | 'CANCELADA';
  createdAt: string;
}

/**
 * Registro de Manutenção de Bem
 */
export interface AssetMaintenance {
  id: string;
  assetId: string;
  unitId: string;
  maintenanceDate: string;           // Data da manutenção
  maintenanceType: 'PREVENTIVA' | 'CORRETIVA' | 'MELHORIA';
  description: string;               // Descrição do serviço
  provider?: string;                 // Prestador de serviço
  cost: number;                      // Custo da manutenção (R$)
  documentNumber?: string;           // Número do documento fiscal
  nextMaintenanceDate?: string;      // Próxima manutenção prevista
  performedBy?: string;              // Realizado por
  status: 'PROGRAMADA' | 'REALIZADA' | 'CANCELADA';
  createdAt: string;
}

/**
 * Contagem de Inventário Físico
 */
export interface InventoryCount {
  id: string;
  unitId: string;
  countDate: string;                 // Data da contagem
  countedBy: string;                 // Responsável pela contagem
  reviewedBy?: string;               // Revisado por
  status: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'REVISAO';
  items: {
    assetId: string;
    assetName: string;
    category: AssetType;
    expectedQuantity: number;        // Quantidade esperada (sistema)
    countedQuantity: number;         // Quantidade contada (física)
    difference: number;              // Diferença (contada - esperada)
    condition: 'BOM' | 'REGULAR' | 'RUIM' | 'SUCATA';
    location?: string;
    observations?: string;
  }[];
  totalAssets: number;
  totalExpected: number;
  totalFound: number;
  totalDifference: number;
  completionPercentage: number;
  startedAt: string;
  completedAt?: string;
}

/**
 * Ajuste de Inventário
 */
export interface InventoryAdjustment {
  id: string;
  inventoryCountId: string;
  assetId: string;
  unitId: string;
  adjustmentType: 'ENTRADA' | 'SAIDA' | 'BAIXA';
  quantity: number;
  reason: string;                    // Motivo do ajuste
  justification: string;             // Justificativa detalhada
  approvedBy?: string;               // Aprovado por
  accountingEntry?: boolean;         // Gerou lançamento contábil?
  createdAt: string;
}

/**
 * CONSENTIMENTO LGPD
 * =================
 */
export interface LGPDConsent {
  id: string;
  userId: string;
  userType: 'MEMBER' | 'EMPLOYEE';
  consentType: 'DATA_PROCESSING' | 'COMMUNICATION' | 'MARKETING' | 'FINANCIAL';
  granted: boolean;
  consentDate: string;
  ipAddress?: string;
  userAgent?: string;
  policyVersion: string;
  revokedDate?: string;
  revokedReason?: string;
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LGPDConsentHistory {
  id: string;
  consentId: string;
  action: 'GRANTED' | 'REVOKED' | 'UPDATED';
  actionDate: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  unitId: string;
  createdAt: string;
}

export interface LGPDPolicy {
  id: string;
  version: string;
  title: string;
  content: string;
  effectiveDate: string;
  isActive: boolean;
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * AVALIAÇÃO DE DESEMPENHO E PDI
 * ==============================
 */
export interface PerformanceEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluationPeriod: string; // "2024-Q1", "2024-01", etc.
  evaluationDate: string;
  evaluationType: 'QUARTERLY' | 'SEMESTRAL' | 'ANNUAL' | 'PROBATION' | 'ADHOC';
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  
  // Competências avaliadas
  competencies: CompetencyEvaluation[];
  
  // Metas e objetivos
  goals: GoalEvaluation[];
  
  // Feedback geral
  overallScore: number; // 0-100
  overallRating: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY';
  strengths: string[];
  improvementAreas: string[];
  comments: string;
  employeeComments?: string;
  
  // PDI - Plano de Desenvolvimento Individual
  pdiPlan: PDIPlan[];
  
  // Metadados
  unitId: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface CompetencyEvaluation {
  id: string;
  competencyId: string;
  competencyName: string;
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'LEADERSHIP' | 'COMMUNICATION';
  description: string;
  weight: number; // Peso na avaliação final (0-1)
  score: number; // Nota 0-100
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  evidence: string[];
  comments: string;
}

export interface GoalEvaluation {
  id: string;
  goalId: string;
  title: string;
  description: string;
  category: 'PRODUCTIVITY' | 'QUALITY' | 'TEAMWORK' | 'LEADERSHIP' | 'DEVELOPMENT';
  targetValue: string;
  actualValue: string;
  achievementPercentage: number; // 0-100
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' | 'OVERDUE';
  dueDate: string;
  comments: string;
}

export interface PDIPlan {
  id: string;
  area: string;
  action: string;
  responsible: 'EMPLOYEE' | 'MANAGER' | 'HR' | 'COMPANY';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  resources?: string[];
  progress: number; // 0-100
  notes?: string;
}

export interface CompetencyTemplate {
  id: string;
  name: string;
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'LEADERSHIP' | 'COMMUNICATION';
  description: string;
  levels: CompetencyLevel[];
  isActive: boolean;
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetencyLevel {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  description: string;
  expectedBehaviors: string[];
  scoreRange: {
    min: number;
    max: number;
  };
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: 'PRODUCTIVITY' | 'QUALITY' | 'TEAMWORK' | 'LEADERSHIP' | 'DEVELOPMENT';
  suggestedWeight: number;
  measurementCriteria: string;
  isActive: boolean;
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback360 {
  id: string;
  evaluationId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerType: 'SELF' | 'MANAGER' | 'PEER' | 'SUBORDINATE' | 'CLIENT';
  relationship: string;
  status: 'PENDING' | 'SUBMITTED' | 'DECLINED';
  submittedDate?: string;
  
  // Avaliações
  competencies: CompetencyEvaluation[];
  strengths: string[];
  improvementAreas: string[];
  overallComments: string;
  isAnonymous: boolean;
  
  // Metadados
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationCycle {
  id: string;
  name: string;
  description: string;
  cycleType: 'QUARTERLY' | 'SEMESTRAL' | 'ANNUAL';
  startDate: string;
  endDate: string;
  evaluationDeadline: string;
  reviewDeadline: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  
  // Configurações
  selfEvaluation: boolean;
  managerEvaluation: boolean;
  peerEvaluation: boolean;
  subordinateEvaluation: boolean;
  clientEvaluation: boolean;
  
  // Competências e metas do ciclo
  competencyTemplates: string[]; // IDs
  goalTemplates: string[]; // IDs
  
  // Estatísticas
  totalEmployees: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DevelopmentPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  managerId: string;
  managerName: string;
  planType: 'PDI' | 'TRAINING' | 'CAREER' | 'SUCCESSION';
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  
  // Objetivos do plano
  objectives: DevelopmentObjective[];
  
  // Cronograma
  startDate: string;
  endDate: string;
  reviewFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMESTRAL';
  
  // Progresso
  overallProgress: number; // 0-100
  lastReviewDate?: string;
  nextReviewDate?: string;
  
  // Orçamento e recursos
  budget?: number;
  allocatedBudget?: number;
  resources: string[];
  
  // Metadados
  unitId: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface DevelopmentObjective {
  id: string;
  title: string;
  description: string;
  category: 'KNOWLEDGE' | 'SKILLS' | 'BEHAVIORS' | 'RESULTS';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  targetOutcome: string;
  successCriteria: string[];
  
  // Progresso
  progress: number; // 0-100
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  completedDate?: string;
  
  // Recursos
  requiredResources: string[];
  allocatedResources: string[];
  
  // Prazos
  targetDate: string;
  actualCompletionDate?: string;
  
  // Feedback
  managerFeedback?: string;
  employeeFeedback?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// HISTÓRICO SALARIAL
// ============================================================================

export interface SalaryHistory {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCargo: string;
  employeeDepartamento: string;
  
  // Dados salariais
  salarioAnterior: number;
  salarioNovo: number;
  percentualAumento: number;
  diferencaValor: number;
  moeda: string;
  
  // Informações da alteração
  tipoAlteracao: 'AUMENTO' | 'PROMOCAO' | 'AJUSTE' | 'CORRECAO' | 'DEMISSAO' | 'REAJUSTE_ANUAL' | 'BONUS';
  motivoAlteracao: string;
  dataAlteracao: string;
  dataVigencia: string;
  
  // Aprovação
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EFFECTIVE';
  solicitanteId: string;
  solicitanteName: string;
  aprovadorId?: string;
  aprovadorName?: string;
  dataAprovacao?: string;
  justificativaAprovacao?: string;
  
  // Compliance e auditoria
  complianceChecklist: {
    aprovacaoDiretoria: boolean;
    verificacaoOrcamento: boolean;
    analiseComparativo: boolean;
    documentoAssinado: boolean;
  };
  
  // Metas e desempenho (se aplicável)
  vinculadoDesempenho: boolean;
  avaliacaoId?: string;
  metaId?: string;
  
  // Observações
  observacoes: string;
  anexos: string[];
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryAdjustmentRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  
  // Proposta de ajuste
  salarioAtual: number;
  salarioProposto: number;
  percentualProposto: number;
  justificativa: string;
  
  // Contexto
  tipoAlteracao: SalaryHistory['tipoAlteracao'];
  dataSolicitacao: string;
  dataVigenciaDesejada: string;
  
  // Análise
  analiseComparativo: {
    mediaCargo: number;
    mediaDepartamento: number;
    faixaSalarial: { min: number; max: number };
    posicaoFaixa: 'ABAIXO' | 'DENTRO' | 'ACIMA';
  };
  
  // Status
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  workflow: WorkflowStep[];
  
  // Documentos
  documentos: {
    avaliacaoDesempenho?: string;
    comprovanteMetas?: string;
    orcamentoAprovado?: string;
    assinaturaSolicitante?: string;
  };
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  stepName: string;
  stepType: 'APPROVAL' | 'REVIEW' | 'NOTIFICATION' | 'EXECUTION';
  responsibleId: string;
  responsibleName: string;
  responsibleRole: string;
  
  // Status do step
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'REJECTED';
  completedAt?: string;
  completedBy?: string;
  comments?: string;
  
  // Configuração
  order: number;
  required: boolean;
  autoApprove: boolean;
  timeLimit?: number; // em horas
  
  createdAt: string;
  updatedAt: string;
}

export interface SalaryReport {
  id: string;
  reportType: 'EVOLUCAO_SALARIAL' | 'DISTRIBUICAO_SALARIAL' | 'AUMENTOS_CONCEDIDOS' | 'PROJECAO_ORCAMENTO' | 'COMPARATIVO_MERCADO';
  
  // Período
  dataInicio: string;
  dataFim: string;
  
  // Filtros aplicados
  filtros: {
    departamentos: string[];
    cargos: string[];
    faixasSalariais: string[];
    tiposAlteracao: string[];
  };
  
  // Métricas
  metricas: {
    totalFuncionarios: number;
    massaSalarialAtual: number;
    mediaSalarial: number;
    medianaSalarial: number;
    totalAumentos: number;
    percentualMedioAumento: number;
    maiorAumento: number;
    menorAumento: number;
  };
  
  // Dados detalhados
  dados: {
    evolucaoMensal: Array<{
      mes: string;
      massaSalarial: number;
      numeroFuncionarios: number;
      mediaSalarial: number;
    }>;
    
    distribuicaoPorDepartamento: Array<{
      departamento: string;
      massaSalarial: number;
      numeroFuncionarios: number;
      mediaSalarial: number;
      percentualTotal: number;
    }>;
    
    aumentosPorTipo: Array<{
      tipo: string;
      quantidade: number;
      valorTotal: number;
      percentualMedio: number;
    }>;
  };
  
  // Análises
  analises: {
    tendenciaAumentos: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE';
    pontosCriticos: string[];
    recomendacoes: string[];
    projecaoOrcamento: {
      proximoAno: number;
      proximos6Meses: number;
    };
  };
  
  // Metadados
  geradoPor: string;
  dataGeracao: string;
  formato: 'PDF' | 'EXCEL' | 'JSON';
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryPolicy {
  id: string;
  nome: string;
  descricao: string;
  
  // Política salarial
  faixasSalariais: Array<{
    nivel: string;
    cargo: string;
    departamento: string;
    salarioMinimo: number;
    salarioMedio: number;
    salarioMaximo: number;
    moeda: string;
  }>;
  
  // Regras de ajuste
  regrasAjuste: {
    percentualMaximoAnual: number;
    percentualMinimoAnual: number;
    periodicidadeRevisao: 'ANUAL' | 'SEMESTRAL' | 'TRIMESTRAL';
    vinculoDesempenho: boolean;
    metaMinimaDesempenho: number;
  };
  
  // Aprovação
  niveisAprovacao: Array<{
    nivel: number;
    valorMaximo: number;
    cargoAprovador: string;
    obrigatorio: boolean;
  }>;
  
  // Vigência
  dataVigencia: string;
  dataExpiracao?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// CONCILIAÇÃO BANCÁRIA
// ============================================================================

export interface BankReconciliation {
  id: string;
  bankAccountId: string;
  bankAccountName: string;
  bankName: string;
  
  // Período da conciliação
  dataInicio: string;
  dataFim: string;
  
  // Saldos
  saldoInicial: number;
  saldoFinal: number;
  saldoConciliado: number;
  diferenca: number;
  
  // Status
  status: 'DRAFT' | 'IN_PROGRESS' | 'CONCILIATED' | 'DISCREPANCY' | 'APPROVED' | 'REJECTED';
  percentualConciliacao: number;
  
  // Transações
  totalTransacoesBanco: number;
  totalTransacoesSistema: number;
  transacoesConciliadas: number;
  transacoesNaoConciliadas: number;
  
  // Divergências
  divergencias: BankDiscrepancy[];
  
  // Responsáveis
  conciliadoPor?: string;
  conciliadoPorNome?: string;
  dataConciliacao?: string;
  aprovadoPor?: string;
  aprovadoPorNome?: string;
  dataAprovacao?: string;
  
  // Observações
  observacoes: string;
  anexos: string[];
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankDiscrepancy {
  id: string;
  reconciliationId: string;
  
  // Tipo de divergência
  tipo: 'MISSING_IN_SYSTEM' | 'MISSING_IN_BANK' | 'VALUE_DIFFERENCE' | 'DATE_DIFFERENCE' | 'DUPLICATE' | 'UNAUTHORIZED';
  gravidade: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Transação envolvida
  transacaoBancoId?: string;
  transacaoSistemaId?: string;
  
  // Detalhes
  descricao: string;
  valorDiferenca?: number;
  dataEsperada?: string;
  dataEncontrada?: string;
  
  // Status
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'IGNORED';
  resolucao?: string;
  dataResolucao?: string;
  
  // Responsável
  responsavelId?: string;
  responsavelNome?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  
  // Dados da transação
  dataTransacao: string;
  dataLancamento?: string;
  descricao: string;
  categoria: string;
  subcategoria?: string;
  
  // Valores
  valor: number;
  moeda: string;
  taxaCambio?: number;
  
  // Informações bancárias
  tipo: 'CREDIT' | 'DEBIT';
  metodoPagamento: 'TRANSFER' | 'PIX' | 'DEPOSIT' | 'WITHDRAWAL' | 'CHECK' | 'BOLETO' | 'CARD';
  
  // Referências
  numeroDocumento?: string;
  codigoAutenticacao?: string;
  numeroOperacao?: string;
  
  // Conciliação
  statusConciliacao: 'NOT_CONCILIATED' | 'CONCILIATED' | 'PARTIALLY_CONCILIATED' | 'DISCREPANCY';
  transacaoSistemaId?: string;
  dataConciliacao?: string;
  
  // Metadados
  origem: 'BANK_STATEMENT' | 'API_IMPORT' | 'MANUAL_ENTRY';
  arquivoOrigem?: string;
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  nomeConta: string;
  bancoNome: string;
  bancoCodigo: string;
  agencia: string;
  numeroConta: string;
  tipoConta: 'CHECKING' | 'SAVINGS' | 'INVESTMENT';
  
  // Configurações
  moeda: string;
  limiteChequeEspecial?: number;
  
  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  
  // Conciliação
  ultimaConciliacao?: string;
  frequenciaConciliacao: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationRule {
  id: string;
  nome: string;
  descricao: string;
  
  // Configuração da regra
  tipoRegra: 'EXACT_MATCH' | 'FUZZY_MATCH' | 'DATE_RANGE' | 'VALUE_RANGE' | 'CATEGORY_MATCH';
  prioridade: number;
  
  // Critérios
  criterios: {
    descricao: string;
    valorMinimo?: number;
    valorMaximo?: number;
    toleranciaData?: number; // em dias
    toleranciaValor?: number; // percentual
    categorias: string[];
    palavrasChave: string[];
  };
  
  // Ações
  acao: 'AUTO_CONCILIATE' | 'FLAG_FOR_REVIEW' | 'CREATE_TRANSACTION';
  
  // Status
  ativo: boolean;
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationReport {
  id: string;
  reconciliationId: string;
  
  // Período
  dataInicio: string;
  dataFim: string;
  
  // Métricas
  metricas: {
    totalTransacoes: number;
    transacoesConciliadas: number;
    taxaConciliacao: number;
    valorTotal: number;
    valorConciliado: number;
    valorNaoConciliado: number;
    numeroDivergencias: number;
  };
  
  // Análise
  analise: {
    principaisCategorias: Array<{
      categoria: string;
      quantidade: number;
      valor: number;
      percentual: number;
    }>;
    
    tendencias: {
      periodoComparativo: string;
      variacaoPercentual: number;
      variacaoValor: number;
    };
    
    recomendacoes: string[];
  };
  
  // Detalhes das divergências
  divergenciasPorTipo: Record<string, number>;
  
  // Metadados
  geradoPor: string;
  dataGeracao: string;
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankStatementImport {
  id: string;
  bankAccountId: string;
  
  // Arquivo
  nomeArquivo: string;
  tipoArquivo: 'OFX' | 'CSV' | 'XLSX' | 'PDF' | 'XML';
  tamanhoArquivo: number;
  
  // Processamento
  status: 'UPLOADING' | 'PROCESSING' | 'PROCESSED' | 'ERROR' | 'VALIDATED';
  dataUpload: string;
  dataProcessamento?: string;
  
  // Resultados
  totalTransacoes: number;
  transacoesImportadas: number;
  transacoesDuplicadas: number;
  transacoesInvalidas: number;
  
  // Erros
  erros: Array<{
    linha: number;
    descricao: string;
    campo?: string;
  }>;
  
  // Validação
  validado: boolean;
  validadoPor?: string;
  dataValidacao?: string;
  
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ============================================================================
 * INTERFACES DE GESTÃO DE TESOURARIA (Semana 5)
 * ============================================================================
 */

/**
 * Fluxo de Caixa
 */
export interface CashFlow {
  id: string;
  data: string;
  descricao: string;
  categoria: 'RECEITA' | 'DESPESA' | 'TRANSFERENCIA';
  valor: number;
  moeda: string;
  contaOrigem?: string;
  contaDestino?: string;
  metodoPagamento: 'DINHEIRO' | 'CHEQUE' | 'TRANSFERENCIA' | 'PIX' | 'CARTAO' | 'BOLETO';
  centroCusto: string;
  projeto: string;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';
  dataPrevista?: string;
  dataConfirmacao?: string;
  observacoes?: string;
  anexos: string[];
  conciliado: boolean;
  dataConciliacao?: string;
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Projeção de Fluxo de Caixa
 */
export interface CashFlowForecast {
  id: string;
  dataInicio: string;
  dataFim: string;
  tipo: 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL' | 'ANUAL';
  saldoInicial: number;
  entradasPrevistas: number;
  saidasPrevistas: number;
  saldoFinalPrevisto: number;
  entradasRealizadas: number;
  saidasRealizadas: number;
  saldoFinalReal: number;
  precisao: number; // percentual de acerto
  status: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  criadoPor: string;
  dataCriacao: string;
  atualizadoPor: string;
  dataAtualizacao: string;
  unitId: string;
  detalhes: CashFlowForecastDetail[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Detalhes da Projeção
 */
export interface CashFlowForecastDetail {
  id: string;
  forecastId: string;
  data: string;
  descricao: string;
  tipo: 'ENTRADA' | 'SAIDA';
  valorPrevisto: number;
  valorRealizado?: number;
  categoria: string;
  centroCusto: string;
  probabilidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CERTA';
  status: 'PREVISTO' | 'REALIZADO' | 'NAO_REALIZADO';
  observacoes?: string;
}

/**
 * Conta de Tesouraria
 */
export interface TreasuryAccount {
  id: string;
  nome: string;
  tipo: 'CONTA_CORRENTE' | 'CONTA_POUPANCA' | 'CONTA_INVESTIMENTO' | 'CARTEIRA_DIGITAL';
  banco: string;
  agencia: string;
  numero: string;
  digito?: string;
  saldo: number;
  saldoBloqueado: number;
  saldoDisponivel: number;
  moeda: string;
  status: 'ATIVA' | 'INATIVA' | 'BLOQUEADA';
  dataAbertura: string;
  dataEncerramento?: string;
  titular: string;
  documentos: string[];
  limites: {
    saqueDiario: number;
    transferenciaDiaria: number;
    emprestimoMaximo: number;
  };
  taxas: {
    manutencao: number;
    saque: number;
    transferencia: number;
  };
  alertas: {
    saldoMinimo: number;
    saldoMaximo: number;
    movimentacaoSuspeita: boolean;
  };
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Investimento
 */
export interface Investment {
  id: string;
  nome: string;
  tipo: 'CDB' | 'LCA' | 'LCA' | 'TESOURO_DIRETO' | 'FUNDO_IMOBILIARIO' | 'ACOES' | 'FUNDO_MULTIMERCADO';
  instituicao: string;
  valorAplicado: number;
  valorAtual: number;
  valorResgate: number;
  rentabilidade: number;
  taxaAdministracao: number;
  dataAplicacao: string;
  dataVencimento: string;
  dataResgate?: string;
  status: 'ATIVO' | 'VENCIDO' | 'RESGATADO' | 'CANCELADO';
  risco: 'CONSERVADOR' | 'MODERADO' | 'ARROJADO';
  liquidez: 'DIARIA' | 'DIAS_30' | 'DIAS_60' | 'DIAS_90' | 'DIAS_180' | 'DIAS_360' | 'VENCIMENTO';
  indexador: 'PRE_FIXADO' | 'POS_FIXADO' | 'INFLACAO' | 'CDI' | 'SELIC';
  taxaIndexador?: number;
  rendimentos: InvestmentEarning[];
  impostos: {
    ir: number;
    iof: number;
  };
  observacoes?: string;
  anexos: string[];
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Rendimentos do Investimento
 */
export interface InvestmentEarning {
  id: string;
  investmentId: string;
  data: string;
  valor: number;
  tipo: 'RENDIMENTO' | 'JUROS' | 'DIVIDENDO' | 'AMORTIZACAO';
  baseCalculo: number;
  aliquota: number;
  valorImposto: number;
  valorLiquido: number;
  status: 'PROJETADO' | 'CREDITADO';
}

/**
 * Empréstimo
 */
export interface Loan {
  id: string;
  nome: string;
  tipo: 'FINANCIAMENTO' | 'CONSIGNADO' | 'CHEQUE_ESPECIAL' | 'ANTECIPACAO' | 'OUTROS';
  instituicao: string;
  valorContratado: number;
  valorLiberado: number;
  valorSaldo: number;
  taxaJuros: number;
  taxaJurosMensal: number;
  carencia: number; // meses
  prazo: number; // meses
  valorParcela: number;
  dataContratacao: string;
  dataPrimeiraParcela: string;
  dataUltimaParcela: string;
  dataLiquidacao?: string;
  status: 'ATIVO' | 'QUITADO' | 'ATRASADO' | 'NEGOCIADO';
  finalidade: string;
  garantias: string[];
  parcelas: LoanInstallment[];
  pagamentos: LoanPayment[];
  multas: {
    atraso: number;
    quitacaoAntecipada: number;
  };
  observacoes?: string;
  anexos: string[];
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Parcela do Empréstimo
 */
export interface LoanInstallment {
  id: string;
  loanId: string;
  numero: number;
  dataVencimento: string;
  dataPagamento?: string;
  valorParcela: number;
  valorJuros: number;
  valorAmortizacao: number;
  valorSaldo: number;
  status: 'PENDENTE' | 'PAGA' | 'ATRASADA' | 'RENEGOCIADA';
  diasAtraso?: number;
  multa?: number;
  jurosAtraso?: number;
}

/**
 * Pagamento do Empréstimo
 */
export interface LoanPayment {
  id: string;
  loanId: string;
  installmentId?: string;
  dataPagamento: string;
  valorPago: number;
  formaPagamento: 'DINHEIRO' | 'CHEQUE' | 'TRANSFERENCIA' | 'PIX' | 'DEBITO';
  bancoOrigem: string;
  comprovante?: string;
  observacoes?: string;
}

/**
 * Alerta de Tesouraria
 */
export interface TreasuryAlert {
  id: string;
  tipo: 'SALDO_MINIMO' | 'SALDO_MAXIMO' | 'VENCIMENTO' | 'OPORTUNIDADE' | 'RISCO';
  titulo: string;
  descricao: string;
  gravidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  contaId?: string;
  investimentoId?: string;
  emprestimoId?: string;
  valor?: number;
  dataLimite?: string;
  status: 'ATIVO' | 'RESOLVIDO' | 'IGNORADO';
  acoesSugeridas: string[];
  dataCriacao: string;
  dataResolucao?: string;
  resolvidoPor?: string;
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Posição Financeira Consolidada
 */
export interface FinancialPosition {
  id: string;
  data: string;
  ativoTotal: number;
  passivoTotal: number;
  patrimonioLiquido: number;
  disponibilidades: number;
  aplicacoes: number;
  contasReceber: number;
  estoques: number;
  ativoFixo: number;
  fornecedores: number;
  emprestimos: number;
  outrasContas: number;
  variacaoPatrimonial: number;
  variacaoPercentual: number;
  indicadores: {
    liquidezCorrente: number;
    liquidezSeca: number;
    endividamento: number;
    rentabilidade: number;
  };
  detalhamento: FinancialPositionDetail[];
  unitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Detalhes da Posição Financeira
 */
export interface FinancialPositionDetail {
  categoria: string;
  subcategoria: string;
  valorAtual: number;
  valorAnterior: number;
  variacao: number;
  variacaoPercentual: number;
  participacao: number; // percentual do total
}

// Export types from submodules
export * from './types/accounting';
export * from './types/financeiro';
