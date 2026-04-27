/*==========================================================================
                            LANÇAMENTO CONTÁBIL                           
  ==========================================================================
  Ele gerencia: 
  - Livro Diário (todos os lançamentos)
  - Livro Razão (por conta analítica)
  - Balancete de verificação
  - Integração com transações financeiras
  
  LIVRO DIÁRIO - Registra cronologicamente TODAS as operações financeiras.
  Cada lançamento tem:
  - Número sequencial;
  - Data;
  - Histórico;
  - Débito e Crédito (sempre iguais!).
  
  LIVRO RAZÃO:
  Movimento detalhado de CADA conta;
  Mostra saldos após cada lançamento.
  
  BALANCETE:
  Foto dos saldos de TODAS as contas em um período;
  Deve sempre fechar (Ativo = Passivo + PL).
  
  ANALOGIA:
  1. Transação financeira acontece;
  2. Vira lançamento no Diário;
  3. Atualiza Razão de cada conta;
  4. Gera Balancete para conferência.
 */

import { Transaction, ChartOfAccount, AccountingEntry, AccountBalance, GeneralLedger, TrialBalance } from '../types';
import { mapCategoryToAccount, calculateAccountBalance, validateEntry } from '../utils/accountingUtils';

/*     CLASSE CONTÁBIL        */
export class AccountingEngine {

  /* GERAR NÚMERO DE LANÇAMENTO
  ------------------------------
  PARÂMETROS:
  - entries: AccountingEntry[] → Lançamentos existentes
  
  RETORNO:
  number → Próximo número
  */
  generateEntryNumber(entries: AccountingEntry[]): number {
    if (entries.length === 0) return 1;
    const maxNumber = Math.max(...entries.map(e => e.entryNumber));
    return maxNumber + 1;
  }

  /* CRIAR LANÇAMENTO DIÁRIO
  ---------------------------
   * PARÂMETROS:
   * - transaction: Transaction → Transação financeira
   * - accounts: ChartOfAccount[] → Plano de contas
   * - entries: AccountingEntry[] → Diário existente
   * 
   * RETORNO:
   * AccountingEntry → Lançamento criado
   * 
   * COMO FUNCIONA:
   * 1. Identifica contas de débito e crédito
   * 2. Gera número sequencial
   * 3. Monta histórico padrão
   * 4. Valida equilíbrio (débito = crédito)
   * 5. Retorna lançamento
   */
  createJournalEntry(
    transaction: Transaction,
    accounts: ChartOfAccount[],
    entries: AccountingEntry[]
  ): AccountingEntry {
    // 1. Identifica natureza da transação
    const isIncome = transaction.type === 'INCOME';
    
    // 2. Mapeia para contas contábeis
    const accountCode = mapCategoryToAccount(transaction.category, isIncome);
    const cashAccountCode = isIncome ? '1.1.01.001' : '1.1.01.001'; // Caixa/Banco
    
    // 3. Encontra contas no plano
    const mainAccount = accounts.find(a => a.code === accountCode);
    const cashAccount = accounts.find(a => a.code === cashAccountCode);
    
    if (!mainAccount || !cashAccount) {
      throw new Error('Contas contábeis não encontradas para este lançamento');
    }
    
    // 4. Gera número do lançamento
    const entryNumber = this.generateEntryNumber(entries);
    
    // 5. Monta histórico
    const history = `${transaction.descricao || transaction.description} - ${transaction.natureza_operacao || transaction.operationNature || 'Operação financeira'}`;
    
    // 6. Define valores (débito e crédito)
    let debitValue = 0;
    let creditValue = 0;

    if (isIncome) {
      debitValue = transaction.valor ?? transaction.amount;
      creditValue = transaction.valor ?? transaction.amount;
    } else {
      debitValue = transaction.valor ?? transaction.amount;
      creditValue = transaction.valor ?? transaction.amount;
    }
    
    // 7. Valida equilíbrio
    const validation = validateEntry(debitValue, creditValue);
    if (!validation.valid) {
      throw new Error(`Lançamento desequilibrado. Diferença: R$ ${validation.difference.toFixed(2)}`);
    }
    
    // 8. Cria lançamento
    return {
      id: `entry-${Date.now()}-${entryNumber}`,
      unitId: transaction.unitId,
      entryNumber,
      date: transaction.date,
      documentNumber: transaction.id,
      history,
      complement: transaction.notes,
      debitValue,
      creditValue,
      contraAccount: isIncome ? cashAccount.code : mainAccount.code,
      transactionId: transaction.id,
      projectId: transaction.projectId,
      createdAt: new Date().toISOString(),
      createdBy: 'SYSTEM',
      status: 'POSTED',
    };
  }

