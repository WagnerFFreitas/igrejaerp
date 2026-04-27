/**
 * ============================================================================
 * SERVICE DE PROJEÇÃO DE FLUXO DE CAIXA
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este service é o "maestro" que coordena todas as projeções financeiras.
 * Ele integra:
 * - Histórico de transações
 * - Contas a pagar e receber
 * - Cálculos matemáticos
 * - Cenários econômicos
 * 
 * PARA GERAR UMA PROJEÇÃO COMPLETA:
 * 1. Coleta dados atuais (saldo, contas)
 * 2. Projeta receitas baseadas em histórico
 * 3. Projeta despesas baseadas em vencimentos
 * 4. Calcula saldo futuro dia-a-dia
 * 5. Gera alertas preventivos
 * 6. Cria múltiplos cenários
 * 
 * ANALOGIA:
 * ---------
 * Pense como um "consultor financeiro virtual":
 * - Analisa sua situação atual
 * - Estuda padrões passados
 * - Faz contas do futuro
 * - Te avisa se vai dar ruim
 */

import { Transaction } from '../types';
import { 
  projetarReceitas,
  projetarDespesasFixas,
  projetarDespesasVariaveis,
  projetarSaldoFuturo,
  gerarAlertasFluxoCaixa,
  calcularMediaMovelReceitas,
  CashFlowProjection,
  DailyCashFlow,
} from '../utils/calculosFluxoCaixa';

/**
 * CONFIGURAÇÕES DO SERVICE
 * ========================
 */
export interface ProjectionConfig {
  days: number;                      // Período (30/60/90)
  scenario: 'OPTIMISTIC' | 'NORMAL' | 'PESSIMISTIC';
  includeSeasonality: boolean;       // Usar fatores sazonais
  warningThreshold: number;          // Saldo mínimo para alerta
}

/**
 * CLASSE DO SERVICE DE PROJEÇÃO
 * =============================
 */
export class CashFlowProjectionService {

  /**
   * GERAR PROJEÇÃO COMPLETA
   * -----------------------
   * 
   * O QUE FAZ?
   * Cria projeção completa de fluxo de caixa
   * 
   * PARÂMETROS:
   * - currentBalance: number → Saldo atual nas contas
   * - transactions: Transaction[] → Histórico completo
   * - receivables: Transaction[] → Contas a receber
   * - payables: Transaction[] → Contas a pagar
   * - config: ProjectionConfig → Configurações
   * 
   * RETORNO:
   * Promise<CashFlowProjection> → Projeção completa
   * 
   * COMO FUNCIONA:
   * 1. Define período (data início/fim)
   * 2. Projeta receitas por categoria
   * 3. Projeta despesas (fixas + variáveis)
   * 4. Calcula saldo diário
   * 5. Gera alertas
   * 6. Retorna objeto completo
   */
  async generateProjection(
    currentBalance: number,
    transactions: Transaction[],
    receivables: Transaction[],
    payables: Transaction[],
    config: ProjectionConfig
  ): Promise<CashFlowProjection> {
    const { days, scenario, includeSeasonality, warningThreshold } = config;
    
    // 1. Datas
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // 2. Fatores do cenário
    const scenarioFactors = this.getScenarioFactors(scenario);
    
    // 3. Projetar receitas
    let projectedIncome = 0;
    
    // Dízimos
    const tithesProjection = projetarReceitas(transactions, days, 'Dizimo');
    projectedIncome += tithesProjection * scenarioFactors.income;
    
    // Ofertas
    const offeringsProjection = projetarReceitas(transactions, days, 'OFFERING');
    projectedIncome += offeringsProjection * scenarioFactors.income;
    
    // Outras receitas
    const otherIncome = projetarReceitas(transactions, days);
    projectedIncome += otherIncome * scenarioFactors.income * 0.5;
    
    // 4. Projetar despesas
    let projectedExpense = 0;
    
    // Fixas
    const fixedExpenses = projetarDespesasFixas(transactions, days);
    projectedExpense += fixedExpenses * scenarioFactors.expense;
    
    // Variáveis
    const variableExpenses = projetarDespesasVariaveis(transactions, days);
    projectedExpense += variableExpenses * scenarioFactors.expense;
    
    // 5. Projeção diária detalhada
    const dailyProjections = this.generateDailyProjections(
      currentBalance,
      receivables,
      payables,
      days,
      projectedIncome,
      projectedExpense
    );
    
    // 6. Gerar alertas
    const alerts = gerarAlertasFluxoCaixa(dailyProjections, warningThreshold);
    
    // 7. Saldo final projetado
    const projectedFinalBalance = currentBalance + projectedIncome - projectedExpense;
    
    // 8. Retorna resultado
    return {
      days,
      startDate,
      endDate: endDateStr,
      currentBalance,
      projectedIncome,
      projectedExpense,
      projectedFinalBalance,
      dailyProjections,
      alerts,
      scenario,
    };
  }

