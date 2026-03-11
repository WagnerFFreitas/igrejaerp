/**
 * ============================================================================
 * PARSER DE ARQUIVOS OFX (Open Financial Exchange)
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este utilitário lê e interpreta arquivos OFX, que é o formato padrão
 * usado pelos bancos brasileiros para exportar extratos.
 * 
 * FORMATO OFX:
 * ------------
 * É um arquivo texto com tags similares a XML, mas mais simples:
 * 
 * <OFX>
 *   <SIGNONMSGSRSV1>
 *     <SONRS>
 *       <STATUS>
 *         <CODE>0</CODE>
 *         <SEVERITY>INFO</SEVERITY>
 *       </STATUS>
 *     </SONRS>
 *   </SIGNONMSGSRSV1>
 *   <BANKMSGSRSV1>
 *     <STMTTRNRS>
 *       <STMTRS>
 *         <CURDEF>BRL</CURDEF>
 *         <BANKACCTFROM>
 *           <BANKID>237</BANKID>
 *           <ACCTID>123456-7</ACCTID>
 *         </BANKACCTFROM>
 *         <BANKTRANLIST>
 *           <DTSTART>20240101</DTSTART>
 *           <DTEND>20240131</DTEND>
 *           <STMTTRN>
 *             <TRNTYPE>CREDIT</TRNTYPE>
 *             <DTPOSTED>20240115120000</DTPOSTED>
 *             <TRNAMT>1500.00</TRNAMT>
 *             <FITID>ABC123456</FITID>
 *             <NAME>DIZIMO JOAO SILVA</NAME>
 *             <MEMBEREMARK>PAGAMENTO RECEBIDO</MEMBEREMARK>
 *           </STMTTRN>
 *         </BANKTRANLIST>
 *       </STMTRS>
 *     </STMTTRNRS>
 *   </BANKMSGSRSV1>
 * </OFX>
 * 
 * ANALOGIA:
 * ---------
 * Pense como um "tradutor" que converte idioma do banco (OFX)
 * para idioma do sistema (JavaScript objects).
 */

import { Transaction } from '../types';

/**
 * TRANSAÇÃO IMPORTADA DO BANCO
 * ============================
 * Dados crus vindos do extrato OFX
 */
export interface ImportedTransaction {
  fitId: string;           // ID único da transação no banco
  type: 'CREDIT' | 'DEBIT'; // Tipo: crédito ou débito
  amount: number;          // Valor
  date: string;            // Data da transação
  name: string;            // Nome/beneficiário
  memo?: string;           // Observações/memo
  checkNumber?: string;    // Número do cheque (se tiver)
}

/**
 * EXTRATO BANCÁRIO IMPORTADO
 * ==========================
 * Conjunto de transações de um período
 */
export interface BankStatement {
  bankId: string;              // Código do banco (ex: 237 = Bradesco)
  accountNumber: string;       // Número da conta
  startDate: string;           // Início do período
  endDate: string;             // Fim do período
  transactions: ImportedTransaction[];
  currency: string;            // Moeda (ex: BRL)
}

/**
 * RESULTADO DA IMPORTAÇÃO
 * =======================
 * Sucesso ou erro ao processar OFX
 */
export interface OFXImportResult {
  success: boolean;
  data?: BankStatement;
  error?: string;
  warnings?: string[];
}

/**
 * FUNÇÃO PRINCIPAL: PARSE DE OFX
 * ==============================
 * 
 * O QUE FAZ?
 * Lê conteúdo de arquivo OFX e extrai dados estruturados
 * 
 * PARÂMETRO:
 * - ofxContent: string → Conteúdo bruto do arquivo OFX
 * 
 * RETORNO:
 * OFXImportResult → Dados extraídos ou erro
 * 
 * COMO FUNCIONA:
 * 1. Valida se é OFX válido
 * 2. Extrai informações da conta
 * 3. Extrai lista de transações
 * 4. Converte datas e valores
 * 5. Retorna objeto estruturado
 */
