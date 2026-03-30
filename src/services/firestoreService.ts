// ESTE ARQUIVO FOI MANTIDO PARA COMPATIBILIDADE
// O projeto agora usa Supabase em vez de Firebase/Firestore
// Para novos desenvolvimentos, use o DatabaseService diretamente

import { createClient, isSupabaseConfigured } from '../../lib/supabase/client';

// Helper para converter snake_case para camelCase
function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result as T;
}

// Helper para converter camelCase para snake_case
function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
}

export class FirestoreService {
  // CRUD Generico adaptado para Supabase
  static async create(collectionName: string, data: Record<string, unknown>, unitId?: string): Promise<string> {
    const supabase = createClient();
    
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase nao configurado');
    }

    try {
      const snakeCaseData = toSnakeCase(data);
      if (unitId) {
        snakeCaseData.unit_id = unitId;
      }

      const { data: result, error } = await supabase
        .from(collectionName)
        .insert(snakeCaseData)
        .select()
        .single();

      if (error) throw error;
      return result.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Erro ao criar documento: ${errorMessage}`);
    }
  }

  static async update(collectionName: string, docId: string, data: Record<string, unknown>, _unitId?: string): Promise<void> {
    const supabase = createClient();
    
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase nao configurado');
    }

    try {
      const snakeCaseData = toSnakeCase(data);

      const { error } = await supabase
        .from(collectionName)
        .update(snakeCaseData)
        .eq('id', docId);

      if (error) throw error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Erro ao atualizar documento: ${errorMessage}`);
    }
  }

  static async delete(collectionName: string, docId: string, _unitId?: string): Promise<void> {
    const supabase = createClient();
    
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase nao configurado');
    }

    try {
      const { error } = await supabase
        .from(collectionName)
        .delete()
        .eq('id', docId);

      if (error) throw error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Erro ao deletar documento: ${errorMessage}`);
    }
  }

  static async get<T>(collectionName: string, docId: string, _unitId?: string): Promise<T> {
    const supabase = createClient();
    
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase nao configurado');
    }

    try {
      const { data, error } = await supabase
        .from(collectionName)
        .select('*')
        .eq('id', docId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Documento nao encontrado');

      return toCamelCase<T>(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Erro ao buscar documento: ${errorMessage}`);
    }
  }

  static async list<T>(
    collectionName: string,
    unitId?: string,
    filters?: { field: string; operator: string; value: unknown }[],
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number,
    _lastDoc?: unknown
  ): Promise<T[]> {
    const supabase = createClient();
    
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase nao configurado');
    }

    try {
      let query = supabase.from(collectionName).select('*');

      // Filtrar por unitId
      if (unitId) {
        query = query.eq('unit_id', unitId);
      }

      // Aplicar filtros
      if (filters) {
        for (const filter of filters) {
          const snakeField = filter.field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          
          switch (filter.operator) {
            case '==':
              query = query.eq(snakeField, filter.value);
              break;
            case '!=':
              query = query.neq(snakeField, filter.value);
              break;
            case '>':
              query = query.gt(snakeField, filter.value);
              break;
            case '>=':
              query = query.gte(snakeField, filter.value);
              break;
            case '<':
              query = query.lt(snakeField, filter.value);
              break;
            case '<=':
              query = query.lte(snakeField, filter.value);
              break;
          }
        }
      }

      // Aplicar ordenacao
      if (orderByField) {
        const snakeField = orderByField.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        query = query.order(snakeField, { ascending: orderDirection === 'asc' });
      }

      // Aplicar limite
      if (limitCount) {
        query = query.limit(limitCount);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => toCamelCase<T>(item));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Erro ao listar documentos: ${errorMessage}`);
    }
  }

  // Metodos especificos para o ADJPA ERP
  static async getUnitEmployees(unitId: string): Promise<unknown[]> {
    return this.list('employees', unitId, [
      { field: 'isActive', operator: '==', value: true }
    ], 'employeeName', 'asc');
  }

  static async getUnitMembers(unitId: string): Promise<unknown[]> {
    return this.list('members', unitId, [
      { field: 'isActive', operator: '==', value: true }
    ], 'name', 'asc');
  }

  static async getUnitTransactions(unitId: string, startDate?: Date, endDate?: Date): Promise<unknown[]> {
    const filters: { field: string; operator: string; value: unknown }[] = [];

    if (startDate && endDate) {
      filters.push({ field: 'date', operator: '>=', value: startDate.toISOString() });
      filters.push({ field: 'date', operator: '<=', value: endDate.toISOString() });
    }

    return this.list('transactions', unitId, filters, 'date', 'desc');
  }

  static async getUnitPayables(unitId: string): Promise<unknown[]> {
    return this.list('payables', unitId, [], 'dueDate', 'asc');
  }

  static async getUnitReceivables(unitId: string): Promise<unknown[]> {
    return this.list('receivables', unitId, [], 'dueDate', 'asc');
  }

  static async getUnitAssets(unitId: string): Promise<unknown[]> {
    return this.list('assets', unitId, [], 'name', 'asc');
  }

  // Buscar por CPF
  static async getEmployeeByCPF(unitId: string, cpf: string): Promise<unknown | null> {
    try {
      const employees = await this.list('employees', unitId, [
        { field: 'cpf', operator: '==', value: cpf }
      ]);

      return employees.length > 0 ? employees[0] : null;
    } catch {
      return null;
    }
  }

  // Buscar por matricula
  static async getEmployeeByRegistration(unitId: string, registration: string): Promise<unknown | null> {
    try {
      const employees = await this.list('employees', unitId, [
        { field: 'matricula', operator: '==', value: registration }
      ]);

      return employees.length > 0 ? employees[0] : null;
    } catch {
      return null;
    }
  }

  // Relatorios
  static async getFinancialSummary(unitId: string, startDate: Date, endDate: Date): Promise<{
    period: { startDate: Date; endDate: Date };
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    transactionCount: number;
  }> {
    const transactions = await this.getUnitTransactions(unitId, startDate, endDate) as { type: string; amount: number }[];

    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      period: { startDate, endDate },
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
      transactionCount: transactions.length
    };
  }
}

export default FirestoreService;