  /**
   * GERAR PROJEÇÃO DIÁRIA DETALHADA
   * --------------------------------
   * 
   * O QUE FAZ?
   * Distribui receitas e despesas ao longo dos dias
   * 
   * PARÂMETROS:
   * - currentBalance: number
   * - receivables: Transaction[]
   * - payables: Transaction[]
   * - days: number
   * - totalProjectedIncome: number
   * - totalProjectedExpense: number
   * 
   * RETORNO:
   * DailyCashFlow[]
   */
  private generateDailyProjections(
    currentBalance: number,
    receivables: Transaction[],
    payables: Transaction[],
    days: number,
    totalProjectedIncome: number,
    totalProjectedExpense: number
  ): DailyCashFlow[] {
    const projections: DailyCashFlow[] = [];
    let runningBalance = currentBalance;
    
    // Média diária de receitas e despesas
    const dailyIncomeAvg = totalProjectedIncome / days;
    const dailyExpenseAvg = totalProjectedExpense / days;
    
    // Para cada dia
    for (let i = 1; i <= days; i++) {
      const projectionDate = new Date();
      projectionDate.setDate(projectionDate.getDate() + i);
      const dateStr = projectionDate.toISOString().split('T')[0];
      
      // Recebimentos agendados
      const scheduledIncome = receivables
        .filter(t => t.dueDate === dateStr && t.status !== 'PAID')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Pagamentos agendados
      const scheduledExpense = payables
        .filter(t => t.dueDate === dateStr && t.status !== 'PAID')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Adiciona média + agendados
      const dayIncome = scheduledIncome + (dailyIncomeAvg * 0.3); // 30% da média
      const dayExpense = scheduledExpense + (dailyExpenseAvg * 0.3);
      
      // Atualiza saldo
      runningBalance = runningBalance + dayIncome - dayExpense;
      
      // Adiciona projeção
      projections.push({
        date: dateStr,
        income: dayIncome,
        expense: dayExpense,
        balance: runningBalance,
        projectedIncome: dayIncome,
        projectedExpense: dayExpense,
        projectedBalance: runningBalance,
      });
    }
    
    return projections;
  }

  /**
   * OBTER FATORES DO CENÁRIO
   * -------------------------
   * 
   * O QUE FAZ?
   * Define multiplicadores baseados no cenário
   * 
   * PARÂMETRO:
   * - scenario: 'OPTIMISTIC' | 'NORMAL' | 'PESSIMISTIC'
   * 
   * RETORNO:
   * { income: number, expense: number }
   */
  private getScenarioFactors(scenario: string): { income: number; expense: number } {
    switch (scenario) {
      case 'OPTIMISTIC':
        return {
          income: 1.1,   // 10% mais otimista
          expense: 0.9,  // 10% menos despesas
        };
        
      case 'PESSIMISTIC':
        return {
          income: 0.8,   // 20% menos receita
          expense: 1.2,  // 20% mais despesas
        };
        
      case 'NORMAL':
      default:
        return {
          income: 1.0,   // Normal
          expense: 1.0,
        };
    }
  }

