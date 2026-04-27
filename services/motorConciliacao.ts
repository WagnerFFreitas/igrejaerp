/**
 * ============================================================================
 * MOTOR DE CONCILIAÇÃO BANCÁRIA
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este é o "cérebro" da conciliação. Ele compara automaticamente
 * transações do sistema com transações bancárias importadas e sugere
 * correspondências (matches).
 * 
 * COMO FUNCIONA:
 * 1. Compara valor (deve ser igual ou muito próximo)
 * 2. Compara data (deve estar próxima - até 5 dias)
 * 3. Compara descrição (similaridade por texto)
 * 4. Atribui score de confiança (0-100%)
 * 5. Sugere melhores correspondências
 * 
 * ALGORITMO:
 * ----------
 * Score = (Peso Valor × Match Valor) + 
 *         (Peso Data × Match Data) + 
 *         (Peso Descrição × Match Descrição)
 * 
 * ONDE:
 * - Peso Valor = 50% (mais importante)
 * - Peso Data = 30%
 * - Peso Descrição = 20%
 * 
 * ANALOGIA:
 * ---------
 * Pense como um detetive que procura pares perfeitos:
 * - Mesmo valor ✓
 * - Data próxima ✓
 * - Descrição parecida ✓
 * → É par! (concilia)
 */

import { Transaction } from '../types';
import { ImportedTransaction } from '../utils/ofxParser';

/**
 * CORRESPONDÊNCIA SUGERIDA
 * ========================
 * Resultado da tentativa de match
 */
export interface MatchSuggestion {
  bankTransaction: ImportedTransaction;   // Transação do banco
  systemTransaction?: Transaction;         // Transação do sistema (se achar)
  confidenceScore: number;                 // 0-100% de confiança
  matchReasons: string[];                  // Por que fez match
  hasDivergence: boolean;                  // Se tem divergência
  divergenceDetails?: string;              // Qual divergência
}

/**
 * RESULTADO DA CONCILIAÇÃO
 * ========================
 */
export interface ReconciliationResult {
  conciliated: MatchSuggestion[];      // Conciliados com sucesso
  pendingBank: MatchSuggestion[];      // Do banco sem par no sistema
  pendingSystem: MatchSuggestion[];    // Do sistema sem par no banco
  divergent: MatchSuggestion[];        // Com divergências
  totalBankTransactions: number;
  totalSystemTransactions: number;
  conciliationRate: number;            // % de sucesso
}

/**
 * CLASSE DO MOTOR DE CONCILIAÇÃO
 * ==============================
 */
export class ReconciliationEngine {

  /**
   * CONFIGURAÇÕES
   * =============
   */
  private readonly CONFIDENCE_THRESHOLD = 60;  // Score mínimo para sugerir
  private readonly MAX_DATE_DIFF = 5;          // Dias máximos de diferença
  private readonly VALUE_WEIGHT = 0.50;        // 50%
  private readonly DATE_WEIGHT = 0.30;         // 30%
  private readonly DESC_WEIGHT = 0.20;         // 20%

  /**
   * REALIZAR CONCILIAÇÃO AUTOMÁTICA
   * --------------------------------
   * 
   * O QUE FAZ?
   * Compara todas as transações bancárias com as do sistema
   * 
   * PARÂMETROS:
   * - bankTransactions: ImportedTransaction[] → Importadas do OFX
   * - systemTransactions: Transaction[] → Cadastradas no sistema
   * 
   * RETORNO:
   * ReconciliationResult → Resultado completo
   * 
   * COMO FUNCIONA:
   * 1. Para cada transação bancária...
   * 2. ...procura correspondente no sistema
   * 3. Calcula score de confiança
   * 4. Classifica em categorias
   * 5. Retorna resultado
   */
  reconcile(
    bankTransactions: ImportedTransaction[],
    systemTransactions: Transaction[]
  ): ReconciliationResult {
    const conciliated: MatchSuggestion[] = [];
    const pendingBank: MatchSuggestion[] = [];
    const pendingSystem: MatchSuggestion[] = [];
    const divergent: MatchSuggestion[] = [];
    
    // Track quais do sistema já foram usadas
    const usedSystemIds = new Set<string>();
    
    // 1. Processa cada transação bancária
    for (const bankTx of bankTransactions) {
      // Procura melhor match no sistema
      const bestMatch = this.findBestMatch(bankTx, systemTransactions, usedSystemIds);
      
      if (bestMatch && bestMatch.confidenceScore >= this.CONFIDENCE_THRESHOLD) {
        // Achou correspondente!
        
        // Marca como usada
        if (bestMatch.systemTransaction) {
          usedSystemIds.add(bestMatch.systemTransaction.id);
        }
        
        // Verifica se tem divergência
        if (bestMatch.hasDivergence) {
          divergent.push(bestMatch);
        } else {
          conciliated.push(bestMatch);
        }
        
      } else {
        // Não achou correspondente
        pendingBank.push({
          bankTransaction: bankTx,
          systemTransaction: undefined,
          confidenceScore: 0,
          matchReasons: [],
          hasDivergence: false,
        });
      }
    }
    
    // 2. Transações do sistema sem par no banco
    const unmatchedSystem = systemTransactions.filter(t => !usedSystemIds.has(t.id));
    
    for (const sysTx of unmatchedSystem) {
      pendingSystem.push({
        bankTransaction: null as any,
        systemTransaction: sysTx,
        confidenceScore: 0,
        matchReasons: [],
        hasDivergence: false,
      });
    }
    
    // 3. Calcula taxa de sucesso
    const totalBank = bankTransactions.length;
    const conciliationRate = totalBank > 0 ? (conciliated.length / totalBank) * 100 : 0;
    
    // 4. Retorna resultado
    return {
      conciliated,
      pendingBank,
      pendingSystem,
      divergent,
      totalBankTransactions: totalBank,
      totalSystemTransactions: systemTransactions.length,
      conciliationRate,
    };
  }

