/**
 * ============================================================================
 * SERVIÇO DE CONTROLE DE CAIXA E CONTAS BANCÁRIAS
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este serviço gerencia TODO o dinheiro da igreja, tanto em espécie (caixa físico)
 * quanto em contas bancárias. Ele controla:
 * 
 * • Caixinha de doações (dinheiro vivo na igreja)
 * • Conta corrente no banco
 * • Conta poupança
 * • Aplicações financeiras
 * • Transferências entre contas
 * • Saldo de cada conta em tempo real
 * • Extrato bancário (movimentações)
 * 
 * POR QUE SEPARAR DO TRANSACTION SERVICE?
 * ----------------------------------------
 * - TransactionService: Foca nas transações individuais (contas a pagar/receber)
 * - AccountService: Foca nas CONTAS onde o dinheiro está guardado
 * 
 * ANALOGIA:
 * ---------
 * Pense como sua carteira e seu banco:
 * - Carteira = Caixa (dinheiro vivo)
 * - Banco = Conta corrente/poupança
 * - Cada uma tem seu próprio saldo
 * - Você pode mover dinheiro entre elas (transferências)
 */

import { db } from '../src/services/firebaseService';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { dbService } from './databaseService';
import { FinancialAccount, Transaction } from '../types';

/**
 * TIPO DE CONTA FINANCEIRA
 * ========================
 * Define quais tipos de contas podemos ter
 */
export type AccountType = 'CASH' | 'BANK' | 'SAVINGS' | 'INVESTMENT';

/**
 * EXTENSÃO DA CONTA FINANCEIRA
 * ============================
 * Adiciona campos extras para controle mais detalhado
 */
export interface FinancialAccountEnhanced extends FinancialAccount {
  // Tipo detalhado da conta
  accountType: AccountType;
  
  // Dados bancários (se for banco)
  bankCode?: string;      // Código do banco (ex: 237 = Bradesco)
  agencyNumber?: string;  // Número da agência
  accountNumber?: string; // Número da conta
  
  // Limites e controles
  minimumBalance?: number; // Saldo mínimo permitido (alerta se ficar abaixo)
  maximumBalance?: number; // Saldo máximo ideal (avisar se passar)
  
  // Status
  isActive: boolean;       // Se está ativa ou foi desativada
  isDefault: boolean;      // Se é a conta padrão (usada quando não especificam)
  
  // Datas importantes
  openedAt?: string;       // Quando foi criada
  closedAt?: string;       // Quando foi fechada (se tiver)
  createdAt?: string;      // Data de criação do registro
  
  // Observações
  notes?: string;          // Anotações sobre esta conta
}

/**
 * RESUMO DO SALDO DA CONTA
 * ========================
 * Estrutura para mostrar informações consolidadas
 */
export interface AccountBalanceSummary {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  currentBalance: number;
  incomeThisMonth: number;   // Entradas este mês
  expenseThisMonth: number;  // Saídas este mês
  projectedBalance: number;  // Projeção baseada em contas a pagar/receber
  lastTransactionDate?: string;
}

/**
 * CLASSE DO SERVIÇO DE CONTAS FINANCEIRAS
 * =======================================
 */
export class AccountService {

  /**
   * BUSCAR TODAS AS CONTAS
   * ----------------------
   * 
   * O QUE FAZ?
   * Retorna todas as contas cadastradas (caixa + bancos)
   * 
   * PARÂMETRO:
   * - unitId?: string → ID da unidade/filial (opcional)
   * 
   * RETORNO:
   * Promise<FinancialAccountEnhanced[]> → Lista de todas as contas
   */
  async getAccounts(unitId?: string): Promise<FinancialAccountEnhanced[]> {
    // Busca contas do banco de dados
    const accounts = await dbService.getAccounts(unitId);
    
    // Converte para formato enhanced (com campos extras)
    return accounts.map(account => ({
      ...account,
      accountType: account.type === 'CASH' ? 'CASH' : 'BANK',
      isActive: true,
      isDefault: false,
    }));
  }

