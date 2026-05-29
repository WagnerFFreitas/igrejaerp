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
import { ContaBancaria, Transacao } from '../types';

export const accountService = {
  getAccounts: async (id_unidade?: string): Promise<ContaBancaria[]> => {
    try {
      if (!id_unidade || id_unidade === 'undefined') {
        console.warn('⚠️ accountService.getAccounts: id_unidade inválido');
        return [];
      }
      const data = await apiClient.get<any[]>('/accounts', { id_unidade });
      return (data || []).map((a: any) => ({
        ...a,
        id_conta: a.id_conta || a.id,
        id_unidade: a.id_unidade || a.unitId,
        nome: a.nome || a.name,
        tipo: a.tipo || a.type,
        saldo_atual: a.saldo_atual || a.currentBalance || 0,
        situacao: a.situacao || a.status || 'ATIVO',
      }));
    } catch (e: any) {
      console.error('❌ accountService.getAccounts:', e);
      return [];
    }
  },

  saveAccount: async (account: Partial<ContaBancaria>) => {
    if (account.id_conta) {
      return apiClient.put(`/accounts/${account.id_conta}`, account);
    }
    return apiClient.post('/accounts', account);
  },

  deleteAccount: async (id: string) => {
    return apiClient.delete(`/accounts/${id}`);
  },

  getConsolidatedBalance: async (id_unidade?: string) => {
    try {
      const accounts = await accountService.getAccounts(id_unidade);
      const total = accounts.reduce((s, a) => s + (a.saldo_atual || 0), 0);
      const cash  = accounts.filter(a => a.tipo === 'CASH').reduce((s, a) => s + (a.saldo_atual || 0), 0);
      const bank  = accounts.filter(a => a.tipo !== 'CASH').reduce((s, a) => s + (a.saldo_atual || 0), 0);
      return { total, cash, bank, byAccount: accounts };
    } catch (e) {
      console.error('❌ accountService.getConsolidatedBalance:', e);
      return { total: 0, cash: 0, bank: 0, byAccount: [] };
    }
  },

  getAccountStatement: async (id_conta: string): Promise<Transacao[]> => {
    try {
      const data = await apiClient.get<any[]>('/transactions', { id_conta });
      return data || [];
    } catch (e) {
      console.error('❌ accountService.getAccountStatement:', e);
      return [];
    }
  },

  transferBetweenAccounts: async (fromId: string, toId: string, amount: number, description: string) => {
    try {
      const [from, to] = await Promise.all([
        apiClient.get<any>(`/accounts/${fromId}`),
        apiClient.get<any>(`/accounts/${toId}`),
      ]);
      if (!from || !to) throw new Error('Conta não encontrada');
      
      const fromBalance = from.saldo_atual || from.currentBalance || 0;
      const toBalance = to.saldo_atual || to.currentBalance || 0;

      if (fromBalance < amount) throw new Error('Saldo insuficiente na conta de origem');

      await Promise.all([
        apiClient.put(`/accounts/${fromId}`, { ...from, saldo_atual: fromBalance - amount }),
        apiClient.put(`/accounts/${toId}`,   { ...to,   saldo_atual: toBalance + amount }),
      ]);
    } catch (e) {
      console.error('❌ accountService.transferBetweenAccounts:', e);
      throw e;
    }
  },

  registerDeposit: async (id_conta: string, amount: number) => {
    try {
      const account = await apiClient.get<any>(`/accounts/${id_conta}`);
      if (!account) return;
      const currentBalance = account.saldo_atual || account.currentBalance || 0;
      await apiClient.put(`/accounts/${id_conta}`, {
        ...account,
        saldo_atual: currentBalance + amount,
      });
    } catch (e) {
      console.error('❌ accountService.registerDeposit:', e);
    }
  },

  registerWithdrawal: async (id_conta: string, amount: number) => {
    try {
      const account = await apiClient.get<any>(`/accounts/${id_conta}`);
      if (!account) return;
      const currentBalance = account.saldo_atual || account.currentBalance || 0;
      await apiClient.put(`/accounts/${id_conta}`, {
        ...account,
        saldo_atual: currentBalance - amount,
      });
    } catch (e) {
      console.error('❌ accountService.registerWithdrawal:', e);
    }
  },
};

// Aliases para compatibilidade
export const AccountService = accountService;
export type FinancialAccountEnhanced = ContaBancaria;

