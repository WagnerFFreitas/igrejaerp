/**
 * ============================================================================
 * UTILITÁRIOS DE CÁLCULO TRABALHISTA - FOLHA DE PAGAMENTO
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este arquivo contém TODAS as fórmulas e cálculos trabalhistas brasileiros
 * para geração automática de folha de pagamento.
 * 
 * INCLUI:
 * • Cálculo de INSS (tabela progressiva 2024/2025)
 * • Cálculo de IRRF (tabela progressiva)
 * • Cálculo de FGTS (8% ou 11%)
 * • Salário família
 * • Adicionais (hora extra, noturno, insalubridade)
 * • Descontos (faltas, atrasos, pensão alimentícia)
 * • 13º salário proporcional
 * • Férias + 1/3 constitucional
 * 
 * ATUALIZAÇÃO: TABELAS 2024/2025
 * ==============================
 * As tabelas de INSS e IRRF estão atualizadas conforme legislação vigente.
 * 
 * ANALOGIA:
 * ---------
 * Pense como uma "calculadora trabalhista automatizada":
 * - Você informa o salário bruto
 * - Ela calcula todos os descontos obrigatórios
 * - Retorna salário líquido + custos empregador
 */

import { TaxBracket, Employee, PayrollCalculation } from '../types';

// ============================================================================
// TABELAS OFICIAIS 2024/2025
// ============================================================================

/**
 * TABELA PROGRESSIVA DO INSS 2024/2025
 * =====================================
 * 
 * ESTRUTURA:
 * Cada faixa tem:
 * - Limite mínimo
 * - Limite máximo
 * - Alíquota (%)
 * - Parcela a deduzir (para cálculo rápido)
 * 
 * COMO FUNCIONA O CÁLCULO PROGRESSIVO:
 * -------------------------------------
 * Para salário de R$ 3.000,00:
 * 
 * Faixa 1: R$ 1.412,00 × 7.5% = R$ 105,90
 * Faixa 2: (R$ 2.666,68 - R$ 1.412,00) × 9% = R$ 112,92
 * Faixa 3: (R$ 3.000,00 - R$ 2.666,68) × 12% = R$ 40,00
 * ────────────────────────────────────────────────
 * Total INSS: R$ 258,82
 */
export const INSS_TABLE_2024: TaxBracket[] = [
  { bracket: 1, min: 0, max: 1412.00, rate: 0.075, deduction: 0 },
  { bracket: 2, min: 1412.01, max: 2666.68, rate: 0.09, deduction: 21.18 },
  { bracket: 3, min: 2666.69, max: 4000.03, rate: 0.12, deduction: 101.18 },
  { bracket: 4, min: 4000.04, max: 7786.02, rate: 0.14, deduction: 181.18 },
  // Teto do INSS: R$ 7.786,02
];

/**
 * TABELA DO IRRF 2024/2025
 * ========================
 * 
 * BASE DE CÁLCULO:
 * Salário bruto - INSS - dependentes (R$ 189,59 cada) - pensão alimentícia
 * 
 * DEDUÇÃO POR DEPENDENTE:
 * R$ 189,59 por mês (valor fixo por lei)
 */
export const IRRF_TABLE_2024: TaxBracket[] = [
  { bracket: 1, min: 0, max: 2259.20, rate: 0, deduction: 0 },
  { bracket: 2, min: 2259.21, max: 2826.65, rate: 0.075, deduction: 169.44 },
  { bracket: 3, min: 2826.66, max: 3751.05, rate: 0.15, deduction: 381.44 },
  { bracket: 4, min: 3751.06, max: 4664.68, rate: 0.225, deduction: 662.77 },
  { bracket: 5, min: 4664.69, rate: 0.275, deduction: 896.00 },
];

/**
 * SALÁRIO MÍNIMO 2024
 * ===================
 */
export const MIN_WAGE_2024 = 1412.00;

/**
 * SALÁRIO FAMÍLIA 2024
 * ====================
 * Por filho até 14 anos ou inválido
 */
export const FAMILY_SALARY_2024 = 62.04;

// ============================================================================
// FUNÇÕES DE CÁLCULO DO INSS
// ============================================================================

/**
 * CALCULAR INSS PROGRESSIVO
 * -------------------------
 * 
 * O QUE FAZ?
 * Calcula contribuição ao INSS usando tabela progressiva
 * 
 * PARÂMETROS:
 * - grossSalary: number → Salário bruto
 * - inssTable?: TaxBracket[] → Tabela (padrão: 2024)
 * 
 * RETORNO:
 * number → Valor do INSS
 * 
 * COMO FUNCIONA:
 * 1. Identifica faixas aplicáveis
 * 2. Calcula imposto por faixa
 * 3. Soma parcelas
 * 4. Aplica teto se necessário
 * 
 * EXEMPLO:
 * Salário: R$ 3.000,00
 * 
 * Faixa 1: 1412.00 × 7.5% = 105.90
 * Faixa 2: (2666.68 - 1412.00) × 9% = 112.92
 * Faixa 3: (3000.00 - 2666.68) × 12% = 40.00
 * Total: R$ 258,82
 */
