
import { Member, Payroll, Transaction, FinancialAccount, Unit, Asset, EmployeeLeave } from '../types';
import { MOCK_UNITS, MOCK_MEMBERS, MOCK_TRANSACTIONS, MOCK_ACCOUNTS } from '../constants';
import { db } from '../src/services/firebaseService';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import IndexedDBService from '../src/services/indexedDBService';

export class DatabaseService {
  private isFirebaseConfigured(): boolean {
    // Verificar se o db do Firestore está inicializado
    return !!db;
  }

  // Helper para timeout em chamadas do Firebase
  private async withTimeout<T>(promise: Promise<T>, ms: number = 5000): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout de ${ms}ms excedido na operação do Firebase`));
      }, ms);
      
      promise
        .then(value => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch(reason => {
          clearTimeout(timer);
          reject(reason);
        });
    });
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
      const querySnapshot = await this.withTimeout(getDocs(q), 5000);
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
      
      if (localMembers.length > 0) {
        if (unitId) {
          const filtered = localMembers.filter(m => m.unitId === unitId);
          console.log(`📊 ${filtered.length} membros para unidade ${unitId}`);
          return filtered;
        }
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
        const querySnapshot = await this.withTimeout(getDocs(q), 8000);
        const firebaseMembers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        console.log(`🔥 Carregados ${firebaseMembers.length} membros do Firebase`);
        
        if (firebaseMembers.length > 0) {
          // Salvar localmente para cache
          for (const member of firebaseMembers) {
            await this.saveToLocal('members', member);
          }
          return firebaseMembers;
        } else {
          console.log("⚠️ Firebase vazio, usando dados mock");
          return MOCK_MEMBERS.filter(m => !unitId || m.unitId === unitId);
        }
      } catch (error) {
        console.warn("❌ Erro ao carregar do Firebase:", error);
      }
    }
    
    // Último recurso: dados mock
    console.warn("⚠️ Usando dados mock - nenhum dado encontrado");
    return MOCK_MEMBERS.filter(m => !unitId || m.unitId === unitId);
  }

  async saveMember(member: Partial<Member>): Promise<string> {
    const memberData = { ...member, id: member.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    
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
    
    // Firebase fallback
    try {
      if (member.id && !member.id.startsWith('local_')) {
        const docRef = doc(db, 'members', member.id);
        await this.withTimeout(setDoc(docRef, memberData, { merge: true }), 8000);
        console.log("✅ Membro salvo no Firebase com ID:", member.id);
        await this.saveToLocal('members', memberData);
        return member.id;
      } else {
        // Remove the local ID before saving to Firebase so it generates a new one
        const { id, ...dataToSave } = memberData;
        const docRef = await this.withTimeout(addDoc(collection(db, 'members'), dataToSave), 8000);
        console.log("✅ Membro salvo no Firebase com ID:", docRef.id);
        await this.saveToLocal('members', { ...dataToSave, id: docRef.id });
        return docRef.id;
      }
    } catch (error) {
      console.error("Erro ao salvar membro no Firebase, salvando localmente:", error);
      await this.saveToLocal('members', memberData);
      return memberData.id;
    }
  }

  async deleteMember(id: string): Promise<void> {
    console.log("🚀 Iniciando deleção de membro com ID:", id);
    try {
      if (this.isFirebaseConfigured()) {
        await this.withTimeout(deleteDoc(doc(db, 'members', id)), 8000);
        console.log("✅ Membro deletado do Firebase com ID:", id);
      }
      await IndexedDBService.delete('members', id);
      console.log("✅ Membro deletado do IndexedDB com ID:", id);
    } catch (error) {
      console.error("❌ Erro ao deletar membro:", error);
      throw error;
    }
  }

  // Funcionários
  async saveEmployee(employee: Partial<Payroll>): Promise<string> {
    const employeeData = { ...employee, id: employee.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    
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
    
    // Firebase fallback
    try {
      if (employee.id && !employee.id.startsWith('local_')) {
        const docRef = doc(db, 'employees', employee.id);
        await this.withTimeout(setDoc(docRef, employeeData, { merge: true }), 8000);
        console.log("✅ Funcionário salvo no Firebase com ID:", employee.id);
        await this.saveToLocal('employees', employeeData);
        return employee.id;
      } else {
        // Remove the local ID before saving to Firebase so it generates a new one
        const { id, ...dataToSave } = employeeData;
        const docRef = await this.withTimeout(addDoc(collection(db, 'employees'), dataToSave), 8000);
        console.log("✅ Funcionário salvo no Firebase com ID:", docRef.id);
        await this.saveToLocal('employees', { ...dataToSave, id: docRef.id });
        return docRef.id;
      }
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
      
      if (localEmployees.length > 0) {
        if (unitId) {
          const filtered = localEmployees.filter(e => e.unitId === unitId);
          console.log(`📊 ${filtered.length} funcionários para unidade ${unitId}`);
          return filtered;
        }
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
        const querySnapshot = await this.withTimeout(getDocs(q), 8000);
        const firebaseEmployees = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payroll[];
        
        console.log(`📊 Encontrados ${firebaseEmployees.length} funcionários no Firebase`);
        
        if (firebaseEmployees.length > 0) {
          for (const employee of firebaseEmployees) {
            await this.saveToLocal('employees', employee);
          }
          return firebaseEmployees;
        } else {
          console.log("⚠️ Firebase vazio, nenhum dado para retornar");
          return [];
        }
      } catch (error) {
        console.warn("❌ Erro ao carregar do Firebase:", error);
      }
    }
    
    // Último recurso: dados mock
    console.warn("⚠️ Usando dados mock - nenhum funcionário encontrado");
    return [];
  }

  // Financeiro
  async getTransactions(unitId?: string): Promise<Transaction[]> {
    console.info("🔍 Buscando transações...");
    
    // SEMPRE tentar carregar do IndexedDB primeiro
    try {
      const localTransactions = await this.getFromLocal('transactions');
      console.log(`📊 Encontradas ${localTransactions.length} transações no IndexedDB`);
      
      if (localTransactions.length > 0) {
        if (unitId) {
          const filtered = localTransactions.filter(t => t.unitId === unitId);
          console.log(`📊 ${filtered.length} transações para unidade ${unitId}`);
          return filtered;
        }
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
        const querySnapshot = await this.withTimeout(getDocs(q), 8000);
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

  async deleteEmployee(id: string): Promise<void> {
    console.log("🚀 Iniciando deleção de funcionário com ID:", id);
    try {
      if (this.isFirebaseConfigured()) {
        await this.withTimeout(deleteDoc(doc(db, 'employees', id)), 8000);
        console.log("✅ Funcionário deletado do Firebase com ID:", id);
      }
      await IndexedDBService.delete('employees', id);
      console.log("✅ Funcionário deletado do IndexedDB com ID:", id);
    } catch (error) {
      console.error("❌ Erro ao deletar funcionário:", error);
      throw error;
    }
  }

  async saveTransaction(transaction: Partial<Transaction>): Promise<string> {
    const transactionData = { ...transaction, id: transaction.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    
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
      if (transaction.id && !transaction.id.startsWith('local_')) {
        const docRef = doc(db, 'transactions', transaction.id);
        await this.withTimeout(setDoc(docRef, transactionData, { merge: true }), 8000);
        console.log("✅ Transação salva no Firebase com ID:", transaction.id);
        await this.saveToLocal('transactions', transactionData);
        return transaction.id;
      } else {
        // Remove the local ID before saving to Firebase so it generates a new one
        const { id, ...dataToSave } = transactionData;
        const docRef = await this.withTimeout(addDoc(collection(db, 'transactions'), dataToSave), 8000);
        console.log("✅ Transação salva no Firebase com ID:", docRef.id);
        await this.saveToLocal('transactions', { ...dataToSave, id: docRef.id });
        return docRef.id;
      }
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
      
      if (localAccounts.length > 0) {
        if (unitId) {
          const filtered = localAccounts.filter(a => a.unitId === unitId);
          console.log(`📊 ${filtered.length} contas para unidade ${unitId}`);
          return filtered;
        }
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
        const querySnapshot = await this.withTimeout(getDocs(q), 8000);
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
    const accountData = { ...account, id: account.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    
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
      if (account.id && !account.id.startsWith('local_')) {
        const docRef = doc(db, 'accounts', account.id);
        await this.withTimeout(setDoc(docRef, accountData, { merge: true }), 8000);
        console.log("✅ Conta salva no Firebase com ID:", account.id);
        await this.saveToLocal('accounts', accountData);
        return account.id;
      } else {
        // Remove the local ID before saving to Firebase so it generates a new one
        const { id, ...dataToSave } = accountData;
        const docRef = await this.withTimeout(addDoc(collection(db, 'accounts'), dataToSave), 8000);
        console.log("✅ Conta salva no Firebase com ID:", docRef.id);
        await this.saveToLocal('accounts', { ...dataToSave, id: docRef.id });
        return docRef.id;
      }
    } catch (error) {
      console.error("Erro ao salvar conta no Firebase, salvando localmente:", error);
      await this.saveToLocal('accounts', accountData);
      return accountData.id;
    }
  }

  // Ativos/Patrimônio
  async saveAsset(asset: Partial<Asset>): Promise<string> {
    const assetData = { ...asset, id: asset.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    
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
      if (asset.id && !asset.id.startsWith('local_')) {
        const docRef = doc(db, 'assets', asset.id);
        await this.withTimeout(setDoc(docRef, assetData, { merge: true }), 8000);
        console.log("✅ Ativo salvo no Firebase com ID:", asset.id);
        await this.saveToLocal('assets', assetData);
        return asset.id;
      } else {
        // Remove the local ID before saving to Firebase so it generates a new one
        const { id, ...dataToSave } = assetData;
        const docRef = await this.withTimeout(addDoc(collection(db, 'assets'), dataToSave), 8000);
        console.log("✅ Ativo salvo no Firebase com ID:", docRef.id);
        await this.saveToLocal('assets', { ...dataToSave, id: docRef.id });
        return docRef.id;
      }
    } catch (error) {
      console.error("Erro ao salvar ativo no Firebase, salvando localmente:", error);
      await this.saveToLocal('assets', assetData);
      return assetData.id;
    }
  }

  // Folha de Pagamento
  async savePayroll(payroll: Partial<Payroll>): Promise<string> {
    const payrollData = { ...payroll, id: payroll.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    
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
      if (payroll.id && !payroll.id.startsWith('local_')) {
        const docRef = doc(db, 'payroll', payroll.id);
        await this.withTimeout(setDoc(docRef, payrollData, { merge: true }), 8000);
        console.log("✅ Folha salva no Firebase com ID:", payroll.id);
        await this.saveToLocal('payroll', payrollData);
        return payroll.id;
      } else {
        // Remove the local ID before saving to Firebase so it generates a new one
        const { id, ...dataToSave } = payrollData;
        const docRef = await this.withTimeout(addDoc(collection(db, 'payroll'), dataToSave), 8000);
        console.log("✅ Folha salva no Firebase com ID:", docRef.id);
        await this.saveToLocal('payroll', { ...dataToSave, id: docRef.id });
        return docRef.id;
      }
    } catch (error) {
      console.error("Erro ao salvar folha no Firebase, salvando localmente:", error);
      await this.saveToLocal('payroll', payrollData);
      return payrollData.id;
    }
  }

  // Férias/Afastamentos
  async getLeaves(unitId?: string): Promise<EmployeeLeave[]> {
    console.info("🔍 Buscando afastamentos...");
    
    try {
      const localLeaves = await this.getFromLocal('leaves');
      console.log(`📊 Encontrados ${localLeaves.length} afastamentos no IndexedDB`);
      
      if (localLeaves.length > 0) {
        if (unitId) {
          return localLeaves.filter(l => l.unitId === unitId);
        }
        return localLeaves;
      }
    } catch (error) {
      console.warn("❌ Erro ao carregar afastamentos do IndexedDB:", error);
    }
    
    if (this.isFirebaseConfigured()) {
      try {
        let q = query(collection(db, 'leaves'));
        if (unitId) {
          q = query(collection(db, 'leaves'), where('unitId', '==', unitId));
        }
        const querySnapshot = await this.withTimeout(getDocs(q), 8000);
        const firebaseLeaves = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmployeeLeave));
        console.log(`🔥 Carregados ${firebaseLeaves.length} afastamentos do Firebase`);
        
        for (const leave of firebaseLeaves) {
          await this.saveToLocal('leaves', leave);
        }
        return firebaseLeaves;
      } catch (error) {
        console.warn("❌ Erro ao carregar afastamentos do Firebase:", error);
      }
    }
    
    return [];
  }

  async saveLeave(leave: Partial<EmployeeLeave>): Promise<string> {
    const leaveData = { ...leave, id: leave.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    
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
      if (leave.id && !leave.id.startsWith('local_')) {
        const docRef = doc(db, 'leaves', leave.id);
        await this.withTimeout(setDoc(docRef, leaveData, { merge: true }), 8000);
        console.log("✅ Férias salvas no Firebase com ID:", leave.id);
        await this.saveToLocal('leaves', leaveData);
        return leave.id;
      } else {
        // Remove the local ID before saving to Firebase so it generates a new one
        const { id, ...dataToSave } = leaveData;
        const docRef = await this.withTimeout(addDoc(collection(db, 'leaves'), dataToSave), 8000);
        console.log("✅ Férias salvas no Firebase com ID:", docRef.id);
        await this.saveToLocal('leaves', { ...dataToSave, id: docRef.id });
        return docRef.id;
      }
    } catch (error) {
      console.error("Erro ao salvar férias no Firebase, salvando localmente:", error);
      await this.saveToLocal('leaves', leaveData);
      return leaveData.id;
    }
  }

  async deleteLeave(id: string): Promise<void> {
    console.info("🗑️ Iniciando exclusão de afastamento:", id);
    
    // Deletar localmente
    try {
      await IndexedDBService.delete('leaves', id);
      console.log("✅ Afastamento excluído localmente:", id);
    } catch (error) {
      console.error("❌ Erro ao excluir afastamento localmente:", error);
    }
    
    // Deletar no Firebase
    if (this.isFirebaseConfigured() && !id.startsWith('local_')) {
      try {
        const docRef = doc(db, 'leaves', id);
        await this.withTimeout(deleteDoc(docRef), 8000);
        console.log("✅ Afastamento excluído do Firebase:", id);
      } catch (error) {
        console.error("❌ Erro ao excluir afastamento do Firebase:", error);
      }
    }
  }

  // Assets
  async getAssets(unitId: string): Promise<Asset[]> {
    console.log("🔍 Buscando ativos...");
    
    try {
      // IndexedDB primeiro
      const assets = await this.getFromLocal('assets');
      if (assets.length > 0) {
        const unitAssets = assets.filter(a => a.unitId === unitId);
        console.log(`📊 Encontrados ${unitAssets.length} ativos no IndexedDB`);
        return unitAssets;
      }
    } catch (error) {
      console.error("Erro ao buscar ativos no IndexedDB:", error);
    }
    
    // Firebase fallback
    try {
      const q = query(collection(db, 'assets'), where('unitId', '==', unitId));
      const querySnapshot = await this.withTimeout(getDocs(q), 8000);
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
