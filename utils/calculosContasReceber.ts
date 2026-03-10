/**
 * ============================================================================
 * UTILITÁRIOS PARA CONTAS A RECEBER
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este arquivo contém funções auxiliares (helpers) para cálculos específicos
 * de contas a receber. Ele reutiliza funções genéricas do financialCalculations.ts
 * e adiciona funções específicas para gestão de recebimentos.
 * 
 * PRINCIPAIS FUNÇÕES:
 * • Calcular dias em atraso
 * • Calcular juros e multa por atraso
 * • Gerar proposta de renegociação
 * • Verificar se está em período de alerta de vencimento
 * • Calcular valor total com encargos
 * 
 * ANALOGIA:
 * ---------
 * Pense como uma calculadora especializada de cobrança:
 * - Calcula quanto o devedor deve pagar
 * - Inclui juros, multa, descontos
 * - Gera novas propostas de pagamento
 */

import { Transaction } from '../types';
import { 
  calcularJurosSimples, 
  calcularMulta, 
  calcularDesconto,
  calcularDiasAtraso,
  formatCurrency 
} from './calculosFinanceiros';

/**
 * RESULTADO DA RENEGOCIAÇÃO
 * =========================
 * Estrutura retornada ao propor renegociação
 */
export interface RenegotiationProposal {
  originalAmount: number;      // Valor original da dívida
  interestAmount: number;      // Juros calculados
  penaltyAmount: number;       // Multa calculada
  discountAmount: number;      // Desconto concedido
  totalAmount: number;         // Total final
  installmentOptions: {        // Opções de parcelamento
    count: number;
    installmentValue: number;
  }[];
  dueDate: string;             // Novo vencimento
}

/**
 * ALERTA DE VENCIMENTO
 * ====================
 * Informações sobre contas próximas do vencimento
 */
export interface PaymentAlert {
  transactionId: string;
  description: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  alertLevel: 'WARNING' | 'CRITICAL' | 'OVERDUE';
}

/**
 * CALCULAR DIAS EM ATRASO
 * -----------------------
 * 
 * O QUE FAZ?
 * Quantos dias a transação está vencida
 * 
 * PARÂMETROS:
 * - dueDate: string → Data de vencimento
 * - referenceDate?: string → Data de referência (hoje se não passar)
 * 
 * RETORNO:
 * number → Dias em atraso (0 se não venceu, negativo se ainda não venceu)
 * 
 * EXEMPLO:
 * calcularDiasEmAtraso('2024-01-01', '2024-01-11') → 10 dias
 */
