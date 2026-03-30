import { Member, Payroll, Transaction, FinancialAccount, Unit, Asset, EmployeeLeave, ChurchEvent } from '../types';
import { MOCK_UNITS, MOCK_MEMBERS, MOCK_TRANSACTIONS, MOCK_ACCOUNTS, MOCK_EVENTS } from '../constants';
import { createClient, isSupabaseConfigured } from '../lib/supabase/client';
import IndexedDBService from '../src/services/indexedDBService';

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

export class DatabaseService {
  private isSupabaseAvailable(): boolean {
    return isSupabaseConfigured() && !!createClient();
  }

  // Storage local robusto com IndexedDB
  private async saveToLocal(key: string, data: Record<string, unknown>): Promise<void> {
    try {
      console.log(`Iniciando salvamento local de ${key}...`);
      await IndexedDBService.save(key, data);
      console.log(`Dados salvos localmente: ${key} (${data.id})`);
    } catch (error) {
      console.error("Erro ao salvar localmente:", error);
      throw error;
    }
  }

  private async getFromLocal(key: string): Promise<unknown[]> {
    try {
      const data = await IndexedDBService.getAll(key);
      console.log(`Dados carregados localmente: ${key} (${data.length} itens)`);
      return data;
    } catch (error) {
      console.warn("Erro ao carregar dados locais:", error);
      return [];
    }
  }

