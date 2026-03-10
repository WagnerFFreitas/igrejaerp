
import { Member, Payroll, Transaction, FinancialAccount, Unit, Asset, EmployeeLeave } from '../types';
import { MOCK_UNITS, MOCK_MEMBERS, MOCK_TRANSACTIONS, MOCK_ACCOUNTS } from '../constants';
import { db } from '../src/services/firebaseService';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import IndexedDBService from '../src/services/indexedDBService';

export class DatabaseService {
  private isFirebaseConfigured(): boolean {
    // Sempre retornar false para forçar uso do IndexedDB
    // Firebase só será usado se estiver realmente configurado e funcionando
    return false;
  }

  // Storage local robusto com IndexedDB
  private async saveToLocal(key: string, data: any): Promise<void> {
    try {
      console.log(`🔄 Iniciando salvamento local de ${key}...`);
      console.log(`📋 Dados a salvar:`, { id: data.id, name: data.name || 'N/A' });
      
      await IndexedDBService.save(key, data);
      
      console.log(`✅ Dados salvos localmente: ${key} (${data.id})`);
      
      // Verificar se foi salvo corretamente
      const verifyData = await IndexedDBService.getAll(key);
      const savedItem = verifyData.find(item => item.id === data.id);
      
      if (savedItem) {
        console.log(`🔍 Verificação OK: ${key} com ID ${data.id} encontrado`);
      } else {
        console.error(`❌ Verificação FALHOU: ${key} com ID ${data.id} NÃO encontrado`);
      }
      
    } catch (error) {
      console.error("❌ Erro ao salvar localmente:", error);
      throw error;
    }
  }

  private async getFromLocal(key: string): Promise<any[]> {
    try {
      const data = await IndexedDBService.getAll(key);
      console.log(`📂 Dados carregados localmente: ${key} (${data.length} itens)`);
      return data;
    } catch (error) {
      console.warn("Erro ao carregar dados locais:", error);
      return [];
    }
  }

