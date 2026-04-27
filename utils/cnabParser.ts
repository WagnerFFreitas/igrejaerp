/**
 * ============================================================================
 * PARSER DE ARQUIVOS CNAB (Federação Brasileira de Bancos)
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este utilitário lê e interpreta arquivos CNAB, que é o formato padrão
 * usado pelos bancos brasileiros para troca de arquivos com empresas.
 * 
 * FORMATO CNAB:
 * -------------
 * É um arquivo de texto onde cada linha tem 240 caracteres (CNAB 240)
 * ou 400 caracteres (CNAB 400), com informações posicionais.
 * 
 * ESTRUTURA DO ARQUIVO:
 * - Linha 0: Header do arquivo
 * - Linhas 1-999: Detalhe (lançamentos)
 * - Última linha: Trailer do arquivo
 * 
 * EXEMPLO DE USO:
 * ---------------
 * const result = parseCNAB(content, '341'); // Banco Itaú
 * result.records.forEach(record => {
 *   console.log(record.documentNumber, record.amount);
 * });
 */

import { CNABFile, CNABRecord } from '../types';

/**
 * RESULTADO DO PROCESSAMENTO CNAB
 */
interface CNABParseResult {
  header: {
    bank: string;
    fileDate: string;
    company: string;
    recordsCount: number;
  };
  records: CNABRecord[];
  trailer: {
    totalAmount: number;
    recordsCount: number;
  };
  errors: string[];
}

/**
 * BANCOS SUPORTADOS
 */
const BANK_CODES = {
  '001': 'Banco do Brasil',
  '104': 'Caixa Econômica Federal',
  '237': 'Bradesco',
  '341': 'Itaú Unibanco',
  '033': 'Santander',
  '151': 'Sicredi',
  '748': 'Sicoob',
};

/**
 * ============================================================================
 * FUNÇÕES PRINCIPAIS DE PARSE
 * ============================================================================
 */

/**
 * Parse de arquivo CNAB completo
 * @param content - Conteúdo do arquivo CNAB (texto)
 * @param bankCode - Código do banco (ex: '341' para Itaú)
 * @returns Resultado do processamento
 */
export function parseCNAB(content: string, bankCode: string): CNABParseResult {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  const result: CNABParseResult = {
    header: { bank: bankCode, fileDate: '', company: '', recordsCount: 0 },
    records: [],
    trailer: { totalAmount: 0, recordsCount: 0 },
    errors: [],
  };

  if (lines.length < 2) {
    result.errors.push('Arquivo CNAB inválido: menos de 2 linhas');
    return result;
  }

  // Processa header (primeira linha)
  try {
    result.header = parseHeader(lines[0], bankCode);
  } catch (error) {
    result.errors.push(`Erro no header: ${(error as Error).message}`);
  }

  // Processa registros detalhe (linhas do meio)
  for (let i = 1; i < lines.length - 1; i++) {
    try {
      const record = parseDetailLine(lines[i], bankCode);
      if (record) {
        result.records.push(record);
      }
    } catch (error) {
      result.errors.push(`Erro na linha ${i + 1}: ${(error as Error).message}`);
    }
  }

  // Processa trailer (última linha)
  try {
    result.trailer = parseTrailer(lines[lines.length - 1], bankCode);
  } catch (error) {
    result.errors.push(`Erro no trailer: ${(error as Error).message}`);
  }

  return result;
}

/**
 * Valida se o arquivo CNAB está correto
 * @param content - Conteúdo do arquivo
 * @returns Objeto com validação e erros
 */
