/**
 * ============================================================================
 * EMPLOYEESERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para employee service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import apiClient from './apiService';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (employee service).
 */

export interface Employee {
  id: string;
  unitId: string;
  employeeName: string;
  cpf: string;
  email: string;
  phone: string;
  cargo: string;
  department: string;
  salary: number;
  admissionDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  created_at: string;
  updated_at: string;
  // Campos adicionais para o componente Funcionarios
  matricula?: string;
  tipo_contrato?: string;
  avatar?: string | null;
}

export interface Transaction {
  id: string;
  unitId: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'PAID' | 'PENDING';
  date: string;
  category: string;
  accountId?: string;
  memberId?: string;
  created_at: string;
  updated_at: string;
}

export class EmployeeService {
  static async getEmployees(params?: {
    unitId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{employees: Employee[], pagination: any}> {
    try {
      const response = await apiClient.get<Employee[]>('/employees', params);
      
      return {
        employees: Array.isArray(response) ? response : [],
        pagination: { page: 1, limit: 50, total: Array.isArray(response) ? response.length : 0, pages: 1 }
      };
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw new Error('Não foi possível carregar os dados dos funcionários');
    }
  }
}

export class TransactionService {
  static async getTransactions(params?: {
    unitId?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{transactions: Transaction[], pagination: any}> {
    try {
      const response = await apiClient.get<Transaction[]>('/transactions', params);
      
      return {
        transactions: Array.isArray(response) ? response : [],
        pagination: { page: 1, limit: 50, total: Array.isArray(response) ? response.length : 0, pages: 1 }
      };
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw new Error('Não foi possível carregar os dados das transações');
    }
  }
}

export default { EmployeeService, TransactionService };
