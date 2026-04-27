/**
 * ============================================================================
 * BANKRECONCILIATIONSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para bank reconciliation service.
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
 * Define o bloco principal deste arquivo (bank reconciliation service).
 */

class BankReconciliationService {

  static async getReconciliations(unitId?: string) {
    try {
      const data = await apiClient.get<any[]>('/reconciliations', { unitId });
      return data || [];
    } catch (e) {
      console.error('❌ getReconciliations:', e);
      return [];
    }
  }

  static async getTransactionsByAccount(accountId: string, unitId?: string) {
    try {
      // Busca todas as reconciliações da unidade e filtra as transações do extrato
      const reconciliations = await this.getReconciliations(unitId);
      const results: any[] = [];
      for (const rec of reconciliations) {
        if (rec.bank_account_id === accountId || rec.bankAccountId === accountId) {
          const txs = await apiClient.get<any[]>(`/reconciliations/${rec.id}/transactions`);
          results.push(...(txs || []));
        }
      }
      return results;
    } catch (e) {
      console.error('❌ getTransactionsByAccount:', e);
      return [];
    }
  }

  static async importBankStatement(accountId: string, file: File, unitId: string) {
    try {
      // 1. Criar ou buscar reconciliação aberta para esta conta
      const today = new Date().toISOString().split('T')[0];
      const reconciliation = await apiClient.post<any>('/reconciliations', {
        unitId,
        bankAccountId: accountId,
        dataInicio: today,
        dataFim: today,
        status: 'IN_PROGRESS',
      });

      // 2. Registrar a transação de importação
      const imported = await apiClient.post<any>(`/reconciliations/${reconciliation.id}/transactions`, {
        unitId,
        bankAccountId: accountId,
        dataTransacao: today,
        descricao: `Extrato importado: ${file.name}`,
        valor: 0,
        tipo: 'CREDIT',
        metodoPagamento: 'TRANSFER',
        statusConciliacao: 'PENDING',
        origem: 'BANK_STATEMENT',
      });

      return imported;
    } catch (e) {
      console.error('❌ importBankStatement:', e);
      throw e;
    }
  }

  static async executeReconciliation(accountId: string, startDate: string, endDate: string, unitId: string) {
    try {
      const reconciliation = await apiClient.post<any>('/reconciliations', {
        unitId,
        bankAccountId: accountId,
        dataInicio: startDate,
        dataFim: endDate,
        status: 'IN_PROGRESS',
        conciliadoPor: 'system',
        dataConciliacao: new Date().toISOString(),
      });
      return reconciliation;
    } catch (e) {
      console.error('❌ executeReconciliation:', e);
      throw e;
    }
  }

  static async updateReconciliation(id: string, data: any) {
    try {
      return await apiClient.put<any>(`/reconciliations/${id}`, data);
    } catch (e) {
      console.error('❌ updateReconciliation:', e);
      throw e;
    }
  }

  static async matchTransaction(reconciliationId: string, bankTxId: string, systemTransactionId: string) {
    try {
      return await apiClient.patch<any>(
        `/reconciliations/${reconciliationId}/transactions/${bankTxId}/match`,
        { transactionId: systemTransactionId }
      );
    } catch (e) {
      console.error('❌ matchTransaction:', e);
      throw e;
    }
  }
}

export default BankReconciliationService;
