/**
 * ============================================================================
 * REPORTS SERVICE
 * ============================================================================
 * Geração de relatórios e analytics avançados
 * ============================================================================
 */

import { getFirestore, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Transaction, Member, Payroll, Asset } from '../types';
import { analyticsService } from './analyticsService';
import { exportService } from './exportService';

export const reportsService = {
  db: getFirestore(),

  /**
   * ==========================================================================
   * RELATÓRIO 1: BALANCETE FINANCEIRO
   * ==========================================================================
   */

  async gerarBalancete(
    unitId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<{
    receitas: any[];
    despesas: any[];
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
    porCategoria: Record<string, { receitas: number; despesas: number }>;
  }> {
    const transactionsRef = collection(this.db, 'transactions');
    const q = query(
      transactionsRef,
      where('unitId', '==', unitId)
    );
    
    const snapshot = await getDocs(q);
    const transactions: Transaction[] = [];
    snapshot.forEach(doc => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });

    // Filtrar por período
    const filtrados = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= dataInicio && date <= dataFim;
    });

    // Separar receitas e despesas
    const receitas = filtrados
      .filter(t => t.tipo_transacao === 'INCOME' || t.type === 'INCOME')
      .map(t => ({
        data: new Date(t.data_transacao || t.date).toLocaleDateString('pt-BR'),
        descricao: t.descricao || t.description,
        categoria: t.categoria || t.category,
        valor: t.valor ?? t.amount
      }));

    const despesas = filtrados
      .filter(t => t.tipo_transacao === 'EXPENSE' || t.type === 'EXPENSE')
      .map(t => ({
        data: new Date(t.data_transacao || t.date).toLocaleDateString('pt-BR'),
        descricao: t.descricao || t.description,
        categoria: t.categoria || t.category,
        valor: t.valor ?? t.amount
      }));

    const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
    const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
    const saldo = totalReceitas - totalDespesas;

    // Agrupar por categoria
    const porCategoria: Record<string, { receitas: number; despesas: number }> = {};
    
    receitas.forEach(r => {
      if (!porCategoria[r.categoria]) {
        porCategoria[r.categoria] = { receitas: 0, despesas: 0 };
      }
      porCategoria[r.categoria].receitas += r.valor;
    });

    despesas.forEach(d => {
      if (!porCategoria[d.categoria]) {
        porCategoria[d.categoria] = { receitas: 0, despesas: 0 };
      }
      porCategoria[d.categoria].despesas += d.valor;
    });

    return {
      receitas,
      despesas,
      totalReceitas,
      totalDespesas,
      saldo,
      porCategoria
    };
  },

  /**
   * ==========================================================================
   * RELATÓRIO 2: DRE GERENCIAL
   * ==========================================================================
   */

  async gerarDRE(
    unitId: string,
    periodo: string
  ): Promise<{
    receitaBruta: number;
    deducoes: number;
    receitaLiquida: number;
    custoServicos: number;
    lucroBruto: number;
    despesasAdministrativas: number;
    resultadoOperacional: number;
    outrasReceitasDespesas: number;
    resultadoLiquido: number;
  }> {
    // Em produção, buscar dados reais do Firebase
    // Aqui vamos usar dados simulados baseados no analytics
    
    const kpis = await analyticsService.getKPIsFinanceiros(unitId);
    
    // Simulação de DRE (em produção seria mais detalhado)
    const receitaBruta = kpis.receitasTotais;
    const deducoes = receitaBruta * 0.05; // 5% estimativa
    const receitaLiquida = receitaBruta - deducoes;
    const custoServicos = kpis.despesasTotais * 0.6; // 60% custos diretos
    const lucroBruto = receitaLiquida - custoServicos;
    const despesasAdministrativas = kpis.despesasTotais * 0.4; // 40% despesas admin
    const resultadoOperacional = lucroBruto - despesasAdministrativas;
    const outrasReceitasDespesas = 0; // Simplificado
    const resultadoLiquido = resultadoOperacional + outrasReceitasDespesas;

    return {
      receitaBruta,
      deducoes,
      receitaLiquida,
      custoServicos,
      lucroBruto,
      despesasAdministrativas,
      resultadoOperacional,
      outrasReceitasDespesas,
      resultadoLiquido
    };
  },

  /**
   * ==========================================================================
   * RELATÓRIO 3: FLUXO DE CAIXA
   * ==========================================================================
   */

  async gerarFluxoCaixa(
    unitId: string,
    diasProjecao: number = 30
  ): Promise<{
    lancamentosDiarios: any[];
    saldoAcumulado: number;
    projecao: number[];
    mediaEntradas: number;
    mediaSaidas: number;
  }> {
    const transactionsRef = collection(this.db, 'transactions');
    const q = query(transactionsRef, where('unitId', '==', unitId));
    const snapshot = await getDocs(q);
    
    const transactions: Transaction[] = [];
    snapshot.forEach(doc => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });

    // Agrupar por dia (últimos 30 dias)
    const ultimos30Dias = new Date();
    ultimos30Dias.setDate(ultimos30Dias.getDate() - 30);

    const lancamentosPorDia: Record<string, { entradas: number; saidas: number }> = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      if (date >= ultimos30Dias) {
        const dataStr = date.toLocaleDateString('pt-BR');
        if (!lancamentosPorDia[dataStr]) {
          lancamentosPorDia[dataStr] = { entradas: 0, saidas: 0 };
        }
        if (t.type === 'INCOME') {
          lancamentosPorDia[dataStr].entradas += t.amount;
        } else {
          lancamentosPorDia[dataStr].saidas += t.amount;
        }
      }
    });

    // Converter para array
    const lancamentosDiarios = Object.entries(lancamentosPorDia)
      .map(([data, valores]) => ({
        data,
        historico: `Movimentações do dia`,
        entradas: valores.entradas,
        saidas: valores.saidas,
        saldo: valores.entradas - valores.saidas
      }))
      .sort((a, b) => new Date(a.data.split('/').reverse().join('-')).getTime() - new Date(b.data.split('/').reverse().join('-')).getTime());

    // Calcular saldo acumulado
    let saldoAcumulado = 0;
    lancamentosDiarios.forEach(l => {
      saldoAcumulado += l.saldo;
      l.saldo = saldoAcumulado;
    });

    // Calcular médias diárias
    const totalDias = Object.keys(lancamentosPorDia).length || 1;
    const totalEntradas = lancamentosDiarios.reduce((sum, l) => sum + l.entradas, 0);
    const totalSaidas = lancamentosDiarios.reduce((sum, l) => sum + l.saidas, 0);
    const mediaEntradas = totalEntradas / totalDias;
    const mediaSaidas = totalSaidas / totalDias;

    // Gerar projeção
    const projecao = [];
    let saldoProjecao = saldoAcumulado;
    for (let i = 0; i < diasProjecao; i++) {
      saldoProjecao += mediaEntradas - mediaSaidas;
      projecao.push(saldoProjecao);
    }

    return {
      lancamentosDiarios,
      saldoAcumulado,
      projecao,
      mediaEntradas,
      mediaSaidas
    };
  },

  /**
   * ==========================================================================
   * RELATÓRIO 4: CONTRIBUIÇÕES DE MEMBROS
   * ==========================================================================
   */

  async gerarRelatorioContribuicoes(
    unitId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<{
    contribuicoes: any[];
    totalContribuicoes: number;
    totalMembros: number;
    mediaContribuicao: number;
    topContribuintes: any[];
  }> {
    const membersRef = collection(this.db, 'members');
    const q = query(membersRef, where('unitId', '==', unitId));
    const snapshot = await getDocs(q);
    
    const members: Member[] = [];
    snapshot.forEach(doc => {
      members.push({ id: doc.id, ...doc.data() } as Member);
    });

    // Filtrar membros com contribuições no período (simplificado - em produção buscar histórico)
    const contribuicoes = members
      .filter(m => m.situacao === 'ATIVO' || m.status === 'ACTIVE')
      .map(m => ({
        nome: m.nome || m.name,
        departamento: m.ministerio_principal || m.mainMinistry || 'N/A',
        ultimaContribuicao: 'N/A',
        totalContribuicoes: 0
      }));

    const totalContribuicoes = contribuicoes.reduce((sum, c) => sum + c.totalContribuicoes, 0);
    const totalMembros = members.length;
    const mediaContribuicao = totalMembros > 0 ? totalContribuicoes / totalMembros : 0;

    // Top 10 contribuintes
    const topContribuintes = contribuicoes
      .sort((a, b) => b.totalContribuicoes - a.totalContribuicoes)
      .slice(0, 10)
      .map((c, index) => ({
        posicao: index + 1,
        nome: c.nome,
        total: `R$ ${c.totalContribuicoes.toFixed(2)}`
      }));

    return {
      contribuicoes,
      totalContribuicoes,
      totalMembros,
      mediaContribuicao,
      topContribuintes
    };
  },

  /**
   * ==========================================================================
   * RELATÓRIO 5: PATRIMÔNIO
   * ==========================================================================
   */

  async gerarRelatorioPatrimonio(
    unitId: string
  ): Promise<{
    inventario: any[];
    resumo: any;
  }> {
    const kpis = await analyticsService.getKPIsPatrimonio(unitId);
    
    const assetsRef = collection(this.db, 'assets');
    const q = query(assetsRef, where('unitId', '==', unitId));
    const snapshot = await getDocs(q);
    
    const assets: Asset[] = [];
    snapshot.forEach(doc => {
      assets.push({ id: doc.id, ...doc.data() } as Asset);
    });

    const inventario = assets.map(a => ({
      numeroPatrimonio: a.numero_ativo || a.assetNumber,
      descricao: a.descricao || a.description,
      categoria: a.categoria || a.category,
      valorOriginal: `R$ ${a.valor_aquisicao?.toFixed(2) || a.acquisitionValue?.toFixed(2) || '0.00'}`,
      depreciacaoAcumulada: `R$ ${(a.depreciacao_acumulada || a.accumulatedDepreciation || 0).toFixed(2)}`,
      valorLiquido: `R$ ${((a.valor_aquisicao || a.acquisitionValue || 0) - (a.depreciacao_acumulada || a.accumulatedDepreciation || 0)).toFixed(2)}`,
      status: a.situacao || a.status,
      localizacao: a.localizacao || a.location
    }));

    const resumo = {
      totalBens: kpis.totalBens,
      valorOriginalTotal: `R$ ${kpis.valorOriginalTotal.toFixed(2)}`,
      depreciacaoAcumulada: `R$ ${kpis.depreciacaoAcumulada.toFixed(2)}`,
      valorPatrimonialLiquido: `R$ ${kpis.valorPatrimonialLiquido.toFixed(2)}`,
      bensPorCategoria: kpis.bensPorCategoria
    };

    return {
      inventario,
      resumo
    };
  },

  /**
   * ==========================================================================
   * EXPORTAÇÃO DE RELATÓRIOS
   * ==========================================================================
   */

  async exportarBalancetePDF(
    unitId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<void> {
    const balancete = await this.gerarBalancete(unitId, dataInicio, dataFim);
    const periodo = `${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')}`;
    
    await exportService.exportarBalancetePDF(
      balancete.receitas,
      balancete.despesas,
      periodo
    );
  },

  async exportarDREPDF(
    unitId: string,
    periodo: string
  ): Promise<void> {
    const dreData = await this.gerarDRE(unitId, periodo);
    await exportService.exportarDREPDF(dreData, periodo);
  },

  async exportarFluxoCaixaExcel(
    unitId: string,
    diasProjecao: number = 30
  ): Promise<void> {
    const fluxoCaixa = await this.gerarFluxoCaixa(unitId, diasProjecao);
    await exportService.exportarFluxoCaixaExcel(fluxoCaixa.lancamentosDiarios, fluxoCaixa.projecao);
  }
};