export function parseOFX(ofxContent: string): OFXImportResult {
  try {
    const warnings: string[] = [];
    
    // 1. Validação básica
    if (!ofxContent.includes('<OFX>')) {
      return {
        success: false,
        error: 'Arquivo não parece ser OFX (não contém tag <OFX>)',
      };
    }
    
    // 2. Normaliza conteúdo (remove quebras de linha estranhas)
    const normalized = normalizeOFXContent(ofxContent);
    
    // 3. Extrai informações do banco
    const bankId = extractTagValue(normalized, 'BANKID') || '000';
    const accountNumber = extractTagValue(normalized, 'ACCTID') || '';
    const currency = extractTagValue(normalized, 'CURDEF') || 'BRL';
    
    // 4. Extrai período
    const dtStart = extractTagValue(normalized, 'DTSTART');
    const dtEnd = extractTagValue(normalized, 'DTEND');
    
    // 5. Extrai transações
    const transactions = extractTransactions(normalized);
    
    if (transactions.length === 0) {
      warnings.push('Nenhuma transação encontrada no extrato');
    }
    
    // 6. Monta resultado
    return {
      success: true,
      data: {
        bankId,
        accountNumber,
        startDate: formatOFXDate(dtStart),
        endDate: formatOFXDate(dtEnd),
        transactions,
        currency,
      },
      warnings: warnings.length > 0 ? warnings : undefined,
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: `Erro ao processar OFX: ${error.message}`,
    };
  }
}

/**
 * NORMALIZAR CONTEÚDO OFX
 * -----------------------
 * 
 * O QUE FAZ?
 * Remove formatação estranha e deixa tudo em uma linha só
 * 
 * POR QUÊ?
 * Alguns bancos geram OFX com quebras de linha no meio das tags
 */
function normalizeOFXContent(content: string): string {
  // Remove caracteres especiais e normaliza espaços
  let normalized = content.replace(/\r\n/g, '\n');
  normalized = normalized.replace(/\r/g, '\n');
  
  // Remove espaços extras
  normalized = normalized.trim();
  
  return normalized;
}

/**
 * EXTRAIR VALOR DE UMA TAG
 * ------------------------
 * 
 * O QUE FAZ?
 * Busca valor entre tags específicas
 * 
 * EXEMPLO:
 * Extrair valor de <BANKID>237</BANKID> → retorna "237"
 * 
 * COMO:
 * Usa regex para encontrar padrão <TAG>valor</TAG>
 */