  /**
   * BUSCAR UMA CONTA ESPECÍFICA
   * ---------------------------
   * 
   * O QUE FAZ?
   * Retorna os detalhes de uma única conta
   * 
   * PARÂMETRO:
   * - accountId: string → ID da conta que quer buscar
   * 
   * RETORNO:
   * Promise<FinancialAccountEnhanced | undefined> → Dados da conta
   */
  async getAccountById(accountId: string): Promise<FinancialAccountEnhanced | undefined> {
    const accounts = await this.getAccounts();
    return accounts.find(a => a.id === accountId);
  }

  /**
   * SALVAR NOVA CONTA
   * -----------------
   * 
   * O QUE FAZ?
   * Cria uma nova conta (caixa ou banco) no sistema
   * 
   * PARÂMETRO:
   * - account: Partial<FinancialAccountEnhanced> → Dados da conta
   * 
   * RETORNO:
   * Promise<void> → Salva no banco de dados
   * 
   * EXEMPLO DE USO:
   * saveAccount({
   *   name: 'Caixa Igreja',
   *   type: 'CASH',
   *   currentBalance: 0,
   *   accountType: 'CASH'
   * })
   */
  async saveAccount(account: Partial<FinancialAccountEnhanced>): Promise<void> {
    // Gera ID único se não tiver
    const accountId = account.id || crypto.randomUUID();
    
    // Prepara dados completos com tipos corretos
    const accountData: Partial<FinancialAccount> = {
      ...account,
      id: accountId,
      type: (account.accountType === 'CASH' ? 'CASH' : 'BANK') as 'CASH' | 'BANK',
      createdAt: account.createdAt || new Date().toISOString(),
    };
    
    // Salva no banco
    await dbService.saveAccount(accountData);
  }

