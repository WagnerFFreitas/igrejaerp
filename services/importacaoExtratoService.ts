/**
 * ============================================================================
 * SERVICE DE IMPORTAÇÃO DE EXTRATOS BANCÁRIOS
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este service gerencia a importação de extratos bancários em diferentes
 * formatos (OFX, CSV) e prepara os dados para conciliação.
 * 
 * FUNCIONALIDADES:
 * • Leitura de arquivos OFX e CSV
 * • Validação de dados importados
 * • Detecção de duplicidades
 * • Conversão para formato do sistema
 * • Agrupamento por conta bancária
 * 
 * ANALOGIA:
 * ---------
 * Pense como um "guichê único" onde você entrega:
 * - Extrato do banco (arquivo)
 * - Ele devolve: Dados prontos para conferência
 */

import { parseOFX, convertToTransaction, isDuplicate } from '../utils/ofxParser';
import { ImportedTransaction, BankStatement, OFXImportResult } from '../utils/ofxParser';
import { Transaction } from '../types';

/**
 * FORMATOS SUPORTADOS
 * ===================
 */
export type StatementFormat = 'OFX' | 'CSV';

/**
 * RESULTADO DA IMPORTAÇÃO
 * =======================
 */
export interface ImportResult {
  success: boolean;
  fileName: string;
  format: StatementFormat;
  statement?: BankStatement;
  transactions?: Partial<Transaction>[];
  duplicates?: number;
  error?: string;
  warnings?: string[];
}

/**
 * CLASSE DO SERVICE DE IMPORTAÇÃO
 * ===============================
 */
export class StatementImportService {

  /**
   * IMPORTAR ARQUIVO DE EXTRATO
   * ---------------------------
   * 
   * O QUE FAZ?
   * Lê arquivo e extrai transações bancárias
   * 
   * PARÂMETROS:
   * - file: File → Arquivo selecionado pelo usuário
   * - accountId: string → Conta bancária no sistema
   * - unitId: string → Unidade/filial
   * - existingTransactions: Transaction[] → Transações já existentes
   * 
   * RETORNO:
   * Promise<ImportResult> → Resultado da importação
   * 
   * COMO FUNCIONA:
   * 1. Detecta formato do arquivo
   * 2. Lê conteúdo
   * 3. Parseia (OFX ou CSV)
   * 4. Converte para Transaction
   * 5. Remove duplicadas
   * 6. Retorna resultado
   */
  async importStatement(
    file: File,
    accountId: string,
    unitId: string,
    existingTransactions: Transaction[]
  ): Promise<ImportResult> {
    try {
      // 1. Detecta formato
      const format = this.detectFileFormat(file.name);
      
      if (!format) {
        return {
          success: false,
          fileName: file.name,
          format: 'OFX',
          error: 'Formato não suportado. Use OFX ou CSV.',
        };
      }
      
      // 2. Lê arquivo
      const content = await this.readFile(file);
      
      // 3. Processa conforme formato
      let result: OFXImportResult;
      
      if (format === 'OFX') {
        result = parseOFX(content);
      } else {
        // CSV ainda não implementado, usa OFX como fallback
        return {
          success: false,
          fileName: file.name,
          format: 'CSV',
          error: 'Importação CSV será implementada em breve.',
        };
      }
      
      // 4. Verifica se teve erro no parse
      if (!result.success || !result.data) {
        return {
          success: false,
          fileName: file.name,
          format,
          error: result.error,
          warnings: result.warnings,
        };
      }
      
      // 5. Converte transações importadas para Transaction
      const transactions: Partial<Transaction>[] = [];
      let duplicates = 0;
      
      for (const imported of result.data.transactions) {
        // Verifica duplicidade
        if (isDuplicate(imported, existingTransactions)) {
          duplicates++;
          continue;  // Pula duplicada
        }
        
        // Converte
        const transaction = convertToTransaction(imported, accountId, unitId);
        transactions.push(transaction);
      }
      
      // 6. Retorna resultado
      return {
        success: true,
        fileName: file.name,
        format,
        statement: result.data,
        transactions,
        duplicates,
        warnings: result.warnings,
      };
      
    } catch (error: any) {
      return {
        success: false,
        fileName: file.name,
        format: 'OFX',
        error: `Erro ao importar: ${error.message}`,
      };
    }
  }