  // Unidades
  async getUnits(): Promise<Unit[]> {
    if (!this.isFirebaseConfigured()) {
      console.info("ADJPA ERP: Usando modo de demonstração (Unidades)");
      return MOCK_UNITS;
    }
    try {
      const q = query(collection(db, 'units'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
    } catch (error) {
      console.warn("Erro ao carregar unidades, usando dados de demonstração:", error);
      return MOCK_UNITS;
    }
  }

  // Membros
  async getMembers(unitId?: string): Promise<Member[]> {
    console.info("🔍 Buscando membros...");
    
    // SEMPRE tentar carregar do IndexedDB primeiro
    try {
      const localMembers = await this.getFromLocal('members');
      console.log(`📊 Encontrados ${localMembers.length} membros no IndexedDB`);
      
      if (unitId) {
        const filtered = localMembers.filter(m => m.unitId === unitId);
        console.log(`📊 ${filtered.length} membros para unidade ${unitId}`);
        return filtered;
      }
      
      // Se há dados locais, retorna eles
      if (localMembers.length > 0) {
        return localMembers;
      }
    } catch (error) {
      console.warn("❌ Erro ao carregar do IndexedDB:", error);
    }
    
    // Se não há dados locais, tenta Firebase
    if (this.isFirebaseConfigured()) {
      try {
        console.log("🔥 Tentando carregar do Firebase...");
        let q = query(collection(db, 'members'));
        if (unitId) {
          q = query(collection(db, 'members'), where('unitId', '==', unitId));
        }
        const querySnapshot = await getDocs(q);
        const firebaseMembers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        console.log(`🔥 Carregados ${firebaseMembers.length} membros do Firebase`);
        
        // Salvar localmente para cache
        for (const member of firebaseMembers) {
          await this.saveToLocal('members', member);
        }
        
        return firebaseMembers;
      } catch (error) {
        console.warn("❌ Erro ao carregar do Firebase:", error);
      }
    }
    
    // Último recurso: dados mock
    console.warn("⚠️ Usando dados mock - nenhum dado encontrado");
    return MOCK_MEMBERS.filter(m => !unitId || m.unitId === unitId);
  }

  async saveMember(member: Partial<Member>): Promise<string> {
    const memberData = { ...member, id: member.id || `local_${Date.now()}` };
    
    console.log("🚀 Iniciando salvamento de membro...");
    console.log("📋 Dados completos:", memberData);
    
    if (!this.isFirebaseConfigured()) {
      console.info("💾 Usando IndexedDB para salvar membro");
      try {
        await this.saveToLocal('members', memberData);
        console.log("✅ Membro salvo localmente com ID:", memberData.id);
        return memberData.id;
      } catch (error) {
        console.error("❌ Erro crítico ao salvar membro:", error);
        throw new Error("Falha ao salvar membro: " + error.message);
      }
    }
    
    // Firebase fallback (não usado no momento)
    try {
      const docRef = await addDoc(collection(db, 'members', memberData));
      console.log("✅ Membro salvo no Firebase com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar membro no Firebase, salvando localmente:", error);
      await this.saveToLocal('members', memberData);
      return memberData.id;
    }
  }

  // Funcionários
  async saveEmployee(employee: Partial<Payroll>): Promise<string> {
    const employeeData = { ...employee, id: employee.id || `local_${Date.now()}` };
    
    console.log("🚀 Iniciando salvamento de funcionário...");
    console.log("📋 Dados completos:", employeeData);
    
    if (!this.isFirebaseConfigured()) {
      console.info("💾 Usando IndexedDB para salvar funcionário");
      try {
        await this.saveToLocal('employees', employeeData);
        console.log("✅ Funcionário salvo localmente com ID:", employeeData.id);
        return employeeData.id;
      } catch (error) {
        console.error("❌ Erro crítico ao salvar funcionário:", error);
        throw new Error("Falha ao salvar funcionário: " + error.message);
      }
    }
    
    // Firebase fallback (não usado no momento)
    try {
      const docRef = await addDoc(collection(db, 'employees', employeeData));
      console.log("✅ Funcionário salvo no Firebase com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar funcionário no Firebase, salvando localmente:", error);
      await this.saveToLocal('employees', employeeData);
      return employeeData.id;
    }
  }

  async getEmployees(unitId?: string): Promise<Payroll[]> {
    console.info("🔍 Buscando funcionários...");
    
    // SEMPRE tentar carregar do IndexedDB primeiro
    try {
      const localEmployees = await this.getFromLocal('employees');
      console.log(`📊 Encontrados ${localEmployees.length} funcionários no IndexedDB`);
      
      if (unitId) {
        const filtered = localEmployees.filter(e => e.unitId === unitId);
        console.log(`📊 ${filtered.length} funcionários para unidade ${unitId}`);
        return filtered;
      }
      
      if (localEmployees.length > 0) {
        return localEmployees;
      }
    } catch (error) {
      console.warn("❌ Erro ao carregar funcionários do IndexedDB:", error);
    }
    
    // Tentar Firebase se disponível
    if (this.isFirebaseConfigured()) {
      try {
        const q = unitId 
          ? query(collection(db, 'employees'), where('unitId', '==', unitId))
          : query(collection(db, 'employees'));
        const querySnapshot = await getDocs(q);
        const firebaseEmployees = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payroll[];
        
        console.log(`📊 Encontrados ${firebaseEmployees.length} funcionários no Firebase`);
        return firebaseEmployees;
      } catch (error) {
        console.warn("❌ Erro ao carregar do Firebase:", error);
      }
    }
    
    // Último recurso: dados mock
    console.warn("⚠️ Usando dados mock - nenhum funcionário encontrado");
    return MOCK_PAYROLL.filter(e => !unitId || e.unitId === unitId);
  }

  // Financeiro
  async getTransactions(unitId?: string): Promise<Transaction[]> {
    console.info("🔍 Buscando transações...");
    
    // SEMPRE tentar carregar do IndexedDB primeiro
    try {
      const localTransactions = await this.getFromLocal('transactions');
      console.log(`📊 Encontradas ${localTransactions.length} transações no IndexedDB`);
      
      if (unitId) {
        const filtered = localTransactions.filter(t => t.unitId === unitId);
        console.log(`📊 ${filtered.length} transações para unidade ${unitId}`);
        return filtered;
      }
      
      if (localTransactions.length > 0) {
        return localTransactions;
      }
    } catch (error) {
      console.warn("❌ Erro ao carregar transações do IndexedDB:", error);
    }
    
    // Se não há dados locais, tenta Firebase
    if (this.isFirebaseConfigured()) {
      try {
        console.log("🔥 Tentando carregar transações do Firebase...");
        let q = query(collection(db, 'transactions'));
        if (unitId) {
          q = query(collection(db, 'transactions'), where('unitId', '==', unitId));
        }
        const querySnapshot = await getDocs(q);
        const firebaseTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        console.log(`🔥 Carregadas ${firebaseTransactions.length} transações do Firebase`);
        
        // Salvar localmente para cache
        for (const transaction of firebaseTransactions) {
          await this.saveToLocal('transactions', transaction);
        }
        
        return firebaseTransactions;
      } catch (error) {
        console.warn("❌ Erro ao carregar transações do Firebase:", error);
      }
    }
    
    return MOCK_TRANSACTIONS.filter(t => !unitId || t.unitId === unitId);
  }

  async saveTransaction(transaction: Partial<Transaction>): Promise<string> {
    const transactionData = { ...transaction, id: transaction.id || `local_${Date.now()}` };
    
    console.log("🚀 Iniciando salvamento de transação...");
    console.log("📋 Dados completos:", transactionData);
    
    if (!this.isFirebaseConfigured()) {
      console.info("💾 Usando IndexedDB para salvar transação");
      try {
        await this.saveToLocal('transactions', transactionData);
        console.log("✅ Transação salva localmente com ID:", transactionData.id);
        return transactionData.id;
      } catch (error) {
        console.error("❌ Erro crítico ao salvar transação:", error);
        throw new Error("Falha ao salvar transação: " + error.message);
      }
    }
    
    // Firebase fallback
    try {
      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      console.log("✅ Transação salva no Firebase com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar transação no Firebase, salvando localmente:", error);
      await this.saveToLocal('transactions', transactionData);
      return transactionData.id;
    }
  }

  // Contas
  async getAccounts(unitId?: string): Promise<FinancialAccount[]> {
    console.info("🔍 Buscando contas...");
    
    // SEMPRE tentar carregar do IndexedDB primeiro
    try {
      const localAccounts = await this.getFromLocal('accounts');
      console.log(`📊 Encontradas ${localAccounts.length} contas no IndexedDB`);
      
      if (unitId) {
        const filtered = localAccounts.filter(a => a.unitId === unitId);
        console.log(`📊 ${filtered.length} contas para unidade ${unitId}`);
        return filtered;
      }
      
      if (localAccounts.length > 0) {
        return localAccounts;
      }
    } catch (error) {
      console.warn("❌ Erro ao carregar contas do IndexedDB:", error);
    }
    
    // Se não há dados locais, tenta Firebase
    if (this.isFirebaseConfigured()) {
      try {
        console.log("🔥 Tentando carregar contas do Firebase...");
        let q = query(collection(db, 'accounts'));
        if (unitId) {
          q = query(collection(db, 'accounts'), where('unitId', '==', unitId));
        }
        const querySnapshot = await getDocs(q);
        const firebaseAccounts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FinancialAccount));
        console.log(`🔥 Carregadas ${firebaseAccounts.length} contas do Firebase`);
        
        // Salvar localmente para cache
        for (const account of firebaseAccounts) {
          await this.saveToLocal('accounts', account);
        }
        
        return firebaseAccounts;
      } catch (error) {
        console.warn("❌ Erro ao carregar contas do Firebase:", error);
      }
    }
    
    // Último recurso: dados mock
    console.warn("⚠️ Usando dados mock - nenhuma conta encontrada");
    return MOCK_ACCOUNTS.filter(a => !unitId || a.unitId === unitId);
  }