  /**
   * ATUALIZAR CONTA EXISTENTE
   * -------------------------
   * 
   * O QUE FAZ?
   * Modifica dados de uma conta (nome, saldo, etc.)
   * 
   * PARÂMETROS:
   * - accountId: string → Qual conta atualizar
   * - updates: Partial<FinancialAccountEnhanced> → Novos dados
   */
  async updateAccount(
    accountId: string, 
    updates: Partial<FinancialAccountEnhanced>
  ): Promise<void> {
    const accounts = await this.getAccounts();
    const account = accounts.find(a => a.id === accountId);
    
    if (!account) {
      throw new Error(`Conta ${accountId} não encontrada!`);
    }
    
    // Junta dados atuais com novidades
    const updatedData = {
      ...account,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await dbService.saveAccount(updatedData);
  }

  /**
   * REGISTRAR DEPÓSITO EM CONTA
   * ---------------------------
   * 
   * O QUE FAZ?
   * Adiciona dinheiro a uma conta (depósito em espécie ou transferência recebida)
   * 
   * PARÂMETROS:
   * - accountId: string → Conta que recebe o dinheiro
   * - amount: number → Valor do depósito
   * - description: string → Por que está depositando
   * - date?: string → Data do depósito (hoje se não passar)
   * 
   * RETORNO:
   * Promise<Transaction> → Transação criada
   * 
   * FLUXO:
   * 1. Cria transação de entrada (INCOME)
   * 2. Atualiza saldo da conta (+ valor)
   * 3. Retorna transação criada
   */
  async registerDeposit(
    accountId: string,
    amount: number,
    description: string,
    date?: string
  ): Promise<Transaction> {
    // Validação básica
    if (amount <= 0) {
      throw new Error('Valor do depósito deve ser positivo!');
    }
    
    // Busca conta para ver saldo atual
    const account = await this.getAccountById(accountId);
    if (!account) {
      throw new Error(`Conta ${accountId} não encontrada!`);
    }
    
    // Cria transação de depósito
    const depositTransaction: Transaction = {
      id: crypto.randomUUID(),
      unitId: account.unitId,
      description: description,
      amount: amount,
      date: date || new Date().toISOString().split('T')[0],
      competencyDate: date || new Date().toISOString().split('T')[0],
      type: 'INCOME',  // Entrada de dinheiro
      category: 'TRANSFER',
      costCenter: 'cc1',
      accountId: accountId,
      status: 'PAID',  // Já realizado
      operationNature: 'nat4',  // Transferência
      paymentMethod: 'CASH',
      createdAt: new Date().toISOString(),
    };
    
    // Atualiza saldo da conta
    await this.updateAccount(accountId, {
      currentBalance: account.currentBalance + amount,
    });
    
    // Salva transação
    await dbService.saveTransaction(depositTransaction);
    
    return depositTransaction;
  }

  /**
   * REGISTRAR SAQUE/RETRADA DE CONTA
   * ---------------------------------
   * 
   * O QUE FAZ?
   * Remove dinheiro de uma conta (saque em espécie, pagamento, etc.)
   * 
   * PARÂMETROS:
   * - accountId: string → Conta que perde o dinheiro
   * - amount: number → Valor do saque
   * - description: string → Motivo do saque
   * - date?: string → Data do saque
   * 
   * CUIDADO!
   * ----------
   * Verifica se tem saldo suficiente antes de sacar!
   */
  async registerWithdrawal(
    accountId: string,
    amount: number,
    description: string,
    date?: string
  ): Promise<Transaction> {
    // Validação básica
    if (amount <= 0) {
      throw new Error('Valor do saque deve ser positivo!');
    }
    
    // Busca conta
    const account = await this.getAccountById(accountId);
    if (!account) {
      throw new Error(`Conta ${accountId} não encontrada!`);
    }
    
    // VERIFICA SE TEM SALDO SUFICIENTE
    if (account.currentBalance < amount) {
      throw new Error(
        `Saldo insuficiente! Saldo atual: R$ ${account.currentBalance.toFixed(2)}`
      );
    }
    
    // Cria transação de saída
    const withdrawalTransaction: Transaction = {
      id: crypto.randomUUID(),
      unitId: account.unitId,
      description: description,
      amount: amount,
      date: date || new Date().toISOString().split('T')[0],
      competencyDate: date || new Date().toISOString().split('T')[0],
      type: 'EXPENSE',  // Saída de dinheiro
      category: 'TRANSFER',
      costCenter: 'cc1',
      accountId: accountId,
      status: 'PAID',
      operationNature: 'nat4',
      paymentMethod: 'CASH',
      createdAt: new Date().toISOString(),
    };
    
    // Atualiza saldo (- valor)
    await this.updateAccount(accountId, {
      currentBalance: account.currentBalance - amount,
    });
    
    // Salva transação
    await dbService.saveTransaction(withdrawalTransaction);
    
    return withdrawalTransaction;
  }

  /**
   * TRANSFERIR DINHEIRO ENTRE CONTAS
   * --------------------------------
   * 
   * O QUE FAZ?
   * Move dinheiro de uma conta para outra
   * 
   * EXEMPLO:
   * - Do caixa físico (dinheiro vivo) para conta bancária
   * - De poupança para conta corrente
   * 
   * PARÂMETROS:
   * - fromAccountId: string → Conta de origem (perde dinheiro)
   * - toAccountId: string → Conta de destino (ganha dinheiro)
   * - amount: number → Valor para transferir
   * - description: string → Motivo da transferência
   * 
   * IMPORTANTE!
   * -----------
   * São DUAS transações:
   * 1. Saída na conta de origem
   * 2. Entrada na conta de destino
   */
  async transferBetweenAccounts(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string
  ): Promise<{ fromTransaction: Transaction; toTransaction: Transaction }> {
    // Validações
    if (fromAccountId === toAccountId) {
      throw new Error('Contas devem ser diferentes!');
    }
    
    if (amount <= 0) {
      throw new Error('Valor deve ser positivo!');
    }
    
    // Busca contas
    const fromAccount = await this.getAccountById(fromAccountId);
    const toAccount = await this.getAccountById(toAccountId);
    
    if (!fromAccount || !toAccount) {
      throw new Error('Uma ou ambas contas não existem!');
    }
    
    // Verifica saldo na origem
    if (fromAccount.currentBalance < amount) {
      throw new Error(`Saldo insuficiente na conta ${fromAccount.name}!`);
    }
    
    // Cria transação de SAÍDA (origem)
    const fromTransaction: Transaction = {
      id: crypto.randomUUID(),
      unitId: fromAccount.unitId,
      description: `${description} (Transferência para ${toAccount.name})`,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      competencyDate: new Date().toISOString().split('T')[0],
      type: 'EXPENSE',
      category: 'TRANSFER',
      costCenter: 'cc1',
      accountId: fromAccountId,
      status: 'PAID',
      operationNature: 'nat4',
      paymentMethod: 'TRANSFER',
      createdAt: new Date().toISOString(),
    };
    
    // Cria transação de ENTRADA (destino)
    const toTransaction: Transaction = {
      id: crypto.randomUUID(),
      unitId: toAccount.unitId,
      description: `${description} (Transferência de ${fromAccount.name})`,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      competencyDate: new Date().toISOString().split('T')[0],
      type: 'INCOME',
      category: 'TRANSFER',
      costCenter: 'cc1',
      accountId: toAccountId,
      status: 'PAID',
      operationNature: 'nat4',
      paymentMethod: 'TRANSFER',
      createdAt: new Date().toISOString(),
    };
    
    // Atualiza saldos
    await this.updateAccount(fromAccountId, {
      currentBalance: fromAccount.currentBalance - amount,
    });
    
    await this.updateAccount(toAccountId, {
      currentBalance: toAccount.currentBalance + amount,
    });
    
    // Salva ambas transações
    await dbService.saveTransaction(fromTransaction);
    await dbService.saveTransaction(toTransaction);
    
    return { fromTransaction, toTransaction };
  }

  /**
   * OBTER SALDO CONSOLIDADO
   * -----------------------
   * 
   * O QUE FAZ?
   * Soma todo o dinheiro da igreja (todas as contas)
   * 
   * RETORNO:
   * Um objeto com:
   * - total: soma de tudo
   * - cash: total em espécie (caixinha)
   * - bank: total em bancos
   * - byAccount: detalhado por conta
   */
  async getConsolidatedBalance(): Promise<{
    total: number;
    cash: number;
    bank: number;
    byAccount: AccountBalanceSummary[];
  }> {
    // Busca todas as contas
    const accounts = await this.getAccounts();
    
    // Separa por tipo
    const cashAccounts = accounts.filter(a => a.accountType === 'CASH');
    const bankAccounts = accounts.filter(a => a.accountType === 'BANK' || a.accountType === 'SAVINGS');
    
    // Soma totais
    const totalCash = cashAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    const totalBank = bankAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    const total = totalCash + totalBank;
    
    // Prepara resumo por conta
    const byAccount: AccountBalanceSummary[] = accounts.map(account => ({
      accountId: account.id,
      accountName: account.name,
      accountType: account.accountType,
      currentBalance: account.currentBalance,
      incomeThisMonth: 0,  // Poderia calcular buscando transações do mês
      expenseThisMonth: 0,
      projectedBalance: account.currentBalance,
      lastTransactionDate: undefined,
    }));
    
    return {
      total,
      cash: totalCash,
      bank: totalBank,
      byAccount,
    };
  }

  /**
   * BUSCAR EXTRATO DE UMA CONTA
   * ---------------------------
   * 
   * O QUE FAZ?
   * Retorna todas as movimentações (transações) de uma conta específica
   * 
   * PARÂMETROS:
   * - accountId: string → Conta para extrato
   * - limit?: number → Quantos registros retornar (padrão: 50)
   * 
   * RETORNO:
   * Promise<Transaction[]> → Lista de transações da conta
   * 
   * ÚTIL PARA:
   * - Mostrar histórico de movimentações
   * - Conferir com extrato bancário
   * - Auditoria
   */
  async getAccountStatement(
    accountId: string,
    limit: number = 50
  ): Promise<Transaction[]> {
    // Busca todas as transações
    const allTransactions = await dbService.getTransactions();
    
    // Filtra só desta conta
    const accountTransactions = allTransactions.filter(t => t.accountId === accountId);
    
    // Ordena por data (mais recente primeiro)
    accountTransactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Retorna apenas N primeiras
    return accountTransactions.slice(0, limit);
  }

  /**
   * CONCILIAR TRANSAÇÃO COM EXTRATO BANCÁRIO
   * ----------------------------------------
   * 
   * O QUE FAZ?
   * Marca uma transação como "conferida" com o extrato do banco
   * 
   * CONTEXT:
   * Todo mês, quando chega o extrato do banco, você confere:
   * - Tudo que está no sistema está no extrato? ✓
   * - Tudo que está no extrato está no sistema? ✓
   * 
   * Isso se chama CONCILIAÇÃO BANCÁRIA.
   * 
   * PARÂMETROS:
   * - transactionId: string → Transação para conferir
   * - isConciliated: boolean → Se está conferido ou não
   */
  async conciliateTransaction(
    transactionId: string,
    isConciliated: boolean = true
  ): Promise<void> {
    // Busca transação
    const transactions = await dbService.getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      throw new Error(`Transação ${transactionId} não encontrada!`);
    }
    
    // Atualiza campo isConciliated
    await dbService.saveTransaction({
      ...transaction,
      isConciliated,
      conciliationDate: isConciliated ? new Date().toISOString() : undefined,
    });
  }

