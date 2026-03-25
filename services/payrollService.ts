/**
 * ============================================================================
 * SERVICE DE FOLHA DE PAGAMENTO
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este service gerencia TODO o processo de cálculo e geração de folha
 * de pagamento para funcionários e pastores.
 * 
 * FUNCIONALIDADES:
 * • Geração de folha mensal automática
 * • Cálculo de pró-labore para pastores
 * • 13º salário proporcional
 * • Férias + 1/3 constitucional
 * • Rescisão contratual
 * • Geração de recibos (holerites)
 * • Integração com contabilidade
 * 
 * ANALOGIA:
 * ---------
 * Pense como um "departamento pessoal automatizado":
 * - Cadastra funcionários
 * - Calcula folha todo mês automaticamente
 * - Gera recibos em PDF
 * - Mantém histórico completo
 */

import { Employee, PayrollCalculation, PaySlip, PayrollConfig, PayrollInput, TaxConfig } from '../types';
import {
  calcularINSS,
  calcularIRRF,
  calcularFGTS,
  calcularHorasExtras,
  calcularAdicionalNoturno,
  calcularInsalubridade,
  calcularDescontoFaltas,
  calcularSalarioFamilia,
  calcularDecimoTerceiro,
  calcularFerias,
  roundMoney,
} from '../utils/payrollCalculations';
import { DEFAULT_TAX_CONFIG } from '../constants';

/**
 * CLASSE DO SERVICE DE FOLHA
 * ==========================
 */
export class PayrollService {

