/**
 * SERVICE DE TESOURARIA
 * Gerencia fechamento de caixa, conciliação de cartões e arquivos CNAB
 */

import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc,
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { 
  CashClosing, 
  CashMovement, 
  CardReconciliation, 
  InstallmentSale,
  CNABFile,
  TreasuryConsolidated,
  FinancialAccount,
  Transaction
} from '../types';
import { parseCNAB, generateCNABRemessa } from '../utils/cnabParser';
import {
  calculateCardReconciliation,
  analyzeBankSpread,
  validateCNABTotals,
} from '../utils/calculosTesouraria';

export const treasuryService = {
  db: getFirestore(),

  /**
   * FECHAMENTO DE CAIXA DIÁRIO
   */
  
  async createCashClosing(
    unitId: string,
    accountId: string,
    date: string,
    actualBalance: number,
    observations?: string
  ): Promise<CashClosing> {
    // Busca transações do dia
    const transactionsRef = collection(this.db, 'financial/transactions');
    const q = query(
      transactionsRef,
      where('unitId', '==', unitId),
      where('accountId', '==', accountId),
      where('date', '==', date)
    );
    
    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    
    // Calcula totais
    const openingBalance = 0; // Implementar lógica de saldo inicial
    const totalInflows = transactions
      .filter((t: Transaction) => t.type === 'INCOME')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    const totalOutflows = transactions
      .filter((t: Transaction) => t.type === 'EXPENSE')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    
    // Saldo esperado
    const expectedBalance = openingBalance + totalInflows - totalOutflows;
    
    // Diferença (quebra de caixa)
    const difference = actualBalance - expectedBalance;
    
    // Determina status
    const status = Math.abs(difference) < 1 ? 'CLOSED' : 'RECONCILING';
    
    const closing: CashClosing = {
      id: crypto.randomUUID(),
      unitId,
      accountId,
      date,
      openingBalance,
      totalInflows,
      totalOutflows,
      expectedBalance,
      actualBalance,
      difference,
      status,
      observations,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = doc(this.db, 'treasury/cash-closings', closing.id);
    await setDoc(docRef, closing);
    
    return closing;
  },
  
  async getClosingByPeriod(
    unitId: string,
    startDate: string,
    endDate: string
  ): Promise<CashClosing[]> {
    const q = query(
      collection(this.db, 'treasury/cash-closings'),
      where('unitId', '==', unitId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CashClosing));
  },
  
  async approveClosing(closingId: string, userId: string): Promise<void> {
    const docRef = doc(this.db, 'treasury/cash-closings', closingId);
    await updateDoc(docRef, {
      status: 'CLOSED',
      closedBy: userId,
      closedAt: new Date().toISOString(),
    });
  },

  /**
   * MOVIMENTOS DE CAIXA (SANGRIA/SUPRIMENTO)
   */
  
  async registerWithdrawal(data: Omit<CashMovement, 'id' | 'createdAt' | 'type'>): Promise<CashMovement> {
    const movement: CashMovement = {
      ...data,
      type: 'WITHDRAWAL',
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const docRef = doc(this.db, 'treasury/cash-movements', movement.id);
    await setDoc(docRef, movement);
    
    return movement;
  },
  
  async registerSupply(data: Omit<CashMovement, 'id' | 'createdAt' | 'type'>): Promise<CashMovement> {
    const movement: CashMovement = {
      ...data,
      type: 'SUPPLY',
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const docRef = doc(this.db, 'treasury/cash-movements', movement.id);
    await setDoc(docRef, movement);
    
    return movement;
  },
  
  async getCashMovements(unitId: string, startDate: string, endDate: string): Promise<CashMovement[]> {
    const q = query(
      collection(this.db, 'treasury/cash-movements'),
      where('unitId', '==', unitId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CashMovement));
  },

  /**
   * CONCILIAÇÃO DE CARTÕES
   */
  
  async createCardReconciliation(
    unitId: string,
    cardOperator: CardReconciliation['cardOperator'],
    statementMonth: number,
    statementYear: number,
    invoiceTotal: number,
    sales: Array<{
      date: string;
      amount: number;
      installments: number;
      cardNumber: string;
    }>,
    feeRate: number
  ): Promise<CardReconciliation> {
    // Calcula resumo da conciliação
    const installmentsData = sales.map(sale => ({
      count: sale.installments,
      value: sale.amount,
    }));
    
    const summary = calculateCardReconciliation(invoiceTotal, feeRate, installmentsData);
    
    // Gera parcelas individuais simplificadas
    const installmentSales: InstallmentSale[] = [];
    let currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      installmentSales.push({
        id: crypto.randomUUID(),
        reconciliationId: '', // Será preenchido após criação
        transactionDate: currentDate.toISOString().split('T')[0],
        cardNumber: '****0000',
        totalAmount: invoiceTotal / 12,
        installmentNumber: i + 1,
        totalInstallments: 12,
        installmentValue: invoiceTotal / 12,
        feeRate: feeRate,
        feeValue: (invoiceTotal / 12) * feeRate,
        netValue: (invoiceTotal / 12) * (1 - feeRate),
        expectedDate: currentDate.toISOString().split('T')[0],
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    const reconciliation: CardReconciliation = {
      id: crypto.randomUUID(),
      unitId,
      cardOperator,
      statementMonth,
      statementYear,
      invoiceTotal,
      totalSales: summary.totalSales,
      totalFees: summary.totalFees,
      netValue: summary.netValue,
      installmentsSales: installmentSales,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    
    await setDoc(doc(this.db, `treasury/card-reconciliations/${reconciliation.id}`), reconciliation);
    
    return reconciliation;
  },
  
  async approveCardReconciliation(reconciliationId: string): Promise<void> {
    const docRef = doc(this.db, 'treasury/card-reconciliations', reconciliationId);
    await updateDoc(docRef, {
      status: 'RECONCILED',
    });
  },

  /**
   * ARQUIVOS CNAB
   */
  
  async processCNABReturn(
    unitId: string,
    accountId: string,
    content: string,
    bankCode: string
  ): Promise<CNABFile> {
    // Valida e parseia o arquivo
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const recordsCount = lines.length;
    
    const cnabFile: CNABFile = {
      id: crypto.randomUUID(),
      unitId,
      accountId,
      bank: bankCode,
      fileType: 'RETORNO',
      layout: lines[0] && lines[0].length > 200 ? '400' : '240',
      filename: `cnab_retorno_${bankCode}_${new Date().getTime()}.txt`,
      recordsCount,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };
    
    await setDoc(doc(this.db, `treasury/cnab-files/${cnabFile.id}`), cnabFile);
    
    // Processa registros (implementação simplificada)
    try {
      await setDoc(doc(this.db, `treasury/cnab-files/${cnabFile.id}`), {
        status: 'PROCESSED',
        processedAt: new Date().toISOString(),
      });
    } catch (error) {
      await setDoc(doc(this.db, `treasury/cnab-files/${cnabFile.id}`), {
        status: 'ERROR',
        errorMessage: (error as Error).message,
      });
      throw error;
    }
    
    return cnabFile;
  },
  
  async generateCNABRemessa(
    unitId: string,
    accountId: string,
    bankCode: string,
    transactions: Array<{
      documentNumber: string;
      ourNumber: string;
      amount: number;
      dueDate: string;
      beneficiaryName: string;
      beneficiaryDocument: string;
    }>
  ): Promise<string> {
    // Gera conteúdo CNAB
    const content = generateCNABRemessa(transactions, bankCode, unitId);
    
    const cnabFile: CNABFile = {
      id: crypto.randomUUID(),
      unitId,
      accountId,
      bank: bankCode,
      fileType: 'REMessa',
      layout: '240',
      filename: `cnab_remessa_${bankCode}_${new Date().getTime()}.txt`,
      recordsCount: transactions.length,
      status: 'UPLOADED',
      createdAt: new Date().toISOString(),
    };
    
    await setDoc(doc(this.db, `treasury/cnab-files/${cnabFile.id}`), cnabFile);
    
    return content;
  },
  
  async getCNABFiles(unitId: string, status?: string): Promise<CNABFile[]> {
    let q;
    if (status) {
      q = query(
        collection(this.db, 'treasury/cnab-files'),
        where('unitId', '==', unitId),
        where('status', '==', status)
      );
    } else {
      q = query(
        collection(this.db, 'treasury/cnab-files'),
        where('unitId', '==', unitId)
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as CNABFile));
  },

  /**
   * RELATÓRIOS E CONSOLIDADOS
   */
  
  async generateConsolidatedStatement(
    unitId: string,
    startDate: string,
    endDate: string
  ): Promise<TreasuryConsolidated> {
    // Busca fechamentos de caixa
    const closings = await this.getClosingByPeriod(unitId, startDate, endDate);
    
    // Calcula totais
    const totalInflows = closings.reduce((sum, c) => sum + c.totalInflows, 0);
    const totalOutflows = closings.reduce((sum, c) => sum + c.totalOutflows, 0);
    
    return {
      unitId,
      period: {
        start: startDate,
        end: endDate,
      },
      accounts: [],
      paymentMethods: [],
      cardOperators: [],
      grandTotal: {
        openingBalance: closings[0]?.openingBalance || 0,
        closingBalance: closings[closings.length - 1]?.actualBalance || 0,
        inflows: totalInflows,
        outflows: totalOutflows,
        variance: 0,
      },
    };
  },
};

// Exportar o serviço para uso no componente
export const tesourariaService = treasuryService;
