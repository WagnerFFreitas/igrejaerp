/**
 * ============================================================================
 * UTILITÁRIOS FINANCEIROS - FUNÇÕES DE CÁLCULO
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este arquivo é como uma "calculadora especializada" que sabe fazer
 * contas financeiras. Ele tem funções para calcular:
 * 
 * • Juros por atraso no pagamento
 * • Multas percentuais
 * • Descontos
 * • Formatação de valores (R$)
 * • Cálculo de parcelas
 * 
 * POR QUE TER FUNÇÕES SEPARADAS?
 * --------------------------------
 * Cada função faz UMA coisa específica. Isso é bom porque:
 * 1. Fácil de testar (testa uma função de cada vez)
 * 2. Reutilizável (usa a mesma função em vários lugares)
 * 3. Fácil de consertar (se errar, sabe onde mexer)
 * 
 * DIFERENÇA ENTRE SERVICE E UTILS:
 * ----------------------------------
 * - Service (transactionService): Mexe com banco de dados
 * - Utils (este arquivo): Só faz cálculos, não salva nada
 */

// Importa os tipos do TypeScript para saber a estrutura dos dados
import { Transaction } from '../types';

/**
 * FORMATAR VALOR PARA MOEDA BRASILEIRA
 * =====================================
 * 
 * O QUE FAZ?
 * Transforma um número em formato de dinheiro brasileiro (R$)
 * 
 * EXEMPLOS:
 * formatCurrency(1000) → "R$ 1.000,00"
 * formatCurrency(50.5) → "R$ 50,50"
 * formatCurrency(-100) → "-R$ 100,00"
 * 
 * PARÂMETRO:
 * - value: number → Número para formatar (ex: 1000)
 * 
 * RETORNO:
 * - string → Texto formatado com R$, vírgula e pontos
 * 
 * COMO FUNCIONA?
 * toLocaleString() é uma função mágica do JavaScript que:
 * - Coloca o símbolo da moeda (BRL = Real)
 * - Ajusta casas decimais (2 dígitos)
 * - Põe ponto nos milhares e vírgula nos centavos
 */