  /**
   * ALERTAR SE SALDO ESTIVER BAIXO
   * ------------------------------
   * 
   * O QUE FAZ?
   * Verifica se alguma conta está abaixo do saldo mínimo permitido
   * 
   * RETORNO:
   * Array de contas com saldo abaixo do mínimo
   */
  async checkMinimumBalanceAlerts(): Promise<FinancialAccountEnhanced[]> {
    const accounts = await this.getAccounts();
    
    // Filtra contas que estão abaixo do mínimo
    return accounts.filter(account => {
      if (!account.minimumBalance) return false;  // Não tem mínimo definido
      return account.currentBalance < account.minimumBalance;
    });
  }

  /**
   * EXCLUIR CONTA
   * ============
   * 
   * O QUE FAZ?
   * Remove uma conta do sistema
   * 
   * PARÂMETRO:
   * - accountId: string → ID da conta para excluir
   * 
   * RETORNO:
   * Promise<void> → Remove do banco de dados
   */
  async deleteAccount(accountId: string): Promise<void> {
    try {
      // Remove do Firebase se disponível
      if (db) {
        try {
          const docRef = doc(db, 'accounts', accountId);
          await deleteDoc(docRef);
        } catch (error) {
          console.warn("❌ Erro ao remover do Firebase:", error);
        }
      }

      // Remove do IndexedDB/localStorage via dbService
      try {
        const accounts = await dbService.getAccounts();
        const updatedAccounts = accounts.filter((a: any) => a.id !== accountId);
        
        // Salva as contas atualizadas
        for (const account of updatedAccounts) {
          await dbService.saveAccount(account);
        }
      } catch (error) {
        console.warn("❌ Erro ao remover do IndexedDB:", error);
      }

      console.log('✅ Conta excluída com sucesso:', accountId);
    } catch (error) {
      console.error('❌ Erro ao excluir conta:', error);
      throw error;
    }
  }
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 * Singleton pattern - uma única instância em todo o sistema
 */
export const accountService = new AccountService();