  // Unidades
  async getUnits(): Promise<Unit[]> {
    if (!this.isSupabaseAvailable()) {
      console.info("ADJPA ERP: Usando modo de demonstracao (Unidades)");
      return MOCK_UNITS;
    }

    const supabase = createClient()!;
    
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(unit => toCamelCase<Unit>(unit));
      } else {
        console.warn("ADJPA ERP: Supabase configurado mas tabela units vazia. Usando dados MOCK.");
        return MOCK_UNITS;
      }
    } catch (error) {
      console.warn("Erro ao carregar unidades, usando dados de demonstracao:", error);
      return MOCK_UNITS;
    }
  }

  // Membros
  async getMembers(unitId?: string): Promise<Member[]> {
    console.info("Buscando membros...");

    // SEMPRE tentar carregar do IndexedDB primeiro
    try {
      const localMembers = await this.getFromLocal('members') as Member[];
      console.log(`Encontrados ${localMembers.length} membros no IndexedDB`);

      if (localMembers.length > 0) {
        if (unitId) {
          const filtered = localMembers.filter(m => m.unitId === unitId);
          console.log(`${filtered.length} membros para unidade ${unitId}`);
          return filtered;
        }
        return localMembers;
      }
    } catch (error) {
      console.warn("Erro ao carregar do IndexedDB:", error);
    }

    // Se nao ha dados locais, tenta Supabase
    if (this.isSupabaseAvailable()) {
      const supabase = createClient()!;
      
      try {
        console.log("Tentando carregar do Supabase...");
        let query = supabase.from('members').select('*');
        
        if (unitId) {
          query = query.eq('unit_id', unitId);
        }

        const { data, error } = await query.order('name');

        if (error) throw error;

        const members = (data || []).map(member => toCamelCase<Member>(member));
        console.log(`Carregados ${members.length} membros do Supabase`);

        if (members.length > 0) {
          // Salvar localmente para cache
          for (const member of members) {
            await this.saveToLocal('members', member as unknown as Record<string, unknown>);
          }
          return members;
        } else {
          console.log("Supabase vazio, usando dados mock");
          return MOCK_MEMBERS.filter(m => !unitId || m.unitId === unitId);
        }
      } catch (error) {
        console.warn("Erro ao carregar do Supabase:", error);
      }
    }

    // Ultimo recurso: dados mock
    console.warn("Usando dados mock - nenhum dado encontrado");
    return MOCK_MEMBERS.filter(m => !unitId || m.unitId === unitId);
  }

  async saveMember(member: Partial<Member>): Promise<string> {
    const memberId = member.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const memberData = { ...member, id: memberId };

    console.log("Iniciando salvamento de membro...");

    if (!this.isSupabaseAvailable()) {
      console.info("Usando IndexedDB para salvar membro");
      try {
        await this.saveToLocal('members', memberData as unknown as Record<string, unknown>);
        console.log("Membro salvo localmente com ID:", memberId);
        return memberId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error("Erro critico ao salvar membro:", error);
        throw new Error("Falha ao salvar membro: " + errorMessage);
      }
    }

    const supabase = createClient()!;

    try {
      const snakeCaseData = toSnakeCase(memberData as unknown as Record<string, unknown>);
      
      if (member.id && !member.id.startsWith('local_')) {
        // Atualizar existente
        const { error } = await supabase
          .from('members')
          .update(snakeCaseData)
          .eq('id', member.id);

        if (error) throw error;
        console.log("Membro atualizado no Supabase com ID:", member.id);
        await this.saveToLocal('members', memberData as unknown as Record<string, unknown>);
        return member.id;
      } else {
        // Criar novo
        const { id, ...dataToInsert } = snakeCaseData;
        const { data, error } = await supabase
          .from('members')
          .insert(dataToInsert)
          .select()
          .single();

        if (error) throw error;
        
        const newId = data.id;
        console.log("Membro criado no Supabase com ID:", newId);
        await this.saveToLocal('members', { ...memberData, id: newId } as unknown as Record<string, unknown>);
        return newId;
      }
    } catch (error) {
      console.error("Erro ao salvar membro no Supabase, salvando localmente:", error);
      await this.saveToLocal('members', memberData as unknown as Record<string, unknown>);
      return memberId;
    }
  }

  async deleteMember(id: string): Promise<void> {
    console.log("Iniciando delecao de membro com ID:", id);
    try {
      if (this.isSupabaseAvailable() && !id.startsWith('local_')) {
        const supabase = createClient()!;
        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) throw error;
        console.log("Membro deletado do Supabase com ID:", id);
      }
      await IndexedDBService.delete('members', id);
      console.log("Membro deletado do IndexedDB com ID:", id);
    } catch (error) {
      console.error("Erro ao deletar membro:", error);
      throw error;
    }
  }

  // Funcionarios
  async saveEmployee(employee: Partial<Payroll>): Promise<string> {
    const employeeId = employee.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const employeeData = { ...employee, id: employeeId };

    console.log("Iniciando salvamento de funcionario...");

    if (!this.isSupabaseAvailable()) {
      console.info("Usando IndexedDB para salvar funcionario");
      try {
        await this.saveToLocal('employees', employeeData as unknown as Record<string, unknown>);
        console.log("Funcionario salvo localmente com ID:", employeeId);
        return employeeId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error("Erro critico ao salvar funcionario:", error);
        throw new Error("Falha ao salvar funcionario: " + errorMessage);
      }
    }

    const supabase = createClient()!;

    try {
      const snakeCaseData = toSnakeCase(employeeData as unknown as Record<string, unknown>);

      if (employee.id && !employee.id.startsWith('local_')) {
        const { error } = await supabase
          .from('employees')
          .update(snakeCaseData)
          .eq('id', employee.id);

        if (error) throw error;
        console.log("Funcionario atualizado no Supabase com ID:", employee.id);
        await this.saveToLocal('employees', employeeData as unknown as Record<string, unknown>);
        return employee.id;
      } else {
        const { id, ...dataToInsert } = snakeCaseData;
        const { data, error } = await supabase
          .from('employees')
          .insert(dataToInsert)
          .select()
          .single();

        if (error) throw error;
        
        const newId = data.id;
        console.log("Funcionario criado no Supabase com ID:", newId);
        await this.saveToLocal('employees', { ...employeeData, id: newId } as unknown as Record<string, unknown>);
        return newId;
      }
    } catch (error) {
      console.error("Erro ao salvar funcionario no Supabase, salvando localmente:", error);
      await this.saveToLocal('employees', employeeData as unknown as Record<string, unknown>);
      return employeeId;
    }
  }

  async getEmployees(unitId?: string): Promise<Payroll[]> {
    console.info("Buscando funcionarios...");

    try {
      const localEmployees = await this.getFromLocal('employees') as Payroll[];
      console.log(`Encontrados ${localEmployees.length} funcionarios no IndexedDB`);

      if (localEmployees.length > 0) {
        if (unitId) {
          const filtered = localEmployees.filter(e => e.unitId === unitId);
          console.log(`${filtered.length} funcionarios para unidade ${unitId}`);
          return filtered;
        }
        return localEmployees;
      }
    } catch (error) {
      console.warn("Erro ao carregar funcionarios do IndexedDB:", error);
    }

    if (this.isSupabaseAvailable()) {
      const supabase = createClient()!;
      
      try {
        let query = supabase.from('employees').select('*');
        
        if (unitId) {
          query = query.eq('unit_id', unitId);
        }

        const { data, error } = await query.order('employee_name');

        if (error) throw error;

        const employees = (data || []).map(emp => toCamelCase<Payroll>(emp));
        console.log(`Encontrados ${employees.length} funcionarios no Supabase`);

        if (employees.length > 0) {
          for (const employee of employees) {
            await this.saveToLocal('employees', employee as unknown as Record<string, unknown>);
          }
          return employees;
        } else {
          console.log("Supabase vazio, nenhum dado para retornar");
          return [];
        }
      } catch (error) {
        console.warn("Erro ao carregar do Supabase:", error);
      }
    }

    console.warn("Usando dados mock - nenhum funcionario encontrado");
    return [];
  }

  async deleteEmployee(id: string): Promise<void> {
    console.log("Iniciando delecao de funcionario com ID:", id);
    try {
      if (this.isSupabaseAvailable() && !id.startsWith('local_')) {
        const supabase = createClient()!;
        const { error } = await supabase.from('employees').delete().eq('id', id);
        if (error) throw error;
        console.log("Funcionario deletado do Supabase com ID:", id);
      }
      await IndexedDBService.delete('employees', id);
      console.log("Funcionario deletado do IndexedDB com ID:", id);
    } catch (error) {
      console.error("Erro ao deletar funcionario:", error);
      throw error;
    }
  }

  // Financeiro - Transacoes
  async getTransactions(unitId?: string): Promise<Transaction[]> {
    console.info("Buscando transacoes...");

    try {
      const localTransactions = await this.getFromLocal('transactions') as Transaction[];
      console.log(`Encontradas ${localTransactions.length} transacoes no IndexedDB`);

      if (localTransactions.length > 0) {
        if (unitId) {
          const filtered = localTransactions.filter(t => t.unitId === unitId);
          console.log(`${filtered.length} transacoes para unidade ${unitId}`);
          return filtered;
        }
        return localTransactions;
      }
    } catch (error) {
      console.warn("Erro ao carregar transacoes do IndexedDB:", error);
    }

    if (this.isSupabaseAvailable()) {
      const supabase = createClient()!;
      
      try {
        console.log("Tentando carregar transacoes do Supabase...");
        let query = supabase.from('transactions').select('*');
        
        if (unitId) {
          query = query.eq('unit_id', unitId);
        }

        const { data, error } = await query.order('date', { ascending: false });

        if (error) throw error;

        const transactions = (data || []).map(t => toCamelCase<Transaction>(t));
        console.log(`Carregadas ${transactions.length} transacoes do Supabase`);

        for (const transaction of transactions) {
          await this.saveToLocal('transactions', transaction as unknown as Record<string, unknown>);
        }

        return transactions;
      } catch (error) {
        console.warn("Erro ao carregar transacoes do Supabase:", error);
      }
    }

    return MOCK_TRANSACTIONS.filter(t => !unitId || t.unitId === unitId);
  }

  async saveTransaction(transaction: Partial<Transaction>): Promise<string> {
    const transactionId = transaction.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transactionData = { ...transaction, id: transactionId };

    console.log("Iniciando salvamento de transacao...");

    if (!this.isSupabaseAvailable()) {
      console.info("Usando IndexedDB para salvar transacao");
      try {
        await this.saveToLocal('transactions', transactionData as unknown as Record<string, unknown>);
        console.log("Transacao salva localmente com ID:", transactionId);
        return transactionId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error("Erro critico ao salvar transacao:", error);
        throw new Error("Falha ao salvar transacao: " + errorMessage);
      }
    }

    const supabase = createClient()!;

    try {
      const snakeCaseData = toSnakeCase(transactionData as unknown as Record<string, unknown>);

      if (transaction.id && !transaction.id.startsWith('local_')) {
        const { error } = await supabase
          .from('transactions')
          .update(snakeCaseData)
          .eq('id', transaction.id);

        if (error) throw error;
        console.log("Transacao atualizada no Supabase com ID:", transaction.id);
        await this.saveToLocal('transactions', transactionData as unknown as Record<string, unknown>);
        return transaction.id;
      } else {
        const { id, ...dataToInsert } = snakeCaseData;
        const { data, error } = await supabase
          .from('transactions')
          .insert(dataToInsert)
          .select()
          .single();

        if (error) throw error;
        
        const newId = data.id;
        console.log("Transacao criada no Supabase com ID:", newId);
        await this.saveToLocal('transactions', { ...transactionData, id: newId } as unknown as Record<string, unknown>);
        return newId;
      }
    } catch (error) {
      console.error("Erro ao salvar transacao no Supabase, salvando localmente:", error);
      await this.saveToLocal('transactions', transactionData as unknown as Record<string, unknown>);
      return transactionId;
    }
  }

  // Contas Bancarias
  async getAccounts(unitId?: string): Promise<FinancialAccount[]> {
    console.info("Buscando contas...");

    try {
      const localAccounts = await this.getFromLocal('accounts') as FinancialAccount[];
      console.log(`Encontradas ${localAccounts.length} contas no IndexedDB`);

      if (localAccounts.length > 0) {
        if (unitId) {
          const filtered = localAccounts.filter(a => a.unitId === unitId);
          console.log(`${filtered.length} contas para unidade ${unitId}`);
          return filtered;
        }
        return localAccounts;
      }
    } catch (error) {
      console.warn("Erro ao carregar contas do IndexedDB:", error);
    }

    if (this.isSupabaseAvailable()) {
      const supabase = createClient()!;
      
      try {
        console.log("Tentando carregar contas do Supabase...");
        let query = supabase.from('accounts').select('*');
        
        if (unitId) {
          query = query.eq('unit_id', unitId);
        }

        const { data, error } = await query.order('name');

        if (error) throw error;

        const accounts = (data || []).map(a => toCamelCase<FinancialAccount>(a));
        console.log(`Carregadas ${accounts.length} contas do Supabase`);

        for (const account of accounts) {
          await this.saveToLocal('accounts', account as unknown as Record<string, unknown>);
        }

        return accounts;
      } catch (error) {
        console.warn("Erro ao carregar contas do Supabase:", error);
      }
    }

    console.warn("Usando dados mock - nenhuma conta encontrada");
    return MOCK_ACCOUNTS.filter(a => !unitId || a.unitId === unitId);
  }

  async saveAccount(account: Partial<FinancialAccount>): Promise<string> {
    const accountId = account.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const accountData = { ...account, id: accountId };

    console.log("Iniciando salvamento de conta bancaria...");

    if (!this.isSupabaseAvailable()) {
      console.info("Usando IndexedDB para salvar conta");
      try {
        await this.saveToLocal('accounts', accountData as unknown as Record<string, unknown>);
        console.log("Conta salva localmente com ID:", accountId);
        return accountId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error("Erro critico ao salvar conta:", error);
        throw new Error("Falha ao salvar conta: " + errorMessage);
      }
    }

    const supabase = createClient()!;

    try {
      const snakeCaseData = toSnakeCase(accountData as unknown as Record<string, unknown>);

      if (account.id && !account.id.startsWith('local_')) {
        const { error } = await supabase
          .from('accounts')
          .update(snakeCaseData)
          .eq('id', account.id);

        if (error) throw error;
        console.log("Conta atualizada no Supabase com ID:", account.id);
        await this.saveToLocal('accounts', accountData as unknown as Record<string, unknown>);
        return account.id;
      } else {
        const { id, ...dataToInsert } = snakeCaseData;
        const { data, error } = await supabase
          .from('accounts')
          .insert(dataToInsert)
          .select()
          .single();

        if (error) throw error;
        
        const newId = data.id;
        console.log("Conta criada no Supabase com ID:", newId);
        await this.saveToLocal('accounts', { ...accountData, id: newId } as unknown as Record<string, unknown>);
        return newId;
      }
    } catch (error) {
      console.error("Erro ao salvar conta no Supabase, salvando localmente:", error);
      await this.saveToLocal('accounts', accountData as unknown as Record<string, unknown>);
      return accountId;
    }
  }

  // Ativos/Patrimonio
  async getAssets(unitId: string): Promise<Asset[]> {
    console.log("Buscando ativos...");

    try {
      const assets = await this.getFromLocal('assets') as Asset[];
      if (assets.length > 0) {
        const unitAssets = assets.filter(a => a.unitId === unitId);
        console.log(`Encontrados ${unitAssets.length} ativos no IndexedDB`);
        return unitAssets;
      }
    } catch (error) {
      console.error("Erro ao buscar ativos no IndexedDB:", error);
    }

    if (this.isSupabaseAvailable()) {
      const supabase = createClient()!;
      
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('unit_id', unitId)
          .order('name');

        if (error) throw error;

        const assets = (data || []).map(a => toCamelCase<Asset>(a));
        console.log(`Encontrados ${assets.length} ativos no Supabase`);
        return assets;
      } catch (error) {
        console.error("Erro ao buscar ativos no Supabase:", error);
        return [];
      }
    }

    return [];
  }

  async saveAsset(asset: Partial<Asset>): Promise<string> {
    const assetId = asset.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const assetData = { ...asset, id: assetId };

    console.log("Iniciando salvamento de ativo...");

    if (!this.isSupabaseAvailable()) {
      console.info("Usando IndexedDB para salvar ativo");
      try {
        await this.saveToLocal('assets', assetData as unknown as Record<string, unknown>);
        console.log("Ativo salvo localmente com ID:", assetId);
        return assetId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error("Erro critico ao salvar ativo:", error);
        throw new Error("Falha ao salvar ativo: " + errorMessage);
      }
    }

    const supabase = createClient()!;

    try {
      const snakeCaseData = toSnakeCase(assetData as unknown as Record<string, unknown>);

      if (asset.id && !asset.id.startsWith('local_')) {
        const { error } = await supabase
          .from('assets')
          .update(snakeCaseData)
          .eq('id', asset.id);

        if (error) throw error;
        console.log("Ativo atualizado no Supabase com ID:", asset.id);
        await this.saveToLocal('assets', assetData as unknown as Record<string, unknown>);
        return asset.id;
      } else {
        const { id, ...dataToInsert } = snakeCaseData;
        const { data, error } = await supabase
          .from('assets')
          .insert(dataToInsert)
          .select()
          .single();

        if (error) throw error;
        
        const newId = data.id;
        console.log("Ativo criado no Supabase com ID:", newId);
        await this.saveToLocal('assets', { ...assetData, id: newId } as unknown as Record<string, unknown>);
        return newId;
      }
    } catch (error) {
      console.error("Erro ao salvar ativo no Supabase, salvando localmente:", error);
      await this.saveToLocal('assets', assetData as unknown as Record<string, unknown>);
      return assetId;
    }
  }

  // Folha de Pagamento
  async savePayroll(payroll: Partial<Payroll>): Promise<string> {
    const payrollId = payroll.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const payrollData = { ...payroll, id: payrollId };

    console.log("Iniciando salvamento da folha de pagamento...");

    if (!this.isSupabaseAvailable()) {
      console.info("Usando IndexedDB para salvar folha");
      try {
        await this.saveToLocal('payroll', payrollData as unknown as Record<string, unknown>);
        console.log("Folha salva localmente com ID:", payrollId);
        return payrollId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error("Erro critico ao salvar folha:", error);
        throw new Error("Falha ao salvar folha: " + errorMessage);
      }
    }

    const supabase = createClient()!;

    try {
      const snakeCaseData = toSnakeCase(payrollData as unknown as Record<string, unknown>);

      if (payroll.id && !payroll.id.startsWith('local_')) {
        const { error } = await supabase
          .from('payroll')
          .update(snakeCaseData)
          .eq('id', payroll.id);

        if (error) throw error;
        console.log("Folha atualizada no Supabase com ID:", payroll.id);
        await this.saveToLocal('payroll', payrollData as unknown as Record<string, unknown>);
        return payroll.id;
      } else {
        const { id, ...dataToInsert } = snakeCaseData;
        const { data, error } = await supabase
          .from('payroll')
          .insert(dataToInsert)
          .select()
          .single();

        if (error) throw error;
        
        const newId = data.id;
        console.log("Folha criada no Supabase com ID:", newId);
        await this.saveToLocal('payroll', { ...payrollData, id: newId } as unknown as Record<string, unknown>);
        return newId;
      }
    } catch (error) {
      console.error("Erro ao salvar folha no Supabase, salvando localmente:", error);
      await this.saveToLocal('payroll', payrollData as unknown as Record<string, unknown>);
      return payrollId;
    }
  }

  // Ferias/Afastamentos
  async getLeaves(unitId?: string): Promise<EmployeeLeave[]> {
    console.info("Buscando afastamentos...");

    try {
      const localLeaves = await this.getFromLocal('leaves') as EmployeeLeave[];
      console.log(`Encontrados ${localLeaves.length} afastamentos no IndexedDB`);

      if (localLeaves.length > 0) {
        if (unitId) {
          return localLeaves.filter(l => l.unitId === unitId);
        }
        return localLeaves;
      }
    } catch (error) {
      console.warn("Erro ao carregar afastamentos do IndexedDB:", error);
    }

    if (this.isSupabaseAvailable()) {
      const supabase = createClient()!;
      
      try {
        let query = supabase.from('leaves').select('*');
        
        if (unitId) {
          query = query.eq('unit_id', unitId);
        }

        const { data, error } = await query.order('start_date', { ascending: false });

        if (error) throw error;

        const leaves = (data || []).map(l => toCamelCase<EmployeeLeave>(l));
        console.log(`Carregados ${leaves.length} afastamentos do Supabase`);

        for (const leave of leaves) {
          await this.saveToLocal('leaves', leave as unknown as Record<string, unknown>);
        }

        return leaves;
      } catch (error) {
        console.warn("Erro ao carregar afastamentos do Supabase:", error);
      }
    }

    return [];
  }

  async saveLeave(leave: Partial<EmployeeLeave>): Promise<string> {
    const leaveId = leave.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const leaveData = { ...leave, id: leaveId };

    console.log("Iniciando salvamento de ferias/afastamento...");

    if (!this.isSupabaseAvailable()) {
      console.info("Usando IndexedDB para salvar ferias");
      try {
        await this.saveToLocal('leaves', leaveData as unknown as Record<string, unknown>);
        console.log("Ferias salvas localmente com ID:", leaveId);
        return leaveId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error("Erro critico ao salvar ferias:", error);
        throw new Error("Falha ao salvar ferias: " + errorMessage);
      }
    }

    const supabase = createClient()!;

    try {
      const snakeCaseData = toSnakeCase(leaveData as unknown as Record<string, unknown>);

      if (leave.id && !leave.id.startsWith('local_')) {
        const { error } = await supabase
          .from('leaves')
          .update(snakeCaseData)
          .eq('id', leave.id);

        if (error) throw error;
        console.log("Ferias atualizadas no Supabase com ID:", leave.id);
        await this.saveToLocal('leaves', leaveData as unknown as Record<string, unknown>);
        return leave.id;
      } else {
        const { id, ...dataToInsert } = snakeCaseData;
        const { data, error } = await supabase
          .from('leaves')
          .insert(dataToInsert)
          .select()
          .single();

        if (error) throw error;
        
        const newId = data.id;
        console.log("Ferias criadas no Supabase com ID:", newId);
        await this.saveToLocal('leaves', { ...leaveData, id: newId } as unknown as Record<string, unknown>);
        return newId;
      }
    } catch (error) {
      console.error("Erro ao salvar ferias no Supabase, salvando localmente:", error);
      await this.saveToLocal('leaves', leaveData as unknown as Record<string, unknown>);
      return leaveId;
    }
  }

  async deleteLeave(id: string): Promise<void> {
    console.info("Iniciando exclusao de afastamento:", id);

    try {
      await IndexedDBService.delete('leaves', id);
      console.log("Afastamento excluido localmente:", id);
    } catch (error) {
      console.error("Erro ao excluir afastamento localmente:", error);
    }

    if (this.isSupabaseAvailable() && !id.startsWith('local_')) {
      const supabase = createClient()!;
      
      try {
        const { error } = await supabase.from('leaves').delete().eq('id', id);
        if (error) throw error;
        console.log("Afastamento excluido do Supabase:", id);
      } catch (error) {
        console.error("Erro ao excluir afastamento do Supabase:", error);
      }
    }
  }

  // Eventos
  async getEvents(unitId?: string): Promise<ChurchEvent[]> {
    if (!this.isSupabaseAvailable()) {
      return MOCK_EVENTS;
    }

    const supabase = createClient()!;
    
    try {
      let query = supabase.from('events').select('*');
      
      if (unitId) {
        query = query.eq('unit_id', unitId);
      }

      const { data, error } = await query.order('start_date', { ascending: false });

      if (error) throw error;

      return (data || []).map(e => toCamelCase<ChurchEvent>(e));
    } catch (error) {
      console.warn("Erro ao carregar eventos:", error);
      return MOCK_EVENTS;
    }
  }

  async saveEvent(event: Omit<ChurchEvent, 'id'> & { id?: string }): Promise<string> {
    if (!this.isSupabaseAvailable()) {
      const id = event.id || Math.random().toString(36).substr(2, 9);
      const newEvent = { ...event, id } as ChurchEvent;
      const index = MOCK_EVENTS.findIndex(e => e.id === id);
      if (index >= 0) {
        MOCK_EVENTS[index] = newEvent;
      } else {
        MOCK_EVENTS.push(newEvent);
      }
      return id;
    }

    const supabase = createClient()!;

    try {
      const snakeCaseData = toSnakeCase(event as unknown as Record<string, unknown>);

      if (event.id) {
        const { id, ...data } = snakeCaseData;
        const { error } = await supabase
          .from('events')
          .update(data)
          .eq('id', event.id);

        if (error) throw error;
        return event.id;
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert(snakeCaseData)
          .select()
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    if (!this.isSupabaseAvailable()) {
      const index = MOCK_EVENTS.findIndex(e => e.id === id);
      if (index >= 0) MOCK_EVENTS.splice(index, 1);
      return;
    }

    const supabase = createClient()!;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      throw error;
    }
  }
}

export const dbService = new DatabaseService();