  /**
   * DETECTAR FORMATO DO ARQUIVO
   * ---------------------------
   * 
   * O QUE FAZ?
   * Descobre formato pelo nome/extensão
   * 
   * PARÂMETRO:
   * - fileName: string → Nome do arquivo
   * 
   * RETORNO:
   * StatementFormat | null
   */
  private detectFileFormat(fileName: string): StatementFormat | null {
    const lowerName = fileName.toLowerCase();
    
    if (lowerName.endsWith('.ofx')) {
      return 'OFX';
    }
    
    if (lowerName.endsWith('.csv')) {
      return 'CSV';
    }
    
    return null;
  }

  /**
   * LER ARQUIVO
   * -----------
   * 
   * O QUE FAZ?
   * Lê conteúdo de arquivo como texto
   * 
   * PARÂMETRO:
   * - file: File
   * 
   * RETORNO:
   * Promise<string>
   * 
   * COMO:
   * Usa FileReader API do navegador
   */
  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * VALIDAR DADOS IMPORTADOS
   * ------------------------
   * 
   * O QUE FAZ?
   * Verifica se dados fazem sentido
   * 
   * PARÂMETROS:
   * - transactions: Partial<Transaction>[]
   * 
   * RETORNO:
   * { valid: boolean, errors: string[] }
   */
  validateImportedData(transactions: Partial<Transaction>[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // 1. Verifica se tem transações
    if (transactions.length === 0) {
      errors.push('Nenhuma transação encontrada');
    }
    
    // 2. Valida cada transação
    transactions.forEach((t, index) => {
      // Descrição obrigatória
      if (!t.description) {
        errors.push(`Transação ${index + 1}: Sem descrição`);
      }
      
      // Valor deve ser positivo
      if (!t.amount || t.amount <= 0) {
        errors.push(`Transação ${index + 1}: Valor inválido`);
      }
      
      // Data obrigatória
      if (!t.date) {
        errors.push(`Transação ${index + 1}: Sem data`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * AGRUPAR TRANSAÇÕES POR CONTA
   * ----------------------------
   * 
   * O QUE FAZ?
   * Separa transações por accountId
   * 
   * PARÂMETRO:
   * - transactions: Transaction[]
   * 
   * RETORNO:
   * Map<string, Transaction[]> → accountId → transações
   */
  groupByAccount(transactions: Transaction[]): Map<string, Transaction[]> {
    const grouped = new Map<string, Transaction[]>();
    
    transactions.forEach(t => {
      const accountId = t.accountId || 'unknown';
      
      if (!grouped.has(accountId)) {
        grouped.set(accountId, []);
      }
      
      grouped.get(accountId)!.push(t);
    });
    
    return grouped;
  }

  /**
   * FILTRAR TRANSAÇÕES NÃO CONCILIADAS
   * ----------------------------------
   * 
   * O QUE FAZ?
   * Pega só transações pendentes de conciliação
   * 
   * PARÂMETRO:
   * - transactions: Transaction[]
   * 
   * RETORNO:
   * Transaction[] → Apenas não conciliadas
   */
  filterNotConciliated(transactions: Transaction[]): Transaction[] {
    return transactions.filter(t => !t.isConciliated);
  }

  /**
   * CONTAR TRANSAÇÕES POR TIPO
   * --------------------------
   * 
   * O QUE FAZ?
   * Quantas receitas e despesas
   * 
   * PARÂMETRO:
   * - transactions: Transaction[]
   * 
   * RETORNO:
   * { income: number, expense: number, total: number }
   */
  countByType(transactions: Transaction[]): {
    income: number;
    expense: number;
    total: number;
  } {
    const income = transactions.filter(t => t.type === 'INCOME').length;
    const expense = transactions.filter(t => t.type === 'EXPENSE').length;
    
    return {
      income,
      expense,
      total: income + expense,
    };
  }
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 */
export const statementImportService = new StatementImportService();
export const importacaoExtratoService = statementImportService;
