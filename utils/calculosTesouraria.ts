/**
 * ============================================================================
 * UTILITÁRIOS PARA CÁLCULOS DE TESOURARIA
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este arquivo contém funções matemáticas e financeiras para cálculos
 * específicos de tesouraria, incluindo taxas de cartões, rateios e
 * projeções de recebíveis.
 * 
 * PRINCIPAIS FUNÇÕES:
 * • Cálculo de taxas de cartões de crédito
 * • Projeção de recebíveis de parcelamentos
 * • Rateio de taxas por transação
 * • Validação de cálculos CNAB
 * • Análise de spread bancário
 * 
 * ANALOGIA:
 * ---------
 * Pense como uma "calculadora financeira especializada":
 * - Calcula quanto o banco desconta nas vendas
 * - Projeta quando você vai receber cada parcela
 * - Divide as taxas proporcionalmente
 * - Compara custos de diferentes operadoras
 */

import { InstallmentSale, CardReconciliation } from '../types';

/**
 * DADOS DE UMA ÚNICA PARCELA
 */
interface InstallmentData {
  installmentNumber: number;
  totalInstallments: number;
  grossValue: number;
  feeRate: number;
  netValue: number;
  feeValue: number;
  expectedDate: string;
}

/**
 * RESUMO DE CONCILIAÇÃO DE CARTÃO
 */
interface CardReconciliationSummary {
  totalSales: number;
  totalFees: number;
  netValue: number;
  averageFeeRate: number;
  installments: InstallmentData[];
}

/**
 * ============================================================================
 * CÁLCULO DE TAXAS DE CARTÕES DE CRÉDITO
 * ============================================================================
 */

/**
 * Calcula taxas e valores líquidos de venda no cartão
 * 
 * FÓRMULA:
 * Valor Líquido = Valor Bruto - (Valor Bruto × Taxa %)
 * 
 * @param grossValue - Valor bruto da venda
 * @param feeRate - Taxa da operadora (% ao mês)
 * @param installments - Número de parcelas
 * @returns Dados completos da parcela
 */
export function calculateCardInstallment(
  grossValue: number,
  feeRate: number,
  installments: number
): InstallmentData[] {
  const result: InstallmentData[] = [];
  
  // Valor base por parcela (sem juros)
  const baseValue = grossValue / installments;
  
  for (let i = 1; i <= installments; i++) {
    // Calcula taxa proporcional ao tempo de espera
    // Parcelas mais distantes têm taxa maior
    const timeFactor = 1 + ((i - 1) * 0.05); // 5% a mais por mês de espera
    const adjustedFeeRate = feeRate * timeFactor;
    
    // Calcula valor da taxa
    const feeValue = baseValue * (adjustedFeeRate / 100);
    
    // Calcula valor líquido
    const netValue = baseValue - feeValue;
    
    // Data esperada (mês a mês)
    const expectedDate = new Date();
    expectedDate.setMonth(expectedDate.getMonth() + (i - 1));
    
    result.push({
      installmentNumber: i,
      totalInstallments: installments,
      grossValue: baseValue,
      feeRate: adjustedFeeRate,
      netValue,
      feeValue,
      expectedDate: expectedDate.toISOString().split('T')[0],
    });
  }
  
  return result;
}

/**
 * Calcula resumo completo de conciliação de cartão
 * 
 * @param totalSales - Total de vendas no período
 * @param feeRate - Taxa média da operadora
 * @param installmentsData - Dados de todas as parcelas
 * @returns Resumo da conciliação
 */
export function calculateCardReconciliation(
  totalSales: number,
  feeRate: number,
  installmentsData: Array<{ count: number; value: number }>
): CardReconciliationSummary {
  let totalFees = 0;
  let totalNetValue = 0;
  const allInstallments: InstallmentData[] = [];
  
  // Processa cada grupo de parcelamentos
  installmentsData.forEach(({ count, value }) => {
    const installments = calculateCardInstallment(value, feeRate, count);
    
    installments.forEach(inst => {
      totalFees += inst.feeValue;
      totalNetValue += inst.netValue;
      allInstallments.push(inst);
    });
  });
  
  // Calcula taxa média ponderada
  const averageFeeRate = totalSales > 0 ? (totalFees / totalSales) * 100 : 0;
  
  return {
    totalSales,
    totalFees,
    netValue: totalNetValue,
    averageFeeRate,
    installments: allInstallments,
  };
}

