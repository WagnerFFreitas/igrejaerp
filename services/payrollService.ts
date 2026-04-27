/**
 * ============================================================================
 * PAYROLLSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para payroll service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import { DEFAULT_TAX_CONFIG } from '../constants';
import { PayrollCalculation, PayrollInput, TaxConfig } from '../types';
import apiClient from '../src/services/apiService';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (payroll service).
 */

const DEPENDENT_DEDUCTION = 189.59;
const MONTHLY_HOURS = 220;

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeHazardDegree = (value?: string) => {
  switch (value) {
    case 'LOW':
    case 'MIN':
      return 0.1;
    case 'MEDIUM':
    case 'MED':
      return 0.2;
    case 'HIGH':
    case 'MAX':
      return 0.4;
    default:
      return 0;
  }
};

const resolveTaxConfig = (config?: Partial<TaxConfig> | Record<string, any>) => {
  const source: any = config || DEFAULT_TAX_CONFIG;

  return {
    inssBrackets: Array.isArray(source.inssBrackets)
      ? source.inssBrackets
      : Array.isArray(source.inss)
        ? source.inss
        : DEFAULT_TAX_CONFIG.inssBrackets,
    irrfBrackets: Array.isArray(source.irrfBrackets)
      ? source.irrfBrackets
      : Array.isArray(source.irrf)
        ? source.irrf
        : DEFAULT_TAX_CONFIG.irrfBrackets,
    fgtsRate: toNumber(source.fgtsRate ?? source.fgts?.rate, DEFAULT_TAX_CONFIG.fgtsRate),
    patronalRate: toNumber(source.patronalRate ?? source.patronal?.rate, DEFAULT_TAX_CONFIG.patronalRate),
    ratRate: toNumber(source.ratRate, DEFAULT_TAX_CONFIG.ratRate),
    terceirosRate: toNumber(source.terceirosRate, DEFAULT_TAX_CONFIG.terceirosRate)
  };
};

const calculateProgressiveINSS = (base: number, brackets: Array<{ limit: number; rate: number }>) => {
  let total = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (base <= previousLimit) break;
    const currentLimit = Number.isFinite(bracket.limit) ? bracket.limit : base;
    const taxableSlice = Math.min(base, currentLimit) - previousLimit;
    if (taxableSlice > 0) {
      total += taxableSlice * toNumber(bracket.rate);
    }
    previousLimit = currentLimit;
  }

  return Math.max(0, total);
};

const calculateIRRF = (
  taxableBase: number,
  brackets: Array<{ limit: number; rate: number; deduction: number }>
) => {
  if (taxableBase <= 0) return { value: 0, rate: 0, deduction: 0 };

  const applicableBracket =
    brackets.find((bracket) => taxableBase <= bracket.limit) ||
    brackets[brackets.length - 1] ||
    { limit: Number.POSITIVE_INFINITY, rate: 0, deduction: 0 };

  const rate = toNumber(applicableBracket.rate);
  const deduction = toNumber(applicableBracket.deduction);
  const value = Math.max(0, taxableBase * rate - deduction);

  return { value, rate, deduction };
};

const sumValues = (values: number[]) => values.reduce((acc, item) => acc + toNumber(item), 0);

