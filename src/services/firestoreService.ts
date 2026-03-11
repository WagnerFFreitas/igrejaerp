import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseService';

export class FirestoreService {
  // CRUD Genérico
  static async create(collectionName: string, data: any, unitId?: string): Promise<string> {
    try {
      const collectionRef = unitId 
        ? collection(db, 'units', unitId, collectionName)
        : collection(db, collectionName);
      
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Erro ao criar documento: ${error.message}`);
    }
  }

  static async update(collectionName: string, docId: string, data: any, unitId?: string): Promise<void> {
    try {
      const docRef = unitId
        ? doc(db, 'units', unitId, collectionName, docId)
        : doc(db, collectionName, docId);
      
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(`Erro ao atualizar documento: ${error.message}`);
    }
  }

  static async delete(collectionName: string, docId: string, unitId?: string): Promise<void> {
    try {
      const docRef = unitId
        ? doc(db, 'units', unitId, collectionName, docId)
        : doc(db, collectionName, docId);
      
      await deleteDoc(docRef);
    } catch (error: any) {
      throw new Error(`Erro ao deletar documento: ${error.message}`);
    }
  }

  static async get(collectionName: string, docId: string, unitId?: string): Promise<any> {
    try {
      const docRef = unitId
        ? doc(db, 'units', unitId, collectionName, docId)
        : doc(db, collectionName, docId);
      
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Documento não encontrado');
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } catch (error: any) {
      throw new Error(`Erro ao buscar documento: ${error.message}`);
    }
  }

  static async list(
    collectionName: string, 
    unitId?: string, 
    filters?: any[],
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number,
    lastDoc?: any
  ): Promise<any[]> {
    try {
      const collectionRef = unitId
        ? collection(db, 'units', unitId, collectionName)
        : collection(db, collectionName);

      let q = query(collectionRef);

      // Aplicar filtros
      if (filters) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }

      // Aplicar ordenação
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection || 'asc'));
      }

      // Aplicar limite
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      // Paginação
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error: any) {
      throw new Error(`Erro ao listar documentos: ${error.message}`);
    }
  }

  // Métodos específicos para o ADJPA ERP
  static async getUnitEmployees(unitId: string): Promise<any[]> {
    return this.list('employees', unitId, [
      { field: 'isActive', operator: '==', value: true }
    ], 'employeeName', 'asc');
  }

  static async getUnitMembers(unitId: string): Promise<any[]> {
    return this.list('members', unitId, [
      { field: 'isActive', operator: '==', value: true }
    ], 'name', 'asc');
  }

  static async getUnitTransactions(unitId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    const filters: any[] = [];
    
    if (startDate && endDate) {
      filters.push({ field: 'date', operator: '>=', value: Timestamp.fromDate(startDate) });
      filters.push({ field: 'date', operator: '<=', value: Timestamp.fromDate(endDate) });
    }

    return this.list('transactions', unitId, filters, 'date', 'desc');
  }

  static async getUnitPayables(unitId: string): Promise<any[]> {
    return this.list('payables', unitId, [], 'dueDate', 'asc');
  }

  static async getUnitReceivables(unitId: string): Promise<any[]> {
    return this.list('receivables', unitId, [], 'dueDate', 'asc');
  }

  static async getUnitAssets(unitId: string): Promise<any[]> {
    return this.list('assets', unitId, [], 'name', 'asc');
  }

  // Buscar por CPF
  static async getEmployeeByCPF(unitId: string, cpf: string): Promise<any | null> {
    try {
      const employees = await this.list('employees', unitId, [
        { field: 'cpf', operator: '==', value: cpf }
      ]);
      
      return employees.length > 0 ? employees[0] : null;
    } catch (error) {
      return null;
    }
  }

  // Buscar por matrícula
  static async getEmployeeByRegistration(unitId: string, registration: string): Promise<any | null> {
    try {
      const employees = await this.list('employees', unitId, [
        { field: 'matricula', operator: '==', value: registration }
      ]);
      
      return employees.length > 0 ? employees[0] : null;
    } catch (error) {
      return null;
    }
  }

  // Relatórios
  static async getFinancialSummary(unitId: string, startDate: Date, endDate: Date): Promise<any> {
    const transactions = await this.getUnitTransactions(unitId, startDate, endDate);
    
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