  // Contas Bancárias
  async saveAccount(account: Partial<FinancialAccount>): Promise<string> {
    const accountData = { ...account, id: account.id || `local_${Date.now()}` };
    
    console.log("🚀 Iniciando salvamento de conta bancária...");
    console.log("📋 Dados completos:", accountData);
    
    if (!this.isFirebaseConfigured()) {
      console.info("💾 Usando IndexedDB para salvar conta");
      try {
        await this.saveToLocal('accounts', accountData);
        console.log("✅ Conta salva localmente com ID:", accountData.id);
        return accountData.id;
      } catch (error) {
        console.error("❌ Erro crítico ao salvar conta:", error);
        throw new Error("Falha ao salvar conta: " + error.message);
      }
    }
    
    // Firebase fallback
    try {
      const docRef = await addDoc(collection(db, 'accounts'), accountData);
      console.log("✅ Conta salva no Firebase com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar conta no Firebase, salvando localmente:", error);
      await this.saveToLocal('accounts', accountData);
      return accountData.id;
    }
  }

  // Ativos/Patrimônio
  async saveAsset(asset: Partial<Asset>): Promise<string> {
    const assetData = { ...asset, id: asset.id || `local_${Date.now()}` };
    
    console.log("🚀 Iniciando salvamento de ativo...");
    console.log("📋 Dados completos:", assetData);
    
    if (!this.isFirebaseConfigured()) {
      console.info("💾 Usando IndexedDB para salvar ativo");
      try {
        await this.saveToLocal('assets', assetData);
        console.log("✅ Ativo salvo localmente com ID:", assetData.id);
        return assetData.id;
      } catch (error) {
        console.error("❌ Erro crítico ao salvar ativo:", error);
        throw new Error("Falha ao salvar ativo: " + error.message);
      }
    }
    
    // Firebase fallback
    try {
      const docRef = await addDoc(collection(db, 'assets'), assetData);
      console.log("✅ Ativo salvo no Firebase com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar ativo no Firebase, salvando localmente:", error);
      await this.saveToLocal('assets', assetData);
      return assetData.id;
    }
  }

