import { 
  BankReconciliation, 
  BankDiscrepancy, 
  BankTransaction, 
  BankAccount, 
  ReconciliationRule, 
  ReconciliationReport,
  BankStatementImport
} from '../types';

class BankReconciliationService {
  private static readonly STORAGE_KEYS = {
    RECONCILIATIONS: 'bank_reconciliations',
    TRANSACTIONS: 'bank_transactions',
    ACCOUNTS: 'bank_accounts',
    RULES: 'reconciliation_rules',
    IMPORTS: 'bank_statement_imports'
  };

  /**
   * Salvar conciliação bancária
   */
  static async saveReconciliation(reconciliation: BankReconciliation): Promise<void> {
    try {
      const reconciliations = await this.getReconciliations(reconciliation.unitId);
      const existingIndex = reconciliations.findIndex(r => r.id === reconciliation.id);
      
      if (existingIndex >= 0) {
        reconciliations[existingIndex] = {
          ...reconciliation,
          updatedAt: new Date().toISOString()
        };
      } else {
        reconciliations.push({
          ...reconciliation,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.RECONCILIATIONS, reconciliations);
      console.log('✅ Conciliação bancária salva com sucesso:', reconciliation.id);
    } catch (error) {
      console.error('❌ Erro ao salvar conciliação bancária:', error);
      throw error;
    }
  }

  /**
   * Obter conciliações de uma unidade
   */
  static async getReconciliations(unitId: string): Promise<BankReconciliation[]> {
    try {
      const reconciliations = await this.getFromStorage(this.STORAGE_KEYS.RECONCILIATIONS) || [];
      return reconciliations.filter((r: BankReconciliation) => r.unitId === unitId)
                              .sort((a: BankReconciliation, b: BankReconciliation) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter conciliações:', error);
      return [];
    }
  }

  /**
   * Obter conciliação por ID
   */
  static async getReconciliationById(id: string, unitId: string): Promise<BankReconciliation | null> {
    try {
      const reconciliations = await this.getReconciliations(unitId);
      return reconciliations.find(r => r.id === id) || null;
    } catch (error) {
      console.error('❌ Erro ao obter conciliação por ID:', error);
      return null;
    }
  }

  /**
   * Salvar transação bancária
   */
  static async saveTransaction(transaction: BankTransaction): Promise<void> {
    try {
      const transactions = await this.getTransactions(transaction.unitId);
      const existingIndex = transactions.findIndex(t => t.id === transaction.id);
      
      if (existingIndex >= 0) {
        transactions[existingIndex] = {
          ...transaction,
          updatedAt: new Date().toISOString()
        };
      } else {
        transactions.push({
          ...transaction,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.TRANSACTIONS, transactions);
      console.log('✅ Transação bancária salva com sucesso:', transaction.id);
    } catch (error) {
      console.error('❌ Erro ao salvar transação bancária:', error);
      throw error;
    }
  }

  /**
   * Obter transações de uma unidade
   */
  static async getTransactions(unitId: string): Promise<BankTransaction[]> {
    try {
      const transactions = await this.getFromStorage(this.STORAGE_KEYS.TRANSACTIONS) || [];
      return transactions.filter((t: BankTransaction) => t.unitId === unitId)
                              .sort((a: BankTransaction, b: BankTransaction) => new Date(b.dataTransacao).getTime() - new Date(a.dataTransacao).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter transações:', error);
      return [];
    }
  }

  /**
   * Obter transações por conta bancária
   */
  static async getTransactionsByAccount(bankAccountId: string, unitId: string): Promise<BankTransaction[]> {
    try {
      const transactions = await this.getTransactions(unitId);
      return transactions.filter(t => t.bankAccountId === bankAccountId);
    } catch (error) {
      console.error('❌ Erro ao obter transações da conta:', error);
      return [];
    }
  }

  /**
   * Executar conciliação automática
   */
  static async executeReconciliation(
    bankAccountId: string, 
    dataInicio: string, 
    dataFim: string, 
    unitId: string
  ): Promise<BankReconciliation> {
    try {
      // Obter transações bancárias
      const bankTransactions = await this.getTransactionsByAccount(bankAccountId, unitId);
      const filteredBankTransactions = bankTransactions.filter(t => 
        t.dataTransacao >= dataInicio && t.dataTransacao <= dataFim
      );

      // Obter transações do sistema (simulação - em produção buscaria do sistema financeiro)
      const systemTransactions = await this.getSystemTransactions(dataInicio, dataFim, unitId);

      // Executar algoritmo de conciliação
      const result = await this.performReconciliation(filteredBankTransactions, systemTransactions);

      // Criar objeto de conciliação
      const reconciliation: BankReconciliation = {
        id: Math.random().toString(36).substr(2, 9),
        bankAccountId,
        bankAccountName: 'Conta Principal', // Obter da conta bancária
        bankName: 'Banco do Brasil', // Obter da conta bancária
        dataInicio,
        dataFim,
        saldoInicial: 10000, // Simulação
        saldoFinal: 15000, // Simulação
        saldoConciliado: result.saldoConciliado,
        diferenca: result.diferenca,
        status: result.diferenca === 0 ? 'CONCILIATED' : 'DISCREPANCY',
        percentualConciliacao: result.percentualConciliacao,
        totalTransacoesBanco: filteredBankTransactions.length,
        totalTransacoesSistema: systemTransactions.length,
        transacoesConciliadas: result.transacoesConciliadas,
        transacoesNaoConciliadas: result.transacoesNaoConciliadas,
        divergencias: result.divergencias,
        conciliadoPor: 'system',
        conciliadoPorNome: 'Sistema Automático',
        dataConciliacao: new Date().toISOString(),
        observacoes: `Conciliação automática executada em ${new Date().toLocaleDateString('pt-BR')}`,
        anexos: [],
        unitId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.saveReconciliation(reconciliation);
      
      // Salvar divergências encontradas
      for (const discrepancy of result.divergencias) {
        await this.saveDiscrepancy({
          ...discrepancy,
          reconciliationId: reconciliation.id
        });
      }

      console.log('✅ Conciliação automática executada com sucesso:', reconciliation.id);
      return reconciliation;
    } catch (error) {
      console.error('❌ Erro ao executar conciliação automática:', error);
      throw error;
    }
  }

  /**
   * Algoritmo de conciliação
   */
  private static async performReconciliation(
    bankTransactions: BankTransaction[], 
    systemTransactions: any[]
  ): Promise<{
    transacoesConciliadas: number;
    transacoesNaoConciliadas: number;
    saldoConciliado: number;
    diferenca: number;
    percentualConciliacao: number;
    divergencias: BankDiscrepancy[];
  }> {
    const divergencias: BankDiscrepancy[] = [];
    let transacoesConciliadas = 0;
    let saldoConciliado = 0;

    // Simulação de algoritmo de conciliação
    for (const bankTx of bankTransactions) {
      // Buscar correspondência no sistema
      const match = this.findBestMatch(bankTx, systemTransactions);
      
      if (match) {
        // Marcar como conciliado
        bankTx.statusConciliacao = 'CONCILIATED';
        bankTx.transacaoSistemaId = match.id;
        bankTx.dataConciliacao = new Date().toISOString();
        
        transacoesConciliadas++;
        saldoConciliado += bankTx.valor;
        
        await this.saveTransaction(bankTx);
      } else {
        // Criar divergência
        const discrepancy: BankDiscrepancy = {
          id: Math.random().toString(36).substr(2, 9),
          reconciliationId: '', // Será preenchido depois
          tipo: 'MISSING_IN_SYSTEM',
          gravidade: 'MEDIUM',
          transacaoBancoId: bankTx.id,
          descricao: `Transação bancária não encontrada no sistema: ${bankTx.descricao}`,
          valorDiferenca: bankTx.valor,
          dataEsperada: bankTx.dataTransacao,
          status: 'OPEN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        divergencias.push(discrepancy);
      }
    }

    // Verificar transações do sistema não encontradas no banco
    for (const sysTx of systemTransactions) {
      const found = bankTransactions.find(bankTx => bankTx.transacaoSistemaId === sysTx.id);
      
      if (!found) {
        const discrepancy: BankDiscrepancy = {
          id: Math.random().toString(36).substr(2, 9),
          reconciliationId: '',
          tipo: 'MISSING_IN_BANK',
          gravidade: 'HIGH',
          transacaoSistemaId: sysTx.id,
          descricao: `Transação do sistema não encontrada no extrato bancário: ${sysTx.descricao}`,
          valorDiferenca: sysTx.valor,
          dataEsperada: sysTx.data,
          status: 'OPEN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        divergencias.push(discrepancy);
      }
    }

    const totalTransactions = bankTransactions.length + systemTransactions.length;
    const transacoesNaoConciliadas = totalTransactions - (transacoesConciliadas * 2);
    const percentualConciliacao = totalTransactions > 0 ? (transacoesConciliadas * 2 / totalTransactions) * 100 : 0;
    const diferenca = Math.abs(bankTransactions.reduce((sum, tx) => sum + tx.valor, 0) - 
                              systemTransactions.reduce((sum, tx) => sum + tx.valor, 0));

    return {
      transacoesConciliadas,
      transacoesNaoConciliadas,
      saldoConciliado,
      diferenca,
      percentualConciliacao,
      divergencias
    };
  }

  /**
   * Encontrar melhor correspondência (algoritmo simplificado)
   */
  private static findBestMatch(bankTransaction: BankTransaction, systemTransactions: any[]): any {
    // Simulação - em produção usaria algoritmo mais sofisticado
    return systemTransactions.find(sysTx => 
      Math.abs(sysTx.valor - bankTransaction.valor) < 0.01 &&
      sysTx.data === bankTransaction.dataTransacao
    );
  }

  /**
   * Obter transações do sistema (simulação)
   */
  private static async getSystemTransactions(dataInicio: string, dataFim: string, unitId: string): Promise<any[]> {
    // Simulação - em produção buscaria do módulo financeiro
    return [
      {
        id: 'sys-001',
        data: '2024-03-15',
        descricao: 'Pagamento de Salário',
        valor: 5000,
        tipo: 'DEBIT'
      },
      {
        id: 'sys-002', 
        data: '2024-03-16',
        descricao: 'Recebimento de Dízimos',
        valor: 2000,
        tipo: 'CREDIT'
      }
    ];
  }

  /**
   * Salvar divergência
   */
  static async saveDiscrepancy(discrepancy: BankDiscrepancy): Promise<void> {
    try {
      const discrepancies = await this.getDiscrepancies('default');
      const existingIndex = discrepancies.findIndex(d => d.id === discrepancy.id);
      
      if (existingIndex >= 0) {
        discrepancies[existingIndex] = {
          ...discrepancy,
          updatedAt: new Date().toISOString()
        };
      } else {
        discrepancies.push({
          ...discrepancy,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage('bank_discrepancies', discrepancies);
      console.log('✅ Divergência salva com sucesso:', discrepancy.id);
    } catch (error) {
      console.error('❌ Erro ao salvar divergência:', error);
      throw error;
    }
  }

  /**
   * Obter divergências
   */
  static async getDiscrepancies(unitId: string): Promise<BankDiscrepancy[]> {
    try {
      const discrepancies = await this.getFromStorage('bank_discrepancies') || [];
      return discrepancies.filter((d: BankDiscrepancy) => d.unitId === unitId || d.unitId === 'default')
                      .sort((a: BankDiscrepancy, b: BankDiscrepancy) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter divergências:', error);
      return [];
    }
  }

  /**
   * Gerar relatório de conciliação
   */
  static async generateReconciliationReport(
    reconciliationId: string, 
    unitId: string
  ): Promise<ReconciliationReport> {
    try {
      const reconciliation = await this.getReconciliationById(reconciliationId, unitId);
      if (!reconciliation) {
        throw new Error('Conciliação não encontrada');
      }

      const discrepancies = await this.getDiscrepancies(unitId);
      const reconciliationDiscrepancies = discrepancies.filter(d => d.reconciliationId === reconciliationId);

      // Agrupar divergências por tipo
      const divergenciasPorTipo = reconciliationDiscrepancies.reduce((acc, d) => {
        acc[d.tipo] = (acc[d.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Simulação de análise de categorias
      const principaisCategorias = [
        { categoria: 'Salários', quantidade: 10, valor: 50000, percentual: 35 },
        { categoria: 'Dízimos', quantidade: 50, valor: 25000, percentual: 20 },
        { categoria: 'Ofertas', quantidade: 30, valor: 15000, percentual: 15 },
        { categoria: 'Despesas', quantidade: 20, valor: 30000, percentual: 30 }
      ];

      const report: ReconciliationReport = {
        id: Math.random().toString(36).substr(2, 9),
        reconciliationId,
        dataInicio: reconciliation.dataInicio,
        dataFim: reconciliation.dataFim,
        
        metricas: {
          totalTransacoes: reconciliation.totalTransacoesBanco + reconciliation.totalTransacoesSistema,
          transacoesConciliadas: reconciliation.transacoesConciliadas,
          taxaConciliacao: reconciliation.percentualConciliacao,
          valorTotal: 120000, // Simulação
          valorConciliado: reconciliation.saldoConciliado,
          valorNaoConciliado: reconciliation.diferenca,
          numeroDivergencias: reconciliationDiscrepancies.length
        },
        
        analise: {
          principaisCategorias,
          tendencias: {
            periodoComparativo: 'Mês Anterior',
            variacaoPercentual: 5.2,
            variacaoValor: 2500
          },
          recomendacoes: [
            'Investigar divergências de alto valor',
            'Revisar regras de conciliação automática',
            'Implementar validação preventiva'
          ]
        },
        
        divergenciasPorTipo,
        
        geradoPor: 'system',
        dataGeracao: new Date().toISOString(),
        
        unitId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return report;
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de conciliação:', error);
      throw error;
    }
  }

  /**
   * Importar extrato bancário
   */
  static async importBankStatement(
    bankAccountId: string,
    file: File,
    unitId: string
  ): Promise<BankStatementImport> {
    try {
      const importRecord: BankStatementImport = {
        id: Math.random().toString(36).substr(2, 9),
        bankAccountId,
        nomeArquivo: file.name,
        tipoArquivo: this.getFileType(file.name),
        tamanhoArquivo: file.size,
        status: 'PROCESSING',
        dataUpload: new Date().toISOString(),
        totalTransacoes: 0,
        transacoesImportadas: 0,
        transacoesDuplicadas: 0,
        transacoesInvalidas: 0,
        erros: [],
        validado: false,
        unitId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Salvar registro inicial
      const imports = await this.getFromStorage(this.STORAGE_KEYS.IMPORTS) || [];
      imports.push(importRecord);
      await this.saveToStorage(this.STORAGE_KEYS.IMPORTS, imports);

      // Simular processamento do arquivo
      await this.processFile(file, importRecord.id, unitId);

      return importRecord;
    } catch (error) {
      console.error('❌ Erro ao importar extrato bancário:', error);
      throw error;
    }
  }

  /**
   * Processar arquivo de extrato
   */
  private static async processFile(file: File, importId: string, unitId: string): Promise<void> {
    try {
      // Simulação de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular parsing baseado no tipo de arquivo
      let transactions: BankTransaction[] = [];
      
      if (file.name.endsWith('.csv')) {
        transactions = await this.parseCSV(file, unitId);
      } else if (file.name.endsWith('.ofx')) {
        transactions = await this.parseOFX(file, unitId);
      } else {
        throw new Error('Formato de arquivo não suportado');
      }

      // Salvar transações importadas
      for (const transaction of transactions) {
        await this.saveTransaction(transaction);
      }

      // Atualizar registro de importação
      const imports = await this.getFromStorage(this.STORAGE_KEYS.IMPORTS) || [];
      const importIndex = imports.findIndex((imp: BankStatementImport) => imp.id === importId);
      
      if (importIndex >= 0) {
        imports[importIndex] = {
          ...imports[importIndex],
          status: 'PROCESSED',
          dataProcessamento: new Date().toISOString(),
          totalTransacoes: transactions.length,
          transacoesImportadas: transactions.length,
          transacoesDuplicadas: 0,
          transacoesInvalidas: 0,
          validado: true
        };
        
        await this.saveToStorage(this.STORAGE_KEYS.IMPORTS, imports);
      }

      console.log('✅ Arquivo processado com sucesso:', file.name);
    } catch (error: any) {
      console.error('❌ Erro ao processar arquivo:', error);
      
      // Atualizar registro com erro
      const imports = await this.getFromStorage(this.STORAGE_KEYS.IMPORTS) || [];
      const importIndex = imports.findIndex((imp: BankStatementImport) => imp.id === importId);
      
      if (importIndex >= 0) {
        imports[importIndex] = {
          ...imports[importIndex],
          status: 'ERROR',
          erros: [{ linha: 1, descricao: error.message || 'Erro desconhecido' }]
        };
        
        await this.saveToStorage(this.STORAGE_KEYS.IMPORTS, imports);
      }
    }
  }

  /**
   * Obter tipo do arquivo
   */
  private static getFileType(filename: string): BankStatementImport['tipoArquivo'] {
    const extension = filename.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'csv': return 'CSV';
      case 'ofx': return 'OFX';
      case 'xlsx': return 'XLSX';
      case 'pdf': return 'PDF';
      case 'xml': return 'XML';
      default: return 'CSV';
    }
  }

  /**
   * Parse CSV (simulação)
   */
  private static async parseCSV(file: File, unitId: string): Promise<BankTransaction[]> {
    // Simulação de parsing CSV
    return [
      {
        id: Math.random().toString(36).substr(2, 9),
        bankAccountId: 'acc-001',
        dataTransacao: '2024-03-15',
        descricao: 'Pagamento Salário',
        categoria: 'Despesa',
        valor: 5000,
        moeda: 'BRL',
        tipo: 'DEBIT' as const,
        metodoPagamento: 'TRANSFER' as const,
        statusConciliacao: 'NOT_CONCILIATED' as const,
        origem: 'BANK_STATEMENT' as const,
        unitId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Parse OFX (simulação)
   */
  private static async parseOFX(file: File, unitId: string): Promise<BankTransaction[]> {
    // Simulação de parsing OFX
    return [
      {
        id: Math.random().toString(36).substr(2, 9),
        bankAccountId: 'acc-001',
        dataTransacao: '2024-03-16',
        descricao: 'Recebimento Dízimos',
        categoria: 'Receita',
        valor: 2000,
        moeda: 'BRL',
        tipo: 'CREDIT' as const,
        metodoPagamento: 'PIX' as const,
        statusConciliacao: 'NOT_CONCILIATED' as const,
        origem: 'BANK_STATEMENT' as const,
        unitId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Salvar no IndexedDB
   */
  private static async saveToStorage(key: string, data: any): Promise<void> {
    try {
      if ('indexedDB' in window) {
        const request = indexedDB.open('bank_reconciliation_db', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('reconciliation_data')) {
            db.createObjectStore('reconciliation_data');
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['reconciliation_data'], 'readwrite');
          const store = transaction.objectStore('reconciliation_data');
          store.put({ key, data, timestamp: Date.now() });
        };
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('❌ Erro ao salvar no storage:', error);
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * Obter do IndexedDB
   */
  private static async getFromStorage(key: string): Promise<any> {
    try {
      if ('indexedDB' in window) {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('bank_reconciliation_db', 1);
          
          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(['reconciliation_data'], 'readonly');
            const store = transaction.objectStore('reconciliation_data');
            const getRequest = store.get(key);
            
            getRequest.onsuccess = () => {
              resolve(getRequest.result?.data || null);
            };
            
            getRequest.onerror = () => {
              reject(getRequest.error);
            };
          };
          
          request.onerror = () => {
            reject(request.error);
          };
        });
      } else {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('❌ Erro ao obter do storage:', error);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  }
}

export default BankReconciliationService;
