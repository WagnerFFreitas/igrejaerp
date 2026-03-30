// Servico de Funcoes - Adaptado para funcionar localmente
// Funcoes que antes usavam Firebase Functions agora sao executadas localmente
// Para funcoes mais complexas, considere usar Supabase Edge Functions

import { createClient, isSupabaseConfigured } from '../../lib/supabase/client';
import { AuthService } from './authService';

export class FunctionsService {
  // Criar usuario
  static async createUser(userData: {
    email: string;
    password: string;
    displayName: string;
    unitId: string;
    role: 'admin' | 'manager' | 'employee' | 'member';
    employeeId?: string;
    memberId?: string;
  }): Promise<{ success: boolean; uid: string; message: string }> {
    try {
      const profile = await AuthService.signUp(
        userData.email,
        userData.password,
        userData.displayName,
        userData.unitId,
        userData.role
      );

      // Atualizar com employeeId e memberId se fornecidos
      if (userData.employeeId || userData.memberId) {
        await AuthService.updateProfile({
          employeeId: userData.employeeId,
          memberId: userData.memberId
        });
      }

      return {
        success: true,
        uid: profile.uid,
        message: 'Usuario criado com sucesso'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Gerar relatorio financeiro
  static async generateFinancialReport(data: {
    unitId: string;
    startDate: string;
    endDate: string;
    reportType: 'cashFlow' | 'accountsPayable' | 'accountsReceivable';
  }): Promise<{
    reportType: string;
    period: { startDate: string; endDate: string };
    data: unknown[];
    summary: Record<string, number>;
  }> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nao configurado');
    }

    const supabase = createClient()!;

    try {
      let query = supabase.from('transactions').select('*').eq('unit_id', data.unitId);

      if (data.startDate) {
        query = query.gte('date', data.startDate);
      }
      if (data.endDate) {
        query = query.lte('date', data.endDate);
      }

      const { data: transactions, error } = await query;

      if (error) throw error;

      const income = (transactions || [])
        .filter((t: { type: string }) => t.type === 'INCOME')
        .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

      const expense = (transactions || [])
        .filter((t: { type: string }) => t.type === 'EXPENSE')
        .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

      return {
        reportType: data.reportType,
        period: { startDate: data.startDate, endDate: data.endDate },
        data: transactions || [],
        summary: {
          totalIncome: income,
          totalExpense: expense,
          netBalance: income - expense
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Processar folha de pagamento
  static async processPayroll(data: {
    unitId: string;
    month: number;
    year: number;
  }): Promise<{ success: boolean; payrollId: string; employees: number }> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nao configurado');
    }

    const supabase = createClient()!;

    try {
      // Buscar funcionarios da unidade
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('*')
        .eq('unit_id', data.unitId)
        .eq('is_active', true);

      if (empError) throw empError;

      // Criar registros de folha para cada funcionario
      const payrollRecords = (employees || []).map((emp: { id: string; salary: number }) => ({
        unit_id: data.unitId,
        employee_id: emp.id,
        month: data.month,
        year: data.year,
        base_salary: emp.salary || 0,
        overtime_hours: 0,
        overtime_value: 0,
        bonuses: 0,
        deductions: 0,
        inss: this.calculateINSS(emp.salary || 0),
        irrf: this.calculateIRRF(emp.salary || 0),
        fgts: (emp.salary || 0) * 0.08,
        net_salary: this.calculateNetSalary(emp.salary || 0),
        payment_status: 'pending'
      }));

      const { error: payrollError } = await supabase
        .from('payroll')
        .upsert(payrollRecords, { onConflict: 'employee_id,month,year' });

      if (payrollError) throw payrollError;

      return {
        success: true,
        payrollId: `payroll_${data.unitId}_${data.month}_${data.year}`,
        employees: employees?.length || 0
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Calcular INSS
  private static calculateINSS(salary: number): number {
    // Tabela INSS 2024 (simplificada)
    if (salary <= 1412.00) return salary * 0.075;
    if (salary <= 2666.68) return salary * 0.09;
    if (salary <= 4000.03) return salary * 0.12;
    if (salary <= 7786.02) return salary * 0.14;
    return 908.85; // Teto
  }

  // Calcular IRRF
  private static calculateIRRF(salary: number): number {
    const baseCalculo = salary - this.calculateINSS(salary);
    
    // Tabela IRRF 2024 (simplificada)
    if (baseCalculo <= 2259.20) return 0;
    if (baseCalculo <= 2826.65) return baseCalculo * 0.075 - 169.44;
    if (baseCalculo <= 3751.05) return baseCalculo * 0.15 - 381.44;
    if (baseCalculo <= 4664.68) return baseCalculo * 0.225 - 662.77;
    return baseCalculo * 0.275 - 896.00;
  }

  // Calcular salario liquido
  private static calculateNetSalary(salary: number): number {
    return salary - this.calculateINSS(salary) - this.calculateIRRF(salary);
  }

  // Enviar notificacao (mock - nao implementado)
  static async sendNotification(_data: {
    title: string;
    body: string;
    unitId?: string;
    userId?: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }): Promise<{ success: boolean }> {
    console.log('Notificacao enviada (mock):', _data);
    return { success: true };
  }

  // Exportar dados
  static async exportData(data: {
    unitId: string;
    collection: string;
    format: 'csv' | 'excel' | 'pdf';
    filters?: Record<string, unknown>;
  }): Promise<{ success: boolean; downloadURL: string }> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nao configurado');
    }

    const supabase = createClient()!;

    try {
      const { data: records, error } = await supabase
        .from(data.collection)
        .select('*')
        .eq('unit_id', data.unitId);

      if (error) throw error;

      // Gerar arquivo (simplificado - retorna dados em formato JSON)
      const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        downloadURL: url
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  }

  // Validar CNPJ
  static async validateCNPJ(cnpj: string): Promise<{ valid: boolean; message: string }> {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');

    if (cleanCNPJ.length !== 14) {
      return { valid: false, message: 'CNPJ deve ter 14 digitos' };
    }

    // Validacao do digito verificador
    let tamanho = cleanCNPJ.length - 2;
    let numeros = cleanCNPJ.substring(0, tamanho);
    const digitos = cleanCNPJ.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) {
      return { valid: false, message: 'CNPJ invalido' };
    }

    tamanho = tamanho + 1;
    numeros = cleanCNPJ.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) {
      return { valid: false, message: 'CNPJ invalido' };
    }

    return { valid: true, message: 'CNPJ valido' };
  }

  // Validar CPF
  static async validateCPF(cpf: string): Promise<{ valid: boolean; message: string }> {
    const cleanCPF = cpf.replace(/[^\d]/g, '');

    if (cleanCPF.length !== 11) {
      return { valid: false, message: 'CPF deve ter 11 digitos' };
    }

    // Verificar se todos os digitos sao iguais
    if (/^(\d)\1+$/.test(cleanCPF)) {
      return { valid: false, message: 'CPF invalido' };
    }

    // Validacao do primeiro digito
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cleanCPF.charAt(9))) {
      return { valid: false, message: 'CPF invalido' };
    }

    // Validacao do segundo digito
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cleanCPF.charAt(10))) {
      return { valid: false, message: 'CPF invalido' };
    }

