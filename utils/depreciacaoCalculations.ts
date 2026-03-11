/**
 * ============================================================================
 * CÁLCULOS DE DEPRECIAÇÃO DE ATIVOS
 * ============================================================================
 * Funções para cálculo de depreciação de bens patrimoniais
 * Métodos: Linear e Acelerada
 * ============================================================================
 */

import { Asset, AssetDepreciation } from '../types';

/**
 * Dados retornados pelos cálculos de depreciação
 */
export interface DepreciationData {
  depreciationExpense: number;       // Valor da depreciação no período
  accumulatedDepreciation: number;   // Depreciação acumulada
  bookValue: number;                 // Valor contábil atual
  remainingLife: number;             // Vida útil restante (meses)
  depreciationRate: number;          // Taxa aplicada
}

/**
 * Calcular depreciação pelo método linear
 * Fórmula: (Valor de Aquisição - Valor Residual) / Vida Útil
 * 
 * @param valorBem - Valor de aquisição do bem
 * @param vidaUtilMeses - Vida útil em meses
 * @param mesesDecorridos - Meses já decorridos desde a aquisição
 * @param valorResidual - Valor residual (opcional, padrão 0)
 * @returns Dados da depreciação calculada
 */
export function calcularDepreciacaoLinear(
  valorBem: number,
  vidaUtilMeses: number,
  mesesDecorridos: number,
  valorResidual: number = 0
): DepreciationData {
  // Validações básicas
  if (valorBem <= 0 || vidaUtilMeses <= 0) {
    return {
      depreciationExpense: 0,
      accumulatedDepreciation: 0,
      bookValue: valorBem,
      remainingLife: vidaUtilMeses,
      depreciationRate: 0,
    };
  }

  // Calcular taxa mensal de depreciação
  const taxaMensal = 1 / vidaUtilMeses;
  
  // Calcular valor depreciável (valor do bem - valor residual)
  const valorDepreciavel = valorBem - valorResidual;
  
  // Calcular depreciação mensal
  const depreciacaoMensal = valorDepreciavel * taxaMensal;
  
  // Calcular depreciação acumulada até o momento
  const mesesParaCalcular = Math.min(mesesDecorridos, vidaUtilMeses);
  const depreciacaoAcumulada = depreciacaoMensal * mesesParaCalcular;
  
  // Calcular valor contábil atual
  const valorContabil = valorBem - depreciacaoAcumulada;
  
  // Calcular vida útil restante
  const vidaUtilRestante = Math.max(0, vidaUtilMeses - mesesDecorridos);
  
  return {
    depreciationExpense: depreciacaoMensal,
    accumulatedDepreciation: depreciacaoAcumulada,
    bookValue: Math.max(valorResidual, valorContabil),
    remainingLife: vidaUtilRestante,
    depreciationRate: taxaMensal * 100, // Em percentual
  };
}

/**
 * Calcular depreciação pelo método acelerado
 * Usa taxa anual aplicada proporcionalmente ao período
 * 
 * @param valorBem - Valor de aquisição do bem
 * @param taxaAnual - Taxa anual de depreciação (%)
 * @param periodoMeses - Período em meses para cálculo
 * @param valorResidual - Valor residual (opcional, padrão 0)
 * @returns Dados da depreciação calculada
 */
export function calcularDepreciacaoAcelerada(
  valorBem: number,
  taxaAnual: number,
  periodoMeses: number,
  valorResidual: number = 0
): DepreciationData {
  // Validações básicas
  if (valorBem <= 0 || taxaAnual <= 0) {
    return {
      depreciationExpense: 0,
      accumulatedDepreciation: 0,
      bookValue: valorBem,
      remainingLife: 0,
      depreciationRate: 0,
    };
  }

  // Converter taxa anual para mensal
  const taxaMensal = taxaAnual / 100 / 12;
  
  // Calcular valor depreciável
  const valorDepreciavel = valorBem - valorResidual;
  
  // Calcular depreciação acumulada usando método de saldo decrescente
  let valorContabil = valorBem;
  let depreciacaoAcumulada = 0;
  
  for (let mes = 0; mes < periodoMeses; mes++) {
    const depreciacaoMes = valorContabil * taxaMensal;
    
    // Não ultrapassar o valor residual
    if (valorContabil - depreciacaoMes < valorResidual) {
      break;
    }
    
    valorContabil -= depreciacaoMes;
    depreciacaoAcumulada += depreciacaoMes;
  }
  
  // Calcular depreciação do último mês
  const depreciacaoUltimoMes = valorContabil * taxaMensal;
  
  // Calcular vida útil estimada restante
  const vidaUtilEstimada = Math.log(valorResidual / valorBem) / Math.log(1 - taxaMensal);
  const vidaUtilRestante = Math.max(0, vidaUtilEstimada - periodoMeses);
  
  return {
    depreciationExpense: depreciacaoUltimoMes,
    accumulatedDepreciation: depreciacaoAcumulada,
    bookValue: Math.max(valorResidual, valorContabil),
    remainingLife: vidaUtilRestante,
    depreciationRate: taxaMensal * 100, // Em percentual mensal
  };
}