  // Folha de Pagamento
  async savePayroll(payroll: Partial<Payroll>): Promise<string> {
    const payrollData = { ...payroll, id: payroll.id || `local_${Date.now()}` };
    
    console.log("🚀 Iniciando salvamento da folha de pagamento...");
    console.log("📋 Dados completos:", payrollData);
    
    if (!this.isFirebaseConfigured()) {
      console.info("💾 Usando IndexedDB para salvar folha");
      try {
        await this.saveToLocal('payroll', payrollData);
        console.log("✅ Folha salva localmente com ID:", payrollData.id);
        return payrollData.id;
      } catch (error) {
        console.error("❌ Erro crítico ao salvar folha:", error);
        throw new Error("Falha ao salvar folha: " + error.message);
      }
    }
    
    // Firebase fallback
    try {
      const docRef = await addDoc(collection(db, 'payroll'), payrollData);
      console.log("✅ Folha salva no Firebase com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar folha no Firebase, salvando localmente:", error);
      await this.saveToLocal('payroll', payrollData);
      return payrollData.id;
    }
  }

  // Férias/Afastamentos
  async saveLeave(leave: Partial<EmployeeLeave>): Promise<string> {
    const leaveData = { ...leave, id: leave.id || `local_${Date.now()}` };
    
    console.log("🚀 Iniciando salvamento de férias/afastamento...");
    console.log("📋 Dados completos:", leaveData);
    
    if (!this.isFirebaseConfigured()) {
      console.info("💾 Usando IndexedDB para salvar férias");
      try {
        await this.saveToLocal('leaves', leaveData);
        console.log("✅ Férias salvas localmente com ID:", leaveData.id);
        return leaveData.id;
      } catch (error) {
        console.error("❌ Erro crítico ao salvar férias:", error);
        throw new Error("Falha ao salvar férias: " + error.message);
      }
    }
    
    // Firebase fallback
    try {
      const docRef = await addDoc(collection(db, 'leaves'), leaveData);
      console.log("✅ Férias salvas no Firebase com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar férias no Firebase, salvando localmente:", error);
      await this.saveToLocal('leaves', leaveData);
      return leaveData.id;
    }
  }

  // Assets
  async getAssets(unitId: string): Promise<Asset[]> {
    console.log("🔍 Buscando ativos...");
    
    try {
      // IndexedDB primeiro
      const assets = await this.getFromLocal<Asset>('assets');
      const unitAssets = assets.filter(a => a.unitId === unitId);
      console.log(`📊 Encontrados ${unitAssets.length} ativos no IndexedDB`);
      return unitAssets;
    } catch (error) {
      console.error("Erro ao buscar ativos no IndexedDB:", error);
    }
    
    // Firebase fallback
    try {
      const q = query(collection(db, 'assets'), where('unitId', '==', unitId));
      const querySnapshot = await getDocs(q);
      const assets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
      console.log(`📊 Encontrados ${assets.length} ativos no Firebase`);
      return assets;
    } catch (error) {
      console.error("Erro ao buscar ativos no Firebase:", error);
      return [];
    }
  }
}

export const dbService = new DatabaseService();
