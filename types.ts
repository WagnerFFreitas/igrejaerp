
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
  type: 'TITHE' | 'OFFERING' | 'CAMPAIGN';
  description?: string;
}

export interface Dependent {
  id: string;
  name: string;
  birthDate: string;
  relationship: 'FILHO' | 'CONJUGE' | 'PAI' | 'MAE' | 'OUTRO';
  cpf?: string;
}

// Added missing FinancialAccount interface
export interface FinancialAccount {
  id: string;
  unitId: string;
  name: string;
  type: 'CASH' | 'BANK';
  currentBalance: number;
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
    mealTicket?: number;       // Vale refeição
    transport?: number;        // Vale transporte
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
    irrfBase: number;          // Base de cálculo IRRF
    fgtsBase: number;          // Base de cálculo FGTS
    inssRate: number;          // Alíquota INSS aplicada
    irrfRate: number;          // Alíquota IRRF aplicada
    fgtsRate: number;          // Alíquota FGTS (8% ou 11%)
    dependentDeduction: number;// Dedução por dependente
  };
  
  // INFORMAÇÕES ADICIONAIS
  workingDays: number;         // Dias trabalhados no mês
  absenceDays: number;         // Dias faltados
  overtimeHours: number;       // Horas extras
  paidAt?: string;             // Data do pagamento
  status: 'CALCULATED' | 'PAID' | 'CANCELLED';
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
}

// Added missing AuditLog interface
export interface AuditLog {
  id: string;
  unitId: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  date: string;
  ip: string;
}

// Added missing TaxConfig interface
export interface TaxConfig {
  inssBrackets: { limit: number; rate: number }[];
  irrfBrackets: { limit: number; rate: number; deduction: number }[];
  fgtsRate: number;
  patronalRate: number;
  ratRate: number;
  terceirosRate: number;
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
}

export interface Payroll {
  id: string;
  unitId: string;
  membro_id?: string;
  matricula: string;
  employeeName: string;
  email?: string;
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
  insalubridade_grau: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  periculosidade_ativo: boolean;
  comissoes: number;
  gratificacoes: number;
  premios: number;
  ats_percentual: number;
  auxilio_moradia: number;
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

// Export types from submodules
export * from './types/accounting';
export * from './types/financeiro';