function extractTagValue(content: string, tagName: string): string {
  // Regex: procura por <TAG>qualquer coisa</TAG>
  const regex = new RegExp(`<${tagName}>([^<]+)</${tagName}>`, 'i');
  const match = content.match(regex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return '';
}

/**
 * EXTRAIR TODAS AS TRANSAÇÕES
 * ---------------------------
 * 
 * O QUE FAZ?
 * Localiza todas as transações dentro do OFX
 * 
 * ESTRUTURA:
 * Cada transação está dentro de <STMTTRN>...</STMTTRN>
 * 
 * RETORNO:
 * Array de ImportedTransaction
 */
function extractTransactions(content: string): ImportedTransaction[] {
  const transactions: ImportedTransaction[] = [];
  
  // 1. Encontra todas as transações (cada <STMTTRN>)
  const transactionBlocks = content.split('<STMTTRN>');
  
  // Pula o primeiro (que é cabeçalho)
  for (let i = 1; i < transactionBlocks.length; i++) {
    const block = transactionBlocks[i];
    
    // Corta até o fechamento </STMTTRN>
    const endIndex = block.indexOf('</STMTTRN>');
    if (endIndex === -1) continue;
    
    const transactionBlock = block.substring(0, endIndex);
    
    // 2. Extrai campos da transação
    const trnType = extractTagValue(transactionBlock, 'TRNTYPE');
    const dtPosted = extractTagValue(transactionBlock, 'DTPOSTED');
    const trnAmount = extractTagValue(transactionBlock, 'TRNAMT');
    const fitId = extractTagValue(transactionBlock, 'FITID');
    const name = extractTagValue(transactionBlock, 'NAME');
    const memo = extractTagValue(transactionBlock, 'MEMO') || 
                 extractTagValue(transactionBlock, 'MEMBEREMARK');
    const checkNumber = extractTagValue(transactionBlock, 'CHECKNUM');
    
    // 3. Valida campos obrigatórios
    if (!trnAmount || !dtPosted) {
      continue;  // Pula transação inválida
    }
    
    // 4. Converte valores
    const amount = parseFloat(trnAmount.replace(',', '.'));
    const date = formatOFXDate(dtPosted);
    
    // 5. Adiciona na lista
    transactions.push({
      fitId: fitId || `GEN-${Date.now()}-${i}`,  // Gera ID se não tiver
      type: trnType.toUpperCase() === 'CREDIT' ? 'CREDIT' : 'DEBIT',
      amount: isNaN(amount) ? 0 : amount,
      date,
      name: name || 'Transação Bancária',
      memo,
      checkNumber,
    });
  }
  
  return transactions;
}

/**
 * FORMATAR DATA OFX PARA ISO
 * --------------------------
 * 
 * O QUE FAZ?
 * Converte data OFX (YYYYMMDDHHMMSS) para ISO (YYYY-MM-DD)
 * 
 * EXEMPLOS:
 * 20240115120000 → 2024-01-15
 * 20240115 → 2024-01-15
 * 
 * COMO:
 * Extrai ano, mês, dia e formata
 */
function formatOFXDate(ofxDate: string): string {
  if (!ofxDate) return '';
  
  // OFX pode vir como YYYYMMDD ou YYYYMMDDHHMMSS
  const year = ofxDate.substring(0, 4);
  const month = ofxDate.substring(4, 6);
  const day = ofxDate.substring(6, 8);
  
  // Valida
  if (!year || !month || !day) {
    return '';
  }
  
  // Retorna no formato ISO
  return `${year}-${month}-${day}`;
}

/**
 * CONVERTER TRANSAÇÃO IMPORTADA PARA TRANSACTION
 * ----------------------------------------------
 * 
 * O QUE FAZ?
 * Transforma ImportedTransaction em Transaction do sistema
 * 
 * PARÂMETROS:
 * - imported: ImportedTransaction → Dados do OFX
 * - accountId: string → Conta bancária no sistema
 * - unitId: string → Unidade/filial
 * 
 * RETORNO:
 * Partial<Transaction> → Pronto para salvar
 */
export function convertToTransaction(
  imported: ImportedTransaction,
  accountId: string,
  unitId: string
): Partial<Transaction> {
  return {
    unitId,
    accountId,
    description: imported.name || imported.memo || 'Transação Bancária',
    amount: Math.abs(imported.amount),  // Sempre positivo
    type: imported.type === 'CREDIT' ? 'INCOME' : 'EXPENSE',
    date: imported.date,
    competencyDate: imported.date,
    category: 'OTHER',
    costCenter: 'cc1',
    status: 'PAID',  // Transação bancária já ocorreu
    operationNature: 'nat4',  // Movimento financeiro
    paymentMethod: 'TRANSFER',
    isConciliated: false,  // Ainda não foi conciliada
    notes: imported.memo ? `Memo: ${imported.memo}` : undefined,
    externalId: imported.fitId,  // ID externo para conferência
  };
}

/**
 * DETECTAR DUPLICIDADES
 * ---------------------
 * 
 * O QUE FAZ?
 * Verifica se transação já existe no sistema
 * 
 * CRITÉRIOS:
 * - Mesmo FITID (ID do banco)
 * - OU mesma data + valor + descrição similar
 * 
 * PARÂMETROS:
 * - imported: ImportedTransaction
 * - existingTransactions: Transaction[]
 * 
 * RETORNO:
 * boolean → true se já existe
 */
export function isDuplicate(
  imported: ImportedTransaction,
  existingTransactions: Transaction[]
): boolean {
  // 1. Busca por FITID (mais preciso)
  const byFitId = existingTransactions.find(t => 
    (t as any).externalId === imported.fitId
  );
  
  if (byFitId) {
    return true;  // Já existe pelo ID
  }
  
  // 2. Busca por data + valor (menos preciso)
  const byDateAmount = existingTransactions.find(t => {
    const sameDate = t.date === imported.date;
    const sameAmount = Math.abs(t.amount - Math.abs(imported.amount)) < 0.01;
    
    return sameDate && sameAmount;
  });
  
  return !!byDateAmount;
}

/**
 * VALIDAR INTEGRIDADE DO OFX
 * --------------------------
 * 
 * O QUE FAZ?
 * Verifica se arquivo OFX está íntegro
 * 
 * VERIFICAÇÕES:
 * - Tags de abertura e fechamento
 * - Estrutura básica
 * - Campos obrigatórios
 * 
 * RETORNO:
 * { valid: boolean, errors: string[] }
 */
export function validateOFX(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 1. Verifica tag raiz
  if (!content.includes('<OFX>')) {
    errors.push('Falta tag de abertura <OFX>');
  }
  
  if (!content.includes('</OFX>')) {
    errors.push('Falta tag de fechamento </OFX>');
  }
  
  // 2. Verifica estrutura básica
  if (!content.includes('<BANKTRANLIST>')) {
    errors.push('Não encontrou lista de transações (<BANKTRANLIST>)');
  }
  
  // 3. Verifica transações
  const stmtTrnCount = (content.match(/<STMTTRN>/g) || []).length;
  if (stmtTrnCount === 0) {
    errors.push('Nenhuma transação encontrada');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
