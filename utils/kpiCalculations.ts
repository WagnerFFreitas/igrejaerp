/**
 * ============================================================================
 * UTILITÁRIOS DE CÁLCULO DE KPIs
 * ============================================================================
 * Fórmulas e cálculos para indicadores de desempenho
 * ============================================================================
 */

import { Transaction, Member, Payroll, Asset } from '../types';

/**
 * Calcular crescimento percentual
 */
export function calcularCrescimentoPercentual(valorAtual: number, valorAnterior: number): number {
  if (valorAnterior === 0) return 100;
  return ((valorAtual - valorAnterior) / valorAnterior) * 100;
}

/**
 * Calcular margem líquida
 */
export function calcularMargemLiquida(receitas: number, despesas: number): number {
  if (receitas === 0) return 0;
  return ((receitas - despesas) / receitas) * 100;
}

/**
 * Calcular ticket médio
 */
export function calcularTicketMedio(totalReceitas: number, quantidadeTransacoes: number): number {
  if (quantidadeTransacoes === 0) return 0;
  return totalReceitas / quantidadeTransacoes;
}

/**
 * Calcular taxa de inadimplência
 */
export function calcularTaxaInadimplencia(membrosInadimplentes: number, totalMembros: number): number {
  if (totalMembros === 0) return 0;
  return (membrosInadimplentes / totalMembros) * 100;
}

/**
 * Calcular turnover (rotatividade de funcionários)
 */
export function calcularTurnover(funcionariosDesligados: number, totalFuncionarios: number): number {
  if (totalFuncionarios === 0) return 0;
  return (funcionariosDesligados / totalFuncionarios) * 100;
}

/**
 * Calcular absenteísmo
 */
export function calcularAbsenteismo(diasFaltados: number, diasTrabalhadosPrevistos: number): number {
  if (diasTrabalhadosPrevistos === 0) return 0;
  return (diasFaltados / diasTrabalhadosPrevistos) * 100;
}

/**
 * Calcular depreciação do período
 */
export function calcularDepreciacaoPeriodo(valorOriginal: number, vidaUtilAnos: number, periodoMeses: number): number {
  const depreciacaoMensal = valorOriginal / (vidaUtilAnos * 12);
  return depreciacaoMensal * periodoMeses;
}

/**
 * Calcular valor patrimonial líquido
 */
export function calcularValorPatrimonialLiquido(assets: Asset[]): number {
  return assets.reduce((total, asset) => {
    const depreciacaoAcumulada = asset.accumulatedDepreciation || 0;
    return total + (asset.acquisitionValue - depreciacaoAcumulada);
  }, 0);
}

/**
 * Calcular saúde financeira (score 0-100)
 */
export function calcularSaudeFinanceira(
  receitas: number,
  despesas: number,
  reservas: number,
  dividas: number
): number {
  // Peso: 40% superávit, 30% reservas, 30% endividamento
  const scoreSuperavit = receitas > 0 ? Math.min(((receitas - despesas) / receitas) * 100, 100) : 0;
  const scoreReservas = Math.min((reservas / (despesas / 12)) * 100, 100); // Reservas para 12 meses = 100
  const scoreDividas = dividas > 0 ? Math.max(0, 100 - (dividas / receitas) * 100) : 100;

  const scoreFinal = (scoreSuperavit * 0.4) + (scoreReservas * 0.3) + (scoreDividas * 0.3);
  return Math.round(Math.max(0, Math.min(100, scoreFinal)));
}

/**
 * Calcular projeção de fluxo de caixa
 */
export function calcularProjecaoFluxoCaixa(
  saldoAtual: number,
  mediaEntradasDiarias: number,
  mediaSaidasDiarias: number,
  dias: number
): number[] {
  const projecao: number[] = [];
  let saldo = saldoAtual;

  for (let i = 0; i < dias; i++) {
    saldo += mediaEntradasDiarias - mediaSaidasDiarias;
    projecao.push(saldo);
  }

  return projecao;
}

/**
 * Calcular comparação Year-over-Year (YoY)
 */
export function calcularYoY(valorAnoAtual: number, valorAnoAnterior: number): {
  variacaoAbsoluta: number;
  variacaoPercentual: number;
  tendencia: 'crescendo' | 'decrescendo' | 'estavel';
} {
  const variacaoAbsoluta = valorAnoAtual - valorAnoAnterior;
  const variacaoPercentual = calcularCrescimentoPercentual(valorAnoAtual, valorAnoAnterior);
  
  let tendencia: 'crescendo' | 'decrescendo' | 'estavel' = 'estavel';
  if (variacaoPercentual > 5) tendencia = 'crescendo';
  else if (variacaoPercentual < -5) tendencia = 'decrescendo';

  return {
    variacaoAbsoluta,
    variacaoPercentual,
    tendencia
  };
}

/**
 * Agrupar transações por categoria
 */
export function agruparPorCategoria(transactions: Transaction[]): Record<string, number> {
  return transactions.reduce((acc, t) => {
    const category = t.category || 'Outros';
    acc[category] = (acc[category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calcular médias móveis (3 períodos)
 */
export function calcularMediaMovil(valores: number[], periodos = 3): number[] {
  const medias: number[] = [];
  
  for (let i = periodos - 1; i < valores.length; i++) {
    const soma = valores.slice(i - periodos + 1, i + 1).reduce((a, b) => a + b, 0);
    medias.push(soma / periodos);
  }

  return medias;
}

/**
 * Detectar tendência (alta/baixa)
 */
export function detectarTendencia(valores: number[]): 'alta' | 'baixa' | 'estavel' {
  if (valores.length < 2) return 'estavel';
  
  const ultimaMedia = valores.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const primeiraMedia = valores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  
  const variacao = ((ultimaMedia - primeiraMedia) / primeiraMedia) * 100;
  
  if (variacao > 5) return 'alta';
  if (variacao < -5) return 'baixa';
  return 'estavel';
}

/**
 * Calcular meta vs realizado
 */
export function calcularMetaVsRealizado(meta: number, realizado: number): {
  percentual: number;
  diferenca: number;
  status: 'acima' | 'na_meta' | 'abaixo';
} {
  const percentual = meta > 0 ? (realizado / meta) * 100 : 0;
  const diferenca = realizado - meta;
  
  let status: 'acima' | 'na_meta' | 'abaixo' = 'abaixo';
  if (percentual >= 95 && percentual <= 105) status = 'na_meta';
  else if (percentual > 105) status = 'acima';

  return {
    percentual,
    diferenca,
    status
  };
}