/**
 * Calcular valor residual do bem
 * Geralmente 10% do valor original para imóveis, 0% para outros
 * 
 * @param asset - Bem patrimonial
 * @returns Valor residual calculado
 */
export function calcularValorResidual(asset: Asset): number {
  if (asset.residualValue !== undefined) {
    return asset.residualValue;
  }

  // Padrão por categoria
  switch (asset.category) {
    case 'IMOVEIS':
      return asset.acquisitionValue * 0.1; // 10% para imóveis
    case 'VEICULOS':
      return asset.acquisitionValue * 0.2; // 20% para veículos
    default:
      return 0; // Sem valor residual para outros
  }
}

/**
 * Calcular vida útil restante em meses
 * 
 * @param asset - Bem patrimonial
 * @param dataReferencia - Data de referência para cálculo
 * @returns Vida útil restante em meses
 */
export function calcularVidaUtilRestante(
  asset: Asset,
  dataReferencia: string = new Date().toISOString()
): number {
  const dataAquisicao = new Date(asset.acquisitionDate);
  const dataRef = new Date(dataReferencia);
  
  // Calcular meses decorridos
  const mesesDecorridos = 
    (dataRef.getFullYear() - dataAquisicao.getFullYear()) * 12 +
    (dataRef.getMonth() - dataAquisicao.getMonth());
  
  // Calcular vida útil restante
  const vidaUtilRestante = asset.usefulLifeMonths - mesesDecorridos;
  
  return Math.max(0, vidaUtilRestante);
}

/**
 * Projetar depreciação futura para os próximos N meses
 * 
 * @param asset - Bem patrimonial
 * @param mesesProjecao - Número de meses para projetar
 * @param dataReferencia - Data de referência
 * @returns Array com projeção mês a mês
 */
export function projetarDepreciacaoFutura(
  asset: Asset,
  mesesProjecao: number,
  dataReferencia: string = new Date().toISOString()
): Array<{
  mes: number;
  ano: number;
  depreciacaoMes: number;
  depreciacaoAcumulada: number;
  valorContabil: number;
}> {
  const projecao: Array<{
    mes: number;
    ano: number;
    depreciacaoMes: number;
    depreciacaoAcumulada: number;
    valorContabil: number;
  }> = [];
  
  const dataRef = new Date(dataReferencia);
  const vidaUtilRestante = calcularVidaUtilRestante(asset, dataReferencia);
  const valorResidual = calcularValorResidual(asset);
  
  // Calcular depreciação atual
  let dadosAtuais: DepreciationData;
  
  if (asset.depreciationMethod === 'ACELERADA') {
    const mesesDecorridos = 
      (dataRef.getFullYear() - new Date(asset.acquisitionDate).getFullYear()) * 12 +
      (dataRef.getMonth() - new Date(asset.acquisitionDate).getMonth());
    
    dadosAtuais = calcularDepreciacaoAcelerada(
      asset.currentBookValue,
      asset.depreciationRate,
      0,
      valorResidual
    );
  } else {
    const mesesDecorridos = 
      (dataRef.getFullYear() - new Date(asset.acquisitionDate).getFullYear()) * 12 +
      (dataRef.getMonth() - new Date(asset.acquisitionDate).getMonth());
    
    dadosAtuais = calcularDepreciacaoLinear(
      asset.acquisitionValue,
      asset.usefulLifeMonths,
      mesesDecorridos,
      valorResidual
    );
  }
  
  let valorContabilAtual = asset.currentBookValue;
  let depreciacaoAcumuladaAtual = asset.accumulatedDepreciation;
  
  // Gerar projeção mês a mês
  for (let i = 1; i <= mesesProjecao && i <= vidaUtilRestante; i++) {
    const dataProjecao = new Date(dataRef);
    dataProjecao.setMonth(dataRef.getMonth() + i);
    
    // Calcular depreciação do mês
    let depreciacaoMes: number;
    
    if (asset.depreciationMethod === 'ACELERADA') {
      depreciacaoMes = valorContabilAtual * (asset.depreciationRate / 100 / 12);
    } else {
      depreciacaoMes = dadosAtuais.depreciationExpense;
    }
    
    // Não ultrapassar valor residual
    if (valorContabilAtual - depreciacaoMes < valorResidual) {
      depreciacaoMes = valorContabilAtual - valorResidual;
    }
    
    valorContabilAtual -= depreciacaoMes;
    depreciacaoAcumuladaAtual += depreciacaoMes;
    
    projecao.push({
      mes: dataProjecao.getMonth() + 1,
      ano: dataProjecao.getFullYear(),
      depreciacaoMes: parseFloat(depreciacaoMes.toFixed(2)),
      depreciacaoAcumulada: parseFloat(depreciacaoAcumuladaAtual.toFixed(2)),
      valorContabil: parseFloat(valorContabilAtual.toFixed(2)),
    });
  }
  
  return projecao;
}

