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
import { Funcionario, Transacao } from '../../tipos';

export class FuncionarioService {
  static async getEmployees(params?: {
    id_unidade?: string;
    situacao?: string;
    page?: number;
    limit?: number;
  }): Promise<{funcionarios: Funcionario[], pagination: any}> {
    try {
      const response = await apiClient.get<Funcionario[]>('/funcionarios', params);
      
      return {
        funcionarios: Array.isArray(response) ? response : [],
        pagination: { page: 1, limit: 50, total: Array.isArray(response) ? response.length : 0, pages: 1 }
      };
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw new Error('Não foi possível carregar os dados dos funcionários');
    }
  }

  static async getEmployeeById(id: string): Promise<Funcionario> {
    return await apiClient.get(`/funcionarios/${id}`);
  }

  static async createEmployee(dados: Partial<Funcionario>): Promise<Funcionario> {
    return await apiClient.post('/funcionarios', dados);
  }

  static async updateEmployee(id: string, dados: Partial<Funcionario>): Promise<Funcionario> {
    return await apiClient.put(`/funcionarios/${id}`, dados);
  }

  static async deleteEmployee(id: string): Promise<void> {
    return await apiClient.delete(`/funcionarios/${id}`);
  }
}

export class TransacaoService {
  static async getTransactions(params?: {
    id_unidade?: string;
    tipo?: string;
    situacao?: string;
    page?: number;
    limit?: number;
  }): Promise<{transacoes: Transacao[], pagination: any}> {
    try {
      const response = await apiClient.get<Transacao[]>('/transacoes', params);
      
      return {
        transacoes: Array.isArray(response) ? response : [],
        pagination: { page: 1, limit: 50, total: Array.isArray(response) ? response.length : 0, pages: 1 }
      };
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw new Error('Não foi possível carregar os dados das transações');
    }
  }

  static async createTransaction(dados: Partial<Transacao>): Promise<Transacao> {
    return await apiClient.post('/transacoes', dados);
  }

  static async updateTransaction(id: string, dados: Partial<Transacao>): Promise<Transacao> {
    return await apiClient.put(`/transacoes/${id}`, dados);
  }

  static async deleteTransaction(id: string): Promise<void> {
    return await apiClient.delete(`/transacoes/${id}`);
  }
}

export default { FuncionarioService, TransacaoService };