export function validateCNAB(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const lines = content.split('\n').filter(line => line.trim().length > 0);

  // Verifica quantidade mínima de linhas
  if (lines.length < 2) {
    errors.push('Arquivo deve ter pelo menos 2 linhas (header e trailer)');
  }

  // Verifica tamanho das linhas (CNAB 240 ou 400)
  const lineLength = lines[0]?.length || 0;
  if (lineLength !== 240 && lineLength !== 400) {
    errors.push(`Tamanho da linha inválido: ${lineLength} (esperado 240 ou 400)`);
  }

  // Verifica se todas as linhas têm o mesmo tamanho
  const inconsistentLines = lines.filter(line => line.length !== lineLength);
  if (inconsistentLines.length > 0) {
    errors.push(`${inconsistentLines.length} linhas com tamanho inconsistente`);
  }

  // Verifica código do banco no header
  const bankCode = lines[0]?.substring(0, 3);
  if (!bankCode || !BANK_CODES[bankCode as keyof typeof BANK_CODES]) {
    errors.push(`Código de banco inválido: ${bankCode}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Gera arquivo CNAB de remessa (envio para o banco)
 * @param transactions - Transações a enviar
 * @param bankCode - Código do banco
 * @param companyId - CNPJ da empresa
 * @returns Conteúdo do arquivo CNAB
 */
export function generateCNABRemessa(
  transactions: Array<{
    documentNumber: string;
    ourNumber: string;
    amount: number;
    dueDate: string;
    beneficiaryName: string;
    beneficiaryDocument: string;
  }>,
  bankCode: string,
  companyId: string
): string {
  const lines: string[] = [];

  // Header do arquivo
  lines.push(generateHeader(bankCode, companyId));

  // Registros detalhe
  transactions.forEach((trans, index) => {
    lines.push(generateDetailRecord(trans, bankCode, index + 1));
  });

  // Trailer do arquivo
  lines.push(generateTrailer(transactions.length, transactions.reduce((sum, t) => sum + t.amount, 0)));

  return lines.join('\n');
}

/**
 * ============================================================================
 * FUNÇÕES AUXILIARES DE PARSE (HEADER, DETALHE, TRAILER)
 * ============================================================================
 */

function parseHeader(line: string, bankCode: string): CNABParseResult['header'] {
  // Posições variam conforme o banco e layout
  // Exemplo genérico para CNAB 240
  
  return {
    bank: bankCode,
    fileDate: formatDateCNAB(line.substring(194, 202)), // Posição exemplo
    company: line.substring(73, 102)?.trim() || '',
    recordsCount: 0, // Será atualizado no trailer
  };
}

function parseDetailLine(line: string, bankCode: string): CNABRecord | null {
  const lineType = parseInt(line.substring(7, 8)) || 0;
  
  // Ignora linhas que não são detalhe (tipo 3 ou 7 dependendo do layout)
  if (lineType !== 3 && lineType !== 7) {
    return null;
  }

  const segmentCode = line.substring(13, 14);
  const movementCode = line.substring(15, 17);

  // Extrai valores monetários (posição varia por banco)
  const amount = parseCurrency(line.substring(81, 96)); // Exemplo

  return {
    id: crypto.randomUUID(),
    fileId: '', // Será preenchido depois
    lineType,
    segmentCode,
    movementCode,
    ourNumber: line.substring(37, 57)?.trim(),
    documentNumber: line.substring(58, 78)?.trim(),
    amount,
    dates: {
      dueDate: formatDateCNAB(line.substring(73, 81)),
      processingDate: formatDateCNAB(line.substring(175, 183)),
      paymentDate: formatDateCNAB(line.substring(193, 201)),
    },
    beneficiary: {
      name: line.substring(133, 172)?.trim() || '',
      document: line.substring(123, 133)?.trim() || '',
      account: line.substring(38, 50)?.trim() || '',
      agency: line.substring(23, 27)?.trim() || '',
    },
    payer: {
      name: line.substring(238, 240)?.trim() || '', // Posição aproximada
      document: '',
    },
    rawLine: line,
  };
}

function parseTrailer(line: string, bankCode: string): CNABParseResult['trailer'] {
  // Extrai totais do trailer
  const totalAmount = parseCurrency(line.substring(81, 96)); // Exemplo
  const recordsCount = parseInt(line.substring(17, 25)) || 0;

  return {
    totalAmount,
    recordsCount,
  };
}

/**
 * ============================================================================
 * FUNÇÕES DE GERAÇÃO DE LINHAS CNAB
 * ============================================================================
 */

function generateHeader(bankCode: string, companyId: string): string {
  const line = ' '.repeat(240);
  
  return (
    bankCode.padEnd(3, ' ') +           // 0-3: Código do banco
    '0'.padEnd(4, ' ') +                  // 3-7: Lote de serviço (0 para header)
    '0'.padEnd(1, ' ') +                  // 7-8: Tipo de registro (0 para header)
    ' '.repeat(9) +                       // 8-17: Uso exclusivo FEBRABAN
    '2'.padEnd(1, ' ') +                  // 17-18: Tipo de inscrição (2=CNPJ)
    companyId.padEnd(14, ' ') +           // 18-32: Número de inscrição
    ' '.repeat(20) +                      // 32-52: Convênio líder
    ' '.repeat(20) +                      // 52-72: Uso exclusivo FEBRABAN
    ' '.repeat(30) +                      // 72-102: Nome da empresa
    ' '.repeat(30) +                      // 102-132: Nome do banco
    ' '.repeat(10) +                      // 132-142: Uso exclusivo FEBRABAN
    '1'.padEnd(1, ' ') +                  // 142-143: Código remessa
    new Date().toISOString().slice(0, 10).replace(/-/g, '').padEnd(8, ' ') + // 143-151: Data geração
    ' '.repeat(6) +                       // 151-157: Uso exclusivo FEBRABAN
    ' '.repeat(32) +                      // 157-189: Número sequência
    ' '.repeat(53) +                      // 189-242: Uso exclusivo FEBRABAN
    '000001'.padEnd(6, '0')               // 242-248: Número sequência arquivo
  ).substring(0, 240);
}

function generateDetailRecord(
  transaction: {
    documentNumber: string;
    ourNumber: string;
    amount: number;
    dueDate: string;
    beneficiaryName: string;
    beneficiaryDocument: string;
  },
  bankCode: string,
  recordNumber: number
): string {
  const line = ' '.repeat(240);
  
  return (
    bankCode.padEnd(3, ' ') +            // 0-3: Código do banco
    '0001'.padEnd(4, '0') +              // 3-7: Lote de serviço
    '3'.padEnd(1, '0') +                 // 7-8: Tipo de registro (3 para detalhe)
    String(recordNumber).padStart(5, '0') + // 8-13: Nº sequencial
    ' '.repeat(7) +                      // 13-20: Uso exclusivo
    '2'.padEnd(1, '0') +                 // 20-21: Tipo de inscrição
    transaction.beneficiaryDocument.padEnd(14, ' ') + // 21-35: CNPJ
    ' '.repeat(20) +                     // 35-55: Convênio
    ' '.repeat(20) +                     // 55-75: Nosso número
    ' '.repeat(3) +                      // 75-78: Carteira
    transaction.documentNumber.padEnd(15, ' ') + // 78-93: Seu número
    ' '.repeat(8) +                      // 93-101: Vencimento
    formatCurrencyCNAB(transaction.amount).padEnd(15, '0') + // 101-116: Valor
    ' '.repeat(25) +                     // 116-141: Uso exclusivo
    transaction.beneficiaryName.padEnd(40, ' ') + // 141-181: Nome sacado
    ' '.repeat(40) +                     // 181-221: Uso exclusivo
    ' '.repeat(10) +                     // 221-231: Uso exclusivo
    '000001'.padEnd(6, '0')              // 231-237: Nº sequencial
  ).substring(0, 240);
}

function generateTrailer(totalRecords: number, totalAmount: number): string {
  const line = ' '.repeat(240);
  
  return (
    '001'.padEnd(3, ' ') +               // 0-3: Código do banco
    '9999'.padEnd(4, '0') +              // 3-7: Lote de serviço (9999 para trailer)
    '9'.padEnd(1, '0') +                 // 7-8: Tipo de registro (9 para trailer)
    ' '.repeat(9) +                      // 8-17: Uso exclusivo
    String(totalRecords).padStart(6, '0') + // 17-23: Quantidade registros
    formatCurrencyCNAB(totalAmount).padEnd(24, '0') + // 23-47: Soma valores
    ' '.repeat(189)                      // 47-236: Uso exclusivo
  ).substring(0, 240);
}

/**
 * ============================================================================
 * UTILITÁRIOS DE FORMATAÇÃO
 * ============================================================================
 */

/**
 * Formata data no padrão CNAB (AAAAMMDD)
 */
function formatDateCNAB(dateStr: string): string {
  if (!dateStr || dateStr.trim().length === 0) return '';
  
  // Remove caracteres não numéricos
  const clean = dateStr.replace(/\D/g, '');
  
  if (clean.length === 8) {
    // AAAAMMDD → DD/MM/AAAA
    return `${clean.slice(6, 8)}/${clean.slice(4, 6)}/${clean.slice(0, 4)}`;
  } else if (clean.length === 6) {
    // AAMMDD → DD/MM/AA
    return `${clean.slice(4, 6)}/${clean.slice(2, 4)}/${clean.slice(0, 2)}`;
  }
  
  return dateStr;
}

/**
 * Parse de valor monetário CNAB (sem vírgula, com zeros à esquerda)
 */
function parseCurrency(value: string): number {
  const clean = value.replace(/\D/g, '');
  const numericValue = parseFloat(clean) / 100; // Divide por 100 para converter centavos
  return isNaN(numericValue) ? 0 : numericValue;
}

/**
 * Formata valor monetário para CNAB (multiplica por 100, sem vírgula)
 */
function formatCurrencyCNAB(value: number): string {
  const cents = Math.round(value * 100);
  return String(cents).padStart(13, '0');
}