export function formatCurrency(value: number): string {
  // Se for negativo, guarda o sinal
  const isNegative = value < 0;
  
  // Trabalha com valor absoluto (sem sinal)
  const absoluteValue = Math.abs(value);
  
  // Formata para Real Brasileiro
  const formatted = absoluteValue.toLocaleString('pt-BR', {
    style: 'currency',      // Usa formato de moeda
    currency: 'BRL',        // BRL = código do Real
    minimumFractionDigits: 2,  // Sempre mostra 2 casas decimais
  });
  
  // Se era negativo, adiciona o sinal menos na frente
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * FORMATAR DATA PARA PADRÃO BRASILEIRO
 * ====================================
 * 
 * O QUE FAZ?
 * Converte data do formato americano (YYYY-MM-DD) para brasileiro (DD/MM/YYYY)
 * 
 * EXEMPLOS:
 * formatDate('2024-03-15') → "15/03/2024"
 * formatDate(new Date()) → data de hoje formatada
 * 
 * PARÂMETRO:
 * - date: string | Date → Data para formatar
 *   Pode ser texto ("2024-03-15") ou objeto Date
 * 
 * RETORNO:
 * - string → Data no formato DD/MM/YYYY
 */
export function formatDate(date: string | Date): string {
  // Se for texto, converte para objeto Date
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Extrai dia, mês e ano
  const day = dateObj.getDate().toString().padStart(2, '0');   // Adiciona zero à esquerda se necessário
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Mês começa em 0!
  const year = dateObj.getFullYear();
  
  // Junta tudo no formato brasileiro
  return `${day}/${month}/${year}`;
}

/**
 * CALCULAR JUROS SIMPLES
 * ======================
 * 
 * O QUE FAZ?
 * Calcula juros simples (não compostos!) baseado em dias de atraso
 * 
 * FÓRMULA:
 * Juros = Valor × (Taxa / 100) × Dias
 * 
 * EXEMPLO:
 * Valor: R$ 1000
 * Taxa: 0.33% ao dia
 * Dias: 10
 * Resultado: 1000 × (0.33/100) × 10 = R$ 33,00
 * 
 * PARÂMETROS:
 * - valor: number → Valor original (ex: 1000)
 * - taxaDiariaPercentual: number → Porcentagem ao dia (ex: 0.33)
 * - diasAtraso: number → Quantos dias atrasou
 * 
 * RETORNO:
 * - number → Valor dos juros calculados
 */
export function calcularJurosSimples(
  valor: number,
  taxaDiariaPercentual: number,
  diasAtraso: number
): number {
  // Regra: sem dias de atraso = sem juros
  if (diasAtraso <= 0) {
    return 0;
  }
  
  // Aplica fórmula: V × (T/100) × D
  const juros = valor * (taxaDiariaPercentual / 100) * diasAtraso;
  
  // Arredonda para 2 casas decimais (dinheiro!)
  return Math.round(juros * 100) / 100;
}

/**
 * CALCULAR MULTA PERCENTUAL
 * =========================
 * 
 * O QUE FAZ?
 * Calcula multa baseada em uma porcentagem fixa
 * 
 * FÓRMULA:
 * Multa = Valor × (Taxa / 100)
 * 
 * EXEMPLO:
 * Valor: R$ 1000
 * Taxa: 2%
 * Resultado: 1000 × (2/100) = R$ 20,00
 * 
 * PARÂMETROS:
 * - valor: number → Valor original
 * - taxaMultaPercentual: number → Porcentagem de multa (ex: 2)
 * 
 * RETORNO:
 * - number → Valor da multa
 */
export function calcularMulta(
  valor: number,
  taxaMultaPercentual: number
): number {
  // Fórmula simples: V × (T/100)
  const multa = valor * (taxaMultaPercentual / 100);
  
  // Arredonda para 2 casas decimais
  return Math.round(multa * 100) / 100;
}

/**
 * CALCULAR DESCONTO
 * =================
 * 
 * O QUE FAZ?
 * Calcula desconto percentual sobre um valor
 * 
 * FÓRMULA:
 * Desconto = Valor × (Taxa / 100)
 * Valor Final = Valor Original - Desconto
 * 
 * EXEMPLO:
 * Valor: R$ 1000
 * Desconto: 5%
 * Resultado: 1000 × (5/100) = R$ 50,00 de desconto
 * 
 * PARÂMETROS:
 * - valor: number → Valor original
 * - taxaDescontoPercentual: number → Porcentagem de desconto (ex: 5)
 * 
 * RETORNO:
 * Um objeto com:
 * - valorDesconto: quanto foi descontado
 * - valorFinal: quanto fica depois do desconto
 */
export function calcularDesconto(
  valor: number,
  taxaDescontoPercentual: number
): { valorDesconto: number; valorFinal: number } {
  // Calcula valor do desconto
  const valorDesconto = valor * (taxaDescontoPercentual / 100);
  
  // Subtrai desconto do valor original
  const valorFinal = valor - valorDesconto;
  
  // Retorna ambos valores
  return {
    valorDesconto: Math.round(valorDesconto * 100) / 100,
    valorFinal: Math.round(valorFinal * 100) / 100,
  };
}

/**
 * CALCULAR DIAS DE ATRASO
 * =======================
 * 
 * O QUE FAZ?
 * Conta quantos dias se passaram entre duas datas
 * 
 * EXEMPLO:
 * Data 1: 01/03/2024 (vencimento)
 * Data 2: 11/03/2024 (pagamento)
 * Resultado: 10 dias de atraso
 * 
 * PARÂMETROS:
 * - dataVencimento: string | Date → Quando deveria ter pago
 * - dataPagamento: string | Date → Quando está pagando (ou hoje)
 * 
 * RETORNO:
 * - number → Dias de atraso (0 se ainda não venceu)
 * 
 * DETALHE:
 * Math.ceil() arredonda para cima
 * Ex: 9.1 dias → 10 dias (considera dia incompleto como completo)
 */
export function calcularDiasAtraso(
  dataVencimento: string | Date,
  dataPagamento: string | Date = new Date()
): number {
  // Converte tudo para objeto Date
  const vencimento = typeof dataVencimento === 'string' 
    ? new Date(dataVencimento) 
    : dataVencimento;
    
  const pagamento = typeof dataPagamento === 'string' 
    ? new Date(dataPagamento) 
    : dataPagamento;
  
  // Calcula diferença em milissegundos
  const diferencaMs = pagamento.getTime() - vencimento.getTime();
  
  // Converte milissegundos para dias
  // 1000ms × 60s × 60min × 24h = 86.400.000 ms por dia
  const diasAtraso = diferencaMs / (1000 * 60 * 60 * 24);
  
  // Arredonda para cima e garante mínimo de 0
  return Math.max(0, Math.ceil(diasAtraso));
}

/**
 * VERIFICAR SE DATA JÁ PASSOU
 * ===========================
 * 
 * O QUE FAZ?
 * Descobre se uma data já aconteceu (é passada)
 * 
 * EXEMPLOS:
 * isDataPassada('2020-01-01') → true (já passou)
 * isDataPassada('2030-01-01') → false (ainda não)
 * 
 * PARÂMETRO:
 * - data: string | Date → Data para verificar
 * 
 * RETORNO:
 * - boolean → true se já passou, false se ainda não
 */
export function isDataPassada(data: string | Date): boolean {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  const hoje = new Date();
  
  // Compara: data é menor que hoje?
  return dataObj < hoje;
}

/**
 * SOMAR MESES A UMA DATA
 * ======================
 * 
 * O QUE FAZ?
 * Adiciona meses a uma data (útil para parcelas!)
 * 
 * EXEMPLO:
 * somarMeses('15/03/2024', 3) → "15/06/2024" (3 meses depois)
 * 
 * PARÂMETROS:
 * - data: string | Date → Data base
 * - meses: number → Quantos meses adicionar
 * 
 * RETORNO:
 * - Date → Nova data com meses somados
 * 
 * CUIDADO!
 * JavaScript lida estranhamente com datas tipo "31/01 + 1 mês"
 * (janeiro tem 31 dias, fevereiro não)
 * Esta função trata isso automaticamente
 */
export function somarMeses(data: string | Date, meses: number): Date {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  // Cria nova data copiando a original
  const novaData = new Date(dataObj);
  
  // Adiciona meses
  // getMonth() retorna 0-11, então somamos diretamente
  novaData.setMonth(novaData.getMonth() + meses);
  
  return novaData;
}

/**
 * DIVIDIR VALOR EM PARCELAS
 * =========================
 * 
 * O QUE FAZ?
 * Divide um valor total em N parcelas iguais
 * 
 * EXEMPLO:
 * dividirEmParcelas(1000, 3) → [333.33, 333.33, 333.34]
 * Note que a última parcela leva os centavos restantes
 * 
 * PARÂMETROS:
 * - valorTotal: number → Valor para dividir
 * - numeroParcelas: number → Em quantas vezes
 * 
 * RETORNO:
 * - number[] → Array com valor de cada parcela
 * 
 * DETALHE IMPORTANTE:
 * Para evitar perder centavos no arredondamento,
 * calculamos todas as parcelas iguais e jogamos
 * a diferença para a última parcela
 */
export function dividirEmParcelas(
  valorTotal: number,
  numeroParcelas: number
): number[] {
  // Valor básico de cada parcela (pode ter dízima)
  const valorBaseParcela = valorTotal / numeroParcelas;
  
  // Array para guardar as parcelas
  const parcelas: number[] = [];
  
  // Cria N-1 parcelas com valor arredondado
  for (let i = 0; i < numeroParcelas - 1; i++) {
    parcelas.push(Math.round(valorBaseParcela * 100) / 100);
  }
  
  // Última parcela recebe o restante
  // Isso evita perder centavos no arredondamento
  const somaDasParcelas = parcelas.reduce((acc, val) => acc + val, 0);
  const ultimaParcela = valorTotal - somaDasParcelas;
  parcelas.push(Math.round(ultimaParcela * 100) / 100);
  
  return parcelas;
}

/**
 * CALCULAR VALOR TOTAL COM JUROS E MULTA
 * ======================================
 * 
 * O QUE FAZ?
 * Soma valor original + juros + multa
 * 
 * FÓRMULA:
 * Total = Valor + (Valor × taxaJuros × dias) + (Valor × taxaMulta)
 * 
 * EXEMPLO:
 * Valor: R$ 1000
 * Juros: 0.33%/dia por 10 dias = R$ 33
 * Multa: 2% = R$ 20
 * Total: R$ 1053
 * 
 * PARÂMETROS:
 * - valorOriginal: number
 * - taxaJurosDiaria: number (porcentagem)
 * - diasAtraso: number
 * - taxaMulta: number (porcentagem)
 * 
 * RETORNO:
 * Objeto com detalhamento completo:
 * - valorOriginal, juros, multa, total
 */
export function calcularTotalComEncargos(
  valorOriginal: number,
  taxaJurosDiaria: number,
  diasAtraso: number,
  taxaMulta: number
): {
  valorOriginal: number;
  juros: number;
  multa: number;
  total: number;
} {
  // Calcula juros usando função que já criamos
  const juros = calcularJurosSimples(valorOriginal, taxaJurosDiaria, diasAtraso);
  
  // Calcula multa usando função que já criamos
  const multa = calcularMulta(valorOriginal, taxaMulta);
  
  // Soma tudo
  const total = valorOriginal + juros + multa;
  
  // Retorna objeto com todos os valores
  return {
    valorOriginal: Math.round(valorOriginal * 100) / 100,
    juros: Math.round(juros * 100) / 100,
    multa: Math.round(multa * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * OBTER STATUS DA TRANSAÇÃO
 * =========================
 * 
 * O QUE FAZ?
 * Classifica transação como: PAGA, VENCIDA ou A_VENCER
 * 
 * LÓGICA:
 * 1. Se status já é 'PAID' → "PAGA"
 * 2. Se venceu (data passou) → "VENCIDA"
 * 3. Se não venceu ainda → "A_VENCER"
 * 
 * PARÂMETRO:
 * - transaction: Transaction → Transação para analisar
 * 
 * RETORNO:
 * - 'PAGA' | 'VENCIDA' | 'A_VENCER' → Status atual
 */
export function getStatusTransacao(transaction: Transaction): 'PAGA' | 'VENCIDA' | 'A_VENCER' {
  // Se já está paga no sistema
  if (transaction.status === 'PAID') {
    return 'PAGA';
  }
  
  // Verifica se data de vencimento já passou
  const hoje = new Date();
  const vencimento = new Date(transaction.dueDate || '');
  
  if (hoje > vencimento) {
    return 'VENCIDA';
  }
  
  // Se não está paga e não venceu
  return 'A_VENCER';
}

/**
 * FILTRAR TRANSAÇÕES POR PERÍODO
 * ==============================
 * 
 * O QUE FAZ?
 * Pega só transações de um período específico
 * 
 * EXEMPLO:
 * filtrarPorPeriodo(transactions, '2024-03-01', '2024-03-31')
 * → Retorna só transações de março de 2024
 * 
 * PARÂMETROS:
 * - transactions: Transaction[] → Lista de transações
 * - dataInicio: string → Primeiro dia do período
 * - dataFim: string → Último dia do período
 * 
 * RETORNO:
 * - Transaction[] → Transações dentro do período
 */
export function filtrarPorPeriodo(
  transactions: Transaction[],
  dataInicio: string,
  dataFim: string
): Transaction[] {
  // Converte datas para comparar
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  // Filtra transações
  return transactions.filter(t => {
    const dataTransacao = new Date(t.date || t.dueDate || '');
    
    // Está entre início e fim?
    return dataTransacao >= inicio && dataTransacao <= fim;
  });
}

/**
 * SOMAR VALORES DE UMA LISTA
 * ==========================
 * 
 * O QUE FAZ?
 * Soma todos os valores (amount) de uma lista de transações
 * 
 * EXEMPLO:
 * somarValores([t1, t2, t3]) → Soma amount de todas
 * 
 * PARÂMETRO:
 * - transactions: Transaction[] → Lista de transações
 * 
 * RETORNO:
 * - number → Soma total
 */
export function somarValores(transactions: Transaction[]): number {
  // reduce() é um método que "reduz" um array a um único valor
  // acc = acumulador, curr = item atual
  return transactions.reduce((acc, transaction) => {
    return acc + transaction.amount;
  }, 0); // Começa do zero
}