const generateMonthlyPayroll = (
  input: PayrollInput,
  _options: Record<string, unknown> = {},
  config?: Partial<TaxConfig> | Record<string, any>
): PayrollCalculation => {
  const resolvedTaxConfig = resolveTaxConfig(config);
  const salary = toNumber(input.employee?.salary, 0);
  const hourlyRate = salary / MONTHLY_HOURS;
  const dependentsCount =
    input.employee?.dependents?.length ??
    toNumber((input.employee as any)?.dependentes_qtd, 0);

  const overtime50 = hourlyRate * 1.5 * toNumber(input.overtimeHours50);
  const overtime100 = hourlyRate * 2 * toNumber(input.overtimeHours100);
  const overtime = overtime50 + overtime100;
  const nightShift = hourlyRate * 0.2 * toNumber(input.nightShiftHours);
  const hazardPay = salary * normalizeHazardDegree(input.hazardPayDegree);
  const dangerousness = input.periculosidade ? salary * 0.3 : 0;
  const dsrValue = input.dsr ? overtime / 6 : 0;
  const commission = toNumber(input.commission);
  const bonuses = toNumber(input.bonuses);
  const familySalary = toNumber(input.familySalary);
  const otherAllowances = toNumber(input.otherAllowances);

  const grossSalary = sumValues([
    salary,
    overtime,
    nightShift,
    hazardPay,
    dangerousness,
    dsrValue,
    commission,
    bonuses,
    familySalary,
    otherAllowances
  ]);

  const inss = input.inssManual !== undefined
    ? toNumber(input.inssManual)
    : calculateProgressiveINSS(grossSalary, resolvedTaxConfig.inssBrackets);

  const irrfBase =
    grossSalary -
    inss -
    dependentsCount * DEPENDENT_DEDUCTION -
    toNumber(input.alimony);

  const irrfResult = input.irrfManual !== undefined
    ? { value: toNumber(input.irrfManual), rate: 0, deduction: 0 }
    : calculateIRRF(irrfBase, resolvedTaxConfig.irrfBrackets);

  const fgts = grossSalary * resolvedTaxConfig.fgtsRate;
  const healthInsurance = toNumber(input.healthInsurance);
  const dentalInsurance = toNumber(input.dentalInsurance);
  const mealAllowance = toNumber(input.mealAllowance);
  const mealTicket = toNumber(input.mealTicket);
  const transport = toNumber(input.transport);
  const pharmacy = toNumber(input.pharmacy);
  const lifeInsurance = toNumber(input.lifeInsurance);
  const advance = toNumber(input.advance);
  const consignado = toNumber(input.consignado);
  const coparticipation = toNumber(input.coparticipation);
  const alimony = toNumber(input.alimony);
  const absences = salary / 30 * toNumber(input.absenceDays);
  const delays = hourlyRate / 60 * toNumber(input.delayMinutes);
  const otherDeductions = toNumber(input.otherDeductions);

  const totalDeductions = sumValues([
    inss,
    irrfResult.value,
    healthInsurance,
    dentalInsurance,
    mealAllowance,
    mealTicket,
    transport,
    pharmacy,
    lifeInsurance,
    advance,
    consignado,
    coparticipation,
    alimony,
    absences,
    delays,
    otherDeductions
  ]);

  const employerCharges = grossSalary * (
    resolvedTaxConfig.fgtsRate +
    resolvedTaxConfig.patronalRate +
    resolvedTaxConfig.ratRate +
    resolvedTaxConfig.terceirosRate
  );

  return {
    employeeId: input.employee.id,
    competencyMonth: input.competencyMonth,
    grossSalary,
    allowances: {
      baseSalary: salary,
      overtime,
      nightShift,
      hazardPay: hazardPay + dangerousness + dsrValue,
      commission,
      bonuses,
      familySalary,
      other: otherAllowances
    },
    deductions: {
      inss,
      irrf: irrfResult.value,
      fgts,
      healthInsurance,
      dentalInsurance,
      mealAllowance,
      mealTicket,
      transport,
      pharmacy,
      lifeInsurance,
      advance,
      consignado,
      coparticipation,
      absences,
      delays,
      alimony,
      other: otherDeductions
    },
    totals: {
      totalAllowances: grossSalary,
      totalDeductions,
      netSalary: grossSalary - totalDeductions,
      employerCost: grossSalary + employerCharges
    },
    calculationDetails: {
      inssBase: grossSalary,
      inssRate: grossSalary > 0 ? inss / grossSalary : 0,
      inssValue: inss,
      irrfBase: Math.max(0, irrfBase),
      irrfRate: irrfResult.rate,
      irrfDeduction: irrfResult.deduction,
      irrfValue: irrfResult.value,
      fgtsBase: grossSalary,
      fgtsRate: resolvedTaxConfig.fgtsRate,
      fgtsValue: fgts
    }
  };
};

export const payrollService = {
  // Listar períodos de folha
  getPeriods: async (unitId?: string) => {
    return await apiClient.get('/payroll/periods', { unitId });
  },

  // Criar novo período
  createPeriod: async (periodData: any) => {
    return await apiClient.post('/payroll/periods', periodData);
  },

  // Salvar cálculo de folha
  saveCalculation: async (calculation: PayrollCalculation) => {
    return await apiClient.post('/payroll/calculations', calculation);
  },

  // Buscar cálculos de um período
  getCalculations: async (competencyMonth: string, unitId?: string) => {
    return await apiClient.get(`/payroll/calculations/${competencyMonth}`, { unitId });
  },

  // Legado/Compatibilidade
  getPayroll: async (unitId: string) => {
    const now = new Date();
    const competency = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return await apiClient.get(`/payroll/calculations/${competency}`, { unitId });
  },

  calculatePayroll: async (data: any) => {
    return await apiClient.post('/payroll/calculations', data);
  },

  processPayroll: async (data: any) => {
    return await apiClient.post('/payroll/calculations', data);
  },

  generateMonthlyPayroll
};
