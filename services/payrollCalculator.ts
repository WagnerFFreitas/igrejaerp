// Calculadora Trabalhista Completa

import { Payroll } from '../types';
import { DEFAULT_TAX_CONFIG } from '../constants';

/**
 * Classe responsável por todos os cálculos trabalhistas da folha de pagamento
 */
export class PayrollCalculator {

  /**
   * Calcula o INSS do empregado com base nas faixas progressivas
   */
  calculateINSS(salary: number, dependentCount?: number): number {
    const brackets = DEFAULT_TAX_CONFIG.inssBrackets;
    let inss = 0;
    let remainingSalary = salary;
    let previousLimit = 0;

    for (const bracket of brackets) {
      if (remainingSalary <= 0) break;

      const taxableInThisBracket = Math.min(remainingSalary, bracket.limit - previousLimit);
      inss += taxableInThisBracket * bracket.rate;
      
      remainingSalary -= taxableInThisBracket;
      previousLimit = bracket.limit;
    }

    // Teto do INSS
    const ceiling = 7786.02 * 0.14;
    return Math.min(inss, ceiling);
  }

  /**
   * Calcula o IRRF com base na base de cálculo e dependentes
   */
  calculateIRRF(
    grossSalary: number, 
    inss: number, 
    dependentCount: number = 0,
    otherDeductions: number = 0
  ): number {
    const deductionPerDependent = 189.59;
    const taxableBase = grossSalary - inss - (dependentCount * deductionPerDependent) - otherDeductions;

    if (taxableBase <= 0) return 0;

    const brackets = DEFAULT_TAX_CONFIG.irrfBrackets;
    
    for (const bracket of brackets) {
      if (taxableBase <= bracket.limit) {
        const irrf = (taxableBase * bracket.rate) - bracket.deduction;
        return Math.max(0, irrf);
      }
    }

    // Última faixa (acima do teto)
    const lastBracket = brackets[brackets.length - 1];
    const irrf = (taxableBase * lastBracket.rate) - lastBracket.deduction;
    return Math.max(0, irrf);
  }

  /**
   * Calcula o FGTS mensal (8% sobre salário bruto + variáveis)
   */
  calculateFGTS(grossSalary: number, additionalEarnings: number = 0): number {
    const totalBase = grossSalary + additionalEarnings;
    return totalBase * DEFAULT_TAX_CONFIG.fgtsRate;
  }

  /**
   * Calcula o INSS Patronal (20% sobre a folha)
   */
  calculateEmployerINSS(grossSalary: number, additionalEarnings: number = 0): number {
    const totalBase = grossSalary + additionalEarnings;
    return totalBase * DEFAULT_TAX_CONFIG.patronalRate;
  }

  /**
   * Calcula o RAT (Risco Ambiental do Trabalho) - 1%, 2% ou 3%
   */
  calculateRAT(grossSalary: number, rate: number = 0.03): number {
    return grossSalary * rate;
  }

  /**
   * Calcula o Salário Educação (2,5% sobre a folha)
   */
  calculateSalarioEducacao(grossSalary: number): number {
    return grossSalary * DEFAULT_TAX_CONFIG.terceirosRate;
  }

  /**
   * Calcula férias proporcionais
   */
  calculateVacationProportional(
    admissionDate: Date, 
    currentMonth: number,
    currentYear: number,
    salary: number,
    hasJustCause: boolean = true
  ): { vacationValue: number; constitutionalThird: number; total: number } {
    if (!hasJustCause) {
      return { vacationValue: 0, constitutionalThird: 0, total: 0 };
    }

    const monthsWorked = this.calculateMonthsWorked(admissionDate, currentMonth, currentYear);
    const proportionalMonths = Math.min(monthsWorked, 12);
    
    const vacationValue = (salary / 12) * proportionalMonths;
    const constitutionalThird = vacationValue / 3;
    const total = vacationValue + constitutionalThird;

    return { vacationValue, constitutionalThird, total };
  }

  /**
   * Calcula 13º salário proporcional
   */
  calculateChristmasBonusProportional(
    admissionDate: Date,
    currentMonth: number,
    currentYear: number,
    salary: number,
    hasJustCause: boolean = true
  ): number {
    if (!hasJustCause) {
      return 0;
    }

    const monthsWorked = this.calculateMonthsWorked(admissionDate, currentMonth, currentYear);
    const proportionalMonths = Math.min(monthsWorked, 12);
    
    return (salary / 12) * proportionalMonths;
  }

  /**
   * Calcula horas extras
   */
  calculateOvertime(
    salary: number,
    hours50: number = 0,
    hours100: number = 0,
    monthlyHours: number = 220
  ): { overtime50: number; overtime100: number; total: number } {
    const hourlyRate = salary / monthlyHours;
    
    const overtime50 = hours50 * hourlyRate * 1.5;
    const overtime100 = hours100 * hourlyRate * 2.0;
    const total = overtime50 + overtime100;

    return { overtime50, overtime100, total };
  }

  /**
   * Calcula adicional noturno
   */
  calculateNightShiftAddition(
    salary: number,
    nightHours: number = 0,
    monthlyHours: number = 220
  ): number {
    const hourlyRate = salary / monthlyHours;
    const nightShiftPercent = 0.20; // 20% para horário noturno
    
    return nightHours * hourlyRate * nightShiftPercent;
  }

  /**
   * Calcula DSR (Descanso Semanal Remunerado) sobre horas extras
   */
  calculateDSR(
    overtimeTotal: number,
    workDaysInMonth: number = 26,
    sundaysAndHolidays: number = 4
  ): number {
    const dsrRate = sundaysAndHolidays / workDaysInMonth;
    return overtimeTotal * dsrRate;
  }