  /**
   * ENCONTRAR MELHOR CORRESPONDÊNCIA
   * ---------------------------------
   * 
   * O QUE FAZ?
   * Procura transação do sistema que mais combina com a do banco
   * 
   * PARÂMETROS:
   * - bankTx: ImportedTransaction
   * - systemTransactions: Transaction[]
   * - usedIds: Set<string> → IDs já utilizadas
   * 
   * RETORNO:
   * MatchSuggestion | undefined
   */
  private findBestMatch(
    bankTx: ImportedTransaction,
    systemTransactions: Transaction[],
    usedIds: Set<string>
  ): MatchSuggestion | undefined {
    let bestMatch: MatchSuggestion | undefined;
    let bestScore = 0;
    
    // Filtra não utilizadas
    const available = systemTransactions.filter(t => !usedIds.has(t.id));
    
    // Para cada transação do sistema
    for (const sysTx of available) {
      // Calcula score
      const score = this.calculateMatchScore(bankTx, sysTx);
      
      // É melhor que o atual?
      if (score > bestScore && score >= this.CONFIDENCE_THRESHOLD) {
        bestScore = score;
        
        // Cria sugestão
        bestMatch = this.createMatchSuggestion(bankTx, sysTx, score);
      }
    }
    
    return bestMatch;
  }

  /**
   * CALCULAR SCORE DE CORRESPONDÊNCIA
   * ----------------------------------
   * 
   * O QUE FAZ?
   * Calcula quanto duas transações se parecem (0-100)
   * 
   * FÓRMULA:
   * score = (valorMatch × 50) + (dataMatch × 30) + (descMatch × 20)
   * 
   * PARÂMETROS:
   * - bankTx: ImportedTransaction
   * - sysTx: Transaction
   * 
   * RETORNO:
   * number → 0 a 100
   */
  private calculateMatchScore(bankTx: ImportedTransaction, sysTx: Transaction): number {
    // 1. Match de valor (50 pontos)
    const valueMatch = this.matchValue(bankTx.amount, sysTx.amount);
    
    // 2. Match de data (30 pontos)
    const dateMatch = this.matchDate(bankTx.date, sysTx.date);
    
    // 3. Match de descrição (20 pontos)
    const descMatch = this.matchDescription(bankTx.name, sysTx.descricao || sysTx.description);
    
    // 4. Calcula score total
    const score = (valueMatch * this.VALUE_WEIGHT * 100) +
                  (dateMatch * this.DATE_WEIGHT * 100) +
                  (descMatch * this.DESC_WEIGHT * 100);
    
    return Math.round(score);
  }

  /**
   * MATCH DE VALOR
   * --------------
   * 
   * O QUE FAZ?
   * Compara valores (1 se igual, 0 se muito diferente)
   * 
   * PARÂMETROS:
   * - bankAmount: number
   * - sysAmount: number
   * 
   * RETORNO:
   * number → 0 a 1
   */
  private matchValue(bankAmount: number, sysAmount: number): number {
    // Valores absolutos
    const bankAbs = Math.abs(bankAmount);
    const sysAbs = Math.abs(sysAmount);
    
    // Diferença
    const diff = Math.abs(bankAbs - sysAbs);
    
    // Se igual (diferença < 0.01)
    if (diff < 0.01) {
      return 1;
    }
    
    // Se diferença pequena (até 5%)
    const percentDiff = diff / Math.max(bankAbs, sysAbs);
    
    if (percentDiff < 0.05) {
      return 0.8;  // 80% similar
    }
    
    if (percentDiff < 0.10) {
      return 0.5;  // 50% similar
    }
    
    return 0;  // Muito diferente
  }