export function calcularDiasEmAtraso(
  dueDate: string,
  referenceDate: string = new Date().toISOString()
): number {
  const vencimento = new Date(dueDate);
  const hoje = new Date(referenceDate);
  
  // Diferença em milissegundos
  const diffMs = hoje.getTime() - vencimento.getTime();
  
  // Converte para dias (1 dia = 86400000 ms)
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * VERIFICAR NÍVEL DE ALERTA
 * -------------------------
 * 
 * O QUE FAZ?
 * Classifica quão urgente é o pagamento
 * 
 * PARÂMETROS:
 * - dueDate: string → Data de vencimento
 * 
 * RETORNO:
 * 'WARNING' | 'CRITICAL' | 'OVERDUE' | 'OK'
 * 
 * REGRAS:
 * - OK: Ainda não venceu
 * - WARNING: Vence em 3-5 dias
 * - CRITICAL: Vence em 1-2 dias
 * - OVERDUE: Já venceu
 */
export function verificarNivelAlerta(dueDate: string): 'OK' | 'WARNING' | 'CRITICAL' | 'OVERDUE' {
  const diasParaVencer = calcularDiasEmAtraso(dueDate) * -1;  // Inverte sinal
  
  if (diasParaVencer < 0) {
    return 'OVERDUE';  // Já venceu (dias negativos = atraso)
  } else if (diasParaVencer <= 2) {
    return 'CRITICAL';  // Vence em 1-2 dias
  } else if (diasParaVencer <= 5) {
    return 'WARNING';   // Vence em 3-5 dias
  } else {
    return 'OK';        // Ainda tem tempo
  }
}

/**
 * GERAR ALERTAS DE VENCIMENTO
 * ---------------------------
 * 
 * O QUE FAZ?
 * Lista todas as transações que precisam de atenção
 * 
 * PARÂMETROS:
 * - transactions: Transaction[] → Lista de transações
 * - alertDays: number → Com quantos dias de antecedência alertar (padrão: 5)
 * 
 * RETORNO:
 * PaymentAlert[] → Lista de alertas ordenada por urgência
 */
export function gerarAlertasDeVencimento(
  transactions: Transaction[],
  alertDays: number = 5
): PaymentAlert[] {
  const alerts: PaymentAlert[] = [];
  
  // Filtra só as pendentes
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING');
  
  pendingTransactions.forEach(transaction => {
    const dueDate = transaction.dueDate || transaction.date;
    const nivelAlerta = verificarNivelAlerta(dueDate);
    
    // Só inclui se tiver alerta (não OK)
    if (nivelAlerta !== 'OK') {
      const diasParaVencer = calcularDiasEmAtraso(dueDate) * -1;
      
      alerts.push({
        transactionId: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        dueDate,
        daysUntilDue: diasParaVencer,
        alertLevel: nivelAlerta === 'OVERDUE' ? 'OVERDUE' : 
                    nivelAlerta === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
      });
    }
  });
  
  // Ordena: OVERDUE primeiro, depois CRITICAL, depois WARNING
  alerts.sort((a, b) => {
    const priority = { OVERDUE: 0, CRITICAL: 1, WARNING: 2 };
    return priority[a.alertLevel] - priority[b.alertLevel];
  });
  
  return alerts;
}

/**
 * CALCULAR ENCARGOS POR ATRASO
 * ----------------------------
 * 
 * O QUE FAZ?
 * Soma juros + multa por estar em atraso
 * 
 * PARÂMETROS:
 * - transaction: Transaction → Transação vencida
 * - interestRateDaily: number → Taxa de juros diária % (ex: 0.33 = 0.33% ao dia)
 * - penaltyRate: number → Taxa de multa % (ex: 2 = 2%)
 * 
 * RETORNO:
 * {
 *   originalAmount: number,  // Valor original
 *   interestAmount: number,  // Juros calculados
 *   penaltyAmount: number,   // Multa calculada
 *   totalAmount: number      // Total com encargos
 * }
 * 
 * EXEMPLO:
 * Dívida: R$ 1000, atraso: 10 dias, juros: 0.33%/dia, multa: 2%
 * → Juros: R$ 33, Multa: R$ 20, Total: R$ 1053
 */
export function calcularEncargosPorAtraso(
  transaction: Transaction,
  interestRateDaily: number = 0.33,
  penaltyRate: number = 2
): {
  originalAmount: number;
  interestAmount: number;
  penaltyAmount: number;
  totalAmount: number;
  daysLate: number;
} {
  const dueDate = transaction.dueDate || transaction.date;
  const daysLate = calcularDiasEmAtraso(dueDate);
  
  // Se não venceu, sem encargos
  if (daysLate <= 0) {
    return {
      originalAmount: transaction.amount,
      interestAmount: 0,
      penaltyAmount: 0,
      totalAmount: transaction.amount,
      daysLate: 0,
    };
  }
  
  // Calcula juros
  const interestAmount = calcularJurosSimples(
    transaction.amount,
    interestRateDaily,
    daysLate
  );
  
  // Calcula multa
  const penaltyAmount = calcularMulta(transaction.amount, penaltyRate);
  
  // Total
  const totalAmount = transaction.amount + interestAmount + penaltyAmount;
  
  return {
    originalAmount: transaction.amount,
    interestAmount,
    penaltyAmount,
    totalAmount,
    daysLate,
  };
}

/**
 * GERAR PROPOSTA DE RENEGOCIAÇÃO
 * ------------------------------
 * 
 * O QUE FAZ?
 * Cria opções de pagamento para dívidas vencidas
 * 
 * PARÂMETROS:
 * - transaction: Transaction → Dívida a renegociar
 * - discountRate: number → Desconto máximo permitido % (padrão: 5%)
 * - maxInstallments: number → Máximo de parcelas (padrão: 12)
 * 
 * RETORNO:
 * RenegotiationProposal → Proposta completa com opções
 * 
 * COMO FUNCIONA:
 * 1. Calcula encargos (juros + multa)
 * 2. Aplica desconto (se pagamento à vista)
 * 3. Gera opções de parcelamento (1x a 12x)
 * 4. Retorna tudo organizado
 */
export function gerarPropostaDeRenegociacao(
  transaction: Transaction,
  discountRate: number = 5,
  maxInstallments: number = 12
): RenegotiationProposal {
  // 1. Calcula encargos
  const encargos = calcularEncargosPorAtraso(transaction);
  
  // 2. Calcula desconto para pagamento à vista
  const valorComEncargos = encargos.totalAmount;
  const { valorDesconto, valorFinal } = calcularDesconto(valorComEncargos, discountRate);
  
  // 3. Gera opções de parcelamento
  const installmentOptions = [];
  
  for (let i = 1; i <= maxInstallments; i++) {
    // Parcelamento tem juro zero (simplificado)
    const valorParcela = valorComEncargos / i;
    
    installmentOptions.push({
      count: i,
      installmentValue: parseFloat(valorParcela.toFixed(2)),
    });
  }
  
  // 4. Retorna proposta completa
  return {
    originalAmount: transaction.amount,
    interestAmount: encargos.interestAmount,
    penaltyAmount: encargos.penaltyAmount,
    discountAmount: valorDesconto,
    totalAmount: valorFinal,  // À vista com desconto
    installmentOptions,
    dueDate: new Date().toISOString().split('T')[0],
  };
}

/**
 * VERIFICAR SE ESTÁ EM PERÍODO DE CARÊNCIA
 * ----------------------------------------
 * 
 * O QUE FAZ?
 * Descobre se a transação ainda está no período antes do vencimento
 * 
 * PARÂMETROS:
 * - dueDate: string → Data de vencimento
 * - gracePeriodDays: number → Dias de carência (padrão: 3)
 * 
 * RETORNO:
 * boolean → true se ainda está na carência, false se já venceu ou passou
 * 
 * EXEMPLO:
 * Vencimento: 01/03/2024, Carência: 3 dias
 * Hoje: 03/03/2024 → true (ainda na carência)
 * Hoje: 05/03/2024 → false (passou da carência)
 */
export function estaEmPeriodoDeCarencia(
  dueDate: string,
  gracePeriodDays: number = 3
): boolean {
  const vencimento = new Date(dueDate);
  const hoje = new Date();
  
  // Calcula fim da carência
  const fimCarencia = new Date(vencimento);
  fimCarencia.setDate(fimCarencia.getDate() + gracePeriodDays);
  
  // Verifica se hoje está antes do fim da carência
  return hoje <= fimCarencia;
}

/**
 * CALCULAR VALOR LÍQUIDO DE RECEBIMENTO
 * -------------------------------------
 * 
 * O QUE FAZ?
 * Quanto realmente será recebido após taxas/descontos
 * 
 * PARÂMETROS:
 * - grossAmount: number → Valor bruto
 * - feeRate: number → Taxa de administração % (ex: 1.5%)
 * - taxRate: number → Imposto % (ex: 5%)
 * 
 * RETORNO:
 * {
 *   grossAmount: number,   // Bruto
 *   fees: number,          // Taxas
 *   taxes: number,         // Impostos
 *   netAmount: number      // Líquido
 * }
 * 
 * EXEMPLO:
 * Bruto: R$ 1000, Taxa: 1.5%, Imposto: 5%
 * → Taxas: R$ 15, Impostos: R$ 50, Líquido: R$ 935
 */
export function calcularValorLiquidoDeRecebimento(
  grossAmount: number,
  feeRate: number = 0,
  taxRate: number = 0
): {
  grossAmount: number;
  fees: number;
  taxes: number;
  netAmount: number;
} {
  // Calcula taxas
  const fees = (grossAmount * feeRate) / 100;
  
  // Calcula impostos
  const taxes = (grossAmount * taxRate) / 100;
  
  // Líquido
  const netAmount = grossAmount - fees - taxes;
  
  return {
    grossAmount,
    fees,
    taxes,
    netAmount,
  };
}

/**
 * FILTRAR TRANSAÇÕES POR STATUS DE VENCIMENTO
 * -------------------------------------------
 * 
 * O QUE FAZ?
 * Separa transações por quão perto estão do vencimento
 * 
 * PARÂMETROS:
 * - transactions: Transaction[] → Lista de transações
 * - status: 'OVERDUE' | 'DUE_TODAY' | 'DUE_SOON' | 'FUTURE'
 * 
 * RETORNO:
 * Transaction[] → Apenas as do status solicitado
 * 
 * DEFINIÇÕES:
 * - OVERDUE: Já venceu
 * - DUE_TODAY: Vence hoje
 * - DUE_SOON: Vence nos próximos 5 dias
 * - FUTURE: Vence depois de 5 dias
 */
export function filtrarPorStatusDeVencimento(
  transactions: Transaction[],
  status: 'OVERDUE' | 'DUE_TODAY' | 'DUE_SOON' | 'FUTURE'
): Transaction[] {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);  // Zera horas para comparação justa
  
  return transactions.filter(transaction => {
    const dueDateStr = transaction.dueDate || transaction.date;
    const vencimento = new Date(dueDateStr);
    vencimento.setHours(0, 0, 0, 0);
    
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (status) {
      case 'OVERDUE':
        return diffDays < 0;  // Já venceu
        
      case 'DUE_TODAY':
        return diffDays === 0;  // Vence hoje
        
      case 'DUE_SOON':
        return diffDays > 0 && diffDays <= 5;  // Próximos 5 dias
        
      case 'FUTURE':
        return diffDays > 5;  // Depois de 5 dias
        
      default:
        return true;
    }
  });
}

/**
 * SOMAR TOTAL POR STATUS
 * ----------------------
 * 
 * O QUE FAZ?
 * Agrupa valores por categoria de vencimento
 * 
 * PARÂMETROS:
 * - transactions: Transaction[] → Lista de transações
 * 
 * RETORNO:
 * {
 *   overdue: number,     // Total vencido
 *   dueToday: number,    // Total que vence hoje
 *   dueSoon: number,     // Total que vence em breve
 *   future: number,      // Total futuro
 *   total: number        // Tudo somado
 * }
 */
export function somarTotalPorStatus(transactions: Transaction[]): {
  overdue: number;
  dueToday: number;
  dueSoon: number;
  future: number;
  total: number;
} {
  const overdue = filtrarPorStatusDeVencimento(transactions, 'OVERDUE')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const dueToday = filtrarPorStatusDeVencimento(transactions, 'DUE_TODAY')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const dueSoon = filtrarPorStatusDeVencimento(transactions, 'DUE_SOON')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const future = filtrarPorStatusDeVencimento(transactions, 'FUTURE')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    overdue,
    dueToday,
    dueSoon,
    future,
    total: overdue + dueToday + dueSoon + future,
  };
}
