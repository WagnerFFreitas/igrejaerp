/**
 * ============================================================================
 * ANALYTICS SERVICE
 * ============================================================================
 * Serviços de análise de dados e business intelligence
 * ============================================================================
 */

import { getFirestore, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Transaction, Member, Payroll, Asset } from '../types';
import {
  calcularCrescimentoPercentual,
  calcularMargemLiquida,
  calcularTicketMedio,
  calcularSaudeFinanceira,
  calcularValorPatrimonialLiquido,
  agruparPorCategoria,
  detectarTendencia,
  calcularYoY
} from '../utils/kpiCalculations';

export const analyticsService = {
  db: getFirestore(),

  /**
   * ==========================================================================
   * KPIs FINANCEIROS
   * ==========================================================================
   */

  async getKPIsFinanceiros(unitId: string): Promise<{
    receitasTotais: number;
    despesasTotais: number;
    saldo: number;
    margemLiquida: number;
    ticketMedio: number;
    saudeFinanceira: number;
    crescimentoReceitas: number;
    tendencia: 'alta' | 'baixa' | 'estavel';
  }> {
    const transactionsRef = collection(this.db, 'transactions');
    
    // Buscar todas transações da unidade
    const q = query(transactionsRef, where('unitId', '==', unitId));
    const snapshot = await getDocs(q);
    
    const transactions: Transaction[] = [];
    snapshot.forEach(doc => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });

    // Calcular receitas e despesas
    const receitasTotais = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const despesasTotais = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const saldo = receitasTotais - despesasTotais;
    const margemLiquida = calcularMargemLiquida(receitasTotais, despesasTotais);
    const ticketMedio = calcularTicketMedio(receitasTotais, transactions.filter(t => t.type === 'INCOME').length);

    // Saúde financeira (simplificado - em produção buscaria reservas e dívidas)
    const saudeFinanceira = calcularSaudeFinanceira(receitasTotais, despesasTotais, saldo * 0.3, 0);

    // Tendência
    const receitasPorMes = this.agruparReceitasPorMes(transactions);
    const tendencia = detectarTendencia(receitasPorMes);

    // Crescimento (comparando últimos 3 meses com anteriores)
    const crescimentoReceitas = this.calcularCrescimentoReceitas(receitasPorMes);

    return {
      receitasTotais,
      despesasTotais,
      saldo,
      margemLiquida,
      ticketMedio,
      saudeFinanceira,
      crescimentoReceitas,
      tendencia
    };
  },

  /**
   * ==========================================================================
   * KPIs DE MEMBROS
   * ==========================================================================
   */

  async getKPIsMembros(unitId: string): Promise<{
    totalMembros: number;
    membrosAtivos: number;
    crescimentoMembros: number;
    taxaInadimplencia: number;
    mediaContribuicao: number;
    porStatus: Record<string, number>;
    porDepartamento: Record<string, number>;
  }> {
    const membersRef = collection(this.db, 'members');
    const q = query(membersRef, where('unitId', '==', unitId));
    const snapshot = await getDocs(q);
    
    const members: Member[] = [];
    snapshot.forEach(doc => {
      members.push({ id: doc.id, ...doc.data() } as Member);
    });

    const totalMembros = members.length;
    const membrosAtivos = members.filter(m => m.status === 'ACTIVE').length;
    const crescimentoMembros = 5.2; // Simplificado - calcular baseado em período anterior
    
    // Taxa de inadimplência (simplificado - em produção buscar histórico de contribuições)
    const membrosInadimplentes = 0;
    const taxaInadimplencia = totalMembros > 0 ? (membrosInadimplentes / totalMembros) * 100 : 0;

    // Média de contribuição (simplificado)
    const contribuicoesTotais = 0;
    const mediaContribuicao = totalMembros > 0 ? contribuicoesTotais / totalMembros : 0;

    // Agrupar por status
    const porStatus = members.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Agrupar por ministério principal
    const porDepartamento = members.reduce((acc, m) => {
      const dept = m.mainMinistry || 'Sem departamento';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMembros,
      membrosAtivos,
      crescimentoMembros,
      taxaInadimplencia,
      mediaContribuicao,
      porStatus,
      porDepartamento
    };
  },

  /**
   * ==========================================================================
   * KPIs DE RH
   * ==========================================================================
   */

  async getKPIsRH(unitId: string): Promise<{
    totalFuncionarios: number;
    folhaMensal: number;
    turnover: number;
    absenteismo: number;
    porDepartamento: Record<string, number>;
    mediaSalarial: number;
  }> {
    const employeesRef = collection(this.db, 'payroll/employees');
    const q = query(employeesRef, where('unitId', '==', unitId));
    const snapshot = await getDocs(q);
    
    const employees: Payroll[] = [];
    snapshot.forEach(doc => {
      employees.push({ id: doc.id, ...doc.data() } as Payroll);
    });

    const totalFuncionarios = employees.length;
    const folhaMensal = employees.reduce((sum, e) => sum + (e.salario_base || 0), 0);
    const mediaSalarial = totalFuncionarios > 0 ? folhaMensal / totalFuncionarios : 0;

    // Turnover (simplificado)
    const funcionariosDesligados = employees.filter(e => e.status === 'INACTIVE').length;
    const turnover = calcularCrescimentoPercentual(funcionariosDesligados, totalFuncionarios);

    // Absenteísmo (simplificado)
    const absenteismo = 2.5; // Valor exemplo - em produção calcular baseado em faltas

    // Por departamento
    const porDepartamento = employees.reduce((acc, e) => {
      const dept = e.departamento || 'Não definido';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFuncionarios,
      folhaMensal,
      turnover,
      absenteismo,
      porDepartamento,
      mediaSalarial
    };
  },

  /**
   * ==========================================================================
   * KPIs DE PATRIMÔNIO
   * ==========================================================================
   */

  async getKPIsPatrimonio(unitId: string): Promise<{
    totalBens: number;
    valorPatrimonialLiquido: number;
    valorOriginalTotal: number;
    depreciacaoAcumulada: number;
    bensPorCategoria: Record<string, number>;
    valorPorCategoria: Record<string, number>;
    manutencoesPendentes: number;
  }> {
    const assetsRef = collection(this.db, 'patrimonio/assets');
    const q = query(assetsRef, where('unitId', '==', unitId));
    const snapshot = await getDocs(q);
    
    const assets: any[] = [];
    snapshot.forEach(doc => {
      assets.push({ id: doc.id, ...doc.data() });
    });

    const totalBens = assets.length;
    const valorOriginalTotal = assets.reduce((sum, a) => sum + (a.acquisitionValue || 0), 0);
    const depreciacaoAcumulada = assets.reduce((sum, a) => sum + (a.accumulatedDepreciation || 0), 0);
    const valorPatrimonialLiquido = calcularValorPatrimonialLiquido(assets as Asset[]);

    // Bens por categoria
    const bensPorCategoria = assets.reduce((acc, a) => {
      const category = a.category || 'Outros';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Valor por categoria
    const valorPorCategoria = assets.reduce((acc, a) => {
      const category = a.category || 'Outros';
      acc[category] = (acc[category] || 0) + (a.acquisitionValue || 0);
      return acc;
    }, {} as Record<string, number>);

    // Manutenções pendentes (simplificado)
    const manutencoesPendentes = 0;

    return {
      totalBens,
      valorPatrimonialLiquido,
      valorOriginalTotal,
      depreciacaoAcumulada,
      bensPorCategoria,
      valorPorCategoria,
      manutencoesPendentes
    };
  },

  /**
   * ==========================================================================
   * MÉTODOS AUXILIARES
   * ==========================================================================
   */

  agruparReceitasPorMes(transactions: Transaction[]): number[] {
    const receitasPorMes = new Array(12).fill(0);
    
    transactions
      .filter(t => t.type === 'INCOME')
      .forEach(t => {
        const date = new Date(t.date);
        const mes = date.getMonth();
        receitasPorMes[mes] += t.amount;
      });

    return receitasPorMes;
  },

  calcularCrescimentoReceitas(receitasPorMes: number[]): number {
    if (receitasPorMes.length < 6) return 0;
    
    const mediaUltimos3 = receitasPorMes.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const mediaAnteriores3 = receitasPorMes.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    
    return calcularCrescimentoPercentual(mediaUltimos3, mediaAnteriores3);
  },

  gerarDadosGraficoLinhas(receitas: number[], despesas: number[]): any {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return {
      labels: meses,
      datasets: [
        {
          label: 'Receitas',
          data: receitas
        },
        {
          label: 'Despesas',
          data: despesas
        }
      ]
    };
  }
};