export function calcularINSS(grossSalary: number, inssTable: TaxBracket[] = INSS_TABLE_2024): number {
  let inss = 0;
  let remainingSalary = grossSalary;
  let previousLimit = 0;
  
  // Para cada faixa da tabela
  for (const bracket of inssTable) {
    // Se salário zerou, para
    if (remainingSalary <= 0) break;
    
    // Calcula base na faixa atual
    const bracketBase = Math.min(
      remainingSalary,
      (bracket.max || Infinity) - previousLimit
    );
    
    // Se base negativa, pula para próxima
    if (bracketBase <= 0) {
      previousLimit = bracket.max || Infinity;
      continue;
    }
    
    // Aplica alíquota da faixa
    inss += bracketBase * bracket.rate;
    
    // Atualiza controles
    remainingSalary -= bracketBase;
    previousLimit = bracket.max || Infinity;
  }
  
  // Arredonda para 2 casas decimais
  return Math.round(inss * 100) / 100;
}

/**
 * OBTER ALÍQUOTA EFETIVA DO INSS
 * --------------------------------
 * 
 * O QUE FAZ?
 * Calcula porcentagem real paga de INSS
 * 
 * PARÂMETROS:
 * - grossSalary: number
 * - inssValue: number → Valor calculado
 * 
 * RETORNO:
 * number → Alíquota efetiva (%)
 * 
 * EXEMPLO:
 * Salário: R$ 3.000,00
 * INSS: R$ 258,82
 * Efetivo: 258.82 / 3000 = 8.63%
 */
export function getEffectiveINSSRate(grossSalary: number, inssValue: number): number {
  if (grossSalary === 0) return 0;
  return (inssValue / grossSalary) * 100;
}

// ============================================================================
// FUNÇÕES DE CÁLCULO DO IRRF
// ============================================================================

/**
 * CALCULAR IRRF
 * -------------
 * 
 * O QUE FAZ?
 * Calcula imposto de renda retido na fonte
 * 
 * PARÂMETROS:
 * - grossSalary: number
 * - inssValue: number → Já calculado
 * - dependentsCount: number → Quantidade de dependentes
 * - alimony?: number → Pensão alimentícia
 * - irrfTable?: TaxBracket[]
 * 
 * RETORNO:
 * number → Valor do IRRF
 * 
 * FÓRMULA:
 * Base IRRF = Salário Bruto - INSS - (Dependentes × R$ 189,59) - Pensão
 * 
 * EXEMPLO:
 * Salário: R$ 4.000,00
 * INSS: R$ 532,60
 * Dependentes: 2
 * 
 * Base = 4000 - 532.60 - (2 × 189.59) = R$ 3.088,22
 * 
 * Na tabela:
 * Faixa 4: 3088.22 × 22.5% - 662.77 = R$ 33,50
 */
export function calcularIRRF(
  grossSalary: number,
  inssValue: number,
  dependentsCount: number = 0,
  alimony: number = 0,
  irrfTable: TaxBracket[] = IRRF_TABLE_2024
): number {
  // 1. Calcula base de cálculo
  const dependentDeduction = dependentsCount * 189.59;
  const taxableBase = grossSalary - inssValue - dependentDeduction - alimony;
  
  // 2. Verifica se está na faixa de isenção
  if (taxableBase <= 0) return 0;
  
  // 3. Encontra faixa adequada
  let applicableBracket = irrfTable[0];
  
  for (const bracket of irrfTable) {
    if (taxableBase >= bracket.min) {
      applicableBracket = bracket;
    } else {
      break;
    }
  }
  
  // 4. Calcula imposto
  const tax = (taxableBase * applicableBracket.rate) - applicableBracket.deduction;
  
  // 5. Retorna valor (não pode ser negativo)
  return Math.max(0, Math.round(tax * 100) / 100);
}

/**
 * CALCULAR DEDUÇÃO POR DEPENDENTES
 * ---------------------------------
 * 
 * O QUE FAZ?
 * Calcula redução na base do IRRF por dependentes
 * 
 * PARÂMETRO:
 * - count: number → Quantidade
 * 
 * RETORNO:
 * number → Valor total de dedução
 */
export function calcularDeducaoDependentes(count: number): number {
  return count * 189.59;
}

// ============================================================================
// FUNÇÕES DE CÁLCULO DO FGTS
// ============================================================================

