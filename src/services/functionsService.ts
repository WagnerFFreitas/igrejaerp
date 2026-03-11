import { httpsCallable } from 'firebase/functions';
import { functions } from './firebaseService';

export class FunctionsService {
  // Criar usuário
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
      const createUser = httpsCallable(functions, 'createUser');
      const result = await createUser(userData);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Gerar relatório financeiro
  static async generateFinancialReport(data: {
    unitId: string;
    startDate: string;
    endDate: string;
    reportType: 'cashFlow' | 'accountsPayable' | 'accountsReceivable';
  }): Promise<any> {
    try {
      const generateReport = httpsCallable(functions, 'generateFinancialReport');
      const result = await generateReport(data);
      return result.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Processar folha de pagamento
  static async processPayroll(data: {
    unitId: string;
    month: number;
    year: number;
  }): Promise<{ success: boolean; payrollId: string; employees: number }> {
    try {
      const processPayroll = httpsCallable(functions, 'processPayroll');
      const result = await processPayroll(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Enviar notificação
  static async sendNotification(data: {
    title: string;
    body: string;
    unitId?: string;
    userId?: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }): Promise<{ success: boolean }> {
    try {
      const sendNotification = httpsCallable(functions, 'sendNotification');
      const result = await sendNotification(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Exportar dados
  static async exportData(data: {
    unitId: string;
    collection: string;
    format: 'csv' | 'excel' | 'pdf';
    filters?: any;
  }): Promise<{ success: boolean; downloadURL: string }> {
    try {
      const exportData = httpsCallable(functions, 'exportData');
      const result = await exportData(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Importar dados
  static async importData(data: {
    unitId: string;
    collection: string;
    file: string; // URL do arquivo no Storage
    mapping: any; // Mapeamento de campos
  }): Promise<{ success: boolean; imported: number; errors: string[] }> {
    try {
      const importData = httpsCallable(functions, 'importData');
      const result = await importData(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Validar CNPJ
  static async validateCNPJ(cnpj: string): Promise<{ valid: boolean; message: string }> {
    try {
      const validateCNPJ = httpsCallable(functions, 'validateCNPJ');
      const result = await validateCNPJ({ cnpj });
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Validar CPF
  static async validateCPF(cpf: string): Promise<{ valid: boolean; message: string }> {
    try {
      const validateCPF = httpsCallable(functions, 'validateCPF');
      const result = await validateCPF({ cpf });
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Calcular impostos
  static async calculateTaxes(data: {
    salary: number;
    dependents: number;
    maritalStatus: string;
  }): Promise<{ inss: number; irrf: number; fgts: number; netSalary: number }> {
    try {
      const calculateTaxes = httpsCallable(functions, 'calculateTaxes');
      const result = await calculateTaxes(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Gerar boleto
  static async generateBoleto(data: {
    unitId: string;
    payableId: string;
    dueDate: string;
    amount: number;
    instructions?: string;
  }): Promise<{ success: boolean; boletoURL: string; barcode: string }> {
    try {
      const generateBoleto = httpsCallable(functions, 'generateBoleto');
      const result = await generateBoleto(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Enviar email
  static async sendEmail(data: {
    to: string[];
    subject: string;
    body: string;
    attachments?: string[];
    template?: string;
    templateData?: any;
  }): Promise<{ success: boolean; messageId: string }> {
    try {
      const sendEmail = httpsCallable(functions, 'sendEmail');
      const result = await sendEmail(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Backup manual
  static async createBackup(data: {
    unitId: string;
    collections?: string[];
    description?: string;
  }): Promise<{ success: boolean; backupId: string; downloadURL: string }> {
    try {
      const createBackup = httpsCallable(functions, 'createBackup');
      const result = await createBackup(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Restaurar backup
  static async restoreBackup(data: {
    unitId: string;
    backupId: string;
    collections?: string[];
  }): Promise<{ success: boolean; restored: number; errors: string[] }> {
    try {
      const restoreBackup = httpsCallable(functions, 'restoreBackup');
      const result = await restoreBackup(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sincronizar com eSocial
  static async syncESocial(data: {
    unitId: string;
    employeeId?: string;
    event: string;
    eventData: any;
  }): Promise<{ success: boolean; protocol: string; status: string }> {
    try {
      const syncESocial = httpsCallable(functions, 'syncESocial');
      const result = await syncESocial(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Processar conciliação bancária
  static async processBankReconciliation(data: {
    unitId: string;
    accountId: string;
    statementFile: string;
    transactions: any[];
  }): Promise<{ success: boolean; reconciliationId: string; matches: any[]; divergences: any[] }> {
    try {
      const processBankReconciliation = httpsCallable(functions, 'processBankReconciliation');
      const result = await processBankReconciliation(data);
      return result.data as any;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default FunctionsService;