  /**
   * GERAR FOLHA MENSAL PARA UM FUNCIONÁRIO
   * --------------------------------------
   * 
   * O QUE FAZ?
   * Calcula folha completa de pagamento
   * 
   * PARÂMETROS:
   * - input: PayrollInput → Dados para cálculo
   * - config?: PayrollConfig → Configurações (opcional)
   * 
   * RETORNO:
   * PayrollCalculation → Folha calculada
   * 
   * COMO FUNCIONA:
   * 1. Calcula proventos (salário + adicionais)
   * 2. Calcula descontos (INSS, IRRF, etc.)
   * 3. Apura totais
   * 4. Calcula custo empregador
   * 5. Retorna objeto completo
   */
  generateMonthlyPayroll(
    input: PayrollInput,
    config?: Partial<PayrollConfig>,
    taxConfig: TaxConfig = DEFAULT_TAX_CONFIG
  ): PayrollCalculation {
    const { employee, competencyMonth } = input;
    
    // 1. Salário base
    const baseSalary = employee.salary;
    
    // 2. Proventos
    const allowances = this.calculateAllowances(input);
    
    // 3. Salário bruto
    const grossSalary = baseSalary + 
                       allowances.overtime + 
                       allowances.nightShift + 
                       allowances.hazardPay + 
                       allowances.periculosidade +
                       allowances.dsr +
                       allowances.commission + 
                       allowances.bonuses + 
                       (input.otherAllowances || 0);
    
    // 4. Base de cálculo INSS
    const inssBase = grossSalary;
    const inssValue = input.inssManual !== undefined ? input.inssManual : calcularINSS(inssBase);
    
    // 5. Base de cálculo IRRF
    const irrfBase = grossSalary - inssValue;
    const dependentsCount = employee.dependents?.length || 0;
    const irrfValue = input.irrfManual !== undefined ? input.irrfManual : calcularIRRF(irrfBase, inssValue, dependentsCount, input.alimony || 0);
    
    // 6. FGTS (custo empregador, não desconta)
    const fgtsBase = grossSalary;
    const fgtsRate = taxConfig.fgtsRate || 0.08;
    const fgtsValue = calcularFGTS(fgtsBase, fgtsRate);
    
    // 7. Outros descontos
    const absencesValue = input.absenceDays ? calcularDescontoFaltas(baseSalary, input.workingDays || 22, input.absenceDays) : 0;
    const familySalaryValue = input.familySalary !== undefined ? input.familySalary : calcularSalarioFamilia(grossSalary, dependentsCount);
    
    // 8. Totais de descontos
    const totalDeductions = inssValue + irrfValue + (input.healthInsurance || 0) + 
                           (input.dentalInsurance || 0) + 
                           (input.mealAllowance || 0) + (input.mealTicket || 0) + 
                           (input.transport || 0) + (input.pharmacy || 0) + 
                           (input.lifeInsurance || 0) + (input.advance || 0) + 
                           (input.consignado || 0) + (input.coparticipation || 0) + 
                           absencesValue + (input.alimony || 0) + (input.otherDeductions || 0);
    
    // 9. Salário líquido
    const netSalary = grossSalary + familySalaryValue - totalDeductions;
    
    // 10. Custo total empregador
    const costs = this.getEmployerCosts(grossSalary, taxConfig);
    const employerCost = grossSalary + costs.fgts + costs.inssPatronal + costs.outros;
    
    // 11. Monta objeto de cálculo
    return {
      employeeId: employee.id,
      competencyMonth,
      grossSalary: roundMoney(grossSalary),
      
      allowances: {
        baseSalary,
        overtime: allowances.overtime || 0,
        nightShift: allowances.nightShift || 0,
        hazardPay: allowances.hazardPay + allowances.periculosidade,
        commission: allowances.commission || 0,
        bonuses: allowances.bonuses || 0,
        familySalary: familySalaryValue,
        other: allowances.dsr + (input.otherAllowances || 0),
      },
      
      deductions: {
        inss: inssValue,
        irrf: irrfValue,
        fgts: fgtsValue,
        union: 0,
        healthInsurance: input.healthInsurance || 0,
        dentalInsurance: input.dentalInsurance || 0,
        mealAllowance: input.mealAllowance || 0,
        mealTicket: input.mealTicket || 0,
        pharmacy: input.pharmacy || 0,
        lifeInsurance: input.lifeInsurance || 0,
        advance: input.advance || 0,
        consignado: input.consignado || 0,
        coparticipation: input.coparticipation || 0,
        transport: input.transport || 0,
        absences: absencesValue,
        delays: 0,
        alimony: input.alimony || 0,
        other: input.otherDeductions || 0,
      },
      
      totals: {
        totalAllowances: roundMoney(grossSalary + familySalaryValue),
        totalDeductions: roundMoney(totalDeductions),
        netSalary: roundMoney(netSalary),
        employerCost: roundMoney(employerCost),
      },
      
      calculationDetails: {
        inssBase: roundMoney(inssBase),
        irrfBase: roundMoney(irrfBase),
        fgtsBase: roundMoney(fgtsBase),
        inssRate: inssBase > 0 ? inssValue / inssBase : 0,
        irrfRate: irrfBase > 0 ? irrfValue / irrfBase : 0,
        fgtsRate: fgtsRate,
        dependentDeduction: dependentsCount * 189.59,
      },
      
      workingDays: input.workingDays || 22,
      absenceDays: input.absenceDays || 0,
      overtimeHours: (input.overtimeHours50 || 0) + (input.overtimeHours100 || 0),
      status: 'CALCULATED',
    };
  }

  /**
   * CALCULAR PROVENTOS
   * ------------------
   * 
   * O QUE FAZ?
   * Soma todos os adicionais e variáveis
   */
  private calculateAllowances(input: PayrollInput): {
    overtime: number;
    nightShift: number;
    hazardPay: number;
    periculosidade: number;
    dsr: number;
    commission: number;
    bonuses: number;
  } {
    const { employee } = input;
    
    // Horas extras 50%
    const overtime50 = input.overtimeHours50 
      ? calcularHorasExtras(employee.salary, employee.workHours || 220, input.overtimeHours50, 0.5)
      : 0;

    // Horas extras 100%
    const overtime100 = input.overtimeHours100 
      ? calcularHorasExtras(employee.salary, employee.workHours || 220, input.overtimeHours100, 1.0)
      : 0;
    
    // Adicional noturno
    const nightShift = input.nightShiftHours
      ? calcularAdicionalNoturno(employee.salary, input.nightShiftHours)
      : 0;
    
    // Insalubridade
    const hazardPay = (input.hazardPayDegree && input.hazardPayDegree !== 'NONE')
      ? calcularInsalubridade(1412.00, input.hazardPayDegree as any)
      : 0;

    // Periculosidade (30% sobre o salário base)
    const periculosidade = input.periculosidade ? employee.salary * 0.3 : 0;

    // DSR (Descanso Semanal Remunerado) - Cálculo simplificado: (HE + Adic Noturno) / dias úteis * domingos/feriados
    // Aqui vamos usar um valor fixo ou proporcional se dsr estiver ativo
    const dsr = input.dsr ? (overtime50 + overtime100 + nightShift) * 0.2 : 0;
    
    return {
      overtime: overtime50 + overtime100,
      nightShift,
      hazardPay,
      periculosidade,
      dsr,
      commission: input.commission || 0,
      bonuses: input.bonuses || 0,
    };
  }