  /**
   * GERAR LIVRO RAZÃO DE UMA CONTA
   * ------------------------------
   * PARÂMETROS:
   * - accountId: string → Conta desejada
   * - entries: AccountingEntry[] → Todos os lançamentos
   * - accounts: ChartOfAccount[] → Plano de contas
   * - period?: string → Filtrar por mês (YYYY-MM)
   * 
   * RETORNO:
   * GeneralLedger → Razão da conta
   */
  generateGeneralLedger(
    accountId: string,
    entries: AccountingEntry[],
    accounts: ChartOfAccount[],
    period?: string
  ): GeneralLedger {
    // 1. Encontra conta
    const account = accounts.find(a => a.id === accountId);
      if (!account) {
      throw new Error('Conta não encontrada');
    }
    
    // 2. Filtra lançamentos da conta
    let accountEntries = entries.filter(e => 
      e.status === 'POSTED' &&
      (e.contraAccount === account.code || 
      entries.some(entry => 
        (entry.debitValue > 0 && entry.contraAccount === account.code) ||
        (entry.creditValue > 0 && entry.contraAccount === account.code)
      ))
    );
    
    // 3. Filtra por período se tiver
    if (period) {
      const [year, month] = period.split('-');
      accountEntries = accountEntries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate.getFullYear().toString() === year &&
               (entryDate.getMonth() + 1).toString().padStart(2, '0') === month;
      });
    }
    
    // 4. Ordena por data
    accountEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // 5. Calcula saldos
    let runningBalance = 0;
    const ledgerEntries = accountEntries.map(entry => {
      // Determina se é débito ou crédito para esta conta
      const isDebit = entry.contraAccount !== account.code;
      const value = isDebit ? entry.debitValue : entry.creditValue;
      
      // Atualiza saldo corrido
      if (account.normalBalance === 'DEBIT') {
        runningBalance += isDebit ? value : -value;
      } else {
        runningBalance += isDebit ? -value : value;
      }
      
      return {
        entryId: entry.id,
        entryNumber: entry.entryNumber,
        date: entry.date,
        documentNumber: entry.documentNumber,
        history: entry.history,
        debitValue: isDebit ? value : 0,
        creditValue: isDebit ? 0 : value,
        balance: runningBalance,
      };
    });
    
    // 6. Calcula totais
    const totalDebits = ledgerEntries.reduce((sum, e) => sum + e.debitValue, 0);
    const totalCredits = ledgerEntries.reduce((sum, e) => sum + e.creditValue, 0);
    
    // 7. Retorna razão
    return {
      accountId: account.id,
      accountName: account.nome || account.name,
      accountCode: account.code,
      period: period || 'ALL',
      entries: ledgerEntries,
      totalDebits,
      totalCredits,
      openingBalance: ledgerEntries.length > 0 ? ledgerEntries[0].balance - (ledgerEntries[0].debitValue - ledgerEntries[0].creditValue) : 0,
      closingBalance: runningBalance,
    };
  }

  /**
   * GERAR BALANCETE DE VERIFICAÇÃO
   * ------------------------------
   * 
   * O QUE FAZ?
   * Lista saldos de todas as contas para conferência
   * 
   * PARÂMETROS:
   * - entries: AccountingEntry[] → Lançamentos do período
   * - accounts: ChartOfAccount[] → Plano de contas completo
   * - period: string → Mês de referência (YYYY-MM)
   * 
   * RETORNO:
   * TrialBalance → Balancete completo
   */
  generateTrialBalance(
    entries: AccountingEntry[],
    accounts: ChartOfAccount[],
    period: string
  ): TrialBalance {
    // 1. Filtra lançamentos do período
    const [year, month] = period.split('-');
    const periodEntries = entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate.getFullYear().toString() === year &&
             (entryDate.getMonth() + 1).toString().padStart(2, '0') === month &&
             e.status === 'POSTED';
    });
    
    // 2. Calcula saldo de cada conta
    const accountBalances: AccountBalance[] = [];
    
    for (const account of accounts) {
      // Filtra lançamentos desta conta
      const accountEntries = periodEntries.filter(e => 
        e.contraAccount === account.code
      );
      
      if (accountEntries.length === 0) continue;
      
      // Soma débitos e créditos
      const debits = accountEntries.reduce((sum, e) => sum + e.debitValue, 0);
      const credits = accountEntries.reduce((sum, e) => sum + e.creditValue, 0);
      
      // Calcula saldo
      const balance = calculateAccountBalance(account.nature, debits, credits);
      
      accountBalances.push({
        accountId: account.id,
        accountName: account.nome || account.name,
        accountCode: account.code,
        nature: account.nature,
        openingBalance: 0,  // Viria do período anterior
        debitPeriod: debits,
        creditPeriod: credits,
        closingBalance: balance,
        entriesCount: accountEntries.length,
      });
    }
    
    // 3. Agrupa por natureza
    const assets = accountBalances.filter(a => a.nature === 'ASSET');
    const liabilities = accountBalances.filter(a => a.nature === 'LIABILITY');
    const equity = accountBalances.filter(a => a.nature === 'EQUITY');
    const income = accountBalances.filter(a => a.nature === 'INCOME');
    const expense = accountBalances.filter(a => a.nature === 'EXPENSE');
    
    // 4. Calcula totais
    const totalAssets = assets.reduce((sum, a) => sum + a.closingBalance, 0);
    const totalLiabilities = liabilities.reduce((sum, a) => sum + a.closingBalance, 0);
    const totalEquity = equity.reduce((sum, a) => sum + a.closingBalance, 0);
    const totalIncome = income.reduce((sum, a) => sum + a.closingBalance, 0);
    const totalExpense = expense.reduce((sum, a) => sum + a.closingBalance, 0);
    
    // 5. Verifica equilíbrio
    const result = totalAssets - (totalLiabilities + totalEquity + totalIncome - totalExpense);
    const isBalanced = Math.abs(result) < 0.01;
    
    // 6. Retorna balancete
    return {
      period,
      generatedAt: new Date().toISOString(),
      accounts: accountBalances,
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalIncome,
      totalExpense,
      isBalanced,
      difference: Math.abs(result),
    };
  }

  /**
   * INTEGRAR TRANSAÇÕES FINANCEIRAS COM CONTABILIDADE
   * -------------------------------------------------
   * 
   * O QUE FAZ?
   * Converte todas as transações financeiras em lançamentos contábeis
   * 
   * PARÂMETROS:
   * - transactions: Transaction[] → Transações do sistema financeiro
   * - accounts: ChartOfAccount[] → Plano de contas
   * - existingEntries: AccountingEntry[] → Lançamentos já existentes
   * 
   * RETORNO:
   * AccountingEntry[] → Todos os lançamentos (existentes + novos)
   */
  integrateFinancialTransactions(
    transactions: Transaction[],
    accounts: ChartOfAccount[],
    existingEntries: AccountingEntry[]
  ): AccountingEntry[] {
    const newEntries: AccountingEntry[] = [];
    
    // Para cada transação financeira
    for (const transaction of transactions) {
      // Verifica se já foi integrada
      const alreadyIntegrated = existingEntries.some(e => 
        e.transactionId === transaction.id
      );
      
      if (alreadyIntegrated) continue;
      
      try {
        // Cria lançamento contábil
        const entry = this.createJournalEntry(transaction, accounts, [
          ...existingEntries,
          ...newEntries
        ]);
        
        newEntries.push(entry);
      } catch (error) {
        console.error(`Erro ao integrar transação ${transaction.id}:`, error);
        // Continua para próxima
      }
    }
    
    return [...existingEntries, ...newEntries];
  }

  /**
   * EXPORTAR DIÁRIO PARA TEXTO
   * --------------------------
   * 
   * O QUE FAZ?
   * Formata Livro Diário para impressão/exportação
   * 
   * PARÂMETROS:
   * - entries: AccountingEntry[]
   * - period: string
   * 
   * RETORNO:
   * string → Diário formatado
   */
  exportJournalToText(entries: AccountingEntry[], period: string): string {
    const lines: string[] = [];
    
    lines.push('═'.repeat(100));
    lines.push('LIVRO DIÁRIO');
    lines.push(`Período: ${period}`);
    lines.push('═'.repeat(100));
    lines.push('');
    
    for (const entry of entries) {
      lines.push(`Lançamento nº ${entry.entryNumber}`);
      lines.push(`Data: ${new Date(entry.date).toLocaleDateString('pt-BR')}`);
      lines.push(`Histórico: ${entry.history}`);
      lines.push(`Débito: R$ ${entry.debitValue.toFixed(2)}`);
      lines.push(`Crédito: R$ ${entry.creditValue.toFixed(2)}`);
      lines.push('─'.repeat(100));
    }
    
    return lines.join('\n');
  }
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 */
export const accountingEngine = new AccountingEngine();