/**
 * CALCULAR FGTS
 * -------------
 * 
 * O QUE FAZ?
 * Calcula contribuição do FGTS (Fundo Garantia Tempo Serviço)
 * 
 * PARÂMETROS:
 * - grossSalary: number
 * - rate?: number → Alíquota (padrão: 8%)
 * 
 * RETORNO:
 * number → Valor do FGTS
 * 
 * OBSERVAÇÃO:
 * FGTS NÃO É DESCONTO DO FUNCIONÁRIO!
 * É custo do empregador, depositado em conta vinculada.
 * 
 * ALÍQUOTAS:
 * - 8% → Regime normal (CLT)
 * - 11% → Jovem Aprendiz
 * - 2% → Aprendiz (alguns casos)
 * 
 * EXEMPLO:
 * Salário: R$ 3.000,00
 * FGTS (8%): R$ 240,00
 */
export function calcularFGTS(grossSalary: number, rate: number = 0.08): number {
  const fgts = grossSalary * rate;
  return Math.round(fgts * 100) / 100;
}

// ============================================================================
// FUNÇÕES DE CÁLCULO DE ADICIONAIS
// ============================================================================

/**
 * CALCULAR HORAS EXTRAS
 * ---------------------
 * 
 * O QUE FAZ?
 * Calcula valor de horas extras com adicional
 * 
 * PARÂMETROS:
 * - baseSalary: number
 * - workHours: number → Carga horária semanal
 * - overtimeHours: number → Horas extras feitas
 * - overtimeRate?: number → Adicional (padrão: 50%)
 * 
 * RETORNO:
 * number → Valor das horas extras
 * 
 * FÓRMULA:
 * Valor Hora = Salário ÷ (Carga Horária × 5 semanas) ÷ 4.5 semanas médias
 * Hora Extra = Valor Hora × (1 + Adicional)
 * 
 * EXEMPLO:
 * Salário: R$ 2.000,00
 * Carga: 40h/semana
 * Horas extras: 10h
 * Adicional: 50%
 * 
 * Valor Hora = 2000 ÷ 220 = R$ 9,09
 * Hora Extra = 9.09 × 1.5 = R$ 13,64
 * Total = 13.64 × 10 = R$ 136,36
 */
export function calcularHorasExtras(
  baseSalary: number,
  workHours: number,
  overtimeHours: number,
  overtimeRate: number = 0.50
): number {
  // Divisor padrão (44h semanais = 220h mensais)
  const monthlyHours = workHours * 5; // Semanas no mês
  const hourValue = baseSalary / monthlyHours;
  
  // Valor da hora extra com adicional
  const overtimeValue = hourValue * (1 + overtimeRate);
  
  // Total
  const total = overtimeValue * overtimeHours;
  
  return Math.round(total * 100) / 100;
}

/**
 * CALCULAR ADICIONAL NOTURNO
 * --------------------------
 * 
 * O QUE FAZ?
 * Calcula adicional para trabalho noturno (22h-5h)
 * 
 * PARÂMETROS:
 * - baseSalary: number
 * - nightHours: number → Horas noturnas
 * - nightRate?: number → Adicional (padrão: 20%)
 * 
 * RETORNO:
 * number → Valor do adicional
 */
export function calcularAdicionalNoturno(
  baseSalary: number,
  nightHours: number,
  nightRate: number = 0.20
): number {
  const monthlyHours = 220; // Padrão
  const hourValue = baseSalary / monthlyHours;
  
  // Hora noturna tem acréscimo
  const nightHourValue = hourValue * (1 + nightRate);
  
  // Calcula apenas o adicional (diferença)
  const additional = (nightHourValue - hourValue) * nightHours;
  
  return Math.round(additional * 100) / 100;
}

/**
 * CALCULAR ADICIONAL DE INSALUBRIDADE
 * -----------------------------------
 * 
 * O QUE FAZ?
 * Calcula adicional para trabalho insalubre
 * 
 * PARÂMETROS:
 * - minWage: number → Salário mínimo
 * - degree: 'MIN' | 'MED' | 'MAX' → Grau de insalubridade
 * 
 * RETORNO:
 * number → Valor do adicional
 * 
 * PERCENTUAIS:
 * - Mínimo: 10% do salário mínimo
 * - Médio: 20% do salário mínimo
 * - Máximo: 40% do salário mínimo
 */
export function calcularInsalubridade(
  minWage: number,
  degree: 'MIN' | 'MED' | 'MAX'
): number {
  const rates = {
    MIN: 0.10,
    MED: 0.20,
    MAX: 0.40,
  };
  
  const additional = minWage * rates[degree];
  return Math.round(additional * 100) / 100;
}

// ============================================================================
// FUNÇÕES DE CÁLCULO DE DESCONTOS
// ============================================================================