  /**
   * OBTER CUSTOS DO EMPREGADOR
   * --------------------------
   * 
   * O QUE FAZ?
   * Calcula encargos patronais
   * 
   * PARÂMETRO:
   * - grossSalary: number
   * 
   * RETORNO:
   * number → Total de encargos
   */
  private getEmployerCosts(grossSalary: number, taxConfig: TaxConfig = DEFAULT_TAX_CONFIG): {
    inssPatronal: number;
    fgts: number;
    outros: number;
  } {
    // INSS Patronal (20% sobre a folha ou conforme config)
    const inssPatronal = grossSalary * (taxConfig.patronalRate || 0.20);
    
    // FGTS (8% ou conforme config)
    const fgts = grossSalary * (taxConfig.fgtsRate || 0.08);
    
    // Outros encargos (RAT + Terceiros)
    const outros = grossSalary * ((taxConfig.ratRate || 0.02) + (taxConfig.terceirosRate || 0.058));
    
    return {
      inssPatronal: roundMoney(inssPatronal),
      fgts: roundMoney(fgts),
      outros: roundMoney(outros),
    };
  }

  /**
   * GERAR PRÓ-LABORE PARA PASTOR
   * ----------------------------
   * 
   * O QUE FAZ?
   * Calcula remuneração de pastor (pró-labore)
   * 
   * PARÂMETROS:
   * - pastor: Employee (regime: PRO_LABORE)
   * - competencyMonth: string
   * - proLaboreValue: number → Valor do pró-labore
   * 
   * RETORNO:
   * PayrollCalculation
   * 
   * DIFERENÇAS DO CLT:
   * - Não tem horas extras
   * - Não tem FGTS
   * - INSS igual
   * - IRRF igual
   */
  generateProLabore(
    pastor: Employee,
    competencyMonth: string,
    proLaboreValue: number
  ): PayrollCalculation {
    // Usa função base mas sem benefícios CLT
    const input: PayrollInput = {
      employee: pastor,
      competencyMonth,
      overtimeHours50: 0,
      overtimeHours100: 0,
      nightShiftHours: 0,
      absenceDays: 0,
      fgtsRate: 0,  // Pastor não tem FGTS
    };
    
    const calculation = this.generateMonthlyPayroll(input);
    
    // Ajusta salário bruto para valor do pró-labore
    calculation.grossSalary = proLaboreValue;
    calculation.allowances.baseSalary = proLaboreValue;
    
    // Recalcula INSS e IRRF
    const inssValue = calcularINSS(proLaboreValue);
    calculation.deductions.inss = inssValue;
    calculation.calculationDetails.inssBase = proLaboreValue;
    
    const irrfBase = proLaboreValue - inssValue;
    const irrfValue = calcularIRRF(irrfBase, inssValue, pastor.dependents?.length || 0);
    calculation.deductions.irrf = irrfValue;
    calculation.calculationDetails.irrfBase = irrfBase;
    
    // Recalcula totais
    calculation.totals.totalAllowances = proLaboreValue;
    calculation.totals.totalDeductions = inssValue + irrfValue;
    calculation.totals.netSalary = proLaboreValue - calculation.totals.totalDeductions;
    
    return calculation;
  }