/**
 * ============================================================================
 * RATEIO DE TAXAS POR TRANSAÇÃO
 * ============================================================================
 */

/**
 * Rateia taxa total proporcionalmente entre várias transações
 * 
 * EXEMPLO:
 * Se você tem R$ 100 de taxa para dividir entre 3 vendas
 * de R$ 50, R$ 30 e R$ 20, o rateio é proporcional.
 * 
 * @param totalFee - Taxa total a ratear
 * @param transactions - Valores das transações
 * @returns Taxa rateada para cada transação
 */
export function allocateFeeByTransaction(
  totalFee: number,
  transactions: number[]
): number[] {
  const totalAmount = transactions.reduce((sum, val) => sum + val, 0);
  
  if (totalAmount === 0) {
    return transactions.map(() => 0);
  }
  
  return transactions.map(value => {
    // Proporção do valor desta transação no total
    const proportion = value / totalAmount;
    
    // Taxa proporcional
    return totalFee * proportion;
  });
}

/**
 * ============================================================================
 * PROJEÇÃO DE RECEBÍVEIS
 * ============================================================================
 */

/**
 * Projeta recebíveis de vendas parceladas por mês
 * 
 * @param sales - Vendas realizadas
 * @param monthsAhead - Quantos meses projetar
 * @returns Projeção mês a mês
 */