  /**
   * MATCH DE DATA
   * -------------
   * 
   * O QUE FAZ?
   * Compara datas (1 se igual, 0 se muito distante)
   * 
   * PARÂMETROS:
   * - bankDate: string
   * - sysDate: string
   * 
   * RETORNO:
   * number → 0 a 1
   */
  private matchDate(bankDate: string, sysDate: string): number {
    const d1 = new Date(bankDate);
    const d2 = new Date(sysDate);
    
    // Diferença em dias
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Igual
    if (diffDays === 0) {
      return 1;
    }
    
    // Até 2 dias
    if (diffDays <= 2) {
      return 0.9;
    }
    
    // Até 5 dias
    if (diffDays <= this.MAX_DATE_DIFF) {
      return 0.7;
    }
    
    // Mais que 5 dias
    return 0.3;
  }

  /**
   * MATCH DE DESCRIÇÃO
   * ------------------
   * 
   * O QUE FAZ?
   * Compara similaridade de textos
   * 
   * PARÂMETROS:
   * - bankDesc: string
   * - sysDesc: string
   * 
   * RETORNO:
   * number → 0 a 1
   */
  private matchDescription(bankDesc: string, sysDesc: string): number {
    // Normaliza textos
    const b1 = bankDesc.toLowerCase().trim();
    const s1 = sysDesc.toLowerCase().trim();
    
    // Igual
    if (b1 === s1) {
      return 1;
    }
    
    // Um contém o outro
    if (b1.includes(s1) || s1.includes(b1)) {
      return 0.8;
    }
    
    // Compartilha palavras-chave
    const wordsB = b1.split(/\s+/);
    const wordsS = s1.split(/\s+/);
    
    const commonWords = wordsB.filter(w => wordsS.includes(w));
    
    if (commonWords.length >= 2) {
      return 0.6;
    }
    
    return 0.3;
  }

  /**
   * CRIAR SUGESTÃO DE MATCH
   * -----------------------
   * 
   * O QUE FAZ?
   * Monta objeto de sugestão com detalhes
   */
  private createMatchSuggestion(
    bankTx: ImportedTransaction,
    sysTx: Transaction,
    score: number
  ): MatchSuggestion {
    const reasons: string[] = [];
    let hasDivergence = false;
    let divergenceDetails: string | undefined;
    
    // Motivos do match
    if (Math.abs(Math.abs(bankTx.amount) - sysTx.amount) < 0.01) {
      reasons.push('✓ Valores iguais');
    } else {
      reasons.push(`⚠ Valores diferentes: Banco R$ ${Math.abs(bankTx.amount)} vs Sistema R$ ${sysTx.amount}`);
      hasDivergence = true;
      divergenceDetails = 'Diferença de valores';
    }
    
    const diffDays = Math.abs(new Date(bankTx.date).getTime() - new Date(sysTx.date).getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 2) {
      reasons.push('✓ Datas próximas');
    } else {
      reasons.push(`⚠ Datas diferentes: ${bankTx.date} vs ${sysTx.date}`);
    }
    
    return {
      bankTransaction: bankTx,
      systemTransaction: sysTx,
      confidenceScore: score,
      matchReasons: reasons,
      hasDivergence,
      divergenceDetails,
    };
  }

  /**
   * CONCILIAR MANUALMENTE
   * ---------------------
   * 
   * O QUE FAZ?
   * Força conciliação entre duas transações específicas
   * 
   * PARÂMETROS:
   * - bankTx: ImportedTransaction
   * - sysTx: Transaction
   * 
   * RETORNO:
   * MatchSuggestion
   */
  manualReconcile(bankTx: ImportedTransaction, sysTx: Transaction): MatchSuggestion {
    return {
      bankTransaction: bankTx,
      systemTransaction: sysTx,
      confidenceScore: 100,  // Forçado
      matchReasons: ['Conciliação manual'],
      hasDivergence: false,
    };
  }

  /**
   * MARCAR COMO NÃO CONCILIÁVEL
   * ---------------------------
   * 
   * O QUE FAZ?
   * Marca transação como não tendo par
   * 
   * PARÂMETRO:
   * - bankTx: ImportedTransaction
   * 
   * RETORNO:
   * MatchSuggestion
   */
  markAsUnmatchable(bankTx: ImportedTransaction): MatchSuggestion {
    return {
      bankTransaction: bankTx,
      systemTransaction: undefined,
      confidenceScore: 0,
      matchReasons: ['Sem correspondência no sistema'],
      hasDivergence: false,
    };
  }
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 */
export const reconciliationEngine = new ReconciliationEngine();
export const motorConciliacao = reconciliationEngine;
