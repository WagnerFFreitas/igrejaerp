import { Transaction } from '../types';

export const TRANSACTION_FIELDS = {
  descricao: 'description',
  valor: 'amount',
  situacao: 'status',
  dataTransacao: 'date',
  tipoTransacao: 'type',
  categoria: 'category',
  centroCusto: 'costCenter',
  naturezaOperacao: 'operationNature',
  contaId: 'accountId',
  membroId: 'memberId',
  formaPagamento: 'paymentMethod',
  dataVencimento: 'dueDate',
  valorPago: 'paidAmount',
  valorRestante: 'remainingAmount',
  ehParcelado: 'isInstallment',
  numeroParcela: 'installmentNumber',
  totalParcelas: 'totalInstallments',
  paiId: 'parentId',
  conciliado: 'isConciliated',
  dataConciliacao: 'conciliationDate',
  observacoes: 'notes',
  idExterno: 'externalId',
  criadoEm: 'createdAt',
  atualizadoEm: 'updatedAt',
  unidadeId: 'unitId',
};

export const ACCOUNT_FIELDS = {
  nome: 'name',
  tipo: 'type',
  saldoAtual: 'currentBalance',
  saldoMinimo: 'minimumBalance',
  codigoBanco: 'bankCode',
  numeroAgencia: 'agencyNumber',
  numeroConta: 'accountNumber',
  estaAtivo: 'isActive',
};

export const ASSET_FIELDS = {
  descricao: 'description',
  categoria: 'category',
  dataAquisicao: 'acquisitionDate',
  valorAquisicao: 'acquisitionValue',
  valorAtual: 'currentValue',
  taxaDepreciacao: 'depreciationRate',
  metodoDepreciacao: 'depreciationMethod',
  valorContabilAtual: 'currentBookValue',
  depreciacaoAcumulada: 'accumulatedDepreciation',
  vidaUtilMeses: 'usefulLifeMonths',
  localizacao: 'location',
  situacao: 'status',
  condicao: 'condition',
  numeroAtivo: 'assetNumber',
  numeroSerie: 'serialNumber',
  notaFiscalAquisicao: 'invoiceNumber',
  observacoes: 'observations',
};

export function normalizeTransactionFields(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...data };
  for (const [pt, en] of Object.entries(TRANSACTION_FIELDS)) {
    if (data[en] !== undefined && data[pt] === undefined) {
      result[pt] = data[en];
    }
  }
  return result;
}

export function normalizeAccountFields(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...data };
  for (const [pt, en] of Object.entries(ACCOUNT_FIELDS)) {
    if (data[en] !== undefined && data[pt] === undefined) {
      result[pt] = data[en];
    }
  }
  return result;
}

export function normalizeAssetFields(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...data };
  for (const [pt, en] of Object.entries(ASSET_FIELDS)) {
    if (data[en] !== undefined && data[pt] === undefined) {
      result[pt] = data[en];
    }
  }
  return result;
}