/**
 * ============================================================================
 * UTILITÁRIOS PARA PROJEÇÃO DE FLUXO DE CAIXA
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este arquivo contém funções matemáticas e financeiras para projetar
 * o futuro financeiro da igreja com base em histórico e compromissos.
 * 
 * PRINCIPAIS FUNÇÕES:
 * • Projeção de receitas (dízimos, ofertas, campanhas)
 * • Projeção de despesas (fixas, variáveis, sazonais)
 * • Cálculo de tendências e médias móveis
 * • Detecção de padrões sazonais
 * • Alertas de saldo negativo futuro
 * 
 * ANALOGIA:
 * ---------
 * Pense como uma "bola de cristal financeira" que:
 * - Olha para o passado (histórico)
 * - Analisa o presente (compromissos)
 * - Prevê o futuro (projeções)
 */

import { Transaction } from '../types';

/**
 * DADOS DIÁRIOS DE FLUXO DE CAIXA
 * ================================
 */
export interface DailyCashFlow {
  date: string;
  income: number;
  expense: number;
  balance: number;
  projectedIncome?: number;
  projectedExpense?: number;
  projectedBalance?: number;
}

/**
 * PROJEÇÃO DE FLUXO DE CAIXA
 * ==========================
 */
export interface CashFlowProjection {
  days: number;                    // Período da projeção (30/60/90)
  startDate: string;
  endDate: string;
  currentBalance: number;
  projectedIncome: number;
  projectedExpense: number;
  projectedFinalBalance: number;
  dailyProjections: DailyCashFlow[];
  alerts: CashFlowAlert[];
  scenario: 'OPTIMISTIC' | 'NORMAL' | 'PESSIMISTIC';
}

/**
 * ALERTA DE FLUXO DE CAIXA
 * ========================
 */
export interface CashFlowAlert {
  date: string;
  type: 'NEGATIVE_BALANCE' | 'LOW_BALANCE' | 'HIGH_EXPENSE';
  severity: 'WARNING' | 'CRITICAL';
  message: string;
  projectedBalance: number;
}

/**
 * MÉDIA MÓVEL PARA TENDÊNCIA
 * ==========================
 */
export interface MovingAverage {
  value: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  changePercent: number;
}

// ============================================================================
// FUNÇÕES DE PROJEÇÃO DE RECEITAS
// ============================================================================

/**
 * PROJETAR DÍZIMOS E OFERTAS
 * --------------------------
 * 
 * O QUE FAZ?
 * Estima arrecadação futura baseada em histórico
 * 
 * PARÂMETROS:
 * - transactions: Transaction[] → Histórico completo
 * - days: number → Dias para projetar
 * - category?: string → Filtra categoria (ex: 'Dizimo')
 * 
 * RETORNO:
 * number → Valor total projetado
 * 
 * COMO FUNCIONA:
 * 1. Filtra transações por categoria
 * 2. Calcula média diária dos últimos 90 dias
 * 3. Projeta para período solicitado
 * 4. Aplica fator sazonal (se tiver)
 */
export function projetarReceitas(
  transactions: Transaction[],
  days: number,
  category?: string
): number {
  // 1. Filtra receitas
  let incomeTransactions = transactions.filter(t => t.type === 'INCOME');
  
  if (category) {
    incomeTransactions = incomeTransactions.filter(t => t.category === category);
  }
  
  // 2. Calcula data de corte (últimos 90 dias)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  
  // 3. Filtra por período
  const recentTransactions = incomeTransactions.filter(t => {
    const txDate = new Date(t.date);
    return txDate >= cutoffDate;
  });
  
  // 4. Soma total do período
  const totalPeriod = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // 5. Calcula média diária
  const averageDaily = totalPeriod / 90;
  
  // 6. Projeta para período futuro
  const projected = averageDaily * days;
  
  // 7. Aplica fator de segurança (90% para ser conservador)
  return projected * 0.90;
}

/**
 * CALCULAR MÉDIA MÓVEL DE RECEITAS
 * ---------------------------------
 * 
 * O QUE FAZ?
 * Identifica tendência (subindo, descendo, estável)
 * 
 * PARÂMETROS:
 * - transactions: Transaction[]
 * - windowDays: number → Janela para média (ex: 30 dias)
 * 
 * RETORNO:
 * MovingAverage → Valor, tendência e variação %
 */