/**
 * Gerar lançamento contábil de depreciação
 * 
 * @param depreciation - Registro de depreciação
 * @param contaDespesa - Conta de despesa de depreciação (Débito)
 * @param contaAtivo - Conta redutora do ativo (Crédito)
 * @returns Dados do lançamento contábil
 */
export function gerarLancamentoContabil(
  depreciation: AssetDepreciation,
  contaDespesa: string = '3.1.1.1',  // Despesa de depreciação
  contaAtivo: string = '1.1.1.2'     // Depreciação acumulada
): {
  debito: { conta: string; valor: number };
  credito: { conta: string; valor: number };
  documento: string;
  historico: string;
} {
  return {
    debito: {
      conta: contaDespesa,
      valor: depreciation.depreciationExpense,
    },
    credito: {
      conta: contaAtivo,
      valor: depreciation.depreciationExpense,
    },
    documento: depreciation.accountingEntry?.documentNumber || `DEP-${depreciation.referenceMonth.toString().padStart(2, '0')}/${depreciation.referenceYear}`,
    historico: `Depreciação mensal - ${depreciation.assetId} - ${depreciation.referenceMonth.toString().padStart(2, '0')}/${depreciation.referenceYear}`,
  };
}

/**
 * Calcular depreciação total de múltiplos bens
 * 
 * @param assets - Lista de bens patrimoniais
 * @param dataReferencia - Data de referência
 * @returns Total de depreciação e quantidade de bens
 */
export function calcularDepreciacaoTotal(
  assets: Asset[],
  dataReferencia: string = new Date().toISOString()
): {
  totalDepreciationMonth: number;
  totalAccumulatedDepreciation: number;
  totalBookValue: number;
  totalAssets: number;
  assetsFullyDepreciated: number;
} {
  let totalDepreciationMonth = 0;
  let totalAccumulatedDepreciation = 0;
  let totalBookValue = 0;
  let assetsFullyDepreciated = 0;
  
  assets.forEach(asset => {
    const valorResidual = calcularValorResidual(asset);
    const vidaUtilRestante = calcularVidaUtilRestante(asset, dataReferencia);
    
    let dadosDepreciacao: DepreciationData;
    
    if (asset.depreciationMethod === 'ACELERADA') {
      const mesesDecorridos = 
        (new Date(dataReferencia).getFullYear() - new Date(asset.acquisitionDate).getFullYear()) * 12 +
        (new Date(dataReferencia).getMonth() - new Date(asset.acquisitionDate).getMonth());
      
      dadosDepreciacao = calcularDepreciacaoAcelerada(
        asset.acquisitionValue,
        asset.depreciationRate,
        mesesDecorridos,
        valorResidual
      );
    } else {
      const mesesDecorridos = 
        (new Date(dataReferencia).getFullYear() - new Date(asset.acquisitionDate).getFullYear()) * 12 +
        (new Date(dataReferencia).getMonth() - new Date(asset.acquisitionDate).getMonth());
      
      dadosDepreciacao = calcularDepreciacaoLinear(
        asset.acquisitionValue,
        asset.usefulLifeMonths,
        mesesDecorridos,
        valorResidual
      );
    }
    
    totalDepreciationMonth += dadosDepreciacao.depreciationExpense;
    totalAccumulatedDepreciation += dadosDepreciacao.accumulatedDepreciation;
    totalBookValue += dadosDepreciacao.bookValue;
    
    if (vidaUtilRestante <= 0 || dadosDepreciacao.bookValue <= valorResidual) {
      assetsFullyDepreciated++;
    }
  });
  
  return {
    totalDepreciationMonth: parseFloat(totalDepreciationMonth.toFixed(2)),
    totalAccumulatedDepreciation: parseFloat(totalAccumulatedDepreciation.toFixed(2)),
    totalBookValue: parseFloat(totalBookValue.toFixed(2)),
    totalAssets: assets.length,
    assetsFullyDepreciated,
  };
}