    return { valid: true, message: 'CPF valido' };
  }

  // Calcular impostos
  static async calculateTaxes(data: {
    salary: number;
    dependents: number;
    maritalStatus: string;
  }): Promise<{ inss: number; irrf: number; fgts: number; netSalary: number }> {
    const inss = this.calculateINSS(data.salary);
    const irrf = this.calculateIRRF(data.salary);
    const fgts = data.salary * 0.08;
    const netSalary = data.salary - inss - irrf;

    return { inss, irrf, fgts, netSalary };
  }

  // Gerar boleto (mock - retorna dados simulados)
  static async generateBoleto(_data: {
    unitId: string;
    payableId: string;
    dueDate: string;
    amount: number;
    instructions?: string;
  }): Promise<{ success: boolean; boletoURL: string; barcode: string }> {
    const barcode = Math.random().toString().slice(2, 49);
    return {
      success: true,
      boletoURL: `data:text/plain;base64,${btoa('Boleto simulado')}`,
      barcode
    };
  }

  // Enviar email (mock - nao implementado)
  static async sendEmail(_data: {
    to: string[];
    subject: string;
    body: string;
    attachments?: string[];
    template?: string;
    templateData?: Record<string, unknown>;
  }): Promise<{ success: boolean; messageId: string }> {
    console.log('Email enviado (mock):', _data);
    return {
      success: true,
      messageId: `msg_${Date.now()}`
    };
  }

  // Backup manual (mock)
  static async createBackup(_data: {
    unitId: string;
    collections?: string[];
    description?: string;
  }): Promise<{ success: boolean; backupId: string; downloadURL: string }> {
    console.log('Backup criado (mock):', _data);
    return {
      success: true,
      backupId: `backup_${Date.now()}`,
      downloadURL: ''
    };
  }

  // Restaurar backup (mock)
  static async restoreBackup(_data: {
    unitId: string;
    backupId: string;
    collections?: string[];
  }): Promise<{ success: boolean; restored: number; errors: string[] }> {
    console.log('Backup restaurado (mock):', _data);
    return {
      success: true,
      restored: 0,
      errors: []
    };
  }

  // Importar dados (mock)
  static async importData(_data: {
    unitId: string;
    collection: string;
    file: string;
    mapping: Record<string, string>;
  }): Promise<{ success: boolean; imported: number; errors: string[] }> {
    console.log('Dados importados (mock):', _data);
    return {
      success: true,
      imported: 0,
      errors: []
    };
  }

  // Sincronizar com eSocial (mock)
  static async syncESocial(_data: {
    unitId: string;
    employeeId?: string;
    event: string;
    eventData: Record<string, unknown>;
  }): Promise<{ success: boolean; protocol: string; status: string }> {
    console.log('eSocial sincronizado (mock):', _data);
    return {
      success: true,
      protocol: `prot_${Date.now()}`,
      status: 'pending'
    };
  }

  // Processar conciliacao bancaria (mock)
  static async processBankReconciliation(_data: {
    unitId: string;
    accountId: string;
    statementFile: string;
    transactions: unknown[];
  }): Promise<{ success: boolean; reconciliationId: string; matches: unknown[]; divergences: unknown[] }> {
    console.log('Conciliacao processada (mock):', _data);
    return {
      success: true,
      reconciliationId: `recon_${Date.now()}`,
      matches: [],
      divergences: []
    };
  }
}

export default FunctionsService;
