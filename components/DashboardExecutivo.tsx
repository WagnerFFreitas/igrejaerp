/**
 * ============================================================================
 * DASHBOARD EXECUTIVO
 * ============================================================================
 * Visão geral completa com todos os KPIs da igreja
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Briefcase, 
  Building2,
  Download,
  FileSpreadsheet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertCircle
} from 'lucide-react';
import { dbService } from '../services/databaseService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DashboardExecutivoProps {
  user?: any;
  currentUnitId?: string;
}

export const DashboardExecutivo: React.FC<DashboardExecutivoProps> = ({ 
  user, 
  currentUnitId = 'u-sede' 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [kpisFinanceiros, setKpisFinanceiros] = useState<any>(null);
  const [kpisMembros, setKpisMembros] = useState<any>(null);
  const [kpisRH, setKpisRH] = useState<any>(null);
  const [kpisPatrimonio, setKpisPatrimonio] = useState<any>(null);
  const [dadosGrafico, setDadosGrafico] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    carregarDados();
  }, [currentUnitId]);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Carregando dados do dashboard...");
      
      // Carregar todos os dados necessários
      const [t, m, e, a] = await Promise.all([
        dbService.getTransactions(currentUnitId),
        dbService.getMembers(currentUnitId),
        dbService.getEmployees(currentUnitId),
        dbService.getAssets(currentUnitId)
      ]);
      
      setTransactions(t);
      setMembers(m);
      setEmployees(e);
      setAssets(a);
      
      console.log("📊 Dados carregados:", { transactions: t.length, members: m.length, employees: e.length, assets: a.length });
      // Calcular KPIs financeiros reais
      const receitasTotais = transactions
        .filter(t => t.type === 'INCOME' && t.status === 'PAID')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const despesasTotais = transactions
        .filter(t => t.type === 'EXPENSE' && t.status === 'PAID')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const saldo = receitasTotais - despesasTotais;
      const margemLiquida = receitasTotais > 0 ? (saldo / receitasTotais) * 100 : 0;
      const ticketMedio = transactions.filter(t => t.status === 'PAID').length > 0 
        ? receitasTotais / transactions.filter(t => t.status === 'PAID').length 
        : 0;
      
      setKpisFinanceiros({
        receitasTotais,
        despesasTotais,
        saldo,
        margemLiquida: Math.round(margemLiquida * 100) / 100,
        ticketMedio: Math.round(ticketMedio * 100) / 100,
        saudeFinanceira: saldo > 0 ? 75 : 25,
        crescimentoReceitas: 0, // Calcular com período anterior
        tendencia: saldo > 0 ? 'alta' : 'baixa'
      });
      
      // Calcular KPIs de membros
      const totalMembros = members.length;
      const membrosAtivos = members.filter(m => m.status === 'ACTIVE').length;
      const crescimentoMembros = 0; // Calcular com período anterior
      const mediaContribuicao = totalMembros > 0 ? receitasTotais / totalMembros : 0;
      
      setKpisMembros({
        totalMembros,
        membrosAtivos,
        crescimentoMembros,
        taxaInadimplencia: 0, // Calcular baseado em dízimos pendentes
        mediaContribuicao: Math.round(mediaContribuicao * 100) / 100,
        porStatus: {
          ACTIVE: members.filter(m => m.status === 'ACTIVE').length,
          INACTIVE: members.filter(m => m.status === 'INACTIVE').length,
          PENDING: members.filter(m => m.status === 'PENDING').length
        },
        porDepartamento: {} // Calcular baseado nos ministérios dos membros
      });
      
      // Calcular KPIs de RH
      const totalFuncionarios = employees.length;
      const folhaMensal = employees
        .filter(e => e.status === 'ACTIVE')
        .reduce((sum, e) => sum + (e.salario_base || 0), 0);
      const mediaSalarial = totalFuncionarios > 0 ? folhaMensal / totalFuncionarios : 0;
      
      setKpisRH({
        totalFuncionarios,
        folhaMensal,
        turnover: 0, // Calcular baseado em histórico
        absenteismo: 0, // Calcular baseado em folhas de ponto
        porDepartamento: {}, // Agrupar por departamento
        mediaSalarial: Math.round(mediaSalarial * 100) / 100
      });
      
      // Calcular KPIs de patrimônio
      const totalBens = assets.length;
      const valorPatrimonialLiquido = assets
        .reduce((sum, a) => sum + (a.currentValue || a.purchaseValue || 0), 0);
      const valorOriginalTotal = assets
        .reduce((sum, a) => sum + (a.purchaseValue || 0), 0);
      const depreciacaoAcumulada = valorOriginalTotal - valorPatrimonialLiquido;
      
      setKpisPatrimonio({
        totalBens,
        valorPatrimonialLiquido,
        valorOriginalTotal,
        depreciacaoAcumulada,
        bensPorCategoria: { 'Móveis': 60, 'Eletrônicos': 40, 'Veículos': 20, 'Imóveis': 30 },
        valorPorCategoria: {},
        manutencoesPendentes: 5
      });

      // Gerar dados do gráfico com dados reais dos últimos 6 meses
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const dadosReceitas = [];
      const dadosDespesas = [];
      
      // Simular dados dos últimos 6 meses (em produção calcularia baseado nas transações)
      for (let i = 5; i >= 0; i--) {
        const dataMes = new Date();
        dataMes.setMonth(dataMes.getMonth() - i);
        
        const receitasMes = transactions
          .filter(t => t.type === 'INCOME' && t.status === 'PAID')
          .filter(t => {
            const dataTrans = new Date(t.date);
            return dataTrans.getMonth() === dataMes.getMonth() && 
                   dataTrans.getFullYear() === dataMes.getFullYear();
          })
          .reduce((sum, t) => sum + (t.amount || 0), 0);
          
        const despesasMes = transactions
          .filter(t => t.type === 'EXPENSE' && t.status === 'PAID')
          .filter(t => {
            const dataTrans = new Date(t.date);
            return dataTrans.getMonth() === dataMes.getMonth() && 
                   dataTrans.getFullYear() === dataMes.getFullYear();
          })
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        dadosReceitas.push(receitasMes || 0);
        dadosDespesas.push(despesasMes || 0);
      }
      
      setDadosGrafico({
        labels: meses,
        receitas: dadosReceitas,
        despesas: dadosDespesas
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getIconTendencia = (tendencia: 'alta' | 'baixa' | 'estavel') => {
    switch (tendencia) {
      case 'alta':
        return <ArrowUpRight className="text-emerald-500" size={20} />;
      case 'baixa':
        return <ArrowDownRight className="text-rose-500" size={20} />;
      default:
        return <Minus className="text-slate-500" size={20} />;
    }
  };

  const getCorSaudeFinanceira = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  const getLabelSaudeFinanceira = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Atenção';
    return 'Crítica';
  };

  const exportarBalancete = () => {
    alert('Funcionalidade será ativada quando Firebase for configurado!');
  };

  const exportarDRE = () => {
    alert('Funcionalidade será ativada quando Firebase for configurado!');
  };

  const exportarFluxoCaixa = () => {
    alert('Funcionalidade será ativada quando Firebase for configurado!');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Executivo</h1>
          <p className="text-slate-500 mt-1">Visão geral de desempenho da igreja</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={exportarBalancete}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-bold"
          >
            <FileText size={18} />
            Balancete PDF
          </button>
          <button
            onClick={exportarDRE}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-bold"
          >
            <FileSpreadsheet size={18} />
            DRE PDF
          </button>
          <button
            onClick={exportarFluxoCaixa}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-bold"
          >
            <Download size={18} />
            Fluxo Caixa Excel
          </button>
        </div>
      </div>

      {/* Saúde Financeira */}
      {kpisFinanceiros && (
        <div className={`rounded-2xl p-6 ${getCorSaudeFinanceira(kpisFinanceiros.saudeFinanceira)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-80">Saúde Financeira</p>
              <p className="text-5xl font-black mt-2">{kpisFinanceiros.saudeFinanceira}/100</p>
              <p className="text-lg font-bold mt-1">{getLabelSaudeFinanceira(kpisFinanceiros.saudeFinanceira)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold opacity-80">Tendência</p>
              <div className="flex items-center gap-2 mt-2">
                {getIconTendencia(kpisFinanceiros.tendencia)}
                <span className="text-2xl font-black capitalize">{kpisFinanceiros.tendencia}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Financeiro */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
            {kpisFinanceiros && getIconTendencia(kpisFinanceiros.tendencia)}
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Receitas</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {kpisFinanceiros ? formatarMoeda(kpisFinanceiros.receitasTotais) : '-'}
          </p>
          <p className="text-xs font-bold text-emerald-600 mt-2">
            +{kpisFinanceiros?.crescimentoReceitas.toFixed(1)}% vs período anterior
          </p>
        </div>

        {/* Despesas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-rose-600" size={24} />
            </div>
            {kpisFinanceiros && getIconTendencia(kpisFinanceiros.tendencia === 'alta' ? 'baixa' : 'alta')}
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Despesas</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {kpisFinanceiros ? formatarMoeda(kpisFinanceiros.despesasTotais) : '-'}
          </p>
          <p className="text-xs font-bold text-slate-400 mt-2">
            Margem: {kpisFinanceiros?.margemLiquida.toFixed(1)}%
          </p>
        </div>

        {/* Membros */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Users className="text-indigo-600" size={24} />
            </div>
            {kpisMembros && <ArrowUpRight className="text-emerald-500" size={20} />}
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Membros</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {kpisMembros ? kpisMembros.totalMembros : '-'}
          </p>
          <p className="text-xs font-bold text-slate-400 mt-2">
            Ativos: {kpisMembros?.membrosAtivos}
          </p>
        </div>

        {/* Patrimônio */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Building2 className="text-amber-600" size={24} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Patrimônio</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {kpisPatrimonio ? formatarMoeda(kpisPatrimonio.valorPatrimonialLiquido) : '-'}
          </p>
          <p className="text-xs font-bold text-slate-400 mt-2">
            {kpisPatrimonio?.totalBens} bens cadastrados
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução Receitas vs Despesas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-900 mb-4">Evolução Financeira</h3>
          {dadosGrafico && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGrafico.labels.map((label: string, i: number) => ({
                mes: label,
                receitas: dadosGrafico.receitas[i],
                despesas: dadosGrafico.despesas[i]
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value: number) => `R$ ${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => formatarMoeda(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />

              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Composição de Membros */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-900 mb-4">Membros por Status</h3>
          {kpisMembros && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(kpisMembros.porStatus).map(([status, quantidade]) => ({
                    name: status,
                    value: quantidade
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.keys(kpisMembros.porStatus).map((_, index) => {
                    const cores = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];
                    return <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />;
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* RH e Departamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPIs RH */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black text-slate-900">Indicadores de RH</h3>
          </div>
          {kpisRH && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Total Funcionários</span>
                <span className="text-lg font-black text-slate-900">{kpisRH.totalFuncionarios}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Folha Mensal</span>
                <span className="text-lg font-black text-slate-900">{formatarMoeda(kpisRH.folhaMensal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Turnover</span>
                <span className="text-lg font-black text-slate-900">{kpisRH.turnover.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Absenteísmo</span>
                <span className="text-lg font-black text-slate-900">{kpisRH.absenteismo.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Patrimônio por Categoria */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="text-amber-600" size={24} />
            <h3 className="text-lg font-black text-slate-900">Patrimônio por Categoria</h3>
          </div>
          {kpisPatrimonio && (
            <div className="space-y-3">
              {Object.entries(kpisPatrimonio.bensPorCategoria).map(([categoria, quantidade]) => (
                <div key={categoria} className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">{categoria}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(quantidade as number / kpisPatrimonio.totalBens) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-slate-900 w-8 text-right">{String(quantidade)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alertas */}
      {kpisMembros && kpisMembros.taxaInadimplencia > 20 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="text-rose-600" size={20} />
          <div>
            <p className="font-black text-rose-900">Atenção: Taxa de Inadimplência Elevada</p>
            <p className="text-sm text-rose-700 mt-1">
              {kpisMembros.taxaInadimplencia.toFixed(1)}% dos membros estão inadimplentes. Considere ações de recuperação.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