  /**
   * COMPARAR PROJETADO VS REALIZADO
   * ---------------------------------
   * 
   * O QUE FAZ?
   * Analisa precisão das projeções passadas
   * 
   * PARÂMETROS:
   * - projected: CashFlowProjection
   * - actualTransactions: Transaction[] → O que realmente aconteceu
   * 
   * RETORNO:
   * { accuracy: number, variance: number }
   */
  compareProjectedVsActual(
    projected: CashFlowProjection,
    actualTransactions: Transaction[]
  ): { accuracy: number; variance: number } {
    // Soma transações reais no período
    const actualIncome = actualTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const actualExpense = actualTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Compara com projetado
    const incomeVariance = Math.abs(projected.projectedIncome - actualIncome) / projected.projectedIncome;
    const expenseVariance = Math.abs(projected.projectedExpense - actualExpense) / projected.projectedExpense;
    
    // Precisão média
    const accuracy = 1 - ((incomeVariance + expenseVariance) / 2);
    
    return {
      accuracy: Math.round(accuracy * 100), // %
      variance: Math.round(((incomeVariance + expenseVariance) / 2) * 100), // %
    };
  }

  /**
   * IDENTIFICAR TENDÊNCIAS
   * ----------------------
   * 
   * O QUE FAZ?
   * Analisa direção das receitas e despesas
   */
  identifyTrends(transactions: Transaction[]): {
    incomeTrend: 'UP' | 'DOWN' | 'STABLE';
    expenseTrend: 'UP' | 'DOWN' | 'STABLE';
    overallHealth: 'GOOD' | 'WARNING' | 'CRITICAL';
  } {
    const incomeTrend = calcularMediaMovelReceitas(transactions.filter(t => t.type === 'INCOME'), 30);
    const expenseTrend = calcularMediaMovelReceitas(transactions.filter(t => t.type === 'EXPENSE'), 30);
    
    // Saúde geral
    let overallHealth: 'GOOD' | 'WARNING' | 'CRITICAL';
    
    if (incomeTrend.trend === 'UP' && expenseTrend.trend !== 'UP') {
      overallHealth = 'GOOD';
    } else if (incomeTrend.trend === 'DOWN' && expenseTrend.trend === 'UP') {
      overallHealth = 'CRITICAL';
    } else {
      overallHealth = 'WARNING';
    }
    
    return {
      incomeTrend: incomeTrend.trend,
      expenseTrend: expenseTrend.trend,
      overallHealth,
    };
  }

  /**
   * CALCULAR RESERVAS NECESSÁRIAS
   * -----------------------------
   * 
   * O QUE FAZ?
   * Sugere valor para reserva de emergência
   */
  calculateReserveRecommendation(
    monthlyExpenses: number,
    monthsOfReserve: number = 6
  ): number {
    return monthlyExpenses * monthsOfReserve;
  }

  /**
   * SIMULAR IMPACTO DE DECISÃO
   * --------------------------
   * 
   * O QUE FAZ?
   * "E se..." - simula cenários hipotéticos
   * 
   * PARÂMETROS:
   * - baseProjection: CashFlowProjection
   * - additionalIncome: number → Receita extra
   * - additionalExpense: number → Despesa extra
   * 
   * RETORNO:
   * { newBalance: number, impact: number }
   */
  simulateDecision(
    baseProjection: CashFlowProjection,
    additionalIncome: number = 0,
    additionalExpense: number = 0
  ): { newBalance: number; impact: number } {
    const impact = additionalIncome - additionalExpense;
    const newBalance = baseProjection.projectedFinalBalance + impact;
    
    return {
      newBalance,
      impact,
    };
  }
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 */
export const cashFlowProjectionService = new CashFlowProjectionService();