  /**
   * CALCULAR 13º SALÁRIO
   * --------------------
   */
  calculateThirteenthSalary(
    employee: Employee,
    year: number,
    workedMonths: number,
    installment: 1 | 2
  ): PayrollCalculation {
    const baseValue = (employee.salary / 12) * workedMonths;
    
    if (installment === 1) {
      // Primeira parcela (50%, sem descontos)
      const firstHalf = baseValue * 0.5;
      
      return {
        employeeId: employee.id,
        competencyMonth: `${year}-11`,
        grossSalary: firstHalf,
        allowances: {
          baseSalary: firstHalf,
          overtime: 0,
          nightShift: 0,
          hazardPay: 0,
          commission: 0,
          bonuses: 0,
          familySalary: 0,
          other: 0,
        },
        deductions: {
          inss: 0,  // Descontado na 2ª parcela
          irrf: 0,
          fgts: calcularFGTS(firstHalf),
          union: 0,
          healthInsurance: 0,
          mealTicket: 0,
          transport: 0,
          absences: 0,
          delays: 0,
          alimony: 0,
          other: 0,
        },
        totals: {
          totalAllowances: firstHalf,
          totalDeductions: 0,
          netSalary: firstHalf,
          employerCost: firstHalf + calcularFGTS(firstHalf),
        },
        calculationDetails: {
          inssBase: 0,
          irrfBase: 0,
          fgtsBase: firstHalf,
          inssRate: 0,
          irrfRate: 0,
          fgtsRate: 0.08,
          dependentDeduction: 0,
        },
        workingDays: 30,
        absenceDays: 0,
        overtimeHours: 0,
        status: 'CALCULATED',
      };
    } else {
      // Segunda parcela (restante, com descontos)
      const secondHalf = baseValue * 0.5;
      const inssValue = calcularINSS(secondHalf);
      const irrfValue = calcularIRRF(secondHalf, inssValue, employee.dependents?.length || 0);
      
      return {
        employeeId: employee.id,
        competencyMonth: `${year}-12`,
        grossSalary: secondHalf,
        allowances: {
          baseSalary: secondHalf,
          overtime: 0,
          nightShift: 0,
          hazardPay: 0,
          commission: 0,
          bonuses: 0,
          familySalary: 0,
          other: 0,
        },
        deductions: {
          inss: inssValue,
          irrf: irrfValue,
          fgts: calcularFGTS(secondHalf),
          union: 0,
          healthInsurance: 0,
          mealTicket: 0,
          transport: 0,
          absences: 0,
          delays: 0,
          alimony: 0,
          other: 0,
        },
        totals: {
          totalAllowances: secondHalf,
          totalDeductions: inssValue + irrfValue,
          netSalary: secondHalf - inssValue - irrfValue,
          employerCost: secondHalf + calcularFGTS(secondHalf),
        },
        calculationDetails: {
          inssBase: secondHalf,
          irrfBase: secondHalf - inssValue,
          fgtsBase: secondHalf,
          inssRate: inssValue / secondHalf,
          irrfRate: 0,
          fgtsRate: 0.08,
          dependentDeduction: 0,
        },
        workingDays: 30,
        absenceDays: 0,
        overtimeHours: 0,
        status: 'CALCULATED',
      };
    }
  }

  /**
   * CALCULAR FÉRIAS
   * ---------------
   */
  calculateVacationPay(
    employee: Employee,
    vacationDays: number = 30
  ): { value: number; third: number; total: number; inss: number; irrf: number; net: number } {
    const { value, third, total } = calcularFerias(employee.salary, vacationDays);
    
    // Calcula INSS e IRRF sobre férias
    const inssValue = calcularINSS(total);
    const irrfValue = calcularIRRF(total, inssValue, employee.dependents?.length || 0);
    
    const netValue = total - inssValue - irrfValue;
    
    return {
      value,
      third,
      total,
      inss: inssValue,
      irrf: irrfValue,
      net: netValue,
    };
  }

  /**
   * GERAR RECIBO EM PDF (MOCK)
   * -------------------------
   * 
   * O QUE FAZ?
   * Prepara dados para geração de PDF
   * 
   * PARÂMETROS:
   * - calculation: PayrollCalculation
   * - employee: Employee
   * 
   * RETORNO:
   * PaySlip
   */
  generatePaySlip(
    calculation: PayrollCalculation,
    employee: Employee
  ): PaySlip {
    return {
      payrollId: calculation.employeeId + '-' + calculation.competencyMonth,
      employee,
      calculation,
      generatedAt: new Date().toISOString(),
      pdfUrl: `/recibos/${calculation.employeeId}-${calculation.competencyMonth}.pdf`,
    };
  }
}

/**
 * FUNÇÃO AUXILIAR PARA CUSTOS DO EMPREGADOR
 */
function employerCosts(costs: { inssPatronal: number; fgts: number; outros: number }): number {
  return costs.inssPatronal + costs.fgts + costs.outros;
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 */
export const payrollService = new PayrollService();
