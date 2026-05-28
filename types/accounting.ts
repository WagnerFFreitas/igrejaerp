/**
 * ============================================================================
 * ACCOUNTING.TS
 * ============================================================================
 *
 * Tipos contábeis para Módulo de Departamento Pessoal.
 * Nomenclatura PT-BR alinhada ao schema PostgreSQL.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type TipoConta = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
/** @deprecated Use TipoConta */
export type AccountType = TipoConta;

export type GrupoConta =
  | 'Salários e Ordenados'
  | 'Encargos Sociais e Trabalhistas'
  | 'Benefícios'
  | 'Provisões Trabalhistas'
  | 'Rescisões'
  | 'Contas a Pagar - Folha'
  | 'Contas de Compensação';
/** @deprecated Use GrupoConta */
export type AccountGroup = GrupoConta;

export type FonteLancamento = 'PAYROLL' | 'MANUAL' | 'ESOCIAL' | 'BANK' | 'PROVISION';
/** @deprecated Use FonteLancamento */
export type JournalEntrySource = FonteLancamento;

export type TipoProvisao = 'VACATION' | 'CHRISTMAS_BONUS' | 'FINE_40' | 'NOTICE_PERIOD';
/** @deprecated Use TipoProvisao */
export type ProvisionType = TipoProvisao;

export type SituacaoProvisao = 'ACCRUED' | 'USED' | 'REVERSED';
/** @deprecated Use SituacaoProvisao */
export type ProvisionStatus = SituacaoProvisao;

export type SituacaoEventoEsocial = 'GENERATED' | 'SENT' | 'ERROR' | 'PROCESSED' | 'CANCELLED';
/** @deprecated Use SituacaoEventoEsocial */
export type ESocialEventStatus = SituacaoEventoEsocial;

// ============================================================================
// CONTA CONTÁBIL
// ============================================================================

export interface ContaContabil {
  id: string;
  codigo: string;
  nome: string;
  tipo: TipoConta;
  grupo: GrupoConta;
  idUnidade: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  descricao?: string;
  codigoContaPai?: string;
}
/** @deprecated Use ContaContabil */
export type AccountingAccount = ContaContabil;

// ============================================================================
// LANÇAMENTO CONTÁBIL
// ============================================================================

export interface LinhaLancamentoContabil {
  id: string;
  idLancamento: string;
  idConta: string;
  codigoConta: string;
  descricao: string;
  debito: number;
  credito: number;
  idCentroCusto?: string;
  idFuncionario?: string;
  idProjeto?: string;
  numeroDocumento?: string;
}
/** @deprecated Use LinhaLancamentoContabil */
export type JournalEntryLine = LinhaLancamentoContabil;

export interface LancamentoDiario {
  id: string;
  idUnidade: string;
  data: string;
  historico: string;
  numeroDocumento?: string;
  linhas: LinhaLancamentoContabil[];
  origem: FonteLancamento;
  dataCriacao: string;
  criadoPor: string;
  contabilizado: boolean;
  contabilizadoEm?: string;
  contabilizadoPor?: string;
  totalDebitos: number;
  totalCreditos: number;
  estaBalanceado: boolean;
}
/** @deprecated Use LancamentoDiario */
export type JournalEntry = LancamentoDiario;

// ============================================================================
// PROVISÃO TRABALHISTA
// ============================================================================

export interface ProvisaoTrabalhista {
  id: string;
  idUnidade: string;
  idFuncionario: string;
  nomeFuncionario: string;
  tipo: TipoProvisao;
  mes: number;
  ano: number;
  valorProvisionado: number;
  valorUtilizado?: number;
  saldo: number;
  situacao: SituacaoProvisao;
  dataCriacao: string;
  revertidoEm?: string;
  utilizadoEm?: string;
  observacoes?: string;
}
/** @deprecated Use ProvisaoTrabalhista */
export type PayrollProvision = ProvisaoTrabalhista;

// ============================================================================
// EVENTO ESOCIAL
// ============================================================================

export interface EventoEsocial {
  id: string;
  idUnidade: string;
  tipoEvento: string;
  idFuncionario?: string;
  xml: string;
  recibo?: string;
  situacao: SituacaoEventoEsocial;
  mensagemErro?: string;
  enviadoEm?: string;
  processadoEm?: string;
  protocolo?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
/** @deprecated Use EventoEsocial */
export type ESocialEvent = EventoEsocial;

// ============================================================================
// RESULTADO DO PROCESSAMENTO DA FOLHA
// ============================================================================

export interface ResultadoProcessamentoFolha {
  funcionariosProcessados: number;
  totalSalarioBruto: number;
  totalInss: number;
  totalIrrf: number;
  totalFgts: number;
  totalEncargosEmpregador: number;
  totalSalarioLiquido: number;
  lancamentoContabilGerado: boolean;
  eventosEsocialGerados: boolean;
  erros: ErroFolha[];
}
/** @deprecated Use ResultadoProcessamentoFolha */
export type PayrollProcessingResult = ResultadoProcessamentoFolha;

export interface ErroFolha {
  idFuncionario: string;
  nomeFuncionario: string;
  erro: string;
  campo?: string;
  gravidade: 'ERROR' | 'WARNING';
}
/** @deprecated Use ErroFolha */
export type PayrollError = ErroFolha;

// ============================================================================
// CONFIGURAÇÃO TRIBUTÁRIA (manter em inglês — cálculo matemático puro)
// ============================================================================

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

export interface TaxBracket {
  limit: number;
  rate: number;
}

export interface IRRFBracket {
  limit: number;
  rate: number;
  deduction: number;
}

// ============================================================================
// RESUMO CONTÁBIL MENSAL
// ============================================================================

export interface ResumoContabilMensal {
  mes: number;
  ano: number;
  totalSalarios: number;
  totalEncargos: number;
  totalBeneficios: number;
  totalProvisoes: number;
  totalRescisoes: number;
  quantidadeLancamentos: number;
  quantidadeEventosEsocial: number;
}
/** @deprecated Use ResumoContabilMensal */
export type MonthlyAccountingSummary = ResumoContabilMensal;