export function calcularMediaMovelReceitas(
  transactions: Transaction[],
  windowDays: number = 30
): MovingAverage {
  const incomeTx = transactions.filter(t => t.type === 'INCOME');
  
  // Divide em dois períodos
  const now = new Date();
  const period1End = new Date(now.getTime() - (windowDays * 24 * 60 * 60 * 1000));
  const period1Start = new Date(period1End.getTime() - (windowDays * 24 * 60 * 60 * 1000));
  
  // Período anterior
  const period1Total = incomeTx
    .filter(t => {
      const d = new Date(t.date);
      return d >= period1Start && d < period1End;
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Período atual
  const period2Total = incomeTx
    .filter(t => {
      const d = new Date(t.date);
      return d >= period1End && d <= now;
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Variação
  const changePercent = ((period2Total - period1Total) / period1Total) * 100;
  
  // Tendência
  let trend: 'UP' | 'DOWN' | 'STABLE';
  if (changePercent > 5) {
    trend = 'UP';
  } else if (changePercent < -5) {
    trend = 'DOWN';
  } else {
    trend = 'STABLE';
  }
  
  return {
    value: period2Total / windowDays,
    trend,
    changePercent,
  };
}

// ============================================================================
// FUNÇÕES DE PROJEÇÃO DE DESPESAS
// ============================================================================

/**
 * PROJETAR DESPESAS FIXAS
 * -----------------------
 * 
 * O QUE FAZ?
 * Calcula despesas recorrentes (aluguel, salários, etc.)
 * 
 * PARÂMETROS:
 * - transactions: Transaction[]
 * - days: number
 * 
 * RETORNO:
 * number → Total de despesas fixas projetadas
 */
export function projetarDespesasFixas(
  transactions: Transaction[],
  days: number
): number {
  // Filtra despesas
  const expenseTx = transactions.filter(t => t.type === 'EXPENSE');
  
  // Identifica recorrências mensais
  const monthlyExpenses = identifyMonthlyExpenses(expenseTx);
  
  // Calcula meses no período
  const months = days / 30;
  
  // Projeta
  return monthlyExpenses * months;
}

/**
 * IDENTIFICAR DESPESAS MENSAIS RECORRENTES
 * -----------------------------------------
 * 
 * O QUE FAZ?
 * Detecta padrões de despesas que se repetem todo mês
 * 
 * PARÂMETRO:
 * - transactions: Transaction[]
 * 
 * RETORNO:
 * number → Média mensal
 */
function identifyMonthlyExpenses(transactions: Transaction[]): number {
  // Agrupa por descrição similar
  const grouped = new Map<string, number[]>();
  
  transactions.forEach(t => {
    const key = t.description.toLowerCase();
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    
    grouped.get(key)!.push({
      amount: t.amount,
      date: new Date(t.date),
    } as any);
  });
  
  // Filtra recorrências (pelo menos 3 ocorrências)
  let monthlyTotal = 0;
  
  grouped.forEach((amounts, description) => {
    if (amounts.length >= 3) {
      // É recorrente
      const avgAmount = amounts.reduce((sum, a: any) => sum + a.amount, 0) / amounts.length;
      monthlyTotal += avgAmount;
    }
  });
  
  return monthlyTotal;
}

/**
 * PROJETAR DESPESAS VARIÁVEIS
 * ---------------------------
 * 
 * O QUE FAZ?
 * Estima despesas não-fixas baseadas em média histórica
 */
export function projetarDespesasVariaveis(
  transactions: Transaction[],
  days: number
): number {
  const expenseTx = transactions.filter(t => t.type === 'EXPENSE');
  
  // Últimos 90 dias
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  
  const recent = expenseTx.filter(t => new Date(t.date) >= cutoff);
  
  // Média diária
  const total = recent.reduce((sum, t) => sum + t.amount, 0);
  const dailyAvg = total / 90;
  
  // Projeta com margem de segurança (110%)
  return dailyAvg * days * 1.10;
}

// ============================================================================
// FUNÇÕES DE PROJEÇÃO DE SALDO
// ============================================================================

/**
 * PROJETAR SALDO FUTURO
 * ---------------------
 * 
 * O QUE FAZ?
 * Calcula saldo dia-a-dia baseado em vencimentos
 * 
 * PARÂMETROS:
 * - currentBalance: number → Saldo atual
 * - receivables: Transaction[] → Contas a receber
 * - payables: Transaction[] → Contas a pagar
 * - days: number → Período da projeção
 * 
 * RETORNO:
 * DailyCashFlow[] → Projeção diária
 */
export function projetarSaldoFuturo(
  currentBalance: number,
  receivables: Transaction[],
  payables: Transaction[],
  days: number
): DailyCashFlow[] {
  const projections: DailyCashFlow[] = [];
  let runningBalance = currentBalance;
  
  // Para cada dia no futuro
  for (let i = 1; i <= days; i++) {
    const projectionDate = new Date();
    projectionDate.setDate(projectionDate.getDate() + i);
    const dateStr = projectionDate.toISOString().split('T')[0];
    
    // Soma recebimentos do dia
    const dayIncome = receivables
      .filter(t => t.dueDate === dateStr && t.status !== 'PAID')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Subtrai pagamentos do dia
    const dayExpense = payables
      .filter(t => t.dueDate === dateStr && t.status !== 'PAID')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Atualiza saldo
    runningBalance = runningBalance + dayIncome - dayExpense;
    
    // Adiciona projeção do dia
    projections.push({
      date: dateStr,
      income: dayIncome,
      expense: dayExpense,
      balance: runningBalance,
    });
  }
  
  return projections;
}

// ============================================================================
// FUNÇÕES DE ALERTA
// ============================================================================

/**
 * GERAR ALERTAS DE FLUXO DE CAIXA
 * --------------------------------
 * 
 * O QUE FAZ?
 * Identifica dias críticos no futuro
 * 
 * PARÂMETROS:
 * - projections: DailyCashFlow[]
 * - warningThreshold: number → Saldo mínimo para alerta (ex: 1000)
 * 
 * RETORNO:
 * CashFlowAlert[] → Lista de alertas
 */
export function gerarAlertasFluxoCaixa(
  projections: DailyCashFlow[],
  warningThreshold: number = 1000
): CashFlowAlert[] {
  const alerts: CashFlowAlert[] = [];
  
  projections.forEach(proj => {
    // Saldo negativo
    if (proj.balance < 0) {
      alerts.push({
        date: proj.date,
        type: 'NEGATIVE_BALANCE',
        severity: 'CRITICAL',
        message: `Saldo negativo projetado: ${formatCurrency(proj.balance)}`,
        projectedBalance: proj.balance,
      });
    }
    // Saldo baixo
    else if (proj.balance < warningThreshold) {
      alerts.push({
        date: proj.date,
        type: 'LOW_BALANCE',
        severity: 'WARNING',
        message: `Saldo baixo projetado: ${formatCurrency(proj.balance)}`,
        projectedBalance: proj.balance,
      });
    }
    
    // Despesa muito alta
    if (proj.expense > proj.income * 2) {
      alerts.push({
        date: proj.date,
        type: 'HIGH_EXPENSE',
        severity: 'WARNING',
        message: `Despesa muito alta: ${formatCurrency(proj.expense)} vs Receita: ${formatCurrency(proj.income)}`,
        projectedBalance: proj.balance,
      });
    }
  });
  
  return alerts;
}

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * FORMATAR MOEDA
 * --------------
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * CALCULAR TENDÊNCIA GERAL
 * ------------------------
 */
export function calcularTendenciaGeral(
  incomeTrend: MovingAverage,
  expenseTrend: MovingAverage
): 'FAVORABLE' | 'UNFAVORABLE' | 'NEUTRAL' {
  // Se receitas sobem e despesas descem → Favorável
  if (incomeTrend.trend === 'UP' && expenseTrend.trend === 'DOWN') {
    return 'FAVORABLE';
  }
  
  // Se receitas descem e despesas sobem → Desfavorável
  if (incomeTrend.trend === 'DOWN' && expenseTrend.trend === 'UP') {
    return 'UNFAVORABLE';
  }
  
  // Caso contrário → Neutro
  return 'NEUTRAL';
}

/**
 * AJUSTAR POR SAZONALIDADE
 * ------------------------
 * 
 * O QUE FAZ?
 * Aplica fatores sazonais (ex: dezembro tem mais ofertas)
 */
export function ajustarPorSazonalidade(
  projectedValue: number,
  month: number
): number {
  // Fatores sazonais (exemplo)
  const seasonalFactors: Record<number, number> = {
    1: 0.8,   // Janeiro - baixo (pós-festas)
    2: 0.9,   // Fevereiro
    3: 1.0,   // Março - normal
    4: 1.0,
    5: 1.0,
    6: 0.9,   // Junho - festas juninas
    7: 1.0,
    8: 1.0,
    9: 1.0,
    10: 1.0,
    11: 1.1,  // Novembro - campanha
    12: 1.5,  // Dezembro - alto (13º, festas)
  };
  
  const factor = seasonalFactors[month + 1] || 1.0;
  return projectedValue * factor;
}