  /**
   * Calcula insalubridade (grau baixo, médio ou alto)
   */
  calculateInsalubrity(
    baseSalary: number,
    degree: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH',
    useMinimumWage: boolean = false
  ): number {
    const minimumWage = 1412.00; // Valor de 2024
    const base = useMinimumWage ? minimumWage : baseSalary;

    switch (degree) {
      case 'LOW':
        return base * 0.10; // 10%
      case 'MEDIUM':
        return base * 0.20; // 20%
      case 'HIGH':
        return base * 0.40; // 40%
      default:
        return 0;
    }
  }

  /**
   * Calcula periculosidade (30% sobre salário base)
   */
  calculateDangerousness(baseSalary: number): number {
    return baseSalary * 0.30;
  }

  /**
   * Calcula salário família (por dependente)
   */
  calculateFamilySalary(dependentCount: number, grossSalary: number): number {
    if (grossSalary > 1813.60) { // Limite de 2024
      return 0;
    }

    const quotaPerDependent = 62.04; // Valor de 2024
    return dependentCount * quotaPerDependent;
  }

  /**
   * Calcula média de horas extras para incorporação
   */
  calculateOvertimeAverage(
    overtimeHistory: number[],
    monthsToConsider: number = 12
  ): number {
    if (overtimeHistory.length === 0) return 0;

    const recentMonths = overtimeHistory.slice(-monthsToConsider);
    const sum = recentMonths.reduce((acc, val) => acc + val, 0);
    return sum / recentMonths.length;
  }

  /**
   * Calcula rescisão completa
   */
  calculateRescision(
    employee: Payroll,
    terminationDate: Date,
    reason: 'SEM_JUSTA_CAUSA' | 'COM_JUSTA_CAUSA' | 'PEDIDO_DEMISSAO' | 'TERMO_ACORDO'
  ): RescisionResult {
    const admissionDate = new Date(employee.data_admissao);
    const salary = employee.salario_base;
    
    const yearsWorked = this.calculateYearsWorked(admissionDate, terminationDate);
    const monthsWorked = this.calculateMonthsWorkedInYear(admissionDate, terminationDate);
    
    let balanceSalary = 0;
    let accruedVacation = 0;
    let proportionalVacation = 0;
    let christmasBonus = 0;
    let noticePeriod = 0;
    let fgtsFine = 0;
    
    // Saldo de salário
    const dayOfMonth = terminationDate.getDate();
    const daysInMonth = new Date(terminationDate.getFullYear(), terminationDate.getMonth() + 1, 0).getDate();
    balanceSalary = (salary / daysInMonth) * dayOfMonth;

    // Férias vencidas (se houver)
    accruedVacation = salary + (salary / 3);

    // Férias proporcionais
    const vacationResult = this.calculateVacationProportional(
      admissionDate,
      terminationDate.getMonth() + 1,
      terminationDate.getFullYear(),
      salary,
      reason === 'SEM_JUSTA_CAUSA'
    );
    proportionalVacation = vacationResult.total;

    // 13º proporcional
    christmasBonus = this.calculateChristmasBonusProportional(
      admissionDate,
      terminationDate.getMonth() + 1,
      terminationDate.getFullYear(),
      salary,
      reason === 'SEM_JUSTA_CAUSA'
    );

    // Aviso prévio (apenas sem justa causa)
    if (reason === 'SEM_JUSTA_CAUSA') {
      noticePeriod = this.calculateNoticePeriod(yearsWorked, salary);
    }

    // Multa de 40% do FGTS (apenas sem justa causa)
    if (reason === 'SEM_JUSTA_CAUSA') {
      const estimatedFGTS = salary * 0.08 * (yearsWorked * 12 + monthsWorked);
      fgtsFine = estimatedFGTS * 0.40;
    }

    const totalGross = balanceSalary + accruedVacation + proportionalVacation + 
                       christmasBonus + noticePeriod + fgtsFine;

    return {
      balanceSalary,
      accruedVacation,
      proportionalVacation,
      christmasBonus,
      noticePeriod,
      fgtsFine,
      totalGross,
      yearsWorked,
      monthsWorked
    };
  }

  /**
   * Calcula aviso prévio indenizado
   */
  calculateNoticePeriod(yearsWorked: number, salary: number): number {
    // Lei 12.506/2011: 30 dias + 3 dias por ano completo (máximo 90 dias)
    const baseDays = 30;
    const additionalDays = Math.min(yearsWorked * 3, 60);
    const totalDays = baseDays + additionalDays;
    
    return (salary / 30) * totalDays;
  }

  // Métodos auxiliares privados

  private calculateMonthsWorked(admissionDate: Date, currentMonth: number, currentYear: number): number {
    const admissionMonth = admissionDate.getMonth() + 1;
    const admissionYear = admissionDate.getFullYear();
    
    if (currentYear === admissionYear) {
      return currentMonth - admissionMonth + 1;
    }
    
    const fullYearMonths = (currentYear - admissionYear - 1) * 12;
    const remainingMonths = (12 - admissionMonth + 1) + currentMonth;
    
    return fullYearMonths + remainingMonths;
  }

  private calculateYearsWorked(start: Date, end: Date): number {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0 || months < 0) {
      years--;
    }

    return Math.max(0, years);
  }

  private calculateMonthsWorkedInYear(start: Date, end: Date): number {
    const months = (end.getFullYear() - start.getFullYear()) * 12;
    return months + end.getMonth() - start.getMonth();
  }
}

/**
 * Resultado do cálculo de rescisão
 */
export interface RescisionResult {
  balanceSalary: number;
  accruedVacation: number;
  proportionalVacation: number;
  christmasBonus: number;
  noticePeriod: number;
  fgtsFine: number;
  totalGross: number;
  yearsWorked: number;
  monthsWorked: number;
}
