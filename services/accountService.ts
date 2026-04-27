/**
 * ============================================================================
 * ACCOUNTSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para account service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import apiClient from '../src/services/apiService';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (account service).
 */

export interface FinancialAccountEnhanced {
  id: string;
  unitId: string;
  name: string;
  type: string;
  accountType?: string;
  currentBalance: number;
  minimumBalance?: number | null;
  status: string;
  isActive?: boolean;
  isDefault?: boolean;
  bankCode?: string;
  bankName?: string;
  agencyNumber?: string;
  accountNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Alias para compatibilidade com ContasBancarias.tsx
export const AccountService = {};

export const accountService = {
  getAccounts: async (unitId?: string): Promise<FinancialAccountEnhanced[]> => {
    try {
      const data = await apiClient.get<any[]>('/accounts', unitId ? { unitId } : {});
      return (data || []).map((a: any) => ({
        ...a,
        accountType: a.type,
        isActive: a.status === 'ACTIVE',
        isDefault: false,
        bankName: a.bankCode || '',
      }));
    } catch (e) {
      console.error('❌ accountService.getAccounts:', e);
      return [];
    }
  },

  createAccount: async (account: any) => {
    return apiClient.post('/accounts', account);
  },

  updateAccount: async (id: string, account: any) => {
    return apiClient.put(`/accounts/${id}`, account);
  },

  saveAccount: async (account: any) => {
    if (account.id) {
      return apiClient.put(`/accounts/${account.id}`, account);
    }
    return apiClient.post('/accounts', account);
  },

  deleteAccount: async (id: string) => {
    return apiClient.delete(`/accounts/${id}`);
  },

  /**
   * Saldo consolidado calculado a partir das contas
   */
  getConsolidatedBalance: async (unitId?: string) => {
    try {
      const accounts = await accountService.getAccounts(unitId);
      const total = accounts.reduce((s, a) => s + (a.currentBalance || 0), 0);
      const cash  = accounts.filter(a => a.type === 'CASH').reduce((s, a) => s + (a.currentBalance || 0), 0);
      const bank  = accounts.filter(a => a.type !== 'CASH').reduce((s, a) => s + (a.currentBalance || 0), 0);
      return { total, cash, bank, byAccount: accounts };
    } catch (e) {
      console.error('❌ accountService.getConsolidatedBalance:', e);
      return { total: 0, cash: 0, bank: 0, byAccount: [] };
    }
  },

  /**
   * Extrato de uma conta — busca transações filtradas por accountId
   */
  getAccountStatement: async (accountId: string) => {
    try {
      const data = await apiClient.get<any[]>('/transactions', { accountId });
      return data || [];
    } catch (e) {
      console.error('❌ accountService.getAccountStatement:', e);
      return [];
    }
  },

  /**
   * Transferência entre contas — debita origem e credita destino
   */
  transferBetweenAccounts: async (fromId: string, toId: string, amount: number, description: string) => {
    try {
      const [from, to] = await Promise.all([
        apiClient.get<any>(`/accounts/${fromId}`),
        apiClient.get<any>(`/accounts/${toId}`),
      ]);
      if (!from || !to) throw new Error('Conta não encontrada');
      if ((from.currentBalance || 0) < amount) throw new Error('Saldo insuficiente na conta de origem');

      await Promise.all([
        apiClient.put(`/accounts/${fromId}`, { ...from, currentBalance: (from.currentBalance || 0) - amount }),
        apiClient.put(`/accounts/${toId}`,   { ...to,   currentBalance: (to.currentBalance   || 0) + amount }),
      ]);
    } catch (e) {
      console.error('❌ accountService.transferBetweenAccounts:', e);
      throw e;
    }
  },

  /**
   * Registra um depósito em uma conta — atualiza o saldo via PUT
   */
  registerDeposit: async (accountId: string, amount: number, _description: string) => {
    try {
      const account = await apiClient.get<any>(`/accounts/${accountId}`);
      if (!account) return;
      await apiClient.put(`/accounts/${accountId}`, {
        ...account,
        currentBalance: (account.currentBalance || 0) + amount,
      });
    } catch (e) {
      console.error('❌ accountService.registerDeposit:', e);
    }
  },

  /**
   * Registra um débito em uma conta — atualiza o saldo via PUT
   */
  registerWithdrawal: async (accountId: string, amount: number, _description: string) => {
    try {
      const account = await apiClient.get<any>(`/accounts/${accountId}`);
      if (!account) return;
      await apiClient.put(`/accounts/${accountId}`, {
        ...account,
        currentBalance: (account.currentBalance || 0) - amount,
      });
    } catch (e) {
      console.error('❌ accountService.registerWithdrawal:', e);
    }
  },
};

export const FinancialAccountEnhanced = accountService;