/**
 * CALCULAR DESCONTO POR FALTAS
 * ----------------------------
 * 
 * O QUE FAZ?
 * Desconta dias não trabalhados
 * 
 * PARÂMETROS:
 * - baseSalary: number
 * - workDays: number → Dias úteis no mês
 * - absenceDays: number → Dias faltados
 * 
 * RETORNO:
 * number → Valor do desconto
 */
export function calcularDescontoFaltas(
  baseSalary: number,
  workDays: number,
  absenceDays: number
): number {
  const dailyRate = baseSalary / workDays;
  const discount = dailyRate * absenceDays;
  
  return Math.round(discount * 100) / 100;
}

/**
 * CALCULAR SALÁRIO FAMÍLIA
 * ------------------------
 * 
 * O QUE FAZ?
 * Calcula benefício por filho até 14 anos
 * 
 * PARÂMETROS:
 * - grossSalary: number
 * - childrenCount: number → Filhos até 14 anos
 * - minWage?: number
 * 
 * RETORNO:
 * number → Valor do salário família
 * 
 * REGRA:
 * Só tem direito quem ganha até R$ 1.813,60 (2024)
 */
export function calcularSalarioFamilia(
  grossSalary: number,
  childrenCount: number,
  minWage: number = MIN_WAGE_2024
): number {
  // Limite de direito
  const limit = 1813.60;
  
  if (grossSalary > limit) return 0;
  
  // Calcula benefício
  const benefit = childrenCount * FAMILY_SALARY_2024;
  
  return Math.round(benefit * 100) / 100;
}

// ============================================================================
// FUNÇÕES DE CÁLCULO DE 13º SALÁRIO
// ============================================================================

/**
 * CALCULAR 13º SALÁRIO PROPORCIONAL
 * ----------------------------------
 * 
 * O QUE FAZ?
 * Calcula parcela do 13º baseada em meses trabalhados
 * 
 * PARÂMETROS:
 * - baseSalary: number
 * - workedMonths: number → Meses no ano (1-12)
 * - hasHalfInNovember?: boolean → Recebeu 1ª parcela em novembro?
 * 
 * RETORNO:
 * number → Valor da parcela
 * 
 * COMO FUNCIONA:
 * 1ª Parcela (novembro): 50% do salário ÷ 12 × meses
 * 2ª Parcela (dezembro): Restante - INSS - IRRF
 * 
 * EXEMPLO:
 * Salário: R$ 3.000,00
 * Meses: 12
 * 
 * 1ª Parcela: 3000 × 50% = R$ 1.500,00
 * 2ª Parcela: 3000 - 1500 - INSS - IRRF = R$ 1.200,00 (aproximadamente)
 */
export function calcularDecimoTerceiro(
  baseSalary: number,
  workedMonths: number,
  hasHalfInNovember: boolean = true
): number {
  // Proporcional
  const proportional = (baseSalary / 12) * workedMonths;
  
  // Se já recebeu metade em novembro
  if (hasHalfInNovember) {
    const firstHalf = baseSalary * 0.5;
    return Math.round((proportional - firstHalf) * 100) / 100;
  }
  
  // Se não, retorna valor integral
  return Math.round(proportional * 100) / 100;
}

// ============================================================================
// FUNÇÕES DE CÁLCULO DE FÉRIAS
// ============================================================================

/**
 * CALCULAR FÉRIAS + 1/3 CONSTITUCIONAL
 * ------------------------------------
 * 
 * O QUE FAZ?
 * Calcula valor de férias remuneradas
 * 
 * PARÂMETROS:
 * - baseSalary: number
 * - vacationDays: number → Dias de férias (padrão: 30)
 * - includeThird?: boolean → Incluir 1/3 constitucional
 * 
 * RETORNO:
 * { value: number, third: number, total: number }
 * 
 * FÓRMULA:
 * Férias = Salário ÷ 30 × Dias
 * 1/3 Constitucional = Férias ÷ 3
 * Total = Férias + 1/3
 * 
 * EXEMPLO:
 * Salário: R$ 3.000,00
 * Dias: 30
 * 
 * Férias = 3000 ÷ 30 × 30 = R$ 3.000,00
 * 1/3 = 3000 ÷ 3 = R$ 1.000,00
 * Total = R$ 4.000,00
 */
export function calcularFerias(
  baseSalary: number,
  vacationDays: number = 30,
  includeThird: boolean = true
): { value: number; third: number; total: number } {
  // Valor das férias
  const value = (baseSalary / 30) * vacationDays;
  
  // 1/3 constitucional
  const third = includeThird ? value / 3 : 0;
  
  // Total
  const total = value + third;
  
  return {
    value: Math.round(value * 100) / 100,
    third: Math.round(third * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
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
 * ARREDONDAR PARA 2 CASAS DECIMAIS
 * --------------------------------
 */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * CALCULAR MÉDIA
 * --------------
 */
export function average(...values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return roundMoney(sum / values.length);
}