export function projectReceivables(
  sales: Array<{
    date: string;
    amount: number;
    installments: number;
  }>,
  monthsAhead: number
): Array<{ month: string; amount: number }> {
  const projection: Record<string, number> = {};
  
  // Inicializa meses vazios
  const today = new Date();
  for (let i = 0; i < monthsAhead; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() + i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    projection[key] = 0;
  }
  
  // Processa cada venda
  sales.forEach(({ date, amount, installments }) => {
    const saleDate = new Date(date);
    const installmentValue = amount / installments;
    
    // Distribui parcelas mês a mês
    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(saleDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      const key = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (projection.hasOwnProperty(key)) {
        projection[key] += installmentValue;
      }
    }
  });
  
  // Converte para array ordenado
  return Object.entries(projection)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * ============================================================================
 * ANÁLISE DE SPREAD BANCÁRIO
 * ============================================================================
 */

/**
 * Calcula spread (diferença) entre taxas de diferentes operadoras
 * 
 * @param operators - Operadoras com suas taxas
 * @returns Comparativo e melhor opção
 */
export function analyzeBankSpread(
  operators: Array<{ name: string; feeRate: number; mdr: number }>
): {
  bestOption: string;
  worstOption: string;
  spread: number;
  analysis: string;
} {
  if (operators.length === 0) {
    return {
      bestOption: '',
      worstOption: '',
      spread: 0,
      analysis: 'Nenhuma operadora informada',
    };
  }
  
  // Ordena por taxa (menor para maior)
  const sorted = [...operators].sort((a, b) => a.feeRate - b.feeRate);
  
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const spread = worst.feeRate - best.feeRate;
  
  // Calcula economia anual estimada
  const estimatedVolume = 100000; // R$ 100k/mês (exemplo)
  const annualSavings = (spread / 100) * estimatedVolume * 12;
  
  return {
    bestOption: best.name,
    worstOption: worst.name,
    spread,
    analysis: `Melhor: ${best.name} (${best.feeRate.toFixed(2)}%) | ` +
              `Pior: ${worst.name} (${worst.feeRate.toFixed(2)}%) | ` +
              `Spread: ${spread.toFixed(2)}% | ` +
              `Economia anual estimada: R$ ${annualSavings.toFixed(2)}`,
  };
}

/**
 * ============================================================================
 * VALIDAÇÃO DE CÁLCULOS CNAB
 * ============================================================================
 */

/**
 * Valida se os totais do CNAB batem com os registros
 * 
 * @param records - Registros detalhe
 * @param expectedTotal - Total esperado (do trailer)
 * @returns Validação e diferença
 */
export function validateCNABTotals(
  records: Array<{ amount: number }>,
  expectedTotal: number
): {
  valid: boolean;
  calculatedTotal: number;
  difference: number;
  variancePercent: number;
} {
  const calculatedTotal = records.reduce((sum, rec) => sum + rec.amount, 0);
  const difference = Math.abs(calculatedTotal - expectedTotal);
  const variancePercent = expectedTotal > 0 ? (difference / expectedTotal) * 100 : 0;
  
  // Considera válido se diferença for menor que 1 centavo
  const isValid = difference < 0.01;
  
  return {
    valid: isValid,
    calculatedTotal,
    difference,
    variancePercent,
  };
}

/**
 * ============================================================================
 * CÁLCULO DE JUROS E MULTAS
 * ============================================================================
 */

/**
 * Calcula juros e multa por atraso em pagamento
 * 
 * FÓRMULAS:
 * Multa = Valor × (Multa % / 100)
 * Juros = Valor × (Juros % ao mês / 30) × Dias de atraso
 * 
 * @param principal - Valor principal
 * @param penaltyRate - Taxa de multa (%)
 * @param interestRate - Taxa de juros (% ao mês)
 * @param daysLate - Dias de atraso
 * @returns Totais calculados
 */
export function calculateLatePayment(
  principal: number,
  penaltyRate: number,
  interestRate: number,
  daysLate: number
): {
  principal: number;
  penalty: number;
  interest: number;
  total: number;
} {
  // Calcula multa fixa
  const penalty = principal * (penaltyRate / 100);
  
  // Calcula juros proporcionais aos dias
  const dailyInterestRate = interestRate / 30;
  const interest = principal * (dailyInterestRate / 100) * daysLate;
  
  // Total a pagar
  const total = principal + penalty + interest;
  
  return {
    principal,
    penalty,
    interest,
    total,
  };
}

/**
 * ============================================================================
 * ANÁLISE DE FLUXO DE CAIXA
 * ============================================================================
 */

/**
 * Analisa fluxo de caixa e identifica padrões
 * 
 * @param inflows - Entradas diárias
 * @param outflows - Saídas diárias
 * @returns Análise completa
 */
export function analyzeCashFlow(
  inflows: number[],
  outflows: number[]
): {
  averageInflow: number;
  averageOutflow: number;
  netBalance: number;
  burnRate: number;
  runway: number;
  trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
} {
  const totalInflow = inflows.reduce((sum, val) => sum + val, 0);
  const totalOutflow = outflows.reduce((sum, val) => sum + val, 0);
  
  const averageInflow = inflows.length > 0 ? totalInflow / inflows.length : 0;
  const averageOutflow = outflows.length > 0 ? totalOutflow / outflows.length : 0;
  
  const netBalance = totalInflow - totalOutflow;
  const burnRate = averageOutflow - averageInflow; // Quanto "queima" por dia
  
  // Runway: quantos dias dura com o saldo atual (considerando burn rate)
  const runway = burnRate > 0 ? netBalance / burnRate : Infinity;
  
  // Tendência (compara primeira metade com segunda metade)
  const mid = Math.floor(inflows.length / 2);
  const firstHalfNet = inflows.slice(0, mid).reduce((a, b) => a + b, 0) - 
                       outflows.slice(0, mid).reduce((a, b) => a + b, 0);
  const secondHalfNet = inflows.slice(mid).reduce((a, b) => a + b, 0) - 
                        outflows.slice(mid).reduce((a, b) => a + b, 0);
  
  let trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
  if (secondHalfNet > firstHalfNet * 1.05) {
    trend = 'IMPROVING'; // Melhorou mais de 5%
  } else if (secondHalfNet < firstHalfNet * 0.95) {
    trend = 'WORSENING'; // Piorou mais de 5%
  } else {
    trend = 'STABLE'; // Estável (variação < 5%)
  }
  
  return {
    averageInflow,
    averageOutflow,
    netBalance,
    burnRate,
    runway,
    trend,
  };
}
